#!/usr/bin/env python3
"""
concelhos-M5-sonnet · extrai_fontes.py

Medidor cego (Claude Sonnet), bloco M5. Lê os ficheiros da fonte ALOJADOS
(~/Instruments/ResearchHub/content/12 Concelhos/source/, só leitura) com
código escrito de raiz — sem ver o código do motor — e escreve um JSON
consolidado para o script Node (concelhos-M5-sonnet.mjs) usar como "verdade
de origem" na comparação de três colunas (fonte / linha / página).

Não lê nada em publisher/, nem notas de construtores. Só os ficheiros em
source/ind, source/dgal, source/iefp indicados pela tabela-resumo de
design/especime-v3/medicoes/fontes-308-2026-08-26.md.

Uso:
    python3 extrai_fontes.py --out <ficheiro.json> [--selftest]

--selftest imprime os valores conhecidos (Évora / Lisboa / Bragança) lidos
pelo próprio código, para prova antes de confiar num zero.
"""

import argparse
import json
import re
import sys
from pathlib import Path

import pdfplumber

SRC = Path.home() / "Instruments" / "ResearchHub" / "content" / "12 Concelhos" / "source"

# ---------------------------------------------------------------------------
# 1 · INE — população, poder de compra, empresas (JSON da API pindica.jsp)
# ---------------------------------------------------------------------------

def ler_ine_populacao():
    """Indicador 0012917, S7A2025. Filtro dim_3='T' e dim_4='T' (Total/Total)."""
    p = SRC / "ine" / "0012917_S7A2025.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    recs = d[0]["Dados"]["2025"]
    out = {}
    for r in recs:
        if r.get("dim_3") == "T" and r.get("dim_4") == "T":
            out[r["geocod"]] = {
                "geodsg": r["geodsg"],
                "ind_string": r["ind_string"],
                "valor": r["valor"],
            }
    return out, str(p)


def ler_ine_poder_de_compra():
    """Indicador 0014580, S7A2023. Um valor por geocod, sem dim_3/dim_4."""
    p = SRC / "ine" / "0014580_S7A2023.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    recs = d[0]["Dados"]["2023"]
    out = {}
    for r in recs:
        out[r["geocod"]] = {
            "geodsg": r["geodsg"],
            "ind_string": r["ind_string"],
            "valor": r["valor"],
        }
    return out, str(p)


def ler_ine_empresas():
    """Indicador 0014061, S7A2024. Filtro dim_3='T' (Total, sem dim_4)."""
    p = SRC / "ine" / "0014061_S7A2024.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    recs = d[0]["Dados"]["2024"]
    out = {}
    for r in recs:
        if r.get("dim_3") == "T":
            out[r["geocod"]] = {
                "geodsg": r["geodsg"],
                "ind_string": r["ind_string"],
                "valor": r["valor"],
            }
    return out, str(p)


# ---------------------------------------------------------------------------
# 2 · DGAL — dívida total / limite (endividamento-total-2024.pdf, um só PDF
#     com as duas colunas), e o PDF autónomo do limite para confirmação.
# ---------------------------------------------------------------------------

def _num_pt(s):
    """'55 559 123' -> 55559123 ; 'N.d.' -> None ; '0' -> 0."""
    if s is None:
        return None
    s = s.strip()
    if s in ("", "N.d.", "N.d", "-"):
        return None
    s = s.replace("\xa0", " ")
    s = re.sub(r"\s+", "", s)
    s = s.replace(".", "").replace(",", ".")
    try:
        if "." in s:
            return float(s)
        return int(s)
    except ValueError:
        return None


