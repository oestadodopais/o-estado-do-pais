#!/usr/bin/env python3
"""E1c · as medidas da passagem E1c (01.10.2026), escritas em medidas.json na chave `e1c`.

Corre-se da raiz do sítio, com o motor na cabeça do ramo numa árvore indicada por OEDP_MOTOR:

    OEDP_MOTOR=<árvore do motor> python3 design/especime-v3/medicoes/e1-2026-09-30/e1c/medir-e1c.py

As réguas que o mandato da E1c manda mudar vivem no `medir-e1.py` do bloco (a das células, a das
reconciliações, a das repetições, a das células nas páginas construídas), e este guião chama-as de lá,
para que a medida e a régua sejam a mesma função. As outras medidas são desta passagem: as emendas aos
quatro estudos, lidas no motor e nos documentos alojados, antes (nas cabeças da E1b) e depois; o total
das obras no estudo de setembro; os selos corrigidos; a ficha de Évora e a leitura do estudo da economia
nas páginas construídas; a travessia, os portões, as capturas, o mapa de migração bloco a bloco e o custo.

Cada medida traz o nome, o valor, o comando e um conhecido-positivo: o mesmo detetor sobre uma entrada
cuja resposta se sabe. As outras chaves do medidas.json (o E1 e a E1b) ficam como estavam. Nenhum caminho
da máquina vai para os ficheiros: as árvores dizem-se pelas cabeças.
"""
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PASTA = AQUI.parent
SITIO = PASTA.parents[3]
_spec = importlib.util.spec_from_file_location("medir_e1", PASTA / "medir-e1.py")
m1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(m1)
MOTOR = m1.MOTOR
DIST = SITIO / "dist"
CABECA_E1B_MOTOR = "79ab4d5"
CABECA_E1B_SITIO = "0fa073e9"
MEDIDAS = []


def corre(args, cwd=SITIO, ok=True):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if ok and r.returncode != 0:
        raise RuntimeError(f"{' '.join(map(str, args[:3]))} falhou ({r.returncode}): {r.stderr[-600:]}")
    return r.stdout


def medida(nome, valor, comando, conhecido_positivo):
    MEDIDAS.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": conhecido_positivo})
    print(f"  {nome}: {json.dumps(valor, ensure_ascii=False)[:150]}")


def mostra(repo, rev, caminho):
    return corre(["git", "-c", "core.quotepath=off", "show", f"{rev}:{caminho}"], cwd=repo)


def visivel(html):
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", html, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    for ent, c in (("&nbsp;", " "), ("&#160;", " "), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&#39;", "'")):
        t = t.replace(ent, c)
    t = re.sub(r"[   ​]", " ", t)
    return re.sub(r"\s+", " ", t)


def ler(caminho):
    return Path(caminho).read_text(encoding="utf-8")


# ------------------------------------------------------------------ as cabeças
def medir_cabecas():
    s = corre(["git", "rev-parse", "HEAD"]).strip()
    sb = corre(["git", "merge-base", "HEAD", "main"]).strip()
    m = corre(["git", "rev-parse", "HEAD"], cwd=MOTOR).strip()
    mb = corre(["git", "merge-base", "HEAD", "master"], cwd=MOTOR).strip()
    tipos = {x: corre(["git", "cat-file", "-t", x], cwd=c).strip()
             for x, c in ((s, SITIO), (sb, SITIO), (m, MOTOR), (mb, MOTOR), (CABECA_E1B_SITIO, SITIO), (CABECA_E1B_MOTOR, MOTOR))}
    commits_sitio = corre(["git", "log", "--format=%h %s", f"{CABECA_E1B_SITIO}..HEAD"]).splitlines()
    commits_motor = corre(["git", "log", "--format=%h %s", f"{CABECA_E1B_MOTOR}..HEAD"], cwd=MOTOR).splitlines()
    medida("cabecas_e1c", {"sitio": s, "sitio_base": sb, "motor": m, "motor_base": mb,
                           "sitio_na_e1b": CABECA_E1B_SITIO, "motor_na_e1b": CABECA_E1B_MOTOR,
                           "commits_do_sitio_desde_a_e1b": commits_sitio, "commits_do_motor_desde_a_e1b": commits_motor,
                           "arvore_do_motor_limpa": corre(["git", "status", "--porcelain"], cwd=MOTOR).strip() == ""},
           "git rev-parse HEAD; git merge-base HEAD main (sítio) e HEAD master (motor); git log <cabeça da E1b>..HEAD nas duas árvores",
           {"descricao": "git cat-file -t de cada cabeça diz «commit»", "resultado": tipos, "mordeu": all(v == "commit" for v in tipos.values())})


