"""Confere os passos que a falha L1 impediu de executar, antes do fecho.

Não substitui a corrida inteira na cabeça final, pela tranca.
"""
from pathlib import Path
from datetime import datetime, timezone
import json, subprocess
from publisher.oe1_run import clean

here = Path("design/especime-v3/medicoes/oe1-2026-10-04/oe1b-cauda")
here.mkdir(exist_ok=True)
commands = json.loads(Path("package.json").read_text())["scripts"]["verify"].split(" && ")
commands = commands[commands.index("npm run check:lugar") + 1:]
results = []
for command in commands:
    args = command.split()
    assert len(args) == 3 and args[:2] == ["npm", "run"]
    name = args[2].replace(":", "-")
    start = datetime.now(timezone.utc).isoformat()
    r = subprocess.run(args, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (here / (name + ".log")).write_text(clean(r.stdout))
    (here / (name + ".codigo")).write_text(str(r.returncode) + "\n")
    results.append({"comando": command, "codigo": r.returncode, "inicio": start, "fim": datetime.now(timezone.utc).isoformat()})
    (here / "resultados.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n")
    print(command, r.returncode, flush=True)
assert len(results) == len(commands)
raise SystemExit(1 if any(r["codigo"] for r in results) else 0)
