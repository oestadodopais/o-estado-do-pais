# Relatório do construtor: a cabeça da primeira página alinhada (29.08.2026)

*Construído pelo lugar de direção (Claude Fable 5), por folga do Opus nesta semana, no ramo `inicio-alinhamento-2026-08-29` saído de `main` `a4b45a7`, a partir do brief `briefs/BRIEF-inicio-alinhamento.md` (§1b, a forma que o diretor pediu depois da maqueta). Sem travessões na prosa. Os números abaixo são caixas lidas no Chromium do Playwright sobre o `dist/` construído, a 2× de densidade, um píxel de CSS por unidade.*

## O que mudou

1. **A legenda saiu da figura do mapa.** A linha dos 308 («308 concelhos · CAOP 2025 ■ fonte», com o ano lido do `reference_date` da linha) e a menção da Carta (Emenda 20e) passam de `MapaRespira.astro` para `LegendaDoMapa.astro`, a quarta filha da grelha da cabeça em `HomeView.astro`. É `<div>` e não `<figcaption>`, porque já não está dentro de uma `<figure>`; leva `data-mapa-ficha` (a marca que `tests/inicio/correcoes-a.mjs` lê) e `data-mapa-legenda` (a marca que `scripts/check-mapa.mjs` passa a conhecer). A regra do canto das ilhas (etapa 2m), que punha a legenda dentro da célula do desenho com `margin-left: 45%`, saiu com ela.
2. **A grelha a partir de 1280 px** (`src/styles/inicio.css`, o bloco «A CABEÇA ALINHADA A PARTIR DE 1280»): a coluna esquerda a 550 px, três filas (manchete, nomes, legenda); o mapa ocupa a coluna direita nas três, esticado sem contribuir para a altura delas (`height: 0; min-height: 100%`), e a tela é dimensionada pela altura com `aspect-ratio: 6090 / 8030` (o `viewBox` do desenho; a primeira versão usava 600/790, o campo, e a leitura cruzada apanhou a diferença), presa a `max-width: 100%`; a legenda com `align-self: end`, alinhada à esquerda, a 6 px dos nomes, e os nomes a 20 px da manchete (as duas margens encolheram depois da leitura cruzada, para que a largura que a altura pede caiba na coluna com folga em vez de ficar presa pelo `max-width` com ar em cima e em baixo). As linhas dos nomes medem 32 px a partir de 1024 (a regra do toque, 44 px, fica abaixo de 1024).
3. **Entre 1024 e 1279** a legenda fica por baixo do mapa, na coluna dele: partilha a célula das duas filas e desce exactamente a altura do mapa por `margin-top: calc(100% * 8030 / 6090 + 8px)`, porque uma margem em percentagem resolve-se contra a largura da célula e o mapa tem a largura da coluna com a razão do seu campo. Abaixo de 1024 a legenda fica entre o mapa e os nomes (`order: 5` abaixo de 640 e `order: 2` entre 641 e 1023, um bloco que a primeira versão não tinha tocado e onde a legenda ficava antes do mapa; os nomes passam a 6 e a 3).
4. **As réguas.** `tests/inicio/lista.mjs`: L5 passa a exigir a altura declarada no ecrã com rato, 32 px e não «pelo menos 32» (`alvoEm(w)`, com um tecto de 34), e ganha L11 (o mapa do topo da manchete ao fundo da legenda, ± 2 e ± 4 px), L12 (a legenda por baixo dos nomes, alinhada à esquerda e com `text-align: left`; a 1024, por baixo do mapa na coluna dele) e L13 (o mapa cabe na coluna pelos dois lados, fica a menos de 8 px da largura dela, enche a grelha em altura e o desenho enche a caixa: a razão da caixa do `svg` é a do `viewBox` a menos de 1,5 px), a 1024, 1280 e 1440 nas duas edições, e 1440 entra nas larguras de todas as células; três estragos plantados (o item deixa de esticar; a legenda de volta para a coluna do mapa; o mapa mais largo do que a coluna). `tests/inicio/mapa-distritos.mjs`: a M1c exige 32 a 34 px a 1280 (`ALVO_PONTEIRO`). A figura do mapa aponta à legenda com `aria-describedby` (leitura cruzada). `scripts/check-mapa.mjs`: a R6 procura o selo da Carta na figura ou em `[data-mapa-legenda]` da mesma página, e o seu estrago tira-o das duas.

