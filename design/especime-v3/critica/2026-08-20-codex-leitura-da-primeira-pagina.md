# Leitura cruzada da primeira página v3 (Codex, sem contexto), 2026-08-20, noite

*Corrida pelo lugar de direção (Claude Fable 5) antes da pré-visualização n.º 1, sobre a construção em `009d8e6` (ramo `redesenho-v3`). Leitor: Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, sem rede, só leitura, numa pasta fora dos repositórios, com: o `dist/` inteiro (sem os documentos alojados), `ledger/claims/`, os despejos de texto dos estados da matriz, a constituição com as Emendas, o registo de relocações, as chaves PT→EN, os extratos do plano (§3 decisões, §13 esquema) e as duas pranchas vivas. Sem scripts, sem notas, sem capturas. **Cinco estragos plantados em cópias do `dist`** (nunca no repositório), registados antes da leitura em `plantas.json` com o resumo de cada ficheiro do pacote:*

| planta | o quê | apanhada? |
|---|---|---|
| P1 | a população de Évora (58 567, com selo válido) dentro do estado vazio do concelho sem página, PT | **sim** (crítica 2) |
| P2 | uma frase da regra 10 do Método acrescentada à peça do custo unitário, PT, fora do registo | **sim** (alta 6) |
| P3 | a lede do País em EN substituída pela frase portuguesa | **não** (a lede plantada não é nomeada; o achado 7 aponta a linha de método, que é identidade e fica em português por decisão, e sete «provisório» em EN, que são um defeito real e não uma planta) |
| P4 | 89,7 → 89,8 na peça da dívida pública, PT | **sim** (crítica 1) |
| P5 | um segundo selo, da linha dos preços, dentro do `<summary>` da peça da dívida (alvo aninhado) | **sim** (alta 3) |

**Quatro de cinco.** Tokens do leitor: o CLI não imprimiu a contagem nesta corrida.

## A triagem do lugar de direção, achado a achado

Conferido na construção real (sem plantas) antes de decidir:

- **Reais, a corrigir na ronda 2i:** (5) `regiao:portugal` aceite como região, com cabeça «Portugal · região» (erro do brief da etapa 2, que mandou seis fichas; a prancha tem cinco regiões e Portugal como ponto de referência na banda); (7, segunda parte) **sete «provisório» na edição inglesa** (12 «provisional» e 7 «provisório» em `dist/en/index.html`: os painéis regionais e o instrumento da convergência recebem a palavra em português); (8) os pontos do mapa não são iguais (Évora 13×13, os outros 9×9), o concelho escolhido enche a tinta como se tivesse página, a legenda de neutralidade desaparece com a ficha no modo localizador, e no telemóvel os pontos continuam ativáveis por teclado; (9) o vestígio «CAMADA 3 — FUNDO» e a classe `deep` do instrumento v2; (16) onze `svg.regua-svg` com `role="img"` sem nome acessível, e os controlos com `role="button"` sem ativação por espaço; (18) `<script src="/js/inicio.js">` depois de `</html>`; (6) o registo de relocações com contagens desatualizadas (R3 o texto da CAOP duas vezes por edição; R4 a frase regional na manchete, na peça e no instrumento; `distancia-alentejo-ue27-2000` por listar).
- **De desenho da casa, não defeitos:** (4) os números do próprio sítio levam porta e não selo (`IDENTIDADE.md` §10) e os limiares publicados levam motivo declarado (`limiar-do-quadro`); o prompt da leitura enunciou a regra de forma absoluta; (10) as distâncias regionais impressas têm linha cada uma (`distancia-*-ue27-2024`, `distancia-setubal-grande-lisboa-2024`) e o plano §4 autoriza-as; a decisão (e) proíbe distâncias **sem linha**; a redação do plano é clarificada; (11) `convergencia.js` compõe os rótulos a partir de uma ilha de dados que o portão confere (secção 1 do varrimento) e só calcula posições; (13) a região viva concatena duas cadeias pré-validadas, o círculo do cursor é decoração, o nome e o distrito vêm da ilha da CAOP; (7, primeira parte) «Portugal, medido. Cada número tem fonte.» é a linha de método, identidade, em português nas duas edições por decisão.
- **Artefactos do pacote:** (12) o `prova.json` não descreve os bytes plantados, de propósito; (14) o defeito do sem-script é o das plantas; (17) as capturas e a matriz não foram dadas ao leitor.
- **Conhecidos e abertos:** (15) os selos em contexto de prosa do instrumento v2 sem 44px (ISSUES I13, I14).

