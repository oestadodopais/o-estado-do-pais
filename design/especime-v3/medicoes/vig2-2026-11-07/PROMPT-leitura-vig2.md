# The cold read of VIG2, 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

**VIG2 (engine):** the daily watch of the Parliament diary, the parliamentary initiatives and the Diário da República writes a summary for a model to read, capped at 2 500 bytes. After a stoppage the minimal summary (the act and initiative designations, the source states and reasons, the headers of each Parliament diary) can pass the cap, and the run refused before writing anything (06.11.2026). VIG2 splits the summary into numbered parts, each under the cap, with every designation in exactly one part and none omitted; a run whose minimum fits writes one summary, byte for byte as before. The mandate is `brief.md`; its measurements are in `medidas-vig2.json`. The engine diff is `motor/diff.patch` (base 983b19e, head the engine commit), with the changed engine files under `motor/`; the site diff is `diff.patch` (the builder's report and measurements only). No site page changes.

## The five questions

1. **No omission.** Can any designation, initiative or Parliament-diary header be left out of every part, or appear in two? Does the verifier read the parts as written and refuse each of those cases on its own?
2. **The cap.** Is every part under 2 500 bytes, by the same measure as before (`len(texto.encode())`)? Can a part pass the cap anywhere (the numbering line, the archive references repeated per part, the descriptions and speakers added after the designations)?
3. **Unchanged when it fits.** When the minimum fits, is the summary byte for byte the one the code before VIG2 wrote? Is the frozen reference really the old code's output?
4. **Writing and the receipt.** Does the run write the parts, and only remove leftover parts of the same day from an earlier run? Does the receipt say the parts and their bytes? Does a refused run still refuse for a single line over the cap?
5. **The rest.** Did anything else in the watch change (sources, permissions, ceilings, the index, the state)? Did any check that protects a number, a source or a person get weaker? Does every number in the report come from a file in the package?

Budget: at most 30 tool calls.
