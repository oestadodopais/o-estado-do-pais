# Leitura cruzada do Codex · as páginas dos 308 concelhos (26.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, em modo só de leitura e sem repositório, sobre um pacote com dez concelhos tirados ao acaso (semente 20260826: Chaves, Tabuaço, Beja, Celorico de Basto, Sobral de Monte Agraço, Miranda do Corvo, Mortágua, Faro, Oleiros, Belmonte), as suas páginas nas duas edições, as suas páginas de livro-razão, as 80 linhas YAML, os ficheiros das fontes alojados no motor (as respostas do INE, os PDF da DGAL, o ODS do IEFP em CSV), o índice dos 308, o índice do conjunto, o índice do livro-razão, cinco páginas de linha, dez capturas, os excertos das Emendas 14, 15 e 18 e a nota dos construtores. Prompt em `PROMPT.md` do pacote (`scratchpad/codex-concelhos/`). Custo: 218 571 símbolos, 768 s. Cinco estragos plantados nas cópias, registados com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | ficheiro | o estrago | apanhado? | como o classificou |
|---|---|---|---|---|
| P1 | `paginas/municipio-chaves.html` | a população de Chaves com o último algarismo trocado (38 011 por 38 014) | **sim** | blocking (§1, §2, com as três cadeias: página, linha, fonte) |
| P2 | `linhas/tabuaco-poder-de-compra-2023.yml` | o excerto deixa de conter o valor (99,99 por 63,53) | **sim** | should fix (§2, «não é palavra por palavra») |
| P3 | `paginas/municipio-chaves.html` | «1 234» numa peça que dizia «sem linha ainda» | **sim** | blocking (§3, «inventa um número dentro de um elemento de ausência») |
| P4 | `paginas/en-municipality-beja.html` | «Empresas não financeiras» na página inglesa | **sim** | should fix (§6) |
| P5 | `paginas/municipio-celorico-de-basto.html` | «Todos os valores desta página foram verificados pela equipa contra as fontes oficiais.» a seguir ao `<h1>` | **não** | (o §6 lista frases de diligência recorrentes em todos os ficheiros; a frase única numa página não entrou) |

**Pontuação: 4 de 5.** A falha na P5 explica-se e não se desculpa: a leitura procurou a classe «o sítio a explicar-se» por cadeias repetidas em todos os ficheiros (o cabeçalho, os títulos da agenda, a legenda da barra da dívida) e não leu cada página à procura de uma frase só dela; a rede mecânica desta classe é a régua do inventário (`medir-defeitos.mjs`), que também não a apanhou porque não corre sobre o pacote e porque classifica por frases conhecidas (o item E10 manda-a apanhar esta classe). A P5 confirmou-se presente no ficheiro antes da leitura.

## O que a leitura achou fora das plantas, e o que se faz

1. **O selo do limite legal nomeia o estudo de Évora em todas as outras páginas** (§7): a linha `indice-de-divida-limite-legal` (150) é do estudo de Évora, e o selo nas 307 páginas diz «Évora — Orçamentado, Pago, Devido 2025». **Real; E9 para o construtor** (a linha passa a ser da casa ou do conjunto, com a forma que o livro-razão permitir).
2. **«É a lei que o define, não este sítio.»** na legenda da barra da dívida, nas 616 páginas (§6): autorreferência (Emenda 15) que a régua do inventário classificou como conteúdo. **Real; E10**, com a régua a aprender a classe.
3. **DGAL chamada «o regulador das contas municipais»** (§7): é uma direção-geral. **Real; E11.**
4. **308 ligações dentro de um `<svg role="img">`** no cartão localizador (§7, inferido pela leitura e confirmado pela forma): a tecnologia de apoio pode achatar os descendentes interativos de uma imagem. **Real; E12** (o cartão localiza e não navega; na primeira página o `svg` com ligações expõe-nas).
5. **A linha do limite legal não vinha no pacote** (§2) e o `js/municipios.js` também não (§5): omissões do empacotamento, a corrigir no próximo pacote; não são defeitos do sítio.
6. **«Empresas não financeiras» excede o título do indicador do INE** (§7): o título diz «Empresas (N.º)», mas o destaque do INE de 11.12.2025 dá a série municipal como «empresas não financeiras» (a soma dos 308 é essa linha e não o total). **Sem ação**; a prova está em `medicoes/fontes-308-2026-08-26.md`, medida 4.
7. **As ledes do livro-razão** («Uma linha por medida e por concelho…», «Cada linha guarda…»), a leitura do cabeçalho («Painel europeu reconferido a») e os títulos da agenda (§6): frases da casa anteriores a este bloco, classificadas como conteúdo pela régua; ficam para a ronda de voz seguinte, com o diretor. **Sem ação neste bloco.**
8. **As contagens de cobertura** («2416 com proveniência completa», «308 de 308») são chaves da prova recontadas pelo portão, e não frases de diligência. **Sem ação.**

