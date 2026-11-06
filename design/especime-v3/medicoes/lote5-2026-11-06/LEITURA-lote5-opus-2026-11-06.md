# A leitura a frio do lote 5 (AT1, MET1, EV3-p), 06.11.2026

Leitor: Claude Opus 5.5 (`leitor`, `xhigh`), sobre `pacote-lote5-2026-11-06` (base a3fe1863e, cabeça cf1fbabf5), de 11:08 a 11:21 UTC; 63 chamadas de ferramentas pela contagem do harness (o leitor disse 49; o orçamento era 50), 236 061 símbolos.

## As plantas (registadas por sha256 fora do pacote)

| planta | ficheiro | o estrago | sha256 antes → depois | apanhada |
|---|---|---|---|---|
| L5-P1 | `scripts/leituras/aterrar.py` | a aterragem pelo caminho novo deixa de correr o verify:deploy depois de promover | 91f0868090f1 → 0b698d958610 | achado 3 (Blocking) |
| L5-P2 | `tests/indice/indice.mjs` | a I7 aceita qualquer âncora não vazia, exista ou não no Método construído | d80ee41b07a8 → ffc0f9f9fc1e | achado 4 (Major) |
| L5-P3 | `built/metodo/index.html` | a frase da marca fonte no Método diz página em vez de recibo (§2 do mandato) | 6e015994230a → 2ba468064c55 | achado 5 (Major) |
| L5-P4 | `built/en/about/index.html` | uma frase do financiador movida para o Sobre inglês deixa de estar palavra por palavra (almost) | 856ee1e3fef6 → 441f2c5e6bf0 | achado 2 (Blocking) |
| L5-P5 | `built/en/studies/evora-2027-capital-europeia-da-cultura/index.html` | a frase corrigida do Rossio volta a contar dois financiamentos (o texto que a EV3-p corrige) | b0f7c1317d13 → b07a5ad2d52e | achado 1 (Blocking) |

**Cinco em cinco.**

## Os achados reais e o que este lugar fez a cada um (conferido no `dist/` de cf1fbabf5 e no motor)

- **6 (Major, real):** o campo «onde está no documento» do recibo de exemplo do Método imprime `document.edition` e a data da referência; a página do recibo imprime nesse campo o `document.locator`. Na adenda D da MET1.
- **7 (Major, do pacote, não do sítio):** os dois corpos das notas da Câmara chegaram ao pacote por um guião deste lugar sem os recibos do pedido; os dois `.pedido.json` existem no motor, comitados, com o sha256 igual ao do corpo; o estudo não tem pasta `direitos/`. Nada chega ao leitor; a linha «O pacote não conhece os livros dos estudos» dos gargalos fica com este caso.
- **8 (Minor):** números dos relatórios do construtor sem prova no pacote; para a higiene.
- **9 (Minor):** este lugar conferiu `git show --stat cf1fbabf5`: cinco ficheiros, dois de medição e três réguas (`tests/indice/indice.mjs`, `tests/incorporar/conferir.mjs`, `scripts/incorporar-do-portao.mjs`); nada que uma página imprima.
- **10 (Minor pelo leitor, real e deste lugar):** a frase do passo 6 («A cada construção correm 62 conferências automáticas sobre todas as páginas») é do mandato deste lugar e não é exata: a lista de 62 corre antes de cada aterragem, um `build` corre 29 passos, e algumas das 62 não conferem páginas. Reescrita na adenda D da MET1.
- **11 (Minor, real):** o nome do recibo de exemplo escrito à mão em vez do título do recibo («Salário mínimo mensal (continente)»); na adenda D.
- **12 (Minor):** as páginas atuais de Évora 2027 só ligam à edição de 01.10, e a de 03.11 só se alcança pelo registo; o cabeçalho diz «atualizado a 06.11.2026» para uma correção. Uma navegação nova para estudos com mais de uma edição guardada; para a fila (ED2).
- **13 (Minor):** «A recontagem não é uma correção adicional.» em dez linhas da contagem, nove já no ar; uma classe, para a VOZ-2 ou a higiene, nunca linha a linha.
- **14 a 19 (Minor):** o envio preso à cabeça e não ao inventário do `dist/` do GitHub; a planta da parte com U falso; os dois comentários perdidos no `portao.yml`; o `IDENTIDADE.md` (as duas frases acrescentadas conservam as regras das citações retiradas; aceite); o Gemini fora da régua dos nomes de modelo; a citação portuguesa sem `lang` nas páginas inglesas do estudo (anterior ao bloco). Para a higiene.
- `tests/metodo/construido.mjs` não está em nenhum guião do `verify`: o GitHub não o corre. Para a higiene.

