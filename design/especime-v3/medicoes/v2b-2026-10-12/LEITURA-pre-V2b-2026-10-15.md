# A pré-leitura do brief V2-b e da adenda pelo Codex `gpt-6-astra` (`xhigh`, só texto), 15.10.2026, 09:27 a 09:38 UTC

*Lançada por `scripts/leituras/ler.sh` sobre uma pasta com o brief, a adenda de 15.10, o §0 medido, os identificadores das 18 linhas do V2-a, sete linhas do livro-razão e a explicação do dinheiro do Estado como exemplo da gramática. Sete Blocking, nove Major e três Minor: o brief passa a mandato (`MANDATO-V2b-2026-10-15.md`) com as emendas aceites e as decisões do lugar de direção sobre cada uma. O texto abaixo é a última mensagem do leitor, sem edição.*

## 1. Blocking

**O brief, com a adenda, não está pronto para construção sem perguntas.** Há uma referência inexistente, conclusões mais fortes do que os excertos permitem e uma condição de integração incompatível com a página indicada.

Conferi os 18 identificadores da lista: três afirmações e quinze linhas numéricas. Dos identificadores usados no §2, só falta o do CFP. A existência dos restantes não confirma os seus valores: a pasta contém o conteúdo de apenas quatro das quinze linhas numéricas.

**B1. §2, item 3: falta a linha que sustenta a citação pública.**

Citação: «[excerto de `afirmacao-cfp-riscos-oe2027-2026-10-07`]».

Esse identificador não existe em `linhas-do-v2a-ids.txt`. O excerto da linha `oe-2027-cenario-pib-real-crescimento-2027` contém o endosso e a ressalva do CFP, mas a linha não está marcada como `afirmacao` nem contém `attributed_to`. Não satisfaz, por substituição silenciosa, a regra de «Como foi dito». Também não permite confirmar a data de 07.10.2026.

**Emenda proposta, a acrescentar antes do item 3:**

> O item 3 depende da exportação de uma linha `afirmacao` com o excerto do CFP, a atribuição e a data conferidos no documento selado. O identificador usado neste item tem de constar da lista de linhas exportadas. A linha numérica do PIB pode apoiar a explicação, mas não substitui a linha da citação. Sem esta linha, a entrega dos três itens fica bloqueada.

Não proponho uma data alternativa: falta verificá-la.

**B2. §2, item 1, «Como foi dito»: o excerto da RTP não é o título.**

Citação: «No mesmo dia, a RTP titulou: «[excerto de `afirmacao-rtp-saude-queda-oe2027-2026-10-09`]».»

O `document.title` é «OE2027. Verbas para a saúde com queda de 1,5%». O `excerpt` começa por «O orçamento para Saúde sofre um corte em 2027» e contém quatro frases. O token preserva o excerto, mas «titulou» atribui-lhe uma função que a linha não sustenta.

A expressão «em entrevista à RTP», na frase anterior, também não está demonstrada pelos campos fornecidos.

**Emendas propostas:**

Substituir «em entrevista à RTP» por:

> num documento publicado pela RTP

Substituir «No mesmo dia, a RTP titulou:» por:

> No mesmo dia, [attributed_to de `afirmacao-rtp-saude-queda-oe2027-2026-10-09`] publicou:

A citação de Leitão Amaro contém literalmente «o orçamento da Saúde sobre 3%». **Não corrigir «sobre» para «sobe» dentro do token.** A fidelidade exigida aqui é ao documento selado.

**B3. §2, item 1, comparação e conclusão: a explicação mistura duas mudanças de perímetro e absolve a totalidade das citações.**

Citações:

> A descida de 1,5 % conta todo o dinheiro do programa, incluindo o do Plano de Recuperação e Resiliência; a subida de 3 % conta a despesa efetiva sem esse dinheiro.

> Nenhuma das duas afirmações é falsa: cada uma escolhe um perímetro, e quem ouve só uma fica a pensar o contrário do que a outra diz.

Há duas diferenças: despesa total versus efetiva e inclusão versus exclusão do PRR. «Todo o dinheiro» apaga a primeira. A pasta mostra uma terceira conta relevante, omitida no brief: despesa efetiva consolidada de 17 803,1 milhões em 2027, com variação de −1,4 %. O mesmo excerto apresenta 3,0 % na comparação sem PRR.

A conclusão também certifica todas as palavras e quantias das citações, incluindo os montantes referidos pela RTP, e afirma um efeito sobre quem ouve. Isso excede o demonstrado.

**Emendas propostas:**

