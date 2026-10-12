#!/usr/bin/env python3
"""Copy a self-contained skill; refuse overwrites and preserve the source."""
import argparse
from pathlib import Path
import shutil
import sys

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest',type=Path,default=Path.home()/'.agents/skills',help='Parent directory containing installed skills')
    args=parser.parse_args()
    source=Path(__file__).resolve().parents[1]/'skills/editorial-design'
    target=args.dest.expanduser().resolve()/'editorial-design'
    if target.exists() or target.is_symlink():
        parser.exit(1,f'Refusing to overwrite existing skill: {target}\n')
    if source==target or source in target.parents:
        parser.exit(1,'Destination must be outside the source skill.\n')
    if not (source/'SKILL.md').is_file():
        parser.exit(1,'Source SKILL.md missing.\n')
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copytree(source,target)
    print(f'Installed: {target}\nUse $editorial-design in Codex; restart if it does not appear.')

if __name__=='__main__':
    main()
