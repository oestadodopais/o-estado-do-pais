#!/usr/bin/env python3
"""OG1-B4 (29.10.2026): a linha do registo oficial da votação na generalidade, lida da página da iniciativa alojada com recibo.
Corre na raiz da worktree do motor. Acrescenta a linha a extracoes.json, atualiza a ausência voto-28 e imprime a linha."""
import json, re, html, sys, hashlib
from pathlib import Path
STUDY = Path('content/30 Orcamento 2027 Generalidade')
FILE = 'iniciativa-377352-29.html'
receipt = json.loads((STUDY / 'source' / (FILE + '.pedido.json')).read_text(encoding='utf-8'))
assert receipt['estado'] == 200 and receipt['bytes'] > 0, receipt
raw = (STUDY / 'source' / FILE).read_bytes()
assert hashlib.sha256(raw).hexdigest() == receipt['sha256'] and len(raw) == receipt['bytes']
# A mesma normalização do motor (oe2027_analise.html_text): etiquetas trocadas por um espaço, entidades desfeitas, espaços juntos.
t = raw.decode('utf-8-sig')
t = re.sub(r'<(script|style|head)\b.*?</\1>', ' ', t, flags=re.I | re.S)
flat = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]*>', ' ', t))).strip()
m = re.search(r'Votação em 2026-10-28 na Reunião Plenária n\.º 16 Aprovado Contra: .*? A Favor: [A-Z ,-]+?(?= 2026-10-29 \|)', flat)
assert m, 'o bloco da votação não está no corpo alojado'
quote = m.group(0)
expected = 'Votação em 2026-10-28 na Reunião Plenária n.º 16 Aprovado Contra: CH , IL , L , PCP , BE Abstenção: PS , PAN , JPP A Favor: PSD , CDS-PP'
assert quote == expected, quote
assert flat.count('Votação na generalidade') == 1 and flat.count(quote) == 1
assert 'Proposta de Lei 110/XVII/2 Orçamento do Estado para 2027' in flat
spec = json.loads((STUDY / 'extracoes.json').read_text(encoding='utf-8'))
ids = {r['id'] for r in spec['rows']}
row = {
    'id': 'og1-votacao-generalidade-oficial',
    'kind': 'quote',
    'file': (STUDY / 'source' / FILE).as_posix(),
    'source_sha256': receipt['sha256'],
    'quote': quote,
    'period': '2026-10-28',
    'published_at': '2026-10-29',
    'unit': 'texto',
    'title': 'Proposta de Lei 110/XVII/2, Orçamento do Estado para 2027: detalhe da iniciativa',
    'group': 'votacao',
    'name': 'votacao-generalidade-oficial',
    'locator': 'Página da iniciativa; fase «Votação na generalidade» datada de 2026-10-28; excerto localizado por texto',
    'source_type': 'official',
    'note': ('Registo da votação na generalidade na página da iniciativa (BID 377352) do sítio da Assembleia da República: a fase «Votação na generalidade», '
             'datada de 2026-10-28, com a reunião, o resultado e o sentido de voto de cada partido; o campo da publicação em Diário está vazio na página. '
             'A página foi lida por guião sem a votação às 14:57 UTC e com ela às 15:28 UTC de 29.10.2026 (a vigia da sessão); published_at é o dia dessa leitura, '
             'porque a página não diz quando o registo foi acrescentado. Os espaços antes das vírgulas («CH , IL») vêm das etiquetas de itálico da página; '
             'a página escreve «CH, IL, L, PCP, BE». O «Resultado das Votações» do arquivo de votações e o Diário da reunião n.º 16 continuam por publicar. '
             'Linha oficial da mesma votação que og1-votacao-generalidade (ECO) e og1-votacao-generalidade-rtp (RTP) registam pelas notícias: os sentidos de voto coincidem.'),
    'anchors': ['Votação na generalidade', 'Proposta de Lei 110/XVII/2', 'Orçamento do Estado para 2027'],
    'attribution_mode': 'pelo registo da iniciativa no sítio da Assembleia da República, lido a 29 de outubro de 2026',
    'date_anchor': '2026-10-28',
}
if row['id'] in ids:
    spec['rows'] = [r for r in spec['rows'] if r['id'] != row['id']]
after = [i for i, r in enumerate(spec['rows']) if r['id'] == 'og1-guiao-votacoes-28']
spec['rows'].insert(after[0] + 1 if after else len(spec['rows']), row)
gap = next(g for g in spec['gaps'] if g['id'] == 'voto-28')
nota = (' A 29.10.2026 a página da iniciativa passou a registar a votação na generalidade (lida sem a votação às 14:57 UTC e com ela às 15:28 UTC pela vigia por guião): '
        'alojada e selada como og1-votacao-generalidade-oficial; os sentidos de voto coincidem com as notícias. O «Resultado das Votações» do arquivo e o Diário da reunião n.º 16 continuam por alojar.')
if 'og1-votacao-generalidade-oficial' not in gap['description']:
    gap['description'] = gap['description'].rstrip() + nota
gap['checked_at'] = '2026-10-29'
rec = (STUDY / 'source' / (FILE + '.pedido.json')).as_posix()
if rec not in gap['receipts']:
    gap['receipts'].append(rec)
(STUDY / 'extracoes.json').write_text(json.dumps(spec, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(row, ensure_ascii=False, indent=1))
print('linhas:', len(spec['rows']))
