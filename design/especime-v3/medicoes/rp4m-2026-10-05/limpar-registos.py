#!/usr/bin/env python3
"""RP4-m: tira dos registos desta pasta os caminhos da máquina e o nome do utilizador, depois dos portões.

Uso: RESEARCHHUB_DIR=<worktree do motor> python3 design/especime-v3/medicoes/rp4m-2026-10-05/limpar-registos.py

Os registos dos portões (`portoes/*.log`) e as saídas das conferências levam caminhos absolutos da máquina (a worktree
do sítio, a do motor, as pastas temporárias). O mandato não deixa nenhum caminho da máquina nem o nome do utilizador
em ficheiro nenhum. Este guião troca cada um por um marcador (`<worktree do sítio>`, `<worktree do motor>`, `<casa>`,
`<pasta temporária>`), não toca nos ficheiros dos códigos nem das cabeças, e escreve `limpeza.json` com o resumo
sha256 de cada ficheiro antes e depois e o número de trocas. Os caminhos procuram-se pelo que a máquina diz de si
(a pasta deste guião, a variável do motor e a casa do utilizador), e nenhum se escreve aqui. Uma segunda corrida não
troca nada, e diz zero.
"""
import hashlib
import json
import os
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"]).resolve() if os.environ.get("RESEARCHHUB_DIR") else None
CASA = Path.home()
trocas = [(str(SITIO), "<worktree do sítio>")]
if MOTOR:
    trocas.append((str(MOTOR), "<worktree do motor>"))
trocas.append((str(CASA), "<casa>"))
# As pastas temporárias do sistema, compostas por partes para que este ficheiro não as traga escritas.
PRIVADA, TMP, PASTAS = "/" + "private", "/" + "tmp", "/" + "var" + "/" + "folders"
TEMPORARIAS = re.compile("(?:" + PRIVADA + ")?(?:" + TMP + "|" + PASTAS + r")/[^\s'\"`)\]]*")
NOME = CASA.name
sha = lambda b: hashlib.sha256(b).hexdigest()
registo = []
for f in sorted(AQUI.rglob("*")):
    if not f.is_file() or f.suffix in (".png", ".codigo") or f.name in ("cabeca", "cabeca.fim", "limpeza.json") or f.name.endswith((".inicio", ".fim")):
        continue
    antes = f.read_bytes()
    try:
        texto = antes.decode("utf-8")
    except UnicodeDecodeError:
        continue
    novo, n = texto, 0
    for de, para in trocas:
        n += novo.count(de)
        novo = novo.replace(de, para)
    novo, k = TEMPORARIAS.subn("<pasta temporária>", novo)
    n += k
    if NOME and NOME in novo:
        n += novo.count(NOME)
        novo = novo.replace(NOME, "<utilizador>")
    if n:
        f.write_text(novo, encoding="utf-8")
        registo.append({"ficheiro": str(f.relative_to(AQUI)), "trocas": n, "sha256_antes": sha(antes), "sha256_depois": sha(novo.encode("utf-8"))})
restos = [str(f.relative_to(AQUI)) for f in AQUI.rglob("*") if f.is_file() and f.suffix != ".png"
          and any(s in f.read_bytes().decode("utf-8", "replace") for s in (str(CASA), NOME, PRIVADA + TMP, PASTAS))]
saida = {"o_que": "a limpeza dos caminhos da máquina nos registos desta pasta (limpar-registos.py)", "ficheiros_limpos": registo,
         "ficheiros_limpos_quantos": len(registo), "trocas": sum(r["trocas"] for r in registo), "restos_depois": restos}
anterior = json.loads((AQUI / "limpeza.json").read_text(encoding="utf-8")) if (AQUI / "limpeza.json").exists() else None
if anterior and not registo:
    anterior["segunda_corrida"] = {"trocas": 0, "restos_depois": restos}
    saida = anterior
(AQUI / "limpeza.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{saida.get('ficheiros_limpos_quantos', 0)} ficheiro(s) limpos, {saida.get('trocas', 0)} troca(s); restos: {len(restos)}")
raise SystemExit(1 if restos else 0)
