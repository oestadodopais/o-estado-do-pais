#!/usr/bin/env python3
"""
OS CONTORNOS DAS LETRAS DA CASA, TIRADOS DOS FICHEIROS DA CASA.

As seis direções desenham-se com as letras que o sítio já serve, e não com uma
serifada parecida: os ficheiros são os de `public/tipos/` (Spectral, Spectral SC,
Bitter), e é deles que saem os contornos que estão inlinados nos SVG de
`design/marca/direcoes/`.

O QUE ESTE PROGRAMA FAZ, E O QUE NÃO FAZ. Lê um WOFF2 da casa, converte a cadeia
pedida em contornos («path data» de SVG) na caixa de coordenadas do desenho, e
imprime o resultado. Não escreve nenhum ficheiro: o que ele imprime foi copiado
para dentro dos SVG, para que um SVG seja um ficheiro só, sem programa por baixo
e sem tipo por carregar. Está aqui para que a origem de cada contorno se possa
conferir e repetir.

O ESPACEJAMENTO É O DO PRÓPRIO TIPO. As larguras vêm da `hmtx`; os pares de
`kerning` vêm da tabela GPOS do ficheiro (PairPos dos formatos 1 e 2, que é o que
o Spectral usa). Nenhum valor é inventado à mão: quando o desenho aperta um par,
o aperto é dito no SVG, ao lado, em unidades da em.

DEPENDÊNCIA: `fontTools` (com `brotli`, para o WOFF2) do Python do sistema. Nada
entra no `package.json`; nada disto corre na construção do sítio.

USO
    python3 design/marca/glifos.py <ficheiro.woff2> <cadeia> [altura] [--metricas]

`altura` é a altura de maiúscula pedida, em unidades do desenho (por defeito
1000); o contorno sai já com o «y» virado para baixo, como o SVG o quer, com a
linha de base em y=0 e o início da cadeia em x=0.
"""

import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform


def _cobertura(cov):
    """Índice de cobertura por nome de glifo: {nome: índice}."""
    return {nome: i for i, nome in enumerate(cov.glyphs)}


def _classes(classdef, nomes):
    """Classe de cada glifo segundo uma ClassDef (o que não está lá é a classe 0)."""
    tabela = getattr(classdef, "classDefs", {}) if classdef else {}
    return {n: tabela.get(n, 0) for n in nomes}


def pares_de_kerning(fonte):
    """Os pares de kerning da GPOS, achatados num dicionário {(a, b): avanço}.

    Só lê o que interessa a uma cadeia latina sem contexto: as sub-tabelas
    PairPos (formato 1, pares explícitos; formato 2, pares por classe), incluindo
    as que estão atrás de uma extensão (LookupType 9). Ignora o resto da GPOS,
    que para este uso não move nenhuma letra.
    """
    fora = {}
    if "GPOS" not in fonte:
        return fora
    gpos = fonte["GPOS"].table
    if not gpos or not gpos.LookupList:
        return fora
    nomes = fonte.getGlyphOrder()
    for lookup in gpos.LookupList.Lookup:
        subs = list(lookup.SubTable)
        # LookupType 9: a sub-tabela verdadeira está dentro da extensão.
        subs = [s.ExtSubTable if getattr(s, "ExtSubTable", None) else s for s in subs]
        for st in subs:
            if getattr(st, "LookupType", None) == 2 or st.__class__.__name__ == "PairPos":
                if getattr(st, "Format", None) == 1:
                    cov = _cobertura(st.Coverage)
                    for primeiro, i in cov.items():
                        conj = st.PairSet[i]
                        for reg in conj.PairValueRecord:
                            v = getattr(reg.Value1, "XAdvance", 0) if reg.Value1 else 0
                            if v:
                                fora[(primeiro, reg.SecondGlyph)] = v
                elif getattr(st, "Format", None) == 2:
                    cov = _cobertura(st.Coverage)
                    c1 = _classes(st.ClassDef1, nomes)
                    c2 = _classes(st.ClassDef2, nomes)
                    for primeiro in cov:
                        k1 = c1.get(primeiro, 0)
                        if k1 >= len(st.Class1Record):
                            continue
                        rec1 = st.Class1Record[k1]
                        for segundo in nomes:
                            k2 = c2.get(segundo, 0)
                            if k2 >= len(rec1.Class2Record):
                                continue
                            r = rec1.Class2Record[k2]
                            v = getattr(r.Value1, "XAdvance", 0) if r.Value1 else 0
                            if v:
                                fora[(primeiro, segundo)] = v
    return fora


def contorno(caminho_do_tipo, cadeia, altura_de_maiuscula=1000, aperto=None):
    """O contorno da cadeia, em «path data» de SVG.

    Devolve `(d, largura, escala, metricas)`. A caixa: linha de base em y=0, «y»
    para baixo, primeira letra a começar em x=0. `aperto` é um dicionário
    {(a, b): unidades da em} somado ao kerning do próprio tipo, para os apertos
    que o desenho pede e que ficam ditos no SVG.
    """
    fonte = TTFont(caminho_do_tipo)
    upem = fonte["head"].unitsPerEm
    cap = getattr(fonte["OS/2"], "sCapHeight", None) or 700
    escala = altura_de_maiuscula / cap
    cmap = fonte.getBestCmap()
    conj = fonte.getGlyphSet()
    hmtx = fonte["hmtx"]
    kern = pares_de_kerning(fonte)
    apertos = aperto or {}

    nomes = []
    for ch in cadeia:
        n = cmap.get(ord(ch))
        if n is None:
            raise SystemExit(f"o tipo não tem o carácter {ch!r} (U+{ord(ch):04X})")
        nomes.append(n)

    pen_d = []
    x = 0.0
    for i, nome in enumerate(nomes):
        pen = SVGPathPen(conj, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        tp = TransformPen(pen, Transform(escala, 0, 0, -escala, x, 0))
        conj[nome].draw(tp)
        d = pen.getCommands()
        if d:
            pen_d.append(d)
        x += hmtx[nome][0] * escala
        if i + 1 < len(nomes):
            par = (nome, nomes[i + 1])
            x += (kern.get(par, 0) + apertos.get(par, 0)) * escala

    metricas = {
        "upem": upem,
        "cap": cap,
        "xh": getattr(fonte["OS/2"], "sxHeight", None),
        "asc": fonte["hhea"].ascent,
        "desc": fonte["hhea"].descent,
        "glifos": nomes,
        "kerning": {f"{a}+{b}": v for (a, b), v in kern.items() if a in nomes and b in nomes},
    }
    return " ".join(pen_d), x, escala, metricas


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__.strip())
    ficheiro, cadeia = sys.argv[1], sys.argv[2]
    alt = float(sys.argv[3]) if len(sys.argv) > 3 and not sys.argv[3].startswith("--") else 1000
    d, largura, escala, met = contorno(ficheiro, cadeia, alt)
    if "--metricas" in sys.argv:
        for k, v in met.items():
            print(f"# {k}: {v}", file=sys.stderr)
        print(f"# largura: {largura:.2f}  escala: {escala:.6f}", file=sys.stderr)
    print(d)
