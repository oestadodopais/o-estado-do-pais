#!/usr/bin/env python3
"""O inventário das frases depois do K2, escrito por guião a partir da régua das frases.

uso: python3 design/especime-v3/medicoes/k2-2026-10-02/inventario-k2.py <saída do medir-defeitos --json> <registo.json>

Lê a saída da régua das frases (`node scripts/medir-defeitos.mjs --json`, corrida sobre a construção do bloco) e:
  · retira cada linha `viva` que deixou de se render (as leituras inteiras dos cartões, que o K2 parte em duas metades,
    e as frases dos estudos que ganharam a explicação dos termos), com o bloco `k2` e a razão de cada família;
  · acrescenta, numa secção do K2, cada bloco por classificar (a linha que abre a dobra e as frases novas dos
    estudos), com a classe e a razão;
  · regista o bloco em `critica/REVISOES-DO-INVENTARIO.md`, com a leitura por fazer.
Confere cada linha antes de a mudar (o texto da linha é o que a régua diz, e o estado é `viva`), e recusa uma frase
por classificar que não saiba classificar. Escreve o que fez em <registo.json>.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
INVENTARIO = RAIZ / 'design/especime-v3/INVENTARIO-FRASES.md'
REVISOES = RAIZ / 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md'

LEITURAS = {'l1', 'l1-correcao', 'rp1b', 'rp1c', 'c1', 'ue1d'}
ESTUDOS = {'b1-peca3', 'e1', 'e1c'}
RAZAO_LEITURA = ('desde o K2 (02.10.2026) a leitura do cartão rende-se em duas metades, a que diz o que o número é '
                 'dentro da dobra «O que é este número» e a que compara à vista, e nas páginas dos assuntos nenhuma das '
                 'duas se conta no inventário, porque a K17 as confere parte a parte na mesma corrida do check:voz (o '
                 'brief K2, item 1); a frase inteira deixou de se render')
RAZAO_ESTUDO = ('a frase do estudo ganhou a explicação dos termos que um leitor comum não conhecia (o brief K2, item 7, '
                'e a I182), sem mudar um número nem a origem registada; a frase nova está na secção do K2')

NOVAS = {
    'O que é este número': ('navegacao', 'A linha que abre a definição dobrada de cada cartão de medida (o `<summary>` da dobra), com as palavras do brief K2 (item 1 e decisão 1), nas páginas dos assuntos, das áreas, dos concelhos e em «Lugares».'),
    'What this number is': ('navegacao', 'A mesma linha na edição inglesa.'),
}
PREFIXOS_DOS_ESTUDOS = [
    ('Do dinheiro do plano de recuperação contratado no concelho', 'A frase da leitura do estudo do dinheiro público de fora da câmara, com a localização de projeto vencida explicada (o brief K2, item 7): a parte de cada projeto que o registo atribui ao concelho cuja data prevista de conclusão já passou sem conclusão registada, pela secção do que está vencido do próprio estudo.'),
    ('Of the recovery-plan money contracted in the municipality', 'A mesma frase na edição inglesa.'),
    ('Os pelouros de Évora ficam com a lista do presidente', 'A frase da leitura do estudo de quem governou a câmara (e da edição datada dos pelouros), com a designação de pelouro explicada (o brief K2, item 7): uma área do trabalho da câmara que o presidente atribui por despacho, pela frase do próprio estudo.'),
    ('Évora’s portfolios sit with the president’s own list', 'A mesma frase na edição inglesa.'),
    ('A penalização por antecipar a reforma um ano', 'A frase da leitura do estudo das penalizações, com o valor atuarialmente neutro e as duas portas explicados (o brief K2, item 7, e a I182), pelas frases do próprio estudo.'),
    ('The penalty for retiring one year early', 'A mesma frase na edição inglesa.'),
]


def classificar(texto):
    if texto in NOVAS:
        return NOVAS[texto]
    for prefixo, razao in PREFIXOS_DOS_ESTUDOS:
        if texto.startswith(prefixo):
            return ('conteudo', razao)
    raise SystemExit(f'não sei classificar «{texto[:80]}»; acrescenta-a à lista deste guião com a razão')


def main():
    defeitos = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    registo_saida = Path(sys.argv[2])
    fc = defeitos['frases_da_casa']
    vivas = fc['declaracoes']['vivas_que_nao_rendem']
    por_classificar = []
    for rota, x in fc['por_rota'].items():
        for t in x.get('nao_classificados', []):
            if t not in por_classificar:
                por_classificar.append(t)

    linhas = INVENTARIO.read_text(encoding='utf-8').split('\n')
    retiradas = []
    for v in vivas:
        i = v['n'] - 1
        celulas = linhas[i].split(' | ')
        assert linhas[i].startswith('| ') and len(celulas) >= 5, f'a linha {v["n"]} não é uma linha da tabela'
        classe = celulas[0][2:]
        texto = celulas[1]
        bloco = celulas[2]
        estado = celulas[3]
        assert estado == 'viva', f'a linha {v["n"]} não está viva ({estado})'
        assert texto == v['texto'], f'a linha {v["n"]} não diz o que a régua diz'
        if bloco in LEITURAS:
            razao = RAZAO_LEITURA
        elif bloco in ESTUDOS:
            razao = RAZAO_ESTUDO
        else:
            raise SystemExit(f'a linha {v["n"]} é do bloco «{bloco}», que este guião não sabe retirar')
        linhas[i] = f'| {classe} | {texto} | k2 | retirada | {razao} |'
        retiradas.append({'n': v['n'], 'bloco_antes': bloco, 'texto': texto})

    novas = []
    for t in por_classificar:
        classe, razao = classificar(t)
        novas.append({'classe': classe, 'texto': t, 'razao': razao})
    seccao = [
        '',
        '## K2 · o cartão para o telemóvel, 02.10.2026',
        '',
        'A linha que abre a definição dobrada de cada cartão de medida, nas duas edições, e as frases das leituras dos',
        'estudos com os termos explicados (o brief K2, items 1 e 7). As leituras dos cartões nacionais não entram: desde o',
        'K2 rendem-se em duas metades, e nas páginas dos assuntos nenhuma das duas se conta no inventário, porque a K17 as',
        'confere parte a parte na mesma corrida do `check:voz` (a regra do PP1, alargada às duas metades em',
        '`scripts/medir-defeitos.mjs`); as linhas das leituras inteiras saem como retiradas, com a razão.',
        '',
        '| classe | texto | bloco | estado | razão |',
        '| --- | --- | --- | --- | --- |',
    ] + [f'| {n["classe"]} | {n["texto"]} | k2 | viva | {n["razao"]} |' for n in novas]
    texto_final = '\n'.join(linhas).rstrip('\n') + '\n' + '\n'.join(seccao) + '\n'
    if '## K2 · o cartão para o telemóvel' in '\n'.join(linhas):
        raise SystemExit('a secção do K2 já existe no inventário; o guião corre uma vez')
    INVENTARIO.write_text(texto_final, encoding='utf-8')

    rev = REVISOES.read_text(encoding='utf-8').rstrip('\n')
    rev += ('\n\n## K2 · o cartão para o telemóvel, 02.10.2026\n\n'
            '| bloco | mudança | estado | nota |\n| --- | --- | --- | --- |\n'
            f'| k2 | {len(novas)} cadeias novas, {len(retiradas)} retiradas | por ler pelo lugar de direção antes de aterrar | '
            'Claude Opus 5.5, construtor do K2: a linha «O que é este número» que abre a definição dobrada de cada cartão, '
            'nas duas línguas; as frases dos três estudos com os termos explicados (a designação de pelouro, a localização '
            'de projeto vencida, o valor atuarialmente neutro e as duas portas), nas duas línguas; e retiradas as leituras '
            'inteiras dos cartões nacionais, que passam a render-se em duas metades conferidas pela K17, e as frases antigas '
            'dos estudos. A leitura cruzada do diff faz-se antes da fusão. |\n')
    REVISOES.write_text(rev, encoding='utf-8')
    registo_saida.write_text(json.dumps({'retiradas': retiradas, 'novas': novas}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(retiradas)} linhas retiradas, {len(novas)} novas')


if __name__ == '__main__':
    main()
