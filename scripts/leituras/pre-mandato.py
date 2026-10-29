#!/usr/bin/env python3
"""Exige a declaração do conteúdo e corre as duas medições antes do lançamento.

O cabeçalho «Acrescenta: linhas|frases|linhas e frases|nada» é obrigatório.
OEDP_ACRESCENTA só pode acrescentar exigências; um valor vazio recusa.
Com linhas, OEDP_LINHA_IRMA identifica a linha usada nas listas.
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
        modos = {'nada': set(), 'linhas': {'linhas'}, 'frases': {'frases'}, 'linhas e frases': {'linhas', 'frases'}}
        cabecalhos = re.findall(r'^Acrescenta:[ \t]*(.*)$', texto, re.M)
        if len(cabecalhos) != 1 or cabecalhos[0].strip() not in modos:
            raise ValueError('falta um cabeçalho Acrescenta: válido e único no mandato')
        exigencias = modos[cabecalhos[0].strip()]
        if 'OEDP_ACRESCENTA' in os.environ:
            modo = os.environ.get('OEDP_ACRESCENTA', '').strip()
            if not modo:
                raise ValueError('OEDP_ACRESCENTA vazio: declaração ausente')
            if modo not in modos or not exigencias <= modos[modo]:
                raise ValueError('OEDP_ACRESCENTA não pode afrouxar o mandato')
            exigencias = modos[modo]
        if not exigencias:
            print('pré-mandato: não acrescenta linhas nem frases ao leitor', flush=True)
            return 0
        irma = os.environ.get('OEDP_LINHA_IRMA', '').strip()
        if 'linhas' in exigencias and not irma:
            raise ValueError('falta OEDP_LINHA_IRMA para medir as listas antes do lançamento')
        guioes = sitio / 'scripts/leituras'
        codigos = []
        if 'linhas' in exigencias:
            codigos.append(subprocess.run(['sh', str(guioes / 'listas-de-uma-linha.sh'), str(sitio), irma,
                            os.environ.get('OEDP_TITULO_IRMA', ''), os.environ.get('OEDP_FICHEIRO_IRMA', '')]).returncode)
        if 'frases' in exigencias:
            codigos.append(subprocess.run([sys.executable, str(guioes / 'voz-do-mandato.py'), str(sitio), str(mandato)]).returncode)
        return next((c if c > 0 else 128 - c for c in codigos if c), 0)
    except (OSError, ValueError) as e:
        print('pré-mandato: ' + (str(e) if isinstance(e, ValueError) else 'ficheiro ou guião ilegível'), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
