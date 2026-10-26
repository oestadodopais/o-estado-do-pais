"""Escreve o relatório da paragem a partir das provas e dos códigos reais."""
import json, subprocess
from pathlib import Path
p=Path(__file__).resolve().parent
base=p.parent
ler=lambda f:json.loads((p/f).read_text())
razoes=ler('razoes.json');recibos=ler('recibos.json')['recibos'];mudancas=ler('mudancas.json')['mudancas'];historico=ler('historico-nomes.json')['historico'];tabelas=ler('tabelas-nomes.json')['tabelas']
custo=ler('custo.json')
cabeca=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
linhas=['# CR2-h: correções preparadas, paragem nos nomes anteriores a 26.10', '',
'**Entrega bloqueada pelo §2 do mandato.** A mudança genérica para o nome do recibo altera seis entradas de 05.10.2026 em português e cinco em inglês. Não se acrescentou uma exceção por data nem se aprovou esse resultado. As alterações preparadas ficam conservadas para decisão do lugar de direção; esta passagem não está pronta para aterragem.', '',
f'Cabeça de partida: `4f5c70459`. Cabeça de chegada da implementação: `{cabeca}`. O commit seguinte contém este relatório e as provas; a sua cabeça é comunicada na resposta final. Referência da comparação: `main` em `71420a8f4`.', '',
'## O que mudou e o que impediu a entrega', '',
'O mapa e o laço das onze observações irmãs saíram de `nomes-das-medidas.mjs`. Os seis recibos da União recuperaram o lugar no título, nas duas edições. «O que mudou» usa o nome do recibo quando a escada anterior devolve um rótulo da fonte, e marca a família que o fundamenta. As quinze entradas autorizadas têm o nome do respetivo recibo, mas a regra alcança também entradas antigas, contrariando a condição de conservação do mandato.', '',
'As quinze razões de atualização e as quinze razões de acesso foram reescritas nas duas línguas. O portão da voz tinha recusado «read at the source on», «the house» e «a casa». Os novos moldes usam «comparação semanal com a fonte» e «este projeto releu a fonte». Os valores e as datas vêm dos extratos do painel; o valor intermédio do caso B vem da linha 3 do extrato de 19.10. Os valores esperados no guião são guardas, não a origem do texto. O guião confirmou, para cada linha, que só `reason` e `reason_en` das duas entradas mudaram. O excerto e os restantes campos foram conservados.', '',
'As razões anteriores do CR2-g continuam no histórico e em `g/razoes.json`. O `dist/` do CR2-g foi reescrito por `g/sincronizar-marcas.mjs`; os seus códigos 1 de `build`, `check:voz` e `check:cartao` ficaram vermelhos, sem repetição nessa passagem. Os dois guiões de marcas receberam o aviso de desuso e não correram nesta passagem. Nenhum guião desta passagem remendou `dist/`: apenas os comandos reais `npm run build` o escreveram.', '',
'## Tabelas dos nomes exportados', '', '| Tabela | Chaves medidas | Comparação com main |','|---|---:|---|']
for e in tabelas:linhas.append(f"| `{e['tabela']}` | {e['chaves']} | Igual, chave a chave e texto a texto |")
linhas += ['', '`h/conferir-nomes.mjs` lê `git show 71420a8f4:src/data/nomes-das-medidas.mjs`, importa essa versão num ficheiro temporário fora do repositório e compara os objetos. Prova em `h/tabelas-nomes.json`.', '']
for lang in ['pt','en']:
 linhas += [f'## Títulos dos recibos, edição {lang}', '', '| Linha | H1 de main e desta construção, iguais |', '|---|---|']
 for e in recibos:
  if e['lang']==lang:linhas.append(f"| `{e['id']}` | {e['atual']} |")
 linhas.append('')
linhas += ['## Os quinze nomes em «O que mudou»', '', '| Linha | PT, igual ao recibo | EN, igual ao recibo |','|---|---|---|']
for r in razoes:
 nomes={e['lang']:e['nome'] for e in mudancas if e['id']==r['id']}
 linhas.append(f"| `{r['id']}` | {nomes['pt']} | {nomes['en']} |")
