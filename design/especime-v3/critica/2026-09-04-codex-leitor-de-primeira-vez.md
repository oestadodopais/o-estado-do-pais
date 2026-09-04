# Leitura a frio do Codex como leitor de primeira vez: as treze páginas no ar a 04.09.2026 (bloco F1.10)

*Codex `gpt-5.6-sol`, xhigh, só leitura, 00:28 a 00:42 UTC, sobre treze páginas servidas pelo sítio a 04.09 (a primeira página nas duas edições, os índices dos concelhos, dos distritos, das regiões, dos domínios, das áreas, do livro-razão e dos estudos, um distrito, uma região, um concelho e a página do domínio), com a pergunta do diretor depois de andar pelo sítio («the content keeps repeating itself … we keep doing the same thing in different ways in different pages»). Sem plantas: não é a leitura de um pacote de construção, é a leitura de um leitor. O leitor corrigiu a pergunta num ponto (são nove regiões NUTS II, não sete). As decisões do lugar de direção, pela delegação de 04.09 (§1.98), estão no brief `BRIEF-F1.10-uma-coisa-um-lugar.md` e na segunda emenda da §1.98: os 308 concelhos têm um só lugar inteiro (`/municipios`, filtrado, sem segunda lista; F1.7) e as tabelas dos mapas do domínio ficam fechadas como alternativa em texto, com cada nome a ser porta; a faixa da primeira página fica como o instrumento do primeiro ecrã e os painéis de baixo saem (F1.1b, ao contrário do que o leitor propôs, porque a faixa é o conceito do diretor para o telemóvel e a leitura breve abre do cartão); as três medidas partilhadas com o domínio não se releem na primeira página, abrem a porta ao domínio; a régua das regiões inteira só em `/regioes`, a página da região com o seu valor e uma porta «Comparar as regiões»; os estudos inteiros só em `/estudos`, a página do concelho com os títulos e uma porta filtrada; «Trabalho» no índice dos domínios visivelmente dentro do primeiro domínio; uma frase de definição na primeira página e uma frase de hierarquia em cada índice (domínio, área de governo, os quatro níveis do território); e o vocabulário fechado: «medida», «linha do livro-razão», «estudo», «domínio», «área de governo», «país, região, distrito, concelho», com «Relance» e «Leitura breve» só como as duas densidades de um cartão. O texto do leitor fica como veio.*

---

## Inventory

The regional count in the question is wrong: the served index says **“9 regiões”**, not seven, and names nine NUTS II regions plus Portugal as comparator (`paginas/regioes.html:1`).

- **The country’s 21 front-page measures.**
  - `inicio.html`: first as the headline summary **“Portugal ultrapassa 4 limiares…”**, which names only the four breaches; then as a **band of 21 cards** labelled “As medidas, uma por cartão”, with value, status, unit, date and source link; then again as two lower collections, **“Procedimento dos Desequilíbrios Macroeconómicos · 13 medidas com limiar”** and **“Painel Social Europeu · 8 medidas”**, with names, definitions, limits and source links but no textual current values (`paginas/inicio.html:1`).
  - `en-inicio.html`: the same headline, 21-card band and 13-plus-8 panels in English; only the language and `/en/...` destinations differ (`paginas/en-inicio.html:1`).
  - `dominio.html`: a competing organisation by questions: two measures in the headline, five in another card band, and **“Leitura breve”** with eleven questions, ten named measures and one explicit “Não há número público para isto”. Three of the front-page 21 recur here: dívida pública, taxa de emprego and taxa de desemprego (`paginas/dominio.html:1`).
  - `livro-razao.html`: all 21 also occur as ledger-row summaries with value, unit, source and access date (`paginas/livro-razao.html:1`).
  - Within `inicio.html`, **“Taxa de desemprego”** occurs once in each European framework under different row identifiers but with the same visible name and value (`paginas/inicio.html:1`).

- **The 308-concelho roster.**
  - `inicio.html`: 308 name-and-link items inside the results for **“Escreva o nome do concelho”**; the map itself contributes only the count “308 concelhos”, not the 308 textual names (`paginas/inicio.html:1`).
  - `en-inicio.html`: the same 308-result roster in English navigation (`paginas/en-inicio.html:1`).
  - `municipios.html`: twice: 308 name-and-link search results and a second 308-name linked list grouped under 29 district/island headings (`paginas/municipios.html:1`).
  - `dominio.html`: twice more, under “Quanto deve a minha câmara?” and “Quanto se ganha?”: each measure has a map and an expandable table headed **“Os valores, concelho a concelho”**. Each table contains 308 names, values and ledger links, but the names do not link to municipality pages (`paginas/dominio.html:1`).
  - `concelho-evora.html` displays the count 308 and a **“trocar de concelho”** door, not another full roster (`paginas/concelho-evora.html:1`).