## O relatório, tal como veio

`REPORT.md` could not be created because the workspace is mounted read-only; the permitted patch was rejected and the file remains absent. Here is the completed report text:

# Fresh-eyes audit of the municipality pages

Scope: the ten Portuguese municipality pages, English counterparts, sampled ledger pages and rows, supplied sources, indices, and captures. `NOTAS.md` was read only after these checks. Whitespace variants in thousands separators are treated as equivalent.

## 1. Same structure everywhere

- **[note] The structural signature is consistent.** Every Portuguese page contains eight `article.peca` elements in this order: `População residente` (Pessoas, 2025); `Poder de compra por habitante` (Índice, national-average base, 2023); `Desemprego registado` (Pessoas, December 2025); `Empresas não financeiras` (Empresas, 2024); `Dívida total do município` (Euros, 2024); `Índice de dívida` (Percentagem, legal cap 150, 2024); `Execução da receita` (Percentagem do orçamento, no period); `Prazo médio de pagamento` (Dias, December 2025). Evidence: `[data-medida-nome]` and `[data-medida-unidade]` in `paginas/municipio-*.html`.

- **[blocking] Chaves differs in tile 7’s state text.** `paginas/municipio-chaves.html`, `article[data-medida-vazia] .peca-sem-linha`, contains `1 234`; the same selector in the other nine pages contains `sem linha ainda`. Detailed in section 3.

## 2. Every number traces

- **[blocking] The Portuguese Chaves population is wrong.** Page/tile/row: `paginas/municipio-chaves.html`, `População residente`, `chaves-populacao-2025`. The three strings are page `38 011`; row `value: "38 014"`; source `fontes/0012917_S7A2025.json`, Chaves code `11B1703`, `"ind_string" : "38 014"` and `"valor" : "38014"`. The English page and `paginas/livro-concelho-chaves.html` both show `38 014`.

- **[should fix] The Tabuaço purchasing-power excerpt is not verbatim.** Page/tile/row: `paginas/municipio-tabuaco.html`, `Poder de compra por habitante`, `tabuaco-poder-de-compra-2023`. The value strings agree: page `63,53`; row `63,53`; source `63,53`. The row excerpt, however, says `"ind_string" : "99,99", "valor" : "63.53"`; the source record for code `11D1819` says `"ind_string" : "63,53", "valor" : "63.53"`. This breaks the row comment `Excerto textual da fonte, palavra por palavra`.

- **[should fix] The rendered legal-cap claim is not independently traceable from the package.** All 20 language pages render `<span data-claim="indice-de-divida-limite-legal">150</span>`, and every derived row names `indice-de-divida-limite-legal`, but no corresponding YAML exists in `linhas/`. The ten index rows themselves set `source`, `document`, `access_date`, and `excerpt` to `null`; their municipality-specific inputs carry complete provenance.

- **[note] Everything else checked passes.** Of 70 numbered Portuguese tile claims, 69 equal their YAML `value`; all 70 English claims do. All 70 direct source-backed YAML rows, comprising 60 direct tile values and ten debt-limit inputs, name a source, document title and locator, and access date. Their values occur in the supplied INE JSON, IEFP CSV, or DGAL source text, with only the Tabuaço excerpt defect above.

## 3. Absence is honest

- **[blocking] Chaves invents a revenue-execution number inside an absence element.** Page/tile/row: `paginas/municipio-chaves.html`, `Execução da receita`, no row id. The three strings are page `1 234`; row `[none]`; source `[none in package]`. It has no `data-medida`, claim, or source seal. `paginas/en-municipality-chaves.html` says `no row yet`; all other Portuguese pages say `sem linha ainda`; `linhas/` contains no sampled revenue-execution row.

- **[note] No other sampled absence conflict exists.** The sample contains no island municipality, and every sampled unemployment, debt, and payment-time tile has a row, so the island and `N.d.` examples are not exercised.

## 4. Derived values

