**Passagem interrompida pelo §5: `check:discussao` devolveu 1, com 48 erros de integração.** Não houve commits nem corrida dos três portões finais. As alterações ficaram na worktree.

Estão construídos os dois dossiês e o índice, nas duas línguas, com ligações nas peças, nas novidades, nas portas de assunto e em Temas. O menu manteve-se. Nenhuma linha foi acrescentada ao livro.

Códigos finais lidos dos ficheiros `.codigo`:

| Conferência | Código |
|---|---:|
| `check:indice-do-sitio` | 0 |
| `check:lingua` | 0 |
| `typecheck` | 0 |
| `tests/inicio/novidades.mjs` | 0 |
| `check:dossies` | 0 |
| `check:lugar` | 0 |
| `check:discussao` | **1** |
| `check:voz` | **1** |

O teste novo dos dossiês recusou 18 plantas. As contagens medidas foram:

- Ligações no corpo do índice: **441 → 444**, por edição.
- Frases do inventário: **2 419 → 2 476**, com 57 acrescentadas; classificação ainda incompleta.
- L1: **3 456 → 3 458** páginas. Medição registada com seis plantas.

Ambiguidades e pendências:

- **DO1-1:** «peças» foi apanhada pela L3. Alterei «As peças abaixo» para «Os textos abaixo», também em inglês, sem mudar a lista proibida.
- **DO1-2:** a conferência da discussão não reconhece a pertença a um dossiê como condição das ligações. Também interpreta os tokens dos novos títulos e âmbitos como referências que exigem portas de discussão. [Registo]( <temporário>)
- **DO1-3:** a voz recusa os novos elementos de Temas, falta classificar «Afirmação:» e «Claim:», e a regra «a casa» apanha o título sobre habitação. [Registo](<temporário>)

Ficaram abertos esses erros, a secção DO1 do mapa dos construtores, os commits e os portões finais. Não foram feitas capturas.

Consumo: **43 chamadas a `functions.exec`, 20 corridas de conferência ou medição e seis construções locais**. Nenhuma corrida completa dos portões.