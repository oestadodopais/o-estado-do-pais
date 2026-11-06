# The short read of the batch 4 fixes (PAI2 addenda C and D, VOZ-1 addenda B and C and pass D, M48), 05.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 for any sentence that reports what a source or a person said. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

Batch 4 is PAI2 (the country in one table per theme on the Temas page) and VOZ-1 (reader pages stop talking about themselves). `LEITURA-lote4.md` is the cold read of the head `0e4185401`. `ADENDA-C-PAI2.md` and `ADENDA-B-VOZ1.md` answer its real findings. The director's full run on the head after them had two reds, answered by `ADENDA-D-PAI2.md` (the period repeated in the ledger index entries) and `ADENDA-C-VOZ1.md` (the pages each calendar event updates). The next full run stopped on the menu of `/agenda`, which addendum C had rewritten; `brief-VOZ-1-D.md` and `ADENDA-A-VOZ-1-D.md` answer it. The mandates are `brief-PAI2.md` and `brief-VOZ-1.md`. The site diff is `diff.patch` (base `__BASE__`, the head the cold read saw; head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The six questions

1. **The revision notice (PAI2 C §1).**
   - On every page that shows a measure with a pending revision, does the notice name that measure, with the same name the card and the table show for that row, in both editions?
   - Where two notices sit together, can a reader tell which number each one is about?
   - Is the revised value written in each edition's number form, so English prints `7,6` and not `7.6`?
   - Does the notice's ruler check the name against the row, and does its plant bite?
   - In the ledger index entries (`/livro-razao`, `/en/ledger`), does the notice name the measure without repeating the period the entry already shows, while cards, tables and the front page keep it (`ADENDA-D-PAI2.md`)? Is `check:indice` I2p unchanged, and does its plant bite?
2. **The comparison columns and the header (PAI2 C §2, §3).**
   - In the previous and Union columns, does each cell carry the unit of its row's measure, as the card shows it?
   - Is there any cell where a unit is written on a number that measures something else?
   - Does `check:quadro` check each cell's unit against its row, and does its plant bite?
   - Is the reference column headed «Valor de referência» / «Reference value», with each cell still naming whose reference it is?
3. **The source calendar and the register (VOZ-1 B §1, §3).**
   - Does a source that publishes no date read «sem data anunciada» / «no announced date», and one that could not be read «data por confirmar na fonte» / «date to be confirmed at the source», as the data's `motivo_sem_data` says?
   - Is every listed event dated on or after the build date, or undated?
   - Does each event list the site pages it updates, by title and with a link, and no ledger slug?
   - Are the site's entry pages and indexes (the front page, Temas, Índice, Estudos, O que se discute, A leitura da semana, the Áreas page) out of those lists (`ADENDA-C-VOZ1.md`)?
   - Does every calendar link to a page that is in the menu use the menu's exact spelling, read from the page's own menu, and is the menu of `/agenda` and `/en/agenda` identical to the menu of every other page (`brief-VOZ-1-D.md`)? Do the L1 and N1 plants bite?
   - Are the 44 px touch targets in the stylesheet and not in a `style` attribute?
   - Do the agenda's research items stay off the page, with the page's title and description about the calendar only?
   - Does the corrections register print row titles with the door to the receipt, and no row id?
4. **The sentences (VOZ-1 B §4).** Do these read exactly as written, in both editions, with the same tokens and conditions?
   - The 2026 explainer: «O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês.»
   - The weekly line: «Entre ⟦data⟧ e ⟦data⟧, ⟦n⟧ números foram relidos na fonte: nenhum valor publicado mudou, e a fonte reviu ⟦k⟧, ainda com o valor de antes da revisão.» Do the builder's forms for one revision and for provenance changes follow the same shape and say nothing false?
   - The `/areas` lede: does it read as `ADENDA-B-VOZ1.md` §4.3 writes it, in the `area` and `dominio` forms, with no internal document named?
5. **The voice ruler and the rulers (VOZ-1 B §5).**
   - Does the broad expression catch the class the addendum names?
   - Does each kept sentence on the closed list carry one of the three reasons, and is that reason true of it?
   - Does the VOZ-2 exemption name exactly what it exempts, with the date and the block that removes it?
   - Does a sentence of the class in an explainer turn the build red?
   - Did any ruler that protects a number, a source or a person get weaker anywhere in this diff?
6. **Reading it.** Read these as a reader would, in both editions:
   - the Temas page;
   - the front page;
   - the calendar page;
   - the corrections page;
   - the two explainers;
   - `/areas`.

   Is there any sentence left in which the site or the piece talks about itself, says what it does not do, or apologises? Is anything a reader saw before these fixes now missing or wrong?

Then the editor's question: would the editor of a Portuguese daily publish these pages as they stand?

Budget: at most 45 tool calls.