linhas += ['', 'Os quinze nomes portugueses são os nomes portugueses declarados do recibo, sem os rótulos ingleses da fonte. As seis linhas da União conservam o lugar nos nomes. As marcas de família foram conferidas contra o resolvedor. Provas em `h/recibos.json` e `h/mudancas.json`.', '', '## Comparação das entradas antigas com main, motivo da paragem', '',
'A referência foi extraída com `git archive 71420a8f4` para uma pasta temporária fora do repositório e construída com `npm run build`, usando as dependências já instaladas. O HTML foi produzido por Astro. Essa construção de referência terminou com código 1 em `check:datas`, porque o arquivo temporário não tem `.git`: «fatal: not a git repository (or any of the parent directories): .git». Não se apresenta como construção aprovada. O HTML comparado vem dos ficheiros dessa referência, sem reconstruir nomes pelos resolvedores.', '',
'Em cada edição há 48 entradas anteriores a 26.10 nos dois HTML. As duas outras entradas de 26.10, `edicoes-publicadas` e `estudos-publicados`, mantêm os nomes de main. As quinze atualizações desta passagem são entradas novas perante main. As diferenças de nome nas entradas antigas são todas as seguintes:', '',
'| Edição | Linha, entrada de 05.10.2026 | Nome em main | Nome nesta construção |','|---|---|---|']
for e in historico:
 for x in e['divergencias']:linhas.append(f"| {e['lang']} | `{x['antes']['id']}` | {x['antes']['nome']} | {x['depois']['nome']} |")
linhas += ['', 'O nome inglês de `pib-real-per-capita-2024` continua «Real GDP per capita», pelo que essa entrada não aparece entre as cinco divergências inglesas. `h/historico-nomes.json` conserva a lista completa. A conferência termina deliberadamente com código 1 perante estas divergências. A recolha foi completada nas duas edições para documentar a paragem; não se alterou a regra de aceitação.', '',
'## Códigos reais e comandos não iniciados', '', '| Comando | Código | Registo ou motivo |','|---|---|---|']
comandos=[('build','npm run build'),('check-voz','npm run check:voz'),('check-cartao','npm run check:cartao'),('ledger-check','npm run ledger:check'),('check-registo','npm run check:registo'),('typecheck','npm run typecheck'),('check-cruzamento','npm run check:cruzamento'),('check-palavras','npm run check:palavras'),('check-rotulos','npm run check:rotulos'),('ferramenta','Ensaio da ferramenta'),('tabelas-nomes','Comparação das tabelas exportadas'),('nomes-html','Comparação dos nomes no HTML'),('build-main','npm run build da referência main')]
for nome,comando in comandos:
 f=p/f'{nome}.codigo'
 if f.exists():linhas.append(f'| {comando} | {f.read_text().strip()} | `h/{nome}-h.log` |')
 else:linhas.append(f'| {comando} | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |')
