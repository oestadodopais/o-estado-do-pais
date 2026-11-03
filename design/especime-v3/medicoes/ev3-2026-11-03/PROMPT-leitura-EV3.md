# The cold read of block EV3, 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: give it for every quoted excerpt this block adds). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

The study «Évora 2027, Capital Europeia da Cultura» was written on readings of 15.09.2026. EV3 adds the October 2026 municipal records on the Rossio de São Brás (the Câmara's notice of 23.10, the Câmara's decisions of 15.10 and 29.10, the Assembleia Municipal's vote of 22.10), a licence for conservation works requested by the association itself, and the date of the association's latest news item. It is a dated update with new documents, not a correction, so the corrections register gains a fifth kind, «Estudo atualizado», which the published-corrections count must not include. Addendum G then takes the self-explanation off two reader pages, after the funder, reading the live site, sent three screenshots. The corrections page loses its slogan subtitle and its list of kinds, and its policy becomes two plain sentences. The front page's «O que há de novo» box stops showing the latest register entry, which had put the site's own recount of its corrections on the front page. The mandate is `brief.md`, followed by addenda A to G (`ADENDA-A.md` to `ADENDA-G.md`). The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`) and the engine diff is `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The eight questions

1. **True to the documents.** For each new sentence, in both editions, does every fact, number, date and quoted excerpt say exactly what the hosted documents say: the four municipal documents and the news page? Is anything stated that no document says? In particular, check the Assembleia Municipal vote, the 60 days, the abstentions, the DECOVERDI award and the licence's address.
2. **Fair reading.** Does the update keep the study's earlier statement about who carries out the bid's works intact and correctly bounded? The licence is for conservation works the association requested on one property; the plan's statement is about the bid's venues. Does any sentence imply a cause, a completion or a cost that the documents do not state?
3. **The documents.** Are the hosted copies present with their request receipts, and do the three PDFs match the sha256 values in the mandate? Is each new publisher in the closed register, measured in its document?
4. **The edition history.** Is the previous edition kept by its fingerprint, does the current edition's band say what it is, does the register entry read word for word as addendum A §2.4 writes it, and is its kind «Estudo atualizado»?
5. **The new kind.** Does the register label the new entry «Estudo atualizado» / «Study updated», and is an update (of a value or of a study) never counted as a correction? Check the counter, the shared counting function and its planted fault, which addendum G says must stay exactly as they were.
6. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in these diffs? In particular, did removing the register entry from the front-page box take any date check of the box's pieces with it?
7. **Reading it.** Read the three new passages in both editions as a reader would, including the date forms and the address quoted from a scanned document. Do they read whole and clear?
8. **Addendum G.** On the built corrections page, in both editions: is the text between the title and the register exactly addendum G §2 plus what its point 5 keeps, with no subtitle and no list of kinds? Is the policy true of what the register actually holds and does? On the built front page, does the box hold only studies, items, explanations and dossiers, and can a reader still reach the register in one tap? Do G's two rulers bite (their plants) and pass on the head?

Then the editor's question: would the editor of a Portuguese daily print these passages, the register entry and the corrections page as they stand?

Budget: at most 50 tool calls.
