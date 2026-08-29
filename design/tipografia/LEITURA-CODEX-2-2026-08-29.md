# Leitura cruzada (Codex) da segunda ronda do estudo tipográfico

*29.08.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, ≈232k símbolos, sobre um pacote de 17 entradas tirado de uma cópia (worktree destacado de `tipografia-2026-08-29` em `91c3b46`): a adenda, a rubrica, `TABELA-2.md`, `ORDEM-2.md` e `.json`, `MEDIDAS-2.json`, `MEDIDAS-2-tipo.json`, `MEDIDAS-2-aberturas.json`, `NOTAS.md`, a primeira leitura, as três pranchas, `programa/`, `tipos/ORIGEM.md` e o relatório do construtor. Três plantas, registadas por sha256 antes do lançamento (`LEITURA-CODEX-2-2026-08-29.plantas.json`, o contexto impresso de cada alvo conferido antes e depois): P1, a tinta mediana da Ledger na tabela (0,540 → 0,450); P2, a soma da Literata na ordem (33 → 31, com o parêntese a dizer 33); P3, a diferença de densidade nas notas (7,7 → 17,7 %). **Apanhou as três**, e uma quarta que não era planta: a §6.6 das notas chama 1118 ao resultado da Newsreader, que é o número da primeira ronda (o de agora é 977).*

## O veredicto do leitor, numa frase dele

«The winner is not decision-safe.» A aritmética das somas está certa fora das plantas; o que não está é a aplicação à letra do que a adenda fixou antes de medir.

## Triagem do lugar de direção, conferida nos ficheiros do ramo (sem plantas)

| achado | conferido | o que é |
|---|---|---|
| 1 · as três plantas e o 1118 da §6.6 | as plantas são plantas; o 1118 está na linha 648 das notas, na §6.6, e é o valor da primeira ronda | **real**, a corrigir nas notas (977) |
| 2 · a ordem da prosa viola a eliminatória dos versaletes | `programa/ordem.mjs`, linha 249: `passa: lugar === 'instrumento' ? tnum : true`; a §6.2 das notas diz que **o lugar de direção decidiu, depois da adenda**, que uma candidata sem `smcp` entra com a Spectral SC e a penalização nos bytes | **real, e é decisão minha**: mudei a regra depois de fixada; a leitura literal tira a Newsreader e a Ledger, e a ordem das três que ficam (Source Serif 4, Literata, Spectral) não muda entre si, mas as somas têm de ser recalculadas sobre as elegíveis (17, 24, 25 pelo leitor) e não riscadas |
| 2 · a Ledger entrou depois de o conjunto estar fixado, e ganha os bytes por não ter os pesos 500/600/700 nem o itálico que o sítio compõe | a §6.9 das notas diz que a acrescentei depois da adenda; a medida (e) conta os estilos ausentes como zero bytes | **real, e é decisão minha**: exploratória, não confirmatória; a normalização «os mesmos estilos» da adenda não foi cumprida para ela |
| 3 · a medida de peso 5 não é a medida fixada | a rubrica (linha 28) fixa «a corrida mínima de tinta, e se desaparece»; o traço sólido mínimo é 1 px em todas (empate); `programa/pixeis.mjs` ordena pela mediana da cobertura de pico das corridas de 1 px, franjas incluídas, uma estatística derivada que a adenda não fixou; é o que dá a vitória à Ledger | **real**: o peso 5 ordenou por uma medida que ninguém fixou antes |
| 3 · o instrumento tem 28 células e não 35 (a página de leitura falta), os algarismos herdam corpos reais e não 13,5 px, e só o primeiro recorte de cada célula numérica fica gravado | a tabela diz «21 de 28» e «19 de 28» no instrumento e «(35 células)» no rótulo da linha | **real**: incompleto e rotulado como completo |
| 4 · os pesos zero são em parte política posterior aos resultados | a medida 3 dá 1 px em alguns «e» e nulo em «a» e «s», e 1 px no «o» da Newsreader e da Ledger (uma letra sem abertura): é falha do detetor, não igualdade; na densidade do instrumento 416,8 = 416,8 é empate a declarar, não peso a apagar (não muda a ordem) | **real**, de escrita: dizer «falha do detetor» e «empate», não «peso zero» |
| 5 · buracos no portão dos detetores (`provaDosTabulares()` não é imposta; `document.fonts.check` aceita o tipo de recurso; `correr.sh` não corre `subconjunto.py` nem `inspecionar.py`) | por conferir linha a linha numa terceira passagem | **plausível**; entra no brief da terceira passagem se a houver |
| 6 · o pacote não sustenta as afirmações de reprodutibilidade | limite do pacote (não levou `capturas-2/`, `medidas-2/`, os tipos nem o sítio) | do pacote; as afirmações ficam por conferir por outra via |
| 7 · as pranchas provam menos do que a prosa diz; as de prosa continuam a 3× e 2×, e a prova visual do resultado a 1×, pedida pela primeira leitura, continua por dar | as pranchas existem a 390 (3×) e 1280 (2×) | **real**: o resultado decisivo (peso 5, a 1×) não tem imagem |

