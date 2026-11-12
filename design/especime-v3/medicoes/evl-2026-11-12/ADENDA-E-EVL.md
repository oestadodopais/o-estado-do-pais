# Adenda E do EVL: o que a leitura a frio achou, no motor e no sítio (12.11.2026)

Acrescenta: frases
Medidas: medidas-evl-e.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede. A worktree de arranque é a do sítio `evl-2026-11-12`; a outra pasta com escrita é a worktree do motor `evl-2026-11-12`. Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`, em cada repositório. O teu relatório vai para `RELATORIO-EVL-E.txt`, nesta pasta, com quinze linhas no máximo; as tuas medidas e registos para esta pasta (`medidas-do-construtor-evl-e.json`, `evl-e-conferencias/`). O registo de uma construção ou de um portão não se comita inteiro: só o código e as últimas vinte linhas.*

## Porquê

O Opus leu o bloco a frio e apanhou as cinco plantas. Fora delas, achou cinco coisas que este lugar confirma e que um leitor veria ou que abrem uma régua. Três são deste lugar: o cartão repete os dois números (nas medidas e na frase) e não diz de quem é o relatório de progresso; a conta do recibo da soma traz um número sem linha e uma qualificação que as páginas citadas não dizem; e a adenda B deixou dois selos em frases que usam os 34 milhões com outro sentido. Uma é do construtor: a guarda da página no exportador ficou mais larga para todas as travessias.

## §0 O que se mediu (por `medir-evl-e.py`, nesta pasta, com o leitor do próprio motor)

1. Os dois excertos alargados da página 57 das contas, que o ponto 3 escreve, estão inteiros e únicos na página, e cada um tem o seu número.
2. A página da Câmara sobre o protocolo de 2023 (`55-cme-protocolo-2023.html`, alojada na pasta `source/` do estudo) tem, inteiro e único, o excerto que o ponto 1 escreve.
3. No livro do estudo há duas linhas com o valor 34: `painel-transferido` e `evl-governo-a-financiar`. O gabarito português tem dez ocorrências de `painel-transferido`.
4. No livro do sítio, cinco linhas têm a fonte `European Commission`, e uma (a deste bloco) tem a fonte que este lugar inventou no mandato.

Outras medidas da mesma coisa: nenhum número novo chega ao leitor nesta passagem; sai um (o milhão e meio da Linha do Vagar na conta do recibo).

## No motor

1. **Dois números ligados à linha que a frase diz.** O texto não muda, e os resumos do HTML do estudo ficam os mesmos.
   - Na unidade `C040`, a segunda frase diz que os 34 milhões são a parte do Estado que a Câmara anunciou para o protocolo em junho de 2023. Esse número passa a resolver numa linha própria nova, na página da Câmara sobre o protocolo (`55-cme-protocolo-2023.html`), com o excerto

   `com uma verba de 34 milhões de euros, através de financiamento público nacional e europeu`

   - Na unidade `C007`, a frase que começa por `Fora dos` fala do que as contas declaram para lá dos 34 milhões. Esse número passa a resolver em `evl-governo-a-financiar`, que é a linha das mesmas contas.
   - Nas duas línguas. Nenhuma das duas linhas atravessa para o sítio: os dois selos saem da página do estudo, e ficam onze por língua. Confere um a um os onze que ficam: a frase à volta fala do relato ao painel de junho de 2025, ou da soma das contas.

2. **A guarda da página no exportador volta a morder.** Em `publisher/export_site_rows.py`, a página e o localizador declarados na travessia conferiam-se contra um palheiro que passou a incluir o bloco `document` inteiro da linha, com o resumo sha256: os algarismos do resumo deixam passar páginas que a linha não tem. Quando a linha do motor traz o bloco `document`, a página declarada na travessia tem de ser igual ao campo `page` desse bloco, e o localizador tem de dizer essa página; o palheiro fica como era antes deste bloco para as linhas sem `document`. Plantas: uma página trocada por outra cujos algarismos existam no resumo recusa; a página certa passa; uma linha antiga sem `document` comporta-se como antes.

3. **A proveniência dos registos.** A mudança em `source_provenance` (`publisher/export_records.py`) foi feita para uma linha que a adenda A depois desfez. Se as suites e o portão ficarem verdes sem ela, volta ao que era; se alguma coisa depender dela, fica, e dizes o quê.

4. **As cinco linhas na travessia.**
   - A fonte da linha do relato ao painel passa a ser a que a casa já usa para a Comissão, `European Commission`, e a atribuição passa a ser o nome que o documento dá ao painel, `ECOC Expert Panel`.
   - O excerto da linha da cultura passa a ser

   `15 milhões de euros GEPAC - Gabinete de Estratégia, Planeamento e Avaliação Culturais (Ministério da Cultura, Juventude e Desporto) contratualizados. Pago 3.750.000€ durante o ano de 2025`

   - O excerto da linha do turismo passa a ser

   `4 milhões de euros Turismo de Portugal (Ministério da Economia e Coesão) contratualizados. Pago 3.920.000€ durante o ano de 2025`

   - Cada um como a camada de texto o tem, contíguo. Os recortes das duas páginas refazem-se se o exportador os prender ao excerto.

5. **A prova no motor.** As suites que tocares; o `core.gate` uma vez no fim, com o código e as últimas vinte linhas nesta pasta; o exportador das linhas e o dos registos com `--site` na worktree do sítio; e `atravessar-provas-documentais.py` (na pasta `evb-2026-11-11` do sítio) outra vez, porque os registos mudam.

## No sítio

6. **O cartão.** As duas medidas ficam, com nomes curtos que dizem quem diz cada número; a frase volta a ser a unidade `C005` inteira, como estava no `main` `7000c5448` (a entrada, a `origem` e as provas dessa cabeça), que diz o que os dois números não dizem sozinhos. Com as medidas por cima, a frase já tem a quem se refere. Os anos como referências de ano da casa.

   - a soma, pt:

   «milhões de euros recebidos do protocolo até ao fim de ⟦2025⟧, pelas contas da Associação Évora 2027»

   - a soma, en:

   «million euros received under the protocol up to the end of ⟦2025⟧, by the accounts of the Associação Évora 2027»

   - o relato, pt:

   «milhões de euros que o relatório de progresso de Évora 2027 dava como já transferidos em junho de ⟦2025⟧, pelo resumo do painel europeu»

   - o relato, en:

   «million euros that Évora 2027's progress report gave as already transferred in June ⟦2025⟧, by the European panel's summary»

   - a frase, pt:

   «A associação escreve que reabriu em ⟦2025⟧ o diálogo com a Câmara para obter o dinheiro de que precisa para honrar os compromissos com entidades artísticas, culturais, educativas e sociais.»

   - a frase, en:

   «The association writes that in ⟦2025⟧ it reopened dialogue with the Câmara to obtain the money it needs to honour its commitments to artistic, cultural, educational and social bodies.»

   A frase não tem números de linha: só a referência de ano. As duas frases da `C004` saem do cartão. A via das primeiras frases de uma unidade fica como está, com as suas plantas.

7. **Os recibos.**
   - O nome da medida da cultura, pt:

   «euros pagos em 2025 pelo GEPAC, o Gabinete de Estratégia, Planeamento e Avaliação Culturais, segundo as contas da associação»

   - O nome da medida da cultura, en:

   «euros paid in 2025 by GEPAC, the Gabinete de Estratégia, Planeamento e Avaliação Culturais, according to the association's accounts»

   - A conta da soma, pt:

   «2 000 000 + 3 750 000 + 3 920 000 = 9 670 000 euros, 9,7 milhões. São a contribuição inicial do Estado e os pagamentos de 2025 da cultura e do turismo, como as contas da associação os declaram.»

   - A conta da soma, en:

   «2 000 000 + 3 750 000 + 3 920 000 = 9 670 000 euros, 9,7 million. They are the initial State contribution and the 2025 payments from culture and tourism, as the association's accounts declare them.»

   A frase sobre a Linha do Vagar sai da conta, nas duas línguas. A edição inglesa escreve a vírgula decimal, como o valor ao lado.

8. **As listas fechadas que mexem.** As que a frase e os nomes novos tocam: `ledger/frases/evl.json`, `tests/cartao/leituras-provadas.json`, o inventário das frases (as duas frases da `C004` e os quatro nomes curtos anteriores passam a retirados; as duas linhas da `C005` voltam a vivas; entram os nomes novos), as declarações de língua (a fonte e a atribuição novas; a fonte inventada sai), `familias-evl.mjs`, `nomes-das-medidas.mjs`, as provas da leitura do EVB, o cruzamento, e as plantas da voz das medidas. Uma lista que eu não nomeei e que mexa: diz qual.

9. **A prova no sítio.** Por nome, cada código lido de um ficheiro: `ledger:check`, `check:cruzamento` (com o motor), `check:selos`, `check:cartao`, `check:leituras`, `check:frases-afirmacao`, `check:frases-reais`, `check:voz`, `check:voz-retiradas`, `check:lingua`, `check:eo1`, `check:paridade`, `check:lugar`, `gate:html`, `typecheck`. O `build` inteiro, o `check:alvos` e a lista inteira corre-os este lugar. No relatório: o cartão como o HTML construído o imprime nas duas línguas (as duas medidas e a frase), e o que os recibos da cultura, da soma e do relato imprimem de novo.

## O que fica como está, por decisão

O texto julgado do estudo. Os outros nomes de medida e os outros excertos. A forma do cartão com as duas medidas. As questões menores da leitura (a declaração de língua pela cadeia do localizador, a exceção por prefixo em `TextoDoNome.astro`, as folgas da via das primeiras frases, os selos dentro de citações): vão para o bloco de higiene, não lhes toques.

## Quando paras

Num número, numa fonte ou numa pessoa: um excerto que não esteja inteiro e único no lugar dito; um dos onze selos que fiquem numa frase que não fale da medida da sua linha (diz qual, não o tires por tua conta); a frase do cartão que só passe mudando uma palavra. Paras nesse ponto, dizes o que viste, e fazes os outros. Para tudo o resto: decide, anota e continua.

## O fim

Os nove pontos, cada um no seu commit, e o relatório curto: ponto a ponto o que ficou feito, as plantas, as listas que mexeram, os códigos, o que ficou por correr fora da sandbox.
