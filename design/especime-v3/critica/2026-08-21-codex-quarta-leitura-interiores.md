# Quarta leitura cruzada (Codex, sem contexto), 2026-08-21, tarde: a primeira página, o índice e as páginas do livro-razão, os municípios e Évora

*Sobre a construção em `1b54f0f` (depois da etapa 3 e da ronda 2m). Mesmo leitor e pacote; o prompt alargado às páginas interiores; cinco plantas espalhadas: P1 89,7 → 89,8 na primeira página; P2 a unidade «% do PIB» → «% do PNB» no `<title>` da página da dívida; P3 um «Read on» → «Lido a» no índice inglês; P4 população e empresas trocadas na página de Évora; P5 um selo de outra linha aninhado no selo de cabeça da página da dívida. **Quatro de cinco** (1, 15, 2, 3); a P3 escapou (quarta vez que uma palavra portuguesa numa página inglesa passa a este leitor).*

## Triagem do lugar de direção

- **Reais, para a abertura da etapa 4:** (13) o localizador de Évora leva `aria-describedby="mapa-descricao"` sem o `id` na página e instruções de teclado para controlos que a página não carrega (herança da 2m); (7) o registo de relocações diz que o aparelho da convergência saiu da primeira página e a construção ainda rende a frase de seleção, a definição do índice e a porta do CSV da convergência: ou o registo se corrige ou o aparelho sai; decisão de forma, a registar.
- **Artefactos do pacote:** (5) os recortes e (10) os documentos alojados foram excluídos do pacote de propósito (`ignore_patterns`); (4) o `prova.json` não descreve os bytes plantados.
- **Programados, não defeitos:** (9) os selos-porta do registo de correções e (12) as duas frases do Método são a etapa 4; (11) `?ambito=municipio` é estado do esquema desde a 2m (plano §13 atualizado nesta entrada).
- **De desenho, como antes:** (6), (8), (14, I13), (16).

## O relatório, verbatim

The build is not ready for the director. I found **16 findings: 3 critical, 6 high, 6 medium, and 1 low**. The central problem is evidential integrity: published values disagree with their ledger rows, one source seal opens a neighbouring row, and the build’s own “error-free” proof contradicts the files it supposedly checked. The static page also fails the required no-JavaScript URL states, and the convergence instrument bypasses the promised pre-rendered-only runtime.

## Ranked findings

### 1. Critical: the Portuguese home publishes the wrong government-debt value

- **Where:** [dist/index.html:1](dist/index.html:1), fragment: `data-claim="divida-publica-2025" ... >89,8</div>`.
- **What the files say:** [ledger/claims/divida-publica-2025.yml:9](ledger/claims/divida-publica-2025.yml:9) says `value: "89,7"`. The English home correctly says `89,7`, as does [estados/estado_densidade_leitura.txt:80](estados/estado_densidade_leitura.txt:80).
- **Why it matters:** This is the principal page publishing a value its own receipt contradicts. The correct seal does not rescue an incorrect displayed value.
- **Severity:** **Critical**

### 2. Critical: the Portuguese Évora page swaps population and enterprise counts

- **Where:** [dist/municipios/evora/index.html:1](dist/municipios/evora/index.html:1):
  - `evora-populacao-2025` displays `7 907`;
  - `evora-empresas-2024` displays `58 567`.
- **What the files say:** Population is `58 567` in [evora-populacao-2025.yml:9](ledger/claims/evora-populacao-2025.yml:9); enterprises are `7 907` in [evora-empresas-2024.yml:9](ledger/claims/evora-empresas-2024.yml:9). The English municipality page and the Évora home state render both correctly.
- **Why it matters:** Each seal points to the named row, so following either seal exposes that the visible value belongs to the other measure.
- **Severity:** **Critical**

### 3. Critical: the Portuguese debt receipt contains a nested seal for the wrong row

- **Where:** [dist/livro-razao/divida-publica-2025/index.html:1](dist/livro-razao/divida-publica-2025/index.html:1):

  ```html
  <a ... href="/livro-razao/divida-publica-2025#prova">
    <a ... href="/livro-razao/precos-da-habitacao-2025">...fonte...</a>
    ...
  </a>
  ```

