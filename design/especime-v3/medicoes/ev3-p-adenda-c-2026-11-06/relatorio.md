# EV3-p, adenda C: teto L1 corrigido; build bloqueado na língua

O teto da L1 passou de 3466 para 3468. A declaração nomeia as duas edições guardadas de 03.11.2026 e aponta para a medição, derivada do registo completo da adenda B. Nenhuma outra regra ou limite foi alterado.

- `/estudos/evora-2027-capital-europeia-da-cultura/documento/2026-11-03`
- `/en/studies/evora-2027-capital-europeia-da-cultura/document/2026-11-03`

## Conferências

- `check:lugar`: código 0, 3468 páginas, teto 3468. Inclui as plantas das edições e do quadro.
- Planta L1: código 0. O controlo passou; uma repetição introduzida na página de temas elevou a contagem a 3469, e a régua real falhou com código 1 por exceder o teto 3468. O HTML original foi reposto e a igualdade dos bytes confirmada.
- `check:voz`: código 0, dentro do build, que avançou para `check:nomes` e `check:lingua`.
- Build completo: código 1, em `check:lingua`. A edição «06.11.2026» não tem língua declarada em `src/i18n/lingua-dos-titulos.mjs`; a declaração ainda nomeia «03.11.2026», que já não aparece nas linhas do livro-razão. O build inteiro verde fica por concluir.

A primeira tentativa de planta usou uma rota artificial e terminou antes da contagem L1; foi inconclusiva e não foi contada como prova. A versão final usa uma página existente antes ausente da contagem L1, acrescentando a terceira página relativamente ao teto antigo. A planta foi retirada antes do build.

O motor permanece em 983b19eee29d4653730a62e9ee1d9674345db308. Não houve publicação, corrida completa dos portões nem capturas.

## Orçamento

20 chamadas de ferramentas de orquestração, incluindo a verificação final prevista. Três execuções principais: duas tentativas de plantas e um build. As tentativas de plantas chamaram duas vezes `check:lugar` e duas vezes a régua isolada; a última chamada isolada demonstrou a recusa esperada. O build correu as suas conferências encadeadas até ao portão da língua. Não foi exposta uma linha «tokens used».
