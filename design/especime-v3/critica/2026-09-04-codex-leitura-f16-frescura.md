# Leitura a frio do Codex ao bloco F1.6 (o atraso do IEFP, o Portal BASE, a seleção do Painel Social), 04.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 09:18 a 09:30 UTC, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, `atrasoDaLinha()` a devolver `null` a toda a linha com período, na cópia e no diff, apanhada no Blocking 2; P2, o portão a deixar de comparar o período rendido com o da série, apanhada no Blocking 1; P3, o relatório a dizer 277 linhas numa contagem e 278 no resto, plantada 40 segundos depois do arranque da leitura e apanhada na mesma no Major 3; P4, o período da fonte a dizer 2026-08 na página construída, apanhada no Blocking 1. Triagem do lugar de direção (pela delegação de 04.09, §1.98): o Major 4 fica como está (o contador diz as duas contagens, a das séries e a das linhas, e é mais claro do que o brief pedia); o Major 5 é do F1.10 (o leitor de primeira vez pediu as linhas de frescura fora do cabeçalho de todas as páginas; o contador passa então à página da medida e ao Método, onde cabe no telemóvel; até lá fica escondido a 390 e dito); o Major 6 é do pacote (o inventário e a linha de Évora não foram); os Major 7 a 11 e o Minor 12 são reais e consertam-se na segunda passagem (o parágrafo do Método sem «comum» nem «única»; as cadeias sem «a casa», que a Emenda 15 proíbe, na forma «nesta linha» ou «nesta página»; a frase inglesa com «measures» e o termo da Comissão entre aspas uma vez; a régua F16 a ler o `numero` e a contar as medidas, e não a palavra contra si própria; as plantas com registos guardados e guardas que testem o casamento das linhas; o excerto da Comissão com a lista das dezassete). O texto do leitor fica como veio.*

---

# Blocking

1. The published ledger sample is wrong: it renders `2026-08`, while the municipality card and data declaration say `2026-07` (`built/linha-iefp.html:1`, `built/concelho.html:2`, `src/data/frescura.mjs:71`). The supplied ruler explicitly disables this comparison with `false &&` (`scripts/check-formas.mjs:373`), although the diff contains the active check (`diff.patch:644`). This is the planted defect the report says was reverted (`relatorio-construtor.md:296-303`), but it remains in both the artifact and ruler copy.

2. The shipped row matcher rejects every normal row: `periodo !== null` returns `null` precisely when `reference_date` exists (`src/lib/frescura.mjs:69-79`, `diff.patch:1449-1459`). Consequently the supplied source would render no lag sentences and calculate zero delayed rows, contradicting the built counter `1 · 278` and the claimed green build (`built/linha-iefp.html:1`, `relatorio-construtor.md:377-384`). The built HTML was not produced from the supplied copies.

# Major

3. The central count conflicts inside the package. The report claims 278 pages/cards and `1 · 278` (`relatorio-construtor.md:10-17`), but later quotes `check:formas` as finding 277 rows (`relatorio-construtor.md:270-272`); the diff’s copy of that same line says 278 (`diff.patch:380-382`).

4. The counter does not implement K2 literally. The brief says the `n` in “séries atrasadas: n” equals the number of rows in that state (`brief.md:11`, `brief.md:28`); the site instead renders `n = 1`, followed by a separate 278-row count (`built/linha-iefp.html:1`). The builder acknowledges choosing a different interpretation (`relatorio-construtor.md:94-107`). Both values are derived from matched rows, but the acceptance wording was not met (`src/lib/frescura.mjs:102-105`).

5. The “public” counter disappears at mobile widths. It is the third masthead item (`src/components/Masthead.astro:365-384`, `src/components/SinalDasFontes.astro:143-155`), while CSS hides every item from the second onward below 640 px (`src/styles/site.css:4961-4967`). The report admits this (`relatorio-construtor.md:120-128`).

