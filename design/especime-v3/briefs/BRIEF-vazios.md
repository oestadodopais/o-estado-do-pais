# BRIEF · Os vazios: sete medidas, e «N.d.» como valor

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Ramo `vazios-2026-08-28`, saído de `main` `35313eb`. Sem travessões na prosa deste ficheiro nem na que escreveres.*

## 0 · A decisão do diretor (28.08.2026)

O diretor viu «sem linha ainda» em demasiados sítios e decidiu três regras, que revogam a decisão D2 de 26.08 e emendam a lista da Emenda 14:

1. **Uma medida que nenhuma fonte publica para ninguém não tem peça.** «Execução da receita» sai da disposição-padrão do concelho (a DGAL deixou de a publicar em 2019). As páginas passam de oito medidas a sete, pela mesma ordem. A camada das contas de Évora, que lê a execução da prestação de contas do próprio município, fica como está.
2. **Quando a fonte imprime «N.d.», a página mostra «N.d.», com selo.** É o valor tal como a fonte o publicou. São onze linhas, que o motor escreve (nove do prazo médio de pagamento de dezembro de 2025: Aljezur, Aljustrel, Almada, Batalha, Évora, Moimenta da Beira, Pedrógão Grande, Penedono, Trancoso; e as duas da dívida de Penedono, `penedono-divida-dgal-2024` e `penedono-limite-divida-dgal-2024`). O índice de dívida de Penedono, calculado sobre duas entradas «N.d.», é «N.d.».
3. **Depois de 1 e 2, «sem linha ainda» e «no row yet» não rendem em lado nenhum.** A forma fica no código para uma falta futura genuína (regra 14 da Emenda 18); no inventário as duas frases passam a `retirada`, com esta razão.

## 1 · O que constróis

1. **A lista das medidas** (`src/data/concelhos.mjs`, `MEDIDAS_DO_CONCELHO`): sai `execucaoDaReceita`. Procura tudo o que assume oito (comentários, `strings.mjs`, testes com «8 peças», o relance, as células dos testes de `tests/inicio/*`, o inventário onde diga «oito medidas») e corrige para sete. Prova: cada uma das 308 páginas nas duas edições tem exatamente sete `article.peca`.
2. **Um valor que não é número rende tal como está.** Uma linha cujo `value` é «N.d.» rende «N.d.» como valor da peça, com o selo e o recibo iguais aos das outras, sem formatação numérica, sem comparação, sem barra, sem frase a explicar. Vê onde o valor é convertido em número (o relance, `prova.mjs`, o portão que reconta as provas, o `check:dados`, o `check:cruzamento`) e faz cada um aceitar um valor textual sem o inventar como zero. A receita do índice de dívida dá «N.d.» quando uma entrada é «N.d.», e a linha calculada di-lo no seu `check`. Nas duas edições o valor é o mesmo «N.d.» (é texto da fonte, não se traduz).
3. **As linhas do motor.** O lugar de direção avisa-te quando o motor tiver as onze linhas e o manifesto (`publisher/manifest.concelhos.json`). Corres então, a partir de `~/Instruments/ResearchHub`, `python3 publisher/export_site_rows.py --manifest publisher/manifest.concelhos.json --write`, que escreve as linhas em `ledger/claims/`, o `ledger/cruzamentos/concelhos.json` e o `src/data/concelhos.gerado.json` deste repositório. Não escreves nenhuma linha à mão e não tocas no motor. Até o aviso chegar, desenvolves com o que existe: a prova da regra 2 faz-se num teste com uma linha de ensaio em memória, nunca num ficheiro do livro-razão.
4. **O inventário** (`design/especime-v3/INVENTARIO-FRASES.md`): «sem linha ainda» e «no row yet» passam a `retirada` com a razão (regra 3 acima; a régua `check:voz` fica vermelha enquanto uma frase `viva` não render, e é isso que prova que saíram); as quatro contagens do livro-razão mudam de novo e declaras as novas (afirmações, calculadas, linhas de concelhos) em `bloco vazios`; qualquer frase nova, classificada. Uma linha `| vazios | n | por ler | … |` em `critica/REVISOES-DO-INVENTARIO.md`.
5. **Os testes** (`tests/inicio/*`): as células que contavam oito medidas contam sete; um detetor da frase de ausência que vê zero só depois de ter visto vermelha uma cópia com a frase plantada; Penedono e um dos nove com «N.d.» nas duas edições, com selo.
6. **`DECISIONS.md`** é do lugar de direção; não lhe tocas. Se achares que a decisão está errada ou incompleta, dizes no relatório e paras nessa parte.

## 2 · O que é «feito»

* `dist/` sem uma ocorrência de «sem linha ainda» nem de «no row yet» (conta-as antes e depois: hoje são 320 e 320).
* As 308 páginas com sete peças nas duas edições; Penedono com «N.d.» na dívida total e no índice de dívida, com selo; os nove com «N.d.» no prazo médio de pagamento, com selo; `src/data/concelhos.gerado.json` sem um vazio.
* A cadeia inteira verde: `npm run build` (com as réguas todas), `npm run verify`, `npm run typecheck`; `check:voz` verde com as duas frases `retirada` e as contagens declaradas.
* Cada commit verde, com caminhos explícitos (nunca `git add -A` nem `git add .`), com os dois trailers: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`.
* O relatório em `design/especime-v3/medicoes/vazios-construtor.md`: as contagens antes e depois, o que assumia oito e mudou, onde o valor textual entra em cada régua, os commits, o custo em símbolos. O que não conseguiste fazer com honestidade fica dito, não aproximado.
