# OG1-A9

A proveniência que bloqueou a A8 foi corrigida pelo gerador. O exportador comum, incluindo o V6, não mudou. As onze afirmações têm `source: null` no motor, apenas quem fala em `attributed_to` e o publicador em `entity_aliases`, na forma já usada pelos itens existentes. A travessia passou e escreveu as mesmas 33 linhas. No sítio, o recibo de José Manuel Pureza diz «Publicado por Diário de Notícias»; a afirmação continua atribuída a José Manuel Pureza. As linhas da UTAO mantêm `source: "UTAO"`.

## Alterações e provas

O ensaio do motor passou 105 verificações, incluindo a ausência de `entity_aliases` numa afirmação. `invariantes-a9.json` compara as 88 linhas com a cabeça inicial: só `source` e `entity_aliases` mudaram, nas onze afirmações. Valores, unidades, excertos, datas, rótulos e localizadores ficaram iguais. A releitura própria da OG1 conferiu os 33 corpos e as seis plantas de adulteração. Os sete ficheiros do motor por comitar estão listados abaixo.

As oito correções editoriais do mandato A8 estão nas duas edições: fontes, frases 1, 4 e 5; comparação; conclusão; recomendação; opinião; data do comunicado do PCP. A frase 3 das fontes permaneceu igual. A dívida de 2025 usa agora `divida-publica-2025`, 89,2 %, com a revisão do Eurostat de 21.10.2026; a linha da UTAO conserva o seu recibo, sem ser usada no item. A Saúde continua na linha do sítio, com 17 803,1 milhões de euros. A margem da despesa líquida ganhou o nome e a definição do mandato nas duas edições.

As formas mudaram onde a régua o exigia: o comunicado do PCP imprime uma só data, 19.10.2026, a sua `reference_date`; as quatro repetições da audição do ministro imprimem a data da própria linha; «BE» e «IL», junto das pessoas, passaram a «Bloco de Esquerda» e «Iniciativa Liberal», os rótulos das páginas alojadas. O exportador da seleção guarda pequenos excertos dessas páginas, selados pelo resumo do corpo. A conferência lê esses excertos e, com o motor presente, volta a encontrá-los no corpo. As plantas de data trocada e partido trocado são recusadas em português e em inglês. A retirada do ficheiro de provas também é recusada: zero conferências deixou de ser verde.

Os 66 recibos foram reconstruídos. Sem rótulo, o título do documento deixou de ser apresentado como nome da medida. Conserva-se a composição anterior que já junta explicitamente uma medida ao documento. Os excertos portugueses dos vinte recibos numéricos da UTAO têm a marca de língua na edição inglesa; a mesma marca foi conferida nos dois parágrafos da UTAO. Bastou retirar a condição que limitava a marca aos valores textuais. A tabela da língua passou a declarar ECO e Correio da Manhã como publicadores e retirou as seis declarações de pessoas que já não são publicadores. As pessoas continuam citadas e marcadas em português.

A troca para a linha comum da dívida exigiu portas para o item na primeira página, no índice, na leitura da semana, na União Europeia e no recibo da série de dívida. Foi usado o componente existente. Na régua da discussão, a exceção temática da Saúde ficou limitada ao seu item, como já estava na seleção das portas; a OG1 liga-se pela linha da dívida, na secção da dívida. Duas plantas por edição confirmam que uma porta por linha não pode passar por temática e que a Saúde não pode sair da sua secção. A lista fechada da primeira página só admite a nova porta depois de a conferir pelo leitor independente de integração; plantas de título e destino alterados são recusadas. A conferência passou 744 plantas e 157 verificações específicas OG1, com 714 portas de integração.

As auditorias das frases e da definição foram atualizadas com os apoios dos documentos. O inventário retirou as 28 formas substituídas e recebeu as 28 novas. Duas exceções de voz já existentes foram ajustadas às palavras do mandato, conservando o âmbito da discussão: a indicação de navegação para as fontes e o orçamento assente em pressupostos. Não se alteraram regras do exportador.

A fase B mantém-se para 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário da Assembleia.

## Falhas intermédias

A primeira alteração da vista ocultava também nomes de medidas já apresentados junto do documento. A discussão detetou a regressão e a condição foi corrigida. A língua detetou os dois publicadores sem declaração e as seis declarações antigas sem publicador. A primeira planta da data atingia o período do título do item, em vez da data de uma afirmação; o seletor foi corrigido e a planta passou a morder. A medição da voz e o primeiro build encontraram HTML anterior à alteração da língua. A segunda corrida do build foi invalidada por uma reconstrução concorrente do `dist/`, que causou um ficheiro ausente. A corrida seguinte detetou a porta ainda não integrada na lista fechada da primeira página. A correção usa a conferência independente da porta, antes de a admitir nessa lista. A última corrida correu sem alterações concorrentes ao código ou ao `dist/`.

As portas em falta foram detetadas pela discussão; depois de acrescentadas, restavam duas recusas causadas pelo âmbito indevido da exceção temática da Saúde. A correção e as suas plantas estão descritas acima. Os registos das falhas foram conservados. Não correram portões integrais nem capturas.

## Motor por comitar

O escrivão não transmite `OEDP_GATE=adiado`. Aplica-se a alternativa expressa do mandato, sem pedir um commit que omita essa condição:

- `content/30 Orcamento 2027 Generalidade/ledger.json`.
- `content/30 Orcamento 2027 Generalidade/verificacao.json`.
- `publisher/manifest.og1a.json`.
- `publisher/oe2027_generalidade.py`.
- `publisher/oe2027_generalidade_test.py`.
- `publisher/og1a_export.py`.
- `publisher/recortes/og1a/provas.json`.

## Conferências, cabeças e custo

Códigos finais: `build-verificado-a9.codigo`: 0, `check-voz-verificado-a9.codigo`: 0, `check-lingua-final-a9.codigo`: 0, `check-discussao-verificado-a9.codigo`: 0, `check-lugares-a9.codigo`: 0, `ledger-check-a9.codigo`: 0, `check-registo-a9.codigo`: 0, `typecheck-ultima-a9.codigo`: 0, `check-cruzamento-local-a9.codigo`: 0, `pesquisa-final-a9.codigo`: 0, `origem-og1-a9.codigo`: 0, `travessia-rotulos-a9.codigo`: 0.

Implementação do sítio: `aa8625d40760bfa9139b671c78f7da7039afed19`. Motor: `f9bafc7db9a0ae190d56cafc5fb8f1b3ffa98b91`, com os sete ficheiros acima por comitar. O relatório será comitado separadamente; a cabeça final do sítio é confirmada na resposta.

32 corridas de conferências e medições, 4 gerações, zero corridas dos portões integrais e zero capturas. 91 chamadas diretas até à escrita deste relatório; o commit do relatório e a inspeção final são posteriores. `medidas-a9.json` guarda cada código e duração, incluindo as falhas. `custo.json` conserva as sete passagens anteriores e corrige a A8 pelas medidas do mandato A9: 21 chamadas, 22 turnos, 1 845 509 símbolos de entrada e 0 pontos. `tokens used`: não disponibilizado.

## Transcrição do dist, português

O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede

### Como foi dito

Comissão Política Nacional do Partido Socialista, a 22.10.2026, na página do partido: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, no comunicado de 19.10.2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» O comunicado não anuncia o voto.

Paulo Raimundo, a 15.10.2026, numa intervenção publicada na página do PCP: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» A intervenção não anuncia o voto.

José Manuel Pureza, do Bloco de Esquerda, a 08.10.2026, segundo o Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» A notícia relata o voto contra.

Mariana Leitão, da Iniciativa Liberal, no título de uma entrevista ao ECO a 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, do Livre, a 28.09.2026, antes de a proposta dar entrada, segundo o Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, ministro das Finanças, na audição da comissão de Orçamento a 23.10.2026, segundo a RTP, sobre as previsões das entidades nacionais e internacionais: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, na mesma audição de 23.10.2026, segundo a RTP, sobre os 300 milhões de euros do combate à fraude nos combustíveis: «são receita do Estado».

Joaquim Miranda Sarmento, na mesma audição de 23.10.2026, segundo a RTP, sobre as medidas da habitação: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, na mesma audição de 23.10.2026, segundo o ECO, sobre os juros da dívida: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, na mesma audição de 23.10.2026, segundo o Observador, na escolha entre o IRS Jovem e o prémio salarial: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### O que as fontes dizem

A proposta prevê um crescimento real do PIB de 2,1 % em 2027, depois de 2,3 % em 2026; um saldo orçamental de 0,0 % do PIB em 2026 e de 0,1 % em 2027, que em contabilidade nacional são 275 milhões de euros no relatório da proposta; e uma dívida pública de 87,5 % do PIB em 2026 e 84,5 % em 2027, depois de 89,2 % em 2025, na revisão do Eurostat de 21.10.2026.

As medidas já em vigor pesam no saldo de 2027 −5 411 milhões de euros, 1,6 % do PIB. Os juros sobem 23,2 %, para 8,2 mil milhões de euros, e a taxa de juro implícita da dívida passa de 2,4 % para 2,9 %.

As medidas novas valem 79 milhões de euros para o saldo. A maior, do lado da receita, é o combate à fraude nos combustíveis, 300 milhões de euros; a UTAO escreve que a proposta «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» e conta a subexecução entre os riscos.

Sobre o emprego, a UTAO escreve que o crescimento de 1,4 % em 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». Sobre o petróleo, a proposta assume 86,1 dólares por barril em 2027, e a média dos contratos para esse ano, a 16 de outubro, era de cerca de 95 dólares, 11 % acima desse pressuposto.

Pela regra europeia da despesa líquida, a Comissão Europeia previa em junho um desvio de 2,1 % do PIB no fim de 2027, acima dos 0,6 % do PIB fixados para aferir o cumprimento da trajetória; os dados do Ministério das Finanças dão 0,9 % antes da flexibilidade para a defesa e 0,5 % depois.

O programa da Saúde tem 17 803,1 milhões de euros, −1,4 % face à estimativa de 2026 e 3,0 % sem o PRR: é a conta que o item da Saúde já explica.

### A comparação

As previsões que o ministro diz «perfeitamente alinhadas» e a apreciação da UTAO não dizem o mesmo. A UTAO não corrige o cenário do PIB, mas tem dificuldade em conciliar o emprego com a imigração, aponta o preço do petróleo abaixo dos contratos e a maior medida de receita sem a informação que a fundamente, e conta um desvio na despesa líquida que, nos números do próprio Ministério, só a flexibilidade para a defesa fecha; nos da Comissão Europeia, não fecha. Os 300 milhões de euros que o ministro pôs ao lado de «um saldo de 270 milhões» cabem na conta que a UTAO transcreve do relatório da proposta: o saldo de 2027 em contabilidade nacional é aí de 275 milhões de euros, e a medida de que falava custa mais do que ele. A subida dos juros, «risco de mercado e não risco de país» para o ministro, é na proposta mais 23,2 % de despesa em 2027, venha de onde vier. Das posições anunciadas, o PS anunciou a abstenção na generalidade e o BE, segundo o Diário de Notícias, o voto contra; o PCP, a IL e o Livre não anunciaram o voto nos textos aqui citados. Este item não tem afirmações do PSD, do CDS e do Chega: a pesquisa não selou nenhuma; a fase B traz as intervenções do debate.

