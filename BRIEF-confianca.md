# BRIEF — Confirmação e confiança

**Trust brief for O Estado do País — measured, not proposed.**
Research and measurement only. Nothing in either repository was changed; nothing was committed.

| | |
|---|---|
| Written | 2026-08-15 |
| Live site measured | `https://xn--oestadodopas-2fb.pt` (oestadodopaís.pt) |
| Live build at time of measurement | `version.json` → commit `b2196e57`, ref `main`, env `production`, origem `vercel`, built `2026-08-15T18:54:33.946Z` |
| Local `dist/` used for bulk counting | commit `4fb8cb47` (branch `municipio-evora`, built `2026-08-15T13:19:06.819Z`) — **one commit behind live**; `git merge-base` confirms it is an ancestor of `main`. The diff `4fb8cb47..b2196e57` touches `DECISIONS.md`, 4 ledger rows, `cruzamentos/evora.json`, `leituras.mjs`, `municipios.mjs` — no boilerplate strings. |
| Ledger read from | working tree at `HEAD` = `b2196e57` (= live) |
| Reconciliation | every `dist/`-derived row-page count below was independently re-derived from the 132 ledger YAML files at `HEAD` and **matched exactly** (see §3.2). The `dist/` counts are therefore valid for the live site. |

**Scope of the question.** The thesis is that an AI-written observatory earns trust by making every number confirmable by anyone in seconds and every error visible in the open. This brief measures the site as it stands against that: how a stranger confirms a number today, what stands in the way, how much frame text and how many disclaimers the surface carries, and what the engine already holds that the site does not yet show.

**Headline.** The site has two provenance systems, and they do not meet.
The one it advertises (the seal → the ledger row page) gets a reader to a *transcribed excerpt* in one click and then hands them a whole document — a 16 MB PDF, a raw JSON blob, a 403 — with a locator naming a file the reader does not have. The one it does not advertise (the receipts layer inside `/estudos/<slug>/documento`) already gets a reader to *the printed line, cropped from the actual PDF page, with a `#page=N` deep link*, in one click, without leaving the page. It is live, it is 216 crops across four documents, and it is in no sitemap and no menu.

---

## Part 1 — The confirmation path, measured on the live site

### 1.1 How this was measured

Live HTML fetched with `curl` on 2026-08-15 evening and parsed with `python3` (tag-stripping + regex over `data-claim`, `src-chip`, `href`). All source addresses in the ledger were then requested live to see what a reader actually receives. Page inventories and phrase counts were run over local `dist/` and reconciled against the ledger at `HEAD` (§3.2).

A **click** = one navigation or one popover open. A **step** = anything else a reader must do (scroll, download, open a 16 MB file, scan a table column by eye, search a page).

### 1.2 The nine walks

Columns (a)–(d) are the four things the thesis promises. All rows VERIFIED live.

| # | Number, where it appears | (a) → exact source sentence/field | (b) → the line in the original document | (c) date read / independent re-check | (d) report an error |
|---|---|---|---|---|---|
| 1 | **89,7** `divida-publica-2025` — front-page scoreboard card | **1 click** (seal → `/livro-razao/divida-publica-2025`). Excerpt printed: `General government gross debt (EDP concept), consolidated - annual data — Percentage of gross domestic product (GDP) — Portugal — 2025: 89.7` | **1 more click** → Eurostat API URL. Returns 6,647 B of **raw JSON**, no human page, no `#page=`, no crop. The excerpt is a house-assembled string, not a sentence printed anywhere. | «Lido a **2026-08-12**» on the row page. **No re-check record on the row.** The front page carries one page-level line: «Linha de base reconferida contra a fonte a 2026-08-12.» | **Front page: no correction link exists at all** (0 occurrences of `correc`/`mailto`). From the row page: `Como isto é feito` → `/metodo#livro-razao` → scroll to «Correções» → `mailto:`. **2 clicks + 1 scroll.** |
| 2 | **58 567** `evora-populacao-2025` — Évora Relance tile | **1 click** → row page. Excerpt: `valor 58567` | **1 more click** → INE JSON endpoint (37,628 B raw JSON on first request; see §1.5). Locator reads `raw/ine_data_populacao_evora.json → Dados["2025"], geocod 1C40705` — **names a file the reader does not have**. | «Lido a 2026-08-10». No re-check record. The município page states outright: «Nenhuma data de leitura é escrita aqui: quem quiser sabê-la, abre a linha.» | **0 clicks** — the Évora page carries an «Encontrou um erro» box with `correcoes@oestadodopais.pt` (38 words). Scroll only. |
| 3a | **18** `distancia-portugal-ue27-2024` — value **inside** the front-page Leitura breve sentence | **The seal beside it links to a different row.** Markup: `<span data-claim="distancia-portugal-ue27-2024">18</span>` … `<a class="src-chip" href="/livro-razao/pib-pc-portugal-2024">`. 1 click lands on the parent. To reach the row of the number shown: no link exists — `/livro-razao` index + find by id. **2 clicks + 1 search.** | As (a), then the Eurostat regional API. | «Lido a 2026-08-12» on whichever row you land on. | As #1. |
| 3b | **93,86** `alentejo-central-poder-de-compra-2023` — value inside the **Évora** Leitura breve sentence | **1 click** → its own row. Sealed correctly. | 1 more click → INE JSON. Locator `raw/ine_data_poder_compra_alentejo_central.json`. | «Lido a 2026-08-10». No re-check. | 0 clicks (same-page box). |
| 4 | **82 871 522,82** `evora-divida-31-10-2013` — stewardship timeline, «Deixou» for 2009–2013 | **1 click** → row page, real transcribed excerpt. | 1 more click → `Relatorio_Gestao_2015.pdf` (**4.70 MB**, HTTP 200). Locator `Relatorio_Gestao_2015.pdf, p. 11`. **No `#page=`** — reader downloads 4.7 MB and navigates by hand. | «Lido a …» on the row. No re-check. | 0 clicks (same-page box). |
| 5 | **166 639 411,36** `evora-prr-aprovado-2026` — reading-page headline, `/estudos/evora-prometido-pago-auditado-2026` | **1 click** → row page. Excerpt is `[a verificar]` with the standing gloss: «O excerto textual desta linha ainda não foi transcrito da fonte. Escrever aqui uma paráfrase plausível seria exactamente a fabricação que este sistema existe para impedir.» | **Not possible today.** Address is `dados.gov.pt/…/listagem-de-entidades-prr-20260803.xlsx` → **HTTP 404**. The snapshot URL is dead. | «Lido a 2026-08-04». No re-check. | **No correction link on the reading page** (0 `mailto`, 0 `correc`). Route out is `Como isto é feito` → `/metodo`. 2 clicks + scroll. |
| 6 | **105,5** `evora-indice-de-divida-2024` — derived, Évora Relance + timeline | **1 click** → row page. No excerpt (by design): «Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.» Shows the arithmetic in PT, the `check` expression `round ( evora-divida-dgal-2024 / evora-limite-divida-dgal-2024 * indice-de-divida-limite-legal , 1 )`, and 3 parent links. | **3 clicks + a manual table scan.** Click a parent (`evora-divida-dgal-2024`) → its address is a 250-character `portalautarquico.dgal.gov.pt/ficheiros/?schema=…&content_id=…` query string returning a 950 KB PDF. Locator: `dgal_divida_2024.pdf, linha de Évora, coluna (5)` — a filename that does not appear in the URL. Excerpt is a raw table row: `ÉVORA ÉVORA 77 764 656 55 559 123 877 561 0 54 681 562` — the reader must count columns to know which figure is the claim. | «Lido a 2026-08-10» on each parent. No re-check. | 0 clicks from the Évora page; 2 from the row page. |
| 7 | **65 565 049,87** `evora-despesa-paga-2025` — Fundo, «Despesa paga» | **1 click** → row page. Excerpt: `nível de pagamentos de 65.565.049,87€ (54.575.385,72€ de correntes e 10.989.664,15€ de capital). Quadro 14 – Execução das Despesas por Natureza Designação Orçamento Execução % Despesas Correntes 77` — **truncated mid-number** (`… Correntes 77`). | 1 click → `PRESTACAO_CONTAS_2025.pdf`, HTTP 200, **16.34 MB**. Locator `PRESTACAO_CONTAS_2025.pdf, p. 119`. **No `#page=`.** A reader on a phone downloads 16 MB before seeing anything. | «Lido a 2026-08-10». No re-check. | 0 clicks (Évora page). |
| 8 | **308** `municipios-portugal-caop-2025` — front-page map count | **1 click**? **No** — this claim has **no seal anywhere on the front page** (see §1.4). Reachable only via `/livro-razao`. Its row shows arithmetic `278 + 19 + 11 = 308` and excerpt `[a verificar]`. | Address `https://geo2.dgterritorio.gov.pt/caop/` → **HTTP 403**. | «Lido a 2026-08-12». No re-check. | As #1. |
| 9 | **26,5%** `agua-nao-faturada-portugal-2024` — the water study | **The number appears on no content page.** `grep` over the whole build finds it only on `/livro-razao`, `/en/ledger` and its own two row pages. `/estudos/agua-nao-faturada` is a stub: 14 text blocks, 227 words, **zero values, zero seals**. | **Impossible.** `source_url` is `[a verificar]`; excerpt is `[a verificar]`. There is no address to click. | «Lido a 2026-07-28». No re-check. | No correction link on the study stub. 2 clicks via `/metodo`. |

