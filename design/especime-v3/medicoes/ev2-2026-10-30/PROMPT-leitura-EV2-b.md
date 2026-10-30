# The short read of the corrections to block EV2 (the dated update of the study «As contas da Câmara de Évora, 2010 a 2025»), 30.10.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: list every quotation the changed passages reprint, with its source page and whether the words match). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block and what this read covers

EV2 rewrites passages of the Évora accounts study so that causes are said as interpretations, and adds three derived figures (7,4 %, 42 220 018 €, 45,6 %). An earlier cold read (`LEITURA-A-FRIO-EV2.md`, on site head `__LEITURA_SITIO__` and engine head `__BASE_MOTOR__`) found two Blocking (plants), three plant Majors and real Majors 6 to 10, with Minors 14 and 15. The corrections are addenda F and G (`ADENDA-F.md`, `ADENDA-G.md`; G removes «no seu quadro 5» / «in their table 5» from F's sentence 3, because the composer refuses a hand-typed number), and two site commits the cold read did not see, `EV2-7` and `EV2-8` (the read-text proof reads the documents manifest as YAML; its scope goes from 14 to 18 editions).

The files:
- `diff.patch`: the whole EV2 site branch against `main` (base `__BASE_SITIO__`, the DO3 records head now live; head `__CABECA_SITIO__`). `diff-sitio-desde-a-leitura.patch`: only the branch's own commits since the cold read, without the merge of `main`.
- `motor/diff.patch`: the engine since the cold read (base `__BASE_MOTOR__`, head `__CABECA_MOTOR__`), with the changed files beside it; `motor/estudo-16/ledger.json`.
- `fontes/PRESTACAO_CONTAS_2025.pdf`: the hosted source body (the cold read's finding 9), with its sha256 in `motor/CORPOS-ALOJADOS.md`, and pages 110, 113, 122 and 124 in text beside it.
- `built/`: the front page and the study page, each in both editions.
- `relatorio-construtor.md` and `RELATORIO-COMPLETO-ev2-*.md`: the builder's reports. `CONFERIR-TUDO-b.md`: the director's full run of the `verify` list on this head.

## The six questions

1. **The cold read's findings.** For findings 6, 7, 8, 9, 10, 14 and 15: is each one closed on this head, in the built pages of both editions (not just in the templates)? Say for each one what now closes it, or what is still open.
2. **The sentences.** Addendum F §1's four sentences, as amended by G, word for word in both editions, in the templates, the composed files, the records and the built pages. No other sentence of the study changed. No dash. No sentence about the house.
3. **The source.** Open the PDF pages yourself (the text beside it, and the PDF where the layout matters). Does each new sentence keep what the source says of the same measure: «influenciada negativamente» and «explicam, em parte» on p. 122; «Outras Receitas Correntes» unchanged between «Dot. Iniciais» and «Dot.Corrigidas» on p. 110, so that the 45,6 % of p. 113's line compares like with like; the 7 % of p. 124 against the study's 7,4 % (and the 2024 value being the 2025 report's comparative)? Is any cause still said as a fact?
4. **The date.** Both editions: first publication 01.10.2026 kept, update 30.10.2026, in the form the other Évora studies use («publicado a … · atualizado a …» / «published on … · updated on …»). What does the front page now do with the study (the «O que há de novo» box and the recent-studies cards), and is that what the box's rule says for an `updated` edition? Does the HTML gate check where the update date comes from (`EV2-13`), with a plant that bites?
5. **The read-text proof.** `EV2-7` and `EV2-8`: does the proof now read every edition of `studies-src/manifest.yml` (18), with the YAML reader the rest of the site uses, and does a plant prove it still bites? Did any ruler that protects a number, a source or a person get weaker anywhere in the branch?
6. **Reading it.** Does a reader of the study, in both editions, now understand the corrected budget, the 2024 caveat beside the 7,4 %, and that the report's explanation is the report's? Is anything said twice?

Then the editor's question: would an editor of a Portuguese daily publish the study page, in both editions, as it stands?

Budget: at most 50 tool calls.
