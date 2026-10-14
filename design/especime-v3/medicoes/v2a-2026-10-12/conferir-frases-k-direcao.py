#!/usr/bin/env python3
"""O lugar de direção lê as frases construídas da V2-a-k nas duas edições (a emenda à regra 14): cada frase do mandato, com os tokens
rendidos, uma vez por página; as ressalvas das parcerias sem a frase dos valores de caixa; nenhuma aspa reta em volta de «Consolidada».
uso: conferir-frases-k.py <worktree> [pcp-pt.txt pcp-en.txt]"""
import html, pathlib, re, sys
from html.parser import HTMLParser
W = pathlib.Path(sys.argv[1])
class T(HTMLParser):
    def __init__(s): super().__init__(); s.p=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in ('script','style'): s.skip+=1
    def handle_endtag(s,t):
        if t in ('script','style'): s.skip-=1
    def handle_data(s,d):
        if not s.skip: s.p.append(d)
def norm(t): return re.sub(r'[\s   ]+', ' ', t.replace('’', "'")).strip()
def texto(p):
    h = T(); h.feed(p.read_text(encoding='utf-8')); return norm(''.join(h.p))
ROAD_PT = norm('Os encargos brutos são o que o parceiro público (o Estado) paga às parcerias rodoviárias nesse ano: os pagamentos pela disponibilidade das vias, os pagamentos por serviço indexados ao tráfego, os gastos com a cobrança das portagens, as grandes reparações de pavimentos a cargo do parceiro público e as compensações a pagar aos parceiros privados, entre as principais componentes que o relatório lista na p. 124 do PDF. As receitas são o que o parceiro público recebe nessas parcerias: as portagens cobradas nas vias portajadas (exceto nas parcerias em que as portagens pertencem ao parceiro privado), a partilha de benefícios ou de receitas prevista nos contratos, e os pagamentos fixos das subconcessionárias (as empresas privadas que exploram as vias) ao parceiro público. Os encargos líquidos são os encargos brutos menos as receitas: 1 152 menos 263 dá 889, em milhões de euros. São valores de caixa, o dinheiro que sai e que entra no ano, em euros de 2027.')
ROAD_EN = norm('Gross charges are what the public partner (the State) pays to the road partnerships in that year: availability payments for the roads, service payments indexed to traffic, the costs of toll collection, major pavement repairs borne by the public partner and compensation payable to private partners, among the main components the report lists on PDF p. 124. Revenue is what the public partner receives in those partnerships: the tolls collected on tolled roads (except in partnerships where the tolls belong to the private partner), the benefit or revenue sharing provided for in the contracts, and the fixed payments made by subconcessionaires (the private companies that operate the roads) to the public partner. Net charges are gross charges minus revenue: 1 152 minus 263 gives 889, in millions of euros. These are cash values, the money paid and received in the year, in 2027 euros.')
TOTAL_PT = norm('É quanto o Estado prevê pagar em 2027 ao conjunto das parcerias público-privadas, depois de descontar o que recebe delas: a linha «Total» do quadro 4.25 do relatório, em dinheiro que sai e que entra no ano, em euros de 2027. O quadro lista cinco setores, como os escreve: «Rodoviário» (estradas), «Ferroviário» (ferrovia), «Saúde» (hospitais), «Aeroportuário» (aeroportos) e «Oceanário». O que o parceiro público (o Estado) paga e recebe nas parcerias rodoviárias está explicado no texto do relatório (p. 124 do PDF): de um lado, os pagamentos pela disponibilidade das vias e pelo serviço, os gastos com a cobrança das portagens, as grandes reparações e as compensações; do outro, as portagens, a partilha de benefícios ou de receitas e os pagamentos fixos das subconcessionárias (as empresas privadas que exploram as vias).')
TOTAL_EN = norm("It is what the State expects to pay in 2027 to all public-private partnerships, after deducting what it receives from them: the «Total» row of Table 4.25 of the report, in money paid and received in the year, in 2027 euros. The table lists five sectors, as it writes them: «Rodoviário» (roads), «Ferroviário» (railways), «Saúde» (hospitals), «Aeroportuário» (airports) and «Oceanário» (the oceanarium). What the public partner (the State) pays and receives in the road partnerships is explained in the report's text (PDF p. 124): on one side, availability and service payments, the costs of toll collection, major repairs and compensation; on the other, tolls, benefit or revenue sharing and the fixed payments by subconcessionaires (the private companies that operate the roads).")
SAUDE_PT = norm('«Consolidada» quer dizer que o quadro 5.37 do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.')
SAUDE_EN = norm("«Consolidated» means that Table 5.37 of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.")
PCP_PT = norm(pathlib.Path(sys.argv[2]).read_text(encoding='utf-8')) if len(sys.argv) > 3 else None
PCP_EN = norm(pathlib.Path(sys.argv[3]).read_text(encoding='utf-8')) if len(sys.argv) > 3 else None
ROAD = ['oe-2027-ppp-rodoviario-encargos-brutos-2027', 'oe-2027-ppp-rodoviario-encargos-liquidos-2027', 'oe-2027-ppp-rodoviario-receitas-2027']
TOTAL = 'oe-2027-ppp-total-encargos-liquidos-2027'; PCP = 'afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09'
SAUDE = sorted(p.name for p in (W/'dist/livro-razao').iterdir() if p.is_dir() and p.name.startswith('oe-2027-saude-')) + ['afirmacao-leitao-amaro-saude-oe2027-2026-10-09', 'afirmacao-rtp-saude-queda-oe2027-2026-10-09']
assert len(SAUDE) == 11, SAUDE
erros = []; ok = 0
def espera(id_, ed, frase, n=1):
    global ok
    p = W / ('dist/livro-razao/%s/index.html' % id_ if ed == 'pt' else 'dist/en/ledger/%s/index.html' % id_)
    t = texto(p); c = t.count(frase)
    if c != n: erros.append(f'{ed} {id_}: a frase aparece {c} vez(es), esperava {n}: {frase[:70]}…')
    else: ok += 1
    return t
