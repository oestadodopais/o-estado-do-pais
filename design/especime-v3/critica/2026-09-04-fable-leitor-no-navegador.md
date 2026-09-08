# Um leitor de primeira vez no navegador: a passagem de Fable pelo sítio no ar, 04.09.2026

*Claude Fable 5.1 como agente autónomo, no Chrome do diretor, das 09:13 às 09:53 (hora de Lisboa), 27 páginas carregadas com pelo menos 60 segundos entre cada uma, primeiro a 390 × 844 e depois a 1 280 × 800 (o navegador não encolhia abaixo de 700 px, e o sítio foi rendido dentro de um iframe do tamanho exato). Não é uma verificação de bloco (essas são do Codex, de outra família): é a leitura de um leitor, pedida pelo diretor a 04.09 («a real check on how everything works from the user perspective»). Triagem do lugar de direção: **um defeito grave, consertado a quente no bloco F1.4b**: todos os estudos diziam «publicado a 04.09.2026», porque o F1.4 lia a data do primeiro commit na construção e o Vercel constrói de um clone raso de dez commits, e por isso todas as primeiras datas eram a de hoje (no ar desde as 04:41 UTC); e os algarismos colados às palavras no telemóvel («308concelhos»). **Para o F1.10**, que já os tinha em parte: a faixa e o «Relance» com os mesmos oito números na página do concelho; as duas «fonte» em cada bloco de medida; as quatro datas de frescura sem rótulo claro no cabeçalho; a página de capa entre a lista dos estudos e o texto; o menu e o rodapé com listas diferentes; «Áreas» e «Domínios» indistinguíveis pelo nome; a régua das regiões repetida em cada região e o valor quatro vezes; a faixa do domínio «1 de 5» contra oito medidas listadas, o rótulo «Leitura breve» vazio, «FONTE FONTE» na manchete; as dezasseis linhas «ainda sem medidas conferidas» no índice dos domínios; o diagrama do Método cortado no telemóvel. **Fica dito e por decidir:** os rótulos das datas («lido», «conferido», «reconferido») e a linha «Fontes em atraso» são do F1.6 e do vocabulário; «provisório» explica-se uma vez. O texto do leitor fica como veio, com as suas próprias etiquetas de verificação.*

---

## Walkthrough report: oestadodopaís.pt, 04.09.2026, 09:13 a 09:53 WEST

**Method, stated plainly.** Chrome refused to shrink the window below ~700 px wide or above 806 px tall, so the site was rendered inside a same-origin iframe of exactly 390 × 844 (phone pass) and 1 280 × 800 (desktop pass), with real clicks and typed text; media queries responded to the iframe viewport, so layout is faithful. Not exercised: touch swipes, hover states, dark mode. 27 page loads in total (14 phone, 13 desktop), always ≥ 60 s apart; two full passes with three tasks plus five wander pages each do not fit in fifteen loads. Text extraction was sometimes blocked by the tool; quotes below come from screenshots and the DOM. Labels: [verified] = checked in the DOM/href; [observed] = seen in a screenshot; [unverified] = not checked.

Screenshots (104 files): `/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/78714fcd-9d7a-49ae-92d0-914347b16683/scratchpad/shots/` (named `phone-NN-…jpg`, `desktop-NN-…jpg`; key files cited inline).

---

### Task 1: the concelho of Évora and its numbers

**Phone path (2 taps + typing).** Home → tap the box under "ESCREVA O NOME DO CONCELHO" (1) → type "Évora" → a single suggestion "Évora" appears under the box → tap it (2) → `/municipios/evora`, headline "Évora tem 58 567 pessoas." (`phone-07-home-search-evora-suggestion.jpg`, `phone-08-evora-top.jpg`). The 8 numbers: the top rail shows 1.3 cards ("sem limiar · 1 de 8 · 58 567 · População residente"); six sideways swipes, or one screen down to "RELANCE", where the same 8 are stacked over 2 screens (`phone-09/10`). Page length 11.6 screens (9 783 px). Desktop: same 2 clicks; the rail shows 4 of 8, the "RELANCE" grid shows all 8 in 1.3 screens; page 9.4 screens (`desktop-07`, `desktop-08`).

**Hesitations.** Home offers three routes: the box, "MUNICÍPIOS" in the menu, and "Évora" under "Os nomes no mapa · Continente", which is the district, not the concelho [unverified where it leads]. On the concelho page, "sem limiar" on every number and "1 de 8" made me look for the other 7 sideways before finding them below.

