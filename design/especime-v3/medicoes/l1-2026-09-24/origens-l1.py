#!/usr/bin/env python3
"""As origens da leitura de cada medida (bloco L1), recortadas dos ficheiros selados no motor.

uso: python3 design/especime-v3/medicoes/l1-2026-09-24/origens-l1.py [--escreve-js <ficheiro>] [--confere]

Cada origem nova de `ORIGENS_DAS_DEFINICOES` que a leitura usa sai daqui, e não
de uma cópia à mão: o guião abre o ficheiro no motor (`OEDP_MOTOR`, ou a
worktree do bloco, ou a árvore principal), confere o sha256 dos bytes contra o
registo do pedido (`pedidos.jsonl` da pasta do pedido) ou contra o manifesto do
estudo 13 (`MANIFEST.sha256`, com a entrada do `FETCH.json`), lê o campo pela
regra escrita ao lado de cada tipo, e recorta o excerto entre duas âncoras do
próprio texto. O excerto é, por isso, uma subcadeia literal do campo lido.

`--escreve-js` escreve as declarações na forma de `src/data/figuras.mjs`;
`--confere` lê as declarações de `src/data/figuras.mjs` (por `node`) e confere,
origem a origem, o sha256, a hora, o cliente e que o excerto está mesmo no campo
(é o que o relatório do bloco cita como a releitura dos selos). Sem argumentos,
imprime o JSON das origens.

A NORMALIZAÇÃO DO CAMPO, escrita uma vez: o texto de um campo HTML (a descrição
de uma resposta da API, uma página, o corpo da página do Banco de Portugal) é o
texto sem as marcas, com as entidades desfeitas e os espaços em branco
colapsados num espaço; o de um PDF é a extração `pdftotext -layout` com os
espaços colapsados; o de um campo JSON sem marcas é o valor tal como vem.
"""
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
# O motor ao lado do sítio, sem o caminho da máquina escrito aqui (o repositório
# é público): a variável, ou a pasta `ResearchHub` vizinha da árvore principal,
# primeiro a worktree do bloco e depois a árvore principal do motor. Da
# worktree do sítio, a árvore principal está três pastas acima.
_VIZINHAS = [RAIZ.parent, RAIZ.parents[3]] if len(RAIZ.parents) > 3 else [RAIZ.parent]
CANDIDATOS = [os.environ.get('OEDP_MOTOR')] + [str(v / 'ResearchHub' / sub) for v in _VIZINHAS
                                                for sub in ('.worktrees/l1-2026-09-24', '')]
MOTOR = next(Path(c) for c in CANDIDATOS if c and (Path(c) / 'indicators/out/l1-2026-09-24/pedidos.jsonl').exists())
FONTE = 'content/13 Dominios/source/'
API = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
CLIENTE_L1 = 'core.http.HttpClient.condicional'


def colapsa(t):
    return re.sub(r'\s+', ' ', t).strip()


def texto_de_html(t):
    return colapsa(html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'(?s)<(script|style)[^>]*>.*?</\1>', ' ', t))))


def campo_json(dados, caminho):
    for parte in caminho.split('.'):
        dados = dados[int(parte)] if isinstance(dados, list) else dados[parte]
    return dados


def le_campo(ficheiro, tipo, caminho):
    """O texto do campo, pela regra do tipo."""
    bruto = (MOTOR / ficheiro).read_bytes()
    if tipo == 'api':  # um campo de uma resposta JSON, com marcas HTML que se tiram
        return texto_de_html(str(campo_json(json.loads(bruto), caminho)))
    if tipo == 'json-cru':  # a cadeia JSON crua, tal como os bytes a trazem
        return bruto.decode('utf-8')
    if tipo == 'pagina':  # o texto de uma página HTML
        return texto_de_html(bruto.decode('utf-8', 'replace'))
    if tipo == 'bdp':  # o corpo da página do Banco de Portugal, no JSON window.api_response
        m = re.search(r'window\.api_response=\s*(\{.*?\})\s*</script>', bruto.decode('utf-8'), re.S)
        return texto_de_html(campo_json(json.loads(m.group(1)), caminho))
    if tipo == 'texto':  # a extração de um PDF, já alojada com o seu resumo
        return colapsa(bruto.decode('utf-8', 'replace'))
    raise SystemExit(f'tipo desconhecido: {tipo}')


