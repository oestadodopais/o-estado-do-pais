#!/usr/bin/env python3
"""AUD1 (07.11.2026): a lista das frases a auditar, por guião, a partir de um dist/ construído.
Cada frase candidata (uma atribuição ou uma causa) com a página, a língua, as fontes mais próximas (selos e ligações do mesmo parágrafo)
e as linhas do livro-razão citadas no parágrafo; sem repetir a mesma frase do mesmo estudo em várias páginas.
uso: python3 listar-frases.py <dist> <saída.json>"""
import sys, re, glob, html, json, hashlib, os
D, OUT = sys.argv[1], sys.argv[2]
ATR = re.compile(r'«[^»]{12,}»|\b(segundo|de acordo com|disse|disseram|afirmou|afirma|afirmam|defende|defendeu|considera|considerou|declarou|garantiu|acusou|criticou|reconheceu|prometeu|anunciou|escreveu|escreve|diz|dizem|refere|referem|indica|indicam|conclui|concluem|estima|estimam|(?<!mecanismo de )(?<!sistema de )alerta|alertam)\b', re.I)
CAU = re.compile(r'\b(porque|devido a|devido ao|devido à|por causa d(?:e|o|a|os|as)|graças a|explica|explicam|explicou|levou a|levaram a|resultou|resulta d(?:e|o|a|os|as)|resultado d(?:e|o|a|os|as)|fez com que|em consequência|consequentemente|motivad[oa]s? por|provocou|causou|deve-se a|deveu-se a)\b', re.I)
def paragrafos(t):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)
    m = re.search(r'<main.*?</main>', t, flags=re.S); t = m.group(0) if m else t
    for p in re.findall(r'<(p|li|blockquote|td|dd|figcaption)\b[^>]*>(.*?)</\1>', t, flags=re.S):
        yield p[1]
def texto(h): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()
vistas, itens = set(), []
paginas = sorted(set(glob.glob(D + '/estudos/*/documento/index.html') + glob.glob(D + '/estudos/*/index.html') + glob.glob(D + '/temas/**/index.html', recursive=True) + glob.glob(D + '/explicacoes/**/index.html', recursive=True)))
for f in paginas:
    rota = '/' + os.path.relpath(os.path.dirname(f), D) + '/'
    estudo = rota.split('/')[2] if rota.startswith('/estudos/') else rota
    for ph in paragrafos(open(f, encoding='utf-8').read()):
        pt = texto(ph)
        if len(pt) < 20: continue
        fontes = sorted(set(re.findall(r'href="(https?://[^"]+|/livro-razao/[^"#]+)"', ph)))
        linhas = sorted(set(re.findall(r'data-claim="([^"]+)"', ph)))
        for s in re.split(r'(?<=[.!?»])\s+(?=[A-ZÀ-Þ«])', pt):
            tipos = [n for n, r in (('atribuicao', ATR), ('causa', CAU)) if r.search(s)]
            if not tipos: continue
            chave = (estudo, s)
            if chave in vistas: continue
            vistas.add(chave)
            itens.append({'id': 'A' + hashlib.sha256((estudo + s).encode()).hexdigest()[:10], 'estudo': estudo, 'pagina': rota, 'tipos': tipos, 'frase': s, 'fontes_no_paragrafo': fontes, 'linhas_no_paragrafo': linhas})
json.dump({'dist': json.load(open(D + '/version.json')).get('commit'), 'frases': itens}, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(itens), 'frases;', dict(Counter(t for i in itens for t in i['tipos'])), '; por estudo:', Counter(i['estudo'] for i in itens).most_common(6))
