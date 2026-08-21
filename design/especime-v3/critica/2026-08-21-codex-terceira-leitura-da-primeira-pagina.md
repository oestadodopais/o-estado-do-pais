# Terceira leitura cruzada da primeira página v3 (Codex, sem contexto), 2026-08-21, manhã

*Sobre a construção em `dfbd44c` (depois da ronda 2l: Emendas 15 a 17). Mesmo leitor, pacote e prompt das duas leituras anteriores; as plantas P1 e P3 reancoradas (peça vazia; lede nova). **Cinco de cinco plantas apanhadas** (1 P4, 2 P1, 3 P5, 4 P3, 10 P2): a frase portuguesa na edição inglesa, que escapara duas vezes, foi vista desta vez porque a lede nova é curta e o leitor a comparou às duas edições.*

## Triagem do lugar de direção

- **Reais, para a próxima ronda:** (11) as peças continuam contornadas por uma sombra de 1px a toda a volta (um retângulo fino): a Emenda «sem caixas, separadas por fios» pede fios de grelha (linhas entre células), não contornos por peça; (13) a descrição `<meta>` da primeira página diz «Cada número publicado tem uma linha no livro-razão», autorreferência fora do inventário (que só lê o corpo): redação nova a propor ao diretor, e o inventário passa a ler o `<head>`.
- **De desenho da casa, como antes:** (5) e (9) `data-prova`, `data-nonledger` com motivo, e as distâncias com linha; (6) `convergencia.js` compõe cadeias da ilha conferida pelo portão; (12) sem script só o estado por defeito é completo; (7) e (8) artefactos das plantas.

## O relatório, verbatim

The home is not director-ready. I found **13 defects: 1 critical, 6 high, 5 medium, and 1 low**. The release-blocking failures are a wrong value in the default Portuguese view, Évora data leaking into every unsupported municipality, a false/nested provenance seal, untranslated English copy, deliberate bypasses around the “every number has its own row” rule, and a runtime that manufactures visible statistical content despite the stated pre-render-only boundary. The supplied proof and state captures also contradict the delivered HTML, so they cannot certify this package.

## Ranked findings

### 1. The Portuguese default publishes the wrong government-debt value

**Severity: critical**

- **Where:** [dist/index.html:1](dist/index.html:1), fragment: `data-claim="divida-publica-2025" ... >89,8`
- **Required:** [ledger/claims/divida-publica-2025.yml:9](ledger/claims/divida-publica-2025.yml:9) says `value: "89,7"`.
- The English home correctly says `89,7`. The supplied Portuguese state dump also says `89,7` at [estados/estado_densidade_leitura.txt:79](estados/estado_densidade_leitura.txt:79).
- **Why it matters:** this is visible in the default País view and directly breaks the site’s central evidence contract. It also means the two editions disagree on a statistical fact.

### 2. Every unsupported Portuguese municipality inherits Évora’s population

**Severity: high**

- **Where:** [dist/index.html:1](dist/index.html:1), inside `data-painel="vazio"`:
  > `data-claim="evora-populacao-2025" ... >58 567</span> pessoas`
- [dist/js/inicio.js:238](dist/js/inicio.js:238) maps every municipality without a dedicated block to `vazio`; lines 284–286 then display that block.
- [docs/RELOCACOES.md:12](docs/RELOCACOES.md:12) authorises Évora’s eight measures only for `Município (Évora)`. [docs/direcao.md:89](docs/direcao.md:89) requires eight empty pieces for a municipality without a page.
- **Why it matters:** choosing Beja, Águeda, or any other unsupported municipality displays an Évora figure as though it belonged to the chosen place. It is also an unauthorised extra occurrence under R2. The English empty panel does not contain this leak.

### 3. A debt disclosure contains a wrong-neighbour seal nested inside `<summary>`

**Severity: high**

- **Where:** [dist/index.html:1](dist/index.html:1), in the debt piece:
  > `<summary class="peca-abrir"> ... <a class="src-chip" href="/livro-razao/precos-da-habitacao-2025"> ... fonte</a></summary>`
- It points to `precos-da-habitacao-2025`, not `divida-publica-2025`.
- [docs/direcao.md:77](docs/direcao.md:77) explicitly says a seal must never be nested inside another target.
- **Why it matters:** this creates competing interactive controls inside a disclosure summary and gives readers false provenance. It is both an evidence and accessibility defect. A correct debt seal also exists later, but that does not neutralise the false one.

### 4. The English default lede is Portuguese

