# Segunda leitura cruzada da primeira página v3 (Codex, sem contexto), 2026-08-21, madrugada

*Corrida pelo lugar de direção (Claude Fable 5) sobre a construção em `51950dc` (depois da ronda 2j, a leitura da pré-visualização n.º 1 pelo diretor), antes de atualizar a pré-visualização. Mesmo leitor, mesmo pacote e mesmo prompt da primeira leitura (`2026-08-20-codex-leitura-da-primeira-pagina.md`), sem memória dela; as mesmas cinco plantas, a P1 reancorada no bloco novo do estado vazio (`<p class="vazio-texto" data-vazio>`). A primeira corrida desta leitura foi cortada aos dez minutos por um limite do harness do lugar de direção, sem relatório; a segunda correu destacada até ao fim.*

| planta | apanhada? |
|---|---|
| P1 a população de Évora no estado vazio | **sim** (crítica 2) |
| P2 a frase do Método fora do registo | **sim** (alta 6) |
| P3 a lede do País em EN em português | **não** (segunda vez; o leitor diz a edição inglesa «materialmente mais limpa») |
| P4 89,7 → 89,8 | **sim** (crítica 1) |
| P5 o selo aninhado no `<summary>` | **sim** (alta 3) |

**Quatro de cinco, outra vez.** Fica registado para o plano da leitura final: este leitor não vê uma frase portuguesa numa página inglesa; a revisão de voz da direção é a defesa para essa classe.

## A triagem do lugar de direção

- **Reais, ronda 2k:** (13) a palavra «provisório»/«provisional» falta ao lado das cópias desenhadas em SVG dos seis valores com `source_flag: p` (banda da região, instrumento n.º 1): entra na legenda de selos de cada uma, onde o selo já está; (16) os dois controlos de divulgação por irmão (o «Menu» e a porta móvel da régua) sem `aria-controls` para o conteúdo que abrem: entra o atributo nas duas `<summary>`.
- **Desvio a registar, não defeito:** (17) o selo do mapa no telemóvel a 84px e não os «~140px» da Emenda 3: os 84px são da prancha móvel aprovada, corrigida pelo diretor a 20.08 para que o primeiro valor medido fique no primeiro ecrã (ponto 10a); a prancha tem razão de ser e a constituição é aproximada; fica no registo de desvios do plano.
- **Para o olho do diretor na pré-visualização:** (15) o leitor lê a técnica dos fios (sombra de 1px entre células) como «ainda caixas»; as capturas mostram a grelha de células que o diretor pediu, sem molduras; é o diretor que decide se a forma lhe serve.
- **De desenho da casa, como na primeira leitura:** (4) sem script só o estado por defeito é completo, por construção; (5) e (12) `convergencia.js` e `inicio.js` compõem cadeias pré-validadas e posições; (8) o selo no pé da peça e na legenda dos valores desenhados é a convenção do portão; (9) e (10) `data-prova` e `data-nonledger` são as origens 7 e 3 do portão, com motivo declarado em `ledger/allowlist.yml`, que não cresceu nesta ronda (diff vazio); (11) a decisão (e) proíbe distâncias sem linha, e estas têm linha; (14) os selos-porta do registo de correções são a etapa 4 por decisão (c).
- **Artefacto do pacote:** (7) o `prova.json` não descreve os bytes plantados.

## O relatório, verbatim

The home is not ready for the director. I found **17 findings: 2 critical, 9 high, 5 medium, and 1 low**. The Portuguese default publishes a wrong debt value, and its generic empty-municipality state leaks an Évora population figure. The larger systemic problems are that many measurements are separated from their seals, numerous visible numerals deliberately bypass the ledger, runtime code generates displayed measurements, and the build’s own proof file claims an error-free result that the built HTML contradicts. The English edition is materially cleaner, but it shares most structural and runtime defects.

## Critical

### 1. The Portuguese debt value is wrong

**Where:** [ledger/claims/divida-publica-2025.yml:9](ledger/claims/divida-publica-2025.yml:9) says `value: "89,7"`. [dist/index.html:1](dist/index.html:1) renders `89,8` for `data-claim="divida-publica-2025"`.

The English home correctly renders `89,7`, and [estados/estado_densidade_leitura.txt:78](estados/estado_densidade_leitura.txt:78) also says `89,7`. The dump therefore does not describe the current Portuguese build.

**Why it matters:** this is a direct published-value corruption in the default, no-JavaScript view. The seal reaches the intended row, but the number beside it is not that row’s value.

**Severity: critical.**

