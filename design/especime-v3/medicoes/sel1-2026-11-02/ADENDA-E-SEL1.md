# Adenda E ao mandato SEL1: os dois vermelhos da corrida inteira (02.11.2026)

Acrescenta: nada

*A mesma sessão, a mesma worktree, agora com a PAI1 por cima (5bf2c209a, a prova da HB1, e 9518b5565, o painel). Escrita pelo lugar de direção (Claude Opus 5.5). A corrida inteira do lugar de direção na cabeça 9518b5565 (54 passos, 2 083 s) deu dois vermelhos, e os dois são da SEL1: nas corridas de 30.10 (do DO4 e do lote) os dois passos davam 0.*

1. **`check:sobreposicao` (código 1):** «M118: 90 combinações, 60 sobreposições» (a 30.10: 0). Na primeira página, `/` e `/en/`, 2 em cada largura de 1 024, 1 280 e 1 600 px e 1 a 390 px em `/en/`; em «O que se discute», `/o-que-se-discute/` e `/en/under-discussion/`, 4 a 6 em cada largura. O registo está em `tests/documentos/sobreposicao.mjs` e na saída do passo 12. A causa provável é a área de toque reservada pela adenda D ou um selo deslocado num título ou numa manchete; confirmas qual pela própria régua.
2. **`check:mortos` (código 1):** três identificadores declarados e nunca usados: `src/views/DiscussaoView.astro:7` (a importação `Provenance`), `scripts/check-cadeia.mjs:245` e `scripts/gate-html.mjs:2044` (a função `irmaoColado`).

Corriges as duas causas sem mudar os limites de nenhuma régua, sem mudar palavras e sem tirar nenhum selo de depois da medida inteira; um commit cada (`SEL1-E1`, `SEL1-E2`), por cima da PAI1. Depois corres as duas conferências que estavam vermelhas, os alvos de toque, `check:selos` e as outras que a mudança tocar, e o `build` inteiro pelo escrivão se mudares CSS ou componentes. Quarenta e cinco minutos, sessenta chamadas. Paras e dizes se a única forma de tirar uma sobreposição for mudar um limite, tirar uma área de toque que a régua dos alvos exige, ou pôr um selo antes de uma unidade.
