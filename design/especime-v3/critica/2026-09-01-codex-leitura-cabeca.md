# Leitura a frio do Codex ao ramo da cabeça (01.09.2026)

*Codex `gpt-5.6-sol`, 18:02 a 18:31 UTC, pacote com três plantas (3 de 3 vistas; o registo está no `.plantas.json` ao lado). Triagem do lugar de direção: os achados reais foram consertados na segunda passagem (`cabeca-construtor.md` §8) ou decididos na §1.91; os ecos das plantas estão anotados no registo. O texto do Codex segue tal como veio.*

---

## Blocking

1. **The supplied source, patch, built pages, and report are not one coherent branch.**  
   Files:

   - `diff.patch:2720`: `rotulo: 'The measures, one per card'`
   - `fonte/src/i18n/strings.mjs:1830`: `rotulo: 'The measures, 1 per card'`
   - `paginas/en-inicio.html`: `aria-label="The measures, one per card"`
   - `fonte/design/especime-v3/INVENTARIO-FRASES.md:1740`: `The measures, one per card`

   `fonte/` therefore does not represent the after-state in `diff.patch`, and the built pages were not built from the supplied `fonte` copy. The literal `1` is also a hand-written figure in the head, with no `data-prova` or door, contrary to IDENTIDADE §10 and the “no new figure” gate. The report’s claims of one build and `check:voz` at zero cannot apply to the supplied source: rebuilding it should produce an inventory mismatch. The patch’s value is `one`, but the final phrase remains `[verify]` until approved.

2. **The country strip has 21 measure cards, but the brief requires two scoreboard cards.**  
   Files:

   - `fonte/src/views/HomeView.astro:141-143`: `13 do Procedimento e 8 do Painel Social`
   - `fonte/src/views/HomeView.astro:175-178`: `...medidas.map(...)` and `...sociais.map(...)`
   - `relatorio-construtor.md:9`: `uma faixa de vinte e um cartões`
   - BRIEF §2, line 31: `Até haver domínios da primeira vaga no ar, os dois quadros da União são os cartões.`

   Both built home pages contain 21 `data-cartao` elements. The current correct count is **2 cards**, one for each EU scoreboard. `faixa.mjs` F1 encodes the wrong 21-card interpretation by requiring the strip to equal every measure rendered below, so a correct two-card implementation would fail its test.

3. **The map navigates to 29 districts and islands, not to the 9 regions.**  
   Files:

   - `paginas/pt-inicio.html`: `aria-label="Mapa dos distritos e das ilhas de Portugal, com uma área por unidade."`
   - Same file: `class="uni-porta" href="/distritos/aveiro"`
   - `relatorio-construtor.md:27`: `As 29 unidades continuam a ser as áreas do desenho`

   The built PT and EN pages each have 29 district/island links. BRIEF §4 requires: `O mapa escolhe regiões a todas as larguras`. The correct first navigation layer is the **9 NUTS II regions**, followed by municipalities through search or the enlarged region. Calling the 29-unit map compliant is misleading.

4. **Region and municipality pages do not inherit the same head.**  
   Files:

   - `fonte/src/views/RegiaoView.astro:148-150`: `Uma região não tem mapa ... a cabeça daqui acaba na faixa`
   - `fonte/src/views/MunicipioView.astro:435-437`: `o cartão localizador, que vive no fim da página ... a cabeça de um concelho acaba na faixa`
   - `relatorio-construtor.md:28`: `cumprida nas três`
   - `fonte/tests/inicio/faixa.mjs:801-806`: F12 only requires a strip, matching measures and non-overlapping seals.

   The built region pages have **no map**. The municipality map occurs after the body, inside the final `<aside>`, after `#relance`, rather than in the head. Both templates also have only a place name and type/subtitle, not the required numeric headline. The correct structure is the same name, headline, strip and navigation map on country, region and municipality pages; BRIEF §2 further specifies a region map with the municipality marked. F12 does not test any of that.

