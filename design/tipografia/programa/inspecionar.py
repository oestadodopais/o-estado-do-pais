#!/usr/bin/env python3
"""
O QUE ESTÁ DENTRO DO FICHEIRO (medidas 1, 4, 5 e 7 da rubrica, ao nível do tipo).

Lê cada WOFF2 subconjunto e escreve, por família:

  · `unitsPerEm`, `sxHeight` e `sCapHeight` do OS/2, e a altura de x em píxeis
    a 17 px e a 15 px de corpo (medida 1, lida do ficheiro; a régua do navegador
    confirma-a depois com `canvas.measureText`);
  · as features OpenType declaradas no GSUB e no GPOS: interessa `tnum` (medida
    4) e `smcp` (medida 5), e diz-se quais estão lá e quais não estão;
  · as larguras de avanço de «0» a «9» por defeito e, quando o `tnum` existe,
    as dos glifos para onde ele substitui: a variância a 15 px é a medida 4;
  · os eixos variáveis e o seu intervalo (o `opsz` é o que a §3 do brief pediu);
  · os bytes do ficheiro (medida 7).

O DETETOR VÊ UM VERMELHO ANTES DE DIZER VERDE. A opção `--vermelho` fabrica um
subconjunto SEM features (`--layout-features=''`) de uma família que TEM `tnum`,
e exige que a medida 4 falhe nesse ficheiro. Se falhar, o detetor mede; se
passar, o detetor não mede nada e o programa pára.

Corre: python3 design/tipografia/programa/inspecionar.py [--vermelho]
"""
import json
import pathlib
import statistics
import subprocess
import sys
import tempfile

from fontTools.ttLib import TTFont

RAIZ = pathlib.Path(__file__).resolve().parents[3]
TIPOS = RAIZ / "design" / "tipografia" / "tipos"

# família -> (ficheiro subconjunto romano, papel a que concorre)
ALVOS = [
    ("Newsreader", "newsreader/Newsreader-latin.woff2", "prosa"),
    ("Source Serif 4", "sourceserif4/SourceSerif4-latin.woff2", "prosa"),
    ("Literata", "literata/Literata-latin.woff2", "prosa"),
    ("Ledger", "ledger/Ledger-latin.woff2", "prosa"),
    ("Spectral", "spectral/Spectral-Regular-latin.woff2", "prosa (controlo)"),
    ("Spectral SC", "spectral-sc/SpectralSC-Regular-latin.woff2", "versal (controlo)"),
    ("Bitter", "bitter/Bitter-latin.woff2", "instrumento (controlo)"),
    ("Public Sans", "publicsans/PublicSans-latin.woff2", "instrumento"),
    ("IBM Plex Sans", "ibmplexsans/IBMPlexSans-latin.woff2", "instrumento"),
]

DIGITOS = "0123456789"


def features(fonte: TTFont) -> set:
    tags = set()
    for tabela in ("GSUB", "GPOS"):
        if tabela in fonte:
            t = fonte[tabela].table
            if t and t.FeatureList:
                for fr in t.FeatureList.FeatureRecord:
                    tags.add(fr.FeatureTag)
    return tags


def substituicoes_de(fonte: TTFont, tag: str) -> dict:
    """Mapa glifo -> glifo de uma feature de substituição simples do GSUB."""
    fora = {}
    if "GSUB" not in fonte:
        return fora
    t = fonte["GSUB"].table
    if not t or not t.FeatureList or not t.LookupList:
        return fora
    indices = []
    for fr in t.FeatureList.FeatureRecord:
        if fr.FeatureTag == tag:
            indices.extend(fr.Feature.LookupListIndex)
    for i in indices:
        lookup = t.LookupList.Lookup[i]
        for st in lookup.SubTable:
            if getattr(st, "LookupType", lookup.LookupType) == 1 or lookup.LookupType == 1:
                mapa = getattr(st, "mapping", None)
                if mapa:
                    fora.update(mapa)
    return fora


def larguras_dos_digitos(fonte: TTFont, tag: str | None) -> list:
    cmap = fonte.getBestCmap()
    hmtx = fonte["hmtx"]
    troca = substituicoes_de(fonte, tag) if tag else {}
    larguras = []
    for d in DIGITOS:
        g = cmap.get(ord(d))
        if g is None:
            return []
        g = troca.get(g, g)
        larguras.append(hmtx[g][0])
    return larguras


def variancia_px(larguras: list, upm: int, corpo: float) -> float | None:
    if not larguras:
        return None
    em_px = [w / upm * corpo for w in larguras]
    return statistics.pvariance(em_px) if len(em_px) > 1 else 0.0


