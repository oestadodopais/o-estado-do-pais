"""Conferência independente (lugar de direção) das provas do estudo 16 contra os PDF alojados.
Não usa código do motor. Uso: conferir_provas.py <pasta do estudo>"""
import sys, json, hashlib, re, subprocess, pathlib, unicodedata
import fitz
est = pathlib.Path(sys.argv[1]); ts = est/'Technical Source'; src = est/'source'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
pdfs = {sha(p): p for p in sorted(src.glob('*.pdf'))}
byname = {p.name: p for p in pdfs.values()}
def tight(s): return re.sub(r'\s+', '', unicodedata.normalize('NFC', s))
_cache = {}
def page_texts(p, n):
    k = (p, n)
    if k not in _cache:
        r = subprocess.run(['pdftotext','-f',str(n),'-l',str(n),'-layout',str(p),'-'],capture_output=True)
        t1 = r.stdout.decode('utf-8','replace') if r.returncode==0 else ''
        r2 = subprocess.run(['pdftotext','-f',str(n),'-l',str(n),'-raw',str(p),'-'],capture_output=True)
        t2 = r2.stdout.decode('utf-8','replace') if r2.returncode==0 else ''
        d = fitz.open(p); t3 = d[n-1].get_text() if 1 <= n <= len(d) else ''; np_ = len(d); d.close()
        _cache[k] = ([tight(t1), tight(t2), tight(t3)], np_)
    return _cache[k]
def on_page(p, n, exc):
    ts_, np_ = page_texts(p, n)
    e = tight(exc)
    return [e in t for t in ts_], [t.count(e) for t in ts_], np_
fails = []; counts = {}
def rec(kind, ident, ok, why=''):
    counts.setdefault(kind, [0,0]); counts[kind][0 if ok else 1] += 1
    if not ok: fails.append((kind, ident, why))
a = json.load(open(ts/'ajustes.json'))
# 1. linhas próprias
for r in a['linhas_proprias']:
    d = r['document']; p = pdfs.get(d['source_sha256'])
    if not p: rec('linha', r['id'], False, 'sha256 sem PDF em source/'); continue
    hit, cnt, np_ = on_page(p, d['page'], r['excerpt'])
    if not any(hit): rec('linha', r['id'], False, f"excerto ausente da página {d['page']} de {p.name}"); continue
    # o valor está no excerto, em alguma forma impressa?
    v = r['value']; digs = re.sub(r'[^\d]', '', v.split('.')[0]) if re.fullmatch(r'-?[\d.]+', v) else None
    exd = re.sub(r'[^\d,]', '', r['excerpt'])
    okv = True
    if digs is not None:
        okv = digs.lstrip('0') in re.sub(r'[^\d]', '', r['excerpt']) or digs in ('', '0')
    rec('linha', r['id'], okv, '' if okv else f"valor {v} sem os algarismos no excerto")
# 2. citações
for c in json.load(open(ts/'citacoes-julgadas.json')):
    d = c['documento']; p = est/d['ficheiro']; ident = f"{c['lingua']}:{c['unidade']}:{c['citacao'][:30]}"
    if not p.exists() or sha(p) != d['sha256']: rec('citacao', ident, False, 'PDF em falta ou outro resumo'); continue
    if tight(c['citacao']) not in tight(c['excerto']): rec('citacao', ident, False, 'palavras fora do excerto'); continue
    hit, cnt, _ = on_page(p, d['pagina'], c['excerto'])
    rec('citacao', ident, any(hit), '' if any(hit) else f"excerto ausente da página {d['pagina']}")
# 3. datas
for dt in a['datas']:
    blob = json.dumps(dt, ensure_ascii=False)
    doc = dt.get('documento') or dt.get('document')
    if doc is None:
        reg = dt.get('registo')
        rec('data-registo', dt['id'], reg is not None, 'sem prova'); continue
    counts.setdefault('data-documental-forma', []).append(sorted(dt.keys()) + sorted(doc.keys()))
    fn = doc.get('ficheiro'); s = doc.get('sha256') or doc.get('source_sha256')
    p = pdfs.get(s) or (est/fn if fn else None)
    pg = doc.get('pagina') or doc.get('page'); exc = dt.get('excerto') or doc.get('excerto') or dt.get('excerpt')
    if not p or not pathlib.Path(p).exists() or sha(pathlib.Path(p)) != s: rec('data', dt['id'], False, 'PDF/resumo'); continue
    hit, cnt, _ = on_page(pathlib.Path(p), pg, exc)
    rec('data', dt['id'], any(hit), '' if any(hit) else f'excerto ausente da página {pg}')
# 4. títulos
for t in json.load(open(ts/'eva'/'titulos-documentais.json')):
    p = byname.get(t['ficheiro'])
    if not p or sha(p) != t['sha256']: rec('titulo', t['ficheiro'], False, 'PDF/resumo'); continue
    if t.get('modo') != 'lido na imagem':
        if tight(t['titulo']) not in tight(t['excerto']): rec('titulo', t['ficheiro'], False, 'título fora do excerto'); continue
        hit, cnt, _ = on_page(p, t['pagina'], t['excerto'])
        rec('titulo', t['ficheiro'], any(hit), '' if any(hit) else f"excerto ausente da página {t['pagina']}")
    else:
        ok = all(str(t.get(k, '')).strip() for k in ('leitor', 'razao', 'data', 'pagina', 'sha256'))
        rec('titulo-imagem', t['ficheiro'], ok, '' if ok else 'leitura na imagem sem leitor, razão, data, página ou resumo')
forma = counts.pop('data-documental-forma', [])
print('PDF em source/:', len(pdfs))
for k, (ok, ko) in sorted(counts.items()): print(f'{k}: {ok} conferem, {ko} falham')
if forma: print('forma das datas documentais (primeira):', forma[0])
for f in fails: print('FALHA', *f, sep=' | ')
sys.exit(1 if fails else 0)
