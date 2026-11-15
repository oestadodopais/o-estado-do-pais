"""The weekly re-check: `python3 -m oedp reconferir [--so-relatar] [<piece> …]`.

For every published piece (or those named that are published), for every `[[fonte]]`,
the source's `url` is fetched again by the fetcher, under its rules (public host,
robots.txt, the rights record, the redirect limit, a 2xx answer), and compared with
the stored copy:

* `igual`: the same SHA-256. Nothing happens.
* `mudou, os excertos mantêm-se`: other bytes, and every line that cites the source
  still finds its excerpt in the new copy's text, by the function check 2 uses
  (`fontes.procurar`), with a `valor` line's figure in its excerpt (`numeros.contem_figura`).
  The new copy is stored too (the fetcher stores what it fetches).
* `falhou`: other bytes, and a line's excerpt is no longer found. One `[[estado]]`
  `retirada` is appended to the piece, its `razao` the fixed sentence `retirada_numero`:
  the piece is withdrawn by default (ESQ2c item 12); `--so-relatar` reports and withdraws
  nothing.
* `inacessivel`: the address could not be fetched, answered other than 2xx, or its
  host now refuses. Never a pass, and never a withdrawal by itself: the stored copy is
  still the receipt.

A source's `pagina` is not re-checked: it is a way in, not a receipt. The JSON report
goes to `reconferencias/<date>.json` in the workshop; one line per source to the screen.
Exit 0 only when every source is `igual` or `mudou, os excertos mantêm-se`.

A whole run (over every published piece, not a list of them) that reaches its end appends
one `[[reconferencia]]` to `reconferencias.toml` at the root of the tree (ORDEM esq3, item
H): when it ended, how many published pieces it read, how many lines with an excerpt it
looked for in a fresh copy of their source, how many it did not find, the ids it withdrew,
and whether it was told to report only. A run stopped by an error appends nothing. The file
only grows, like the other records (`julgados.historia`), and is left out of the code's
fingerprint (`codigo.EXCLUIDOS_FICHEIROS`). This module's reading of «looked for»: a line
whose source came back byte for byte the same is counted as looked for and found, since the
fresh copy is the copy check 2 already found it in; a line whose source could not be fetched
is not counted.
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
REGISTO = "reconferencias.toml"
CAMPOS = {"em": str, "pecas": int, "excertos": int, "falhados": int, "retiradas": list, "so_relatar": bool}
COM_EXCERTO = ("valor", "citacao", "ato")


def erros_do_registo(dados: dict) -> list[str]:
    """The shape of reconferencias.toml: only [[reconferencia]] tables, each with exactly the
    fields of CAMPOS, counts that are whole numbers of 0 or more, falhados not above excertos,
    a real UTC time, and the withdrawn pieces as a list of ids."""
    from . import datas
    from .peca import ID_PECA

    erros = [f"{REGISTO}: [[{k}]] is not a table of this record" for k in dados if k != "reconferencia"]
    tabelas = dados.get("reconferencia", [])
    if not isinstance(tabelas, list):
        return erros + [f"{REGISTO}: reconferencia must be an array of tables [[reconferencia]]"]
    for n, t in enumerate(tabelas, 1):
        onde = f"{REGISTO} [[reconferencia]] number {n}"
        if not isinstance(t, dict):
            erros.append(f"{onde} is not a table")
            continue
        for k, tipo in CAMPOS.items():
            v = t.get(k)
            if k not in t:
                erros.append(f"{onde} lacks the field {k}")
            elif not isinstance(v, tipo) or (tipo is int and isinstance(v, bool)) or (tipo is int and v < 0):
                erros.append(f"{onde}: field {k} must be {'a whole number of 0 or more' if tipo is int else tipo.__name__}")
        erros += [f"{onde}: field {k} is not in this record" for k in t if k not in CAMPOS]
        if isinstance(t.get("em"), str) and datas.instante_real(t["em"]) is None:
            erros.append(f"{onde}: em {t['em']!r} is not a real date in the form YYYY-MM-DDTHH:MM:SSZ")
        if isinstance(t.get("retiradas"), list) and not all(isinstance(x, str) and ID_PECA.match(x) for x in t["retiradas"]):
            erros.append(f"{onde}: retiradas must list piece ids")
        if isinstance(t.get("falhados"), int) and isinstance(t.get("excertos"), int) and t["falhados"] > t["excertos"]:
            erros.append(f"{onde}: falhados {t['falhados']} is above excertos {t['excertos']}")
    return erros


def ler_registo(raiz: Path) -> tuple[list[dict], list[str]]:
    """(the [[reconferencia]] tables of `<raiz>/reconferencias.toml`, the errors of its shape);
    no file is no run yet."""
    f = Path(raiz) / REGISTO
    if not f.is_file():
        return [], []
    try:
        dados = tomllib.loads(f.read_text(encoding="utf-8"))
    except (tomllib.TOMLDecodeError, UnicodeDecodeError) as e:
        return [], [f"{REGISTO} is not valid TOML ({e})"]
    erros = erros_do_registo(dados)
    return ([] if erros else list(dados.get("reconferencia", []))), erros


def acrescentar(raiz: Path, campos: dict) -> str:
    """Append one [[reconferencia]] to `<raiz>/reconferencias.toml`, after checking the file
    with it would still have the right shape; never a byte above the end."""
    f = Path(raiz) / REGISTO
    antes = f.read_bytes() if f.is_file() else b"# The weekly re-check of sources: one table per whole run, appended by `python3 -m oedp reconferir`.\n"
    texto = registo.tabela("reconferencia", campos)
    try:
        dados = tomllib.loads((antes + texto.encode("utf-8")).decode("utf-8"))
    except (tomllib.TOMLDecodeError, UnicodeDecodeError) as e:
        raise registo.ErroDoRegisto(f"{REGISTO} would not be valid TOML ({e})") from None
    erros = erros_do_registo(dados)
    if erros:
        raise registo.ErroDoRegisto("; ".join(erros))
    with open(f, "ab") as saida:
        if not f.stat().st_size:
            saida.write(antes)
        saida.write(texto.encode("utf-8"))
    return texto


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
        elif l.get("tipo") == "valor" and not numeros.contem_figura(fontes.normalizar(str(l.get("excerto", ""))), str(l.get("valor", "")),
                                                                  quadro=l.get("linha_de_quadro") is True):
            falham.append(lid)
    return falham


def reconferir(caminhos: list[Path], loja: Path, oficina: Path, textos: dict, retirar: bool = True,
               buscar=None, raiz: Path | None = None, imprimir=print, hoje: str | None = None,
               registo_em: Path | None = None) -> tuple[int, Path]:
    """Re-check the sources; returns (exit code, the report's path). With `registo_em` (a
    whole run: the caller gave no list of pieces), the run's table is appended to
    `<registo_em>/reconferencias.toml` once it has reached its end."""
    buscar = buscar or buscador_real(raiz or Path(caminhos[0]).resolve().parents[2])
    resultados = []
    lidas, procurados, nao_achados, retiradas = 0, 0, 0, []
    # What makes the run not whole (docs/ESPEC-PECA.md, edit of 15 November 2026, 15:17 UTC): a
    # piece that could not be read, a source that did not answer or answered with an error.
    incompleta: list[str] = []
    for caminho in caminhos:
        try:
            peca = ler(caminho)
        except (ErroDeForma, OSError) as e:
            imprimir(f"{caminho}: not a piece ({e}); not re-checked, so this run is not whole")
            incompleta.append(f"the piece file {Path(caminho).name} could not be read ({e})")
            continue
        if not peca.publicada:
            imprimir(f"{peca.id}: {peca.estado}, not published; not re-checked")
            continue
        lidas += 1
        falhou_aqui = []
        for fid, f in peca.fontes.items():
            antiga = str(f.get("sha256", ""))
            r = {"peca": peca.id, "fonte": fid, "url": str(f.get("url", "")), "sha256_guardado": antiga}
            try:
                nova = buscar(str(f.get("url", "")), loja)
            except fontes.ErroDaLoja as e:
                r.update(resultado=INACESSIVEL, razao=str(e))
                if any(l.get("fonte") == fid and l.get("tipo") in COM_EXCERTO for l in peca.linhas.values()):
                    incompleta.append(f"{peca.id} · {fid} could not be fetched and read ({e})")
            else:
                procurados += sum(1 for l in peca.linhas.values() if l.get("fonte") == fid and l.get("tipo") in COM_EXCERTO)
                r["sha256_novo"] = nova
                if nova == antiga:
                    r["resultado"] = IGUAL
                else:
                    falham = linhas_que_falham(peca, fid, fontes.caminho_da_copia(loja, nova).read_bytes())
                    r.update(resultado=FALHOU if falham else MUDOU, linhas=falham)
                    nao_achados += len(falham)
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
            retiradas.append(peca.id)
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
    if registo_em is not None and incompleta:
        imprimir(f"not a whole run, so nothing is appended to {REGISTO}: " + "; ".join(incompleta))
        return 1, relatorio
    if incompleta:
        return 1, relatorio
    if registo_em is not None:
        campos = {"em": registo.agora(), "pecas": lidas, "excertos": procurados, "falhados": nao_achados,
                  "retiradas": retiradas, "so_relatar": not retirar}
        acrescentar(registo_em, campos)
        imprimir(f"{REGISTO}: one [[reconferencia]] appended ({lidas} pieces, {procurados} excerpts looked for, "
                 f"{nao_achados} not found, {len(retiradas)} withdrawn)")
    return (0 if ok else 1), relatorio


def pecas_publicadas(raiz: Path) -> list[Path]:
    """The pieces a whole run must read: every published piece, and every file under pecas/ that
    cannot be read (it may be a published piece; `reconferir` names it and the run is not whole)."""
    saida = []
    for c in pecas_em(raiz):
        try:
            if ler(c).publicada:
                saida.append(c)
        except (ErroDeForma, OSError):
            saida.append(c)
    return saida
