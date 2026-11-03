# Adenda H ao mandato EV3: as correções da leitura a frio (03.11.2026)

Acrescenta: frases

*A mesma sessão e as mesmas worktrees. A leitura a frio do Claude Opus 5.5 (15:13 a 15:25 UTC) apanhou as cinco plantas e deu três Major reais, todos em frases que este lugar escreveu, e quatro Minor que o leitor vê e que se corrigem na mesma passagem. Uma só passagem (a M99). Os tokens vão já na sintaxe deste estudo.*

## §0 O que a leitura achou, e o que muda

1. **Major 6:** a frase "e que a reprogramação a articula com o projeto artístico da Floresta Nómada" dá como feito, e na voz da Câmara, o que a nota de 23.10 diz como finalidade e na voz do presidente da Câmara ("Com estas propostas, referiu o Presidente da Câmara, evita-se a perda de fundos alocados à empreitada e assegura-se a flexibilidade para que..."), e deixa cair a primeira finalidade. Passa a uma frase atribuída ao presidente, com as duas finalidades.
2. **Major 7:** a edição inglesa imprime duas datas na forma numérica portuguesa ("On 23/10/2026", "the one of 11/08/2026"), contra a adenda A §1 e a adenda B §1, e a portuguesa mistura "A 23/10/2026" com "a 15 de outubro de 2026" no mesmo parágrafo. Passam a linhas irmãs na forma longa de cada edição, com o mesmo excerto.
3. **Major 8:** na edição inglesa, os factos do primeiro parágrafo só estão dentro de citações portuguesas sem tradução. Os dois primeiros factos passam a palavras da frase, nas duas edições (o editor também apontou as três citações seguidas), e fica uma só citação, a do facto principal.
4. **Minor 9:** o endereço citado acaba em "em Evora", um artefacto provável do OCR. O excerto da linha `ev3-licenca-associacao` passa a acabar em "n.º 6", e "em Évora" fica fora das aspas.
5. **Minor 10:** a 15.10 a Câmara ratificou a prorrogação dos sessenta dias (o ponto 8.2 está em "Propostas para ratificação"); a frase dizia que a fase os recebeu nesse dia.
6. **Minor 11:** a votação da Assembleia leva "por maioria", como o edital escreve, para que ninguém leia mais abstenções do que votos a favor como uma rejeição.
7. **Minor 19:** "Nesta atualização" / "In this update" é o sítio a falar do seu próprio trabalho; sai.

## §1 As linhas novas e a linha que muda (no livro do estudo, pelo processo da adenda C)

- `ev3-data-noticia-rossio-longa`: valor "23 de outubro de 2026"; `ev3-data-noticia-rossio-en`: valor "23 October 2026"; as duas com o excerto de `ev3-data-noticia-rossio`.
- `ev3-ultima-noticia-longa`: valor "11 de agosto de 2026"; `ev3-ultima-noticia-en`: valor "11 August 2026"; as duas com o excerto de `ev3-ultima-noticia`.
- `ev3-licenca-associacao`: o valor (a citação que a página imprime) passa a "Rua da República, n.ºs 131 a 139 e Rua do Cicioso, n.º 6", uma parte do excerto que a linha já tem; o excerto fica como está. A linha filha `ev3-licenca-associacao-n0` e as outras do mesmo pai acompanham, se a régua o pedir.
- `ev3-rossio-fundo-ambiental` e `ev3-rossio-prevista` deixam de ser tokens. Se uma régua recusar uma linha sem uso, decides se ficam como prova da frase ou saem, e anotas.

## §2 As frases (substituem as do §2 da adenda A, com a forma da adenda B)

