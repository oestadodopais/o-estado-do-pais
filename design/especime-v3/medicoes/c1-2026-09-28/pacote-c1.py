#!/usr/bin/env python3
"""Monta a entrega para leitura a frio a partir da cabeça e da construção selada."""
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import sys
sys.dont_write_bytecode = True

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
spec = importlib.util.spec_from_file_location('medir_c1', AQUI / 'medir-c1.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
logspec = importlib.util.spec_from_file_location('registar_c1', AQUI / 'registar-c1.py')
log = importlib.util.module_from_spec(logspec)
logspec.loader.exec_module(log)

cabeca = m.git('rev-parse', 'HEAD')
medidas = m.ler('medidas.json')
assert all(p['codigo'] == 0 for p in medidas['portoes'].values()) and len(medidas['portoes']) == 3
assert m.git('rev-parse', 'HEAD^') == medidas['portoes']['build']['cabeca']
assert json.loads((RAIZ / 'dist/version.json').read_text())['commit'] == medidas['portoes']['build']['cabeca']
for copia in m.ler('paginas-depois/INDICE.json')['copias'].values():
    relativo = copia['rota'].lstrip('/') + 'index.html' if 'rota' in copia else copia['origem'].lstrip('/')
    assert m.sha(RAIZ / 'dist' / relativo) == copia['sha256'], 'A construção mudou depois das capturas.'
destino = Path(tempfile.mkdtemp(prefix='oedp-c1-pacote-'))
resultado = subprocess.run(['sh', 'scripts/leituras/pacote.sh', str(RAIZ), m.BASE, cabeca,
    str(destino), str(RAIZ / 'design/observatorio/BRIEF-C1-as-correcoes-de-confianca.md'),
    str(AQUI / 'LEIA-ME.md'), 'index.html', 'en/index.html', 'temas/index.html',
    'en/themes/index.html', 'lugares/index.html', 'en/places/index.html',
    'municipios/evora/index.html', 'en/municipalities/evora/index.html',
    'livro-razao/ipc-variacao-homologa/index.html', 'en/ledger/ipc-variacao-homologa/index.html',
    'livro-razao/divida-das-familias-2025-ue/index.html', 'en/ledger/divida-das-familias-2025-ue/index.html',
    'livro-razao/pib-real-per-capita-2025/index.html', 'en/ledger/pib-real-per-capita-2025/index.html'],
    cwd=RAIZ, capture_output=True, text=True)
(destino / 'montagem.log').write_text(log.publico(resultado.stdout + resultado.stderr))
assert resultado.returncode == 0, 'A montagem falhou; a saída sanitizada ficou no pacote.'
# O guião comum exclui imagens do diff. A entrega visual é copiada pelo seu selo.
shutil.copytree(AQUI / 'capturas', destino / AQUI.relative_to(RAIZ) / 'capturas')
(destino / 'motor').mkdir(exist_ok=True)
(destino / 'motor/diff.patch').write_text(m.git('diff', m.MOTOR_BASE, 'HEAD', cwd=m.MOTOR))
for f in m.git('diff', '--name-only', m.MOTOR_BASE, 'HEAD', cwd=m.MOTOR).splitlines():
    p = destino / 'motor' / f
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes((m.MOTOR / f).read_bytes())
# Expõe as folhas e fontes da construção que as páginas citam, sem pedidos externos.
for nome in ['_astro', 'fonts']:
    if (RAIZ / 'dist' / nome).is_dir(): shutil.copytree(RAIZ / 'dist' / nome, destino / 'built' / nome, dirs_exist_ok=True)
ficheiros = [p for p in destino.rglob('*') if p.is_file()]
achados = [str(p.relative_to(destino)) for p in ficheiros if m.tem_caminho(p.read_bytes())]
assert not achados, 'O pacote contém caminhos locais.'
prova = {'cabeca_sitio': cabeca, 'cabeca_motor': m.git('rev-parse', 'HEAD', cwd=m.MOTOR),
         'cabeca_construida': medidas['portoes']['build']['cabeca'],
         'ficheiros': len(ficheiros), 'caminhos_locais': len(achados),
         'conteudo': {str(p.relative_to(destino)): m.sha(p) for p in ficheiros}}
(destino / 'PACOTE.json').write_text(json.dumps(prova, ensure_ascii=False, indent=2) + '\n')
# Só o nome portável, nunca o caminho da máquina.
print(json.dumps({'pasta_temporaria': destino.name, 'ficheiros': len(ficheiros), 'cabeca': cabeca, 'caminhos_locais':len(achados)}, ensure_ascii=False))