# ------------------------------------------------------- as emendas, antes e depois
P16, P17 = "content/16 Évora Contas da Câmara", "content/17 Évora Quem Governou"
P18, P19 = "content/18 Évora Economia e Dinheiro de Fora", "content/19 Évora 2027 Capital Europeia da Cultura"
MD = {
    ("16", "pt"): f"{P16}/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).md",
    ("16", "en"): f"{P16}/The accounts of the Câmara de Évora, 2010 to 2025.md",
    ("17", "pt"): f"{P17}/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md",
    ("18", "pt"): f"{P18}/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md",
    ("18", "en"): f"{P18}/The economy of Évora and the public money that reaches the municipality outside the council.md",
    ("19", "pt"): f"{P19}/Évora 2027, Capital Europeia da Cultura (pt-PT).md",
    ("19", "en"): f"{P19}/Évora 2027, European Capital of Culture.md",
}
SLUG = {"16": "evora-contas-da-camara-2010-2025", "17": "evora-quem-governou-a-camara-2009-2025",
        "18": "evora-economia-e-dinheiro-publico-de-fora-da-camara", "19": "evora-2027-capital-europeia-da-cultura"}
# (ponto do mandato, estudo, língua, cadeias que saem, cadeias que entram), lidas no Markdown do motor e no texto
# visível do documento alojado; uma cadeia de tabela lê-se no Markdown com as barras e no documento sem elas.
EMENDAS = [
    (1, "19", "pt", ["Total da tabela"], []),
    (1, "19", "en", ["Table total"], []),
    (3, "18", "pt", ["Évora consome melhor do que produz", "produz menos do que consome", "a diferença são salários públicos e pensões"],
     ["são medidas diferentes, de populações diferentes", "e não dizem quanto o concelho consome",
      "As duas medidas são de populações diferentes, e este estudo não mede o que explica a distância entre elas."]),
    (3, "18", "en", ["Évora consumes better than it produces", "produces less than it consumes", "the difference is public salaries and pensions"],
     ["they are different measures of different populations", "and they do not say how much the municipality consumes",
      "The two measures are of different populations, and this study does not measure what explains the distance between them."]),
    (4, "17", "pt", ["A aritmética decide.", "cinco votos"],
     ["Governou-se quatro anos em minoria.", "esse executivo viu as contas de 2024 rejeitadas pela câmara"]),
    (5, "19", "pt", ["A um ano e meio de 2027", "recebeu dinheiro de uma origem só"],
     ["A três meses de 2027", "As contas de 2025 da associação registam como receita 1 841 566,89 € do gabinete do Ministério da Cultura e 31 949,23 € do apoio do IEFP à contratação.",
      "o plano de 2026 da associação regista 3.920.000 € pagos pelo Turismo de Portugal no fim de 2025"]),
    (5, "19", "en", ["A year and a half before 2027", "received money from one source only"],
     ["Three months before 2027", "The association's 2025 accounts record as revenue 1 841 566,89 € from the culture ministry's office and 31 949,23 € from IEFP hiring support.",
      "records 3.920.000 € paid by Turismo de Portugal at the end of 2025"]),
    (6, "16", "pt", ["O relatório faz a subtração"], ["mas a subtração que imprime não dá esse valor", "a tabela usa o primeiro, o resultado líquido do exercício"]),
    (6, "16", "en", ["The report performs the subtraction itself"], ["but the subtraction it prints does not give that figure", "the table uses the first, the net result for the year"]),
    (7, "18", "pt", ["As aberturas de curto prazo de um proprietário de Évora"],
     ["As portas de financiamento que esta secção cita são as do anexo, lidas a 2026-08-10", "e esses prazos já passaram"]),
    (7, "18", "en", ["An Évora landowner's near-term openings"],
     ["The funding doors this section quotes are those of the annex, read on 2026-08-10", "and those deadlines have passed"]),
    (9, "17", "pt", ["Plano 2015 | Plano 2016 | Custo 2015 | Custo 2016"],
     ["Plano 2015 (€) | Plano 2016 (€) | Custo 2015 (€) | Custo 2016 (€)", "Nas tabelas que se seguem, os valores estão em euros."]),
    (9, "18", "pt", ["de valor acrescentado em 2024. O plano"], ["de valor acrescentado em 2024 (o que produziram menos o que compraram para produzir)."]),
    (9, "18", "en", ["of value added in 2024. The recovery"], ["of value added in 2024 (what they produced minus what they bought in order to produce)."]),
]


def sem_tabela(s):
    return re.sub(r"\s*\|\s*", " ", s).strip()