def olhar(caminho: pathlib.Path) -> dict:
    fonte = TTFont(caminho)
    upm = fonte["head"].unitsPerEm
    os2 = fonte["OS/2"]
    sx = getattr(os2, "sxHeight", None)
    cap = getattr(os2, "sCapHeight", None)
    feats = features(fonte)
    eixos = {}
    if "fvar" in fonte:
        for a in fonte["fvar"].axes:
            eixos[a.axisTag] = [a.minValue, a.defaultValue, a.maxValue]
    padrao = larguras_dos_digitos(fonte, None)
    tab = larguras_dos_digitos(fonte, "tnum") if "tnum" in feats else []
    return {
        "ficheiro": str(caminho.relative_to(RAIZ)),
        "bytes": caminho.stat().st_size,
        "unitsPerEm": upm,
        "sxHeight": sx,
        "sCapHeight": cap,
        "altura_x_px_17": round(sx / upm * 17, 3) if sx else None,
        "altura_x_px_15": round(sx / upm * 15, 3) if sx else None,
        "razao_x_altura": round(sx / upm, 4) if sx else None,
        "eixos": eixos,
        "tem_tnum": "tnum" in feats,
        "tem_smcp": "smcp" in feats,
        "tem_onum": "onum" in feats,
        "tem_lnum": "lnum" in feats,
        "features": sorted(feats),
        "larguras_digitos_padrao": padrao,
        "larguras_digitos_tnum": tab,
        "variancia_px_15_padrao": variancia_px(padrao, upm, 15),
        "variancia_px_15_tnum": variancia_px(tab, upm, 15) if tab else None,
    }


def prova_do_vermelho() -> dict:
    """
    O caso conhecido: a Newsreader TEM `tnum`. Feito o subconjunto SEM features,
    o `tnum` desaparece e a medida 4 tem de a excluir. Se não excluir, o detetor
    está cego e o programa pára aqui.
    """
    entrada = TIPOS / "newsreader" / "Newsreader[opsz,wght].ttf"
    with tempfile.TemporaryDirectory() as tmp:
        alvo = pathlib.Path(tmp) / "vermelho.woff2"
        r = subprocess.run([
            sys.executable, "-m", "fontTools.subset", str(entrada),
            "--unicodes=U+0020-007E", "--layout-features=", "--flavor=woff2",
            f"--output-file={alvo}",
        ], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit("não consegui fabricar o vermelho: " + r.stderr[-500:])
        fonte = TTFont(alvo)
        feats = features(fonte)
        tem = "tnum" in feats
        verde = olhar(TIPOS / "newsreader" / "Newsreader-latin.woff2")
        if tem:
            raise SystemExit(
                "O VERMELHO PLANTADO PASSOU: o subconjunto sem features ainda "
                "declara `tnum`. O detetor da medida 4 não mede nada.")
        if not verde["tem_tnum"]:
            raise SystemExit(
                "O VERDE CONHECIDO FALHOU: a Newsreader subconjunto do estudo "
                "perdeu o `tnum`. O detetor rejeita tudo, e não mede nada.")
        return {
            "caso": "Newsreader com o subconjunto feito sem features OpenType",
            "esperado": "a medida 4 exclui (sem `tnum`)",
            "visto_tnum_no_vermelho": tem,
            "visto_tnum_no_verde": verde["tem_tnum"],
            "veredicto": "o detetor da medida 4 distingue os dois",
        }


def main() -> int:
    vermelho = prova_do_vermelho()
    print("VERMELHO PLANTADO: " + vermelho["veredicto"])
    print(f"  sem features -> tnum={vermelho['visto_tnum_no_vermelho']}; "
          f"subconjunto do estudo -> tnum={vermelho['visto_tnum_no_verde']}\n")

    fora = {"prova_do_detetor": vermelho, "familias": {}}
    for nome, rel, papel in ALVOS:
        caminho = TIPOS / rel
        if not caminho.exists():
            print(f"FALTA {caminho}", file=sys.stderr)
            return 1
        d = olhar(caminho)
        d["papel"] = papel
        fora["familias"][nome] = d
        vt = d["variancia_px_15_tnum"]
        vp = d["variancia_px_15_padrao"]
        print(f"{nome:16s} upm={d['unitsPerEm']:<5d} x/em={d['razao_x_altura']} "
              f"x@17px={d['altura_x_px_17']:<7} tnum={d['tem_tnum']!s:<5} "
              f"smcp={d['tem_smcp']!s:<5} var15(pad)={vp:.6f} "
              f"var15(tnum)={'—' if vt is None else format(vt, '.6f')} "
              f"eixos={','.join(d['eixos']) or '—'}")

    # SEGUNDA RONDA: escreve-se ao lado e não por cima. O ficheiro da primeira
    # ronda é o que a leitura cruzada leu, e apagá-lo era apagar a prova.
    ficha = RAIZ / "design" / "tipografia" / "MEDIDAS-2-tipo.json"
    ficha.write_text(json.dumps(fora, ensure_ascii=False, indent=2) + "\n",
                     encoding="utf-8")
    print(f"\nescrito {ficha.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
