#!/usr/bin/env python3
"""O §0 do brief V2-b («O que se discute», a página e os três primeiros itens), medido sobre a cabeça presa do
sítio (CAB). Lê só o repositório, pela cabeça (`git ls-tree`, `git show`), nunca a árvore de trabalho (§1.153).
Escreve design/observatorio/medidas/BRIEF-V2b.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO». O §0 do V2-b tem dois números: as
linhas do V2-a já no livro-razão na cabeça lida (zero até o V2-a aterrar; o bloco só se lança depois), e as
linhas de chave da tabela das cadeias, que a página reutiliza em vez de abrir outra."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
# A cabeça presa é a do commit em que os briefs V2 foram escritos (13.10.2026): no GitHub o portão dos briefs
# reexecuta este guião, e as contagens do livro mudam quando o V2-a aterra; medir HEAD daria outro número.
CAB = os.environ.get("OEDP_CABECA") or "869d869010d4c4aa7132ad29d49f4f6db369ae2c"
NAO = "NÃO LIDO"
BRIEF_V2A = "design/observatorio/BRIEF-V2a-as-fontes-da-vigilancia-seladas-no-motor.md"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


lista = git("ls-tree", "-r", "--name-only", CAB, "ledger/claims")
nomes = [pathlib.PurePosixPath(l).name for l in (lista or "").splitlines() if l.endswith(".yml")]
do_v2a = [n for n in nomes if n.startswith("oe-2027-") or n.startswith("afirmacao-")]
brief_v2a = git("show", f"{CAB}:{BRIEF_V2A}") or ""
medicao("linhas_do_v2a_no_livro", len(do_v2a) if lista is not None else NAO,
        f"git ls-tree -r --name-only {CAB} ledger/claims | grep -cE '/(oe-2027-|afirmacao-)[^/]*\\.yml$'",
        "o brief do V2-a, na mesma cabeça, nomeia a linha oe-2027-saude-despesa-total-consolidada-2027 e uma linha afirmacao-",
        "oe-2027-saude-despesa-total-consolidada-2027" in brief_v2a and "afirmacao-cfp-riscos-oe2027-2026-10-07" in brief_v2a)

tabela = git("show", f"{CAB}:src/i18n/strings.mjs")
chave = re.compile(r"^\s+[A-Za-z_][A-Za-z0-9_]*:\s")
linhas_de_chave = [l for l in (tabela or "").splitlines() if chave.match(l)]
medicao("cadeias_na_tabela", len(linhas_de_chave) if tabela is not None else NAO,
        f"git show {CAB}:src/i18n/strings.mjs | grep -cE '^[[:space:]]+[A-Za-z_][A-Za-z0-9_]*:[[:space:]]'",
        "a chave langNome está entre as linhas contadas",
        any(l.strip().startswith("langNome:") for l in linhas_de_chave))

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-V2b.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-V2b-o-que-se-discute-os-tres-primeiros-itens.md",
                             "guiao": "design/observatorio/medidas/BRIEF-V2b.py", "cabeca_lida": CAB, "medidas": medidas},
                            ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
