# Leitura a frio do Codex ao bloco F1.4b (as datas de publicação dos estudos, e o espaço entre o número e a palavra), 07.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 15:54 a 16:12 UTC de 07.09.2026, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, a terceira conta do portão invertida (`raso === 'true'`) na fonte e no diff, apanhada no Blocking 2; P2, a régua I9 a comparar só o ano, apanhada no Major 4, com a diferença entre a cópia e o diff dita; P3, a tabela do relatório com 14.08.2026 na edição inglesa de «Évora, prometido, pago, auditado», apanhada no Major 7 e no Minor 11; P4, o índice dos estudos construído com 04.09.2026 numa edição, apanhada no Blocking 1. A leitura correu a 07.09 e não a 04.09 porque o bloco se fundiu antes dela, por exceção (§1.99); o pacote levou os dois índices dos estudos e as duas primeiras páginas, e não as 24 páginas de edição, porque o `dist/` estava a ser reconstruído quando se copiaram, o que pesa no Major 3 e no Minor 11. Triagem do lugar de direção (pela delegação de 04.09, §1.98): o Major 3 é real na parte que o pacote não explica: a conta 1a do portão só confere que a data impressa pertence ao conjunto das datas declaradas, e a conta 1b só olha à página da edição, por isso uma data trocada por outra data declarada numa linha do índice passa verde; a segunda passagem prende cada data impressa à sua edição em todas as páginas que a imprimem, nas duas edições, com a planta da troca. O Major 5 é real: um erro do `git` numa edição não é a ausência de um commit de adição, e o script não pode escrever um ficheiro parcial por cima do commitado; a segunda passagem distingue o erro da ausência e pára no erro. O Major 6 e o Major 9 são do pacote na maior parte (a história do repositório e as saídas dos comandos não foram enviadas; as contas com história correm na CI) e ficam com uma parte real: o relatório passa a citar as dezasseis linhas do `git log` e a guardar a saída da I11 em `medicoes/`, como os outros blocos guardam as suas medidas. O Major 8 é real e pequeno: o guarda aceita `2026-99-99` e chaves repetidas; a segunda passagem exige uma data de calendário e chaves únicas, com provas. O Minor 10 é real: a I11 aceita um par medido em sete e um apanhado em sete; passa a exigir os pares todos da página e o defeito plantado apanhado em todos. O Minor 12 é uma frase ambígua do relatório («a mesma quantidade» era a distância de cada edição ao dia da construção, que não é uma quantidade só) e corrige-se a frase. O Minor 11 é do pacote (o relatório copiado é o de `ca8e013d`, com a secção 0, e a planta P3). O que é real entra pelo ramo `datas-b-2026-09-07`. O texto do leitor fica como veio.*

---

## Blocking

1. **The supplied Portuguese archive still publishes the known-bad date “04.09.2026” for `evora-economia-investidores-portas-abertas-2026`.**

The committed JSON, the builder’s table and the English archive all give this edition `12.08.2026`. This violates the required page-to-JSON agreement and the parity between editions. Because `04.09.2026` is absent from the JSON date set, the supplied `check:datas` code would reject this page, so the report’s claim that `npm run build` returned 0 cannot describe these supplied head pages.

built/estudos/index.html:1, built/en/studies/index.html:1, src/data/datas-de-publicacao.json:46, src/data/datas-de-publicacao.json:48, relatorio-construtor.md:16, relatorio-construtor.md:197, scripts/check-datas.mjs:146

2. **`check-datas` reverses the meaning of Git’s shallow-repository result.**

`git rev-parse --is-shallow-repository` returns `true` for a shallow clone, but the script sets `comHistoria` when the result is `true`. A shallow build therefore enters the branch labelled “história completa” and compares the JSON against truncated history, while a full-history run skips that comparison and logs “RASA”. Since this gate is in `build`, the report’s stated shallow production environment would run the unsafe branch, while full-history CI would never perform the promised JSON-to-Git validation.