def ler_dgal_endividamento():
    """
    Devolve (por_municipio, total_row) do PDF único
    'Evolução do endividamento total, por município — prestação de contas 2024'.
    Colunas: Município, (1) Limite 2024, (2) Dívida total (inclui...),
    (3) Dívidas não orçamentais, (4) Contribuição FAM, (5)=(2)-(3)-(4).

    NOTA (achado do próprio código, não do motor): pdfplumber.extract_table()
    apanha as colunas (1)-(4) mas DEIXA CAIR a (5) nas linhas de dados (fica
    None) — só a linha TOTAL a mostra. Confirmado com Abrantes: (5) tinha de
    ser 2 540 996 (o valor da linha do livro-razão) e extract_table devolvia
    None. Por isso este extrator usa pdftotext -layout com partição por 2+
    espaços (o mesmo método, já provado, do PDF do limite autónomo), que
    devolve as 5 colunas certas, incluindo (5) tal como impresso (que nalguns
    concelhos não bate ao dígito com (2)-(3)-(4) por arredondamento da
    própria DGAL — ex. Bragança: 5 173 710 − 2 481 244 = 2 692 466 pela
    aritmética, mas o PDF imprime 2 692 465; usa-se sempre o valor impresso).
    """
    import subprocess

    p = SRC / "dgal" / "endividamento-total-2024.pdf"
    txt = subprocess.run(
        ["pdftotext", "-layout", str(p), "-"], capture_output=True, text=True, check=True
    ).stdout
    por_mun = {}
    total_row = None
    numtail_re = re.compile(r"^(N\.d\.|[\d][\d .,]*)$")
    for line in txt.splitlines():
        blocks = [b for b in re.split(r" {2,}", line.strip()) if b.strip()]
        if len(blocks) < 6:
            continue
        tail = blocks[-5:]
        if not all(numtail_re.match(t) for t in tail):
            continue
        head = blocks[:-5]
        vals = {
            "limite": _num_pt(tail[0]),
            "divida_total": _num_pt(tail[1]),
            "divida_nao_orcamental": _num_pt(tail[2]),
            "contrib_fam": _num_pt(tail[3]),
            "divida_total_excl": _num_pt(tail[4]),
        }
        if len(head) == 1 and head[0].upper().startswith("TOTAL"):
            total_row = {"label": head[0], **vals}
            continue
        if len(head) < 2:
            continue
        nome = head[-1].strip()
        if not nome or nome in ("Município",):
            continue
        por_mun[nome] = vals
    return por_mun, total_row, str(p)


def ler_dgal_limite_autonomo():
    """
    PDF autónomo 'Limite da dívida total para 2024...'. Layout sem grelha
    visível — extract_table falha (confirmado por teste); usa-se
    pdftotext -layout com análise de colunas fixas, só para confirmação
    pontual (não é a fonte primária: essa é a coluna (1) do PDF acima).
    Devolve um dicionário nome -> limite (col. 6, 'Limite (2024)').
    """
    import subprocess

    p = SRC / "dgal" / "limite-divida-total-2024.pdf"
    txt = subprocess.run(
        ["pdftotext", "-layout", str(p), "-"], capture_output=True, text=True, check=True
    ).stdout
    out = {}
    # Sem backtracking: parte cada linha em blocos por 2+ espaços (o layout
    # fixo do pdftotext -layout garante essa separação), sem regex gulosa.
    codigo_re = re.compile(r"^[A-ZÇÃÕÁÉÍÓÚÂÊÔ]{2,3}$")
    numtail_re = re.compile(r"^[\d][\d .,]*\s*a?\)?$")
    for line in txt.splitlines():
        blocks = [b for b in re.split(r" {2,}", line.strip()) if b.strip()]
        if len(blocks) < 8:
            continue
        # os últimos 6 blocos têm de parecer numéricos (ou N.d.)
        tail = blocks[-6:]
        if not all(numtail_re.match(t) or t == "N.d." for t in tail):
            continue
        head = blocks[:-6]
        # 'head' é [Distrito, D/RA, Município] ou variações com o distrito
        # partido em mais do que um bloco; localiza o código de 2 letras.
        codigo_idx = None
        for i, t in enumerate(head):
            if codigo_re.match(t.strip()):
                codigo_idx = i
        if codigo_idx is None or codigo_idx + 1 >= len(head):
            continue
        municipio = " ".join(head[codigo_idx + 1 :]).strip()
        ultimo = re.sub(r"\s*a\)\s*$", "", tail[-1]).strip()
        limite = _num_pt(ultimo)
        if municipio:
            out[municipio] = limite
    return out, str(p)


