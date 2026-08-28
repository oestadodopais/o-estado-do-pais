# Leitura cruzada do Codex · os vazios (28.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre cinco páginas de concelho nas duas edições (Penedono, Aljezur, Évora, Lisboa, Trancoso), doze linhas em YAML e os seus recibos, os dois índices do livro-razão, o texto extraído dos dois ficheiros da DGAL (a lista do PMP de dezembro de 2025 e o endividamento de 2024), o diff do inventário e as regras 14 e 15. Custo: 227 675 símbolos, 483 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-28-codex-leitura-vazios.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | o índice de dívida de Penedono na página trocado de «N.d.» para «12,3» (a linha e a fonte dizem «N.d.») | **sim**: bloqueante, com as três colunas e a nota de que as duas entradas da fonte são «N.d.» |
| P2 | «sem linha ainda» reposto na peça do prazo médio de pagamento de Aljezur, no lugar de «N.d.» | **sim**: bloqueante, e a contradição com o inventário (a frase declarada `retirada`) apontada |
| P3 | uma frase de método na página de Lisboa («Os valores «N.d.» publicam-se tal como a fonte os imprime, depois de verificados pela casa.») | **sim**: «Rule 15 is breached», só nessa página |

**Pontuação: 3 de 3.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **«O índice de dívida da Direção-Geral desceu de …»** na página de Évora, nas duas edições (`strings.mjs`, `tempoSerieA`): a Direção-Geral publica a dívida e o limite; o índice é calculado pela casa sobre essas duas colunas, e a própria peça o diz. **Real, anterior a este bloco, fora do seu âmbito**: fica em I88 para a próxima passagem de correções pequenas, com a redação «O índice de dívida, calculado sobre os dados da Direção-Geral, desceu de …» e a inglesa correspondente.
2. **A receita do índice de Penedono** (`round ( … / … * 150 , 1 )` sobre duas entradas «N.d.»): a leitura não pôde verificar se o avaliador a trata. **Verificado do lado da casa**: `evaluateCheck` propaga a marca sobre as quatro operações e o arredondamento, e `ledger:check` reavalia as 334 contas, esta incluída, a cada construção (a régua `vazios`, célula A4). A receita é a mesma das 307 irmãs por desenho: o que muda são as entradas, e o recibo di-lo («N.d. ÷ N.d. × 150»). **Sem ação.**
3. **O extrato do INE para a população de Aljezur não ia no pacote**: linha do bloco dos 308, medida e lida então. **Falha de embalagem; sem ação.**
4. **Passa**: cada valor amostrado igual nas três colunas; os doze recibos iguais às linhas; cada selo a terminar no id da sua peça; Lisboa recalculada (39,3), Aljezur (7,5), Évora (105,5), Trancoso (147,2); sete peças em todas as páginas, pela ordem, sem valor vazio, sem peça da execução da receita; nenhuma frase de ausência fora das plantas; os campos dos mandatos de Évora por mandato, com «Decidiu» ausente só em 2017–2021; as contagens do inventário coerentes (2 590 + 12 = 2 602; 329 + 1 = 330; 2 447 + 12 = 2 459; 143 + 2 459 = 2 602).

## O relatório, tal como veio

# Fresh-eyes report: «vazios»

The workspace is read-only, so I could not create `REPORT.md`.

## Blocking

| Page / tile / row | Page value | YAML value | Source value |
|---|---:|---:|---:|
| `paginas/municipio-aljezur.html` / Prazo médio de pagamento / `aljezur-prazo-medio-de-pagamento-2025-12` | `sem linha ainda` | `N.d.` | `N.d.` |
| `paginas/municipio-penedono.html` / Índice de dívida / `penedono-indice-de-divida-2024` | `12,3` | `N.d.` | No index is printed; both source inputs are `N.d.` |

Both English pages and both ledger receipts show the correct `N.d.`. These are stale Portuguese reader builds. Aljezur also directly violates rule 3 and contradicts `INVENTARIO.diff`, which declares the phrase retired site-wide.

## Should fix

- Rule 15 is breached on Portuguese Lisboa: “Os valores «N.d.» publicam-se tal como a fonte os imprime, depois de verificados pela casa.” This is an explicit claim about the site’s method and diligence. It appears only on that page.

- Évora says, in both languages, “O índice de dívida da Direção-Geral desceu…” / “The directorate-general’s debt index fell…”. The supplied DGAL extract publishes debt and the legal limit, not an index; the page itself seals the index as calculated. The wording wrongly attributes the derived comparison to DGAL.

- Penedono’s derived row is narratively honest: it explicitly says the index was not calculated and propagated `N.d.` from two `N.d.` inputs. However, its `check` still contains `round(N.d. / N.d. × 150, 1)`. That is not ordinary executable arithmetic. I could not verify whether the build evaluator special-cases it; the check should represent propagation explicitly or be null.

## Traceability and recomputation

Apart from the two blocking mismatches, every source-backed sampled tile matched page, YAML and printed extract character-for-character, allowing equivalent thousands-separator whitespace. All 12 supplied ledger receipt HTML files match their YAML values. Every tile’s footer seal ends in the same row ID as its `data-medida`.

Lisboa recomputes correctly:

`321,899,234 ÷ 1,228,492,602 × 150 = 39.304172… → 39.3`

Using the debt and limit displayed on the pages, Aljezur recomputes to `7.5`, Évora to `105.5`, and Trancoso to `147.2`.

The Aljezur population tile and YAML both show `7 456`, and the YAML embeds that source excerpt, but no corresponding INE extract exists under `fontes/`; independent third-layer verification was therefore impossible.

## Structure

All ten municipality pages have exactly seven `article.peca`, in the required order, with no empty value, and no revenue-execution tile. No English page renders `no row yet`. The only rendered banned phrase is Portuguese Aljezur; occurrences in `PROMPT.md`, `REGRAS.md`, and `INVENTARIO.diff` are specification/history text.

Évora’s mandate fields, identically structured in both languages:

- 2009–2013 and 2013–2017: Lugares, Herdou, Decidiu, Deixou, A Direção-Geral, Pelouros.
- 2017–2021: the same except `Decidiu` is absent.
- 2021–2025: those six plus Contas do penúltimo ano.
- 2025–: those six plus Executivo instalado.

## Inventory

The changed table rows retain `conteudo`, consistently with their neighbours; count rows remain `viva`, while the two absence phrases become `retirada`. The latter status is factually false while Aljezur still renders the Portuguese phrase.

The count changes are arithmetically coherent: `2590 + 12 = 2602`, `329 + 1 = 330`, and `2447 + 12 = 2459`. The main ledger index visibly contains 143 items, so `143 + 2459 = 2602`; the municipal index visibly contains 308 municipalities. It does not enumerate all 2,459 municipal rows, so that underlying count and the total of 330 calculated rows could not be independently recounted from this package.
