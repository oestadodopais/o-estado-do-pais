#!/usr/bin/env python3
"""Exige HTML limpo, planta os estragos bloqueados e confere a reposição."""
import hashlib
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

B = Path(__file__).resolve().parent
R = B.parents[3]
cabeca = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=R, text=True).strip()


def correr(nome, comando):
    inicio = datetime.now(timezone.utc).isoformat()
    with (B / f'{nome}.log').open('w') as f:
        r = subprocess.run(comando, cwd=R, stdout=f, stderr=subprocess.STDOUT,
                           env={**os.environ, 'OEDP_MEDICOES': str(B)})
    registo = {'comando': comando, 'codigo': r.returncode, 'inicio': inicio,
               'fim': datetime.now(timezone.utc).isoformat(), 'cabeca': cabeca,
               'log': f'{nome}.log', 'sha256_log': hashlib.sha256((B / f'{nome}.log').read_bytes()).hexdigest()}
    (B / f'{nome}.json').write_text(json.dumps(registo, ensure_ascii=False, indent=2) + '\n')
    if r.returncode:
        raise SystemExit(f'{nome}: código {r.returncode}; ver o log')
    return registo


base = correr('correcao-html-limpo', ['node', 'scripts/gate-html.mjs'])
casos = []
for nome in ('b2-contagens-das-camaras', 'b2-selo-do-cartao'):
    correr(f'correcao-{nome}', ['node', 'tests/pais/portoes.mjs', '--only', nome])
    planta = json.loads((B / f'plantas-portoes-{nome}.json').read_text())[0]
    assert planta['passou'] and planta['codigo'] == 1
    casos.append({'nome': nome, 'executada': True, 'mordida_provada': True,
                  'registo': f'plantas-portoes-{nome}.json'})
reposicao = correr('correcao-html-reposto', ['node', 'scripts/gate-html.mjs'])
(B / 'plantas-bloqueadas.json').write_text(json.dumps({
    'cabeca': cabeca, 'estatuto': 'executadas, com base limpa e reposição conferida',
    'portao': 'node scripts/gate-html.mjs', 'base': base, 'reposicao': reposicao, 'casos': casos,
    'diagnostico_anterior': 'correcao/plantas-bloqueadas.json',
}, ensure_ascii=False, indent=2) + '\n')
print('Plantas desbloqueadas: mordidas provadas e HTML limpo depois da reposição.')
