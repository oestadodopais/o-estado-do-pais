#!/usr/bin/env python3
"""O §0 do brief PP1 (a primeira página de um leitor comum), medido sobre a cabeça presa do ramo
(CAB, o commit que traz as declarações dos blocos do lugar de direção por cima da passagem C1c).
Não lê o motor: o portão dos briefs corre numa máquina sem ele (a M34). Escreve
design/observatorio/medidas/BRIEF-PP1.json (ou o caminho em OEDP_MEDIDAS_JSON, que é como o
scripts/check-briefs.py o corre). Cada medição leva o comando e um conhecido-positivo; o que não
conseguir ler fica «NÃO LIDO»."""
import json, re, subprocess, pathlib, os, html
SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "2613664f"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), "-c", "core.quotepath=off", *args], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None
def mostrar(caminho):
    return git("show", f"{CAB}:{caminho}")
def entre(t, abre, fecha_tag):
    """O pedaço de `t` desde a abertura `abre` até ao fecho equilibrado da mesma etiqueta."""
    i = t.find(abre)
    if i < 0: return ""
    nome = re.match(r"<([a-z0-9]+)", abre).group(1)
    prof, j = 0, i
    for m in re.finditer(rf"<(/?){nome}\b[^>]*>", t[i:]):
        prof += -1 if m.group(1) else 1
        if prof == 0:
            return t[i:i + m.end()]
    return ""
def texto(t):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t))).strip()
def numero(v):
    return float(str(v).replace(" ", "").replace(" ", "").replace(" ", "").replace("−", "-").replace(",", "."))

# 1 · a primeira página de hoje, congelada no fim do C1
P = "design/especime-v3/medicoes/c1-2026-09-28/paginas-depois/index.html"
p = mostrar(P) or ""
temas = entre(p, '<section class="pais-temas"', "section")
arts = [a for a in re.findall(r"<article\b.*?</article>", temas, re.S) if "data-claim=" in a]
medicao("cartoes_na_primeira_pagina", len(arts) if p else NAO, f"git show {CAB}:{P} · a secção pais-temas, os article com data-claim",
        "o cartão da taxa de emprego está entre eles", any('data-claim="taxa-de-emprego-2025"' in a for a in arts))
h3 = [texto(x) for x in re.findall(r"<h3\b.*?</h3>", temas, re.S)]
medicao("temas_na_primeira_pagina", len(h3) if p else NAO, "a mesma secção · os h3", "a Habitação é um deles", "Habitação" in h3)
mapa = entre(p, '<div class="pais-mapa"', "div")
medicao("mapas_na_primeira_pagina", len(re.findall(r"<svg\b", mapa)) if p else NAO, "o div pais-mapa · os svg",
        "o svg é o mapa dos distritos e das ilhas, com uma área por unidade", "Mapa dos distritos e das ilhas" in mapa)
cab_texto = entre(p, '<div class="pais-texto"', "div")
medicao("numeros_no_mapa", len(re.findall(r'data-claim="', mapa)) if p else NAO, "o div pais-mapa · os data-claim",
        "o mesmo detetor encontra data-claim no texto ao lado", len(re.findall(r'data-claim="', cab_texto)) > 0)
mudou = entre(p, '<ol class="pais-mudou"', "ol")
itens = re.findall(r"<li\b", mudou)
medicao("mudancas_na_primeira_pagina", len(itens) if p else NAO, "a lista ol.pais-mudou · os li", "uma das mudanças é a de 23.09.2026", 'datetime="2026-09-23' in mudou)
palavras = [w for w in texto(cab_texto).split(" ") if re.search(r"\w", w)]
medicao("palavras_antes_do_primeiro_titulo", len(palavras) if p else NAO, "o div pais-texto, que abre a página antes do primeiro h2 · as palavras do texto",
        "o texto fala da dívida pública", "dívida" in texto(cab_texto))
ids_cab = sorted(set(re.findall(r'data-claim="([^"]+)"', cab_texto)))
medicao("numeros_antes_do_primeiro_titulo", len(ids_cab) if p else NAO, "o mesmo div · as linhas distintas nos data-claim",
        "a dívida pública de 2025 é uma delas", "divida-publica-2025" in ids_cab)

