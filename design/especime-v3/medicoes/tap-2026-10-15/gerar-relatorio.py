"""Regenera a ficha a partir do livro e dos recibos privados, sem copiar corpos.
Uso: python3 gerar-relatorio.py --motor <motor>
As provas da execução vivem ao lado deste guião. Nenhum caminho local é gravado.
"""
import argparse,json,re,sys,hashlib
from pathlib import Path
from decimal import Decimal

parser=argparse.ArgumentParser()
parser.add_argument('--motor',type=Path,required=True)
args=parser.parse_args()
sys.path.insert(0,str(args.motor))
from publisher import tap as T
out=Path(__file__).resolve().parent
ledger=json.loads((T.STUDY/'ledger.json').read_text());T.verify(ledger)
if (out/'entrega-segunda.json').exists():
    seal=json.loads((out/'entrega-segunda.json').read_text())
    for name,digest in seal['fontes_sha256'].items():
        assert hashlib.sha256((T.STUDY/name).read_bytes()).hexdigest()==digest,'Fonte difere da prova de entrega: '+name
    assert hashlib.sha256(Path(__file__).read_bytes()).hexdigest()==seal['gerador_sha256'],'Guião difere da prova de entrega'
    for name,digest in seal['registos_sha256'].items():
        assert hashlib.sha256((out/name).read_bytes()).hexdigest()==digest,'Registo difere da prova de entrega: '+name
    assert seal['core_gate_conteudo_commit']==seal['tap_test_conteudo_commit']==seal['commit_motor']
    assert seal['core_gate_codigo']==seal['tap_test_codigo']==0
rows=ledger['claims'];by={r['id']:r for r in rows}
specs={s['id']:s for s in json.loads((T.STUDY/'extracoes.json').read_text())['rows']}
catalog=json.loads((T.STUDY/'fontes.json').read_text())
rights=json.loads((T.SOURCE/'direitos/avaliacao.json').read_text())

def v(id):return by[id]['value']
def ref(id):
    assert id in by
    return '['+id+'](#'+id+')'
def refs(*ids):return ', '.join(map(ref,ids))
def q(id):return '«'+by[id]['excerpt']+'»'
def clean(s):return str(s).replace('|','\\|').replace('\n','<br>')
def table(headers,data):
    return '\n| '+' | '.join(headers)+' |\n|'+'|'.join('---' for _ in headers)+'|\n'+''.join('| '+' | '.join(clean(c) for c in row)+' |\n' for row in data)+'\n'
def doc(r):
    links=[]
    links.append(f"[{r['document']['title']}]({r['source_url']}); {r['document']['locator']}")
    if r.get('translation'):
        translation=r['translation'];links.append(f"[Tradução inglesa secundária]({translation['source_url']}), PDF p. {translation['page']}")
    return '<br>'.join(links)
def segments(r):
    return '<br>'.join(f"{('PDF p. '+str(p['page'])+': ') if p['page'] else ''}«{p['text']}»" for p in r['excerpt_parts'])
def number(id):return Decimal(re.sub(r'[^\d.-]','',v(id)))

