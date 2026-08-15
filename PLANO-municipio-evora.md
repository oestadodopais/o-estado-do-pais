<!-- Este ficheiro é o PLANO deste bloco de trabalho: o levantamento, o desenho
     e as decisões do revisor. Fica no repositório como registo do que se
     tencionou fazer e porquê.
     ONDE ESTE FICHEIRO E `DECISIONS.md` DISCORDAREM, GANHA `DECISIONS.md`:
     ele regista o que foi construído; este regista o que foi planeado. -->

# Plan — Évora as the site's first município page

Survey and design, read-only. Nothing in this file was built. Every figure, name,
date and quote below was read in a file whose path is cited; anything not found in
a file is written `[a verificar]`.

**Read against:** `IDENTIDADE.md` §3–§7 · `DECISIONS.md` §1.7, §1.8, §1.10, §1.19,
§1.24, §2.2, §2.3 · `ledger/README.md` · `src/lib/ledger.mjs` · `src/lib/routes.mjs`
· `src/data/studies.mjs` · ResearchHub `BRIEF.md` §8, §11, §12, §13 ·
`content/README.md` · the five Évora ledgers and their `Technical Source/`.

**Two things found in code that the prose does not say** (verified by reading, not
by name — CLAUDE.md rule 15):

1. `evaluateCheck` in `src/lib/ledger.mjs:399` **already supports `round ( expr , n )`**
   (added 2026-08-13). `ledger/README.md` §"Sintaxe de `check`" does not list it.
   This unblocks every rounded derivation below. The README should be corrected in
   the same block.
2. `source_flag` / `source_flag_note` / `source_flag_note_en` already exist as site
   fields, and the validator **requires the excerpt to end with the flag**
   (`ledger.mjs:534`). ResearchHub's `*` and `†` are *house* markers attached to the
   value, not source flags, and no RH excerpt ends with them. Consequence in §3.

---

## 1. The município page — content by depth

Route already reserved: `municipio` → `/municipios/:slug`, `/en/municipalities/:slug`
(`src/lib/routes.mjs:38`). Slug `evora`.

### 1.0 Layout — **B · Corpo e aparelho** (IDENTIDADE §3)

Body at 68ch carries the reading; the 300px apparatus column carries provenance,
caveats, ledger links, and **what the page does not know**. That last is not
decoration here: the page must say, in the margin, that no municipal GDP exists
(06 limit 1), that execution and PMP are the municipality reporting on itself
(07 limit 1), that the 2024 accounts were never certified (07), and that no source
publishes money per pelouro (09 limit 1). A page with those four disclaimers and no
apparatus column would bury them. **Not C**: C is for a page that *is* an
instrument; this page is a reading with one instrument inside it. **Not A**: A's
label column is for named prose sections, and it has nowhere to put the caveats.

The stewardship timeline is an **instrument** placed in the body column, and it
carries all three layers itself (IDENTIDADE §4 — "todo o instrumento leva as três").

### 1.1 Relance — 8 measures

Eight, not seven: `.figuras` is `repeat(auto-fit, minmax(258px, 1fr))`
(`src/styles/site.css:332`), four across at 1180px. Eight fills two rows exactly —
IDENTIDADE §7's arithmetic that closes. Six of the eight come from central
aggregators that publish for all 308, so the page type generalises.

