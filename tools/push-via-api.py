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

    # 不依赖本地是否见过远程提交：直接比「远程 tree 的 blob sha」与「本地 HEAD 的 blob sha」，
    # 两者相同说明文件内容一致（sha 由内容算出），历史分叉也不影响判断。
    remote_tree = api('%s/git/commits/%s' % (API, remote))['tree']['sha']
    remote_blobs = {}
    tree_data = api('%s/git/trees/%s?recursive=1' % (API, remote_tree))
    for e in tree_data.get('tree', []):
        if e.get('type') == 'blob':
            remote_blobs[e['path']] = e['sha']
    if tree_data.get('truncated'):
        print('⚠ 远程文件列表被截断，改用保守策略（全部重传）')

    entries = []
    for line in git('ls-tree', '-r', 'HEAD').splitlines():
        if '\t' not in line:
            continue
        meta, path = line.split('\t', 1)
        parts = meta.split()
        if len(parts) < 3:
            continue
        mode, sha = parts[0], parts[2]
        if remote_blobs.get(path) == sha:
            continue            # 内容相同，跳过
        blob = git('cat-file', 'blob', 'HEAD:' + path, binary=True)
        new_sha = api('%s/git/blobs' % API, 'POST', {
            'content': base64.b64encode(blob).decode('ascii'),
            'encoding': 'base64',
        })['sha']
        entries.append({'path': path, 'mode': mode, 'type': 'blob', 'sha': new_sha})
        print('  ↑ %s（%d 字节）' % (path, len(blob)))

    if not entries:
        print('没有内容差异（可能只是提交信息不同），跳过')
        return 1

    tree = api('%s/git/trees' % API, 'POST', {'base_tree': remote_tree, 'tree': entries})['sha']
    commit = api('%s/git/commits' % API, 'POST', {
        'message': msg,
        'tree': tree,
        'parents': [remote],
    })['sha']
    api('%s/git/refs/heads/%s' % (API, BRANCH), 'PATCH', {'sha': commit, 'force': False})
    print('✓ 已通过 API 提交：%s  %s' % (commit[:7], msg))

    if sync_local:
        # 本地 commit 与远程内容一致（同一棵树）时，直接把分支指过去，避免以后 push 打架。
        # 若本地没有该提交对象（没见过远程历史），就提示手动对齐，不要报错中断。
        try:
            same = git('diff', '--stat', commit, head)
        except RuntimeError:
            print('· 本地缺少远程提交对象（未 fetch），内容已一致；')
            print('  下次联网后在终端执行一次：git fetch origin && git reset --hard origin/main')
            return 0
        if same:
            print('⚠ 本地与远程树不一致，未对齐本地分支：\n' + same)
            return 2
        subprocess.run(['git', 'update-ref', 'refs/heads/%s' % BRANCH, commit], cwd=ROOT, check=True)
        print('✓ 本地 %s 已指向该提交（工作区内容不变）' % BRANCH)
    return 0


if __name__ == '__main__':
    sys.exit(main())
