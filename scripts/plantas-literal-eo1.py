#!/usr/bin/env python3
"""Executa as três recusas do literal e guarda cada código real, sem caminhos locais."""
import argparse
from pathlib import Path
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--motor', type=Path, required=True)
parser.add_argument('--saida', type=Path, required=True)
args = parser.parse_args()
raiz = Path(__file__).resolve().parent.parent
motor = args.motor.resolve()
saida = args.saida.resolve()
saida.mkdir(parents=True, exist_ok=True)
comandos = [
    ('literal-compositor', ['python3', '-m', 'core.compor_livros_test', '--plant', 'compositor'], motor),
    ('literal-validador', ['python3', '-m', 'core.compor_livros_test', '--plant', 'validador'], motor),
    ('literal-html', ['node', 'tests/eo1/documento.mjs', '--planta-literal'], raiz),
]
erros = []
for nome, comando, pasta in comandos:
    resultado = subprocess.run(comando, cwd=pasta, text=True, capture_output=True)
    texto = resultado.stdout + resultado.stderr
    for origem, substituto in [(str(motor), '<motor>'), (str(raiz), '<worktree>'),
                               (tempfile.gettempdir(), '<temporario>')]:
        texto = texto.replace(origem, substituto)
    (saida / (nome + '.log')).write_text(texto, encoding='utf-8')
    (saida / (nome + '.codigo')).write_text(str(resultado.returncode) + '\n', encoding='utf-8')
    certo = resultado.returncode == 1 and ('Recus' in texto or 'recus' in texto)
    print(f'{nome}: código {resultado.returncode}; ' + ('planta recusada' if certo else 'resultado inesperado'))
    if not certo:
        erros.append(nome)
raise SystemExit(1 if erros else 0)