### 2. The generic empty-municipality state leaks an Évora value

**Where:** [dist/index.html:7](dist/index.html:7), inside `data-painel="vazio"`, contains:

> `data-claim="evora-populacao-2025"...>58 567</span> pessoas`

It then says:

> `Nenhuma medida foi lida para ... Águeda`

The corresponding ledger row renders `58 567`, with narrow no-break spaces, not ordinary spaces. Its seal also carries the neighbouring study label `Évora — Orçamentado, Pago, Devido 2025`, rather than that population row’s economy-study provenance.

[RELOCACOES.md:12](docs/RELOCACOES.md:12) authorises the eight Évora values only in `Município = Évora`. The empty state should contain eight empty pieces, as required by [direcao.md:89](docs/direcao.md:89).

The fragment also starts `<p class="vazio-texto"><p class="vazio-medida">`, invalid paragraph nesting that causes the browser to close the first paragraph implicitly. The English empty state has no corresponding leaked value.

**Why it matters:** selecting any municipality without a built page can show an Évora figure under that municipality while simultaneously asserting that no measurement exists. This is the clearest possible scope bleed.

**Severity: critical.**

## High

### 3. A housing seal is nested inside the debt disclosure control

**Where:** [dist/index.html:1](dist/index.html:1), in the debt article:

> `<summary class="peca-abrir">...<a class="src-chip" href="/livro-razao/precos-da-habitacao-2025">...fonte</a></summary>`

The debt article later has its proper `divida-publica-2025` seal.

The inserted seal belongs to the housing row and is inside `<summary>`, an interactive disclosure control. [direcao.md:77](docs/direcao.md:77) expressly forbids nesting a seal inside another target.

**Why it matters:** the debt piece exposes a link to a neighbouring claim and creates invalid/conflicting interaction semantics. This is also visible without JavaScript. No equivalent defect appears in English.

**Severity: high.**

### 4. Non-default URL states fail completely without JavaScript

**Where:** all alternative panels in [dist/index.html:1](dist/index.html:1) are statically `hidden`; only País · Relance is exposed. A browser cannot interpret query parameters without the script.

[PLANO-extractos.md:49](docs/PLANO-extractos.md:49) explicitly includes no-JavaScript renders of:

- `/`
- `/?ambito=regiao:alentejo`
- `/?ambito=municipio:beja`
- `/?densidade=leitura`

With scripting ignored, all four render the same País · Relance document.

**Why it matters:** the URL is described as the shareable state, but its non-default states are not represented in the served HTML without runtime execution. This contradicts the acceptance matrix.

**Severity: high.**

### 5. The home loads runtime code that constructs displayed measurements

**Where:** both home files load `/js/convergencia.js`, `/js/inicio.js`, and `/js/tema.js`, in addition to an inline theme script. This contradicts the stated inventory that `inicio.js` is the only home script.

[dist/js/convergencia.js:56](dist/js/convergencia.js:56) calculates positions; lines 60–130 create SVG nodes and displayed labels; line 113 assembles a numeric distance string; lines 195–203 construct the historical numeric label; and lines 243–249 rewrite visible claim values and names.

**What the files require:** runtime may select already rendered strings, not manufacture measurement text or digits.

**Why it matters:** the visible ruler is not solely an audited pre-render. Its numbers and labels can be replaced by arithmetic and DOM construction after load, outside the claimed ledger/render gate.

**Severity: high.**

### 6. Portuguese-only Method copy appears on the home without a place in the relocation register

**Where:** the Portuguese labour-cost piece in [dist/index.html:1](dist/index.html:1) adds:

> `Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador.`

That sentence also appears on [dist/metodo/index.html:1](dist/metodo/index.html:1), but it is not listed under “Texto novo” and cannot be placed as a separately registered relocation. The English labour-cost piece omits it.

[RELOCACOES.md:3](docs/RELOCACOES.md:3) permits no unregistered movement.

**Why it matters:** a substantive editorial assurance was copied onto one edition of the home outside the controlled relocation record, leaving the editions semantically unequal.

**Severity: high.**

### 7. `prova.json` falsely describes this build as error-free

**Where:** [dist/prova.json:3](dist/prova.json:3) says it was generated after “um varrimento sem erros”. Lines 141–142 claim `438` values audited and `0` values without seals.

The current HTML nevertheless contains:

- the wrong `89,8`;
- the incorrectly formatted leaked `58 567`;
- a wrong-row seal inside a summary;
- many claim occurrences without an adjacent seal.

The state dump’s `89,7` also disagrees with the current built HTML.

