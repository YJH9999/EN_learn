/* =========================================================================
 * Token · 云端账户与同步引擎（v3.2.0）
 *  - Supabase Auth：邮箱密码登录 / 注册 / 邮箱验证码登录
 *  - 数据同步：整份快照 upsert 到 token_sync 表（RLS 限制只能读写自己那行）
 *  - 冲突策略：远端更新且本机无改动 → 拉取；本机有改动 → 合并后上传；
 *              首次登录且两端都有数据 → 交给 UI 让用户三选一
 * 依赖：lib/supabase.js（UMD，暴露全局 supabase）
 * ========================================================================= */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://vgdtbnypvamsgpwmmnye.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Y448FC-dVLIHajn8iIfWlw_XuazubUI';
  const TABLE = 'token_sync';
  const META_KEY = 'wr_sync_meta';
  const DEVICE_KEY = 'wr_device_id';

  let client = null;
  let opts = null;          // { getSnapshot, applySnapshot, mergeSnapshot, hasLocalData, toast, onChange }
  let initPromise = null;
  let pushTimer = 0;
  let conflictResolve = null;

  const state = {
    ready: false,
    user: null,            // { id, email }
    syncing: false,
    dirty: false,
    auto: true,
    online: typeof navigator !== 'undefined' ? navigator.onLine !== false : true,
    lastSyncAt: 0,         // 最近一次成功同步的快照 client_updated_at
    lastSyncTime: 0,       // 最近一次成功同步的本地时间戳
    lastMutationAt: 0,     // 最近一次本机改动时间（判断上传期间是否有新改动）
    error: '',
    remotePending: null,   // 首次登录冲突时暂存的远端数据
  };

  // ---------- 本地元数据 ----------
  function loadMeta() {
    try {
      const m = JSON.parse(localStorage.getItem(META_KEY) || '{}');
      if (m && typeof m === 'object') {
        state.lastSyncAt = Number(m.lastSyncAt) || 0;
        state.lastSyncTime = Number(m.lastSyncTime) || 0;
        state.dirty = !!m.dirty;
        state.auto = m.auto !== false;
      }
    } catch (e) { /* 忽略损坏的元数据 */ }
  }
  function saveMeta() {
    try {
      localStorage.setItem(META_KEY, JSON.stringify({
        userId: state.user ? state.user.id : null,
        lastSyncAt: state.lastSyncAt,
        lastSyncTime: state.lastSyncTime,
        dirty: state.dirty,
        auto: state.auto,
      }));
    } catch (e) { /* 忽略写入失败 */ }
  }
  function deviceId() {
    let id = '';
    try { id = localStorage.getItem(DEVICE_KEY) || ''; } catch (e) { id = ''; }
    if (!id) {
      id = 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem(DEVICE_KEY, id); } catch (e) { /* ignore */ }
    }
    return id;
  }

  // ---------- 状态广播 ----------
  function emit(extra) {
    const payload = Object.assign({}, state, extra || {});
    try { if (opts && opts.onChange) opts.onChange(payload); } catch (e) { /* 忽略 UI 异常 */ }
  }

  // ---------- 错误文案 ----------
  function zhError(err) {
    const raw = (err && (err.message || err.error_description || err.msg)) || '';
    const m = String(raw);
    if (!m) return '操作失败，请稍后再试';
    if (/Invalid login credentials/i.test(m)) return '邮箱或密码不正确';
    if (/Email not confirmed/i.test(m)) return '邮箱还未验证，请先到邮箱点确认链接';
    if (/User already registered/i.test(m)) return '该邮箱已注册，请直接登录';
    if (/Password should be at least/i.test(m)) return '密码至少 6 位';
    if (/invalid format|Unable to validate email/i.test(m)) return '邮箱格式不正确';
    if (/For security purposes|rate limit|too many requests/i.test(m)) return '请求太频繁，请稍等一分钟再试';
    if (/Token has expired|invalid.*token|otp.*expired/i.test(m)) return '验证码无效或已过期';
    if (/Failed to fetch|NetworkError|network request failed/i.test(m)) return '网络连接失败，请检查网络后重试';
    if (/relation .* does not exist|Could not find the table/i.test(m)) return '云端数据表还不存在：请先在 Supabase 里执行建表 SQL';
    if (/row-level security|new row violates/i.test(m)) return '云端权限不足：请确认建表 SQL 里的 RLS 策略已执行';
    if (/Signups? not allowed|signup is disabled/i.test(m)) return '该邮箱还没有注册过账号，请先去注册';
    if (/User not found|Email not found|user.*does not exist/i.test(m)) return '该邮箱还没有注册过账号，请先注册';
    if (/JWT expired|invalid claim/i.test(m)) return '登录已过期，请重新登录';
    return m.length > 90 ? m.slice(0, 90) + '…' : m;
  }

  // ---------- 客户端与登录态 ----------
  function ensureClient() {
    if (client) return client;
    const SB = window.supabase;
    if (!SB || typeof SB.createClient !== 'function') {
      throw new Error('未找到 supabase 客户端库（lib/supabase.js）');
    }
    client = SB.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,     // WebView / 本地文件里没有可解析的回调地址
        storageKey: 'token-auth',
        storage: window.localStorage,
      },
      global: { headers: { 'x-token-device': deviceId() } },
    });
    return client;
  }

  function mapUser(session) {
    if (!session || !session.user) return null;
    return { id: session.user.id, email: session.user.email || '' };
  }

  async function restoreSession() {
    try {
      const { data } = await client.auth.getSession();
      state.user = mapUser(data && data.session);
    } catch (e) {
      state.user = null;
    }
    state.ready = true;
    emit();
  }

  function bindAuthEvents() {
    client.auth.onAuthStateChange((event, session) => {
      const prev = state.user && state.user.id;
      state.user = mapUser(session);
      if (state.user && state.user.id !== prev) {
        // 换了账号：本机的「已同步位点」作废，避免错误判断远近
        if (prev !== state.user.id) {
          state.lastSyncAt = 0;
          state.lastSyncTime = 0;
          state.dirty = opts && opts.hasLocalData ? !!opts.hasLocalData() : false;
        }
        saveMeta();
        emit();
        if (event === 'SIGNED_IN') afterSignIn();
      } else if (!state.user) {
        emit();
      }
    });
  }

  // ---------- 远端读写 ----------
  async function fetchRemote() {
    const { data, error } = await client
      .from(TABLE)
      .select('payload, client_updated_at, updated_at')
      .eq('user_id', state.user.id)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }

  async function pushSnapshot() {
    const startedAt = Date.now();
    const payload = opts.getSnapshot();
    const ts = startedAt;
    payload.clientUpdatedAt = ts;
    const row = {
      user_id: state.user.id,
      payload,
      client_updated_at: ts,
      device: deviceId(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from(TABLE).upsert(row, { onConflict: 'user_id' });
    if (error) throw error;
    state.lastSyncAt = ts;
    state.lastSyncTime = Date.now();
    // 上传期间用户又改了数据 → 仍标记为待上传，稍后再传一次
    state.dirty = (state.lastMutationAt || 0) > startedAt;
    state.error = '';
    saveMeta();
    emit();
    if (state.dirty && state.auto) {
      if (pushTimer) clearTimeout(pushTimer);
      pushTimer = setTimeout(() => { pushTimer = 0; pushSnapshot().catch(() => {}); }, 2500);
    }
    return ts;
  }

  async function applyRemote(remote) {
    opts.applySnapshot(remote.payload || {});
    state.lastSyncAt = Number(remote.client_updated_at) || 0;
    state.lastSyncTime = Date.now();
    state.lastMutationAt = 0;
    state.dirty = false;
    state.error = '';
    saveMeta();
    emit();
  }

  // ---------- 冲突：首次登录两端都有数据 ----------
  function askConflict(remote) {
    state.remotePending = remote;
    emit({ conflict: true });
    return new Promise(resolve => { conflictResolve = resolve; });
  }

  async function resolveConflict(choice) {
    const remote = state.remotePending;
    state.remotePending = null;
    if (conflictResolve) { conflictResolve(); conflictResolve = null; }
    if (!remote) return { ok: false, message: '没有待处理的云端记录' };
    try {
      if (choice === 'cloud') {
        await applyRemote(remote);
        return { ok: true, message: '已用云端数据覆盖本机' };
      }
      if (choice === 'merge') {
        opts.mergeSnapshot(remote.payload || {});
        state.dirty = true;
        await pushSnapshot();
        return { ok: true, message: '本机与云端数据已合并' };
      }
      state.dirty = true;
      await pushSnapshot();
      return { ok: true, message: '已用本机数据覆盖云端' };
    } catch (e) {
      state.error = zhError(e);
      emit();
      return { ok: false, message: state.error };
    }
  }

  // ---------- 登录后首次对齐 ----------
  async function afterSignIn() {
    if (!state.user || !client) return;
    try {
      emit({ syncing: true });
      state.syncing = true;
      const remote = await fetchRemote();
      if (!remote) {
        // 云端空 → 把本机数据传上去
        if (opts.hasLocalData && opts.hasLocalData()) await pushSnapshot();
      } else if (state.lastSyncAt === 0 && opts.hasLocalData && opts.hasLocalData()) {
        // 这台设备从没同步过，且云端已有记录、本机也有数据 → 让用户选
        await askConflict(remote);
      } else {
        state.syncing = false;
        emit();
        await syncNow({ reason: 'login' });
        return;
      }
    } catch (e) {
      state.error = zhError(e);
      if (/does not exist|Could not find the table/i.test(String(e && e.message))) state.error = zhError(e);
    } finally {
      state.syncing = false;
      emit();
    }
  }

  // ---------- 常规同步 ----------
  async function syncNow(opt) {
    if (!state.user) return { ok: false, message: '请先登录' };
    if (!state.online) return { ok: false, message: '当前没有网络连接' };
    if (state.syncing) return { ok: false, message: '正在同步中，请稍候' };
    state.syncing = true;
    state.error = '';
    emit();
    try {
      const remote = await fetchRemote();
      const remoteTs = remote ? Number(remote.client_updated_at) || 0 : 0;
      if (!remote) {
        await pushSnapshot();
        return { ok: true, message: '已上传到云端' };
      }
      if (remoteTs > state.lastSyncAt) {
        if (!state.dirty) {
          await applyRemote(remote);
          return { ok: true, message: '已从云端更新' };
        }
        // 两端都有新改动 → 合并后上传，避免任一侧丢数据
        opts.mergeSnapshot(remote.payload || {});
        state.dirty = true;
        await pushSnapshot();
        return { ok: true, message: '已合并本机与云端改动' };
      }
      if (state.dirty) {
        await pushSnapshot();
        return { ok: true, message: '已同步到云端' };
      }
      state.lastSyncTime = Date.now();
      saveMeta();
      emit();
      return { ok: true, message: '已是最新' };
    } catch (e) {
      state.error = zhError(e);
      emit();
      return { ok: false, message: state.error };
    } finally {
      state.syncing = false;
      emit();
    }
  }

  // ---------- 强制用云端覆盖本机 ----------
  async function pullForce() {
    if (!state.user) return { ok: false, message: '请先登录' };
    if (!state.online) return { ok: false, message: '当前没有网络连接' };
    if (state.syncing) return { ok: false, message: '正在同步中，请稍候' };
    state.syncing = true;
    state.error = '';
    emit();
    try {
      const remote = await fetchRemote();
      if (!remote) {
        await pushSnapshot();
        return { ok: true, message: '云端还没有记录，已把本机数据上传' };
      }
      await applyRemote(remote);
      return { ok: true, message: '已用云端数据恢复本机' };
    } catch (e) {
      state.error = zhError(e);
      emit();
      return { ok: false, message: state.error };
    } finally {
      state.syncing = false;
      emit();
    }
  }

  // ---------- 本地改动 → 延迟上传 ----------
  function markDirty() {
    state.dirty = true;
    state.lastMutationAt = Date.now();
    saveMeta();
    if (!state.user || !state.auto || !state.online) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      pushTimer = 0;
      pushSnapshot().catch(e => {
        state.error = zhError(e);
        emit();
      });
    }, 4000);
  }

  // ---------- 登录操作 ----------
  async function signIn(email, password) {
    try {
      ensureClient();
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { ok: true };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  async function signUp(email, password) {
    try {
      ensureClient();
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;
      // 项目开启「Confirm email」时不会直接返回 session
      if (data && data.session) return { ok: true, signedIn: true };
      return { ok: true, signedIn: false, message: '验证邮件已发送，请到邮箱点确认链接后再登录' };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  async function sendCode(email) {
    try {
      ensureClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      return { ok: true, message: '验证码已发送，请查收邮箱' };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  async function verifyCode(email, token) {
    try {
      ensureClient();
      const { error } = await client.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      return { ok: true };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  // v3.2.1：忘记密码 —— 给已注册邮箱发验证码（不自动建号）
  async function resetPassword(email) {
    try {
      ensureClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      return { ok: true, message: '验证码已发送，请查收邮箱' };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  // v3.2.1：校验验证码 → 立即换成新密码（成功后即处于登录态）
  async function confirmReset(email, token, newPassword) {
    try {
      ensureClient();
      const { error: e1 } = await client.auth.verifyOtp({ email, token, type: 'email' });
      if (e1) throw e1;
      const { error: e2 } = await client.auth.updateUser({ password: newPassword });
      if (e2) throw e2;
      return { ok: true, message: '密码已重设，已自动登录' };
    } catch (e) {
      return { ok: false, message: zhError(e) };
    }
  }

  async function signOut() {
    try {
      if (pushTimer) { clearTimeout(pushTimer); pushTimer = 0; }
      if (client && state.user) {
        // 退出前尽力把本地改动传上去（失败也不阻塞退出）
        if (state.dirty) { try { await pushSnapshot(); } catch (e) { /* ignore */ } }
        await client.auth.signOut();
      }
    } catch (e) { /* 忽略网络异常，本地登录态已清 */ }
    state.user = null;
    state.lastSyncAt = 0;
    state.lastSyncTime = 0;
    state.dirty = false;
    state.error = '';
    saveMeta();
    emit();
    return { ok: true };
  }

  // ---------- 初始化 ----------
  function init(options) {
    if (initPromise) return initPromise;
    opts = options;
    loadMeta();
    initPromise = (async () => {
      try {
        ensureClient();
        await restoreSession();
        bindAuthEvents();
        window.addEventListener('online', () => { state.online = true; emit(); if (state.user && state.dirty) syncNow({ reason: 'online' }); });
        window.addEventListener('offline', () => { state.online = false; emit(); });
        // 启动时静默对齐一次（延迟，避开首屏）
        if (state.user) setTimeout(() => { syncNow({ reason: 'startup' }); }, 2200);
      } catch (e) {
        state.error = zhError(e);
        state.ready = true;
        emit();
      }
      return state;
    })();
    return initPromise;
  }

  // 回到前台时如果距上次同步超过 45 秒，拉一次
  function handleResume() {
    if (!state.user || state.syncing || !state.online) return;
    if (Date.now() - state.lastSyncTime < 45000) return;
    syncNow({ reason: 'resume' });
  }

  function setAuto(on) {
    state.auto = !!on;
    saveMeta();
    emit();
  }

  window.TokenSync = {
    init,
    signIn,
    signUp,
    sendCode,
    verifyCode,
    resetPassword,
    confirmReset,
    signOut,
    syncNow,
    pullForce,
    markDirty,
    handleResume,
    setAuto,
    resolveConflict,
    getState: () => Object.assign({}, state),
    isConfigured: () => !!(SUPABASE_URL && SUPABASE_KEY),
    config: { url: SUPABASE_URL, table: TABLE },
  };
})();
