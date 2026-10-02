# K2 · o cartão para o telemóvel: relatório do construtor

*Bloco K2, 02.10.2026, pelo brief `design/observatorio/BRIEF-K2-o-cartao-para-o-telemovel.md`, pela §1.143 e pela §1.144. Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `k2-2026-10-02`, sobre a cabeça de partida `1722244d`, sem subagentes. Cada número deste relatório está num ficheiro desta pasta, quase todos em `medidas.json`, escrito por `medir-k2.mjs`, com o comando e um conhecido-positivo em cada medida; as medidas do `dist/` são da construção da cabeça `3ee67971`, a última com código. Sem travessões.*

## O teste de aceitação, e onde se mede

O do §2 do brief, ponto por ponto:

| o que o teste pede | onde se mede | resultado |
|---|---|---|
| em cada cartão das páginas de assunto, da União e dos lugares, a 390 px, a ordem visível é o nome, o valor com a unidade, a comparação e só depois a definição, dobrada numa linha que se abre sem guião e diz «o que é este número» | a K19 nova do `check:cartao` (`tests/cartao/ordem.mjs`), que lê a ordem no documento de todas as páginas com cartões; o captor (`captar-k2.mjs`), que lê a ordem no ecrã | 0 queixas em 5 248 cartões de 656 páginas, 5 066 com a dobra e 42 da faixa da União; a mesma célula na construção de base dá 10 210 queixas; nas capturas a 390 px, 72 cartões em 72 com a ordem do brief, e 54 em 72 fora dela antes |
| o nome de um cartão cujo valor é uma variação diz-o, nas duas línguas | o detetor do §0 sobre `src/data/figuras.mjs`, e o mesmo teste sobre os cartões construídos das páginas de assunto | 0 nos quadros (4 antes); nas páginas de assunto, 6 por nomear (10 antes): parei nesse ponto, abaixo |
| a diferença de emprego entre sexos diz, no cartão, que é uma diferença entre duas taxas, em pontos percentuais, e a etiqueta do Eurostat fica no recibo | o cartão (a dobra) e o recibo da linha (o bloco da pergunta), nas duas edições; a unidade da linha | a frase em 4 sítios de 4; a unidade fica «% da população», como a fonte a escreve |
| a quota nas exportações e o PIB por habitante levam a explicação em palavras comuns | as folhas da leitura declarada, comparadas com a cabeça de partida (`acertos-k2.mjs`), e a K17 sobre a auditoria | 38 folhas mudadas, 0 fora da lista do mandato; a K17 a 0 com 18 plantas a morder |
| todos os valores seguem um só formato, conferido por uma célula com planta | a célula nova `check:formato` (`tests/inicio/formato-dos-numeros.mjs`), na construção e no `verify` | 0 desvios em 26 582 valores de 7 442 páginas, com 4 plantas a morder; na construção de base, 42 desvios dos milhares; o espaço antes de «%»: parei nesse ponto, abaixo |
| as 2 linhas com menos casas decimais corrigem-se pelo mecanismo, o contador sobe pelo mecanismo, e uma célula fecha a construção se voltar a acontecer | as linhas e a história selada (`ledger/historias-valores.json`); a célula das casas decimais no `ledger:check` | 2 linhas corrigidas, cada uma com uma entrada «correcao» selada; o contador em 7, pela «atualizacao»; a célula a 0 em 3 009 linhas, com 6 plantas em memória e 2 no portão inteiro, todas a morder |
| as frases das leituras dos estudos dizem o que são as designações, as localizações vencidas e a neutralidade atuarial, sem mudar os números | um detetor dos três termos nos campos que se rendem, na árvore e na cabeça de partida | 0 sem explicação em 18 ocorrências; 18 em 18 na cabeça de partida |
| os três portões a 0 | `portoes/`, a corrida final na cabeça do commit deste relatório | na secção dos portões, no commit seguinte |
| as capturas de uma página de assunto, da página da União, da ficha de Évora e do índice dos estudos, nas cinco larguras e nas duas edições | `capturas-depois.json` e `capturas-antes.json` | 40 capturas depois e 16 antes, 0 problemas, 0 pedidos para fora |
| o relatório com o `medidas.json` | esta pasta | completos |

