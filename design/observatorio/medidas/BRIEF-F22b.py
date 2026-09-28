#!/usr/bin/env python3
"""O §0 do brief F2.2b (as corridas prontas a armar), medido sobre a cabeça presa do sítio (a677770f).
Não lê o motor: o portão dos briefs corre numa máquina sem ele (a M34); o que é do motor, o brief
di-lo em palavras. Escreve design/observatorio/medidas/BRIEF-F22b.json (ou o caminho em
OEDP_MEDIDAS_JSON, que é como o scripts/check-briefs.py o corre). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, re, subprocess, pathlib, os
SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "a677770f"
PAINEL = "17758ec7"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), "-c", "core.quotepath=off", *args], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None
def mostrar(caminho):
    return git("show", f"{CAB}:{caminho}")

# 1 · a corrida «portão» do sítio corre em qualquer ramo
W = ".github/workflows/portao.yml"
w = mostrar(W) or ""
bloco = re.search(r"^on:\s*\n((?:[ \t]+.*\n)+)", w, re.M)
on = bloco.group(1) if bloco else ""
medicao("portao_corre_em_qualquer_ramo", (("push:" in on) and ("branches" not in on)) if bloco else NAO,
        f"git show {CAB}:{W} · o bloco on: tem push e não tem branches",
        "o mesmo detetor vê um filtro de ramos num bloco construído", "branches" in "  push:\n    branches: [main]\n")

# 2 · as linhas do livro e as que levam reconferências do painel e do corredor
arvore = [x for x in (git("ls-tree", "-r", "--name-only", CAB, "--", "ledger/claims/") or "").splitlines() if x.endswith(".yml")]
pain = corr = 0
for x in arvore:
    t = mostrar(x) or ""
    if re.search(r'^\s+by:\s*"?painel-semanal"?\s*$', t, re.M): pain += 1
    if re.search(r'^\s+by:\s*"?corredor-diario"?\s*$', t, re.M): corr += 1
medicao("linhas_do_livro", len(arvore) if arvore else NAO, f"git ls-tree {CAB} -- ledger/claims/ · os .yml",
        "a lista traz a linha da inflação", "ledger/claims/ipc-variacao-homologa.yml" in arvore)
medicao("linhas_com_carimbo_do_painel", pain if arvore else NAO, "as mesmas linhas · pelo menos uma reconferência com by: painel-semanal",
        "a linha da União da dívida das famílias é uma delas", bool(re.search(r'by:\s*"?painel-semanal', mostrar("ledger/claims/divida-das-familias-2025-ue.yml") or "")))
medicao("linhas_com_carimbo_do_corredor", corr if arvore else NAO, "as mesmas linhas · pelo menos uma reconferência com by: corredor-diario",
        "a linha do limite legal da dívida dos municípios é uma delas", bool(re.search(r'by:\s*"?corredor-diario', mostrar("ledger/claims/indice-de-divida-limite-legal.yml") or "")))

# 3 · os commits do painel semanal, e o que o de 28.09 mudou
log = [x for x in (git("log", "--format=%h %s", CAB) or "").splitlines() if " " in x and x.split(" ", 1)[1].startswith("Painel semanal de ")]
medicao("commits_do_painel_semanal", len(log) if log else NAO, f"git log --format='%h %s' {CAB} · os assuntos que começam por «Painel semanal de»",
        "o de 28.09 é um deles", any(x.startswith(PAINEL[:7]) for x in log))
fich = (git("show", "--name-only", "--format=", PAINEL) or "").split()
medicao("ficheiros_do_painel_de_28_09", len(fich) if fich else NAO, f"git show --name-only {PAINEL} · os ficheiros do commit",
        "o estado da verificação é um deles", "src/data/verificacao.mjs" in fich)
medicao("linhas_mudadas_pelo_painel_de_28_09", sum(1 for x in fich if x.startswith("ledger/claims/")) if fich else NAO,
        "os mesmos ficheiros · os de ledger/claims/", "a linha da União da dívida das famílias é um deles", "ledger/claims/divida-das-familias-2025-ue.yml" in fich)

saida = {"brief": "design/observatorio/BRIEF-F22b-as-corridas-prontas-a-armar.md", "guiao": "design/observatorio/medidas/BRIEF-F22b.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-F22b.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
