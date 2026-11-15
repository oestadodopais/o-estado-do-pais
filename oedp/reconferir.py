"""The weekly re-check: `python3 -m oedp reconferir [--retirar] [<piece> …]`.

For every published piece (or those named that are published), for every `[[fonte]]`,
the source's `url` is fetched again by the fetcher, under its rules (public host,
robots.txt, the rights record, the redirect limit, a 2xx answer), and compared with
the stored copy:

* `igual`: the same SHA-256. Nothing happens.
* `mudou, os excertos mantêm-se`: other bytes, and every line that cites the source
  still finds its excerpt in the new copy's text, by the function check 2 uses
  (`fontes.procurar`), with a `valor` line's figure in its excerpt (`numeros.contem_figura`).
  The new copy is stored too (the fetcher stores what it fetches).
* `falhou`: other bytes, and a line's excerpt is no longer found. With `--retirar`, one
  `[[estado]]` `retirada` is appended to the piece, its `razao` the fixed sentence
  `retirada_numero`.
* `inacessivel`: the address could not be fetched, answered other than 2xx, or its
  host now refuses. Never a pass, and never a withdrawal by itself: the stored copy is
  still the receipt.

A source's `pagina` is not re-checked: it is a way in, not a receipt. The JSON report
goes to `reconferencias/<date>.json` in the workshop; one line per source to the screen.
Exit 0 only when every source is `igual` or `mudou, os excertos mantêm-se`.
"""
from __future__ import annotations

import datetime as dt
import json
import tomllib
from pathlib import Path

from . import direitos as rights
from . import fontes, numeros, registo
from .peca import ErroDeForma, ler, pecas_em

IGUAL, MUDOU, FALHOU, INACESSIVEL = "igual", "mudou, os excertos mantêm-se", "falhou", "inacessivel"
POR = "python3 -m oedp reconferir"


def buscador_real(raiz: Path):
    """The fetcher as `fonte` runs it: returns the SHA-256 of the copy it stored."""
    direitos_de = rights.para_buscar(Path(raiz) / "direitos")

    def buscar(url: str, loja: Path) -> str:
        tabela = fontes.buscar(url, loja, direitos_de=direitos_de)
        return tomllib.loads(tabela)["fonte"][0]["sha256"]

    return buscar


def linhas_que_falham(peca, fid: str, dados: bytes) -> list[str]:
    """The lines citing `fid` whose excerpt is not in the new copy, as check 2 reads it."""
    import re

    paginas = fontes.texto_por_pagina(dados)
    falham = []
    for lid, l in peca.linhas.items():
        if l.get("fonte") != fid or l.get("tipo") not in ("valor", "citacao", "ato"):
            continue
        m = re.search(r"\bp\.\s*(\d+)", str(l.get("onde", "")))
        if fontes.procurar(str(l.get("excerto", "")), paginas, int(m.group(1)) if m else None) is None:
            falham.append(lid)
        elif l.get("tipo") == "valor" and not numeros.contem_figura(fontes.normalizar(str(l.get("excerto", ""))), str(l.get("valor", ""))):
            falham.append(lid)
    return falham


def reconferir(caminhos: list[Path], loja: Path, oficina: Path, textos: dict, retirar: bool = False,
               buscar=None, raiz: Path | None = None, imprimir=print, hoje: str | None = None) -> tuple[int, Path]:
    """Re-check the sources; returns (exit code, the report's path)."""
    buscar = buscar or buscador_real(raiz or Path(caminhos[0]).resolve().parents[2])
    resultados = []
    for caminho in caminhos:
        try:
            peca = ler(caminho)
        except (ErroDeForma, OSError) as e:
            imprimir(f"{caminho}: not a piece ({e}); skipped")
            continue
        if not peca.publicada:
            imprimir(f"{peca.id}: {peca.estado}, not published; not re-checked")
            continue
        falhou_aqui = []
        for fid, f in peca.fontes.items():
            antiga = str(f.get("sha256", ""))
            r = {"peca": peca.id, "fonte": fid, "url": str(f.get("url", "")), "sha256_guardado": antiga}
            try:
                nova = buscar(str(f.get("url", "")), loja)
            except fontes.ErroDaLoja as e:
                r.update(resultado=INACESSIVEL, razao=str(e))
            else:
                r["sha256_novo"] = nova
                if nova == antiga:
                    r["resultado"] = IGUAL
                else:
                    falham = linhas_que_falham(peca, fid, fontes.caminho_da_copia(loja, nova).read_bytes())
                    r.update(resultado=FALHOU if falham else MUDOU, linhas=falham)
                    if falham:
                        falhou_aqui += falham
            resultados.append(r)
            linha = f"{peca.id} · {fid}: {r['resultado']}"
            if r["resultado"] == INACESSIVEL:
                linha += f" ({r['razao']})"
            elif r["resultado"] != IGUAL:
                linha += f" (stored {antiga[:12]}…, now {r['sha256_novo'][:12]}…" + (f"; lines {', '.join(r['linhas'])}" if r.get("linhas") else "") + ")"
            imprimir(linha)
        if falhou_aqui and retirar:
            registo.acrescentar(Path(caminho), "estado", {"estado": "retirada", "em": registo.agora(), "por": POR,
                                                          "razao": textos["retirada_numero"]})
            imprimir(f"{peca.id}: withdrawn ([[estado]] retirada appended, razao retirada_numero)")
            for r in resultados:
                if r["peca"] == peca.id and r["resultado"] == FALHOU:
                    r["retirada"] = True
    pasta = Path(oficina) / "reconferencias"
    pasta.mkdir(parents=True, exist_ok=True)
    dia = hoje or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    relatorio = pasta / f"{dia}.json"
    n = 2
    while relatorio.exists():
        relatorio = pasta / f"{dia}-{n}.json"
        n += 1
    relatorio.write_text(json.dumps({"em": registo.agora(), "retirar": retirar, "fontes": resultados}, indent=1,
                                    ensure_ascii=False) + "\n", encoding="utf-8")
    ok = all(r["resultado"] in (IGUAL, MUDOU) for r in resultados)
    imprimir(f"re-check: {len(resultados)} sources, " + ("all stand" if ok else "not all stand") + f"; report in {relatorio}")
    return (0 if ok else 1), relatorio


def pecas_publicadas(raiz: Path) -> list[Path]:
    saida = []
    for c in pecas_em(raiz):
        try:
            if ler(c).publicada:
                saida.append(c)
        except (ErroDeForma, OSError):
            continue
    return saida
