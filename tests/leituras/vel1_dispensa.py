"""Inclui a prova sem rede da dispensa na descoberta das leituras."""
from pathlib import Path
import subprocess
raise SystemExit(subprocess.call(['node', str(Path(__file__).with_name('vel1-dispensa.mjs'))]))
