# L1 · a leitura de cada medida · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 24.09.2026, com a passagem de correção de 26.09.2026 depois da leitura a frio do Codex. Ramo `l1-2026-09-24` do sítio, rebaseado a 26.09.2026 sobre `main` em `1415e0c3` (o brief passou de `f0779f37` a `61155218`, `brief_depois_do_rebase`); ramo `l1-2026-09-24` do motor, sobre `0f08171`. Os portões inteiros (`npm run build`, `npm run verify` e `npm run typecheck`) correram na cabeça `c1e155f0` (`cabeca_medida`), e o commit que entrega estas provas vem a seguir a ela e só acrescenta ficheiros desta pasta. As capturas do antes são da cabeça `f0779f37` (`paginas_antes_construidas_de`), a de partida, construída antes do rebase, e as do depois são da cabeça dos portões (`capturas_depois_de`). Cada número deste relatório sai de `medidas.json`, escrito por `medir-l1.py`, e o nome da medição vai ao lado dele; `conferir-relatorio.py` confere-os.*

## A passagem de correção (26.09.2026)

A leitura a frio do Codex (`gpt-5.6-sol`, `design/especime-v3/critica/LEITURA-l1-2026-09-26.md`) deu 28 (`achados_da_leitura`) achados numerados e apanhou as cinco plantas. Esta passagem segue o mandato do lugar de direção (`prompts/PROMPT-l1-opus-correcao.md`) achado a achado, sobre a cabeça que a leitura recebeu (`5a5185e0`, que o rebase reescreveu para `6584df72` com os mesmos ficheiros).

### O que era planta, confirmado no ramo (achados 1, 2, 5 e 6)

Os achados 1, 2, 5 e 6 são estragos plantados só nas cópias do pacote e não existem no ramo. Cada ficheiro estragado tem, no ramo, o sha256 de antes da planta (5 (`plantas_da_leitura_confirmadas`) em 5 (`plantas_da_leitura`)), e a troca que o registo das plantas guarda, aplicada aos bytes do ramo, dá exatamente o sha256 da cópia estragada (5 (`plantas_da_leitura_reproduzidas`) em 5 (`plantas_da_leitura`)); uma a uma (`plantas_da_leitura_no_ramo`):

- **P1**, a fonte e o diff: os dois ramos de PESA trocados na declaração (a página construída, feita da declaração sã, contradiz esta cópia): no pacote `src/data/leituras-das-medidas.mjs`, no ramo `src/data/leituras-das-medidas.mjs`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: sim.
- **P3**, o relatório: a contagem das origens novas trocada de 44 para 46 (o medidas.json diz 44, e a linha seguinte do relatório também): no pacote `relatorio-construtor.md`, no ramo `design/especime-v3/medicoes/l1-2026-09-24/LEIA-ME.md`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: sim.
- **P4**, a página construída: o ramo da dívida pública trocado (89,7 contra 93,5 é «pesa menos», a página passa a dizer «pesa mais»): no pacote `built/temas/index.html`, no ramo `design/especime-v3/medicoes/l1-2026-09-24/paginas-depois/temas_index.html`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: sim.
- **P2**, a régua: a conferência dos algarismos da leitura rendida passa a aceitar qualquer elemento com classe, o que a torna vazia (o `<p>` da leitura tem classe): no pacote `tests/cartao/leituras.mjs`, no ramo `tests/cartao/leituras.mjs`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: sim.
- **P5**, os dados: um literal da auditoria que a origem não traz (a descrição do Eurostat diz «average population» e a auditoria passa a dizer «total population»): no pacote `tests/cartao/leituras-provadas.json`, no ramo `tests/cartao/leituras-provadas.json`; o ramo tem o sha256 de antes e, com a troca registada, dá o de depois: sim.

A segunda metade do achado 6 não é planta, e explica-se pelo próprio conferidor: o conhecido-positivo é o primeiro número, a partir de 987654321, que não está em nenhum JSON da pasta; a corrida do construtor escreveu o seu resultado em `conferencia-relatorio.json` e excluiu esse ficheiro de si própria, e a corrida do pacote leu-o. Na pasta como a leitura a recebeu há 15 (`achado6_ficheiros_json_na_pasta`) JSON; corrido como o pacote o corre, o conferidor lê 15 (`achado6_corrida_como_o_pacote.lidos`) e usa 987 654 322 (`achado6_corrida_como_o_pacote.conhecido_positivo`); corrido como o construtor o correu, lê 14 (`achado6_corrida_como_o_construtor.lidos`) e usa 987 654 321 (`achado6_corrida_como_o_construtor.conhecido_positivo`); e, sem o `conferencia-relatorio.json` na cópia, a corrida à maneira do pacote lê o mesmo que a do construtor e usa o mesmo número (o conhecido-positivo da medição `achado6_corrida_como_o_pacote`). O que o achado diz do conferidor é verdade e está no cabeçalho dele: achar um número num JSON não prova que ele mede o que a frase diz, e é por isso que o nome da medição vai ao lado de cada número.

### Os dois valores de referência (achados 3 e 4, I151)

A página do painel da Comissão foi pedida hoje pelo cliente da casa às `2026-09-26T08:30:08Z`, HTTP 200, com o sha256 `0230bdfacf0da8f870387675a1c20a92545c23fb4ef764e29661f0edec8cd8fa`; o endereço pedido redireciona para `https://economy-finance.ec.europa.eu/economic-governance-framework/macroeconomic-imbalance-procedure/scoreboard_en`, e a cópia alojada no estudo 13 tem o mesmo resumo (`comissao_hoje`, `comissao_hoje_confirma`). Palavra por palavra, nos bytes, «thresholds of -/+3% for euro area countries and -/+10% for non-euro area countries» aparece 1 (`comissao_hoje.ocorrencias.taxa-de-cambio-efectiva-real-2025`) vez e «with a threshold of -3%» 1 (`comissao_hoje.ocorrencias.desempenho-das-exportacoes-2025`) vez; a mesma procura numa cópia com os dois valores trocados não acha nenhum. A página de hoje confirma os dois valores, e a passagem não parou aí.

A discordância entra como terceira testemunha, declarada e datada, ao pé do `limiar` de cada medida em `src/data/figuras.mjs` (`testemunhaDiscordante`), e vai com a referência para `REFERENCIAS_DAS_MEDIDAS`, que é onde a K9 lê as testemunhas; os excertos e as datas recortam-se dos bytes selados por `origens-l1.py`, e `--confere` relê-os:

- **A taxa de câmbio efetiva real** (`taxa-de-cambio-efectiva-real-2025`): a descrição do conjunto do Eurostat, criado a `2012-10-22` (a anotação CREATED da resposta selada), diz «The indicative thresholds are +/-5% for euro area and +/-11% for non-euro area countries.»; a página da Comissão, lida a `2026-09-26`, diz «real effective exchange rates (3-year percentage change) based on HICP/CPI deflators, relative to 41 other industrial countries, with thresholds of -/+3% for euro area countries and -/+10% for non-euro area countries.»; manda a Comissão (`manda: comissao`).
- **O desempenho das exportações** (`desempenho-das-exportacoes-2025`): a descrição do conjunto do Eurostat, criado a `2014-11-13` (a anotação CREATED da resposta selada), diz «The indicative threshold is +3%.»; a página da Comissão, lida a `2026-09-26`, diz «export performance against advanced economies (3-year percentage change), with a threshold of -3%.»; manda a Comissão (`manda: comissao`).

Os veredictos ficam pela razão que os dois literais da Comissão dão: é a Comissão que fixa e revê os valores de referência do painel, e a página dela diz hoje «with thresholds of -/+3% for euro area countries and -/+10% for non-euro area countries» e «with a threshold of -3%». São esses os valores que os cartões rendem, e nenhum mudou. As descrições do Eurostat dizem outros, e a discordância deixou de estar escondida: fica declarada, com a data de cada fonte.

