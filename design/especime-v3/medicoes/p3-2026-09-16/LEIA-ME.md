# O bloco P3, medido · «Os nomes das medidas, e a revisão de língua de tudo»

*16.09.2026, ramo `p3-2026-09-16`, sobre `796c9032` e rebaseado sobre `54170951`. Construtor e editor de língua: **Claude Opus 5**. É a cópia do relatório do bloco, no formato do §3 do brief (`design/observatorio/BRIEF-P3-os-nomes-e-a-lingua.md`). As tabelas das cadeias e dos nomes estão ao lado, em `cadeias-antes-depois.md`; as capturas em `design/especime-v3/capturas/p3-2026-09-16/`.*

*O relatório tem duas camadas, e a segunda está no §7: o lote da manhã, e a **passagem de correção do fim do dia**, feita depois da leitura a frio do Codex (`2026-09-16-codex-leitura-p3.md`) e pela triagem do lugar de direção. Onde uma linha mudou com a passagem, a linha diz o texto de hoje e o §7 diz o que mudou e porquê.*

## 1 · O mandato, item a item

| # | o que | a medida de aceitação | medido |
| --- | --- | --- | --- |
| 1 | Os nomes das medidas | 0 cartões com o título da fonte nas duas edições; a tabela completa | **feito.** 0 e 0. Antes: 82 cartões por edição (81 linhas distintas) encabeçavam-se com o `name` da fonte (16) ou com o `document.title` (66). Depois: 82 por edição com `data-nome="projeto"`, e o degrau do campo da fonte a zero. As 24 linhas que não se rendem como cartão ganham o nome por cima da sua aritmética, 24 por edição. A tabela dos 81 e a dos 24 estão em `cadeias-antes-depois.md`, §2 e §3 |
| 2 | As três datas saem das leituras breves e entram no recibo | as três cadeias a 0 nas dobras; F5 verde no recibo; a carta emendada | **feito.** «período de referência», «lido na fonte a» e «verificado a» nas dobras: 6 858 por edição antes, **0 e 0** depois. F5 mudou de lugar e mede **58 recibos** (as 29 linhas com leitura breve, nas duas edições) com as três datas cada; a planta P2 de `tests/dominio/pagina.mjs` mudou com ela e morde (9 de 9). `CARTA-DOS-CONTEUDOS.md` §1, regra 3, emendada com a data e a razão |
| 3 | «A casa» sai do texto do leitor | «a casa» a 0 nas páginas construídas fora de citações de fontes; a §1.110; a amarra verde | **feito.** 0 na superfície de 7 334 páginas, pela definição do portão novo. A §1.110 está escrita, com o carimbo do Método e o do Sobre, e o `ledger:check` é o primeiro passo do `build`, que saiu a 0 |
| 4 | A revisão de língua de todas as cadeias do leitor | a tabela completa das cadeias mudadas; nenhum decalque da lista à vista | **feito em parte, e a parte que falta está dita.** 39 cadeias de prosa mudadas, todas na tabela, com a razão de cada uma; nenhum decalque da lista à vista (o portão do item 5 prova-o). **O que não se fez:** as definições das medidas não passaram à forma da pergunta do leitor. A razão está no §5 |
| 5 | O portão das palavras proibidas | a célula verde na cabeça final e vermelha com a planta | **feito.** `check:voz` ganha a célula 11 com as 14 palavras da norma §1.3; a lista, a definição de «à vista» e as exceções por rota vivem numa cópia só (`scripts/voz-palavras.mjs`); a planta (`tests/voz/palavras-proibidas.mjs`, `npm run check:palavras`, dentro do `verify`) planta cada uma das 14 numa cópia de `dist/` e exige que o portão a veja |
| 6 | A dívida das réguas (I118, segunda parte, e I119) | todas as réguas do sítio verdes, com as plantas a morder; o que sair, dito | **feito, com a passagem de correção do fim do dia** (§7, achado 13). `tests/inicio/porta.mjs`: 52 de 52 células e **as três plantas que não mordiam passam a morder** (A15, A17, A11). `tests/inicio/mapa-navegacao.mjs`: 9 de 9 (a I119 fechada). `tests/inicio/lista.mjs`: **90 de 90** (eram 80 de 94; a L3 e a L8 saíram com a razão escrita). `tests/inicio/faixa.mjs`: **66 de 66** (eram 50 de 80; a F10a saiu com a razão escrita). O que saiu e o que se acertou, célula a célula, está no §7 e na I118 |
| 7 | As capturas e a tabela | completas | **feito.** 100 capturas (5 páginas × 2 edições × 5 larguras × antes e depois) e as três tabelas. As 50 capturas «depois» foram refeitas ao fim do dia, com o mesmo guião, sobre a cabeça da passagem de correção |
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