### A conclusão

A proposta chega ao voto com um saldo de 0,1 % do PIB que assenta numa receita de 300 milhões de euros sem a informação que a fundamente, num emprego que a UTAO tem dificuldade em conciliar com a imigração e num petróleo cujos contratos para 2027 estavam, a 16 de outubro, 11 % acima do pressuposto da proposta. O que o Parlamento vota a 28.10.2026 é a generalidade; os números da especialidade vêm depois.

### A recomendação

Ao leitor: cada número desta página tem a sua fonte a um passo, e a apreciação da UTAO lê-se antes das intervenções do debate. Ao Ministério das Finanças: publicar a informação que fundamenta a estimativa dos 300 milhões de euros dos combustíveis, que a UTAO não encontra na proposta. Ao Parlamento: pedir, na especialidade, o quadro da despesa líquida com e sem a flexibilidade para a defesa.

### A opinião do lugar de direção

«Alinhadas» não descreve uma apreciação que duvida do emprego, do petróleo e da maior medida de receita, e que só fecha o desvio da despesa com a flexibilidade para a defesa, e só nos números do Ministério. A frase «um frete ao capital e um desastre para o País» não se mede, e este projeto não a avalia. O que se mede diz isto: um orçamento quase equilibrado nas previsões do Governo, assente em pressupostos que a entidade técnica do próprio Parlamento põe em dúvida. A 28.10.2026, depois do voto, esta página ganha o registo da votação e as intervenções do Diário da Assembleia, e muda se os números mudarem.

## Transcrição do dist, inglês

The 2027 Budget before the general vote: what the parties and the Government have said so far, next to what the UTAO measures

### As it was said

Comissão Política Nacional do Partido Socialista, on 22.10.2026, on the party's page: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, in its communiqué of 19.10.2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» The communiqué does not announce the vote.

Paulo Raimundo, on 15.10.2026, in a speech published on the PCP's page: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» The speech does not announce the vote.

José Manuel Pureza, of Bloco de Esquerda, on 08.10.2026, as reported by Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» The report says the party votes against.

Mariana Leitão, of Iniciativa Liberal, in the title of an interview with ECO on 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, of Livre, on 28.09.2026, before the proposal was tabled, as reported by Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, Finance Minister, at the Budget committee hearing on 23.10.2026, as reported by RTP, on the forecasts of national and international bodies: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, at the same hearing on 23.10.2026, as reported by RTP, on the 300 million euros from the fight against fuel fraud: «são receita do Estado».

Joaquim Miranda Sarmento, at the same hearing on 23.10.2026, as reported by RTP, on the housing measures: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, at the same hearing on 23.10.2026, as reported by ECO, on the interest on the debt: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, at the same hearing on 23.10.2026, as reported by Observador, on the choice between the youth income tax and the wage premium: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### What the sources say

The proposal forecasts real GDP growth of 2,1 % in 2027, after 2,3 % in 2026; a budget balance of 0,0 % of GDP in 2026 and 0,1 % in 2027, which in national accounts is 275 million euros in the proposal's report; and public debt of 87,5 % of GDP in 2026 and 84,5 % in 2027, after 89,2 % in 2025, in Eurostat's revision of 21.10.2026.

Measures already in force weigh on the 2027 balance by −5 411 million euros, 1,6 % of GDP. Interest rises 23,2 %, to 8,2 billion euros, and the implicit interest rate on the debt moves from 2,4 % to 2,9 %.

New measures are worth 79 million euros to the balance. The largest, on the revenue side, is the fight against fuel fraud, 300 million euros; the UTAO writes that the proposal «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» and counts under-execution among the risks.

On employment, the UTAO writes that growth of 1,4 % in 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». On oil, the proposal assumes 86,1 dollars a barrel in 2027, and the average of the contracts for that year, on 16 October, was about 95 dollars, 11 % above that assumption.

Under the European net expenditure rule, the European Commission forecast in June a deviation of 2,1 % of GDP at the end of 2027, above the 0,6 % of GDP set for assessing compliance with the path; the Finance Ministry's figures give 0,9 % before the defence flexibility and 0,5 % after.

The Health programme has 17 803,1 million euros, −1,4 % against the 2026 estimate and 3,0 % without the recovery plan: it is the account the Health item already explains.

### The comparison

The forecasts the minister calls «perfeitamente alinhadas» and the UTAO's appraisal do not say the same thing. The UTAO does not correct the GDP scenario, but it finds employment hard to reconcile with immigration, points to an oil price below the contracts and to the largest revenue measure without the information to support it, and it counts a net expenditure deviation that, on the Ministry's own figures, only the defence flexibility closes; on the European Commission's, it does not close. The 300 million euros the minister set beside «um saldo de 270 milhões» fit the account the UTAO transcribes from the proposal's report: the 2027 balance in national accounts is there 275 million euros, and the measure he spoke of costs more than that. The rise in interest, «risco de mercado e não risco de país» for the minister, is in the proposal 23,2 % more spending in 2027, wherever it comes from. Of the positions announced, the PS announced abstention in the general vote and the BE, as reported by Diário de Notícias, a vote against; the PCP, the IL and Livre did not announce their vote in the texts cited here. This item has no statements from the PSD, the CDS or Chega: the research sealed none; phase B brings the speeches of the debate.

### The conclusion

The proposal reaches the vote with a balance of 0,1 % of GDP that rests on 300 million euros of revenue without the information to support it, on employment the UTAO finds hard to reconcile with immigration, and on oil whose 2027 contracts were, on 16 October, 11 % above the proposal's assumption. What Parliament votes on 28.10.2026 is the general outline; the figures of the detailed stage come later.

### The recommendation

To the reader: every number on this page has its source one step away, and the UTAO's appraisal is worth reading before the speeches. To the Finance Ministry: publish the information behind the 300 million euro fuel estimate, which the UTAO does not find in the proposal. To Parliament: ask, at the detailed stage, for the net expenditure table with and without the defence flexibility.

### The editorial seat's opinion

«Aligned» does not describe an appraisal that doubts employment, oil and the largest revenue measure, and that closes the spending deviation only with the defence flexibility, and only on the Ministry's figures. The sentence «um frete ao capital e um desastre para o País» cannot be measured, and this project does not judge it. What can be measured says this: a budget close to balance in the Government's forecasts, resting on assumptions that Parliament's own technical unit calls into question. On 28.10.2026, after the vote, this page gains the voting record and the speeches from the Assembly's Diário, and changes if the numbers change.

---

# OG1-A8

A passagem parou na proteção da fonte do exportador, abrangida pelo §3 do mandato. O gerador separa agora quem publica o documento de quem fala, e passou 92 verificações. A travessia recusou a primeira afirmação e não escreveu nenhum ficheiro no sítio. As alterações incompletas do item, dos nomes, da vista e da conferência foram repostas à cabeça inicial; não se apresenta a correção como construída.

## A recusa e a decisão necessária

`publisher/export_site_rows.py:2320` exige que `source` contenha uma entidade obtida por `engine_entities`: atribuições da linha ou das suas irmãs no mesmo endereço, e aliases. Não lê o campo `source` do motor. A mensagem foi:

> og1-ps-abstencao: source 'PS' names no entity the engine row stands behind (Comissão Política Nacional do Partido Socialista)

O editor do documento e a pessoa citada são entidades com funções diferentes. Declarar o jornal como alias de quem fala falsificaria essa relação. Não se alterou a régua nem a atribuição para ultrapassar a recusa. É necessária uma decisão do lugar de direção sobre a representação e a verificação do editor no exportador comum, mantendo a verificação independente de `attributed_to`.

## Preparação no motor

O gerador resolve o editor pelo anfitrião do recibo alojado: PS, PCP, Diário de Notícias, ECO, Correio da Manhã, RTP e Observador. Conserva as pessoas em `attributed_to`. O manifesto e as provas transportam `source`. O ensaio ganhou a separação entre editor e pessoa e uma planta de editor adulterado. O livro foi regenerado; `invariantes-a8.json` confirma que os únicos campos alterados nas linhas são `source`, incluindo a declaração de UTAO nas suas linhas. Valores, excertos, datas, localizadores e atribuições permanecem iguais.

O `comitar.sh` não transmite `OEDP_GATE=adiado`. Pela alternativa expressa do §2.6, o motor fica por comitar, com esta lista:

- `content/30 Orcamento 2027 Generalidade/ledger.json`.
- `content/30 Orcamento 2027 Generalidade/verificacao.json`.
- `publisher/manifest.og1a.json`.
- `publisher/oe2027_generalidade.py`.
- `publisher/oe2027_generalidade_test.py`.
- `publisher/og1a_export.py`.
- `publisher/recortes/og1a/provas.json`.

## Códigos e trabalho por fazer

- `gerar-a8.codigo`: 0.
- `pesquisa-a8.codigo`: 0, 92 verificações.
- `preparar-a8.codigo`: 0, 33 linhas selecionadas.
- `travessia-a8.codigo`: 1, nada escrito.

Não correram build, voz, língua, discussão, lugares, livro, registo, typecheck ou cruzamento local depois da paragem. Não correram portões integrais nem capturas. As duas plantas da data e do partido, a ausência de provas como erro, os recibos e as correções das frases continuam por entregar. Não há novos recibos nem nova transcrição das seis partes: o `dist/` existente é anterior à passagem e não foi reconstruído. A transcrição da A7 abaixo permanece como registo dessa construção, não como resultado A8.

As frases pendentes são as do §1: fontes 1, 4 e 5; comparação; conclusão; recomendação; opinião; e data do comunicado do PCP. A frase 3 das fontes não precisava de alteração. Os rótulos de partido ainda precisam de conferência contra os corpos alojados. A fase B continua prevista para 28.10.2026, depois do voto.

## Cabeças e custo

Cabeça inicial do sítio: `8103731c4a646596ed0f6a934cc910da7ec70a13`. Cabeça do motor: `c740ed32cd51c784d8ed99dd9a5d18d1f9c0205d`. Só este relatório e as provas da paragem são pedidos ao escrivão; a cabeça resultante é confirmada na resposta final.

