# Adenda C ao mandato PAI2: as correções da leitura a frio do lote 4 (04.11.2026)

Acrescenta: frases

*Uma passagem nova na worktree `lote4-2026-11-04`, no ramo `lote4b-2026-11-04`: o lote 4 foi refeito por este lugar sobre o lote 3 aterrável, com as tuas passagens copiadas sem mudança. A leitura a frio do Claude Opus 5.5 apanhou as cinco plantas e deu, na PAI2, quatro achados reais que o leitor vê. Duas das causas estão em frases deste lugar.*

## §1 O aviso diz de que número fala

O aviso dizia "este número" e "o valor acima", e na primeira página fica por baixo de outro número, ou de vários. No cartão da porta, dois avisos juntos dizem os dois "este número". O aviso passa a nomear a medida, nas duas edições:
- pt «A fonte reviu ⟦nome da medida⟧ para ⟦found⟧ na releitura de ⟦data⟧; o valor publicado aqui é o de antes da revisão.»
- en «The source revised ⟦measure name⟧ to ⟦found⟧ in the re-reading of ⟦date⟧; the value published here is the one from before the revision.»

O nome da medida é o mesmo que o cartão e o quadro já mostram para essa linha (a União, quando é a linha da União; o ano, quando o anterior é o revisto). O valor revisto escreve-se com a mesma forma dos números da edição: na inglesa, `7,6` e não `7.6`. A régua do aviso confere o nome contra a linha, com planta.

## §2 As unidades das colunas de comparação

Nas colunas do anterior e da União, a unidade vinha da linha do livro tal como está, e por isso o leitor lia a diferença no emprego da União como "9,6 % da população" ao lado de "5,4 pontos percentuais". As colunas do anterior e da União mostram-se como o cartão as mostra: o mesmo número com a unidade da medida da linha. Uma linha cuja unidade no livro mede outra coisa (outra população, outra unidade) faz a régua falhar e paras, a dizer qual. Não se escreve a unidade de uma medida sobre um número que mede outra. A `check:quadro` confere a unidade de cada célula contra a da medida da linha, com planta.

## §3 O título da coluna da referência

O título "Referência da Comissão" ficava sobre o limite do Pacto de Estabilidade e a trajetória do Conselho da UE. Passa a:
- pt «Valor de referência»
- en «Reference value»

Cada célula continua a dizer de quem é a referência, como hoje.

## §4 Quando paras

Se uma linha da comparação medir outra coisa que a medida da linha (§2), ou se uma régua que protege um número tiver de enfraquecer.

## §5 O fim

O `build` inteiro verde; `check:quadro`, `check:cartao` e as conferências que a mudança toca, com os códigos e as plantas; o quadro e um aviso copiados do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `PAI2`. Quarenta minutos, sessenta chamadas.
