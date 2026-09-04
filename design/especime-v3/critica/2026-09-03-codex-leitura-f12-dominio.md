# Leitura a frio do Codex ao bloco F1.2 (a página do primeiro domínio), 03.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 13:55 a 14:08 UTC, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, o portão das formas a saltar os números desenhados com vírgula decimal, na cópia e no diff, apanhada no Blocking 5 e na primeira linha do Major 6; P2, a planta P1 da própria régua a levar `data-nonledger` e a deixar de provar nada, apanhada no Blocking 5; P3, o relatório a dizer 307/308 na tabela B2 e 308 no comando ao lado, apanhada no Blocking 2; P4, o valor do país desenhado no SVG da barra a dizer 1 567,0 quando a linha diz 1 576,0, apanhada no Blocking 1 (e o leitor notou que a edição inglesa desenha o valor certo). Triagem do lugar de direção: o Blocking 2 é real (a página de concelho tem de mostrar o ganho médio com o valor nacional ao lado e a barra, como o brief pedia); o Blocking 3 é real em parte (os limiares 60, −3 e 5 e o corte legal 150 são factos de fontes e resolvem em linhas quando as linhas existirem, ou ficam como a primeira página já os marca, ditos no relatório; os cortes de escala do mapa são marcas da casa e declaram-se com a razão; o 150 lê-se da sua linha e nunca se duplica); o Blocking 4 é real (os marcadores `[a verificar]` das regiões autónomas de T5 e da meta de T1 ficam visíveis); os Major 6, 7, 9, 10, 11 e 13 são reais e consertam-se na segunda passagem (o portão a validar as razões do `data-nonledger` contra uma lista fechada, a ler todas as datas, a exigir 308 contra a lista dos concelhos, a conciliar as classes do mapa com as linhas, e a régua do alcance a entrar no `verify`; a alternativa em texto de cada SVG com a mesma informação; o relatório a não afirmar que as formas 1 e 2 desenham sem código; a porta comum das rotas novas no rodapé agora e no menu depois do F1.1; a segunda linha de T5 com a sua fonte e as suas datas); o Major 8 é uma emenda à régua do brief (o período de referência escreve-se como a fonte o publica, um ano é um ano; as datas de acesso e de conferência em dd.mm.aaaa); o Major 12 é em parte do pacote (o mapa do sítio e as 308 páginas não foram no pacote); o Minor 14 fica como está por regra da casa (o slug é a chave e não se traduz, como nas regiões e nos distritos; a suposição do brief cede à regra). O texto do leitor fica como veio.*

---

## Blocking

1. **The Portuguese SVG publishes a false value.** Its national bar names `ganho-medio-mensal-2024` but renders `1 567,0`; the row says `1 576,0`, and the English SVG renders the latter correctly. The supplied source always renders the named claim, so the PT artifact is not reproducible from the supplied source. `built/dominio-pt.html:1`, `built/dominio-en.html:1`, `claims/ganho-medio-mensal-2024.yml:9`, `src/components/formas/BarraConcelhoPais.astro:76`

2. **The municipality requirement was not implemented.** Évora contains only its local wage value, with neither the national value nor `barra-concelho-pais`; adding an eighth ordinary measure cannot satisfy the required side-by-side comparison. The report nevertheless calls this complete. Its B2 cell also says `307/308` while its command and the diff say `308/308`. `brief.md:25`, `built/municipio-evora.html:2`, `src/data/concelhos.mjs:217`, `relatorio-construtor.md:43`, `relatorio-construtor.md:52`, `diff.patch:293`

3. **The ledger rule and headline rule are breached.** The distinct visible numbers without their own ledger row and seal are:

   - Thresholds `60`, `−3`, and `5`, rendered as `data-nonledger="limiar-do-quadro"` rather than claims. `built/dominio-pt.html:1`, `src/data/dominios.mjs:268`, `src/data/dominios.mjs:278`, `src/data/dominios.mjs:294`
   - Map cuts `1200`, `1400`, `1600`, `1800`, hardcoded and exempted as scale marks. `built/dominio-pt.html:1`, `src/views/DominioView.astro:193`, `src/views/DominioView.astro:222`
   - The common-header numbers `31.08.2026`, `01.09.2026 21:07`, `4`, and `0`; licence version `4.0`; and identifier `0012661`. They have editorial/proof/technical exemptions, not ledger-row IDs. `built/dominio-pt.html:1`, `src/data/dominios.mjs:458`
   - The corrupted PT `1 567,0`. `built/dominio-pt.html:1`

   Consequently the headline’s measured values are sealed, but its two thresholds are not `<ValorDaProva>`-style sealed values. `src/views/DominioView.astro:128`, `src/views/DominioView.astro:132`, `src/views/DominioView.astro:139`

