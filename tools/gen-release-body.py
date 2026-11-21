#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
由 app.js 的 CHANGELOG 生成 Release 说明（简练版）。

用法：
  python tools/gen-release-body.py 3.2.1          # 打印该版本的说明
  python tools/gen-release-body.py --all          # 打印全部版本（调试用）

输出格式：
  本次更新：<要点串联>
  · <要点 1>
  · <要点 2>
  · <要点 3>
  vX.Y.Z · com.cheri.token · 覆盖安装不影响学习记录
"""
import io
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP_JS = os.environ.get('APP_JS', r'D:/User Tools/背单词工坊/app.js')


def load_changelog(app_js=APP_JS):
    """返回 {版本: {'title': str, 'items': [str]}}，保持文件中的顺序。"""
    src = io.open(app_js, encoding='utf-8').read()
    start = src.index('const CHANGELOG = [')
    end = src.index('\n];', start)
    block = src[start:end]
    out = {}
    order = []
    for chunk in re.split(r'\n  \{\n', block)[1:]:
        mv = re.search(r"v: '([^']+)'", chunk)
        if not mv:
            continue
        ver = mv.group(1)
        mt = re.search(r"title: '([^']*)'", chunk)
        items = re.findall(r"^      '((?:[^'\\]|\\.)*)',?$", chunk, re.M)
        items = [i.replace("\\'", "'") for i in items]
        out[ver] = {'title': (mt.group(1) if mt else ''), 'items': items}
        order.append(ver)
    return out, order


def brief(text, limit=56):
    """去掉括号补充，过长时在标点处断开 —— 让每行保持一句短话。"""
    t = re.sub(r'（[^）]*）|\([^)]*\)', '', text)
    t = re.sub(r'\s+', ' ', t).strip().rstrip('；;，,。')
    if len(t) <= limit:
        return t
    head = t[:limit]
    cut = max(head.rfind(ch) for ch in '，；、：,;')
    if cut >= 10:
        return t[:cut] + '…'
    return head + '…'


def body_for(ver, changelog=None):
    if changelog is None:
        changelog, _ = load_changelog()
    # 早期版本在日志里合并为 1.x
    entry = changelog.get(ver)
    if entry is None and ver.startswith('1.'):
        entry = changelog.get('1.x')
    if entry is None:
        # 日志里没有这个版本：给一句中性说明，不要留空
        return '本次更新：小幅修复与细节优化\n\nv%s · com.cheri.token · 覆盖安装不影响学习记录' % ver

    title = entry['title'] or '常规更新'
    if ver.startswith('1.') and title == '历史版本':
        title = '首个版本与 1.x 系列功能'
    lines = ['本次更新：' + title, '']
    picks = [brief(x) for x in entry['items'][:3] if x.strip()]
    for p in picks:
        lines.append('· ' + p)
    if picks:
        lines.append('')
    lines.append('v%s · com.cheri.token · 覆盖安装不影响学习记录' % ver)
    # v3.2.3 起安装包统一命名 Token-v<version>.apk，给一条国内加速直链（浏览器里直接能下）
    nums = [int(x) for x in re.findall(r'\d+', ver)[:3]]
    while len(nums) < 3:
        nums.append(0)
    if tuple(nums) >= (3, 2, 3):
        lines.append('国内加速下载：https://gh-proxy.com/https://github.com/YJH9999/EN_learn'
                     '/releases/download/v%s/Token-v%s.apk' % (ver, ver))
    return '\n'.join(lines)


def main():
    args = [a for a in sys.argv[1:] if a]
    if not args or args[0] in ('-h', '--help'):
        print(__doc__)
        return 0
    changelog, order = load_changelog()
    if args[0] == '--all':
        for v in order:
            print('=' * 60)
            print(body_for(v, changelog))
        return 0
    print(body_for(args[0], changelog))
    return 0


if __name__ == '__main__':
    sys.exit(main())