1. O primeiro parágrafo:
   - pt «Em outubro, o calendário do Rossio de São Brás mudou. A ⟦EV:ev3-data-noticia-rossio-longa⟧, a Câmara escreveu que a segunda parte da obra, inteiramente financiada pelo Fundo Ambiental, estava prevista para o fim do ano, mas que «⟦EV:ev3-rossio-nao-concluida⟧», pelos prazos da contratação pública e da fiscalização prévia do Tribunal de Contas. Segundo o presidente da Câmara, citado na mesma nota, as propostas evitam a perda dos fundos da obra e dão flexibilidade para a fazer em articulação com o projeto artístico da Floresta Nómada, da programação da Capital Europeia da Cultura. A alteração ao plano plurianual de investimentos para o Rossio foi aprovada pela Câmara a ⟦EV:ev3-data-cm-15-10⟧, com a abstenção da CDU, e pela Assembleia Municipal a ⟦EV:ev3-data-am-22-10⟧, por maioria, com ⟦EV:ev3-am-rossio-favor⟧ votos a favor e ⟦EV:ev3-am-rossio-abstencoes⟧ abstenções. A ⟦EV:ev3-data-cm-29-10⟧, a Câmara aprovou a adjudicação da empreitada do Rossio, Laboratório Floresta Nómada, à DECOVERDI, S.A., com a abstenção das vereadoras da AD; a ⟦EV:ev3-data-cm-15-10⟧, tinha ratificado uma prorrogação de ⟦EV:ev3-rossio-1fase-dias⟧ dias do prazo da primeira fase.»
   - en «In October the Rossio de São Brás timetable changed. On ⟦EV:ev3-data-noticia-rossio-en⟧ the Câmara wrote that the second part of the works, fully funded by the Fundo Ambiental, was due to be finished by the end of the year but cannot be finished in time («⟦EV:ev3-rossio-nao-concluida⟧»), because of the public procurement deadlines and the prior review by the Tribunal de Contas. According to the mayor, quoted in the same notice, the proposals avoid losing the funds for the works and give the flexibility to carry them out in step with the Floresta Nómada artistic project, part of the European Capital of Culture programme. The amendment to the multi-year investment plan for the Rossio was approved by the Câmara on ⟦EV:ev3-data-cm-15-10-en⟧, with the CDU abstaining, and by the Assembleia Municipal on ⟦EV:ev3-data-am-22-10-en⟧, by a majority, with ⟦EV:ev3-am-rossio-favor⟧ votes in favour and ⟦EV:ev3-am-rossio-abstencoes⟧ abstentions. On ⟦EV:ev3-data-cm-29-10-en⟧ the Câmara approved awarding the Rossio works, Laboratório Floresta Nómada, to DECOVERDI, S.A., with the AD councillors abstaining; on ⟦EV:ev3-data-cm-15-10-en⟧ it had ratified a ⟦EV:ev3-rossio-1fase-dias⟧-day extension of the first phase's deadline.»
2. O segundo parágrafo:
   - pt «A ⟦EV:ev3-data-cm-29-10⟧, a Câmara ratificou também um licenciamento de obras de conservação requerido pela própria associação, para «⟦EV:ev3-licenca-associacao⟧», em Évora; o edital não diz o que é o imóvel nem quanto custam as obras. O plano de atividades citado acima fala das obras dos equipamentos da candidatura.»
   - en «On ⟦EV:ev3-data-cm-29-10-en⟧ the Câmara also ratified a licence for conservation works requested by the association itself, for «⟦EV:ev3-licenca-associacao⟧», in Évora; the notice does not say what the building is or what the works cost. The activity plan quoted above refers to the works on the bid's venues.»
3. A frase da última notícia (a troca da adenda B §2):
   - pt «A última notícia publicada pela associação é de ⟦EV:ev3-ultima-noticia-longa⟧ e não anuncia o programa da Capital Europeia da Cultura.»
   - en «The association's latest published news item dates from ⟦EV:ev3-ultima-noticia-en⟧ and does not announce the European Capital of Culture programme.»

Nas duas edições, os nomes portugueses levam a marca de língua como hoje. "Fundo Ambiental" e "Tribunal de Contas" na edição inglesa levam-na também, se a regra dos nomes a pedir.

## §3 O que fica

A entrada do registo, a natureza, a edição anterior, a contagem e as réguas da adenda G ficam como estão. A edição atual muda de impressão digital, e a prova das três passagens regenera-se com ela.

## §4 Quando paras

Só se a composição recusar um token desta adenda (diz qual e porquê), se um excerto não estiver no documento alojado, ou se uma frase não puder ficar como está escrita (diz qual e porquê).

## §5 O fim

O `build` inteiro verde; as conferências que esta mudança toca, com os códigos; as frases construídas nas duas edições, copiadas do `dist/` no relatório. Commits só com caminhos explícitos, com o trailer da sessão. Trinta minutos, quarenta chamadas.