4. **The required uncertainty markers are hidden, not preserved.** T5’s row says the Azores and Madeira values were not read and remain `[a verificar]`, but the built pages publish neither regions nor marker. T1’s comment says the national target remains `[verify]`, but the renderer exposes nothing about it. `brief.md:23`, `claims/retribuicao-minima-mensal-garantida-continente-2026.yml:40`, `src/data/dominios.mjs:351`, `built/dominio-pt.html:1`

5. **The claimed SVG defect test cannot produce its reported result.** F2 skips every text number containing a comma; P1 plants `1 234,5`, so execution bypasses the only matching error. The packaged ruler additionally inserts `data-nonledger=""`, whereas the diff does not. The report’s “red ✓” is therefore not proved by either supplied version. `scripts/check-formas.mjs:228`, `scripts/check-formas.mjs:233`, `tests/dominio/pagina.mjs:132`, `diff.patch:4520`, `relatorio-construtor.md:224`

## Major

6. **The gate can pass the requested broken cases.**

   | Broken case | Result | Evidence |
   |---|---|---|
   | SVG number without a row | Passes when it contains a comma or carries any `data-nonledger`; F2 does not validate the reason. | `scripts/check-formas.mjs:228`, `scripts/check-formas.mjs:229` |
   | ISO date | A required marked date fails, but an ISO date elsewhere passes because the HTML gate removes ISO dates before scanning. | `scripts/check-formas.mjs:177`, `scripts/check-formas.mjs:194`, `scripts/gate-html.mjs:2706`, `scripts/gate-html.mjs:2768` |
   | Duplicated boundary | Correctly fails. | `scripts/check-formas.mjs:249` |
   | Unreachable row | Passes: F6 checks direct IDs and merely that the ledger-index door exists. The real reachability script is not in `build` or `verify`. | `scripts/check-formas.mjs:307`, `scripts/check-formas.mjs:395`, `package.json:12`, `package.json:35` |
   | T4a value | An obvious `data-claim` fails, but a number disguised with a valid `data-nonledger` is removed before inspection. | `scripts/check-formas.mjs:281`, `scripts/check-formas.mjs:292`, `scripts/gate-html.mjs:7300` |
   | 307 municipality pages in each language | Passes because PT’s discovered count becomes the expected total; no comparison with 308 exists. | `scripts/check-formas.mjs:369`, `scripts/check-formas.mjs:372` |
   | Missing-value municipality painted as a class | Passes: rendered `<use>` elements do not carry claim IDs and the gate never reconciles classes with rows. | `src/components/formas/MapaPorConcelho.astro:99`, `scripts/check-formas.mjs:395` |

   P4 changes a label on Évora; it does not make a ledger row unreachable. P5 tests only the obvious `data-claim` case. `tests/dominio/pagina.mjs:160`, `tests/dominio/pagina.mjs:168`

7. **None of the three drawn SVGs has an equivalent text alternative.** Each accessible name is only the measure name. The bar’s external legend omits both values; each map offers a navigation link rather than a municipality-by-municipality textual equivalent. The ruler merely checks that some accessible name exists. `src/components/formas/BarraConcelhoPais.astro:52`, `src/components/formas/BarraConcelhoPais.astro:87`, `src/components/formas/MapaPorConcelho.astro:80`, `src/components/formas/MapaPorConcelho.astro:130`, `tests/dominio/medidas.mjs:253`

8. **The report counts 60 date markers correctly but misstates their format.** Twenty are bare reference years, one per reading per edition; only forty are `dd.mm.aaaa`. The code deliberately leaves year-only periods unchanged, contradicting the acceptance wording. `relatorio-construtor.md:55`, `src/lib/dominios.mjs:93`, `built/dominio-pt.html:1`, `built/dominio-en.html:1`

