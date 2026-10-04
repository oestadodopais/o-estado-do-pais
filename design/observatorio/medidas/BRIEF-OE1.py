#!/usr/bin/env python3
"""O §0 do brief OE1 (o dinheiro do Estado por ministério e por função, selado no motor), medido sobre a cabeça presa do
sítio (1c4dde2f). Não lê a rede: lê as linhas do livro e as áreas do governo declaradas. Escreve
design/observatorio/medidas/BRIEF-OE1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "1c4dde2f"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "-r", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return [f"{pasta}/{f}" for f in r.stdout.split()] if r.returncode == 0 else []


linhas = [f for f in listar("ledger/claims") if f.endswith(".yml")]
textos = {f: (mostrar(f) or "") for f in linhas}
def fonte(t):
    m = re.search(r'^source:\s*"(.*)"', t, re.M); return m.group(1) if m else ""
def url(t):
    m = re.search(r'^source_url:\s*"(.*)"', t, re.M); return m.group(1) if m else ""
medicao("linhas_do_livro", len(linhas) if linhas else NAO, f"git ls-tree -r {CAB}:ledger/claims · os .yml", "a da dívida pública de 2025 é uma delas", "ledger/claims/divida-publica-2025.yml" in linhas)
eo = [f for f, t in textos.items() if re.search(r"Entidade Orçamental|Direção-Geral do Orçamento|eo\.gov\.pt|dgo\.gov\.pt", fonte(t) + " " + url(t))]
dgal = [f for f, t in textos.items() if "DGAL" in fonte(t) or "dgal.gov.pt" in url(t)]
medicao("linhas_da_entidade_orcamental", len(eo) if linhas else NAO, "as linhas cuja fonte ou endereço é a Entidade Orçamental ou a antiga DGO", "o mesmo detetor acha a DGAL nas linhas das câmaras", len(dgal) > 0)
cofog = [f for f, t in textos.items() if re.search(r"gov_10a_exp|COFOG|classificação das funções", t)]
eurostat_gov = [f for f, t in textos.items() if re.search(r"gov_10dd|Government deficit", t)]
medicao("linhas_da_despesa_por_funcao_do_eurostat", len(cofog) if linhas else NAO, "as linhas que citam o conjunto gov_10a_exp ou a classificação das funções", "o mesmo detetor acha as linhas do défice e da dívida do Eurostat", len(eurostat_gov) > 0)
saldo = [f for f in linhas if "saldo-das-administracoes-publicas" in f]
divida = [f for f in linhas if f.split("/")[-1].startswith("divida-publica")]
medicao("linhas_do_saldo_das_administracoes_publicas", len(saldo) if linhas else NAO, "os ids que começam por saldo-das-administracoes-publicas", "a de 2025 é uma delas", any("2025" in f for f in saldo))
medicao("linhas_da_divida_publica", len(divida) if linhas else NAO, "os ids que começam por divida-publica", "a de 2025 na notificação do INE é uma delas", any("notificacao" in f for f in divida))
dados_gov = [f for f, t in textos.items() if "dados.gov.pt" in url(t)]
medicao("linhas_com_fonte_no_dados_gov", len(dados_gov) if linhas else NAO, "as linhas cujo endereço da fonte é no dados.gov.pt", "o mesmo detetor acha endereços do Eurostat", any("ec.europa.eu/eurostat" in url(t) for t in textos.values()))
areas = mostrar("src/data/areas.mjs") or ""
chaves = re.findall(r"^\s{2}\{\s*\n?\s*(?:slug|chave|id): '([a-z0-9-]+)'", areas, flags=re.M) or re.findall(r"slug: '([a-z0-9-]+)'", areas)
medicao("areas_do_governo_declaradas", len(chaves) if areas else NAO, f"git show {CAB}:src/data/areas.mjs · as entradas com slug", "as finanças são uma delas", "financas" in chaves)
evora_orc = [f for f in linhas if "evora-orcamento" in f]
medicao("linhas_do_orcamento_de_evora", len(evora_orc) if linhas else NAO, "os ids com evora-orcamento", "a de 2025", any("2025" in f for f in evora_orc))

saida = {"brief": "design/observatorio/BRIEF-OE1-o-dinheiro-do-estado-por-ministerio.md", "guiao": "design/observatorio/medidas/BRIEF-OE1.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-OE1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
