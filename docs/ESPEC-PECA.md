# The piece file · specification

*Version 1, Saturday 14 November 2026, by the direction seat (Claude Fable 5.2). It makes sections 1, 3 and 4 of `FUNDACAO.md` concrete. Field names are Portuguese because readers see them in the receipts; this page is English because it is a working document. It changes by a dated edit, with the reason.*

*Edited 14 November 2026, 22:02 UTC: a source's publisher must have a rights record (check 9), after the funder asked for copyright to be a function of the team.*

*Edited 14 November 2026, 22:34 UTC, after the code and security reading (`blocos/esq1/leitura/LEITURA-CODEX.md`): a withdrawn piece stays bound by checks 4, 5 and 7; check 4 also proves against `main` that the record only grows, because a record that scripts only append to could still be cut by hand; and no quotation mark may be typed in the text, so that a quotation can only come from a line.*

*Edited 14 November 2026, 23:13 UTC, from the pilot: a reader given planted errors cannot itself say "passa", since the plants make what it read fail. The verdict on the record is the scored one.*

*Edited 15 November 2026, 01:36 UTC, with the order of the second block (`blocos/esq2/ORDEM.md`). Four things. A source may carry the address of its publisher's own page for the document, stored like any source, after the funder as a reader met a link that downloads a file where he expected a page. The record takes readings by the designer, and readings of the fact sheet made before the text exists (by the specialist and the opposite reader), because the pilot piece showed that the sheet's gaps were found only after the text was written. A piece withdrawn by the weekly re-check carries a fixed sentence as its reason, since the reason is shown to readers. And the code has a record of its own, so that the rule "code is read by the other family before anything built on it is published" is something a check enforces.*

*Edited 15 November 2026, 03:29 UTC, after the first code and security reading of the second block and the judge's first reading of the Method page. An excerpt must be found whole, because the reader showed that `100` was "found" inside `1000`. Only an answer 200 is a stored source: a partial answer was being stored. A piece that was withdrawn is published again only after the judge has read it again: the judge of the Method page traced that an unchanged piece came back on its old approval. And check 6 says what it has always done: it reads the project's own words, not the source's (the reader found the wording here wider than the rule).*

*Edited 15 November 2026, 11:09 UTC, after the second code and security reading of the second block. The judgment that lets a withdrawn piece come back lies between the withdrawal and the publication: the reader showed a judgment made an hour after a publication being accepted for it. And check 6 leaves out the words printed from a quotation as well, which are the speaker's and not the project's.*

*Edited 15 November 2026, 11:43 UTC, after the third code and security reading of the second block. The judgment that lets a withdrawn piece come back is on the fingerprint the piece had when it came back, not on today's: the reader showed that a later, legitimate correction would have condemned an earlier publication that had been properly judged. And no step or reading may end before it began.*

*Edited 15 November 2026, 13:17 UTC, with the order of the third block (`blocos/esq3/ORDEM.md`), after the first piece made through the scripts. Four things. A `valor` line may say which occurrence of its figure in the excerpt is the one it means (`ocorrencia`), so that the page can mark it: measured on the two real fact sheets, the figure occurs more than once in its excerpt in 2 of 77 lines of one and 5 of 35 of the other. The fields a reader sees never hold the name of a line: the pilot showed readers «ver a linha ap_total_real_quadro». `onde` names the page, and for a table its sheet and row, and no longer a paragraph: the text of a stored copy that the checks and the readers are given has no paragraph breaks, and the numbers editor's third reading of the October prices piece could not check 16 lines in full for that reason alone. And a kind of piece has a size, which `conferir` now says when a daily item passes it: of that piece's second edit an ordinary reader said its middle was a run of percentages and categories it would probably have stopped reading at, and its third edit, counted only afterwards, ran to 782 words and 31 printed figures.*

*Edited 15 November 2026, 15:17 UTC, after the first code and security reading of the third block (`blocos/esq3/leitura/LEITURA-CODEX-1.md`: three plants of three caught; eleven real findings, all adopted). Five things here. Check 1 compares the unit a `mostra` prints with the line's `unidade`: a per mille shown as a per cent passed. A space between groups of digits is read as a thousands separator unless the line says its excerpt is a row of a table (`linha_de_quadro`): two entries of a row were read as one number. No gate counts a reading or a step signed by the tests' model name outside a tree assembled for the tests: the tests' own invented judgments of the fixed sentences are made on the real file's fingerprint, and one wrong copy would have made the real sentences count as judged. A run of the re-check that skipped a piece or could not read a source is not a whole run and is not recorded. And a record that `main` holds and the tree has lost is a record cut, whether or not the file is still there.*

