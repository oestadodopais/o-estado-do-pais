# Leitura do Codex dos blocos A e B das correções de UX, sem contexto, 25.08.2026

*Corrida pelo lugar de direção (Claude Fable 5): Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, com as páginas construídas de dezassete rotas antes (`main`, `d847008`) e depois (`e95c545`), 114 capturas nas duas larguras (24 anexadas ao prompt), a auditoria e a nota dos construtores como afirmações a conferir. Custo, como o CLI reporta: **364 109 símbolos**, orçamento próprio.*

## Triagem do lugar de direção

- **H1 (a rota «Região» e a régua saíram sem página de substituição):** **dissenso registado, não aplicado.** É a decisão 3 do diretor de 25.08 (a régua sai da primeira página até haver a página das regiões, completa). O estado `?ambito=regiao:<slug>` continua a resolver.
- **H2 (o 404 cru):** **não é do sítio.** As capturas «depois» foram tiradas de um servidor de ficheiros do lugar de direção (`python3 -m http.server`), que não serve o `404.html`; no ar, a Vercel serve-o, e o `verify:deploy` prova-o a cada deploy. As capturas «antes» vieram do sítio no ar, por isso mostravam a página da casa. Nota para pacotes futuros: servir o `depois` com a regra do 404.
- **H3 (a primeira página não diz quem fala nem porque confiar):** **dissenso registado contra a Emenda 18**, que o diretor decidiu de viva voz a 25.08 (a página do leitor diz o que a coisa é, nunca porque se deve confiar nela; quem faz o sítio está no Sobre). O que a leitura pede sobre o painel («o que é o Procedimento, quem fixa os limiares») é a decisão 4, à espera das duas frases do diretor. A observação sobre o inglês («of Portugal» pode ler-se como afiliação oficial) vai ao diretor.
- **M1 (o índice antes do título na página de leitura):** **real**, passo C.
- **M2 (as listas do Método e da agenda mais compridas no telemóvel):** **real, uma regressão do bloco B**, passo C.
- **M3 (o índice dos concelhos):** o bloco de conteúdo dos 308 é a decisão 5; **a pesquisa no topo do índice** entra no passo C por ser barata e ser a decisão 5 aplicada ao índice.
- **M4 (a edição arquivada):** o texto é I69 (motor); a faixa já leva «Ler no sítio →». Fica.
- **M5 (a pesquisa do livro-razão):** bloco próprio (D8), depois.
- **L1 (os milhares num valor de cabeça):** **real**, passo C (o espaço fino U+202F quase invisível em Bitter a 52 px; o portão normaliza os quatro espaços de milhares).
- **L2 (as provas não viajam no pacote):** nota de processo; as réguas vivem no repositório e correm na construção.

## O relatório, verbatim

# Review of the correction round

## Verdict

**Do not merge this round as it stands.**

Most visible and structural corrections landed, but two regressions block the merge:

1. The Region scope and its content were removed without the replacement regional page required by the audit decision.
2. Unknown URLs in the after build show a raw server error instead of the packaged, branded 404 page.

A third significant regression affects the study reading page: its new table of contents appears before the document title and description, so the first screen no longer identifies what the reader opened.

The package contains built HTML, JavaScript, CSS and selected captures. It does not contain the source tree, Playwright tests, mutation runs, build logs or the claimed full set of 342 pages. Exact pixel measurements, full-site totals and red/green mutation claims in `CORRECOES.md` therefore cannot be independently reproduced.

## 1. Did each correction land?