**E uma segunda régua entrou com a passagem de correção** (§7, achado 5): `nomes-oficiais.mjs` conta os nomes oficiais sobre o `dist/` e sobre o `src/data/enquadramento/nomes.json`, e confere que cada um vem de uma linha marcada `exata` e é, carácter a carácter, um dos nomes que ela declara. Também não decide nada e também não fecha nenhuma construção: existe para que a conta do relatório deixe de ser uma frase escrita à mão.

## 5 · O que não se fez, e porquê

**As definições das medidas não passaram à forma da pergunta do leitor** (item 4, segunda metade: «quando a origem selada o permitir sem mudar o sentido»). O brief admite-o («onde não permitir ficam como estão e o relatório diz quais»), e a resposta é **nenhuma passou**, por uma razão que vale para todas: cada definição de `DEFINICOES_DAS_MEDIDAS` e de `DEFINICAO_DOS_PAINEIS` declara a origem de que é paráfrase, com o documento, o endereço, a data de leitura e o excerto literal (`ORIGENS_DAS_DEFINICOES`), e `conferirOrigensDeclaradas()` fecha a construção à primeira que não a declare. Reescrever uma delas em forma de pergunta é reescrever a paráfrase de um documento fixado, e a única maneira honesta de o fazer é reler o excerto ao lado da frase nova, medida a medida, e dizer se o sentido mudou. Isso é uma passagem com a origem na mão, e não uma passagem de língua: entra no bloco que voltar às origens seladas. **As 21 definições ficam como estavam**, e nenhuma delas mudou uma letra neste bloco (a única exceção é a do painel do Procedimento, onde só a palavra «limiar» mudou, pela decisão do diretor de 15.09, e a frase é a mesma).

~~**`tests/inicio/lista.mjs` e `tests/inicio/faixa.mjs` ficam por fazer**~~ (item 6). **Feito na passagem de correção do fim do dia** (§7, achado 13 da leitura a frio do Codex). O que este parágrafo dizia de manhã continua a ser verdade sobre o diagnóstico, e por isso fica: as 44 células vermelhas eram de cinco famílias, nenhuma delas uma medida que este bloco tenha partido, e todas mediam mobília que os blocos F1.1b, F1.10, F1.12, F1.13 e P1 tiraram da primeira página ou mudaram de sítio. O que mudou foi a decisão: a triagem do lugar de direção mandou retirar cada célula que mede mobília que saiu, com a razão escrita, e acertar as outras. Está feito, célula a célula, no §7.

## 6 · O que fica para o lugar de direção

