#!/usr/bin/env python3
"""A auditoria das palavras da primeira explicação (bloco EX1, 05.10.2026, o ponto 3 do mandato).

Escreve a secção «explicacoes» de tests/cartao/leituras-provadas.json: cada folha de texto da declaração
src/data/explicacoes/dinheiro-do-estado-2026.mjs, nas duas edições, dividida em partes, e cada parte com a sua classe
e, quando diz o que uma coisa é, o literal que a apoia (numa origem declarada ou num campo publicado de uma linha que a
explicação nomeia). A célula X (tests/explicacoes/explicacao.mjs) confere que as partes juntas são cada folha, que cada
literal está mesmo no campo que cita, que cada «conta» vive num ramo do sinal ou em palavras guardadas por condições,
que cada «aponta» nomeia uma secção que está acima, e que cada «liga» só tem pontuação e palavras da lista fechada.
Não infere que o literal quer dizer o que a parte diz: isso é a leitura de quem assina (Claude Opus 5.5, 05.10.2026).

EX1-b (06.10.2026, as decisões do lugar de direção sobre as I212, I213, I215 e I216) e EX1-c (as correções da
leitura a frio: os nomes dos ministérios por token, a frase dos dois totais com o que cada conta inclui, o lado da dívida
pelo token `compara`, os ramos do sinal com a explicação e o ramo zero, os juros sem prosa sobre a casa, e a última frase
só com a porta dos recibos): as folhas novas e mudadas. Duas
classes ganham forma: «leitura», uma parte que nenhuma origem diz com estas palavras e que é a leitura do projeto sobre o
que os campos citados definem (leva `sobre` e apoios, conferidos como os de «diz»); e «aponta», que pode apontar também
para uma porta do fim que a explicação declara (`porta`) ou para os selos dos números da página (`alvo: 'selos'`). As
palavras do token `maiores` são folhas próprias, e a «conta» vive nelas como num ramo.

Corre-se da raiz do sítio: python3 design/especime-v3/medicoes/ex1-2026-10-05/auditoria-da-explicacao.py
Com --conferir, não escreve: sai a 1 se o ficheiro não tiver a secção que este guião compõe.
"""
import json, pathlib, sys

RAIZ = pathlib.Path(__file__).resolve().parents[4]
FICHEIRO = RAIZ / 'tests' / 'cartao' / 'leituras-provadas.json'

DG = 'dados-gov-oe-despesa-funcional'
CF = 'eurostat-cofog-divisao-01'
DIV = 'eurostat-tipsgo10-descricao'
PIB = 'eurostat-tipsna40-descricao'
SAL = 'eurostat-gfs-saldo'

def o(origem, literal, campo='excerto'):
    return {'origem': origem, 'campo': campo, 'literal': literal}

def l(linha, campo, literal):
    return {'linha': linha, 'campo': campo, 'literal': literal}

def diz(pt, en, *apoios):
    return {'pt': pt, 'en': en, 'classe': 'diz', 'apoios': list(apoios)}

def conta(pt, en):
    return {'pt': pt, 'en': en, 'classe': 'conta'}

def liga(pt, en):
    return {'pt': pt, 'en': en, 'classe': 'liga'}

def aponta(pt, en, secao):
    return {'pt': pt, 'en': en, 'classe': 'aponta', 'secao': secao}

def aponta_porta(pt, en, porta):
    return {'pt': pt, 'en': en, 'classe': 'aponta', 'porta': porta}

def aponta_selos(pt, en):
    return {'pt': pt, 'en': en, 'classe': 'aponta', 'alvo': 'selos'}

def leitura(pt, en, sobre, *apoios):
    return {'pt': pt, 'en': en, 'classe': 'leitura', 'sobre': sobre, 'apoios': list(apoios)}

F07 = 'oe-2026-cem-euros-funcao-07'
FUNCAO_07 = 'oe-2026-despesa-funcao-07'
MF = 'oe-2026-cem-euros-ministerio-financas'
DMF = 'oe-2026-despesa-ministerio-financas'
DMS = 'oe-2026-despesa-ministerio-saude'
DMT = 'oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social'
DME = 'oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao'
EXD = 'execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social'
EXR = 'execucao-2026-08-receita-efetiva-administracao-central-seguranca-social'
P001 = 'execucao-2026-08-despesa-programa-001'
F09 = 'oe-2026-cem-euros-funcao-09'
DV = 'divida-publica-2025'
DVUE = 'divida-publica-2025-ue'
SALDO = 'saldo-das-administracoes-publicas-2025'

