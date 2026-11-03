# Adenda F ao mandato OG1-E: os relatos da cronologia da habitação, a régua do recibo, os textos fora das grelhas e a recontagem do projeto (03.11.2026)

Acrescenta: frases

*A sessão da OG1-E, as mesmas worktrees (o sítio `og1e-2026-11-02`, por cima de b97a746f2; o motor `og1e-2026-11-02`, 1723839). Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta do Opus às correções B a E (01:40 a 01:51 UTC, quatro plantas em cinco). Os achados reais que se corrigem antes de aterrar estão abaixo. Os Minor que não tocam uma pessoa nem uma frase falsa vão para a higiene de sexta: o domínio partilhado de `app.parlamento.pt`, «hotelariasul» e «Não dá mais para viver assim» como atribuição, e as docstrings do motor. Uma só passagem (a M99). Retoma de 03.11.2026: a primeira tentativa parou, bem, em «RTP Antena 1» (um algarismo sem linha); a frase do §2 passa a «confirmou à RTP» e «confirmed to RTP».*

## §0 Medido (03.11.2026, por este lugar, nos documentos alojados do motor e no `dist/` de b97a746f2)

- **A cronologia** é a linha 59 dos gabaritos `content/28 Habitacao Estudo/Technical Source/documento.pt.md.tmpl` e `documento.en.md.tmpl`. Diz «segundo a organização» para `hab-imprensa-feridos39`, «segundo a PSP» para `hab-imprensa-psp-ferido` e «segundo Luís Silva…» para `hab-imprensa-assistidos`, e nenhum relato nomeia a notícia. Nas cópias alojadas:
  - `imprensa-9.html` (Diário de Notícias): «que segundo contas da organização deixou 39 feridos, dois deles graves, anunciando a PSP que um polícia ficou ferido».
  - `imprensa-7.html` (RTP, «Montenegro afasta "país em turbulência"…»): «O comandante dos Bombeiros Voluntários do Porto confirma à RTP Antena 1 que oito pessoas foram assistidas no seu quartel», sem aspas. Na mesma notícia: «Em comunicado, o Movimento pela Habitação veio denunciar… apontando para pelo menos "37 feridos, dois em estado grave"» e «Duas pessoas foram encaminhadas para o hospital.»
  - `imprensa-6.html` (RTP): «Os manifestantes… fazem-no "não como uma escolha de lazer, ou de campismo, mas como ato de desespero político"». Não há texto escrito pelos acampados, e o gabarito diz «os acampados escreveram».
  - `imprensa-8.html`: «José Soeiro, dirigente nacional do BE, disse que…».
- **A régua das formas** aceita um `relato` com a atribuição sozinha («relato sem documento ou atribuição na mesma frase»). É por isso que a cronologia passou.
- **`conferirRegistoDaCitacao`** (`scripts/forma-da-citacao.mjs`, perto da linha 81) usa `.some()`: um recibo com um "Publicado por" certo e outro errado passa.
- **Os cartões de texto:** 21 cartões com a unidade «texto da fonte» na grelha da área da habitação em português (procura deste lugar em todo o `dist/`; é a única página), entre eles excertos da imprensa (`hab-imprensa-renda-metade`, `-tendas`, `-manif-*`) e `hab-plataforma-reivindicacoes`. O livro tem 146 linhas com a unidade `texto` e 83 com `afirmação`.
- **O índice** diz da linha `correcoes-publicadas` «de 15 para 45, a fonte reviu para cima» e «the source revised it upwards» (`src/i18n/strings.mjs`, chaves `subiu` perto das linhas 1862 e 3895). A fonte da linha é este projeto, e a mudança é uma recontagem.
- **As 102 revisões de proveniência** que ficaram foram lidas uma a uma por este lugar, por `yaml`, sobre os motivos inteiros: 32 endereços que o publicador mudou ou rodou, 27 datas de acesso de releituras, 43 excertos que passaram a transcrever o que a fonte imprime de novo; nenhuma outra. A descrição «Não é erro» é verdade para todas.

## §1 A régua dos relatos (a classe)

Uma linha `relato` só passa se a frase nomear o documento que a relata: o token `documento` da linha, ou o mesmo título conferido (o mesmo sha256) de outra linha do mesmo documento na mesma frase. A atribuição sozinha ("segundo a organização") recusa-se, no compositor e no portão do HTML, em todas as páginas. Plantas: a frase de hoje da cronologia (recusada); uma frase com duas linhas do mesmo documento e o título dito uma vez (aceite); uma frase com o título de outro documento (recusada).

## §2 A cronologia (substitui, na linha 59 dos dois gabaritos, desde «os acampados escreveram» até «todas vêm dos jornais citados.»)

