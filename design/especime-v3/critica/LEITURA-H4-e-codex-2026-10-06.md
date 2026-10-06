# A leitura da passagem H4-e pelo Codex `gpt-6-astra` (raciocínio `high`, `scripts/leituras/ler.sh`), 06.10.2026, das 16:04 às 16:08 UTC

*A redação da passagem H4-e é do lugar de direção (um modelo Claude), e por isso leu-a o Codex, a outra família. O pacote (47 ficheiros, 3 MB, o diff de `81e3de31` a `8f07e6c0`, os ficheiros mudados inteiros, as páginas construídas do Método nas duas edições, o inventário das frases e a leitura curta da H4-d) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-H4-e-codex-2026-10-06.plantas.json`: a página portuguesa a dizer que o modelo que construiu é também o que lê (p1), a cópia do portão em inglês com «people» (p2), uma frase da H4-d viva no inventário (p3), o relatório a reclamar uma corrida inteira dos portões na máquina (p4) e a régua L3 a dispensar «peça» em todo o lado (p5). O leitor mordeu os cinco (os achados 1, 2, 6, 5 e 3). O achado real é o 4: a regra 9 do Método («A intervenção humana») ainda dizia que a direção é de uma pessoa que escolhe o que se publica, contra a secção dos papéis e contra a §1.112; o lugar de direção reescreveu-a nas duas edições (a direção é de um modelo, que decide o que se publica dentro das regras e das recusas que uma pessoa com nome define; é essa pessoa que responde; nem ela nem o modelo escrevem números), e essa mudança leva a sua leitura pela outra família antes de aterrar. O 7 (as capturas ausentes do pacote) é do pacote e não do ramo: as capturas estão no ramo, e o pacote seguinte leva as de 390 px. O 8 (os guiões das provas a registar os nomes dos guiões antigos) corrigido. Símbolos da leitura: 97 445 (a linha «tokens used»).*

## Blocking

1. **The Portuguese built page reverses the rule separating builder and reader.** It says «o modelo que construiu é também o que lê», immediately after requiring different model families. The source, gate copy and inventory say «nunca é o que lê». Its SHA-256 starts `8a2afb90`, whereas the tested Portuguese page’s recorded hash starts `44c54251`; the green proof did not test this page.
References: `built/metodo/index.html:1`, `src/data/politica-ia.mjs:421`, `scripts/lugares-ia-do-portao.mjs:14`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:18`

2. **The English gate copy says the three roles are held by people, contradicting the source, built page and diff.** The copied gate expects “all held by people”; the other copies say “all held by models”. Consequently, its introduction comparison rejects the supplied English page, despite the stored proof recording an intact English page with no failures.
References: `scripts/lugares-ia-do-portao.mjs:17`, `scripts/lugares-ia-do-portao.mjs:38`, `src/data/politica-ia.mjs:394`, `built/en/method/index.html:1`, `diff.patch:2593`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:25`

## Major

3. **The copied L3 ruler exempts every occurrence of «peça», instead of removing the policy exemption.** Its unconditional `continue` bypasses counting this word in every block on every examined page; the diff contains no such instruction. The four boundary plants have been removed, so their removal accompanies a broader exemption. The supplied green log is also incompatible with this copy: it records five uses of the remaining «peça» exception, whose counting this skip prevents.
References: `scripts/check-lugar.mjs:1417`, `scripts/check-lugar.mjs:2325`, `diff.patch:2578`, `diff.patch:2737`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/check-lugar.log:39`

4. **Both Method pages assign publication decisions to a person and to an AI model without distinguishing their authority.** Rule 9 says «A direção é de uma pessoa, que escolhe o que se publica»; the new section says all three roles belong to models and that direction decides, reviews and approves publication. English makes the same conflicting assignments. I would not print either page unchanged: the account of who decides publication needs rewriting because the reader cannot identify the respective human and model responsibilities.
References: `built/metodo/index.html:1`, `built/en/method/index.html:1`, `src/data/politica-ia.mjs:393`, `src/data/politica-ia.mjs:400`

5. **The H4-e report claims a successful local full-gate run that its generator explicitly excludes.** Line 510 says the full gates ran locally “a 0” and on GitHub. The generator instead writes that full gates run on GitHub “e não na máquina”, and the runner says the same. No H4-e local full-gate command or result supports the added claim; GitHub completion is likewise not evidenced in this package.
References: `relatorio-construtor.md:510`, `design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py:60`, `design/especime-v3/medicoes/h4-2026-10-06/correr-h4e.py:2`, `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:4`

6. **The inventory keeps the old Portuguese Reading sentence live alongside its replacement.** Line 4173 marks «A leitura lê cada peça…» as `viva`, although the diff retires it. All ten new entries exist, but only nine of the ten H4-d entries are retired. The inventory checker explicitly rejects this condition, contradicting its saved successful log.
References: `design/especime-v3/INVENTARIO-FRASES.md:4173`, `design/especime-v3/INVENTARIO-FRASES.md:4183`, `diff.patch:14`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e.mjs:36`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-e.log:1`

7. **None of the claimed Method captures is available for inspection or SHA-256 verification.** The manifest contains ten entries covering both editions at the five requested widths. All thirty referenced images, the full pages, role crops and header crops, are absent from the package. The manifest therefore supplies recorded claims and hashes, but no images against which to reproduce them.
References: `relatorio-construtor.md:553`, `relatorio-construtor.md:557`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:50`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:57`

## Minor

8. **The report names different policy-proof and capture commands from those actually recorded by the runner.** It names `provar-politica.mjs` and `captar-h4.mjs`; the execution record names `provar-politica-e.mjs` and `captar-h4-e.mjs`. Both new scripts hard-code the older filenames into their result metadata, which the report then reproduces. This is incorrect execution provenance, independently of whether the runs succeeded.
References: `relatorio-construtor.md:522`, `relatorio-construtor.md:553`, `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:16`, `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:34`, `design/especime-v3/medicoes/h4-2026-10-06/provar-politica-e.mjs:56`, `design/especime-v3/medicoes/h4-2026-10-06/captar-h4-e.mjs:84`

## «What is fine»

9. **The stored evidence contains eighteen policy plants with their required failure messages and three N1 plants with exit 1, matching messages and restoration hashes, with clean start/end states recorded at the declared H4-e head.** References: `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:28`, `design/especime-v3/medicoes/h4-2026-10-06/n1-e/plantas-portoes-h4b.json:1`, `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:14`

10. **The three targeted exit-code files reproduce the report’s zeros.** References: `relatorio-construtor.md:516`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/check-lingua.codigo:1`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/check-lugar.codigo:1`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/gate-html.codigo:1`

11. **The new role text contains none of the specified closed vocabulary, and the Union comment now distinguishes the measured menu label from the unmeasured full page title.** References: `src/data/politica-ia.mjs:391`, `src/data/politica-ia.mjs:400`, `src/data/politica-ia.mjs:421`, `src/i18n/strings.mjs:188`

«not yet»: the public wording contradicts itself, copied gates and inventory diverge from the diff, and the report overstates the available proof.
