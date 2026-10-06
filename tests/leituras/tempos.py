#!/usr/bin/env python3
"""Prova o relógio na shell real do npm: ordem, ambiente e paragem no vermelho.
Uso: python3 tests/leituras/tempos.py. Só usa um pacote sintético temporário.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile

RAIZ = Path(__file__).resolve().parents[2]
with tempfile.TemporaryDirectory(prefix='oedp-tempos-') as tmp:
    p = Path(tmp)
    (p / 'cabeca').write_text('ensaio\n')
    (p / 'package.json').write_text(json.dumps({'scripts': {
        'build': 'npm run primeiro && npm run vermelho && npm run perdido',
        'primeiro': 'node primeiro.cjs', 'vermelho': 'node -e "console.error(\'ensaio: vermelho deliberado\');process.exit(7)"',
        'perdido': 'node -e "process.exit(0)"',
    }}))
    (p / 'primeiro.cjs').write_text("if(process.env.RESEARCHHUB_DIR!=='motor-de-ensaio')process.exit(3);\n")
    env = dict(os.environ, OEDP_TEMPOS_DIR=str(p), RESEARCHHUB_DIR='motor-de-ensaio',
               npm_config_script_shell=str(RAIZ / 'scripts/leituras/tempos-shell.py'))
    r = subprocess.run(['npm', 'run', 'build'], cwd=p, env=env, capture_output=True)
    assert r.returncode == 7, r.stderr
    assert b'ensaio: vermelho deliberado' in r.stderr
    subprocess.run(['node', str(RAIZ / 'scripts/leituras/tempos.mjs'), 'fechar', str(p)], check=True)
    dados = json.loads((p / 'tempos.json').read_text())
    passos = dados['passos']
    assert {x['passo'] for x in passos} == {'npm run primeiro', 'npm run vermelho', 'cadeia:build'}
    assert all(x['segundos'] > 0 and x['inicio'] <= x['fim'] for x in passos)
    assert [x['codigo'] for x in passos if x['passo'] == 'npm run vermelho'] == [7]
    assert dados['segundos'] > 0
    ligacao = p / 'relogio-por-ligacao.mjs'
    ligacao.symlink_to(RAIZ / 'scripts/leituras/tempos.mjs')
    (p / 'tempos.json').unlink()
    subprocess.run(['node', str(ligacao), 'fechar', str(p)], check=True)
    assert (p / 'tempos.json').is_file(), 'a chamada por ligação não escreveu tempos.json'
    assert json.loads((p / 'tempos.json').read_text()) == dados
    print('tempos: a chamada por ligação escreveu os mesmos tempos.json.')
    print('tempos: o ambiente chegou; o código 7 foi conservado; o passo seguinte não correu; cada passo tem início, fim e duração.')