## O mandato, ponto por ponto

| # | o que | como ficou | a medida |
|---|---|---|---|
| 1 | A anatomia do cartão | `CartaoDaMedida.astro`: o nome, o valor com a unidade, a metade da leitura que compara (à vista, onde a leitura estava), a régua, a faixa da União e a ressalva; no fim, um `<details>` fechado cujo resumo diz «O que é este número» («What this number is»), com a metade da leitura que diz o que o número é e a pergunta declarada. `CartaoDoLugar.astro` e `CartaoDasCamaras.astro` pela mesma classe. Na faixa da página da União, a ordem do documento passou a ser o nome, o valor, a unidade e o estado (era o estado, o valor, o nome e a unidade). A identidade não muda: os tipos, as cores e a marca da fonte são os do cartão | 0 queixas da K19; 72 em 72 cartões a 390 px |
| 2 | Os nomes que dizem a variação | `src/data/figuras.mjs`: «Taxa de atividade, variação em três anos», «Custo unitário do trabalho, variação em três anos», «Preços da habitação, variação anual», «Taxa de câmbio efetiva real, variação em três anos», e o inglês de cada um; o nome no veredicto acompanha («a variação em três anos do custo unitário do trabalho»), e uma forma sem vírgula para a frase da página da União (`nomeNaFrase`), porque o portão conta os itens da lista pelos separadores | 0 nos quadros |
| 3 | A diferença de emprego entre sexos | a leitura declarada diz «É a diferença, em pontos percentuais, entre a taxa de emprego dos homens dos 20 aos 64 anos e a das mulheres.», e a pergunta declarada (`DEFINICOES_DAS_MEDIDAS`) diz o mesmo, com duas origens: a descrição do Eurostat e uma origem nova recortada do relatório da Comissão Europeia sobre Portugal que o L1 já tinha selado no motor, conferida contra os bytes (`origens-k2.json`); a unidade fica como a fonte a escreve, e o portão de HTML continua a exigi-la no cartão | 4 sítios de 4 |
| 4 | Os termos por explicar | o PIB por habitante diz que é «descontada a subida dos preços, a que a unidade chama volumes encadeados»; a quota nas exportações diz que é «a parte que as exportações de bens e serviços de Portugal têm no total das exportações dos países da OCDE e dos países da União que não são da OCDE»; cada literal novo com a sua origem na auditoria da K17 | 38 folhas, 0 fora da lista |
| 5 | Um só formato de número | a célula `check:formato` (milhares com o separador que a letra desenha, vírgula decimal, sinal menos), nas duas cadeias; os 42 desvios da base eram contagens da prova escritas sem separador, e corrigiram-se na formatação (`src/lib/formato.mjs`, em `ValorDaProva.astro` e em `InstrumentoMecanismo.astro`), com o portão de HTML a escrevê-las pela sua cópia da regra | 0 desvios, 4 plantas |
| 6 | As casas decimais | os jovens que não trabalham nem estudam passam de «8» a «8,0» e o fluxo de crédito às empresas de «3» a «3,0», cada um com uma entrada «correcao» datada de 02.10.2026, selada por `scripts/selar-historia-valores.mjs`; o contador das correções publicadas passa de 5 a 7 por uma «atualizacao»; a célula nova (`scripts/casas-decimais.mjs`, no `ledger:check`) recusa uma linha sem derivação que escreva menos casas do que o mesmo número no excerto (D1) ou do que o literal do fim de um excerto composto (D2) | 2 linhas; a célula a 0 |
| 7 | As leituras dos estudos | `src/data/leituras.mjs`: «designações de pelouro repartidas por duas pessoas (um pelouro é uma área do trabalho da câmara que o presidente atribui por despacho a um membro do executivo)»; «localizações de projeto vencidas, isto é, na parte de cada projeto que o registo atribui ao concelho cuja data prevista de conclusão já passou sem conclusão registada»; «o valor atuarialmente neutro calculado pelo próprio relatório, o corte que pagaria exatamente o custo que a antecipação impõe ao sistema»; e o inglês de cada uma. Os números e as origens registadas não mudam; as frases que explicam estão citadas dos estudos num comentário do ficheiro («OS TERMOS EXPLICADOS») | 0 em 18 |
| 8 | O relatório | este ficheiro, `medidas.json` por `medir-k2.mjs`, as capturas em `design/especime-v3/capturas/k2-2026-10-02/`, e a resposta curta `RESPOSTA-construtor-k2.md` | completos |

