# Adenda H ao mandato OG1-E: o «pelo menos» dos 37, a frase do hospital e a sigla inglesa do BE (03.11.2026)

Acrescenta: frases

*A sessão da OG1-E, as mesmas worktrees (o sítio `og1e-2026-11-02`, por cima de 67e84f0e9, a adenda G; o motor `og1e-2026-11-02`, 373d234). Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda F (cinco plantas em cinco). Os três achados que se corrigem antes de aterrar mexem na qualificação de um número ou na atribuição de uma frase; o resto vai para a higiene de sexta. Uma só passagem (a M99).*

## §0 Medido (03.11.2026, por este lugar)

- `imprensa-7.html` (RTP): «apontando para pelo menos "37 feridos, dois em estado grave"». A cronologia e o ponto 6 dos dois gabaritos imprimem a contagem sem o «pelo menos». A primeira edição guardada (29.10.2026) também a imprimia sem ele, nas duas edições (lido por este lugar nas páginas construídas).
- No mesmo artigo, «Duas pessoas foram encaminhadas para o hospital.» é a narração da notícia, depois de «descreve Luís Silva», e não o comunicado do movimento. A frase de hoje junta-a ao comunicado com um «e».
- O `attributed_to_en` de `hab-imprensa-feridos35` é «José Soeiro, of the Left Bloc's national leadership». Com «(BE)» a seguir, a sigla lê-se como se abrisse «national leadership». A régua das siglas (`scripts/siglas-hb1.mjs`, linha 40) foi alargada na F para aceitar «'s national leadership»; em b97a746f2 a expressão era `(?:'s)?`.

## §1 Os gabaritos (linhas 20 e 59 dos dois)

1. **O ponto 6** (linha 20): pt «são pelo menos «⟦HB:hab-imprensa-feridos37|excerto⟧» segundo o movimento» em vez de «são «⟦HB:hab-imprensa-feridos37|excerto⟧» segundo o movimento»; en «are at least «⟦HB:hab-imprensa-feridos37|excerto⟧» according to the movement» em vez de «are «⟦HB:hab-imprensa-feridos37|excerto⟧» according to the movement».
2. **A cronologia** (linha 59), o pedaço da RTP:
   - pt «pela notícia «⟦HB:hab-imprensa-feridos37|documento⟧» da RTP, pelo menos «⟦HB:hab-imprensa-feridos37|excerto⟧», segundo um comunicado do ⟦HB:hab-imprensa-feridos37|atribuicao⟧; a mesma notícia escreve que o comandante dos Bombeiros Voluntários do Porto confirmou à RTP que «⟦HB:hab-imprensa-assistidos|excerto⟧», e que «⟦HB:hab-imprensa-hospital|excerto⟧»;» em vez de «pela notícia «⟦HB:hab-imprensa-feridos37|documento⟧» da RTP, «⟦HB:hab-imprensa-feridos37|excerto⟧», segundo um comunicado do ⟦HB:hab-imprensa-feridos37|atribuicao⟧, e «⟦HB:hab-imprensa-hospital|excerto⟧», e a mesma notícia escreve que o comandante dos Bombeiros Voluntários do Porto confirmou à RTP que «⟦HB:hab-imprensa-assistidos|excerto⟧»;»
   - en «by the RTP report «⟦HB:hab-imprensa-feridos37|documento⟧», at least «⟦HB:hab-imprensa-feridos37|excerto⟧», according to a statement by the ⟦HB:hab-imprensa-feridos37|atribuicao⟧; the same report writes that the commander of the Porto Volunteer Firefighters confirmed to RTP that «⟦HB:hab-imprensa-assistidos|excerto⟧», and that «⟦HB:hab-imprensa-hospital|excerto⟧»;» em vez do pedaço inglês correspondente de hoje.

## §2 A sigla inglesa

O `attributed_to_en` de `hab-imprensa-feridos35` passa a «José Soeiro, of the national leadership of the Left Bloc», no motor e no livro, e a régua das siglas volta à expressão de b97a746f2 (`(?:'s)?`). O `attributed_to` português não muda. Se a régua das siglas, de volta à forma antiga, recusar outra página, paras e dizes qual.

## §3 A entrada da habitação no registo (substitui a da adenda F §6; a mesma data, 03.11.2026)

- pt «Três contagens da imprensa sobre a intervenção policial no Porto apareciam como palavras da organização, da Polícia de Segurança Pública (PSP) e do comandante dos bombeiros, a do movimento aparecia sem o «pelo menos» com que a notícia a dá, e uma frase dizia que os acampados tinham escrito o que uma notícia lhes atribui; são o relato de notícias, e as frases passaram a nomeá-las.»
- en «Three press counts on the police intervention in Porto appeared as the words of the organisers, of the Public Security Police (PSP) and of the fire brigade's commander, the movement's count appeared without the «pelo menos» (at least) with which the report gives it, and a sentence said the campers had written what a news report attributes to them; they are news reports' accounts, and the sentences now name them.» («pelo menos» marcado `lang="pt-PT"`.)

A prova da habitação refaz-se: o que mudou entre a primeira edição guardada e a atual, nas duas edições.

## §4 O fim

Um commit no motor (o gancho corre o `core.gate` uma vez), depois os commits do sítio; o `build` inteiro pelo escrivão, verde, com as conferências das formas, das siglas, das edições, da voz e do HTML. Quarenta minutos, sessenta chamadas. Paras e dizes: se uma frase do §1 ou do §3 for apanhada pela voz ou pela L3 (diz qual); se a composição recusar um token.
