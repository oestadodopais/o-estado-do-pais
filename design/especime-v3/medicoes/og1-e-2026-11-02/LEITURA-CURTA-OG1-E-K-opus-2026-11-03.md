Short read (M48) of OG1-E addenda K and L, 03.11.2026. Reader: Claude Opus 5.5 (`leitor`, `xhigh`); 20 tool calls (08:17 to 08:23 UTC). Package `pacote-og1e-k-curta-2026-11-03`.

Cold short read of OG1-E addenda K and L. Package: <caminho> Reader: Claude Opus 5.5. I used 20 tool calls, the budget's limit, and wrote no files.

Package completeness: `diff.patch` changes no ledger row. It touches only the inventory, four measurement files, two scripts and two tests (diff.patch:1, :38, :73, :80, :136, :162, :211, :250, :369). So no hosted documents are required, and there is no `SEM-CORPOS-ALOJADOS.md`.

Item 10: these addenda change no quotation.

Limit on question 4: the package holds no pre-I built pages. I could compare the built pages only against the inventory, the addenda and the other edition, not against what a reader saw before I.

## Blocking

**1. The packaged English Abrantes page prints the retired DGAL debt definition (inventory line 3900), while the Portuguese page prints the live one.**
- The English debt fold reads «…(DGAL’s “<span lang="pt-PT">dívida total</span>”, without non-budget debts and the exceptions in the law).»
- So it leaves out that the DGAL column also excludes the contribution to the Fundo de Apoio Municipal. The live line 3947 says that, and so does the Portuguese page.
- The definition attached to this number is therefore not the measure the number is, and the two editions differ.
- Line 3900 is exactly the DGAL plant the fast proof says the voice refuses. A green `check:voz` and `conferir-tudo` on this page contradict it.
- I reproduced this by extracting the text of every built page and matching it against each retired row.

References: built/en/municipalities/abrantes/index.html:2, built/municipios/abrantes/index.html:2, design/especime-v3/INVENTARIO-FRASES.md:3900, design/especime-v3/INVENTARIO-FRASES.md:3947, CONFERIR-TUDO.md:10, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:21

**2. The packaged Portuguese corrections page prints the retired housing entry (line 5437). The public corrections register in Portuguese therefore omits half of the correction that the English edition states.**
- `/correcoes` reads «…e do comandante dos bombeiros, e uma frase dizia que os acampados…». This is byte-for-byte retired line 5437.
- It drops «a do movimento aparecia sem o «pelo menos» com que a notícia a dá», which the live line 5439 declares.
- `/en/corrections` prints the live English entry (5440), so the editions disagree about what was corrected.
- Line 5437 is one of the four plants the gate claims to refuse. A green voice gate on this page is a contradiction.

References: built/correcoes/index.html:3, built/en/corrections/index.html:3, design/especime-v3/INVENTARIO-FRASES.md:5437, design/especime-v3/INVENTARIO-FRASES.md:5439, design/especime-v3/INVENTARIO-FRASES.md:5440, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:22

## Major

**3. The copied `scripts/voz-edicoes.mjs` joins text nodes with `''`, but the diff and the pre-I file join with `' '`. The copy therefore answers question 1 "no" and contradicts the package's own tests.**
- On the diff's side, `textoDaVoz` matches `ANTES-DA-I` line for line. I compared the diff hunk against both files.
- The copy differs from both at line 38 only.
- `medir-defeitos.mjs` imports `textoDaVoz` as `texto` and uses it for every block without an origin. With `join('')` the voice's main extraction glues words together.
- The copied `tests/edicoes/voz.mjs` expects '« pelo menos »', 'X Y' and '1 2 3'. These hold only with `join(' ')`, so with the copy as head, `check:voz` could not be green as reported.

References: scripts/voz-edicoes.mjs:38, diff.patch:248, ANTES-DA-I/scripts/voz-edicoes.mjs:38, scripts/medir-defeitos.mjs:4, scripts/medir-defeitos.mjs:1132, tests/edicoes/voz.mjs:33, tests/edicoes/voz.mjs:34, tests/edicoes/voz.mjs:39