- **What the files say:** The seal must open its own row and may never be nested, under [docs/direcao.md:77](docs/direcao.md:77). This is the only nested anchor found in all 307 HTML files.
- **Why it matters:** The markup is invalid, and the visible inner seal explicitly names the house-price receipt. Browser repair may split or empty the outer link, but a browser render was unavailable, so its exact repaired click behaviour cannot be established from these files.
- **Severity:** **Critical**

### 4. High: `prova.json` does not describe the current build

- **Where:** [dist/prova.json:3](dist/prova.json:3) calls itself the result of an error-free sweep; lines [149–151](dist/prova.json:149) claim 452 audited values, zero values without seals, and 11,310 checked internal links.
- **What the files say:** The present build contains the three critical contradictions above and 110 unresolved internal references. The supplied country-reading dump says `89,7`, while the HTML it supposedly represents says `89,8`.
- **Why it matters:** The package’s own acceptance evidence cannot be relied on. The files do not reveal whether the cause is a defective gate or changes made after the gate ran.
- **Severity:** **High**

### 5. High: 22 promised receipt crops are absent in both editions

- **Where:** For example, [dist/livro-razao/evora-despesa-paga-2025/index.html:2](dist/livro-razao/evora-despesa-paga-2025/index.html:2) and its English counterpart render:

  ```html
  <img src="/recortes/evora-despesa-paga-2025.webp" ...>
  ```

- **What the files say:** There is no `dist/recortes/` directory and no `.webp` file anywhere under `dist`. There are 22 unique crop paths, referenced once in each language, for **44 broken images**.
- **Why it matters:** These receipts promise a visual crop of the cited documentary line but display a broken image instead. The external source links could not be tested without network access.
- **Severity:** **High**

### 6. High: the required no-JavaScript URL states do not work

- **Where:** [dist/index.html:1](dist/index.html:1) is fixed at `data-ambito="pais" data-densidade="relance"`. Every regional, municipal, empty, and reading block is emitted with `hidden`.
- **What the files say:** The acceptance matrix explicitly requires no-JavaScript renders for regional, municipal, and reading query URLs at [docs/PLANO-extractos.md:50](docs/PLANO-extractos.md:50).
- **Why it matters:** Query parameters do not alter a static HTML file without the script. A no-JavaScript reader always receives País · Relance, including the incorrect `89,8`; state links merely reload that same state. They retain ordinary navigation and native `<details>` disclosure, but lose scope switching, global density, map selection/search, state announcements, history handling, and theme control.
- **Severity:** **High**

### 7. High: removed and unregistered convergence copy shipped on the home

- **Where:** [dist/index.html:1–2](dist/index.html:1) and the English home include:
  - “Selecione regiões para as pôr na mesma régua.”
  - “O índice compara o PIB per capita…”
  - “descarregar os dados (CSV) ↓”
  - their English equivalents, control labels, and a prose SVG description.
- **What the files say:** [docs/RELOCACOES.md:154](docs/RELOCACOES.md:154) removes the convergence data, meaning, caveat, provenance, and no-script apparatus from the home. The CSV relocation is recorded as having left the home at [line 20](docs/RELOCACOES.md:20). The selection sentence exists on the old board but is neither a registered relocation nor listed as new copy. The register and constitution outrank the board.
- **Why it matters:** This directly violates the controlled-copy rule and Emenda 15’s removal of page self-explanation. The country-reading dump confirms the text becomes visible, at [estados/estado_densidade_leitura.txt:329–361](estados/estado_densidade_leitura.txt:329).
- **Severity:** **High**

### 8. High: the convergence runtime generates displayed numeric states

