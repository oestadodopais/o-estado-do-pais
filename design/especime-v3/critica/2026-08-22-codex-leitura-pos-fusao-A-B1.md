# Leitura cruzada da ronda pós-fusão, etapa A e B1 (Codex, sem contexto), 22.08.2026

*Corrida pelo lugar de direção (Claude Fable 5) sobre a construção em `b6e1bef` (ramo `pos-fusao-v3`, depois de A1 a A3, do fecho de A e de B1). Leitor: Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos repositórios, com: o `dist/` inteiro sem os 532 PNG (os registos JSON ficam; um PNG de amostra), `ledger/claims/`, a constituição com as Emendas, `IDENTIDADE.md`, `metodo.mjs` e `sobre.mjs`, `CHAVES-EN.md`, `tokens.css` e `site.css`, o `README.md`, e o pacote de desenho `design-system/` inteiro (20 cartões e os tipos). Sem notas, sem briefs, sem capturas. **Cinco estragos plantados só na cópia**, registados antes da leitura com o resumo de cada ficheiro alterado:*

| planta | o quê | apanhada? |
|---|---|---|
| P1 | `17,6` → `17,8` no valor `data-claim` da página da linha dos preços da habitação, pt | **sim** (crítica 1) |
| P2 | `89,7` → `89,6` no registo JSON do cartão inglês da dívida pública (o PNG não vai no pacote) | **sim** (crítica 2) |
| P3 | a frase «Escrito por IA, dirigido por uma pessoa.» reposta na faixa de um documento alojado | **sim** (alta 3) |
| P4 | `.src-chip{color:#E8A80C}` (o amarelo v2, literal) na folha do cartão `03-selo-e-marcador.html` | **sim** (média 1) |
| P5 | a regra `.rule-svg .mk rect.mk-hit{fill:#0000}` (I61) removida da folha servida | **sim** (alta 1, com o diagnóstico certo: a área de toque pintada por cima do marcador) |

**Cinco de cinco.** Resumos SHA-256 dos ficheiros plantados, na cópia:

- `dist/livro-razao/precos-da-habitacao-2025/index.html` · P1 valor da linha alterado na página da linha, pt · `cfbdf970a27dedbd…`
- `dist/cartoes/en-ledger-divida-publica-2025.en.1200x630.json` · P2 registo de cartão com valor desfasado da linha (o PNG não vai no pacote) · `922b733bdf31cee3…`
- `dist/estudos/agua-nao-faturada/documento/index.html` · P3 frase sobre o sítio reposta na faixa de um documento · `bace3b9e27c3dc92…`
- `design-system/03-selo-e-marcador.html` · P4 literal de cor fora de tokens.css, e o amarelo v2, num cartão do sistema de desenho · `349442a0a5e067bf…`
- `dist/_astro/Base.B3dHB1qB.css` · P5 regra que mantém a área de toque do marcador transparente removida da folha servida · `430de7ed6fdc74c8…`

## Triagem do lugar de direção

- **Alta 2, «reader pages retain prohibited self-explanation».** Duas coisas misturadas. (a) Nas páginas de estudo, «Leitura breve · prosa da casa, assente numa frase do trabalho» e «Método e ressalvas» estão classificadas como **conteúdo** no `INVENTARIO-FRASES.md` (linhas 305 e 562) pela decisão da direção da subetapa 4e; a leitura do Codex fica registada como dissenso, e a classificação é matéria da fase da voz. (b) Em `/municipios/evora`, as três frases que nomeia («Como esta linha do tempo é feita», «Cada valor tem linha no livro-razão…», «Escolher uma em silêncio seria esconder que a diferença existe») **existem** na página construída e vivem num `<summary>`, num `p.deep-v` e num `span[data-nonledger="data-de-referencia"]` do instrumento dos mandatos, que são blocos que a régua do inventário exclui por construção (origem declarada, texto de comando). A rota lê 0 de autorreferência e a régua não as vê: **ISSUES I62**, um ponto cego da régua e um corte editorial que é da direção. Nada mexido.
- **Média 2, a conjunção portuguesa em `reason_en`.** Verdadeiro: `ledger/claims/evora-prr-vencido-aprovado-2026.yml:89` traz «…listagem-de-entidades-prr-20260817.xlsx e listagem-de-projetos-prr-20260817.xlsx…» e rende em `/en/corrections` e na página inglesa da linha. A linha é do exportador do motor (V16), e o sítio não escreve linhas à mão: **ISSUES I63** e pedido ao motor **C3**.
- **Baixa, a amostra de cartões.** Do empacotamento do lugar de direção (o cartão inglês da primeira página chama-se `en.en.1200x630.png` e o guião procurou `inicio.en…`); não é do sítio.
- O veredicto do leitor («não fundir como está») assenta nas cinco plantas; sem elas, ficam a I62 (régua e voz) e a I63 (motor).

## O relatório, verbatim

## Critical

