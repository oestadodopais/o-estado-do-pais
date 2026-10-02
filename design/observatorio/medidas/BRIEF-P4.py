#!/usr/bin/env python3
"""O §0 do brief P4 (os pequenos do sítio depois do UE2), medido sobre a cabeça presa do sítio (642e9d56). Não lê a rede:
lê as réguas à mão, as medidas do K2-c, as declarações das definições, os rótulos e o guião das decisões em vigor na cabeça.
Escreve design/observatorio/medidas/BRIEF-P4.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "642e9d56"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


# 00 · o tema: as folhas que seguem a preferência do aparelho, e os lugares onde o comando se rende
folhas = [f for f in ["src/styles/tokens.css", "src/styles/site.css", "src/styles/dominio.css"] if "prefers-color-scheme: dark" in (mostrar(f) or "")]
medicao("folhas_que_seguem_a_preferencia_do_aparelho", len(folhas), "as folhas de src/styles com «prefers-color-scheme: dark»",
        "tokens.css é uma delas", "src/styles/tokens.css" in folhas)
r = subprocess.run(["git", "-C", str(SITIO), "grep", "-l", "ControloDeTema", CAB, "--", "src/layouts", "src/components", "src/views"], capture_output=True, text=True)
usos = [l.split(":", 1)[1] for l in r.stdout.split() if ":" in l and not l.endswith("ControloDeTema.astro")]
medicao("lugares_onde_o_comando_do_tema_e_rendido", len(usos), f"git grep -l ControloDeTema {CAB} -- src/layouts src/components src/views, sem o próprio componente",
        "o componente existe na cabeça", bool(mostrar("src/components/ControloDeTema.astro")))

# 0 · as entradas do menu principal
nav = mostrar("src/lib/navegacao.mjs") or ""
rotas = re.search(r"export const ROTAS_NAV = \[([^\]]*)\]", nav)
entradas = re.findall(r"'([a-z-]+)'", rotas.group(1)) if rotas else []
medicao("entradas_do_menu", len(entradas) if nav else NAO, f"git show {CAB}:src/lib/navegacao.mjs · ROTAS_NAV",
        "«lugares» é uma delas e «uniao-europeia» não", "lugares" in entradas and "uniao-europeia" not in entradas)

# 1 · as réguas à mão que ainda procuram a primeira página antiga (o mapa, a pesquisa, a porta do mapa)
reguas = ["tests/inicio/correcoes-a.mjs", "tests/inicio/lista.mjs", "tests/inicio/mapa-distritos.mjs", "tests/inicio/mapa-unidades.mjs", "tests/inicio/matriz.mjs"]
com = [r for r in reguas if re.search(r"pp-lugares|/#mapa|pesquisa-bloco|data-pesquisa-bloco|MapaRespira|mapa-svg", mostrar(r) or "")]
medicao("reguas_a_mao_que_leem_a_primeira_pagina_antiga", len(com) if all(mostrar(r) for r in reguas) else NAO,
        "as cinco réguas do relatório do L2b, procuradas por pp-lugares, /#mapa, pesquisa-bloco, MapaRespira ou mapa-svg",
        "a matriz é uma delas", "tests/inicio/matriz.mjs" in com)

# 2 · a regra das casas decimais: quantas linhas lê e quantas deixa por ler (as medidas da K2-c)
try:
    k2c = json.loads(mostrar("design/especime-v3/medicoes/k2-2026-10-02/medidas-k2-c.json") or "{}")
    m = next((x for x in k2c.get("medidas", []) if x.get("nome") == "linhas_lidas_pelo_literal_do_valor"), {})
    ev = m.get("contas") or {}
    lidas, por_ler = ev.get("com_literal_do_valor"), ev.get("sem_literal_do_valor")
except Exception:
    lidas = por_ler = None
medicao("linhas_que_a_regra_das_casas_decimais_le", lidas if lidas is not None else NAO,
        f"git show {CAB}:design/especime-v3/medicoes/k2-2026-10-02/medidas-k2-c.json · a medida linhas_lidas_pelo_literal_do_valor",
        "a medida existe e tem evidência", bool(ev))
medicao("linhas_que_a_regra_das_casas_decimais_deixa_por_ler", por_ler if por_ler is not None else NAO, "a mesma medida, o campo sem_literal_do_valor",
        "as duas somam mais de duas mil linhas", (lidas or 0) + (por_ler or 0) > 2000)

# 3 · os dois termos das definições das páginas de assunto sem explicação
fig = mostrar("src/data/figuras.mjs") or ""
termos = {"em pontos percentuais": len(re.findall(r"em pontos percentuais", fig)), "regimes de ocupação": len(re.findall(r"regimes de ocupação", fig))}
medicao("ocorrencias_dos_dois_termos_nas_definicoes", sum(termos.values()) if fig else NAO,
        f"git show {CAB}:src/data/figuras.mjs · «em pontos percentuais» e «regimes de ocupação»", "«regimes de ocupação» aparece", termos["regimes de ocupação"] > 0)

# 4 · a nota do sucessor: as palavras que tem
rot = mostrar("src/data/rotulos-b1.mjs") or ""
medicao("palavras_da_nota_do_sucessor_que_dizem_a_reconciliacao", len(re.findall(r"reconcilia", rot)) if rot else NAO,
        f"git show {CAB}:src/data/rotulos-b1.mjs · «reconcilia»", "o rótulo «sucedeu-lhe» existe", "sucedeu-lhe" in rot)

# 5 · o guião das decisões em vigor com um intervalo que tem PNG
r = subprocess.run(["python3", "scripts/leituras/decisoes-em-vigor.py", "--intervalo", "74ce7657..642e9d56"], cwd=str(SITIO), capture_output=True, text=True)
medicao("codigo_do_decisoes_em_vigor_num_intervalo_com_png", r.returncode, "python3 scripts/leituras/decisoes-em-vigor.py --intervalo 74ce7657..642e9d56 (o UE2, que tem capturas PNG)",
        "a saída diz que não leu um byte 0x89", "0x89" in (r.stdout + r.stderr))

# 6 · a linha da descrição em CHAVES-EN.md
ch = mostrar("design/especime-v3/CHAVES-EN.md") or ""
medicao("linhas_de_chaves_en_com_a_descricao_de_setembro", len(re.findall(r"metaDescricao", ch)) if ch else NAO,
        f"git show {CAB}:design/especime-v3/CHAVES-EN.md · «metaDescricao»", "o ficheiro tem a tabela das chaves", "| `" in ch)

saida = {"brief": "design/observatorio/BRIEF-P4-os-pequenos-do-sitio.md", "guiao": "design/observatorio/medidas/BRIEF-P4.py",
         "cabeca_lida": CAB, "reguas_com_a_primeira_pagina_antiga": com, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-P4.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
