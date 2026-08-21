# Leitura cruzada final do ramo (Codex, sem contexto), 2026-08-21, noite: o sítio inteiro antes da fusão

*Sobre a construção em `41161d6` (depois da etapa 5). Leitor e método das leituras anteriores; o prompt alargado ao sítio inteiro e aos registos dos cartões; o pacote com os recortes e os documentos alojados (sem os 532 PNG, de propósito). Cinco plantas: P1 89,7 → 89,8 na primeira página; P2 uma palavra da frase governada «A cor» na página do Método («só onde» → «sempre que»); P3 valor antigo e novo trocados numa entrada do registo de correções; P4 uma edição com data nula a mostrar «Publicação: 2026-08-12»; P5 um registo de cartão com 89,6 contra a linha 89,7. **Cinco de cinco** (achados 1, 2, 3, 8, 4).*

## Triagem do lugar de direção

- **Nenhum defeito novo.** (5) os PNG dos cartões não foram dados ao leitor; (6) o runtime da convergência compõe cadeias da ilha conferida pelo portão, como nas quatro leituras anteriores; (7) as páginas sem cartão próprio nomeiam o cartão da primeira página da sua edição, e o registo di-lo no campo `cobre`, como o plano §5 fixou; (9) os despejos e a prova não descrevem os bytes plantados; (10) um documento alojado traz a sua ilha de dados duas vezes nos bytes originais do motor: pedido ao motor (I60), não se tocam os bytes aqui.
- O veredicto do leitor («não fundir como está») assenta nas cinco plantas e nos PNG ausentes do pacote; sem elas, o que resta são as posições de desenho da casa já triadas.

## O relatório, verbatim

Do not merge this build as it stands. I found **10 findings: 1 critical, 5 high, 3 medium, and 1 low**. The ledger receipts are unusually consistent, but the release surface is not: the Portuguese home publishes a wrong fiscal value, governed Method copy was altered, a correction is reversed, one card contains another wrong value, every referenced card image is absent, and the home’s convergence runtime creates visible figures without seals. Most generated HTML is minified, so line 1 or 2 represents the full document; quoted fragments identify the exact element.

## Ranked findings

### 1. **Critical — the Portuguese home publishes the wrong public-debt value**

- **Where:** [dist/index.html:1](dist/index.html:1), fragment:  
  `data-claim="divida-publica-2025"...>89,8</div>`
- **Required value:** [ledger/claims/divida-publica-2025.yml:9](ledger/claims/divida-publica-2025.yml:9) says `value: "89,7"`.
- The Portuguese and English row receipts, and the English home, correctly show `89,7`.
- **Why it matters:** this violates the central value-as-exact-string rule and makes the no-JavaScript default factually wrong. It was also the only mismatch among 980 static `data-claim` occurrences checked across all HTML.

### 2. **High — the governed Portuguese Method text is not verbatim**

- **Where:** [dist/metodo/index.html:2](dist/metodo/index.html:2) says:  
  `A cor aparece sempre que a fonte publica um limiar`
- **Governed source:** [docs/metodo.mjs:113](docs/metodo.mjs:113) says:  
  `A cor aparece só onde a fonte publica um limiar`
- **Why it matters:** “always when” and “only where” are not character-for-character matches and carry different meanings. The remaining Method text, including the English edition, matched; both About editions matched `docs/sobre.mjs`.

### 3. **High — the Portuguese corrections register reverses old and new values**

- **Where:** [dist/correcoes/index.html:2](dist/correcoes/index.html:2), entry `pib-pc-alentejo-2024`, renders:
  - old, struck through: `77`
  - new: `77,2`
- **Row history:** [ledger/claims/pib-pc-alentejo-2024.yml:42](ledger/claims/pib-pc-alentejo-2024.yml:42) records `old_value: "77,2"` and `new_value: "77"`.
- **Why it matters:** the public audit trail states the opposite of the row’s correction history and fails §3(c). The English register is correct. Every other correction/update pair matched, and every entry did carry a seal to its own row.

### 4. **High — one share-card specification contains a third, wrong debt value**

- **Where:** [dist/cartoes/livro-razao-divida-publica-2025.pt.1200x630.json:17](dist/cartoes/livro-razao-divida-publica-2025.pt.1200x630.json:17) contains `"89,6% do PIB"`.
- The same JSON’s structured `valores` array says `89,7`, as does the row.
- **Why it matters:** a generated share card would publish a value different from both the evidence row and the page. This was the only copy-value mismatch found across the row-card specifications.

### 5. **High — all Open Graph and Twitter card images are missing**