*Edited 15 November 2026, 17:07 UTC, after the third code and security reading of the third block. A `mostra` now has one form. The second reading had found that a currency written before the number escaped check 1; the repair let check 1 read a unit before the number, and the third reading found four more forms that it misread (letters before the number, a minus sign before a currency symbol, a scale word it did not know, a break between a unit and its number). Counted on the two real fact sheets, all 151 figures print nothing before the number but a minus sign, and after it exactly the line's own `unidade`. That is now the rule, and what does not fit it is refused instead of passed with a note.*

*Edited 16 November 2026, 10:50 UTC, after the fourth code and security reading of the third block. The one form says a space, and check 1 now holds a `mostra` to it. The reading found that check 1 took any white space between the number and the unit (a tab, a line break, several spaces), while the page knows only three spaces there, so a tab reached the reader as a place where a number and its symbol could part. Counted on the two real fact sheets, all 151 figures use single ordinary spaces and nothing else.*

## The idea in four lines

1. One piece is one text file. Everything a reader sees comes from it, and nothing else is edited to publish it.
2. The writer never types a number or a quotation. The text holds references; the page prints the value or the words from a verified line of the fact sheet.
3. Everything above the last section is what the team judges and is frozen by a fingerprint. The last section is a log that only scripts write, and only by adding to the end.
4. No piece touches a shared list. Front page, threads, corrections and the team's record are computed from the piece files when the site is built.

## Where and how it is named

`pecas/<year>/<id>.md`, where `id` is the date of commission and a short name in lower-case ASCII: `2026-11-16-precos-da-habitacao`. The id is the file name and the permanent address: `/pecas/<id>/`. It never changes.

## The four sections

The file is UTF-8 with LF line ends. Four lines, each exactly once and in this order, open the sections: `+++ cabeca`, `+++ corpo`, `+++ folha`, `+++ registo`. Sections `cabeca`, `folha` and `registo` are TOML; `corpo` is Markdown.

### `cabeca` (the head)

```toml
id = "2026-11-16-precos-da-habitacao"
tipo = "diario"                 # diario | artigo | estudo
titulo = "…"                    # may hold references
entrada = "…"                   # one or two sentences shown in lists; may hold references
temas = ["habitacao"]           # the desks; the first is the main thread

[encomenda]                     # the commission, by the direction seat
pergunta = "…?"                 # one sentence ending in a question mark
porque_hoje = "…"
largar_se = "…"                 # the finding that would make us drop the piece
```

### `corpo` (the text)

Markdown, limited to: paragraphs, `##` and `###` headings, lists, emphasis, and pipe tables. No raw HTML and no links: a link to a document is a reference to a line.

**References.** `{id}` prints a line: the `mostra` of a `valor` or `derivado` line, or the words of a `citacao` line between «». `[words]{id}` or `[words]{id1, id2}` ties the words to one or more lines of any kind; the words are the writer's, and the judge reads them against those lines. Both forms link to the line's receipt. They may also be used in `titulo` and `entrada`.

**The digits rule, and the quotation rule.** Take the references out of `titulo`, `entrada` and `corpo`: no digit may remain, and no quotation mark of any kind («», “”, ""): a quotation reaches the page only by being printed from a `citacao` line. Every figure, year, date and ordinal a reader sees is either printed from a line or sits inside words tied to a line.

**The three closing headings,** required in every piece, in this order and with these exact words: `## A leitura deste projeto` (what the project thinks), `## O melhor argumento contra esta leitura` (the strongest objection, answered or conceded), `## O que acompanhar` (what will confirm or undo the reading). (Edited 15 November 2026, 00:05 UTC: the second and third were «A objeção mais forte» and «O que seguir» until the ordinary reader of the pilot piece found that both read as translated.)

### `folha` (the fact sheet)

Three kinds of table. Ids are lower-case ASCII letters, digits and `_`, starting with a letter, unique in the piece.