parts=['# Pesquisa TAP, corrigida a 19.10.2026\n\nDocumento de preparação do artigo «O que se discute». Regenerado por `gerar-relatorio.py` a partir do livro, dos seletores e dos recibos alojados no motor. Não é um artigo nem uma avaliação da decisão. Nenhum corpo é exportado para o sítio.\n']
parts.append('''
## 1. O facto que foi possível confirmar

O anúncio documenta a seleção da proposta da Lufthansa numa privatização parcial. Não demonstra a transmissão concluída das ações nem o recebimento do preço. A comunicação oficial do Governo e a apresentação constituem a prova do anúncio; a resolução específica de seleção e o contrato final não estão alojados.

'''+q('afirmacao-governo-tap-participacao')+' '+ref('afirmacao-governo-tap-participacao')+'\n\n'+q('afirmacao-lufthansa-tap-contratos')+' '+ref('afirmacao-lufthansa-tap-contratos')+'\n\nA data do comunicado da Lufthansa, extraída de `datePublished`, é '+by['afirmacao-lufthansa-tap-contratos']['published_at']+'. A data de acesso está apenas no inventário.\n')
parts.append('''
## 2. Termos e limites do que está documentado

As participações, os preços, as condições e os calendários abaixo conservam a atribuição e a natureza de proposta ou previsão. Não constituem prova de pagamento ou execução.
''')
terms=[
 ('Participação e trabalhadores',['afirmacao-governo-tap-participacao','afirmacao-governo-tap-trabalhadores','afirmacao-governo-tap-maioria-estado','afirmacao-lufthansa-tap-participacao-maxima']),
 ('Preço e ajustes',['tap-oferta-referencia','tap-oferta-ajustes','tap-oferta-trabalhadores','tap-oferta-hipotese-fecho']),
 ('Segunda fase e permuta',['tap-oferta-permuta','tap-recuperacao-fase2','tap-oferta-hipotese-fase2']),
 ('Salvaguardas e gestão',['afirmacao-governo-tap-salvaguardas','afirmacao-governo-tap-controlo-operacional']),
 ('Responsabilidades do Estado',['afirmacao-governo-tap-imoveis-passivos','afirmacao-governo-tap-siavilo']),
 ('Prémio sobre a concorrente e earn-out',['tap-oferta-premio-qualificado','tap-oferta-afklm-earnout','tap-oferta-afklm-total-earnout','tap-oferta-afklm-ebitda-earnout','tap-oferta-afklm-divida-earnout']),
 ('Assinatura, reguladores e conclusão',['tap-governo-assinatura','tap-governo-fase2','tap-governo-aprovacoes','tap-governo-conclusao'])]
parts.append(table(['Tema','Linhas documentais'],[(name,refs(*ids)) for name,ids in terms]))
parts.append('O respeito pelos compromissos laborais aparece como **critério de seleção de propostas**, na alínea i) do número indicado no caderno. Não se confunde com os requisitos de participação. O Decreto-Lei também distingue as duas categorias. '+refs('tap-caderno-direitos-laborais','tap-caderno-criterios','tap-dl-requisitos','tap-dl-criterios')+'. Não há contrato final alojado que permita afirmar uma garantia de manutenção de todos os postos de trabalho.\n\nO direito de preferência e o prazo de assinatura estão documentados em '+refs('tap-caderno-preferencia','tap-caderno-assinatura')+'. O direito de preferência não demonstra recompra automática. O calendário de conclusão e a hipótese de fecho usada no preço permanecem distintos; não se harmonizam sem contrato ou esclarecimento.\n')
parts.append('''
## 3. Inventário dos documentos e tentativas

A data e hora abaixo são as do acesso, nunca a data da afirmação. O estado HTTP e o resumo são lidos dos recibos. Uma resposta sem corpo, um redirecionamento ou um documento de outro processo não servem de prova.

Os originais portugueses das três contas consolidadas foram alojados a partir das ligações da página portuguesa de investidores da TAP. Documento, evidência, endereço, nome e excerto principais passam ao original português. A tradução inglesa fica num campo secundário, com a equivalência dos montantes conferida; as próprias contas dizem que o original português prevalece. Os seletores de ambos os corpos estão no livro e são conferidos pelo gerador.
''')
items=[]
for c in catalog:
    receipt=json.loads((T.SOURCE/c['receipt']).read_text())
    items.append((c['file']+'; '+c['title'],'[fonte]('+receipt['pedido']+')',receipt['acedido_em'],receipt['sha256'],receipt.get('estado'),c['status']+'; '+c['note']))
parts.append(table(['Documento','Endereço','Acesso UTC','SHA256','HTTP','Uso'],items))
parts.append('''
## 4. Ficha de números e outros factos documentais

Cada identificador resolve na linha do livro. O valor conserva a grafia da fonte. A ausência de valor é textual, nunca zero. A página é contada desde a primeira folha do PDF. As notas de apoio são segmentos separados, cada um contínuo na sua área física; não são coladas como se fossem uma única frase do documento.
''')
items=[]
for r in rows:
    items.append((f'<a id="{r["id"]}"></a>`{r["id"]}`',r['value'] if r['value'] is not None else 'Sem número',r['unit'] or '',r['reference_date'] or '',doc(r),r['note']))
