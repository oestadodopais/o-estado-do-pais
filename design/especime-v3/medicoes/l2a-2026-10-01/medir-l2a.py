#!/usr/bin/env python3
"""As medidas do bloco L2a (o mapa primeiro), para o relatório: cada uma com o nome, o valor, o comando e um
conhecido-positivo que o MESMO detetor tem de encontrar. Lê a vista de «Lugares» e a primeira página na cabeça,
a construção em `dist/` (que tem de ser da cabeça do código que mede), as capturas do bloco, os registos das
plantas e os códigos dos portões guardados na pasta do bloco. O que não conseguir ler fica «NÃO LIDO».
Uso, da raiz da worktree: python3 design/especime-v3/medicoes/l2a-2026-10-01/medir-l2a.py
Escreve design/especime-v3/medicoes/l2a-2026-10-01/medidas.json (ou o caminho em OEDP_MEDIDAS_JSON)."""
import json, os, pathlib, re, struct, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[4]
PASTA = SITIO / "design/especime-v3/medicoes/l2a-2026-10-01"
CAPTURAS = SITIO / "design/especime-v3/capturas/l2a-2026-10-01"
DIST = SITIO / "dist"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def ler(caminho):
    try:
        return pathlib.Path(caminho).read_text(encoding="utf-8")
    except OSError:
        return None


def png(nome):
    try:
        b = (CAPTURAS / nome).read_bytes()
    except OSError:
        return None, None
    return struct.unpack(">II", b[16:24]) if b[:8] == b"\x89PNG\r\n\x1a\n" else (None, None)


# 1 · a ordem das peças na vista de «Lugares» (o mesmo detetor do §0 do brief, sobre a cabeça)
lv = ler(SITIO / "src/views/LugaresView.astro") or ""
pos = [(m.start(), n) for n, p in [("pesquisa", r"<Pesquisa\b"), ("regioes", r'data-lista-lugares="regioes"'),
                                    ("distritos", r'data-lista-lugares="distritos"'), ("mapa", r"<MapaRespira\b")]
       for m in [re.search(p, lv)] if m]
ordem = [n for _, n in sorted(pos)]
medicao("pecas_de_lugares_antes_do_mapa", ordem.index("mapa") if "mapa" in ordem else NAO,
        "a ordem de <Pesquisa, das duas listas e de <MapaRespira em src/views/LugaresView.astro (o detetor do §0 do brief)",
        "a pesquisa vem antes do mapa", ordem[:1] == ["pesquisa"] and "mapa" in ordem)

b = json.loads(ler(SITIO / "design/observatorio/medidas/BRIEF-L2a.json") or "{}")
antes = next((x["valor"] for x in b.get("medidas", []) if x["nome"] == "pecas_de_lugares_antes_do_mapa"), NAO)
medicao("pecas_de_lugares_antes_do_mapa_no_brief", antes, "design/observatorio/medidas/BRIEF-L2a.json, a medida pecas_de_lugares_antes_do_mapa (o §0 do brief, na cabeça 1395c9de)",
        "o ficheiro do brief nomeia a cabeça que leu", bool(b.get("cabeca_lida")))
r = subprocess.run(["node", "-e", "import('./src/data/carta-dos-lugares.mjs').then(m=>{const L=m.lugaresDaCarta();console.log(JSON.stringify({n:L.length,evora:L.some(x=>x.nome==='Évora')}))})"],
                   cwd=str(SITIO), capture_output=True, text=True)
c = json.loads(r.stdout) if r.returncode == 0 and r.stdout.strip() else {}
medicao("concelhos_na_carta", c.get("n", NAO), "node · lugaresDaCarta().length em src/data/carta-dos-lugares.mjs (a contagem da C1 do check:lugares)",
        "Évora é um deles", c.get("evora", False))
g = ler(PASTA / "gate-html-ancora-do-mapa-primeira-construcao.txt") or ""
medicao("paginas_de_distrito_recusadas_pela_ancora_do_mapa", g.count('aponta para a âncora "#mapa"'),
        "as queixas do gate:html na primeira construção do bloco, guardadas em gate-html-ancora-do-mapa-primeira-construcao.txt",
        "as queixas nomeiam páginas das duas edições", "en/districts/" in g and "\n  distritos/" in "\n" + g)

