DO2 implementado e comitado. A worktree está limpa.

- **Build completo: 0**, em `d57d58b2`.
- **Conferências finais: 0**. A régua das frases compostas passou com **60/60 plantas** após corrigir apenas a planta de largura, em `64443cbb`.
- **Capturas: 0**, dez páginas nas cinco larguras, sem extravasamento horizontal. Os PNG ficam locais; o recibo e os hashes estão comitados.

As entradas agrupadas imprimem:

- PT: «Dossiê · O Orçamento de 2027 · 5 peças, a mais recente de 29.10.2026»
- EN: «Dossier · The 2027 Budget · 5 pieces, the most recent from 29.10.2026»
- PT: «Dossiê: O Orçamento de 2027 · 3 textos em discussão →»
- EN: «Dossier: The 2027 Budget · 3 texts under discussion →»

| Medida | Antes | Depois |
|---|---:|---:|
| Entradas do inventário | 2490 | 2504 |
| Vivas / condicionais / retiradas | 1278 / 2 / 1210 | 1284 / 4 / 1216 |
| Frases rendidas | 3736 | 3742 |
| Destinos repetidos na primeira página, por edição | 24 | 23 |
| L1, páginas com destinos repetidos | 3460 | 3460 |

O inventário terminou sem frases por classificar, vivas ausentes ou retiradas reaparecidas. O [relatório completo](<caminho>) contém as cinco entradas de cada caixa, os códigos e a identificação das construções verificadas.

Commits desta retoma: `346668a3`, `4c12d10e`, `0097f06b`, `d57d58b2`, `64443cbb`, `c33bbb90`.

Ficam com o lugar de direção a corrida inteira na cabeça e a leitura a frio. O bloco `do2` permanece **por ler**.

**Consumo:** 62 chamadas de `functions.exec`; 25 corridas principais de conferências/construção, incluindo o controlador das seis execuções do portão nas plantas; uma corrida de capturas.