1. **A §1.110 toca no texto da constituição, e é a única parte deste bloco que o faz.** A `IDENTIDADE.md` §2 citava, palavra por palavra, a frase de fecho do Método sobre a cor. Tirar «limiar» do Método obrigou a atualizar a citação, e a amarra apanhou a diferença na mesma construção, que é o que ela existe para fazer. A regra da constituição não muda; muda a palavra com que ela se diz ao leitor. **Isto é para reler antes de aterrar.**
2. **A entrada da §1.110 não tem a forma que o brief pediu.** O brief pedia `**Afecta:** metodo, sobre` com `**Texto:**` em duas linhas. A amarra lê um só `**Texto:**`, separado por «·», e o `**Afecta:**` separa-se por «·» e não por vírgula. A entrada está na forma que a amarra aceita, e diz porquê.
3. **Nenhum dos 81 tem nome oficial confirmado**, e por isso nenhum deles ganhou um nome oficial no recibo. O `src/data/enquadramento/nomes.json` confirma **17 medidas** como `exata`, de 32, e são todas do quadro institucional europeu; das três dos 81 que lá aparecem, `licencas-de-construcao-2025` está marcada `proxima` (o INE conta edifícios e a medida é de área licenciada por mil habitantes: não é a mesma medida) e as outras duas não têm correspondência nenhuma. A frase do brief, «já rende em 26», bate certo: as 17 linhas rendem **26 nomes oficiais por edição** no recibo, e a repartição é **9 linhas com o nome do INE e o da PORDATA e 8 com um só** (9 × 2 + 8 = 26), que são 52 ocorrências nas duas edições; as outras 10 das 62 que o `dist/` tem são os cinco cartões por edição que, por não terem nome do projeto, se encabeçam com o nome oficial. **A primeira redação deste parágrafo dizia «14 com o do INE e o da PORDATA, três com um só»**, que dá 31 e não 26, e a leitura a frio do Codex apanhou a contradição sem poder decidi-la, porque o `nomes.json` não ia no pacote (achado 5). A reconta faz-se agora por código, sobre o `dist/` e sobre o `nomes.json`, em `nomes-oficiais.mjs`, com a saída ao lado em `nomes-oficiais.txt`: **cada um dos 26 vem de uma linha marcada `exata` e é, carácter a carácter, um dos nomes que essa linha declara**, e a régua sai a 0.
4. ~~**O portão das palavras tem cinco exceções por rota, cada uma com a razão escrita**~~ **Já não são exceções que saltam uma página** (§7, achado 10): nenhuma rota é saltada, e o que era exceção passou a ser uma superfície ESTREITADA ao que é prosa deste projeto. O parágrafo de manhã dizia assim:, e o lugar de direção deve lê-las: os documentos dos estudos e as suas transcrições (que são documentos fixados, não prosa de interface) e o livro-razão, e este só para «conferido a» e «lido na fonte a», que é o lugar que a norma §2.1 lhes dá.
5. **A I118 fecha na segunda parte** (as réguas), e a I119 fecha também. Na cabeça final: `lista.mjs` **90 de 90** e `faixa.mjs` **66 de 66**, com as plantas a morder; o que saiu e o que se acertou está no §7 e escrito na I118. **A primeira parte da I118 (o alcance das folhas de estilo) continua aberta**, e não é deste bloco. A entrada da I119 ainda não está escrita em `design/especime-v3/ISSUES.md`: o rascunho ficou no directório de trabalho da sessão de 16.09 de madrugada, e escrevê-la é do lugar de direção. **E fica uma decisão do diretor**, nova: a camada da região não tem faixa nem instrumento na cabeça, e a F12 passou a exigir-lhe só o rótulo declarado e a manchete com número selado. Se a região deve herdar a cabeça inteira, como o país e o concelho, é dele.
6. **O índice do livro-razão melhorou sem que este bloco lhe tocasse.** Os 81 nomes sobem a escada de três degraus do índice: por edição, 27 entradas chamavam-se pelo nome do cartão e passam a 108; 18 pelo rótulo da fonte passam a 3; 137 pelo TÍTULO DO DOCUMENTO passam a 71. **As 71 que ficam são a dívida do nome que resta**, e são de linhas que nenhum cartão rende: as dos concelhos e as do arquivo. Quando o motor lhes der rótulo, elas sobem sozinhas.
7. **Uma exceção do ficheiro dos marcadores da voz ficou por exercer**, «verificado a», porque a cadeia que a exercia saiu das dobras com o item 2. O `check:voz` di-lo na saída, em cinzento, e não fecha a construção.

---

## 7 · A passagem de correção do fim do dia (16.09.2026)