def medir_emendas():
    linhas, falhas, antes_sem = [], [], []
    for ponto, est, lang, saem, entram in EMENDAS:
        md = MD[(est, lang)]
        md_agora, md_antes = mostra(MOTOR, "HEAD", md), mostra(MOTOR, CABECA_E1B_MOTOR, md)
        doc = f"studies-src/{SLUG[est]}/{lang}.html"
        doc_agora, doc_antes = visivel(ler(SITIO / doc)), visivel(mostra(SITIO, CABECA_E1B_SITIO, doc))
        r = {"ponto": ponto, "estudo": est, "lingua": lang, "saem": [], "entram": []}
        for c in saem:
            v = {"cadeia": c, "motor_antes": md_antes.count(c), "motor_agora": md_agora.count(c),
                 "documento_antes": doc_antes.count(sem_tabela(c)), "documento_agora": doc_agora.count(sem_tabela(c))}
            r["saem"].append(v)
            if v["motor_agora"] or v["documento_agora"]:
                falhas.append(f"{est}/{lang}: «{c}» ainda está")
            if not (v["motor_antes"] and v["documento_antes"]):
                antes_sem.append(f"{est}/{lang}: «{c}» não estava na E1b")
        for c in entram:
            v = {"cadeia": c, "motor_agora": md_agora.count(c), "documento_agora": doc_agora.count(sem_tabela(c))}
            r["entram"].append(v)
            if not (v["motor_agora"] and v["documento_agora"]):
                falhas.append(f"{est}/{lang}: «{c}» não está")
        linhas.append(r)
    medida("emendas_e1c", {"emendas": linhas, "falhas": falhas},
           "git show <cabeça>:<edição .md> no motor (na cabeça e na da E1b, 79ab4d5) e o texto visível de studies-src/<slug>/<língua>.html "
           "no sítio (na árvore e na cabeça da E1b, 0fa073e9), contadas as cadeias que saem e as que entram de cada ponto do mandato",
           {"descricao": "cada cadeia que sai estava no motor e no documento alojado na E1b (o mesmo detetor vê-a lá)",
            "cadeias_que_nao_estavam_na_e1b": antes_sem, "mordeu": not antes_sem})


# ------------------------------------------------- o total das obras, e o estudo de setembro
def medir_total_das_obras():
    livro = {c["id"]: c for c in json.loads(ler(MOTOR / P19 / "ledger.json"))["claims"]}
    obras = sorted(i for i in livro if i.startswith("bbs-obra-"))
    def num(v):
        return Decimal(v.replace(" ", "").replace(".", "").replace(",", "."))
    soma = sum(num(livro[i]["value"]) for i in obras)
    impresso = livro["bbs-cap-total"]["value"]
    p14 = "content/14 Évora 2027"
    no14 = {}
    for lang, md in (("pt", f"{p14}/Évora 2027 — O Prometido, o Painel, o Dinheiro (pt-PT).md"), ("en", f"{p14}/Évora 2027 — Promised, Panel, Money.md")):
        t = mostra(MOTOR, "HEAD", md)
        rot = "Total da tabela" if lang == "pt" else "Table total"
        no14[lang] = {"no_motor": t.count(f"| {rot} | 39 336 001,42 € | p. 88 |"),
                      "no_documento_alojado": visivel(ler(SITIO / f"studies-src/evora-2027-prometido-painel-dinheiro/{lang}.html")).count(f"{rot} 39 336 001,42 € p. 88")}
    no19 = {lang: mostra(MOTOR, "HEAD", MD[("19", lang)]).count("39 336 001,42") for lang in ("pt", "en")}
    medida("total_das_obras_e1c", {"obras_na_tabela": len(obras), "soma_das_oito_obras": f"{soma:,.2f}".replace(",", " ").replace(".", ","),
                                   "o_que_a_linha_imprimia": impresso, "a_linha_que_citava": "bbs-cap-total",
                                   "o_excerto_dessa_linha": livro["bbs-cap-total"]["excerpt"],
                                   "no_estudo_de_setembro_14": no14, "vezes_que_o_19_ainda_imprime_39_336_001_42": no19},
           "as oito linhas bbs-obra-* do livro do 19 no motor, somadas; a linha bbs-cap-total; as edições .md do 14 (git show HEAD no motor) "
           "e os documentos alojados do 14 no sítio, procurados pela linha da tabela",
           {"descricao": "a mesma procura encontra a linha nas duas edições do 14 e nos seus documentos alojados, que ficam como edições datadas",
            "mordeu": all(v["no_motor"] == 1 and v["no_documento_alojado"] == 1 for v in no14.values())})


