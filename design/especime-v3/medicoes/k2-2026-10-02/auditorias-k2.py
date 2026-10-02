#!/usr/bin/env python3
"""As auditorias das palavras que o K2 mudou (items 3 e 4 do brief), escritas por guião e não à mão.

uso: python3 design/especime-v3/medicoes/k2-2026-10-02/auditorias-k2.py

Muda três folhas de `tests/cartao/leituras-provadas.json` (a auditoria da K17) e acrescenta uma pergunta a
`tests/cartao/perguntas-provadas.json` (a auditoria da K16), cada parte com o literal que a apoia, e regista a leitura
em `leituras` das duas auditorias. As folhas antigas saem por inteiro, porque o texto delas deixou de existir na
declaração; nenhuma outra folha nem nenhuma outra pergunta se toca. É idempotente: corrido outra vez, não muda nada.
As células conferem cada literal contra o campo que cita, na construção (a K17 e a K16 do `check:cartao`).
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
LEITURAS = RAIZ / 'tests/cartao/leituras-provadas.json'
PERGUNTAS = RAIZ / 'tests/cartao/perguntas-provadas.json'
CE = 'ce-swd-2026-222-disparidade-de-emprego'
QUEM = {'quem': 'Claude Opus 5.5', 'quando': '2026-10-02'}

FOLHAS = {
    'pib-real-per-capita-2025': {
        'antes_pt': 'É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços.',
        'folha': {
            'pt': 'É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços, a que a unidade chama volumes encadeados.',
            'en': 'It is the value of everything the country produced in the year, per inhabitant, excluding the rise in prices, which the unit calls chain linked volumes.',
            'partes': None,  # as partes antigas ficam, menos o ponto final, e entra a parte nova antes dele
            'nova': {
                'pt': ', a que a unidade chama volumes encadeados', 'en': ', which the unit calls chain linked volumes', 'classe': 'diz',
                'apoios': [
                    {'linha': 'propria', 'campo': 'unit', 'literal': 'volumes encadeados'},
                    {'origem': 'eurostat-nama10-volumes', 'campo': 'excerto', 'literal': 'presented as chain linked volumes'},
                ],
            },
        },
    },
    'desempenho-das-exportacoes-2025': {
        'antes_pt': 'É quanto mudou em três anos a quota de Portugal nas exportações das economias avançadas.',
        'folha': {
            'pt': 'É quanto mudou em três anos a quota de Portugal nas exportações das economias avançadas: a parte que as exportações de bens e serviços de Portugal têm no total das exportações dos países da OCDE e dos países da União que não são da OCDE.',
            'en': 'It is how much Portugal’s share of the exports of advanced economies changed over three years: the part that Portugal’s exports of goods and services make up of the total exports of OECD countries and of EU countries outside the OECD.',
            'partes': [
                {
                    'pt': 'É quanto mudou em três anos a quota de Portugal nas exportações das economias avançadas',
                    'en': 'It is how much Portugal’s share of the exports of advanced economies changed over three years',
                    'classe': 'diz',
                    'apoios': [
                        {'linha': 'propria', 'campo': 'document.title', 'literal': 'Share of exports of advanced economies'},
                        {'origem': 'eurostat-tipsbp60-descricao', 'campo': 'excerto', 'literal': 'developments in shares of exports of goods and services'},
                        {'origem': 'eurostat-tipsbp60-descricao', 'campo': 'excerto', 'literal': 'calculated as the 3 year % change'},
                    ],
                },
                {
                    'pt': ': a parte que as exportações de bens e serviços de Portugal têm no total das exportações dos países da OCDE e dos países da União que não são da OCDE',
                    'en': ': the part that Portugal’s exports of goods and services make up of the total exports of OECD countries and of EU countries outside the OECD',
                    'classe': 'diz',
                    'apoios': [
                        {'origem': 'eurostat-tipsbp60-descricao', 'campo': 'excerto', 'literal': 'shares of exports of goods and services of EU Member States in relation to total exports of goods and services of OECD countries and non-OECD EU Member States'},
                        {'linha': 'propria', 'campo': 'unit', 'literal': '% do total OCDE e UE não-OCDE'},
                    ],
                },
                {'pt': '.', 'en': '.', 'classe': 'liga'},
            ],
        },
    },
    'disparidade-de-emprego-entre-sexos-2025': {
        'origens': ['eurostat-tesem060-descricao', CE],
        'folhas': [
            {
                'antes_pt': 'É a diferença entre a percentagem de homens dos ',
                'pt': 'É a diferença, em pontos percentuais, entre a taxa de emprego dos homens dos ',
                'en': 'It is the difference, in percentage points, between the employment rate of men aged ',
                'partes': [
                    {
                        'pt': 'É a diferença, em pontos percentuais, entre a taxa de emprego dos homens dos ',
                        'en': 'It is the difference, in percentage points, between the employment rate of men aged ',
                        'classe': 'diz',
                        'apoios': [
                            {'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'the difference between the employment rates of men and women'},
                            {'origem': CE, 'campo': 'excerto', 'literal': 'Gender employment gap (percentage points'},
                        ],
                    },
                ],
            },
            {
                'antes_pt': ' anos com emprego e a percentagem de mulheres com emprego.',
                'pt': ' anos e a das mulheres.',
                'en': ' and that of women.',
                'partes': [
                    {
                        'pt': ' anos e a das mulheres.', 'en': ' and that of women.', 'classe': 'diz',
                        'apoios': [{'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'the employment rates of men and women aged 20-64'}],
                    },
                ],
            },
        ],
    },
}

PERGUNTA = {
    'id': 'disparidade-de-emprego-entre-sexos-2025',
    'origens': ['eurostat-tesem060-descricao', CE],
    'pergunta': {
        'pt': 'Qual é a diferença, em pontos percentuais, entre a taxa de emprego dos homens dos 20 aos 64 anos e a das mulheres?',
        'en': 'What is the difference, in percentage points, between the employment rate of men aged 20 to 64 and that of women?',
    },
    'mudanca': None,
    'pedacos': [
        {'pt': 'Qual é a diferença', 'en': 'What is the difference',
         'apoios': [{'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'defined as the difference between the employment rates'}]},
        {'pt': ', em pontos percentuais,', 'en': ', in percentage points,',
         'apoios': [{'origem': CE, 'campo': 'excerto', 'literal': '(percentage points, population aged 20-64'}]},
        {'pt': ' entre a taxa de emprego dos homens ', 'en': ' between the employment rate of men ',
         'apoios': [{'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'the employment rates of men and women'}]},
        {'pt': 'dos 20 aos 64 anos ', 'en': 'aged 20 to 64 ',
         'apoios': [{'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'men and women aged 20-64'}]},
        {'pt': 'e a das mulheres?', 'en': 'and that of women?',
         'apoios': [{'origem': 'eurostat-tesem060-descricao', 'campo': 'excerto', 'literal': 'employment rates of men and women'}]},
    ],
}


def main():
    leituras = json.loads(LEITURAS.read_text(encoding='utf-8'))
    medidas = {m['id']: m for m in leituras['medidas']}
    # o PIB por habitante: a folha cresce uma parte antes do ponto final
    m = medidas['pib-real-per-capita-2025']
    f = FOLHAS['pib-real-per-capita-2025']['folha']
    folha = next((x for x in m['folhas'] if x['pt'] in (FOLHAS['pib-real-per-capita-2025']['antes_pt'], f['pt'])), None)
    assert folha, 'a folha do PIB por habitante não está na auditoria'
    if folha['pt'] != f['pt']:
        assert folha['partes'][-1] == {'pt': '.', 'en': '.', 'classe': 'liga'}, 'a última parte da folha do PIB não é o ponto final'
        folha['partes'] = folha['partes'][:-1] + [f['nova'], {'pt': '.', 'en': '.', 'classe': 'liga'}]
        folha['pt'], folha['en'] = f['pt'], f['en']
    # a quota nas exportações: a primeira folha refeita
    m = medidas['desempenho-das-exportacoes-2025']
    f = FOLHAS['desempenho-das-exportacoes-2025']
    folha = next((x for x in m['folhas'] if x['pt'] in (f['antes_pt'], f['folha']['pt'])), None)
    assert folha, 'a folha da quota nas exportações não está na auditoria'
    folha.update({'pt': f['folha']['pt'], 'en': f['folha']['en'], 'partes': f['folha']['partes']})
    # a diferença de emprego entre sexos: as duas folhas de texto, e a origem nova na lista da medida
    m = medidas['disparidade-de-emprego-entre-sexos-2025']
    d = FOLHAS['disparidade-de-emprego-entre-sexos-2025']
    m['origens'] = d['origens']
    for nova in d['folhas']:
        folha = next((x for x in m['folhas'] if x['pt'] in (nova['antes_pt'], nova['pt'])), None)
        assert folha, f'a folha «{nova["antes_pt"]}» não está na auditoria'
        folha.update({'pt': nova['pt'], 'en': nova['en'], 'partes': nova['partes']})
    registo = {**QUEM, 'o_que': 'o K2, items 3 e 4 do brief: a diferença de emprego entre sexos diz que é a diferença entre duas taxas, em pontos percentuais (com a origem nova do quadro do Painel Social no Relatório por País de Portugal); a quota nas exportações diz em palavras comuns o que é a quota e quem são as economias avançadas; o PIB por habitante diz o que a unidade chama volumes encadeados'}
    if registo not in leituras['leituras']:
        leituras['leituras'].append(registo)
    LEITURAS.write_text(json.dumps(leituras, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    perguntas = json.loads(PERGUNTAS.read_text(encoding='utf-8'))
    if not any(q['id'] == PERGUNTA['id'] for q in perguntas['perguntas']):
        perguntas['perguntas'].append(PERGUNTA)
    registo_p = {**QUEM, 'o_que': 'o K2, item 3 do brief: a pergunta da diferença de emprego entre sexos, nova, pedaço a pedaço, com a descrição do Eurostat e o quadro do Painel Social do Relatório por País de Portugal (a unidade em pontos percentuais)'}
    if registo_p not in perguntas['leituras']:
        perguntas['leituras'].append(registo_p)
    PERGUNTAS.write_text(json.dumps(perguntas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('auditorias escritas')


if __name__ == '__main__':
    main()
