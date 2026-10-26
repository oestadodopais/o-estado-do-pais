"""HB1-d, Entrega B: confere no dist/ da cabeça o que o ponto 11 do mandato pede, nas duas edições.

Uso: python3 design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-b.py (na raiz do sítio, depois do build).
Escreve hb1d/medidas-b.json. Cada medida: o nome, o valor lido, o comando e um conhecido-positivo."""
import html, json, re
from pathlib import Path
CMD = 'python3 design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-b.py'
D = Path('dist'); aqui = Path(__file__).parent
SLUG = 'a-casa-em-portugal-e-na-europa'
def texto(p):
    s = (D / p).read_text(encoding='utf-8')
    s = re.sub(r'<script\b[^>]*>.*?</script>', ' ', s, flags=re.S)
    s = re.sub(r'<style\b[^>]*>.*?</style>', ' ', s, flags=re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).replace(' ', ' ').replace(' ', ' ')
def jsonld(p):
    s = (D / p).read_text(encoding='utf-8'); out = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', s, flags=re.S):
        try: out.append(json.loads(m.group(1)))
        except Exception as e: out.append({'erro': str(e)})
    return out
def janela(t, chave, n=160):
    i = t.find(chave); return t[max(0, i - 40): i + n] if i >= 0 else None
medidas = []
def m(nome, valor, cp): medidas.append({'nome': nome, 'valor': valor, 'comando': CMD, 'conhecido_positivo': cp})
version = json.loads((D / 'version.json').read_text()); m('dist/version.json', version, 'a cabeça da worktree')
ED = {'pt': (f'estudos/{SLUG}/index.html', f'estudos/{SLUG}/documento/index.html'),
      'en': (f'en/studies/{SLUG}/index.html', f'en/studies/{SLUG}/document/index.html')}
PUB = {'pt': ['26.10.2026', '26 de outubro de 2026'], 'en': ['26.10.2026', '26 October 2026']}
PREP = {'pt': 'em preparação', 'en': 'in preparation'}
for l, (est, doc) in ED.items():
    for p in (est, doc):
        t = texto(p)
        m(f'{l} {p}: data de publicação', {d: janela(t, d) for d in PUB[l] if d in t}, 'a página do estudo do Orçamento diz a sua data (20.10.2026)')
        m(f'{l} {p}: «{PREP[l]}»', t.lower().count(PREP[l]), 'contagem na página de antes (dist antigo dizia em preparação)')
        lds = jsonld(p)
        m(f'{l} {p}: JSON-LD', [{k: x.get(k) for k in ('@type', 'datePublished', 'dateModified', 'creativeWorkStatus')} for x in lds if isinstance(x, dict)], 'o JSON-LD do estudo do Orçamento')
    t = texto(est)
    for chave in ({'pt': ['A taxa de juro implícita de setembro de 2026', 'Lisboa custa 2,2 vezes o país'],
                   'en': ['The implicit interest rate for September 2026', 'Lisbon costs 2.2 times the country']}[l]):
        m(f'{l} estudo: «{chave}»', janela(t, chave, 400), 'a frase do Banco de Portugal da secção 6')
    m(f'{l} estudo: períodos antigos', {a: t.count(a) for a in (['1.º trimestre de 2026', 'agosto de 2026'] if l == 'pt' else ['Q1 2026', 'August 2026'])}, 'a frase do Banco de Portugal diz agosto (1)')
# listas: o arquivo, a área, os documentos, as leituras: toda a página do dist que liga ao estudo
listas = {}
for p in sorted(D.rglob('*.html')):
    r = p.relative_to(D).as_posix()
    if r.startswith((f'estudos/{SLUG}/', f'en/studies/{SLUG}/')): continue
    s = p.read_text(encoding='utf-8')
    if f'/{SLUG}' not in s: continue
    if r.startswith(('livro-razao/', 'en/ledger/', 'provas/', 'en/')) and '/' in r[len('en/'):] and r.count('/') > 2: continue
    t = texto(r); i = t.find('A casa em Portugal e na Europa') if not r.startswith('en/') else t.find('Housing in Portugal and in Europe')
    listas[r] = {'em_preparacao_na_pagina': t.lower().count(PREP['en' if r.startswith('en/') else 'pt']), 'junto_do_titulo': t[max(0, i - 80): i + 220] if i >= 0 else None}
m('páginas que ligam ao estudo (fora das dele e dos recibos)', listas, 'o arquivo /estudos liga ao estudo do Orçamento')
for l, base in (('pt', 'livro-razao'), ('en', 'en/ledger')):
    for i in ('edicoes-publicadas', 'estudos-publicados', 'hab-ine-preco-mediano', 'hab-ine-preco-lisboa', 'hab-ine-preco-porto', 'hab-ine-juro-implicito', 'der-hab-preco-lisboa-vs-portugal'):
        t = texto(f'{base}/{i}/index.html'); h1 = re.search(r'<h1[^>]*>(.*?)</h1>', (D / f'{base}/{i}/index.html').read_text(encoding='utf-8'), re.S)
        cab = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h1.group(1)))).strip() if h1 else None
        procura = {'pt': ['Publicado', 'publicado', '23.10.2026', '21.10.2026', '2.º trimestre de 2026', 'setembro de 2026', '26.10.2026'],
                   'en': ['Published', 'published', '23.10.2026', '21.10.2026', 'Q2 2026', '2nd quarter of 2026', 'September 2026', '26.10.2026']}[l]
        m(f'{l} recibo {i}', {'h1': cab, 'presentes': [x for x in procura if x in t], 'valor': janela(t, {'edicoes-publicadas': ' 29', 'estudos-publicados': ' 19', 'hab-ine-preco-mediano': '2 445' if l == 'pt' else '2,445', 'hab-ine-preco-lisboa': '5 299' if l == 'pt' else '5,299', 'hab-ine-preco-porto': '3 846' if l == 'pt' else '3,846', 'hab-ine-juro-implicito': '3,194' if l == 'pt' else '3.194', 'der-hab-preco-lisboa-vs-portugal': '2,2' if l == 'pt' else '2.2'}[i], 120),
                                    'antigos': [x for x in ['2 337', '5 292', '3 729', '3,162', '2,337', '5,292', '3,729', '3.162', '1.º trimestre de 2026', 'Q1 2026', 'agosto de 2026', 'August 2026'] if x in t]},
          'o recibo de hab-ine-vagos-total diz 723 215')

# a abertura do estudo na primeira página, nas duas edições (a reescrita do lugar de direção, a regra F0.9)
for l, p, ini, fim in (('pt', 'index.html', 'Descontada a inflação, os preços das casas', ' anos.'), ('en', 'en/index.html', 'Net of inflation, house prices', ' years.')):
    t = texto(p); i = t.find(ini); j = t.find(fim, i)
    m(f'{l} {p}: a abertura do estudo', t[i:j + len(fim)] if i >= 0 else None, 'a página da área imprime a mesma frase')
    m(f'{l} {p}: «média europeia»/«European average»', t.count('média europeia') + t.count('European average'), 'a página da área /habitacao diz «Está abaixo da média» (outra frase)')
(aqui / 'medidas-b.json').write_text(json.dumps({'medidas': medidas}, ensure_ascii=False, indent=2) + '\n')
print(len(medidas), 'medidas escritas')
