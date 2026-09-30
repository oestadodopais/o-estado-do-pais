## Diagnosis

**The site offers several routes without giving them distinct jobs.** Readers change pages without reliably changing the question being answered. This assessment uses the supplied snapshot, not a live browsing session. File references are under `texto/` unless stated otherwise.

There are **four competing subject classifications**: the entry pages, Temas, Domínios and Áreas de governo. The EU panels add a fifth grouping of overlapping measures; the homepage is a sixth presentation surface, reusing explanations rather than the complete card catalogue. These are not six identical inventories (`inicio.md`, `temas.md`, `dominios.md`, `areas.md`, `uniao-europeia.md` and the entry files).

The promises and deliveries are:

| Page and file | Promise → delivery |
|---|---|
| Homepage, `inicio.md` | “O que se passa” promises orientation → substantial explanations precede “Por onde começar”. The starting point arrives after the reading. |
| `o-meu-dinheiro.md` | Personal money; opening specifies prices, wages, pensions and benefits → national aggregates, also poverty and household debt. No personal assessment. |
| `o-meu-trabalho.md` | Personal work; opening specifies employment, unemployment and youth → national labour statistics, including labour costs. |
| `a-minha-casa.md` | Personal housing; opening specifies housing burden, rents and prices → national and European measures, not an individual property or household. |
| `a-escola-e-a-saude.md` | Broad public services; opening narrows this to dropout, childcare and access → selected indicators, also digital skills. Not a service directory. |
| `o-estado-e-a-economia.md` | Debt, deficit, growth and external accounts → those subjects, plus investment, companies and judicial independence. |
| “A minha terra”, `paginas/inicio.html` | Municipality, district and region → links directly to `/lugares/`. The failed `/o-meu-lugar/` request in `PAGINAS.md` does **not** establish a broken homepage link. |
| `temas.md` | A topic directory → the full card catalogue, with no introductory explanation of its relationship to other routes. |
| `dominios.md`; `paginas/dominios_economia-e-financas-publicas.html` | Subjects → another index and another reading of measures, including valuable municipal maps and explicit data gaps. |
| `areas.md`; `areas_financas.md` | Ministries → measures grouped by governmental responsibility, not reader questions. |
| `uniao-europeia.md` | Portugal in Europe → primarily institutional benchmark panels. Country comparisons are elsewhere, inside cards and series receipts. |
| `lugares.md`; `distritos_evora.md` | Geographic discovery → search, maps and municipality links; the district page offers navigation rather than a comparative reading. |
| `municipios_evora.md` | A measured portrait of Évora → current measures, study summaries, updates and a long administrative history. |
| `estudos.md` | Studies → a dated catalogue with substantive summaries. |
| `livro-razao_taxa-de-desemprego-2025.md`; `livro-razao_series_taxa-de-desemprego-mip-2025-paises.md` | Evidence for a value or country series → provenance, source requests and verification information; the series also supplies the country table. |
| `sobre.md`; `metodo.md` | Identity and method → purpose, authorship, mechanisms and admitted limitations. |
| `en.md`; `en_my-money.md` | English equivalents → the same structural repetition and personal-title mismatch. |

The repetition is literal:

- “Os preços: os combustíveis sobem mais do que o resto” and “Pobreza e desigualdade não são a mesma coisa” appear in both `inicio.md` and `o-meu-dinheiro.md`.
- “A habitação: a média engana quem arrenda” appears in `inicio.md` and `a-minha-casa.md`.
- “As contas do Estado” appears in `inicio.md` and **twice** in `o-estado-e-a-economia.md`, before the explanation and before the cards.
- The “Dívida pública” card recurs in `temas.md` and `o-estado-e-a-economia.md`; its measure also appears in the domain, Finance area and EU panel.

A search visitor can identify dates, sources, AI authorship and national comparisons. They cannot readily infer why this entry exists alongside Temas, whether its coverage is comprehensive, or where local equivalents belong.

On phones, long definitions, repeated questions and muted metadata weaken scanning. The housing card makes this particularly visible (`capturas/cartao-sobrecarga-casa-pt-390.png`). Évora’s fragmentation also occurs **within** its page: studies and updates separate the opening debt finding from its historical explanation.

## Proposals

All proposals preserve receipt addresses. Numerical statements, chart labels and derived comparisons must pass the gate using the same underlying records.

