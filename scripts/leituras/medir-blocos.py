#!/usr/bin/env python3
"""Mede o HTML pela partição html_blocks do motor; índices a partir de zero."""
import argparse
import os
from pathlib import Path
import sys
sys.dont_write_bytecode = True


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('html', type=Path)
    p.add_argument('frase')
    p.add_argument('--nomes', default='')
    args = p.parse_args()
    try:
        motor = os.environ.get('RESEARCHHUB_DIR')
        if not motor:
            raise ValueError('falta RESEARCHHUB_DIR')
        sys.path.insert(0, motor)
        from publisher.oe2027_analise import html_blocks
        blocos = html_blocks(args.html.read_bytes())
        frase = ' '.join(args.frase.split())
        if not frase:
            raise ValueError('a frase está vazia')
        for i, texto in enumerate(blocos):
            print(f'[{i}] {texto}')
        indices = [i for i, texto in enumerate(blocos) if frase in texto]
        print('Início da frase nos blocos: ' + (', '.join(map(str, indices)) or 'ausente'))
        for i in indices:
            print(f'Quatro blocos anteriores a [{i}]:')
            for j in range(max(0, i - 4), i):
                print(f'[{j}] {blocos[j]}')
        for nome in args.nomes.split():
            encontrados = [str(i) for i, texto in enumerate(blocos) if nome in texto]
            print(f'{nome}: ' + (', '.join(encontrados) or 'ausente'))
        return 0 if indices else 1
    except (OSError, ValueError, ImportError) as e:
        print('medir-blocos: ' + (str(e) if isinstance(e, ValueError) else 'não foi possível ler o HTML ou importar o motor'), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main())
