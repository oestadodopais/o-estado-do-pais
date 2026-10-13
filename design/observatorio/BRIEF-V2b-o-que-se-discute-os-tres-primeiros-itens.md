# Brief V2-b · «O que se discute»: a página do painel e os três primeiros itens (12.10.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 12.10.2026, pela §1.181 de `DECISIONS.md` (as três camadas, as quatro perguntas, o patamar 3 aberto, a regra 5 na forma da afirmação) e pela camada 3 da visão («O que se discute»), sobre as linhas que o bloco V2-a sela (`BRIEF-V2a-as-fontes-da-vigilancia-seladas-no-motor.md`; este bloco só se lança depois de o V2-a aterrar). O construtor é o Codex `gpt-6-astra` em `high`; a leitura a frio é do Claude Opus 5.5 em `xhigh`, com cinco estragos plantados, porque o bloco toca números, fontes e pessoas nomeadas. Um bloco, uma mudança: a página e os três itens. Os textos dos itens são do lugar de direção, abaixo; o financiador é avisado do que sai no relatório da sessão (§1.181 (e)). Sem travessões na prosa.*

## 0 · O que se mede antes de construir

Na cabeça que o guião das medições lê (`design/observatorio/medidas/BRIEF-V2b.py`, com o JSON ao lado), há 0 linhas do V2-a no livro-razão (`linhas_do_v2a_no_livro`; este bloco só se lança depois de o V2-a aterrar, e o construtor repete a contagem na sua cabeça de partida, onde tem de ser a das linhas do §1 do brief V2-a) e a tabela das cadeias tem 1 932 linhas de chave (`cadeias_na_tabela`), que a página reutiliza em vez de abrir outra. Os três portões correm na cabeça de partida, com os códigos guardados em ficheiros que o relatório cita, e têm de ser zero; as linhas do V2-a no livro (os identificadores do §1 do brief V2-a, como o motor os exportou; o que não existir com esse nome procura-se pelo nome exportado e diz-se no relatório); a gramática das explicações (`src/lib/explicacoes.mjs`, os tokens, as condições `se`, as células X de `tests/explicacoes/explicacao.mjs`, a auditoria das palavras em `tests/cartao/leituras-provadas.json`), que a página reutiliza em vez de abrir uma gramática nova; a lista das rotas da primeira página e do rodapé; a tabela das cadeias (`src/i18n/strings.mjs`) e o inventário das frases.

## 1 · O que o bloco é

Uma página nova, «O que se discute», em `/o-que-se-discute/` e `/en/under-discussion/`, com a linha de âmbito «As afirmações públicas, ao lado do que as fontes dizem.» / «Public statements, next to what the sources say.», e os itens do painel, do mais recente para o mais antigo. Cada item tem, por esta ordem e com estes rótulos (cadeias da tabela, nas duas línguas, numa lista fechada): o título (uma frase do lugar de direção); «Como foi dito» (a citação exata, por token sobre o excerto da linha `afirmacao`, com quem a disse e o cargo como o documento os escreve, por token sobre `attributed_to`, o lugar e a data, a porta para o documento e o recibo da linha); «O que as fontes dizem» (os números, cada um por token sobre a sua linha, com a unidade e o período, e a porta para o recibo); «A comparação» (a mesma medida, o mesmo período, a mesma população); «A conclusão»; «A recomendação»; «A opinião do lugar de direção», assinalada como opinião (o rótulo diz-o; o Método já explica o patamar 3). A primeira página ganha o bloco «O que se discute» com os títulos dos itens e a porta para a página, depois dos blocos de «O que se passa» e antes das oito portas; o rodapé ganha a porta; o menu não muda.

As regras das palavras são as das explicações: cada número é um token sobre uma linha; cada citação é um token sobre o excerto de uma linha `afirmacao`; cada parte de frase que afirma um facto fora das linhas (um perímetro, uma data, o que um documento diz) apoia-se num excerto selado do documento alojado pelo V2-a, pela auditoria das palavras, e a parte que não tiver apoio sai, com o relatório a dizer qual; a opinião e a recomendação são palavras do lugar de direção, assinaladas, e só citam factos que estão nas linhas ou nos apoios; nenhum adjetivo cola a uma pessoa; a forma da regra 5 é a afirmação como foi dita ao lado do que as fontes dizem, e os números julgam.

