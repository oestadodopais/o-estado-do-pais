#!/usr/bin/env python3
"""As quatro linhas do inventário com contagens da prova, na forma agrupada (K2, item 5 do brief).

uso: python3 design/especime-v3/medicoes/k2-2026-10-02/inventario-contagens-k2.py

As frases do índice do livro-razão e do índice dos concelhos levam as contagens da prova por dentro, e o inventário
guarda-as com os números (é a prática da casa, escrita no cabeçalho do inventário). Desde o K2 as contagens de quatro
algarismos ou mais escrevem-se com os milhares separados, e as quatro linhas mudam de texto: o guião troca cada uma
pela forma nova, com o bloco `k2` e a razão, e confere que a linha antiga existe e está viva. Atualiza a entrada do
bloco nas revisões do inventário.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
INV = RAIZ / 'design/especime-v3/INVENTARIO-FRASES.md'
REV = RAIZ / 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md'
TROCAS = {
    '2767 linhas · 308 concelhos': '2 767 linhas · 308 concelhos',
    '2767 rows · 308 municipalities': '2 767 rows · 308 municipalities',
    '3009 afirmações · 330 de 3009 calculadas · 2767 de 3009 linhas de concelhos': '3 009 afirmações · 330 de 3 009 calculadas · 2 767 de 3 009 linhas de concelhos',
    '3009 claims · 330 of 3009 calculated · 2767 of 3009 municipality rows': '3 009 claims · 330 of 3 009 calculated · 2 767 of 3 009 municipality rows',
}
RAZAO = ('as contagens da prova de quatro algarismos ou mais escrevem-se com os milhares separados desde o K2 (02.10.2026, '
         'item 5 do brief; `src/lib/formato.mjs`, conferido pelo portão de HTML e pela F1 do check:formato), e a frase muda '
         'com elas; os números são os mesmos')
linhas = INV.read_text(encoding='utf-8').split('\n')
feitas = 0
for i, l in enumerate(linhas):
    c = l.split(' | ')
    if len(c) >= 5 and c[1] in TROCAS:
        assert c[3] == 'viva', f'a linha {i + 1} não está viva'
        linhas[i] = f'{c[0]} | {TROCAS[c[1]]} | k2 | viva | {RAZAO} |'
        feitas += 1
assert feitas == len(TROCAS), f'trocaram-se {feitas} de {len(TROCAS)} linhas'
INV.write_text('\n'.join(linhas), encoding='utf-8')
rev = REV.read_text(encoding='utf-8')
a = '| k2 | 8 cadeias novas, 46 retiradas |'
assert rev.count(a) == 1
REV.write_text(rev.replace(a, '| k2 | 8 cadeias novas, 46 retiradas, 4 mudadas de texto (as contagens da prova com os milhares separados) |'), encoding='utf-8')
print(f'{feitas} linhas mudadas de texto')
