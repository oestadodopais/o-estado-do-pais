# UE1 · onde Portugal fica entre os 27 · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 29.09.2026. O relatório tem 4 partes. A do UE1, até «O que ficou por fazer»: o build, o verify e o typecheck correram na cabeça do código `33ed14a0`, e o commit das provas dela é `0f75298f`. A da passagem de correção UE1b: os portões correram na cabeça do código `c9859d31`, e o commit das provas dela é `a4f59f21`. A da passagem UE1c, depois da leitura a frio do Codex: os portões correram na cabeça do código `982d6446`, e o commit das provas dela é `42a368a3`. A da passagem UE1d, no fim, com a decisão da §1.140: os portões correram na cabeça do código `99b9f73a`, e o último commit do ramo é o das provas dela, que só acrescenta e muda ficheiros nesta pasta e na das capturas. O sítio: o ramo `ue1-2026-09-29`. O motor: o ramo `ue1-2026-09-29` do ResearchHub, cabeça `e394307`, que as passagens UE1b, UE1c e UE1d não mudaram. Cada número deste relatório está num JSON desta pasta (`medidas.json`, escrito por `medir-ue1.mjs`, `medidas-ue1b.json`, escrito por `medir-ue1b.mjs`, `medidas-ue1c.json`, escrito por `medir-ue1c.mjs`, e `medidas-ue1d.json`, escrito por `medir-ue1d.mjs`, que leem os manifestos ao lado, cada medida com o comando e um conhecido-positivo), e o relatório passa o `conferir-relatorio.py`.*

## O que o leitor vê

No cartão de cada uma das 10 medidas que os blocos da primeira página comparam com a União (a desigualdade, a dívida pública, a inflação harmonizada, os preços da habitação, a sobrecarga do custo da habitação, a pobreza ou exclusão, o desemprego, o desemprego de longa duração, a taxa de emprego e a sobrecarga dos inquilinos a preço de mercado), na página dos temas e nas páginas das entradas, em português e em inglês, há por baixo do número e da régua uma faixa: uma linha do valor mais baixo ao mais alto dos 27 países, uma marca por país, a de Portugal maior e a tinta, a da média da União como um traço, sem cor; o país mais baixo e o mais alto com o nome e o valor, e a marca da fonte quando o ponto a leva («Hungria 18,3 p» nos preços da habitação); a frase do lugar de Portugal; e a porta «Todos os países» para o recibo da série, com os pontos numa tabela. Na pobreza a frase diz: «Portugal (18,6) está em 15.º lugar, do mais alto para o mais baixo, a par de outros países com o mesmo valor (Áustria e Suécia).» As capturas estão em `design/especime-v3/capturas/ue1-2026-09-29/`.

## O teste de aceitação do §2, parte a parte

- **A faixa no cartão de cada uma das 10 medidas, nas duas edições e nas cinco larguras.** O `dist/` tem 40 faixas (20 nas páginas dos temas, 20 nas das entradas, 0 na primeira página), e a F19 e a K18 conferem as 40. `faixas-ue1.mjs` mediu cada faixa nas 10 páginas que as levam e nas 5 larguras (o guião lê 12 páginas, e as 2 da escola e da saúde não têm faixa: a frase dizia 12 páginas com faixa, e a passagem UE1c corrigiu-a, pelo achado 11 da leitura a frio), de 390 a 1 600: 200 medições, as 10 medidas em cada edição, 0 problemas (nenhum rótulo sobre outro, nenhum fora do cartão, nenhum cartão nem página a transbordar, 28 marcas em cada faixa), com o detetor a ver as suas 6 plantas antes de medir.
- **Os 27 países no mesmo período, o mais baixo e o mais alto com o nome e o valor, a média da União e Portugal marcado, com a frase do lugar.** A F19 refaz as 1 120 marcas a partir do valor e recompõe as 40 frases (4 com empate) a partir da série e das palavras declaradas, sem perguntar nada ao resolvedor da página.
- **Cada algarismo resolve num ponto de uma linha de série gerada pelo motor, com o seu recibo.** O portão de HTML compara 800 pontos, 788 nomes de país, 200 campos e 80 recontagens com as séries; há 20 recibos de série construídos.
- **O ponto da União e o de Portugal são, como números, as linhas que o cartão já mostra.** A regra S6 do `ledger:check`, com uma planta para cada um dos dois pontos.
- **Um ponto com marca da fonte mostra-a.** Há 20 pontos com marca; nas pontas da faixa há 2 (abaixo).
- **Os portões falham nos casos que o brief nomeia, cada um com uma planta que morde.** As plantas do bloco, abaixo: o algarismo sem origem, o país em falta, a posição trocada e os pontos da União e de Portugal a divergir estão todos lá.

## O mandato, ponto a ponto

| ponto | o que | o que se fez | a medida |
|---|---|---|---|
| ponto 1 | A linha de série, gerada pelo motor | 37 pedidos pelo cliente da casa (27 documentos RDF da tabela de autoridade dos países e 10 ao Eurostat), alojados em `content/13 Dominios/source/ue1/` com o resumo no manifesto; `publisher/series_paises.py` lê cada ponto pelas coordenadas seladas da linha da União (`coordenadas_seladas`, a função do painel), com o valor como a resposta o escreve e o excerto da linha da União com a geografia do ponto; `publisher/export_series.py` confere tudo outra vez contra os corpos e contra o sítio (VS1 a VS7) e escreve as séries em `ledger/series/` e o registo `ledger/cruzamentos/series.json` | 10 séries de 28 pontos (280 pontos, 20 com marca da fonte); a suíte do motor faz 27 conferências e as suas 12 plantas mordem, entre elas um ponto trocado numa cópia da série; a travessia, escrita outra vez, muda 0 ficheiros no sítio; o `check:cruzamento --with-origin` confere as 10 séries contra o motor; o `core.gate` a 0 |
| ponto 2 | O livro-razão lê as séries | `src/lib/series.mjs` e as regras S1 a S8 de `ledger/series/README.md` no `ledger:check`, como função pura; o `check:cruzamento` confere o registo das séries e recusa uma série que nenhum registo nomeia | 10 séries conferidas; 11 plantas no `ledger:check`, uma ou mais por regra, cada uma com a sua queixa; 4 plantas no `check:cruzamento` |
| ponto 3 | O recibo da série | a rota `serie` (`/livro-razao/series/<id>` e `/en/ledger/series/<id>`), com o caminho no cabeçalho; a tabela dos pontos, a fonte e a proveniência; os nomes da tabela de autoridade do Serviço das Publicações, com a fonte e o dia da leitura | 20 recibos; 28 pontos no recibo português da dívida, contados no `dist/`; 27 países na tabela dos nomes, lidos a 29.09.2026 |
| ponto 4 | A faixa nos cartões | `FaixaDaUniao.astro` nos cartões nacionais com série; o resolvedor `src/lib/faixa-da-uniao.mjs`; a célula `tests/cartao/faixa.mjs`, chamada pela F19 do `check:formas` (na construção, a cadeia que a Vercel corre) e pela K18 do `check:cartao` (no `verify`) | 40 faixas; a F19 com 12 plantas e a K18 com 12; 200 medições nas 5 larguras, 0 problemas |
| ponto 5 | As palavras, do lugar de direção | declaradas em `src/data/faixa-da-uniao.mjs`, com os acertos F0 a F2 e a regra F3 (abaixo), provados por `acertos-ue1.py` contra o texto do brief; o inventário das frases ganha as linhas que se rendem | 8 trocas de cadeia em 3 grupos; 6 formas da frase iguais em 6 (3 ramos em 2 línguas); 6 linhas novas no inventário, vivas e rendidas |
| ponto 6 | As capturas e o relatório | `captar-ue1.mjs` sobre o `dist/` desta cabeça, com todo o pedido para fora recusado; `faixas-ue1.mjs` para as faixas que as capturas não mostram; este relatório; `medidas.json` por `medir-ue1.mjs` | 40 capturas: 20 dos cartões da pobreza (o do empate) e dos preços da habitação (o da marca numa ponta), 20 dos recibos das séries dos preços da habitação e da inflação, em português e em inglês, nas 5 larguras; 0 problemas medidos, 0 pedidos para fora |

