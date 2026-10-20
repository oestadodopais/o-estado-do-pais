# EO1, o estudo do Orçamento de 2027

## Medição anterior à composição

O comando `python3 design/especime-v3/medicoes/eo1-2026-10-20/medir.py <motor>` foi executado por `curto.sh`, com código 0. O `partida.json` conserva a cabeça dos livros antes das alterações, os valores, unidades, períodos, localizadores e resumos das linhas lidas. A passagem `--selagem`, também com código 0, acrescenta a prova dos excertos novos, o resumo do corpo alojado e a posição no texto extraído, e refaz cada derivada das componentes, com diferença zero. A posição refere-se ao texto normalizado extraído, não a um deslocamento binário dentro do PDF. O resumo é o do corpo binário.

A medição lê também as medidas que não são intercambiáveis: a dívida de 2025 na atualização de abril do Eurostat e na notificação de setembro do INE; o saldo e os juros de 2027 em contabilidade pública e em contabilidade nacional; a dívida de 2027 no Orçamento, na previsão da primavera da Comissão Europeia e no plano de médio prazo. As diferenças de data, perímetro e fonte constam da secção das contas e da secção da dívida do documento.

## Decisões de conteúdo

- EO1-1. A leitura crítica referida no mandato não existe nesta cabeça do sítio. As verificações foram feitas sobre os corpos alojados, sem atribuir à leitura ausente conclusões que não se pudessem refazer.
- EO1-2. A citação do ministro das Finanças é a frase contínua do corpo do Observador. O corpo não contém as reticências do mandato. O título da notícia continua a ser a linha documental, distinta da citação.
- EO1-3. A nota do quadro foi confirmada como «Nota: (i) invariante.». As chamadas coladas foram retiradas dos dois excertos da UTAO que as continham. Os excertos de juros e do risco do SNS foram reconferidos e já não continham essas chamadas. A limpeza fica declarada nos seletores e nas notas das linhas.
- EO1-4. A frase «Os juros são a despesa que mais cresce» ficou fora: o mesmo quadro contém uma variação percentual superior noutra rubrica. Os valores dos juros e a comparação com o custo das medidas mantêm-se.
- EO1-5. A sexta redução do IRS está na página PDF 55; a frase integral do percurso do IRC atravessa as páginas 55 e 56. Os localizadores são os medidos, não os indicados aproximadamente no mandato.
- EO1-6. «É a soma de seis anos» ficou fora. As reduções citadas pelo próprio relatório não correspondem a seis anos. Ficou também fora a atribuição de uma parte da descida da dívida ao valor final do ajustamento: esse valor é uma contribuição positiva, não a diferença entre os dois anos.
- EO1-7. A causalidade exclusiva «os impostos indiretos crescem pela economia, não pelas taxas» e a comparação com outros ministérios europeus ficaram fora por falta de apoio documental nesta pesquisa.
- EO1-8. As datas de declarações que não existiam literalmente no excerto ou no localizador citados foram omitidas da prosa. A data da notícia de Sarmento, que tem apoio literal, mantém-se. Não se fabricou um localizador para fazer passar um literal.
- EO1-9. A numeração editorial das secções e das conclusões foi retirada dos títulos e da prosa, conservando a ordem e os títulos: não é uma medida e o mandato só admite literais numéricos apoiados numa linha citada. O índice de navegação continua a distinguir as secções.
- EO1-10. A prosa da Comissão Europeia diverge do quadro para 2026. O estudo conserva a citação da prosa ao lado do valor do quadro, sem os corrigir nem escolher silenciosamente um deles.
- EO1-11. O comparador aritmético do motor perdia o sinal negativo quando convertia os valores das componentes. Foi corrigido na leitura das componentes e do resultado, com plantas de sinais. A reconciliação textual antiga conserva a sua função de encontrar formas impressas; não decide o sinal de uma conta.
- EO1-12. O compositor de livros prova intervalos completos. Uma citação é conferida integralmente contra o excerto, incluindo os seus números, e não por coincidências de números soltos. O portão reconstrói o registo e compara os seus bytes com o ficheiro entregue. O HTML tem uma conferência independente das duas edições.
- EO1-13. Os dois corpos de resposta 403 do Banco de Portugal foram retirados por conterem um endereço de rede. Os recibos conservam o estado do pedido e declaram a retirada do corpo. A ausência não foi convertida num pedido bem sucedido.

- EO1-14. A página do estudo contém a leitura na rota principal, segundo a arquitetura atual da casa. A célula e as capturas usam essa rota e a rota do documento alojado.
- EO1-15. A cadeia distingue o resumo do corpo integral do antigo resumo de um ficheiro de recorte. O novo campo `source_body` só passa se o caminho e o resumo coincidirem com o documento da linha provada.
- EO1-16. A prova independente do sítio conserva os lexemas numéricos do JSON para refazer o resumo Python: o metadado `300.0` não pode converter-se silenciosamente em `300`. O valor da linha continua a ser conferido separadamente.
- EO1-17. As linhas europeias e o salário mínimo espanhol têm o lugar da fonte, não herdam Portugal do estudo. A remuneração mínima portuguesa do diploma citado refere-se ao continente.

- EO1-18. As chamadas preliminares de `check:indice` e `check:leituras` foram erros de execução: ambos os guiões incluem ensaios de navegador. O navegador foi recusado na sandbox (`browserType.launch: Target page, context or browser has been closed`). A conferência completa fica exclusivamente na corrida pelo escrivão; as tentativas recusadas não contam como verificação.
- EO1-19. A primeira corrida completa do sítio parou nos cartões: o excerto do CFP não cabia como manchete numérica. O cartão de uma linha textual passou a usar o nome do recibo, sem estado de limiar. O excerto mantém-se integral na linha e no documento. A primeira corrida registou `build` 1, `verify` 125 (não executado) e `typecheck` 0. A rasterização local corrigida terminou com código 0 e conferiu a paleta de todos os cartões; a corrida completa seguinte volta a construí-los.
- EO1-20. Os nomes das novas linhas levam a sua origem também nos caminhos, no índice e nos cartões. A conferência exige o nome exato da edição e que os seus algarismos existam nos campos da linha de origem. A célula recusa nomes trocados, linhas ausentes e algarismos sem apoio. As linhas cujo valor é o excerto integral são citações para a régua ortográfica, continuando sujeitas à comparação do valor com o livro. A abertura inglesa conserva «In short», como o mandato pede, e a abertura nas duas edições admite a introdução antes das três partes. As duas rotas antigas de texto recebem o redirecionamento que a régua exige.
- EO1-21. A segunda corrida passou o portão de HTML e parou na lista fechada da voz, que ainda não reconhecia as portas por parágrafo. A lista ganhou o rótulo declarado nas duas línguas; os nomes e os destinos de cada porta são comparados com as linhas citadas nesse parágrafo. O texto restante continua a ser conferido. A segunda corrida registou `build` 1, `verify` 125 e `typecheck` 0.
- EO1-22. A terceira corrida parou no inventário da voz. Foram registadas as frases novas e as contagens medidas, retiradas as contagens antigas e os metadados do estudo que saiu da lista de recentes. A definição completa da contagem de edições passou a aparecer no índice; os antigos rótulos isolados continuam proibidos. As citações integrais saem da régua de prosa só depois de coincidirem com o excerto, e o código de incorporação só depois da conferência integral pelo mecanismo existente. A explicação inglesa do mínimo de existência diz o que o termo significa, sem alterar o rótulo da fonte. A leitura cruzada do diff do inventário permanece `por ler`, para a direção antes da fusão.
- EO1-23. As portas finais usam os nomes temáticos que o documento fixado contém, com a forma visual das portas da casa. Não repetem os títulos numéricos dos itens atuais. A célula exige as duas portas apenas nas rotas deste estudo, com os textos e destinos declarados; recusa nomes, destinos e condições trocados, portas ausentes e a condição fora do estudo. O documento e o registo conservam os seus bytes.


- EO1-24. A quarta corrida passou o build, mas o verify completo recusou cinco passos: alvos, lugar, índice do livro, cartões e índice do sítio. Os códigos foram `build` 0, `verify` 1 e `typecheck` 0. A planta do índice do sítio tinha uma contagem antiga fixa; passou a medir o total antes de retirar uma edição, mantendo a exigência de faltar exatamente essa edição.
- EO1-25. Os localizadores novos são conferidos por coordenadas de quadro, página, coluna, período e rótulo, com o recibo e o excerto como testemunhas. A célula leu 118 localizadores e recusou seis alterações por linha. Esta conferência encontrou a data de referência errada nas variações anuais de 2027 face a 2026: o exportador tratava a barra como intervalo de calendário e escolhia o denominador. O período e o excerto no livro estavam certos; a exportação foi corrigida para distinguir a variação anual do intervalo de datas.
- EO1-26. As linhas textuais usam o nome conferido da medida no título público, na descrição e no cartão, em vez de colocarem o parágrafo inteiro na manchete. O registo do cartão deixou de dizer que desenhou uma unidade que não aparece na imagem. O excerto permanece integral no recibo, com o corpo e a entrelinha já usados para as transcrições, em vez da escala de um número de destaque. O código de incorporação só sai da conferência de língua depois de ser comparado integralmente com a linha.
- EO1-27. Nos novos recibos, a porta de releitura já abre o Método; retirou-se a segunda porta para o mesmo destino no rodapé. As portas obrigatórias de fontes dos parágrafos e o cabeçalho do documento só saem da contagem de duplicações depois da conferência de nomes, destinos e multiplicidade. O teto existente não foi aumentado. As plantas retiram ou alteram portas e o cabeçalho, e a célula recusa-as.
- EO1-28. A expressão «Governo Constitucional» também ocorre em citações novas. A régua conserva a única ocorrência permitida na prosa do projeto e confere separadamente as transcrições: nos recibos, exige a linha, a rota e o excerto exato; nos índices, o valor tem de ser o excerto integral; no estudo e no documento, a unidade inteira tem de coincidir com o registo antes de retirar apenas as citações apoiadas nas linhas. Uma frase acrescentada continua a ser contada.

- EO1-29. A repetição das plantas encontrou uma diferença entre a opção `pt` e o identificador `pt-PT` do registo. O injetor passou a comparar a língua base. Os seis processos foram repetidos com a implementação corrigida e terminaram com código 1 pelas três razões esperadas; os resultados finais estão em `plantas.json`. Uma execução sem alteração efetiva não é contada como planta apanhada.

## Fontes e condições

A tabela de IRS de 2026 foi alojada da página oficial do artigo 68.º da Autoridade Tributária. Entrou a comparação dos limites, a atualização comum arredondada e a comparação das taxas. Não entrou a frase de ausência da tabela. A remuneração mínima de 2026 foi alojada do Decreto-Lei n.º 139/2025; entrou a comparação com 2027. O BOE foi alojado com o Real Decreto 126/2026; entrou o valor mensal espanhol. Não se derivou uma diferença entre países: a selagem desta linha prova o montante mensal, mas não prova que a forma de pagamento seja idêntica à portuguesa. A referência a catorze pagas não foi acrescentada sem essa prova na linha.

Os pedidos, endereços oficiais, estados, datas, resumos e direitos estão nos recibos e no inventário de fontes do motor. Não se publicam os corpos integrais no sítio. A IL e o PAN permanecem ausências da pesquisa de posições posteriores à entrega, não afirmações de inexistência de posições políticas.

## Verificação

As plantas do compositor foram corridas por `python3 -m core.compor_livros_test`, através de `curto.sh`, com código 0. Foi também recusado um algarismo escrito à mão.

A célula do HTML foi executada em processos separados com `EO1_EDICAO=<edição> EO1_PLANTA=<planta> node --import ./design/especime-v3/medicoes/eo1-2026-10-20/injetar-planta.mjs tests/eo1/documento.mjs`. As edições são `pt` e `en`; as plantas são `valor`, `excerto` e `literal`. O injetor altera apenas o objeto lido pelo processo, não os ficheiros. Em cada edição foram recusados um valor alterado numa linha de origem dentro do registo, um excerto cortado e um literal sem linha. Os seis processos terminaram com código 1 e com a razão esperada, registada em `plantas.json`.

A exportação final foi feita por `python3 -m publisher.export_site_rows --manifest publisher/manifest.eo1.json --site <worktree> --write`, a partir de `6b1a8201dcf1d428252d7a5008e00a95fb8bcb39`, com código 0. `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin`, por `curto.sh`, terminou com código 0. Ficaram dois avisos de resumo global dos livros `20 Orcamento do Estado` e `24 Orcamento 2027 Analise`, cujo campo `built_at` pode mudar; nenhuma linha foi acusada de alteração. O resultado do último commit do motor, incluindo `GATE: PASS`, está em `motor-commit.json`.

## Capturas e fecho

