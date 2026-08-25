# Leitura de UX do Codex, sem contexto (o leitor que chega pela primeira vez), 25.08.2026

*Corrida pelo lugar de direção (Claude Fable 5): Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos repositórios, com as páginas construídas de dezassete rotas (`dist/`, com as folhas e os scripts do sítio) e 26 capturas do leitor-utilizador (telemóvel a 390 e computador a 1280) anexadas ao prompt; sem constituição, sem notas, sem briefs. Custo, como o CLI reporta: **391 302 símbolos**, orçamento próprio. O relatório, verbatim:*

---


## Overall verdict

The main flaw is that the site makes its evidence system more visible than its identity. A first-time visitor sees a serious, source-conscious European indicators dashboard, but not a plain explanation of who is publishing it, why these subjects were selected, or that it is produced mainly by artificial intelligence with limited human intervention. That explanation appears on **Sobre**, and the mechanics only become clear after reading **Método**.

### 1. In five seconds, what is this?

It appears to be a Portuguese public-interest observatory measuring Portugal against European economic thresholds, with a municipal profile, studies, a source ledger and a work agenda.

The front page alone does not reveal the full proposition. I did not need **Método** to understand that Portugal breaches four European thresholds. I did need **Sobre** to learn what the broader observatory is, and **Método** to understand “linha”, “motor”, the source squares, the dashed seal, the uncertainty marker and the production process.

### 2. What can I do here?

A reader can:

- Read 13 national macroeconomic indicators and their thresholds.
- Switch between country, region and municipality on desktop.
- Open a municipality chooser, search for Évora and inspect its municipal profile.
- Compare published regions against `UE-27 = 100`.
- Switch between `Relance` and `Leitura breve`, and open individual indicator details.
- Browse the nominal list of all 308 concelhos.
- Read an archive of studies and one study in three forms: landing page, reading page and record document.
- Follow individual figures into the `Livro-razão`.
- Inspect the agenda, method, correction history and uncertainty marker.
- Open an English front page.

The open-menu state is clear in `inicio-390-menu-aberto.jpg`. The desktop municipality search is clear in `inicio-1280-ambito-municipio.jpg`, and the map hover identifies Évora in `mapa-1280-rato-sobre-evora.jpg`.

No supplied after-state shows what an individual `ABRIR` or the global `LEITURA BREVE` control looks like after activation. The built pages indicate that they reveal further explanation, but I could not confirm the rendered result from the screenshots. The theme controls are also shown only in the light state.

### 3. What did I not understand immediately?

The recurring unexplained language includes:

- `Procedimento dos Desequilíbrios Macroeconómicos`
- `Painel europeu reconferido`
- `Âmbito`
- `Densidade`
- `Relance`
- `Leitura breve`
- `CAOP 2025`
- `A régua da convergência`
- `UE-27 = 100`
- `pp`
- `linha do livro-razão`
- `motor`
- `atravessados do motor`
- `proveniência completa`
- The square before `FONTE`
- The difference between a solid source seal, a dashed one and `[a verificar]`

Several are eventually explained, but generally after the reader has already encountered them.

### 4. What stops me?

The strongest stops are:

- On a phone, `ABRIR UM CONCELHO` produces no visible chooser at the point of action in `inicio-390-apos-abrir-concelho-cima.jpg`. Only the focus outline changes; the search has appeared above the current viewport.
- The phone map is too small to function as a map. Its circles cannot be meaningfully distinguished.
- The regional convergence module becomes extremely small and crowded on a phone.
- The concelhos index offers a substantive page for only one of 308 municipalities.
- Repeated global furniture and large empty areas delay page-specific content on every phone page.
- Some reader pages become very long technical records with internal identifiers, paths and hashes.

### 5. What is present without explaining the site?

Every ordinary phone page begins with `MENU`, `ENGLISH`, the wordmark, reconfirmation date, agenda counts and theme controls. This occupies much of the first screen before the page’s own purpose appears.

The pages also repeat:

- `FONTE` after nearly every number.
- The same date and agenda status.
- `Relance` and `Leitura breve` as both site-wide concepts and local section labels.
- Technical provenance details within otherwise public-facing prose.
- Large areas of unused space before the first useful measure.