1. **Establish one subject structure.** Make Temas a short index leading to the rebuilt entry pages. Merge corresponding domain material into those destinations; retire competing domain navigation and remove government areas from ordinary browsing. Preserve unique maps, definitions and coverage gaps before redirecting old pages. This removes parallel catalogues. **Cost: medium. Risk:** orphaned evidence or lost material during migration; verify every destination and receipt link.

2. **Replace personal promises with descriptive titles.** Use “Preços, rendimentos e dívidas”, “Emprego e desemprego”, “Habitação”, “Educação e acesso à saúde”, “Economia e contas públicas”, and “Concelhos”. Give each a brief scope statement and section links. Move judicial independence into its appropriate subject destination. Remove “my” framing in English too. **Cost: small. Risk:** titles implying broader coverage than exists; retain explicit scope limits.

3. **Shorten the homepage into an orientation page.** Move subject choices and municipality search above the extended reading. Keep concise current findings linking to their full subject explanations. Remove duplicated full blocks and the large homepage map, retaining the map under Lugares. This reduces scrolling before discovery. **Cost: medium. Risk:** short findings losing qualifications; keep essential populations, dates and caveats beside them.

4. **Give cards a consistent reading order.** Show measure, value, period, population, comparison and receipt first. Put extended definitions behind a clearly labelled expansion; remove questions that merely restate the definition. Strengthen metadata contrast and source-link touch targets without changing typefaces. **Cost: medium. Risk:** hiding a qualification that changes interpretation; those qualifications must remain visible.

5. **Make each municipality a coherent destination.** Order its page: overview, comparison with other municipalities, available history, related studies, updates. Gather existing domain maps into the municipal comparison route. District pages should open that route with the district selected. Shorten study teasers and remove repeated historical narration where the linked study already supplies it. **Cost: large. Risk:** comparing incompatible years or definitions; restrict comparisons accordingly and expose missing values.

6. **Separate European comparison from institutional assessment.** Within the existing EU destination, distinguish countries from reference thresholds; remove the repeated introductory measure procession. Replace ambiguous evaluative language with precise comparisons. The heading “O trabalho: mais emprego, e mais desemprego de longa duração” needs an explicit EU comparator: its card reports a decline over time (`o-meu-trabalho.md`). **Cost: medium. Risk:** turning indicative thresholds or numerical rankings into verdicts.

## Charts

**Cards:** retain the existing fuel-price bars and housing comparison by tenure; they already explain relationships (`inicio.md`, `a-minha-casa.md`). For wages, pensions and other measures with only current and previous observations, use two labelled dots. Do not imply a longer trend. Employment, unemployment and long-term unemployment need separate panels with their populations visible (`o-meu-dinheiro.md`, `o-meu-trabalho.md`). Avoid combining differently defined wage measures into one apparent series.

**Europe:** the strip already contains country marks, not merely endpoints (`paginas/a-minha-casa.html`). Keep it as the overview; expand into a sorted, labelled dot plot using the existing country-series table. Selecting a country should preserve Portugal, the official EU average and the scale. Provide touch and keyboard selection, ties and source flags. Say highest/lowest, not automatically best/worst. Keep benchmark lines separate from averages.

**Municipalities:** use a distribution of available municipal values with the selected municipality highlighted, linked to a sortable list and map. Start with purchasing power, earnings and debt index (`municipios_evora.md`; the domain HTML). Retain selection when switching views. For Évora’s debt history, plot only recorded observations; show the legal threshold without implying political causation. Raw unemployment counts cannot become comparable unemployment rates without the required denominator.

Every mark needs traceable evidence. `metodo.md` explicitly admits that its text scan misses numbers in scripts and attributes: interactive graphics require checks of positions and displayed states too.

## Patterns elsewhere

- **PORDATA municipal portraits — memory, [verify].** A consistent place profile helps readers compare the same measures across municipalities.
- **ONS, “How the population changed where you live” — memory, [verify].** Place-led explanations connect local observations to wider geographic context.
- **Our World in Data Grapher — memory, [verify].** Chart, map and table views retain indicator context and country selection.

None was observed as an external example in this package.

## What is fine

Keep the sober identity, typefaces, Portuguese-first structure and English mirror. Preserve AI disclosure, visible sources, permanent receipts, provisional-data flags, explicit absences and correction history (`sobre.md`, `metodo.md`, both receipt files).

Keep the distinction between poverty and inequality and between housing tenures (`inicio.md`). Keep the European strip. These already give numbers useful context; the surrounding navigation and repetition prevent readers from reaching that value efficiently.