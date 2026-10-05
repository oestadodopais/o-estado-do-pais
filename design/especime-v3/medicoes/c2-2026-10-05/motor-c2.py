#!/usr/bin/env python3
"""C2 (05.10.2026): o que o ramo do motor fez, lido da worktree do motor e escrito em motor/motor-c2.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/motor-c2.py --motor <worktree do motor>

Lê, sem escrever nada no motor: a cabeça e os commits do ramo sobre o `master`; a releitura
(`indicators/out/c2-2026-10-05/releitura/releitura.json`) e o seu registo de pedidos, com os sha256; a
corrida do painel do fim (`painel.log`, `painel.codigo`, os pedidos e o relatório da corrida); a árvore limpa;
e os ficheiros que o ramo mudou, contra a lista dos que não se tocam (`indicators/*.json` na raiz de
`indicators/`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`). Nenhum
caminho da máquina entra no ficheiro: os caminhos são relativos à raiz do motor.
"""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
OUT = "indicators/out/c2-2026-10-05"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--motor", type=Path, required=True)
    motor = ap.parse_args().motor.expanduser().resolve()
    git = lambda *a: subprocess.check_output(["git", "-C", str(motor), *a], text=True).strip()
    sha = lambda p: hashlib.sha256((motor / p).read_bytes()).hexdigest()
    cabeca, base = git("rev-parse", "HEAD"), git("rev-parse", "master")
    commits = [l.split(" ", 1) for l in git("log", "--format=%h %s", f"{base}..{cabeca}").splitlines()]
    mudados = git("diff", "--name-only", f"{base}..{cabeca}").splitlines()
    protegidos = [f for f in mudados if re.fullmatch(r"indicators/[^/]+\.json", f) or f.startswith((".maintenance-locks/", "sweeps/"))
                  or f == "publisher/recortes/manifest.regioes.json"]
    estado = git("status", "--short")
    rel = json.loads((motor / OUT / "releitura/releitura.json").read_text(encoding="utf-8"))
    log = (motor / OUT / "painel.log").read_text(encoding="utf-8")
    m = re.search(r"reconferências escritas: (\d+) igual · (\d+) diverge · (\d+) inacessível(?: · (\d+) já escrita\(s\) hoje)?", log)
    a = re.search(r"(\d+) alarm\(s\) · (\d+) notice\(s\)", log)
    c = re.search(r"(\d+) claims in study 'quadro-institucional'", log)
    relatorio = json.loads((motor / OUT / "painel/refresh_report.json").read_text(encoding="utf-8"))
    pedidos_painel = (motor / OUT / "painel/pedidos.jsonl").read_text(encoding="utf-8").splitlines()
    saida = {
        "_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/motor-c2.py a partir da worktree do motor. Não se edita à mão.",
        "ramo": git("rev-parse", "--abbrev-ref", "HEAD"), "cabeca": cabeca, "master": base,
        "commits": [{"commit": h, "assunto": s} for h, s in commits],
        "arvore_limpa": estado == "",
        "ficheiros_mudados": len(mudados),
        "ficheiros_protegidos_mudados": protegidos,
        "conhecido_positivo_dos_protegidos": {
            "o_que": "a mesma regra reconhece um ficheiro de estado do painel pelo nome",
            "encontrado": bool(re.fullmatch(r"indicators/[^/]+\.json", "indicators/vintages.json")),
        },
        "releitura": {
            "ficheiro": f"{OUT}/releitura/releitura.json", "sha256": sha(f"{OUT}/releitura/releitura.json"),
            "pedidos_sha256": sha(f"{OUT}/releitura/pedidos.jsonl"), "quando": rel["quando"],
            "cabeca_do_sitio_lida": rel["cabeca_do_sitio"], "cabeca_do_motor_lida": rel["cabeca_do_motor"],
            "contagens": rel["contagens"], "bytes_dos_pedidos": [p["bytes"] for p in rel["pedidos"]],
            "codigo": int((motor / OUT / "releitura.codigo").read_text().strip()),
            "linhas": [{k: r[k] for k in ("id", "valor_antigo", "valor_novo", "literal_antigo", "literal_novo", "bandeira_antiga",
                                          "bandeira_nova", "carimbo_anterior", "carimbo_novo", "acesso_antigo", "gerador_da_linha")}
                       | {"corrida_do_corpo_anterior": r["corpo_anterior"]["corrida"], "quando_do_corpo_anterior": r["corpo_anterior"]["quando"],
                          "painel_carimbo_registado": (r["painel_na_cabeca_do_motor"]["vintages_ultima_entrada"] or {}).get("updated"),
                          "found_do_painel": (r["verificacao_divergente_no_sitio"] or {}).get("found")}
                       for r in rel["linhas"]],
        },
        "painel_do_fim": {
            "codigo": int((motor / OUT / "painel.codigo").read_text().strip()),
            "inicio": (motor / OUT / "painel.inicio").read_text().strip(), "fim": (motor / OUT / "painel.fim").read_text().strip(),
            "linhas_do_estudo": int(c.group(1)) if c else None,
            "escritas_igual": int(m.group(1)) if m else None, "escritas_diverge": int(m.group(2)) if m else None,
            "escritas_inacessivel": int(m.group(3)) if m else None, "ja_escritas_hoje": int(m.group(4) or 0) if m else None,
            "alarmes": int(a.group(1)) if a else None, "avisos": int(a.group(2)) if a else None,
            "pedidos": len(pedidos_painel),
            "alarmes_do_relatorio": [{"id": e.get("id"), "canary": e.get("canary"), "mensagem": e.get("message")} for e in relatorio if e.get("severity") == "alarm"],
            "conhecido_positivo": {"o_que": "o registo da corrida tem a linha das reconferências e a dos alarmes", "encontrado": bool(m and a and c)},
        },
    }
    (AQUI / "motor").mkdir(exist_ok=True)
    (AQUI / "motor" / "motor-c2.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"cabeca": cabeca[:7], "commits": len(commits), "arvore_limpa": saida["arvore_limpa"],
                      "protegidos_mudados": len(protegidos), "painel": {k: saida["painel_do_fim"][k] for k in
                      ("escritas_igual", "escritas_diverge", "escritas_inacessivel", "ja_escritas_hoje", "alarmes")}}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