A K9 do `check:cartao` exige a uma testemunha discordante declarada as quatro coisas (o que a descrição do Eurostat diz, a data de criação do conjunto, o que a página da Comissão diz e a data de leitura) e quem manda, com os números de quem manda iguais aos que o cartão rende e os da outra diferentes, e o selo dos dois pedidos (ficheiro, campo, hora, cliente, sha256); e conhece as duas medidas pelo nome, como a K14 conhece as suas, para que tirar a testemunha a uma delas feche a construção. Testemunhas conferidas: 2 (`k9_testemunhas_discordantes_conferidas`); plantas a morder: 5 (`k9_testemunhas_discordantes_plantas_mordidas`) de 5 (`k9_testemunhas_discordantes_plantas`) («a discordância sem a data de criação do conjunto»; «a discordância sem a data de leitura da Comissão»; «a discordância sem quem manda»; «a Comissão a dizer outro valor»; «a discordância escondida»). Nenhuma referência mudou de valor.

### O teste dos dois minutos (achados 7 a 14) e a idade da taxa de atividade (achado 15)

Cada termo ganhou a palavra corrente que um literal de origem selada sustenta, nas duas edições, e nenhum ficou como estava. As origens pediram-se hoje pelo cliente da casa (`indicators/out/l1-2026-09-26/` no motor, 7 (`pedidos_da_correcao`) pedidos, 7 (`pedidos_da_correcao_com_http_200`) com resposta 200, alojados no estudo 13 no commit do motor `1d10b3f`), e declaram-se em `ORIGENS_DAS_DEFINICOES` com o excerto literal e a data de leitura (7 (`origens_da_correcao`) origens: `origens_da_correcao_nomes`; a da idade recorta-se da resposta de `tipslm60` que o bloco já tinha selado a 24.09.2026). Os acertos estão abaixo, palavra a palavra, em «Os acertos de palavras às leituras»; os 22 (`termos_da_correcao_literais`) literais que os sustentam estão todos no campo que citam (22 (`termos_da_correcao_literais_no_campo`), `termos_da_correcao`):

| achado | acerto | medida | o termo | o que a leitura passa a dizer (PT) | os literais que o sustentam |
|---|---|---|---|---|---|
| 7 | A18 | `pib-real-per-capita-2025` | «em termos reais» | «descontada a subida dos preços» | «Volume figures show the development of aggregates excluding inflation.» (`eurostat-nama10-volumes`, `excerto`, no campo); «Inflation is an increase in the general price level of goods and services.» (`eurostat-glossario-inflacao`, `excerto`, no campo); «volumes encadeados» (`propria`, `unit`, no campo) |
| 8 | A19 | `fluxo-de-credito-as-empresas-2025` | «em termos líquidos» | «descontado o que reembolsaram» | «the net amount of liabilities» (`eurostat-tipspc30-descricao`, `excerto`, no campo); «incurrences of liabilities are shown net of repayments of liabilities» (`eurostat-sec2010-registo-liquido`, `excerto`, no campo) |
| 9 | A20 | `fluxo-de-credito-as-familias-2025` | «em termos líquidos» | «descontado o que reembolsaram» | «the net amount of liabilities» (`eurostat-tipspc40-descricao`, `excerto`, no campo); «incurrences of liabilities are shown net of repayments of liabilities» (`eurostat-sec2010-registo-liquido`, `excerto`, no campo) |
| 10 | A21 | `risco-de-pobreza-ou-exclusao-2025` | «rendimento mediano» | a frase «O rendimento mediano é o do meio: metade da população tem mais e metade tem menos.» | «The median is the middle value in a group of numbers ranked in order of size.» (`eurostat-glossario-mediana`, `excerto`, no campo); «50% of the scores are above and 50% are below.» (`eurostat-glossario-mediana`, `excerto`, no campo) |
| 11 | A22 | `criancas-em-creche-2025` | «outro cuidado formal» | «um programa planeado por entidades públicas ou privadas reconhecidas, e não o cuidado dado pelos avós, por outros familiares, por amigos ou vizinhos, ou por uma ama profissional» | «Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies» (`eurostat-cuidado-formal`, `excerto`, no campo); «care provided by grandparents, other household members (not parents), other relatives, friends or neighbours» (`eurostat-cuidado-formal`, `excerto`, no campo); «Other types of childcare may include care that is provided by a professional child-minder» (`eurostat-cuidado-formal`, `excerto`, no campo) |
| 12 | A23 | `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025` | «rendimento disponível» | a frase «O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.» | «all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits» (`eurostat-glossario-rendimento-disponivel`, `excerto`, no campo); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel`, `excerto`, no campo); «the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)» (`glossario-sobrecarga`, `excerto`, no campo) |
| 13 | A24 | `sobrecarga-do-custo-da-habitacao-2025` | «rendimento disponível» | a mesma frase do A23 | «all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits» (`eurostat-glossario-rendimento-disponivel`, `excerto`, no campo); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel`, `excerto`, no campo); «the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)» (`glossario-sobrecarga`, `excerto`, no campo) |
| 14 | A25 | `formacao-bruta-de-capital-fixo-2025` | «produtores residentes» | «as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país» | «households and individuals who make up a household; legal and social entities, such as corporations and quasi-corporations (e.g. branches of foreign direct investors), non-profit institutions, and the government of that economy» (`eurostat-glossario-residente`, `excerto`, no campo); «resident because it has a centre of economic interest in the economic territory of a country» (`eurostat-glossario-residente`, `excerto`, no campo); «the residency status of producers determines the limits of domestic production» (`eurostat-glossario-residente`, `excerto`, no campo) |
| 15 | A26 | `taxa-de-actividade-2025` | a população, sem a idade | «dos `15` aos `64` anos», com os dois algarismos declarados | «the percentage of economically active population aged 15-64 on the total population of the same age» (`eurostat-tipslm60-idade`, `excerto`, no campo) |

O cuidado formal explica-se com a página do Eurostat que o bloco já tinha alojado, citada dela em vez de pedida de novo. O mandato apontava exemplos como o jardim de infância e os serviços organizados de cuidado, e a página não os dá: nenhuma das palavras procuradas aparece nela (`creches_palavras_na_pagina_alojada`), e a expressão «Formal childcare» aparece 23 (`creches_formal_childcare_na_pagina`) vezes. A leitura diz o que a página diz (o que o cuidado formal é, e o que fica fora dele) e não dá exemplos que ela não dá. A palavra «creche», que já estava na leitura, continua sem literal que a nomeie; fica para o lugar de direção.

A taxa de atividade passa a escrever «dos 15 aos 64 anos» nas duas edições, com os dois algarismos declarados e o literal na auditoria («economically active population aged 15-64»), como as outras idades. A pergunta da medida é do B2 e não muda: continua sem a idade.

### As duas leituras do lugar de direção (achados 16 e 19)

O lugar de direção reescreveu as duas no seu ficheiro, e elas vieram para `src/data/leituras-das-medidas.mjs` sem uma palavra mudada. A disparidade salarial fecha a oração com o valor, e o «provisório» da linha rende-se logo depois dele, antes do ponto; as câmaras dizem «o número de câmaras acima do limite era» e «o número sem valor publicado era», e concordam com «o número» seja qual for a contagem. Na disparidade, o A11 de sempre acompanha a frase nova (as empresas «com 10 ou mais trabalhadores», e a frase só no ramo do valor positivo): as trocas do A11 mudaram para a frase nova, e o que acertam é o mesmo. A auditoria relê as duas parte a parte: nas câmaras, «o número de câmaras acima do limite era» apoia-se na linha do limite legal, e as duas ligações seguintes seguem uma chave da prova e são contas. A V2 confere as contagens e não as palavras, e continua verde. `acertos-l1.py` sai com 0 (`acertos_confere_codigo`), com 26 (`acertos`) acertos em 64 (`acertos_trocas`) trocas.

### O que não muda aqui (achados 17, 18 e 20)

Os achados 17 e 18 são sobre os recibos (a página de uma linha do livro-razão), que são do bloco B3, o recibo como página para pessoas, e não mudam aqui. O achado 20 é um limite do pacote de leitura, que não traz a história do repositório, e não do bloco: nada muda. Os achados 21 a 28 dizem o que está bem, e nada pedem.

### O ensaio a seco do lugar de direção sobre o ficheiro do sítio

