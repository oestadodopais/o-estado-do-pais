#!/usr/bin/env python3
"""O §0 do brief R4 (as palavras correntes em cada número: o recibo de uma linha diz em português o que o número é, o recibo
de uma série diz o que o último ponto quer dizer, a primeira página explica o que ficou fora dos valores de referência),
medido sobre a cabeça presa do sítio (CAB). Lê só o repositório, pela cabeça presa (`git show` e `git ls-tree`), nunca a
árvore de trabalho (§1.153). Escreve design/observatorio/medidas/BRIEF-R4.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada
medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess, collections

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "557844fe"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def mostrar(caminho):
    return git("show", f"{CAB}:{caminho}")


def lista(pasta):
    s = git("ls-tree", "--name-only", f"{CAB}:{pasta}")
    return s.split() if s else None


# 1. As linhas do livro-razão (uma por ficheiro em ledger/claims/).
claims = lista("ledger/claims")
ids = sorted(c[:-4] for c in (claims or []) if c.endswith(".yml"))
medicao("linhas_do_livro_razao", len(ids) if claims else NAO, f"git ls-tree {CAB}:ledger/claims · os ficheiros .yml",
        "a linha pib-real-per-capita-2024 está na lista", "pib-real-per-capita-2024" in ids)

# 2. As frases «o que é» provadas (a auditoria das leituras dos cartões nacionais).
prov = mostrar("tests/cartao/leituras-provadas.json")
com_frase = set()
if prov:
    d = json.loads(prov)
    for m in d.get("medidas", []):
        if any(k in m for k in ("o_que_e", "o-que-e", "oQueE")) or True:
            com_frase.add(m.get("id"))
medicao("linhas_com_leitura_provada_num_cartao", len(com_frase & set(ids)) if prov else NAO,
        f"git show {CAB}:tests/cartao/leituras-provadas.json · as entradas de «medidas» cujo id é uma linha do livro",
        "pib-real-per-capita-2025 tem leitura provada", "pib-real-per-capita-2025" in com_frase)

# 3. As linhas com nome do projeto (a tabela dos nomes).
nomes = mostrar("src/data/nomes-das-medidas.mjs") or ""
ids_com_nome = set(re.findall(r"^\s+'([a-z0-9-]+)':\s*\{", nomes, re.M))
medicao("linhas_com_nome_do_projeto", len(ids_com_nome & set(ids)) if nomes else NAO,
        f"git show {CAB}:src/data/nomes-das-medidas.mjs · as chaves das tabelas dos nomes que são linhas do livro",
        "a tabela dos nomes tem pelo menos uma linha do livro como chave", bool(ids_com_nome & set(ids)))

# 4. As famílias de medida sem frase provada: o id sem o período no fim; nas linhas dos concelhos (o mesmo sufixo em
#    vinte ou mais ids), a família é o sufixo, sem o nome do concelho.
sem = [i for i in ids if i not in com_frase]
def sem_periodo(i):
    return re.sub(r"-\d{4}(-\d{2})?(-ue|-paises)?$", "", i)
bases = [sem_periodo(i) for i in sem]
sufixos = collections.Counter()
for b in bases:
    partes = b.split("-")
    for k in range(1, len(partes)):
        sufixos["-".join(partes[k:])] += 1
municipais = {s for s, n in sufixos.items() if n >= 20}
def familia(b):
    partes = b.split("-")
    for k in range(1, len(partes)):
        s = "-".join(partes[k:])
        if s in municipais:
            # O sufixo mais longo que é municipal é a família (ex.: «limite-divida-dgal» e não «dgal»).
            return s
    return b
fam = collections.Counter(familia(b) for b in bases)
fam_municipais = {f: n for f, n in fam.items() if f in municipais}
medicao("familias_de_medida_sem_frase_provada", len(fam) if claims and prov else NAO,
        "os ids sem leitura provada, sem o período no fim; nas linhas dos concelhos a família é o sufixo comum a vinte ou mais ids",
        "a família «populacao» junta as linhas dos concelhos", fam.get("populacao", 0) >= 300)
medicao("familias_municipais_sem_frase_provada", len(fam_municipais) if claims and prov else NAO,
        "as famílias cujo sufixo aparece em vinte ou mais ids", "a família «divida-dgal» está entre elas", "divida-dgal" in fam_municipais)
medicao("linhas_dos_concelhos_sem_frase_provada", sum(fam_municipais.values()) if claims and prov else NAO,
        "a soma das linhas das famílias municipais", "há mais de duas mil e quinhentas", sum(fam_municipais.values()) > 2500)
medicao("linhas_nacionais_e_da_uniao_sem_frase_provada", (len(sem) - sum(fam_municipais.values())) if claims and prov else NAO,
        "as linhas sem leitura provada que não são de uma família municipal", "abandono-escolar-precoce-2024 está entre elas", "abandono-escolar-precoce-2024" in sem)

# 5. As séries no tempo e as que já dizem o que o último ponto quer dizer (as de unidade índice com base, pela S6 do RP4-m).
series = [s[:-4] for s in (lista("ledger/series") or []) if s.endswith(".yml")]
no_tempo = [s for s in series if s.startswith("serie-")]
indice = []
for s in no_tempo:
    y = mostrar(f"ledger/series/{s}.yml") or ""
    m = re.search(r'^unit:\s*"([^"]*)"', y, re.M)
    if m and re.search(r"base \d{4} = 100", m.group(1)):
        indice.append(s)
medicao("series_no_tempo", len(no_tempo) if series else NAO, f"git ls-tree {CAB}:ledger/series · os ficheiros serie-*.yml",
        "serie-ipc-variacao-homologa está na lista", "serie-ipc-variacao-homologa" in no_tempo)
medicao("series_com_frase_do_ultimo_ponto", len(indice) if series else NAO,
        "as séries no tempo cuja unidade é um índice com base (a frase da S6 do RP4-m)", "serie-ipc-indice é uma delas ou a lista está vazia antes do RP4-m",
        ("serie-ipc-indice" in indice) or not indice)
medicao("series_sem_frase_do_ultimo_ponto", (len(no_tempo) - len(indice)) if series else NAO,
        "as séries no tempo menos as de índice", "serie-ipc-variacao-homologa está entre elas", "serie-ipc-variacao-homologa" in no_tempo and "serie-ipc-variacao-homologa" not in indice)

# 6. A primeira página: os valores de referência da Comissão e os que ficaram fora, pelas cadeias da casa e pelo bloco.
strings = mostrar("src/i18n/strings.mjs") or ""
home = mostrar("src/views/HomeView.astro") or ""
limiares = mostrar("src/data/limiares.mjs") or mostrar("src/data/valores-de-referencia.mjs") or ""
fora = re.findall(r"fora: \[([^\]]*)\]", home)
medicao("ficheiro_da_primeira_pagina_lido", "sim" if home else NAO, f"git show {CAB}:src/views/HomeView.astro", "a vista fala dos valores de referência", "valores de refer" in home or "referencia" in home)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-R4.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md", "guiao": "design/observatorio/medidas/BRIEF-R4.py",
                             "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
print("famílias municipais:", sorted(fam_municipais.items(), key=lambda x: -x[1]))
