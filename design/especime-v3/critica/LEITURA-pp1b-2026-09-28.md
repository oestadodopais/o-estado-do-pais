# A releitura a frio da passagem PP1b (a primeira página de um leitor comum) · Codex gpt-5.6-sol, 28.09.2026

*O pacote: o sítio de `2986a98d` a `b0a4abe5`, a primeira página nas duas edições, a página dos lugares e o mapa do sítio; cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-pp1b-2026-09-28.plantas.json`. A leitura achou as cinco plantas (os achados 1, 2, 4, 5 e 7). Custo: 179 603 símbolos, das 21:42 às 21:50 UTC. O achado 3 é o achado 4 da primeira leitura, anterior ao bloco e aberto como I172: o que está por conferir é se o quadro social da Comissão publica um valor de referência próprio para cada medida, e não os valores, que são linhas seladas do livro-razão; o bloco da habitação compara Portugal com a média da União, o que é verdade de qualquer modo. O achado 6 é do pacote, que não levava as imagens: o lugar de direção conferiu no ramo as 84 capturas, refeitas às 20:51 UTC na construção da cabeça dos portões (`56c7ed7b`) e iguais byte a byte às da primeira entrega, e o `conferir-relatorio.py` do relatório com 159 números, todos com ficheiro.*

## Blocking

1. **The Portuguese homepage’s no-script search submits to the wrong route, `/lugar/`, instead of `/lugares/`.** The declared places route, the English form and the frozen Portuguese page all use the correct route. Consequently, Portuguese readers without JavaScript leave the valid places path, while the report’s recorded `/lugares?concelho=mourao` result describes a different artefact.  
built/index.html:3, built/en/index.html:3, src/lib/routes.mjs:111, design/especime-v3/medicoes/pp1-2026-09-28/paginas-depois/index.html:3, design/especime-v3/medicoes/pp1-2026-09-28/plantas-pesquisa.json:73, relatorio-construtor.md:142

2. **The copied `package.json` does not run the three-block signals gate during `npm run build`, so PP1b’s primary production safeguard is absent.** Its build chain ends at `check:lingua`; the diff adds `&& npm run sinais`. The signals plant reads this chain and would now set `naCadeia` false, contradicting both the stored three-of-three result and the green build log, which were produced from a different file.  
package.json:12, diff.patch:15265, diff.patch:15270, scripts/sinais-da-primeira-pagina.mjs:107, scripts/sinais-da-primeira-pagina.mjs:117, design/especime-v3/medicoes/pp1-2026-09-28/plantas-sinais.json:15, design/especime-v3/medicoes/pp1-2026-09-28/portoes/pp1b/build.log:3, relatorio-construtor.md:141

3. **Both home editions publish housing-cost-overburden records as confirmed figures even though their exported verification status remains unresolved and invisible.** The previous cold read identifies housing-cost overload among the records marked `[verify]`, and the correction report explicitly says that this status still reaches cards without disclosure. The built pages display 6.3%, 7.7%, 27.2% and 18.6% with ordinary Eurostat source seals but no reader-visible `[a verificar]` marker.  
design/especime-v3/critica/LEITURA-pp1-2026-09-28.md:13, relatorio-construtor.md:97, built/index.html:3, built/en/index.html:3

## Major

4. **The copied search cell fabricates HTTP status 200, disagrees with the diff and cannot reproduce its own 404 plant.** Although it stores the navigation response, it assigns `r.estado = 200` unconditionally; the diff instead reads `resposta?.status()`. Its broken-action plant requires `s.estado === 404`, so that plant cannot bite under the copied implementation even though the stored record says it did.  
tests/inicio/pesquisa-da-primeira.mjs:86, tests/inicio/pesquisa-da-primeira.mjs:92, tests/inicio/pesquisa-da-primeira.mjs:151, tests/inicio/pesquisa-da-primeira.mjs:154, diff.patch:15579, diff.patch:15585, design/especime-v3/medicoes/pp1-2026-09-28/plantas-pesquisa.json:103

5. **The built sitemap contains only nine of the ten declared entry routes because its Portuguese work entry is `/o-meu-trabalho-antigo`.** The route table declares `/o-meu-trabalho/`, and E5 compares declared routes with `<url><loc>` paths, so it would reject this sitemap. The stored 10-of-10 result and the report therefore do not describe the supplied built sitemap.  
built/sitemap-0.xml:1, src/lib/routes.mjs:256, src/lib/routes.mjs:257, tests/inicio/entradas.mjs:133, tests/inicio/entradas.mjs:141, design/especime-v3/medicoes/pp1-2026-09-28/plantas-primeira-pagina.json:172, relatorio-construtor.md:143

6. **The claimed PP1b rerun evidence is incomplete in this package, so the visual and byte-equality assurances remain unshown measurements.** The capture manifest names a `capturas` directory and 84 image records, but none of the PNGs is supplied for inspection. The zero changed-image claim depends on a comparison with the earlier commit’s manifest, which is also absent, while several plant records that the report says were rerun at the measured head are merely referenced by `medidas.mjs` and not present.  
relatorio-construtor.md:9, relatorio-construtor.md:144, design/especime-v3/medicoes/pp1-2026-09-28/capturas-depois.json:11, design/especime-v3/medicoes/pp1-2026-09-28/capturas-depois.json:118, design/especime-v3/medicoes/pp1-2026-09-28/medidas.json:380, design/especime-v3/medicoes/pp1-2026-09-28/medidas.mjs:159, design/especime-v3/medicoes/pp1-2026-09-28/medidas.mjs:167

## Minor

7. **The report contradicts itself by calling `plantas-primeira-pagina.json` a 39-plant registry when it contains 38 plants.** The principal table and `medidas.json` correctly say 38 of 38, while the PP1b sitemap paragraph says “now with 39 plants.” The numerical checker’s claim that every report number has file support did not catch this incorrect association.  
relatorio-construtor.md:71, relatorio-construtor.md:143, design/especime-v3/medicoes/pp1-2026-09-28/medidas.json:496, design/especime-v3/medicoes/pp1-2026-09-28/medidas.json:505, numeros-do-relatorio.txt:5, numeros-do-relatorio.txt:7

## «What is fine»

8. **The signals program itself writes the signal record and returns failure whenever fewer than three blocks remain visible.** scripts/sinais-da-primeira-pagina.mjs:42, scripts/sinais-da-primeira-pagina.mjs:57, scripts/sinais-da-primeira-pagina.mjs:63

9. **The scripted search branch genuinely exercises empty, multiple-result, no-result and unique-result Enter behaviour in both editions at both widths.** tests/acessibilidade/pesquisa.mjs:83, tests/acessibilidade/pesquisa.mjs:88, tests/acessibilidade/pesquisa.mjs:114, tests/acessibilidade/pesquisa.mjs:126, design/especime-v3/medicoes/pp1-2026-09-28/plantas-pesquisa.json:3

10. **E5’s source logic checks all five new entry declarations in both editions, reads every sitemap named by the index and has biting missing-route and missing-child-sitemap plants.** tests/inicio/entradas.mjs:49, tests/inicio/entradas.mjs:59, tests/inicio/entradas.mjs:133, tests/inicio/entradas.mjs:139, tests/inicio/entradas.mjs:181

11. **Apart from the hidden verification status, the numerical prose on the two home editions explains the populations, units and comparison direction, while the places page’s sole substantive count plainly means Portugal’s 308 municipalities.** built/index.html:3, built/en/index.html:3, built/lugares/index.html:3