**Severity: high**

- **Where:** [dist/en/index.html:1](dist/en/index.html:1):
  > `Fora do limiar: dívida pública, posição de investimento internacional...`
- **Required:** [docs/CHAVES-EN.md:156](docs/CHAVES-EN.md:156):
  > `Outside the threshold: government debt, net international investment position, unit labour cost and house prices, in 2025.`
- The same exact wording is mandated by [docs/direcao.md:98](docs/direcao.md:98).
- **Why it matters:** this is prominent default-view copy, not an allowed source-title transcription or `[a verificar]`.

### 5. Numerous visible numbers deliberately bypass the row-and-seal contract

**Severity: high**

- **Where:** both home files mark numbers as `data-nonledger` or `data-prova` instead of giving each number its own ledger row and seal.
- Examples in [dist/index.html:1](dist/index.html:1) include:
  - formal thresholds such as `data-nonledger="limiar-do-quadro">60`, `35`, `9`, `85`;
  - ruler ticks and references such as `50 … 130`, `UE-27 = 100`;
  - age bands `20–64` and `18–24`;
  - the `40%` Social Scoreboard definition;
  - dates and update dates;
  - home counts such as `308`, `11`, `15`, and agenda counts, using `data-prova`.
- The statistic’s own seal is not a seal for its threshold, year, scale, or denominator. The task expressly excludes parent or neighbouring rows as substitutes.
- **Why it matters:** the build has implemented an undocumented exemption mechanism around the strongest acceptance rule. The formal threshold numbers are especially consequential because they determine the amber/cobalt state.

### 6. The home loads another script that generates visible statistical text

**Severity: high**

- Contrary to the package description, both homes load three external scripts: `/js/convergencia.js`, `/js/inicio.js`, and `/js/tema.js`.
- [dist/js/convergencia.js:88](dist/js/convergencia.js:88) deletes and rebuilds the ruler.
- Lines 102–114 calculate geometry and assemble visible distance text:
  > `cur.sinal + cur.distancia_texto + ' ' + ...`
- Lines 123–130 manufacture visible region names and values. Lines 196–203 manufacture the historical value and year. Lines 243–249 rewrite the glance value and its `data-claim`.
- **Why it matters:** values that passed static HTML inspection can be replaced at runtime. This violates the required model of selecting pre-rendered strings only.

`inicio.js` itself is substantially cleaner: it contains no `innerHTML`; [lines 96–108](dist/js/inicio.js:96) resolve query values against closed region/municipality/density sets; and it only copies page-owned municipality names and districts. Its geometry arithmetic does not produce displayed digits. The runtime failure is primarily the undeclared convergence script.

### 7. The supplied proof and state captures do not describe the delivered build

**Severity: high**

- [dist/prova.json:3](dist/prova.json:3) claims it was generated after a “varrimento sem erros”; lines 149–150 claim 444 audited values and zero without seals.
- Yet the delivered Portuguese HTML contains the `89,8` mismatch and the malformed neighbouring seal.
- The Country state dump says `89,7`, while the served file says `89,8`.
- The Alentejo state dump includes the full municipality map at [estados/estado_ambito_regiao_3Aalentejo_densidade_leitura.txt:39](estados/estado_ambito_regiao_3Aalentejo_densidade_leitura.txt:39), while [inicio.js:323](dist/js/inicio.js:323) says the map is hidden for Region.
- **Why it matters:** either the build was modified after validation or its verification captured a different output. The release evidence must be regenerated from the exact files being presented.

### 8. The leaked Évora value is also misformatted and mislabelled

**Severity: medium**

- The leaked form is `58 567`, with an ordinary space.
- [ledger/claims/evora-populacao-2025.yml:9](ledger/claims/evora-populacao-2025.yml:9) requires `58 567`, containing a narrow no-break space.
- Its hidden provenance says:
  > `Linha do livro-razão: Évora — Orçamentado, Pago, Devido 2025`
- The row belongs to `evora-economia-investidores-portas-abertas-2026` at line 37, and its receipt names “Évora — Economia, Investidores, Portas Abertas 2026”.
- [docs/RELOCACOES.md:62](docs/RELOCACOES.md:62) explicitly removes “Linha do livro-razão” and requires hidden text in the form `fonte · <estudo>`.
- **Why it matters:** even if the scope leak were ignored, this occurrence independently fails exact rendering and truthful provenance.

### 9. Numeric distances are printed despite the stated prohibition

**Severity: medium**

