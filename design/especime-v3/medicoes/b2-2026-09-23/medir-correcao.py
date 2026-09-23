#!/usr/bin/env python3
"""Confere o âmbito da reexportação e recolhe a prova desta passagem."""
import json
import re
import subprocess
from pathlib import Path

B = Path(__file__).resolve().parent
R = B.parents[3]
MOTOR = Path.home() / 'Instruments/ResearchHub/.worktrees/b2-peca1-2026-09-23'
BASE = '8eb528f9'
LINHA = 'ledger/claims/sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue.yml'


def git(*args, cwd=R):
    return subprocess.check_output(['git', *args], cwd=cwd, text=True).strip()


antes = git('show', f'{BASE}:{LINHA}')
depois = (R / LINHA).read_text().strip()
sem_nota = lambda s: re.sub(r'^note: .*$', '', s, flags=re.M)
assert sem_nota(antes) == sem_nota(depois), 'Mudou um campo além da nota'
nota = lambda s: json.loads(re.search(r'^note: (.+)$', s, re.M)[1])
assert nota(depois).endswith(nota(antes)), 'A nota anterior não ficou inteira'
prefixo = 'Agregado da União Europeia (EU27_2020) da medida «sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025»,'
assert nota(depois).startswith(prefixo)
ficheiros = git('diff', '--name-only', BASE, '--', 'ledger').splitlines()
assert set(ficheiros) == {LINHA, 'ledger/cruzamentos/dominios.json'}, ficheiros
log = (B / 'motor/associacao-test.log').read_text()
plantas = re.findall(r'^B2 associação: planta recusada, (.+)$', log, re.M)
assert len(plantas) == 4
positivo = 'B2 associação: controlo positivo' in log
assert positivo
ledger_codigo = int((B / 'correcao/ledger.codigo').read_text())
assert ledger_codigo == 0
capturas = json.loads((B / 'capturas-depois-peca1.json').read_text())
refeitas = [r['ficheiro'] for r in capturas['resultados'] if r.get('captura_refeita')]
resumo = {
    'base_sitio': git('rev-parse', BASE), 'cabeca_sitio': git('rev-parse', 'HEAD'),
    'cabeca_motor': git('rev-parse', 'HEAD', cwd=MOTOR),
    'commits_sitio': git('log', '--reverse', '--format=%h %s', f'{BASE}..HEAD').splitlines(),
    'campos_inalterados': ['value', 'unit', 'reference_date', 'source_url', 'document.title', 'excerpt', 'todos os campos além da nota'],
    'nota_anterior_preservada': True, 'declaracao': nota(depois)[:-len(nota(antes))],
    'ficheiros_ledger': ficheiros, 'plantas_associacao': len(plantas),
    'mordidas_associacao': plantas, 'controlo_positivo': positivo,
    'ledger_codigo': ledger_codigo, 'capturas_refeitas': refeitas,
    'capturas_refeitas_total': len(refeitas),
}
(B / 'correcao/resumo.json').write_text(json.dumps(resumo, ensure_ascii=False, indent=2) + '\n')
print('Âmbito da reexportação, campos preservados e plantas da associação conferidos.')
