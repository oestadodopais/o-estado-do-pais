#!/usr/bin/env python3
"""O §0 do brief R3 (o índice do sítio), medido sobre a cabeça presa do sítio (1c4dde2f). Não lê a rede: lê a tabela das
rotas, as listas do menu e do rodapé, os ficheiros de página e os módulos de dados na cabeça. Escreve
design/observatorio/medidas/BRIEF-R3.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "1c4dde2f"
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


rotas_src = mostrar("src/lib/routes.mjs") or ""
bloco = rotas_src[rotas_src.index("export const ROUTES = {"):] if rotas_src else ""
bloco = bloco[:bloco.index("\n};")] if bloco else ""
chaves = re.findall(r"^\s{2}([a-zA-Z]+): \{", bloco, flags=re.M)
medicao("rotas_declaradas", len(chaves) if rotas_src else NAO, f"git show {CAB}:src/lib/routes.mjs · as chaves de ROUTES", "a das sugestões é uma delas", "sugestoes" in chaves)
medicao("rotas_de_indice_declaradas", sum(1 for c in chaves if c.lower().startswith("indice") or c.lower() == "index") if rotas_src else NAO,
        "as chaves de ROUTES que começam por «indice»", "a mesma leitura vê a chave lugares", "lugares" in chaves)
nav = mostrar("src/lib/navegacao.mjs") or ""
m = re.search(r"export const ROTAS_NAV = \[([^\]]*)\]", nav); menu = re.findall(r"'([a-zA-Z]+)'", m.group(1)) if m else []
m = re.search(r"export const ROTAS_RODAPE = \[([^\]]*)\]", nav); rodape = re.findall(r"'([a-zA-Z]+)'", m.group(1)) if m else []
medicao("portas_do_menu", len(menu) if nav else NAO, f"git show {CAB}:src/lib/navegacao.mjs · ROTAS_NAV", "a União é uma delas", "uniaoEuropeia" in menu)
medicao("portas_do_rodape", len(rodape) if nav else NAO, f"git show {CAB}:src/lib/navegacao.mjs · ROTAS_RODAPE", "o livro é uma delas", "livro" in rodape)
pt = [f for f in listar("src/pages") if f.endswith(".astro") and "/en/" not in f]
en = [f for f in listar("src/pages/en") if f.endswith(".astro")]
medicao("ficheiros_de_pagina_portugueses", len(pt) if pt else NAO, f"git ls-tree -r {CAB}:src/pages · os .astro fora de en/", "a primeira página é um deles", "src/pages/index.astro" in pt)
medicao("ficheiros_de_pagina_ingleses", len(en) if en else NAO, f"git ls-tree -r {CAB}:src/pages/en · os .astro", "a primeira página inglesa é um deles", "src/pages/en/index.astro" in en)
studies = mostrar("src/data/studies.mjs") or ""
obras = re.findall(r"^\s{2}\{\s*\n?\s*(?:slug|id):", studies, flags=re.M) or re.findall(r"slug: '", studies)
medicao("estudos_declarados", len(re.findall(r"^\s*slug: '", studies, flags=re.M)) if studies else NAO, f"git show {CAB}:src/data/studies.mjs · as entradas com slug", "o Évora 2027 é um deles", "evora-2027" in studies)
sucessores = len(re.findall(r"^\s*sucedidoPor:", studies, flags=re.M)) if studies else None
medicao("estudos_com_sucessor", sucessores if studies else NAO, "as entradas de studies.mjs com o campo sucedidoPor", "há pelo menos um (as seis edições antigas de Évora)", bool(sucessores))
conf = mostrar("astro.config.mjs") or ""
medicao("filtro_do_mapa_do_sitio_declarado", bool(re.search(r"sitemap\(\{", conf)) if conf else NAO, f"git show {CAB}:astro.config.mjs · a chamada sitemap com o filtro", "o filtro fala das páginas de linha do livro", "linha" in conf.lower())
rodape = mostrar("src/components/SiteFooter.astro") or ""
medicao("portas_do_rodape_para_um_indice", len(re.findall(r"indice", rodape, flags=re.I)) if rodape else NAO, f"git show {CAB}:src/components/SiteFooter.astro · a palavra «indice»", "o rodapé tem a porta das correções", "correccoes" in rodape)

saida = {"brief": "design/observatorio/BRIEF-R3-o-indice-do-sitio.md", "guiao": "design/observatorio/medidas/BRIEF-R3.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-R3.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