## O relatório, verbatim

The home is not director-ready. I found **18 findings: 2 critical, 10 high, 5 medium, and 1 low**. The main blockers are a false headline value, Évora data leaking into every unsupported municipality in Portuguese, a source seal pointing to the wrong row, widespread numbers outside the ledger/seal system, an invalid “Portugal · region” state, and runtime code that reconstructs a retired third density. The supplied build proof cannot describe the current files.

## Critical

1. **The Portuguese public-debt value is false.**

   - **Where:** [dist/index.html:7](dist/index.html:7), `data-claim="divida-publica-2025">89,8`.
   - **Required:** [ledger/claims/divida-publica-2025.yml:9](ledger/claims/divida-publica-2025.yml:9) says `value: "89,7"`. The English home correctly renders `89,7`.
   - **Why it matters:** This is a prominent measured value and is visible in the default País · Relance state, including without JavaScript.
   - **Severity:** Critical.

2. **Évora’s population leaks into every unsupported municipality in the Portuguese edition.**

   - **Where:** [dist/index.html:7](dist/index.html:7), inside `data-painel="vazio"`: `evora-populacao-2025`, `58 567 pessoas`.
   - **Required:** The empty state must say that no measure has been read for the selected concelho. [PLANO-extractos.md:23](docs/PLANO-extractos.md:23) requires coverage words only; [CHAVES-EN.md:90](docs/CHAVES-EN.md:90) supplies the empty-state sentence. `inicio.js` routes every municipality without its own block to `vazio` at [lines 190–192](dist/js/inicio.js:190).
   - **Additional error:** The row value is `58 567` with narrow no-break space in [evora-populacao-2025.yml:9](ledger/claims/evora-populacao-2025.yml:9), not ASCII-spaced `58 567`. Its seal label also names the wrong Évora study.
   - **Why it matters:** Selecting Beja, Águeda, or any other unbuilt concelho produces an Évora figure directly above text saying no measure exists.
   - **Severity:** Critical.

## High

3. **The public-debt control contains a neighbour’s seal, nested inside `<summary>`.**

   - **Where:** [dist/index.html:7](dist/index.html:7): the public-debt `<summary>` contains a seal linking to `/livro-razao/precos-da-habitacao-2025`.
   - **Required:** It should point to `divida-publica-2025`, and [direcao.md:77](docs/direcao.md:77) explicitly forbids nesting a seal in another target.
   - **Why it matters:** It opens the housing-prices evidence row from a debt control and creates nested interactive behavior. A later correct debt seal does not neutralise the wrong one.
   - **Severity:** High.

4. **The home systematically bypasses the “every number has its row and seal” rule.**

   - **Where:** Both homes contain **18 `data-prova` number instances per edition** and many `data-nonledger` numeric nodes. Examples include headline `8` and `4`, agenda `4` and `0`, map `1` and `308`, thresholds `60`, `−35`, and `9`, dates, periods, scales, and `n.º 1`.
   - **Required:** The task’s evidence rule requires each visible number to be a row value beside its own seal.
   - **What does pass:** All 18 `data-prova` instances match [dist/prova.json](dist/prova.json). That proves the counts, but does not give their occurrences ledger-row seals.
   - **Why it matters:** `data-prova` and `data-nonledger` currently operate as exemptions from the declared evidence model.
   - **Severity:** High.

