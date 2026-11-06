# A leitura curta do lote 4 (as adendas C e D da PAI2, B e C da VOZ-1 e a VOZ-1-D), 05.11.2026

*Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote `pacote-lote4-curta-2026-11-04` (base 0e4185401, cabeça e `dist/` 25821b087), lançada às 19:40 UTC e entregue às 19:53 UTC; 42 chamadas contra um orçamento de 45 (o contador da ferramenta diz 46). **Quatro plantas em cinco**, registadas por sha256 em `pacote-lote4-curta-2026-11-04.plantas.json`: P3 é o achado 1, P1 o 2, P2 o 3, P5 o 4. **Não viu P4**, a primeira porta do calendário para a União Europeia escrita `/uniao-europeia/` contra o menu da mesma página (`/uniao-europeia`): leu a grafia no atributo `data-calendario-pagina`, e não no `href`, e escreveu «the calendar's `/uniao-europeia` uses the menu's spelling». A classe é a que a régua L1 recusa no `build`, e a sua planta morde (o achado «L1 and N1 plants» da secção do que está bem). Os achados reais são o 5, o 6 e o 7, na adenda D da VOZ-1; os Minor 8 a 16 vão à higiene; o 10 foi conferido por este lugar no código e não é um enfraquecimento (o quarto argumento de `conferirCampoRelido` é a forma decimal esperada no inglês; dentro do aviso passa a ser a vírgula que a adenda C da PAI2 manda, e a comparação continua exata).*

Short read (M48) of batch 4 fixes: PAI2 C/D, VOZ-1 B/C, VOZ-1-D. Base 0e4185401, head 25821b087. Reader: Claude Opus 5.5. 42 tool calls. Everything was read inside the package. Two checks used one-line `node -e` / `python3 -I -c` commands, and no files were written.

## Blocking

None. No ledger row changes in `diff.patch` (no `ledger/claims` path among the changed files). The only row listed is a page-requested row with no hosted document. There is no `SEM-CORPOS-ALOJADOS.md` (motor/CORPOS-ALOJADOS.md:7, motor/corpos-alojados.json:3-11).

## Major

**1. The Portuguese 2026 explainer still prints the sentence that addendum B §4.1 removes: «…mês a mês, e a execução até agosto está acima.»** (planta P3)
- The data file in this package has the new sentence. The English page prints the new English sentence.
- So the built Portuguese page matches neither its data nor the other edition. It still carries the reading the cold read flagged: «a execução está acima do orçamento», which no number on the page supports.
- `CONFERIR-TUDO.md` reports `check:explicacoes` and `gate:html` at 0 on this head. Either this page is not the `dist/` the run saw, or the rulers that compare paragraphs to data do not bite.

References: built/explicacoes/dinheiro-do-estado-2026/index.html:1, src/data/explicacoes/dinheiro-do-estado-2026.mjs:592, built/en/explainers/dinheiro-do-estado-2026/index.html:1, ADENDA-B-VOZ1.md:25-27, CONFERIR-TUDO.md:13, CONFERIR-TUDO.md:56

**2. The English Themes table prints the revised value as «7.6», the exact form addendum C §1 forbids.** (planta P1)
- On `/en/themes`, the notice on `sobrecarga-do-custo-da-habitacao-2025-ue` reads «…in the European Union, 2025 to 7.6 in the re-reading of 02.11.2026».
- The same notice prints «7,6» on every other English page in the package: the front page, Housing, the Ledger, the European Union page, Studies, the weekly reading and the receipt.
- `textoAviso` always writes a comma. So Q4 in `conferirAvisos` would refuse this cell, yet `check:quadro` is 0 on the head.

References: built/en/themes/index.html:1, built/en/index.html:1, built/en/housing/index.html:1, built/en/ledger/index.html:1, scripts/check-quadro.mjs:52, scripts/check-quadro.mjs:85-90, ADENDA-C-PAI2.md:13, CONFERIR-TUDO.md:4

