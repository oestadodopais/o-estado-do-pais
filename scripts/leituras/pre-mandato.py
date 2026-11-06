#!/usr/bin/env python3
"""Exige a declaração do conteúdo e corre as duas medições antes do lançamento.

O cabeçalho «Acrescenta: linhas|frases|linhas e frases|nada» é obrigatório.
OEDP_ACRESCENTA só pode acrescentar exigências; um valor vazio recusa.
Com linhas, OEDP_LINHA_IRMA identifica a linha usada nas listas.
OEDP_TITULO_IRMA e OEDP_FICHEIRO_IRMA são argumentos opcionais da medição.
"""
import json
import os
from pathlib import Path
import re
import subprocess
import sys


def numeros_do_zero(texto):
    """Contagens do §0, conservando a grafia para confronto com a medição."""
    secoes = re.findall(r'^## §0(.*?)(?=^#{1,2} |\Z)', texto, re.M | re.S)
    numeros = []
    for secao in secoes:
        # Mascara as citações e o código antes de procurar números.
        secao = re.sub(r'(`+).*?\1|«[^»]*»', lambda m: ' ' * len(m.group()), secao, flags=re.S)
        # As fronteiras evitam consumir a contagem que vem depois de uma data
        # ou identificador. Não se aceita um fragmento de um decimal ou grupo.
        padrao = (r'(?<![\w.:\-])(?<!\d,)\d+(?:[ \u202f]\d{3}(?!\d))*'
                  r'(?:,\d+)?(?![\w.:\-]|,\d|[ \u202f]\d{3}(?!\d))')
        for m in re.finditer(padrao, secao):
            valor = m.group()
            antes = secao[:m.start()]
            if re.search(r'(?:§\s*|\bregra(?:s)?\s+)$', antes, re.I):
                continue
            algarismos = re.sub(r'[ \u202f]', '', valor)
            if ',' not in valor and (len(algarismos) < 3 or
                                      (len(valor) == 4 and 1900 <= int(valor) <= 2099)):
                continue
            if valor not in numeros:
                numeros.append(valor)
    return numeros


def conferir_medidas(texto, mandato):
    numeros = numeros_do_zero(texto)
    cabecalho = re.split(r'^## ', texto, maxsplit=1, flags=re.M)[0]
    declaracoes = re.findall(r'^Medidas:[ \t]*(.*)$', cabecalho, re.M)
    if not declaracoes and not numeros:
        return
    if len(declaracoes) != 1 or not declaracoes[0].strip():
        raise ValueError('§0: falta um cabeçalho Medidas: válido e único; números: ' + ', '.join(numeros))
    relativo = Path(declaracoes[0].strip())
    if relativo.is_absolute():
        raise ValueError('§0: Medidas: tem de ser relativo à pasta do mandato')
    try:
        medidas = json.loads((mandato.parent / relativo).read_text(encoding='utf-8'))
    except (OSError, ValueError) as e:
        raise ValueError('§0: ficheiro de medidas ilegível; números: ' + ', '.join(numeros)) from e
    if not isinstance(medidas, dict):
        raise ValueError('§0: as medidas têm de ser um objeto JSON')
    erros, valores = [], set()
    for chave, medida in medidas.items():
        for campo in ('valor', 'comando'):
            if not isinstance(medida, dict) or not isinstance(medida.get(campo), str) or not medida[campo].strip():
                erros.append(f'{chave}: falta {campo} não vazio')
        if isinstance(medida, dict) and isinstance(medida.get('valor'), str):
            valores.add(medida['valor'])
    erros.extend('número sem medida: ' + n for n in numeros if n not in valores)
    if erros:
        raise ValueError('§0: ' + '; '.join(erros))


def main(argv):
    if len(argv) != 2:
        print('uso: pre-mandato.py <worktree> <mandato.md>', file=sys.stderr)
        return 9
    sitio, mandato = map(Path, argv)
    try:
        texto = mandato.read_text(encoding='utf-8')
        conferir_medidas(texto, mandato)
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