`custo.json` reúne as sete passagens anteriores a partir de `og1a-pontos.txt`, acrescenta as 36 chamadas da A4 e as 45 corridas da A6 indicadas no mandato, e regista esta passagem. Foram duas corridas de conferências (ensaio e travessia), duas gerações, zero portões integrais e zero capturas. Houve 18 chamadas diretas de ferramentas antes da preparação do relatório; a preparação, o commit e a inspeção final são posteriores. `medidas-a8.json` guarda códigos e durações medidos. `tokens used`: não disponibilizado.

---

# OG1-A7

A voz, a língua e o build passaram. A verificação integral com a origem no motor conserva oito divergências preexistentes de séries europeias, fora da seleção OG1. O commit do motor fica pendente porque o escrivão não transmite `OEDP_GATE=adiado`, conforme a exceção expressa do mandato. Não se declara a worktree do motor limpa nem a verificação integral a zero.

## Correções e provas

As duas frases mandatadas foram corrigidas nas duas edições. «Limiar/threshold» também saiu do nome e da definição da medida, passando a «valor de referência/reference value». As auditorias da discussão e das famílias conservam os mesmos apoios e excertos, com a nova redação. O inventário conserva as formas anteriores como retiradas.

No gerador, `name` e `name_source` são o rótulo literal da célula da tabela, ou `null` quando a fonte não imprime rótulo. O exportador omite os campos sem rótulo e transporta a declaração nas provas. O localizador continua no seu campo. O código `3.=(1-2)` não é o título: a célula seguinte da Tabela 8 imprime «Impacto Total no Saldo Orçamental», confirmada no PDF alojado; o seletor foi corrigido. Das 33 linhas exportadas, três têm rótulo, esse título e «Saúde» nas duas restantes, e trinta não têm. Saíram as declarações dos nomes internos da A6. A tabela da língua ganhou apenas o título literal em falta, seis nomes próprios de atribuições e cinco datas de edição sem língua. A unidade «USD por barril» ganhou a tradução de dicionário «USD per barrel». A exceção de navegação da voz foi ajustada à troca mandatada de «em cada número» por «a cada número», com o mesmo âmbito.

As 88 linhas da pesquisa mantêm valores, excertos, fontes e localizadores. O ensaio passou com 90 verificações. As quatro correções anteriores permanecem: emprego público e Paulo Raimundo com as frases completas, «Inovação» junta, e ausência de `secondary_values`. A Saúde continua a usar 17 803,1 milhões no sítio; a linha da pesquisa conserva a precisão da UTAO. O valor positivo é 79 e o excerto conserva «+79».

A travessia entregou as mesmas 33 linhas e os 66 recibos, sem duplicar as sete gémeas listadas na secção A6 abaixo. `invariantes-a7.json` guarda a comparação; `prova-texto-a7.json` guarda os hashes do HTML e confirma que apenas quatro parágrafos do item mudaram, dois por edição. `transcricao-a7.json` contém as seis partes por edição. A discussão passou com 736 plantas, além das 50 verificações específicas OG1. A releitura própria da OG1 leu os 33 corpos e passou seis plantas.

## Conferências e limites

- `build-4-a7.codigo`: 0.
- `check-voz-3-a7.codigo`: 0.
- `check-lingua-4-a7.codigo`: 0.
- `check-discussao-final-a7.codigo`: 0.
- `check-lugares-a7.codigo`: 0.
- `ledger-check-a7.codigo`: 0.
- `check-registo-a7.codigo`: 0.
- `check-cruzamento-a7.codigo`: 1.
- `check-cruzamento-local-a7.codigo`: 0.
- `typecheck-3-a7.codigo`: 0.
- `pesquisa-2-a7.codigo`: 0.
- `origem-og1-a7.codigo`: 0.
- `travessia-final-a7.codigo`: 0.

O cruzamento local passou, com `RESEARCHHUB_DIR` definido. A opção adicional `--with-origin` encontrou oito diferenças: os ficheiros de países e rótulos, e as séries de dívida, preços da habitação, rácio S80/S20, risco de pobreza ou exclusão, sobrecarga da habitação e sobrecarga dos inquilinos a preços de mercado. Os cinco ficheiros de origem e registo comparados estão iguais às cabeças iniciais, como prova `divergencias-origem-a7.json`. Não foram reexportadas séries fora das 33 linhas autorizadas. A origem OG1 foi conferida separadamente e passou.

As falhas intermédias ficam nos registos: a primeira invocação direta do exportador não encontrou o módulo Python e foi corrigida para `python3 -m`; a primeira construção recusou o código numérico usado como rótulo; as auditorias das frases e as declarações de língua em falta foram atualizadas. Uma construção e uma conferência de língua encontraram HTML anterior às últimas declarações; a construção final voltou a gerar as páginas e percorreu a cadeia completa. Não correram os portões inteiros nem capturas. Nenhuma regra foi dispensada.

A fase B continua declarada para 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário.

## Commits e custo

A implementação completa da A6 já estava em `c40151b60`. As correções A7 estão em `bd6cf426a2ce6207382571a75c65e1df4db9d12d`. O relatório será comitado separadamente e a cabeça final será confirmada na resposta. O motor permanece em `4551a76a033c00a030e2da02bf4fc800fad810fb`, com estes ficheiros por comitar:

- `content/30 Orcamento 2027 Generalidade/extracoes.json`.
- `content/30 Orcamento 2027 Generalidade/ledger.json`.
- `content/30 Orcamento 2027 Generalidade/verificacao.json`.
- `publisher/oe2027_generalidade.py`.
- `publisher/oe2027_generalidade_test.py`.
- `publisher/og1a_export.py`.
- `publisher/recortes/og1a/provas.json`.

27 corridas de conferências, segundo o critério de `medidas.json`, e quatro gerações. Zero corridas inteiras dos portões e zero capturas. 72 chamadas diretas de ferramentas até à preparação deste relatório; o commit e a inspeção final são posteriores. As durações medidas de cada comando estão em `medidas.json`. O custo semanal não foi exposto. `tokens used`: não disponibilizado.

## Transcrição do dist, português

O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede

### Como foi dito

Comissão Política Nacional do Partido Socialista, a 22.10.2026, na página do partido: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, no comunicado de 18 e 19 de outubro de 2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» O comunicado não anuncia o voto.

Paulo Raimundo, a 15.10.2026, numa intervenção publicada na página do PCP: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» A intervenção não anuncia o voto.

José Manuel Pureza, do BE, a 08.10.2026, segundo o Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» A notícia relata o voto contra.

Mariana Leitão, da IL, no título de uma entrevista ao ECO a 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, do Livre, a 28.09.2026, antes de a proposta dar entrada, segundo o Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, ministro das Finanças, na audição da comissão de Orçamento a 23.10.2026, segundo a RTP, sobre as previsões das entidades nacionais e internacionais: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, na mesma audição, segundo a RTP, sobre os 300 milhões de euros do combate à fraude nos combustíveis: «são receita do Estado».

Joaquim Miranda Sarmento, na mesma audição, segundo a RTP, sobre as medidas da habitação: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, na mesma audição, segundo o ECO, sobre os juros da dívida: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, na mesma audição, segundo o Observador, na escolha entre o IRS Jovem e o prémio salarial: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### O que as fontes dizem

A UTAO, na apreciação preliminar da proposta, lê um crescimento real do PIB de 2,1 % em 2027, depois de 2,3 % em 2026; um saldo orçamental de 0,0 % do PIB em 2026 e de 0,1 % em 2027, que em contabilidade nacional são 275 milhões de euros; e uma dívida pública de 87,5 % do PIB em 2026 e 84,5 % em 2027, depois de 89,2 % em 2025 na revisão do Eurostat de 21.10.2026.

As medidas já em vigor pesam no saldo de 2027 −5 411 milhões de euros, 1,6 % do PIB. Os juros sobem 23,2 %, para 8,2 mil milhões de euros, e a taxa de juro implícita da dívida passa de 2,4 % para 2,9 %.

As medidas novas valem 79 milhões de euros para o saldo. A maior, do lado da receita, é o combate à fraude nos combustíveis, 300 milhões de euros; a UTAO escreve que a proposta «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» e conta a subexecução entre os riscos.

Sobre o emprego, a UTAO escreve que o crescimento de 1,4 % em 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». Sobre o petróleo, a proposta assume 86,1 dólares por barril em 2027, e a média dos contratos para esse ano, a 16 de outubro, era de 95 dólares, 11 % acima desse pressuposto.

Pela regra europeia da despesa líquida, a Comissão Europeia previa em junho um desvio de 2,1 % do PIB no fim de 2027, acima do valor de referência de 0,6 % do PIB; os dados do Ministério das Finanças dão 0,9 % antes da flexibilidade para a defesa e 0,5 % depois.

O programa da Saúde tem 17 803,1 milhões de euros, −1,4 % face à estimativa de 2026 e 3,0 % sem o PRR: é a conta que o item da Saúde já explica.

### A comparação

As previsões que o ministro diz «perfeitamente alinhadas» e a apreciação da UTAO não dizem o mesmo. A UTAO não contesta o PIB de 2,1 %, mas duvida do emprego, do preço do petróleo e da maior medida de receita, e conta um desvio na despesa líquida que só a flexibilidade para a defesa fecha. Os 300 milhões de euros que o ministro pôs ao lado de «um saldo de 270 milhões» cabem na conta da UTAO: o saldo de 2027 em contabilidade nacional é de 275 milhões de euros, e a medida de que falava custa mais do que ele. A subida dos juros, «risco de mercado e não risco de país» para o ministro, é na proposta mais 23,2 % de despesa em 2027, venha de onde vier. Das posições anunciadas, a que pesa no voto é a do PS: a abstenção na generalidade.

### A conclusão

A proposta chega ao voto com um saldo de 0,1 % do PIB que assenta numa receita de 300 milhões de euros sem base publicada, num emprego que a UTAO não concilia com a imigração e num petróleo cujos contratos para 2027 estavam, a 16 de outubro, 11 % acima do pressuposto da proposta. O que o Parlamento vota a 28.10.2026 é a generalidade; os números da especialidade vêm depois.

### A recomendação

Ao leitor: a apreciação da UTAO está ligada a cada número desta página, e lê-se antes das intervenções do debate. Ao Ministério das Finanças: publicar a base da estimativa dos 300 milhões de euros dos combustíveis, que a UTAO pede. Ao Parlamento: pedir, na especialidade, o quadro da despesa líquida com e sem a flexibilidade para a defesa.

### A opinião do lugar de direção

O ministro tem razão num ponto: a UTAO não contesta o cenário do PIB e o saldo positivo é real. Mas «alinhadas» não descreve uma apreciação que duvida do emprego, do petróleo e da maior medida de receita, e que conta um desvio de despesa que só a regra da defesa fecha. «um frete ao capital e um desastre para o País» não se mede, e este projeto não o avalia. O que se mede diz isto: um orçamento quase equilibrado, assente em pressupostos que a entidade técnica do próprio Parlamento considera frágeis. A 28.10.2026, depois do voto, esta página ganha o registo da votação e as intervenções do Diário da Assembleia, e muda se os números mudarem.