O ensaio a seco (`design/observatorio/leituras/ensaio-a-seco.mjs`), que rende as leituras com um resolvedor independente do do sítio, corre sobre `src/data/leituras-das-medidas.mjs` com código 0 (`ensaio_a_seco_do_sitio_codigo`): 36 (`ensaio_a_seco_do_sitio_cartoes_com_leitura`) cartões com leitura e 0 (`ensaio_a_seco_do_sitio_por_resolver`) frases com um pedaço por resolver; sobre uma cópia sem a leitura do PIB por habitante, conta um cartão a menos (o conhecido-positivo da mesma medição).

### Os ficheiros, as células, as plantas e os commits desta passagem

No sítio: `src/data/figuras.mjs` (as sete origens novas e as duas testemunhas), `src/data/referencias-das-medidas.mjs` (a testemunha vai com a referência), `src/data/leituras-das-medidas.mjs`, `tests/cartao/referencias.mjs` e `tests/cartao/cartao.mjs` (a K9), `tests/cartao/leituras-provadas.json` (a auditoria, reescrita por `escrever-auditoria-l1.mjs`), `design/especime-v3/INVENTARIO-FRASES.md` e `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, e nesta pasta `origens-l1.py`, `acertos-l1.py` e o seu registo, `escrever-auditoria-l1.mjs`, `captar-l1.mjs`, `medir-l1.py` e este guião. No motor: `indicators/out/l1-2026-09-26/` e o estudo 13 (`motor_commit_da_correcao`). A célula que mudou de forma é a K9 (P: protege um número e a sua fonte), com as suas cinco plantas; a K17 não mudou de código, e as suas 12 (`k17_plantas`) plantas continuam a morder. Os commits desta passagem até à cabeça medida são 3 (`commits_da_correcao_contados`) (`commits_da_correcao`):

- `c1e155f0 L1, correção: os guiões das provas medem a passagem de correção, e o mapa do repositório diz a forma nova da K9`
- `839eda2f L1, correção: as palavras correntes dos termos que a leitura a frio achou por explicar, cada uma com o seu literal, a idade da taxa de atividade, e as duas leituras reescritas pelo lugar de direção`
- `28bcdd00 L1, correção: a discordância sobre os dois valores de referência declarada e datada ao pé de cada um, e a K9 a exigi-la`

## O que ficou feito

Por baixo do número de cada cartão nacional há agora uma leitura em palavras correntes: o que o número quer dizer, como se compara com o período anterior e com a média da União onde a régua tem essas linhas, e de que lado do valor de referência está onde ele existe. A página do país rende 20 (`leituras_pais_pt_depois`) leituras na edição portuguesa e 20 (`leituras_pais_en_depois`) na inglesa, e a dos temas 36 (`leituras_temas_pt_depois`) e 36 (`leituras_temas_en_depois`); nenhum cartão fica sem leitura (`cartoes_sem_leitura_<página>_<edição>_depois`, como a dos temas em inglês: 0 (`cartoes_sem_leitura_temas_en_depois`)), nenhum tem mais de uma (`cartoes_com_mais_de_uma_leitura_<página>_<edição>_depois`), e antes do bloco não havia nenhuma: 0 (`leituras_pais_pt_antes`) na página do país em português, e o mesmo nas outras (`leituras_<página>_<edição>_antes`). As palavras são as do lugar de direção, com 26 (`acertos`) acertos em 64 (`acertos_trocas`) trocas, todos abaixo; os números e os ramos são da máquina.

## O mandato, item a item

| # | o que | a medida | estado |
|---|---|---|---|
| 0 | O mapa do repositório | as citações conferidas à volta da linha citada: 77 (`mapa_citacoes_conferidas`); longe da linha: 0 (`mapa_citacoes_longe`); não encontradas: 0 (`mapa_citacoes_nao_encontradas`). A secção nova «A leitura de cada medida», a K17, a leitura na V2 e no `auditaSelo()`, a célula 10 do `check:voz` e três armadilhas | feito |
| 1 | A declaração e o resolvedor | as leituras declaradas: 37 (`leituras_declaradas`), tantas quantas a tabela das medidas do país obriga, com o cartão das câmaras (`medidasComLeitura()`); a construção fecha sem uma (a planta «a declaração retirada fecha o resolvedor», abaixo) | feito |
| 2 | A leitura no cartão | as marcas da fonte dentro das leituras: 0 (`marcas_da_fonte_nas_leituras_pais_pt`) na página do país e 0 (`marcas_da_fonte_nas_leituras_temas_pt`) na dos temas (o mesmo nas edições inglesas); as plantas do `auditaSelo()` a morder: 3 (`plantas_portoes_l1_do_audita_selo_que_morderam`) de 3 (`plantas_portoes_l1_do_audita_selo`) | feito |
| 3 | A folha | as medições de leitura nas capturas do depois: 560 (`capturas_depois_com_leitura`); a 14 px: 560 (`capturas_depois_a_14px`); na tinta: 560 (`capturas_depois_na_tinta`); a 58ch: 560 (`capturas_depois_a_58ch`); com a medida da pergunta, onde há pergunta: 270 (`capturas_depois_com_a_medida_da_pergunta`) de 270 (`capturas_depois_com_pergunta`); cartões que transbordam: 0 (`capturas_depois_cartoes_que_transbordam`); páginas que transbordam a 390 px: 0 (`capturas_depois_paginas_que_transbordam_a_390`) | feito |
| 4 | A auditoria das origens | as medidas auditadas: 37 (`k17_auditoria_medidas`); as folhas: 793 (`k17_auditoria_folhas`); as partes: 937 (`k17_auditoria_partes`) (244 (`k17_auditoria_diz`) dizem o que a medida é, 243 (`k17_auditoria_conta`) são contas, 450 (`k17_auditoria_liga`) ligam); os apoios: 352 (`k17_auditoria_apoios`); as origens usadas: 78 (`k17_auditoria_origens_das_leituras`); os erros: 0 (`k17_erros_da_auditoria`). As origens novas: 51 (`origens_novas`); conferidas contra o motor, com as 2 (`testemunhas_conferidas_contra_o_motor`) testemunhas discordantes, 53 (`origens_conferidas`) | feito |
| 5 | A leitura rendida | os cartões conferidos na página do país e na dos temas, nas duas edições: 112 (`k17_paginas_cartoes`), em 4 (`k17_paginas_paginas`) páginas; os ramos recontados: 236 (`k17_paginas_ramos`); os erros: 0 (`k17_erros_nas_paginas`); as plantas da K17 a morder: 12 (`k17_plantas`) | feito |
| 6 | As idades e os algarismos | os algarismos declarados das leituras, conferidos um a um: 24 (`algarismos_das_leituras_contados`) (a lista inteira em `algarismos_das_leituras`, com o literal de cada um) | feito, com um ponto parado: ver «O que fica por fazer» |
| 7 | A voz | as linhas do inventário: 24 (`inventario_linhas_l1`) do bloco `l1`, das quais 12 (`inventario_linhas_l1_inglesas`) inglesas, e 16 (`inventario_linhas_l1_correcao`) do bloco `l1-correcao`, as que a passagem de correção mudou, das quais 8 (`inventario_linhas_l1_correcao_inglesas`) inglesas; as exceções da lista dos marcadores que nomeiam o bloco: 3 (`excecoes_da_voz_com_o_l1`); «limiar» nas leituras: 0 (`palavra_limiar_nas_leituras_pais_pt`) na página do país em português (e o mesmo nas outras páginas e edições, com «threshold» nas inglesas); leituras que falam do projeto ou da página: 0 (`leituras_que_falam_do_projeto_pais_pt`); o `check:voz`, o `check:palavras` e o `check:lingua` correm dentro da verificação, ligados por `&&`, e a verificação só sai com 0 com os três a 0 (abaixo) | feito |
| 8 | As capturas, o relatório, as cópias | as capturas de página do depois: 20 (`capturas_depois_paginas`); os recortes dos cartões, a 390 e a 1 280 px nas duas edições (o saldo e os onze cuja leitura mudou na passagem de correção): 48 (`capturas_depois_recortes`); as do antes: 20 (`capturas_antes_paginas`) páginas e 8 (`capturas_antes_recortes`) recortes (os dois cartões do diretor); as falhas de aceitação: 0 (`capturas_depois_falhas`); as cópias congeladas das quatro páginas do depois em `paginas-depois/`, presas por sha256 (`paginas_depois_sha256`) | feito |

## Os portões

Corridos por `correr-portao-l1.py`, um de cada vez, cada um no seu comando, com o `.codigo` apagado antes e escrito do código do próprio processo:

- `npm run build`: código 0 (`portao_build.codigo`), em 303,7 (`portao_build.segundos`) segundos;
- `npm run verify`: código 0 (`portao_verify.codigo`), em 486,9 (`portao_verify.segundos`) segundos;
- `npm run typecheck`: código 0 (`portao_typecheck.codigo`), em 0,2 (`portao_typecheck.segundos`) segundos.

Todos na mesma cabeça (`portoes_na_mesma_cabeca`). O verificador de tipos é rápido nesta máquina, e por isso se mediu que ele vê: um ficheiro de fora da árvore com um erro de tipo plantado, posto no mesmo programa, é apontado (`typecheck_ve_um_erro_plantado`). O registo de cada corrida está em `portoes/`, com a raiz da árvore trocada por «./» (`portao_build` diz quantas vezes, e o sha256 do registo antes e depois).

## Os acertos de palavras às leituras

O ficheiro do sítio é a cópia do do lugar de direção com estas trocas e comentários, e mais nada: `acertos-l1.py` aplica-as à cópia, tira os comentários de bloco aos dois ficheiros e exige que fiquem iguais: a conferência sai com 0 (`acertos_confere_codigo`), e a mesma conferência sobre uma cópia com uma palavra a mais sai com 1 (o conhecido-positivo da mesma medição). A1 a A15 foram pedidos pela auditoria das origens; A16 e A17 pelo portão da voz, com a palavra do literal; A18 a A26 pela leitura a frio do Codex, na passagem de correção de 26.09.2026.

**A1**, `pib-real-per-capita-2025`. A descrição do Eurostat diz «real gross domestic product» e não diz como o valor real se calcula; a oração sobre os preços de um ano fixo não estava em origem nenhuma lida. Apoio: «real gross domestic product» (`eurostat-tipsna40-descricao`, campo `excerto`).

- antes: `por habitante, medido a preços de um ano fixo para se poder comparar entre anos.'`
- depois: `por habitante, em termos reais.'`
- antes: `per inhabitant, measured at the prices of a fixed year so that years can be compared.'`
- depois: `per inhabitant, in real terms.'`