- **[note] All ten recompute exactly.** Using `debt ÷ limit × 150`, rounded to one decimal as each `check` states: Beja `29,9`; Belmonte `110,0`; Celorico de Basto `64,0`; Chaves `43,2`; Faro `25,9`; Miranda do Corvo `14,6`; Mortágua `10,1`; Oleiros `40,0`; Sobral de Monte Agraço `18,1`; Tabuaço `96,8`. Every result equals the derived row and page. The missing constant row prevents checking the provenance of `150`, not the arithmetic.

## 5. Dataset page and ledger index

- **[note] The counts reconcile as far as the package permits.** `linhas/` has 80 YAML files, eight per sampled municipality; the ten `paginas/livro-concelho-*.html` pages list the same 80 ids one-for-one. `paginas/livro-concelhos-indice.html` prints `2416 linhas · 308 concelhos · 2416 com proveniência completa` and contains 308 `.concelho` entries. `paginas/livro-indice.html` contains 136 `.livro-item` entries, 128 complete and eight `por-confirmar`. Therefore `136 + 2416 = 2552` total and `128 + 2416 = 2544` complete, exactly its printed totals. The package lacks all 2,416 YAML rows, so the global row/provenance count and printed `325 calculadas` cannot be independently recounted.

- **[note] Search destinations match the index.** `paginas/livro-concelhos-indice.html` has 308 `li[data-normal]` results and 308 `.concelho` links; their `(visible name, href)` sets are identical, including `/livro-razao/concelhos/<slug>`. Actual filtering is not provable from HTML alone because `/js/municipios.js` is not supplied.

## 6. Reader-facing text

- **[should fix] Reader pages repeatedly explain diligence or the site’s own method, contrary to `REGRAS.md` rules 15 and 18.** Exact examples:

  - All 38 HTML files show `.mob-leitura-k` as `Painel europeu reconferido a` or `European panel re-checked on`.
  - All contain agenda-count tooltips `itens da agenda atravessados do motor` or `agenda items crossed from the engine`.
  - All 20 municipality pages end `.mun-distancia-legenda` with `É a lei que o define, não este sítio.` or `The law defines it, not this site.`
  - The dataset `.lede` says `Uma linha por medida e por concelho, com o valor tal como a fonte o publicou...`.
  - The ten municipality-ledger pages say `Uma linha por medida...`.
  - The ledger index `.lede` says `Cada linha guarda... a conta explicada e reavaliada a cada construção.`
  - Coverage or diligence claims include `2416 com proveniência completa`, `2544 de 2552 linhas com proveniência completa`, and `308 de 308 concelhos · tem página`.

- **[should fix] Portuguese leaked into English Beja.** `paginas/en-municipality-beja.html`, `article[data-medida="beja-empresas-2024"] [data-medida-nome]`, contains `Empresas não financeiras`; the other nine English pages use `Non-financial enterprises`.

## 7. Other reader flags

- **[should fix] Two labels exceed the supplied publishers’ wording.** Every municipality page calls DGAL `o regulador das contas municipais` or `the regulator of municipal accounts`; `regulador` and `regulator` occur nowhere in `fontes/` or `linhas/`. Likewise, the tile says `Empresas não financeiras`, while INE indicator `0014061` and every relevant `document.title` say only `Empresas (N.º)`. The package may omit supporting metadata, but these qualifiers are not proved here.

- **[should fix] The legal-cap seal has an unrelated study label.** Every link to `/livro-razao/indice-de-divida-limite-legal` is labelled `Évora — Orçamentado, Pago, Devido 2025`, or `Évora — Budgeted, Paid, Owed 2025`, despite appearing in the central-municipality debt tile. Main tile footer seals otherwise end in their own `data-medida` id, and every selected map point matches its page.

- **[note] Captures and accessibility do not expose the HTML defects.** Both Chaves captures show `38 014`, contradicting the Portuguese HTML’s `38 011`; tile 7 is below their captured area. The two phone captures show a readable single-column first tile with native `details/summary` and a source link, but neither reaches the locator map. **Inferred:** the map’s `<svg role="img">` contains 308 interactive `<a>` descendants whose circles are only `r="4.5"`; `role="img"` may flatten those descendants for assistive technology, and the geometry suggests very small phone targets. The adjacent municipality-index link provides an alternative.

**Verdict: block publication until the two unsupported Portuguese Chaves values are corrected; the provenance, voice, labelling, and accessibility findings should follow.**