## Transcrição do dist, inglês

The 2027 Budget before the general vote: what the parties and the Government have said so far, next to what the UTAO measures

### As it was said

Comissão Política Nacional do Partido Socialista, on 22.10.2026, on the party's page: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, in its communiqué of 18 and 19 October 2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» The communiqué does not announce the vote.

Paulo Raimundo, on 15.10.2026, in a speech published on the PCP's page: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» The speech does not announce the vote.

José Manuel Pureza, of the BE, on 08.10.2026, as reported by Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» The report says the party votes against.

Mariana Leitão, of the IL, in the title of an interview with ECO on 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, of Livre, on 28.09.2026, before the proposal was tabled, as reported by Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, Finance Minister, at the Budget committee hearing on 23.10.2026, as reported by RTP, on the forecasts of national and international bodies: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, at the same hearing, as reported by RTP, on the 300 million euros from the fight against fuel fraud: «são receita do Estado».

Joaquim Miranda Sarmento, at the same hearing, as reported by RTP, on the housing measures: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, at the same hearing, as reported by ECO, on the interest on the debt: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, at the same hearing, as reported by Observador, on the choice between the youth income tax and the wage premium: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### What the sources say

The UTAO, in its preliminary appraisal of the proposal, reads real GDP growth of 2,1 % in 2027, after 2,3 % in 2026; a budget balance of 0,0 % of GDP in 2026 and 0,1 % in 2027, which in national accounts is 275 million euros; and public debt of 87,5 % of GDP in 2026 and 84,5 % in 2027, after 89,2 % in 2025 in Eurostat's revision of 21.10.2026.

Measures already in force weigh on the 2027 balance by −5 411 million euros, 1,6 % of GDP. Interest rises 23,2 %, to 8,2 billion euros, and the implicit interest rate on the debt moves from 2,4 % to 2,9 %.

New measures are worth 79 million euros to the balance. The largest, on the revenue side, is the fight against fuel fraud, 300 million euros; the UTAO writes that the proposal «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» and counts under-execution among the risks.

On employment, the UTAO writes that growth of 1,4 % in 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». On oil, the proposal assumes 86,1 dollars a barrel in 2027, and the average of the contracts for that year, on 16 October, was 95 dollars, 11 % above that assumption.

Under the European net expenditure rule, the European Commission forecast in June a deviation of 2,1 % of GDP at the end of 2027, above the 0,6 % of GDP reference value; the Finance Ministry's figures give 0,9 % before the defence flexibility and 0,5 % after.

The Health programme has 17 803,1 million euros, −1,4 % against the 2026 estimate and 3,0 % without the recovery plan: it is the account the Health item already explains.

### The comparison

The forecasts the minister calls «perfeitamente alinhadas» and the UTAO's appraisal do not say the same thing. The UTAO does not dispute GDP growth of 2,1 %, but it doubts employment, the oil price and the largest revenue measure, and it counts a net expenditure deviation that only the defence flexibility closes. The 300 million euros the minister set beside «um saldo de 270 milhões» fit the UTAO's account: the 2027 balance in national accounts is 275 million euros, and the measure he spoke of costs more than that. The rise in interest, «risco de mercado e não risco de país» for the minister, is in the proposal 23,2 % more spending in 2027, wherever it comes from. Of the positions announced, the one that weighs on the vote is the PS's: abstention in the general vote.

### The conclusion

The proposal reaches the vote with a balance of 0,1 % of GDP that rests on 300 million euros of revenue with no published basis, on employment the UTAO cannot reconcile with immigration, and on oil whose 2027 contracts were, on 16 October, 11 % above the proposal's assumption. What Parliament votes on 28.10.2026 is the general outline; the figures of the detailed stage come later.

### The recommendation

To the reader: the UTAO's appraisal is linked from every number on this page, and it is worth reading before the speeches. To the Finance Ministry: publish the basis of the 300 million euro fuel estimate, which the UTAO asks for. To Parliament: ask, at the detailed stage, for the net expenditure table with and without the defence flexibility.

### The editorial seat's opinion

The minister is right on one point: the UTAO does not dispute the GDP scenario, and the positive balance is real. But «alinhadas» does not describe an appraisal that doubts employment, oil and the largest revenue measure, and that counts a spending deviation only the defence rule closes. «um frete ao capital e um desastre para o País» cannot be measured, and this project does not judge it. What can be measured says this: a budget close to balance, resting on assumptions that Parliament's own technical unit finds fragile. On 28.10.2026, after the vote, this page gains the voting record and the speeches from the Assembly's Diário, and changes if the numbers change.

---

# OG1-A6

A fase A fica incompleta. A conferência final de língua também terminou com código 1, além da voz; o registo `final-lingua-a6.registo` conserva a recusa e esta passagem não a corrigiu. O item está construído, mas a última conferência da voz termina com código 1: «limiar/threshold» em quatro páginas e «toque em» na recomendação mandatada. A primeira recusa abrange as definições novas; a segunda exige compatibilizar as palavras prescritas com a regra existente. Não foi alterada a frase nem dispensada essa regra. O último build também terminou com código 1, na voz; as omissões de auditoria das famílias, revisão do inventário e identificação da porta foram depois corrigidas e a conferência isolada reduziu a recusa a estas duas palavras. Não houve nova construção depois desses ajustes de auditoria.

O terceiro item foi construído nas duas edições, com as seis partes, onze afirmações individualmente atribuídas e a correção do petróleo: os contratos estavam 11% acima do pressuposto do Ministério das Finanças. O item conserva a Saúde na linha existente de 17 803,1 milhões de euros e o impacto positivo das medidas novas em 79 milhões, com «+79» no excerto da fonte.

## Travessia, formas e provas

A seleção fechada de 33 linhas atravessou com escrita pelo exportador comum. São onze afirmações, vinte medidas numéricas e dois parágrafos da UTAO. As provas seladas e os registos de travessia estão em `ledger/provas/og1a/provas.json`, `ledger/cruzamentos/og1a.json` e `ledger/cruzamentos/og1a-provas.json`. Não foi acrescentada outra linha nem preenchido um novo campo editorial no motor. A ligação das provas ao exportador comum é a alteração funcional do motor.

As quatro correções anteriores continuam verificadas: frase completa do emprego público, frase completa de Paulo Raimundo, junção de «Inovação»; a correção dos valores secundários não tem objeto, porque a pesquisa não contém `secondary_values`. As atribuições são listas e cada afirmação tem o seu parágrafo.

Foram declarados nomes bilingues, famílias, línguas, âmbito nacional e ausência de uma área ministerial exclusiva. O artigo usa fragmentos literais ligados ao campo exato da fonte, com recusa de fragmentos inventados e de cortes numéricos. As datas estão ligadas aos campos do livro. A data da revisão do Eurostat usa `published_at` de `divida-publica-2024`; a hipótese inicial de falta de suporte foi retirada após a releitura. A prova está em `data-a6.json`. Essa linha e o calendário dão apenas contexto de data, não geram ligações temáticas a todas as páginas que os citam.

A porta para a discussão no estudo fica fora do corpo fixo, com título e destino conferidos. Os recibos cuja definição imprime uma medida do item também mostram a porta. A recomendação e a opinião conservam as palavras prescritas. As exceções restritas da voz explicam a referência de navegação, o compromisso editorial datado e os pressupostos do orçamento. O inventário regista as cadeias efetivamente impressas, sem retirar a conferência dos valores e das citações.

## Linhas e recibos novos

- `og1-utao-p15`: [PT](/livro-razao/og1-utao-p15/), [EN](/en/ledger/og1-utao-p15/).
- `og1-utao-p42`: [PT](/livro-razao/og1-utao-p42/), [EN](/en/ledger/og1-utao-p42/).
- `og1-utao-pib-2026`: [PT](/livro-razao/og1-utao-pib-2026/), [EN](/en/ledger/og1-utao-pib-2026/).
- `og1-utao-saldo-2026`: [PT](/livro-razao/og1-utao-saldo-2026/), [EN](/en/ledger/og1-utao-saldo-2026/).
- `og1-utao-politicas-peso`: [PT](/livro-razao/og1-utao-politicas-peso/), [EN](/en/ledger/og1-utao-politicas-peso/).
- `og1-utao-juros-variacao`: [PT](/livro-razao/og1-utao-juros-variacao/), [EN](/en/ledger/og1-utao-juros-variacao/).
- `og1-utao-juros-montante`: [PT](/livro-razao/og1-utao-juros-montante/), [EN](/en/ledger/og1-utao-juros-montante/).
- `og1-utao-taxa-implicita-2026`: [PT](/livro-razao/og1-utao-taxa-implicita-2026/), [EN](/en/ledger/og1-utao-taxa-implicita-2026/).
- `og1-utao-taxa-implicita-2027`: [PT](/livro-razao/og1-utao-taxa-implicita-2027/), [EN](/en/ledger/og1-utao-taxa-implicita-2027/).
- `og1-utao-novas-saldo`: [PT](/livro-razao/og1-utao-novas-saldo/), [EN](/en/ledger/og1-utao-novas-saldo/).
- `og1-utao-despesa-liquida-ce`: [PT](/livro-razao/og1-utao-despesa-liquida-ce/), [EN](/en/ledger/og1-utao-despesa-liquida-ce/).
- `og1-utao-despesa-liquida-limiar`: [PT](/livro-razao/og1-utao-despesa-liquida-limiar/), [EN](/en/ledger/og1-utao-despesa-liquida-limiar/).
- `og1-utao-despesa-liquida-mf-defesa`: [PT](/livro-razao/og1-utao-despesa-liquida-mf-defesa/), [EN](/en/ledger/og1-utao-despesa-liquida-mf-defesa/).
- `og1-utao-despesa-liquida-mf-antes`: [PT](/livro-razao/og1-utao-despesa-liquida-mf-antes/), [EN](/en/ledger/og1-utao-despesa-liquida-mf-antes/).
- `og1-utao-divida-2025-revista`: [PT](/livro-razao/og1-utao-divida-2025-revista/), [EN](/en/ledger/og1-utao-divida-2025-revista/).
- `og1-utao-brent-contratos-2027`: [PT](/livro-razao/og1-utao-brent-contratos-2027/), [EN](/en/ledger/og1-utao-brent-contratos-2027/).
- `og1-utao-brent-mf-2027`: [PT](/livro-razao/og1-utao-brent-mf-2027/), [EN](/en/ledger/og1-utao-brent-mf-2027/).
- `og1-utao-brent-diferenca`: [PT](/livro-razao/og1-utao-brent-diferenca/), [EN](/en/ledger/og1-utao-brent-diferenca/).
- `og1-utao-politicas-saldo`: [PT](/livro-razao/og1-utao-politicas-saldo/), [EN](/en/ledger/og1-utao-politicas-saldo/).
- `og1-utao-saude-variacao`: [PT](/livro-razao/og1-utao-saude-variacao/), [EN](/en/ledger/og1-utao-saude-variacao/).
- `og1-utao-saude-sem-prr`: [PT](/livro-razao/og1-utao-saude-sem-prr/), [EN](/en/ledger/og1-utao-saude-sem-prr/).
- `og1-utao-saldo-me-2027`: [PT](/livro-razao/og1-utao-saldo-me-2027/), [EN](/en/ledger/og1-utao-saldo-me-2027/).
- `og1-ps-abstencao`: [PT](/livro-razao/og1-ps-abstencao/), [EN](/en/ledger/og1-ps-abstencao/).
- `og1-pcp-comite`: [PT](/livro-razao/og1-pcp-comite/), [EN](/en/ledger/og1-pcp-comite/).
- `og1-pcp-raimundo`: [PT](/livro-razao/og1-pcp-raimundo/), [EN](/en/ledger/og1-pcp-raimundo/).
- `og1-be-voto`: [PT](/livro-razao/og1-be-voto/), [EN](/en/ledger/og1-be-voto/).
- `og1-il-prioridades`: [PT](/livro-razao/og1-il-prioridades/), [EN](/en/ledger/og1-il-prioridades/).
- `og1-livre-posicao`: [PT](/livro-razao/og1-livre-posicao/), [EN](/en/ledger/og1-livre-posicao/).
- `og1-governo-rtp-combustiveis`: [PT](/livro-razao/og1-governo-rtp-combustiveis/), [EN](/en/ledger/og1-governo-rtp-combustiveis/).
- `og1-governo-rtp-previsoes`: [PT](/livro-razao/og1-governo-rtp-previsoes/), [EN](/en/ledger/og1-governo-rtp-previsoes/).
- `og1-governo-rtp-habitacao`: [PT](/livro-razao/og1-governo-rtp-habitacao/), [EN](/en/ledger/og1-governo-rtp-habitacao/).
- `og1-governo-eco-juros`: [PT](/livro-razao/og1-governo-eco-juros/), [EN](/en/ledger/og1-governo-eco-juros/).
- `og1-governo-observador-saldo`: [PT](/livro-razao/og1-governo-observador-saldo/), [EN](/en/ledger/og1-governo-observador-saldo/).