The repetition proves discipline, but it often precedes the explanation a new reader needs.

### 6. What is good?

Keep these:

- Units and reference dates are normally placed next to the value.
- Figures lead to individual evidence records rather than generic source lists.
- Corrections, updates, uncertainty and unanswered questions are stated rather than concealed.

---

## Front page and its states

### 1. In five seconds

The page says that Portugal breaches four European macroeconomic thresholds and meets nine. That is understandable. What remains unclear is whether this is the whole site, one dashboard within a larger observatory, an official publication, or an independent project.

`O Estado do País` and `Portugal, medido` are broad names, but the visible content is specifically a European macroeconomic panel.

### 2. What I can do

- **Menu:** opens a clear inline navigation list on the phone.
- **Density:** `Relance` is selected; `Leitura breve` should open the explanations for all measures. No captured after-state confirms the rendered effect.
- **Individual `ABRIR`:** should reveal a measure’s scale or explanation. No after-state is supplied.
- **Municipality, desktop:** selecting `MUNICÍPIO` reveals `ESCREVA O NOME DO CONCELHO`; Évora appears as the only result marked `tem página`.
- **Map, desktop:** hovering a point identifies `Évora, distrito de Évora`.
- **Municipality, phone:** `ABRIR UM CONCELHO` changes the page state, but the chooser is not visible in the resulting viewport.
- **Region, phone:** `VER UMA REGIÃO` reveals the convergence material, but no visible region-selection step is captured.
- **English:** a built English front page exists. No English screenshot was supplied.

### 3. What I did not understand

- Why these particular 13 measures define “the state of the country”.
- Whether `cumpre 9` means the country is performing well in nine respects or merely remains within monitoring thresholds.
- `Procedimento dos Desequilíbrios Macroeconómicos`, `CAOP`, `Relance`, `Densidade`, `UE-27 = 100` and `pp`.
- What the small square before `FONTE` encodes.
- Why the map contains 308 unlabeled circles and how a phone reader is expected to select one.
- In English, `concelho` remains untranslated in strings such as `Type the name of the concelho` and `No concelho by that name`.

### 4. What stops me

- In `inicio-390-apos-abrir-concelho-cima.jpg`, the municipality button has focus but no chooser or instruction appears nearby. A reader can reasonably conclude that nothing happened.
- The map in `inicio-390-ecra2.jpg` is about thumbnail size. It communicates the outline of Portugal but not 308 usable choices.
- `inicio-390-apos-ver-regiao-cima.jpg` compresses the regional scale and labels into a very small area. `regua-390-sobreposicao.jpg` shows its disclosure row crowded against both edges.
- There is a large blank interval between the map controls and the first indicator in `inicio-390-ecra2.jpg`.
- On desktop, the actual indicator cards are below the first viewport; the opening screen is mainly title, controls and map.

### 5. What is there without adding understanding

The update date, agenda counts, theme switch, scope switch, density switch, map, map count and source seal all arrive before the first actual metric on desktop. On the phone, the same global material is followed by large map buttons and then another substantial gap.

### 6. What is good

- The headline gives the overall count and immediately names all four failed thresholds.
- Each indicator shows value, threshold direction, unit, reference year, status and source.
- The desktop search state and map hover provide clear feedback.

---

## Concelhos index

### 1. In five seconds

This is an official-administrative list of Portugal’s 308 concelhos and an index of the municipality pages available on the site.

### 2. What I can do

I can read the national and island counts, browse municipalities grouped geographically and open Évora. `O mapa dos concelhos` returns to the map experience.

Rows marked `sem página ainda` do not lead to a municipal profile.

### 3. What I did not understand

`Carta Administrativa Oficial de Portugal` is written out, but `CAOP` and the repeated source squares still require prior knowledge. `1 de 308 concelhos · tem página` becomes clear only after seeing the rows.

### 4. What stops me

Only Évora has a page. A visitor arriving through `MUNICÍPIOS` may reasonably expect municipal coverage, but 307 entries are declarations of absence.

On a phone, this is also a very long linear list without a visible search or filter.

### 5. What is there without adding understanding

The page lists all 308 names even though nearly all have identical `sem página ainda` status. It proves the denominator but provides little utility for the unavailable municipalities.

