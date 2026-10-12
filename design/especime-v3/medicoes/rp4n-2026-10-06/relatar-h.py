"""Compõe o relato a partir das provas, dos códigos e das cabeças medidas."""
from pathlib import Path
import json,re
b=Path(__file__).parent;h=b/'h';p=b/'portoes-h'
def le(n):return json.loads((h/n).read_text())
def tabela(cab,rows):return '\n| '+' | '.join(cab)+' |\n|'+'|'.join('---' for _ in cab)+'|\n'+''.join('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |\n' for row in rows)+'\n'
a=le('antes.json');m=le('medidas.json');d=le('pensao-prova.json');pl=le('plantas-da-direcao.json');v=le('privacidade.json');c=le('capturas-h.json');nota=le('mapa4-nota.json')
heads={nome:le('commits-'+nome+'.json') for nome in ['sitio','motor']}
codigo=[]
for nome in ['build','verify','typecheck','motor']:
 codigo.append((str((p/(nome+'.codigo')).relative_to(b)),(p/(nome+'.codigo')).read_text().strip(),(p/('motor.cabeca' if nome=='motor' else 'cabeca')).read_text().strip()))
for nome in ['series','cruzamento']:
 q=h/'reconferencia-codigo';cab=json.loads((q/'cabecas.json').read_text())
 codigo.append((str((q/(nome+'.codigo')).relative_to(b)),(q/(nome+'.codigo')).read_text().strip(),cab['sitio']+'; motor '+cab['motor']))
s='''\n## A passagem RP4-n-h

A RP4N-15 fecha pelo ramo de alojamento autorizado no mandato. Não se recuperou o pedido HTTP original: recuperou-se o registo versionado da cópia com os mesmos bytes. A data é a do commit que introduziu esse registo, e os recibos distinguem alojamento de leitura na fonte.

### A prova das pensões

'''
s+=f"O PDF `{d['pdf']}` tem {d['bytes']} bytes e SHA-256 `{d['pdf_sha256']}`. A cópia em `content/11 Seguranca Social/source/` existe na árvore principal, foi lida sem a alterar e coincide byte a byte; está excluída do Git, por isso não veio para a worktree. A worktree conserva o manifesto. O inventário das duas pastas e a procura de pedidos estão em `h/pensao-prova.json`: {len(d['pedidos_com_estes_bytes'])} pedidos com estes bytes. Os campos históricos `fetched_at` do livro não foram promovidos a recibos HTTP.\n\n"
s+=f"O commit `{d['prova']['registo']['commit']}`, datado `{d['data_commit']}`, introduziu `{d['prova']['registo']['manifesto']}`, cujo SHA-256 na introdução é `{d['prova']['registo']['manifesto_sha256']}`. A linha com o resumo do PDF já está nesse commit e não está no pai. A mensagem diz: «{d['nota_do_commit']}». As duas linhas ficam com `access_date: {d['prova']['data']}` e `access_date_kind: {d['prova']['tipo']}`; a porta pública da prova é `/provas/pensao-alojamento.json`.\n\n"
s+='### As marcas e as linhas incompletas\n'
s+=tabela(['Medição','Antes','Depois'],[['Páginas com marca',len(a['paginas_com_marcas']),len(m['paginas_com_marcas'])],['Linhas publicadas incompletas',len(a['linhas_incompletas']),len(m['linhas_incompletas'])]])
s+=f"Antes: varredura do `dist/` conservado da cabeça `{a['versao']['commit']}`, com o ramo em `{a['cabeca']}`. Depois: varredura pela mesma expressão das duas grafias, em `medir-h.mjs`, construção `{m['versao']['commit']}`. O contador lê páginas HTML, incluindo referências legítimas à marca; não confunde páginas com ocorrências. A lista das linhas usa `provenienciaIncompleta`, a mesma regra do livro.\n\n"
s+='Páginas que deixaram de ter marca:\n\n'+''.join('- `'+x+'`.\n' for x in sorted(set(a['paginas_com_marcas'])-set(m['paginas_com_marcas'])))
s+='\nLinhas ainda incompletas:\n\n'+''.join('- `'+x+'`.\n' for x in m['linhas_incompletas'])
s+='''
A marca inglesa passou a `[to verify]` em todos os componentes: campos, selos, frases, agenda, livro e marcas de água. O Método usa a mesma forma e a página explicativa já não promete manter a grafia portuguesa. Os dados e as transcrições históricas conservam a forma que lhes pertence. A planta percorre todas as páginas construídas e planta as formas de texto e atributo; as páginas dos temas não contêm a glosa dentro da frase K2, com conhecido-positivo que a volta a inserir.

### Os outros achados

'''
s+=f"Os achados plantados na cópia não estavam no ramo recebido: água com «noventa e três por cento»: `{pl['agua']}`; pensão com «one year early»: `{pl['pensao']}`; data da linha na base: `{pl['data_na_base']}`; divisão pela DESPESA TOTAL: `{pl['denominador']}`. A prova da reescrita tem {pl['pares_da_reescrita']} pares. As cabeças destas releituras são `{pl['sitio']}` e `{pl['motor']}`.\n\n"
s+='''A reconferência anterior à criação da linha legal saiu; não foi substituída por outra entrada manual. O localizador inglês do rótulo e o localizador do documento das pensões atravessam agora do motor em campos próprios, conferidos literalmente. A planta da sinopse chama a mesma função que o portão da voz: a mensagem antiga do teste era uma descrição sintética, embora a secção anterior a listasse entre mensagens reais; as mensagens abaixo são as devolvidas pelo portão.

A RP4N-16 regista `publisher/manifest.evora.json` na dívida JD1-9. O ficheiro não foi alterado: `h/rp4n-16.json` compara o blob da base com o atual. O achado relativo à divergência entre prompt e mandato pertence à direção.

'''
s+=nota['decisao']+' A página foi também inspecionada visualmente. Excerto integral da nota, preservado como a fonte o escreveu:\n\n> '+nota['nota'].replace('\n','\n> ')+'\n\n'
s+='### As frases e os localizadores lidos do HTML\n\n'
s+='As definições da água, da pensão e dos ministérios mantêm a redação recebida. As mudanças de língua e de data estão lidas nos campos dos recibos:\n'
s+=tabela(['Recibo','Localizadores','Data rotulada nas definições','Verificações'],[(k,'; '.join(x['localizadores']),'; '.join(sorted(set(x['datas_rotuladas']))),x['verificacoes']) for k,x in m['recibos'].items() if k.startswith('pensao')])
for k,x in m['frases'].items():s+=f'**{k}**\n\n> {x}\n\n'
s+='### Cabeças, portões e repetições\n'
s+=tabela(['Repositório','Base','Cabeça do código'],[(k,x['base'],x['cabeca']) for k,x in heads.items()])
s+=tabela(['Ficheiro','Código lido','Cabeça'],codigo)
s+='Os portões correram com as árvores do código limpas, sob a tranca comum. As séries e o cruzamento correram depois do último commit que muda o que leem, com as duas cabeças escritas antes e depois; o cruzamento usou `--with-origin`. O commit posterior contém apenas registos e capturas, que estas duas conferências não leem. A cabeça final é o commit que contém este relatório, identificada na resposta, sem tentar escrever o hash do próprio commit no seu conteúdo.\n\n'
s+='### Capturas\n\n'
s+=f"O manifesto `h/capturas-h.json` regista {len(c['capturas'])} capturas, nas larguras {', '.join(str(x) for x in sorted(set(x['largura'] for x in c['capturas'])))}; construção `{c['versao']['commit']}` e cabeça da captura `{c['cabeca_da_captura']}`. Inclui os dois recibos da pensão, os temas, a área Trabalho, os índices dos estudos e o Método, nas duas edições. Problemas medidos de carga, navegação ou transbordo: {len(c['problemas'])}. A inspeção visual e os ficheiros vistos estão em `h/inspecao-visual.json`.\n"
s+=tabela(['Ficheiro','Largura','sha256'],[(x['ficheiro'],x['largura'],x['sha256']) for x in c['capturas']])
s+='### Plantas e mensagens reais\n'
plantas=le('plantas-sitio.json')['plantas']+v['plantas']
for linha in (h/'plantas-g.log').read_text().splitlines():
 if linha.startswith('PLANTA glosa alterada'):
  nome,msg=linha.removeprefix('PLANTA ').split(': ',1);plantas.append({'nome':nome,'mensagem':msg})
