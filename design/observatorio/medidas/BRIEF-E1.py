#!/usr/bin/env python3
"""O §0 do brief E1 (os estudos de Évora, um conjunto coerente), medido sobre a cabeça presa do sítio (24ba5b17).
Não lê a rede: lê os documentos alojados dos estudos (studies-src/<estudo>/pt.html), os seus registos e o livro-razão
na cabeça. Escreve design/observatorio/medidas/BRIEF-E1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva
o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import html, json, os, pathlib, re, subprocess
import yaml

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "24ba5b17"
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


def texto(t):
    t = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", t, flags=re.S)
    return html.unescape(re.sub(r"<[^>]+>", " ", t))


estudos = sorted(e for e in listar("studies-src") if e.startswith("evora-"))
medicao("estudos_de_evora_alojados", len(estudos) if estudos else NAO, f"git ls-tree {CAB}:studies-src · as pastas que começam por evora-",
        "«evora-quinze-anos-cinco-mandatos» é uma delas", "evora-quinze-anos-cinco-mandatos" in estudos)
palavras, seccoes = {}, {}
for e in estudos:
    t = mostrar(f"studies-src/{e}/pt.html")
    if t is None:
        continue
    palavras[e] = len(texto(t).split())
    seccoes[e] = len(re.findall(r"<h2[\s>]", t))
medicao("palavras_dos_seis_estudos", sum(palavras.values()) if palavras else NAO, "as palavras do texto de studies-src/<estudo>/pt.html, somadas",
        "o mais longo tem mais de dez mil palavras", any(v > 10000 for v in palavras.values()))
medicao("estudos_com_mais_de_cinco_mil_palavras", len([v for v in palavras.values() if v > 5000]) if palavras else NAO,
        "os mesmos, contados acima de cinco mil", "«Quinze Anos» está entre eles", palavras.get("evora-quinze-anos-cinco-mandatos", 0) > 5000)
medicao("seccoes_dos_seis_estudos", sum(seccoes.values()) if seccoes else NAO, "os <h2> de cada pt.html, somados",
        "cada estudo tem mais de cinco secções", all(v > 5 for v in seccoes.values()) if seccoes else False)

linhas = [f for f in listar("ledger/claims") if f.endswith(".yml")]
por = {}
for f in linhas:
    d = yaml.safe_load(mostrar(f"ledger/claims/{f}") or "") or {}
    s = str(d.get("study") or "")
    if s.startswith("evora-"):
        por.setdefault(s, []).append(d.get("id"))
medicao("estudos_de_evora_com_linhas_no_livro", len(por) if linhas else NAO, f"git show {CAB}:ledger/claims/<id>.yml · o campo study que começa por evora-",
        "«evora-orcamentado-pago-devido-2025» tem linhas", "evora-orcamentado-pago-devido-2025" in por)
medicao("linhas_do_livro_dos_estudos_de_evora", sum(len(v) for v in por.values()) if linhas else NAO, "as mesmas, somadas",
        "a linha do prazo médio de pagamento de 2025 é uma delas", any(i == "evora-prazo-medio-de-pagamento-2025" for v in por.values() for i in v))
sem = [e for e in estudos if e not in por]
medicao("estudos_de_evora_sem_linhas_proprias", len(sem) if estudos else NAO, "os estudos alojados sem nenhuma linha com o seu study",
        "o estudo de 2027 é um deles", "evora-2027-prometido-painel-dinheiro" in sem)
contador = yaml.safe_load(mostrar("ledger/claims/estudos-evora-publicados.yml") or "") or {}
medicao("contador_dos_estudos_de_evora_publicados", str(contador.get("value")) if contador else NAO,
        f"git show {CAB}:ledger/claims/estudos-evora-publicados.yml · value", "a linha é derivada e tem check", bool(contador.get("check")))

saida = {"brief": "design/observatorio/BRIEF-E1-os-estudos-de-evora-um-conjunto-coerente.md", "guiao": "design/observatorio/medidas/BRIEF-E1.py",
         "cabeca_lida": CAB, "por_estudo": {e: {"palavras": palavras.get(e), "seccoes": seccoes.get(e), "linhas": len(por.get(e, []))} for e in estudos}, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-E1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
