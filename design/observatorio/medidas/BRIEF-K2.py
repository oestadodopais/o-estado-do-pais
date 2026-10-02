#!/usr/bin/env python3
"""O §0 do brief K2 (o cartão para o telemóvel), medido sobre a cabeça presa do sítio (a que o guião diz em CAB). Não lê a
rede: lê as declarações dos cartões, as linhas e as leituras na cabeça. Escreve design/observatorio/medidas/BRIEF-K2.json
(ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica
«NÃO LIDO»."""
import json, os, pathlib, re, subprocess
import yaml

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "a9509193"
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


# 1 · os cartões dos quadros (figuras.mjs): quantos são, e quantos têm um valor de variação sob um nome de nível
fig = mostrar("src/data/figuras.mjs") or ""
cartoes = re.findall(r"\n\s*claim: '([a-z0-9-]+)',\s*\n\s*quadro:", fig)
medicao("cartoes_declarados_nos_quadros", len(cartoes) if fig else NAO, f"git show {CAB}:src/data/figuras.mjs · as entradas com claim e quadro",
        "a taxa de atividade é um deles", "taxa-de-actividade-2025" in cartoes)
blocos = re.split(r"\n\s*\{\s*\n\s*claim: '", fig)[1:]
variacao_sob_nivel = []
for b in blocos:
    cid = b.split("'")[0]
    nome = re.search(r"nome: \{ pt: '([^']*)'", b)
    med = re.search(r"pt: \['([^']*)'", b)
    if nome and med and re.match(r"(Variação|Mudança)", med.group(1)) and not re.search(r"variação|em três anos|mudança", nome.group(1), flags=re.I):
        variacao_sob_nivel.append(cid)
medicao("cartoes_com_variacao_sob_nome_de_nivel", len(variacao_sob_nivel) if fig else NAO,
        "os cartões cuja medida começa por «Variação» e cujo nome não diz variação nem três anos",
        "a taxa de atividade é um deles", "taxa-de-actividade-2025" in variacao_sob_nivel)

# 2 · a unidade da disparidade de emprego entre sexos, como a linha a escreve
d = yaml.safe_load(mostrar("ledger/claims/disparidade-de-emprego-entre-sexos-2025.yml") or "") or {}
medicao("unidade_da_disparidade_de_emprego", d.get("unit", NAO), f"git show {CAB}:ledger/claims/disparidade-de-emprego-entre-sexos-2025.yml · unit",
        "a linha é do Eurostat", d.get("source") == "Eurostat")

# 3 · as linhas cujo valor tem menos casas decimais do que o excerto da fonte escreve
linhas = [f for f in listar("ledger/claims") if f.endswith(".yml")]
casos = []
for f in linhas:
    try:
        r = yaml.safe_load(mostrar(f"ledger/claims/{f}") or "") or {}
    except Exception:
        continue
    if not isinstance(r, dict) or r.get("derivation"):
        continue
    v = str(r.get("value", "")); ex = str(r.get("excerpt") or "").strip()
    m = re.search(r":\s*(-?\d+)\.(\d+)\s*$", ex)
    if not m:
        continue
    dec_casa = len(v.split(",")[1]) if "," in v else 0
    mesmo = v.replace(" ", "").replace(",", ".").rstrip("0").rstrip(".") == (m.group(1) + "." + m.group(2)).rstrip("0").rstrip(".")
    if dec_casa < len(m.group(2)) and mesmo:
        casos.append(r.get("id"))
medicao("linhas_com_menos_decimais_do_que_a_fonte", len(casos) if linhas else NAO,
        "as linhas sem derivação cujo excerto acaba em «: N.D» e cujo value tem menos casas decimais, sendo o mesmo número",
        "a dos jovens nem-nem de 2025 é uma delas", "jovens-nem-2025" in casos)

# 4 · as frases das leituras dos estudos com termos por explicar
lt = mostrar("src/data/leituras.mjs") or ""
termos = ["designações", "localizações de projeto vencidas", "atuarialmente"]
medicao("frases_das_leituras_com_termos_por_explicar", sum(lt.count(t) for t in termos) if lt else NAO,
        f"git show {CAB}:src/data/leituras.mjs · as ocorrências de «designações», «localizações de projeto vencidas» e «atuarialmente»",
        "«atuarialmente» aparece", "atuarialmente" in lt)

saida = {"brief": "design/observatorio/BRIEF-K2-o-cartao-para-o-telemovel.md", "guiao": "design/observatorio/medidas/BRIEF-K2.py",
         "cabeca_lida": CAB, "cartoes_com_variacao_sob_nome_de_nivel": variacao_sob_nivel, "linhas_com_menos_decimais": casos, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-K2.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
