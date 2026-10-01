#!/usr/bin/env python3
"""E1 · as medidas do bloco dos estudos de Évora, escritas em medidas.json ao lado deste guião.

Corre-se da raiz do sítio, com o motor na cabeça do E1 numa árvore indicada por OEDP_MOTOR:

    OEDP_MOTOR=<árvore do motor> python3 design/especime-v3/medicoes/e1-2026-09-30/medir-e1.py

Cada medida traz o nome, o valor, o comando que a dá e um conhecido-positivo: o mesmo detetor
corrido sobre uma entrada cuja resposta se sabe, para provar que vê. As medidas das páginas leem o
dist/ da última construção, e o ficheiro diz de que cabeça ela é e em que estado estava a árvore.
Nenhum caminho da máquina vai para o ficheiro: as árvores dizem-se pelas cabeças.
"""
import collections
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import yaml

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
if not os.environ.get("OEDP_MOTOR"):
    sys.exit("Falta OEDP_MOTOR: a árvore do motor na cabeça do E1.")
MOTOR = Path(os.environ["OEDP_MOTOR"]).resolve()
DIST = SITIO / "dist"

NOVOS = {
    "evora-contas-da-camara-2010-2025": "16 Évora Contas da Câmara",
    "evora-quem-governou-a-camara-2009-2025": "17 Évora Quem Governou",
    "evora-economia-e-dinheiro-publico-de-fora-da-camara": "18 Évora Economia e Dinheiro de Fora",
    "evora-2027-capital-europeia-da-cultura": "19 Évora 2027 Capital Europeia da Cultura",
}
ANTIGOS = {
    "evora-orcamentado-pago-devido-2025": "07 Évora Municipal Accounts",
    "evora-quinze-anos-cinco-mandatos": "08 Évora Mandates",
    "evora-os-pelouros-quem-os-teve-o-que-fizeram": "09 Évora Pelouros",
    "evora-prometido-pago-auditado-2026": "04 Évora Public Money",
    "evora-economia-investidores-portas-abertas-2026": "06 Évora Economy",
    "evora-2027-prometido-painel-dinheiro": "14 Évora 2027",
}
MEDIDAS = []


def corre(args, cwd=SITIO, ok=True, env=None):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True, env=env)
    if ok and r.returncode != 0:
        raise RuntimeError(f"{' '.join(map(str, args[:3]))} falhou ({r.returncode}): {r.stderr[-800:]}")
    return r.stdout


def medida(nome, valor, comando, conhecido_positivo, **extra):
    MEDIDAS.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": conhecido_positivo, **extra})
    print(f"  {nome}: {json.dumps(valor, ensure_ascii=False)[:160]}")


def sha256(b):
    return hashlib.sha256(b).hexdigest()


def obras(ficheiro_studies=None):
    """O arquivo, lido pelo próprio módulo (sem imports, por isso importa-se de qualquer pasta)."""
    alvo = Path(ficheiro_studies) if ficheiro_studies else SITIO / "src/data/studies.mjs"
    js = ("const m = await import(process.argv[1]);"
          "console.log(JSON.stringify({obras: m.WORKS.map(w => ({id: w.id, slug: w.slug, subject: w.subject ?? null,"
          " sucedidoPor: w.sucedidoPor ?? null, edicoes: w.editions.map(e => e.lang)})), counts: m.COUNTS}))")
    return json.loads(corre(["node", "--input-type=module", "-e", js, alvo.resolve().as_uri()]))