### 6. What is good

- Coverage is stated honestly: `1 de 308 concelhos`.
- Continental, Azorean, Madeiran and total counts are explicit and sourced.
- Unavailable pages are not disguised as active links.

---

## Évora municipality page

### 1. In five seconds

This is a measured municipal profile of Évora, not a general municipal encyclopedia. It covers population, purchasing power, unemployment, businesses, debt and budget execution.

### 2. What I can do

I can scan eight headline measures, open their explanations, read a prose summary, inspect municipal debt and accounts, compare published figures, follow sources and open mandate periods in the administration timeline.

No supplied screenshot shows an individual measure after `ABRIR`.

### 3. What I did not understand

- Whether `sem limiar` means neutral information or an incomplete evaluation.
- `Índice · média nacional = base`.
- The practical significance of `Índice de dívida 105,5` until the later legal ceiling of 150 is read.
- `DGAL`, `INE`, `pelouros`, party abbreviations and the difference between figures from the municipality and figures from the regulator.
- In the administration instrument, whether `242,6 → 105,5` should be interpreted as performance by particular governments or only a time series.

### 4. What stops me

The first useful content is delayed by conspicuous empty space. In `evora-390-cima.jpg`, the first metric only begins near the bottom. In `evora-1280-cima.jpg`, four values are cut by the lower edge after a large unused area.

The later administration instrument in `evora-390-sobreposicao-glance.jpg` puts two large values, source links, prose, a chart, a party timeline and five mandate links into one phone-width box. It remains readable in parts, but it is difficult to scan as one instrument.

### 5. What is there without adding understanding

The full global masthead is followed by a spacious municipal title block, another separator and `RELANCE` before any figure. Later, both `Relance` and `Leitura breve` are repeated inside individual instruments.

### 6. What is good

- Municipal measures have concrete units and dates.
- The page distinguishes municipal reporting from central regulatory reporting.
- It openly records discrepancies and explains that values rounded to euros can differ in cents.

---

## Studies index

### 1. In five seconds

This is meant to be the observatory’s archive: studies, language editions, publication dates and migration status.

### 2. What I can do

I can open a study by title and see whether an entry is marked PT or EN. There is no visible search, subject filter, date filter or grouping of multiple language editions into one work.

### 3. What I did not understand

The page says `12 trabalhos` and `16 edições`, but presents 16 article-like rows. Some PT and EN editions share the same destination:

- `Évora — Orçamentado, Pago, Devido 2025`
- `Évora — Budgeted, Paid, Owed 2025`

Several English-labelled entries retain Portuguese titles or descriptions. `Descrição: reformulação do título` does not tell an ordinary reader what the migration state actually is.

### 4. What stops me

Most entries say `Publicação: [a verificar]`, despite the page promising an archive organised by editions and dates. `Datas de publicação por confirmar` is honest, but it leaves the archive without its main ordering information.

Some duplicated PT/EN rows look accidental because title, description and destination do not consistently change with the badge.

### 5. What is there without adding understanding

Language editions are repeated as separate full rows, often with the same description and link. Internal notes such as `Descrição: reformulação do título` appear where a reader would expect subject, date or availability information.

### 6. What is good

- The page states the number of works and editions separately.
- Missing dates and descriptions are declared rather than invented.
- The available study has a useful plain-language synopsis.

---

## Study landing page: Évora — Prometido, Pago, Auditado 2026

### 1. In five seconds

This is a synopsis and entry point for a study comparing recovery-plan funding, payments, public contracts and audit records associated with Évora.

### 2. What I can do

I can read the two headline totals, a short conclusion, the study’s caveats and its editions. I can choose:

- `Ler o documento`
- `Ler no sítio`
- `Ler o documento · EN`
- The Évora municipality page
- Individual source rows

`Método e ressalvas` is expandable, but no opened screenshot is supplied.

### 3. What I did not understand

- The difference between `Ler o documento` and `Ler no sítio` before opening both.
- Why a Portuguese landing page repeats the conclusion in English.
- Whether `aprovados`, `atribuídos`, `contratados`, `pagos` and `vencidos` refer to the same population of projects.
- Why `61,32%` overdue is compared with `51,95%` paid even though those are not complementary measures.
- Why `[a verificar]` appears beside the two main totals if the page says the values are facts rather than estimates.

