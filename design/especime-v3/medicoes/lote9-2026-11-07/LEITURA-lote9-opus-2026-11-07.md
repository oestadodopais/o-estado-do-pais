# A leitura a frio do lote 9 (a ND1 e a ED3), 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 31 chamadas pelo harness (35 pela contagem do leitor), 615 s, sobre o pacote `pacote-lote9-2026-11-07` (base 5579e8ce8, cabeça 79b10ff8f, `dist/` de 79b10ff8f). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| K1 | a régua da ND1 salta todas as páginas | 1 |
| K2 | o título português do recibo de Évora volta a dizer «N.d. dias» | 2 |
| K3 | a frase inglesa do recibo de Évora muda uma palavra | 5 |
| K4 | o cabeçalho português de Évora 2027 diz «corrigido a» na data da atualização | 3 |
| K5 | a faixa da edição de 03.11.2026 liga para si própria | 4 |

Cinco em cinco. Os achados reais:

- **O 6, Blocking (a regra 15: uma frase falsa sobre uma fonte):** `penedono-indice-de-divida-2024` é uma linha calculada, sem fonte própria; o seu recibo dizia «A fonte publica «N.d.» em vez de um valor.», e nenhuma fonte publica esse índice. Medido por guião: das 12 linhas, só esta é calculada. Corrigido antes de aterrar pela adenda B da ND1, com a frase pt «Não se calcula: a fonte publica «N.d.» nos valores de que depende.», en «Not calculated: the source publishes «N.d.» for the values it depends on.», escolhida pela régua a partir do livro-razão.
- **O 8, respondido por medida:** os excertos das linhas da fonte («ÉVORA 114 129 154 146 N.d.», «VISEU PENEDONO N.d. N.d. N.d. N.d. N.d.») estão nas linhas de Évora e de Penedono das cópias de hoje das duas listas da DGAL (sha256 a começar por 7de3147b e f1d25a15). As cópias alojadas destas linhas são do motor (a ND2).
- **O 7, para a ND2, já na fila:** o recibo não diz o que «N.d.» quer dizer, e em inglês «n.d.» lê-se como «no date»; a nota da fonte entra como campo medido.
- **O 13 e o 15, respondidos:** a página imprime a publicação declarada (21.10.2026), como antes da ED3; o `core.gate` da VIG2 correu verde fora da sandbox antes de cada aterragem do motor (os registos `GATE-motor-vig2.log` e `GATE-motor-vig2-a.log`, nestes registos).
- **O 14:** a fila sai corrigida nestes registos (a ND1 e a ED3 saem; a frase do que a ND1 entrega diz o que ela entrega).
- **O 17:** uma frase da página inglesa de Évora 2027 em que o estudo fala de si é da VOZ-2A.
- **O 9, o 10, o 11, o 12 e o 16, Minor:** os doze recibos com o mesmo título «N.d. · Números e fontes»; as plantas isoladas da ED3 saem a 1 mordam ou não; as contagens da ED3 sem ficheiro e a comparação só pelo texto; a prova da voz das faixas trocou uma contagem exata por «pelo menos uma»; páginas citadas no relatório fora do pacote.

## O relatório do leitor (condensado)

**Blocking.** 1. A varredura da ND1 não faz nada no diff (planta K1). 2. O título português do recibo de Évora diz «N.d. dias» (planta K2). 3. O cabeçalho português de Évora 2027 diz «corrigido a» na atualização de 03.11.2026 (planta K4).

**Major.** 4. A faixa portuguesa da edição de 03.11.2026 não marca a edição que se lê e liga para si (planta K5). 5. A frase inglesa do recibo de Évora diz «figure» (planta K3). 6. A frase «A fonte publica «N.d.»…» está numa linha que o sítio marca como calculada. 7. Nenhum recibo diz o que «N.d.» quer dizer, e o «N.d.» grande inglês não está marcado como português. 8. O pacote não tem o documento alojado.

**Minor.** 9. Doze recibos com o mesmo título; o «N.d.» duas vezes na linha do valor. 10. As plantas isoladas da ED3 saem a 1 mordam ou não. 11. As contagens da ED3 sem prova no pacote; a comparação com 2cc0806c2 só pelo texto. 12. A prova da voz troca uma contagem exata por «pelo menos uma». 13. O mandato e o relatório discordam da publicação do Orçamento de 2027. 14. A fila discorda do lote. 15. O registo do `core.gate` da VIG2 no pacote sai a 1. 16. Páginas citadas pelo relatório que não estão no pacote. 17. Uma frase da página inglesa de Évora 2027 em que o estudo fala de si.

**O que está bem:** fora do achado 1, cada linha acrescentada do diff está nas cópias; nenhum valor, excerto, data de edição ou rota mudou; a lista das marcas é fechada e uma marca nova dá vermelho; os recibos portugueses e o inglês de Penedono têm a frase exata; os excertos e o excerto para citar sem unidade; as descrições e os títulos ingleses sem unidade; as páginas da ED3 fora das plantas batem com o relatório, cada data uma vez, cada uma uma porta, os separadores escondidos, a edição que se lê sem porta e marcada; as frases antigas das faixas e «Edições:» não aparecem em página nenhuma; os cabeçalhos de uma só edição ficam como estavam; a régua da ED3 é mais forte do que a da ED2; nenhum caminho da máquina nem nome pessoal no diff.