# ------------------------------------------------------------------ os selos corrigidos
def medir_selos():
    ts = MOTOR / P19 / "Technical Source"
    aj = json.loads(ler(ts / "ajustes.json"))["decisoes_corrigidas"]
    dec = {lang: json.loads(ler(ts / f"decisoes.{lang}.json"))["corrigidas"] for lang in ("pt", "en")}
    def regs(pasta):
        out = {}
        for f in sorted((MOTOR / pasta).glob("*.record.json")):
            r = json.loads(ler(f))
            out["pt" if r["lang"] == "pt-PT" else "en"] = r
        return out
    def fig(r, bloco, unidade, impresso):
        b = next(x for x in r["blocks"] if x["i"] == bloco)
        u = b if not unidade else b["rows"][int(unidade.split(".")[1][1:])][int(unidade.split(".")[2])]
        return next((f["row"] for f in u.get("figures", []) if f["printed"] == impresso), None)
    r14, r19 = regs("content/14 Évora 2027"), regs(P19)
    # os seis do mandato desta passagem: (bloco no 14, bloco no 19, unidade, impresso, língua, linha certa, linha antiga)
    casos = [(31, 31, ".t1.0", "45 784 603,10", "pt", "bbs-op-total", "bbs-desp-total"),
             (31, 31, ".t1.0", "45 784 603,10", "en", "bbs-op-total", "bbs-desp-total"),
             (32, 32, "", "45 784 603,10", "pt", "bbs-op-total", "bbs-desp-total"),
             (65, 65, ".t1.1", "45 784 603,10", "pt", "bbs-op-total", "bbs-desp-total"),
             (65, 65, ".t1.1", "45 784 603,10", "en", "bbs-op-total", "bbs-desp-total"),
             (86, 86, ".t3.1", "3 750 000,00", "en", "plano-gepac", "rcm-2026"),
             (94, 94, ".t3.2", "500 000", "en", "prr-arquivo", "bbs-obra-arquivo"),
             (108, 112, ".t3.1", "4.000.000,00", "en", "plano-protocolo-economia", "plano-alentejo-a")]
    linhas = []
    for b14, b19, u, imp, lang, certa, antiga in casos:
        linhas.append({"bloco_no_14": b14, "bloco_no_19": b19, "unidade": u, "impresso": imp, "edicao": lang,
                       "no_14": fig(r14[lang], b14, u, imp), "no_19": fig(r19[lang], b19, u, imp), "linha_certa": certa, "linha_antiga": antiga})
    medida("selos_corrigidos_e1c", {"correcoes_escritas_no_19": len(aj), "aplicadas": dec, "celulas": linhas,
                                    "certas_no_19": sum(1 for l in linhas if l["no_19"] == l["linha_certa"]),
                                    "antigas_no_14": sum(1 for l in linhas if l["no_14"] == l["linha_antiga"])},
           "Technical Source/ajustes.json e decisoes.<língua>.json do 19 no motor, e as figuras dessas células nos registos do 14 e do 19 "
           "(record.json, a linha que cada figura leva)",
           {"descricao": "o mesmo leitor encontra nos registos do 14, que ficam como edição datada, as linhas antigas das oito células",
            "mordeu": all(l["no_14"] == l["linha_antiga"] for l in linhas)})


# -------------------------------------------------- a ficha de Évora nas páginas construídas
def campo(html, ancora, rotulo):
    m = re.search(rf'id="{ancora}".*?<dt>{rotulo}</dt>\s*<dd>(.*?)</dd>', html or "", re.S)
    return m.group(1) if m else None


def avaliar_campo(dd, abre):
    if dd is None:
        return {"existe": False}
    texto = visivel(dd).strip()
    return {"existe": True, "abre_com_a_frase": texto.startswith(abre),
            "data_de_referencia": bool(re.search(r'data-nonledger="data-de-referencia">31\.12\.2025<', dd)),
            "a_divida_de_2025": 'data-claim="evora-divida-total-2025"' in dd, "texto": texto[:240]}


