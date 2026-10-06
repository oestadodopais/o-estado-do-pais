#!/usr/bin/env python3
"""O §0 do brief JD1 (os juros e a dívida do Estado no livro-razão), medido sobre a cabeça presa do sítio (CAB). Lê só o
repositório, pela cabeça presa (`git ls-tree`, `git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-JD1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "6bc9b86b"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


lista = git("ls-tree", "--name-only", f"{CAB}:ledger/claims") or ""
ids = sorted(f[:-4] for f in lista.split() if f.endswith(".yml"))
def conta(padrao, nome, o_que, exemplo):
    n = sum(1 for i in ids if re.match(padrao, i))
    medicao(nome, n if ids else NAO, f"git ls-tree {CAB}:ledger/claims · os ids que casam com /{padrao}/", o_que, exemplo in ids)
    return n
conta(r"^divida-publica-", "linhas_da_divida_publica", "a linha da dívida de dois mil e vinte e cinco está na lista", "divida-publica-2025")
conta(r"^saldo-das-administracoes-publicas-", "linhas_do_saldo_das_administracoes_publicas", "a linha do saldo de dois mil e vinte e cinco está na lista", "saldo-das-administracoes-publicas-2025")
conta(r"^(juros|despesa-com-juros|custo-da-divida|custo-do-stock|necessidades-de-financiamento|emissoes-de-divida|divida-direta)", "linhas_dos_juros_e_do_custo_da_divida", "a lista das linhas lê-se (a linha da dívida pública existe)", "divida-publica-2025")
conta(r"^oe-2026-despesa-programa-", "linhas_da_despesa_por_programa_do_orcamento_de_2026", "o programa 005 está na lista", "oe-2026-despesa-programa-005")
conta(r"^execucao-2026-08-despesa-programa-", "linhas_da_despesa_por_programa_executada_ate_agosto", "o programa 005 está na lista", "execucao-2026-08-despesa-programa-005")

prog = git("show", f"{CAB}:ledger/claims/execucao-2026-08-despesa-programa-005.yml") or ""
medicao("linhas_executadas_do_programa_da_gestao_da_divida", 1 if "Gestão da Dívida Pública" in prog else NAO, f"git show {CAB}:ledger/claims/execucao-2026-08-despesa-programa-005.yml · a linha nomeia a Gestão da Dívida Pública, contada uma vez", "a linha tem valor e unidade", bool(re.search(r"^value:", prog, re.M)) and bool(re.search(r"^unit:", prog, re.M)))

series_t = git("show", f"{CAB}:src/data/series-no-tempo.mjs") or ""
chaves = re.findall(r"^  '(serie-[a-z0-9-]+)': \{", series_t, re.M)
medicao("series_no_tempo_registadas_no_sitio", len(chaves) if series_t else NAO, f"git show {CAB}:src/data/series-no-tempo.mjs · as chaves «serie-…» ao nível do registo", "a série das rendas está registada", "serie-ihpc-rendas-variacao-homologa" in chaves)
medicao("series_das_obrigacoes_do_tesouro_no_sitio", len([c for c in chaves if "obrigacoes" in c or "rendibilidade" in c]) if series_t else NAO, f"git show {CAB}:src/data/series-no-tempo.mjs · as chaves com «obrigacoes» ou «rendibilidade»", "a série das rendas está registada", "serie-ihpc-rendas-variacao-homologa" in chaves)

lista_ser = git("ls-tree", "--name-only", f"{CAB}:ledger/series") or ""
medicao("ficheiros_de_series_no_livro", len([f for f in lista_ser.split() if f.endswith(".yml")]) if lista_ser else NAO, f"git ls-tree {CAB}:ledger/series · os .yml", "a série das rendas tem ficheiro", "serie-ihpc-rendas-variacao-homologa.yml" in lista_ser.split())

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-JD1.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-JD1-os-juros-e-a-divida-do-estado-no-livro-razao.md", "guiao": "design/observatorio/medidas/BRIEF-JD1.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
