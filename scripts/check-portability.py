#!/usr/bin/env python3
"""Validate local runtime dependencies and isolated installation, without network."""
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit,unquote
from html import unescape

ROOT=Path(__file__).resolve().parents[1]

def check_tree(root):
    errors=[];count=0
    for file in root.rglob('*'):
        if not file.is_file() or file.suffix not in ('.mjs','.css','.html','.md'):continue
        text=file.read_text()
        refs=[]
        if file.suffix in ('.mjs','.html'):
            refs+=re.findall(r'(?:from\s*|import\s*\(?\s*)[\'"](\.[^\'"]+)[\'"]',text)
        if file.suffix in ('.css','.html'):
            refs+=re.findall(r'url\([\'"]?([^\s)\'"]+)',text)
        if file.suffix=='.html':
            refs+=re.findall(r'(?:src|href)=[\'"]([^\'"]+)',text)
        if file.suffix=='.md':
            refs+=re.findall(r'!?\[[^\]]*\]\(([^\s)]+)\)',text)
        for ref in refs:
            ref=unescape(ref);url=urlsplit(ref)
            if url.scheme or url.netloc or not url.path:continue
            target=(file.parent/unquote(url.path)).resolve()
            count+=1
            if root.resolve() not in target.parents or not target.is_file():errors.append(f'{file.relative_to(root)} -> {ref}')
        if '/Users/' in text or '127.0.0.1:8879' in text:errors.append(f'Machine runtime path: {file.relative_to(root)}')
    if errors:raise AssertionError('\n'.join(errors))
    return count

english=(ROOT/'README.md').read_text();chinese=(ROOT/'README.zh-CN.md').read_text()
assert re.findall(r'```sh\n(.*?)```',english,re.S)==re.findall(r'```sh\n(.*?)```',chinese,re.S),'Bilingual shell commands differ'
assert (ROOT/'LICENSE').read_bytes()==(ROOT/'skills/editorial-design/LICENSE').read_bytes(),'Installed license differs'
assert 'MIT License' in (ROOT/'LICENSE').read_text()
count=check_tree(ROOT)
with tempfile.TemporaryDirectory(prefix='editorial-install-') as temp:
    dest=Path(temp)/'skills'
    command=[sys.executable,str(ROOT/'scripts/install-local.py'),'--dest',str(dest)]
    first=subprocess.run(command,capture_output=True,text=True)
    assert first.returncode==0,first.stderr
    installed=dest/'editorial-design';source=ROOT/'skills/editorial-design'
    before={str(f.relative_to(installed)):f.read_bytes() for f in installed.rglob('*') if f.is_file()}
    original={str(f.relative_to(source)):f.read_bytes() for f in source.rglob('*') if f.is_file()}
    assert before==original,'Installed files differ'
    installed_refs=check_tree(installed)
    second=subprocess.run(command,capture_output=True,text=True)
    assert second.returncode!=0 and 'Refusing' in second.stderr,'Overwrite must be rejected'
    assert before=={str(f.relative_to(installed)):f.read_bytes() for f in installed.rglob('*') if f.is_file()},'Existing installation changed'
print(f'PASS: {count} local references, {installed_refs} installed references, {len(before)} identical installed files, overwrite rejected; no network used.')
