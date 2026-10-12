"""Recorta e confere as origens JD1 nos corpos recebidos pelo cliente da casa.

RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/origens.py [--write | --write-site]
"""
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[3]
MOTOR = Path(os.environ["RESEARCHHUB_DIR"])
PASTA = Path("indicators/out/jd1-2026-10-06")
pedidos = [json.loads(l) for l in (MOTOR / PASTA / "pedidos.jsonl").read_text().splitlines()]
extracoes = [json.loads(l) for l in (MOTOR / PASTA / "extracoes.jsonl").read_text().splitlines()]


def sha(b):
    return hashlib.sha256(b).hexdigest()


def normal(s):
    return " ".join(s.split())


def corta(s, inicio, fim):
    a = s.index(inicio)
    return s[a:s.index(fim, a) + len(fim)]


def origem(nome, publicador, documento, *, page=None, anchors=None, clip=False):
    r = next(r for r in pedidos if r["nome"] == nome and r["estado"] == "lido")
    corpo = (MOTOR / PASTA / r["file"]).read_bytes()
    assert r["http"] == 200 and r["sha256"] == sha(corpo) and r["bytes"] == len(corpo)
    alojado = MOTOR / "content/20 Orcamento do Estado/source/jd1" / nome
    assert alojado.read_bytes() == corpo
    assert r["cliente"].endswith("core.http.HttpClient.condicional")
    selo = dict(motor=(PASTA / r["file"]).as_posix(), hora=r["timestamp_utc"], cliente="core.http.HttpClient.condicional", sha256=r["sha256"])
    if page:
        if clip:
            file = Path(r["file"]).with_suffix("").name + ("-coluna-portuguesa.txt" if clip is True else f"-coluna-esquerda-{page}-w{clip}.txt")
            args = ["pdftotext", "-f", str(page), "-l", str(page), "-r", "72", "-x", "0", "-y", "0", "-W", str(275 if clip is True else clip), "-H", "900", "-layout"]
            raw = subprocess.check_output(args + [str(MOTOR / PASTA / r["file"]), "-"])
            target = MOTOR / PASTA / file
            if "--write" in sys.argv:
                target.write_bytes(raw)
                e = dict(origem=r["file"], origem_sha256=r["sha256"], file=file, ferramenta=extracoes[0]["ferramenta"],
                         comando=" ".join(args), sha256=sha(raw))
                if not any(x["file"] == file for x in extracoes):
                    with (MOTOR / PASTA / "extracoes.jsonl").open("a") as f:
                        f.write(json.dumps(e, ensure_ascii=False) + "\n")
                    extracoes.append(e)
            assert target.read_bytes() == raw
            texto = raw.decode()
        else:
            file = Path(r["file"]).with_suffix(".txt").name
            raw = (MOTOR / PASTA / file).read_bytes()
            texto = raw.decode().split("\f")[page - 1]
        e = next(x for x in extracoes if x["file"] == file)
        assert sha(raw) == e["sha256"] and e["origem_sha256"] == r["sha256"]
        selo.update(campo=f"pdftotext -layout, folha {page}" + (", coluna portuguesa" if clip is True else ", coluna esquerda" if clip else ""),
                    extracao=dict(ficheiro=(PASTA / file).as_posix(), sha256=e["sha256"], ferramenta=e["ferramenta"]))
    else:
        texto = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", corpo.decode(), flags=re.S | re.I)
        texto = html.unescape(re.sub(r"<[^>]+>", " ", texto))
        selo["campo"] = "corpo JSON, dimensões selecionadas" if nome.endswith(".json") else "texto normalizado da ficha de metadados"
    texto = normal(texto)
    if anchors:
        texto = corta(texto, *anchors)
    return dict(publicador=publicador, documento=documento, url=r["url"], lido=r["timestamp_utc"][:10],
                lingua="en" if not page else "pt", excerto=texto, selo=selo)