**4. The copied `scripts/medir-defeitos.mjs` drops `if (marcados.has(n)) return;` from `textoForaDasOrigens`, which the diff and the pre-I code both have. The house-voice tripwire would then read inside declared origins.**
- The copy has the comment «os marcados contam como os outros» where the diff (and d04ec4740) skip marked origin nodes.
- The function's own doc comment says the tripwire scans the text «FORA das origens declaradas».
- That text feeds both voice measurements that use it (lines 1006 and 1132). This is a change from pre-I that is neither in the diff nor in either addendum.

References: scripts/medir-defeitos.mjs:982, scripts/medir-defeitos.mjs:971, scripts/medir-defeitos.mjs:1006, diff.patch:203, ANTES-DA-I/scripts/medir-defeitos.mjs:981

**5. In the diff, the fast proof plants line 916 but never requires the voice to refuse it. The committed measurement lists 916 as required and refused, which the diff's code cannot produce.**
- The diff's plant run ends `},1,[dgal.n,...entradas.map(l=>l.n)]);`, which requires three lines.
- The copied test ends `…,lei.n]);`, which requires four.
- `adenda-k-plantas.json` records `retiradas_exigidas: 4` and `linhas` [3900, 5437, 5438, 916]. `adenda-l.md` says the measurement «confirmou … a lei (916)».
- Under the diff, exit code 1 is satisfied by the other three plants. So the very escape K was written for (a space before punctuation next to a language mark, line 916) would pass the gate unseen.

References: diff.patch:361, tests/edicoes/voz-integracao.mjs:82, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:18, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:24, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-l.md:5

## Minor

**6. The three parametrized retired lines (887, 1269, 1270) are "checked in memory" by a tautology, and the real-voice run no longer plants any of them.**
- The branch sets a meta `content` to `l.texto` and asserts `fraseRetiradaNoTexto` of that same string against `l.texto`.
- The meta-description plants from J were removed from the real run.
- So «1 238 retiradas conferidas em memória» includes three checks that cannot fail.
- This is not weaker than pre-I, where no such proof existed.

References: tests/edicoes/voz-integracao.mjs:21, tests/edicoes/voz-integracao.mjs:22, tests/edicoes/voz-integracao.mjs:23, diff.patch:337, relatorio-construtor.md:12

**7. The builder's codes and times rest on logs that are not in the package, and the call count cannot be reproduced.**
- `adenda-l-conferencias.json` points to `<temporario>/og1el-*.log`.
- The report-number checker tied none of its 16 numbers to a file and exited 1.
- The values do match that JSON (120, 239, 5, 42, 1 and 492 s).
- The director's rebuild independently shows the same checks at 0, with different times (91 s and 189 s).
- «28 chamadas» has no record; the JSON says 25 at the time of writing.

References: design/especime-v3/medicoes/og1-e-2026-11-02/adenda-l-conferencias.json:2, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-l-conferencias.json:6, numeros-do-relatorio.txt:24, relatorio-construtor.md:16, CONFERIR-TUDO.md:10, CONFERIR-TUDO.md:11

**8. «Originais intactos» is proven only for four files.**
- The control run executes `check-voz.mjs` with `cwd` set to the real worktree and `OEDP_DIST` on the real `dist/`.
- The copy's `dist/` is hard-linked file by file.
- `escrever` unlinks before writing, so the plants are safe.
- But the sha check covers only the four planted routes, and `check-voz.mjs` is not in the package to show it writes nothing else into `dist/`.

References: tests/edicoes/voz-integracao.mjs:41, tests/edicoes/voz-integracao.mjs:44, tests/edicoes/voz-integracao.mjs:46, tests/edicoes/voz-integracao.mjs:83

## «What is fine»