## Gémeas existentes usadas

- `oe-2027-cenario-pib-real-crescimento-2027`
- `pm-q3-3-r37-c3`
- `pm-q3-6-r42-c2`
- `pm-q3-6-r42-c3`
- `pm-q2-3-r21-c2`
- `pm-q3-2-r8-c0`
- `oe-2027-saude-despesa-efetiva-consolidada-2027`

## Conferências e limites

Os códigos finais ficam nos ficheiros `*-a6.codigo` e em `medidas.json`. As falhas intermédias ficam nos registos: ajustes de tipos, prova OG1 no verificador, declarações de áreas, línguas e voz, e uma substituição indevida no verificador de HTML que foi corrigida. Duas conferências isoladas coincidiram com a reconstrução do `dist/` e falharam com `ENOENT`; são corridas inválidas, não defeitos de conteúdo. A sequência final da construção volta a exercer essas conferências depois de escrever o HTML.

Não correram portões completos, `core.gate`, navegador ou capturas. A fase B fica prevista para 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário, como o item declara.

## Cabeças, commits e custo

Cabeça inicial do sítio: `35a1471468797c78caf4bb8753b55c389146a5c3`. Motor: `efa5bed719c4e0cc60ffb3d740665495701618aa`. O resultado do commit do sítio será inspecionado e indicado na resposta final.

O motor fica por comitar em `publisher/export_site_rows.py` e `publisher/recortes/manifest.og1a.json`: o escrivão não transmite `OEDP_GATE=adiado`, condição expressa do mandato. Não foi pedido um commit que pudesse correr o gate contra essa condição.

A contagem exata das chamadas não está disponível após a compactação; não se inventa uma medição. As corridas identificáveis pelos registos serão totalizadas em `medidas.json`. `tokens used`: não disponibilizado. Nenhuma delegação.


### Códigos finais da passagem

- `areas-a6`: 0.
- `build-a6`: 1.
- `check-cruzamento-a6`: 0.
- `check-discussao-a6`: 0.
- `check-formas-a6`: 0.
- `check-formato-a6`: 0.
- `check-lingua-a6`: 1.
- `check-lugares-a6`: 0.
- `check-navegacao-a6`: 0.
- `check-nomes-a6`: 0.
- `check-pais-a6`: 0.
- `check-registo-a6`: 0.
- `check-voz-a6`: 1.
- `data-a6`: 0.
- `discussao-a6`: 0.
- `fontes-a6`: 0.
- `ledger-check-a6`: 0.
- `og1-a6`: 0.
- `pesquisa-a6`: 0.
- `sinais-a6`: 0.
- `travessia-a6`: 0.
- `typecheck-a6`: 0.

45 corridas de conferência identificadas pelos registos, com o critério de contagem em `medidas.json`; duas gerações. Quatro tentativas de construção incluídas nessa conta. Zero corridas inteiras dos portões. A contagem total de chamadas de ferramentas não foi preservada com exatidão na compactação: `[verify]`, sem a apresentar como medição.

O commit desta passagem guarda apenas este relatório e os seus artefactos. A implementação do sítio fica por comitar, listada em `medidas.json`, porque a voz está vermelha. As duas alterações do motor também ficam por comitar.

## Transcrição do dist, português

O Orçamento de 2027 antes do voto na generalidade: o que os partidos e o Governo já disseram, ao lado do que a UTAO mede

### Como foi dito

Comissão Política Nacional do Partido Socialista, a 22.10.2026, na página do partido: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, no comunicado de 18 e 19 de outubro de 2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» O comunicado não anuncia o voto.

Paulo Raimundo, a 15.10.2026, numa intervenção publicada na página do PCP: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» A intervenção não anuncia o voto.

José Manuel Pureza, do BE, a 08.10.2026, segundo o Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» A notícia relata o voto contra.

Mariana Leitão, da IL, no título de uma entrevista ao ECO a 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, do Livre, a 28.09.2026, antes de a proposta dar entrada, segundo o Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, ministro das Finanças, na audição da comissão de Orçamento a 23.10.2026, segundo a RTP, sobre as previsões das entidades nacionais e internacionais: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, na mesma audição, segundo a RTP, sobre os 300 milhões de euros do combate à fraude nos combustíveis: «são receita do Estado».

Joaquim Miranda Sarmento, na mesma audição, segundo a RTP, sobre as medidas da habitação: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, na mesma audição, segundo o ECO, sobre os juros da dívida: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, na mesma audição, segundo o Observador, na escolha entre o IRS Jovem e o prémio salarial: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### O que as fontes dizem

A UTAO, na apreciação preliminar da proposta, lê um crescimento real do PIB de 2,1 % em 2027, depois de 2,3 % em 2026; um saldo orçamental de 0,0 % do PIB em 2026 e de 0,1 % em 2027, que em contabilidade nacional são 275 milhões de euros; e uma dívida pública de 87,5 % do PIB em 2026 e 84,5 % em 2027, depois de 89,2 % em 2025 na revisão do Eurostat de 21.10.2026.

As medidas já em vigor pesam no saldo de 2027 −5 411 milhões de euros, 1,6 % do PIB. Os juros sobem 23,2 %, para 8,2 mil milhões de euros, e a taxa de juro implícita da dívida passa de 2,4 % para 2,9 %.

As medidas novas valem 79 milhões de euros para o saldo. A maior, do lado da receita, é o combate à fraude nos combustíveis, 300 milhões de euros; a UTAO escreve que a proposta «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» e conta a subexecução entre os riscos.

Sobre o emprego, a UTAO escreve que o crescimento de 1,4 % em 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». Sobre o petróleo, a proposta assume 86,1 dólares por barril em 2027, e a média dos contratos para esse ano, a 16 de outubro, era de 95 dólares, 11 % acima desse pressuposto.

Pela regra europeia da despesa líquida, a Comissão Europeia previa em junho um desvio de 2,1 % do PIB no fim de 2027, acima do limiar de 0,6 % do PIB; os dados do Ministério das Finanças dão 0,9 % antes da flexibilidade para a defesa e 0,5 % depois.

O programa da Saúde tem 17 803,1 milhões de euros, −1,4 % face à estimativa de 2026 e 3,0 % sem o PRR: é a conta que o item da Saúde já explica.

### A comparação

As previsões que o ministro diz «perfeitamente alinhadas» e a apreciação da UTAO não dizem o mesmo. A UTAO não contesta o PIB de 2,1 %, mas duvida do emprego, do preço do petróleo e da maior medida de receita, e conta um desvio na despesa líquida que só a flexibilidade para a defesa fecha. Os 300 milhões de euros que o ministro pôs ao lado de «um saldo de 270 milhões» cabem na conta da UTAO: o saldo de 2027 em contabilidade nacional é de 275 milhões de euros, e a medida de que falava custa mais do que ele. A subida dos juros, «risco de mercado e não risco de país» para o ministro, é na proposta mais 23,2 % de despesa em 2027, venha de onde vier. Das posições anunciadas, a que pesa no voto é a do PS: a abstenção na generalidade.

### A conclusão

A proposta chega ao voto com um saldo de 0,1 % do PIB que assenta numa receita de 300 milhões de euros sem base publicada, num emprego que a UTAO não concilia com a imigração e num petróleo cujos contratos para 2027 estavam, a 16 de outubro, 11 % acima do pressuposto da proposta. O que o Parlamento vota a 28.10.2026 é a generalidade; os números da especialidade vêm depois.

### A recomendação

Ao leitor: a apreciação da UTAO está a um toque em cada número desta página, e lê-se antes das intervenções do debate. Ao Ministério das Finanças: publicar a base da estimativa dos 300 milhões de euros dos combustíveis, que a UTAO pede. Ao Parlamento: pedir, na especialidade, o quadro da despesa líquida com e sem a flexibilidade para a defesa.

### A opinião do lugar de direção

O ministro tem razão num ponto: a UTAO não contesta o cenário do PIB e o saldo positivo é real. Mas «alinhadas» não descreve uma apreciação que duvida do emprego, do petróleo e da maior medida de receita, e que conta um desvio de despesa que só a regra da defesa fecha. «um frete ao capital e um desastre para o País» não se mede, e este projeto não o avalia. O que se mede diz isto: um orçamento quase equilibrado, assente em pressupostos que a entidade técnica do próprio Parlamento considera frágeis. A 28.10.2026, depois do voto, esta página ganha o registo da votação e as intervenções do Diário da Assembleia, e muda se os números mudarem.


