#!/usr/bin/env python3
"""Conferências documentais do fecho, sem voltar a correr os portões."""
import json, re, subprocess
from pathlib import Path
pasta=Path(__file__).resolve().parent
raiz=Path.cwd()
cabeca=(pasta/'portoes/cabeca').read_text().strip()
base='4d85508f736774e1fdca1ae4093eafe5e2b591d3'
def git(*args):return subprocess.check_output(['git',*args],text=True).strip()
novos=git('diff','--name-only',base,cabeca).splitlines()
capturas=raiz/'design/especime-v3/capturas/h2-2026-10-04'
ficheiros=sorted(set([Path(f) for f in novos]+[f for arvore in [pasta,capturas] for f in arvore.rglob('*') if f.is_file()]))
# Os padrões literais vêm do ambiente; não se escrevem no resultado.
proibidos=[str(raiz),str(Path.home()),Path.home().name]
def ve(s):
    return any(p.lower() in s.lower() for p in proibidos) or bool(re.search(r'/(?:private/)?var/folders/[a-z0-9]{2}/',s))
assert ve(str(raiz/'ficheiro-plantado')),'O detetor não encontra o conhecido-positivo.'
ficheiros=[f for f in ficheiros if f.name!='privacidade-entrega.json']
falhas=[]
for f in ficheiros:
    if ve(f.read_text(errors='replace')):falhas.append(str(f.relative_to(raiz) if f.is_absolute() else f))
trailers=[]
for commit in git('rev-list',f'{base}..{cabeca}').splitlines():
    corpo=git('show','-s','--format=%B',commit)
    trailers.append({'commit':commit,'co_autoria':'Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>' in corpo,'sessao':'Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g' in corpo})
assert not falhas,f'Caminho ou nome local em: {falhas}'
assert all(x['co_autoria'] and x['sessao'] for x in trailers)
assert git('branch','--show-current')=='h2-2026-10-04'
assert all((pasta/f'portoes/{g}.codigo').read_text().strip()=='0' for g in ['build','verify','typecheck'])
assert (pasta/'portoes/cabeca.fim').read_text().strip()==cabeca
saida=dict(comando='python3 design/especime-v3/medicoes/h2-2026-10-04/conferir-entrega.py',cabeca_codigo=cabeca,ficheiros_lidos=len(ficheiros),falhas=falhas,trailers=trailers,conhecido_positivo={'o_que':'um caminho do ambiente plantado em memória é encontrado pelo mesmo detetor','encontrado':True})
(pasta/'privacidade-entrega.json').write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print('Fecho documental conferido: caminhos, trailers, ramo e códigos dos portões.')
