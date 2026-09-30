## Diagnosis

The central flaw is not lack of content. It is that the same evidence has too many competing homes.

There are **four public cataloguing systems** for national measures: the five national entry pages, `Temas`, `Domínios`, and `Áreas de governo`. The homepage and the EU panels are two further surfaces that reproduce selections, making **six places where readers encounter the same measures in different arrangements**.

The five national entry pages contain 47 cards: 17 + 7 + 6 + 4 + 13. All 47 reappear under `Temas`, alongside one additional municipal aggregate (`paginas/*.html`; `texto/temas.md`). The sampled domain repeats eight of them; `Finanças` repeats three; the EU page repeats 20. This is classification without a declared canonical page.

The homepage also copies whole editorial blocks into entries. “Os preços: os combustíveis sobem mais do que o resto” appears on the homepage and `O meu dinheiro`; “A habitação: a média engana quem arrenda” appears on the homepage and `A minha casa`; “O trabalho: mais emprego, e mais desemprego de longa duração” appears on the homepage and `O meu trabalho`; “As contas do Estado” appears on the homepage and `O Estado e a economia` (`texto/inicio.md` and the respective entry files). The headings, prose, drawings and underlying numbers repeat.

| Route | What its title and opening promise | What it delivers |
|---|---|---|
| `O meu dinheiro` | “Os preços, os salários, as pensões e os apoios.” | 17 national measures, also covering poverty, inequality, household debt and credit. It is neither personal nor limited to “money” (`texto/o-meu-dinheiro.md`). |
| `O meu trabalho` | “O emprego, o desemprego e os jovens.” | Seven national measures, including activity, the gender employment gap and labour costs (`texto/o-meu-trabalho.md`). |
| `A minha casa` | “O peso da habitação, as rendas e os preços.” | Six national measures, including construction licences. Coherent content, misleadingly personal title (`texto/a-minha-casa.md`). |
| `A escola e a saúde` | “O abandono escolar, a creche e o acesso aos cuidados.” | Only four selected indicators. The title suggests coverage of two whole systems (`texto/a-escola-e-a-saude.md`). |
| `O Estado e a economia` | Debt, deficit, growth and external accounts | 13 measures, extending into companies and judicial independence. “Perceção de independência da justiça” does not belong under the promised scope (`texto/o-estado-e-a-economia.md`). |
| `A minha terra` | “O concelho, o distrito e a região.” | Not a peer entry page: it links directly to `/lugares/`, a search, 308-name directory, map and territorial indexes. `/o-meu-lugar/` is 404, although the homepage link itself uses `/lugares/` (`PAGINAS.md`; `paginas/inicio.html`; `texto/lugares.md`). |

A search-engine visitor landing on an entry understands the subject, that AI wrote the text, and that individual values have sources. They do not learn that this is one of several alternative arrangements of the same cards, why this arrangement exists, whether the figures are national, or where the canonical topic page is. “My money” additionally suggests personal finance or personalised information.

On a phone, orientation comes too late. Five dense features precede “Por onde começar” (`capturas/depois-pais-pt-390.png`). The homepage has 2,094 words, `O meu dinheiro` 2,293, and `Temas` 5,159 (`PAGINAS.md`). Cards combine definition, interpretation, prior value, EU comparison, source, strip and methodological question in one uninterrupted column.

Municipal content has the opposite problem: fragmentation. `/lugares/` is primarily discovery; a district is mainly a map and list; the Évora page combines eight current measures, six studies, a change log and a long administrative history; domain pages hold separate 308-municipality maps and tables (`texto/lugares.md`, `texto/distritos_evora.md`, `texto/municipios_evora.md`, `paginas/dominios_economia-e-financas-publicas.html`).

## Proposals