# 2 · a construção: as gavetas, as listas, as contagens, a primeira página e o sinal
versao = json.loads(ler(DIST / "version.json") or "{}")
lug = ler(DIST / "lugares/index.html") or ""
pri = ler(DIST / "index.html") or ""
tem = ler(DIST / "temas/index.html") or ""
medicao("construcao_medida", versao.get("commit", NAO), "dist/version.json, campo commit",
        "o ficheiro da versão existe e nomeia um commit", bool(versao.get("commit")))
gavetas = re.findall(r'<details class="gaveta" data-gaveta="(regioes|distritos)"( open)?', lug)
medicao("gavetas_fechadas_em_lugares", sum(1 for _, aberta in gavetas if not aberta),
        'dist/lugares/index.html · os <details class="gaveta" data-gaveta="…"> sem o atributo open',
        "o detetor vê as duas gavetas, abertas ou fechadas", len(gavetas) == 2)
for chave, nome, exemplo in [("regioes", "nomes_na_lista_das_regioes", "Alentejo"), ("distritos", "nomes_na_lista_dos_distritos_e_ilhas", "Évora")]:
    # O Astro acrescenta aos elementos de uma vista com folha própria um atributo data-astro-cid-…: os padrões
    # admitem atributos a seguir (a primeira redação não os admitia e lia «NÃO LIDO»).
    m = re.search(rf'<ul class="lugares-lista" data-lista-lugares="{chave}"[^>]*>(.*?)</ul>', lug, re.S)
    itens = re.findall(r"<li\b", m.group(1)) if m else []
    medicao(nome, len(itens) if m else NAO, f'dist/lugares/index.html · os <li> de ul[data-lista-lugares="{chave}"]',
            f"«{exemplo}» é um deles", bool(m) and exemplo in m.group(1))
    c = re.search(rf'data-conta-da-lista="{chave}"[^>]*>, <span class="prova-valor" data-prova="[a-z_]+" title="[^"]*">(\d+)</span>', lug)
    medicao(f"contagem_no_sumario_{'das_regioes' if chave == 'regioes' else 'dos_distritos_e_ilhas'}", int(c.group(1)) if c else NAO,
            f'dist/lugares/index.html · o número da prova em [data-conta-da-lista="{chave}"]',
            "a contagem é uma marca data-prova, que o portão de HTML reconta", bool(c))
for nome, html, sel in [("pesquisas_na_primeira_pagina", pri, "data-pesquisa-bloco"), ("mapas_inteiros_na_primeira_pagina", pri, "data-mapa-raiz")]:
    medicao(nome, html.count(sel) if html else NAO, f"dist/index.html · as ocorrências de {sel}",
            f"o mesmo detetor encontra {sel} em dist/lugares/index.html", sel in lug)
for nome, html, rota in [("sinais_na_primeira_pagina", pri, "dist/index.html"), ("sinais_nos_temas", tem, "dist/temas/index.html")]:
    medicao(nome, html.count("data-sinal-dos-lugares") if html else NAO, f"{rota} · as ocorrências de data-sinal-dos-lugares",
            "o sinal está na porta «Lugares» (li data-entrada=\"lugares\")", bool(re.search(r'data-entrada="lugares"[^>]*><a class="pp-entrada pp-entrada-com-sinal"', html)))
d = re.search(r'<path class="pp-sinal-contorno" d="([^"]+)"', pri)
medicao("bytes_do_desenho_do_sinal", len(d.group(1)) if d else NAO, "dist/index.html · o comprimento do atributo d do contorno do sinal",
        "o caminho começa por um M, no formato do artefacto", bool(d) and d.group(1).startswith("M"))