def recorta(texto, inicio, fim=None):
    i = texto.find(inicio)
    if i < 0:
        raise SystemExit(f'âncora de início não encontrada: «{inicio[:60]}»')
    if fim is None:
        return texto[i:i + len(inicio)]
    j = texto.find(fim, i)
    if j < 0:
        raise SystemExit(f'âncora de fim não encontrada depois de «{inicio[:40]}»: «{fim[:60]}»')
    return texto[i:j + len(fim)]


def pedido(pasta, ficheiro):
    for linha in (MOTOR / pasta / 'pedidos.jsonl').read_text(encoding='utf-8').splitlines():
        r = json.loads(linha)
        if r['file'] == ficheiro:
            return r
    raise SystemExit(f'{pasta}/{ficheiro} não está no registo dos pedidos')


def alojada(rel):
    """A entrada do manifesto e do FETCH.json de um ficheiro alojado no estudo 13."""
    manifesto = dict(reversed(l.split('  ', 1)) for l in (MOTOR / FONTE / 'MANIFEST.sha256').read_text(encoding='utf-8').splitlines() if l)
    fetch = json.loads((MOTOR / FONTE / 'FETCH.json').read_text(encoding='utf-8'))
    entrada = fetch['files'][rel]
    origem = fetch['files'].get(entrada.get('from')) if entrada.get('from') else entrada
    hora = origem['fetched_at'].replace('+00:00', 'Z')
    return {'sha256': manifesto[rel], 'hora': hora, 'url': origem['url'],
            'cliente': f"publisher/dominios_fetch.py, core.http.HttpClient ({fetch.get('user_agent', origem.get('user_agent'))})"}


# (chave, publicador, documento, língua, pasta do pedido ou None para um ficheiro alojado,
#  ficheiro, tipo, caminho do campo, rótulo do campo, âncora de início, âncora de fim, excerto inglês)
O = []


def api(chave, documento, conjunto, inicio, fim, caminho='extension.description', rotulo=None):
    O.append(dict(chave=chave, publicador='Eurostat', documento=documento, lingua='en', pasta='indicators/out/l1-2026-09-24',
                  ficheiro=f'eurostat-{conjunto}.json', tipo='api', caminho=caminho, rotulo=rotulo or caminho, inicio=inicio, fim=fim))


api('eurostat-tipsna40-descricao', 'Real GDP per capita', 'tipsna40', 'The indicator is calculated as the ratio', 'within a certain period of time.')
api('eurostat-tipsgo10-descricao', 'General government gross debt (EDP concept), consolidated - annual data', 'tipsgo10', 'debt means total gross debt', 'sectors of general government.')
api('eurostat-tipsbp10-descricao', 'Current account balance - 3 year average', 'tipsbp10', 'The Current account provides information', 'a credit, a debit or a balance.')
api('eurostat-tipser10-descricao', 'Real effective exchange rate - percentage changes, 42 trading partners', 'tipser10', 'aims at assessing a country', 'relative to a panel of 42 countries')
api('eurostat-tipsbp60-descricao', 'Share of exports of advanced economies', 'tipsbp60', 'The indicator shows developments in shares of exports', '(comparing year Y with year Y-3).')
api('eurostat-tipspd22-descricao', 'Household debt including non-profit institutions serving households, consolidated', 'tipspd22', 'The Household debt is the stock of liabilities', 'Loans (F.4).')
api('eurostat-tipspc30-descricao', 'Non-financial corporations excluding foreign direct investments credit flow, consolidated', 'tipspc30', 'The non-financial corporations credit flow excluding', 'at the end of the previous year.')
api('eurostat-tipspc40-descricao', 'Household including non-profit institutions serving households (NPISH) credit flow, consolidated', 'tipspc40', 'The households sector credit flow represents', 'at the end of the previous year.')
api('eurostat-tipsun20-descricao', 'Unemployment rate - annual data', 'tipsun20', 'The unemployment rate is the number of unemployed persons', 'The indicative threshold of the indicator is 10%.')
api('eurostat-tesem060-descricao', 'Gender employment gap', 'tesem060', 'The gender employment gap is defined', 'total population of the same age group.')
api('eurostat-tipslm60-descricao', 'Labour force participation rate', 'tipslm60', 'The economically active population', 'with an indicative threshold of -0.2 pp.')
api('eurostat-tipslm10-descricao', 'Nominal unit labour cost per hour worked', 'tipslm10', 'The nominal unit labour cost (NULC) index', 'for the non-euro area countries.')
api('eurostat-tipslc10-descricao', 'People at risk of poverty or social exclusion', 'tipslc10', 'At risk-of-poverty are persons', '(after social transfers).')
api('eurostat-tepsr_sp410-descricao', 'Individuals who have basic or above basic overall digital skills by sex', 'tepsr_sp410', 'The Digital Skills Indicator 2.0', 'and Problem solving).')
api('eurostat-tepsr_sp210-descricao', 'Children aged less than 3 years in formal childcare', 'tepsr_sp210', 'This indicator shows the percentage of children', 'other than by the family.')
api('eurostat-tespm110-descricao', 'Self-reported unmet need for medical care by sex', 'tespm110', 'Self-reported unmet needs for medical care', 'according to national healthcare systems.')
api('eurostat-tipsho20-descricao', 'House price index, nominal - annual data', 'tipsho20', 'The house price index (HPI) captures', 'The indicative threshold of the indicator is 9%.')
api('eurostat-tipsho50-descricao', 'Residential building permits - annual data', 'tipsho50', 'The annual building permits data', 'per 1000 inhabitants.')
api('eurostat-tipsna20-descricao', 'Gross fixed capital formation at current prices', 'tipsna20', 'GFCF includes acquisition less disposals', 'such as the clearance of forests.')
api('eurostat-sdg_16_40-descricao', 'Perceived independence of the justice system', 'sdg_16_40', 'The indicator is designed to explore', 'Directorate-General for Justice and Consumers.')
api('eurostat-sdg_16_40-nivel', 'Perceived independence of the justice system', 'sdg_16_40', 'Very good or fairly good', None,
    caminho='dimension.lev_perc.category.label.VG_FG')
