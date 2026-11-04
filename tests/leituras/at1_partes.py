"""Inclui as plantas das partes na descoberta do check:leituras."""
from pathlib import Path
import subprocess
raise SystemExit(subprocess.call(['node', str(Path(__file__).with_name('at1-partes.mjs'))]))
