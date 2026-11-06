O build completo continua vermelho: a conferência da discussão exige uma ligação no recibo de exemplo, incompatível com a prosa fechada atual. Nenhuma régua foi alterada.

Commit **`14df684f9`**, com árvore limpa. Eurostat passou a usar a língua declarada no registo; o passo inglês e a lista fechada foram corrigidos.

| Verificação | Código |
|---|---:|
| Build completo | 1 |
| `check:lingua` | 0 |
| Plantas do Método, 44 | 0 |
| `tests/metodo/construido.mjs` | 0 |
| `check:discussao`, reprodução | 1 |

Passo 4 copiado do `dist/`:

**PT:** A direção escreve o que muda e as frases que o leitor vai ler, conferidas na fonte.

**EN:** The directing model writes what changes and the sentences the reader will read, checked against the source.

O marcador `[a verificar]` mantém zero ocorrências nas duas edições. Relatório e medições ficaram em `design/especime-v3/medicoes/met1-2026-11-05/adenda-a/`.

**Custo:** 21 chamadas de ferramentas; cinco execuções de verificação. Falta resolver a integração com a discussão para fechar o build.