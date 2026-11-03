# Adenda B ao mandato LAR1: o texto oculto do registo volta a uma só linha (03.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. A leitura a frio do lote 3 apanhou as cinco plantas; real, no que fizeste, só isto, conferido por este lugar.*

## §0 Medido

- `.vh` (`src/styles/site.css:80`) é o padrão do texto só para leitores de ecrã: `position: absolute`, 1 px por 1 px, `overflow: hidden`, `clip: rect(0 0 0 0)` e `white-space: nowrap`. O `nowrap` é a parte que impede alguns leitores de ecrã de juntar palavras.
- Um elemento assim não alarga a página. Na medida de antes, a 1 280 px a página das correções tinha 4 045 px sem nenhum elemento de `.vh` para lá do ecrã; os valores de `.registo-mudanca-par` chegavam. A 390 px, os `.vh` listados estavam em linhas que esses valores já tinham empurrado.
- A regra nova de `src/styles/leitura.css` (`.registo-mudanca .vh { white-space: normal; overflow-wrap: anywhere; }`, junto com os campos do valor antigo e do novo) tira esse `nowrap` ao texto oculto do registo, sem que a largura o peça.

## §1 O que fazes

1. `.registo-mudanca .vh` sai dessa regra; a regra fica só nos campos do valor (`old_value` e `new_value`).
2. Provas, no `dist/` construído:
   - a `check:largura` verde, com a planta;
   - num navegador, o `white-space` calculado de um `.vh` dentro de `.registo-mudanca` é `nowrap`, nas duas edições;
   - a página das correções com 390 px a 390.
3. Um commit, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Vinte minutos, vinte e cinco chamadas.

## §2 Quando paras

Se a página das correções passar a largura do ecrã sem a regra no `.vh` (diz o elemento e a medida).