- pt «a ⟦lit:14 de outubro⟧, a notícia «⟦HB:hab-imprensa-acampados|documento⟧» escreveu que os manifestantes acampados ali estavam «⟦HB:hab-imprensa-acampados|excerto⟧»; a ⟦lit:15 de outubro⟧, a intervenção da polícia deixou feridos, e as contagens chegaram pela imprensa: pela notícia «⟦HB:hab-imprensa-feridos37|documento⟧» da RTP, «⟦HB:hab-imprensa-feridos37|excerto⟧», segundo um comunicado do ⟦HB:hab-imprensa-feridos37|atribuicao⟧, e «⟦HB:hab-imprensa-hospital|excerto⟧», e a mesma notícia escreve que o comandante dos Bombeiros Voluntários do Porto confirmou à RTP que «⟦HB:hab-imprensa-assistidos|excerto⟧»; pela notícia «⟦HB:hab-imprensa-feridos35|documento⟧», «⟦HB:hab-imprensa-feridos35|excerto⟧», segundo ⟦HB:hab-imprensa-feridos35|atribuicao⟧; e pela notícia «⟦HB:hab-imprensa-feridos39|documento⟧» do Diário de Notícias, «⟦HB:hab-imprensa-feridos39|excerto⟧» segundo as contas da organização, e «⟦HB:hab-imprensa-psp-ferido|excerto⟧» segundo a PSP. Nenhuma destas contagens vem de um documento da PSP ou da IGAI: todas chegaram pela imprensa.»
- en «on ⟦lit:14 October⟧, the report «⟦HB:hab-imprensa-acampados|documento⟧» wrote that the campers were there «⟦HB:hab-imprensa-acampados|excerto⟧»; on ⟦lit:15 October⟧, the police intervention left injured people, and the counts came through the press: by the RTP report «⟦HB:hab-imprensa-feridos37|documento⟧», «⟦HB:hab-imprensa-feridos37|excerto⟧», according to a statement by the ⟦HB:hab-imprensa-feridos37|atribuicao⟧, and «⟦HB:hab-imprensa-hospital|excerto⟧», and the same report writes that the commander of the Porto Volunteer Firefighters confirmed to RTP that «⟦HB:hab-imprensa-assistidos|excerto⟧»; by the report «⟦HB:hab-imprensa-feridos35|documento⟧», «⟦HB:hab-imprensa-feridos35|excerto⟧», according to ⟦HB:hab-imprensa-feridos35|atribuicao⟧; and by the Diário de Notícias report «⟦HB:hab-imprensa-feridos39|documento⟧», «⟦HB:hab-imprensa-feridos39|excerto⟧» by the organisers' count, and «⟦HB:hab-imprensa-psp-ferido|excerto⟧» according to the PSP. None of these counts comes from a document of the PSP or the IGAI: all came through the press.»

Se a composição recusar um token destas frases (por exemplo o `documento` de uma linha que não o tenha), paras e dizes qual.

## §3 As frases pequenas

1. No ponto 6 dos dois gabaritos, a sigla abre-se sem repetição: pt «segundo ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (o BE é o Bloco de Esquerda)» em vez de «segundo ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (o Bloco de Esquerda, o BE)»; en «according to ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (BE)» em vez de «according to ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (the Left Bloc, BE)».
2. O nome inglês da linha `hab-imprensa-pm-16` lê «about prime Minister's subsequent statement»: passa à forma inglesa certa, com «the Prime Minister's»; procura a mesma falha nos nomes ingleses das outras linhas da imprensa e corrige-a onde estiver.
3. O índice, para uma linha cuja fonte é este projeto, troca a frase da revisão: pt «, recontado por este projeto» em vez de «, a fonte reviu para cima» ou «para baixo»; en «, recounted by this project» em vez de «, the source revised it upwards» ou «downwards». Planta: uma linha do projeto com a frase da fonte (recusada).

## §4 A régua do recibo

Todos os elementos marcados `data-linha-campo="source"` e todo o texto «Publicado por» ou «Published by» de um recibo, incluindo a meta descrição, têm de dizer o publicador do registo. Basta um errado para recusar. Planta: um recibo com o certo e um errado ao mesmo tempo (recusada).

## §5 Os textos fora das grelhas (a mesma classe das citações da adenda C)

Uma linha cujo valor é um texto (`unit` «afirmação» ou «texto») não se rende como cartão de medida em nenhuma grelha. Os 21 cartões saem da grelha da área da habitação nas duas edições. O seu lugar continua a ser o estudo e o livro: confirma, por guião, que cada uma das 21 linhas se alcança do estudo. A régua dos cartões passa a recusar as duas unidades, com uma planta para `texto`. Antes de `check:rotulos --escrever`, confirma por guião que as diferenças são exatamente as chaves destes cartões, nas duas línguas.

## §6 A edição da habitação e a sua entrada

A versão atual do estudo da habitação ainda não foi publicada. Absorve estas mudanças e passa a ter a data de 03.11.2026; a sua entrada `texto` no registo passa a ser uma só, de 03.11.2026, palavra por palavra:
- pt «Três contagens da imprensa sobre a intervenção policial no Porto apareciam como palavras da organização, da Polícia de Segurança Pública (PSP) e do comandante dos bombeiros, e uma frase dizia que os acampados tinham escrito o que uma notícia lhes atribui; são o relato de notícias, e as frases passaram a nomeá-las.»
- en «Three press counts on the police intervention in Porto appeared as the words of the organisers, of the Public Security Police (PSP) and of the fire brigade's commander, and a sentence said the campers had written what a news report attributes to them; they are news reports' accounts, and the sentences now name them.»

A prova da habitação diz o que mudou entre a primeira edição guardada (29.10.2026) e esta, nas duas edições.

## §7 O fim

Um commit no motor se os gabaritos o pedirem (o gancho corre o `core.gate` uma vez), depois os commits do sítio por secção; as conferências tocadas e o `build` inteiro pelo escrivão, verde. Sessenta minutos, noventa chamadas. Paras e dizes: se uma frase do §2, do §3 ou do §6 for apanhada pela voz ou pela L3 (diz qual); se a composição recusar um token; se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer.
