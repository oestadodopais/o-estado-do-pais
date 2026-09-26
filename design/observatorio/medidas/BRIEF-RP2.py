#!/usr/bin/env python3
"""O §0 do brief RP2 (os rendimentos e os preços fora das APIs já em uso: documentos, portais e
mais três APIs), medido sobre a cabeça presa do sítio (334cc740) e o memorando
das fontes de 26.09.2026 tal como está no repositório. Escreve design/observatorio/medidas/BRIEF-RP2.json
(ou o caminho em OEDP_MEDIDAS_JSON, que é como o scripts/check-briefs.py o corre). Cada medição leva
o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, re, subprocess, pathlib, os
SITIO = pathlib.Path(__file__).resolve().parents[3]
MOTOR = pathlib.Path.home() / "Instruments" / "ResearchHub"
CAB_SITIO, CAB_MOTOR = "334cc740", "1d10b3f"
MEMO = "design/observatorio/MEMO-fontes-rp2-2026-09-26.md"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def git(repo, *args, entrada=None):
    r = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", *args], capture_output=True, text=True, input=entrada)
    return r.stdout if r.returncode == 0 else None
def mostrar(repo, cab, caminho):
    return git(repo, "show", f"{cab}:{caminho}")

# 1 · a linha do salário mínimo que o sítio já tem, e o seu valor
linha = mostrar(SITIO, CAB_SITIO, "ledger/claims/retribuicao-minima-mensal-garantida-continente-2026.yml")
v = re.search(r'^value:\s*"([^"]+)"', linha or "", re.M)
medicao("valor_do_salario_minimo_no_sitio", v.group(1) if v else NAO, f"git show {CAB_SITIO}:ledger/claims/retribuicao-minima-mensal-garantida-continente-2026.yml · «value»",
        "a linha existe e tem unidade", bool(linha and re.search(r'^unit:\s*"', linha, re.M)))

# 2 · as linhas do livro que já vêm de documentos alojados (kind: ficheiro), e as que vêm de séries de API (kind: serie)
lista = git(SITIO, "ls-tree", "-r", "--name-only", CAB_SITIO, "--", "ledger/claims/")
linhas = [l for l in (lista or "").splitlines() if l.endswith(".yml")]
corpo = git(SITIO, "cat-file", "--batch", entrada="".join(f"{CAB_SITIO}:{l}\n" for l in linhas)) if linhas else None
tipos = {}
for bloco in re.split(r"\n(?=[0-9a-f]{40} blob \d+\n)", "\n" + (corpo or "")):
    cab = re.match(r"\n?([0-9a-f]{40}) blob (\d+)\n", bloco)
    if not cab: continue
    k = re.search(r'^\s+kind:\s*"([^"]*)"', bloco[cab.end():], re.M)
    if k: tipos[k.group(1)] = tipos.get(k.group(1), 0) + 1
comando = f"git cat-file --batch sobre as linhas de {CAB_SITIO} · document.kind"
medicao("linhas_de_documento_alojado", tipos.get("ficheiro", NAO if not corpo else 0), comando + " = «ficheiro»", "há linhas com kind «serie» no mesmo lote", tipos.get("serie", 0) > 0)
medicao("linhas_de_serie_de_api", tipos.get("serie", NAO if not corpo else 0), comando + " = «serie»", "há linhas com kind «ficheiro» no mesmo lote", tipos.get("ficheiro", 0) > 0)
medicao("linhas_do_livro", len(linhas) if lista is not None else NAO, f"git ls-tree -r --name-only {CAB_SITIO} -- ledger/claims/ · *.yml",
        "a lista traz a linha do salário mínimo", "ledger/claims/retribuicao-minima-mensal-garantida-continente-2026.yml" in linhas)

# 3 · o motor não se mede aqui: o portão dos briefs corre numa máquina sem o motor; o corpo do salário mínimo
# do Eurostat fica em palavras no §0.

# 4 · o memorando das fontes: as linhas da tabela final, as verificadas e as por verificar
memo = (SITIO / MEMO).read_text(encoding="utf-8") if (SITIO / MEMO).exists() else ""
tabela = re.findall(r"^\| (\d[ab]?) \| ([^|]+)\|[^\n]*\| ([^|]*)\|\s*$", memo, re.M)
medicao("linhas_da_tabela_do_memorando", len(tabela) if memo else NAO, f"{MEMO} · as linhas da tabela «Summary» cujo primeiro campo é o número do item",
        "a tabela tem a linha do salário mínimo no continente", any(r[0] == "1" for r in tabela))
verificadas = sum(1 for r in tabela if r[2].strip().startswith("VERIFIED"))
medicao("linhas_do_memorando_verificadas", verificadas if memo else NAO, "as mesmas linhas · o rótulo começa por «VERIFIED»", "a linha do Eurostat do salário mínimo é VERIFIED", any(r[0] == "3" and r[2].strip().startswith("VERIFIED") for r in tabela))
por_verificar = len(re.findall(r"\[verify\]", memo))
medicao("marcas_por_verificar_no_memorando", por_verificar if memo else NAO, f"{MEMO} · ocorrências de «[verify]»", "a marca da licença do Banco de Portugal está lá", "licence needs a browser `[verify]`" in memo or "licence not read" in memo)
horas = re.findall(r"\b(1[0-9]:[0-5][0-9])Z?\b", memo)
medicao("primeira_hora_de_leitura_do_memorando", min(horas) if horas else NAO, f"{MEMO} · a menor hora UTC escrita", "há horas escritas", bool(horas))
medicao("ultima_hora_de_leitura_do_memorando", max(horas) if horas else NAO, f"{MEMO} · a maior hora UTC escrita", "há horas escritas", bool(horas))

saida = {"brief": "design/observatorio/BRIEF-RP2-rendimentos-e-precos-os-documentos-e-as-outras-apis.md", "guiao": "design/observatorio/medidas/BRIEF-RP2.py",
         "cabeca_lida": CAB_SITIO, "memorando": MEMO, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-RP2.json")
with open(alvo, "w", encoding="utf-8") as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
