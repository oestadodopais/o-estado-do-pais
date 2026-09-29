#!/usr/bin/env python3
"""UE1: as palavras da frase da faixa são as do lugar de direção, com os acertos declarados e mais nenhum.

Lê as duas frases e as palavras do empate no §3, ponto 5, do brief UE1; aplica-lhes as trocas de
acertos-ue1.json; rende a declaração src/data/faixa-da-uniao.mjs com os mesmos lugares ({conta},
{período}, {valor}, {país}, {n}) e compara as seis formas (duas línguas, três ramos: sem empate, empate
com um país, empate com vários). Escreve acertos-ue1-resultado.json ao lado e sai com 1 se alguma
forma diferir. Não lê a rede nem o motor. Corre a partir da raiz do sítio.
"""
import json
import pathlib
import re
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[4]
AQUI = pathlib.Path(__file__).resolve().parent
BRIEF = RAIZ / "design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md"

texto = BRIEF.read_text(encoding="utf-8")
m = re.search(r"Em português: «(.+?)» Em inglês: «(.+?)»", texto)
t = re.search(r"acrescenta «(a par de \{país\})» / «(level with \{país\})»", texto)
if not m or not t:
    print("ACERTOS_UE1: FAIL · as frases do brief não se encontraram (o conhecido-positivo falhou)")
    sys.exit(1)
brief = {"pt": m.group(1), "en": m.group(2)}
empate = {"pt": t.group(1), "en": t.group(2)}
acertos = json.loads((AQUI / "acertos-ue1.json").read_text(encoding="utf-8"))["acertos"]

saida = subprocess.run(
    ["node", "-e", "import('./src/data/faixa-da-uniao.mjs').then(m=>process.stdout.write(JSON.stringify(m.PALAVRAS_DA_FAIXA)))"],
    cwd=RAIZ, capture_output=True, text=True, check=True)
palavras = json.loads(saida.stdout)


def rende(partes, lingua, ramo):
    out = ""
    for p in partes:
        if isinstance(p, str):
            out += p
        elif "conta" in p:
            out += "{conta}"
        elif "periodo" in p:
            out += "{período}"
        elif "valor" in p:
            out += "{valor}"
        elif "paises" in p:
            out += "{país}"
        elif "pais" in p:
            out += "Portugal"
        elif "lugar" in p:
            out += "{n}"
        elif "aPar" in p:
            out += rende(palavras[lingua]["aPar"][ramo], lingua, ramo) if ramo else ""
    return out


resultado, falhas, usados = [], [], set()
for lingua in ("pt", "en"):
    base = brief[lingua]
    for a in acertos:
        if a["lingua"] == lingua and "ramo" not in a:
            if a["de"] not in base:
                falhas.append(f"{a['id']} ({lingua}): «{a['de']}» não está no texto do brief")
            base = base.replace(a["de"], a["para"])
            usados.add((a["id"], lingua, None))
    for ramo in (None, "um", "varios"):
        esperado = base
        if ramo:
            troca = [a for a in acertos if a["lingua"] == lingua and a.get("ramo") == ramo]
            if len(troca) != 1 or troca[0]["de"] != empate[lingua]:
                falhas.append(f"F2 ({lingua}, {ramo}): o acerto não parte das palavras do empate do brief")
                continue
            if not esperado.endswith("."):
                falhas.append(f"({lingua}): a frase do brief não acaba num ponto final")
                continue
            esperado = esperado[:-1] + troca[0]["para"] + "."
            usados.add(("F2", lingua, ramo))
        declarado = rende(palavras[lingua]["frase"], lingua, ramo)
        igual = esperado == declarado
        resultado.append({"lingua": lingua, "ramo": ramo or "sem empate", "esperado": esperado,
                          "declarado": declarado, "igual": igual})
        if not igual:
            falhas.append(f"({lingua}, {ramo or 'sem empate'}): a declaração difere do brief com os acertos")

saida = {"brief": str(BRIEF.relative_to(RAIZ)), "declaracao": "src/data/faixa-da-uniao.mjs",
         "acertos": len(acertos), "formas": len(resultado), "iguais": sum(1 for r in resultado if r["igual"]),
         "falhas": falhas, "resultado": resultado}
(AQUI / "acertos-ue1-resultado.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for r in resultado:
    print(f"  {'igual  ' if r['igual'] else 'DIFERE '} {r['lingua']} · {r['ramo']}")
print(f"ACERTOS_UE1: {'PASS' if not falhas else 'FAIL'} · {saida['iguais']} de {saida['formas']} formas iguais, {len(acertos)} acertos")
for f in falhas:
    print(f"  x {f}")
sys.exit(1 if falhas else 0)
