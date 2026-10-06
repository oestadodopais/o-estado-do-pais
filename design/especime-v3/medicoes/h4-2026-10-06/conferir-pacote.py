#!/usr/bin/env python3
"""H4: confere os resumos das provas e retira caminhos locais dos registos.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py
Corre depois de os portões terminarem, antes de guardar o pacote no Git.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from executar import limpar

AQUI = Path(__file__).resolve().parent
RAIZ = Path.cwd()
PORTOES = AQUI / 'portoes'
comando = 'python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py'
cabeca = (PORTOES / 'cabeca').read_text().strip()
assert cabeca == (PORTOES / 'cabeca.fim').read_text().strip(), 'A cabeça mudou durante os portões.'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip() == cabeca, 'O pacote já não está na cabeça conferida.'
codigos = {g: int((PORTOES / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']}
assert all(c == 0 for c in codigos.values()), 'Há um portão vermelho.'

# Os códigos e as datas ficam intactos. Só os registos recebem a limpeza,
# incluindo os espaços no fim da linha que o terminal deixa no registo.
for p in AQUI.rglob('*.log'):
    original = p.read_text()
    limpo = '\n'.join(linha.rstrip() for linha in limpar(original).splitlines()).rstrip() + '\n'
    if limpo != original:
        p.write_text(limpo)

conferidos = {}
def conferir(caminho, esperado):
    real = hashlib.sha256(Path(caminho).read_bytes()).hexdigest()
    assert real == esperado, f'O resumo mudou: {caminho}'
    conferidos[caminho] = real

for nome in ['menu-a-390.json', 'menu-depois.json']:
    dados = json.loads((AQUI / nome).read_text())
    for m in dados['medidas']:
        conferir(m['captura'], m['sha256'])
capturas = json.loads((AQUI / 'capturas.json').read_text())
assert capturas['cabeca'] == cabeca, 'As capturas não são da cabeça dos portões.'
for c in capturas['capturas']:
    conferir(c['ficheiro'], c['sha256'])
    conferir(c['recorte'], c['sha256_recorte'])
for p in capturas['paginas']:
    conferir(p['copia'], p['sha256'])
    for f in p['folhas']:
        conferir('dist' + f['ficheiro'], f['sha256'])

relatorio = (AQUI / 'LEIA-ME.md').read_text()
for destino in re.findall(r'\]\(([^)]+)\)', relatorio):
    assert (AQUI / destino).exists(), f'Ligação sem ficheiro: {destino}'
achados = []
for p in AQUI.rglob('*'):
    if not p.is_file():
        continue
    try:
        conteudo = p.read_text()
    except UnicodeDecodeError:
        continue
    if limpar(conteudo) != conteudo:
        achados.append(p.relative_to(RAIZ).as_posix())
assert not achados, f'Caminhos locais por limpar: {achados}'
resultado = {
    'comando': comando, 'cabeca_codigo': cabeca, 'codigos': codigos,
    'ficheiros_conferidos': conferidos, 'achados_de_caminhos_locais': achados,
    'RESEARCHHUB_DIR_definido': bool(os.environ.get('RESEARCHHUB_DIR')),
    'pasta_motor_ao_lado_da_worktree': (RAIZ.parent / 'ResearchHub').exists(),
}
(AQUI / 'conferencia-pacote.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print(f'Pacote conferido: {len(conferidos)} resumos iguais, códigos lidos dos ficheiros e ligações resolvidas.')