### 4. What stops me

In `estudo-evora-390-cima.jpg`, `167372755,84` is presented as a long uninterrupted headline number; the euro sign and description come afterwards. It takes effort to parse as €167.4 million.

The trust cue is also difficult: the most prominent amounts carry `[a verificar]`, but the explanation that only a provenance field is unconfirmed is on another page.

### 5. What is there without adding understanding

The two reading routes appear once under `O documento original` and again inside the edition records. Portuguese and English conclusions and edition controls are repeated on one Portuguese page.

### 6. What is good

- The page says that the values are calculated sums rather than quoted sentences.
- Important caveats accompany the headline rather than appearing only at the end.
- It separates the study’s interpretation from the underlying counts.

---

## Study reading page

### 1. In five seconds

This is the ordinary reading version of the Évora study. Its title and opening explain the subject more plainly than the study landing page.

### 2. What I can do

I can read the report in sequence, inspect tables, follow linked numbers to their evidence rows, read explicit limitations and jump from a figure to its technical line later on the page. I can also open the record document.

No screenshot demonstrates table scrolling or figure-link behaviour on a phone.

### 3. What I did not understand

Within the report, specialised language accumulates: PRR component codes, NUTS levels, beneficiary roles, contract-register fields and audit-catalogue matching. These are mostly explained, but they require sustained attention.

After the article, the labels become internal:

- `linha do motor`
- `o valor como a linha o guarda`
- `resumo de origem`
- `api-viva`
- `raw-sem-manifesto`
- `derivado`
- `registo de conteúdo`
- A repository path ending in `.record.json`
- Full hashes

### 4. What stops me

After `O que este documento não responde`, the public article continues into a very large `As linhas deste documento` section. Each figure is repeated with its stored value, printed value and origin category. This radically lengthens the page and makes it difficult to know that the public argument has ended.

The closing apparatus reports `102 blocos · 326 algarismos · 12 com linha do livro-razão` and exposes an internal content path and hashes. That serves verification, but not the first-time reading task.

### 5. What is there without adding understanding

Much of the article’s numerical content is repeated in the technical line list. The same evidence can also be opened in the separate `Livro-razão`, making the inline dump a third provenance layer.

### 6. What is good

- `Ler esta parte primeiro` presents the limitations before the conclusions.
- Inferences are explicitly labelled `(inferência)`.
- The report ends with a strong list of questions it does not answer.

---

## Archived study document

### 1. In five seconds

This is a preserved record edition of the study, not the ordinary site reading experience.

### 2. What I can do

I can return to the study page, open `Sobre` and read the full record document. The page does not offer the normal site navigation in the supplied screenshot.

### 3. What I did not understand

Before reaching the subject, I encounter:

- `Research Hub`
- `ledger.json`
- `Technical Source/make_pt.py`
- “passo determinista”
- Repository paths and verification files

A public reader is not told at the entry point why this version is useful to them or how it differs from `Ler no sítio`.

### 4. What stops me

`estudo-evora-documento-390-cima.jpg` leads with production-system language before the substantive report. It is cognitively hostile to a reader who merely chose `Ler o documento` expecting a conventional document.

### 5. What is there without adding understanding

The page repeats the full report while adding source-code, translation and file-record language already represented elsewhere in the site’s method and ledger.

### 6. What is good

- `Voltar à página do estudo ↑` is immediate and visible.
- The page identifies itself as an `EDIÇÃO DE REGISTO`.
- It declares how the Portuguese edition was produced instead of presenting the translation as unexplained human authorship.

---

## Livro-razão index

### 1. In five seconds

This is a provenance register: one record for each published number, including source, document, access date, excerpt and calculations.

### 2. What I can do

I can browse 136 claims, open an individual evidence row and download CSV or JSON. I can also see the number of calculated claims and records with complete provenance.

There is no visible search or filter.

### 3. What I did not understand

`Livro-razão` normally suggests an accounting ledger. The introduction explains its local meaning, but later labels remain specialised:

- `136 afirmações`
- `19 calculadas`
- `Proveniência completa 128`
- `campos por confirmar`
- Technical slugs beneath values

