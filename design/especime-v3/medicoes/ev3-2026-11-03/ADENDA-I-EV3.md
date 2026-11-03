# Adenda I ao mandato EV3: o publicador medido no documento e a edição guardada como foi publicada (03.11.2026)

Acrescenta: frases

*A mesma sessão, logo a seguir à adenda H. Três Minor da leitura a frio que o leitor vê numa página, num recibo ou numa edição guardada, e que este lugar decidiu não deixar para a higiene de sexta-feira, à pergunta do financiador (15:34 e 15:37 UTC).*

## §0 O dinheiro do Rossio, nos documentos da Câmara (a leitura, 12)

O quadro do estudo lista o Rossio de São Brás como intervenção do Plano de Recuperação e Resiliência com 4 100 000 €, e o parágrafo novo diz a segunda parte da obra inteiramente financiada pelo Fundo Ambiental, sem nada que ligue os dois. A Câmara liga-os nos seus próprios documentos. Na nota "Aberto concurso de requalificação do Rossio de São Brás" (https://www.cm-evora.pt/aberto-concurso-de-requalificacao-do-rossio-de-sao-bras/, "Atualizado em 21/05/2026 publicado em 25 de February de 2026"), lida por este lugar a 03.11.2026, a Câmara escreve: "A intervenção, enquadrada na preparação de Évora para a Capital Europeia da Cultura 2027 e apoiada por financiamento do Plano de Recuperação e Resiliência, pretende transformar o Rossio de São Brás numa nova grande praça urbana".

1. Alojas a nota pelo processo da adenda C (a cópia com o recibo do pedido, o publicador medido nela) e acrescentas a linha `ev3-rossio-prr`, com o valor e o excerto "apoiada por financiamento do Plano de Recuperação e Resiliência", medido na cópia alojada. Se a cópia não trouxer a frase, paras e dizes.
2. No fim do primeiro parágrafo (depois da frase da prorrogação da primeira fase, como a adenda H a escreve), acrescentas:
   - pt «Na nota em que anunciou a abertura do concurso da requalificação, a Câmara escreveu que a obra era «⟦EV:ev3-rossio-prr⟧»; a segunda parte é a do Fundo Ambiental.»
   - en «In the notice announcing the tender for the works, the Câmara wrote that they were supported by Recovery and Resilience Plan funding («⟦EV:ev3-rossio-prr⟧»); the second part is the one funded by the Fundo Ambiental.»
3. A frase não tem data de propósito: a nota foi atualizada a 21.05.2026, e não se sabe se a frase do financiamento já estava na de 25.02. Também não diz quantas origens de dinheiro a obra tem: há uma operação do FEDER com o nome do Rossio que este lugar não mediu.

## §1 O publicador medido no documento (a leitura, 13)

A classe que a OG1-E corrigiu esta manhã no sítio inteiro: o "Publicado por" de cada recibo é um nome que o próprio documento escreve.
- O edital da Câmara de 15.10 está registado com o publicador "Município de Évora", e o texto do edital não escreve esse nome; escreve "Presidente da Câmara Municipal de Évora". O publicador passa a um nome que o edital escreve, medido no texto alojado, pela régua e pelo registo fechado dos publicadores (`ledger/publicadores.json`), com a prova no documento.
- A página das notícias da associação: o publicador registado ("Évora 2027") e o nome que a linha dá ("Associação Évora 2027") passam a ser o mesmo, o que a página alojada escreve, medido nela.
- Confere por guião os cinco documentos da EV3: para cada um, o nome do publicador e a contagem das suas ocorrências no texto alojado; nenhum a zero. Se a régua dos publicadores não cobrir as linhas do livro de um estudo do motor, diz-o no relatório com a medida, sem a mudar nesta passagem.

## §2 A edição guardada como foi publicada (a leitura, 20)

A primeira edição inglesa de Évora 2027, guardada "tal como foi publicada", serve agora quatro marcas `data-ev3-nome` que não tinha a 01.10.2026. As marcas dos nomes da EV3 aplicam-se à edição atual e nunca a uma edição guardada. Prova por guião: o HTML servido de cada edição guardada de Évora 2027, nas duas línguas, sem nenhuma marca `data-ev3-nome`, e o texto igual ao de hoje.

## §3 Quando paras

Só se o publicador de um dos documentos não tiver nenhum nome escrito no próprio documento (diz qual e o que o documento escreve), ou se uma régua que protege uma fonte tiver de enfraquecer.

## §4 O fim

O `build` inteiro verde; as conferências que esta mudança toca, com os códigos; as duas provas por guião e as frases do §0 copiadas do `dist/`, nas duas edições, no relatório. Commits só com caminhos explícitos, com o trailer da sessão. O `core.gate` inteiro do motor não corre nesta passagem: corre uma vez, na aterragem (os commits do motor com `OEDP_GATE=adiado`); do motor, só as conferências que a linha nova toca. A passagem da adenda H correu-o, e custou-lhe cerca de doze minutos. Vinte e cinco minutos, trinta e cinco chamadas.
