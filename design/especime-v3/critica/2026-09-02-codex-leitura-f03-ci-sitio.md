# Leitura a frio do Codex ao bloco F0.3 (a integração contínua do sítio), 02.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 05:46 a 05:55 UTC, sobre um pacote com três plantas (3 de 3 vistas; o registo está no `.plantas.json` ao lado): P1, a aritmética do relatório (449 s de 515 s onde a corrida durou 575 s), apanhada no achado 11; P2a e P2b, o `actions/checkout` fixado por etiqueta e não por SHA, na cópia do fluxo e na linha do diff, apanhada no achado 1. Triagem do lugar de direção: os achados 4, 5, 8, 10, 12, 13, 14 e 15 são reais e consertam-se na segunda passagem; o 3 é de palavras (a CI confere a cabeça de cada push, não cada commit, e os portões seguintes saltam depois de um vermelho, que é o desenho) e fica dito no relatório; o 2 é o passo do lugar de direção depois da fusão (a verificação obrigatória em `main`); o 6 é o bloco F0.4; o 7 conferiu-se pela API do GitHub (as três corridas e o passo vermelho da planta); o 9 é do pacote, não da obra. O texto do leitor fica como veio.*

---

## Blocking

1. **The checkout action violates the mandatory SHA rule.** It uses the mutable tag `actions/checkout@v7.0.1`, not the reported 40-hex SHA. This directly contradicts the house rule and the report’s repeated assertion that all three actions are commit-pinned. `CLAUDE-do-projeto.md:18`; `portao.yml:45`; `diff.patch:51`; `relatorio-construtor.md:62-76`; `relatorio-construtor.md:337-339`.

2. **`main` is not protected yet.** The report explicitly says `main` still accepts pushes until the director manually configures `portao` as required. The package therefore adds observation, not enforcement. `relatorio-construtor.md:345-356`.

3. **It does not run all three gates for every commit or even every triggered run.** GitHub triggers once for a push, not once for every commit inside that push; newer runs on the same ref cancel older ones; and ordinary step conditions skip later gates after an earlier failure. The planted run itself skipped `verify` and `typecheck`. This contradicts the literal “three gates on every push and pull request” claim and cannot enforce the house’s per-commit rule. `CLAUDE-do-projeto.md:18`; `portao.yml:24-26`; `portao.yml:35-37`; `portao.yml:61-69`; `relatorio-construtor.md:195-198`.

## Major

4. **The artifact step does not require both proof files.** `if-no-files-found: error` errors only when the complete path selection finds nothing. If either `dist/prova.json` or `dist/cadeia.json` exists, the upload can succeed with the other missing. The report incorrectly says both “have to be there.” `portao.yml:87-91`; `relatorio-construtor.md:326-333`.

5. **Artifact existence does not prove a green run or necessarily preserve the build’s original proof.** The step runs after `verify` and `typecheck`, but its condition tests only whether `build` succeeded; it can therefore upload during a run made red by either later gate. Moreover, `verify` reruns `gate:html` and `check:cadeia`, so it can overwrite the files created during `build` before upload. `portao.yml:65-89`; `package.json:12`; `package.json:31`; `relatorio-construtor.md:326-333`.

6. **A green `typecheck` proves almost no application type safety.** The command invokes `tsc`, but the supplied configuration lists only selected `.mjs` roots, omits Astro components, and sets `checkJs: false`; JavaScript is not normally type-checked without per-file overrides. The report acknowledges that this gate is effectively empty. `package.json:30`; `tsconfig.check.json:3-14`; `relatorio-construtor.md:132-137`.

7. **The first-green and planted-red claims are not independently proven by this package.** The report supplies URLs and copied prose, but no raw run record, artifact, planted commit patch, or authenticated output; the supplied diff does not contain the plant. If the pasted failure excerpt is genuine, it does identify the immediate cause precisely because `ledger:check` is first and reports the planted value as its sole error. The package cannot establish that the excerpt or “one changed line” assertion is complete. `LEIA-ME.md:3`; `diff.patch:1`; `diff.patch:98`; `diff.patch:105`; `relatorio-construtor.md:99-107`; `relatorio-construtor.md:171-220`; `package.json:12`; `package.json:15`.

