#!/usr/bin/env python3
"""A entrada §1.196 do `DECISIONS.md`, copiada do §7 do mandato ME1 sem mudar uma palavra, com os resumos medidos.

O texto da entrada é do lugar de direção (o bloco de código do §7 de
`design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md`); este guião só põe nos lugares dos resumos os doze
primeiros hexadecimais do sha256 de cada texto governado, com as mudanças de linha normalizadas, que é a conta
de `resumoDoTexto()` em `scripts/check-ledger.mjs`: `<RESUMO>` é o de `src/data/metodo.mjs` e, desde a decisão
do ME1-21 (a amarra passa a carimbar também a política), `<RESUMO-POLITICA>` é o de `src/data/politica-ia.mjs`.
Escreve a entrada no fim do ficheiro. Se o ficheiro já tem uma entrada §1.196, troca-a inteira pela do mandato
(é o mandato que manda no texto, e o lugar de direção pode mudá-lo depois de ler as frases construídas, como fez
na passagem de correção); o guião continua a mudar só os lugares dos resumos. Imprime os resumos e a forma como
foram medidos.

uso: python3 entrada-da-decisao.py <raiz do sítio>"""
import hashlib, pathlib, re, sys

RAIZ = pathlib.Path(sys.argv[1]).resolve()
mandato = (RAIZ / 'design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md').read_text(encoding='utf-8')
seccao = mandato[mandato.index('## §7 · A entrada do `DECISIONS.md`'):]
bloco = re.search(r'```\n(### 1\.196 .*?)\n```', seccao, re.S)
assert bloco, 'o mandato não tem o bloco da entrada no §7'
entrada = bloco.group(1)
LUGARES = {'<RESUMO>': 'src/data/metodo.mjs', '<RESUMO-POLITICA>': 'src/data/politica-ia.mjs'}
for lugar in LUGARES:
    assert entrada.count(lugar) == 1, f'a entrada tem de ter um só lugar {lugar}'

def resumo_de(rel):
    bytes_ = (RAIZ / rel).read_text(encoding='utf-8').replace('\r\n', '\n')
    return hashlib.sha256(bytes_.encode('utf-8')).hexdigest()[:12]

resumos = {lugar: resumo_de(rel) for lugar, rel in LUGARES.items()}
for lugar, resumo in resumos.items():
    entrada = entrada.replace(lugar, resumo)
assert '<RESUMO' not in entrada, 'ficou um lugar de resumo por preencher'

decisoes = RAIZ / 'DECISIONS.md'
texto = decisoes.read_text(encoding='utf-8')
marca = '\n### 1.196 '
if marca in texto:
    assert texto.count(marca) == 1, 'há mais de uma entrada §1.196 no ficheiro'
    inicio = texto.index(marca) + 1
    seguinte = texto.find('\n### ', inicio)
    fim = len(texto) if seguinte < 0 else seguinte + 1
    antiga = texto[inicio:fim].rstrip('\n')
    texto = texto[:inicio] + entrada + '\n' + texto[fim:]
    tira = lambda s: re.sub(r'(metodo|politica) [0-9a-f]{12}', r'\1 <RESUMO>', s)
    igual = tira(antiga) == tira(entrada)
    print('entrada já estava; ' + ('só os resumos mudaram' if igual else 'trocada pela do mandato, com os resumos de hoje'))
else:
    assert texto.endswith('\n')
    texto = texto + '\n' + entrada + '\n'
    print('entrada escrita no fim do ficheiro')
decisoes.write_text(texto, encoding='utf-8')
for lugar, rel in LUGARES.items():
    print(f'resumo de {rel}: {resumos[lugar]} (sha256 dos bytes com as mudanças de linha normalizadas, 12 primeiros hex)')