5. **The URL vocabulary wrongly accepts Portugal as a region.**

   - **Where:** Both homes pre-render `data-cabeca="regiao:portugal"` with the label `Portugal · região/region`, plus a matching panel and Region chip; see [dist/index.html:1](dist/index.html:1).
   - **Required:** [PLANO-extractos.md:46](docs/PLANO-extractos.md:46) closes Region to five IDs and excludes Portugal.
   - **Runtime cause:** [inicio.js:87–93](dist/js/inicio.js:87) accepts every `regiao:*` represented by a head block, so `?ambito=regiao:portugal` is treated as valid.
   - **Why it matters:** A country is mislabeled as a region, and the closed URL schema is no longer the decided schema.
   - **Severity:** High.

6. **The relocation register is breached in content and occurrence counts.**

   - **Unregistered copy:** The Portuguese labour-cost piece includes: “Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador.” It comes from the Method page, is absent from the English piece, and appears in neither the relocation table nor “Texto novo.”
   - **R3 count:** The full CAOP source text occurs twice per edition, while [RELOCACOES.md:13](docs/RELOCACOES.md:13) authorises `1 → 1`.
   - **R4 count:** Each regional distance sentence appears in the regional headline, again in its regional panel piece, and again in the legacy Country instrument. [RELOCACOES.md:14](docs/RELOCACOES.md:14) records only the Country instrument plus one regional headline.
   - **Unlisted row:** `distancia-alentejo-ue27-2000` is printed three times but is absent from R4’s explicit row list.
   - **Why it matters:** The home no longer has a defensible inventory of where its text and values came from.
   - **Severity:** High.

7. **The English edition contains untranslated Portuguese interface copy.**

   - **Where:** [dist/en/index.html:1](dist/en/index.html:1) retains `Portugal, medido. Cada número tem fonte.`
   - **Also:** Seven pre-rendered provisional labels say `provisório`, including regional panels and the legacy convergence instrument at [dist/en/index.html:7](dist/en/index.html:7).
   - **Required:** [CHAVES-EN.md:36](docs/CHAVES-EN.md:36) specifies `provisional`. Neither leak is an allowed transcribed title or `[a verificar]`.
   - **Why it matters:** At least one Portuguese label is visible in every selected regional state.
   - **Severity:** High.

8. **The map violates point neutrality and can misstate coverage.**

   - **Unequal points:** Both homes render 307 points at `9×9`, but Évora at `13×13`; see [dist/index.html:1](dist/index.html:1). [direcao.md:78](docs/direcao.md:78) permits only the filled/empty coverage distinction.
   - **False coverage signal:** [inicio.js:280–282](dist/js/inicio.js:280) adds `mun-escolhido`; CSS fills that class in ink, making an unbuilt selected concelho look covered.
   - **Missing legend in locator mode:** [inicio.js:270–278](dist/js/inicio.js:270) hides the ficha containing the neutrality legend while retaining the locator map.
   - **Mobile exception:** Pointer targets are disabled in mobile CSS, but the map remains keyboard-selectable point by point through Enter/Space at [inicio.js:706–714](dist/js/inicio.js:706).
   - **Severity:** High.

9. **A third “Fundo” density remains.**

   - **Where:** Both homes retain `<!-- CAMADA 3 — FUNDO -->` followed by `<details class="deep">`; see [dist/index.html:14](dist/index.html:14).
   - **Required:** [direcao.md:77](docs/direcao.md:77) leaves exactly Relance and Leitura breve; Fundo becomes the row receipt, not an on-home layer.
   - **Why it matters:** The visible density controls have two choices, but the old third layer and its substantial prose remain in the DOM and can be opened.
   - **Severity:** High.

10. **Numeric distances are printed extensively.**

   - **Where:** Each edition contains **25 pre-rendered distance-value instances**, covering eight distinct distance rows such as `18`, `29`, `45`, `74`, `11`, `12`, `23`, and `22`.
   - **Required:** The review criterion and the director’s words-only decision in [PLANO-extractos.md:15](docs/PLANO-extractos.md:15) say no printed numeric distance in phase 1.
   - **Conflict in the supplied rules:** [PLANO-extractos.md:40](docs/PLANO-extractos.md:40) separately permits seven row-backed distances. These instructions cannot all be true literally. Under the explicit acceptance criterion in the request, the build fails; the historical `22` is not even listed in R4.
   - **Severity:** High.

