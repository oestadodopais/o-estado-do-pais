# Leitura a frio do Codex ao bloco F0.4 (o typecheck a valer), 03.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 09:11 a 09:25 UTC, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, o `checkJs` de volta a `false`, na cópia do programa e no diff, apanhada no Blocking 1; P2a e P2b, a guarda do `corpoR` nulo retirada, apanhada no Blocking 2 (o Blocking 3, o hunk malformado, é a marca dessa planta no diff); P3, a tabela do relatório a dizer que ficam 5 erros, apanhada no Minor 19. Triagem do lugar de direção: os Major 4 a 18 e os Minor 20 e 21 (a parte da versão do TypeScript) são reais e consertam-se na segunda passagem; a leitura tem razão em que um portão de tipos que fecha 526 erros com 43 `any` e com moldes afirmados antes da validação prova menos do que diz, e é isso que a segunda passagem corrige. O texto do leitor fica como veio.*

---

# Blocking

1. **The gate is still disabled.** `npm run typecheck` invokes this config, but it contains `"checkJs": false`; the patch even replaces `false` with `false` immediately below “LIGADO”. Therefore the target `.mjs` files are included but not checked unless they individually contain `// @ts-check`. The report says only `astro.config.mjs` does, so a planted error in `ledger.mjs` cannot demonstrate the supplied gate. `package.json:32`, `tsconfig.check.json:19-25`, `tsconfig.check.json:37-41`, `diff.patch:3889-3891`, `relatorio-construtor.md:7-15`, `relatorio-construtor.md:166-190`.

2. **The claimed null-dereference fix is absent.** `corpoR` can be `null`; the code guards only the two heads and then reads `corpoR.inicio`. The advertised `if (!corpoR) return ...` appears only in the report. The real defect therefore remains. `documentos.mjs:958-968`, `relatorio-construtor.md:93-113`, `diff.patch:1594-1604`.

3. **`diff.patch` is malformed at exactly the missing guard.** Its hunk header promises 12 post-image lines but the body contains 11. Subsequent `documentos.mjs` hunk offsets are consequently one line ahead. This patch is not reliable/applicable evidence of the branch. `diff.patch:1593-1605`.

# Major

4. **Only the include/exclude surface is as described.** It includes both configs and the three requested source trees; its exclusion is narrow and does not swallow a directory. But `strict` is absent and the config extends an unsupplied `./tsconfig.json`, not Astro’s strict config directly, so `strict: true` is `[verify]`. The package also supplies no audit for pre-existing `// @ts-nocheck`; the report searched only for `@ts-check`. `tsconfig.check.json:2`, `tsconfig.check.json:19-41`, `LEIA-ME.md:3`, `relatorio-construtor.md:14-15`, `relatorio-construtor.md:66`.

5. **The “five runtime refactors; everything else comments” inventory is false.** There are 63 JavaScript hunks changing executable lines.

   Cast/parenthesis/reflow-only hunks, with no runtime value, error or byte change, are at `diff.patch:447,475,495,518,586,611,627,643,659,696,712,742,918,1279,1425,1555,1813,1828,1968,2335,2372,2491,2500,2509,2518,2527,2544,2553,2562,2575,2674,2699,2759,2792,2819,2840,2855,2894,3058,3092,3170,3239,3312,3440,3461`.

   The other 18 are structural refactors:

   - Locals or equivalent return values: `diff.patch:570-578`, `diff.patch:1538-1552`, `diff.patch:1649-1658`, `diff.patch:2436-2448`, `diff.patch:2865-2878`, `diff.patch:3354-3374`.
   - Function/helper changes dependent on stated invariants: `diff.patch:1516-1534`, `diff.patch:3200-3217`, `diff.patch:3248-3262`, `diff.patch:3340-3348`, `diff.patch:3385-3392`, `diff.patch:3419-3436`.
   - Changes that can alter an edge result or thrown error: property getters are now read a different number of times in `alojamentoCompleto`; raw-object handling and optional chaining change malformed-input failure paths. `diff.patch:2049-2080`, `diff.patch:2172-2229`, `diff.patch:2452-2487`.

   Of the named five, `recusa` is equivalent at the supplied call order, `return doc` is the same reference as `CACHE`, and `loadClaims` is equivalent for valid plain objects. `alojamentoCompleto` is not universally equivalent for getter-bearing objects. `aberta(ctx)` is equivalent only while its two-state-field invariant holds, which the report itself says is represented inconsistently. `documentos.mjs:766-768`, `documentos.mjs:801-803`, `relatorio-construtor.md:70-78`, `relatorio-construtor.md:119`.

6. **“Identical file by file” is contradicted by the report and unsupported by artefacts.** It records two differing files, then supplies only one normalized timestamp excerpt and none of the 11,420 hashes. Thus current-output equivalence cannot be independently established, and literal file-by-file identity is false. `relatorio-construtor.md:121-147`, `LEIA-ME.md:3`.

7. **`Linha` is asserted before validation.** Any non-null object, including an array or an object missing every required field, is cast to `Linha`, assigned into `Map<string,Linha>`, and used through `doc.id`. This masks precisely the malformed-data class a type gate should expose. `diff.patch:2190-2229`, `tipos.d.ts:92-120`.

8. **Values are typed as valid while the following lines explicitly validate that they may be invalid.**

   - Verification elements are cast to `VerificacaoDaLinha` after checking only that the container is an array. `diff.patch:2177-2184`, `tipos.d.ts:64-72`.
   - Each `calc.files` element is cast to an object immediately before testing for null, primitive or array. `diff.patch:2491-2499`.
   - Each correction is cast to `CorrecaoDaLinha` immediately before the same invalid-value test. `diff.patch:2518-2526`.