## Medido, antes e depois, a 1280 (pt)

| | antes (`a4b45a7`, no ar) | depois |
|---|---:|---:|
| grelha da cabeça | 417 a 1154, **737 px** | 417 a 1102, **684 px** |
| manchete | 423 a 709 | 423 a 709 |
| nomes | 735 a 1154 (linhas de 44) | 729 a 1040 (linhas de 32) |
| legenda | 1069 a 1137, por baixo do mapa | 1046 a 1102, por baixo dos nomes, x 94 |
| mapa (svg) | 423 a 1069, 490 px de largura | **423 a 1102**, 514,5 px de largura na coluna de 518, com 0,0 px de ar vertical (a caixa tem a razão do `viewBox`) |
| topo do mapa contra o topo da manchete | 0 px | 0 px |
| fundo do mapa contra o fundo da legenda | 68 px acima | **0 px** |

A 1440 os mesmos números, com a grelha a começar em x 174 (a caixa de conteúdo é a mesma, 1092 px). A 1024: manchete 410 a 619, nomes 645 a 956 (linhas de 32), mapa 410 a 858 na coluna de 340, **legenda 866 a 948** (8 px por baixo do mapa, na coluna dele), grelha 404 a 956. A 800: manchete 411 a 604, mapa 626 a 996, legenda 1018 a 1074, nomes 1106 a 1403 (linhas de 44), nesta ordem. A 390: mapa 899 a 1413, legenda 1425 a 1506, nomes 1532 a 2049, nesta ordem. Em inglês, as mesmas caixas ao píxel nas células L11 a L13.

## As réguas nesta construção

`npm run build` 0 nas duas construções que contam (a primeira de todas ficou vermelha na R6 do `check:mapa`, «o mapa não tem, na sua figura, o selo que abre a linha da Carta», que é exactamente o que a mudança faz; a regra foi ensinada e o estrago dela passou a tirar o selo das duas casas), `npm run verify` 0, `npm run typecheck` 0. `lista.mjs` **94 de 94** (eram 72; as 22 novas são as de 1440 e as L11 a L13); `mapa-distritos.mjs` 43 de 43; `mapa-navegacao.mjs` 9 de 9; `areas.mjs` 22 de 22; `correcoes-a.mjs` 32 de 32; `app.mjs` 39 de 39; `check-mapa.mjs --vermelhos` com os três estragos da R6 vistos vermelhos. O corredor dos estragos de `lista.mjs` (`--vermelhos`, quinze estragos com as três exigências): **15 de 15 estragos vistos vermelhos** (verde antes, o HTML mudou, vermelho depois, em todos), os doze do bloco anterior e os três novos, com saída 0..

## A leitura cruzada, e a segunda construção

O Codex (`critica/2026-08-29-codex-leitura-inicio-alinhamento.md`) apanhou as três plantas e achou cinco coisas reais na primeira construção: a razão do desenho (o `viewBox` é 6090/8030 e a folha dizia 600/790, e a altura pedia 529 px numa coluna de 518, presa pelo `max-width` com 7 px de ar em cima e em baixo); a legenda antes do mapa entre 641 e 1023; os 32 px só a partir de 1280 e não de 1024, com as células a aceitar 44 como «não abaixo de 32»; as L11 a L13 mais estreitas do que os nomes; a figura sem associação à legenda. Tudo consertado nesta segunda construção, e os números da tabela são os dela.

## Custo

O lugar de direção, na sua própria sessão; sem construtor delegado.
