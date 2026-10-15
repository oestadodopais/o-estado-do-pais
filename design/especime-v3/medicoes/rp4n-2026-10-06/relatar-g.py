from pathlib import Path
import json,re
b=Path('design/especime-v3/medicoes/rp4n-2026-10-06');g=b/'g';p=b/'portoes-g'
def le(n):return json.loads((g/n).read_text())
def tabela(cab,rows):return '\n| '+' | '.join(cab)+' |\n|'+ '|'.join('---' for _ in cab)+'|\n'+''.join('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |\n' for row in rows)+'\n'
m=le('medidas.json');h=le('cabecas-e-commits.json');r=le('reescrita.json');t=le('trailers-codigo.json');v=le('privacidade.json');c=le('capturas.json');a=json.loads((b/'g-antes/capturas.json').read_text());d=le('pensao-pedidos.json')
s='''\n## A passagem RP4-n-g

O achado da data original da pensão permanece aberto como RP4N-15. A cópia alojada está conferida, mas não se encontrou o pedido bem-sucedido que a trouxe. Não se substituiu essa prova por uma data de construção, pela hora do ficheiro ou por um pedido falhado. A entrega corrige a afirmação falsa, mostra a ausência e deixa esta condição de fecho para a direção.

### A ordem e as cabeças

A reescrita das mensagens veio antes do commit dos registos, e os registos antes das correções. Não houve publicação nem mudança de worktree. Os hashes seguintes foram lidos do Git e dos ficheiros dos portões. A cabeça final de entrega é o commit que contém esta secção; não se inventa neste ficheiro o hash do próprio commit.
'''
s+=tabela(['Repositório','Cabeça recebida','Cabeça do código medida'],[['sítio',r['pares'][-1]['antiga'],(p/'cabeca').read_text().strip()],['motor',h['motor']['base'],(p/'motor.cabeca').read_text().strip()]])
s+=f"A cabeça do sítio depois da reescrita, antes dos novos commits, é `{r['pares'][-1]['nova']}`. A prova comparou {len(r['pares'])} pares; árvores idênticas: `{str(r['arvores_identicas']).lower()}`. O guião foi `git filter-branch -f --msg-filter`, limitado a juntar os trailers. A cópia herdada foi reposta num nome separado depois de o comando substituir o espaço de referências originais. As duas referências de cópia permanecem:\n\n"
s+=''.join('- `'+x+'`.\n' for x in t['referencias_originais'])
s+='\n### Cada decisão\n\n'
items=[
('Achados 1 a 5','Eram as plantas da direção. Não deram correções ao produto.'),
('Achado 6','A data já não está escrita no gerador. O gerador exige estado bem-sucedido, bytes e sha256 coincidentes no pedido original e deriva a data da hora desse pedido. Sem esse recibo, ambas as linhas levam a ausência de data. A releitura falhada continua falhada e o estado da fonte conserva a reconferência histórica. A planta rejeita a data escrita no guião. RP4N-15 continua aberta.'),
('Achado 7','A regra geral escolhe o rótulo da medida, não o título do relatório. A K17 compara o nome conferido das linhas com definição selada. A água e a pensão têm plantas nas duas línguas. O índice reconhece o localizador restrito da figura e recusa a página ou a linha trocadas. O índice matemático do rótulo da pensão só sofreu normalização de espaço da extração; o recorte continua a provar a figura.'),
('Achado 8','A frase e a derivação usam DESPESA TOTAL e o nome do mapa. O apoio da frase saiu da derivação do projeto e passou para excertos contíguos do mapa alojado. A conta continua a conferir o denominador pelo campo check. A auditoria da explicação do orçamento também foi ligada às duas classificações das fontes, sem mudar a prosa da direção; a emenda identifica o construtor e fica por ler. A procura antiga de despesa bruta está em f/despesa-bruta-procura.json e foi feita nos documentos abaixo, não no MAPA 4.'),
('Achado 9','A definição da água ganhou o nome e os limites da faixa do quadro da ERSAR, com origem selada. A régua verifica que o valor pertence à faixa e recusa o limite inferior excluído.'),
('Achado 10','A pensão explica a indiferença financeira individual em palavras comuns. A comparação usa tokens das duas linhas; menor, maior ou igual são escolhidos pelos valores. A K17 recompõe independentemente a frase e exige os dois identificadores. Números sem token continuam recusados.'),
('Achado 11','O marcador dentro do selo vem da tabela da língua. Os selos aceites continuam, incluindo os da área. Há uma planta por edição.'),
('Achado 12','A unidade da quota do PRR foi corrigida no motor e reexportada. Diz valor contratado, de acordo com a coluna da computação, em ambas as edições.'),
('Achado 13','A cabeça, o diff e a história são varridos por todos os pedaços pedidos. A saída abaixo conserva as exceções herdadas individualmente, sem abrir novas exceções.'),
('Achado 14','A ausência passa com publicador conhecido e excerto ausente; falha com publicador desconhecido ou excerto existente. A planta do caminho parte agora do HTML próprio de cada edição.'),
('Achado 15','Os trailers foram juntos por reescrita de mensagens antes dos novos commits. O Git lê ambos e a prova verifica também a adjacência literal.'),
('Achado 16','A coordenada de página deixou de fazer parte do título transcrito. O número mantém a sua origem; a palavra página ou page vem da tabela, com plantas nas duas famílias e línguas.'),
('Achado 17','A retirada das contagens tinha retirado o estudo da área, porque a lista dependia das linhas. A lista depende agora também da declaração do estudo. O estudo voltou nas duas edições e a aterragem declara a ausência exata das contagens. A edição inglesa arquivada mantém o texto da sua data, sem ser apresentada como contagem atual.'),
('Achado 18','O nome do cartão e a derivação da quota dizem prazo de conclusão, o campo que a computação usa. Há planta para a redação antiga.')]
s+=''.join(f'- **{k}:** {x}\n' for k,x in items)
old=json.loads((b/'f/despesa-bruta-procura.json').read_text());s+=tabela(['Documentos da procura anterior','sha256','Ocorrências'],[(x['ficheiro'],x['sha256'],len(x['ocorrencias_despesa_bruta'])) for x in old])
s+='### RP4N-15: o pedido original da pensão\n\n'
s+=f"O documento `{d['pdf']}` tem sha256 `{d['pdf_sha256']}` e {d['pdf_bytes']} bytes. O manifesto não nomeia o pedido original. Os recibos encontrados, copiados em `g/pensao-pedidos.json`, são:\n"
s+=tabela(['Recibo','Hora','Estado','Erro'],[(x['ficheiro'],x['recibo'].get('hora'),x['recibo'].get('estado'),x['recibo'].get('erro')) for x in d['pedidos_encontrados']])
s+='A condição de fecho é recuperar o pedido que efetivamente trouxe esta cópia, com o mesmo sha256 e tamanho. A data permanece por confirmar enquanto esse recibo não for recuperado. Não se inventou essa data.\n\n'
s+=tabela(['Recibo','Nome na fonte','Datas das definições','Ausência declarada'],[(k,x['nome_na_fonte'],', '.join(x['datas']),'; '.join(sorted(set(x['datas_ausentes'])))) for k,x in m['recibos'].items()])
s+=tabela(['Recibo da pensão','Estado da fonte no HTML'],[(k,x['sem_resposta_desde']) for k,x in le('estado-das-pensoes.json').items()])
s+='### As frases lidas dos recibos\n\n'
for k,x in m['frases'].items():s+=f'**{k}**\n\n> {x}\n\n'
s+='### O estudo e as capturas\n\n'
for lang,x in m['estudo'].items():s+=f"- `{lang}`: "+'; '.join(f"`{p['href']}`" for p in x['portas'])+f". A página diz: «{x['ausencia']}».\n"
s+=f"\nAntes: {len(a['capturas'])} capturas da construção conservada `{a['versao']['commit']}`, captadas quando o ramo estava em `{a['cabeca_da_captura']}`. A captura anterior não é apresentada como uma construção dessa cabeça de captura. Depois: {len(c['capturas'])} capturas, cabeça `{c['cabeca_da_captura']}`, versão construída `{c['versao']['commit']}`. Problemas de navegação ou transbordo medidos: {len(c['problemas'])}. Foram inspecionadas visualmente as capturas da água e da pensão em largura estreita e a área em largura larga; a geometria das restantes foi medida pelo navegador. A primeira inspeção visual apanhou a figura adiada da pensão em branco numa captura. O guião passou a esperar pela descodificação das imagens e repetiu o conjunto; os estados de carga ficam em g/capturas.json. Esta correção da medição foi registada antes da nova corrida integral. A tentativa anterior passou os passos individuais mas fechou na guarda D porque o construtor editou o guião durante as conferências; não se aproveita essa corrida como verde. Os HTML completos ficam junto das capturas medidas.\n"
s+=tabela(['Captura','Largura','Largura do documento','sha256'],[(x['ficheiro'],x['largura'],x['largura_documento'],x['sha256']) for x in a['capturas']+c['capturas']])
s+='### Portões e reconferências\n\n'
codes=[(x,(p/(x+'.codigo')).read_text().strip()) for x in ['build','verify','typecheck','motor']]+[(x,(g/'reconferencia-codigo'/(x+'.codigo')).read_text().strip()) for x in ['series','cruzamento']]
s+=tabela(['Ficheiro','Código lido'],codes)
s+='Os portões inteiros correram sob a tranca comum. As séries e o cruzamento correram com RESEARCHHUB_DIR, este último com --with-origin, e os registos escrevem as duas cabeças antes e depois. Depois do commit de entrega, estas duas conferências voltam a correr na cabeça final; os seus códigos e cabeças são comunicados na resposta, sem alterar outra vez este anexo.\n\n'
s+=tabela(['Tentativa','build','verify','typecheck'],[(q.name,*[(q/(k+'.codigo')).read_text().strip() for k in ['build','verify','typecheck']]) for q in sorted(b.glob('portoes-g-tentativa*'))])
s+='As tentativas vermelhas ficam conservadas em portoes-g-tentativa*: detetaram a quebra de linha do rótulo, o reconhecimento dos ficheiros YAML na travessia as frases novas do inventário, a língua do rótulo impresso e a declaração do prazo de conclusão. Não são apresentadas como portões verdes.\n\n'
s+=f"A varredura final leu {m['linhas_livro']} linhas no livro bruto e {m['linhas_publicadas']} publicadas, percorreu {m['ficheiros_texto']} ficheiros de texto e encontrou {len(m['referencias'])} referências públicas às linhas retiradas.\n"
s+='### Plantas novas ou refeitas e mensagens reais\n\n'
previous={x['nome']:x['mensagem'] for x in json.loads((b/'f/plantas-sitio.json').read_text())['plantas']}
new=[x for x in le('plantas-sitio.json')['plantas'] if previous.get(x['nome'])!=x['mensagem'] or any(k in x['nome'] for k in ['caminho','separador final','ausência atribuída'])]+le('plantas-novas.json')['plantas']+le('plantas-indice.json')['plantas']
s+=tabela(['Planta no sítio','Mensagem'],[(x['nome'],x['mensagem']) for x in new])
s+='O caso positivo da ausência e os três ramos da comparação também passaram. As plantas do motor foram relidas do seu registo:\n\n'
pl=[]
for line in (g/'plantas-motor.log').read_text().splitlines():
 if line.startswith('PLANTA '):
  nome,msg=line.removeprefix('PLANTA ').split(': ',1);pl.append((nome,msg))
