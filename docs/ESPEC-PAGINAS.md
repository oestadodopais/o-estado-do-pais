# The five pages · specification

*Version 1, Saturday 14 November 2026, by the direction seat (Claude Fable 5.2). It makes section 2 of `FUNDACAO.md` concrete and is read with `ESPEC-PECA.md`. It changes by a dated edit, with the reason.*

*Edited 14 November 2026, 22:02 UTC, after the first build: the builder found sentences this page asked for and did not supply (the skip link, the labels of the Method page's record), and they are added to the table; the theme switch is dropped, so the pages carry no script at all and the dark palette follows the reader's own system setting, as the holding page does (one thing fewer to break, and nothing a reader needs is lost); the forms `10h40` and «3 de 3» are fixed; a desk file's first line is its name; a source's publisher must have a rights record.*

*Edited 14 November 2026, 22:18 UTC, after the designer's reading of the built pages (`blocos/esq1/LEITURA-DESENHADOR.md`, thirteen findings, all adopted except the palette of the holding page, which was a quick page and not the identity): a computed figure's receipt shows arithmetic a reader can follow, not the expression the script evaluates; a printed figure never breaks between its number and its unit; a link to a receipt looks the same wherever it is; a receipt leads back to the text; the record says when each reading was made.*

*Edited 14 November 2026, 22:34 UTC, after the code and security reading (`blocos/esq1/leitura/LEITURA-CODEX.md`): the Method prose and the fixed sentences carry a record of their own judgment, since a rule that they are "judged like a piece" with nothing to enforce it was only a wish; and the name at the top is the one link that is not underlined.*

*Edited 14 November 2026, 22:40 UTC, after the designer's second reading (`blocos/esq1/LEITURA-DESENHADOR-2.md`: eleven of its thirteen first findings fixed, eight new ones, all adopted): the record's opening sentence said the readings came before publication, which is untrue of a reading made for a correction, and is rewritten; on a phone a table becomes a list, so no figure starts out of sight; the Method page's counts are a block of their own; the reading column is centred.*

*Edited 14 November 2026, 23:32 UTC, after the second code and security reading: two places where this page contradicted itself (the AI line's link on the Method page; the name on the front page) now say one thing each.*

*Edited 15 November 2026, 01:36 UTC, with the order of the second block (`blocos/esq2/ORDEM.md`). A link to a receipt must open the receipt: tried in Chromium and WebKit on the pilot piece's page, a click on a figure left its receipt closed, because the link pointed at the closed box itself; with the anchor inside the box's content both engines open it. The link to a source says what it does («Abrir a fonte» for a web page, «Descarregar a fonte» for a file), after the funder as a reader met a download where he expected a page, and a receipt also links the publisher's own page for the document when the source carries one. The Method page's team record gains the code and security reader, from the code's own record. Four fixed sentences are added.*

*Edited 15 November 2026, 02:33 UTC, after the writer and three ordinary readers went through the Method page (`metodo/`): five fixed sentences said more than the pages do, or read wrongly. `registo_intro` said every reader is given planted errors, and the pilot's own record has three readings with none. `recibos_intro` promised a date read for every quotation, and the receipt of a quotation or of an act showed none: both now show it, and the sentence also says what a computed figure's receipt holds. `correcoes_intro` said «Uma correção é um erro», which read literally is false. `lugar_desenhador` was «Desenhador», someone who draws; the seat reads the page. `rodape` said «financiado em privado», which a reader took for financed in secret.*

*Edited 15 November 2026, 13:09 UTC, with the order of the third block (`blocos/esq3/ORDEM.md`), after the designer read a real piece's page with its receipts open (`blocos/esq2/LEITURA-DESENHADOR-4.md`, twelve findings) and the page of the first piece made through the scripts (`pecas/2026-11-15-inflacao/LEITURA-DESENHADOR.md`, nine findings, two of them able to make a reader misread a figure). The mark that opens a receipt was a plus or minus sign set before a figure: it is now a chevron at the end of the line. A calculation printed an input with fewer decimals than that input's own receipt: each input is now printed as its line shows it. Receipts are shown only for what the text uses, then for the inputs of the calculations shown; a closed receipt says what its figure measures; the figure is marked inside its excerpt; an input's receipt leads back to the calculations it enters. Smaller things: where a line may break, links that touch, the record's left edge, the AI line on the Method page, the order of the Corrections page, and the date of the last re-check of sources, shown on the Method page. Four fixed sentences are added.*

*Edited 15 November 2026, 14:27 UTC, after the designer read the piece page as the third block built it (`blocos/esq3/LEITURA-DESENHADOR-5.md`: both faults that stopped publication are repaired; eleven new findings, one of them able to make a reader misread a figure, and that one made by this page's own rule). The rule «a space between two digits is not a place to break» turned a table's row into one unbreakable string, which the browser then cut inside the numbers, the receipt's own figure among them: the rule is withdrawn, and what is kept whole is the figure the receipt marks. Also: a calculation's receipt says in full what it measures; on a phone a closed receipt gives what it measures two lines instead of a few characters, and an open one does not repeat it; the mark takes the sign of a negative figure; a negative figure is printed with a true minus sign wherever the page prints it; «p.» stays with its number in every field; the inputs of a calculation look like the other links to receipts.*

## Rules for every page

- **Computed, never listed.** Every page is built from the piece files (and one small file per desk). No page has a list that a piece must edit.
- **Nothing without data.** A block with nothing to show is not printed: no empty table, no "coming soon", and no rule or space where the block would have been.
- **The AI line** sits at the top of every page, above the name: the sentence `ia_linha` and the link `ia_ligacao` to `/metodo/` (on the Method page itself `ia_ligacao` is not printed, and the line ends at its full stop).
- **Portuguese only** (`lang="pt-PT"`), Acordo Ortográfico, no dashes as punctuation. Dates as «16 de novembro de 2026»; hours in Lisbon time, as `10h40`.
- **Hidden from search engines** until the funder says otherwise: every page carries `noindex, nofollow`, and there is no sitemap. One setting turns this, and it is his.
- **Plain pages.** Semantic HTML, one `h1`, a skip link (`saltar`), visible focus. Light and dark palettes follow the reader's system setting. **No script at all:** receipts and the record open with `<details>`.
- **A link to a receipt opens it.** The anchor a link points to is an element inside the content of the receipt's `<details>`, never the `<details>` itself or its `<summary>`: a browser opens a closed box when the place it is sent to is inside it, and does not when it is the box. A test without a browser proves the markup keeps this form, and a test in three browser engines (Chromium, Firefox, WebKit) proves that a click on a figure, a click on an input of a calculation, and a page opened directly at a receipt's address each show the receipt open.
- **Figures.** A printed line (`{id}`) never breaks inside its number, nor between the number and a unit that is a symbol or a single word (%, €, ‰, «mil»); between the number and a unit of two words or more («pontos percentuais») a line may break. Inside tied words, a number stays with the word that follows it, and a range («de N a M») stays whole. **The figure a receipt marks in its excerpt never breaks inside itself; nothing else in an excerpt is glued** (a space between two digits is a place to break like any other space: a table's row is a run of numbers, and glued it becomes one string that a browser cuts anywhere). In every field of a receipt, «p.» stays with the number after it. **A negative figure is printed with a true minus sign (U+2212) wherever the page prints a line:** the title, the lead, the text, a summary, a receipt, the arithmetic; the piece file keeps what its `mostra` has. Numerals are lining numerals everywhere, the title included. The figure face (Bitter) is for numeric values in the receipts only; a receipt summary that is a sentence is in the prose face.
- **Links.** A link to a receipt has one look (the dotted underline) in the title, the lead and the text. Two links to receipts never run together: where one ends and the next begins with nothing or only a space between them, the page sets a visible gap between the two underlines. Every other link is underlined, the titles of pieces in lists included, with one exception: the name at the top is not underlined. Labels are never smaller than 12 px.
- **The name** has one size on every page at a given width. It is a link to the front page on every page except the front page.
- **The column.** The reading column is centred in the page at every width, and so is a box wider than it.
- **Tables on a phone.** Below 600 px a table (the record, the team's record) is shown as a list: each row a block, each value under its column's label. Nothing a reader needs starts out of sight, and nothing is cut at the edge of a box. On a desktop, columns are at least 24 px apart.
- **A page does not link to itself.**
- **The look is the old site's:** its colour tokens, its three typefaces (Spectral for prose and the name, Spectral SC for labels, Bitter for figures), its measure and reading size, its name set in type. Only the styles these five pages use are carried over.
- **The builder writes no reader's sentence.** Every fixed sentence is in the table at the end of this page and lives in one file, `textos.toml`. Those sentences are judged once by the other family, as a piece is, before the first publication.

## 1. Front page · `/`

- **With no published piece:** exactly the holding page that is live today, word for word, and nothing else. This is what makes the first push of the skeleton safe.
- **With published pieces:** the name; the indicators, if any; the pieces, most recent first, under a heading for each day; each piece shows its kind, title, `entrada` and main thread. Then the list of threads that have a published piece.
- Withdrawn pieces are not listed.

## 2. Topic thread · `/temas/<tema>/`

- A thread exists when a desk file `mesas/<tema>.md` exists and at least one piece of that thread is published. The thread's name is the desk file's first line, `# <name>`.
- In order: the name; the thread's indicators, if any; under `seguir_titulo`, the `O que acompanhar` paragraph of each published piece, most recent first, each linked to its piece (inside those paragraphs printed lines and tied words are plain text: the receipts are on the piece's page); then every published piece of the thread, most recent first.

## 3. Piece page · `/pecas/<id>/`

In order:

1. The kind, the title, the `entrada`, the date and hour of publication, the threads.
2. Corrections and updates, if any, most recent first, before the text: the kind, the date, the reason, what it said before and what it says now.
3. The text. A printed line and tied words are links to their receipt lower on the same page.
4. **The receipts** (`recibos_titulo`): one for each line of the fact sheet that the title, the lead or the text prints or ties, in the order of first use. Then, under the heading `recibos_entradas`, one for each line that is only an input of a calculation shown above (directly, or through another calculation), in the order the calculations use them. A line used nowhere has no receipt on the page; it stays in the file, where the numbers editor and the judge read it.
   - **Closed, a receipt says what it is.** Its summary is the figure as the text prints it and, after it, what it measures (`mede`): on one line, cut with an ellipsis by the stylesheet where it does not fit, at 600 px and wider; below 600 px, under the figure, on up to two lines, then cut. **Open, the summary is the figure alone:** what it measures is in the receipt, in full. For a `citacao` it is the words; for an `ato`, what the document establishes, and that sentence is then not printed a second time inside the receipt.
   - **The mark that says a receipt opens is never a plus or a minus sign and never sits beside the figure.** It is a chevron drawn by the stylesheet at the end of the summary's line, pointing down when the receipt is closed and up when it is open. The same for the record's box.
   - `valor`: what the reader sees, then what it measures, whom it covers, the period, "provisional" when it is, the source's title and publisher, where in the document, the excerpt, the date read, and the link to the source. **Inside the excerpt the figure is marked** (`<mark>`, with the sign when the figure is negative, and never broken over two lines): the place where check 2 finds it or, when the figure occurs more than once in the excerpt, the occurrence the line's `ocorrencia` names; with more than one occurrence and no `ocorrencia`, nothing is marked. The excerpt keeps the line breaks it has in the piece file.
   - **The link to the source,** in every kind of receipt that has one: its words are `r_abrir` when the stored copy is a web page (`tipo_conteudo` is `text/html` or `application/xhtml+xml`) and `r_descarregar` for anything else (a PDF, a spreadsheet, a data file). When the source carries `pagina`, a second link follows, with the words `r_pagina`, to that address.
   - `derivado`: what the reader sees; what it measures, in full (`r_mede`, when the line has `mede`); the calculation as arithmetic a reader can follow (`r_conta`), its inputs linked to their receipts with the look of every other link to a receipt: **the arithmetic prints numbers that compute** (edited 15 November 2026, 15:17 UTC: printed from `mostra`, two inputs of 1,234 and 1,211 shown as «1,2» gave «1,2 − 1,2 = 0,023», and an input shown in thousands gave «1,5 mil ÷ 1000 = 1,5 mil»): each input is its line's `valor` in Portuguese form, with final zeros added up to the decimals its `mostra` shows when, and only when, the number in the `mostra` read back is exactly the `valor` (so «4,69 − 4,40», never «4,69 − 4,4»); where the `mostra` rounds the `valor` or gives it in another scale, the input is the `valor` as it is. Each input is linked to its own receipt; a negative input in parentheses, with a true minus sign («(−0,11) − (−0,38)»); the signs + − × ÷ and parentheses; then = and the result, by the same rule, with its sign (a negative result has its true minus sign); then in words how it was rounded (`r_arred_0`, `r_arred_1` or `r_arred_n`), for example «104,7 − 102,3 = 2,4 (arredondado a uma casa decimal)». An input whose `mostra` has no digit (`mostra_livre`) is shown as its number in Portuguese form. **Under the arithmetic, one line for each input that is a `valor` line, in order: the input as shown, then its `periodo`,** so that a reader sees which number is which without opening anything. Then why the inputs may be compared. The expression of `calculo` itself is never printed.
   - A provisional value is flagged on a line of its own, set as a label, never beside the period.
   - Every receipt ends with `r_voltar`, a link back to the place in the text where the line is first used. Before it, the receipt of a line that is an input of calculations shown on the page has `r_entra_em` followed by a link to the receipt of each of those calculations, each link showing that calculation's figure.
   - `citacao`: the words, who said them and in what role, when, the source, where, the date read, and the link.
   - `ato`: what the document establishes, the excerpt, the source, where, the date, the date read, and the link.
5. **The record** (`registo_titulo`): one row per reading, in the order they were made (when, as date and hour; the seat; the model family; plants caught of plants put in the form `plantas_formato`; real findings; verdict; minutes). The table fits a phone: it may scroll inside its own box, and the seat's name does not break over more than two lines on a desktop. Then the time from commission to publication, then the piece's fingerprint, which wraps on a narrow screen. The record's heading and its intro keep the reading column's left edge at every width; only the table may be wider.

Words tied to several lines link to the receipt of the first; the others are reached in the receipts.

A withdrawn piece keeps its address and shows only its title, the sentence `retirada`, the reason, and its record.

## 4. Method · `/metodo/`

- The prose comes from `paginas/metodo.md`. It is reader's text: it is written and judged like a piece, and the file carries its own record after a line `+++ registo` (its fingerprint is the SHA-256 of the bytes before that line). The fixed sentences are judged the same way, with their record in `textos.registo.toml` beside `textos.toml`. No piece is built as published unless both have a passing judge's reading on their current fingerprint. Until that file exists the Method page is not built, and because every page links to it, no piece can be published before it exists.
- After the prose, computed: first, under `numeros_titulo`, the four counts `n_publicadas`, `n_correcoes`, `n_atualizacoes`, `n_retiradas`, as a block of their own, and under them the last re-check of sources: the sentence `reconferencia_ultima`, filled from the last entry of `reconferencias.toml` at the root of the tree (the file `reconferir` appends to) whose `so_relatar` is false, or `reconferencia_nenhuma` while that file has no such entry (edited 15 November 2026, 14:15 UTC: a run told only to report does not withdraw, so «Peças retiradas» would say nothing true about it; the builder showed the page and the order differed here); then under `equipa_titulo`, the team's record (one row per seat, columns `e_lugar`, `e_leituras`, `c_plantas`, `e_adotados`, `e_falhas`: readings, plants caught of plants put, real findings adopted, misses named by the `causa` of corrections); and under `taxa_titulo` the measured error rate, or `sem_auditoria`. The team's record counts the readings of every published or withdrawn piece, of this page's prose, of the fixed sentences, and of the code (`codigo.registo.toml`, whose seat is `lugar_seguranca`).

## 5. Corrections · `/correcoes/`

- `correcoes_intro`, then every correction and update of every piece, most recent first: the date, the kind, the piece, what it said before, what it says now, the reason (with none: `sem_correcoes`); and after the list, `erro_titulo` and `erro_como`.

## Also built

- `/404.html` with `nao_existe` and a link to the front page.
- A piece is built only if the publisher of each of its sources has a rights record, `direitos/<host>.toml` (the host of the source's final address), and no excerpt is longer than that record allows.
- The security headers and the host redirects of the old hosting file, unchanged. The old site's 113 redirects from retired addresses are dropped: those pages no longer exist, and an old address shows the 404 page. The three studies get a redirect from their old address when they return.

## What is carried over from the old tree, and nothing else

`src/styles/tokens.css`; the parts of `src/styles/site.css` and `texto.css` these pages use; `public/tipos/` (eight font files and their licences) and the font ledger `design/especime-v3/TIPOS.md`; the icon files and `manifest.webmanifest` in `public/`; the markup of the masthead, the footer and the AI label, rewritten as plain templates.

## The fixed sentences (`textos.toml`)

| Key | Portuguese, exactly |
|---|---|
| `nome` | O Estado do País |
| `ia_linha` | Texto gerado e editado por inteligência artificial. Nenhuma pessoa o revê antes de ser publicado. |
| `ia_ligacao` | Como é feito |
| `nav_inicio`, `nav_metodo`, `nav_correcoes` | Início · Método · Correções |
| `tipo_diario`, `tipo_artigo`, `tipo_estudo` | Diário · Artigo · Estudo |
| `publicada` | Publicada a {data}, às {hora}. |
| `temas_titulo` | Temas |
| `tema_intro` | Tudo o que este projeto publicou sobre este tema, do mais recente para o mais antigo. |
| `seguir_titulo` | O que ficou de se seguir |
| `recibos_titulo` | Os recibos desta peça |
| `recibos_intro` | Cada número e cada citação desta peça vêm de um documento de que este projeto guardou uma cópia. Aqui estão, para cada um, a fonte, o excerto e a data em que foi lido; para um número calculado, a conta e os números de que parte. |
| `r_mede`, `r_populacao`, `r_periodo`, `r_provisorio` | O que mede · A quem se refere · Período · Valor provisório |
| `r_fonte`, `r_onde`, `r_excerto`, `r_lido`, `r_abrir` | Fonte · Onde está · Excerto · Lido a · Abrir a fonte |
| `r_descarregar`, `r_pagina` | Descarregar a fonte · Ver a página onde a fonte foi publicada |
| `r_conta`, `r_compara` | Conta · Porque se pode comparar |
| `r_arred_0`, `r_arred_1`, `r_arred_n` | arredondado à unidade · arredondado a uma casa decimal · arredondado a {n} casas decimais |
| `r_voltar` | Voltar ao texto |
| `recibos_entradas` | Números que entram nas contas acima |
| `r_entra_em` | Entra na conta de |
| `c_quando` | Quando |
| `r_quem`, `r_quando`, `r_estabelece` | Quem disse · Quando · O que o documento estabelece |
| `registo_titulo` | O registo desta peça |
| `registo_intro` | Quem leu esta peça, quando, e o que encontrou. Os erros plantados são erros postos de propósito no material de uma leitura, para medir se ela os apanha; «0 de 0» quer dizer que essa leitura não os levou. |
| `c_leitura`, `c_familia`, `c_plantas`, `c_achados`, `c_veredicto`, `c_minutos` | Leitura · Família de modelos · Erros plantados apanhados · Achados reais · Veredicto · Minutos |
| `v_passa`, `v_nao_passa`, `v_levanta` | passa · não passa · levanta |
| `lugar_numeros`, `lugar_oposto`, `lugar_especialista`, `lugar_leitor`, `lugar_justica`, `lugar_juiz`, `lugar_correcoes` | Editor de números · Leitor do contraditório · Especialista · Leitor comum · Defesa das pessoas nomeadas · Juiz · Editor de correções |
| `lugar_desenhador`, `lugar_seguranca` | Leitor da página · Leitor de código e segurança |
| `familia_anthropic`, `familia_openai` | Anthropic · OpenAI |
| `tempo` | Da encomenda à publicação: {horas} h {minutos} min. |
| `impressao` | Impressão digital do texto julgado: |
| `retirada` | Esta peça foi retirada a {data}. |
| `retirada_numero` | Um número deixou de corresponder à fonte e está a ser conferido. |
| `especie_correcao`, `especie_atualizacao` | Correção · Atualização |
| `antes`, `agora` | Antes dizia: · Agora diz: |
| `correcoes_intro` | Todas as correções e atualizações deste projeto, com data, para sempre. Há correção quando o erro foi deste projeto; há atualização quando foi a fonte que mudou. |
| `erro_titulo` | Como apontar um erro |
| `erro_como` | Escreva para correcoes@oestadodopais.pt e diga qual é a peça e qual é a frase. |
| `sem_correcoes` | Ainda não há correções nem atualizações. |
| `numeros_titulo` | Em números |
| `equipa_titulo` | A equipa e o seu registo |
| `sem_auditoria` | Ainda não houve auditoria. |
| `reconferencia_ultima` | Última conferência das fontes: {data}. Peças conferidas: {pecas}. Excertos conferidos: {excertos}. Peças retiradas: {retiradas}. |
| `reconferencia_nenhuma` | Ainda não houve nenhuma conferência das fontes das peças publicadas. |
| `saltar` | Saltar para o texto |
| `plantas_formato` | {apanhadas} de {postas} |
| `e_lugar`, `e_leituras`, `e_adotados`, `e_falhas` | Lugar · Leituras · Achados reais adotados · Falhas apontadas por correções |
| `n_publicadas`, `n_correcoes`, `n_atualizacoes`, `n_retiradas` | Peças publicadas · Correções · Atualizações · Peças retiradas |
| `taxa_titulo` | Taxa de erro medida |
| `nao_existe` | Esta página não existe. |
| `voltar` | Voltar ao início |
| `rodape` | Um projeto independente conduzido por uma inteligência artificial, com financiamento privado. |
| `rodape_contacto` | Correções e contacto: correcoes@oestadodopais.pt |
