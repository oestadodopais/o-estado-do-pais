# A leitura a frio da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de f362f5ccd..f1b98c701, com cinco plantas só nas cópias, os 21 corpos alojados das linhas de suporte (sha256 conferidos) e o `dist/` da cabeça. 41 chamadas.*

## As plantas: cinco em cinco

| planta | o estrago | achado |
|---|---|---|
| G1 | o detetor perde «de acordo com» | 5 |
| G2 | a lista das por registar pode crescer | 1 |
| G3 | a citação só se confere a partir de 40 carateres | 4 |
| G4 | um corpo não alojado passa | 2 |
| G5 | a citação de Paulo Raimundo alterada | 3 |

## A decisão do lugar de direção sobre os achados reais

- **6 (Major), as plantas não prendem cada marca:** real. Uma planta real por marca e por língua, e as listas de marcas presas por sha256; uma mudança das marcas exige o pino novo e a razão escrita (adenda C, 1).
- **7 (Major), as marcas portuguesas:** real. A antecipação `(?![\p{L}])` mata `por causa d`, `resulta d` e `resultado d` (o mesmo erro no guião da AUD1). Faltam `diz`, `refere`, `indica`, `conclui`, `estima` e `alerta`. E os pares só se medem num sentido (adenda C, 2).
- **8 (Major), o âmbito:** real. As páginas dos concelhos, dos distritos, das regiões, das áreas e da União Europeia entram, com a chave por coleção para as frases iguais repetidas (adenda C, 3).
- **9 (Major), o corte depois de `.»`:** real. Cinco entradas dizem mais do que os excertos. O detetor corta depois de `.»`, `!»` e `?»` seguidos de maiúscula, sem mudar o corte da régua da voz; a semente regenera-se (adenda C, 4).
- **10 (Major), a entrada de uma frase nova ou reescrita:** real. O README diz o caminho; cada entrada leva a origem; uma entrada sem citação que a prenda à linha fica `por julgar` até o juiz da CAM2-B (adenda C, 5).
- **11, 12, 13 (Minor):** baratos; na adenda C.
- **14 (Minor), a citação do PS é a narração da página do partido:** fica para a AUD1, com a frase da página.
- **15 (Minor), o PDF preliminar da UTAO sem a pasta `direitos/`:** fica para a higiene do motor.
- **16 (Minor):** sem ação; a comparação é da passagem e está no JSON.

## A medida que fica

As contagens do relatório reproduzem-se. As 22 entradas têm as citações palavra por palavra nos excertos, e os 21 excertos estão nos corpos. A assimetria pt/en de alguns estudos é real: os documentos existem numa língua só.

# A leitura curta da adenda C da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de f1b98c701..155fd74a5, com cinco plantas só nas cópias. 30 chamadas.*

| planta | o estrago | achado |
|---|---|---|
| K1 | uma entrada presa pode levar qualquer juízo | 1 |
| K2 | o corte depois de `.»` desfeito | 4 |
| K3 | os concelhos contados por página | 2 |
| K4 | uma entrada de mandato vale com um só campo igual | 3 |
| K5 | o relatório dá 1053 pendentes portuguesas (são 1033) | 5 |

A decisão sobre os reais (todos Minor), pela adenda D:
- **8:** uma entrada da semente diz «O número do ministro coincide com…», e a sua única linha é a da UTAO, que não fala do ministro. A citação presa prova as palavras citadas e não o resto da frase. Todas as entradas ficam `por julgar` até ao juiz da CAM2-B. A frase do sítio não é dada como falsa: o livro-razão tem a linha do relatório do Orçamento com os mesmos 3,0 %. A AUD1 completa as linhas da entrada.
- **10:** 260 frases portuguesas cujo par inglês é detetado não estão nem no registo nem na lista. Passam a entrar na cobertura pelo par, nos dois sentidos.
- **6, 7 e 9:** na adenda D, por serem baratos (a prova do histórico do pino; os negativos de «diz respeito», «se refere a», «estado de alerta» e o nome «Sistema Nacional de Alerta»; as medidas dos números do relatório).

