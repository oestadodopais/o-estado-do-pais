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


def comparar(a, b):
    chaves = ['paginas', 'rotas', 'larguras', 'celulas', 'axe', 'graves', 'alvos_maus']
    iguais = {c: a[c] == b[c] for c in chaves}
    def selo(objeto):
        return hashlib.sha256(json.dumps(objeto, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    return {'iguais': iguais, 'passagens': len(a['paginas']),
            'paginas_antes_sha256': selo(a['paginas']),
            'paginas_depois_sha256': selo(b['paginas'])}


def principal():
    if len(sys.argv) == 1:
        # O modo sem argumentos entra na cadeia e prova a comparação com dados próprios.
        a = {k: [] for k in ['paginas', 'rotas', 'larguras', 'celulas', 'axe', 'graves', 'alvos_maus']}
        assert all(comparar(a, a)['iguais'].values()), 'o controlo igual divergiu'
        b = {**a, 'paginas': [{'planta': 'alterada'}]}
        r = comparar(a, b)
        assert not r['iguais']['paginas'], 'a página alterada não fechou a comparação'
        print(json.dumps({'ok': True, 'casos': [{'planta': 'página alterada',
              'mensagem': 'paginas: comparação diferente', 'passou': True}]}, ensure_ascii=False))
        return 0
    a, b = map(ler, sys.argv[1:3])
    r = comparar(a, b)
    print(json.dumps(r, ensure_ascii=False, indent=2))
    return 0 if all(r['iguais'].values()) else 1


if __name__ == '__main__':
    raise SystemExit(principal())