| # | Measure | Row (RH) | Value | Ref. | Generalisable? |
|---|---|---|---|---|---|
| 1 | Resident population | `06/pop-evora-2025` | 58 567 | 2025 | **Yes** — INE, all 308 concelhos |
| 2 | Purchasing power per inhabitant (PT = 100) | `06/pc-evora-2023` | 111,47 | 2023 | **Yes** — INE, all 308 |
| 3 | Registered unemployment, end of December | `08/socio-registered-unemployment-2024` | 1 596 | 2024 | **Yes** — IEFP monthly concelho files |
| 4 | Enterprises headquartered in the concelho | `06/empresas-evora-2024` | 7 907 | 2024 | **Yes** — INE SCIE, all 308 |
| 5 | Total debt, art. 52.º (regulator's figure) | `07/dgal-divida-2024` | 54 681 562 | 2024 | **Yes** — DGAL annual file, all 308 |
| 6 | Debt index against the legal ceiling | `07/evora-indice-2024` | 105,5 | 2024 | **Yes** — computed from two DGAL columns |
| 7 | Revenue execution rate | `07/receita-exec-pct` | 61,44 | 2025 | **No** — municipal accounts only |
| 8 | Average supplier payment time (PMP) | `07/pmp-2025` | 137 | 2025 | **No** — municipal accounts only |

**Finding, verified:** measures 7 and 8 are *not* generalisable as sourced here.
Both are read from `PRESTACAO_CONTAS_2025.pdf` (the municipality's own report),
not from a central aggregator. DGAL does publish PMP nationally; **these ledgers do
not read it**, and inventing that provenance is forbidden. For the 308-fan-out these
two tiles either come from a DGAL/Portal Autárquico source fetched in a later block,
or the tile is absent for other municipalities and says so (IDENTIDADE §7).

### 1.2 Leitura breve — one sentence each, and the distance drawn

| Measure | Sentence (PT, house prose) | Rows carrying it |
|---|---|---|
| 1 | A população residente subiu de 55 711 em 2021 para 58 567 em 2025. | `pop-evora-2021` + `pop-evora-2025` |
| 2 | O poder de compra por habitante está acima da média nacional — 111,47 contra 100 — enquanto a sua região, o Alentejo Central, está em 93,86. | `pc-evora-2023` + `pc-ac-2023` |
| 3 | O desemprego registado no fim de dezembro caiu de 3 720 em 2013 para 1 596 em 2024. | `socio-registered-unemployment-2013` + `…-2024` |
| 4 | Estão sediadas no concelho 7 907 empresas. | `empresas-evora-2024` |
| 5–6 | **A distância desenhada:** a dívida total do município é 54 681 562 € contra um limite legal de 77 764 656 € — um índice de 105,5 % num teto de 150 %. | **both ends:** `dgal-divida-2024` + `dgal-limite-2024`; and `evora-indice-2024` + `divida-indice-limite` |
| 7 | **Segunda distância:** a execução da receita caiu de 96 % em 2021 para 61,44 % em 2025. | `exec-2021-pct` + `receita-exec-pct` |
| 8 | **Terceira distância:** o prazo médio de pagamento a fornecedores passou de 22 dias em 2023 para 137 dias em 2025, com 4 976 172,24 € de pagamentos em atraso. | `pmp-2023` + `pmp-2025` + `atrasos-2025` |

The yellow bar (IDENTIDADE §2 — `--yellow` marks measurement, never text) draws
distance 5–6: the debt against the ceiling. One accent, no new hue.

### 1.3 Fundo

**Method and caveats** (each traceable to a study's own opening limits, quoted in §2):
no municipal GDP exists (06); execution, PMP and arrears are the municipality
reporting on itself (07); the 2024 accounts were rejected 2–5 and never externally
certified (07); DGAL's independent series is the only outside check on debt (07);
no source publishes money per pelouro and 09's crosswalk is the document's own (09);
the PRR totals are attributed to the concelho by the register, not by the câmara (04).

**Provenance:** every value carries a `<Provenance>` seal linking to `/livro-razao/<id>`
(IDENTIDADE §5). Both seal states appear on this page and that is by construction,
not by luck: the PRR rows below cross with `excerpt: "[a verificar]"` (§3), so the
dashed seal is genuinely present beside the filled one (IDENTIDADE §5.2).

**The five studies**, each with its reading page (§2) and a one-line "what it
establishes", drawn from the study's own printed conclusions.

**The stewardship timeline — structured data.** Mandates as installed, not as
elected (08 prints the installation dates: 2013-10-18, 2017-10-20, 2021-10-15,
2025-10-31).

| Mandate | President | List | Seats | Inherited | Decided | Left |
|---|---|---|---|---|---|---|
| 2009–2013 | José Ernesto d'Oliveira; Manuel Melgão from 2013-05-01 | PS | 3 `el2009-ps-seats` | *(before the readable accounts)* | PAEL, 32 166 372,20 € `pael-total` | 82 871 522,82 € at 31-10-2013 `divida-31out2013`, restated to 95 082 509,86 € `divida-inicio-mandato-2021` |
| 2013–2017 | Carlos Pinto de Sá | CDU | 4 `el2013-pcp-pev-seats` | the same 82 871 522,82 € | saneamento financeiro loan, 32 500 000,00 € `saneamento-2016` | 69 532 414,48 € `ind-divida-total-2017`; regulator 69 826 899 € / 182,0 % `dgal-divida-2017` `evora-indice-2017` |
| 2017–2021 | Carlos Pinto de Sá | CDU | 4 `el2017-pcp-pev-seats` | 69 532 414,48 € | *(no single decision row crossed)* | 57 293 550,23 € `ind-divida-total-2021`; regulator 61 737 315 € / 141,9 % |
| 2021–2025 | Carlos Pinto de Sá | CDU (minority) | 2 `el2021-pcp-pev-seats` | 57 293 550,23 € | 22 pelouros on two names `map-20212025-pelouros` | 54 379 034,55 € `divida-total-2025`; PMP 137 `pmp-2025`; arrears 4 976 172,24 €; 2024 accounts rejected 2–5 `clc-2024-votos-favor` `clc-2024-votos-contra` |
| 2025– | Carlos Zorrinho | PS | 3 `el2025-ps-seats` | 54 379 034,55 € | 21 pelouros on three names `map-2025-pelouros` | *(in office)* |

Excess over the ceiling, as its own strip: 32 559 910 € in January 2014
`excesso-jan14` → 943 664 € in December 2019 `excesso-dez19`. The chamber has
7 seats `el2025-seats-total`; the executive installed in 2025 is PS 3, AD 2, CDU 1,
CH 1 (`exec2025-*`).

**What 08 and 09 do NOT establish — printed on the page, not omitted:**

- The interim president's **full legal name** is `[verify]` in 08's own words:
  the municipalities' association and the ministry's candidates file give two
  different full names; "Manuel Melgão" is the municipality's own form
  (`08/…Fifteen Years, Five Mandates.md:315-320`).
- **The 2009–2013 pelouro map does not exist.** 09 has one line from one vereadora's
  biography; "the president of that mandate, and every other member of it, were not
  identified" (`09/…What They Did.md:22`). The timeline's pelouro column is empty
  for that mandate and says so.
- **No per-person performance measure is possible** from public accounts (09,
  "Description, never scores").
- **No source publishes money per pelouro**; the accounts→pelouro→person join is
  09's own, declared (09 limit 1 and 2).
- **No 2024 accounts document exists** on the municipality's site, and there is no
  readable 2020 dossier (09, limit 6; 08).
- **No counterfactual exists** for the socioeconomic indices: 08 states that nothing
  it read "provides the counterfactual that would carve out any executive's share of
  them". The page therefore attributes *decisions* to named executives with party
  labels and attributes *indices* to nobody — 08's own structural rule, and the
  vault decision's "no party league tables".

### 1.4 Where every digit on the page comes from (DECISIONS §2.2)

| Digit class | Origin | Notes |
|---|---|---|
| Every measured value | **1** `data-claim` via `<Claim/>` | no exception |
| Mandate periods "2013–2017", installation dates | **3** `data-nonledger="data-de-referencia"` | already in `allowlist.yml`: "Ano ou período a que os dados se referem". A mandate period *is* the period its row's data refer to. **The allowlist does not grow.** |
| Timeline axis year ticks | **3** `data-nonledger="escala-de-instrumento"` | already in `allowlist.yml`; `ledger/README.md` already says an instrument's scale is not a claim |
| Legal article "art. 52.º", "Lei n.º 73/2013" | **4** token in `allowlist.yml` | **one addition needed**: tokens `73/2013` and `52.º`. Alternative: write them without digits, which would be worse |
| Seal labels | **3** `data-nonledger="proveniencia"` | as today |
| Timeline data island, if the instrument needs one | `data-ledger-json` with `estrutura` branch + declared `estrutura_motivo` | per §2.2's data-island rule |

Party names (`PS`, `CDU`, `PPD-PSD/CDS-PP/PPM`) and every president's name carry no
digits — no origin needed. `PCP-PEV` likewise. They are transcriptions from 08 and
09 and should be reviewed as such, not invented.

**Reviewer's call:** whether "mandate period" is honestly `data-de-referencia` or
deserves its own motive. My reading is that it is, and reusing it keeps the
allowlist from growing, which IDENTIDADE §8 names as the alarm signal.

---

## 2. Reading pages for the five studies

All five need `subject: 'evora'`. **This part has already landed while this survey
ran** — verified in the working tree on 2026-08-15, not proposed:

- `src/data/studies.mjs` carries `evora-prometido-pago-auditado-2026`,
  `subject: 'evora'`, both editions dated `2026-08-04`, which is the ResearchHub
  commit date of `49758b4c16b483c92fe56b51eb88e6913dd42930` ("Évora gains a signed
  reading…", the last commit to touch either edition file). `artifactUrl: null`.
  The description is the document's own opening sentence in both languages, declared
  as an exception to §1.7 in a comment beside it.
- The three archive counts bound to `studies.mjs` by executable `check` are updated:
  `estudos-publicados` **11**, `edicoes-publicadas` **15**,
  `estudos-evora-publicados` **5**, the last with an `actualizacao` entry dated
  2026-08-15. Without these three the build stops — §1.10 and §1.14's amarra.
- `studies-src/evora-prometido-pago-auditado-2026/{pt,en}.html` exist, with two
  `manifest.yml` lines carrying `origin: researchhub`, an `origin_ref` naming the RH
  commit, and `sha256_raw == sha256_normalized` (nothing was stripped — correct, the
  files never passed through an artifact host and `normalize-study.mjs` must not be
  run on them).

Both editions are self-contained — checked independently here: no `src=`, no
`<link>`, no `@import`, no `url(...)` to any host; the only external references are
anchors to `dados.gov.pt` and `tcontas.pt`, which `studies-src/README.md` allows.

**What remains for 04:** nothing on the entry. The reading page content below, and
its ledger rows in §3.

### Per study

| # | Study (site slug) | Headline measure | Fundo pointers |
|---|---|---|---|
| 04 | `evora-prometido-pago-auditado-2026` | `04/prr-approved-evora` — 166 639 411,36 € approved and attributed to the concelho, 83 912 476,83 € paid | Method: the audit half reads the Tribunal's **catalogue**, never the audit PDFs; the contracts half is an upper bound on a truncated window (600 of 24 436 contracts, 2026-05-08→2026-08-04); no EU figure exists below NUTS3, established by probe. Document: `Technical Source/VERIFICATION.md` |
| 06 | `evora-economia-investidores-portas-abertas-2026` | `06/vab-evora-2024` — 576 491 544 € of enterprise GVA, with `conc-vab4-evora` 21,5 % held by four firms against 2,6 % nationally | Method: **no municipal GDP exists**; enterprise GVA is not it — it misses public administration, most of the university and the hospital, and credits a firm's whole activity to its head-office concelho. Funding counts are an upper bound. The opportunity section is signed inference |
| 07 | `evora-orcamentado-pago-devido-2025` | `07/receita-exec-pct` — 61,44 % of the budget actually collected, down from 96 % in 2021 | Method: most of the document is the municipality reporting on itself; two outside voices are present (the auditor's CLC and DGAL's independent series); the national yardstick is a year behind and its full study is not public; the 2024 accounts were never certified |
| 08 | `evora-quinze-anos-cinco-mandatos` | `07/evora-indice-2014` → `07/evora-indice-2024` — the regulator's debt index falls 242,6 % → 105,5 % without a break | Method: a party owns its decisions, not a curve; decisions carry party labels with quoted lines, indices are displayed against mandate boundaries and attributed to nobody. Asterisked figures come from a later report's comparative column; daggered ones from a degraded scan |
| 09 | `evora-os-pelouros-quem-os-teve-o-que-fizeram` | `09/map-20212025-pelouros` — 22 pelouro designations carried by two people in 2021–2025 | Method: no source publishes money per pelouro; the accounts→pelouro→person join is this document's own and roughly half the lines refuse it; description, never scores; the 2009–2013 map is a stated gap |

### The one sentence each study concluded — PT and EN, house prose

Each is **house prose**, drawn from the study's own signed reading. The source
sentence is quoted so the reviewer can see the distance travelled.

**04** — source (`Évora — Prometido, Pago, Auditado 2026 (pt-PT).md`, §O que concluir
disto): *«O endereço da responsabilização, na maior parte dos casos, não são os paços
do concelho.»*
· PT: «A maior parte do dinheiro público prometido a Évora é administrado e recebido
fora da câmara — e o que está vencido pesa mais do que o que foi pago.»
· EN: "Most of the public money promised to Évora is administered and received outside
the town hall — and what is overdue weighs more than what has been paid."

**06** — source (`…Portas Abertas 2026 (pt-PT).md:44`): *«A concentração é o facto
estrutural. As quatro maiores empresas detêm 21,5% de todo o VAB empresarial do
concelho…»*
· PT: «Évora é uma cidade próspera dentro de uma região pobre, e a sua economia
empresarial está concentrada em muito poucas mãos.»
· EN: "Évora is a prosperous city inside a poor region, and its enterprise economy is
concentrated in very few hands."

**07** — source (`Évora — Orçamentado, Pago, Devido 2025 (pt-PT).md`, §O que concluir
disto): *«O orçamento é uma previsão de esperanças; a taxa de execução é o facto.»*
· PT: «O orçamento de Évora afastou-se do dinheiro que chega, e o aperto aparece nas
faturas por pagar e na fila de pagamento, não na dívida legal.»
· EN: "Évora's budget has drifted from the money that arrives, and the strain shows in
unpaid invoices and the payment queue, not in the legal debt."

**08** — source (`Évora — Quinze Anos, Cinco Mandatos (pt-PT).md`, §O que concluir
disto): *«Uma história, três capítulos… uma década a desbastar a montanha, com o
excesso sobre o teto legal a cair de €32 559 910 para nada até 2020.»*
· PT: «Quinze anos de contas mostram uma dívida herdada que demorou anos a ser
medida, uma década a ser desbastada, e um último mandato em que o desbaste parou.»
· EN: "Fifteen years of accounts show an inherited debt that took years to measure, a
decade of grinding it down, and a last term in which the grinding stalled."

**09** — source (`Évora — Os Pelouros, Quem Os Teve, O Que Fizeram (pt-PT).md`, §O
que concluir disto): *«O executivo real é mais pequeno do que o eleito.»*
· PT: «Os pelouros de Évora ficam sempre com a lista do presidente, e as contas do
município não são cortadas de maneira que permita dizer quanto gastou cada
vereador.»
· EN: "Évora's portfolios always sit with the president's own list, and the
municipality's accounts are not cut in a way that lets anyone say what each vereador
spent."

---

## 3. The crossing manifest (draft)

**Count: 67 rows** of the 1 389 in the five ledgers.

### Rules the manifest applies, uniformly

1. **`value` is as published.** Where the RH value is rounded relative to the source
   (`derivation: "printed to the nearest euro"`), the site publishes the source
   string from `alternates` or from the excerpt — `109 483 314,95`, not
   `109 483 315`. Decimal-comma conversion (`61.44` → `61,44`) is the site's own PT
   formatting rule (§1.6), not a rounding, and needs no derivation.
2. **`excerpt` is the verbatim quote only.** RH excerpts are
   `locator → “quote” — commentary`. Split at the first ` → `; the head becomes
   `document.locator`; the quoted span, with the “ ” stripped, becomes `excerpt`;
   any trailing commentary goes to `note` (not published, §1.24).
3. **Where there is no quotable sentence**, `excerpt: "[a verificar]"`. Never a
   plausible reconstruction. Those rows show the dashed seal and carry `noindex`
   until the sentence is transcribed.
4. **`unit` is Portuguese in both editions** — the known debt recorded in §1.24.
5. **`access_date`** = the date part of `fetched_at`. **`reference_date`** is supplied
   per row (RH usually carries it only in the id).
6. **`study`** = the site work id of the ledger the row came from.
7. **`attributed_to`**: proposed as an optional site field (§4) carrying only the
   *publishing organism or named holder*, never RH's full alias set.

### 3a. Relance and Leitura breve — 16 rows

| rh_study | rh_id | site_id | value (as published) | unit | source | document.title | document.edition | locator | reference_date | access_date | verbatim quote | attributed_to |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 06 | `pop-evora-2025` | `evora-populacao-2025` | 58 567 | pessoas | INE | Estimativas anuais da população residente | indicador 0012918 | `raw/ine_data_populacao_evora.json → Dados["2025"], geocod 1C40705` | 2025 | 2026-08-10 | *(none — JSON field)* `valor 58567` | INE |
| 06 | `pop-evora-2021` | `evora-populacao-2021` | 55 711 | pessoas | INE | Estimativas anuais da população residente | indicador 0012918 | `Dados["2021"]` | 2021 | 2026-08-10 | `valor 55711` | INE |
| 06 | `pc-evora-2023` | `evora-poder-de-compra-2023` | 111,47 | índice (Portugal = 100) | INE | Poder de compra per capita | indicador 0014580 | `raw/ine_data_poder_compra_evora.json → Dados["2023"]` | 2023 | 2026-08-10 | `valor 111.47` | INE |
| 06 | `pc-ac-2023` | `alentejo-central-poder-de-compra-2023` | 93,86 | índice (Portugal = 100) | INE | Poder de compra per capita | indicador 0014580 | `raw/ine_data_poder_compra_alentejo_central.json` | 2023 | 2026-08-10 | `valor 93.86` | INE |
| 08 | `socio-registered-unemployment-2024` | `evora-desemprego-registado-2024` | 1 596 | pessoas | IEFP | Estatísticas Mensais por Concelhos — SIE | dezembro 2024 | `socio_series.json → series.registered_unemployment.values['2024']` | 2024-12 | 2026-08-10 | `= 1596` | IEFP |
| 08 | `socio-registered-unemployment-2013` | `evora-desemprego-registado-2013` | 3 720 | pessoas | IEFP | Estatísticas Mensais por Concelhos — SIE | dezembro 2013 | `…values['2013']` | 2013-12 | 2026-08-10 | `= 3720` | IEFP |
| 06 | `empresas-evora-2024` | `evora-empresas-2024` | 7 907 | empresas | INE | Sistema de Contas Integradas das Empresas | indicador 0014063 | `raw/ine_data_scie_empresas_cae_evora.json → dim_3 TOT, dim_4 total` | 2024 | 2026-08-10 | `valor 7907` | INE |
| 07 | `dgal-divida-2024` | `evora-divida-dgal-2024` | 54 681 562 | euros | DGAL | Evolução do endividamento total 2024 | `dgal_divida_2024.pdf` sha256 f1d25a157b876584… | linha de Évora | 2024 | 2026-08-10 | `ÉVORA ÉVORA 77 764 656 55 559 123 877 561 0 54 681 562` | DGAL |
| 07 | `dgal-limite-2024` | `evora-limite-divida-dgal-2024` | 77 764 656 | euros | DGAL | Evolução do endividamento total 2024 | same file | linha de Évora, coluna (1) | 2024 | 2026-08-10 | *(same row, same quote)* | DGAL |
| 07 | `evora-indice-2024` | `evora-indice-de-divida-2024` | 105,5 | % (limite legal = 150) | *null — derived* | null | null | null | 2024 | null | null | — |
| 07 | `anuario-indice-permitido` / 08 `divida-indice-limite` | `indice-de-divida-limite-legal` | 150 | % | Ordem dos Contabilistas Certificados | Anuário Financeiro dos Municípios Portugueses 2024 | edição 2024 | tabela «Índice de dívida total» | 2024 | 2026-08-10 | `Índice de divida total (Índice permitido <= 150%)` | Anuário Financeiro dos Municípios Portugueses |
| 07 | `receita-exec-pct` | `evora-execucao-da-receita-2025` | 61,44 | % do orçamento | Município de Évora | Prestação de Contas 2025 | 2025 | `PRESTACAO_CONTAS_2025.pdf, p. 111` | 2025 | 2026-08-10 | `Total 109 483 314,95 67 263 297,08 61,44%` | Município de Évora |
| 07 | `exec-2021-pct` | `evora-execucao-da-receita-2021` | 96 | % do orçamento | Município de Évora | Prestação de Contas 2025 | 2025 | `…, p. 112` | 2021 | 2026-08-10 | `2024 (70%), 2023 (76%), 2022 (84%), 2021 (96%), 2020 (84%), 2019 (85%) e 2018 (86%).` | Município de Évora |
| 07 | `pmp-2025` | `evora-prazo-medio-de-pagamento-2025` | 137 | dias | Município de Évora | Prestação de Contas 2025 | 2025 | `…, p. 141` | 2025 | 2026-08-10 | `o PMP do Município de Évora é de 137 dias, mais 33 dias que no ano anterior.` | Município de Évora |
| 07 | `pmp-2023` | `evora-prazo-medio-de-pagamento-2023` | 22 | dias | Município de Évora | Prestação de Contas 2025 | 2025 | `…, p. 141, Quadro 33` | 2023 | 2026-08-10 | `2022 2023 2024 2025 69 22 104 137` | Município de Évora |
| 07 | `atrasos-2025` | `evora-pagamentos-em-atraso-2025` | 4 976 172,24 | euros | Município de Évora | Prestação de Contas 2025 | 2025 | `…, p. 141` | 2025 | 2026-08-10 | `encerrou 2025 com pagamentos em atraso, no valor de 4.976.172,24 €.` | Município de Évora |

`evora-indice-de-divida-2024` is the one genuinely derived Relance row:

```yaml
derived_from: ["evora-divida-dgal-2024", "evora-limite-divida-dgal-2024"]
check: "round ( evora-divida-dgal-2024 / ( evora-limite-divida-dgal-2024 / 1.5 ) * 100 , 1 )"
```

Verified by hand: 54 681 562 ÷ (77 764 656 ÷ 1,5) × 100 = 105,47509… → 105,5. ✅
`derivation` and `derivation_en` translate DGAL's own definition (art. 52.º sets the
limit at 1,5× the three-year average of net current revenue).

### 3b. The 2025 accounts, for Fundo — 7 rows

| rh_id (07) | site_id | value | unit | locator (all `PRESTACAO_CONTAS_2025.pdf`) | ref. |
|---|---|---|---|---|---|
| `om-2025-corrigido` | `evora-orcamento-2025` | 109 483 314,95 | euros | p. 110 | 2025 |
| `receita-cobrada-2025` | `evora-receita-cobrada-2025` | 67 263 297,08 | euros | p. 111 | 2025 |
| `despesa-paga-2025` | `evora-despesa-paga-2025` | 65 565 049,87 | euros | p. 119 | 2025 |
| `divida-total-2025` | `evora-divida-total-2025` | 54 379 034,55 | euros | p. 139 | 2025 |
| `limite-divida-2025` | `evora-limite-divida-2025` | 82 571 687,05 | euros | p. 140 | 2025 |
| `margem-endividamento-2025` | `evora-margem-endividamento-2025` | 28 192 652,50 | euros | p. 140 | 2025 |
| `divida-total-2024` | `evora-divida-total-2024` | 54 680 635,58 | euros | p. 140, Quadro 30 | 2024 |

Plus one derived row that is worth the space because it is the page's trust signal:

| `dgal-report-residual-2024` | `evora-divergencia-municipio-dgal-2024` | 926 | euros | *derived* | 2024 |

```yaml
derived_from: ["evora-divida-dgal-2024", "evora-divida-total-2024"]
check: "round ( evora-divida-dgal-2024 - evora-divida-total-2024 , 0 )"
```
Verified: 54 681 562 − 54 680 635,58 = 926,42 → 926. ✅

### 3c. Stewardship timeline — 22 rows

| rh_study | rh_id | site_id | value | unit | source | locator | ref. |
|---|---|---|---|---|---|---|---|
| 08 | `el2009-ps-seats` | `evora-camara-mandatos-ps-2009` | 3 | lugares | SGMAI | `TERRITORY-RESULTS-LOCAL-070500-CM.json → cm_lists list='PS'` | 2009 |
| 08 | `el2013-pcp-pev-seats` | `evora-camara-mandatos-cdu-2013` | 4 | lugares | SGMAI | idem, `list='PCP - PEV'` | 2013 |
| 08 | `el2017-pcp-pev-seats` | `evora-camara-mandatos-cdu-2017` | 4 | lugares | SGMAI | idem | 2017 |
| 08 | `el2021-pcp-pev-seats` | `evora-camara-mandatos-cdu-2021` | 2 | lugares | SGMAI | idem | 2021 |
| 08 | `el2025-ps-seats` | `evora-camara-mandatos-ps-2025` | 3 | lugares | SGMAI | `territory-electionId=1-territoryId=1267-organId=4.json` | 2025 |
| 08 | `el2025-seats-total` | `evora-camara-lugares` | 7 | lugares | SGMAI | idem, `total_mandates` | 2025 |
| 08 | `exec2025-ps-seats` | `evora-executivo-2025-ps` | 3 | lugares | SGMAI | idem, `executive_2025.seats['PS']` | 2025 |
| 08 | `exec2025-ad-seats` | `evora-executivo-2025-ad` | 2 | lugares | SGMAI | idem | 2025 |
| 08 | `exec2025-cdu-seats` | `evora-executivo-2025-cdu` | 1 | lugares | SGMAI | idem | 2025 |
| 08 | `exec2025-chega-seats` | `evora-executivo-2025-chega` | 1 | lugares | SGMAI | idem | 2025 |
| 08 | `divida-31out2013` | `evora-divida-31-10-2013` | 82 871 522,82 | euros | Município de Évora | `Relatorio_Gestao_2015.pdf, p. 11` | 2013-10-31 |
| 08 | `divida-inicio-mandato-2021` | `evora-divida-inicio-mandato-reexpressa` | 95 082 509,86 | euros | Município de Évora | `2_Relatorio_Gestao_2021.pdf, p. 30` | 2013-10 |
| 08 | `pael-total` | `evora-pael-emprestimo` | 32 166 372,20 | euros | Município de Évora | `Relatorio_Gestão_2016.pdf, p. 84` | 2013 |
| 08 | `saneamento-2016` | `evora-saneamento-financeiro-2016` | 32 500 000,00 | euros | Município de Évora | `Relatorio_Gestão_2016.pdf, p. 79` | 2016 |
| 08 | `excesso-jan14` | `evora-excesso-endividamento-2014` | 32 559 910 | euros | Município de Évora | `2_Relatorio_Gestao_2021.pdf, p. 33, Quadro 7` | 2014-01 |
| 08 | `excesso-dez19` | `evora-excesso-endividamento-2019` | 943 664 | euros | Município de Évora | idem | 2019-12 |
| 08 | `ind-divida-total-2017` | `evora-divida-total-2017` | 69 532 414,48 | euros | Município de Évora | `2.Relatorio_de_Gestão_2017.pdf, p. 94` | 2017 |
| 08 | `ind-divida-total-2021` | `evora-divida-total-2021` | 57 293 550,23 | euros | Município de Évora | `2_Relatorio_Gestao_2021.pdf, p. 83, Quadro 31` | 2021 |
| 07 | `dgal-divida-2014` | `evora-divida-dgal-2014` | 77 961 663 | euros | DGAL | `dgal_divida_2014.pdf`, linha de Évora | 2014 |
| 07 | `dgal-divida-2017` | `evora-divida-dgal-2017` | 69 826 899 | euros | DGAL | `dgal_divida_2017.pdf`, linha de Évora | 2017 |
| 07 | `dgal-divida-2021` | `evora-divida-dgal-2021` | 61 737 315 | euros | DGAL | `dgal_divida_2021.pdf`, linha de Évora | 2021 |
| 07 | `clc-2024-votos-favor` / `clc-2024-votos-contra` | `evora-contas-2024-votos-favor` / `-contra` | 2 / 5 | votos | Marques, Cruz & Associados | `Municipio-Evora-CLC-2025.pdf, p. 2` | 2025-05-28 |

*(the last line is two rows — 22 in total)*

Three of the DGAL index rows follow, all derived with the same `round ( … , 1 )`
shape as §3a, `derived_from` the debt and limit columns of their own year:
`evora-indice-de-divida-2014` (242,6), `-2017` (182,0), `-2021` (141,9). **Their
limit-column parents must cross too** — `dgal-limite-2014/2017/2021` are in 07's
ledger and are named inside each index row's excerpt; the implementer should read
them out rather than take the divisor from the derivation text.

### 3d. Pelouros — 7 rows

| rh_id (09) | site_id | value | unit | excerpt source |
|---|---|---|---|---|
| `map-20212025-psa-count` | `evora-pelouros-2021-presidente` | 12 | pelouros | `Technical Source/raw/pelouros_map_v2.json → mandates['2021-2025'].members[…].excerpt` — the captured page's own «Pelouro: …» line |
| `map-20212025-varela-count` | `evora-pelouros-2021-vice-presidente` | 10 | pelouros | idem |
| `map-20212025-pelouros` | `evora-pelouros-2021-total` | 22 | pelouros | *derived*, `check: "evora-pelouros-2021-presidente + evora-pelouros-2021-vice-presidente"` ✅ 12+10=22 |
| `map-2025-zorrinho-count` | `evora-pelouros-2025-presidente` | 7 | pelouros | signed despacho «Distribuição de Pelouros», 2025-11-10 + the live page |
| `map-2025-vaqueiro-count` | `evora-pelouros-2025-vice-presidente` | 7 | pelouros | idem |
| `map-2025-carvalheira-count` | `evora-pelouros-2025-vereadora` | 7 | pelouros | idem |
| `map-2025-pelouros` | `evora-pelouros-2025-total` | 21 | pelouros | *derived*, sum of the three above ✅ 7+7+7=21 |

The per-person rows are the only ones in the whole crossing whose `excerpt` must be
**read out of an RH raw evidence file** rather than out of `ledger.json`. That file
holds a verbatim `excerpt` per member; the implementer transcribes it and the site's
gate then compares it character for character. If a member's excerpt cannot be read,
that row's excerpt is `[a verificar]` — not a reconstruction.

### 3e. Reading-page headlines — 9 rows

| rh_study | rh_id | site_id | value | unit | excerpt |
|---|---|---|---|---|---|
| 04 | `prr-approved-evora` | `evora-prr-aprovado-2026` | 166 639 411,36 | euros | `[a verificar]` — sum over the register, no quotable sentence |
| 04 | `prr-paid-evora` | `evora-prr-pago-2026` | 83 912 476,83 | euros | `[a verificar]` |
| 04 | `prr-execution-evora` | `evora-prr-execucao-2026` | 50,36 | % | *derived*, `check: "round ( evora-prr-pago-2026 / evora-prr-aprovado-2026 * 100 , 2 )"` ✅ |
| 04 | `prr-overdue-approved` | `evora-prr-vencido-aprovado-2026` | 102 711 703,85 | euros | `[a verificar]` |
| 04 | `prr-overdue-approved-share` | `evora-prr-vencido-quota-2026` | 61,64 | % | *derived* from the two above ✅ |
| 04 | `fin-uevora-contracted` | `evora-prr-universidade-contratado` | 38 596 975,81 | euros | `final_recipients, NIF 501201920 "Universidade de Évora" "contratado_neste_concelho": 38596975.81` |
| 04 | `fin-municipio-contracted` | `evora-prr-municipio-contratado` | 12 069 012,60 | euros | `final_recipients, NIF 504828576 "MUNICÍPIO DE ÉVORA" "contratado_neste_concelho": 12069012.6` |
| 06 | `vab-evora-2024` | `evora-vab-empresarial-2024` | 576 491 544 | euros | `raw/ine_data_scie_vab_cae_evora.json → Dados["2024"], dim_3 TOT, valor 576491544` |
| 06 | `conc-vab4-evora` + `conc-vab4-pt` | `evora-concentracao-vab4-2024` / `portugal-concentracao-vab4-2024` | 21,5 / 2,56 | % do VAB | `Dados["2024"], valor 21.5` / `valor 2.56` |

*(the last line is two rows — 9 in total for this block; 16 + 8 + 22 + 3 index rows
+ 3 limit parents + 7 + 9 = **67**)*

### Rows considered and excluded, with reasons

| Rows | Reason |
|---|---|
| `07/evora-rank-2024` (21.ª de 308), `07/municipios-over100-2024` (23), `07/municipios-total` (308) | Counts over DGAL's 308-row file. No quotable source sentence, and no `check` is possible because the 307 other municipalities are not ledger rows. They should cross in a later block once the site hosts the DGAL extract as a data file under the `check:dados` pattern. This removes "21st of 308" from the Leitura breve; the ceiling distance carries it instead. |
| `09/xw-*` (14 lines, 7 mapped, 3 split, 4 unmapped) | These measure **09's own declared crosswalk**, not the world. The site has no `source` that would be honest for them: crediting them to «Município de Évora» would attribute to the municipality a construction it did not make — the exact defect BRIEF §8.5's attribution gate exists to prevent. The 09 reading page states the finding in words. |
| `09/map-*-with` / `-without` | Counts of members with and without a portfolio. No quotable sentence and no arithmetic over ledger rows. The page states the same fact in words, with the per-person rows carrying the numbers. |
| Every `08` row carrying `*` or `†` (`ind-*` for 2012–2014, 2020, 2024; the whole `gop26-*` family) | The marker is a **house** marker — asterisk = read from a later report's comparative column; dagger = recovered from a degraded scan. The site's `source_flag` is for a flag the *source* writes and the validator requires the excerpt to end with it (`ledger.mjs:534`), so these cannot use it. Crossing them without the marker would drop the caveat, which is worse than not crossing. Every timeline value above was chosen from an unmarked row for exactly this reason. |
| `08/excesso-dez20` (4 948 806) | The source prints **−4 948 806**: a negative figure there is borrowing *capacity*, not excess (the row's own note says so). Publishing the positive string as "excess" would be false. The Leitura breve therefore says the excess fell to 943 664 € by December 2019 and stops there. |
| `06/estada-media-2025` (1,7 noites) | Derived from 739 187 ÷ 440 694 = 1,677…; a `round ( … , 1 )` check would work, but both parents would have to cross for one decorative figure. Deferred. |
| The remaining ~1 320 rows | Series detail, election vote counts, GOP/balancete lines, funding-door inventories. They belong to the studies' own documents, not to a municipality's first page. |

---

## 4. Format extensions the content needs

**Both were landing in the working tree while this survey ran.** Verified present on
2026-08-15: `document.locator` and `attributed_to` are in `CAMPOS` /
`CAMPOS_DO_DOCUMENTO` (`src/lib/ledger.mjs:88,103`), validated there, rendered in the
apparatus column of `LinhaView.astro:74,237`, and compared by `gate-html.mjs:352,361`
as `data-linha-*` fields. So this section is no longer a request — it is the
**content-side specification the crossing needs those fields to satisfy**, and the
one place where the content asks for something narrower than what exists.

### `document.locator` — **needed, and present**

`ledger/README.md` already carries `locator: null` under `document` with the comment
`# onde no documento — "p. 108", "Quadro 4, p. 108"`. The content confirms it: **57 of
the 67 rows** have a locator inside their RH excerpt, and without the field the
locator either disappears (the reader cannot find the line) or is welded into the
excerpt (which then fails the "verbatim quote" contract).

- **Optional.** `null` is legitimate and means "the document is the locator" — an
  API response, a one-row file.
- **Where shown:** the apparatus column of `/livro-razao/<id>`, in the `ficha`
  list, immediately after `document.edition`, label «Onde» / "Where".
- **What the gate compares:** add `'document.locator'` to the `data-linha-*` field
  table (DECISIONS §2.2 origin 6) — character-for-character, like every other field.
- **What it must not become:** a second excerpt. One short pointer: a page, a table
  number, a file name, a JSON path. Not a sentence.

### `attributed_to` — **present, and the content needs it narrower than ResearchHub's**

The stewardship spine is the reason. A value like `saneamento-2016` is attributed by
08 to «Município de Évora, PCP-PEV»; without a field, that attribution lives only in
prose and no gate holds it. But RH's `attributed_to` is an *alias set for a
scanner* — `map-20212025-psa-count` lists eight parties and two people. Copying that
onto a public row would print a party list beside a number that belongs to one
executive, which is the opposite of what the field is for.

- **Shape:** optional list of strings, `null` by default. Only the **publishing
  organism or the named holder of record**; never RH's full alias set; never a
  party unless the study attributes that specific decision to that specific
  executive with a quoted line.
- **Where shown:** apparatus column of the row page, label «Atribuído a» /
  "Attributed to".
- **What the gate compares:** `data-linha-campo="attributed_to"`, joined the same
  way `derived_from` already is.
- **Rule that must ship with it:** attribution of a *decision* to a named executive
  is a fact of record; attribution of an *index* to anyone is forbidden. That is
  08's own structural rule and the vault decision's "no party league tables".

**No third field is needed.** `source_flag`/`source_flag_note` already cover a flag
the source writes; RH's house markers are handled by exclusion (§3), not by a new
field.

---

## 5. Open questions and risks

**For the director only**

1. **The four dashed seals on the PRR headline.** `evora-prr-aprovado-2026` and its
   three siblings cross with `excerpt: "[a verificar]"`, so their row pages are
   `noindex` and the seals are dashed — on the study 04 headline. Honest, and
   IDENTIDADE §5.2 actually requires both seal states to exist. Accept, or hold 04's
   headline back until someone transcribes a sentence from the register?
2. **Whether "mandate period" is `data-de-referencia`.** My reading is yes and the
   allowlist does not grow. If the reviewer disagrees, one new motive
   (`periodo-de-mandato`) is needed, and the moratorium's exception has to be
   invoked for it.
3. **Two tokens for the allowlist** — `73/2013` and `52.º`. The law's name cannot be
   written without digits, and it is a name, not a measurement.
4. **Relance measures 7 and 8 do not generalise as sourced.** Accepting them means
   the 308-page type has two tiles that are Évora-only until a DGAL execution/PMP
   source is fetched. The alternative is a six-tile Relance that generalises
   completely — and a broken grid (IDENTIDADE §7).

**Risks the machinery will surface**

5. **The 04 entry and its three counts are already in the tree** (§2), so this risk
   is closed — but the same amarra fires again for anything that changes the archive
   later, and `edicoes-publicadas` in particular moves by two, not one, whenever a
   ResearchHub work crosses with both editions.
6. **67 new rows almost triple the ledger** (62 → 129) and roughly double the site
   (27 pages → ~27 + 134 row pages + the município page ×2). `gate:html`'s invariant
   "N rows ⇒ N×2 row pages" will hold it honest, but build time and the
   uncited-claims warning both move. Expect the warning to name the Fundo rows that
   the first version of the page does not print.
7. **`ledger/README.md` does not document `round ( … , n )`**, which nine of these
   rows depend on. Fix the README in the same block or the next writer will not
   know the tool exists.
8. **Two rows publish 308 with different provenance** — the existing
   `municipios-portugal-caop-2025` (CAOP) and DGAL's file count. Excluding the DGAL
   one (§3) avoids the collision for now; when it crosses, the two must be visibly
   different claims, not a duplicate.
9. **09's raw evidence file is a second crossing surface.** Seven excerpts come from
   `Technical Source/raw/pelouros_map_v2.json`, not from `ledger.json`. That is still
   structured content, not rendered output, so it respects the engine/publisher
   boundary — but the boundary rule should be written into ResearchHub `BRIEF.md`
   §13 and site `DECISIONS.md` in this block, as the vault decision requires, and it
   should name raw evidence files explicitly.

**What the sources do not support, and the page must not imply**

10. No municipal GDP exists. No per-person spending measure exists. No counterfactual
    exists for any socioeconomic index. The 2009–2013 pelouro map does not exist. The
    interim president's full legal name is `[verify]` in the source. Nothing in the
    Tribunal de Contas material says what the Tribunal *concluded* — 04 reads the
    catalogue only. Each of these belongs in the apparatus column, in words.

---

## 6. Reviewer's decisions — Claude Fable 5 in seat, 2026-08-15

Read in full. Approved for implementation with the decisions and amendments below.
Nuno approved the block and delegated its judgment calls; every decision here is
reversible before the merge to `main`, and he sees the preview first.

**On the four director questions (§5)**

1. **PRR headline rows cross with `excerpt: "[a verificar]"`.** Accepted, on two
   conditions: (a) the 04 reading page says in words, in both languages, that the
   figure is a sum over the public register and no sentence exists to transcribe;
   (b) `DECISIONS.md` §2.3 gains the honest limit — the format cannot yet express
   "computed over a hosted data file"; that origin arrives with the `check:dados`
   pattern in a later block, and the four rows leave `[a verificar]` the day it does.
   The house-row door (`source: O Estado do País` + `derivation`) is **not** to be
   used for these: the data are Recuperar Portugal's, only the sum is ours — using
   that door would be the laundering `ledger/README.md` warns about.
2. **Mandate periods and installation dates → `data-nonledger="data-de-referencia"`.**
   Yes. A mandate period is the period its rows refer to; installation dates are the
   timeline's boundaries. Record in `DECISIONS.md` that the boundary dates come from
   08 (cite the rows), and that the allowlist did not grow for this.
3. **Allowlist tokens `73/2013` and `52.º`.** Yes — the name of a law, same class as
   `UE-27`; each with its written justification.
4. **Relance: eight tiles.** Yes. Tiles 7–8 carry the words "reportado pelo
   município" / "reported by the municipality" in their Leitura breve, and the
   **tile's empty state is designed now** (IDENTIDADE §7 requires it anyway) so the
   308-page type is not blocked by two Évora-only sources. Whether DGAL publishes
   PMP and execution for all municipalities is `[verify]` — a later fetch, not a
   claim to make now.

**Amendments**

5. **The debt-index `check` uses no literal 1,5.** Write it over three ledgered
   parents: `round ( evora-divida-dgal-YYYY / evora-limite-divida-dgal-YYYY *
   indice-de-divida-limite-legal , 1 )` (limit = 1,5 × revenue, so debt ÷ limit ×
   150 = index). Verified 2024: 54 681 562 ÷ 77 764 656 × 150 = 105,47… → 105,5.
   Same shape for 2014, 2017, 2021 — so the 150 row and each year's limit row cross
   and are cited.
6. **Every crossed row is cited by a page** (the município page or a reading page)
   or it does not cross — the manifest is "what the pages need", nothing more. The
   uncited-claims warning must not grow with this block.
7. **The one-sentence conclusions are house prose and must not outrun the study.**
   Each must trace to a printed sentence in that study; where it goes further, cut
   it back. Specifically 06: «uma região pobre» is not what 06 prints — the data say
   *abaixo da média nacional* (93,86 contra 100); write that. The implementer records
   the traced source sentence beside each one-liner in `DECISIONS.md`.
8. **The 2013 inherited debt is two figures, not one** — 82 871 522,82 € as reported
   at 31-10-2013 and 95 082 509,86 € as later restated. The timeline shows both,
   each with its seal, and says in words that the later report restated it. Never
   pick one silently.
9. **`attributed_to`** — as §4: publishing organism or named holder of record; a
   party only when the study attributes that decision to that executive with a
   quoted line; never on an index. Rows that cross without a defensible attribution
   leave the field absent.
10. **`ledger/README.md` documents `round ( x , n )`** in this block (documentation
    of an existing tool, not a gate change).
11. **Boundary rule wording** (being written by the groundwork agent) must name raw
    evidence files (e.g. `Technical Source/raw/pelouros_map_v2.json`) as a
    legitimate crossing surface: structured content, never rendered output.
12. **Sequence:** the pipe first (B2 — exporter + manifest + site-side acceptance
    check pinned to origin hashes; `ledger:check` green at 129 claims; row pages
    render), reviewed here; then the pages (C — município page type in layout B,
    reading pages, `data-nonledger` uses, allowlist tokens); then verification
    (blind re-fetch of the Relance values by a Sonnet agent that never saw the rows;
    context-starved cross-family review — Codex — of the branch), then the preview
    URL to Nuno, then merge on his word.

---

## 7. Pipe — as built (2026-08-15)

The pipe is built and the rows have crossed. What follows is only what differs
from §3, and why.

**70 rows crossed, not 67.** No row outside §3 was added. §3's own tables list
70 rows — block 3a has 16, 3b has 8, 3c has 23 (its last line is two rows) plus
the 3 index rows and the 3 limit parents §6.5 requires, 3d has 7, and 3e has 10
(its last line is two rows). The "= 67" line under §3e is an arithmetic slip in
the plan; nothing was cut to make it true. Site ledger: 62 → 132 claims.

**Three rows had to be created in the engine.** §3c says the limit parents
`dgal-limite-2014/2017/2021` "are in 07's ledger". Verified by reading: they are
not — only `dgal-limite-2024` existed. Without them §6.5's rule (no literal 1,5;
the index over three ledgered parents) cannot be satisfied. They were added **in
ResearchHub**, by 07's own `build_ledger.py`, machine-read from the same
hash-pinned DGAL row the debt row already quotes (`raw/dgal_divida_evora.json`,
`labelled.limite`), with the same shape as `dgal-limite-2024`. Three years and
not ten, per BRIEF §11. The engine's gate ran over the change: PASS.

**No party label crossed.** §4 wanted `saneamento-2016` to carry
«Município de Évora, PCP-PEV». §6.9 admits a party **only when the study
attributes that decision to that executive with a quoted line** — and 08's
sentences that make the link are marked *(inferência)* by 08 itself
(`Évora — Quinze Anos, Cinco Mandatos (pt-PT).md:1092, 1096`). An inference does
not belong in a field the site's gate compares character for character as
provenance. Every row crosses credited to the publishing organism; the party
stays in the timeline's structure and in prose.

**Three PRR rows carry `[a verificar]`, not four.** §5.1 says "and its three
siblings"; §3e's table marks exactly three (`prr-approved`, `prr-paid`,
`prr-overdue-approved`). The other two PRR figures are derived, so their excerpt
is `null`, which is not provenance debt. Site debt went 9 → 12.

**Ten rows are marked `pending_page: true`** — I could not see a designed place
where they would be printed, so the page builder either prints them or drops them
before the merge:

`evora-orcamento-2025`, `evora-receita-cobrada-2025`, `evora-despesa-paga-2025`,
`evora-limite-divida-2025`, `evora-margem-endividamento-2025`,
`evora-divida-total-2024`, `evora-divida-dgal-2014`,
`evora-limite-divida-dgal-2014`, `evora-limite-divida-dgal-2017`,
`evora-limite-divida-dgal-2021`.

Six of the ten are 3b's "for Fundo" rows, which §1.3 does not place; the other
four are parents of a printed derived row (the 2014 index and the
municipality/DGAL divergence), so a page that prints the derived figure should
print both ends of the arithmetic.

**No row was dropped.** Every row §3 lists crossed, plus §6.5's three limit
parents. The exclusion table of §3 is copied verbatim into the manifest's
`excluded` list, reason by reason; nothing was excluded beyond it.

**The uncited-claims warning went 29 → 99**, exactly +70. §6.6 says it must not
grow with this block — that is the page builder's obligation, and this is the
measure of it.

Where the pipe lives: `ResearchHub/publisher/` (manifest, exporter, known-positive
suite, README) and, on this side, `scripts/check-cruzamento.mjs`,
`ledger/cruzamentos/evora.json`, `DECISIONS.md` §1.32 and §1.33, and the two
README sections (`round ( x , n )`, crossed rows).

---

## 8. Pages — as built (2026-08-15)

The pages are built. What follows is only what differs from §1 and §2, and why.
`DECISIONS.md` §1.34 and §1.35 are the record; this is the short reconciliation.

**Nothing was dropped. All 70 rows are printed.** §7 left ten rows marked
`pending_page`; every one of them found an honest place. Six are the 2025
accounts block in Fundo (budget, revenue collected, expenditure paid, debt
limit, borrowing margin, and the municipality's own 2024 debt). Four are the
parents of a printed derived value — the 2014 regulator debt, and the three
DGAL limit columns of 2014, 2017 and 2021 — printed beside the index they
divide into, one line per mandate end. The `pending_page` flags were then
cleared in `ResearchHub/publisher/manifest.evora.json` and the exporter re-run:
ten rows changed, and the only change is the internal `note`, which is not
published. **The uncited-claims warning is back at 29**, its baseline.

**The Relance is eight tiles and the empty state is written, not drawn.** Évora
fills all eight, so the empty tile has no place to appear on this build. It is
coded, it has its own rule in `site.css`, and `DECISIONS.md` §1.34 names the
condition under which it will first render. Calling that "designed" would be
generous; calling it absent would be false.

**The stewardship timeline is not a seven-column table.** §1.3 drew one. A
seven-column table does not fit a 68ch body column or a telephone. It is one
block per mandate, with the same seven fields, and it carries the three layers
itself.

**Three corrections to this plan, made against the studies' own text:**

1. §1.3 wrote that DGAL's series is "the only outside check" on debt. 07 says
   the opposite in its own limits: **two** outside voices, the auditor's signed
   opinion and DGAL. The page says two.
2. §6.7 said 06 does not print «uma região pobre». It does (06 pt-PT:20). The
   reviewer's decision stands anyway — the page writes «abaixo da média
   nacional», the narrower of the two readings — but the reason given for it
   was wrong.
3. §1.3 said the 2009–2013 pelouro map "does not exist". 09's own wording is
   «uma linha de um mapa, não um mapa», and that is what the page prints.

**The `[a verificar]` count did not move.** Three PRR rows still carry it, and
the 04 reading page now says in words, in both languages, why: the figure is a
sum over the whole public register and there is no sentence to transcribe.

**Two allowlist tokens, as approved:** `73/2013` and `52.º`, each justified in
`ledger/allowlist.yml`. No `data-nonledger` motive was added — mandate periods
and installation dates use `data-de-referencia`, as §6.2 decided.

**Final counts:** 132 claims · 312 pages (was 310) · 29 uncited claims ·
12 rows of provenance debt · 260 sitemap URLs · 0 broken internal links of
5 462 checked · `npm run build` exit 0 · `npm run typecheck` exit 0.
