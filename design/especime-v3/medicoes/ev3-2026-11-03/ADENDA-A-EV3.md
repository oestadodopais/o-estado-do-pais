# Adenda A ao mandato EV3: as datas como linhas, e as frases sem algarismos soltos (03.11.2026)

Acrescenta: frases

*A mesma sessão e as mesmas worktrees. Paraste bem: o compositor deste estudo recusa um `lit:` com algarismos como prosa nova escrita à mão, e as frases do mandato traziam datas e anos assim. A culpa é deste lugar, que tomou a sintaxe do estudo da habitação por geral. Os três PDF deram os sha256 do §0 e os excertos estão como o mandato os escreve: isso fica. Uma só passagem (a M99).*

## §1 As datas são linhas

Cada data das frases é uma linha do livro do estudo no motor, com o excerto do documento que a diz:
- `ev3-data-cm-15-10`: o edital de 15.10, "na Reunião Pública de Câmara de 15 de outubro de 2026";
- `ev3-data-am-22-10`: o edital da Assembleia Municipal, "Sessão Extraordinária realizada no dia 22 de outubro de 2026";
- `ev3-data-cm-29-10`: o cabeçalho do edital de 29.10, a frase que diz a data da reunião (medida por ti no texto do OCR; se o OCR não a der legível, paras e dizes);
- `ev3-data-noticia-rossio`: a notícia, "Atualizado em 23/10/2026" ou "publicado em 23 de October de 2026", o que a página alojada escrever;
- `ev3-rossio-prevista`: o excerto "estava prevista ser concluída até ao final de 2026".

Na edição inglesa, as datas rendem-se na forma inglesa da casa a partir da mesma linha. A linha `ev3-ultima-noticia` dá o valor (a data da última notícia) e a data em que foi lida; as duas renderizam-se pelos campos da linha.

## §2 As frases (substituem as do §2 e do §4 do mandato; os tokens na sintaxe deste estudo, com o campo que cada um rende)

1. Depois do parágrafo "As obras são de outros…":
   - pt «Em outubro, o calendário do Rossio de São Brás mudou. A ⟦19:ev3-data-noticia-rossio|valor⟧, a Câmara escreveu que a segunda parte da obra, «⟦19:ev3-rossio-fundo-ambiental|excerto⟧», «⟦19:ev3-rossio-prevista|excerto⟧», e que «⟦19:ev3-rossio-nao-concluida|excerto⟧», pelos prazos da contratação pública e da fiscalização prévia do Tribunal de Contas, e que a reprogramação a articula com o projeto artístico da Floresta Nómada, da programação da Capital Europeia da Cultura. A alteração ao plano plurianual de investimentos para o Rossio foi aprovada pela Câmara a ⟦19:ev3-data-cm-15-10|valor⟧, com a abstenção da CDU, e pela Assembleia Municipal a ⟦19:ev3-data-am-22-10|valor⟧, com ⟦19:ev3-am-rossio-favor|valor⟧ votos a favor e ⟦19:ev3-am-rossio-abstencoes|valor⟧ abstenções. A ⟦19:ev3-data-cm-29-10|valor⟧, a Câmara aprovou a adjudicação da empreitada do Rossio, Laboratório Floresta Nómada, à DECOVERDI, S.A., com a abstenção das vereadoras da AD; a primeira fase já tinha recebido, a ⟦19:ev3-data-cm-15-10|valor⟧, mais ⟦19:ev3-rossio-1fase-dias|valor⟧ dias de prazo.»
   - en «In October the Rossio de São Brás timetable changed. On ⟦19:ev3-data-noticia-rossio|valor⟧ the Câmara wrote that the second part of the works, «⟦19:ev3-rossio-fundo-ambiental|excerto⟧», «⟦19:ev3-rossio-prevista|excerto⟧», and that «⟦19:ev3-rossio-nao-concluida|excerto⟧», because of the public procurement deadlines and the prior review by the Tribunal de Contas, and that the reprogramming ties it to the Floresta Nómada artistic project of the European Capital of Culture programme. The amendment to the multi-year investment plan for the Rossio was approved by the Câmara on ⟦19:ev3-data-cm-15-10|valor⟧, with the CDU abstaining, and by the Assembleia Municipal on ⟦19:ev3-data-am-22-10|valor⟧, with ⟦19:ev3-am-rossio-favor|valor⟧ votes in favour and ⟦19:ev3-am-rossio-abstencoes|valor⟧ abstentions. On ⟦19:ev3-data-cm-29-10|valor⟧ the Câmara approved awarding the Rossio works, Laboratório Floresta Nómada, to DECOVERDI, S.A., with the AD councillors abstaining; the first phase had already been given ⟦19:ev3-rossio-1fase-dias|valor⟧ more days on ⟦19:ev3-data-cm-15-10|valor⟧.»
2. A seguir:
   - pt «A ⟦19:ev3-data-cm-29-10|valor⟧, a Câmara ratificou também um licenciamento de obras de conservação requerido pela própria associação, para «⟦19:ev3-licenca-associacao|excerto⟧»; o edital não diz o que é o imóvel nem quanto custam as obras. O plano de atividades citado acima fala das obras dos equipamentos da candidatura.»
   - en «On ⟦19:ev3-data-cm-29-10|valor⟧ the Câmara also ratified a licence for conservation works requested by the association itself, for «⟦19:ev3-licenca-associacao|excerto⟧»; the notice does not say what the building is or what the works cost. The activity plan quoted above refers to the works on the bid's venues.»
3. Em vez de "À data desta leitura, a última notícia publicada pela associação é de agosto de 2026 e não anuncia o programa de 2027.":
   - pt «A ⟦19:ev3-ultima-noticia|lido⟧, a última notícia publicada pela associação continuava a ser a de ⟦19:ev3-ultima-noticia|valor⟧, que não anuncia o programa da Capital Europeia da Cultura.»
   - en «On ⟦19:ev3-ultima-noticia|lido⟧ the association's latest published news item was still the one of ⟦19:ev3-ultima-noticia|valor⟧, which does not announce the European Capital of Culture programme.»
4. A entrada do registo (substitui a do §4 do mandato), de natureza «Estudo atualizado»:
   - pt «Entraram as decisões de outubro da Câmara e da Assembleia Municipal de Évora sobre o Rossio de São Brás, e um licenciamento de obras de conservação requerido pela associação.»
   - en «The October decisions of Évora's Câmara and Assembleia Municipal on the Rossio de São Brás, and a licence for conservation works requested by the association, were added.»

O §3 do mandato (a natureza nova) fica como está; as suas frases não têm algarismos.

## §3 O fim

O resto do mandato fica: o §1 (os documentos e as linhas, mais as cinco do §1 desta adenda), o §3, a edição nova e a prova do §4, e o fim do §5. Paras e dizes: se a composição recusar outro token (diz qual e porquê); se um excerto de data não estiver no documento.
