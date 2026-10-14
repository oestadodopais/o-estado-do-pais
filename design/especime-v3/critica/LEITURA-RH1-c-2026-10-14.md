# Leitura curta da passagem de correção RH1-c (14.10.2026, ao início da noite)

*Lançada pelo lugar de direção às 17:06 UTC sobre o pacote do sítio de `5c48da4c` a `5dc59f27` (a passagem RH1-c do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-RH1-c-2026-10-14.md`), montado por `scripts/leituras/pacote.sh`. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 150 907 símbolos, 34 chamadas de ferramentas, nove minutos. As cinco plantas do lugar de direção (`PLANTAS-RH1-c-2026-10-14.json`, quatro nos hunks do diff e uma no relatório) foram as cinco mordidas: os achados 2 a 6. O achado 1 (Major) e os 7 a 9 (Minor) são reais e estão decididos no mandato `MANDATO-RH1-d-2026-10-14.md`; o 7 é um achado de custo (a conferência triplicou de tempo) que a passagem seguinte mede antes e depois. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

None.

## Major

1. **Space variants in the middle of a name still let a name through silently, the same way the BOM did in finding 6.** I loaded the diff's version in memory and tested synthetic strings. A secret `Pessoa Exemplo` (or one with a double space) is kept as written. The known-positive plants those same bytes and bites, but a page with an ordinary space passes. A clean secret also misses a page that writes `Pessoa&nbsp;Exemplo`, because `&nbsp;` decodes to U+00A0 and U+00A0 is never treated as a space. No plant covers this. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:61, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:66, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:128, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:140

2. **The copied `contem_cadeias` compares only `binarios[:1]`; the diff compares every byte form.** With the copy, the UTF-16 and Latin-1 forms are never checked, and neither are the byte forms of the second and later strings. I ran the copy: `ramo-pessoal-utf-16-le`, `-utf-16-be` and `-latin-1` turn red, so the gate would fail closed. The copy still contradicts report row 8. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:124, diff.patch:68, relatorio-construtor.md:101

3. **The copied `_ler_proibidos` strips a BOM only at the end (`^[\s]+`); the diff strips it at both ends.** With the copy, a leading BOM is refused instead of removed. `plantas_normalizacao` raises `ValueError`, and the whole check exits 1 (I ran it). This contradicts the brief and report row 6. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:61, diff.patch:29, brief.md:7, relatorio-construtor.md:100

4. **The copied in-gate identity-author plant always bites (`'mordeu': True`); the diff has `not autores`.** I removed the exclusion from `_nomes_dos_autores`. The copy's six plants stayed green, and the diff's six turned red. scripts/check-privacidade.py:208, diff.patch:2056, relatorio-construtor.md:102

## Minor

5. **The copied test asserts `mutacao-or-and-recusa-no-portao` as `True`; the diff asserts `not all(...)`.** Lines 65 and 66 still catch the `or`→`and` swap. tests/leituras/privacidade-rh1c.py:64, diff.patch:2202

6. **The report copy says 44 RH1-c plants, but 45 were measured.** The measurement log, `medidas-c.json` and the committed report all give 45. relatorio-construtor.md:111, design/especime-v3/medicoes/rh1-2026-10-14/RELATORIO.md:111, design/especime-v3/medicoes/rh1-2026-10-14/medicao-c.log:1

7. **The pass tripled `check:privacidade` from 119.9 s to 371.6 s, and the report does not mention it.** The check is now the slowest step of `verify`, which went from 263 s to 513 s; other steps took the same time as before. Almost every HTML page contains `&`, so the brief's "only when present" condition does not save the cost. The workflow asks that what enters `verify` measure its cost. design/especime-v3/medicoes/rh1-2026-10-14/portoes-b/verify.log:7970, design/especime-v3/medicoes/rh1-2026-10-14/portoes-c/verify.log:8242, brief.md:9, .github/workflows/portao.yml:85

8. **Two report references point to the wrong lines.** The PDF filter is at `medir-c.py:44`, not `:34`. The mutation is at `privacidade-rh1c.py:58–66`, not `:16`. relatorio-construtor.md:133, relatorio-construtor.md:103, design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py:44

9. **The new audit's 78 files and `passou` have no command in the package, which is the same kind of gap finding 11 closed for 26 and 51.** Nothing in the package writes this file. design/especime-v3/medicoes/rh1-2026-10-14/auditoria-entrega-c.json:2, design/especime-v3/medicoes/rh1-2026-10-14/medir-b.py:57

## «What is fine»

10. In the diff's version, a leading BOM or em space and a trailing NBSP or BOM yield the clean full name and short form. Zero-width space, CR, tab, U+2028 and U+2029 refuse the run, giving the line number only. diff.patch:29, scripts/check-privacidade.py:224, tests/leituras/privacidade-rh1c.py:28
11. With the diff's lines, swapping `or` for `and` turned 13 in-gate plants red when I ran it, and the sweep and the plants share the same decision. scripts/check-privacidade.py:191, scripts/check-privacidade.py:300, scripts/check-privacidade.py:255
12. These counts all reproduce from the measurement files: 45 cases, 38 tracked-file plants, 26 `dist/` plants, 24 551, 24 553 and 14 798 files, the audit counts 26 and 51, zero tracked PDFs, codes 0/0/0, and heads `a1f6094e` and `34129b6f`. design/especime-v3/medicoes/rh1-2026-10-14/medidas-c.json:3, design/especime-v3/medicoes/rh1-2026-10-14/medidas-c.json:241, design/especime-v3/medicoes/rh1-2026-10-14/portoes-c-resumo.json:226, design/especime-v3/medicoes/rh1-2026-10-14/portoes-c/cabeca.fim:1
13. RH1-10 states that Flate streams are open and that zero tracked PDFs proves nothing. relatorio-construtor.md:133
14. The report and the `gate-html` comment say correctly where the check runs, and `package.json` agrees. relatorio-construtor.md:107, scripts/gate-html.mjs:374, package.json:46
15. A search of the added lines and the package found no personal string (the search was confirmed on a known positive); only synthetic strings are used. scripts/check-privacidade.py:215, tests/leituras/privacidade-rh1c.py:29

not yet: four copied code lines differ from the diff and the head bytes need confirming, and a non-breaking or doubled space can still hide a name while the known-positive bites.
