# Leitura a frio do Codex ao bloco F1.1c (a leitura só ao toque), 07.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 16:12 a 16:35 UTC de 07.09.2026, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, o `hashchange` sem `repoeDensidade()` no guião e no diff, apanhada no Major 3; P2, a célula J13 a aceitar um nome à vista depois de voltar atrás, apanhada no Major 4, com a diferença entre a cópia e o diff dita; P3, a tabela das alturas com 3600 px na primeira linha, apanhada no Major 8; P4, a linha do estado vazio sem `hidden` na página portuguesa construída, apanhada no Blocking 1. Triagem do lugar de direção (pela delegação de 04.09, §1.98): o Blocking 2 é real e é uma decisão: os três cartões das medidas do domínio (a dívida pública, a taxa de emprego, a taxa de desemprego) ainda levam à página do domínio em vez de abrirem a sua leitura, como o F1.2b os pôs; com a decisão (7) da §1.99 (as leituras dos três são inteiras na primeira página e acrescentam a porta «Ver no domínio →») e com o mandato deste bloco (um toque num cartão abre a leitura daquele cartão), os 21 cartões passam a fazer o mesmo, e a porta para o domínio fica na leitura e na secção dos domínios; a régua que aceitava a exceção muda com a decisão citada. O Major 4 tem uma parte real além da planta: depois do Enter a célula não confere que a linha do estado vazio desapareceu. O Major 5 é real: as duas plantas só mordem as células portuguesas, e as inglesas ficam por provar. O Major 6 é real: a J3 imprime se `#m-<id>` abre a leitura sem guião e não o exige; passa a exigir o que cada motor faz, medido primeiro e depois preso, e o relatório di-lo. O Major 7 é real: a célula da ordem do teclado da matriz mede o primeiro paragem da área (o comando da densidade) e não exercita o `<summary>` de uma leitura aberta; ganha o caso com uma leitura aberta. O Major 9 é real na parte que é da casa: a régua das alturas e o guião das capturas viviam fora do repositório (`.claude/`), e passam para dentro, com as medidas guardadas em `medicoes/` como os outros blocos fazem; o resto (os códigos de saída, a corrida do portão) está nos registos do GitHub, corrida 33862236507 verde. O Major 10 é do pacote (os ficheiros dos dados não foram enviados). O Minor 11 é real: o relatório diz catorze réguas e lista treze, e diz duas células da matriz onde são três. O Major 3 e o Major 8 são as plantas. O que é real entra na segunda passagem do ramo `toque-2026-09-04`. O texto do leitor fica como veio.*

---

## Blocking

1. **The Portuguese built page exposes the tap-only instruction without JavaScript, so the fallback lies and is not the output of the supplied template.** The Portuguese output renders the paragraph without `hidden`; the English output retains it. The source applies `hidden` unconditionally in both editions, and the inventory explicitly says the server supplies it hidden. A no-script Portuguese reader therefore sees the instruction together with all 21 closed readings, and the added visible line also disproves the claimed pixel-identical fallback. J14 would fail this packaged page in both engines, contradicting the reported 26 of 26 result.  
built/index.html:1, built/en/index.html:1, src/views/HomeView.astro:875, design/especime-v3/INVENTARIO-FRASES.md:2192, tests/inicio/leitura.mjs:989, relatorio-construtor.md:234

2. **Three of the 21 front-page cards navigate to a domain page instead of revealing that card’s reading, violating the block’s central interaction.** In both editions the cards for public debt, employment rate and unemployment rate have domain-page destinations rather than `#m-<id>` destinations. The existing ruler explicitly accepts three such cards, while J13 selects only a card whose link begins with `#`, silently avoiding them. The brief promises the touched card’s reading without declaring any exception.  
brief.md:7, brief.md:16, built/index.html:1, built/en/index.html:1, tests/inicio/leitura.mjs:783, tests/inicio/leitura.mjs:896, relatorio-construtor.md:258

## Major

3. **The `hashchange` branch does not restore density at all, despite the code comments and report saying that it does.** `repoeDensidade()` is defined to alter every reading’s `open` state but is never called. For a non-reading fragment, the handler merely calls `actualizaVazio()`, which changes only the instruction’s `hidden` state and cannot close one reading or reopen 21. The separate `popstate` listener may apply query state during a history traversal, but it does not repair ordinary hash changes or substantiate the claimed `hashchange` mechanism.  
public/js/inicio.js:733, public/js/inicio.js:826, public/js/inicio.js:837, public/js/inicio.js:889, public/js/inicio.js:892, relatorio-construtor.md:158

4. **The copied J13 differs from the patch and is weaker than both the brief and its own description.** The patch rejects every non-zero visible-name count after Back, but the copied head rejects only counts greater than one. It therefore accepts exactly one visible name after Back when the empty-state line is also visible. After Enter it checks the name and hash but never checks that the empty-state line disappeared.  
diff.patch:768, tests/inicio/leitura.mjs:947, tests/inicio/leitura.mjs:950, tests/inicio/leitura.mjs:953, tests/inicio/leitura.mjs:959, brief.md:16