## Os pontos onde parei, e porquê

**O espaço antes de «%» está escrito ao contrário nas decisões em vigor, e parei nele.** O brief pede «o espaço antes de "%" e do símbolo»; a §1.43 (a identidade v2, decisão 4) escreve «A percentagem escreve-se colada ao número.», a §1.44 (item 5) escreve «O sinal de percentagem cola-se ao número, nos dois sítios onde não colava», com `valorComUnidade()` em `src/lib/livro.mjs`, e a `IDENTIDADE.md` §11 escreve o mesmo. Um bloco não desfaz uma decisão escrita por causa de uma frase do brief (§1.144, a lição da N1). Construí a forma do brief primeiro e desfi-la no commit `0f1fce00`, quando li a §1.43 e a §1.44 ao conferir a lista das decisões em vigor; a forma com espaço está inteira no commit `2eab45e7`, para o caso de o lugar de direção a querer. O sítio está hoje dividido, medido pela célula sobre as duas construções: «%» colado a um valor em 701 sítios e separado em 1 845, e o «€» separado em 24 e colado em nenhum, iguais na base e no fim do bloco. As peças mais novas escrevem o espaço (as leituras dos cartões do L1 e os blocos da primeira página do PP1); as mais velhas colam-no (a leitura do lugar, as frases dos estudos no índice e nas fichas, os valores de referência da página da União). A célula conta as duas formas e escreve-as na sua linha, sem fechar a construção, até o lugar de direção decidir qual é a da casa e emendar as decisões que a escrevem.

**Seis cartões das páginas de assunto têm um valor de variação sob um nome de nível, e o §0 só contou quatro.** O detetor do §0 lê a medida dos quadros quando ela começa por «Variação»; a quota nas exportações escreve «Percentagem do total OCDE e UE não-OCDE, variação em três anos», e os cinco cartões de preços do RP1 têm a unidade «%» e a variação só no rótulo da fonte. Não lhes mudei o nome, porque o mandato os nomeia pelo §0 e os nomes dos preços pedem uma escolha de palavras que é do lugar de direção. O teste de aceitação fica por cumprir nestes seis (`medidas.json`, `cartoes_nacionais_com_variacao_sob_nome_de_nivel`, com o rótulo da fonte de cada um). A proposta, nas duas línguas, pela forma dos quatro:

| linha | página | nome hoje | o rótulo da fonte diz | proposta |
|---|---|---|---|---|
| `desempenho-das-exportacoes-2025` | estado e economia | Quota nas exportações | a unidade: «% do total OCDE e UE não-OCDE, variação em três anos» | «Quota nas exportações, variação em três anos» / «Share of exports, three-year change» |
| `ipc-alimentacao-variacao-homologa` | preços | Preços dos alimentos e das bebidas não alcoólicas | «Taxa de variação homóloga» | «… variação num ano» / «…, change over a year» |
| `ipc-energia-em-casa-variacao-homologa` | preços | Preços da energia em casa | «Taxa de variação homóloga» | «Preços da energia em casa, variação num ano» / «Home energy prices, change over a year» |
| `ipc-combustiveis-variacao-homologa` | preços | Preços dos combustíveis | «Taxa de variação homóloga» | «Preços dos combustíveis, variação num ano» / «Fuel prices, change over a year» |
| `ipc-rendas-variacao-homologa` | habitação | Preços das rendas | «Taxa de variação homóloga» | «Preços das rendas, variação num ano» / «Rent prices, change over a year» |
| `ipc-sem-habitacao-variacao-media-12-meses` | habitação | Preços sem a habitação | «Taxa de variação média dos últimos 12 meses» | «Preços sem a habitação, variação média em doze meses» / «Prices excluding housing, twelve-month average change» |

