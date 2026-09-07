# As plantas do bloco F1.6, com o registo guardado

*Segunda passagem, 04.09.2026, Major 11 da leitura a frio do Codex: «as plantas
são narrativa e não prova reproduzível; o relatório descreve editar, correr e
reverter à mão, sem registos nem casos guardados». Passam a ser três `.patch` que
se aplicam à cabeça do ramo e três saídas guardadas tal como saíram, com o código
de saída no fim de cada uma.*

| planta | o que planta | régua | código de saída |
| --- | --- | --- | --- |
| `planta-1-periodo-a-mao` | um período escrito à mão no gabarito da página da linha (`2026-08` no lugar de `{atraso.periodoDaFonte}`) | `scripts/check-formas.mjs` (F13) | 1 |
| `planta-2-contador-a-zero` | o contador a zero com linhas atrasadas (`series_atrasadas` a `0` em `prova.mjs`) | `scripts/gate-html.mjs` | 1 |
| `planta-3-decisao-sem-carimbo` | a entrada do `DECISIONS.md` que governa o Método sem a linha `**Texto:**` | `scripts/check-ledger.mjs` | 1 |

## Como se repete

```
git apply design/especime-v3/medicoes/frescura-plantas/<planta>.patch
npx astro build && npm run cartoes     # só para as plantas 1 e 2
node <a régua da tabela>               # tem de sair 1
git apply -R design/especime-v3/medicoes/frescura-plantas/<planta>.patch
```

As saídas guardadas são as primeiras quatro mil letras de cada corrida, que é
onde a régua diz o que viu; a lista inteira das ocorrências não acrescenta nada e
faria destes ficheiros um registo em vez de uma prova.

**O verde é o da árvore reposta**, e é o do `build`, do `verify` e do `typecheck`
do fim do bloco: a planta reverte-se com o mesmo `.patch` ao contrário, e o
`git status` do fim mostra a árvore sem resto nenhum.
