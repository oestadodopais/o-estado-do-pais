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
| `python3 -m oedp fonte <url>` | Fetches the address (respecting `robots.txt`), stores the copy under its SHA-256 in `$OEDP_FONTES`, prints the `[[fonte]]` table |
| `python3 -m oedp texto <sha256>` | Prints a stored copy's text as check 2 reads it, page by page for a PDF |
| `python3 -m oedp impressao <piece>` | Prints the piece's and the fact sheet's fingerprints |
| `python3 -m oedp registar <piece> passo\|leitura\|correcao --…` | Appends one table to the record |
| `python3 -m oedp estado <piece> publicada\|retirada\|rascunho --razao …` | Appends one `[[estado]]` table (refuses to publish a piece that would fail) |
| `python3 -m oedp conferir [<piece> …]` | Runs the checks; exit 0 only if nothing failed |
| `python3 -m oedp construir [--com-rascunhos] [--saida <folder>]` | Builds `.vercel/output/` (or a preview in `.previa/`, never deployed) |
| `python3 -m oedp no-ar <address>` | Check 10: the live site against the build, file by file |
| `python3 -m oedp tudo` | `conferir`, `construir` and the tests |

`OEDP_FONTES` names the private store of source copies; copies never enter this
repository. `PRIVACIDADE_PROIBIDOS` holds the strings check 8 refuses (one per line).

Folders: `oedp/` the code; `pecas/` the pieces; `mesas/` one file per desk;
`paginas/` the Method prose; `public/` the stylesheet, typefaces and icons;
`ensaios/` the test piece (invented figures), its store and the holding page;
`tests/` the tests, including one planted failure for each check.

Publishing on push is switched off in `vercel.json`. The GitHub workflow's job
`portao` runs `tudo` on every push.