```toml
[[fonte]]                       # a stored source
id = "ine_iph_3t2026"
titulo = "…"                    # the document's own title
editor = "Instituto Nacional de Estatística"
url = "https://…"               # as asked for
url_final = "https://…"         # after redirects
lido_em = "2026-11-16T08:12:44Z"
http = 200
tipo_conteudo = "application/pdf"
bytes = 482113
sha256 = "…"                    # of the stored copy; the copy lives in the private store under this name
publicado_em = "2026-11-16"     # the source's own date, when it gives one; else ""
# pagina = "https://…"          # optional: the publisher's own page for this document (the page a reader would start from)
# pagina_sha256 = "…"           # required with pagina: the stored copy of that page, fetched by the same command and rules as the source

[[linha]]                       # a figure taken from a source
id = "iph_homologa"
tipo = "valor"
fonte = "ine_iph_3t2026"
onde = "p. 1"                     # the page; for a table, its sheet or number and the row. Never a paragraph: the stored text has no paragraph breaks, so nobody downstream can check one
excerto = '''…'''               # copied letter by letter from the stored copy; must hold the figure as the source prints it
# ocorrencia = 2                # optional: when the figure occurs more than once in the excerpt, which occurrence is meant (1 is the first), counted as check 2 finds them. The page marks that one
# linha_de_quadro = true        # optional: the excerpt is a row (or rows) of a table, where a space separates one number from the next and is never a thousands separator. Without it, «100 200» is read as one number, 100200, and a line whose valor is 100 is refused
valor = "17.2"                  # the number as the source prints it, in the source's unit; plain decimal with a dot, no separators
unidade = "%"
mede = "…"                      # what is measured, in the source's own terms
populacao = "…"                 # who or what the figure covers, in the source's own terms
periodo = "…"
provisorio = false
mostra = "17,2 %"               # what the reader sees: an optional minus sign, the number in Portuguese form, a space, and the line's unidade exactly as that field has it. Nothing comes before the number but the sign. It must equal valor at the precision shown
# mostra_livre = true           # only when mostra has no digit ("um terço"): the script does not compare it, the numbers editor does

[[linha]]                       # a comparison or any computed figure
id = "iph_diferenca"
tipo = "derivado"
calculo = "round ( iph_homologa - iph_homologa_anterior , 1 )"
valor = "1.4"
unidade = "pontos percentuais"
mede = "…"
periodo = "…"
compara = "…"                   # why the inputs may be compared: same measure, unit and population; no break; prices treated alike
mostra = "1,4 pontos percentuais"

[[linha]]                       # words said by a person, a party or a body
id = "ministro_declaracao"
tipo = "citacao"
fonte = "…"
onde = "…"
excerto = '''…'''               # the words exactly as said; this is what the page prints
quem = "nome_da_pessoa"         # the id of a [[pessoa]], or
entidade = ""                   # the name of a party or body, when no person is named
quando = "2026-11-12"

[[linha]]                       # a documented public act or fact
id = "decreto_aprovado"
tipo = "ato"
fonte = "…"
onde = "…"
excerto = '''…'''
diz = "…"                       # one sentence: what the excerpt establishes
quem = ""                       # the id of a [[pessoa]], when the act is a person's
quando = "2026-11-12"

[[pessoa]]                      # everyone named in the text
id = "nome_da_pessoa"
nome = "…"                      # as printed at first mention
nome_curto = "…"                # as printed afterwards, or ""
cargo = "…"                     # the public role at the time of the act
linhas = ["ministro_declaracao"]   # the citacao and ato lines beside which the person is named
```

`calculo` uses the grammar the engine already proved: decimal numbers, line ids, `+ - * /`, parentheses and `round ( x , n )`, every token separated by spaces; exact decimal arithmetic; `round` rounds half up; the result must equal `valor` exactly. `round` may appear only once and only as the outermost step (edited 14 November 2026, 22:18 UTC: the receipt shows the calculation to a reader as arithmetic followed by the rounding in words, and a rounding in the middle cannot be shown that way; a calculation that needs one is split into two `derivado` lines).

A verbal comparison ("more than", "the highest since") is a comparison: it needs a `derivado` line, and the words are tied to it.

### `registo` (the record)

Written only by scripts, only by appending tables at the end of the file. The team's models never edit it. In every `[[passo]]` and `[[leitura]]`, `fim` is not before `inicio`.