Comando: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido-capturas.json> <temporario>`, código 0. O pedido e o manifesto estão em `pedido-capturas.json` e `capturas.json`. Foram capturadas as duas edições do estudo e do documento nas cinco larguras pedidas (20 capturas), mais o recibo textual nas mesmas línguas e larguras (10 capturas). O total é de 30 capturas e 60 recortes. Todos os resumos das imagens foram refeitos; nenhuma página excedeu a largura da janela, e não houve pedidos externos, recursos em falta ou erros de navegador. Nenhum PNG foi acrescentado ao repositório.

Foram inspecionados visualmente o cabeçalho e a abertura do estudo a 390, 768, 1024, 1280 e 1600 px, o documento inglês nas duas larguras extremas, o resumo português do documento a 390 px, o resumo inglês do estudo a 1600 px e o recibo textual inglês a 390 px. As regiões inspecionadas são legíveis e não apresentam sobreposições. Os recortes auxiliares usados nesta inspeção ficaram apenas na pasta temporária.

A corrida final conferiu os 49 passos do verify completo, 21 executados pelo build e 28 pelo verify, com os três códigos a zero. A metade do motor em `check:series` correu com `RESEARCHHUB_DIR`, e terminou com código 0. O `check:cruzamento --with-origin` também terminou com código 0; os dois avisos de resumo global estão descritos acima. As corridas, incluindo as recusadas antes das correções, estão em `portoes.json`.

A construção e as capturas são da cabeça `95b63548da76384cb77741802b872d8702fc19f0`. O commit de fecho acrescenta apenas este relatório extraído e os manifestos de verificação, sem alterar o conteúdo nem a construção conferida. O motor está em `6b1a8201dcf1d428252d7a5008e00a95fb8bcb39`, com `core.gate` PASS no pre-commit. Não foi feito push. Fica para a direção a leitura cruzada do inventário, já assinalada `por ler`, antes da fusão.

<!-- EO1-MEDIDO -->

## Linhas seladas

| Identificador | Valor | Unidade | Período |
| --- | --- | --- | --- |
| irs-2027-escalao-1-limite | 8 666 | euros | 2027 |
| irs-2027-escalao-2-limite | 13 075 | euros | 2027 |
| irs-2027-escalao-3-limite | 18 530 | euros | 2027 |
| irs-2027-escalao-4-limite | 23 985 | euros | 2027 |
| irs-2027-escalao-5-limite | 30 538 | euros | 2027 |
| irs-2027-escalao-6-limite | 44 762 | euros | 2027 |
| irs-2027-escalao-7-limite | 48 373 | euros | 2027 |
| irs-2027-escalao-8-limite | 89 995 | euros | 2027 |
| irs-2027-escalao-9-limite | Superior a 89 995 | texto | 2027 |
| oe-2027-rmmg-2027 | 970 | euros | 2027 |
| oe-2027-rmmg-2024 | 820 | euros | 2024 |
| oe-2027-csi-referencia-2027 | 720 | euros | 2027 |
| oe-2027-csi-aumento-2027 | 50 | euros | 2027 |
| oe-2027-csi-despesa-2027 | 709,7 | milhões de euros | 2027 |
| oe-2027-csi-variacao-2027 | 15,6 | % | 2027 |
| oe-2027-csi-referencia-2029 | 870 | euros | 2029 |
| oe-2027-quadro-3-2-nota-i | Nota: (i) invariante. | texto | 2027 |
| oe-2027-prr-fim-investimento | Concluído o ciclo extraordinário de financiamento associado ao PRR, o volume global de investimento tenderá naturalmente a abrandar face aos níveis excecionais observados nos anos anteriores. | texto | 2027 |
| oe-2027-prr-fim-financiamento | Face ao término do PRR, uma parte importante do investimento público no próximo ano será suportado pelos instrumentos de financiamento estruturais da União Europeia, como o Portugal 2030, o Fundo Europeu de Desenvolvimento Regional e o Fundo Social Europeu. | texto | 2027 |
| oe-2027-irs-sexta-reducao | O Orçamento do Estado para 2027 apresentará a sexta redução generalizada de IRS, considerando a redução das taxas em junho de 2024, junho de 2025, no Orçamento do Estado para 2026 e em setembro de 2026, a que acresce a atualização dos respetivos escalões nos Orçamentos do Estado para 2025, 2026 e 2027. | texto | 2027 |
| oe-2027-irc-21-para-17 | Destaca-se ainda o alargamento do IRS Jovem; a redução do IRC de 21% em 2024 para 17% em 2028; a isenção de imposto municipal sobre as transmissões onerosas de imóveis (IMT) e imposto do selo na aquisição da primeira habitação por parte dos jovens até aos 35 anos; a redução do imposto sobre o valor acrescentado (IVA) de 23% para 6% na habitação e a redução do IRS de 25% para 10% nas rendas moderadas. | texto | 2027 |
| irc-taxa-2026 | 19 | % | 2026 |
| irc-taxa-2027 | 18 | % | 2027 |
| irc-taxa-2028 | 17 | % | 2028 |
| utao-salarios-valor | 1231 | milhões de euros | 2027 |
| utao-salarios-irs | 590 | milhões de euros | 2027 |
| utao-salarios-cs | 471 | milhões de euros | 2027 |
| utao-novas-saldo-valor | 79 | milhões de euros | 2027 |
| utao-novas-receita | 179 | milhões de euros | 2027 |
| utao-novas-despesa | -100 | milhões de euros | 2027 |
| utao-divida-stock-2026 | 284,8 | mil milhões de euros | 2026 |
| utao-divida-stock-2027 | 287,8 | mil milhões de euros | 2027 |
| utao-divida-acrescimo-2026 | 9,7 | mil milhões de euros | 2026 |
| utao-divida-acrescimo-2027 | 2,9 | mil milhões de euros | 2027 |
| utao-juros-2027 | 8,2 | mil milhões de euros | 2027 |
| utao-juros-variacao-pct | 23,2 | % | 2027 |
| utao-taxa-implicita-2026 | 2,4 | % | 2026 |
| utao-taxa-implicita-2027 | 2,9 | % | 2027 |
| oe-2027-remuneracoes-atualizacao-pct | 2,3 | % | 2027 |
| oe-2027-remuneracoes-massa | 948 | milhões de euros | 2027 |
| posicao-governo-divida85-citacao | A dívida pública deve continuar a ser a nossa principal preocupação nas contas públicas. Temos uma redução de cerca de quatro pontos percentuais nos últimos anos e estaremos abaixo dos 85% do PIB [Produto Interno Bruto] em 2027 | texto | 2027 |
| irs-2026-escalao-1-limite | 8 342 | euros | 2026 |
| irs-2026-escalao-1-taxa-normal | 12,50 | % | 2026 |
| irs-2026-escalao-2-limite | 12 587 | euros | 2026 |
| irs-2026-escalao-2-taxa-normal | 15,70 | % | 2026 |
| irs-2026-escalao-3-limite | 17 838 | euros | 2026 |
| irs-2026-escalao-3-taxa-normal | 21,20 | % | 2026 |
| irs-2026-escalao-4-limite | 23 089 | euros | 2026 |
| irs-2026-escalao-4-taxa-normal | 24,10 | % | 2026 |
| irs-2026-escalao-5-limite | 29 397 | euros | 2026 |
| irs-2026-escalao-5-taxa-normal | 31,10 | % | 2026 |
| irs-2026-escalao-6-limite | 43 090 | euros | 2026 |
| irs-2026-escalao-6-taxa-normal | 34,90 | % | 2026 |
| irs-2026-escalao-7-limite | 46 566 | euros | 2026 |
| irs-2026-escalao-7-taxa-normal | 43,10 | % | 2026 |
| irs-2026-escalao-8-limite | 86 634 | euros | 2026 |
| irs-2026-escalao-8-taxa-normal | 44,60 | % | 2026 |
| irs-2026-escalao-9-limite | Superior a 86 634 | texto | 2026 |
| irs-2026-escalao-9-taxa-normal | 48,00 | % | 2026 |
| rmmg-2026 | 920,00 | euros | 2026 |
| smi-espanha-2026 | 1 221 | euros | 2026 |
| der-oe2027-medidas-novas-saldo | 79 | milhões de euros | 2027 |
| der-oe2027-medidas-anteriores-receita | -263 | milhões de euros | 2027 |
| der-oe2027-medidas-anteriores-despesa | 947 | milhões de euros | 2027 |
| der-oe2027-medidas-anteriores-saldo | -1210 | milhões de euros | 2027 |
| der-oe2027-juros-variacao-cp | 1350 | milhões de euros | 2027 |
| der-oe2027-juros-variacao-cn | 1548 | milhões de euros | 2027 |
| der-oe2027-investimento-variacao-cp | -2347 | milhões de euros | 2027 |
| der-oe2027-prr-peso-despesa-2026 | 7,6 | % | 2026 |
| der-oe2027-receita-sem-prr-variacao-pct | 4,3 | % | 2027 |
| der-oe2027-despesa-sem-prr-variacao-pct | 5,7 | % | 2027 |
| der-oe2027-saldo-cp-variacao | -572 | milhões de euros | 2027 |
| der-divida-2027-oe-vs-ce | 1,5 | pontos percentuais | 2027 |
| der-divida-2027-oe-vs-poenmp | 2,7 | pontos percentuais | 2027 |
| der-divida-pt-vs-ue-2025 | 8,0 | pontos percentuais | 2025 |
| der-rmmg-2024-2027-abs | 150 | euros | 2027 |
| der-rmmg-2026-2027-abs | 50 | euros | 2027 |
| der-rmmg-2026-2027-pct | 5,4 | % | 2027 |
| der-csi-referencia-2026 | 670 | euros | 2026 |
| der-salarios-publicos-retorno-pct | 86,2 | % | 2027 |
| der-irs-escalao-1-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-2-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-3-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-4-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-5-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-6-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-7-atualizacao-pct | 3,9 | % | 2027 |
| der-irs-escalao-8-atualizacao-pct | 3,9 | % | 2027 |

Os resumos dos corpos e as posições de cada excerto estão em `partida.json`, em `novas`.

## Contas refeitas

| Identificador | Expressão | Resultado | Diferença |
| --- | --- | --- | --- |
| der-oe2027-medidas-novas-saldo | pm-q3-2-r8-c0 + pm-q3-2-r13-c0 - pm-q3-2-r25-c0 | 79 | 0 |
| der-oe2027-medidas-anteriores-receita | pm-q3-2-r7-c0 + pm-q3-2-r10-c0 + pm-q3-2-r11-c0 + pm-q3-2-r12-c0 + pm-q3-2-r15-c0 + pm-q3-2-r16-c0 + pm-q3-2-r18-c0 | -263 | 0 |
| der-oe2027-medidas-anteriores-despesa | pm-q3-2-r21-c0 + pm-q3-2-r22-c0 + pm-q3-2-r23-c0 | 947 | 0 |
| der-oe2027-medidas-anteriores-saldo | der-oe2027-medidas-anteriores-receita - der-oe2027-medidas-anteriores-despesa | -1210 | 0 |
| der-oe2027-juros-variacao-cp | pm-q4-1-r21-c1 - pm-q4-1-r21-c0 | 1350 | 0 |
| der-oe2027-juros-variacao-cn | pm-q3-1-r36-c2 - pm-q3-1-r36-c1 | 1548 | 0 |
| der-oe2027-investimento-variacao-cp | pm-q4-1-r27-c1 - pm-q4-1-r27-c0 | -2347 | 0 |
| der-oe2027-prr-peso-despesa-2026 | round ( pm-q3-1-r51-c1 / pm-q3-1-r50-c1 * 100 , 1 ) | 7.6 | 0.0 |
| der-oe2027-receita-sem-prr-variacao-pct | round ( ( pm-q3-1-r23-c2 / pm-q3-1-r23-c1 - 1 ) * 100 , 1 ) | 4.3 | 0.0 |
| der-oe2027-despesa-sem-prr-variacao-pct | round ( ( pm-q3-1-r52-c2 / pm-q3-1-r52-c1 - 1 ) * 100 , 1 ) | 5.7 | 0.0 |
| der-oe2027-saldo-cp-variacao | pm-q4-1-r32-c1 - pm-q4-1-r32-c0 | -572 | 0 |
| der-divida-2027-oe-vs-ce | ce-primavera-2026-divida-2027 - pm-q3-6-r42-c3 | 1.5 | 0.0 |
| der-divida-2027-oe-vs-poenmp | pm-grafico-3-5-poenmp-2027 - pm-q3-6-r42-c3 | 2.7 | 0.0 |
| der-divida-pt-vs-ue-2025 | europa-divida-pt-2025 - europa-divida-eu27_2020-2025 | 8.0 | 0.0 |
| der-rmmg-2024-2027-abs | oe-2027-rmmg-2027 - oe-2027-rmmg-2024 | 150 | 0 |
| der-rmmg-2026-2027-abs | oe-2027-rmmg-2027 - rmmg-2026 | 50 | 0 |
| der-rmmg-2026-2027-pct | round ( ( oe-2027-rmmg-2027 / rmmg-2026 - 1 ) * 100 , 1 ) | 5.4 | 0.0 |
| der-csi-referencia-2026 | oe-2027-csi-referencia-2027 - oe-2027-csi-aumento-2027 | 670 | 0 |
| der-salarios-publicos-retorno-pct | round ( ( utao-salarios-irs + utao-salarios-cs ) / utao-salarios-valor * 100 , 1 ) | 86.2 | 0.0 |
| der-irs-escalao-1-atualizacao-pct | round ( ( irs-2027-escalao-1-limite / irs-2026-escalao-1-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-2-atualizacao-pct | round ( ( irs-2027-escalao-2-limite / irs-2026-escalao-2-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-3-atualizacao-pct | round ( ( irs-2027-escalao-3-limite / irs-2026-escalao-3-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-4-atualizacao-pct | round ( ( irs-2027-escalao-4-limite / irs-2026-escalao-4-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-5-atualizacao-pct | round ( ( irs-2027-escalao-5-limite / irs-2026-escalao-5-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-6-atualizacao-pct | round ( ( irs-2027-escalao-6-limite / irs-2026-escalao-6-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-7-atualizacao-pct | round ( ( irs-2027-escalao-7-limite / irs-2026-escalao-7-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |
| der-irs-escalao-8-atualizacao-pct | round ( ( irs-2027-escalao-8-limite / irs-2026-escalao-8-limite - 1 ) * 100 , 1 ) | 3.9 | 0.0 |

## Medidas comparadas

### divida 2025

- PM:europa-divida-pt-2025: 89.7 Percentage of gross domestic product (GDP), 2025. Localizador: freq=A; unit=PC_GDP; sector=S13; na_item=GD; geo=PT; time=2025; value[155].
- DOM:divida-publica-2025-notificacao-ine-2026-09: 89,2 null, null. Localizador: null.

### saldo 2027

- PM:pm-q4-1-r32-c4: -0,1 % do PIB, 2027. Localizador: Quadro 4.1. Conta das Administrações Públicas em contabilidade pública; Saldo Global; coluna 5: 2027; orçamento; % do PIB; p. 68 PDF (52 impressa).
- PM:pm-q3-3-r37-c3: 0,1 % do PIB, 2027. Localizador: Quadro 3.3. Passagem de saldos de contabilidade pública a contabilidade nacional; 3. Saldo das AP em contabilidade nacional (1+2); coluna 4: 2027; orçamento; % do PIB; p. 61 PDF (45 impressa).

### divida 2027

- PM:pm-q3-6-r42-c3: 84,5 % do PIB, 2027. Localizador: Quadro 3.6. Dívida pública; Dívida pública consolidada (%); coluna 4: 2027; orçamento; % do PIB; p. 65 PDF (49 impressa).
- PM:ce-primavera-2026-divida-2027: 86.0 % of GDP, 2027. Localizador: Table III.18.1: Main features of country forecast - PORTUGAL; General government gross debt (c); coluna 7: 2027; p. 143 PDF (127 impressa).
- PM:pm-grafico-3-5-poenmp-2027: 87,2 % do PIB, 2027. Localizador: Gráfico 3.5; série POENMP; 2027; p.65 PDF (49 impressa).

### juros 2027

- PM:pm-q4-1-r21-c1: 8 575 milhões de euros, 2027. Localizador: Quadro 4.1. Conta das Administrações Públicas em contabilidade pública; Juros e outros encargos; coluna 2: 2027; orçamento; milhões de euros; p. 68 PDF (52 impressa).
- PM:pm-q3-1-r36-c2: 8 217 milhões de euros, 2027. Localizador: Quadro 3.1. Conta das Administrações Públicas: 2026-2027; Juros; coluna 3: 2027; orçamento; milhões de euros; p. 54 PDF (38 impressa).

## Portões

Comandos: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> motor` e, depois da correção do sítio, `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>`. A cabeça de cada corrida está indicada abaixo. Os códigos abaixo foram lidos dos ficheiros da corrida, não inferidos da tentativa.

- build: 0.
- verify: 0.
- typecheck: 0.
- motor: `core.gate` PASS no pre-commit; commit aceite pelo escrivão com código 0. A cabeça do motor não mudou depois desta conferência.

Cabeça conferida do sítio: `95b63548da76384cb77741802b872d8702fc19f0`. Cabeça conferida do motor: `6b1a8201dcf1d428252d7a5008e00a95fb8bcb39`.

## Literais e apoios