5. **The desktop screen order knowingly contradicts the order.**  
   Files:

   - `relatorio-construtor.md:196`: `nome, manchete, faixa, mapa, por esta ordem ... no ecrã`
   - `relatorio-construtor.md:200`: `A partir de 1024 ... o mapa começa à altura da manchete`
   - `fonte/src/styles/inicio.css:841-844`: the map occupies `grid-column: 2; grid-row: 1 / span 3`
   - `fonte/tests/inicio/faixa.mjs:682-688`: F9 checks only that the map is horizontally right of the strip.

   At 1024 and above, the map starts beside the headline, before the strip in top-to-bottom screen geometry. The builder labels this a “reading order”, but the order explicitly says screen order. No director approval is supplied. The correct value is headline top, then strip top, then map top, unless the director approves a replacement rule.

6. **The absolute touch-target gate fails at every measured width below 1024.**  
   Files:

   - `relatorio-construtor.md:23`: `sem regressão`
   - `relatorio-construtor.md:108-116`: at 390, `0 + 15`; at 768, `11 + 24`
   - `fonte/design/especime-v3/medicoes/cabeca-depois.json`: the same counts.

   “No regression” is not the criterion. BRIEF §4 says **every** touch target must be at least 44 × 44 below 1024. At 320–430 there are 15 undersized furniture targets; at 768 there are 35 visible failures, 11 in the body and 24 in furniture. Opening the search exposes five additional undersized results. The correct failure count is **zero**.

7. **The card is not an entire target, and F3 is written to accept that defect.**  
   Files:

   - `fonte/src/components/inicio/Faixa.astro:42-44`: `a porta ... ocupa as três primeiras. As duas últimas são o PÉ`
   - `fonte/src/styles/inicio.css:480-493`: `.cartao-porta { grid-row: 1 / 4; }`
   - `relatorio-construtor.md:24`: `cobre o cartão inteiro menos a fila do selo`
   - `fonte/tests/inicio/faixa.mjs:462-471`: the target is only required not to enter the unit row.

   The target excludes both the **unit row and the seal row**, not only the seal. F3 never requires the target’s bottom to reach the unit; a full-width 44 px strip at the top could pass. The correct implementation must make the entire non-conflicting card area a target, including the unit and surrounding space, while retaining an independent source link.

8. **Dates are not in `dd.mm.aaaa` everywhere.**  
   Files:

   - `paginas/pt-concelho-evora.html`: `2013-05-01`, `2013-10-18`, `2017-10-20`, `2021-10-15`, `2025-10-31`
   - `paginas/en-municipality-evora.html`: the same five ISO dates
   - `relatorio-construtor.md:33`: `cumprida no cabeçalho`

   The acceptance rule says “everywhere”, not only in the masthead. The correct visible forms are **01.05.2013, 18.10.2013, 20.10.2017, 15.10.2021, 31.10.2025**.

9. **The replacement phrase and command placement were built before the required decisions.**  
   Files:

   - `relatorio-construtor.md:306`: `Construído com a proposta`
   - `relatorio-construtor.md:208`: `O âmbito ... não subiu para o menu como o brief pede`
   - `fonte/src/views/HomeView.astro:357-365`: `<Comando ... />` is a sibling immediately before, not inside, `<section id="painel">`.

   The phrase was required to be approved before construction. No approval is supplied. In addition, neither command reaches its specified destination: Âmbito remains in the page command rather than the menu, and Densidade is before the panel rather than in its header. The correct phrase is `[verify]`; the correct placements are menu and panel header respectively.

10. **An existing ruler remains red, so the branch is not mergeable under its own gates.**  
    File: `relatorio-construtor.md:226`: `tests/inicio/matriz.mjs | 86 de 87`.

    BRIEF §4 requires all existing rulers green. “Not from this block” does not waive an acceptance gate. The correct result is **87/87**, or a formally approved change to the gate.

## Major