**Did not understand.** "sem limiar"; "ABRIR" (on the phone it reveals one sentence, "Estimativa anual do INE para o concelho.", and becomes "FECHAR", `phone-21`; on desktop that sentence is already printed and clicking "ABRIR" jumped the page ~700 px with no visible change, `desktop-16` [observed, cause not checked]); the box "Évora · 308 · FONTE · trocar de concelho →": "308" with no noun (the chip says "calculado · O Estado do País, apuramento próprio" [verified], the number is the concelho count); "N.d."; "PROVENIÊNCIA" as a heading above "VOLTAR AO MAPA DOS MUNICÍPIOS / LIVRO-RAZÃO / COMO ISTO É FEITO" (`phone-19`); the "[a verificar]" badge inside "José Ernesto d'Oliveira, depois Manuel Melgão [a verificar] a partir de 01.05.2013" (`phone-14`).

**Repeated / contradictory on the page.** The 8 numbers appear twice (rail + "RELANCE"). Card "N.d. · Dias · dezembro de 2025 · Prazo médio de pagamento" vs prose "O prazo médio de pagamento a fornecedores passou de 22 dias em 2023 para 137 dias em 2025" vs table "PRAZO MÉDIO DE PAGAMENTO 137 dias" (`phone-10`, `phone-12`, `phone-13`). Card "1 409 · Pessoas · dezembro de 2025 · Desemprego registado" vs prose "caiu de 3 720 pessoas em 2013 para 1 596 em 2024" (prose stops a year earlier). "Ganho médio mensal" bars "Évora 1 484,5 / Portugal 1 576,0" also appear on the national domain page.

**Did not work (phone).** Chart labels are unreadable at 390 px: "dívida 54 681 562 / limite legal 77 764 656" under "A DÍVIDA CONTRA O TETO LEGAL" (`phone-12`), the index chart "242,6 · 182,0 · 141,9 · 105,5", and the party strip "PS CDU CDU CDU PS" (`phone-14`). Every line carries a "FONTE" chip; in the mandates section there are up to five per sentence (`phone-17`).

**Wanted, not found.** All 8 numbers on one phone screen; the publisher on the card itself (the card says "FONTE", not "INE"); a plain meaning for "sem limiar" and "N.d."; the difference between district Évora and concelho Évora.

---

### Task 2: the public debt (what, source, freshness)

**Phone path (2 taps from home; 4 from Évora).** Évora → "MENU" (1) → "INÍCIO" (2) → home → tap the first card "fora do limiar · 1 de 21 · 89,7 · Dívida pública · Percentagem do PIB · 2025 · FONTE · Domínios" (3). The whole card is a link overlay to `/dominios/economia-e-financas-publicas#m-e3` [verified]; the page opens scrolled to the block (`phone-23`):

> "Quanto deve o Estado?" / "Dívida pública" / "89,7 FONTE Percentagem do PIB" / "limiar 60% · fora do limiar" / "período 2025 · lido 12.08.2026 · conferido 01.09.2026" / "fonte Eurostat · General government gross debt (EDP concept), consolidated - annual data · % do PIB"

Tap the "FONTE" chip beside 89,7 (4) → `/livro-razao/divida-publica-2025` (`phone-28…31`): "LINHA DO LIVRO-RAZÃO", "89,7 % do PIB", "IDENTIFICADOR divida-publica-2025", "Publicado por Eurostat, em General government gross debt (EDP concept), consolidated - annual data (tipsgo10) · lido a 12.08.2026", "PÁGINA DA SÉRIE", "PROVA / CAMPO DEVOLVIDO … Portugal — 2025: 89.7 / Transcrito da fonte, palavra por palavra.", "PEDIDO", "VERIFICAÇÕES / LIDO A 12.08.2026 / RECONFERIDO A 01.09.2026 · conferência diária do ficheiro da fonte · o mesmo valor / RECONFERIDO A 31.08.2026 · reconferência semanal do painel · o mesmo valor", "Esta linha nunca foi corrigida nem atualizada.", "ESTADO DA PROVENIÊNCIA Completa." Ledger line 3.2 screens on the phone. Desktop: 3 clicks from Évora (INÍCIO, card, FONTE), 2.1 screens (`desktop-17`, `desktop-21…23`).

**Hesitations.** On the card: three tappable-looking things ("Dívida pública" underlined, "FONTE", "Domínios"); further down the home there is also a collapsible "Dívida pública" row under "Procedimento dos Desequilíbrios Macroeconómicos · 13 medidas com limiar" (`phone-04`), a second route I did not take. On the measure block: two "fonte"s, the chip "FONTE" and the line "fonte Eurostat · …". Freshness has four dates in play: "Painel europeu · 31.08.2026" (header of every page), "lido 12.08.2026", "conferido 01.09.2026", and on desktop "Fontes em atraso · 01.09.2026 21:07 WEST" (`desktop-01`); which one is "how fresh" is unclear.

