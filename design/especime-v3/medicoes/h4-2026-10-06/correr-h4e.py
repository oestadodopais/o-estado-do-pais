#!/usr/bin/env python3
"""Corre as provas da passagem H4-e na mesma cabeça, sem mudar ficheiros seguidos (os portões inteiros
correm na corrida portão do GitHub nessa cabeça, e não aqui; a L3 deixou de ter plantas próprias porque a
exceção H4-6 saiu com a palavra).
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/correr-h4e.py
Os resultados ficam numa pasta ignorada durante as plantas e as capturas, para
que git status --porcelain esteja vazio no início e no fim de cada prova.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
from executar import limpar

RAIZ = Path.cwd()
AQUI = Path(__file__).resolve().parent.relative_to(RAIZ)
CAP = Path('design/especime-v3/capturas/h4-2026-10-06/passagem-e')
PALCO = Path('.claude/h4e/provas')


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def limpa():
    estado = git('status', '--porcelain')
    if estado:
        raise RuntimeError('A H4-e exige a árvore limpa: ' + limpar(estado))
    return estado


def guardar(f, dados):
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')


cabeca = git('rev-parse', 'HEAD')
estado = limpa()
assert not PALCO.exists(), 'Já há provas nesta pasta; conserve-as antes de repetir.'
(PALCO / AQUI).mkdir(parents=True)
ambiente = dict(os.environ, ASTRO_TELEMETRY_DISABLED='1',
                npm_config_cache=str(RAIZ / '.claude/h4e/npm-cache'),
                OEDP_TEMA_MENU_JSON=str(PALCO / AQUI / 'tema-menu-e.json'),
                OEDP_H4_PROVAS=str(PALCO), OEDP_EXIGIR_ARVORE_LIMPA='1')
registos = []


def correr(nome, comando, exigir_limpa=True):
    antes = limpa() if exigir_limpa else git('status', '--porcelain', '--untracked-files=no')
    assert git('rev-parse', 'HEAD') == cabeca
    inicio = time.time()
    with (PALCO / AQUI / f'{nome}.log').open('w') as log:
        processo = subprocess.Popen(comando, env=ambiente, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        for linha in processo.stdout:
            log.write(limpar(linha).rstrip() + '\n')
            log.flush()
        codigo = processo.wait()
    (PALCO / AQUI / f'{nome}.codigo').write_text(f'{codigo}\n')
    depois = limpa() if exigir_limpa else git('status', '--porcelain', '--untracked-files=no')
    assert git('rev-parse', 'HEAD') == cabeca
    registos.append({'nome': nome, 'comando': limpar(' '.join(comando)), 'cabeca': cabeca,
                     'estado_inicio': antes, 'estado_fim': depois, 'codigo': codigo,
                     'duracao_segundos': round(time.time() - inicio, 3)})
    guardar(PALCO / AQUI / 'corridas-e.json', {'cabeca': cabeca, 'estado_inicial': estado, 'corridas': registos})
    print(f'{nome}: código {codigo}', flush=True)
    if codigo:
        raise RuntimeError(f'{nome}: código {codigo}; consultar o registo.')


correr('inventario-e', ['node', str(AQUI / 'inventario-politica-h4e.mjs'), '--confere'])
correr('politica-e', ['node', str(AQUI / 'provar-politica-e.mjs'), '--passagem-e'])
ambiente['OEDP_MEDICOES'] = str(PALCO / AQUI / 'n1-e')
(PALCO / AQUI / 'n1-e').mkdir()
correr('n1-e', ['node', 'tests/pais/portoes.mjs', '--prefixo', 'h4b-'])
correr('capturas-e-corrida', ['node', str(AQUI / 'captar-h4-e.mjs'), '--passagem-e'])
limpa()
# Retira caminhos locais antes de copiar qualquer resultado para a pasta pública.
for p in PALCO.rglob('*'):
    if not p.is_file():
        continue
    try:
        texto = p.read_text()
    except UnicodeDecodeError:
        continue
    limpo = limpar(texto).replace(str(PALCO) + '/', '')
    if p.suffix == '.log':
        limpo = '\n'.join(l.rstrip() for l in limpo.splitlines()) + '\n'
    if limpo != texto:
        p.write_text(limpo)
for origem, destino in [(PALCO / AQUI, AQUI), (PALCO / CAP, CAP)]:
    shutil.copytree(origem, destino, dirs_exist_ok=True)
print('Plantas e capturas da H4-e na cabeça do código; provas copiadas para as pastas da entrega.', flush=True)
