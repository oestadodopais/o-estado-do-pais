# PP1b · a resposta curta do construtor à passagem de correção

*Claude Opus 5.5, construtor do bloco PP1, a 28.09.2026. Worktree `<worktree do sítio>`, ramo `pp1-2026-09-28`. Sem travessões.*

**Os três portões da passagem** correram na cabeça `56c7ed7b`, cada um no seu comando, com o código lido do ficheiro que acabou de escrever em `portoes/pp1b/`:

| Portão | Código | Cabeça | Início e fim (UTC) |
| --- | --- | --- | --- |
| `npm run build` | 0 | `portoes/pp1b/build.cabeca` | `portoes/pp1b/build.inicio`, `portoes/pp1b/build.fim` |
| `npm run verify` | 0 | `portoes/pp1b/verify.cabeca` | `portoes/pp1b/verify.inicio`, `portoes/pp1b/verify.fim` |
| `npm run typecheck` | 0 | `portoes/pp1b/typecheck.cabeca` | `portoes/pp1b/typecheck.inicio`, `portoes/pp1b/typecheck.fim` |

Os registos levam o caminho da árvore trocado por `<worktree do sítio>` (`portoes/pp1b/caminhos-trocados.json`); os códigos não se tocaram. O commit que traz esta resposta vem a seguir a essa cabeça e só toca ficheiros da pasta de medições do bloco.

**O que a passagem fez**, com o pormenor e as medidas na secção 11 de `LEIA-ME.md`:

1. **O mínimo de três blocos na construção de produção (achado 6):** `npm run sinais` no fim da cadeia do `build`, a escrever o ficheiro dos sinais em qualquer construção; a terceira planta corre o passo como a cadeia o corre, com um resolvedor que recusa tudo, e o passo sai com 1.
2. **A pesquisa da primeira página provada a interagir (achado 7):** `tests/inicio/pesquisa-da-primeira.mjs`, no `check:primeira`, com os cinco passos da H15 nas duas edições e duas larguras, o caminho sem guião medido até à porta de Mourão, e duas plantas (a ligação do campo partida, o formulário sem destino).
3. **As dez entradas no mapa do sítio (achado 8):** a E5 da célula das entradas, com as plantas de uma rota em falta e de um mapa nomeado que a construção não tem.
4. **As capturas e as páginas congeladas (achado 10):** as 84 capturas e as páginas congeladas refeitas na construção de `56c7ed7b`, a cabeça que os portões mediram; a planta do valor revisto também correu nessa cabeça.

**O que ficou por fazer:**

- a manchete de «Portugal na União Europeia» ainda prende as contagens do veredicto no inventário das frases (a revisão B da planta do valor revisto fecha a construção no `check:voz`); é outra página e outra célula;
- o achado 4 (as medidas com os quadros de referência por conferir, sem o dizer nos cartões) é anterior ao bloco, e fica na questão que o lugar de direção abre;
- o `package-lock.json` da árvore está mudado no campo `engines`, e não pelo construtor; fica fora dos commits;
- o custo em símbolos é o que a ferramenta reporta ao lugar de direção.
