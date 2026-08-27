# Leitura cruzada do Codex · as regiões (28.08.2026, madrugada)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o índice das regiões nas duas edições, três páginas de região, a primeira página, as quinze linhas da régua, o diff do inventário do bloco, dezoito capturas a 320, 360, 390, 430 e 1280 e os excertos das Emendas 10, 15 e 21. Custo: 190 031 símbolos, 564 s. Três plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | o valor do Algarve no índice português trocado de 89 para 98 (a barra e a linha dizem 89) | **sim**: «a false row-backed claim», com o marcador, a linha e a barra do telemóvel a dizer 89 |
| P2 | o rótulo do valor da Madeira na régua pintado com uma cor de estado | **sim**: «a prohibited highlight», Emenda 21c |
| P3 | uma frase de diligência na página do Alentejo | **sim**: «an explicit diligence claim», e a sua ausência no inventário |

**Pontuação: 3 de 3.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **O índice não é o conjunto NUTS II completo** (cinco regiões; a NUTS 2024 tem nove para Portugal: faltam o Norte, o Centro, o Oeste e Vale do Tejo e os Açores). **Real e previsto**: o R1 do motor confirmou o conjunto nos ficheiros do Eurostat e trouxe as quatro linhas (2024, índice 71, 71, 65, 73); entram neste bloco antes da fusão (Emenda 21e).
2. **«5 regiões com linhas publicadas.»** e as suas variantes: cobertura, não o assunto. **Real**: a frase sai; a contagem, se ficar, nomeia as regiões e não a publicação.
3. **«pontos do índice ·» seguido de um `span` vazio** nas peças das distâncias: um separador pendurado. **Real; corrige-se.**
4. **O reencaminhamento dos endereços antigos só se infere estaticamente** (o script não ia no pacote): medido ao vivo pela medição M7. **Sem ação.**
5. **As capturas não batem com as páginas do pacote**: são as plantas. **Sem ação.**
6. **Passa**: cada barra igual à sua linha; nenhuma região sem linha desenhada; as distâncias recalculadas; no telemóvel uma região por linha, o eixo escondido, o 100 marcado; na página de uma região só o contorno a distingui-la.

## O relatório, tal como veio

The write failed because the workspace is read-only, so `REPORT.md` was not created. The completed report is below and is under 800 words.

# Fresh-eyes audit: regions and convergence ruler

## Findings

### High: The index is not the complete current NUTS II set

The indexes contain only five regions. NUTS 2024 has nine Portuguese NUTS II regions; Norte, Centro, Oeste e Vale do Tejo, and Região Autónoma dos Açores are missing. Eurostat confirms the current classification and nine-region list ([overview](https://ec.europa.eu/eurostat/web/nuts), [Portuguese list](https://ec.europa.eu/eurostat/cache/metadata/en/hlth_cdeath_simscd_pt.htm)).

This fails REGRAS 21(a). Omitting bars unsupported by rows is correct, but the result is not the promised complete index.

### High: The Portuguese desktop ruler publishes a false Algarve figure

In `paginas/regioes.html`, the Algarve desktop marker is bound to `pib-pc-algarve-2024` but prints **98**. Its ledger row, marker position, phone value, and phone bar are all **89**. This is a false row-backed claim. The English index and supplied screenshots show 89.

### Medium: Madeira receives a prohibited highlight

The same Portuguese desktop SVG gives Madeira’s value an inline amber `fill:#e0a21a`. Every other regional value uses neutral ink. No ledger state justifies the distinction, and REGRAS 21(c) forbids it.

The sampled region pages otherwise comply: only the page’s own region receives `data-contorno="sim"` on the desktop marker plate and phone row. Its bar, value, and label remain unchanged.

### Medium: Reader-page voice and the inventory fail

`paginas/regioes-alentejo.html` says: “Os valores desta régua foram reconferidos contra o Eurostat antes de serem publicados.” That is an explicit diligence/trust claim forbidden by REGRAS 15, and it is absent from `INVENTARIO.diff`.

The index sentences “5 regiões com linhas publicadas.” / “5 regions with published rows.” and their title variants mentioning the ledger describe the site’s coverage, not the subject. The inventory classifies all four as `conteudo`; they are `autorreferencia`. The number 5 also has no ledger-row seal, only a same-page `data-prova` link.

### Medium: The screenshots do not represent the supplied build

The Portuguese desktop capture shows Algarve 89 and a neutral Madeira 88, while the supplied HTML contains 98 and amber.

The captures cover Greater Lisbon and Setúbal Peninsula pages, whereas the supplied region builds are Portuguese Greater Lisbon, Portuguese Alentejo, and English Madeira. The evidence set therefore masks two defects and does not reproduce two supplied pages.

### Low: The legacy redirect is only statically inferable

`inicio.html` whitelists `alentejo` and declares `data-porta-regiao="/regioes/:slug"`, so the declared resolution of `/?ambito=regiao:alentejo` is **`/regioes/alentejo`**.

The handler is external `/js/inicio.js`, which is absent from the package; actual execution is **[verify]**.

### Low: Region measure units leave a dangling separator

Derived-distance cards render `pontos do índice ·` / `index points ·` followed by an empty span. The trailing middle dot is visible in the captures.

## Checks that pass

All phone bars end at their ledger values: Portugal 82, Greater Lisbon 129, Setúbal Peninsula 55, Algarve 89, Madeira 88, and Alentejo 77. Every drawn territory has a corresponding `pib-pc-…-2024.yml` row and seal; no rowless territory is drawn.

All distance rows recompute correctly: 18, 29, 45, 11, 12, 23, historical Alentejo 22, and Setúbal–Greater Lisbon 74.

On phones, each territory is one `<li>`, the desktop axis is hidden, no axis labels remain, and both the EU-27 = 100 text and reference stroke remain.

**Verdict: Not ready to publish: the arithmetic and phone ruler pass, but completeness, one false figure, neutrality, and reader-page voice do not.**