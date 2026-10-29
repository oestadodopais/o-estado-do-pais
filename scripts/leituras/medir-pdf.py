#!/usr/bin/env python3
"""Texto layout e caixa do bloco de texto que começa pela frase; página a partir de um."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('pdf', type=Path)
    p.add_argument('pagina', type=int)
    p.add_argument('inicio')
    args = p.parse_args()
    try:
        import fitz
        with fitz.open(args.pdf) as doc:
            if not 1 <= args.pagina <= len(doc):
                raise ValueError('página fora do PDF')
            inicio = ' '.join(args.inicio.split())
            if not inicio:
                raise ValueError('o início da frase está vazio')
            pagina = doc[args.pagina - 1]
            layout = subprocess.run(['pdftotext', '-layout', '-f', str(args.pagina), '-l', str(args.pagina),
                                     str(args.pdf.resolve()), '-'], capture_output=True, check=True)
            print(layout.stdout.decode('utf-8'))
            blocos = [b for b in pagina.get_text('blocks') if b[6] == 0 and ' '.join(b[4].split()).startswith(inicio)]
            if len(blocos) != 1:
                raise ValueError('parágrafo ausente ou ambíguo: ' + str(len(blocos)) + ' blocos encontrados')
            b = blocos[0]
            print(json.dumps({'file': args.pdf.name, 'page': args.pagina, 'box': list(b[:4]),
                              'method': 'fitz', 'reference_method': 'layout', 'start': args.inicio,
                              'text': ' '.join(b[4].split())}, ensure_ascii=False, indent=2))
        return 0
    except (OSError, ValueError, ImportError, subprocess.CalledProcessError) as e:
        print('medir-pdf: ' + (str(e) if isinstance(e, ValueError) else 'não foi possível ler o PDF com fitz e pdftotext'), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main())
