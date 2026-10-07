# A segunda leitura do M-A (a passagem M-A-b) pelo Claude Opus 5.5, 06.10.2026, das 13:54 às 14:12 UTC

*A leitura curta que a M48 pede quando uma correção toca um portão. O pacote (159 ficheiros, 11 MB, o diff de `beb1e37d` a `70fc8bc4`, os guiões mudados inteiros, os `tempos.json` e os códigos) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-MA-b-2026-10-06.plantas.json`: o `check:leituras` tirado da cadeia do `verify` (p1), o modo do GitHub do `check:briefs` desligado (p2), a tranca a caducar só aos 240 000 segundos (p3), o relatório a dizer 314,720 s (p4) e o corredor das plantas das leituras a sair sempre a 0 (p5). O leitor mordeu os cinco (os achados 2, 3, 4, 5 e 1). O veredicto: aceitável como fundação, nas versões do diff das quatro linhas plantadas. Os achados reais: o 9 (o padrão das pastas temporárias do limpador sem âncora à esquerda, que reescreve `dist/tmp/…` e endereços com `/tmp/`), corrigido pelo lugar de direção antes de aterrar; o 7 (os guiões das plantas sem limite de tempo) e o 6 (o registo de execução de um selo só validado pela forma, e a cabeça sem o estado da árvore) ficam como MA-6 e MA-7 para o M-B; o 8 (nenhuma corrida do GitHub no pacote; o `zsh` na imagem do GitHub por provar) prova-se pela corrida `portão` do ramo antes de aterrar; a nota do achado 2, que a célula U não vê um passo retirado do `package.json`, fica como MA-8 para o M-B. Símbolos da leitura: o total reportado pela ferramenta vai no registo da aterragem.*

Second read of M-A-b (built by Codex gpt-6-astra; read by Claude Opus 5.5). Paths are relative to the package folder.

**Short answer.** At the diff's lines, each correction for findings 6–16 does what the report's table says, and its plant bites inside the chain. Four copied files and the report copy diverge from the diff and from the recorded runs (findings 1–5).
- **Commands:** none runs fewer times than before. There are 49 distinct before and 50 after, set-equal plus `check:leituras`.
- **One step runs over less on this machine:** `check:briefs` re-ran 0 of 39 measurement scripts, where the clean baseline ran them all (186,426 s). The compensating full run happens only on GitHub, and no GitHub run is in the package (finding 8).

Refs: design/especime-v3/medicoes/ma-2026-10-06/portoes-b/verify.log:2370, relatorio-construtor.md:18

## Blocking

1. **The copied `check-leituras.py` always exits 0, so no plant in `tests/leituras` can turn the chain red.**
Line 43 computes `ok` from every script's code, and line 46 returns `0` anyway. The diff has `return 0 if saida['ok'] else 1`. With this copy, the report's «a cadeia fica vermelha se qualquer um falhar» is false. The recorded runs cannot tell the two versions apart, because every plant was green.
Refs: scripts/check-leituras.py:43, scripts/check-leituras.py:46, diff.patch:4563, relatorio-construtor.md:50

2. **The copied `package.json` drops `npm run check:leituras` from the `verify` chain, and no gate would notice.**
The chain reads `check:briefs  && npm run gate:html`, with a double space where the step was. The diff and the map's 46-step list both have the step. The final run counted 46 steps, so it did not use this copy. Cell U takes its expected list from the same `package.json`, so a removed step is invisible to it, locally and on GitHub. Nothing pins this step the way `prazo-pela-celula.mjs` pins the `check:pais` script.
Refs: package.json:46, diff.patch:4383, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:122, design/especime-v3/medicoes/ma-2026-10-06/portoes-b/verify.log:3807, scripts/verify-depois-do-build.mjs:166, tests/inicio/prazo-pela-celula.mjs:30

3. **The copied `check-briefs.py` makes `no_github()` return `False`, so GitHub honours seals; after the next re-seal, no brief measurement script runs in any chain.**
- With the diff's line restored in memory, the file hashes to `1f9fb942…`, the `conferidor_sha256` in `presos.json`. The copy hashes to `656f3ace…`.
- So today every seal is ignored and all 39 scripts re-run; the loss arrives with the next `--escrever-presos`.
- Every run would still print «O GitHub corre todos os guiões».
- The plant for this case would fail, but findings 1 and 2 silence it.
Refs: scripts/check-briefs.py:293, scripts/check-briefs.py:355, scripts/check-briefs.py:561, diff.patch:4423, design/observatorio/medidas/presos.json:2, tests/leituras/briefs-presos.py:59

## Major

4. **The copied `portoes.sh` expires the lock after 240000 s (66.7 hours), not 2400 s, against its own comment and M46.**
`tranca.py` re-checks 2400 s, but it is only called once the shell's threshold has passed. With this copy, a killed run blocks every worktree for almost three days. The plant would not fail; it would wait forever, because `correr` has no timeout. The recorded plant (code 1, «tranca com mais de quarenta minutos») shows that the head that ran did not have this line.
Refs: scripts/leituras/portoes.sh:30, scripts/leituras/portoes.sh:12, diff.patch:5058, scripts/leituras/tranca.py:18, tests/leituras/portoes.py:56, design/especime-v3/medicoes/ma-2026-10-06/plantas-b/check-leituras.json:50

5. **The report's table gives the M-A-b full run as 314,720 s, against its own line 11 and the data (414,720 s).**
`LEIA-ME.md` prints 414,720. Every other cell reproduces from the four `tempos.json` files by the generator's definitions. The number check ran on `LEIA-ME.md`, not on this copy. The wrong value overstates the gain by 100 s.
Refs: relatorio-construtor.md:15, relatorio-construtor.md:11, design/especime-v3/medicoes/ma-2026-10-06/portoes-b/tempos.json:5, design/especime-v3/medicoes/ma-2026-10-06/LEIA-ME.md:15, design/especime-v3/medicoes/ma-2026-10-06/relatorio.py:60, numeros-do-relatorio.txt:1

## Minor

6. **The seal's execution record is not the audit trail that MA-1 claims: it names a head without tree state, and only its shape is checked.**
- All 39 seals carry head `58ab143b`. The report lists that as «M-A-b 6», the commit before «M-A-b 7», which by its title adds the sealing. So, by inference from the titles, uncommitted code wrote the seal, and the record cannot show it.
- `registo_valido` accepts any 40-hex head, any UUID and any timezone-aware time. A hand-written seal with an invented record therefore passes on this machine.
- The plant only tests a seal whose record field is removed.
Refs: design/observatorio/medidas/presos.json:10, scripts/check-briefs.py:297, scripts/check-briefs.py:309, tests/leituras/briefs-presos.py:51, relatorio-construtor.md:215, relatorio-construtor.md:226, relatorio-construtor.md:227

7. **No plant script has a time limit, so a plant that regresses into waiting hangs the local gate instead of failing with its message.**
Both `subprocess.run` calls lack `timeout`. Neither `portoes.sh` nor the runner bounds a step (searched: no timeout, kill or limit in the runner). Only GitHub's 45-minute job limit ends a hang, and it does so without the plant's message. Finding 4 is one concrete case.
Refs: scripts/check-leituras.py:34, tests/leituras/portoes.py:29, scripts/leituras/portoes.sh:99, .github/workflows/portao.yml:82

8. **The report claims that `check:leituras` and every brief script run on GitHub, but shows no such run.**
The builder did not push, and no GitHub run is in the package. `aterrar.py` runs `zsh`, and `aterrar.sh` is `#!/bin/zsh`. The workflow installs only npm packages and Chromium (with its libraries) on `ubuntu-24.04`. Whether that image has `zsh` is not shown here; if it does not, the next `portao` goes red (failing closed).
Refs: relatorio-construtor.md:50, relatorio-construtor.md:222, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:126, tests/leituras/aterrar.py:49, scripts/aterrar.sh:1, .github/workflows/portao.yml:77, .github/workflows/portao.yml:127