| Item | Status | Evidence and qualification |
|---|---|---|
| A1, municipality control focuses and reveals search | **Fixed as claimed** | In `depois/js/inicio.js`, the municipality handler calls `campo.focus({preventScroll: true})` and `campo.scrollIntoView({block: 'nearest'})`. `capturas/depois/inicio-390-apos-concelho-cima.jpg` shows the focused field wholly on-screen. |
| A2, one Country/Municipality command on phone and desktop | **Partly** | `depois/index.html` has one “Âmbito” group with “País” and “Concelho”, visible in `capturas/depois/inicio-390-cima.jpg`. The three old mobile-destination elements are gone. However, “Região” was removed rather than incorporated into the unified control. |
| A3, remove convergence and regional band from home | **Fixed as claimed, with a High regression below** | `antes/index.html` contains `id="convergencia"` and Region controls; neither exists in `depois/index.html`. No regional destination replaces them. |
| A4, hide map and show municipality search on phone | **Fixed as claimed** | `capturas/depois/inicio-390-cima.jpg` and `inicio-390-ecra2.jpg` show search and no map; `capturas/depois/inicio-1280-cima.jpg` retains the desktop map. |
| A5, make Évora’s desktop map point a link | **Fixed in the HTML** | `depois/index.html` wraps the Évora circle in an anchor to `/municipios/evora` and includes `<title>Évora</title>`. No after hover/focus capture is supplied, so cursor and keyboard appearance cannot be observed. |
| A6, insert a separator in the map readout | **Fixed in the implementation** | The after HTML contains the separator and `depois/js/inicio.js` toggles `data-readout-sep`. There is no after hover capture to verify the rendered string visually. |
| A7, shorten phone header and raise headline | **Fixed visually** | Compared with `capturas/antes/inicio-390-cima.jpg`, `capturas/depois/inicio-390-cima.jpg` has a shorter masthead and brings the country headline into the first screen. Exact measurements require the missing Playwright test. |
| A8, reduce excessive vertical bands | **Fixed on targeted captures** | The home and Évora before/after captures show less empty space. Exact band measurements and the asserted result across 342 pages cannot be reproduced. Separate phone index regressions are reported below. |
| A9, 12 px phone text floor on home ruler | **Partly** | The after home CSS overrides `.regua-escala` and related labels to 12 px at phone width. The claim of zero computed elements below 12 px requires the absent browser test. |
| A10, 44 px proof-value targets | **Partly** | `depois/_astro/Base.BCO86hAt.css` adds a 44 px pseudo-element to `a.prova-valor`. The claimed zero undersized or overlapping targets cannot be derived from screenshots or static HTML. |
| A11, identity sentence on both home pages | **Fixed as claimed** | `depois/index.html` contains “Um observatório de Portugal.” and `depois/en/index.html` contains “An observatory of Portugal.” Its meaning remains defective; see the identity finding. |
| C1, map remains visible in every regional state | **Not meaningfully fixed** | The JavaScript no longer hides the map by mode, but `depois/index.html` has no Region control or regional content. A state the reader cannot enter is not evidence that the state works. |
| B1, consolidate 16 editions into 12 studies | **Fixed as claimed** | The archive changes from 16 `article.arquivo-item` entries in `antes/estudos/index.html` to 12 in the after page, with PT/EN editions grouped under each work. |
| B2, make “Ler no sítio” primary and add it to archive | **Fixed as claimed** | The study page puts “Ler no sítio →” before “Ler o documento →” and describes the latter as “A edição de registo, tal como foi publicada.” The archived document band also adds “Ler no sítio →”. |
| B3, fold 212 technical lines and shorten reading page | **Fixed structurally** | The after HTML retains 212 `texto-linha` entries inside a closed-by-default `details class="texto-dobra"`. Exact page heights and fragment-opening behavior require the missing browser test. |
| B4, add nine-link index and fixed “Subir” control | **Fixed as claimed, with a Medium regression below** | The after reading HTML contains nine `data-registo-indice` links and “Subir ↑”; the phone captures show both. Exact dimensions and desktop visibility cannot be measured here. |
| B5, make standalone “[a verificar]” markers links | **Partly** | In supplied after pages, standalone markers link to `/a-verificar`; remaining marker spans sit inside existing source links, avoiding nested anchors. The claimed `354 of 420` result across 342 pages cannot be checked. |
| B6, remove untranslated “concelho” from English UI | **Partly** | The supplied English home uses “municipality/municipalities” in visible copy. The claimed 61-to-zero full-build result cannot be checked because most English pages are absent. |
| B7, ledger denominators and identifier label | **Fixed as claimed** | The ledger says “128 de 136 linhas com proveniência completa” and “8 de 136 linhas com campos por confirmar”. The row labels `divida-publica-2025` as “identificador”. |
| B8, remove empty square from “sem limiar” | **Fixed as claimed** | `capturas/depois/evora-390-cima.jpg` shows “sem limiar” without a square; threshold-bearing cards retain their coloured square. |
| B9, keep Évora value pair together and encode graph-label sides | **Partly** | The after HTML uses `.glance-par-lado`, with `white-space: nowrap`, and graph labels have explicit above/below data. No corresponding after capture of the affected lower section is supplied, so final non-overlap and target sizes cannot be confirmed. |
| B10, 12 px floor and touch targets across nine routes | **Partly** | The after CSS contains 12 px floors and many 44 px target rules, and small text is visibly larger. The exact 18-cell and full-site counts cannot be checked. The rules also make some phone indexes materially longer. |

Overall: **14 fixed as claimed, seven partly supported and one not meaningfully fixed.**

## 2. Defects and regressions

### Critical

No Critical defect is established by the package.