linhas += ['', 'O `build` inclui conferências na sua própria cadeia; isso não se apresenta como execução isolada dos comandos da tabela. `RESEARCHHUB_DIR` apontou à worktree autorizada do motor. As duas construções já estavam em curso quando se encontrou a condição de paragem e terminaram para conservar os códigos reais. Não houve corrida inteira dos portões, capturas nem execução do gate do motor.', '',
'O primeiro ensaio de HTML falhou porque o seletor também apanhava a marca de uma data; o seletor passou a escolher só as entradas da lista. A segunda execução detetou a paragem em português. A recolha bilingue encontrou ainda duas entradas de 26.10 que já existiam em main, pelo que a seleção das quinze foi delimitada pelos identificadores autorizados e as outras duas comparadas à parte. Os quatro registos ficam em `h/`, incluindo os erros do guião, sem substituir códigos vermelhos por zeros.', '',
'## Ferramenta, inventário e limites', '',
'A planta de `published_at` volta a escolher outro dia quando o acesso coincide com o dia do carimbo. O ensaio lê e executa a função real da planta em ambos os casos, além das três recusas do ensaio anterior; código 0. A gralha «do do» foi corrigida.', '',
'No inventário dos rótulos mudaram apenas as réguas das quatro chaves nacionais de dívida das empresas e das famílias, em PT e EN: forma com provisório em Portugal a 0, forma sem essa nota a 1. Acrescentou-se `revisao_cr2h` com as quatro chaves e a razão pedida: «CR2-h, 26.10.2026: a nota de provisório do valor de Portugal de 2024 saiu com a revisão do Eurostat de 17.10.2026». A cabeça e as contagens gerais não foram alteradas. `check:rotulos` não foi iniciado devido à paragem.', '',
'Ficam para higiene os achados Minor 9 e Minor 13 do mandato: o lado «antes» das duas frases de 2024 reconstruído pelos resolvedores e a remoção da nota de provisório antes da comparação em `frases-cr2.mjs`; as vírgulas decimais na edição inglesa, I242. Continuam também as pendências históricas já declaradas: datas de próxima verificação ultrapassadas, duas releituras no mesmo dia sem distinção, sinal global dos 17 alarmes e releitura das séries por país pela UE1-c. Nenhuma escrita foi feita no motor.', '',
'## As quinze razões das atualizações, nas duas línguas', '']
for e in razoes:linhas += [f"**`{e['id']}` (caso {e['caso']})**", '', 'PT: '+e['reason'], '', 'EN: '+e['reason_en'], '']
linhas += ['### Exemplo da razão de proveniência', '', f"`{razoes[0]['id']}`, `access_date`:", '', 'PT: '+razoes[0]['proveniencia']['reason'], '', 'EN: '+razoes[0]['proveniencia']['reason_en'], '',
'## Custo e conservação do trabalho', '',
f"Medição própria em `h/custo.json`: {custo['chamadas_ferramentas']} chamadas até {custo['momento']}. Duas construções iniciadas, uma da worktree e uma da referência temporária; duas conferências pedidas fora da construção (`typecheck` e ferramenta); uma comparação isolada das tabelas e quatro execuções do guião de HTML. Total de nove execuções com código guardado. A reescrita das razões executou ainda a sua conferência integral, sem código em ficheiro separado. Nenhuma corrida inteira, captura ou gate do motor. `tokens used`: não exposto.", '',
'Acrescentou-se `continuacao_cr2e` a `custo.json` com os números fornecidos pelo lançador: 2 turnos, 153 942 símbolos de entrada, 153 088 em cache, 604 de saída; semana de 5,0% a 5,0%, diferença 0,0 ponto. Medido pelo lançador, fora da passagem. O quadro histórico passa a incluir CR2-f e CR2-g com as medidas do mandato; os pontos desta passagem cabem ao lançador.', '',
'Na partida já existiam sete relatórios não versionados, `RELATORIO.md` e `RELATORIO-b.md` a `RELATORIO-g.md`. Foram preservados e excluídos dos commits. A inspeção final distingue esses ficheiros de trabalho desta passagem; não se declara uma worktree absolutamente limpa enquanto eles existirem.', '', '---', '', '## Histórico CR2-g, conservado', '']
f=base/'LEIA-ME.md';antigo=f.read_text();antigo=antigo[antigo.index('# CR2-g:'):]
aviso='Nota CR2-h: as razões desta secção foram substituídas na passagem CR2-h; conservam-se como registo do que a CR2-g escreveu.\n\n'
antigo=antigo.replace('## As quinze razões novas, nas duas línguas\n\n','## As quinze razões novas, nas duas línguas\n\n'+aviso,1)
linha='| CR2-e | 17, conforme o mandato CR2-g | 1 | 7 |'
novas='\n| CR2-f | 47 chamadas; 110 402 símbolos pelo lançador | 1 | 7 |\n| CR2-g | 54 chamadas na medição do construtor; lançador: 58 turnos, 5 427 291 de entrada, 5 325 056 em cache, 27 679 de saída, 1,0 ponto | 1 | 6 |\n'+f"| CR2-h | {custo['chamadas_ferramentas']} chamadas na medição de h/custo.json | 2, incluindo referência main | 2 fora da construção; paragem do §2 |"
antigo=antigo.replace(linha,linha+novas,1)
f.write_text('\n'.join(linhas)+'\n'+antigo)
print('Relatório da paragem escrito com as provas das duas edições.')