parts.append(table(['Linha','Literal','Unidade','Referência','Documento e localizador','Limite'],items))
parts.append('''
Os auxílios notificados, aprovados, convertidos e pagos são categorias distintas. O empréstimo convertido não pode ser somado de novo sem reconciliar os fluxos. A CGE, as contas da TAP e a Parpública não fecham, nesta recolha, uma conta cumulativa de tudo o que o Estado pagou e recebeu.

## 5. Afirmações públicas, com autor, data e conferência própria

Cada linha tem o seu caminho de conferência. Uma ligação a outra declaração permite comparar as declarações; não a converte numa verificação independente. Quando falta a fonte necessária, a tabela diz a ausência. Propostas programáticas e iniciativas anteriores não são apresentadas como reações atuais.
''')
complementares={
 'tap-recuperacao-fase1':['afirmacao-governo-tap-preco'],
 'tap-recuperacao-fase2':['afirmacao-governo-tap-dinheiro-fase2'],
 'tap-recuperacao-total':['tap-recuperacao-fase1','tap-recuperacao-fase2','tap-recuperacao-acoes-dividendos'],
 'tap-oferta-afklm-total':['tap-oferta-afklm-referencia','tap-oferta-afklm-ajustes','tap-oferta-afklm-trabalhadores'],
 'tap-oferta-afklm-total-earnout':['tap-oferta-afklm-total','tap-oferta-afklm-earnout'],
 'tap-oferta-diferenca':['afirmacao-governo-tap-preco','tap-oferta-afklm-total'],
 'tap-oferta-diferenca-earnout':['afirmacao-governo-tap-preco','tap-oferta-afklm-total-earnout'],
 'tap-oferta-premio-qualificado':['tap-oferta-diferenca','tap-oferta-afklm-total','tap-oferta-afklm-earnout'],
 'tap-oferta-premio-earnout':['tap-oferta-diferenca-earnout','tap-oferta-afklm-total-earnout'],
 'tap-governo-assinatura':['afirmacao-lufthansa-tap-contratos','tap-caderno-assinatura'],
 'tap-governo-conclusao':['tap-oferta-hipotese-fecho'],
 'tap-governo-fase2':['tap-oferta-hipotese-fase2'],
 'afirmacao-governo-tap-razoes-investimento':['tap-ce-condicoes','tap-ce-reestruturacao-aprovada']}
assert number('tap-oferta-afklm-total')==sum(number('tap-oferta-afklm-'+part) for part in ['referencia','ajustes','trabalhadores'])
assert number('tap-oferta-afklm-total-earnout')==number('tap-oferta-afklm-total')+number('tap-oferta-afklm-earnout')
assert number('tap-oferta-diferenca')==number('afirmacao-governo-tap-preco')-number('tap-oferta-afklm-total')
assert number('tap-oferta-diferenca-earnout')==number('afirmacao-governo-tap-preco')-number('tap-oferta-afklm-total-earnout')
items=[]
for r in rows:
    if not r['afirmacao']:continue
    checks=[]
    for item in r['invoca']:
        destinos=item['conferir_com'] or complementares.get(r['id'],[])
        checks.append(item['facto']+'. '+item['estado']+' Conferir: '+(refs(*destinos) if destinos else 'sem outra linha de conferência indicada nesta afirmação'))
    if r['id']=='afirmacao-ps-tap-recuperacao':checks.append('O PS invoca crescimento da atividade e contribuições fiscais. As linhas governamentais de ações e dividendos medem outra via de recuperação e não conferem essa alegação fiscal. Falta a série de contribuições fiscais e a sua projeção.')
    date=r['published_at'] if r['document_checks'].get('published_at',{}).get('status')=='conferido' else 'Data não confirmada'
    items.append((ref(r['id']),', '.join(r['attributed_to']),date,doc(r),segments(r),'<br>'.join(checks)))
