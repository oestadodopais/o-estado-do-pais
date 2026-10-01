#!/usr/bin/env python3
"""O §0 do brief L2a (o mapa de «Lugares» primeiro, as listas dobradas, o mapa fora da primeira página), medido
sobre a cabeça presa do sítio (1395c9de). Não lê a rede: lê as vistas, a carta dos lugares e as capturas do N1 a
390 px na cabeça. Escreve design/observatorio/medidas/BRIEF-L2a.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada
medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, struct, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "1395c9de"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho, binario=False):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    if r.returncode != 0:
        return None
    return r.stdout if binario else r.stdout.decode("utf-8")


def altura_png(b):
    return struct.unpack(">II", b[16:24])[1] if b and b[:8] == b"\x89PNG\r\n\x1a\n" else None


# 1 · a ordem das peças na vista de «Lugares»: a pesquisa, as duas listas e o mapa
lv = mostrar("src/views/LugaresView.astro") or ""
ordem = [(m.start(), n) for n, p in [("pesquisa", r"<Pesquisa\b"), ("regioes", r'data-lista-lugares="regioes"'),
                                      ("distritos", r'data-lista-lugares="distritos"'), ("mapa", r"<MapaRespira\b")]
         for m in [re.search(p, lv)] if m]
ordem = [n for _, n in sorted(ordem)]
medicao("pecas_de_lugares_antes_do_mapa", (ordem.index("mapa") if "mapa" in ordem else NAO) if lv else NAO,
        f"git show {CAB}:src/views/LugaresView.astro · a ordem de <Pesquisa, das duas listas e de <MapaRespira no documento",
        "a pesquisa vem antes do mapa", ordem[:1] == ["pesquisa"] and "mapa" in ordem)
carta = mostrar("src/data/carta-dos-lugares.mjs") or ""
regioes = len(re.findall(r"^\s*\{\s*slug:\s*'[a-z-]+',\s*nome:", carta, flags=re.M))
# as regiões e os distritos contam-se pelas listas que a vista imprime: o detetor lê a carta pelas suas funções
r = subprocess.run(["node", "-e", "import('./src/data/carta-dos-lugares.mjs').then(m=>{const R=m.regioesDaCarta(),D=m.distritosDaCarta();console.log(JSON.stringify({r:R.length,d:D.length,nomes:JSON.stringify(R)+JSON.stringify(D)}))})"],
                   cwd=str(SITIO), capture_output=True, text=True)
contas = json.loads(r.stdout) if r.returncode == 0 and r.stdout.strip() else {}
nomes = contas.get("nomes", "")
medicao("regioes_na_lista", contas.get("r", NAO), "node · regioesDaCarta().length em src/data/carta-dos-lugares.mjs",
        "o Alentejo é uma delas", "Alentejo" in nomes)
medicao("distritos_e_ilhas_na_lista", contas.get("d", NAO), "node · distritosDaCarta().length",
        "Évora é um deles", "Évora" in nomes)

# 2 · a primeira página: as secções antes do bloco dos lugares, e a segunda pesquisa e o mapa inteiro nela
hv = mostrar("src/views/HomeView.astro") or ""
seccoes = [m.group(1) for m in re.finditer(r'<section class="([a-z-]+)', hv)]
medicao("seccoes_da_primeira_pagina_antes_dos_lugares", (seccoes.index("pp-lugares") if "pp-lugares" in seccoes else NAO) if hv else NAO,
        f"git show {CAB}:src/views/HomeView.astro · as <section class=…> por ordem até pp-lugares",
        "a secção «O que se passa» vem primeiro", seccoes[:1] == ["pp-o-que-se-passa"])
medicao("pesquisas_na_primeira_pagina", hv.count("<Pesquisa ") if hv else NAO, "as ocorrências de <Pesquisa na vista",
        "há pelo menos uma", "<Pesquisa " in hv)
medicao("mapas_inteiros_na_primeira_pagina", hv.count("<MapaRespira ") if hv else NAO, "as ocorrências de <MapaRespira na vista",
        "o mapa leva a porta dos lugares", "portaLugares" in hv)

# 3 · as capturas do N1 a 390 px: as alturas das páginas
cap = {n: altura_png(mostrar(f"design/especime-v3/capturas/n1-2026-09-30/{n}.png", binario=True)) for n in ["lugares-pt-390", "primeira-pt-390"]}
medicao("altura_da_captura_de_lugares_a_390", cap["lugares-pt-390"] or NAO, "a altura do PNG design/especime-v3/capturas/n1-2026-09-30/lugares-pt-390.png (o cabeçalho IHDR)",
        "a largura do PNG é 390", struct.unpack(">II", (mostrar("design/especime-v3/capturas/n1-2026-09-30/lugares-pt-390.png", binario=True) or b"\0"*24)[16:24])[0] == 390)
medicao("altura_da_captura_da_primeira_pagina_a_390", cap["primeira-pt-390"] or NAO, "a altura do PNG primeira-pt-390.png",
        "a primeira página é mais alta do que «Lugares»", (cap["primeira-pt-390"] or 0) > (cap["lugares-pt-390"] or 0))

saida = {"brief": "design/observatorio/BRIEF-L2a-o-mapa-primeiro.md", "guiao": "design/observatorio/medidas/BRIEF-L2a.py",
         "cabeca_lida": CAB, "ordem_em_lugares": ordem, "seccoes_da_primeira_pagina": seccoes, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-L2a.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
