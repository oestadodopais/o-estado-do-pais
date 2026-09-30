#!/usr/bin/env python3
"""UE1: as corridas do motor que o relatório cita, guardadas no sítio e sem caminhos da máquina.

Uso (da raiz do sítio): python3 design/especime-v3/medicoes/ue1-2026-09-29/motor-ue1.py <worktree do motor>

Corre, no motor: a suíte do bloco (publisher.series_paises_test), o gerador e a travessia a seco, a
travessia a escrever para este sítio (a idempotência: o git do sítio não pode ver mudança nenhuma nos
ficheiros que ela escreve) e o portão do motor (python3 -m core.gate); e, no sítio, o check:cruzamento
contra o motor (--with-origin). Escreve motor/<corrida>.txt e motor/motor-ue1.json. O guião das
medidas (medir-ue1.mjs) lê este JSON e não o motor.
"""
import getpass
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile

SITIO = pathlib.Path.cwd().resolve()
AQUI = pathlib.Path(__file__).resolve().parent
SAIDA = AQUI / "motor"
SAIDA.mkdir(exist_ok=True)
if len(sys.argv) != 2:
    print(__doc__)
    sys.exit(2)
MOTOR = pathlib.Path(sys.argv[1]).expanduser().resolve()
TROCAS = sorted([(str(SITIO), "<worktree do sítio>"), (str(MOTOR), "<worktree do motor>"),
                 (os.path.realpath(tempfile.gettempdir()), "<pasta temporária>"),
                 (tempfile.gettempdir(), "<pasta temporária>"), (str(pathlib.Path.home()), "<pasta pessoal>"),
                 (getpass.getuser(), "<utilizador>")], key=lambda x: -len(x[0]))


def limpa(s):
    s = re.sub(r"\x1b\[[0-9;]*m", "", s)
    for de, para in TROCAS:
        s = s.replace(de, para)
    return s


def corre(nome, comando, cwd, env=None):
    r = subprocess.run(comando, cwd=cwd, capture_output=True, text=True, env={**os.environ, **(env or {})})
    texto = limpa(r.stdout + r.stderr)
    onde = "<worktree do motor>" if cwd == MOTOR else "<worktree do sítio>"
    (SAIDA / f"{nome}.txt").write_text(f"# {' '.join(limpa(c) for c in comando)}\n# em {onde}\n# código: {r.returncode}\n\n{texto}", encoding="utf-8")
    return r.returncode, texto


medidas = {}


def medida(nome, valor, comando, o_que, encontrado):
    medidas[nome] = {"valor": valor, "comando": comando, "o_que": o_que, "encontrado": bool(encontrado)}


cab = subprocess.run(["git", "rev-parse", "HEAD"], cwd=MOTOR, capture_output=True, text=True).stdout.strip()
medida("cabeca", cab[:7], "git rev-parse HEAD, no motor", "é um commit", re.fullmatch(r"[0-9a-f]{40}", cab))

c, t = corre("suite", ["python3", "-m", "publisher.series_paises_test"], MOTOR)
m = re.search(r"plantas: (\d+) em (\d+) morderam", t)
n = re.search(r"PASS · (\d+) conferências", t)
medida("suite_codigo", c, "python3 -m publisher.series_paises_test", "a suíte diz quantas conferências fez", n)
medida("suite_conferencias", int(n.group(1)) if n else None, "o mesmo", "a linha PASS existe", n)
medida("suite_plantas", int(m.group(1)) if m else None, "o mesmo, as plantas que morderam", "a planta «um ponto trocado» está entre elas", "um ponto trocado" in t)

c, t = corre("gerador", ["python3", "publisher/series_paises.py", "--site", str(SITIO)], MOTOR)
g = re.search(r"PASS · (\d+) séries de (\d+) pontos", t)
medida("gerador_codigo", c, "python3 publisher/series_paises.py --site <worktree do sítio>", "a linha PASS existe", g)
medida("gerador_pontos", int(g.group(2)) if g else None, "o mesmo", "a série da pobreza diz «a par de AT, SE»", "a par de AT, SE" in t)

c, t = corre("travessia-seca", ["python3", "publisher/export_series.py", "--site", str(SITIO)], MOTOR)
medida("travessia_seca_codigo", c, "python3 publisher/export_series.py --site <worktree do sítio>", "a linha PASS existe", "EXPORT_SERIES: PASS" in t)

escritos = ["ledger/series", "ledger/cruzamentos/series.json", "src/data/paises-da-uniao.json"]
c, t = corre("travessia-escrita", ["python3", "publisher/export_series.py", "--site", str(SITIO), "--write"], MOTOR)
estado = subprocess.run(["git", "status", "--porcelain", "--", *escritos], cwd=SITIO, capture_output=True, text=True).stdout
(SAIDA / "travessia-escrita-git-status.txt").write_text(f"# git status --porcelain -- {' '.join(escritos)}\n# em <worktree do sítio>, depois da travessia a escrever\n\n{estado or '(nada)'}\n", encoding="utf-8")
medida("travessia_escrita_codigo", c, "python3 publisher/export_series.py --site <worktree do sítio> --write", "a travessia escreveu os doze ficheiros", t.count("escrito ") == 12)
# O CONHECIDO-POSITIVO: um ficheiro plantado na pasta das séries tem de aparecer no mesmo git status.
planta = SITIO / "ledger/series/planta-do-git-status.yml"
planta.write_text("# planta\n", encoding="utf-8")
visto = "planta-do-git-status.yml" in subprocess.run(["git", "status", "--porcelain", "--", *escritos], cwd=SITIO, capture_output=True, text=True).stdout
planta.unlink()
medida("travessia_ficheiros_mudados_no_sitio", len([l for l in estado.splitlines() if l.strip()]), "git status --porcelain sobre o que a travessia escreve, depois de a escrever outra vez", "o mesmo git status vê um ficheiro plantado na pasta das séries", visto)

c, t = corre("cruzamento-com-origem", ["node", "scripts/check-cruzamento.mjs", "--with-origin"], SITIO, {"RESEARCHHUB_DIR": str(MOTOR)})
o = re.search(r"séries · (\d+) linha\(s\) de série em \d+ registo\(s\) · (\d+) conferida\(s\) contra o motor", t)
medida("cruzamento_com_origem_codigo", c, "RESEARCHHUB_DIR=<worktree do motor> node scripts/check-cruzamento.mjs --with-origin", "a linha das séries existe", o)
medida("cruzamento_series_contra_o_motor", int(o.group(2)) if o else None, "o mesmo", "a linha das séries existe", o)

c, t = corre("core-gate", ["python3", "-m", "core.gate"], MOTOR)
medida("core_gate_codigo", c, "python3 -m core.gate, no motor", "a suíte do bloco está no portão", "series_paises_test     ok" in t)

(SAIDA / "motor-ue1.json").write_text(json.dumps({"bloco": "UE1", "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for k, v in medidas.items():
    print(f"  {k}: {v['valor']}")
sys.exit(0)
