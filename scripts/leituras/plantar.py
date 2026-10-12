#!/usr/bin/env python3
"""Planta um estrago num pacote de leitura e regista-o por sha256, com o contexto impresso antes e depois.
uso: plantar.py <pacote> <ficheiro relativo> <id> <descricao> <texto antigo> <texto novo>

M76 (12.10.2026): uma planta só mede o leitor se o pacote trouxer a referência que a desmente. Quando o ficheiro
plantado é um ficheiro do diff da passagem (diff.patch, ou motor/diff.patch para os ficheiros do motor), a linha
plantada tem de estar num hunk desse diff (mudada ou de contexto); se não estiver, o guião recusa a planta, salvo
PLANTA_FORA_DO_DIFF="<a razão>" no ambiente, que fica no registo. Os ficheiros fora do diff (as páginas construídas,
os alojados, os manifestos, as cópias do relatório) não têm esta conferência: a referência deles é outra, e o lugar
de direção responde por ela na descrição.
"""
import sys, os, json, hashlib, pathlib, datetime, re

def linhas_dos_hunks(diff: pathlib.Path, caminho: str):
    """As linhas (sem o primeiro carácter) dos hunks do ficheiro no diff, ou None se o ficheiro não está no diff."""
    if not diff.exists(): return None
    dentro = False; linhas = []; visto = False
    for l in diff.read_text(encoding='utf-8', errors='replace').split('\n'):
        if l.startswith('diff --git '):
            dentro = l.endswith(' b/' + caminho) or (' b/' + caminho + ' ') in l + ' '
            visto = visto or dentro; continue
        if dentro and l[:1] in ('+', '-', ' ') and not l.startswith('+++') and not l.startswith('---'):
            linhas.append(l[1:])
    return linhas if visto else None

pacote, rel, pid, desc, old, new = sys.argv[1:7]
raiz = pathlib.Path(pacote)
p = raiz / rel
t = p.read_text(encoding='utf-8')
assert t.count(old) == 1, f'{rel}: {t.count(old)} ocorrência(s) de {old!r}'
if rel.startswith('motor/'):
    diff, caminho = raiz / 'motor' / 'diff.patch', rel[len('motor/'):]
else:
    diff, caminho = raiz / 'diff.patch', rel
alcance = linhas_dos_hunks(diff, caminho)
fora_do_diff = os.environ.get('PLANTA_FORA_DO_DIFF')
estado_alcance = 'fora do diff da passagem (a referência é outra)'
if alcance is not None:
    primeira = old.split('\n')[0]
    if any(primeira in l for l in alcance):
        estado_alcance = 'na linha de um hunk do diff'
    elif fora_do_diff:
        estado_alcance = f'fora dos hunks do diff, declarado pelo lugar de direção: {fora_do_diff}'
    else:
        sys.exit(f'RECUSADA (M76): {rel} está no diff da passagem, mas a linha plantada não está em nenhum hunk, e o leitor não tem referência para a apanhar. Planta noutra linha, ou declara PLANTA_FORA_DO_DIFF="<a razão>".')
i = t.index(old)
antes = t[max(0, i-160): i+len(old)+160]
sha_antes = hashlib.sha256(t.encode('utf-8')).hexdigest()
t2 = t.replace(old, new)
sha_depois = hashlib.sha256(t2.encode('utf-8')).hexdigest()
depois = t2[max(0, i-160): i+len(new)+160]
p.write_text(t2, encoding='utf-8')
reg = pathlib.Path(pathlib.Path(pacote).with_suffix('').as_posix() + '.plantas.json')
d = json.loads(reg.read_text(encoding='utf-8')) if reg.exists() else {"registado_em": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), "copia": pacote, "plantas": []}
d["plantas"].append({"id": pid, "ficheiro": rel, "descricao": desc, "alcance": estado_alcance, "sha256_antes": sha_antes, "sha256_depois": sha_depois, "contexto_antes": antes, "contexto_depois": depois})
reg.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'planta {pid} em {rel}: {sha_antes[:12]} -> {sha_depois[:12]}; alcance: {estado_alcance}; registo em {reg}')
