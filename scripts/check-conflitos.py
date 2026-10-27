#!/usr/bin/env python3
"""Recusa marcadores de conflito do Git nos ficheiros de texto seguidos (I274, M119, 27.10.2026).

Uso: python3 scripts/check-conflitos.py [--prova] [--json <ficheiro>]

Nasceu de três marcadores (`<<<<<<< HEAD`, `=======`, `>>>>>>> main`) que chegaram a `main` em
`design/observatorio/REGISTO-DE-MELHORIAS.md` com o commit HIG-27c de 27.10.2026 (a fusão de `main` no ramo
da higiene) e passaram pela corrida inteira, pelo portão do GitHub e pela aterragem, porque nenhuma régua lia
marcadores de conflito. O âmbito: os ficheiros seguidos pelo Git com as extensões de texto da casa (md, mjs,
js, ts, json, yml, yaml, css, astro, py, sh, txt) em `src/`, `scripts/`, `tests/`, `ledger/` e `.github/`,
todos os `.md` do repositório, o `package.json` e o `astro.config.mjs`; ficam fora os `.json` e os `.txt` de
`design/especime-v3/medicoes/` (registos de medições, grandes e gerados). Medido a 27.10.2026: 5 910
ficheiros, 70 MB, 1,1 s com `grep` sobre o mesmo âmbito.

Um marcador é `<<<<<<< ` ou `>>>>>>> ` no início de uma linha. A linha `=======` sozinha não conta: é um
título Markdown legítimo, e só aparece num conflito entre as outras duas. Sai 0 sem marcadores; 1 com
marcadores, cada um com o ficheiro e a linha; 2 quando a planta não morde; 9 quando o Git não responde.
A planta (`--prova`) corre no próprio guião, em memória: um texto com os dois marcadores tem de dar dois
achados e um texto com um título Markdown sublinhado por sinais de igual tem de dar zero.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
MARCADOR = re.compile(r'^(<<<<<<< |>>>>>>> )')
EXTENSOES = re.compile(r'\.(md|mjs|js|ts|json|yml|yaml|css|astro|py|sh|txt)$', re.I)
FORA = re.compile(r'^design/especime-v3/medicoes/.*\.(json|txt)$')
AMBITO = ['*.md', 'src', 'scripts', 'tests', 'ledger', '.github', 'package.json', 'astro.config.mjs']


def marcadores_no_texto(texto):
    """As linhas (número e começo) que abrem ou fecham um conflito."""
    return [(n, linha[:40]) for n, linha in enumerate(texto.split('\n'), 1) if MARCADOR.match(linha)]


def ficheiros_do_ambito():
    try:
        saida = subprocess.run(['git', 'ls-files', '-z', '--', *AMBITO], cwd=RAIZ, check=True,
                               capture_output=True).stdout
    except (OSError, subprocess.CalledProcessError) as erro:
        print(f'check:conflitos · o git não respondeu: {erro}', file=sys.stderr)
        sys.exit(9)
    nomes = [n.decode('utf-8', 'surrogateescape') for n in saida.split(b'\0') if n]
    return sorted({n for n in nomes if EXTENSOES.search(n) and not FORA.match(n)})


def prova():
    com = marcadores_no_texto('a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> main\n')
    sem = marcadores_no_texto('Título\n=======\n\nTexto com <<<<<<< dentro da linha.\n')
    if [n for n, _ in com] != [2, 6] or sem:
        print(f'check:conflitos · a planta não morde (com={com}, sem={sem})', file=sys.stderr)
        sys.exit(2)
    print('check:conflitos · planta: dois marcadores apanhados, o título Markdown ignorado')


def principal():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--prova', action='store_true', help='corre primeiro a planta em memória')
    parser.add_argument('--json', type=Path, help='escreve os achados e as contagens')
    args = parser.parse_args()
    if args.prova:
        prova()
    ficheiros = ficheiros_do_ambito()
    achados = []
    for nome in ficheiros:
        caminho = RAIZ / nome
        if not caminho.is_file() or caminho.is_symlink():
            continue
        texto = caminho.read_bytes().decode('utf-8', 'replace')
        for n, inicio in marcadores_no_texto(texto):
            achados.append({'ficheiro': nome, 'linha': n, 'inicio': inicio})
    for a in achados:
        print(f"check:conflitos · {a['ficheiro']}:{a['linha']} · {a['inicio']}")
    print(f'check:conflitos · {len(ficheiros)} ficheiros · {len(achados)} marcadores')
    if args.json:
        args.json.write_text(json.dumps({'ficheiros': len(ficheiros), 'achados': achados}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    sys.exit(1 if achados else 0)


if __name__ == '__main__':
    principal()