- `dist/cartoes/` contains **532 JSON files and zero PNG files**.
- The 307 ordinary site pages contain **614 missing image references**, representing 532 unique `.png` targets. For example, [dist/sobre/index.html:1](dist/sobre/index.html:1) names:
  - `/cartoes/inicio.pt.1200x630.png`
  - `/cartoes/inicio.pt.1200x600.png`
- The JSON specifications even record expected filenames, byte sizes and digests, but the corresponding files are absent.
- **Why it matters:** the static production output will return missing assets for every `og:image` and `twitter:image`. Nothing in the supplied files establishes a deployment-time renderer.

### 6. **High — the home runtime generates visible numeric content without seals**

`dist/js/inicio.js` itself respects the main restrictions: it has no executable `innerHTML`, resolves query values against page-owned closed lists at [lines 202–218](dist/js/inicio.js:202), and does not print query input.

However, both home editions also load `dist/js/convergencia.js`:

- It clears the server-rendered SVG groups at [lines 88–91](dist/js/convergencia.js:88).
- It performs value and geometry arithmetic at [lines 56–57](dist/js/convergencia.js:56) and [102–108](dist/js/convergencia.js:102).
- It constructs visible numeric distance text at [line 113](dist/js/convergencia.js:113), current values at [line 126](dist/js/convergencia.js:126), and historical values at line 202.
- The generated `<text class="mk-val">` elements receive neither `data-claim` nor a seal. Selecting “all” therefore exposes multiple unsealed values.
- It immediately performs this rebuild at [line 367](dist/js/convergencia.js:367).

**Why it matters:** the page runtime is not limited to revealing pre-rendered strings, and visible values produced after interaction do not meet the value-and-own-seal contract.

### 7. **Medium — 41 pages use a card record whose route names the home**

- Example: [dist/sobre/index.html:1](dist/sobre/index.html:1) uses `inicio.pt.1200x630.png`.
- Its specification, [dist/cartoes/inicio.pt.1200x630.json:2](dist/cartoes/inicio.pt.1200x630.json:2), declares `"rota": "/"`, not `/sobre`.
- The same generic PT/EN home records are reused across 41 non-home pages. A `cobre` list does not make the record’s `rota` match the page that names it.
- **Why it matters:** this violates the explicit card route contract and makes card provenance ambiguous. All 264 row pages and both actual home pages had matching route and edition.

### 8. **Medium — one study publication date is internally contradictory**

For the Portuguese edition of “Évora — Orçamentado, Pago, Devido 2025”:

- [dist/estudos/index.html:1](dist/estudos/index.html:1) renders `Publicação: 2026-08-12`.
- [dist/en/studies/index.html:1](dist/en/studies/index.html:1) renders `Published: [a verificar]` for that same PT edition.
- Its own study page, [dist/estudos/evora-orcamentado-pago-devido-2025/index.html:1](dist/estudos/evora-orcamentado-pago-devido-2025/index.html:1), also says `Publicação: [a verificar]` and separately gives `Última atualização: 2026-08-20`.
- **Why it matters:** at least one rendering is wrong, and the supplied files contain no archive metadata source that validates `2026-08-12`. The date must not be inferred from `updated`.

### 9. **Medium — the state dumps and build proof do not describe the supplied build**

- [estados/estado_densidade_leitura.txt:80](estados/estado_densidade_leitura.txt:80) contains the correct `89,7`, unlike the current PT HTML.
- The same dump still contains the relocated home CSV door at [line 361](estados/estado_densidade_leitura.txt:361). `R13` requires that door to live on the ledger, and the current HTML correctly implements that relocation.
- The municipality-reading dump has both discrepancies as well.
- [dist/prova.json:2](dist/prova.json:2) claims it followed a scan “sem erros”, yet the supplied bundle contains the value, Method, corrections and card defects above. It contains no content digest binding it to these exact files.
- **Why it matters:** the review artifacts cannot be used as evidence that this package passed the recorded gate.

### 10. **Low — one hosted document contains a duplicated 606 KB JSON payload and duplicate ID**

- [document/index.html:373](dist/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/documento/index.html:373) and [line 490](dist/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/documento/index.html:490) both contain `<script type="application/json" id="rcpt-data">`.
- The two approximately 606 KB payloads are byte-identical.
- **Why it matters:** duplicate IDs are invalid DOM and the duplicate payload unnecessarily enlarges the document. Because hosted documents are supposed to retain exact bytes, this should be corrected upstream rather than stripped during site assembly.

## Acceptance checks that otherwise passed

