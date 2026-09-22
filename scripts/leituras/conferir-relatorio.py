#!/usr/bin/env python3
"""Confere que cada número de um relatório de construtor existe num ficheiro de medição.

uso: python3 scripts/leituras/conferir-relatorio.py <relatório.md> <pasta> [--json <saída>]

PORQUE EXISTE (M18 e §1.120, 22.09.2026). Os construtores já escrevem ficheiros
de medição ao lado dos relatórios (`capturas-*.json`, `plantas-*.json`,
`medidas.json`, `nomes-no-dist.json`), e os relatórios citam números que nem
sempre estão neles: a leitura a frio do B1c apontou alturas e contagens sem
ficheiro. Um número escrito à mão num relatório é um número por medir, e a regra
da casa é que nenhum número se escreve sem ser medido. Este guião não emenda
nada: lê o relatório, lê os JSON da pasta ao lado, e diz quais dos números do
relatório não estão em ficheiro nenhum.

O QUE CONTA COMO NÚMERO está definido num sítio só, `scripts/leituras/numeros.py`,
e o cabeçalho desse ficheiro diz o que se apaga antes de contar (código, datas,
resumos, secções, ordinais, identificadores, anos isolados) e porquê. Cada classe
apagada sai na linha final da saída, com a sua contagem: nada se apaga em
silêncio.

O CONHECIDO-POSITIVO CORRE PRIMEIRO, e é a razão de este guião não repetir a
falha que o gerou. Antes de conferir o relatório, o guião escolhe um número que
não está em nenhum dos JSON lidos, mete-o numa linha de prova e passa-a pelo
MESMO detetor: se o detetor não o apontar, o guião sai com 2 e não diz «zero em
falta». Um zero de um detetor que não deteta nada não é um zero.

CÓDIGOS DE SAÍDA: 0 quando o conhecido-positivo foi encontrado e nenhum número do
relatório ficou sem ficheiro; 1 quando o conhecido-positivo foi encontrado e há
números sem ficheiro; 2 quando não se conseguiu correr, ou quando o
conhecido-positivo não foi encontrado (nesse caso a contagem de faltas não vale).

LIMITES, DITOS. Um número dentro de crases não se confere, porque é código. Um
número de quatro algarismos entre 1900 e 2100 lê-se como ano e não se confere.
Um número escrito com ponto («1.500») não se confere, porque neste repositório o
ponto separa secções e versões. Encontrar um número num JSON não prova que ele
mede o que a frase diz: prova que foi medido e escrito, que é o que esta
conferência é.
"""
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numeros  # noqa: E402


def uso(msg):
    print(f'conferir-relatorio.py: {msg}', file=sys.stderr)
    print(__doc__.split('\n')[2], file=sys.stderr)
    raise SystemExit(2)


def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    opcoes = [a for a in argv if a.startswith('--')]
    saida_json = None
    for i, a in enumerate(argv):
        if a == '--json':
            if i + 1 >= len(argv):
                uso('--json pede um caminho')
            saida_json = argv[i + 1]
            args = [x for x in args if x != argv[i + 1]]
    for o in opcoes:
        if o != '--json':
            uso(f'opção desconhecida: {o}')
    if len(args) != 2:
        uso('pede <relatório.md> e <pasta das medições>')
    relatorio, pasta = args
    if not os.path.isfile(relatorio):
        uso(f'não existe o relatório {relatorio}')
    if not os.path.isdir(pasta):
        uso(f'não existe a pasta {pasta}')

    texto = open(relatorio, encoding='utf-8', errors='replace').read()
    ficheiros = sorted(
        f for f in glob.glob(os.path.join(pasta, '**', '*.json'), recursive=True)
        if os.path.abspath(f) != os.path.abspath(saida_json or '')
    )
    formas, valores, lidos, ilegiveis = numeros.do_json(ficheiros)

    # O conhecido-positivo: um número que de certeza não está em nenhum ficheiro.
    prova = 987654321
    while str(prova) in formas or float(prova) in valores:
        prova += 1
    linha_de_prova = f'Uma linha de prova com o número {prova} e mais nada.'
    achados_prova, _ = numeros.do_texto(linha_de_prova)
    faltas_prova = numeros.em_falta(achados_prova, formas, valores)
    viu = any(f['bruto'] == str(prova) for f in faltas_prova)

    achados, contagens = numeros.do_texto(texto)
    faltam = numeros.em_falta(achados, formas, valores)

    print(f'relatório: {relatorio}')
    print(f'pasta das medições: {pasta}')
    print(f'ficheiros JSON lidos: {len(lidos)}')
    for c, razao in ilegiveis:
        print(f'   ILEGÍVEL {c}: {razao}')
    print(f'conhecido-positivo (o número {prova}, ausente dos ficheiros, apontado pelo mesmo detetor): '
          + ('encontrado' if viu else 'NÃO ENCONTRADO'))
    print(f'números conferidos: {len(achados)}')
    print(f'números com ficheiro: {len(achados) - len(faltam)}')
    print(f'números sem ficheiro: {len(faltam)}')
    for f in faltam:
        print(f'   l.{f["linha"]} «{f["bruto"]}» em «{f["contexto"]}»')
    print('apagado antes de contar: ' + ', '.join(f'{k} {contagens[k]}' for k in numeros.CLASSES))

    if saida_json:
        os.makedirs(os.path.dirname(os.path.abspath(saida_json)), exist_ok=True)
        with open(saida_json, 'w', encoding='utf-8') as f:
            json.dump({
                'relatorio': relatorio,
                'pasta': pasta,
                'ficheiros_json_lidos': len(lidos),
                'ilegiveis': [{'ficheiro': c, 'razao': r} for c, r in ilegiveis],
                'conhecido_positivo': {'numero': prova, 'encontrado': viu},
                'numeros_conferidos': len(achados),
                'numeros_com_ficheiro': len(achados) - len(faltam),
                'numeros_sem_ficheiro': len(faltam),
                'sem_ficheiro': faltam,
                'apagado_antes_de_contar': contagens,
            }, f, ensure_ascii=False, indent=2)
            f.write('\n')

    if not viu or ilegiveis:
        return 2
    return 1 if faltam else 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