## O que medi e o brief não dizia

1. **O lugar de Portugal na pobreza ou exclusão.** O §1 do brief e a testemunha dizem 16.º. Pela regra do §3, ponto 5 («1 mais o número de países com valor maior»), é 15.º: há 14 países com valor maior que 18,6, e 2 com o mesmo valor que Portugal (a Áustria e a Suécia). A página diz 15.º, a par dos 2. Nas outras 9 medidas o lugar é o do brief. Segui a regra, que é a do mandato; a tabela do §1 desempatou de outra maneira, que não sei qual foi.
2. **As palavras da frase.** Os acertos estão em `acertos-ue1.json` (8 trocas de cadeia em 3 grupos) e no cabeçalho da declaração, cada um com a razão escrita. F0: o «27» das palavras fixas passa a ser a contagem recontada dos pontos, porque um algarismo sem origem fecha o portão de HTML. F1: «o valor mais baixo é o de {país} ({valor})» passa a «o valor mais baixo é {valor} ({país})», e o mesmo na edição inglesa: em português de Portugal quase todos os nomes dos 27 pedem o artigo («o da Grécia», «o dos Países Baixos», mas «o de Malta»), a tabela de autoridade não o dá, e escrevê-lo à mão era escrever à mão o que os nomes não trazem; em inglês, «Netherlands's» não se escreve. F2: o empate («a par de {país}») vai para o fim da frase do lugar, como «, a par de outro país com o mesmo valor ({país})» ou «, a par de outros países com o mesmo valor ({países})», porque na pobreza os países a par são 2. F3, que não troca palavra nenhuma do brief: um extremo repetido nomearia os países todos, na mesma lista; hoje nenhuma série o tem. Nenhuma das razões é uma recusa da auditoria das frases, e as palavras que ficaram passam-na (o `check:voz` da construção, com as 6 linhas novas vivas e rendidas). Se o lugar de direção preferir outra forma, troca-se num ficheiro só.
3. **A marca da fonte na frase.** Um ponto com marca mostra-a na ponta da faixa e no recibo; a frase leva os valores sem ela, para não mudar as palavras do brief. Hoje há 2 pontas com marca: a Hungria, a mais alta nos preços da habitação (18,3, marca «p»), e a Espanha, a mais alta no desemprego (10,5, marca «d»).
4. **Os pedidos saíram sem o intervalo da casa.** O `pedir.py` do bloco criava um cliente por pedido, como o do RP1, e o intervalo por anfitrião vive dentro de cada cliente: os 37 pedidos saíram em 5 segundos, 27 ao Serviço das Publicações e 10 ao Eurostat, sem a espera por anfitrião que o cliente dá (`min_interval_s=2`). Os corpos e os resumos não mudam com isto. O guião passou a usar um cliente só (commit `e394307`), e com ele a segunda chamada seguida ao regulador do mesmo anfitrião espera 2,0 segundos; os pedidos não se repetiram.
5. **A nota do lugar de direção sobre os tipos** (`tipos-ue1.mjs`, `tipos-ue1.json`). O programa do `npm run typecheck` tem 84 ficheiros do sítio, e `src/lib/series.mjs` é um deles, com o `src/tipos.d.ts` onde `Serie` e `PontoDaSerie` se declaram neste ramo. A corrida limpa dá 0; um nome de tipo que não existe, plantado na linha 70 (a de `@returns {x is Serie}`, onde o editor começava a apontar), fecha-a com o código 1 e a queixa TS2304 nessa linha. O portão lê essas anotações e resolve-as, e não havia nada a corrigir nesse ficheiro. `tests/cartao/faixa.mjs` e `scripts/series-do-portao.mjs` ficam fora do programa: a mesma anotação, acrescentada a cada um, deixa o typecheck a 0 nas 2 plantas. O `include` do `tsconfig.check.json` acaba em `src/lib`, `src/data`, `src/i18n`, no `src/tipos.d.ts` e nas configurações, e deixa `scripts/` de fora com a razão escrita no próprio ficheiro; `tests/` não está lá, sem razão escrita. O `check:mortos` também não lê `tests/` (lê `src/**` e `scripts/**`), e por isso nenhum portão apanhava a importação por ler, que saiu no commit `b6991e78`. Que programa o editor lê não sei: o `tsconfig.json` tem `checkJs` a false e `src/lib/series.mjs` não leva `// @ts-check`, de modo que esse programa não se devia queixar de tipos neste ficheiro; os avisos vêm de uma configuração que não vejo (inferido, não conferido).
6. **As capturas não tinham conhecido-positivo.** O captor media sobreposições e rótulos fora do cartão sem provar que o detetor via algum. `faixas-ue1.mjs` usa as mesmas contas e prova-as com 6 plantas no navegador, 3 em cada edição. A primeira corrida deixou a planta do rótulo por ver: no contexto do captor, com o movimento reduzido, a folha da casa dá a tudo uma transição mínima (`transition-duration: 0.01ms`), e uma leitura logo a seguir a uma troca de posição ainda vê a posição antiga. A planta desliga a transição no elemento plantado; as medições a sério não mudam estilo nenhum.
7. **O que o prompt situava noutro sítio.** O `IDENTIDADE.md` está na raiz do sítio e não em `design/especime-v3/`; o motor não tem `CLAUDE.md`; e a worktree nova do motor não tinha as caches `snippets.json` que o `export_site_rows_test` lê, e copiei-as da árvore principal do motor, como manda a decisão de 01.09 (§1.92(7), escrita no `.gitignore`), sem as versionar.

## A testemunha do lugar de direção

Os 280 pontos gerados são, como números, os 280 da leitura do lugar de direção (`BRIEF-UE1-eurostat-2026-09-29.json`), com 0 diferentes; as 280 marcas da fonte são as mesmas; e a ordem dos países que a tabela de autoridade dá (a protocolar) é a da testemunha.

## As plantas

As do bloco, sobre o `dist/` desta cabeça e sobre os ficheiros do livro, cada uma com um portão sozinho, o código diferente de zero com a queixa esperada, e os bytes repostos pelo sha256 (`plantas-ue1.json`, as saídas em `plantas/`): 15 plantas, 15 mordidas, 15 repostas com o mesmo resumo, e os 5 portões corridos limpos a seguir, todos a 0.

