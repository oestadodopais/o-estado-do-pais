"""Relatório RP4-n-i: todos os valores vêm das provas conservadas."""
from pathlib import Path
import json
b=Path(__file__).parent;i=b/'i';p=b/'portoes-i'
def le(n):return json.loads((i/n).read_text())
def tabela(cab,rows):return '\n| '+' | '.join(cab)+' |\n|'+'|'.join('---' for _ in cab)+'|\n'+''.join('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |\n' for row in rows)+'\n'
m=le('medidas.json');v=le('privacidade.json');c=le('capturas-i.json');fontes=le('fontes-por-frase.json');direcao=le('plantas-da-direcao.json');custo=le('custo.json')
heads={k:le('commits-'+k+'.json') for k in ['sitio','motor']}
s='''\n## A passagem RP4-n-i

O Método inglês passa a usar `[to verify]` também nos atributos. A conferência lê todos os atributos de todos os elementos de todas as páginas construídas, além do texto, com estragos em `title`, `aria-label`, `alt`, `data-*` e `content`. A cobertura nova encontrou também a marca portuguesa nas descrições `meta content` do saldo natural inglês; a composição dessas descrições passou a usar a marca da edição. A afirmação excessiva do relato h foi corrigida também no seu gerador.

O recibo de uma linha com `access_date_kind: hosted-copy` e sem verificações próprias conserva a data da cópia alojada e declara a ausência de leitura na fonte. O estado do endereço deixa de ser uma verificação dessa linha, tanto na cabeça do recibo como no bloco das verificações. A pensão que tem uma verificação própria conserva o estado. A ambiguidade pequena do achado foi resolvida no âmbito das cópias alojadas; não se alterou a política das restantes linhas.

O nome na fonte da penalização legal passa a ser a expressão literal do parágrafo da fonte, também na edição inglesa, onde a transcrição conserva a língua original. Os localizadores têm redação própria em cada edição. A frase dos ministérios distingue o total antes da consolidação do total consolidado com as duas etiquetas impressas no MAPA.

### Os achados plantados na leitura h

'''
s+=tabela(['Repositório','Linha','Data','Tipo'],[(x['repositorio'],x['id'],x['access_date'],x['access_date_kind']) for x in direcao['linhas']])
s+=f"As definições do recibo português dizem: {'; '.join(direcao['datas_definicoes'])}. O localizador legal inglês é {'; '.join(direcao['localizador_legal_en'])}. O relatório h diz {direcao['paginas_com_marca_h']} páginas com marca, como a sua medição. Os estragos da cópia não estavam no ramo. Prova: `i/plantas-da-direcao.json`.\n"
s+='### As frases e os campos, lidos do HTML\n'
s+='\nMétodo inglês, atributos `title`: '+ '; '.join(sorted(set(m['metodo_en']['titulos'])))+'.\n'
for k,x in m['frases'].items():s+=f'\n**{k}**\n\n> {x}\n'
s+=tabela(['Recibo','Nome na fonte','O que foi conferido'],[(k,x['nome_na_fonte'],x['bloco_verificacoes']) for k,x in m['recibos'].items() if k.startswith(('pensao','legal'))])
s+='### Fontes para repetir a leitura\n'
arquivos={x['motor']:x for f in fontes['frases'] for x in f['ficheiros']}
s+=f"O inventário `i/fontes-por-frase.json`, medido no sítio `{fontes['cabeca']}` e no motor `{fontes['motor']}`, lista {len(arquivos)} ficheiros alojados por frase ou decisão, todos conferidos pelos bytes. Inclui o PDF do MAPA, o PDF da pensão, o manifesto atual e a cópia literal do manifesto original recuperado do commit que prova o alojamento. O manifesto atual não foi confundido com a versão original.\n"
s+=tabela(['Ficheiro no motor','sha256'],[(k,x['sha256']) for k,x in sorted(arquivos.items())])
for x in arquivos.values():
 if 'original' in x:
  o=x['original'];s+=f"O original de `{x['motor']}`, no commit `{o['commit']}`, está também em `{o['copia_no_sitio']}`, SHA-256 `{o['sha256']}`. O pacote deve levar esta versão histórica juntamente com a atual.\n"
s+='### Cabeças e códigos lidos\n'
s+=tabela(['Repositório','Base','Cabeça do código'],[(k,x['base'],x['cabeca']) for k,x in heads.items()])
codigos=[]
for nome in ['build','verify','typecheck','motor']:
 codigos.append((str((p/(nome+'.codigo')).relative_to(b)),(p/(nome+'.codigo')).read_text().strip(),(p/('motor.cabeca' if nome=='motor' else 'cabeca')).read_text().strip()))