def texto_de_html(caminho):
    """O texto visível de um documento alojado, com os espaços finos e inquebráveis tornados espaço."""
    t = Path(caminho).read_text(encoding="utf-8")
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    for ent, c in (("&nbsp;", " "), ("&#160;", " "), ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'), ("&#39;", "'")):
        t = t.replace(ent, c)
    t = re.sub(r"[   ​]", " ", t)
    return re.sub(r"\s+", " ", t)


def documento(slug, lang="pt"):
    return SITIO / "studies-src" / slug / f"{lang}.html"


def conta(texto, agulha):
    return texto.count(agulha)


# ------------------------------------------------------------------ as cabeças
def medir_cabecas():
    s_cab = corre(["git", "rev-parse", "HEAD"]).strip()
    s_base = corre(["git", "merge-base", "HEAD", "main"]).strip()
    m_cab = corre(["git", "rev-parse", "HEAD"], cwd=MOTOR).strip()
    m_base = corre(["git", "merge-base", "HEAD", "master"], cwd=MOTOR).strip()
    tipos = {x: corre(["git", "cat-file", "-t", x], cwd=c).strip() for x, c in ((s_cab, SITIO), (s_base, SITIO), (m_cab, MOTOR), (m_base, MOTOR))}
    estado = corre(["git", "status", "--porcelain", "--untracked-files=no"]).strip()
    medida("cabecas", {"sitio": s_cab, "sitio_base": s_base, "motor": m_cab, "motor_base": m_base,
                       "sitio_arvore_limpa": estado == ""},
           "git rev-parse HEAD; git merge-base HEAD main (sítio); git -C $OEDP_MOTOR merge-base HEAD master",
           {"descricao": "git cat-file -t de cada cabeça diz «commit»", "resultado": tipos,
            "mordeu": all(v == "commit" for v in tipos.values())})
    return s_cab, s_base, m_cab, m_base


# ------------------------------------------------------- os ficheiros no motor
def medir_ficheiros_do_motor():
    rastreados = set(corre(["git", "ls-files", "-z", "content/"], cwd=MOTOR).split("\0"))
    por_pasta, em_falta, edicoes = {}, [], 0
    for slug, pasta in NOVOS.items():
        base = Path("content") / pasta
        man = json.loads((MOTOR / base / "records.manifest.json").read_text(encoding="utf-8"))
        ficheiros = [base / "ledger.json", base / "records.manifest.json"]
        for r in man["registos"]:
            edicoes += 1
            ficheiros += [base / r["edicao"], base / r["edicao_html"], base / r["registo"], base / r["voz"]["ficheiro"]]
        falta = [str(f) for f in ficheiros if str(f) not in rastreados or not (MOTOR / f).is_file()]
        em_falta += falta
        por_pasta[pasta] = {"edicoes": len(man["registos"]), "estado": man["estado"], "fixado_em": man["fixado_em"],
                            "ficheiros": len(ficheiros), "em_falta": len(falta)}
    # conhecido-positivo: um registo que aponta para uma edição que não existe tem de faltar
    planta = Path("content") / NOVOS["evora-contas-da-camara-2010-2025"] / "Nao existe (pt-PT).md"
    viu = str(planta) not in rastreados and not (MOTOR / planta).is_file()
    medida("motor_estudos_novos_ficheiros", {"edicoes": edicoes, "em_falta": len(em_falta), "por_pasta": por_pasta},
           "git -C $OEDP_MOTOR ls-files content/ contra os records.manifest.json das pastas 16 a 19",
           {"descricao": "uma edição plantada que não existe é dada em falta", "mordeu": viu})


# ------------------------------------------- as contas do portão do motor, uma a uma
def medir_portao_do_motor():
    base = json.loads((MOTOR / "core/gate_baselines.json").read_text(encoding="utf-8"))
    prefixos = ("evora-contas-camara-", "evora-quem-governou-", "evora-economia-dinheiro-de-fora-", "evora-2027-capital-europeia-da-cultura-")
    entregas = [d for d in base["deliverables"] if d["name"].startswith(prefixos)]
    prog = ("import json, sys\nfrom core import gate\n"
            "pedidos = json.loads(sys.stdin.read())\n"
            "print(json.dumps({n: gate.measure(d, l) for n, d, l in pedidos}))\n")
    pedidos = [[d["name"], d["document"], d["ledger"]] for d in entregas]
    r = subprocess.run([sys.executable, "-c", prog], cwd=MOTOR, input=json.dumps(pedidos), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    agora = json.loads(r.stdout)
    divergem = [d["name"] for d in entregas if agora[d["name"]] != d["counts"]]
    divida = {n: {k: v for k, v in c.items() if k in ("orphans", "misattributions", "undeclared", "undeclared_assertions", "failed_assertions", "number_adjacencies") and v}
              for n, c in agora.items()}
    # conhecido-positivo: a mesma medida numa cópia do 16 com um número sem linha dá um órfão a mais
    d16 = next(d for d in entregas if d["name"] == "evora-contas-camara-pt")
    tmp = Path(tempfile.mkdtemp(prefix="e1-planta-"))
    try:
        copia = tmp / "planta.md"
        copia.write_text((MOTOR / d16["document"]).read_text(encoding="utf-8") + "\n\nUm número plantado sem linha: €987 654 321.\n", encoding="utf-8")
        r2 = subprocess.run([sys.executable, "-c", prog], cwd=MOTOR, input=json.dumps([["planta", str(copia), d16["ledger"]]]), capture_output=True, text=True)
        planta = json.loads(r2.stdout)["planta"] if r2.returncode == 0 else {"erro": r2.stderr[-300:]}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    mordeu = planta.get("orphans", 0) == agora["evora-contas-camara-pt"]["orphans"] + 1
    medida("motor_medidas_das_entregas", {"entregas": len(entregas), "iguais_ao_registo_do_portao": len(entregas) - len(divergem),
                                          "divergem": divergem, "divida_declarada": {k: v for k, v in divida.items() if v},
                                          "contas": agora},
           "python3 -c 'from core import gate; gate.measure(documento, livro)' no motor, para cada entrega de core/gate_baselines.json",
           {"descricao": "uma cópia do 16 com «€987 654 321» sem linha dá um órfão a mais", "orfaos_na_planta": planta.get("orphans"),
            "mordeu": mordeu})


def medir_codigo_do_portao_do_motor():
    pasta = AQUI / "portoes" / "motor"
    cod = (pasta / "gate.codigo").read_text().strip()
    cab = (pasta / "gate.cabeca").read_text().strip()
    log = (pasta / "gate.log").read_text(encoding="utf-8", errors="replace")
    passou = "GATE: PASS" in log
    falhas = len(re.findall(r"^GATE.*\bFAIL\b", log, re.M))
    medida("motor_portao", {"codigo": int(cod), "cabeca": cab, "linha_final_pass": passou, "linhas_fail": falhas},
           "python3 -m core.gate no motor, com o código escrito em portoes/motor/gate.codigo depois de o processo acabar",
           {"descricao": "o código lido do ficheiro concorda com a última linha do registo (PASS com 0, FAIL sem 0)",
            "mordeu": (int(cod) == 0) == passou})


# ----------------------------------------------- as 69 linhas que mudam de estudo
def ler_linha(texto):
    return yaml.safe_load(texto)


def medir_linhas(s_base):
    base_obras = {o["slug"] for o in obras()["obras"] if o["sucedidoPor"]}
    nomes_base = corre(["git", "ls-tree", "--name-only", s_base, "ledger/claims/"]).split()
    mudam, outras_diferencas, par = [], [], collections.Counter()
    for n in nomes_base:
        if not n.endswith(".yml"):
            continue
        antes = ler_linha(corre(["git", "show", f"{s_base}:{n}"]))
        if not isinstance(antes, dict) or antes.get("study") not in base_obras:
            continue
        agora_txt = (SITIO / n).read_text(encoding="utf-8")
        agora = ler_linha(agora_txt)
        dif = sorted(k for k in set(antes) | set(agora) if k != "study" and antes.get(k) != agora.get(k))
        if dif:
            outras_diferencas.append({"linha": antes["id"], "campos": dif})
        mudam.append(antes["id"])
        par[(antes["study"], agora["study"])] += 1
    novos = set(NOVOS)
    destino_ok = sum(n for (a, b), n in par.items() if b in novos)
    # o comentário das reconferências, que o motor escreve com um texto só desde 23.09: quais das linhas o mudam
    mudadas = corre(["git", "diff", "--name-only", s_base, "--", "ledger/claims/"]).split()
    com_comentario, so_comentario = 0, []
    for n in mudadas:
        dif = corre(["git", "diff", s_base, "--", n])
        tem_c = bool(re.search(r"^[-+]# Reconferências", dif, re.M))
        tem_s = bool(re.search(r"^[-+]study: ", dif, re.M))
        if tem_c and tem_s:
            com_comentario += 1
        elif tem_c:
            so_comentario.append(Path(n).stem)
    # o cruzamento: cada linha diz o estudo de origem no motor, e ele não muda
    reg_base = json.loads(corre(["git", "show", f"{s_base}:ledger/cruzamentos/evora.json"]))["rows"]
    reg = json.loads((SITIO / "ledger/cruzamentos/evora.json").read_text(encoding="utf-8"))["rows"]
    origem_igual = sum(1 for i in mudam if reg.get(i, {}).get("rh_study") == reg_base.get(i, {}).get("rh_study")
                       and reg.get(i, {}).get("origin_row_sha256") == reg_base.get(i, {}).get("origin_row_sha256"))
    # conhecido-positivo: uma linha plantada com o valor mudado tem de aparecer como diferença
    exemplo = ler_linha(corre(["git", "show", f"{s_base}:ledger/claims/{mudam[0]}.yml"]))
    plantada = dict(exemplo, value="999")
    viu = [k for k in set(exemplo) | set(plantada) if k != "study" and exemplo.get(k) != plantada.get(k)] == ["value"]
    medida("linhas_que_mudam_de_estudo", {"linhas": len(mudam), "para_um_estudo_novo": destino_ok,
                                          "com_outro_campo_mudado": len(outras_diferencas), "outras_diferencas": outras_diferencas,
                                          "origem_no_motor_igual": origem_igual,
                                          "com_o_comentario_das_reconferencias": com_comentario,
                                          "linhas_cruzadas_que_so_mudam_o_comentario": so_comentario,
                                          "pares": {f"{a} -> {b}": n for (a, b), n in sorted(par.items())}},
           "as linhas de ledger/claims/ cujo study na base é um dos seis estudos com sucessor, lidas na base (git show) e na árvore, "
           "comparadas campo a campo; e o rh_study e o origin_row_sha256 de ledger/cruzamentos/evora.json na base e na árvore",
           {"descricao": "uma cópia de uma linha com o valor mudado aparece como diferença no campo value", "mordeu": viu})
    return mudam


# ---------------------------------------- nenhum número em dois estudos novos
def figuras(registo):
    for b in registo["blocks"]:
        unidades = [b] if b["kind"] in ("heading", "paragraph") else (b.get("items") or []) if b["kind"] == "list" else \
            [c for r in b.get("rows", []) for c in r] if b["kind"] == "table" else []
        for u in unidades:
            if isinstance(u, dict):
                yield from u.get("figures", [])


def medir_numeros_em_dois_estudos():
    origens, valores = {}, collections.defaultdict(set)
    for slug, pasta in NOVOS.items():
        d = MOTOR / "content" / pasta
        orig = json.loads((d / "Technical Source/origem-das-linhas.json").read_text(encoding="utf-8"))
        de = {l["id"]: (l["fonte"], l.get("id_na_fonte", l["id"])) for l in orig["linhas"]}
        man = json.loads((d / "records.manifest.json").read_text(encoding="utf-8"))
        chaves = set()
        for r in man["registos"]:
            reg = json.loads((d / r["registo"]).read_text(encoding="utf-8"))
            for f in figuras(reg):
                k = de.get(f["row"], ("?", f["row"]))
                chaves.add(k)
                valores[f["value"]].add((slug, k))
        origens[slug] = chaves
    slugs = list(NOVOS)
    pares = {}
    for i, a in enumerate(slugs):
        for b in slugs[i + 1:]:
            comuns = origens[a] & origens[b]
            pares[f"{a} & {b}"] = sorted(f"{f} · {i_}" for f, i_ in comuns)
    repetidas = sum(len(v) for v in pares.values())
    coincidencias = []
    for v, ocorr in valores.items():
        estudos = {s for s, _ in ocorr}
        if len(estudos) > 1:
            coincidencias.append({"valor": v, "estudos": sorted(estudos), "linhas": sorted({f"{k[0][:2]}·{k[1]}" for _, k in ocorr})})
    # conhecido-positivo: uma linha do 16 plantada no conjunto do 17 tem de dar uma repetição
    planta = set(origens[slugs[1]]) | {next(iter(origens[slugs[0]]))}
    mordeu = len(origens[slugs[0]] & planta) == len(origens[slugs[0]] & origens[slugs[1]]) + 1
    medida("numeros_em_dois_estudos_novos", {"linhas_de_origem_em_dois_estudos": repetidas, "pares": pares,
                                             "linhas_de_origem_por_estudo": {s: len(c) for s, c in origens.items()},
                                             "valores_iguais_de_medidas_diferentes": sorted(coincidencias, key=lambda x: x["valor"])},
           "as figuras dos registos (record.json) dos quatro estudos no motor, cada uma levada à linha de origem por "
           "Technical Source/origem-das-linhas.json (fonte, id_na_fonte), e as interseções dos conjuntos dois a dois",
           {"descricao": "uma linha de origem do 16 plantada no conjunto do 17 dá uma repetição", "mordeu": mordeu})


# ------------------------------------------------------- as células das tabelas
#
# A RÉGUA DAS CÉLULAS CONFERE A LINHA QUE A CÉLULA CITA (passagem E1c, 01.10.2026, ponto 1 do
# mandato). Até à E1c esta régua procurava o número de cada célula nas formas de QUALQUER linha
# do livro do estudo, e por isso passava a linha «Total da tabela» das obras do 19, que imprimia
# um número que existe no livro (o total do financiamento de capital da p. 88) como o total das
# oito obras da p. 108. Passa a ler os registos de conteúdo (cada figura com a linha que o registo
# lhe dá) e a conferir três coisas em cada figura de cada célula de tabela:
#
#   C1 · o número impresso é uma das formas da linha que a célula cita, e não de outra linha;
#   C2 · quando a linha da tabela escreve onde o valor foi lido («p. 88», «folha 43 do PDF»), a
#        linha citada é dessa página ou folha, pelo seu excerto;
#   C3 · uma linha que se diz o total da tabela («Total», «Total da tabela», «Table total») é a
#        soma de linhas da mesma coluna (de um subconjunto delas, porque há tabelas com
#        subtotais), dentro do arredondamento que os números impressos trazem.
#
# A C1 sozinha não morde neste caso, e diz-se: a célula do total citava a linha cujo valor
# imprimia, e a página que escrevia era a dessa linha; o que estava errado era o objeto, e é a C3
# que o vê. A contagem antiga das células sem linha nenhuma (identificadores, endereços, carimbos)
# continua, sobre o Markdown, como estava.
PROG_CELULAS = r"""
import json, re, sys, collections, itertools, copy
from decimal import Decimal
from core import documento_md, eyetext
from core.eyetext import Text
from core.reconcile import extract_numbers, claim_value_canonical, indexed_forms
MESES = "janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|January|February|March|April|May|June|July|August|September|October|November|December"
LIMPA = [re.compile(r"\d{4}-\d{2}-\d{2}"), re.compile(r"\d{4}-\d{2}"),
         re.compile(rf"\b\d{{1,2}}\.?º? (de )?({MESES})\b", re.I), re.compile(rf"\b({MESES}) \d{{1,2}}\b", re.I),
         re.compile(r"\b[A-Za-zÀ-ÿ]+-?\d+(\.\d+)*[A-Za-z]*\b"),
         re.compile(r"(?i)\b(p\.|pp\.|página|páginas|folha|folhas|sheet|sheets|page|pages)\s*\d+(\s*(a|to|e|and|,|-|–)\s*\d+)*"),
         re.compile(r"(?i)\b(n\.?\s?º|nº|n\.o|no\.)\s*\d+(/\d{4})?"), re.compile(r"\b(19|20)\d\d\b")]
def limpa(t):
    for r in LIMPA: t = r.sub(" ", t)
    return t
def sem_linha(md, livro):
    valores = set()
    for c in livro["claims"]:
        for f in indexed_forms(c): valores.add(claim_value_canonical(str(f)))
    cont = collections.Counter(); casos = []
    for bi, b in enumerate(eyetext.parse(documento_md.render(md))):
        if b["kind"] != "table": continue
        for r, linha in enumerate(b["rows"]):
            for c, cel in enumerate(linha):
                txt = Text(cel).text.replace("​", "")
                cont["numeros"] += len(extract_numbers(txt))
                for o in extract_numbers(limpa(txt)):
                    if o.canonical in valores: cont["com_linha"] += 1
                    else:
                        cont["sem_linha"] += 1
                        casos.append({"bloco": bi, "celula": f"{r}.{c}", "impresso": o.printed, "texto": txt[:140]})
    return dict(cont), casos

LOC = re.compile(r"(?i)\b(p\.|página|folha|sheet|page)\s*(\d+)")
def locs_da_linha_da_tabela(linha):
    out = set()
    for c in linha:
        for m in LOC.finditer(c.get("text", "")):
            k = m.group(1).lower()
            out.add(("folha" if k in ("folha", "sheet") else "p", int(m.group(2))))
    return out
def locs_do_excerto(e):
    out = set()
    for m in re.finditer(r"\(folha (\d+)(?:, página impressa (\d+))?\)", e or ""):
        out.add(("folha", int(m.group(1))))
        if m.group(2): out.add(("p", int(m.group(2))))
    for m in re.finditer(r"PDF p\.\s?(\d+)", e or ""): out.add(("folha", int(m.group(1)))); out.add(("p", int(m.group(1))))
    for m in re.finditer(r"(?<![A-Za-z])p\.\s?(\d+)", e or ""): out.add(("p", int(m.group(1))))
    return out
def numero(p):
    s = p.replace(" ", " ").replace(" ", " ").replace(" ", "")
    if re.fullmatch(r"\d{1,3}(\.\d{3})+(,\d+)?", s): s = s.replace(".", "").replace(",", ".")
    elif "," in s: s = s.replace(",", ".")
    try: return Decimal(s)
    except Exception: return None
def meia_unidade(p):
    m = re.search(r",(\d+)$", p.strip())
    return Decimal(5) / (Decimal(10) ** (len(m.group(1)) + 1)) if m else Decimal("0.5")
TOTAIS = {"total", "total da tabela", "table total"}
def citadas(registo, livro):
    linhas = {c["id"]: c for c in livro["claims"]}
    formas = {i: {claim_value_canonical(str(f)) for f in indexed_forms(c)} for i, c in linhas.items()}
    falhas = []; conta = collections.Counter()
    for b in registo["blocks"]:
        if b["kind"] != "table": continue
        rows = b["rows"]
        for ri, linha in enumerate(rows):
            locs = locs_da_linha_da_tabela(linha)
            rotulo = linha[0].get("text", "").replace("​", "").strip().lower() if linha else ""
            for ci, cel in enumerate(linha):
                for f in cel.get("figures", []):
                    conta["figuras"] += 1
                    onde = {"bloco": b["i"], "linha": ri, "coluna": ci, "impresso": f["printed"], "linha_citada": f["row"],
                            "rotulo": linha[0].get("text", "").replace("​", "")[:60] if linha else ""}
                    c = linhas.get(f["row"])
                    if c is None or claim_value_canonical(f["printed"]) not in formas[f["row"]]:
                        falhas.append({"celula": "C1", "o_que": "o número não é uma forma da linha que a célula cita", **onde}); continue
                    if locs:
                        conta["com_localizacao"] += 1
                        if not (locs & locs_do_excerto(c.get("excerpt"))):
                            falhas.append({"celula": "C2", "o_que": "a linha citada não é da página ou da folha que a linha da tabela escreve",
                                           "localizacao_da_tabela": sorted(locs), "localizacao_da_linha": sorted(locs_do_excerto(c.get("excerpt"))), **onde})
                            continue
                    if rotulo in TOTAIS:
                        conta["totais_da_tabela"] += 1
                        alvo = numero(f["printed"])
                        outros = []
                        for rj, l2 in enumerate(rows):
                            if rj == ri or ci >= len(l2): continue
                            for f2 in l2[ci].get("figures", []):
                                n2 = numero(f2["printed"])
                                if n2 is not None: outros.append((n2, meia_unidade(f2["printed"])))
                        achou = None
                        if alvo is not None and len(outros) <= 18:
                            for k in range(1, len(outros) + 1):
                                for comb in itertools.combinations(outros, k):
                                    tol = sum(m for _, m in comb) + meia_unidade(f["printed"])
                                    if abs(sum(n for n, _ in comb) - alvo) <= tol: achou = k; break
                                if achou: break
                        if not achou:
                            falhas.append({"celula": "C3", "o_que": "a linha diz-se o total da tabela e não é a soma de linhas da sua coluna",
                                           "soma_de_todas": str(sum(n for n, _ in outros)), **onde})
    return dict(conta), falhas

def plantar(registo, planta):
    r = copy.deepcopy(registo)
    def tabela(cabeca):
        for b in r["blocks"]:
            if b["kind"] == "table" and b["rows"] and " | ".join(c["text"].replace("​", "") for c in b["rows"][0]).startswith(cabeca):
                return b
        raise SystemExit(f"a planta não acha a tabela que começa por {cabeca!r}")
    if planta == "total-da-tabela":
        b = tabela("obra | custo escrito | onde")
        b["rows"].append([{"text": "Total da tabela", "figures": []},
                          {"text": "39 336 001,42 €", "figures": [{"printed": "39 336 001,42", "row": "bbs-cap-total", "start": 0, "end": 13, "value": "39 336 001,42"}]},
                          {"text": "p. 88", "figures": []}])
    elif planta == "valor-de-outra-linha":
        b = tabela("obra | custo escrito | onde")
        b["rows"][1][1]["figures"][0]["row"] = "bbs-cap-total"
    elif planta == "linha-de-outra-pagina":
        b = tabela("linha | valor escrito | onde")
        alvo = next(l for l in b["rows"] if l[0]["text"].replace("​", "").strip() == "Total")
        alvo[1]["figures"][0]["row"] = "bbs-desp-total"
    return r

pedidos = json.loads(sys.stdin.read()); saida = {}
for p in pedidos:
    livro = json.load(open(p["livro"], encoding="utf-8"))
    if p["tipo"] == "md":
        md = open(p["md"], encoding="utf-8").read() + p.get("extra", "")
        saida[p["nome"]] = sem_linha(md, livro)
    else:
        reg = json.load(open(p["registo"], encoding="utf-8"))
        if p.get("planta"): reg = plantar(reg, p["planta"])
        saida[p["nome"]] = citadas(reg, livro)
print(json.dumps(saida, ensure_ascii=False))
"""


def correr_celulas(pedidos):
    r = subprocess.run([sys.executable, "-c", PROG_CELULAS], cwd=MOTOR, input=json.dumps(pedidos), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    return json.loads(r.stdout)


def medir_celulas():
    pedidos = []
    registos = {}
    for slug, pasta in NOVOS.items():
        d = MOTOR / "content" / pasta
        for md in sorted(d.glob("*.md")):
            pedidos.append({"tipo": "md", "nome": f"{pasta}/{md.name}", "md": str(md), "livro": str(d / "ledger.json")})
        man = json.loads((d / "records.manifest.json").read_text(encoding="utf-8"))
        for r in man["registos"]:
            nome = f"{pasta}/{r['registo']}"
            registos[nome] = {"tipo": "registo", "nome": nome, "registo": str(d / r["registo"]), "livro": str(d / "ledger.json")}
    d16 = MOTOR / "content" / NOVOS["evora-contas-da-camara-2010-2025"]
    md16 = sorted(d16.glob("*(pt-PT).md"))[0]
    pedidos.append({"tipo": "md", "nome": "planta", "md": str(md16), "livro": str(d16 / "ledger.json"),
                    "extra": "\n\n| Coluna | Valor |\n|---|---|\n| plantada | 123 456 |\n"})
    d19 = MOTOR / "content" / NOVOS["evora-2027-capital-europeia-da-cultura"]
    reg19 = next(n for n in registos if n.startswith(NOVOS["evora-2027-capital-europeia-da-cultura"]) and "(pt-PT)" in n)
    plantas = {}
    for planta in ("total-da-tabela", "valor-de-outra-linha", "linha-de-outra-pagina"):
        plantas[planta] = dict(registos[reg19], nome=f"planta:{planta}", planta=planta)
    saida = correr_celulas(pedidos + list(registos.values()) + list(plantas.values()))
    planta = saida.pop("planta")
    base16 = saida[f"{NOVOS['evora-contas-da-camara-2010-2025']}/{md16.name}"]
    def classe_de(t):
        """O que é o algarismo de uma célula sem linha: um endereço, um carimbo de hora, um nome
        («Évora 27»), um identificador de diploma ou de publicação (artigo, número, série) ou outra coisa."""
        if "http" in t or "web.archive" in t or re.search(r"\w/\w", t) or re.search(r"«\d+[A-Z]{3}\d+»", t):
            return "endereço"
        if re.search(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z?", t) or re.search(r"\d{14}", t):
            return "carimbo de hora"
        if re.search(r"Évora[ _]27", t):
            return "nome"
        if re.search(r"(?i)\bart(?:igo|icle)?\.?\b|n\.º|\d\.ª|\bs[ée]rie|\bseries\b|\bissue\b", t):
            return "identificador de diploma ou de publicação"
        return "outro"
    sem = {n: v for n, v in saida.items() if n.endswith(".md")}
    cit = {n: v for n, v in saida.items() if n.endswith(".record.json")}
    plt = {n.split(":", 1)[1]: v for n, v in saida.items() if n.startswith("planta:")}
    classes = collections.defaultdict(collections.Counter)
    for nome, (cont, casos) in sem.items():
        for c in casos:
            c["classe"] = classe_de(c["texto"])
            classes[nome][c["classe"]] += 1
    falhas_reais = [dict(f, registo=n) for n, (_c, fs) in cit.items() for f in fs]
    mordidas = {k: sorted({f["celula"] for f in fs}) for k, (_c, fs) in plt.items()}
    esperadas = {"total-da-tabela": ["C3"], "valor-de-outra-linha": ["C1"], "linha-de-outra-pagina": ["C2"]}
    medida("celulas_de_tabela_sem_linha", {n: {"contagem": c, "casos": casos} for n, (c, casos) in sem.items()} |
           {"_classes_das_celulas_sem_linha": {n: dict(c) for n, c in classes.items()},
            "_outras_no_19": sum(c.get("outro", 0) for n, c in classes.items() if n.startswith("19")),
            "_quantidades_sem_linha_16_17_18": sum(c.get("sem_linha", 0) for n, (c, _) in sem.items() if not n.startswith("19"))},
           "core.documento_md + core.eyetext + core.reconcile no motor: cada número das células das tabelas, tirado o que não é "
           "quantidade (datas, anos, códigos, páginas, números de lei), procurado nas formas indexadas das linhas do livro do estudo",
           {"descricao": "uma tabela plantada no fim do 16 com «123 456» dá uma célula sem linha a mais",
            "sem_linha_na_planta": planta[0].get("sem_linha", 0), "mordeu": planta[0].get("sem_linha", 0) == base16[0].get("sem_linha", 0) + 1})
    medida("celulas_e_linha_citada", {"registos": {n: c for n, (c, _f) in cit.items()},
                                      "figuras_nas_celulas": sum(c.get("figuras", 0) for c, _f in cit.values()),
                                      "com_localizacao_na_linha_da_tabela": sum(c.get("com_localizacao", 0) for c, _f in cit.values()),
                                      "totais_da_tabela": sum(c.get("totais_da_tabela", 0) for c, _f in cit.values()),
                                      "falhas": len(falhas_reais), "casos": falhas_reais},
           "os registos de conteúdo (record.json) das sete edições no motor, lidos com o livro do estudo por core.reconcile: em cada "
           "figura de cada célula, C1 o número é uma forma da linha que a célula cita, C2 a linha citada é da página ou da folha que a "
           "linha da tabela escreve (pelo excerto da linha), C3 uma linha «Total», «Total da tabela» ou «Table total» é a soma de "
           "linhas da sua coluna, dentro do arredondamento impresso",
           {"descricao": "três plantas numa cópia em memória do registo português do 19: a linha «Total da tabela | 39 336 001,42 € | "
                         "p. 88» de volta à tabela das obras (o caso das duas leituras) tem de dar a C3; uma obra a citar a linha do "
                         "total de capital, de outro valor, a C1; e o total da receita operacional da folha 43 a citar a despesa total "
                         "da p. 87, com o mesmo valor, a C2",
            "mordidas_por_planta": mordidas, "esperadas": esperadas,
            "mordeu": mordidas == esperadas})


# ------------------------------------------------------- o mapa de migração
def medir_mapa_de_migracao():
    prog = r"""
import json, sys, collections
from pathlib import Path
from core.compor import mapa_de_migracao, ROOT
pedidos = json.loads(sys.stdin.read()); saida = {}
for nome, pastas, lingua in pedidos:
    m = mapa_de_migracao([ROOT / "content" / p for p in pastas], lingua)
    por = collections.Counter(); razoes = collections.Counter()
    for b in m["blocos"]:
        for d in b["destinos"]:
            por[(b["fonte"], d["estudo"], d["como"])] += 1
    saida[nome] = {"blocos": len(m["blocos"]), "faltas": len(m["faltas"]), "repetidos": len(m["repetidos"]),
                   "repartidos": [[b["fonte"], b["bloco"], [d["estudo"] for d in b["destinos"] if d["como"] == "entra"]] for b in m["repetidos"]],
                   "por_origem_e_destino": [[f, e, c, n] for (f, e, c), n in sorted(por.items())]}
print(json.dumps(saida, ensure_ascii=False))
"""
    pastas = list(NOVOS.values())
    pedidos = [["pt", pastas, "pt"], ["en", pastas, "en"], ["planta", [pastas[0], pastas[2], pastas[3]], "pt"]]
    r = subprocess.run([sys.executable, "-c", prog], cwd=MOTOR, input=json.dumps(pedidos), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    saida = json.loads(r.stdout)
    planta = saida.pop("planta")
    medida("mapa_de_migracao", saida,
           "core.compor.mapa_de_migracao no motor sobre os gabaritos das pastas 16 a 19 (o mesmo que python3 -m core.compor --mapa): "
           "para cada bloco dos registos antigos, o estudo novo onde entra ou de onde sai com a razão escrita",
           {"descricao": "o mesmo mapa sem o gabarito do 17 dá faltas: os blocos do «Quinze Anos» que entram no 17 ficam sem destino",
            "faltas_na_planta": planta["faltas"], "mordeu": planta["faltas"] > 0})


# ---------------------------------- as células das tabelas e as linhas do sítio
def figuras_das_celulas(registo):
    for b in registo["blocks"]:
        if b["kind"] == "table":
            for r in b.get("rows", []):
                for c in r:
                    if isinstance(c, dict):
                        yield from c.get("figures", [])


def medir_celulas_e_linhas_do_sitio():
    """Quantas figuras das células das tabelas têm uma linha no livro-razão do sítio (as que
    atravessaram, ledger/cruzamentos/evora.json), nos seis antigos e nos quatro novos, em português."""
    reg = json.loads((SITIO / "ledger/cruzamentos/evora.json").read_text(encoding="utf-8"))["rows"]
    no_sitio = {(r["rh_study"], r["rh_id"]) for r in reg.values()}
    def contar(pasta, de=None):
        d = MOTOR / "content" / pasta
        man = json.loads((d / "records.manifest.json").read_text(encoding="utf-8"))
        r = next(x for x in man["registos"] if x["lang"] == "pt-PT")
        reg_ = json.loads((d / r["registo"]).read_text(encoding="utf-8"))
        total = com = 0
        for f in figuras_das_celulas(reg_):
            total += 1
            chave = de.get(f["row"]) if de else (pasta, f["row"])
            if chave in no_sitio:
                com += 1
        return {"figuras_nas_celulas": total, "com_linha_do_sitio": com, "sem_linha_do_sitio": total - com}
    antigos = {pasta: contar(pasta) for pasta in ANTIGOS.values()}
    novos = {}
    for slug, pasta in NOVOS.items():
        orig = json.loads((MOTOR / "content" / pasta / "Technical Source/origem-das-linhas.json").read_text(encoding="utf-8"))
        de = {l["id"]: (l["fonte"], l.get("id_na_fonte", l["id"])) for l in orig["linhas"]}
        novos[pasta] = contar(pasta, de)
    soma = lambda x: {k: sum(v[k] for v in x.values()) for k in ("figuras_nas_celulas", "com_linha_do_sitio", "sem_linha_do_sitio")}
    medida("celulas_e_linhas_do_sitio", {"antigos_pt": antigos, "novos_pt": novos, "soma_antigos": soma(antigos), "soma_novos": soma(novos)},
           "as figuras das células das tabelas dos registos portugueses no motor (record.json), levadas à linha de origem e "
           "procuradas nas linhas que atravessaram para o sítio (ledger/cruzamentos/evora.json: rh_study, rh_id)",
           {"descricao": "o detetor vê figuras com linha do sítio (a tabela do regulador no 16) e sem ela (nos antigos)",
            "mordeu": novos[NOVOS["evora-contas-da-camara-2010-2025"]]["com_linha_do_sitio"] > 0 and soma(antigos)["sem_linha_do_sitio"] > 0})


# ------------------------------- as células das tabelas nas páginas construídas (passagem E1c)
# A marca da fonte tem duas classes: «src-chip» e, numa linha com um campo por confirmar, «src-chip
# is-unverified» (o quadrado tracejado). As duas abrem a página da linha, e as duas contam.
FIGURA_DE_CELULA = re.compile(r'<span class="texto-figura" data-registo="([^"#]+)#(\d+)\.(\d+)\.(\d+)\.(\d+)"[^>]*>[^<]*</span>(<a class="src-chip(?: [^"]*)?" href="/livro-razao/[^"]+")?')


def celulas_de_uma_pagina(html):
    """(figuras das células de tabela, das quais com a marca da fonte de uma linha do sítio logo a seguir)."""
    total = com = 0
    for m in FIGURA_DE_CELULA.finditer(html or ""):
        total += 1
        if m.group(6):
            com += 1
    return total, com


def medir_celulas_nas_paginas():
    """A repartição das figuras das células com linha do livro-razão do sítio, lida das páginas construídas
    (passagem E1c, ponto 11 do mandato): a da medida `celulas_e_linhas_do_sitio`, acima, sai dos registos e
    das linhas que atravessaram (69), e a das páginas é a que o leitor vê."""
    por = {}
    for slug in NOVOS:
        f = DIST / "estudos" / slug / "index.html"
        tot, com = celulas_de_uma_pagina(f.read_text(encoding="utf-8") if f.exists() else "")
        por[slug] = {"figuras_nas_celulas": tot, "com_marca_da_fonte_do_sitio": com, "sem_ela": tot - com}
    soma = {k: sum(v[k] for v in por.values()) for k in ("figuras_nas_celulas", "com_marca_da_fonte_do_sitio", "sem_ela")}
    planta = ('<td><span class="texto-figura" data-registo="x/pt#1.2.3.0" data-registo-row="a">1</span><a class="src-chip" href="/livro-razao/y">'
              '</a></td><td><span class="texto-figura" data-registo="x/pt#1.2.4.0" data-registo-row="b">2</span></td>'
              '<td><span class="texto-figura" data-registo="x/pt#1.2.5.0" data-registo-row="d">4</span><a class="src-chip is-unverified" href="/livro-razao/w"></a></td>'
              '<p><span class="texto-figura" data-registo="x/pt#5.0" data-registo-row="c">3</span><a class="src-chip" href="/livro-razao/z"></a></p>')
    medida("celulas_nas_paginas_construidas", {"por_estudo": por, "soma": soma},
           "as páginas portuguesas dos quatro estudos no dist/ (dist/estudos/<slug>/index.html): cada span.texto-figura cujo "
           "data-registo tem quatro números (bloco, linha, coluna, figura) é uma figura de célula, e conta como «com marca da fonte "
           "do sítio» quando a seguir vem a.src-chip com href para /livro-razao/",
           {"descricao": "uma página plantada com uma figura de célula com a marca, uma com a marca tracejada, uma sem marca e uma "
                         "figura de parágrafo com marca dá 3 figuras de célula e 2 com marca",
            "mordeu": celulas_de_uma_pagina(planta) == (3, 2)})


# ------------------------------------------------------------------ os selos
def medir_selos():
    por = {}
    for slug, pasta in NOVOS.items():
        ts = MOTOR / "content" / pasta / "Technical Source"
        aj = json.loads((ts / "ajustes.json").read_text(encoding="utf-8"))
        eds = {}
        for f in sorted(ts.glob("decisoes.*.json")):
            d = json.loads(f.read_text(encoding="utf-8"))
            eds[f.name] = {**d["contagem"], "corrigidas": d["corrigidas"]}
        por[pasta] = {"decisoes_corrigidas_escritas": len(aj.get("decisoes_corrigidas", [])),
                      "acrescenta_linhas": len(aj.get("acrescenta_linhas", [])), "mesma_medida": len(aj.get("mesma_medida", [])),
                      "edicoes": eds}
    pt = {p: next((v for k, v in x["edicoes"].items() if k.endswith(".pt.json")), {}) for p, x in por.items()}
    medida("selos_das_figuras", {"por_estudo": por,
                                 "corrigidas_aplicadas_pt": sum(v.get("corrigidas", 0) for v in pt.values()),
                                 "nao_numeros_selados_pt": sum(v.get("nao_numeros_selados", 0) for v in pt.values()),
                                 "corrigidas_escritas": sum(x["decisoes_corrigidas_escritas"] for x in por.values())},
           "Technical Source/ajustes.json (decisoes_corrigidas, acrescenta_linhas, mesma_medida) e decisoes.<língua>.json "
           "(contagem, corrigidas) das pastas 16 a 19, escritos pelo python3 -m core.compor",
           {"descricao": "o compositor recusa uma correção que não cai em nenhuma figura: a planta está no core/compor_test.py, "
                         "que o portão do motor corre (a contagem de PASS no registo do portão)",
            "mordeu": "compor_test" in (AQUI / "portoes" / "motor" / "gate.log").read_text(encoding="utf-8", errors="replace")})


# ------------------------------- as oito contradições da I180 e as repetições
I180 = [
    # (id, o que era, frases que saem: lidas nos antigos e nos novos; âncoras que entram: lidas nos novos)
    # O VALOR DE UMA FRASE QUE SAI É O ESTUDO NOVO ONDE ELA PODE FICAR (passagem E1c), ou None se não pode
    # ficar em nenhum: os totais do PRR vivem no 18, num instantâneo só, com a leitura de 2026-08-07 na tabela
    # das duas leituras, e saem do 16 e do 17.
    ("1-prr-tres-datas", "os totais do PRR com três datas de leitura e dois valores",
     {"167 372 756": "evora-economia-e-dinheiro-publico-de-fora-da-camara",
      "167 337 246": "evora-economia-e-dinheiro-publico-de-fora-da-camara"}, []),
    ("2-hospital", "o equipamento do hospital «a comprar-lhe agora» num estudo e com zero pago noutro",
     {"comprar-lhe agora": None}, []),
    ("3-evora-2027-no-orcamento-2026", "o Évora 2027 no orçamento de 2026 com três valores",
     {}, [("evora-contas-da-camara-2010-2025", "o objetivo do anexo de investimentos que carrega a iniciativa, para 2026")]),
    ("4-ganhos-param-em-2022", "os ganhos que «param em 2022» num estudo e chegam a 2024 noutro",
     {"param em 2022": None}, []),
    ("5-mandato-2009-2013", "o mandato de 2009 a 2013 sem presidente registado num estudo e com os dois nomes noutro",
     {}, [("evora-quem-governou-a-camara-2009-2025", "As fontes dos pelouros não registam o presidente desse mandato")]),
    ("6-direcao-da-divida", "a direção da dívida (a piorar, parada, a subir) e as duas séries que divergem em 2020 a 2023",
     {}, [("evora-contas-da-camara-2010-2025", "A direção da dívida, lida de três maneiras"),
          ("evora-contas-da-camara-2010-2025", "Nenhum documento lido explica a distância de 2020 a 2023")]),
    ("7-prazo-2022-69-e-64", "69 e 64 dias de prazo de pagamento em 2022",
     {}, [("evora-contas-da-camara-2010-2025", "69 dias a série da Prestação de Contas 2025"),
          ("evora-contas-da-camara-2010-2025", "64 dias o relatório de gestão de 2022")]),
    ("8-correcao-envelhecida", "a correção envelhecida dos «Pelouros» ao «Quinze Anos» («não têm linha de cultura»)",
     {"não têm linha de cultura": None}, []),
]
REPETICOES = [
    ("serie-da-divida-do-regulador", "a série da dívida da DGAL impressa por inteiro", "€77 961 663"),
    # A VOTAÇÃO APANHA-SE TAMBÉM POR EXTENSO (passagem E1c, ponto 4 do mandato): a agulha era só «2 votos a
    # favor», e os «cinco votos» da abertura de quem governou passavam por ela. São agora as duas formas, com
    # algarismos e por extenso, do voto a favor e do voto contra.
    ("votacao-das-contas-de-2024", "a votação das contas de 2024",
     [r"\b(?:2|dois)\s+votos?\s+a\s+favor\b", r"\b(?:5|cinco)\s+votos?\b", r"\b(?:5|cinco)\s+contra\b",
      r"\b(?:2|two)\s+votes?\s+in\s+favou?r\b", r"\b(?:5|five)\s+votes?\b", r"\b(?:5|five)\s+against\b"]),
    ("declaracao-do-auditor", "a declaração de impossibilidade do auditor", "Declaração de Impossibilidade"),
    ("cento-e-trinta-e-sete-dias", "os 137 dias de prazo médio de pagamento", "137 dias"),
    ("pagamentos-em-atraso", "os €4 976 172 em atraso", "4 976 172"),
]


def tem_agulha(texto, agulha):
    """Uma agulha é uma cadeia (procurada tal como está) ou uma lista de expressões regulares."""
    if isinstance(agulha, str):
        return agulha in texto
    return any(re.search(a, texto, re.I) for a in agulha)


def avaliar_i180(textos_antigos, textos_novos):
    """A reconciliação das oito contradições e das repetições, sobre os textos dados.

    Devolve os pontos, as repetições e três contas: as frases que saem vistas nos antigos, as que
    ficaram nos novos, e as âncoras que entram presentes nos novos. Uma função só, para que o
    conhecido-positivo corra exatamente o mesmo detetor sobre os estudos novos vazios."""
    pontos = []
    for pid, oque, saem, entram in I180:
        r = {"ponto": pid, "o_que_era": oque, "saem": {}, "entram": []}
        for frase, onde_pode_ficar in saem.items():
            antes = {s: conta(t, frase) for s, t in textos_antigos.items() if conta(t, frase)}
            depois = {s: conta(t, frase) for s, t in textos_novos.items() if conta(t, frase)}
            r["saem"][frase] = {"nos_antigos": antes, "nos_novos": depois, "onde_pode_ficar": onde_pode_ficar,
                                "fora_do_seu_lugar": {s: n for s, n in depois.items() if s != onde_pode_ficar}}
        for slug, ancora in entram:
            r["entram"].append({"estudo": slug, "ancora": ancora, "vezes": conta(textos_novos.get(slug, ""), ancora)})
        pontos.append(r)
    reps = []
    for rid, oque, agulha in REPETICOES:
        reps.append({"repeticao": rid, "o_que_era": oque, "agulha": agulha,
                     "estudos_antigos_com_ela": sorted(s for s, t in textos_antigos.items() if tem_agulha(t, agulha)),
                     "estudos_novos_com_ela": sorted(s for s, t in textos_novos.items() if tem_agulha(t, agulha))})
    vistas = {f: any(conta(t, f) for t in textos_antigos.values()) for _, _, saem, _ in I180 for f in saem}
    ficaram = {f: v["fora_do_seu_lugar"] for p in pontos for f, v in p["saem"].items() if v["fora_do_seu_lugar"]}
    ancoras = [(a["estudo"], a["ancora"], a["vezes"]) for p in pontos for a in p["entram"]]
    em_dois = {r["repeticao"]: r["estudos_novos_com_ela"] for r in reps if len(r["estudos_novos_com_ela"]) > 1}
    return pontos, reps, {"frases_que_saem_vistas_nos_antigos": vistas, "frases_que_saem_e_ficaram_nos_novos": ficaram,
                          "ancoras_que_entram": len(ancoras), "ancoras_presentes": sum(1 for *_x, v in ancoras if v >= 1),
                          "repeticoes_em_dois_estudos_novos": em_dois}


def medir_i180():
    textos_antigos = {s: texto_de_html(documento(s)) for s in ANTIGOS}
    textos_novos = {s: texto_de_html(documento(s)) for s in NOVOS}
    pontos, reps, contas = avaliar_i180(textos_antigos, textos_novos)
    # os três valores da mesma obra de São Bento de Cástris, numa tabela do 19
    t19 = textos_novos["evora-2027-capital-europeia-da-cultura"]
    i = t19.find("O Mosteiro de São Bento de Cástris, em três documentos")
    tabela = t19[i:i + 1600] if i >= 0 else ""
    t18 = textos_novos["evora-economia-e-dinheiro-publico-de-fora-da-camara"]
    castris = {"tabela_no_19": i >= 0, "3 000 000 no 19": "3 000 000,00 €" in tabela, "6 750 000 no 19": "6 750 000 €" in tabela,
               "o do registo liga ao 18": "A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara" in tabela,
               "6 000 000 no 19": "6 000 000" in t19, "6 000 000 no 18, na linha de Cástris": "Mosteiro de São Bento de Cástris 6 000 000 " in t18}
    # o PRR: um só instantâneo, datado, no 18; quantas datas de leitura os novos imprimem ao lado de um total
    datas_prr = {s: sorted(set(re.findall(r"2026-08-(?:04|07|19)", t))) for s, t in textos_novos.items()}
    # O CONHECIDO-POSITIVO EXIGE QUE A RECONCILIAÇÃO SOBREVIVA (passagem E1c, ponto 10 do mandato). Até à
    # E1c ele só conferia que as frases que saem tinham sido vistas nos antigos, e passava com os estudos
    # novos vazios: as âncoras que entram contavam zero e «mordeu» ficava verdadeiro. Passa a exigir também
    # cada âncora presente nos novos, nenhuma frase que sai ainda lá, e nenhuma repetição em dois estudos
    # novos; e corre o mesmo detetor sobre os estudos novos vazios e sobre o 17 com os «cinco votos»
    # plantados, que têm de o fazer falhar.
    def passa(c):
        return (all(c["frases_que_saem_vistas_nos_antigos"].values()) and not c["frases_que_saem_e_ficaram_nos_novos"]
                and c["ancoras_presentes"] == c["ancoras_que_entram"] and not c["repeticoes_em_dois_estudos_novos"])
    _p, _r, vazios = avaliar_i180(textos_antigos, {s: "" for s in NOVOS})
    plantados = dict(textos_novos)
    plantados["evora-quem-governou-a-camara-2009-2025"] += " A mesma aritmética deixou cinco votos rejeitar um ano de contas."
    _p, _r, com_votos = avaliar_i180(textos_antigos, plantados)
    medida("contradicoes_i180", {"pontos": pontos, "repeticoes": reps, "castris_no_19": castris, "datas_de_leitura_do_prr_nos_novos": datas_prr,
                                 "contas": contas, "a_reconciliacao_passa": passa(contas)},
           "o texto visível dos documentos alojados (studies-src/<slug>/pt.html), sem marcação e com os espaços finos tornados espaço, "
           "procurado frase a frase nos seis antigos e nos quatro novos; as repetições, por cadeia ou pela lista de expressões da agulha",
           {"descricao": "cada frase que sai foi vista nos antigos e não está nos novos, cada âncora que entra está nos novos e nenhuma "
                         "repetição está em dois estudos novos; o mesmo detetor tem de falhar com os quatro estudos novos vazios e com os "
                         "«cinco votos» plantados no texto do 17",
            "com_os_estudos_novos_vazios": {"ancoras_presentes": vazios["ancoras_presentes"], "ancoras_que_entram": vazios["ancoras_que_entram"],
                                            "passa": passa(vazios)},
            "com_os_cinco_votos_plantados_no_17": {"repeticoes_em_dois_estudos_novos": com_votos["repeticoes_em_dois_estudos_novos"],
                                                   "passa": passa(com_votos)},
            "mordeu": passa(contas) and not passa(vazios) and not passa(com_votos)})


# ------------------------------------------------------ as frases envelhecidas
ENVELHECIDAS = ["documento companheiro", "comprar-lhe agora", "param em 2022", "não têm linha de cultura",
                "começam no mandato de 2021", "companion document"]


def medir_envelhecidas():
    textos_antigos = {f"{s}/{l}": texto_de_html(documento(s, l)) for s in ANTIGOS for l in ("pt", "en") if documento(s, l).exists()}
    textos_novos = {f"{s}/{l}": texto_de_html(documento(s, l)) for s in NOVOS for l in ("pt", "en") if documento(s, l).exists()}
    municipios = (SITIO / "src/data/municipios.mjs").read_text(encoding="utf-8")
    r = {}
    for f in ENVELHECIDAS:
        r[f] = {"nos_antigos": sum(conta(t, f) for t in textos_antigos.values()),
                "nos_novos": sum(conta(t, f) for t in textos_novos.values()),
                "na_ficha_do_concelho": conta(municipios, f)}
    t18 = textos_novos["evora-economia-e-dinheiro-publico-de-fora-da-camara/pt"]
    i = t18.find("As portas de financiamento, a 2026-08-10")
    anexo = t18[i:i + 600] if i >= 0 else ""
    prazos = {"cabeca_com_a_data": i >= 0, "diz_que_os_prazos_ja_passaram": "já passaram" in anexo}
    medida("frases_envelhecidas", {"frases": r, "nos_novos_total": sum(v["nos_novos"] for v in r.values()),
                                   "na_ficha_total": sum(v["na_ficha_do_concelho"] for v in r.values()),
                                   "anexo_das_portas_diz_que_os_prazos_passaram_no_18": prazos},
           "as frases envelhecidas que as leituras de fora citaram, procuradas no texto visível dos documentos alojados "
           "(antigos e novos, nas duas línguas) e em src/data/municipios.mjs",
           {"descricao": "as frases são vistas nos antigos (a soma nos antigos é maior do que zero)",
            "soma_nos_antigos": sum(v["nos_antigos"] for v in r.values()),
            "mordeu": sum(v["nos_antigos"] for v in r.values()) > 0})


# --------------------------------------------------------- as páginas (dist/)
def medir_paginas(s_cab):
    versao = json.loads((DIST / "version.json").read_text(encoding="utf-8"))
    def ler(rota):
        f = DIST / rota.strip("/") / "index.html"
        return f.read_text(encoding="utf-8") if f.exists() else None
    def estudos_listados(html):
        return [x for x in re.findall(r'data-estudo="([^"]+)"', html or "")]
    lista = {l: estudos_listados(ler(r)) for l, r in (("pt", "/estudos"), ("en", "/en/studies"))}
    def seccao(html, ancora):
        m = re.search(rf'id="{ancora}".*?</section>', html or "", re.S)
        return m.group(0) if m else ""
    conc = {l: seccao(ler(r), "trabalhos") for l, r in (("pt", "/municipios/evora"), ("en", "/en/municipalities/evora"))}
    nos_trabalhos = {l: {"novos": sorted(s for s in NOVOS if f"/{s}\"" in h or f"/{s}/\"" in h),
                         "antigos": sorted(s for s in ANTIGOS if f"/{s}\"" in h or f"/{s}/\"" in h)} for l, h in conc.items()}
    antigas = {}
    for s in ANTIGOS:
        for l, pref in (("pt", "/estudos/"), ("en", "/en/studies/")):
            h = ler(pref + s)
            antigas[f"{l}/{s}"] = {"existe": h is not None, "nota_do_sucessor": bool(h and "data-sucessor-edicao" in h),
                                   "noindex": bool(h and re.search(r'<meta name="robots" content="noindex', h))}
    novas = {}
    for s in NOVOS:
        for l, pref in (("pt", "/estudos/"), ("en", "/en/studies/")):
            h = ler(pref + s)
            novas[f"{l}/{s}"] = {"existe": h is not None, "antecessores": bool(h and "data-antecessores" in h),
                                 "noindex": bool(h and re.search(r'<meta name="robots" content="noindex', h))}
    mapas = "".join(p.read_text(encoding="utf-8") for p in sorted(DIST.glob("sitemap*.xml")))
    sitemap = {"antigos": sum(mapas.count(f"/{s}<") + mapas.count(f"/{s}/<") for s in ANTIGOS),
               "novos": sum(mapas.count(f"/{s}<") + mapas.count(f"/{s}/<") for s in NOVOS)}
    vercel = json.loads((SITIO / "vercel.json").read_text(encoding="utf-8"))
    redirige_antigos = [r for r in vercel.get("redirects", []) if any(s in r.get("source", "") for s in ANTIGOS)]
    # conhecido-positivo: os mesmos detetores numa página plantada
    planta = '<main><li data-estudo="evora-quinze-anos-cinco-mandatos"></li><p data-sucessor-edicao="x"></p></main>'
    mordeu = estudos_listados(planta) == ["evora-quinze-anos-cinco-mandatos"] and "data-sucessor-edicao" in planta
    medida("paginas", {"construcao": {"commit": versao.get("commit"), "da_cabeca": versao.get("commit") == s_cab,
                                      "estado_da_arvore": os.environ.get("OEDP_E1_ESTADO", "não declarado")},
                       "lista_dos_estudos": {l: {"evora_novos": sorted(set(x) & set(NOVOS)), "evora_antigos": sorted(set(x) & set(ANTIGOS)), "todos": len(x),
                                                 "perguntas": len(re.findall(r'class="estudo-pergunta"', ler(r) or ""))} for (l, x), r in zip(lista.items(), ("/estudos", "/en/studies"))},
                       "perguntas_na_pagina_do_concelho": {l: len(re.findall(r'class="[^"]*\blugar-estudo-pergunta\b[^"]*"', h)) for l, h in conc.items()},
                       "pagina_do_concelho_trabalhos": nos_trabalhos,
                       "paginas_antigas": antigas, "paginas_novas": novas, "sitemap": sitemap,
                       "redirecionamentos_dos_antigos": len(redirige_antigos)},
           "o dist/ da última construção: data-estudo na lista dos estudos, as ligações na secção #trabalhos da página de Évora, "
           "data-sucessor-edicao, data-antecessores e o meta robots em cada página de estudo, os endereços nos sitemap*.xml, "
           "e os redirecionamentos de vercel.json",
           {"descricao": "os detetores de data-estudo e de data-sucessor-edicao veem-nos numa página plantada", "mordeu": mordeu})


# ------------------------------------- a catraca L1: as páginas que já existiam
ROTA_DE_ESTUDO = re.compile(r"^/(estudos|en/studies)/(" + "|".join(list(NOVOS) + list(ANTIGOS)) + r")(/documento|/document)?$")


def repetidos_de_estudos(html):
    """Os destinos repetidos fora do cabeçalho e do rodapé que são rotas de um estudo de Évora."""
    m = re.search(r"<body.*?</body>", html, re.S)
    if not m:
        return {}
    b = re.sub(r"<header.*?</header>", "", m.group(0), flags=re.S)
    b = re.sub(r"<footer.*?</footer>", "", b, flags=re.S)
    c = collections.Counter(h.split("#")[0].rstrip("/") for h in re.findall(r'<a [^>]*href="([^"]*)"', b)
                            if h and not h.startswith("#") and not h.startswith("mailto:"))
    return {k: v for k, v in c.items() if v > 1 and ROTA_DE_ESTUDO.match(k)}


def medir_l1_paginas_antigas():
    l1 = json.loads((AQUI / "l1-e1.json").read_text(encoding="utf-8"))
    novas, documento_padrao, outras = 0, 0, []
    for f in sorted(DIST.rglob("index.html")):
        rel = str(f.parent.relative_to(DIST))
        rota = "/" if rel == "." else "/" + rel
        rep = repetidos_de_estudos(f.read_text(encoding="utf-8", errors="replace"))
        if not rep:
            continue
        if any(s in rota for s in NOVOS):
            novas += 1
            continue
        propria = re.sub(r"/(documento|document)$", "", rota)
        if rota.endswith(("/documento", "/document")) and set(rep) == {propria}:
            documento_padrao += 1
            continue
        outras.append({"rota": rota, "repetidos": rep})
    agenda_igual = subprocess.run(["git", "diff", "--quiet", "HEAD", "--", "src/data/agenda.json"], cwd=SITIO).returncode == 0
    planta = '<body><header><a href="/estudos/evora-contas-da-camara-2010-2025">x</a></header><main><a href="/estudos/evora-contas-da-camara-2010-2025">a</a><a href="/estudos/evora-contas-da-camara-2010-2025#b">b</a></main></body>'
    medida("l1_paginas_antigas", {"teto": l1["contagens"], "paginas_novas_com_repeticao_de_estudo": novas,
                                  "documentos_antigos_com_a_porta_do_proprio_estudo_duas_vezes": documento_padrao,
                                  "outras_paginas_antigas": outras, "agenda_json_igual_a_cabeca": agenda_igual},
           "cada index.html do dist/: as ligações fora do cabeçalho e do rodapé, sem fragmento, contadas por destino; "
           "ficam as repetidas que são rotas de um dos dez estudos de Évora, separadas em páginas novas, páginas de documento "
           "com a porta do próprio estudo duas vezes (a mobília de todas as páginas de documento) e outras",
           {"descricao": "uma página plantada com duas ligações no corpo para o estudo das contas (e uma no cabeçalho) dá um destino repetido",
            "mordeu": repetidos_de_estudos(planta) == {"/estudos/evora-contas-da-camara-2010-2025": 2}})


# ------------------------------------------------------------------ os achados
def medir_achados():
    def visivel(slug, lang="pt"):
        return texto_de_html(documento(slug, lang))
    asteriscos = lambda s: len(re.findall(r"(?<![\w*])\*[A-Za-zÀ-ÿ«]", s))
    ingles = lambda s: len(re.findall(r"\b(?:until|from) the August 2019 redistribution\b|as the 2021 report records the outgoing executive", s))
    q08, q17 = visivel("evora-quinze-anos-cinco-mandatos"), visivel("evora-quem-governou-a-camara-2009-2025")
    p09 = visivel("evora-os-pelouros-quem-os-teve-o-que-fizeram")
    s14, s19 = visivel("evora-2027-prometido-painel-dinheiro"), visivel("evora-2027-capital-europeia-da-cultura")
    l07 = {c["id"]: c for c in json.loads((MOTOR / "content/07 Évora Municipal Accounts/ledger.json").read_text(encoding="utf-8"))["claims"]}
    gop, prr = l07["evora2027-gop-2026"], l07["prr-approved-evora-0804"]
    def selos_da_linha(caminho, linha):
        """As células de tabela cujo algarismo o registo dá à linha, com o rótulo da linha da tabela."""
        r = json.loads((SITIO / caminho).read_text(encoding="utf-8")); out = []
        for b_ in r["blocks"]:
            if b_["kind"] != "table":
                continue
            for ri, row in enumerate(b_["rows"]):
                for c in row:
                    for f in c.get("figures", []):
                        if f["row"] == linha:
                            out.append({"bloco": b_["i"], "linha_da_tabela": row[0]["text"].replace("\u200b", "")[:40], "impresso": f["printed"]})
        return out
    selos08 = selos_da_linha("registos/evora-quinze-anos-cinco-mandatos/pt.record.json", "el2013-pcp-pev-seats")
    selos17 = selos_da_linha("registos/evora-quem-governou-a-camara-2009-2025/pt.record.json", "el2013-pcp-pev-seats")
    medida("achados", {
        "verify_ingles_no_quinze_anos_pt": q08.count("[verify]"), "verify_ingles_no_17": q17.count("[verify]"),
        "a_verificar_no_17": q17.count("[a verificar]"),
        "frases_inglesas_nos_pelouros_pt": ingles(p09), "frases_inglesas_no_17": ingles(q17),
        "asteriscos_a_vista_no_evora_2027_de_setembro": asteriscos(s14), "asteriscos_a_vista_no_19": asteriscos(s19),
        "a_linha_dos_3_984_060": {"id": "evora2027-gop-2026", "documento": gop["source_url"].rsplit("/", 1)[-1],
                                  "pagina_no_excerto": re.search(r"PDF p\.(\d+)", gop["excerpt"]).group(1)},
        "o_par_do_prr": {"id": "prr-approved-evora-0804", "data_no_endereco": re.search(r"/(\d{8})-\d{6}", prr["source_url"]).group(1)},
        "selos_da_linha_el2013_pcp_pev_seats": {"no_quinze_anos": selos08, "no_17": selos17}},
        "o texto visível dos documentos alojados, procurado pelas cadeias de cada achado, e as duas linhas do livro do 07 no motor",
        {"descricao": "cada detetor encontra o defeito no estudo antigo onde ele estava",
         "mordeu": q08.count("[verify]") > 0 and ingles(p09) > 0 and asteriscos(s14) > 0})


# ----------------------------------------------------------- os contadores
def medir_contadores(s_base):
    agora = obras()
    tmp = Path(tempfile.mkdtemp(prefix="e1-base-"))
    try:
        f = tmp / "studies.mjs"
        f.write_text(corre(["git", "show", f"{s_base}:src/data/studies.mjs"]), encoding="utf-8")
        # o studies.mjs reexporta o marcador; o da base vai ao lado dele
        (tmp / "marcador.mjs").write_text(corre(["git", "show", f"{s_base}:src/data/marcador.mjs"]), encoding="utf-8")
        antes = obras(f)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    def linha(nome, rev=None):
        t = corre(["git", "show", f"{rev}:ledger/claims/{nome}.yml"]) if rev else (SITIO / f"ledger/claims/{nome}.yml").read_text(encoding="utf-8")
        return yaml.safe_load(t)
    hist = json.loads((SITIO / "ledger/historias-valores.json").read_text(encoding="utf-8"))
    ev = linha("estudos-evora-publicados")
    medida("contador_dos_estudos_de_evora", {"valor_da_linha": ev["value"], "conta_do_arquivo": agora["counts"].get("estudos_evora_no_arquivo"),
                                             "entradas_seladas": len(hist.get("estudos-evora-publicados", [])),
                                             "ultima_selada": hist.get("estudos-evora-publicados", [None])[-1]},
           "o value de ledger/claims/estudos-evora-publicados.yml, a COUNTS.estudos_evora_no_arquivo de src/data/studies.mjs "
           "(importado pelo node) e a lista selada em ledger/historias-valores.json",
           {"descricao": "a mesma conta sobre o studies.mjs da base dá o valor que a linha tinha na base",
            "base": {"conta": antes["counts"].get("estudos_evora_no_arquivo"), "linha": linha("estudos-evora-publicados", s_base)["value"]},
            "mordeu": str(antes["counts"].get("estudos_evora_no_arquivo")) == linha("estudos-evora-publicados", s_base)["value"]})
    arq = {}
    for nome, chave in (("estudos-publicados", "estudos_no_arquivo"), ("edicoes-publicadas", "edicoes_no_arquivo")):
        arq[nome] = {"valor_da_linha": linha(nome)["value"], "conta_do_arquivo": agora["counts"].get(chave),
                     "concordam": str(agora["counts"].get(chave)) == linha(nome)["value"],
                     "base": {"valor_da_linha": linha(nome, s_base)["value"], "conta_do_arquivo": antes["counts"].get(chave)}}
    medida("contadores_do_arquivo_a_paragem", arq,
           "o value de ledger/claims/estudos-publicados.yml e edicoes-publicadas.yml contra COUNTS.estudos_no_arquivo e "
           "edicoes_no_arquivo de src/data/studies.mjs, na árvore e na base",
           {"descricao": "na base, a mesma comparação concorda (a linha e a conta dão o mesmo número)",
            "mordeu": all(str(v["base"]["conta_do_arquivo"]) == v["base"]["valor_da_linha"] for v in arq.values())})


# ------------------------------------------------------------- as capturas
def medir_capturas():
    man = json.loads((AQUI / "capturas-e1.json").read_text(encoding="utf-8"))
    certas, erradas = 0, []
    for r in man["resultados"]:
        f = SITIO / r["ficheiro"]
        if f.exists() and sha256(f.read_bytes()) == r["sha256"]:
            certas += 1
        else:
            erradas.append(r["ficheiro"])
    planta = sha256(b"planta") != sha256(b"plantA")
    medida("capturas", {"capturas": man["capturas"], "sha256_conferidos": certas, "divergem": erradas, "cabeca": man["cabeca"],
                        "estado": man["estado"], "problemas": man["problemas"], "pedidos_recusados_para_fora": man["pedidos_recusados_para_fora"]},
           "o sha256 de cada PNG recalculado e comparado com o de capturas-e1.json, escrito pelo captar-e1.mjs",
           {"descricao": "dois corpos que diferem num byte dão sha256 diferentes", "mordeu": planta})


# --------------------------------------------------------------- os portões
def medir_portoes():
    r = {}
    for estado in ("real", "ensaio"):
        p = AQUI / "portoes" / estado
        if not p.is_dir():
            continue
        r[estado] = {"cabeca": (p / "cabeca").read_text().strip() if (p / "cabeca").exists() else None}
        for g in ("build", "verify", "typecheck"):
            f = p / f"{g}.codigo"
            r[estado][g] = int(f.read_text().strip()) if f.exists() else None
            lg = p / f"{g}.log"
            if lg.exists():
                linhas = lg.read_text(encoding="utf-8", errors="replace").splitlines()
                falhas = [l.strip() for l in linhas if "✗" in l or "Error:" in l or "falhou" in l or "não bate certo" in l]
                r[estado][f"{g}_falhas"] = [f[:300] for f in falhas[:5]]
    planta_dir = Path(tempfile.mkdtemp(prefix="e1-cod-"))
    try:
        (planta_dir / "x.codigo").write_text("1\n")
        mordeu = int((planta_dir / "x.codigo").read_text().strip()) == 1
    finally:
        shutil.rmtree(planta_dir, ignore_errors=True)
    medida("portoes_do_sitio", r,
           "os códigos de npm run build, npm run verify e npm run typecheck, cada um no seu comando, escritos em "
           "portoes/<estado>/<portão>.codigo depois de o processo acabar (scripts/leituras/portoes.sh da §1.147)",
           {"descricao": "o leitor dos ficheiros de código lê 1 num ficheiro plantado com 1", "mordeu": mordeu})


# ------------------------------------------------------------------ o custo
def medir_custo():
    def criado(cwd):
        linhas = corre(["git", "reflog", "show", "--date=iso-strict", "e1-2026-09-30"], cwd=cwd).splitlines()
        m = re.search(r"@\{([^}]+)\}", linhas[-1])
        return m.group(1)
    agora = datetime.now(timezone.utc)
    m = datetime.fromisoformat(criado(MOTOR))
    s = datetime.fromisoformat(criado(SITIO))
    inicio = min(m, s)
    simbolos = os.environ.get("OEDP_E1_SIMBOLOS")
    medida("custo", {"modelo": "Claude Opus 5.5", "inicio_dos_ramos": inicio.isoformat(), "medido_em": agora.isoformat(timespec="seconds"),
                     "segundos_de_relogio": int((agora - inicio).total_seconds()),
                     "simbolos": simbolos or "dívida: a ferramenta reporta o total do agente ao lugar de direção no fim; o guião não o lê",
                     "fonte_dos_simbolos": "o contador do orçamento que a ferramenta mostra ao agente (diferença entre o início e o fim), passado em OEDP_E1_SIMBOLOS" if simbolos else None},
           "git reflog show --date=iso-strict e1-2026-09-30 nas duas árvores (a criação do ramo) até à hora da medida",
           {"descricao": "a criação do ramo é a última linha do reflog e diz «branch: Created from»",
            "mordeu": "Created from" in corre(["git", "reflog", "show", "e1-2026-09-30"], cwd=MOTOR).splitlines()[-1]})


def main():
    os.chdir(SITIO)
    print("E1 · medidas")
    s_cab, s_base, m_cab, m_base = medir_cabecas()
    medir_ficheiros_do_motor()
    medir_portao_do_motor()
    medir_codigo_do_portao_do_motor()
    medir_linhas(s_base)
    medir_numeros_em_dois_estudos()
    medir_celulas()
    medir_celulas_e_linhas_do_sitio()
    medir_celulas_nas_paginas()
    medir_selos()
    medir_mapa_de_migracao()
    medir_i180()
    medir_envelhecidas()
    medir_achados()
    medir_paginas(s_cab)
    medir_l1_paginas_antigas()
    medir_contadores(s_base)
    medir_capturas()
    medir_portoes()
    medir_custo()
    falhou = [m["nome"] for m in MEDIDAS if not m["conhecido_positivo"].get("mordeu")]
    saida = {"bloco": "E1", "guiao": "design/especime-v3/medicoes/e1-2026-09-30/medir-e1.py",
             "medido_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
             "conhecidos_positivos_que_nao_morderam": falhou, "medidas": MEDIDAS}
    # AS CHAVES DAS PASSAGENS FICAM (passagem E1c): a E1b e a E1c escrevem as suas medidas em `e1b` e `e1c`, e
    # uma corrida deste guião reescrevia o ficheiro inteiro sem elas.
    anterior = json.loads((AQUI / "medidas.json").read_text(encoding="utf-8")) if (AQUI / "medidas.json").exists() else {}
    for chave, valor in anterior.items():
        if re.fullmatch(r"e1[b-z]", chave):
            saida[chave] = valor
    texto = json.dumps(saida, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit(f"Um caminho da máquina ia para o medidas.json; nada escrito.")
    (AQUI / "medidas.json").write_text(texto, encoding="utf-8")
    print(f"E1 · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
