#!/usr/bin/env python3
"""O §0 do brief RP3 (as séries no motor e no livro-razão), medido sobre cabeças presas:
o sítio em 334cc740, para ser reproduzível depois de o RP1 aterrar; o motor não se lê, porque o portão dos briefs corre numa máquina sem ele.
Escreve design/observatorio/medidas/BRIEF-RP3.json (ou o caminho em OEDP_MEDIDAS_JSON, que é
como o scripts/check-briefs.py o corre). Cada medição leva o comando e um conhecido-positivo;
o que não conseguir ler fica «NÃO LIDO»."""
import json, re, subprocess, pathlib, os
SITIO = pathlib.Path(__file__).resolve().parents[3]
MOTOR = pathlib.Path.home() / "Instruments" / "ResearchHub"
CAB_SITIO, CAB_MOTOR = "334cc740", "1d10b3f"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def git(repo, *args, entrada=None):
    r = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", *args], capture_output=True, text=True, input=entrada)
    return r.stdout if r.returncode == 0 else None
def mostrar(repo, cab, caminho):
    return git(repo, "show", f"{cab}:{caminho}")

# 1 · as linhas do livro-razão na cabeça
lista = git(SITIO, "ls-tree", "-r", "--name-only", CAB_SITIO, "--", "ledger/claims/")
linhas = [l for l in (lista or "").splitlines() if l.endswith(".yml")]
medicao("linhas_do_livro", len(linhas) if lista is not None else NAO, f"git ls-tree -r --name-only {CAB_SITIO} -- ledger/claims/ · *.yml",
        "a lista traz a linha do PIB real por habitante", "ledger/claims/pib-real-per-capita-2025.yml" in linhas)

# 2 · os segundos do build e do verify do L1, e as páginas construídas (a medição mais recente presa no repositório)
for portao in ("build", "verify"):
    caminho = f"design/especime-v3/medicoes/l1-2026-09-24/portoes/{portao}.json"
    t = mostrar(SITIO, CAB_SITIO, caminho)
    try:
        d = json.loads(t); valor, positivo = d["segundos"], d.get("codigo") == 0
    except Exception:
        valor, positivo = NAO, False
    medicao(f"segundos_do_{portao}", valor, f"git show {CAB_SITIO}:{caminho} · «segundos»", "o mesmo ficheiro traz o código 0 dessa corrida", positivo)
log = mostrar(SITIO, CAB_SITIO, "design/especime-v3/medicoes/l1-2026-09-24/portoes/build.log") or ""
p = re.search(r"(\d+)\s+page\(s\) built", log)
medicao("paginas_construidas", int(p.group(1)) if p else NAO, f"git show {CAB_SITIO}:design/especime-v3/medicoes/l1-2026-09-24/portoes/build.log · «N page(s) built»",
        "o registo traz a linha do Astro com as páginas construídas", bool(p))

# 3 · as famílias de linhas com mais de um período (a mesma edição e unidade), e as que misturam a União
corpo = git(SITIO, "cat-file", "--batch", entrada="".join(f"{CAB_SITIO}:{l}\n" for l in linhas)) if linhas else None
grupos, lidas = {}, 0
for bloco in re.split(r"\n(?=[0-9a-f]{40} blob \d+\n)", "\n" + (corpo or "")):
    cab = re.match(r"\n?([0-9a-f]{40}) blob (\d+)\n", bloco)
    if not cab: continue
    texto = bloco[cab.end():]
    ident = re.search(r'^id:\s*"([^"]+)"', texto, re.M)
    unidade = re.search(r'^unit:\s*"([^"]*)"', texto, re.M)
    edicao = re.search(r'^\s+edition:\s*"([^"]*)"', texto, re.M)
    periodo = re.search(r'^reference_date:\s*"([^"]*)"', texto, re.M)
    if not (ident and unidade and edicao and periodo): continue
    lidas += 1
    grupos.setdefault((edicao.group(1), unidade.group(1)), []).append((ident.group(1), periodo.group(1)))
varios = {k: v for k, v in grupos.items() if len({p for _, p in v}) >= 2}
da_divida = next((v for v in grupos.values() if any(i == "divida-publica-2025" for i, _ in v)), [])
comando_grupos = f"git cat-file --batch sobre as linhas de {CAB_SITIO}, agrupadas por document.edition e unit"
medicao("linhas_lidas_para_os_grupos", lidas if corpo else NAO, comando_grupos + " · linhas com id, unit, edition e reference_date",
        "a linha do PIB real por habitante foi lida com os quatro campos", any(i == "pib-real-per-capita-2025" for v in grupos.values() for i, _ in v))
medicao("grupos_com_varios_periodos", len(varios) if corpo else NAO, comando_grupos + " · famílias com dois ou mais reference_date distintos",
        "a família da dívida pública tem os dois anos", len({p for _, p in da_divida}) >= 2)
mistura = sum(1 for v in varios.values() if any(i.endswith("-ue") for i, _ in v) and any(not i.endswith("-ue") for i, _ in v))
medicao("grupos_que_misturam_uniao", mistura if corpo else NAO, comando_grupos + " · famílias com ids «-ue» e sem «-ue» juntos",
        "a família da dívida pública junta a linha da União", any(i == "divida-publica-2025-ue" for i, _ in da_divida))

# 4 · o motor não se mede aqui: o portão dos briefs corre numa máquina sem o motor (a corrida «portão» do RP1 fechou
# por isso a 26.09.2026), e os factos do estudo 13 ficam em palavras no §0.

saida = {"brief": "design/observatorio/BRIEF-RP3-as-series-no-motor-e-no-livro.md", "guiao": "design/observatorio/medidas/BRIEF-RP3.py",
         "cabeca_lida": CAB_SITIO, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-RP3.json")
with open(alvo, "w", encoding="utf-8") as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