| Edição | Unidade | Literal | Linha | Campo |
| --- | --- | --- | --- | --- |
| pt | 26 | 3.2 | pm-q3-2-r26-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r26-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r5-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r5-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r19-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r19-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r6-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r6-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r7-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r7-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r8-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r8-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r9-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r9-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r10-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r10-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r11-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r11-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r13-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r13-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r12-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r12-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r14-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r14-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r15-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r15-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r16-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r16-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r17-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r17-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r20-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r20-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r21-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r21-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r22-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r22-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r23-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r23-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r24-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r24-c0 | locator |
| pt | 26 | 3.2 | pm-q3-2-r25-c0 | excerpt |
| pt | 26 | 3.2 | pm-q3-2-r25-c0 | locator |
| pt | 31 | 68.º | irs-escalao-1-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-1-limite | locator |
| pt | 31 | 68.º | irs-escalao-2-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-2-limite | locator |
| pt | 31 | 68.º | irs-escalao-3-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-3-limite | locator |
| pt | 31 | 68.º | irs-escalao-4-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-4-limite | locator |
| pt | 31 | 68.º | irs-escalao-5-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-5-limite | locator |
| pt | 31 | 68.º | irs-escalao-6-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-6-limite | locator |
| pt | 31 | 68.º | irs-escalao-7-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-7-limite | locator |
| pt | 31 | 68.º | irs-escalao-8-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-8-limite | locator |
| pt | 31 | 68.º | irs-escalao-9-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-1-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-2-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-3-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-4-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-5-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-6-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-7-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-8-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-1-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-2-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-3-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-4-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-5-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-6-taxa-normal | locator |
| pt | 31 | 68.º | irs-escalao-1-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-1-limite | locator |
| pt | 31 | 68.º | irs-escalao-2-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-2-limite | locator |
| pt | 31 | 68.º | irs-escalao-3-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-3-limite | locator |
| pt | 31 | 68.º | irs-escalao-4-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-4-limite | locator |
| pt | 31 | 68.º | irs-escalao-5-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-5-limite | locator |
| pt | 31 | 68.º | irs-escalao-6-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-6-limite | locator |
| pt | 31 | 68.º | irs-escalao-7-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-7-limite | locator |
| pt | 31 | 68.º | irs-escalao-8-taxa-normal | locator |
| pt | 31 | 68.º | irs-2027-escalao-8-limite | locator |
| pt | 31 | 68.º | irs-escalao-9-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-1-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-2-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-3-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-4-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-5-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-6-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-7-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-8-limite | locator |
| pt | 31 | 68.º | irs-2026-escalao-1-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-2-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-3-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-4-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-5-taxa-normal | locator |
| pt | 31 | 68.º | irs-2026-escalao-6-taxa-normal | locator |
| pt | 40 | 8.º | diploma-habitacao-artigo8 | excerpt |
| pt | 40 | 8.º | diploma-habitacao-artigo8 | locator |
| pt | 40 | 8.º | diploma-habitacao-artigo18 | excerpt |
| pt | 40 | 8.º | diploma-habitacao-artigo18 | locator |
| pt | 40 | 10.º | diploma-habitacao-artigo10 | excerpt |
| pt | 40 | 10.º | diploma-habitacao-artigo10 | locator |
| pt | 40 | 10.º | diploma-habitacao-artigo18 | excerpt |
| pt | 40 | 18.º | diploma-habitacao-artigo18 | excerpt |
| pt | 40 | 18.º | diploma-habitacao-artigo18 | locator |
| pt | 44 | 13 de outubro | posicao-governo-divida85-citacao | locator |
| en | 26 | 3.2 | pm-q3-2-r26-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r26-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r5-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r5-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r19-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r19-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r6-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r6-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r7-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r7-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r8-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r8-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r9-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r9-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r10-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r10-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r11-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r11-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r13-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r13-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r12-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r12-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r14-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r14-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r15-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r15-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r16-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r16-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r17-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r17-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r20-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r20-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r21-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r21-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r22-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r22-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r23-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r23-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r24-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r24-c0 | locator |
| en | 26 | 3.2 | pm-q3-2-r25-c0 | excerpt |
| en | 26 | 3.2 | pm-q3-2-r25-c0 | locator |
| en | 31 | 68.º | irs-escalao-1-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-1-limite | locator |
| en | 31 | 68.º | irs-escalao-2-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-2-limite | locator |
| en | 31 | 68.º | irs-escalao-3-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-3-limite | locator |
| en | 31 | 68.º | irs-escalao-4-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-4-limite | locator |
| en | 31 | 68.º | irs-escalao-5-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-5-limite | locator |
| en | 31 | 68.º | irs-escalao-6-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-6-limite | locator |
| en | 31 | 68.º | irs-escalao-7-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-7-limite | locator |
| en | 31 | 68.º | irs-escalao-8-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-8-limite | locator |
| en | 31 | 68.º | irs-escalao-9-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-1-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-2-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-3-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-4-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-5-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-6-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-7-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-8-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-1-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-2-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-3-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-4-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-5-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-6-taxa-normal | locator |
| en | 31 | 68.º | irs-escalao-1-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-1-limite | locator |
| en | 31 | 68.º | irs-escalao-2-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-2-limite | locator |
| en | 31 | 68.º | irs-escalao-3-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-3-limite | locator |
| en | 31 | 68.º | irs-escalao-4-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-4-limite | locator |
| en | 31 | 68.º | irs-escalao-5-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-5-limite | locator |
| en | 31 | 68.º | irs-escalao-6-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-6-limite | locator |
| en | 31 | 68.º | irs-escalao-7-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-7-limite | locator |
| en | 31 | 68.º | irs-escalao-8-taxa-normal | locator |
| en | 31 | 68.º | irs-2027-escalao-8-limite | locator |
| en | 31 | 68.º | irs-escalao-9-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-1-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-2-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-3-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-4-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-5-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-6-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-7-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-8-limite | locator |
| en | 31 | 68.º | irs-2026-escalao-1-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-2-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-3-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-4-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-5-taxa-normal | locator |
| en | 31 | 68.º | irs-2026-escalao-6-taxa-normal | locator |
| en | 40 | 8.º | diploma-habitacao-artigo8 | excerpt |
| en | 40 | 8.º | diploma-habitacao-artigo8 | locator |
| en | 40 | 8.º | diploma-habitacao-artigo18 | excerpt |
| en | 40 | 8.º | diploma-habitacao-artigo18 | locator |
| en | 40 | 10.º | diploma-habitacao-artigo10 | excerpt |
| en | 40 | 10.º | diploma-habitacao-artigo10 | locator |
| en | 40 | 10.º | diploma-habitacao-artigo18 | excerpt |
| en | 40 | 18.º | diploma-habitacao-artigo18 | excerpt |
| en | 40 | 18.º | diploma-habitacao-artigo18 | locator |
| en | 44 | 13 de outubro | posicao-governo-divida85-citacao | locator |

## Siglas e primeira expansão

### pt

