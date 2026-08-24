# Leitura cruzada da parte 3, primeira leitura (Codex, sem contexto), 24.08.2026

*Corrida pelo lugar de direção (Claude Fable 5) sobre a construção em `7626a2a` (ramo `parte3-2026-08-24`, depois da P2, antes da P3). Leitor: Codex CLI 0.147.0, `gpt-5.6-sol`, esforço xhigh, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos repositórios, com: as três páginas de leitura do exemplar (04 pt, 04 en, 08 pt) e as três edições arquivadas ao lado; os registos, os ficheiros de operações e o `registos/manifest.json` dessas edições; `ledger/claims/` inteiro e `ledger/cruzamentos/evora.json`; as 30 páginas de linha que os selos abrem; `dist/prova.json`; `IDENTIDADE.md`, `direcao.md` com as Emendas, a §2.2 do `DECISIONS.md` (as nove origens) e o `REGISTOS.md` do motor; as três folhas de estilos. Sem notas, sem briefs, sem o plano. O pacote leva um `README.md` com os factos do desenho (a página é uma transcrição do registo; o 04 mostra a tabela onde a edição arquivada tem gráficos; uma figura sem linha do sítio leva a porta e não o selo). Custo, como o CLI reporta: **292 467 símbolos**, orçamento próprio do Codex, zero símbolos Claude. **Seis plantas, cinco reais e um controlo negativo, registadas antes da leitura com o resumo de cada ficheiro alterado:*

| planta | o quê | apanhada? |
|---|---|---|
| P1 | um carácter tirado num parágrafo do 08 pt (bloco 4) | **sim** (Medium 1) |
| P2 | a figura 12.0.1.0 do 04 pt imprime o value da linha do sítio em vez do printed do documento | **sim** (High 1) |
| P3 | um selo ao lado da figura 5.0 do 04 pt, que não tem linha do sítio (a linha do motor tc-families não está no registo de travessia); a porta para a entrada retirada | **sim** (High 2) |
| P4 | a faixa do 04 en diz 103 blocos, e a página tem 102 | **sim** (Medium 2) |
| P5 | uma frase sobre a verificação da casa acrescentada ao aparelho do 08 pt | **sim** (Medium 3) |
| P6 | controlo negativo: a página do 04 com a tabela (bloco 12) onde a edição arquivada tem gráficos, intacta | **não reportada**, como devia |

**Cinco de cinco, e o controlo negativo limpo.** Resumos SHA-256 dos ficheiros plantados, na cópia:

- `dist/estudos/evora-quinze-anos-cinco-mandatos/texto/index.html` · P1 · antes `a1b41b5b790d5e4b…` · plantado `3c6f9be8304f9928…`
- `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html` · P2 · antes `bc160fb56034f030…` · plantado `1b8a1aa45bf82a66…`
- `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html` · P3 · antes `1b8a1aa45bf82a66…` · plantado `82a0c26e5d3b21e3…`
- `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html` · P4 · antes `17e2265838f8adfb…` · plantado `08178990c17aa1ae…`
- `dist/estudos/evora-quinze-anos-cinco-mandatos/texto/index.html` · P5 · antes `3c6f9be8304f9928…` · plantado `2f43a4b9fc689fe0…`

## Triagem do lugar de direção

- **High 3, «forty-four uncrossed figure occurrences lack their required doors».** **Real, e é da P2.** As figuras que estão dentro de uma ligação do próprio documento (no 04, os anos e os números dos relatórios do Tribunal de Contas dentro das ligações para as fichas) ficaram em `<span data-registo>` sem porta própria, com a porta só na entrada de «As linhas deste documento»: foi uma escolha do brief da P2 (§3, «a porta vai na entrada da linha»), e o leitor tem razão pela letra da `IDENTIDADE.md` §5.3 e §10: «onde aparece um valor, aparece a porta». Uma âncora não pode aninhar noutra, e a ligação do documento manda sobre o seu texto; a saída é a gémea da regra do selo, que já diz que numa figura dentro de uma ligação o selo vai imediatamente depois da ligação: **a porta vai imediatamente depois da ligação**, uma por figura sem linha do sítio, e o L6 e o `check:cadeia` passam a exigi-la. Corrige-se na ronda de correções desta parte, com o seu estrago plantado. 22 ocorrências por edição do 04; as outras seis edições não têm figuras dentro de ligações (medido na P2: 42 figuras dentro de ligação no âmbito, todas no 04).
- As outras cinco críticas são as cinco plantas, repostas na cópia (o repositório nunca as teve).
- O veredicto do leitor («cannot be merged as they stand») assenta nas cinco plantas mais a High 3; sem as plantas fica a High 3.

