#!/usr/bin/env python3
"""E1e · as medidas da passagem E1e (01.10.2026), escritas em medidas.json na chave `e1e`.

    OEDP_MOTOR=<árvore do motor> python3 design/especime-v3/medicoes/e1-2026-09-30/e1e/medir-e1e.py

Corre-se da raiz do sítio. Mede os cinco pontos da passagem (os cinco achados reais da releitura a frio do
Sol às passagens E1c e E1d): a frase da aritmética no corpo do 17, a explicação das paridades de poder de
compra no 18, a C3 da régua das células, a saída dos guiões de medida quando uma medida real falha, e a
conferência das cópias das leituras com um documento em falta e um gabarito ilegível; e a travessia, o motor
e o custo. Cada medida traz o nome, o valor, o comando e um conhecido-positivo, e o guião sai com 1 quando um
conhecido-positivo não morde ou quando uma medida real falha (`falhas_reais()`). As outras chaves do
medidas.json ficam como estavam, e nenhum caminho da máquina vai para o ficheiro.
"""
import importlib.util
import itertools
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
CABECA_E1D_SITIO = "90640cf6"
CABECA_E1D_MOTOR = "7187b82"
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
    tipos = {x: corre(["git", "cat-file", "-t", x], cwd=c).strip() for x, c in ((s, SITIO), (m, MOTOR), (CABECA_E1D_SITIO, SITIO), (CABECA_E1D_MOTOR, MOTOR))}
    medida("cabecas_e1e", {"sitio": s, "motor": m, "sitio_na_e1d": CABECA_E1D_SITIO, "motor_na_e1d": CABECA_E1D_MOTOR,
                           "commits_do_sitio": corre(["git", "log", "--format=%h %s", f"{CABECA_E1D_SITIO}..HEAD"]).splitlines(),
                           "commits_do_motor": corre(["git", "log", "--format=%h %s", f"{CABECA_E1D_MOTOR}..HEAD"], cwd=MOTOR).splitlines()},
           "git rev-parse HEAD e git log <cabeça da E1d>..HEAD nas duas árvores",
           {"descricao": "git cat-file -t de cada cabeça diz «commit»", "resultado": tipos, "mordeu": all(v == "commit" for v in tipos.values())})


# ------------------------------------------------------- 1 e 2 · as emendas, no motor e nos documentos alojados
MD = {("17", "pt"): ("content/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md", "evora-quem-governou-a-camara-2009-2025"),
      ("18", "pt"): ("content/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md",
                     "evora-economia-e-dinheiro-publico-de-fora-da-camara"),
      ("18", "en"): ("content/18 Évora Economia e Dinheiro de Fora/The economy of Évora and the public money that reaches the municipality outside the council.md",
                     "evora-economia-e-dinheiro-publico-de-fora-da-camara")}
EMENDAS = [
    ("ponto1_aritmetica_e1e", "17", "pt", "essa aritmética produz a rejeição de um ano de contas",
     "esse executivo viu as contas de 2024 rejeitadas pela câmara, e os documentos não dizem porque votou assim cada membro", None),
    ("ponto2_paridades_e1e", "18", "pt", "em paridades de poder de compra.",
     "que é o valor por habitante comparado com a média da União, posta em cem, depois de descontar as diferenças de preços entre os países",
     "em paridades de poder de compra"),
    ("ponto2_paridades_e1e", "18", "en", "in purchasing-power terms.",
     "which is the value per inhabitant compared with the EU average, set at one hundred, after discounting the differences in prices between countries",
     "in purchasing-power terms"),
]


def primeira_vez(texto, chave, entra):
    """A primeira vez que a expressão aparece, a explicação vem logo a seguir, depois de uma vírgula."""
    i = texto.find(chave)
    return i >= 0 and texto[i + len(chave):].startswith(", " + entra)