| grupo | a planta | o portão que morde |
|---|---|---|
| faixa | um algarismo da faixa sem origem (o valor da União sem `data-ponto`) | `gate:html` |
| faixa | um país em falta no desenho | `check:formas` (F19b) |
| faixa | uma posição trocada | `check:formas` (F19c) |
| faixa | o ponto da União da faixa a divergir da série | `gate:html` |
| faixa | o empate tirado da frase | `check:formas` (F19e) |
| faixa | um nome de país escrito à mão | `gate:html` |
| faixa | o lugar de Portugal trocado | `gate:html` |
| faixa | a contagem dos países trocada | `gate:html` |
| recibo | um valor da tabela do recibo trocado | `gate:html` |
| livro | o ponto da União da série a divergir da linha `-ue` | `ledger:check` (S6) |
| livro | o ponto de Portugal a divergir da linha portuguesa | `ledger:check` (S6) |
| livro | um país em falta na série | `ledger:check` (S3) |
| livro | uma série editada à mão | `check:cruzamento` |
| livro | uma série escrita à mão, sem travessia | `check:cruzamento` |
| palavras | uma palavra da frase mudada na declaração | `acertos-ue1.py` |

Fora da tabela, as 3 do programa do typecheck (`tipos-ue1.json`) e as 6 do detetor das faixas (`faixas-ue1.json`). E as que correm dentro dos portões a cada corrida: as 11 do `ledger:check`, as 12 da F19 e as 12 da K18 (uma posição trocada, um país em falta no desenho, a ponta mais alta a nomear outro país, o empate tirado da frase, um empate que os valores não têm e a porta para outra série, em cada edição da página dos temas), as 4 do `check:cruzamento`, a da K1 (uma faixa num cartão sem série) e as 12 da suíte do motor. Os portões que mudaram de forma conservam o que protegiam: a K1 continua a recusar um bloco a mais no cartão e passa a admitir a faixa só onde a linha tem série; a régua das frases conta as marcas novas como origens, e cada uma é comparada pelo portão de HTML.

## O que não mudou

Entre a base `8e66b601` e a cabeça do código: 0 ficheiros mudados em `ledger/claims/`, 0 ficheiros da primeira página, 0 das leituras (as das medidas e as do RP1), 0 no guião da aterragem, e 0 nos 6 registos de travessia que já existiam. Nenhum valor de nenhuma linha mudou.

## Os portões

Na cabeça `33ed14a0`, cada um no seu comando, com o código escrito num ficheiro acabado de escrever em `portoes/`: `npm run build` a 0 em 178 segundos, `npm run verify` a 0 em 756 segundos, `npm run typecheck` a 0 em 1 segundo. Os registos têm os caminhos da máquina trocados por marcas (`portoes/caminhos-trocados.json`). No motor, o `core.gate` correu no pre-commit de cada commit do ramo e outra vez na cabeça final, a 0 (`motor/core-gate.txt`).

## Os commits

O sítio, ramo `ue1-2026-09-29`, depois do brief do lugar de direção (`09bca6c7`):

- `a182c200` as linhas de série por país atravessam do motor, com a tabela dos nomes;
- `42cedfd9` o livro-razão lê as séries (as regras S1 a S8 no `ledger:check`, e a travessia no `check:cruzamento`);
- `e1c20147` o recibo de cada série, nas duas edições, e as origens das séries no portão de HTML;
- `7ae82d82` a faixa da União nos cartões, com a frase do lugar de Portugal, e a F19 e a K18 que a refazem dos pontos;
- `ac965c61` a prova das palavras da frase (`acertos-ue1.py`), o acerto F0 dito, e as datas do recibo em linhas próprias;
- `b6991e78` a importação que a célula da faixa não lia;
- `ee95f3ca` o caminho no cabeçalho do recibo (a L5 do `check:lugar`);
- `33ed14a0` o mapa do repositório com a rota das séries e a secção do UE1;
- e o commit da entrega destas provas, o último.

O motor, ramo `ue1-2026-09-29`: `da6df0b` os pedidos e os corpos alojados; `50f8352` o gerador das séries pelas coordenadas seladas; `daa5355` a travessia para o livro-razão do sítio, com as plantas no `core.gate`; `e394307` o cliente partilhado.

## O custo

Do primeiro pedido (14:11:43 UTC) ao fim dos portões finais (16:16:29 UTC), 7 486 segundos. Os símbolos estão em `custo-ue1.json`, lidos à mão do contador que o ambiente mostra ao agente: 951 859 ao fim dos portões e 1 219 541 no fecho, lidos antes do último commit; o total que a ferramenta reporta ao lugar de direção é o que conta.

## O que ficou por fazer, e porquê

- A leitura a frio pelo Codex, com os estragos plantados nas cópias do pacote (a decisão do §6 do brief), e o registo em `DECISIONS.md`: são do lugar de direção.
- O recibo da linha portuguesa de cada medida não abre a série; a porta para os países é a ligação «Todos os países» da faixa. Uma porta no enquadramento do recibo é um acrescento pequeno, se o lugar de direção a quiser.
- Os ramos declarados que não se rendem hoje (o empate com um país só e um extremo repetido) não têm linha no inventário: uma linha viva que não se rende fecha a construção, e entram quando se renderem. É a regra que o L1 seguiu, com o preço que o PP1 escreveu: uma travessia nova das séries pode pedir uma linha.
- A ordem da tabela do recibo é a protocolar, que é a da fonte; a ordem por valor é a da faixa.
- `tests/` fica fora do typecheck e do `check:mortos`. Não é deste bloco mudá-lo, e fica como proposta: a importação por ler de `tests/cartao/faixa.mjs` só a viu o editor.
- O brief do RP3 põe-se em dia quando este bloco aterrar (a decisão do §6 sobre o RP3): a forma da série, a rota `serie` e as células estão no mapa do repositório.

## UE1b · a passagem de correção

*Pedida pelo lugar de direção a 29.09.2026, depois da entrega do UE1, nas mesmas worktrees: o ordinal inglês, a marca da fonte na faixa dita por palavras e explicada no recibo da série, e a porta do recibo da linha portuguesa para a sua série. O brief e a tabela do seu §1 não mudaram (0 ficheiros). O motor também não (0 commits desde `e394307`). O build, o verify e o typecheck correram na cabeça do código `c9859d31`, e as medidas estão em `medidas-ue1b.json`, escrito por `medir-ue1b.mjs`.*

### O que o leitor vê agora

- **O lugar em inglês diz-se com o ordinal.** «Portugal (18,6) ranks 15th from the highest, level with other countries with the same value (Austria and Sweden).» Nas 10 medidas, os lugares que se rendem hoje na edição inglesa são 2nd, 6th, 7th, 8th, 10th, 12th, 13th, 14th e 15th: o sufixo «nd» nos preços da habitação e «th» nas outras, e o 12.º e o 13.º passam pela exceção dos 11 a 13. A edição portuguesa já dizia «15.º lugar».
- **A marca da fonte diz-se por palavras.** Nas pontas da faixa, um ponto com marca mostra-a como o sítio mostra o provisório e o estimado nos cartões: o valor e, entre parênteses, as palavras, na mesma letra pequena e cinzenta. Hoje há 2 pontas com marca: a Hungria nos preços da habitação («Hungria 18,3 (dado provisório)», «(provisional data)» na edição inglesa) e a Espanha na taxa de desemprego («Espanha 10,5 (definição diferente)», «(definition differs)»). Nas 10 páginas que levam faixas não fica nenhuma letra crua (0; a frase dizia 12, e a passagem UE1c corrigiu-a).
- **O recibo da série diz o que quer dizer cada marca.** Ao lado da tabela (por baixo dela nos ecrãs estreitos), cada marca que aparece na tabela diz-se uma vez: a letra, as palavras com que a faixa a mostra e a definição que a própria resposta do Eurostat traz, tal como a escreve («ep»: valor estimado e provisório; na resposta do Eurostat, «estimated, provisional»). A tabela fica com a letra. São 16 recibos com legenda (as 8 séries com marcas, em português e em inglês), com 28 entradas; os 4 recibos das séries sem marcas não a têm.
- **O recibo da linha portuguesa abre a série.** No bloco «O enquadramento» do recibo de cada uma das 10 linhas portuguesas, em português e em inglês, há uma linha nova, «Países da União · Todos os países» («EU countries · All the countries»), que abre o recibo da série: 20 portas.