## O relato do leitor, como veio

Cold read of batch 5 (AT1, MET1, EV3-p). Reader: Claude Opus 5.5. Only the package was read; 49 tool calls (the reader's count). Found all five copy-level discrepancies the plants would produce (findings 1 to 5) plus non-plant defects (6 onward).

Package completeness: `motor/CORPOS-ALOJADOS.md` lists two site rows, both without `source_sha256`; `motor/CORPOS-DO-ESTUDO.md` lists the two Câmara notices, both hashes match (5467684e4858… `concurso-rossio.html`, 15cec74b414b… `23.html`); no `SEM-CORPOS-ALOJADOS.md`. Diff check on 188 files: 186 match hunk for hunk, 2 do not (findings 3, 4).

## Blocking

1. The English study page still counts two financings, in words found in no source file: built/en/studies/evora-2027-capital-europeia-da-cultura/index.html «…and neither says how the two financings relate.»; the brief, the English document page, studies-src en.html, the en record and the engine HTML say «…and neither mentions the funding the other names.» (brief-EV3-p.md:17; studies-src/…/en.html:95; built/en/studies/…/document/index.html:116)
2. The English About changes the funder's sentence on money: «…with no advertising and almost no money from institutions.»; source and approved list: «…with no advertising and no money from institutions.» (src/data/sobre.mjs:88; scripts/sobre-limites-aprovados.json:8; brief-MET1.md:64)
3. The copied `aterrar.py` promotes in the new flow without `verify:deploy` (`if not self.novo_fluxo: self.correr('verify-deploy', …)`); the diff runs it unconditionally after the promote; the test expects `…'vercel-promover','verify-deploy'`. (scripts/leituras/aterrar.py:483–489; diff.patch:99709; tests/leituras/at1_aterrar.py:48)

## Major

4. The copied I7 accepts any non-empty anchor (`!!id || …` where the diff has `&&`); the `ancora` plant would not bite (41 of 42). (tests/indice/indice.mjs:228; diff.patch:102718; ADENDA-C-MET1.md:16)
5. The Portuguese Método prints «fonte: abre a página do número.»; brief, src/data/metodo.mjs and scripts/metodo-aprovado.json say «fonte: abre o recibo do número.». (built/metodo/index.html:2; brief-MET1.md:46; src/data/metodo.mjs:143; scripts/metodo-aprovado.json:141)
6. «onde está no documento» shows the Diário da República issue (`document.edition` and `reference_date`), not the row's `document.locator`, which its own ledger page prints as «Onde no documento: artigo 3.º (o valor) e artigo 2.º, «Âmbito territorial» (…), p. 2»; the gate's `CAMPOS` fixes `document.edition`. Both editions. (src/views/MetodoView.astro:36; scripts/metodo-do-portao.mjs:36; scripts/metodo-aprovado.json:208; ADENDA-B-MET1.md:17)
7. The two hosted Câmara notices arrive without a request receipt or a `direitos/` folder, and the brief does not say why. (motor/CORPOS-DO-ESTUDO.md:7–8; PROMPT-COMUM.md:7)

## Minor

8. Builder-report numbers not reproducible: «28 da construção» (29 on `&&`), «334 a 338 segundos» (333 to 334), «25 098 ficheiros», «26 de 27», «42 de 42», «184/182 linhas» without evidence; numeros-do-relatorio.txt 0 of 10, exit 1.
9. Cannot prove from the package that the «MET1 C» commits touch only rulers and plants (one cumulative diff); the builder's report names three ruler files.
10. Step 6 «A cada construção correm 62 conferências… sobre todas as páginas» is looser than what the count measures: the token counts 61 `verify` steps plus `typecheck`; several are not page checks; a local build runs 29 steps; the full run says 63 with the build. The token equals the list `conferir-tudo.sh` reads.
11. The example receipt's name is written by hand («Retribuição mínima mensal garantida no continente»), not the row's label («Salário mínimo mensal (continente)»); addendum B asks «tudo lido do livro-razão».
12. The study header calls the correction an update («atualizado a 06.11.2026»); the Método defines «Estudo atualizado» as «ganhou documentos novos»; the current pages link only to the 01.10 edition, the 03.11 edition is one tap away only from the register.
13. The register's count row adds «A recontagem não é uma correção adicional.» / «The recount is not an additional correction.», a sentence the mandate did not write; an older pattern.
14. The deploy is tied to the head but not to the `dist/` the GitHub run checked (`at1-build.json` never compared).
15. No plant covers a part whose proof has U false.
16. `portao.yml` lost the comment on the required status context `portao` and the `# v7.0.1` tag beside the pinned upload-artifact SHA.
17. `IDENTIDADE.md` drops the explanation of the tie between the two texts and adds «A forma das correções conserva-se como definida nesta secção.» and «A origem incompleta conserva o selo a tracejado.»; no rule changes.
18. The model-name ruler omits «Gemini».
19. The Portuguese quotation on the English study pages carries no `lang="pt-PT"` (predates the block).

## What is fine

Hosted notices (bodies: the tender notice PRR once, Fundo Ambiental zero; the October notice «financiada a 100% pelo Fundo Ambiental», PRR only in menus; §1 true). Rossio sentence exact in the Portuguese study, the Portuguese document and the English document; the token resolves to the row's words, attributed to the Câmara. Editions: the kept 03.11 files equal the pre-correction text byte for byte (3547e5fd2933…, 81e1c0d262cd…); current 3e98c947…, 88fb2865…; current edition dated 06.11.2026. Register entry «Estudo corrigido» / «Study corrected» with §2's text, doors to both editions, count 45 → 46. Método: four sections, one h1, no lede; English step 4 and marks as written; `marcas` anchor in both editions; 308 redirects to `#marcas`. The drawn path readable without JavaScript (plain `<p>`, SVG `aria-hidden`), motion stops under `prefers-reduced-motion: reduce`. Receipt language and values match the ledger page. Sobre (pt): the five sentences word for word; nothing else changes but the door's label. AT1: `vercel-prebuilt.py` refusals each planted; `github()` waits on `headSha == cabeca` and `conclusion == success` before merge and promote, a red run promotes nothing (planted); the parts cover exactly the 38 `verify` steps outside `build:conteudo` (23 overlap, 61 total), `typecheck` in the build job; the lock covers build, full run, gates, `vercel-prebuilt` and the landing; the voz exemption needs exactly one `Página: metodo|sobre` (planted). The `check:incorporar` plant reads `LINHA_DO_EXEMPLO_METODO` in both editions. Quotations: ev3-rossio-prr pass; ev3-rossio-nao-concluida pass; the minimum wage excerpt pass against the ledger page.

Question 7: the count row's «A recontagem não é uma correção adicional.» talks about the site (finding 13); the Sobre's five «não…» sentences are the funder's own, moved on purpose; no apology found.

Editor's question: would not print the English Évora study (1), the English About (2), the Portuguese Método (5 and 6); would print the Portuguese study, both 03.11 editions and both corrections pages.

Left undone for the budget: the plants and gates not run; `divida` = 6 not recounted; the English wording of the five moved sentences not traced to `POLITICA.recusas`.

## O que o leitor deixou por fazer, feito por este lugar

As frases do Sobre, nas duas edições, conferidas por guião contra as fontes de `main` (a3fe1863e), com as cadeias concatenadas juntas: as sete frases com mais de cinquenta caracteres estão palavra por palavra em `src/data/sobre.mjs`, `src/data/metodo.mjs` e `src/data/politica-ia.mjs` (a frase dos dados pessoais incluída, nas duas línguas); a de abertura é a que já está no ar no Sobre.
