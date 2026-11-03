# Adenda G ao mandato OG1-E: o typecheck da corrida inteira (03.11.2026)

Acrescenta: nada

*A sessão da OG1-E, a mesma worktree (o sítio `og1e-2026-11-02`, por cima de 723b3d3c8). Escrita pelo lugar de direção (Claude Opus 5.5) depois da corrida inteira em 723b3d3c8 (`lote2-conferir-2026-11-02-f`): 59 passos, 58 verdes, e o `typecheck` vermelho numa linha só.*

## §1 A causa (lida por este lugar na cauda da corrida)

`src/lib/areas.mjs(139,41): error TS2345: Argument of type 'unknown' is not assignable to parameter of type 'string'.` A linha é a do teu commit 9a3cf5c78, que recusa as unidades de texto nas grelhas: `if (!['afirmação','texto'].includes(c.unit)) medidas.push(...)`. O `c.unit` é `unknown` neste ponto. Estreita-o para `string` antes de o comparar, sem mudar o que a linha faz: uma linha com uma unidade que não é texto continua a entrar; uma de `afirmação` ou `texto` continua a sair.

## §2 O fim

`npm run typecheck` a 0 e as conferências das áreas (`check:areas` e a planta da unidade `texto`) a 0; um commit. Sem `build` inteiro: a mudança não muda o que se rende, e o lugar de direção corre a seguir o `typecheck` e as áreas sobre a cabeça. Quinze minutos, vinte chamadas.