# A leitura curta da adenda D da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de 155fd74a5..3d4227d16 (a implementação em c64f32c27), com cinco plantas só nas cópias e os 21 corpos alojados das linhas de suporte (sha256 conferidos). Registada mais tarde no mesmo dia, a partir do relatório do leitor, porque a secção ficou por escrever quando a leitura acabou.*

| planta | o estrago | achado |
|---|---|---|
| M1 | uma entrada sem o campo do juízo passa | 2 |
| M2 | a cobertura pelo par só do português para o inglês | 3 |
| M3 | o contador dos pares sem cobertura nunca sobe | 4 |
| M4 | o teto das por registar só morde no dobro | 5 |
| M5 | o relatório dá 2453 pendentes (são 2435) | 1 |

A decisão sobre os reais (todos Minor), para o bloco de higiene da semana:
- **6:** o contador `sem_cobertura` mede o inventário contra si próprio; a cobertura real confere-a `conferirCobertura` (o leitor reproduziu-a: nenhum destino de par fora do registo e da lista).
- **7:** quatro plantas sintéticas regeneradas levam o texto da expressão colado na frase; ainda mordem, mas não exercitam os novos «lookbehinds».
- **8:** os «lookbehinds» de «alerta» e «refere» deixam passar casos e cortam de mais («Este alerta para o risco…», «O ministro, que se refere ao relatório, recusou.»); no `dist/` de hoje só mudou a frase da RMMG no Método, nas duas edições.

# A leitura curta da adenda E da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de d21c48f0b..d9a6489a9, com cinco plantas só nas cópias. 12 chamadas.*

| planta | o estrago | achado |
|---|---|---|
| P1 | a máscara engole a palavra a seguir ao número | 1 |
| P2 | a chave da cobertura volta ao texto inteiro | 2 |
| P3 | a presença do par inglês sem máscara | 4 |
| P4 | o inventário guarda o sha256 sem normalizar | 3 |
| P5 | o relatório dá 2343 pendentes (são 2433) | 5 |

A decisão, pela adenda F:
- **6 (Major):** com a presença mascarada, uma página pode imprimir dentro de uma citação um número diferente do registo e do excerto (9,0 contra 8,0), e a régua passa. As citações de uma frase registada passam a conferir-se sem máscara contra a frase impressa.
- **7 (Major):** o painel da semana seguinte só passa se a fonte rever os mesmos indicadores; uma linha de revisão de outro indicador é uma frase nova e prende o painel. As frases geradas de um modelo de texto a partir do livro-razão (a linha das revisões e a linha do painel no Método) saem da cobertura por uma lista fechada e presa de modelos.
- **8 (Minor):** uma planta de uma palavra a seguir a um número, na adenda F.
- **9 e 10 (Minor):** a máscara esconde também os algarismos de nomes e identificadores («Portugal 2030», «Lei n.º 23/2023», «COVID-19», «1.º»), e uma data por extenso deixa o nome do mês na chave. Vão para o bloco de higiene da semana, com a nota no README.
- **11:** sem ação.

# A leitura curta da adenda F da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de d9a6489a9..cd60473fd (o `dist/` de c745e7345), com cinco plantas só nas cópias. 20 chamadas de 22.*

| planta | o estrago | achado |
|---|---|---|
| P1 | as citações da frase impressa comparadas com a chave mascarada | 2 |
| P2 | a expressão de um modelo sem `$` no fim | 5 |
| P3 | o valor de um modelo aceita texto até ao ponto e vírgula | 4 |
| P4 | a conferência dos modelos compara só os identificadores | 3 |
| P5 | o relatório dá 2437 pendentes (são 2427) | 6 |

