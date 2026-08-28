#!/usr/bin/env python3
"""Extractor independente da tabela CONCELHOS do PDF da DRQPE (desemprego registado
nos Açores, dezembro de 2025). Código do zero para a medição cega M6 (bloco «As
ilhas»). Não lê `text/desemprego-registado-2025-12.txt` (a extração já feita pelo
motor) -- corre o seu próprio `pdftotext -layout`, página a página, sobre o PDF
original, para não herdar um erro de extração que a fonte partilhasse com o motor.

Uso:
    python3 extrai_acores.py <caminho-do-pdf>          # imprime JSON em stdout
    python3 extrai_acores.py <caminho-do-pdf> --selftest   # prova o extractor
"""
import json
import re
import subprocess
import sys

# As 19 formas exactas como o PDF as imprime na tabela CONCELHOS (maiúsculas,
# tal como saem do documento). A ordem não importa para a extração (procura-se
# cada uma, independentemente), mas fica pela ordem em que aparecem no PDF.
NOMES_PDF = [
    "VILA DO PORTO",
    "LAGOA",
    "NORDESTE",
    "PONTA DELGADA",
    "POVOAÇÃO",
    "RIBEIRA GRANDE",
    "VILA FRANCA DO CAMPO",
    "ANGRA DO HEROÍSMO",
    "PRAIA DA VITÓRIA",
    "SANTA CRUZ DA GRACIOSA",
    "CALHETA",
    "VELAS",
    "LAJES DO PICO",
    "MADALENA",
    "SÃO ROQUE DO PICO",
    "HORTA",
    "LAJES DAS FLORES",
    "SANTA CRUZ DAS FLORES",
    "VILA DO CORVO",
]


def pdftotext_page(pdf_path, page_num):
    """Chama pdftotext -layout para uma única página; devolve o texto dessa página."""
    out = subprocess.run(
        ["pdftotext", "-layout", "-f", str(page_num), "-l", str(page_num), pdf_path, "-"],
        capture_output=True, check=True,
    )
    return out.stdout.decode("utf-8")


def num_pt(token):
    """Converte um número no formato do documento (milhar '.', decimal ',') em int/float.
    Os valores da tabela CONCELHOS são sempre inteiros (contagem de pessoas)."""
    token = token.strip()
    if "," in token:
        # percentagem ou decimal -- mantido como float por completude, não usado no TOTAL
        return float(token.replace(".", "").replace(",", "."))
    return int(token.replace(".", ""))


def parse_concelhos_table(page_text, nomes_alvo):
    """Extrai, de uma página já isolada, as linhas da tabela CONCELHOS cujo nome
    bate com um dos `nomes_alvo`. Devolve lista de dicts e a linha TOTAL, se existir
    nesta página."""
    linhas = page_text.splitlines()
    # localizar o cabeçalho "CONCELHOS" (não "ILHAS"): só se procura a tabela a
    # partir daí, para não confundir com a tabela ILHAS que tem os mesmos 4
    # campos numéricos por linha mas nomes de ilha, não de concelho.
    start = None
    for i, l in enumerate(linhas):
        if l.strip() == "CONCELHOS":
            start = i
            break
    corpo = linhas[start:] if start is not None else linhas

    achados = []
    total_row = None
    # ordenar por comprimento decrescente para não deixar um nome curto (ex.: "CALHETA")
    # apanhar como prefixo de outro por engano -- neste conjunto não há colisão real,
    # mas a disciplina fica cá para o provar.
    for nome in sorted(nomes_alvo, key=len, reverse=True):
        for l in corpo:
            stripped = l.strip()
            if stripped.startswith(nome + " ") or stripped == nome:
                resto = stripped[len(nome):].strip()
                campos = re.split(r"\s{1,}", resto) if resto else []
                # esperado: [HOMENS, MULHERES, TOTAL, PESO%]
                if len(campos) < 4:
                    continue
                try:
                    homens = num_pt(campos[0])
                    mulheres = num_pt(campos[1])
                    total = num_pt(campos[2])
                except ValueError:
                    continue
                achados.append({
                    "nome_pdf": nome,
                    "homens": homens,
                    "mulheres": mulheres,
                    "total": total,
                    "peso": campos[3],
                    "linha_bruta": stripped,
                })
                break  # só a primeira ocorrência da linha por nome, nesta página

    for l in corpo:
        stripped = l.strip()
        if stripped.startswith("TOTAL "):
            campos = re.split(r"\s{1,}", stripped[len("TOTAL"):].strip())
            if len(campos) >= 4:
                try:
                    total_row = {
                        "homens": num_pt(campos[0]),
                        "mulheres": num_pt(campos[1]),
                        "total": num_pt(campos[2]),
                        "peso": campos[3],
                        "linha_bruta": stripped,
                    }
                except ValueError:
                    pass
            break

    return achados, total_row