### High

#### H1. The Region route and regional explanation vanished

- **Page and width:** Front page, 390 and 1280.
- **What I saw:** Before, the scope command included “Região”; phone also offered “Ver uma região →”, and the page contained regional/convergence content. After, the only scopes are “País” and “Concelho”. There is no regional replacement.
- **What I expected and why:** `AUDITORIA.md` §4 says that if convergence leaves the home page, it should move to a Regions page. Removing both content and route is loss of functionality, not simplification. It also makes C1 vacuous.
- **Fix:** Restore the Region scope until a functioning, linked Regions page carries the removed content, then test it at both widths.

#### H2. Unknown routes show a raw server 404

- **Page and width:** Unknown route, 390 and 1280.
- **What I saw:** `capturas/depois/erro-404-390-cima.jpg` and `erro-404-1280-cima.jpg` show “Error response”, “Error code: 404” and “Message: File not found”. The before captures show the branded “Não existe nada neste endereço.” page.
- **What I expected and why:** The corrected build should preserve the site’s error experience. `depois/404.html` contains the branded page, so fallback routing or the way the after build was served failed.
- **Fix:** Configure the actual host/capture server to serve `404.html` for unknown paths and add an end-to-end unknown-route test.

#### H3. The front page still does not establish who is speaking or why the panel should be trusted

- **Page and width:** Front page, 390 and 1280, Portuguese and English.
- **What I saw:** The new line is only “Um observatório de Portugal.” / “An observatory of Portugal.” The page then moves directly to “Painel europeu reconferido a 2026-08-24” and “Portugal ultrapassa 4 limiares...”.
- **What I expected and why:** A first-time reader needs to know who makes the site, whether it is official or independent, and the basis and authority of “limiar”, “cumpre” and the selected panel. Freshness dates and source links support individual facts but do not answer those questions.
- **Fix:** Add a short, verified deck naming the publisher and explaining the panel and thresholds, with direct links to About and Method.

### Medium

#### M1. The reading-page index hides the document’s identity on arrival

- **Page and width:** Study reading page, 390; also affects the first desktop viewport.
- **What I saw:** `capturas/depois/estudo-evora-texto-390-cima.jpg` shows “DOCUMENTO DO ESTUDO · TEXTO” followed immediately by “NESTA PÁGINA”. The title “Évora — o que foi prometido...” and its description, visible before, are pushed below the index.
- **What I expected and why:** A reader following “Ler no sítio” should first learn which document opened and what it is about.
- **Fix:** Put the title and deck before “Nesta página”, or collapse the index behind a labelled disclosure on phone.

#### M2. Phone touch-target changes make long indexes slower to pass

- **Page and width:** Method and Agenda, 390.
- **What I saw:** `capturas/antes/metodo-390-cima.jpg` fits roughly ten numbered entries in the captured area; `capturas/depois/metodo-390-cima.jpg` fits seven. The Agenda index similarly grows from a compact list to almost a screen of separated links. The after CSS combines 44 px minimum heights with existing list spacing.
- **What I expected and why:** A 44 px hit area should improve touch access without adding several screens of scrolling.
- **Fix:** Preserve a 44 px effective target with pseudo-elements or compact rows and remove duplicated vertical margin/gap.

#### M3. The municipalities index remains an almost entirely dead directory

- **Page and width:** Municipalities index, 390 and 1280.
- **What I saw:** The page says “1 de 308 concelhos · tem página” and lists the country by district; 307 entries say “sem página ainda”. There is no search or filter on this page. “O mapa dos concelhos” links back to the home map rather than presenting one here.
- **What I expected and why:** The directory should help readers find the one available page quickly instead of requiring a scan through hundreds of inactive names.
- **Fix:** Put municipality search at the top, default to “with a page”, and expose the inactive directory as a secondary option.

#### M4. The archived study still looks and reads like an unrelated technical site

- **Page and width:** Archived Évora document, 390 and 1280.
- **What I saw:** “Ler no sítio →” provides a useful escape, but the document still abruptly changes visual system and opens with “Research Hub”, `ledger.json` and `Technical Source/make_pt.py`.
- **What I expected and why:** An “edição de registo” should still make its provenance and relationship to O Estado do País immediately understandable to a public-interest reader.
- **Fix:** Strengthen the archive banner with a plain-language explanation of what the edition is and why it looks different.

#### M5. The ledger index remains difficult to use

