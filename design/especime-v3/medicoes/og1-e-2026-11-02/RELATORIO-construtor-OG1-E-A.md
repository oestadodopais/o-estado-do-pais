Implementado e comitado. As duas worktrees ficaram limpas. A corrida completa teve duas falhas, entretanto corrigidas e reconferidas individualmente; não foi repetida.

- **Antes:** cinco linhas recusadas, com 40 ocorrências nas oito rotas do estudo do Orçamento e do respetivo dossiê, incluindo documento e texto, em português e inglês.
- **Depois:** zero recusas nas **9817 páginas** construídas.
- **Livro:** 92 afirmações declaradas, 15 `relato` e 77 `palavras`. Nenhuma das 77 contém os marcadores proibidos.
- **Plantas:** 18 no motor e 74 no sítio. As formas indevidas são recusadas; os controlos passam, incluindo o documento depois da citação. Códigos esperados: recusa `1`, controlo `0`.
- **Portões:** `build.codigo = 0`, `verify.codigo = 1`, `typecheck.codigo = 0`. Após corrigir as duas falhas, `provar:guardas`, `check:eo1`, `check:forma-citacao`, `typecheck` e `gate:html` passaram com código `0`. O `core.gate` passou no commit do motor.

Commits: motor `7cefce1`; sítio `364bb6d06`, `62b5a86bd`, `fdc8593da` e `96482cd40`. O quarto commit do sítio contém as correções reveladas pelo `verify`.

Consumo: **120 chamadas de ferramentas**, **26 conferências dirigidas**, uma corrida completa dos portões e um `core.gate`. Falta a conferência integral de aterragem por `conferir-tudo.sh`.