def medir_emendas():
    por = {}
    for nome, est, lang, sai, entra, chave in EMENDAS:
        md, slug = MD[(est, lang)]
        a, d = corre(["git", "show", f"{CABECA_E1D_MOTOR}:{md}"], cwd=MOTOR), corre(["git", "show", f"HEAD:{md}"], cwd=MOTOR)
        doc = f"studies-src/{slug}/{lang}.html"
        da, dd = visivel(corre(["git", "show", f"{CABECA_E1D_SITIO}:{doc}"])), visivel(ler(SITIO / doc))
        e = {"sai_motor_antes": a.count(sai), "sai_motor_agora": d.count(sai), "sai_documento_antes": da.count(sai), "sai_documento_agora": dd.count(sai),
             "entra_motor": d.count(entra), "entra_documento": dd.count(entra)}
        if chave:
            e |= {"vezes_que_a_expressao_aparece_no_motor": d.count(chave), "vezes_que_a_expressao_aparece_no_documento": dd.count(chave),
                  "a_primeira_vez_traz_a_explicacao_no_motor": primeira_vez(d, chave, entra),
                  "a_primeira_vez_traz_a_explicacao_no_documento": primeira_vez(dd, chave, entra),
                  "a_primeira_vez_trazia_a_explicacao_na_e1d": primeira_vez(a, chave, entra)}
        else:
            e |= {"remete_para_o_estudo_das_contas_no_motor": "](/estudos/evora-contas-da-camara-2010-2025)" in d[d.find(entra):d.find(entra) + 400],
                  "edicoes_do_estudo_no_motor": sorted(x.split("/")[-1] for x in corre(["git", "-c", "core.quotepath=false", "ls-files", f"content/{m1.NOVOS[slug]}/"], cwd=MOTOR).splitlines()
                                                         if x.endswith(".md") and "/Technical Source/" not in x and "/" not in x[len(f"content/{m1.NOVOS[slug]}/"):])}
        por.setdefault(nome, {})[f"{est}/{lang}"] = e
    for nome, edicoes in por.items():
        certo = all(v["sai_motor_agora"] == 0 and v["sai_documento_agora"] == 0 and v["entra_motor"] == 1 and v["entra_documento"] == 1
                    and v.get("a_primeira_vez_traz_a_explicacao_no_motor", True) and v.get("a_primeira_vez_traz_a_explicacao_no_documento", True)
                    and v.get("remete_para_o_estudo_das_contas_no_motor", True) for v in edicoes.values())
        medida(nome, {"edicoes": edicoes, "certo": certo},
               "git show <cabeça>:<edição .md> no motor (na cabeça e na da E1d, 7187b82) e o texto visível do documento alojado no sítio "
               "(na árvore e na cabeça da E1d, 90640cf6), contadas a frase que sai e a que entra; no 18, se a primeira vez que a expressão "
               "aparece traz a explicação logo a seguir; no 17, a ligação ao estudo das contas e as edições que o estudo tem no motor",
               {"descricao": "a frase que sai estava no motor e no documento alojado na E1d (o mesmo detetor vê-a lá), e lá a primeira vez "
                             "não trazia a explicação",
                "mordeu": all(v["sai_motor_antes"] >= 1 and v["sai_documento_antes"] >= 1 and not v.get("a_primeira_vez_trazia_a_explicacao_na_e1d", False)
                              for v in edicoes.values())})


# ------------------------------------------------------------------ 3 · a C3
def numero(p):
    """O mesmo que o programa das células do medir-e1.py (PROG_CELULAS)."""
    s = p.replace("\u00a0", " ").replace("\u202f", " ").replace(" ", "")
    if re.fullmatch(r"\d{1,3}(\.\d{3})+(,\d+)?", s):
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    try:
        return Decimal(s)
    except Exception:
        return None


def meia_unidade(p):
    m = re.search(r",(\d+)$", p.strip())
    return Decimal(5) / (Decimal(10) ** (len(m.group(1)) + 1)) if m else Decimal("0.5")


