# EV3-p, adenda D: edição declarada e build verde

A declaração `LINGUA_DAS_EDICOES` passou a nomear «06.11.2026», com o mesmo valor `null`. A edição «03.11.2026» saiu desta tabela porque nenhuma linha do livro-razão a usa. A única linha que usa «06.11.2026» é `correcoes-publicadas`. Nenhuma régua foi alterada.

## Pesquisa antes do build

O guião `auditar.mjs` examinou 4999 ficheiros das fontes, scripts, testes, livro-razão, manifesto e inventário. Guardou as ocorrências das duas datas e os candidatos com datas e referências a edições, tetos ou inventários em `auditoria.json`. Depois da substituição, a comparação integral das edições usadas com a tabela de línguas encontrou zero chaves em falta e zero chaves sem uso.

Não se identificou outra lista que precisasse de acompanhar esta edição:

- O teto L1 e a sua medição já incluem as duas edições guardadas, pela adenda C.
- O manifesto, as edições de Évora em `studies.mjs`, o registo em `correcoes.mjs`, a história do valor e o inventário já incluem a correção de 06.11.2026. As referências à edição guardada de 03.11.2026 permanecem históricas.
- As datas de 03.11.2026 na habitação e no seu cruzamento pertencem a outra peça. Não acompanham a correção de Évora.
- As restantes ocorrências são datas de comentários, da isenção VOZ-1, de medições anteriores e de cenários das plantas. Não são declarações da edição corrente do livro-razão.

A primeira execução da pesquisa excedeu o buffer da listagem Git. O guião passou a pedir apenas as pastas examinadas e a reservar um buffer explícito; a execução seguinte terminou com código 0. Não se usou o resultado incompleto.

## Códigos

| Conferência | Código | Execução |
| --- | --- | --- |
| build completo | 0 | `npm run build`, 703 segundos medidos |
| check:lingua | 0 | Encadeada no build |
| check:voz | 0 | Encadeada no build |
| check:edicoes | 0 | Encadeada no build |
| check:lugar | 0 | Execução isolada depois do build |
| Auditoria das declarações | 0 | Antes do build |

A conferência isolada do lugar confirmou 38 estudos, 38 edições atuais, 8 primeiras edições e 26 plantas recusadas; as plantas L1 do quadro passaram nas duas línguas. Os códigos e os registos estão nesta pasta.

O motor permanece em 983b19eee29d4653730a62e9ee1d9674345db308. Não houve publicação, corrida completa dos portões nem capturas.

## Orçamento

15 chamadas de ferramentas de orquestração, incluindo o commit e a verificação final. Quatro execuções principais: duas tentativas da auditoria, um build completo e uma conferência isolada `check:lugar`. As conferências de língua, voz e edições correram dentro do build. Não foi exposta uma linha «tokens used».