parts.append(table(['Linha','Quem','Quando','Onde','Transcrição','Conferência específica'],items))
parts.append('A comparação pública das propostas é a frase do comunicado em '+ref('afirmacao-governo-tap-comparacao-propostas')+'. A qualificação pelo earn-out está no diapositivo, em '+ref('tap-oferta-premio-qualificado')+'; não se cola à transcrição do comunicado.\n')
parts.append('A conta da IL dispõe agora dos resultados dos três exercícios anteriores à sua declaração: '+refs('tap-2022-resultado','tap-2023-resultado','tap-2024-resultado')+'. A seleção do perímetro e a reconciliação do capital invocado ainda têm de ser justificadas. A declaração sobre lucros da TAP SA e a contribuição fiscal do PCP continuam a exigir a série e o perímetro apropriados.\n')
parts.append('''
## 6. Gémeos e decomposições que não se podem substituir
''')
items=[
 (v('afirmacao-lufthansa-tap-preco')+' billion EUR / '+v('afirmacao-governo-tap-preco')+' M€',refs('afirmacao-lufthansa-tap-preco','tap-oferta-referencia','tap-oferta-ajustes','tap-oferta-trabalhadores'),'A apresentação separa preço de referência, ajustes e trabalhadores. Não confundir a parcela inicial com toda a companhia.'),
 (v('tap-oferta-premio-qualificado')+'% / '+v('tap-oferta-premio-earnout')+'%',refs('tap-oferta-premio-qualificado','tap-oferta-afklm-total','tap-oferta-afklm-total-earnout'),'O próprio diapositivo qualifica o prémio pelo earn-out condicional. Conservar as condições de EBITDA e dívida da nota.'),
 (v('tap-cge-2022-dotacao')+' / '+v('tap-cge-2022-numerario')+' milhões de euros',refs('tap-cge-2022-dotacao','tap-cge-2022-numerario','tap-cge-2022-quadro-dgtf','tap-cge-2022-quadro-sgps'),'O primeiro valor está no comentário ao quadro em ótica de contas nacionais; o segundo entre dotações de capital realizadas em numerário. O quadro da DGTF também tem uma linha própria da TAP SGPS. Os documentos não explicam integralmente a diferença; não se atribui só ao perímetro. A prosa diz ' +v('tap-cge-2022-numerario')+ ' milhões de euros; o quadro imprime ' +v('tap-cge-2022-quadro-dgtf')+ ' para a TAP SA e ' +v('tap-cge-2022-quadro-sgps')+ ' para a TAP SGPS sob «milhões de euros». A escala não se reconcilia na fonte, em ambas as linhas.'),
 ('Consolidado / acionistas / individual',refs('tap-2025-resultado','tap-2025-resultado-acionistas','tap-2025-resultado-individual'),'Perímetros e atribuições diferentes; não escolher o resultado mais favorável.'),
 ('Dívida com / sem locações',refs('tap-2025-divida-liquida-com-locacoes','tap-2025-divida-liquida-sem-locacoes'),'As definições de dívida e de ativos deduzidos diferem. A unidade local dos quadros de dívida sem locações está explicitamente por confirmar na auditoria abaixo.'),
 ('Publicado / reexpresso',refs('tap-2024-ativo-original','tap-2024-ativo-reexpresso'),'Conservar a edição original e o comparativo reexpresso. A diferença não é automaticamente crescimento económico.'),
 ('Média / total de pessoal',refs('tap-2025-trabalhadores-media','tap-2025-trabalhadores-total'),'Média do exercício e fotografia do efetivo, com órgãos sociais e diretores no total, são bases distintas.'),
 ('Capital subscrito / realização',refs('tap-capital-subscrito-2022','tap-capital-calendario-2022','tap-capital-segunda-prestacao-adiada','tap-capital-ultima-prestacao-adiada'),'Subscrição, prestações, alterações de calendário e pagamento não são entradas adicionais automaticamente somáveis.')]