def ler_dgal_pmp():
    """
    'Lista do prazo médio de pagamento registado por município em dezembro
    de 2025'. Ordenado por PMP decrescente (não alfabético). Colunas:
    31/12/2024, 31/03/2025, 30/06/2025, 30/09/2025, 31/12/2025.
    """
    p = SRC / "dgal" / "pmp-anual-2025-12.pdf"
    por_mun = {}
    media_row = None
    with pdfplumber.open(p) as pdf:
        for page in pdf.pages:
            tbl = page.extract_table()
            if not tbl:
                continue
            for row in tbl:
                if not row or len(row) < 6:
                    continue
                nome = row[0]
                if not nome:
                    continue
                nome = str(nome).strip()
                if nome in ("MUNICÍPIO", "Ordenado por ordem decrescente") or nome.startswith(
                    "Ordenado"
                ):
                    continue
                if nome.upper() == "PMP MÉDIO":
                    media_row = {
                        "d2024_12": _num_pt(row[1]),
                        "d2025_03": _num_pt(row[2]),
                        "d2025_06": _num_pt(row[3]),
                        "d2025_09": _num_pt(row[4]),
                        "d2025_12": _num_pt(row[5]),
                    }
                    continue
                # rodapé (Fonte:/Notas:) apanhado por acidente por ter 6
                # colunas na tabela extraída — um nome de município nunca
                # leva ':' nem é só minúsculas depois da primeira letra de
                # cada palavra.
                if ":" in nome or len(nome) > 40:
                    continue
                por_mun[nome] = {
                    "d2024_12": _num_pt(row[1]),
                    "d2025_03": _num_pt(row[2]),
                    "d2025_06": _num_pt(row[3]),
                    "d2025_09": _num_pt(row[4]),
                    "d2025_12": _num_pt(row[5]),
                }
    return por_mun, media_row, str(p)


# ---------------------------------------------------------------------------
# 3 · IEFP — desemprego registado por concelho (ODS, folha Quadro_I)
# ---------------------------------------------------------------------------