**Why it matters:** the package’s own release proof cannot be trusted as evidence for the files being reviewed. Either the gate missed these cases or the HTML changed after it ran.

**Severity: high.**

### 8. Many displayed claim occurrences do not have their own seal beside them

**Where:** in both home editions, at least **29 displayed claim occurrences per edition** are structurally separated from their seal:

- 21 panel headline values: the seal comes later in `.peca-pe`, after units, prose, and disclosure content;
- 6 regional-band SVG values: their sealed duplicates appear in a separate legend;
- 2 principal convergence SVG values: they depend on other text or legend content for their seals.

For example, the band in [dist/index.html:7](dist/index.html:7) renders `55`, `77`, `82`, `88`, `89`, and `129` inside SVG labels without a seal in the same measurement unit.

**What the files say:** the constitution and Method say the seal is “ao lado” or “ao pé” of each measurement. The user’s acceptance rule is stricter still: beside every visible number.

**Why it matters:** a reader cannot reliably associate a particular displayed occurrence with its row, especially when several values share one instrument.

**Severity: high.**

### 9. All 18 build-count occurrences per edition bypass ledger rows

**Where:** each home contains 18 `data-prova` occurrences across ten count keys, including:

- `8` panel measures and `4` outside thresholds;
- `1 / 308` municipality coverage;
- `11 / 15` studies and editions;
- agenda counts `4 / 0 / 1 / 0`.

Their strings agree with [dist/prova.json](dist/prova.json), but they link to aggregate pages or `prova.json`, not to individual ledger-row seals.

**Why it matters:** `prova.json` is a build-count file, not a `ledger/claims/*.yml` evidence row. Under the stated rule, these are unsupported visible numbers even when their arithmetic is correct.

**Severity: high.**

### 10. The build introduces an undocumented `data-nonledger` exception

**Where:** [dist/index.html:1](dist/index.html:1) and its English counterpart deliberately tag visible numerals as `data-nonledger`, including:

- update and reference dates;
- formal thresholds `60`, `35`, and `9`;
- ruler endpoints and ticks such as `0`, `100`, `150`, and `−60`;
- instrument numbering such as `n.º 1`.

The eight threshold occurrences are particularly consequential: colour is permitted only because a source allegedly publishes those thresholds, yet the threshold itself is not a ledger row’s `value` with its own seal.

**Why it matters:** none of the supplied rules establishes a general visible-number exemption called `data-nonledger`. The implementation therefore avoids the evidence contract by labelling the exception itself.

**Severity: high.**

### 11. Numeric-distance policy is internally contradictory, and the build chooses one side silently

**Where:** the build prints row-backed distances such as `−18 pontos`, `23`, `22`, `29`, `45`, and `74`. Examples appear in [estados/estado_densidade_leitura.txt:228](estados/estado_densidade_leitura.txt:228) and the regional state dumps.

[direcao.md:84](/private/tmp/claude-501/-Users/nunosantos/b185e650-e114-4dd4-a233-45407e03b19a/scratchpad/codex-inicio/leitura/docs/direcao.md:84), and the acceptance wording in this review, say no printed numeric distance in phase 1. However, [PLANO-extractos.md:15](/private/tmp/claude-501/-Users/nunosantos/b185e650-e114-4dd4-a233-45407e03b19a/scratchpad/codex-inicio/leitura/docs/PLANO-extractos.md:15) explicitly clarifies that row-backed regional distances may render.

**Why it matters:** this cannot be decided from the files because the two binding descriptions disagree. The numbers are row-backed, so they satisfy the later plan clarification, but they fail the literal Emenda/acceptance requirement. The director would be asked to resolve his own rule while viewing the page.

**Severity: high.**

## Medium

### 12. `inicio.js` itself performs more than the permitted state selection

**Where:** [dist/js/inicio.js:275](dist/js/inicio.js:275) copies both municipality name and district; lines 345–355 assemble a live-region sentence; lines 305–309 change SVG radii; lines 694–699 create and append a new SVG circle; and lines 714–723 write the locator’s name, district, and geometry.

I found no `innerHTML`. Query scope and density are resolved against closed lists, unknown values fall back and are normalised, query input is not printed, and this file does not calculate a displayed digit.

**Why it matters:** those positive guards are sound, but the script still exceeds the stated whitelist of toggling pre-rendered state and copying only the municipality name into marked slots.

**Severity: medium.**

### 13. `provisório` is missing beside several rendered copies of provisional values

