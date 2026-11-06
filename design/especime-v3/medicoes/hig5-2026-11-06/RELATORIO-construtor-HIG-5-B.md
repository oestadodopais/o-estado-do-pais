Commit `777d906a1` criado pelo escrivão, com os trailers exigidos. Apenas os dois ficheiros previstos foram alterados; worktree limpa. Nenhuma regra enfraquecida nem renderização fora de `LinhaView.astro`.

| Verificação | Código |
|---|---:|
| `build` completo | 0 |
| `check:fontes` | 0 |
| `check:cartao` | 0 |
| `gate:html` | 0 |

O `gate:html` passou com avisos, sem erros.

Frases extraídas dos dois recibos pedidos em `dist/`, duas vezes em cada página:

- PT: «Sem resposta a 01.09.2026 · na conferência automática»
- EN: «No answer on 01.09.2026 · in the automated check»

Contagem integral do HTML, num comando por edição:

| Expressão | Ocorrências |
|---|---:|
| PT nova: `na conferência automática` | 8 |
| PT antiga: `à conferência automática` | 0 |
| PT nova: `nesta máquina` | 0 |
| PT antiga: `a esta máquina` | 0 |
| EN nova: `in the automated check` | 8 |
| EN antiga: `to the automated check` | 0 |
| EN nova: `on this machine` | 0 |
| EN antiga: `to this machine` | 0 |

Consumo: 30 chamadas de ferramentas; um build completo e três conferências explícitas. Nenhuma corrida conjunta dos portões nem capturas.