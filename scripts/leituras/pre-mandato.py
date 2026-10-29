#!/usr/bin/env python3
"""Exige a declaração do conteúdo e corre as duas medições antes do lançamento.

OEDP_ACRESCENTA=linhas|frases|nenhum, ou «Acrescenta: ...» no mandato.
Com linhas ou frases, OEDP_LINHA_IRMA identifica a linha usada nas listas.
OEDP_TITULO_IRMA e OEDP_FICHEIRO_IRMA são argumentos opcionais da medição.
"""
import os
from pathlib import Path
import re
import subprocess
import sys


def main(argv):
    if len(argv) != 2:
        print('uso: pre-mandato.py <worktree> <mandato.md>', file=sys.stderr)
        return 9
    sitio, mandato = map(Path, argv)
    try:
        texto = mandato.read_text(encoding='utf-8')
        m = re.search(r'^Acrescenta:\s*(linhas|frases|nenhum)\s*$', texto, re.M)
        modo = os.environ.get('OEDP_ACRESCENTA', m.group(1) if m else '').strip()
        if modo not in ('linhas', 'frases', 'nenhum'):
            raise ValueError('falta OEDP_ACRESCENTA=linhas|frases|nenhum ou o cabeçalho Acrescenta:')
        if m and m.group(1) != modo:
            raise ValueError('OEDP_ACRESCENTA contradiz o cabeçalho do mandato')
        if modo == 'nenhum':
            print('pré-mandato: não acrescenta linhas nem frases ao leitor', flush=True)
            return 0
        irma = os.environ.get('OEDP_LINHA_IRMA', '').strip()
        if not irma:
            raise ValueError('falta OEDP_LINHA_IRMA para medir as listas antes do lançamento')
        guioes = sitio / 'scripts/leituras'
        # As duas saídas ficam no registo do lançador, mesmo se a primeira falhar.
        a = subprocess.run(['sh', str(guioes / 'listas-de-uma-linha.sh'), str(sitio), irma,
                            os.environ.get('OEDP_TITULO_IRMA', ''), os.environ.get('OEDP_FICHEIRO_IRMA', '')])
        b = subprocess.run([sys.executable, str(guioes / 'voz-do-mandato.py'), str(sitio), str(mandato)])
        return 9 if a.returncode or b.returncode else 0
    except (OSError, ValueError) as e:
        print('pré-mandato: ' + (str(e) if isinstance(e, ValueError) else 'ficheiro ou guião ilegível'), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
