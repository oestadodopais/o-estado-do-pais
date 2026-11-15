"""What a piece cost: `python3 -m oedp custo <piece> [--json]` (ORDEM esq3, item I).

It reads the piece's own record and, when a workshop is given (OEDP_OFICINA), the
`leitura.json` of each of its readings there, matched by seat, start and fingerprint
(`lugar`, `inicio`, `impressao`), for the tokens a reading used. It prints, for the team:
one row per step and per reading, in the order of their start; then the totals. It writes
nothing.

Minutes are measured from `inicio` to `fim`, to one decimal place; a total is summed in
seconds and rounded once. Tokens are known only for readings whose `leitura.json` holds
them (a Codex reading through `ler.sh`); "not known" is never added as zero to a total,
and the totals say how many readings had none.
"""
from __future__ import annotations

import json
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

from . import datas
from .peca import Peca


def _instante(texto):
    return datas.instante_real(str(texto or ""))


def _minutos(segundos: float | None) -> str | None:
    if segundos is None:
        return None
    return str((Decimal(str(segundos)) / 60).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def _segundos(t: dict) -> float | None:
    a, b = _instante(t.get("inicio")), _instante(t.get("fim"))
    return (b - a).total_seconds() if a and b and b >= a else None


def leituras_na_oficina(oficina: Path | None) -> list[dict]:
    """Every `leitura.json` under `<oficina>/leituras/`, each with the folder it was read from."""
    if oficina is None:
        return []
    achadas = []
    for f in sorted((Path(oficina) / "leituras").glob("*/*/leitura.json")):
        try:
            dados = json.loads(f.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if isinstance(dados, dict):
            achadas.append({**dados, "_pasta": f.parent})
    return achadas


def _da_oficina(leitura: dict, na_oficina: list[dict]) -> dict | None:
    """The workshop's leitura.json of a recorded reading: same seat, same start, same fingerprint."""
    for d in na_oficina:
        if all(d.get(k) == leitura.get(k) for k in ("lugar", "inicio", "impressao")):
            return d
    return None


def custo(peca: Peca, oficina: Path | None = None) -> dict:
    """The rows and the totals of a piece's cost, as a dict (what `--json` prints)."""
    na_oficina = leituras_na_oficina(oficina)
    linhas = []
    for p in peca.registo.get("passo", []):
        if isinstance(p, dict):
            s = _segundos(p)
            linhas.append({"tipo": "passo", "nome": p.get("nome"), "inicio": p.get("inicio"), "fim": p.get("fim"),
                           "lugar": p.get("lugar"), "familia": p.get("familia"), "modelo": p.get("modelo"),
                           "minutos": _minutos(s), "_segundos": s})
    for l in peca.registo.get("leitura", []):
        if isinstance(l, dict):
            s = _segundos(l)
            d = _da_oficina(l, na_oficina)
            tokens = d.get("tokens") if d and isinstance(d.get("tokens"), int) and not isinstance(d.get("tokens"), bool) else None
            linhas.append({"tipo": "leitura", "nome": l.get("lugar"), "inicio": l.get("inicio"), "fim": l.get("fim"),
                           "lugar": l.get("lugar"), "familia": l.get("familia"), "modelo": l.get("modelo"),
                           "minutos": _minutos(s), "_segundos": s, "tokens": tokens,
                           "oficina": d["_pasta"].name if d else None,
                           "plantas": f"{l.get('plantas_apanhadas')} of {l.get('plantas_postas')}",
                           "achados": l.get("achados"), "adotados": l.get("adotados"), "veredicto": l.get("veredicto")})
    linhas.sort(key=lambda r: (_instante(r["inicio"]) is None, str(r["inicio"])))

    encomenda = next((r for r in linhas if r["tipo"] == "passo" and r["nome"] == "encomenda"), None)
    fins = [_instante(r["fim"]) for r in linhas if _instante(r["fim"])]
    inicio = _instante(encomenda["inicio"]) if encomenda else None
    decorrido = (max(fins) - inicio).total_seconds() if inicio and fins and max(fins) >= inicio else None
    escrita = [_instante(r["fim"]) for r in linhas if r["tipo"] == "passo" and r["nome"] == "escrita" and _instante(r["fim"])]
    primeira_escrita = min(escrita) if escrita else None

    def depois_da_escrita(r):
        i = _instante(r["inicio"])
        return primeira_escrita is not None and i is not None and i > primeira_escrita

    tokens: dict[str, int] = {}
    sem_tokens: dict[str, int] = {}
    for r in linhas:
        if r["tipo"] == "leitura":
            familia = str(r["familia"])
            if r["tokens"] is None:
                sem_tokens[familia] = sem_tokens.get(familia, 0) + 1
            else:
                tokens[familia] = tokens.get(familia, 0) + r["tokens"]
    totais = {
        "decorrido_minutos": _minutos(decorrido),
        "decorrido_de": encomenda["inicio"] if encomenda else None,
        "decorrido_ate": max(fins).strftime("%Y-%m-%dT%H:%M:%SZ") if fins else None,
        "minutos_de_passos": _minutos(sum(r["_segundos"] or 0 for r in linhas if r["tipo"] == "passo")),
        "minutos_de_leituras": _minutos(sum(r["_segundos"] or 0 for r in linhas if r["tipo"] == "leitura")),
        "tokens_por_familia": tokens,
        "leituras_sem_tokens_por_familia": sem_tokens,
        "fim_da_primeira_escrita": primeira_escrita.strftime("%Y-%m-%dT%H:%M:%SZ") if primeira_escrita else None,
        "reportagens_depois_da_escrita": sum(1 for r in linhas if r["tipo"] == "passo" and r["nome"] == "reportagem" and depois_da_escrita(r)),
        "leituras_numeros_depois_da_escrita": sum(1 for r in linhas if r["tipo"] == "leitura" and r["lugar"] == "numeros" and depois_da_escrita(r)),
    }
    for r in linhas:
        del r["_segundos"]
    return {"peca": peca.id, "oficina_lida": oficina is not None, "linhas": linhas, "totais": totais}


def texto(dados: dict) -> str:
    """The cost as lines for the team: one row per step and reading, then the totals."""
    cab = ("start", "end", "what", "seat", "family", "model", "min", "tokens", "plants", "findings/adopted", "verdict")
    filas = [cab]
    for r in dados["linhas"]:
        leitura = r["tipo"] == "leitura"
        filas.append((
            str(r["inicio"]), str(r["fim"]), ("reading" if leitura else f"step {r['nome']}"), str(r["lugar"]),
            str(r["familia"]), str(r["modelo"]), str(r["minutos"] if r["minutos"] is not None else "?"),
            (str(r["tokens"]) if r.get("tokens") is not None else "not known") if leitura else "",
            r.get("plantas", "") if leitura else "",
            f"{r.get('achados')}/{r.get('adotados')}" if leitura else "",
            str(r.get("veredicto", "")) if leitura else "",
        ))
    largos = [max(len(f[i]) for f in filas) for i in range(len(cab))]
    saida = [f"cost of {dados['peca']}" + ("" if dados["oficina_lida"] else " (OEDP_OFICINA not set: no tokens read)")]
    saida += ["  ".join(c.ljust(largos[i]) for i, c in enumerate(f)).rstrip() for f in filas]
    t = dados["totais"]
    familias = sorted(set(t["tokens_por_familia"]) | set(t["leituras_sem_tokens_por_familia"]))
    tokens = "; ".join(f"{f}: {t['tokens_por_familia'].get(f, 0)} tokens"
                       + (f" ({t['leituras_sem_tokens_por_familia'][f]} readings with none known)" if f in t["leituras_sem_tokens_por_familia"] else "")
                       for f in familias) or "no readings"
    saida += [
        "",
        f"elapsed, commission start to the last end on the record: {t['decorrido_minutos'] or '?'} min "
        f"({t['decorrido_de'] or 'no encomenda step'} to {t['decorrido_ate'] or '?'})",
        f"minutes of steps: {t['minutos_de_passos']}",
        f"minutes of readings: {t['minutos_de_leituras']}",
        f"tokens by family: {tokens}",
        f"after the first escrita step ended ({t['fim_da_primeira_escrita'] or 'no escrita step'}): "
        f"{t['reportagens_depois_da_escrita']} reportagem steps began, {t['leituras_numeros_depois_da_escrita']} numeros readings began",
    ]
    return "\n".join(saida) + "\n"
