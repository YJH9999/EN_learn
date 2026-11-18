#!/usr/bin/env bash
# =============================================================================
# publish.sh —— 把主工程（背单词工坊）的网页源码同步到本仓库并推送
#
#   bash tools/publish.sh             // 复制 → 提交 → 推送
#   bash tools/publish.sh --no-push   // 只复制 + 提交
#   APP_SRC="/d/other/path" bash tools/publish.sh
#
# 只同步运行所需文件：index.html / app.js / styles.css / sync.js / data / lib
# =============================================================================
set -e

SRC="${APP_SRC:-D:/User Tools/背单词工坊}"
DEST="$(cd "$(dirname "$0")/.." && pwd)"
PUSH=1
[ "$1" = "--no-push" ] && PUSH=0

if [ ! -f "$SRC/app.js" ]; then
  echo "✗ 找不到主工程：$SRC（可用 APP_SRC=... 指定）" >&2
  exit 1
fi

VER="$(grep -oP "const APP_VERSION = '\K[0-9.]+" "$SRC/app.js" | head -1)"
echo "→ 同步 v${VER:-unknown} 到 $DEST"

cp "$SRC/index.html" "$SRC/app.js" "$SRC/styles.css" "$SRC/sync.js" "$SRC/supabase-setup.sql" "$DEST/"
mkdir -p "$DEST/data" "$DEST/lib"
cp "$SRC/data/words.js" "$SRC/data/courses.js" "$SRC/data/logo.png" "$DEST/data/"
cp "$SRC/lib/supabase.js" "$SRC/lib/xlsx.full.min.js" "$DEST/lib/"

# 版本历史表：随 CHANGELOG 自动更新（没装 python 就跳过）
if command -v python >/dev/null 2>&1; then
  python "$DEST/tools/gen-versions.py" "$SRC/app.js" "$DEST/VERSIONS.md" || true
fi

cd "$DEST"
git add -A
if git diff --cached --quiet; then
  echo "→ 没有改动，跳过提交"
else
  git commit -m "release: v${VER:-update}"
  echo "✓ 已提交 v${VER:-update}"
fi

if [ "$PUSH" = "1" ]; then
  echo "→ 推送到 origin/main ..."
  if ! git push -u origin main; then
    echo "→ 代理不通，改用直连重试 ..."
    env -u https_proxy -u HTTPS_PROXY -u http_proxy -u HTTP_PROXY git push -u origin main
  fi
  echo "✓ 已推送"
fi
