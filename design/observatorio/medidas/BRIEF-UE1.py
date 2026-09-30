#!/usr/bin/env python3
"""O §0 do brief UE1 (onde Portugal fica entre os 27), medido sobre a cabeça presa do sítio (8e66b601).
Não lê a rede: o portão dos briefs corre sem ela. Os valores dos 27 países estão no §1 do brief, lidos
pelo lugar de direção na API do Eurostat e guardados em
design/observatorio/medidas/BRIEF-UE1-eurostat-2026-09-29.json. Escreve
design/observatorio/medidas/BRIEF-UE1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess
from urllib.parse import urlsplit
import yaml

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "8e66b601"
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


def anfitriao(linha_id):
    texto = mostrar(f"ledger/claims/{linha_id}.yml")
    if texto is None:
        return None
    return urlsplit(str(yaml.safe_load(texto).get("source_url", ""))).netloc


pp = mostrar("src/data/primeira-pagina.mjs") or ""
da_uniao = sorted(set(re.findall(r"['\"]([a-z0-9-]+-ue)['\"]", pp)))
medicao("linhas_da_uniao_nos_blocos", len(da_uniao) if pp else NAO,
        f"git show {CAB}:src/data/primeira-pagina.mjs · os identificadores entre aspas que acabam em -ue",
        "a linha da dívida pública da União é uma delas", "divida-publica-2025-ue" in da_uniao)

hosts = {i: anfitriao(i) for i in da_uniao}
do_eurostat = [i for i, h in hosts.items() if h == "ec.europa.eu"]
medicao("linhas_da_uniao_do_eurostat", len(do_eurostat) if da_uniao else NAO,
        f"git show {CAB}:ledger/claims/<id>.yml · o anfitrião do source_url de cada uma",
        "a da dívida pública da União vem do Eurostat", hosts.get("divida-publica-2025-ue") == "ec.europa.eu")

gemeas = [i[:-3] for i in da_uniao if mostrar(f"ledger/claims/{i[:-3]}.yml") is not None]
medicao("gemeas_portuguesas", len(gemeas) if da_uniao else NAO,
        f"git show {CAB}:ledger/claims/<id sem -ue>.yml · as que existem",
        "a linha portuguesa da dívida pública existe", "divida-publica-2025" in gemeas)

gemeas_eurostat = [g for g in gemeas if anfitriao(g) == "ec.europa.eu"]
medicao("gemeas_do_eurostat", len(gemeas_eurostat) if gemeas else NAO,
        "as mesmas, pelo anfitrião do source_url",
        "a linha portuguesa da dívida pública vem do Eurostat", "divida-publica-2025" in gemeas_eurostat)

reclamacoes = [f for f in listar("ledger/claims") if f.endswith(".yml")]
medicao("linhas_do_livro", len(reclamacoes) if reclamacoes else NAO,
        f"git ls-tree --name-only {CAB}:ledger/claims · os ficheiros .yml",
        "a linha da dívida pública está entre elas", "divida-publica-2025.yml" in reclamacoes)

series = listar("ledger/series")
medicao("linhas_de_serie_no_livro", len([f for f in series if f.endswith(".yml")]),
        f"git ls-tree --name-only {CAB}:ledger/series · os ficheiros .yml (a pasta não existir conta zero)",
        "o mesmo comando sobre ledger/claims lista ficheiros", bool(reclamacoes))

saida = {"brief": "design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md",
         "guiao": "design/observatorio/medidas/BRIEF-UE1.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-UE1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
