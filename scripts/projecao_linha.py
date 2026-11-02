"""Acesso Python à projeção única usada pelas provas JavaScript."""
import subprocess
from pathlib import Path


def projecao_linha(raw: bytes) -> bytes:
    programa = Path(__file__).resolve().with_name('projetar-linha.mjs')
    return subprocess.check_output(['node', str(programa)], input=raw)