def ler_iefp_desemprego(periodo="2025-12"):
    """
    periodo: '2025-12' ou '2024-12' — escolhe o ficheiro ODS hospedado
    correspondente. Total = Homens + Mulheres (confirmado contra a coluna
    'Total' explícita nas linhas normais; usado também na linha
    'Continente', onde a coluna Total surge deslocada por células fundidas).
    """
    import pandas as pd

    fname = f"desemprego-concelhos-{periodo}.ods"
    p = SRC / "iefp" / fname
    df = pd.read_excel(p, engine="odf", sheet_name="Quadro_I", header=None)
    por_mun = {}
    continente_total = None
    algarve_subtotal = None
    for i in range(len(df)):
        col2 = df.iloc[i, 2]
        col3 = df.iloc[i, 3]
        col4 = df.iloc[i, 4]
        homens = df.iloc[i, 5]
        mulheres = df.iloc[i, 6]
        col12 = df.iloc[i, 12]

        def isnum(x):
            try:
                return not (x is None or (isinstance(x, float) and x != x))
            except Exception:
                return False

        if isinstance(col2, str) and "ontinente" in col2:
            if isnum(homens) and isnum(mulheres):
                continente_total = int(homens) + int(mulheres)
            continue
        if isinstance(col3, str) and col3.strip() == "Total" and isinstance(col4, str):
            # linha de subtotal distrital, ex: col3='Total', col4='Algarve'
            if isnum(homens) and isnum(mulheres):
                if "algarve" in col4.lower():
                    algarve_subtotal = int(homens) + int(mulheres)
            continue
        if isinstance(col4, str) and col4.strip() and isnum(homens) and isnum(mulheres):
            nome = col4.strip()
            total_declarado = int(col12) if isnum(col12) else None
            total_calc = int(homens) + int(mulheres)
            por_mun[nome] = {
                "homens": int(homens),
                "mulheres": int(mulheres),
                "total_calc": total_calc,
                "total_coluna": total_declarado,
            }
    return por_mun, continente_total, algarve_subtotal, str(p)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args()

    populacao, populacao_src = ler_ine_populacao()
    poder_compra, poder_compra_src = ler_ine_poder_de_compra()
    empresas, empresas_src = ler_ine_empresas()
    divida, divida_total_row, divida_src = ler_dgal_endividamento()
    limite_autonomo, limite_autonomo_src = ler_dgal_limite_autonomo()
    pmp, pmp_media, pmp_src = ler_dgal_pmp()
    desemprego_2025_12, continente_2025_12, algarve_2025_12, iefp_src_2025 = ler_iefp_desemprego(
        "2025-12"
    )
    desemprego_2024_12, continente_2024_12, algarve_2024_12, iefp_src_2024 = ler_iefp_desemprego(
        "2024-12"
    )

    out = {
        "populacao": {"por_geocod": populacao, "fonte": populacao_src},
        "poder_de_compra": {"por_geocod": poder_compra, "fonte": poder_compra_src},
        "empresas": {"por_geocod": empresas, "fonte": empresas_src},
        "divida": {
            "por_municipio": divida,
            "total_row": divida_total_row,
            "fonte": divida_src,
        },
        "limite_autonomo": {"por_municipio": limite_autonomo, "fonte": limite_autonomo_src},
        "pmp": {"por_municipio": pmp, "media_row": pmp_media, "fonte": pmp_src},
        "desemprego_2025_12": {
            "por_municipio": desemprego_2025_12,
            "continente_total": continente_2025_12,
            "algarve_subtotal": algarve_2025_12,
            "fonte": iefp_src_2025,
        },
        "desemprego_2024_12": {
            "por_municipio": desemprego_2024_12,
            "continente_total": continente_2024_12,
            "algarve_subtotal": algarve_2024_12,
            "fonte": iefp_src_2024,
        },
    }

    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"escrito: {args.out}", file=sys.stderr)

    if args.selftest:
        print("=== AUTOTESTE extrai_fontes.py (valores conhecidos) ===", file=sys.stderr)
        # geocods conhecidos: Évora 1C40705, Lisboa 110600-ish?, Bragança ?
        # (obtidos das próprias linhas do livro-razão amostradas depois;
        # aqui confirmamos só por nome, que é a chave DGAL/IEFP/PMP.)
        for nome_ine, geocod in [("Évora", "1C40705")]:
            print(
                f"  populacao[{geocod}] = {populacao.get(geocod)}  (esperado ind_string relacionado a Évora)",
                file=sys.stderr,
            )
        for nome in ["ABRANTES", "BRAGANÇA", "LISBOA"]:
            print(f"  divida[{nome}] = {divida.get(nome)}", file=sys.stderr)
        print(f"  divida TOTAL row = {divida_total_row}", file=sys.stderr)
        for nome in ["BRAGANÇA", "LISBOA", "ÉVORA", "PENEDONO"]:
            print(f"  pmp[{nome}] = {pmp.get(nome)}", file=sys.stderr)
        print(f"  pmp média row = {pmp_media}", file=sys.stderr)
        for nome in ["BRAGANÇA", "LISBOA", "ÉVORA"]:
            print(f"  desemprego 2025-12[{nome}] = {desemprego_2025_12.get(nome)}", file=sys.stderr)
        print(f"  desemprego 2025-12 continente = {continente_2025_12}", file=sys.stderr)
        for nome in ["ÉVORA", "LISBOA", "BRAGANÇA"]:
            print(f"  desemprego 2024-12[{nome}] = {desemprego_2024_12.get(nome)}", file=sys.stderr)


if __name__ == "__main__":
    main()