def medir_ficha():
    r = {}
    for lang, rota, rot_h, rot_d, abre in (("pt", "municipios/evora", "Herdou", "Deixou", "As contas do ano da mudança"),
                                           ("en", "en/municipalities/evora", "Inherited", "Left", "The accounts of the year of the change")):
        h = ler(DIST / rota / "index.html")
        r[lang] = {"mandato_2021_2025_deixou": avaliar_campo(campo(h, "mandato-2021-2025", rot_d), abre),
                   "mandato_2025_herdou": avaliar_campo(campo(h, "mandato-2025", rot_h), abre)}
    ok = all(v["existe"] and v["abre_com_a_frase"] and v["data_de_referencia"] and v["a_divida_de_2025"] for x in r.values() for v in x.values())
    planta = ('<div id="mandato-2025"><dl><dt>Herdou</dt><dd><span class="claim"><span data-claim="evora-divida-total-2025">54 379 034,55</span></span>'
              ' euros de dívida total. </dd></dl></div>')
    p = avaliar_campo(campo(planta, "mandato-2025", "Herdou"), "As contas do ano da mudança")
    medida("ficha_de_evora_e1c", {"edicoes": r, "as_quatro_fichas_dizem_a_data_e_a_origem": ok},
           "dist/municipios/evora e dist/en/municipalities/evora: o <dd> a seguir a «Deixou»/«Left» no #mandato-2021-2025 e a «Herdou»/«Inherited» "
           "no #mandato-2025, lido pelo texto visível e pelas marcas (data-nonledger=\"data-de-referencia\" com 31.12.2025, data-claim da dívida)",
           {"descricao": "a ficha como estava antes (a dívida de 2025 logo a seguir a «Herdou», sem a frase) é dada como sem a frase",
            "planta": p, "mordeu": p["existe"] and not p["abre_com_a_frase"] and not p["data_de_referencia"]})


# ------------------------------------------- a leitura do estudo da economia nas páginas
def medir_leitura():
    rotas = {"pt": ["estudos", "municipios/evora", ""], "en": ["en/studies", "en/municipalities/evora", "en"]}
    sai = {"pt": "está vencida contra", "en": "is overdue against"}
    entra = {"pt": "as duas partes sobrepõem-se", "en": "the two parts overlap"}
    r = {}
    for lang, lista in rotas.items():
        for rota in lista:
            t = visivel(ler(DIST / rota / "index.html"))
            r[f"/{rota}"] = {"sai": t.count(sai[lang]), "entra": t.count(entra[lang])}
    ok = all(v["sai"] == 0 and v["entra"] >= 1 for v in r.values())
    planta = visivel("<p>Da soma aprovada para o concelho, <span>61,32</span>% está vencida contra <span>51,95</span>% paga.</p>")
    medida("leitura_da_economia_e1c", {"paginas": r, "em_todas_a_frase_nova_e_nenhuma_antiga": ok},
           "o texto visível da lista dos estudos, da página de Évora e da primeira página construídas, nas duas línguas, procurado pela "
           "frase antiga («está vencida contra», «is overdue against») e pela nova («as duas partes sobrepõem-se», «the two parts overlap»)",
           {"descricao": "a frase antiga, numa página plantada, é contada uma vez", "mordeu": planta.count(sai["pt"]) == 1})


# ------------------------------------------------ as conferências da travessia, lidas de ficheiro
def codigo(nome):
    f = AQUI / nome
    return int(ler(f).strip()) if f.exists() else None


def medir_travessia():
    rep = json.loads(ler(AQUI / "republicar-documentos-e1c.json"))
    lg = ler(AQUI / "motor-travessia" / "records-site-escrever.log")
    contagem = re.search(r"(\d+) nova\(s\) · (\d+) alterada\(s\) · (\d+) inalterada\(s\)", lg)
    origem = re.search(r"--with-origin: (\d+) registo\(s\) conferidos", ler(AQUI / "check-documentos-com-origem.log"))
    leit = json.loads(ler(AQUI / "conferir-leituras-e1c.json"))
    medida("travessia_e1c", {"documentos_realojados": len(rep["edicoes"]), "mudaram": sum(1 for e in rep["edicoes"] if e["mudou"]),
                             "commit_do_motor_dos_bytes": sorted({e["commit"][:7] for e in rep["edicoes"]}),
                             "registos": {"novos": int(contagem.group(1)), "alterados": int(contagem.group(2)), "inalterados": int(contagem.group(3))},
                             "check_documentos": codigo("check-documentos.codigo"), "check_documentos_com_origem": codigo("check-documentos-com-origem.codigo"),
                             "registos_conferidos_contra_o_motor": int(origem.group(1)),
                             "conferencia_das_leituras": {"codigo": codigo("conferir-leituras-e1c.codigo"), "falhas": leit["falhas"],
                                                          "positivos": [p["mordeu"] for p in leit["positivos"]]}},
           "e1c/republicar-documentos-e1c.json (o guião que realoja os documentos por git show), o registo do "
           "publisher/export_records_site.py --write, os códigos do check:documentos (com e sem --with-origin) e a conferência das leituras, "
           "cada código escrito num ficheiro depois de o processo acabar",
           {"descricao": "os quatro conhecidos-positivos da conferência das leituras morderam (as frases tiradas não estão na cabeça do motor e "
                         "estavam na da E1b, e uma cópia trocada não está)",
            "mordeu": all(p["mordeu"] for p in leit["positivos"])})


