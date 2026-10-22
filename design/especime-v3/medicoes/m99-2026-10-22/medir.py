#!/usr/bin/env python3
"""Escreve medidas.json da M99 a partir dos códigos guardados em codigos/ (nenhum valor escrito à mão).

Uso: python3 design/especime-v3/medicoes/m99-2026-10-22/medir.py
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
C = AQUI / 'codigos'


def codigo(nome):
    return int((C / nome).read_text().strip())


resumo = (C / 'real' / 'resumo.md').read_text()
cab = re.match(r'# conferir-tudo · (\w+) · (\d+) passos · (\d+) vermelhos · (\d+) s', resumo)
passos_code = sorted(p.name for p in (C / 'real').glob('*.code'))
medidas = [
    {'nome': 'ensaio de três plantas', 'valor': codigo('ensaio.code'),
     'comando': 'sh tests/leituras/ferramenta_conferir_tudo.sh',
     'conhecido_positivo': {'planta-sem-recusa (a recusa do dist/ retirada numa cópia)': codigo('planta-sem-recusa.code'),
                            'planta-para-no-vermelho (um break no primeiro vermelho, numa cópia)': codigo('planta-para-no-vermelho.code')}},
    {'nome': 'ensaio de quatro plantas (M99-b, com o build falhado e a pasta relativa)', 'valor': codigo('ensaio-b.code'),
     'comando': 'sh tests/leituras/ferramenta_conferir_tudo.sh',
     'conhecido_positivo': {'planta-build-falhado (o ensaio novo contra o guião da cabeça f39554fd8, antes da correção)': codigo('planta-build-falhado.code')}},
    {'nome': 'check:leituras', 'valor': codigo('check-leituras.code'), 'comando': 'npm run check:leituras',
     'conhecido_positivo': 'não prende o ensaio .sh: o check:leituras só descobre tests/leituras/*.py'},
    {'nome': 'typecheck', 'valor': codigo('typecheck.code'), 'comando': 'npm run typecheck'},
    {'nome': 'conferir-mapa', 'valor': codigo('conferir-mapa.code'),
     'comando': 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'},
    {'nome': 'corrida real, código de saída', 'valor': codigo('real.code'),
     'comando': 'RESEARCHHUB_DIR=<motor> sh scripts/leituras/conferir-tudo.sh <worktree> <pasta fora do repositório> --build'},
    {'nome': 'corrida real, cabeça', 'valor': (C / 'real' / 'cabeca').read_text().strip()},
    {'nome': 'corrida real, passos (build e verify)', 'valor': int(cab.group(2)), 'ficheiros_code': len(passos_code)},
    {'nome': 'corrida real, vermelhos', 'valor': int(cab.group(3)),
     'nao_zero': [p for p in passos_code if codigo(f'real/{p}') != 0]},
    {'nome': 'corrida real, soma das durações dos passos (s)', 'valor': int(cab.group(4))},
]
(AQUI / 'medidas.json').write_text(json.dumps(medidas, ensure_ascii=False, indent=1) + '\n')
print(json.dumps([[m['nome'], m['valor']] for m in medidas], ensure_ascii=False))