A decisão sobre os reais, pela adenda G:
- **1 (Major):** o catálogo de `{indicador}` e `{unidade}` vinha de todas as linhas do livro-razão (1 091 nomes em português, 1 094 em inglês), com as linhas de afirmações e os nomes «segundo …, pela imprensa»; uma linha escrita na forma do modelo com um desses nomes casava e saía da cobertura, embora o detetor a tipasse como atribuição. O catálogo passa a vir só das linhas no âmbito da leitura da semana com pelo menos uma releitura e sem afirmações (128 nomes em cada língua, nenhum tipado pelo detetor), e um nome tipado recusa a conferência.
- **7 (Minor, de uma frase deste lugar):** a base do histórico movida de d21c48f0b para d9a6489a9 e a semente presa à lista nova, por «os pinos novos» da adenda F, quando a lista só encolheu; a primeira lista depois da base certificava-se a si própria. Volta à base e à semente antigas na adenda G, por ser barato e repor uma conferência que esta frase enfraqueceu.
- **8 (Minor, anterior a este bloco):** os números de uma citação inglesa só se prendem à página inglesa, fora do pino da semente; hoje as 22 entradas têm as mesmas sequências de algarismos nas duas línguas. Vai para o bloco de higiene da semana (a conferência das sequências de algarismos entre as citações das duas línguas de cada entrada).
- O que está bem, segundo o leitor: as citações sem máscara recusam um algarismo mudado na página e no registo, nas duas línguas; as expressões presas `^…$` recusam uma oração acrescentada, um «segundo o INE» depois do valor e um prefixo escrito à mão; um modelo velho recusa-se; a simulação do painel seguinte deu 0 recusas; a semente e a lista regeneradas são iguais byte a byte às do commit; nenhuma página, nenhuma outra régua nem o Método mudaram.

# A leitura curta da adenda G da CAM2-A (09.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de cd60473fd..bd58d7f8b (o `dist/` de cfddc98b9), com cinco plantas só nas cópias. 18 chamadas de 20.*

| planta | o estrago | achado |
|---|---|---|
| G1 | o catálogo volta a aceitar linhas sem releitura | 3 |
| G2 | a recusa de uma alternativa tipada só olha as unidades | 1 |
| G3 | a simulação deixa de provar que cada revisão impressa casa | 4 |
| G4 | a base do histórico fica em d9a6489a9 | 2 |
| G5 | o relatório dá 2623 linhas no catálogo (são 2632) | 5 |

Nenhum achado real Blocking nem Major. A decisão sobre os reais:
- **6 (Minor):** os códigos do fecho e as contagens do motor vêm declarados nas medidas do construtor, sem registo no pacote. A aterragem corre-os todos de novo (a corrida do GitHub, `check:series`, `ledger:check` com o motor, `check:frases-afirmacao`, o cruzamento, `verify:com-motor`).
- **7 (Minor, anterior a este bloco):** sete nomes ingleses do catálogo são títulos de quadros do INE em português (`nomeNaSemana` dá o nome da fonte nas duas línguas); a linha de revisão inglesa imprimi-los-ia se uma dessas linhas fosse revista. Hoje nenhuma página o imprime nessa linha; nos recibos ingleses o título aparece como «The name at the source», com `lang="pt-PT"`, como a fonte o escreve. Vai para o bloco de higiene da semana (o nome inglês da linha de revisão).
- O que está bem, segundo o leitor: o catálogo é exatamente o das 2 632 linhas relidas no âmbito e sem afirmações (128 nomes, 28 unidades e 21 períodos em cada língua; nenhum tipado); as 5 264 linhas de revisão construídas para essas linhas casam todas com o modelo; as duas linhas da leitura da F pedem registo; a recusa de uma alternativa tipada morde nos três campos e nas duas línguas; a base e a semente voltaram, e as duas mordem; o painel seguinte com outros indicadores e valores negativos deu 0 recusas; nada mais mudou.
