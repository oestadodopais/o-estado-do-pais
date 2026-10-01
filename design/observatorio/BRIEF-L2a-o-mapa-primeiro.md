# Brief L2a · o mapa primeiro: em «Lugares» o mapa vem logo a seguir à pesquisa em todas as larguras, as listas das regiões e dos distritos dobram-se, e a primeira página fica com a porta e não com o mapa

*Escrito pelo lugar de direção (Claude Fable 5.1) a 01.10.2026, pela leitura do diretor no telemóvel nesse dia (§1.149): em «Lugares», em vez do mapa, vêm os nomes todos em texto; o mapa da primeira página ficou muito em baixo. É a primeira metade do bloco L2 da §1.143; a segunda (o concelho entre os 308, com a faixa, e a referência do ganho médio) é o L2b. O §0 é medido por `design/observatorio/medidas/BRIEF-L2a.py`, que lê só o repositório (a M34). Sem travessões.*

## 0 · O que se mediu (01.10.2026, pelo guião `design/observatorio/medidas/BRIEF-L2a.py`, o sítio em `1395c9de`)

Na vista de «Lugares», o mapa é a quarta peça do documento, com 3 peças antes dele (`pecas_de_lugares_antes_do_mapa`): a pesquisa e as duas listas, com 9 regiões (`regioes_na_lista`) e 29 distritos e ilhas (`distritos_e_ilhas_na_lista`). Na primeira página, o bloco dos lugares vem depois de 2 secções (`seccoes_da_primeira_pagina_antes_dos_lugares`), e a página leva 1 pesquisa (`pesquisas_na_primeira_pagina`) e 1 mapa inteiro (`mapas_inteiros_na_primeira_pagina`), os mesmos de «Lugares». As capturas do N1 na largura do telemóvel medem 5321 pixels de altura em «Lugares» (`altura_da_captura_de_lugares_a_390`) e 7194 na primeira página (`altura_da_captura_da_primeira_pagina_a_390`).

## 1 · O que o leitor viu

O diretor, no telemóvel, a 01.10.2026: o mapa da primeira página ficou muito em baixo; em «Lugares», em vez do mapa, vêm os nomes todos dos lugares em texto, um buraco grande que se percorre; o mapa devia vir logo, com os nomes numa lista que se abra. O lugar de direção conferiu na captura do N1 a 390 px: a pesquisa, as 9 regiões e os 29 distritos e ilhas numa coluna só, e só depois o mapa; a 1 024 px e acima o mapa está ao lado das listas (a grelha de duas colunas do achado D7, 21.09.2026) e não se nota. Na primeira página a 390 px o mapa vem depois dos cinco blocos de «O que se passa» e das oito portas.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: em «Lugares», em todas as larguras, a ordem é a pesquisa, o mapa e só depois as listas; as duas listas são duas linhas fechadas (um `<details>` cada, com o `<summary>` a dizer o nome da secção e a contagem) que abrem sem guião e mostram os mesmos nomes com as mesmas portas; nas duas colunas a partir de 1 024 px o mapa continua à direita e as listas fechadas à esquerda, por baixo da pesquisa; a primeira página não tem mapa inteiro nem pesquisa, e a porta «Lugares» em «Por onde começar» leva um mapa pequeno como sinal (o contorno do país, sem dados, com a lista dos nomes e as unidades intocadas); os dois mapas de «As medidas dos concelhos» e as suas tabelas em `<details>` ficam como estão; as células que protegem a pesquisa, o mapa e as listas (`tests/inicio/`, o `check:navegacao`, o `check:primeira`, o `check:lugares`) mudam de forma conservando o que protegem, com uma planta cada; os três portões a 0; as capturas de «Lugares» e da primeira página nas cinco larguras e nas duas edições; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **O mapa logo a seguir à pesquisa** em «Lugares» | `src/views/LugaresView.astro`: o `MapaRespira` passa para logo depois da secção da pesquisa no documento (a ordem do documento é a ordem no telemóvel); a grelha de duas colunas a partir de 1 024 px conserva o mapa à direita (a folha `LugaresView` e a ordem da grelha) | a captura a 390 e a 768 mostra o mapa antes das listas; a 1 024, 1 280 e 1 600 o mapa à direita |
| 2 | **As listas dobradas** | as secções das regiões e dos distritos e ilhas passam a um `<details>` cada, fechado, com o `<summary>` a dizer o nome e a contagem («As regiões, 9»; «Os distritos e as ilhas, 29») lida da carta e não escrita à mão; as listas lá dentro são as mesmas (`data-lista-lugares`), com as mesmas portas; sem guião; o foco e o teclado funcionam | a captura a 390 com as duas linhas fechadas; a célula que conta os nomes das listas continua a contar 9 e 29 |
| 3 | **A primeira página sem o mapa inteiro nem a pesquisa** | `src/views/HomeView.astro`: a secção `pp-lugares` sai; a porta «Lugares» em `IndiceDosAssuntos` (os dados em `src/data/primeira-pagina.mjs`) ganha um sinal: o contorno do país em SVG pequeno, estático, sem dados nem legenda, com texto alternativo; as células que exigiam a pesquisa e o mapa na primeira página passam a exigir a porta com o sinal, com planta | a captura da primeira página a 390 mais curta do que 7194 pixels; o `check:primeira` e o `check:navegacao` a 0 com as formas novas |
| 4 | **As réguas** | `python3 scripts/leituras/decisoes-em-vigor.py` sobre os ficheiros tocados antes de mexer (o D7 de 21.09 e a §1.143 ficam em vigor: a grelha de duas colunas conserva-se, e uma coisa, um lugar); cada célula que muda de forma leva uma planta que morde; nenhuma régua que protege um número ou uma porta se enfraquece | a lista das decisões no relatório; as plantas |
| 5 | **O relatório** | `design/especime-v3/medicoes/l2a-2026-10-01/LEIA-ME.md` com a tabela deste mandato, as plantas, os commits, os portões, o custo; o `medidas.json` por um guião do bloco, com um conhecido-positivo por medida; as capturas em `design/especime-v3/capturas/l2a-2026-10-01/` | completos |

## 4 · O que não se faz

Nenhuma mudança nos dados, nas linhas, nas tabelas dos concelhos nem nos dois mapas das medidas. Nenhuma mudança na anatomia dos cartões (K2) nem na faixa do concelho (L2b). A identidade fica como está. Nenhum `push`.

## 5 · As decisões do lugar de direção que este brief fixa

1. O mapa é de «Lugares» e vem primeiro; os nomes dobram-se; a primeira página fica com a porta e o sinal (§1.149, com a pergunta ao diretor feita: se preferir o mapa na primeira página, sobe em vez de sair).
2. As listas dobram-se com `<details>`, e não com um `<select>`: funciona sem guião, os nomes continuam a ser ligações, e o leitor que não as quer não as paga.
3. O sinal da porta não leva dados: um contorno não é um mapa de valores e não precisa de legenda nem de linhas.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.
