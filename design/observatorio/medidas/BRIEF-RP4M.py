#!/usr/bin/env python3
"""O §0 do brief RP4-m (as séries que faltam e o corredor das séries, no motor), medido sobre a cabeça presa do sítio (fb364fe4).
Lê só o repositório do sítio, pela cabeça presa (`git show` e `git grep`), nunca a árvore de trabalho (§1.153); o motor não se
mede aqui porque o portão dos briefs corre numa máquina sem ele (a mesma regra do BRIEF-RP3.py). Escreve
design/observatorio/medidas/BRIEF-RP4M.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "fb364fe4"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode in (0, 1) else None


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def campo(texto, nome):
    m = re.search(rf'^{nome}: "([^"]*)"', texto, re.M)
    return m.group(1) if m else None


nomes = (git("ls-tree", "--name-only", CAB, "ledger/series/") or "").split()
series = {n: (mostrar(n) or "") for n in nomes if n.endswith(".yml")}
no_tempo = {n: s for n, s in series.items() if re.search(r'^eixo: "periodo"', s, re.M)}
medicao("series_no_tempo_no_livro", len(no_tempo) if series else NAO,
        f"git ls-tree {CAB} ledger/series/ · os ficheiros .yml com eixo: \"periodo\"",
        "a série do índice harmonizado de Portugal está entre elas", "ledger/series/serie-ihpc-variacao-homologa.yml" in no_tempo)

presas = (git("grep", "-l", "^serie: ", CAB, "--", "ledger/claims/") or "").split()
medicao("linhas_presas_a_uma_serie", len(presas),
        f"git grep -l '^serie: ' {CAB} -- ledger/claims/",
        "a linha da União está presa", any(p.endswith("ledger/claims/ihpc-variacao-homologa-ue.yml") for p in presas))

do_ipc = [p for p in (git("grep", "-l", "-E", "0014666|0014647", CAB, "--", "ledger/claims/") or "").split()]
principais = [p for p in do_ipc if not p.endswith("-periodo-anterior.yml")]
medicao("linhas_do_ipc_com_as_coordenadas_0014666_ou_0014647", len(do_ipc),
        f"git grep -l -E '0014666|0014647' {CAB} -- ledger/claims/",
        "a linha dos combustíveis é uma delas", any(p.endswith("ipc-combustiveis-variacao-homologa.yml") for p in do_ipc))
medicao("dessas_as_linhas_principais_sem_o_periodo_anterior", len(principais),
        "as da medida anterior cujo id não acaba em -periodo-anterior",
        "a linha da média de doze meses é uma delas", any(p.endswith("ipc-variacao-media-12-meses.yml") for p in principais))
medicao("dessas_as_presas_a_uma_serie", len(set(principais) & set(presas)),
        "a interseção com as linhas presas", "as duas listas foram lidas", bool(principais) and bool(presas))

pt = mostrar("ledger/claims/ihpc-variacao-homologa.yml") or ""
spt = no_tempo.get("ledger/series/serie-ihpc-variacao-homologa.yml", "")
ref, ult = campo(pt, "reference_date"), campo(spt, "ultimo_periodo")


def meses(p):
    a, m = p.split("-"); return int(a) * 12 + int(m)


medicao("meses_entre_a_linha_do_ihpc_de_portugal_e_o_ultimo_ponto_da_sua_serie", (meses(ult) - meses(ref)) if ref and ult else NAO,
        f"git show {CAB}:ledger/claims/ihpc-variacao-homologa.yml (reference_date) e ledger/series/serie-ihpc-variacao-homologa.yml (ultimo_periodo), a diferença em meses",
        "a linha de Portugal não tem o campo serie", not re.search(r"^serie: ", pt, re.M))
ultimo = re.search(r'^  - periodo: "' + re.escape(ult or "") + r'"\n(?:    [^\n]*\n)*', spt, re.M)
bloco = ultimo.group(0) if ultimo else ""
medicao("marca_da_fonte_no_ultimo_ponto_da_serie_do_ihpc_de_portugal", (1 if re.search(r'^    bandeira: "(?!")', bloco, re.M) else 0) if bloco else NAO,
        f"git show {CAB}:ledger/series/serie-ihpc-variacao-homologa.yml · o campo bandeira do ponto ultimo_periodo, 1 se não for vazio",
        "o ponto do último período existe", bool(bloco))

BASE = {"mensal": "2015-01", "trimestral": "2015-T1", "semestral": "2015-S1", "anual": "2015"}
com_base = [n for n, s in no_tempo.items() if re.search(r'^  - periodo: "' + re.escape(BASE.get(campo(s, "periodicidade") or "", "?")) + r'"', s, re.M)]
medicao("series_no_tempo_com_ponto_no_periodo_de_base_de_2015", len(com_base) if no_tempo else NAO,
        f"git show {CAB}:ledger/series/<série>.yml · as séries no tempo com um ponto no período da sua cadência que contém janeiro de 2015",
        "a do salário mínimo (semestral, desde 1999) tem o ponto 2015-S1", "ledger/series/serie-salario-minimo-mensal.yml" in com_base)
rem = no_tempo.get("ledger/series/serie-remuneracao-bruta-mensal-media.yml", "")
medicao("pontos_da_serie_da_remuneracao_bruta_mensal_media", len(re.findall(r"^  - periodo:", rem.split("\npontos:\n", 1)[1], re.M)) if "\npontos:\n" in rem else NAO,
        f"git show {CAB}:ledger/series/serie-remuneracao-bruta-mensal-media.yml · as linhas «  - periodo:» da lista pontos:",
        "a série começa em 2025-T1, depois do período de base", campo(rem, "primeiro_periodo") == "2025-T1")
medicao("series_no_tempo_derivadas", sum(1 for s in no_tempo.values() if re.search(r"^derived_from:\s*\n\s+- ", s, re.M)) if no_tempo else NAO,
        f"git show {CAB}:ledger/series/<série>.yml · as séries no tempo com o campo derived_from",
        "a dos cem euros de 2015 é derivada e a do IPC não", bool(re.search(r"^derived_from:\s*\n\s+- ", no_tempo.get("ledger/series/serie-cem-euros-de-2015-01.yml", ""), re.M)) and not re.search(r"^derived_from:\s*\n\s+- ", no_tempo.get("ledger/series/serie-ipc-variacao-homologa.yml", ""), re.M))

saida = {"brief": "design/observatorio/BRIEF-RP4M-as-series-que-faltam-e-o-corredor-das-series.md",
         "guiao": "design/observatorio/medidas/BRIEF-RP4M.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-RP4M.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
