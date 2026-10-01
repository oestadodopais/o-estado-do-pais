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
def medir_celulas():
    prog = r'''
import json, re, sys, collections
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
def medir(md, livro):
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
pedidos = json.loads(sys.stdin.read()); saida = {}
for nome, md_path, livro_path, extra in pedidos:
    md = open(md_path, encoding="utf-8").read() + extra
    saida[nome] = medir(md, json.load(open(livro_path, encoding="utf-8")))
print(json.dumps(saida, ensure_ascii=False))
'''
    pedidos = []
    for slug, pasta in NOVOS.items():
        d = MOTOR / "content" / pasta
        for md in sorted(d.glob("*.md")):
            pedidos.append([f"{pasta}/{md.name}", str(md), str(d / "ledger.json"), ""])
    d16 = MOTOR / "content" / NOVOS["evora-contas-da-camara-2010-2025"]
    md16 = sorted(d16.glob("*(pt-PT).md"))[0]
    pedidos.append(["planta", str(md16), str(d16 / "ledger.json"), "\n\n| Coluna | Valor |\n|---|---|\n| plantada | 123 456 |\n"])
    r = subprocess.run([sys.executable, "-c", prog], cwd=MOTOR, input=json.dumps(pedidos), capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-800:])
    saida = json.loads(r.stdout)
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
    classes = collections.defaultdict(collections.Counter)
    for nome, (cont, casos) in saida.items():
        for c in casos:
            c["classe"] = classe_de(c["texto"])
            classes[nome][c["classe"]] += 1
    medida("celulas_de_tabela_sem_linha", {n: {"contagem": c, "casos": casos} for n, (c, casos) in saida.items()} |
           {"_classes_das_celulas_sem_linha": {n: dict(c) for n, c in classes.items()},
            "_outras_no_19": sum(c.get("outro", 0) for n, c in classes.items() if n.startswith("19")),
            "_quantidades_sem_linha_16_17_18": sum(c.get("sem_linha", 0) for n, (c, _) in saida.items() if not n.startswith("19"))},
           "core.documento_md + core.eyetext + core.reconcile no motor: cada número das células das tabelas, tirado o que não é "
           "quantidade (datas, anos, códigos, páginas, números de lei), procurado nas formas indexadas das linhas do livro do estudo",
           {"descricao": "uma tabela plantada no fim do 16 com «123 456» dá uma célula sem linha a mais",
            "sem_linha_na_planta": planta[0].get("sem_linha", 0), "mordeu": planta[0].get("sem_linha", 0) == base16[0].get("sem_linha", 0) + 1})


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
    ("1-prr-tres-datas", "os totais do PRR com três datas de leitura e dois valores",
     {"167 372 756": None, "167 337 246": None}, []),
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
    ("votacao-das-contas-de-2024", "a votação das contas de 2024", "2 votos a favor"),
    ("declaracao-do-auditor", "a declaração de impossibilidade do auditor", "Declaração de Impossibilidade"),
    ("cento-e-trinta-e-sete-dias", "os 137 dias de prazo médio de pagamento", "137 dias"),
    ("pagamentos-em-atraso", "os €4 976 172 em atraso", "4 976 172"),
]


def medir_i180():
    textos_antigos = {s: texto_de_html(documento(s)) for s in ANTIGOS}
    textos_novos = {s: texto_de_html(documento(s)) for s in NOVOS}
    pontos = []
    for pid, oque, saem, entram in I180:
        r = {"ponto": pid, "o_que_era": oque, "saem": {}, "entram": []}
        for frase in saem:
            antes = {s: conta(t, frase) for s, t in textos_antigos.items() if conta(t, frase)}
            depois = {s: conta(t, frase) for s, t in textos_novos.items() if conta(t, frase)}
            r["saem"][frase] = {"nos_antigos": antes, "nos_novos": depois}
        for slug, ancora in entram:
            r["entram"].append({"estudo": slug, "ancora": ancora, "vezes": conta(textos_novos[slug], ancora)})
        pontos.append(r)
    reps = []
    for rid, oque, agulha in REPETICOES:
        reps.append({"repeticao": rid, "o_que_era": oque, "agulha": agulha,
                     "estudos_antigos_com_ela": sorted(s for s, t in textos_antigos.items() if agulha in t),
                     "estudos_novos_com_ela": sorted(s for s, t in textos_novos.items() if agulha in t)})
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
    # conhecido-positivo: cada frase que sai tem de ser vista em pelo menos um estudo antigo
    vistas = {f: any(conta(t, f) for t in textos_antigos.values()) for _, _, saem, _ in I180 for f in saem}
    medida("contradicoes_i180", {"pontos": pontos, "repeticoes": reps, "castris_no_19": castris, "datas_de_leitura_do_prr_nos_novos": datas_prr},
           "o texto visível dos documentos alojados (studies-src/<slug>/pt.html), sem marcação e com os espaços finos tornados espaço, "
           "procurado frase a frase nos seis antigos e nos quatro novos",
           {"descricao": "cada frase que sai foi vista em pelo menos um dos seis antigos, e cada repetição em pelo menos dois",
            "frases_vistas_nos_antigos": vistas,
            "repeticoes_vistas_em_dois_antigos": {r["repeticao"]: len(r["estudos_antigos_com_ela"]) >= 2 for r in reps},
            "mordeu": all(vistas.values())})


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
    texto = json.dumps(saida, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit(f"Um caminho da máquina ia para o medidas.json; nada escrito.")
    (AQUI / "medidas.json").write_text(texto, encoding="utf-8")
    print(f"E1 · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
