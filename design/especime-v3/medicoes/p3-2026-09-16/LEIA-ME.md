# O bloco P3, medido · «Os nomes das medidas, e a revisão de língua de tudo»

*16.09.2026, ramo `p3-2026-09-16`, sobre `796c9032`. Construtor e editor de língua: **Claude Opus 5**. É a cópia do relatório do bloco, no formato do §3 do brief (`design/observatorio/BRIEF-P3-os-nomes-e-a-lingua.md`). As tabelas das cadeias e dos nomes estão ao lado, em `cadeias-antes-depois.md`; as capturas em `design/especime-v3/capturas/p3-2026-09-16/`.*

## 1 · O mandato, item a item

| # | o que | a medida de aceitação | medido |
| --- | --- | --- | --- |
| 1 | Os nomes das medidas | 0 cartões com o título da fonte nas duas edições; a tabela completa | **feito.** 0 e 0. Antes: 82 cartões por edição (81 linhas distintas) encabeçavam-se com o `name` da fonte (16) ou com o `document.title` (66). Depois: 82 por edição com `data-nome="projeto"`, e o degrau do campo da fonte a zero. As 24 linhas que não se rendem como cartão ganham o nome por cima da sua aritmética, 24 por edição. A tabela dos 81 e a dos 24 estão em `cadeias-antes-depois.md`, §2 e §3 |
| 2 | As três datas saem das leituras breves e entram no recibo | as três cadeias a 0 nas dobras; F5 verde no recibo; a carta emendada | **feito.** «período de referência», «lido na fonte a» e «verificado a» nas dobras: 6 858 por edição antes, **0 e 0** depois. F5 mudou de lugar e mede **58 recibos** (as 29 linhas com leitura breve, nas duas edições) com as três datas cada; a planta P2 de `tests/dominio/pagina.mjs` mudou com ela e morde (9 de 9). `CARTA-DOS-CONTEUDOS.md` §1, regra 3, emendada com a data e a razão |
| 3 | «A casa» sai do texto do leitor | «a casa» a 0 nas páginas construídas fora de citações de fontes; a §1.110; a amarra verde | **feito.** 0 na superfície de 7 334 páginas, pela definição do portão novo. A §1.110 está escrita, com o carimbo do Método e o do Sobre, e o `ledger:check` é o primeiro passo do `build`, que saiu a 0 |
| 4 | A revisão de língua de todas as cadeias do leitor | a tabela completa das cadeias mudadas; nenhum decalque da lista à vista | **feito em parte, e a parte que falta está dita.** 39 cadeias de prosa mudadas, todas na tabela, com a razão de cada uma; nenhum decalque da lista à vista (o portão do item 5 prova-o). **O que não se fez:** as definições das medidas não passaram à forma da pergunta do leitor. A razão está no §5 |
| 5 | O portão das palavras proibidas | a célula verde na cabeça final e vermelha com a planta | **feito.** `check:voz` ganha a célula 11 com as 14 palavras da norma §1.3; a lista, a definição de «à vista» e as exceções por rota vivem numa cópia só (`scripts/voz-palavras.mjs`); a planta (`tests/voz/palavras-proibidas.mjs`, `npm run check:palavras`, dentro do `verify`) planta cada uma das 14 numa cópia de `dist/` e exige que o portão a veja |
| 6 | A dívida das réguas (I118, segunda parte, e I119) | todas as réguas do sítio verdes, com as plantas a morder; o que sair, dito | **feito em parte.** `tests/inicio/porta.mjs`: 52 de 52 células e **as três plantas que não mordiam passam a morder** (A15, A17, A11). `tests/inicio/mapa-navegacao.mjs`: 9 de 9 (a I119 fechada). **`tests/inicio/lista.mjs` e `tests/inicio/faixa.mjs` ficam por fazer**, e a razão está no §5 |
| 7 | As capturas e a tabela | completas | **feito.** 100 capturas (5 páginas × 2 edições × 5 larguras × antes e depois) e as três tabelas |
| 8 | As duas frases da regra dos nomes | as duas frases a 1 nas suas páginas, nas duas edições, e a 0 no resto do `dist/` | **feito.** A norma no Sobre entra como campo governado (`SOBRE[lang].nomes`, marca `data-sobre-nomes`) e o `gate:html` compara-a carácter a carácter; o direito de resposta entra na página das correções. As duas no inventário das frases, com a razão |

## 2 · Os commits, a cabeça e os três portões

Onze commits sobre `796c9032`, todos com os dois trailers, todos por caminhos explícitos:

| cabeça | o que |
| --- | --- |
| `e9247b45` | Os oitenta e um nomes das medidas, e os vinte e quatro das linhas derivadas |
| `6b40122f` | As três datas saem da dobra da leitura breve e vivem no recibo da linha |
| `2c047f3c` | «A casa» sai do Método e da política, e «limiar» com ela na entrada de fecho |
| `5cf47b31` | A revisão de língua das cadeias do leitor, e o inventário atrás dela |
| `f1e65f8a` | O portão das palavras proibidas, com a planta que o derruba |
| `f107b77f` | As duas frases da regra dos nomes, e a §1.110 com os dois carimbos |
| `93315923` | A dívida das réguas: as três plantas que não mordiam, e a N3 da busca |
| `223957dd` | A quarta «peça» declarada na L3, e o tipo da fonte do nome com o degrau novo |
| `77526b22` | As três importações que ficaram sem uso quando as datas saíram das dobras |
| `71a7f5b8` | A régua do índice lê a terceira lista dos nomes do projeto |
| `37912148` | «Toque num» volta a morder: a fronteira da palavra estava no sítio errado |
| `0a0da466` | As cem capturas, as três tabelas e o relatório do bloco |
| (o commit deste ficheiro) | O relatório com a cabeça final, os códigos dos portões e o custo. **É a cabeça final**, e não traz o seu próprio resumo porque um commit não se pode nomear a si próprio: o resumo dele está na mensagem que o lugar de direção recebe e no `git log` do ramo |

**Os três portões, cada comando no seu, com o código lido de um ficheiro. Corridos duas vezes: sobre `37912148`, que é a cabeça do código, e sobre `0a0da466`, que é a cabeça com as capturas e as tabelas. As duas vezes:**

```
npm run build     → 0   (o carimbo do dist/ é deste)
npm run verify    → 0
npm run typecheck → 0
```

Os códigos ficaram em `n-build.code`, `n-verify.code` e `n-typecheck.code` (a corrida sobre `37912148`) e em `f-build.code`, `f-verify.code` e `f-typecheck.code` (a corrida sobre `0a0da466`), com as saídas ao lado, no directório de trabalho da sessão; a cópia dos três códigos está em `portoes.txt`. **O `dist/` carimbado é o do `npm run build` da segunda corrida.**

**E as réguas que não são portões, sobre a mesma árvore:** `tests/inicio/porta.mjs --vermelhos` a 0 (52 de 52 células e as 20 plantas a morder, `porta-plantas.txt`); `tests/inicio/mapa-navegacao.mjs` a 0 (9 de 9, `mapa-navegacao.txt`); `tests/livro/indice.mjs --navegador` a 0 (`indice.txt`); `tests/dominio/pagina.mjs` a 0 (9 de 9 plantas); `tests/voz/palavras-proibidas.mjs` a 0 (14 de 14 plantas). `tests/inicio/lista.mjs` e `tests/inicio/faixa.mjs` ficam a 1, com os números e a razão no §5.

## 3 · O custo

**Tempo de parede:** das 08:29 às 12:20 UTC de 16.09.2026, cerca de **3 h 50 m**, dos quais perto de duas horas em construções e portões (cada `npm run build` leva cerca de seis minutos, cada `npm run verify` cerca de sete, e as réguas com navegador entre dez e treze cada).

**Símbolos:** cerca de **610 mil**, contados pelo orçamento da sessão da ferramenta (de 15 000 000 no início a cerca de 14 390 000 no fim). Não é a mesma conta que os relatórios anteriores fazem com o contador do modelo, e por isso diz-se de onde vem.

**Três coisas que os portões apanharam neste bloco, e que valem por si:** o `gate:html` recusou «Portugal 2030» como nome de uma medida, porque traz um algarismo que não resolve em linha nenhuma; a amarra das decisões apanhou a citação da `IDENTIDADE.md` a envelhecer no mesmo instante em que o Método mudou; e a planta das palavras apanhou uma fronteira de palavra mal posta na expressão de «toque em», que deixava passar «Toque num cartão».

## 4 · O que se mediu, e com que régua

`design/especime-v3/medicoes/p3-2026-09-16/medir-p3.mjs` conta sobre o `dist/` e não decide nada; os portões que fecham a construção são o `check:voz` (as palavras e os nomes declarados), o `check:formas` (as três datas) e o `gate:html`. A contagem das palavras proibidas do relatório **é a do portão**, e não uma segunda cópia da lista: a régua importa `scripts/voz-palavras.mjs`.

## 5 · O que não se fez, e porquê

**As definições das medidas não passaram à forma da pergunta do leitor** (item 4, segunda metade: «quando a origem selada o permitir sem mudar o sentido»). O brief admite-o («onde não permitir ficam como estão e o relatório diz quais»), e a resposta é **nenhuma passou**, por uma razão que vale para todas: cada definição de `DEFINICOES_DAS_MEDIDAS` e de `DEFINICAO_DOS_PAINEIS` declara a origem de que é paráfrase, com o documento, o endereço, a data de leitura e o excerto literal (`ORIGENS_DAS_DEFINICOES`), e `conferirOrigensDeclaradas()` fecha a construção à primeira que não a declare. Reescrever uma delas em forma de pergunta é reescrever a paráfrase de um documento fixado, e a única maneira honesta de o fazer é reler o excerto ao lado da frase nova, medida a medida, e dizer se o sentido mudou. Isso é uma passagem com a origem na mão, e não uma passagem de língua: entra no bloco que voltar às origens seladas. **As 21 definições ficam como estavam**, e nenhuma delas mudou uma letra neste bloco (a única exceção é a do painel do Procedimento, onde só a palavra «limiar» mudou, pela decisão do diretor de 15.09, e a frase é a mesma).