## O relatório, verbatim

# Defect report

## High

1. **The reading page replaces the document’s printed value with the ledger’s exact value.**
   - **Path:** `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`
   - **Location:** block 12, row 0, cell 1, figure `#12.0.1.0`.
   - **Expected:** `€167 372 756`, with figure `printed: "167 372 756"` and strong emphasis spanning positions 0–12, as specified by `registos/evora-prometido-pago-auditado-2026/pt.record.json`. The archived edition also prints `167 372 756`.
   - **Found:** `€167 372 755,84`, with the figure and emphasis extended through position 15. This is the exact site-ledger value, but the reading page must transcribe the record’s printed form.

2. **A figure receives a false provenance seal pointing to an unrelated study and value.**
   - **Path:** `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`
   - **Location:** block 5, figure `#5.0`, the `4` in “Lê também 4 das famílias…”.
   - **Expected:** the record identifies engine row `tc-families`. `ledger/cruzamentos/evora.json` has no crossing for `(04 Évora Public Money, tc-families)`, so the figure must be a door to `#linha-tc-families` and must not carry a seal.
   - **Found:** a `src-chip` links to `/livro-razao/evora-camara-lugares`. That site row crosses `(08 Évora Mandates, el2025-seats-total)` and stores value `7`, not this figure’s row or value.

3. **Forty-four uncrossed figure occurrences lack their required doors to the rows section.**
   - **Paths:**
     - `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`
     - `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html`
   - **Locations on each page:** figures `#62.1.1.0` through `#62.6.1.2` (18 occurrences), `#69.0.0`, `#69.0.1`, `#69.1.0`, and `#71.0`, 22 occurrences per page.
   - **Expected:** none of these engine rows has a matching site row in `ledger/cruzamentos/evora.json`; each figure must therefore be an in-page door to `#linha-<engine-row>`, under `IDENTIDADE.md` §5.3.
   - **Found:** each is a plain `<span class="texto-figura">` inside an external document link. The external link opens a report or PDF, not the figure’s entry under “As linhas deste documento” or “The rows of this document”.

## Medium

1. **Block 4 is not a character-for-character transcription.**
   - **Path:** `dist/estudos/evora-quinze-anos-cinco-mandatos/texto/index.html`
   - **Location:** block 4, sentence beginning “Sete limite…”.
   - **Expected:** “Sete **limites** governam tudo o que se segue. Nenhum deles é um detalhe.” This is the exact text in `registos/evora-quinze-anos-cinco-mandatos/pt.record.json` and in the archived edition.
   - **Found:** “Sete **limite** governam tudo o que se segue. Nenhum deles é um detalhe.”

2. **The English counts band reports one nonexistent block.**
   - **Path:** `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html`
   - **Location:** `data-registo-conta="evora-prometido-pago-auditado-2026/en=blocos"`.
   - **Expected:** `102`, computed from the record and confirmed by `registos/manifest.json`; the rendered article also contains 102 blocks.
   - **Found:** `103 blocks`.

3. **Reader-page furniture makes a prohibited claim about the site’s verification.**
   - **Path:** `dist/estudos/evora-quinze-anos-cinco-mandatos/texto/index.html`
   - **Location:** `<p class="texto-origem">Cada número desta página foi verificado pela casa contra a sua fonte.</p>`.
   - **Expected:** no reader-page furniture sentence about the site’s method, verification, honesty, or intentions, under `direcao.md`, Emenda 15.
   - **Found:** an explicit self-referential verification claim in the reading page’s apparatus.

**Verdict:** These reading pages cannot be merged as they stand because they contain record corruption, false and missing provenance paths, an incorrect computed count, and a constitutional furniture violation.
