"""Leituras comuns às conferências de arranque e à aterragem, sem mudar o Git."""
import importlib.util
import os
from pathlib import Path
import subprocess


def git(repo, *args, bruto=False):
    r = subprocess.run(['git', '-C', str(repo), *args], capture_output=True, text=True)
    if r.returncode:
        raise ValueError('git ' + args[0] + ' não conseguiu conferir a árvore')
    return r.stdout if bruto else r.stdout.strip()


def raiz(repo):
    repo = Path(repo).resolve()
    if Path(git(repo, 'rev-parse', '--show-toplevel')).resolve() != repo:
        raise ValueError('o caminho não é a raiz de uma worktree')
    return repo


def limpa(repo, todos=False):
    return not git(repo, 'status', '--porcelain', '--untracked-files=' + ('all' if todos else 'no'))


def antepassado(repo, ramo):
    r = subprocess.run(['git', '-C', str(repo), 'merge-base', '--is-ancestor',
                        'refs/heads/' + ramo, 'HEAD'], capture_output=True)
    return r.returncode == 0


def principal(repo, ramo):
    texto = git(repo, 'worktree', 'list', '--porcelain')
    for bloco in texto.split('\n\n'):
        linhas = bloco.splitlines()
        if 'branch refs/heads/' + ramo in linhas:
            return raiz(linhas[0].removeprefix('worktree '))
    raise ValueError('não há árvore principal no ramo ' + ramo)


def higienizar(texto, sitio, motor=None, principal_sitio=None):
    spec = importlib.util.spec_from_file_location('limpar_caminhos', Path(__file__).with_name('limpar-caminhos.py'))
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    trocas = modulo.caminhos_a_trocar(sitio, motor, None, None, os.environ.get('TMPDIR', '/tmp'))
    if principal_sitio:
        trocas[str(principal_sitio)] = '<worktree>'
    return modulo.substituir_texto(texto, trocas, None)
