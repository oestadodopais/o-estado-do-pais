"""O trabalho final usa apenas as dependências da árvore esparsa."""
from pathlib import Path
import subprocess
raise SystemExit(subprocess.call(['node', str(Path(__file__).with_name('vel1-workflow.mjs'))]))
