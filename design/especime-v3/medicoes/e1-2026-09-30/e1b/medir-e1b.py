#!/usr/bin/env python3
"""E1b · as medidas da passagem E1b, escritas em medidas.json, na chave «e1b», ao lado do guião do E1.

    OEDP_MOTOR=<árvore do motor> python3 design/especime-v3/medicoes/e1-2026-09-30/e1b/medir-e1b.py

Corre da raiz do sítio, depois da corrida dos portões na cabeça de código (o dist/ é o dessa
construção, e o guião confere-o pelo version.json), das plantas, das capturas e do portão do motor. Cada medida traz o nome, o
valor, o comando que a dá e um conhecido-positivo: o mesmo detetor corrido sobre uma entrada cuja
resposta se sabe, para provar que vê. As medidas do E1 ficam como o construtor anterior as escreveu,
nas mesmas chaves; esta passagem acrescenta a chave «e1b» e não toca nas outras. Nenhum caminho da
máquina vai para o ficheiro.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
SITIO = AQUI.parents[4]
if not os.environ.get("OEDP_MOTOR"):
    sys.exit("Falta OEDP_MOTOR: a árvore do motor na cabeça da passagem.")
MOTOR = Path(os.environ["OEDP_MOTOR"]).resolve()
DIST = SITIO / "dist"
MEDIDAS = []
# A corrida dos três portões na cabeça de código (a que o relatório cita); a corrida final, na cabeça
# do relatório, fica em portoes/e1b/ e entra no commit seguinte, e por isso esta medida não a lê.
CORRIDA = os.environ.get("OEDP_E1B_CORRIDA", "portoes/e1b-intermedias/3")

# As referências fixas da passagem, lidas do git e escritas aqui pelo que são.
BASE_DO_SITIO = "main"
CABECA_ANTES_DO_REBASE = "3741a05b"     # o primeiro commit desta passagem, antes do rebase
BASE_ANTIGA = "07549ee1"                # a base do ramo antes do rebase
ANTES_DOS_CONTADORES = "90b1ba0a"       # a cabeça do rebase, antes das datas e dos contadores
COMMIT_DOS_DOCUMENTOS_ANTIGO = "8e2fe1d604f84a4c386f1e34f90b676b76bb26a9"
BASE_DO_MOTOR = "6ed528b"               # a cabeça do motor que o construtor anterior deixou
MASTER_DO_MOTOR = "master"

NOVOS = {
    "evora-contas-da-camara-2010-2025": "16 Évora Contas da Câmara",
    "evora-quem-governou-a-camara-2009-2025": "17 Évora Quem Governou",
    "evora-economia-e-dinheiro-publico-de-fora-da-camara": "18 Évora Economia e Dinheiro de Fora",
    "evora-2027-capital-europeia-da-cultura": "19 Évora 2027 Capital Europeia da Cultura",
}


def corre(args, cwd=SITIO, ok=True):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if ok and r.returncode != 0:
        raise RuntimeError(f"{' '.join(map(str, args[:4]))} falhou ({r.returncode}): {r.stderr[-600:]}")
    return r.stdout


def git(*a, cwd=SITIO, ok=True):
    return corre(["git", "-c", "core.quotepath=off", *a], cwd=cwd, ok=ok)


def mostra(ref, caminho, cwd):
    return subprocess.run(["git", "show", f"{ref}:{caminho}"], cwd=cwd, capture_output=True).stdout


def medida(nome, valor, comando, conhecido_positivo, **extra):
    MEDIDAS.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": conhecido_positivo, **extra})
    print(f"  {nome}: {json.dumps(valor, ensure_ascii=False)[:180]}")


def sha256(b):
    return hashlib.sha256(b).hexdigest()


def visivel_html(texto):
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", texto, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    for a, b in (("&nbsp;", " "), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&#39;", "'"), ("&#x27;", "'")):
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t.replace(" ", " ").replace(" ", " ")).strip()


def lido_md(t):
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = t.replace("**", "")
    return re.sub(r"\s+", " ", t.replace(" ", " ").replace(" ", " "))


def edicoes_do_motor(pasta, ref):
    saida = {}
    for lingua in ("pt", "en"):
        g = mostra(ref, f"content/{pasta}/Technical Source/documento.{lingua}.md.tmpl", MOTOR).decode("utf-8")
        linha = next((l for l in g.splitlines() if l.startswith("@@edicao ")), None)
        if linha:
            saida[lingua] = f"content/{pasta}/{linha[len('@@edicao '):].strip()}"
    return saida


def node_json(js, *args):
    return json.loads(corre(["node", "--input-type=module", "-e", js, *args]))


# ------------------------------------------------------------------ as cabeças
def medir_cabecas():
    codigo = (BLOCO / CORRIDA / "cabeca").read_text().strip()
    s = {"cabeca_de_codigo": codigo, "cabeca_na_medida": git("rev-parse", "HEAD").strip(),
         "base": git("rev-parse", BASE_DO_SITIO).strip()}
    m = {"cabeca": git("rev-parse", "HEAD", cwd=MOTOR).strip(), "master": git("rev-parse", MASTER_DO_MOTOR, cwd=MOTOR).strip(),
         "cabeca_do_construtor_anterior": git("rev-parse", BASE_DO_MOTOR, cwd=MOTOR).strip()}
    tipos = [git("cat-file", "-t", x).strip() for x in s.values()] + [git("cat-file", "-t", x, cwd=MOTOR).strip() for x in m.values()]
    medida("cabecas_e1b", {"sitio": s, "motor": m},
           f"git rev-parse nas duas árvores; a cabeça de código é a que {CORRIDA}/cabeca diz",
           {"descricao": "git cat-file -t de cada cabeça diz «commit»", "mordeu": all(t == "commit" for t in tipos)})
    return codigo


# ------------------------------------------------------------------ o rebase
def medir_rebase(codigo):
    base = git("rev-parse", BASE_DO_SITIO).strip()
    mb = git("merge-base", codigo, BASE_DO_SITIO).strip()
    antigos = git("log", "--reverse", "--format=%H%x09%s", f"{BASE_ANTIGA}..{CABECA_ANTES_DO_REBASE}").splitlines()
    novos = git("log", "--reverse", "--format=%H%x09%s", f"{BASE_DO_SITIO}..{codigo}").splitlines()
    por_assunto = {}
    for l in novos:
        h, s = l.split("\t", 1)
        por_assunto.setdefault(s, []).append(h)
    mapa = []
    for l in antigos:
        h, s = l.split("\t", 1)
        mapa.append({"antes": h[:8], "depois": (por_assunto.get(s) or [None])[0], "assunto": s})
    registo = (AQUI / "rebase-e1b.log").read_text(encoding="utf-8")
    conflitos = re.findall(r"CONFLICT \(content\): Merge conflict in (\S+)", registo)
    mb_antes = git("merge-base", CABECA_ANTES_DO_REBASE, BASE_DO_SITIO).strip()
    medida("rebase_sobre_main", {"base": base[:8], "merge_base_da_cabeca": mb[:8], "rebaseado": mb == base,
                                 "commits_reposicionados": sum(1 for x in mapa if x["depois"]), "commits_antes": len(mapa),
                                 "conflitos": conflitos, "mapa": [{**x, "depois": x["depois"][:8] if x["depois"] else None} for x in mapa]},
           "git merge-base <cabeça de código> main; git log das duas gamas emparelhado pelo assunto; os conflitos lidos do registo do rebase (rebase-e1b.log)",
           {"descricao": "a cabeça de antes do rebase tem a base antiga por merge-base, e o detetor diz que não estava rebaseada",
            "mordeu": mb_antes != base and mb_antes.startswith(git("rev-parse", BASE_ANTIGA).strip()[:8])})


def medir_datas():
    dados = json.loads((SITIO / "src/data/datas-de-publicacao.json").read_text(encoding="utf-8"))
    antes = json.loads(mostra(ANTES_DOS_CONTADORES, "src/data/datas-de-publicacao.json", SITIO))
    def confere(lista):
        res = []
        for e in lista:
            if e["slug"] not in NOVOS:
                continue
            l = git("log", "--diff-filter=A", "--format=%ad %H", "--date=short", "--", e["ficheiro"]).split()
            res.append({"edicao": f"{e['slug']}/{e['lang']}", "data": e["data"], "commit": e["commit"][:8],
                        "git": (l[1][:8] if len(l) > 1 else None), "bate": len(l) > 1 and l[1] == e["commit"] and l[0] == e["data"]})
        return res
    agora = confere(dados["edicoes"])
    velho = confere(antes["edicoes"])
    medida("datas_de_publicacao", {"edicoes_novas": len(agora), "batem_com_o_git": sum(x["bate"] for x in agora),
                                   "com_o_commit_antigo": sum(1 for e in dados["edicoes"] if e["commit"] == COMMIT_DOS_DOCUMENTOS_ANTIGO),
                                   "datas": sorted({x["data"] for x in agora}), "edicoes": agora},
           "src/data/datas-de-publicacao.json contra git log --diff-filter=A --format='%ad %H' --date=short -- <ficheiro>",
           {"descricao": "o mesmo ficheiro antes da passagem (90b1ba0a) aponta para o commit de antes do rebase, e o detetor dá-o por não bater",
            "mordeu": sum(x["bate"] for x in velho) == 0 and len(velho) == 7})


# ------------------------------------------------------------------ os contadores
def medir_contadores():
    import yaml
    js = ("const m = await import(process.argv[1]); const l = await import(process.argv[2]);"
          "console.log(JSON.stringify({counts: m.COUNTS, lugares: l.LUGAR_DECLARADO_DAS_LINHAS}))")
    d = node_json(js, (SITIO / "src/data/studies.mjs").as_uri(), (SITIO / "src/data/lugar-das-linhas.mjs").as_uri())
    hist = json.loads((SITIO / "ledger/historias-valores.json").read_text(encoding="utf-8"))
    cheques = {"estudos-publicados": "estudos_no_arquivo", "edicoes-publicadas": "edicoes_no_arquivo"}
    valor = {}
    for i, chk in cheques.items():
        c = yaml.safe_load((SITIO / f"ledger/claims/{i}.yml").read_text(encoding="utf-8"))
        valor[i] = {"valor": c["value"], "conta": d["counts"][chk], "bate": str(d["counts"][chk]) == c["value"],
                    "check": c["check"], "edicao": c["document"]["edition"],
                    "entradas": [{k: e[k] for k in ("date", "kind", "old_value", "new_value")} for e in c.get("corrections") or []],
                    "seladas": hist.get(i, []), "lugar_declarado": d["lugares"].get(i)}
    antes = {i: yaml.safe_load(mostra(ANTES_DOS_CONTADORES, f"ledger/claims/{i}.yml", SITIO).decode("utf-8"))["value"] for i in cheques}
    mordeu = all(str(d["counts"][chk]) != antes[i] for i, chk in cheques.items())
    medida("contadores_do_arquivo", valor,
           "as duas linhas em ledger/claims, COUNTS de src/data/studies.mjs, ledger/historias-valores.json e LUGAR_DECLARADO_DAS_LINHAS, lidos pelos próprios módulos",
           {"descricao": "as mesmas linhas antes da passagem (90b1ba0a) diziam 13 e 18 contra a conta de hoje do arquivo, e o detetor vê a diferença",
            "mordeu": mordeu, "antes": antes})


def medir_plantas_dos_contadores():
    p = json.loads((AQUI / "plantas-contadores-e1b.json").read_text(encoding="utf-8"))
    medida("plantas_dos_contadores", {"mordidas": p["mordidas"], "total": p["total"],
                                      "plantas": [{"nome": x["nome"], "codigo": x["codigo"], "esperado": x["esperado"], "mordeu": x["mordeu"]} for x in p["plantas"]]},
           "node design/especime-v3/medicoes/e1-2026-09-30/e1b/provar-contadores-e1b.mjs --json e1b/plantas-contadores-e1b.json",
           {"descricao": "os dois portões sem estrago saem com 0 (o conhecido-negativo), e cada estrago dá 1 com a queixa esperada",
            "mordeu": p["mordidas"] == p["total"] and p["total"] > 2})


# ------------------------------------------------------------------ as emendas
EMENDAS = [
    ("18", "pt", "Évora é uma cidade relativamente próspera numa região pobre", "Évora é um concelho relativamente próspero numa região abaixo da média do país"),
    ("18", "en", "Évora is a relatively prosperous town in a poor region", "Évora is a relatively prosperous municipality in a region below the national average"),
    ("18", "pt", "geraram 576 491 544 euros de valor acrescentado", "geraram €576 491 544 de valor acrescentado"),
    ("18", "en", "generated 576 491 544 euros of value added", "generated €576 491 544 of value added"),
    ("18", "pt", "é de 23 004 euros, contra 31 900 no país", "é de €23 004, contra €31 900 no país"),
    ("18", "en", "is 23 004 euros, against 31 900 in the country", "is €23 004, against €31 900 in the country"),
    ("19", "pt", "A ano e meio de 2027", "A um ano e meio de 2027"),
    ("16", "pt", "a parte de 2026 das obras do «Évora 2027» financiadas pelo plano de recuperação", "a parte de 2026 do projeto «Évora 2027» financiado pelo plano de recuperação"),
    ("16", "en", "the 2026 share of the recovery-plan-funded «Évora 2027» works", "the 2026 share of the recovery-plan-funded «Évora 2027» project"),
]
# A emenda do 16 é na tabela do Évora 2027 no orçamento de 2026 (o achado 2 do §6 do E1), no corpo do
# estudo, e não na abertura: conta-se no documento inteiro, onde a frase da tabela é única.
NO_DOCUMENTO_INTEIRO = {"16"}
PASTAS = {"16": "16 Évora Contas da Câmara", "18": "18 Évora Economia e Dinheiro de Fora", "19": "19 Évora 2027 Capital Europeia da Cultura"}
SLUGS = {"16": "evora-contas-da-camara-2010-2025", "18": "evora-economia-e-dinheiro-publico-de-fora-da-camara", "19": "evora-2027-capital-europeia-da-cultura"}


def medir_emendas():
    cab = git("rev-parse", "HEAD", cwd=MOTOR).strip()
    res, positivos = [], []
    # Só a leitura de abertura (até «Os limites deste documento»): o corpo é texto copiado dos estudos
    # antigos, fica como estava, e pode repetir uma frase da abertura (o 18 repete a do valor acrescentado).
    limite = {"pt": "Os limites deste documento", "en": "The limits of this document"}
    def abertura(texto, lingua):
        i = texto.find(limite[lingua])
        return texto[:i] if i >= 0 else texto
    for est, lingua, velho, novo in EMENDAS:
        md = edicoes_do_motor(PASTAS[est], cab)[lingua]
        corte = (lambda t, l: t) if est in NO_DOCUMENTO_INTEIRO else abertura
        agora = corte(lido_md(mostra(cab, md, MOTOR).decode("utf-8")), lingua)
        antes = corte(lido_md(mostra(BASE_DO_MOTOR, md, MOTOR).decode("utf-8")), lingua)
        alojado = corte(visivel_html((SITIO / f"studies-src/{SLUGS[est]}/{lingua}.html").read_text(encoding="utf-8")), lingua)
        res.append({"estudo": est, "lingua": lingua, "onde": "documento" if est in NO_DOCUMENTO_INTEIRO else "abertura", "velho": velho, "novo": novo,
                    "velho_no_motor": agora.count(velho), "novo_no_motor": agora.count(novo),
                    "velho_no_alojado": alojado.count(velho), "novo_no_alojado": alojado.count(novo)})
        positivos.append(antes.count(velho) >= 1)
    # os negritos das frases de abertura de «O que este projeto conclui» no 19
    negritos = {}
    for lingua, titulo, fim in (("pt", "## O que este projeto conclui", "## O que podia funcionar melhor"), ("en", "## What this project concludes", "## What could work better")):
        md = edicoes_do_motor(PASTAS["19"], cab)[lingua]
        def conta(ref):
            t = mostra(ref, md, MOTOR).decode("utf-8")
            seccao = t[t.index(titulo):t.index(fim)]
            return sum(1 for l in seccao.splitlines() if l.startswith("**"))
        negritos[lingua] = {"antes": conta(BASE_DO_MOTOR), "depois": conta(cab)}
    ok = all(r["velho_no_motor"] == 0 and r["novo_no_motor"] == 1 and r["velho_no_alojado"] == 0 and r["novo_no_alojado"] == 1 for r in res) \
        and all(v["depois"] == 0 for v in negritos.values())
    medida("emendas_das_aberturas", {"todas_feitas": ok, "trocas": res, "negritos_do_19_em_o_que_este_projeto_conclui": negritos},
           "cada frase velha e nova contada na leitura de abertura (até «Os limites deste documento»; a do 16, no documento inteiro) do .md do motor na cabeça (git show) e do texto visível do documento alojado no sítio; os parágrafos que abrem com negrito na secção, antes (6ed528b) e depois",
           {"descricao": "cada frase velha é encontrada pelo mesmo detetor no .md do motor antes da passagem (6ed528b), e os negritos antes são cinco por edição",
            "mordeu": all(positivos) and all(v["antes"] == 5 for v in negritos.values())})


def medir_sinal_do_euro():
    antes_re = re.compile(r"€\s?\d")
    depois_re = re.compile(r"\d[\d  .,]*\s?€")
    palavra_re = re.compile(r"\d[\d  .,]*\s(?:euros|euro)\b")
    def conta(t):
        return {"sinal_antes": len(antes_re.findall(t)), "sinal_depois": len(depois_re.findall(t)), "palavra": len(palavra_re.findall(t))}
    cab = git("rev-parse", "HEAD", cwd=MOTOR).strip()
    res = {}
    for slug, pasta in NOVOS.items():
        for lingua, md in edicoes_do_motor(pasta, cab).items():
            for ref, rot in ((BASE_DO_MOTOR, "antes"), (cab, "depois")):
                t = mostra(ref, md, MOTOR).decode("utf-8")
                corte = t.find("\n## Os limites" if lingua == "pt" else "\n## The limits")
                res.setdefault(f"{pasta[:2]} {lingua}", {})[rot] = {"abertura": conta(t[:corte]), "corpo": conta(t[corte:])}
    planta = conta("€576 491 544 e 45 784 603,10 € e 23 004 euros")
    medida("sinal_do_euro", res,
           "as formas €N, N € e N euros contadas na leitura de abertura (até «Os limites deste documento») e no corpo de cada edição do motor, antes (6ed528b) e depois",
           {"descricao": "uma cadeia plantada com uma forma de cada dá 1, 1 e 1", "mordeu": planta == {"sinal_antes": 1, "sinal_depois": 1, "palavra": 1}})


def medir_cortes():
    cab = git("rev-parse", "HEAD", cwd=MOTOR).strip()
    res = []
    for est in ("16", "18", "19"):
        for p in git("ls-tree", "--name-only", cab, f"content/{PASTAS[est]}/", cwd=MOTOR).splitlines():
            if p.endswith(".cortes.json"):
                a, b = mostra(BASE_DO_MOTOR, p, MOTOR), mostra(cab, p, MOTOR)
                res.append({"ficheiro": p.split("/")[-1], "igual": sha256(a) == sha256(b), "operacoes": len(json.loads(b)["operacoes"])})
    planta = len(json.loads(json.dumps({"operacoes": [{"tipo": "corte"}]}))["operacoes"])
    medida("cortes_inalterados", {"ficheiros": len(res), "iguais": sum(r["igual"] for r in res), "operacoes": sum(r["operacoes"] for r in res), "lista": res},
           "sha256 de cada .cortes.json do 16, do 18 e do 19 no motor antes (6ed528b) e na cabeça, e o comprimento da lista «operacoes»",
           {"descricao": "o leitor da lista conta 1 num ficheiro plantado com uma operação", "mordeu": planta == 1})


def medir_travessia():
    reg = json.loads((SITIO / "registos/manifest.json").read_text(encoding="utf-8"))
    import yaml
    man = yaml.safe_load((SITIO / "studies-src/manifest.yml").read_text(encoding="utf-8"))
    cab = git("rev-parse", "HEAD", cwd=MOTOR).strip()
    registos, documentos = [], []
    for est in ("16", "18", "19"):
        for lingua in ("pt", "en"):
            chave = f"{SLUGS[est]}/{lingua}"
            e = reg["registos"][chave] if "registos" in reg else reg[chave]
            ficheiro = SITIO / "registos" / SLUGS[est] / f"{lingua}.record.json"
            registos.append({"edicao": chave, "commit": e["origin_ref"].split(" @ ")[-1][:7],
                             "resumo_bate": sha256(ficheiro.read_bytes()) == e["exported_record_sha256"] == e["origin_record_sha256"]})
            linha = next(x for x in man["edicoes"] if x["slug"] == SLUGS[est] and x["lang"] == lingua)
            alojado = SITIO / "studies-src" / SLUGS[est] / f"{lingua}.html"
            no_motor = mostra(linha["origin_ref"].split(" @ ")[-1], linha["origin_ref"].split(" @ ")[0], MOTOR)
            documentos.append({"edicao": chave, "commit": linha["origin_ref"].split(" @ ")[-1][:7],
                               "resumo_bate": sha256(alojado.read_bytes()) == linha["sha256_normalized"] == sha256(no_motor)})
    codigos = {n: int((AQUI / f"{n}.codigo").read_text().strip()) for n in ("check-documentos", "check-documentos-com-origem")}
    antigo = yaml.safe_load(mostra(ANTES_DOS_CONTADORES, "studies-src/manifest.yml", SITIO).decode("utf-8"))
    l16 = next(x for x in antigo["edicoes"] if x["slug"] == SLUGS["16"] and x["lang"] == "pt")
    medida("travessia_e1b", {"registos": registos, "documentos": documentos, "codigos": codigos,
                             "cabeca_do_motor": cab[:7]},
           "registos/manifest.json e studies-src/manifest.yml do sítio contra os bytes em disco e contra git show <commit>:<ficheiro> no motor; os códigos do check:documentos lidos dos ficheiros",
           {"descricao": "o resumo que o manifesto de antes da passagem dava ao documento do 16 já não é o dos bytes alojados",
            "mordeu": l16["sha256_normalized"] != sha256((SITIO / f"studies-src/{SLUGS['16']}/pt.html").read_bytes())})


def medir_leituras():
    depois = json.loads((AQUI / "conferir-leituras-e1b.json").read_text(encoding="utf-8"))
    antes = json.loads((AQUI / "conferir-leituras-e1b-antes.json").read_text(encoding="utf-8"))
    medida("leituras_conferidas", {"falhas_antes": antes["falhas"], "falhas_depois": depois["falhas"],
                                   "estudos": [{"slug": e["slug"], **{l: x.get("bate") for l, x in e.get("edicoes", {}).items()}} for e in depois["estudos"]]},
           "node design/especime-v3/medicoes/e1-2026-09-30/e1b/conferir-leituras-e1b.mjs <motor> --json …, antes da correção da origem do 18 e depois",
           {"descricao": "o detetor diz «não está» às duas frases que as emendas tiraram do motor e a uma cópia com uma palavra trocada",
            "mordeu": all(p["mordeu"] for p in depois["positivos"])})


def medir_paginas():
    versao = json.loads((DIST / "version.json").read_text(encoding="utf-8"))
    codigo = (BLOCO / CORRIDA / "cabeca").read_text().strip()
    mapa = "".join(p.read_text(encoding="utf-8") for p in DIST.glob("sitemap*.xml"))
    def robots(rota):
        t = (DIST / rota.strip("/") / "index.html").read_text(encoding="utf-8")
        m = re.search(r'<meta name="robots" content="([^"]+)"', t)
        return m.group(1) if m else None
    res = {}
    for rota in ("/estudos/evora-2027-capital-europeia-da-cultura", "/en/studies/evora-2027-capital-europeia-da-cultura"):
        res[rota] = {"robots": robots(rota), "no_mapa_do_sitio": (rota + "<") in mapa or (rota + "/<") in mapa}
    antiga = "/estudos/evora-2027-prometido-painel-dinheiro"
    # a página inglesa do 17: o documento é o português, com as notas dos antecessores
    t17 = (DIST / "en/studies/evora-quem-governou-a-camara-2009-2025/index.html").read_text(encoding="utf-8")
    t16 = (DIST / "en/studies/evora-contas-da-camara-2010-2025/index.html").read_text(encoding="utf-8")
    m16 = re.search(r'data-registo-edicao="([^"]+)"', t16)
    publicado = re.search(r'<p class="estudo-publicado" data-estudo-edicao="([^"]+)"><a href="([^"]+)" hreflang="([^"]+)"', t17)
    p17 = {"edicao_mostrada": publicado.group(1) if publicado else None, "porta_do_documento": publicado.group(2) if publicado else None,
           "lingua_do_documento": publicado.group(3) if publicado else None,
           "titulo_em_portugues": bool(re.search(r'<h1 class="estudo-titulo"[^>]*lang="pt-PT"', t17)),
           "nota_dos_antecessores": len(re.findall(r'data-antecessores="', t17))}
    lista = (DIST / "estudos/index.html").read_text(encoding="utf-8")
    item = re.search(r'data-estudo="evora-2027-capital-europeia-da-cultura".*?</article>', lista, flags=re.S)
    resumo = visivel_html(re.search(r'class="arquivo-desc estudo-resumo"[^>]*>(.*?)</p>', item.group(0), flags=re.S).group(1)) if item else None
    medida("leitura_do_19_e_pagina_inglesa_do_17",
           {"construcao": versao.get("commit"), "da_cabeca_de_codigo": versao.get("commit") == codigo, "evora_2027": res,
            "resumo_na_lista": resumo, "pagina_inglesa_do_17": p17},
           "o dist/ da construção da corrida dos portões na cabeça de código: a meta robots e o mapa do sítio das duas páginas do 19, o resumo da lista dos estudos, e o documento da página inglesa do 17",
           {"descricao": "a edição datada do Évora 2027 de setembro tem noindex e não está no mapa do sítio, e a página inglesa do 16 rende o documento inglês",
            "mordeu": (robots(antiga) or "").startswith("noindex") and (antiga + "<") not in mapa and (antiga + "/<") not in mapa
                      and bool(m16) and m16.group(1).endswith("/en")})


def medir_divida_17():
    cab = git("rev-parse", "HEAD", cwd=MOTOR).strip()
    reg = json.loads((SITIO / "registos/manifest.json").read_text(encoding="utf-8"))
    entradas = reg.get("registos", reg)
    res = {}
    for pasta, chave in (("08 Évora Mandates", "evora-quinze-anos-cinco-mandatos/en"), ("09 Évora Pelouros", "evora-os-pelouros-quem-os-teve-o-que-fizeram/en")):
        recs = [p for p in git("ls-tree", "--name-only", cab, f"content/{pasta}/", cwd=MOTOR).splitlines() if p.endswith(".record.json")]
        en = [json.loads(mostra(cab, p, MOTOR)) for p in recs]
        en = [r for r in en if r.get("lang") == "en"]
        res[pasta] = {"registo_ingles_no_motor": len(en) == 1, "blocos": len(en[0]["blocks"]) if en else None, "alojado_no_sitio": chave in entradas}
    gabarito_en_17 = bool(mostra(cab, "content/17 Évora Quem Governou/Technical Source/documento.en.md.tmpl", MOTOR))
    gabarito_en_16 = bool(mostra(cab, "content/16 Évora Contas da Câmara/Technical Source/documento.en.md.tmpl", MOTOR))
    medida("divida_da_edicao_inglesa_do_17", {"fontes_inglesas": res, "gabarito_ingles_do_17": gabarito_en_17},
           "git ls-tree e git show na cabeça do motor (os registos ingleses do 08 e do 09 e o gabarito inglês do 17); registos/manifest.json do sítio",
           {"descricao": "o mesmo detetor vê o gabarito inglês do 16", "mordeu": gabarito_en_16})


def medir_portoes():
    queixa = re.compile(r"problema\(s\)|^\s*✗ |por classificar|ACIMA DO TETO|falha\(s\):")
    def ler(pasta):
        r = {"cabeca": (pasta / "cabeca").read_text().strip() if (pasta / "cabeca").exists() else None}
        for g in ("build", "verify", "typecheck"):
            f = pasta / f"{g}.codigo"
            r[g] = int(f.read_text().strip()) if f.exists() else None
            for x in ("inicio", "fim"):
                fx = pasta / f"{g}.{x}"
                r[f"{g}_{x}"] = fx.read_text().strip() if fx.exists() else None
            lg = pasta / f"{g}.log"
            if r[g] and lg.exists():
                linhas = [re.sub(r"\x1b\[[0-9;]*m", "", l) for l in lg.read_text(encoding="utf-8", errors="replace").splitlines()]
                r[f"{g}_queixas"] = [l.strip()[:240] for l in linhas if queixa.search(l) and '"queixa"' not in l and '"mordida"' not in l][:8]
        return r
    corrida = ler(BLOCO / CORRIDA)
    intermedias = {p.name: ler(p) for p in sorted((BLOCO / "portoes/e1b-intermedias").glob("*")) if p.is_dir()}
    motor = AQUI / "motor"
    m = {"codigo": int((motor / "gate.codigo").read_text().strip()), "cabeca": (motor / "cabeca").read_text().strip(),
         "ultima_linha": (motor / "gate.log").read_text(encoding="utf-8").strip().splitlines()[-1]}
    medida("portoes_e1b", {"sitio_cabeca_de_codigo": corrida, "sitio_corridas": intermedias, "motor": m},
           "os ficheiros .codigo que scripts/leituras/portoes.sh escreve depois de cada processo, e o do portão do motor (python3 -m core.gate)",
           {"descricao": "o código do portão do motor concorda com a última linha do seu registo (PASS com 0, FAIL sem 0)",
            "mordeu": (m["codigo"] == 0) == m["ultima_linha"].endswith("PASS")})


def medir_capturas():
    man = json.loads((BLOCO / "capturas-e1b.json").read_text(encoding="utf-8"))
    conferidas = sum(1 for r in man["resultados"] if sha256((SITIO / r["ficheiro"]).read_bytes()) == r["sha256"])
    medida("capturas_e1b", {"capturas": man["capturas"], "sha256_conferidos": conferidas, "problemas": man["problemas"],
                            "cabeca": man["cabeca"], "larguras": man["larguras"], "pedidos_recusados_para_fora": man["pedidos_recusados_para_fora"]},
           "OEDP_E1_BLOCO=E1b node design/especime-v3/medicoes/e1-2026-09-30/captar-e1.mjs, e o sha256 de cada PNG relido",
           {"descricao": "dois corpos que diferem num byte dão sha256 diferentes", "mordeu": sha256(b"a") != sha256(b"b")})


def medir_custo():
    linha = next(l for l in git("reflog", "--date=iso-strict", "e1-2026-09-30").splitlines() if l.startswith(CABECA_ANTES_DO_REBASE))
    inicio = datetime.fromisoformat(re.search(r"@\{([^}]+)\}", linha).group(1))
    agora = datetime.now(timezone.utc)
    simbolos = os.environ.get("OEDP_E1B_SIMBOLOS")
    medida("custo_e1b", {"modelo": "Claude Opus 5.5", "inicio": inicio.isoformat(), "medido_em": agora.isoformat(timespec="seconds"),
                         "segundos_de_relogio": int((agora - inicio).total_seconds()),
                         "simbolos": int(simbolos) if simbolos else "dívida: o total do agente reporta-o a ferramenta ao lugar de direção no fim",
                         "fonte_dos_simbolos": "a diferença entre o contador do orçamento que a ferramenta mostra ao agente no início da sessão e antes desta medida, passada em OEDP_E1B_SIMBOLOS" if simbolos else None},
           "git reflog do ramo: o primeiro commit desta passagem até à hora da medida",
           {"descricao": "o reflog do ramo tem a linha do primeiro commit da passagem", "mordeu": any(l.startswith(CABECA_ANTES_DO_REBASE) for l in git("reflog", "e1-2026-09-30").splitlines())})


def main():
    os.chdir(SITIO)
    print("E1b · medidas")
    codigo = medir_cabecas()
    medir_rebase(codigo)
    medir_datas()
    medir_contadores()
    medir_plantas_dos_contadores()
    medir_emendas()
    medir_sinal_do_euro()
    medir_cortes()
    medir_travessia()
    medir_leituras()
    medir_paginas()
    medir_divida_17()
    medir_portoes()
    medir_capturas()
    medir_custo()
    falhou = [m["nome"] for m in MEDIDAS if not m["conhecido_positivo"].get("mordeu")]
    alvo = BLOCO / "medidas.json"
    dados = json.loads(alvo.read_text(encoding="utf-8"))
    dados["e1b"] = {"passagem": "E1b", "guiao": "design/especime-v3/medicoes/e1-2026-09-30/e1b/medir-e1b.py",
                    "medido_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                    "conhecidos_positivos_que_nao_morderam": falhou, "medidas": MEDIDAS}
    texto = json.dumps(dados, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit("Um caminho da máquina ia para o medidas.json; nada escrito.")
    alvo.write_text(texto, encoding="utf-8")
    print(f"E1b · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
