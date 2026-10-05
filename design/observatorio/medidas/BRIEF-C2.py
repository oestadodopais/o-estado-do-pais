#!/usr/bin/env python3
"""O §0 do brief C2 (as nove revisões da Eurostat de 02.10.2026, relidas), medido sobre a cabeça presa do sítio (3a253f73).
Lê só o repositório, pela cabeça presa (`git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-C2.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "3a253f73"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", CAB, "ledger/claims/"], capture_output=True)
claims = r.stdout.decode().split() if r.returncode == 0 else []
textos = {c: (mostrar(c) or "") for c in claims}
divergentes = sorted(pathlib.Path(c).stem for c, t in textos.items()
                     if re.search(r'^  - date: "2026-10-05"\n(?:    [^\n]*\n)*?    result: "diverge"', t, re.M))
medicao("linhas_com_uma_verificacao_divergente_de_05_10_2026", len(divergentes) if claims else NAO,
        f"git show {CAB}:ledger/claims/<linha>.yml · as linhas com uma verificação datada de 2026-10-05 e result \"diverge\"",
        "o PIB real por habitante de 2024 é uma delas", "pib-real-per-capita-2024" in divergentes)
da_eurostat = [d for d in divergentes if "ec.europa.eu/eurostat" in textos.get(f"ledger/claims/{d}.yml", "")]
medicao("dessas_as_lidas_na_eurostat", len(da_eurostat) if claims else NAO,
        "das linhas da medida anterior, as que citam um endereço da Eurostat no seu source_url ou pedido",
        "a lista das divergentes não está vazia", bool(divergentes))
inacessiveis = sum(1 for t in textos.values() if re.search(r'^  - date: "2026-10-05"\n(?:    [^\n]*\n)*?    result: "inacessivel"', t, re.M))
iguais = sum(1 for t in textos.values() if re.search(r'^  - date: "2026-10-05"\n(?:    [^\n]*\n)*?    result: "igual"', t, re.M))
medicao("linhas_com_uma_verificacao_igual_de_05_10_2026", iguais if claims else NAO,
        f"git show {CAB}:ledger/claims/<linha>.yml · as verificações de 2026-10-05 com result \"igual\"",
        "a soma das iguais, divergentes e inacessíveis é 91, as linhas do painel", iguais + len(divergentes) + inacessiveis == 91)
medicao("linhas_com_uma_verificacao_inacessivel_de_05_10_2026", inacessiveis if claims else NAO,
        f"git show {CAB}:ledger/claims/<linha>.yml · as verificações de 2026-10-05 com result \"inacessivel\"",
        "a soma é 91", iguais + len(divergentes) + inacessiveis == 91)
atualizacoes = sum(len(re.findall(r"^  kind: atualizacao", t, re.M)) + len(re.findall(r"^- kind: atualizacao", t, re.M)) for t in textos.values())
medicao("correcoes_do_tipo_atualizacao_no_livro", atualizacoes if claims else NAO,
        f"git show {CAB}:ledger/claims/<linha>.yml · as entradas de corrections com kind: atualizacao",
        "a dívida das famílias da União tem uma atualização de 28.09", "kind: atualizacao" in textos.get("ledger/claims/divida-das-familias-2025-ue.yml", ""))
pp = mostrar("src/data/primeira-pagina.mjs") or ""
na_primeira = [d for d in divergentes if f"'{d}'" in pp]
medicao("linhas_divergentes_usadas_na_primeira_pagina", len(na_primeira) if pp else NAO,
        f"git show {CAB}:src/data/primeira-pagina.mjs · as linhas divergentes citadas pelo id",
        "a primeira página cita a posição de investimento internacional", "posicao-de-investimento-internacional" in pp)
readme = mostrar("ledger/README.md") or ""
medicao("mencoes_da_v16_no_readme_do_livro", len(re.findall(r"\bV16\b", readme)) if readme else NAO,
        f"git show {CAB}:ledger/README.md · as ocorrências de «V16» (o caminho das revisões da fonte)",
        "o README fala de corrections", "corrections" in readme)
saida = {"brief": "design/observatorio/BRIEF-C2-as-nove-revisoes-da-eurostat.md", "guiao": "design/observatorio/medidas/BRIEF-C2.py",
         "cabeca_lida": CAB, "medidas": medidas, "divergentes": divergentes}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-C2.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