Acrescentar a «O que as fontes dizem»:

> A despesa efetiva consolidada passa de [`oe-2027-saude-despesa-efetiva-consolidada-2026`], na estimativa, para [`oe-2027-saude-despesa-efetiva-consolidada-2027`], no Orçamento, uma variação de [`oe-2027-saude-despesa-efetiva-consolidada-variacao`].

Substituir a comparação, antes do parêntese condicional, por:

> Há duas diferenças de perímetro: despesa total ou efetiva, e despesa com ou sem o PRR. Para observar a diferença associada ao PRR, compara-se a variação da despesa efetiva consolidada com a variação da despesa efetiva consolidada sem o PRR.

Substituir a conclusão por:

> O quadro apresenta variações de sinal diferente quando se altera o perímetro da despesa. A comparação exige identificar a medida usada em cada caso.

Substituir o título, evitando também os valores escritos fora de tokens, por:

> A Saúde no Orçamento: que despesa se está a comparar?

**B4. §2, item 2: uma comparação limitada transforma-se numa afirmação sobre o relatório inteiro.**

Citações:

> Os 1 700 milhões para as parcerias rodoviárias não estão no relatório do Orçamento

> Nenhum número do quadro é 1 700 milhões. Os mais próximos são os encargos brutos do setor rodoviário e o total líquido de todas as parcerias, e os dois ficam abaixo.

> Este projeto não encontrou a conta que dá 1 700 milhões.

As linhas nomeadas não demonstram uma ausência no relatório inteiro. O excerto do total inclui vários anos, pelo que «nenhum número do quadro» também excede os quatro valores de 2027 selecionados. «Os mais próximos» exige definir e percorrer o universo da comparação. A última frase afirma uma pesquisa cujo âmbito e resultado não estão documentados nesta pasta.

**Emendas propostas:**

Substituir o título por:

> As parcerias rodoviárias: a afirmação e os valores do relatório

Substituir a comparação por:

> Nenhum dos quatro valores apresentados acima é igual a [value de `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09`] [unit da mesma linha].

Acrescentar esta instrução, que não se publica:

> Esta frase depende da comparação dos quatro valores de 2027 com o valor da afirmação. Se a condição não se verificar, o item fica bloqueado para revisão pelo lugar de direção.

Substituir toda a conclusão por:

> O excerto citado não explicita se o encargo é bruto ou líquido.

É uma conclusão mais estreita, mas sustentada pelo excerto efetivamente fornecido.

**B5. §2, item 3: «pendor descendente» passa a significar que qualquer surpresa será negativa.**

Citações:

> O parecer aceita o cenário e diz onde está o risco: no crescimento, para baixo.

> O Orçamento assenta num crescimento que o conselho independente aceita, com o aviso de que a surpresa, se vier, é para menos.

O excerto distingue a justificação do endosso, ligada ao crescimento **nominal** e aos princípios legais referidos, dos riscos para o crescimento **real**, que apresentam um «pendor descendente». Não diz que uma surpresa positiva é impossível.

**Emendas propostas:**

Substituir o título por:

> O Conselho das Finanças Públicas endossa as previsões e assinala riscos descendentes para o crescimento real

Substituir a comparação por:

> O CFP endossa as previsões macroeconómicas tendo em conta que a evolução do crescimento nominal previsto respeita os princípios legais referidos no parecer. Assinala um pendor descendente dos riscos para o crescimento real.

Substituir a conclusão por:

> O endosso é acompanhado por uma ressalva sobre os riscos para o crescimento real.

Estas frases têm apoio no excerto da linha do PIB, independentemente da linha `afirmacao` que ainda falta.

**B6. Adenda, decisão 2 e aceitação 3: a ligação obrigatória não satisfaz a condição que a própria adenda impõe.**

Citações:

> na explicação «Para onde vai o dinheiro do Estado em 2026», a secção das funções

> A porta rende-se só quando existe pelo menos um item que cite uma linha dessa página

> a partir da explicação do Orçamento em um

O exemplo fornecido usa linhas de 2026, execução de 2026 e contas de 2025. Nenhuma é uma das linhas citadas pelos três itens. A secção das funções usa `oe-2026-cem-euros-funcao-*`. Pela condição escrita, a porta para estes itens não aparece; a aceitação exige que apareça.

Afinidade temática e identidade de linha são critérios diferentes. Para preservar a integração pretendida, proponho explicitar uma exceção editorial.

**Emenda proposta para a regra de integração:**

