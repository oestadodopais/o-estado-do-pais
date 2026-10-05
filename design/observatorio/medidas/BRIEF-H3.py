#!/usr/bin/env python3
"""O §0 do brief H3 (a passagem de higiene de 05.10.2026: a caixa das sugestões pelo padrão dos sítios oficiais, a porta
«Europa» do menu, os países sobrepostos nas faixas), medido sobre a cabeça presa do sítio (40f0cb58). Lê só o repositório,
pela cabeça presa (`git show`), nunca a árvore de trabalho (§1.153). Escreve design/observatorio/medidas/BRIEF-H3.json
(ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess, collections

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "40f0cb58"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


sug = mostrar("src/data/sugestoes.mjs") or ""
m = re.search(r"nota: \{\s*pt:\s*((?:'[^']*'\s*\+?\s*)+),\s*en:", sug, re.S)
pt = "".join(re.findall(r"'([^']*)'", m.group(1))) if m else ""
medicao("palavras_da_nota_da_caixa_das_sugestoes_em_portugues", len(pt.split()) if pt else NAO,
        f"git show {CAB}:src/data/sugestoes.mjs · as palavras da nota pt (os segmentos entre plicas juntos)",
        "a nota fala do endereço IP e da CNPD", "endereço IP" in pt and "cnpd.pt" in pt)
rotas = mostrar("src/lib/routes.mjs") or ""
medicao("rotas_de_privacidade_no_sitio", len(re.findall(r"^\s+privacidade: \{", rotas, re.M)) if rotas else NAO,
        f"git show {CAB}:src/lib/routes.mjs · as chaves de rota «privacidade»",
        "a rota das sugestões existe", bool(re.search(r"^\s+sugestoes: \{", rotas, re.M)))
strings = mostrar("src/i18n/strings.mjs") or ""
medicao("portas_do_menu_com_o_nome_europa", len(re.findall(r"uniaoEuropeiaNoMenu: 'Europa'", strings)) if strings else NAO,
        f"git show {CAB}:src/i18n/strings.mjs · a cadeia uniaoEuropeiaNoMenu com o valor «Europa»",
        "a página chama-se «Portugal na União Europeia»", "uniaoEuropeia: 'Portugal na União Europeia'" in strings)
r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", CAB, "ledger/series/"], capture_output=True)
nomes = [n for n in r.stdout.decode().split() if n.endswith("-paises.yml")]
faixas = 0; repetidas = 0; maximo = 0
for n in nomes:
    t = mostrar(n) or ""
    vals = re.findall(r'^    valor: "([^"]*)"', t, re.M); c = collections.Counter(vals); faixas += 1
    if any(k > 1 for k in c.values()): repetidas += 1
    maximo = max(maximo, max(c.values()) if c else 0)
medicao("faixas_de_paises_no_livro", faixas if nomes else NAO, f"git ls-tree {CAB} ledger/series/ · os ficheiros *-paises.yml",
        "a faixa do índice harmonizado está entre elas", any(n.endswith("ihpc-variacao-homologa-paises.yml") for n in nomes))
medicao("faixas_com_paises_no_mesmo_valor", repetidas if nomes else NAO,
        f"git show {CAB}:ledger/series/<faixa>.yml · as faixas em que dois ou mais pontos têm o mesmo valor",
        "a do desemprego de longa duração tem valores repetidos", bool(re.search(r"desemprego-de-longa-duracao", " ".join(n for n in nomes if n))))
medicao("maximo_de_paises_no_mesmo_valor_numa_faixa", maximo if nomes else NAO,
        f"git show {CAB}:ledger/series/<faixa>.yml · o maior número de pontos com o mesmo valor numa faixa",
        "é maior do que um", maximo > 1)
saida = {"brief": "design/observatorio/BRIEF-H3-a-passagem-de-higiene-de-05-10.md", "guiao": "design/observatorio/medidas/BRIEF-H3.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-H3.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
