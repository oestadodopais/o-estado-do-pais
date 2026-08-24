# Leitura cruzada da parte 3, segunda leitura (Codex, sem contexto), 24.08.2026

*Corrida pelo lugar de direção (Claude Fable 5) sobre a construção em `180148c` (ramo `parte3-2026-08-24`, depois da P4 e da primeira ronda de correções), sobre as **oito** páginas de leitura. Leitor: Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos repositórios, com: as oito páginas de leitura e as oito edições arquivadas; os oito registos, os ficheiros de operações e o `registos/manifest.json`; `ledger/claims/` inteiro e `ledger/cruzamentos/evora.json`; as 95 páginas de linha que os selos abrem; `dist/prova.json` e `dist/cadeia.json`; `IDENTIDADE.md`, `direcao.md` com as Emendas, a §2.2 do `DECISIONS.md` e o `REGISTOS.md` do motor; as três folhas. O `README.md` do pacote leva os factos do desenho, incluindo a forma nova da porta a seguir à ligação e o caso do 03 pt (edição arquivada a partir de um artefacto). Custo, como o CLI reporta: **229 537 símbolos**, orçamento próprio do Codex. **Sete plantas, seis reais e um controlo negativo, registadas antes da leitura com o resumo de cada ficheiro alterado:*

| planta | o quê | apanhada? |
|---|---|---|
| P1 | um carácter tirado num parágrafo do 09 pt (bloco 4) | **sim** (Medium 4) |
| P2 | a figura 6.0 do 07 pt (com selo) imprime o value da linha do sítio (109 483 314,95, com espaços finos) em vez do printed do documento (109 483 315) | **sim** (High 1, com as posições exatas) |
| P3 | um selo ao lado da figura 4.0.0 do 06 pt, que não tem linha do sítio (a linha do motor p3-class-indiv não está no registo de travessia); a porta retirada | **sim** (High 2) |
| P4 | a faixa do 07 en diz 92 blocos, e a página tem 91 | **sim** (Medium 5) |
| P5 | uma frase sobre a verificação da casa acrescentada ao aparelho do 03 pt | **não** (ver a triagem) |
| P6 | controlo negativo: a página do 04 com a tabela (bloco 12) onde a edição arquivada tem gráficos, intacta; e o 03 pt cuja edição arquivada é um artefacto e não os bytes do motor, intacto | **não reportada**, como devia |
| P7 | uma porta a seguir a uma ligação do documento retirada no 04 en (a figura tc-report-16-2018 fica dentro da ligação sem saída) | **sim** (High 3) |

**Seis de sete, e o controlo negativo limpo.** Resumos SHA-256 dos ficheiros plantados, na cópia:

- `dist/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/texto/index.html` · P1 · antes `0a6b2d1d55334396…` · plantado `62278ed7f3eb789f…`
- `dist/estudos/evora-orcamentado-pago-devido-2025/texto/index.html` · P2 · antes `70ffc522f9d8d2d4…` · plantado `e435446434feb944…`
- `dist/estudos/evora-economia-investidores-portas-abertas-2026/texto/index.html` · P3 · antes `946d5a7e30f98ebf…` · plantado `bb851a4ac0382266…`
- `dist/en/studies/evora-orcamentado-pago-devido-2025/text/index.html` · P4 · antes `61786b64eb60ce36…` · plantado `ec116b40776429db…`
- `dist/estudos/avaliacao-economica-regional-de-portugal-2026/texto/index.html` · P5 · antes `1e5c629af97f1eab…` · plantado `0a0bcc3a283f7d5e…`
- `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html` · P7 · antes `5e6d18cf33ad2597…` · plantado `7f34333b59d07fb7…`

## Triagem do lugar de direção

- **A planta P5 não foi apanhada.** A frase «Todos os números deste documento foram reconferidos pela casa antes de o publicar.», posta no aparelho do 03 pt, não aparece no relatório. A mesma classe de planta foi apanhada na primeira leitura (no aparelho do 08 pt, com a Emenda 15 citada). Não se sabe porquê de dentro; o que se sabe é a rede mecânica desta classe: a régua do inventário de frases (`scripts/medir-defeitos.mjs`, medida 8) lista como **por classificar** qualquer bloco de texto novo numa rota inventariada, e a rota `texto` está inventariada nas oito edições; na árvore real a régua lê zero por classificar e autorreferência zero, nas oito (P4). A régua imprime e não fecha a construção, e por isso esta classe continua a ser trabalho de leitura, como a §1.49 já dizia: uma leitura que apanha não prova que a próxima apanhe.
- **Medium 6, «the figure counts link to an aggregation that cannot substantiate them».** **Real, e é da P2.** As duas contas da faixa, «algarismos» e «com linha do livro-razão», abriam `#linhas-do-documento`, que tem uma entrada por linha do motor **distinta** (246 entradas para 411 figuras no 03 pt; 25 portas de linha do sítio para 52 figuras com selo no 07); a regra da `IDENTIDADE.md` §10 é que a porta leva onde se vê o que o número conta, e o que ele conta são as figuras, que se veem no corpo. **Correção:** as três contas abrem `#documento` (o corpo, onde cada figura e cada selo estão marcados), e o L5 passa a exigir esse destino, com a sua planta. Segunda ronda de correções.
- **7, «the generated chain reports conceal two broken provenance exits».** **Não é defeito do sítio: é a ordem do empacotamento.** O `dist/cadeia.json` e o `dist/prova.json` do pacote foram calculados sobre a construção intacta, e as plantas P3 e P7 foram aplicadas à cópia depois; o leitor viu, com razão, um ficheiro de cadeia que não reflete as páginas que tinha à frente, e um 11.º selo no 06 pt, que é a planta P3. Na árvore real o `check:cadeia` fecha a construção nos dois casos (provado na ronda de correções 1, planta 1: «a prova diz que "registos_resolvidos" é 2601 e o portão conta 2600»). Fica a nota para empacotamentos futuros: plantar antes de copiar os ficheiros de prova, ou dizer no README que os ficheiros de prova são da construção intacta.
- As outras cinco críticas são as plantas P1, P2, P3, P4 e P7, repostas na cópia (o repositório nunca as teve).
- O veredicto do leitor («cannot be merged as they stand») assenta nas plantas; sem elas fica a Medium 6.