scripts/check-datas.mjs:238, scripts/check-datas.mjs:249, scripts/check-datas.mjs:251, scripts/check-datas.mjs:315, scripts/check-datas.mjs:318, scripts/check-datas.mjs:324, package.json:12, relatorio-construtor.md:160

## Major

3. **The page gate does not bind an archive date to its corresponding study edition.**

Its first pass merely checks whether each printed date belongs to the global set of dates appearing anywhere in the JSON. Its second pass looks for a marked date at `/estudos/<slug>` or `/en/studies/<slug>` and silently continues when that route has no marked date. The supplied marked dates are on the two archive pages, so their study-to-date associations are never checked; replacing an archive row’s date with another date already declared in the JSON would remain green.

scripts/check-datas.mjs:97, scripts/check-datas.mjs:132, scripts/check-datas.mjs:146, scripts/check-datas.mjs:166, scripts/check-datas.mjs:169, scripts/check-datas.mjs:173, built/estudos/index.html:1, built/en/studies/index.html:1

4. **The copied I9 ruler differs from the diff and compares only the year, not the complete date.**

The diff adds `declarada.data !== data`, but the copied file contains `declarada.data.slice(0, 4) !== data.slice(0, 4)`. A wrong month or day in 2026 therefore passes when the commit remains correct, contradicting the report’s “date and commit, entry by entry” claim. I9 also continues silently when one Git lookup fails and only rejects the case where no lookup succeeds at all.

tests/livro/indice.mjs:790, tests/livro/indice.mjs:797, tests/livro/indice.mjs:811, tests/livro/indice.mjs:835, diff.patch:1673, relatorio-construtor.md:178

5. **The date-generation script converts individual Git failures into absent facts and can overwrite the committed JSON with a partial result.**

Any exception from an edition’s `git log` is caught and converted to an empty result, after which the edition is recorded as having no addition commit and processing continues. The script refuses to write only when every edition fails; one success is enough for it to overwrite the destination. This makes an operational Git failure indistinguishable from evidence that no addition commit exists.

scripts/datas-de-publicacao.mjs:149, scripts/datas-de-publicacao.mjs:162, scripts/datas-de-publicacao.mjs:169, scripts/datas-de-publicacao.mjs:179, scripts/datas-de-publicacao.mjs:216, scripts/datas-de-publicacao.mjs:217

6. **None of the sixteen JSON dates or commit hashes is reproducible against its claimed Git source from this package.**

The JSON contains a provenance description and command, but not the repository history, the `studies-src` files or full-history command output for its entries. The report shows only one shallow-clone example, which cannot establish any of the sixteen committed measurements. Thus the central acceptance claim that every JSON entry equals its addition commit remains unproven.

brief.md:21, brief.md:22, relatorio-construtor.md:84, relatorio-construtor.md:92, relatorio-construtor.md:184, relatorio-construtor.md:207, src/data/datas-de-publicacao.json:2, src/data/datas-de-publicacao.json:6

7. **The report gives the English `evora-prometido-pago-auditado-2026` edition an impossible date relative to its own commit and the package.**

The report assigns the Portuguese edition `15.08.2026` and the English edition `14.08.2026`, while assigning both the same `ec152217` commit. The JSON and diff assign that same full commit and `2026-08-15` to both editions, and the report later says both entered on 15 August. The built archives also print the shared `15.08.2026` date.

relatorio-construtor.md:201, relatorio-construtor.md:202, relatorio-construtor.md:217, src/data/datas-de-publicacao.json:76, src/data/datas-de-publicacao.json:83, diff.patch:1160, diff.patch:1167, built/estudos/index.html:1

8. **The runtime data guard accepts impossible calendar dates and duplicate edition keys.**

The date check enforces only a digit pattern, so a value such as `2026-99-99` passes. `eDatasDePublicacao` validates entries independently without checking uniqueness, after which the `Map` silently keeps only the last duplicate slug/language entry. Combined with I9’s year-only comparison and the inverted full-history gate, a same-year invalid date can reach the page without the promised independent check.

