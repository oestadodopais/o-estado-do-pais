#!/usr/bin/env python3
"""OS ACERTOS DE PALAVRAS ÀS LEITURAS DO LUGAR DE DIREÇÃO (bloco L1, itens 4 e 7, e a passagem de correção de 26.09.2026).

    python3 design/especime-v3/medicoes/l1-2026-09-24/acertos-l1.py            # confere e escreve o registo
    python3 design/especime-v3/medicoes/l1-2026-09-24/acertos-l1.py --confere  # só confere; 1 se o registo estiver velho

O ficheiro das leituras do sítio (`src/data/leituras-das-medidas.mjs`) é o do lugar
de direção (`design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs`) com
estes acertos e com comentários, e com mais nada. Este guião prova-o: aplica as
trocas, cada uma exatamente as vezes declaradas, à cópia do lugar de direção, tira
os comentários de bloco e junta os espaços nos dois ficheiros, e exige que fiquem
iguais. Confere também que cada literal que um acerto invoca está na auditoria das
leituras (`tests/cartao/leituras-provadas.json`) como apoio dessa origem ou desse
campo da linha, que é onde a K17 do `check:cartao` o procura no seu campo.

Escreve `acertos-l1.json` ao lado, com o sha256 dos dois ficheiros, e sai 1 ao
primeiro desacerto sem escrever nada.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
FONTE = RAIZ / 'design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs'
SITIO = RAIZ / 'src/data/leituras-das-medidas.mjs'
AUDITORIA = RAIZ / 'tests/cartao/leituras-provadas.json'
REGISTO = AQUI / 'acertos-l1.json'

# Cada acerto: a chave, a medida, o porquê, os literais que o mandam (origem ou
# campo da linha, e o literal tal como a auditoria o guarda) e as trocas, pela
# ordem em que se aplicam.
ACERTOS = [
    dict(chave='A1', medida='pib-real-per-capita-2025',
         porque='A descrição do Eurostat diz «real gross domestic product» e não diz como o valor real se calcula; a oração sobre os preços de um ano fixo não estava em origem nenhuma lida.',
         literais=[('eurostat-tipsna40-descricao', 'excerto', 'real gross domestic product')],
         trocas=[("por habitante, medido a preços de um ano fixo para se poder comparar entre anos.'", "por habitante, em termos reais.'", 1),
                 ("per inhabitant, measured at the prices of a fixed year so that years can be compared.'", "per inhabitant, in real terms.'", 1)]),
    dict(chave='A2', medida='saldo-das-administracoes-publicas-2025',
         porque='O subsetor chama-se «Administração Local» no INE; «as autarquias» nomeia-o em palavras correntes, e «as câmaras» é o nome de um órgão, não do subsetor.',
         literais=[('ine-pde-subsetores', 'excerto', 'Administração Local')],
         trocas=[("(o Estado, as regiões autónomas, as câmaras e a segurança social)", "(o Estado, as regiões autónomas, as autarquias e a segurança social)", 3),
                 ("(the State, the autonomous regions, the municipalities and social security)", "(the State, the autonomous regions, local authorities and social security)", 3)]),
    dict(chave='A3', medida='crescimento-da-despesa-liquida-2025',
         porque='Nenhuma origem lida diz que o Governo controla esta despesa: o que o CFP apura é o crescimento da despesa líquida. O compromisso é «assumido por Portugal e endossado pelo Conselho da UE», e não um compromisso com o Conselho; e o valor de referência é o do ano do cartão, numa trajetória, e não um teto igual todos os anos.',
         literais=[('propria', 'excerpt', 'crescimento da despesa líquida'),
                   ('cfp-compromisso', 'excerto', 'compromisso assumido por Portugal e endossado pelo Conselho da UE'),
                   ('cfp-trajetoria', 'excerto', 'comprometeu-se com uma determinada trajetória de crescimento da despesa líquida'),
                   ('propria', 'excerpt', 'a taxa de crescimento de 5% recomendada')],
         trocas=[("'É quanto cresceu num ano a despesa pública que o Governo controla: a despesa líquida, que não conta os juros da dívida,",
                  "'É quanto cresceu num ano a despesa pública líquida: a que não conta os juros da dívida,", 1),
                 ("'It is how much the public spending the Government controls grew in a year: net expenditure, which leaves out interest on the debt,",
                  "'It is how much net public expenditure grew in a year: the expenditure that leaves out interest on the debt,", 1),
                 ("' Portugal comprometeu-se com o Conselho da União Europeia a não a deixar crescer mais de ', { referencia: 'unico' }, ' % por ano: em ', { periodo: 'proprio' }, ' ', { estado:",
                  "' Portugal comprometeu-se, num compromisso endossado pelo Conselho da União Europeia, a não a deixar crescer mais de ', { referencia: 'unico' }, ' % em ', { periodo: 'proprio' }, ': ', { estado:", 1),
                 ("' Portugal committed to the Council of the European Union not to let it grow by more than ', { referencia: 'unico' }, ' % a year: in ', { periodo: 'proprio' }, ' it ', { estado:",
                  "' Portugal committed, in a commitment endorsed by the Council of the European Union, not to let it grow by more than ', { referencia: 'unico' }, ' % in ', { periodo: 'proprio' }, ': it ', { estado:", 1)]),
    dict(chave='A4', medida='posicao-de-investimento-internacional-2025',
         porque='O Banco de Portugal escreve «responsabilidade» perante o exterior («net external liability» na edição inglesa), e não dívida; a frase passa a usar a palavra dele.',
         literais=[('bdp-pii-sinal', 'excerto', 'representando uma responsabilidade perante o exterior'),
                   ('bdp-pii-sinal', 'excertoEn', 'there is a net external liability')],
         trocas=[(f"'A dívida líquida ao exterior {v}'", f"'A responsabilidade líquida perante o exterior {v}'", 1) for v in ['encolheu face a', 'cresceu face a', 'ficou igual à de']]
                + [(f"'The net debt to the rest of the world {v}'", f"'The net external liability {v}'", 1) for v in ['shrank from', 'grew from', 'was unchanged from']]),
    dict(chave='A5', medida='taxa-de-cambio-efectiva-real-2025',
         porque='Nenhuma origem lida diz que uma subida quer dizer perda de competitividade: a descrição do Eurostat e o glossário da taxa de câmbio (para onde o endereço do glossário da taxa de câmbio efetiva real redireciona) falam da competitividade de preços sem dizer o sentido de uma subida, os outros dois endereços de glossário procurados responderam 404, e a página do BCE dos indicadores harmonizados de competitividade também não o diz. A oração sai.',
         literais=[('eurostat-tipser10-descricao', 'excerto', 'price or cost competitiveness relative to its principal competitors')],
         trocas=[("em três anos: quando sobe, o país perde competitividade; quando desce, ganha.'", "em três anos.'", 1),
                 ("over three years: when it rises, the country loses competitiveness; when it falls, it gains.'", "over three years.'", 1)]),
    dict(chave='A6', medida='divida-das-empresas-2025',
         porque='A descrição do Eurostat conta os títulos de dívida e os empréstimos («Debt securities (F.3) and Loans (F.4)»), e não tudo o que as empresas devem.',
         literais=[('eurostat-tipspd30-descricao', 'excerto', 'Debt securities (F.3) and Loans (F.4)')],
         trocas=[("'É tudo o que as empresas devem, fora as financeiras, '", "'É o que as empresas devem em empréstimos e títulos de dívida, fora as financeiras, '", 1),
                 ("'It is everything companies owe, excluding financial companies, '", "'It is what companies owe in loans and debt securities, excluding financial companies, '", 1)]),
    dict(chave='A7', medida='divida-das-familias-2025',
         porque='O setor é o das famílias e das instituições sem fim lucrativo ao seu serviço, e a dívida é a de títulos e empréstimos.',
         literais=[('eurostat-tipspd22-descricao', 'excerto', 'the stock of liabilities held by the sector Households and Non-Profit institutions serving households'),
                   ('eurostat-tipspd22-descricao', 'excerto', 'Debt securities (F.3) and Loans (F.4)')],
         trocas=[("'É tudo o que as famílias devem, '", "'É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem em empréstimos e títulos de dívida, '", 1),
                 ("'It is everything households owe, '", "'It is what households and non-profit institutions serving them owe in loans and debt securities, '", 1)]),
    dict(chave='A8', medida='fluxo-de-credito-as-empresas-2025',
         porque='O Eurostat mede o montante líquido dos passivos contraídos no ano, e não o crédito novo recebido.',
         literais=[('eurostat-tipspc30-descricao', 'excerto', 'the net amount of liabilities incurred during the year')],
         trocas=[("'É quanto crédito novo as empresas receberam num ano, fora as financeiras", "'É quanto crédito as empresas contraíram num ano, em termos líquidos, fora as financeiras", 1),
                 ("'It is how much new credit companies received in a year, excluding financial companies", "'It is how much credit companies took on in a year, net, excluding financial companies", 1)]),
    dict(chave='A9', medida='fluxo-de-credito-as-familias-2025',
         porque='O Eurostat mede o montante líquido dos passivos contraídos no ano pelas famílias e pelas instituições sem fim lucrativo ao seu serviço, e não o crédito novo recebido pelas famílias.',
         literais=[('eurostat-tipspc40-descricao', 'excerto', 'the net amount of liabilities which the sectors Households and Non-Profit institutions serving households (S.14_S.15) have incurred during the year')],
         trocas=[("'É quanto crédito novo as famílias receberam num ano, em percentagem", "'É quanto crédito as famílias e as instituições sem fim lucrativo ao seu serviço contraíram num ano, em termos líquidos, em percentagem", 1),
                 ("'It is how much new credit households received in a year, as a percentage", "'It is how much credit households and non-profit institutions serving them took on in a year, net, as a percentage", 1)]),
    dict(chave='A10', medida='ganho-medio-mensal-2024',
         porque='A nota do INE diz «trabalhadores por conta de outrem a tempo completo», e o conceito de ganho é o montante ilíquido pago com caráter regular pelo período normal e extraordinário; a lista de rubricas da frase anterior não estava no literal.',
         literais=[('ine-ganho-nota', 'excerto', 'trabalhadores por conta de outrem a tempo completo'),
                   ('ine-ganho-conceito', 'excerto', 'pago ao trabalhador com caráter regular'),
                   ('ine-ganho-conceito', 'excerto', 'no período normal e extraordinário'),
                   ('ine-ganho-conceito', 'excerto', 'Montante ilíquido')],
         trocas=[("'É o que um trabalhador por conta de outrem ganhou por mês, em média, em '", "'É o que um trabalhador por conta de outrem a tempo completo ganhou por mês, em média, em '", 1),
                 ("', com o salário base, as horas extraordinárias e os subsídios regulares, antes de descontos.'", "', com o que lhe é pago com caráter regular pelas horas normais e extraordinárias, antes de descontos.'", 1),
                 ("'It is what an employee earned per month, on average, in '", "'It is what a full-time employee earned per month, on average, in '", 1),
                 ("', including base pay, overtime and regular allowances, before deductions.'", "', including what is paid on a regular basis for normal and overtime hours, before deductions.'", 1)]),
    dict(chave='A11', medida='disparidade-salarial-entre-sexos-2024',
         porque='A cobertura do Eurostat é a das empresas com «10 employees or more» (trabalhadores, e não pessoas ao serviço). E a primeira frase só é verdadeira com o valor positivo: passa a ramo `sinal.positivo`, sem mudar palavra, e um valor de outro sinal fecha a construção em vez de a deixar sair falsa. A 26.09.2026 o lugar de direção reescreveu a frase no seu ficheiro, para que o valor feche a oração e «provisório» feche com ele; as trocas deste acerto acompanham a frase nova e acertam o mesmo que acertavam.',
         literais=[('eurostat-earn-grgpg2-cobertura', 'excerto', '10 employees or more'),
                   ('eurostat-earn-grgpg2-definicao', 'excerto', 'the difference between average gross hourly earnings of male paid employees and of female paid employees')],
         trocas=[("' ou mais pessoas ao serviço: a diferença, em percentagem do ganho dos homens, foi de '", "' ou mais trabalhadores: a diferença, em percentagem do ganho dos homens, foi de '", 1),
                 ("' %' }, '.', DIFERENCA, DIFERENCA_UE]", "' %' }, '.'] } }, DIFERENCA, DIFERENCA_UE]", 1),
                 ("pt: ['Por cada hora de trabalho,", "pt: [{ sinal: { positivo: ['Por cada hora de trabalho,", 1),
                 ("' %' }, '.', GAP, GAP_EU]", "' %' }, '.'] } }, GAP, GAP_EU]", 1),
                 ("en: ['Per hour worked,", "en: [{ sinal: { positivo: ['Per hour worked,", 1)]),
    dict(chave='A12', medida='criancas-em-creche-2025',
         porque='O Eurostat põe a ama profissional nos outros tipos de cuidado, e não no cuidado formal («Other types of childcare may include care that is provided by a professional child-minder»); o exemplo sai.',
         literais=[('eurostat-cuidado-formal', 'excerto', 'Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies')],
         trocas=[("' anos que está numa creche ou noutro cuidado formal, como uma ama profissional.'", "' anos que está numa creche ou noutro cuidado formal.'", 1),
                 ("' who are in a nursery or other formal childcare, such as a professional child-minder.'", "' who are in a nursery or other formal childcare.'", 1)]),
    dict(chave='A13', medida='sobrecarga-do-custo-da-habitacao-2025',
         porque='O regime do Eurostat é «Tenant, rent at reduced price or free» (a renda gratuita conta), e a Comissão escreve que a taxa «should be read together with the tenure structure», e não que manda lê-la por regime.',
         literais=[('eurostat-tessi164-regimes', 'excerto', '"OWN_L":"Owner, with mortgage or loan","OWN_NL":"Owner, no outstanding mortgage or housing loan","RENT_MKT":"Tenant, rent at market price","RENT_FR":"Tenant, rent at reduced price or free"'),
                   ('ce-swd-2026-222-habitacao', 'excerto', 'The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.')],
         trocas=[("arrendada a preço de mercado ou a renda reduzida)", "arrendada a preço de mercado ou a renda reduzida ou gratuita)", 1),
                 ("rented at market price or at a reduced rent)", "rented at market price or at a reduced rent or free)", 1),
                 ("' Este total mistura situações muito diferentes, e a Comissão Europeia manda lê-lo por regime de ocupação.'",
                  "' Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.'", 1),
                 ("' This total mixes very different situations, and the European Commission says it should be read by tenure status.'",
                  "' This total mixes very different situations, and the European Commission says it should be read together with the tenure structure.'", 1)]),
    dict(chave='A14', medida='competencias-digitais-2025',
         porque='O Eurostat escreve «activities related to internet or software use»: as competências contam o uso de programas, e não só a internet.',
         literais=[('eurostat-tepsr_sp410-descricao', 'excerto', 'activities related to internet or software use')],
         trocas=[("proteger-se e resolver problemas na internet.'", "proteger-se e resolver problemas no uso da internet e de programas informáticos.'", 1),
                 ("stay safe and solve problems online.'", "stay safe and solve problems when using the internet or software.'", 1)]),
    dict(chave='A15', medida='formacao-bruta-de-capital-fixo-2025',
         porque='O glossário do Eurostat define a formação bruta de capital fixo pelas aquisições dos produtores residentes, descontadas as cessões; nenhuma origem lida lhe chama o investimento feito no país.',
         literais=[('eurostat-glossario-fbcf', 'excerto', 'consists of resident producers’ acquisitions, less disposals, of fixed assets during a given period')],
         trocas=[("pt: ['É o investimento feito no país num ano em bens que duram mais de um ano,", "pt: ['É o que os produtores residentes compraram num ano, descontado o que venderam, em bens que duram mais de um ano,", 1),
                 ("en: ['It is the investment made in the country in a year in assets that last more than a year,", "en: ['It is what resident producers acquired in a year, less what they disposed of, in assets that last more than a year,", 1)]),
    dict(chave='A16', medida='crescimento-da-despesa-liquida-2025',
         porque='Pedido pelo portão da voz, com a palavra da fonte: «Despesa paga» é uma frase retirada do inventário (o cabeçalho das contas do município, que saiu com a peça 2 do B1), e a procura das retiradas morde por palavra inteira dentro de outra frase. A palavra do Conselho das Finanças Públicas é «financiada». A frase retirada fica retirada.',
         literais=[('cfp-despesa-liquida', 'excerto', 'Despesa financiada por fundos da UE (4)')],
         trocas=[("a despesa paga por fundos europeus nem a que sobe", "a despesa financiada por fundos europeus nem a que sobe", 1),
                 ("spending paid by European funds and the spending", "spending financed by European funds and the spending", 1)]),
    dict(chave='A17', medida='taxa-de-emprego-2025',
         porque='Pedido pelo portão da voz, com a palavra da fonte: «The share of people aged to who are in employment.» é a definição da casa que o F1.10 retirou quando a definição de cada medida passou a sair da fonte, e a leitura inglesa trazia-a de volta palavra a palavra. A palavra do glossário do Eurostat é «employed persons». A frase retirada fica retirada; a edição portuguesa não tinha a coincidência e não muda.',
         literais=[('glossario-emprego', 'excerto', 'percentage of employed persons')],
         trocas=[("' who are in employment.', ROSE, EU_AVERAGE]", "' who are employed.', ROSE, EU_AVERAGE]", 1)]),
    # A PASSAGEM DE CORREÇÃO (26.09.2026), depois da leitura a frio do Codex: os
    # termos que ela achou por explicar (os achados 7 a 14), cada um com a palavra
    # corrente que o literal de uma origem selada sustenta, e a idade da taxa de
    # atividade (o achado 15). Cada troca aplica-se ao texto que os acertos de
    # cima deixaram.
    dict(chave='A18', medida='pib-real-per-capita-2025',
         porque='A leitura a frio (achado 7) achou «em termos reais» por explicar. A ficha de metadados que a resposta `tipsna40` nomeia diz que os volumes mostram a evolução dos agregados sem a inflação, a linha está em volumes encadeados, e o glossário do Eurostat diz que a inflação é a subida do nível geral dos preços: a leitura passa a dizer «descontada a subida dos preços».',
         literais=[('eurostat-nama10-volumes', 'excerto', 'Volume figures show the development of aggregates excluding inflation.'),
                   ('eurostat-glossario-inflacao', 'excerto', 'Inflation is an increase in the general price level of goods and services.'),
                   ('propria', 'unit', 'volumes encadeados')],
         trocas=[("por habitante, em termos reais.'", "por habitante, descontada a subida dos preços.'", 1),
                 ("per inhabitant, in real terms.'", "per inhabitant, excluding the rise in prices.'", 1)]),
    dict(chave='A19', medida='fluxo-de-credito-as-empresas-2025',
         porque='A leitura a frio (achado 8) achou «em termos líquidos» por explicar. O Eurostat mede o montante líquido dos passivos contraídos no ano, e o SEC 2010 publicado pelo Eurostat (§5.23) define o registo líquido: os passivos contraídos descontados dos reembolsos. A leitura passa a dizer «descontado o que reembolsaram».',
         literais=[('eurostat-tipspc30-descricao', 'excerto', 'the net amount of liabilities'),
                   ('eurostat-sec2010-registo-liquido', 'excerto', 'incurrences of liabilities are shown net of repayments of liabilities')],
         trocas=[("'É quanto crédito as empresas contraíram num ano, em termos líquidos, fora as financeiras", "'É quanto crédito as empresas contraíram num ano, descontado o que reembolsaram, fora as financeiras", 1),
                 ("'It is how much credit companies took on in a year, net, excluding financial companies", "'It is how much credit companies took on in a year, minus what they repaid, excluding financial companies", 1)]),
    dict(chave='A20', medida='fluxo-de-credito-as-familias-2025',
         porque='A leitura a frio (achado 9) achou «em termos líquidos» por explicar, pela mesma razão do A19: o Eurostat mede o montante líquido dos passivos contraídos no ano, e o SEC 2010 (§5.23) define o líquido como os passivos contraídos descontados dos reembolsos.',
         literais=[('eurostat-tipspc40-descricao', 'excerto', 'the net amount of liabilities'),
                   ('eurostat-sec2010-registo-liquido', 'excerto', 'incurrences of liabilities are shown net of repayments of liabilities')],
         trocas=[("contraíram num ano, em termos líquidos, em percentagem", "contraíram num ano, descontado o que reembolsaram, em percentagem", 1),
                 ("took on in a year, net, as a percentage", "took on in a year, minus what they repaid, as a percentage", 1)]),
    dict(chave='A21', medida='risco-de-pobreza-ou-exclusao-2025',
         porque='A leitura a frio (achado 10) achou «rendimento mediano» por explicar. O glossário do Eurostat diz que a mediana é o valor do meio, com metade acima e metade abaixo: a leitura ganha uma frase que o diz.',
         literais=[('eurostat-glossario-mediana', 'excerto', 'The median is the middle value in a group of numbers ranked in order of size.'),
                   ('eurostat-glossario-mediana', 'excerto', '50% of the scores are above and 50% are below.')],
         trocas=[("; cada pessoa conta uma só vez.', SUBIU, MEDIA_UE]", "; cada pessoa conta uma só vez. O rendimento mediano é o do meio: metade da população tem mais e metade tem menos.', SUBIU, MEDIA_UE]", 1),
                 ("; each person counts only once.', ROSE, EU_AVERAGE]", "; each person counts only once. The median income is the one in the middle: half the population has more and half has less.', ROSE, EU_AVERAGE]", 1)]),
    dict(chave='A22', medida='criancas-em-creche-2025',
         porque='A leitura a frio (achado 11) achou que «outro cuidado formal» só repetia o nome da categoria. A página do Eurostat que o bloco já tinha alojado diz o que o cuidado formal é (um programa planeado por entidades públicas e privadas reconhecidas) e o que fica fora dele (o cuidado dos avós, de outros familiares, de amigos ou vizinhos, e o de uma ama profissional): a leitura diz as duas coisas com as palavras dela. A página não dá exemplos como o jardim de infância, e a leitura não os dá.',
         literais=[('eurostat-cuidado-formal', 'excerto', 'Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies'),
                   ('eurostat-cuidado-formal', 'excerto', 'care provided by grandparents, other household members (not parents), other relatives, friends or neighbours'),
                   ('eurostat-cuidado-formal', 'excerto', 'Other types of childcare may include care that is provided by a professional child-minder')],
         trocas=[("' anos que está numa creche ou noutro cuidado formal.'", "' anos que está numa creche ou noutro cuidado formal: um programa planeado por entidades públicas ou privadas reconhecidas, e não o cuidado dado pelos avós, por outros familiares, por amigos ou vizinhos, ou por uma ama profissional.'", 1),
                 ("' who are in a nursery or other formal childcare.'", "' who are in a nursery or other formal childcare: a programme planned through public organisations or recognised private bodies, and not care given by grandparents, other relatives, friends or neighbours, or a professional child-minder.'", 1)]),
    dict(chave='A23', medida='sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025',
         porque='A leitura a frio (achado 12) achou «rendimento disponível» por explicar. O glossário do Eurostat diz como se faz: somam-se os rendimentos do trabalho, dos investimentos e das prestações sociais, e descontam-se os impostos e as contribuições sociais pagos; e o glossário da sobrecarga diz que os custos e o rendimento contam líquidos dos apoios à habitação. A leitura ganha uma frase que diz as duas coisas.',
         literais=[('eurostat-glossario-rendimento-disponivel', 'excerto', 'all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits'),
                   ('eurostat-glossario-rendimento-disponivel', 'excerto', 'taxes and social contributions that have been paid, are deducted from this sum'),
                   ('glossario-sobrecarga', 'excerto', "the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)")],
         trocas=[("' % do rendimento disponível com a habitação.', SUBIU, MEDIA_UE]", "' % do rendimento disponível com a habitação. O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.', SUBIU, MEDIA_UE]", 1),
                 ("' % of its disposable income on housing.', ROSE, EU_AVERAGE]", "' % of its disposable income on housing. Disposable income is what the household receives, from work, investment and social benefits, after the taxes and social contributions it pays; housing allowances are deducted from both the income and the housing costs.', ROSE, EU_AVERAGE]", 1)]),
    dict(chave='A24', medida='sobrecarga-do-custo-da-habitacao-2025',
         porque='A leitura a frio (achado 13) achou o mesmo «rendimento disponível» por explicar na sobrecarga de todos os regimes; a frase é a do A23, pelas mesmas origens.',
         literais=[('eurostat-glossario-rendimento-disponivel', 'excerto', 'all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits'),
                   ('eurostat-glossario-rendimento-disponivel', 'excerto', 'taxes and social contributions that have been paid, are deducted from this sum'),
                   ('glossario-sobrecarga', 'excerto', "the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)")],
         trocas=[("' % do rendimento disponível com a habitação.', SUBIU, ' Este total", "' % do rendimento disponível com a habitação. O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.', SUBIU, ' Este total", 1),
                 ("' % of its disposable income on housing.', ROSE, ' This total", "' % of its disposable income on housing. Disposable income is what the household receives, from work, investment and social benefits, after the taxes and social contributions it pays; housing allowances are deducted from both the income and the housing costs.', ROSE, ' This total", 1)]),
    dict(chave='A25', medida='formacao-bruta-de-capital-fixo-2025',
         porque='A leitura a frio (achado 14) achou «produtores residentes» por explicar. O glossário do Eurostat da unidade institucional residente diz quem são as unidades de uma economia (as famílias, as empresas, as instituições sem fim lucrativo e o Estado), que é residente quem tem o centro de interesse económico no território do país, e que é a residência dos produtores que delimita a produção do país: a leitura diz quem são, e que produzem no país.',
         literais=[('eurostat-glossario-residente', 'excerto', 'households and individuals who make up a household; legal and social entities, such as corporations and quasi-corporations (e.g. branches of foreign direct investors), non-profit institutions, and the government of that economy'),
                   ('eurostat-glossario-residente', 'excerto', 'resident because it has a centre of economic interest in the economic territory of a country'),
                   ('eurostat-glossario-residente', 'excerto', 'the residency status of producers determines the limits of domestic production')],
         trocas=[("pt: ['É o que os produtores residentes compraram num ano,", "pt: ['É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano,", 1),
                 ("en: ['It is what resident producers acquired in a year,", "en: ['It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year,", 1)]),
    dict(chave='A26', medida='taxa-de-actividade-2025',
         porque='A leitura a frio (achado 15) achou a população sem a idade que a fonte fixa. A descrição de `tipslm60` que o bloco já tinha selado diz «economically active population aged 15-64»: a leitura escreve os dois limites, com o literal na auditoria, como as outras idades. A pergunta da medida não muda (é do B2) e continua sem a idade.',
         literais=[('eurostat-tipslm60-idade', 'excerto', 'the percentage of economically active population aged 15-64 on the total population of the same age')],
         trocas=[("'É quanto mudou em três anos, em pontos percentuais, a parte da população que está ativa: a trabalhar ou à procura de trabalho.',",
                  "'É quanto mudou em três anos, em pontos percentuais, a parte da população dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos que está ativa: a trabalhar ou à procura de trabalho.',", 1),
                 ("'It is how much the share of the population that is active, working or looking for work, changed over three years, in percentage points.',",
                  "'It is how much the share of the population aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' that is active, working or looking for work, changed over three years, in percentage points.',", 1)]),
]


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def sem_comentarios(s: str) -> str:
    s = re.sub(r'/\*[\s\S]*?\*/', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def main() -> int:
    confere = '--confere' in sys.argv[1:]
    fonte = FONTE.read_text(encoding='utf-8')
    for a in ACERTOS:
        for antes, depois, n in a['trocas']:
            c = fonte.count(antes)
            if c != n:
                print(f'{a["chave"]}: «{antes[:80]}» aparece {c} vez(es) na cópia do lugar de direção, e o acerto declara {n}.')
                return 1
            fonte = fonte.replace(antes, depois)
    a_limpo, b_limpo = sem_comentarios(fonte), sem_comentarios(SITIO.read_text(encoding='utf-8'))
    if a_limpo != b_limpo:
        i = next((k for k, (x, y) in enumerate(zip(a_limpo, b_limpo)) if x != y), min(len(a_limpo), len(b_limpo)))
        print('o ficheiro do sítio não é a cópia do lugar de direção com estes acertos. Primeira diferença, sem comentários:')
        print('  acertos:', a_limpo[max(0, i - 120):i + 120])
        print('  sítio:  ', b_limpo[max(0, i - 120):i + 120])
        return 1
    auditoria = json.loads(AUDITORIA.read_text(encoding='utf-8'))
    apoios = set()
    for m in auditoria['medidas']:
        for f in m['folhas']:
            for p in f['partes']:
                for ap in p.get('apoios', []):
                    if 'literal' in ap:
                        apoios.add((m['id'], ap.get('origem') or ap.get('linha'), ap['campo'], ap['literal']))
    for a in ACERTOS:
        for dono, campo, literal in a['literais']:
            if (a['medida'], dono, campo, literal) not in apoios:
                print(f'{a["chave"]}: o literal «{literal[:80]}» ({dono}, {campo}) não é apoio da medida {a["medida"]} na auditoria.')
                return 1
    registo = {
        'o_que_e': 'Os acertos de palavras do construtor do L1 às leituras do lugar de direção, conferidos por acertos-l1.py.',
        'fonte': {'caminho': str(FONTE.relative_to(RAIZ)), 'sha256': sha(FONTE)},
        'sitio': {'caminho': str(SITIO.relative_to(RAIZ)), 'sha256': sha(SITIO)},
        'auditoria': {'caminho': str(AUDITORIA.relative_to(RAIZ)), 'sha256': sha(AUDITORIA)},
        'conferido': 'a cópia do lugar de direção com estas trocas e o ficheiro do sítio são iguais sem os comentários de bloco e com os espaços juntos',
        'acertos': [
            {'chave': a['chave'], 'medida': a['medida'], 'porque': a['porque'],
             'literais': [{'dono': d, 'campo': c, 'literal': l} for d, c, l in a['literais']],
             'trocas': [{'antes': x, 'depois': y, 'vezes': n} for x, y, n in a['trocas']]}
            for a in ACERTOS
        ],
    }
    texto = json.dumps(registo, ensure_ascii=False, indent=2) + '\n'
    if confere:
        if not REGISTO.exists() or REGISTO.read_text(encoding='utf-8') != texto:
            print(f'{REGISTO.name} está velho ou não existe: corre o guião sem --confere.')
            return 1
        print(f'acertos conferidos: {len(ACERTOS)} acertos, {sum(len(a["trocas"]) for a in ACERTOS)} trocas; o registo está em dia.')
        return 0
    REGISTO.write_text(texto, encoding='utf-8')
    print(f'acertos conferidos e registados: {len(ACERTOS)} acertos, {sum(len(a["trocas"]) for a in ACERTOS)} trocas.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
