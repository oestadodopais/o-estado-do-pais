#!/usr/bin/env python3
"""O §0 do brief R2 (os rótulos do sítio: claros, exatos e os certos para cada caso), medido sobre a cabeça presa do sítio
(CAB) e sobre o inventário dos cartões construídos que o brief traz. Não lê a rede. Escreve design/observatorio/medidas/BRIEF-R2.json
(ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess, collections

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "197c6dd4"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "-r", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return [f"{pasta}/{f}" for f in r.stdout.split()] if r.returncode == 0 else []


# 1 · as unidades declaradas nas linhas do livro
linhas = [f for f in listar("ledger/claims") if f.endswith(".yml")]
unidades = collections.Counter(); nomes = collections.Counter()
for f in linhas:
    t = mostrar(f) or ""
    m = re.search(r'^unit:\s*"(.*)"', t, re.M)
    if m: unidades[m.group(1)] += 1
    m = re.search(r'^name:\s*"(.*)"', t, re.M)
    if m: nomes[m.group(1)] += 1
medicao("linhas_do_livro", len(linhas) if linhas else NAO, f"git ls-tree -r {CAB}:ledger/claims · os .yml", "a do índice de dívida de Évora é uma delas", "ledger/claims/evora-indice-de-divida-2024.yml" in linhas)
medicao("unidades_distintas_nas_linhas", len(unidades) if linhas else NAO, "o campo unit de cada linha, formas distintas", "«euros por mês» é uma delas", "euros por mês" in unidades)
euro = [u for u in unidades if u.startswith("€")]
medicao("unidades_com_o_simbolo_do_euro_em_vez_da_palavra", len(euro) if linhas else NAO, "as unidades que começam por «€», contra a regra de livro.mjs («euros por mês», não «€ por mês»)", "«€ por mês» é uma delas", "€ por mês" in euro)
medicao("unidades_que_dizem_um_limite_na_propria_unidade", sum(1 for u in unidades if "limite" in u) if linhas else NAO, "as unidades com a palavra «limite»", "a do índice de dívida", "% (limite legal = 150)" in unidades)
medicao("unidades_de_indice_com_base_cem", sum(1 for u in unidades if "= 100" in u) if linhas else NAO, "as unidades com «= 100»", "«índice (Portugal = 100)» é uma delas", "índice (Portugal = 100)" in unidades)
medicao("nomes_de_medida_distintos_nas_linhas", len(nomes) if linhas else NAO, "o campo name de cada linha, formas distintas", "o título do INE do poder de compra é um deles", any("Poder de compra" in n for n in nomes))

# 2 · o dicionário das unidades inglesas
dic = mostrar("src/i18n/unidades.mjs") or ""
entradas = dict(re.findall(r"^\s{2}'([^']+)':\s*'([^']*)'", dic, re.M))
medicao("entradas_do_dicionario_das_unidades_inglesas", len(entradas) if dic else NAO, f"git show {CAB}:src/i18n/unidades.mjs · as linhas «'pt': 'en'»", "a do índice de dívida está lá", "% (limite legal = 150)" in entradas)
sem = [u for u in unidades if u not in entradas]
medicao("unidades_das_linhas_sem_entrada_inglesa", len(sem) if dic and linhas else NAO, "as unidades das linhas que não têm entrada no dicionário (rendem-se em português na edição inglesa)", "«factor» é uma delas", "factor" in sem)

# 3 · o inventário dos cartões construídos que o brief traz (medido pelo lugar de direção com inventario-rotulos.py)
inv_caminho = SITIO / "design" / "observatorio" / "medidas" / "inventario-rotulos-R2.json"
inv = json.loads(inv_caminho.read_text(encoding="utf-8")) if inv_caminho.exists() else None
medicao("paginas_construidas_lidas_pelo_inventario", inv["paginas"] if inv else NAO, "o campo paginas de inventario-rotulos-R2.json", "a contagem de cartões é maior do que zero", bool(inv and inv["cartoes"] > 0))
medicao("cartoes_de_medida_nas_paginas", inv["cartoes"] if inv else NAO, "o campo cartoes do mesmo ficheiro", "há cartões em inglês e em português", bool(inv and any(k.startswith("en:") for k in inv["medidas"]) and any(k.startswith("pt:") for k in inv["medidas"])))
def formas(campo, ed):
    return len({x for k, c in inv["medidas"].items() if k.startswith(ed + ":") for x in c.get(campo, {}) if x}) if inv else None
medicao("formas_distintas_da_unidade_nos_cartoes_portugueses", formas("unidade", "pt") if inv else NAO, "as formas distintas do campo unidade nas chaves pt: do inventário", "«% da receita média de três anos» é uma delas", bool(inv and any("% da receita média de três anos" in c.get("unidade", {}) for k, c in inv["medidas"].items() if k.startswith("pt:"))))
medicao("formas_distintas_do_estado_nos_cartoes_portugueses", formas("estado", "pt") if inv else NAO, "as formas distintas do campo estado nas chaves pt:", "«dentro do limite legal, que é #» é uma delas", bool(inv and any(any(e.startswith("dentro do limite legal, que é") for e in c.get("estado", {})) for k, c in inv["medidas"].items() if k.startswith("pt:"))))
medicao("formas_distintas_da_dobra_nos_cartoes_portugueses", formas("dobra", "pt") if inv else NAO, "as formas distintas do campo dobra (a definição) nas chaves pt:", "a definição da dívida contra a receita de três anos é uma delas", bool(inv and any(any("receita corrente" in d for d in c.get("dobra", {})) for k, c in inv["medidas"].items() if k.startswith("pt:"))))

saida = {"brief": "design/observatorio/BRIEF-R2-os-rotulos-do-sitio.md", "guiao": "design/observatorio/medidas/BRIEF-R2.py",
         "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-R2.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
