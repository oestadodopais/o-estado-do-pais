#!/usr/bin/env python3
"""C2 (05.10.2026): o alarme do vigia da página da Comissão no painel do fim, lido.

O painel delimitado do fim (o motor, `indicators/out/c2-2026-10-05/painel/`) partiu do estado do motor de 28.09.2026
e deu o alarme «the numeric content of the Commission MIP scoreboard page changed». Este guião lê as duas cópias da
página que o motor aloja (a de 28.09.2026, pela corrida do gerador do C1c, e a de hoje, pela corrida do painel), confere
o sha256 de cada uma contra o registo da sua corrida, refaz a impressão digital do vigia com a função do próprio painel
(`refresh.threshold_fingerprint`) e compara-a com a que cada estado guarda, e diz o que mudou nas linhas com
algarismos: as linhas que saíram e as que entraram, e se os números de uma e de outra são os mesmos.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/limiar-da-comissao.py --motor <worktree do motor>
"""
import argparse
import difflib
import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ALVO = "economic-and-fiscal-governance/macroeconomic-imbalance-procedure/scoreboard_en"


def linhas_com_algarismos(raw: bytes) -> list[str]:
    """A mesma redução do vigia, escrita aqui para a comparação linha a linha."""
    text = raw.decode("utf-8", "replace")
    text = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", text)
    text = re.sub(r"(?s)<!--.*?-->", " ", text)
    text = re.sub(r"<[^>]+>", "\n", text)
    return [" ".join(l.split()) for l in text.splitlines() if l.strip() and any(c.isdigit() for c in l)]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--motor", type=Path, required=True)
    motor = ap.parse_args().motor.expanduser().resolve()
    sys.path.insert(0, str(motor))
    from indicators.refresh import threshold_fingerprint

    def corpo(corrida: str, chave_ficheiro: str) -> dict:
        pasta = motor / "indicators" / "out" / corrida
        for l in (pasta / "pedidos.jsonl").read_text(encoding="utf-8").splitlines():
            r = json.loads(l)
            if ALVO in str(r.get("url")) and r.get("ficheiro"):
                b = (pasta / r["ficheiro"]).read_bytes()
                assert hashlib.sha256(b).hexdigest() == r["sha256"], f"{corrida}: o corpo não tem o sha256 do registo"
                return {"corrida": f"indicators/out/{corrida}", "quando": r.get("quando") or r.get("hora"), "http": r.get("http"),
                        "sha256": r["sha256"], "ficheiro": r["ficheiro"], "bytes": b}
        raise SystemExit(f"{corrida}: sem a página da Comissão")

    velho = corpo("releitura-c1c-2026-09-28", "ficheiro")
    novo = corpo("c2-2026-10-05/painel", "ficheiro")
    base = json.loads(subprocess.check_output(["git", "-C", str(motor), "show", "c2-2026-10-05:indicators/canary_baseline.json"], text=True))
    hosp = json.loads((motor / "indicators/out/c2-2026-10-05/painel/canary_baseline.json").read_text(encoding="utf-8"))
    iv, nv = threshold_fingerprint(velho["bytes"])
    inn, nn = threshold_fingerprint(novo["bytes"])
    lv, ln = linhas_com_algarismos(velho["bytes"]), linhas_com_algarismos(novo["bytes"])
    diff = [d for d in difflib.unified_diff(lv, ln, lineterm="", n=0) if d[:1] in "+-" and not d.startswith(("+++", "---"))]
    numeros = lambda xs: Counter(n for x in xs for n in re.findall(r"\d+(?:[.,]\d+)?", x))
    saida = {
        "_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/limiar-da-comissao.py. Não se edita à mão.",
        "pagina": "https://" + "economy-finance.ec.europa.eu/" + ALVO,
        "copia_de_28_09": {k: v for k, v in velho.items() if k != "bytes"},
        "copia_de_hoje": {k: v for k, v in novo.items() if k != "bytes"},
        "impressao_de_28_09": iv, "linhas_com_algarismos_de_28_09": nv,
        "impressao_de_hoje": inn, "linhas_com_algarismos_de_hoje": nn,
        "impressao_no_estado_do_motor": base.get("_threshold_watch"),
        "impressao_no_estado_da_corrida_do_fim": hosp.get("_threshold_watch"),
        "linhas_que_sairam": [d[1:] for d in diff if d.startswith("-")],
        "linhas_que_entraram": [d[1:] for d in diff if d.startswith("+")],
        "os_numeros_das_linhas_sao_os_mesmos": numeros(lv) == numeros(ln),
        "linhas_iguais_sem_maiusculas_e_sem_ordem": sorted(x.lower() for x in lv) == sorted(x.lower() for x in ln),
        "conhecido_positivo": {
            "o_que": "a impressão refeita da cópia de 28.09 é a do estado do motor, e a de hoje é a do estado da corrida do fim",
            "encontrado": iv == base.get("_threshold_watch") and inn == hosp.get("_threshold_watch"),
        },
    }
    (AQUI / "limiar-da-comissao.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: saida[k] for k in ("os_numeros_das_linhas_sao_os_mesmos", "linhas_iguais_sem_maiusculas_e_sem_ordem")}
                     | {"saíram": len(saida["linhas_que_sairam"]), "entraram": len(saida["linhas_que_entraram"]),
                        "conhecido_positivo": saida["conhecido_positivo"]["encontrado"]}, ensure_ascii=False))
    return 0 if saida["conhecido_positivo"]["encontrado"] else 1


if __name__ == "__main__":
    sys.exit(main())