### 1.3 What the row page shows, and in what order

Same order on all 132 rows, both editions (`/livro-razao/<id>` and `/en/ledger/<id>`; each links to the other).

| Order | Block | PT label | EN label | Notes |
|---|---|---|---|---|
| 1 | value + unit + id | — | — | id in mono, not a link |
| 2 | Excerto | `Excerto` | `Excerpt` | + one of four standing glosses (§3.4) |
| 3 | Aritmética (when derived) | `Aritmética` / `Reavaliada na construção` / `Deriva de` | `Arithmetic` / `Re-evaluated at build` / `Derived from` | parents are links |
| 4 | Correções e atualizações | `Correções e atualizações desta linha` | — | 129 of 132 say «Esta linha nunca foi corrigida nem actualizada.» |
| 5 | Proveniência | `Fonte` · `Documento` · `Edição` · `Onde no documento` · `Lido a` · `Dados de` · `Estudo` · `Endereço` · `Atribuído a` | `Source` · `Document` · `Edition` · `Where in the document` · `Read on` · `Data for` · `Study` · `Address` · `Credited to` | `Endereço` is printed as a raw URL, not a titled link |
| 6 | Estado | `Proveniência completa: …` or `O que falta nesta linha` | — | 120 complete / 12 with debt |
| 7 | Exits | `Voltar ao livro-razão` · `Como isto é feito` (→ `/metodo#livro-razao`) | — | **no correction link, no `mailto`, on any of the 132 row pages** |

### 1.4 What is missing or confusing for a non-expert — measured, not asserted

| Finding | Measurement |
|---|---|
| **The seal is not on every value on the front page.** | Front page: 38 `data-claim` tags, **32 distinct claims, only 14 with a seal**. 18 distinct claims unsealed: all 8 `distancia-*` values in the Leitura breve, the masthead counts (`estudos-publicados`, `edicoes-publicadas`, `estudos-evora-publicados`), all 4 CAOP counts, `municipios-com/sem-estudo-aprofundado`, `pib-pc-alentejo-2000`. This is the pre-Évora front page; IDENTIDADE §5 («Onde aparece um valor, aparece o selo. Sem excepção de página») is not met there. |
| **Where a seal exists in a Leitura breve on the front page, it points to the parent, not the value.** | `<span data-claim="distancia-portugal-ue27-2024">18</span>` sits beside `<a class="src-chip" href="/livro-razao/pib-pc-portugal-2024">`. Verified in markup for all 6 brief chips. |
| **The Évora page does meet the rule.** | 91 `data-claim` tags, 91 seals, 60 distinct claims, 60 distinct ledger hrefs. 100% coverage. |
| **Both seal states are rendered.** | Reading page: 6 `class="src-chip"` (filled) + 3 `class="src-chip is-unverified"` (dashed). Both states exist side by side, as IDENTIDADE §5.2 requires. |
| **The words «Linha do livro-razão:» are invisible.** | They live in `<span class="vh">`; CSS: `.vh{clip:rect(0 0 0 0);…position:absolute;overflow:hidden}`. A sighted reader sees only a study title and must infer it is a door. |
| **The locator names files nobody has.** | 58 of 132 rows carry `document.locator`. Of those, **28 name an internal artefact**: `raw/ine_data_populacao_evora.json → Dados["2025"], geocod 1C40705`; `dgal_divida_2024.pdf, linha de Évora, coluna (5)`; `socio_series.json → series.registered_unemployment.values['2013']`; `cm_lists, list='PCP-PEV'`; `executive_2025.seats['PCP-PEV (CDU)']`; `mandates['2021-2025'] → Carlos Manuel Rodrigues Pinto de Sá`; `final_recipients, NIF 504828576`; `total_mandates`. None of these strings is reachable from the address printed beside them. |
| **The excerpt is often not a sentence.** | `valor 58567` (JSON snippet). `ÉVORA ÉVORA 77 764 656 55 559 123 877 561 0 54 681 562` (raw table row; the claim is the 5th number, knowable only from the locator). `… Quadro 14 … Despesas Correntes 77` (truncated mid-number). |
| **An API URL is presented as «Documento».** | 57 of 132 rows have an API-JSON address; the row page labels it `Documento` + `Endereço` identically to a PDF. `/livro-razao/divida-publica-2025` prints `Documento: General government gross debt (EDP concept)…`, `Edição: tipsgo10`. |
| **There is no `#page=` anywhere in the ledger.** | `grep -ro "#page=" ledger/claims/ | wc -l` → **0**. The 970 occurrences in `src/` + `dist/` are all inside `/documento/` pages (§2). |
| **No row records an independent re-check.** | The only field is `access_date` («Lido a»). There is no second-reader field, no re-verification date, on any of the 132 rows. |
| **29 ledgered numbers appear on no content page.** | Rows with a public page whose value is shown nowhere but the ledger index. Matches the tracked "29 uncited claims" baseline. Full list in §1.7. |
| **307 of 308 municipalities have no page.** | `/municipios` → **404**. `/municipios/lisboa` → **404**. `/municipios/evora` → 200. The only route in is the lit dot on the front-page map. |

### 1.5 What the reader actually receives when they click the address

All 61 distinct `source_url` values in the ledger requested live, 2026-08-15, `curl -L --max-time 30`.

| Result | n | Detail |
|---|---|---|
| HTTP 200 | 58 | median payload **5.7 KB**; 2 payloads > 5 MB |
| HTTP 403 | 1 | `https://geo2.dgterritorio.gov.pt/caop/` — **4 rows** (`municipios-{portugal,continente,acores,madeira}-caop-2025`) |
| HTTP 404 | 1 | `dados.gov.pt/…/listagem-de-entidades-prr-20260803.xlsx` — **5 rows** (all PRR) |
| HTTP 429 → then timeouts | 1 | `ine.pt/ine/json_indicador/…varcd=0014580` — 1 row. See caveat below. |

Largest payloads a reader is handed with no page pin:

| Size | Type | Document | Rows behind it |
|---|---|---|---|
| 16.34 MB | PDF | `PRESTACAO_CONTAS_2025.pdf` | 11 |
| 6.21 MB | PDF | `2_Relatorio_Gestao_2021.pdf` | 4 |
| 4.70 MB | PDF | `Relatorio_Gestao_2015.pdf` | 1 |
| 2.69 MB | PDF | `2.Relatorio_de_Gestão_2017.pdf` | 1 |
| 0.91 MB | PDF | DGAL `?schema=…&content_id=…` | 2 |

*Caveat, stated plainly:* the INE endpoint served my **first** request normally (`0012918`, 200, 37,628 B), then returned 429 on the parallel probe, then timed out on three serial retries (30 s, 40 s, 45 s, including one with a browser user-agent). I cannot distinguish INE rate-limiting my own probing from a reader-facing block. **Treat the INE line as unmeasured**, not as a defect. The 403 and 404 were single, first-attempt results and are reproducible.

### 1.6 The contrast the site already contains

`/estudos/<slug>/documento` serves the ResearchHub-built HTML edition byte-for-byte under a banner. Those documents carry the receipts layer, and it is live.