## 2 · Os três itens, por palavras do lugar de direção

Os tokens vão entre parênteses retos com o identificador da linha; a edição inglesa diz o mesmo com as mesmas linhas.

### Item 1 · A Saúde no Orçamento para 2027: sobe 3 % ou desce 1,5 %? As duas contas estão no mesmo quadro e medem coisas diferentes

**Como foi dito.** «[excerto de `afirmacao-leitao-amaro-saude-oe2027-2026-10-09`]», [attributed_to], em entrevista à RTP, a 09.10.2026. No mesmo dia, a RTP titulou: «[excerto de `afirmacao-rtp-saude-queda-oe2027-2026-10-09`]».

**O que o relatório do Orçamento diz** (o quadro 5.37, o programa Saúde, em milhões de euros). A despesa total consolidada passa de [`oe-2027-saude-despesa-total-consolidada-2026`] em 2026 para [`oe-2027-saude-despesa-total-consolidada-2027`] em 2027, uma variação de [`oe-2027-saude-despesa-total-consolidada-variacao`]. A despesa efetiva consolidada sem o PRR passa de [`oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026`] para [`oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027`], uma variação de [`oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao`].

**A comparação.** Os dois números saem do mesmo quadro. A descida de 1,5 % conta todo o dinheiro do programa, incluindo o do Plano de Recuperação e Resiliência; a subida de 3 % conta a despesa efetiva sem esse dinheiro. (Se o relatório disser, por palavras seladas, que o dinheiro do PRR termina em 2026, a frase di-lo; se não disser, não o diz.)

**A conclusão.** Nenhuma das duas afirmações é falsa: cada uma escolhe um perímetro, e quem ouve só uma fica a pensar o contrário do que a outra diz.

**A recomendação.** Quem cita o orçamento da Saúde diz o perímetro: a despesa total ou a efetiva, com ou sem o PRR.

**A opinião do lugar de direção.** Para quem usa o Serviço Nacional de Saúde em 2027, o que conta é todo o dinheiro disponível, que desce; para quem faz o Orçamento, o que conta é o dinheiro do Estado, que sobe. O Governo apresentou a segunda conta e as notícias a primeira. As duas, sem a outra, deixam metade de fora.

### Item 2 · Os 1 700 milhões para as parcerias rodoviárias não estão no relatório do Orçamento

**Como foi dito.** «[excerto de `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09`]», [attributed_to], na Assembleia da República, a 09.10.2026 (a porta para a transcrição, ou para o Diário da Assembleia da República se o V2-a o tiver alojado).

**O que o relatório do Orçamento diz** (o quadro 4.25, as parcerias público-privadas, 2027, em milhões de euros). Os encargos brutos do setor rodoviário são [`oe-2027-ppp-rodoviario-encargos-brutos-2027`]; as receitas, [`oe-2027-ppp-rodoviario-receitas-2027`]; os encargos líquidos, [`oe-2027-ppp-rodoviario-encargos-liquidos-2027`]. O total líquido de todos os setores das parcerias é [`oe-2027-ppp-total-encargos-liquidos-2027`]. (A nota do quadro sobre os valores de caixa e os preços, como a fonte a escreve, entra se estiver selada.)

**A comparação.** Nenhum número do quadro é 1 700 milhões. Os mais próximos são os encargos brutos do setor rodoviário e o total líquido de todas as parcerias, e os dois ficam abaixo.

**A conclusão.** A afirmação não tem apoio no quadro das parcerias do relatório. Este projeto não encontrou a conta que dá 1 700 milhões.

**A recomendação.** Quem cita um encargo com as parcerias diz o quadro, o ano, e se é bruto ou líquido.

**A opinião do lugar de direção.** Enquanto a conta dos 1 700 milhões não for mostrada, vale a do relatório: [`oe-2027-ppp-rodoviario-encargos-liquidos-2027`] líquidos para as estradas em 2027.

