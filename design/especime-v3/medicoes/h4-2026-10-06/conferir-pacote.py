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
import sys
from executar import limpar

AQUI = Path(__file__).resolve().parent
RAIZ = Path.cwd()
passagem_b = '--passagem-b' in sys.argv
passagem_c = '--passagem-c' in sys.argv
PORTOES = AQUI / ('portoes-c' if passagem_c else 'portoes-b' if passagem_b else 'portoes')
comando = 'python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py' + (' --passagem-c' if passagem_c else ' --passagem-b' if passagem_b else '')
cabeca = (PORTOES / 'cabeca').read_text().strip()
assert cabeca == (PORTOES / 'cabeca.fim').read_text().strip(), 'A cabeça mudou durante os portões.'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip() == cabeca, 'O pacote já não está na cabeça conferida.'
codigos = {g: int((PORTOES / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']}
aceitacao_cumprida = all(c == 0 for c in codigos.values())
falhas_tm4 = []

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

for nome in ['menu-a-390.json', 'menu-depois.json'] + (['menu-depois-antes.json'] if passagem_b or passagem_c else []):
    dados = json.loads((AQUI / nome).read_text())
    for m in dados['medidas']:
        conferir(m['captura'], m['sha256'])
    if nome == 'menu-a-390.json' and (passagem_b or passagem_c):
        depois = dados['depois']
        assert depois['cabeca'] == cabeca
        assert depois == json.loads((AQUI / 'menu-depois.json').read_text())
        for m in depois['medidas']:
            conferir(m['captura'], m['sha256'])
        if passagem_c:
            assert depois['construcao']['commit'] == cabeca
            assert {(m['lang'], m['largura']) for m in depois['medidas']} == {(l, w) for l in ['pt', 'en'] for w in [320, 360, 390, 430, 768]}
            for m in dados['depois_h4b']['medidas']:
                conferir(m['captura'], m['sha256'])
for nome in ['capturas.json'] + (['capturas-b.json'] if passagem_b or passagem_c else []) + (['capturas-c.json'] if passagem_c else []):
    capturas = json.loads((AQUI / nome).read_text())
    atual = nome == ('capturas-c.json' if passagem_c else 'capturas-b.json' if passagem_b else 'capturas.json')
    if atual:
        assert capturas['cabeca'] == cabeca, 'As capturas não são da cabeça dos portões.'
        assert not capturas['erros']
        if passagem_c:
            assert capturas['construcao']['commit'] == cabeca
            assert {(c['lang'], c['largura']) for c in capturas['capturas']} == {(l, w) for l in ['pt', 'en'] for w in [320, 360]}
    for c in capturas['capturas']:
        conferir(c['ficheiro'], c['sha256'])
        conferir(c['recorte'], c['sha256_recorte'])
    for p in capturas['paginas']:
        conferir(p['copia'], p['sha256'])
        for f in p['folhas']:
            conferir(f.get('copia', 'dist' + f['ficheiro']), f['sha256'])
if passagem_b:
    tm = json.loads((AQUI / 'tema-menu-b.json').read_text())
    assert tm['cabeca'] == tm['construcao']['commit'] == cabeca
    falhas_tm4 = tm['falhas']
    aceitacao_cumprida = aceitacao_cumprida and not falhas_tm4
    assert all(p['mordeu'] for p in tm['plantas'])
    for p in json.loads((AQUI / 'plantas-portoes-h4b.json').read_text()):
        assert p['passou'] and p['cabeca'] == cabeca
if passagem_c:
    tm = json.loads((AQUI / 'tema-menu-c.json').read_text())
    assert tm['cabeca'] == tm['construcao']['commit'] == cabeca
    assert tm['limites_linhas_telefone'] == {'320': 3, '360': 3, '390': 2, '430': 2}
    falhas_tm4 = tm['falhas']
    aceitacao_cumprida = aceitacao_cumprida and not falhas_tm4
    assert all(p['mordeu'] for p in tm['plantas'])
    novas = [p for p in tm['plantas'] if p['nome'] == 'quatro linhas a 320 px']
    assert len(novas) == 2 and all('o menu tem 4 linhas, e o máximo é três.' in p['queixa'] for p in novas)
    depois = json.loads((AQUI / 'menu-depois.json').read_text())
    for m in depois['medidas']:
        rota = '/' if m['lang'] == 'pt' else '/en/'
        celula = next(x for x in tm['medidas_menu'] if x['rota'] == rota and x['largura'] == m['largura'])
        assert m['portas'] == celula['portas'] == 7
        assert m['linhas'] == celula['topos'] <= tm['limites_linhas_telefone'].get(str(m['largura']), 1)
        assert m['sem_transbordo'] and celula['dentro'] and not celula['transborda']
        assert abs(m['gap'] - celula['gapBase']) < 0.1
        assert all(abs(g - celula['gapBase']) < 0.1 for g in m['folgas'])
        assert m['letra'] == celula['letraBase'] and m['espaco_das_letras'] == celula['espacoLetrasBase']
        assert all(c['altura'] >= 44 for c in m['caixas'])

saida = AQUI / ('conferencia-pacote-c.json' if passagem_c else 'conferencia-pacote-b.json' if passagem_b else 'conferencia-pacote.json')
relatorio = (AQUI / 'LEIA-ME.md').read_text()
for destino in re.findall(r'\]\(([^)]+)\)', relatorio):
    assert (AQUI / destino).exists() or (AQUI / destino) == saida, f'Ligação sem ficheiro: {destino}'
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
    'integridade_conferida': True, 'aceitacao_cumprida': aceitacao_cumprida, 'falhas_tm4': falhas_tm4,
    'ficheiros_conferidos': conferidos, 'achados_de_caminhos_locais': achados,
    'RESEARCHHUB_DIR_definido': bool(os.environ.get('RESEARCHHUB_DIR')),
    'pasta_motor_ao_lado_da_worktree': (RAIZ.parent / 'ResearchHub').exists(),
}
saida.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print(f'Integridade do pacote conferida: {len(conferidos)} resumos iguais, códigos lidos dos ficheiros e ligações resolvidas.')
print('Aceitação cumprida.' if aceitacao_cumprida else 'Aceitação por cumprir: há uma célula ou um portão vermelho.')
sys.exit(0 if aceitacao_cumprida else 1)
