#!/usr/bin/env python3
"""Extractor independente do QUADRO III (desemprego registado por concelhos) do
boletim do IEM (Instituto de Emprego da Madeira), Boletim Mensal por Concelhos,
dezembro de 2025. Código do zero para a medição cega M6 (bloco «As ilhas»). Não lê
`text/boletim-concelhos-2025-12.txt` -- corre o seu próprio `pdftotext -layout`.

Armadilha do documento, encontrada na exploração e tratada aqui: o QUADRO III lista
CONCELHOS *e* FREGUESIAS na mesma tabela, e várias freguesias-sede têm o MESMO nome
do seu concelho (ex.: a freguesia "Calheta" dentro do concelho "Calheta"). A única
diferença estrutural fiável é que a linha do CONCELHO tem 12 campos numéricos
(inclui uma "Taxa de desemprego" final) e a da FREGUESIA só tem 11 (pára na
"% do concelho"). O extractor usa essa contagem de campos para desambiguar, nunca
a posição na leitura nem a ordem de aparição.

Uso:
    python3 extrai_madeira.py <caminho-do-pdf>          # imprime JSON em stdout
    python3 extrai_madeira.py <caminho-do-pdf> --selftest
"""
import json
import re
import subprocess
import sys

NOMES_CONCELHO = [
    "CALHETA",
    "CÂMARA DE LOBOS",
    "FUNCHAL",
    "MACHICO",
    "PONTA DO SOL",
    "PORTO MONIZ",
    "RIBEIRA BRAVA",
    "SANTA CRUZ",
    "SANTANA",
    "SÃO VICENTE",
    "PORTO SANTO",
]

NOME_REGIAO = "TOTAL DA REGIÃO AUTÓNOMA DA MADEIRA"


def pdftotext_page(pdf_path, page_num):
    out = subprocess.run(
        ["pdftotext", "-layout", "-f", str(page_num), "-l", str(page_num), pdf_path, "-"],
        capture_output=True, check=True,
    )
    return out.stdout.decode("utf-8")


def pdftotext_all(pdf_path):
    out = subprocess.run(
        ["pdftotext", "-layout", pdf_path, "-"],
        capture_output=True, check=True,
    )
    return out.stdout.decode("utf-8")


def num_pt_espaco(token):
    """Números do IEM: milhar por espaço (normal ou fino), decimal por vírgula.
    '-' e '.' são os sinais convencionais do documento (valor nulo / não significativo)."""
    token = token.strip()
    if token in ("-", "."):
        return None
    token = token.replace(" ", " ").replace("\xa0", " ")
    if "," in token:
        return float(token.replace(" ", "").replace(",", "."))
    return int(token.replace(" ", ""))


def find_quadro_iii_span(full_text):
    """Isola o texto entre o cabeçalho do QUADRO III e o do QUADRO IV (ou fim do
    texto, se o IV não existir). Devolve o número da página onde o QUADRO III
    começa (contando \\f do pdftotext) e o texto do intervalo."""
    marca_iii = re.search(r"QUADRO III\b", full_text)
    if not marca_iii:
        raise RuntimeError("QUADRO III não encontrado no documento")
    marca_iv = re.search(r"QUADRO IV\b", full_text[marca_iii.end():])
    fim = marca_iii.end() + marca_iv.start() if marca_iv else len(full_text)
    intervalo = full_text[marca_iii.start():fim]
    pagina = full_text[:marca_iii.start()].count("\x0c") + 1
    return pagina, intervalo


def parse_quadro_iii(intervalo_texto):
    linhas = intervalo_texto.splitlines()
    achados = []
    total_regiao = None
    for l in linhas:
        stripped = l.strip()
        if not stripped:
            continue
        alvo = None
        if stripped.startswith(NOME_REGIAO):
            alvo = NOME_REGIAO
        else:
            for nome in sorted(NOMES_CONCELHO, key=len, reverse=True):
                if stripped.startswith(nome + " ") or stripped.startswith(nome + "\t"):
                    alvo = nome
                    break
        if alvo is None:
            continue
        resto = stripped[len(alvo):].strip()
        campos = re.split(r"\s{2,}", resto)
        # a linha de CONCELHO/REGIÃO tem 12 campos numéricos (o último é a taxa de
        # desemprego, só publicada a este nível); a de FREGUESIA tem 11 e é
        # ignorada aqui -- é exactamente essa diferença de contagem que desfaz a
        # ambiguidade de nomes repetidos (freguesia-sede == nome do concelho).
        if len(campos) != 12:
            continue
        try:
            valores = [num_pt_espaco(c) for c in campos]
        except ValueError:
            continue
        homens, mulheres = valores[0], valores[1]
        total = valores[9]
        registo = {
            "nome_pdf": alvo,
            "homens": homens,
            "mulheres": mulheres,
            "total": total,
            "pct_distribuicao": campos[10],
            "taxa_desemprego": campos[11],
            "linha_bruta": stripped,
        }
        if alvo == NOME_REGIAO:
            total_regiao = registo
        else:
            achados.append(registo)
    return achados, total_regiao


