# Leitura a frio do Codex à fatia `dominios-css-2026-09-15` (a folha da lista dos domínios, o espaço, «incluído em», o campo da busca, as duas células novas), 15.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado em `ler.sh`, lido no registo de eventos), 08:55:52 a 09:10:22 UTC de 15.09.2026, 161 702 símbolos, sobre um pacote montado por `pacote.sh` de dentro da worktree (base `44f0d838`, cabeça `f6d87f28`: o brief da fatia escrito pelo lugar de direção, o relatório do construtor, o diff de 1 673 linhas, os 14 ficheiros mudados, seis páginas construídas da cabeça nas duas edições e as quatro de antes lidas do sítio no ar). **Três plantas de três classes, 3 de 3 vistas** (o registo no `.plantas.json` ao lado): F1, a quarentena da célula C1 a isentar por prefixo qualquer classe «dominios-*» (o achado 2, Blocking); F2, a página portuguesa construída sem o espaço entre «Trabalho» e o estado (o achado 1, Blocking); F3, «incluido em» sem acento no ficheiro das cadeias (o achado 3, Major). O achado 4 (as medições e as contagens sem prova no pacote) é do pacote, que não levava as capturas nem as saídas em JSON da régua, e vale como lição para os pacotes das fatias: as saídas medidas entram. **Os reais:** o 5 (a régua da largura do campo só nas rotas portuguesas), o 7 (um positivo conhecido da C2 que nunca chega a ser candidato, e a isenção de `<abbr>` sem prova), o 8 (a régua de medição a aceitar um 404 e elementos em falta em silêncio), o 9 (57 e não 58 px na prosa do relatório, a diferença entre as edições apagada) e o 10 (o comentário de `DominiosView` a descrever a lista antiga). O achado 6 é uma limitação verdadeira da célula C2 tal como está (aceita qualquer declaração de espaço num antepassado sem resolver a cascata, e por isso pode esconder uma colagem verdadeira, como o «Populaçãoprimeiro» que a C1 apanhou por outra via): fica escrita na célula e no relatório, e a forma honesta de a fechar é uma célula rendida, que meça no navegador a distância entre caixas de texto vizinhas, na fatia `css-alcance-2026-09-16`.*

*Triagem do lugar de direção, pela delegação (§1.98): os achados 5, 7, 8, 9 e 10 fecham-se na mesma worktree antes de aterrar; a limitação do 6 escreve-se e passa à fatia seguinte; a fatia aterra com o «sim» do diretor dado sobre as capturas. Os «what is fine» 11 a 15 confirmam o componente, a folha, as duas páginas inglesas e o índice, o campo da busca e a conta da quarentena.*

---

## Blocking

1. **The Portuguese front page still emits `Trabalhoincluído em` without an HTML space, so the primary no-stylesheet defect remains public.** Its second item contains `</a><span>`, while the Portuguese domains page and both English pages contain `</a> <span>`. This contradicts the report’s claimed `/` text content and the component source’s explicit space; without CSS, the words visibly join.  
built/index.html:2, built/dominios/index.html:2, built/en/index.html:2, src/components/DominiosLista.astro:106, relatorio-construtor.md:25

2. **The copied C1 gate quarantines every `dominios-*` class on any recognised route, so it cannot turn red on the base defect it claims to prove.** The target classes are `dominios-lista`, `dominios-item`, and `dominios-estado`, all swallowed by `c.startsWith('dominios-')` before an error is recorded. The known-positive uses `regra-que-nao-chega` and disables route matching, so it never exercises this bypass. Consequently, the reported eight base C1 reds are impossible with the copied script; the diff contains the narrower condition that would produce them.  
scripts/check-css.mjs:502, scripts/check-css.mjs:504, scripts/check-css.mjs:622, scripts/check-css.mjs:670, relatorio-construtor.md:93, diff.patch:769

## Major

3. **A fresh build from the copied source would publish the misspelled and unregistered Portuguese string `incluido em`.** The diff specifies `incluído em`, the inventory registers that accented form, and the supplied built pages also contain it. The copied strings file instead lacks the accent, proving that the built pages, diff, and copied source do not represent the same head. This also leaves the source’s new visible string absent from the inventory.  
src/i18n/strings.mjs:1362, diff.patch:1235, design/especime-v3/INVENTARIO-FRASES.md:243, built/dominios/index.html:2, relatorio-construtor.md:130

4. **The browser measurements and whole-site gate counts are unshown claims, not reproducible measurements from this package.** The report gives page heights, element widths, 7,224-page gate totals, and a capture location, but the package contains neither those captures nor JSON or command-output records. The measuring script writes evidence only when `--json` is supplied, and no resulting file is present. The sample built pages also reference compiled stylesheets absent from the package, so the claimed computed dimensions cannot be recreated from them.  
relatorio-construtor.md:3, relatorio-construtor.md:33, relatorio-construtor.md:87, relatorio-construtor.md:91, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:187, built/index.html:1

