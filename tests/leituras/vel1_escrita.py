"""O registo da escrita vem dos processos reais e não sobrevive a um vermelho."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from apoio_ferramentas import RAIZ, repo

with tempfile.TemporaryDirectory(prefix='vel1-escrita-') as tmp:
    p = repo(Path(tmp) / 'arvore', 'ensaio')
    for f in ['scripts/verify-partes.mjs', 'scripts/verify-depois-do-build.mjs', 'scripts/alvos-fatias.mjs',
              'scripts/leituras/tempos.mjs', 'scripts/leituras/tempos-shell.py',
              'scripts/leituras/com-tranca.py', 'scripts/leituras/tranca.py']:
        alvo = p / f
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / f, alvo)
    primeiro = 'node -e "require(\'fs\').writeFileSync(\'primeiro\',\'sim\')"'
    segundo = 'node -e "require(\'fs\').writeFileSync(\'segundo\',\'sim\')"'
    def pacote(cadeia):
        (p / 'package.json').write_text(json.dumps({'scripts': {
            'build:conteudo': cadeia, 'build:escrever': cadeia}}))
    def correr():
        return subprocess.run(['node', 'scripts/verify-partes.mjs', 'construir'], cwd=p,
            env={**os.environ, 'OEDP_TRANCA': str(Path(tmp) / 'tranca')}, capture_output=True, text=True)
    pacote(primeiro + ' && ' + segundo)
    r = correr()
    assert r.returncode == 0, r.stdout + r.stderr
    registo = json.loads((p / 'at1-escrita.json').read_text())
    assert [c['passo'] for c in registo['corridos']] == [primeiro, segundo]
    assert all(c['codigo'] == 0 and c['segundos'] > 0 for c in registo['corridos'])
    assert len(registo['cabeca']) == 40 and len(registo['scripts']) == 64
    (p / 'segundo').unlink()
    pacote(primeiro + ' && node -e "process.exit(7)" && ' + segundo)
    r = correr()
    assert r.returncode != 0
    assert not (p / 'segundo').exists(), 'o passo depois do vermelho correu'
    assert not (p / 'at1-escrita.json').exists(), 'sobreviveu o registo de uma escrita anterior'
    print('VEL1 escrita real: ordem e códigos medidos; vermelho para o passo seguinte e elimina o recibo anterior')