11. **The home loads a second script that generates visible content.**

   - **Where:** [dist/index.html:14](dist/index.html:14) and the English equivalent load `/js/convergencia.js` as well as `inicio.js`.
   - **Behavior:** [convergencia.js:56–114](dist/js/convergencia.js:56) performs ruler arithmetic, creates SVG nodes, and assembles a displayed numeric-distance label. Lines [118–203](dist/js/convergencia.js:118) generate names, values, and historical labels; [243–249](dist/js/convergencia.js:243) replace the visible claim and name.
   - **Why it matters:** This directly violates the pre-render-only runtime contract and explains why the retired convergence interface survives.
   - **Severity:** High.

12. **`prova.json` is stale or its gate was bypassed.**

   - **Where:** [dist/prova.json:137](dist/prova.json:137) reports `460` audited values and `0` values without seals after a sweep “without errors.”
   - **Contradiction:** The current HTML contains two exact value-string failures and a neighbour’s seal in a prohibited ancestor.
   - **Why it matters:** The build’s own proof cannot be presented as evidence for these bytes. At minimum, the HTML changed after the proof was generated.
   - **Severity:** High.

## Medium

13. **`inicio.js` itself exceeds the stated mutation boundary.**

   - It assembles a new live-region string at [lines 299–307](dist/js/inicio.js:299), creates a cursor circle at [line 623](dist/js/inicio.js:623), and writes name and district readouts at [lines 645–652](dist/js/inicio.js:645).
   - No `innerHTML` exists, raw query input is not displayed, and proximity arithmetic does not print a digit. Query resolution is closed except for the erroneous `regiao:portugal` block.
   - **Severity:** Medium.

14. **The no-JavaScript guarantee is false for the current bytes.**

   - **What the reader gets:** País · Relance, the Country headline and panel, full map/ficha, native per-measure `<details>`, normal navigation fallbacks, and Portugal’s server-rendered convergence rule.
   - **What is lost:** whole-page scope/density switching, search filtering, point/readout interaction, proximity results, state announcements, history handling, and state-preserving language switching. `/?densidade=leitura` reloads the same static default; readers must open individual measures.
   - **Defect:** The default is not “complete and correct” because it exposes the false `89,8`, the wrong nested seal, and the unequal map point.
   - **Severity:** Medium.

15. **Several source seals cannot meet the required 44-pixel target.**

   - **Where:** [HomeView.CuxgxuIO.css:1](dist/_astro/HomeView.CuxgxuIO.css:1) overrides the normal 44-pixel pseudo-target for `.compo-n`, `.glance`, `.brief-text`, and `.prov-vals` seals with `min-width:0; height:100%`.
   - **Why it matters:** These inline contexts have line boxes smaller than 44 pixels, contrary to the acceptance matrix in [PLANO-extractos.md:48](docs/PLANO-extractos.md:48).
   - **Severity:** Medium.

16. **The controls and ruler graphics have provable accessibility gaps.**

   - Both homes contain 11 `<svg class="regua-svg" role="img">` elements without `aria-label`, `aria-labelledby`, `<title>`, or `<desc>`.
   - [inicio.js:152–159](dist/js/inicio.js:152) changes scope and density anchors into `role="button"` controls, but supplies no Space-key activation. Native anchors activate with Enter, not Space.
   - Search-result changes have no dedicated result-count/live announcement.
   - **Severity:** Medium.

17. **The required acceptance evidence is absent.**

   - [PLANO-extractos.md:48](docs/PLANO-extractos.md:48) requires a line-by-line report for focus order, both languages/themes, four widths, reduced motion, history, reload, invalid queries, no-JavaScript, seal targets, and contrast.
   - No such report or screenshots exist in the supplied files. The five state dumps do not cover that matrix.
   - **Cannot be checked:** The complete dark-theme contrast rerun and visual fidelity at 320/390/768/1280 remain `[verify]`.
   - **Severity:** Medium.