9. **The cleaner's generic temp pattern has no left boundary, so it rewrites any `/tmp/` or `/var/folders/` segment plus the rest of that path, including repository paths and URLs.**
I reproduced this in memory with the module's own function. `dist/tmp/pagina.html` becomes `dist<temporario>`, and `https://exemplo.pt/tmp/relatorio.pdf` becomes `https://exemplo.pt<temporario>`. Today's final logs contain zero `<temporario>`, so no evidence has been altered yet.
Refs: scripts/leituras/limpar-caminhos.py:44, tests/leituras/ferramentas.py:77

## «What is fine»

10. Every step of all four runs exited 0, and the 50-row command table reproduces exactly. Refs: relatorio-construtor.md:65, relatorio-construtor.md:90, design/especime-v3/medicoes/ma-2026-10-06/portoes-b/tempos.json:296
11. The baseline is head `207d7134` with three 0-byte state files. Its 1482,695 s equals its timestamps, and the hashes of its `portoes.sh` and three instruments match `metodo.json`. Refs: design/especime-v3/medicoes/ma-2026-10-06/antes/metodo.json:2, design/especime-v3/medicoes/ma-2026-10-06/antes/metodo.json:5, design/especime-v3/medicoes/ma-2026-10-06/antes/tempos.json:5
12. The 360 alvos passes are identical, with pages hash `f3f7abb7…` on both sides. Routes, widths, cells, axe, serious violations and bad targets are also equal. Refs: design/especime-v3/medicoes/ma-2026-10-06/comparacao-alvos.json:12
13. The plant evidence reproduces: the 86 plant rows regenerate byte-for-byte from `plantas-b.json`; every output line of the eight scripts is in the final log; U reads 46/20/26, and all 12 runner plants bit. Refs: relatorio-construtor.md:126, design/especime-v3/medicoes/ma-2026-10-06/portoes-b/verify.log:2898
14. E1 is fixed. The option is renamed, the green line lives inside the call, the clean control requires it, and the real `package.json` is checked next to a plant. Refs: scripts/check-pais.mjs:28, tests/inicio/prazo-pela-celula.mjs:75, tests/inicio/prazo-pela-celula.mjs:30
15. The lock behaves as claimed: the wait names the holder; release is owner-checked; TERM stops the group through `processo.py` before release; stale `.tempos` parts are refused. Refs: scripts/leituras/portoes.sh:34, scripts/leituras/portoes.sh:52, scripts/leituras/portoes.sh:58, scripts/leituras/portoes.sh:83, scripts/leituras/processo.py:39
16. Packaging, shown on a synthetic repository only: the citation check re-derives the expected lines from Git and the report copy; a fault injected at the write fails the normal flow; reduced logs are announced with their sizes; `PACOTE_LOGS=inteiros` keeps logs whole. Refs: scripts/leituras/pacote.py:93, scripts/leituras/pacote.py:204, tests/leituras/pacote-portoes.py:75
17. `custo.py` keeps null and absent counters as null and still catches a regression after a null. Refs: scripts/leituras/custo.py:62, tests/leituras/ferramentas.py:51, tests/leituras/ferramentas.py:61
18. The map's 46-step list equals the diff's chain, and the map check reads 549/0/0/0. Refs: design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:122, design/especime-v3/medicoes/ma-2026-10-06/plantas-b/mapa.log:2
19. No login name or machine path is in any package file, gz files included, and the workflow is not in the diff. Refs: tests/leituras/ferramentas.py:77, relatorio-construtor.md:39, .github/workflows/portao.yml:151