| Rank | Change, removal and problem solved | Cost | Credibility/receipt risk |
|---|---|---:|---|
| 1 | Make `Temas` the single public catalogue, but turn it into a short index pointing to canonical topic pages. Rename the existing entries **Prices, income and living conditions**, **Employment and work**, **Housing**, **Education and health**, **Economy, companies and public finances**, and **Municipalities, districts and regions**. Move justice to a literal justice/institutions topic. Remove the 5,159-word duplicate card dump; redirect old URLs. | Medium | Low: retain card and receipt identifiers. |
| 2 | Let the homepage alone own “O que se passa”. Delete its five copied feature blocks from the topic pages; those pages should begin with a contents list and their measures. Homepage features link to the relevant measure. | Small | Low: no evidence or receipt is lost. |
| 3 | Retire `Domínios` as a reader-facing taxonomy. Merge its useful question-led explanations and municipal drawings into canonical topics. Keep `Áreas de governo` only as a compact institutional cross-index of links, without rendering cards again. Remove both from the primary footer hierarchy. | Medium | Low: classification changes, values do not. |
| 4 | Rebuild places around one cohesive municipal profile: search, current measures, “compare this measure”, studies, changes and history in that order. Bring the 308-value maps into this route; make district pages comparative rather than directories. Remove the separate “all measures” detour and duplicated study summaries. | Large | Medium: any rank or median must receive a calculated receipt and pass the same gate. |
| 5 | Compress the mobile card’s first view to name, value, period, one sentence of context, comparison drawing and visible source. Put definitions, technical questions and full provenance behind “How this is measured”. Remove repeated explanatory text from the scanning path. | Medium | Low, provided the source remains visible and expanded content remains accessible. |
| 6 | Give every topic landing page a plain scope sentence: “National figures about…”, followed by links to related places and studies. Add one search across measures, places and studies. Remove ambiguity about page purpose and the need to guess a taxonomy. | Medium | Low: search must lead to canonical pages, not create new copies. |

## Charts

Use drawings only where a relationship exists.

- For measures with a previous value and EU comparison, use a compact slope or paired-dot chart: employment, unemployment, poverty, housing burden, public debt and house prices. A solitary level should remain a card.
- For official thresholds, use a bullet chart showing the permitted band, Portugal, the previous value and, where present, the EU value. This suits debt, public balance, expenditure growth, international investment position, labour costs and house prices.
- Keep the existing European strip. It already shows all 27 countries, Portugal, the EU average and both extremes (`capturas/cartao-sobrecarga-casa-pt-390.png`). Let it expand into a sorted, labelled plot or table rather than replacing it with 27 phone-sized bars. Use the existing country-series receipt (`texto/livro-razao_series_taxa-de-desemprego-mip-2025-paises.md`).
- For municipalities, pair a 308-value choropleth with a distribution strip highlighting the selected municipality. Tapping either opens that municipality and its existing receipt. Preserve a searchable table fallback. Évora’s debt history also warrants a line chart with mandate boundaries, without implying that a mandate caused the movement.

Every plotted mark should inherit the existing receipt link. Any displayed derived rank, median or percentile needs its own calculated ledger line; otherwise do not print it.

## Patterns elsewhere

- **ONS, Explore local statistics**: recalled from memory `[verify]`. It starts with a place search and builds one local profile with national comparison, rather than splitting discovery, profile and comparison.
- **Eurostat Data Browser**: recalled from memory `[verify]`. One dataset supports filters, table and chart views with bookmarkable state; the views do not become competing editorial pages.
- **Our World in Data, Grapher**: recalled from memory `[verify]`. A chart is a reusable evidence object with chart, table, download and source views, and can be embedded in editorial narratives without creating a second dataset.

None of these observations was verified from the supplied package or by browsing.

## What is fine

Do not change the sober identity, name or typefaces. Keep the restrained colour rule, the explicit AI label, Portuguese-first English mirroring, visible source chips, public corrections and one receipt per number. The receipt pages’ source response, request, comparison, rereading dates and correction history are the site’s strongest credibility mechanism (`texto/livro-razao_taxa-de-desemprego-2025.md`; `texto/metodo.md`). The European country strip is also a sound visual idea. The redesign should expose that rigor more clearly, not dilute it.