**3. The Portuguese ledger index entry `desempenho-das-exportacoes-2024` still repeats the period, as bare text with a stray comma: «…(quota de mercado das exportações), 2024, para 17,0…».** (planta P2)
- Addendum D §1.1 names this exact entry.
- The English entry, and the other two Portuguese index entries, drop the period correctly.
- The «, 2024,» sits outside `data-revisao-nome` and is not a `reference_date` field. So I2p's field count would not see it, and the new I2p plant only inserts a field inside the name span.
- `conferirAvisos` with `comPeriodo=false` compares the whole text and would refuse it, yet `check:quadro` and `check:indice` are 0.

References: built/livro-razao/index.html:1, built/en/ledger/index.html:1, ADENDA-D-PAI2.md:14-16, tests/livro/indice.mjs:2316-2324, scripts/check-quadro.mjs:85-90, CONFERIR-TUDO.md:4, CONFERIR-TUDO.md:43

**4. The diff and the package copy disagree on the broad voice expression. The diff's version leaves out «aqui», which addendum B §5.1 lists.** (planta P5)
- `diff.patch:714` adds `PROPRIA` without `aqui`. The copied `scripts/voz-autorreferencia.mjs:18` has it.
- I ran both expressions with node:
  - With the diff's version, «Aqui nenhum valor é estimado.» and «Os números aqui publicados não incluem os Açores.» pass, while their English equivalents with «here» are caught.
  - With the diff's version, the closed-list sentences «Quando o que se publicou aqui está errado…» and «O que procurou aqui e não encontrou?» are not caught at all, so their list entries are dead.
- Whichever file is right, the ruler as committed is narrower in Portuguese than in English and than the mandate.

References: diff.patch:714, scripts/voz-autorreferencia.mjs:18, ADENDA-B-VOZ1.md:43, scripts/voz-excecoes.json:4, scripts/voz-excecoes.json:64