for linha in (h/'plantas-motor.log').read_text().splitlines():
 if linha.startswith('PLANTA ') and any(k in linha for k in ['resumo da cópia','manifesto do alojamento','alojamento sem','alojamento dito','data escrita']):
  nome,msg=linha.removeprefix('PLANTA ').split(': ',1);plantas.append({'nome':nome,'mensagem':msg})
s+=tabela(['Planta','Mensagem'],[(x['nome'],x['mensagem']) for x in plantas])
s+='### Privacidade e commits\n'
s+=tabela(['Conferência','Valor'],[(k,v[k]) for k in ['historico_grep_c','diff_grep_c','cabeca_sem_excecoes_grep_c','legados_ficheiros']])
s+=f"O guião leu integralmente {len(v['legados_lidos'])} ficheiros legados na cabeça: {len(v['legados_com_nome'])} contêm o nome do utilizador. A lista está em `h/privacidade.json`; os conhecidos-positivos cobrem separadamente cada pedaço procurado. A prova dos trailers lê as mensagens, incluindo a adjacência dos dois trailers no sítio. A designação do modelo nos trailers reproduz a exigida pelo mandato; o identificador exato e o nível de raciocínio não estão expostos ao agente nesta sessão.\n"
for k,x in heads.items():s+=tabela([k,'Mensagem'],[(c['sha'],c['titulo']) for c in x['commits']])
s+='''### Custo

O excesso de custo da passagem anterior decorreu da reescrita da história, do tratamento dos achados e das capturas repetidas. Essas operações alargaram o trabalho para além da correção curta prevista, sem a explicação de custo que o relatório devia ter dado.

Nesta passagem não foi observada uma linha «tokens used» no registo disponível. Não se atribui um custo nem se afirma cumprimento do alvo sem essa medição.
'''
f=b/'LEIA-ME.md';old=f.read_text();antes,resto=old.split('\n## A passagem RP4-n-g',1)
antes=antes.split('\n## A passagem RP4-n-h')[0]
f.write_text(antes+s+'\n## A passagem RP4-n-g'+resto)
print('RP4N-h: relatório composto a partir das provas.')
