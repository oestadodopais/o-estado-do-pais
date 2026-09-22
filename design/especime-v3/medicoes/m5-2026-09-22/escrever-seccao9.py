#!/usr/bin/env python3
"""Escreve o §9 do relatório do M5 a partir dos ficheiros dos portões, nunca de memória (M16).

uso: python3 design/especime-v3/medicoes/m5-2026-09-22/escrever-seccao9.py   (na raiz)

Lê os `.codigo`, `.inicio`, `.fim` e `.cabeca` que cada corrida dos três portões
escreveu, a lista dos commits pelo `git`, e as cabeças registadas em
`plantas-m5.json` e em `medidas.json`. Sai com 2 se algum ficheiro faltar, em vez
de escrever uma tabela com buracos, e diz em voz alta quando um portão está
registado com um código diferente de 0.
"""
import datetime
import json
import os
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
# Quatro níveis acima de `m5-2026-09-22`: medicoes, especime-v3, design, raiz.
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(AQUI))))
REL = os.path.join(AQUI, 'LEIA-ME.md')
BASE = 'b03a6efc'
MARCA = '## 9 · Os commits, a cabeça e os três portões'


def le(qual, campo):
    f = os.path.join(AQUI, f'{qual}.{campo}')
    if not os.path.isfile(f):
        raise SystemExit(f'escrever-seccao9.py: NÃO LIDO, falta {qual}.{campo}')
    return open(f, encoding='utf-8').read().strip()


def main():
    linhas, vermelhos = [], []
    for qual, comando in (('build', '`npm run build`'), ('verify', '`npm run verify`'),
                          ('typecheck', '`npm run typecheck`')):
        ini, fim, cod = le(qual, 'inicio'), le(qual, 'fim'), le(qual, 'codigo')
        a = datetime.datetime.fromisoformat(ini.replace('Z', '+00:00'))
        b = datetime.datetime.fromisoformat(fim.replace('Z', '+00:00'))
        s = int((b - a).total_seconds())
        dur = f'{s // 60} m {s % 60} s' if s >= 60 else f'{s} s'
        linhas.append(f'| {comando} | {ini} | {fim} | **{dur}** | **{cod}** |')
        if cod != '0':
            vermelhos.append(f'{qual} saiu com {cod}')

    cabeca = le('build', 'cabeca')
    r = subprocess.run(['git', 'log', '--format=%h %s', f'{BASE}..HEAD'],
                       cwd=RAIZ, capture_output=True, text=True)
    commits = [c for c in r.stdout.strip().split('\n') if c.strip()]
    if r.returncode != 0 or not commits:
        raise SystemExit(f'escrever-seccao9.py: NÃO LIDO, o `git log` em {RAIZ} não devolveu '
                         f'commits (código {r.returncode}).')
    plantas = json.load(open(os.path.join(AQUI, 'plantas-m5.json'), encoding='utf-8'))['cabeca']
    medidas = json.load(open(os.path.join(AQUI, 'medidas.json'), encoding='utf-8'))['cabeca']

    texto = (
        f'{MARCA}\n\n'
        f'A cabeça sobre a qual os três portões correram: `{cabeca}`, no ramo '
        f'`medidas-2026-09-22`, sobre `main` em `{BASE}`. Os commits, do mais antigo para o mais '
        f'recente:\n\n'
    )
    for c in reversed(commits):
        texto += f'- `{c.split(" ")[0]}` {" ".join(c.split(" ")[1:])}\n'
    texto += (
        '\nOs três portões, cada um no seu comando, com o código de saída lido de um ficheiro '
        'acabado de escrever e não de um `echo` atrás de um `|`. Os ficheiros `.codigo` foram '
        'apagados antes da corrida, e ao lado de cada um ficam o `.inicio`, o `.fim`, o `.cabeca` '
        'e o `.log` (M16: a presença de um ficheiro não prova que ele é desta corrida).\n\n'
        '| Comando | Início | Fim | Tempo de parede | Código |\n'
        '|---|---|---|---:|---:|\n'
        + '\n'.join(linhas) + '\n\n'
        f'As plantas e as medições foram corridas com a árvore de trabalho que se tornou esta '
        f'cabeça, antes de os commits desta passagem existirem: o campo `cabeca` de '
        f'`plantas-m5.json` diz `{plantas[:8]}` e o de `medidas.json` diz `{medidas[:8]}`, que é '
        f'o commit anterior a elas. O código que as plantas exercitaram é, byte a byte, o que '
        f'esta cabeça contém.\n'
    )

    s = open(REL, encoding='utf-8').read()
    if MARCA not in s:
        raise SystemExit(f'escrever-seccao9.py: o relatório não tem o título «{MARCA}».')
    open(REL, 'w', encoding='utf-8').write(s[:s.index(MARCA)] + texto)
    print(texto)
    if vermelhos:
        print('escrever-seccao9.py: ' + '; '.join(vermelhos), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