**5. A sentence on the closed list carries a reason that is false of it.** (real: a adenda D da VOZ-1, §1.1)
- «É o primeiro que não veio de um anfitrião de artefactos: foi produzido no motor de investigação deste projeto e atravessou como ficheiro, com as duas edições.» is kept as «facto de uma fonte».
- It is the site describing its own machinery, in jargon a reader cannot follow. That is the class VOZ-1 removes, and no source says it.
- It is printed on both Correções pages, in Portuguese and in English («artifact host», «this project's research engine»).

References: scripts/voz-excecoes.json:16-17, scripts/voz-excecoes.json:34-35, built/correcoes/index.html:1, built/en/corrections/index.html:1, ADENDA-B-VOZ1.md:44-47

**6. «Atualiza:» sends readers to superseded study editions as pages that the next release updates.** (real: a adenda D da VOZ-1, §1.2)
- The Portuguese calendar links three pages:
  - `/estudos/evora-quinze-anos-cinco-mandatos`
  - `/estudos/evora-economia-investidores-portas-abertas-2026`
  - `/estudos/evora-orcamentado-pago-devido-2025`

  The English calendar links the third one.
- None of the three is in the Estudos index in either edition.
- The corrections register says the six August and September Évora studies «ficam alojados como edições datadas», succeeded by four. A dated edition is not updated by the next IEFP, INE or DGAL file, so «Atualiza:» is false for these pages.
- The script excludes entry pages but not superseded editions. This is also why the editions differ: 21 calendar links in Portuguese, 19 in English.

References: built/agenda/index.html:1, built/en/agenda/index.html:1, built/estudos/index.html:1, built/en/studies/index.html:1, built/correcoes/index.html:1, scripts/calendario-paginas.mjs:10

**7. The corrections register lost what told its entries apart. It now prints identical lines.** (real: a adenda D da VOZ-1, §1.3)
- The slug used to carry the year. The receipt title carries neither the year nor, for one row, the Union.
- Portuguese: «Dívida das famílias» ×3 (2024, 2025 and the EU row), «Dívida pública» ×2, «Crédito malparado» ×2, and more. English: the same.
- Only following the door shows which number each line is about. This is something a reader saw before these fixes and no longer sees.

References: built/correcoes/index.html:1, built/en/corrections/index.html:1, src/components/RegistoCorrecoes.astro:347, scripts/calendario-paginas.mjs:37-42, ADENDA-B-VOZ1.md:21

## Minor

**8. Three more closed-list entries give a reason that does not fit what the expression catches.**
- The 2026 explainer sentence «3,25 fonte · calculado de cada cem euros desta página…» is classed «facto de uma fonte», but its own chip says the figure is calculated.
- In the PCP sentence, the expression catches «e isso é um juízo, que não se mede». That clause is the site's own comment, not a source's fact. The stored reason describes something else («distingue a citação… conserva o registo dos votos»).

References: scripts/voz-excecoes.json:52-53, scripts/voz-excecoes.json:46-47, scripts/voz-excecoes.json:58-59

**9. The receipts exemption silently widens the voice ruler's exempt routes.**
- `livroConcelho` and `livroConcelhos` were measured before and are now exempt.
- No report mentions it.

References: diff.patch:707, diff.patch:726-727, scripts/voz-autorreferencia.mjs:12

**10. The gate's re-read check is inverted for revision-notice fields, and its effect cannot be checked from this package.**
- The fourth argument changes from `avisoDaRevisao || naRevisaoDaSemana(…)` to `!avisoDaRevisao && naRevisaoDaSemana(…)`. This changes how the `verifications.n.found` value inside every notice is compared.
- `conferirCampoRelido` lives in `scripts/verificacao-legivel.mjs`, which is not in the package. No report explains the change or shows a plant for it.

References: diff.patch:383-384, scripts/gate-html.mjs:40, scripts/gate-html.mjs:6839

**11. The notice's measure name is capitalised mid-sentence and carries no unit.**
- Examples: «A fonte reviu Sobrecarga do custo…», «The source revised Housing cost overburden…».
- «A fonte reviu Quota de Portugal nas exportações… para 8,0» reads as the share itself being 8,0. In fact it is a three-year % change.

References: diff.patch:897, built/temas/index.html:1, built/en/themes/index.html:1

**12. The calendar's copied titles and one event read badly.**
- Copied titles:
  - The English area title «Economy and of Territorial Cohesion» is ungrammatical.
  - One link label is a whole sentence with counts: «Portugal falha 4 valores de referência… e cumpre 9.».
- One event: «Reaparecimento de uma página de contas de 2024 em cm-evora.pt» is a watch item, not a publication, under «O que as fontes citadas publicam a seguir».

References: built/agenda/index.html:1, built/en/agenda/index.html:1

**13. The 2026 explainer still talks about the site's own receipts.**
- «…está no recibo de cada um, a um toque.» / «…one tap away.»
- The broad expression cannot catch it, because the sentence has no negation.

References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:594, src/data/explicacoes/dinheiro-do-estado-2026.mjs:599

**14. Several report figures have no evidence in the package.**
- «Régua larga: 13 → 13» has no measurement file. My scan of the 16 package pages finds 7 caught sentences, all listed. The other entries are on pages not in the package.
- «40 plantas do quadro» and «10 chamadas» are unshown.
- `conferir-relatorio.py` exits 1 with four numbers that have no file.

References: RELATORIO-VOZ-1-b.md:5, RELATORIO-pai2-c.md:7, relatorio-construtor.md:11, numeros-do-relatorio.txt:5-13

**15. The menu-reading branch of `calendario-paginas.mjs` never runs on today's data.**
- Only `/uniao-europeia` and `/en/european-union` are both a calendar target and a menu door, and neither has a trailing slash.
- The L1 plant proves the ruler, not the script's slashed branch.

References: scripts/calendario-paginas.mjs:26-29, scripts/calendario-paginas.mjs:34, tests/voz/agenda-voz1.mjs:87-91

**16. Q2 now checks the Portugal-column unit against the declared data instead of the card on the page.**
- So a card and table that disagree are no longer compared directly. They are only compared through the data.

References: scripts/check-quadro.mjs:155

## «What is fine»

- **Diff against copies:** every added line of the diff is present in its copied file, except the `PROPRIA` line in finding 4 (one-line comparison over all 36 files; diff.patch:1).
- **Notices name their measure:** all 38 revision notices in the built pages name the measure in both editions. The EU row adds «na União Europeia» / «in the European Union», and the revised previous-year row carries its year, so the two notices in a card can be told apart (built/estado-e-economia/index.html:1, built/temas/index.html:1).
- **Ledger index:** English entries name the measure without the period, as do two of the three Portuguese entries (built/en/ledger/index.html:1).
- **I2p:** the logic is unchanged; the diff only adds the `aviso-com-periodo` plant (tests/livro/indice.mjs:2314-2324).
- **Quadro plants:** the plants cover a swapped comparison unit, a swapped header, a swapped notice name, and an incompatible unit, URL or age class (tests/quadro/plantas.mjs:20-21, tests/quadro/plantas.mjs:32, tests/quadro/plantas.mjs:54-61).
- **72 comparisons reproduced:** 45 previous-year cells plus 27 EU cells, in 47 rows per edition. Each cell carries its row's card unit, the employment-gap EU cell now reads «9,6 pontos percentuais», and I found no cell with another measure's unit in either edition (built/temas/index.html:1, built/en/themes/index.html:1, RELATORIO-pai2-c.md:4).
- **Reference header:** «Valor de referência» / «Reference value», and each cell still names the Comissão, the Pacto de Estabilidade or the Conselho da UE (src/data/quadro-do-pais.mjs:3-4).
- **Missing dates:** ERSAR (`nao_lida`) reads «data por confirmar na fonte» / «date to be confirmed at the source», and the six `nao_publica` events read «sem data anunciada» / «no announced date» (src/data/calendario.json:1, built/agenda/index.html:1).
- **No past events:** the listed events are only the two windows ending 31.12.2026 and 30.04.2027, plus the undated ones. The seven events dated up to 04.11.2026 are gone for the 05.11.2026 build (src/lib/agenda.mjs:139-142).
- **«Atualiza:» lists:** they show titles with links and no slugs, and the seven entry pages and indexes are excluded (scripts/calendario-paginas.mjs:10).
- **Menus:** `#nav-principal` is identical on all 14 built pages per edition, including `/agenda` and `/en/agenda`, and the calendar's `/uniao-europeia` uses the menu's spelling (built/agenda/index.html:1).
- **L1 and N1 plants:** they flip the slash on a calendar link and on the menu, and require the exact message from each ruler (tests/voz/agenda-voz1.mjs:79-108).
- **44 px targets:** they are in the stylesheet, with no `style` attribute on either agenda page (src/styles/site.css:4355-4362).
- **Agenda:** the research items are gone, and the title and description speak of the calendar only (src/i18n/strings.mjs:484-488, src/i18n/strings.mjs:3386-3390).
- **Corrections register:** no `<code>` or id field remains, and every title equals its receipt's h1 (built/correcoes/index.html:1).
- **Weekly line:** it reads exactly as mandated in both editions, and the builder's one-revision and provenance forms keep the same shape and say nothing false (built/index.html:1, built/en/index.html:1, tests/voz/semana-voz1b.mjs:7-13).
- **`/areas` lede:** it reads as addendum B §4.3 in both editions, and the closed list follows (built/areas/index.html:1, built/en/areas/index.html:1, scripts/voz-ledes.json:3, scripts/voz-ledes.json:8).
- **VOZ-2 exemption:** it now names the study reading and summary, with the date and VOZ-2 (scripts/voz-autorreferencia.mjs:11).
- **Explainer plant:** a sentence of the class on an explainer route is refused (tests/voz/voz1.mjs:39-44).
- **Earlier findings resolved:** the Portuguese Temas page now prints 89,2 for government debt, and the 2027 explainer reads «sem dizer o que entra nela» (built/temas/index.html:1, built/explicacoes/dinheiro-do-estado-2027/index.html:1).
- **Quotations:** the diff adds or changes none. The quoted words on the built pages are earlier source excerpts and register entries, and with no hosted documents in the package they cannot be checked against a source. The PCP quotation appears only in the closed list, and its page is not in the package (scripts/voz-excecoes.json:58).

**Editor's question:** I would not print these pages as they stand. The reasons:
- the Portuguese 2026 explainer still carries the misleading sentence;
- the English Themes notice prints «7.6»;
- the Portuguese ledger index repeats the period;
- the Correções page explains the site's own machinery;
- the register shows identical lines;
- the calendar promises updates to dated editions.

Findings 1–3 contradict `CONFERIR-TUDO.md` on the same head, so they look like defects planted in the package copies. They are reported as found.