> As portas por coincidência de linhas são geradas quando uma página e um item citam pelo menos um identificador igual. Além dessas portas, a explicação «Para onde vai o dinheiro do Estado em 2026» recebe, no fim da secção `por-funcao`, uma porta temática para o item 1. Esta associação é uma decisão editorial entre a função Saúde de 2026 e o debate sobre o Orçamento de 2027; não depende de identificadores iguais. Nas páginas dos temas, só entram neste bloco as portas que satisfaçam a coincidência de linhas.

**Emenda proposta para a aceitação:**

> A partir da explicação «Para onde vai o dinheiro do Estado em 2026», um toque no título da porta temática abre o item 1. As restantes portas por coincidência de linhas são verificadas nos casos em que a condição se cumpre.

Isto fixa uma solução concreta. Se a direção quiser também portas temáticas noutros lugares, falta fornecer o mapa dessas associações.

**B7. §0 e §4: os três portões não estão identificados de forma executável neste pacote.**

Citação:

> Os três portões correm na cabeça de partida, com os códigos guardados em ficheiros que o relatório cita, e têm de ser zero

São dados caminhos para algumas verificações e os nomes `check:primeira` e `check:navegacao`, mas não a identificação inequívoca dos três portões completos. Não consigo fornecer os comandos em falta sem os inventar.

**Emenda proposta:**

> Os três portões são executados pelos seguintes comandos completos: [verify: primeiro comando], [verify: segundo comando] e [verify: terceiro comando]. Cada execução guarda o comando, a cabeça do código, a saída e o código de saída. Os três códigos de saída têm de ser zero.

A contagem inicial também deve verificar os identificadores, não apenas um total obtido por prefixos.

**Emenda adicional ao §0:**

> O zero do JSON é uma medição histórica. Na cabeça de partida, verifica-se individualmente a presença dos 18 identificadores de `linhas-do-v2a-ids.txt`, sem ausências. A lista é atualizada antes da construção se for acrescentada a linha do CFP. Uma contagem por prefixos não substitui esta verificação.

## 2. Major

**M1. §2, item 1, opinião: o rótulo de opinião não sustenta as equivalências nem as generalizações.**

Citação:

> Para quem usa o Serviço Nacional de Saúde em 2027, o que conta é todo o dinheiro disponível, que desce; para quem faz o Orçamento, o que conta é o dinheiro do Estado, que sobe. O Governo apresentou a segunda conta e as notícias a primeira. As duas, sem a outra, deixam metade de fora.

As linhas não estabelecem que a despesa do programa equivale a todo o dinheiro disponível para os utilizadores do SNS, nem que «sem PRR» significa «dinheiro do Estado». Uma afirmação de um governante e um documento da RTP também não permitem generalizar para «o Governo» e «as notícias». «Metade» sugere uma proporção que não foi medida.

**Emenda proposta para a opinião inteira:**

> A apresentação pública deve dar o mesmo destaque à despesa total consolidada e à despesa efetiva consolidada, distinguindo a inclusão e a exclusão do PRR.

Continua a ser uma posição editorial, apoiada nas medidas apresentadas.

**M2. §2, item 2, opinião e fontes: escolher os encargos líquidos não resolve o perímetro da afirmação.**

Citação:

> Enquanto a conta dos 1 700 milhões não for mostrada, vale a do relatório: [`oe-2027-ppp-rodoviario-encargos-liquidos-2027`] líquidos para as estradas em 2027.

O relatório contém encargos brutos e líquidos. A afirmação não especifica qual usa. Escolher os líquidos como resposta definitiva decide essa questão sem prova.

**Emenda proposta:**

> A comparação deve apresentar os encargos brutos, as receitas e os encargos líquidos do setor rodoviário, sem escolher uma dessas medidas como significado implícito da afirmação.

Há ainda uma ressalva material na linha do total: as linhas setoriais não somam exatamente o total impresso.

Citação a emendar:

> O total líquido de todos os setores das parcerias é [`oe-2027-ppp-total-encargos-liquidos-2027`].

**Substituição proposta:**

> O total líquido impresso para todos os setores das parcerias é [`oe-2027-ppp-total-encargos-liquidos-2027`]. [ressalva de `oe-2027-ppp-total-encargos-liquidos-2027`]

A ressalva é do projeto, não uma citação do Ministério. Já a nota sobre caixa e preços está no `excerpt` fornecido. A condição «entra se estiver selada» pode ser resolvida neste pacote; não é necessário procurar essa nota no campo interno `note`.

**M3. §2, item 3, opinião e recomendação: risco para o crescimento não é uma previsão de receita inferior.**

Citação:

> Um endosso com aviso é um endosso fraco: quem lê o parecer deve esperar menos receita do que o Orçamento promete, e não mais.

«Endosso fraco» pode ser um juízo editorial. A previsão sobre a receita, porém, não consta do excerto e não é demonstrada por uma conta. O rótulo de opinião não elimina essa falta.

**Emenda proposta:**

> O aviso sobre os riscos para o crescimento real deve ter o mesmo destaque que o endosso das previsões.

Citação:

> O Orçamento devia dizer o que acontece à receita se o crescimento ficar abaixo do previsto.

A redação pode ser lida como uma afirmação de que o Orçamento não apresenta essa análise. A pasta não permite concluir isso.

**Emenda proposta:**

> Recomendo apresentar, ao lado da previsão, os cenários para a receita associados a um crescimento inferior ao previsto.

A inflação de 2026 também fica sem função na comparação sobre crescimento real de 2027.

**Emenda proposta a «O que as fontes dizem»:** retirar:

> ; a inflação prevista para 2026, pelo índice harmonizado, é [`oe-2027-cenario-ihpc-2026`]

Em contrapartida, a condição seguinte já está resolvida pelo excerto do PIB. Substituir o parêntese iniciado por «Se o parecer disser» por:

> O CFP assinala que o crescimento real previsto para [periodo de `oe-2027-cenario-pib-real-crescimento-2027`] é superior ao de todas as instituições de referência.

**M4. §1, §2 e §3: a lista fechada de rótulos diverge dos itens escritos.**

Citações:

> «O que as fontes dizem»

> **O que o relatório do Orçamento diz**

Os itens 1 e 2 usam o segundo rótulo. A regra exige o primeiro. O construtor teria de escolher qual instrução prevalece.

**Emenda proposta:** substituir, nos itens 1 e 2:

> O que o relatório do Orçamento diz

por:

> O que as fontes dizem

Acrescentar ao §1:

> As sete partes são o título e as seis secções seguintes. O título é o cabeçalho do item e não recebe o rótulo literal «Título».

**M5. §2 e §3: falta fixar o tratamento das citações na edição inglesa.**

Citações:

> a edição inglesa diz o mesmo com as mesmas linhas

> o nome e o cargo como o documento os escreve, por token sobre `attributed_to`

Os ficheiros fornecem `excerpt` e `attributed_to` em português. Não fornecem versões inglesas desses campos. Traduzir uma citação dentro do token quebra a igualdade com a linha; deixá-la em português é compatível com a exatidão, mas deve ser uma decisão explícita.

Não há texto inglês dos três itens que permita verificar divergências. Isso é uma lacuna de revisão, não prova de uma tradução errada.

**Emenda proposta:**

> Nas duas edições, as citações e as atribuições reproduzem literalmente `excerpt` e `attributed_to`, em português. A edição inglesa traduz a prosa editorial e os rótulos, mantendo as mesmas linhas e condições. As traduções dos títulos, conclusões, recomendações e opiniões são fixadas pelo lugar de direção antes da construção. Não se acrescentam traduções das citações neste bloco.

**M6. §0, §1 e §3: reutilizar a gramática não define os novos campos que a página precisa de publicar.**

Citação:

> a gramática das explicações [...] que a página reutiliza em vez de abrir uma gramática nova

O exemplo documenta valores, períodos, nomes, comparações e condições. Não documenta tokens para `excerpt`, `attributed_to` ou `ressalva`. Isto não prova que o resolvedor real não os suporte; prova que esse contrato não está definido no material entregue.

**Emenda proposta:**

> A página usa o resolvedor existente. Se necessário, este é alargado para ler literalmente `excerpt`, `attributed_to` e `ressalva`, sem criar um resolvedor paralelo. Em «Como foi dito», o token de excerto exige uma linha marcada como `afirmacao`. Cada atribuição identifica a sua linha. O cargo só aparece quando consta de `attributed_to`. O campo `note` nunca é publicado nem usado como substituto de um apoio selado.

Isto resolve também o caso de Paulo Raimundo: o campo contém «Paulo Raimundo» e «PCP», mas não um cargo. O construtor não deve acrescentá-lo por conhecimento próprio.

**M7. §2, item 2, proveniência: um documento alternativo não pode substituir silenciosamente a fonte da linha.**

Citação:

> a porta para a transcrição, ou para o Diário da Assembleia da República se o V2-a o tiver alojado

A linha fornecida está selada sobre um documento publicado pelo PCP. A existência de um DAR alojado não demonstra, por si só, que ele seja a fonte daquele excerto.

**Emenda proposta:**