q=i/'reconferencia-codigo';cab=json.loads((q/'cabecas.json').read_text())
for nome in ['series','cruzamento']:codigos.append((str((q/(nome+'.codigo')).relative_to(b)),(q/(nome+'.codigo')).read_text().strip(),cab['sitio']+'; motor '+cab['motor']))
s+=tabela(['Ficheiro','Código','Cabeça'],codigos)
s+='As árvores do código estavam limpas no início dos portões e as cabeças foram lidas antes e depois. As séries e o cruzamento com `--with-origin` correram depois do último commit que muda os ficheiros que leem. Os commits posteriores conservam apenas provas, capturas e este relato. A cabeça final é comunicada na resposta, sem inventar o hash do commit que contém o próprio relatório.\n'
s+='As tentativas anteriores foram conservadas: na primeira, o C1 ainda exigia a frase antiga de ausência, e a função nova precisava das declarações de tipos; na segunda, o índice recusou a forma nova do localizador do nome legal. A regra independente, a forma exata do localizador e as plantas foram corrigidas antes da repetição.\n'
s+=tabela(['Tentativa','build','verify','typecheck'],[(q.name,*[(q/(k+'.codigo')).read_text().strip() for k in ['build','verify','typecheck']]) for q in sorted(b.glob('portoes-i-tentativa*'))])
s+='### Privacidade e questões\n'
s+=f"A RP4N-17 fecha como aceite, por decisão do mandato, apenas para os pares de commit e resumo de linha declarados em `i/privacidade.json`: {len(v['RP4N-17']['excecoes'])} ocorrências. A planta recusa a mesma linha noutro commit e uma linha nova num commit aceite. Os códigos da procura real distinguem encontro, ausência e erro; um erro impede a conferência.\n"
s+=tabela(['Conferência','Valor'],[(k,v[k]) for k in ['codigo_procura_cabeca','historico_grep_c','historico_sem_excecoes','diff_grep_c','cabeca_sem_excecoes_grep_c']]+[('Código em i/privacidade.codigo',(i/'privacidade.codigo').read_text().strip())])
s+='A RP4N-18 permanece aberta no histórico publicado: a fusão de `main` trouxe outros registos locais, incluindo um caminho temporário com identificador de utilizador no registo das plantas TP1. Os registos foram anonimizados na cabeça; `i/rp4n-18.json` conserva apenas nomes e hashes. A exceção da RP4N-17 não foi alargada. Não houve reescrita nem publicação. Esta entrega não autoriza a aterragem enquanto a direção não resolver a privacidade histórica.\n\nA revisão automática recusou uma tentativa de commit por interpretar o ficheiro de diagnóstico anterior como preservação dos caminhos sensíveis. O comando não correu; o commit seguinte contém apenas os registos anonimizados e os hashes, sem esse ficheiro.\n'
s+='### Plantas e mensagens reais\n'
plantas=le('plantas-sitio.json')['plantas']+le('plantas-copia.json')['plantas']+v['plantas']
for x in le('plantas-c1.json')['plantas']:
 if x['grupo']=='rp4ni':
  plantas.append({'nome':x['nome'],'mensagem':'; '.join(x['erros'])})
for x in le('plantas-indice.json')['medida']['plantas_localizadores']['plantas']:
 if x['nome'] in ['Página legal trocada','Figura legal trocada']:
  plantas.append({'nome':x['nome'],'mensagem':x['queixa_I1']})
for linha in (i/'plantas-motor.log').read_text().splitlines():
 if linha.startswith('PLANTA nome legal'):
  nome,msg=linha.removeprefix('PLANTA ').split(': ',1);plantas.append({'nome':nome,'mensagem':msg})
s+=tabela(['Planta','Mensagem'],[(x['nome'],x['mensagem']) for x in plantas])
s+='### Capturas\n'
s+=f"O manifesto `i/capturas-i.json` contém {len(c['capturas'])} capturas nas larguras {', '.join(str(x) for x in sorted(set(x['largura'] for x in c['capturas'])))}; construção `{c['versao']['commit']}`. Inclui o Método inglês, os recibos da pensão e da penalização legal nas duas edições e a frase alterada dos ministérios nas duas edições. Problemas de carga ou transbordo medidos: {len(c['problemas'])}. A inspeção está em `i/inspecao-visual.json`.\n"
s+=tabela(['Ficheiro','sha256'],[(x['ficheiro'],x['sha256']) for x in c['capturas']])
s+='### Custo e razões do excesso anterior\n'
for fase,x in custo['passagens'].items():
 s+=f"A passagem {fase} consumiu {x['simbolos']:,} símbolos contra o alvo de {x['alvo']:,}, excesso de {x['excesso']:,}, segundo a medição da direção transcrita no mandato e lida por `medir-custo-i.py`. ".replace(',',' ')
 s+=f"Os registos conservam {len(x['tentativas_recusadas'])} tentativas recusadas pelos portões. Foram repetidas construções e conferências, além das correções: "+'; '.join('`'+t['pasta']+'`' for t in x['tentativas_recusadas'])+'. '
 s+='As capturas estão em '+('; '.join('`'+a['ficheiro']+'` ('+str(a['capturas'])+' capturas)' for a in x['capturas']))+'. '
 if x['reescritas']:s+='A reescrita e a conferência das árvores estão em '+('; '.join('`'+a['ficheiro']+'` ('+str(a['pares'])+' pares de commits)' for a in x['reescritas']))+'. '
 else:s+='Na h, as tentativas de reescrita recusadas e a correção por commit normal estão em `h/rp4n-17.json` e no relato h. '
 s+='Estas são as operações documentadas que alargaram o trabalho; não há medição de símbolos por operação que permita repartir o total ou ordenar o seu custo.\n\n'
s+='O custo desta passagem só será atribuído se a linha «tokens used» estiver visível. O identificador do modelo nos trailers reproduz o mandato; o runtime não expõe ao agente o identificador exato nem o nível de raciocínio.\n'
s+='### Commits\n'
for k,x in heads.items():s+=tabela([k,'Mensagem'],[(c['sha'],c['titulo']) for c in x['commits']])
f=b/'LEIA-ME.md';old=f.read_text();antes,resto=old.split('\n## A passagem RP4-n-h',1);antes=antes.split('\n## A passagem RP4-n-i')[0];f.write_text(antes+s+'\n## A passagem RP4-n-h'+resto)
print('RP4N-i: relatório gerado dos ficheiros.')
