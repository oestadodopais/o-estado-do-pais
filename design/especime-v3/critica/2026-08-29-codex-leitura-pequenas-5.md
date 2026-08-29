# Leitura cruzada do Codex · correções pequenas, quinta passagem (29.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre seis páginas inglesas e uma portuguesa construídas (uma linha do livro-razão, o índice do livro-razão, duas áreas, o concelho de Évora nas duas edições), o dicionário das unidades, o diff do inventário e as regras 14 e 15. Custo: 141 972 símbolos, 343 s. Três plantas, registadas com sha256 e o contexto impresso do alvo antes da leitura em `2026-08-29-codex-leitura-pequenas-5.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | a unidade da dívida pública na página inglesa das Finanças trocada de «% of GDP» para «% of GNP» | **sim**: bloqueante, contra o dicionário e o índice do livro-razão |
| P2 | a marca de língua tirada ao título do documento da DGAL na página inglesa da linha da dívida de Évora | **sim**: reportada como o título por marcar nessa página |
| P3 | a entrada «dias» do dicionário trocada de «days» para «hours» | **sim**: bloqueante, contra o comentário da entrada e as páginas |

**Pontuação: 3 de 3.** As plantas foram conferidas pelo contexto impresso do alvo antes do registo, como a regra nova manda, e as três caíram no sítio.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **O texto para leitores de ecrã dos chips de proveniência** (`.vh`) repete títulos portugueses de estudos sem `lang="pt-PT"` nas páginas inglesas (seis numa página de área, contados). **Real; corrigido na mesma passagem** antes da fusão, com a régua `check-lingua` alargada ao texto escondido.
2. **Seis entradas do dicionário sem a origem escrita na linha**, e **duas traduções que não seguem o inglês da própria fonte** («euro per capita»; «total for OECD and non-OECD EU countries»). **Real; corrigido na mesma passagem.**
3. **A «marca duplicada»** (`lang="pt-PT" lang="pt-PT"`) que o lugar de direção julgou ver ao embalar o pacote **não existia**: era a cauda de `hreflang="pt-PT" lang="pt-PT"` no comutador de língua do cabeçalho, apanhada por uma procura por cadeia; o construtor provou-o com um tokenizador de atributos (zero atributos repetidos em 6 606 ficheiros, antes e depois) e deixou a régua L8, que fecha a construção a um atributo escrito duas vezes. **Falso positivo do lugar de direção, registado como tal.**
4. **A legenda dos dois estados do selo e o parágrafo do índice do livro-razão** lidos como regra 15: a legenda é a exceção registada; o parágrafo é anterior e classificado. **Sem ação.**
5. **As matérias da lei em português nas páginas inglesas das áreas** («emprego», «a política financeira do Estado»): são citações da lei portuguesa, com a marca, por decisão da §1.80. **Sem ação.** A vírgula decimal é a regra escrita das duas edições (I90); «N.d.» é a marca da fonte e o recibo explica-a. **Sem ação.**
6. **Passa**: nenhuma marca sobre texto inglês, nenhum atributo duplicado no pacote, a página portuguesa de controlo limpa, o diff do inventário coerente, «factor» em português com marca por decisão.

## O relatório, tal como veio

# REPORT

I could not write `REPORT.md` because the workspace is read-only.

## Blocking

- [dados/unidades.mjs](/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/codex-pequenas5/pacote/dados/unidades.mjs) maps `dias` to `hours`. Both its comment and preamble say “Days”; these are different units. The ledger index prints `days` for `evora-prazo-medio-de-pagamento-2023` and `-2025`, while the municipality page prints `Days`. Thus the pages are correct but inconsistent with the current dictionary.

- `divida-publica-2025` prints `% of GNP` on `en-area-financas.html`, but `% of GDP` on `en-ledger-index.html`, matching the dictionary. GDP and GNP are not interchangeable. These are the only three English ledger-unit cells not matching dictionary output: this GNP cell and the two `days` cells above.

- The language-mark change is incomplete. Provenance chips repeat Portuguese study titles in screen-reader `.vh` text without `lang="pt-PT"`:

  - `en-area-trabalho`: *Évora — Quinze Anos, Cinco Mandatos*; *Penalizações por Reforma Antecipada em Portugal*.
  - `en-ledger-index`: those titles plus *Avaliação Económica Regional de Portugal 2026*, *Evolução de Portugal desde 1981*, *Água Não Faturada*, *Évora — Economia…*, and *Évora — Os Pelouros…*, including `calculated ·` variants.
  - `en-municipality-evora`: *Évora — Economia…*, *Évora — Quinze Anos…*, and *Évora — Os Pelouros…*.

  `en-ledger-evora-divida` also leaves *Evolução endividamento total* unmarked in the visible “Published by … in …” attribution, although its later provenance field is marked.

## Should fix

- Six dictionary entries do not name a translation origin on their line, contrary to the file’s stated rule: `% da população`, `% do orçamento`, `% do valor aprovado`, `edições`, `correções`, and `anos`.

- I dispute the claimed exact provenance, though not necessarily the meaning, of:

  - `euros per inhabitant`: the cited source wording is “euro per capita”.
  - `% of the OECD and non-OECD EU total`: this drops “countries” from the quoted source and is awkwardly ambiguous. “Total for OECD and non-OECD EU countries” would preserve it.

- Rule 15 is breached outside the permitted receipt/Method/About locations. The area pages, municipality page, and ledger index carry the apparatus explanation “The two states of the seal / provenance complete / one field unconfirmed.” The ledger index additionally explains coverage through “Every row” and the paragraph about “house values, derivations and descriptions.” Self-explanation on the row receipt is expressly permitted.

- An English-speaking reader still meets untranslated Portuguese government-topic headings such as `emprego`, `segurança social`, and `a política financeira do Estado`. Correct pronunciation metadata does not provide comprehension. Decimal commas (`111,47`, `61,44`) and `article 52.º` also read as Portuguese conventions on English pages; `N.d.` is unexplained.

## Note

- I found no duplicated attributes, unbalanced tags, or English text incorrectly marked. `factor` is intentionally marked as the refused Portuguese unit.
- The Portuguese control page’s current language attributes are clean; without a baseline, I could not verify what changed.
- `INVENTARIO.diff` consistently keeps both legal sentences classified as live `conteudo` and records only the measurement-induced space before the colon.
- I could not verify dictionary-key exactness or stated ledger counts because the Portuguese ledger source is not included.
