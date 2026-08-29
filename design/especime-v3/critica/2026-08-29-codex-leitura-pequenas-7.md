# Leitura cruzada (Codex) da sétima passagem de correções pequenas (I97, I98, I100)

*29.08.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, ≈190k símbolos, sobre um pacote tirado do worktree do ramo `pequenas-7-2026-08-29` em `bcd77fc`: os dez ficheiros que o ramo muda, o relatório do construtor, os dois índices do livro-razão construídos, duas páginas de linha inglesas, a gémea portuguesa de uma delas e uma página de área inglesa. Três plantas registadas por sha256 antes do lançamento (`2026-08-29-codex-leitura-pequenas-7.plantas.json`, o contexto de cada alvo conferido antes e depois): P1, a marca `lang="pt-PT"` tirada a um nome de organismo português numa linha inglesa; P2, o Eurostat classificado `pt` na tabela; P3, a contagem final dos organismos sem marca (164 → 146) na tabela do relatório. **Apanhou as três** (bloqueantes 1 e 2, e o achado 5). O primeiro lançamento saiu com a P1 por plantar (a página escolhida tinha fonte inglesa); foi parado ao fim de um minuto e relançado com as três conferidas, e o ficheiro das plantas regista-o.*

## Triagem do lugar de direção, conferida nos ficheiros do ramo (sem plantas)

| achado | conferido | o que se faz |
|---|---|---|
| 1, 2, 5 | plantas | nada no repositório |
| 3 · L4d e L4e só exigem as marcas obrigatórias, nunca recusam as proibidas | **real** (`scripts/check-lingua.mjs`, o `continue` quando a tabela diz língua da página ou nenhuma) | a régua nos dois sentidos, com estragos para cada lado; consertado pelo construtor no mesmo ramo |
| 4 · L4d e L4e passam em vazio; L2c e L2d não limitam os valores da tabela | **real** | mínimos positivos ligados a casos conhecidos; valores fora de `pt`, `en`, `null` recusados |
| 6 · o feixe afirma mais do que mede (`.banda` em três rotas contra «6 590 páginas»; contagens do mapa relacionais; «308 pontos» anterior à Emenda 20a; «0,26 s sobre as 6 590 páginas») | **real** | ou mede o que diz, ou diz o que mede; o relatório corrigido |
| 7 · o corredor dos estragos da I100 aceita deteção parcial | **real** (`tests/inicio/areas.mjs`, «qualquer célula afetada») | cada célula afetada tem de ficar vermelha |
| notas: as amostras recomputadas batem (118 organismos por índice, 75 portugueses marcados e 43 Eurostat sem marca na edição inglesa; a tabela das edições 16 pt + 45 sem língua); I102 e I103 coerentes mas por conferir fora do pacote | do pacote | nada |

## O relatório, tal como veio

# Fresh-eyes report: small corrections pass 7

## Blocking

1. **Planted damage: `Eurostat` is classified as Portuguese.** In `fonte/src/i18n/lingua-dos-titulos.mjs:275`, `Eurostat: 'pt'` contradicts the immediately preceding comment (“the English-named body”), the file's statement that 15 bodies are Portuguese and one English, the builder's report, and every sampled built page. It must be `'en'`. The damage is consequential: a rebuild would add `lang="pt-PT"` to English-page Eurostat names and remove `lang="en"` from Portuguese pages. The samples contain 88 affected renditions: 43 in each ledger index and two in `paginas/en-row-b.html`.

2. **Planted damage: one IEFP body is unmarked on the English row page.** In `paginas/en-row-a.html`, the `source` in the attribution sentence has no `lang`; the identical `source` in the provenance list has `lang="pt-PT"`. The first is therefore read with English pronunciation and the same string is treated inconsistently on one page. `fonte/src/views/LinhaView.astro:368-375` appears intended to mark that first rendition, so the supplied artifact and source do not agree.

## Should fix