**A2**, `saldo-das-administracoes-publicas-2025`. O subsetor chama-se «Administração Local» no INE; «as autarquias» nomeia-o em palavras correntes, e «as câmaras» é o nome de um órgão, não do subsetor. Apoio: «Administração Local» (`ine-pde-subsetores`, campo `excerto`).

- antes: `(o Estado, as regiões autónomas, as câmaras e a segurança social)` (3 vezes, `acertos-l1.json`)
- depois: `(o Estado, as regiões autónomas, as autarquias e a segurança social)`
- antes: `(the State, the autonomous regions, the municipalities and social security)` (3 vezes, `acertos-l1.json`)
- depois: `(the State, the autonomous regions, local authorities and social security)`

**A3**, `crescimento-da-despesa-liquida-2025`. Nenhuma origem lida diz que o Governo controla esta despesa: o que o CFP apura é o crescimento da despesa líquida. O compromisso é «assumido por Portugal e endossado pelo Conselho da UE», e não um compromisso com o Conselho; e o valor de referência é o do ano do cartão, numa trajetória, e não um teto igual todos os anos. Apoio: «crescimento da despesa líquida» (`propria`, campo `excerpt`); «compromisso assumido por Portugal e endossado pelo Conselho da UE» (`cfp-compromisso`, campo `excerto`); «comprometeu-se com uma determinada trajetória de crescimento da despesa líquida» (`cfp-trajetoria`, campo `excerto`); «a taxa de crescimento de 5% recomendada» (`propria`, campo `excerpt`).

- antes: `'É quanto cresceu num ano a despesa pública que o Governo controla: a despesa líquida, que não conta os juros da dívida,`
- depois: `'É quanto cresceu num ano a despesa pública líquida: a que não conta os juros da dívida,`
- antes: `'It is how much the public spending the Government controls grew in a year: net expenditure, which leaves out interest on the debt,`
- depois: `'It is how much net public expenditure grew in a year: the expenditure that leaves out interest on the debt,`
- antes: `' Portugal comprometeu-se com o Conselho da União Europeia a não a deixar crescer mais de ', { referencia: 'unico' }, ' % por ano: em ', { periodo: 'proprio' }, ' ', { estado:`
- depois: `' Portugal comprometeu-se, num compromisso endossado pelo Conselho da União Europeia, a não a deixar crescer mais de ', { referencia: 'unico' }, ' % em ', { periodo: 'proprio' }, ': ', { estado:`
- antes: `' Portugal committed to the Council of the European Union not to let it grow by more than ', { referencia: 'unico' }, ' % a year: in ', { periodo: 'proprio' }, ' it ', { estado:`
- depois: `' Portugal committed, in a commitment endorsed by the Council of the European Union, not to let it grow by more than ', { referencia: 'unico' }, ' % in ', { periodo: 'proprio' }, ': it ', { estado:`

**A4**, `posicao-de-investimento-internacional-2025`. O Banco de Portugal escreve «responsabilidade» perante o exterior («net external liability» na edição inglesa), e não dívida; a frase passa a usar a palavra dele. Apoio: «representando uma responsabilidade perante o exterior» (`bdp-pii-sinal`, campo `excerto`); «there is a net external liability» (`bdp-pii-sinal`, campo `excertoEn`).

- antes: `'A dívida líquida ao exterior encolheu face a'`
- depois: `'A responsabilidade líquida perante o exterior encolheu face a'`
- antes: `'A dívida líquida ao exterior cresceu face a'`
- depois: `'A responsabilidade líquida perante o exterior cresceu face a'`
- antes: `'A dívida líquida ao exterior ficou igual à de'`
- depois: `'A responsabilidade líquida perante o exterior ficou igual à de'`
- antes: `'The net debt to the rest of the world shrank from'`
- depois: `'The net external liability shrank from'`
- antes: `'The net debt to the rest of the world grew from'`
- depois: `'The net external liability grew from'`
- antes: `'The net debt to the rest of the world was unchanged from'`
- depois: `'The net external liability was unchanged from'`

**A5**, `taxa-de-cambio-efectiva-real-2025`. Nenhuma origem lida diz que uma subida quer dizer perda de competitividade: a descrição do Eurostat e o glossário da taxa de câmbio (para onde o endereço do glossário da taxa de câmbio efetiva real redireciona) falam da competitividade de preços sem dizer o sentido de uma subida, os outros dois endereços de glossário procurados responderam 404, e a página do BCE dos indicadores harmonizados de competitividade também não o diz. A oração sai. Apoio: «price or cost competitiveness relative to its principal competitors» (`eurostat-tipser10-descricao`, campo `excerto`).

- antes: `em três anos: quando sobe, o país perde competitividade; quando desce, ganha.'`
- depois: `em três anos.'`
- antes: `over three years: when it rises, the country loses competitiveness; when it falls, it gains.'`
- depois: `over three years.'`

**A6**, `divida-das-empresas-2025`. A descrição do Eurostat conta os títulos de dívida e os empréstimos («Debt securities (F.3) and Loans (F.4)»), e não tudo o que as empresas devem. Apoio: «Debt securities (F.3) and Loans (F.4)» (`eurostat-tipspd30-descricao`, campo `excerto`).

- antes: `'É tudo o que as empresas devem, fora as financeiras, '`
- depois: `'É o que as empresas devem em empréstimos e títulos de dívida, fora as financeiras, '`
- antes: `'It is everything companies owe, excluding financial companies, '`
- depois: `'It is what companies owe in loans and debt securities, excluding financial companies, '`