**«Milhares com espaço fino»: a página escreve o espaço inquebrável, por decisão escrita.** O livro-razão guarda o espaço fino (U+202F), e o `Claim.astro` rende-o em U+00A0 desde o C3 da §1.66, porque a letra da casa não desenha o U+202F. A célula exige o U+00A0, e as contagens da prova agrupadas saem com ele.

**«A célula de linguagem simples» que o item 4 cita não existe.** Nenhum ficheiro de `scripts/`, `tests/`, `src/` nem o `package.json` a nomeia (`medidas.json`, `ficheiros_de_codigo_que_nomeiam_uma_celula_de_linguagem_simples`: 0; o mesmo detetor acha a expressão no brief). Fiz os dois termos que o item nomeia e não procurei outros.

## As decisões do construtor, e porquê

- **A dobra fecha em todas as larguras.** O brief deixava a definição à vista a 768 px e acima, se coubesse, por decisão escrita no relatório; um `<details>` não abre por folha de estilo, e um cartão com duas formas conforme a largura era um cartão que o leitor aprendia duas vezes. Está escrito na folha (`src/styles/cartao-medida.css`).
- **O que é a definição.** A metade da leitura que diz o que o número é e a pergunta declarada. O corte é o primeiro pedaço de topo que compara (`compara`, `estado` ou `comparacao`, a qualquer profundidade, também dentro de um `sinal`), e é o mesmo nas duas edições, ou a construção fecha (`partesDaLeitura()` em `src/lib/leitura-da-medida.mjs`). Das 98 leituras declaradas (as 49 medidas nas duas línguas), 92 cortam-se em duas metades e 6 só dizem o que o número é e ficam inteiras na dobra (o ganho médio, a retribuição mínima e o cartão das câmaras); as duas metades juntas dão a leitura inteira nas 98. A metade que compara fica no lugar onde a leitura estava, antes da régua.
- **A faixa da União.** O nome, o valor, a unidade e só depois o estado e a posição, na ordem do documento e do ecrã; a definição de cada medida já estava dobrada na leitura breve por baixo da faixa. A primeira fila da grelha reserva três linhas de nome e o nome encosta-se ao fundo dela, logo por cima do valor: nas 10 capturas da página da União os valores ficam a uma só altura, e o topo do texto dos nomes muda de cartão para cartão.
- **A diferença de emprego.** A unidade da linha fica como a fonte a escreve, e o portão de HTML continua a exigir no cartão a unidade da própria linha; a frase da casa, que diz o que o número é, vai na dobra e no recibo.
- **A folga da dobra.** A H2 do `check:alvos` recusou, numa corrida intermédia, a linha da dobra na faixa dos 641 aos 1 023 px: a área de toque do selo do valor, por cima, entrava no alvo da dobra nos cartões em que a dobra vem logo depois do valor. A margem de cima passou de 2 para 10 px. Medido por `alvos-da-dobra.mjs` sobre a construção final: 0 linhas da dobra em 160 com um ponto do quadrado de toque noutro elemento; com a margem antiga posta por uma folha, 1 em 160, num selo. A H2 passa (`alvos.log`).
- **A primeira página mudou em texto, e não em blocos nem em cartões.** O brief (§4) não deixa mexer na ordem dos blocos da primeira página nem nos cartões que vivem nela; o nome novo dos preços da habitação aparece na lista dos números de um bloco, o nome no veredicto acompanha (o item 2 di-lo), e as sinopses de dois estudos ganham a explicação dos termos (o item 7). São 12 linhas de texto, 6 por edição, todas em `medidas.json` (`linhas_de_texto_da_primeira_pagina_que_mudaram`, com o que entrou e o que saiu).
- **A ressalva da União fica à vista.** Nas páginas de assunto, a ressalva da Comissão no cartão da sobrecarga do custo da habitação continua fora da dobra (`ressalvas_da_uniao_dentro_da_dobra`: 0, com 2 fora), como a §1.124 e a §1.140 pedem; a K14 do `check:cartao` exige-a nos cartões e nos recibos.