## O que isto quer dizer

A segunda ronda mediu mais e melhor do que a primeira (a captura e a posição de rolamento corrigidas, um vermelho por detetor, a densidade a 7,7 % e não 23 %), e a ordem que escreveu não serve para decidir: o peso 5 ordenou por uma estatística que não estava fixada, e as duas candidatas que ele põe à frente só estão na tabela por duas decisões que o lugar de direção tomou depois de a adenda estar escrita. Lida à letra, a adenda deixa Source Serif 4, Literata e Spectral, por esta ordem, com o traço mais fino empatado a 1 px nas três e 7,7 % de densidade entre a primeira e a última. O que o estudo sustenta hoje é isto: **entre as famílias livres, nenhuma bate a Spectral por uma medida fixada antes de medir**; a diferença que a Ledger mostra é de uma estatística escolhida depois e de um ficheiro incompleto. A decisão de continuar (uma terceira passagem que fixe a medida de traço à letra, complete as 35 células do instrumento, dê a imagem a 1×, e recalcule sobre as elegíveis) ou de fechar a pergunta das famílias livres com este registo é do diretor; o Parnaso continua a depender do pacote de teste dele.

## O relatório, tal como veio

# Fresh-eyes report: second typography round

The winner is not decision-safe. The arithmetic is corrupted, and the ranking does not apply the precommitted eliminatories or stroke measure literally.

## Blocking

1. **Four apparent planted document damages break the claimed generated chain.**

   - `TABELA-2.md` prints Ledger's measure 2 as **0.450**; `MEDIDAS-2.json`, `ORDEM-2.json`, `ORDEM-2.md`, `NOTAS.md` §6 and the builder report give **0.5399/0.540**. Every other table cell matches the JSON after rounding. Ledger remains first either way, but the advertised number to beat does not match the table.
   - `ORDEM-2.md` gives Literata **31**, although its own bracket is `5·3 + 3·4 + 2·1 + 1·4 = 33`. `ORDEM-2.json`, `NOTAS.md` and `RELATORIO-CONSTRUTOR-2.md` correctly give 33. The present `programa/ordem.mjs` would also write 33, so the Markdown is not its claimed output.
   - `NOTAS.md` §6.3 says the current density spread is **17.7%**. From 977 and 907 it is **7.72%** relative to the smaller value. The builder's 7.7% is correct. The first-round 23% was correct for its old 1118 and 907 values: 23.26%.
   - `NOTAS.md` §6.6 calls Newsreader's current result **1118**; the current table and JSON say **977**. This is the superseded first-round value.

2. **The prose order violates the adenda's eliminatory rule.** `ADENDA-2-segunda-ronda.md` excludes prose without `smcp` or a hosted sister family. Newsreader and Ledger both lack it. `NOTAS.md` §6.2 openly replaces that eliminatory after the adenda with a Spectral SC fallback, while `tnum` is still applied literally to IBM Plex Sans. Disclosure is honest; the confirmatory ranking is not. `programa/ordem.mjs` explicitly makes every prose candidate pass, and `programa/agregar.mjs` hard-codes IBM's exclusion instead of deriving it from `tem_feature_tnum`. Under the literal adenda, with ranks recomputed over eligible candidates, the prose order is Source Serif 4 **17**, Literata **24**, Spectral **25**. Merely “crossing out” Ledger and Newsreader is not a valid recomputation.

   Ledger was added after the candidate set was fixed, making it exploratory. It wins bytes by omitting three weights and the italic that the site uses. Counting absent styles as zero bytes is not the adenda's “same styles” normalization.