### 4. What stops me

On a phone, finding one claim requires traversing a long list of 136 records. The page has structured data but no visible reader tool for locating a claim by topic, value, source or uncertainty status.

### 5. What is there without adding understanding

Each list row combines the human-readable value with technical identifier, unit, document and dates. Useful provenance is present, but it is repeated at a density better suited to a searchable register.

### 6. What is good

- Coverage is quantified rather than claimed vaguely.
- Calculated values are distinguished.
- Machine-readable downloads and licensing information are provided.

---

## Ledger row: public debt

### 1. In five seconds

This is the evidence record behind the front-page `89,7 % do PIB` public-debt figure.

### 2. What I can do

I can see the publisher, series, access date, series page, API request, proof field, reread history, correction status and provenance. I can follow the source URLs and return to the ledger.

### 3. What I did not understand

The row assumes knowledge of:

- `General government gross debt (EDP concept)`
- `tipsgo10`
- `Página da série`
- `Prova`
- `Campo devolvido`
- The distinction between the public data-browser URL and API request

### 4. What stops me

Nothing prevents reading the central claim. The main friction is that the raw Eurostat URL occupies multiple lines in `linha-divida-390-cima.jpg`, and the forensic material is more technical than most readers need.

### 5. What is there without adding understanding

The same source identity is expressed as publisher, document title, series URL, request URL, excerpt/proof and provenance fields.

### 6. What is good

- The value, unit and source are unambiguous.
- The exact statistical series and access date are supplied.
- Rereads and corrections are recorded separately.

---

## Ledger row: Évora PRR approved total

### 1. In five seconds

This is the calculated evidence record for the study’s €167,372,755.84 approved total.

No screenshot was supplied for this row, so I could not assess its rendered phone or desktop layout.

### 2. What I can do

I can see the source workbook, snapshot date, file hash, calculation column, filter and locality. The row also links to an archived copy and records several source-URL and value updates.

### 3. What I did not understand

The page expects the reader to interpret:

- `instantâneo 20260819-1728`
- `sha256`
- `papel_entidade ∈ {Beneficiário Intermediário, Beneficiário Direto}`
- `localizacao_sede = Évora`
- The difference between `atualização` and `revisão de proveniência`

### 4. What stops me

The row says `O excerto textual desta linha ainda não foi transcrito da fonte` and marks the source `[a verificar]`. This is technically explained because the value is a calculated sum, but it still makes the most visible trust signal look unresolved.

Reproduction requires obtaining the workbook and applying the stated calculation; there is no reader-level proof table showing the included rows or a compact reconciliation.

### 5. What is there without adding understanding

The page contains a long history of rotating source URLs, HTTP 404s, successive snapshots and value updates. It is valuable audit history, but dominates the simple question “How was this total obtained?”

### 6. What is good

- The exact filter, column, snapshot and hash are declared.
- The site explains why it does not redistribute a file with unspecified licensing.
- Previous values and reasons for change remain visible.

---

## Agenda

### 1. In five seconds

This is the observatory’s public work queue: what is active, next, completed or withdrawn, plus expected source-publication events.

### 2. What I can do

I can jump to each state, inspect the four active items and read their history, decisions and source calendar. The screenshot does not show an opened agenda event, so I could not assess that interaction state.

### 3. What I did not understand

The page uses internal workflow language:

- `atravessados do motor`
- `registo prévio selado`
- `vigilância`
- `critério`
- `direção`
- `linha`
- References to internal files such as `SURVEY.md` and `DECISIONS.md`

### 4. What stops me

The high-level answer is clear, but the detailed entries become an operational log. A reader interested in what will be measured next has to separate intended public outcomes from process records and internal paths.

### 5. What is there without adding understanding

The top repeats `4 em curso · 0 a seguir`, already present in every page header. Each agenda item then carries extensive preregistration and change history.

### 6. What is good

- Active, next, completed and withdrawn work are separated.
- Decisions and changes are dated instead of retrospectively rewritten.
- The source calendar turns vague promises into observable future events.

---

## Method

### 1. In five seconds

This is the full operating method: sources, production engine, ledger, build checks, evidence seals, rereads, corrections, agenda, human intervention and explicit non-goals.