- **Rows and receipts:** all 264 bilingual row pages were compared against their YAML rows. Value, unit, source, document title/edition/locator/URLs, dates, excerpt, verification records, corrections, derivation, dependencies, flags and notes matched. Receipt doors were present and correctly targeted.
- **Manual row sample:** `divida-publica-2025`, `distancia-alentejo-ue27-2024`, `agua-nao-faturada-portugal-2024`, `evora-prr-aprovado-2026`, `municipios-portugal-caop-2025`, `evora-populacao-2025`, `pib-pc-alentejo-2024`, `evora-prr-execucao-2026`, `municipios-continente-caop-2025`, and `saldo-natural-portugal-2025`. This covers sourced, derived, marker, PRR archived-copy, CAOP-counted and INE-series rows.
- **Seal structure:** no static source seal was nested inside another link, button or `<summary>`. Static home seals pointed to their own rows.
- **Scope:** no static scope bleed was found, including hidden blocks. Country, the five regions, Évora and the empty-municipality state keep their content separated.
- **Relocations and language:** current home occurrence counts match the register; refused copy is absent; the convergence CSV door moved to the ledger. No disallowed Portuguese interface copy was found in the English home. Permitted `concelho`, source titles and `[a verificar]` were not treated as defects.
- **Emendas:** two densities only; no `Fundo`, `por ler`, catalogue or dossier remnants; the MIP panel has 13 rows, 4 outside and 9 within; the Social Scoreboard has 8; the map has 308 equal round points and no default status highlight; the later Emenda 15 correctly revokes the earlier neutrality legend. Static rulers use the required reference/bar/tick grammar.
- **Numeric distances:** §3(e) expressly clarifies that the prohibition concerns numeric distances **without a row**. The row-backed derived distances are therefore allowed; the refused unsourced prototype distances are absent. The runtime generation in finding 6 remains independently defective.
- **§3 decisions:** (a) and (b) pass; (c) fails through finding 3; (d) passes on static claim surfaces but the runtime breaks the broader seal rule; (e) passes under its explicit clarification; (g) fails through finding 2; (h) passes. The frame-phrase target and catalogue/dossier work are openly parked as named deviations rather than silently shipped.
- **Accessibility and links:** no unnamed interactive controls, broken `aria-controls`/`aria-labelledby` references, missing image alternatives or nested interactive elements were found. Internal content links and fragments resolve, apart from the missing card images. Canonical, language-alternate and locale metadata are structurally consistent.
- **No JavaScript:** the served Portuguese HTML shows the full Country · At a glance page: map, 13 MIP pieces, Social list, Portugal convergence reading, navigation and native `<details>`. It loses scope and density switching, search/map selection, the convergence controls and theme switching. It is not a correct default because it displays `89,8`.

Exact-byte equality of the 15 hosted documents could not be established because no original document copies or independent hashes are supplied; I could only confirm that they do not load the site stylesheet. External source and archive URL availability also cannot be tested without network access. The claimed browser acceptance matrix and exact visual match to the boards cannot be independently reproduced from its absent test evidence.

I would **not merge this site as is**. I would merge it after the critical and high defects are fixed, the contradictory study/card-route and stale-proof issues are resolved, all card PNGs are actually generated, and a fresh content-bound gate is run against the exact release directory. The rebuild is repairable; the consistent receipts mean it does not need to be rejected wholesale, but its current public evidence surface is not trustworthy enough for production.
## As plantas (plantas.json)
```json
{
  "commit": "41161d6",
  "plantas": [
    {
      "ficheiro": "dist/index.html",
      "descricao": "P1 89,7 → 89,8 na primeira página PT",
      "antes": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,7",
      "depois": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,8",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/metodo/index.html",
      "descricao": "P2 a frase governada «A cor» alterada numa palavra («só onde» → «sempre que») na página do Método PT; metodo.mjs no pacote diz «só onde»",
      "antes": "A cor aparece só onde a fonte publica um limiar: âmbar",
      "depois": "A cor aparece sempre que a fonte publica um limiar: âmbar",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/correcoes/index.html",
      "descricao": "P3 no registo de correções, a entrada de pib-pc-alentejo-2024 com o valor antigo (77,2) e o novo (77) trocados",
      "antes": "77,2 / 77",
      "depois": "77 / 77,2",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/estudos/index.html",
      "descricao": "P4 uma edição com data nula no índice dos estudos a mostrar «Publicação: 2026-08-12» (a data updated), PT",
      "antes": "Publicação: [a verificar]",
      "depois": "Publicação: 2026-08-12",
      "ocorrencia": 3
    },
    {
      "ficheiro": "dist/cartoes/livro-razao-divida-publica-2025.pt.1200x630.json",
      "descricao": "P5 o registo do cartão da página divida-publica-2025 (PT, 1200×630) com o valor 89,6 enquanto a linha diz 89,7",
      "antes": "89,7",
      "depois": "89,6",
      "ocorrencia": 1
    }
  ]
}```
