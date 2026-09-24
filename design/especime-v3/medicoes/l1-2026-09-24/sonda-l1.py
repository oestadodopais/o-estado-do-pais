#!/usr/bin/env python3
"""A sonda das origens que o L1 procurou e não achou (bloco L1, item 4).

    python3 design/especime-v3/medicoes/l1-2026-09-24/sonda-l1.py

Pede pelo cliente da casa no motor (`core.http.HttpClient`, com o agente da casa)
os endereços de glossário que a construção procurou para apoiar uma palavra de
uma leitura e que não serviram, e escreve `sondas-l1.json` ao lado: para cada um,
o endereço pedido, o endereço final, o código HTTP, o tamanho e o sha256 do corpo,
a hora UTC e o cliente. Não guarda os corpos: é um registo de pedidos, não uma
resposta guardada, e nenhum excerto do sítio sai daqui. O motor encontra-se como
em `origens-l1.py`, sem o caminho da máquina escrito.
"""
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
_VIZINHAS = [RAIZ.parent, RAIZ.parents[3]] if len(RAIZ.parents) > 3 else [RAIZ.parent]
CANDIDATOS = [os.environ.get('OEDP_MOTOR')] + [str(v / 'ResearchHub' / sub) for v in _VIZINHAS for sub in ('.worktrees/l1-2026-09-24', '')]
MOTOR = next(Path(c) for c in CANDIDATOS if c and (Path(c) / 'core/http.py').exists())
sys.path.insert(0, str(MOTOR))
from core.http import CASA_UA, HttpClient  # noqa: E402

SE = 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title='
PEDIDOS = [
    ('taxa-de-cambio-efectiva-real-2025', 'o sentido de uma subida', SE + 'Glossary:Real_effective_exchange_rate_(REER)'),
    ('taxa-de-cambio-efectiva-real-2025', 'o sentido de uma subida', SE + 'Glossary:Real_effective_exchange_rate'),
    ('taxa-de-cambio-efectiva-real-2025', 'o sentido de uma subida', SE + 'Glossary:Effective_exchange_rate'),
    ('criancas-em-creche-2025', 'o que é o cuidado formal', SE + 'Glossary:Formal_childcare'),
    ('criancas-em-creche-2025', 'o que é o cuidado formal', SE + 'Glossary:Childcare'),
    ('criancas-em-creche-2025', 'o que é o cuidado formal', SE + 'Glossary:Early_childhood_education_and_care_(ECEC)'),
    ('saldo-das-administracoes-publicas-2025', 'o que são as administrações públicas', SE + 'Glossary:General_government_(GG)_sector'),
    ('pib-real-per-capita-2025', 'o que é um valor real', SE + 'Glossary:Chain-linked_volumes'),
    ('pib-real-per-capita-2025', 'o que é um valor real', SE + 'Glossary:Chain_linking'),
]


def main():
    c = HttpClient(user_agent=CASA_UA)
    registos = []
    for medida, procura, url in PEDIDOS:
        hora = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        r = c.condicional(url)
        corpo = r.corpo or b''
        registos.append({'medida': medida, 'procurava': procura, 'url': url, 'url_final': r.url_final,
                         'http': r.status, 'bytes': len(corpo), 'sha256': hashlib.sha256(corpo).hexdigest() if corpo else None,
                         'hora_utc': hora, 'cliente': 'core.http.HttpClient.condicional', 'user_agent': CASA_UA})
        print(f'{r.status} {url}')
    (AQUI / 'sondas-l1.json').write_text(json.dumps({'o_que_e': __doc__.strip().split('\n')[0], 'registos': registos},
                                                    ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return 0


if __name__ == '__main__':
    sys.exit(main())
