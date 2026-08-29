# Relatório do construtor: a marca do diretor nos seis ficheiros do telemóvel

*Claude Opus 5, 29.08.2026, ramo `marca-k-aplicada-2026-08-29`, três commits (`5408528`, `9938f36`, `45c5c59`). O texto abaixo é o relatório da segunda passagem tal como chegou ao lugar de direção; a primeira passagem tinha deixado as celas ao `scale(0.62)` do ficheiro da cela, com 9,5 % de mancha, e o lugar de direção pediu o enquadramento do favicon.*

Reframing feito. O worktree está limpo, o repositório principal continua intacto em `61bde7b`.

## O que mudou

As quatro celas passaram a tomar o **enquadramento do `favicon.svg`** dele (barras de 340 numa grelha de 512, caixa 340 × 312, centrada em 256) e a **paleta da cela** (papel-claro e cobalto-claro sobre o campo de tinta). São dois ficheiros do diretor e nenhum foi editado; a ronda confere barra a barra que os dois trazem o mesmo desenho e pára se divergirem. O `translate(97 97) scale(0.62)` do ficheiro da cela deixou de entrar.

## Os dois números pedidos

**A mancha do 180 px:** **8060 píxeis de 32 400, ou seja 24,9 % da cela** (contados como píxeis que diferem do campo em mais de 8 níveis, o mesmo limiar da célula A3). Sobe dos 9,5 % que o enquadramento anterior dava, e fica dentro da banda de 19,8 a 29,9 % dos ícones aceites. A área geométrica das barras é 24,09 %; a diferença é o suavizado dos bordos.

**A folga do `maskable`:** com `escalaDoMaskable` a passar de 1 para **0,85**, o ponto de tinta mais afastado fica a **196,8 px** do centro contra os 204,8 px do círculo seguro, **folga de 8,0 px e 0 píxeis fora**, medido nos píxeis do PNG escrito. Os 46 376 píxeis de sinal ocupam uma caixa de 290 × 266 em 111,123..400,388.

Deixei escrito no código porque é 0,85 e não outra: 0,90 dá meia-diagonal de 207,66 e fica fora; 0,88 dá 203,04 e passa com 1,76 px, menos do que o suavizado de um bordo; 0,80 daria 20,22 px de folga e um `maskable` visivelmente mais pequeno do que os outros três. Só o `maskable` encolhe; os três ícones «any» ficam ao enquadramento cheio, e neles a tinta sai do círculo de 40 % de propósito, porque quem lhes recorta a forma é o sistema e não o ficheiro.

## Os ficheiros

| ficheiro | bytes | nota |
|---|---|---|
| `apple-touch-icon.png` | 705 | 180 px, opaco (alfa mínimo 255, 0 abaixo), mancha 24,9 % |
| `icon-192.png` | 738 | enquadramento cheio |
| `icon-512.png` | 1945 | enquadramento cheio |
| `icon-512-maskable.png` | 2065 | escala 0,85, já diferente do «any» |
| `favicon.svg` | 994 | **não mudou um byte** |
| `favicon.ico` | 5430 | **não mudou um byte** |

Os dois favicons não mudaram porque o enquadramento deles já era este: era a cela que estava fora do passo, não o favicon.

## As réguas

- `tests/inicio/app.mjs`: **38 de 38 em verde**. A célula A3 continua a dar **0 píxeis fora** do círculo. A célula A4 passou a imprimir a mancha na prova, sem a julgar: a banda aceitável é decisão de direção e não de régua, e por isso o número sai na prova e não na condição.
- `--vermelhos`: **10 de 10 estragos apanhados**, saída 0.
- `npm run build` 0, `npm run verify` 0, `npm run typecheck` 0.
- Corri também `node design/marca/exportar.mjs app e2` e voltei a correr `app`, para confirmar que o parâmetro continua a refazer a marca de 28.08. Refaz.

Cabeçalho e manifestos ficaram como estavam.

## Os commits

`45c5c59` **As celas passam ao enquadramento do favicon: a mancha do 180 sobe de 9,5 para 24,9 %**, com caminhos explícitos (`design/marca/exportar.mjs`, `tests/inicio/app.mjs` e os quatro PNG) e os dois trailers. O ramo tem três commits: `5408528` (os ficheiros do diretor), `9938f36` (a ronda `app` com marca por parâmetro e os seis ficheiros de `public/`), `45c5c59`.

## Custo

Cerca de 235 mil tokens no total da sessão, dos quais uns 25 mil nesta segunda passagem.
