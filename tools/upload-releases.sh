#!/usr/bin/env bash
# =============================================================================
# upload-releases.sh —— 把 release 目录里的历史 APK 全部传到 GitHub Releases
#
#   GITHUB_TOKEN=ghp_xxx bash tools/upload-releases.sh
#   APK_DIR="/d/User Tools/背单词工坊/release" GITHUB_TOKEN=... bash tools/upload-releases.sh
#
# Token 需要 repo 权限（GitHub → Settings → Developer settings → Personal access tokens）。
# 已经存在同名 tag 的版本会自动跳过，可重复执行。
# =============================================================================
set -e

REPO="YJH9999/EN_learn"
APK_DIR="${APK_DIR:-D:/User Tools/背单词工坊/release}"
TOKEN="${GITHUB_TOKEN:-}"
API="https://api.github.com/repos/$REPO"

if [ -z "$TOKEN" ]; then
  echo "✗ 请先设置 GITHUB_TOKEN（GitHub 个人访问令牌，需 repo 权限）" >&2
  exit 1
fi
if [ ! -d "$APK_DIR" ]; then
  echo "✗ 找不到 APK 目录：$APK_DIR" >&2
  exit 1
fi

auth=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")

echo "→ 仓库：$REPO"
echo "→ APK 目录：$APK_DIR"

for f in "$APK_DIR"/*.apk; do
  [ -f "$f" ] || continue
  base="$(basename "$f")"
  ver="$(printf '%s' "$base" | sed -n 's/.*v\([0-9][0-9.]*\)\.apk/\1/p')"
  [ -z "$ver" ] && { echo "· 跳过（文件名无版本号）：$base"; continue; }
  tag="v$ver"

  # tag 已存在就跳过
  code=$(curl -s -o /dev/null -w '%{http_code}' "${auth[@]}" "$API/releases/tags/$tag")
  if [ "$code" = "200" ]; then
    echo "· $tag 已发布，跳过"
    continue
  fi

  echo "→ 创建 release $tag ..."
  resp=$(curl -s -X POST "${auth[@]}" "$API/releases" \
    -d "{\"tag_name\":\"$tag\",\"name\":\"Token $tag\",\"body\":\"Token 背单词工坊 $tag 安装包（包名 com.cheri.token）\",\"draft\":false,\"prerelease\":false}")
  upload=$(printf '%s' "$resp" | sed -n 's/.*"upload_url": "\([^"{]*\).*/\1/p')
  if [ -z "$upload" ]; then
    echo "  ✗ 创建失败：$(printf '%s' "$resp" | head -c 200)"
    continue
  fi

  size=$(wc -c < "$f" | tr -d ' ')
  echo "  上传 $base（$((size / 1024 / 1024)) MB）..."
  curl -s -X POST "${auth[@]}" -H "Content-Type: application/vnd.android.package-archive" \
    --data-binary @"$f" "$upload?name=$base" -o /dev/null
  echo "  ✓ $tag 完成"
done

echo "✓ 全部处理完毕：https://github.com/$REPO/releases"