- **Page and width:** Ledger index, 390 and 1280.
- **What I saw:** “128 de 136 linhas...” clarifies the denominator, but the reader still faces a long list of technical identifiers and values without search, filtering or subject grouping.
- **What I expected and why:** A provenance ledger is useful only if readers can find the claim they arrived to check.
- **Fix:** Add search and filters for page/topic, source and provenance state while preserving stable row URLs.

### Low

#### L1. The study’s headline figures are hard to parse

- **Page and width:** Évora study page, 390 and 1280.
- **What I saw:** The lead card prints `167372755,84` as an uninterrupted digit string.
- **What I expected and why:** Public-facing Portuguese amounts should use locale-aware grouping so millions and thousands can be distinguished at a glance.
- **Fix:** Format displayed amounts with non-breaking grouping while retaining the exact raw ledger value.

#### L2. The correction proof is not portable with the package

- **Page and width:** Review package, all routes and widths.
- **What I saw:** `CORRECOES.md` cites Playwright commands, planted source mutations, build/type-check gates, exact heights and site-wide totals, but the package contains none of the tests, source inputs or logs required to reproduce them.
- **What I expected and why:** A correction audit based on numerical gates should ship runnable checks or immutable results with the builds.
- **Fix:** Include tests, runtime instructions and machine-readable results, or narrow the claims to what the packaged HTML and screenshots prove.

## 3. First-time-reader review

### Front page, phone and desktop

I now understand that the product describes itself as an observatory, that the main reading is at country level, and that I can switch to “Concelho”. On phone, “Escreva o nome do concelho” is finally a visible route rather than a tiny map. On desktop, Évora’s map point is a real link.

I still do not know who selected the panel, who set the thresholds, whether the site is official, or what “cumpre 9” is meant to establish. Removing “Região” also makes the available scope feel arbitrarily incomplete.

### Municipalities index

I understand the coverage honestly: “1 de 308 concelhos · tem página”, with mainland, Azores and Madeira totals. What stops me is the mismatch between that one useful destination and a 308-row directory dominated by “sem página ainda”. There is no search on this page.

### Évora page

I understand that the page is a municipal “Relance”, that “58 567” is “População residente”, and that “sem limiar” means no published threshold rather than an empty status. Sources and “Abrir” controls are clearer.

The page still asks the reader to absorb a long sequence of heterogeneous measures without explaining why those measures, together, describe Évora.

### Studies index

I now understand the distinction between a work and its editions: “12 trabalhos no arquivo” and “16 edições”, with PT/EN options grouped under one title. Removing repeated “Descrição:” labels improves scanning.

Publication metadata remains incomplete through repeated “[a verificar]”, so the archive does not yet support reliable chronological interpretation.

### Study and reading pages

On the study page, “Ler no sítio →” clearly names the intended path, while “Ler o documento →” is secondary and described as the archived record. The large ungrouped euro amounts remain difficult to read.

On the reading page, “Nesta página”, the folded technical lines and “Subir ↑” make a formerly enormous page navigable. Putting that index before the title, however, means I initially do not know which document I am navigating.

### Archived document

“Ler no sítio →” tells me there is a preferred public reading and provides a way back. The archive itself still opens in an alien design and technical voice, including “Research Hub”, `ledger.json` and `Technical Source/make_pt.py`; it can look like a different publisher or an internal build artefact.

### Ledger index and row

The index now tells me what “128” is out of, and the row labels `divida-publica-2025` as an “identificador”. The row’s value, publisher, series page, read date and proof structure are understandable.

The remaining obstacle is retrieval: the index is unfiltered, and the raw Eurostat URL is visually dominant even though it works.

## 4. The identity line

“Um observatório de Portugal.” and “An observatory of Portugal.” read as a **claim of category**, not as a name. The indefinite article makes the phrase descriptive, while the wordmark already supplies the name. In English, “of Portugal” can also suggest institutional or official affiliation rather than merely “about Portugal”; the front page does not resolve that ambiguity.

Nothing else on the front page adequately justifies the site. “Painel europeu reconferido a 2026-08-24” is a freshness claim, and the “fonte” links expose evidence for individual figures. The remaining copy mostly names objects and modes: “Portugal · País”, “Âmbito”, “Densidade”, “Relance”, “Leitura breve”, indicator titles and status labels.

It does not explain the publisher, the role of people and automation, the choice of indicators, or the authority of the thresholds. About and Method may contain those answers, but the front page neither summarizes nor points to them when its main claim is made.

## Merge condition

At minimum, merging should wait for:

1. restoration or proper replacement of the Region route;
2. a verified branded 404 fallback; and
3. reordering the reading-page title ahead of its contents index.

The identity gap should also be closed in this round because the new line creates an institutional-sounding claim without supplying the context needed to understand it.