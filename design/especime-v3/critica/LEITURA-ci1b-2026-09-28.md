# A releitura a frio da passagem CI1b (a corrida «portão» em metade do tempo) · Codex gpt-5.6-sol, 28.09.2026

*O pacote: o sítio de `26971885` a `6711f190`, sem páginas construídas (o bloco não muda nenhuma, e a prova byte a byte está nos manifestos); cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-ci1b-2026-09-28.plantas.json`. A leitura achou as cinco plantas (os achados 1, 2, 3, 4 e 6) e acertou a conta da terceira: a folga plantada é de 48 horas, e não de um dia, como a descrição do registo dizia (o registo diz agora 48 horas). Custo: 256 269 símbolos, das 21:59 às 22:11 UTC. O achado 5 é o que faltava ao pacote e cabia ao lugar de direção, que só ele publica ramos: a segunda corrida medida (a 36489174336, na cabeça `078186df`: 9,9 minutos, as três células verdes) e a planta vermelha no GitHub (a 36489295961, num ramo para deitar fora, apagado a seguir: o `check:css` a falhar de propósito no grupo fechou a célula U e deixou o `portao` vermelho, com as outras conferências todas corridas) acabaram às 22:05 UTC e estão em `design/especime-v3/medicoes/ci1-2026-09-28/evidencias/lugar-de-direcao/`, lidas na API com o guião do bloco.*

## Blocking

1. **The required `portao` check can remain green when the entire post-build verification step fails because the workflow appends `|| true`.** The shell therefore converts every nonzero exit from `verify:depois-do-build` into success, so `typecheck` and the proof upload can continue. This directly contradicts the report’s statement that a red grouped check makes the job red, and the missing hosted red plant would have exposed it. The copied workflow is also not the blob named by the diff: removing only `|| true` produces the diff’s advertised `64b73a1b` blob.

.github/workflows/portao.yml:151, .github/workflows/portao.yml:152, .github/workflows/portao.yml:154, .github/workflows/portao.yml:180, relatorio-construtor.md:18, relatorio-construtor.md:29, diff.patch:2

2. **The copied D cell accepts a file that was written and restored, so its mandatory write-and-restore plant fails and the runner aborts before launching any real check.** After comparing bytes and inode, the packaged code tests only size and never compares `escrito`, even though the snapshot records the modification time. The planted command rewrites the same inode with the same final bytes and size, precisely the case that this copied cell now returns green; the diff contains the missing `x.escrito !== y.escrito` condition. The stored claim that this plant bit cannot have been produced by the copied runner, and `principal()` exits before the 16 real checks whenever a plant does not bite.

scripts/verify-depois-do-build.mjs:187, scripts/verify-depois-do-build.mjs:198, scripts/verify-depois-do-build.mjs:250, scripts/verify-depois-do-build.mjs:252, scripts/verify-depois-do-build.mjs:424, scripts/verify-depois-do-build.mjs:465, scripts/verify-depois-do-build.mjs:516, scripts/verify-depois-do-build.mjs:518, diff.patch:16973, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/plantas-verify-depois.json:34

3. **The copied C cell allows proof files up to 48 hours older than the build stamp, so its one-hour-stale `cadeia.json` plant also fails and the runner again stops before the real checks.** The comment and report say two seconds, but `2000 * 60 * 60 * 24` milliseconds is 48 hours; the diff specifies `2000`. The plant makes `cadeia.json` one hour old while the build stamp is one minute old, which is not older than the copied cell’s 48-hour cutoff. The recorded 12-of-12 result therefore contradicts the packaged source.

scripts/verify-depois-do-build.mjs:288, scripts/verify-depois-do-build.mjs:300, scripts/verify-depois-do-build.mjs:308, scripts/verify-depois-do-build.mjs:312, scripts/verify-depois-do-build.mjs:480, scripts/verify-depois-do-build.mjs:484, diff.patch:17021, relatorio-construtor.md:134, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/plantas-verify-depois.json:46

## Major

4. **`design:feixe` is not isolated in the copied runner and will run inside the parallel group, contrary to mandate item 1 and the report.** `DEPOIS_DO_GRUPO` is empty, and the real run passes that default into `ordemDeArranque`; the diff instead contains `['npm run design:feixe']`. The ordering plant does not protect the real configuration because it injects its own non-empty `depoisDoGrupo` list. The stored run showing the bundle in phase `depois` was consequently produced from a different runner than the copied one.

scripts/verify-depois-do-build.mjs:117, scripts/verify-depois-do-build.mjs:124, scripts/verify-depois-do-build.mjs:148, scripts/verify-depois-do-build.mjs:372, scripts/verify-depois-do-build.mjs:488, scripts/verify-depois-do-build.mjs:490, diff.patch:16865, relatorio-construtor.md:133, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/verify-depois-final.resultado.json:178

5. **The hosted-CI acceptance test remains incomplete: the package contains one measured GitHub run, not two, and no hosted red-check plant.** The brief requires two runs and a grouped failure that makes `portao` red. The report explicitly leaves both the second run and the red plant undone, while the only hosted-run record contains one entry. Thus the speed result has only one hosted observation and failure propagation was never demonstrated where it matters.

brief.md:24, brief.md:31, relatorio-construtor.md:162, relatorio-construtor.md:174, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/corrida-36475236795.json:9

## Minor

6. **The root builder report says the same GitHub run lasted both 7.97 and 8.97 minutes, and only 8.97 is supported.** The stored run spans 19:52:29 to 20:01:27 and records 8.97 minutes; `medidas.json` also records 8.97. The packaged `LEIA-ME.md` has 8.97, while `relatorio-construtor.md` alone was changed to 7.97, and the supplied number-check transcript names `LEIA-ME.md`, not the altered root copy.

relatorio-construtor.md:162, design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md:162, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/corrida-36475236795.json:16, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/corrida-36475236795.json:18, design/especime-v3/medicoes/ci1-2026-09-28/medidas.json:798, numeros-do-relatorio.txt:1

## «What is fine»

7. **The four stored manifest comparisons are reproducible from the five compressed manifests and each yields 12,484 files on both sides with zero non-stamp differences.** design/especime-v3/medicoes/ci1-2026-09-28/comparar-dist.mjs:85, design/especime-v3/medicoes/ci1-2026-09-28/comparar-dist.mjs:105, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/comparar-manifestos-A1-A2.json:24, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/comparar-manifestos-A1-B1.json:24, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/comparar-manifestos-A1-final.json:24, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/comparar-manifestos-A1-final-ci1b.json:24

8. **The real-build parity evidence shows the intact copy wrote 7,422 HTML files and the Portuguese-only key made Astro exit 1 on `/404` with zero completed pages and zero HTML files.** design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/paridade-na-construcao.json:18, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/paridade-na-construcao.json:21, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/paridade-na-construcao.json:27, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/paridade-na-construcao.json:40, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/paridade-na-construcao.json:43

9. **The package chains still contain 21 build steps and 33 manual-verify steps with 17 exact overlaps, and the recorded U result reports the corresponding 17 plus 16 split.** package.json:12, package.json:44, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/verify-depois-final.resultado.json:190, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/verify-depois-final.resultado.json:192

10. **The stored inventory is internally complete for its declared probe: it contains 16 checks, reports zero cross-read/write pairs and zero other readers of `design-system/`, and binds the compressed raw lists by SHA-256.** design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/inventario.json:857, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/inventario.json:859, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/inventario.json:861, design/especime-v3/medicoes/ci1-2026-09-28/evidencias/ci1b/inventario.json:871

11. **The workflow’s job identifier is still exactly `portao`, and build, post-build verification and typecheck remain in that order.** .github/workflows/portao.yml:68, .github/workflows/portao.yml:69, .github/workflows/portao.yml:134, .github/workflows/portao.yml:151, .github/workflows/portao.yml:154