As capturas estão em `design/especime-v3/capturas/ue1-2026-09-29/ue1b/`.

### O mandato da passagem, ponto a ponto

| ponto | o que | o que se fez | a medida |
|---|---|---|---|
| ponto 1 | O ordinal inglês, como palavra declarada, com uma planta de cada sufixo que morde | os sufixos em `ordinal` de `src/data/faixa-da-uniao.mjs`, com o acerto F4 no registo dos acertos (provado por `acertos-ue1.py`); a regra do inglês no resolvedor e, escrita à parte, nos portões (`sufixoOrdinalDoPortao`); a F19g confere a regra dos portões com as palavras declaradas contra os 27 ordinais escritos à mão, e a F19e e a K18 recompõem a frase com o ordinal | 27 ordinais conferidos em cada corrida da F19 e da K18; 9 acertos, 6 formas da frase iguais em 6; na célula, a cada corrida, uma planta de cada sufixo na declaração, a regra sem a exceção dos 11 a 13 e as das ressalvas (8 plantas das palavras), e, na página inglesa dos temas, o «2nd» e o «12th» trocados; nas plantas do bloco, 6 do ordinal (um sufixo de cada na declaração e os da página), todas a morder |
| ponto 2 | A marca da fonte na faixa, na forma do sítio, em português e em inglês; e o recibo da série a dizer, ao lado da tabela, o que quer dizer cada marca, com as definições da resposta do Eurostat, seladas | as palavras em `ressalvas` da declaração; na ponta, o valor e as palavras entre parênteses num `<span>` próprio com a regra de estilo de `.claim-provisorio`, e a marca em `data-bandeira`; a F19d confere as palavras e o texto de cada ponta, e a F19h que cada marca que um ponto leva tem palavras em português e em inglês; no recibo, a legenda ao lado da tabela, que o portão de HTML confere contra a tabela e a série, e a definição por `data-serie-campo`. As definições já vinham seladas: o motor tira-as da resposta (`extension.status.label`), a travessia relê-as no corpo alojado (VS2), o registo da travessia prende os bytes da série, e o portão de HTML compara o texto do recibo com a série | 8 ressalvas nas pontas (4 nas páginas dos temas); 10 pares de marca e edição com palavras; 16 legendas com 28 marcas; nas capturas, a legenda ao lado da tabela nas 16 capturas de 768 px ou mais e por baixo dela nas 4 de 390 px; nas plantas do bloco, 3 das ressalvas e 3 da legenda, todas a morder |
| ponto 3 | A porta do recibo da linha portuguesa para a sua série, nas 10 medidas, em português e em inglês | uma linha nova no bloco «O enquadramento» de `LinhaView.astro`, com `data-porta-da-serie` e as palavras da porta da faixa; o portão de HTML exige-a nas 10 linhas, em português e em inglês, dentro do enquadramento e para o recibo da série na edição da página, e recusa-a em qualquer outra página | 20 portas; nas plantas do bloco, 3 (a porta tirada, a porta para outra série e uma porta no recibo de uma linha sem série), todas a morder |
| depois | As conferências entre commits, o build, o verify e o typecheck, as capturas, este relatório e a resposta curta | as conferências que cada commit tocou, antes dele (`entre-commits-ue1b.json`); os portões em `portoes/ue1b/`; `captar-ue1b.mjs`; `faixas-ue1.mjs` outra vez, para `faixas-ue1b.json` | 11 conferências entre commits, 11 a 0; build 0 em 198 segundos, verify 0 em 830, typecheck 0 em 0; 70 capturas (30 de cartões, 20 de recibos de série e 20 de recibos de linha) nas 5 larguras, em português e em inglês, com 0 problemas, as 6 plantas dos detetores vistas e 0 pedidos para fora; 200 medições das faixas, com 0 problemas e as 6 plantas vistas |

### O que decidi, e o lugar de direção pode trocar num ficheiro só

- **As palavras das marcas que o sítio ainda não tinha**, em `src/data/faixa-da-uniao.mjs`: `ep`, «valor estimado e provisório» e «estimated and provisional value»; `d`, «definição diferente» e «definition differs»; `b`, «quebra de série» e «break in time series»; `u`, «fiabilidade reduzida» e «low reliability». As de `p` («dado provisório», «provisional data») e de `e` («valor estimado», «estimated value») são as que o sítio já usa. Hoje só `p` e `d` aparecem numa ponta; as outras estão declaradas porque os pontos das séries as levam, e a F19h fecha a construção se uma marca nova chegar sem palavras.
- **A ressalva fica na ponta, e a frase não a leva.** A ponta mostra o valor com o país, e é aí que a marca se diz; a frase é a do lugar de direção, e pô-la também lá («o mais alto 18,3 (dado provisório) (Hungria)») era mudar as palavras do §3 com parênteses seguidos.
- **A classe da ressalva é própria** (`faixa-ue-ressalva`), com a mesma regra de estilo de `.claim-provisorio`: as células dos cartões e das áreas leem `.claim-provisorio` como a ressalva de uma linha do livro-razão, e uma ressalva de um ponto de série com essa classe contava como uma ressalva sem linha.
- **A legenda leva as palavras da faixa e a definição da resposta, e a tabela fica com a letra.** Antes, a definição repetia-se por extenso em cada linha que tinha marca.
- **A porta chama-se «Todos os países»**, como a da faixa, numa linha própria do enquadramento («Países da União»).

### Achados da passagem

1. **A exceção dos 11 a 13 rende-se com dados reais.** O 12.º da taxa de emprego e o 13.º da sobrecarga do custo da habitação dizem-se «12th» e «13th» na página, medidos no `dist/`; a planta que troca o «12th» por «12nd» morde.
2. **O inventário das frases não pedia as formas novas.** O `check:voz` só exige uma linha para um bloco sem origens (o caso 3), e a frase da faixa tem origens; o que fechou a construção foram as linhas inglesas antigas, que deixaram de se render (o caso 7). As formas com o ordinal e as ressalvas entraram no inventário (783 linhas vivas, todas rendidas), e a planta do inventário prova que uma forma escrita com outro sufixo fecha a construção.
3. **As definições já estavam seladas**, e por isso o motor não mudou: a legenda só mostra o que a série já trazia, conferido.

### As plantas da passagem

Em `plantas-ue1b.json`, com as saídas em `plantas/ue1b/`: 17 plantas, 17 mordidas, 17 repostas pelo sha256, e as 4 corridas limpas a seguir, todas a 0.

