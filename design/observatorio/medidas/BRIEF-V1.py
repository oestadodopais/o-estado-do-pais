#!/usr/bin/env python3
"""O §0 do brief V1 (o primeiro varrimento de vigilância), medido sobre a cabeça presa do sítio (CAB). Lê só o
repositório, pela cabeça (`git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-V1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO». O §0 do V1 tem um só número: o código do portão do
motor na cabeça de partida, que o construtor escreveu em portoes/inicial.codigo pela corrida registada em
portoes/inicial.json (a §0 manda medir antes de construir; o ficheiro é a medição)."""
import json, os, pathlib, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "HEAD"
NAO = "NÃO LIDO"
MEDICOES = "design/especime-v3/medicoes/v1-2026-10-07"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


codigo = git("show", f"{CAB}:{MEDICOES}/portoes/inicial.codigo")
registo = git("show", f"{CAB}:{MEDICOES}/portoes/inicial.json") or ""
valor = NAO
if codigo is not None and codigo.strip().isdigit():
    valor = int(codigo.strip())
medicao("portao_inicial_do_motor", valor,
        f"git show {CAB}:{MEDICOES}/portoes/inicial.codigo · o código de saída do python3 -m core.gate na cabeça de partida do motor",
        "o registo da corrida (portoes/inicial.json) nomeia o core.gate e a cabeça do motor",
        "core.gate" in registo and "465d01e" in registo)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-V1.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-V1-o-primeiro-varrimento-de-vigilancia.md",
                             "guiao": "design/observatorio/medidas/BRIEF-V1.py", "cabeca_lida": CAB, "medidas": medidas},
                            ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