def medir_c3():
    antes = len(m1.MEDIDAS)
    m1.medir_celulas()
    cel = next(x for x in m1.MEDIDAS[antes:] if x["nome"] == "celulas_e_linha_citada")
    # a planta da linha isolada (o total de 2017 dos grupos de funções do 17 com o valor da primeira parcela), refeita aqui
    # pela regra antiga da C3 (o guião na cabeça da E1d: um subconjunto de uma linha ou mais de toda a coluna) e pela nova
    # (duas linhas ou mais), com a mesma tolerância do arredondamento impresso
    d = MOTOR / "content" / m1.NOVOS["evora-quem-governou-a-camara-2009-2025"]
    reg = json.loads(ler(next(d.glob("*(pt-PT).record.json"))))
    tab = next(b for b in reg["blocks"] if b["kind"] == "table" and b["rows"][0][0]["text"].replace("\u200b", "").strip() == "Grupo de funções")
    ri = next(i for i, l in enumerate(tab["rows"]) if l[0]["text"].replace("\u200b", "").strip() == "Total")
    plantado = tab["rows"][1][1]["figures"][0]["printed"]
    alvo = numero(plantado)
    outros = [(numero(f["printed"]), meia_unidade(f["printed"])) for rj, l in enumerate(tab["rows"]) if rj != ri and len(l) > 1
              for f in l[1].get("figures", []) if numero(f["printed"]) is not None]
    def menor_k(minimo):
        for k in range(minimo, len(outros) + 1):
            for comb in itertools.combinations(outros, k):
                if abs(sum(n for n, _ in comb) - alvo) <= sum(m for _, m in comb) + meia_unidade(plantado):
                    return k
        return None
    onde = []
    for slug, pasta in m1.NOVOS.items():
        for rj in sorted((MOTOR / "content" / pasta).glob("*.record.json")):
            for b in json.loads(ler(rj))["blocks"]:
                if b.get("kind") != "table":
                    continue
                for i, l in enumerate(b["rows"]):
                    if l and l[0]["text"].replace("\u200b", "").strip().lower() in {"total", "total da tabela", "table total"} and any(c.get("figures") for c in l[1:]):
                        onde.append({"registo": f"{pasta}/{rj.name}", "cabeca_da_tabela": [c["text"].replace("\u200b", "").strip() for c in b["rows"][0]],
                                     "linha_do_total": i, "linhas_da_tabela": len(b["rows"]), "colunas_com_valor": sum(1 for c in l[1:] if c.get("figures"))})
    v = cel["valor"]
    medida("ponto3_c3_e1e", {"onde_estao_os_totais": onde, "figuras_nas_celulas": v["figuras_nas_celulas"], "totais_da_tabela": v["totais_da_tabela"],
                             "totais_das_linhas_que_o_precedem": v["totais_das_linhas_que_o_precedem"],
                             "totais_de_linhas_de_toda_a_coluna": v["totais_de_linhas_de_toda_a_coluna"], "falhas": v["falhas"],
                             "mordidas_por_planta": cel["conhecido_positivo"]["mordidas_por_planta"],
                             "valor_plantado_no_total": plantado, "parcelas_da_coluna": len(outros),
                             "regra_antiga_aceitava_com_um_subconjunto_de": menor_k(1),
                             "regra_nova_aceita_com_um_subconjunto_de": menor_k(2)},
           "a régua das células do medir-e1.py (medir_celulas, chamada daqui) sobre os sete registos e as quatro plantas; e a planta da linha "
           "isolada refeita sobre a tabela dos grupos de funções do 17, pela regra antiga (subconjuntos de uma linha ou mais) e pela nova (duas ou mais)",
           {"descricao": "a planta da linha isolada como total morde na C3, e a regra antiga aceitava-a com um subconjunto de uma linha",
            "mordeu": cel["conhecido_positivo"]["mordidas_por_planta"].get("linha-isolada-como-total") == ["C3"] and menor_k(1) == 1 and menor_k(2) is None})


# ------------------------------------------------------------------ 4 · a saída dos guiões
def medir_saida_dos_guioes():
    r = {}
    for g in ("e1c", "e1d"):
        r[g] = {}
        for c in ("real", "planta"):
            lg = ler(AQUI / f"prova-medir-{g}-{c}.log").strip().splitlines()[-1]
            m = re.search(r"medidas reais que falharam: (.*)$", lg)
            r[g][c] = {"codigo": codigo(f"prova-medir-{g}-{c}.codigo"), "medidas_reais_que_falharam": m.group(1) if m else None}
    medida("ponto4_saida_dos_guioes_e1e", r,
           "cada guião corrido duas vezes, com OEDP_MEDIDAS_JSON num ficheiro fora do repositório: sobre o estado real, e com OEDP_DIST numa "
           "cópia das páginas que ele lê com um campo real errado (no índice dos estudos, a frase da sobreposição da leitura do estudo da economia "
           "cortada, para o e1c; na página de Évora, a primeira frase das fichas cortada, para o e1d); o código escrito num ficheiro depois de o "
           "processo acabar",
           {"descricao": "a corrida com o campo real errado sai com 1 e nomeia a medida que falhou, e a corrida real sai com 0",
            "mordeu": all(x["planta"]["codigo"] == 1 and x["real"]["codigo"] == 0 for x in r.values())})