| grupo | as plantas | o portão que morde |
|---|---|---|
| ordinal | os sufixos «st», «nd», «rd» e «th» trocados na declaração; o «2nd» da página inglesa trocado por «2th»; o «12th» pela regra sem a exceção («12nd») | `check:formas` (F19g, F19e) |
| ressalva | a ressalva de uma ponta trocada pela letra crua; a ressalva com as palavras de outra marca; a marca «d» sem palavras na declaração inglesa | `check:formas` (F19d, F19h) |
| legenda | a definição de uma marca trocada; uma marca tirada da legenda; as palavras de uma marca trocadas | `gate:html` |
| porta | a porta tirada do recibo da linha portuguesa; a porta para outra série; uma porta no recibo de uma linha sem série | `gate:html` |
| palavras | o acerto F4 tirado do registo dos acertos | `acertos-ue1.py` |
| inventário | a linha inglesa da forma com «nd» escrita com outro sufixo | `check:voz` |

E as que correm dentro dos portões a cada corrida: na F19 e na K18, 20 plantas das páginas dos temas (as do UE1, as das ressalvas em cada edição e, na inglesa, as do ordinal) e 8 plantas das palavras.

### O que não mudou

Entre o commit das provas do UE1 (`0f75298f`) e a cabeça do código da passagem: 0 ficheiros em `ledger/claims/`, 0 nas séries, nos registos de travessia e na tabela dos nomes, 0 no brief, 0 da primeira página, 0 das leituras e 0 no guião da aterragem; e 0 commits no motor.

### Os portões e os commits da passagem

Na cabeça `c9859d31`, cada um no seu comando, com o código num ficheiro acabado de escrever em `portoes/ue1b/`: `npm run build` a 0 em 198 segundos, `npm run verify` a 0 em 830 segundos, `npm run typecheck` a 0 (0 segundos pela diferença das horas). Os registos têm os caminhos da máquina trocados por marcas (`portoes/ue1b/caminhos-trocados.json`).

Os 3 commits de código, cada um depois das conferências que tocou (`entre-commits-ue1b.json`):

- `63f54d18` o ordinal inglês, as ressalvas nas pontas e a legenda das marcas do recibo da série, com o inventário das frases e o registo dos acertos (o estado sem a porta foi construído à parte antes do commit);
- `181ce25c` a porta do recibo da linha portuguesa para a sua série;
- `c9859d31` o mapa do repositório (o `conferir-mapa.py` dá 126 citações no sítio, 0 longe e 0 por encontrar);
- e o commit das provas da passagem, o último.

### O custo da passagem

Do commit das provas do UE1 (17:18:28 UTC) ao fim dos portões da passagem (18:26:04 UTC), 4 056 segundos. Os símbolos, lidos à mão do contador que o ambiente mostra ao agente (`custo-ue1b.json`): 1 552 425 na sessão ao fecho da passagem, 332 884 na passagem; o total que a ferramenta reporta ao lugar de direção é o que conta.

### O que ficou por fazer

- A leitura a frio pelo Codex, que o lugar de direção lança depois da reposição da semana dele (03.10.2026, 17:10 UTC), e o registo em `DECISIONS.md`; a nota do 15.º na tabela do §1 do brief é do lugar de direção.
- A revisão das linhas novas do inventário das frases (os blocos `ue1` e `ue1b` estão «por ler pelo lugar de direção antes de aterrar»).
- As palavras das marcas `ep`, `d`, `b` e `u` são uma proposta; e a ressalva na frase, se o lugar de direção a quiser, é um acerto às palavras do §3.
- Do UE1 continuam: `tests/` fora do typecheck e do `check:mortos`, como proposta, e o brief do RP3 posto em dia depois da aterragem. A porta do recibo da linha portuguesa, que o UE1 deixou por fazer, está feita.

## UE1c · a passagem de correção depois da leitura a frio

*Pedida pelo lugar de direção a 29.09.2026, depois da leitura a frio do Codex (`design/especime-v3/critica/LEITURA-ue1-2026-09-29.md`, com a triagem no cabeçalho), pelos achados 5, 8, 9, 10 e 11. O motor não mudou (0 commits). O build, o verify e o typecheck correram na cabeça do código `982d6446`, e as medidas estão em `medidas-ue1c.json`, escrito por `medir-ue1c.mjs`.*

### O mandato da passagem, ponto a ponto

| ponto | o que | o que se fez | a medida |
|---|---|---|---|
| ponto 1 | Os extremos empatados (achado 5) | num extremo empatado, cada país da ponta leva o seu valor e a sua ressalva, pelo mesmo laço de uma ponta sem empate, com as palavras da lista entre eles; a F19d confere todos os países da ponta numa função só (`conferirPonta`), que a F19 e a K18 chamam; e, como nenhuma das 10 séries tem hoje um extremo empatado, as plantas dos empates fazem um em memória, numa cópia de uma série, e escrevem a ponta certa (o controlo, que tem de passar) e a estragada (que tem de morder) | 6 plantas dos empates a morder em cada corrida da F19 e da K18, entre elas a da marca só no segundo país empatado, cada uma com o controlo a passar; nas plantas do bloco, a F19d estragada para ver só o primeiro país da ponta faz a planta do segundo país falhar, e o `check:formas` fecha |
| ponto 2 | O que cada medida conta, no recibo da série, com a frase do cartão (achados 9 e 10) | a frase é o princípio da leitura declarada do cartão, enquanto for palavras fixas e algarismos declarados, até ao primeiro pedaço calculado, cortado no último ponto final (`definicaoDaMedida`); rende-se pelo mesmo `Frase.astro` por baixo do título do recibo; o portão de HTML recompõe-a pela sua regra, confere-a em cada recibo e recusa-a onde a regra não a dá | 7 séries com a frase (14 recibos) e 3 sem ela (6 recibos); nas plantas do bloco, a frase mudada, a frase tirada e uma frase posta onde a leitura não a tem, as 3 a morder |
| ponto 3 | A comparação com a média da União em palavras, nos 10 cartões (achado 8) | conferidas as leituras dos 10 cartões, em português e em inglês: 9 dizem-na. A da sobrecarga do custo da habitação no total não, e não a acrescentei: parei neste ponto, pela razão abaixo | 9 cartões com a comparação em cada edição; 0 mudanças nas leituras |
| ponto 4 | O relatório (achado 11) | as frases que diziam 12 páginas com faixa dizem agora 10, com a correção dita | 10 páginas com faixa, das 12 que o guião das faixas lê; as 2 sem faixa são a da escola e da saúde, em português e em inglês |

### Onde parei, e porquê: a média da União no cartão da sobrecarga no total

- **O cartão cala a média da União por decisão escrita.** A §1.124 (bloco R1, I138) mandou calá-la neste cartão: a própria Comissão adverte que a sobrecarga só se lê ao lado do regime de ocupação, e «o cartão punha 6,3 ao lado de 7,7 da União e levava o leitor à conclusão errada»; fica calada «até uma decisão escrita a mudar», e a razão declarada é que a média da União volta com a medida por regime de ocupação, no B2 (`src/data/figuras.mjs`, a entrada da medida, com `semMediaEuropeia`). A K14 do `check:cartao` protege esse silêncio.
- **A leitura só compara com o que a régua do cartão cita**, e a régua deste cartão cala a União. Acrescentar a comparação à declaração da leitura não a rende (ensaiei-o, e a leitura saiu igual); rendê-la é desfazer a §1.124, e a régua passava a mostrar a média da União com ela. Isso é uma decisão do lugar de direção, e por isso não a tomei e devolvi a leitura ao que estava.
- **O UE1 já pôs a média da União neste cartão**, pela faixa: o valor da União na frase da faixa («a média da União é 7,7») e a marca da União no desenho são 2 marcas no cartão, e a K14 conta 0, porque só conta a marca da régua e a linha da União (`data-regua="ue"` e `data-claim` da linha `-ue`) e não o `data-ponto` do ponto da União da série. O brief do UE1 escolheu esta medida entre as 10 que a faixa compara com a União, e por isso a contradição com a §1.124 vem do UE1, e não desta passagem.
- **A decisão que falta**, e é do lugar de direção: ou a §1.124 cai (e então a leitura ganha a comparação, a régua volta a mostrar a União e a K14 larga a medida), ou fica (e então a faixa deste cartão perde a marca e o valor da União, e a K14 passa a ver o ponto da União da faixa).

