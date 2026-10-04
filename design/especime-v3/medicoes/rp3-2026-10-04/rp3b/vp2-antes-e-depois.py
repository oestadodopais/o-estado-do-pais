#!/usr/bin/env python3
"""RP3-b: as duas plantas da célula do Eurostat contra a VP2 de antes e a de depois, em vp2-antes-e-depois.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/rp3b/vp2-antes-e-depois.py <worktree do motor>

A VP2 de antes é a do commit f97e66e do motor (lida com `git show`, carregada como módulo à parte); a de depois é a
da cabeça. As mesmas duas entradas forjadas da suíte (o valor de um ponto só numa anotação, com outro número no
`value`, num corpo com os resumos postos em dia; e a marca «e» de uma célula omitida no ponto e no excerto) correm
pelas duas: a de antes deixa-as passar, e a de depois para-as. Escreve-se o que cada uma disse, sem caminhos.
"""
import copy
import hashlib
import importlib.util
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

MOTOR = pathlib.Path(sys.argv[1]).resolve()
sys.path.insert(0, str(MOTOR))
from publisher import export_series as DEPOIS  # noqa: E402
from publisher import series_paises as SP  # noqa: E402

antiga = subprocess.run(["git", "-C", str(MOTOR), "show", "f97e66e:publisher/export_series.py"], capture_output=True, text=True, check=True).stdout
tmp = pathlib.Path(tempfile.mkdtemp())
(tmp / "export_series_antes.py").write_text(antiga, encoding="utf-8")
spec = importlib.util.spec_from_file_location("export_series_antes", tmp / "export_series_antes.py")
ANTES = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ANTES)

doc = json.loads((MOTOR / "content/13 Dominios/series-periodo.json").read_text(encoding="utf-8"))
serie = lambda d, sid: next(s for s in d["series"] if s["id"] == sid)

# 1 · o corpo forjado da S12, numa cópia da fonte, com os resumos postos em dia
fonte = tmp / "source"
shutil.copytree(MOTOR / "content/13 Dominios/source", fonte)
reg = json.loads((fonte / "FETCH.json").read_text(encoding="utf-8"))
rel = next(r for r in reg["files"] if r.endswith("eurostat-serie-ihpc-rendas-variacao-homologa.json"))
corpo = (fonte / rel).read_text(encoding="utf-8")
forjado = corpo.replace('"367":5.2', '"367":9.9', 1).replace('"extension":{', '"extension":{"annotation":{"367":5.2},', 1).encode("utf-8")
resumo = hashlib.sha256(forjado).hexdigest()
(fonte / rel).write_bytes(forjado)
reg["files"][rel].update(sha256=resumo, bytes=len(forjado))
(fonte / "FETCH.json").write_text(json.dumps(reg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
man = [(f"{resumo}  {rel}" if l.endswith("  " + rel) else l) for l in (fonte / "MANIFEST.sha256").read_text(encoding="utf-8").splitlines()]
(fonte / "MANIFEST.sha256").write_text("\n".join(man) + "\n", encoding="utf-8")
s12 = copy.deepcopy(serie(doc, "serie-ihpc-rendas-variacao-homologa"))
s12["pedidos"][0].update(sha256=resumo, bytes=len(forjado))

# 2 · a marca «e» omitida na S4
s4 = copy.deepcopy(serie(doc, "serie-ihpc-variacao-homologa"))
s4["pontos"][-1]["bandeira"] = None
s4["pontos"][-1]["excerto"] = s4["pontos"][-1]["excerto"].rsplit(" · ", 1)[0]
s4["bandeiras"] = {}

def correr(modulo, s, raiz):
    try:
        modulo.conferir_pontos_eurostat(s, raiz)
        return "passou"
    except Exception as e:  # noqa: BLE001
        return "parou: " + str(e)[:200]

saida = {
    "_": "Escrito por design/especime-v3/medicoes/rp3-2026-10-04/rp3b/vp2-antes-e-depois.py. A VP2 de antes é a do motor em f97e66e; a de depois, a da cabeça.",
    "cabeca_do_motor": subprocess.run(["git", "-C", str(MOTOR), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip(),
    "valor_numa_anotacao": {"antes": correr(ANTES, s12, fonte), "depois": correr(DEPOIS, s12, fonte)},
    "marca_omitida": {"antes": correr(ANTES, s4, SP.SOURCE), "depois": correr(DEPOIS, s4, SP.SOURCE)},
}
destino = pathlib.Path(__file__).resolve().parent / "vp2-antes-e-depois.json"
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(saida, ensure_ascii=False, indent=1))
shutil.rmtree(tmp)
ok = all(v["antes"] == "passou" and v["depois"].startswith("parou") for k, v in saida.items() if isinstance(v, dict))
raise SystemExit(0 if ok else 1)