parts.append(table(['Medidas','Linhas','O que a prova permite dizer'],items))
ids=['tap-recuperacao-fase1','tap-recuperacao-fase2','tap-recuperacao-acoes-dividendos']
total=sum(number(id) for id in ids)
parts.append('A recuperação projetada até '+re.search(r'até (\d{4})',by['tap-recuperacao-total']['excerpt'])[1]+' decompõe-se em '+ ' + '.join(v(id) for id in ids)+' M€, sendo a última parcela aproximada. A soma aritmética dos literais é '+str(total)+' M€; o diapositivo imprime ~'+v('tap-recuperacao-total')+' M€. Conservam-se a aproximação e os pressupostos dos assessores. '+refs(*ids,'tap-recuperacao-total')+'. A soma não equivale ao dinheiro que o Estado já recebeu.\n')
parts.append('''
## 7. Ausências e limites

- A resolução específica de seleção, a proposta integral, o contrato final, o acordo parassocial e comprovativos de pagamento não estão alojados.
- A decisão inicial do auxílio de emergência não foi alojada. A decisão de reapreciação recita o ato anterior; não se lhe atribui um identificador ausente das fontes.
'''+q('tap-ce-decisao-inicial-recitada')+' '+ref('tap-ce-decisao-inicial-recitada')+'''
- Faltam todos os atos de compensação da pandemia e uma reconciliação integral dos fluxos do Estado, Parpública, TAP SA e TAP SGPS. As fontes UTAO/CFP invocadas no documento assinado por Inês de Sousa Real continuam por conferir; a filiação PAN não está confirmada no corpo.
- O corpo da auditoria do Tribunal de Contas não foi obtido. As tentativas, erros e o índice oficial continuam no inventário. Não se transcrevem conclusões de um relatório não lido.
- O DAR alojado contém votações; não substitui o debate cuja obtenção falhou. A recolha não é uma coleção completa de perguntas, requerimentos e respostas parlamentares.
- As reações alojadas de partidos não cobrem todos os partidos. Os textos anteriores da IL, de Inês de Sousa Real (iniciativa catalogada como PAN, filiação não confirmada no corpo), da AD e do LIVRE não provam a posição atual. A data exata da página do LIVRE permanece por confirmar.
- A veracidade das alegações históricas, das contribuições fiscais e das recuperações futuras não fica estabelecida pela sua transcrição.

### Limites da conferência automática, por linha

As lacunas abaixo são preservadas como lacunas, não como metadados provados. Para as datas não declaradas, o acesso nunca preenche a data da publicação.
''')
audit=json.loads((out/'auditoria-segunda.json').read_text())
parts.append('A auditoria da cabeça anterior identificou '+str(len(audit['datas']))+' linhas sem âncora de data e '+str(len(audit['atribuicoes']))+' afirmações sem atribuição conferida no documento. A tabela mantém todas, mesmo quando esta passagem recupera a prova. O artigo só cita com data as linhas com data documental conferida.\n')
for field,key in [('published_at','datas'),('attributed_to','atribuicoes')]:
    limits=[]
    for a in audit[key]:
        r=by[a['id']];current=r['document_checks'][field]
        limits.append((ref(r['id']),a['razao_anterior'],current['status'],current.get('reason',current.get('text',''))))
    parts.append(table(['Linha: '+field,'Lacuna na cabeça anterior','Estado atual','Prova ou razão atual'],limits))
limits=[(ref(r['id']),'unidade',r['unit_check']['unverified']) for r in rows if r.get('unit_check',{} ) and r['unit_check'].get('unverified')]
parts.append(table(['Linha','Campo','O que falta'],limits))
parts.append('''
## 8. Material para as perguntas do financiador, sem lhes responder
''')
parts.append(table(['Pergunta','Material recolhido','Antes de concluir'],[
 ('Porque se vende?',refs(*[id for id in by if id.startswith('afirmacao-governo-tap-razoes-')]),'O preâmbulo sela as razões que o Governo invoca, incluindo a impossibilidade de investir. Falta confrontar a interpretação jurídica com as condições europeias e as alternativas consideradas.'),
 ('Os números apresentados são sólidos?',refs('tap-recuperacao-fase1','tap-recuperacao-fase2','tap-recuperacao-acoes-dividendos','tap-recuperacao-total','tap-oferta-premio-qualificado','tap-oferta-afklm-earnout','tap-oferta-afklm-ebitda-earnout','tap-oferta-afklm-divida-earnout','tap-cge-2022-quadro-sgps')+'; contas e auxílios da ficha','Reconciliar caixa pública e pressupostos; distinguir estimativa, aproximação, proposta e execução. A linha da SGPS e a da TAP SA têm escala não reconciliada na fonte; não são montantes sólidos sem essa ressalva.'),
 ('É a decisão certa ou um erro?',refs('afirmacao-governo-tap-imoveis-passivos','afirmacao-governo-tap-siavilo','tap-caderno-criterios','tap-caderno-direitos-laborais','tap-governo-aprovacoes'),'Definir critérios de avaliação, alternativas, riscos assumidos pelo Estado e condições contratuais efetivas.'),
 ('O que dizem os partidos e fundamentam-no com dados exatos?','Tabela por afirmação; '+refs('tap-2022-resultado','tap-2023-resultado','tap-2024-resultado','afirmacao-il-tap-retorno'),'Completar reações atuais, série fiscal e contratos históricos. Conferir o perímetro e o capital do cálculo da IL, e as fontes e compensações invocadas por Inês de Sousa Real. A assinatura está conferida; a filiação PAN não está confirmada no corpo.')]))