> a porta para o documento publicado pelo PCP indicado em `source_url` e para o recibo da linha; o Diário da Assembleia da República só entra como apoio adicional se a correspondência do excerto estiver conferida e selada

**M8. §1, §3 e §4: retirar frases sem apoio pode destruir a entrega obrigatória.**

Citações:

> o que não tiver apoio sai, e o relatório di-lo

> com os três itens e as sete partes cada

Não está definido o que acontece quando sai uma conclusão inteira, uma opinião inteira ou a própria citação. O construtor pode acabar a inventar uma substituição, a publicar uma secção vazia ou a reduzir o número de itens.

**Emenda proposta:**

> As passagens explicitamente opcionais saem quando não têm apoio. A falta de apoio numa parte obrigatória bloqueia o respetivo item e a aceitação dos três itens. O construtor não escreve uma conclusão ou opinião substituta. As substituições necessárias são fixadas pelo lugar de direção antes da construção.

Na enumeração de plantas do §3, acrescentar:

> um item sem uma das sete partes;

A lista passa assim de quatro para cinco casos e cobre a estrutura obrigatória. O brief deve ainda distinguir estas plantas automáticas dos «cinco estragos plantados» anunciados para a leitura a frio, caso sejam conjuntos diferentes.

**M9. Adenda, «O que isto não muda», contra §4: o quarto item reabre um âmbito expressamente fechado.**

Citações:

> O que não está no bloco: itens novos além dos três

> é um candidato a quarto item, a decidir no mandato do V2-b com as fontes seladas

A adenda diz que não altera o conteúdo, mas deixa a inclusão de outro item por decidir dentro do mesmo mandato.

**Emenda proposta na adenda:**

> A afirmação sobre a despesa em defesa fica na fila de candidatos para um bloco posterior. Não é decidida nem incluída no V2-b.

A adenda também acrescenta portas em páginas existentes, mas declara que «as células e as capturas ficam como o brief os escreve». As verificações originais não cobrem expressamente essas novas portas.

**Emenda proposta:**

> Mantêm-se as células e capturas do brief e acrescenta-se a verificação das portas de integração, incluindo a presença e ausência pela condição declarada, o destino no item correto e capturas das secções alteradas nas duas edições a 390 e 1 280 px.

## 3. Minor

**m1. Adenda, decisão 2: a cadeia inglesa é pouco natural.**

Citação:

> Under discussion about this →

**Emenda proposta:**

> What is being discussed about this →

Mantém o sentido de «O que se discute sobre isto».

**m2. §2, item 2, recomendação: a vírgula interrompe uma enumeração simples.**

Citação:

> Quem cita um encargo com as parcerias diz o quadro, o ano, e se é bruto ou líquido.

**Emenda proposta:**

> Quem cita um encargo com as parcerias diz o quadro, o ano e se é bruto ou líquido.

**m3. §5 e §4: a unidade do orçamento de utilização deve coincidir com a medição pedida.**

Citações:

> O custo-alvo é de trezentos mil símbolos

> o custo pela linha «tokens used»

A pasta não fornece a definição de «símbolos» remetida para §1.177. Para medir pela linha indicada, a unidade deve ser explícita.

**Emenda proposta:**

> O limite de referência é de trezentos mil tokens, medidos pelo total indicado em «tokens used»; se for ultrapassado, o relatório apresenta o total e a razão.

Não encontrei «casa» no brief nem na adenda. A palavra aparece em comentários e notas dos materiais de apoio, que não devem ser importados para a prosa pública. Também não encontrei, no §2, um adjetivo colado ao nome de uma pessoa ou partido.

## 4. O veredicto

**Não está pronto para um construtor que não pode perguntar nada.** O construtor ainda teria de decidir o alcance das conclusões, o tratamento inglês das citações, a ligação entre páginas sem linhas comuns e o que fazer quando uma parte obrigatória não pode ser publicada.

Tiraria a absolvição integral das duas afirmações sobre a Saúde, a ausência afirmada sobre o relatório inteiro, a alegação de pesquisa não documentada, a previsão de menos receita e a decisão do quarto item dentro deste bloco. Tiraria também a inflação de 2026 do item 3, onde não participa na comparação.

Falta fechar a linha `afirmacao` do CFP, incorporar a despesa efetiva consolidada na comparação da Saúde, fixar as palavras das duas edições, resolver expressamente a integração temática e identificar os comandos de aceitação.

Não falta autorização para o construtor escrever mais. **Faltam decisões editoriais e provas que o construtor não deve substituir por iniciativa própria.**