| Path | 1 click on a number gives you… |
|---|---|
| `/municipios/evora` → `/livro-razao/<id>` → address | value, unit, house-transcribed excerpt, source, document title, edition, locator, read date, study, a raw URL. Then: a whole PDF/JSON. |
| `/estudos/evora-quinze-anos-cinco-mandatos/documento` → click the number in the prose | popover with: value as the ledger records it, **verbatim excerpt**, document **+ page number**, «Abrir a fonte» → **`…2_Relatorio_Gestao_2021.pdf#page=30`**, credited-to, how it was computed, ledger note, marker meanings, fetch timestamp, «Está a ler o texto da CÓPIA FIXADA (sha256 be0c8f8228552a27), não do site em direto.», the other rows sharing the value — and, for 216 of 1,080 receipts, **a cropped WebP image of the actual printed line**, captioned «{doc}, página {n} — recorte do PDF fixado». |

### 1.7 All 132 ledger rows by source class

Exclusive classification, derived from `source`, `source_url` and `derivation` on the 132 YAML files at `HEAD`.

| Class | n | `document.locator` | real `excerpt` | `[a verificar]` excerpt | `access_date` | `check` |
|---|---:|---:|---:|---:|---:|---:|
| **API-JSON** | 57 | 18 | 57 | 0 | 57 | 0 |
| **PDF document** | 23 | 23 | 23 | 0 | 23 | 0 |
| **Derived** (no source; parents carry it) | 18 | — | — | — | — | 18 |
| **HTML page** | 13 | 13 | 13 | 0 | 13 | 0 |
| **Register-sum** (no sentence to transcribe) | 7 | 0 | 0 | 7 | 7 | 1 |
| **House-count** (the site is the source) | 5 | 0 | 0 | 0 | 5 | 4 |
| **Address not yet known** (`source_url: "[a verificar]"`) | 5 | 0 | 0 | 5 | 1 | 0 |
| **Total** | **132** | **58** | **97** | **12** | **106** | **23** |

Provenance debt = the last two classes plus the register-sums = **12 rows**, exactly the tracked figure.
Register-sums: `evora-prr-{aprovado,pago,vencido-aprovado}-2026` (sums over the PRR entity register) and `municipios-{portugal,continente,acores,madeira}-caop-2025` (counts over CAOP files).
Address-not-yet-known: `agua-nao-faturada-portugal-2024`, `avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`, `saldo-natural-portugal-2025`.

**What «instant confirmation» would mean per class, and what exists today.**

| Class | Instant confirmation would be | What the site has today |
|---|---|---|
| **PDF document** (23) | A crop of the printed line + a `#page=N` link straight to that page. | Whole-PDF URL (up to 16.34 MB), no page pin, a locator naming a filename absent from the URL, and a house-transcribed excerpt — one of which is truncated mid-number. **The crop and the `#page=` already exist in the engine and on `/documento` pages; neither reaches the row page.** |
| **HTML page** (13) | Deep link to the anchor/section + the quoted sentence. | Page URL + transcribed excerpt. No anchor. Best-served class today. |
| **API-JSON** (57) | The raw response snippet shown inline, next to a link to the human-readable page for the same series, plus the exact query. | The raw API URL only (median 5.7 KB of JSON), labelled `Documento` and `Edição: tipsgo10`. 39 of 57 have no locator at all. No human page link exists on any row. |
| **Spreadsheet** (4, inside the 57/23 counts by URL type — see note) | Hosted copy of the file + the sheet/row/column shown + the computation. | The vendor URL. For PRR it is a dated snapshot URL that now **404s**. |
| **Register-sum** (7) | The hosted data file + the shown arithmetic over it (which rows summed, which column). | `excerpt: [a verificar]` + the honest gloss «Não há frase para transcrever». One of the seven (`municipios-portugal-caop-2025`) shows arithmetic; the other six show none. The Évora reading page says it in words: «Estes dois valores são somas sobre o registo público inteiro… Não há nenhuma frase para transcrever… Inventar uma frase seria pior do que mostrar a falta.» |
| **Derived** (18) | The arithmetic shown, the `check` expression shown, and each parent one click away. | **This is the only class where the site is already complete.** 18/18 carry `derivation`, `derivation_en` and an executable `check` re-evaluated at every build; parents are links. |
| **House-count** (5) | The count shown, the definition shown, and the count re-run at build. | Complete: `check: correcoes_publicadas`, plus the gloss «Esta linha não cita nenhuma frase porque não há nenhuma para citar». |

*Note on spreadsheet:* by URL extension there are 4 `.xlsx`/`.csv` rows outside the register-sum class and 5 more inside it. The table above classifies by function, not extension.

---

## Part 2 — Receipts: what the engine has, and what crossing them needs

All VERIFIED by reading `core/receipts.py` (662 lines), `core/pdfproof.py` (550 lines), `publisher/README.md`, the built HTML editions, and the live site.

### 2.1 What a receipt contains

Built by `_payload()` in `core/receipts.py`, keyed by claim id into a `<script type="application/json" id="rcpt-data">` block.

| Field | Type | Meaning (from the code) | Present in the live Évora set |
|---|---|---|---|
| `id` | str | ledger claim id | 521/521 |
| `value` | str | «Valor tal como o ledger o regista» | 521/521 |
| `excerpt` | str | «O que a fonte diz, verbatim» | 521/521 |
| `doc` | str | PDF filename, or `pdftotext of <key>`, or URL host | 521/521 |
| `url` | str | `source_url`, **with `#page=N` appended when a page is known and the URL is a PDF** | 521/521 |
| `host` | str | hostname | 521/521 |
| `fetched` | str | `fetched_at` — «Recolhido em» | 521/521 |
| `type` | str | `source_type` | 521/521 |
| `credited` | str | «Atribuído a» | 520/521 |
| `page` | int | page parsed from the excerpt | 228/521 |
| `page_kind` | str | `"pdf"` or `"printed"` | 228/521 (172 pdf, 56 printed) |
| `sha` | str | sha256 prefix of the **pinned copy** | 207/521 |
| `derivation` | str | «Como foi calculado» | 197/521 |
| `note` | str | «Nota do ledger sobre esta linha» | 146/521 |
| `markers` | list `{glyph, meaning}` | e.g. `†` = «recuperado de uma digitalização degradada…» | 48/521 |
| `img` | str | `data:image/webp;base64,…` — the crop | **60/521** |
| `img_doc`, `img_page` | str, int | which PDF and page the crop came from | 60/521 |

The trigger in the prose is `<span class="rcpt" tabindex="0" role="button" aria-haspopup="dialog" data-r="<id>" [data-o=…] [data-k=…] [data-snip="1"]>`.

### 2.2 How crops are produced

`core/pdfproof.py`. Contract in its own words: *"The contract is refusal, not effort… no fuzzy matcher here, no similarity threshold, and no 'closest line' fallback — only exact substring matching."*

| Step | Mechanism |
|---|---|
| Which rows qualify | Curated per vertical, capped at **60**. Row must pin a PDF **and** a page **and** a quoted line (`Pin.snippetable`), quote ≥ `MIN_QUOTE_CHARS = 24` after tightening, and contain a real figure (`_ANCHOR_RE`). |
| Page pinning | `_PAGE_RE = r"\b(PDF|printed)?\s*p\.\s?(\d+)\b"`; searched at offsets `_PDF_OFFSETS = (0,1,-1,2,-2,3,-3,4,-4)`, printed pages `range(0,15) + range(-1,-6,-1)`. |
| Locating the line | `pdftotext -bbox` word boxes, re-sorted into reading order, joined into `pg.stream`; the tightened quote located by **exact substring**, accepted only if unique on the page and ≤ `MAX_LINES = 3`. |
| Rendering | `pdftoppm` at `RENDER_DPI = 200` over the bbox + `MARGIN_PT 6.0` / `LEFT_PAD_PT 10.0`; Pillow downscales to `MAX_WIDTH_PX = 1000`; WebP at `WEBP_QUALITY = 72`, `method=6`; refused above `MAX_IMAGE_BYTES = 40_000`. |
| sha256 | **Neither module computes a hash.** `hashlib` is not imported in either. `_SHA_RE = r"sha256\s+([0-9a-f]{6,})"` extracts an already-recorded prefix from the ledger excerpt; it identifies the **pinned PDF**, not the crop. No hash of a crop exists anywhere. |
| Refusals (all recorded with a reason) | `"row does not pin both a quote and a page"`, `"quoted line too short to be evidence ({n} chars)"`, `"quoted line carries no figure to anchor a match"`, `"quoted line is not unique on the page — refused as ambiguous"`, `"quoted line spreads over more than 3 lines of the page"`, `"quoted line not found verbatim on the pinned page or its neighbours"`, `"pinned PDF not in the repository"`, `"crop is {n:,} bytes, over the {budget:,}-byte budget"`. |