- UTAO, unidade 1: «a quem arrenda ou compra casa, às empresas, e ao Estado que paga a dívida. Com a apreciação preliminar da Unidade Técnica de Apoio Orçamental (a UTAO, o serviço técnico do Parlamento), o parecer do Conselho das Finanças Públicas (o CFP) sobre as previsões, a previsão da Comissão Europeia da primave».
- CFP, unidade 1: «ação preliminar da Unidade Técnica de Apoio Orçamental (a UTAO, o serviço técnico do Parlamento), o parecer do Conselho das Finanças Públicas (o CFP) sobre as previsões, a previsão da Comissão Europeia da primavera e as posições dos partidos como foram ditas, cada uma com o seu documento.».
- PRR, unidade 3: «bilidade pública, para 8 575 milhões, e o investimento desce −2 347 milhões, para 10 417 milhões, porque o Plano de Recuperação e Resiliência (o PRR, o dinheiro europeu de recuperação pós-pandemia) acaba em 2026.».
- PIB, unidade 5: «A dívida pública deve descer de 87,5 % do produto interno bruto (o PIB) em 2026 para 84,5 % em 2027, abaixo do limiar que o ministro das Finanças chamou «principal preocupação». A descida de −3,0 pontos é maior do que a ».
- IRS, unidade 3: «ita esperada do combate à fraude nos combustíveis, a atualização do mínimo de existência no Imposto sobre o Rendimento das Pessoas Singulares (o IRS) e o reforço do Complemento Solidário para Idosos (o CSI), somam 79 milhões de euros a favor do saldo. O que pesa no saldo de 2027, −1 210 milhões de».
- IRC, unidade 3: «e Orçamento: a descida do IRS de setembro de 2026 e a atualização dos escalões, a descida do Imposto sobre o Rendimento das Pessoas Coletivas (o IRC) fixada por lei em novembro de 2025, o Imposto sobre o Valor Acrescentado (o IVA) reduzido na construção e o IRS reduzido nas rendas moderadas do dec».
- IVA, unidade 3: « descida do Imposto sobre o Rendimento das Pessoas Coletivas (o IRC) fixada por lei em novembro de 2025, o Imposto sobre o Valor Acrescentado (o IVA) reduzido na construção e o IRS reduzido nas rendas moderadas do decreto-lei da habitação de maio de 2026, o acordo de rendimentos e os acordos salar».
- SIFIDE, unidade 26: «O SIFIDE é o Sistema de Incentivos Fiscais à Investigação e Desenvolvimento Empresarial. O quadro das principais medidas com impacto em 2027 (o Quadro 3.2 do ».
- CSI, unidade 3: «lização do mínimo de existência no Imposto sobre o Rendimento das Pessoas Singulares (o IRS) e o reforço do Complemento Solidário para Idosos (o CSI), somam 79 milhões de euros a favor do saldo. O que pesa no saldo de 2027, −1 210 milhões de euros, são medidas decididas antes deste Orçamento: a de».
- RMMG, unidade 35: «A remuneração mínima mensal garantida (a RMMG), pelo relatório: «Em 2027, o Governo da AD elevará o salário mínimo (RMMG) para os 970 euros, concretizando o terceiro aumento consecutivo desde que».
- SNS, unidade 9: «−18,4 %, e o relatório diz que o volume global de investimento «tenderá naturalmente a abrandar». O que isto faz ao Serviço Nacional de Saúde (o SNS) está no item da Saúde em «O que se discute», com a porta no fim deste estudo.».
- BOE, unidade 35: «tos: «O Governo quer limitar o SMN aos 970€ em 2027, quando em Espanha esse valor ultrapassou os 1220€ em 2026.» O Boletín Oficial del Estado (o BOE) fixa o salário mínimo espanhol de 2026 em 1 221 euros por mês.».
### en

- UTAO, unidade 1: « and to the State that pays the debt. With the preliminary appraisal of the Parliament's budget office (the Unidade Técnica de Apoio Orçamental, UTAO), the Public Finance Council's (Conselho das Finanças Públicas, CFP) opinion on the forecasts, the European Commission's spring forecast, and the par».
- CFP, unidade 1: «of the Parliament's budget office (the Unidade Técnica de Apoio Orçamental, UTAO), the Public Finance Council's (Conselho das Finanças Públicas, CFP) opinion on the forecasts, the European Commission's spring forecast, and the parties' positions as they were said, each with its document.».
- PRR, unidade 3: «in public accounting, to 8,575 million, and investment falls by −2,347 million, to 10,417 million, because the Recovery and Resilience Plan (the PRR, the European post-pandemic recovery money) ends in 2026.».
- PIB, unidade 5: «Public debt is to fall from 87.5 % of gross domestic product (GDP, PIB in Portuguese) in 2026 to 84.5 % in 2027, below the threshold the finance minister called the «principal preocupação». The fall of −3.0 points is lar».
- IRS, unidade 3: «he three new measures the report identifies, the expected revenue from fighting fraud in the fuel sector, the update of the personal income-tax (IRS) exemption threshold (the «mínimo de existência») and the increase of the Solidarity Supplement for the Elderly (CSI), add 79 million euros to the ba».
- IRC, unidade 3: «are measures decided before this Budget: the personal income tax cut of September 2026 and the update of the brackets, the corporate income tax (IRC) cut fixed by law in November 2025, the reduced value added tax (VAT, IVA in Portuguese) on construction and the reduced income tax on moderate rents».
- IVA, unidade 3: «ptember 2026 and the update of the brackets, the corporate income tax (IRC) cut fixed by law in November 2025, the reduced value added tax (VAT, IVA in Portuguese) on construction and the reduced income tax on moderate rents from the housing decree-law of May 2026, the incomes agreement and the pu».
- SIFIDE, unidade 26: «SIFIDE is the Portuguese system of tax incentives for business research and development. The report's table of main measures with an impact in 2027 (its Tab».
- CSI, unidade 3: «of the personal income-tax (IRS) exemption threshold (the «mínimo de existência») and the increase of the Solidarity Supplement for the Elderly (CSI), add 79 million euros to the balance. What weighs on the 2027 balance, −1,210 million euros, are measures decided before this Budget: the personal i».
- RMMG, unidade 35: «The guaranteed minimum monthly wage (RMMG), by the report: «Em 2027, o Governo da AD elevará o salário mínimo (RMMG) para os 970 euros, concretizando o terceiro aumento consecutivo desde que ».
- SNS, unidade 9: « −18.4 %, and the report says the overall volume of investment «tenderá naturalmente a abrandar». What this does to the National Health Service (SNS) is in the Health item of «Under discussion», with the door at the end of this study.».
- BOE, unidade 35: «tos: «O Governo quer limitar o SMN aos 970€ em 2027, quando em Espanha esse valor ultrapassou os 1220€ em 2026.» The Boletín Oficial del Estado (BOE) sets the Spanish minimum wage for 2026 at 1,221 euros a month.».

## Frases extraídas do HTML construído

As unidades abaixo foram extraídas das páginas de leitura construídas e comparadas com o registo. As citações conservam a língua original.

### Edição pt

**Unidade 0.** O Orçamento de 2027: o que muda e para quem

**Unidade 1.** A proposta de Orçamento do Estado para 2027, entregue no Parlamento a 8 de outubro de 2026, lida pelo que faz às pessoas: a quem trabalha por conta de outrem, a quem ganha o salário mínimo, a quem trabalha para o Estado, a quem recebe pensão, a quem arrenda ou compra casa, às empresas, e ao Estado que paga a dívida. Com a apreciação preliminar da Unidade Técnica de Apoio Orçamental (a UTAO, o serviço técnico do Parlamento), o parecer do Conselho das Finanças Públicas (o CFP) sobre as previsões, a previsão da Comissão Europeia da primavera e as posições dos partidos como foram ditas, cada uma com o seu documento.

**Unidade 2.** Em resumo

**Unidade 3.** O Orçamento para 2027 muda pouco por si próprio. As três medidas novas que o relatório identifica, a receita esperada do combate à fraude nos combustíveis, a atualização do mínimo de existência no Imposto sobre o Rendimento das Pessoas Singulares (o IRS) e o reforço do Complemento Solidário para Idosos (o CSI), somam 79 milhões de euros a favor do saldo. O que pesa no saldo de 2027, −1 210 milhões de euros, são medidas decididas antes deste Orçamento: a descida do IRS de setembro de 2026 e a atualização dos escalões, a descida do Imposto sobre o Rendimento das Pessoas Coletivas (o IRC) fixada por lei em novembro de 2025, o Imposto sobre o Valor Acrescentado (o IVA) reduzido na construção e o IRS reduzido nas rendas moderadas do decreto-lei da habitação de maio de 2026, o acordo de rendimentos e os acordos salariais da função pública. E o que mais muda nas contas não está no quadro das medidas: os juros da dívida sobem 1 350 milhões de euros em contabilidade pública, para 8 575 milhões, e o investimento desce −2 347 milhões, para 10 417 milhões, porque o Plano de Recuperação e Resiliência (o PRR, o dinheiro europeu de recuperação pós-pandemia) acaba em 2026.

**Unidade 4.** Para as pessoas, as mudanças de 2027 são em grande parte nominais. A atualização dos salários da Administração Pública, 2,3 %, é igual à inflação que o próprio relatório prevê para 2027, 2,3 %. As pensões têm a atualização regular que a lei manda, sem taxa escrita no relatório. O salário mínimo passa a 970 euros. O Complemento Solidário para Idosos sobe 50 euros, para 720 euros por mês. No IRS, os escalões são atualizados e o mínimo de existência também; a tabela de 2027 vai de 12,20 % a 48,00 %.

**Unidade 5.** A dívida pública deve descer de 87,5 % do produto interno bruto (o PIB) em 2026 para 84,5 % em 2027, abaixo do limiar que o ministro das Finanças chamou «principal preocupação». A descida de −3,0 pontos é maior do que a de 2026 não por causa do excedente nem do crescimento, mas porque o Estado compra menos ativos financeiros: o ajustamento défice-dívida cai de 3,1 pontos para 0,9 pontos. A Comissão Europeia, na primavera, antes da proposta, previa 86,0 % para 2027.

**Unidade 6.** O que este projeto conclui

**Unidade 7.** O Orçamento de 2027 é um orçamento de continuação. As medidas novas valem 79 milhões de euros a favor do saldo, segundo o quadro das medidas do relatório e a UTAO; as medidas já decididas antes dele custam −1 210 milhões. A UTAO escreve que esta é a terceira proposta consecutiva com poucas medidas novas e lê isso como uma estratégia de decidir as medidas fora do Orçamento, antes da sua apresentação.

**Unidade 8.** O saldo depende do perímetro em que se lê. Em contabilidade pública (o dinheiro que entra e sai nas caixas do Estado), 2027 fecha com −401 milhões de euros, −0,1 % do PIB, depois de 171 milhões em 2026. Em contabilidade nacional (a que a União Europeia usa, com os ajustamentos de 676 milhões que o relatório lista), fecha com 275 milhões, 0,1 % do PIB. Os dois números são verdadeiros, de medidas diferentes; quem diz «excedente» e quem diz «défice» pode estar a citar o mesmo relatório.

**Unidade 9.** O fim do PRR é a maior mudança das contas, e não está no quadro das medidas. Em contabilidade nacional, o PRR pesava 11 106 milhões de euros na despesa de 2026, 7,6 % do total, e 9 077 milhões na receita; em 2027 pesa 0. Sem o PRR, a receita cresce 4,3 % e a despesa 5,7 %. O investimento em contabilidade pública cai −18,4 %, e o relatório diz que o volume global de investimento «tenderá naturalmente a abrandar». O que isto faz ao Serviço Nacional de Saúde (o SNS) está no item da Saúde em «O que se discute», com a porta no fim deste estudo.

**Unidade 10.** Os juros sobem 18,7 % em contabilidade pública, para 8 575 milhões de euros, e 23,2 % em contabilidade nacional, para 8,2 mil milhões, segundo a UTAO, com a taxa de juro implícita a passar de 2,4 % para 2,9 %. É mais do que o custo de todas as medidas de 2027 juntas.

**Unidade 11.** Para os trabalhadores do Estado, 2027 é um ano de salário real parado, se a previsão de inflação se cumprir. A atualização é de 2,3 %, pelo relatório; a inflação prevista pelo mesmo relatório para 2027 é de 2,3 %; o Conselho das Finanças Públicas vê o risco de a inflação estar subestimada em 2026 e em 2027. A UTAO estima que, da atualização salarial de 1 231 milhões de euros, 590 milhões voltam ao Estado em IRS e 471 milhões em contribuições: 86,2 % do que o Estado paga a mais regressa-lhe.

**Unidade 12.** A meta da dívida que o ministro das Finanças disse («A dívida pública deve continuar a ser a nossa principal preocupação nas contas públicas. Temos uma redução de cerca de quatro pontos percentuais nos últimos anos e estaremos abaixo dos 85% do PIB [Produto Interno Bruto] em 2027», pela notícia de Miranda Sarmento: dívida pública abaixo dos 85% do PIB em 2027 é a "principal preocupação" do Governo) é alcançável, mas não pelo que se costuma dizer. O excedente primário contribui com −2,5 pontos para a descida, o efeito do crescimento e dos juros com −1,5 pontos (menos do que em 2026, −2,6), e o que faz a descida acelerar é o ajustamento défice-dívida, que passa de 3,1 pontos para 0,9 pontos, sobretudo por menor aquisição de ativos financeiros, segundo a UTAO. É um movimento de tesouraria, não do orçamento do ano. A meta assenta também num crescimento de 2,1 % que, segundo a UTAO, está acima das previsões de todas as outras instituições que ela cita, e em 300 milhões de euros de receita do combate à fraude nos combustíveis para os quais o relatório não apresenta fundamento.

**Unidade 13.** O que ninguém pode saber pelos documentos. Quantos contribuintes ganham quanto com a atualização dos escalões e da dedução específica: o relatório dá o custo total, −431 milhões de euros, e não a sua distribuição por rendimento. A taxa de atualização das pensões em 2027: o relatório diz «atualização regular nos termos da Lei» e não a escreve. Se a receita da fraude nos combustíveis se concretiza: a UTAO não encontra informação que permita avaliá-lo.

**Unidade 14.** O que podia funcionar melhor

**Unidade 15.** O relatório do Orçamento podia publicar a distribuição por escalão de rendimento do custo de cada medida de IRS: quem ganha quanto. Sem ela, o debate de «quem beneficia» faz-se sem números.

**Unidade 16.** A taxa de atualização regular das pensões para 2027 podia estar escrita no relatório, ao lado da despesa que a assume, em vez de remeter para a lei.

**Unidade 17.** A medida da fraude nos combustíveis, 300 milhões de euros, podia vir com a base de cálculo, como a UTAO pede.

**Unidade 18.** O Conselho das Finanças Públicas aponta o desfasamento entre as tabelas de retenção na fonte e as alterações do IRS como fonte de incerteza no rendimento disponível de 2027; tabelas alinhadas com a lei no primeiro mês do ano resolviam-no.

**Unidade 19.** As contas, em dois perímetros

**Unidade 20.** Em contabilidade pública, a receita total das administrações públicas passa de 140 304 milhões de euros em 2026 para 143 677 milhões em 2027, mais 2,4 %; a despesa total de 140 133 milhões para 144 078 milhões, mais 2,8 %. O saldo global passa de 171 milhões (0,1 % do PIB) para −401 milhões (−0,1 % do PIB), uma variação de −572 milhões. Dentro da despesa, os juros e outros encargos sobem de 7 225 milhões para 8 575 milhões (18,7 %), as despesas com pessoal de 32 034 milhões para 33 766 milhões (5,4 %), as transferências correntes para 62 677 milhões (5,4 %), e os investimentos descem de 12 764 milhões para 10 417 milhões (−18,4 %). Dentro da receita, os impostos diretos crescem 1,7 %, para 36 050 milhões; os impostos indiretos 5,5 %, para 42 981 milhões; as contribuições para a Segurança Social 5,7 %, para 39 356 milhões.

**Unidade 21.** Em contabilidade nacional, a que conta para as regras europeias, a receita total desce de 146 559 milhões de euros (45,0 % do PIB) para 143 356 milhões (42,1 %) e a despesa total de 146 472 milhões (45,0 %) para 143 081 milhões (42,0 %). As duas descem porque o PRR sai das contas: pesava 9 077 milhões na receita e 11 106 milhões na despesa de 2026, e em 2027 pesa 0 e 0. Sem o PRR, a receita sobe de 137 481 milhões para 143 356 milhões (4,3 %) e a despesa de 135 366 milhões para 143 081 milhões (5,7 %). Os juros passam de 6 669 milhões para 8 217 milhões (2,4 % do PIB); o saldo primário, antes dos juros, de 6 756 milhões (2,1 % do PIB) para 8 492 milhões (2,5 %). O saldo das administrações públicas fica em 275 milhões, 0,1 % do PIB, depois de 86 milhões em 2026.

**Unidade 22.** A passagem de um perímetro ao outro soma 676 milhões de euros em 2027, e os três ajustamentos maiores são as entidades públicas reclassificadas (3 073 milhões), as injeções de capital e empréstimos (−2 970 milhões) e a diferença entre juros pagos e devidos (−511 milhões). Em contabilidade pública, a Segurança Social tem um excedente de 8 383 milhões e a Administração Central um saldo de −9 815 milhões: é a Segurança Social que faz o conjunto fechar perto do zero.

**Unidade 23.** A UTAO lê o saldo assim: «O MF prevê um saldo orçamental de 0,0% do PIB em 2026 e de 0,1% do PIB em 2027 (Gráfico 7). Estes resultados correspondem ao quarto e ao quinto anos consecutivos com saldo positivo ou nulo, na sequência dos excedentes de 2023, 2024 e 2025. Numa perspetiva de longo prazo, o saldo orçamental médio no período 2005–2025 foi de −3,9% do PIB.» E sobre a revisão face ao plano de médio prazo: «O saldo orçamental previsto para 2027 reflete uma revisão em baixa face à previsão do POENMP divulgada em outubro de 2024. O saldo primário previsto para 2027 (2,5% do PIB) é inferior à previsão do POENMP (3,2%), devido sobretudo ao menor peso da receita total; a despesa com juros não entra no cálculo do saldo primário e agrava apenas o saldo orçamental. O peso da receita para 2027 (42,1% do PIB) é inferior ao que constava no POENMP (43,0%). Tendo por referência a estimativa para 2026, esta apresenta valores diferentes, mas próximos, dos que constavam no POENMP para os diversos indicadores que compõem o saldo orçamental (Tabela 4).»

**Unidade 24.** O cenário em que tudo isto assenta: o PIB cresce 2,3 % em 2026 e 2,1 % em 2027; o consumo privado 2,1 % em 2027; o investimento abranda de 5,7 % para 2,0 %; a inflação (o índice harmonizado) passa de 2,9 % para 2,3 %; o emprego cresce 1,4 %, o desemprego fica em 5,7 % e as remunerações por trabalhador sobem 4,5 %. A Comissão Europeia, na primavera de 2026, previa 1,8 % de crescimento e um saldo de −0,4 % do PIB para 2027.

**Unidade 25.** As medidas: o que é novo e o que já vinha de trás

**Unidade 26.** O SIFIDE é o Sistema de Incentivos Fiscais à Investigação e Desenvolvimento Empresarial. O quadro das principais medidas com impacto em 2027 (o Quadro 3.2 do relatório) soma −1 132 milhões de euros de impacto no saldo: −84 milhões do lado da receita e 1 048 milhões do lado da despesa. Do lado da receita: o IVA 206 milhões, que junta «Habitação - redução IVA construção de 23% para 6% (i)» (−94 milhões) e «Combate à fraude no setor dos combustíveis» (300 milhões); o IRS −477 milhões, que junta «Habitação - redução IRS rendas moderadas de 25% para 10% (i)» (−209 milhões), «Atualização dedução específica e escalões (i)» (−431 milhões), «Atualização do limite do mínimo de existência» (−121 milhões) e a receita que o aumento dos salários traz (284 milhões); o IRC −176 milhões, que junta «Redução taxa em 1 p.p. (i)» (−300 milhões) e «SIFIDE indireto (reversão) (i)» (124 milhões); e as contribuições sociais que o aumento dos salários traz (363 milhões). Do lado da despesa: as despesas com pessoal 948 milhões (o acordo de rendimentos 587 milhões, o aumento do salário mínimo 116 milhões, os acordos salariais 244 milhões) e as prestações sociais 100 milhões, que são o reforço do Complemento Solidário para Idosos (100 milhões).

**Unidade 27.** O quadro marca dez das suas linhas com «(i)», e a nota do quadro diz o que a marca é: «Nota: (i) invariante.» São as medidas que já estavam em vigor antes desta proposta. Somadas, as linhas marcadas valem −263 milhões de euros na receita e 947 milhões na despesa, −1 210 milhões no saldo. As três linhas sem marca, o combate à fraude nos combustíveis, o mínimo de existência e o Complemento Solidário para Idosos, somam 79 milhões a favor do saldo. A UTAO chega ao mesmo número: «O MF prevê que em 2027 as novas medidas de política orçamental tenham um impacto residual no saldo orçamental avaliado em +79 M€ (+0,02% do PIB). Na receita, estas medidas terão um impacto positivo no saldo de +179 M€ (+0,05% do PIB); na despesa, o impacto das medidas, é negativo em 100 M€ (0,03% do PIB). Estes dados estão compilados na Tabela 9.» E diz porquê: «À semelhança do observado nas Propostas de Orçamento do Estado dos dois anos anteriores, a POE/2027 apresenta um número reduzido de novas medidas e um impacto agregado limitado sobre o saldo orçamental. O Quadro 3.2 do relatório da POE/2027 identifica apenas três novas medidas. Uma das justificações prende-se com a estratégia do Governo de adotar medidas de política orçamental fora do âmbito do Orçamento do Estado e previamente à sua apresentação, como sucedeu, por exemplo, com a redução em 1 p.p. da taxa de IRC e da taxa de IRS sobre rendas moderadas (de 25% para 10%). Após a sua adoção, estas medidas passam a integrar o cenário de políticas invariantes. Neste contexto, o reduzido impacto orçamental das novas medidas indica que o cenário orçamental para 2027 assenta essencialmente nos efeitos das medidas permanentes adotadas em anos anteriores.»

**Unidade 28.** Sobre o IVA, o Livre, pela notícia de Primeiro-ministro rejeita totalmente descer o IVA dos atuais 23% para 21%: «Assim, a deputada disse que o seu partido "apresentará esta descida já para o Orçamento do Estado 2027, de forma progressiva".» É uma proposta fora do quadro das medidas, e o título da notícia diz a resposta do primeiro-ministro.

**Unidade 29.** Fora do quadro das medidas estão as políticas invariantes, as decisões já em vigor cujo custo continua a crescer. A UTAO: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» E sobre a revisão desse quadro entre agosto e outubro: «O relatório da POE/2027 divulgou um quadro de políticas invariantes revisto face ao apresentado em final de agosto. Com efeito, o impacto orçamental das políticas invariantes passou de 4783 M€ para 5411 M€. Para esta deterioração adicional, destaca-se a despesa com juros (de 776 M€ para 1548 M€) e o investimento público excluído de PRR (de 433 M€ para 617 M€). Em sentido oposto, evidencia-se a revisão da despesa com pensões (de 1993 M€ para 1475 M€) e a passagem do reforço do complemento solidário para idosos (CSI; 100 M€) do QPI para as novas medidas (Tabela 9).»

**Unidade 30.** O que muda para quem trabalha por conta de outrem

**Unidade 31.** O IRS de 2027 tem nove escalões, com as taxas normais de 12,20 % até 8 666 euros de rendimento coletável, 15,20 % até 13 075 euros, 20,70 % até 18 530 euros, 23,60 % até 23 985 euros, 30,60 % até 30 538 euros, 34,60 % até 44 762 euros, 43,10 % até 48 373 euros, 44,60 % até 89 995 euros, e 48,00 % acima disso, pelo artigo 68.º do Código do IRS na redação da proposta. Em 2026 os limites eram de 8 342, 12 587, 17 838, 23 089, 29 397, 43 090, 46 566 e 86 634 euros: a atualização dos limites é de 3,9 % em todos os escalões, e as taxas mudam de 12,50 % para 12,20 %, de 15,70 % para 15,20 %, de 21,20 % para 20,70 %, de 24,10 % para 23,60 %, de 31,10 % para 30,60 % e de 34,90 % para 34,60 %; as restantes não mudam, pelo artigo 68.º em vigor em 2026. As taxas não constam do quadro das medidas como alteração: o que custa −431 milhões de euros é a atualização dos escalões e da dedução específica, e o que custa −121 milhões é a atualização do limite do mínimo de existência, o rendimento abaixo do qual não se paga IRS.

**Unidade 32.** O relatório conta este Orçamento como «O Orçamento do Estado para 2027 apresentará a sexta redução generalizada de IRS, considerando a redução das taxas em junho de 2024, junho de 2025, no Orçamento do Estado para 2026 e em setembro de 2026, a que acresce a atualização dos respetivos escalões nos Orçamentos do Estado para 2025, 2026 e 2027.» O primeiro-ministro, na comunicação do Governo: «Na área fiscal, Luís Montenegro destacou as seis descidas consecutivas do IRS, num valor global de 2 800 milhões de euros, e o impacto de 700 milhões de euros associado ao IRS Jovem.» A conta de 2027 é mais pequena do que a soma das seis: o IRS perde −477 milhões de euros em 2027 depois de contar os 284 milhões que o aumento dos salários traz de receita nova. O Conselho das Finanças Públicas, sobre o que isto faz ao rendimento disponível: «Por outro lado, o desfasamento entre os ajustamentos das tabelas de retenção na fonte e as alterações legislativas em sede de IRS tem sido significativo, introduzindo incerteza quanto à evolução dos reembolsos e das notas de cobrança e, por essa via, quanto ao rendimento disponível das famílias em 2027.» E sobre o peso das medidas: «Ainda assim, face à reduzida dimensão das medidas de política comunicadas ao CFP para 2027 – inferior a 0,1% do PIB – o seu impacto não se afigura relevante para a comparação.»

**Unidade 33.** As posições: o JPP, pela notícia de JPP pede maior protecção das famílias não abrangidas pela descida de IRS: «JPP pede maior protecção das famílias não abrangidas pela descida de IRS» O Bloco de Esquerda, pela notícia de OE2027: BE diz que Orçamento “dá migalhas a quem trabalha” e beneficia os mais ricos: «José Manuel Pureza considera que o Orçamento para 2027 “dá migalhas” aos trabalhadores, beneficia os mais ricos e ignora problemas estruturais.» O PCP, na declaração de Paula Santos: «Acrescem ainda outros benefícios fiscais contrários ao interesse nacional, como os 2228 milhões de euros atribuídos ao regime dos residentes não habituais; os 1067 milhões de euros associados ao IRS jovem (que favorece quem tem rendimentos mais elevados), ou os 209 milhões de euros de rendimentos prediais dos senhorios que apliquem rendas até 2300€.» Os números que o PCP cita (os benefícios do regime dos residentes não habituais, do IRS Jovem e das rendas) são do PCP; este estudo não os conferiu na fonte e por isso não os repete como seus. Da Iniciativa Liberal e do PAN não há, nos documentos deste estudo, uma posição datada depois da entrega da proposta; a pesquisa não a encontrou nas fontes primárias, o que não quer dizer que não exista.

**Unidade 34.** O que muda para quem ganha o salário mínimo e para quem trabalha para o Estado

**Unidade 35.** A remuneração mínima mensal garantida (a RMMG), pelo relatório: «Em 2027, o Governo da AD elevará o salário mínimo (RMMG) para os 970 euros, concretizando o terceiro aumento consecutivo desde que tomou posse o XXIV Governo Constitucional, em 2024, ano em que a RMMG se cifrava nos 820 euros.» São mais 150 euros por mês do que em 2024. Face a 2026, em que a remuneração mínima mensal garantida era de 920,00 euros, são mais 50 euros, 5,4 %. O custo para o Estado como empregador, 116 milhões de euros, está no quadro das medidas. O PCP, na declaração de Paula Santos: «O Governo quer limitar o SMN aos 970€ em 2027, quando em Espanha esse valor ultrapassou os 1220€ em 2026.» O Boletín Oficial del Estado (o BOE) fixa o salário mínimo espanhol de 2026 em 1 221 euros por mês.

**Unidade 36.** Para quem trabalha para o Estado, o relatório: «Ao nível da despesa, destaca-se a massa salarial dos trabalhadores da Administração Pública (948 milhões de euros), que inclui uma atualização das remunerações em 2,3%, e o reforço do CSI, com um impacto de 100 milhões de euros.» A inflação prevista pelo mesmo relatório para 2027 é de 2,3 %: a atualização e a inflação prevista são o mesmo número, e o salário real fica onde está se a previsão se cumprir. O Conselho das Finanças Públicas: «Ponderados os riscos, o cenário macroeconómico subjacente à POE/2027 afigura-se globalmente como estatisticamente provável. Ainda assim, como fundamentado no presente Parecer, é de notar a existência de riscos descendentes para a previsão de crescimento do PIB real em 2027. No que respeita à inflação, destaca-se uma potencial subestimação tanto em 2026, como em 2027.» O PCP: «Em relação aos trabalhadores da Administração Pública, prevê-se uma atualização nos salários de 2,3%, valor que poderá ficar abaixo da inflação, não permitindo a valorização do poder de compra, e um aumento de apenas 15 cêntimos no valor do subsídio de alimentação.» A UTAO mede o custo e o retorno: «A atualização salarial dos funcionários das Administrações Públicas prevista para 2027 é de 1231 M€, a qual acarreta receita de IRS (590 M€) e de contribuições sociais (471 M€). A atualização salarial inclui o aumento decorrente das progressões, promoções, a subida do Rendimento Mínimo Mensal Garantido (RMMG), os acordos salariais com carreiras profissionais e o acordo de rendimentos.» Ou seja, de 1 231 milhões de euros de atualização, 590 milhões voltam em IRS e 471 milhões em contribuições, 86,2 % do total. E sobre o emprego público: «O MF propõe estabilizar o emprego público em 2027 em 768,4 mil trabalhadores (Relatório do MF, Quadro 4.42), nível idêntico ao de junho de 2026 (768 378, DGAEP), o que equivale a não haver crescimento líquido do emprego a partir de junho. Segundo dados provisórios da DGAEP, o nível de junho de 2026 está 1,0% (+7390) acima de junho de 2025 e 0,3% (+2100) acima de dezembro de 2025. A estabilização do emprego contém a massa salarial; entradas superiores às saídas aumentariam o emprego e a despesa com pessoal, que a POE/2027 já prevê crescer 5,3% (Tabela 7).»

**Unidade 37.** O que muda para quem recebe pensão

**Unidade 38.** O relatório não escreve a taxa de atualização das pensões para 2027: «Na estimativa de despesa com pensões considerou-se a atualização regular nos termos da Lei.» A despesa com prestações sociais cresce assim: «Prestações sociais (3,8%), refletindo nomeadamente a estimativa da atualização regular das pensões, o reforço anual do complemento solidário para idosos que tem ocorrido desde 2024 e a atualização dos valores de referência das outras prestações sociais.» A medida nova é o Complemento Solidário para Idosos: «A despesa com a prestação do CSI deverá atingir o montante de 709,7 milhões de euros, uma variação anual de 15,6% face a 2026, refletindo principalmente o aumento do valor de referência em 50 euros/mês em 2027, para 720 euros, no âmbito da sua trajetória de convergência para 870 euros em 2029.» O valor de referência passa, portanto, de 670 euros para 720 euros por mês, a caminho de 870 euros em 2029, com um custo de 100 milhões de euros no quadro das medidas. O suplemento extraordinário de pensões e a descida das taxas de IRS até ao sexto escalão são de 2026, não de 2027, e o Conselho das Finanças Públicas estima-os assim: «O MF estima um valor de 400 M€ quer para o suplemento extraordinário para pensionistas quer para a redução das taxas de IRS até ao 6.º escalão, com efeitos retroativos a janeiro (cerca de 0,25% do PIB no seu conjunto).» O primeiro-ministro: «Entre as medidas dirigidas às famílias, salientou o aumento de 50 euros no Complemento Solidário para Idosos, o complemento extraordinário das pensões e a atualização dos limites dos escalões de IRS e das deduções fiscais.» O PS, por José Luís Carneiro: «Na área das pensões, o líder do PS defendeu uma revisão dos mecanismos de atualização que assegure dois princípios: acompanhar a inflação e favorecer as pensões mais baixas.» O PCP: «São dados que confirmam as possibilidades para um aumento significativo de pensões e prestações sociais que o Governo continua a recusar, e não a mera atualização que decorre do cumprimento da lei.»

**Unidade 39.** O que muda para quem arrenda ou compra casa

**Unidade 40.** As duas medidas da habitação com impacto em 2027 vêm do decreto-lei de maio de 2026, não desta proposta: «Habitação - redução IVA construção de 23% para 6% (i)» (−94 milhões de euros de receita a menos) e «Habitação - redução IRS rendas moderadas de 25% para 10% (i)» (−209 milhões). O decreto-lei descreve-as assim: «Do conjunto de alterações, destaca-se a aplicação, com carácter temporário, da taxa reduzida de IVA de 6 % às empreitadas de construção e reabilitação de imóveis para habitação, a redução das taxas de imposto sobre o rendimento das pessoas singulares (IRS) e de imposto sobre o rendimento das pessoas coletivas (IRC) aplicáveis a rendimentos prediais decorrentes de contratos de arrendamento destinados exclusivamente ao arrendamento para habitação, incluindo contratos de arrendamento já em curso, bem como a exclusão de tributação, em sede de IRS, das mais-valias imobiliárias quando haja reinvestimento em imóveis destinados ao arrendamento para habitação, com vista a reforçar o investimento e a disponibilização de oferta habitacional.» A taxa reduzida aplica-se às empreitadas que o decreto-lei adita à lista I do Código do IVA (o seu artigo 8.º), com as condições do artigo 10.º (os limites de preço de venda e de renda), e os efeitos têm as datas do artigo 18.º. As posições: o PS: «Arrendatários: dedução das rendas no IRS aumentada para 1.000 euros a partir de 2027.» O Chega, pela notícia de Ventura acusa PS de hipocrisia na habitação: “Montenegro falhou brutalmente, mas os socialistas fizeram pior”: «André Ventura defende um pacote de emergência com benefícios fiscais, apoios às rendas e menos burocracia.» O PCP: «Na habitação, reduz-se em 6% o investimento em relação ao orçamentado no ano passado, num contexto em que a habituação pública continua degradada e a ser residual.» O que o investimento em habitação faz em 2027 nos programas do Orçamento não está nas linhas deste estudo, e fica para o estudo da habitação deste projeto.

**Unidade 41.** O que muda para as empresas

**Unidade 42.** A taxa do IRC desce para 18 % em 2027, depois de 19 % em 2026, pela lei de novembro de 2025 que fixou o percurso da taxa (Lei n.º 64/2025, de 7 de novembro): «Artigo 3.º Norma transitória 1 — A taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC, na redação conferida pela presente lei, aplica-se aos períodos de tributação que se iniciem em ou após 1 de janeiro de 2028. 2 — Nos períodos de tributação que se iniciem durante o ano de 2026, a taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC é de 19 %. 3 — Nos períodos de tributação que se iniciem durante o ano de 2027, a taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC é de 18 %. 4 — A taxa prevista no n.º 2 do artigo 87.º do Código do IRC, na redação conferida pela presente lei, aplica-se aos períodos de tributação que se iniciem em ou após 1 de janeiro de 2026.» O relatório descreve o percurso como «Destaca-se ainda o alargamento do IRS Jovem; a redução do IRC de 21% em 2024 para 17% em 2028; a isenção de imposto municipal sobre as transmissões onerosas de imóveis (IMT) e imposto do selo na aquisição da primeira habitação por parte dos jovens até aos 35 anos; a redução do imposto sobre o valor acrescentado (IVA) de 23% para 6% na habitação e a redução do IRS de 25% para 10% nas rendas moderadas.» O custo de 2027 no quadro das medidas é de −300 milhões de euros, em parte compensado pela reversão do Sistema de Incentivos Fiscais à Investigação e Desenvolvimento Empresarial (o SIFIDE) indireto, 124 milhões, num total de −176 milhões. O primeiro-ministro: «Referiu também a redução do IRC e sublinhou que, nos 920 dias desde a primeira tomada de posse do Governo, não houve aumentos de impostos.» O líder do PSD no Parlamento, pela notícia de "Baile" na AR com OE em destaque: A "dança" de Montenegro e oposição: «Enquanto o Governo do PS aumentava impostos, defendeu Hugo Soares, "este Governo não aumentou um único imposto nos orçamentos que apresentou".» O PS, por José Luís Carneiro: «Para o líder do PS, a redução deste imposto deve ser “dirigida a prioridades de política económica e não para todos e de forma cega”.» O PCP: «O Governo fala em descida de impostos, mas a realidade é esta: o único imposto cuja receita diminuiu foi o IRC (imposto que incide sobre os rendimentos de capital), no próximo ano – com uma taxa de 18% - voltará a descer e a que se somam os benefícios fiscais de 1868 milhões de euros (apenas 1% das empresas absorvem mais de 50% destes benefícios).» O CDS, pela notícia de "Temos um bom Orçamento para 2027", garante o CDS-PP: «"Temos um bom Orçamento para 2027", garante o CDS-PP» Sobre a frase «não houve aumentos de impostos»: no quadro das medidas, as linhas de receita que crescem são a receita do combate à fraude (300 milhões), a receita que o aumento dos salários traz em IRS (284 milhões) e em contribuições (363 milhões), e a reversão do SIFIDE (124 milhões); nenhuma é uma subida de taxa.

**Unidade 43.** A dívida: o que desce e porquê

**Unidade 44.** O relatório: «A dívida pública, em percentagem do PIB, deverá manter assim a trajetória decrescente, passando de 87,5% em 2026 para 84,5% em 2027.» E o objetivo: «A dívida pública continuará a reduzir-se, visando ficar abaixo dos 80% do produto interno bruto (PIB) no final da década.» O ministro das Finanças, a 13 de outubro, pela notícia de Miranda Sarmento: dívida pública abaixo dos 85% do PIB em 2027 é a "principal preocupação" do Governo: «A dívida pública deve continuar a ser a nossa principal preocupação nas contas públicas. Temos uma redução de cerca de quatro pontos percentuais nos últimos anos e estaremos abaixo dos 85% do PIB [Produto Interno Bruto] em 2027» Em 2025 a dívida foi de 89,2 % do PIB; desce −1,6 pontos em 2026 e −3,0 pontos em 2027, para 84,5 %.

**Unidade 45.** O quadro da dívida do relatório decompõe a descida de 2027: o saldo primário contribui com −2,5 pontos, o efeito dinâmico (o crescimento nominal menos os juros) com −1,5 pontos, de que o efeito dos juros são 2,4 pontos para cima e o efeito do PIB −3,9 pontos para baixo, e o ajustamento défice-dívida com 0,9 pontos para cima. Em 2026 o saldo primário contribuía com −2,1 pontos, o efeito dinâmico com −2,6 pontos e o ajustamento com 3,1 pontos. A UTAO explica: «O reforço do excedente primário em 2027 não será suficiente para compensar a menor redução do rácio da dívida proporcionada pelo efeito dinâmico. Segundo a POE/2027 (Tabela 16), o saldo primário contribuirá para uma redução de 2,5 p.p., face a 2,1 p.p. em 2026. Em contrapartida, o abrandamento do PIB nominal e o aumento do custo médio da dívida limitarão a redução proporcionada pelo efeito dinâmico a 1,5 p.p., face a 2,6 p.p. no ano anterior. O contributo do crescimento nominal para a descida do rácio passará de 4,6 p.p. para 3,9 p.p., sobretudo devido à desaceleração do deflator do PIB e, em menor medida, do crescimento real, enquanto os juros, em sentido contrário, aumentarão o rácio em 2,4 p.p., face a 2,0 p.p. O contributo do crescimento nominal continuará, assim, a superar o dos juros, mas com uma diferença menor, tornando a redução do rácio mais dependente do excedente primário. Em conjunto, estas duas componentes deverão reduzir o rácio em cerca de 4,0 p.p. em 2027, face a 4,7 p.p. em 2026, antes de considerado o ajustamento défice-dívida.» E: «Apesar do menor contributo redutor do efeito dinâmico, a descida do rácio deverá acelerar em 2027, sobretudo devido à redução do ajustamento défice-dívida, que inclui operações financeiras que alteram a dívida sem afetarem na mesma medida o saldo orçamental. Segundo a POE/2027, este ajustamento deverá acrescentar 0,9 p.p. ao rácio, face a 3,1 p.p. em 2026. Esta diminuição reflete sobretudo a redução da aquisição líquida de ativos financeiros, de 9,3 mil M€ para 0,9 mil M€, em particular as menores aplicações em numerário e depósitos e a ausência de aquisições líquidas de títulos exceto ações em 2027. O aumento dos restantes contributos para o ajustamento compensa parcialmente esta redução. Este ajustamento permanece positivo e superior ao excedente orçamental previsto (0,1% do PIB), pelo que o stock nominal da dívida continuará a aumentar.» Em euros, segundo a UTAO, o stock passa de 284,8 mil milhões no fim de 2026 para 287,8 mil milhões em 2027, com acréscimos de 9,7 e 2,9 mil milhões: a dívida continua a subir em euros, e desce em percentagem porque o PIB sobe mais.

**Unidade 46.** A Comissão Europeia, na previsão da primavera de 2026, antes de a proposta existir, apontava 87,6 % para 2026 e 86,0 % para 2027, 1,5 pontos acima do Orçamento. O plano orçamental de médio prazo de outubro de 2024 apontava 87,2 % para 2027, 2,7 pontos acima: o Orçamento está à frente do plano. Na União Europeia, pela atualização de abril de 2026 do Eurostat, Portugal tinha em 2025 uma dívida de 89,7 % do PIB contra 81,7 % na União, 8,0 pontos acima, entre a Estónia (24,1 %) e a Grécia (146,1 %), e abaixo de Espanha (100,7 %); a notificação do INE de setembro de 2026, mais recente, dá 89,2 % para o mesmo ano, e é esse o número do relatório. No saldo, Portugal teve 0,7 % do PIB em 2025 contra −3,1 % na União, entre a Roménia (−7,9 %) e Chipre (3,4 %).

**Unidade 47.** O quadro e a prosa da previsão da Comissão Europeia divergem no valor de 2026. A prosa diz: «It is forecast to reach 86.7% of GDP in 2026 and 86.0% of GDP in 2027 on the back of persisting primary balance surpluses and favourable growth-interest rate differentials.» O quadro dá 87,6 %.

**Unidade 48.** Os juros: «A despesa com juros apresenta uma subida prevista de 23,2% em 2027, o que reflete uma variação nominal de 1,5 mil M€, ascendendo a 8,2 mil M€. Caso se concretize a previsão, a taxa de juro implícita (juros em percentagem da dívida pública) deverá subir de 2,4% em 2026 para 2,9% em 2027. É de referir que o máximo da série estatística para os juros foi atingido em 2014, acima do valor previsto para 2027 (a taxa de juro implícita foi de 3,6% em 2014).»

**Unidade 49.** Os riscos que as instituições apontam

**Unidade 50.** A UTAO, sobre o crescimento: «Um crescimento económico inferior ao projetado constitui um risco para a concretização do saldo orçamental, em particular num cenário para 2027 em que a despesa corrente cresce 6,6% e a receita corrente 4,5% (Tabela 13). A POE/2027 assenta num crescimento real do PIB de 2,1%, acima das previsões do BdP, da CE e do CFP (1,8%), da OCDE (1,7%) e do FMI (1,6%) (capítulo 2), num enquadramento marcado pela incerteza geopolítica e pelos riscos associados à evolução dos preços da energia. Um abrandamento da atividade económica superior ao implícito no cenário orçamental traduzir-se-ia numa arrecadação inferior à prevista de impostos sobre o rendimento e o consumo, bem como de contribuições sociais, condicionando a execução da receita e colocando pressão sobre o saldo orçamental. O cenário depende ainda da execução do PT2030, cujos recebimentos se prevê que aumentem 65% em 2027 (+1948 M€) quando, a 31 de agosto de 2026, a execução financeira era de 21,7% da dotação, e da conclusão do PRR, cujo último pedido de pagamento (96 marcos e metas) estava em avaliação (Caixa 1).» Sobre a receita da fraude: «Subexecução da medida de combate à fraude no setor dos combustíveis. A POE/2027 prevê uma receita adicional de 300 M€ associada a esta medida, sem, contudo, apresentar informação que permita fundamentar a estimativa ou avaliar a sua exequibilidade. Subsiste, assim, um risco de concretização inferior ao previsto, atendendo aos antecedentes de medidas de combate à fraude cuja execução efetiva se revelou menor, ou relativamente às quais a Conta Geral do Estado não disponibilizou informação suficiente para aferir os resultados alcançados.» Sobre o Serviço Nacional de Saúde: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS). A persistência de défices na execução financeira do SNS, apesar dos sucessivos reforços das dotações orçamentais e das recorrentes injeções de capital destinadas a regularizar pagamentos em atraso, evidencia a manutenção de pressões sobre a despesa que poderão não estar integralmente acomodadas no financiamento previsto para 2027. Estas pressões incidem, designadamente, sobre as despesas com pessoal e os consumos intermédios (Tabela 15), podendo traduzir-se em necessidades adicionais de financiamento durante o ano e constituir um risco descendente para o saldo orçamental das AP.» Sobre os juros: «A despesa com juros cresce 23,2% em contabilidade nacional em 2027 (18,7% em contabilidade pública, Tabela 13). Persiste o risco de encargos superiores aos projetados, que depende do volume de dívida a refinanciar em 2027 e das taxas de juro das novas emissões.» Sobre as responsabilidades contingentes, onde entram as parcerias rodoviárias do item das parcerias de «O que se discute»: «As responsabilidades contingentes constituem outro risco: decisões arbitrais desfavoráveis no âmbito das PPP e garantias às linhas de crédito criadas na sequência das tempestades (2000 M€ de crédito e 571 M€ de encargos plurianuais potenciais, Caixa 3). A prorrogação até ao final de 2027 da garantia pessoal do Estado ao crédito à habitação de jovens agrava-o: o stock de garantias ao abrigo do regime mais do que duplicou entre dezembro de 2025 e maio de 2026, de 449 M€ para 926 M€ (Tabela 19).» Sobre os mercados: «A instabilidade política e a deterioração das finanças públicas francesas (défice de 5,1% do PIB em 2025 e de 5,4% previsto pelo Governo francês para 2026) poderão intensificar as tensões no mercado europeu de dívida soberana e elevar os prémios de risco e os custos de financiamento de Portugal. Acresce o risco quanto à trajetória da despesa líquida: a Comissão Europeia estima um desvio de 2,1% do PIB no final de 2027, acima do limiar de 0,6% (capítulo 3), e, na análise de sustentabilidade do MF, a probabilidade de o rácio da dívida em 2033 exceder o de 2028 é de 22,9% (capítulo 5).» Sobre os fenómenos naturais: «A ocorrência de novos fenómenos naturais extremos em 2027 poderá exigir a adoção de medidas extraordinárias de apoio público destinadas a mitigar os danos causados e a assegurar a recuperação dos setores e das infraestruturas afetados. A eventual necessidade de financiar estas medidas constituiria uma pressão adicional sobre a despesa pública, configurando um risco orçamental. A Caixa 3 apresenta os apoios já aprovados na sequência das tempestades de 2026.» O Conselho das Finanças Públicas, sobre o emprego e a receita: «A previsão para o emprego (1,4%) é a mais elevada de entre as instituições de referência e situa-se no limite superior do intervalo de confiança a 30%. Assenta num crescimento da população ativa (1,3%) superior ao da população em idade ativa (0,6%), o que pressupõe um aumento expressivo da taxa de participação. Também para as remunerações por trabalhador, a previsão do MF é a mais elevada de entre as instituições de referência. O efeito conjugado destes dois elementos pode resultar em riscos acrescidos para a receita decorrente da massa salarial.» E sobre as medidas: «O MF estima um impacto macroeconómico reduzido das medidas de apoio ao rendimento das famílias com efeito no final de 2026. As medidas previstas para 2027 terão um impacto reduzido.»

