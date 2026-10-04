#!/usr/bin/env python3
"""Filtra apenas identificadores locais da saída; conserva o código do npm."""
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from publisher.oe1_run import clean
env = dict(os.environ)
env["PATH"] = env["OE1_NATIVE_PATH"]
r = subprocess.run([env["OE1_REAL_NPM"], *sys.argv[1:]], env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
print(clean(r.stdout), end="")
if sys.argv[1:] == ["run", "build"]:
    # O portoes.sh mantém a tranca enquanto este invólucro executa o ledger.
    base = Path("design/especime-v3/medicoes/oe1-2026-10-04/portoes/ledger")
    def write(ext, value):
        base.with_name(base.name + ext).write_text(clean(value))
    write(".inicio", datetime.now(timezone.utc).isoformat() + "\n")
    write(".cabeca", subprocess.check_output(["git", "rev-parse", "HEAD"], text=True))
    ledger = subprocess.run([env["OE1_REAL_NPM"], "run", "ledger:check"], env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    write(".log", ledger.stdout)
    write(".codigo", str(ledger.returncode) + "\n")
    write(".fim", datetime.now(timezone.utc).isoformat() + "\n")
raise SystemExit(r.returncode)
