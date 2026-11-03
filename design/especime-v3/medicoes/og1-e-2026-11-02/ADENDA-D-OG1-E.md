# Adenda D ao mandato OG1-E: os 26 publicadores errados são correções, ditas no registo uma a uma (02.11.2026)

Acrescenta: frases

*A sessão da OG1-E, as mesmas worktrees (o sítio `og1e-2026-11-02`, por cima de 419989dd3, a adenda F da ED1; o motor `og1e-2026-11-02`, 6b1b38c). Escrita pelo lugar de direção (Claude Opus 5.5) depois de ler a tua adenda C. O mandato pedia "uma entrada de correção do campo"; arquivaste-as como revisões de proveniência. A política pública diz dessas que "não são erros" e que "não se listam aqui uma a uma", e por isso 26 erros sobre quem publicou um documento ficavam corrigidos sem aparecer no registo, ditos como não-erros. É o que a página das correções existe para impedir. A causa é o modelo: uma entrada `correcao` não aceita `field`. Uma só passagem (a M99).*

## §0 Medido (02.11.2026, por este lugar, na cabeça 419989dd3)

- `src/lib/ledger.mjs`: `CAMPOS_CORRECAO` sem `field`; `field` só numa entrada `proveniencia` (linhas 1010, 1019 e 2636 a 2660); a contagem por natureza nas linhas 1543 a 1545.
- `ledger/claims/*.yml`: 94 entradas `proveniencia`, 26 delas de 02.11.2026 (as tuas) e 68 anteriores. Este lugar leu os motivos das 68: são endereços que o publicador rodou, datas de acesso e excertos que passaram a transcrever o valor revisto, mudanças depois da publicação, salvo as 4 de 15.08.2026 das linhas `municipios-portugal-caop-2025`, `-continente-`, `-acores-` e `-madeira-`, cujo endereço antigo "não é, nem nunca foi, uma página que se possa abrir": estava errado quando se publicou.
- As naturezas e a política estão em `src/i18n/strings.mjs` (pt perto da linha 2005, en perto da 4014); a contagem `correcoes-publicadas` e a sua definição, nas fontes que a tua procura encontrar.

## §1 A regra e o modelo

1. **A regra:** um campo do recibo que estava errado quando se publicou é uma correção; um campo que a fonte mudou depois é uma revisão de proveniência. Uma entrada `correcao` pode trazer `field` (um dos `CAMPOS_DE_PROVENIENCIA`) quando o que estava errado é esse campo; sem `field`, é o valor, como hoje, e a conferência da história do valor não muda para essas. Com `field`, o `new_value` tem de ser o valor atual desse campo na linha e o `old_value` tem de ser outro. Uma entrada sobre `source` (quem publicou) é sempre `correcao`. Plantas: uma `correcao` com `field` cujo `new_value` não é o campo atual; uma `proveniencia` sobre `source`; uma `correcao` sem `field` com a história do valor partida (continua a morder).
2. **As 30 entradas:** as tuas 26 e as 4 da CAOP de 15.08.2026 passam de `proveniencia` a `correcao`, com o mesmo `field`, a mesma data, os mesmos valores e os mesmos motivos. As outras 64 ficam como estão.
3. **O registo** lista-as uma a uma como as outras correções, com o nome do campo antes dos valores (na forma do registo: o valor antigo riscado, a seta, o novo) e a porta da linha. A contagem `correcoes-publicadas` conta-as pela régua que já a reconta do livro; o número escreve-o o guião, nunca a mão.

## §2 As frases (palavra por palavra)

1. A política, em vez da frase de hoje:
   - pt «Uma entrada do registo guarda, para um número ou um campo do seu recibo, o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou; para o texto de um estudo, a data, o que mudou e as duas versões do texto.»
   - en «An entry in the register holds, for a figure or a field of its receipt, the previous value, the new value, the date, the reason and the ledger row that changed; for the text of a study, the date, what changed and both versions of the text.»
2. A natureza da correção, em vez da de hoje:
   - pt «O que estava publicado estava errado: um valor, ou um campo do recibo, como o nome de quem publicou o documento ou o endereço da fonte. É uma confissão, e é a razão de o registo existir.»
   - en «What was published was wrong: a value, or a field of the receipt, such as the name of the document's publisher or the address of the source. It is a confession, and it is the reason the register exists.»
3. A definição da contagem das correções publicadas, em vez da de hoje:
   - pt «As correções publicadas no registo: as correções das linhas do livro, de um valor ou de um campo do recibo, e as correções do texto dos estudos.»
   - en «The corrections published in the register: the corrections of ledger rows, of a value or of a field of the receipt, and the corrections of the text of studies.»

A revisão de proveniência e a sua nota ficam como estão: passam a ser verdade sem exceções.

## §3 O fim

Os commits por secção; as conferências tocadas (o livro, o registo, a contagem e a sua definição, a voz e o inventário para as três frases novas) e o `build` inteiro pelo escrivão, verde. Quarenta e cinco minutos, setenta chamadas. Paras e dizes: se uma frase do §2 for apanhada pela voz ou pela L3 (diz qual); se a contagem das correções aparecer escrita à mão em alguma página; se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer.
