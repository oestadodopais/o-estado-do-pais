# Leitura curta do Codex, sobre a cabeça final do dia: o fluxo de crédito às empresas, a origem do «FDI» e a régua 8.4, 14.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado em `ler.sh`, lido no registo de eventos), 17:51:45 a 17:57:30 UTC de 14.09.2026, 114 628 símbolos, sobre um pacote montado da cabeça `faec0c00` do ramo `lugar-2026-09-04` (a mesma composição da releitura, com a página do glossário do «FDI» acrescentada às cópias das fontes, lida pelo lugar de direção por `curl` às 17:1x UTC, HTTP 200, 67 386 bytes, o sha256 no índice), com o âmbito reduzido pelo prompt aos dois achados que a releitura deixou e a segunda passagem fechou em `faec0c00`: a medida do fluxo de crédito às empresas (as duas definições contra os excertos, incluindo o denominador sem o investimento direto estrangeiro), a origem `glossario-fdi` (o excerto carácter a carácter contra a página), a célula 8.4 (os três campos por igualdade contra o elemento marcado), e as duas páginas construídas para essa medida; as outras 22 definições ficaram fora do âmbito, ditas como tal. **Duas plantas de duas classes, 2 de 2 vistas** (o registo no `.plantas.json` ao lado): T1, o excerto do «FDI» com «balance of trade accounts» onde a página diz «balance of payment accounts» (o achado 2, Blocking); T2, a página inglesa a render «also including foreign direct investment» onde os dados dizem «also excluding» (o achado 1, Blocking). O achado 3 é o efeito da planta T1 na consistência entre dados e páginas; o achado 4 (o positivo conhecido da igualdade sem o ficheiro das saídas no pacote) é do pacote, que não levava `medicoes/lugar-2026-09-04/`, e o próprio leitor confirma no item 9 que a régua seleciona um elemento por campo e compara por igualdade. Os «what is fine» 5 a 10 confirmam a definição nas duas edições dos dados e na página portuguesa, o excerto da Comissão carácter a carácter, os campos da origem do «FDI», a régua, e o «NFC» marcado «[a verificar]» com a sua explicação nas duas edições. Nada real ficou por fechar: o bloco aterra nesta cabeça.*

---

## Blocking

1. **The English built page reverses the denominator’s FDI exclusion and therefore publishes the wrong definition.**

The page says “also including foreign direct investment.” The data says “also excluding foreign direct investment,” matching the Portuguese edition. The Commission’s actual wording repeats “(excl. FDI)” after “debt stock in t-1,” so both the credit flow and denominator exclude FDI.

built/en/european-union/index.html:1, src/data/figuras.mjs:937, fontes/15.txt:111

2. **The declared `glossario-fdi` excerpt is not verbatim and substitutes “trade” for “payment.”**

The declared excerpt is: “Foreign direct investment, abbreviated as FDI, is an international investment within the balance of trade accounts.” The source actually says: “Foreign direct investment, abbreviated as FDI, is an international investment within the balance of payment accounts.” Both the text extraction and raw HTML contain “payment,” as do both built pages, so this looks like a transcription error rather than a rewritten source.

src/data/figuras.mjs:645, src/data/figuras.mjs:650, fontes/16.txt:133, fontes/16.html:501, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## Major

3. **Both built pages disagree with the current data for the `glossario-fdi` excerpt.**

The data declares “balance of trade accounts.” Both built editions render “balance of payment accounts.” The rendered text happens to match Eurostat, but it does not match `figuras.mjs`, proving that these built artifacts and the supplied data are not from the same state.

src/data/figuras.mjs:650, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1, fontes/16.txt:133

## Minor

4. **No included known-positive reproduces the claimed 8.4 equality test against the supplied pages.**

The report says three plants appended text and demonstrated that containment passed while equality failed, and names a separate results file as proof. Neither that plant nor its results are included here. Moreover, the checker is hard-wired to `dist/`, while this package supplies the pages under `built/`, so the current page/data discrepancies cannot exercise the checker directly.

relatorio-construtor.md:56, relatorio-construtor.md:209, relatorio-construtor.md:213, scripts/check-lugar.mjs:81, scripts/check-lugar.mjs:82

## «What is fine»

5. **The Portuguese data definition and Portuguese built definition correctly state that both the credit flow and the preceding-period debt stock exclude FDI.** src/data/figuras.mjs:913, src/data/figuras.mjs:931, fontes/15.txt:111, built/uniao-europeia/index.html:1

6. **The English definition in the data also states both exclusions correctly; the defect is confined to the English built artifact.** src/data/figuras.mjs:937, fontes/15.txt:111

7. **The `pdm-credito-as-empresas` excerpt appears character for character in the Commission source, and its publisher, document, address and reading date are coherent.** src/data/figuras.mjs:569, src/data/figuras.mjs:575, fontes/15.txt:1, fontes/15.txt:73, fontes/15.txt:111, fontes/15.txt:175, fontes/INDICE.md:21

8. **The `glossario-fdi` publisher, document title, address and reading date are correct, notwithstanding its defective excerpt.** src/data/figuras.mjs:645, src/data/figuras.mjs:649, fontes/16.txt:1, fontes/16.txt:126, fontes/16.txt:128, fontes/16.txt:155, fontes/INDICE.md:22

9. **The 8.4 implementation now selects one marked element per publisher, document and excerpt field and compares normalized text by equality, rather than searching by containment across the origin block.** scripts/check-lugar.mjs:1202, scripts/check-lugar.mjs:1208, scripts/check-lugar.mjs:1213, scripts/check-lugar.mjs:1217, scripts/check-lugar.mjs:1225, scripts/check-lugar.mjs:1227, src/components/OrigemDaDefinicao.astro:82, src/components/OrigemDaDefinicao.astro:88, src/components/OrigemDaDefinicao.astro:105

10. **Both origins are necessary: the Commission supplies the formula and two exclusions, while Eurostat connects “FDI” to “foreign direct investment”; the unsupported expansion of “NFC” remains visibly marked `[a verificar]`, with its page-level explanation present in both editions.** src/data/figuras.mjs:630, src/data/figuras.mjs:640, src/data/figuras.mjs:931, src/data/figuras.mjs:933, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

The other 22 measure definitions were out of scope and were not re-verified.

## The four scoped items, one by one

| # | Scoped item | Source file | Excerpt in source | Definition supported | Page/data or control result | Findings |
|---:|---|---|---|---|---|---|
| 1 | `fluxo-de-credito-as-empresas-2025` | `15`, `16` | PDM: yes; FDI data excerpt: no | Data PT/EN: yes; built PT: yes; built EN: no | English page reverses the denominator exclusion | 1, 2, 3 |
| 2 | `glossario-fdi` | `16` | No, “trade” should be “payment” | Yes for the FDI expansion used by the definition | Metadata correct; both pages render the source wording instead of the data wording | 2, 3 |
| 3 | 8.4 ruler | N/A | N/A | N/A | Field-specific normalized equality: yes; reproducible included known-positive: no | 4 |
| 4 | Both built pages for the measure | `15`, `16` | Rendered PDM and FDI excerpts match their sources | Portuguese: yes; English: no | Origins and metadata otherwise match; FDI excerpt differs from current data | 1, 3 |