## Os portões que mudaram de forma, e a planta que prova que ainda mordem

| portão ou célula | o que mudou | classe | a planta |
|---|---|---|---|
| `gate:html`, as contagens da prova | o portão escreve as contagens de quatro algarismos ou mais pela sua cópia da regra dos milhares e compara carácter a carácter, como comparava | **P** | G1 (uma contagem sem o separador) e G2 (uma contagem agrupada com outro valor) mordem, com os bytes repostos (`plantas-portao-k2.json`) |
| `gate:html`, a metade da leitura na dobra | a metade que diz o que o número é leva o invólucro `data-selo-em` do cartão, como a leitura inteira levava | **P** | G3 (a metade sem o invólucro, com o valor da linha do saldo lá dentro) morde |
| K17 do `check:cartao` | a leitura de um cartão em uma ou duas metades, cada uma recomposta e cortada pela conta da célula; uma metade fora do sítio, uma comparação dentro da dobra, um corte noutro pedaço e uma metade repetida recusam-se | **P** | 18 plantas em 18 (quatro novas para as metades) |
| K19 do `check:cartao`, nova | a ordem do cartão e da faixa da União, no documento | **M** | 7 plantas em 7 |
| K1 do `check:cartao` | as peças do cartão leem-se também dentro da dobra | **M** | as plantas da prova do `check:cartao`, todas vistas (`cartao-json.log`, a primeira linha) |
| `check:formato`, nova | F1, F2 e F3 exigidas; o símbolo depois do valor contado | **P** (F2) · **M** (F1, F3) | 4 plantas em 4 (`formato.json`) |
| `ledger:check`, a célula das casas decimais, nova | D1 e D2 | **P** | 6 plantas em memória e 2 no portão inteiro, sobre uma cópia estragada do livro, com as linhas reais intactas (`plantas-casas-decimais.json`) |
| `check:voz` (`scripts/medir-defeitos.mjs`) | as duas metades da leitura de um cartão das páginas de assunto não entram no inventário, como a leitura inteira não entrava; a K17 confere-as nas mesmas páginas e na mesma corrida; a pergunta e a linha da dobra contam-se | **M** | a K17 e as suas plantas |
| `check:pais` (`tests/inicio/linhas-da-casa.mjs`) | a planta «lugar retirado do registo inglês» escolhe a entrada da correção do E0 pelo índice, e não a primeira do contador, que passou a ser a do K2 | **P**, só a planta | as plantas da célula mordem (`linhas-da-casa.log`) |
| `tests/cartao/rp1.mjs` e `tests/confianca/c1.mjs` | as páginas sintéticas rendem a leitura em duas metades | **M** | as suas plantas mordem |

## As decisões em vigor nos ficheiros tocados

`decisoes-em-vigor-intervalo.txt` (o guião `scripts/leituras/decisoes-em-vigor.py --intervalo` sobre o intervalo do bloco): 51 decisões citadas nos ficheiros tocados. As que o brief nomeia, e as que o bloco tocou:

- **§1.127**: a precisão é a da fonte (decisão 3), e as duas correções repõem a casa decimal que o excerto já tinha, sem arredondar nada; a habitação abre pelos inquilinos a preço de mercado (decisão 5), e a T10 continua no `check:pais` e em `tests/inicio/entradas.mjs`, sem mudança: o bloco mexeu na ordem dentro do cartão, e não na ordem dos cartões.
- **§1.124 e §1.140**: a média da União no cartão da sobrecarga, sempre com a ressalva da Comissão; a ressalva ficou fora da dobra, e a K14 passa.
- **§1.130**: a leitura é uma declaração com ramos que a máquina escolhe, sem «melhor» nem «pior»; o bloco cortou-a por posição e não lhe mudou um ramo, e a K17 reconta os ramos (208).
- **§1.43, §1.44 e §1.66**: a percentagem colada e o separador dos milhares rendido em U+00A0; os dois pontos de paragem acima.
- **§1.108**: os números não saltam de cartão para cartão na faixa; os valores ficam a uma só altura nas capturas da União.
- **§1.86**: a identidade não muda; nenhum tipo, cor ou marca novos.
- **§1.143 e §1.144**: a primeira página só mudou em texto, pelas razões acima; e a lição da N1, que fez parar o bloco no «%».