- **A published figure disagrees with its ledger row.** [dist/livro-razao/precos-da-habitacao-2025/index.html](dist/livro-razao/precos-da-habitacao-2025/index.html:2) renders `17,8` in `data-claim="precos-da-habitacao-2025"`. [ledger-claims/precos-da-habitacao-2025.yml](ledger-claims/precos-da-habitacao-2025.yml:9) requires `value: "17,6"`. The ledger contract permits no rounding or substantive normalisation. The receipt therefore publishes a false value and invalidates [dist/prova.json](dist/prova.json:2) as evidence of an error-free scan of these bytes.

- **A share-card record disagrees with its row and with itself.** [dist/cartoes/en-ledger-divida-publica-2025.en.1200x630.json](dist/cartoes/en-ledger-divida-publica-2025.en.1200x630.json:26) records `"texto": "89,6"` for `campo: "value"`. [ledger-claims/divida-publica-2025.yml](ledger-claims/divida-publica-2025.yml:9) requires `89,7`; the same card record’s `copia` also says `89,7% do PIB`. A card audit record cannot authenticate the asset when its machine-readable value is corrupt.

## High

- **The built stylesheet paints the convergence-rule hit target over its marker.** [dist/_astro/Base.B3dHB1qB.css](dist/_astro/Base.B3dHB1qB.css:1) contains `.rule-svg .mk-hit{fill:#0000}` followed by the more specific `.rule-svg .mk rect{fill:var(--paper)}`, but omits the corrective override. [docs/site.css](docs/site.css:1205) requires `.rule-svg .mk rect.mk-hit { fill: transparent; }`. [dist/js/convergencia.js](dist/js/convergencia.js:217) appends that rectangle after the labels and points, and invokes the redraw on load. Consequently, the PT and EN home-page markers are covered by an opaque paper-coloured interaction layer.

- **Reader pages retain prohibited self-explanation.** The five study slugs `evora-quinze-anos-cinco-mandatos`, `evora-economia-investidores-portas-abertas-2026`, `evora-orcamentado-pago-devido-2025`, `evora-os-pelouros-quem-os-teve-o-que-fizeram`, and `evora-prometido-pago-auditado-2026` contain the defect in both `dist/estudos/<slug>/index.html` and `dist/en/studies/<slug>/index.html`. Their fragments include `Leitura breve · prosa da casa, assente numa frase do trabalho`, `Brief reading · house prose, resting on a sentence of the study`, and `Método e ressalvas` / `Method and caveats`. The last study also explains its missing excerpt in a paragraph beginning `Estes dois valores são somas...` / `These two values are sums...`. Separately, [dist/municipios/evora/index.html](dist/municipios/evora/index.html:2) says `Como esta linha do tempo é feita`, `Cada valor tem linha no livro-razão`, and `Escolher uma em silêncio seria esconder...`; [the English edition](dist/en/municipalities/evora/index.html:2) translates the same self-description. Amendment 15 in [the constitution](docs/constituicao-v3.1-com-emendas.md:97) requires zero discussion of the site’s method, verification, honesty, or intentions on reader pages, and requires absence to be only `sem linha`.

- **A hosted-document banner contains forbidden authorship copy.** [dist/estudos/agua-nao-faturada/documento/index.html](dist/estudos/agua-nao-faturada/documento/index.html:12) adds `<span data-oedp-autoria>Escrito por IA, dirigido por uma pessoa.</span>`. The banner contract permits only the wordmark, document label, study-page return, and About navigation; Amendment 15 confines authorship and self-description to Method, About, and the row receipt. This also makes this document’s injected wrapper differ structurally from the other hosted editions.

## Medium

- **A design card uses an ungoverned, inaccessible colour literal.** [design-system/03-selo-e-marcador.html](design-system/03-selo-e-marcador.html:6457) contains `.src-chip{color:#E8A80C}`. The literal is absent from [docs/tokens.css](docs/tokens.css:141), while [docs/site.css](docs/site.css:682) requires `color: var(--muted)`. `#E8A80C` against the light paper token `#f6f7f4` measures approximately `1.95:1`, below AA for this 12px text. This violates both the no-literal rule in [IDENTIDADE.md](docs/IDENTIDADE.md:357) and its all-used-pairs-pass-AA rule.

- **Portuguese grammar leaks into the English edition.** [ledger-claims/evora-prr-vencido-aprovado-2026.yml](ledger-claims/evora-prr-vencido-aprovado-2026.yml:89) puts the Portuguese conjunction `e` twice inside `reason_en`: `...xlsx e listagem...`. It is rendered in [dist/en/corrections/index.html](dist/en/corrections/index.html:2) and [dist/en/ledger/evora-prr-vencido-aprovado-2026/index.html](dist/en/ledger/evora-prr-vencido-aprovado-2026/index.html:2). The filenames may remain Portuguese, but the conjunction must be `and` in an `html lang="en"` page.

## Low

- **The promised share-card sample set is incomplete.** [dist/cartoes-amostra/](dist/cartoes-amostra/) contains only `inicio.pt.1200x630.png`, although the package inventory says it contains two samples. The paired [1200×600 record](dist/cartoes/inicio.pt.1200x600.json:1) supplies the natural second review fixture, including its byte count and digest. This does not break the site, but it prevents inspection of the second card aspect ratio.

**Verdict: Do not merge as it stands, because the build publishes ledger-inconsistent values and ships binding content and accessibility violations.**