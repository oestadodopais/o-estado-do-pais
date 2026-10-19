"""Relatório HAB, recomposto exclusivamente do pacote de investigação e das provas."""
from pathlib import Path
from decimal import Decimal
from datetime import datetime
import argparse,json,hashlib,collections,re
HERE=Path(__file__).resolve().parent

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--motor',type=Path,required=True);args=parser.parse_args()
    study=args.motor/'content/23 Habitacao'
    load=lambda name:json.loads((study/name).read_text())
    book=load('ledger.json')['claims'];by={r['id']:r for r in book};sources=load('fontes.json');notes=load('cobertura.json');qa=json.loads((HERE/'verificacao.json').read_text())
    lines=['# A casa em Portugal e na Europa: pesquisa com recibos','',
           'Pacote de investigação. Não é um estudo nem responde às perguntas do financiador. Não houve exportação para o sítio.','',
           '## Alcance e limites','',
           'Os números vêm dos corpos alojados no motor, não das fichas preparatórias. As citações mantêm as grafias da fonte; só os espaços de composição são normalizados. As células JSON preservam o token numérico, a bandeira, a unidade e todas as coordenadas. Um excerto JSON é uma transcrição estruturada da célula, não uma frase atribuída ao Eurostat.','',
           'Atualização de conjunto, período estatístico, assinatura de documento, data visível de artigo e acesso são campos distintos. Uma data de publicação ausente continua ausente. As propostas não são apresentadas como legislação aprovada.','']
    def cell(x):return str(x if x is not None else 'por confirmar').replace('|','\\|').replace('\n',' ')
    def row(*xs):lines.append('| '+' | '.join(cell(x) for x in xs)+' |')
    def table(headers):row(*headers);row(*['---']*len(headers))
    def ref(r):return '`'+r['id']+'` ([fonte]('+r['source_url']+'))'
    def val(r):
        if r is None:return 'sem valor publicado'
        if r['value'] is None:return 'sem valor publicado' if r.get('dataset') else 'sem valor numérico separado'
        return r['value']+(' ['+r.get('source_flag')+']' if r.get('source_flag') else '')
    lines+=['## Eurostat: último período de cada medida','',
       'Extremos apenas entre os Estados-membros com valor no mesmo período, com todos os empates. Não se transporta um valor antigo para tapar uma ausência. A União é o agregado da fonte. As unidades e os títulos são os da API. A convenção de melhor é uma escolha de leitura declarada, não uma classificação do Eurostat.','']
    table(['Conjunto e recorte','Último período','Portugal','União','Mais baixo','Mais alto','Unidade','Convenção de melhor','Países sem valor'])
    groups=collections.defaultdict(list)
    for r in book:
        if r.get('dataset') and r.get('group')!='bpstat':groups[r['group']].append(r)
    countryset=set('AT BE BG CY CZ DE DK EE EL ES FI FR HR HU IE IT LT LU LV MT NL PL PT RO SE SI SK'.split())
    for group,rr in sorted(groups.items()):
        latest=max(r['reference_date'] for r in rr);last=[r for r in rr if r['reference_date']==latest];geo={r['coords']['geo']:r for r in last};valid=[r for r in last if r['coords']['geo'] in countryset and r['value'] is not None]
        def extreme(fn):
            if not valid:return 'sem valores'
            n=fn(Decimal(r['value']) for r in valid)
            return '; '.join(r['coords']['geo']+' '+val(r)+' (`'+r['id']+'`)' for r in valid if Decimal(r['value'])==n)
        code=rr[0]['dataset'];recorte=', '.join(k+'='+v for k,v in rr[0]['coords'].items() if k not in ['geo','time','freq'])
        better='Menor sobrecarga, menor sobrelotação ou menor privação, conforme a medida.' if code in ['ilc_lvho07a','ilc_lvho07c','ilc_lvho05a','ilc_mdho06a'] else 'Menor parte do rendimento absorvida pelos custos.' if code=='ilc_mded01' else 'Sem melhor ou pior automático; distribuição, índice, preço, idade ou volume.'
        absent=countryset-{r['coords']['geo'] for r in valid}
        local=lambda k:val(geo.get(k))+(' (`'+geo[k]['id']+'`)' if k in geo else '')
        row('`'+code+'`; '+recorte,latest,local('PT'),local('EU27_2020'),extreme(min),extreme(max),rr[0]['unit'],better,', '.join(sorted(absent)) or 'nenhum')
    lines+=['','Os nomes das medidas, as notas por célula e as séries de Portugal e da União desde 2015 constam de `content/23 Habitacao/ledger.json`. O número de linhas por recorte, a cobertura temporal e a fonte ficam abaixo.','']
    table(['Recorte','Título da fonte','Períodos PT/UE','Linhas','Fonte'])
    for group,rr in sorted(groups.items()):
        pp=sorted({r['reference_date'] for r in rr if r['coords']['geo'] in ['PT','EU27_2020']})
        row(group,rr[0]['name'],pp[0]+' a '+pp[-1]+'; períodos efetivamente presentes no corpo',len(rr),'[API]('+rr[0]['source_url']+')')
    lines+=['','`ilc_mdho06a` termina no período indicado no quadro, com lacunas anuais que não foram preenchidas. `tipsho60` só permite comparar índices, não anos de rendimento. O aviso de descontinuação de `prc_hicp_aind` está alojado em `source/eurostat/prc_hicp_aind-aviso.json`; as rendas usam os novos conjuntos. Não há cálculo por mil habitantes.','',
      '## INE e Banco de Portugal','']
    table(['Linha e fonte','Valor literal','Unidade','Período','Página ou localizador','Limite'])
    for r in book:
        if r['id'].startswith('hab-ine-') or r.get('group')=='bpstat':row(ref(r),val(r),r.get('unit'),r.get('reference_date'),r['document']['locator'],r.get('note',''))
    lines+=['','## Orçamento e diplomas','',
       'Os valores incrementais do Quadro 3.2 não são dotações totais. O Quadro 5.24 usa milhões de euros. As linhas de apoio ao arrendamento e de oferta pública pertencem a ações diferentes; não se substituem pelo total do programa.','']
    table(['Linha e fonte','Página ou quadro','Valor e unidade','Excerto literal ou partes','Limite'])
    for r in book:
        if r['id'].startswith(('hab-oe-','hab-dl97-','hab-arrendamento-','hab-governo-')):
            excerpt=r['source_excerpt']
            parts=r.get('excerpt_parts',[])
            if len(parts)>1:excerpt+=' | Cabeçalho separado: '+'; '.join(p['text'] for p in parts[1:])
            row(ref(r),r['document']['locator'],val(r)+' '+str(r.get('unit') or ''),excerpt,r.get('note',''))
    lines+=['','IRS Jovem: o relatório alojado menciona-o nas páginas PDF 20 e 55, entre outras; não foi extraída uma verba exclusivamente habitacional desta medida. A página PDF 55 continua na 56. Não confundir IRS Jovem com isenções de IMT e IS na compra de casa.','',
      '## Afirmações, propostas e votações','',
      'As linhas identificadas como só em imprensa não confirmam a atribuição na fonte primária. Ausência de fonte primária é declarada mesmo quando a notícia apresenta aspas. Uma posição antiga não é tratada como proposta de outubro.','']
    table(['Linha e documento','Quem e cargo literal quando confirmado','Quando','Onde','O que afirma ou invoca, em excerto literal','Limites'])
    for r in book:
        if r.get('afirmacao') or r['id'].startswith('hab-votacao-'):
            who=r.get('document_checks',{}).get('attributed_to',{}).get('text') or ', '.join(r['attributed_to'])
            row(ref(r),who,r.get('published_at'),r['document']['locator'],r['source_excerpt'],r.get('note',''))
    lines+=['','## Medidas já seladas no sítio, apenas consultadas','', 'Leitura de `ledger/series/*-paises.yml` nesta worktree do sítio. Cópias integrais dos ficheiros consultados ficam em `series-consultadas/`, junto deste relatório, com o mesmo SHA-256. Não foram alteradas nem exportadas séries.', '']
    sealed={}
    table(['Série existente e cópia consultada','Portugal','União','SHA-256 do ficheiro consultado'])
    for id in ['precos-da-habitacao-2025-paises','sobrecarga-do-custo-da-habitacao-2025-paises','sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises']:
        file=HERE.parents[3]/'ledger/series'/(id+'.yml');text=file.read_text()
        snapshot=HERE/'series-consultadas'/file.name;snapshot.parent.mkdir(exist_ok=True);snapshot.write_bytes(file.read_bytes())
        values={}
        for geo in ['PT','EU27_2020']:
            match=re.search(r'- geo: "'+geo+r'"\s+valor: "([^"]+)"',text)
            values[geo]=match[1] if match else 'sem valor na série'
        sealed[id]='Portugal '+values['PT']+'; União '+values['EU27_2020']
        row('['+id+'](series-consultadas/'+file.name+')',values['PT'],values['EU27_2020'],hashlib.sha256(file.read_bytes()).hexdigest())
    lines+=['','## Gémeos: conservar os dois','']
    table(['Par','Linhas ou documentos','Razão da diferença e limite'])
    for twin in notes['gemeos']:
        refs=[]
        for x in twin['linhas']:
            extra=val(by[x])+' '+str(by[x].get('unit') or '') if x in by and by[x]['value'] is not None else sealed.get(x,'')
            refs.append('`'+x+'`'+(': '+extra if extra else ''))
        row(twin['tema'],'; '.join(refs),twin['razao'])
    lines+=['','## Ausências, decisões pequenas e trabalho aberto','']
    table(['Referência','O que ficou por confirmar','Documento ou tentativa'])
    for gap in notes['pendencias']:row(gap['id'],gap['texto'],gap['provas'])
    lines+=['','## Documentos para a sessão seguinte, sem responder às perguntas','']
    table(['Pergunta','Documentos e linhas utilizáveis','O que falta'])
    for q in notes['perguntas']:row(q['pergunta'],q['linhas'],q['falta'])
    lines+=['','## Inventário de fontes e direitos','',
       'Os corpos, pedidos e direitos vivem em `content/23 Habitacao/source/`. `fontes.json` distingue prova, descoberta, recusa e documento alheio. O manifesto inclui todos os ficheiros de `source/`, exceto o próprio manifesto. Nenhum corpo está autorizado por este pacote para publicação integral. O alojamento privado foi pedido para investigação. As licenças que não foram confirmadas continuam por confirmar.','']
    table(['Ficheiro','Utilização','HTTP','Bytes','Recibo'])
    for source in sources:row(source['file'],source['status'],source['http'],source['bytes'],source['receipt'])
    correction_file=HERE/'correcao.json'
    if correction_file.exists():
        correction=json.loads(correction_file.read_text())
        lines+=['','## A passagem de correção de 19.10.2026','',
                'A leitura a frio identificou os erros corrigidos abaixo. As réguas dos achados 8, 9, 10 e 20 continuam pendentes, com as da TAP. Um teste verde não substitui a conferência semântica dos excertos. O estudo só pode citar linhas conferidas no corpo pela leitura a frio.','']
        for item in correction['achados']:
            lines.append('- Achado '+str(item['achado'])+': '+item['correcao']+' Prova: '+item['prova']+'.')
        lines+=['','### Todas as linhas mudadas','']
        table(['Linha','Campos mudados','Prova no corpo'])
        changed=json.loads((HERE/'linhas-alteradas.json').read_text())
        for item in changed['linhas']:
            r=by[item['id']]
            row(ref(r),', '.join(item['campos']),r['evidence']['file']+'; '+r['document']['locator'])
        lines+=['','Comparação por código com a cabeça inicial do motor `'+changed['base_motor']+'`. Linhas novas identificadas como tal. A lista inclui mudanças de notas e metadados.','']
    lines+=['','## Verificação e execução','']
    for key,value in qa.items():lines.append('- '+key+': '+str(value))
    for kind in ['habitacao','gate']:
        proof=HERE/('correcao-'+kind+'.json')
        if proof.exists():
            result=json.loads(proof.read_text())
            lines.append('- `'+result['comando']+'`: código '+str(result['codigo'])+'; cabeça `'+result['cabeca_motor']+'`; '+str(result['segundos'])+' s; [registo integral]('+result['registo']+'); [metadados]('+proof.name+').')
    lines+=['','- Linhas do livro: '+str(len(book))+'.', '- Pedidos no inventário: '+str(len(sources))+'.',
            '- Livro SHA-256: `'+hashlib.sha256((study/'ledger.json').read_bytes()).hexdigest()+'`.',
            '- Manifesto SHA-256: `'+hashlib.sha256((study/'source/MANIFEST.sha256').read_bytes()).hexdigest()+'`.',
            '- Regeneração: `python3 gerar-relatorio.py --motor <motor>`.',
            '- Não se correram portões de páginas: esta passagem não altera páginas, fontes do sítio, estilos nem exportações. O portão do motor é obrigatório no commit.','']
    (HERE/'RELATORIO.md').write_text('\n'.join(lines))
    print('Relatório gerado:',len(book),'linhas do livro;',len(groups),'recortes europeus.')
if __name__=='__main__':main()