# 2 · a leitura do país, que prende nove valores e para a construção quando um muda
L = "src/components/inicio/LeituraDoPais.astro"
l = mostrar(L) or ""
esp = re.search(r"const esperados = \{(.*?)\};", l, re.S)
pares = re.findall(r"'([a-z0-9-]+)':\s*'([^']+)'", esp.group(1)) if esp else []
medicao("valores_fixos_da_leitura_do_pais", len(pares) if esp else NAO, f"git show {CAB}:{L} · as entradas de const esperados",
        "a dívida pública de 2025 está presa em 89,7", ("divida-publica-2025", "89,7") in pares)
medicao("leitura_do_pais_para_a_construcao", ("throw new Error" in l and "mudou; parar a frase" in l) if l else NAO,
        "o mesmo ficheiro · um throw quando um valor preso muda", "o ficheiro lê as linhas do livro", "getClaim(" in l)

# 3 · as declarações dos cinco blocos, e as condições contra o livro-razão desta cabeça
B = "design/observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs"
b = mostrar(B) or ""
blocos = b[:b.find("export const ENTRADAS")] if "export const ENTRADAS" in b else ""
ids_bloco = [m.group(1) for m in re.finditer(r"^  \{\n    id: '([a-z]+)'", blocos, re.M)]
medicao("blocos_declarados", len(ids_bloco) if b else NAO, f"git show {CAB}:{B} · os blocos de primeiro nível", "um deles é o da casa", "casa" in ids_bloco)
chaves = r"(?:(?<=\{ )|(?<=, ))(?:claim|periodo|publicado|referencia|a|b|pt|ue|total):\s*'([a-z0-9]+(?:-[a-z0-9]+)+)'"
linhas = set(re.findall(chaves, blocos))
for lst in re.findall(r"(?:linhas|colunas|compara|mesmo_periodo):\s*\[([^\]]*)\]", blocos):
    linhas.update(re.findall(r"'([a-z0-9]+(?:-[a-z0-9]+)+)'", lst))
medicao("linhas_dos_blocos", len(linhas) if b else NAO, "o mesmo ficheiro · os identificadores de linha nos pedaços, nas condições e nos desenhos",
        "os combustíveis estão entre elas", "ipc-combustiveis-variacao-homologa" in linhas)
arvore = set((git("ls-tree", "-r", "--name-only", CAB, "--", "ledger/claims/") or "").splitlines())
existe = lambda i: f"ledger/claims/{i}.yml" in arvore
medicao("linhas_dos_blocos_no_livro", sum(1 for i in linhas if existe(i)) if arvore else NAO, f"git ls-tree {CAB} -- ledger/claims/ · as linhas dos blocos que lá estão",
        "o mesmo detetor diz ausente uma linha que não existe", not existe("linha-que-nao-existe"))
cache = {}
def linha(i):
    if i not in cache:
        y = mostrar(f"ledger/claims/{i}.yml") or ""
        v = re.search(r'^value:\s*"?([^"\n]+)"?', y, re.M); r = re.search(r'^reference_date:\s*"?([^"\n]+)"?', y, re.M)
        cache[i] = (numero(v.group(1)) if v else None, r.group(1).strip() if r else None)
    return cache[i]
R = "src/data/enquadramento/referencias.json"
try:
    refs = {x["id_da_linha"]: x["limiar"] for x in json.loads(mostrar(R) or "{}").get("indicadores", []) if x.get("limiar")}
except Exception:
    refs = {}
def avaliar(a, op, k, v):
    va = linha(a)[0]
    vb = linha(v)[0] if k == "b" else numero(v) if k == "valor" else numero(refs[v].strip("%+")) if v in refs else None
    if va is None or vb is None: return None
    return {">": va > vb, "<": va < vb, "=": va == vb, "!=": va != vb}[op]
conds = re.findall(r"\{ a: '([a-z0-9-]+)', op: '([<>=!]+)', (b|valor|referencia): '?([a-z0-9.-]+)'? \}", blocos)
res = [avaliar(*c) for c in conds]
medicao("condicoes_dos_blocos", len(conds) if b else NAO, "o mesmo ficheiro · as condições de comparação dos blocos e das peças", "uma delas compara os combustíveis com as rendas",
        ("ipc-combustiveis-variacao-homologa", ">", "b", "ipc-rendas-variacao-homologa") in conds)
