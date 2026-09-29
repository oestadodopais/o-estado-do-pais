# UE1 · onde Portugal fica entre os 27 · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 29.09.2026. O sítio: o ramo `ue1-2026-09-29`; o build, o verify e o typecheck correram na cabeça do código, `33ed14a0`, e o último commit do ramo é o da entrega destas provas, que só acrescenta ficheiros nesta pasta e na das capturas. O motor: o ramo `ue1-2026-09-29` do ResearchHub, cabeça `e394307`. Cada número deste relatório está num JSON desta pasta (`medidas.json`, escrito por `medir-ue1.mjs`, que lê os manifestos ao lado, cada medida com o comando e um conhecido-positivo), e o relatório passa o `conferir-relatorio.py`.*

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
