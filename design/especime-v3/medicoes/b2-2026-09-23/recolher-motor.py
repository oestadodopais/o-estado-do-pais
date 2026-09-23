#!/usr/bin/env python3
"""Confere as linhas anteriores e recolhe as provas da worktree do motor."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MOTOR = Path.home() / 'Instruments/ResearchHub/.worktrees/b2-peca1-2026-09-23'
BASE = 'aa35e2e'
def git(*args):
    return subprocess.check_output(['git', '-C', str(MOTOR), *args], text=True).strip()

m = {'base': git('rev-parse', BASE), 'cabeca': git('rev-parse', 'HEAD')}
for nome, caminho, lista, chave in (
    ('linhas', 'content/13 Dominios/ledger.json', 'claims', 'id'),
    ('manifesto', 'publisher/manifest.dominios.json', 'rows', 'site_id'),
):
    antes = json.loads(git('show', BASE + ':' + caminho))[lista]
    depois = json.loads((MOTOR / caminho).read_text())[lista]
    indice = {r[chave]: r for r in depois}
    antigas = {r[chave] for r in antes}
    alteradas = [r[chave] for r in antes if indice.get(r[chave]) != r]
    assert not alteradas, alteradas
    m[nome] = {'antes': len(antes), 'depois': len(depois), 'alteradas': len(alteradas),
               'novas': [r[chave] for r in depois if r[chave] not in antigas],
               'novas_total': len(depois) - len(antes)}

m['pedidos'] = []
for l in (MOTOR / 'indicators/out/b2-2026-09-23/pedidos.jsonl').read_text().splitlines():
    p = json.loads(l)
    b = (MOTOR / 'content/13 Dominios/source/eurostat' / p['file']).read_bytes()
    assert hashlib.sha256(b).hexdigest() == p['sha256']
    m['pedidos'].append(p)
m['pre_commit_codigo'] = int((AQUI / 'motor/pre-commit.codigo').read_text())
m['core_gate_passou'] = 'GATE: PASS' in (AQUI / 'motor/core-gate-commit.log').read_text()
assert m['pre_commit_codigo'] == 0 and m['core_gate_passou']
teste = (AQUI / 'motor/dominios-test.log').read_text()
r = re.search(r'DOMINIOS_TEST: PASS.*?(\d+) de (\d+) defeito\(s\) vistos, (\d+) prova\(s\) verde\(s\), (\d+) problema', teste)
assert r
m['plantas_vistas'], m['plantas_total'], m['provas'], m['problemas'] = map(int, r.groups())
m['reguas_ausentes'] = {
    'ganho-medio-mensal-2024': 'O ficheiro INE alojado tem apenas Dados[2024]. O ano anterior não está neste ficheiro.',
    'retribuicao-minima-mensal-garantida-continente-2026': 'O diploma alojado cita no preâmbulo um compromisso para o ano anterior. Não aloja a norma que fixou esse valor; o compromisso não prova aqui o valor legal aplicado.',
}
(AQUI / 'motor/medidas-motor.json').write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in m.items() if k not in ('pedidos', 'reguas_ausentes')}, ensure_ascii=False, indent=2))
