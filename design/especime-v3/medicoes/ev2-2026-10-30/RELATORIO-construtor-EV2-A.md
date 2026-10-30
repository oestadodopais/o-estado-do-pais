**Parei novamente pelo §4.** O hook do motor recusou o commit em `publisher.voz_test`:

| Referências | Esperadas | Encontradas |
|---|---:|---:|
| Antes | 8342 | 8350 |
| Depois | 8334 | 8342 |

A adenda autorizava apenas a contagem R7. Não alterei esta segunda expectativa.

Estado verificado:

- **Motor:** conserva `48ee167e`; a atualização R7 para 1656 está preparada no índice, por comitar.
- **Sítio:** o pedido já entregue ao escrivão foi aceite como **`ae7720fe2`**. Inclui a travessia, as duas edições datadas de **29.10.2026**, o inventário e o mapa. A árvore está limpa.
- **Conferências dirigidas:** passaram as quatro suites do motor e `ledger:check`, `check:registo` e `check:documentos`.
- **Portões finais:** não correram; não há códigos `.codigo` desta retoma.

As contas continuam verificadas: **7,4%**, **42 220 018 €** e **45,6%**. Nenhuma linha anterior mudou; o estudo 07 e `ledger/` ficaram intactos.

O [relatório completo](<temporário>) contém a aritmética, as oito passagens compostas, as decisões e as pendências. A [saída do hook](<temporário>) conserva a falha.

Consumo da retoma: **40 chamadas de ferramentas, sete conferências dirigidas e uma corrida do `core.gate` pelo hook**. Zero corridas dos portões finais.