```toml
[[passo]]                       # a step of production
nome = "reportagem"             # encomenda | nota | reportagem | escrita | edicao
lugar = "reporter"              # the seat
familia = "anthropic"           # anthropic | openai
modelo = "…"
inicio = "…Z"
fim = "…Z"

[[leitura]]                     # a reading
lugar = "juiz"                  # numeros | oposto | especialista | leitor | justica | juiz | correcoes | desenhador
familia = "openai"
modelo = "…"
inicio = "…Z"
fim = "…Z"
impressao = "…"                 # the fingerprint of what was read: the piece's, or the fact sheet's for a reading of the sheet alone (numeros always; especialista and oposto when they read the sheet before the text is written)
plantas_postas = 3
plantas_apanhadas = 3
achados = 2                     # real findings raised
adotados = 2                    # of those, adopted
veredicto = "passa"             # passa | nao_passa | levanta (same-family seats can only raise). This is the scored verdict, written by the script that compares the reading with the key: every plant caught and nothing else the reading raised left open
pessoas_vistas = ["…"]          # justica and juiz only: every person the reader found in the text

[[estado]]                      # the switch
estado = "publicada"            # publicada | retirada | rascunho
em = "…Z"
por = "…"                       # the script that wrote it
razao = "…"                     # shown to readers on a withdrawn piece's page. The weekly re-check writes the fixed sentence `retirada_numero` and nothing else

[[correcao]]
em = "…Z"
especie = "correcao"            # correcao (we were wrong) | atualizacao (the source changed)
antes = "…"
depois = "…"
razao = "…"
causa = "…"                     # correcao only: the seat or check that should have caught it
impressao_antes = "…"
impressao_depois = "…"
```

## The fingerprints

- **The piece's fingerprint** is the SHA-256 of the file's bytes from its first byte up to, and not including, the line `+++ registo`. It is what the judge's `leitura` records, what the page carries, and what the live page is compared with.
- **The fact sheet's fingerprint** is the SHA-256 of the bytes of the `folha` section. It is what the numbers editor's `leitura` records. A fact sheet changed after that reading must be read again.
- **The state** of a piece is the last `[[estado]]` in its record; with none, it is a draft. Publishing and withdrawing add one table and change nothing above the record line. The state moves one way: once published, a piece can be withdrawn and published again, never made a draft again, and its file is never deleted or renamed (edited 14 November 2026, 23:32 UTC, after the second code and security reading). **A withdrawn piece is published again only when its record holds a passing `juiz` reading made between the withdrawal and that publication** (it began after the withdrawal and ended before the publication; on the fingerprint the piece had at that publication, which is the current one or one that a later `[[correcao]]` names as its `impressao_antes`; by the other family, with every plant caught): a piece does not come back on the approval it had before it was withdrawn, nor on one given after it came back.
- **One family produces a piece, for its whole life,** and the other verifies and judges it. A reading by the producing family can only raise.
- **A correction** changes the text or the fact sheet, so the fingerprint changes: the piece is judged again, and only then is the `[[correcao]]` added. The earlier wording stays in `antes` and in the repository's history.
- **The code's fingerprint** (edited 15 November 2026, 01:36 UTC) is the SHA-256 of the list, sorted by path, of every tracked file's path and SHA-256, leaving out what is judged on its own or is not code: everything under `pecas/`, `mesas/`, `paginas/`, `direitos/`, `docs/`, `equipa/` and `design/`, and the files `textos.toml`, `textos.registo.toml`, `codigo.registo.toml`, `reconferencias.toml` (added 15 November 2026, 14:15 UTC: the third block's builder showed that without it every weekly re-check would change the code's fingerprint and close the code's gate), `sitio.toml`, `README.md` and `CLAUDE.md`. The code's record is `codigo.registo.toml` at the root: `[[passo]]` tables with `nome = "construcao"` and `[[leitura]]` tables with `lugar = "seguranca"`, validated and compared with `main` like the other records. No piece is built as published, and nothing is sent to the host, unless the last `seguranca` reading on the current code fingerprint passes, caught every plant of at least one, and is of a family other than that of every `construcao` step recorded since the passing reading before it.

## How the ten checks read this file

| Check | What it reads |
|---|---|
| 1. Every figure resolves | Every reference names a line; the digits rule holds; every `mostra` has one form, and is refused otherwise: an optional minus sign (present exactly when the `valor` is negative), the number, and then the line's own `unidade`, letter for letter; nothing else before the number, and nothing after the unit. Where the form has a space (after the number, inside and after a scale word, between the words of the `unidade`) it is exactly one space, which may be an ordinary space, a no-break space (U+00A0) or a narrow no-break space (U+202F), the three counting as the same letter; any other white space anywhere in a `mostra` or a `unidade` (a tab, a line break, another kind of space), two spaces in a row, or a space at either end, is refused. The number equals the `valor` at the precision shown. One exception, for a figure shown in a larger scale than its source's: between the number and the `unidade` there may be one of «mil», «milhões de» or «mil milhões de», and then the number times that scale equals the `valor` at the precision shown; any other word there is refused. So the reporter writes `unidade` as the reader is to see it («%», «pontos percentuais», «euros», «mil postos de trabalho») (a `mostra` with no digit must be marked `mostra_livre` and is left to the numbers editor) |
| 2. Every excerpt is in its stored source | Each `fonte.sha256` is in the store and the copy hashes to it; each `excerto` is found **whole** in the text of that copy (the character before it is not a letter or a digit when the excerpt begins with one, nor, when it begins with a digit, a minus sign or a hyphen, or a point or comma that follows a digit; the character after it is not a letter or a digit when it ends with one, nor, when it ends with a digit, a point or comma followed by a digit); each `valor` line's excerpt holds the figure (a space between a group of one to three digits and a group of exactly three is a thousands separator, so the two are one number, unless the line has `linha_de_quadro = true`, and then every space separates two numbers), and holds it at least `ocorrencia` times when the line has that field (a note, not a failure, when the figure occurs more than once and the field is absent, and when an `onde` names a paragraph); a copy is stored only from an answer 200; a `pagina` has its `pagina_sha256`, and that copy is in the store and hashes to it |
| 3. Every derived figure recomputes | Each `calculo` gives its `valor` exactly |
| 4. The published text is the judged text | The piece's fingerprint equals the `impressao` of its last passing `juiz` reading, and the built page carries it. The record only grows: what the record holds on `main` is the beginning of what it holds now; and a published piece changed above the record line carries a new judge's reading and a `[[correcao]]` joining the old fingerprint to the new |
| 5. Verified and judged by the other family | **No reading and no step signed by the tests' model name (`modelo-de-ensaio`) counts in any check, on any record (a piece's, the Method page's, the fixed sentences', the code's), outside a tree assembled for the tests** (one that `oedp/ensaio.py` built in a folder of its own and marked as such; the mark is refused in the repository's own tree, and `publicar` refuses to run where it is). A passing `numeros` reading on the current fact sheet and a passing `juiz` reading on the current piece, each of a different `familia` from the steps that produced what they read, each with at least one plant and all plants caught. The code is held to the same rule through its own record (see "The code's fingerprint") |
| 6. Dates and weekdays | Every weekday written beside a date in the project's own words above the record line (the title, the lead, the text, and what the reporter wrote in the fact sheet) matches the calendar; an `excerto`, the words the page prints from a `citacao` line, and a source's own `titulo` are the source's or the speaker's words and are not read; every date field is a real date |
| 7. People | Every `[[pessoa]]` has at least one `citacao` or `ato` line with a source; every paragraph that prints a person's name references one of that person's lines; a passing `justica` reading exists whenever a person is declared; the `pessoas_vistas` of the readers equal the declared people |
| 8. Nothing private | No secret, key, personal detail, machine path or user name in the file |
| 9. The site builds | A file that breaks this specification stops the build. That includes a field a reader sees (`mede`, `populacao`, `periodo`, `compara`, `diz`, `onde`) that holds, as a word of its own, the id of a line or of a source of the piece when that id has a `_` in it, and an `ocorrencia` that is not a whole number of 1 or more. So does a source whose publisher has no rights record `direitos/<host>.toml`, or whose record says no copy may be kept, or an excerpt longer than the record's `excerto_max` |
| 10. Live is built | The live page carries the same fingerprint as the built page |

