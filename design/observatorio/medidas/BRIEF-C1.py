#!/usr/bin/env python3
"""O §0 do brief C1 (as correções de confiança), medido sobre a cabeça presa do sítio (a677770f).
Não lê o motor: o portão dos briefs corre numa máquina sem ele (a M34). Escreve
design/observatorio/medidas/BRIEF-C1.json (ou o caminho em OEDP_MEDIDAS_JSON, que é como o
scripts/check-briefs.py o corre). Cada medição leva o comando e um conhecido-positivo; o que não
conseguir ler fica «NÃO LIDO»."""
import json, re, subprocess, pathlib, os
SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "a677770f"
PAINEL = "17758ec7"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), "-c", "core.quotepath=off", *args], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None
def mostrar(caminho):
    return git("show", f"{CAB}:{caminho}")

# 1 · a I158: a linha do valor dos cartões, com o valor colado à unidade no texto da página
PAG = "design/especime-v3/medicoes/rp1-2026-09-26/paginas-depois/temas_index.html"
t = mostrar(PAG) or ""
cartoes = len(re.findall(r'data-cartao-medida="', t))
colados = len(re.findall(r'cartao-medida-num">[^<]*</span><span class="campo-valor cartao-medida-unidade"', t))
separados = len(re.findall(r'cartao-medida-num">[^<]*</span>\s+<span class="campo-valor cartao-medida-unidade"', t))
medicao("cartoes_na_pagina_dos_temas", cartoes if t else NAO, f"git show {CAB}:{PAG} · ocorrências de data-cartao-medida",
        "a página tem o cartão da inflação", 'data-cartao-medida="ipc-variacao-homologa"' in t)
medicao("valores_colados_a_unidade", colados if t else NAO, "a mesma página · o valor do cartão fecha e a unidade abre sem espaço entre elas",
        "o valor da inflação está entre os colados", bool(re.search(r'data-claim="ipc-variacao-homologa"[^>]*cartao-medida-num">[^<]*</span><span class="campo-valor cartao-medida-unidade"', t)))
medicao("valores_separados_da_unidade", separados if t else NAO, "a mesma página · o valor e a unidade com espaço entre eles",
        "o detetor do separado vê um caso construído", bool(re.search(r'cartao-medida-num">[^<]*</span>\s+<span class="campo-valor cartao-medida-unidade"', '<span class="cartao-medida-num">3</span> <span class="campo-valor cartao-medida-unidade">')))

# 2 · a I159: a frase fixa da inflação e os ramos da União que pressupõem uma subida
L = "src/data/leituras-rp1.mjs"
l = mostrar(L) or ""
fixas = l.count("É a subida geral dos preços") + l.count("That is the general rise in prices")
medicao("frases_fixas_da_subida", fixas if l else NAO, f"git show {CAB}:{L} · «É a subida geral dos preços» e «That is the general rise in prices»",
        "o ficheiro declara as leituras do RP1", "LEITURAS_RP1" in l)
ramos = l.count("A subida é ") + l.count("The rise is ")
medicao("ramos_da_uniao_com_subida", ramos if l else NAO, "o mesmo ficheiro · «A subida é » e «The rise is »", "o ficheiro tem a leitura do IHPC", "ihpc-variacao-homologa" in l)

# 3 · a I160: a gramática das rendas na frase selada
F = "design/especime-v3/medicoes/rp1-2026-09-26/leituras-seladas.json"
try:
    f = json.loads(mostrar(F) or "{}")
    rendas = f.get("ipc-rendas-variacao-homologa", {}).get("pt", "")
except Exception:
    rendas = ""
medicao("rendas_com_dos_de_ha_um_ano", rendas.count("acima dos de há um ano") if rendas else NAO, f"git show {CAB}:{F} · a frase portuguesa das rendas · «acima dos de há um ano»",
        "a frase das rendas existe e fala das rendas", "as rendas pagas pelos inquilinos" in rendas)

# 4 · a I161: o valor selado da dívida das famílias da União, a última releitura e o valor revisto que o painel registou
D = "ledger/claims/divida-das-familias-2025-ue.yml"
d = mostrar(D) or ""
v = re.search(r'^value:\s*"([^"]+)"', d, re.M)
medicao("valor_selado_da_divida_das_familias_ue", v.group(1) if v else NAO, f"git show {CAB}:{D} · value", "a linha é do conjunto tipspd22", "tipspd22" in d)
res = re.findall(r'^\s+result:\s*"([^"]+)"', d, re.M)
medicao("ultima_releitura_da_divida_das_familias_ue", res[-1] if res else NAO, "a mesma linha · o último result da lista das reconferências", "a lista tem reconferências", len(res) > 0)
corpo = git("log", "-1", "--format=%B", PAINEL) or ""
m = re.search(r"de (\d+,\d) para (\d+,\d) % do PIB", corpo)
medicao("valor_revisto_segundo_o_painel", m.group(2) if m else NAO, f"git log -1 --format=%B {PAINEL} · «de A para B % do PIB»", "o commit é o do painel de 28.09", "Painel semanal de 28.09" in corpo)

# 5 · a I162: as linhas do PIB real por habitante com a última releitura inacessível
lista = git("ls-tree", "-r", "--name-only", CAB, "--", "ledger/claims/") or ""
pib = [x for x in lista.splitlines() if re.search(r"/pib-real-per-capita-\d{4}(-ue)?\.yml$", x)]
inac = 0
for x in pib:
    r = re.findall(r'^\s+result:\s*"([^"]+)"', mostrar(x) or "", re.M)
    if r and r[-1] == "inacessivel": inac += 1
medicao("linhas_do_pib_por_habitante", len(pib) if lista else NAO, f"git ls-tree {CAB} -- ledger/claims/ · pib-real-per-capita-AAAA(-ue).yml", "a lista traz a linha de 2025", any(x.endswith("pib-real-per-capita-2025.yml") for x in pib))
medicao("linhas_do_pib_com_releitura_inacessivel", inac if lista else NAO, "as mesmas linhas · o último result é «inacessivel»", "há linhas do PIB com reconferências", len(pib) > 0)

# 6 · a F01 da avaliação do Codex: o ficheiro «/dados/municipios-308.csv» que a página dos lugares oferece, gerado por csvMunicipios()
G = "src/lib/dados.mjs"
g = mostrar(G) or ""
k = g.find("export function csvMunicipios()")
cab = re.search(r"linha\(\[([^\]]*)\]\)", g[k:]) if k >= 0 else None
cols = [x.strip().strip("'\"") for x in cab.group(1).split(",")] if cab else []
medicao("colunas_do_csv_dos_concelhos", len(cols) if cab else NAO, f"git show {CAB}:{G} · csvMunicipios(), a linha do cabeçalho", "a primeira coluna é o concelho", bool(cols) and cols[0] == "municipio")
medicao("colunas_com_um_indicador", sum(1 for x in cols if x not in ("municipio", "distrito", "regiao", "x", "y")) if cab else NAO,
        "as mesmas colunas · as que não são o nome, o distrito, a região ou as coordenadas", "o cabeçalho traz as coordenadas", "x" in cols and "y" in cols)

saida = {"brief": "design/observatorio/BRIEF-C1-as-correcoes-de-confianca.md", "guiao": "design/observatorio/medidas/BRIEF-C1.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-C1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