- Examples include `−18 pontos` in [estados/estado_densidade_leitura.txt:349](estados/estado_densidade_leitura.txt:349), plus `29`, `45`, `74`, `11`, `12`, `23`, and `22` in region heads and convergence briefs.
- [docs/direcao.md:84](docs/direcao.md:84) says phase 1 ships the ruler without numeric distance.
- There is a real specification conflict: [docs/PLANO-extractos.md:42](docs/PLANO-extractos.md:42) says row-backed distances may ship.
- **Why it matters:** the build fails the explicit “no numeric distance” review criterion, but the local plan simultaneously authorises these particular row-backed distances. The director’s intended rule cannot be inferred cleanly from these files; it needs one governing sentence before release.

### 10. Portuguese-only self-explanation survived Emenda 15

**Severity: medium**

- **Where:** [dist/index.html:1](dist/index.html:1), in the unit-labour-cost piece:
  > `Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador.`
- [docs/direcao.md:97](docs/direcao.md:97) removes sentences about the site’s verification, honesty, coverage, or intentions from reader pages.
- The English equivalent omits these sentences and goes directly to the 2024 definition.
- **Why it matters:** it violates the latest voice rule and creates an unexplained structural difference between editions.

### 11. Desktop pieces are boxed despite the no-box decision

**Severity: medium**

- **Where:** [dist/_astro/HomeView.BSQYEAjL.css:1](dist/_astro/HomeView.BSQYEAjL.css:1):
  > `.peca{box-shadow:0 0 0 1px var(--g3); ...}`
- Mobile later removes the shadow, but desktop retains a complete outline.
- [docs/direcao.md:91](docs/direcao.md:91) requires pieces “sem caixas, separadas por fios”.
- **Why it matters:** this is a direct visual-form decision, visible in the presentation most likely to be shown to the director.

### 12. The no-JavaScript default is not correct and all query-driven states collapse to it

**Severity: medium**

With scripts ignored, `/dist/index.html` gives the intended structural default: País · Relance, the full map, the Country panel, Social list, doors, ordinary links, and natively openable individual `<details>` pieces.

However:

- the default contains the critical `89,8` error and the nested wrong seal;
- `/?densidade=leitura` reloads the same static Relance markup;
- Region and Municipality query URLs cannot reveal their pre-rendered hidden blocks;
- readers lose search/filtering, map choice/readout, regional ruler selection, state announcements, URL normalisation, language-link state preservation, and the theme control.

Therefore it is a usable but **not complete and correct** País · Relance page. The loss of other states may be intended progressive enhancement, but the default’s data and provenance errors are not.

### 13. The `<head>` makes a claim the body disproves

**Severity: low**

- [dist/index.html:1](dist/index.html:1) says:
  > `Cada número publicado tem uma linha no livro-razão`
- The English description makes the corresponding claim.
- The numerous `data-nonledger`/`data-prova` numbers contradict it.
- The remaining basic metadata is present and internally consistent: language tags, titles, descriptions, canonical URLs, hreflang alternatives, Open Graph fields, and organisation JSON-LD.

## §3 decision audit

| Decision | Result |
|---|---|
| Eight navigation items including Correções | Pass |
| No `por ler`; unsupported municipality uses coverage words | Mixed: `por ler` is absent, but the Portuguese empty state contains the Évora value |
| Corrections old/new form plus row seal | Honestly parked in the documented v2-style state: old/new fields exist, but there is no struck-through form or per-pair row seal |
| `provisório` beside `p` values | Pass on the audited home surfaces |
| Phase-1 ruler without numeric distance | Fails the strict wording; contradicted by the plan’s later row-backed exception |
| Dark palette and ink contours | Required token values and contour rules are present; a complete rendered contrast matrix cannot be verified from the supplied static evidence |
| Method colour sentence conditional on corrections form | Correctly parked: the sentence is absent while the struck-through corrections form is absent |
| Method type sentence after self-hosting | Still parked for stage 4; fonts are locally hosted, but the sentence is absent. The files do not establish whether stage 4 was meant to be complete |
| Ink time signal, map/empty-state/form decisions | Mixed: time signal and current map code comply; boxes and the Portuguese empty state do not |
| Full 13-row MIP panel, 4/9 headline, eight-row Social list, compact map line and correction door | Structurally pass, apart from the wrong PT debt value and untranslated EN lede |

## Checks that otherwise passed