# ------------------------------------------------------------------ o motor
def medir_motor():
    pasta = AQUI / "motor"
    cod = int(ler(pasta / "gate.codigo").strip())
    log = ler(pasta / "gate.log")
    tr = AQUI / "motor-travessia"
    primeira = ler(tr / "commit-motor-1-primeira-tentativa.log")
    suites = re.findall(r"^GATE  (\S+)\s+FAIL", primeira, re.M)
    medida("motor_e1c", {"portao": {"codigo": cod, "cabeca": ler(pasta / "cabeca").strip(), "inicio": ler(pasta / "gate.inicio").strip(),
                                    "fim": ler(pasta / "gate.fim").strip(), "linha_final_pass": "GATE: PASS" in log},
                         "commits": {"primeira_tentativa": int(ler(tr / "commit-motor-1-primeira-tentativa.codigo").strip()), "suites_que_pararam": suites,
                                     "commit_1": int(ler(tr / "commit-motor-1.codigo").strip()), "commit_2": int(ler(tr / "commit-motor-2.codigo").strip())},
                         "composicoes": {n: int(ler(tr / f"compor-escrever-{n}.codigo").strip()) for n in ("16", "17", "18", "19")},
                         "html": {n: int(ler(tr / f"make-html-{n}.codigo").strip()) for n in ("16", "17", "18", "19")},
                         "registos_do_motor": int(ler(tr / "export-records-escrever.codigo").strip())},
           "python3 -m core.gate na cabeça final do motor, com o código escrito em e1c/motor/gate.codigo depois de o processo acabar; "
           "e os códigos de cada passo da travessia em e1c/motor-travessia/",
           {"descricao": "o código lido do ficheiro concorda com a última linha do registo (PASS com 0), e a primeira tentativa do commit, "
                         "que parou em três suítes, deu código diferente de zero",
            "mordeu": (cod == 0) == ("GATE: PASS" in log) and int(ler(tr / "commit-motor-1-primeira-tentativa.codigo").strip()) != 0})


# ------------------------------------------------------------------ os portões do sítio
def medir_portoes():
    r = {}
    for nome in sorted(p.name for p in (PASTA / "portoes").iterdir() if p.is_dir() and p.name.startswith("e1c")):
        p = PASTA / "portoes" / nome
        r[nome] = {"cabeca": ler(p / "cabeca").strip() if (p / "cabeca").exists() else None,
                   **{g: (int(ler(p / f"{g}.codigo").strip()) if (p / f"{g}.codigo").exists() else None) for g in ("build", "verify", "typecheck")}}
    medida("portoes_e1c", r,
           "os códigos de npm run build, npm run verify e npm run typecheck, corridos por scripts/leituras/portoes.sh (a tranca da máquina), "
           "cada um no seu comando e escrito em portoes/<corrida>/<portão>.codigo depois de o processo acabar",
           {"descricao": "o leitor dos ficheiros de código lê o 1 da corrida intermédia da construção, que parou no portão da voz",
            "intermedia": codigo("intermedias/build-1.log.codigo"), "mordeu": codigo("intermedias/build-1.log.codigo") == 1})


# ------------------------------------------------------------------ as capturas
def medir_capturas():
    man = json.loads(ler(PASTA / "capturas-e1c.json"))
    certas, erradas = 0, []
    for r in man["resultados"]:
        f = SITIO / r["ficheiro"]
        if f.exists() and hashlib.sha256(f.read_bytes()).hexdigest() == r["sha256"]:
            certas += 1
        else:
            erradas.append(r["ficheiro"])
    medida("capturas_e1c", {"capturas": man["capturas"], "sha256_conferidos": certas, "divergem": erradas, "cabeca": man["cabeca"],
                            "estado": man["estado"], "problemas": man["problemas"], "pedidos_recusados_para_fora": man["pedidos_recusados_para_fora"],
                            "larguras": man["larguras"]},
           "o sha256 de cada PNG recalculado e comparado com o de capturas-e1c.json, escrito pelo captar-e1.mjs com OEDP_E1_BLOCO=E1c",
           {"descricao": "dois corpos que diferem num byte dão resumos diferentes",
            "mordeu": hashlib.sha256(b"planta").hexdigest() != hashlib.sha256(b"plantA").hexdigest()})


# ------------------------------------------------------------- o mapa de migração, bloco a bloco
MAPA = r"""
import json, sys
from core.compor import mapa_de_migracao, ROOT
pastas = [ROOT / "content" / p for p in json.loads(sys.stdin.read())]
saida = {}
for lingua in ("pt", "en"):
    m = mapa_de_migracao(pastas, lingua)
    saida[lingua] = [{"fonte": b["fonte"], "bloco": b["bloco"], "genero": b["genero"], "inicio": b["inicio"], "figuras": b["figuras"],
                      "destinos": b["destinos"]} for b in m["blocos"]]
print(json.dumps(saida, ensure_ascii=False))
"""


