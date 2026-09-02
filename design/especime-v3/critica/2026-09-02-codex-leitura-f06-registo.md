# Leitura a frio do Codex ao bloco F0.6 (o portão dos números do registo), 02.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 20:58 a 21:08 UTC, sobre um pacote com quatro plantas de três classes (4 de 4 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, a isenção de uma data igual à de hoje religada contra o cabeçalho do próprio portão, na cópia e na linha do diff, apanhada no Blocking 1 e nas suas consequências no Blocking 2; P2, o relatório a dizer que o portão lê as últimas dez secções do `DECISIONS.md`, apanhada no Major 8; P3, a `VISAO.md` da cópia a voltar a dizer «2 602 linhas» sem data, apanhada no Blocking 2. Triagem do lugar de direção: o Blocking 3 (a variável da cópia como desvio na construção), o Blocking 4 (a gramática das isenções injetável), e os Major 5, 6, 7, 10, 11, 12 e o Minor 13 são reais e consertam-se na segunda passagem; o Major 8, tirada a planta, fica na deteção do título do plano; o Major 9 é do pacote. Nota para o bloco F4.2: a classe do Blocking 3 (uma variável `OEDP_*` honrada em silêncio pela construção) existe nos outros portões da casa e confere-se lá. O texto do leitor fica como veio.*

---

## Blocking

1. **The “date equal to today remains current” rule is not implemented.** The script computes `hoje`, but forms (i) and (ii) return a dated object unconditionally; the caller then skips every such assertion without comparing its date to `hoje`. Therefore a wrong value stamped `02.09.2026` passes on 02.09.2026, directly contradicting the header and report. `check-registo.mjs:377`, `check-registo.mjs:408`, `check-registo.mjs:413`, `check-registo.mjs:607`, `relatorio-construtor.md:26`

2. **The three supplied documents are not green.** Using the package’s stated measured values:

   - `VISAO.md`: `2 916 linhas` is wrongly skipped as dated-today; the quoted `2 602 linhas` is skipped by (iii-a); `2 602 linhas` at line 35 is current and fails against 2 916; `doze estudos` passes. Result: 2 current, 2 skipped, 1 error. `VISAO.md:23`, `VISAO.md:35`, `VISAO.md:38`, `LEIA-ME.md:3`, `relatorio-construtor.md:56`
   - `README.md`: the four correct dated-today assertions are wrongly skipped: 15 steps, 2 916 lines in the rule example, 16 documents, and 2 916 CSV lines. The two quoted 132-line values are also skipped. The six current assertions that pass are the three occurrences of 308 concelhos, eight editions with records, sixteen archive editions, and twelve works. Result: 6 current, 6 skipped, 0 errors. `README.md:30`, `README.md:42`, `README.md:87`, `README.md:184`, `README.md:246`, `README.md:261`, `README.md:262`, `README.md:321`, `README.md:338`, `relatorio-construtor.md:54`, `relatorio-construtor.md:55`, `relatorio-construtor.md:56`, `relatorio-construtor.md:57`, `relatorio-construtor.md:58`, `relatorio-construtor.md:60`, `relatorio-construtor.md:61`
   - `PENDENTES-DO-DIRETOR.md`: eight reading pages and 308 concelhos pass; `58 567 pessoas` passes because the block contains the existing row whose supplied value and unit match. Result: 2 current, 1 site value, 0 errors. `PENDENTES-DO-DIRETOR.md:9`, `PENDENTES-DO-DIRETOR.md:21`, `LEIA-ME.md:3`
   - Aggregate for the three copies: **10 current, 8 skipped, 1 site value, 1 error**, not green. The report claims 15 current, 3 skipped and no errors for these three. `relatorio-construtor.md:82`, `relatorio-construtor.md:83`, `relatorio-construtor.md:84`
   - The cause of the red copy is also a package inconsistency: the patch changes line 35 to `2 916`, but the supplied `VISAO.md` still contains `2 602`. `diff.patch:135`, `diff.patch:136`, `VISAO.md:35`