### Item 3 · O Conselho das Finanças Públicas aceita o cenário do Orçamento e avisa que o risco é para baixo

**Como foi dito.** «[excerto de `afirmacao-cfp-riscos-oe2027-2026-10-07`]», Conselho das Finanças Públicas, no Parecer n.º 05/2026, a 07.10.2026.

**O que as fontes dizem.** A previsão do Governo para o crescimento real do produto em 2027 é [`oe-2027-cenario-pib-real-crescimento-2027`]; a inflação prevista para 2026, pelo índice harmonizado, é [`oe-2027-cenario-ihpc-2026`]. (Se o parecer disser, por palavras seladas, que a previsão do Governo fica acima das previsões das outras instituições, a frase di-lo com essas palavras; se não disser, não o diz.)

**A comparação.** O parecer aceita o cenário e diz onde está o risco: no crescimento, para baixo.

**A conclusão.** O Orçamento assenta num crescimento que o conselho independente aceita, com o aviso de que a surpresa, se vier, é para menos.

**A recomendação.** O Orçamento devia dizer o que acontece à receita se o crescimento ficar abaixo do previsto.

**A opinião do lugar de direção.** Um endosso com aviso é um endosso fraco: quem lê o parecer deve esperar menos receita do que o Orçamento promete, e não mais.

## 3 · As regras do bloco

- **As palavras**: as do §2, nas duas edições, pela gramática das explicações (os tokens, as condições, a auditoria das palavras com os apoios selados); o que não tiver apoio sai, e o relatório di-lo; sem travessões; o vocabulário do §6 da estrutura.
- **As pessoas**: o nome e o cargo como o documento os escreve, por token sobre `attributed_to`, com a porta a um toque; nenhum adjetivo; nada sobre a vida privada; a regra 5 na forma da afirmação (§1.181).
- **As células**: as X das explicações aplicadas aos itens (a igualdade do parágrafo com a conta, a contabilidade dos ramos, os tokens sobre linhas existentes, a auditoria das palavras), e uma célula nova dos itens: cada item tem as sete partes com os rótulos da lista fechada, cada citação é um token sobre uma linha `afirmacao`, a parte da opinião leva o rótulo, e uma planta por regra (um item sem a citação por token; uma citação alterada contra a linha; um adjetivo colado ao nome, pela lista do portão das pessoas se existir, ou por uma lista curta declarada; a opinião sem rótulo).
- **A primeira página e o rodapé**: o bloco e a porta pelas regras da primeira página (as células do bloco, o `check:primeira`, o `check:navegacao`), sem mudar o menu.
- **As capturas**: a página inteira e cada item nas duas edições, a 390, 768, 1 024, 1 280 e 1 600 px (a regra 6), e a primeira página com o bloco novo, a 390 e 1 280 px.

## 4 · A entrega e as medidas de aceitação

1. A página nas duas edições, com os três itens e as sete partes cada, todas as cadeias no inventário, os três portões inteiros a 0 na cabeça do código pela tranca, e a célula dos itens com as suas plantas a morder.
2. O bloco na primeira página e a porta no rodapé, com as conferências da primeira página a 0.
3. As capturas na cabeça final, inspecionadas, sem transbordo.
4. O relatório `design/especime-v3/medicoes/v2b-2026-10-12/LEIA-ME.md` (os números por guião; as partes de frase que saíram por falta de apoio, com a razão; o custo pela linha «tokens used»; as questões `V2B-1`, `V2B-2`, e assim por diante).

O que não está no bloco: itens novos além dos três; o varrimento diário a alimentar a página (o V3, quando o V1 aterrar e o resumo do dia servir); a política de IA e o Método (o rótulo da opinião explica-se com o que o Método já diz do patamar 3; se faltar uma frase, o relatório propõe-na e o lugar de direção escreve-a).

## 5 · O custo

O custo-alvo é de trezentos mil símbolos (§1.177), em `high`; se o passar, o relatório di-lo e diz porquê. A leitura a frio pelo Opus em `xhigh`, com os documentos alojados do V2-a no pacote (M65).

## A fila depois do varrimento de 12.10.2026

