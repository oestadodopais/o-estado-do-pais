#!/usr/bin/env python3
"""Compara os resultados completos por página e largura, sem arredondar medidas.

Uso: python3 tests/leituras/comparar-alvos.py <antes.json[.gz]> <depois.json[.gz]>
Datas, caminhos e plantas novas não são medidas da página. Todas as páginas,
rotas, larguras, células e resultados do axe têm de conservar os mesmos bytes
JSON depois de descodificados. A saída serve de testemunha da comparação.
"""
import gzip
import hashlib
import json
from pathlib import Path
import sys


def ler(nome):
    p = Path(nome)
    corpo = gzip.decompress(p.read_bytes()) if p.suffix == '.gz' else p.read_bytes()
    return json.loads(corpo)


a, b = map(ler, sys.argv[1:3])
chaves = ['paginas', 'rotas', 'larguras', 'celulas', 'axe', 'graves', 'alvos_maus']
iguais = {c: a[c] == b[c] for c in chaves}
def selo(objeto):
    return hashlib.sha256(json.dumps(objeto, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
print(json.dumps({'iguais': iguais, 'passagens': len(a['paginas']),
                  'paginas_antes_sha256': selo(a['paginas']),
                  'paginas_depois_sha256': selo(b['paginas'])}, ensure_ascii=False, indent=2))
sys.exit(0 if all(iguais.values()) else 1)
