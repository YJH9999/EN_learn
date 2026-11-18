#!/usr/bin/env bash
# =============================================================================
# upload-releases.sh —— 把 release 目录里的 APK 传到 GitHub Releases
#
#   双击仓库根目录的 upload-releases.cmd（推荐，按提示粘令牌）
#   GITHUB_TOKEN=ghp_xxx bash tools/upload-releases.sh
#   bash tools/upload-releases.sh --force     # 同名安装包已存在时重新上传（覆盖）
#
# 令牌要求：对 YJH9999/EN_learn 有 Contents: Read and write。
# 已发布且安装包已存在的版本自动跳过，可重复执行、断点续传。
# =============================================================================
set -uo pipefail

REPO="YJH9999/EN_learn"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APK_DIR="${APK_DIR:-D:/User Tools/背单词工坊/release}"
TOKEN="${GITHUB_TOKEN:-}"
API="https://api.github.com/repos/$REPO"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

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
jget() { python -c "import sys,json;d=json.load(sys.stdin);print(d.get('$1',''))" 2>/dev/null; }

auth=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")

# --- 0. 先验令牌，避免几十次失败刷屏 -----------------------------------------
who=$(curl -s -m 25 "${auth[@]}" https://api.github.com/user)
login=$(printf '%s' "$who" | sed -n 's/.*"login": *"\([^"]*\)".*/\1/p')
if [ -z "$login" ]; then
  echo "✗ 令牌无效或已过期。请重新生成（需 Contents 读写）。" >&2
  echo "  服务器返回：$(printf '%s' "$who" | head -c 160)" >&2
  exit 1
fi

# --- 1. 收集并按版本号升序（先建旧版，最新版自然排最上面并成为 Latest）------
list=$(mktemp)
for f in "$APK_DIR"/*.apk; do
  [ -f "$f" ] || continue
  base="$(basename "$f")"
  ver="$(printf '%s' "$base" | sed -n 's/.*[vV]\([0-9][0-9.]*\)\.[aA][pP][kK]$/\1/p')"
  [ -z "$ver" ] && continue
  printf '%s\t%s\n' "$ver" "$f" >> "$list"
done
total=$(wc -l < "$list" | tr -d ' ')

echo "→ 账号：$login"
echo "→ 仓库：$REPO"
echo "→ 安装包：$total 个（$APK_DIR）$([ "$FORCE" = "1" ] && echo '· --force 覆盖模式')"
[ "$total" = "0" ] && { echo "✗ 目录里没有可识别的 APK"; exit 1; }
echo

ok=0; skip=0; fail=0
while IFS=$'\t' read -r ver path; do
  base="$(basename "$path")"
  tag="v$ver"
  upload=""

  code=$(curl -s -o /dev/null -w '%{http_code}' -m 25 "${auth[@]}" "$API/releases/tags/$tag")
  if [ "$code" = "200" ]; then
    # 已存在：取其 upload_url，并检查同名安装包是否已上传
    rel=$(curl -s -m 25 "${auth[@]}" "$API/releases/tags/$tag")
    upload=$(printf '%s' "$rel" | jget upload_url | sed 's/{.*//')
    # 注意：GitHub 会改写资产名（中文/空格不可靠），所以只判断「是否已有 .apk」
    has=$(printf '%s' "$rel" | python -c "
import sys,json
d=json.load(sys.stdin)
print('1' if any(str(a.get('name','')).lower().endswith('.apk') for a in d.get('assets',[])) else '0')
" 2>/dev/null)
    if [ "$has" = "1" ] && [ "$FORCE" = "0" ]; then
      echo "· $tag 已发布且有安装包，跳过"
      skip=$((skip + 1)); continue
    fi
    if [ "$has" = "1" ] && [ "$FORCE" = "1" ]; then
      echo "→ $tag 覆盖旧安装包 ..."
      ids=$(printf '%s' "$rel" | python -c "
import sys,json
d=json.load(sys.stdin)
print(' '.join(str(a['id']) for a in d.get('assets',[]) if str(a.get('name','')).lower().endswith('.apk')))
" 2>/dev/null)
      for id in $ids; do
        curl -s -m 30 -X DELETE "${auth[@]}" "$API/releases/assets/$id" -o /dev/null
      done
    else
      echo "→ $tag 已存在，补传安装包 ..."
    fi
    if [ -z "$upload" ]; then
      echo "  ✗ 取不到上传地址，跳过"; fail=$((fail + 1)); continue
    fi
  else
    printf '→ %s（%s）创建 release ... ' "$tag" "$base"
    # Release 说明取自 VERSIONS.md 的「本次重点」，App 内的更新弹层会直接显示这段
    note=$(grep -m1 "^| v$ver |" "$HERE/VERSIONS.md" 2>/dev/null | awk -F'|' '{gsub(/^ +| +$/, "", $4); print $4}')
    body="Token 背单词工坊 $tag 安装包（包名 com.cheri.token）"
    [ -n "$note" ] && body="本次更新：$note

安装包 $tag · 包名 com.cheri.token · 覆盖安装不影响学习记录"
    payload=$(python -c "
import json,sys
print(json.dumps({'tag_name':sys.argv[1],'name':'Token '+sys.argv[1],
                  'body':sys.argv[2],'draft':False,'prerelease':False}, ensure_ascii=False))
" "$tag" "$body")
    resp=$(curl -s -m 60 -X POST "${auth[@]}" -H "Content-Type: application/json" "$API/releases" -d "$payload")
    upload=$(printf '%s' "$resp" | sed -n 's/.*"upload_url": *"\([^"{]*\).*/\1/p')
    if [ -z "$upload" ]; then
      echo "失败"
      echo "   $(printf '%s' "$resp" | head -c 200)"
      fail=$((fail + 1)); continue
    fi
    echo "ok"
  fi

  size=$(( $(wc -c < "$path" | tr -d ' ') / 1024 / 1024 ))
  printf '  上传 %s（%s MB）... ' "$base" "$size"
  ucode=$(curl -s --retry 2 --retry-delay 3 -m 900 -o /dev/null -w '%{http_code}' \
    -X POST "${auth[@]}" -H "Content-Type: application/vnd.android.package-archive" \
    --data-binary @"$path" "$upload?name=$(urlenc "Token-v$ver.apk")")
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
[ "$fail" -gt 0 ] && { echo "  失败的版本可再跑一次本脚本，会自动补传。"; exit 2; }
exit 0