### 2. What I can do

I can use the numbered contents to jump to ten sections and follow links into the ledger, agenda, corrections and marker explanation.

### 3. What I did not understand

The method defines its vocabulary, but it introduces many internal metaphors:

- `motor`
- `travessia`
- `gabarito`
- `portas`
- `selo`
- `dívida de proveniência`
- `resumo criptográfico`

These terms make the method feel like documentation for the production system as much as an explanation for the public.

### 4. What stops me

The method is not physically blocked; it is simply too much to require before the front page’s basic trust cues make sense. The site should not depend on this page to explain the meaning of routine controls and source markers.

### 5. What is there without adding understanding

Implementation discipline, editorial policy and reader explanation are interwoven. The detailed build mechanics prove care, but can obscure the simpler questions: who chose this work, who is responsible and what a source marker guarantees.

### 6. What is good

- The AI and human roles are disclosed.
- The method states what the observatory does not do.
- Corrections, rereads and provenance completeness are governed by explicit rules.

---

## About

### 1. In five seconds

This is the clearest statement of the project: it measures Portuguese society, keeps a continuous public record and is produced mainly by AI with minimal human intervention.

### 2. What I can do

I can read the short statement and proceed to `MÉTODO`.

### 3. What I did not understand

The page still does not immediately identify the responsible person, organisational form, funding or editorial ownership. Those matters require the method or other material.

### 4. What stops me

Nothing. The problem is its location: information essential to interpreting the front page is available only after choosing `Sobre`.

### 5. What is there without adding understanding

Very little. This is one of the least padded pages.

### 6. What is good

- It is concise.
- It explicitly discloses the central role of AI.
- It links directly to the fuller method.

---

## Corrections

### 1. In five seconds

This is a permanent public record of corrections, updates and provenance revisions, plus a route for reporting errors.

### 2. What I can do

I can read the policy, compare old and new values and open a report form. The built page says the form opens the reader’s email program; no screenshot shows that result, so I could not confirm the rendered interaction or mail-client handoff.

### 3. What I did not understand

The distinction between `correção`, `atualização` and `revisão de proveniência` is important but initially easy to miss. A reader may otherwise think the headline count excludes changes.

### 4. What stops me

A reader without a configured mail application may not complete the form’s primary action. The page does provide the email address as a fallback.

### 5. What is there without adding understanding

The policy explanation is followed by detailed entries already repeated on the affected ledger rows. Here the duplication is defensible because this is the chronological public log.

### 6. What is good

- The policy rejects silent correction.
- Old value, new value, date and reason remain visible.
- The reporting route is explicit.

---

## `[a verificar]` marker page

### 1. In five seconds

This page explains the site’s sole uncertainty marker: a provenance field has not been confirmed against the source.

### 2. What I can do

I can learn what the marker means and follow links to the method or relevant ledger material.

### 3. What I did not understand

The page calls it `o único marcador de incerteza` but then stresses that it is not uncertainty about the published number. That distinction is logically possible, but it conflicts with the ordinary reading of `[a verificar]` when the marker appears beside a source for a headline claim.

`Sai sozinho` also sounds as though uncertainty resolves automatically, without initially naming the test or responsible actor.

### 4. What stops me

Nothing on the page itself. The stop happens earlier, when a reader encounters `[a verificar]` beside a major number and has not yet found this explanation.

### 5. What is there without adding understanding

The page repeats the same distinction in several forms: not a default, not an estimate, not doubt about the number, but an unconfirmed source field. The repetition is useful because the distinction is counterintuitive.

### 6. What is good

- The meaning is explicit.
- Missing evidence is not silently treated as complete.
- The page explains what changes when the field is confirmed.

---

## 404

### 1. In five seconds

The address does not exist or has moved.

### 2. What I can do

I can go to the home page, studies or method, and later report an error.

### 3. What I did not understand

Nothing material.

### 4. What stops me

The missing page itself is the only stop. There is no site search, but the three recovery destinations are sensible.

### 5. What is there without adding understanding

The standard site header still occupies a large part of the phone screen before the error message.

### 6. What is good

- `404` and `Não existe nada neste endereço` are unambiguous.
- A likely cause is stated plainly.
- Useful recovery links are immediately available.