6. The provenance chain is declared but cannot be completed from this package. `2026-07` points to an absent source inventory record T2 (`src/data/frescura.mjs:73-77`), which F14 expects to open and parse (`scripts/check-formas.mjs:711-756`); only the builder’s prose quotes it (`relatorio-construtor.md:43-53`). Likewise, the card sample names an Évora row (`built/concelho.html:2`), while the supplied row copy is Abrantes (`claims/abrantes-desemprego-registado-2025-12.yml:6`).

7. The Método addition does not avoid adjectives: “navegador comum” and “única fonte”, mirrored by “ordinary browser” and “only source” (`src/data/metodo.mjs:175-183`, `brief.md:12`). It does avoid claims about trust in this paragraph.

8. New public strings explicitly talk about the house, contrary to the stated voice rule: “a casa publica”, “the house publishes”, and the counter tooltips “séries que a casa publica…” (`src/i18n/strings.mjs:1452-1463`, `src/i18n/strings.mjs:2551-2553`, `src/lib/prova.mjs:472-478`). The inventory nevertheless classifies them as content (`design/especime-v3/INVENTARIO-FRASES.md:2092-2101`).

9. The English Social Scoreboard sentence violates the closed vocabulary by introducing “headline indicators” (`src/data/figuras.mjs:833`, `design/especime-v3/INVENTARIO-FRASES.md:2103`). The governing decision says “indicador” leaves the site vocabulary (`diff.patch:7`).

10. F16 cannot detect a false denominator. The data object has both `numero: 17` and `palavra: seventeen` (`src/data/figuras.mjs:753-761`), but the ruler never reads `numero`; it merely checks that the rendered sentence contains the same `palavra` field used to construct it (`scripts/check-formas.mjs:790-808`, `src/data/figuras.mjs:826-835`). Changing both editions to an incorrect word would pass.

11. The planted-defect claims are narrative, not reproducible proof: the report describes manual edit/run/revert operations without retained fixtures or logs (`relatorio-construtor.md:296-303`). The supplied guard cases test only the shape of `eSerieAtrasada`, not row matching, counters, rendered periods, or decision stamps (`scripts/provar-guardas.mjs:481-525`). The rulers also import project files and dependencies not supplied here (`scripts/check-ledger.mjs:15-25`, `scripts/check-formas.mjs:113-124`).

# Minor

12. The Social Scoreboard report formally supplies an official URL, retrieval date and excerpt, but the quoted excerpt only says a list follows; it does not include that list or the count (`relatorio-construtor.md:166-189`, `relatorio-construtor.md:204-211`). The subsequent prose enumerates 17 items (`relatorio-construtor.md:192-198`), so the result is plausible but the requested evidentiary excerpt is incomplete.

### What is fine

- For Abrantes, `2025-12` and `26.08.2026` trace correctly to `reference_date` and `access_date` (`claims/abrantes-desemprego-registado-2025-12.yml:25-26`); the templates pass those fields through `DataDaLinha` rather than embedding their visible forms (`src/views/LinhaView.astro:693-701`, `src/views/MunicipioView.astro:193-203`).
- The Método paragraph is present in both built editions (`built/metodo-pt.html:2`, `built/metodo-en.html:2`). Recomputing the gate’s normalized SHA-256 prefix yields `8c9aa6a9b7b9`, matching both `Afecta: metodo` and the stamp (`scripts/check-ledger.mjs:506-509`, `DECISIONS-1.99.md:3-5`).
- The Social sentence genuinely changed in both source editions, and its URL/date origin is declared (`diff.patch:1169-1178`, `src/data/figuras.mjs:753-761`).
- All 14 new voice entries are paired PT/EN and assigned to block `frescura` (`design/especime-v3/INVENTARIO-FRASES.md:2088-2103`), although their cross-reading remains “por ler” (`design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:60`).
- With no matched lag rows, the component does render `Séries atrasadas: 0` and suppresses only the row suffix (`src/components/SinalDasFontes.astro:143-153`). A false zero with lagging rows and a missing Método stamp are rejected by the shipped logic (`scripts/gate-html.mjs:7063-7085`, `scripts/check-ledger.mjs:619-635`).

**12 distinct findings.**