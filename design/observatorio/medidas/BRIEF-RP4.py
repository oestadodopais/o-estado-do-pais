#!/usr/bin/env python3
"""O §0 do brief RP4 (o gráfico das séries no cartão e no recibo), medido sobre a cabeça presa do sítio (905105b7).
Lê só o repositório, pela cabeça presa (`git show` e `git grep`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-RP4.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "905105b7"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode in (0, 1) else None


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


# As séries no tempo e os seus pontos.
nomes = (git("ls-tree", "--name-only", CAB, "ledger/series/") or "").split()
ficheiros = [n for n in nomes if n.endswith(".yml")]
series = {n: (mostrar(n) or "") for n in ficheiros}
no_tempo = {n: s for n, s in series.items() if re.search(r'^eixo: "periodo"', s, re.M)}
# Só os pontos: a lista «pontos:» é a última do ficheiro; as lacunas também têm «- periodo:» e não contam (I196).
pontos = {n: len(re.findall(r"^  - periodo:", s.split("\npontos:\n", 1)[1] if "\npontos:\n" in s else "", re.M)) for n, s in no_tempo.items()}
medicao("series_no_tempo_no_livro", len(no_tempo) if ficheiros else NAO,
        f"git ls-tree {CAB} ledger/series/ · os ficheiros .yml com eixo: \"periodo\"",
        "a série do IPC está entre elas", "ledger/series/serie-ipc-variacao-homologa.yml" in no_tempo)
medicao("pontos_das_series_no_tempo", sum(pontos.values()) if no_tempo else NAO,
        f"git show {CAB}:ledger/series/<série>.yml · as linhas «  - periodo:» somadas nas séries no tempo",
        "a série do IPC tem mais de cem pontos", pontos.get("ledger/series/serie-ipc-variacao-homologa.yml", 0) > 100)
lacunas = {n: len(re.findall(r"^  - periodo:", s.split("\nlacunas:", 1)[1].split("\nbandeiras:", 1)[0] if "\nlacunas:" in s else "", re.M)) for n, s in no_tempo.items()}
medicao("lacunas_declaradas_nas_series_no_tempo", sum(lacunas.values()) if no_tempo else NAO,
        f"git show {CAB}:ledger/series/<série>.yml · as linhas «  - periodo:» dentro do bloco lacunas: de cada série no tempo, somadas",
        "a soma dos pontos com as lacunas dá a contagem antiga do §0 (4 133, a I196)", sum(pontos.values()) + sum(lacunas.values()) == 4133)
maior = max(pontos.items(), key=lambda kv: kv[1]) if pontos else None
medicao("pontos_da_maior_serie_no_tempo", maior[1] if maior else NAO,
        f"git show {CAB}:ledger/series/<série>.yml · o máximo das contagens de «  - periodo:»",
        "a maior é a do nível do índice de preços no consumidor", bool(maior) and maior[0].endswith("serie-ipc-indice.yml"))

# As linhas presas e as linhas do IPC sem série.
presas = (git("grep", "-l", "^serie: ", CAB, "--", "ledger/claims/") or "").split()
medicao("linhas_presas_a_uma_serie", len(presas) if presas is not None else NAO,
        f"git grep -l '^serie: ' {CAB} -- ledger/claims/",
        "a linha do IPC é uma delas", any(p.endswith("ledger/claims/ipc-variacao-homologa.yml") for p in presas))
do_ipc = (git("grep", "-l", "-E", "0014666|0014647", CAB, "--", "ledger/claims/") or "").split()
medicao("linhas_com_as_coordenadas_0014666_ou_0014647", len(do_ipc),
        f"git grep -l -E '0014666|0014647' {CAB} -- ledger/claims/",
        "a linha dos combustíveis é uma delas", any(p.endswith("ledger/claims/ipc-combustiveis-variacao-homologa.yml") for p in do_ipc))
medicao("dessas_as_presas_a_uma_serie", len(set(do_ipc) & set(presas)),
        "a interseção das duas medidas anteriores",
        "as duas listas foram lidas", bool(do_ipc) and bool(presas))

# As formas.
formas = mostrar("scripts/check-formas.mjs") or ""
m = re.search(r"FORMAS\.size !== (\d+)", formas)
medicao("formas_na_lista_fechada_da_check_formas", int(m.group(1)) if m else NAO,
        f"git show {CAB}:scripts/check-formas.mjs · o conhecido-positivo «FORMAS.size !== N»",
        "a forma serie-do-pais está declarada na lista", "'serie-do-pais'" in formas)
fora = (git("grep", "-c", "serie-do-pais", CAB, "--", "src/") or "").strip().splitlines()
medicao("ocorrencias_de_serie_do_pais_em_src", sum(int(l.rsplit(":", 1)[1]) for l in fora) if fora is not None else NAO,
        f"git grep -c serie-do-pais {CAB} -- src/",
        "a mesma procura em scripts/ acha o nome na check-formas", "serie-do-pais" in formas)
cartao = mostrar("src/components/CartaoDaMedida.astro") or ""
medicao("desenhos_svg_no_cartao_da_medida", cartao.count("<svg") if cartao else NAO,
        f"git show {CAB}:src/components/CartaoDaMedida.astro · as ocorrências de <svg",
        "o cartão lê serieDaLinha", "serieDaLinha(" in cartao)
vista = mostrar("src/views/SerieNoTempoView.astro") or ""
medicao("desenhos_svg_na_vista_do_recibo_da_serie_no_tempo", vista.count("<svg") if vista else NAO,
        f"git show {CAB}:src/views/SerieNoTempoView.astro · as ocorrências de <svg",
        "a vista escreve a tabela com data-serie-tabela e um PontoDaSerie por período",
        "data-serie-tabela" in vista and "<PontoDaSerie serie={id} chave={periodo}" in vista)
pp = mostrar("src/data/primeira-pagina.mjs") or ""
bloco = pp.split("export const BLOCOS_DA_PRIMEIRA_PAGINA")[1].split("\n];")[0] if "export const BLOCOS_DA_PRIMEIRA_PAGINA" in pp else ""
medicao("blocos_da_primeira_pagina_com_serie_no_tempo", len(re.findall(r"^\s+serie: ", bloco, re.M)) if bloco else NAO,
        f"git show {CAB}:src/data/primeira-pagina.mjs · as chaves «serie:» dentro de BLOCOS_DA_PRIMEIRA_PAGINA",
        "os blocos declaram a forma com «forma:»", len(re.findall(r"^\s+forma: '", bloco, re.M)) >= 4)

saida = {"brief": "design/observatorio/BRIEF-RP4-o-grafico-das-series-no-cartao-e-no-recibo.md",
         "guiao": "design/observatorio/medidas/BRIEF-RP4.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-RP4.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