**Where:** the six GDP-per-capita rows carry `source_flag: p`. Textual and legend copies generally render `provisório`/`provisional`, but SVG copies in the regional band and principal convergence instrument do not. For example, the band labels in [dist/index.html:7](dist/index.html:7) contain the values without the word beside them.

[PLANO-extractos.md:14](docs/PLANO-extractos.md:14) requires the word beside the value wherever `source_flag` is `p`.

**Why it matters:** duplicated visual occurrences lose a qualification that the ledger says must travel with the value.

**Severity: medium.**

### 14. The corrections register lacks the decided row-seal doors

**Where:** the Portuguese and English corrections pages render old/new comparisons and strike through old values, but their row IDs are ordinary code links rather than `■ linha` source seals. The pages have one aggregate source chip, not one seal per comparison.

[PLANO-extractos.md:13](docs/PLANO-extractos.md:13) requires a field-by-field check plus each row’s seal as the door.

**Why it matters:** the comparison form was implemented, but its provenance interaction was not. This means §3 decision c is only partially honoured.

**Severity: medium.**

### 15. Desktop measurement pieces are still boxes

**Where:** [dist/_astro/HomeView.BTt01GtT.css:1](dist/_astro/HomeView.BTt01GtT.css:1) gives `.peca` a background and one-pixel box shadow, with an additional inset treatment on hover.

[direcao.md:91](docs/direcao.md:91) requires pieces without boxes, separated by rules. The mobile rule removes much of the box treatment; desktop does not.

**Why it matters:** this directly misses the final form correction adopted after the design boards.

**Severity: medium.**

### 16. Two disclosure controls disclose sibling content, not their own content

**Where:** both editions use:

> `<details class="nav-menu"><summary ...>Menu</summary></details><nav ...>`

The mobile convergence control follows the same pattern: an empty `<details>` followed by its `.conv-corpo` sibling. CSS uses selectors such as `.nav-menu[open] ~ .nav-principal` to reveal that sibling.

**Why it matters:** visually the toggle works, but the native `<details>` accessibility relationship contains no disclosed content. There is also no `aria-controls` relationship to the sibling. Assistive technology receives an expand/collapse control whose semantic subtree is empty.

The controls otherwise have names, and the state-announcement element uses `role="status"` appropriately.

**Severity: medium.**

## Low

### 17. The mobile map seal is substantially smaller than the adopted target

**Where:** [dist/_astro/HomeView.BTt01GtT.css:1](dist/_astro/HomeView.BTt01GtT.css:1) sets `.movel-selo` and the mobile map width to `84px`.

[direcao.md:78](docs/direcao.md:78) asks for approximately `140px`.

The functional part is correct: the whole seal is the target and individual mobile map points have pointer interaction disabled.

**Why it matters:** the adopted mobile prominence and legibility target was not met, although the interaction model was.

**Severity: low.**

## §3 decision status

| Decision | Status in the build |
|---|---|
| a. Eight masthead items | Honoured in both editions, including Corrections. |
| b. No `por ler`; empty municipality uses coverage words only | Failed in Portuguese because the empty block contains a concrete Évora value and seal. The forbidden wording itself is absent. |
| c. Corrections old/new check plus row seal | Partial: comparison form exists; per-entry seal door does not. |
| d. Provisional word beside every provisional value | Partial: present in textual copies, absent from several SVG copies. |
| e. Numeric distances | Indeterminate because the Emenda wording and the plan’s later clarification conflict. The build follows the row-backed clarification. |
| f. Dark palette | Token colours and inverted contours are present. The required dark-theme contrast report/screenshots are not in the supplied package, so that condition cannot be independently confirmed. |
| g. Exact Method colour sentence | Not shipped. Given the incomplete corrections-door implementation, withholding it is consistent with the decision’s condition. |
| h. Exact Method type sentence | Not shipped. The fonts are self-hosted, but the files do not establish whether the stated stage-4 publication point has occurred. |
| i2. Preview amendments | Mixed: equal dots, neutral map language, light default, theme control, no state strip, and eight empty slots exist; the leaked Évora value and boxed desktop pieces violate the same decision. |

## No-JavaScript result

A reader of the Portuguese `/` without JavaScript gets the masthead and eight navigation doors, País · Relance, the complete country map and map sheet, eight collapsed country pieces, the static convergence instrument, source links, and native `<details>` controls that can still be opened. They lose scope switching, density switching, municipality search and selection, map interaction, URL-state interpretation, theme switching, live announcements, and navigation history handling.

It is not a correct no-JavaScript default because it exposes the wrong `89,8` debt value and the housing seal nested in the debt disclosure. The English default does not share those two content errors, but it loses the same functionality.

