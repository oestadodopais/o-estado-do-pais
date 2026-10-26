"""HB1-d, Entrega A: lê do motor e do sítio os valores das cinco linhas e as frases compostas.

Uso: python3 design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-a.py <motor>
(corre na raiz do sítio). Escreve hb1d/medidas-a.json ao lado deste guião.
Cada medida leva o nome, o valor, o comando e um conhecido-positivo (uma linha
ou frase que não mudou, lida pela mesma função)."""
import json, re, sys
from pathlib import Path
import yaml

motor = Path(sys.argv[1]); aqui = Path(__file__).parent
CMD = 'python3 design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-a.py <motor>'
IDS = ['hab-ine-preco-mediano', 'hab-ine-preco-lisboa', 'hab-ine-preco-porto', 'hab-ine-juro-implicito',
       'der-hab-preco-lisboa-vs-portugal', 'der-hab-renda-lisboa-vs-portugal']
CONHECIDA = 'hab-ine-vagos-total'
livro = {r['id']: r for r in json.loads((motor / 'content/23 Habitacao/ledger.json').read_text())['claims']}
def do_motor(i):
    r = livro[i]
    return {'value': r['value'], 'reference_date': r.get('reference_date'), 'published_at': r.get('published_at'),
            'file': (r.get('document') or {}).get('file'), 'source_sha256': (r.get('document') or {}).get('source_sha256')}
def do_sitio(i):
    f = Path('ledger/claims') / (i + '.yml')
    if not f.exists(): return None
    r = yaml.safe_load(f.read_text())
    return {'value': r['value'], 'reference_date': r.get('reference_date'), 'published_at': r.get('published_at'),
            'edition': (r.get('document') or {}).get('edition'), 'corrections': len(r.get('corrections') or [])}
medidas = []
for i in IDS + [CONHECIDA]:
    medidas.append({'nome': f'linha {i}', 'motor': do_motor(i), 'sitio': do_sitio(i), 'comando': CMD,
                    'conhecido_positivo': CONHECIDA})
for i in ['edicoes-publicadas', 'estudos-publicados', 'correcoes-publicadas']:
    medidas.append({'nome': f'contador {i}', 'sitio': do_sitio(i), 'comando': CMD, 'conhecido_positivo': 'correcoes-publicadas (não muda)'})

FIM = re.compile(r'(?<=[.!?»)])\s+(?=[A-ZÁÉÍÓÚÂÊÔÀÇ«])')
def frases(texto): return FIM.split(texto)
ED = {'pt': 'A casa em Portugal e na Europa.md', 'en': 'Housing in Portugal and in Europe.md'}
PROCURA = {
    'pt': [('resumo', 'Uma casa vendida em Portugal'), ('secção 1', 'Em euros, o INE mede as vendas'),
           ('secção 6', 'A taxa de juro implícita no conjunto'), ('secção 11', 'A taxa de juro implícita de '),
           ('conhecido-positivo (secção 6, Banco de Portugal)', 'Em agosto de 2026 os bancos emprestaram')],
    'en': [('resumo', 'A home sold in Portugal'), ('secção 1', 'In euros, the INE measures sales'),
           ('secção 6', 'The implicit interest rate'), ('secção 11', 'The implicit interest rate for '),
           ('conhecido-positivo (secção 6, Banco de Portugal)', 'In August 2026 the banks lent')],
}
ANTIGOS = {'pt': ['1.º trimestre de 2026', 'agosto de 2026'], 'en': ['Q1 2026', 'August 2026', 'first quarter of 2026']}
PRESAS = ['2 445', '5 299', '3 846', '3,194', '2,2', '2,445', '5,299', '3,846', '3.194', '2.2', '2 337', '5 292', '3 729', '3,162', '2,337', '5,292', '3,729', '3.162']
for lingua, nome in ED.items():
    texto = (motor / 'content/28 Habitacao Estudo' / nome).read_text()
    linhas = texto.split('\n'); secao = None; achadas = {}
    todas = []
    for ln in linhas:
        if ln.startswith('## '): secao = ln
        for f in frases(ln): todas.append((secao, f))
    for rotulo, inicio in PROCURA[lingua]:
        cand = [(s, f) for s, f in todas if f.startswith(inicio)]
        if rotulo == 'secção 6': cand = [(s, f) for s, f in cand if s and s.startswith('## 6')]
        if rotulo == 'secção 11': cand = [(s, f) for s, f in cand if s and s.startswith('## 11')]
        medidas.append({'nome': f'frase {lingua} {rotulo}', 'ocorrencias': len(cand), 'secao': cand[0][0] if cand else None,
                        'valor': cand[0][1] if cand else None, 'comando': CMD,
                        'conhecido_positivo': 'a frase do Banco de Portugal da secção 6, de outras linhas, lida pela mesma função'})
    # nenhuma frase com os valores das quatro linhas diz ainda o período antigo
    presas_antigas = [f for s, f in todas if any(v in f for v in PRESAS) and any(a in f for a in ANTIGOS[lingua])]
    medidas.append({'nome': f'frases {lingua} presas às quatro linhas com o período antigo', 'valor': len(presas_antigas),
                    'frases': presas_antigas, 'comando': CMD,
                    'conhecido_positivo': f'a mesma procura com os períodos antigos sem o filtro dos valores acha {sum(1 for s,f in todas if any(a in f for a in ANTIGOS[lingua]))} frase(s), a do Banco de Portugal'})
(aqui / 'medidas-a.json').write_text(json.dumps({'medidas': medidas}, ensure_ascii=False, indent=2) + '\n')
print(len(medidas), 'medidas escritas')