### Achados da passagem

1. **3 das 10 leituras abrem com o valor de Portugal**, e por isso o recibo da série delas não tem a frase do que a medida conta: o índice harmonizado de preços no consumidor, o rácio S80/S20 e os preços da habitação. A frase que o cartão usa para dizer o que elas contam traz o valor português (por exemplo, «Os 20 % da população com mais rendimento recebem, no total, 4,86 vezes o que recebem os 20 % com menos rendimento.»), e numa página com os 27 países leria como um facto de todos. Uma frase sem o valor não existe no cartão, e não a escrevi.
2. **O guião dos acertos do L1 já estava velho antes desta passagem.** `acertos-l1.py --confere` sai com 1 na cabeça de partida, porque o bloco RP1 acrescentou ao ficheiro das leituras a importação e a junção das leituras do RP1 sem pôr o guião em dia. Não é um portão, e não lhe mexi.
3. **O comando de uma medida da UE1b diz «doze páginas»** onde são 10 com faixa, das 12 lidas (`letras_cruas_nas_faixas`, em `medidas-ue1b.json`); a contagem, 0, não muda, porque as 2 páginas sem faixa não têm faixa nenhuma onde uma letra crua pudesse estar.

### As plantas da passagem

Em `plantas-ue1c.json`, com as saídas em `plantas/ue1c/`: 4 plantas, 4 mordidas, 4 repostas pelo sha256, e as 2 corridas limpas a seguir, as 2 a 0.

| grupo | a planta | o portão que morde |
|---|---|---|
| empates | a F19d a ver só o primeiro país da ponta | `check:formas` (a planta do segundo país empatado deixa de morder) |
| o que conta | a frase do recibo da pobreza com uma palavra a menos | `gate:html` |
| o que conta | a frase tirada do recibo inglês dos inquilinos | `gate:html` |
| o que conta | uma frase posta no recibo do rácio S80/S20, cuja leitura não a tem | `gate:html` |

E, dentro dos portões a cada corrida, as 6 plantas dos empates da F19 e as 6 da K18.

### O que não mudou

Entre o commit da leitura a frio (`96a6035e`) e a cabeça do código da passagem: 0 ficheiros em `ledger/claims/`, 0 nas séries, nos registos de travessia e na tabela dos nomes, 0 nas leituras dos cartões e na sua auditoria, 0 no brief e 0 no guião da aterragem; e 0 commits no motor.

### As capturas

Em `design/especime-v3/capturas/ue1-2026-09-29/ue1c/` e `capturas-ue1c.json`: a cabeça do recibo de cada uma das 7 séries com a frase, em português e em inglês, nas 5 larguras, 70 capturas, com 0 problemas, as 4 plantas dos detetores vistas e 0 pedidos para fora; e a presença da frase medida nos 20 recibos (14 com ela). Nenhum cartão mudou à vista nesta passagem: os extremos empatados não se rendem hoje, e a comparação do cartão da sobrecarga no total ficou por fazer.

### Os portões e os commits da passagem

Na cabeça `982d6446`, cada um no seu comando, com o código num ficheiro acabado de escrever em `portoes/ue1c/`: `npm run build` a 0 em 256 segundos, `npm run verify` a 0 em 733 segundos, `npm run typecheck` a 0 em 1 segundo; os registos com os caminhos da máquina trocados por marcas (`portoes/ue1c/caminhos-trocados.json`). Nos portões corre também a K17, com as 190 leituras dos cartões recompostas.

Os 3 commits de código, cada um depois das conferências que tocou (7, todas a 0, em `entre-commits-ue1c.json`):

- `baa82bce` os extremos empatados (o estado sem a frase do recibo foi construído à parte antes do commit);
- `2a12ff68` o que cada medida conta, no recibo da sua série;
- `982d6446` o mapa do repositório (o `conferir-mapa.py` dá 135 citações no sítio, 0 longe e 0 por encontrar);
- e o commit das provas da passagem, o último.

### O custo da passagem

Do commit da leitura a frio (20:07:33 UTC) ao fim dos portões da passagem (20:51:03 UTC), 2 610 segundos. Os símbolos, lidos à mão do contador que o ambiente mostra ao agente (`custo-ue1c.json`): 1 760 279 na sessão ao fecho da passagem e 207 854 na passagem; o total que a ferramenta reporta ao lugar de direção é o que conta.

### O que ficou por fazer

- A decisão sobre a média da União no cartão da sobrecarga no total, acima: a §1.124 contra a faixa do UE1.
- A frase do que a medida conta para o índice harmonizado de preços, o rácio S80/S20 e os preços da habitação, se o lugar de direção a quiser escrever sem o valor de Portugal.
- O guião dos acertos do L1, velho desde o RP1.
- Das passagens anteriores continuam: as palavras das marcas `ep`, `d`, `b` e `u` como proposta, a ressalva na frase da faixa, `tests/` fora do typecheck e do `check:mortos`, e o brief do RP3 depois da aterragem.

## UE1d · a média da União de volta ao cartão da sobrecarga no total, com a ressalva, e a definição declarada no recibo de cada série

*Pedida pelo lugar de direção a 29.09.2026, com a decisão que entra na §1.140: a condição da §1.124 cumpriu-se, e a proteção muda de forma. O motor não mudou (0 commits). O build, o verify e o typecheck correram na cabeça do código `99b9f73a`, e as medidas estão em `medidas-ue1d.json`, escrito por `medir-ue1d.mjs`.*

### O que o leitor vê agora

- **O cartão da sobrecarga do custo da habitação no total**, na página dos temas, na da entrada da casa e na da área das infraestruturas e da habitação, em português e em inglês, mostra outra vez a média da União na régua (a União com 7,7, ao lado dos 6,3 de Portugal), e a leitura acaba na comparação em palavras: «Está abaixo da média da União Europeia.» e «Below the European Union average.». Por baixo da régua e da faixa, num bloco próprio, a ressalva da Comissão: «Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.»
- **Os recibos dessa medida dizem a mesma ressalva**: o da linha, no bloco «O enquadramento», por baixo da linha da União; e o da série, por baixo da definição. A primeira página continua a dizê-la no bloco da casa, agora lida da mesma fonte.
- **O recibo de cada uma das 10 séries** diz, por baixo do título, a definição declarada da medida, a mesma que o cartão mostra nas páginas dos painéis; o índice harmonizado de preços no consumidor, o rácio S80/S20 e os preços da habitação, que na UE1c ficaram sem frase, têm-na agora.

### O mandato da passagem, ponto a ponto