3. **L4d and L4e enforce required marks only; they never reject forbidden marks.** `fonte/scripts/check-lingua.mjs:604-639` immediately continues when the table says the string is in the page language or has no language. Consequently, `lang="pt-PT"` on English-page `Eurostat`, `lang="en"` on a Portuguese body in Portuguese, or any language mark on `edat_lfse_14` all pass. That is weaker than the stated rule and the requested “no mark” checks.

4. **L4d and L4e can pass vacuously.** There is only a global `contas.paginas > 0` guard (`fonte/scripts/check-lingua.mjs:734-739`). Removing every rendered `source` or every rendered `document.edition` leaves the corresponding check green at zero. Add non-zero positives, preferably tied to known opposite-language and language-less cases. L2c/L2d are not similarly vacuous while their non-empty tables remain, but they do not validate that table values are limited to `pt`, `en`, and (for editions only) `null`.

5. **Planted damage: the builder's source count is internally impossible.** `fonte/design/especime-v3/medicoes/pequenas-7-construtor.md:115-122` says 6,920 English-page bodies, 6,756 with `lang="pt-PT"`, and 146 without a mark; the remainder is 164, and the following paragraph itself says 164 Eurostat occurrences. “146” must be “164.” The top-line “6,911 to 0” is defensible only as *wrong-language bodies missing a required mark across both editions*, not literal unmarked elements, and should be labelled that way.

6. **The design bundle's absence and map assertions overclaim their coverage.** `fonte/scripts/design-bundle.mjs:1368-1377` checks `.banda` on only three Portuguese routes, yet comments/report claim zero across 6,590 pages. A band on an English or unrelated page passes. The script also does not traverse 6,590 pages, so the report's “0.26 s over the 6,590 pages” is misleading. In the map checks (`:1469-1516`), counts are relational rather than expected: one unit, one anchor, and one list item pass; equal anchor/path counts do not prove each path has its own anchor; district municipalities are described as “each a door” without counting doors; any non-zero point count passes despite the claimed 308. The six planted cases listed are plausible cases these checks catch, but they do not establish the stronger prose. The exact “ten failures” cannot be checked against a diff because no base version/diff is included; the current file does contain remedies/comments corresponding to all ten categories listed.

7. **The I100 positive-control harness accepts partial detection.** M4 genuinely reads five named constants from `scripts/medir-defeitos.mjs` rather than copying selector literals (`fonte/tests/inicio/areas.mjs:347-395`), and removing `data-nome` from the served HTML should expose the name and description as unclassified. However, `:748-750` declares a plant caught when *any* affected cell fails. The two-edition `data-nome` plant can therefore pass while one edition remains undetected; require every intended M4 cell to fail.

## Notes and package limits

- Recomputed samples: each ledger index has 121 `source` fields: three markers plus 118 bodies. English has 75 Portuguese bodies correctly marked and 43 Eurostat bodies correctly unmarked; Portuguese has 75 Portuguese bodies unmarked and 43 Eurostat bodies marked `en`. `paginas/en-area.html` has ten Portuguese bodies, all marked. Both Portuguese editions in `paginas/en-row-a.html` are correctly marked; both language-less codes and both Eurostat names in `paginas/en-row-b.html` are correctly unmarked. `paginas/row-a.html` is correct.
- The edition table's own arithmetic is consistent: 61 entries = 16 Portuguese + 45 language-less (7 years, 3 dates, 3 filenames, 32 series codes). The source table has 16 entries but, because of the planted Eurostat value, currently has 16 `pt` and zero `en`.
- I102 and I103 are coherently described in `fonte/design/especime-v3/ISSUES.md`, but the named component, `strings.mjs`, full `src/`, and full 6,590-page build are absent. I could not determine those claims from this package. The same applies to whole-ledger table completeness, the reported full-site counts/timings, the claimed 22/22 M4 run, and the actual selector constants in the omitted `medir-defeitos.mjs`.
