#!/usr/bin/env python3
"""Retira caminhos locais dos registos, incluindo JSON comprimido, sem perder números.

Uso: python3 scripts/leituras/limpar-caminhos.py <pasta> --worktree <pasta>
     [--motor <pasta>] [--scratchpad <pasta>] [--casa <pasta>] [--utilizador <nome>]
O motor vem de RESEARCHHUB_DIR se omitido. A casa e o utilizador vêm do sistema.
Só reescreve UTF-8 alterado; binários ficam intactos e ligações simbólicas não
se seguem. Substitui primeiro os caminhos mais longos, reais e dados. É seguro
repetir: as marcas <worktree>, <motor>, <scratchpad>, <casa> e <utilizador>
não voltam a mudar. A pasta de saída nunca pode conter a worktree inteira.
"""
import argparse
import getpass
import gzip
import json
import os
from pathlib import Path
import re


def limpar(pasta, worktree, motor=None, scratchpad=None, casa=None, utilizador=None):
    pasta = Path(pasta).resolve(); worktree = Path(worktree).absolute()
    if pasta == worktree.resolve() or pasta in worktree.resolve().parents:
        raise ValueError('O limpador exige uma pasta de registos, não a árvore inteira.')
    trocas = {}
    for valor, marca in [(worktree,'worktree'),(motor,'motor'),(scratchpad,'scratchpad'),(casa or Path.home(),'casa')]:
        if valor:
            for p in [Path(valor).absolute(), Path(valor).resolve()]:
                if str(p) == '/': raise ValueError('Um caminho de substituição não pode ser a raiz.')
                trocas[str(p)] = '<'+marca+'>'
    mudados = []; binarios = 0
    for p in sorted(pasta.rglob('*')):
        if p.is_symlink() or not p.is_file(): continue
        dados = p.read_bytes()
        comprimido = p.suffix == '.gz'
        try:
            corpo = gzip.decompress(dados) if comprimido else dados
            texto = corpo.decode('utf-8')
            if '\0' in texto: raise UnicodeError('binário')
        except (UnicodeError, OSError, EOFError):
            binarios += 1; continue
        novo = texto
        for origem in sorted(trocas, key=len, reverse=True): novo = novo.replace(origem,trocas[origem])
        novo = re.sub('/'+'Users'+r'/[^/\s"\x1b]+','<casa>',novo)
        nome = utilizador if utilizador is not None else getpass.getuser()
        if nome: novo = novo.replace(nome,'<utilizador>')
        if novo != texto:
            corpo = novo.encode('utf-8')
            p.write_bytes(gzip.compress(corpo,mtime=0) if comprimido else corpo)
            mudados.append(p.relative_to(pasta).as_posix())
    return {'mudados':mudados,'binarios_conservados':binarios}


if __name__ == '__main__':
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument('pasta'); a.add_argument('--worktree',required=True)
    a.add_argument('--motor',default=os.environ.get('RESEARCHHUB_DIR'))
    a.add_argument('--scratchpad'); a.add_argument('--casa'); a.add_argument('--utilizador')
    print(json.dumps(limpar(**vars(a.parse_args())),ensure_ascii=False))
