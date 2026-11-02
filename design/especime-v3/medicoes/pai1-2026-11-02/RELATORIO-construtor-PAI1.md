O painel está integrado e o build passou. **Mantive os selos históricos `exported_row_sha256` das travessias e de `hb1/rotulos.json`; esse formato não foi migrado.**

- `5bf2c209a`: projeção única, usada por JavaScript e Python, excluindo apenas `verifications`. Atualizadas as provas HB1 e as duas provas de linhas em `pensao-rp4n.json`.
- `9518b5565`: painel de 02.11. O `cherry-pick` foi bloqueado pela sandbox; apliquei o patch pelo escrivão. Confirmei igualdade do patch, da mensagem e dos 93 ficheiros com `7b743d896`.

As plantas ficaram no `check:cruzamento`, incluído no `verify`. Nas quatro linhas HB1 e nas duas RP4-n: **valor alterado = 1; fonte alterada = 1; releitura = 0**.

Códigos finais lidos dos ficheiros `.codigo`: **build = 0; check:cruzamento = 0; typecheck = 0**. Worktree limpa.

Hashes HB1, com o prefixo comum `sobrecarga-do-custo-da-habitacao-`:

| Sufixo | Antes | Depois |
|---|---|---|
| `2025` | `bfb3255df883efbdb9d23df5eac848c5e820d0c3c9185195fb2c411a43dc0696` | `ac205a12d255022ff44013282f07ca29cf6d0797ace09f28c5b359d62cebcd9b` |
| `2025-ue` | `3a9e18bde6e19ad98bfd0f0df2449f45d8d723dd889a18f5de78d9f025849708` | `5347ae31da4e57990a4659fea889dcfb74a84a1576e17c9563b10d20b919ab36` |
| `inquilinos-mercado-2025` | `37447737f7517ff276cb18ef016f7cc0e9b887fbae67bf39405ee5d6164401be` | Igual |
| `inquilinos-mercado-2025-ue` | `aefb881e490194f29c5326f902f07c86861dfd07fb2be5e24ba4c86210721a1a` | Igual |

As duas últimas não tinham `verifications`. O painel altera apenas duas das quatro linhas HB1.

Consumo: **47 chamadas de ferramentas; 8 corridas de verificação**, incluindo uma tentativa de teste corrigida e um único build completo. Não corri o `verify` integral nem capturas.