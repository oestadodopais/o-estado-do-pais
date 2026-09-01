# Leitura cruzada (Codex) do bloco do rótulo de IA em todas as páginas

*01.09.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, 15 minutos e 33 segundos, sem rede, sobre um pacote tirado da worktree do ramo `rotulo-ia-2026-09-01` (os ficheiros que o ramo muda, o diff contra `main`, nove páginas construídas, o relatório do construtor, a ordem e o brief). Três plantas registadas por sha256 e contexto em `2026-09-01-codex-leitura-rotulo.plantas.json`: «sob» trocado por «sobre» no rótulo da primeira página portuguesa; um «the» a menos na frase inglesa aprovada em `politica-ia.mjs`; a contagem de rótulos do relatório trocada para 6 950. **3 de 3 apanhadas.** Sem travessões na prosa desta cabeça; o relatório fica tal como veio, em inglês.*

## Triagem do lugar de direção

| achado | conferido | o que se faz |
|---|---|---|
| Blocking 1, 2; Major «6 950» | **plantas** (3 de 3) | nada no repositório |
| Blocking 3 (o oráculo do portão é o próprio ficheiro que rende) | **real**, e é o mais grave: o «carácter a carácter» não provava nada | segunda passagem: os textos aprovados literalmente no portão, comparação exata, estrago provado |
| Blocking 4 (o rótulo do topo só conta o marcador) | **real** | o portão confere texto, ligação, língua e marca; M6 exige as duas páginas |
| Blocking 5 (ocultação por CSS) | **real**, em parte inerente ao portão estático | `<footer>` ancestral e `style` inline recusados; o resto fica dito como limite, coberto pela régua do navegador |
| Major 1, 2 (o inventário da voz: cadeias em falta; «navegação») | **reais** | todas as cadeias entram; a classe nova `divulgacao` com a razão escrita (a divulgação legal não é autojustificação) |
| Major 3 (a voz da secção: assegura em vez de dizer) | **real** | a frase «não finge» sai; «às cegas», «a frio», «nunca verifica o que construiu» passam a descrição; e o lugar de direção acrescenta a sua própria correção: «Fable decide, escreve as regras» passa a «dirige o trabalho: escreve os briefs, revê e funde», porque as regras são do diretor |
| Major 4 («Free publication») | **real** | «Free of charge» |
| Major 5 (quatro identificadores com algarismos) | **real** | os nomes dos modelos na página passam a famílias sem versão |
| Major 6 (o corredor das plantas só corre as células declaradas) | **real** | a suite inteira por planta; declarações corrigidas |
| Major 7 (as línguas) | **real** | um `data-rotulo-nome` marcado por rótulo; a frase da política na língua da rota; `<html lang>` obrigatório |
| Major 8 (schema.org por verificar) | por desenho do pacote (sem rede) | o lugar de direção confere os dois termos na fonte, em `DECISIONS.md` |
| Major 9 (o relatório sem artefactos) | por desenho do pacote | os artefactos estão na worktree; fica dito |
| Minor 1 (as palavras ligadas) | **real** | o portão exige «a política da casa» / «the house policy» |
| Minor 2 (o inglês) | **real** | reescrito com a voz |
| Minor 3 (648) | dito | a contagem confere-se na construção seguinte |

## O relatório, tal como veio

## Blocking

- **The English approved policy sentence is corrupted in the supplied source.**

  File: [fonte/src/data/politica-ia.mjs:163](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:163>)

  Quoted text: `responsibility, sets the rules and refusals, and answers for it.`

  It is missing `the` before `refusals`. Both specifications, `diff.patch`, and the built English samples contain the approved wording.

  Correct value: `responsibility, sets the rules and the refusals, and answers for it.`

- **The Portuguese front-page sample has the wrong approved label.**

  File: [paginas/pt-inicio.html:1](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/paginas/pt-inicio.html:1>)

  Quoted text: `Texto gerado por IA sobre a política da casa · responsável editorial: Nuno dos Santos`

  `sobre` replaces the approved `sob`. This is a character-for-character failure.

  Correct value: `Texto gerado por IA sob a política da casa · responsável editorial: Nuno dos Santos`

  This page could not have passed the supplied gate in its current form, so the sample and the report’s claimed green build cannot represent the same output.

