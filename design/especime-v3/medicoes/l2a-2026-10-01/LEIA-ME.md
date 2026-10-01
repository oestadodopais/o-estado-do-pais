# L2a · o mapa primeiro: relatório do construtor

*Bloco L2a, 01.10.2026, pelo brief `design/observatorio/BRIEF-L2a-o-mapa-primeiro.md` e pela §1.149. Construtor: Claude Opus 5.5 (a definição `construtor`). Ramo `l2a-2026-10-01` sobre `main` (`d0416b3c`). Relatório em curso: escrito a cada passo, porque a semana da subscrição estava a 92 % ao começar e a sessão pode parar a meio. Sem travessões.*

## Estado

Em construção. O que está feito e o que falta diz-se na tabela do mandato; os números só entram com o ficheiro que os mede.

## O mandato

| # | o que | estado |
|---|---|---|
| 1 | O mapa logo a seguir à pesquisa em «Lugares» | construído no primeiro commit; capturas por tirar |
| 2 | As listas dobradas | construído no primeiro commit (gavetas com o nome da secção e a contagem da prova); célula por escrever |
| 3 | A primeira página sem o mapa inteiro nem a pesquisa, e o sinal na porta | construído no primeiro commit; células por mudar de forma |
| 4 | As réguas | o `check:mapa` mudou de forma (R4, R6, R8), com quatro plantas novas; as outras por correr |
| 5 | O relatório | em curso |

## O ponto onde o brief encontrou uma proteção de fonte

O brief pede o sinal «sem dados nem legenda». O contorno do país sai do mesmo artefacto do mapa inteiro (a CAOP 2025 da Direção-Geral do Território), e a licença dessa informação tem uma obrigação só, a menção da entidade proprietária, que a Emenda 20e manda escrever onde o desenho está (`mapa/manifest.json`, campo `fonte.licenca_evidencia`; `src/components/inicio/LegendaDoMapa.astro`: «Tirá-la é uma decisão do diretor com o advogado, e não um acerto de forma»). Na língua da casa, a «legenda do mapa» é hoje exatamente essa menção. O sinal saiu sem legenda de valores e sem dados, e com a menção da fonte escrita ao lado, fora da ligação; a R6 do `check:mapa` confere-a. Se o lugar de direção preferir um sinal que não seja desenho da Carta, ou decidir a menção com o advogado, a mudança é só esta.