## Transcrição do dist, inglês

The 2027 Budget before the general vote: what the parties and the Government have said so far, next to what the UTAO measures

### As it was said

Comissão Política Nacional do Partido Socialista, on 22.10.2026, on the party's page: «viabilizar o Orçamento do Estado para 2027 mediante a abstenção na votação na generalidade do documento».

Comité Central do PCP, in its communiqué of 18 and 19 October 2026: «O Orçamento do Estado para 2027 é um frete ao capital e um desastre para o País.» The communiqué does not announce the vote.

Paulo Raimundo, on 15.10.2026, in a speech published on the PCP's page: «Sim, está em curso, de facto, um assalto às nossas vidas, um assalto aos nossos direitos, um assalto a Abril, um assalto ao Estado e aos recursos públicos, que são nossos, e o Orçamento do Estado é um instrumento deste assalto em curso, é um frete ao capital e um desastre para o País.» The speech does not announce the vote.

José Manuel Pureza, of the BE, on 08.10.2026, as reported by Diário de Notícias: «Nós não hesitamos. Nós não assinamos o cheque da má governação de Luís Montenegro» The report says the party votes against.

Mariana Leitão, of the IL, in the title of an interview with ECO on 06.10.2026: «A prioridade é baixar o IRS e o ISP».

Isabel Mendes Lopes, of Livre, on 28.09.2026, before the proposal was tabled, as reported by Correio da Manhã: «dificilmente o acompanharemos, como é óbvio».

Joaquim Miranda Sarmento, Finance Minister, at the Budget committee hearing on 23.10.2026, as reported by RTP, on the forecasts of national and international bodies: «estão perfeitamente alinhadas com as previsões do Governo, têm diferenças muito pequenas».

Joaquim Miranda Sarmento, at the same hearing, as reported by RTP, on the 300 million euros from the fight against fuel fraud: «são receita do Estado».

Joaquim Miranda Sarmento, at the same hearing, as reported by RTP, on the housing measures: «foi praticamente tudo feito».

Joaquim Miranda Sarmento, at the same hearing, as reported by ECO, on the interest on the debt: «a nossa subida das taxas de juro é risco de mercado e não risco de país».

Joaquim Miranda Sarmento, at the same hearing, as reported by Observador, on the choice between the youth income tax and the wage premium: «esta é uma medida que custa 300 milhões no próximo ano, para um saldo de 270 milhões».

### What the sources say

The UTAO, in its preliminary appraisal of the proposal, reads real GDP growth of 2,1 % in 2027, after 2,3 % in 2026; a budget balance of 0,0 % of GDP in 2026 and 0,1 % in 2027, which in national accounts is 275 million euros; and public debt of 87,5 % of GDP in 2026 and 84,5 % in 2027, after 89,2 % in 2025 in Eurostat's revision of 21.10.2026.

Measures already in force weigh on the 2027 balance by −5 411 million euros, 1,6 % of GDP. Interest rises 23,2 %, to 8,2 billion euros, and the implicit interest rate on the debt moves from 2,4 % to 2,9 %.

New measures are worth 79 million euros to the balance. The largest, on the revenue side, is the fight against fuel fraud, 300 million euros; the UTAO writes that the proposal «não disponibiliza informação suficientemente detalhada sobre o seu conteúdo» and counts under-execution among the risks.

On employment, the UTAO writes that growth of 1,4 % in 2027 «é difícil de conciliar com o abrandamento recente da imigração líquida». On oil, the proposal assumes 86,1 dollars a barrel in 2027, and the average of the contracts for that year, on 16 October, was 95 dollars, 11 % above that assumption.

Under the European net expenditure rule, the European Commission forecast in June a deviation of 2,1 % of GDP at the end of 2027, above the 0,6 % of GDP threshold; the Finance Ministry's figures give 0,9 % before the defence flexibility and 0,5 % after.

The Health programme has 17 803,1 million euros, −1,4 % against the 2026 estimate and 3,0 % without the recovery plan: it is the account the Health item already explains.

### The comparison

The forecasts the minister calls «perfeitamente alinhadas» and the UTAO's appraisal do not say the same thing. The UTAO does not dispute GDP growth of 2,1 %, but it doubts employment, the oil price and the largest revenue measure, and it counts a net expenditure deviation that only the defence flexibility closes. The 300 million euros the minister set beside «um saldo de 270 milhões» fit the UTAO's account: the 2027 balance in national accounts is 275 million euros, and the measure he spoke of costs more than that. The rise in interest, «risco de mercado e não risco de país» for the minister, is in the proposal 23,2 % more spending in 2027, wherever it comes from. Of the positions announced, the one that weighs on the vote is the PS's: abstention in the general vote.

### The conclusion

The proposal reaches the vote with a balance of 0,1 % of GDP that rests on 300 million euros of revenue with no published basis, on employment the UTAO cannot reconcile with immigration, and on oil whose 2027 contracts were, on 16 October, 11 % above the proposal's assumption. What Parliament votes on 28.10.2026 is the general outline; the figures of the detailed stage come later.

### The recommendation

To the reader: the UTAO's appraisal is one tap away from every number on this page, and it is worth reading before the speeches. To the Finance Ministry: publish the basis of the 300 million euro fuel estimate, which the UTAO asks for. To Parliament: ask, at the detailed stage, for the net expenditure table with and without the defence flexibility.

### The editorial seat's opinion

The minister is right on one point: the UTAO does not dispute the GDP scenario, and the positive balance is real. But «alinhadas» does not describe an appraisal that doubts employment, oil and the largest revenue measure, and that counts a spending deviation only the defence rule closes. «um frete ao capital e um desastre para o País» cannot be measured, and this project does not judge it. What can be measured says this: a budget close to balance, resting on assumptions that Parliament's own technical unit finds fragile. On 28.10.2026, after the vote, this page gains the voting record and the speeches from the Assembly's Diário, and changes if the numbers change.

---

# OG1-A5

A seleção fechada das 33 linhas foi preparada e aceite pelo exportador comum, sem escrita no sítio. A fase A continua por construir porque a releitura do §99 da UTAO confirmou uma divergência de conteúdo nas frases mandatadas sobre o petróleo. Não é uma recusa de proveniência nem um campo em falta.

## A divergência e a decisão pendente

A fonte alojada, na página física 52 (51 impressa), diz: «a média dos contratos de 2027 era de cerca de 95 USD, 11% acima dos 86,1 USD assumidos pelo MF». O mandato original escreve, na quarta frase de «O que as fontes dizem», «11 % abaixo dos contratos para esse ano» e, na conclusão, «um petróleo 11 % mais barato do que os contratos». As versões inglesas fazem a mesma inversão.

A percentagem tem bases diferentes nas duas relações: estar 11% acima não equivale a estar 11% abaixo quando se troca a base. `petroleo-a5.json` guarda a frase extraída do corpo, o recibo e o SHA-256, as três linhas numéricas e a demonstração aritmética dessa mudança de base. A fonte diz «cerca de 95»; a demonstração não pretende recalcular a medição da UTAO nem substituir os seus valores.

O §0 da OG1-A4 autoriza mudanças de forma sem mudar as palavras do lugar de direção, mas manda parar pelo conteúdo. Corrigir a relação percentual mudaria o conteúdo de duas frases nas duas línguas. Foi pedida essa decisão, sem resposta à data desta escrita. Não se alterou a redação, a fonte ou o número para fazer passar a conferência.

A proposta concreta para continuação é atribuir à UTAO que os contratos estão 11% acima do pressuposto da proposta, tanto na frase das fontes como na conclusão. Esta é uma proposta de correção, não uma transcrição do `dist/`.

## A seleção e os recibos

`publisher/og1a_export.py` passa de doze para dois parágrafos textuais da UTAO: `og1-utao-p15` e `og1-utao-p42`. Mantém as vinte linhas numéricas e as onze afirmações do mandato A5. O manifesto e as provas foram regenerados. A comparação com a cabeça inicial confirma dez linhas retiradas da seleção, nenhuma acrescentada e nenhuma alteração nos campos das 33 linhas retidas. As linhas retiradas permanecem no livro da pesquisa.

`conferir-petroleo-a5.py` verifica também a igualdade exata entre o manifesto e a lista fechada de 33 identificadores, independentemente das constantes do gerador. A lista completa está em `medidas-a5.json`, em `selecao_preparada`. Os recibos preparados permanecem em `publisher/recortes/og1a/provas.json`, no motor. O exportador aceitou as 33 linhas sem acrescentar entidades publicadoras ou outros campos. O Eurostat e as linhas auxiliares não fazem parte desta seleção.

Não houve travessia com `--write`, novas linhas ou novos recibos no sítio. Não se retirou uma travessia já escrita. A seleção está preparada, mas não se apresenta como entrega publicada.

## Códigos

| Corrida | Código | Resultado |
| --- | --- | --- |
| Preparação, `preparar-a5` | 0 | 33 linhas e provas geradas |
| Exportador comum, `travessia-a5` | 0 | 33 linhas aceites, sem escrita |
| `publisher.oe2027_generalidade_test`, `pesquisa-a5` | 0 | 85 controlos |
| Conferência da seleção e do petróleo, `petroleo-a5` | 1 | Seleção exata; divergência de conteúdo confirmada |

