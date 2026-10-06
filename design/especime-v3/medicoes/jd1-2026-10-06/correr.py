"""Corre uma conferência, guarda o código real e expurga caminhos locais dos registos.

python3 design/especime-v3/medicoes/jd1-2026-10-06/correr.py <nome> [--motor] -- <comando> [argumentos]
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"])


def limpa(texto):
    for p, label in [(SITE, "<worktree>"), (MOTOR, "<motor>"), (Path.home(), "<casa>")]:
        texto = texto.replace(str(p), label)
    texto = texto.replace(Path.home().name, "<utilizador>")
    return re.sub(r"\x1b\[[0-9;]*m", "", texto)


def main():
    name = sys.argv[1]
    sep = sys.argv.index("--")
    cmd = sys.argv[sep + 1:]
    cwd = MOTOR if "--motor" in sys.argv[2:sep] else SITE
    out = AQUI / "portoes"
    out.mkdir(exist_ok=True)
    start = datetime.now(timezone.utc).isoformat()
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=cwd, text=True).strip()
    r = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    (out / (name + ".log")).write_text(limpa(r.stdout))
    (out / (name + ".codigo")).write_text(str(r.returncode) + "\n")
    (out / (name + ".cabeca")).write_text(head + "\n")
    (out / (name + ".execucao.json")).write_text(json.dumps(dict(comando=limpa(" ".join(cmd)), inicio=start,
        fim=datetime.now(timezone.utc).isoformat(), codigo=r.returncode, cabeca=head), ensure_ascii=False, indent=2) + "\n")
    # O guião dos três portões escreve os seus próprios códigos. Só se limpam
    # caminhos dos textos, nunca se recalculam ou inferem códigos por uma barra.
    for p in out.iterdir():
        if p.is_file():
            p.write_text(limpa(p.read_text()))
    print(f"{name}: {r.returncode}")
    return r.returncode


if __name__ == "__main__":
    raise SystemExit(main())
