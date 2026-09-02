# Leitura a frio do Codex ao bloco F0.5 (uma só resolução por número), 02.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 22:15 a 22:27 UTC, sobre um pacote dos dois repositórios com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, a precisão do avaliador do sítio a 27 algarismos contra o cabeçalho e o motor, apanhada no Blocking 2; P2a e P2b, o motor a voltar ao arredondamento por omissão (`rounding=None`), apanhada no Blocking 1; P3, a cópia do fixture no sítio a esperar 1.00 onde o motor e o sha256 registado dizem 1.01, apanhada no Blocking 3. Triagem do lugar de direção: os três Blocking são as plantas; os Major 4 a 11 e os Minor 12 e 13 são reais e consertam-se na segunda passagem, com uma nota: o Major 9 (a prova de que nenhum valor publicado se move) refaz-se com o método certo, que o leitor tem razão em recusar; e o Major 10 fecha-se com a cópia do sítio no motor a levar o fixture e o portão do motor a conferi-lo, o que só é possível com o ramo do sítio fechado. O texto do leitor fica como veio.*

---

## Blocking

1. **The motor still rounds explicit ties half-even.** `ROUND_HALF_UP` is imported but unused; `quantize(..., rounding=None)` delegates to the ambient context, whose default is half-even (`derivations.py:49-55`, `derivations.py:76`, `derivations.py:222-223`). The site implements half away from zero with `resto * 2n >= p` (`decimal.mjs:278-305`). Consequently:

   - `round ( 0.5 , 0 )`: motor `0`, site `1`.
   - `round ( -0.5 , 0 )`: motor `-0`, site `-1`.
   - `round ( 0.125 , 2 )`: motor `0.12`, site `0.13`.
   - `round ( 1.005 , 2 )`: motor `1.00`, site `1.01`.
   - `round ( -1.005 , 2 )`: motor `-1.00`, site `-1.01`.

   These are precisely the distinctions encoded by the authoritative fixture (`derivacoes-paridade.motor.json:47-92`). The diff itself contains the wrong `rounding=None`, despite its header, report and imported symbol saying `ROUND_HALF_UP` (`diff-motor.patch:219-227`, `diff-motor.patch:240`, `diff-motor.patch:265-267`, `relatorio-construtor.md:20-32`).

2. **The site has 27 significant digits, not 28.** The contract and header say 28, but `PRECISAO` is `27` (`decimal.mjs:23-33`, `decimal.mjs:61-62`). Every arithmetic operation passes through that limit (`decimal.mjs:177-194`, `decimal.mjs:209-220`, `decimal.mjs:247-269`). Thus `1 / 3` has 27 threes on the site and 28 in the motor, and `1 / 3 * 3` has 27 rather than 28 nines; the fixture requires the latter (`derivacoes-paridade.motor.json:95-110`). The diff repeats `27`, while its declared target blob and report describe the corrected 28-digit file (`diff-sitio.patch:979`, `diff-sitio.patch:1007-1015`, `diff-sitio.patch:1043-1044`, `relatorio-construtor.md:113-128`).

3. **The parity artefacts are not one byte stream.** The motor fixture expects `1.01`, while the supplied site copy expects `1.00` (`derivacoes-paridade.motor.json:77-80`, `derivacoes-paridade.sitio.json:77-80`). The site diff postimage says `1.01`, so the full site file also disagrees with its own diff (`diff-sitio.patch:395-399`). Their SHA-256 values are respectively `5cf0cd43…` and `a28c7575…`, while both recorded fields declare `5cf0cd43…` (`cruzamentos-paridade.json:18-23`). The site harness will reject its altered expectation against the exact evaluator, and the motor harness will reject the half-up expectations against `rounding=None` (`diff-sitio.patch:675-695`, `diff-motor.patch:297-312`). Therefore the reported green gates and differential results cannot describe these supplied files (`relatorio-construtor.md:125-130`, `relatorio-construtor.md:202-207`).

## Major

4. **Rule-by-rule, parity is not exact.**

   | Rule | Result |
   |---|---|
   | Intermediate precision | No: Python inherits 28; JavaScript fixes 27 (`derivations.py:49-52`, `decimal.mjs:61-62`). |
   | Intermediate rounding | Both algorithms are half-even, but at different retained digits; JavaScript’s tie rule itself is correct (`decimal.mjs:177-194`). |
   | Explicit `round` | No: motor uses ambient half-even; site uses half-away (`derivations.py:222-223`, `decimal.mjs:288-305`). |
   | Division | Same algorithmic shape and both refuse zero, but differing precision changes non-terminating results (`derivations.py:228-240`, `decimal.mjs:223-269`). |
   | Parentheses | The motor recursively evaluates them; the fixture exercises ordinary grouping (`derivations.py:196-201`, `derivacoes-paridade.motor.json:143-146`). |
   | Unary minus | Ordinary values are negated on both sides (`derivations.py:202-203`, `decimal.mjs:272-275`, `diff-sitio.patch:1563-1566`). |
   | Canonical string | Not universally equal; signed-zero addition is one counterexample, below (`derivations.py:258-259`, `decimal.mjs:113-155`, `decimal.mjs:205-216`). |
   | Equality | For finite supported decimals, both compare exact value, ignore scale and equate signed zeros (`derivations.py:318-324`, `decimal.mjs:128-135`, `diff-sitio.patch:1629-1648`). |

