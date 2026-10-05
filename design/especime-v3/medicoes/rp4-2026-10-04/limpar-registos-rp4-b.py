#!/usr/bin/env python3
"""Retira apenas caminhos locais e códigos de cor dos registos da corrida terminada."""
import hashlib
import json
import pathlib
import re

O = pathlib.Path(__file__).resolve().parent
R = pathlib.Path.cwd()
ABSOLUTO = re.compile(r'(?<![A-Za-z0-9:/])/(?:opt|usr|Library|Applications|System|Volumes|var|private|etc|bin|sbin|home|root|Users|tmp)/[^\s"<>`\x1b]+')


def limpa(texto):
    texto = re.sub(r'\x1b\[[0-9;]*m', '', texto)
    texto = texto.replace(str(R), '<worktree>')
    texto = texto.replace(str(pathlib.Path.home()), '<pasta-pessoal>')
    texto = ABSOLUTO.sub('<caminho-local>', texto)
    return '\n'.join(l.rstrip() for l in texto.splitlines()).rstrip() + '\n'


assert '<caminho-local>' in limpa('/' + 'tmp' + '/ensaio')
assert limpa('texto \n\n') == 'texto\n'
hashes = []
ficheiros = list((O / 'portoes').glob('*.log')) + list(O.glob('rp4-b-*.log')) + [O / 'portoes/estado.fim']
for p in sorted(ficheiros):
    antes = p.read_bytes()
    depois = limpa(antes.decode()).encode()
    p.write_bytes(depois)
    hashes.append({'ficheiro': str(p.relative_to(R)), 'antes': hashlib.sha256(antes).hexdigest(),
                   'depois': hashlib.sha256(depois).hexdigest(), 'mudou': antes != depois})
(O / 'rp4-b-limpeza.json').write_text(json.dumps({'comando': 'python3 design/especime-v3/medicoes/rp4-2026-10-04/limpar-registos-rp4-b.py',
    'conhecido_positivo': {'caminho_temporario_retirado': True, 'texto_sem_caminho_conservado': True},
    'ficheiros': hashes}, ensure_ascii=False, indent=2) + '\n')