# 3 · o contorno, pela própria função, com o tamanho com que a página o pede
r = subprocess.run(["node", "-e", (
    "Promise.all([import('./src/lib/sinal-dos-lugares.mjs'), import('./src/lib/mapa.mjs'), import('./src/data/caop-centroids.mjs')])"
    ".then(([s, m, c]) => { const L = 40, campo = m.paisDoMapa().campo, u = campo.largura / L, uc = campo.largura / c.FIELD_W;"
    " const x = s.contornoDoPais({ passo: Math.max(1, Math.round(u / 6)), tolerancia: u / 3, folga: Math.round(13 * uc) + Math.round(6 * uc) });"
    " console.log(JSON.stringify({ arestas: x.arestas, gemeas: x.gemeas, fronteira: x.fronteira, linhas: x.linhas, pontos: x.pontos, d: x.d })); })")],
    cwd=str(SITIO), capture_output=True, text=True)
contorno = json.loads(r.stdout) if r.returncode == 0 and r.stdout.strip() else {}
# L2a-b, o achado 13 da leitura a frio: um subprocesso que falhava deixava `contorno` vazio, e a soma dos valores por
# omissão (-1 + -1 == -2) dava o conhecido-positivo por encontrado. Agora só conta com as três contagens lidas, números.
lidas = all(isinstance(contorno.get(k), int) for k in ["arestas", "gemeas", "fronteira"])
soma = lidas and contorno["fronteira"] + contorno["gemeas"] == contorno["arestas"]
for k in ["arestas", "gemeas", "fronteira", "linhas", "pontos"]:
    medicao(f"contorno_{k}", contorno.get(k, NAO), "node · contornoDoPais() de src/lib/sinal-dos-lugares.mjs, com a largura de 40 px do sinal",
            "o subprocesso correu, e as arestas da fronteira mais as gémeas são as arestas todas", r.returncode == 0 and soma)
# L2a-b, o achado 14: a igualdade compara o desenho inteiro, carácter a carácter, e não o comprimento. O conhecido-positivo
# é a mesma comparação a apanhar uma cópia do caminho da página com um algarismo trocado e o mesmo comprimento.
import hashlib
pagina_d = d.group(1) if d else None
funcao_d = contorno.get("d")
def mesmo_desenho(x, y):
    return isinstance(x, str) and isinstance(y, str) and x == y
estragado = None
if pagina_d:
    i = next((k for k, ch in enumerate(pagina_d) if ch.isdigit()), None)
    if i is not None:
        estragado = pagina_d[:i] + ("1" if pagina_d[i] != "1" else "2") + pagina_d[i + 1:]
medicao("contorno_da_funcao_igual_ao_da_pagina",
        ("sim" if mesmo_desenho(funcao_d, pagina_d) else "não") if isinstance(funcao_d, str) and pagina_d else NAO,
        "mesmo_desenho(): o atributo d devolvido por contornoDoPais() comparado, carácter a carácter, com o de dist/index.html",
        "a mesma função diz igual ao caminho da página contra si próprio e diferente contra uma cópia dele com um algarismo trocado e o mesmo comprimento",
        estragado is not None and len(estragado) == len(pagina_d) and mesmo_desenho(pagina_d, pagina_d) and not mesmo_desenho(pagina_d, estragado))
medicao("sha256_do_desenho_do_sinal", hashlib.sha256(pagina_d.encode("utf-8")).hexdigest() if pagina_d else NAO,
        "o sha256 do atributo d do contorno em dist/index.html", "o caminho foi lido da página", pagina_d is not None)

# L2a-b, o achado 4: o caminho sem guião para um concelho. As páginas das regiões não levam portas de concelho; as dos
# distritos levam (o conhecido-positivo é a de Évora).
portas_regioes = {f.parent.name: len(re.findall(r'href="/municipios/[^"#]+"', f.read_text(encoding="utf-8")))
                  for f in sorted((DIST / "regioes").glob("*/index.html"))}
portas_evora = len(re.findall(r'href="/municipios/[^"#]+"', ler(DIST / "distritos/evora/index.html") or ""))
medicao("paginas_de_regiao_lidas", len(portas_regioes) or NAO, "as páginas dist/regioes/*/index.html",
        "o Alentejo é uma delas", "alentejo" in portas_regioes)