## Low

18. **`inicio.js` is placed after the closed document.**

   - **Where:** Both files end with `</body></html><script src="/js/inicio.js" defer></script>`; see [dist/index.html:14](dist/index.html:14).
   - **Why it matters:** Browsers will generally recover by moving it into the body, but the output is invalid HTML and makes execution order dependent on parser recovery.
   - **Severity:** Low.

## Director decisions and checks that passed

| Decision/check | Result |
|---|---|
| Eight masthead items, including Corrections | Pass in both editions |
| No `por ler` | Pass |
| Empty municipality uses coverage rather than a fifth state | Partial: vocabulary passes, but the Portuguese Évora claim breaks the empty state |
| `provisório` beside all six `source_flag: p` rows | Present, but seven English occurrences are untranslated |
| Words-only distance | Fail under the explicit acceptance criterion; the plan itself conflicts at §40 |
| Dark tokens and ink-coloured marker contours | Present in CSS; complete audit evidence unavailable |
| Corrections seal form; Method colour/type sentences | Honestly parked to stages 3/4 by the supplied register; their final wording cannot be checked because §12 is not included |
| Time signal remains ink | Pass |
| No catalogue/dossier block, placeholder, or door | Pass |
| Refused copy | None of the listed refused phrases shipped |
| Colour limited to formal threshold states | The home CSS follows this rule |
| Internal links | All local paths and fragments referenced by the homes resolve within `dist/` |
| Head metadata | Language, title, description, canonical, hreflang, Open Graph URL, and locale are consistent |
| Remaining claim strings | 149 of 151 `data-claim` instances match their ledger value exactly |

I would **not show this home to the director at all yet**. The reason is not presentation polish: the current package breaks its central evidence promise in a visible headline, leaks one municipality’s data into others, and carries a proof file that says those failures cannot exist. Fix the critical and high findings, resolve the numeric-distance rule conflict explicitly, remove the legacy runtime/Fundo layer, and regenerate the proof and full acceptance report before a director review.
## O prompt, verbatim

