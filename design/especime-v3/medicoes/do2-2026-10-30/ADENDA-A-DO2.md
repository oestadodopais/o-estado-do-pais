# Adenda A ao mandato DO2: as contagens dos dossiês pela prova, com a porta no dossiê (30.10.2026, 10:26 UTC)

Acrescenta: frases

*A mesma sessão, a mesma worktree (ramo `do2-2026-10-30`, cabeça f257a15d7, limpa). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A passagem das 10:19 UTC parou pela regra certa (§4 do mandato): o token de contagem pedia uma lista fechada que o mandato não nomeava (`src/lib/prova.mjs` não tem contagens por dossiê), `scripts/gate-html.mjs` recusa uma chave `data-prova` que não sabe recontar e exige que o número esteja dentro da ligação para a sua porta, e o §3 dizia que só o título era ligação. Esta adenda resolve as três pela forma que o sítio já usa para as `areas_pecas_*` (`AreasView.astro`), sem enfraquecer nenhum portão. Onde contradiz o §3 do mandato, vale esta adenda; o resto do mandato fica.*

## 1 · Duas famílias de chaves da prova

Em `src/lib/prova.mjs`, ao lado de `CHAVE_DAS_PECAS`, duas funções exportadas e duas famílias, uma chave por dossiê declarado em `src/data/dossies.mjs`, o slug com sublinhados pela razão escrita em `CHAVE_DAS_PECAS`:

- `CHAVE_DAS_PECAS_DO_DOSSIE(slug)` dá `dossie_pecas_<slug>`: o número de peças do dossiê, os estudos, as explicações e os itens somados (hoje 5 no `orcamento-2027`).
- `CHAVE_DOS_ITENS_DO_DOSSIE(slug)` dá `dossie_itens_<slug>`: o número de itens de «O que se discute» do dossiê (hoje 3).

O valor conta-se das listas `pecas` de `DOSSIES`, nunca à mão. A porta das duas é a página do dossiê, `routePath('dossie', lang, { slug })`, em cada edição. As frases da origem (o `title` do número, prosa da casa, que entram no inventário no bloco `do2`), palavra por palavra:

- `dossie_pecas_*`: pt «peças na página deste dossiê»; en «pieces on this dossier’s page»
- `dossie_itens_*`: pt «textos em discussão na página deste dossiê»; en «texts under discussion on this dossier’s page»

## 2 · O portão reconta as duas no HTML construído

Em `scripts/gate-html.mjs`, pela forma de `pecasDeArea`: um ponto de observação que, em cada página construída da rota `dossie`, conta os elementos marcados `data-dossie-peca` (todas as peças) e, entre eles, os que começam por `discussao:` (os itens), e as `conta(...)` com a vista `dist`, uma por dossiê declarado e por família. Para isso, a página do dossiê (`src/views/DossieView.astro`) marca cada peça que rende com `data-dossie-peca="<tipo>:<slug>"` (`estudo`, `explicacao`, `discussao`), uma marca por peça, nas três secções: os estudos à volta de `EstudoDaLista`, as explicações no elemento que já leva `data-dossie-explicacao`, os itens dentro de `BlocoDaDiscussao` só quando recebe `dossie`. A prova conta nos dados e o portão conta no HTML: duas vistas, e um desacordo fecha a construção.

## 3 · Onde aparece o número, aparece a porta: as frases do §3 com a extensão da ligação

A frase do §3 «O título leva a ligação para o dossiê; nada mais na entrada é ligação» sai. Fica esta: a ligação para o dossiê é um só `<a>` que leva o título e a contagem; o rótulo e a data ficam fora dela. Abaixo, os colchetes marcam só onde começa e acaba a ligação e não se imprimem.