### 2.3 Gate-invisibility, proved

Docstring: *"The receipts are invisible to every gate. All receipt content rides in element attributes and in a `<script type=\"application/json\">` block; the popover is built by the browser at runtime and exists in no static file."*

`assert_invisible(plain_doc, receipt_doc)` runs on every build **before** the file is written, and raises `InvariantError` — *"A receipt build that would have moved a gate. The build refuses to write."* — if any of three views differ: the extracted number stream, the whitespace-collapsed prose view, the tightened assertions view. `assert_matches_reconcile` separately proves the receipted span set equals `core.reconcile`'s matched set.

**Where it is enforced:** inside each vertical's `Technical Source/make_html.py`, not in `core/gate.py` (`grep -n "receipts\|pdfproof" core/gate.py` → no matches). The site's own `scripts/gate-html.mjs` exempts the document body: *«`/estudos/<slug>/documento` não é uma página deste sítio: é uma obra JÁ publicada… O corpo do documento está dispensado do varrimento porque é obra citada.»* — while still checking exactly one banner, self-containment, and byte-for-byte reconstruction of origin + banner.

### 2.4 Where the assets live, and how big the Évora set is

There are **no crop image files on disk anywhere in ResearchHub** (`find … -iname "*.webp" -o -iname "*.png" …` over `content/` → empty, with a known-positive control proving the command works). Crops live as base64 inside JSON and inside the built HTML.

| Location | Crops | Size |
|---|---|---|
| `content/07 Évora Municipal Accounts/Technical Source/snippets.json` | 48 made / 52 curated / 4 skipped | 802,193 B |
| `content/08 Évora Mandates/Technical Source/snippets.json` | 60 made (cap hit) / 144 curated / 84 skipped | 457,097 B |
| `content/09 Évora Pelouros/Technical Source/snippets.json` | 60 made (cap hit) / 245 curated / 185 skipped | 426,063 B |
| **Engine total** | **168 crops** | **~1.61 MB of JSON** |
| **Already live on the site**, inside `/estudos/*/documento` | **216 crops** across 4 pages (PT+EN) | **2.28 MB of base64** |

Live per-page (measured in the build and confirmed live by byte size):

| Page | `span.rcpt` triggers | receipts | crops | base64 payload |
|---|---:|---:|---:|---:|
| `/estudos/evora-quinze-anos-cinco-mandatos/documento` | 682 | 521 | 60 | 420 KiB |
| `/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/documento` | 297 | 253 | 60 | 384 KiB |
| `/estudos/evora-orcamentado-pago-devido-2025/documento` | 194 | 153 | 48 | 765 KiB |
| `/en/studies/evora-orcamentado-pago-devido-2025/document` | 194 | 153 | 48 | 765 KiB |
| The other 11 `/documento` pages | 0 | 0 | 0 | — |

Sample crop dimensions (decoded, not written to disk): `amortizacoes-2025` 1000×116 px / 8,896 B; `clc24-contra` 1000×128 px / 14,082 B; `act-2015-0-alunos` 1000×112 px / 9,906 B. All exactly `MAX_WIDTH_PX = 1000` wide.

`content/09` holds no PDFs of its own — its `make_snippets.py` resolves against `08/pdfs` then `07/pdfs`. `content/04`, `05`, `06` have no `make_snippets.py` and no `snippets.json` at all, which is why `/estudos/evora-prometido-pago-auditado-2026/documento` (the 04 vertical) has zero receipts.

### 2.5 What crossing the boundary would need

The rule, verbatim from `publisher/README.md`: *«O que atravessa a fronteira é conteúdo estruturado, linhas de livro-razão, recursos e um manifesto. **Nunca saída renderizada.** Uma página construída aqui e servida lá seria o sítio a garantir uma coisa que nunca conferiu.»*

**Today, receipts do not cross via `publisher/`.** `grep -rniE "receipt|snippet|crop|rcpt" publisher/` → no matches; `ledger/cruzamentos/evora.json` contains none.
**They have already crossed via `studies-src/`** — the whole-document path, git-tracked, hash-recorded (`sha256_raw`, `sha256_normalized`, `bytes_runtime_removed`), and exempted from the digit gate as cited work. That is not a contradiction of the rule so much as a second door that the rule does not describe.

