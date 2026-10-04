#!/usr/bin/env python3
"""RP3: o custo do bloco em símbolos e em segundos, lido do registo da sessão do construtor, em custo-rp3.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/custo-rp3.py <registo da sessão do construtor (.jsonl)>

Os símbolos são o contador que o ambiente mostra ao agente («N tokens left»), lido no
registo da sessão: a primeira leitura (o começo do bloco) menos a última (a desta
corrida). As horas são as das mesmas duas leituras. O caminho do registo não entra no
ficheiro, que leva só os números, as horas, o número de leituras e o modelo. O total que
a ferramenta reporta ao lugar de direção no fim é o que conta; este é o do momento em
que o relatório se fechou.
"""
import json
import pathlib
import re
import sys
from datetime import datetime

if len(sys.argv) != 2:
    sys.exit("uso: custo-rp3.py <registo da sessão do construtor>")
leituras = []
for linha in pathlib.Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
    try:
        o = json.loads(linha)
    except ValueError:
        continue
    for m in re.finditer(r"(\d+) tokens left", json.dumps(o, ensure_ascii=False)):
        if o.get("timestamp"):
            leituras.append((o["timestamp"], int(m.group(1))))
if len(leituras) < 2:
    sys.exit("custo-rp3: o registo não tem duas leituras do contador")
(h0, v0), (h1, v1) = leituras[0], leituras[-1]
segundos = round((datetime.fromisoformat(h1.replace("Z", "+00:00")) - datetime.fromisoformat(h0.replace("Z", "+00:00"))).total_seconds())
saida = {
    "_": "Escrito por design/especime-v3/medicoes/rp3-2026-10-04/custo-rp3.py a partir do registo da sessão do construtor. Não se edita à mão.",
    "modelo": "Claude Opus 5.5",
    "subagentes": 0,
    "leituras_do_contador": len(leituras),
    "primeira_leitura": {"hora": h0, "restam": v0},
    "ultima_leitura": {"hora": h1, "restam": v1},
    "simbolos_gastos": v0 - v1,
    "segundos_entre_as_leituras": segundos,
    "conhecido_positivo": {"o_que": "a primeira leitura é o total da sessão, 15 000 000, e as leituras descem",
                           "encontrado": v0 == 15000000 and v1 < v0},
}
destino = pathlib.Path(__file__).resolve().parent / "custo-rp3.json"
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"custo-rp3: {v0 - v1} símbolos em {segundos} s ({len(leituras)} leituras)")