**Did not understand.** "Painel europeu · 31.08.2026"; "Fontes em atraso · 01.09.2026 21:07 WEST" (it links to `/metodo#releitura` [verified], hidden on the phone); "lido", "conferido", "reconferido", "Repetir a leitura →"; "1 de 21" (13 + 8, learned only after scrolling the home); "ESTUDO: Quadro institucional de indicadores" on the ledger line ("estudo" here is not one of the "Estudos"); the dataset name only in English, no Portuguese definition of "Dívida pública"; the small-caps "FONTE" chip under the big number on the ledger line, which links to "#prova" on the same page [verified], so tapping it to reach the source scrolls you within the page.

**Repeated / contradictory.** "LIDO A 12.08.2026" three times on one ledger line page. The domain page rail says "1 de 5" while the page lists 8 measures (PIB real por habitante, Saldo, Dívida pública, Crescimento da despesa líquida, "Quanto deve a minha câmara, e qual é o limite?" 150, Taxa de emprego, Taxa de desemprego, Ganho médio mensal). "LEITURA BREVE" label with nothing under it before the first measure (`phone-25`). "Os valores, concelho a concelho" (disclosure) directly above "Os valores concelho a concelho →" (link) (`phone-26`). The domain page shows "Évora: 1 484,5 … Portugal: 1 576,0" [unverified whether this follows the concelho I had searched or is fixed].

**Did not work.** Headline chips "FONTE FONTE" side by side with no hint which number each covers (`phone-24`). The "Ganho médio mensal" bar labels are ~5 px on the phone (`phone-27`). Desktop: measures sit in a ~600 px column with the right half of the page empty (`desktop-19`).

**Wanted, not found.** One sentence saying what the measure is in Portuguese; one date labelled in plain words; a way back from the measure to the home list.

---

### Task 3: which studies exist, open one

**Phone path (4 taps).** "MENU" (1) → "ESTUDOS" (2) → `/estudos` (3.9 screens): "Estudos / Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá. / 12 FONTE trabalhos no arquivo · 16 FONTE edições" then a dashed box "Datas de publicação por confirmar." then 12 items, each with "PT"/"EN" boxes and "PUBLICADO A 04.09.2026" (`phone-33…36`). Tap the title "Évora — Orçamentado, Pago, Devido 2025" (3) → a cover page (2.9 screens): "RELANCE 61,44 % do orçamento foi de facto cobrado no último ano de contas / 96 % quatro anos antes", "LEITURA BREVE", "O DOCUMENTO ORIGINAL: LER NO SÍTIO → · LER O DOCUMENTO → · LER O DOCUMENTO · EN →", "O CONCELHO DE QUE TRATA Évora", "EDIÇÕES … PUBLICADO A 04.09.2026 · ÚLTIMA ATUALIZAÇÃO: 20.08.2026", "TEMA Évora", "DESCRIÇÕES PT … EN …", "DESCARREGAR Sem ficheiros.", "VOLTAR AO ARQUIVO" (`phone-37…40`). Tap "LER NO SÍTIO →" (4) → `/estudos/…/texto`: "DOCUMENTO DO ESTUDO · TEXTO", "NESTA PÁGINA" (collapsed), "1/14 Quatro limites", "SUBIR ↑" after each section; 23 screens (`phone-41…44`). Desktop: 3 clicks, text 19 screens with a side panel "88 blocos · 194 algarismos · 52 com linha do livro-razão" and a floating "SUBIR ↑" (`desktop-29…31`).

**Hesitations.** On the list, titles look like plain bold text and "PT"/"EN" look like badges; I guessed the title (both are links [verified]). On the cover: "LER NO SÍTIO →" vs "LER O DOCUMENTO →", repeated three times on one page; which is the study?

**Did not understand.** "DOCUMENTO ALOJADO"; "trabalhos no arquivo" / "arquivo" / "Estudos" (three names); "[a verificar]" badge on "Onde está a água?" (links to `/a-verificar` [verified]); why a cover page exists between the list and the text; two kinds of number marks in the text (underlined numbers with a "FONTE" chip and underlined numbers without, e.g. "5 013 000", "11,58", "48,1", `phone-44`), explained only by the desktop side panel's "52 com linha do livro-razão".

