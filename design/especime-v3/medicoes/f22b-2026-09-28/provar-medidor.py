"""Prova que o medidor lê todo o pacote, incluindo ficheiros binários e aninhados."""
import importlib.util
import tempfile
from pathlib import Path

spec = importlib.util.spec_from_file_location("medir", Path(__file__).with_name("medir.py"))
medir = importlib.util.module_from_spec(spec)
spec.loader.exec_module(medir)
positivo = b"/" + b"Users/" + b"pessoa/projeto/prova.log"
assert medir.caminhos_pessoais(positivo)
assert not medir.caminhos_pessoais(b"<motor>/indicators/prova.py")
with tempfile.TemporaryDirectory() as tmp:
    pasta = Path(tmp)
    (pasta / "limpo.txt").write_text("Prova sem caminho pessoal.\n")
    (pasta / "aninhado").mkdir()
    alvo = pasta / "aninhado/prova.bin"
    alvo.write_bytes(b"\x00" + positivo)
    try:
        medir.conferir_pacote(pasta)
    except SystemExit as e:
        assert "aninhado/prova.bin" in str(e)
    else:
        raise AssertionError("O varrimento não viu a planta no ficheiro binário")
    alvo.write_bytes(b"\x00conteudo limpo")
    assert medir.conferir_pacote(pasta) == 2
print("PASS 4 conferências do detetor e do varrimento integral")
