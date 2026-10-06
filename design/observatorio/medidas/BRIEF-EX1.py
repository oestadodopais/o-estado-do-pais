#!/usr/bin/env python3
"""O §0 do brief EX1 (o espaço das explicações e a leitura semanal), medido sobre a cabeça presa do sítio (CAB). Lê só o
repositório, pela cabeça presa (`git show` e `git ls-tree`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-EX1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "3664b90d"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def lista(pasta):
    s = git("ls-tree", "--name-only", f"{CAB}:{pasta}")
    return s.split() if s else None


claims = lista("ledger/claims")
ids = sorted(c[:-4] for c in (claims or []) if c.endswith(".yml"))
def conta(padrao, nome, o_que, exemplo):
    n = sum(1 for i in ids if re.search(padrao, i))
    medicao(nome, n if claims else NAO, f"git ls-tree {CAB}:ledger/claims · os ids que casam com /{padrao}/", o_que, exemplo in ids)
    return n
conta(r"^oe-2026-", "linhas_do_orcamento_do_estado_de_2026", "a linha dos cem euros da saúde está na lista", "oe-2026-cem-euros-ministerio-saude")
conta(r"^oe-2026-cem-euros-funcao-", "linhas_dos_cem_euros_por_funcao", "a função 07 está na lista", "oe-2026-cem-euros-funcao-07")
conta(r"^oe-2026-cem-euros-ministerio-", "linhas_dos_cem_euros_por_ministerio", "o ministério das finanças está na lista", "oe-2026-cem-euros-ministerio-financas")
conta(r"^oe-2026-despesa-ministerio-", "linhas_da_despesa_por_ministerio", "a despesa da saúde está na lista", "oe-2026-despesa-ministerio-saude")
conta(r"^despesa-por-funcao-2024-", "linhas_da_despesa_por_funcao_de_2024", "a função 01 de Portugal está na lista", "despesa-por-funcao-2024-gf01-pt")
conta(r"^execucao-2026-08-", "linhas_da_execucao_orcamental_de_agosto_de_2026", "a despesa efetiva da administração central está na lista", "execucao-2026-08-despesa-efetiva-administracao-central")
conta(r"^divida-publica-", "linhas_da_divida_publica", "a dívida de 2025 está na lista", "divida-publica-2025")
conta(r"^saldo-das-administracoes-publicas-", "linhas_do_saldo_das_administracoes_publicas", "o saldo de 2025 está na lista", "saldo-das-administracoes-publicas-2025")
n_juros = sum(1 for i in ids if re.search(r"juros|servico-da-divida|encargos-da-divida", i))
medicao("linhas_sobre_os_juros_da_divida", n_juros if claims else NAO, f"git ls-tree {CAB}:ledger/claims · os ids com «juros», «servico-da-divida» ou «encargos-da-divida»", "o detetor vê um id com a palavra (a lista inteira tem mais de três mil ids)", len(ids) > 3000)
# As entradas datadas do registo das correções e das releituras, e as da última semana antes da cabeça presa.
datas = []
for c in claims or []:
    if not c.endswith(".yml"): continue
    t = git("show", f"{CAB}:ledger/claims/{c}") or ""
    datas += re.findall(r'^\s+- date: "?(\d{4}-\d{2}-\d{2})"?', t, re.M)
medicao("entradas_datadas_nas_linhas", len(datas) if claims else NAO, f"git show {CAB}:ledger/claims/*.yml · as linhas «- date:» de corrections e verifications", "há entradas de 05.10.2026", "2026-10-05" in datas)
medicao("entradas_datadas_desde_28_09_2026", sum(1 for d in datas if d >= "2026-09-28") if claims else NAO, "as mesmas, com data igual ou posterior a 2026-09-28", "há entradas de 28.09.2026", "2026-09-28" in datas)
estudos = git("show", f"{CAB}:src/data/studies.mjs") or ""
medicao("estudos_publicados", len(re.findall(r"^\s+slug:", estudos, re.M)) if estudos else NAO, f"git show {CAB}:src/data/studies.mjs · as linhas «slug:»", "o estudo quadro-institucional está no ficheiro", "quadro-institucional" in estudos)
rotas = git("show", f"{CAB}:src/lib/routes.mjs") or ""
medicao("rotas_de_explicacoes_no_sitio", len(re.findall(r"^\s+explicacoes:", rotas, re.M)) if rotas else NAO, f"git show {CAB}:src/lib/routes.mjs · as chaves de rota «explicacoes»", "a rota dos estudos existe", "estudos:" in rotas)
pp = git("show", f"{CAB}:src/data/primeira-pagina.mjs") or ""
medicao("blocos_da_primeira_pagina", len(re.findall(r"^\s{4}id: '", pp, re.M)) if pp else NAO, f"git show {CAB}:src/data/primeira-pagina.mjs · as chaves «id» ao nível dos blocos", "o bloco dos preços existe", "id: 'precos'" in pp)
medicao("frases_com_ramo_decidido_pelos_numeros_na_primeira_pagina", len(re.findall(r"\{ compara:", pp)) if pp else NAO, f"git show {CAB}:src/data/primeira-pagina.mjs · os tokens «compara»", "há um token compara da dívida", "compara: ['divida-publica-2025'" in pp)
nav = git("show", f"{CAB}:src/lib/navegacao.mjs") or ""
mastro = git("show", f"{CAB}:src/components/Masthead.astro") or ""
# EX1-b (06.10.2026, a I210): a primeira forma desta medida contava as linhas do objeto ETIQUETA_NAV que começam por uma
# chave (5), e não as portas que o menu rende. O menu do cabeçalho (`Masthead.astro`, dentro de `#nav-principal`) rende
# uma porta por entrada de ROTAS_NAV: a medida conta essas entradas, e o conhecido-positivo exige que o cabeçalho as
# percorra e que a porta da União esteja entre elas.
rotas_nav = re.search(r"export const ROTAS_NAV = \[([^\]]*)\]", nav)
portas_nav = re.findall(r"'([A-Za-z]+)'", rotas_nav.group(1)) if rotas_nav else []
medicao("portas_do_menu", len(portas_nav) if rotas_nav else NAO, f"git show {CAB}:src/lib/navegacao.mjs · as entradas de ROTAS_NAV, que o menu rende (git show {CAB}:src/components/Masthead.astro · ROTAS_NAV.map dentro de #nav-principal)", "o cabeçalho percorre ROTAS_NAV dentro de #nav-principal, e a porta da União é uma das entradas", "ROTAS_NAV.map" in mastro and 'id="nav-principal"' in mastro and "uniaoEuropeia" in portas_nav)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-EX1.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-EX1-o-espaco-das-explicacoes-e-a-leitura-semanal.md", "guiao": "design/observatorio/medidas/BRIEF-EX1.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