*Depois do lote da manhã, o Codex (`gpt-5.6-sol`, xhigh, só leitura) leu o bloco a frio, com cinco estragos plantados, e apanhou os cinco. O lugar de direção triou os 23 achados e mandou corrigir onze. Esta secção diz o que cada um passou a ser. O construtor é o mesmo, o Claude Opus 5, e a família que construiu continua a não verificar o que construiu: esta passagem responde a uma leitura de fora, e o pacote seguinte volta a sair para uma leitura a frio.*

| achado | o que a leitura apanhou | o que se fez |
| --- | --- | --- |
| 1, 2, 3 | as plantas W1, W5 e W4 | apanhadas; nada a corrigir |
| 4 | a página das correções dizia «no motor de investigação desta casa», e o portão das palavras não a via | a razão da correção em `ledger/claims/estudos-evora-publicados.yml` passa a «deste projeto» (e o inglês a «this project's research engine»), e o portão deixa de tirar da superfície a prosa das correções: ficam de fora os quatro campos de terceiros (`old_value`, `new_value`, `field`, `id`) e entram os três que este projeto escreve (`reason`, `kind`, `date`). Medido antes da correção da razão: o portão passou a ver «a casa» nas duas páginas onde ela se rendia |
| 5 | a conta dos nomes oficiais não fechava (31 contra 26), e o `nomes.json` não ia no pacote | recontado por código sobre o `dist/` e sobre o `nomes.json`: **26 por edição no recibo**, de 17 linhas, **9 com os dois nomes e 8 com um só** (9 × 2 + 8 = 26), mais 5 cartões por edição sem nome do projeto, que dá 31 por edição e 62 nas duas. A reconta é agora uma régua, `nomes-oficiais.mjs`, com a saída ao lado, e confere também que **cada nome oficial rendido vem de uma linha marcada `exata`** e é, carácter a carácter, um dos nomes que ela declara: 0 problemas em 52 ocorrências |
| 6, 7, 8 | 72 dos 105 nomes fora da regra das duas a cinco palavras; nomes que não dizem o que a medida mede; jargão da fonte; ingleses pouco idiomáticos | **a regra emendou-se no próprio brief, datada** (§2b): um nome tem as palavras que a medida pede, o menos possível; diz o que a medida mede; os partidos e as siglas que a imprensa usa como palavras correntes escrevem-se como ela as escreve (PS, CDU, AD, Chega, PIB, PRR); o jargão da fonte não entra; nenhum algarismo. Relidos os 105 um a um com a regra emendada, **46 mudaram**: a tabela está no §7.1 |
| 9 | frases reescritas que um jornal não imprimiria | sete corrigidas, com os ingleses refeitos do português, e a regra dos nomes do Sobre refeita inteira em inglês. Duas caem em texto governado, e a §1.110 leva os carimbos novos: `metodo 102afd5db461 → 699221bacd9d`, `sobre 6382f64d5183 → 97076ad446f0`. As duas frases que a `IDENTIDADE.md` cita de um texto governado não mudaram, e a amarra confirma-o |
| 10 | o portão das palavras não lia atributos à vista, tirava o corpo das dobras abertas e saltava quatro rotas de estudo inteiras | a superfície passa a levar `title`, `aria-label`, `alt` e `placeholder` e o corpo de um `<details open>`; **nenhuma exceção salta uma página**: a do documento de um estudo mantém só a faixa deste projeto, a da transcrição retira o `<article data-registo-edicao>` e mede o resto. **Quatro plantas novas**, uma por buraco, e as duas dos estudos plantam também do outro lado da fronteira e exigem que o portão NÃO as veja: **18 de 18 plantas vistas**, 0 achados em repouso em **7 358** páginas (eram 7 334) |
| 11 | o F5 tirava os alvos da declaração, e qualquer data de verificação satisfazia «a última» | os alvos passam a ler-se do `dist/`, por `data-leitura`, que a página do domínio passou a levar; a declaração serve o controlo no outro sentido. **De 29 linhas e 58 recibos para 2 493 linhas e 4 370 recibos**, com as 308 derivadas de fora com a razão escrita. A data mostrada tem de ser a mais recente das `verifications`, escolhida por `ultimaConferencia()`, e a planta P2 passa a tirar só essa: 9 de 9 plantas mordem |
| 12 | o pacote das cadeias não via os literais dos `.astro` | a extração passa a andar **todos os 127 `.astro` debaixo de `src/`**, com o âmbito declarado na tabela. São **31 literais**, e **nenhum mudou neste bloco**; lidos um a um com a pergunta da norma §5.2, nenhum falhou. Os dois pacotes sobem de 2 907 e 3 117 para 2 938 e 3 148, com as mesmas 249 diferenças |
| 13 | 44 células vermelhas em `lista.mjs` (14) e `faixa.mjs` (30) | cada uma retirada com a razão escrita ou acertada ao que a página é hoje: **`lista.mjs` 90 de 90** e **`faixa.mjs` 66 de 66**. O detalhe está no §7.2 e na I118 |
| 14 | as capturas e os registos completos não estavam no pacote | do pacote; o pacote seguinte leva-os |
| 15 | três contradições de contagem | a conta dos commits refez-se do `git log` (§2), e o comentário das linhas derivadas passou de «as quatro cujo único título de documento é o marcador» a «as três», que é o que a tabela já dizia |
| 16 | os custos não têm registo no pacote | aceite: a conta vem da ferramenta |

**A leitura a frio aterrou no repositório** com esta passagem, em `design/especime-v3/critica/2026-09-16-codex-leitura-p3.md` (e o registo das cinco plantas ao lado, em `.plantas.json`), porque é a ela que a §1.110 do `DECISIONS.md` e a entrada `p3` do `REVISOES-DO-INVENTARIO.md` se referem: uma referência a um ficheiro que não está no repositório é uma referência que ninguém pode seguir. A entrada `p3` das revisões passa de «por ler» ao nome do ficheiro, e de 36 linhas para 39 (13 novas, 29 reclassificadas para `retirada`).

### 7.1 · Os 46 nomes que mudaram nesta passagem

*Antes é o nome que o lote da manhã escreveu; depois é o de agora. Os outros 59 dos 105 foram relidos com a regra emendada e não mudaram.*

| linha | antes (pt) | depois (pt) | antes (en) | depois (en) |
| --- | --- | --- | --- | --- |
| `penalizacao-antecipacao-um-ano-neutra` | Corte atuarialmente neutro na pensão | Corte na pensão por um ano de antecipação, sem custo para o sistema | Actuarially neutral pension cut | Pension cut for one year of early retirement, at no cost to the system |
| `penalizacao-antecipacao-um-ano-sem-factor-2026` | Corte na pensão sem o fator de sustentabilidade | Corte na pensão por um ano de antecipação, sem o fator de sustentabilidade | Pension cut without the sustainability factor | Pension cut for one year of early retirement, without the sustainability factor |
| `penalizacao-antecipacao-um-ano-com-factor-2026` | Corte na pensão com o fator de sustentabilidade | Corte na pensão por um ano de antecipação, com o fator de sustentabilidade | Pension cut with the sustainability factor | Pension cut for one year of early retirement, with the sustainability factor |
| `portugal-concentracao-vab4-2024` | Peso das quatro maiores empresas em Portugal | Peso das quatro maiores empresas no valor acrescentado, em Portugal | Share of the four largest companies in Portugal | Share of the four largest companies in gross value added, in Portugal |
| `evora-concentracao-vab4-2024` | Peso das quatro maiores empresas em Évora | Peso das quatro maiores empresas no valor acrescentado, em Évora | Share of the four largest companies in Évora | Share of the four largest companies in gross value added, in Évora |
| `evora-orcamento-2025` | Orçamento do município de Évora | Orçamento do município de Évora | Budget of Évora's municipality | Budget of the municipality of Évora |
| `evora-receita-cobrada-2025` | Receita cobrada pelo município de Évora | Receita cobrada pelo município de Évora | Revenue collected by Évora's municipality | Revenue collected by the municipality of Évora |
| `evora-despesa-paga-2025` | Despesa paga pelo município de Évora | Despesa paga pelo município de Évora | Spending paid by Évora's municipality | Spending paid by the municipality of Évora |
| `evora-pagamentos-em-atraso-2025` | Pagamentos em atraso do município de Évora | Pagamentos em atraso do município de Évora | Payments in arrears of Évora's municipality | Payments in arrears of the municipality of Évora |
| `evora-divida-total-2017` | Dívida total do município de Évora | Dívida total do município de Évora | Total debt of Évora's municipality | Total debt of the municipality of Évora |
| `evora-divida-total-2021` | Dívida total do município de Évora | Dívida total do município de Évora | Total debt of Évora's municipality | Total debt of the municipality of Évora |
| `evora-divida-total-2024` | Dívida total do município de Évora | Dívida total do município de Évora | Total debt of Évora's municipality | Total debt of the municipality of Évora |
| `evora-divida-total-2025` | Dívida total do município de Évora | Dívida total do município de Évora | Total debt of Évora's municipality | Total debt of the municipality of Évora |
| `evora-divida-dgal-2014` | Endividamento total do município de Évora | Endividamento total do município de Évora | Total indebtedness of Évora's municipality | Total indebtedness of the municipality of Évora |
| `evora-divida-dgal-2017` | Endividamento total do município de Évora | Endividamento total do município de Évora | Total indebtedness of Évora's municipality | Total indebtedness of the municipality of Évora |
| `evora-divida-dgal-2021` | Endividamento total do município de Évora | Endividamento total do município de Évora | Total indebtedness of Évora's municipality | Total indebtedness of the municipality of Évora |
| `evora-divida-dgal-2024` | Endividamento total do município de Évora | Endividamento total do município de Évora | Total indebtedness of Évora's municipality | Total indebtedness of the municipality of Évora |
| `evora-divida-31-10-2013` | Dívida registada no início do mandato | Dívida registada no início do mandato | Debt recorded at the start of the mandate | Debt recorded at the start of the term |
| `evora-divida-inicio-mandato-reexpressa` | Dívida do início do mandato, reexpressa | Dívida do início do mandato, reexpressa | Debt at the start of the mandate, restated | Debt at the start of the term, restated |
| `evora-margem-endividamento-2025` | Margem até ao limite da dívida | Margem até ao limite da dívida | Room left up to the debt limit | Headroom up to the debt limit |
| `evora-prr-aprovado-2026` | Dinheiro aprovado do Plano de Recuperação | Verbas do PRR aprovadas para Évora | Money approved under the Recovery Plan | PRR funds approved for Évora |
| `evora-prr-pago-2026` | Dinheiro pago do Plano de Recuperação | Verbas do PRR pagas em Évora | Money paid under the Recovery Plan | PRR funds paid in Évora |
| `evora-prr-vencido-aprovado-2026` | Dinheiro aprovado em projetos com prazo ultrapassado | Verbas aprovadas em projetos fora de prazo | Money approved on projects past their deadline | Approved funds in projects past their deadline |
| `evora-prr-municipio-contratado` | Dinheiro contratado pelo município de Évora | Verbas do PRR contratadas pelo município de Évora | Money contracted by Évora's municipality | PRR funds contracted by the municipality of Évora |
| `evora-prr-universidade-contratado` | Dinheiro contratado pela Universidade de Évora | Verbas do PRR contratadas pela Universidade de Évora | Money contracted by the University of Évora | PRR funds contracted by the University of Évora |
| `evora-camara-lugares` | Lugares na câmara municipal de Évora | Lugares na câmara municipal de Évora | Seats on Évora's municipal council | Seats on the municipal council of Évora |
| `evora-executivo-2025-ps` | Lugares do PS no executivo de Évora | Lugares do PS no executivo de Évora | PS seats on Évora's executive | PS seats on the executive of Évora |
| `evora-executivo-2025-ad` | Lugares da AD no executivo de Évora | Lugares da AD no executivo de Évora | AD seats on Évora's executive | AD seats on the executive of Évora |
| `evora-executivo-2025-cdu` | Lugares da CDU no executivo de Évora | Lugares da CDU no executivo de Évora | CDU seats on Évora's executive | CDU seats on the executive of Évora |
| `evora-executivo-2025-chega` | Lugares do Chega no executivo de Évora | Lugares do Chega no executivo de Évora | Chega seats on Évora's executive | Chega seats on the executive of Évora |
| `distancia-portugal-ue27-2024` | Distância de Portugal à média europeia | Distância do PIB por habitante à média europeia, em Portugal | Gap between Portugal and the European average | Gap between GDP per inhabitant and the European average, in Portugal |
| `distancia-norte-ue27-2024` | Distância do Norte à média europeia | Distância do PIB por habitante à média europeia, no Norte | Gap between the Norte region and the European average | Gap between GDP per inhabitant and the European average, in the Norte region |
| `distancia-centro-ue27-2024` | Distância do Centro à média europeia | Distância do PIB por habitante à média europeia, no Centro | Gap between the Centro region and the European average | Gap between GDP per inhabitant and the European average, in the Centro region |
| `distancia-grande-lisboa-ue27-2024` | Distância da Grande Lisboa à média europeia | Distância do PIB por habitante à média europeia, na Grande Lisboa | Gap between Greater Lisbon and the European average | Gap between GDP per inhabitant and the European average, in Greater Lisbon |
| `distancia-peninsula-de-setubal-ue27-2024` | Distância da Península de Setúbal à média europeia | Distância do PIB por habitante à média europeia, na Península de Setúbal | Gap between Península de Setúbal and the European average | Gap between GDP per inhabitant and the European average, in Península de Setúbal |
| `distancia-oeste-e-vale-do-tejo-ue27-2024` | Distância do Oeste e Vale do Tejo à média europeia | Distância do PIB por habitante à média europeia, no Oeste e Vale do Tejo | Gap between Oeste e Vale do Tejo and the European average | Gap between GDP per inhabitant and the European average, in Oeste e Vale do Tejo |
| `distancia-alentejo-ue27-2024` | Distância do Alentejo à média europeia | Distância do PIB por habitante à média europeia, no Alentejo | Gap between the Alentejo and the European average | Gap between GDP per inhabitant and the European average, in the Alentejo |
| `distancia-alentejo-ue27-2000` | Distância do Alentejo à média europeia | Distância do PIB por habitante à média europeia, no Alentejo | Gap between the Alentejo and the European average | Gap between GDP per inhabitant and the European average, in the Alentejo |
| `distancia-algarve-ue27-2024` | Distância do Algarve à média europeia | Distância do PIB por habitante à média europeia, no Algarve | Gap between the Algarve and the European average | Gap between GDP per inhabitant and the European average, in the Algarve |
| `distancia-acores-ue27-2024` | Distância dos Açores à média europeia | Distância do PIB por habitante à média europeia, nos Açores | Gap between the Azores and the European average | Gap between GDP per inhabitant and the European average, in the Azores |
| `distancia-madeira-ue27-2024` | Distância da Madeira à média europeia | Distância do PIB por habitante à média europeia, na Madeira | Gap between Madeira and the European average | Gap between GDP per inhabitant and the European average, in Madeira |
| `distancia-setubal-grande-lisboa-2024` | Distância entre a Península de Setúbal e a Grande Lisboa | Distância do PIB por habitante entre a Península de Setúbal e a Grande Lisboa | Gap between Península de Setúbal and Greater Lisbon | Gap in GDP per inhabitant between Península de Setúbal and Greater Lisbon |
| `evora-pelouros-2021-total` | Pelouros distribuídos no executivo | Pelouros distribuídos no executivo | Portfolios handed out on the executive | Portfolios allocated across the executive |
| `evora-pelouros-2025-total` | Pelouros distribuídos no executivo | Pelouros distribuídos no executivo | Portfolios handed out on the executive | Portfolios allocated across the executive |
| `evora-prr-execucao-2026` | Parte do dinheiro aprovado que já foi paga | Parte das verbas aprovadas que já foi paga | Share of the approved money already paid | Share of approved funds already paid |
| `evora-prr-vencido-quota-2026` | Parte do dinheiro aprovado com prazo ultrapassado | Parte das verbas aprovadas em projetos fora de prazo | Share of the approved money past its deadline | Share of approved funds in projects past their deadline |

### 7.2 · As 44 células, uma a uma

**Nenhuma das 44 media uma coisa que este bloco tenha partido**, e nenhuma se retirou por estar vermelha: retirou-se onde a mobília que ela media saiu da página, e acertou-se onde ela mudou de sítio. O que sai leva a razão escrita na própria régua, ao pé do lugar onde a célula estava.

| célula | células vermelhas | o que se fez |
| --- | --- | --- |
| `lista.mjs` L3 (2) | a grelha da cabeça contra a coluna do mapa | **retirada.** Media que as duas colunas da cabeça acabam juntas, e a coluna esquerda leva hoje a busca, a porta do concelho e a legenda: a 1280 mede 981,5 px contra 689,0 px da coluna do mapa. O sujeito da célula era essa relação e mais nada |
| `lista.mjs` L8 (2) | o nome de cada painel conta o que está na página | **retirada.** Os dois painéis saíram da primeira página com o F1.10 e vivem em `/uniao-europeia`; a célula imprimia «(sem linha) diz undefined e o painel tem 0 peça(s)». As duas plantas dela saíram com ela |
| `lista.mjs` L2 (2) | «ao lado do mapa», a 1280 | **acertada.** A terceira exigência cai também a 1280, pela mesma razão que já tinha caído a 1024; o sítio onde a legenda está hoje mede-se por inteiro na L12, nas três larguras |
| `lista.mjs` L11 (4) | «acaba no fundo da legenda» | **acertada.** Fica com o topo, que é a promessa da cabeça alinhada que continua de pé. **Planta nova** para o topo, porque a que havia prendia o mapa ao topo e não o derrubava |
| `lista.mjs` L13 (4) | «enche-a em altura» | **acertada.** Fica com a coluna e com o desenho (a razão do `viewBox`), que são do mapa e não da grelha |
| `faixa.mjs` F10a (14) | a gaveta dos nomes, aberta | **retirada.** A gaveta chega fechada desde o F1.1d e o F1.1e, e o «alvo mais pequeno» que a célula imprimia (1,0 px) era o do `<summary>` recortado pelo F1.13: o número não dizia o que parecia dizer. O que ela media mede-se por inteiro na A5 de `porta.mjs` e na U4 de `mapa-unidades.mjs`, e o construtor do F1.13 já tinha escrito que uma terceira definição era o que a casa não quer |
| `faixa.mjs` F1 (2) e F12 (4) | «os cartões são as medidas da página» | **acertadas.** A primeira página deixou de render leituras com o F1.1b: os cartões dela são medidas de cabeça de um domínio, cuja leitura vive na página do domínio, e a própria sonda desta régua já o dizia por escrito. A correspondência exige-se onde a camada rende leituras (a página de concelho, 8 cartões contra 8 leituras), e o sentido que continua a valer em toda a parte («nenhuma medida da página fica de fora da faixa») exige-se sempre. **Na F12 fica também dito o que a régua não decide:** a camada da região não tem faixa nem instrumento, e isso é decisão do diretor |
| `faixa.mjs` F5 (2) | o encaixe, a 1280 | **acertada.** A partir de 768 px a faixa é uma grelha que dobra e o encaixe sai com o rolamento, por decisão escrita em `src/styles/inicio.css`. A célula passa a medir-se a 390, onde a faixa rola |
| `faixa.mjs` F6 (6) | «a faixa corre», a 768, 1024 e 1280 | **acertada.** Onde a faixa rola, «o primeiro cartão inteiro e há mais para correr»; onde ela dobra, «TODOS os cartões inteiros dentro da caixa», que é mais forte e não mais fraco |
| `faixa.mjs` F10b (2) | «chega aberta» | **acertada.** Chega fechada, e o primeiro toque abre e o segundo fecha. O que a célula prova, que o mecanismo é do navegador e não de um guião, não mudou uma vírgula |
