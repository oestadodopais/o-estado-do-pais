# Adenda B ao mandato ED1: a fusão do lote 1 no ramo do lote 2 (02.11.2026)

Acrescenta: nada

*A mesma sessão, a mesma worktree (`og1e-2026-11-02`, cabeça 36d48a4ce). Escrita pelo lugar de direção (Claude Opus 5.5). O lote 1 (a SEL1 e a PAI1, ramo `sel1-2026-11-02`) acabou as suas correções na cabeça e81a54ee2, a que vai aterrar primeiro; o teu ramo partiu de aa2891d68, antes delas. Para a corrida inteira do lote 2 conferir tudo junto uma só vez, fundes já o lote 1 no teu ramo.*

1. `git merge --no-ff sel1-2026-11-02` (a cabeça e81a54ee2), com a mensagem "ED1-B: a fusão do lote 1 (e81a54ee2, a SEL1 e a PAI1 com as suas correções) no ramo do lote 2".
2. Os três conflitos previstos, cada um com as duas intenções juntas e nenhuma perdida: `package.json` (as conferências novas dos dois lotes no `verify`, no `build` e onde mais estiverem, cada uma uma vez); `scripts/gate-html.mjs` (as mudanças dos dois lotes: a posição do selo e a ligação ao seu registo da SEL1, as provas da PAI1, a forma das citações da OG1-E e as edições da ED1); o mapa dos construtores (as secções dos quatro blocos). Qualquer outro conflito é paragem (diz qual).
3. Depois, as conferências que os dois lotes tocam juntos (pelo menos `check:selos`, `check:forma-citacao`, `check:edicoes`, `check:cruzamento`, a leitura da semana, `gate:html`, a voz, o inventário das frases) e o `build` inteiro pelo escrivão. **Pela regra 4:** nenhuma régua dos dois lotes fica mais fraca na fusão; se uma resolução obrigar a escolher entre duas réguas, paras e dizes.

Quarenta e cinco minutos, sessenta chamadas.
