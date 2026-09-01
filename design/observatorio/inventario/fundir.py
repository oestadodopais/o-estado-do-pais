#!/usr/bin/env python3
"""Funde os lotes verificados (lote-*.json) e as candidatas das vagas 2 e 3 num
inventário único: INVENTARIO-DAS-FONTES.json (o registo inteiro) e as tabelas do
INVENTARIO-DAS-FONTES.md (geradas entre marcadores). Nada se digita nas tabelas:
tudo vem dos JSON. Nenhuma célula é truncada (a leitura do Codex de 01.09.2026
achou 436 células cortadas na primeira versão). O estado de cada linha é
CALCULADO pela regra de §0 (uma linha só é «verificada» se nenhuma das colunas
substantivas trouxer «[verify]»), e o estado que o verificador declarou fica ao
lado como `estado_declarado`. Uso: python3 fundir.py <pasta dos lotes> <ficheiro .md alvo>
"""
import json, sys, glob, os, re, datetime
from urllib.parse import urlparse

pasta, alvo = sys.argv[1], sys.argv[2]

DOM = {"E": ("1 · Economia e finanças públicas", "primeira"), "T": ("2 · Trabalho", "primeira"),
       "P": ("3 · População", "primeira"), "M": ("4 · Migração", "primeira"),
       "S": ("5 · Segurança social e pensões", "primeira"), "A": ("6 · Água", "primeira"),
       "D": ("7 · Educação", "primeira"), "H": ("8 · Saúde", "primeira")}
ORDEM = list(DOM.keys())

# as perguntas da carta, lidas dos briefs dos lotes (### <id> · ... / - Pergunta ...)
perguntas = {}
for f in sorted(glob.glob(os.path.join(pasta, "lote-*-linhas.md"))):
    cur = None
    for line in open(f, encoding="utf-8"):
        m = re.match(r"### ([A-Z]+\d+) · (.*)", line)
        if m:
            cur = m.group(1); continue
        m = re.match(r"- Pergunta(?: da carta)?: (.*)", line)
        if m and cur:
            perguntas[cur] = m.group(1).strip()

linhas = []
for f in sorted(glob.glob(os.path.join(pasta, "lote-*.json"))):
    if "linhas" in f: continue
    with open(f, encoding="utf-8") as fh:
        data = json.load(fh)
    for row in data:
        row["_lote"] = os.path.basename(f)
        letra = re.match(r"[A-Z]+", row["id"]).group(0)
        row["dominio"], row["vaga"] = DOM.get(letra, ("?", "?"))
        row["pergunta"] = perguntas.get(row["id"], "")
        linhas.append(row)

SUBSTANTIVAS = ["medida", "publicador_primario", "definicao", "serie_desde", "periodicidade",
                "ultimo_periodo", "publicado_em", "concelho", "url_maquina", "excerto", "valor_recente"]
OPERACIONAIS = ["calendario", "licenca"]

def tem_verify(v):
    return "[verify]" in (json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else str(v or ""))

def dominio_lido(r):
    urls = r.get("url_maquina")
    if isinstance(urls, list): urls = " ".join(str(u) for u in urls)
    hosts = []
    for u in re.findall(r"https?://[^\s\)\]\|,;«»\"']+", str(urls or "")):
        h = urlparse(u).netloc.lower()
        if h and h not in hosts: hosts.append(h)
    return ", ".join(hosts) if hosts else "(sem endereço de máquina)"

def numeros(s):
    return set(re.findall(r"\d[\d\s\.,]*\d|\d", str(s or "")))

for r in linhas:
    subs = [c for c in SUBSTANTIVAS if tem_verify(r.get(c))]
    oper = [c for c in OPERACIONAIS if tem_verify(r.get(c))]
    r["estado_declarado"] = r.get("estado")
    decl = (r.get("estado") or "").split()[0].lower()
    if decl == "errada":
        r["estado_calculado"] = "errada na formulação (a medida certa está nas células)"
    elif subs:
        r["estado_calculado"] = "parcial"
    else:
        r["estado_calculado"] = "verificada"
    r["colunas_com_verify"] = subs + oper
    r["so_calendario_ou_licenca_por_verificar"] = bool(oper) and not subs
    r["lido_em"] = dominio_lido(r)
    # números do valor recente que não aparecem no excerto (aproximação por cadeia)
    exc = re.sub(r"\s+", " ", str(r.get("excerto") or ""))
    faltam = []
    for n in numeros(r.get("valor_recente")):
        n2 = re.sub(r"\s+", " ", n).strip(" .,")
        if len(n2) >= 2 and n2 not in exc and n2.replace(" ", "") not in exc.replace(" ", ""):
            faltam.append(n2)
    r["valores_sem_excerto"] = sorted(set(faltam))

linhas.sort(key=lambda r: (ORDEM.index(re.match(r"[A-Z]+", r["id"]).group(0)), int(re.search(r"\d+", r["id"]).group(0))))

def cel(x):
    if x is None: return ""
    if isinstance(x, (list, dict)): x = json.dumps(x, ensure_ascii=False)
    return str(x).replace("|", "\\|").replace("\n", " ").strip()

# tabela compacta, sem truncar
cab = ("| id | domínio | medida (como publicada) | publicador primário (o redistribuidor entre parênteses) | lido em (o domínio do endereço de máquina) "
       "| série desde · periodicidade | último período · última atualização ou publicação | calendário | concelho | licença | estado calculado (declarado pelo verificador) | colunas com [verify] |\n"
       "|---|---|---|---|---|---|---|---|---|---|---|---|\n")