*Acrescentado pelo lugar de direção a 12.10.2026 à tarde, a partir do varrimento de vigilância desse dia (`design/observatorio/vigilancia/VARRIMENTO-2026-10-12.md`, feito pelo Claude Opus 5.5 com fontes primárias; cada item leva o rótulo do varrimento: «verificado» quando o número ou a frase foi visto no documento primário, «por confirmar» quando só em segunda mão). Nenhum destes itens entra nos três primeiros deste brief; são a fila para os itens seguintes, pela ordem do lugar de direção, e cada um só entra depois de o motor selar a fonte (o padrão da V2-a).*

1. **A despesa primária líquida contra a recomendação do Conselho da União** (verificado): o relatório do OE2027 (pp. 46 e 47, o quadro 3.4) e o Projeto de Plano Orçamental 2027 entregue à Comissão a 12.10 (a tabela 1) dão um crescimento de 2,5 % em 2027 contra 1,2 % recomendado; a conta de controlo tem um desvio anual de 0,5 % do PIB e acumulado de 0,9 %, ou 0,5 % depois da flexibilidade da defesa, com limites de 0,3 % e 0,6 %. A camada: um artigo ligado ao do OE2027, com a afirmação do Ministro de Estado e das Finanças na «Conversa Capital» de 11.10 («não há nenhum problema na despesa líquida, nem nenhum problema na conta de controlo», por confirmar na gravação) ao lado dos quadros.
2. **Os riscos do cenário macroeconómico** (verificado): o capítulo 6 do relatório (pp. 342 a 346), o parecer do CFP e o WEO do FMI de 13.10 num só texto; o «dois mil milhões» noticiado a 12.10 não está em euros no relatório (a derivação aproximada do varrimento, a partir dos pontos percentuais dos quatro choques e do PIB nominal de 2027, dá cerca de 2 043 milhões só pela procura interna). A camada: um artigo.
3. **A receita fiscal em dois perímetros** (quadros verificados, a frase por confirmar): o Estado em contabilidade pública sobe 2 863 milhões (4,2 %, o quadro 4.4, p. 56) e as administrações públicas em contabilidade nacional 2 564 milhões (3,3 %, o quadro 3.1, p. 38); a afirmação do presidente do Chega a 08.10 («um aumento de 2.900 milhões de euros na receita fiscal em 2027») lida só pela Folha Nacional. A camada: um item do painel, pela segunda forma da regra 5, quando o DAR de 08.10 estiver publicado e a frase se ler nele.
4. **O Hospital Central do Alentejo** (verificado): o aviso do Alentejo 2030 de 08.10, 1 096 424 euros para equipamentos, FEDER até 85 %, candidaturas até 30.12.2026. A camada: uma linha em `evora-economia-e-dinheiro-publico-de-fora-da-camara`, selada pelo motor.
5. **Os professores por colocar** (por confirmar): «oito mil professores estarem por colocar» (Diário de Notícias, 12.10, pela revista de imprensa); a fonte a ler são as listas da reserva de recrutamento da DGAE. A camada: um item do painel, só depois de conferido na fonte.
6. **As pensões** (por confirmar): o relatório «Reformar as Pensões em Portugal», apresentado na Comissão de Trabalho a 14.10 pelo coordenador do grupo de trabalho, cruza-se com a linha `penalizacao-antecipacao-um-ano-neutra` do RP4-n. A camada: um artigo, depois de ler o relatório.

As contradições que o varrimento mediu e que um item pode usar: o PIB real de 2027 (Finanças 2,1 %; BdP, CFP e CE 1,8 %; OCDE 1,7 %; FMI 1,6 %, com datas diferentes, o quadro 2.4, p. 34); a inflação (2,9 % para 2026 é a média anual do IHPC, o quadro 2.3, p. 25; 3,6 % de setembro é a variação homóloga de um mês); os «970 euros» da RMMG e o mínimo de existência de 13 580 euros por ano são a mesma quantia em bases diferentes. O que o motor não apanhou a 12.10 (três iniciativas do PCP entradas nesse dia; o emissor e o sumário separados no RSS do DR) está na leitura da V1-c.
