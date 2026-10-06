#!/usr/bin/env python3
"""EX1: as medidas do relatório, cada uma com o nome, o valor, o comando que a produziu e um conhecido-positivo.

Uso (da raiz do sítio, depois dos portões, das provas e da limpeza dos registos):
  python3 design/especime-v3/medicoes/ex1-2026-10-05/medir.py

Lê só ficheiros desta pasta (os registos dos portões em `portoes/`, os das provas em `provas/`, os JSON que as provas
escreveram) e as linhas do livro-razão que o relatório cita, e escreve `medidas.json`. Uma medida cujo conhecido-positivo
falhe fica com `encontrado: false` e o guião sai com 1: um valor lido de um ficheiro que não tem o que se procurava não
é um valor. Nenhum número se escreve aqui à mão: cada um sai de um ficheiro, por uma expressão ou por uma chave.
"""
import json
import re
import sys
from datetime import datetime
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
REL = lambda p: str(Path(p).resolve().relative_to(SITIO))
medidas = []
falhas = []


def medida(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
    if not encontrado:
        falhas.append(nome)


def ler(p):
    return (AQUI / p).read_text(encoding="utf-8") if (AQUI / p).exists() else ""


def js(p):
    return json.loads(ler(p)) if (AQUI / p).exists() else None


def segundos(pasta, nome):
    i, f = ler(f"{pasta}/{nome}.inicio").strip(), ler(f"{pasta}/{nome}.fim").strip()
    if not i or not f:
        return None
    a = datetime.fromisoformat(i.replace("Z", "+00:00")); b = datetime.fromisoformat(f.replace("Z", "+00:00"))
    return int((b - a).total_seconds())


# ------------------------------------------------------------------ os portões
CMD_PORTOES = "RESEARCHHUB_DIR=<worktree do motor> sh scripts/leituras/portoes.sh <worktree do sítio> design/especime-v3/medicoes/ex1-2026-10-05/portoes"
cab = ler("portoes/cabeca").strip()
medida("portoes.cabeca", cab, CMD_PORTOES, "a cabeça dos portões é a de antes e a de depois da corrida", cab and cab == ler("portoes/cabeca-antes-da-corrida").strip() == ler("portoes/cabeca.fim").strip() == ler("portoes/cabeca-depois-da-corrida").strip())
for g in ("build", "verify", "typecheck"):
    c = ler(f"portoes/{g}.codigo").strip()
    medida(f"portoes.{g}.codigo", int(c) if c.isdigit() else None, CMD_PORTOES + f" (portoes/{g}.codigo)", f"o registo portoes/{g}.log começa pela linha do npm do portão", f"> o-estado-do-pais@0.1.0 {g}" in ler(f"portoes/{g}.log"))
    s = segundos("portoes", g)
    medida(f"portoes.{g}.segundos", s, CMD_PORTOES + f" (portoes/{g}.inicio e .fim)", "as duas horas estão escritas", s is not None)
for q in ("antes", "depois"):
    t = ler(f"portoes/estado-seguido-{q}")
    medida(f"portoes.estado_seguido_{q}.linhas", len([l for l in t.splitlines() if l.strip()]), f"git status --porcelain --untracked-files=no > portoes/estado-seguido-{q}", "o ficheiro foi escrito", (AQUI / f"portoes/estado-seguido-{q}").exists())
verify = ler("portoes/verify.log")
m = re.search(r"EX1 · (\d+) marca\(s\) da leitura da semana recontadas na janela que acaba a (\S+), (\d+) página\(s\) de explicação e (\d+) <head> de explicação conferidos", verify)
for k, i in (("marcas_da_semana", 1), ("paginas_de_explicacao", 3), ("heads_de_explicacao", 4)):
    medida(f"verify.gate_html.{k}", int(m.group(i)) if m else None, "npm run verify (portoes/verify.log, a linha «EX1 · … marca(s) da leitura da semana recontadas»)", "a linha do portão de HTML está no registo", m)
medida("verify.gate_html.fim_da_janela", m.group(2) if m else None, "npm run verify (portoes/verify.log)", "a linha do portão de HTML está no registo", m)
m = re.search(r"F22 · (\d+) figuras das explicações recompostas das linhas · (\d+) de (\d+) plantas em memória", verify)
for k, i in (("figuras", 1), ("plantas_que_morderam", 2), ("plantas", 3)):
    medida(f"verify.check_formas.f22_{k}", int(m.group(i)) if m else None, "npm run verify (portoes/verify.log, a linha «F22 · …»)", "a linha da F22 está no registo", m)
m = re.search(r"L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)", verify)
medida("verify.check_lugar.l1", int(m.group(1)) if m else None, "npm run verify (portoes/verify.log, a linha «L1 · …»)", "a linha da L1 está no registo", m)
medida("verify.check_lugar.l1_teto", int(m.group(2)) if m else None, "npm run verify (portoes/verify.log)", "a linha da L1 está no registo", m)
m = re.search(r"EX1: (\d+) página\(s\) com as palavras das explicações e as frases da semana conferidas", verify)
medida("verify.check_voz.paginas_ex1", int(m.group(1)) if m else None, "npm run verify (portoes/verify.log, a linha «EX1: … página(s) com as palavras das explicações»)", "a linha do check:voz está no registo", m)
m = re.search(r"X · a explicação: .*? (\d+) de (\d+) plantas em memória", verify)
medida("verify.check_explicacoes.x_plantas", [int(m.group(1)), int(m.group(2))] if m else None, "npm run verify (portoes/verify.log, a linha «X · a explicação»)", "a linha da célula X está no registo", m)
m = re.search(r"W · a leitura da semana: janela (\S+) a (\S+), (\d+) relidas, (\d+) mudadas de valor, (\d+) de proveniência; W1 (\d+) de (\d+) plantas na cópia do livro; (\d+) porta\(s\) da semana conferidas; (\d+) de (\d+) plantas na página", verify)
medida("verify.check_explicacoes.w", {"inicio": m.group(1), "fim": m.group(2), "relidas": int(m.group(3)), "valor": int(m.group(4)), "proveniencia": int(m.group(5)), "w1": [int(m.group(6)), int(m.group(7))], "portas": int(m.group(8)), "plantas_na_pagina": [int(m.group(9)), int(m.group(10))]} if m else None,
       "npm run verify (portoes/verify.log, a linha «W · a leitura da semana»)", "a linha da célula W está no registo", m)
m = re.search(r"H3 .*?(\d+) página\(s\) do dist/: 0 sem título único", verify)
medida("verify.check_alvos.paginas_do_dist", int(m.group(1)) if m else None, "npm run verify (portoes/verify.log, a H3 do check:alvos)", "a linha da H3 está no registo", m)
medida("verify.check_alvos.todas_verdes", "todas as células verdes" in verify, "npm run verify (portoes/verify.log)", "o check:alvos correu (a linha H10 está no registo)", "H10" in verify)

# ------------------------------------------------------------------ as provas
CMD_PROVAS = "RESEARCHHUB_DIR=<worktree do motor> sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh <worktree do sítio> <registo> <código> sh design/especime-v3/medicoes/ex1-2026-10-05/provas-ex1.sh"
pc = ler("provas/cabeca").strip()
medida("provas.cabeca", pc, CMD_PROVAS, "a cabeça das provas é a dos portões e a do fim das provas", pc and pc == cab == ler("provas/cabeca.fim").strip())
medida("provas.estado.linhas", len([l for l in ler("provas/estado").splitlines() if l.strip()]), CMD_PROVAS + " (provas/estado)", "o ficheiro foi escrito", (AQUI / "provas/estado").exists())
versao = js("provas/version.json") or {}
medida("provas.construcao", versao.get("commit"), "cp dist/version.json provas/version.json", "a construção medida é a da cabeça dos portões", versao.get("commit") == cab)
for passo in ("brief", "acertos", "explicacao", "semana", "sinais", "menu", "capturas", "frases-em-flex", "plantas-dos-portoes", "mapa", "mapa-a-mao"):
    c = ler(f"provas/{passo}.codigo").strip()
    medida(f"provas.{passo}.codigo", int(c) if c.isdigit() else None, CMD_PROVAS + f" (provas/{passo}.codigo)", f"o registo provas/{passo}.log começa pela cabeça", ler(f"provas/{passo}.log").startswith("cabeça: "))

# ------------------------------------------------------------------ o §0 do brief, reproduzido
rep = js("brief-reproduzido.json") or {"medidas": []}
br = json.loads((SITIO / "design/observatorio/medidas/BRIEF-EX1.json").read_text(encoding="utf-8"))
pares = {x["nome"]: x["valor"] for x in br["medidas"]}
iguais = [x["nome"] for x in rep["medidas"] if pares.get(x["nome"]) == x["valor"]]
medida("brief.medidas", len(rep["medidas"]), "OEDP_MEDIDAS_JSON=<pasta>/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-EX1.py", "a cabeça lida é a do brief e cada medida tem o seu conhecido-positivo encontrado", rep.get("cabeca_lida") == br.get("cabeca_lida") and all(x["conhecido_positivo"]["encontrado"] for x in rep["medidas"]))
medida("brief.medidas_iguais_as_do_brief", len(iguais), "a comparação de brief-reproduzido.json com design/observatorio/medidas/BRIEF-EX1.json", "as duas listas têm as mesmas medidas", set(pares) == {x["nome"] for x in rep["medidas"]})
antes = js("brief-reproduzido-antes-de-mexer.json") or {"medidas": []}
medida("brief.antes_de_mexer.medidas_iguais", sum(1 for x, y in zip(antes["medidas"], br["medidas"]) if x == y), "OEDP_MEDIDAS_JSON=<pasta temporária>/brief-ex1-reproduzido.json python3 design/observatorio/medidas/BRIEF-EX1.py, antes do primeiro commit do bloco (copiado para brief-reproduzido-antes-de-mexer.json)", "a reprodução leu a cabeça do brief e tem as mesmas medidas", antes.get("cabeca_lida") == br.get("cabeca_lida") and len(antes["medidas"]) == len(br["medidas"]))
menu = js("menu-a-390.json") or {"medidas": []}
pub = [x for x in menu["medidas"] if x["forma"] == "publicada"]
medida("brief.portas_do_menu", pares.get("portas_do_menu"), "design/observatorio/medidas/BRIEF-EX1.json", "a medida está no ficheiro do brief", "portas_do_menu" in pares)
medida("menu.portas_publicadas", sorted({x["portas"] for x in pub}), "node design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.mjs (menu-a-390.json, a forma «publicada»)", "as duas edições foram medidas", len(pub) == 2)
for x in menu["medidas"]:
    chave = f"menu.{x['lang']}.{'publicada' if x['forma'] == 'publicada' else 'com_a_setima'}"
    medida(chave, {"portas": x["portas"], "largura_das_portas_px": x["natural"], "coluna_px": x["coluna"], "linhas": x["linhas"], "cabe": x["cabe"], "falta_px": x["falta"]}, "node design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.mjs", "a captura do cabeçalho existe com o sha256 escrito", (SITIO / x["captura"]).exists())
medida("menu.decisao", menu.get("decisao"), "node design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.mjs", "a medida é da construção dos portões", menu.get("construcao") == cab)

# ------------------------------------------------------------------ o texto da explicação
ac = js("acertos.json") or {}
medida("acertos.blocos", ac.get("blocos"), "node design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs --json <pasta>/acertos.json", "o texto do brief com os acertos é o da declaração, e nenhum erro", ac.get("iguais") is True and not ac.get("erros"))
somas = {}
for x in ac.get("acertos", []):
    somas[x["id"]] = somas.get(x["id"], 0) + x["vezes"]
medida("acertos.exercidos", somas if ac else None, "node design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs", "os dez acertos estão na lista", len({x["id"] for x in ac.get("acertos", [])}) == 10)
ex = js("explicacao.json") or {}
au = ex.get("auditoria", {})
medida("explicacao.auditoria", {k: au.get(k) for k in ("explicacoes", "folhas", "partes", "diz", "conta", "aponta", "liga", "origens")}, "node tests/explicacoes/explicacao.mjs --prova --json <pasta>/explicacao.json", "a auditoria correu sem erros", ex and not ex.get("erros"))
medida("explicacao.origens", ex.get("origens"), "node tests/explicacoes/explicacao.mjs --prova (com o motor ao lado)", "as origens foram lidas no motor", (ex.get("origens") or {}).get("motor") is True)
medida("explicacao.paginas", ex.get("paginas"), "node tests/explicacoes/explicacao.mjs --prova", "as plantas correram", bool(ex.get("plantas")))
medida("explicacao.plantas", [sum(1 for p in ex.get("plantas", []) if p["mordeu"]), len(ex.get("plantas", []))], "node tests/explicacoes/explicacao.mjs --prova", "todas morderam", ex.get("plantas") and all(p["mordeu"] for p in ex["plantas"]))
se = js("semana.json") or {}
medida("semana.janela", se.get("janela"), "node tests/explicacoes/semana.mjs --prova --json <pasta>/semana.json", "a janela acaba num dia que o carimbo da construção aceita", (se.get("janela") or {}).get("fim") in (se.get("aceites") or []))
medida("semana.contagens", se.get("contagens"), "node tests/explicacoes/semana.mjs --prova", "a célula correu sem erros", se and not se.get("erros"))
medida("semana.mudancas", se.get("mudancas"), "node tests/explicacoes/semana.mjs --prova", "o número de mudanças é o da contagem de valor", se.get("mudancas") == (se.get("contagens") or {}).get("valor"))
medida("semana.blocos_que_mudaram", se.get("blocos_que_mudaram"), "node tests/explicacoes/semana.mjs --prova", "a chave está no resumo", "blocos_que_mudaram" in se)
medida("semana.w1", [{"nome": p["nome"], "mordeu": p["mordeu"]} for p in se.get("w1", [])], "node tests/explicacoes/semana.mjs --prova", "as quatro plantas da cópia do livro morderam", len(se.get("w1", [])) == 4 and all(p["mordeu"] for p in se["w1"]))
medida("semana.plantas_na_pagina", [sum(1 for p in se.get("plantas", []) if p["mordeu"]), sum(1 for p in se.get("plantas", []) if p.get("aplica", True))], "node tests/explicacoes/semana.mjs --prova", "todas as que se aplicam morderam", se.get("plantas") and all(p["mordeu"] for p in se["plantas"] if p.get("aplica", True)))
medida("semana.portas", se.get("portas"), "node tests/explicacoes/semana.mjs --prova", "a chave está no resumo", "portas" in se)
si = js("sinais-explicacoes.json")
medida("sinais.explicacoes", si, "node scripts/sinais-da-primeira-pagina.mjs; cp .sinais/explicacoes.json <pasta>/sinais-explicacoes.json", "o ficheiro dos sinais foi escrito", si is not None)

# ------------------------------------------------------------------ as linhas que o relatório cita
def valor_da_linha(i):
    t = (SITIO / "ledger/claims" / f"{i}.yml").read_text(encoding="utf-8")
    v = re.search(r'^value: "([^"]*)"', t, re.M); u = re.search(r'^unit: "([^"]*)"', t, re.M); n = re.search(r'^name: "([^"]*)"', t, re.M)
    return {"value": v.group(1) if v else None, "unit": u.group(1) if u else None, "name": n.group(1) if n else None}
for i in ["execucao-2026-08-despesa-programa-004", "execucao-2026-08-despesa-programa-005", "execucao-2026-08-despesa-programa-015", "execucao-2026-08-despesa-programa-016",
          "oe-2026-cem-euros-funcao-07", "oe-2026-cem-euros-funcao-09", "oe-2026-cem-euros-ministerio-saude", "oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao",
          "saldo-das-administracoes-publicas-2025", "divida-publica-2025", "divida-publica-2025-ue"]:
    v = valor_da_linha(i)
    medida(f"linha.{i}", v, f"grep '^value:' ledger/claims/{i}.yml", "a linha tem valor e unidade", v["value"] and v["unit"])

# ------------------------------------------------------------------ as capturas
cp = js("capturas.json") or {"capturas": [], "plantas": [], "erros": ["sem capturas.json"]}
inteiras = [c for c in cp["capturas"] if "recorte" not in c]
medida("capturas.quantas", len(cp["capturas"]), "node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1.mjs --json capturas.json", "cada captura tem o sha256 e o ficheiro existe", all(c.get("sha256") and (SITIO / c["ficheiro"]).exists() for c in cp["capturas"]))
medida("capturas.paginas_inteiras", len(inteiras), "idem", "quatro rotas, duas edições, cinco larguras", len({(c["rota"], c["largura"]) for c in inteiras}) == len(inteiras))
medida("capturas.transbordos", sum(1 for c in inteiras if c.get("transborda")), "idem", "a planta do transbordo mordeu", any(p["nome"].startswith("uma página mais larga") and p["mordeu"] for p in cp["plantas"]))
medida("capturas.plantas", [sum(1 for p in cp["plantas"] if p["mordeu"]), len(cp["plantas"])], "idem", "as três plantas correram", len(cp["plantas"]) == 3)
medida("capturas.erros", len(cp["erros"]), "idem", "a corrida chegou ao fim (as plantas estão no ficheiro)", bool(cp["plantas"]))
for c in inteiras:
    if c.get("para_perceber") and c["largura"] == 390:
        pp = c["para_perceber"]
        medida(f"capturas.para_perceber.{c['lang']}.390", {"altura_px": pp["altura_px"], "menor_porta_px": pp["menor_porta_px"], "alturas_das_portas_px": [x["altura_px"] for x in pp["portas"]], "fecha_o_que_se_passa": pp["dentro_de_o_que_se_passa"] and pp["depois_do_ultimo_bloco"]}, "idem", "a planta da porta curta mordeu", any(p["nome"].startswith("uma porta do bloco") and p["mordeu"] for p in cp["plantas"]))
    if c.get("figuras") and c["largura"] == 390:
        medida(f"capturas.figuras.{c['lang']}.390", c["figuras"], "idem", "a planta do valor fora da figura mordeu", any(p["nome"].startswith("o valor de uma barra") and p["mordeu"] for p in cp["plantas"]))
    if c.get("mudancas_rendidas") is not None and c["largura"] == 390:
        medida(f"capturas.semana.{c['lang']}.mudancas_rendidas", c["mudancas_rendidas"], "idem", "a página da semana foi capturada", True)

# ------------------------------------------------------------------ as frases compostas em contentores flexíveis
ff = js("frases-em-flex.json") or {}
medida("frases_em_flex.erros", len(ff.get("erros", [""])) if ff else None, "node design/especime-v3/medicoes/ex1-2026-10-05/frases-em-flex.mjs --json <pasta>/frases-em-flex.json", "a planta da porta num contentor flexível mordeu, na construção dos portões", ff and ff.get("construcao") == cab and all(p["mordeu"] for p in ff.get("plantas", [])) and bool(ff.get("plantas")))
medida("frases_em_flex.passagens", len(ff.get("resultados", [])), "idem", "cada passagem viu pedaços marcados", ff and all(r["pedacos"] > 0 or r["rota"] in ("/explicacoes/leitura-da-semana/", "/en/explainers/weekly-reading/") for r in ff.get("resultados", [])))
medida("frases_em_flex.pedacos", sum(r["pedacos"] for r in ff.get("resultados", [])), "idem", "a contagem é a soma das passagens", bool(ff.get("resultados")))

# ------------------------------------------------------------------ a primeira corrida (48254647), que as capturas apanharam
P1 = "primeira-corrida"
c1 = ler(f"{P1}/portoes/cabeca").strip()
medida("primeira.portoes.cabeca", c1, CMD_PORTOES + " (na primeira corrida, guardada em primeira-corrida/portoes)", "a cabeça é a de antes e a de depois dessa corrida", c1 and c1 == ler(f"{P1}/portoes/cabeca-antes-da-corrida").strip() == ler(f"{P1}/portoes/cabeca.fim").strip())
for g in ("build", "verify", "typecheck"):
    c = ler(f"{P1}/portoes/{g}.codigo").strip()
    medida(f"primeira.portoes.{g}.codigo", int(c) if c.isdigit() else None, CMD_PORTOES + f" ({P1}/portoes/{g}.codigo)", f"o registo {P1}/portoes/{g}.log começa pela linha do npm do portão", f"> o-estado-do-pais@0.1.0 {g}" in ler(f"{P1}/portoes/{g}.log"))
cp1 = js(f"{P1}/capturas.json") or {"erros": []}
transb = [e for e in cp1.get("erros", []) if "transborda" in e]
medida("primeira.capturas.transbordos", [int(re.search(r"\((\d+) px\)", e).group(1)) for e in transb], "node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1.mjs, na primeira corrida (primeira-corrida/capturas.json)", "a corrida mediu a construção da primeira cabeça", cp1.get("construcao") == c1)
medida("primeira.capturas.plantas_que_nao_morderam", sum(1 for p in cp1.get("plantas", []) if not p["mordeu"]), "idem", "as plantas estão no ficheiro", bool(cp1.get("plantas")))
ff1 = js(f"{P1}/frases-em-flex.json") or {}
medida("primeira.frases_em_flex.erros", len(ff1.get("erros", [])), "node design/especime-v3/medicoes/ex1-2026-10-05/frases-em-flex.mjs, sobre a construção da primeira cabeça (primeira-corrida/frases-em-flex.json)", "a corrida mediu a construção da primeira cabeça", ff1.get("construcao") == c1)
medida("primeira.frases_em_flex.contentores", sum(len(r["flex"]) for r in ff1.get("resultados", [])), "idem", "há resultados", bool(ff1.get("resultados")))

css = (SITIO / "src/styles/site.css").read_text(encoding="utf-8")
m = re.search(r"@media \(prefers-reduced-motion: reduce\)[^}]*?transition-duration: ([0-9.]+)ms !important", css, re.S)
medida("css.movimento_reduzido.duracao_das_transicoes_ms", float(m.group(1)) if m else None, "a regra do movimento reduzido em src/styles/site.css (transition-duration)", "a regra está na folha", m)

# ------------------------------------------------------------------ as plantas dos portões sobre a construção
pl = js("plantas-portoes-ex1.json") or []
medida("plantas_dos_portoes.quantas", len(pl), "OEDP_MEDICOES=<pasta> OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1-", "cada planta repôs os bytes do dist/ (sha256 antes e depois iguais) e correu na cabeça dos portões", pl and all(all(f["antes"] == f["reposto"] for f in p["ficheiros"]) and p["cabeca"] == cab for p in pl))
medida("plantas_dos_portoes.passaram", sum(1 for p in pl if p["passou"]), "idem", "cada uma saiu com 1 e com as mordidas previstas", pl and all(p["codigo"] == 1 for p in pl))
medida("plantas_dos_portoes.nomes", [p["nome"] for p in pl], "idem", "a lista não está vazia", bool(pl))

# ------------------------------------------------------------------ a L1
l1 = js("l1-ex1.json") or {}
medida("l1.contagens", l1.get("contagens"), l1.get("comando", "") + " (medir-l1.mjs)", "as plantas da medição morderam", l1.get("conhecidos_positivos") and all(p["mordeu"] for p in l1["conhecidos_positivos"]))
medida("l1.entradas", [{"url": e["url"], "destinos": e["destinos"]} for e in l1.get("entradas", [])], "node design/especime-v3/medicoes/ex1-2026-10-05/medir-l1.mjs", "as entradas são as duas páginas da explicação", len(l1.get("entradas", [])) == 2)
medida("l1.plantas", len(l1.get("conhecidos_positivos", [])), "node design/especime-v3/medicoes/ex1-2026-10-05/medir-l1.mjs", "a medição é da construção da sua cabeça", l1.get("cabeca") == l1.get("construcao"))
medida("l1.cabeca_da_medicao", l1.get("cabeca"), "node design/especime-v3/medicoes/ex1-2026-10-05/medir-l1.mjs", "a cabeça está escrita", bool(l1.get("cabeca")))

# ------------------------------------------------------------------ o mapa
def conta_mapa(t):
    a = re.search(r"citações conferidas na linha citada \(±7\): (\d+)", t); b = re.search(r"citação está no ficheiro, mas longe da linha citada: (\d+)", t)
    c = re.search(r"citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)", t)
    return {"conferidas": int(a.group(1)), "longe": int(b.group(1)), "nao_encontradas": int(c.group(1))} if a and b and c else None
for nome, f, o_que in (("mapa.na_cabeca_de_partida", "mapa-na-cabeca-de-partida.log", "a corrida do conferir-mapa.py numa worktree da cabeça de partida, antes do bloco"),
                       ("mapa.antes_da_conta", "mapa-antes-da-conta.log", "a corrida do conferir-mapa.py com o código do bloco e o mapa ainda por pôr em dia"),
                       ("mapa.no_fim", "provas/mapa.log", "a corrida do conferir-mapa.py nas provas, na cabeça dos portões")):
    v = conta_mapa(ler(f))
    medida(nome, v, f"python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md ({f}): {o_que}", "as três linhas da contagem estão no registo", v is not None)
lm = ler("linhas-do-mapa.log")
m = re.search(r"(\d+) referência\(s\) postas em dia", lm)
medida("mapa.referencias_postas_em_dia_pela_conta", int(m.group(1)) if m else None, "python3 design/especime-v3/medicoes/ex1-2026-10-05/linhas-do-mapa.py 3664b90d --escrever (linhas-do-mapa.log)", "o número é o das linhas da lista", m and int(m.group(1)) == len(re.findall(r"^mapa l\.\d+ ", lm, re.M)))

mm = js("mapa-a-mao.json") or {}
medida("mapa.corrigidas_a_mao", mm.get("corrigidas_a_mao"), "python3 design/especime-v3/medicoes/ex1-2026-10-05/mapa-a-mao.py 3664b90d c885cb4c --json <pasta>/mapa-a-mao.json", "a comparação leu as referências das linhas que já existiam", (mm.get("referencias_comparadas") or 0) > 0 and len(mm.get("lista", [])) == mm.get("corrigidas_a_mao"))
medida("mapa.referencias_comparadas", mm.get("referencias_comparadas"), "idem", "a lista das corrigidas tem a forma escrita", isinstance(mm.get("lista"), list))
ch = (SITIO / "design/especime-v3/CHAVES-EN.md").read_text(encoding="utf-8")
sec = ch.split("## EX1 · as explicações e a leitura da semana, 05.10.2026", 1)
linhas_ch = [l for l in sec[1].split("\n## ", 1)[0].splitlines() if l.startswith("| `")] if len(sec) == 2 else []
medida("chaves_en.ex1", len(linhas_ch), "a contagem das linhas da tabela da secção do EX1 em design/especime-v3/CHAVES-EN.md", "a secção existe e a primeira linha é a de nav.explicacoes", bool(linhas_ch) and linhas_ch[0].startswith("| `nav.explicacoes`"))

# ------------------------------------------------------------------ o custo e a limpeza
cu = js("custo.json") or {}
medida("custo", {k: cu.get(k) for k in ("respostas_do_modelo", "modelos", "simbolos", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo", "segundos", "primeira_entrada", "lido_em")}, "python3 design/especime-v3/medicoes/ex1-2026-10-05/custo.py <registo da sessão do construtor>", "o registo foi lido (o sha256 está escrito)", bool(cu.get("registo_sha256")))
li = js("limpeza.json") or {}
medida("limpeza", {k: li.get(k) for k in ("ficheiros_limpos_quantos", "trocas", "restos_depois")}, "python3 design/especime-v3/medicoes/ex1-2026-10-05/limpar-registos.py", "a limpeza correu", bool(li))

# ================================================================== EX1-b (06.10.2026), em ex1b/
B = "ex1b"
CMD_PORTOES_B = "RESEARCHHUB_DIR=<worktree do motor> sh scripts/leituras/portoes.sh <worktree do sítio> design/especime-v3/medicoes/ex1-2026-10-05/ex1b/portoes"
cb = ler(f"{B}/portoes/cabeca").strip()
medida("ex1b.portoes.cabeca", cb, CMD_PORTOES_B, "a cabeça dos portões é a de antes e a de depois da corrida", cb and cb == ler(f"{B}/portoes/cabeca-antes-da-corrida").strip() == ler(f"{B}/portoes/cabeca.fim").strip() == ler(f"{B}/portoes/cabeca-depois-da-corrida").strip())
for g in ("build", "verify", "typecheck"):
    c = ler(f"{B}/portoes/{g}.codigo").strip()
    medida(f"ex1b.portoes.{g}.codigo", int(c) if c.isdigit() else None, CMD_PORTOES_B + f" ({B}/portoes/{g}.codigo)", f"o registo {B}/portoes/{g}.log começa pela linha do npm do portão", f"> o-estado-do-pais@0.1.0 {g}" in ler(f"{B}/portoes/{g}.log"))
    sg = segundos(f"{B}/portoes", g)
    medida(f"ex1b.portoes.{g}.segundos", sg, CMD_PORTOES_B + f" ({B}/portoes/{g}.inicio e .fim)", "as duas horas estão escritas", sg is not None)
for q in ("antes", "depois"):
    tq = ler(f"{B}/portoes/estado-seguido-{q}")
    medida(f"ex1b.portoes.estado_seguido_{q}.linhas", len([l for l in tq.splitlines() if l.strip()]), f"git status --porcelain --untracked-files=no > {B}/portoes/estado-seguido-{q}", "o ficheiro foi escrito", (AQUI / f"{B}/portoes/estado-seguido-{q}").exists())
dep = [l[3:] for l in ler(f"{B}/portoes/estado-seguido-depois").splitlines() if l.strip()]
medida("ex1b.portoes.estado_seguido_depois.ficheiros", dep, f"git status --porcelain --untracked-files=no > {B}/portoes/estado-seguido-depois (os caminhos)", "o ficheiro foi escrito", (AQUI / f"{B}/portoes/estado-seguido-depois").exists())
vb = ler(f"{B}/portoes/verify.log")
bb = ler(f"{B}/portoes/build.log")
m = re.search(r"R3 · as (\d+) portas do rodapé conferidas em (\d+) página\(s\), com (\d+) planta\(s\) em memória", vb)
medida("ex1b.verify.rodape", {"portas": int(m.group(1)), "paginas": int(m.group(2)), "plantas": int(m.group(3))} if m else None, "npm run verify (ex1b/portoes/verify.log, a linha «R3 · as … portas do rodapé»)", "a linha do portão de HTML está no registo", m)
m = re.search(r"FC · (\d+) passagem\(ns\) em (\d+) páginas, (\d+) pedaços marcados vistos, (\d+) dentro de um contentor flexível, (\d+) documento\(s\) mais largos do que a janela a 390 px; (\d+) de (\d+) plantas no navegador", vb)
medida("ex1b.verify.frases_compostas", {"passagens": int(m.group(1)), "paginas": int(m.group(2)), "pedacos": int(m.group(3)), "em_contentor_flexivel": int(m.group(4)), "transbordos": int(m.group(5)), "plantas": [int(m.group(6)), int(m.group(7))]} if m else None, "npm run verify (ex1b/portoes/verify.log, a linha «FC · …»), a célula nova da cadeia", "a linha da célula está no registo", m)
m = re.search(r"X · a explicação: .*?\((\d+) diz, (\d+) leitura, (\d+) conta, (\d+) aponta, (\d+) liga\).*?(\d+) token\(s\) «maiores».*? (\d+) de (\d+) plantas em memória", vb)
medida("ex1b.verify.explicacao", {"diz": int(m.group(1)), "leitura": int(m.group(2)), "conta": int(m.group(3)), "aponta": int(m.group(4)), "liga": int(m.group(5)), "tokens_maiores": int(m.group(6)), "plantas": [int(m.group(7)), int(m.group(8))]} if m else None, "npm run verify (ex1b/portoes/verify.log, a linha «X · a explicação»)", "a linha da célula X está no registo", m)
m = re.search(r"L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)", vb)
medida("ex1b.verify.l1", [int(m.group(1)), int(m.group(2))] if m else None, "npm run verify (ex1b/portoes/verify.log, a linha «L1 · …»)", "a linha da L1 está no registo", m)
m = re.search(r"sinais · (\d+) explicação\(ões\), (\d+) frase\(s\) guardada\(s\) fora da página", bb)
medida("ex1b.build.sinais_das_explicacoes", int(m.group(2)) if m else None, "npm run build (ex1b/portoes/build.log, a linha «sinais · … explicação(ões)»)", "a linha dos sinais está no registo", m)
CMD_PROVAS_B = "RESEARCHHUB_DIR=<worktree do motor> sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh <worktree do sítio> <registo> <código> sh design/especime-v3/medicoes/ex1-2026-10-05/provas-ex1b.sh"
pb = ler(f"{B}/provas/cabeca").strip()
medida("ex1b.provas.cabeca", pb, CMD_PROVAS_B, "a cabeça das provas é a dos portões e a do fim das provas", pb and pb == cb == ler(f"{B}/provas/cabeca.fim").strip())
medida("ex1b.provas.estado.linhas", len([l for l in ler(f"{B}/provas/estado").splitlines() if l.strip()]), CMD_PROVAS_B + f" ({B}/provas/estado)", "o ficheiro foi escrito", (AQUI / f"{B}/provas/estado").exists())
vbv = js(f"{B}/provas/version.json") or {}
medida("ex1b.provas.construcao", vbv.get("commit"), f"cp dist/version.json {B}/provas/version.json", "a construção medida é a da cabeça dos portões", vbv.get("commit") == cb)
for passo in ("brief", "briefs", "acertos", "explicacao", "semana", "sinais", "frases-compostas", "capturas", "plantas-dos-portoes", "plantas-do-ex1b", "plantas-do-r3", "mapa", "mapa-a-mao"):
    c = ler(f"{B}/provas/{passo}.codigo").strip()
    medida(f"ex1b.provas.{passo}.codigo", int(c) if c.isdigit() else None, CMD_PROVAS_B + f" ({B}/provas/{passo}.codigo)", f"o registo {B}/provas/{passo}.log começa pela cabeça", ler(f"{B}/provas/{passo}.log").startswith("cabeça: "))
# I210
rb = js(f"{B}/brief-reproduzido.json") or {"medidas": []}
br2 = json.loads((SITIO / "design/observatorio/medidas/BRIEF-EX1.json").read_text(encoding="utf-8"))
pm = next((x for x in rb["medidas"] if x["nome"] == "portas_do_menu"), None)
medida("ex1b.brief.portas_do_menu", pm["valor"] if pm else None, "OEDP_MEDIDAS_JSON=<pasta>/ex1b/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-EX1.py", "o conhecido-positivo da medida foi encontrado (o cabeçalho percorre ROTAS_NAV e a porta da União está nela)", pm and pm["conhecido_positivo"]["encontrado"])
medida("ex1b.brief.medidas_iguais_as_do_brief", sum(1 for x in rb["medidas"] if {y["nome"]: y["valor"] for y in br2["medidas"]}.get(x["nome"]) == x["valor"]), "a comparação de ex1b/brief-reproduzido.json com design/observatorio/medidas/BRIEF-EX1.json", "as duas listas têm as mesmas medidas", {x["nome"] for x in rb["medidas"]} == {y["nome"] for y in br2["medidas"]})
brief_md = (SITIO / "design/observatorio/BRIEF-EX1-o-espaco-das-explicacoes-e-a-leitura-semanal.md").read_text(encoding="utf-8")
m = re.search(r"e (\d+) portas no menu \(`portas_do_menu`\)", brief_md)
medida("ex1b.brief.paragrafo_0_portas_do_menu", int(m.group(1)) if m else None, "a frase do §0 do brief com `portas_do_menu`", "a frase está no brief", m)
m = re.search(r"✓ (\d+) número\(s\) do §0 ligado\(s\) à sua medição", ler(f"{B}/provas/briefs.log"))
medida("ex1b.check_briefs.numeros_ligados", int(m.group(1)) if m else None, "python3 scripts/check-briefs.py (ex1b/provas/briefs.log)", "o brief do EX1 foi conferido", "conferido: BRIEF-EX1-o-espaco-das-explicacoes-e-a-leitura-semanal.md" in ler(f"{B}/provas/briefs.log"))
# I211
cpb = js(f"{B}/capturas.json") or {"capturas": [], "plantas": [], "erros": ["sem capturas"]}
rods = [c for c in cpb["capturas"] if c.get("rodape") and "recorte" not in c]
medida("ex1b.rodape.portas", sorted({c["rodape"]["portas"] for c in rods}), "node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1b.mjs --json ex1b/capturas.json (o rodapé de cada página capturada)", "as páginas das duas edições foram medidas", len({c["lang"] for c in rods}) == 2)
pt_rod = next((c["rodape"]["destinos"] for c in rods if c["lang"] == "pt"), [])
medida("ex1b.rodape.destinos_pt", pt_rod, "idem", "a porta das explicações está entre a da agenda e a da União", "/explicacoes" in pt_rod and pt_rod[pt_rod.index("/explicacoes") - 1] == "/agenda" and pt_rod[pt_rod.index("/explicacoes") + 1] == "/uniao-europeia")
plr = [p for p in (js(f"{B}/plantas-portoes-ex1b.json") or []) if p["nome"].startswith("ex1b-rodape")]
medida("ex1b.rodape.plantas_sobre_a_construcao", [p["nome"] for p in plr if p["passou"]], "OEDP_MEDICOES=<pasta>/ex1b node tests/pais/portoes.mjs --prefixo ex1b-", "as duas plantas do rodapé correram", len(plr) == 2)
r3 = js(f"{B}/plantas-portoes-lista.json") or []
medida("ex1b.r3.plantas_que_contam_oito", [p["nome"] for p in r3 if p["passou"]], "OEDP_MEDICOES=<pasta>/ex1b node tests/pais/portoes.mjs --lista r3-rodape-sem-a-porta-do-indice,r3-rodape-indice-da-outra-edicao", "as duas plantas do R3 correram", len(r3) == 2)
# I212, I213, I215, I216: a explicação
acb = js(f"{B}/acertos.json") or {}
somas_b = {}
for x in acb.get("acertos", []):
    somas_b[x["id"]] = somas_b.get(x["id"], 0) + x["vezes"]
medida("ex1b.acertos.blocos", acb.get("blocos"), "node design/especime-v3/medicoes/ex1-2026-10-05/acertos-ex1.mjs --json <pasta>/ex1b/acertos.json", "o texto do brief com os acertos é o da declaração, e nenhum erro", acb.get("iguais") is True and not acb.get("erros"))
medida("ex1b.acertos.exercidos", somas_b, "idem", "os treze acertos estão na lista", len(somas_b) == 13)
exb = js(f"{B}/explicacao.json") or {}
aub = exb.get("auditoria", {})
medida("ex1b.explicacao.auditoria", {k: aub.get(k) for k in ("folhas", "partes", "diz", "leitura", "conta", "aponta", "liga", "origens")}, "node tests/explicacoes/explicacao.mjs --prova --json <pasta>/ex1b/explicacao.json", "a célula correu sem erros", exb and not exb.get("erros"))
medida("ex1b.explicacao.maiores", (exb.get("maiores") or {}).get("tokens"), "idem (X9)", "a célula correu sem erros", exb and not exb.get("erros"))
medida("ex1b.explicacao.plantas", [sum(1 for q in exb.get("plantas", []) if q["mordeu"]), sum(1 for q in exb.get("plantas", []) if q.get("aplica", True))], "idem", "todas as que se aplicam morderam", exb.get("plantas") and all(q["mordeu"] for q in exb["plantas"] if q.get("aplica", True)))
medida("ex1b.explicacao.plantas_novas", [q["nome"] for q in exb.get("plantas", []) if re.search(r"programas|«maiores»|porta|selo|leitura", q["nome"])], "idem", "as plantas do token, das portas, dos selos e da leitura estão na lista", any("«maiores»" in q["nome"] for q in exb.get("plantas", [])))
aud = json.loads((SITIO / "tests/cartao/leituras-provadas.json").read_text(encoding="utf-8"))
ent = next((x for x in aud.get("explicacoes", []) if x.get("slug") == "dinheiro-do-estado-2026"), {})
leituras = [{"pt": q["pt"], "sobre": q["sobre"]} for f in ent.get("folhas", []) for q in f["partes"] if q.get("classe") == "leitura"]
medida("ex1b.auditoria.partes_de_leitura", leituras, "as partes da classe «leitura» na secção «explicacoes» de tests/cartao/leituras-provadas.json", "cada uma traz «sobre»", bool(leituras) and all(q["sobre"] for q in leituras))
sib = js(f"{B}/sinais-explicacoes.json") or {}
medida("ex1b.sinais.frases_guardadas_fora", sum(len(x.get("sinais", [])) for x in sib.get("explicacoes", [])), "node scripts/sinais-da-primeira-pagina.mjs; cp .sinais/explicacoes.json <pasta>/ex1b/sinais-explicacoes.json", "o ficheiro dos sinais tem a explicação", bool(sib.get("explicacoes")))
# o programa de maior despesa e os seguintes, lidos do livro (I213)
progs = []
for f in sorted((SITIO / "ledger/claims").glob("execucao-2026-08-despesa-programa-*.yml")):
    t = f.read_text(encoding="utf-8")
    v = re.search(r'^value: "([^"]*)"', t, re.M).group(1); n = re.search(r'^name: "([^"]*)"', t, re.M).group(1)
    progs.append({"id": f.stem, "value": v, "name": n, "numero": float(re.sub(r"[\s\u00a0\u202f]", "", v).replace(",", "."))})
progs.sort(key=lambda x: -x["numero"])
medida("ex1b.programas.quantos", len(progs), "ls ledger/claims/execucao-2026-08-despesa-programa-*.yml", "cada um tem valor e nome", all(x["value"] and x["name"] for x in progs))
medida("ex1b.programas.quatro_maiores", [{k: x[k] for k in ("id", "value", "name")} for x in progs[:4]], "os valores das linhas da família, por ordem decrescente", "não há empate entre o terceiro e o quarto", len(progs) > 3 and progs[2]["numero"] != progs[3]["numero"])
# a régua das frases compostas
fcb = js(f"{B}/frases-compostas.json") or {}
medida("ex1b.frases_compostas", {"passagens": len(fcb.get("resultados", [])), "pedacos": sum(r["pedacos"] for r in fcb.get("resultados", [])), "erros": len(fcb.get("erros", [""])), "plantas": [sum(1 for q in fcb.get("plantas", []) if q["mordeu"]), len(fcb.get("plantas", []))]} if fcb else None, "node tests/explicacoes/frases-compostas.mjs --json <pasta>/ex1b/frases-compostas.json", "a medida é da construção dos portões e as plantas morderam", fcb.get("construcao") == cb and all(q["mordeu"] for q in fcb.get("plantas", [])) and bool(fcb.get("plantas")))
# as capturas
inteiras_b = [c for c in cpb["capturas"] if "recorte" not in c]
medida("ex1b.capturas.quantas", len(cpb["capturas"]), "node design/especime-v3/medicoes/ex1-2026-10-05/captar-ex1b.mjs --json ex1b/capturas.json", "cada captura tem o sha256 e o ficheiro existe", all(c.get("sha256") and (SITIO / c["ficheiro"]).exists() for c in cpb["capturas"]))
medida("ex1b.capturas.paginas_inteiras", len(inteiras_b), "idem", "quatro rotas, duas edições, cinco larguras, sem repetidas", len({(c["rota"], c["largura"]) for c in inteiras_b}) == len(inteiras_b))
medida("ex1b.capturas.recortes_do_rodape", sum(1 for c in cpb["capturas"] if c.get("recorte") == "o rodapé"), "idem", "as duas edições", len({c["lang"] for c in cpb["capturas"] if c.get("recorte") == "o rodapé"}) == 2)
medida("ex1b.capturas.transbordos", sum(1 for c in inteiras_b if c.get("transborda")), "idem", "a planta do transbordo mordeu", any(q["nome"].startswith("uma página mais larga") and q["mordeu"] for q in cpb["plantas"]))
medida("ex1b.capturas.erros", len(cpb["erros"]), "idem", "a corrida chegou ao fim (as plantas estão no ficheiro)", bool(cpb["plantas"]))
medida("ex1b.capturas.plantas", [sum(1 for q in cpb["plantas"] if q["mordeu"]), len(cpb["plantas"])], "idem", "as três plantas correram", len(cpb["plantas"]) == 3)
# as plantas sobre a construção
plb = (js(f"{B}/plantas-portoes-ex1.json") or []) + (js(f"{B}/plantas-portoes-ex1b.json") or [])
medida("ex1b.plantas_dos_portoes.quantas", len(plb), "OEDP_MEDICOES=<pasta>/ex1b OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1- (e --prefixo ex1b-)", "cada planta repôs os bytes do dist/ e correu na cabeça dos portões", plb and all(all(f["antes"] == f["reposto"] for f in q["ficheiros"]) and q["cabeca"] == cb for q in plb))
medida("ex1b.plantas_dos_portoes.passaram", sum(1 for q in plb if q["passou"]), "idem", "cada uma saiu com 1 e com as mordidas previstas", plb and all(q["codigo"] == 1 for q in plb))
medida("ex1b.plantas_dos_portoes.do_ex1b", [q["nome"] for q in plb if q["nome"].startswith("ex1b-")], "idem", "as plantas do EX1-b estão na lista", any(q["nome"].startswith("ex1b-") for q in plb))
# o mapa
for nome, f in (("ex1b.mapa.antes_da_conta", f"{B}/mapa-antes-da-conta.log"), ("ex1b.mapa.depois_da_conta", f"{B}/mapa-depois-da-conta.log"), ("ex1b.mapa.no_fim", f"{B}/provas/mapa.log")):
    v = conta_mapa(ler(f))
    medida(nome, v, f"python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md ({f})", "as três linhas da contagem estão no registo", v is not None)
lmb = ler(f"{B}/linhas-do-mapa.log")
m = re.search(r"(\d+) referência\(s\) postas em dia", lmb)
medida("ex1b.mapa.referencias_postas_em_dia_pela_conta", int(m.group(1)) if m else None, "python3 design/especime-v3/medicoes/ex1-2026-10-05/linhas-do-mapa.py 1d64052a --escrever (ex1b/linhas-do-mapa.log)", "o número é o das linhas da lista", m and int(m.group(1)) == len(re.findall(r"^mapa l\.\d+ ", lmb, re.M)))
mmb = js(f"{B}/mapa-a-mao.json") or {}
medida("ex1b.mapa.corrigidas_a_mao", mmb.get("corrigidas_a_mao"), "python3 design/especime-v3/medicoes/ex1-2026-10-05/mapa-a-mao.py 1d64052a 37b3daf9 --json <pasta>/ex1b/mapa-a-mao.json", "a comparação leu as referências das linhas que já existiam", (mmb.get("referencias_comparadas") or 0) > 0)
medida("ex1b.mapa.referencias_comparadas", mmb.get("referencias_comparadas"), "idem", "a lista tem a forma escrita", isinstance(mmb.get("lista"), list))
cub = js(f"{B}/custo.json") or {}
medida("ex1b.custo", {k: cub.get(k) for k in ("respostas_do_modelo", "modelos", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo", "segundos", "primeira_entrada", "desde", "lido_em")}, "python3 design/especime-v3/medicoes/ex1-2026-10-05/custo.py <registo da sessão do construtor> ex1b/custo.json --desde <a primeira entrada da passagem>", "o registo foi lido (o sha256 está escrito)", bool(cub.get("registo_sha256")))

(AQUI / "medidas.json").write_text(json.dumps({"bloco": "EX1", "guiao": REL(__file__), "medidas": medidas, "falhas": falhas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{len(medidas)} medidas, {len(falhas)} com o conhecido-positivo por encontrar" + (f": {', '.join(falhas)}" if falhas else ""))
sys.exit(1 if falhas else 0)
