#!/usr/bin/env python3
"""Exige a declaração do conteúdo e corre as duas medições antes do lançamento.

O cabeçalho «Acrescenta: linhas|frases|linhas e frases|nada» é obrigatório.
Frases: <lista.json> é relativo à pasta do mandato e pode repetir-se.
Cada lista passa pela camada 0, mesmo quando Acrescenta: nada.
OEDP_ACRESCENTA só pode acrescentar exigências; um valor vazio recusa.
Com linhas, OEDP_LINHA_IRMA identifica a linha usada nas listas.
OEDP_TITULO_IRMA e OEDP_FICHEIRO_IRMA são argumentos opcionais da medição.
"""
import argparse
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
        # As datas têm precedência sobre os decimais. A máscara impede também
        # que uma data ou referência absorva a contagem que se lhe segue.
        excecoes = (r'(?<![\w.])(?:\d{4}-\d{2}-\d{2}|\d{2}\.\d{2}(?:\.\d{4})?'
                    r'|\d{2}:\d{2}(?::\d{2})?|§\s*\d+(?:\.\d+)*)'
                    r'(?!\w|[.,:]\d)')
        secao = re.sub(excecoes, lambda m: ' ' * len(m.group()), secao)
        # Consome o candidato inteiro antes de conferir a forma e a fronteira;
        # nunca aproveita só um fragmento de um número colado a uma letra.
        padrao = r'(?<![\w.,:;\-])\d+(?:[.,:]\d+|[ \u00a0\u202f]\d{3}(?!\d))*'
        forma = r'(?:\d+(?:[ \u00a0\u202f]\d{3}|\.\d{3})*(?:,\d+)?|\d+\.\d+)'
        for m in re.finditer(padrao, secao):
            valor = m.group()
            antes, depois = secao[:m.start()], secao[m.end():]
            if not re.fullmatch(forma, valor) or re.match(r'[\w\-]', depois):
                continue
            if depois[:1] in ('.', ',', ';', ':') and len(depois) > 1 and not depois[1].isspace():
                continue
            if re.search(r'(?:§\s*|\bregra(?:s)?\s+)$', antes, re.I):
                continue
            algarismos = re.sub(r'\D', '', valor)
            if ',' not in valor and (len(algarismos) < 3 or
                                      (valor.isdigit() and len(valor) == 4 and 1900 <= int(valor) <= 2099)):
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


def cabecalho_do_mandato(texto):
    primeira = True
    posicao = 0
    for linha in texto.splitlines(keepends=True):
        if re.match(r'^#{1,6}\s', linha):
            if not (primeira and linha.startswith('# ')):
                return texto[:posicao]
        if linha.strip():
            primeira = False
        posicao += len(linha)
    return texto


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sitio', type=Path)
    parser.add_argument('mandato', type=Path)
    parser.add_argument('--aplicada', action='store_true')
    parser.add_argument('--dist', type=Path)
    args = parser.parse_args(argv)
    sitio, mandato = args.sitio, args.mandato
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
        guioes = sitio / 'scripts/leituras'
        codigos = []
        cabecalho = cabecalho_do_mandato(texto)
        if re.search(r'^Frases:', texto[len(cabecalho):], re.M):
            raise ValueError('Frases: fora do cabeçalho do mandato')
        for declaracao in re.findall(r'^Frases:[ \t]*(.*)$', cabecalho, re.M):
            relativo = Path(declaracao.strip())
            if not declaracao.strip() or relativo.is_absolute():
                raise ValueError('Frases: tem de ser um caminho relativo à pasta do mandato')
            lista = (mandato.parent / relativo).resolve()
            codigos.append(subprocess.run(['node', str((guioes / 'conferir-frases.mjs').resolve()),
                                           str(lista), *([str(args.dist.resolve())] if args.dist else []),
                                           *(['--aplicada'] if args.aplicada else [])], cwd=sitio).returncode)
        if not exigencias:
            print('pré-mandato: não acrescenta linhas nem frases ao leitor', flush=True)
            return next((c if c > 0 else 128 - c for c in codigos if c), 0)
        irma = os.environ.get('OEDP_LINHA_IRMA', '').strip()
        if 'linhas' in exigencias and not irma:
            raise ValueError('falta OEDP_LINHA_IRMA para medir as listas antes do lançamento')
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