- §3.1, a caixa «O que há de novo»: pt «Dossiê · [⟦título do dossiê⟧ · ⟦n⟧ peças], a mais recente de ⟦data⟧»; en «Dossier · [⟦title⟧ · ⟦n⟧ pieces], the most recent from ⟦data⟧». Com uma peça: pt «[⟦título do dossiê⟧ · 1 peça], de ⟦data⟧»; en «[⟦title⟧ · 1 piece], from ⟦data⟧». O `⟦n⟧` é `dossie_pecas_<slug>`.
- §3.2, a linha no bloco «O que se discute» da primeira página: pt «Dossiê: [⟦título do dossiê⟧ · ⟦n⟧ textos em discussão →]»; en «Dossier: [⟦title⟧ · ⟦n⟧ texts under discussion →]». Com um texto: pt «1 texto em discussão →»; en «1 text under discussion →». O `⟦n⟧` é `dossie_itens_<slug>`.
- §3.3, a entrada na lista dos dossiês: pt «[⟦título do dossiê⟧ · ⟦n⟧ peças], a mais recente de ⟦data⟧»; en «[⟦title⟧ · ⟦n⟧ pieces], the most recent from ⟦data⟧», com as formas de uma peça do §3.1. O `⟦n⟧` é `dossie_pecas_<slug>`.

O `⟦n⟧` renderiza só os algarismos, num `<span class="prova-valor" data-prova="…">` como em `AreasView.astro`; a palavra que se segue («peças», «peça», «textos em discussão») escolhe-se pelo valor e leva `data-voz`, pela razão escrita em `AreasView.astro` (um texto todo dentro de um `<a>` é um destino para a régua da voz).

## 4 · Onde a lista dos dossiês se imprime

`src/components/dossies/ListaDeDossies.astro` serve as portas (`EntradaView.astro`), o Temas (`TemasView.astro`) e o índice dos dossiês (`DossiesView.astro`). A forma do §3.3 vale nas três, o índice incluído: uma entrada de dossiê tem uma forma só em todas as listagens (decisão desta adenda; o §0.3 do mandato deixava o índice de fora, e a mesma componente fazia disso uma segunda forma a manter). O âmbito que a lista imprime hoje fica por baixo da entrada, como está.

## 5 · As plantas, além das do §2.1 e do §2.3

Correm sobre cópias numa pasta temporária, nunca sobre o `dist/` da worktree, e cada uma prova que o portão recusa e nomeia a chave:

1. `dossie_pecas_orcamento_2027` declarada 6 na prova contra a página do dossiê com 5 peças;
2. a página do dossiê com uma marca `data-dossie-peca` a menos;
3. `dossie_itens_orcamento_2027` declarada 4 contra 3 itens marcados;
4. a contagem da caixa das novidades dentro de uma âncora para outro destino (a porta «Estado e economia»);
5. a contagem da caixa das novidades fora de qualquer âncora.

O lugar das plantas escolhe-o o construtor pela convenção que encontrar para as contas do portão, e o relatório diz qual.

## 6 · As listas fechadas que esta adenda acrescenta ao §2.4

`src/lib/prova.mjs` (as duas famílias, as quatro frases da origem, as entradas na `prova(lang)`); `scripts/gate-html.mjs` (a importação das duas funções, o ponto de observação, as `conta`); `src/views/DossieView.astro` e `src/components/discussao/BlocoDaDiscussao.astro` (as marcas `data-dossie-peca`); `src/components/dossies/ListaDeDossies.astro`; o inventário das frases (bloco `do2`: as frases da origem e as do §3); a secção DO2 do mapa dos construtores (as duas famílias e a regra do leitor). Nenhum portão perde força: «onde aparece um valor, aparece a porta» e a recusa de uma chave que o portão não reconta ficam como estão.

## 7 · O orçamento e o que pára

Esta retoma: setenta e cinco minutos e cem chamadas, pelo trabalho do portão que o mandato não tinha. As conferências dirigidas do §1 do mandato, mais o portão das páginas sobre o `dist/` construído (`npm run build` e o `gate-html` que o `verify` corre sobre ele, uma vez no fim). As condições de paragem do §4 do mandato ficam; acrescenta-se uma: paras e dizes se o portão ou outra régua pedir uma lista que esta adenda não nomeie.