**Contradictory.** All 12 studies "PUBLICADO A 04.09.2026" (today), under a box "Datas de publicação por confirmar.", with "ÚLTIMA ATUALIZAÇÃO: 20.08.2026" earlier than the publication date (`phone-38`, `desktop-28`). "DESCARREGAR / Sem ficheiros." is an empty section.

**Wanted, not found.** List → text in one tap; a visible table of contents on the phone; the study's date of the underlying accounts on the list.

---

### Wander (five pages)

- **Menu (phone).** "MENU" opens inline and pushes the page down: "INÍCIO MUNICÍPIOS REGIÕES DISTRITOS ÁREAS DOMÍNIOS ESTUDOS LIVRO-RAZÃO AGENDA MÉTODO CORREÇÕES SOBRE / claro · escuro" (`phone-22`). "ÁREAS" and "DOMÍNIOS" are indistinguishable by name. The footer nav is a different list: "INÍCIO MUNICÍPIOS DOMÍNIOS ÁREAS ESTUDOS LIVRO-RAZÃO AGENDA MÉTODO CORREÇÕES SOBRE ENGLISH" (no REGIÕES, no DISTRITOS, different order) (`phone-06`). Desktop: the top nav wraps, "ENGLISH" alone on a second line at 1 280 px (`desktop-01`).
- **Regions.** `/regioes`: "As regiões de Portugal", "9 regiões" ("9" links to "#regua" on the same page [verified]), "A régua da convergência", "LEITURA BREVE / UE-27 = 100", rows "Portugal 82 provisório FONTE … Açores 73 provisório FONTE" (`phone-45…47`); desktop adds a dot ruler above the same rows (`desktop-33`). `/regioes/alentejo`: "O Alentejo está 23 pontos abaixo da média da UE-27. Em 2000 estava a 22: a distância aumentou.", "região NUTS II"; the value 77 appears four times (rail "1 de 2", "RELANCE", the ruler row, "As medidas") and the full 10-row ruler is repeated (`phone-48…51`); on desktop the rail has an empty grey cell after two cards (`desktop-34`). "provisório" is never explained.
- **Domains.** `/dominios` "Por domínio": 18 rows, one live ("Economia e finanças públicas · no ar · primeira vaga"), "Trabalho · as medidas estão em Economia e finanças públicas", 16 × "ainda sem medidas conferidas · primeira/segunda/terceira vaga" (`phone-52…54`). "no ar", "vaga", "conferidas" are house words.
- **Ledger index.** `/livro-razao`: "2916 afirmações · 330 de 2916 calculadas · 2767 de 2916 linhas de concelhos", search "PROCURAR POR NOME, IDENTIFICADOR OU FONTE" (not tested), then ~150 rows over 29 phone screens, each "6,1 FONTE Abandono escolar precoce abandono-escolar-precoce-2025 % FONTE Eurostat LIDO A 12.08.2026"; rows like "211 FONTE [A VERIFICAR] avisos-pt2030-abertos avisos FONTE [a verificar] LIDO A [a verificar]" (`phone-55…58`). The legend "OS DOIS ESTADOS DO SELO / proveniência completa / um campo por confirmar / O MARCADOR [a verificar] / O que quer dizer este marcador →" is a side panel on desktop (`desktop-39`) and the very last thing on the phone. "FONTE" is used as the chip and as the publisher label in the same row. "afirmações" here, "linhas" elsewhere.
- **Method.** `/metodo`: "Como se procura a independência e o rigor", "NESTA PÁGINA" 1 a 10 + "A política da casa" + "A forma"; a flow diagram "FONTES 18 organismos → MOTOR 2850 linhas atravessadas → LIVRO-RAZÃO 2916 linhas · 8 por confirmar → CONSTRUÇÃO 334 contas refeitas → PÁGINA 2908 linhas no mapa do sítio → LEITOR não é contado", with "AGENDA 5 itens", "RELEITURA 3625 registadas · 31.08.2026 reconferido a", "CORREÇÕES 3 publicadas" (`desktop-42`). On the phone the diagram is cut at the right edge; its box scrolls sideways (760 px svg in a 352 px `div.svg-scroll`, overflow-x auto [verified]) but nothing says so (`phone-59`). Under it a row of underlined words "PORTAS ORGANISMOS LINHAS ATRAVESSADAS LINHAS POR CONFIRMAR CONTAS REFEITAS LINHAS NO MAPA DO SÍTIO ITENS REGISTADAS RECONFERIDO A PUBLICADAS" reads as a word list (`phone-60`). Sections 2–10 are closed accordions (`phone-61`).