3. **The weight-5 stroke score is not the literal fixed measure.** `RUBRICA.md` names the minimum ink run and whether it disappears. The reported minimum solid stroke is **1 px for every ranked family**, a tie. `programa/pixeis.mjs` instead ranks the median peak coverage of every one-pixel horizontal and vertical run, including curve ends and antialiasing fringes. That derived statistic was not fixed in the adenda and is not an identified “finest stroke.” It is the principal reason Ledger wins.

   The instrument implementation is also incomplete: `MEDIDAS-2.json` contains **28**, not 35, cells per instrument (four pages × seven widths); the reading page is absent, despite `programa/pranchas.mjs` saying that page contains 99 uses at 13.5 px. The sampled figures inherit several real page sizes, not a controlled 13.5 px. `TABELA-2.md` nevertheless labels the row “35 cells.” For numeric cells, `regua.mjs` may pool up to 12 crops but saves only the first PNG, so the pixels behind the score are not all auditable.

## Should fix

4. **Zero weights are partly post-result policy, not simply the adenda's rule.** For measure 3, some `e` values are 1 px, while `a` and `s` are null; real Newsreader and Ledger `o` glyphs also falsely return 1 px despite the planted closed-ring test. Calling this detector output unusable is sensible, but “no family gave a value” is false and this is detector failure/incomplete data, not equality. For instrument density, 416.8 equals 416.8: the adenda says to declare a tie, not to erase the weight. Erasing it changes no order because both would receive the same rank.

5. **The detector gate has holes.** A detector returning nothing in `programa/provas.mjs` itself is caught by a failed assertion or exception. The real-page check in `regua.mjs` is not: `provaDosTabulares()` can return `ok:false`, or `ok:true` when removing tabulars changes nothing, and its result is never enforced. `aberturas.mjs` and the numeral-board generator rely on `document.fonts.check`, although `provas.mjs` correctly explains that this can accept fallback. A failed font can therefore be labelled as the requested family. `programa/correr.sh` also omits `subconjunto.py` and `inspecionar.py`, so it is not an end-to-end regeneration and can consume stale subset/type JSON.

6. **The package cannot substantiate the reproducibility claims.** Missing are `MEDIDAS-2-celulas.json`, `medidas-2/`, `capturas-2/`, `tipos/SUBCONJUNTOS.json`, the fonts, site, repeat runs, and Git history. The aggregate JSON self-reports 630 cells and contains the 35/28 measure-2 summaries, but not the full grid. I could not determine from this package whether subsets, captures, the 468-pixel oscillation, 143 CSS rules, 6,606 HTML files, 209 `<em>` uses, commits, origins, or byte-for-byte reruns are genuine. The current generated-Markdown contradictions already refute regeneration of the package as supplied.

7. **The boards support less than the prose claims.** `PRANCHA-2-390.png` visibly confirms that Public Sans wraps “euros” at 390 px. Ledger's only declared face is 400 while the pages request 600/700 and synthesis is not disabled, so fabricated bold is supported by `programa/interruptor.mjs` and `MEDIDAS-2-tipo.json`; the image alone cannot prove the cause. `PRANCHA-2-ALGARISMOS.png` qualitatively shows Bitter/Public Sans alignment and Ledger's proportional digits, consistent with the JSON. It is a synthetic, right-aligned specimen and prints no variances, so it does not validate the real-page numeric measurements. Its own text correctly admits that 13.5 px is not the ledger page's prevalent body (12 and 14 px are). The prose boards remain 3× and 2×, so the predecessor's request for visual evidence of the decisive 1× stroke result remains unanswered.

## Note

- Apart from Literata's printed 31, all ranks, competition ties, weighted brackets and final ordering in `ORDEM-2.json` are arithmetically correct for the program's noncompliant candidate set. The Ledger/Literata density tie at 907 and the instrument tie at 416.8 are real. Reversing the chosen senses of density and x-height does not change either order.
- The other “numbers to beat” agree with raw JSON: prose 977, 8.6262, 179,852 bytes; instrument 0.1835, 9.0384, 34,244 bytes. Only Ledger's stroke target conflicts with `TABELA-2.md`.
- Commercial columns are honestly empty, and IBM Plex Sans is correctly excluded under the explicit `tnum`-feature rule even though its default digits happen to be equal-width.