- **Where:** Both homes load `dist/js/convergencia.js`. It creates numeric SVG labels at [lines 88–130](dist/js/convergencia.js:88), assembles the numeric distance at [line 113](dist/js/convergencia.js:113), and replaces the visible claim value and name at [lines 243–249](dist/js/convergencia.js:243).
- **What the files say:** The stated architecture says displayed strings are pre-rendered and scripts merely select them. This script instead parses a JSON island, creates elements, and writes text. Selecting “all regions” displays each active region’s numeric marker, while `desenhaLeitura()` exposes only the current region’s brief seal.
- **Why it matters:** Some simultaneously visible ruler values therefore lack their own visible seal, and those display states never passed through static HTML checking. The strings originate in ledger-backed JSON, but that is not the required rendering contract.
- **Severity:** **High**

### 9. High: the corrections register omits the director-required row seals

- **Where:** [dist/correcoes/index.html:1](dist/correcoes/index.html:1) renders each entry as `Afirmação: <a><code>row-id</code></a>`. The English page does the same. Its only `src-chip` is the aggregate `correcoes-publicadas` count.
- **What the files say:** Decision §3(c) requires the field check “plus the row’s seal as the door” at [docs/PLANO-extractos.md:13](docs/PLANO-extractos.md:13).
- **Why it matters:** The old/new values and reasons match the row files, and old values are visibly struck through, but the required proof-door form was not implemented.
- **Severity:** **High**

### 10. Medium: 15 study-document destinations are missing

- **Where:** Study pages link to routes such as `/estudos/evora-quinze-anos-cinco-mandatos/documento` and `/en/studies/agua-nao-faturada/document`.
- **What the files say:** No corresponding file or directory exists under `dist`. The full internal scan found **66 broken link occurrences across 15 unique document routes**.
- **Why it matters:** Prominent “Read the document” doors lead to missing pages. Combined with the missing crops, the scan totals 110 unresolved internal references.
- **Severity:** **Medium**

### 11. Medium: the runtime adds a URL state outside the binding closed schema

- **Where:** [dist/js/inicio.js:29–38](dist/js/inicio.js:29) declares bare `?ambito=municipio` as a valid choice state; [lines 202–213](dist/js/inicio.js:202) accept it, and both homes link to it.
- **What the files say:** The binding closed schema at [docs/PLANO-extractos.md:48](docs/PLANO-extractos.md:48) permits only `pais`, five `regiao:<id>` values, and `municipio:<caop-slug>`.
- **Why it matters:** The runtime is internally closed, but it is closed over a different public schema from the one approved.
- **Severity:** **Medium**

### 12. Medium: the approved “A cor” and “A letra” Method copy is absent

- **Where:** Neither [dist/metodo/index.html:1](dist/metodo/index.html:1) nor [dist/en/method/index.html:1](dist/en/method/index.html:1) contains the approved colour or type statement.
- **What the files say:** Decisions §3(g) and §3(h) require those statements after the struck-through correction form and self-hosted type are live, at [docs/PLANO-extractos.md:17–20](docs/PLANO-extractos.md:17). Both conditions are met: the correction form is struck through, and Spectral SC plus its OFL file are present under `dist/tipos/`.
- **Why it matters:** Two explicit director decisions have neither shipped nor been honestly left parked.
- **Severity:** **Medium**

### 13. Medium: the static Évora locator gives unusable accessibility instructions

- **Where:** Both Évora pages contain an SVG labelled “Use the arrow keys…” and `aria-describedby="mapa-descricao"`, for example [dist/municipios/evora/index.html:1](dist/municipios/evora/index.html:1).
- **What the files say:** Neither page contains `id="mapa-descricao"`, and they load only `tema.js`, not the home script that adds keyboard focus and arrow-key handling.
- **Why it matters:** Screen-reader users receive a broken description reference and instructions for controls that do not exist on that page.
- **Severity:** **Medium**

### 14. Medium: some home seals lose the guaranteed 44px target

- **Where:** [dist/_astro/Base._YfnhyiI.css:1](dist/_astro/Base._YfnhyiI.css:1) first gives seals `min-width:44px; height:44px`, then the more specific `.brief-text a.src-chip:after` rule changes that to `min-width:0; height:100%`.
- **What the files say:** The acceptance matrix requires every seal to be its row’s largest target and at least 44px at [docs/PLANO-extractos.md:50](docs/PLANO-extractos.md:50).
- **Why it matters:** Convergence brief seals no longer have a CSS-enforced minimum target. Exact rendered dimensions could not be measured without a browser, but the guarantee is explicitly removed by the cascade.
- **Severity:** **Medium**

