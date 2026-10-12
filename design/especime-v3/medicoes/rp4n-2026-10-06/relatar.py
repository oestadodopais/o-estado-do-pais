"""Relatório do RP4-n a partir dos registos, sem contagens escritas à mão.
Uso: RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar.py
"""
import difflib
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
BASE = Path(__file__).resolve().parent
SITE = BASE.parents[3]
MOTOR = Path(os.environ['RESEARCHHUB_DIR'])
INICIO_MOTOR = '465d01e7853f2729fcaa4ba63160b6338ba5de1e'
def ler(p): return json.loads(p.read_text())
def git(raiz, *args): return subprocess.check_output(['git','-C',str(raiz),*args],text=True).strip()
def identificadores(x): return '; '.join(x) if isinstance(x,list) else str(x)
def md(x): return str(x).replace('|','\\|').replace('\n','<br>')
def apoios(a): return [a]+[x for alt in a.get('ou',[]) for x in apoios(alt)]
def texto(f,l):
 t=f[l]
 return t if isinstance(t,str) else ''.join(p if isinstance(p,str) else p['termo'] for p in t)
antes,depois=[ler(BASE/fase/'medidas.json') for fase in ('antes','depois')]
alteracoes,retiradas,reescritas=[],[],[]
intactas=0
for classe in ('familias','series'):
 aa,dd=[d['entradas'][classe] for d in (antes,depois)]
 assert len(aa)==len(dd)
 for a,d in zip(aa,dd):
  assert a['chave']==d['chave']
  assert len(a['folhas'])==len(d['folhas'])
  if not a['por_confirmar_na_fonte'] and not a['partes_pelo_nome']:
   assert all(x['pt']==y['pt'] and x['en']==y['en'] for x,y in zip(a['folhas'],d['folhas'])),a['chave']
   intactas+=1
  if a['folhas']==d['folhas'] and not a['por_confirmar_na_fonte']: continue
  for folha,(af,df) in enumerate(zip(a['folhas'],d['folhas'])):
   aps=[x for p in af['partes'] for ap in p.get('apoios',[]) for x in apoios(ap)]
   novos=[x for p in df['partes'] for ap in p.get('apoios',[]) for x in apoios(ap)]
   palavras=list(dict.fromkeys(x['literal'] for x in aps if x.get('declaracao')=='nome'))
   if not palavras:
    palavras=[p['pt'] for p in af['partes'] if p['classe']=='diz' and all(not (x.get('origem') or x.get('campo') in {'derivation','derivation_en','excerpt','unit','name','source','document.title','document.locator','reference_date'}) for ap in p.get('apoios',[]) for x in apoios(ap))]
   origens=sorted(set(x['origem'] for x in novos if 'origem' in x))
   campos=sorted(set(x['campo'] for x in novos if 'linha' in x or 'serie' in x))
   alteracoes.append({'classe':classe,'chave':a['chave'],'folha':folha,'palavras':palavras,'antes':{l:texto(af,l) for l in ('pt','en')},'depois':{l:texto(df,l) for l in ('pt','en')},'origens':origens,'campos':campos})
   ap,dp=af['partes'],df['partes']
   for tag,i,j,k,l in difflib.SequenceMatcher(a=[p['pt'] for p in ap],b=[p['pt'] for p in dp],autojunk=False).get_opcodes():
    if tag=='equal': continue
    velhas=[p for p in ap[i:j] if p['classe']=='diz'];novas=[p for p in dp[k:l] if p['classe']=='diz']
    if not novas: retiradas.extend({'classe':classe,'chave':a['chave'],'pt':p['pt'],'en':p['en']} for p in velhas)
    elif velhas: reescritas.append({'classe':classe,'chave':a['chave'],'antes':[p['pt'] for p in velhas],'depois':[p['pt'] for p in novas]})
nomes_diretos_antes=sum(any(a.get('declaracao')=='nome' for a in p.get('apoios',[])) for e in antes['entradas']['familias'] for f in e['folhas'] for p in f['partes'])
novas_origens={k:v for k,v in depois['origens'].items() if k not in antes['origens']}
documentos={}
for chave,o in novas_origens.items(): documentos.setdefault(o['selo']['motor'],[]).append(chave)
ausencias=[e['chave'] for e in depois['entradas']['familias'] if any(p['classe']=='ausencia' for f in e['folhas'] for p in f['partes'])]
plantas=ler(BASE/'plantas-sitio.json')['plantas']
for nome in ('rotulos','origens'):
 log=BASE/f'plantas-motor-{nome}.log'
 if log.exists():
  for linha in log.read_text().splitlines():
   if linha.startswith('PLANTA '):
    n,m=linha[7:].split(': ',1);plantas.append({'nome':'motor: '+n,'mensagem':m})
