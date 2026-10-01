#!/usr/bin/env python3
"""E1d · as medidas da passagem E1d (01.10.2026), escritas em medidas.json na chave `e1d`.

    OEDP_MOTOR=<árvore do motor> python3 design/especime-v3/medicoes/e1-2026-09-30/e1d/medir-e1d.py

Corre-se da raiz do sítio, com o dist/ construído da cabeça do ramo. Mede os dois pontos da passagem (as
fichas dos mandatos com valores de fim de ano, e a frase da região no corpo do estudo da economia), a
travessia, o motor, os portões, as capturas e o custo. Cada medida traz o nome, o valor, o comando e um
conhecido-positivo. As outras chaves do medidas.json ficam como estavam, e nenhum caminho da máquina vai
para o ficheiro.
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
PASTA = AQUI.parent
SITIO = PASTA.parents[3]
if not os.environ.get("OEDP_MOTOR"):
    sys.exit("Falta OEDP_MOTOR: a árvore do motor na cabeça do ramo.")
MOTOR = Path(os.environ["OEDP_MOTOR"]).resolve()
DIST = SITIO / "dist"
CABECA_E1C_SITIO = "e986468d"
CABECA_E1C_MOTOR = "932eaee"
MEDIDAS = []


def corre(args, cwd=SITIO):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(map(str, args[:3]))} falhou ({r.returncode}): {r.stderr[-600:]}")
    return r.stdout


def ler(c):
    return Path(c).read_text(encoding="utf-8")


def codigo(c):
    return int(ler(AQUI / c).strip())


def visivel(html):
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", html, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    for ent, c in (("&nbsp;", " "), ("&#160;", " "), ("&amp;", "&"), ("&#39;", "'"), ("&quot;", '"')):
        t = t.replace(ent, c)
    t = re.sub(r"[   ​]", " ", t)
    return re.sub(r"\s+", " ", t)


def medida(nome, valor, comando, conhecido_positivo):
    MEDIDAS.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": conhecido_positivo})
    print(f"  {nome}: {json.dumps(valor, ensure_ascii=False)[:150]}")


def medir_cabecas():
    s, m = corre(["git", "rev-parse", "HEAD"]).strip(), corre(["git", "rev-parse", "HEAD"], cwd=MOTOR).strip()
    tipos = {x: corre(["git", "cat-file", "-t", x], cwd=c).strip() for x, c in ((s, SITIO), (m, MOTOR), (CABECA_E1C_SITIO, SITIO), (CABECA_E1C_MOTOR, MOTOR))}
    medida("cabecas_e1d", {"sitio": s, "motor": m, "sitio_na_e1c": CABECA_E1C_SITIO, "motor_na_e1c": CABECA_E1C_MOTOR,
                           "commits_do_sitio": corre(["git", "log", "--format=%h %s", f"{CABECA_E1C_SITIO}..HEAD"]).splitlines(),
                           "commits_do_motor": corre(["git", "log", "--format=%h %s", f"{CABECA_E1C_MOTOR}..HEAD"], cwd=MOTOR).splitlines(),
                           "arvore_do_motor_limpa": corre(["git", "status", "--porcelain"], cwd=MOTOR).strip() == ""},
           "git rev-parse HEAD e git log <cabeça da E1c>..HEAD nas duas árvores",
           {"descricao": "git cat-file -t de cada cabeça diz «commit»", "resultado": tipos, "mordeu": all(v == "commit" for v in tipos.values())})


# ------------------------------------------------------------------ 1 · as fichas
CAMPOS = [("mandato-2013-2017", "deixou", "31.12.2017", "evora-divida-total-2017"),
          ("mandato-2017-2021", "herdou", "31.12.2017", "evora-divida-total-2017"),
          ("mandato-2017-2021", "deixou", "31.12.2021", "evora-divida-total-2021"),
          ("mandato-2021-2025", "herdou", "31.12.2021", "evora-divida-total-2021"),
          ("mandato-2021-2025", "deixou", "31.12.2025", "evora-divida-total-2025"),
          ("mandato-2025", "herdou", "31.12.2025", "evora-divida-total-2025")]
ROTULO = {"pt": {"herdou": "Herdou", "deixou": "Deixou"}, "en": {"herdou": "Inherited", "deixou": "Left"}}
ABRE = {"pt": "As contas do ano da mudança", "en": "The accounts of the year of the change"}


def campo(html, ancora, rotulo):
    m = re.search(rf'id="{ancora}".*?<dt>{rotulo}</dt>\s*<dd>(.*?)</dd>', html or "", re.S)
    return m.group(1) if m else None


def avaliar(dd, lang, dia, linha):
    if dd is None:
        return {"existe": False, "certo": False}
    texto = visivel(dd).strip()
    r = {"existe": True, "abre_com_a_frase": texto.startswith(ABRE[lang]),
         "a_data": bool(re.search(rf'data-nonledger="data-de-referencia">{re.escape(dia)}<', dd)),
         "a_linha": f'data-claim="{linha}"' in dd, "texto": texto[:220]}
    r["certo"] = r["abre_com_a_frase"] and r["a_data"] and r["a_linha"]
    return r


def medir_fichas():
    r = {}
    for lang, rota in (("pt", "municipios/evora"), ("en", "en/municipalities/evora")):
        h = ler(DIST / rota / "index.html")
        r[lang] = {f"{a}/{c}": avaliar(campo(h, a, ROTULO[lang][c]), lang, dia, linha) for a, c, dia, linha in CAMPOS}
        # os valores de 31.10.2013, registados à data da posse, ficam em «Herdou» sem a frase
        dd = campo(h, "mandato-2013-2017", ROTULO[lang]["herdou"])
        r[lang]["mandato-2013-2017/herdou (31.10.2013)"] = {"sem_a_frase": not visivel(dd or "").strip().startswith(ABRE[lang]),
                                                            "a_linha_de_31_10_2013": 'data-claim="evora-divida-31-10-2013"' in (dd or "")}
    certos = sum(1 for x in r.values() for k, v in x.items() if "certo" in v and v["certo"])
    planta = ('<div id="mandato-2017-2021"><dl><dt>Herdou</dt><dd><span class="claim"><span data-claim="evora-divida-total-2017">'
              '69 532 414,48</span></span> euros de dívida total. </dd></dl></div>')
    p = avaliar(campo(planta, "mandato-2017-2021", "Herdou"), "pt", "31.12.2017", "evora-divida-total-2017")
    medida("fichas_e1d", {"edicoes": r, "campos_certos": certos, "campos": 2 * len(CAMPOS)},
           "dist/municipios/evora e dist/en/municipalities/evora: o <dd> a seguir a «Herdou»/«Inherited» ou «Deixou»/«Left» em cada ficha "
           "com um valor de fim de ano, lido pelo texto visível e pelas marcas (a data em data-nonledger=\"data-de-referencia\", o data-claim da dívida)",
           {"descricao": "a ficha de 2017 a 2021 como estava (a dívida logo a seguir a «Herdou», sem a frase) é dada como errada",
            "planta": p, "mordeu": p["existe"] and not p["certo"]})


# ------------------------------------------------------------------ 2 · a frase da região
MD = {"pt": "content/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md",
      "en": "content/18 Évora Economia e Dinheiro de Fora/The economy of Évora and the public money that reaches the municipality outside the council.md"}
SAI = {"pt": "região pobre", "en": "poor region"}
ENTRA = {"pt": "Évora é uma cidade relativamente próspera dentro de uma região abaixo da média do país.",
         "en": "Évora is a relatively prosperous city inside a region below the national average."}


def medir_regiao():
    r, antes_ok = {}, True
    for lang in ("pt", "en"):
        md_agora, md_antes = corre(["git", "show", f"HEAD:{MD[lang]}"], cwd=MOTOR), corre(["git", "show", f"{CABECA_E1C_MOTOR}:{MD[lang]}"], cwd=MOTOR)
        doc = f"studies-src/evora-economia-e-dinheiro-publico-de-fora-da-camara/{lang}.html"
        d_agora, d_antes = visivel(ler(SITIO / doc)), visivel(corre(["git", "show", f"{CABECA_E1C_SITIO}:{doc}"]))
        r[lang] = {"sai_motor_antes": md_antes.count(SAI[lang]), "sai_motor_agora": md_agora.count(SAI[lang]),
                   "sai_documento_antes": d_antes.count(SAI[lang]), "sai_documento_agora": d_agora.count(SAI[lang]),
                   "entra_motor": md_agora.count(ENTRA[lang]), "entra_documento": d_agora.count(ENTRA[lang])}
        antes_ok = antes_ok and r[lang]["sai_motor_antes"] >= 1 and r[lang]["sai_documento_antes"] >= 1
    certo = all(v["sai_motor_agora"] == 0 and v["sai_documento_agora"] == 0 and v["entra_motor"] == 1 and v["entra_documento"] == 1 for v in r.values())
    medida("regiao_e1d", {"edicoes": r, "certo": certo},
           "git show <cabeça>:<edição .md> no motor (na cabeça e na da E1c, 932eaee) e o texto visível do documento alojado no sítio "
           "(na árvore e na cabeça da E1c, e986468d), contadas a frase que sai e a que entra",
           {"descricao": "a frase que sai estava no motor e no documento alojado na E1c (o mesmo detetor vê-a lá)", "mordeu": antes_ok})


# ------------------------------------------------------------------ a travessia e o motor
def medir_travessia():
    rep = json.loads(ler(AQUI / "republicar-documentos-e1d.json"))
    lg = ler(AQUI / "motor-travessia" / "records-site-escrever.log")
    c = re.search(r"(\d+) nova\(s\) · (\d+) alterada\(s\) · (\d+) inalterada\(s\)", lg)
    o = re.search(r"--with-origin: (\d+) registo\(s\) conferidos", ler(AQUI / "check-documentos-com-origem.log"))
    leit = json.loads(ler(AQUI / "conferir-leituras-e1d.json"))
    medida("travessia_e1d", {"documentos_realojados": len(rep["edicoes"]), "mudaram": sum(1 for e in rep["edicoes"] if e["mudou"]),
                             "commit_do_motor_dos_bytes": sorted({e["commit"][:7] for e in rep["edicoes"]}),
                             "registos": {"novos": int(c.group(1)), "alterados": int(c.group(2)), "inalterados": int(c.group(3))},
                             "check_documentos": codigo("check-documentos.codigo"), "check_documentos_com_origem": codigo("check-documentos-com-origem.codigo"),
                             "registos_conferidos_contra_o_motor": int(o.group(1)),
                             "conferencia_das_leituras": {"codigo": codigo("conferir-leituras-e1d.codigo"), "falhas": leit["falhas"]}},
           "e1d/republicar-documentos-e1d.json, o registo do publisher/export_records_site.py --write, os códigos do check:documentos "
           "(com e sem --with-origin) e da conferência das leituras da E1c, cada um escrito num ficheiro depois de o processo acabar",
           {"descricao": "os quatro conhecidos-positivos da conferência das leituras morderam", "mordeu": all(p["mordeu"] for p in leit["positivos"])})


def medir_motor():
    p, tr = AQUI / "motor", AQUI / "motor-travessia"
    cod, log = int(ler(p / "gate.codigo").strip()), ler(p / "gate.log")
    primeira = ler(tr / "commit-motor-1-primeira-tentativa.log")
    medida("motor_e1d", {"portao": {"codigo": cod, "cabeca": ler(p / "cabeca").strip(), "inicio": ler(p / "gate.inicio").strip(),
                                    "fim": ler(p / "gate.fim").strip(), "linha_final_pass": "GATE: PASS" in log},
                         "commits": {"primeira_tentativa": int(ler(tr / "commit-motor-1-primeira-tentativa.codigo").strip()),
                                     "o_que_parou_a_primeira": re.findall(r"^\s+- (R5 [^\n]{0,90})", primeira, re.M)[:1],
                                     "commit_1": int(ler(tr / "commit-motor-1.codigo").strip()), "commit_2": int(ler(tr / "commit-motor-2.codigo").strip())},
                         "composicao": int(ler(tr / "compor-escrever-18.codigo").strip()), "html": int(ler(tr / "make-html-18.codigo").strip()),
                         "atribuicoes": int(ler(tr / "atribuicoes-18.codigo").strip()), "registos_do_motor": int(ler(tr / "export-records-escrever.codigo").strip())},
           "python3 -m core.gate na cabeça final do motor, com o código escrito em e1d/motor/gate.codigo depois de o processo acabar; "
           "e os códigos de cada passo da travessia em e1d/motor-travessia/",
           {"descricao": "o código lido do ficheiro concorda com a última linha do registo, e a primeira tentativa do commit deu código diferente de zero",
            "mordeu": (cod == 0) == ("GATE: PASS" in log) and int(ler(tr / "commit-motor-1-primeira-tentativa.codigo").strip()) != 0})


def medir_portoes():
    medida("portoes_e1d", {"construcao_da_cabeca_de_codigo": {"cabeca": ler(AQUI / "intermedias" / "build-1.cabeca").strip(), "build": codigo("intermedias/build-1.log.codigo")}},
           "npm run build na cabeça de código, pela tranca da máquina (e1c/com-tranca.sh), com o código escrito num ficheiro depois de o "
           "processo acabar; a corrida final dos três portões faz-se depois do commit do relatório, em portoes/e1d/",
           {"descricao": "o leitor dos ficheiros de código lê 1 num ficheiro da E1c que tem 1 (a construção intermédia da E1c)",
            "mordeu": int(ler(PASTA / "e1c" / "intermedias" / "build-1.log.codigo").strip()) == 1})


def medir_capturas():
    man = json.loads(ler(PASTA / "capturas-e1d.json"))
    certas = sum(1 for r in man["resultados"] if (SITIO / r["ficheiro"]).exists() and hashlib.sha256((SITIO / r["ficheiro"]).read_bytes()).hexdigest() == r["sha256"])
    medida("capturas_e1d", {"capturas": man["capturas"], "sha256_conferidos": certas, "cabeca": man["cabeca"], "estado": man["estado"],
                            "problemas": man["problemas"], "pedidos_recusados_para_fora": man["pedidos_recusados_para_fora"], "larguras": man["larguras"]},
           "o sha256 de cada PNG recalculado e comparado com o de capturas-e1d.json, escrito pelo captar-e1.mjs com OEDP_E1_BLOCO=E1d",
           {"descricao": "dois corpos que diferem num byte dão resumos diferentes",
            "mordeu": hashlib.sha256(b"planta").hexdigest() != hashlib.sha256(b"plantA").hexdigest()})


def medir_custo():
    primeiro = corre(["git", "log", "--reverse", "--format=%cI %h %s", f"{CABECA_E1C_MOTOR}..HEAD"], cwd=MOTOR).splitlines()[0]
    inicio = datetime.fromisoformat(primeiro.split()[0])
    agora = datetime.now(timezone.utc)
    medida("custo_e1d", {"modelo": "Claude Opus 5.5", "primeiro_commit_da_passagem": primeiro, "inicio": inicio.isoformat(),
                         "medido_em": agora.isoformat(timespec="seconds"), "segundos_de_relogio_desde_o_primeiro_commit": int((agora - inicio).total_seconds()),
                         "simbolos": json.loads(ler(AQUI / "custo-simbolos-transcrito.json"))},
           "git log --reverse --format=%cI 932eaee..HEAD no motor (o primeiro commit da passagem) até à hora da medida; os símbolos são "
           "uma transcrição, não uma medida deste guião",
           {"descricao": "o primeiro commit da passagem no motor é o da emenda do corpo do 18, 4f3165a", "mordeu": primeiro.split()[1] == "4f3165a"})


def main():
    os.chdir(SITIO)
    print("E1d · medidas")
    for f in (medir_cabecas, medir_fichas, medir_regiao, medir_travessia, medir_motor, medir_portoes, medir_capturas, medir_custo):
        f()
    falhou = [x["nome"] for x in MEDIDAS if not x["conhecido_positivo"].get("mordeu")]
    alvo = PASTA / "medidas.json"
    tudo = json.loads(ler(alvo))
    tudo["e1d"] = {"bloco": "E1d", "guiao": "design/especime-v3/medicoes/e1-2026-09-30/e1d/medir-e1d.py",
                   "medido_em": datetime.now(timezone.utc).isoformat(timespec="seconds"), "conhecidos_positivos_que_nao_morderam": falhou, "medidas": MEDIDAS}
    texto = json.dumps(tudo, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit("Um caminho da máquina ia para o medidas.json; nada escrito.")
    alvo.write_text(texto, encoding="utf-8")
    print(f"E1d · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