- **The 29 districts and islands.**
  - `inicio.html`: a linked names-only list under **“Os nomes no mapa”**, divided into Continente, Madeira and Açores (`paginas/inicio.html:1`).
  - `en-inicio.html`: the equivalent 29-link list (`paginas/en-inicio.html:1`).
  - `municipios.html`: the same 29 names as linked headings for the grouped municipality roster (`paginas/municipios.html:1`).
  - `distritos.html`: the explicit names-only index under **“Os distritos e as ilhas de Portugal”** (`paginas/distritos.html:1`).
  - `distrito-evora.html` is not another 29-item index; it repeats only Évora’s 14 concelhos, once as map links and again under **“Os concelhos”** (`paginas/distrito-evora.html:1`).

- **The nine regions.**
  - `regioes.html`: **“A régua da convergência”** gives the nine region names, values and source links, both in the graphical ruler and in its textual list; every region name links to its detail page (`paginas/regioes.html:1`).
  - `regiao-alentejo.html`: copies the whole Portugal-plus-nine comparison, with the same values and sources; the current Alentejo name is plain text and the other eight are links. It additionally repeats Alentejo’s 77 in **“Relance”**, the ruler list, a card band and **“As medidas”** (`paginas/regiao-alentejo.html:1`).

- **Domains.** The only complete catalogue is the 18-item ordered list **“Por domínio”**: names, publication status and “primeira/segunda/terceira vaga”. “Economia e finanças públicas” links to the detail page; “Trabalho” links into that same page; the remaining sixteen have no destination (`paginas/dominios.html:1`). `dominio.html` is a detail page, not a second domain catalogue, although it merges Economia and Trabalho (`paginas/dominio.html:1`).

- **Areas.** The only substantive occurrence is **“Por área de governo”**: nine linked names with counts of “peças” (`paginas/areas.html:1`). Other pages contain only navigation doors to this index.

- **Studies.**
  - `estudos.html`: the complete archive of 12 study cards, each with title, synopsis, language editions and publication date or `[a verificar]` (`paginas/estudos.html:1`).
  - `concelho-evora.html`: five of those studies are copied under **“Os trabalhos sobre este concelho”**, with the same title, substantially the same synopsis and an **“Abrir a leitura”** link (`paginas/concelho-evora.html:1`).
  - The front-page **“Estudos”** link is only a door to the archive (`paginas/inicio.html:1`).

- **Ledger rows.**
  - `livro-razao.html` is the only row index: it announces **“2916 afirmações”**, renders 149 general row summaries, and sends the remaining **“2767 linhas de concelhos”** to a separate “Concelhos” collection. Each rendered summary shows value, identifier or name, unit, source and reading date (`paginas/livro-razao.html:1`).
  - `inicio.html` and `en-inicio.html` each offer the 21 measure-row doors twice, once in the band and once in the panels, plus the municipality-count row: 43 links to 22 distinct rows per edition (`paginas/inicio.html:1`; `paginas/en-inicio.html:1`).
  - `dominio.html` repeats row fields in its headline, band and question articles, including value, unit, period, reading date, verification date, publisher and document; its two municipal tables add 616 row-specific doors (`paginas/dominio.html:1`).
  - `regioes.html` has ten row doors; `regiao-alentejo.html` has seventeen appearances of twelve distinct rows across headline, band, “Relance”, comparison and “As medidas” (`paginas/regioes.html:1`; `paginas/regiao-alentejo.html:1`).
  - `concelho-evora.html` has 107 ledger links to 66 distinct rows across the headline, band, “Relance”, “Leitura breve”, “Fundo” and mandate history, plus a municipality-ledger door (`paginas/concelho-evora.html:1`).
  - `municipios.html` uses four ledger rows for its territorial counts; `distrito-evora.html` uses one for the roster; `estudos.html` uses two for the study and edition totals (`paginas/municipios.html:1`; `paginas/distrito-evora.html:1`; `paginas/estudos.html:1`).
  - `areas.html`, `distritos.html` and `dominios.html` contain no substantive ledger-row doors (`paginas/areas.html:1`; `paginas/distritos.html:1`; `paginas/dominios.html:1`).

