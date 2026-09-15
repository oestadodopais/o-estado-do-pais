# As medições do bloco F1.13, como saíram das réguas

*15.09.2026, ramo `porta-2026-09-15`. Estes ficheiros são as SAÍDAS das réguas e
dos portões, tal como elas as escreveram, e entram no ramo pelo achado 4 da
leitura a frio do Codex: «the browser measurements, accessibility result, gate
exits, full-site counts, plants, and screenshots claimed by the report have no
packaged results and therefore remain unproven». Um relatório que cita um número
sem a saída ao lado pede confiança em vez de a merecer, e o pacote da leitura
seguinte leva-os.*

**Nada aqui foi editado à mão.** O que se lê é o que o comando imprimiu, com as
sequências de cor do terminal tiradas (`sed 's/\x1b\[[0-9;]*m//g'`), que é o que
as torna legíveis num diff.

| ficheiro | o que é, e o comando que o escreveu |
|---|---|
| `capturas-porta.mjs` | o guião das 40 capturas, com a rota de cada nome declarada. `node …/capturas-porta.mjs --momento=antes\|depois` |
| `porta.json` | as 40 células da régua da primeira página e as suas medidas, com os três estados da gaveta dos nomes. `node tests/inicio/porta.mjs --json …/porta.json` |
| `porta.txt` | a mesma corrida, impressa, com os 22 estragos plantados. `node tests/inicio/porta.mjs --vermelhos` |
| `mapa-unidades.txt` | as 34 células do mapa das unidades, com a U4 (o estado sem guião). `node tests/inicio/mapa-unidades.mjs` |
| `lista.txt` | as 94 células da lista dos nomes. `node tests/inicio/lista.mjs` |
| `leitura.txt` | as 26 células da leitura breve, com a J5 (o índice dos domínios). `node tests/inicio/leitura.mjs` |
| `faixa.txt` | as 80 células da faixa. `node tests/inicio/faixa.mjs` |
| `check-lugar.txt` | os tetos do `check:lugar`, com a L3, o chão do Método por edição e o autoteste dos rótulos das marcas. `npm run check:lugar` |
| `coluna-do-valor.mjs` e `.txt` | a coluna do valor de uma medida a 1 280, antes e depois, nas nove áreas e no índice dos números, nas duas edições (achado 10). `node …/coluna-do-valor.mjs <dist-antes> <dist-depois>` |
| `blocos-a-390.mjs` e `.txt` | a decomposição da altura da primeira página a 390, bloco a bloco, antes e depois (a gaveta, a busca, o índice dos domínios). `node …/blocos-a-390.mjs <dist-antes> <dist-depois>` |
| `portoes.txt` | os três portões e os códigos de saída lidos dos ficheiros |

**Os dois guiões de medição entram com as suas saídas**, e não só as saídas: um número tem o comando ao lado, e o comando tem o código que o produziu. Os outros ficheiros saem de réguas que já viviam no repositório.

**O «antes» é a construção de `bb0b4c39`**, a cabeça de que este ramo saiu, e não
uma memória: onde há um antes e um depois, os dois lados foram medidos pela mesma
régua sobre as duas construções, e o comando está na linha do ficheiro.