### 15. Medium: one receipt title names the wrong economic unit

- **Where:** [dist/livro-razao/divida-publica-2025/index.html:1](dist/livro-razao/divida-publica-2025/index.html:1) has `<title>89,7% do PNB`.
- **What the files say:** The row unit is `% do PIB` at [ledger/claims/divida-publica-2025.yml:10](ledger/claims/divida-publica-2025.yml:10). The visible heading, metadata, and English receipt use PIB.
- **Why it matters:** Browser tabs, history, bookmarks, and search previews misdescribe the measure as a percentage of national product rather than GDP.
- **Severity:** **Medium**

### 16. Low: `inicio.js` assembles a new live-region string

- **Where:** [dist/js/inicio.js:471–481](dist/js/inicio.js:471) joins the current scope label and density with `partes.join(' · ')`.
- **What the files say:** The query values are resolved against closed DOM lists, and the words come from pre-rendered labels. There is no `innerHTML`, raw query interpolation, or displayed numeric arithmetic in `inicio.js`.
- **Why it matters:** It is not an injection risk, but it is still a runtime-created public string rather than selection of a wholly pre-rendered announcement, contrary to the strict runtime rule.
- **Severity:** **Low**

## What passed

- Across both homes, I checked 67 annotated claim occurrences per edition. Apart from the Portuguese `89,8`, static values matched their rows, seals opened their own rows, and no home seal was nested inside a link, button, or `<summary>`.
- I found no static scope bleed in the hidden country, five-region, Évora, or empty-municipality blocks. The Évora state on the home has all eight correct values.
- The English home contains no unexpected Portuguese state, navigation, explanatory, or control copy. Proper names, transcribed source titles, “concelho”, and `[a verificar]` were treated as authorised exceptions.
- Registered home relocations otherwise matched their declared occurrence pattern. The refused unsourced distance strings and prototype/catalogue/dossier copy did not ship.
- The ledger indexes contain all 132 rows in both editions. The municipality indexes contain 308 municipalities and the correct `278 + 19 + 11 = 308` row-backed counts.
- The home has exactly 13 MIP pieces, 4 outside and 9 within, plus eight Social Scoreboard rows.
- Colour selectors are confined to formal threshold states; there are exactly two densities; “por ler”, “Fundo”, “Espécime”, catalogue, and dossier remnants are absent.
- Both maps contain 308 equal, unfilled municipality circles and 308 separate desktop targets. Mobile CSS disables the point targets. Emenda 15 revoked the earlier neutrality sentence, so its absence is correct despite the older checklist wording.
- The ruler uses an ink full-height reference, an ink distance bar, and value ticks. Numeric distances such as `−18` are not defects: the later binding decision at [docs/PLANO-extractos.md:15](docs/PLANO-extractos.md:15) expressly permits them when backed by their own distance rows and seals.
- Home titles, descriptions, canonical URLs, hreflang links, and Open Graph locales are consistent in both editions.

## Row-page coverage

I compared the annotated value, unit, source, document fields, dates, excerpt, derivation/check, derived-from rows, verification entries, corrections, computed-over files, and archive URLs across all 132 Portuguese/English receipt pairs. Those fields matched their YAML rows. The exceptions are the malformed debt seal, its incorrect `<title>`, and the missing crop assets described above.

The required representative sample included:

- `divida-publica-2025`, sourced and independently verified;
- `distancia-alentejo-ue27-2024`, derived;
- `agua-nao-faturada-portugal-2024`, sourced;
- `evora-prr-aprovado-2026`, marker plus archived PRR snapshot;
- `evora-prr-vencido-aprovado-2026`, two archived PRR inputs;
- `municipios-continente-caop-2025`, CAOP row counted from a hosted file;
- `municipios-portugal-caop-2025`, derived CAOP total;
- `evora-populacao-2025`, INE series;
- `evora-despesa-paga-2025`, page-specific document crop;
- `taxa-de-emprego-2025`, Social Scoreboard/Eurostat;
- `pib-pc-portugal-2024`, provisional source flag;
- `correcoes-publicadas`, site-derived count.