**A7**, `divida-das-familias-2025`. O setor é o das famílias e das instituições sem fim lucrativo ao seu serviço, e a dívida é a de títulos e empréstimos. Apoio: «the stock of liabilities held by the sector Households and Non-Profit institutions serving households» (`eurostat-tipspd22-descricao`, campo `excerto`); «Debt securities (F.3) and Loans (F.4)» (`eurostat-tipspd22-descricao`, campo `excerto`).

- antes: `'É tudo o que as famílias devem, '`
- depois: `'É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem em empréstimos e títulos de dívida, '`
- antes: `'It is everything households owe, '`
- depois: `'It is what households and non-profit institutions serving them owe in loans and debt securities, '`

**A8**, `fluxo-de-credito-as-empresas-2025`. O Eurostat mede o montante líquido dos passivos contraídos no ano, e não o crédito novo recebido. Apoio: «the net amount of liabilities incurred during the year» (`eurostat-tipspc30-descricao`, campo `excerto`).

- antes: `'É quanto crédito novo as empresas receberam num ano, fora as financeiras`
- depois: `'É quanto crédito as empresas contraíram num ano, em termos líquidos, fora as financeiras`
- antes: `'It is how much new credit companies received in a year, excluding financial companies`
- depois: `'It is how much credit companies took on in a year, net, excluding financial companies`

**A9**, `fluxo-de-credito-as-familias-2025`. O Eurostat mede o montante líquido dos passivos contraídos no ano pelas famílias e pelas instituições sem fim lucrativo ao seu serviço, e não o crédito novo recebido pelas famílias. Apoio: «the net amount of liabilities which the sectors Households and Non-Profit institutions serving households (S.14_S.15) have incurred during the year» (`eurostat-tipspc40-descricao`, campo `excerto`).

- antes: `'É quanto crédito novo as famílias receberam num ano, em percentagem`
- depois: `'É quanto crédito as famílias e as instituições sem fim lucrativo ao seu serviço contraíram num ano, em termos líquidos, em percentagem`
- antes: `'It is how much new credit households received in a year, as a percentage`
- depois: `'It is how much credit households and non-profit institutions serving them took on in a year, net, as a percentage`

**A10**, `ganho-medio-mensal-2024`. A nota do INE diz «trabalhadores por conta de outrem a tempo completo», e o conceito de ganho é o montante ilíquido pago com caráter regular pelo período normal e extraordinário; a lista de rubricas da frase anterior não estava no literal. Apoio: «trabalhadores por conta de outrem a tempo completo» (`ine-ganho-nota`, campo `excerto`); «pago ao trabalhador com caráter regular» (`ine-ganho-conceito`, campo `excerto`); «no período normal e extraordinário» (`ine-ganho-conceito`, campo `excerto`); «Montante ilíquido» (`ine-ganho-conceito`, campo `excerto`).

- antes: `'É o que um trabalhador por conta de outrem ganhou por mês, em média, em '`
- depois: `'É o que um trabalhador por conta de outrem a tempo completo ganhou por mês, em média, em '`
- antes: `', com o salário base, as horas extraordinárias e os subsídios regulares, antes de descontos.'`
- depois: `', com o que lhe é pago com caráter regular pelas horas normais e extraordinárias, antes de descontos.'`
- antes: `'It is what an employee earned per month, on average, in '`
- depois: `'It is what a full-time employee earned per month, on average, in '`
- antes: `', including base pay, overtime and regular allowances, before deductions.'`
- depois: `', including what is paid on a regular basis for normal and overtime hours, before deductions.'`

**A11**, `disparidade-salarial-entre-sexos-2024`. A cobertura do Eurostat é a das empresas com «10 employees or more» (trabalhadores, e não pessoas ao serviço). E a primeira frase só é verdadeira com o valor positivo: passa a ramo `sinal.positivo`, sem mudar palavra, e um valor de outro sinal fecha a construção em vez de a deixar sair falsa. A 26.09.2026 o lugar de direção reescreveu a frase no seu ficheiro, para que o valor feche a oração e «provisório» feche com ele; as trocas deste acerto acompanham a frase nova e acertam o mesmo que acertavam. Apoio: «10 employees or more» (`eurostat-earn-grgpg2-cobertura`, campo `excerto`); «the difference between average gross hourly earnings of male paid employees and of female paid employees» (`eurostat-earn-grgpg2-definicao`, campo `excerto`).

- antes: `' ou mais pessoas ao serviço: a diferença, em percentagem do ganho dos homens, foi de '`
- depois: `' ou mais trabalhadores: a diferença, em percentagem do ganho dos homens, foi de '`
- antes: `' %' }, '.', DIFERENCA, DIFERENCA_UE]`
- depois: `' %' }, '.'] } }, DIFERENCA, DIFERENCA_UE]`
- antes: `pt: ['Por cada hora de trabalho,`
- depois: `pt: [{ sinal: { positivo: ['Por cada hora de trabalho,`
- antes: `' %' }, '.', GAP, GAP_EU]`
- depois: `' %' }, '.'] } }, GAP, GAP_EU]`
- antes: `en: ['Per hour worked,`
- depois: `en: [{ sinal: { positivo: ['Per hour worked,`

**A12**, `criancas-em-creche-2025`. O Eurostat põe a ama profissional nos outros tipos de cuidado, e não no cuidado formal («Other types of childcare may include care that is provided by a professional child-minder»); o exemplo sai. Apoio: «Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies» (`eurostat-cuidado-formal`, campo `excerto`).

- antes: `' anos que está numa creche ou noutro cuidado formal, como uma ama profissional.'`
- depois: `' anos que está numa creche ou noutro cuidado formal.'`
- antes: `' who are in a nursery or other formal childcare, such as a professional child-minder.'`
- depois: `' who are in a nursery or other formal childcare.'`

**A13**, `sobrecarga-do-custo-da-habitacao-2025`. O regime do Eurostat é «Tenant, rent at reduced price or free» (a renda gratuita conta), e a Comissão escreve que a taxa «should be read together with the tenure structure», e não que manda lê-la por regime. Apoio: «"OWN_L":"Owner, with mortgage or loan","OWN_NL":"Owner, no outstanding mortgage or housing loan","RENT_MKT":"Tenant, rent at market price","RENT_FR":"Tenant, rent at reduced price or free"» (`eurostat-tessi164-regimes`, campo `excerto`); «The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.» (`ce-swd-2026-222-habitacao`, campo `excerto`).

- antes: `arrendada a preço de mercado ou a renda reduzida)`
- depois: `arrendada a preço de mercado ou a renda reduzida ou gratuita)`
- antes: `rented at market price or at a reduced rent)`
- depois: `rented at market price or at a reduced rent or free)`
- antes: `' Este total mistura situações muito diferentes, e a Comissão Europeia manda lê-lo por regime de ocupação.'`
- depois: `' Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.'`
- antes: `' This total mixes very different situations, and the European Commission says it should be read by tenure status.'`
- depois: `' This total mixes very different situations, and the European Commission says it should be read together with the tenure structure.'`

**A14**, `competencias-digitais-2025`. O Eurostat escreve «activities related to internet or software use»: as competências contam o uso de programas, e não só a internet. Apoio: «activities related to internet or software use» (`eurostat-tepsr_sp410-descricao`, campo `excerto`).

- antes: `proteger-se e resolver problemas na internet.'`
- depois: `proteger-se e resolver problemas no uso da internet e de programas informáticos.'`
- antes: `stay safe and solve problems online.'`
- depois: `stay safe and solve problems when using the internet or software.'`

**A15**, `formacao-bruta-de-capital-fixo-2025`. O glossário do Eurostat define a formação bruta de capital fixo pelas aquisições dos produtores residentes, descontadas as cessões; nenhuma origem lida lhe chama o investimento feito no país. Apoio: «consists of resident producers’ acquisitions, less disposals, of fixed assets during a given period» (`eurostat-glossario-fbcf`, campo `excerto`).

