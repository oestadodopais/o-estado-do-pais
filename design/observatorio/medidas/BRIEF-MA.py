#!/usr/bin/env python3
"""O §0 do brief M-A (a maquinaria sem perda de proteção), medido sobre a cabeça presa do sítio (CAB). Lê só o
repositório, pela cabeça presa (`git show` e `git ls-tree`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-MA.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import datetime, json, os, pathlib, re, subprocess

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


try:
    pacote = json.loads(git("show", f"{CAB}:package.json") or "null")
except json.JSONDecodeError:
    pacote = None
scripts = (pacote or {}).get("scripts", {}) if isinstance(pacote, dict) else {}
passos_v = [p.strip() for p in scripts.get("verify", "").split("&&") if p.strip()]
passos_b = [p.strip() for p in scripts.get("build", "").split("&&") if p.strip()]
medicao("passos_do_verify", len(passos_v) if passos_v else NAO, f"git show {CAB}:package.json · os comandos de «verify» separados por &&", "o verify corre o check:series", "npm run check:series" in passos_v)
medicao("passos_do_build", len(passos_b) if passos_b else NAO, f"git show {CAB}:package.json · os comandos de «build» separados por &&", "o build corre o astro build", "astro build" in passos_b)
medicao("passos_repetidos_do_build_no_verify", len([p for p in passos_v if p in passos_b]) if passos_v and passos_b else NAO, f"git show {CAB}:package.json · os comandos de «verify» que são, letra por letra, comandos de «build»", "o gate:html está nas duas cadeias", "npm run gate:html" in passos_v and "npm run gate:html" in passos_b)

arvore = git("ls-tree", "-r", "--name-only", CAB, "design/especime-v3/medicoes") or ""
# SÓ AS CORRIDAS DE CINCO E SEIS DE OUTUBRO, pelo nome da pasta do bloco (as de setembro têm carimbos de outra forma e outra máquina).
inicios = [l for l in arvore.split("\n") if l.endswith("portoes/verify.inicio") and re.search(r"-2026-10-0[56]", l)]


def segundos(pasta, portao):
    a = git("show", f"{CAB}:{pasta}/{portao}.inicio"); b = git("show", f"{CAB}:{pasta}/{portao}.fim")
    if not a or not b:
        return None
    def le(s):
        s = s.strip()
        return datetime.datetime.fromisoformat(s[:-1] + "+00:00" if s.endswith("Z") else s)
    return int((le(b) - le(a)).total_seconds())


pastas = [l[: -len("/verify.inicio")] for l in inicios]
builds = [s for s in (segundos(p, "build") for p in pastas) if s is not None]
verifies = [s for s in (segundos(p, "verify") for p in pastas) if s is not None]
ex1 = any(p.endswith("ex1-2026-10-05/portoes") for p in pastas)
medicao("corridas_inteiras_registadas", len(pastas) if arvore else NAO, f"git ls-tree -r {CAB} design/especime-v3/medicoes · as pastas de blocos de 2026-10-05 e 2026-10-06 com portoes/verify.inicio", "a corrida do EX1 está entre elas", ex1)
medicao("build_segundos_minimo", min(builds) if builds else NAO, f"git show {CAB}:<pasta>/build.inicio e build.fim · o menor intervalo em segundos", "a corrida do EX1 está entre elas", ex1)
medicao("build_segundos_maximo", max(builds) if builds else NAO, f"git show {CAB}:<pasta>/build.inicio e build.fim · o maior intervalo em segundos", "a corrida do EX1 está entre elas", ex1)
medicao("verify_segundos_minimo", min(verifies) if verifies else NAO, f"git show {CAB}:<pasta>/verify.inicio e verify.fim · o menor intervalo em segundos", "a corrida do EX1 está entre elas", ex1)
medicao("verify_segundos_maximo", max(verifies) if verifies else NAO, f"git show {CAB}:<pasta>/verify.inicio e verify.fim · o maior intervalo em segundos", "a corrida do EX1 está entre elas", ex1)

ci1 = git("show", f"{CAB}:design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md") or ""
b28 = re.search(r"`npm run build` a 0 \(`ci1b_portao_build_codigo`\), em ([\d,]+) s", ci1)
v28 = re.search(r"`npm run verify` a 0 \(`ci1b_portao_verify_codigo`\), em ([\d,]+) s", ci1)
medicao("build_segundos_a_28_09_arredondado", round(float(b28.group(1).replace(",", "."))) if b28 else NAO, f"git show {CAB}:design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md · os segundos do build na frase dos portões do CI1, arredondados", "a frase nomeia a medida ci1b_portao_build_s", "ci1b_portao_build_s" in ci1)
medicao("verify_segundos_a_28_09_arredondado", round(float(v28.group(1).replace(",", "."))) if v28 else NAO, f"git show {CAB}:design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md · os segundos do verify na frase dos portões do CI1, arredondados", "a frase nomeia a medida ci1b_portao_verify_s", "ci1b_portao_verify_s" in ci1)

medidas_dir = git("ls-tree", "--name-only", f"{CAB}:design/observatorio/medidas") or ""
guioes = [f for f in medidas_dir.split() if f.endswith(".py") or f.endswith(".mjs")]
medicao("briefs_com_guiao_de_medidas", len(guioes) if medidas_dir else NAO, f"git ls-tree {CAB}:design/observatorio/medidas · os guiões .py e .mjs", "o guião do EX1 está entre eles", "BRIEF-EX1.py" in guioes)

alvos = git("show", f"{CAB}:tests/acessibilidade/alvos.mjs") or ""
larg = re.search(r"const LARGURAS = \[([\d, ]+)\]", alvos)
larguras = [int(x) for x in re.findall(r"\d+", larg.group(1))] if larg else []
medicao("larguras_do_check_alvos", len(larguras) if larg else NAO, f"git show {CAB}:tests/acessibilidade/alvos.mjs · as entradas de LARGURAS", "a lista inclui 390", 390 in larguras)
espera = re.search(r"waitUntil: 'networkidle' \}\);\s*await pagina\.evaluate\(\(\) => new Promise\(\(res\) => setTimeout\(res, (\d+)\)\)\);", alvos)
medicao("espera_fixa_depois_de_networkidle_ms", int(espera.group(1)) if espera else NAO, f"git show {CAB}:tests/acessibilidade/alvos.mjs · o setTimeout a seguir ao goto com networkidle", "o goto espera networkidle", "waitUntil: 'networkidle'" in alvos)

aterrar = git("show", f"{CAB}:scripts/aterrar.sh") or ""
medicao("esperas_pela_corrida_de_main_no_aterrar", len(re.findall(r"gh run watch ", aterrar)) if aterrar else NAO, f"git show {CAB}:scripts/aterrar.sh · as chamadas «gh run watch»", "o guião lê o check-run portao da cabeça antes", "check-runs" in aterrar and "para 18" in aterrar)

mapa = git("show", f"{CAB}:design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md")
medicao("bytes_do_mapa", len(mapa.encode("utf-8")) if mapa else NAO, f"git show {CAB}:design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md · bytes em UTF-8", "o mapa tem a secção dos portões", bool(mapa) and "## 3 · Os portões" in mapa)
medicao("citacoes_do_mapa", len(re.findall(r"`[^`\n]*:\d+`", mapa)) if mapa else NAO, f"git show {CAB}:design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md · os pedaços entre crases que acabam em :número", "há uma citação do gate-html.mjs", bool(mapa) and re.search(r"`scripts/gate-html\.mjs:\d+`", mapa) is not None)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-MA.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-MA-a-maquinaria-sem-perda-de-protecao.md", "guiao": "design/observatorio/medidas/BRIEF-MA.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