- **The “character-for-character” gate uses the mutable rendering source as its oracle.**

  Files: [gate-html.mjs:4044](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4044>), [gate-html.mjs:4171](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4171>)

  Quoted code: `const esperado = textoDoRotulo(linguaPagina);` and `const esperada = FRASE_DA_POLITICA[declarada];`

  `RotuloDeIA.astro` renders from `politica-ia.mjs`, while the gate imports its expected label and paragraph from that same file. Changing the approved copy in that file changes both output and oracle. The planted missing `the` demonstrates the failure: rebuilding from the supplied source would render the unapproved sentence and the gate would accept it.

  The comparisons also call `normalizeWhitespace`, so different whitespace is accepted despite the report’s claim `carácter a carácter`.

  Correct values are the literal strings in `ORDEM.md` and `BRIEF.md`, held independently of the rendering data.

- **The top-label rule checks only a marker count, not the label.**

  File: [gate-html.mjs:4107](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4107>)

  Quoted code: `const esperadoNoTopo = rota?.key === 'texto' ? 1 : 0;`

  For study-reading pages, the gate does not check the top block’s text, link, language, name mark, visibility, or position. An empty or incorrect element carrying `data-rotulo-ia="topo"` satisfies it.

  The browser test checks area and position only, not top-label text or link, and only on the first available reading page per language. Its condition is merely `leituras.length > 0`, so one reading page can make M6 green despite the report claiming two.

- **A page can have no perceivable label and still pass the all-page gate.**

  File: [gate-html.mjs:4074](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4074>)

  Quoted checks: `hidden`, `aria-hidden="true"`, and `class="vh"`.

  The gate does not detect `display:none`, `visibility:hidden`, zero dimensions, a closed `<details>`, or other CSS hiding. It also does not require the alleged footer block to be inside a `<footer>`; it trusts the attribute value `rodape`.

  The browser test itself plants `.rotulo-ia{display:none !important}`, proving this is a known gap, but it tests only eight pages. An unsampled route can therefore carry a non-visible marker and pass the build gate.

## Major

- **Most new public strings are absent from the voice inventory.**

  Files: [INVENTARIO-FRASES.md:1600](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/design/especime-v3/INVENTARIO-FRASES.md:1600>), [politica-ia.mjs:155](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:155>)

  Quoted inventory claim: `Quatro cadeias novas`

  Only the two language labels and two front-page lines were added. Missing are both approved policy paragraphs and the entire new policy section, including such strings as:

  - `A casa não finge uma revisão que não existe.`
  - `The house does not pretend to a review that does not exist.`
  - `A casa não aceita dinheiro de nenhuma entidade que mede.`
  - `The house takes no money from any entity it measures.`

  The order requires every new string to enter the inventory with its block and origin. The report’s `701 → 705` claim merely confirms that the omitted policy copy was not inventoried.

- **The four added inventory entries are misclassified as navigation.**

  File: [INVENTARIO-FRASES.md:1639](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/design/especime-v3/INVENTARIO-FRASES.md:1639>)

  Quoted entries include: `navegacao | Director: Nuno dos Santos · Free publication` and `navegacao | Texto gerado por IA sob a política da casa...`

  The director/free line contains no link or command at all. The AI label describes authorship, policy, and editorial responsibility, which the inventory’s own definition places under `autorreferencia`. A legal obligation does not turn disclosure into navigation.

  Under the current three-class taxonomy, the correct class is `autorreferencia`; otherwise a separately approved disclosure class is required. The report’s reasoning is rationalisation to preserve `autorreferência 0`.

- **Several new policy strings argue for trust instead of merely stating the policy.**

  File: [politica-ia.mjs:189](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:189>)

  Exact examples:

  - `A casa não finge uma revisão que não existe.`
  - `The house does not pretend to a review that does not exist.`
  - `a família de modelos que construiu nunca verifica o que construiu`
  - `the family of models that built a thing never checks it`
  - `mede às cegas, com código próprio, numa cópia`
  - `measures blind, with its own code, on a copy`
  - `lê a frio, com estragos plantados`
  - `reads cold, with planted damage`
  - `Um modelo novo só ocupa um lugar depois de passar os mesmos testes...`
  - `A new model takes a place only after passing the same tests...`

  These are assurances about independence, testing, and diligence. They explain why the reader should trust the process and use evaluative language such as “blind” and “cold”, contrary to the stated voice rule.

