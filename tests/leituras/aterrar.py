#!/usr/bin/env python3
"""Prova a aterragem com todos os comandos externos substituídos por cópias locais.
Nenhum Git, GitHub, motor ou lançamento real é alterado. As recusas anteriores
continuam antes dos comandos de publicação. Uso: python3 tests/leituras/aterrar.py [--json ficheiro].
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

RAIZ = Path(__file__).resolve().parents[2]
casos = []
with tempfile.TemporaryDirectory(prefix='oedp-aterrar-') as tmp:
    p = Path(tmp); binario = p / 'bin'; binario.mkdir()
    repo = p / 'sitio'; repo.mkdir()
    def comando(nome, codigo):
        f = binario / nome
        f.write_text('#!/usr/bin/env python3\nimport json,os,sys\nfrom pathlib import Path\na=sys.argv[1:]\nwith open(os.environ["CHAMADAS"],"a") as f: f.write(json.dumps([Path(sys.argv[0]).name,*a])+"\\n")\n' + codigo)
        f.chmod(0o755)
    comando('git', '''
if 'worktree' in a: print('worktree '+os.environ['SITIO_DE_ENSAIO'])
elif 'branch' in a: print('main')
elif '--verify' in a:
    if os.environ['MODO']=='sem-ramo': sys.exit(1)
    print('a'*40)
elif 'merge-base' in a and os.environ['MODO'] in ('sem-main','sem-origin'):
    if ('origin/main' in a)==(os.environ['MODO']=='sem-origin'): sys.exit(1)
''')
    comando('gh', '''
if a[0]=='api':
    modo=os.environ['MODO']
    print(json.dumps({'check_runs': [] if modo=='sem-check' else [{'name':'portao','completed_at':'2026-10-06','conclusion':'failure' if modo=='vermelho' else 'success'}]}))
elif a[:2]==['run','list']: print('https://example.invalid/corrida-de-ensaio')
else: sys.exit(88)
''')
    comando('vercel', "print('Production Ready')\n")
    comando('curl', "print(json.dumps({'commit':'a'*40}))\n")
    comando('npm', "sys.exit(0)\n")
    mensagens = {'sem-ramo': 'não existe', 'cabeca-errada': 'e não bbbb',
                 'sem-main': 'a fusão não seria um avanço rápido',
                 'sem-origin': 'origin/main não está dentro',
                 'sem-check': 'não está verde (diz «nada»)',
                 'vermelho': 'não está verde (diz «failure»)', 'verde': 'ATERROU:'}
    for modo, esperado in [('sem-ramo',14),('cabeca-errada',15),('sem-main',16),('sem-origin',17),('sem-check',18),('vermelho',18),('verde',0)]:
        chamadas = p / 'chamadas'; chamadas.write_text('')
        env = dict(os.environ, PATH=str(binario)+':'+os.environ['PATH'], SITIO_DE_ENSAIO=str(repo), CHAMADAS=str(chamadas), MODO=modo, TMPDIR=str(p))
        r = subprocess.run(['zsh', str(RAIZ / 'scripts/aterrar.sh'), 'ramo-sintetico', 'bbbb' if modo=='cabeca-errada' else 'aaaa'], env=env, capture_output=True, text=True)
        assert r.returncode == esperado, (modo,r.stdout,r.stderr)
        assert mensagens[modo] in r.stdout, (modo, r.stdout)
        lidas = [json.loads(l) for l in chamadas.read_text().splitlines()]
        if esperado:
            assert not any('push' in c or '--ff-only' in c for c in lidas)
        else:
            assert any(c[:3]==['npm','run','verify:deploy'] for c in lidas)
            assert any(c[:3]==['gh','run','list'] for c in lidas)
            assert not any(c[:3]==['gh','run','watch'] for c in lidas)
            assert 'https://example.invalid/corrida-de-ensaio' in r.stdout
        casos.append({'planta': modo, 'codigo': r.returncode,
                      'mensagem': r.stdout.strip().splitlines()[-1].split(' · registos em ')[0], 'passou': True})
saida = {'ok': True, 'casos': casos}
if '--json' in sys.argv:
    Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(saida, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