1. **The before/after headline-distance evidence is invalid, and the top summary contains another wrong value.**  
   Files:

   - `fonte/design/especime-v3/medicoes/cabeca-antes.json:48-61`: the alleged headline is at `68 ... 103.4`, which is the wordmark, and the saved distance is `2071.9`.
   - `relatorio-construtor.md:57`: `A primeira redação ... media ... o nome do sítio ... Está corrigido`
   - `relatorio-construtor.md:11`: after value `118,2 px`
   - `fonte/design/especime-v3/medicoes/cabeca-depois.json:49-61`: after value **138.2 px**
   - The branch report under `fonte/` also says **138.2**, so the root report is another package divergence.

   The before JSON was never rerun after correcting the selector. Using the report’s own old headline bottom, 408.3, and saved measure top, 2175.3, produces **1767.0 px, 2.09 screens**, not 2071.9/2.45; however, the authoritative old value remains `[verify]` because the corrected old run is absent. The correct after value is **138.2 px, 0.16 screens**.

2. **The 1280 height does not meet the pre-written numeric value, and the report silently chooses the later baseline.**  
   File: `relatorio-construtor.md:20`: `4 025 ... Contra 4 003 px ficam 22 px acima`.

   The built PT page is **4025 px**. It is 5 px shorter than the remeasured base, 4030, but 22 px above the BRIEF’s recorded 4003. Both figures are real; the folder contains no director decision saying the later baseline replaces the pre-written value. This cannot be marked unconditionally green.

3. **Two English “viewport” captures expose horizontal overflow or invalid capture dimensions.**  
   Files:

   - `home-320-en-claro.png`: **353 × 7298**, despite `320` in its name.
   - `home-390-en-claro.png`: **406 × 7025**, despite `390` in its name.
   - `fonte/design/especime-v3/medicoes/cabeca-medidas.mjs:306-320`: creates 320/390 viewports and takes `fullPage: true` screenshots.

   All other capture widths match their names. With full-page capture, the expansion is evidence of document-width overflow; otherwise, the captures are not at the claimed widths. The correct pixel widths are **320 and 390**.

4. **Four new visible strings are missing from the voice inventory.**  
   Files:

   - `fonte/src/i18n/strings.mjs:575-576`: `Os nomes no mapa`, `Um concelho pelo nome`
   - `fonte/src/i18n/strings.mjs:1858-1859`: `The names on the map`, `A municipality by name`
   - `relatorio-construtor.md:258-264`: `Seis, e duas entram no inventário`
   - `relatorio-construtor.md:32`: `cumprida, com um buraco ... não tapado`

   Every new string must enter the inventory. A known scanner omission does not satisfy that rule. The correct change is **six new inventory rows**, with the checker taught to collect `<summary>`.

5. **The cards conflict with the identity’s Relance and type rules.**  
   Files:

   - IDENTIDADE §4: `Relance | O número, sozinho`
   - `fonte/src/components/inicio/Faixa.astro:140-160`: renders state, value, name, unit and seal.
   - `relatorio-construtor.md:31`: `Bitter (o número e a unidade) e Spectral (o nome)`
   - IDENTIDADE §1 assigns Bitter to `Valores medidos, rótulos, eixos`.

   A card described as Relance contains substantially more than the number. Its measure name is also a label, so the report’s deliberate Spectral assignment contradicts the identity; the correct family for that label is **Bitter**. The seal requirement still applies beside a ledger value, so the exact reconciliation with “number alone” needs an explicit identity-conforming decision.

6. **Contrast is not demonstrated, and the report records failures while marking the criterion green.**  
   Files:

   - `relatorio-construtor.md:29`: `sem mudança`
   - `relatorio-construtor.md:124`: `4 objetos de interface abaixo de 3:1`
   - BRIEF §4 requires interface objects at least 3:1 in both themes.
   - IDENTIDADE §2 requires every actually used pair to be enumerated and measured by the script.

   No contrast script, tokens file, or result artifact is supplied. The report also gives no measured outline-to-adjacent-colour ratios proving that the outlines repair the four low-contrast objects. The correct result is zero unresolved failures; the actual result is `[verify]`.