## O relatório, verbatim

# Defect report

## High

1. **The reading page substitutes the ledger’s exact value for the document’s printed figure.**
   - **File:** `dist/estudos/evora-orcamentado-pago-devido-2025/texto/index.html`
   - **Location:** block `6`, figure `6.0`, after “O orçamento de Évora para 2025 diz €”.
   - **Expected:** `109 483 315`, characters 65–76, from `registos/evora-orcamentado-pago-devido-2025/pt.record.json`, block 6, `figures[0].printed`. The archived edition prints the same rounded form.
   - **Found:** `109 483 314,95`, characters 65–79. This is the exact value from site row `evora-orcamento-2025`, not the record’s printed form. It also shifts figure `6.1` from its required range 128–138 to 131–141.
   - **Why defective:** the reading page must transcribe `printed`, never replace it with the crossing ledger’s differently formatted value.

2. **A figure without a site crossing carries an unrelated provenance seal instead of its engine-row door.**
   - **File:** `dist/estudos/evora-economia-investidores-portas-abertas-2026/texto/index.html`
   - **Location:** block `4`, item `0`, figure `4.0.0`, the initial `1`.
   - **Expected:** an `a.texto-figura-porta` linking to `#linha-p3-class-indiv`. The record assigns row `p3-class-indiv`, and `ledger/cruzamentos/evora.json` contains no crossing for `06 Évora Economy` + `p3-class-indiv`.
   - **Found:** a plain `span.texto-figura` followed by a seal linking to `/livro-razao/evora-camara-lugares`.
   - **Why defective:** that site row crosses `08 Évora Mandates` + `el2025-seats-total`, an unrelated engine row. The seal therefore makes a false provenance promise and the figure has no door to its actual row.

3. **One linked figure has neither a seal nor its required post-link door.**
   - **File:** `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html`
   - **Location:** block `62`, cell `62.1.1`, “Relatório N.º 16/2018”, figure `62.1.1.0` (`16`).
   - **Expected:** two consecutive `a.texto-figura-porta-apos` anchors after the document link, for `#linha-tc-report-16-2018` and `#linha-tc-year-16-2018`, one per figure. Neither engine row has a site crossing.
   - **Found:** only the second door, for `tc-year-16-2018`.
   - **Why defective:** the `16` is inside the document’s own link and has no route to its engine-row entry.

## Medium

4. **The transcription deletes a character from the record.**
   - **File:** `dist/estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/texto/index.html`
   - **Location:** block `4`.
   - **Expected:** `Oito limites governam tudo o que se segue. Nenhum deles é um detalhe.`, from the record; the archived edition agrees.
   - **Found:** `Oito limite governam tudo o que se segue. Nenhum deles é um detalhe.`
   - **Why defective:** the reading page is not character-for-character identical to the pinned record.

5. **The English accounts page reports the Portuguese edition’s block count.**
   - **File:** `dist/en/studies/evora-orcamentado-pago-devido-2025/text/index.html`
   - **Location:** counts band, `data-registo-conta="evora-orcamentado-pago-devido-2025/en=blocos"`.
   - **Expected:** `91`, from the English record, its manifest entry, its 91 rendered block markers, and `dist/cadeia.json`.
   - **Found:** `92`.
   - **Why defective:** this is a false site-generated count.

6. **The figure counts link to an aggregation that cannot substantiate them.**
   - **Files:** all eight reading pages.
   - **Location:** counts-band anchors ending `=algarismos` and `=com_linha_do_sitio`; both point to `#linhas-do-documento`.
   - **Expected:** a door to where the counted occurrences are visible, as required by `IDENTIDADE.md` §10 and `DECISIONS-2.2-origens.md` origin 9.
   - **Found:** the destination aggregates repeated figures into one entry per distinct engine row. For example, `411` figures lead to `246` entries; `194` figures lead to `153`; and `52` figures with site rows lead to only `25` ledger-row links. The same mismatch occurs in every non-zero edition.
   - **Why defective:** the destination exposes unique rows, not the figure occurrences represented by the counts.

7. **The generated chain reports conceal two broken provenance exits.**
   - **Files:** `dist/cadeia.json` and `dist/prova.json`
   - **Location:** `totais.registos_resolvidos`, `totais.registos_por_resolver`, and the corresponding per-edition fields for `evora-economia-investidores-portas-abertas-2026/pt` and `evora-prometido-pago-auditado-2026/en`.
   - **Expected:** `2599` correctly resolved and `2` unresolved: the unrelated seal in block `4.0` of study 06 and the missing door in cell `62.1.1` of study 04 EN. Physically, the pages contain only 2600 exits because the latter door is absent; only 2599 reach the correct destination.
   - **Found:** `2601` resolved and `0` unresolved. The 06 page also physically contains 11 seals although its crossing count is 10.
   - **Why defective:** the site’s chain evidence does not reflect the built pages or validate that each exit belongs to the figure’s actual row.

**Verdict:** These reading pages cannot be merged as they stand because the build alters pinned content, assigns false provenance, leaves a figure without a row door, and reports the resulting chains as complete.