**Unidade 51.** O que as afirmações deixam de fora

**Unidade 52.** «O Orçamento dá migalhas»: a frase não tem número, e as medidas novas para as pessoas valem −121 milhões de euros no mínimo de existência e 100 milhões no Complemento Solidário para Idosos, ao lado de 947 milhões já decididos nos salários. «O único imposto cuja receita diminuiu foi o IRC»: no quadro das medidas, o IRC perde −176 milhões em 2027 e o IRS −477 milhões; na conta, os impostos diretos no seu conjunto crescem 1,7 %. Nenhum partido, nos documentos deste estudo, fala dos juros, que crescem 1 350 milhões de euros em 2027, mais do que todas as medidas juntas custam ao saldo.

**Unidade 53.** O calendário

**Unidade 54.** A proposta foi entregue a 8 de outubro; o debate na generalidade é a 27 e 28 de outubro; a especialidade de 18 a 23 de novembro; a votação final global a 24 de novembro. Este estudo lê a proposta; o que a especialidade mudar entra numa revisão datada.

**Unidade 55.** O que se discute: a Saúde no Orçamento

**Unidade 56.** O que se discute: as parcerias rodoviárias

### Edição en

**Unidade 0.** The 2027 Budget: what changes, and for whom

**Unidade 1.** The proposed State Budget for 2027, delivered to Parliament on 8 October 2026, read by what it does to people: to employees, to those on the minimum wage, to those who work for the State, to pensioners, to those who rent or buy a home, to companies, and to the State that pays the debt. With the preliminary appraisal of the Parliament's budget office (the Unidade Técnica de Apoio Orçamental, UTAO), the Public Finance Council's (Conselho das Finanças Públicas, CFP) opinion on the forecasts, the European Commission's spring forecast, and the parties' positions as they were said, each with its document.