def nova(nome, publicador, documento, lingua, inicio, fim):
    pasta = Path("indicators/out/jd1b-2026-10-07")
    recibos = [json.loads(l) for l in (MOTOR / pasta / "pedidos.jsonl").read_text().splitlines()]
    r = next(r for r in recibos if r["nome"] == nome and r["estado"] == "lido")
    corpo = (MOTOR / pasta / r["file"]).read_bytes()
    assert sha(corpo) == r["sha256"] and len(corpo) == r["bytes"] and r["http"] == 200
    assert (MOTOR / "content/20 Orcamento do Estado/source/jd1b" / nome).read_bytes() == corpo
    es = [json.loads(l) for l in (MOTOR / pasta / "extracoes.jsonl").read_text().splitlines()]
    e = next(e for e in es if e["origem"] == r["file"])
    raw = (MOTOR / pasta / e["file"]).read_bytes()
    assert sha(raw) == e["sha256"] and e["origem_sha256"] == r["sha256"]
    return dict(publicador=publicador, documento=documento, url=r["url"], lido=r["timestamp_utc"][:10], lingua=lingua,
        excerto=corta(normal(raw.decode()), inicio, fim), selo=dict(motor=(pasta/r["file"]).as_posix(), hora=r["timestamp_utc"],
        cliente="core.http.HttpClient.condicional", sha256=r["sha256"], campo="texto da entrada nomeada, extraído por HTMLParser",
        extracao=dict(ficheiro=(pasta/e["file"]).as_posix(), sha256=e["sha256"], ferramenta=e["ferramenta"])))


