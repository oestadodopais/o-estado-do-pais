#!/usr/bin/env python3
"""RP4-c: as medidas do relatório do bloco, cada uma com o nome, o valor, o comando e um conhecido-positivo.

Uso (na raiz do sítio, depois dos portões, das capturas, das plantas e do custo):
    python3 design/especime-v3/medicoes/rp4c-2026-10-05/medir.py

Escreve `medidas.json` nesta pasta. Lê o sítio na árvore de trabalho e os registos desta pasta, que os outros guiões
escreveram: `brief-reproduzido.json`, `marcas-antes.json` e `marcas-depois.json` (`medir-marcas.mjs`),
`letra-dos-eixos-antes.json` e `letra-dos-eixos-depois.json` (`medir-letra.mjs`), `peso-antes.json` e `peso-depois.json`
(`medir-peso.mjs`), `capturas.json` (`captar-rp4c.mjs`), `formas-rp4c.json` (o `check:formas`), `series.json` (o
`check:series`), `plantas-portoes-rp4c.json` (`tests/pais/portoes.mjs --prefixo rp4c-`), as pastas `conferencias/` e
`portoes/`, `mapa.log` e `custo.json`. O que não conseguir ler fica «NÃO LIDO», e nunca um valor plausível. Nenhum
caminho da máquina no registo.
"""
import json
import re
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def ler_json(caminho):
    try:
        return json.loads(Path(caminho).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def ler(caminho):
    try:
        return Path(caminho).read_text(encoding="utf-8")
    except OSError:
        return None


def vazio(caminho):
    """Um ficheiro de estado que existe e está vazio (a árvore seguida limpa); None quando não existe."""
    t = ler(caminho)
    return None if t is None else t.strip() == ""


def node(codigo):
    r = subprocess.run(["node", "--input-type=module", "-e", codigo], cwd=SITIO, capture_output=True, text=True)
    return json.loads(r.stdout) if r.returncode == 0 else None


# ---- o §0 do brief, reproduzido -------------------------------------------------------------------------------------
brief = ler_json(SITIO / "design/observatorio/medidas/BRIEF-RP4C.json")
repro = ler_json(AQUI / "brief-reproduzido.json")
medicao("paragrafo_0_reproduzido_igual", (brief == repro) if brief and repro else NAO,
        "OEDP_MEDIDAS_JSON=<pasta>/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-RP4C.py, comparado com BRIEF-RP4C.json",
        "a reprodução tem as oito medidas do §0", bool(repro) and len(repro.get("medidas", [])) == 8)
medicao("paragrafo_0_medidas", len((repro or {}).get("medidas", [])) if repro else NAO, "as medidas de brief-reproduzido.json", "a reprodução nomeia a cabeça lida", bool(repro) and repro.get("cabeca_lida") == "5b004ada")
for m in (repro or {}).get("medidas", []):
    medicao(f"paragrafo_0.{m['nome']}", m["valor"], m["comando"], m["conhecido_positivo"]["o_que"], m["conhecido_positivo"]["encontrado"])

# ---- as marcas, antes e depois (pontos 1 e 2) -----------------------------------------------------------------------
antes = ler_json(AQUI / "marcas-antes.json") or {}
depois = ler_json(AQUI / "marcas-depois.json") or {}
CMD_M = "node design/especime-v3/medicoes/rp4c-2026-10-05/medir-marcas.mjs --dist <dist> --json marcas-{antes,depois}.json"
for chave in ("paginas_com_desenhos", "desenhos", "marcas_dos_valores", "marcas_dos_valores_com_percentagem", "marcas_dos_valores_com_euro",
              "marcas_do_zero_sem_simbolo", "desenhos_com_legenda_da_unidade", "desenhos_em_euros_com_legenda", "zonas_de_leitura",
              "desenhos_com_zonas", "desenhos_indexados", "desenhos_indexados_com_zonas", "etiquetas_do_tempo"):
    medicao(f"marcas.antes.{chave}", antes.get(chave, NAO), CMD_M + " (a construção da cabeça de partida)",
            "a primeira página tem «1992» no eixo do tempo", antes.get("conhecido_positivo_primeira_pagina_tem_1992"))
    medicao(f"marcas.depois.{chave}", depois.get(chave, NAO), CMD_M + " (a construção dos portões finais)",
            "a primeira página tem «1992» no eixo do tempo", depois.get("conhecido_positivo_primeira_pagina_tem_1992"))
for chave in ("tempo_da_primeira_pagina", "valor_da_primeira_pagina", "tempo_do_cartao_da_inflacao", "tempo_do_recibo_da_inflacao"):
    for lado, d in (("antes", antes), ("depois", depois)):
        v = d.get(chave)
        medicao(f"marcas.{lado}.{chave}", ", ".join(v) if isinstance(v, list) else NAO, CMD_M,
                "o recibo da inflação tem um desenho", d.get("conhecido_positivo_recibo_da_inflacao"))
medicao("marcas.depois.legendas_distintas", depois.get("legendas_distintas", NAO), CMD_M, "a primeira página tem «1992» no eixo do tempo",
        depois.get("conhecido_positivo_primeira_pagina_tem_1992"))

# ---- a regra das décadas e a letra dos eixos (ponto 2) --------------------------------------------------------------
modulo = ler(SITIO / "src/lib/formas/serie-do-pais.mjs") or ""
def constante(nome):
    m = re.search(rf"export const {nome} = ([\d.]+);", modulo)
    return float(m.group(1)) if m and "." in m.group(1) else (int(m.group(1)) if m else NAO)
for nome in ("PIXEIS_ATE_A_VIZINHA", "LARGURA_DE_UM_ANO", "ANOS_PARA_AS_DECADAS"):
    medicao(f"modulo.{nome}", constante(nome), f"src/lib/formas/serie-do-pais.mjs · export const {nome}",
            "o módulo exporta simboloDasMarcas", "export function simboloDasMarcas" in modulo)
for lado in ("antes", "depois"):
    l = ler_json(AQUI / f"letra-dos-eixos-{lado}.json") or {}
    CMD_L = f"node design/especime-v3/medicoes/rp4c-2026-10-05/medir-letra.mjs --dist <dist> --json letra-dos-eixos-{lado}.json"
    for chave in ("desenhos", "etiquetas_de_ano_medidas", "largura_maior_de_um_ano", "largura_menor_de_um_ano", "menor_espaco_entre_etiquetas_do_tempo", "letra_carregada_em_todas"):
        medicao(f"letra.{lado}.{chave}", l.get(chave, NAO), CMD_L, f"uma etiqueta de oito algarismos mede mais do que a maior de quatro ({l.get('conhecido_positivo_oito_algarismos', NAO)})",
                l.get("conhecido_positivo_mede_mais"))
campo = node("import { serieDoPais } from './src/lib/formas/serie-do-pais.mjs'; const c = serieDoPais(['serie-ipc-variacao-homologa'], 'unidade', 240, 160); const p = serieDoPais(['serie-ipc-variacao-homologa']); console.log(JSON.stringify({ cartao: c.campo.direita - c.campo.esquerda, primeira: p.campo.direita - p.campo.esquerda, largura_do_cartao: c.largura, largura_da_primeira: p.largura }));")
for chave in ("cartao", "primeira", "largura_do_cartao", "largura_da_primeira"):
    medicao(f"modulo.campo.{chave}", (campo or {}).get(chave, NAO), "node · serieDoPais(['serie-ipc-variacao-homologa'], 'unidade', 240, 160).campo e a de 360 por 200",
            "o desenho da primeira página é mais largo do que o do cartão", bool(campo) and campo["primeira"] > campo["cartao"])

# ---- as séries dos cartões da página dos preços --------------------------------------------------------------------
pontos = node("import { getSerie } from './src/lib/series.mjs'; import fs from 'node:fs'; import { parse } from 'node-html-parser'; const r = parse(fs.readFileSync('dist/precos/index.html', 'utf8')); const ids = r.querySelectorAll('svg[data-forma=\"serie-do-pais\"]').map((s) => s.getAttribute('data-series')); console.log(JSON.stringify(ids.map((id) => ({ id, pontos: getSerie(id).pontos.length }))));")
medicao("precos.cartoes_com_serie", len(pontos) if pontos else NAO, "node · os desenhos de dist/precos/index.html e os pontos de cada série pelo carregador da casa",
        "o cartão da inflação é um deles", bool(pontos) and any(p["id"] == "serie-ipc-variacao-homologa" for p in pontos))
medicao("precos.menos_pontos_numa_serie", min(p["pontos"] for p in pontos) if pontos else NAO, "idem", "o cartão da inflação é um deles", bool(pontos))
medicao("precos.mais_pontos_numa_serie", max(p["pontos"] for p in pontos) if pontos else NAO, "idem", "o cartão da inflação é um deles", bool(pontos))
medicao("precos.pontos_dos_cartoes", sum(p["pontos"] for p in pontos) if pontos else NAO, "idem", "o cartão da inflação é um deles", bool(pontos))

# ---- o ponto 3, parado: o que existe no livro e na origem -----------------------------------------------------------
claims = sorted((SITIO / "ledger/claims").glob("*.yml"))
textos = {c.stem: c.read_text(encoding="utf-8") for c in claims}
medicao("livro.linhas", len(claims), "ls ledger/claims/*.yml", "a linha da inflação existe", "ipc-variacao-homologa" in textos)
derivadas_de_serie = [k for k, t in textos.items() if re.search(r"^derived_from:.*serie-", t, re.M) or re.search(r"^derived_from:\n(?:\s+- .*\n)*\s+- [\"']?serie-", t, re.M)]
medicao("livro.linhas_derivadas_de_uma_serie", len(derivadas_de_serie), "ledger/claims/*.yml · as linhas cujo derived_from nomeia uma série (serie-)",
        "o mesmo detetor acha as linhas com derived_from não vazio", sum(1 for t in textos.values() if re.search(r"^derived_from:\s*\n\s+- ", t, re.M)) > 0)
medicao("livro.linhas_da_media_e_do_objetivo", sum(1 for k in textos if "media-desde" in k or "objetivo-de-inflacao" in k), "ls ledger/claims | grep media-desde|objetivo-de-inflacao",
        "o mesmo detetor acha a linha da inflação pelo nome", any("ipc-variacao-homologa" in k for k in textos))
casas = node("import { getSerie } from './src/lib/series.mjs'; const s = getSerie('serie-ipc-variacao-homologa'); const c = {}; for (const p of s.pontos) { const k = (String(p.valor).split(',')[1] ?? '').length; c[k] = (c[k] ?? 0) + 1; } console.log(JSON.stringify(c));")
medicao("livro.serie_da_inflacao_casas_decimais", casas or NAO, "node · as casas decimais de cada ponto de serie-ipc-variacao-homologa, pelo carregador da casa",
        "os pontos contados são os 416 da série", bool(casas) and sum(casas.values()) == 416)
readme = ler(SITIO / "ledger/README.md") or ""
medicao("livro.regra_7_derived_from", bool(re.search(r"7\. `derived_from` apontar para uma afirmação que não existe", readme)), "ledger/README.md · a regra 7",
        "o README tem a lista das regras", "derived_from" in readme)
origem = ler(SITIO / "src/data/origens-c1c.mjs") or ""
medicao("origem.bce_estrategia_selada", bool(re.search(r'"c1c-bce-estrategia"[\s\S]*?"sha256": "[0-9a-f]{64}"', origem)), "src/data/origens-c1c.mjs · c1c-bce-estrategia com o selo",
        "o excerto diz em que índice se mede o objetivo", "Harmonised Index of Consumer Prices" in origem)
leit = ler(SITIO / "src/data/leituras-rp1.mjs") or ""
medicao("leitura.o_objetivo_mede_se_noutro_indice", "O objetivo de inflação do Banco Central Europeu mede-se noutro índice, o harmonizado" in leit,
        "src/data/leituras-rp1.mjs · a frase da leitura da inflação", "a leitura nomeia o Banco Central Europeu", "Banco Central Europeu" in leit)

# ---- o peso, antes e depois (ponto 4) -------------------------------------------------------------------------------
pa = ler_json(AQUI / "peso-antes.json") or {}
pd = ler_json(AQUI / "peso-depois.json") or {}
CMD_P = "node design/especime-v3/medicoes/rp4c-2026-10-05/medir-peso.mjs --dist <dist> --json peso-{antes,depois}.json"
for lado, d in (("antes", pa), ("depois", pd)):
    for chave in ("paginas_lidas", "paginas_com_desenhos", "desenhos", "zonas_de_leitura", "bytes", "gzip", "brotli"):
        medicao(f"peso.{lado}.{chave}", d.get(chave, NAO), CMD_P, "a primeira página e o recibo da inflação estão entre as páginas com desenhos",
                d.get("conhecido_positivo_primeira_pagina") and d.get("conhecido_positivo_recibo_da_inflacao"))
    por = {p["pagina"]: p for p in d.get("paginas", [])}
    for nome, pagina in (("primeira", "index.html"), ("precos", "precos/index.html"), ("recibo_da_inflacao", "livro-razao/series/serie-ipc-variacao-homologa/index.html"),
                         ("recibo_do_indice", "livro-razao/series/serie-ipc-indice/index.html"), ("habitacao", "habitacao/index.html")):
        for chave in ("bytes", "gzip", "brotli", "zonas_de_leitura"):
            medicao(f"peso.{lado}.{nome}.{chave}", por.get(pagina, {}).get(chave, NAO), CMD_P + f" · {pagina}",
                    "a página está entre as que têm desenhos", pagina in por)

# ---- as capturas, a leitura com o rato e o toque (pontos 4 e 5) ----------------------------------------------------
cap = ler_json(AQUI / "capturas.json") or {}
CMD_C = "node design/especime-v3/medicoes/rp4c-2026-10-05/captar-rp4c.mjs"
lista = cap.get("lista", [])
medicao("capturas.inteiras", len(lista), CMD_C, "há capturas das três rotas", len({c["rota"] for c in lista}) == 6)
medicao("capturas.larguras", cap.get("larguras", NAO), CMD_C, "a primeira largura é a do telemóvel", (cap.get("larguras") or [None])[0] == 390)
medicao("capturas.quantas_larguras", len(cap.get("larguras", [])) if cap else NAO, CMD_C, "a primeira largura é a do telemóvel", (cap.get("larguras") or [None])[0] == 390)
medicao("capturas.rotas", len({c["rota"].replace("/en", "", 1) if c["lang"] == "en" else c["rota"] for c in lista}) and len({(c["rota"]) for c in lista}) // 2, CMD_C, "há capturas nas duas edições", {c["lang"] for c in lista} == {"pt", "en"})
medicao("capturas.edicoes", len({c["lang"] for c in lista}), CMD_C, "há capturas nas duas edições", {c["lang"] for c in lista} == {"pt", "en"})
medicao("capturas.erros", len(cap.get("erros", [])) if cap else NAO, CMD_C, "as plantas das capturas morderam", cap.get("plantas_mordidas") == len(cap.get("plantas", [])) and bool(cap.get("plantas")))
medicao("capturas.plantas", len(cap.get("plantas", [])) if cap else NAO, CMD_C, "uma planta tem de morder para contar", bool(cap.get("plantas")))
medicao("capturas.plantas_mordidas", cap.get("plantas_mordidas", NAO), CMD_C, "uma planta tem de morder para contar", bool(cap.get("plantas")))
extras = cap.get("extras", [])
medicao("capturas.recortes_da_legenda", len(extras), CMD_C, "a legenda recortada é a unidade por extenso", bool(extras) and all(e.get("legenda") for e in extras))
medicao("capturas.legendas_recortadas", [e.get("legenda") for e in extras], CMD_C, "idem", bool(extras))
provas = cap.get("provas", [])
medicao("capturas.provas_do_rato", sum(1 for p in provas if p["prova"] == "rato"), CMD_C, "a planta da etiqueta escondida mordeu", any(p["nome"].startswith("a etiqueta escondida") and p["mordeu"] for p in cap.get("plantas", [])))
medicao("capturas.provas_do_rato_que_passaram", sum(1 for p in provas if p["prova"] == "rato" and p["passou"]), CMD_C, "idem", True)
medicao("capturas.provas_do_toque", sum(1 for p in provas if p["prova"] == "toque"), CMD_C, "a planta da regra fora da consulta do rato mordeu", any(p["nome"].startswith("a regra de mostrar") and p["mordeu"] for p in cap.get("plantas", [])))
medicao("capturas.provas_do_toque_que_passaram", sum(1 for p in provas if p["prova"] == "toque" and p["passou"]), CMD_C, "idem", True)
for p in provas:
    if p["prova"] == "rato" and p.get("durante", {}).get("lida"):
        l = p["durante"]["lida"]
        medicao(f"capturas.rato.{p['rota'].strip('/') or 'primeira'}.{p['lang']}", f"{l['valor']} · {l['periodo']}", CMD_C,
                "a etiqueta acesa é a da zona debaixo do rato", l["zona_contem_o_rato"])
desenhos = [dict(d, ficheiro=c["ficheiro"], largura_do_ecra=c["largura"], lang=c["lang"]) for c in lista for d in c["desenhos"]]
if desenhos:
    medicao("capturas.letra_dos_eixos_px_menor", round(min(d["letra_dos_eixos_px"] for d in desenhos), 3), CMD_C, "os desenhos foram medidos", True)
    medicao("capturas.letra_dos_eixos_px_maior", round(max(d["letra_dos_eixos_px"] for d in desenhos), 3), CMD_C, "os desenhos foram medidos", True)
    medicao("capturas.menor_espaco_do_tempo_px", round(min(d["menor_espaco_do_tempo_px"] for d in desenhos if d["menor_espaco_do_tempo_px"] is not None), 3), CMD_C, "os desenhos foram medidos", True)
    medicao("capturas.etiquetas_do_tempo_fora_do_desenho", sum(d["etiquetas_fora_do_desenho"] for d in desenhos), CMD_C, "a planta do desenho mais largo do que o ecrã mordeu",
            any(p["nome"].startswith("um desenho mais largo") and p["mordeu"] for p in cap.get("plantas", [])))
    medicao("capturas.paginas_que_transbordam", sum(1 for c in lista if c["transborda"]), CMD_C, "a planta do desenho mais largo do que o ecrã mordeu",
            any(p["nome"].startswith("um desenho mais largo") and p["mordeu"] for p in cap.get("plantas", [])))
    medicao("capturas.desenhos_dentro_de_uma_ligacao_a_390", sum(1 for d in desenhos if d["largura_do_ecra"] == 390 and d["dentro_de_uma_ligacao"]), CMD_C, "há desenhos medidos a 390", any(d["largura_do_ecra"] == 390 for d in desenhos))
    medicao("capturas.desenhos_a_390", sum(1 for d in desenhos if d["largura_do_ecra"] == 390), CMD_C, "há desenhos medidos a 390", any(d["largura_do_ecra"] == 390 for d in desenhos))
    for largura in cap.get("larguras", []):
        sel = [d for d in desenhos if d["largura_do_ecra"] == largura and d["zonas"] and d["lang"] == "pt"]
        for nome, filtro in (("primeira", lambda d: d["ficheiro"].startswith("primeira-")), ("cartao_da_inflacao", lambda d: d["ficheiro"].startswith("precos-") and d["series"] == "serie-ipc-variacao-homologa"),
                             ("cartao_dos_combustiveis", lambda d: d["ficheiro"].startswith("precos-") and d["series"] == "serie-ipc-combustiveis-variacao-homologa")):
            d = next((x for x in sel if filtro(x)), None)
            if d:
                medicao(f"capturas.{nome}.{largura}.zonas", d["zonas"], CMD_C, "o desenho tem zonas", d["zonas"] > 0)
                medicao(f"capturas.{nome}.{largura}.zonas_alcancaveis", d["zonas_alcancaveis"], CMD_C, "o rato alcança pelo menos uma zona", d["zonas_alcancaveis"] > 0)
                medicao(f"capturas.{nome}.{largura}.largura_no_ecra", round(d["largura_no_ecra"], 3), CMD_C, "o desenho tem largura", d["largura_no_ecra"] > 0)
                medicao(f"capturas.{nome}.{largura}.zona_mais_larga_px", round(d["zona_mais_larga_px"], 3), CMD_C, "o desenho tem zonas", d["zonas"] > 0)

# ---- as conferências e as plantas -----------------------------------------------------------------------------------
formas = ler_json(AQUI / "formas-rp4c.json") or {}
CMD_F = "node scripts/check-formas.mjs --json-rp4 formas-rp4c.json"
medicao("f21.desenhos_recompostos", formas.get("desenhos", NAO), CMD_F, "as provas do módulo correram", bool(formas.get("provas")))
medicao("f21.provas_do_modulo", len(formas.get("provas", [])) if formas else NAO, CMD_F, "as provas do módulo correram", bool(formas.get("provas")))
medicao("f21.plantas", len(formas.get("plantas", [])) if formas else NAO, CMD_F, "uma planta tem de morder para contar", bool(formas.get("plantas")))
medicao("f21.plantas_mordidas", sum(1 for p in formas.get("plantas", []) if p.get("mordeu")), CMD_F, "idem", bool(formas.get("plantas")))
medicao("f21.plantas_da_leitura_e_da_legenda", len(formas.get("plantas_da_leitura", [])) if formas else NAO, CMD_F, "idem", bool(formas.get("plantas_da_leitura")))
medicao("f21.plantas_da_leitura_e_da_legenda_mordidas", sum(1 for p in formas.get("plantas_da_leitura", []) if p.get("mordeu")), CMD_F, "idem", bool(formas.get("plantas_da_leitura")))
medicao("f2.plantas", len(formas.get("plantas_da_f2", [])) if formas else NAO, CMD_F, "idem", bool(formas.get("plantas_da_f2")))
medicao("f2.plantas_mordidas", sum(1 for p in formas.get("plantas_da_f2", []) if p.get("mordeu")), CMD_F, "idem", bool(formas.get("plantas_da_f2")))
medicao("f2.algarismos_de_pontos_nos_desenhos", formas.get("algarismos_de_pontos_nos_desenhos", NAO), CMD_F, "a F2 viu valores de pontos nos desenhos", (formas.get("algarismos_de_pontos_nos_desenhos") or 0) > 0)
medicao("f21.erros", len(formas.get("erros", [])) if formas else NAO, CMD_F, "as plantas da F21 morderam", bool(formas.get("plantas")) and all(p.get("mordeu") for p in formas.get("plantas", [])))
series = ler_json(AQUI / "series.json") or {}
CMD_S = "node tests/series/series.mjs --prova --json series.json"
medicao("series.plantas", len(series.get("plantas", [])) if series else NAO, CMD_S, "as duas plantas da S6 que mudaram de forma estão entre elas",
        sum(1 for p in series.get("plantas", []) if p["nome"] in ("um valor trocado na tabela", "as duas edições com valores diferentes")) == 2)
medicao("series.plantas_mordidas", sum(1 for p in series.get("plantas", []) if p.get("mordeu")), CMD_S, "idem", True)
medicao("series.plantas_da_s6_que_mudaram_de_forma_mordidas", sum(1 for p in series.get("plantas", []) if p["nome"] in ("um valor trocado na tabela", "as duas edições com valores diferentes") and p.get("mordeu")), CMD_S, "idem", True)
prim = ler_json(AQUI / "primeira-plantas.json") or {}
CMD_PR = "node tests/inicio/primeira-pagina.mjs --prova --json primeira-plantas.json"
pp = prim.get("plantas", [])
medicao("primeira.plantas", len(pp) if prim else NAO, CMD_PR, "a planta do RP4-c está entre elas", any("RP4-c" in str(x.get("nome")) for x in pp))
medicao("primeira.plantas_mordidas", sum(1 for x in pp if x.get("mordeu")), CMD_PR, "idem", any("RP4-c" in str(x.get("nome")) for x in pp))
medicao("primeira.planta_do_periodo_fora_do_desenho_mordeu", any("RP4-c" in str(x.get("nome")) and x.get("mordeu") and "janeiro de 1992" in str(x.get("queixa")) for x in pp), CMD_PR,
        "a planta antiga do algarismo à mão num bloco também mordeu", any(x.get("nome") == "um algarismo escrito à mão num bloco" and x.get("mordeu") for x in pp))
geo = ler(AQUI / "conferencias/check-primeira.log") or ""
medicao("g5.planta_da_linha_da_leitura_mordeu", "apanhada · preenchimento preto na linha da leitura de um ponto → [cor] G5 · rgb(0, 0, 0) em line" in geo,
        "npm run check:primeira (o registo em conferencias/check-primeira.log)", "a planta antiga das guias também mordeu", "apanhada · preenchimento preto nas guias da série" in geo)
port = ler_json(AQUI / "plantas-portoes-rp4c.json") or []
CMD_PP = "OEDP_MEDICOES=design/especime-v3/medicoes/rp4c-2026-10-05 node tests/pais/portoes.mjs --prefixo rp4c-"
medicao("portoes.plantas_rp4c", len(port), CMD_PP, "cada planta repôs os bytes do ficheiro que mexeu", bool(port) and all(all(f["antes"] == f["reposto"] for f in p["ficheiros"]) for p in port))
medicao("portoes.plantas_rp4c_que_morderam", sum(1 for p in port if p.get("passou")), CMD_PP, "cada uma saiu com o código 1 e a queixa esperada", bool(port) and all(p.get("codigo") == 1 for p in port if p.get("passou")))
medicao("portoes.plantas_rp4c_cabeca_e_estado", sorted({(p["cabeca"][:8], p["estado"]) for p in port}) if port else NAO, CMD_PP, "a árvore seguida estava limpa", bool(port) and all(p["estado"] == "" for p in port))

# ---- as conferências entre commits e os portões finais -------------------------------------------------------------
def codigos(pasta):
    return {f.stem: int(ler(f).strip()) for f in sorted((AQUI / pasta).glob("*.codigo"))} if (AQUI / pasta).is_dir() else {}
conf = codigos("conferencias")
medicao("conferencias.passos", len(conf), "sh design/especime-v3/medicoes/rp4c-2026-10-05/conferencias-rp4c.sh <pasta>, pela tranca, na cabeça do commit do código",
        "o portão de HTML está entre os passos", "gate-html" in conf)
medicao("conferencias.passos_a_zero", sum(1 for v in conf.values() if v == 0), "idem", "idem", "gate-html" in conf)
medicao("conferencias.cabeca", (ler(AQUI / "conferencias/cabeca") or NAO).strip()[:8], "idem", "o estado da árvore seguida foi escrito", (AQUI / "conferencias/estado").exists())
medicao("conferencias.estado_vazio", vazio(AQUI / "conferencias/estado"), "idem", "o estado da árvore seguida foi escrito", (AQUI / "conferencias/estado").exists())
gates = codigos("portoes")
for g in ("build", "verify", "typecheck"):
    medicao(f"portoes.{g}.codigo", gates.get(g, NAO), "sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4c-2026-10-05/portoes, pela tranca",
            "a cabeça do fim é a do princípio", (ler(AQUI / "portoes/cabeca") or "a") == (ler(AQUI / "portoes/cabeca.fim") or "b"))
    ini, fim = ler(AQUI / f"portoes/{g}.inicio"), ler(AQUI / f"portoes/{g}.fim")
    if ini and fim:
        from datetime import datetime
        segundos = int((datetime.fromisoformat(fim.strip().replace("Z", "+00:00")) - datetime.fromisoformat(ini.strip().replace("Z", "+00:00"))).total_seconds())
        medicao(f"portoes.{g}.segundos", segundos, "portoes/<g>.inicio e portoes/<g>.fim", "os dois carimbos existem", True)
medicao("portoes.cabeca", (ler(AQUI / "portoes/cabeca") or NAO).strip()[:8], "portoes/cabeca", "portoes/cabeca.fim existe", (AQUI / "portoes/cabeca.fim").exists())
medicao("portoes.estado_seguido_antes_vazio", vazio(AQUI / "portoes/estado-seguido-antes"), "git status --porcelain --untracked-files=no, antes da corrida",
        "o ficheiro do estado foi escrito", (AQUI / "portoes/estado-seguido-antes").exists())
medicao("portoes.estado_seguido_depois_vazio", vazio(AQUI / "portoes/estado-seguido-depois"), "git status --porcelain --untracked-files=no, depois da corrida",
        "o ficheiro do estado foi escrito", (AQUI / "portoes/estado-seguido-depois").exists())

provas = codigos("provas")
medicao("provas.passos", len(provas), "sh design/especime-v3/medicoes/rp4c-2026-10-05/provas-rp4c.sh, pela tranca, sobre a construção dos portões", "as capturas estão entre os passos", "capturas" in provas)
medicao("provas.passos_a_zero", sum(1 for v in provas.values() if v == 0), "idem", "idem", "capturas" in provas)
medicao("provas.cabeca", (ler(AQUI / "provas/cabeca") or NAO).strip()[:8], "provas/cabeca e provas/cabeca.fim", "a cabeça do fim é a do princípio", (ler(AQUI / "provas/cabeca") or "a") == (ler(AQUI / "provas/cabeca.fim") or "b"))
medicao("provas.construcao", (ler_json(AQUI / "provas/version.json") or {}).get("commit", NAO)[:8], "provas/version.json (a cópia do dist/version.json da construção medida)", "o commit da construção é a cabeça da corrida",
        (ler_json(AQUI / "provas/version.json") or {}).get("commit") == (ler(AQUI / "provas/cabeca") or "").strip())
medicao("provas.estado_vazio", vazio(AQUI / "provas/estado"), "git status --porcelain --untracked-files=no, antes das provas", "o ficheiro do estado foi escrito", (AQUI / "provas/estado").exists())
medicao("provas.estado_fim_vazio", vazio(AQUI / "provas/estado.fim"), "git status --porcelain --untracked-files=no, depois das provas", "o ficheiro do estado foi escrito", (AQUI / "provas/estado.fim").exists())

# ---- o mapa, os registos e o custo ---------------------------------------------------------------------------------
mapa = ler(AQUI / "mapa.log") or ""
def conta(rotulo):
    m = re.search(rf"{rotulo}: (\d+)", mapa)
    return int(m.group(1)) if m else NAO
medicao("mapa.citacoes_na_linha", conta(r"citações conferidas na linha citada \(±7\)"), "python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md",
        "o mapa tem a secção do RP4-c", "## RP4-c" in (ler(SITIO / "design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md") or ""))
medicao("mapa.citacoes_longe", conta("citação está no ficheiro, mas longe da linha citada"), "idem", "idem", True)
medicao("mapa.citacoes_por_encontrar", conta("citação não encontrada em nenhum dos ficheiros citados na mesma linha"), "idem", "idem", True)
diff = subprocess.run(["git", "-C", str(SITIO), "diff", "--numstat", "983b4585", "HEAD", "--", "src/i18n/strings.mjs", "design/especime-v3/INVENTARIO-FRASES.md", "design/especime-v3/CHAVES-EN.md"], capture_output=True, text=True)
medicao("registos.linhas_mudadas_nas_cadeias_no_inventario_e_nas_chaves", sum(int(a) + int(b) for a, b, *_ in (l.split("\t") for l in diff.stdout.splitlines())) if diff.returncode == 0 else NAO,
        "git diff --numstat 983b4585 HEAD -- src/i18n/strings.mjs design/especime-v3/INVENTARIO-FRASES.md design/especime-v3/CHAVES-EN.md",
        "o mesmo comando vê as linhas que o bloco mudou no módulo do desenho",
        subprocess.run(["git", "-C", str(SITIO), "diff", "--numstat", "983b4585", "HEAD", "--", "src/lib/formas/serie-do-pais.mjs"], capture_output=True, text=True).stdout.strip() != "")
custo = ler_json(AQUI / "custo.json") or {}
for chave in ("respostas_do_modelo", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo", "segundos"):
    medicao(f"custo.{chave}", custo.get(chave, NAO), "python3 design/especime-v3/medicoes/rp4c-2026-10-05/custo.py <registo da sessão do construtor>",
            "o registo lido tem respostas do modelo", (custo.get("respostas_do_modelo") or 0) > 0)
medicao("custo.modelos", custo.get("modelos", NAO), "idem", "o registo lido tem respostas do modelo", (custo.get("respostas_do_modelo") or 0) > 0)

saida = {"bloco": "RP4-c", "o_que": "as medidas do relatório do bloco (medir.py)", "quantas_medidas": len(medidas), "medidas": medidas}
(AQUI / "medidas.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
nao_lidas = [m["nome"] for m in medidas if m["valor"] == NAO]
sem_positivo = [m["nome"] for m in medidas if not m["conhecido_positivo"]["encontrado"]]
print(f"{len(medidas)} medidas · {len(nao_lidas)} não lidas · {len(sem_positivo)} sem o conhecido-positivo")
for n in nao_lidas: print("  NÃO LIDA:", n)
for n in sem_positivo: print("  SEM CONHECIDO-POSITIVO:", n)
raise SystemExit(1 if nao_lidas or sem_positivo else 0)
