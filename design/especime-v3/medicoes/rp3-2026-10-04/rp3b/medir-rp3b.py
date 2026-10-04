#!/usr/bin/env python3
"""RP3-b: as medidas da passagem de emendas e do rebase, cada uma com o comando e um conhecido-positivo, em medidas-rp3b.json.

uso (da raiz do sítio, no ramo rp3-2026-10-04-b): python3 design/especime-v3/medicoes/rp3-2026-10-04/rp3b/medir-rp3b.py <worktree do motor>

Lê o git das duas árvores (os commits da passagem, a correspondência dos commits do ramo antigo com os do rebaseado,
pelo assunto), os registos dos portões da cabeça rebaseada em `portoes-rp3b/`, as corridas do motor em `rp3b/motor/`,
as plantas da passagem (`rp3b/plantas-portoes-rp3.json`, `rp3b/plantas-series-rp3b.json`, `rp3b/vp2-antes-e-depois.json`),
o guião do mapa, as cópias da leitura a frio em `design/especime-v3/critica/` e o custo (`custo-rp3b.json`).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime

PASTA = "design/especime-v3/medicoes/rp3-2026-10-04"
B = f"{PASTA}/rp3b"
MOTOR = os.path.realpath(sys.argv[1])
NAO = "NÃO LIDO"
medidas = []


def medida(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def ler(rel):
    with open(rel, encoding="utf-8") as f:
        return f.read()


def existe(rel):
    return os.path.isfile(rel)


def git(*a, repo="."):
    r = subprocess.run(["git", "-C", repo, *a], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None


def segundos(a, b):
    return round((datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00"))).total_seconds())


sem_cor = lambda t: re.sub(r"\x1b\[[0-9;]*m", "", t)

# ------------------------------------------------------------------ o ramo e o rebase
ramo = git("rev-parse", "--abbrev-ref", "HEAD")
medida("ramo", ramo, "git rev-parse --abbrev-ref HEAD", "é o ramo novo da passagem", ramo == "rp3-2026-10-04-b")
main = git("rev-parse", "7af90731")
medida("main_do_rebase", main, "git rev-parse 7af90731 (o main confirmado na árvore principal com git rev-parse main antes do rebase)",
       "é a base comum do ramo novo", git("merge-base", "HEAD", "7af90731") == main)
antigo = git("log", "--reverse", "--format=%h %s", "1c4dde2f..rp3-2026-10-04").splitlines()
novo = git("log", "--reverse", "--format=%h %s", "7af90731..HEAD").splitlines()
por_assunto = {l.split(" ", 1)[1]: l.split(" ", 1)[0] for l in novo}
correspondencia = [{"antigo": l.split(" ", 1)[0], "novo": por_assunto.get(l.split(" ", 1)[1]), "assunto": l.split(" ", 1)[1]} for l in antigo]
medida("commits_do_ramo_antigo", len(antigo), "git log 1c4dde2f..rp3-2026-10-04", "o primeiro é o das séries no livro-razão", antigo[0].split(" ", 1)[0] == "35c3be98")
medida("commits_do_ramo_novo", len(novo), "git log 7af90731..HEAD", "o ramo novo tem mais commits do que o antigo (o mapa da passagem)", len(novo) > len(antigo))
medida("correspondencia_dos_commits", correspondencia, "os commits do ramo antigo e do rebaseado, emparelhados pelo assunto",
       "cada commit do ramo antigo tem o seu no ramo novo", all(c["novo"] for c in correspondencia))
medida("commits_so_do_ramo_novo", [l for l in novo if l.split(" ", 1)[1] not in {x.split(" ", 1)[1] for x in antigo}],
       "os commits do ramo novo sem par no antigo", "há o do mapa da passagem", any("o mapa do repositório com a passagem RP3-b" in l for l in novo))
mt = subprocess.run(["git", "merge-tree", "--write-tree", "--name-only", "--no-messages", "7af90731", "rp3-2026-10-04"], capture_output=True, text=True)
linhas_mt = mt.stdout.split("\n")
medida("rp3b_conflitos_do_rebase", [l for l in linhas_mt[1:] if l.strip()],
       "git merge-tree --write-tree --name-only --no-messages 7af90731 rp3-2026-10-04 (os ficheiros em conflito entre o main e o ramo antigo)",
       "o merge-tree diz que há conflitos (código 1) e a primeira linha é a árvore", mt.returncode == 1 and re.fullmatch(r"[0-9a-f]{40}", linhas_mt[0] or "") is not None)
pkg = json.loads(ler("package.json"))
cadeia = [x.strip() for x in pkg["scripts"]["verify"].split("&&")]
medida("cadeia_do_verify_fim", cadeia[-3:], "o fim da cadeia «verify» de package.json",
       "o check:series e o check:rotulos têm os seus guiões", "check:series" in pkg["scripts"] and "check:rotulos" in pkg["scripts"])
medida("cadeia_do_verify_passos", len(cadeia), "os passos da cadeia «verify»", "cada passo aparece uma vez", len(cadeia) == len(set(cadeia)))
mapa = ler("design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md")
medida("mapa_r2_antes_do_rp3", mapa.index("## R2 · os rótulos do sítio") < mapa.index("## RP3 · as séries no tempo"),
       "a ordem das secções do R2 e do RP3 no mapa", "as duas secções estão no mapa", "## R2 · os rótulos do sítio" in mapa and "## RP3 · as séries no tempo" in mapa)

# ------------------------------------------------------------------ os portões da cabeça rebaseada
P = f"{PASTA}/portoes-rp3b"
for g in ("build", "verify", "typecheck"):
    cod = int(ler(f"{P}/{g}.codigo").strip()) if existe(f"{P}/{g}.codigo") else NAO
    medida(f"rp3b_portao_{g}_codigo", cod, f"cat {P}/{g}.codigo", "o ficheiro existe e é um inteiro", cod != NAO)
    seg = segundos(ler(f"{P}/{g}.inicio").strip(), ler(f"{P}/{g}.fim").strip()) if existe(f"{P}/{g}.fim") else NAO
    medida(f"rp3b_portao_{g}_segundos", seg, f"{P}/{g}.fim menos {g}.inicio", "as duas horas leram-se", seg != NAO)
cab = ler(f"{P}/cabeca").strip() if existe(f"{P}/cabeca") else NAO
medida("rp3b_cabeca_do_codigo", cab, f"cat {P}/cabeca", "a cabeça do fim é a mesma", existe(f"{P}/cabeca.fim") and ler(f"{P}/cabeca.fim").strip() == cab)
blog = ler(f"{P}/build.log") if existe(f"{P}/build.log") else ""
m = re.search(r"(\d+) page\(s\) built", blog)
medida("rp3b_paginas_construidas", int(m.group(1)) if m else NAO, f"«N page(s) built» em {P}/build.log", "o registo traz a linha do Astro", m is not None)
vlog = sem_cor(ler(f"{P}/verify.log")) if existe(f"{P}/verify.log") else ""
def linha(rx):
    m = re.search(rx, vlog)
    return m.group(0).strip() if m else NAO
for nome, rx, kp in (
    ("rp3b_verify_ledger_check_series", r"séries · \d+ série\(s\) de \d+ ponto\(s\)[^\n]*", "planta(s)"),
    ("rp3b_verify_check_series", r"check:series · \d+ série\(s\) no tempo[^\n]*", "planta(s) morderam"),
    ("rp3b_verify_check_palavras", r"\d+ de \d+ plantas vistas \([^\n]*", "buracos da superfície"),
    ("rp3b_verify_autoteste_da_check_lugar", r"RP3, o autoteste da marca das séries[^\n]*", "de acordo"),
    ("rp3b_verify_rotulos", r"R2 · rótulos: \d+ página\(s\) lidas[^\n]*", "página(s) lidas"),
):
    v = linha(rx)
    medida(nome, v, f"a linha em {P}/verify.log", f"a linha diz «{kp}»", kp in v)
m = re.search(r"(\d+) de (\d+) plantas vistas \((\d+) palavras, (\d+) buracos da superfície\)", vlog)
medida("rp3b_check_palavras_buracos", int(m.group(4)) if m else NAO, f"os buracos da superfície em {P}/verify.log", "a linha leu-se", m is not None)
m = re.search(r"séries · \d+ série\(s\) de \d+ ponto\(s\)[^\n]* · (\d+) planta\(s\)", vlog)
medida("rp3b_ledger_check_plantas_das_series", int(m.group(1)) if m else NAO, f"as plantas das séries do ledger:check em {P}/verify.log", "a linha leu-se", m is not None)
m = re.search(r"«indicador»\s+(\d+) · «indicador» dentro do endereço da API do INE", vlog)
medida("rp3b_excecao_json_indicador_usos", int(m.group(1)) if m else NAO, f"a exceção do caminho da API do INE em {P}/verify.log",
       "a check:lugar falha uma exceção que não foi precisa", "não foi precisa uma única vez" in ler("scripts/check-lugar.mjs"))

# ------------------------------------------------------------------ as plantas da passagem
pp = json.load(open(f"{B}/plantas-portoes-rp3.json")) if existe(f"{B}/plantas-portoes-rp3.json") else None
if pp:
    medida("rp3b_plantas_sobre_dist", sum(1 for x in pp["plantas"] if not x.get("controlo")), f"{B}/plantas-portoes-rp3.json (plantas-rp3.mjs na cabeça rebaseada)",
           "a construção é a da cabeça rebaseada", pp["construcao"] == cab)
    medida("rp3b_plantas_sobre_dist_que_morderam", sum(1 for x in pp["plantas"] if x["passou"] and not x.get("controlo")), "as plantas com «passou»",
           "cada planta repôs as suas páginas", all(f["antes"] == f["reposto"] for x in pp["plantas"] for f in x["ficheiros"]))
    medida("rp3b_controlos_sobre_dist", sum(1 for x in pp["plantas"] if x.get("controlo")), "os controlos (a mesma troca num literal transcrito)", "o controlo saiu com 0",
           all(x["codigo"] == 0 for x in pp["plantas"] if x.get("controlo")))
    medida("rp3b_nomes_das_plantas_sobre_dist", [x["nome"] for x in pp["plantas"]], f"{B}/plantas-portoes-rp3.json", "há a planta da marca da série obrigatória",
           any(x["nome"] == "rp3-voz-nome-de-outra-serie-sem-a-marca" and not x.get("controlo") and x["passou"] for x in pp["plantas"]))
ps = json.load(open(f"{B}/plantas-series-rp3b.json")) if existe(f"{B}/plantas-series-rp3b.json") else None
if ps:
    medida("rp3b_plantas_das_celulas_s", len(ps["plantas"]), f"{B}/plantas-series-rp3b.json (check:series --prova com o motor ao lado)",
           "há as plantas da célula do Eurostat", any("anotação" in x["nome"] for x in ps["plantas"]))
    medida("rp3b_plantas_das_celulas_s_que_morderam", sum(1 for x in ps["plantas"] if x["mordeu"]), "as plantas com «mordeu»", "cada uma diz a primeira queixa",
           all(x["primeira"] for x in ps["plantas"] if x["mordeu"]))
    medida("rp3b_celulas_s_pontos_no_corpo", (ps["contas"].get("motor") or {}).get("pontos"), "a metade do motor da S3, pela estrutura da resposta",
           "correu com o motor ao lado", (ps["contas"].get("motor") or {}).get("correu") is True)
ssm = sem_cor(ler(f"{B}/series-sem-motor.log")) if existe(f"{B}/series-sem-motor.log") else ""
m = re.search(r"(\d+) de (\d+) planta\(s\) morderam", ssm)
medida("rp3b_plantas_das_celulas_s_sem_motor", int(m.group(2)) if m else NAO, f"{B}/series-sem-motor.log", "as plantas sintéticas correm sem o motor", m is not None and m.group(1) == m.group(2))
vp = json.load(open(f"{B}/vp2-antes-e-depois.json")) if existe(f"{B}/vp2-antes-e-depois.json") else None
if vp:
    medida("rp3b_vp2_antes_e_depois", {k: v for k, v in vp.items() if isinstance(v, dict)}, f"{B}/vp2-antes-e-depois.json (vp2-antes-e-depois.py)",
           "a VP2 de antes deixa passar as duas e a de depois para-as",
           all(v["antes"] == "passou" and v["depois"].startswith("parou") for v in vp.values() if isinstance(v, dict)))

# ------------------------------------------------------------------ as construções exportadas e as duas comparações das páginas
ex = ler(f"{B}/exportacoes.txt").split("\n") if existe(f"{B}/exportacoes.txt") else []
ex = {l.split()[0]: {"commit": l.split()[1], "codigo": int(l.split()[2])} for l in ex if len(l.split()) == 3}
medida("rp3b_exportacoes", ex, f"{B}/exportacoes.txt (git archive de cada commit, mapa:unidades e astro build, com as mesmas dependências)",
       "as três construções estão lá, cada uma com o seu commit", set(ex) == {"main", "primeira", "cabeca"}
       and ex["main"]["commit"] == main and ex["primeira"]["commit"] == git("rev-parse", "aefe2838") and ex["cabeca"]["commit"] == cab)
for qual, base_c, ficheiro in (("passagem", "aefe2838", "paginas-rp3b-passagem.json"), ("main", "7af90731", "paginas-rp3b-main.json")):
    if not existe(f"{B}/{ficheiro}"):
        medida(f"rp3b_{qual}_comparacao", NAO, f"{B}/{ficheiro}", "o ficheiro existe", False)
        continue
    pg = json.load(open(f"{B}/{ficheiro}"))
    cmd = f"{B}/{ficheiro} (paginas-rp3.mjs, a construção de {base_c} contra a de {cab[:8] if cab != NAO else cab})"
    medida(f"rp3b_{qual}_construcoes", [pg["construcao_da_base"], pg["construcao_da_cabeca"]], cmd, "os commits das duas construções são os pedidos",
           pg["construcao_da_base"] == git("rev-parse", base_c) and pg["construcao_da_cabeca"] == cab)
    for k in ("paginas_html_na_base", "paginas_html_na_cabeca", "paginas_novas", "paginas_comuns", "paginas_iguais_byte_a_byte", "paginas_iguais_sem_a_construcao",
              "paginas_que_mudaram", "outros_ficheiros_comuns_iguais", "outros_ficheiros_que_mudaram"):
        medida(f"rp3b_{qual}_{k}", pg[k], cmd, "a soma das comuns fecha (iguais, iguais sem a construção e mudadas)",
               pg["paginas_comuns"] == pg["paginas_iguais_byte_a_byte"] + pg["paginas_iguais_sem_a_construcao"] + pg["paginas_que_mudaram"])
    for k in ("paginas_que_sairam", "outros_ficheiros_que_sairam", "outros_ficheiros_novos", "paginas_novas_fora_dos_recibos", "paginas_que_mudaram_lista",
              "outros_ficheiros_que_mudaram_por_outra_razao"):
        medida(f"rp3b_{qual}_{k}", pg[k], cmd, "a lista leu-se", isinstance(pg[k], list))
    for k in ("paginas_novas_sao_os_recibos", "paginas_que_mudaram_por_razao", "outros_ficheiros_que_mudaram_por_razao"):
        medida(f"rp3b_{qual}_{k}", pg[k], cmd, "o campo leu-se", k in pg)
    cod = int(ler(f"{B}/{ficheiro.replace('.json', '.codigo')}").strip()) if existe(f"{B}/{ficheiro.replace('.json', '.codigo')}") else NAO
    medida(f"rp3b_{qual}_comparacao_codigo", cod, f"cat {B}/{ficheiro.replace('.json', '.codigo')}", "o código leu-se", cod != NAO)

# ------------------------------------------------------------------ as capturas da cabeça rebaseada contra as da primeira entrega
cc = json.load(open(f"{B}/capturas-rp3b-comparacao.json")) if existe(f"{B}/capturas-rp3b-comparacao.json") else None
cm = json.load(open(f"{B}/capturas-rp3b.json")) if existe(f"{B}/capturas-rp3b.json") else None
if cc and cm:
    cmd = f"{B}/capturas-rp3b-comparacao.json (comparar-capturas.py, sobre {B}/capturas-rp3b.json, de captar-rp3.mjs na cabeça rebaseada, e capturas-rp3.json)"
    medida("rp3b_capturas_construcao", cm["construcao"]["commit"], f"{B}/capturas-rp3b.json", "é a cabeça rebaseada dos portões", cm["construcao"]["commit"] == cab)
    medida("rp3b_capturas_imagens", cc["imagens"], cmd, cc["conhecido_positivo"]["o_que"], cc["conhecido_positivo"]["encontrado"])
    medida("rp3b_capturas_iguais", cc["iguais"], cmd, cc["conhecido_positivo"]["o_que"], cc["conhecido_positivo"]["encontrado"])
    medida("rp3b_capturas_diferentes", cc["diferentes"], cmd, "a lista leu-se", isinstance(cc["diferentes"], list))
    medida("rp3b_capturas_problemas", len(cm["problemas"]), f"{B}/capturas-rp3b.json (a tabela, as marcas, as lacunas, os pedidos fechados, o transbordo)",
           "o captor mediu as 20 páginas dos recibos", cm["capturas"] == 20)
    cod = int(ler(f"{B}/captar-rp3b.codigo").strip()) if existe(f"{B}/captar-rp3b.codigo") else NAO
    medida("rp3b_captar_codigo", cod, f"cat {B}/captar-rp3b.codigo", "o registo diz quantas imagens", "imagens dos recibos" in (ler(f"{B}/captar-rp3b.log") if existe(f"{B}/captar-rp3b.log") else ""))

# ------------------------------------------------------------------ o motor
Mo = f"{B}/motor"
for nome, kp in (("core-gate", "GATE: PASS"), ("dominios-series-test", "DOMINIOS_SERIES_TEST: PASS"), ("series-paises-test", "SERIES_PAISES_TEST: PASS"),
                 ("export-site-rows-test", "PASS"), ("dominios-series", "DOMINIOS_SERIES: PASS"), ("export-series", "EXPORT_SERIES: PASS")):
    cod = int(ler(f"{Mo}/{nome}.codigo").strip()) if existe(f"{Mo}/{nome}.codigo") else NAO
    log = ler(f"{Mo}/{nome}.log") if existe(f"{Mo}/{nome}.log") else ""
    medida(f"rp3b_motor_{nome.replace('-', '_')}_codigo", cod, f"cat {Mo}/{nome}.codigo", f"o registo diz «{kp}»", kp in log)
if existe(f"{Mo}/core-gate.inicio"):
    medida("rp3b_motor_core_gate_segundos", segundos(ler(f"{Mo}/core-gate.inicio").strip(), ler(f"{Mo}/core-gate.fim").strip()), f"{Mo}/core-gate.fim menos core-gate.inicio",
           "a cabeça do fim é a do começo", ler(f"{Mo}/core-gate.cabeca").strip() == ler(f"{Mo}/core-gate.cabeca.fim").strip())
medida("rp3b_motor_cabeca", ler(f"{Mo}/core-gate.cabeca").strip() if existe(f"{Mo}/core-gate.cabeca") else NAO, f"cat {Mo}/core-gate.cabeca",
       "é a cabeça da worktree do motor", existe(f"{Mo}/core-gate.cabeca") and git("rev-parse", "HEAD", repo=MOTOR) == ler(f"{Mo}/core-gate.cabeca").strip())
dst = ler(f"{Mo}/dominios-series-test.log") if existe(f"{Mo}/dominios-series-test.log") else ""
m = re.search(r"plantas: (\d+) morderam", dst)
medida("rp3b_motor_plantas_da_suite", int(m.group(1)) if m else NAO, f"«plantas: N morderam» em {Mo}/dominios-series-test.log", "a suíte passou", "DOMINIOS_SERIES_TEST: PASS" in dst)
m = re.search(r"PASS · (\d+) conferências", dst)
medida("rp3b_motor_conferencias_da_suite", int(m.group(1)) if m else NAO, f"«PASS · N conferências» em {Mo}/dominios-series-test.log", "a linha leu-se", m is not None)
todos_m = git("log", "--reverse", "--format=%h", "d2495a7..HEAD", repo=MOTOR).splitlines()
medida("rp3b_motor_commits_do_ramo", todos_m, "git log --reverse --format=%h d2495a7..HEAD no motor", "o último é a cabeça do motor",
       bool(todos_m) and git("rev-parse", "--short=7", "HEAD", repo=MOTOR) == todos_m[-1])
comum = git("rev-parse", "--path-format=absolute", "--git-common-dir")
arvore_principal = os.path.dirname(comum) if comum else None
main_agora = git("rev-parse", "main", repo=arvore_principal) if arvore_principal else NAO
medida("rp3b_main_no_fecho", main_agora, "git -C <árvore principal do sítio> rev-parse main, no fecho das provas",
       "é o main do rebase, e por isso, nesse momento, o ramo aterrava por avanço rápido", main_agora == main)
mmaster = git("rev-parse", "master", repo=os.path.dirname(git("rev-parse", "--path-format=absolute", "--git-common-dir", repo=MOTOR) or ""))
medida("rp3b_motor_master_no_fecho", mmaster, "git -C <árvore principal do motor> rev-parse master, no fecho das provas",
       "é d2495a7, a base do ramo do motor", mmaster == git("rev-parse", "d2495a7", repo=MOTOR))
mcommits = git("log", "--reverse", "--format=%h %s", "f97e66e..HEAD", repo=MOTOR).splitlines()
medida("rp3b_motor_commits", mcommits, "git log f97e66e..HEAD no motor", "o commit da passagem diz RP3-b", all(" RP3-b: " in " " + l for l in mcommits))
medida("rp3b_motor_master", git("rev-parse", "d2495a7", repo=MOTOR), "git rev-parse master na árvore principal do motor, igual a d2495a7 (o motor não precisou de rebase)",
       "é a base do ramo do motor", git("merge-base", "HEAD", "d2495a7", repo=MOTOR) == git("rev-parse", "d2495a7", repo=MOTOR))

ec = json.load(open(f"{B}/entre-commits.json")) if existe(f"{B}/entre-commits.json") else None
if ec:
    medida("rp3b_conferencias_entre_commits", len(ec["corridas"]), f"{B}/entre-commits.json (entre-commits.py, os códigos lidos dos ficheiros das corridas)",
           "todas saíram com 0", ec["todas_a_zero"])

# ------------------------------------------------------------------ o mapa e a leitura a frio
ma = ler(f"{B}/conferir-mapa-rp3b.txt") if existe(f"{B}/conferir-mapa-rp3b.txt") else ""
mm = ler(f"{B}/conferir-mapa-main.txt") if existe(f"{B}/conferir-mapa-main.txt") else ""
num = lambda t, rx: int(re.search(rx, t).group(1)) if re.search(rx, t) else NAO
medida("rp3b_mapa_citacoes_perto", num(ma, r"linha citada \(±7\): (\d+)"), f"{B}/conferir-mapa-rp3b.txt", "o guião correu", "citações conferidas" in ma)
medida("rp3b_mapa_citacoes_longe", num(ma, r"longe da linha citada: (\d+)"), f"{B}/conferir-mapa-rp3b.txt", "o mapa do main tem as mesmas longe na árvore do main",
       num(ma, r"longe da linha citada: (\d+)") == num(mm, r"longe da linha citada: (\d+)"))
medida("rp3b_mapa_citacoes_por_achar", num(ma, r"mesma linha: (\d+)"), f"{B}/conferir-mapa-rp3b.txt", "o guião conta esta classe", "não encontrada" in ma)
citas = lambda txt: sorted(re.findall(r"^   mapa l\.\d+ «(.*?)» citada em", txt, re.M))
medida("rp3b_mapa_longe_as_mesmas_do_main", citas(ma) == citas(mm), f"as citações longe de {B}/conferir-mapa-rp3b.txt e de {B}/conferir-mapa-main.txt, comparadas pelo texto citado",
       "as duas listas leram-se com o número que o guião diz", len(citas(ma)) == num(ma, r"longe da linha citada: (\d+)") and len(citas(mm)) == num(mm, r"longe da linha citada: (\d+)"))
medida("rp3b_mapa_main_citacoes_longe", num(mm, r"longe da linha citada: (\d+)"), f"{B}/conferir-mapa-main.txt (o mapa do main sobre a árvore do main)", "o guião correu", "citações conferidas" in mm)
for nome in ("LEITURA-RP3-2026-10-04.md", "LEITURA-RP3-2026-10-04.plantas.json"):
    rel = f"design/especime-v3/critica/{nome}"
    b = open(rel, "rb").read()
    no_git = subprocess.run(["git", "show", f"HEAD:{rel}"], capture_output=True).stdout
    medida(f"critica_{nome.split('.')[1] if nome.endswith('.json') else 'md'}_sha256", hashlib.sha256(b).hexdigest(), f"sha256 de {rel}",
           "o ficheiro no commit é o mesmo do disco", no_git == b)
if existe(f"{B}/../custo-rp3b.json"):
    c = json.load(open(f"{PASTA}/custo-rp3b.json"))
    medida("rp3b_custo_simbolos", c["simbolos_gastos"], f"{PASTA}/custo-rp3b.json (custo-rp3.py --desde, sobre o registo da sessão)", c["conhecido_positivo"]["o_que"], c["conhecido_positivo"]["encontrado"])
    medida("rp3b_custo_segundos", c["segundos_entre_as_leituras"], f"{PASTA}/custo-rp3b.json", "é positivo", c["segundos_entre_as_leituras"] > 0)
    medida("rp3b_custo_subagentes", c.get("subagentes", NAO), f"{PASTA}/custo-rp3b.json (as chamadas da ferramenta Agent no registo, no mesmo intervalo)",
           c.get("conhecido_positivo_das_chamadas", {}).get("o_que", "o contador das chamadas correu"),
           c.get("conhecido_positivo_das_chamadas", {}).get("encontrado", False))

saida = {"bloco": "RP3-b", "guiao": f"{B}/medir-rp3b.py", "ramo": ramo, "cabeca_do_codigo": cab, "medidas_escritas": len(medidas), "medidas": medidas}
with open(f"{B}/medidas-rp3b.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(saida, ensure_ascii=False, indent=2) + "\n")
falhas = [x["nome"] for x in medidas if not x["conhecido_positivo"]["encontrado"] or x["valor"] == NAO]
print(f"medir-rp3b: {len(medidas)} medidas; {len(falhas)} sem conhecido-positivo ou por ler{': ' + ', '.join(falhas) if falhas else ''}")
raise SystemExit(1 if falhas else 0)
