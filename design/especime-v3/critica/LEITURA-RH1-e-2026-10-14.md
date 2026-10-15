# Leitura curta da passagem de correção RH1-e (14.10.2026, à noite)

*Lançada pelo lugar de direção às 18:46 UTC sobre o pacote do sítio de `83c1ca87` a `11893fdb` (a passagem RH1-e do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-RH1-e-2026-10-14.md`), montado por `scripts/leituras/pacote.sh`. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 194 891 símbolos, 61 chamadas de ferramentas, vinte e quatro minutos. As cinco plantas do lugar de direção (`PLANTAS-RH1-e-2026-10-14.json`, quatro nos hunks do diff e uma no relatório) foram as cinco mordidas: os achados 1 a 5. Os achados 6 a 8 são Minor reais e vão para o bloco de higiene seguinte (a I225): a medição do tempo de antes sem o comando que a escreveu e dois ficheiros de medição sem escritor; a conferência das referências que só prova que cada `def` existe uma vez; e seis caracteres (İ, ǅ, ǈ, ǋ, ǲ, ϴ) cujo `casefold` é igual à minúscula e que escapam ao índice inverso, nenhum deles das cadeias protegidas. O leitor fez também o que uma régua determinística fará no bloco seguinte: reconstruiu a versão da RH1-d e correu seis mil páginas sintéticas contra as duas (a RH1-d apanhou 2 260, a RH1-e 6 000, nenhuma só pela RH1-d). Veredicto: pronto a aterrar. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

None.

## Major

1. **The copied `opcoes` only tries three-letter equivalences (`(3,)`), but the diff tries both two and three letters (`(2, 3)`).** With the copy, ss↔ß and the fi, fl, ff and st ligatures are lost. 44 RH1-e plants fail, and so do 7 RH1-d plants, because a `Straße` secret no longer matches its own lowercase form. All three privacy tests exit 1. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:174, diff.patch:113

2. **The copied `basicas` makes the entity semicolon mandatory; the diff makes it optional.** This brings back the misses for `&eacute`, `&apos` and `&ccaron` written without a semicolon, and 12 plants turn red. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:141, diff.patch:62

3. **The copied CR-merge plant is hard-coded to `'mordeu': True`; the diff computes it.** Only the rh1e premature-collapse mutation notices. With just this one change, rh1e exits 1 while rh1c and rh1d stay green. scripts/check-privacidade.py:341, diff.patch:6992, tests/leituras/privacidade-rh1e.py:67

## Minor

4. **The copied interior check drops `Zl`/`Zp`; the diff keeps them.** Line 69 still refuses U+2028 and U+2029, so no plant can tell the two versions apart, and with only this change all three tests pass. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:62, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:69, diff.patch:16

5. **The report copy gives the before time as 52,5 s; the measurement says 55,2.** relatorio-construtor.md:232, design/especime-v3/medicoes/rh1-2026-10-14/tempo-antes-e.json:12, design/especime-v3/medicoes/rh1-2026-10-14/RELATORIO.md:232

6. **No command in the package wrote the 55,2 s, which repeats my earlier finding 8.** The log is pretty-printed full JSON with no `versao_conferencia`, a shape that none of `medir-e.py`, `medir-d.py` or `medir-tempo-original-d.py` prints. The report's command block omits it. Also: `medir-e.py --tempo` cannot produce the file names `intermedio` or `primeira-depois`; nothing in the package writes `contagens-portoes-e.json`; neither audit JSON records the command that wrote it. design/especime-v3/medicoes/rh1-2026-10-14/tempo-antes-e.log:1, design/especime-v3/medicoes/rh1-2026-10-14/medir-e.py:152, design/especime-v3/medicoes/rh1-2026-10-14/medir-tempo-original-d.py:21, relatorio-construtor.md:228

7. **The 10 new reference checks only confirm that each `def` occurs once; they never check that it sits at the line the report cites.** I compared the lines by hand and all 10 match. design/especime-v3/medicoes/rh1-2026-10-14/medir-e.py:79, relatorio-construtor.md:220

8. **A secret containing İ, ǅ, ǈ, ǋ, ǲ or ϴ is missed even on a byte-identical page, by both RH1-e and RH1-d.** I scanned every code point, and these are the only six characters affected. Their casefold equals their lowercase, so they never enter the inverse index. The name plant covers only the authors or `segredo[:1]`. design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:115, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:189, scripts/check-privacidade.py:411

## «What is fine»

9. I rebuilt the diff version: the package copies with the diff's four lines restored. The tests pass: rh1e 128 of 128, rh1d 116, rh1c 211. All 114 new plants bite, giving 193 personal plants (design/especime-v3/medicoes/rh1-2026-10-14/medidas-e.json:1296).
10. Detection: all six earlier cases bite in all four encodings, as do the semicolon-less forms, ß/ẞ in both directions, and reversed and split ligatures; fuzzing with 6 000 synthetic pages: RH1-d caught 2 260, RH1-e caught 6 000, and none was caught only by RH1-d; all 2 000 converging ligature/ß variants matched, so the suffix factorisation keeps every path; no pattern matches the empty string, and search time is linear (diff.patch:178).
11. All seven separators refuse with «linha N» and never show the string. A CR merge is refused, CRLF is accepted, and tab and Zs collapse to one space (diff.patch:16).
12. Numbers and gates: 56,1, 54,8, 67,6, 70,5 and 59,9 all match their sources (design/especime-v3/medicoes/rh1-2026-10-14/portoes-e/verify.log:9808); the gate output gives 24 646, 14 798, 201 and 26, and 114 `e-` plants; the three codes are 0, head 4be55979 at both ends, and the tree was clean; audit totals: 167 = 165 − 2 + 4 ignored; 112 = 110 − 1 + 3; all 32 references pass; RH1-10 stays open (relatorio-construtor.md:272).
13. No personal strings. The only match was the synthetic `/Users/CONTA-DE-ENSAIO` (tests/leituras/privacidade-jd1.py:51).
14. Reader's note: when I imported the copied detector, Python wrote a `__pycache__` under design/especime-v3/medicoes/c1-2026-09-28/. I deleted it, and nothing else in the package changed.

**ready to land:** the diff fixes both earlier Majors and passes everything I ran. Majors 1–3 exist only in the package copies, so the seat should confirm that the head matches the diff.
