"""Corre o portão sem pipe e guarda o código e o tempo medidos."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import time


def limpar(texto, motor, sitio):
    for origem, destino in ((str(motor), "<motor>"), (str(sitio), "<worktree>"),
                            (str(Path.home()), "<casa>"), (Path.home().name, "<utilizador>")):
        texto = texto.replace(origem, destino)
    # Os rastos de bibliotecas do sistema não são caminhos do projeto.
    import re
    return re.sub(r'File "(/[^\"]+)"', 'File "<ambiente>"', texto)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--motor", type=Path, required=True)
    p.add_argument("--sitio", type=Path, required=True)
    p.add_argument("--nome", required=True)
    a = p.parse_args()
    a.motor, a.sitio = a.motor.resolve(), a.sitio.resolve()
    pasta = Path(__file__).parent / "portoes"
    pasta.mkdir(exist_ok=True)
    inicio = time.monotonic()
    cabeca = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=a.motor, text=True).strip()
    r = subprocess.run(["python3", "-u", "-m", "core.gate"], cwd=a.motor,
                       env={**os.environ, "OEDP_SITE": str(a.sitio)}, capture_output=True, text=True)
    (pasta / f"{a.nome}.log").write_text(limpar(r.stdout + r.stderr, a.motor, a.sitio))
    (pasta / f"{a.nome}.codigo").write_text(f"{r.returncode}\n")
    (pasta / f"{a.nome}.json").write_text(json.dumps({
        "comando": "OEDP_SITE=<worktree> python3 -m core.gate", "cabeca": cabeca,
        "codigo": r.returncode, "segundos": round(time.monotonic() - inicio, 3)}, indent=2) + "\n")
    print((pasta / f"{a.nome}.codigo").read_text().strip())
    return r.returncode


if __name__ == "__main__":
    raise SystemExit(main())
