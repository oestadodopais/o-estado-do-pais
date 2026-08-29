#!/usr/bin/env python3
"""
O SUBCONJUNTO DOS TIPOS: cortar o que o sítio aloja ao que o sítio precisa.

O estudo tipográfico de 29.08.2026 mediu que os oito ficheiros de `public/tipos`
pesam 694,8 KiB inteiros e 405,3 KiB cortados ao latim com as features todas, e
escreveu que essa é a única poupança do estudo que não precisa de decisão
nenhuma: 289,5 KiB por leitor, sem mudar uma letra. Isto é o corte.

-----------------------------------------------------------------------------
DE ONDE VÊM OS BYTES DE ENTRADA
-----------------------------------------------------------------------------
Dos próprios WOFF2 de `public/tipos/`, que é o que este repositório tem: não há
TTF de montante aqui, e nenhum foi buscado à rede para este corte. É a mesma
entrada que o estudo usou para as três famílias de controlo («entraram dos WOFF2
que o sítio já aloja, lidos de `public/tipos` e nunca escritos»). O `OFL.txt` de
cada família fica onde está e não é tocado: cortar um tipo não muda a licença
dele, e um ficheiro de tipo sem a sua licença ao lado é uma reutilização que
este sítio não pode defender.

O ficheiro corre com `--em-teste <pasta>` para escrever fora de `public/`, que é
como a conferência de glifos vê o resultado antes de ele substituir o original.

-----------------------------------------------------------------------------
O INTERVALO, E PORQUE NÃO É SÓ O LATIM
-----------------------------------------------------------------------------
`latin` + `latin-ext` do Google Fonts, MAIS todos os caracteres que o sítio
construído põe à frente de alguém. A segunda metade não é zelo: o intervalo
latino não leva a seta «→», que este sítio rende 30 505 vezes, nem o «≤», nem o
«⅓» dos documentos alojados. Cortar ao latim e mais nada tirava a seta de todas
as portas do sítio, e uma seta em falta lê-se como uma caixa.

A primeira metade também não é zelo ao contrário: guarda os glifos de que uma
linha nova pode precisar amanhã — um nome estrangeiro, uma fonte com um acento
que hoje não aparece — sem que ninguém tenha de se lembrar de correr isto outra
vez. Um subconjunto talhado exactamente ao que hoje existe é um subconjunto que
fica errado na primeira linha nova.

`--layout-features='*'` guarda TODAS as features OpenType. Sem esta bandeira o
`pyftsubset` deixa cair o `tnum` e o `smcp`, que são as duas coisas que este
sítio pede à letra em 143 regras e em 22.

Uso:
  python3 scripts/subconjunto-tipos.py --caracteres <caracteres.json>
  python3 scripts/subconjunto-tipos.py --caracteres <…> --em-teste <pasta>
"""
import argparse
import hashlib
import json
import pathlib
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[1]
TIPOS = RAIZ / "public" / "tipos"

# `latin` + `latin-ext`, como o Google Fonts os define. Copiados do
# `design/tipografia/programa/subconjunto.py` do estudo, para que os bytes deste
# corte se comparem com os que ele mediu.
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

FICHEIROS = [
    "spectral/Spectral-Regular.woff2",
    "spectral/Spectral-Italic.woff2",
    "spectral/Spectral-Medium.woff2",
    "spectral/Spectral-SemiBold.woff2",
    "spectral/Spectral-Bold.woff2",
    "spectral-sc/SpectralSC-Regular.woff2",
    "spectral-sc/SpectralSC-SemiBold.woff2",
    "bitter/Bitter[wght].woff2",
]


def resumo(caminho: pathlib.Path) -> str:
    return hashlib.sha256(caminho.read_bytes()).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--caracteres", required=True,
                    help="o JSON dos caracteres distintos de dist/")
    ap.add_argument("--em-teste", default=None,
                    help="escreve nesta pasta em vez de em public/tipos")
    ap.add_argument("--ficha", default=None, help="onde escrever o JSON dos bytes")
    a = ap.parse_args()

    usados = json.loads(pathlib.Path(a.caracteres).read_text(encoding="utf-8"))["caracteres"]
    pontos = sorted({c["cp"] for c in usados})
    unicodes = ",".join([LATIN, LATIN_EXT] + [f"U+{p:04X}" for p in pontos])

    destino_base = pathlib.Path(a.em_teste) if a.em_teste else TIPOS
    saida = []
    antes_total = 0
    depois_total = 0
    for rel in FICHEIROS:
        entrada = TIPOS / rel
        if not entrada.exists():
            print(f"FALTA {entrada}", file=sys.stderr)
            return 1
        antes = entrada.stat().st_size
        destino = destino_base / rel
        destino.parent.mkdir(parents=True, exist_ok=True)
        # Escreve-se sempre para um ficheiro ao lado e só depois se move: um
        # `pyftsubset` que morra a meio não deixa meio tipo no lugar do inteiro.
        provisorio = destino.with_suffix(".woff2.novo")
        cmd = [
            sys.executable, "-m", "fontTools.subset", str(entrada),
            f"--unicodes={unicodes}",
            "--layout-features=*",
            "--flavor=woff2",
            "--name-IDs=*",
            f"--output-file={provisorio}",
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout[-2000:], r.stderr[-2000:], file=sys.stderr)
            provisorio.unlink(missing_ok=True)
            return 1
        depois = provisorio.stat().st_size
        provisorio.replace(destino)
        antes_total += antes
        depois_total += depois
        saida.append({
            "ficheiro": rel,
            "bytes_antes": antes,
            "bytes_depois": depois,
            "sha256_depois": resumo(destino),
        })
        print(f"  {rel:38s} {antes:>7d} -> {depois:>7d}  "
              f"({100 * (antes - depois) / antes:4.1f}% menos)")

    print(f"  {'TOTAL':38s} {antes_total:>7d} -> {depois_total:>7d}  "
          f"({(antes_total - depois_total) / 1024:.1f} KiB menos)")

    ficha = {
        "ferramenta": "fontTools.subset (pyftsubset) "
                      + __import__("fontTools").version + ", brotli para o WOFF2",
        "entrada": "os WOFF2 de public/tipos/, que é o que este repositório tem",
        "unicodes": unicodes,
        "caracteres_do_sitio": len(pontos),
        "bytes_antes": antes_total,
        "bytes_depois": depois_total,
        "ficheiros": saida,
    }
    caminho_ficha = (pathlib.Path(a.ficha) if a.ficha
                     else RAIZ / "tests" / "tipos" / "SUBCONJUNTO.json")
    caminho_ficha.write_text(
        json.dumps(ficha, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\n  ficha em {caminho_ficha}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