```
You are reviewing the rebuilt home page of a bilingual statistical website before it is shown to its director. You have no other context and should not assume any. Work only from the files in this directory. There is no network. Do not edit any file.

What is here:
- `dist/`: the site as built (static HTML, CSS, JS). The pages under review are `dist/index.html` (Portuguese edition) and `dist/en/index.html` (English edition), plus `dist/js/inicio.js`, the only script the home loads. The other pages are context: in particular `dist/municipios/evora/` and `dist/en/municipalities/evora/` (the municipality page whose measures the home repeats in one of its states), `dist/livro-razao/<id>/` (one page per ledger row, the destination of every «fonte» seal), and `dist/prova.json` (the site's own counts, computed at build time).
- `ledger/claims/*.yml`: the evidence rows. Every number on a page must be the `value` of a row, rendered as the same string (Portuguese formatting: comma decimal, thin space thousands, true minus), beside a seal that links to that row's page.
- `estados/*.txt`: text dumps of the home's DOM in several states (the page is stateful: scope País · Região · Município and density Relance · Leitura breve, driven by the URL query; all states are pre-rendered in the HTML and the script only shows or hides them).
- `docs/direcao.md`: the visual constitution; its «Emendas · 2026-08-20» at the end take precedence over everything above them. `docs/RELOCACOES.md`: the register of every text and value authorised to move onto the home from another route, with source, destination, scope, language, occurrence counts, and the list of what was refused; anything on the home that is neither a registered relocation nor listed there as «Texto novo» is a defect. `docs/CHAVES-EN.md`: the decided state vocabulary (PT → EN) and the new strings with their English. `docs/PLANO-extractos.md`: the director's decisions that bind this build (§3) and the URL state schema and acceptance matrix (§13). `docs/V3Completo.dc.html` and `docs/V3Movel.dc.html`: the approved design boards (desktop, mobile); the constitution and the register win over the boards where they disagree.

Your task is adversarial: find where the built home is wrong, and rank what you find. Check, at least:
1. **Values against rows**: every number visible in any state of the home (both editions) equals its row's `value` string exactly, carries a seal to its own row (not a parent's, not a neighbour's), and the seal is never inside another link, button or `<summary>`.
2. **Scope bleed**: no value, sentence or label of one scope appears inside another scope's block (an Évora figure under another concelho; a País sentence under Região; a regional distance under País when it should not be there). The hidden blocks count: a reader switching state sees them.
3. **Relocations and new copy**: every sentence on the home is either a registered relocation (with the occurrence count matching what you find) or listed as «Texto novo»; flag any sentence you cannot place, and any that was refused in the register but shipped anyway.
4. **Language**: in `dist/en/index.html`, nothing that should be English is Portuguese (transcribed source titles and the marker «[a verificar]» are allowed to stay as they are; the vocabulary in `CHAVES-EN.md` says which).
5. **The Emendas**: colour only where a source publishes a formal threshold (amber = outside, cobalt = within; everything else ink and grey); exactly two densities and no remnant of a third; the map breathing (full map with its ficha in País and when choosing; the locator card when a concelho is chosen and the reading deepens; no map as a point selector on mobile); all 308 points equal except the ■/□ coverage pair, with the neutrality legend beside the map; one ruler grammar (ink reference at full height, bar = distance, tick = value, no bar without a published reference); the state vocabulary exactly as decided, and «por ler» nowhere; no numeric distance printed anywhere; no catalogue or dossier block, placeholder or door.
6. **The director's decisions in §3** of the plan extract: whether the build honours each or honestly parks it as stated.
7. **The runtime** (`dist/js/inicio.js`): it must only select pre-rendered strings (toggle `hidden`/`open`/ARIA attributes, copy a concelho's name from the page's own data into marked slots); flag any `innerHTML`, any string assembled from query input, any arithmetic that produces a displayed digit, any query value that is not resolved against a closed list.
8. **No-JavaScript default**: `dist/index.html` as served, with the script ignored, must be a complete and correct País · Relance page; say what a reader without JavaScript gets and loses.
9. Anything else you can prove from the files: accessibility of the controls as written (names, roles, live regions), `<head>` metadata, internal links that do not resolve within `dist/`, inconsistencies between the two editions.

For each finding: where (file and line or a quoted fragment), what the files say, why it matters, severity (critical / high / medium / low). Some defects in this package may have been planted deliberately to measure the read; treat every suspicion on its merits and report it, do not try to guess which are planted. End with one paragraph: would you show this home to the director as is, with the listed fixes, or not at all, and why. If something cannot be checked from these files, say so rather than guessing. Report in Markdown, in English, beginning with a one-paragraph summary and a count of findings by severity.
```

## As plantas, verbatim (plantas.json)

```json
{
  "commit": "009d8e6",
  "plantas": [
    {
      "ficheiro": "dist/index.html",
      "descricao": "P4 valor 89,7 → 89,8 na peça da dívida pública, PT",
      "antes": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:80px\" class=\"claim-value peca-valor\">89,7",
      "depois": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:80px\" class=\"claim-value peca-valor\">89,8",
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
      "antes": "<div class=\"vazio\" data-vazio>",
      "depois": "<div class=\"vazio\" data-vazio><p class=\"vazio-medida\"><span class=\"claim claim-com-chip\"><span data-claim=\"evora-populacao-2025\" class=\"claim-value\">58 567</span> pessoas <a class=\"src-chip\" href=\"/livro-razao/evora-populacao-2025\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Évora — Orçamentado, Pago, Devido 2025\"><span class=\"vh\">Linha do livro-razão: Évora — Orçamentado, Pago, Devido 2025</span><span class=\"src-chip-texto\">fonte</span></a></span></p>",
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