- **The English gratuitity wording is ambiguous and not the requested “free of charge” statement.**

  Files: [politica-ia.mjs:147](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:147>), [paginas/en-inicio.html:1](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/paginas/en-inicio.html:1>)

  Quoted text: `Free publication`

  In English this can describe a free or independent press product rather than clearly saying that no payment is charged.

  Correct value from the requested meaning: `Free of charge` or `Publication free of charge`.

- **The “no new number” claim is literally false, and the claimed count of model names is wrong.**

  Files: [politica-ia.mjs:274](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:274>), [relatorio-construtor.md:125](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/relatorio-construtor.md:125>)

  Report quote: `as cadeias novas não trazem um único algarismo, e os três nomes de modelo...`

  The public Method section adds four numeric identifiers:

  - `Claude Fable 5`
  - `Claude Opus 5`
  - `Claude Sonnet 5`
  - `gpt-5.6-sol`

  `data-nonledger` can exempt them from a gate; it cannot make the digits absent. The referenced allow-list is not supplied, and no exception to the order’s literal “Nenhum número novo no sítio” is documented here. Correct count: four model identifiers. Whether identifiers are authorised exceptions is `[verify]`.

- **The browser plant runner does not test what its comments and report claim.**

  File: [tests/inicio/rotulo.mjs:619](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/tests/inicio/rotulo.mjs:619>)

  Quoted code: `if (planta.celulas.includes(chave)) await CORRIDAS[chave]();`

  It runs only the cells that a plant declares should fail. It therefore cannot prove the report’s claim that each plant makes “exactly” those cells red and leaves all others green. Its later check for undeclared red cells is dead in practice because those cells were never run.

  It also does not establish a green baseline or verify that the transformation changed the HTML.

  Two stated “exactly M1” plants would affect other cells if the full suite ran:

  - Removing the footer block also breaks M2, M3, M4, M5 on the homes, and M7.
  - Hiding every `.rotulo-ia` also breaks M4 and M6.

- **The language checks can pass individual unmarked or wrong-language disclosures.**

  Files: [check-lingua.mjs:802](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/check-lingua.mjs:802>), [gate-html.mjs:4171](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4171>)

  The label gate does not require exactly one `data-rotulo-nome` inside every label. On one English page, the name can remain as plain text without `lang="pt-PT"` and still satisfy the flattened exact text; L9 sees no marked name on that page but its site-wide positive minimum remains non-zero.

  The policy gate selects the expected paragraph from the element’s own `data-frase-da-politica` value but never requires that value to equal the route language. An English About page carrying the approved Portuguese paragraph with `data-frase-da-politica="pt"` can pass.

  Both language scripts also skip unrecognised or absent `<html lang>` values rather than making the label comparison fail unconditionally.

- **The schema.org change is unsupported by evidence present in the folder.**

  Files: [politica-ia.mjs:67](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:67>), [relatorio-construtor.md:326](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/relatorio-construtor.md:326>)

  Quoted claim: ``digitalSourceType` with `TrainedAlgorithmicMediaDigitalSource`, lidos na fonte em schema.org`

  The folder contains the builder’s quotations and URLs, but no captured vocabulary, context, validation result, or other independent source. With network use forbidden, the existence, domain, version, and `@id` interpretation of those terms cannot be verified from the supplied evidence.

  The two relevant samples do contain the claimed JSON-LD object, but that proves rendering, not vocabulary validity. Correct status: `[verify]`.

- **The supplied report contains an impossible and externally altered page count.**

  Files: [relatorio-construtor.md:10](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/relatorio-construtor.md:10>), [fonte/design/especime-v3/medicoes/rotulo-construtor.md:10](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/design/especime-v3/medicoes/rotulo-construtor.md:10>)

  Quoted text: `6 950 das 6 590 páginas construídas`

  A subset cannot exceed its total. The branch report and `diff.patch` say `6 590 das 6 590`; only the separately supplied `relatorio-construtor.md` says `6 950`.

  Correct value: `6 590 das 6 590`.