---

# Ranked findings

| Rank | Page and width | What I saw | Why it matters | Reader’s wish |
|---:|---|---|---|---|
| 1 | Front page, 390 px | After `ABRIR UM CONCELHO`, `inicio-390-apos-abrir-concelho-cima.jpg` shows only a focus outline; no chooser or instruction appears near the control. | The primary phone route into municipal content appears not to work, even though the search has been introduced elsewhere on the page. | After I tap, put the municipality search and its first results in view and tell me what changed. |
| 2 | Concelhos index, 390 px | `1 de 308 concelhos · tem página`; almost every row says `sem página ainda`. | The navigation promises national municipal coverage but delivers a substantive profile for only Évora. | Tell me upfront that Évora is the current pilot, and let the other 307 entries provide something useful or stay out of the primary navigation. |
| 3 | Front page, 390 px | `inicio-390-apos-ver-regiao-cima.jpg` reduces the convergence instrument to tiny labels; `regua-390-sobreposicao.jpg` shows its row crowded and clipped at the edges. | Regional comparison is nominally available but difficult to read or operate on the phone. | Give me a readable region list and result before showing the full scale. |
| 4 | Front page, 390 and 1280 px | The opening says `Portugal ultrapassa 4 limiares...` but does not state who operates the observatory or that it is mainly AI-produced. | I can understand the statistic without understanding the publisher, scope or basis for trust. | Put one plain identity and responsibility sentence on the front page. |
| 5 | Studies index, 390 px | The archive promises editions and dates, but most rows say `Publicação: [a verificar]`; PT and EN rows often share title, description or destination. | I cannot reliably tell what was published, in which language, when, or whether two rows are distinct editions. | Group editions under each study and show a confirmed language, date and destination for every edition. |
| 6 | Site-wide ordinary pages, 390 px | `MENU`, `ENGLISH`, wordmark, reconfirmation date, agenda and theme controls consume much of every first screen. | Page-specific purpose repeatedly arrives late, making different pages initially look the same. | Let the page’s own title and purpose appear substantially earlier on a phone. |
| 7 | Évora page, 390 and 1280 px | `evora-390-cima.jpg` and `evora-1280-cima.jpg` contain large empty intervals before the first measures. | The municipal profile looks sparse or unfinished before the reader reaches its useful data. | Bring the first municipal measures into the initial viewport. |
| 8 | Study reading page, phone and desktop HTML | After the article, `As linhas deste documento` repeats figures through hundreds of technical entries, followed by a `.record.json` path and hashes. | The public reading experience becomes an implementation record, and it is hard to tell where the article ends. | End the reader article cleanly and move the technical line register behind one explicit verification link. |
| 9 | Study landing, 390 px | The headline total is `167372755,84`, followed by `FONTE [A VERIFICAR]` in `estudo-evora-390-cima.jpg`. | The number is hard to parse and its most visible trust cue looks unresolved, even though the marker refers only to a provenance field. | Format the amount as money and explain the precise unresolved field beside the marker. |
| 10 | Archived study document, 390 px | `estudo-evora-documento-390-cima.jpg` leads with `Research Hub`, `ledger.json` and `Technical Source/make_pt.py`. | A reader choosing “read the document” meets repository and production language before the public-interest subject. | Explain what the record edition is for before sending me into it, and make the ordinary reading route the obvious default. |
| 11 | Livro-razão index, 390 px | `136 afirmações · 19 calculadas`, followed by a long unfiltered register. | The evidence exists but a reader cannot efficiently find a particular claim, source or incomplete record. | Let me search and filter the ledger by topic, value, source and verification state. |
| 12 | Agenda, 390 px | Reader-facing plans are mixed with `motor`, sealed preregistrations, workflow criteria and internal file paths. | The public answer to “what comes next?” is buried inside the production log. | Lead each item with its intended public result and keep the internal audit trail in a separate expandable record. |
| 13 | English front page, built HTML; no supplied screenshot | Strings include `Type the name of the concelho`, `No concelho by that name` and Portuguese source titles. | The English edition still requires knowledge of Portuguese administrative vocabulary. | Define or translate `concelho` and distinguish untranslated official titles from interface language. |