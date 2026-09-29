# UE1 · onde Portugal fica entre os 27 · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 29.09.2026. O relatório tem duas partes. A do UE1, até «O que ficou por fazer»: o build, o verify e o typecheck correram na cabeça do código `33ed14a0`, e o commit das provas dela é `0f75298f`. A da passagem de correção UE1b, no fim: os três portões correram na cabeça do código `c9859d31`, e o último commit do ramo é o das provas dela, que só acrescenta e muda ficheiros nesta pasta e na das capturas. O sítio: o ramo `ue1-2026-09-29`. O motor: o ramo `ue1-2026-09-29` do ResearchHub, cabeça `e394307`, que a UE1b não mudou. Cada número deste relatório está num JSON desta pasta (`medidas.json`, escrito por `medir-ue1.mjs`, e `medidas-ue1b.json`, escrito por `medir-ue1b.mjs`, que leem os manifestos ao lado, cada medida com o comando e um conhecido-positivo), e o relatório passa o `conferir-relatorio.py`.*

## O que o leitor vê

No cartão de cada uma das 10 medidas que os blocos da primeira página comparam com a União (a desigualdade, a dívida pública, a inflação harmonizada, os preços da habitação, a sobrecarga do custo da habitação, a pobreza ou exclusão, o desemprego, o desemprego de longa duração, a taxa de emprego e a sobrecarga dos inquilinos a preço de mercado), na página dos temas e nas páginas das entradas, em português e em inglês, há por baixo do número e da régua uma faixa: uma linha do valor mais baixo ao mais alto dos 27 países, uma marca por país, a de Portugal maior e a tinta, a da média da União como um traço, sem cor; o país mais baixo e o mais alto com o nome e o valor, e a marca da fonte quando o ponto a leva («Hungria 18,3 p» nos preços da habitação); a frase do lugar de Portugal; e a porta «Todos os países» para o recibo da série, com os pontos numa tabela. Na pobreza a frase diz: «Portugal (18,6) está em 15.º lugar, do mais alto para o mais baixo, a par de outros países com o mesmo valor (Áustria e Suécia).» As capturas estão em `design/especime-v3/capturas/ue1-2026-09-29/`.

## O teste de aceitação do §2, parte a parte

- **A faixa no cartão de cada uma das 10 medidas, nas duas edições e nas cinco larguras.** O `dist/` tem 40 faixas (20 nas páginas dos temas, 20 nas das entradas, 0 na primeira página), e a F19 e a K18 conferem as 40. `faixas-ue1.mjs` mediu cada faixa nas 12 páginas que as levam e nas 5 larguras, de 390 a 1 600: 200 medições, as 10 medidas em cada edição, 0 problemas (nenhum rótulo sobre outro, nenhum fora do cartão, nenhum cartão nem página a transbordar, 28 marcas em cada faixa), com o detetor a ver as suas 6 plantas antes de medir.
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
- **A marca da fonte diz-se por palavras.** Nas pontas da faixa, um ponto com marca mostra-a como o sítio mostra o provisório e o estimado nos cartões: o valor e, entre parênteses, as palavras, na mesma letra pequena e cinzenta. Hoje há 2 pontas com marca: a Hungria nos preços da habitação («Hungria 18,3 (dado provisório)», «(provisional data)» na edição inglesa) e a Espanha na taxa de desemprego («Espanha 10,5 (definição diferente)», «(definition differs)»). Nas 12 páginas que levam faixas não fica nenhuma letra crua (0).
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
