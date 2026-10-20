"""Entrega HB1 pelo exportador comum, limitada ao arquivo deste sítio."""
import argparse,sys,subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args();site=Path.cwd();sys.path.insert(0,str(a.motor))
from publisher import hb1_documentos,export_records_site as R
subprocess.run([sys.executable,'scripts/hb1-exportar-linhas.py',str(a.motor)],check=True)
hb1_documentos.run(site)
archive=R.estudos_do_sitio(site)
# EO1 ainda não pertence ao arquivo desta worktree. As edições existentes
# continuam todas sujeitas às provas e à guarda de órfãos do exportador.
R.SITE_EDITIONS={k:v for k,v in R.SITE_EDITIONS.items() if v[0] in archive}
raise SystemExit(R.run(a.motor,site,write=True))
