"""Corre uma conferência, guarda o código real e expurga caminhos locais dos registos.

JD1_PORTOES=portoes-b python3 design/especime-v3/medicoes/jd1-2026-10-06/correr.py <nome> [--motor] -- <comando> [argumentos]
"""
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"])


def limpa(texto):
    for p, label in [(SITE, "<worktree>"), (MOTOR, "<motor>"), (Path.home(), "<casa>")]:
        texto = texto.replace(str(p), label)
    texto = texto.replace(Path.home().name, "<utilizador>")
    temporarios = {tempfile.gettempdir(), os.environ.get("TMPDIR", "").rstrip("/")} - {""}
    temporarios |= {"/private" + p for p in temporarios if p.startswith("/var/")}
    for p in sorted(temporarios, key=len, reverse=True):
        texto = texto.replace(p, "<casa>/temporario")
    texto = re.sub(r"/(?:private/)?var/folders/[^\s\"'<>]+", "<casa>/temporario", texto)
    return re.sub(r"\x1b\[[0-9;]*m", "", texto)


def main():
    name = sys.argv[1]
    sep = sys.argv.index("--")
    cmd = sys.argv[sep + 1:]
    cwd = MOTOR if "--motor" in sys.argv[2:sep] else SITE
    out = AQUI / os.environ.get("JD1_PORTOES", "portoes")
    out.mkdir(exist_ok=True)
    status = subprocess.check_output(["git", "status", "--porcelain", "--untracked-files=all"], cwd=cwd, text=True)
    # Os suplementos podem escrever sobre os registos da própria conferência.
    # O guião dos portões gerais verifica a árvore toda antes de criar a saída.
    outside = [line for line in status.splitlines() if not line[3:].startswith("design/especime-v3/medicoes/jd1-2026-10-06/portoes-c/")]
    if outside:
        raise SystemExit("JD1-c: árvore suja fora dos registos dos portões")
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
    comuns = {"cabeca", "cabeca.fim", "estado.fim"} if name == "sitio" else set()
    prefixos = ("build.", "verify.", "typecheck.", "sitio.") if name == "sitio" else (name + ".",)
    for p in out.iterdir():
        if p.is_file() and (p.name in comuns or p.name.startswith(prefixos)):
            p.write_text(limpa(p.read_text()))
    print(f"{name}: {r.returncode}")
    return r.returncode


if __name__ == "__main__":
    raise SystemExit(main())
