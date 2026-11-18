#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""从主工程 app.js 的 CHANGELOG 生成 VERSIONS.md（publish.sh 会自动调用）

用法：python tools/gen-versions.py <app.js 路径> <输出 md 路径>
"""
import io
import re
import sys

REPO = "YJH9999/EN_learn"


def main(src, out):
    s = io.open(src, encoding="utf-8").read()
    start = s.index("const CHANGELOG = [")
    end = s.index("\n];", start)
    items = re.findall(r"v: '([^']+)',\s*date: '([^']+)',\s*title: '([^']*)'", s[start:end])

    lines = [
        "# 版本历史",
        "",
        "网页端与 Android 安装包使用同一套版本号。安装包托管在本仓库的 **Releases** 页面（见下方链接），",
        "源码即本仓库当前 `main` 分支。",
        "",
        "| 版本 | 日期 | 本次重点 |",
        "| --- | --- | --- |",
    ]
    for v, d, t in items:
        lines.append("| v%s | %s | %s |" % (v, d, t))
    lines += [
        "",
        "## 安装包下载",
        "",
        "- 最新版：<https://github.com/%s/releases/latest>" % REPO,
        "- 全部版本：<https://github.com/%s/releases>" % REPO,
        "",
        "> APK 包名统一为 `com.cheri.token`，versionCode = 主版本×10000 + 次版本×100 + 修订号"
        "（例如 v3.2.1 → 30201）。",
    ]
    io.open(out, "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")
    print("→ VERSIONS.md 已更新（%d 个版本）" % len(items))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法：python tools/gen-versions.py <app.js> <VERSIONS.md>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
