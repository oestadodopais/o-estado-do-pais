#!/usr/bin/env python3
"""O inventário dos rótulos que o leitor vê nos cartões de medida de uma construção (dist/): por chave de medida, as formas
distintas do nome, da unidade, do período, da linha do estado, da frase da faixa (com os números apagados) e da definição da
dobra, nas duas edições, com a contagem de páginas em que cada forma aparece. uso: inventario-rotulos.py <dist> <saida.json>"""
import sys, re, json, pathlib, collections
dist = pathlib.Path(sys.argv[1]); saida = sys.argv[2]
RE_ART = re.compile(r'<article class="cartao-medida"(.*?)</article>', re.S)
def attr(s, n):
    m = re.search(r'%s="([^"]*)"' % n, s); return m.group(1) if m else ''
def texto(s):
    s = re.sub(r'<svg.*?</svg>', '', s, flags=re.S); s = re.sub(r'<[^>]+>', '', s); return re.sub(r'\s+', ' ', s).strip()
def campo(s, padrao):
    m = re.search(padrao, s, re.S); return texto(m.group(1)) if m else ''
def sem_numeros(s): return re.sub(r'\d[\d\s.,]*', '#', s)
inv = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))
paginas = 0; cartoes = 0
for p in sorted(dist.rglob('index.html')):
    rel = '/' + p.relative_to(dist).parent.as_posix().strip('.') ; rel = rel.replace('//', '/')
    ed = 'en' if rel == '/en' or rel.startswith('/en/') else 'pt'
    t = p.read_text(encoding='utf-8', errors='replace'); paginas += 1
    for m in RE_ART.finditer(t):
        a = m.group(0); cartoes += 1
        chave = attr(a, 'data-medida-chave') or '?'
        k = (ed, chave)
        inv[k]['nome'][campo(a, r'class="[^"]*cartao-medida-nome[^"]*"[^>]*>(.*?)</span>')] += 1
        inv[k]['unidade'][campo(a, r'class="[^"]*cartao-medida-unidade[^"]*"[^>]*>(.*?)</span>')] += 1
        inv[k]['periodo'][sem_numeros(campo(a, r'class="cartao-medida-periodo">(.*?)</span></span>|class="cartao-medida-periodo">(.*?)</span>'))] += 1
        for r in re.findall(r'<p class="cartao-medida-regua">(.*?)</p>', a, re.S): inv[k]['estado'][sem_numeros(texto(r))] += 1
        inv[k]['faixa'][sem_numeros(campo(a, r'class="fc-frase"[^>]*>(.*?)</p>'))] += 1
        inv[k]['comparacao'][sem_numeros(campo(a, r'class="fc-comparacao"[^>]*>(.*?)</p>'))] += 1
        inv[k]['dobra'][campo(a, r'class="cartao-medida-frase">(.*?)</p>')] += 1
out = {'paginas': paginas, 'cartoes': cartoes, 'medidas': {}}
for (ed, chave), campos in sorted(inv.items()):
    out['medidas'][f'{ed}:{chave}'] = {c: dict(v.most_common()) for c, v in campos.items()}
json.dump(out, open(saida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
formas = collections.Counter()
for k, campos in out['medidas'].items():
    for c, v in campos.items(): formas[c] += len([x for x in v if x])
print(json.dumps({'paginas': paginas, 'cartoes': cartoes, 'chaves_de_medida': len({k.split(':')[1] for k in out['medidas']}), 'formas_distintas_por_campo': dict(formas)}, ensure_ascii=False))