5. **Neither new plant demonstrates that the English J13 cells bite.** Both plants name only the Portuguese Chromium and WebKit cells and explicitly return the English HTML unchanged. The harness declares success from the named cells alone, so both plants can pass while every English cell remains green because no English defect was planted.  
tests/inicio/leitura.mjs:1073, tests/inicio/leitura.mjs:1074, tests/inicio/leitura.mjs:1082, tests/inicio/leitura.mjs:1088, tests/inicio/leitura.mjs:1089, tests/inicio/leitura.mjs:1094

6. **The no-script fragment cell records whether `#m-<id>` opens the target but deliberately omits that result from its pass condition.** J3 requires only that the target exists; `semGuiao.aberto` is printed but never tested. It therefore remains green if either engine leaves the target closed, even though the brief and report say the fragment continues to open the correct reading. The IDs in static HTML prove addressability, not native opening behaviour.  
brief.md:8, tests/inicio/leitura.mjs:741, tests/inicio/leitura.mjs:744, tests/inicio/leitura.mjs:758, tests/inicio/leitura.mjs:764, tests/inicio/leitura.mjs:770, relatorio-construtor.md:61

7. **The rewritten matrix keyboard-order cell no longer measures the reading controls’ position.** `marco('[data-area-leitura]')` returns the first focusable descendant of the entire section, which is one of the density buttons rendered before the readings. The cell can consequently pass even if an opened reading’s `<summary>` occurs after the following doors. The report’s statement that the summary enters the measured order after opening is not exercised by this cell.  
tests/inicio/matriz.mjs:242, tests/inicio/matriz.mjs:245, tests/inicio/matriz.mjs:264, src/views/HomeView.astro:841, src/views/HomeView.astro:845, relatorio-construtor.md:266

8. **The Portuguese Chromium height row is arithmetically wrong and contradicts three other figures in the report.** A change from 4638 to 3600 is −1038, not −938. The summary, A2 paragraph and J6 arithmetic all imply 3700, and the report version added by the patch also says 3700. The reported height table is therefore not internally reproducible.  
relatorio-construtor.md:41, relatorio-construtor.md:73, relatorio-construtor.md:83, relatorio-construtor.md:85, diff.patch:97

9. **The report’s runtime, pass and provenance claims are unsupported by evidence contained in this package.** Its height ruler and capture program are stated to live outside the repository, and no measurement output accompanies them. The 818-phrase result, ruler totals, plant outcomes and three exit codes are reported only as conclusions; the test can write JSON when requested, but no such artifact is supplied. The commit, push and CI-run status likewise cannot be reproduced from this patch.  
relatorio-construtor.md:14, relatorio-construtor.md:26, relatorio-construtor.md:35, relatorio-construtor.md:178, relatorio-construtor.md:224, relatorio-construtor.md:293, tests/inicio/leitura.mjs:1183

10. **The package cannot prove that the rendered measure values, thresholds and dates agree with their declared data.** The view obtains them from `figuras.mjs`, `dominios.mjs` and the ledger library, none of which is included here. The built HTML supplies only the resulting assertions, leaving no independent source against which the house rule on measured numbers can be checked.  
src/views/HomeView.astro:52, src/views/HomeView.astro:59, src/views/HomeView.astro:64, src/views/HomeView.astro:187, src/views/HomeView.astro:201, tests/inicio/leitura.mjs:328, built/index.html:1

## Minor

11. **The report contradicts itself about both the number of rulers and the number of rewritten matrix cells.** It says fourteen rulers ran, but its table contains thirteen and expressly excludes `capturas.mjs` as a ruler. It first says the matrix changed in two cells, then describes three; the patch contains three distinct matrix hunks.  
relatorio-construtor.md:22, relatorio-construtor.md:200, relatorio-construtor.md:224, relatorio-construtor.md:225, relatorio-construtor.md:230, relatorio-construtor.md:242, relatorio-construtor.md:250, diff.patch:862, diff.patch:881, diff.patch:917

## «What is fine»

12. **The copied startup code opens the fragment target, then applies `data-toque`, and only then repeats the scroll.** public/js/inicio.js:899, public/js/inicio.js:907, public/js/inicio.js:916

13. **The 21 `<details>` blocks themselves remain closed, uniquely identified and byte-identical before and after in each edition.** built/index.html:1, built/en/index.html:1, antes/index.html:1, antes/en/index.html:1

14. **Both new translations are declared in the strings file, entered in the phrase inventory and registered for review.** src/i18n/strings.mjs:686, src/i18n/strings.mjs:2163, design/especime-v3/INVENTARIO-FRASES.md:2199, design/especime-v3/INVENTARIO-FRASES.md:2200, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:60

15. **The copied source correctly scopes hiding of closed readings to the script-written `data-toque="sim"` marker, so that CSS rule alone does not damage the no-script fallback.** src/styles/inicio.css:3150, public/js/inicio.js:907, src/views/HomeView.astro:789