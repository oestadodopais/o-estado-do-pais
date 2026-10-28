# Segunda leitura curta (M48) da correção OG1-B-d (Claude Opus 5.5, `leitor`, xhigh; 28.10.2026, 23:35 a 23:39 UTC; 27 chamadas de ferramenta)

*O relatório tal como o leitor o devolveu (em inglês), copiado pelo lugar de direção a 28.10.2026 às 23:41 UTC. O pacote: `_aterragens/pacote-og1bd-2026-10-28`, com cinco plantas só nas cópias (Z1 a Z5).*

Reader: Claude Opus 5.5 (`leitor`). I read only the package. I used 27 tool calls, within the 30-call budget. I wrote no `LEITURA.md`. All paths and lines below are relative to the package root.

Overall: once the five plants are set aside, the correction does what the mandate asked in both editions. What remains are Minor findings and the editor's notes.

## Blocking

1. **The English front page prints the Council's 2027 deficit as 0,2 %, while every other copy of the same claim prints 0,1 %.** On the EN front page, the element `data-claim="og1-cfp-saldo-2027"` renders `0,2`. The same claim renders 0,1 % on the PT front page, on the EN items page and on the PT items page. `frases-construidas.json` records the `/en/` first sentence as «…a deficit of 0,1 %.», and that text cannot be found on the built EN front page. Planted. built/en/index.html:6, built/index.html:6, built/en/under-discussion/index.html:4, frases-construidas.json:1

2. **The copied data file ties the PT opening's «um défice de» to the wrong ledger row, `og1-cfp-diferenca-mf`, instead of `og1-cfp-saldo-2027`.** The copy has `"claim": "og1-cfp-diferenca-mf"` at line 58. The diff adds `og1-cfp-saldo-2027` at that position, and so do the EN half of the same paragraph, `mandato-frases.json` and brief §1.1. The built PT page links `/livro-razao/og1-cfp-saldo-2027`. Planted. src/data/discussao-og1.mjs:58, src/data/discussao-og1.mjs:79, diff.patch:2281, mandato-frases.json:7, brief.md:15

## Major

3. **The built PT page's «A conclusão» still states the Council's wording as fact; the «segundo o Conselho» fix is missing there, while the EN page has it.** The source copy has «as duas medidas que, segundo o Conselho, a proposta não especifica o suficiente» at line 2017; `frases-construidas.json` records the qualified text, and it is the only PT record not found on the page. Planted. built/o-que-se-discute/index.html:4, built/en/under-discussion/index.html:4, src/data/discussao-og1.mjs:2017, brief.md:22

4. **In `diff.patch`, the changed line of «A comparação» still says «a maior medida de receita», so the record of the change does not show the Major 5 fix.** Lines 2417 and 2418 of the diff are identical. The copy has «a maior das medidas novas de receita» at line 1795; the built PT page and the inventory row show the new wording. Planted. diff.patch:2417, diff.patch:2418, src/data/discussao-og1.mjs:1795, INVENTARIO-FRASES.md:5019

## Minor

5. **The report's call count does not add up: 22 + 3 is printed as 27.** `numeros-do-relatorio.txt` records 25 for the same line. Planted. relatorio-construtor.md:237, numeros-do-relatorio.txt:41

6. **The item still talks about itself.** The vote paragraph in «O que as fontes dizem» still ends «…não estavam publicados quando este item foi reescrito» (EN: «when this item was rewritten»). Brief §0.4 removed exactly this self-reference from the opening, but this second instance was not on the mandate's list. src/data/discussao-og1.mjs:1282, src/data/discussao-og1.mjs:1345, built/o-que-se-discute/index.html:4

7. **The sources paragraph about the Council still carries the unattributed clause «as duas medidas que a proposta não especifica o suficiente» in both editions.** The sentence's subject is the Council's projection, so it is weaker than the three cases the mandate fixed; still, the page keeps one occurrence in the site's voice. src/data/discussao-og1.mjs:1397, src/data/discussao-og1.mjs:1486

8. **Three report claims cannot be checked from the package, and one thing brief §3.5 asked for is missing.** The report says commit `41f09be5` «contém os cinco ficheiros da alteração» but does not name them; the diff runs from `2818dcaf2` to `8da50ca7` and cannot be split by commit (outside the measurement folder it shows four changed site files). The report says the later commit changes no site file; the captures, `cabeca-limpa` and `frases-construidas` all point to `41f09be5`, not to the package head `8da50ca7` (the report discloses this). The LEIA-ME section does not print «as frases tal como renderizam»; it points to `frases-construidas.json`. relatorio-construtor.md:195, :235, :191, :197

9. **Nothing in this pass's logs names the FP2 ruler.** The 768 of 768 plants and the 24 bites in check-primeira are green, but nothing shows by name that the FP2 plants are among them. og1-b-d-check-discussao.log:6, og1-b-d-check-primeira.log:5

10. **Editor's view: the front-page sentence is now the news, but it reads clumsily, and the second paragraph is too long to print as is.** The front page prints the date twice within one line («28.10.2026 · O Parlamento aprovou … na generalidade a 28.10.2026»); the sentence is 61 words in PT and 51 in EN and joins two facts with «e»; the second paragraph is one sentence of 113 words in PT and 124 in EN, with a parenthesis, a semicolon, two quotations and three attributions. A daily would print the first sentence with the in-sentence date cut, and split the second paragraph after the parenthesis. Weak, not wrong. built/index.html:6, built/en/index.html:6

## «What is fine»

Package completeness: no ledger row changed, the engine diff is empty, no `SEM-CORPOS` file. Q1: each opening paragraph is one sentence ending in a full stop, as the brief says; the front-page sentence has no link and no self-reference; the receipts match the mandate. Q2: the built pages say «a maior das medidas novas de receita» and «the largest new revenue measure»; neither page prints the plain superlative anywhere. Q3: the copy qualifies the comparison, the conclusion and the opinion in both editions; the one exception on a built page is the plant. Q4: the Health year links to `oe-2027-saude-despesa-efetiva-consolidada-2026` in both editions, words unchanged, with the matching literal in `palavras.json`. Q5: apart from the plants, the diff touches only the listed sentences; the ten inventory rows rewritten in place; the OG1A count is 57+57; `frases-construidas` has 46 entries, all `igual_ao_mandato`. The report's counts reproduce from the logs: 768 of 768 plants, 764 integration doors, 636 OG1 checks, 9 glosses and 60 numeric plants, 472 click paths, 32 passes on 16 pages, 4 056 marked pieces and 52 of 52 browser plants, 753 audit leaves, 21 exit-code files, 20 captured pages and 70 crops, a tree clean before and after.

## The five planted defects found

1. src/data/discussao-og1.mjs:58: `og1-cfp-diferenca-mf` instead of `og1-cfp-saldo-2027` in the PT opening (finding 2).
2. diff.patch:2418: the `+` line of «A comparação» still says «a maior medida de receita» (finding 4).
3. built/en/index.html:6: the EN front page prints «a deficit of 0,2 %» for `og1-cfp-saldo-2027` (finding 1).
4. built/o-que-se-discute/index.html:4: «segundo o Conselho» missing from the built PT conclusion (finding 3).
5. relatorio-construtor.md:237: «totalizando 27 chamadas» where 22 + 3 = 25 (finding 5).
