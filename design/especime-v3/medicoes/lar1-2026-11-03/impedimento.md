# LAR1: paragem pela preservação do HTML servido

Estado: impedimento resolvido pela Adenda A. Ver [resultado verificado](relatorio-adenda-a.md). O diagnóstico abaixo conserva a decisão anterior.

A condição de paragem do §2 verifica-se antes de qualquer alteração ao código. A correção das tabelas exige alterar o HTML servido das edições guardadas, contrariando o §1.2.

## Prova

`src/lib/edicoes.mjs`, função `primeiraEdicaoServida`, passa o documento guardado por `comFaixa`. Em `src/lib/documentos.mjs`, `comFaixa` insere o CSS da moldura num elemento `style` do próprio HTML. As regras de apresentação do documento também estão embutidas.

As oito edições guardadas foram inspecionadas: cada HTML servido contém três elementos `style`, nenhuma ligação a uma folha de estilos externa e nenhuma importação CSS. Os SHA-256 dos oito HTML devolvidos pelos endpoints coincidem com os ficheiros correspondentes do `dist/` construído. Os valores e as rotas constam de `impedimento-html-guardado.json`.

A medição recebida em `antes/documentos.json` identifica excesso de largura nestas quatro edições guardadas:

- `/estudos/evora-2027-capital-europeia-da-cultura/documento/2026-10-01/`
- `/en/studies/evora-2027-capital-europeia-da-cultura/document/2026-10-01/`
- `/estudos/evora-contas-da-camara-2010-2025/documento/2026-10-01/`
- `/en/studies/evora-contas-da-camara-2010-2025/document/2026-10-01/`

Alterar o CSS embutido muda necessariamente os bytes e o SHA-256 do HTML servido. Passar a carregar uma folha externa também exigiria uma primeira alteração desse HTML. Uma alteração às folhas das páginas normais do sítio não chega a estes documentos.

## Estado e decisão necessária

Nenhum código de produção, documento original ou régua foi alterado. Não se implementaram as correções, `check:largura` ou a recusa nas capturas. Não existe medição posterior a uma correção, nem se apresenta uma comparação antes/depois como se a correção tivesse sido feita.

Para retomar, a direção terá de rever expressamente o §1.2: permitir alterar apenas o CSS da moldura no HTML servido, preservando os bytes do documento original, ou manter o HTML servido imutável e aceitar que estas edições continuam com excesso de largura. A primeira opção é a recomendada para cumprir o objetivo visual, mas não está autorizada pelo mandato atual.

## Verificação

Foi iniciada uma única construção integral da versão de partida, por `curto.sh`. O resultado final acompanha este relatório no ficheiro `verificacao.json`. Não correram os três portões, conferências de navegador, plantas ou capturas. Os ficheiros recebidos em `antes/` ficaram intactos e não entram no commit deste diagnóstico.

A construção de partida terminou com código `0`, em `554 segundos`. Até à receção desse resultado foram usadas 29 chamadas de ferramentas. Houve uma corrida de construção, com as conferências que o próprio `build` inclui, e nenhuma corrida avulsa ou dos três portões.