5. **The search-width acceptance measure was not run against either English route.** The ruler’s route list contains only Portuguese URLs, despite the requirement to establish the result in both editions at 320, 390, 768, and 1,280 pixels. The report’s table likewise contains no `/en/` or `/en/municipalities` row, so English overflow and field width remain unproven.  
brief.md:24, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:147, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:150, relatorio-construtor.md:50, relatorio-construtor.md:81

6. **C2’s CSS heuristic suppresses genuine glued HTML whenever unrelated or ineffective spacing declarations exist.** It climbs from the immediate container to the document root and accepts any ancestor `gap`, `grid-template-columns`, or `content`; it also accepts broad margin, padding, display, position, and float declarations without resolving selectors, media conditions, direction, or the cascade. A gap separates only direct flex or grid children, so a declaration on a remote ancestor proves nothing about the tested boundary. The report itself admits that this logic misses the genuine `Populaçãoprimeiro` collision, and the remaining `Trabalhoincluído` collision is similarly hidden by `.dominios-item`’s gap.  
scripts/check-css.mjs:283, scripts/check-css.mjs:310, scripts/check-css.mjs:556, scripts/check-css.mjs:566, relatorio-construtor.md:159, built/index.html:1

7. **C2’s known-positive is partly vacuous and leaves its broad abbreviation exception untested.** The scanner requires both adjacent nodes to be elements, but the planted `texto<strong>…</strong>` case begins with a text node and is therefore never a candidate. Nevertheless, the success message claims the test proved that inline marks are not reported. Separately, any boundary touching an `<abbr>` is exempted, so a real `</abbr><span>` collision passes, and no abbreviation case is planted or asserted.  
scripts/check-css.mjs:331, scripts/check-css.mjs:342, scripts/check-css.mjs:528, scripts/check-css.mjs:532, scripts/check-css.mjs:655, scripts/check-css.mjs:703

8. **The browser ruler silently accepts missing routes and missing measured elements.** Its server returns a normal 404 response, while `page.goto` never checks the response status. Every selector helper then returns `null`, and the script prints those nulls without an assertion or failure. This is material here because the included built sample lacks both `/livro-razao` routes that the ruler requests.  
design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:73, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:76, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:150, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:155, design/especime-v3/medicoes/dominios-css-2026-09-15.mjs:157

## Minor

9. **The reported 390-pixel English home-page growth is 57 pixels, not the stated 58.** Its own table gives 2,701 before and 2,758 after. The following prose applies the Portuguese 58-pixel delta to “the front page” without preserving that edition difference.  
relatorio-construtor.md:35, relatorio-construtor.md:36, relatorio-construtor.md:42

10. **`DominiosView` still documents an eighteen-domain list with no counts although it now renders a component that filters the domains and prints measure counts.** The stale description says all eighteen names and states are listed and expressly rejects counts. The component instead filters to domains with pages or inclusion targets and emits `medidas` whenever the count is positive.  
src/views/DominiosView.astro:6, src/views/DominiosView.astro:37, src/components/DominiosLista.astro:75, src/components/DominiosLista.astro:90, src/components/DominiosLista.astro:108

## «What is fine»

11. **The shared component source imports its own stylesheet and contains the intended explicit text-space between the name and state.** src/components/DominiosLista.astro:68, src/components/DominiosLista.astro:106

12. **The component stylesheet contains the mandated hidden numbering, flex layout, 14-pixel column gap, and 14-pixel instrument-font state.** src/styles/dominios-lista.css:25, src/styles/dominios-lista.css:31, src/styles/dominios-lista.css:35, src/styles/dominios-lista.css:51

13. **The English front page and both domains-index artifacts render the replacement wording with an explicit HTML space.** built/en/index.html:2, built/dominios/index.html:2, built/en/domains/index.html:2

14. **The search source uses `size="24"` in both variants and supplies the intended stretch, maximum width, flex growth, and zero minimum width declarations.** src/components/inicio/CampoDeBusca.astro:102, src/components/inicio/CampoDeBusca.astro:126, src/styles/site.css:5144, src/styles/site.css:5158, src/styles/site.css:5161

15. **The quarantine arithmetic is internally consistent: 616×8 + 58×3 + 2×1 equals the reported 5,104 cases.** relatorio-construtor.md:147, relatorio-construtor.md:148, relatorio-construtor.md:149, scripts/check-css.mjs:359, scripts/check-css.mjs:364, scripts/check-css.mjs:367