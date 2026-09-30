#!/usr/bin/env python3
"""O §0 do brief E0 (as linhas da casa no registo das mudanças, e a correção do desemprego), medido sobre a cabeça presa
do sítio (2273d725). Não lê a rede: lê o livro-razão, a história selada dos valores e as duas declarações de lugar na
cabeça. Escreve design/observatorio/medidas/BRIEF-E0.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess
import yaml

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "2273d725"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return r.stdout.split() if r.returncode == 0 else []


linhas = {}
for f in listar("ledger/claims"):
    if f.endswith(".yml"):
        d = yaml.safe_load(mostrar(f"ledger/claims/{f}") or "") or {}
        if d.get("id"):
            linhas[d["id"]] = d

# 1 · as linhas do desemprego que escrevem «6» onde o excerto da fonte escreve «6.0»
desemprego = [i for i, d in linhas.items() if i.startswith("taxa-de-desemprego") and str(d.get("value")) == "6"
              and re.search(r"2025: 6\.0$", str(d.get("excerpt") or ""))]
medicao("linhas_do_desemprego_com_o_inteiro_onde_a_fonte_escreve_o_decimal", len(desemprego) if linhas else NAO,
        f"git show {CAB}:ledger/claims/taxa-de-desemprego*.yml · value «6» e excerpt a acabar em «2025: 6.0»",
        "«taxa-de-desemprego-2025» é uma delas", "taxa-de-desemprego-2025" in desemprego)

# 2 · as correções publicadas, contadas como o contador as conta (kind: correcao em todas as linhas)
correcoes = sum(1 for d in linhas.values() for c in (d.get("corrections") or []) if isinstance(c, dict) and c.get("kind") == "correcao")
medicao("correcoes_publicadas_contadas_no_livro", correcoes if linhas else NAO,
        "as entradas kind: correcao de corrections em todas as linhas do livro, somadas",
        "a de «pib-pc-alentejo-2024» conta", any(c.get("kind") == "correcao" for c in (linhas.get("pib-pc-alentejo-2024", {}).get("corrections") or [])))
contador = linhas.get("correcoes-publicadas", {})
medicao("valor_do_contador_das_correcoes", str(contador.get("value")) if contador else NAO,
        f"git show {CAB}:ledger/claims/correcoes-publicadas.yml · value", "a linha é derivada e tem check", bool(contador.get("check")))

# 3 · a história selada e as declarações de lugar
historia = json.loads(mostrar("ledger/historias-valores.json") or "{}")
medicao("linhas_com_historia_selada", len(historia) if historia else NAO, f"git show {CAB}:ledger/historias-valores.json · as chaves",
        "«estudos-evora-publicados» tem história", "estudos-evora-publicados" in historia)
medicao("entradas_seladas_do_contador_das_correcoes", len(historia.get("correcoes-publicadas", [])) if historia else NAO,
        "a lista de «correcoes-publicadas» nessa história", "a de «pib-pc-alentejo-2024» tem uma entrada", len(historia.get("pib-pc-alentejo-2024", [])) == 1)
lugar = mostrar("src/data/lugar-das-linhas.mjs") or ""
declaradas = re.findall(r"^\s*'([a-z0-9-]+)':\s*'([a-z0-9-]+)'", lugar, flags=re.M)
medicao("linhas_com_lugar_declarado_a_mao", len(declaradas) if lugar else NAO,
        f"git show {CAB}:src/data/lugar-das-linhas.mjs · as entradas de LUGAR_DECLARADO_DAS_LINHAS",
        "«estudos-evora-publicados» está declarada a Évora", ("estudos-evora-publicados", "evora") in declaradas)
mudancas = mostrar("src/lib/mudancas.mjs") or ""
especiais = sorted(set(re.findall(r"chave === '([a-z-]+)'", mudancas)))
medicao("lugares_fora_do_pais_que_o_registo_aceita", len(especiais) if mudancas else NAO,
        f"git show {CAB}:src/lib/mudancas.mjs · as chaves comparadas literalmente (chave === '…')",
        "«uniao-europeia» é um deles", "uniao-europeia" in especiais)
medicao("o_contador_das_correcoes_tem_lugar_declarado", any(i == "correcoes-publicadas" for i, _ in declaradas) if lugar else NAO,
        "a mesma tabela, procurada por «correcoes-publicadas»", "a tabela tem pelo menos uma entrada", bool(declaradas))

saida = {"brief": "design/observatorio/BRIEF-E0-as-linhas-da-casa-no-registo-das-mudancas.md", "guiao": "design/observatorio/medidas/BRIEF-E0.py",
         "cabeca_lida": CAB, "linhas_do_desemprego": desemprego, "lugares_especiais": especiais, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-E0.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