- antes: `pt: ['É o investimento feito no país num ano em bens que duram mais de um ano,`
- depois: `pt: ['É o que os produtores residentes compraram num ano, descontado o que venderam, em bens que duram mais de um ano,`
- antes: `en: ['It is the investment made in the country in a year in assets that last more than a year,`
- depois: `en: ['It is what resident producers acquired in a year, less what they disposed of, in assets that last more than a year,`

**A16**, `crescimento-da-despesa-liquida-2025`. Pedido pelo portão da voz, com a palavra da fonte: «Despesa paga» é uma frase retirada do inventário (o cabeçalho das contas do município, que saiu com a peça 2 do B1), e a procura das retiradas morde por palavra inteira dentro de outra frase. A palavra do Conselho das Finanças Públicas é «financiada». A frase retirada fica retirada. Apoio: «Despesa financiada por fundos da UE (4)» (`cfp-despesa-liquida`, campo `excerto`).

- antes: `a despesa paga por fundos europeus nem a que sobe`
- depois: `a despesa financiada por fundos europeus nem a que sobe`
- antes: `spending paid by European funds and the spending`
- depois: `spending financed by European funds and the spending`

**A17**, `taxa-de-emprego-2025`. Pedido pelo portão da voz, com a palavra da fonte: «The share of people aged to who are in employment.» é a definição da casa que o F1.10 retirou quando a definição de cada medida passou a sair da fonte, e a leitura inglesa trazia-a de volta palavra a palavra. A palavra do glossário do Eurostat é «employed persons». A frase retirada fica retirada; a edição portuguesa não tinha a coincidência e não muda. Apoio: «percentage of employed persons» (`glossario-emprego`, campo `excerto`).

- antes: `' who are in employment.', ROSE, EU_AVERAGE]`
- depois: `' who are employed.', ROSE, EU_AVERAGE]`

**A18**, `pib-real-per-capita-2025`. A leitura a frio (achado 7) achou «em termos reais» por explicar. A ficha de metadados que a resposta `tipsna40` nomeia diz que os volumes mostram a evolução dos agregados sem a inflação, a linha está em volumes encadeados, e o glossário do Eurostat diz que a inflação é a subida do nível geral dos preços: a leitura passa a dizer «descontada a subida dos preços». Apoio: «Volume figures show the development of aggregates excluding inflation.» (`eurostat-nama10-volumes`, campo `excerto`); «Inflation is an increase in the general price level of goods and services.» (`eurostat-glossario-inflacao`, campo `excerto`); «volumes encadeados» (`propria`, campo `unit`).

- antes: `por habitante, em termos reais.'`
- depois: `por habitante, descontada a subida dos preços.'`
- antes: `per inhabitant, in real terms.'`
- depois: `per inhabitant, excluding the rise in prices.'`

**A19**, `fluxo-de-credito-as-empresas-2025`. A leitura a frio (achado 8) achou «em termos líquidos» por explicar. O Eurostat mede o montante líquido dos passivos contraídos no ano, e o SEC 2010 publicado pelo Eurostat (§5.23) define o registo líquido: os passivos contraídos descontados dos reembolsos. A leitura passa a dizer «descontado o que reembolsaram». Apoio: «the net amount of liabilities» (`eurostat-tipspc30-descricao`, campo `excerto`); «incurrences of liabilities are shown net of repayments of liabilities» (`eurostat-sec2010-registo-liquido`, campo `excerto`).

- antes: `'É quanto crédito as empresas contraíram num ano, em termos líquidos, fora as financeiras`
- depois: `'É quanto crédito as empresas contraíram num ano, descontado o que reembolsaram, fora as financeiras`
- antes: `'It is how much credit companies took on in a year, net, excluding financial companies`
- depois: `'It is how much credit companies took on in a year, minus what they repaid, excluding financial companies`

**A20**, `fluxo-de-credito-as-familias-2025`. A leitura a frio (achado 9) achou «em termos líquidos» por explicar, pela mesma razão do A19: o Eurostat mede o montante líquido dos passivos contraídos no ano, e o SEC 2010 (§5.23) define o líquido como os passivos contraídos descontados dos reembolsos. Apoio: «the net amount of liabilities» (`eurostat-tipspc40-descricao`, campo `excerto`); «incurrences of liabilities are shown net of repayments of liabilities» (`eurostat-sec2010-registo-liquido`, campo `excerto`).

- antes: `contraíram num ano, em termos líquidos, em percentagem`
- depois: `contraíram num ano, descontado o que reembolsaram, em percentagem`
- antes: `took on in a year, net, as a percentage`
- depois: `took on in a year, minus what they repaid, as a percentage`

**A21**, `risco-de-pobreza-ou-exclusao-2025`. A leitura a frio (achado 10) achou «rendimento mediano» por explicar. O glossário do Eurostat diz que a mediana é o valor do meio, com metade acima e metade abaixo: a leitura ganha uma frase que o diz. Apoio: «The median is the middle value in a group of numbers ranked in order of size.» (`eurostat-glossario-mediana`, campo `excerto`); «50% of the scores are above and 50% are below.» (`eurostat-glossario-mediana`, campo `excerto`).

- antes: `; cada pessoa conta uma só vez.', SUBIU, MEDIA_UE]`
- depois: `; cada pessoa conta uma só vez. O rendimento mediano é o do meio: metade da população tem mais e metade tem menos.', SUBIU, MEDIA_UE]`
- antes: `; each person counts only once.', ROSE, EU_AVERAGE]`
- depois: `; each person counts only once. The median income is the one in the middle: half the population has more and half has less.', ROSE, EU_AVERAGE]`

**A22**, `criancas-em-creche-2025`. A leitura a frio (achado 11) achou que «outro cuidado formal» só repetia o nome da categoria. A página do Eurostat que o bloco já tinha alojado diz o que o cuidado formal é (um programa planeado por entidades públicas e privadas reconhecidas) e o que fica fora dele (o cuidado dos avós, de outros familiares, de amigos ou vizinhos, e o de uma ama profissional): a leitura diz as duas coisas com as palavras dela. A página não dá exemplos como o jardim de infância, e a leitura não os dá. Apoio: «Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies» (`eurostat-cuidado-formal`, campo `excerto`); «care provided by grandparents, other household members (not parents), other relatives, friends or neighbours» (`eurostat-cuidado-formal`, campo `excerto`); «Other types of childcare may include care that is provided by a professional child-minder» (`eurostat-cuidado-formal`, campo `excerto`).

- antes: `' anos que está numa creche ou noutro cuidado formal.'`
- depois: `' anos que está numa creche ou noutro cuidado formal: um programa planeado por entidades públicas ou privadas reconhecidas, e não o cuidado dado pelos avós, por outros familiares, por amigos ou vizinhos, ou por uma ama profissional.'`
- antes: `' who are in a nursery or other formal childcare.'`
- depois: `' who are in a nursery or other formal childcare: a programme planned through public organisations or recognised private bodies, and not care given by grandparents, other relatives, friends or neighbours, or a professional child-minder.'`

**A23**, `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`. A leitura a frio (achado 12) achou «rendimento disponível» por explicar. O glossário do Eurostat diz como se faz: somam-se os rendimentos do trabalho, dos investimentos e das prestações sociais, e descontam-se os impostos e as contribuições sociais pagos; e o glossário da sobrecarga diz que os custos e o rendimento contam líquidos dos apoios à habitação. A leitura ganha uma frase que diz as duas coisas. Apoio: «all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits» (`eurostat-glossario-rendimento-disponivel`, campo `excerto`); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel`, campo `excerto`); «the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)» (`glossario-sobrecarga`, campo `excerto`).

- antes: `' % do rendimento disponível com a habitação.', SUBIU, MEDIA_UE]`
- depois: `' % do rendimento disponível com a habitação. O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.', SUBIU, MEDIA_UE]`
- antes: `' % of its disposable income on housing.', ROSE, EU_AVERAGE]`
- depois: `' % of its disposable income on housing. Disposable income is what the household receives, from work, investment and social benefits, after the taxes and social contributions it pays; housing allowances are deducted from both the income and the housing costs.', ROSE, EU_AVERAGE]`

**A24**, `sobrecarga-do-custo-da-habitacao-2025`. A leitura a frio (achado 13) achou o mesmo «rendimento disponível» por explicar na sobrecarga de todos os regimes; a frase é a do A23, pelas mesmas origens. Apoio: «all monetary incomes received from any source by each member of a household are added up; these include income from work, investment and social benefits» (`eurostat-glossario-rendimento-disponivel`, campo `excerto`); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel`, campo `excerto`); «the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)» (`glossario-sobrecarga`, campo `excerto`).

