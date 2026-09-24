#!/usr/bin/env python3
"""OS ACERTOS DE PALAVRAS ÀS LEITURAS DO LUGAR DE DIREÇÃO (bloco L1, itens 4 e 7).

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
         porque='A cobertura do Eurostat é a das empresas com «10 employees or more» (trabalhadores, e não pessoas ao serviço). E a primeira frase só é verdadeira com o valor positivo: passa a ramo `sinal.positivo`, sem mudar palavra, e um valor de outro sinal fecha a construção em vez de a deixar sair falsa.',
         literais=[('eurostat-earn-grgpg2-cobertura', 'excerto', '10 employees or more'),
                   ('eurostat-earn-grgpg2-definicao', 'excerto', 'the difference between average gross hourly earnings of male paid employees and of female paid employees')],
         trocas=[("' ou mais pessoas ao serviço.', DIFERENCA, DIFERENCA_UE]", "' ou mais trabalhadores.'] } }, DIFERENCA, DIFERENCA_UE]", 1),
                 ("pt: ['Por cada hora de trabalho,", "pt: [{ sinal: { positivo: ['Por cada hora de trabalho,", 1),
                 ("' or more employees.', GAP, GAP_EU]", "' or more employees.'] } }, GAP, GAP_EU]", 1),
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