9. **`CorrecaoDaLinha` has demonstrable schema drift.** The declaration contains plural `fields?: string[]`, while the validator requires and reads singular `corr.field`. Its open index signature plus a string cast conceal the mismatch. Nothing supplied produces or reads `fields`. `tipos.d.ts:75-83`, `diff.patch:2527-2535`.

10. **Raw JSON is repeatedly declared as trusted shapes without runtime validation.** `pais.json` and district files become `PaisDoMapa`/`DistritoDoMapa`; record JSON is returned as `RegistoDeConteudo`; the manifest type promises `exporter` and `origin`, although only `registos` is checked. `diff.patch:2671-2713`, `diff.patch:3350-3374`, `diff.patch:3426-3447`, `tipos.d.ts:173-178`, `tipos.d.ts:305-317`.

11. **`evaluateCheck` declares `claims` optional and then casts a possibly absent value to a `Map`.** The new comment explicitly admits that the documented call crashes. That is an annotation hiding a bad contract, not a narrowing. `diff.patch:2351-2357`, `diff.patch:2373-2378`.

12. **`cartaoDoEstudo` casts `null` to `string`.** Its parameter explicitly permits null, and there is no guard before the cast. Runtime happens to return null after `Map.get(null)` misses, but the annotation is false. `diff.patch:918-930`.

13. **Optional `parcela` values are cast to strings.** `UnidadeDoMapa.parcela` is optional, yet all units are mapped through `/** @type {string} */ (u.parcela)`. This hides `undefined` from the checker. `tipos.d.ts:288-296`, `diff.patch:2768-2776`, `diff.patch:2792-2799`.

14. **The `Decimal` casts are not justified for an empty marker.** `MarcaDaExpressao` accepts any string, including `''`; truthiness then fails to recognize it as a marker and the object is cast to `Decimal` before calling `fn`. `diff.patch:2314-2317`, `diff.patch:2327-2342`.

15. **The internal types permit states the renderer assumes cannot exist.** `SaidaPendenteDoRegisto` allows neither or both of `selo` and `porta`, but the renderer treats “no selo” as proving a string `porta`. `ContextoDoRegisto.ligacaoAberta` is typed as any interval node or null, then cast to a non-null link node based on a separate counter. These invariants are not encoded. `tipos.d.ts:180-184`, `tipos.d.ts:210-213`, `tipos.d.ts:235-241`, `diff.patch:3204-3217`, `diff.patch:3241-3262`.

16. **A material portion of the 526 errors was closed by explicit `any`, not useful types.** Forty-three added lines introduce `any`; the most damaging are the translation object, agenda structures, dynamic records, map manifest and ledger validation values. These areas will not catch misspelled properties or incompatible shapes. `diff.patch:361,452,523,603,687,704,751,755,763,767,774,784,787,813,837,1025,1753,1763,1771,1964,1973,1979,1996,1997,2203,2216,2496,2567,2583,2587,2678,2688,2824,2851,2861,2877,2899,2988,3004,3359,3366,3436,3445`.

17. **`tipos.d.ts` is a manually duplicated schema with no coupling to its authorities.** It admits that `Linha` copies the ledger’s 24-field list, and `Lingua` independently repeats the language set represented by runtime tables. Route keys are not duplicated, but are instead weakened to a generic nested record, so route-specific drift is also not caught. `tipos.d.ts:13-20`, `tipos.d.ts:92-120`, `documentos.mjs:85-92`, `diff.patch:3453-3459`.

18. **The governed-text exception is only conditionally sound.** Excluding exactly `sobre.mjs` avoids modifying stamped bytes, but stamping proves byte identity, not type correctness. The package omits `sobre.mjs`, `DECISIONS.md` and the checking script, so the claimed stamp and “nobody in the program imports it” are `[verify]`; moreover, TypeScript exclusions do not stop an excluded file re-entering through an import. `tsconfig.check.json:27-36`, `relatorio-construtor.md:149-162`, `LEIA-ME.md:3`.

# Minor

19. **The copied report disagrees with the report embedded in the patch and with its own table.** The five directory rows all end at zero; the copied total says five, while the patch’s copy says zero. `relatorio-construtor.md:31-40`, `diff.patch:37-46`.

20. **The 45-file arithmetic does not follow from the report’s stated changes.** Starting from 74, removing 28 scripts, excluding one governed file and adding one declaration file yields 46, not 45. More importantly, `--listFiles` proves membership, not that `checkJs` checked those files. `relatorio-construtor.md:194-203`, `tsconfig.check.json:19-41`.

21. **The package does not establish CI wiring or the measured Astro/TypeScript environment.** `build` and `verify` do not invoke `typecheck`; the workflow cited by the report is absent. TypeScript is a caret range rather than an exact version, and neither the lockfile nor Astro-check output is supplied. `package.json:12`, `package.json:32-45`, `relatorio-construtor.md:216-243`, `relatorio-construtor.md:267-275`, `LEIA-ME.md:3`.

## What is fine

- The intended include list and narrow `sobre.mjs` exclusion are explicit; `scripts` and `.astro` are deliberately outside this stage. `tsconfig.check.json:13-36`.
- `npm run typecheck` points at the intended config, and `astro check` is indeed neither a script nor a dependency. `package.json:10-45`.
- `recusa` really always throws, and `return doc` follows `CACHE = doc`, so those two local refactors are valid in the supplied code. `documentos.mjs:764-768`, `diff.patch:3369-3374`.
- `tipos.d.ts` is declaration-only and its supplied copy matches the new-file body represented in the patch. `tipos.d.ts:1-17`, `diff.patch:3470-3475`.

**Count: 21 distinct findings.**