- antes: `' % do rendimento disponível com a habitação.', SUBIU, ' Este total`
- depois: `' % do rendimento disponível com a habitação. O rendimento disponível é o que o agregado recebe, do trabalho, de investimentos e de prestações sociais, depois de pagos os impostos e as contribuições sociais; os apoios à habitação descontam-se do rendimento e do que se gasta com a habitação.', SUBIU, ' Este total`
- antes: `' % of its disposable income on housing.', ROSE, ' This total`
- depois: `' % of its disposable income on housing. Disposable income is what the household receives, from work, investment and social benefits, after the taxes and social contributions it pays; housing allowances are deducted from both the income and the housing costs.', ROSE, ' This total`

**A25**, `formacao-bruta-de-capital-fixo-2025`. A leitura a frio (achado 14) achou «produtores residentes» por explicar. O glossário do Eurostat da unidade institucional residente diz quem são as unidades de uma economia (as famílias, as empresas, as instituições sem fim lucrativo e o Estado), que é residente quem tem o centro de interesse económico no território do país, e que é a residência dos produtores que delimita a produção do país: a leitura diz quem são, e que produzem no país. Apoio: «households and individuals who make up a household; legal and social entities, such as corporations and quasi-corporations (e.g. branches of foreign direct investors), non-profit institutions, and the government of that economy» (`eurostat-glossario-residente`, campo `excerto`); «resident because it has a centre of economic interest in the economic territory of a country» (`eurostat-glossario-residente`, campo `excerto`); «the residency status of producers determines the limits of domestic production» (`eurostat-glossario-residente`, campo `excerto`).

- antes: `pt: ['É o que os produtores residentes compraram num ano,`
- depois: `pt: ['É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano,`
- antes: `en: ['It is what resident producers acquired in a year,`
- depois: `en: ['It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year,`

**A26**, `taxa-de-actividade-2025`. A leitura a frio (achado 15) achou a população sem a idade que a fonte fixa. A descrição de `tipslm60` que o bloco já tinha selado diz «economically active population aged 15-64»: a leitura escreve os dois limites, com o literal na auditoria, como as outras idades. A pergunta da medida não muda (é do B2) e continua sem a idade. Apoio: «the percentage of economically active population aged 15-64 on the total population of the same age» (`eurostat-tipslm60-idade`, campo `excerto`).

- antes: `'É quanto mudou em três anos, em pontos percentuais, a parte da população que está ativa: a trabalhar ou à procura de trabalho.',`
- depois: `'É quanto mudou em três anos, em pontos percentuais, a parte da população dos ', { nl: '15', motivo: 'escala-de-instrumento' }, ' aos ', { nl: '64', motivo: 'escala-de-instrumento' }, ' anos que está ativa: a trabalhar ou à procura de trabalho.',`
- antes: `'It is how much the share of the population that is active, working or looking for work, changed over three years, in percentage points.',`
- depois: `'It is how much the share of the population aged ', { nl: '15', motivo: 'escala-de-instrumento' }, ' to ', { nl: '64', motivo: 'escala-de-instrumento' }, ' that is active, working or looking for work, changed over three years, in percentage points.',`

## As formas que mudaram, e o que cada uma continua a proteger

- **O `auditaSelo()` do portão de HTML.** Aceita um valor dentro de `[data-cartao-leitura][data-selo-em]` só quando a leitura é do próprio cartão (`data-cartao-leitura` e `data-selo-em` iguais ao cartão), o valor é a linha do cartão, a do período anterior da mesma série ou o agregado da União da mesma medida, e o cartão tem a sua marca: a regra do item da régua. Protege a porta do recibo de cada número (**P**). Plantas: `l1-leitura-sem-selo-em`, `l1-leitura-de-outro-cartao`, `l1-leitura-com-linha-alheia`.
- **A V2 (`scripts/pais-camaras.mjs`).** A leitura das câmaras diz contagens e o período; a V2 separa as chaves da leitura das da linha do valor, confere cada contagem da leitura contra a recontagem, exige que não tenha porta própria nem cite linha nenhuma, e que o período seja o das linhas contadas. Protege as contagens (**P**). Plantas: as `l1-camaras-leitura-*` de `tests/pais/camaras.mjs` (9 (`plantas_camaras_l1_que_passaram`) de 9 (`plantas_camaras_l1`)), e as plantas antigas da linha do valor passaram a escolher o nó fora da leitura, para morderem o que sempre morderam (35 (`plantas_camaras_que_passaram`) de 35 (`plantas_camaras`) no ficheiro todo).
- **A K1 e a K10 do `check:cartao`.** A K1 admite a peça `cartao-medida-leitura` e mais nenhuma (a planta antiga de uma peça estranha continua a morder); a K10 não conta como segunda marca o valor do próprio cartão citado na leitura. Protegem a forma do cartão e a marca única (**M** e **P**).
- **A célula 10 do `check:voz`, o arame da classe por provar.** Media as leituras como prosa solta e mordia «subiu» e «média da União». Passa a tirar do arame as leituras dos cartões, e só elas, depois de a K17 as conferir na mesma corrida, porque a cadeia da construção chama o `check:voz` e não o `check:cartao`; uma leitura que a K17 recuse fica dentro do arame. Protege a regra do F0.9 (nenhuma comparação sem a linha que a prova). Plantas: `l1-leitura-que-a-k17-recusa` e `l1-leitura-fora-do-cartao` (2 (`plantas_portoes_l1_do_arame_que_morderam`) de 2 (`plantas_portoes_l1_do_arame`)), e o autoteste do arame, que prova que uma leitura num cartão sai, que a mesma marca fora de um cartão não sai e que uma leitura que a K17 recuse não sai.
- **A K17 lê o texto descodificado** quando procura algarismos soltos, com a planta «um algarismo escrito como referência de carácter».
- **A K9 do `check:cartao`** (passagem de correção). Além de comparar as duas testemunhas de cada valor de referência, exige a uma testemunha discordante declarada o que cada fonte diz, a data de criação do conjunto, a data de leitura da Comissão e quem manda, e conhece pelo nome as duas medidas em que a discordância existe. Protege o valor de referência e a sua fonte (**P**). Plantas: as cinco de «A passagem de correção», acima.

As 5 (`plantas_portoes_l1`) plantas do portão de HTML e do arame morderam todas (5 (`plantas_portoes_l1_que_morderam`)), com os ficheiros de `dist/` repostos byte a byte.

## As plantas da K17

12 (`k17_plantas`) plantas, todas a morder (`k17_plantas_nomes` dá os nomes): as do item 4 do brief sobre a auditoria (a origem tirada, a leitura mudada sem nova leitura, um literal que o campo não tem, um pedaço sem apoio, um algarismo sem literal), a declaração retirada (um processo filho carrega o resolvedor sem a leitura do saldo e o módulo recusa carregar, e o mesmo filho sem o estrago carrega), e as do item 5 sobre a página (um algarismo escrito à mão, o mesmo escrito como referência de carácter, o ramo trocado, uma linha de outra medida citada, um cartão sem leitura, a leitura com a marca da fonte).

## As origens seladas e as que não se acharam

As origens novas das leituras são 51 (`origens_novas`): 38 (`origens_com_selo_de_pedido`) com o selo de um pedido feito pelo cliente da casa no motor e 13 (`origens_alojadas`) alojadas no estudo 13 antes deste bloco (os nomes em `origens_novas_nomes`). O motor registou 27 (`pedidos_do_bloco`) pedidos em `indicators/out/l1-2026-09-24/pedidos.jsonl`, todos com resposta 200 (27 (`pedidos_do_bloco_com_http_200`)), e alojou 29 (`ficheiros_alojados_no_estudo_13`) ficheiros no estudo 13 com o sha256 no manifesto, no commit `1e3b15c`; a passagem de correção pediu 7 (`pedidos_da_correcao`) em `indicators/out/l1-2026-09-26/` e alojou 8 (`ficheiros_alojados_na_correcao`) no commit `1d10b3f` (os commits do motor no bloco: 2 (`motor_commits_do_bloco`)). `origens-l1.py --confere` relê cada declaração contra os bytes do motor: 0 (`origens_com_faltas`) faltas.

