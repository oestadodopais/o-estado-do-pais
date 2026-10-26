"""Uma construção e uma corrida de cada conferência pedida; conserva os códigos."""
import os,subprocess
from pathlib import Path
p=Path(__file__).resolve().parent
amb=dict(os.environ,RESEARCHHUB_DIR=str(Path.cwd().parents[1]/'ResearchHub-worktrees/cr2-2026-10-26'))
assert Path(amb['RESEARCHHUB_DIR']).is_dir()
for nome,cmd in [('build',['npm','run','build']),('ledger-check',['npm','run','ledger:check']),('check-voz',['npm','run','check:voz']),('check-registo',['npm','run','check:registo']),('check-cartao',['npm','run','check:cartao']),('check-cruzamento',['npm','run','check:cruzamento','--','--with-origin']),('typecheck',['npm','run','typecheck'])]:
 r=subprocess.run(['sh','scripts/leituras/curto.sh',str(p.relative_to(Path.cwd())/(nome+'-g.log')),*cmd],env=amb)
 (p/(nome+'.codigo')).write_text(str(r.returncode)+'\n')
 # Os registos guardados não expõem os caminhos locais impressos pelas ferramentas.
 f=p/(nome+'-g.log');s=f.read_text();s=s.replace(str(Path.cwd()),'<worktree>').replace(amb['RESEARCHHUB_DIR'],'<motor>');f.write_text(s)