5. **The motor’s “28/half-even” contract is ambient rather than fixed.** Arithmetic uses the process-wide decimal context directly, and explicit `round` now does too (`derivations.py:223-247`). The report’s own measurement mutates that global context with `decimal.setcontext()` (`relatorio-construtor.md:54-64`). A caller that sets precision to 10 makes motor `1 / 3` ten digits while the site remains fixed; on correctly changed code, switching context rounding would not simulate the old `round`, because explicit `ROUND_HALF_UP` would override it (`relatorio-construtor.md:42-72`). The published “308 rows, zero changes” experiment is therefore invalid either way: with the supplied code its claimed known-positive must be `0 2`, while with intended code its two branches both run half-up (`relatorio-construtor.md:66-74`).

6. **The accepted expression domains still differ.**

   - Python sends every token to `Decimal(token)`; the site first requires `^-?\d+(\.\d+)?$` (`derivations.py:182-194`, `diff-sitio.patch:1546-1555`). `1e2 + 1` gives `101` in the motor but is refused as an unknown identifier by the site; `+3` is likewise accepted only by the motor.
   - Python uses Unicode-aware `isdigit()` for `round` places, while the stated site rule is ASCII `^\d+$`; `round ( 1.25 , ٢ )` is accepted by Python and refused by JavaScript (`derivations.py:209-220`, `relatorio-construtor.md:36-38`).
   - The site resolves an `env` name before self-reference or claims; the motor has no environment namespace. With `{env:{x:"2"}}`, `x + 1` gives `3` on the site and is refused by the motor (`diff-sitio.patch:1541-1555`, `derivations.py:187-194`).

7. **Unary/sign and canonical-string behavior is not fully equivalent.** JavaScript unary minus only toggles a sign, whereas Python unary minus applies its decimal context; `- 12345678901234567890123456789` can therefore retain 29 digits on the site but be rounded to 28 by the motor (`derivations.py:202-203`, `decimal.mjs:272-275`). JavaScript addition reconstructs zero with `neg=false`, so `-0 + -0` canonicalizes as `0`; Python preserves `-0` for that sum (`decimal.mjs:113-155`, `decimal.mjs:205-216`, `derivations.py:242-259`). Equality still treats those zeros as equal, so the discrepancy is hidden by value-only fixture comparisons (`decimal.mjs:128-135`, `diff-motor.patch:306-312`).

8. **The fixture has 19 cases and 6 refusals, but it does not prove all three advertised rules.** The mappings are:

   - `empate-meio-zero`, `-um`, `-dois`, `-negativo`: unit ties, including symmetry; the `1.5` case explicitly distinguishes nothing (`derivacoes-paridade.motor.json:47-68`).
   - `empate-duas-casas`, `-que-o-float-perde`, `-negativo`: two-decimal ties, binary-float loss and negative symmetry (`derivacoes-paridade.motor.json:71-86`).
   - `arredondamento-encadeado`: two successive explicit rounds (`derivacoes-paridade.motor.json:89-92`).
   - `divisao-longa`, `-negativa`, `-que-nao-fecha`: precision, division sign/rounding and an intermediate division followed by multiplication (`derivacoes-paridade.motor.json:95-110`).
   - `percentagem`, `percentagem-inteira`: realistic `/`, `*`, then explicit round (`derivacoes-paridade.motor.json:113-122`).
   - `soma-que-o-float-nao-fecha`, `subtracao-que-o-float-nao-fecha`: exact decimal addition and subtraction (`derivacoes-paridade.motor.json:125-134`).
   - `produto-acima-dos-28-algarismos`: multiplication precision, but its discarded part is not a tie (`derivacoes-paridade.motor.json:137-140`).
   - `parentesis`, `menos-unario`, `igualdade-por-valor`: grouping, ordinary unary minus and scale-insensitive equality (`derivacoes-paridade.motor.json:143-158`).
   - The six refusals cover zero division, negative/fractional places, trailing junk, unclosed parentheses and empty input (`derivacoes-paridade.motor.json:161-190`).

   Missing are an intermediate exact half-even tie, 28-digit rounding in addition/subtraction, operator precedence without parentheses (`1 + 2 * 3`), canonical strings and signed zero, scientific/plus-signed literal parity, Unicode places, environment lookup, and a fixture-level near-equality rejection. The harness itself chooses exact equality, so the fixture does not prove that `validateLedger` removed tolerance (`diff-motor.patch:306-312`, `diff-sitio.patch:687-695`). A necessary half-even case would be `1.2345678901234567890123456785 * 1`, where the retained final digit is even.