def medir_mapa():
    pastas = list(m1.NOVOS.values())
    r = subprocess.run([sys.executable, "-c", MAPA], cwd=MOTOR, input=json.dumps(pastas), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-600:])
    blocos = json.loads(r.stdout)
    contas = {}
    for lingua, lista in blocos.items():
        sem = [b for b in lista if not b["destinos"]]
        for b in sem:
            b["destinos"] = [{"estudo": None, "como": "sem destino",
                              "razao": "o bloco ia para o estudo de quem governou, que só tem edição portuguesa (a decisão 3 da E1b); "
                                       "a edição inglesa do «Quinze Anos» e a de «Os Pelouros» ficam como dívida"}]
        destinos = sum(len(b["destinos"]) for b in lista if b["destinos"][0]["como"] != "sem destino")
        tres = [f'{b["fonte"]} {b["bloco"]}' for b in lista if sum(1 for d in b["destinos"] if d["como"] == "entra") >= 3]
        dois = [f'{b["fonte"]} {b["bloco"]}' for b in lista if sum(1 for d in b["destinos"] if d["como"] == "entra") == 2]
        entra_e_sai = [f'{b["fonte"]} {b["bloco"]}' for b in lista if {d["como"] for d in b["destinos"]} == {"entra", "sai"}]
        contas[lingua] = {"blocos": len(lista), "destinos": destinos, "sem_destino": len(sem),
                          "repartidos_por_tres_estudos": tres, "repartidos_por_dois_estudos": dois,
                          "que_entram_num_estudo_e_saem_declarados_de_outro": entra_e_sai,
                          "entram": sum(1 for b in lista for d in b["destinos"] if d["como"] == "entra"),
                          "saem_com_a_razao": sum(1 for b in lista for d in b["destinos"] if d["como"] == "sai")}
    ficheiro = {"bloco": "E1c", "o_que_e": "Cada bloco de cada registo antigo que os gabaritos dos quatro estudos citam, com o estudo novo onde entra "
                                            "ou de onde sai com a razão escrita no gabarito, nas duas línguas. Escrito por e1c/medir-e1c.py a partir de "
                                            "core.compor.mapa_de_migracao no motor.",
                "motor": corre(["git", "rev-parse", "HEAD"], cwd=MOTOR).strip(), "contas": contas, "blocos": blocos}
    (PASTA / "mapa-de-migracao.json").write_text(json.dumps(ficheiro, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    pt = contas["pt"]
    soma = pt["blocos"] + 2 * len(pt["repartidos_por_tres_estudos"]) + len(pt["repartidos_por_dois_estudos"]) + len(pt["que_entram_num_estudo_e_saem_declarados_de_outro"])
    medida("mapa_de_migracao_e1c", {**contas, "a_soma_bate_em_portugues": {"blocos": pt["blocos"], "mais_dois_por_bloco_repartido_por_tres": 2 * len(pt["repartidos_por_tres_estudos"]),
                                                                           "mais_um_por_bloco_que_entra_e_sai": len(pt["que_entram_num_estudo_e_saem_declarados_de_outro"]),
                                                                           "da": soma, "destinos": pt["destinos"], "bate": soma == pt["destinos"]}},
           "core.compor.mapa_de_migracao no motor, sobre os gabaritos das pastas 16 a 19, escrito bloco a bloco em mapa-de-migracao.json",
           {"descricao": "cada bloco tem pelo menos um destino ou a razão de não ter, e as contas dos destinos batem com a soma dos blocos",
            "mordeu": all(b["destinos"] for l in blocos.values() for b in l) and soma == pt["destinos"]})


# ------------------------------------------- as células: a medida dos registos contra a das páginas
def medir_celulas_registos_contra_paginas():
    cz = json.loads(ler(SITIO / "ledger/cruzamentos/evora.json"))["rows"]
    no_sitio = {(r["rh_study"], r["rh_id"]) for r in cz.values()}
    diferencas = []
    for slug, pasta in m1.NOVOS.items():
        d = MOTOR / "content" / pasta
        man = json.loads(ler(d / "records.manifest.json"))
        rg = next(x for x in man["registos"] if x["lang"] == "pt-PT")
        reg = json.loads(ler(d / rg["registo"]))
        de = {l["id"]: (l["fonte"], l.get("id_na_fonte", l["id"])) for l in json.loads(ler(d / "Technical Source/origem-das-linhas.json"))["linhas"]}
        html = ler(DIST / "estudos" / slug / "index.html")
        pag = {m.group(1): m.group(2) for m in re.finditer(r'data-registo="[^"#]+#([\d.]+)"[^>]*>[^<]*</span><a class="src-chip[^"]*" href="/livro-razao/([^"]+)"', html)}
        for b in reg["blocks"]:
            if b["kind"] != "table":
                continue
            for ri, row in enumerate(b["rows"]):
                for ci, c in enumerate(row):
                    for fi, f in enumerate(c.get("figures", [])):
                        k = f"{b['i']}.{ri}.{ci}.{fi}"
                        if (k in pag) != (de.get(f["row"]) in no_sitio):
                            diferencas.append({"estudo": slug, "figura": k, "impresso": f["printed"], "linha_do_estudo": f["row"],
                                               "na_pagina": pag.get(k), "origem_no_registo_de_proveniencia": list(de.get(f["row"], ())),
                                               "origem_no_cruzamento_do_sitio": [[r["rh_study"], r["rh_id"]] for kk, r in cz.items() if kk == pag.get(k)]})
    medida("celulas_registos_contra_paginas", {"diferencas": len(diferencas), "casos": diferencas},
           "para cada figura de célula dos registos portugueses: a medida do E1 (a origem pelo registo de proveniência do estudo, procurada nas "
           "linhas que atravessaram) contra a página construída (a marca da fonte do sítio logo a seguir à figura)",
           {"descricao": "as diferenças são figuras que uma das duas leituras vê e a outra não; o detetor encontra-as nas linhas da dívida do "
                         "regulador que vieram de duas verticais com os mesmos bytes",
            "mordeu": len(diferencas) > 0})


# ------------------------------------------------------------------ o custo
def medir_custo():
    def primeira(cwd):
        linhas = corre(["git", "log", "--reverse", "--format=%cI %h %s", f"{CABECA_E1B_MOTOR if cwd == MOTOR else CABECA_E1B_SITIO}..HEAD"], cwd=cwd).splitlines()
        return linhas[0] if linhas else None
    m, s = primeira(MOTOR), primeira(SITIO)
    inicio = min(datetime.fromisoformat(x.split()[0]) for x in (m, s) if x)
    agora = datetime.now(timezone.utc)
    transcrito = json.loads(ler(AQUI / "custo-simbolos-transcrito.json"))
    medida("custo_e1c", {"modelo": "Claude Opus 5.5", "primeiro_commit_do_motor": m, "primeiro_commit_do_sitio": s,
                         "inicio": inicio.isoformat(), "medido_em": agora.isoformat(timespec="seconds"),
                         "segundos_de_relogio_desde_o_primeiro_commit": int((agora - inicio).total_seconds()),
                         "simbolos": transcrito},
           "git log --reverse --format=%cI <cabeça da E1b>..HEAD nas duas árvores (o primeiro commit da passagem) até à hora da medida; "
           "os símbolos são uma transcrição, não uma medida deste guião (ver o campo simbolos)",
           {"descricao": "o primeiro commit da passagem no motor é o das emendas, a8febe0", "mordeu": bool(m and m.split()[1] == "a8febe0")})


def main():
    os.chdir(SITIO)
    print("E1c · medidas")
    medir_cabecas()
    # as réguas do medir-e1.py que o mandato mandou mudar, chamadas de lá
    for f in (m1.medir_celulas, m1.medir_i180, m1.medir_celulas_e_linhas_do_sitio, m1.medir_celulas_nas_paginas):
        antes = len(m1.MEDIDAS)
        f()
        for x in m1.MEDIDAS[antes:]:
            MEDIDAS.append(dict(x, comando=x["comando"] + " (pela função do medir-e1.py, chamada de e1c/medir-e1c.py)"))
    medir_celulas_registos_contra_paginas()
    medir_emendas()
    medir_total_das_obras()
    medir_selos()
    medir_ficha()
    medir_leitura()
    medir_travessia()
    medir_motor()
    medir_portoes()
    medir_capturas()
    medir_mapa()
    medir_custo()
    falhou = [x["nome"] for x in MEDIDAS if not x["conhecido_positivo"].get("mordeu")]
    alvo = PASTA / "medidas.json"
    tudo = json.loads(ler(alvo))
    tudo["e1c"] = {"bloco": "E1c", "guiao": "design/especime-v3/medicoes/e1-2026-09-30/e1c/medir-e1c.py",
                   "medido_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                   "conhecidos_positivos_que_nao_morderam": falhou, "medidas": MEDIDAS}
    texto = json.dumps(tudo, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit("Um caminho da máquina ia para o medidas.json; nada escrito.")
    alvo.write_text(texto, encoding="utf-8")
    print(f"E1c · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
