#!/usr/bin/env python3
"""Planta um estrago num pacote de leitura e regista-o por sha256, com o contexto impresso antes e depois.
uso: plantar.py <pacote> <ficheiro relativo> <id> <descricao> <texto antigo> <texto novo>
"""
import sys, json, hashlib, pathlib, datetime
pacote, rel, pid, desc, old, new = sys.argv[1:7]
p = pathlib.Path(pacote) / rel
t = p.read_text(encoding='utf-8')
assert t.count(old) == 1, f'{rel}: {t.count(old)} ocorrência(s) de {old!r}'
i = t.index(old)
antes = t[max(0, i-160): i+len(old)+160]
sha_antes = hashlib.sha256(t.encode('utf-8')).hexdigest()
t2 = t.replace(old, new)
sha_depois = hashlib.sha256(t2.encode('utf-8')).hexdigest()
j = i
depois = t2[max(0, j-160): j+len(new)+160]
p.write_text(t2, encoding='utf-8')
reg = pathlib.Path(pacote).with_suffix('').as_posix() + '.plantas.json'
reg = pathlib.Path(reg)
d = json.loads(reg.read_text(encoding='utf-8')) if reg.exists() else {"registado_em": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), "copia": pacote, "plantas": []}
d["plantas"].append({"id": pid, "ficheiro": rel, "descricao": desc, "sha256_antes": sha_antes, "sha256_depois": sha_depois, "contexto_antes": antes, "contexto_depois": depois})
reg.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'planta {pid} em {rel}: {sha_antes[:12]} -> {sha_depois[:12]}; registo em {reg}')