**Phone rendering defect [observed].** Home bottom block prints "308concelhos" and "12trabalhos ·16edições" (no space); desktop prints "308 concelhos", "12 trabalhos · 16 edições" (`phone-05` vs `desktop-05`). No page overflowed horizontally on the phone (scrollWidth 390 on all 14 pages [verified]).

---

### Ten changes, by impact

1. **Concelho page, top rail + "RELANCE".** Remove the card rail (the same 8 numbers are listed below); print the one-line definition under each name and drop "ABRIR/FECHAR". Fix the "N.d." card vs "137 dias" contradiction by removing the monthly card or labelling it "dezembro de 2025: sem valor publicado · ano 2025: 137 dias".
2. **Every measure block and ledger line, the two "fonte"s.** Keep the chip "FONTE" only as the link to the ledger line; rename the publisher line "fonte Eurostat · …" to "publicado por" (the ledger line already says "Publicado por"); remove the chip under the number on the ledger line (it links to "#prova" on the same page).
3. **Header of every page, "Painel europeu · 31.08.2026" and "Fontes em atraso · 01.09.2026 21:07 WEST".** Remove from the header; keep freshness on the measure with plain labels ("lido na fonte a", "verificado a") instead of "lido · conferido · reconferido".
4. **/estudos, the cover page.** Make the title go straight to the text; move "LER O DOCUMENTO", "EDIÇÕES", "DESCRIÇÕES" into the text page's side panel (desktop already has "O DOCUMENTO ORIGINAL LER O DOCUMENTO →"); remove "DESCARREGAR / Sem ficheiros." when empty; remove "PUBLICADO A 04.09.2026" until the dates are confirmed (it contradicts "Datas de publicação por confirmar." and "ÚLTIMA ATUALIZAÇÃO: 20.08.2026").
5. **Home (phone), bottom "Municípios / Estudos / Agenda" block.** Fix the glued "308concelhos", "12trabalhos ·16edições"; remove the floating small-caps "ESTUDOS" link under the card rail (duplicates the block and the menu).
6. **Menu and footer.** Merge or rename "ÁREAS" and "DOMÍNIOS"; make the footer list identical in items and order to the top menu; use one word for studies across "Estudos", "trabalhos no arquivo", "VOLTAR AO ARQUIVO".
7. **Region pages.** Remove the card rail and "As medidas" on `/regioes/<região>` (one value shown four times); on the phone show the 10-row ruler once, not on every region page; explain "provisório" once at the top.
8. **Domain page.** Remove the empty "LEITURA BREVE" label or make it the heading of the measure list; merge "Os valores, concelho a concelho" with "Os valores concelho a concelho →"; make the rail count match the list ("1 de 5" vs 8 blocks); split the headline's "FONTE FONTE" so each chip sits by its number.
9. **/dominios.** Move the 16 rows "ainda sem medidas conferidas · … vaga" to the method page's "O que se mede a seguir" and keep the live domain(s) only; rename "no ar".
10. **Method page (phone), the diagram and its legend.** Replace the cut-off diagram with the list of its boxes and put each legend word inside its box; drop the row "PORTAS ORGANISMOS LINHAS ATRAVESSADAS …".

Also worth doing: the concelho page's "PROVENIÊNCIA" heading over navigation links (rename to "IR PARA" or remove); "Évora · 308 · FONTE" (add "concelhos" or remove the number); the tiny chart labels on the phone (print the values as text under the charts); a definition of "[a verificar]" next to its first use on each page (only the ledger index has "O que quer dizer este marcador →"); the "9 regiões" self-link.

---

### What already works

- The concelho box with a suggestion: 2 taps from home to Évora on both sizes.
- One tap from a home card to the measure block, which answers what / threshold / period / read date / publisher in five lines.
- The ledger line's "CAMPO DEVOLVIDO" verbatim quote, the "PEDIDO" URL, "Esta linha nunca foi corrigida nem atualizada.", and "ACESSO AOS DADOS: Esta linha em JSON → · O conjunto inteiro: CSV · JSON".
- No horizontal page overflow on the phone on any page visited; page titles in the tab are specific ("Évora · o município, medido · O Estado do País").
- The footer on every page: "ENCONTROU UM ERRO? correcoes@oestadodopais.pt · O registo de correções →" and "Texto gerado por IA sob a política da casa · responsável editorial: Nuno dos Santos".
- The study text: section counters "1/14", the four-number table with chips, "SUBIR ↑"; on desktop the side panel and the reading column width.
- Desktop ledger line: two columns keep "PROVENIÊNCIA" in view beside the proof.
