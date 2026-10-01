#!/usr/bin/env python3
"""O §0 do brief L2b (o concelho entre os 308), medido sobre a cabeça presa do sítio (a9509193). Não lê a rede: lê o
livro-razão, as vistas e as células na cabeça. Escreve design/observatorio/medidas/BRIEF-L2b.json (ou o caminho em
OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess
from collections import Counter

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "a9509193"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return r.stdout.split() if r.returncode == 0 else []


# 1 · as linhas por concelho: os sufixos de medida que existem para os concelhos, e quantos concelhos têm cada um
linhas = [f[:-4] for f in listar("ledger/claims") if f.endswith(".yml")]
sufixos = ["populacao-2025", "divida-dgal-2024", "limite-divida-dgal-2024", "indice-de-divida-2024", "ganho-medio-mensal-2024",
           "desemprego-registado-2025-12", "empresas-2024", "poder-de-compra-2023", "prazo-medio-de-pagamento-2025-12"]
por_sufixo = {s: sum(1 for l in linhas if l.endswith("-" + s) and not l.endswith("-limite-" + s) and l[: -len(s) - 1] in {x[: -len("-populacao-2025")] for x in linhas if x.endswith("-populacao-2025")}) for s in sufixos}
concelhos = sorted({l[: -len("-populacao-2025")] for l in linhas if l.endswith("-populacao-2025")})
medicao("concelhos_com_linha_de_populacao", len(concelhos) if linhas else NAO, f"git ls-tree {CAB}:ledger/claims · os ids que acabam em -populacao-2025",
        "«evora» é um deles", "evora" in concelhos)
medicao("medidas_com_linhas_por_concelho", sum(1 for s in sufixos if por_sufixo[s] >= 300) if linhas else NAO,
        "os sufixos de medida com pelo menos trezentas linhas de concelho", "o ganho médio mensal de 2024 é uma delas", por_sufixo["ganho-medio-mensal-2024"] >= 300)
medicao("linhas_do_ganho_medio_por_concelho", por_sufixo["ganho-medio-mensal-2024"] if linhas else NAO, "os ids que acabam em -ganho-medio-mensal-2024",
        "a de Abrantes existe", "abrantes-ganho-medio-mensal-2024" in linhas)

# 2 · a faixa da União: a posição conta-se na vista a partir da linha de série
fu = mostrar("src/lib/faixa-da-uniao.mjs") or ""
medicao("linhas_da_faixa_da_uniao_que_contam_o_lugar", len(re.findall(r"const lugar = 1 \+ paises\.filter", fu)) if fu else NAO,
        f"git show {CAB}:src/lib/faixa-da-uniao.mjs · «const lugar = 1 + paises.filter»", "a função posicao existe", "function posicao(" in fu)

# 3 · a página do concelho: os cartões vêm das peças por chave; a faixa não existe
mv = mostrar("src/views/MunicipioView.astro") or ""
medicao("faixas_na_pagina_do_concelho", len(re.findall(r"<Faixa\w*\b", mv)) if mv else NAO, f"git show {CAB}:src/views/MunicipioView.astro · as ocorrências de <Faixa",
        "a vista rende cartões do lugar", "<CartaoDoLugar" in mv)
# a referência nacional ao lado do ganho médio na ficha: a leitura breve cita a linha de Portugal?
lugar = mostrar("src/lib/lugar.mjs") or ""
medicao("referencias_nacionais_na_leitura_do_lugar", len(re.findall(r"ganho-medio-mensal-2024", lugar)) if lugar else NAO,
        f"git show {CAB}:src/lib/lugar.mjs · as citações da linha nacional ganho-medio-mensal-2024", "a leitura do lugar lê as peças por chave", "pecas.find" in lugar)

# 4 · as seis réguas à mão que ainda procuram o mapa ou a pesquisa na primeira página
reguas = ["tests/inicio/correcoes-a.mjs", "tests/inicio/lista.mjs", "tests/inicio/mapa-distritos.mjs", "tests/inicio/mapa-unidades.mjs", "tests/inicio/matriz.mjs", "tests/municipio/correcoes-c.mjs"]
com = [r for r in reguas if re.search(r"pp-lugares|/#mapa|data-pesquisa-bloco|pesquisa-bloco", mostrar(r) or "")]
medicao("reguas_a_mao_que_procuram_o_mapa_na_primeira_pagina", len(com) if all(mostrar(r) for r in reguas) else NAO,
        "as seis réguas do relatório do L2a, procuradas por pp-lugares, /#mapa ou pesquisa-bloco", "a matriz é uma delas", "tests/inicio/matriz.mjs" in com)

saida = {"brief": "design/observatorio/BRIEF-L2b-o-concelho-entre-os-308.md", "guiao": "design/observatorio/medidas/BRIEF-L2b.py",
         "cabeca_lida": CAB, "linhas_por_sufixo": por_sufixo, "reguas_com_o_mapa_antigo": com, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-L2b.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
