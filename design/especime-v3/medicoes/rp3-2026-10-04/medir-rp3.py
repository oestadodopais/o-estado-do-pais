#!/usr/bin/env python3
"""RP3: as medidas do bloco, cada uma com o comando e um conhecido-positivo, em medidas.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/medir-rp3.py

Não lê a rede nem o motor. Lê o livro-razão do sítio (as séries, as linhas), o brief (as
citações do §3 que servem de testemunha), os registos dos portões da cabeça do código em
`portoes/` e os da base em `portoes-base/`, o que o motor disse em `motor/` (escrito por
`motor-rp3.py` a partir da worktree do motor, e os registos das corridas do motor), os
manifestos das capturas, das páginas comparadas e das plantas, a reprodução do §0 do brief,
o guião do mapa, as decisões em vigor e o custo. Cada medida leva o nome, o valor, o comando
e um conhecido-positivo que prova que a leitura podia ter achado alguma coisa.
"""
import glob
import json
import os
import re
import subprocess
from datetime import datetime

import yaml

PASTA = "design/especime-v3/medicoes/rp3-2026-10-04"
NAO = "NÃO LIDO"
medidas = []


def medida(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def ler(rel, modo="r"):
    with open(rel, modo, **({} if "b" in modo else {"encoding": "utf-8"})) as f:
        return f.read()


def ler_json(rel):
    return json.loads(ler(rel))


def existe(rel):
    return os.path.isfile(rel)


def segundos(a, b):
    return round((datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00"))).total_seconds())


# ------------------------------------------------------------------ as séries no livro
series = {}
for f in sorted(glob.glob("ledger/series/*.yml")):
    s = yaml.safe_load(ler(f))
    series[s["id"]] = (s, os.path.getsize(f))
no_tempo = {k: v for k, v in series.items() if v[0].get("eixo") == "periodo"}
de_paises = {k: v for k, v in series.items() if v[0].get("eixo") == "pais"}
medida("series_no_tempo_no_livro", len(no_tempo), "ls ledger/series/*.yml · eixo: periodo",
       "a derivada D1 está entre elas", "serie-cem-euros-de-2015-01" in no_tempo)
medida("series_de_paises_no_livro", len(de_paises), "ls ledger/series/*.yml · eixo: pais",
       "a série da dívida pública do UE1 continua lá", "divida-publica-2025-paises" in de_paises)
pontos = sum(len(s["pontos"]) for s, _ in no_tempo.values())
s1 = no_tempo["serie-ipc-variacao-homologa"][0]
lidas_da_fonte = [k for k, (s, _) in no_tempo.items() if s.get("source")]
medida("series_lidas_da_fonte", len(lidas_da_fonte), "as séries no tempo com «source» (as do §3 do brief, sem a derivada)",
       "a derivada não tem fonte", no_tempo["serie-cem-euros-de-2015-01"][0].get("source") is None)
medida("pontos_no_tempo", pontos, "a soma dos «pontos» das séries com eixo: periodo",
       "o último ponto da S1 é 2026-08 com «3,30»", s1["pontos"][-1]["periodo"] == "2026-08" and s1["pontos"][-1]["valor"] == "3,30")
com_excerto = sum(1 for s, _ in no_tempo.values() for p in s["pontos"] if p.get("excerto"))
d1 = no_tempo["serie-cem-euros-de-2015-01"][0]
medida("pontos_com_excerto", com_excerto, "os pontos das séries no tempo com «excerto» não nulo",
       "nenhum ponto da derivada tem excerto", all(not p.get("excerto") for p in d1["pontos"]))
medida("pontos_da_derivada", len(d1["pontos"]), "o comprimento de «pontos» em serie-cem-euros-de-2015-01",
       "o primeiro ponto é 2015-01 com «100,000»", d1["pontos"][0]["periodo"] == "2015-01" and d1["pontos"][0]["valor"] == "100,000")

motor = ler_json(f"{PASTA}/motor/motor-rp3.json")
por_id_motor = {s["id"]: s for s in motor["series"]}
tabela = []
for sid, (s, tamanho) in no_tempo.items():
    m = por_id_motor[sid]
    tabela.append({"id": sid, "fonte": s["source"] or "derivada", "edicao": (s.get("document") or {}).get("edition"),
                   "periodicidade": s["periodicidade"], "unidade": s["unit"],
                   "primeiro": s["primeiro_periodo"], "ultimo": s["ultimo_periodo"], "pontos": len(s["pontos"]),
                   "ultimo_valor": s["pontos"][-1]["valor"], "ultima_bandeira": s["pontos"][-1]["bandeira"],
                   "lacunas": [l["periodo"] for l in s["lacunas"]], "pontos_com_marca": sum(1 for p in s["pontos"] if p["bandeira"]),
                   "pedidos": len(s["pedidos"]), "bytes_dos_corpos": m["bytes_dos_corpos"], "bytes_do_ficheiro": tamanho,
                   "igual_ao_motor": (m["primeiro"], m["ultimo"], m["pontos"], m["ultimo_valor"]) ==
                                     (s["primeiro_periodo"], s["ultimo_periodo"], len(s["pontos"]), s["pontos"][-1]["valor"])})
medida("tabela_das_series", tabela, "cada ledger/series/<id>.yml com eixo: periodo, e os bytes dos corpos em motor/motor-rp3.json",
       "a S9 declara as lacunas 2002 e 2003", no_tempo["serie-linha-de-risco-de-pobreza"][0]["lacunas"][0]["periodo"] == "2002")
medida("series_iguais_no_motor_e_no_sitio", sum(1 for t in tabela if t["igual_ao_motor"]),
       "o primeiro e o último período, os pontos e o último valor de cada série no sítio contra motor/motor-rp3.json",
       "a comparação vê uma diferença plantada (um ponto a mais)", (len(s1["pontos"]) + 1) != por_id_motor["serie-ipc-variacao-homologa"]["pontos"])
medida("bytes_das_series_no_livro", sum(t["bytes_do_ficheiro"] for t in tabela), "a soma dos tamanhos dos dezasseis ficheiros",
       "o maior é o da S3, a série mais longa", max(tabela, key=lambda t: t["bytes_do_ficheiro"])["id"] == "serie-ipc-indice")

# ------------------------------------------------------------------ a testemunha do brief
brief = ler("design/observatorio/BRIEF-RP3-as-series-no-motor-e-no-livro.md")
TESTEMUNHA = [  # (série, períodos, valor, a frase do §3 do brief que o diz)
    ("serie-ihpc-combustiveis-variacao-homologa", ["2026-07"], "16,7", "a API deu 16,7 em 2026-07 e 24,0 em 2026-08"),
    ("serie-ihpc-combustiveis-variacao-homologa", ["2026-08"], "24,0", "a API deu 16,7 em 2026-07 e 24,0 em 2026-08"),
    ("serie-ihpc-combustiveis-variacao-homologa-ue", ["2026-07"], "16,9", "16,9 e 23,8 nos mesmos meses"),
    ("serie-ihpc-combustiveis-variacao-homologa-ue", ["2026-08"], "23,8", "16,9 e 23,8 nos mesmos meses"),
    ("serie-ihpc-rendas-variacao-homologa", ["2026-07"], "5,3", "(5,3 e 5,2)"),
    ("serie-ihpc-rendas-variacao-homologa", ["2026-08"], "5,2", "(5,3 e 5,2)"),
    ("serie-ihpc-energia-da-casa-variacao-homologa", ["2026-07"], "1,2", "(1,2 e 1,5)"),
    ("serie-ihpc-energia-da-casa-variacao-homologa", ["2026-08"], "1,5", "(1,2 e 1,5)"),
    ("serie-precos-da-habitacao-variacao-homologa", ["2025-T4"], "18,9", "18,9 em 2025-T4"),
    ("serie-precos-da-habitacao-variacao-homologa", ["2026-T1"], "17,8", "17,8 em 2026-T1"),
    ("serie-precos-da-habitacao-variacao-homologa", ["2026-T2"], "16,5", "16,5 em 2026-T2"),
    ("serie-salario-minimo-mensal", ["2025-S1", "2025-S2"], "1 015", "1 015 em 2025"),
    ("serie-salario-minimo-mensal", ["2026-S1", "2026-S2"], "1 073", "1 073 em 2026"),
]
resultado = []
for sid, periodos, valor, frase in TESTEMUNHA:
    pts = {p["periodo"]: p["valor"] for p in no_tempo[sid][0]["pontos"]}
    resultado.append({"serie": sid, "periodos": periodos, "valor_do_brief": valor, "frase_no_brief": frase in brief,
                      "valores_na_serie": [pts.get(x) for x in periodos], "igual": all(pts.get(x) == valor for x in periodos)})
medida("testemunha_do_brief", resultado, "cada valor que o §3 do brief cita (lido pelo lugar de direção na API a 03.10.2026) contra o ponto da série",
       "as treze frases estão no brief", all(r["frase_no_brief"] for r in resultado))
medida("testemunha_do_brief_iguais", sum(1 for r in resultado if r["igual"]), "as entradas da testemunha com o ponto igual",
       "a comparação vê uma diferença plantada (24,1 contra 24,0)", "24,1" != resultado[1]["valores_na_serie"][0])

# ------------------------------------------------------------------ as linhas presas, a parada, a coerente
presas = []
for f in sorted(glob.glob("ledger/claims/*.yml")):
    texto = ler(f)
    m = re.search(r'^serie: "([^"]+)"$', texto, re.M)
    if m:
        presas.append((os.path.basename(f)[:-4], m.group(1)))
medida("linhas_com_o_campo_serie", len(presas), "grep -c '^serie: ' ledger/claims/*.yml",
       "a linha da pensão média aponta a série da pensão", ("pensao-media-anual-2025", "serie-pensao-media-anual") in presas)
medida("linhas_presas", [{"linha": l, "serie": s} for l, s in presas], "as linhas com o campo serie e a série de cada uma",
       "a linha parada não tem o campo", "ihpc-variacao-homologa" not in dict(presas))
# As linhas que o ponto 7 do brief nomeia e que não têm série no §3: as duas médias de doze
# meses do IPC (o 0014666) e as três classes do IPC do INE (o 0014647; as S10, S12 e S13 são as
# classes do índice harmonizado do Eurostat, outra medida).
SEM_SERIE = ["ipc-variacao-media-12-meses", "ipc-sem-habitacao-variacao-media-12-meses",
             "ipc-combustiveis-variacao-homologa", "ipc-rendas-variacao-homologa", "ipc-energia-em-casa-variacao-homologa"]
codigos_das_series = {str((s.get("document") or {}).get("edition") or "").split(",")[0] for s, _ in no_tempo.values()}
sem_serie = []
for lid in SEM_SERIE:
    c = yaml.safe_load(ler(f"ledger/claims/{lid}.yml"))
    codigo = str(c["document"]["edition"]).split(",")[0]
    sem_serie.append({"linha": lid, "edicao": c["document"]["edition"], "codigo_tem_serie_no_tempo": codigo in codigos_das_series,
                      "tem_o_campo_serie": bool(c.get("serie"))})
medida("linhas_do_ponto_7_sem_serie_no_s3", sem_serie, "a edição de cada linha contra os códigos das séries no tempo",
       "o código 0014663 das linhas presas do IPC tem série (a comparação pode dizer que sim)", "0014663" in codigos_das_series)
medida("linhas_do_ponto_7_sem_serie_no_s3_contagem", sum(1 for x in sem_serie if not x["codigo_tem_serie_no_tempo"] and not x["tem_o_campo_serie"]),
       "as linhas acima sem série com o seu código e sem o campo", "são cinco nomes na lista", len(SEM_SERIE) == 5)
# O que mudou nas linhas escalares: só o campo serie, nas linhas presas (git diff --numstat da base à cabeça do código).
r = subprocess.run(["git", "diff", "--numstat", "1c4dde2f", cab_codigo := (ler(f"{PASTA}/portoes/cabeca").strip() if existe(f"{PASTA}/portoes/cabeca") else "HEAD"), "--", "ledger/claims/"],
                   capture_output=True, text=True)
numstat = [l.split("\t") for l in r.stdout.splitlines() if l]
medida("linhas_escalares_mudadas", len(numstat), f"git diff --numstat 1c4dde2f {cab_codigo[:8]} -- ledger/claims/",
       "são as linhas presas", sorted(os.path.basename(x[2])[:-4] for x in numstat) == sorted(l for l, _ in presas))
medida("linhas_escalares_linhas_acrescentadas_e_tiradas", {"acrescentadas": sum(int(x[0]) for x in numstat), "tiradas": sum(int(x[1]) for x in numstat)},
       "a soma das colunas do numstat acima", "cada linha presa ganhou o campo e o seu comentário (3 linhas)", all(x[0] == "3" and x[1] == "0" for x in numstat))
# Que linhas presas são cartões nacionais (a tabela DOMINIO_DAS_MEDIDAS, que a S5 do check:series lê), e se alguma
# linha do período anterior é um cartão: lido do próprio módulo, pelo node.
r_cart = subprocess.run(["node", "--input-type=module", "-e",
                         "import { DOMINIO_DAS_MEDIDAS as D } from './src/data/dominios.mjs';"
                         "const ids = JSON.parse(process.argv[1]);"
                         "console.log(JSON.stringify({ presas: Object.fromEntries(ids.map((i) => [i, Object.prototype.hasOwnProperty.call(D, i)])),"
                         " periodo_anterior: Object.keys(D).filter((k) => k.endsWith('-periodo-anterior')).length, cartoes: Object.keys(D).length }));",
                         json.dumps([l for l, _ in presas])], capture_output=True, text=True)
cart = json.loads(r_cart.stdout) if r_cart.returncode == 0 else None
medida("linhas_presas_que_sao_cartoes_nacionais", cart["presas"] if cart else NAO, "DOMINIO_DAS_MEDIDAS de src/data/dominios.mjs, lido pelo node, para cada linha presa",
       "a tabela tem cartões e a linha do índice harmonizado de Portugal é um deles", bool(cart) and cart["cartoes"] > 0 and
       subprocess.run(["node", "--input-type=module", "-e", "import { DOMINIO_DAS_MEDIDAS as D } from './src/data/dominios.mjs'; process.exit('ihpc-variacao-homologa' in D ? 0 : 1);"]).returncode == 0)
medida("linhas_do_periodo_anterior_que_sao_cartoes", cart["periodo_anterior"] if cart else NAO, "as chaves de DOMINIO_DAS_MEDIDAS acabadas em -periodo-anterior",
       "a tabela leu-se", bool(cart))
parada = motor["linhas_paradas"][0]
linha_parada = yaml.safe_load(ler("ledger/claims/ihpc-variacao-homologa.yml"))
medida("linha_parada", parada, "motor/motor-rp3.json · linhas_paradas, e ledger/claims/ihpc-variacao-homologa.yml",
       "a linha no sítio diz 2026-08 e a série acaba em 2026-09 com a marca «e»",
       linha_parada["reference_date"] == "2026-08" and parada["ultimo_ponto"] == "2026-09" and parada["ultima_bandeira"] == "e")
medida("s15_mesmos_bytes_que_a_linha", motor["s15_e_a_linha"]["mesmos_bytes"], "o sha256 do corpo que a linha do salário mínimo cita contra o do pedido da S15 (motor/motor-rp3.json · s15_e_a_linha)",
       "os dois resumos leram-se e têm 64 hexadecimais", len(motor["s15_e_a_linha"]["sha256_da_linha"]) == 64 and len(motor["s15_e_a_linha"]["sha256_da_serie"]) == 64)
medida("linha_coerente", motor["linhas_coerentes"][0], "motor/motor-rp3.json · linhas_coerentes",
       "a linha do salário mínimo vale, no sítio, o valor da coerência", re.sub(r"\s", "", yaml.safe_load(ler("ledger/claims/retribuicao-minima-mensal-doze-meses-2026.yml"))["value"]) == re.sub(r"\s", "", motor["linhas_coerentes"][0]["valor"]))

# ------------------------------------------------------------------ os pedidos e o teto
p = motor["pedidos"]
medida("pedidos_tentativas", p["tentativas"], "motor/motor-rp3.json · pedidos.tentativas (as linhas de pedidos.jsonl no motor)",
       "há tentativas aos dois anfitriões", set(p["por_anfitriao"]) == {"www.ine.pt", "ec.europa.eu"})
medida("pedidos_por_estado", p["por_estado"], "motor/motor-rp3.json · pedidos.por_estado",
       "há três respostas 502 do INE, repetidas e lidas depois", p["por_estado"].get("recusado 502") == 3)
medida("pedidos_por_anfitriao", p["por_anfitriao"], "motor/motor-rp3.json · pedidos.por_anfitriao",
       "o Eurostat teve nove pedidos (as nove séries do Eurostat, e um corpo cada)", p["por_anfitriao"].get("ec.europa.eu") == 9)
medida("recusas_ora_06502", len(p["recusas_ora_06502"]), "os corpos de 200 com «ORA-06502» (o Dim1 inteiro recusado)",
       "as duas são da S1 e da S2", {r["nome"] for r in p["recusas_ora_06502"]} == {"ine-serie-ipc-variacao-homologa.json", "ine-serie-ipc-alimentacao-variacao-homologa.json"})
medida("recusa_414", len(p["recusa_414"]), "os pedidos com HTTP 414 (o Dim1 inteiro da S3, longo demais)",
       "é a da S3", p["recusa_414"][0]["nome"] == "ine-serie-ipc-indice.json")
medida("corpos_alojados", motor["alojados"]["no_fetch"], "motor/motor-rp3.json · alojados.no_fetch",
       "o manifesto tem o mesmo número", motor["alojados"]["no_manifesto"] == motor["alojados"]["no_fetch"])
medida("bytes_alojados", motor["alojados"]["bytes"], "a soma dos bytes das entradas rp3/ do FETCH.json",
       "é menos do que o teto vezes os corpos", motor["alojados"]["bytes"] < 8 * 1024 * 1024 * motor["alojados"]["no_fetch"])
medida("maior_corpo_lido", p["maior_corpo_lido"], "o maior «bytes» de pedidos.jsonl",
       "é a metainformação do 0014639, abaixo do teto", p["maior_corpo_lido"] < motor["teto_do_corpo"]["teto"])
t = motor["teto_do_corpo"]
medida("maior_ficheiro_de_fonte_em_git", t["bytes"], "o maior ficheiro de content/*/source/ em git, no motor",
       "é o PDF do Eurostat do estudo 13 que o comentário do teto nomeia", t["maior_ficheiro_de_fonte_em_git"].endswith("esa2010-KS-02-13-269-EN.pdf"))
medida("teto_do_corpo", t["teto"], "TETO_DO_CORPO em publisher/dominios_fetch.py (8 MiB)",
       "o teto está em cada pedido registado", p["teto_em_cada_pedido"] == [t["teto"]])
mi = motor["metainformacao_do_ine"]
medida("metainformacao_do_ine", mi, "motor/motor-rp3.json · metainformacao_do_ine (os campos da metainformação de cada código, como a resposta os escreve)",
       "o 0014663 começa em janeiro de 1992, como o §3 dizia", mi["0014663"]["PrimeiroPeriodo"] == "Janeiro de 1992")
medida("casas_decimais_da_derivada", int(mi["0014639"]["PrecisaoDecimal"]), "a PrecisaoDecimal do 0014639, que o construtor usa para arredondar a D1",
       "o último ponto da D1 tem essas casas", len(d1["pontos"][-1]["valor"].split(",")[1]) == int(mi["0014639"]["PrecisaoDecimal"]))
e = motor["escolha_da_s3"]
medida("codigo_da_s3", e["escolhido"], "motor/motor-rp3.json · escolha_da_s3 (escrito por escolher-s3.py)",
       "o 0014641 é anual e falha o primeiro critério", any(c["codigo"] == "0014641" and not c["criterios"]["1_mensal"] for c in e["candidatos"]))
medida("candidatos_da_s3", len(e["candidatos"]), "os candidatos em escolha-s3.json (os códigos que o §3 dá a escolher)",
       "o 0014667 está entre eles", any(c["codigo"] == "0014667" for c in e["candidatos"]))
medida("candidatos_da_s3_que_passam_1_a_3", [c["codigo"] for c in e["candidatos"] if all(c["criterios"][k] for k in ("1_mensal", "2_consumo_individual", "3_pt_e_total"))],
       "os candidatos mensais, do consumo individual, com Portugal e o total", "o 0014639 está entre eles", "0014639" in [c["codigo"] for c in e["candidatos"]])
medida("candidatos_da_s3_que_passam_todos", [c["codigo"] for c in e["candidatos"] if all(c["criterios"].values())],
       "os candidatos com os quatro critérios", "eram oito candidatos", len(e["candidatos"]) == 8)

# ------------------------------------------------------------------ os portões
def portoes(pasta):
    out = {}
    for g in ("build", "verify", "typecheck"):
        cod = f"{pasta}/{g}.codigo"
        if not existe(cod):
            out[g] = None
            continue
        out[g] = {"codigo": int(ler(cod).strip()), "segundos": segundos(ler(f"{pasta}/{g}.inicio").strip(), ler(f"{pasta}/{g}.fim").strip())}
    out["cabeca"] = ler(f"{pasta}/cabeca").strip() if existe(f"{pasta}/cabeca") else None
    out["cabeca_fim"] = ler(f"{pasta}/cabeca.fim").strip() if existe(f"{pasta}/cabeca.fim") else None
    log = ler(f"{pasta}/build.log") if existe(f"{pasta}/build.log") else ""
    m = re.search(r"(\d+) page\(s\) built", log)
    out["paginas_construidas"] = int(m.group(1)) if m else None
    return out


cab = portoes(f"{PASTA}/portoes")
# O ANTES: a última corrida inteira dos portões numa cabeça com o mesmo código da base deste ramo. É a corrida
# final do S1 (portoes-d, na cabeça 6ef944d6); entre ela e a base 1c4dde2f só mudaram documentos (o CLAUDE.md, o
# DECISIONS.md e ficheiros de design/), e nenhum ficheiro do código, do livro, dos guiões ou das dependências.
ANTES = "design/especime-v3/medicoes/s1-2026-10-02/portoes-d"
base = portoes(ANTES)
CODIGO = ["src", "scripts", "tests", "ledger", "public", "api", "supabase", "mapa", "package.json", "package-lock.json",
          "astro.config.mjs", "site.config.mjs", "tsconfig.json", "tsconfig.check.json", "vercel.json"]
def mudados(a, b):
    r = subprocess.run(["git", "diff", "--name-only", a, b, "--", *CODIGO], capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l] if r.returncode == 0 else None
entre = mudados(base["cabeca"], "1c4dde2f")
positivo = mudados(base["cabeca"], cab["cabeca"])
medida("ficheiros_do_codigo_mudados_entre_o_antes_e_a_base", len(entre) if entre is not None else NAO,
       f"git diff --name-only {base['cabeca'][:8]} 1c4dde2f -- " + " ".join(CODIGO),
       "o mesmo comando até à cabeça do código vê os ficheiros do bloco", bool(positivo))
for g in ("build", "verify", "typecheck"):
    medida(f"portao_{g}_codigo", cab[g]["codigo"] if cab[g] else NAO, f"cat {PASTA}/portoes/{g}.codigo",
           "o ficheiro existe e é um inteiro", cab[g] is not None)
    medida(f"portao_{g}_segundos", cab[g]["segundos"] if cab[g] else NAO, f"{PASTA}/portoes/{g}.fim menos {g}.inicio",
           "as duas horas leram-se", cab[g] is not None)
medida("portoes_cabeca", cab["cabeca"], f"cat {PASTA}/portoes/cabeca", "a cabeça do fim é a mesma", cab["cabeca"] == cab["cabeca_fim"])
medida("paginas_construidas", cab["paginas_construidas"], f"«N page(s) built» em {PASTA}/portoes/build.log",
       "o registo traz a linha do Astro", cab["paginas_construidas"] is not None)
if base:
    for g in ("build", "verify", "typecheck"):
        medida(f"base_{g}_codigo", base[g]["codigo"] if base[g] else NAO, f"cat {ANTES}/{g}.codigo",
               "o ficheiro existe e é um inteiro", base[g] is not None)
        medida(f"base_{g}_segundos", base[g]["segundos"] if base[g] else NAO, f"{ANTES}/{g}.fim menos {g}.inicio",
               "as duas horas leram-se", base[g] is not None)
    medida("base_cabeca", base["cabeca"], f"cat {ANTES}/cabeca", "é a cabeça do código do S1, 6ef944d6", (base["cabeca"] or "").startswith("6ef944d6"))
    medida("base_paginas_construidas", base["paginas_construidas"], f"«N page(s) built» em {ANTES}/build.log",
           "o registo traz a linha do Astro", base["paginas_construidas"] is not None)
    if base["build"] and cab["build"]:
        medida("diferenca_segundos_build", cab["build"]["segundos"] - base["build"]["segundos"], "os segundos do build da cabeça menos os da base",
               "as duas corridas acabaram com 0", cab["build"]["codigo"] == 0 and base["build"]["codigo"] == 0)
    if base["verify"] and cab["verify"]:
        medida("diferenca_segundos_verify", cab["verify"]["segundos"] - base["verify"]["segundos"], "os segundos do verify da cabeça menos os da base",
               "as duas corridas acabaram com 0", cab["verify"]["codigo"] == 0 and base["verify"]["codigo"] == 0)
    if base["paginas_construidas"] and cab["paginas_construidas"]:
        medida("diferenca_paginas_construidas", cab["paginas_construidas"] - base["paginas_construidas"], "as páginas da cabeça menos as da base",
               "é o dobro das séries no tempo", cab["paginas_construidas"] - base["paginas_construidas"] == 2 * len(no_tempo))

fonte_ledger = ler("scripts/check-ledger.mjs")
regras_rp3 = re.findall(r"regra: 'S(9|1[0-4])'", fonte_ledger)
medida("plantas_do_ledger_check_rp3_por_regra", {f"S{r}": regras_rp3.count(r) for r in ("9", "10", "11", "12", "13", "14")},
       "as plantas com «regra: 'S9'» a «'S14'» em scripts/check-ledger.mjs, por regra", "a soma é a contagem total", len(regras_rp3) == 14)
guardas_antes = subprocess.run(["git", "show", "1c4dde2f:scripts/provar-guardas.mjs"], capture_output=True, text=True).stdout
m_ga = re.search(r"CAMPOS\.length === (\d+)", guardas_antes)
m_gc = re.search(r"CAMPOS\.length === (\d+)", ler("scripts/provar-guardas.mjs"))
medida("guarda_dos_campos_antes", int(m_ga.group(1)) if m_ga else NAO, "git show 1c4dde2f:scripts/provar-guardas.mjs · «CAMPOS.length === N»",
       "a corrida com a igualdade velha recusou o caso", "CAMPOS/tamanho: esperava ACEITE e foi RECUSADO" in ler(f"{PASTA}/plantas/guardas-com-a-igualdade-velha.log"))
medida("guarda_dos_campos_agora", int(m_gc.group(1)) if m_gc else NAO, "scripts/provar-guardas.mjs · «CAMPOS.length === N»",
       "é um a mais do que antes", m_ga is not None and m_gc is not None and int(m_gc.group(1)) == int(m_ga.group(1)) + 1)
medida("plantas_do_ledger_check_rp3", len(regras_rp3), "as plantas com «regra: 'S9'» a «'S14'» em scripts/check-ledger.mjs",
       "há pelo menos uma por regra, da S9 à S14", set(regras_rp3) == {"9", "10", "11", "12", "13", "14"})
verify = ler(f"{PASTA}/portoes/verify.log") if existe(f"{PASTA}/portoes/verify.log") else ""
verify = re.sub(r"\x1b\[[0-9;]*m", "", verify)  # as cores do terminal saem antes de ler as linhas
def linha(rx):
    m = re.search(rx, verify)
    return m.group(0).strip() if m else NAO
medida("verify_ledger_check_series", linha(r"séries · \d+ série\(s\) de \d+ ponto\(s\)[^\n]*"), "a linha das séries do ledger:check em portoes/verify.log",
       "a linha diz as dezasseis séries no tempo", "16 no tempo" in linha(r"séries · \d+ série\(s\) de \d+ ponto\(s\)[^\n]*"))
medida("verify_check_series", linha(r"check:series · \d+ série\(s\) no tempo[^\n]*"), "a linha do check:series em portoes/verify.log",
       "a linha diz as plantas", "planta(s) morderam" in linha(r"check:series · \d+ série\(s\) no tempo[^\n]*"))
medida("verify_check_palavras", linha(r"\d+ de \d+ plantas vistas \([^\n]*"), "a linha do check:palavras em portoes/verify.log",
       "a linha diz os buracos da superfície", "buracos da superfície" in linha(r"\d+ de \d+ plantas vistas \([^\n]*"))
medida("verify_autoteste_da_check_lugar", linha(r"RP3, o autoteste da marca das séries[^\n]*"), "a linha do autoteste em portoes/verify.log",
       "a linha diz os dois lados", "esperado 1" in linha(r"RP3, o autoteste da marca das séries[^\n]*"))
medida("verify_check_cruzamento_series", linha(r"séries · \d+ linha\(s\) de série em \d+ registo\(s\)[^\n]*"), "a linha das séries do check:cruzamento em portoes/verify.log",
       "a linha diz as plantas", "planta(s)" in linha(r"séries · \d+ linha\(s\) de série em \d+ registo\(s\)[^\n]*"))
vb = re.sub(r"\x1b\[[0-9;]*m", "", ler(f"{ANTES}/verify.log"))
m_pb = re.search(r"(\d+) de (\d+) plantas vistas \((\d+) palavras, (\d+) buracos da superfície\)", vb)
medida("base_check_palavras_plantas", int(m_pb.group(2)) if m_pb else NAO, f"a linha do check:palavras em {ANTES}/verify.log (a corrida do antes)",
       "a linha diz as palavras e os buracos", m_pb is not None)
medida("base_check_palavras_buracos", int(m_pb.group(4)) if m_pb else NAO, f"a mesma linha, os buracos da superfície", "a linha leu-se", m_pb is not None)
co = re.sub(r"\x1b\[[0-9;]*m", "", ler(f"{PASTA}/cruzamento-com-origem.log")) if existe(f"{PASTA}/cruzamento-com-origem.log") else ""
m_co = re.search(r"séries · (\d+) linha\(s\) de série em \d+ registo\(s\) · (\d+) conferida\(s\) contra o motor", co)
medida("cruzamento_com_origem_codigo", int(ler(f"{PASTA}/cruzamento-com-origem.codigo").strip()) if existe(f"{PASTA}/cruzamento-com-origem.codigo") else NAO,
       f"RESEARCHHUB_DIR=<motor> node scripts/check-cruzamento.mjs --with-origin, na cabeça {ler(f'{PASTA}/cruzamento-com-origem.cabeca').strip()[:8] if existe(f'{PASTA}/cruzamento-com-origem.cabeca') else '?'}",
       "a linha das séries leu-se", m_co is not None)
medida("cruzamento_com_origem_series_conferidas_contra_o_motor", int(m_co.group(2)) if m_co else NAO, f"{PASTA}/cruzamento-com-origem.log · a linha das séries",
       "é o número das séries no livro", m_co is not None and int(m_co.group(1)) == len(series))
medida("verify_guardas", linha(r"guardas · \d+ conferência\(s\)[^\n]*"), "a linha do provar:guardas em portoes/verify.log",
       "a linha diz as conferências", "conferência(s)" in linha(r"guardas · \d+ conferência\(s\)[^\n]*"))

# ------------------------------------------------------------------ as páginas, as capturas, as plantas
if existe(f"{PASTA}/paginas-rp3.json"):
    pg = ler_json(f"{PASTA}/paginas-rp3.json")
    for k in ("paginas_html_na_base", "paginas_html_na_cabeca", "paginas_novas", "paginas_novas_sao_os_recibos", "paginas_que_sairam", "paginas_comuns",
              "paginas_iguais_byte_a_byte", "paginas_iguais_sem_a_construcao", "paginas_que_mudaram", "paginas_que_mudaram_por_razao",
              "outros_ficheiros_novos", "outros_ficheiros_que_sairam", "outros_ficheiros_que_mudaram", "outros_ficheiros_que_mudaram_por_razao",
              "outros_ficheiros_que_mudaram_por_outra_razao", "outros_ficheiros_comuns_iguais"):
        v = pg[k]
        medida(k, len(v) if isinstance(v, list) else v, f"{PASTA}/paginas-rp3.json · {k} (paginas-rp3.mjs sobre a construção da base e a da cabeça)",
               "as duas construções são da base e da cabeça do código", pg["construcao_da_base"].startswith("1c4dde2f") and pg["construcao_da_cabeca"] == cab["cabeca"])
if existe(f"{PASTA}/paginas-rp3-fb8dcca4.json"):
    pa = ler_json(f"{PASTA}/paginas-rp3-fb8dcca4.json")
    medida("antes_da_folha_a_parte_paginas_que_mudaram", pa["paginas_que_mudaram"], f"{PASTA}/paginas-rp3-fb8dcca4.json (a mesma comparação na cabeça fb8dcca4, antes da folha à parte)",
           "eram os recibos das séries de países", all("/series/" in x and x.rstrip("/").split("/")[-2].endswith("-paises") for x in pa["paginas_que_mudaram_lista"]))
    medida("antes_da_folha_a_parte_razao", pa["paginas_que_mudaram_por_razao"], f"{PASTA}/paginas-rp3-fb8dcca4.json · paginas_que_mudaram_por_razao",
           "a razão leu-se", bool(pa["paginas_que_mudaram_por_razao"]))
if existe(f"{PASTA}/paginas-rp3-637a8044.json"):
    pb = ler_json(f"{PASTA}/paginas-rp3-637a8044.json")
    medida("so_com_a_folha_a_parte_paginas_que_mudaram", pb["paginas_que_mudaram"], f"{PASTA}/paginas-rp3-637a8044.json (a mesma comparação depois da primeira emenda, só com a folha à parte)",
           "eram ainda os recibos das séries de países", all("/series/" in x and x.rstrip("/").split("/")[-2].endswith("-paises") for x in pb["paginas_que_mudaram_lista"]))
for pasta_antiga in ("portoes-fb8dcca4", "portoes-637a8044"):
    if os.path.isdir(f"{PASTA}/{pasta_antiga}"):
        cods = {g: int(ler(f"{PASTA}/{pasta_antiga}/{g}.codigo").strip()) for g in ("build", "verify", "typecheck")}
        medida(f"corrida_{pasta_antiga.replace('-', '_')}", cods, f"cat {PASTA}/{pasta_antiga}/*.codigo",
               "a cabeça dessa corrida é a do nome da pasta", ler(f"{PASTA}/{pasta_antiga}/cabeca").strip().startswith(pasta_antiga.split("-")[1]))
if existe(f"{PASTA}/capturas-rp3.json"):
    cp = ler_json(f"{PASTA}/capturas-rp3.json")
    medida("capturas_dos_recibos", cp["capturas"], f"{PASTA}/capturas-rp3.json · capturas", "a construção capturada é a da cabeça", cp["construcao"]["commit"] == cab["cabeca"])
    medida("capturas_larguras", cp["larguras"], f"{PASTA}/capturas-rp3.json · larguras", "as duas que o mandato pede estão lá", 390 in cp["larguras"] and 1280 in cp["larguras"])
    medida("capturas_do_antes", cp["capturas_antes"], f"{PASTA}/capturas-rp3.json · capturas_antes", "há uma por largura e por edição de cada linha", cp["capturas_antes"] == 2 * 2 * len(cp["larguras"]))
    alturas = [r["medidas"]["altura"] for r in cp["resultados"] if r["serie"] == "serie-ihpc-variacao-homologa"]
    medida("altura_do_recibo_mensal_maior", max(alturas), f"{PASTA}/capturas-rp3.json · a maior «altura» do recibo da S4 (357 pontos)",
           "o recibo mostra os pontos todos", all(r["medidas"]["pontos"] == 357 for r in cp["resultados"] if r["serie"] == "serie-ihpc-variacao-homologa"))
    medida("altura_do_recibo_mensal_menor", min(alturas), f"{PASTA}/capturas-rp3.json · a menor «altura» do recibo da S4", "leram-se as 10 capturas", len(alturas) == 10)
    medida("capturas_problemas", len(cp["problemas"]), f"{PASTA}/capturas-rp3.json · problemas", "o captor confere a tabela contra a série", all("linhas_da_tabela" in r["medidas"] for r in cp["resultados"]))
    medida("capturas_pedidos_para_fora", cp["pedidos_recusados_para_fora"], f"{PASTA}/capturas-rp3.json · pedidos_recusados_para_fora",
           "o captor tem a rota que recusa o que não é da origem local", "rota.abort()" in ler(f"{PASTA}/captar-rp3.mjs"))
if existe(f"{PASTA}/plantas-rp3.json"):
    pl = ler_json(f"{PASTA}/plantas-rp3.json")
    medida("plantas_das_celulas_s", len(pl["plantas"]), f"node tests/series/series.mjs --prova --json {PASTA}/plantas-rp3.json",
           "há plantas das seis células", {x["celula"] for x in pl["plantas"]} == {"S1", "S2", "S3", "S4", "S5", "S6"})
    medida("plantas_das_celulas_s_que_morderam", sum(1 for x in pl["plantas"] if x["mordeu"]), "as plantas com «mordeu»",
           "cada uma diz a primeira queixa", all(x["primeira"] for x in pl["plantas"] if x["mordeu"]))
    medida("plantas_das_celulas_s_por_celula", {c: sum(1 for x in pl["plantas"] if x["celula"] == c) for c in ("S1", "S2", "S3", "S4", "S5", "S6")},
           f"{PASTA}/plantas-rp3.json · as plantas por célula", "a soma é o total", len(pl["plantas"]) == sum(1 for x in pl["plantas"] if x["celula"] in ("S1", "S2", "S3", "S4", "S5", "S6")))
    medida("celulas_s_cartoes_no_ultimo_ponto", pl["contas"]["cartoesNoUltimo"], f"{PASTA}/plantas-rp3.json · contas.cartoesNoUltimo (os cartões nacionais presos, no último ponto)",
           "há 7 linhas presas e uma é a da União, que não é um cartão nacional", pl["contas"]["linhasPresas"] == 7)
    medida("celulas_s_linhas_presas", pl["contas"]["linhasPresas"], f"{PASTA}/plantas-rp3.json · contas.linhasPresas", "é o número das linhas com o campo", pl["contas"]["linhasPresas"] == len(presas))
    medida("celulas_s_recibos_lidos", pl["contas"]["recibos"] if "recibos" in pl["contas"] else NAO, f"{PASTA}/plantas-rp3.json · contas.recibos", "é o dobro das séries no tempo", pl["contas"].get("recibos") == 2 * len(no_tempo))
    medida("celulas_s_pontos_refeitos", pl["contas"]["pontosRefeitos"], f"{PASTA}/plantas-rp3.json · contas.pontosRefeitos", "são os pontos da derivada", pl["contas"]["pontosRefeitos"] == len(d1["pontos"]))
    medida("celulas_s_erros", sum(len(v) for v in pl["erros"].values()), "a soma dos erros das seis células na cabeça",
           "a contagem dos pontos é a do livro", pl["contas"]["pontos"] == pontos)
    medida("celulas_s_motor_pontos_no_corpo", (pl["contas"].get("motor") or {}).get("pontos"),
           "a metade do motor da S3, com RESEARCHHUB_DIR na worktree do motor", "é o número dos pontos com excerto", (pl["contas"].get("motor") or {}).get("pontos") == com_excerto)
if existe(f"{PASTA}/plantas-portoes-rp3.json"):
    pp = ler_json(f"{PASTA}/plantas-portoes-rp3.json")
    medida("plantas_sobre_dist", len(pp["plantas"]), f"node {PASTA}/plantas-rp3.mjs", "a construção é a da cabeça", pp["construcao"] == cab["cabeca"])
    medida("plantas_sobre_dist_que_morderam", sum(1 for x in pp["plantas"] if x["passou"] and not x.get("controlo")), "as plantas com «passou» (código 1, cada mordida vista, páginas repostas)",
           "cada planta repôs as suas páginas", all(f["antes"] == f["reposto"] for x in pp["plantas"] for f in x["ficheiros"]))
    medida("plantas_sobre_dist_plantas", sum(1 for x in pp["plantas"] if not x.get("controlo")), "as entradas sem «controlo»", "há pelo menos uma por portão mudado",
           {"node scripts/gate-html.mjs", "node scripts/check-formas.mjs", "node scripts/check-lugar.mjs", "node scripts/check-voz.mjs"} <= {x["comando"] for x in pp["plantas"]})
    medida("plantas_sobre_dist_controlos", sum(1 for x in pp["plantas"] if x.get("controlo")), "as entradas com «controlo» (a mesma troca na forma antiga)", "o controlo saiu com 0",
           all(x["codigo"] == 0 for x in pp["plantas"] if x.get("controlo")))
    medida("plantas_sobre_dist_controlos_sem_mordida", sum(1 for x in pp["plantas"] if x.get("controlo") and x["passou"]), "os controlos com «passou» (código 0, nenhuma mordida)",
           "a planta da mesma troca com a marca mordeu", any(x["nome"] == "rp3-voz-nome-de-outra-serie" and x["passou"] for x in pp["plantas"]))

# ------------------------------------------------------------------ o motor
def corrida(nome):
    cod = f"{PASTA}/motor/{nome}.codigo"
    return int(ler(cod).strip()) if existe(cod) else NAO
for nome, kp in (("core-gate", "GATE: PASS"), ("dominios-series-test", "DOMINIOS_SERIES_TEST: PASS"), ("series-paises-test", "SERIES_PAISES_TEST: PASS"),
                 ("export-site-rows-test", "PASS"), ("dominios-series", "DOMINIOS_SERIES: PASS"), ("export-series", "EXPORT_SERIES: PASS")):
    log = ler(f"{PASTA}/motor/{nome}.log") if existe(f"{PASTA}/motor/{nome}.log") else ""
    medida(f"motor_{nome.replace('-', '_')}_codigo", corrida(nome), f"cat {PASTA}/motor/{nome}.codigo", f"o registo diz «{kp}»", kp in log)
medida("motor_ficheiros_mudados_no_ramo", motor["ficheiros_mudados_no_ramo"], "git diff --name-only d2495a7..HEAD no motor (motor/motor-rp3.json)",
       "o ramo mudou ficheiros", motor["ficheiros_mudados_no_ramo"] > 0)
medida("motor_ficheiros_de_outras_corridas_mudados", len(motor["ficheiros_de_outras_corridas_mudados"]),
       "os mudados no ramo em indicators/*.json, .maintenance-locks/, sweeps/ e publisher/recortes/manifest.regioes.json",
       "o filtro reconhece indicators/vintages.json e não um JSON de indicators/out/", motor["conhecido_positivo_de_outras_corridas"])
medida("motor_linhas_tiradas_dos_leitores", motor["modulos_mudados"]["publisher/dominios_readers.py"]["tiradas"],
       "git diff --numstat d2495a7..HEAD -- publisher/dominios_readers.py no motor (motor/motor-rp3.json · modulos_mudados)",
       "o mesmo ficheiro ganhou as linhas dos leitores de série", motor["modulos_mudados"]["publisher/dominios_readers.py"]["acrescentadas"] > 0)
medida("motor_modulos_mudados", motor["modulos_mudados"], "motor/motor-rp3.json · modulos_mudados", "o construtor novo está entre eles",
       "publisher/dominios_series.py" in motor["modulos_mudados"])
dst = ler(f"{PASTA}/motor/dominios-series-test.log") if existe(f"{PASTA}/motor/dominios-series-test.log") else ""
medida("motor_commits_do_ramo", len(motor["commits_do_ramo"]), "git log --format=%h d2495a7..HEAD no motor (motor/motor-rp3.json · commits_do_ramo)",
       "o último é a cabeça", motor["cabeca_do_motor"].startswith(motor["commits_do_ramo"][-1]))
# As plantas da suíte do motor, por grupo, pelos nomes que a suíte escreve no seu registo.
GRUPOS_DO_MOTOR = {
    "formas de período": ["um mês treze", "um quinto trimestre", "um terceiro semestre", "um ano de dois algarismos", "um mês treze no INE",
                          "um ano numa metainformação mensal", "um mês treze num corpo do Eurostat"],
    "o teto do corpo": ["um corpo acima do teto", "um corpo acima do teto, registado pelo guião dos pedidos"],
    "VP1": ["um ponto tirado do meio"],
    "VP2": ["um valor do INE trocado", "um índice trocado no Eurostat", "uma marca tirada", "um corpo alojado mexido"],
    "VP3": ["uma linha presa desfasada"],
    "VP4": ["um ponto trocado na derivada"],
    "VP6": ["um ponto publicado mudado sem correção", "um ponto publicado que desaparece"],
    "VS5": ["uma série no tempo que sai"],
    "V18": ["V18: uma linha com outro valor", "V18: uma linha presa à série de outra classe"],
    "o construtor": ["uma identidade que a fonte não diz", "a paragem que deixou de ter razão", "um semestre revisto no ano da linha coerente"],
}
m_pl = re.search(r"plantas: (\d+) morderam \((.*)\)\s*$", dst, re.M)
nomes_motor = m_pl.group(2) if m_pl else ""
todos = [n for g in GRUPOS_DO_MOTOR.values() for n in g]
# Os nomes têm vírgulas lá dentro, e por isso confere-se cada nome declarado na lista escrita, do mais comprido para o mais curto.
resto = nomes_motor
for n in sorted(todos, key=len, reverse=True):
    resto = resto.replace(n, "", 1) if n in resto else resto + "\u0000FALTA:" + n
resto = re.sub(r"[ ,]+", "", resto)
medida("motor_plantas_por_grupo", {g: len(ns) for g, ns in GRUPOS_DO_MOTOR.items()}, f"os nomes das plantas em {PASTA}/motor/dominios-series-test.log, por grupo",
       "cada nome declarado está na lista da suíte, e a lista não tem mais nenhum", resto == "" and len(todos) == (int(m_pl.group(1)) if m_pl else -1))
medida("motor_cabeca", motor["cabeca_do_motor"], "git rev-parse HEAD na worktree do motor (motor/motor-rp3.json)",
       "a árvore do motor estava limpa", motor["arvore_do_motor_limpa"])
m = re.search(r"plantas: (\d+) morderam", dst)
medida("motor_plantas_da_suite", int(m.group(1)) if m else NAO, f"«plantas: N morderam» em {PASTA}/motor/dominios-series-test.log",
       "a suíte passou", "DOMINIOS_SERIES_TEST: PASS" in dst)
m = re.search(r"PASS · (\d+) conferências", dst)
medida("motor_conferencias_da_suite", int(m.group(1)) if m else NAO, f"«PASS · N conferências» em {PASTA}/motor/dominios-series-test.log",
       "a linha leu-se", m is not None)
cg = ler(f"{PASTA}/motor/core-gate.log") if existe(f"{PASTA}/motor/core-gate.log") else ""
if existe(f"{PASTA}/motor/core-gate.inicio"):
    medida("motor_core_gate_segundos", segundos(ler(f"{PASTA}/motor/core-gate.inicio").strip(), ler(f"{PASTA}/motor/core-gate.fim").strip()),
           f"{PASTA}/motor/core-gate.fim menos core-gate.inicio", "a suíte do RP3 corre no portão", "dominios_series_test" in cg or "DOMINIOS_SERIES_TEST" in cg)

# ------------------------------------------------------------------ o §0, o mapa, as decisões, o custo
rep = ler_json(f"{PASTA}/brief-rp3-reproduzido.json")
orig = ler_json("design/observatorio/medidas/BRIEF-RP3.json")
iguais = sum(1 for a, b in zip(rep["medidas"], orig["medidas"]) if (a["nome"], a["valor"]) == (b["nome"], b["valor"]))
medida("brief_s0_reproduzido_iguais", iguais, "python3 design/observatorio/medidas/BRIEF-RP3.py contra design/observatorio/medidas/BRIEF-RP3.json, medida a medida",
       "o §0 tem as linhas do livro de 334cc740", any(x["nome"] == "linhas_do_livro" and x["valor"] == 2984 for x in rep["medidas"]))
mapa = ler(f"{PASTA}/conferir-mapa.txt")
mb = ler(f"{PASTA}/conferir-mapa-base.txt")
num = lambda t, rx: int(re.search(rx, t).group(1)) if re.search(rx, t) else NAO
medida("mapa_citacoes_perto", num(mapa, r"linha citada \(±7\): (\d+)"), f"{PASTA}/conferir-mapa.txt", "o guião correu", "citações conferidas" in mapa)
medida("mapa_citacoes_longe", num(mapa, r"longe da linha citada: (\d+)"), f"{PASTA}/conferir-mapa.txt", "a base tinha as mesmas", num(mb, r"longe da linha citada: (\d+)") == num(mapa, r"longe da linha citada: (\d+)"))
medida("mapa_citacoes_por_achar", num(mapa, r"mesma linha: (\d+)"), f"{PASTA}/conferir-mapa.txt", "o guião conta esta classe", "não encontrada" in mapa)
ma = ler(f"{PASTA}/conferir-mapa-antes-de-acertar.txt")
medida("mapa_citacoes_longe_antes_de_acertar", num(ma, r"longe da linha citada: (\d+)"), f"{PASTA}/conferir-mapa-antes-de-acertar.txt (o mapa novo sobre o código do bloco, antes de repor as linhas)",
       "o guião correu", "citações conferidas" in ma)
medida("mapa_citacoes_repostas", num(ma, r"longe da linha citada: (\d+)") - num(mapa, r"longe da linha citada: (\d+)"),
       "as longe antes de acertar menos as longe agora", "as longe agora são as da base", num(mb, r"longe da linha citada: (\d+)") == num(mapa, r"longe da linha citada: (\d+)"))
medida("mapa_citacoes_longe_na_base", num(mb, r"longe da linha citada: (\d+)"), f"{PASTA}/conferir-mapa-base.txt (o mapa da base sobre a árvore da base)", "o guião correu na base", "citações conferidas" in mb)
for qual in ("sitio", "motor"):
    t_ = ler(f"{PASTA}/decisoes-em-vigor-{qual}.txt")
    m = re.search(r"(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)", t_)
    medida(f"decisoes_em_vigor_{qual}", int(m.group(1)) if m else NAO, f"{PASTA}/decisoes-em-vigor-{qual}.txt",
           "o conhecido-positivo do guião passou", "conhecido-positivo" in t_)
    medida(f"decisoes_em_vigor_{qual}_ficheiros", int(m.group(2)) if m else NAO, f"{PASTA}/decisoes-em-vigor-{qual}.txt · os ficheiros de texto lidos",
           "a linha final leu-se", m is not None)
    perto, atual = [], None
    for l in t_.split("\n"):
        mm = re.match(r"^(§1\.\d+) · ", l)
        if mm:
            atual = mm.group(1)
        elif "perto do diff" in l and atual and atual not in perto:
            perto.append(atual)
    medida(f"decisoes_perto_do_diff_{qual}", len(perto), f"as decisões com uma citação «perto do diff» em {PASTA}/decisoes-em-vigor-{qual}.txt",
           "a §1.24 está entre elas (a página de cada linha)", "§1.24" in perto)
    medida(f"decisoes_perto_do_diff_{qual}_lista", sorted(perto, key=lambda x: int(x.split(".")[1])), f"a lista das mesmas, em {PASTA}/decisoes-em-vigor-{qual}.txt",
           "a lista tem o comprimento da contagem", True)
    mi_ = re.search(r"--intervalo (\S+)", ler(f"{PASTA}/decisoes-em-vigor-{qual}.comando")) if existe(f"{PASTA}/decisoes-em-vigor-{qual}.comando") else None
    medida(f"decisoes_intervalo_{qual}", mi_.group(1) if mi_ else NAO, f"{PASTA}/decisoes-em-vigor-{qual}.comando", "o comando escreveu-se ao lado", mi_ is not None)
    medida(f"decisoes_que_sairam_no_diff_{qual}", t_.count("saiu no diff"), f"as citações «saiu no diff» em {PASTA}/decisoes-em-vigor-{qual}.txt",
           "o guião escreve essa marca quando a há", "perto do diff" in t_)
if existe(f"{PASTA}/custo-rp3.json"):
    c = ler_json(f"{PASTA}/custo-rp3.json")
    medida("custo_simbolos", c["simbolos_gastos"], f"{PASTA}/custo-rp3.json (custo-rp3.py sobre o registo da sessão)", c["conhecido_positivo"]["o_que"], c["conhecido_positivo"]["encontrado"])
    medida("custo_segundos", c["segundos_entre_as_leituras"], f"{PASTA}/custo-rp3.json", "é positivo", c["segundos_entre_as_leituras"] > 0)

if existe(f"{PASTA}/fusao-de-ensaio.json"):
    fu = ler_json(f"{PASTA}/fusao-de-ensaio.json")
    medida("fusao_de_ensaio_conflitos", len(fu["conflitos"]), f"{PASTA}/fusao-de-ensaio.json (git merge-tree --write-tree --name-only main HEAD)",
           "a saída do git leu-se e nomeia os ficheiros", bool(fu["saida"]))
    medida("fusao_de_ensaio_fundidos_sem_conflito", len(fu["fundidos_sem_conflito"]), f"{PASTA}/fusao-de-ensaio.json",
           "a lista vem das linhas «Auto-merging» do git", all(isinstance(x, str) for x in fu["fundidos_sem_conflito"]))
    medida("fusao_de_ensaio_main", fu["main"], f"{PASTA}/fusao-de-ensaio.json · main (git rev-parse main)", "é um resumo de commit", len(fu["main"]) == 40)
    medida("fusao_de_ensaio_conflitos_lista", fu["conflitos"], f"{PASTA}/fusao-de-ensaio.json · conflitos", "o package.json está entre eles ou não, e a lista leu-se", isinstance(fu["conflitos"], list))
    medida("fusao_de_ensaio_fundidos_lista", fu["fundidos_sem_conflito"], f"{PASTA}/fusao-de-ensaio.json · fundidos_sem_conflito", "a lista leu-se", isinstance(fu["fundidos_sem_conflito"], list))
cabeca_codigo = cab["cabeca"]
saida = {"bloco": "RP3", "guiao": f"{PASTA}/medir-rp3.py", "cabeca_do_codigo": cabeca_codigo,
         "cabeca_do_motor": motor["cabeca_do_motor"], "base": "1c4dde2f", "medidas_escritas": len(medidas), "medidas": medidas}
with open(f"{PASTA}/medidas.json", "w", encoding="utf-8") as f:
    f.write(json.dumps(saida, ensure_ascii=False, indent=2) + "\n")
falhas = [x["nome"] for x in medidas if not x["conhecido_positivo"]["encontrado"] or x["valor"] == NAO]
print(f"medir-rp3: {len(medidas)} medidas; {len(falhas)} sem conhecido-positivo ou por ler{': ' + ', '.join(falhas) if falhas else ''}")
raise SystemExit(1 if falhas else 0)