def extrai(pdf_path):
    full_text = pdftotext_all(pdf_path)
    pagina, intervalo = find_quadro_iii_span(full_text)
    achados, total_regiao = parse_quadro_iii(intervalo)
    for a in achados:
        a["pagina"] = pagina

    vistos = {}
    for a in achados:
        vistos[a["nome_pdf"]] = vistos.get(a["nome_pdf"], 0) + 1
    duplicados = {k: v for k, v in vistos.items() if v != 1}
    em_falta = [n for n in NOMES_CONCELHO if n not in vistos]

    return {
        "fonte": pdf_path,
        "tabela": "QUADRO III",
        "pagina": pagina,
        "linhas": achados,
        "total_regiao": total_regiao,
        "duplicados": duplicados,
        "em_falta": em_falta,
        "soma_dos_totais": sum(a["total"] for a in achados),
        "soma_homens_mais_mulheres_bate": all(a["homens"] + a["mulheres"] == a["total"] for a in achados),
    }


def selftest():
    print("== autoteste extrai_madeira.py ==")

    # 1) Caso sintético vermelho: bloco de QUADRO III com CALHETA errado (300 em
    #    vez de 261) e uma freguesia-sede homónima a seguir, para provar que a
    #    contagem de campos evita apanhar a linha errada.
    bloco_mau = """
QUADRO III - DESEMPREGO REGISTADO POR CONCELHOS/FREGUESIAS SEGUNDO O GÉNERO, GRUPO ETÁRIO E TEMPO DE INSCRIÇÃO

TOTAL DA REGIÃO AUTÓNOMA DA MADEIRA                   2 612      3 126   791      1 237     2 038      1 672        3 572      2 166      1 266         5 738    -         100,0

CALHETA                                                117        144     39         46          82       94          151        110         74           300    100,0       4,5
ARCO DA CALHETA                                         31         29      6         15          16       23           31         29         16            60     23,0
CALHETA                                                 38         47      9         18          33       25           52         33         21            85     32,6

QUADRO IV - outra coisa qualquer
"""
    achados, total_regiao = parse_quadro_iii(bloco_mau)
    calheta = next(a for a in achados if a["nome_pdf"] == "CALHETA")
    assert calheta["total"] == 300, "não leu o valor sintético alterado"
    assert calheta["homens"] + calheta["mulheres"] != calheta["total"], \
        "FALHA: devia detectar H+M != TOTAL no caso vermelho sintético"
    assert len(achados) == 1, f"a freguesia-sede homónima devia ter sido ignorada, achou {len(achados)} linhas CALHETA"
    print("  [OK] caso sintético vermelho (CALHETA=300, H+M != TOTAL) detectado; "
          "a freguesia-sede homónima (11 campos) não confundiu o concelho (12 campos)")

    # 2) Mesmo bloco, valor corrigido
    bloco_bom = bloco_mau.replace("74           300    100,0       4,5", "74           261    100,0       4,5")
    achados2, total_regiao2 = parse_quadro_iii(bloco_bom)
    calheta2 = next(a for a in achados2 if a["nome_pdf"] == "CALHETA")
    assert calheta2["total"] == 261
    assert calheta2["homens"] + calheta2["mulheres"] == calheta2["total"]
    assert total_regiao2["total"] == 5738
    print("  [OK] caso sintético corrigido (CALHETA=261, H+M == TOTAL) passa")

    # 3) PDF real
    pdf_candidates = [a for a in sys.argv[1:] if a != "--selftest"]
    pdf_path = pdf_candidates[0] if pdf_candidates else None
    if pdf_path:
        r = extrai(pdf_path)
        assert len(r["linhas"]) == 11, f"esperava 11 concelhos, achei {len(r['linhas'])}: {[a['nome_pdf'] for a in r['linhas']]}"
        assert not r["duplicados"], f"nomes duplicados: {r['duplicados']}"
        assert not r["em_falta"], f"nomes em falta: {r['em_falta']}"
        assert r["soma_homens_mais_mulheres_bate"], "há uma linha em que homens+mulheres != total"
        assert r["pagina"] == 3, f"QUADRO III devia estar na p.3, achei p.{r['pagina']}"
        assert r["total_regiao"]["total"] == 5738, r["total_regiao"]
        assert r["soma_dos_totais"] == 5738, r["soma_dos_totais"]
        calheta_real = next(a for a in r["linhas"] if a["nome_pdf"] == "CALHETA")
        assert calheta_real["total"] == 261, calheta_real
        funchal_real = next(a for a in r["linhas"] if a["nome_pdf"] == "FUNCHAL")
        assert funchal_real["total"] == 2242, funchal_real
        print(f"  [OK] PDF real: 11/11 concelhos, 0 duplicados, 0 em falta, tudo na p.3, "
              f"soma={r['soma_dos_totais']}=total da região={r['total_regiao']['total']}, "
              f"CALHETA=261, FUNCHAL=2242")
    else:
        print("  [aviso] sem caminho do PDF real passado ao --selftest; só o sintético foi corrido")

    print("== autoteste: TUDO OK ==")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("uso: extrai_madeira.py <pdf> [--selftest]", file=sys.stderr)
        sys.exit(2)
    if "--selftest" in sys.argv:
        selftest()
    else:
        print(json.dumps(extrai(sys.argv[1]), ensure_ascii=False, indent=2))