Não se acharam, e por isso as palavras saíram ou mudaram (os acertos dizem quais): uma origem que diga que a despesa líquida é a que o Governo controla (A3); uma que diga o sentido de uma subida da taxa de câmbio efetiva real (A5); uma que chame investimento feito no país à formação bruta de capital fixo (A15); uma que explique o valor real pelos preços de um ano fixo (A1; na passagem de correção, o A18 explica-o pela inflação, com a ficha nama10). Os endereços de glossário procurados e que não serviram estão em `sondas-l1.json`, pedidos pelo mesmo cliente com a hora e o sha256: 9 (`sondas`) endereços, 8 (`sondas_404`) com resposta 404 e 1 (`sondas_200`) com resposta 200 (o da taxa de câmbio efetiva real, que leva ao glossário da taxa de câmbio e não diz o sentido). Na passagem de correção, os endereços experimentados antes de escolher cada origem foram sondas de rascunho, pelo mesmo cliente, e não ficaram registados nesta pasta; as origens escolhidas foram pedidas de novo pelo guião do motor, e são essas que estão seladas.

## As alturas das páginas

A leitura acrescenta altura às páginas (`alturas_das_paginas_px`, em px): a do país em português, a 390 px, passou de 7 563 (`alturas_das_paginas_px.antes.pais_pt_390`) para 9 956 (`alturas_das_paginas_px.depois.pais_pt_390`), e a 1 280 px de 5 308 (`alturas_das_paginas_px.antes.pais_pt_1280`) para 7 056 (`alturas_das_paginas_px.depois.pais_pt_1280`); a dos temas em português, a 390 px, de 6 831 (`alturas_das_paginas_px.antes.temas_pt_390`) para 11 442 (`alturas_das_paginas_px.depois.temas_pt_390`). Nenhuma régua da cabeça ou do cartão mede alturas de modo que a leitura a partisse: o `check:cabeca`, o `check:alvos`, o `check:css` e o `design:feixe` correm dentro da verificação acima.

## O que fica por fazer, e porquê

1. **As idades de algumas leituras: parei nesse ponto.** O item 6 do brief manda tirar da leitura a idade que a linha não fixa. Há linhas que não a fixam nos seus campos, e a idade da leitura apoia-se então num literal selado de uma origem (`algarismos_das_leituras`): a do desemprego de longa duração («aged 15-74»), a da diferença de emprego entre sexos («aged 20-64») e a do abandono escolar precoce («a person aged 18 to 24»). As perguntas do desemprego de longa duração e do abandono já escrevem as mesmas idades, pela mesma origem, no mesmo cartão. Tirá-las fazia a leitura dizer menos do que a pergunta ao lado dela, e menos do que a fonte diz. Não as tirei; o lugar de direção decide. Se decidir tirá-las, são os algarismos dessas leituras nas duas edições, com as linhas do inventário e a auditoria.
2. **A leitura a frio de outra família** correu a 26.09.2026 e esta passagem responde-lhe; o lugar de direção decide se a correção pede outra leitura antes de aterrar.
3. **A leitura do inventário** pelo lugar de direção: as entradas `l1` e `l1-correcao` de `REVISOES-DO-INVENTARIO.md` dizem «por ler».
4. **Uma leitura com ramos muda de frase quando o valor muda de lado** (I152), e a frase nova é uma cadeia que o inventário ainda não tem: o `check:voz` fecha a construção até ela entrar. A forma condicional do inventário que a I152 propõe não estava no mandato desta passagem e fica aberta; a concordância das câmaras resolveu-se com a frase nova do lugar de direção, e não com um ramo do singular.
5. **Os achados de 24.09.2026 sobre as descrições** (`achados_das_descricoes`) estão respondidos por esta passagem: a discordância dos dois valores de referência está declarada e a K9 exige-a, e a idade da taxa de atividade («From 15 to 64 years») está escrita na leitura. A pergunta da taxa de atividade continua sem a idade (é do B2), e a palavra «creche» continua sem literal que a nomeie.
6. **As páginas dos domínios e das áreas** rendem o mesmo cartão sem leitura: o brief manda a leitura na página do país e na dos temas, e só a `TemasDoPais.astro` passa a propriedade `leitura`.
7. **Os recibos** (os achados 17 e 18 da leitura a frio) são do bloco B3.

## Os commits

- `c1e155f0 L1, correção: os guiões das provas medem a passagem de correção, e o mapa do repositório diz a forma nova da K9`
- `839eda2f L1, correção: as palavras correntes dos termos que a leitura a frio achou por explicar, cada uma com o seu literal, a idade da taxa de atividade, e as duas leituras reescritas pelo lugar de direção`
- `28bcdd00 L1, correção: a discordância sobre os dois valores de referência declarada e datada ao pé de cada um, e a K9 a exigi-la`
- `6584df72 L1: a leitura a frio do Codex (gpt-5.6-sol, 598 189 símbolos, cinco plantas em cinco, 28 achados) com as plantas e o prompt, e duas leituras reescritas pelo lugar de direção (a disparidade salarial fecha a oração com o valor, para que «provisório» feche com ele; as câmaras concordam com «o número», seja qual for a contagem)`
- `5c63129d L1: o ensaio a seco das leituras entra no repositório (M31), com caminhos relativos, e corre a 0 sobre o ficheiro do lugar de direção e sobre o do sítio com os dezassete acertos`
- `aa1e4881 L1: as provas do bloco, medidas na cabeça d831b453`
- `02b56181 L1: a planta da declaração retirada, que prova que o resolvedor recusa carregar sem uma leitura obrigatória`
- `463b9067 L1: a sonda das origens que não se acharam, o porquê exato do A5 e os guiões das origens sem o caminho da máquina`
- `9519e56a L1: o mapa do repositório com o que o L1 acrescentou, e as linhas que tinham andado`
- `8043ef6c L1: o arame da classe tira as leituras dos cartões só depois de a K17 as conferir, e as plantas das formas novas`
- `64648c65 L1: as palavras fixas no inventário das frases, os acertos A16 e A17 que o portão da voz pediu e o guião que confere os dezassete acertos`
- `2780b589 L1: as origens das leituras seladas no motor, a auditoria folha a folha e a K17 do check:cartao`
- `37e73017 L1: o portão de HTML, a V2 e a K1 e K10 do cartão aceitam a leitura pela regra da régua`
- `c0dcc05f L1: a leitura por baixo do número nos 36 cartões nacionais, a 14 px e na tinta`
- `6b1297c3 L1: as leituras das medidas declaradas em src/data e o resolvedor que as achata`
- `074cc698 L1: o mapa do repositório com o que a peça 1 do B2 acrescentou`

No motor, `1d10b3f` (`motor_cabeca`). Os commits do sítio depois do brief até à cabeça medida são 16 (`commits_do_sitio_no_bloco`), com os dois do lugar de direção (o ensaio a seco e a leitura a frio) e os desta passagem; o commit que entrega estas provas vem a seguir e só acrescenta ficheiros desta pasta.

## O custo

A construção de 24.09.2026: 1 456 342 (`simbolos_do_construtor`) símbolos, declarados e não medidos por guião (`sessao.json` diz de onde vêm), e 10 766 (`tempo_de_parede_segundos`) segundos de parede, a medição desse dia relida. A passagem de correção de 26.09.2026: 739 571 (`simbolos_da_correcao`) símbolos, declarados da mesma maneira, e 4 367 (`tempo_de_parede_da_correcao_segundos`) segundos de parede, do primeiro registo da transcrição desta sessão ao fim do último portão. Modelo: Claude Opus 5.5, em tudo.