medicao("condicoes_verdadeiras", sum(1 for x in res if x is True) if b else NAO, f"as mesmas condições · avaliadas com os valores das linhas em {CAB} e os limiares de {R}",
        "o mesmo avaliador diz falsa a condição invertida das rendas acima dos combustíveis", avaliar("ipc-rendas-variacao-homologa", ">", "b", "ipc-combustiveis-variacao-homologa") is False)
grupos = [re.findall(r"'([a-z0-9-]+)'", g) for g in re.findall(r"mesmo_periodo:\s*\[([^\]]*)\]", blocos)]
medicao("condicoes_do_mesmo_periodo", len(grupos) if b else NAO, "o mesmo ficheiro · as condições mesmo_periodo", "a dos preços junta cinco linhas", any(len(g) == 5 for g in grupos))
medicao("condicoes_do_mesmo_periodo_verdadeiras", sum(1 for g in grupos if len({linha(i)[1] for i in g}) == 1) if b else NAO,
        f"as mesmas · os períodos de referência das linhas em {CAB}", "o mesmo detetor vê dois períodos num grupo que mistura um ano e um mês",
        len({linha("ipc-variacao-homologa")[1], linha("taxa-de-emprego-2025")[1]}) == 2)

# 4 · as seis entradas, contra os cartões da página dos temas congelada
ent = b[b.find("export const ENTRADAS"):] if "export const ENTRADAS" in b else ""
cartoes = re.findall(r"'([a-z0-9-]+)'", " ".join(re.findall(r"cartoes:\s*\[([^\]]*)\]", ent)))
medicao("entradas_declaradas", len(re.findall(r"^  \{\n    id: '", ent, re.M)) if ent else NAO, "o mesmo ficheiro · as entradas de primeiro nível", "uma delas é a dos lugares, que já existe", "existente: true" in ent)
medicao("cartoes_nas_entradas", len(cartoes) if ent else NAO, "as mesmas entradas · os identificadores das listas cartoes", "a pensão média está na do dinheiro", "pensao-media-anual-2025" in cartoes)
repetidos = len(cartoes) - len(set(cartoes))
medicao("cartoes_repetidos_nas_entradas", repetidos if ent else NAO, "as mesmas listas · as ocorrências a mais", "o mesmo contador vê uma repetição numa lista com um nome duas vezes",
        (lambda x: len(x) - len(set(x)))(["a", "b", "a"]) == 1)
T = "design/especime-v3/medicoes/c1-2026-09-28/paginas-depois/temas_index.html"
tt = mostrar(T) or ""
corpo = tt[tt.find("<main"):tt.find("</main>")]
dos_temas = []
for a in re.findall(r"<article\b.*?</article>", corpo, re.S):
    m = re.search(r'data-claim="([^"]+)"', a)
    if m: dos_temas.append(m.group(1))
medicao("artigos_da_pagina_dos_temas", len(dos_temas) if tt else NAO, f"git show {CAB}:{T} · os article com data-claim, pela primeira linha de cada um",
        "a página tem o cartão das necessidades médicas", "necessidades-medicas-nao-satisfeitas-2025" in dos_temas)
fora = [c for c in dos_temas if c not in cartoes]
medicao("cartoes_fora_das_entradas", len(fora) if tt and ent else NAO, "os cartões da página dos temas que nenhuma entrada leva", "o índice da dívida do município é um deles", "indice-de-divida-limite-legal" in fora)
medicao("cartoes_das_entradas_fora_dos_temas", len([c for c in cartoes if c not in dos_temas]) if tt and ent else NAO, "os cartões das entradas que a página dos temas não tem",
        "o mesmo detetor vê um cartão inventado fora dos temas", "cartao-inventado" not in dos_temas)

saida = {"brief": "design/observatorio/BRIEF-PP1-a-primeira-pagina-de-um-leitor-comum.md", "guiao": "design/observatorio/medidas/BRIEF-PP1.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-PP1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
