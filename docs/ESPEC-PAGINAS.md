# The five pages · specification

*Version 1, Saturday 14 November 2026, by the direction seat (Claude Fable 5.2). It makes section 2 of `FUNDACAO.md` concrete and is read with `ESPEC-PECA.md`. It changes by a dated edit, with the reason.*

*Edited 14 November 2026, 22:02 UTC, after the first build: the builder found sentences this page asked for and did not supply (the skip link, the labels of the Method page's record), and they are added to the table; the theme switch is dropped, so the pages carry no script at all and the dark palette follows the reader's own system setting, as the holding page does (one thing fewer to break, and nothing a reader needs is lost); the forms `10h40` and «3 de 3» are fixed; a desk file's first line is its name; a source's publisher must have a rights record.*

*Edited 14 November 2026, 22:18 UTC, after the designer's reading of the built pages (`blocos/esq1/LEITURA-DESENHADOR.md`, thirteen findings, all adopted except the palette of the holding page, which was a quick page and not the identity): a computed figure's receipt shows arithmetic a reader can follow, not the expression the script evaluates; a printed figure never breaks between its number and its unit; a link to a receipt looks the same wherever it is; a receipt leads back to the text; the record says when each reading was made.*

*Edited 14 November 2026, 22:34 UTC, after the code and security reading (`blocos/esq1/leitura/LEITURA-CODEX.md`): the Method prose and the fixed sentences carry a record of their own judgment, since a rule that they are "judged like a piece" with nothing to enforce it was only a wish; and the name at the top is the one link that is not underlined.*

*Edited 14 November 2026, 22:40 UTC, after the designer's second reading (`blocos/esq1/LEITURA-DESENHADOR-2.md`: eleven of its thirteen first findings fixed, eight new ones, all adopted): the record's opening sentence said the readings came before publication, which is untrue of a reading made for a correction, and is rewritten; on a phone a table becomes a list, so no figure starts out of sight; the Method page's counts are a block of their own; the reading column is centred.*

*Edited 14 November 2026, 23:32 UTC, after the second code and security reading: two places where this page contradicted itself (the AI line's link on the Method page; the name on the front page) now say one thing each.*

## Rules for every page

- **Computed, never listed.** Every page is built from the piece files (and one small file per desk). No page has a list that a piece must edit.
- **Nothing without data.** A block with nothing to show is not printed: no empty table, no "coming soon", and no rule or space where the block would have been.
- **The AI line** sits at the top of every page, above the name: the sentence `ia_linha` and the link `ia_ligacao` to `/metodo/` (on the Method page itself `ia_ligacao` is plain text).
- **Portuguese only** (`lang="pt-PT"`), Acordo Ortográfico, no dashes as punctuation. Dates as «16 de novembro de 2026»; hours in Lisbon time, as `10h40`.
- **Hidden from search engines** until the funder says otherwise: every page carries `noindex, nofollow`, and there is no sitemap. One setting turns this, and it is his.
- **Plain pages.** Semantic HTML, one `h1`, a skip link (`saltar`), visible focus. Light and dark palettes follow the reader's system setting. **No script at all:** receipts and the record open with `<details>`.
- **Figures.** A printed line (`{id}`) never breaks between its number and its unit. Inside tied words, a number stays with the word that follows it. Numerals are lining numerals everywhere, the title included. The figure face (Bitter) is for numeric values in the receipts only; a receipt summary that is a sentence is in the prose face.
- **Links.** A link to a receipt has one look (the dotted underline) in the title, the lead and the text. Every other link is underlined, the titles of pieces in lists included, with one exception: the name at the top is not underlined. Labels are never smaller than 12 px.
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
4. **The receipts** (`recibos_titulo`), one per line of the fact sheet, in the order of first use in the text:
   - `valor`: what the reader sees, then what it measures, whom it covers, the period, "provisional" when it is, the source's title and publisher, where in the document, the excerpt, the date read, and a link that opens the source.
   - `derivado`: what the reader sees; the calculation as arithmetic a reader can follow (`r_conta`): each input shown as its number in Portuguese form and linked to its own receipt, the signs + − × ÷ and parentheses, then = and the result, then in words how it was rounded (`r_arred_0`, `r_arred_1` or `r_arred_n`), for example «104,7 − 102,3 = 2,4 (arredondado a uma casa decimal)»; and why the inputs may be compared. The expression of `calculo` itself is never printed.
   - A provisional value is flagged on a line of its own, set as a label, never beside the period.
   - Every receipt ends with `r_voltar`, a link back to the place in the text where the line is first used.
   - `citacao`: the words, who said them and in what role, when, the source, where, and the link.
   - `ato`: what the document establishes, the excerpt, the source, where, the date, and the link.
5. **The record** (`registo_titulo`): one row per reading, in the order they were made (when, as date and hour; the seat; the model family; plants caught of plants put in the form `plantas_formato`; real findings; verdict; minutes). The table fits a phone: it may scroll inside its own box, and the seat's name does not break over more than two lines on a desktop. Then the time from commission to publication, then the piece's fingerprint, which wraps on a narrow screen.

Words tied to several lines link to the receipt of the first; the others are reached in the receipts.

A withdrawn piece keeps its address and shows only its title, the sentence `retirada`, the reason, and its record.

## 4. Method · `/metodo/`

- The prose comes from `paginas/metodo.md`. It is reader's text: it is written and judged like a piece, and the file carries its own record after a line `+++ registo` (its fingerprint is the SHA-256 of the bytes before that line). The fixed sentences are judged the same way, with their record in `textos.registo.toml` beside `textos.toml`. No piece is built as published unless both have a passing judge's reading on their current fingerprint. Until that file exists the Method page is not built, and because every page links to it, no piece can be published before it exists.
- After the prose, computed: first, under `numeros_titulo`, the four counts `n_publicadas`, `n_correcoes`, `n_atualizacoes`, `n_retiradas`, as a block of their own; then under `equipa_titulo`, the team's record (one row per seat, columns `e_lugar`, `e_leituras`, `c_plantas`, `e_adotados`, `e_falhas`: readings, plants caught of plants put, real findings adopted, misses named by the `causa` of corrections); and under `taxa_titulo` the measured error rate, or `sem_auditoria`.

## 5. Corrections · `/correcoes/`

- `correcoes_intro`, then `erro_titulo` and `erro_como`, then every correction and update of every piece, most recent first: the date, the kind, the piece, what it said before, what it says now, the reason. With none: `sem_correcoes`.

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
| `recibos_intro` | Cada número e cada citação desta peça vêm de um documento de que este projeto guardou uma cópia. Aqui está, para cada um, a fonte, o excerto e a data em que foi lido. |
| `r_mede`, `r_populacao`, `r_periodo`, `r_provisorio` | O que mede · A quem se refere · Período · Valor provisório |
| `r_fonte`, `r_onde`, `r_excerto`, `r_lido`, `r_abrir` | Fonte · Onde está · Excerto · Lido a · Abrir a fonte |
| `r_conta`, `r_compara` | Conta · Porque se pode comparar |
| `r_arred_0`, `r_arred_1`, `r_arred_n` | arredondado à unidade · arredondado a uma casa decimal · arredondado a {n} casas decimais |
| `r_voltar` | Voltar ao texto |
| `c_quando` | Quando |
| `r_quem`, `r_quando`, `r_estabelece` | Quem disse · Quando · O que o documento estabelece |
| `registo_titulo` | O registo desta peça |
| `registo_intro` | Quem leu esta peça, quando, e o que encontrou. Os erros plantados são erros postos de propósito no texto entregue a cada leitor, para medir se a leitura os apanha. |
| `c_leitura`, `c_familia`, `c_plantas`, `c_achados`, `c_veredicto`, `c_minutos` | Leitura · Família de modelos · Erros plantados apanhados · Achados reais · Veredicto · Minutos |
| `v_passa`, `v_nao_passa`, `v_levanta` | passa · não passa · levanta |
| `lugar_numeros`, `lugar_oposto`, `lugar_especialista`, `lugar_leitor`, `lugar_justica`, `lugar_juiz`, `lugar_correcoes` | Editor de números · Leitor do contraditório · Especialista · Leitor comum · Defesa das pessoas nomeadas · Juiz · Editor de correções |
| `familia_anthropic`, `familia_openai` | Anthropic · OpenAI |
| `tempo` | Da encomenda à publicação: {horas} h {minutos} min. |
| `impressao` | Impressão digital do texto julgado: |
| `retirada` | Esta peça foi retirada a {data}. |
| `retirada_numero` | Um número deixou de corresponder à fonte e está a ser conferido. |
| `especie_correcao`, `especie_atualizacao` | Correção · Atualização |
| `antes`, `agora` | Antes dizia: · Agora diz: |
| `correcoes_intro` | Todas as correções e atualizações deste projeto, com data, para sempre. Uma correção é um erro deste projeto. Uma atualização é uma mudança feita pela fonte. |
| `erro_titulo` | Como apontar um erro |
| `erro_como` | Escreva para correcoes@oestadodopais.pt e diga qual é a peça e qual é a frase. |
| `sem_correcoes` | Ainda não há correções nem atualizações. |
| `numeros_titulo` | Em números |
| `equipa_titulo` | A equipa e o seu registo |
| `sem_auditoria` | Ainda não houve auditoria. |
| `saltar` | Saltar para o texto |
| `plantas_formato` | {apanhadas} de {postas} |
| `e_lugar`, `e_leituras`, `e_adotados`, `e_falhas` | Lugar · Leituras · Achados reais adotados · Falhas apontadas por correções |
| `n_publicadas`, `n_correcoes`, `n_atualizacoes`, `n_retiradas` | Peças publicadas · Correções · Atualizações · Peças retiradas |
| `taxa_titulo` | Taxa de erro medida |
| `nao_existe` | Esta página não existe. |
| `voltar` | Voltar ao início |
| `rodape` | Um projeto independente conduzido por uma inteligência artificial, financiado em privado. |
| `rodape_contacto` | Correções e contacto: correcoes@oestadodopais.pt |