| ponto | o que | o que se fez | a medida |
|---|---|---|---|
| ponto 1a | A média da União volta ao cartão | a declaração `semMediaEuropeia` saiu de `figuras.mjs`; `reguaDoCartao()` é agora `reguaDaMedida()`, e a régua e a leitura voltam a citar a linha da União; a leitura da medida ganhou a comparação (`MEDIA_UE` e `EU_AVERAGE`, as folhas comuns da auditoria) e perdeu a frase da ressalva, que passou a um bloco próprio | 0 entradas de `FIGURAS` com a média calada; na página dos temas, 10 das 10 leituras dizem a comparação com a União em português e 10 em inglês; a K17 recompõe as leituras de 190 cartões |
| ponto 1b | Nunca sem a ressalva | a fonte única `src/data/ressalvas-da-uniao.mjs`, com o texto do bloco `casa` trazido sem mudar uma letra; o bloco `casa` lê-a (o mesmo objeto), e o cartão, o recibo da linha e o recibo da série também | num varrimento de todo o `dist/`, com código próprio: 6 cartões da medida com a União, 6 com a ressalva e 0 sem ela; 14 páginas levam a linha da União desta medida, com a classe de cada uma em `medidas-ue1d.json`; 4 recibos com a União e a ressalva; 2 primeiras páginas com ela; 0 ressalvas de outra medida |
| ponto 1c | A K14 muda de forma e não de proteção | a lista das medidas (hoje esta) escrita no teste, com a decisão ao lado; a célula exige a ressalva, com o texto da fonte na língua da página, em cada cartão da lista que mostre a régua da União, a linha da União ou a faixa, e em cada recibo da linha com a União no enquadramento e em cada recibo da série; a declaração tem de ter exactamente as medidas da lista, e a linha da União tem de existir; a K1 admite o bloco da ressalva num cartão só nas medidas da lista, e uma vez; os conhecidos-positivos são pelo menos um cartão e um recibo vistos com a União e com a ressalva; as 2 plantas da prova, um cartão com a União sem a ressalva e um recibo da série sem ela, com o controlo a passar; e, depois da primeira corrida das plantas da passagem (abaixo), o construtor da prova lê a ressalva declarada sem rebentar quando a declaração não a tem | a K14 vê 6 cartões e 4 recibos com a União e a ressalva; a prova do `check:cartao` planta 14 estragos e vê 14; nas plantas da passagem, as da ressalva mordem todas (abaixo) |
| ponto 1d | Os comentários que davam a §1.124 como a razão do silêncio | dizem agora o que vale, com a data e a §1.140, em `figuras.mjs`, `tests/cartao/cartao.mjs`, `ReguaDoCartao.astro`, `enquadramento.mjs`, `leitura-da-medida.mjs` e `leituras-das-medidas.mjs`; `src/data/areas.mjs` cita a §1.124 pela notificação do INE e não pelo silêncio, e ficou | 9 ficheiros de `src/`, `tests/` e `scripts/` citam a §1.124; os 4 que não citam também a §1.140 citam-na por outras decisões dessa entrada (a notificação do INE e «o que é interativo prova-se a interagir»), e os outros contam a história com a §1.140 ao lado |
| ponto 2 | A definição declarada no recibo de cada série | o `SerieView.astro` lê `DEFINICOES_DAS_MEDIDAS` e rende-a pelo mesmo `Frase.astro` do cartão, com os selos; o portão de HTML refá-la da declaração (as cadeias e os algarismos declarados) e confere-a carácter a carácter em cada recibo, e exige-a nos 20; `definicaoDaMedida()` e a regra do corte saíram | 20 dos 20 recibos com a definição igual à declaração, refeita por `medir-ue1d.mjs` com código próprio; o portão de HTML conta 20; 0 chamadas de `definicaoDaMedida(` no código; as definições das 10 medidas têm todas a origem declarada (10) |
| ponto 3 | «doze páginas» passa a «dez páginas» | o comando da medida `letras_cruas_nas_faixas`, em `medir-ue1b.mjs` e em `medidas-ue1b.json` | 1 campo mudado no JSON, esse comando; o valor continua 0 |
| ponto 4 | O `acertos-l1.py` | fora desta passagem, e não lhe mexi | 0 ficheiros mudados na pasta dele |

### O que decidi, e o lugar de direção pode trocar num ficheiro só

- **Onde o cartão mostra a União.** A ressalva entra no cartão quando a régua cita a linha da União ou quando o cartão tem a faixa (`CartaoDaMedida.astro`). Na página da área das infraestruturas e da habitação o cartão tem a régua e não tem faixa nem leitura, e leva a ressalva na mesma. Um cartão da medida com a ressalva e sem a União à vista seria uma ressalva a mais: há 0.
- **As palavras inglesas da ressalva no cartão mudaram**, porque a fonte única é a do bloco `casa`. A frase que fechava a leitura inglesa do cartão dizia «read together with the tenure structure»; a do bloco `casa`, que o cartão diz agora, diz «read together with the breakdown by tenure status». A portuguesa era a mesma no bloco `casa` e na leitura antiga, e continua.
- **As páginas que levam a linha da União desta medida e não são comparações ficaram sem a ressalva**, e a K14 não as conta: o recibo da própria linha da União, em português e em inglês, que só tem o valor da União e a sua prova, sem Portugal ao lado; e o índice do livro-razão, em português e em inglês, que lista as linhas. A primeira página tem a ressalva, da mesma fonte, e quem a confere é o `check:primeira`, pela auditoria das palavras da primeira página, e não a K14. As contagens por classe estão em `medidas-ue1d.json` (`paginas_com_a_linha_da_uniao_por_classe`). Se o lugar de direção quiser a ressalva também no recibo da própria linha da União, é uma linha na `LinhaView.astro` e uma rota na K14.
- **A origem da definição não se rende no recibo da série**: 0 dos 20 recibos têm a peça da origem (o documento, o excerto e a data de leitura). O ponto 2 pedia a definição, e não a origem, e não a pus. O recibo da linha rende a definição com a origem (`OrigemDaDefinicao`) só nas medidas fora dos painéis, que são 2 das 10 (o índice harmonizado e os inquilinos a preço de mercado), e o detetor acha-a lá. Se o lugar de direção a quiser no recibo da série, é a mesma peça.
- **A K17 passou a contar as origens da auditoria da primeira página.** A origem da ressalva (`ce-swd-2026-222-habitacao`) deixou de apoiar uma folha da leitura do cartão e ficou a apoiar só o bloco `casa`; a regra «nenhuma origem declarada sem uso» dava-a por órfã. Conta agora as origens de `tests/inicio/blocos-provados.json` como usadas, e 2 plantas novas provam que a regra ainda morde: uma origem declarada que nada apoia, e a origem da ressalva sem a auditoria da primeira página (a K17 vê as suas 14 de 14).

### Achados da passagem