medicao("portas_para_concelhos_nas_paginas_das_regioes", sum(portas_regioes.values()) if portas_regioes else NAO,
        "as ligações para /municipios/… nessas páginas", "o mesmo detetor acha portas de concelho na página do distrito de Évora", portas_evora > 0)
medicao("portas_para_concelhos_na_pagina_do_distrito_de_evora", portas_evora, "as ligações para /municipios/… em dist/distritos/evora/index.html (o mapa e a lista)",
        "a página do distrito existe", bool(ler(DIST / "distritos/evora/index.html")))

# 4 · as capturas a 390
for nome, ficheiro, antes in [("altura_da_captura_de_lugares_a_390", "lugares-pt-390.png", 5321), ("altura_da_captura_da_primeira_pagina_a_390", "primeira-pt-390.png", 7194)]:
    largura, altura = png(ficheiro)
    medicao(nome, altura if altura else NAO, f"a altura do PNG design/especime-v3/capturas/l2a-2026-10-01/{ficheiro} (o cabeçalho IHDR)",
            "a largura do PNG é 390", largura == 390)
    medicao(f"{nome}_no_n1", antes, "o §0 do brief (design/observatorio/medidas/BRIEF-L2a.json)",
            "o valor está no ficheiro do brief", str(antes) in (ler(SITIO / "design/observatorio/medidas/BRIEF-L2a.json") or ""))
manifesto = json.loads(ler(PASTA / "capturas-l2a.json") or "{}")
medicao("capturas_do_bloco", manifesto.get("capturas", NAO), "design/especime-v3/medicoes/l2a-2026-10-01/capturas-l2a.json, campo capturas",
        "cada imagem do manifesto existe na pasta das capturas", bool(manifesto) and all((SITIO / x["ficheiro"]).exists() for x in manifesto.get("resultados", [])))
medicao("problemas_das_capturas", len(manifesto.get("problemas", [])) if manifesto else NAO, "o mesmo manifesto, campo problemas (transbordo, HTTP, erros de página)",
        "o manifesto tem o campo problemas", "problemas" in manifesto)

# 5 · as plantas, lidas dos registos guardados na pasta do bloco
def plantas(ficheiro, chave="plantas", filtro=None):
    j = json.loads(ler(PASTA / ficheiro) or "{}")
    ps = [p for p in j.get(chave, []) if (filtro is None or filtro(p))]
    return (sum(1 for p in ps if p.get("mordeu")), len(ps)) if ps else (NAO, NAO)
for nome, ficheiro, filtro, o_que in [
    ("plantas_do_mapa_primeiro", "navegacao.json", lambda p: (p.get("queixa") or "").startswith("L2A"), "as plantas L2A do check:navegacao"),
    ("plantas_da_porta_e_de_lugares_no_navegador", "navegador.json", None, "as plantas de tests/inicio/lugares-no-navegador.mjs"),
]:
    mordidas, total = plantas(ficheiro, filtro=filtro)
    medicao(f"{nome}_mordidas", mordidas, f"design/especime-v3/medicoes/l2a-2026-10-01/{ficheiro}, {o_que}", "o registo tem plantas", total not in (NAO, 0))
    medicao(f"{nome}_total", total, f"design/especime-v3/medicoes/l2a-2026-10-01/{ficheiro}", "o registo tem plantas", total not in (NAO, 0))
vm = ler(PASTA / "check-mapa-vermelhos.txt") or ""
medicao("plantas_do_check_mapa_mordidas", vm.count("vermelho ✓"), "design/especime-v3/medicoes/l2a-2026-10-01/check-mapa-vermelhos.txt (node scripts/check-mapa.mjs --vermelhos)",
        "o registo traz a planta nova «R4 (o mapa de volta à primeira página)»", "R4 (o mapa de volta à primeira página)" in vm)
medicao("plantas_do_check_mapa_que_nao_morderam", vm.count("NÃO APANHOU"), "o mesmo registo", "o registo tem a linha de cada planta", vm.count("·") > 0)

