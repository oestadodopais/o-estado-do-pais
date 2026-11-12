"""As medidas da adenda E do EVL, pelo leitor do próprio motor. uso: RESEARCHHUB_DIR=<motor> python3 medir-evl-e.py [--json]"""
import sys, os, hashlib, json, glob, re
MOTOR = os.environ['RESEARCHHUB_DIR']; SITIO = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
sys.path.insert(0, MOTOR); os.chdir(MOTOR)
from core import documentos_alojados as D
import core.linhas_proprias as LP
S = 'content/19 Évora 2027 Capital Europeia da Cultura/source/'
def lugar(nome, onde):
    p = S + nome; return D.DocumentText(p, hashlib.sha256(open(p, 'rb').read()).hexdigest()).place(onde)
p57 = lugar('42-e27-relatorio-contas-2025.pdf', {'type': 'pdf', 'page': 57})
CULT = '15 milhões de euros GEPAC - Gabinete de Estratégia, Planeamento e Avaliação Culturais (Ministério da Cultura, Juventude e Desporto) contratualizados. Pago 3.750.000€ durante o ano de 2025'
TUR = '4 milhões de euros Turismo de Portugal (Ministério da Economia e Coesão) contratualizados. Pago 3.920.000€ durante o ano de 2025'
PROT = 'com uma verba de 34 milhões de euros, através de financiamento público nacional e europeu'
h55 = lugar('55-cme-protocolo-2023.html', {'type': 'html', 'page': 1})
linhas = json.load(open('content/19 Évora 2027 Capital Europeia da Cultura/ledger.json', encoding='utf-8'))['claims']
tmpl = open('content/19 Évora 2027 Capital Europeia da Cultura/Technical Source/documento.pt.md.tmpl', encoding='utf-8').read()
os.chdir(SITIO)
fontes = [l.strip() for f in glob.glob('ledger/claims/*.yml') for l in open(f, encoding='utf-8') if l.startswith('source: ')]
m = {
 'excerto_alargado_da_cultura_inteiro_e_unico_na_pagina_57': LP.excerto_inteiro(p57, D._tight(CULT)),
 'numero_da_cultura_achado_no_excerto_alargado': D.numero_em_pdf(p57, CULT, '3.750.000'),
 'excerto_alargado_do_turismo_inteiro_e_unico_na_pagina_57': LP.excerto_inteiro(p57, D._tight(TUR)),
 'numero_do_turismo_achado_no_excerto_alargado': D.numero_em_pdf(p57, TUR, '3.920.000'),
 'excerto_do_protocolo_de_2023_inteiro_e_unico_na_pagina_da_camara': LP.excerto_inteiro(h55, D._tight(PROT)),
 'linhas_do_livro_do_estudo_com_o_valor_34': sorted(r['id'] for r in linhas if str(r.get('value')) == '34'),
 'ocorrencias_de_painel_transferido_no_gabarito_portugues': tmpl.count('⟦14:painel-transferido⟧'),
 'linhas_do_sitio_com_a_fonte_European_Commission': sum(1 for l in fontes if l == 'source: "European Commission"'),
 'linhas_do_sitio_com_a_fonte_Comissao_Europeia_pelo_painel_europeu': sum(1 for l in fontes if l == 'source: "Comissão Europeia, pelo painel europeu"'),
}
if '--json' in sys.argv:
    print(json.dumps({k: {'valor': str(v), 'comando': 'RESEARCHHUB_DIR=<worktree do motor> python3 design/especime-v3/medicoes/evl-2026-11-12/medir-evl-e.py'} for k, v in m.items()}, ensure_ascii=False, indent=1))
else:
    for k, v in m.items(): print(k, '=', v)