parts.append('''
## 9. Direitos e reprodução

Os corpos permanecem no motor privado. O aviso próprio do EUR-Lex continua **por ler**: as tentativas alojadas não entregaram corpo e a leitura web pediu verificação JavaScript. Não se aplica CC BY por extensão.

O portal de processos da concorrência aponta, no seu próprio rodapé, para o aviso da Comissão. O recurso da interface que contém a ligação, o recibo e o aviso seguido foram alojados em `source/direitos/`. A avaliação descreve essa ligação documental e as exclusões do aviso, em vez de inferir a licença pelo domínio. A autorização não é generalizada aos documentos de terceiros. Para os restantes anfitriões sem aviso lido, a avaliação diz «aviso por ler» ou licença não confirmada. Robots.txt e políticas de privacidade não são licenças de reprodução.

Os termos da TAP exigem autorização prévia para reprodução ou utilização dos conteúdos; a pesquisa não obteve autorização específica para publicar os corpos. Não existe exportador TAP nem mudança numa página do sítio.

## 10. Provas da entrega

''')
parts.append(f"Inventário medido: {len(rows)} linhas, {sum(r['value'] is not None for r in rows)} com número, {sum(r['afirmacao'] for r in rows)} afirmações e {sum('translation' in r for r in rows)} citações primárias do original português. Manifesto: {len((T.SOURCE/'MANIFEST.sha256').read_text().splitlines())} ficheiros.\n\n")
for name in ['segunda-publisher.tap_test.log','segunda-motor-resumo.log','segunda-commit-motor.log']:
    p=out/name
    if p.exists():
        lines=p.read_text().splitlines();tail=lines[-1:] if name=='segunda-publisher.tap_test.log' else [x for x in lines if any(k in x for k in ['código','GATE:','cabeça','commit'])]
        parts.append(f"[{name}]({name}): "+'; '.join(tail).rstrip('.')+'.\n\n')
    else:parts.append(f'`{name}`: execução ainda por registar.\n\n')
seal=out/'entrega-segunda.json'
if seal.exists():
    data=json.loads(seal.read_text());parts.append('```json\n'+json.dumps(data,ensure_ascii=False,indent=2)+'\n```\n')
