# O Estado do País

A publication about Portugal, written and edited by AI. This repository holds the
piece files, the code that checks them, and the code that builds the pages. The
contracts are `docs/ESPEC-PECA.md` (the piece file and the ten checks) and
`docs/ESPEC-PAGINAS.md` (the five pages and every fixed sentence, kept in
`textos.toml`).

Python 3.12 or later. `python3 -m pip install -r requirements.txt`, then:

| Command | What it does |
|---|---|
| `python3 -m oedp nova <id> --tipo diario\|artigo\|estudo` | Creates `pecas/<year>/<id>.md` with its four sections |
| `python3 -m oedp fonte <url> [--pagina <address>]` | Fetches the address through `curl`, following at most five redirects itself and refusing any hop that is not public or that its `robots.txt` (RFC 9309) closes; the final host must have a rights record in `direitos/`. Stores the copy under its SHA-256 in `$OEDP_FONTES`, prints the `[[fonte]]` table. `--pagina` fetches and stores the publisher's own page for the document under the same rules and adds `pagina` and `pagina_sha256`. `--termos` stores a publisher's terms page and prints the start of its rights record. A host that never answers `HEAD`, or answers only over HTTP/1.1, is remembered in `hosts.json` in the store's folder (a cache) and asked the other way next time |
| `python3 -m oedp texto <sha256>` | Prints a stored copy's text as check 2 reads it, page by page for a PDF |
| `python3 -m oedp impressao <piece>\|codigo` | Prints the piece's and the fact sheet's fingerprints, or the code's |
| `python3 -m oedp registar <file> passo\|leitura\|correcao --…` | Appends one table to the record of a piece, of `paginas/metodo.md`, of `textos.toml` (`textos.registo.toml`) or of the code (`codigo.registo.toml`) |
| `python3 -m oedp leitura montar <target> <seat> [--folha] [--seccao <f>] [--com <p>…] [--base <commit> --ordem <f>… --relatorio <f>…]` | Builds a reading's package and prompt in the workshop, `leituras/<target>/<seat>-<n>/`. The target is a piece file, `paginas/metodo.md`, `textos.toml` or `codigo` |
| `python3 -m oedp leitura plantar <folder> <list.toml>` | Plants errors from a list the reader never sees; refuses a plant nothing in the package proves false, one the reader cannot see, and one a check catches by itself; writes the key beside the package |
| `python3 -m oedp leitura lancar <folder>` | Runs `scripts/leituras/ler.sh` for a Codex seat (needs `CODEX_RACIOCINIO`); for a Claude seat, says where the prompt and the answer are |
| `python3 -m oedp leitura pontuar <folder> [--decisoes <f>]` | Scores the reader's closing block against the key: the verdict on the record |
| `python3 -m oedp leitura registar <folder>` | Appends the scored `[[leitura]]` to the target's record |
| `python3 -m oedp reconferir [--so-relatar] [<piece>…]` | Fetches every published piece's sources again and compares them with the stored copies, and withdraws a piece whose excerpt is gone; `--so-relatar` reports and withdraws nothing. A whole run (no piece named) that reaches its end appends one `[[reconferencia]]` to `reconferencias.toml` at the root (a record that only grows, left out of the code's fingerprint) |
| `python3 -m oedp custo <piece> [--json]` | What a piece cost, for the team: one row per step and reading from its record, with the tokens of each reading's `leitura.json` in `$OEDP_OFICINA` when set, then the totals. Writes nothing |
| `python3 -m oedp divulgacoes [--dias N] [--json] [--de <file>]` | The latest releases of the statistics office (date, title, address), newest first, from one page read by the fetcher's rules and stored nowhere; `--de` reads a copy saved by hand. Exits 1 when the page cannot be read or holds no release it can parse |
| `python3 -m oedp publicar [--ensaio]` | On the laptop: checks, the code's gate, the build, `vercel deploy` and `promote`, then `no-ar` against `endereco` for two minutes, rolling back if it fails |
| `python3 -m oedp navegador [--exigir chromium,firefox,webkit]` | A link to a receipt opens it, in real browsers (needs `requirements-navegador.txt`) |
| `python3 -m oedp capturas <folder> [<piece>]` | Screenshots of the built pages with Chromium, 390 and 1280 px, light and dark |
| `python3 -m oedp estado <piece> publicada\|retirada\|rascunho --razao …` | Appends one `[[estado]]` table (refuses to publish a piece that would fail) |
| `python3 -m oedp conferir [<piece> …]` | Runs the checks; exit 0 only if nothing failed |
| `python3 -m oedp construir [--com-rascunhos] [--saida <folder>]` | Builds `.vercel/output/` (or a preview in `.previa/`, never deployed) |
| `python3 -m oedp no-ar <address>` | Check 10: the live site against the build, file by file |
| `python3 -m oedp tudo` | `conferir`, `construir` and the tests |

`OEDP_FONTES` names the private store of source copies, outside this repository's
tree (the commands refuse a store inside it); copies never enter this repository. `OEDP_OFICINA`
names the private workshop, outside the tree too: reading packages (they carry the text of
sources), the keys of planted errors, the publishing log `publicacoes.jsonl` and the re-check
reports `reconferencias/`. `PRIVACIDADE_PROIBIDOS` holds the strings check 8 refuses (one per line).

The browser test and the screenshots need Playwright: `python3 -m pip install -r
requirements-navegador.txt`, then `python3 -m playwright install chromium firefox webkit`.

Folders: `oedp/` the code; `pecas/` the pieces; `mesas/` one file per desk;
`direitos/` one rights record per publisher's host;
`paginas/` the Method prose; `public/` the stylesheet, typefaces and icons;
`ensaios/` the test piece (invented figures), its store and the holding page;
`tests/` the tests, including one planted failure for each check.

Publishing on push is switched off in `vercel.json`. The GitHub workflow's job
`portao` runs `tudo` on every push, with `main` fetched so that check 4 can prove
that every record only grew, and then the browser test in three engines. Once the
repository secret `FONTES_CHAVE` exists, it checks out the private store read-only first.

The code has a record of its own, `codigo.registo.toml`: nothing is built as published and
nothing is sent to the host unless the last `seguranca` reading on the code's current
fingerprint passed, by a family that did not build it.

## Limits

The checks stop the mistakes the project's own seats can make in the ordinary course of
work, and make sure nothing a reader was shown can change or vanish without a check
failing. Three things are outside that line, written down rather than repaired:

- Someone who can write to the repository can replace the workflow and keep the job's
  name `portao`, change the build code together with its tests, or change the output
  and its manifest together. The control is that every code change is read by the
  other model family.
- A private string placed in a piece's id or in a field's name would be echoed by a
  diagnostic. Ids are `[a-z0-9-]` and field names are fixed by the specification, so a
  seat cannot do this by mistake.
- On GitHub no piece can be checked as published until the repository secret
  `FONTES_CHAVE` (a read-only deploy key of the store, the funder's to create) exists.
  Until then a published piece is checked in full only on the laptop, and the workflow
  fails on it by design.
- `publicar` proves what is live only after promoting it: a deployment's own address
  answers with a login page, so it cannot be compared before. A failure is rolled back
  within about two minutes, during which the new deployment is public.
- The test site's record of the code (`oedp/ensaio.py`) is invented and written at test
  time on the code as it is, so that the test piece builds as published; the real record
  is never written by it.
