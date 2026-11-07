# A leitura curta da adenda A da VIG2 (M48), 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 16 chamadas pelo harness (15 pela contagem do leitor), 333 s, sobre o pacote `pacote-vig2-curta-a-2026-11-07` (o diff do motor 1c38c4a..155a9f2; o do sítio 238ab8afd..af37d8ec0). Condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| J1 | a designação só junta espaços, e as quebras de linha ficam | 1 |
| J2 | a verificação volta ao título em bruto | 2 |
| J3 | a prova deixa de exigir uma só ocorrência | 3 |
| J4 | a prova deixa de conferir que o índice fica intacto | 4 |
| J5 | o relatório dá à parte 4 do índice real 2 504 bytes | 5 |

Cinco em cinco. Nenhum achado real Blocking nem Major; os Minor vão para a higiene: a verificação não confere nada num resumo de uma parte (já era assim antes do bloco, o 6); o campo `designacoes_omitidas` copia uma constante (o 7); três blocos da medição escritos à mão e não pelo guião (o 8); as medidas do índice real e de 12.10 são afirmações dentro do pacote, coerentes entre si (o 9); uma quebra de linha numa descrição parte a linha sem a verificação o ver (o 10). A VIG2 A aterra com o gate verde.

## O relatório do leitor (condensado)

**Blocking.** 1. No diff, `designacao_resumo` devolve o título igual (planta J1). 2. No diff, a verificação compara com o título em bruto (planta J2).

**Major.** 3. No diff, a prova de uma ocorrência nunca falha (planta J3). 4. No diff, a prova do índice intacto é um `pass` (planta J4). 5. O relatório dá 2 504 bytes à parte 4 (planta J5).

**Minor.** 6. Com uma parte só, a verificação não confere nada. 7. `designacoes_omitidas: 0` é uma constante. 8. A contagem das provas, os tempos e o consumo foram acrescentados à mão ao ficheiro das medidas. 9. As medidas do índice real e de 12.10 são afirmações no pacote. 10. As descrições não se normalizam, e uma quebra de linha numa descrição passaria.

**O que está bem:** o diff do sítio bate com as cópias; o diff do motor só toca o resumo, a verificação e as provas; com o código copiado, as três formas dão uma linha cada, dez das onze provas passam e as duas novas mordem; a verificação lê o texto entregue e recusa uma designação a mais e uma a menos; o índice não muda; o limite de 2 500 bytes fica igual e provado a 2 500 e 2 501; o guião da medida fixa o resumo do índice real e recusa uma designação real tirada.