O último código é uma recusa de conteúdo documentada pelo construtor, com prova reproduzível da fonte e da aritmética. Não é uma recusa do exportador nem uma régua preexistente do sítio. Três corridas de conferências e uma geração. Nenhuma corrida inteira de portões, nenhum `core.gate` e nenhuma captura. `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram; os seus códigos são `null`, não sucesso presumido.

## Item, correções e trabalho por fazer

Não existe terceiro item construído no `dist/`, pelo que não há seis partes desta passagem para transcrever em português ou inglês. Não se apresenta a prosa do mandato como saída construída. Não foram alterados nomes, famílias, lugares ou auditorias.

O ensaio da pesquisa voltou a conferir a frase completa do emprego público, a frase completa de Paulo Raimundo, a junção de «Inovação», as atribuições em lista e o valor 79 com o sinal positivo no excerto. A quarta correção continua sem objeto: não há `secondary_values` na pesquisa. A Saúde permanece resolvida conforme a OG1-A3: o item deve usar 17 803,1 milhões da linha do sítio; a linha da UTAO com 17 803 milhões fica na pesquisa, por não integrar a seleção fechada da OG1-A5.

Ficam por fazer a decisão sobre as duas frases do petróleo, a travessia com escrita, o item bilingue, nomes, famílias, lugares, recibos públicos, auditorias, conferências do sítio e transcrição do `dist/`. A fase B continua prevista para a noite de 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário. Esta promessa ainda não entrou num terceiro item construído.

## Cabeças, commits e custo

Cabeça inicial do sítio: `842bc8ee25dc1df3722ae4794b26ef5397ad1d47`. Cabeça do motor: `853e079cb5e4fed760e84223e88f0f39f3099209`. O motor fica com três ficheiros por comitar:

- `publisher/og1a_export.py`
- `publisher/manifest.og1a.json`
- `publisher/recortes/og1a/provas.json`

O mandato exige `OEDP_GATE=adiado`, mas o `comitar.sh` não transmite essa variável e ela não está definida no ambiente desta passagem. Não se pediu um commit sem poder garantir o adiamento. O commit do sítio guarda apenas o relatório, o ensaio da divergência, os códigos, os registos sanitizados e as medidas. A cabeça resultante será indicada na resposta final.

15 chamadas de ferramentas até à conferência do relatório; o commit e a inspeção final entram na contagem final da resposta. Três corridas de conferências, uma geração, nenhuma delegação. `tokens used`: não disponibilizado nesta passagem. `medidas.json` preserva a medição anterior em `historico_antes_og1_a5`.

---

# OG1-A4

A fase A continua por construir. A paragem desta passagem é uma recusa de proveniência na tentativa de sustentar a data da revisão do Eurostat, na primeira frase de «O que as fontes dizem». A linha `og1-eurostat-portugal-2025` existe no motor, mas não declara uma entidade publicadora que o exportador reconheça. O ensaio isolado, sem escrita e com `source: Eurostat`, devolveu:

> og1-eurostat-portugal-2025: source 'Eurostat' names no entity the engine row stands behind (none)

O §2 do mandato original inclui uma régua que protege uma fonte entre as paragens. Esta recusa não é a forma de uma atribuição já presente: falta a declaração da entidade no motor. Não se acrescentou uma atribuição à pesquisa nem se mudou a régua. Esta constatação limita-se ao caminho de exportação ensaiado; não prova que não exista outra forma de sustentar a data.

## O que correu e o erro do construtor

A separação em onze parágrafos da OG1-A4 não foi recusada nem implementada. A leitura do mecanismo mostrou ainda a necessidade de ligar datas e fragmentos aos seus campos. A seleção anterior tinha quarenta e três linhas e não incluía `og1-utao-saude-programa`, expressamente pedida na OG1-A3. Foi preparada uma seleção com essa linha e, para as datas, duas linhas auxiliares, `og1-agenda-votacoes-28` e `og1-eurostat-portugal-2025`.

A primeira tentativa tinha um erro do construtor: o valor por omissão de `source` escreveu «Assembleia da República» na linha do Eurostat. A recusa inicial não demonstra um problema com os valores da pesquisa. O ensaio isolado posterior corrigiu esse campo para «Eurostat» e confirmou que o motor não declara qualquer entidade para essa linha. Não se apresenta a primeira tentativa como prova suficiente da paragem.

Retiradas as duas linhas auxiliares, a seleção principal de quarenta e quatro linhas atravessou com código zero. A ligação das provas ao exportador também foi ensaiada. Essa escrita ocorreu antes do ensaio isolado final. Depois da recusa de proveniência, todas as quarenta e quatro linhas, os dois registos de travessia e a prova criados no sítio foram retirados. As quatro alterações do motor foram repostas byte a byte na cabeça inicial. Não fica uma exportação incompleta apresentada como entrega verificada. Os identificadores da travessia retirada estão em `medidas-a4.json`.

## Códigos

| Corrida | Código |
| --- | --- |
| Preparação da seleção ampliada, `preparar-a4` | 0 |
| Travessia ampliada, `travessia-ampliada-a4` | 1 |
| Preparação da seleção principal, `preparar-44-a4` | 0 |
| Travessia principal, `travessia-44-a4` | 0, escrita retirada |
| Ensaio isolado com publicador Eurostat, `eurostat-a4` | 1 |

Três corridas do exportador e duas gerações da seleção. Não correram o ensaio da pesquisa, `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck`, `check:cruzamento` ou `core.gate`; os códigos são `null`, não sucesso presumido. Nenhuma corrida inteira de portões e nenhuma captura. `manifest-eurostat-a4.json` conserva o pedido isolado sem caminhos locais; pode ser passado ao exportador com `--manifest`, o sítio em `--site` e sem `--write`.

## Item, correções e continuação

Não há terceiro item construído no `dist/`, pelo que não existem seis partes desta passagem para transcrever em português ou inglês. Nenhuma alteração de forma foi aplicada à prosa, frase a frase ou de outro modo. Não há novos nomes, famílias, lugares ou recibos entregues. Não se apresenta a prosa do mandato como saída construída.

As correções anteriores permanecem na cabeça inicial do motor, incluindo o valor 79, com o sinal positivo no excerto, e a frase completa de Paulo Raimundo. A quarta correção continua sem objeto, conforme a OG1-A2. A diferença da Saúde continua resolvida: o item deve usar os 17 803,1 milhões da linha existente, enquanto a linha da UTAO conserva 17 803 milhões. Não houve nova alteração destes conteúdos.

Fica por resolver a proveniência da linha auxiliar do Eurostat ou autorizar outro caminho verificado para a data. Ficam por fazer a travessia definitiva, o item com as seis partes nas duas edições, os nomes, as famílias, os lugares, os recibos, as auditorias, as conferências e a transcrição do `dist/`. A fase B continua prevista para a noite de 28.10.2026, depois do voto; essa promessa ainda não entrou num terceiro item construído.

## Cabeças, commit e custo

Cabeça inicial do sítio: `a8bbcad262a61a4244abc931cb383ccc246a01ba`. Cabeça do motor: `5965102dd460815c92c777d06e3e8f755944cd1b`. O motor não tem alterações desta passagem por comitar. O commit do sítio guarda apenas o relatório, os códigos, os registos sanitizados, o manifesto do ensaio isolado e as medidas.

34 chamadas de ferramentas até esta escrita, incluindo-a. Três corridas de conferências, duas gerações, nenhuma delegação. O commit e a inspeção final entram na contagem final da resposta. `tokens used`: 2510492 no último evento de utilização consultado antes desta escrita; não é a contagem final do lançador. `medidas.json` preserva a medição anterior em `historico_antes_og1_a4`.

---

# OG1-A3

A fase A continua por construir. A paragem desta passagem é a atribuição conjunta da sexta frase de «Como foi dito»: o mandato escreve o nome do ministro uma vez para cinco citações, mas a régua de `tests/discussao/itens.mjs`, linha 112, exige exatamente um token `attributed_to` por afirmação e por língua. O §2 manda parar quando uma régua protege uma pessoa. Não se alterou essa régua nem se repetiu o nome na prosa mandatada para a contornar.

## Prova da incompatibilidade

`conferir-atribuicao-a3.mjs` chama a função real `conferirDeclaracoes`. Primeiro confere os dois itens existentes: zero erros. Depois acrescenta, apenas em memória, um candidato que isola a sexta frase nas duas línguas, com as cinco citações e um token de atribuição, ligado à primeira. As cinco linhas vêm do livro do motor e o ensaio confirma que todas são afirmações atribuídas a «Joaquim Miranda Sarmento». Isto não simula nem certifica uma travessia.

Resultado: oito ocorrências de `V2B atribuição: falta o token da afirmação`, quatro por língua. As quatro linhas sem token próprio são `og1-governo-rtp-combustiveis`, `og1-governo-rtp-habitacao`, `og1-governo-eco-juros` e `og1-governo-observador-saldo`. O controlo acrescenta os quatro tokens em memória em cada língua e as queixas de atribuição desaparecem. Esse controlo repetiria o nome; não é a redação autorizada e não foi aplicado ao sítio.

O candidato isolado também produz duas queixas esperadas: a lista da conferência só conhece os dois itens anteriores e o candidato ainda não tem auditoria de palavras. Essas duas queixas não motivam a paragem, nem se apresenta o ensaio como uma conferência do item completo. `atribuicao-a3.json` guarda todos os erros, o candidato, o controlo e o resumo criptográfico da régua intacta.

## Saúde e correções anteriores

A diferença entre 17 803 milhões na UTAO e 17 803,1 milhões no sítio está resolvida pelo mandato OG1-A3 e não motivou esta paragem. O item deverá usar `oe-2027-saude-despesa-efetiva-consolidada-2027`; `og1-utao-saude-programa` deverá atravessar como linha da UTAO com recibo próprio. Nenhuma delas mudou nesta passagem.

A cabeça inicial do motor já contém as correções anteriores e a linha `og1-utao-novas-saldo` com valor 79. A quarta correção continua sem objeto, conforme a decisão OG1-A2. Não se repetiu a geração nem o ensaio da pesquisa, e não se declara uma nova verificação dos seus corpos nesta passagem.

## Códigos, item e trabalho por fazer

| Corrida desta passagem | Código |
| --- | --- |
| Ensaio isolado da atribuição, `atribuicao-a3.codigo` | 1, recusa confirmada |

Uma corrida de conferência, com base, candidato e controlo em memória. Nenhuma geração, corrida inteira de portões, captura ou `core.gate`. A travessia, o ensaio da pesquisa, `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram; os seus códigos são `null` em `medidas-a3.json`. `medidas.json` conserva a medição OG1-A2 e o seu histórico.

Não houve travessia com escrita, linhas novas ou recibos públicos novos. Não se alteraram `src/data/discussao.mjs`, nomes, famílias, lugares ou réguas. Não existe terceiro item construído no `dist/`, pelo que não há seis partes novas para transcrever em português ou inglês. A frase do mandato não é apresentada como saída construída.

Ficam por fazer a compatibilização autorizada entre a atribuição conjunta e a exigência de um token por afirmação, a travessia, o item bilingue, nomes, famílias, lugares, recibos e as conferências do §1.3. A fase B continua prevista para a noite de 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário; essa promessa ainda não entrou numa página construída.

## Cabeças, commit e custo

Cabeça inicial do sítio: `9ebd19bc232365ac7c8d0b14c8a3b2db5fec927a`. Cabeça do motor: `5965102dd460815c92c777d06e3e8f755944cd1b`. O motor está limpo e não tem ficheiros desta passagem por comitar. O commit do sítio pelo escrivão guarda apenas o ensaio, as medidas e este relatório. A cabeça resultante consta da resposta final.

20 chamadas de ferramentas até escrever este relatório, incluindo esta escrita. Uma corrida de conferência. As inspeções e o commit posteriores entram na contagem final da resposta. Nenhuma delegação. `tokens used`: não disponibilizado nesta passagem; o lançador mede os pontos.

---

# OG1-A2