**`tests/inicio/lista.mjs` e `tests/inicio/faixa.mjs` ficam por fazer** (item 6). Medido hoje, na cabeça final: **80 de 94** células verdes na `lista.mjs` e **50 de 80** na `faixa.mjs`. As células vermelhas são de cinco famílias, e nenhuma é uma medida que este bloco tenha partido: a legenda do mapa na banda da cabeça (L2, L3, L11, L13, a 1 280 e a 1 440), o nome de cada painel da primeira página (L8), a faixa como lista e o seu encaixe (F1, F5, F6), a gaveta dos nomes (F10a, F10b) e a herança da cabeça pelas camadas (F12). Todas medem mobília que os blocos F1.1b, F1.10, F1.12, F1.13 e P1 tiraram da primeira página ou mudaram de sítio, e acertá-las é decidir, célula a célula, o que cada uma passa a medir hoje. **Isso lê-se em capturas e não em código**, e é um bloco próprio: fazê-lo à pressa dentro de um bloco de palavras seria reescrever réguas sem ler o que elas devem passar a medir, que é a maneira de as enfraquecer sem dar por isso. A I118 fica aberta com estes números.

## 6 · O que fica para o lugar de direção

1. **A §1.110 toca no texto da constituição, e é a única parte deste bloco que o faz.** A `IDENTIDADE.md` §2 citava, palavra por palavra, a frase de fecho do Método sobre a cor. Tirar «limiar» do Método obrigou a atualizar a citação, e a amarra apanhou a diferença na mesma construção, que é o que ela existe para fazer. A regra da constituição não muda; muda a palavra com que ela se diz ao leitor. **Isto é para reler antes de aterrar.**
2. **A entrada da §1.110 não tem a forma que o brief pediu.** O brief pedia `**Afecta:** metodo, sobre` com `**Texto:**` em duas linhas. A amarra lê um só `**Texto:**`, separado por «·», e o `**Afecta:**` separa-se por «·» e não por vírgula. A entrada está na forma que a amarra aceita, e diz porquê.
3. **Nenhum dos 81 tem nome oficial confirmado**, e por isso nenhum deles ganhou um nome oficial no recibo. O `src/data/enquadramento/nomes.json` confirma **17 medidas** como `exata`, de 32, e são todas do quadro institucional europeu; das três dos 81 que lá aparecem, `licencas-de-construcao-2025` está marcada `proxima` (o INE conta edifícios e a medida é de área licenciada por mil habitantes: não é a mesma medida) e as outras duas não têm correspondência nenhuma. A frase do brief, «já rende em 26», bate certo: as 17 linhas rendem **26 nomes oficiais por edição** no recibo (14 com o do INE e o da PORDATA, três com um só), que são 52 ocorrências nas duas edições; as outras 10 das 62 que o `dist/` tem são os cinco cartões por edição que, por não terem nome do projeto, se encabeçam com o nome oficial.
4. **O portão das palavras tem cinco exceções por rota, cada uma com a razão escrita**, e o lugar de direção deve lê-las: os documentos dos estudos e as suas transcrições (que são documentos fixados, não prosa de interface) e o livro-razão, e este só para «conferido a» e «lido na fonte a», que é o lugar que a norma §2.1 lhes dá.
5. **A I118 fica aberta com os números de hoje** (80 de 94 na `lista.mjs` e 50 de 80 na `faixa.mjs`), e a I119 fecha. A entrada da I119 ainda não está escrita em `design/especime-v3/ISSUES.md`: o rascunho ficou no directório de trabalho da sessão de 16.09 de madrugada, e escrevê-la é do lugar de direção.
6. **O índice do livro-razão melhorou sem que este bloco lhe tocasse.** Os 81 nomes sobem a escada de três degraus do índice: por edição, 27 entradas chamavam-se pelo nome do cartão e passam a 108; 18 pelo rótulo da fonte passam a 3; 137 pelo TÍTULO DO DOCUMENTO passam a 71. **As 71 que ficam são a dívida do nome que resta**, e são de linhas que nenhum cartão rende: as dos concelhos e as do arquivo. Quando o motor lhes der rótulo, elas sobem sozinhas.
7. **Uma exceção do ficheiro dos marcadores da voz ficou por exercer**, «verificado a», porque a cadeia que a exercia saiu das dobras com o item 2. O `check:voz` di-lo na saída, em cinzento, e não fecha a construção.