9. **The “no published value moves” evidence is insufficient and partly impossible.** The package supplies only reported command output, not the ten ledgers, row/result inventory or hashes needed to reproduce the 308-row and 333-row claims (`relatorio-construtor.md:40-78`, `relatorio-construtor.md:140-152`). The motor experiment does not validly compare old and intended evaluators, and the site experiment does not test the accidental 27-digit implementation (`relatorio-construtor.md:54-72`, `decimal.mjs:61-62`). In the supplied site code, fixture failures cause exit before `validateLedger()` reaches existing rows (`diff-sitio.patch:815-838`). Rows with prose derivations but no `check` also remain explicitly non-blocking debt (`derivations.py:66-68`, `derivations.py:274-280`). A checked-row change should eventually be caught because `ledger:check` precedes both build and verify, but the package does not establish that no existing checked result changes (`package.json:12-15`, `package.json:33`).

10. **Current-origin parity remains manual, and the documentation contradicts itself.** The report admits no automatic run compares today’s motor fixture with today’s site copy (`relatorio-construtor.md:238-245`). Yet `cruzar_paridade.py` says `--conferir` “is what the gate runs” and that it compares those current files (`cruzar_paridade.py:36-37`, `cruzar_paridade.py:112-141`). `verify` runs only the site-side recorded-hash check, with no origin path (`package.json:23`, `package.json:33`). The supplied one-byte drift is concrete evidence that this missing third comparison matters (`derivacoes-paridade.motor.json:79`, `derivacoes-paridade.sitio.json:79`).

11. **The explicit eye-text sets are identical, but the known-positives do not prove complete identity and one special path still differs.** Both lists contain the same 24 code points (`eyetext.py:97-106`, `eyetext.mjs:102-110`). Each test checks six exclusions, five representative inclusions and only the total size, so swapping two untested members could pass both suites (`diff-motor.patch:569-625`, `diff-sitio.patch:905-971`). The site also strips a leading U+FEFF plus doctype using a separate `\s` regex, while Python feeds that character into its reader and the explicit set does not trim it; `\uFEFF<!DOCTYPE html><p>x</p>` can therefore yield only `x` on the site but an extra U+FEFF loose block in the motor (`eyetext.mjs:163-172`, `eyetext.mjs:252-256`, `eyetext.py:188-220`). The known-positive puts U+FEFF inside `<p>`, so it misses this prefix path (`diff-motor.patch:577-597`, `diff-sitio.patch:913-940`).

## Minor

12. **`temClasse()` over-splits HTML classes.** The comment invokes the five HTML ASCII whitespace characters, but `/\s+/` additionally treats NBSP, U+FEFF and other Unicode characters as separators (`eyetext.mjs:177-188`). For `class="foo\u00A0src-chip"`, the site can incorrectly recognize `src-chip` and discard the entire node (`eyetext.mjs:205-218`). The surrounding whitespace documentation also incorrectly lists vertical tab as HTML whitespace (`eyetext.py:79-80`, `eyetext.mjs:83-84`).

13. **Secondary comments and recorded restoration hashes do not describe the supplied bytes.** `Decimal.de` documents `-?\d+...` but accepts an optional plus, while `evaluateCheck` never routes plus-signed literals to it (`decimal.mjs:86-99`, `diff-sitio.patch:1546-1550`). The report records SHA prefixes `105e7d9d`, `ed1e9b82` and `e0378c12` for restored full files, whereas the supplied files hash differently; the first and third reported prefixes appear only after correcting `rounding=None` and `PRECISAO=27` (`relatorio-construtor.md:202-207`, `derivations.py:223`, `decimal.mjs:62`).

### «What is fine»

- Finite supported values are compared exactly by value, not by string or tolerance (`derivations.py:318-324`, `decimal.mjs:128-135`, `diff-sitio.patch:1629-1648`).
- Both evaluators refuse division by zero (`derivations.py:236-239`, `decimal.mjs:242-244`).
- The crossing writer copies source bytes directly and records the same digest twice (`cruzar_paridade.py:144-157`).
- The eye-text parity script is now present in `verify`, and the two explicit 24-character lists themselves match (`package.json:31-33`, `eyetext.py:97-106`, `eyetext.mjs:102-110`).

**Distinct findings: 13.**