## Paths

1. **Find my concelho and its numbers: 1 tap.** Type the name in **“Escreva o nome do concelho”**, then tap its result; that result links directly to `/municipios/{concelho}` (`paginas/inicio.html:1`). Forks:
   - **“Municípios”** → search result or grouped list → concelho: 2 taps; both index mechanisms contain the same 308 destinations (`paginas/municipios.html:1`).
   - A name under **“Os nomes no mapa”** → district page → concelho: 2 taps (`paginas/inicio.html:1`; `paginas/distrito-evora.html:1`).
   - **“Distritos”** → district index → district → concelho: 3 taps (`paginas/inicio.html:1`; `paginas/distritos.html:1`).
   - On a district page, the map link and the **“Os concelhos”** list link to the same municipality pages (`paginas/distrito-evora.html:1`).

2. **Understand one national measure and its source: 1 tap for the proof record.** Scroll to the relevant front-page panel, read its definition, then tap **“fonte”** to the exact ledger row; scrolling is not a tap (`paginas/inicio.html:1`). For “Dívida pública”, tapping its card instead opens the domain’s “Quanto deve o Estado?” article in 1 tap; tapping that article’s source makes 2 (`paginas/inicio.html:1`; `paginas/dominio.html:1`). Forks:
   - **“Painel europeu”**, the headline links “4” and “9”, and the panel’s “13” all point to `/#painel` (`paginas/inicio.html:1`).
   - Each measure has a topic/card link and a separate source link; nineteen cards jump within the front page, while dívida pública, taxa de emprego and taxa de desemprego jump to the domain page (`paginas/inicio.html:1`).
   - In the domain page, dívida pública appears in the headline, card band and “Leitura breve”; all three source doors lead to the same ledger row (`paginas/dominio.html:1`).
   - The domain index’s “Economia e finanças públicas” and “Trabalho” both lead to the same domain document, at different anchors (`paginas/dominios.html:1`).

3. **Find what studies exist: 1 tap.** Tap **“Estudos”** and arrive at the 12-study archive (`paginas/inicio.html:1`; `paginas/estudos.html:1`). The front-page header, the standalone “Estudos” door after the card band and the footer all lead to that index (`paginas/inicio.html:1`). Within the archive, a study title and its PT language badge usually lead to the same detail page (`paginas/estudos.html:1`). The Évora municipality route exposes only a duplicated five-study subset, not the full archive (`paginas/concelho-evora.html:1`).

## Missing

- **A usable defining sentence.** The front page says only **“Um observatório de Portugal.”** It does not explain that ledger-backed claims are reused in territorial views, thematic views and studies (`paginas/inicio.html:1`).

- **An organising index.** Eleven peer choices appear in the main navigation, while separate indexes say **“Os concelhos de Portugal”**, **“As regiões de Portugal”**, **“Por domínio”**, **“Por área de governo”**, **“Estudos”** and **“O livro-razão”** without stating their relationship (`paginas/inicio.html:1`; `paginas/municipios.html:1`; `paginas/regioes.html:1`; `paginas/dominios.html:1`; `paginas/areas.html:1`; `paginas/estudos.html:1`; `paginas/livro-razao.html:1`).

- **A distinction between taxonomies.** “Trabalho”, “Saúde” and “Justiça” are domains, while near-identical concepts are also government areas; neither index explains that a domain is a subject and an area is a ministerial portfolio (`paginas/dominios.html:1`; `paginas/areas.html:1`).

- **A geographic hierarchy.** The site offers municipalities/concelhos, districts/islands, NUTS II regions and “Alentejo Central” on the Évora page, but never states which classifications contain or overlap which others (`paginas/concelho-evora.html:1`; `paginas/distritos.html:1`; `paginas/regioes.html:1`).

