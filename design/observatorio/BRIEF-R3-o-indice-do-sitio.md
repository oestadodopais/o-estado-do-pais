# Brief R3 · o índice do sítio: uma página onde um leitor vê tudo o que o sítio tem, por secção, com uma porta para cada coisa, gerada das rotas e dos dados para nunca envelhecer

*Escrito pelo lugar de direção (Claude Fable 5.1) a 04.10.2026 de madrugada, pela ideia do diretor dessa madrugada («ter uma espécie de sítio onde pudéssemos ter um mapa do site, onde facilmente conseguíssemos aceder e ver o que é que o site tem, em vez de termos de estar a navegar, uma espécie de índice do conteúdo, com a possibilidade de clicar onde quer que fosse nesse índice e ir diretamente para o sítio onde a informação está»). O §0 é medido por `design/observatorio/medidas/BRIEF-R3.py`, que lê só o repositório (a M34). A regra do diretor de 04.10.2026 vale à cabeça: a qualidade e o rigor nunca baixam; o tempo e os símbolos são o que se gasta para isso. Sem travessões.*

## 0 · O que se mediu (04.10.2026, pelo guião `design/observatorio/medidas/BRIEF-R3.py`, o sítio em `1c4dde2f`)

A tabela das rotas declara 40 rotas (`rotas_declaradas`) e 0 de índice (`rotas_de_indice_declaradas`). O menu tem 6 portas (`portas_do_menu`) e o rodapé 6 (`portas_do_rodape`); o rodapé tem 0 portas para um índice (`portas_do_rodape_para_um_indice`). Há 32 ficheiros de página portugueses (`ficheiros_de_pagina_portugueses`) e 32 ingleses (`ficheiros_de_pagina_ingleses`), além das páginas por dado (os concelhos, as linhas, as séries). Os estudos declarados são 17 (`estudos_declarados`), 6 deles com sucessor (`estudos_com_sucessor`), que ficam fora do índice dos estudos e por isso fora deste índice também. O mapa do sítio das máquinas tem um filtro declarado (`filtro_do_mapa_do_sitio_declarado`), que diz o que entra e o que fica fora com a razão escrita.

## 1 · De onde vem o ponto

O sítio tem hoje perto de sete mil e quinhentas páginas e nenhuma página que as liste para uma pessoa: o mapa do sítio é das máquinas, o menu tem seis portas, o rodapé seis, e o resto encontra-se por navegação. O diretor pediu um índice que se percorra com os olhos e onde cada linha é uma porta. A regra que o torna barato e seguro: o índice não se escreve à mão, gera-se da tabela das rotas e dos módulos de dados que já alimentam as páginas, e uma célula fecha a construção quando o índice e o mapa do sítio discordam sobre as páginas do leitor.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: existe a página «Índice» (`/indice`) e «Index» (`/en/index`), com a porta no rodapé de todas as páginas nas duas edições, que lista, por secção e com uma porta por linha: o país (a primeira página, os assuntos e as sete entradas, com a pergunta de cada uma), os lugares (a página dos lugares, as nove regiões, os vinte e nove distritos e ilhas, e os trezentos e oito concelhos dobrados por distrito, em HTML simples que abre sem guião), a União (a página dos países), os estudos sem sucessor por data com a pergunta a que cada um responde, o livro-razão (o índice das linhas, as séries quando existirem, as correções, «O que mudou»), o método, a agenda, as sugestões, e uma secção «o que entrou» com as últimas entradas do registo das mudanças, por data; cada porta resolve (o `check:mortos`); o índice e o mapa do sítio das máquinas dizem as mesmas páginas do leitor, provado por uma célula com planta; nenhuma linha do índice é escrita à mão (os nomes vêm das rotas, das cadeias e dos dados); a página cabe nas cinco larguras e no telemóvel sem transbordo; os três portões a 0; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A rota e a página** | `src/lib/routes.mjs` ganha `indice: { pt: '/indice', en: '/en/index' }` com o seu comentário; uma vista `src/views/IndiceView.astro` e as duas páginas, no gabarito da casa; as secções do §2, cada uma com o título da casa (`src/i18n/strings.mjs`) e as portas geradas: as rotas pela tabela, os assuntos e as entradas pelos dados que já os desenham, os lugares pelos módulos das regiões, dos distritos e dos concelhos (`src/data/`), os estudos por `WORKS` sem `sucedidoPor` por data, as linhas do registo das mudanças por `src/lib/mudancas.mjs` | as duas páginas construídas |
| 2 | **A porta no rodapé** | `ROTAS_RODAPE` ganha `indice` (sete portas no rodapé, nas duas edições); as células que contam as portas do rodapé passam a sete, com planta | o rodapé em todas as páginas |
| 3 | **A célula do índice** | `tests/indice/indice.mjs` no `verify` (`check:indice-do-sitio`, para não colidir com o `check:indice` que existe): todas as rotas de leitor da tabela estão no índice nas duas edições (menos as páginas do resultado da caixa e as páginas por dado, que entram pelas suas listas); as portas do índice e o mapa do sítio das máquinas dizem o mesmo conjunto de páginas do leitor; os 308 concelhos estão todos, dobrados por distrito; cada porta resolve; plantas: uma rota tirada do índice, um concelho a menos, uma porta que não resolve, uma página do resultado no índice | a célula a 0 |
| 4 | **A forma** | Uma coluna, títulos de secção, listas simples; os concelhos em `<details>` por distrito (abrem sem guião); nenhum guião novo; as cinco larguras sem transbordo; o alvo de toque de 44 px nas portas (o `check:alvos`) | as capturas |
| 5 | **Os registos** | `check:mortos` e o mapa do sítio conhecem a rota nova; o inventário das frases, `CHAVES-EN.md`, o mapa do repositório | as auditorias a 0 |
| 6 | **As capturas e o relatório** | A página nas cinco larguras e nas duas edições, em `design/especime-v3/capturas/r3-2026-10-04/`; o relatório `design/especime-v3/medicoes/r3-2026-10-04/LEIA-ME.md` com a tabela do mandato, as plantas, os commits, os portões lidos de ficheiro, o custo e o modelo; o `medidas.json`; a resposta curta | completos |

## 4 · O que não se faz

Nenhuma linha do índice escrita à mão. Nenhum guião no leitor. Nenhuma mudança no menu principal (as seis portas são o máximo a 390 px, §1.153). Nenhum valor de linha. Nenhum `push`.

## 5 · As decisões do lugar de direção que este brief fixa

1. O índice gera-se das mesmas fontes que as páginas, e a célula prova que ele e o mapa do sítio concordam: um índice escrito à mão envelhece no dia seguinte.
2. Os concelhos entram todos, dobrados por distrito: um índice que diz «e mais 300» não é um índice.
3. As edições datadas dos estudos (com sucessor) ficam fora, como no índice dos estudos: o leitor chega-lhes pela nota do sucessor.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.
