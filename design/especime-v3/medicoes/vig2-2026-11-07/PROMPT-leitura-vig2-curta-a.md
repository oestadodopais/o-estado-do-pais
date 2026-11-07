# The short read of VIG2 addendum A (M48), 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

`LEITURA-vig2.md` is the cold read of VIG2, which landed on the engine. The first real run of the watch after it refused: three of 36 designations (titles of parliamentary initiatives) carry line breaks or trailing spaces as the source writes them, and the parts verifier, reading line by line, did not recognise them. `brief.md` is the addendum. The engine diff is `motor/diff.patch` (base 1c38c4a), with the changed files under `motor/`; `diff.patch` is the site side (the report and measurements).

## The three questions

1. **The fix.** Is every designation now written on one line, in the single summary and in the parts, with the same form in the verifier? Does the index keep the title exactly as the source wrote it?
2. **The proofs.** Do the tests prove each case (`\n`, `\n\n`, trailing spaces), one occurrence each, a removed designation still refused, the 12.10 summary still byte for byte, and the real index of 07.11 with its 36 designations once each, under the cap?
3. **Nothing weaker.** Does the verifier stay a check of the delivered text (and not a copy of the generator that would pass whatever it produces)? Did anything else change?

Budget: at most 15 tool calls.