## Code

- `scripts/leituras/portoes.sh`: acceptable at the diff's :30; it is readable, one statement per line, with comments that say why, and its only gap is finding 7.
- `scripts/verify-depois-do-build.mjs`: acceptable, with U intact (:182) and the duplicate key gone (:492), though U cannot see a step removed from `package.json` (:166).
- `scripts/check-briefs.py`: acceptable at the diff's :293, though the run record (:296) and its shape-only validation (:303) are weaker than MA-1 claims.
- `scripts/leituras/limpar-caminhos.py`: now readable and acceptable, except the unanchored pattern at :44.
- `scripts/leituras/custo.py`: acceptable; it is split into small functions whose comments explain why nulls stay null (:62).
- `scripts/leituras/pacote.py`: acceptable, though the writer (:80) and the checker (:112) normalise prefixes differently. I reproduced this: a line starting `▶ ✓` is selected by the writer and not expected by the checker, so the package is refused (failing closed). Separately, :184 repeats the `ls-tree` of :179.
- `tests/acessibilidade/alvos.mjs`: acceptable; `finally` now restores all three globals (:2240).
- `tests/inicio/prazo-pela-celula.mjs`: acceptable; imports come first (:6–14) and the real `package.json` is checked (:30).
- `scripts/check-leituras.py`: acceptable at the diff's :46, apart from finding 7.

Verdict: **acceptable as the foundation**, at the diff's versions of the four diverging lines. For three of them, the sealed hash, U = 46 and the completed lock plant show that the run used the diff's version. For `check-leituras.py:46` the green runs cannot tell. The packaged copies of those four lines must not be what lands.