def extrai(pdf_path):
    resultados = []
    total_por_pagina = {}
    for page_num in (1, 2, 3):
        texto = pdftotext_page(pdf_path, page_num)
        if "CONCELHOS" not in texto:
            continue
        achados, total_row = parse_concelhos_table(texto, NOMES_PDF)
        for a in achados:
            a["pagina"] = page_num
        resultados.extend(achados)
        if total_row:
            total_por_pagina[page_num] = total_row

    # verificação interna: cada nome dos 19 deve aparecer exactamente uma vez no total
    vistos = {}
    for a in resultados:
        vistos[a["nome_pdf"]] = vistos.get(a["nome_pdf"], 0) + 1
    duplicados = {k: v for k, v in vistos.items() if v != 1}
    em_falta = [n for n in NOMES_PDF if n not in vistos]

    # a linha TOTAL "oficial" do documento é a que aparece depois da última página
    # com linhas de concelho (página 2, neste documento) -- fica a de maior página.
    total_documento = total_por_pagina.get(max(total_por_pagina)) if total_por_pagina else None

    return {
        "fonte": pdf_path,
        "tabela": "CONCELHOS",
        "linhas": resultados,
        "total_documento": total_documento,
        "duplicados": duplicados,
        "em_falta": em_falta,
        "soma_dos_totais": sum(a["total"] for a in resultados),
        "soma_homens_mais_mulheres_bate": all(a["homens"] + a["mulheres"] == a["total"] for a in resultados),
    }


def selftest():
    """Prova o extractor num caso conhecido (vermelho) e num caso real (verde),
    antes de qualquer confiança num zero. Não requer o PDF: usa texto sintético
    E, se o caminho por omissão existir, também corre sobre o PDF real."""
    print("== autoteste extrai_acores.py ==")

    # 1) Caso sintético "vermelho": tabela com um valor deliberadamente errado
    #    (LAGOA com TOTAL=999 em vez de 302, e homens+mulheres já não bate).
    texto_mau = """
CONCELHOS
HOMENS          MULHERES           TOTAL
           VILA DO PORTO                           40               43               83             2,00%
           LAGOA                                   139              163              999            7,28%
"""
    achados, _ = parse_concelhos_table(texto_mau, ["VILA DO PORTO", "LAGOA"])
    lagoa = next(a for a in achados if a["nome_pdf"] == "LAGOA")
    assert lagoa["total"] == 999, "o extractor não leu o valor sintético alterado"
    bate = lagoa["homens"] + lagoa["mulheres"] == lagoa["total"]
    assert bate is False, "FALHA: o detector de consistência não acusou o caso vermelho sintético"
    print("  [OK] caso sintético vermelho (LAGOA=999, H+M != TOTAL): detectado como inconsistente")

    # 2) Mesmo texto, valor correcto -- deve passar
    texto_bom = texto_mau.replace("999", "302")
    achados2, _ = parse_concelhos_table(texto_bom, ["VILA DO PORTO", "LAGOA"])
    lagoa2 = next(a for a in achados2 if a["nome_pdf"] == "LAGOA")
    assert lagoa2["total"] == 302
    assert lagoa2["homens"] + lagoa2["mulheres"] == lagoa2["total"]
    print("  [OK] caso sintético corrigido (LAGOA=302, H+M == TOTAL): passa")

    # 3) Se o PDF real for indicado, corre a extração real e confirma os números
    #    já verificados à mão a partir do dump do pdftotext.
    pdf_candidates = [a for a in sys.argv[1:] if a != "--selftest"]
    pdf_path = pdf_candidates[0] if pdf_candidates else None
    if pdf_path:
        r = extrai(pdf_path)
        assert len(r["linhas"]) == 19, f"esperava 19 concelhos, achei {len(r['linhas'])}"
        assert not r["duplicados"], f"nomes duplicados: {r['duplicados']}"
        assert not r["em_falta"], f"nomes em falta: {r['em_falta']}"
        assert r["soma_homens_mais_mulheres_bate"], "há uma linha em que homens+mulheres != total"
        assert r["total_documento"]["total"] == 4146, r["total_documento"]
        assert r["soma_dos_totais"] == 4146, r["soma_dos_totais"]
        lagoa_real = next(a for a in r["linhas"] if a["nome_pdf"] == "LAGOA")
        assert lagoa_real["total"] == 302, lagoa_real
        corvo_real = next(a for a in r["linhas"] if a["nome_pdf"] == "VILA DO CORVO")
        assert corvo_real["total"] == 5, corvo_real
        assert corvo_real["pagina"] == 2, corvo_real
        assert lagoa_real["pagina"] == 1, lagoa_real
        print(f"  [OK] PDF real: 19/19 concelhos, 0 duplicados, 0 em falta, "
              f"soma={r['soma_dos_totais']}=total do documento={r['total_documento']['total']}, "
              f"LAGOA=302 (p.1), VILA DO CORVO=5 (p.2)")
    else:
        print("  [aviso] sem caminho do PDF real passado ao --selftest; só o sintético foi corrido")

    print("== autoteste: TUDO OK ==")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("uso: extrai_acores.py <pdf> [--selftest]", file=sys.stderr)
        sys.exit(2)
    if "--selftest" in sys.argv:
        selftest()
    else:
        print(json.dumps(extrai(sys.argv[1]), ensure_ascii=False, indent=2))
