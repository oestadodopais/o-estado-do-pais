#!/usr/bin/env python3
"""Os dois pedidos das capturas do bloco ME1, para `scripts/leituras/captar.mjs`, presos à cabeça de `dist/version.json`.

O Método nas duas edições, com os recortes da primeira secção, da secção da conferência e da forma; a primeira página
e o Sobre, com o rótulo do topo e a porta do Sobre. O guião das capturas tira as cinco larguras de cada página pedida.
uso: python3 pedido-das-capturas.py <dist> <pasta dos pedidos>"""
import json, pathlib, sys
dist, pasta = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
cabeca = json.loads((dist / 'version.json').read_text())['commit']
pasta.mkdir(parents=True, exist_ok=True)
metodo = {'cabeca': cabeca, 'paginas': [{'nome': 'metodo', 'pt': '/metodo/', 'en': '/en/method/', 'recortes': [
    {'nome': 'quem-escreve', 'seletor': 'section#politica-de-ia'},
    {'nome': 'como-se-confere', 'seletor': 'section#releitura'},
    {'nome': 'a-forma', 'seletor': 'section#a-forma'}]}]}
outras = {'cabeca': cabeca, 'paginas': [
    {'nome': 'primeira', 'pt': '/', 'en': '/en/', 'recortes': [{'nome': 'rotulo', 'seletor': '[data-rotulo-ia="topo"]'}]},
    {'nome': 'sobre', 'pt': '/sobre/', 'en': '/en/about/', 'recortes': [{'nome': 'porta', 'seletor': 'p.sobre-porta'}]}]}
(pasta / 'pedido-metodo.json').write_text(json.dumps(metodo, indent=1) + '\n')
(pasta / 'pedido-primeira-e-sobre.json').write_text(json.dumps(outras, indent=1) + '\n')
print(cabeca)