3. **`OEDP_REGISTO_DIR` is a production bypass, not merely a test seam.** `npm run build` inherits the variable, and the gate will inspect an arbitrary clean copy instead of the repository’s governing documents; it only prints a warning. A supplied five-file shadow tree can therefore make a build pass while the real documents remain wrong. `check-registo.mjs:172`, `check-registo.mjs:173`, `check-registo.mjs:504`, `check-registo.mjs:692`, `package.json:12`, `package.json:16`

4. **The exemption and subset grammar can be injected to make wrong current claims pass.**

   - Form (i) accepts any `a dd.mm.aaaa` found anywhere in the next 60 characters, including an unrelated or future date; it does not require immediate attachment. `check-registo.mjs:408`, `check-registo.mjs:410`
   - Form (ii) accepts any full date, or even a short `dd.mm`, inside the surrounding parenthesis; an unmatched opening parenthesis extends the exemption to the end of the block. `check-registo.mjs:413`, `check-registo.mjs:417`, `check-registo.mjs:420`
   - Form (iii-a) can be activated with `dizia`, `diziam`, `era`, `eram`, `tinha` or `tinham` within 20 characters before an opening quote. Form (iii-b) allows the historical word anywhere in the preceding 15 characters, not “logo a seguir” as reported. `check-registo.mjs:371`, `check-registo.mjs:395`, `check-registo.mjs:403`, `relatorio-construtor.md:23`, `relatorio-construtor.md:24`
   - Appending `em 2 916` makes the gate discard the written numerator and compare only the denominator. Thus even `999 linhas em 2 916` passes. `check-registo.mjs:425`, `check-registo.mjs:427`, `check-registo.mjs:603`, `check-registo.mjs:604`

## Major

5. **The number grammar has straightforward false-negative forms.** Words are recognized only from three to twenty; one, two, compounds such as “vinte e um”, and words above twenty are invisible. The digit grammar accepts unsigned integers only: dotted or comma-separated thousands, decimals and negative values escape both fact and site-value checks. The matcher also requires the number before the fact word, so “os estudos são 11” is invisible. `check-registo.mjs:332`, `check-registo.mjs:337`, `check-registo.mjs:343`, `check-registo.mjs:345`, `check-registo.mjs:361`, `check-registo.mjs:449`, `check-registo.mjs:453`

6. **Wrapped-block handling is not what the header and report describe.** Ordinary paragraph lines are joined, but a list item, heading or blockquote line is closed immediately; its wrapped continuation becomes another block. Splitting the number and fact word across that boundary defeats detection and can also separate a site value from its ID. Fenced code is skipped completely, and an unclosed triple-backtick fence silently suppresses the remainder of the document. `check-registo.mjs:87`, `check-registo.mjs:89`, `check-registo.mjs:554`, `check-registo.mjs:559`, `check-registo.mjs:564`, `check-registo.mjs:571`, `relatorio-construtor.md:28`

7. **A row ID is not tied to the claim or subject beside it.** The script gathers every existing ID anywhere in the block and accepts the first whose value and unit match. An unrelated row for another subject with the same value and unit therefore validates the quoted claim; two claims and two IDs can also cross-validate regardless of order. An ID with a genuinely different value does fail, and a nonexistent ID is filtered out and treated as absent. `check-registo.mjs:458`, `check-registo.mjs:644`, `check-registo.mjs:645`, `check-registo.mjs:649`

8. **Document scope is contradictory and incomplete.** The code reads exactly five files and excludes `DECISIONS.md`; the supplied report says at line 46 that the last ten decision sections are read, but later says `DECISIONS.md` is excluded. The patch contains the exclusion wording, so the report copy also disagrees with its own patch. The plan is checked only up to an exact `## 2 · ` heading, and any new governing document is unchecked. `check-registo.mjs:504`, `check-registo.mjs:509`, `relatorio-construtor.md:46`, `relatorio-construtor.md:201`, `diff.patch:206`, `relatorio-construtor.md:203`

9. **The package cannot support the report’s measurement and coverage claims.** It supplies only three of the five documents the script reads and none of the source datasets or modules used to establish seven of the eight values and the 34-unit vocabulary. Consequently the CLAUDE/PLAN counts, timings, CI result, unit count and source measurements are assertions, not independently reviewable evidence here. `LEIA-ME.md:3`, `check-registo.mjs:159`, `check-registo.mjs:190`, `check-registo.mjs:504`, `relatorio-construtor.md:9`, `relatorio-construtor.md:40`, `relatorio-construtor.md:78`, `relatorio-construtor.md:193`

