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
    " console.log(JSON.stringify({ arestas: x.arestas, gemeas: x.gemeas, fronteira: x.fronteira, linhas: x.linhas, pontos: x.pontos, bytes: x.d.length })); })")],
    cwd=str(SITIO), capture_output=True, text=True)
contorno = json.loads(r.stdout) if r.returncode == 0 and r.stdout.strip() else {}
for k in ["arestas", "gemeas", "fronteira", "linhas", "pontos"]:
    medicao(f"contorno_{k}", contorno.get(k, NAO), "node · contornoDoPais() de src/lib/sinal-dos-lugares.mjs, com a largura de 40 px do sinal",
            "as arestas da fronteira mais as gémeas são as arestas todas", contorno.get("fronteira", -1) + contorno.get("gemeas", -1) == contorno.get("arestas", -2))
medicao("contorno_bytes_iguais_aos_da_pagina", contorno.get("bytes", NAO), "o comprimento do d devolvido pela função, contra o da página",
        "é igual ao comprimento lido em dist/index.html", bool(d) and contorno.get("bytes") == len(d.group(1)))

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

saida = {"bloco": "L2a", "guiao": "design/especime-v3/medicoes/l2a-2026-10-01/medir-l2a.py", "ordem_em_lugares": ordem, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or str(PASTA / "medidas.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