# ------------------------------------------------------------------ 5 · a conferência das leituras
def medir_conferencia():
    real, prova = json.loads(ler(AQUI / "conferir-leituras-e1e.json")), json.loads(ler(AQUI / "conferir-leituras-e1e-prova.json"))
    medida("ponto5_conferencia_e1e", {"corrida_real": {"codigo": codigo("conferir-leituras-e1e.codigo"), "falhas": real["falhas"],
                                                       "positivos": [p["mordeu"] for p in real["positivos"]]},
                                      "prova": {"codigo": codigo("conferir-leituras-e1e-prova.codigo"), **prova["prova"]}},
           "node e1c/conferir-leituras-e1c.mjs <motor>, e de novo com --prova (o documento português do 16 lido como inexistente; o gabarito "
           "inglês do 18 a falhar na leitura), cada código escrito num ficheiro depois de o processo acabar",
           {"descricao": "as duas plantas fazem a conferência contar uma falha cada, e a corrida real não falha",
            "mordeu": prova["prova"]["documento_alojado_em_falta"]["mordeu"] and prova["prova"]["gabarito_ilegivel"]["mordeu"]})


# ------------------------------------------------------------------ a travessia e o motor
def medir_travessia():
    rep = json.loads(ler(AQUI / "republicar-documentos-e1e.json"))
    c = re.search(r"(\d+) nova\(s\) · (\d+) alterada\(s\) · (\d+) inalterada\(s\)", ler(AQUI / "motor-travessia" / "records-site-escrever.log"))
    o = re.search(r"--with-origin: (\d+) registo\(s\) conferidos", ler(AQUI / "check-documentos-com-origem.log"))
    medida("travessia_e1e", {"documentos_realojados": len(rep["edicoes"]), "mudaram": sum(1 for e in rep["edicoes"] if e["mudou"]),
                             "commit_do_motor_dos_bytes": sorted({e["commit"][:7] for e in rep["edicoes"]}),
                             "registos": {"novos": int(c.group(1)), "alterados": int(c.group(2)), "inalterados": int(c.group(3))},
                             "check_documentos": codigo("check-documentos.codigo"), "check_documentos_com_origem": codigo("check-documentos-com-origem.codigo"),
                             "registos_conferidos_contra_o_motor": int(o.group(1))},
           "e1e/republicar-documentos-e1e.json, o registo do publisher/export_records_site.py --write e os códigos do check:documentos "
           "(com e sem --with-origin), cada um escrito num ficheiro depois de o processo acabar",
           {"descricao": "os documentos realojados são os bytes do commit das emendas no motor, 1f1fe1b",
            "mordeu": sorted({e["commit"][:7] for e in rep["edicoes"]}) == ["1f1fe1b"]})


def medir_motor():
    p, tr = AQUI / "motor", AQUI / "motor-travessia"
    cod, log = int(ler(p / "gate.codigo").strip()), ler(p / "gate.log")
    medida("motor_e1e", {"portao": {"codigo": cod, "cabeca": ler(p / "cabeca").strip(), "inicio": ler(p / "gate.inicio").strip(),
                                    "fim": ler(p / "gate.fim").strip(), "linha_final_pass": "GATE: PASS" in log},
                         "commits": {"commit_1": int(ler(tr / "commit-motor-1.codigo").strip()), "commit_2": int(ler(tr / "commit-motor-2.codigo").strip())},
                         "composicoes": {n: int(ler(tr / f"compor-escrever-{n}.codigo").strip()) for n in ("17", "18")},
                         "html": {n: int(ler(tr / f"make-html-{n}.codigo").strip()) for n in ("17", "18")},
                         "registos_do_motor": int(ler(tr / "export-records-escrever.codigo").strip()),
                         "update_do_registo_do_portao": int(ler(tr / "gate-update.codigo").strip())},
           "python3 -m core.gate na cabeça final do motor, com o código escrito em e1e/motor/gate.codigo depois de o processo acabar; "
           "e os códigos de cada passo da travessia em e1e/motor-travessia/",
           {"descricao": "o código lido do ficheiro concorda com a última linha do registo (PASS com 0)", "mordeu": (cod == 0) == ("GATE: PASS" in log)})


