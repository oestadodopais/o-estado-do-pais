# BRIEF · A cabeça da primeira página alinhada: a manchete em cima, os nomes e o mapa a começar juntos e a acabar juntos

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus), a construir quando houver folga. Ramo `inicio-alinhamento-<data>` saído de `main`, num worktree. Sem travessões na prosa. O diretor viu o bloco no ar e pediu-o («the cities are not aligned with the map… the map could be aligned with the bottom… or a full top for the title»); o lugar de direção mediu e fez a maqueta em `design/especime-v3/medicoes/inicio-alinhamento-maqueta-1280.png`.*

## 0 · O que está, medido no ar a 1280 (`3de3ba7`)

A grelha da cabeça mede 737 px (417 a 1154). A coluna esquerda tem a manchete (423 a 709) e por baixo os nomes (735 a 1154); a coluna direita tem o mapa (423 a 1069) e por baixo a contagem e a fonte da Carta (1069 a 1137). Os nomes começam 312 px abaixo do topo do mapa e acabam 85 px abaixo do fundo dele; a linha da fonte fica pendurada por baixo do mapa, alinhada com nada.

## 1 · O que se decide

A partir de 1024 px: **a manchete e a sua frase ocupam a largura toda** (com uma medida máxima para a manchete, uns 20 em, de modo a partir em três linhas e não em duas compridas); **por baixo, os nomes à esquerda e o mapa à direita começam na mesma linha**; **o mapa toma a largura `larga_minima` (340 px)**, que a folha já dá ao mapa noutras larguras, para que a altura dele (uns 448 px) case com a dos nomes (419 px) mais a legenda; **a contagem e a fonte da Carta passam para a coluna dos nomes, em baixo, alinhadas com o fundo do mapa**; o mapa encosta aos nomes e não à margem direita (`justify-self: start` ou a coluna direita dimensionada ao mapa), de modo a não deixar um vazio no meio. Medido na maqueta: a grelha passa de 737 para 718 px. Abaixo de 1024 nada muda.

## 2 · O que se mede, e o que é «feito»

* As quatro linhas: o topo dos nomes igual ao topo do mapa (± 2 px); o fundo da legenda igual ao fundo do mapa (± 4 px); a manchete a três linhas a 1280 e a 1440; o vazio entre a coluna dos nomes e o mapa não maior do que a goteira da grelha. A altura da grelha e da página a 1024, 1280 e 1440, nas duas edições, antes e depois.
* O par de estado (rato e teclado, nos dois sentidos, as 29 unidades) continua a funcionar com o mapa mais pequeno; a régua `lista.mjs` verde (72 células e os 12 estragos com as três exigências); `mapa-distritos` e `mapa-navegacao` verdes; a M1c da régua do mapa, se exigir 44 px ao nome a 1280, fica como está (a altura das linhas dos nomes não muda).
* `npm run build`, `verify`, `typecheck` a 0; commits com caminhos explícitos e os dois trailers; push sem force; não funde. Relatório em `medicoes/inicio-alinhamento-construtor.md`. Depois, a medição cega (Sonnet, as quatro linhas e as alturas) e a leitura cruzada (Codex, com plantas) como sempre.