The PRR receipts contain the expected one- and two-archive doors respectively, with URLs matching their rows. Network availability of those archives and other external source URLs could not be checked.

## Director decisions in §3

| Decision | Status |
|---|---|
| a. Eight masthead items | Pass |
| b. No “por ler”; empty municipality uses eight empty pieces | Pass |
| c. Correction entries use the row seal as door | **Fail, finding 9** |
| d. `source_flag: p` renders “provisório/provisional” beside the value | Pass |
| e. Numeric distances require their own rows and seals | Pass |
| f. Dark palette and contours | Tokens match; the required contrast rerun/report and screenshots are not present, so **[verify]** |
| g. Approved Method colour statement | **Fail, finding 12** |
| h. Approved Method type statement after self-hosting | **Fail, finding 12** |
| i2/i3. Emendas 10–17 | Core map, panel, density, navigation, and theme structures pass; copy removal and tap-target requirements fail in findings 7 and 14 |

Actual pixel fidelity, responsive composition, focus-return behaviour, and measured contrast could not be verified because no browser was available and the sandbox could not host the static files. The DOM, CSS, JavaScript, supplied boards, and state dumps were still sufficient for the findings above.

I would **not show this home to the director at all in its current form**. The wrong headline value, swapped municipal measures, and neighbouring-row seal make the central “every number has its own proof” promise visibly false, while the proof artifact itself claims those failures cannot exist. Fix the three critical evidence defects first, restore a trustworthy build gate and no-JavaScript state handling, then address the receipt assets, runtime-generated ruler states, removed copy, and explicit §3 omissions before requesting visual approval.
## As plantas (plantas.json)
```json
{
  "commit": "1b54f0f",
  "plantas": [
    {
      "ficheiro": "dist/index.html",
      "descricao": "P1 89,7 → 89,8 na peça da dívida pública, primeira página PT",
      "antes": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,7",
      "depois": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,8",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/livro-razao/divida-publica-2025/index.html",
      "descricao": "P2 a unidade do valor de cabeça da página de linha divida-publica-2025 alterada de «% do PIB» para «% do PNB», PT (a linha diz «% do PIB»)",
      "antes": "% do PIB",
      "depois": "% do PNB",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/en/ledger/index.html",
      "descricao": "P3 o rótulo «Read on» de uma linha do índice inglês do livro-razão em português («Lido a»), 1 de 114 ocorrências",
      "antes": ">Read on<",
      "depois": ">Lido a<",
      "ocorrencia": 7
    },
    {
      "ficheiro": "dist/municipios/evora/index.html",
      "descricao": "P4 os valores da população (58 567) e das empresas (7 907) trocados na página de Évora, cada um com o selo da outra linha",
      "antes": "58 567 / 7 907",
      "depois": "7 907 / 58 567",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/livro-razao/divida-publica-2025/index.html",
      "descricao": "P5 um selo da linha dos preços da habitação aninhado dentro do selo de cabeça da página da dívida pública",
      "antes": "<a class=\"src-chip\" href=\"/livro-razao/divida-publica-2025#prova\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Quadro institucional de indicadores, leitura direta da fonte\" title=\"Quadro institucional de indicadores, leitura direta da fonte\">",
      "depois": "<a class=\"src-chip\" href=\"/livro-razao/divida-publica-2025#prova\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Quadro institucional de indicadores, leitura direta da fonte\" title=\"Quadro institucional de indicadores, leitura direta da fonte\"><a class=\"src-chip\" href=\"/livro-razao/precos-da-habitacao-2025\" data-nonledger=\"proveniencia\"><span class=\"src-chip-texto\">fonte</span></a>",
      "ocorrencia": 1
    }
  ]
}```
