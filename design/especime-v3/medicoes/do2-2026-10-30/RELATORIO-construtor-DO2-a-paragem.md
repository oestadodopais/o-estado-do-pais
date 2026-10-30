Parei pela condição da adenda: **`scripts/voz-pais.mjs` mantém outra lista fechada, não nomeada**, que recusa a nova forma na primeira página e em Temas. Falta abranger a validação dessas entradas nessa régua.

A implementação parcial ficou na worktree, sem commits. O HTML construiu e os testes das novidades e dos dossiês passaram. `check:datas` ainda espera três estudos na porta Estado e economia; agora aparecem dois, porque o terceiro está representado pelo dossiê.

No HTML português, a caixa apresenta estas cinco entradas:

| Tipo | Título | Data ou contagem |
|---|---|---|
| estudo | A casa em Portugal e na Europa | 29.10.2026 |
| Dossiê | O Orçamento de 2027 | 5 peças, a mais recente de 29.10.2026 |
| explicação | Para onde vai o dinheiro do Estado em 2026 | 06.10.2026 |
| estudo | Évora 2027, Capital Europeia da Cultura: o que a candidatura prometeu, o que o painel europeu escreveu e o dinheiro nos atos públicos | 01.10.2026 |
| estudo | As contas da Câmara de Évora, 2010 a 2025: o orçamento, a cobrança, a dívida e a certificação | 01.10.2026 |

Na edição inglesa:

| Tipo | Título | Data ou contagem |
|---|---|---|
| study | Housing in Portugal and in Europe | 29.10.2026 |
| Dossier | The 2027 Budget | 5 pieces, the most recent from 29.10.2026 |
| explainer | Where the State’s money goes in 2026 | 06.10.2026 |
| study | Évora 2027, European Capital of Culture: what the bid promised, what the European panel wrote and the money in the official acts | 01.10.2026 |
| study | The accounts of the Câmara de Évora, 2010 to 2025: the budget, what was collected, the debt and the certification | 01.10.2026 |

O bloco da discussão imprime uma linha em cada edição:

- «Dossiê: O Orçamento de 2027 · 3 textos em discussão →»
- «Dossier: The 2027 Budget · 3 texts under discussion →»

As medições antes/depois deram:

| Medida | Antes | Depois |
|---|---:|---:|
| Entradas do inventário | 2490 | 2490 |
| Vivas / condicionais / retiradas | 1278 / 2 / 1210 | 1278 / 2 / 1210 |
| Frases rendidas | 3736 | 3742 |
| Vivas sem rendição | 0 | 8 |
| L1, páginas com destinos repetidos | 3460 | 3460 |
| Destinos repetidos na primeira página, por edição | 24 | 23 |

O inventário ainda não foi atualizado.

**Códigos lidos dos `.codigo`:** construções Astro antes/depois `0/0`; L1 `0/0`; medições do inventário `0/0`; `check:dossies` `0`; `check:voz` `1`; `check:datas` `1`.

Ficaram por fazer a atualização do inventário e do mapa, as cinco plantas da adenda, as restantes conferências, `npm run build`, o portão final, a leitura a frio e as capturas. Nenhum portão foi enfraquecido.

**Consumo desta retoma:** 23 chamadas de `functions.exec`; duas construções Astro e sete corridas de conferências ou medições; zero corridas dos três portões; zero commits.