**9. The inventory is identical to its pre-I version.** `diff` against `ANTES-DA-I` exits 0. The four restored live lines carry the d04ec4740 forms that Addendum L quotes. References: design/especime-v3/INVENTARIO-FRASES.md:3902, design/especime-v3/INVENTARIO-FRASES.md:3947, design/especime-v3/INVENTARIO-FRASES.md:5408, design/especime-v3/INVENTARIO-FRASES.md:5440, ADENDA-L.md:7

**10. On the diff's side, both extractions are the pre-I code.** `textoDaVoz` and the two walkers `textoForaDeComandos` and `textoForaDasOrigens` match `ANTES-DA-I` line for line, including the `NodeType` import. References: diff.patch:174, diff.patch:192, diff.patch:215, ANTES-DA-I/scripts/medir-defeitos.mjs:943, ANTES-DA-I/scripts/voz-edicoes.mjs:27

**11. The one remaining logic difference in `ondeVolta` only adds refusals.** It adds a second `return t` path, only for lines not admitted. Any hit lands in `retiradas_que_rendem`, so it can never admit a page that pre-I refused. References: scripts/medir-defeitos.mjs:1799, scripts/medir-defeitos.mjs:1803, scripts/medir-defeitos.mjs:1832

**12. The plant record's counts reproduce from the inventory:** 1 238 retired rows, 84 with spaced quotes, 1 with text inside those quotes (line 3900) and 3 parametrized. References: design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:2, design/especime-v3/medicoes/og1-e-2026-11-02/adenda-k-plantas.json:4, tests/edicoes/voz-integracao.mjs:15

**13. The fast proof's design matches K §2.**
- It makes two real runs: the control with expected code 0 and no mutation, then one copy with all plants.
- Each plant is on its own page: DGAL on English Abrantes, the old housing entry in both corrections editions, and line 916 on English Águeda with the law name inside a `pt-PT` mark and the colon after it. The extraction is asserted equal to the line.
- Exit codes are read, and each required line is looked up in the `medicao.json` that the voice writes.
- References: tests/edicoes/voz-integracao.mjs:32, tests/edicoes/voz-integracao.mjs:49, tests/edicoes/voz-integracao.mjs:53, tests/edicoes/voz-integracao.mjs:55, tests/edicoes/voz-integracao.mjs:73, tests/edicoes/voz-integracao.mjs:76, tests/edicoes/voz-integracao.mjs:79, tests/edicoes/voz-integracao.mjs:80

**14. The new `voz.mjs` expectations are what a space join yields on those fixtures.** I traced each node sequence by hand. References: tests/edicoes/voz.mjs:33, tests/edicoes/voz.mjs:37, tests/edicoes/voz.mjs:40

**15. Apart from findings 1 and 2, the other changed live lines are on the built pages as declared.** The English payment-time fold (3902) is on English Abrantes, and the PS line (5408) and the live English housing entry (5440) are on `/en/corrections`. References: built/en/municipalities/abrantes/index.html:2, built/en/corrections/index.html:3

**16. The housing hospital sentence is the same in both study editions and follows Addendum I §1.** The commander's count «oito pessoas foram assistidas no seu quartel» is put to the RTP report. «Duas pessoas foram encaminhadas para o hospital.» is framed as the report's own narration. References: ADENDA-I.md:9, ADENDA-I.md:10, built/estudos/a-casa-em-portugal-e-na-europa/index.html, built/en/studies/a-casa-em-portugal-e-na-europa/index.html

**17. The numbers in the two study editions agree.** The only differences are thousands formatting and the English glosses of the Portuguese quotes («about 375 thousand … almost 250 thousand»). Both Abrantes pages carry the same numbers. References: built/en/studies/a-casa-em-portugal-e-na-europa/index.html, built/estudos/a-casa-em-portugal-e-na-europa/index.html

**18. Question 3 answer: on the diff as shown, no ruler protecting a number, a source or a person is weaker than at the pre-I head.** The weakenings exist only in the copied files (findings 3 to 5). References: diff.patch:162, diff.patch:211, ANTES-DA-I/scripts/medir-defeitos.mjs:981