O.append(dict(chave='eurostat-earn-grgpg2-definicao', publicador='Eurostat', documento='Gender pay gap in unadjusted form (earn_grgpg2) · Reference metadata', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='eurostat-earn_grgpg2_esms.htm', tipo='pagina', caminho=None,
              rotulo='o texto da página, ponto 3.1 «Data description»', inicio='The unadjusted gender pay gap (GPG) represents', fim='hourly earnings of male paid employees.'))
O.append(dict(chave='eurostat-earn-grgpg2-cobertura', publicador='Eurostat', documento='Gender pay gap in unadjusted form (earn_grgpg2) · Reference metadata', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='eurostat-earn_grgpg2_esms.htm', tipo='pagina', caminho=None,
              rotulo='o texto da página, ponto 3.3 «Coverage - sector»', inicio='Economic sections, according to NACE Rev. 2, from B to S where O is optional; only enterprises with 10 employees or more.', fim=None))
O.append(dict(chave='eurostat-glossario-fbcf', publicador='Eurostat', documento='Statistics Explained · Glossary: Gross fixed capital formation (GFCF)', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='eurostat-se-glossary-gfcf.html', tipo='pagina', caminho=None,
              rotulo='o texto da página', inicio='Gross fixed capital formation, abbreviated as GFCF', fim='for more than one year.'))
O.append(dict(chave='eurostat-glossario-gerd', publicador='Eurostat', documento='Statistics Explained · Glossary: Gross domestic expenditure on R & D (GERD)', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='eurostat-se-glossary-gerd.html', tipo='pagina', caminho=None,
              rotulo='o texto da página', inicio='Gross domestic expenditure on R&D (GERD) includes', fim='private non-profit organisations.'))
O.append(dict(chave='eurostat-cuidado-formal', publicador='Eurostat', documento='Statistics Explained · Living conditions in Europe - childcare arrangements', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='eurostat-se-childcare-arrangements.html', tipo='pagina', caminho=None,
              rotulo='o texto da página, secção «Context»', inicio='Formal childcare is a formal education programme', fim='friends or neighbours.'))
O.append(dict(chave='bdp-pii-sinal', publicador='Banco de Portugal', documento='BPstat · O que é a posição de investimento internacional (PII)?', lingua='pt',
              pasta='indicators/out/l1-2026-09-24', ficheiro='bdp-bpstat-pagina-940.html', tipo='bdp', caminho='data.texts.PT.body',
              rotulo='window.api_response, data.texts.PT.body e data.texts.EN.body', inicio='A diferença entre o valor destes ativos e destes passivos',
              fim='representando uma responsabilidade perante o exterior.',
              ingles=('data.texts.EN.body', 'The difference between the value of these assets and liabilities corresponds to the net value of the international investment position, which may be positive', 'there is a net external liability.')))
