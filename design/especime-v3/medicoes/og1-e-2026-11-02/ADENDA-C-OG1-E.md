# Adenda C ao mandato OG1-E: quem publicou cada documento, as citações fora das grelhas, as edições guardadas e o título como dado (02.11.2026)

Acrescenta: frases

*A sessão da OG1-E, as mesmas worktrees (o sítio `og1e-2026-11-02`, por cima de 2b5a966da, a fusão de main com o lote 1 aterrado, feita por este lugar; o motor `og1e-2026-11-02`). Escrita pelo lugar de direção (Claude Opus 5.5) depois de ler o teu relatório da adenda B e o teu `depois.json`. Paraste bem na voz. As 206 recusas eram de três classes, e uma delas é um defeito do sítio inteiro, no ar desde 19.10: o campo "Publicado por" do recibo diz o nome de quem é citado. Exemplo no ar, conferido por este lugar antes das 21:59 UTC: "Publicado por Luís Montenegro, em Montenegro nega ter acusado manifestantes de egoísmo…", um artigo do Diário de Notícias. A regra 15: corrige-se a classe, no que há e no que vier, por régua. Uma só passagem (a M99). A colisão da política da ED1 com "Edições" é da adenda F da ED1, que corre depois desta.*

## §0 Medido (02.11.2026, por guião, no `dist/` desta cabeça e nos documentos alojados do motor)

- **A causa**, no motor: `publisher/hb1_export.py`, linha 24, `source=(r.get('attributed_to') or engine_entities(...))[0]`; o mesmo padrão em `publisher/eo1_export.py`, linha 72. O `source` é o que o sítio imprime como "Publicado por" (`src/views/LinhaView.astro`), como a etiqueta do selo e na grelha das áreas.
- **4 141 linhas** no livro, **75 valores** distintos de `source`, **121 linhas** de citação (`unit` "afirmação").
- **As 26 linhas erradas**, com o publicador medido no documento alojado (`og:site_name`, o `publisher` do JSON-LD ou dos microdados, ou o emissor no PDF):
  - Diário de Notícias (`dn.pt`, `og:site_name` e JSON-LD): `hab-imprensa-pm-15`, `-pm-16`, `-psp-ferido`, `-feridos39`, `-feridos35`, `-mai`.
  - RTP (`rtp.pt`, `publisher` dos microdados, `itemprop="name"`; o `og:site_name` da RTP é o título do artigo, não serve): `hab-imprensa-debate-custos`, `-debate-protecao`, `-igai`, `-assistidos`, `-feridos37`, `-acampados`.
  - DNOTICIAS.PT (`dnoticias.pt`, `og:site_name`; é outro jornal, não o Diário de Notícias de `dn.pt`): `hab-imprensa-amorim`, `posicao-jpp-irs`.
  - Partido Comunista Português (`pcp.pt`, `og:site_name`): `hab-pcp-rendas`, `afirmacao-pcp-paula-investimento-saude-2026-10-12`, `afirmacao-pcp-paula-ppp-2026-10-12`, `afirmacao-pcp-ppp-2026-10-15`.
  - Partido Socialista (`ps.pt`, `og:site_name` "Site oficial do PS - Partido Socialista"; as outras 4 linhas de `ps.pt` já dizem "Partido Socialista"): `hab-ps-mais-valias`, `-rendas`, `-vazias`.
  - PAN (o projeto de resolução n.º 1272/XVII/2ª no PDF alojado: "a abaixo assinada Deputada Única Representante do PESSOAS-ANIMAIS-NATUREZA", "o PAN propõe"; as linhas análogas de `app.parlamento.pt` dizem "Chega" e "LIVRE"): `hab-pan-caucoes`, `-controlo`, `-tetos`.
  - Sindicato da Hotelaria do Sul (`sindicatos.cgtp.pt`, `og:site_name`; o sítio diz "hotelariasul"): `hab-cgtp-convocatoria`.
  - eventos.coletivos.org (`og:site_name`; o sítio diz "Não dá mais para viver assim", que é o título do evento): `hab-plataforma-reivindicacoes`.
- **As 206 recusas** do teu `depois.json`, 44 rotas: as páginas das linhas do livro e os dois índices (`/livro-razao`, `/en/ledger`); a página da área `infraestruturas-e-habitacao` nas duas edições (5 cada); quatro primeiras edições guardadas (o Orçamento de 21.10, 5 por língua; a habitação de 29.10, 2 por língua).
- **A grelha da área da habitação** mostra **29 citações por edição** como cartões de medida (unidade "citação", "quotation"), sem aspas, com o excerto no lugar do valor. É a única página com cartões de citação (procura deste lugar em todo o `dist/`).

## §1 Quem publicou, por régua (a classe)