for i in ROAD:
    espera(i, 'pt', ROAD_PT); espera(i, 'en', ROAD_EN)
espera(TOTAL, 'pt', TOTAL_PT); espera(TOTAL, 'en', TOTAL_EN)
for i in SAUDE:
    tpt = espera(i, 'pt', SAUDE_PT); ten = espera(i, 'en', SAUDE_EN)
    for mau in ('"Consolidada"', '"Efetiva"', '“Consolidada”'):
        if mau in tpt: erros.append(f'pt {i}: aspas retas {mau}')
    for mau in ('"Consolidated"', '"Effective"', '“Consolidated”'):
        if mau in ten: erros.append(f'en {i}: aspas retas {mau}')
for i in ROAD + [TOTAL]:
    tpt = texto(W/f'dist/livro-razao/{i}/index.html'); ten = texto(W/f'dist/en/ledger/{i}/index.html')
    if 'Valores de caixa a preços constantes' in tpt: erros.append(f'pt {i}: a ressalva ainda tem os valores de caixa')
    if 'Previsão, não execução.' not in tpt: erros.append(f'pt {i}: sem «Previsão, não execução.»')
    if 'constant 2027 prices' in ten: erros.append(f'en {i}: a ressalva ainda tem os valores de caixa')
    if 'Forecast, not outturn.' not in ten: erros.append(f'en {i}: sem «Forecast, not outturn.»')
    for t_, ed in ((tpt, 'pt'), (ten, 'en')):
        for m in re.finditer(r'subconcession[áa]ri[ae]s|subconcessionaires', t_):
            seg = t_[m.end():m.end()+60]
            if t_[:m.start()].endswith('efetuados pelas '): continue  # o excerto da p. 124 como a fonte o escreveu (regra 2)
            if not seg.startswith(' (as empresas privadas que exploram as vias)') and not seg.startswith(' (the private companies that operate the roads)'):
                erros.append(f'{ed} {i}: «subconcessionárias» sem a explicação a seguir: …{t_[m.start()-20:m.end()+50]}')
if PCP_PT:
    tpt = espera(PCP, 'pt', PCP_PT); ten = espera(PCP, 'en', PCP_EN)
    for t_, ed in ((tpt, 'pt'), (ten, 'en')):
        for m in re.finditer(r'subconcession[áa]ri[ae]s|subconcessionaires', t_):
            seg = t_[m.end():m.end()+60]
            if t_[:m.start()].endswith('efetuados pelas '): continue
            if not seg.startswith(' (as empresas privadas que exploram as vias)') and not seg.startswith(' (the private companies that operate the roads)'):
                erros.append(f'{ed} {PCP}: «subconcessionárias» sem a explicação: …{t_[m.start()-20:m.end()+50]}')
print(f'frases conferidas uma vez por página: {ok}; erros: {len(erros)}')
for e in erros: print('  ERRO', e)
sys.exit(1 if erros else 0)
