#!/usr/bin/env python3
"""O §0 do brief H4 (o menu do telefone em duas linhas), medido sobre a cabeça presa do sítio (CAB). Lê só o
repositório, pela cabeça presa (`git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-H4.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "4b29f707"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


nav = git("show", f"{CAB}:src/lib/navegacao.mjs") or ""
rotas_nav = re.search(r"export const ROTAS_NAV = \[([^\]]*)\]", nav)
portas_nav = re.findall(r"'([A-Za-z]+)'", rotas_nav.group(1)) if rotas_nav else []
medicao("portas_do_menu", len(portas_nav) if rotas_nav else NAO, f"git show {CAB}:src/lib/navegacao.mjs · as entradas de ROTAS_NAV", "a porta da União é uma das entradas", "uniaoEuropeia" in portas_nav)
rotas_rod = re.search(r"export const ROTAS_RODAPE = \[([^\]]*)\]", nav)
portas_rod = re.findall(r"'([A-Za-z]+)'", rotas_rod.group(1)) if rotas_rod else []
medicao("portas_do_rodape", len(portas_rod) if rotas_rod else NAO, f"git show {CAB}:src/lib/navegacao.mjs · as entradas de ROTAS_RODAPE", "a porta das explicações é uma das entradas do rodapé", "explicacoes" in portas_rod)

css = git("show", f"{CAB}:src/styles/site.css") or ""
bloco = re.search(r"@media \(width <= (\d+)px\) \{\s*\.menu-cinco \{ gap: 0 (\d+)px; \}\s*\.menu-cinco a \{ font-size: (\d+)px", css)
medicao("largura_da_regra_do_telefone_px", int(bloco.group(1)) if bloco else NAO, f"git show {CAB}:src/styles/site.css · a largura do @media que aperta o .menu-cinco", "o bloco @media contém a regra do .menu-cinco", bool(bloco))
medicao("espaco_entre_portas_ate_430_px", int(bloco.group(2)) if bloco else NAO, f"git show {CAB}:src/styles/site.css · o gap do .menu-cinco dentro do @media do telefone", "o bloco @media contém a regra do .menu-cinco", bool(bloco))
medicao("letra_do_menu_ate_430_px", int(bloco.group(3)) if bloco else NAO, f"git show {CAB}:src/styles/site.css · o font-size do .menu-cinco a dentro do @media do telefone", "o bloco @media contém a regra do .menu-cinco", bool(bloco))
base = re.search(r"\.menu-cinco \{[^}]*gap: 0 clamp\((\d+)px", css)
medicao("espaco_minimo_entre_portas_nas_outras_larguras", int(base.group(1)) if base else NAO, f"git show {CAB}:src/styles/site.css · o mínimo do clamp do gap do .menu-cinco", "a regra base do .menu-cinco usa clamp", bool(base))
letra = re.search(r"\.menu-cinco a \{[^}]*font-size: (\d+)px", css)
medicao("letra_do_menu_nas_outras_larguras", int(letra.group(1)) if letra else NAO, f"git show {CAB}:src/styles/site.css · o font-size da regra base do .menu-cinco a", "a regra base do .menu-cinco a existe", bool(letra))

alvos = git("show", f"{CAB}:tests/acessibilidade/alvos.mjs") or ""
larg = re.search(r"const LARGURAS = \[([\d, ]+)\]", alvos)
larguras = [int(x) for x in re.findall(r"\d+", larg.group(1))] if larg else []
medicao("largura_do_telefone_px", larguras[0] if larguras else NAO, f"git show {CAB}:tests/acessibilidade/alvos.mjs · a primeira largura de LARGURAS", "a lista das larguras inclui 1280", 1280 in larguras)

try:
    menu = json.loads(git("show", f"{CAB}:design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json") or "null")
except json.JSONDecodeError:
    menu = None
meds = (menu or {}).get("medidas", []) if isinstance(menu, dict) else []
pub = next((m for m in meds if m.get("lang") == "pt" and m.get("forma") == "publicada"), None)
sete = next((m for m in meds if m.get("lang") == "pt" and m.get("forma") == "com a sétima porta"), None)
medicao("largura_natural_das_seis_portas_pt_a_390_px", round(pub["natural"]) if pub else NAO, f"git show {CAB}:design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json · «natural» da forma publicada em pt, arredondado", "a medida publicada em pt tem seis portas", bool(pub) and pub.get("portas") == 6)
medicao("coluna_do_menu_a_390_px", pub["coluna"] if pub else NAO, f"git show {CAB}:design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json · «coluna» da forma publicada em pt", "a medida publicada em pt tem seis portas", bool(pub) and pub.get("portas") == 6)
medicao("largura_natural_das_sete_portas_pt_a_390_px", round(sete["natural"]) if sete else NAO, f"git show {CAB}:design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json · «natural» da forma com a sétima porta em pt, arredondado", "a medida com a sétima porta em pt tem sete portas", bool(sete) and sete.get("portas") == 7)
medicao("linhas_do_menu_com_sete_portas_pt_a_390_px", sete["linhas"] if sete else NAO, f"git show {CAB}:design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json · «linhas» da forma com a sétima porta em pt", "a medida com a sétima porta em pt tem sete portas", bool(sete) and sete.get("portas") == 7)

tm = git("show", f"{CAB}:tests/inicio/tema-e-menu.mjs") or ""
exig = re.search(r"e\.menu\.portas !== (\d+)", tm)
medicao("portas_exigidas_pela_celula_tm4", int(exig.group(1)) if exig else NAO, f"git show {CAB}:tests/inicio/tema-e-menu.mjs · o número da comparação «e.menu.portas !==»", "a célula escreve «TM4» na queixa das portas", "TM4" in tm and "o menu tem" in tm)

pol = git("show", f"{CAB}:src/data/politica-ia.mjs") or ""
sec = re.search(r"lugares: \{(.*?)fecho: \{", pol, re.S)
rotulos = re.findall(r"rotulo: \{ pt: '([^']+)'", sec.group(1)) if sec else []
medicao("lugares_declarados_na_politica_de_ia", len(rotulos) if sec else NAO, f"git show {CAB}:src/data/politica-ia.mjs · os «rotulo» da secção «lugares»", "um dos lugares chama-se «A leitura»", "A leitura" in rotulos)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-H4.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-H4-o-menu-do-telefone-em-duas-linhas.md", "guiao": "design/observatorio/medidas/BRIEF-H4.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