# 6 · os portões, lidos dos ficheiros
for g in ["build", "verify", "typecheck"]:
    c = (ler(PASTA / f"portoes/{g}.codigo") or "").strip()
    medicao(f"portao_{g}", int(c) if c.isdigit() else NAO, f"design/especime-v3/medicoes/l2a-2026-10-01/portoes/{g}.codigo, escrito por scripts/leituras/portoes.sh",
            "a pasta dos portões tem a cabeça ao lado", bool((ler(PASTA / "portoes/cabeca") or "").strip()))

# 7 · o custo: os segundos de cada portão, lidos das horas escritas por portoes.sh, e os símbolos da sessão, lidos do
# contador que a ferramenta mostra ao agente (o que resta de um orçamento que começou em OEDP_SIMBOLOS_INICIO), passado
# a este guião em OEDP_SIMBOLOS_RESTANTES por quem o corre; sem ele, a medida fica «NÃO LIDO».
from datetime import datetime
def segundos(pasta, g):
    i, f = (ler(PASTA / pasta / f"{g}.inicio") or "").strip(), (ler(PASTA / pasta / f"{g}.fim") or "").strip()
    try:
        return int((datetime.fromisoformat(f.replace("Z", "+00:00")) - datetime.fromisoformat(i.replace("Z", "+00:00"))).total_seconds())
    except ValueError:
        return NAO
for pasta in ["portoes-intermedio", "portoes"]:
    cab = (ler(PASTA / pasta / "cabeca") or "").strip()
    for g in ["build", "verify", "typecheck"]:
        medicao(f"segundos_{g}_{pasta.replace('-', '_')}", segundos(pasta, g), f"design/especime-v3/medicoes/l2a-2026-10-01/{pasta}/{g}.inicio e {g}.fim",
                "a pasta tem a cabeça em que correu", bool(cab))
    c = {g: (ler(PASTA / pasta / f"{g}.codigo") or "").strip() for g in ["build", "verify", "typecheck"]}
    for g, v in c.items():
        medicao(f"codigo_{g}_{pasta.replace('-', '_')}", int(v) if v.isdigit() else NAO, f"design/especime-v3/medicoes/l2a-2026-10-01/{pasta}/{g}.codigo",
                "a pasta tem a cabeça em que correu", bool(cab))
# L2a-b: as leituras do L2a passam para um ficheiro (custo-l2a.json), como as da passagem, e deixam de vir de
# variáveis de ambiente que mudavam o valor a cada corrida (o achado 12 da leitura a frio).
cl = json.loads(ler(PASTA / "custo-l2a.json") or "{}")
i0, f0 = cl.get("simbolos_restantes_no_inicio"), cl.get("simbolos_restantes_no_fim")
medicao("simbolos_da_sessao_do_construtor", i0 - f0 if isinstance(i0, int) and isinstance(f0, int) else NAO,
        "design/especime-v3/medicoes/l2a-2026-10-01/custo-l2a.json: simbolos_restantes_no_inicio menos simbolos_restantes_no_fim",
        "as duas leituras estão no ficheiro e a do fim é menor", isinstance(i0, int) and isinstance(f0, int) and f0 < i0)

# L2a-b: os registos da passagem, na subpasta l2a-b, e os códigos dos portões em portoes/l2a-b.
nb = json.loads(ler(PASTA / "l2a-b/navegador.json") or "{}")
pb = nb.get("plantas", [])
medicao("l2a_b_plantas_no_navegador_mordidas", sum(1 for x in pb if x.get("mordeu")) if pb else NAO,
        "design/especime-v3/medicoes/l2a-2026-10-01/l2a-b/navegador.json, campo plantas", "o registo tem plantas", bool(pb))