1. **O registo dos publicadores**, fechado: cada nome que o sítio imprime como "Publicado por" é uma entrada com os seus domínios e a forma como se mediu (o documento alojado, ou o organismo dono do domínio para as fontes oficiais), construído a partir das 75 formas de hoje menos as 26 do §0. Os pares de nomes que já existem para o mesmo organismo ("UTAO" e "Unidade Técnica de Apoio Orçamental", "CFP" e "Conselho das Finanças Públicas", "PCP" e "Partido Comunista Português", "INE" e "Instituto Nacional de Estatística") ficam como aliases da mesma entrada, sem mudar o que as linhas dizem.
2. **No motor:** os dois exportadores tiram o `source` do registo pelo documento da linha, nunca de `attributed_to`; sem entrada, a exportação falha. As 26 linhas passam aos nomes do §0. O `attributed_to` de cada linha não muda: quem fala continua a ser dito pela atribuição, nas frases, como hoje.
3. **No sítio:** uma régua no `build` recusa uma linha cujo `source` não esteja no registo, ou cujo domínio de `source_url` não seja um dos da sua entrada (as linhas calculadas, sem endereço, ficam de fora como hoje). Plantas: uma linha da imprensa com o nome de quem fala no `source`; um nome fora do registo; um domínio trocado; e o controlo intacto.
4. **O registo das correções:** cada uma das 26 linhas ganha uma entrada de correção do campo, datada de 02.11.2026, com o valor anterior e o novo, e o motivo, palavra por palavra, nas duas línguas (as duas frases a seguir); cada linha mostra a sua correção no recibo, como mostra as outras.
   - pt «O campo Publicado por não dizia quem publicou o documento; passou a dizer o nome que o próprio documento dá a quem o publica.»
   - en «The Published by field did not name who published the document; it now gives the name the document itself gives its publisher.»

## §2 As citações fora das grelhas de medidas

Uma linha de citação (`unit` "afirmação") não se rende como cartão de medida em nenhuma grelha de nenhuma página (as áreas e qualquer outra que use o mesmo cartão). As 29 citações saem da grelha da área da habitação nas duas edições; o seu lugar continua a ser o estudo, onde são compostas com a atribuição e o documento, e o livro. Uma régua recusa um cartão de medida de uma linha de citação; planta. Se uma conferência exigir que cada linha do estudo apareça na grelha da área, é mobília: muda de forma conservando o que protege (cada linha tem um lugar alcançável).

## §3 As páginas do livro e as edições guardadas

1. **As páginas do livro** (as das linhas e os dois índices) são registos com campos, não prosa: a régua das formas deixa de lhes aplicar a regra das frases e aplica a regra do registo. Numa linha `relato`, a página imprime o "Publicado por" do registo (o jornal) e o título do documento, e a atribuição com "Atribuído a"; numa linha `palavras`, o "Publicado por" do registo e a atribuição. Plantas: a página de uma linha `relato` com o nome de quem fala no "Publicado por"; uma sem o título do documento.
2. **As edições guardadas** (as versões da lista `edicoes` da ED1 que não são a atual, conferidas pelo sha256 da lista) conservam o texto como foi publicado, e a régua das formas não as julga: a edição atual e a entrada `texto` do registo dizem o que mudou. A régua lista-as no `depois.json` com o sha256 e a contagem das recusas que conservam; uma página fora da lista nunca fica de fora. Planta: uma página guardada com um byte mudado deixa de estar dispensada e falha.

## §4 O título como dado e o teto da L1

1. **O título de um estudo publicado é um dado, não prosa:** onde uma página imprime o título de um estudo de `WORKS` (a entrada do registo da habitação, as listas), marca-o, e a voz não procura frases retiradas dentro de um título marcado; o portão confere que o texto marcado é igual a um título de `WORKS` na mesma língua. Plantas: um título marcado que não é título nenhum; "A casa em Portugal" fora de um título marcado continua a morder.
2. **A L1:** o teto passa de 3 462 para 3 464, com a razão escrita junto dele: as duas páginas da primeira edição guardada da habitação (29.10.2026), uma por língua.

## §5 O fim

Um commit no motor (o gancho corre o `core.gate` uma vez), depois os commits do sítio por secção; as conferências tocadas e o `build` inteiro pelo escrivão; o `depois.json` refeito, com zero recusas fora das edições guardadas listadas. A voz pode ficar vermelha só pela política da ED1 ("Edições", "Editions"), que a adenda F da ED1 resolve a seguir: diz no relatório se é a única causa. Setenta e cinco minutos, cento e vinte chamadas. Paras e dizes: se o publicador de uma das 26 linhas não se puder medir no documento alojado; se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer; se as 29 citações forem a única entrada de alguma delas no sítio fora do livro.
