A data e o inventário estão corrigidos e comitados. **A verificação integral da cabeça final ficou por fazer.**

No HTML construído:

- PT: **publicado a 30.10.2026**
- EN: **published on 30.10.2026**

As linhas **3010 e 3037** passaram de `retirada` a `viva`: ambas regressaram à primeira página do DO2. Nenhuma outra linha viva deixou de aparecer.

Commits: `0271a71d` (data), `518ae99c` (inventário) e `718114b8` (precondição das plantas DO2). Motor intacto em `db5edb2d`; árvores limpas.

| Código lido | Resultado |
|---|---:|
| `build.codigo` | 1 |
| `verify.codigo` | 125, não executado |
| `typecheck.codigo` | 0 |

O `build` falhou porque a planta exigia um estudo suprimido que a seleção atual não tinha. Corrigida essa precondição, **`check:pais`, `check:voz` e `typecheck` passaram**. Não repeti a corrida completa.

[Relatório completo](<temporário>). Consumo: **29 chamadas**, uma corrida dos portões, uma medição e três conferências dirigidas após a falha.