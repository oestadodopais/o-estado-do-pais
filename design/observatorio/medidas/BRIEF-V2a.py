#!/usr/bin/env python3
"""O §0 do brief V2-a (as fontes da vigilância seladas no motor), medido sobre a cabeça presa do sítio (CAB).
Lê só o repositório, pela cabeça (`git ls-tree`, `git grep`, `git show`), nunca a árvore de trabalho (§1.153).
Escreve design/observatorio/medidas/BRIEF-V2a.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO». O §0 do V2-a tem dois números: as
linhas do livro-razão na cabeça de partida, e quantas delas já citam o Orçamento do Estado para 2027 (zero
antes do bloco: o bloco acrescenta as suas sem tocar nas outras)."""
import json, os, pathlib, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "HEAD"
NAO = "NÃO LIDO"
BRIEF = "design/observatorio/BRIEF-V2a-as-fontes-da-vigilancia-seladas-no-motor.md"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


lista = git("ls-tree", "-r", "--name-only", CAB, "ledger/claims")
linhas = [l for l in (lista or "").splitlines() if l.endswith(".yml")]
medicao("linhas_do_livro_na_partida", len(linhas) if lista is not None else NAO,
        f"git ls-tree -r --name-only {CAB} ledger/claims | grep -c '\\.yml$'",
        "a linha agua-nao-faturada-portugal-2024.yml está na lista",
        "ledger/claims/agua-nao-faturada-portugal-2024.yml" in linhas)

citam = subprocess.run(["git", "-C", str(SITIO), "grep", "-l", "-i", "-e", "oe-2027", "-e", "OE2027",
                        "-e", "Orçamento do Estado para 2027", CAB, "--", "ledger/claims"], capture_output=True)
if citam.returncode in (0, 1):
    n_citam = len([l for l in citam.stdout.decode("utf-8").splitlines() if l.strip()])
else:
    n_citam = NAO
brief = git("show", f"{CAB}:{BRIEF}") or ""
medicao("linhas_que_citam_o_oe2027_na_partida", n_citam,
        f"git grep -l -i -e oe-2027 -e OE2027 -e 'Orçamento do Estado para 2027' {CAB} -- ledger/claims | wc -l",
        "o brief do V2-a, na mesma cabeça, nomeia a linha oe-2027-saude-despesa-total-consolidada-2027 (o detetor vê o padrão onde ele existe)",
        "oe-2027-saude-despesa-total-consolidada-2027" in brief)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-V2a.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": BRIEF, "guiao": "design/observatorio/medidas/BRIEF-V2a.py", "cabeca_lida": CAB,
                             "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