## As capturas

Em `design/especime-v3/capturas/k2-2026-10-02/`: `depois-<página>-<edição>-<largura>.png` para o emprego, a União, a ficha de Évora e o índice dos estudos, nas duas edições e nas cinco larguras, de uma construção da cabeça `3ee67971` (40, `capturas-depois.json`); `antes-*.png` da cabeça de partida, a 390 e a 1 280 px (16, `capturas-antes.json`). O servidor é efémero e os pedidos para fora recusam-se (0 nas duas fases). O manifesto guarda, para cada cartão, as peças pela ordem do documento e do ecrã, se a definição está dobrada e o texto do resumo da dobra.

## Os commits

Sobre `1722244d`, no ramo `k2-2026-10-02`:

- `a9a3fc1d` as duas linhas com menos casas decimais corrigidas pelo mecanismo, o contador recontado, e a célula que fecha a construção;
- `fc0d6c62` os quatro nomes que dizem a variação, a diferença de emprego em pontos percentuais, e os termos da quota nas exportações e do PIB por habitante;
- `7a6bba55` as leituras dos estudos com as designações de pelouro, as localizações de projeto vencidas e o valor atuarialmente neutro;
- `3dbbd30b` o cartão para o telemóvel, e a K19;
- `2eab45e7` um só formato de número, com a célula `check:formato` (o espaço antes de «%» que este commit trazia saiu no `0f1fce00`);
- `3da4d382` o inventário das frases;
- `1c6a793d` a folga entre o selo do valor e a dobra, e o nome da faixa da União encostado ao valor;
- `78828e5c` os guiões das capturas, das plantas, do alvo da dobra e das medidas, e as capturas de antes;
- `0f1fce00` o «%» como as decisões escritas o deixam, e a célula do formato a contar as duas formas;
- `3ee67971` a primeira fila da faixa da União com a reserva do nome, e a secção do K2 no mapa do repositório, com as referências de linha que o bloco empurrou (o `conferir-mapa.py` não acha nenhuma citação longe da linha citada nem por achar, `conferir-mapa.txt`);
- o commit deste relatório, com as medidas, as capturas de depois e a resposta curta; e o seguinte, com os códigos da corrida final dos portões.

## Os portões

A corrida final corre por `sh scripts/leituras/portoes.sh` na cabeça do commit deste relatório, com a tranca da máquina; os códigos entram no commit seguinte, em `portoes/`, com a cabeça ao lado, e a secção acaba-se aí. Antes dela correram, pela mesma tranca, as construções inteiras de cada cabeça com código e as conferências que cada mudança tocava; na construção da cabeça `3ee67971`, o `ledger:check`, o `check:cartao`, o `check:formato` e o `check:alvos` saíram a 0 (`ledger-check.codigo`, `cartao.codigo`, `formato.codigo`, `alvos.codigo`).

## O custo

Duas leituras do contador de símbolos restantes que a ferramenta mostra ao agente, em `custo-inicio.json` e `custo-fim.json`: 1 339 297 símbolos e 29 221 segundos até à escrita deste relatório (`medidas.json`, `simbolos_gastos_ate_ao_relatorio`). A sessão foi resumida uma vez a meio, quando o contexto se esgotou, e continuou com o mesmo contador. O modelo foi o Claude Opus 5.5 em todo o bloco, sem subagentes.

## O que fica por fazer

- O lugar de direção decide a forma do «%» e emenda a §1.43, a §1.44 e a `IDENTIDADE.md` §11, ou aplica a forma com espaço do `2eab45e7`; a célula passa a exigir a forma escolhida, com a sua planta.
- Os nomes dos seis cartões com variação sob nome de nível, pela tabela acima.
- A linha do K2 em `critica/REVISOES-DO-INVENTARIO.md` está «por ler pelo lugar de direção antes de aterrar».
- A leitura a frio de outra família, com as cinco plantas.