def medir_custo():
    primeiro = corre(["git", "log", "--reverse", "--format=%cI %h %s", f"{CABECA_E1D_MOTOR}..HEAD"], cwd=MOTOR).splitlines()[0]
    inicio = datetime.fromisoformat(primeiro.split()[0])
    agora = datetime.now(timezone.utc)
    medida("custo_e1e", {"modelo": "Claude Opus 5.5", "primeiro_commit_da_passagem": primeiro, "inicio": inicio.isoformat(),
                         "medido_em": agora.isoformat(timespec="seconds"), "segundos_de_relogio_desde_o_primeiro_commit": int((agora - inicio).total_seconds()),
                         "simbolos": json.loads(ler(AQUI / "custo-simbolos-transcrito.json"))},
           "git log --reverse --format=%cI 7187b82..HEAD no motor (o primeiro commit da passagem) até à hora da medida; os símbolos são uma "
           "transcrição, não uma medida deste guião",
           {"descricao": "o primeiro commit da passagem no motor é o das emendas, 1f1fe1b", "mordeu": primeiro.split()[1] == "1f1fe1b"})


def falhas_reais(medidas):
    v = {m["nome"]: m["valor"] for m in medidas}
    regras = {
        "ponto1_aritmetica_e1e": lambda x: not x["certo"],
        "ponto2_paridades_e1e": lambda x: not x["certo"],
        "ponto3_c3_e1e": lambda x: x["falhas"] > 0,
        "ponto4_saida_dos_guioes_e1e": lambda x: any(y["real"]["codigo"] != 0 for y in x.values()),
        "ponto5_conferencia_e1e": lambda x: x["corrida_real"]["codigo"] != 0 or x["corrida_real"]["falhas"] != 0 or x["prova"]["codigo"] != 0,
        "travessia_e1e": lambda x: x["check_documentos"] != 0 or x["check_documentos_com_origem"] != 0 or x["mudaram"] != x["documentos_realojados"],
        "motor_e1e": lambda x: x["portao"]["codigo"] != 0 or not x["portao"]["linha_final_pass"] or x["commits"]["commit_1"] != 0 or x["commits"]["commit_2"] != 0,
    }
    return sorted(n for n, regra in regras.items() if n in v and regra(v[n]))


def main():
    os.chdir(SITIO)
    print("E1e · medidas")
    for f in (medir_cabecas, medir_emendas, medir_c3, medir_saida_dos_guioes, medir_conferencia, medir_travessia, medir_motor, medir_custo):
        f()
    falhou = [x["nome"] for x in MEDIDAS if not x["conhecido_positivo"].get("mordeu")]
    reais = falhas_reais(MEDIDAS)
    alvo = PASTA / "medidas.json"
    tudo = json.loads(ler(alvo))
    tudo["e1e"] = {"bloco": "E1e", "guiao": "design/especime-v3/medicoes/e1-2026-09-30/e1e/medir-e1e.py",
                   "medido_em": datetime.now(timezone.utc).isoformat(timespec="seconds"), "conhecidos_positivos_que_nao_morderam": falhou,
                   "medidas_reais_que_falharam": reais, "medidas": MEDIDAS}
    texto = json.dumps(tudo, ensure_ascii=False, indent=1) + "\n"
    for proibido in (str(Path.home()), str(MOTOR), str(SITIO)):
        if proibido and proibido in texto:
            raise SystemExit("Um caminho da máquina ia para o medidas.json; nada escrito.")
    alvo.write_text(texto, encoding="utf-8")
    print(f"E1e · {len(MEDIDAS)} medidas; conhecidos-positivos que não morderam: {falhou or 'nenhum'}; medidas reais que falharam: {reais or 'nenhuma'}")
    return 1 if falhou or reais else 0


if __name__ == "__main__":
    sys.exit(main())
