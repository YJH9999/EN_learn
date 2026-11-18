# Token · 背单词工坊（网页版）

一个纯前端的背单词工作台：内置 CET-4/6 等词库，支持学习卡片（艾宾浩斯复习）、速记、课程单元背诵、测验、词库管理与学习统计；数据默认存在浏览器本地，登录后可云端同步。

- 网页版地址：直接在浏览器打开 `index.html`（或本地起一个静态服务器，见下）
- Android 安装包：见 [Releases](https://github.com/YJH9999/EN_learn/releases)
- 历史版本清单：[VERSIONS.md](VERSIONS.md)

## 本地运行

```bash
# 任选一种静态服务器（不要用 file:// 打开，fetch data/*.js 与本地存储行为会不一致）
python -m http.server 8080
# 然后浏览器访问 http://127.0.0.1:8080/index.html
```

## 目录结构

```
/index.html            单页应用骨架（所有视图都在这一份 HTML 里）
/app.js                全部业务逻辑（词库、复习算法、渲染、设置、同步钩子）
/styles.css            全部样式（含移动端 / 平板断点、深浅色主题）
/sync.js               云端账户与同步（Supabase 客户端封装，可选）
/supabase-setup.sql    云端建表脚本（token_sync 表 + 行级安全策略）
/data/words.js         内置词库
/data/courses.js       课程（教材单元）数据
/lib/supabase.js       Supabase JS SDK（UMD 版，本地引入，不走 CDN）
/lib/xlsx.full.min.js  Excel 导入解析
/tools/                维护脚本（同步源码、发布到 GitHub）
```

## 云端同步（可选）

不登录也能完全离线使用。想启用同步：

1. 在 [Supabase](https://supabase.com) 新建项目，SQL Editor 里执行 `supabase-setup.sql`；
2. Authentication → 关闭 Confirm email（否则注册后要先去邮箱点确认链接）；
3. 想让「忘记密码」的验证码邮件带 6 位数字，需在 Authentication → Emails 的 Magic Link 模板里加上 `{{ .Token }}`；
4. 把项目 URL 与 publishable key 填进 `sync.js` 顶部的 `SUPABASE_URL` / `SUPABASE_KEY`。

同步策略：本机有改动则合并后上传，云端更新且本机干净则拉取覆盖，两端都有数据时首次登录可三选一（云端 / 合并 / 本机）。

## 同步源码到本仓库

网页源码以 `D:\User Tools\背单词工坊` 为主工程，本仓库是它的发布副本。更新流程：

```bash
bash tools/publish.sh            # 复制 → 提交 → 推送（一条命令走完）
bash tools/publish.sh --no-push  # 只复制 + 提交，稍后自己推送
```

`tools/publish.sh` 只同步真正运行需要的文件（`index.html` / `app.js` / `styles.css` / `sync.js` / `data/` / `lib/`），不会带上 `node_modules`、`release/`、教材照片等无关内容。

## 发布安装包（APK → Releases）

安装包体积大，不进 git 仓库，改走 Releases。`D:\User Tools\背单词工坊\release` 里的 45 个历史 APK（约 464MB）一次性传完即可，以后每发一版再跑一次。

**第一步：生成令牌（只需做一次）**

1. GitHub 右上角头像 → **Settings** → 左栏最下方 **Developer settings**
2. **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
3. Token name 随便填（如 `token-release-upload`），Expiration 选 7 天
4. Repository access 选 **Only select repositories** → 只勾 `YJH9999/EN_learn`
5. Permissions → Repository permissions → **Contents** 设为 **Read and write**（其余保持 No access）
6. **Generate token** → 复制那串 `github_pat_...`（离开页面就再也看不到了）

> 也可以用 Tokens (classic)，勾一个 `repo` 就够，但 classic 令牌权限更大，用完记得删。

**第二步：上传**

- 双击仓库根目录的 **`upload-releases.cmd`**，粘贴令牌回车，等它跑完（464MB，看网速大概十几分钟）；
- 或者命令行：`GITHUB_TOKEN=xxx bash tools/upload-releases.sh`。

已发布过的 tag 会自动跳过，中断了再跑一次能接着传。传完在 <https://github.com/YJH9999/EN_learn/releases> 查看。