O.append(dict(chave='ce-swd-2026-222-habitacao', publicador='Comissão Europeia', documento='2026 Country Report – Portugal, SWD(2026) 222 final', lingua='en',
              pasta='indicators/out/l1-2026-09-24', ficheiro='ce-swd-2026-222-country-report-portugal.pdf', tipo='texto',
              texto='ce-swd-2026-222-country-report-portugal.txt', caminho=None, rotulo='a extração pdftotext -layout, a nota do gráfico A16.4',
              inicio='The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.', fim=None))
O.append(dict(chave='dre-dlr-37-2023-a', publicador='Diário da República', documento='Decreto Legislativo Regional n.º 37/2023/A, de 20 de outubro (republica o Decreto Legislativo Regional n.º 8/2002/A)', lingua='pt',
              pasta='indicators/out/l1-2026-09-24', ficheiro='dre-dlr-37-2023-A.pdf', tipo='texto', texto='dre-dlr-37-2023-A.txt', caminho=None,
              rotulo='a extração pdftotext -layout, artigo 3.º do anexo',
              inicio='O montante da retribuição mínima mensal garantida, estabelecido ao nível nacional para os trabalhadores por conta de outrem, tem, na Região Autónoma dos Açores, o acréscimo de 5 %.', fim=None))
# De pedidos já selados por blocos anteriores, no mesmo formato.
O.append(dict(chave='eurostat-tipspd30-descricao', publicador='Eurostat', documento='Non-financial corporations debt, consolidated - % of GDP', lingua='en',
              pasta='indicators/out/r1-2026-09-23', ficheiro='eurostat-tipspd30-PT-PC_GDP.json', tipo='api', caminho='extension.description',
              rotulo='extension.description', inicio='The non-financial corporations debt is the stock', fim='Loans (F.4).',
              cliente="core.http.HttpClient.condicional, por core.http.for_source(core.sources.get('eurostat'))"))
O.append(dict(chave='eurostat-tessi164-regimes', publicador='Eurostat', documento='Housing cost overburden rate by tenure status - EU-SILC survey', lingua='en',
              pasta='indicators/out/b2-2026-09-23', ficheiro='tessi164_PT.json', tipo='json-cru', caminho=None,
              rotulo='dimension.tenure.category.label, a cadeia JSON tal como a resposta a traz',
              inicio='"OWN_L":"Owner, with mortgage or loan"', fim='"RENT_FR":"Tenant, rent at reduced price or free"', cliente='core.http.HttpClient'))


# Ficheiros já alojados no estudo 13 (o registo é o FETCH.json e o resumo o do manifesto).
def aloj(chave, publicador, documento, lingua, rel, tipo, rotulo, inicio, fim=None, caminho=None):
    O.append(dict(chave=chave, publicador=publicador, documento=documento, lingua=lingua, pasta=None, ficheiro=FONTE + rel,
                  tipo=tipo, caminho=caminho, rotulo=rotulo, inicio=inicio, fim=fim))


aloj('eurostat-gfs-pacto', 'Eurostat', 'Statistics Explained · Government finance statistics', 'en', 'eurostat/statistics-explained-government-finance-statistics.html', 'pagina',
     'o texto da página, a introdução', "Under the terms of the EU's Stability and Growth Pact (SGP)", 'while its debt may not exceed 60% of GDP.')
aloj('eurostat-gfs-saldo', 'Eurostat', 'Statistics Explained · Government finance statistics', 'en', 'eurostat/statistics-explained-government-finance-statistics.html', 'pagina',
     'o texto da página, a secção «Data sources»', 'The difference between total revenue and total expenditure', 'equals net lending/net borrowing of general government')
aloj('ine-pde-subsetores', 'Instituto Nacional de Estatística', 'Procedimento dos Défices Excessivos (2.ª notificação de 2026), destaque de 23.09.2026', 'pt', 'text/destaque-pde-2026-09-23.txt', 'texto',
     'a extração pdftotext -layout, o quadro 1', 'Administrações Públicas S.13', 'Fundos de Segurança Social S.1314')