To put a crop on a **row page** (the site's own surface, gated as its own), the crossing needs:

| What must cross | Form | Exists today? |
|---|---|---|
| The crop bytes | WebP, ≤ 40,000 B each, as a hosted asset or a data URI | Yes, in `snippets.json` — but only for the 168 curated engine rows, and the site's 70 crossed Évora rows are not the same set |
| A manifest row per crop | `claim_id`, `img_doc`, `img_page`, `bytes`, and the sha256 of the **pinned PDF** | `img_doc`/`img_page`/`sha` exist; **a sha256 of the crop itself does not exist and would have to be added** for the site to verify what it received |
| The page-pinned URL | `source_url` + `#page=N` | Exists in the receipt payload; **absent from every one of the 132 ledger rows** |
| A ledger field to hold it | e.g. `document.page` (int) and `document.crop` | **Does not exist.** `ledger/README.md` rule 12 restricts `document` to exactly `title`, `edition`, `locator`. A third format extension would be needed. |
| What the row page would show | The crop under «Onde no documento», captioned `{doc}, página {n} — recorte do PDF fixado`, with `Endereço` becoming a `#page=N` link | Nothing today |
| What the gate must learn | Compare the crop's hash and caption character-for-character, as `data-linha-*` already does for every other field | Not built |

---

## Part 3 — Inventory of frame text and disclaimers

Counted over the 296 non-`documento` pages in `dist/` (148 PT + 148 EN).

### 3.1 Volume

| Page | Text blocks ≥ 30 chars | Words in them |
|---|---:|---:|
| `/metodo` | 45 | 1,065 |
| `/` (front page) | 73 | 1,116 |
| `/municipios/evora` | 189 | 2,490 |
| `/estudos/evora-prometido-pago-auditado-2026` | 38 | 656 |
| `/estudos/agua-nao-faturada` (stub) | 14 | 227 |

Inside the Évora page, the apparatus and caveat prose alone:

| Section | Words |
|---|---:|
| «Método e ressalvas» (6 named caveats) | 470 |
| «O que esta página não sabe» (9 items) | 261 |
| «Quem responde pelo quê» | 101 |
| «Como esta linha do tempo é feita» | 81 |
| «Proveniência» | 61 |
| «Encontrou um erro» | 38 |
| **Total apparatus** | **1,012** — 41% of the page's prose |

### 3.2 The frame-phrase inventory

**43 distinct frame phrases · 2,664 total occurrences · all 43 appear on more than one page.**

Every row-page count below was independently re-derived from the 132 ledger YAML files and matched: 3 rows with corrections → 129 «nunca corrigida»; 12 with debt → 120 «completa» and 12 of each debt gloss; 97 with a real excerpt; 61 with `attributed_to`; 23 with `check`; 18 derived; 5 house.

| Phrase (exact) | Occ. | Pages | Layer | Class |
|---|---:|---|---|---|
| `Portugal, medido. Cada número tem fonte.` | 296 | all, both editions (untranslated by design, §1.5) | masthead | **load-bearing** |
| `Escrito por IA, dirigido por uma pessoa.` | 296 | all, both editions | footer | **load-bearing** — the AI-authorship line |
| `Written by AI, directed by a person.` | 148 | EN only, as a second line under the PT one | footer | **load-bearing** |
| `Edição de 12.08.2026` / `Edition of 12.08.2026` | 149 / 149 | all; twice on the home page (masthead + footer) | footer + masthead | **load-bearing** (time signal) |
| `Domínio canónico: oestadodopaís.pt` / `Canonical domain: …` | 148 / 148 | all | footer | **useful once** — arguably meta |
| `Nada é apagado. Um valor que estava errado fica à vista, datado, com o motivo — e um valor que deixou de estar certo porque o que mede mudou fica registado como atualização, que não é a mesma coisa.` | 132 (+132 EN) | every row page | row page | **repeated** — the corrections policy restated on all 132 rows |
| `Esta linha nunca foi corrigida nem actualizada.` | 129 (+129 EN) | rows with no corrections | row page | **useful once** per row (an empty state, correctly drawn) |
| `Proveniência completa: todos os campos preenchidos e conferidos contra a fonte.` | 120 (+120 EN) | rows with no debt | row page | **repeated** — meta-commentary; a filled seal already says it |
| `Transcrito da fonte palavra por palavra. A construção do sítio falha se o texto desta página deixar de ser igual, carácter a carácter, ao que está guardado na linha.` | 97 (+97 EN) | rows with a real excerpt | row page | **repeated + meta-commentary** — the site describing its own gate, 194 times |
| `A quem o valor é creditado, tal como consta do documento. Quando aparece um rótulo partidário, é registo do que consta e mais nada: este sítio não ordena partidos nem compara territórios que não têm nada em comum.` | 61 (+61 EN) | rows with `attributed_to` | row page | **repeated** — the no-rankings pledge; also stated on `/metodo` and twice on the Évora page |
| `A mesma conta como expressão. É refeita a cada construção do sítio e tem de dar exactamente o valor publicado; se não der, não se constrói nada.` | 23 (+23 EN) | rows with `check` | row page | **repeated + meta-commentary** |
| `Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.` | 18 (+18 EN) | derived rows | row page | **useful once** per row |
| `Esta linha não cita nenhuma frase porque não há nenhuma para citar: o valor é uma contagem do próprio registo desta casa…` | 5 (+5 EN) | house rows | row page | **useful once** per row |
| `O excerto textual desta linha ainda não foi transcrito da fonte. Escrever aqui uma paráfrase plausível seria exactamente a fabricação que este sistema existe para impedir.` | 12 (+12 EN) | debt rows | row page | **meta-commentary** — the second clause is the site praising its own restraint |
| `Os campos assinalados não foram confirmados contra a fonte. O valor publicado não muda por isso; o que falta é a prova documental, e enquanto faltar a linha fica fora do índice dos motores de busca.` | 12 (+12 EN) | debt rows | row page | **useful once** per row (says what is missing) + a SEO detail no reader needs |
| `Alojado aqui na forma exacta em que foi publicado. A única coisa que lhe foi acrescentada é uma faixa no topo…` | 11 (+11 EN) | every study page | reading page | **repeated + meta-commentary** |
| `Este estudo ainda não tem ficheiros para descarregar. Quando tiver, aparecem aqui — com a mesma disciplina dos dados dos instrumentos…` | 11 (+11 EN) | every study page | reading page | **meta-commentary** — an empty state that explains a discipline instead of a state |
| `As descrições são reformulações do título, não resumos do conteúdo, e aguardam o director.` | 10 (+10 EN) | 9 study pages + archive index | reading page + archive | **repeated** — an internal to-do shown to the public |
| `O documento deste estudo já está alojado aqui. A página do observatório à volta dele ainda não foi escrita.` | 6 (+6 EN) | 6 stub study pages | reading page | **useful once** per stub |
| `O que se lê no documento é o estudo tal como foi publicado: não foi reescrito, resumido nem actualizado para caber aqui. O que falta é a página do observatório… Fingir esse conteúdo seria pior do que não ter nenhum.` | 6 (+6 EN) | 6 stub study pages | reading page | **meta-commentary** — the last sentence |
| `A frase abaixo é prosa da casa, e não uma citação: assenta numa frase impressa no próprio trabalho, e foi cortada onde ia mais longe do que ela. Os números são citações do livro-razão, cada um com o selo que leva à sua linha. O documento original continua alojado aqui, tal como foi publicado.` | 5 (+5 EN) | 5 written reading pages | reading page | **repeated + meta-commentary** — three claims in one note, two of them visible from the page itself |
| `Este trabalho já tem a leitura do observatório: a medida que o faz valer a pena, a frase do que concluiu, o método e as ressalvas.` | 5 (+5 EN) | 5 written reading pages | reading page | **meta-commentary** — a table of contents for a page the reader is looking at |
| `A descrição deste trabalho não é uma reformulação do título: é a frase de abertura do próprio documento, nas duas edições, sem nada acrescentado.` | 2 (+2 EN) | 1 reading page | reading page | **meta-commentary** — a rebuttal of the previous disclaimer |

### 3.3 Frame text that appears exactly once (not in the 43)

| Where | Text | Class |
|---|---|---|
| Front page, lede | «Este é um observatório de dados sobre Portugal. Mede o país e mostra de onde vem cada medida.» | **load-bearing** |
| Front page, sub-lede | «Nenhum número aparece aqui sem uma linha no livro-razão: valor tal como foi publicado, fonte, documento, data de acesso e, quando é calculado, a aritmética explicada. Um número sem essa linha não passa no build.» | **useful once** — the second sentence is meta |
| Front page, scoreboard | «Estes indicadores não são escolha nossa. São os do painel de desequilíbrios macroeconómicos e do painel social europeu…» | **load-bearing** — the selection rule |
| Front page, scoreboard | «Os campos por confirmar aparecem marcados. Nenhum foi preenchido com um valor plausível.» | **meta-commentary** |
| Front page, freshness | «Linha de base reconferida contra a fonte a 2026-08-12.» | **load-bearing** — the only time signal beyond the edition date |
| Front page, colophon | «O amarelo #E8A80C é reservado a marcas de medição e nunca é usado como texto sobre fundo claro.» · «Não faz pedidos de rede. As 308 posições estão embebidas no ficheiro.» · «Tipos: Iowan Old Style (marcas) · Avenir Next (prosa) · SF Mono (números e rótulos)…» | **meta-commentary** — three design/engineering notes on the public front page |
| `/metodo` | Whole page, 1,065 words, 6 sections: Quem faz isto · Como se escreve · O livro-razão · Correções · Atribuição causal · Limites | **load-bearing** — this is the one legitimate home for all of it |
| `/metodo` | «Dizemos isto no primeiro parágrafo porque é a pergunta certa a fazer a este site.» | **meta-commentary** |
| `/metodo` | «Corrigir em silêncio é a forma mais barata de mentir.» | **load-bearing** — the corrections door |
| `/metodo` | «Escreva aqui e o botão abre o seu programa de correio com o texto já dentro. Nada é enviado deste sítio: a mensagem sai de si, para si ficar com uma cópia.» + «Se o botão não abrir nada, o seu computador não tem programa de correio configurado…» | **load-bearing** (the mechanism) + **useful once** (the fallback) |
| `/metodo` | «[a verificar: número exato antes de publicar]» inside the confounders section | an unresolved internal note, public |
| `/municipios/evora`, apparatus | «Cada valor desta página tem uma linha no livro-razão. O selo ao lado do número é a porta para essa linha… Nenhuma data de leitura é escrita aqui: quem quiser sabê-la, abre a linha.» (61 words) | **repeated** — the same promise as the masthead, `/metodo`, and the ledger index |
| `/municipios/evora`, apparatus | «O que esta página não sabe» — 9 items, 261 words | **load-bearing** — this is the best thing on the site |
| `/municipios/evora` | «Encontrou um erro / Escreva para correcoes@oestadodopais.pt. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.» | **load-bearing** — the corrections door, in the right place |
| `/municipios/evora` | «Um partido é dono das suas decisões, não de uma curva» + «Quem responde pelo quê» (101 words) — the no-rankings pledge, stated **twice on this page**, and again on 61 row pages, and again on `/metodo` | **repeated** |
| `/livro-razao` | «O selo de proveniência junto a cada número é a porta para a sua linha. É este o índice dessas portas.» | **repeated** (4th statement of the same promise) |
| `/estudos` | «Datas de publicação e descrições ainda não foram confirmadas pelo director. As descrições são reformulações do título, não resumos do conteúdo.» | **repeated** internal to-do |
| 404 | «Não existe nada neste endereço. A ligação pode estar errada, ou a página pode ter mudado de sítio enquanto os estudos são mudados para aqui.» | **useful once**; the second clause is an internal migration note |

**There is no `/sobre` page.** `ABOUT.md` exists in the repo but is not published; the only "about" surface is `/metodo`.

### 3.4 Distinct disclaimer phrases on the Évora page and the reading pages

**`/municipios/evora`** — 15 distinct disclaimer phrases. Exact, in page order:

| # | Phrase (opening words, verbatim) | Count on page |
|---|---|---:|
| 1 | «Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: onde uma fonte não estabelece uma coisa, a página di-lo em vez de a supor.» | 1 |
| 2 | «Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas diz-lo na sua linha.» | 1 |
| 3 | «Uma frase por medida. Todos os números são citações do livro-razão.» | 1 |
| 4 | «São números do próprio município sobre si mesmo: a prestação de contas é dele.» | 1 |
| 5 | «— a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos.» | 1 |
| 6 | «A página mostra as duas: escolher uma em silêncio esconderia que a diferença existe.» | 1 (+ restated at #12) |
| 7 | «Não estabelecido. O trabalho sobre os pelouros diz que este mandato “é uma linha de um mapa, não um mapa”…» | 1 |
| 8 | «Fora do que foi lido: as capturas que sustentam a repartição de pelouros começam no mandato seguinte.» / «Fora do que foi lido.» | 2 |
| 9 | «Nenhuma decisão deste mandato atravessou para o livro-razão com valor próprio. Um campo em branco seria diferente disto: o que falta é a linha, não a decisão.» | 1 |
| 10 | «A série anual do regulador usada nesta página começa depois deste mandato.» / «…ainda não chegou a este mandato.» | 2 |
| 11 | «Cinco administrações, contadas como foram instaladas e não como foram eleitas… os índices não vão atribuídos a ninguém.» | 1 |
| 12 | «Como esta linha do tempo é feita» — heading rendered **twice consecutively** in the extracted text (once as a heading, once as a summary label) | 2 |
| 13 | The six «Método e ressalvas» caveats: «Não existe PIB municipal» · «Duas das oito medidas são o município a falar de si» · «Um ano de contas existe sem assinatura de fora» · «Duas vozes de fora, não uma» · «Nenhuma fonte publica dinheiro por pelouro» · «Um partido é dono das suas decisões, não de uma curva» · «O dinheiro do plano de recuperação é atribuído pelo registo, não pela câmara» | 7 |
| 14 | «Proveniência — Cada valor desta página tem uma linha no livro-razão…» | 1 |
| 15 | «O que esta página não sabe» — 9 items | 9 |

**Overlap measured:** «Não existe PIB municipal» appears in both #13 and #15. «A execução da receita e o prazo médio de pagamento são reportados pelo próprio município» appears at #2, #13 and #15 — **three times on one page**. «As contas do penúltimo ano… nunca foram certificadas» appears at #13 and #15. «Não existe dinheiro por pelouro» appears at #13 and #15. **Four of the nine «não sabe» items restate a «Método e ressalvas» caveat verbatim in substance.**

**Reading pages** — 8 distinct disclaimer phrases across the 11 study pages (each counted in §3.2): the house-prose note (5 pages), the observatory-reading note (5), the descriptions note (10), the hosted-document note (11), the no-downloads note (11), the stub notes ×2 (6 each), the description-rebuttal note (2). On `/estudos/evora-prometido-pago-auditado-2026` specifically, `[a verificar]` is rendered **6 times** on one page.

### 3.5 The uncertainty marker

| Marker | Occurrences | Pages | Where |
|---|---:|---:|---|
| `[a verificar]` | **182** | **54** | rows 33+33, reading 31+31, ledger-index 13+13, archive 12+12, `/metodo` 1+1, `/municipios/evora` 1+1 |
| `[descrição em preparação]` | **5** | **3** | archive 2, reading 3 — **a second marker, which IDENTIDADE §6 retired** («Substitui as quatro formulações…») |
| `[to be verified]`, `[endereço a confirmar]`, `fonte por confirmar` | **0** | 0 | correctly gone |

`class="marcador"` appears in 52 files. There is **no page dedicated to explaining the marker**; the explanation is one clause inside `/metodo`: «Um número sem linha não é publicado — fica marcado `[a verificar]`, ou é cortado.» IDENTIDADE §6 promises «Uma página que o explica.» — VERIFIED not built.

---

## Part 4 — The reader model and the two-minute test

### 4.1 Four readers

| Reader | Comes for | What stops them today (from the Part 1 walk) |
|---|---|---|
| **Citizen of a concelho** | "What are my council's numbers, and are they good or bad?" | **307 of 308 concelhos have no page**; `/municipios` is a 404. If they are in Évora, the page is genuinely good — but confirming any figure means downloading a 16 MB PDF and finding p. 119 by hand. The correction door is on the page (good). |
| **Journalist** | A quotable figure with a citable source, fast, on deadline. | The seal gives a transcribed excerpt in 1 click — this works. Then the trail breaks: no `#page=`, a locator naming an internal filename, and for 10 rows an address that 403s or 404s. Nothing on the site tells them which figures are quotable and which are still in debt except the dashed seal, which is easy to miss. No search. |
| **Researcher** | A citable, dated, re-derivable value with a stable identifier. | Best served: the 18 derived rows carry `derivation`, `derivation_en` and an executable `check`; every row has a stable id and URL; two CSV downloads exist. Missing: any series (the ledger holds point values only), no `lastmod`, no re-check date, no crop, and the "excerpt" for 57 API rows is a house-assembled string rather than a quotable source sentence. |
| **Municipal officer** | "Is what you published about us right, and how do I tell you it isn't?" | The Évora page tells them, in the right place, exactly how (`correcoes@oestadodopais.pt`, 38 words, with a promise the old value stays visible). But if they arrive on the **row page** for the figure they dispute — the most likely landing from a search — there is **no correction link at all**, on any of the 132 row pages. |

### 4.2 The two-minute test, as the site stands

| Item | Result | Observed |
|---|---|---|
| **(a) Grasp what the site is** | **PASS** | Front page, first two blocks: «Este é um observatório de dados sobre Portugal…» + «Nenhum número aparece aqui sem uma linha no livro-razão…». The footer authorship line is on all 296 pages. |
| **(b) Find your concelho and see its measures with sources** | **FAIL for 307 of 308; PASS for Évora** | `/municipios` → 404. `/municipios/lisboa` → 404. The only entry is a lit dot on the front-page SVG (which *is* a real `<a href="/municipios/evora">`, plus a second link in the caption). For Évora: 8 Relance tiles, 91 sealed values, 100% seal coverage. |
| **(c) Open a study and read the short version** | **PARTIAL** | 5 of 11 works have a written reading page (all Évora). 6 are stubs that say so honestly. The archive index shows «Publicação: [a verificar]» for 9 of 11 works. |
| **(d) See when each thing was last checked and how to correct it** | **PARTIAL — was recorded as PASS** | *When checked:* the front page shows one line for the 32-claim indicator baseline («reconferida … a 2026-08-12»); every row page shows «Lido a». **But the município page states it writes no read date at all, the reading pages show none, and no row records an independent re-check.** *How to correct:* present on `/metodo` and `/municipios/evora`; **absent from the front page, from all 11 reading pages, and from all 132 row pages.** |

Against the September review, (b) is the item that moves the test, and (d) is the item that has quietly slipped since it was last scored.

---

## Part 5 — The agenda and the time signal

### 5.1 What the site shows as its time signal, and where each comes from

| Signal | Rendered as | Source in code | Current value |
|---|---|---|---|
| Edition date | `Edição de 12.08.2026` / `Edition of 12.08.2026` | `site.config.mjs:33-36` — `EDITION = { iso:'2026-08-12', display:'12.08.2026' }`, hand-set («muda quando o director decide, não a cada build»). Consumed by `SiteFooter.astro:53` (all pages) and `Masthead.astro:57` (home only, `furniture={true}`). Also baked into both CSVs via `dados.mjs:62`. | 12.08.2026 |
| Freshness of the indicator baseline | `Linha de base reconferida contra a fonte a 2026-08-12.` | `src/data/verificacao.mjs` — a **generated** file («Escrito por ResearchHub/indicators/refresh.py a cada verificação»): `{ verificadoEm:'2026-08-12', afirmacoes:32, alarmes:0, validadeDias:45 }`. Rendered only by `HomeView.astro:22-33,71-74`. | 3 days old |
| Overdue wording | `Verificação em atraso: estes valores não são reconferidos contra a fonte desde …` / `Verification overdue: these values have not been re-checked against source since …` | `strings.mjs:70-71` PT, `:491-492` EN. Trigger: `today − verificadoEm > 45`. | not firing |
| Row access date | `Lido a` / `Read on` | `LinhaView.astro:75`, field `access_date`, gate-checked character-for-character | per row |
| Row reference date | `Dados de` / `Data for` | `LinhaView.astro`, field `reference_date` | per row |
| Correction dates | `Data` / `Date` inside «Correções» and «Atualizações» | `RegistoCorrecoes.astro` (on `/metodo#correcoes`) and `HistoricoDaLinha.astro` (on each row page) | 3 corrections, 2 updates |
| Study dates | `Publicação` / `Published`, `Última actualização` / `Last updated` | `src/data/studies.mjs`, hand-maintained. **9 of 11 works have `date: null`** → render as `[a verificar]`. `updated` is `null` on **every** edition of **every** work. | 2 real dates: 2026-08-12, 2026-08-04 |
| Build stamp | not rendered | `dist/version.json`, written by `scripts/stamp-version.mjs`; read by `npm run verify:deploy` | live: `b2196e57` |
| Sitemap `lastmod` | **does not exist** | `grep -c lastmod dist/sitemap-0.xml` → 0 | — |
| Copyright year | **does not exist** | repo-wide grep for `copyright|©` in `src/` + `site.config.mjs` → no matches (known-positive control run) | — |

**Live sitemap: 260 URLs. 0 of them are `/documento` pages** — the only surface on the site that today shows a reader the printed line.

### 5.2 What ResearchHub has that could feed a public agenda

Reported as it is, not as it should be.

| Thing | State |
|---|---|
| `core/prereg.py` | **Built, wired into `core/gate.py`, never used.** Fields: `study`, `registered`, `question`*, `answer_when`*, `inconclusive_when`*, `sub_questions[{id,question,status,note}]`, `sources.{admissible*, corroboration_only*, excluded*, must_consult[{name,host,status,note}]}`, `search_plan{angles,date_window}`*, `stopping_rule`*, `tier_a_criteria`*, `dropped[{claim,reason}]`, `amendments[{date,changed,reason}]`, `core_sha256`, `_sealed_amendments` (`*` = frozen once sealed). Stored as `content/<NN Study>/preregistration.json`. **Count on disk today: 0** (`find … -iname "preregistration*.json"` → 0 results; `grep -rln "core_sha256" --include="*.json"` → 0, with a known-positive control). By design: it refuses retroactive registration — existing studies are "registration debt", never back-filled. |
| `indicators/refresh.py` | **Five canaries, weekly.** `value` (the number moved; classifies `actualizacao` vs `correcao` by testing the old value against the stored excerpt) · `structure` (dimensions/sizes/unit labels) · `metadata` (dataset label = alarm, `updated` stamp = notice) · `existence` (series vanished/errored) · `threshold` (fingerprints the Commission's MIP scoreboard **page**, "because thresholds live in documents, not the API"). Schedule: LaunchAgent `com.nunosantos.oedp-indicadores.plist`, Monday 09:30. Writes `verificacao.mjs`. `MAX_AGE_DAYS = 45`. |
| **A source calendar** | **Does not exist.** Searched `indicators/`, `indicators/frameworks/*.md`, `indicators/convergence.md` and the whole repo for `calendar|calendário|próxima|next release|publication date|embargo|schedule` — every hit inspected; all are the English phrase "calendar year" inside Eurostat/SDG indicator names, or prose. The refresh is deliberately reactive: it polls all 32 claims and diffs, rather than knowing when a source is next due. |
| `sweeps/` | `state.json` (debt ratchet: `orphans`, `misattributions`, `undeclared`, `undeclared_assertions`, `failed_assertions`; last written 2026-08-04), `launchd.log`, and two reports (`sweep-2026-08-03.md`, `sweep-2026-08-04.md`). Monthly, 1st at 09:00, via `com.nunosantos.researchhub-sweep.plist`. **Backward-looking rot/debt detector, report-only** — "the sweep itself never acts". |
| `watch_next_events.py` | At `content/08 Évora Mandates/Technical Source/`. Watches three dated external events: **DGAL "Evolução endividamento total 2025" (expected late 2026)** — "the index falling below 100% would be the rescue era's true end"; **the Município's 2026 accounts (expected around spring 2027)** — first accounts of the new executive, with a named watch-list; **the reappearance of a 2024 accounts page** that currently does not exist. Each check first proves it can find a known-positive, else reports `DETECTOR-BROKEN` and exits 1. **Writes no file — stdout only.** One git commit (`0ec3008`, 2026-08-10), unmodified since; **not wired into either LaunchAgent**; `NEXT.md:74` lists it as a manual monthly task. No evidence it has ever run (and by design it would leave none). |
| `NEXT.md` forward items | Only two dated forward-looking entries: the `watch_next_events.py` standing watch (late 2026, spring 2027, above), and «review end of September» (the direction decision's own review point — a process date, not a publication). |
| Closest thing to real release dates | `content/06 Évora Economy/Technical Source/fetch_pt2030_evora.py:114,191` reads each PT2030 call's `calendario.dataInicio` / `dataFimAtual` to compute `is_open`. That is a **live snapshot of currently-open funding windows**, not a forward calendar of data releases — and the claim it feeds (`avisos-pt2030-abertos`, value `211`) has `source`, `document`, `source_url` and `access_date` all `[a verificar]`. |

**Summary:** ResearchHub has three dated future events, hard-coded in one unscheduled, output-less script, and nothing else. There is no agenda data structure anywhere. Everything that runs on a schedule looks backward (staleness, rot, debt), not forward.

---

## Appendix A — What could not be measured

| Item | Why |
|---|---|
| Whether the INE JSON endpoints are reachable for an ordinary reader | INE served my first request (200, 37,628 B), then returned 429 and timed out on three serial retries. I cannot separate rate-limiting of my own probing from a reader-facing block. |
| Whether `watch_next_events.py` has ever been run | It writes no artefact. Filesystem and git evidence show no run; that is not proof of none. |
| Real reader behaviour (time-on-task, whether anyone clicks a seal) | No analytics on the site; none was added. |
| Whether the 4 rows changed between `4fb8cb47` and `b2196e57` altered any rendered Évora figure | The ledger YAML was read at `HEAD`, so the ledger-derived counts are current; the `dist/`-derived Évora page text is one commit old. The diff touches `leituras.mjs` and `municipios.mjs`, so some Évora **sentences** in §1 may differ slightly from live. All §1 walk quotes were taken from **live** HTML, not `dist/`. |
| Whether the 132 EN row pages carry identical structure | 1 EN row page fetched live and confirmed; the remaining 131 were counted from `dist/`, reconciled to the ledger. |
| The site's own re-runnable corruption suite | Does not exist (recorded as an open item in the sixth-block note); all fail-tests are hand-run and reverted, so I could not re-run them. |
| `gate:identidade` | Not built — no script, no npm script. IDENTIDADE §8 promises it. This is why the 18 unsealed front-page claims are still there. |

## Appendix B — Commands behind the counts

```
curl -sS https://xn--oestadodopas-2fb.pt/{,municipios/evora,metodo,estudos,livro-razao,version.json,sitemap-0.xml}
curl -sS https://xn--oestadodopas-2fb.pt/livro-razao/<id>            # 9 row pages
curl -sS -L --max-time 30 -o /dev/null -w '%{http_code} %{content_type} %{size_download}' <source_url>   # all 61
grep -ro "#page=" ledger/claims/ | wc -l                            # 0
grep -ro "#page=" src/ dist/    | wc -l                             # 970, all in /documento
find dist -name index.html | wc -l                                  # 311 (15 are /documento)
python3  # ledger classification, seal coverage, orphan rows, frame-phrase counts
```

Every count in this brief is a count that was run. Every quoted string was copied from the live page, the built file, or the source file named beside it. Where a thing does not exist, the search that proved it is named.

---

## Part 6 — Recommendations · Claude Fable 5, in seat, 2026-08-15

Parts 1–5 were measured by an Opus agent; this part is judgment. It sets the design principle, the discipline for words, the shape of the agenda, and — first of all — the acceptance tests the redesign has to pass, so that voice and visuals are judged against something other than taste.

### 6.1 The one principle: the proof is one click, and the click shows the printed line

The measurement's headline is the design brief. The site already contains the confirmation experience it wants — the receipt: the value, the printed line cropped from the pinned PDF, `#page=N`, the fetch timestamp — but only inside the hosted documents, unadvertised. The advertised path stops at a house-transcribed string and then hands the reader a 16 MB file, a raw JSON blob, or a 403. **Unify them: the row page becomes the receipt.** Not two systems that do not meet; one page that is the proof.

The row page ("the trust page"), top to bottom, per source class:

| | What the reader sees |
|---|---|
| 1 | The value, large; one sentence in words, not labels: «Publicado por *organismo*, em *documento*, p. *N* · lido a *data* · reconferido a *data*». |
| 2 | **The proof block.** PDF (23 rows): the crop of the printed line + «Abrir na página N» (`#page=N`) + the transcribed line beneath, small. HTML (13): the quoted sentence + link to the page (anchor when one exists). API-JSON (57): the *human page* for the same series (INE indicator page, Eurostat browser) first; then «o pedido exacto» (the API URL) for whoever wants to repeat it; the field shown as «campo devolvido», never as «excerto»; a locator that names an indicator and its dimensions in words, never an internal file. Register-sum (7): the pinned data file, hosted and downloadable, + «como se calculou» (which rows, which column) + the arithmetic — and the marker leaves those rows the day the file is hosted (this is DECISIONS §2.3 limit 12, closed). Derived (18) and house (5): as today — the only classes already complete. |
| 3 | **Verificações**: «Lido a …» and «Reconferido a … por leitura independente (*caminho*)». A new field, `verifications[]` (date, path, result, by). Today's blind re-fetch is the first entry on 24 Évora rows; the weekly refresh writes entries for the 32 baseline rows; the row shows the last two. Trust made visible: not "we read it" but "someone who did not write it read it again, this way, and got the same". |
| 4 | Corrections history, as today. |
| 5 | **The correction door**, on every row page, every reading page, and the front page — the same 20-word component everywhere. Today it exists on two pages of 296. |
| 6 | This row as JSON; the ledger as a dataset (CSV/JSON) with its licence stated. |

The seal itself: the words «fonte» visible (today they are hidden with `.vh` and a sighted reader sees only a study title); a hover/tap mini-receipt (value · source · date · «ver a prova»); the front page's 18 unsealed values get seals that open **their own** row, not the parent's.

### 6.2 Address rot is a defect class, and it already fired

Nine rows link to addresses that fail today (PRR listing 404; CAOP 403 — the latter to be re-checked from a browser, it may be a bot block). Rules: (1) a source address that dies is an *event* — the row gets a typed update (`kind: actualizacao`, «endereço») with the new address, never a silent edit; (2) where the licence allows — dados.gov.pt open data, CAOP CC BY 4.0, `[verify per source]` — the **pinned snapshot is hosted** with its sha256, and the row links both the live address and the pinned copy, which is the engine's own snapshot discipline made public; (3) the monthly sweep requests every `source_url` and reports failures — report-only, a sweep item, not a gate.

### 6.3 Words: the discipline, in numbers

From **43 distinct frame phrases / 2 664 occurrences** to a load-bearing set of about a dozen. Rules:

- **Show, don't declare.** Every phrase in which the site describes its own machinery goes: «A construção do sítio falha se…» (194×), «seria exactamente a fabricação que este sistema existe para impedir» (24×), «Fingir esse conteúdo seria pior…», «Proveniência completa: …» (240× — the filled seal already says it), the reading-page note that lists the page's own sections, the «reformulações do título… aguardam o director» to-do shown to the public (20×), the domain line in the footer.
- **One home per policy.** The corrections policy once, on `/correcoes` (not on 264 row pages); the no-rankings pledge once on Sobre and once where it matters (the município page's «Quem responde pelo quê»), not on 122 row pages; the marker explained on its own small page — the promise IDENTIDADE §6 already makes and the site never built.
- **State lines stay** (they are honest empty states, drawn): «Esta linha nunca foi corrigida nem actualizada» · «Esta linha não cita nenhuma frase: o valor é calculado…» · «O que falta nesta linha: …» — each once per row, without the second clause that praises the restraint.
- **Load-bearing lines stay, once each, everywhere:** the masthead method-line; «Escrito por IA, dirigido por uma pessoa» in the footer; the correction door; the single marker with its class. The retired second marker `[descrição em preparação]` (5×) goes today.
- **The Évora page**: apparatus 1 012 words (41 % of the page) → about half: the «não sabe» list keeps only items not already said in «Método e ressalvas» (4 of 9 restate them); each caveat once, in the deepest layer that needs it; Relance and Leitura breve carry no caveat but the seal.

Target, mechanical: distinct frame phrases ≤ 12; meta-commentary 0; both counted by the future `gate:identidade` against a recorded baseline, so the number can only fall.

### 6.4 Sobre replaces Método as the door

`/sobre` · `/en/about`, one page, three depths: what this is (two paragraphs, for anyone) · who answers for it and how it is made — AI researches and writes, a person directs, how the agenda is decided, how to check a number (click the seal), how to correct one, what it will never do · Fundo: sources, the ledger, the checks, the verifier disciplines — the present Método at a third of its length. `/correcoes` becomes its own page (the register and the policy, once). `/metodo` → 301 to Sobre's deep layer: pages that have been up for any real time get redirects, not deletions (the rule of §1.29). Voice: the observatory speaks, in the third person; the two actors are named on Sobre and nowhere argued.

### 6.5 The agenda: «O que se mede agora»

`/agenda` · `/en/agenda`. Four states — **Em curso · A seguir · Concluído · Retirado** — nothing leaves silently. Each item: title; the question as it will be pre-registered (the item **is** the public face of the engine's `preregistration.json`, which is built and has zero records — the agenda gives it its first use); **porquê**, with the criterion trace: (i) which institutional framework flags it, linked to the ledger rows that show the threshold breached; (ii) which source publishes next and when — a **source calendar** the engine does not yet have (`indicators/calendar.json`, built from the sources' own release calendars where they publish one — INE and Eurostat do; DGAL, ERSAR, IEFP `[verify]`), with `watch_next_events.py`'s three dated events as its first entries and the script wired to the monthly agent; (iii) reader requests and corrections that asked for it; status and dates; a change log with kinds (entered · re-prioritised · withdrawn, each with reason). Shown as it is: «proposto pelo motor a …» / «decidido pela direção a …». Nothing enters without a criterion.

Time signal: the masthead loses «Edição de …» and gains «A medir agora: … · A seguir: …»; the freshness line stays; the sitemap gets `lastmod` from git; if a page-level date is wanted, «Última alteração publicada» from the deploy stamp — mechanical, never editorial.

### 6.6 The format extensions this needs — content-driven, the moratorium's exception

`document.page` (integer) and `document.crop` (asset + its own sha256) for the proof block; `verifications[]` for the re-check record; the «computed over a hosted data file» origin for register-sums (hosted file + arithmetic). Each is what the trust page is made of; without them the confirmation path stays "a URL to a 16 MB PDF". Each ships with its fail-tests, and the receipts cross through `publisher/` as assets + manifest, never as rendered output — the same door the boundary rule already names.

### 6.7 What the reader model demands beyond the row page

- **(b) of the two-minute test fails for 307 of 308.** A `/municipios` index with all 308 entries in an honest state — «sem página ainda», with the measures the aggregators already give for every concelho — is not optional to the identity; the empty-tile state designed today gets its first use there.
- The municipal officer's most likely landing is a **row page** from a search: the correction door must be there.
- The journalist needs to see at a glance which figures are quotable: the dashed seal has to be unmistakable, and the crop + `#page=` is what makes a figure quotable on deadline.
- The researcher needs series (the observations store crossing, still not built), `lastmod`, and row JSON.

### 6.8 Acceptance tests for the redesign — said now, judged later

1. Any number → the printed line in **≤ 1 click**, with no download above 1 MB required (crop shown; deep link offered).
2. Any page → the correction door in **0 clicks**.
3. Any row → last read date **and** last independent re-check date, visible.
4. Frame phrases: **≤ 12 distinct**, meta-commentary **0**, against a recorded baseline.
5. `/municipios` index exists with all 308 entries in an honest state.
6. `/agenda` live with at least three items, each with its criterion trace.
7. Two-minute test **4/4** (today: pass · fail · partial · partial — the decision note recorded (d) as pass; the measurement says partial, and the note is corrected).
8. `[descrição em preparação]` = 0; front page 32/32 values sealed to their own rows.
9. Zero source addresses failing, or each failure carrying its typed update and a pinned copy.

### 6.9 Sequence, unchanged, with this brief as the bar

Phase 1 voice (Sobre, agenda frame, masthead/footer lines; independent drafts, Codex as critic, Nuno chooses) → Phase 2 design explorations in Claude Design against §6.1 and §6.8 (the row page treated as the most important page on the site) → Phase 3 build: format extensions, receipts crossing, `verifications[]`, address-rot fixes and pinned copies, `/municipios` index, `/correcoes`, `/agenda` + source calendar, Sobre + redirect, the disclaimer cut, the Évora clean-up; canaried Codex review; preview; merge → Phase 4 `gate:identidade` (seal at every value; marker in its class; palette; allowlist and frame-phrase baselines) and the prose gate (quantifiers declared or refused, ported from the engine's `assertions`). Then housing, its agenda item public first.