7. **The planted-damage harness overstates what it catches.**  
   Files:

   - `fonte/tests/inicio/faixa.mjs:909-912`: success is `depois.some((c) => !c.passa)`
   - `relatorio-construtor.md:238`: `F9, às sete larguras`
   - Plant at `faixa.mjs:878-880`: moves the strip below the map.

   The plant makes F9 red below 1024, but at 1024 and 1280 F9 remains green because desktop F9 only checks horizontal columns and headline-before-strip. Since the harness accepts one failing cell, it reports the whole plant caught. The correct harness must require every intended width and edition to turn red.

   It also does not contain the BRIEF’s required SVG plant: `faixa.mjs:849-856` inserts `<span>13 de 27</span>` into a card unit. A number inserted into the map SVG, or the actual `1` in the accessible label, is outside F2’s card-text scan and would be missed.

8. **Several “green” test claims do not test the stated behaviour.**  
   Files:

   - F7, `faixa.mjs:607-621`, presses only `Tab`; it never presses Enter.
   - F1 checks `<ol>`, `<li>` and `aria-label`; it never examines the accessibility tree or spoken “list of N”.
   - F8, lines 643-650, only compares computed sizes; it never proves they come from two declared CSS tokens, so a `clamp()` could pass.
   - F4, line 276 and 363, reads inline script text only; an external `<script src>` has empty `textContent`.
   - F12 checks only the strip and seals, not the same head.
   - F1 compares the current strip with the current body; it does not compare ledger inventories before and after, despite `relatorio-construtor.md:37` citing it as that proof.

   Actual native anchors and `<ol>` semantics are plausible, but the report’s keyboard, screen-reader, CSS-rule, no-JS and inventory claims are not proven by these cells. F1, F6, F7, F8, F11 and F12 also have no planted damage at all.

9. **Existing checks were rewritten to accept materially weaker conditions.**  
   File: `diff.patch`.

   - `matriz.mjs` 2m/f1 changes from the precise island-corner placement to merely `!m.cruza`, allowing the legend anywhere outside the drawing.
   - `lista.mjs` L12 at 1024 removes “below the map, in its column, within 16 px” and checks only that the legend follows the opened names list.
   - `matriz.mjs` f2 calls the search “below the map” but tests only `search.top >= map.top - 1`; a search beside or overlapping most of the map passes. The correct below-map check is against `map.bottom`.
   - `correcoes-a.mjs` A8 falls back to the old pieces when the strip is absent, so it no longer independently detects removal of the new Relance strip.

   These are weaker than the main-branch predicates, not equivalent rewrites.

10. **Many reported run results are not reproducible from the supplied evidence.**  
    File: `relatorio-construtor.md:3`: `cada número desta página saiu de uma corrida que se diz ao lado dele`.

    The folder contains no `package.json`, runnable `dist`, captured test output, build log, contrast output, route manifest, or result JSON for the test suites. Consequently, these claims cannot be reproduced here: build/verify/typecheck 0, 76/76, 7/7, 94/94, 6590 pages, the detailed 1280 geometry, 79.3 × 109.1 minimum target, the intermediate layout trials and the claimed contrast ratios. The height, first-screen, target and font-size values that do exist in the supplied JSON were reproducible statically.

11. **A pre-existing region-body defect was fixed outside the authorised scope.**  
    Files:

    - `relatorio-construtor.md:298`: `Consertado neste ramo`
    - `fonte/src/views/RegiaoView.astro:48-63`: imports `inicio.css`, styling the existing body pieces as well as the new strip.
    - ORDEM §1: `só a cabeça` and no reorganisation of the rest of the site.

    The report says this accounts for part of the roughly 320 px growth of region pages. It is a real behavioural change outside the head and should have been a separate authorised block.