aloj('ine-pde-regional-e-local', 'Instituto Nacional de Estatística', 'Procedimento dos Défices Excessivos (2.ª notificação de 2026), destaque de 23.09.2026', 'pt', 'text/destaque-pde-2026-09-23.txt', 'texto',
     'a extração pdftotext -layout, o quadro 6', '- Administração Regional e Local', 'Administração Regional dos Açores')
aloj('ine-ganho-conceito', 'Instituto Nacional de Estatística', 'Metainformação do indicador 0012656 · Ganho médio mensal (€)', 'pt', 'ine/minfo-0012656.html', 'pagina',
     'o texto da página, «Conceitos»', 'GANHO: Montante ilíquido', 'outras ausências pagas).')
aloj('ine-ganho-nota', 'Instituto Nacional de Estatística', 'Metainformação do indicador 0012656 · Ganho médio mensal (€)', 'pt', 'ine/0012656_meta.json', 'api',
     'o campo Nota', 'Os dados referem-se a trabalhadores por conta de outrem a tempo completo com remuneração completa.', caminho='0.Nota')
aloj('dl-139-2025-ambito', 'Diário da República', 'Decreto-Lei n.º 139/2025, de 29 de dezembro', 'pt', 'text/decreto-lei-139-2025.txt', 'texto',
     'a extração pdftotext -layout, artigo 2.º', 'Artigo 2.º Âmbito territorial O presente decreto-lei é aplicável a todo o território continental.')
aloj('dl-139-2025-preambulo', 'Diário da República', 'Decreto-Lei n.º 139/2025, de 29 de dezembro', 'pt', 'text/decreto-lei-139-2025.txt', 'texto',
     'a extração pdftotext -layout, o sumário e o preâmbulo', 'Sumário: Atualiza o valor da retribuição mínima mensal garantida', 'através do aumento do salário mínimo')
aloj('dl-139-2025-vigor', 'Diário da República', 'Decreto-Lei n.º 139/2025, de 29 de dezembro', 'pt', 'text/decreto-lei-139-2025.txt', 'texto',
     'a extração pdftotext -layout, artigo 7.º', 'entra em vigor no dia seguinte ao da sua publicação e produz efeitos no dia 1 de janeiro de 2026.')
aloj('cfp-despesa-liquida', 'Conselho das Finanças Públicas', 'Parecer n.º 02/2026 · Parecer relativo ao Relatório Anual de Progresso 2026', 'pt', 'text/parecer-2026-02-rap26.txt', 'texto',
     'a extração pdftotext -layout, o quadro 1 (p. 10)', 'Despesa Total (da qual se ex clui) (1)', 'Despesa financiada por fundos da UE (4)')
aloj('cfp-trajetoria', 'Conselho das Finanças Públicas', 'Parecer n.º 02/2026 · Parecer relativo ao Relatório Anual de Progresso 2026', 'pt', 'text/parecer-2026-02-rap26.txt', 'texto',
     'a extração pdftotext -layout, p. 6', 'Nesse documento comprometeu-se com uma determinada trajetória', 'aprovada pelo Conselho da UE')
aloj('cfp-compromisso', 'Conselho das Finanças Públicas', 'Parecer n.º 02/2026 · Parecer relativo ao Relatório Anual de Progresso 2026', 'pt', 'text/parecer-2026-02-rap26.txt', 'texto',
     'a extração pdftotext -layout, p. 9', 'a taxa de crescimento em 2025 foi superior à prevista no compromisso assumido por Portugal e endossado pelo Conselho da UE.')
aloj('cfp-quem', 'Conselho das Finanças Públicas', 'Parecer n.º 02/2026 · Parecer relativo ao Relatório Anual de Progresso 2026', 'pt', 'text/parecer-2026-02-rap26.txt', 'texto',
     'a extração pdftotext -layout, p. 4', 'tendo o Conselho das Finanças Públicas (CFP), nos termos da sua missão e atribuições', None)


