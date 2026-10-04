"""Constrói os dados anteriores ao OE1 na mesma worktree e repõe todos os bytes.

Os portões conservam a tranca comum. A cabeça Git não muda; o ficheiro base-l1.json
identifica o commit dos ficheiros usados nesta comparação temporária.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, os, re, shutil, subprocess
from publisher.oe1_run import clean

root = Path.cwd()
here = Path("design/especime-v3/medicoes/oe1-2026-10-04")
base = "eee1677fff963ce0758a23067b9fdf32185f3147"
paths = ["src/data/studies.mjs", "src/data/areas.mjs", "src/i18n/lingua-dos-titulos.mjs",
         "src/i18n/unidades.mjs", "src/lib/ledger.mjs", "tests/linha/cadeias-proveniencia.mjs",
         "design/especime-v3/INVENTARIO-FRASES.md", "ledger/cruzamentos/oe1.json"]
rows = json.loads(Path("ledger/cruzamentos/oe1.json").read_text())["rows"]
paths += [f"ledger/claims/{slug}.yml" for slug in rows]
backup = {name: Path(name).read_bytes() for name in paths}
original_head = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
old_dist = Path("node_modules/.oe1-comparacao/dist-final")
assert not old_dist.exists(), "Uma cópia anterior exige inspeção."
old_dist.parent.mkdir(parents=True, exist_ok=True)
receipt = {"commit_dos_ficheiros": base, "cabeca_git": original_head, "inicio": datetime.now(timezone.utc).isoformat(), "ficheiros_temporariamente_repostos": paths}
try:
    Path("dist").rename(old_dist)
    for name in paths:
        r = subprocess.run(["git", "show", f"{base}:{name}"], capture_output=True)
        if r.returncode == 0:
            Path(name).write_bytes(r.stdout)
        else:
            assert name.startswith("ledger/"), name
            Path(name).unlink()
    env = dict(os.environ)
    env["OE1_GATE_OUTPUT"] = str(here / "oe1b-base/portoes")
    r = subprocess.run(["sh", "scripts/leituras/portoes.sh", ".", env["OE1_GATE_OUTPUT"]], env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (here / "oe1b-base/corrida.log").write_text(re.sub(r"<utilizador>/[^\s\"']+", "<outra-worktree>", clean(r.stdout)))
    receipt["codigo_do_corredor"] = r.returncode
    codes = {n: int((here / "oe1b-base/portoes" / (n + ".codigo")).read_text()) for n in ["build", "verify", "typecheck", "ledger"]}
    receipt["codigos"] = codes
    assert codes["build"] == 0, "A construção da base tem de terminar antes da comparação."
    r = subprocess.run(["node", "scripts/check-lugar.mjs"], env={**env, "AMOSTRA": "100000"}, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (here / "oe1b-base/l1-check-lugar.log").write_text(clean(r.stdout))
    receipt["codigo_da_medicao"] = r.returncode
    assert r.returncode == 0, "A base tem de passar a sua régua."
finally:
    for name, data in backup.items():
        Path(name).write_bytes(data)
    if old_dist.exists():
        if Path("dist").exists(): shutil.rmtree("dist")
        old_dist.rename("dist")
    receipt["reposicao_conferida"] = all(Path(name).read_bytes() == data for name, data in backup.items())
    receipt["cabeca_conservada"] = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip() == original_head
    receipt["fim"] = datetime.now(timezone.utc).isoformat()
    (here / "base-l1.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: v for k, v in receipt.items() if k != "ficheiros_temporariamente_repostos"}, ensure_ascii=False))
    assert receipt["reposicao_conferida"] and receipt["cabeca_conservada"]
