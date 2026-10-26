"""Confere no corpo alojado a relação percentual do §99, sem alterar a pesquisa."""
import hashlib
import json
from decimal import Decimal
from pathlib import Path
import sys

motor = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(motor))
from publisher import oe2027_generalidade as G

saida = Path(__file__).resolve().parent
specs = G.load(G.STUDY / 'extracoes.json')['rows']
ids = ['og1-utao-brent-mf-2027', 'og1-utao-brent-contratos-2027', 'og1-utao-brent-diferenca']
rows = [G.extract(next(s for s in specs if s['id'] == id)) for id in ids]
s = next(s for s in specs if s['id'] == ids[0])
text, receipt = G.surface(s)
source_phrase = 'a média dos contratos de 2027 era de cerca de 95 USD, 11% acima dos 86,1 USD assumidos pelo MF'
assert source_phrase in G.norm(text)
assert [r['value'] for r in rows] == ['86,1', '95', '11']
manifest = G.load(motor / 'publisher/manifest.og1a.json')
expected_claims = {'og1-' + x for x in 'ps-abstencao pcp-comite pcp-raimundo be-voto il-prioridades livre-posicao governo-rtp-previsoes governo-rtp-combustiveis governo-rtp-habitacao governo-eco-juros governo-observador-saldo'.split()}
expected_numbers = {'og1-utao-' + x for x in 'pib-2026 saldo-2026 saldo-me-2027 divida-2025-revista politicas-saldo politicas-peso juros-variacao juros-montante taxa-implicita-2026 taxa-implicita-2027 novas-saldo brent-mf-2027 brent-diferenca brent-contratos-2027 despesa-liquida-ce despesa-liquida-limiar despesa-liquida-mf-antes despesa-liquida-mf-defesa saude-variacao saude-sem-prr'.split()}
expected = expected_claims | expected_numbers | {'og1-utao-p15', 'og1-utao-p42'}
selected = [r['site_id'] for r in manifest['rows']]
assert len(selected) == len(set(selected)) == len(expected) == 33
assert set(selected) == expected
proof = {
    'fonte': rows[0]['document'],
    'recibo': receipt,
    'frase_na_fonte_alojada': source_phrase,
    'linhas': [{k:r[k] for k in ['id', 'value', 'unit', 'excerpt', 'document']} for r in rows],
    'mandato_fontes': '11 % abaixo dos contratos para esse ano',
    'mandato_conclusao': '11 % mais barato do que os contratos',
    'problema': 'O mandato inverte o termo de comparação mantendo a mesma percentagem. A fonte atribui os 11% aos contratos acima do pressuposto do MF.',
    'calculo_inversao_de_onze_por_cento': {
        'formula': '100 * (1 - 1 / (1 + 11 / 100))',
        'percentagem': str(Decimal(100) * (1 - 1 / (1 + Decimal(11)/100))),
        'nota': 'Demonstração da mudança de base, não nova medição do preço do petróleo.'
    },
    'selecao_conferida': selected,
    'manifest_sha256': hashlib.sha256((motor / 'publisher/manifest.og1a.json').read_bytes()).hexdigest(),
    'conteudo_aprovado': False,
    'codigo': 1,
}
(saida / 'petroleo-a5.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
print('Seleção exata: 33 linhas, sem auxiliares.')
print('Fonte e recibo conferidos: §99, página física 52.')
print('RECUSA DE CONTEÚDO: a fonte diz 11% acima; o mandato inverte a comparação para 11% abaixo.')
sys.exit(1)
