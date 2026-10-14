# Leitura curta da passagem de correção RH1-d (14.10.2026, à noite)

*Lançada pelo lugar de direção às 17:50 UTC sobre o pacote do sítio de `de3d740b` a `f8006eaa` (a passagem RH1-d do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-RH1-d-2026-10-14.md`), montado por `scripts/leituras/pacote.sh`. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 141 480 símbolos, 39 chamadas de ferramentas, nove minutos. As cinco plantas do lugar de direção (`PLANTAS-RH1-d-2026-10-14.json`, quatro nos hunks do diff e uma no relatório) foram as cinco mordidas: os achados 3 a 7. Os achados 1 e 2 (Major) e 8 e 9 (Minor) são reais e estão decididos no mandato `MANDATO-RH1-e-2026-10-14.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

None.

## Major

1. **The byte-only detector in the diff misses six forms that the RH1-c detector caught, so the report's claims of conservation are false.** I rebuilt the RH1-c `contem_cadeias` from the diff's removed lines and ran both versions on synthetic strings. RH1-c caught all six and RH1-d missed all six:
   - a name that mixes NFC and NFD accents in one string;
   - `&eacute` with no semicolon;
   - `&apos;`;
   - `&ccaron;`;
   - a page `Straße` against a secret written with `ss`;
   - the `ﬁ` ligature.

   Each form is built wholly in NFC or wholly in NFD, and the entities come only from the HTML 4 `codepoint2name` table. No plant covers any of these. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:128, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:150, diff.patch:117, diff.patch:120, relatorio-construtor.md:139, relatorio-construtor.md:206

2. **A secret whose entries are separated by CR, U+2028, U+2029, NEL, VT, FF or RS now silently merges into one entry; RH1-c refused all seven.** `Pessoa Sintética Um\rOutra Sintética Dois` reads as one string, and a page naming only the first person passes. The known-positive plants `segredo[:1]`, which is that merged string, so it still bites. The diff deletes the refusal tests for the three separators, and RH1-13 does not mention the merge. diff.patch:15, diff.patch:2696, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:194, relatorio-construtor.md:205

3. **The copied `contem_cadeias` searches `corpo`; the diff searches `corpo.lower()`.** With the copy, plain UTF-8 `Pessoa Sintética Exemplo` is not detected (I ran it), and the RH1-d plants go red. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:186, diff.patch:124

4. **The copied trie loop encodes only UTF-8 and Latin-1; the diff has all four encodings.** With the copy, a lowercase name in UTF-16-LE is missed, a regression against RH1-c. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:153, diff.patch:79

5. **The copied `_ler_proibidos` uses `split(' ')`, which collapses nothing; the diff uses `split()`.** With the copy, the RH1-c Major is not fixed: a secret with U+00A0 stays as written, a tab is refused, and `privacidade-rh1d.py` exits 1. The diff version passes 88 of 88. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:62, diff.patch:15

6. **The copied harmless-control plant always bites (`'mordeu': True`); the diff calls `recusar_rastreado`.** The blind-detector test asserts only `not all(...)`, so it cannot catch a plant that always passes. scripts/check-privacidade.py:287, diff.patch:2683, tests/leituras/privacidade-rh1d.py:62

## Minor

7. **The report copy gives the isolated time after the change as 45,6 s; the measurement is 54,6 s.** `custo-d.json` (which I reproduced byte for byte with the report's own command), `tempo-depois-d.json` and the committed `RELATORIO.md` all say 54,6. relatorio-construtor.md:157, design/especime-v3/medicoes/rh1-2026-10-14/custo-d.json:4, design/especime-v3/medicoes/rh1-2026-10-14/tempo-depois-d.json:12, design/especime-v3/medicoes/rh1-2026-10-14/RELATORIO.md:157

8. **The command the report lists for `tempo-antes-d.log` did not write it.** That log holds the full result, but `medir-d.py` prints only `cabeca`, `passou` and `segundos`, the shape of `tempo-depois-d.log`. The report admits a temporary wrapper produced the 367,6 s, and that wrapper is not in the package. Each time is a single run. relatorio-construtor.md:152, relatorio-construtor.md:167, design/especime-v3/medicoes/rh1-2026-10-14/tempo-antes-d.log:1, design/especime-v3/medicoes/rh1-2026-10-14/medir-d.py:60

9. **Two report claims cannot be checked from the package: the RH1-d audit's 112 files, and the `git show` check of the RH1-c references.** The package's measurement folder holds 110 files and none of the ignored `alvos.json`. Nothing records when the audit ran relative to `portoes-d`, and the `git show` output is not included. design/especime-v3/medicoes/rh1-2026-10-14/auditoria-entrega-d.json:2, relatorio-construtor.md:145, relatorio-construtor.md:193

## «What is fine»

10. I rebuilt the diff version: the test passes 88 of 88, all 49 new gate plants bite, and the harmless control stays green (diff.patch:2656).
11. 367,6, 371,6, 59,9 and 119,9 match their sources (design/especime-v3/medicoes/rh1-2026-10-14/tempo-antes-d.json:12, design/especime-v3/medicoes/rh1-2026-10-14/portoes-c/verify.log:8242, design/especime-v3/medicoes/rh1-2026-10-14/portoes-d/verify.log:5015, design/especime-v3/medicoes/rh1-2026-10-14/portoes-b/verify.log:7970).
12. The counts 87, 26, 24 588 and 14 798 match, and all three gate codes are 0 (design/especime-v3/medicoes/rh1-2026-10-14/portoes-d-resumo.json:22, design/especime-v3/medicoes/rh1-2026-10-14/portoes-d/verify.codigo:1).
13. The corrected references point to the right lines (design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py:44, tests/leituras/privacidade-rh1c.py:58, design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py:57).
14. The expression has no empty root alternative. Empty strings are skipped, an empty tree compiles to `(?!)`, and the Latin-1 fallback skips only the literal (design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:147, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:173, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:120).
15. `--auditar c` logged 78 files and passou=true, and the rerun left `auditoria-entrega-c.json` byte-identical (design/especime-v3/medicoes/rh1-2026-10-14/auditoria-c-reproduzida-d.log:1).
16. I grepped for the account name, home prefixes and worktree markers and found no personal strings. The only match was the synthetic `/Users/CONTA-DE-ENSAIO/`, and grep matched my known-positive test string (tests/leituras/privacidade-jd1.py:51).

**not yet:** Majors 1 and 2 weaken a gate that protects a person, and Majors 3–6 mean the copied files are not the head that was measured.