POR_CEM = (l(F07, 'derivation', 'multiplicar por cem'), l(F07, 'derivation_en', 'multiply by one hundred'))
AFETACAO = o(DG, 'afetação dos recursos públicos')

FOLHAS = [
    ('titulo[0]', [diz('Para onde vai o dinheiro do Estado', 'Where the State’s money goes', AFETACAO), liga(' em ', ' in ')]),
    ('abertura[0][0]', [diz('O Orçamento do Estado', 'The State Budget', o(DG, 'Orçamento do Estado')), liga(' para ', ' for ')]),
    ('abertura[0][2]', [
        diz(' diz, euro a euro,', ' says, euro by euro,', l(DMF, 'unit', 'euros'), o(DG, 'contemplam as despesas a pagar no ano')),
        diz(' para onde vai o dinheiro.', ' where the money goes.', AFETACAO),
        diz(' De cada cem euros, ', ' Of every hundred euros, ', *POR_CEM),
    ]),
    ('abertura[0][4]', [diz(' vão para a ', ' go to ', AFETACAO)]),
    ('abertura[0][6]', [liga(', ', ', ')]),
    ('abertura[0][8]', [liga(' para a ', ' to ')]),
    ('abertura[0][10]', [liga(', ', ', ')]),
    ('abertura[0][12]', [liga(' para a ', ' to ')]),
    ('abertura[0][14]', [liga(' e ', ' and ')]),
    ('abertura[0][16]', [liga(' para os ', ' to ')]),
    ('abertura[0][18]', [liga('.', '.')]),
    ('abertura[0][19].se[0]', [conta(' A maior fatia, ', ' The largest share, ')]),
    ('abertura[0][19].se[2]', [conta(', é a dos ', ', is ')]),
    ('abertura[0][19].se[4]', [
        diz(', onde a classificação das funções', ', where the classification of functions', o(DG, 'Classificação das Funções do Governo')),
        diz(' conta os juros da dívida', ' counts the interest on the debt', o(CF, 'Public debt transactions')),
        diz(' e as transferências entre administrações.', ' and the transfers between levels of government.', o(CF, 'Transfers of a general character between different levels of government')),
    ]),
    ('seccoes[0].titulo', [diz('Por função', 'By function', l(FUNCAO_07, 'document.title', 'classificação funcional'))]),
    ('seccoes[0].conteudo[0].figura.titulo', [
        diz('As dez funções', 'The ten functions', l(FUNCAO_07, 'document.title', 'classificação funcional')),
        diz(', de cada cem euros', ', of every hundred euros', *POR_CEM),
    ]),
    ('seccoes[0].conteudo[1].paragrafo[0]', [liga('A ', '')]),
    ('seccoes[0].conteudo[1].paragrafo[2]', [diz(' leva ', ' takes ', AFETACAO)]),
    ('seccoes[0].conteudo[1].paragrafo[4]', [liga(', a ', ', ')]),
    ('seccoes[0].conteudo[1].paragrafo[6]', [liga(' ', ' ')]),
    ('seccoes[0].conteudo[1].paragrafo[8]', [liga(', a ', ', ')]),
    ('seccoes[0].conteudo[1].paragrafo[10]', [liga(' ', ' ')]),
    ('seccoes[0].conteudo[1].paragrafo[12]', [liga(', a ', ', ')]),
    ('seccoes[0].conteudo[1].paragrafo[14]', [liga(' ', ' ')]),
    ('seccoes[0].conteudo[1].paragrafo[16]', [liga(' e o ', ' and ')]),
    ('seccoes[0].conteudo[1].paragrafo[18]', [liga(' ', ' ')]),
    ('seccoes[0].conteudo[1].paragrafo[20]', [liga('.', '.')]),
    ('seccoes[1].titulo', [diz('Por ministério', 'By ministry', l(DMF, 'document.locator', 'POR MINISTÉRIOS'))]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[0]', [
        diz('Visto pelos ministérios', 'Seen by ministry', l(DMF, 'document.locator', 'POR MINISTÉRIOS')),
        conta(', o maior é ', ', the largest is '),
    ]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[2]', [liga(', com ', ', with ')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[4]', [diz(' de cada cem euros, ', ' of every hundred euros, ', l(MF, 'derivation', 'multiplicar por cem'), l(MF, 'derivation_en', 'multiply by one hundred'))]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[5].sufixo', [diz(' euros', ' euros', l(DMF, 'unit', 'euros'))]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[0]', [conta('; seguem-se ', '; then come ')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[2]', [liga(' (', ' (')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[4]', [liga('), ', '), ')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[6]', [liga(' (', ' (')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[8]', [liga(') e ', ') and ')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[10]', [liga(' (', ' (')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[6].se[12]', [liga(')', ')')]),
    ('seccoes[1].conteudo[0].paragrafo[0].se[7]', [liga('.', '.')]),
    ('seccoes[1].conteudo[1].figura.titulo', [
        diz('Os dezasseis ministérios', 'The sixteen ministries', l(DMF, 'document.locator', 'POR MINISTÉRIOS')),
        diz(', de cada cem euros', ', of every hundred euros', l(MF, 'derivation', 'multiplicar por cem'), l(MF, 'derivation_en', 'multiply by one hundred')),
    ]),
    ('seccoes[1].conteudo[2].paragrafo[0]', [
        diz('As duas contas não batem porque medem coisas diferentes', 'The two counts do not match because they measure different things',
            l(MF, 'derivation', 'não mede a repartição da despesa efetiva consolidada'), l(MF, 'derivation_en', 'it does not measure the allocation of consolidated effective expenditure')),
        liga(': ', ': '),
        diz('a conta por função soma o que a administração central gasta com cada fim', 'the count by function adds up what central government spends on each purpose',
            o(DG, 'especifica os fins e atividades típicos do Estado'), o(DG, 'abrangem todas as entidades públicas integradas no perímetro da Administração Central')),
        diz(', como a saúde ou a educação', ', such as health or education', l(F07, 'nome', 'saúde'), l(F09, 'nome', 'educação'), l(F07, 'nome', 'health'), l(F09, 'nome', 'education')),
        diz(', sem as operações financeiras nem as transferências entre os seus serviços', ', without financial transactions or transfers between its own services',
            o(DG, 'excluem os fluxos relativos a operações financeiras'), l(F07, 'ressalva', 'exclui ativos e passivos financeiros e transferências internas entre os serviços considerados')),
        liga('; ', '; '),
        diz('a conta por ministério é o orçamento de cada ministério', 'the count by ministry is each ministry’s budget',
            l(MF, 'derivation', 'despesa bruta deste ministério'), l(DMF, 'document.locator', 'POR MINISTÉRIOS')),
        diz(', com as operações financeiras e as transferências entre serviços do Estado.', ', including financial transactions and transfers between State services.',
            l(MF, 'ressalva', 'inclui operações financeiras e transferências entre serviços do Estado'), l(MF, 'ressalva_en', 'includes financial transactions and transfers between State services')),
    ]),
    ('seccoes[2].titulo', [diz('O que já se gastou este ano', 'What has been spent this year', l(EXD, 'name', 'Despesa efetiva'), l(EXD, 'unit', 'acumulados de janeiro a agosto'))]),
    ('seccoes[2].conteudo[0].paragrafo[0]', [diz('Até ', 'By ', l(EXD, 'unit', 'acumulados de janeiro a agosto'))]),
    ('seccoes[2].conteudo[0].paragrafo[2]', [
        liga(', ', ', '),
        diz('a administração central e a segurança social', 'central government and social security', l(EXD, 'nome', 'da administração central e da segurança social'), o(DG, 'Administração Central')),
        diz(' tinham gasto ', ' had spent ', l(EXD, 'name', 'Despesa efetiva')),
    ]),
    ('seccoes[2].conteudo[0].paragrafo[3].sufixo', [diz(' milhões de euros', ' million euros', l(EXD, 'unit', 'milhões de euros'))]),
    ('seccoes[2].conteudo[0].paragrafo[4]', [diz(' e recebido ', ' and taken in ', l(EXR, 'name', 'Receita efetiva'))]),
    ('seccoes[2].conteudo[0].paragrafo[5].sufixo', [diz(' milhões', ' million', l(EXR, 'unit', 'milhões de euros'))]),
    ('seccoes[2].conteudo[0].paragrafo[6].frase', [
        liga('; ', '; '),
        diz('os programas', 'the programmes', l(P001, 'document.locator', 'programa')),
        conta(' que mais gastaram foram ', ' that spent the most were '),
    ]),
    ('seccoes[2].conteudo[0].paragrafo[6].antes', [liga('o de ', '')]),
    ('seccoes[2].conteudo[0].paragrafo[6].abre', [liga(' (', ' (')]),
    ('seccoes[2].conteudo[0].paragrafo[6].sufixo', [diz(' milhões', ' million', l(P001, 'unit', 'milhões de euros'))]),
    ('seccoes[2].conteudo[0].paragrafo[6].fecha', [liga(')', ')')]),
    ('seccoes[2].conteudo[0].paragrafo[6].entre', [liga(', ', ', ')]),
    ('seccoes[2].conteudo[0].paragrafo[6].ultimo', [liga(' e ', ' and ')]),
    ('seccoes[2].conteudo[0].paragrafo[7]', [liga('.', '.')]),
    ('seccoes[3].titulo', [diz('A dívida e o saldo', 'Debt and the balance', l(DV, 'excerpt', 'General government gross debt'), l(SALDO, 'document.title', 'deficit/surplus'))]),
    ('seccoes[3].conteudo[0].paragrafo[0]', [diz('No fim de ', 'At the end of ', o(DIV, 'outstanding at the end of the year'))]),
    ('seccoes[3].conteudo[0].paragrafo[2]', [liga(', ', ', '), diz('a dívida pública valia ', 'public debt was worth ', o(DIV, 'debt means total gross debt'), l(DV, 'excerpt', 'General government gross debt'))]),
    ('seccoes[3].conteudo[0].paragrafo[3].sufixo', [liga(' %', ' %')]),
    ('seccoes[3].conteudo[0].paragrafo[4]', [
        diz(' do que o país produz num ano', ' of what the country produces in a year', o(PIB, 'GDP measures the value of total final output of goods and services produced by an economy'), l(DV, 'unit', '% do PIB')),
        liga(', ', ', '),
    ]),
    ('seccoes[3].conteudo[0].paragrafo[5].maior[0]', [conta('acima dos ', 'above the ')]),
    ('seccoes[3].conteudo[0].paragrafo[5].maior[1].sufixo', [liga(' %', ' %')]),
    ('seccoes[3].conteudo[0].paragrafo[5].maior[2]', [diz(' da média da União Europeia', ' average of the European Union', l(DVUE, 'excerpt', 'European Union - 27 countries (from 2020)'))]),
    ('seccoes[3].conteudo[0].paragrafo[5].menor[0]', [conta('abaixo dos ', 'below the ')]),
    ('seccoes[3].conteudo[0].paragrafo[5].menor[1].sufixo', [liga(' %', ' %')]),
    ('seccoes[3].conteudo[0].paragrafo[5].menor[2]', [diz(' da média da União Europeia', ' average of the European Union', l(DVUE, 'excerpt', 'European Union - 27 countries (from 2020)'))]),
    ('seccoes[3].conteudo[0].paragrafo[5].igual[0]', [conta('igual aos ', 'equal to the ')]),
    ('seccoes[3].conteudo[0].paragrafo[5].igual[1].sufixo', [liga(' %', ' %')]),
    ('seccoes[3].conteudo[0].paragrafo[5].igual[2]', [diz(' da média da União Europeia', ' average of the European Union', l(DVUE, 'excerpt', 'European Union - 27 countries (from 2020)'))]),
    ('seccoes[3].conteudo[0].paragrafo[6]', [
        liga(', e ', ', and '),
        diz('as contas públicas fecharam o ano', 'the public accounts closed the year', l(SALDO, 'excerpt', 'General government'), o(SAL, 'The difference between total revenue and total expenditure'), {'linha': SALDO, 'campo': 'reference_date', 'forma': 'ano'}),
        liga(' com um ', ' with a '),
        diz('saldo', 'balance', o(SAL, 'The difference between total revenue and total expenditure'), l(SALDO, 'document.title', 'deficit/surplus')),
        liga(' de ', ' of '),
    ]),
    ('seccoes[3].conteudo[0].paragrafo[7].sufixo', [liga(' %', ' %')]),
    ('seccoes[3].conteudo[0].paragrafo[8]', [diz(' do produto', ' of output', l(SALDO, 'unit', '% do PIB')), liga(', ', ', ')]),
    ('seccoes[3].conteudo[0].paragrafo[9].positivo[0]', [conta('um excedente', 'a surplus'), diz(' (recebeu mais do que gastou)', ' (it took in more than it spent)', o(SAL, 'The difference between total revenue and total expenditure'))]),
    ('seccoes[3].conteudo[0].paragrafo[9].negativo[0]', [conta('um défice', 'a deficit'), diz(' (gastou mais do que recebeu)', ' (it spent more than it took in)', o(SAL, 'The difference between total revenue and total expenditure'))]),
    ('seccoes[3].conteudo[0].paragrafo[9].zero[0]', [conta('um saldo nulo', 'a zero balance'), diz(' (recebeu o mesmo que gastou)', ' (it took in as much as it spent)', o(SAL, 'The difference between total revenue and total expenditure'))]),
    ('seccoes[3].conteudo[0].paragrafo[10]', [liga('.', '.')]),
    ('naoDiz[0][0].se[0]', [
        diz('O orçamento é uma previsão', 'The budget is a forecast', o(DG, 'contemplam as despesas a pagar no ano')),
        diz(': o que se gasta de facto lê-se na execução', ': what is actually spent is read in the budget execution', l(EXD, 'document.title', 'Síntese da Execução Orçamental'), l(EXD, 'nome', 'executada')),
        diz(', mês a mês', ', month by month', l(EXD, 'document.title', 'Síntese da Execução Orçamental | agosto 2026')),
        diz(', e a de agosto', ', and August’s', l(EXD, 'unit', 'acumulados de janeiro a agosto')),
        aponta(' está acima.', ' is above.', 'execucao'),
    ]),
    ('naoDiz[0][1].se[0]', [
        conta(' Falta aqui', ' Missing here is'),
        diz(' o custo dos juros da dívida', ' the cost of the interest on the debt', o(CF, 'Public debt transactions')),
        diz(', que o Orçamento também prevê', ', which the Budget also forecasts', o(DG, 'contemplam as despesas a pagar no ano'), o(CF, 'Public debt transactions')),
        conta(' e que estes números não mostram.', ' and which these figures do not show.'),
    ]),
    ('naoDiz[0][2]', [
        diz(' O detalhe por programa e por ministério', ' The detail by programme and by ministry', l(P001, 'document.locator', 'programa'), l(DMF, 'document.locator', 'POR MINISTÉRIOS')),
        aponta_selos(', com a fonte de cada número, está no recibo de cada um, a um toque.', ', with the source of each figure, is in each one’s receipt, one tap away.'),
    ]),
]

def entrada():
    folhas = []
    for caminho, partes in FOLHAS:
        folhas.append({'caminho': caminho, 'pt': ''.join(p['pt'] for p in partes), 'en': ''.join(p['en'] for p in partes), 'partes': partes})
    usadas = []
    for _, partes in FOLHAS:
        for p in partes:
            for a in p.get('apoios', []):
                if 'origem' in a and a['origem'] not in usadas:
                    usadas.append(a['origem'])
    return {
        'slug': 'dinheiro-do-estado-2026',
        'quem': 'Claude Opus 5.5',
        'quando': '2026-10-06',
        'o_que': 'a primeira leitura (05.10.2026), a do EX1-b e a do EX1-c (06.10.2026, as decisões do lugar de direção sobre as I212, I213, I215 e I216, e as correções da leitura a frio), sobre o texto do brief EX1, §5, ponto 4, com os acertos X1 a X17 da declaração, e sobre as origens das explicações (a descrição do conjunto da despesa por classificação funcional no dados.gov.pt e os rótulos da classificação das funções na resposta do Eurostat, os dois alojados pelo bloco OE1 no motor) e as das definições que os cartões da dívida, do PIB e do saldo já citam',
        'origens': usadas,
        'folhas': folhas,
    }

def main():
    raw = FICHEIRO.read_text(encoding='utf-8')
    d = json.loads(raw)
    nova = entrada()
    if '--conferir' in sys.argv:
        atual = next((x for x in d.get('explicacoes', []) if x.get('slug') == nova['slug']), None)
        if atual != nova:
            print('a secção «explicacoes» do ficheiro não é a que este guião compõe')
            sys.exit(1)
        print(f"a secção confere: {len(nova['folhas'])} folhas, {sum(len(f['partes']) for f in nova['folhas'])} partes, {len(nova['origens'])} origens")
        return
    d['explicacoes'] = [x for x in d.get('explicacoes', []) if x.get('slug') != nova['slug']] + [nova]
    FICHEIRO.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"escrita a secção «explicacoes»: {len(nova['folhas'])} folhas, {sum(len(f['partes']) for f in nova['folhas'])} partes, {len(nova['origens'])} origens ({', '.join(nova['origens'])})")

if __name__ == '__main__':
    main()
