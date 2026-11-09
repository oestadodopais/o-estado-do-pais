#!/usr/bin/env python3
"""CAM2-A (09.11.2026, o lugar de direção): as medidas do §0 do mandato.
uso: python3 medir-cam2a.py <dist> <raiz do sítio> <raiz do motor>
Lê o dist/ construído (as frases candidatas, pt e en), o livro-razão do sítio (as linhas com documento)
e o git do motor (os corpos alojados em content/*/source/, por sha256). Não chama modelos nem a rede."""
import sys, os, re, glob, html, hashlib, subprocess, collections, unicodedata, gzip
import yaml
D, SITE, MOTOR = sys.argv[1:4]
ATR_PT = re.compile(r'«[^»]{12,}»|\b(segundo|de acordo com|disse|disseram|afirmou|afirma|afirmam|defende|defendeu|considera|considerou|declarou|garantiu|acusou|criticou|reconheceu|prometeu|anunciou|escreveu|escreve)\b', re.I)
CAU_PT = re.compile(r'\b(porque|devido a|devido ao|devido à|por causa d|graças a|explica|explicam|explicou|levou a|levaram a|resultou|resulta d|resultado d|fez com que|em consequência|consequentemente|motivad[oa]s? por|provocou|causou|deve-se a|deveu-se a)\b', re.I)
ATR_EN = re.compile(r'“[^”]{12,}”|«[^»]{12,}»|\b(according to|said|says|stated|argued|argues|claimed|wrote|writes|promised|announced|acknowledged|declared|criticised|criticized|accused)\b', re.I)
CAU_EN = re.compile(r'\b(because|due to|owing to|as a result|resulted in|results from|led to|leads to|caused|causes|explains|explained|thanks to|driven by|consequently)\b', re.I)
def paragrafos(t):
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)
    m = re.search(r'<main.*?</main>', t, flags=re.S); t = m.group(0) if m else t
    for p in re.findall(r'<(p|li|blockquote|td|dd|figcaption)\b[^>]*>(.*?)</\1>', t, flags=re.S):
        yield p[1]
texto = lambda h: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()
def frases(paginas, atr, cau, corte):
    vistas, tipos, sem, rotas = set(), collections.Counter(), 0, set()
    for f in paginas:
        rota = '/' + os.path.relpath(os.path.dirname(f), D) + '/'
        partes = rota.strip('/').split('/')
        # A mesma frase do mesmo estudo na página e no documento conta uma vez (como em listar-frases.py da AUD1).
        chave = partes[1] if partes[0] in ('estudos', 'studies') else partes[2] if partes[:1] == ['en'] and len(partes) > 2 and partes[1] in ('estudos', 'studies') else rota
        for ph in paragrafos(open(f, encoding='utf-8').read()):
            pt = texto(ph)
            if len(pt) < 20: continue
            ligado = bool(re.search(r'href="(https?://[^"]+|/livro-razao/[^"#]+|/en/ledger/[^"#]+)"|data-claim="', ph))
            for s in re.split(corte, pt):
                t = [n for n, r in (('atribuicao', atr), ('causa', cau)) if r.search(s)]
                if not t or (chave, s) in vistas: continue
                vistas.add((chave, s)); tipos.update(t); rotas.add(rota); sem += (not ligado)
    return len(vistas), tipos, sem, len(rotas)
pt = sorted(set(glob.glob(D + '/estudos/*/documento/index.html') + glob.glob(D + '/estudos/*/index.html') + glob.glob(D + '/temas/**/index.html', recursive=True) + glob.glob(D + '/explicacoes/**/index.html', recursive=True)))
en = sorted(set(glob.glob(D + '/en/studies/*/document/index.html') + glob.glob(D + '/en/studies/*/index.html') + glob.glob(D + '/en/estudos/*/documento/index.html') + glob.glob(D + '/en/estudos/*/index.html') + glob.glob(D + '/en/explainers/**/index.html', recursive=True) + glob.glob(D + '/en/themes/**/index.html', recursive=True)))
n, t, sem, r = frases(pt, ATR_PT, CAU_PT, r'(?<=[.!?»])\s+(?=[A-ZÀ-Þ«])')
print(f'frases candidatas pt: {n} (atribuição {t["atribuicao"]}, causa {t["causa"]}) em {r} páginas; sem ligação nem linha no parágrafo: {sem}')
n, t, sem, r = frases(en, ATR_EN, CAU_EN, r'(?<=[.!?»”])\s+(?=[A-Z«“])')
print(f'frases candidatas en: {n} (atribuição {t["atribuicao"]}, causa {t["causa"]}) em {r} páginas; sem ligação nem linha no parágrafo: {sem}')
linhas, afirm = {}, 0
todas = glob.glob(SITE + '/ledger/claims/*.yml')
for f in todas:
    d = yaml.safe_load(open(f, encoding='utf-8'))
    afirm += bool(d.get('afirmacao'))
    doc = d.get('document') if isinstance(d, dict) else None
    s = doc.get('source_sha256') if isinstance(doc, dict) else None
    if s: linhas[d['id']] = (s, d.get('excerpt') or '')
print(f'linhas do livro-razão: {len(todas)}; com afirmacao: true: {afirm}; com document.source_sha256: {len(linhas)}')
ls = subprocess.run(['git', '-C', MOTOR, 'ls-files', '-z', 'content'], capture_output=True, check=True).stdout.split(b'\0')
do_motor = [os.path.join(MOTOR, x.decode()) for x in ls if b'/source/' in x]
edicoes = glob.glob(SITE + '/studies-src/_edicoes/*')
corpos = do_motor + edicoes
precisos, idx = {s for s, _ in linhas.values()}, {}
for f in corpos:
    try: b = open(f, 'rb').read()
    except OSError: continue
    h = hashlib.sha256(b).hexdigest()
    if h in precisos: idx.setdefault(h, f)
achadas = sum(s in idx for s, _ in linhas.values())
print(f'corpos alojados: {len(do_motor)} no git do motor (source/) e {len(edicoes)} edições arquivadas do sítio; linhas com o corpo encontrado por sha256: {achadas}; sem corpo: {len(linhas) - achadas}')
def N(t):
    t = unicodedata.normalize('NFKC', t).replace('­', '')
    t = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', t)
    return re.sub(r'\s+', ' ', t.translate(str.maketrans('’‘“”', "''\"\""))).strip()
cache = {}
def corpo(h):
    if h not in cache:
        f = idx[h]; raw = open(f, 'rb').read()
        if raw[:4] == b'%PDF':
            t = subprocess.run(['pdftotext', '-q', f, '-'], capture_output=True, timeout=120).stdout.decode('utf-8', 'replace')
        else:
            raw = gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw
            t = re.sub(r'<script.*?</script>|<style.*?</style>', '', raw.decode('utf-8', 'replace'), flags=re.S | re.I)
            t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
        cache[h] = N(t)
    return cache[h]
literal = sum(1 for s, e in linhas.values() if s in idx and N(e) and N(e) in corpo(s))
print(f'excertos encontrados palavra por palavra no texto do corpo (normalização simples): {literal} de {achadas}')
