#!/usr/bin/env python3
"""Retira caminhos locais dos registos, incluindo JSON comprimido, sem perder números.

Uso: python3 scripts/leituras/limpar-caminhos.py <pasta> --worktree <pasta>
     [--motor <pasta>] [--scratchpad <pasta>] [--casa <pasta>] [--utilizador <nome>]
O motor vem de RESEARCHHUB_DIR se omitido; o bloco de notas, de OEDP_SCRATCHPAD,
e a pasta temporária, de TMPDIR. A casa e o utilizador vêm do sistema.
Só reescreve UTF-8 alterado; binários ficam intactos e ligações simbólicas não
se seguem. Substitui primeiro os caminhos mais longos, reais e dados. É seguro
repetir: as marcas <worktree>, <motor>, <temporario>, <scratchpad>, <casa> e <utilizador>
não voltam a mudar. A pasta de saída nunca pode conter a worktree inteira.
"""
import argparse
import getpass
import gzip
import json
import os
from pathlib import Path
import re


def caminhos_a_trocar(worktree, motor, scratchpad, casa, temporario):
    valores = [(worktree, 'worktree'), (motor, 'motor'), (scratchpad, 'scratchpad'),
               (casa or Path.home(), 'casa'), (temporario, 'temporario')]
    trocas = {}
    for valor, marca in valores:
        if not valor:
            continue
        # As duas formas cobrem caminhos que atravessam ligações do sistema.
        for caminho in (Path(valor).absolute(), Path(valor).resolve()):
            if str(caminho) == '/':
                raise ValueError('Um caminho de substituição não pode ser a raiz.')
            trocas[str(caminho)] = '<' + marca + '>'
    return trocas


def substituir_texto(texto, trocas, utilizador):
    novo = texto
    # O caminho específico precede a casa ou a pasta temporária que o contém.
    for origem in sorted(trocas, key=len, reverse=True):
        padrao = re.escape(origem) + r'(?=/|$|[\s"\'<>:,;()\[\]{}])'
        novo = re.sub(padrao, lambda _: trocas[origem], novo)
    # Outros processos podem ter usado pastas temporárias fora do TMPDIR atual.
    novo = re.sub(r'/(?:private/)?var/folders/[^\s"\'<>:\x1b]+|/(?:private/)?tmp/[^\s"\'<>:\x1b]+', '<temporario>', novo)
    novo = re.sub('/' + 'Users' + r'/[^/\s"\x1b]+', '<casa>', novo)
    # O nome só identifica a máquina quando é um componente de caminho.
    if utilizador:
        novo = re.sub(r'(?<=/)' + re.escape(utilizador) + r'(?=/)', '<utilizador>', novo)
    return novo


def ler_texto(caminho):
    dados = caminho.read_bytes()
    corpo = gzip.decompress(dados) if caminho.suffix == '.gz' else dados
    texto = corpo.decode('utf-8')
    if '\0' in texto:
        raise UnicodeError('binário')
    return texto


def limpar(pasta, worktree, motor=None, scratchpad=None, casa=None, utilizador=None, temporario=None):
    pasta = Path(pasta).resolve()
    worktree = Path(worktree).absolute()
    if pasta == worktree.resolve() or pasta in worktree.resolve().parents:
        raise ValueError('O limpador exige uma pasta de registos, não a árvore inteira.')
    trocas = caminhos_a_trocar(worktree, motor, scratchpad or os.environ.get('OEDP_SCRATCHPAD'),
                              casa, temporario or os.environ.get('TMPDIR'))
    nome = utilizador if utilizador is not None else getpass.getuser()
    mudados = []
    binarios = 0
    for caminho in sorted(pasta.rglob('*')):
        # Nunca se escreve fora da pasta por uma ligação simbólica.
        if caminho.is_symlink() or not caminho.is_file():
            continue
        try:
            texto = ler_texto(caminho)
        except (UnicodeError, OSError, EOFError):
            binarios += 1
            continue
        novo = substituir_texto(texto, trocas, nome)
        if novo == texto:
            continue
        corpo = novo.encode('utf-8')
        # A data fixa do gzip torna a limpeza repetível, sem alterar o conteúdo.
        caminho.write_bytes(gzip.compress(corpo, mtime=0) if caminho.suffix == '.gz' else corpo)
        mudados.append(caminho.relative_to(pasta).as_posix())
    return {'mudados': mudados, 'binarios_conservados': binarios}


def principal():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pasta')
    parser.add_argument('--worktree', required=True)
    parser.add_argument('--motor', default=os.environ.get('RESEARCHHUB_DIR'))
    parser.add_argument('--scratchpad', default=os.environ.get('OEDP_SCRATCHPAD'))
    parser.add_argument('--temporario', default=os.environ.get('TMPDIR'))
    parser.add_argument('--casa')
    parser.add_argument('--utilizador')
    print(json.dumps(limpar(**vars(parser.parse_args())), ensure_ascii=False))


if __name__ == '__main__':
    principal()
