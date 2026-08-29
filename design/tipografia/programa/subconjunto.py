#!/usr/bin/env python3
"""
O SUBCONJUNTO LATINO, E O QUE ELE PESA (medida 7 da rubrica).

Converte cada família do estudo para WOFF2 com o subconjunto latino, com a
MESMA ordem para todas, para que a linha 7 da rubrica compare bytes com bytes e
não um ficheiro subconjunto com outro inteiro.

  · as candidatas entram do TTF variável descarregado de `google/fonts`;
  · os controlos (Spectral, Spectral SC, Bitter) entram dos WOFF2 que o sítio já
    aloja em `public/tipos`, LIDOS e nunca escritos: nenhuma linha deste ficheiro
    abre `public/` para escrita.

O intervalo é o `latin` mais o `latin-ext` do Google Fonts. O `latin` sozinho
(U+0000-00FF) já cobre o português inteiro; o `latin-ext` entra porque o sítio
cita nomes e fontes estrangeiras e um glifo em falta lê-se como uma caixa.

`--layout-features='*'` guarda TODAS as features OpenType. Sem esta bandeira o
`pyftsubset` deixa cair o `tnum` e o `smcp`, que são exatamente as duas medidas
que a rubrica exige (4 e 5): o subconjunto responderia à pergunta destruindo a
resposta.

Corre: python3 design/tipografia/programa/subconjunto.py
"""
import hashlib
import json
import pathlib
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[3]
TIPOS = RAIZ / "design" / "tipografia" / "tipos"
PUBLICOS = RAIZ / "public" / "tipos"

# `latin` + `latin-ext`, como o Google Fonts os define.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FEFF,U+FFFD"
)
LATIN_EXT = (
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,"
    "U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,"
    "U+2113,U+2C60-2C7F,U+A720-A7FF"
)
UNICODES = LATIN + "," + LATIN_EXT

# (familia, ficheiro de entrada, ficheiro de saída, papel)
TRABALHO = [
    ("newsreader", TIPOS / "newsreader" / "Newsreader[opsz,wght].ttf",
     "Newsreader-latin.woff2", "prosa"),
    ("newsreader", TIPOS / "newsreader" / "Newsreader-Italic[opsz,wght].ttf",
     "Newsreader-Italic-latin.woff2", "prosa"),
    ("sourceserif4", TIPOS / "sourceserif4" / "SourceSerif4[opsz,wght].ttf",
     "SourceSerif4-latin.woff2", "prosa"),
    ("sourceserif4", TIPOS / "sourceserif4" / "SourceSerif4-Italic[opsz,wght].ttf",
     "SourceSerif4-Italic-latin.woff2", "prosa"),
    ("literata", TIPOS / "literata" / "Literata[opsz,wght].ttf",
     "Literata-latin.woff2", "prosa"),
    ("literata", TIPOS / "literata" / "Literata-Italic[opsz,wght].ttf",
     "Literata-Italic-latin.woff2", "prosa"),
    ("publicsans", TIPOS / "publicsans" / "PublicSans[wght].ttf",
     "PublicSans-latin.woff2", "instrumento"),
    ("ibmplexsans", TIPOS / "ibmplexsans" / "IBMPlexSans[wdth,wght].ttf",
     "IBMPlexSans-latin.woff2", "instrumento"),
    # os controlos, lidos de `public/tipos` e escritos aqui
    ("spectral", PUBLICOS / "spectral" / "Spectral-Regular.woff2",
     "Spectral-Regular-latin.woff2", "prosa"),
    ("spectral", PUBLICOS / "spectral" / "Spectral-Italic.woff2",
     "Spectral-Italic-latin.woff2", "prosa"),
    ("spectral", PUBLICOS / "spectral" / "Spectral-Medium.woff2",
     "Spectral-Medium-latin.woff2", "prosa"),
    ("spectral", PUBLICOS / "spectral" / "Spectral-SemiBold.woff2",
     "Spectral-SemiBold-latin.woff2", "prosa"),
    ("spectral", PUBLICOS / "spectral" / "Spectral-Bold.woff2",
     "Spectral-Bold-latin.woff2", "prosa"),
    ("spectral-sc", PUBLICOS / "spectral-sc" / "SpectralSC-Regular.woff2",
     "SpectralSC-Regular-latin.woff2", "versal"),
    ("spectral-sc", PUBLICOS / "spectral-sc" / "SpectralSC-SemiBold.woff2",
     "SpectralSC-SemiBold-latin.woff2", "versal"),
    ("bitter", PUBLICOS / "bitter" / "Bitter[wght].woff2",
     "Bitter-latin.woff2", "instrumento"),
]


def resumo(caminho: pathlib.Path) -> str:
    return hashlib.sha256(caminho.read_bytes()).hexdigest()


def main() -> int:
    if any(str(d).startswith(str(PUBLICOS)) for _, _, d, _ in
           [(a, b, TIPOS / a / c, e) for a, b, c, e in TRABALHO]):
        print("uma saída caiu em public/tipos; nada foi escrito.", file=sys.stderr)
        return 2

    saida = []
    for familia, entrada, nome, papel in TRABALHO:
        if not entrada.exists():
            print(f"FALTA a entrada {entrada}", file=sys.stderr)
            return 1
        destino = TIPOS / familia / nome
        destino.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            sys.executable, "-m", "fontTools.subset", str(entrada),
            f"--unicodes={UNICODES}",
            "--layout-features=*",
            "--flavor=woff2",
            "--name-IDs=*",
            f"--output-file={destino}",
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout[-2000:], r.stderr[-2000:], file=sys.stderr)
            return 1
        saida.append({
            "familia": familia,
            "papel": papel,
            "entrada": str(entrada.relative_to(RAIZ)),
            "entrada_bytes": entrada.stat().st_size,
            "saida": str(destino.relative_to(RAIZ)),
            "bytes": destino.stat().st_size,
            "sha256": resumo(destino),
        })
        print(f"  {familia:14s} {nome:34s} "
              f"{entrada.stat().st_size:>9d} -> {destino.stat().st_size:>8d}")

    ficha = TIPOS / "SUBCONJUNTOS.json"
    ficha.write_text(json.dumps({
        "unicodes": UNICODES,
        "ferramenta": "fontTools.subset (pyftsubset) "
                      + __import__("fontTools").version
                      + ", brotli para o WOFF2",
        "ficheiros": saida,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nescrito {ficha.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