## Minor

1. **The 768 target breakdown is arithmetically and factually wrong.**  
   File: `relatorio-construtor.md:118`: six command positions, `cinco resultados da busca`, plus four links.

   That totals 15, not the table’s 11. The saved closed-state JSON shows **11 = six command links + five other links**, including Agenda. The five search results are excluded while the drawer is closed and would be additional failures when opened.

2. **“1024 is the only width where the country page grows” is false across both editions.**  
   Files:

   - `relatorio-construtor.md:98` and `:310`: `a única largura em que cresce`
   - Table at `:84`: English 768 is `5 370 → 5 371`, **+1 px**.

   The statement is true only for the PT measurements, not for both editions.

3. **The legal debt ceiling is documented as 100 although the rendered claim is 150.**  
   Files:

   - `fonte/src/components/inicio/Faixa.astro:52-53`: `teto legal = 100`
   - `relatorio-construtor.md:159`: the same quote.
   - Built municipality pages: `data-claim="indice-de-divida-limite-legal">150</span>`.

   The correct legal ceiling in the supplied built pages is **150**. This is not a rendered invented measure, but it makes the source documentation and report misleading.

4. **A source comment has been deleted relative to the patch, leaving a malformed sentence.**  
   Files:

   - `diff.patch:2465`: `O NOME ACESSÍVEL DA PORTA VEM DO NOME DA MEDIDA`
   - `fonte/src/components/inicio/Faixa.astro:68`: begins abruptly with `de uma cadeia escrita aqui`.

   This is the second patch-to-`fonte` inconsistency found by the consistency scan.

5. **The rewritten matrix test contradicts its own comment.**  
   File: `fonte/tests/inicio/matriz.mjs:2211-2212` says the search opens `ACIMA dele`; lines 2234-2245 and the cell name say below.

   The comment should describe the same geometry as the predicate.

## Notes

- The PT 390 × 844 country first-screen measurement itself passes: name 68–103.4, headline 249.5–408.3, strip 510.3–710.1, first card 511.3–705.1, map top 726.1.
- The correct after-distance is 138.2 px, below one 844 px screen.
- Country height at 390 passes: PT 7055 and EN 7025. At 1280 it passes the remeasured baselines, PT 4025 ≤ 4030 and EN 4009 ≤ 4014, but the original 4003 issue remains unresolved above.
- The implementation does use an `<ol>`, CSS `overflow-x`, `scroll-snap`, native `<details>` for the names drawer, and two declared number sizes, 30 px below 1024 and 40 px from 1024. No new font family was introduced.
- The masthead date is correctly rendered as `31.08.2026`; the defect is the remaining ISO dates elsewhere.
- I found no new public-facing hard-coded prose in the changed Astro/JS files that should have been in `src/i18n`. The two added inventory phrases describe the interface rather than justify trust. The four missing `<summary>` strings are the inventory problem.
- The diff touches no ledger, indicator or domain-data file and adds no domain page. Apart from the `1 per card` corruption in `fonte`, I found no new rendered ledger value written by hand in the head.
- The shared `lang` templates support producing PT and EN from one build, but the patch/source/built-page disagreement prevents accepting that provenance claim for this package.

Checks performed:

- Read ORDEM, BRIEF and IDENTIDADE in full.
- Enumerated every changed path in `diff.patch` and inspected the relevant source and before/after test hunks.
- Compared all non-empty added patch lines against their corresponding `fonte` files.
- Parsed all six supplied built pages for card counts, maps, link destinations, accessible names and visible ISO dates.
- Recomputed the report’s height, distance and target arithmetic from both measurement JSON files.
- Counted and checked the dimensions of all 42 PNG captures and visually inspected representative mobile and desktop captures.
- Traced every F1–F12 predicate and all seven planted transformations, including their `--vermelhos` success condition.
- Used no network. Build and browser tests could not be rerun because this folder does not contain the runnable project, dependencies or `dist`.