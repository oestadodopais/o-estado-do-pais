# The short read of COR-AGUA, addenda G and H, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The short read of addenda D to F (`LEITURA-coragua-curta.md` in this package, with the direction seat's decision on each finding at the top) led to `ADENDA-G.md`; a tap-target check then led to `ADENDA-H.md` (the corrections register's source labels counted as running prose, and addendum C's 44-pixel rule removed). The diff is `diff.patch` (site) and `motor/diff.patch` (engine). The direction seat wrote the sentences in `ADENDA-G.md` and in its list `FRASES-COR-AGUA-g.json`, from the saved copies.

## The questions

1. **The three rewritten sentences of «Onde está a água»,** in both editions: the ratio conclusion, the irrigator's prices and the base values. Is each true to its source? The sources are:
   - the ERSAR page: «para um consumo de 10 metros cúbicos», the fixed part, IVA and the water resources tax;
   - the edital's Anexo II: the rows of the irrigation blocks against those for precários and direct abstractions; the water resources tax; the conservation component; whether the edital says anything about IVA.
   
   Does each keep the measure, the population and the qualification of each number it uses? Do the two editions say the same?
2. **The «Onde está a água» entry of the corrections register:** letter by letter against `ADENDA-G.md` and `ADENDA-D.md`.
3. **The 2005 Tribunal de Contas report,** now hosted (`tcontas-rel003-2005-2s.pdf`): is the Portuguese page's quotation «apenas cerca de 7% do volume de investimento previsto» in it, word for word, reading the two columns in order? Is the English rendering faithful?
4. **The ERSAR excerpt:** is the figure number now separate from the footnote call?
5. **The tap-target rule** (`tests/acessibilidade/alvos.mjs`, the H2): is adding the register's container to `naProsaCorrida` the narrow change the EX1 precedent made, with a plant proving the class alone exempts the labels? Does any label outside the register change family?
6. **Would a Portuguese daily's editor print these passages as they stand?**

Budget: at most 25 tool calls.