- **Most measured results in the report have no supporting artefact in this folder.**

  File: [relatorio-construtor.md:113](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/relatorio-construtor.md:113>)

  Unsupported result groups include:

  - Full-build counts: `6 606`, `6 590`, `16`, `2 583 / 2 602`, `5 204`, `13 320`, `85`, `580`, the label/name/language totals, link totals, voice totals, occurrences, and `648`.
  - Contrast and geometry: `6,24:1`, `9,52:1`, `16,39:1`, `15,38:1`, `44,0px`, `372,0`, and the planted `1,28:1`/`1,67:1`.
  - Executed plants: eight gate plants, five language plants, seven browser plants, their hashes, green baselines, and red outcomes.
  - Other test results: `39/39`, `22/22`, `83/87`, and the remaining suite table.
  - Operational claims: four successful commit-state builds, eight complete builds, `490 000` symbols, timings, and rewritten PNG counts.

  There is no `dist/`, execution log, JSON measurement output, hash record, full test suite, token file, commit history, or baseline tree in the package. The source defines seven browser cells and seven transformations, but definitions are not executed results.

## Minor

- **The gate does not enforce which words form the policy link.**

  File: [gate-html.mjs:4062](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/scripts/gate-html.mjs:4062>)

  It verifies that some link in the label has the correct destination. Because it separately compares only flattened text, another part of the sentence could be linked while `a política da casa` or `the house policy` remains plain text. The supplied samples wrap the correct words, but the rule does not enforce that requirement.

- **Several English policy phrases are unnatural even apart from the voice defect.**

  File: [politica-ia.mjs:194](</private/tmp/claude-501/-Users-nunosantos/Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/data/politica-ia.mjs:194>)

  Quoted text includes `pretend to a review`, `measures blind`, and `reads cold`.

  These are not idiomatic English and can obscure the intended meaning. Because the underlying sentences are also argumentative, the files do not establish an approved replacement.

- **The report’s `648 pages` is arithmetically plausible but not demonstrated.**

  Files: [EstudoView.astro:138](</private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/views/EstudoView.astro:138>), [MunicipioView.astro:181](</private/tmp/claude-501/-Users-nunosantos/Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/views/MunicipioView.astro:181>), [TextoView.astro:130](</private/tmp/claude-501/-Users-nunosantos/Instruments-OEstadoDoPais/49c81441-fc1b-4f84-9507-33f9f897a43b/scratchpad/codex-rotulo/pacote/fonte/src/views/TextoView.astro:130>)

  The property was added to three `Article` views, and the municipality and reading samples show it. The complete route population needed to prove `648` is absent.

## Notes

- I compared every approved Portuguese and English label and policy paragraph against `ORDEM.md`, `BRIEF.md`, `diff.patch`, the source data, and the relevant built samples.
- I compared every target-side hunk in `diff.patch` with `fonte/`. The missing `the` in `politica-ia.mjs` was the only source/post-image divergence.
- I inspected all nine sampled pages. They contain nine footer labels plus one study-reading top label. Apart from the Portuguese home’s `sobre`/`sob` defect, their label text, policy-link destination and linked words are correct. All English label/director-name occurrences carry `lang="pt-PT"`; Portuguese occurrences correctly inherit `pt-PT` without a redundant mark.
- The four rendered policy paragraphs in `/sobre`, `/metodo`, `/en/about`, and `/en/method` match the approved copy. This conflicts with the damaged English source, confirming that the samples were not built from the supplied source state.
- The study-reading sample places its top label before the document body.
- The two home samples contain `Nuno dos Santos`; their language marks are correct. The Portuguese gratuitity wording is `Publicação gratuita`.
- The inventory’s after-counts of `586` classified rows and `510` live rows are directly countable, and `diff.patch` adds four rows, supporting `582 → 586` and `506 → 510`. This does not support the separate `701 → 705` runtime voice count.
- No diff path touches `ledger/`, the site name, masthead, marks, font files, or font definitions. The new CSS assigns existing typography variables to the new elements but does not change the typeface system.
- I performed static checks only. The package does not contain the complete project, dependencies, `dist/`, or measurement outputs needed to run or reproduce the reported build and browser results. No network was used.