A correção de `+79` está feita e verificada no motor. A continuação para perante a gémea da Saúde, conforme o §2: `og1-utao-saude-programa` contém **17 803 milhões de euros** e `oe-2027-saude-despesa-efetiva-consolidada-2027` contém **17 803,1 milhões de euros**. A comparação foi refeita contra os ficheiros atuais; `gemeas-a2.json` guarda os valores, o localizador e o resumo criptográfico do ficheiro do sítio. As outras oito correspondências do §0.5 coincidem numericamente.

O mesmo §2 manda parar perante uma diferença e, entre parênteses, manda usar a linha do sítio com nota. Foi pedida clarificação dessa contradição. Sem resposta, não se toma a diferença como uma autorização para continuar. A continuação deverá usar a linha existente do sítio e explicitar a diferença de precisão, se o lugar de direção confirmar que esta gémea não impede a construção.

## Correção e ensaios

O seletor passa a ler `79`, em `milhões de euros`. O gerador conserva o nome português «impacto das novas medidas de política orçamental no saldo de 2027, a favor do saldo» e o inglês «impact of new fiscal policy measures on the 2027 balance, in favour of the balance». O excerto conserva `+79 M€ (+0,02% do PIB)`. A quinta correção e a razão constam de `correcoes-2026-10-26.json`. Só esta linha do livro mudou, nos campos `value`, `name`, `name_en` e `note`; nenhuma fonte ou régua do exportador mudou. O recibo da fonte foi relido e a prova da travessia foi regenerada.

O ensaio da pesquisa passou com **85 controlos**. O ensaio do exportador comum passou para as **43 linhas preparadas**, sem escrever no sítio. O `-5 411` e o `-1,4` presentes nesta seleção foram aceites. Os restantes valores negativos indicados no mandato não pertencem à seleção; não se declara que atravessaram. Não há outro valor numérico com sinal positivo nos seletores da pesquisa.

A quarta correção continua sem objeto: não existem `secondary_values` na pesquisa. As três correções anteriores e a regularização das atribuições permanecem na cabeça inicial do motor.

| Corrida desta passagem | Código |
| --- | --- |
| Gerador da pesquisa | 0 |
| `publisher.oe2027_generalidade_test --record` | 0 |
| Gerador do relatório do motor | 0 |
| Preparação das provas para a travessia | 0 |
| Exportador comum, sem `--write` | 0 |
| Comparação das nove gémeas do §0.5 | 1, Saúde diferente |

Os códigos e registos têm o sufixo `-a2`. `medidas.json` conserva a medição anterior em `historico_og1_a`; `medidas-a2.json` contém apenas esta passagem. As conferências do sítio não correram, porque o conteúdo do sítio não foi alterado: `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` estão a `null`. Nenhuma corrida inteira de portões, nenhum `core.gate` e nenhuma captura.

## Item, linhas e recibos

Não houve travessia com escrita. Não há linhas novas, recibos públicos novos ou terceiro item em `src/data/discussao.mjs`. Por isso não há seis partes novas do `dist/` para transcrever, em nenhuma das edições. Não se apresenta a prosa do mandato como se tivesse sido construída. A promessa da fase B, na noite de 28.10.2026, continua no mandato e terá de entrar no último parágrafo da opinião quando o item for construído.

## Commits e trabalho por fazer

Cabeça inicial do sítio: `ede946972550b49186be7b3beee0487643e47219`. Cabeça do motor: `df277a39f3c295972315d754a40a269023b6a268`.

O motor fica por comitar: o `comitar.sh` não transmite `OEDP_GATE=adiado`, e o escrivão não lê essa opção do pedido. A variável também não está definida no ambiente desta passagem. Não se lançou um commit sem poder garantir o adiamento exigido pelo mandato. Ficheiros por comitar:

- `content/30 Orcamento 2027 Generalidade/LEIA-ME.md`
- `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`
- `content/30 Orcamento 2027 Generalidade/extracoes.json`
- `content/30 Orcamento 2027 Generalidade/ledger.json`
- `content/30 Orcamento 2027 Generalidade/verificacao.json`
- `publisher/oe2027_generalidade.py`
- `publisher/oe2027_generalidade_test.py`
- `publisher/recortes/og1a/provas.json`

O commit do sítio guarda o relatório e as provas desta paragem. Ficam por fazer a travessia com escrita, o item bilingue, os nomes, as famílias, os lugares, os recibos públicos, as conferências do sítio e a transcrição do `dist/`.

## Custo desta passagem

17 chamadas de ferramentas até escrever este relatório, incluindo o pedido de clarificação; o commit e a inspeção final são posteriores. Três corridas de conferências (ensaio da pesquisa, ensaio do exportador e comparação das gémeas) e três gerações. Nenhuma delegação. `tokens used`: não disponibilizado nesta passagem; os pontos são medidos pelo lançador.

---

# OG1-A: paragem na travessia

A fase A não foi construída. O exportador comum recusou o valor `+79` da linha `og1-utao-novas-saldo`: `cannot read '+79' as a number`. O §2 do mandato exige parar quando uma régua protege um número. Não se retirou o sinal, não se mudou o valor nem se alterou a régua.

O excerto confirmado no §40 da UTAO diz: «O MF prevê que em 2027 as novas medidas de política orçamental tenham um impacto residual no saldo orçamental avaliado em +79 M€ (+0,02% do PIB).» A recusa está em `travessia.registo` e o código em `travessia.codigo`.

## Estado do item e das linhas

O sítio conserva os itens `saude-no-orcamento` e `parcerias-rodoviarias`. Não existe um terceiro item construído nesta passagem. Não houve exportação, novos recibos públicos nem alteração de `src/data/discussao.mjs`. Por isso não há seis partes novas para transcrever do `dist/`, em português ou em inglês.

A preparação selecionou 43 linhas com provas, em `publisher/manifest.og1a.json` e `publisher/recortes/og1a/provas.json`, no motor. `medidas.json` lista os identificadores. São preparação bloqueada, não linhas publicadas. O módulo `publisher.og1a_export` permite reproduzir a preparação; o ensaio recusado foi `python3 -m publisher.export_site_rows --manifest publisher/manifest.og1a.json --site <worktree>`, sem `--write`.

As gémeas previstas no mandato não chegaram a ser usadas pelo item: `pm-q3-3-r37-c3`, `pm-q3-6-r42-c2`, `pm-q3-6-r42-c3`, `oe-2027-cenario-pib-real-crescimento-2027`, `pm-q2-3-r21-c2`, `oe-2027-saude-despesa-efetiva-consolidada-2027` e `pm-q3-2-r8-c0`. A linha existente da Saúde contém 17 803,1 milhões de euros; a pesquisa da UTAO arredonda para 17 803. Um token ligado à linha existente deverá conservar a precisão dessa linha.

## Correções de 26.10

1. `og1-utao-p102` e `og1-utao-emprego-publico-2027`: reextraída a primeira frase completa do §102 na página física 53 do PDF, com o parêntesis e a conclusão sobre o crescimento líquido a partir de junho.
2. `og1-pcp-raimundo`: reextraída a frase inteira da página alojada, desde «Sim, está em curso, de facto,» até «País.».
3. A extração junta «Inovação» antes de conferir os seletores da Tabela 14. Os seletores e o livro foram regenerados; a planta com a palavra partida é recusada.
4. A quarta correção indicada no mandato não tem objeto nesta cabeça: não foram encontrados `og1-eurostat-divida-2025`, `eurostat-pde-2026-10-21` ou `secondary_values` na pesquisa. Existe `og1-eurostat-portugal-2025`, com a tabela nacional. Não se inventou uma correção nem se acrescentaram os valores secundários mencionados no mandato.

A preparação também corrigiu a forma de `attributed_to`: lista com o mesmo nome completo, em vez de texto que o exportador interpretava letra a letra. São 30 atribuições formatadas, seis excertos corrigidos e 34 linhas alteradas no total. Nenhum valor numérico foi alterado. Os corpos e os seus resumos criptográficos permanecem iguais; os recibos de fonte foram relidos. O inventário por linha está em `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`, no motor, e copiado em `medidas.json`.

## Conferências

| Corrida | Código | Resultado |
| --- | --- | --- |
| `publisher.oe2027_generalidade_test`, inicial | 0 | 82 controlos |
| Ensaio do exportador comum | 1 | Recusa de `+79`; nada escrito no sítio |
| `publisher.oe2027_generalidade` | 0 | Livro reproduzido e manifesto das fontes conferido |
| `publisher.oe2027_generalidade_test --record`, final | 0 | 83 controlos |

`build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram: a travessia parou antes de alterar o conteúdo do sítio. `core.gate` não correu. Nenhuma corrida inteira de portões e nenhuma captura. Os códigos ausentes são `null` em `medidas.json`, nunca sucesso presumido.

## Commits e continuação

O motor fica por comitar. O `comitar.sh` disponível transmite apenas mensagem, ficheiros e raiz, sem transmitir `OEDP_GATE=adiado`. A variável não está definida nesta passagem. Não foi possível confirmar a variável do processo do escrivão: a sandbox devolveu `PermissionError: [Errno 1] Operation not permitted: 'ps'`. Não se pediu escalada nem se lançou um commit que pudesse correr o portão contra a condição do mandato.

Ficheiros do motor por comitar:

- `content/30 Orcamento 2027 Generalidade/LEIA-ME.md`
- `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`
- `content/30 Orcamento 2027 Generalidade/extracoes.json`
- `content/30 Orcamento 2027 Generalidade/ledger.json`
- `content/30 Orcamento 2027 Generalidade/verificacao.json`
- `publisher/manifest.og1a.json`
- `publisher/oe2027_generalidade.py`
- `publisher/oe2027_generalidade_report.py`
- `publisher/oe2027_generalidade_test.py`
- `publisher/og1a_export.py`
- `publisher/recortes/og1a/provas.json`

Cabeça do motor: `82d39267518a6fe4bb156108016df3042b2b85d5`. Cabeça inicial do sítio: `8ee8b7105156e783d2dca5ea825ac5d75dc6cbd9`. O commit do sítio guarda apenas este relatório e as medidas da paragem.

A continuação depende da decisão do lugar de direção sobre a recusa do sinal positivo no exportador. Ficam por fazer a travessia, o item nas duas edições, os nomes, as famílias, os lugares, os recibos, as auditorias, as conferências do sítio e a transcrição das páginas construídas.

A fase B permanece prevista para a noite de 28.10.2026, após o voto, com o registo da votação e as intervenções do Diário. Esta passagem não a realizou nem publicou essa promessa numa página.

## Custo

24 chamadas de ferramentas até fechar este relatório; quatro corridas de conferências e quatro gerações. O commit do relatório e a verificação final são posteriores a esta medição. Nenhuma delegação. Os pontos são medidos pelo lançador.

`tokens used`: 2335135 no último evento de utilização disponível ao escrever o relatório. A medição completa está em `medidas.json`; não é a contagem final do lançador.