s+=tabela(['Planta no motor','Mensagem'],pl)
s+='### Trailers e privacidade\n\n'
s+=f"Na cabeça do código, {t['commits']} commits desde a base e {t['trailers_claude_session']} trailers Claude-Session lidos pelo Git; {len(t['problemas'])} falhas de presença ou adjacência. A saída literal está em `g/trailers-codigo.log`, obtida com `git log --format=%(trailers:key=Claude-Session) c0e1b3f4..HEAD`.\n"
s+=tabela(['Conferência de privacidade','Saída'],[(k,v[k]) for k in ['historico_grep_c','diff_grep_c','cabeca_sem_excecoes_grep_c','legados_ficheiros']])
s+='Padrões: '+', '.join(v['padroes'])+'. A lista herdada, saída de `privacidade-g.py`, é:\n\n'+''.join(f"- `{x['ficheiro']}:{x['linha']}`.\n" for x in v['RP4N-14'])
s+='\n### Mapa completo da reescrita\n'+tabela(['Antiga','Nova'],[(x['antiga'],x['nova']) for x in r['pares']])
s+='### Commits desta passagem\n'
for repo,x in h.items():s+=tabela([repo,'Mensagem'],[(z['sha'],z['titulo']) for z in x['commits']])
s+='O commit final de provas, que contém esta tabela, é identificado na resposta de entrega.\n\n### Custo\n\nA linha «tokens used» não estava disponível no registo visível da execução ao preparar este relatório. O custo e o cumprimento do alvo não ficam demonstrados; não foi inventada uma contagem.\n'
p=b/'LEIA-ME.md';old=p.read_text();old=old.split('\n## A passagem RP4-n-g')[0];p.write_text(old+s)
