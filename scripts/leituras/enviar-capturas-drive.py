#!/usr/bin/env python3
"""Leva as capturas de um bloco para o Drive do financiador, numa subpasta da pasta das capturas (o id da pasta vem
do ambiente, OEDP_DRIVE_CAPTURAS, e nunca deste repositório), pelo gws (`gws drive files create --upload`), e escreve
ao lado um manifesto com o id de cada ficheiro no Drive. Nada se apaga nem se substitui: uma subpasta com o mesmo nome
é reutilizada, e um ficheiro com o mesmo nome já na subpasta não se envia outra vez (a retoma depois de um erro do gws).
uso: OEDP_DRIVE_CAPTURAS=<id da pasta> enviar-capturas-drive.py <pasta local com PNG> <nome da subpasta> [<manifesto .json>]"""
import json, os, subprocess, sys, pathlib
PAI = os.environ.get('OEDP_DRIVE_CAPTURAS') or sys.exit('falta OEDP_DRIVE_CAPTURAS no ambiente (o id da pasta das capturas no Drive)')
pasta = pathlib.Path(sys.argv[1]); nome = sys.argv[2]; saida = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else pasta / 'drive.json'
def gws(*args):
    r = subprocess.run(['gws', *args], capture_output=True, text=True)
    if r.returncode != 0: raise SystemExit(f'gws falhou ({r.returncode}): {" ".join(args)[:200]}\n{r.stderr[-800:]}')
    return json.loads(r.stdout) if r.stdout.strip() else {}
q = f"'{PAI}' in parents and name = '{nome.replace(chr(39), chr(92)+chr(39))}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
lista = gws('drive', 'files', 'list', '--params', json.dumps({'q': q, 'fields': 'files(id,name)', 'pageSize': 5}))
if lista.get('files'):
    sub = lista['files'][0]['id']; print('subpasta existente', nome, sub)
else:
    sub = gws('drive', 'files', 'create', '--json', json.dumps({'name': nome, 'mimeType': 'application/vnd.google-apps.folder', 'parents': [PAI]}), '--params', json.dumps({'fields': 'id'}))['id']; print('subpasta criada', nome, sub)
existentes = set()
tok = None
while True:
    params = {'q': f"'{sub}' in parents and trashed = false", 'fields': 'nextPageToken,files(name)', 'pageSize': 1000}
    if tok: params['pageToken'] = tok
    r = gws('drive', 'files', 'list', '--params', json.dumps(params))
    existentes |= {f['name'] for f in r.get('files', [])}
    tok = r.get('nextPageToken')
    if not tok: break
print('já no Drive:', len(existentes))
ficheiros = sorted(p for p in pasta.rglob('*.png'))
if not ficheiros: raise SystemExit('nenhum PNG em ' + str(pasta))
manifesto = {'subpasta': nome, 'id': sub, 'ficheiros': []}
for p in ficheiros:
    rel = p.relative_to(pasta).as_posix().replace('/', ' · ')
    if rel in existentes: continue
    r = gws('drive', 'files', 'create', '--upload', str(p), '--upload-content-type', 'image/png', '--json', json.dumps({'name': rel, 'parents': [sub]}), '--params', json.dumps({'fields': 'id,name,size'}))
    manifesto['ficheiros'].append({'local': p.relative_to(pasta).as_posix(), 'drive_id': r.get('id'), 'bytes': int(r.get('size') or 0)}); print('enviado', rel, r.get('id'))
saida.write_text(json.dumps(manifesto, ensure_ascii=False, indent=1) + '\n'); print(len(ficheiros), 'ficheiros; manifesto em', saida)