Checks 4, 5 and 7 bind a piece from the moment its state is `publicada`, and go on binding it when it is withdrawn, because its title and its record stay public. A draft is checked on everything else, so that a branch can be read on GitHub while the piece is still being made.

**The record of the weekly re-check (`reconferencias.toml`).** One table for each whole run, and a run is whole only when every published piece was read and every source that carries an excerpt was fetched and read: a piece that cannot be read, or a source that does not answer, makes the run not whole, and then nothing is appended, the command says which piece or source, and it exits with an error (an unreachable source still withdraws nothing). The file only grows, and it is compared with what `main` holds whether or not it is still in the tree: a tree that has lost a record `main` holds fails as a cut record does.

**The size of a kind is said, not enforced.** `conferir` prints a note, and never a failure, when a piece of kind `diario` has more than 500 words of text (the `corpo` as a reader sees it, the three closing headings left out, each printed line counted as one word) or prints more than twenty figures (the lines printed by `{id}` in the title, the lead and the text, each time they are printed). Whether to cut or to make the piece an article is the direction seat's, at the edit. *(Edited 15 November 2026, 13:44 UTC: this said twelve, taken from the foundation's «about eight figures». Counted on the two real pieces, both judged or near it, the text prints 16 figures in each and the title and lead one and three more: a note that fires on every piece is noise. Twenty is the first number above both.)*