comparison=json.loads((out/'comparacao-valores-segunda.json').read_text())
assert hashlib.sha256((T.STUDY/'ledger.json').read_bytes()).hexdigest()==comparison['ledger_sha256']
parts.append(f"[comparacao-valores-segunda.json](comparacao-valores-segunda.json): {comparison['montantes_equivalentes']} montantes conferidos como numericamente equivalentes; {comparison['grafias_alteradas']} grafias passaram ao original; {comparison['linhas_novas']} linhas novas.\n\n")
parts.append('A conferência visual das páginas e os resumos das imagens temporárias estão em [segunda-conferencia-visual.json](segunda-conferencia-visual.json).\n\n')
parts.append('As execuções de cada planta ficam em [segunda-plantas.json](segunda-plantas.json). A reprodução do relatório em duas execuções está registada em [segunda-reproducibilidade.json](segunda-reproducibilidade.json).\n\n')
parts.append('Os portões de página e as capturas do sítio não se aplicam a esta passagem documental. O portão completo do motor e o seu pre-commit são exigidos. O registo integral é `segunda-motor.log`, ao lado do resumo de `curto.sh`. A linha `tokens used` não foi exposta nesta sessão; o custo em pontos é medido pelo lançador.\n')
parts.append('\n## A passagem de correção de 19.10.2026\n\nCada ponto identifica as linhas e a prova observável. As plantas recusadas estão no registo do teste e no código comitado.\n')
findings=[
 (5,'Responsabilidades do Estado e recuperação',['afirmacao-governo-tap-imoveis-passivos','afirmacao-governo-tap-siavilo','tap-recuperacao-fase1','tap-recuperacao-fase2','tap-recuperacao-acoes-dividendos','tap-recuperacao-total'],'Segmentos por coluna e nota dos assessores; valores nulos nas responsabilidades textuais.'),
 (6,'Critério laboral',['tap-caderno-criterios','tap-caderno-direitos-laborais','tap-dl-requisitos','tap-dl-criterios'],'A secção dos termos distingue critério e requisito.'),
 (7,'Data da Lufthansa',['afirmacao-lufthansa-tap-preco'],'Data de publicação extraída do elemento datePublished; planta corpo published_at.'),
 (8,'Decisão inicial',['tap-ce-decisao-inicial-recitada'],'O identificador ausente foi retirado. A reapreciação é a fonte da citação.'),
 (9,'Colunas vizinhas',['tap-2025-trabalhadores-total','tap-oferta-permuta','tap-governo-aprovacoes'],'Áreas físicas independentes. Plantas excerto antigo atravessa colunas e colunas.'),
 (10,'Metadados contra o documento',[],'Plantas corpo title, corpo published_at, corpo attributed_to e unidade no corpo. Lacunas por linha na secção de limites.'),
 (11,'Conferir por afirmação',['afirmacao-governo-tap-recuperacao','afirmacao-pcp-tap-controlo','afirmacao-il-tap-retorno'],'A tabela usa invoca de cada linha e correspondências por afirmação do guião, incluindo contas entre as parcelas seladas; não agrupa caminhos pelo documento.'),
 (12,'Prémio qualificado',['tap-oferta-premio-qualificado','tap-oferta-afklm-referencia','tap-oferta-afklm-ajustes','tap-oferta-afklm-trabalhadores','tap-oferta-afklm-total','tap-oferta-afklm-earnout','tap-oferta-afklm-total-earnout'],'A afirmação pública permanece no comunicado; a qualificação e as condições do earn-out estão nas linhas separadas da apresentação.'),
 (13,'Resultado anterior para a IL',['tap-2022-resultado'],'Coluna comparativa das contas; regressão do literal e ligação ao original português.'),
 (14,'Óticas da CGE',['tap-cge-2022-dotacao','tap-cge-2022-numerario','tap-cge-2022-quadro-dgtf','tap-cge-2022-quadro-sgps'],'A nota não atribui a diferença só ao perímetro nem resolve a unidade por hipótese.'),
 (15,'Grafia e títulos',['tap-cge-2022-quadro-dgtf','tap-caderno-preferencia','tap-caderno-assinatura','tap-ce-slots','tap-ce-emergencia-limite','afirmacao-livre-tap-controlo'],'Extração por área ou fluxo; supressão apenas das chamadas de rodapé identificadas como expoentes. Títulos literais conferidos; regressões dos artefactos antigos.'),
 (16,'Direitos',[],'Avisos, tentativas e ligação do próprio portal em direitos; EUR-Lex por ler, sem licença por extensão.'),
 (17,'Entrega reproduzível',[],'Este guião, saída do teste, registo integral e resumo do portão, pedido de commit e entrega-segunda.json ficam na pasta das medições.'),
 (18,'Contas originais',['tap-2023-resultado','tap-2024-resultado','tap-2025-resultado'],'Originais alojados e citados primeiro; planta original aponta comparativo errado.'),
 (19,'Seletores',[],'Plantas início repetido, cabeçalho longe do valor e página fora do documento; cadeia única, página válida e bloco físico obrigatório para cabeçalho.'),
 (20,'Razões da venda',[id for id in by if id.startswith('afirmacao-governo-tap-razoes-')],'Preâmbulo transcrito como afirmação do Governo, sem validar os seus pressupostos.')]
for n,title,ids,proof in findings:
    parts.append(f'\n### Achado {n}: {title}\n\n{proof}\n\n')
    for id in ids:
        r=by[id];parts.append(ref(id)+'; '+r['document']['locator']+'. '+segments(r)+'\n\n')
