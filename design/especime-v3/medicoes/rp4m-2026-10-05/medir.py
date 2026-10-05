#!/usr/bin/env python3
"""RP4-m: as medidas do relatório do bloco, cada uma com o nome, o valor, o comando e um conhecido-positivo.

Uso (na raiz do sítio, depois dos portões e das capturas):
    RESEARCHHUB_DIR=<worktree do motor> python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir.py

Escreve `medidas.json` nesta pasta. Lê o sítio na árvore de trabalho e os ficheiros desta pasta (os registos das
medições que os outros guiões escreveram), e o motor pela variável `RESEARCHHUB_DIR`, que nunca se escreve aqui.
O que não conseguir ler fica «NÃO LIDO», e nunca um valor plausível. Nenhum caminho da máquina no registo.
"""
import json
import os
import re
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"]).resolve() if os.environ.get("RESEARCHHUB_DIR") else None
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


def git(raiz, *args):
    r = subprocess.run(["git", "-C", str(raiz), *args], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


# ---- o §0 do brief, reproduzido -------------------------------------------------------------
brief = ler_json(SITIO / "design/observatorio/medidas/BRIEF-RP4M.json")
repro = ler_json(AQUI / "brief-reproduzido.json")
medicao("paragrafo_0_reproduzido_igual", (brief == repro) if brief and repro else NAO,
        "OEDP_MEDIDAS_JSON=<pasta>/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-RP4M.py, comparado com BRIEF-RP4M.json",
        "a reprodução tem as dez medidas do §0", bool(repro) and len(repro.get("medidas", [])) == 10)
for m in (repro or {}).get("medidas", []):
    medicao(f"paragrafo_0.{m['nome']}", m["valor"], m["comando"], m["conhecido_positivo"]["o_que"],
            m["conhecido_positivo"]["encontrado"])

# ---- o livro do sítio --------------------------------------------------------------------------
series_dir = SITIO / "ledger/series"
no_tempo = {}
for f in sorted(series_dir.glob("*.yml")):
    t = f.read_text(encoding="utf-8")
    if re.search(r'^eixo: "periodo"', t, re.M):
        no_tempo[f.stem] = t
NOVAS = ["serie-ipc-variacao-media-12-meses", "serie-ipc-sem-habitacao-variacao-media-12-meses",
         "serie-ipc-combustiveis-variacao-homologa", "serie-ipc-rendas-variacao-homologa",
         "serie-ipc-energia-em-casa-variacao-homologa", "serie-remuneracao-bruta-mensal-media-anual",
         "serie-ipc-indice-anual", "serie-remuneracao-bruta-mensal-media-real"]


def pontos_de(texto):
    corpo = texto.split("\npontos:\n", 1)[1] if "\npontos:\n" in texto else ""
    corpo = corpo.split("\n\n", 1)[0]
    return re.findall(r'^  - periodo: "([^"]+)"\n    valor: "([^"]+)"', corpo, re.M)


medicao("series_no_tempo_no_livro", len(no_tempo), "ls ledger/series/*.yml · os ficheiros com eixo: \"periodo\"",
        "a série dos combustíveis do INE está entre elas", "serie-ipc-combustiveis-variacao-homologa" in no_tempo)
medicao("series_novas_do_bloco", sum(1 for n in NOVAS if n in no_tempo), "as oito séries do bloco em ledger/series/",
        "a derivada do salário real está entre elas", "serie-remuneracao-bruta-mensal-media-real" in no_tempo)
for n in NOVAS:
    pts = pontos_de(no_tempo.get(n, ""))
    medicao(f"pontos.{n}", len(pts) if pts else NAO, f"ledger/series/{n}.yml · os pontos da lista pontos:",
            "o primeiro e o último ponto existem", bool(pts))
    if pts:
        medicao(f"primeiro_periodo.{n}", pts[0][0], f"ledger/series/{n}.yml · o primeiro ponto", "a série tem pontos", True)
        medicao(f"ultimo_periodo.{n}", pts[-1][0], f"ledger/series/{n}.yml · o período do último ponto", "a série tem pontos", True)
        medicao(f"ultimo_valor.{n}", pts[-1][1], f"ledger/series/{n}.yml · o valor do último ponto, como o YAML o escreve", "a série tem pontos", True)
real = dict(pontos_de(no_tempo.get("serie-remuneracao-bruta-mensal-media-real", "")))
nominal = dict(pontos_de(no_tempo.get("serie-remuneracao-bruta-mensal-media-anual", "")))
medicao("salario_real_2015_igual_ao_nominal", (real.get("2015") == nominal.get("2015")) if real and nominal else NAO,
        "o ponto de 2015 da derivada e o da nominal", "os dois pontos de 2015 existem", "2015" in real and "2015" in nominal)
presas = [f.stem for f in sorted((SITIO / "ledger/claims").glob("*.yml")) if re.search(r"^serie: ", f.read_text(encoding="utf-8"), re.M)]
medicao("linhas_presas_a_uma_serie", len(presas), "grep -l '^serie: ' ledger/claims/*.yml",
        "a linha da média de doze meses do IPC está presa", "ipc-variacao-media-12-meses" in presas)
medicao("linhas_do_ipc_presas_neste_bloco", sum(1 for x in ("ipc-variacao-media-12-meses", "ipc-sem-habitacao-variacao-media-12-meses",
        "ipc-combustiveis-variacao-homologa", "ipc-rendas-variacao-homologa", "ipc-energia-em-casa-variacao-homologa") if x in presas),
        "as cinco linhas do IPC com o campo serie", "a dos combustíveis é uma delas", "ipc-combustiveis-variacao-homologa" in presas)
medicao("linha_do_ihpc_de_portugal_presa", "ihpc-variacao-homologa" in presas, "grep '^serie: ' ledger/claims/ihpc-variacao-homologa.yml",
        "a linha da União está presa (o controlo)", "ihpc-variacao-homologa-ue" in presas)

# ---- as medições escritas por outros guiões nesta pasta ------------------------------------------
item2 = ler_json(AQUI / "item2.json") or {}
medicao("item2.controlo.codigo_do_ledger_check", (item2.get("controlo") or {}).get("codigo", NAO), "node medir-item2.mjs · a cópia intacta",
        "a medição correu e escreveu item2.json", bool(item2))
medicao("item2.codigo_do_ledger_check", (item2.get("item2") or {}).get("codigo", NAO), "node medir-item2.mjs · a linha no último ponto",
        "a mesma medição na cópia intacta deu 0", (item2.get("controlo") or {}).get("codigo") == 0)
medicao("item2.erros_s5_da_faixa", len((item2.get("series_item2") or {}).get("erros", [])), "validateSeries sobre a cópia, a S5 da faixa dos 27",
        "na cópia intacta a mesma chamada dá zero erros", (item2.get("series_controlo") or {}).get("erros") == [])
medicao("item2.travessia_do_motor_codigo", (item2.get("travessia_do_motor_item2") or {}).get("codigo", NAO), "export_series.py --site <cópia>",
        "na cópia intacta a travessia dá 0", (item2.get("travessia_do_motor_controlo") or {}).get("codigo") == 0)
medicao("item2.regua_codigo", (item2.get("regua") or {}).get("codigo", NAO), "conferirReguaDeclarada sobre a cópia",
        "na cópia intacta a régua passa", (item2.get("regua_controlo") or {}).get("codigo") == 0)

i199 = ler_json(AQUI / "i199.json") or {}
medicao("i199.corrida_de_dentro_de_indicators.codigo", i199.get("codigo", NAO), "cd indicators && python3 refresh.py --site <cópia> --linhas taxa-de-emprego-2025 --saida <tmp>",
        "a corrida fez os seus pedidos pelo cliente da casa", all(p.get("cliente") == "core.http.HttpClient.condicional" for p in i199.get("pedidos", [])) and bool(i199.get("pedidos")))
medicao("i199.pedidos_da_corrida", len(i199.get("pedidos", [])), "o pedidos.jsonl da corrida delimitada", "a corrida escreveu o registo dos pedidos", bool(i199.get("pedidos")))
medicao("i199.sem_erro_de_importacao", i199.get("sem_no_module_named", NAO), "a saída da corrida não tem «No module named»",
        "a saída tem a linha da afirmação lida", any("taxa-de-emprego-2025" in l for l in i199.get("linhas_da_saida", [])))

# ---- as conferências do sítio corridas com saída em JSON, na construção da cabeça do código -------------
formas = ler_json(AQUI / "formas-rp4.json") or {}
medicao("formas.desenhos_recompostos", formas.get("desenhos", NAO), "node scripts/check-formas.mjs --json-rp4 formas-rp4.json · desenhos",
        "a corrida viu os recibos das séries", bool(formas.get("recibos")))
medicao("formas.recibos_com_grafico", len(formas.get("recibos", [])) if formas else NAO, "formas-rp4.json · recibos (língua e série)",
        "o recibo do salário real em português está entre eles", "pt:serie-remuneracao-bruta-mensal-media-real" in formas.get("recibos", []))
medicao("formas.provas_do_modulo", len(formas.get("provas", [])) if formas else NAO, "formas-rp4.json · provas",
        "a prova da marca do último ano está entre elas", any("último ano" in x.get("nome", "") for x in formas.get("provas", [])))
medicao("formas.plantas", len(formas.get("plantas", [])) if formas else NAO, "formas-rp4.json · plantas", "há plantas", bool(formas.get("plantas")))
medicao("formas.plantas_mordidas", sum(1 for x in formas.get("plantas", []) if x.get("mordeu")) if formas else NAO, "formas-rp4.json · plantas com mordeu",
        "há plantas", bool(formas.get("plantas")))
medicao("formas.plantas_da_regra_da_pagina", sum(1 for x in formas.get("plantas", []) if x.get("regra") == "página") if formas else NAO,
        "formas-rp4.json · plantas com regra página", "a do recibo com o gráfico de outra série está entre elas",
        any(x.get("regra") == "página" and "outra série" in x.get("nome", "") for x in formas.get("plantas", [])))
medicao("formas.erros", len(formas.get("erros", [])) if formas else NAO, "formas-rp4.json · erros", "a corrida escreveu o ficheiro", bool(formas))

series_j = ler_json(AQUI / "series.json") or {}
contas_s = series_j.get("contas") or {}
for k in ("series", "pontos", "derivadas", "pontosRefeitos", "linhasPresas", "cartoesNoUltimo", "recibos"):
    medicao(f"check_series.{k}", contas_s.get(k, NAO), f"RESEARCHHUB_DIR=<motor> node tests/series/series.mjs --prova --json series.json · contas.{k}",
            "a corrida leu as séries do livro", bool(contas_s.get("series")))
medicao("check_series.metade_do_motor_pontos", (contas_s.get("motor") or {}).get("pontos", NAO), "series.json · contas.motor.pontos (cada ponto lido no corpo alojado)",
        "a metade do motor correu", (contas_s.get("motor") or {}).get("correu") is True)
medicao("check_series.plantas", len(series_j.get("plantas", [])) if series_j else NAO, "series.json · plantas", "há plantas", bool(series_j.get("plantas")))
medicao("check_series.plantas_mordidas", sum(1 for x in series_j.get("plantas", []) if x.get("mordeu")) if series_j else NAO, "series.json · plantas com mordeu",
        "há plantas", bool(series_j.get("plantas")))
medicao("check_series.plantas_do_bloco", sum(1 for x in series_j.get("plantas", []) if "RP4-m" in x.get("nome", "")) if series_j else NAO,
        "series.json · plantas com RP4-m no nome", "a da legenda trocada está entre elas",
        any("legenda" in x.get("nome", "") and "RP4-m" in x.get("nome", "") for x in series_j.get("plantas", [])))
medicao("check_series.erros", sum(len(v) for v in (series_j.get("erros") or {}).values()) if series_j else NAO, "series.json · erros, somados por célula",
        "a corrida escreveu o ficheiro", bool(series_j))

lingua = ler_json(AQUI / "plantas-da-lingua.json") or {}
medicao("lingua.controlo_integro", lingua.get("controlo_integro", NAO), "node plantas-da-lingua.mjs · o controlo na cópia intacta",
        "a corrida escreveu as plantas", bool(lingua.get("plantas")))
medicao("lingua.plantas_mordidas", lingua.get("plantas_mordidas", NAO), "node plantas-da-lingua.mjs · plantas_mordidas",
        "a planta da entrada morta está entre elas", any("entrada" in x.get("nome", "") for x in lingua.get("plantas", [])))

cap = ler_json(AQUI / "capturas.json") or {}
medicao("capturas", cap.get("capturas", NAO), "node design/especime-v3/medicoes/rp4m-2026-10-05/capturar.mjs",
        "as plantas visuais morderam", bool(cap.get("plantas")) and all(p.get("mordeu") for p in cap.get("plantas", [])))
medicao("capturas_erros", len(cap.get("erros", [])) if cap else NAO, "o campo erros de capturas.json", "o guião correu", bool(cap))
medicao("capturas_plantas", len(cap.get("plantas", [])) if cap else NAO, "o campo plantas de capturas.json", "o guião correu", bool(cap))
medicao("capturas_plantas_mordidas", sum(1 for p in cap.get("plantas", []) if p.get("mordeu")) if cap else NAO,
        "as plantas de capturas.json com mordeu", "há plantas", bool(cap.get("plantas")))
medicao("capturas_transbordos", sum(1 for c in cap.get("lista", []) if c.get("pagina") and c["pagina"] > c["largura"]) if cap else NAO,
        "as capturas de página com a largura da página maior do que a do ecrã", "as capturas de página têm a largura medida",
        any(c.get("pagina") for c in cap.get("lista", [])))
letras = [c["letraMinima"] for c in cap.get("lista", []) if c.get("letraMinima")]
medicao("capturas_letra_minima_dos_eixos", min(letras) if letras else NAO, "o mínimo de letraMinima em capturas.json (px no ecrã)",
        "há desenhos medidos", bool(letras))
letrasM = [c["letraMaxima"] for c in cap.get("lista", []) if c.get("letraMaxima")]
medicao("capturas_letra_maxima_dos_eixos", max(letrasM) if letrasM else NAO, "o máximo de letraMaxima em capturas.json (px no ecrã)",
        "há desenhos medidos", bool(letrasM))

# ---- o motor ---------------------------------------------------------------------------------------
if MOTOR:
    for nome, pasta in (("ensaio_21", "ensaio-do-corredor-das-series"), ("ensaio_24", "ensaio-do-corredor-das-series-24")):
        rel = ler_json(MOTOR / "indicators/out/rp4m-2026-10-05" / pasta / "corredor.json")
        pedidos = (MOTOR / "indicators/out/rp4m-2026-10-05" / pasta / "pedidos.jsonl")
        n = len(pedidos.read_text(encoding="utf-8").splitlines()) if pedidos.is_file() else NAO
        medicao(f"corredor.{nome}.series", len((rel or {}).get("series", {})) or NAO, f"indicators/out/rp4m-2026-10-05/{pasta}/corredor.json no motor",
                "o relatório diz o modo ensaio", (rel or {}).get("modo") == "ensaio")
        medicao(f"corredor.{nome}.pedidos", n, f"indicators/out/rp4m-2026-10-05/{pasta}/pedidos.jsonl no motor", "o registo existe", pedidos.is_file())
        medicao(f"corredor.{nome}.pontos_novos", (rel or {}).get("pontos_novos", NAO), "o campo pontos_novos do relatório", "o relatório leu-se", bool(rel))
        medicao(f"corredor.{nome}.revisoes", (rel or {}).get("revisoes", NAO), "o campo revisoes do relatório", "o relatório leu-se", bool(rel))
    pedidos_bloco = MOTOR / "indicators/out/rp4m-2026-10-05/pedidos.jsonl"
    linhas = [json.loads(x) for x in pedidos_bloco.read_text(encoding="utf-8").splitlines()] if pedidos_bloco.is_file() else []
    medicao("pedidos_do_bloco", len(linhas) or NAO, "indicators/out/rp4m-2026-10-05/pedidos.jsonl no motor", "há pedidos lidos", any(x["estado"] == "lido" for x in linhas))
    medicao("pedidos_do_bloco_lidos", sum(1 for x in linhas if x["estado"] == "lido"), "as tentativas com estado lido", "há pelo menos uma", bool(linhas))
    medicao("pedidos_do_bloco_recusados_414", sum(1 for x in linhas if x["estado"] == "recusado" and x["http"] == 414), "as tentativas recusadas com 414",
            "a do pedido inteiro dos combustíveis é uma delas", any(x["nome"] == "ine-serie-ipc-combustiveis-variacao-homologa.json" and x["http"] == 414 for x in linhas))
    alojados = list((MOTOR / "content/13 Dominios/source/rp4m").glob("*"))
    medicao("corpos_alojados_em_rp4m", len(alojados), "ls content/13 Dominios/source/rp4m/ no motor", "a metainformação do 0014647 está lá", any(p.name.endswith("ine-0014647-meta.json") for p in alojados))
    for codigo in ("0011131", "0011132", "0011137", "0011138", "0014641"):
        f = next(iter(sorted((MOTOR / "indicators/out/rp4m-2026-10-05").glob(f"*-ine-{codigo}-meta.json"))), None)
        d = json.loads(f.read_text(encoding="utf-8"))[0] if f else {}
        medicao(f"metainformacao.{codigo}", f"{d.get('Periodic')} · {d.get('PrimeiroPeriodo')} a {d.get('UltimoPeriodo')}" if d else NAO,
                f"indicators/out/rp4m-2026-10-05/*-ine-{codigo}-meta.json no motor (Periodic, PrimeiroPeriodo, UltimoPeriodo)",
                "o indicador da metainformação é o pedido", d.get("IndicadorCod") == codigo)
    i198 = ler_json(MOTOR / "indicators/out/rp4m-2026-10-05/i198.json") or {}
    medicao("i198.frases_trocadas", i198.get("frases_trocadas", NAO), "python3 indicators/out/rp4m-2026-10-05/medir-i198.py <sítio> · i198.json no motor",
            "a origem ficou reposta", i198.get("origem_reposta") is True)
    medicao("i198.codigo_com_a_mudanca", (i198.get("corrida_com_a_mudanca") or {}).get("codigo", NAO), "o exportador da agenda sobre uma cópia do destino",
            "sem a mudança o exportador dá 0", (i198.get("corrida_de_controlo_sem_a_mudanca") or {}).get("codigo") == 0)
    medicao("i198.itens_recusados_pela_h4", sum(1 for l in (i198.get("corrida_com_a_mudanca") or {}).get("recusas", []) if "(H4)" in l),
            "as linhas «(H4)» da recusa", "a recusa traz a frase da H4", any("A past entry was rewritten" in l for l in (i198.get("corrida_com_a_mudanca") or {}).get("recusas", [])))
    porconfirmar = git(MOTOR, "status", "--porcelain", "--", "indicators/canary_baseline.json", "indicators/heartbeat.json",
                       "indicators/refresh_report.json", "indicators/vintages.json", ".maintenance-locks", "sweeps",
                       "publisher/recortes/manifest.regioes.json")
    medicao("ficheiros_por_confirmar_do_motor_mexidos", len([l for l in (porconfirmar or "").splitlines() if l.strip()]) if porconfirmar is not None else NAO,
            "git status --porcelain sobre os ficheiros por confirmar do motor", "o git respondeu", porconfirmar is not None)
    portao = ler_json(AQUI / "portao-do-motor.json") or {}
    medicao("portao_do_motor.codigo", portao.get("codigo", NAO), "python3 -m core.gate na cabeça do motor (portao-do-motor.json)",
            "o portão correu as suítes do bloco", all(s in portao.get("suites_ok", []) for s in ("dominios_series_test", "dominios_series_corredor_test", "refresh_guiao_solto_test")))
    for k in ("dominios_series_test", "dominios_series_corredor_test", "refresh_guiao_solto_test", "reconcile_test"):
        medicao(f"suite.{k}", (portao.get("contas") or {}).get(k, NAO), f"python3 -m publisher/indicators/core.{k} (a linha PASS)",
                "a suíte está no portão", k in portao.get("suites_ok", []))
    for k in ("dominios_series_test", "dominios_series_corredor_test"):
        medicao(f"plantas_mordidas.{k}", (portao.get("plantas_mordidas") or {}).get(k, NAO), f"python3 -m publisher.{k} (a linha «plantas: N morderam»)",
                "a suíte passou na mesma corrida", (portao.get("contas") or {}).get(k) is not None)
    medicao("portao_do_motor.suites_ok", portao.get("suites_ok_quantas", NAO), "as linhas «GATE <suíte> ok» do registo do portão do motor",
            "a suíte do corredor das séries está entre elas", "dominios_series_corredor_test" in portao.get("suites_ok", []))

# ---- os portões do sítio ---------------------------------------------------------------------------
P = AQUI / "portoes"
from datetime import datetime


def instante(f):
    return datetime.strptime(f.read_text().strip(), "%Y-%m-%dT%H:%M:%SZ") if f.is_file() else None


for g in ("build", "verify", "typecheck"):
    c = (P / f"{g}.codigo")
    medicao(f"portao.{g}", int(c.read_text().strip()) if c.is_file() else NAO, f"sh scripts/leituras/portoes.sh <worktree> <pasta> · {g}.codigo",
            "a cabeça da corrida está escrita", (P / "cabeca").is_file())
    i, f = instante(P / f"{g}.inicio"), instante(P / f"{g}.fim")
    medicao(f"portao.{g}.segundos", int((f - i).total_seconds()) if i and f else NAO, f"{g}.fim menos {g}.inicio (resolução de um segundo)",
            "o fim não é anterior ao início", bool(i and f and f >= i))
cab, cabf = (P / "cabeca"), (P / "cabeca.fim")
medicao("portao.cabeca_igual_no_fim", (cab.read_text().strip() == cabf.read_text().strip()) if cab.is_file() and cabf.is_file() else NAO,
        "portoes/cabeca e portoes/cabeca.fim", "as duas cabeças estão escritas", cab.is_file() and cabf.is_file())
est = P / "estado.fim"
# O que pode estar fora dos commits no fim da corrida: as duas pastas das provas, que entram no último commit, e a
# ligação da worktree às dependências (`node_modules`, uma ligação simbólica que o padrão `node_modules/` do
# .gitignore não apanha, por ser um ficheiro para o Git); nenhum ficheiro seguido mudado.
ADMITIDOS = ("design/especime-v3/medicoes/rp4m-2026-10-05/", "design/especime-v3/capturas/rp4m-2026-10-05/", "node_modules")
linhas_est = [l for l in est.read_text().splitlines() if l.strip()] if est.is_file() else []
medicao("portao.estado_no_fim_so_com_as_provas_por_juntar",
        all(l.startswith("?? ") and l[3:].startswith(ADMITIDOS) for l in linhas_est) if est.is_file() else NAO,
        "portoes/estado.fim (git status --short no fim da corrida): só as pastas das provas e a ligação das dependências, por seguir",
        "o ficheiro foi escrito", est.is_file())
medicao("portao.ficheiros_seguidos_mudados_no_fim", sum(1 for l in linhas_est if not l.startswith("?? ")) if est.is_file() else NAO,
        "as linhas de portoes/estado.fim que não são «??»", "o ficheiro foi escrito", est.is_file())
custo = ler_json(AQUI / "custo.json") or {}
for k in ("segundos", "respostas_do_modelo", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo"):
    medicao(f"custo.{k}", custo.get(k, NAO), "python3 custo.py <registo da sessão do construtor> · custo.json",
            "o registo lido é o desta sessão (todas as respostas do Claude Opus 5.5)", set((custo.get("modelos") or {}).keys()) == {"claude-opus-5-5"})

# ---- o cruzamento contra o motor e o conferidor do mapa, corridos aqui -----------------------------------------
if MOTOR:
    r = subprocess.run(["node", "scripts/check-cruzamento.mjs", "--with-origin"], cwd=str(SITIO), capture_output=True, text=True,
                       env={**os.environ, "RESEARCHHUB_DIR": str(MOTOR)})
    saida_c = re.sub(r"\x1b\[[0-9;]*m", "", r.stdout + r.stderr)
    medicao("cruzamento_com_a_origem.codigo", r.returncode, "RESEARCHHUB_DIR=<motor> node scripts/check-cruzamento.mjs --with-origin",
            "a corrida conferiu o lado do motor", "são ainda o que o motor tem" in saida_c)
import tempfile
MAPA = SITIO / "design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md"
r = subprocess.run(["python3", "scripts/leituras/conferir-mapa.py", str(MAPA)], cwd=str(SITIO), capture_output=True, text=True)
contagem = lambda texto, frase: int(m.group(1)) if (m := re.search(re.escape(frase) + r"\D*(\d+)", texto)) else NAO
linha_prova = next((l for l in MAPA.read_text(encoding="utf-8").splitlines() if "src/lib/formas/serie-do-pais.mjs:" in l and "ÚLTIMO ANO ANCORA-SE" in l), None)
achou = False
if linha_prova:
    n = int(re.search(r"src/lib/formas/serie-do-pais\.mjs:(\d+)", linha_prova).group(1))
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as tmp:
        tmp.write(linha_prova.replace(f"serie-do-pais.mjs:{n}", f"serie-do-pais.mjs:{n - 60}") + "\n")
    rp = subprocess.run(["python3", "scripts/leituras/conferir-mapa.py", tmp.name], cwd=str(SITIO), capture_output=True, text=True)
    os.unlink(tmp.name)
    achou = contagem(rp.stdout, "citação está no ficheiro, mas longe da linha citada:") == 1
for chave, frase in (("na_linha", "citações conferidas na linha citada (±7):"), ("longe", "citação está no ficheiro, mas longe da linha citada:"),
                     ("por_encontrar", "citação não encontrada em nenhum dos ficheiros citados na mesma linha:"), ("para_la_do_fim", "linha citada para lá do fim do ficheiro:")):
    medicao(f"mapa.{chave}", contagem(r.stdout, frase), "python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md",
            "uma citação do bloco com a linha deslocada sessenta linhas para trás, num mapa de prova, sai como longe", achou)

# ---- a terceira fusão com main: as linhas que tirou do portão de HTML ----------------------------------------
d = git(SITIO, "diff", "-U0", "3a253f73", "40f0cb58", "--", "scripts/gate-html.mjs") or ""
tiradas = sum(int(m.group(2) or 1) - int(m.group(4) or 1) for m in re.finditer(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@", d, re.M))
medicao("fusao_com_40f0cb58.linhas_tiradas_do_portao_de_html", tiradas if d else NAO, "git diff -U0 3a253f73 40f0cb58 -- scripts/gate-html.mjs (as linhas tiradas menos as postas, somadas pelos cabeçalhos dos pedaços)",
        "o diff tem o pedaço da conferência do Sobre retirada", "-5261," in d)

# ---- as cabeças e o estado das duas árvores no momento da medição (M50) ------------------------------------
for nome, raiz in (("sitio", SITIO), ("motor", MOTOR)):
    if raiz is None:
        continue
    cab = (git(raiz, "rev-parse", "HEAD") or "").strip()
    est = git(raiz, "status", "--porcelain", "--untracked-files=no")
    medicao(f"{nome}.cabeca", cab or NAO, "git rev-parse HEAD", "a cabeça é um resumo de quarenta caracteres", len(cab) == 40)
    medicao(f"{nome}.estado_dos_seguidos", est if est is not None else NAO, "git status --porcelain --untracked-files=no (vazio quer dizer nada seguido por juntar)",
            "o git respondeu", est is not None)

# ---- a passagem RP4-m-b (05.10.2026), depois da leitura a frio do Codex ---------------------------------------
# Os cenários dos achados 4 e 5, corridos por `medir-rp4mb-motor.py` na cabeça que a leitura leu (antes) e na cabeça
# final do motor (depois).
for etiqueta in ("antes", "depois"):
    r = ler_json(AQUI / f"rp4mb-motor-{etiqueta}.json") or {}
    a4, a5 = (r.get("achado_4") or {}).get("segunda_corrida") or {}, r.get("achado_5") or {}
    comando = f"RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-motor.py {etiqueta}"
    medicao(f"rp4mb.{etiqueta}.motor_cabeca", r.get("motor_cabeca") or NAO, comando + " · motor_cabeca",
            "a árvore do motor estava limpa nos seguidos", r.get("motor_estado_dos_seguidos") == "")
    primeira = ((r.get("achado_4") or {}).get("primeira_corrida") or {})
    medicao(f"rp4mb.{etiqueta}.achado4.primeira_corrida_revisoes", primeira.get("revisoes", NAO), comando + " · achado_4.primeira_corrida.revisoes",
            "a primeira corrida reviu a pensão de 2020 e um mês das rendas", (primeira.get("revistos") or {}).get("serie-pensao-media-anual") == ["2020"])
    medicao(f"rp4mb.{etiqueta}.achado4.excecao", a4.get("excecao") or "nenhuma", comando + " · achado_4.segunda_corrida.excecao",
            "a segunda corrida correu (com exceção ou com relatório)", bool(a4))
    if a4.get("excecao"):
        medicao(f"rp4mb.{etiqueta}.achado4.mensagem_diz_a_revisao_mais_recente", "a revisão mais recente de 2020" in (a4.get("mensagem") or ""),
                comando + " · achado_4.segunda_corrida.mensagem", "a mensagem foi registada", bool(a4.get("mensagem")))
    else:
        medicao(f"rp4mb.{etiqueta}.achado4.revisoes", a4.get("revisoes", NAO), comando + " · achado_4.segunda_corrida.revisoes",
                "o relatório da segunda corrida tem as duas séries", set((a4.get("revistos") or {})) == {"serie-pensao-media-anual", "serie-ihpc-rendas-variacao-homologa"})
        medicao(f"rp4mb.{etiqueta}.achado4.recusas", len(a4.get("recusas") or []), comando + " · achado_4.segunda_corrida.recusas",
                "o relatório foi lido", "recusas" in a4)
        for s, rotulo in (("serie-pensao-media-anual", "pensao"), ("serie-ihpc-rendas-variacao-homologa", "rendas")):
            seg = ((a4.get("segunda_revisao") or {}).get(s) or [[None, None, None]])[0]
            prim = (((r.get("achado_4") or {}).get("primeira_revisao") or {}).get(s) or [[None, None, None]])[0]
            medicao(f"rp4mb.{etiqueta}.achado4.segunda_revisao_{rotulo}", f"{seg[0]} → {seg[1]} · {seg[2]}", comando + f" · achado_4.segunda_corrida.segunda_revisao.{s}",
                    "o valor antigo da segunda revisão é o novo da primeira", seg[0] is not None and seg[0] == prim[1])
    ens, esc = a5.get("ensaio") or {}, a5.get("escrita") or {}
    medicao(f"rp4mb.{etiqueta}.achado5.linha", ens.get("linha") or NAO, comando + " · achado_5.ensaio.linha (a linha do fim do main() do corredor)",
            "o main() correu e escreveu a linha", bool(ens.get("linha")))
    medicao(f"rp4mb.{etiqueta}.achado5.codigo_do_main", ens.get("codigo_do_main", NAO), comando + " · achado_5.ensaio.codigo_do_main",
            "o main() correu e escreveu a linha", bool(ens.get("linha")))
    medicao(f"rp4mb.{etiqueta}.achado5.recusas", len(ens.get("recusas") or []), comando + " · achado_5.ensaio.recusas",
            "o relatório do ensaio foi lido", "recusas" in ens)
    medicao(f"rp4mb.{etiqueta}.achado5.pasta_da_pensao", ens.get("pasta_da_pensao") or NAO, comando + " · achado_5.ensaio.pasta_da_pensao",
            "a pensão foi construída", bool(ens.get("pasta_da_pensao")))
    for k in ("alojou_a_pasta_do_dia", "series_periodo_igual", "escreveu_as_revisoes"):
        medicao(f"rp4mb.{etiqueta}.achado5.escrita.{k}", esc.get(k, NAO), comando + f" · achado_5.escrita.{k}",
                "a escrita correu (com exceção ou sem ela)", "excecao" in esc)
    medicao(f"rp4mb.{etiqueta}.achado5.escrita.excecao", esc.get("excecao") or "nenhuma", comando + " · achado_5.escrita.excecao",
            "a escrita correu (com exceção ou sem ela)", "excecao" in esc)

# O portão do motor na cabeça final do motor, e as suítes do bloco corridas de novo nessa cabeça.
pm = ler_json(AQUI / "portao-do-motor-rp4mb.json") or {}
medicao("rp4mb.portao_do_motor.cabeca", pm.get("cabeca") or NAO, "python3 portao-do-motor.py <pasta> motor <motor> rp4mb · cabeca",
        "a árvore estava limpa antes do portão", pm.get("estado_antes") == "")
medicao("rp4mb.portao_do_motor.codigo", pm.get("codigo", NAO), "python3 -m core.gate na cabeça final do motor, com o código lido de ficheiro (portao-do-motor-rp4mb.json)",
        "a última linha do registo é GATE: PASS", pm.get("ultima_linha") == "GATE: PASS")
medicao("rp4mb.portao_do_motor.suites_ok", pm.get("suites_ok_quantas", NAO), "as linhas «GATE <suíte> ok» do registo do portão",
        "a suíte do corredor das séries está entre elas", "dominios_series_corredor_test" in pm.get("suites_ok", []))
for k in ("dominios_series_test", "dominios_series_corredor_test", "refresh_guiao_solto_test", "reconcile_test"):
    medicao(f"rp4mb.suite.{k}", (pm.get("contas") or {}).get(k, NAO), f"python3 -m <módulo> na cabeça final do motor · a linha PASS de {k}",
            "a suíte saiu com o código 0, lido de ficheiro", (pm.get("codigos_das_suites") or {}).get(k) == 0)
for k in ("dominios_series_test", "dominios_series_corredor_test"):
    medicao(f"rp4mb.plantas_mordidas.{k}", (pm.get("plantas_mordidas") or {}).get(k, NAO), f"a linha «plantas: N morderam» de {k}",
            "a suíte passou na mesma corrida", (pm.get("contas") or {}).get(k) is not None)
i0, i1 = pm.get("inicio"), pm.get("fim")
medicao("rp4mb.portao_do_motor.segundos", int((datetime.strptime(i1, "%Y-%m-%dT%H:%M:%SZ") - datetime.strptime(i0, "%Y-%m-%dT%H:%M:%SZ")).total_seconds()) if i0 and i1 else NAO,
        "motor.fim menos motor.inicio da corrida do portão (resolução de um segundo)", "as duas horas estão escritas", bool(i0 and i1))
pb = ler_json(AQUI / "portao-do-motor.json") or {}
medicao("rp4mb.portao_do_motor_do_bloco.segundos", int((datetime.strptime(pb["fim"], "%Y-%m-%dT%H:%M:%SZ") - datetime.strptime(pb["inicio"], "%Y-%m-%dT%H:%M:%SZ")).total_seconds()) if pb.get("inicio") and pb.get("fim") else NAO,
        "portao-do-motor.json (o do bloco RP4-m, na cabeça a64ff623): fim menos inicio", "as duas horas estão escritas", bool(pb.get("inicio") and pb.get("fim")))

# O ficheiro trancado do motor (o ponto 4), contado por um comando só, com o conhecido-positivo do ficheiro de 38457b2.
if MOTOR:
    def pinos(texto):
        return [l.split("==")[0] for l in texto.splitlines() if re.match(r"^[A-Za-z0-9_.-]+==", l)]
    canon = lambda n: re.sub(r"[-_.]+", "-", n).lower()                                      # noqa: E731
    lock_txt = (MOTOR / "requirements.lock.txt").read_text(encoding="utf-8")
    antigo_txt = git(MOTOR, "show", "38457b2:requirements.lock.txt") or ""
    lock, antigo = pinos(lock_txt), pinos(antigo_txt)
    decl = [re.split(r"[<>=!~;\[ ]", l.strip())[0] for l in (MOTOR / "requirements.txt").read_text(encoding="utf-8").splitlines()
            if l.strip() and not l.lstrip().startswith("#")]
    CMD_LOCK = ("os pinos são as linhas «nome==versão» do requirements.lock.txt; os declarados, as linhas do requirements.txt "
                "que não são comentário nem vazias; as dependências, a diferença")
    medicao("rp4mb.lock.pinos", len(lock), CMD_LOCK, "o mesmo contador dá 40 no ficheiro de 38457b2", len(antigo) == 40)
    medicao("rp4mb.lock.declarados", len(decl), CMD_LOCK, "o xlrd é um dos declarados", "xlrd" in decl)
    medicao("rp4mb.lock.declarados_fora_do_ficheiro_trancado", len([d for d in decl if canon(d) not in {canon(n) for n in lock}]), CMD_LOCK,
            "o contador vê os declarados no ficheiro trancado", bool(decl) and canon(decl[0]) in {canon(n) for n in lock})
    medicao("rp4mb.lock.dependencias", len(lock) - len(decl), CMD_LOCK, "o ficheiro tem pinos", bool(lock))
    medicao("rp4mb.lock.ordem_do_pip_freeze", lock == sorted(lock, key=str.lower),
            "os nomes pela ordem de sorted(key=str.lower), a chave da linha 146 de pip/_internal/operations/freeze.py (pip 25.2)",
            "a ordem do ficheiro de 38457b2, escrito pelo pip freeze, é a mesma", antigo == sorted(antigo, key=str.lower))
    medicao("rp4mb.lock.ultimo_pino", lock[-1] if lock else NAO, "o último pino do ficheiro", "o ficheiro tem pinos", bool(lock))
    d_lock = git(MOTOR, "diff", "-U0", "38457b2", "HEAD", "--", "requirements.lock.txt") or ""
    medicao("rp4mb.lock.linhas_tiradas_contra_38457b2", sum(1 for l in d_lock.splitlines() if l.startswith("-") and not l.startswith("---")),
            "git diff -U0 38457b2 HEAD -- requirements.lock.txt · as linhas «-»", "o diff tem a linha do xlrd", "+xlrd==2.0.2" in d_lock)
    medicao("rp4mb.lock.linhas_postas_contra_38457b2", sum(1 for l in d_lock.splitlines() if l.startswith("+") and not l.startswith("+++")),
            "git diff -U0 38457b2 HEAD -- requirements.lock.txt · as linhas «+»", "o diff tem a linha do xlrd", "+xlrd==2.0.2" in d_lock)

pipj = ler_json(AQUI / "rp4mb-pip.json") or {}
CMD_PIP = "python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-pip.py"
medicao("rp4mb.pip.versao", (pipj.get("pip") or {}).get("versao") or NAO, CMD_PIP + " · pip.versao", "a linha da ordem foi achada uma vez pelo texto", (pipj.get("pip") or {}).get("linhas_achadas") == 1)
medicao("rp4mb.pip.linha_da_ordem", (pipj.get("pip") or {}).get("linha_da_ordem") or NAO, CMD_PIP + " · pip.linha_da_ordem (pip/_internal/operations/freeze.py)",
        "o texto da linha ordena por name.lower()", "key=lambda x: x.name.lower()" in ((pipj.get("pip") or {}).get("texto") or ""))
medicao("rp4mb.xlrd.instalado", pipj.get("xlrd_instalado") or NAO, CMD_PIP + " · xlrd_instalado (importlib.metadata)", "o ficheiro foi escrito", bool(pipj))
medicao("rp4mb.xlrd.pypi_http", (pipj.get("pypi") or {}).get("http") or NAO, CMD_PIP + " · pypi.http (curl, https://pypi.org/pypi/xlrd/2.0.2/json)",
        "a resposta tem resumo e hora", bool((pipj.get("pypi") or {}).get("sha256")) and bool((pipj.get("pypi") or {}).get("hora")))
medicao("rp4mb.xlrd.pypi_versao", (pipj.get("pypi") or {}).get("versao") or NAO, CMD_PIP + " · pypi.versao", "a resposta tem ficheiros publicados", bool((pipj.get("pypi") or {}).get("ficheiros")))
medicao("rp4mb.xlrd.pypi_ficheiros", len((pipj.get("pypi") or {}).get("ficheiros") or []) if pipj else NAO, CMD_PIP + " · pypi.ficheiros", "o nome da resposta é xlrd", (pipj.get("pypi") or {}).get("nome") == "xlrd")

# A frase da conta (o ponto 5): a segunda metade fora do código e das páginas, e a primeira em cada recibo de uma derivada.
METADES_TIRADAS = (", e a conta refaz-se em cada construção do sítio", ", and the calculation is redone at every build of the site")
fontes = [f for f in (SITIO / "src").rglob("*") if f.is_file() and f.suffix in (".mjs", ".astro", ".js", ".ts", ".json")]
medicao("rp4mb.frase.metade_tirada_no_codigo", sum(f.read_text(encoding="utf-8", errors="replace").count(m) for f in fontes for m in METADES_TIRADAS),
        "as duas metades tiradas, contadas nos ficheiros de src/", "o mesmo contador dá 4 no strings.mjs da cabeça 1a186832",
        sum((git(SITIO, "show", "1a186832:src/i18n/strings.mjs") or "").count(m) for m in METADES_TIRADAS) == 4)
r = subprocess.run(["node", "--input-type=module", "-e",
                    "import { STRINGS } from './src/i18n/strings.mjs'; const k = ['derivadaFrase','derivadaFraseVarias','origensK','indiceAntes','indiceValia','indiceAcima','indiceAbaixo','indiceIgual','indexadaAntes','indexadaDepois']; console.log(JSON.stringify(Object.fromEntries(k.map((c) => [c, [STRINGS.pt.livro.serieNoTempo[c], STRINGS.en.livro.serieNoTempo[c]]]))));"],
                   cwd=str(SITIO), capture_output=True, text=True)
cadeias = json.loads(r.stdout) if r.returncode == 0 else {}
versao = ler_json(SITIO / "dist/version.json") or {}
medicao("rp4mb.dist.commit", versao.get("commit") or NAO, "dist/version.json · commit (a construção sobre que se mediu)",
        "a construção é de uma cabeça que já tem as frases novas", bool(cadeias) and (git(SITIO, "show", f"{versao.get('commit')}:src/i18n/strings.mjs") or "").count(cadeias.get("derivadaFrase", ["\0"])[0]) == 1)
# A frase nas páginas construídas, contada por `medir-rp4mb-dist.py` antes (a construção da 1a186832, onde a metade
# tirada ainda está: o conhecido-positivo do detetor) e depois (a construção da cabeça do código da passagem).
da, dd = ler_json(AQUI / "rp4mb-dist-antes.json") or {}, ler_json(AQUI / "rp4mb-dist-depois.json") or {}
for etiqueta, dj in (("antes", da), ("depois", dd)):
    comando = f"python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-dist.py {etiqueta}"
    medicao(f"rp4mb.dist.{etiqueta}.commit", dj.get("dist_commit") or NAO, comando + " · dist_commit", "o ficheiro foi escrito", bool(dj))
    medicao(f"rp4mb.dist.{etiqueta}.paginas_lidas", dj.get("paginas_lidas", NAO), comando + " · paginas_lidas", "há páginas", bool(dj.get("paginas_lidas")))
    medicao(f"rp4mb.dist.{etiqueta}.paginas_com_a_frase_nova", len(dj.get("paginas_com_a_frase_nova", [])) if dj else NAO, comando + " · paginas_com_a_frase_nova",
            "o mesmo laço conta a metade tirada nas 4 páginas da construção de antes", len(da.get("paginas_com_a_metade_tirada", [])) == 4)
    medicao(f"rp4mb.dist.{etiqueta}.paginas_com_a_metade_tirada", len(dj.get("paginas_com_a_metade_tirada", [])) if dj else NAO, comando + " · paginas_com_a_metade_tirada",
            "o mesmo laço conta a metade tirada nas 4 páginas da construção de antes", len(da.get("paginas_com_a_metade_tirada", [])) == 4)
medicao("rp4mb.dist.depois_e_a_construcao_das_conferencias", (dd.get("dist_commit") == versao.get("commit")) if dd else NAO,
        "o commit de rp4mb-dist-depois.json e o do dist/version.json desta medição", "os dois ficheiros foram lidos", bool(dd) and bool(versao))
medicao("rp4mb.dist.as_paginas_com_a_frase_sao_as_da_metade_de_antes",
        sorted(dd.get("paginas_com_a_frase_nova", [])) == sorted(da.get("paginas_com_a_metade_tirada", [])) if dd and da else NAO,
        "as páginas com a frase nova depois são as que tinham a metade tirada antes",
        "o recibo do salário real em português está entre elas", "livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html" in dd.get("paginas_com_a_frase_nova", []))

# As conferências do sítio que a mudança toca, cada uma com o código lido do seu ficheiro, na construção da cabeça do código.
CONF = AQUI / "rp4mb-conferencias"
cab_conf = (CONF / "cabeca").read_text().strip() if (CONF / "cabeca").is_file() else None
medicao("rp4mb.conferencias.cabeca", cab_conf or NAO, "rp4mb-conferencias/cabeca (git rev-parse HEAD antes da construção)",
        "a construção das conferências é dessa cabeça", cab_conf is not None and versao.get("commit") == cab_conf)
est_conf = (CONF / "estado").read_text() if (CONF / "estado").is_file() else None
medicao("rp4mb.conferencias.codigo_todo_junto", (est_conf.strip() == "") if est_conf is not None else NAO,
        "rp4mb-conferencias/estado (git status dos ficheiros seguidos fora da pasta das provas, antes da construção)",
        "o ficheiro foi escrito pela corrida", est_conf is not None)
for nome in ("astro-build", "stamp-version", "cartoes", "gate-html", "check-voz", "check-lingua", "check-rotulos", "check-series", "capturas"):
    c = CONF / f"{nome}.codigo"
    medicao(f"rp4mb.conferencias.{nome}", int(c.read_text().strip()) if c.is_file() else NAO, f"rp4mb-conferencias/{nome}.codigo (escrito depois de o processo acabar)",
            "o registo da corrida existe e não está vazio", (CONF / f"{nome}.log").is_file() and (CONF / f"{nome}.log").stat().st_size > 0)

# O CHAVES-EN.md: cada célula da secção da passagem é a cadeia do strings.mjs da sua edição.
chaves_md = (SITIO / "design/especime-v3/CHAVES-EN.md").read_text(encoding="utf-8")
seccao = chaves_md.split("## RP4-m e RP4-m-b", 1)[1] if "## RP4-m e RP4-m-b" in chaves_md else ""
linhas_ch = re.findall(r"^\| `livro\.serieNoTempo\.(\w+)` \| «(.*?)» \| «(.*?)» \|", seccao, re.M)
medicao("rp4mb.chaves_en.linhas", len(linhas_ch), "as linhas da secção «RP4-m e RP4-m-b» do CHAVES-EN.md",
        "a linha da derivadaFraseVarias está entre elas", any(k == "derivadaFraseVarias" for k, _, _ in linhas_ch))
medicao("rp4mb.chaves_en.do_rp4m", len([k for k, _, _ in linhas_ch if k != "derivadaFrase"]),
        "as linhas da secção cuja chave não é a derivadaFrase (a do RP3): as que o RP4-m acrescentou",
        "a derivadaFraseVarias, do RP4-m, está entre elas", any(k == "derivadaFraseVarias" for k, _, _ in linhas_ch))
medicao("rp4mb.chaves_en.iguais_as_cadeias", sum(1 for k, pt, en in linhas_ch if cadeias.get(k) == [pt, en]),
        "cada linha comparada com STRINGS.pt e STRINGS.en (node, src/i18n/strings.mjs)", "o node leu as cadeias", bool(cadeias))

# As capturas do recibo do salário real, refeitas.
c2 = ler_json(AQUI / "capturas-rp4mb.json") or {}
medicao("rp4mb.capturas", c2.get("capturas", NAO), "node capturar.mjs --rotas salario-real --prefixo rp4mb- --json capturas-rp4mb.json",
        "as plantas visuais morderam", bool(c2.get("plantas")) and all(p.get("mordeu") for p in c2.get("plantas", [])))
medicao("rp4mb.capturas_cabeca", c2.get("cabeca") or NAO, "capturas-rp4mb.json · cabeca (o commit do version.json da construção)",
        "é a cabeça das conferências", c2.get("cabeca") == cab_conf)
medicao("rp4mb.capturas_erros", len(c2.get("erros", [])) if c2 else NAO, "o campo erros de capturas-rp4mb.json", "o guião correu", bool(c2))
medicao("rp4mb.capturas_plantas", len(c2.get("plantas", [])) if c2 else NAO, "o campo plantas de capturas-rp4mb.json", "o guião correu", bool(c2))
medicao("rp4mb.capturas_plantas_mordidas", sum(1 for p in c2.get("plantas", []) if p.get("mordeu")) if c2 else NAO,
        "as plantas de capturas-rp4mb.json com mordeu", "a da frase da conta está entre elas", any("frase da conta" in p.get("nome", "") for p in c2.get("plantas", [])))
medicao("rp4mb.capturas_com_a_frase_da_edicao", sum(1 for c in c2.get("lista", []) if c.get("fraseDaConta") == (cadeias.get("derivadaFraseVarias") or [None, None])[0 if c.get("lang") == "pt" else 1]) if c2 else NAO,
        "as capturas cuja frase da conta é a cadeia da edição", "as capturas mediram a frase", any(c.get("fraseDaConta") for c in c2.get("lista", [])))
medicao("rp4mb.capturas_transbordos", sum(1 for c in c2.get("lista", []) if c.get("pagina") and c["pagina"] > c["largura"]) if c2 else NAO,
        "as capturas com a largura da página maior do que a do ecrã", "as capturas têm a largura medida", any(c.get("pagina") for c in c2.get("lista", [])))

# O custo desta passagem, lido do registo da sessão do construtor da passagem.
custo_b = ler_json(AQUI / "custo-rp4mb.json") or {}
for k in ("segundos", "respostas_do_modelo", "simbolos_de_entrada", "simbolos_de_saida_minimo", "respostas_com_a_saida_de_um_momento_do_fluxo"):
    medicao(f"rp4mb.custo.{k}", custo_b.get(k, NAO), "python3 custo.py <registo da sessão do construtor da passagem> custo-rp4mb.json",
            "o registo lido é o desta sessão (todas as respostas do Claude Opus 5.5)", set((custo_b.get("modelos") or {}).keys()) == {"claude-opus-5-5"})

saida = {"bloco": "RP4-m", "guiao": "design/especime-v3/medicoes/rp4m-2026-10-05/medir.py", "medidas": medidas}
(AQUI / "medidas.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{len(medidas)} medidas; {sum(1 for m in medidas if m['valor'] == NAO)} por ler")