medicao("l2a_b_plantas_no_navegador_total", len(pb) if pb else NAO, "o mesmo registo", "o registo tem plantas", bool(pb))
gav = [g for r in nb.get("gavetas", []) for g in r.get("gavetas", []) if g.get("chave") == "distritos"]
medicao("l2a_b_nomes_a_vista_com_a_gaveta_dos_distritos_aberta", gav[0].get("aberta", NAO) if gav else NAO,
        "o mesmo registo, as gavetas: a dos distritos e das ilhas aberta ao teclado, sem guião, na edição portuguesa",
        "a mesma medida dá 0 com a gaveta fechada", bool(gav) and gav[0].get("antes") == 0)
sg = nb.get("sem_guiao", [])
medicao("l2a_b_resultados_a_vista_depois_da_pesquisa_sem_guiao", sg[0].get("resultadosDepois", NAO) if sg else NAO,
        "o mesmo registo, sem_guiao: os resultados à vista depois de «mourao» e Enter com o JavaScript desligado",
        "o Enter levou à página dos lugares, com 200", bool(sg) and sg[0].get("estado") == 200)
medicao("l2a_b_caminho_pelas_gavetas_ate_mourao", sg[0].get("estadoDoConcelho", NAO) if sg else NAO,
        "o mesmo registo: o código HTTP da página de Mourão, aberta pela porta da lista do distrito, aberto pela gaveta",
        "a porta do distrito estava escondida com a gaveta fechada", bool(sg) and sg[0].get("portaEscondidaComAGavetaFechada") is True)
vb = ler(PASTA / "l2a-b/check-mapa-vermelhos.txt") or ""
medicao("l2a_b_plantas_do_check_mapa_mordidas", vb.count("vermelho ✓"), "design/especime-v3/medicoes/l2a-2026-10-01/l2a-b/check-mapa-vermelhos.txt",
        "o registo traz a planta que move a legenda", "movida para o fim do <main>" in vb)
va = ler(PASTA / "l2a-b/r6-antiga-com-a-planta-nova.txt") or ""
medicao("l2a_b_r6_antiga_nao_apanha_a_legenda_movida", va.count("NÃO APANHOU ✗  R6 (a menção longe do mapa)"),
        "design/especime-v3/medicoes/l2a-2026-10-01/l2a-b/r6-antiga-com-a-planta-nova.txt (a R6 de 219dbefb com a planta nova)",
        "o registo traz a linha das outras plantas da R6", "R6 (a menção)" in va)
cb = (ler(PASTA / "portoes/l2a-b/cabeca") or "").strip()
for g in ["build", "verify", "typecheck"]:
    c = (ler(PASTA / f"portoes/l2a-b/{g}.codigo") or "").strip()
    medicao(f"l2a_b_codigo_{g}", int(c) if c.isdigit() else NAO, f"design/especime-v3/medicoes/l2a-2026-10-01/portoes/l2a-b/{g}.codigo",
            "a pasta tem a cabeça em que correu", bool(cb))
    medicao(f"l2a_b_segundos_{g}", segundos("portoes/l2a-b", g), f"design/especime-v3/medicoes/l2a-2026-10-01/portoes/l2a-b/{g}.inicio e {g}.fim",
            "a pasta tem a cabeça em que correu", bool(cb))

# L2a-b: o custo da passagem, com as duas leituras do contador guardadas num ficheiro (o achado 12 pedia as leituras).
custo = json.loads(ler(PASTA / "custo-l2a-b.json") or "{}")
ini, fim = custo.get("simbolos_restantes_no_inicio"), custo.get("simbolos_restantes_no_fim")
medicao("simbolos_da_passagem_l2a_b", ini - fim if isinstance(ini, int) and isinstance(fim, int) else NAO,
        "design/especime-v3/medicoes/l2a-2026-10-01/custo-l2a-b.json: simbolos_restantes_no_inicio menos simbolos_restantes_no_fim",
        "as duas leituras estão no ficheiro e a do fim é menor", isinstance(ini, int) and isinstance(fim, int) and fim < ini)

saida = {"bloco": "L2a", "guiao": "design/especime-v3/medicoes/l2a-2026-10-01/medir-l2a.py", "ordem_em_lugares": ordem, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or str(PASTA / "medidas.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