## Checks that passed

- All English `data-claim` value strings matched their ledger rows.
- Apart from the debt value and leaked population formatting, the intended Portuguese claim strings matched.
- The eight legitimate Évora home values agree with the Évora municipality page and their ledger rows.
- I found no additional clear cross-scope value bleed in the hidden country, region, or intended Évora blocks.
- Registered R2–R6 occurrence counts, the CAOP citation count, compact source count, and two neutrality-copy occurrences matched the register. I found no refused catalogue, dossier, placeholder, reset-panel door, or other refused item shipped.
- English visible copy contained no unapproved Portuguese leakage. `concelho`, transcribed titles, and `[a verificar]` were treated as the documented exceptions.
- There are exactly two density values, no `Fundo` density, no `por ler`, and no public `Espécime`.
- The static maps contain 308 equal municipality points, with no capital or regional-capital distinction. Coverage is represented by the permitted square pair and accompanied by the neutrality wording.
- Colour is confined to formal threshold states; other information uses ink and grey. Rulers have full-height references, distance bars, and value ticks, and I found no bar on the explicitly reference-free pieces.
- All home source-chip and ordinary internal-link targets checked resolve inside `dist/`.
- Both `<head>` sections contain language-appropriate titles, descriptions, canonical links, alternates, Open Graph locale, and viewport metadata. External canonical reachability cannot be checked without network access.
- Pixel-level correspondence with the design boards, browser-specific layout, external-source truth, and the required dark-theme screenshot/contrast report cannot be established from these static files alone.

I would **not show this home to the director as is**. The two critical defects are enough to stop it, and the stale proof file means the package cannot presently demonstrate that a corrected rebuild is the one being reviewed. Fix the value and empty-state contamination first, then repair and rerun the evidence/seal gate against the final `dist`, eliminate runtime generation of displayed measurements, and resolve the numeric-distance contradiction before arranging a director review.
## As plantas (plantas.json)

```json
{
  "commit": "51950dc",
  "plantas": [
    {
      "ficheiro": "dist/index.html",
      "descricao": "P4 valor 89,7 → 89,8 na peça da dívida pública, PT",
      "antes": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,7",
      "depois": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,8",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/en/index.html",
      "descricao": "P3 a lede do País em EN substituída pela frase portuguesa",
      "antes": "The macroeconomic imbalance scoreboard and the European social scoreboard, with the thresholds the institutions publish.",
      "depois": "O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P1 a população de Évora (58 567, com selo válido para a sua linha) plantada dentro do estado vazio do concelho sem página, PT",
      "antes": "<p class=\"vazio-texto\" data-vazio>",
      "depois": "<p class=\"vazio-texto\" data-vazio><p class=\"vazio-medida\"><span class=\"claim claim-com-chip\"><span data-claim=\"evora-populacao-2025\" class=\"claim-value\">58 567</span> pessoas <a class=\"src-chip\" href=\"/livro-razao/evora-populacao-2025\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Évora — Orçamentado, Pago, Devido 2025\"><span class=\"vh\">Linha do livro-razão: Évora — Orçamentado, Pago, Devido 2025</span><span class=\"src-chip-texto\">fonte</span></a></span></p>",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P2 uma frase da regra 10 do Método acrescentada à peça do custo unitário do trabalho, PT (não está no registo de relocações)",
      "antes": "Custo do trabalho por unidade produzida, por hora trabalhada.",
      "depois": "Custo do trabalho por unidade produzida, por hora trabalhada. Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador.",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P5 um segundo selo da linha dos preços da habitação plantado dentro do <summary> da sua peça (alvo aninhado), PT",
      "antes": "<summary class=\"peca-abrir\"><span class=\"peca-seta\" aria-hidden=\"true\"></span><span class=\"peca-abrir-a\">abrir</span><span class=\"peca-abrir-f\">fechar</span></summary>",
      "depois": "<summary class=\"peca-abrir\"><span class=\"peca-seta\" aria-hidden=\"true\"></span><span class=\"peca-abrir-a\">abrir</span><span class=\"peca-abrir-f\">fechar</span> <a class=\"src-chip\" href=\"/livro-razao/precos-da-habitacao-2025\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Quadro institucional de indicadores, leitura direta da fonte\"><span class=\"vh\">Linha do livro-razão: Quadro institucional de indicadores, leitura direta da fonte</span><span class=\"src-chip-texto\">fonte</span></a></summary>",
      "ocorrencia": 1
    }
  ]
}```
