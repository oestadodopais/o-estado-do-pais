#!/usr/bin/env python3
"""As frases do mandato ME1, lidas do mandato e não datilografadas (a regra 14 do CLAUDE.md).

Lê `design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md` e escreve, em JSON, as frases que o leitor vê,
secção a secção, nas duas edições: a abertura (§3.0), os parágrafos de cada secção (§3.1 a §3.8, com o `id`
que o mandato dá a um parágrafo), os títulos das secções, as portas de cada secção e a descrição da página; e,
desde a leitura a frio do Codex (15.10.2026, o achado 11), a frase nova da escala do fecho (§3.9), a única frase da
forma que muda, lida do «PT «…» EN «…»» da linha do §3.9.
Uma frase é o texto entre o primeiro «» e o último » da sua linha: as aspas de dentro ficam, como o mandato
as escreve. Os tokens ficam como estão ({fontes}, {email}, {marcador}, [palavras]{politica}).

uso: python3 frases-do-mandato.py <raiz do sítio> [saída.json]"""
import json, pathlib, re, sys

RAIZ = pathlib.Path(sys.argv[1]).resolve()
MANDATO = RAIZ / 'design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md'
linhas = MANDATO.read_text(encoding='utf-8').splitlines()

CABECA = re.compile(r'^\*\*§3\.(\d) · (.+?) / (.+?)\*\*')
PARAGRAFO = re.compile(r'^P(\d)(?: \(com `id="([a-z-]+)"`\))? (PT|EN): «(.*)»\s*$')
ABERTURA = re.compile(r'^(PT|EN): «(.*)»\s*$')
PORTA = re.compile(r'«([^«»]*?) →» / «([^«»]*?) →»')

def dentro(linha):
    """O texto entre o primeiro « e o último » da linha."""
    return linha[linha.index('«') + 1:linha.rindex('»')]

out = {'mandato': str(MANDATO.relative_to(RAIZ)), 'abertura': {}, 'seccoes': [], 'meta_description': {}, 'fecho_escala': {}}
atual = None
na_abertura = False
for i, l in enumerate(linhas, 1):
    if l.startswith('**§3.0 · A abertura'):
        na_abertura = True
        continue
    if l.startswith('**§3.9 · A forma'):
        na_abertura = False
        atual = None
        e = re.search(r'PT «([^«»]*)» EN «([^«»]*)»', l)
        if e:
            out['fecho_escala'] = {'pt': e.group(1), 'en': e.group(2)}
        continue
    m = CABECA.match(l)
    if m:
        na_abertura = False
        atual = {'n': int(m.group(1)), 'titulo': {'pt': m.group(2), 'en': m.group(3)}, 'paragrafos': [], 'portas': [], 'linha': i}
        out['seccoes'].append(atual)
        continue
    if na_abertura:
        a = ABERTURA.match(l)
        if a:
            out['abertura'][a.group(1).lower()] = a.group(2)
        continue
    if l.startswith('**§3.9 · A forma'):
        atual = None
        continue
    if atual is None:
        if l.startswith('**As cadeias da interface**'):
            pt = re.search(r'`metaDescription` PT «(.*?)» EN «', l)
            en = re.search(r'» EN «(.*?)»;', l)
            out['meta_description'] = {'pt': pt.group(1), 'en': en.group(1)}
        continue
    p = PARAGRAFO.match(l)
    if p:
        n, ident, lingua, texto = int(p.group(1)), p.group(2), p.group(3).lower(), dentro(l)
        alvo = next((x for x in atual['paragrafos'] if x['n'] == n), None)
        if alvo is None:
            alvo = {'n': n, 'id': ident, 'pt': None, 'en': None}
            atual['paragrafos'].append(alvo)
        alvo[lingua] = texto
        continue
    if l.startswith('Portas:'):
        atual['portas'] = [{'pt': a, 'en': b} for a, b in PORTA.findall(l)]

for s in out['seccoes']:
    for p in s['paragrafos']:
        assert p['pt'] and p['en'], f'§3.{s["n"]} P{p["n"]}: falta uma edição'
assert set(out['abertura']) == {'pt', 'en'}, 'falta a abertura'
assert [s['n'] for s in out['seccoes']] == list(range(1, 9)), [s['n'] for s in out['seccoes']]
txt = json.dumps(out, ensure_ascii=False, indent=1)
if len(sys.argv) > 2:
    pathlib.Path(sys.argv[2]).write_text(txt + '\n', encoding='utf-8')
print(txt)