**Unidade 2.** In short

**Unidade 3.** The 2027 Budget changes little by itself. The three new measures the report identifies, the expected revenue from fighting fraud in the fuel sector, the update of the personal income-tax (IRS) exemption threshold (the «mínimo de existência») and the increase of the Solidarity Supplement for the Elderly (CSI), add 79 million euros to the balance. What weighs on the 2027 balance, −1,210 million euros, are measures decided before this Budget: the personal income tax cut of September 2026 and the update of the brackets, the corporate income tax (IRC) cut fixed by law in November 2025, the reduced value added tax (VAT, IVA in Portuguese) on construction and the reduced income tax on moderate rents from the housing decree-law of May 2026, the incomes agreement and the public-sector wage agreements. And what changes most in the accounts is not in the table of measures: interest on the debt rises by 1,350 million euros in public accounting, to 8,575 million, and investment falls by −2,347 million, to 10,417 million, because the Recovery and Resilience Plan (the PRR, the European post-pandemic recovery money) ends in 2026.

**Unidade 4.** For people, the 2027 changes are largely nominal. The update of public administration wages, 2.3 %, equals the inflation the report itself forecasts for 2027, 2.3 %. Pensions get the regular update the law prescribes, with no rate written in the report. The minimum wage rises to 970 euros. The Solidarity Supplement for the Elderly rises by 50 euros, to 720 euros a month. In the personal income tax, the brackets are updated and so is the exemption threshold; the 2027 table runs from 12.20 % to 48.00 %.

**Unidade 5.** Public debt is to fall from 87.5 % of gross domestic product (GDP, PIB in Portuguese) in 2026 to 84.5 % in 2027, below the threshold the finance minister called the «principal preocupação». The fall of −3.0 points is larger than in 2026 not because of the surplus or of growth, but because the State buys fewer financial assets: the deficit-debt adjustment falls from 3.1 points to 0.9 points. The European Commission, in the spring, before the proposal, forecast 86.0 % for 2027.

**Unidade 6.** What this project concludes

**Unidade 7.** The 2027 Budget is a continuation budget. The new measures are worth 79 million euros to the balance, by the report's table of measures and by the UTAO; the measures decided before it cost −1,210 million. The UTAO writes that this is the third consecutive proposal with few new measures, and reads it as a strategy of deciding measures outside the Budget, before its presentation.