8. **The execution environment is not reproducible.** `.nvmrc` floats across every Node 22 patch, while `ubuntu-latest` also floats. The report already records different local and hosted Node patches, so an unchanged commit can later run under different Node, npm, or runner software. `nvmrc.txt:1`; `portao.yml:41`; `portao.yml:50-54`; `package.json:7-9`; `relatorio-construtor.md:36`; `relatorio-construtor.md:80-84`.

9. **The package omits the material needed to audit several claims.** `package-lock.json` and the gate implementations are absent even though the report relies on their exact contents and the workflow invokes them. Consequently, the package cannot verify dependency integrity, proof-file generation, the precise `git rev-parse` use, or whether any gate needs more than shallow history. `LEIA-ME.md:3`; `package.json:12-31`; `relatorio-construtor.md:150-169`.

## Minor

10. **The concurrency rationale is wrong.** Pushes use a branch ref while pull requests use a PR merge ref, so `github.ref` already separates those two runs; `event_name` is redundant for the stated reason. `portao.yml:32-37`; `relatorio-construtor.md:45-51`; `relatorio-construtor.md:322-325`.

11. **The two supplied versions of the report differ, and one has broken arithmetic.** The standalone report says `449 s de 515 s`, while the report embedded in the diff says `449 s de 575 s`; the stated total is 575 seconds. `449/515` is about 87.2%, not 78%; `449/575` is about 78.1%. `relatorio-construtor.md:104-105`; `relatorio-construtor.md:128`; `diff.patch:214-215`; `diff.patch:238-241`.

12. **The claimed log size disagrees with the YAML comment.** The YAML says approximately 2,000 lines; the report claims a measured 11,577. `portao.yml:59-60`; `relatorio-construtor.md:85-88`.

13. **The reported post-step name is editorialized, not exact.** The report says names were read from the API but records `Post O Node (guardar a cache)`; the generated post-step corresponding to the YAML name is `Post O Node`. `portao.yml:50-54`; `relatorio-construtor.md:109-123`.

14. **“20%” does not exactly describe both reported slowdowns.** Build increased about 20.3%, but `verify` increased about 23.9%; together they increased about 20.9%. `relatorio-construtor.md:257-270`.

15. **The cache conclusion is causally unsupported.** The report first attributes broad timing differences to a different shared runner, then attributes the Node/setup delta to cache restoration using only those two uncontrolled runs. That comparison cannot distinguish cache cost from host or network variation. `relatorio-construtor.md:267-281`.

## What is fine

- The YAML is configured for unfiltered `push` and `pull_request`, with a 30-minute timeout. `portao.yml:24-26`; `portao.yml:40-42`.
- A completed green job cannot hide a gate failure through `continue-on-error`; none is configured, and a later successful artifact step does not erase an earlier failure. Cancellation produces a cancelled result, not a false green. `portao.yml:35-37`; `portao.yml:61-84`.
- At YAML level, permissions are read-only, no push or commit command exists, and artifact paths are explicit. `portao.yml:28-30`; `portao.yml:43-91`.
- `setup-node` and `upload-artifact` are syntactically pinned by 40-hex SHAs; the YAML and `.nvmrc` copies match their versions in the patch. `portao.yml:51`; `portao.yml:84`; `diff.patch:57`; `diff.patch:90`; `diff.patch:98-104`.
- The npm cache is not a `node_modules` or `dist` cache, so ordinary stale-cache reuse does not bypass `npm ci`; shallow checkout is also sufficient for reading the current `DECISIONS.md` and resolving `HEAD`, subject to the missing script audit. `portao.yml:44-57`; `package.json:12`; `package.json:28`.

**Distinct findings: 15.**