parts.append('TAP-1: as notas separadas são apresentadas como segmentos, nunca como uma frase contínua inventada. TAP-2: as insuficiências de atribuição textual no PDF com logótipo e de unidade local permanecem declaradas por linha. TAP-3: a soma aritmética das parcelas aproximadas não substitui o total aproximado impresso. TAP-4: uma fonte sem corpo não recebe licença presumida.\n')
parts.append('\n## A segunda passagem de correção de 19.10.2026\n\nOs registos `segunda-publisher.tap_test.log` e `segunda-motor.log` identificam a cabeça do motor. As plantas permanentes vivem em `publisher/tap_test.py` e `content/22 TAP/plantas.json`.\n')
second=[
 (7,'Comunicado e diapositivo distintos',['afirmacao-governo-tap-comparacao-propostas','tap-oferta-premio-qualificado'],'O comunicado recupera excerto, data e atribuição próprios. A tabela das afirmações aponta para a qualificação no diapositivo. Regressões conferem os dois corpos e impedem a substituição.'),
 (8,'Comparativo individual completo',['tap-2025-resultado-individual'],'Linha inteira, incluindo os dois montantes entre parênteses. Plantas caixa antiga corta comparativo e excerto truncado permanente; segunda extração e geometria dos tokens.'),
 (9,'Réguas que recusam as regressões',[],'Cada seletor PDF declara a área de leitura e as colunas. A prova independente usa pdftotext por linha ou coluna; a seleção usa MuPDF ou outro modo de leitura. A cadeia inicial tem exatamente uma ocorrência na página, incluindo a leitura por colunas. Cabeçalhos de quadros ficam em segmentos separados da linha: a proximidade mede o cabeçalho mais a linha, com limite por omissão de 200 caracteres. Plantas a 300 caracteres, início repetido, zero ocorrências, continuidade independente, área atravessa coluna vizinha, unidade ausente, cabeçalho ausente e regressões permanentes colada e truncada. A comparação de expenses ignora maiúsculas.'),
 (10,'Escala não reconciliada na CGE',['tap-cge-2022-quadro-dgtf','tap-cge-2022-quadro-sgps','tap-cge-2022-numerario'],'Cabeçalho e prosa lidos na página alojada; a unidade literal mantém-se, acompanhada da ressalva nas duas linhas e na secção 8. Não se converte nem se escolhe uma escala.'),
 (11,'Corpo sem rodapé',['tap-ce-condicoes'],'A seleção usa a área do corpo; a regressão exige namely: (a) fully divesting e a planta rodapé no fluxo recusa a colagem antiga. Flow sem área de corpo também é recusado.'),
 (12,'Datas sem âncora',[],'Todas as linhas identificadas na auditoria anterior estão listadas na secção 7, com motivo e estado atual. Período de referência e data de acesso não preenchem published_at.'),
 (13,'Atribuições sem âncora',[],'Todas as afirmações identificadas na auditoria anterior estão listadas na secção 7. A atribuição do comunicado recuperado está agora conferida; as restantes lacunas ficam explícitas.'),
 (15,'Original português primário',['tap-2023-resultado','tap-2024-resultado','tap-2025-resultado','tap-capital-ultima-prestacao-adiada'],'Documento, evidence, source_url, name e excerpt apontam ao original. Tradução em campo secundário. A rubrica de capital da deliberação é prestação acessória de capital, como o original escreve. Planta original aponta comparativo errado.'),
 (16,'Direitos por anfitrião',[],'Os recibos de ec.europa.eu dizem aviso por ler; não recebem CC BY por extensão. As fontes TAP têm uma avaliação única. Avaliação e manifesto regenerados; regressões no teste.'),
 (17,'Provas na cabeça final',[],'entrega-segunda.json regista a cabeça, os códigos e os resumos dos registos integrais. O core.gate completo e o publisher.tap_test correm depois do commit do motor. Não há exportação nem publicação.'),
 (18,'Calendário na linha própria',['tap-governo-aprovacoes','tap-governo-conclusao'],'A nota das aprovações não repete uma data ausente do excerto; remete para a linha da conclusão.'),
 (19,'Data divergente dentro da fonte',['afirmacao-governo-tap-razoes-investimento','tap-ce-reestruturacao-aprovada'],'O preâmbulo conserva de 21 de dezembro de 2022; a nota identifica que a decisão se data de 21.12.2021. Não se corrige a citação.'),
 (20,'Autoria e notas coerentes',['afirmacao-pan-tap-custo','afirmacao-pan-tap-recapitalizacao','afirmacao-ps-tap-recuperacao'],'Quem mantém Inês de Sousa Real, como a assinatura. Notas e secções 7 e 8 distinguem essa autoria da filiação não conferida no corpo. A nota do PS trata a recuperação e deixa de remeter para a comparação de 2015. A tabela distingue a via fiscal invocada pelo PS das projeções de ações e dividendos do Governo; falta a série fiscal para a conferir.')]
for n,title,ids,proof in second:
    parts.append(f'\n### Achado {n}: {title}\n\n{proof}\n\n')
    for id in ids:
        r=by[id];parts.append(ref(id)+'; '+r['document']['locator']+'. '+segments(r)+'\n\n')
parts.append('TAP-5: nos quadros, cabeçalho e linha são excertos separados, cada um contínuo e conferido; a transcrição não salta linhas fingindo continuidade. TAP-6: a ausência de âncora documental limita a citação, mesmo quando o contexto torna a atribuição provável.\n')
text=''.join(parts)
(out/'RELATORIO.md').write_text(text)
print(f'Relatório regenerado: {len(text.splitlines())} linhas, {len(rows)} linhas documentais.')