- Apart from the two Portuguese occurrences identified above, the remaining `data-claim` strings matched their YAML `value` strings.
- The home has exactly two density choices and no remnant of “Fundo”.
- `por ler`, catalogue, dossier, placeholders, and doors to either excluded feature are absent.
- The 13 MIP pieces and eight Social Scoreboard rows are present, with the required 4/9 summary.
- Colour appears confined to formal threshold states; Social and relative-to-average material remains ink/grey.
- The ruler CSS follows reference/bar/tick grammar, and I found no coloured bar on a “sem limiar” piece.
- The current map code hides the map in Region, uses full versus locator postures as specified, and uses a ring for the selected municipality. The missing neutrality legend is correct under Emenda 15, which explicitly revokes the older legend requirement.
- All internal links from both home files resolve within `dist/`, including fragments.
- IDs and the examined `aria-labelledby`, `aria-describedby`, and `aria-controls` references resolve. Controls have names and the home includes a polite live status region. The nested summary seal remains the major accessibility exception.
- Exact rendered hit sizes, visual fidelity to the boards, browser focus order, live-region behaviour, and full contrast results cannot be established reliably from these conflicting static artifacts alone.

I would **not show this home to the director yet**. The default Portuguese edition states a wrong fact, unsupported municipalities inherit Évora’s population, and the English lead sentence is untranslated; those are immediate trust failures rather than polish issues. Fix the critical and high findings, resolve the numeric-distance conflict, remove the remaining medium visual/copy defects, then regenerate `prova.json` and every state capture from the exact final `dist/` before presenting it.
## As plantas (plantas.json)
```json
{
  "commit": "dfbd44c",
  "plantas": [
    {
      "ficheiro": "dist/index.html",
      "descricao": "P4 valor 89,7 → 89,8 na peça da dívida pública, PT",
      "antes": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,7",
      "depois": "<div data-claim=\"divida-publica-2025\" style=\"--peca-corpo:var(--peca-corpo-curto)\" class=\"claim-value peca-valor\">89,8",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/en/index.html",
      "descricao": "P3 a lede do País em EN substituída pela frase portuguesa",
      "antes": "Outside the threshold: government debt, net international investment position, unit labour cost and house prices, in ",
      "depois": "Fora do limiar: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação, em ",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P1 a população de Évora (58 567, com selo válido para a sua linha) plantada dentro do estado vazio do concelho sem página, PT",
      "antes": "<article class=\"peca peca-vazia\" data-medida-vazia>",
      "depois": "<article class=\"peca peca-vazia\" data-medida-vazia><p class=\"vazio-medida\"><span class=\"claim claim-com-chip\"><span data-claim=\"evora-populacao-2025\" class=\"claim-value\">58 567</span> pessoas <a class=\"src-chip\" href=\"/livro-razao/evora-populacao-2025\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Évora — Orçamentado, Pago, Devido 2025\"><span class=\"vh\">Linha do livro-razão: Évora — Orçamentado, Pago, Devido 2025</span><span class=\"src-chip-texto\">fonte</span></a></span></p>",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P2 uma frase da regra 10 do Método acrescentada à peça do custo unitário do trabalho, PT (não está no registo de relocações)",
      "antes": "Custo do trabalho por unidade produzida, por hora trabalhada.",
      "depois": "Custo do trabalho por unidade produzida, por hora trabalhada. Não publica um número sem linha no livro-razão; onde a fonte ainda está por confirmar, a própria linha o diz com o marcador.",
      "ocorrencia": 1
    },
    {
      "ficheiro": "dist/index.html",
      "descricao": "P5 um segundo selo da linha dos preços da habitação plantado dentro do <summary> da sua peça (alvo aninhado), PT",
      "antes": "<summary class=\"peca-abrir\"><span class=\"peca-seta\" aria-hidden=\"true\"></span><span class=\"peca-abrir-a\">abrir</span><span class=\"peca-abrir-f\">fechar</span></summary>",
      "depois": "<summary class=\"peca-abrir\"><span class=\"peca-seta\" aria-hidden=\"true\"></span><span class=\"peca-abrir-a\">abrir</span><span class=\"peca-abrir-f\">fechar</span> <a class=\"src-chip\" href=\"/livro-razao/precos-da-habitacao-2025\" data-nonledger=\"proveniencia\" data-selo-etiqueta=\"Quadro institucional de indicadores, leitura direta da fonte\"><span class=\"vh\">Linha do livro-razão: Quadro institucional de indicadores, leitura direta da fonte</span><span class=\"src-chip-texto\">fonte</span></a></summary>",
      "ocorrencia": 1
    }
  ]
}```
