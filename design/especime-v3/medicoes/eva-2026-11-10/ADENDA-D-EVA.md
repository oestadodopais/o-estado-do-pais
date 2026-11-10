# Adenda D ao mandato EVA: o título do plano de 2026 e o portão verde (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois de ler o teu relatório da adenda C. Os onze pontos estão feitos. Ficam duas coisas: o título que só a imagem da capa mostra, e o portão inteiro verde na cabeça que aterra. Orçamento de uma construção normal: setenta e cinco minutos e cento e vinte chamadas. O teu relatório vai para `RELATORIO-EVA-D.txt`.*

## O que fazes

1. **O título do plano de 2026.** Este lugar leu a capa do PDF alojado (`Grandes-Opcoes-do-Plano-e-Orcamento-2026_.pdf`, página 1) na imagem, a 10.11.2026: por baixo dos logótipos «ÉVORA Câmara Municipal» e «Évora 27», a capa imprime, em quatro linhas, «GRANDES OPÇÕES», «DO PLANO», «E ORÇAMENTO» e «2026». As dezassete linhas próprias desse documento passam a levar o título «GRANDES OPÇÕES DO PLANO E ORÇAMENTO 2026», como os outros títulos seguem a capa de cada documento. Em `titulos-documentais.json` este título fica com a sua prova dita como é: lido na imagem da página 1 pelo lugar de direção, a 10.11.2026, por a camada de texto da capa não o ter; o resumo sha256 do PDF e a página ficam registados. A planta do título inventado continua a recusar um título sem prova; a forma «lido na imagem» só vale com o resumo do documento, a página, a data e quem leu.

2. **O estudo 11.** A adenda C acrescentou uma linha ao livro do estudo da Segurança Social (`document_languages`). Fica, por ser um facto do documento e por a regra dos decimais por língua precisar dele. No relatório, diz o que essa regra faz hoje aos outros estudos com edição inglesa: para cada um, se a língua de cada documento se lê do nome do ficheiro, do HTML ou de uma declaração, e se algum ficou a passar por omissão.

3. **O portão.** Regenera o que o ponto 1 mudar, confere as 502 unidades das duas edições e os outros estudos byte a byte (com a única diferença declarada do estudo 11), e corre o `core.gate` uma vez, pelo `curto.sh`. Se ficar vermelho, corrige a causa, corre a suite que a prova, e corre o portão outra vez: desta vez o relatório só fecha com o portão inteiro verde na cabeça final, ou com a causa do vermelho dita e o que falta.

## Quando paras

Num número, numa fonte ou numa pessoa. Para tudo o resto: deixa, diz e continua.

## O fim

Os três pontos e o relatório, com o código e as últimas linhas do portão copiadas do registo. Setenta e cinco minutos, cento e vinte chamadas.
