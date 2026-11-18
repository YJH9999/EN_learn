#!/usr/bin/env bash
# =============================================================================
# upload-releases.sh —— 把 release 目录里的历史 APK 全部传到 GitHub Releases
#
#   方式一（推荐，令牌不落在命令历史里）：
#     双击仓库根目录的 upload-releases.cmd，按提示粘贴令牌
#
#   方式二：
#     GITHUB_TOKEN=ghp_xxx bash tools/upload-releases.sh
#     APK_DIR="/d/User Tools/背单词工坊/release" GITHUB_TOKEN=... bash tools/upload-releases.sh
#
# 令牌要求：对 YJH9999/EN_learn 有「写入代码/Contents: Read and write」权限。
# 已经存在同名 tag 的版本会自动跳过，可重复执行、断点续传。
# =============================================================================
set -uo pipefail

REPO="YJH9999/EN_learn"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APK_DIR="${APK_DIR:-D:/User Tools/背单词工坊/release}"
TOKEN="${GITHUB_TOKEN:-}"
API="https://api.github.com/repos/$REPO"

# 也支持把令牌写进仓库根目录的 .token（已在 .gitignore 中，不会提交）
if [ -z "$TOKEN" ] && [ -f "$HERE/.token" ]; then
  TOKEN="$(tr -d ' \r\n\t' < "$HERE/.token")"
fi

if [ -z "$TOKEN" ]; then
  echo "✗ 请先设置 GITHUB_TOKEN（GitHub 个人访问令牌）" >&2
  exit 1
fi
if [ ! -d "$APK_DIR" ]; then
  echo "✗ 找不到 APK 目录：$APK_DIR" >&2
  exit 1
fi

# URL 编码（文件名含中文/空格时必须）
urlenc() {
  python -c "import sys,urllib.parse as u;sys.stdout.write(u.quote(sys.argv[1]))" "$1" 2>/dev/null \
    || printf '%s' "$1" | sed -e 's/ /%20/g'
}

auth=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")

# --- 0. 先验令牌，避免 47 次失败刷屏 -----------------------------------------
who=$(curl -s -m 25 "${auth[@]}" https://api.github.com/user)
login=$(printf '%s' "$who" | sed -n 's/.*"login": *"\([^"]*\)".*/\1/p')
if [ -z "$login" ]; then
  echo "✗ 令牌无效或已过期。请重新生成（需勾选 repo / Contents 读写）。" >&2
  echo "  服务器返回：$(printf '%s' "$who" | head -c 160)" >&2
  exit 1
fi

# --- 1. 收集并按版本号升序（先建旧版，最新版自然排在最上面且成为 Latest）----
list=$(mktemp)
for f in "$APK_DIR"/*.apk "$APK_DIR"/*.APK; do
  [ -f "$f" ] || continue
  base="$(basename "$f")"
  ver="$(printf '%s' "$base" | sed -n 's/.*[vV]\([0-9][0-9.]*\)\.[aA][pP][kK]$/\1/p')"
  [ -z "$ver" ] && continue
  printf '%s\t%s\n' "$ver" "$f" >> "$list"
done
total=$(wc -l < "$list" | tr -d ' ')

echo "→ 账号：$login"
echo "→ 仓库：$REPO"
echo "→ 安装包：$total 个（$APK_DIR）"
[ "$total" = "0" ] && { echo "✗ 目录里没有可识别的 APK"; exit 1; }
echo

ok=0; skip=0; fail=0
while IFS=$'\t' read -r ver path; do
  base="$(basename "$path")"
  tag="v$ver"

  code=$(curl -s -o /dev/null -w '%{http_code}' -m 25 "${auth[@]}" "$API/releases/tags/$tag")
  if [ "$code" = "200" ]; then
    echo "· $tag 已发布，跳过"
    skip=$((skip + 1)); continue
  fi

  printf '→ %s（%s）创建 release ... ' "$tag" "$base"
  resp=$(curl -s -m 60 -X POST "${auth[@]}" -H "Content-Type: application/json" "$API/releases" \
    -d "{\"tag_name\":\"$tag\",\"name\":\"Token $tag\",\"body\":\"Token 背单词工坊 $tag 安装包（包名 com.cheri.token）\",\"draft\":false,\"prerelease\":false}")
  upload=$(printf '%s' "$resp" | sed -n 's/.*"upload_url": *"\([^"{]*\).*/\1/p')
  if [ -z "$upload" ]; then
    echo "失败"
    echo "   $(printf '%s' "$resp" | head -c 200)"
    fail=$((fail + 1)); continue
  fi
  echo "ok"

  size=$(( $(wc -c < "$path" | tr -d ' ') / 1024 / 1024 ))
  printf '  上传 %s（%s MB）... ' "$base" "$size"
  ucode=$(curl -s --retry 2 --retry-delay 3 -m 900 -o /dev/null -w '%{http_code}' \
    -X POST "${auth[@]}" -H "Content-Type: application/vnd.android.package-archive" \
    --data-binary @"$path" "$upload?name=$(urlenc "$base")")
  if [ "$ucode" = "201" ] || [ "$ucode" = "200" ]; then
    echo "完成"; ok=$((ok + 1))
  else
    echo "失败（HTTP $ucode）"; fail=$((fail + 1))
  fi
done < <(sort -V -k1,1 "$list")
rm -f "$list"

echo
echo "✓ 新上传 $ok 个，跳过 $skip 个，失败 $fail 个"
echo "  https://github.com/$REPO/releases"
[ "$fail" -gt 0 ] && { echo "  失败的版本可再跑一次本脚本，会自动跳过已完成的。"; exit 2; }
exit 0
