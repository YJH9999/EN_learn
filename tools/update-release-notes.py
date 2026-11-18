#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把已有 Release 的说明批量换成「简练更新要点」。

- 说明由 tools/gen-release-body.py 从 app.js 的 CHANGELOG 生成
- 内容一致时跳过（幂等，可反复运行）
- 用法：
    python tools/update-release-notes.py           # 全部
    python tools/update-release-notes.py --dry     # 只看会改什么，不提交
    python tools/update-release-notes.py 3.2.3     # 只改指定版本
"""
import json
import os
import subprocess
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REPO = 'YJH9999/EN_learn'
API = 'https://api.github.com/repos/' + REPO


def token():
    t = os.environ.get('GITHUB_TOKEN', '').strip()
    if t:
        return t
    f = os.path.join(ROOT, '.token')
    if os.path.exists(f):
        return open(f, encoding='utf-8').read().strip()
    sys.exit('缺少令牌：设置 GITHUB_TOKEN 或写入 .token')


TOK = token()


def req(url, method='GET', data=None):
    body = json.dumps(data).encode() if data is not None else None
    r = urllib.request.Request(url, method=method, data=body, headers={
        'Authorization': 'Bearer ' + TOK,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'token-release-notes',
    })
    return json.load(urllib.request.urlopen(r, timeout=40))


def all_releases():
    out = []
    for page in (1, 2, 3):
        d = req('%s/releases?per_page=100&page=%d' % (API, page))
        if not d:
            break
        out += d
    return out


def body_for(ver):
    p = subprocess.run([sys.executable, os.path.join(HERE, 'gen-release-body.py'), ver],
                       capture_output=True, text=True, encoding='utf-8')
    return (p.stdout or '').strip()


def main():
    args = sys.argv[1:]
    dry = '--dry' in args
    only = [a for a in args if not a.startswith('-')]

    rels = all_releases()
    changed = same = 0
    for r in rels:
        tag = r['tag_name']
        ver = tag.lstrip('v')
        if only and ver not in only:
            continue
        new = body_for(ver)
        if not new:
            print('· %s 无对应日志，跳过' % tag)
            continue
        if (r.get('body') or '').strip() == new:
            same += 1
            continue
        head = new.splitlines()[0]
        if dry:
            print('[dry] %s → %s' % (tag, head))
        else:
            req('%s/releases/%d' % (API, r['id']), 'PATCH', {'body': new})
            print('✓ %s → %s' % (tag, head))
        changed += 1

    print('\n更新 %d 个 / 已是最新 %d 个 / 共 %d 个' % (changed, same, len(rels)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
