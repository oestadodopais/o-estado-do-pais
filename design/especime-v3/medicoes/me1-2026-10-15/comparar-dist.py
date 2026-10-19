#!/usr/bin/env python3
"""O `dist/` de agora contra o manifesto do `dist/` de outra cabeça (o sha256 de cada ficheiro), para provar o que
mudou nas páginas construídas entre as duas.

Na passagem do ME1-21 (15.10.2026), as conferências com o motor e as capturas não correram outra vez: correram na
cabeça do código da passagem de correção, `93a884f6`, e só valem para a cabeça nova se o livro-razão e as páginas
construídas não mudaram. O manifesto de antes foi tirado do `dist/` de `93a884f6` antes de a construção nova o
substituir; este guião tira o de agora, compara-os ficheiro a ficheiro e escreve a lista do que difere. O conhecido-
positivo é duplo: o `version.json`, que diz a cabeça, tem de diferir; e uma cópia do manifesto de antes com um
sha256 estragado na página do Método tem de ser apanhada.

uso: python3 comparar-dist.py <manifesto de antes.json> <cabeça de antes> <dist> <saída.json>"""
import hashlib, json, os, sys

MANIFESTO, CABECA_ANTES, DIST, SAIDA = sys.argv[1:5]
antes = json.load(open(MANIFESTO, encoding='utf-8'))
agora = {}
for d, _, fs in os.walk(DIST):
    for f in fs:
        p = os.path.join(d, f)
        with open(p, 'rb') as h:
            agora[os.path.relpath(p, DIST)] = hashlib.sha256(h.read()).hexdigest()
resumo = lambda m: hashlib.sha256(json.dumps(m, sort_keys=True).encode('utf-8')).hexdigest()

def compara(a, b):
    comuns = sorted(set(a) & set(b))
    return {'iguais': sum(1 for k in comuns if a[k] == b[k]),
            'diferentes': [k for k in comuns if a[k] != b[k]],
            'so_antes': sorted(set(a) - set(b)), 'so_agora': sorted(set(b) - set(a))}

r = compara(antes, agora)
estragado = dict(antes)
alvo = 'metodo/index.html'
estragado[alvo] = ('0' if estragado[alvo][0] != '0' else '1') + estragado[alvo][1:]
rp = compara(estragado, agora)
cabeca_agora = json.load(open(os.path.join(DIST, 'version.json'), encoding='utf-8')).get('commit')
out = {
    'antes': {'cabeca': CABECA_ANTES, 'ficheiros': len(antes), 'resumo_do_manifesto': resumo(antes)},
    'agora': {'cabeca': cabeca_agora, 'ficheiros': len(agora), 'resumo_do_manifesto': resumo(agora)},
    'iguais': r['iguais'], 'diferentes': r['diferentes'], 'so_antes': r['so_antes'], 'so_agora': r['so_agora'],
    'paginas_html_diferentes': [k for k in r['diferentes'] if k.endswith('.html')],
    'comando': 'python3 design/especime-v3/medicoes/me1-2026-10-15/comparar-dist.py <manifesto do dist de antes> <cabeça de antes> dist <saída>',
    'conhecido_positivo': {
        'o_que': 'o version.json, que diz a cabeça, difere; e o manifesto de antes com o sha256 da página do Método estragado é apanhado nessa página',
        'version_json_difere': 'version.json' in r['diferentes'],
        'estrago_apanhado': alvo in rp['diferentes'],
        'encontrado': 'version.json' in r['diferentes'] and alvo in rp['diferentes'],
    },
}
with open(SAIDA, 'w', encoding='utf-8') as h:
    json.dump(out, h, ensure_ascii=False, indent=1)
    h.write('\n')
print(json.dumps({k: (v if not isinstance(v, list) else len(v)) for k, v in out.items() if k not in ('comando', 'conhecido_positivo')}, ensure_ascii=False))
print('diferentes:', r['diferentes'][:20])
print('conhecido-positivo:', out['conhecido_positivo']['encontrado'])
