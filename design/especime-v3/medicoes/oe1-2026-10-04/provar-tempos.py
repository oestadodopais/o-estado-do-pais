"""Prova a precisão dos tempos com ficheiros sintéticos e isolados."""
from pathlib import Path
import importlib.util, json, tempfile

here = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("medicao_de_teste", here / "medir.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
results = []
with tempfile.TemporaryDirectory(prefix="oe1-tempos-") as directory:
    root = Path(directory)
    module.HERE = root
    gates = root / "portoes"
    gates.mkdir()
    (root / "corrida-sitio.inicio").write_text("2026-10-04T08:00:00.123456+00:00\n")
    (gates / "cabeca").write_text("cabeca-sintetica\n")
    (gates / "build.inicio").write_text("2026-10-04T08:00:00Z\n")
    (gates / "build.fim").write_text("2026-10-04T08:00:10Z\n")
    (gates / "build.codigo").write_text("0\n")
    def case(name, expected):
        actual = module.gate("build")["codigo"]
        assert actual == expected, name
        results.append({"nome": name, "passou": True})
    case("Início no mesmo segundo, com fim posterior, é aceite", 0)
    (gates / "build.fim").write_text("2026-10-04T07:59:59Z\n")
    case("Um código antigo com fim anterior é recusado", None)
    (gates / "build.fim").unlink()
    case("Uma corrida sem fim é recusada", None)
    (gates / "build.fim").write_text("2026-10-04T08:00:00Z\n")
    case("Fim anterior aos microssegundos da nova corrida é recusado", None)
    (gates / "build.fim").write_text("2026-10-04T08:00:10Z\n")
    (gates / "build.codigo").write_text("1\n")
    case("Um código de falha conserva-se como falha", 1)
(here / "plantas-tempos.json").write_text(json.dumps({"ficheiros_sinteticos": True, "casos": results}, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"casos": len(results), "todos_passaram": all(r["passou"] for r in results)}))
