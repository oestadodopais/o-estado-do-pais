"""`python3 -m oedp adiante [--dias N]…`: the whole suite at the real clock, then once for each N
days ahead (1 and 400 when none is given), each run in a child process. The moved runs load
the shim of tests/relogio/ (its folder first on PYTHONPATH, the number of days in
OEDP_ENSAIO_DIAS_ADIANTE); the run at the real clock has neither. One line per run: the days,
the tests run, the result and the failing tests by name. Exit 1 if any run fails, or if a moved
run ran a different number of tests from the run at the real clock, so that an import error
under the shim cannot pass as fewer tests.

It lives with the tests, not in oedp/, so that no file of oedp/ names the variable or the shim
(tests/test_esq3i.py); `oedp adiante` only starts it."""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RELOGIO = Path(__file__).resolve().parent / "relogio"
VARIAVEL = "OEDP_ENSAIO_DIAS_ADIANTE"
DIAS = (1, 400)

_CORREU = re.compile(r"^Ran (\d+) tests? in ", re.M)
_FALHOU = re.compile(r"^(?:FAIL|ERROR): (.+)$", re.M)


def ambiente(dias: int | None) -> dict[str, str]:
    """This process's environment, with the shim's folder and the variable for `dias`, or with
    neither (the real clock) when `dias` is None."""
    env = {k: v for k, v in os.environ.items() if k != VARIAVEL}
    caminhos = [p for p in env.pop("PYTHONPATH", "").split(os.pathsep) if p and Path(p).resolve() != RELOGIO]
    if dias is not None:
        env[VARIAVEL] = str(dias)
        caminhos.insert(0, str(RELOGIO))
    if caminhos:
        env["PYTHONPATH"] = os.pathsep.join(caminhos)
    return env


def uma_corrida(raiz: Path, dias: int | None) -> tuple[int | None, bool, list[str]]:
    """(tests run, or None when the run said no count; whether it passed; the failing tests)."""
    r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", str(raiz / "tests"), "-t", str(raiz)],
                       cwd=raiz, env=ambiente(dias), capture_output=True, text=True)
    saida = r.stdout + r.stderr
    contagem = _CORREU.findall(saida)
    return (int(contagem[-1]) if contagem else None), r.returncode == 0, _FALHOU.findall(saida)


def correr(dias=DIAS, raiz: Path = RAIZ, imprimir=print) -> int:
    real, ok_real, falhas_real = uma_corrida(raiz, None)
    imprimir(_linha("+0 (real clock)", real, ok_real, falhas_real, None))
    ok = ok_real and real is not None
    for n in dias:
        contagem, passou, falhas = uma_corrida(raiz, n)
        imprimir(_linha(f"+{n}", contagem, passou, falhas, real))
        ok = ok and passou and contagem is not None and contagem == real
    imprimir("adiante: " + ("passed" if ok else "failed"))
    return 0 if ok else 1


def _linha(dias: str, contagem: int | None, passou: bool, falhas: list[str], real: int | None) -> str:
    partes = [f"adiante · days {dias}", "no count of tests run" if contagem is None else f"{contagem} tests"]
    if not passou:
        partes.append("failed" + (": " + "; ".join(falhas) if falhas else ""))
    elif real is not None and contagem != real:
        partes.append(f"failed: ran {contagem} tests, and the run at the real clock ran {real}")
    else:
        partes.append("passed")
    return " · ".join(partes)


def principal(argv=None) -> int:
    p = argparse.ArgumentParser(prog="python3 -m oedp adiante")
    p.add_argument("--dias", type=int, action="append", help="days ahead; repeatable (default 1 and 400)")
    a = p.parse_args(argv)
    if a.dias and any(n < 1 for n in a.dias):
        print("refused: --dias is a whole number of 1 or more", file=sys.stderr)
        return 2
    return correr(tuple(a.dias) if a.dias else DIAS)


if __name__ == "__main__":
    sys.exit(principal())