def resolve(o):
    """A origem inteira: o excerto, o selo e o endereço."""
    alvo = o.get('texto') and f"{o['pasta']}/{o['texto']}" or (f"{o['pasta']}/{o['ficheiro']}" if o['pasta'] else o['ficheiro'])
    texto = le_campo(alvo, o['tipo'], o['caminho'])
    excerto = recorta(texto, o['inicio'], o['fim'])
    if o['pasta']:
        r = pedido(o['pasta'], o['ficheiro'])
        if hashlib.sha256((MOTOR / o['pasta'] / o['ficheiro']).read_bytes()).hexdigest() != r['sha256']:
            raise SystemExit(f"{o['chave']}: os bytes não são os do registo do pedido")
        selo = {'motor': f"{o['pasta']}/{o['ficheiro']}", 'campo': o['rotulo'], 'hora': r['timestamp_utc'],
                'cliente': o.get('cliente') or r.get('cliente') or CLIENTE_L1, 'sha256': r['sha256']}
        if o.get('texto'):
            e = next(json.loads(l) for l in (MOTOR / o['pasta'] / 'extracoes.jsonl').read_text(encoding='utf-8').splitlines() if json.loads(l)['file'] == o['texto'])
            if hashlib.sha256((MOTOR / o['pasta'] / o['texto']).read_bytes()).hexdigest() != e['sha256']:
                raise SystemExit(f"{o['chave']}: a extração não é a do registo")
            selo['extracao'] = {'ficheiro': f"{o['pasta']}/{o['texto']}", 'sha256': e['sha256'], 'ferramenta': e['tool']}
        declaracao = {'publicador': o['publicador'], 'documento': o['documento'], 'url': r['url'], 'lido': r['timestamp_utc'][:10],
                      'lingua': o['lingua'], 'excerto': excerto, 'selo': selo}
    else:
        rel = o['ficheiro'][len(FONTE):]
        a = alojada(rel)
        if hashlib.sha256((MOTOR / o['ficheiro']).read_bytes()).hexdigest() != a['sha256']:
            raise SystemExit(f"{o['chave']}: os bytes não são os do manifesto do estudo 13")
        declaracao = {'publicador': o['publicador'], 'documento': o['documento'], 'url': a['url'], 'lido': a['hora'][:10],
                      'lingua': o['lingua'], 'excerto': excerto,
                      'alojada': {'motor': o['ficheiro'], 'campo': o['rotulo'], 'hora': a['hora'], 'cliente': a['cliente'], 'sha256': a['sha256']}}
    if o.get('ingles'):
        caminho, ini, fim = o['ingles']
        declaracao['excertoEn'] = recorta(le_campo(f"{o['pasta']}/{o['ficheiro']}", o['tipo'], caminho), ini, fim)
    return o['chave'], declaracao


def js(chave, d):
    q = lambda s: json.dumps(s, ensure_ascii=False)
    linhas = [f"  {q(chave)}: {{"]
    for k in ('publicador', 'documento', 'url', 'lido', 'lingua', 'excerto', 'excertoEn'):
        if k in d:
            linhas.append(f"    {k}: {q(d[k])},")
    for k in ('selo', 'alojada'):
        if k in d:
            linhas.append(f"    {k}: {{")
            for kk, vv in d[k].items():
                linhas.append(f"      {kk}: {json.dumps(vv, ensure_ascii=False)},")
            linhas.append('    },')
    linhas.append('  },')
    return '\n'.join(linhas)


def main(argv):
    origens = dict(resolve(o) for o in O)
    if '--escreve-js' in argv:
        alvo = Path(argv[argv.index('--escreve-js') + 1])
        alvo.write_text('\n'.join(js(k, d) for k, d in origens.items()) + '\n', encoding='utf-8')
        print(f'{len(origens)} origens escritas em {alvo}')
        return 0
    if '--confere' in argv:
        codigo = ("import('" + str(RAIZ / 'src/data/figuras.mjs') + "').then(m => console.log(JSON.stringify(m.ORIGENS_DAS_DEFINICOES)))")
        declaradas = json.loads(subprocess.run(['node', '-e', codigo], capture_output=True, text=True, check=True, cwd=RAIZ).stdout)
        faltas = []
        for chave, d in origens.items():
            dd = declaradas.get(chave)
            if dd is None:
                faltas.append(f'{chave}: não está declarada em figuras.mjs')
                continue
            for k in ('url', 'lido', 'excerto', 'excertoEn', 'selo', 'alojada', 'publicador', 'documento'):
                if d.get(k) != dd.get(k):
                    faltas.append(f'{chave}: o campo «{k}» da declaração difere do que se lê no motor')
        print(json.dumps({'motor': os.path.relpath(MOTOR, RAIZ), 'origens': len(origens), 'conferidas': len(origens) - len({f.split(':')[0] for f in faltas}),
                          'faltas': faltas}, ensure_ascii=False, indent=2))
        return 1 if faltas else 0
    print(json.dumps(origens, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
