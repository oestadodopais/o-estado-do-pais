"""Repositórios descartáveis e comandos simulados, sem serviços externos."""
import os
from pathlib import Path
import subprocess

RAIZ = Path(__file__).resolve().parents[2]
GUIOES = RAIZ / 'scripts' / 'leituras'


def git(repo, *args, ok=True):
    r = subprocess.run(['git', '-C', str(repo), *args], capture_output=True, text=True,
                       env={**os.environ, 'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': os.devnull,
                            'GIT_AUTHOR_NAME': 'Ensaio', 'GIT_AUTHOR_EMAIL': 'ensaio@example.invalid',
                            'GIT_COMMITTER_NAME': 'Ensaio', 'GIT_COMMITTER_EMAIL': 'ensaio@example.invalid'})
    if ok:
        assert r.returncode == 0, (args, r.stdout, r.stderr)
    return r.stdout.strip()


def repo(pasta, ramo):
    pasta.mkdir()
    git(pasta, 'init', '-q', '-b', ramo)
    git(pasta, 'config', 'core.hooksPath', os.devnull)
    git(pasta, 'config', 'user.name', 'Ensaio')
    git(pasta, 'config', 'user.email', 'ensaio@example.invalid')
    (pasta / '.gitignore').write_text('node_modules/\n__pycache__/\n')
    (pasta / 'linha').write_text('base\n')
    commit(pasta, 'base')
    return pasta


def commit(pasta, mensagem):
    # Só nos repositórios temporários deste ensaio, nunca na worktree do construtor.
    git(pasta, 'add', '--', '.gitignore', 'linha')
    git(pasta, 'commit', '-qm', mensagem)


def worktree(pasta, destino, ramo='ensaio'):
    git(pasta, 'worktree', 'add', '-q', '-b', ramo, str(destino))
    return destino


def comando(pasta, nome, corpo):
    alvo = pasta / nome
    alvo.write_text('#!/usr/bin/env python3\n' + corpo)
    alvo.chmod(0o755)
    return alvo
