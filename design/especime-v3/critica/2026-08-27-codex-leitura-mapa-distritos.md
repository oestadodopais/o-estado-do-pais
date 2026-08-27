# Leitura cruzada do Codex · o mapa por distritos (27.08.2026, noite)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre a primeira página construída nas duas edições, quatro páginas de distrito, o índice dos distritos, `/municipios` e uma página de concelho, os JSON do mapa (o país, o manifesto, três distritos), o diff do inventário do bloco, dezasseis capturas a 390 e 1280, e os excertos das Emendas 10, 15 e 20. Custo: 265 065 símbolos, 508 s. Quatro plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | Águeda retirada da página de distrito de Aveiro (a área e a entrada da lista) | **sim**: «High, Aveiro is not its manifest», 18 áreas para 19 |
| P2 | uma área da primeira página pintada com uma cor de estado (`fill:#e0a21a`) | **sim**: «neutrality is broken», o `style` inline apontado |
| P3 | uma frase de diligência na página de distrito de Lisboa | **sim**: «a diligence claim on a reader page», e a ausência dela no inventário |
| P4 | «Ílhava» por «Ílhavo» no JSON de Aveiro | **sim**: a discrepância entre o JSON e a página |

**Pontuação: 4 de 4.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **A legenda do mapa da primeira página não nomeia a DGT nem a licença** («308 concelhos · CAOP 2025 ■ fonte»); as páginas de distrito nomeiam-nas, mas escrevem «CC-BY» onde o manifesto diz «CC BY 4.0». **Real**: a Emenda 20e pede a atribuição onde o mapa está; corrige-se antes da fusão (o selo da primeira página com o bloco da fonte; a cadeia exata da licença).
2. **«Um observatório de Portugal.»** apontado como mobília a explicar o sítio: é a frase de identidade da Emenda 18a. **Sem ação.**
3. **«sem linha ainda» tem três palavras**: a forma da casa. **Sem ação.**
4. **O manifesto guarda contagens por unidade e não a lista dos slugs de cada uma**, pelo que a junção não se reproduz só do manifesto: nota justa sobre o artefacto; o `check:mapa` do sítio reconfere a junção com a lista da Carta e os 29 ficheiros, e a próxima geração do motor pode escrever a pertença por unidade no manifesto. **Registado (I80).**
5. **A primeira página pesa 161 KB em bruto (29,5 KB comprimida)**, sobretudo pelos 308 itens escondidos da pesquisa: anterior a este bloco. **Registado.**

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is read-only and rejected the patch. Here is the completed report, under 900 words.

# Fresh-eyes audit

## Findings

**High — Aveiro is not its manifest.** `mapa/distritos/aveiro.json` has 19 objects at `.concelhos`, including `{"slug":"agueda","nome":"Águeda"}`. `paginas/distritos-aveiro.html` has only 18 `svg[data-mapa-concelhos] a[data-concelho-porta]` and 18 `section#concelhos li`; both omit `agueda`, so there is no area or `/municipios/agueda` link. The same JSON says `{"slug":"ilhavo","nome":"Ílhava"}`, while `a[data-concelho-porta="ilhavo"] title` and the list say exact string `Ílhavo`. The other three district renderings pass: São Miguel is 6/6; Portuguese Lisboa 16/16; English Lisboa 16/16. Their slugs, names, SVG `d` paths and links equal their JSON (`/municipios/<slug>` or `/en/municipalities/<slug>`), and every page has a municipality list.

**Medium — neutrality is broken in one edition.** In `paginas/inicio.html`, `a[data-uni-porta="aveiro"]` alone has exact attribute `style="fill:#e0a21a"`; the other 28 anchors and all 29 in `paginas/en.html` do not. The child paths otherwise all use `class="uni"`; district-page paths do too. No map area carries a status/coverage class or label. The `data-tipo` and `data-parcela` differences describe official unit type/frame, not coverage. The inline fill is currently defeated by `.uni{fill:none}`, but it remains a forbidden per-area styling difference and could become visible after a CSS change.

**Medium — the public voice contradicts the rules and its inventory.** `paginas/distritos-lisboa.html`, `.distrito-cabeca > p:not(.distrito-tipo)`, says `Este mapa foi verificado pela equipa contra a Carta antes de ser publicado.` This is a diligence claim on a reader page. `paginas/inicio.html` and `paginas/en.html`, `.masthead-identidade`, say `Um observatório de Portugal.` / `An observatory of Portugal.`, explaining the site in the furniture. `paginas/municipios.html`, `.concelhos-cobertura`, has the permitted textual coverage statement `308 de 308 concelhos · tem página`. `paginas/municipios-evora.html` has three non-compliant absence strings: two `article[data-medida-vazia] .peca-sem-linha` and one `#mandato-2017-2021 .mun-campo-vazio` say `sem linha ainda`, not the required `sem linha`. `INVENTARIO.diff` classifies all 16 new strings as `conteudo` and none as `navegacao` or `autorreferencia`; it omits the Lisboa diligence sentence, so its claimed zero is false. No unmarked cross-language sentence was found; the Portuguese CAOP provenance on the English Lisboa page is explicitly `lang="pt-PT"`.

**Medium — attribution is incomplete on the most prominent map.** The four district pages contain exact source-block wording `Publicação: Direção-Geral do Território (DGT)` and `licença CC-BY`. Their captions identify `Carta Administrativa Oficial de Portugal · 2025`. But `paginas/inicio.html` `.mapa-linha-fonte` says only `308 concelhos · CAOP 2025 fonte`, and `paginas/en.html` says `308 municipalities · CAOP 2025 source`; neither writes DGT or the licence. The district wording also drops the version from `mapa/manifest.json` `.fonte.licenca`, exact value `CC BY 4.0`.

**Medium — the 29-unit join proof cannot be independently reproduced from this package.** `mapa/manifest.json` reports `.juncao.unidades = 29`, `.juncao.concelhos = 308`, 29 per-unit counts summing to 308, and `.concelhos.slugs` contains 308 unique slugs. However, `.ficheiros` names 29 district JSON files and only three are present; 26 are absent. The manifest stores counts, not each unit’s slug membership. It therefore supports “308 unique globally” but cannot prove that none is missing or duplicated across unit assignments.

**Low — front-page HTML is heavy but compressible.** `paginas/inicio.html` is 161,481 bytes raw (29,508 gzip) and `paginas/en.html` 163,579 bytes (29,567 gzip), each embedding 308 hidden search-result items plus 29 SVG paths. The municipalities index is 106,634 bytes raw; the Évora page is 119,190.

## Passes

Both front pages have exactly 29 areas matching `mapa/pais.json` in count, slug, name, geometry and language-correct destination. Every map link contains a non-empty `<title>` accessible name and an `href`, so it is natively keyboard reachable. All map SVGs use `role="group"`, not `role="img"`, preserving link semantics. Both home pages provide 11 island fallback links under `div[data-mapa-ilhas]`: two Madeira and nine Azores, all with correct destinations.

**Verdict: not ready — the navigation and accessibility model works, but manifest fidelity, neutrality, voice and front-page attribution still fail explicit rules.**