copias=ler(BASE/'leitura-frio'/'plantas.json')['plantas'] if (BASE/'leitura-frio'/'plantas.json').exists() else []
capturas={f:ler(BASE/f/'capturas.json') for f in ('antes','depois') if (BASE/f/'capturas.json').exists()}
for fase,c in capturas.items():
 assert c['versao']==({'antes':antes,'depois':depois}[fase]['construcao']), 'A captura não corresponde à construção medida'
 for imagem in c['capturas']:
  assert hashlib.sha256((SITE/imagem['ficheiro']).read_bytes()).hexdigest()==imagem['sha256'], imagem['ficheiro']
for copia in copias:
 assert hashlib.sha256((SITE/copia['ficheiro']).read_bytes()).hexdigest()==copia['sha256'], copia['ficheiro']
contagens={'antes':antes['contagens'],'depois':depois['contagens'],'partes_pelo_nome_direto_antes':nomes_diretos_antes,'origens_novas':len(novas_origens),'documentos_ou_corpos':len(documentos),'partes_retiradas':len(retiradas),'trechos_reescritos':len(reescritas),'entradas_confirmadas_com_texto_preservado':intactas,'ausencias':len(ausencias),'plantas_permanentes':len(plantas),'copias_com_estragos':len(copias),'capturas':{f:len(c['capturas']) for f,c in capturas.items()}}
comando='RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar.py'
resultado={'comando':comando,'contagens':contagens,'alteracoes':alteracoes,'retiradas':retiradas,'reescritas':reescritas,'novas_origens':novas_origens,'documentos':documentos,'ausencias':ausencias,'plantas':plantas}
(BASE/'comparacao.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
codigos={}
for g in ('build','verify','typecheck','motor'):
 p=BASE/'portoes'/f'{g}.codigo';codigos[g]=p.read_text().strip() if p.exists() else 'por executar'
cabecas={}
for g,p in [('sítio','cabeca'),('motor','motor.cabeca')]:
 f=BASE/'portoes'/p;cabecas[g]=f.read_text().strip() if f.exists() else 'por registar no portão final'
if '--fecho' in sys.argv:
 assert all(c.isdecimal() for c in codigos.values()), 'Falta o código de um portão final'
 for inicio,fim in [('cabeca','cabeca.fim'),('motor.cabeca','motor.cabeca.fim')]:
  assert (BASE/'portoes'/inicio).read_text()==(BASE/'portoes'/fim).read_text(), 'A cabeça mudou durante os portões'
 assert depois['construcao']['commit']==cabecas['sítio'], 'A medição não é da cabeça dos portões'
saida=['# RP4-n · selar as frases na fonte','','A construção das frases está recomposta, mas a aceitação global fica bloqueada enquanto o portão HTML encontrar informação por confirmar noutras partes das páginas. Este pacote é uma entrega para leitura a frio, não uma aprovação nem uma publicação.','','Relatório produzido por `relatar.py`. As contagens vêm de `antes/medidas.json`, `depois/medidas.json`, das origens exportadas e dos registos das plantas. `comparacao.json` conserva a comparação completa nas duas línguas.','','## Contagens reproduzíveis','','| Medida | Antes | Depois |','|---|---:|---:|']
for chave,nome in [('linhas','Linhas na lista por confirmar'),('series','Séries na lista por confirmar'),('partes_pelo_nome_familias','Partes das famílias apoiadas no nome'),('partes_pelo_nome_series','Partes das séries apoiadas no nome'),('paginas_com_marcadores','Páginas construídas com marcadores'),('marcas_nas_paginas','Ocorrências textuais nas páginas')]: saida.append(f"| {nome} | {antes['contagens'][chave]} | {depois['contagens'][chave]} |")
saida+=['',f'Há {len(novas_origens)} origens novas, lidas em {len(documentos)} documentos ou corpos. Saíram {len(retiradas)} partes inteiras da classe `diz`, contadas por entrada e folha da especificação, sem multiplicar pelas linhas nem pelas traduções. Há ainda {len(reescritas)} trechos reescritos, que podem perder qualificações sem eliminar a parte inteira. As duas listas detalhadas estão abaixo.','',f"As {intactas} entradas que já não tinham partes por confirmar nem apoio no nome conservaram o texto das duas edições. O guião afirma essa igualdade. O guião do brief contou {nomes_diretos_antes} partes com apoio direto no nome; o guião desta entrega também desce às alternativas `ou` e contou {antes['contagens']['partes_pelo_nome_familias']}. A diferença está na parte «(desemprego registado)» da família dos concelhos. O inventário completo está em `antes/medidas.json`.",'',f'A ausência de excerto ficou explícita em {len(ausencias)} famílias: '+', '.join('`'+identificadores(x)+'`' for x in ausencias)+'. A K17 só permite esta frase fixa quando o excerto da linha está ausente; a planta com um excerto existente prova que a exceção não é uma saída livre.','','## Cabeças do código e portões','','| Repositório | Cabeça conferida |','|---|---|',*[f'| {k} | `{v}` |' for k,v in cabecas.items()],'','| Portão | Código lido do ficheiro |','|---|---:|',*[f'| {k} | `{v}` |' for k,v in codigos.items()],'','Os códigos são lidos de `portoes/*.codigo`, depois do processo terminar. Os registos são guardados sem caminhos da máquina. Se `build` ou `verify` parar no portão HTML, os comandos posteriores da cadeia não se executaram; não se reclama uma passagem integral desses comandos.','','Comandos da medição e da conferência:','','```sh']
saida+='''node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs antes
node design/especime-v3/medicoes/r4-2026-10-05/compor-familias-r4.mjs
node design/especime-v3/medicoes/r4-2026-10-05/compor-series-r4.mjs
node design/especime-v3/medicoes/rp4n-2026-10-06/medir.mjs depois
node design/especime-v3/medicoes/rp4n-2026-10-06/captar.mjs antes
node design/especime-v3/medicoes/rp4n-2026-10-06/captar.mjs depois
npm run check:cartao
node tests/cartao/rp4n.mjs --registo
node design/especime-v3/medicoes/rp4n-2026-10-06/plantar-copias.mjs
RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes
# No motor:
python3 -m publisher.export_series --site <worktree> --write
python3 -m publisher.rp4n_origens <worktree>
python3 -m publisher.rotulos_series_test
python3 -m publisher.rp4n_origens_test
python3 -m core.gate
# No sítio:'''.splitlines()
saida += [comando,'```','','## Família a família e série a série','','As origens referidas nesta tabela estão identificadas na tabela seguinte, com a página ou o caminho e o resumo do corpo. Os campos da própria linha continuam presos à proveniência e aos portões existentes. Os excertos literais completos estão em `src/data/origens-rp4n.json` e na cópia do motor.','','| Família ou série | Palavra ou parte a confirmar | Antes | Depois | Apoio depois |','|---|---|---|---|---|']
for a in alteracoes:
 chaves=a['chave'] if isinstance(a['chave'],list) else [a['chave']]
 apoio='; '.join(a['origens']+a['campos']) or 'Ausência do excerto, conferida pela K17.'
 saida.append('| '+' | '.join(md(x) for x in ['; '.join(chaves),'; '.join(a['palavras']) or 'Apoio ou formulação da parte',a['antes']['pt'],a['depois']['pt'],apoio])+' |')
saida+=['','## Origens novas','','| Origem | Documento ou corpo | Página ou caminho | sha256 |','|---|---|---|---|']
for k,o in novas_origens.items():
 e=o['extracao'];local='página física '+str(e['pagina']) if e.get('pagina') else json.dumps(e['caminho'],ensure_ascii=False)
 saida.append('| '+' | '.join(md(x) for x in [k,o['documento']+' · '+o['selo']['motor'],local,o['selo']['sha256']])+' |')
saida+=['','Os boletins e relatórios novos foram pedidos pelo cliente da casa, com corpo e recibo. O manual europeu foi copiado de um corpo já selado, conservando o recibo original. Os rótulos vêm dos corpos das próprias séries. A hora e o cliente são os dos recibos, incluindo o identificador histórico do corredor do Orçamento, sem o substituir por uma assinatura inventada.','','## Partes que saíram','','| Família ou série | Parte retirada |','|---|---|']
for r in retiradas: saida.append('| '+md(identificadores(r['chave']))+' | '+md(r['pt'])+' |')
saida+=['','A contagem destas partes usa a comparação sequencial das partes em português: conta uma parte antiga `diz` quando o trecho correspondente passou a pontuação, ausência ou desapareceu. Uma substituição por outra parte `diz` conta como reescrita e fica na tabela seguinte. A falta de apoio literal motivou as supressões; não se pretende provar que a afirmação retirada é falsa.','','## Trechos reescritos','','| Família ou série | Antes | Depois |','|---|---|---|']
for r in reescritas: saida.append('| '+' | '.join(md(x) for x in [identificadores(r['chave']),' '.join(r['antes']),' '.join(r['depois'])])+' |')
saida+=['','## Plantas permanentes','','A proibição do nome percorre também as alternativas `ou` e os apoios misturados. A obrigação do selo das origens novas vem da exportação do motor, para que apagar o selo não permita regressar ao tratamento das origens antigas. Cada planta afirma a mensagem pela qual falha.','','| Planta | Mensagem pela qual falha |','|---|---|']
for p in plantas: saida.append('| '+md(p['nome'])+' | '+md(p['mensagem'])+' |')
saida+=['','## Conferências diretamente tocadas','']
registo=BASE/'conferencias'/'registo.json'
if registo.exists():
 saida+=['| Conferência | Cabeça | Código lido |','|---|---|---:|']
 for r in ler(registo): saida.append(f"| {r['comando']} | `{r['cabeca']}` | {r['codigo_lido']} |")
saida+=['','## Pacote da leitura a frio','',f'Há {len(copias)} cópias com estragos em `leitura-frio/`, com as mensagens esperadas em `leitura-frio/plantas.json`. `plantar-copias.mjs` volta a ler os ficheiros e afirma a mensagem de cada falha. O diff do motor está em `leitura-frio/motor.diff`; os corpos completos continuam na worktree do motor.','','Os recibos HTML completos, antes e depois, estão nas pastas `antes/recibos/` e `depois/recibos/`. Incluem Orçamento, execução, Évora, Madeira, pensão e uma série do Eurostat, nas duas edições. As imagens estão em `design/especime-v3/capturas/rp4n-2026-10-06/`. Os tamanhos e resumos de cada captura estão nos respetivos `capturas.json`.','','| Capturas | Total | Problemas medidos |','|---|---:|---:|',*[f"| {fase} | {len(c['capturas'])} | {len(c['problemas'])} |" for fase,c in capturas.items()],'','## Questões abertas','','- **RP4N-1. Informação por confirmar fora das frases.** O portão HTML novo recusa também os marcadores antigos de excertos, endereços, datas, títulos e pessoas, além da referência à marca na página de método. A lista completa das páginas está em `depois/medidas.json`. Resolver estes casos exige confirmar as fontes ou rever a publicação desses conteúdos. A proteção anterior do nome de pessoa, I77, permanece intacta. Não se trocou um marcador por um vazio para declarar um portão verde.','','- **RP4N-2. Relatório das pensões.** O pedido pelo cliente da casa falhou na validação do certificado. O recibo da falha fica no motor; não conta como origem selada. A frase passou a dizer apenas o que o excerto já alojado suporta, e a explicação sem apoio do fator saiu. Não se desativou a validação do certificado.','','- **RP4N-3. Vocabulário do PRR fora destas frases.** As frases passaram a respeitar as colunas e os filtros selados, incluindo verbas contratadas e sede dos beneficiários. Os nomes e outras apresentações anteriores do indicador precisam de leitura própria; não se alterou a medida nem a sua conta neste bloco.','','- **RP4N-4. Leitura independente e conferência da direção.** A leitura a frio do Opus e a conferência final da direção ainda não foram realizadas nesta sessão. O pacote está preparado para essas etapas. O resto do RP4-n-b permanece fora deste trabalho.','','Não houve publicação nem envio para o remoto. Não foi exposta uma linha «tokens used» nesta sessão; não se estima o custo.','','## Commits do código disponíveis ao gerar o relatório','']
for nome,raiz,inicio in [('Sítio',SITE,antes['cabeca']),('Motor',MOTOR,INICIO_MOTOR)]: saida += [nome+':','','```text',git(raiz,'log','--reverse','--format=%H %s',inicio+'..'+(cabecas[nome.lower()] if len(cabecas[nome.lower()])==40 else 'HEAD')) or 'Sem commit ainda.','```','']
(BASE/'LEIA-ME.md').write_text('\n'.join(saida))
pacote=BASE/'leitura-frio';pacote.mkdir(exist_ok=True)
(pacote/'motor.diff').write_text(git(MOTOR,'diff',INICIO_MOTOR+'..'+(cabecas['motor'] if len(cabecas['motor'])==40 else 'HEAD'))+'\n')
print(json.dumps(contagens,ensure_ascii=False))