src/lib/datas-do-repositorio.mjs:118, src/lib/datas-do-repositorio.mjs:122, src/lib/datas-do-repositorio.mjs:131, src/lib/datas-do-repositorio.mjs:139, src/lib/datas-do-repositorio.mjs:182

9. **The reported green runs, planted failures and exact browser gaps are unshown claims, not reproducible measurements.**

The report says build, verify and typecheck outputs were read from log files, but those files are not included. It likewise supplies no retained output for the three planted failures, the shallow-clone gate run, the `2.59 px` minimum gap or the two `7 of 7` results. The supplied front pages refer to an external built stylesheet that is not in the package, so their rendered gaps cannot be reconstructed from the HTML alone.

brief.md:24, brief.md:25, relatorio-construtor.md:16, relatorio-construtor.md:164, relatorio-construtor.md:172, relatorio-construtor.md:241, relatorio-construtor.md:265, built/index.html:1

## Minor

10. **I11 does not enforce the seven-count coverage or the reported “7 of 7” known-positive result.**

For the unmodified page it requires only that at least one pair be measured, not that all seven expected pairs be present. For the planted defect it fails only when zero pairs are caught, so even `1 of 7` would leave the cell green. The stronger `7 of 7` result exists only in the report.

tests/livro/indice.mjs:1178, tests/livro/indice.mjs:1179, tests/livro/indice.mjs:1193, tests/livro/indice.mjs:1195, tests/livro/indice.mjs:1203, relatorio-construtor.md:265

11. **The package omits a changed file added by the diff, and the supplied builder report is not an equivalent copy.**

The diff adds `design/especime-v3/medicoes/datas-construtor.md`, and `ISSUES.md` points readers to that path, but the copied file is absent. The separately supplied `relatorio-construtor.md` has an additional section 0 and changes the English `evora-prometido` date from the diff’s `15.08.2026` to `14.08.2026`. Consequently that changed repository file cannot be checked line for line against its head copy.

diff.patch:33, diff.patch:38, diff.patch:185, design/especime-v3/ISSUES.md:121, relatorio-construtor.md:8, relatorio-construtor.md:202

12. **The report’s assertion that all sixteen wrong dates differed by the same amount contradicts its own table.**

The published value is consistently stated as 4 September, but the measured dates include 12, 15 and 24 August. Those correspond to different offsets, not one common quantity. This is an arithmetic error in the report’s interpretation.

relatorio-construtor.md:192, relatorio-construtor.md:201, relatorio-construtor.md:206, relatorio-construtor.md:211

## «What is fine»

13. **The JSON is internally complete and unique for sixteen slug/language entries, while both archive headers consistently print twelve works and sixteen editions.**

src/data/datas-de-publicacao.json:9, src/data/datas-de-publicacao.json:123, src/data/studies.mjs:56, src/data/studies.mjs:285, built/estudos/index.html:1, built/en/studies/index.html:1

14. **The build-time reader no longer imports or invokes Git and reads the committed JSON with explicit missing-file and malformed-file failures.**

src/lib/datas-do-repositorio.mjs:57, src/lib/datas-do-repositorio.mjs:154, src/lib/datas-do-repositorio.mjs:157, src/lib/datas-do-repositorio.mjs:166

15. **The manual generator correctly refuses a shallow repository before reaching the destination write.**

scripts/datas-de-publicacao.mjs:97, scripts/datas-de-publicacao.mjs:109, scripts/datas-de-publicacao.mjs:122, scripts/datas-de-publicacao.mjs:216

16. **The missing-date warning is conditionally rendered, counts editions and has equivalent Portuguese and English singular/plural text.**

src/views/EstudosView.astro:93, src/views/EstudosView.astro:120, src/views/EstudosView.astro:125, src/i18n/strings.mjs:1686, src/i18n/strings.mjs:2651

17. **The number-and-word spacing change is static shared markup, and both supplied front pages contain the intended spaces without depending on JavaScript.**

src/components/inicio/Portas.astro:72, src/components/inicio/Portas.astro:85, built/index.html:1, built/en/index.html:1