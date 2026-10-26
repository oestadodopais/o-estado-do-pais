"""UE1-c: a seleção não aplica linhas fora do mandato nem aceita ids desconhecidos."""
import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location("aplicar", Path(__file__).resolve().parents[2] / "scripts/aplicar-releituras.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
reg = {"linhas": [{"id": "a"}, {"id": "b"}], "pedidos": ["prova"]}
assert m.selecionar_linhas(reg, "a") == {"linhas": [{"id": "a"}], "pedidos": ["prova"]}
assert len(reg["linhas"]) == 2
assert m.selecionar_linhas(reg, None) is reg
for ids in ("a,x", "a,a", ""):
    try:
        m.selecionar_linhas(reg, ids)
    except SystemExit as e:
        assert "sem releitura válida" in str(e)
    else:
        raise AssertionError(ids)
print("SELECAO_RELEITURAS: PASS · seleção isolada e três recusas")
