-- =============================================================================
-- Token · 云端同步初始化脚本（v3.2.0）
-- 用法：Supabase 控制台 → 左侧 SQL Editor → New query → 粘贴全部内容 → Run
-- 作用：创建 token_sync 表（每人一行整份快照）+ 行级安全策略（只能读写自己的数据）
-- 可重复执行：表/策略/触发器都做了 if not exists / drop if exists 保护
-- =============================================================================

create table if not exists public.token_sync (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  payload           jsonb not null default '{}'::jsonb,   -- 整份快照：设置/进度/词书/资料…
  client_updated_at bigint not null default 0,             -- 客户端写入时间（毫秒），用于判断新旧
  device            text,                                  -- 最后写入的设备标识（排查用）
  updated_at        timestamptz not null default now()
);

comment on table public.token_sync is 'Token 背单词 App 的用户数据快照（每个账号一行）';

-- 行级安全：每个人只能碰自己那一行
alter table public.token_sync enable row level security;

drop policy if exists "token_sync_select_own" on public.token_sync;
create policy "token_sync_select_own" on public.token_sync
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "token_sync_insert_own" on public.token_sync;
create policy "token_sync_insert_own" on public.token_sync
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "token_sync_update_own" on public.token_sync;
create policy "token_sync_update_own" on public.token_sync
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "token_sync_delete_own" on public.token_sync;
create policy "token_sync_delete_own" on public.token_sync
  for delete to authenticated
  using (auth.uid() = user_id);

-- 只给已登录用户授权（匿名用户拿不到任何权限）
grant select, insert, update, delete on public.token_sync to authenticated;

-- updated_at 由服务端维护
create or replace function public.touch_token_sync()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_token_sync_touch on public.token_sync;
create trigger trg_token_sync_touch
  before insert or update on public.token_sync
  for each row execute function public.touch_token_sync();

-- 校验：应返回 0 行（RLS 生效时未登录看不到任何数据）
-- select count(*) from public.token_sync;
