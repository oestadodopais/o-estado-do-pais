#!/usr/bin/env python3
"""A FUSÃO COM O MAIN DE 06.10.2026 (o R4): as leituras provadas (`tests/cartao/leituras-provadas.json`) depois da fusão.

O mandato: o ficheiro fica com todas as chaves (as leituras com as sete entradas do R4, as comuns, as medidas, as 181
famílias, as 10 séries e as explicações), é um JSON válido e a K17 passa (a K17 corre-a o `check:cartao`, nas provas).
Este guião confere a primeira metade: cada chave do main (42c7ed7e) está no ficheiro com o mesmo valor, e a chave das
explicações é a do ramo antes da fusão (458f3e18). Os conhecidos-positivos, em memória: uma entrada do main tirada e a
chave das explicações tirada são recusadas.

Uso (da raiz do sítio): python3 design/especime-v3/medicoes/ex1-2026-10-05/conferir-leituras-provadas.py <saída.json>
"""
import json
import subprocess
import sys
from pathlib import Path

SITIO = Path(__file__).resolve().parents[4]
F = "tests/cartao/leituras-provadas.json"
MAIN, RAMO = "42c7ed7e", "458f3e18"


def git_show(rev):
    return json.loads(subprocess.run(["git", "-C", str(SITIO), "show", f"{rev}:{F}"], capture_output=True, text=True, check=True).stdout)


def confere(atual, main, ramo):
    erros = []
    for k, v in main.items():
        if k not in atual:
            erros.append(f"falta a chave {k} do main")
        elif atual[k] != v:
            erros.append(f"a chave {k} não é a do main")
    if atual.get("explicacoes") != ramo.get("explicacoes") or "explicacoes" not in atual:
        erros.append("a chave das explicações não é a do ramo antes da fusão")
    sobra = sorted(set(atual) - set(main) - {"explicacoes"})
    if sobra:
        erros.append(f"chaves que não são do main nem das explicações: {sobra}")
    return erros


texto = (SITIO / F).read_text(encoding="utf-8")
atual = json.loads(texto)  # um JSON inválido sai aqui com erro
main, ramo = git_show(MAIN), git_show(RAMO)
erros = confere(atual, main, ramo)
plantas = []
p = json.loads(texto); k = next(iter(p["familias"])) if isinstance(p["familias"], dict) else 0
if isinstance(p["familias"], dict):
    del p["familias"][k]
else:
    p["familias"].pop(0)
plantas.append({"nome": "uma família do main tirada", "mordeu": bool(confere(p, main, ramo))})
p = json.loads(texto); del p["explicacoes"]
plantas.append({"nome": "a chave das explicações tirada", "mordeu": bool(confere(p, main, ramo))})
forma = lambda d: {k: (len(v) if isinstance(v, (list, dict)) else v if isinstance(v, int) else "texto") for k, v in d.items()}
saida = {
    "o_que_e": "As leituras provadas depois da fusão com o main de 06.10.2026: cada chave do main com o mesmo valor e a chave das explicações do ramo antes da fusão.",
    "ficheiro": F,
    "main": MAIN,
    "ramo_antes_da_fusao": RAMO,
    "chaves": forma(atual),
    "chaves_do_main": forma(main),
    "iguais_ao_main": sorted(k for k in main if atual.get(k) == main[k]),
    "explicacoes_iguais_as_do_ramo": atual.get("explicacoes") == ramo.get("explicacoes"),
    "erros": erros,
    "conhecidos_positivos": plantas,
}
Path(sys.argv[1]).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"chaves": saida["chaves"], "erros": erros, "plantas": [x["mordeu"] for x in plantas]}, ensure_ascii=False))
sys.exit(0 if not erros and all(x["mordeu"] for x in plantas) else 1)