10. **“Each fact is measured twice” is false.** Steps and reading pages have neither a `segunda` measurement nor a ledger row; they are measured once. Only three facts have `segunda`, while four others are reconciled to ledger rows. `relatorio-construtor.md:63`, `check-registo.mjs:229`, `check-registo.mjs:237`, `check-registo.mjs:246`, `check-registo.mjs:274`, `check-registo.mjs:287`, `check-registo.mjs:295`, `check-registo.mjs:307`, `check-registo.mjs:315`

11. **The known-positive paths exist, but they are not an adequate or durable test suite.** Cases a–d would reach the relevant error paths on a clean tree; e passes, but matches form (i) before form (ii), so it does not test the parenthesis-only rule; f is only a baseline. Neither e nor f proves that any document assertion was checked, because success has no minimum count invariant. The package does not contain the claimed `positivos.py`, so its replacement and diagnostic assertions cannot be reviewed; checking exit 1 alone can pass because of an unrelated global measurement error. `relatorio-construtor.md:137`, `relatorio-construtor.md:141`, `relatorio-construtor.md:146`, `LEIA-ME.md:3`, `check-registo.mjs:307`, `check-registo.mjs:408`, `check-registo.mjs:413`, `check-registo.mjs:705`, `check-registo.mjs:738`

12. **The “no silent rewrite” claim is false.**

   - “oito edições” becomes “oito edições com registo” with no date or quoted former wording. `diff.patch:96`, `diff.patch:98`, `README.md:246`
   - The archive sentence changes thirteen editions to sixteen and ten works to twelve, but records only one bare `dizia «treze»`; the former ten works and second thirteen are lost. `diff.patch:106`, `diff.patch:109`, `README.md:261`, `README.md:262`
   - The JSON-per-row correction acknowledges the old state but paraphrases it instead of quoting the old text. `diff.patch:141`, `diff.patch:142`, `VISAO.md:40`
   - The Vercel edit silently removes `(privados)` and the former “public at launch” status while quoting only “falta religar o Vercel”. Worse, the resulting sentence says the repository has been public since 01.09 and still says it will be public at launch. `diff.patch:150`, `diff.patch:151`, `VISAO.md:49`
   - The report nevertheless states that all twelve corrections used the house form and none was silent. `relatorio-construtor.md:13`, `relatorio-construtor.md:103`

## Minor

13. **The report contains further mechanically checkable inaccuracies.** It says the wrong Évora value is refused “twice”, but V2 is deduplicated when V1 already found the occurrence and only one error is added. Its README correction locations are also stale: reported lines 155, 218 and 233 are now lines 181, 246 and 261. `relatorio-construtor.md:123`, `relatorio-construtor.md:124`, `relatorio-construtor.md:125`, `relatorio-construtor.md:173`, `check-registo.mjs:636`, `check-registo.mjs:640`, `check-registo.mjs:647`, `README.md:181`, `README.md:246`, `README.md:261`

## What is fine

- The build and verify chains both include the new gate immediately after `ledger:check`, and the supplied build chain contains fifteen commands matching the README list. `package.json:12`, `package.json:16`, `package.json:32`, `README.md:30`, `README.md:33`, `README.md:97`
- Missing listed documents cause an immediate failure. `check-registo.mjs:531`, `check-registo.mjs:538`
- The four documented space-like thousands separators and unseparated integers are normalized consistently. `check-registo.mjs:175`, `check-registo.mjs:180`
- The corrected Évora sentence has the supplied existing ID, value and unit in the same block. `PENDENTES-DO-DIRETOR.md:21`, `LEIA-ME.md:3`
- The corrections at `VISAO.md:23`, `README.md:30`, `README.md:181` and `PENDENTES-DO-DIRETOR.md:21` preserve the former value or wording with a date. `VISAO.md:23`, `README.md:30`, `README.md:181`, `PENDENTES-DO-DIRETOR.md:21`

**Distinct findings: 13.**