origens = {
    "jd1-igcp-valoracao": origem("igcp-boletim-setembro-2026.pdf", "IGCP", "Boletim Mensal, setembro de 2026, nota 1, folha 5", page=5, clip=True,
        anchors=("Os saldos em dívida", "ao valor de encaixe.")),
    "jd1-eo-ativos": origem("eo-execucao-agosto-2026.pdf", "Entidade Orçamental", "Síntese da Execução Orçamental | agosto 2026, glossário, folha 82", page=82, clip=300,
        anchors=("Ativos financeiros (receita)", "determinado momento.")),
    "jd1-eo-saldo": origem("eo-execucao-agosto-2026.pdf", "Entidade Orçamental", "Síntese da Execução Orçamental | agosto 2026, glossário, folha 87", page=87, clip=300,
        anchors=("Saldo Global", "endividamento (excedente).")),
    "jd1-eurostat-unidade": origem("eurostat-metadados-obrigacoes.html", "Eurostat", "EMU convergence criterion series, Reference Metadata, secção 4",
        anchors=("All the yields are expressed", "percentages per annum.")),
    "jd1-eurostat-versao": origem("eurostat-juros-EU27_2020-PC_GDP-2025.json", "Eurostat", "Government revenue, expenditure and main aggregates, updated e value",
        anchors=('"updated":', '"value":{"0":1.9}')),
    "jd1-ine-contas": origem("ine-pde-setembro-2026.pdf", "Instituto Nacional de Estatística", "Procedimento dos Défices Excessivos 2ª Notificação, setembro de 2026, folha 4", page=4,
        anchors=("No apuramento do saldo orçamental", "incluídas no saldo em contabilidade pública.")),
    "jd1-eo-glossario": origem("eo-execucao-agosto-2026.pdf", "Entidade Orçamental", "Síntese da Execução Orçamental | agosto 2026, glossário, folha 83", page=83, clip=300,
        anchors=("Contabilidade Pública (ótica da)", "no âmbito do programa Saúde.")),
    "jd1-igcp-contabilidade": origem("igcp-relatorio-anual-2025.pdf", "IGCP", "Relatório Anual 2025, quadro 19, folha 53", page=53,
        anchors=("Quadro 19", "(Contabilidade Pública)")),
    "jd1-igcp-perimetro": origem("igcp-relatorio-anual-2025.pdf", "IGCP", "Relatório Anual 2025, nota 1, folha 31", page=31,
        anchors=("1A dívida direta do Estado", "passivos emitidos pelas próprias Administrações Públicas.")),
    "jd1-igcp-siglas": origem("igcp-relatorio-anual-2025.pdf", "IGCP", "Relatório Anual 2025, siglas e abreviaturas, folha 5", page=5),
    "jd1-eurostat-contas": origem("eurostat-juros-EU27_2020-PC_GDP-2025.json", "Eurostat", "Government revenue, expenditure and main aggregates, dimension.unit a dimension.geo",
        anchors=('"unit":{"label"', 'European Union - 27 countries (from 2020)"}}}')),
    "jd1-pib-definicao": nova("eurostat-pib-iniciantes.html", "Eurostat", "Gross domestic product, What is gross domestic product? e What does GDP cover?", "en",
        "What is gross domestic product?", "GDP covers all goods and services produced for final use ."),
    "jd1-divida-fundada": nova("igcp-glossario.html", "IGCP", "Glossário, Dívida pública fundada", "pt",
        "Dívida pública fundada", "exercício em que foi gerada."),
    "jd1-mercado-secundario": nova("igcp-glossario.html", "IGCP", "Glossário, Mercado Secundário", "pt",
        "Mercado Secundário", "previamente colocados em mercado primário."),
    "jd1-ine-provisorio": origem("ine-pde-setembro-2026.pdf", "Instituto Nacional de Estatística", "Procedimento dos Défices Excessivos 2ª Notificação, setembro de 2026, folha 3", page=3,
        anchors=("Os dados de 2024", "provisórios4.")),
    "jd1-ine-ambito": origem("ine-pde-setembro-2026.pdf", "Instituto Nacional de Estatística", "Procedimento dos Défices Excessivos 2ª Notificação, setembro de 2026, folha 2", page=2),
    "jd1-ine-despesa": origem("ine-pde-setembro-2026.pdf", "Instituto Nacional de Estatística", "Procedimento dos Défices Excessivos 2ª Notificação, setembro de 2026, quadro 9, folha 12", page=12),
    "jd1-eo-conta": origem("eo-execucao-agosto-2026.pdf", "Entidade Orçamental", "Síntese da Execução Orçamental | agosto 2026, folha 7, página impressa 3", page=7),
    "jd1-eo-caixa": origem("eo-execucao-agosto-2026.pdf", "Entidade Orçamental", "Síntese da Execução Orçamental | agosto 2026, folha 44, página impressa 40", page=44,
                           anchors=("A informação apresentada na Síntese", "correspondente pagamento ou recebimento.")),
    "jd1-igcp-custo": origem("igcp-boletim-setembro-2026.pdf", "IGCP", "Boletim Mensal, setembro de 2026, nota 6, folha 5", page=5, clip=True,
                             anchors=("6. Custo da dívida emitida", "final dos anos t e t-1.")),
    "jd1-igcp-divida": origem("igcp-boletim-setembro-2026.pdf", "IGCP", "Boletim Mensal, setembro de 2026, folha 2", page=2),
    "jd1-igcp-financiamento": origem("igcp-relatorio-anual-2025.pdf", "IGCP", "Gestão da Tesouraria do Estado e da Dívida Pública, Relatório Anual 2025, quadro 9, folha 45", page=45),
    "jd1-eurostat-obrigacoes": origem("eurostat-metadados-obrigacoes.html", "Eurostat", "EMU convergence criterion series, Reference Metadata, secção 3.4",
                                     anchors=("The Maastricht Treaty EMU convergence criterion series relates", "to avoid any maturity drift.")),
}
body = "/** Gerado por design/especime-v3/medicoes/jd1-2026-10-06/origens.py. */\nexport const ORIGENS_JD1 = " + json.dumps(origens, ensure_ascii=False, indent=2) + ";\n"
target = SITE / "src/data/origens-jd1.mjs"
if {"--write", "--write-site"} & set(sys.argv):
    target.write_text(body)
else:
    assert target.read_text() == body, "JD1: as origens divergem dos corpos selados"
(AQUI / "origens-provadas.json").write_text(json.dumps([dict(origem=k, sha256=o["selo"]["sha256"], literal=True, pedido=True, alojamento=True) for k, o in origens.items()], ensure_ascii=False, indent=2) + "\n")
print(f"JD1: {len(origens)} origens relidas nos corpos, recibos e extrações.")