**Unidade 8.** The balance depends on the perimeter it is read in. In public accounting (the money that enters and leaves the State's tills), 2027 closes with −401 million euros, −0.1 % of GDP, after 171 million in 2026. In national accounts (the ones the European Union uses, with the 676 million of adjustments the report lists), it closes with 275 million, 0.1 % of GDP. Both numbers are true, of different measures; whoever says «surplus» and whoever says «deficit» may be quoting the same report.

**Unidade 9.** The end of the PRR is the largest change in the accounts, and it is not in the table of measures. In national accounts, the PRR weighed 11,106 million euros in the expenditure of 2026, 7.6 % of the total, and 9,077 million in revenue; in 2027 it weighs 0. Without the PRR, revenue grows 4.3 % and expenditure 5.7 %. Investment in public accounting falls −18.4 %, and the report says the overall volume of investment «tenderá naturalmente a abrandar». What this does to the National Health Service (SNS) is in the Health item of «Under discussion», with the door at the end of this study.

**Unidade 10.** Interest rises 18.7 % in public accounting, to 8,575 million euros, and 23.2 % in national accounts, to 8.2 thousand million, according to the UTAO, with the implicit interest rate moving from 2.4 % to 2.9 %. That is more than the cost of all the 2027 measures together.

**Unidade 11.** For the State's employees, 2027 is a year of flat real wages, if the inflation forecast holds. The update is 2.3 %, by the report; the inflation the same report forecasts for 2027 is 2.3 %; the Public Finance Council sees a risk that inflation is underestimated in 2026 and in 2027. The UTAO estimates that, of the wage update of 1,231 million euros, 590 million return to the State in income tax and 471 million in social contributions: 86.2 % of what the State pays out comes back to it.

**Unidade 12.** The debt target the finance minister stated («A dívida pública deve continuar a ser a nossa principal preocupação nas contas públicas. Temos uma redução de cerca de quatro pontos percentuais nos últimos anos e estaremos abaixo dos 85% do PIB [Produto Interno Bruto] em 2027», by the news report Miranda Sarmento: dívida pública abaixo dos 85% do PIB em 2027 é a "principal preocupação" do Governo) is reachable, but not for the reason usually given. The primary surplus contributes −2.5 points to the fall, the effect of growth and interest −1.5 points (less than in 2026, −2.6), and what makes the fall accelerate is the deficit-debt adjustment, which goes from 3.1 points to 0.9 points, mostly through lower acquisition of financial assets, according to the UTAO. It is a treasury movement, not the year's budget. The target also rests on growth of 2.1 % which, according to the UTAO, is above the forecasts of every other institution it cites, and on 300 million euros of revenue from fighting fuel fraud for which the report gives no basis.

**Unidade 13.** What nobody can know from the documents. How many taxpayers gain how much from the update of the brackets and of the specific deduction: the report gives the total cost, −431 million euros, and not its distribution by income. The rate of the 2027 pension update: the report says «atualização regular nos termos da Lei» and does not write it. Whether the fuel-fraud revenue materialises: the UTAO finds no information that allows it to be assessed.

**Unidade 14.** What could work better

**Unidade 15.** The Budget report could publish the distribution by income bracket of the cost of each income-tax measure: who gains how much. Without it, the «who benefits» debate is held without numbers.

**Unidade 16.** The regular pension update rate for 2027 could be written in the report, next to the expenditure that assumes it, instead of referring to the law.

**Unidade 17.** The fuel-fraud measure, 300 million euros, could come with its calculation basis, as the UTAO asks.

**Unidade 18.** The Public Finance Council points to the lag between the withholding tables and the income-tax changes as a source of uncertainty in 2027 disposable income; tables aligned with the law in the first month of the year would resolve it.

**Unidade 19.** The accounts, in two perimeters

**Unidade 20.** In public accounting, general government total revenue goes from 140,304 million euros in 2026 to 143,677 million in 2027, up 2.4 %; total expenditure from 140,133 million to 144,078 million, up 2.8 %. The overall balance goes from 171 million (0.1 % of GDP) to −401 million (−0.1 % of GDP), a change of −572 million. Within expenditure, interest and other charges rise from 7,225 million to 8,575 million (18.7 %), staff costs from 32,034 million to 33,766 million (5.4 %), current transfers to 62,677 million (5.4 %), and investment falls from 12,764 million to 10,417 million (−18.4 %). Within revenue, direct taxes grow 1.7 %, to 36,050 million; indirect taxes 5.5 %, to 42,981 million; social security contributions 5.7 %, to 39,356 million.

**Unidade 21.** In national accounts, the ones that count for the European rules, total revenue falls from 146,559 million euros (45.0 % of GDP) to 143,356 million (42.1 %) and total expenditure from 146,472 million (45.0 %) to 143,081 million (42.0 %). Both fall because the PRR leaves the accounts: it weighed 9,077 million in revenue and 11,106 million in expenditure in 2026, and in 2027 it weighs 0 and 0. Without the PRR, revenue rises from 137,481 million to 143,356 million (4.3 %) and expenditure from 135,366 million to 143,081 million (5.7 %). Interest goes from 6,669 million to 8,217 million (2.4 % of GDP); the primary balance, before interest, from 6,756 million (2.1 % of GDP) to 8,492 million (2.5 %). The general government balance stands at 275 million, 0.1 % of GDP, after 86 million in 2026.

**Unidade 22.** The passage from one perimeter to the other adds up to 676 million euros in 2027, and the three largest adjustments are the reclassified public entities (3,073 million), capital injections and loans (−2,970 million) and the difference between interest paid and interest due (−511 million). In public accounting, Social Security has a surplus of 8,383 million and Central Government a balance of −9,815 million: it is Social Security that makes the whole close near zero.

**Unidade 23.** The UTAO reads the balance thus: «O MF prevê um saldo orçamental de 0,0% do PIB em 2026 e de 0,1% do PIB em 2027 (Gráfico 7). Estes resultados correspondem ao quarto e ao quinto anos consecutivos com saldo positivo ou nulo, na sequência dos excedentes de 2023, 2024 e 2025. Numa perspetiva de longo prazo, o saldo orçamental médio no período 2005–2025 foi de −3,9% do PIB.» And on the revision against the medium-term plan: «O saldo orçamental previsto para 2027 reflete uma revisão em baixa face à previsão do POENMP divulgada em outubro de 2024. O saldo primário previsto para 2027 (2,5% do PIB) é inferior à previsão do POENMP (3,2%), devido sobretudo ao menor peso da receita total; a despesa com juros não entra no cálculo do saldo primário e agrava apenas o saldo orçamental. O peso da receita para 2027 (42,1% do PIB) é inferior ao que constava no POENMP (43,0%). Tendo por referência a estimativa para 2026, esta apresenta valores diferentes, mas próximos, dos que constavam no POENMP para os diversos indicadores que compõem o saldo orçamental (Tabela 4).»

**Unidade 24.** The scenario all this rests on: GDP grows 2.3 % in 2026 and 2.1 % in 2027; private consumption 2.1 % in 2027; investment slows from 5.7 % to 2.0 %; inflation (the harmonised index) goes from 2.9 % to 2.3 %; employment grows 1.4 %, unemployment stays at 5.7 % and compensation per worker rises 4.5 %. The European Commission, in the spring of 2026, forecast 1.8 % growth and a balance of −0.4 % of GDP for 2027.

**Unidade 25.** The measures: what is new and what was already decided

**Unidade 26.** SIFIDE is the Portuguese system of tax incentives for business research and development. The report's table of main measures with an impact in 2027 (its Table 3.2) adds up to −1,132 million euros of impact on the balance: −84 million on the revenue side and 1,048 million on the expenditure side. On the revenue side: VAT 206 million, which joins «Housing: construction VAT cut from 23% to 6% (i)» (−94 million) and «Combating fraud in the fuel sector» (300 million); personal income tax −477 million, which joins «Housing: personal income tax on moderate rents cut from 25% to 10% (i)» (−209 million), «Updating the specific deduction and tax brackets (i)» (−431 million), «Updating the minimum subsistence threshold» (−121 million) and the revenue that wage growth brings (284 million); corporate income tax −176 million, which joins «Rate cut by 1 percentage point (i)» (−300 million) and «Indirect SIFIDE (reversal) (i)» (124 million); and the social contributions that wage growth brings (363 million). On the expenditure side: staff costs 948 million (the incomes agreement 587 million, the minimum wage rise 116 million, the wage agreements 244 million) and social benefits 100 million, which are the increase of the Solidarity Supplement for the Elderly (100 million).

**Unidade 27.** The table marks ten of its lines with «(i)», and the table's note says what the mark is: «Nota: (i) invariante.» They are the measures already in force before this proposal. Added up, the marked lines are worth −263 million euros in revenue and 947 million in expenditure, −1,210 million on the balance. The three unmarked lines, the fight against fuel fraud, the exemption threshold and the Solidarity Supplement for the Elderly, add 79 million to the balance. The UTAO reaches the same number: «O MF prevê que em 2027 as novas medidas de política orçamental tenham um impacto residual no saldo orçamental avaliado em +79 M€ (+0,02% do PIB). Na receita, estas medidas terão um impacto positivo no saldo de +179 M€ (+0,05% do PIB); na despesa, o impacto das medidas, é negativo em 100 M€ (0,03% do PIB). Estes dados estão compilados na Tabela 9.» And says why: «À semelhança do observado nas Propostas de Orçamento do Estado dos dois anos anteriores, a POE/2027 apresenta um número reduzido de novas medidas e um impacto agregado limitado sobre o saldo orçamental. O Quadro 3.2 do relatório da POE/2027 identifica apenas três novas medidas. Uma das justificações prende-se com a estratégia do Governo de adotar medidas de política orçamental fora do âmbito do Orçamento do Estado e previamente à sua apresentação, como sucedeu, por exemplo, com a redução em 1 p.p. da taxa de IRC e da taxa de IRS sobre rendas moderadas (de 25% para 10%). Após a sua adoção, estas medidas passam a integrar o cenário de políticas invariantes. Neste contexto, o reduzido impacto orçamental das novas medidas indica que o cenário orçamental para 2027 assenta essencialmente nos efeitos das medidas permanentes adotadas em anos anteriores.»

**Unidade 28.** On VAT, Livre, by the news report Primeiro-ministro rejeita totalmente descer o IVA dos atuais 23% para 21%: «Assim, a deputada disse que o seu partido "apresentará esta descida já para o Orçamento do Estado 2027, de forma progressiva".» It is a proposal outside the table of measures, and the title of the news report states the Prime Minister's answer.

**Unidade 29.** Outside the table of measures are the unchanged policies, the decisions already in force whose cost keeps growing. The UTAO: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» And on the revision of that table between August and October: «O relatório da POE/2027 divulgou um quadro de políticas invariantes revisto face ao apresentado em final de agosto. Com efeito, o impacto orçamental das políticas invariantes passou de 4783 M€ para 5411 M€. Para esta deterioração adicional, destaca-se a despesa com juros (de 776 M€ para 1548 M€) e o investimento público excluído de PRR (de 433 M€ para 617 M€). Em sentido oposto, evidencia-se a revisão da despesa com pensões (de 1993 M€ para 1475 M€) e a passagem do reforço do complemento solidário para idosos (CSI; 100 M€) do QPI para as novas medidas (Tabela 9).»

**Unidade 30.** What changes for employees

**Unidade 31.** The 2027 personal income tax has nine brackets, with normal rates of 12.20 % up to 8,666 euros of taxable income, 15.20 % up to 13,075 euros, 20.70 % up to 18,530 euros, 23.60 % up to 23,985 euros, 30.60 % up to 30,538 euros, 34.60 % up to 44,762 euros, 43.10 % up to 48,373 euros, 44.60 % up to 89,995 euros, and 48.00 % above that, by article 68.º of the Personal Income Tax Code as worded in the proposal. In 2026 the limits were 8,342, 12,587, 17,838, 23,089, 29,397, 43,090, 46,566 and 86,634 euros: the update of the limits is 3.9 % in every bracket, and the rates change from 12.50 % to 12.20 %, from 15.70 % to 15.20 %, from 21.20 % to 20.70 %, from 24.10 % to 23.60 %, from 31.10 % to 30.60 % and from 34.90 % to 34.60 %; the others do not change, by article 68.º as in force in 2026. The rates do not appear in the table of measures as a change: what costs −431 million euros is the update of the brackets and of the specific deduction, and what costs −121 million is the update of the exemption threshold, the income below which no tax is paid.

**Unidade 32.** The report counts this Budget as «O Orçamento do Estado para 2027 apresentará a sexta redução generalizada de IRS, considerando a redução das taxas em junho de 2024, junho de 2025, no Orçamento do Estado para 2026 e em setembro de 2026, a que acresce a atualização dos respetivos escalões nos Orçamentos do Estado para 2025, 2026 e 2027.» The Prime Minister, in the Government's communication: «Na área fiscal, Luís Montenegro destacou as seis descidas consecutivas do IRS, num valor global de 2 800 milhões de euros, e o impacto de 700 milhões de euros associado ao IRS Jovem.» The 2027 account is smaller than the sum of the six: personal income tax loses −477 million euros in 2027 after counting the 284 million of new revenue that wage growth brings. The Public Finance Council, on what this does to disposable income: «Por outro lado, o desfasamento entre os ajustamentos das tabelas de retenção na fonte e as alterações legislativas em sede de IRS tem sido significativo, introduzindo incerteza quanto à evolução dos reembolsos e das notas de cobrança e, por essa via, quanto ao rendimento disponível das famílias em 2027.» And on the weight of the measures: «Ainda assim, face à reduzida dimensão das medidas de política comunicadas ao CFP para 2027 – inferior a 0,1% do PIB – o seu impacto não se afigura relevante para a comparação.»

**Unidade 33.** The positions: the JPP, by the news report JPP pede maior protecção das famílias não abrangidas pela descida de IRS: «JPP pede maior protecção das famílias não abrangidas pela descida de IRS» The Left Bloc, by the news report OE2027: BE diz que Orçamento “dá migalhas a quem trabalha” e beneficia os mais ricos: «José Manuel Pureza considera que o Orçamento para 2027 “dá migalhas” aos trabalhadores, beneficia os mais ricos e ignora problemas estruturais.» The PCP, in the statement by Paula Santos: «Acrescem ainda outros benefícios fiscais contrários ao interesse nacional, como os 2228 milhões de euros atribuídos ao regime dos residentes não habituais; os 1067 milhões de euros associados ao IRS jovem (que favorece quem tem rendimentos mais elevados), ou os 209 milhões de euros de rendimentos prediais dos senhorios que apliquem rendas até 2300€.» The numbers the PCP cites (the benefits of the non-habitual residents regime, of the young people's income tax and of rents) are the PCP's; this study did not check them at the source and therefore does not repeat them as its own. From Iniciativa Liberal and from PAN there is, in this study's documents, no position dated after the delivery of the proposal; the research did not find one in the primary sources, which does not mean there is none.

**Unidade 34.** What changes for those on the minimum wage and for those who work for the State

**Unidade 35.** The guaranteed minimum monthly wage (RMMG), by the report: «Em 2027, o Governo da AD elevará o salário mínimo (RMMG) para os 970 euros, concretizando o terceiro aumento consecutivo desde que tomou posse o XXIV Governo Constitucional, em 2024, ano em que a RMMG se cifrava nos 820 euros.» That is 150 euros a month more than in 2024. Against 2026, when the guaranteed minimum monthly wage was 920.00 euros, it is 50 euros more, 5.4 %. The cost to the State as an employer, 116 million euros, is in the table of measures. The PCP, in the statement by Paula Santos: «O Governo quer limitar o SMN aos 970€ em 2027, quando em Espanha esse valor ultrapassou os 1220€ em 2026.» The Boletín Oficial del Estado (BOE) sets the Spanish minimum wage for 2026 at 1,221 euros a month.

**Unidade 36.** For those who work for the State, the report: «Ao nível da despesa, destaca-se a massa salarial dos trabalhadores da Administração Pública (948 milhões de euros), que inclui uma atualização das remunerações em 2,3%, e o reforço do CSI, com um impacto de 100 milhões de euros.» The inflation the same report forecasts for 2027 is 2.3 %: the update and the forecast inflation are the same number, and the real wage stays where it is if the forecast holds. The Public Finance Council: «Ponderados os riscos, o cenário macroeconómico subjacente à POE/2027 afigura-se globalmente como estatisticamente provável. Ainda assim, como fundamentado no presente Parecer, é de notar a existência de riscos descendentes para a previsão de crescimento do PIB real em 2027. No que respeita à inflação, destaca-se uma potencial subestimação tanto em 2026, como em 2027.» The PCP: «Em relação aos trabalhadores da Administração Pública, prevê-se uma atualização nos salários de 2,3%, valor que poderá ficar abaixo da inflação, não permitindo a valorização do poder de compra, e um aumento de apenas 15 cêntimos no valor do subsídio de alimentação.» The UTAO measures the cost and the return: «A atualização salarial dos funcionários das Administrações Públicas prevista para 2027 é de 1231 M€, a qual acarreta receita de IRS (590 M€) e de contribuições sociais (471 M€). A atualização salarial inclui o aumento decorrente das progressões, promoções, a subida do Rendimento Mínimo Mensal Garantido (RMMG), os acordos salariais com carreiras profissionais e o acordo de rendimentos.» That is, of 1,231 million euros of update, 590 million come back in income tax and 471 million in contributions, 86.2 % of the total. And on public employment: «O MF propõe estabilizar o emprego público em 2027 em 768,4 mil trabalhadores (Relatório do MF, Quadro 4.42), nível idêntico ao de junho de 2026 (768 378, DGAEP), o que equivale a não haver crescimento líquido do emprego a partir de junho. Segundo dados provisórios da DGAEP, o nível de junho de 2026 está 1,0% (+7390) acima de junho de 2025 e 0,3% (+2100) acima de dezembro de 2025. A estabilização do emprego contém a massa salarial; entradas superiores às saídas aumentariam o emprego e a despesa com pessoal, que a POE/2027 já prevê crescer 5,3% (Tabela 7).»

**Unidade 37.** What changes for pensioners

**Unidade 38.** The report does not write the 2027 pension update rate: «Na estimativa de despesa com pensões considerou-se a atualização regular nos termos da Lei.» Social benefit expenditure grows thus: «Prestações sociais (3,8%), refletindo nomeadamente a estimativa da atualização regular das pensões, o reforço anual do complemento solidário para idosos que tem ocorrido desde 2024 e a atualização dos valores de referência das outras prestações sociais.» The new measure is the Solidarity Supplement for the Elderly: «A despesa com a prestação do CSI deverá atingir o montante de 709,7 milhões de euros, uma variação anual de 15,6% face a 2026, refletindo principalmente o aumento do valor de referência em 50 euros/mês em 2027, para 720 euros, no âmbito da sua trajetória de convergência para 870 euros em 2029.» The reference amount therefore goes from 670 euros to 720 euros a month, on the way to 870 euros in 2029, at a cost of 100 million euros in the table of measures. The extraordinary pension supplement and the cut of the income-tax rates up to the sixth bracket belong to 2026, not to 2027, and the Public Finance Council estimates them thus: «O MF estima um valor de 400 M€ quer para o suplemento extraordinário para pensionistas quer para a redução das taxas de IRS até ao 6.º escalão, com efeitos retroativos a janeiro (cerca de 0,25% do PIB no seu conjunto).» The Prime Minister: «Entre as medidas dirigidas às famílias, salientou o aumento de 50 euros no Complemento Solidário para Idosos, o complemento extraordinário das pensões e a atualização dos limites dos escalões de IRS e das deduções fiscais.» The PS, by José Luís Carneiro: «Na área das pensões, o líder do PS defendeu uma revisão dos mecanismos de atualização que assegure dois princípios: acompanhar a inflação e favorecer as pensões mais baixas.» The PCP: «São dados que confirmam as possibilidades para um aumento significativo de pensões e prestações sociais que o Governo continua a recusar, e não a mera atualização que decorre do cumprimento da lei.»

**Unidade 39.** What changes for those who rent or buy a home

**Unidade 40.** The two housing measures with an impact in 2027 come from the decree-law of May 2026, not from this proposal: «Housing: construction VAT cut from 23% to 6% (i)» (−94 million euros less revenue) and «Housing: personal income tax on moderate rents cut from 25% to 10% (i)» (−209 million). The decree-law describes them thus: «Do conjunto de alterações, destaca-se a aplicação, com carácter temporário, da taxa reduzida de IVA de 6 % às empreitadas de construção e reabilitação de imóveis para habitação, a redução das taxas de imposto sobre o rendimento das pessoas singulares (IRS) e de imposto sobre o rendimento das pessoas coletivas (IRC) aplicáveis a rendimentos prediais decorrentes de contratos de arrendamento destinados exclusivamente ao arrendamento para habitação, incluindo contratos de arrendamento já em curso, bem como a exclusão de tributação, em sede de IRS, das mais-valias imobiliárias quando haja reinvestimento em imóveis destinados ao arrendamento para habitação, com vista a reforçar o investimento e a disponibilização de oferta habitacional.» The reduced rate applies to the works the decree-law adds to list I of the VAT Code (its article 8.º), with the conditions of article 10.º (the limits on sale price and rent), and the effects have the dates of article 18.º. The positions: the PS: «Arrendatários: dedução das rendas no IRS aumentada para 1.000 euros a partir de 2027.» Chega, by the news report Ventura acusa PS de hipocrisia na habitação: “Montenegro falhou brutalmente, mas os socialistas fizeram pior”: «André Ventura defende um pacote de emergência com benefícios fiscais, apoios às rendas e menos burocracia.» The PCP: «Na habitação, reduz-se em 6% o investimento em relação ao orçamentado no ano passado, num contexto em que a habituação pública continua degradada e a ser residual.» What housing investment does in 2027 in the Budget's programmes is not among this study's rows, and is left for this project's housing study.

**Unidade 41.** What changes for companies

**Unidade 42.** The corporate income tax rate falls to 18 % in 2027, after 19 % in 2026, by the law of November 2025 that fixed the path of the rate (Lei n.º 64/2025, de 7 de novembro): «Artigo 3.º Norma transitória 1 — A taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC, na redação conferida pela presente lei, aplica-se aos períodos de tributação que se iniciem em ou após 1 de janeiro de 2028. 2 — Nos períodos de tributação que se iniciem durante o ano de 2026, a taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC é de 19 %. 3 — Nos períodos de tributação que se iniciem durante o ano de 2027, a taxa prevista nos n.os 1 e 5 do artigo 87.º do Código do IRC é de 18 %. 4 — A taxa prevista no n.º 2 do artigo 87.º do Código do IRC, na redação conferida pela presente lei, aplica-se aos períodos de tributação que se iniciem em ou após 1 de janeiro de 2026.» The report describes the path as «Destaca-se ainda o alargamento do IRS Jovem; a redução do IRC de 21% em 2024 para 17% em 2028; a isenção de imposto municipal sobre as transmissões onerosas de imóveis (IMT) e imposto do selo na aquisição da primeira habitação por parte dos jovens até aos 35 anos; a redução do imposto sobre o valor acrescentado (IVA) de 23% para 6% na habitação e a redução do IRS de 25% para 10% nas rendas moderadas.» The 2027 cost in the table of measures is −300 million euros, partly offset by the reversal of the indirect business research and development tax incentive system (SIFIDE), 124 million, for a total of −176 million. The Prime Minister: «Referiu também a redução do IRC e sublinhou que, nos 920 dias desde a primeira tomada de posse do Governo, não houve aumentos de impostos.» The PSD's parliamentary leader, by the news report "Baile" na AR com OE em destaque: A "dança" de Montenegro e oposição: «Enquanto o Governo do PS aumentava impostos, defendeu Hugo Soares, "este Governo não aumentou um único imposto nos orçamentos que apresentou".» The PS, by José Luís Carneiro: «Para o líder do PS, a redução deste imposto deve ser “dirigida a prioridades de política económica e não para todos e de forma cega”.» The PCP: «O Governo fala em descida de impostos, mas a realidade é esta: o único imposto cuja receita diminuiu foi o IRC (imposto que incide sobre os rendimentos de capital), no próximo ano – com uma taxa de 18% - voltará a descer e a que se somam os benefícios fiscais de 1868 milhões de euros (apenas 1% das empresas absorvem mais de 50% destes benefícios).» The CDS, by the news report "Temos um bom Orçamento para 2027", garante o CDS-PP: «"Temos um bom Orçamento para 2027", garante o CDS-PP» On the sentence «não houve aumentos de impostos»: in the table of measures, the revenue lines that grow are the fraud revenue (300 million), the revenue that wage growth brings in income tax (284 million) and in contributions (363 million), and the reversal of the SIFIDE (124 million); none is a rate increase.

**Unidade 43.** The debt: what falls, and why

**Unidade 44.** The report: «A dívida pública, em percentagem do PIB, deverá manter assim a trajetória decrescente, passando de 87,5% em 2026 para 84,5% em 2027.» And the objective: «A dívida pública continuará a reduzir-se, visando ficar abaixo dos 80% do produto interno bruto (PIB) no final da década.» The finance minister, on 13 de outubro, by the news report Miranda Sarmento: dívida pública abaixo dos 85% do PIB em 2027 é a "principal preocupação" do Governo: «A dívida pública deve continuar a ser a nossa principal preocupação nas contas públicas. Temos uma redução de cerca de quatro pontos percentuais nos últimos anos e estaremos abaixo dos 85% do PIB [Produto Interno Bruto] em 2027» In 2025 the debt was 89.2 % of GDP; it falls −1.6 points in 2026 and −3.0 points in 2027, to 84.5 %.

**Unidade 45.** The report's debt table breaks down the 2027 fall: the primary balance contributes −2.5 points, the dynamic effect (nominal growth minus interest) −1.5 points, of which the interest effect is 2.4 points upward and the GDP effect −3.9 points downward, and the deficit-debt adjustment 0.9 points upward. In 2026 the primary balance contributed −2.1 points, the dynamic effect −2.6 points and the adjustment 3.1 points. The UTAO explains: «O reforço do excedente primário em 2027 não será suficiente para compensar a menor redução do rácio da dívida proporcionada pelo efeito dinâmico. Segundo a POE/2027 (Tabela 16), o saldo primário contribuirá para uma redução de 2,5 p.p., face a 2,1 p.p. em 2026. Em contrapartida, o abrandamento do PIB nominal e o aumento do custo médio da dívida limitarão a redução proporcionada pelo efeito dinâmico a 1,5 p.p., face a 2,6 p.p. no ano anterior. O contributo do crescimento nominal para a descida do rácio passará de 4,6 p.p. para 3,9 p.p., sobretudo devido à desaceleração do deflator do PIB e, em menor medida, do crescimento real, enquanto os juros, em sentido contrário, aumentarão o rácio em 2,4 p.p., face a 2,0 p.p. O contributo do crescimento nominal continuará, assim, a superar o dos juros, mas com uma diferença menor, tornando a redução do rácio mais dependente do excedente primário. Em conjunto, estas duas componentes deverão reduzir o rácio em cerca de 4,0 p.p. em 2027, face a 4,7 p.p. em 2026, antes de considerado o ajustamento défice-dívida.» And: «Apesar do menor contributo redutor do efeito dinâmico, a descida do rácio deverá acelerar em 2027, sobretudo devido à redução do ajustamento défice-dívida, que inclui operações financeiras que alteram a dívida sem afetarem na mesma medida o saldo orçamental. Segundo a POE/2027, este ajustamento deverá acrescentar 0,9 p.p. ao rácio, face a 3,1 p.p. em 2026. Esta diminuição reflete sobretudo a redução da aquisição líquida de ativos financeiros, de 9,3 mil M€ para 0,9 mil M€, em particular as menores aplicações em numerário e depósitos e a ausência de aquisições líquidas de títulos exceto ações em 2027. O aumento dos restantes contributos para o ajustamento compensa parcialmente esta redução. Este ajustamento permanece positivo e superior ao excedente orçamental previsto (0,1% do PIB), pelo que o stock nominal da dívida continuará a aumentar.» In euros, according to the UTAO, the stock goes from 284.8 thousand million at the end of 2026 to 287.8 thousand million in 2027, with increases of 9.7 and 2.9 thousand million: the debt keeps rising in euros, and falls as a percentage because GDP rises more.

**Unidade 46.** The European Commission, in its spring 2026 forecast, before the proposal existed, pointed to 87.6 % for 2026 and 86.0 % for 2027, 1.5 points above the Budget. The medium-term budgetary plan of October 2024 pointed to 87.2 % for 2027, 2.7 points above: the Budget is ahead of the plan. In the European Union, by Eurostat's April 2026 update, Portugal had in 2025 a debt of 89.7 % of GDP against 81.7 % in the Union, 8.0 points above, between Estonia (24.1 %) and Greece (146.1 %), and below Spain (100.7 %); the INE's notification of September 2026, more recent, gives 89.2 % for the same year, and that is the report's number. On the balance, Portugal had 0.7 % of GDP in 2025 against −3.1 % in the Union, between Romania (−7.9 %) and Cyprus (3.4 %).

**Unidade 47.** The table and the prose of the European Commission forecast disagree on the value for 2026. The prose says: «It is forecast to reach 86.7% of GDP in 2026 and 86.0% of GDP in 2027 on the back of persisting primary balance surpluses and favourable growth-interest rate differentials.» The table gives 87.6 %.

**Unidade 48.** Interest: «A despesa com juros apresenta uma subida prevista de 23,2% em 2027, o que reflete uma variação nominal de 1,5 mil M€, ascendendo a 8,2 mil M€. Caso se concretize a previsão, a taxa de juro implícita (juros em percentagem da dívida pública) deverá subir de 2,4% em 2026 para 2,9% em 2027. É de referir que o máximo da série estatística para os juros foi atingido em 2014, acima do valor previsto para 2027 (a taxa de juro implícita foi de 3,6% em 2014).»

**Unidade 49.** The risks the institutions point to

**Unidade 50.** The UTAO, on growth: «Um crescimento económico inferior ao projetado constitui um risco para a concretização do saldo orçamental, em particular num cenário para 2027 em que a despesa corrente cresce 6,6% e a receita corrente 4,5% (Tabela 13). A POE/2027 assenta num crescimento real do PIB de 2,1%, acima das previsões do BdP, da CE e do CFP (1,8%), da OCDE (1,7%) e do FMI (1,6%) (capítulo 2), num enquadramento marcado pela incerteza geopolítica e pelos riscos associados à evolução dos preços da energia. Um abrandamento da atividade económica superior ao implícito no cenário orçamental traduzir-se-ia numa arrecadação inferior à prevista de impostos sobre o rendimento e o consumo, bem como de contribuições sociais, condicionando a execução da receita e colocando pressão sobre o saldo orçamental. O cenário depende ainda da execução do PT2030, cujos recebimentos se prevê que aumentem 65% em 2027 (+1948 M€) quando, a 31 de agosto de 2026, a execução financeira era de 21,7% da dotação, e da conclusão do PRR, cujo último pedido de pagamento (96 marcos e metas) estava em avaliação (Caixa 1).» On the fraud revenue: «Subexecução da medida de combate à fraude no setor dos combustíveis. A POE/2027 prevê uma receita adicional de 300 M€ associada a esta medida, sem, contudo, apresentar informação que permita fundamentar a estimativa ou avaliar a sua exequibilidade. Subsiste, assim, um risco de concretização inferior ao previsto, atendendo aos antecedentes de medidas de combate à fraude cuja execução efetiva se revelou menor, ou relativamente às quais a Conta Geral do Estado não disponibilizou informação suficiente para aferir os resultados alcançados.» On the National Health Service: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS). A persistência de défices na execução financeira do SNS, apesar dos sucessivos reforços das dotações orçamentais e das recorrentes injeções de capital destinadas a regularizar pagamentos em atraso, evidencia a manutenção de pressões sobre a despesa que poderão não estar integralmente acomodadas no financiamento previsto para 2027. Estas pressões incidem, designadamente, sobre as despesas com pessoal e os consumos intermédios (Tabela 15), podendo traduzir-se em necessidades adicionais de financiamento durante o ano e constituir um risco descendente para o saldo orçamental das AP.» On interest: «A despesa com juros cresce 23,2% em contabilidade nacional em 2027 (18,7% em contabilidade pública, Tabela 13). Persiste o risco de encargos superiores aos projetados, que depende do volume de dívida a refinanciar em 2027 e das taxas de juro das novas emissões.» On contingent liabilities, where the road partnerships of the partnerships item of «Under discussion» come in: «As responsabilidades contingentes constituem outro risco: decisões arbitrais desfavoráveis no âmbito das PPP e garantias às linhas de crédito criadas na sequência das tempestades (2000 M€ de crédito e 571 M€ de encargos plurianuais potenciais, Caixa 3). A prorrogação até ao final de 2027 da garantia pessoal do Estado ao crédito à habitação de jovens agrava-o: o stock de garantias ao abrigo do regime mais do que duplicou entre dezembro de 2025 e maio de 2026, de 449 M€ para 926 M€ (Tabela 19).» On the markets: «A instabilidade política e a deterioração das finanças públicas francesas (défice de 5,1% do PIB em 2025 e de 5,4% previsto pelo Governo francês para 2026) poderão intensificar as tensões no mercado europeu de dívida soberana e elevar os prémios de risco e os custos de financiamento de Portugal. Acresce o risco quanto à trajetória da despesa líquida: a Comissão Europeia estima um desvio de 2,1% do PIB no final de 2027, acima do limiar de 0,6% (capítulo 3), e, na análise de sustentabilidade do MF, a probabilidade de o rácio da dívida em 2033 exceder o de 2028 é de 22,9% (capítulo 5).» On extreme natural events: «A ocorrência de novos fenómenos naturais extremos em 2027 poderá exigir a adoção de medidas extraordinárias de apoio público destinadas a mitigar os danos causados e a assegurar a recuperação dos setores e das infraestruturas afetados. A eventual necessidade de financiar estas medidas constituiria uma pressão adicional sobre a despesa pública, configurando um risco orçamental. A Caixa 3 apresenta os apoios já aprovados na sequência das tempestades de 2026.» The Public Finance Council, on employment and revenue: «A previsão para o emprego (1,4%) é a mais elevada de entre as instituições de referência e situa-se no limite superior do intervalo de confiança a 30%. Assenta num crescimento da população ativa (1,3%) superior ao da população em idade ativa (0,6%), o que pressupõe um aumento expressivo da taxa de participação. Também para as remunerações por trabalhador, a previsão do MF é a mais elevada de entre as instituições de referência. O efeito conjugado destes dois elementos pode resultar em riscos acrescidos para a receita decorrente da massa salarial.» And on the measures: «O MF estima um impacto macroeconómico reduzido das medidas de apoio ao rendimento das famílias com efeito no final de 2026. As medidas previstas para 2027 terão um impacto reduzido.»

**Unidade 51.** What the statements leave out

**Unidade 52.** «O Orçamento dá migalhas»: the sentence has no number, and the new measures for people are worth −121 million euros in the exemption threshold and 100 million in the Solidarity Supplement for the Elderly, next to 947 million already decided in wages. «O único imposto cuja receita diminuiu foi o IRC»: in the table of measures, corporate tax loses −176 million in 2027 and personal income tax −477 million; in the account, direct taxes as a whole grow 1.7 %. No party, in this study's documents, speaks of interest, which grows 1,350 million euros in 2027, more than all the measures together cost the balance.

**Unidade 53.** The calendar

**Unidade 54.** The proposal was delivered on 8 October; the general debate is on 27 e 28 de outubro; the committee stage from 18 a 23 de novembro; the final global vote on 24 de novembro. This study reads the proposal; whatever the committee stage changes goes into a dated revision.

**Unidade 55.** Under discussion: Health in the Budget

**Unidade 56.** Under discussion: road partnerships
