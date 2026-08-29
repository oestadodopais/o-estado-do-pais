# Leitura cruzada do Codex · o estudo tipográfico, primeira ronda (29.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre a rubrica, a tabela, as notas, o JSON das medidas e as três pranchas como imagens. Custo: 79 380 símbolos, 332 s. Duas plantas, registadas com sha256 antes da leitura em `LEITURA-CODEX-2026-08-29.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | na tabela, os valores da medida 2 da Spectral (0,316) e da Source Serif 4 (0,442) trocados | **sim**: bloqueante, com a contradição contra as notas e o JSON |
| P2 | uma frase nas notas a dizer que a Newsreader tem versaletes próprios | **sim**: contra a tabela e o JSON |

**Pontuação: 2 de 2.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

**A primeira ronda do estudo não é de decisão**, e a leitura di-lo com razões que se confirmam nos próprios ficheiros:

1. **A rubrica não foi aplicada como escrita.** A medida 3 (aberturas) foi lida a 12× de densidade e não a 1×, e a substituição, embora declarada, é outra medida; a medida 2 tem recortes só a 390 e a 1280, não às sete larguras; o JSON declara 525 células e não as traz uma a uma; a medida 6 está vazia para os instrumentos sem exclusão dita; a medida 1 na tabela vem das unidades do tipo e não do navegador (a Newsreader 7,24 na tabela contra 7,36 medida; a Source 8,07 contra 8,22); a medida 8 (a leitura cega) não estava feita, e as pranchas só trazem duas páginas por largura, não as cinco. **Real.** A segunda ronda aplica a rubrica à letra ou declara, medida a medida, o que não é mensurável a 1× e sai da ordem.
2. **A ordem de preferência não sai da rubrica.** Nenhuma ponderação foi fixada antes de medir, e a medida 2 foi declarada decisiva depois; chamar-lhe «a única medida de ecrãs pequenos» é falso, porque a 3 e a 6 são a 1× e a 390. **Real.** A segunda ronda fixa a ponderação na rubrica antes de olhar, ou não ordena e deixa as eliminatórias e os números ao diretor; a Source Serif 4 em primeiro não fica estabelecida.
3. **Afirmações das notas contraditas pela própria tabela**: «a Spectral é última só na medida 2» (a Literata está abaixo, 0,312 contra 0,316); «ganha em quatro das cinco páginas» só a 390 (a 1280 ganha em duas); as aberturas da Bitter «quase o dobro» das da Public Sans só no «e». **Real**; corrigem-se nas notas da segunda ronda.
4. **Números que a leitura não pôde verificar** (os KiB, as contagens de corridas, as 143 regras): estão nos programas e ficheiros do ramo, que não foram ao pacote. **Falha da embalagem**; a segunda ronda leva os programas e o JSON célula a célula.
5. **A prancha dos algarismos a 15 px quando a linha do livro-razão compõe a 13,5 px.** **Real**: a segunda ronda mede no tamanho real da página.
6. **Método**: só Chromium, sem a versão nem o rasterizador declarados; o corpo fixo favorece as famílias de x maior na medida de tinta; a comparação de bytes mistura ficheiros estáticos e variáveis com itálicos por examinar. **Real; declara-se e normaliza-se.**

**O que a primeira ronda estabelece, mesmo assim:** as eliminatórias (algarismos tabulares, versaletes) e quem as passa; a densidade de leitura por família; que as candidatas livres ficam a uma distância pequena da Spectral no telemóvel; o desconto de subconjunto (a confirmar com os bytes medidos no ar). **O que não estabelece:** uma ordem. **A segunda ronda** corre quando as fontes de teste da Feliciano Type existirem, com todas as candidatas de uma vez, a rubrica aplicada à letra, a ponderação fixada antes, as cinco páginas nas pranchas, e a leitura cega sobre as capturas.

## O relatório, tal como veio

# REPORT

`REPORT.md` was not written because the workspace is read-only.

## Blocking

1. **The principal result conflicts with the measurements table.** `TABELA.md` gives median one-pixel ink as Spectral **0.442** and Source Serif 4 **0.316**. `NOTAS.md` and `MEDIDAS.json` give the reverse: Spectral **0.316/0.3157**, Source **0.442/0.4421**. This changes the stated winner of measure 2. The table is not safe for decision-making until regenerated and reconciled.

2. **The rubric was not applied as written.**

   - Measure 3 requires apertures at 17 px and **1×**. At 1×, most `e/a/s` results are null; the ranking instead uses measurements made at **12×**. This substitution is disclosed, but it is a different measure.
   - Measure 2 contains only ten prose crops per family, at 390 and 1280, and eight instrument crops. I could not verify measurements at all seven widths promised by the rubric.
   - The JSON asserts 525 cells but does not contain their cell-level results.
   - Measure 6 is blank for instrument families without an explicit in-table exclusion.
   - Measure 8 is unfinished. The supplied boards show only two page excerpts per width, not all five required pages. IBM Plex is marked “direção” despite the notes saying it was never captured.
   - Measure 1’s table values come from font-unit `x/em`, not the browser measurements the rubric specifies. Examples: Newsreader **7.24** in the table versus **7.3638** in-browser; Source **8.07** versus **8.2153**; Bitter **8.87** versus **9.0384**.

3. **The preference order is not determined by the rubric.** No weighting was fixed, the blind reading is missing, and measure 2 is declared decisive after measurement. Calling it “the only” small-screen measure is false: measures 3 and 6 explicitly concern 1×/390 px. Source Serif 4 is defensible only if stroke coverage is weighted above apertures, density and bytes. That priority is not established by the study.

## Should fix

- The notes first say Newsreader has its own `smcp`, then say it does not. The table and JSON say **no `smcp`**.
- “Spectral is last only in measure 2” is contradicted by the notes’ own table: Literata is lower, **0.312 versus Spectral 0.316**.
- Source wins four of five pages only at **390 px**. At 1280 it wins two of five. The claim needs the width stated.
- Bitter’s apertures are not generally “almost twice” Public Sans: `e` **1.92 vs 1.08**, but `a` **1.14 vs 0.92**, `s` **1.36 vs 1.25**, and `c` **3.75 vs 2.75**.
- I could not verify from the supplied evidence: **694.8 KiB** current transfer, **289.5 KiB per page** saving, 375/623/823 run counts, 143 CSS rules, 6,606 identical files, or the 191.91/209.63 small-cap test. Several referenced source files, detector programs and detailed measurement files are absent.
- The numeral board is synthetic at 15 px because the real ledger uses 13.5 px. It confirms equal-width alignment for Bitter and Public Sans, but not alignment on the real page at its actual size.

## Boards and method

The eye agrees about density: Literata looks larger and wraps sooner; Newsreader fits more text. I could not visually confirm Source’s claimed 1× stroke advantage because the prose boards are 3× and 2×; Literata often appears at least as dark. Public Sans’s lowercase aperture claim is not testable from the numeral specimen. Both instrument faces visibly align their columns.

Chromium-only rendering and the 12× aperture substitution are disclosed. Chromium version, OS rasterizer and cross-engine behaviour are not. Fixed CSS size also favours larger-x-height/heavier designs in the ink metric. Byte comparisons mix seven static Spectral files with variable-font packages and include unexamined italics, so they are not normalized performance tests.

## Note

IBM Plex’s exclusion follows the precommitted `tnum` rule, although its default digits align. Commercial blanks are correctly explicit. A purchase still needs commercial test fonts, price/licence terms, the complete rubric at actual 1× sizes, all five blind comparisons, cross-engine/device testing, glyph/subset coverage, and measured real-page network loading.