9. **Forms 1 and 2 are not wired and are not safe future implementations.** `formaDaMedida()` supports only maps, so new periods or EU rows will not “draw without a code change” as reported. The series has no break detection, and `entre27()` checks only a count of 27, not unique EU-member identities or completeness of the published set. `relatorio-construtor.md:21`, `src/lib/dominios.mjs:204`, `src/lib/dominios.mjs:235`, `src/lib/dominios.mjs:243`, `src/lib/dominios.mjs:373`

10. **Numeric geometry is computed in page code.** Bar widths are ratios `(value / maximum)`, and map classes are computed against cuts. More seriously, E5’s legal cut `150` is duplicated as a literal instead of read from its row, so the displayed claim and colours can diverge. No difference, rank, or average is printed, but the ratio and classifications are computed. `src/lib/dominios.mjs:272`, `src/lib/dominios.mjs:277`, `src/lib/dominios.mjs:346`, `src/views/DominioView.astro:199`, `claims/indice-de-divida-limite-legal.yml:9`

11. **The index and discoverability requirements fail.** “Trabalho” is a second linked entry, so the other seventeen are not linkless as specified. Separately, the report admits that no existing site page links to either new route family through common navigation. `brief.md:51`, `src/views/DominiosView.astro:64`, `built/dominios-index-pt.html:1`, `relatorio-construtor.md:312`

12. **The package cannot substantiate the sitemap, 314-row reachability, or 308-page count.** It contains neither sitemap nor full build/ledger/pages; these facts exist only as report assertions and non-gating scripts. The charter needed to trace the boundary sentence is also absent, so the report’s paraphrased attribution is not auditable. `relatorio-construtor.md:51`, `relatorio-construtor.md:53`, `tests/dominio/alcance.mjs:8`, `relatorio-construtor.md:187`

13. **T5’s secondary value loses its own source and dates.** The model calculates dates for the Eurostat row, but the view ignores them and prints only the primary Diário da República row’s dates and source underneath both values. `src/lib/dominios.mjs:392`, `src/views/DominioView.astro:374`, `src/views/DominioView.astro:389`, `src/views/DominioView.astro:401`, `claims/retribuicao-minima-mensal-doze-meses-2026.yml:18`, `claims/retribuicao-minima-mensal-garantida-continente-2026.yml:13`

## Minor

14. **The English slug remains Portuguese.** This was disclosed and the brief called the translated slug an assumption, but it leaves a deferred routing decision and future redirects. `brief.md:11`, `src/lib/routes.mjs:171`, `relatorio-construtor.md:257`

## What is fine

- The two built domain pages contain ten readings, one T4a absence, three drawings each, and thirty date markers each; the report’s six-drawing and sixty-marker counts agree. `built/dominio-pt.html:1`, `built/dominio-en.html:1`, `relatorio-construtor.md:250`
- No series or EU-27 strip is currently drawn. Both maps contain 308 municipality uses; Penedono’s missing debt value is patterned as `sem-valor`, and the wage map uses neutral greys. `built/dominio-pt.html:1`, `src/styles/dominio.css:248`, `src/styles/dominio.css:273`
- T4a is visibly stated as an absence, with the searched source and reason, and has no claim value. The boundary appears once with `id="fronteira"`. `built/dominio-pt.html:1`, `src/views/DominioView.astro:315`, `src/views/DominioView.astro:470`
- Canonical and reciprocal `pt-PT`/`en`/`x-default` hreflang are correct on the four provided pages, with no `noindex`. `built/dominio-pt.html:1`, `built/dominio-en.html:1`, `built/dominios-index-pt.html:1`, `built/dominios-index-en.html:1`
- The headline prints no subtraction or editorial adjective; its remaining failure is the unsealed thresholds. `src/views/DominioView.astro:125`
- Diff reconciliation found two copy mismatches only: the report count and P1 line identified above; the remaining supplied source copies match their patch result. `relatorio-construtor.md:52`, `diff.patch:293`, `tests/dominio/pagina.mjs:132`, `diff.patch:4520`

**14 distinct findings.**