- **Stable names for stable objects.**
  - The same place type is **“Municípios”**, **“Os concelhos de Portugal”**, **“Município”** and **“nome do concelho”** (`paginas/municipios.html:1`; `paginas/concelho-evora.html:1`; `paginas/inicio.html:1`).
  - Compact/full content is variously **“Relance”**, **“Leitura breve”**, a `faixa` labelled “As medidas, uma por cartão”, **“painel”**, **“As medidas”**, “indicadores” and “peças” (`paginas/inicio.html:1`; `paginas/concelho-evora.html:1`; `paginas/regiao-alentejo.html:1`; `paginas/areas.html:1`).
  - Authored work is **“Estudos”**, **“trabalhos no arquivo”**, **“Os trabalhos sobre este concelho”** and **“Abrir a leitura”** (`paginas/estudos.html:1`; `paginas/concelho-evora.html:1`).
  - **“fonte”** sometimes names the original publisher and sometimes an intermediate study or “Quadro institucional de indicadores”; the domain article separately prints the actual publisher and document (`paginas/inicio.html:1`; `paginas/dominio.html:1`; `paginas/livro-razao.html:1`).

A first-time reader needs one vocabulary: **measure** for the interpreted number, **ledger record** for its evidence, **study** for authored analysis, **domain** for subject, **government area** for portfolio, and **territorial level** for country/region/district/municipality.

## One place

1. **308 concelhos:** make `municipios.html` the sole roster. Filter its grouped list instead of maintaining a second 308-result list; make the front search submit into that same index; replace the two 308-row domain tables with doors to measure-specific municipality comparisons (`paginas/inicio.html:1`; `paginas/municipios.html:1`; `paginas/dominio.html:1`). This removes the largest copied enumerations.

2. **Country measures:** make `inicio.html#painel` plus `#painel-social` the canonical national-measure catalogue. Merge the card values into those entries and remove the preceding 21-card `faixa`; keep the headline as a summary door. Domain pages should link to the three overlapping national entries instead of restating them (`paginas/inicio.html:1`; `paginas/dominio.html:1`).

3. **Ledger records:** make one searchable `livro-razao.html` index cover both the 149 general rows and the 2,767 municipal rows. Consumer pages should retain the value and one source door, while access dates, verification history, document titles and other record fields live only in the ledger record (`paginas/livro-razao.html:1`; `paginas/dominio.html:1`).

4. **29 districts/islands:** make `distritos.html#unidades` canonical. Replace the front page’s full **“Os nomes no mapa”** list with one “Distritos e ilhas” door; retain district names on `municipios.html` only as grouping labels (`paginas/inicio.html:1`; `paginas/distritos.html:1`; `paginas/municipios.html:1`).

5. **Nine regions:** make `regioes.html#regua` the sole all-region comparison. `regiao-alentejo.html` should retain Alentejo’s measures and provide a **“Comparar as regiões”** door instead of copying the entire ruler and list (`paginas/regioes.html:1`; `paginas/regiao-alentejo.html:1`).

6. **Studies:** make `estudos.html` the sole archive. Replace Évora’s five copied titles and synopses with one door such as “5 estudos sobre Évora”, opening a filtered archive (`paginas/estudos.html:1`; `paginas/concelho-evora.html:1`).

7. **Domains and areas:** their indexes are already single canonical places. Fix the taxonomy instead: either give “Trabalho” its own domain page or make it a section of “Economia e finanças públicas”, not both a peer domain and an anchor inside another (`paginas/dominios.html:1`; `paginas/dominio.html:1`). Keep `areas.html` as the government-portfolio index (`paginas/areas.html:1`).

## Keep

- Keep front-page doors to **“Municípios”**, **“Regiões”**, **“Distritos”**, **“Áreas”**, **“Domínios”**, **“Estudos”** and **“Livro-razão”**: a link to a canonical index is navigation, not duplicated content (`paginas/inicio.html:1`).
- Keep the direct concelho search because it shortens the principal territorial task to one tap, but make it query the canonical roster (`paginas/inicio.html:1`).
- Keep contextual subsets such as Évora’s 14 concelhos on its district page; they answer “what belongs here” rather than recreating the national roster (`paginas/distrito-evora.html:1`).
- Keep a map plus a textual list when the latter is the accessible equivalent of the former, provided both are generated from one source; the district and regional documents currently expose such paired representations (`paginas/distrito-evora.html:1`; `paginas/regioes.html:1`).
- Keep a source chip beside every asserted value. It is a door to the canonical ledger record, not another ledger record; remove only the copied record metadata (`paginas/livro-razao.html:1`; `paginas/dominio.html:1`).
- Keep the English edition as a translation mirror, not an independent information architecture (`paginas/inicio.html:1`; `paginas/en-inicio.html:1`).
- Keep one headline conclusion before a canonical detail collection; summary and evidence perform different jobs when the summary clearly links to the evidence (`paginas/inicio.html:1`).

**Distinct duplications found: 6.**