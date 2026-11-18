#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
当 git push 被网络阻断时，用 GitHub 的 Git Data API 把本地提交「等价」地提交上去。

api.github.com 通常仍可直连（git 走的 github.com:443 常被重置），所以：
  1) 取远程 main 的 commit / tree
  2) 把本地 HEAD 与远程之间差异的文件，逐个上传为 blob（原始字节，不经换行转换）
  3) 建新 tree（base_tree = 远程 tree）+ 新 commit（parent = 远程）
  4) 更新 refs/heads/main
  5) --sync-local 时把本地分支指到新 commit，避免下次 push 时打架

用法：
    python tools/push-via-api.py                      # 提交差异，不改本地分支
    python tools/push-via-api.py --sync-local         # 同时对齐本地 main
    python tools/push-via-api.py -m "自定义说明" --sync-local
"""
import base64
import json
import os
import subprocess
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REPO = 'YJH9999/EN_learn'
API = 'https://api.github.com/repos/' + REPO
BRANCH = 'main'


def token():
    t = os.environ.get('GITHUB_TOKEN', '').strip()
    if t:
        return t
    f = os.path.join(ROOT, '.token')
    if os.path.exists(f):
        return open(f, encoding='utf-8').read().strip()
    sys.exit('缺少令牌：设置 GITHUB_TOKEN 或写入仓库根目录 .token')


TOK = token()


def api(url, method='GET', data=None):
    body = json.dumps(data).encode() if data is not None else None
    r = urllib.request.Request(url, method=method, data=body, headers={
        'Authorization': 'Bearer ' + TOK,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'token-push-api',
    })
    with urllib.request.urlopen(r, timeout=60) as resp:
        return json.load(resp)


def git(*args, binary=False):
    out = subprocess.run(['git'] + list(args), cwd=ROOT, capture_output=True)
    if out.returncode != 0:
        raise RuntimeError('git %s 失败：%s' % (' '.join(args), out.stderr.decode('utf-8', 'replace')))
    return out.stdout if binary else out.stdout.decode('utf-8', 'replace').strip()


def main():
    argv = sys.argv[1:]
    sync_local = '--sync-local' in argv
    msg = ''
    if '-m' in argv:
        i = argv.index('-m')
        if i + 1 < len(argv):
            msg = argv[i + 1]
    if not msg:
        msg = git('log', '-1', '--pretty=%s')

    remote = api('%s/git/ref/heads/%s' % (API, BRANCH))['object']['sha']
    head = git('rev-parse', 'HEAD')
    if remote == head:
        print('远程已是最新，无需提交')
        return 0

    diff = git('diff', '--name-status', remote, head)
    if not diff:
        print('没有文件差异（可能只是提交信息不同），跳过')
        return 1

    entries = []
    for line in diff.splitlines():
        parts = line.split('\t')
        status, path = parts[0], parts[-1]
        if status.startswith('D'):
            continue        # 删除通过 tree 里省略表示，本次未涉及
        blob = git('cat-file', 'blob', 'HEAD:' + path, binary=True)
        sha = api('%s/git/blobs' % API, 'POST', {
            'content': base64.b64encode(blob).decode('ascii'),
            'encoding': 'base64',
        })['sha']
        mode = '100644'
        try:
            info = git('ls-tree', 'HEAD', '--', path)
            if info and info.split()[0] == '100755':
                mode = '100755'
        except Exception:
            pass
        entries.append({'path': path, 'mode': mode, 'type': 'blob', 'sha': sha})
        print('  ↑ %s（%d 字节）' % (path, len(blob)))

    remote_tree = api('%s/git/commits/%s' % (API, remote))['tree']['sha']
    tree = api('%s/git/trees' % API, 'POST', {'base_tree': remote_tree, 'tree': entries})['sha']
    commit = api('%s/git/commits' % API, 'POST', {
        'message': msg,
        'tree': tree,
        'parents': [remote],
    })['sha']
    api('%s/git/refs/heads/%s' % (API, BRANCH), 'PATCH', {'sha': commit, 'force': False})
    print('✓ 已通过 API 提交：%s  %s' % (commit[:7], msg))

    if sync_local:
        # 本地 commit 与远程内容一致（同一棵树），直接把分支指过去，避免以后 push 冲突
        same = git('diff', '--stat', commit, head)
        if same:
            print('⚠ 本地与远程树不一致，未对齐本地分支：\n' + same)
            return 2
        subprocess.run(['git', 'update-ref', 'refs/heads/%s' % BRANCH, commit], cwd=ROOT, check=True)
        print('✓ 本地 %s 已指向该提交（工作区内容不变）' % BRANCH)
    return 0


if __name__ == '__main__':
    sys.exit(main())
