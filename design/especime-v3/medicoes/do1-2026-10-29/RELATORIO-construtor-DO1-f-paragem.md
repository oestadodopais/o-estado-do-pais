Parei pela condição final da adenda F: apareceu outra lista fechada, [RETIRADAS_DENTRO_DE_FRASE](<caminho>).

A régua acusa as seis formas antigas retiradas porque continuam dentro das novas:

- `estudo ·`, `explicação ·`, `o que se discute ·` dentro das formas com `Dossiê:`.
- `study ·`, `explainer ·`, `under discussion ·` dentro das formas com `Dossier:`.

É necessário decidir essas seis correspondências na lista, conservando a recusa das formas antigas fora delas.

As alterações ficaram na worktree, **sem commit**. O HTML construído já mostra:

- Data mais recente: `28.10.2026`, origem `escrita.declarada`, nas duas edições.
- Calendário: «Votação final global · 24.11.2026» / «Final global vote · 24.11.2026», com fonte.
- Um dossiê, sem secção de correções.

Códigos lidos:

| Execução | Código |
|---|---:|
| L1 anterior | 0 |
| Construção temporária de `71d85e4ce` | 0 |
| `npm run build` | 1, parou na voz |
| `check:dossies` | 1, erro no argumento do teste, corrigido mas ainda não repetido |
| Medição do inventário | 0, com os achados acima |

O `gate:html` passou dentro do build. O diff literal, a nova medição da L1 e as restantes conferências ficaram pendentes. Não corri navegador nem portões pelo escrivão.

**19 chamadas de ferramentas; 3 conferências ou medições dirigidas; 2 construções.**