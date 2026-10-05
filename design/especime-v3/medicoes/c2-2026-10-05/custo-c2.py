#!/usr/bin/env python3
"""C2: o custo do bloco em símbolos e em segundos, lido do registo da sessão do construtor, em custo-c2.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/custo-c2.py <registo da sessão do construtor (.jsonl)>

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

# Uma passagem conta-se à parte: `--desde <hora UTC>` só lê as leituras do contador dessa hora em diante, e
# `--saida <nome>` escreve noutro ficheiro da pasta (por omissão, custo-c2.json).
args = [a for a in sys.argv[1:]]
desde = args[args.index("--desde") + 1] if "--desde" in args else None
nome_saida = args[args.index("--saida") + 1] if "--saida" in args else "custo-c2.json"
posicionais = [a for i, a in enumerate(args) if a not in ("--desde", "--saida") and (i == 0 or args[i - 1] not in ("--desde", "--saida"))]
if len(posicionais) != 1:
    sys.exit("uso: custo-c2.py <registo da sessão do construtor> [--desde <hora UTC>] [--saida <nome>]")
leituras = []
# Os subagentes contam-se no mesmo registo: cada chamada da ferramenta Agent (ou Task, o nome antigo) dentro do intervalo.
chamadas = {}
for linha in pathlib.Path(posicionais[0]).read_text(encoding="utf-8").splitlines():
    try:
        o = json.loads(linha)
    except ValueError:
        continue
    conteudo = (o.get("message") or {}).get("content") if isinstance(o, dict) else None
    if isinstance(conteudo, list) and o.get("timestamp") and (desde is None or o["timestamp"] >= desde):
        for b in conteudo:
            if isinstance(b, dict) and b.get("type") == "tool_use":
                chamadas[b.get("name")] = chamadas.get(b.get("name"), 0) + 1
    for m in re.finditer(r"(\d+) tokens left", json.dumps(o, ensure_ascii=False)):
        if o.get("timestamp") and (desde is None or o["timestamp"] >= desde):
            leituras.append((o["timestamp"], int(m.group(1))))
if len(leituras) < 2:
    sys.exit("custo-c2: o registo não tem duas leituras do contador")
(h0, v0), (h1, v1) = leituras[0], leituras[-1]
segundos = round((datetime.fromisoformat(h1.replace("Z", "+00:00")) - datetime.fromisoformat(h0.replace("Z", "+00:00"))).total_seconds())
saida = {
    "_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/custo-c2.py a partir do registo da sessão do construtor. Não se edita à mão.",
    "modelo": "Claude Opus 5.5",
    "subagentes": chamadas.get("Agent", 0) + chamadas.get("Task", 0),
    "chamadas_de_ferramentas": sum(chamadas.values()),
    "conhecido_positivo_das_chamadas": {"o_que": "o contador das chamadas acha as do Bash no mesmo intervalo", "encontrado": chamadas.get("Bash", 0) > 0},
    "leituras_do_contador": len(leituras),
    "primeira_leitura": {"hora": h0, "restam": v0},
    "ultima_leitura": {"hora": h1, "restam": v1},
    "simbolos_gastos": v0 - v1,
    "segundos_entre_as_leituras": segundos,
    "desde": desde,
    "conhecido_positivo": ({"o_que": "a primeira leitura é o total da sessão, 15 000 000, e as leituras descem",
                            "encontrado": v0 == 15000000 and v1 < v0} if desde is None else
                           {"o_que": "as leituras desta passagem descem, e a primeira é posterior à hora dada",
                            "encontrado": v1 < v0 and h0 >= desde}),
}
destino = pathlib.Path(__file__).resolve().parent / nome_saida
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"custo-c2: {v0 - v1} símbolos em {segundos} s ({len(leituras)} leituras)")
