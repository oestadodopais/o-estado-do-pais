#!/usr/bin/env python3
"""Lê a fila editorial e confere um lançamento pelo calendário UTC."""
import argparse
from datetime import datetime, timezone
from pathlib import Path
import re
import sys

FILA = Path(__file__).resolve().parents[2] / 'design/observatorio/FILA.md'
TIPOS = {'conteúdo', 'navegação', 'maquinaria'}


def ler_fila(caminho=FILA):
    cabecalho = None
    linhas = []
    ordens, blocos = set(), set()
    for texto in Path(caminho).read_text(encoding='utf-8').splitlines():
        if not texto.startswith('|'):
            cabecalho = None
            continue
        celulas = [c.strip() for c in texto.strip().strip('|').split('|')]
        if {'Ordem', 'Bloco', 'Tipo', 'Estado'} <= set(celulas):
            cabecalho = celulas
            continue
        if cabecalho is None or all(re.fullmatch(r':?-+:?', c) for c in celulas):
            continue
        if len(celulas) != len(cabecalho):
            raise ValueError('fila: linha com colunas em falta')
        d = dict(zip(cabecalho, celulas))
        if not d['Ordem'].isdigit() or int(d['Ordem']) < 1:
            raise ValueError('fila: ordem inválida')
        d['Ordem'] = int(d['Ordem'])
        if d['Tipo'] not in TIPOS:
            raise ValueError('fila: tipo inválido: ' + d['Tipo'])
        if d['Ordem'] in ordens or d['Bloco'] in blocos:
            raise ValueError('fila: ordem ou bloco repetido')
        ordens.add(d['Ordem']); blocos.add(d['Bloco'])
        d['linha'] = texto
        linhas.append(d)
    if not linhas:
        raise ValueError('fila: nenhuma linha lida')
    return sorted(linhas, key=lambda d: d['Ordem'])


def ler_tipos(caminho=FILA):
    """Inclui os blocos já aterrados que a fila conserva noutra tabela."""
    tipos = {}
    cabecalho = None
    for linha in Path(caminho).read_text(encoding='utf-8').splitlines():
        if not linha.startswith('|'):
            cabecalho = None
            continue
        c = [x.strip() for x in linha.strip().strip('|').split('|')]
        if {'Bloco', 'Tipo'} <= set(c):
            cabecalho = c
        elif cabecalho and len(c) == len(cabecalho):
            d = dict(zip(cabecalho, c))
            if d['Tipo'] in TIPOS:
                tipos[d['Bloco'].casefold()] = d['Tipo']
    return tipos


def conferir(linhas, bloco, hoje=None):
    alvo = next((d for d in linhas if d['Bloco'] == bloco), None)
    if alvo is None:
        raise ValueError('fila: bloco fora da fila: ' + bloco)
    hoje = hoje or datetime.now(timezone.utc).date()
    if alvo['Tipo'] != 'maquinaria' or hoje.weekday() == 4:
        return
    for d in linhas:
        estado = d['Estado'].casefold()
        if d['Tipo'] == 'maquinaria' or estado.startswith('à espera'):
            continue
        if d['Ordem'] > alvo['Ordem'] and not estado.startswith(('mandato escrito', 'pronto')):
            continue
        if re.search(r'condição:\s*' + re.escape(bloco) + r'(?![\w-])', d['linha'], re.I):
            continue
        raise ValueError(f"fila: {bloco} espera por {d['Bloco']} ({d['Tipo']}); só passa à sexta-feira ou como condição desse bloco")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--lancar')
    args = p.parse_args()
    try:
        linhas = ler_fila()
        if args.lancar:
            conferir(linhas, args.lancar)
            print('fila: pode lançar ' + args.lancar)
        else:
            for d in linhas:
                print(f"{d['Ordem']} · {d['Bloco']} · {d['Tipo']} · {d['Estado']}")
        return 0
    except (OSError, ValueError) as e:
        print(str(e) if isinstance(e, ValueError) else 'fila: ficheiro ilegível', file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main())
