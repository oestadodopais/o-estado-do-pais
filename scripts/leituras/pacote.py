#!/usr/bin/env python3
"""Montagem do pacote, chamada por pacote.sh depois da conferência dos números.

H2, M49: PACOTE_RETIRA filtra apenas o diff do sítio; PACOTE_MOTOR filtra o
motor inteiro (diff e ficheiros). Padrões fnmatch sobre o caminho relativo
completo, sensíveis a maiúsculas. Aspas interiores permitem espaços. As
cópias vêm dos objetos Git da cabeça, nunca da árvore de trabalho.
"""
import fnmatch
import os
from pathlib import Path, PurePosixPath
import shlex
import shutil
import subprocess
import sys


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), '-c', 'core.quotepath=off', *args])


def caminhos(repo, base, cabeca):
    # Sem renames: cada secção pertence a um só caminho, incluindo eliminações.
    return [os.fsdecode(p) for p in git(repo, 'diff', '--no-renames', '--name-only', '-z', base, cabeca).split(b'\0') if p]


def bate(caminho, padroes):
    return any(fnmatch.fnmatchcase(caminho, p) for p in padroes)


def relativo(caminho):
    p = PurePosixPath(caminho)
    if p.is_absolute() or '..' in p.parts or not p.parts:
        raise ValueError('O pacote só aceita caminhos relativos dentro da árvore.')
    return caminho


def copiar(repo, cabeca, f, destino):
    # Uma eliminação fica no diff, sem fabricar o ficheiro da cabeça.
    r = subprocess.run(['git', '-C', str(repo), 'cat-file', '-e', f'{cabeca}:{f}'], stderr=subprocess.DEVNULL)
    if r.returncode:
        return False
    alvo = destino / relativo(f)
    alvo.parent.mkdir(parents=True, exist_ok=True)
    alvo.write_bytes(git(repo, 'show', f'{cabeca}:{f}'))
    return True


def diferenca(repo, base, cabeca, f):
    # --literal-pathspecs impede que um nome real seja interpretado como glob.
    return subprocess.check_output(['git', '--literal-pathspecs', '-C', str(repo), '-c', 'core.quotepath=off',
                                    'diff', '--no-renames', base, cabeca, '--', f])


def principal():
    repo, base, cabeca, destino, brief, relatorio, numeros, *construidos = sys.argv[1:]
    repo_dado = repo
    repo, destino = Path(repo).resolve(), Path(destino)
    retira = shlex.split(os.environ.get('PACOTE_RETIRA', ''))
    motor = shlex.split(os.environ.get('PACOTE_MOTOR', ''))
    extra = shlex.split(os.environ.get('PACOTE_EXTRA', ''))
    if motor and len(motor) < 3:
        raise ValueError('PACOTE_MOTOR exige árvore, base e cabeça, seguidas dos padrões opcionais.')
    # Confere os dois intervalos antes de criar o pacote.
    mudados = caminhos(repo, base, cabeca)
    do_motor = caminhos(motor[0], motor[1], motor[2]) if motor else []
    rel_relatorio = os.path.relpath(Path(relatorio).resolve(), repo)
    destino.mkdir(parents=True, exist_ok=True)
    texto_numeros = Path(numeros).read_text().replace(repo_dado, '<sitio>').replace(str(repo), '<sitio>').replace(str(Path.home()), '<pasta-local>')
    (destino / 'numeros-do-relatorio.txt').write_text(texto_numeros)
    shutil.copyfile(brief, destino / 'brief.md')
    shutil.copyfile(relatorio, destino / 'relatorio-construtor.md')
    retirados, partes, copiados = [], [], 0
    for f in mudados:
        if f == rel_relatorio or bate(f, ['*.png', '*.jpg', '*.webp']):
            continue
        trecho = diferenca(repo, base, cabeca, f)
        if bate(f, retira):
            retirados.append((f, len(trecho.splitlines())))
        else:
            partes.append(trecho)
        copiados += copiar(repo, cabeca, f, destino)
    (destino / 'diff.patch').write_bytes(b''.join(partes))
    if retira:
        tabela = ['# Retirado do diff do pacote', '',
                  'Padrões de PACOTE_RETIRA: ' + ', '.join(f'`{p}`' for p in retira) + '.', '',
                  'Só saem do diff. Os ficheiros existentes na cabeça ficam inteiros nos seus caminhos; as eliminações não têm cópia.', '',
                  '| caminho | linhas retiradas do diff |', '|---|---|']
        tabela += [f'| `{f.replace("|", "&#124;")}` | {n} |' for f, n in retirados]
        (destino / 'RETIRADO-DO-PACOTE.md').write_text('\n'.join(tabela)+'\n')
    n_extra = 0
    for e in extra:
        for f in git(repo, 'ls-tree', '-r', '--name-only', '-z', cabeca, '--', relativo(e)).split(b'\0'):
            if f:
                n_extra += copiar(repo, cabeca, os.fsdecode(f), destino)
    n_motor = 0
    if motor:
        pasta = destino / 'motor'
        pasta.mkdir(parents=True, exist_ok=True)
        excluidos = motor[3:]
        linha = '# Motor: diff sem os caminhos que casam com ' + (', '.join(excluidos) if excluidos else '(nenhum padrão)') + '.\n'
        partes_motor = [linha.encode()]
        for f in do_motor:
            if bate(f, excluidos):
                continue
            partes_motor.append(diferenca(motor[0], motor[1], motor[2], f))
            n_motor += copiar(motor[0], motor[2], f, pasta)
        (pasta / 'diff.patch').write_bytes(b''.join(partes_motor))
    for f in construidos:
        alvo = destino / 'built' / relativo(f)
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(repo / 'dist' / f, alvo)
    print(f'Pacote: {copiados} ficheiros mudados, {n_extra} extra, {len(retirados)} secções retiradas, {n_motor} ficheiros do motor, {len(construidos)} páginas construídas.')


if __name__ == '__main__':
    principal()