tab = cab
for r in linhas:
    tab += "| " + " | ".join([
        cel(r["id"]), cel(r["dominio"]), cel(r.get("medida")),
        cel(r.get("publicador_primario")) + (" (" + cel(r.get("publicador_secundario")) + ")" if r.get("publicador_secundario") else ""),
        cel(r["lido_em"]),
        cel(r.get("serie_desde")) + " · " + cel(r.get("periodicidade")),
        cel(r.get("ultimo_periodo")) + " · " + cel(r.get("publicado_em")),
        cel(r.get("calendario")) + (" · " + cel(r.get("calendario_url")) if r.get("calendario_url") else ""),
        cel(r.get("concelho")), cel(r.get("licenca")) + (" · " + cel(r.get("licenca_url")) if r.get("licenca_url") else ""),
        cel(r["estado_calculado"]) + " (" + cel(r["estado_declarado"]) + ")",
        ", ".join(r["colunas_com_verify"]) or "nenhuma",
    ]) + " |\n"

# as linhas por inteiro
CAMPOS = [("pergunta", "a pergunta da carta"), ("medida", "medida"), ("publicador_primario", "publicador primário"),
          ("publicador_secundario", "publicador secundário"), ("lido_em", "lido em"), ("definicao", "definição"),
          ("definicao_url", "endereço da definição"), ("serie_desde", "série desde"), ("periodicidade", "periodicidade"),
          ("ultimo_periodo", "último período"), ("publicado_em", "última atualização ou publicação, tal como o verificador a leu"),
          ("calendario", "calendário"), ("calendario_url", "endereço do calendário"), ("concelho", "concelho"),
          ("licenca", "licença"), ("licenca_url", "endereço da licença"), ("url_maquina", "endereço de máquina"),
          ("url_pagina", "endereço de leitura"), ("acesso", "acesso"), ("http", "HTTP"), ("excerto", "excerto"),
          ("valor_recente", "valor recente, tal como o verificador o leu (indicativo; o que se publica é a linha do livro-razão)"),
          ("valores_sem_excerto", "números do valor recente que não estão no excerto"),
          ("comparacao", "comparação que a fonte permite"), ("notas", "notas"),
          ("estado_declarado", "estado declarado pelo verificador"), ("estado_calculado", "estado calculado pela regra de §0"),
          ("colunas_com_verify", "colunas com [verify]"), ("_lote", "lote")]
inteiro = ""
for r in linhas:
    inteiro += f"\n#### {r['id']} · {cel(r.get('medida'))}\n\n"
    for k, rot in CAMPOS:
        v = r.get(k)
        if v in (None, "", [], {}): continue
        if isinstance(v, (list, dict)): v = json.dumps(v, ensure_ascii=False)
        v = str(v).replace("\n", " ").strip()
        inteiro += f"- **{rot}**: {v}\n"

cand_path = os.path.join(pasta, "candidatas-vagas-2-3.json")
cand = json.load(open(cand_path, encoding="utf-8"))
tab2 = ("| id | domínio | vaga | pergunta | medida candidata | publicador provável | concelho | pista | estado |\n|---|---|---|---|---|---|---|---|---|\n")
for c in cand:
    tab2 += "| " + " | ".join(cel(c.get(k)) for k in ["id", "dominio", "vaga", "pergunta", "medida", "publicador_primario", "concelho", "fonte_pista", "estado"]) + " |\n"

resumo = {}
for r in linhas:
    e = r["estado_calculado"].split()[0]
    resumo[e] = resumo.get(e, 0) + 1
so_oper = sum(1 for r in linhas if r["so_calendario_ou_licenca_por_verificar"])
declarado = {}
for r in linhas:
    e = (r["estado_declarado"] or "?").split()[0].lower()
    declarado[e] = declarado.get(e, 0) + 1

gerado = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
with open(os.path.join(pasta, "INVENTARIO-DAS-FONTES.json"), "w", encoding="utf-8") as fh:
    json.dump({"gerado_em": gerado, "nota": "gerado por fundir.py a partir de lote-1.json a lote-4.json e candidatas-vagas-2-3.json; os estados calculados seguem a regra de §0 do INVENTARIO-DAS-FONTES.md",
               "primeira_vaga": linhas, "candidatas_vagas_2_3": cand}, fh, ensure_ascii=False, indent=1)

md = open(alvo, encoding="utf-8").read()
def subst(md, marca, corpo):
    a, b = f"<!-- {marca}:inicio -->", f"<!-- {marca}:fim -->"
    i, j = md.index(a) + len(a), md.index(b)
    return md[:i] + "\n" + corpo + "\n" + md[j:]
md = subst(md, "primeira-vaga", tab)
md = subst(md, "linhas-inteiras", inteiro)
md = subst(md, "candidatas", tab2)
md = subst(md, "resumo",
           f"Gerado a {gerado}. Linhas da primeira vaga: {len(linhas)}. Estado calculado pela regra de §0: "
           + " · ".join(f"{k}: {v}" for k, v in sorted(resumo.items()))
           + f". Estado declarado pelos verificadores: " + " · ".join(f"{k}: {v}" for k, v in sorted(declarado.items()))
           + f". Linhas em que o único `[verify]` está no calendário ou na licença: {so_oper}. Candidatas das vagas 2 e 3: {len(cand)}.")
open(alvo, "w", encoding="utf-8").write(md)
print("fundido:", len(linhas), "linhas;", resumo, "; só calendário/licença:", so_oper, "; declarado:", declarado, "; candidatas:", len(cand))
for r in linhas:
    print(f"  {r['id']:4} calc={r['estado_calculado'].split()[0]:11} decl={(r['estado_declarado'] or '?').split()[0]:11} verify={','.join(r['colunas_com_verify']) or '-'} sem_excerto={len(r['valores_sem_excerto'])}")
