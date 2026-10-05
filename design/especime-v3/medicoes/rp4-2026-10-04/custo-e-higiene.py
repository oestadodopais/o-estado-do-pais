#!/usr/bin/env python3
"""Lê o custo disponível e limpa os caminhos dos registos antes de os guardar.
Uso: python3 <este guião> <registo do construtor> <jsonl da sessão>
A linha final tokens used só existe depois de o processo Codex terminar.
"""
import datetime, json, pathlib, re, sys
O = pathlib.Path(__file__).resolve().parent
RAIZ = pathlib.Path.cwd()
registo = pathlib.Path(sys.argv[1]).read_text()
sessao = pathlib.Path(sys.argv[2])
def tokens(texto):
    m = re.findall(r'^tokens used\s*\n([\d,]+)\s*$', texto, re.M)
    return int(m[-1].replace(',', '')) if m else None
assert tokens('tokens used\n12,345\n') == 12345
assert tokens('não há contagem') is None
inicio = None
ultimo = None
for linha in sessao.open():
    j = json.loads(linha)
    if inicio is None and j.get('timestamp'): inicio = j['timestamp']
    if j.get('type') == 'event_msg' and j.get('payload', {}).get('type') == 'token_count': ultimo = j
fim = datetime.datetime.now(datetime.timezone.utc)
inicio_dt = datetime.datetime.fromisoformat(inicio.replace('Z', '+00:00'))
modelo = re.search(r'^model: (.+)$', registo, re.M)
usados = tokens(registo)
custo = {
 'comando': 'python3 design/especime-v3/medicoes/rp4-2026-10-04/custo-e-higiene.py <registo> <sessão>',
 'modelo': modelo.group(1) if modelo else None,
 'inicio': inicio, 'medido_em': fim.isoformat(), 'segundos_observados': int((fim-inicio_dt).total_seconds()),
 'tokens_used': usados,
 'linha_tokens_used': None if usados is None else 'tokens used\n'+str(usados),
 'estado': 'a linha final ainda não existe no processo em curso' if usados is None else 'linha final lida do registo',
 'ultimo_evento': {'hora': ultimo['timestamp'], 'uso': ultimo['payload']['info']['total_token_usage']} if ultimo else None,
 'conhecido_positivo': {'linha_sintetica': 'tokens used\n12,345', 'lida': 12345, 'ausencia_recusada': True},
}
(O/'custo.json').write_text(json.dumps(custo, ensure_ascii=False, indent=2)+'\n')
# Sem copiar o registo da sessão: contém o prompt, caminhos e instruções pessoais.
def limpa(texto):
    texto = re.sub(r'\x1b\[[0-9;]*m', '', texto)
    texto = texto.replace(str(RAIZ), '<worktree>')
    texto = texto.replace(str(pathlib.Path.home()), '<pasta-pessoal>')
    texto = re.sub(re.escape('/'+'Users'+'/')+r'[^/\s]+', '<pasta-pessoal>', texto)
    texto = re.sub(re.escape('/'+'private'+'/')+r'(?:tmp|var/folders)/[^\s)\]<>]+', '<temporario>', texto)
    return '\n'.join(l.rstrip() for l in texto.splitlines()).rstrip()+'\n'
assert '/'+'Users'+'/' not in limpa('/'+'Users'+'/'+'pessoa/projeto')
assert limpa('texto \n\n') == 'texto\n'
for p in (O/'portoes').glob('*'):
    if p.suffix in ('.log', '.fim') or p.name=='estado.fim':
        p.write_text(limpa(p.read_text()))
print(json.dumps({'modelo':custo['modelo'],'segundos_observados':custo['segundos_observados'],'tokens_used':usados},ensure_ascii=False))