1. **Corri a construção do estado do segundo commit ao mesmo tempo que o build do F2.2c do Codex, noutra worktree.** Antes dessa construção, o `pgrep` mostrou os processos do build dele, e o meu comando seguiu para o `npm run build` sem esperar, porque o `pgrep` só escrevia e não travava. É uma falta à regra «uma construção de cada vez». A árvore e o `dist/` dele são outros que os meus, e a construção do estado passou; o que se partilhou foi a máquina. Os portões da passagem correram por `portao-ue1d.sh`, que espera enquanto houver outra construção: o build da primeira corrida esperou pelo verify do Codex (`portoes/ue1d-de17f63e/espera.log`).
2. **Parei a primeira tentativa dos portões por um diagnóstico errado.** Julguei que ela esperava por si própria, porque a linha de comando dela tinha os nomes dos portões por extenso; o manual do `pgrep` do macOS diz que ele não conta os seus antepassados, e o que ela via era o verify do Codex. Parei-a antes de correr portão nenhum, e o guião que a substituiu espera da mesma maneira, um portão por comando. O comentário do guião dizia o diagnóstico errado e corrigi-o depois das 3 corridas na cabeça `de17f63e`, com 0 linhas de código mudadas (o sha256 do que correu e o do ramo estão em `portoes/ue1d-de17f63e/guiao-dos-portoes.json`); a corrida final dos portões já correu com o guião corrigido.
3. **O `conferir-mapa.py` sai sempre com 0**, haja ou não citações perdidas: é um guião de leitura, e a prova dele são as contas que escreve. O `entre-commits-ue1c.json` guardou só o código do mapa da UE1c; li agora o registo dessa corrida, com 135 citações no sítio e 0 perdidas, e o `entre-commits-ue1d.json` guarda as contas.
4. **A planta da declaração rebentava a prova do `check:cartao`.** Na primeira corrida das plantas da passagem, na cabeça `de17f63e`, a planta que tira a medida da declaração das ressalvas fechou a construção, mas com um TypeError no construtor da prova (`montaAProva`, que lia o texto da ressalva sem conferir que ele existia), antes de a K14 poder dizer a razão: 7 das 8 plantas morderam com a queixa esperada (`plantas-ue1d-primeira.json`, com as saídas em `plantas/ue1d-primeira/`). O quarto commit de código, `99b9f73a`, lê o texto sem rebentar: com a prova, o controlo da K14 dá vermelho com «a declaração não tem o texto da ressalva desta medida»; sem ela, a conferência da declaração diz «exige a ressalva e a declaração não a tem». Os portões correram outra vez, na cabeça nova, e a segunda corrida das plantas tem as 8 a morder.
5. **No estado completo, antes de o partir em 2 commits, 2 conferências falharam**, e ficam em `entre-commits-ue1d.json` com o que as resolveu: o build, pelo `check:voz`, com 6 blocos por classificar (a ressalva nova, nas páginas que a rendem) e 2 linhas vivas do inventário que já não se rendiam (a leitura antiga); e o `check:cartao`, pela K17, com 1 origem declarada sem apoio.

### As plantas da passagem

Em `plantas-ue1d.json`, com as saídas em `plantas/ue1d/`, na cabeça `99b9f73a`: 8 plantas (5 da ressalva, 2 da definição e 1 do typecheck), 8 mordidas com a queixa esperada, 8 repostas pelo sha256, e as 3 corridas limpas a seguir, 3 a 0.

| grupo | a planta | o portão que morde |
|---|---|---|
| ressalva | a ressalva tirada do cartão da página portuguesa dos temas | `check:cartao`, a K14 |
| ressalva | a ressalva tirada do recibo inglês da série | `check:cartao`, a K14 |
| ressalva | a ressalva tirada do recibo português da linha | `check:cartao`, a K14 |
| ressalva | a ressalva posta no cartão da dívida, que não está na lista | `check:cartao`, a K1 |
| ressalva | a medida tirada da declaração das ressalvas | `check:cartao`, a K14 |
| definição | uma palavra mudada na definição do recibo dos preços da habitação | `gate:html` |
| definição | a definição tirada do recibo inglês do índice harmonizado | `gate:html` |
| tipos | um número onde a fonte única das ressalvas promete um texto | `typecheck` (o conhecido-positivo do typecheck, que corre em menos de um segundo e não escreve nada quando passa) |

E, dentro dos portões a cada corrida, as plantas da prova do `check:cartao` e as da K17.

### O que não mudou

Entre o commit das provas da UE1c (`42a368a3`) e a cabeça do código da passagem: 0 ficheiros em `ledger/claims/`, 0 nas séries, nos registos de travessia e na tabela dos nomes, 0 linhas das definições das medidas e das suas origens, 0 no brief, 0 no guião da aterragem e 0 na pasta do `acertos-l1.py`; e 0 commits no motor. Mudaram 20 ficheiros, com os nomes em `medidas-ue1d.json`.

### As capturas

Em `design/especime-v3/capturas/ue1-2026-09-29/ue1d/` e `capturas-ue1d.json`, nas 5 larguras, em português e em inglês: o cartão da sobrecarga no total nas 3 páginas onde aparece (30 capturas), o bloco «O enquadramento» do seu recibo da linha (10), e a cabeça do recibo de cada uma das 10 séries, com a definição (100); 140 capturas, com 0 problemas (a União e a ressalva com o texto da fonte em cada cartão e recibo da linha, a definição em cada recibo, a ressalva só no da sobrecarga no total, e nenhuma página a transbordar), as 6 plantas dos detetores, todas vistas, e 0 pedidos para fora.

### Os portões e os commits da passagem

Na cabeça `99b9f73a`, cada um no seu comando, pelo `portao-ue1d.sh`, com o código num ficheiro acabado de escrever em `portoes/ue1d/`: `npm run build` a 0 em 180 segundos, `npm run verify` a 0 em 797 segundos, `npm run typecheck` a 0 em 1 segundo; os registos com os caminhos da máquina trocados por marcas (`portoes/ue1d/caminhos-trocados.json`). Os 3 portões olharam antes de correr. A primeira corrida dos 3, na cabeça `de17f63e`, antes do quarto commit, deu 0, 0 e 0 (`portoes/ue1d-de17f63e/`); as 2 corridas esperaram ao todo 435 segundos por outra construção, todos no build da primeira, pelo verify do Codex.

Os 4 commits de código, cada um depois das conferências que tocou (10, todas a 0, em `entre-commits-ue1d.json`):

- `530d5edc` a média da União de volta ao cartão da sobrecarga no total, com a ressalva de uma fonte única, a K14 na forma nova e a K17 a contar as origens da primeira página (o estado sem a definição dos recibos construído à parte antes do commit);
- `165650cf` a definição declarada da medida no recibo de cada série;
- `de17f63e` o mapa do repositório (o `conferir-mapa.py` dá 138 citações no sítio, 0 longe e 0 por encontrar; antes da emenda dava 5 por encontrar, as linhas que a passagem mudou);
- `99b9f73a` o construtor da prova do `check:cartao` sem rebentar quando a declaração não tem a ressalva (antes dele, o `check:cartao` limpo a 0, as 2 plantas da declaração a morder com a queixa, e o mapa sem citações perdidas);
- e o commit das provas da passagem, o último.

### O custo da passagem

Do commit das provas da UE1c ao fim dos portões da passagem, 5 912 segundos. Os símbolos, lidos à mão do contador que o ambiente mostra ao agente (`custo-ue1d.json`): 2 349 730 na sessão ao fecho da passagem e 589 451 na passagem; o total que a ferramenta reporta ao lugar de direção é o que conta.

### O que ficou por fazer

- A entrada `ue1d` das revisões do inventário das frases está «por ler pelo lugar de direção antes de aterrar».
- A ressalva no recibo da própria linha da União e a origem da definição no recibo da série, se o lugar de direção as quiser (acima).
- O `acertos-l1.py`, que sai com 1 desde o RP1, é uma questão nova do lugar de direção.
- Das passagens anteriores continuam: as palavras das marcas `ep`, `d`, `b` e `u` como proposta, a ressalva na frase da faixa, `tests/` fora do typecheck e do `check:mortos`, e o brief do RP3 depois da aterragem.
