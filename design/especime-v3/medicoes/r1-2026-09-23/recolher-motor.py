#!/usr/bin/env python3
"""O que o bloco R1 fez no motor, num JSON: o ramo, os commits, e as saídas guardadas.

    python3 design/especime-v3/medicoes/r1-2026-09-23/recolher-motor.py <worktree do motor>

O motor é um repositório privado e não vive dentro do sítio, por isso este guião
pede o caminho da worktree (o `medir.py` do bloco corre sem argumentos e lê só o
que está dentro do sítio: lê o `motor/motor.json` que este escreve). Lê do git do
motor o ramo, a base, a cabeça e cada commit com o seu trailer, e lê das saídas
guardadas em `motor/` e ao lado deste guião o que cada conferência disse. Nenhum
número é escrito à mão: cada um sai de um comando do git ou de uma linha de uma
saída, e o guião falha se a linha não estiver lá.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MOTOR = Path(sys.argv[1]).resolve()
RAMO = 'r1-2026-09-23'


def git(*a):
    return subprocess.run(['git', *a], cwd=MOTOR, capture_output=True, text=True, check=True).stdout.strip()


def linha(caminho, padrao):
    texto = (AQUI / caminho).read_text(encoding='utf-8')
    m = re.search(padrao, texto, re.M)
    if not m:
        raise SystemExit(f'{caminho}: não encontrei {padrao!r}')
    return m


base = git('merge-base', 'master', RAMO)
cabeca = git('rev-parse', RAMO)
commits = []
for sha in git('rev-list', '--reverse', f'{base}..{RAMO}').split():
    corpo = git('log', '-1', '--format=%B', sha)
    trailer = re.search(r'^Co-Authored-By: (.+?) <', corpo, re.M)
    ficheiros = [f for f in git('diff-tree', '--no-commit-id', '--name-only', '-r', sha).split('\n') if f]
    commits.append({
        'sha': sha[:7],
        'assunto': git('log', '-1', '--format=%s', sha),
        'trailer': trailer.group(1) if trailer else None,
        'ficheiros': len(ficheiros),
    })
estat = git('diff', '--shortstat', f'{base}..{RAMO}')
m_est = re.search(r'(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?', estat)

gate = linha('motor/core-gate-final.txt', r'^GATE: (PASS|FAIL)')
gate_cod = linha('motor/core-gate-final.txt', r'^codigo (\d+)')
teste = linha('motor/dominios-test.txt', r'DOMINIOS_TEST: (PASS|FAIL) — (\d+) de (\d+) defeito')
nucleo = linha('saude-nucleo-final.txt', r'^(\d+)/(\d+) checks passed')
dinheiro = linha('saude-pt-public-money-final.txt', r'^(\d+)/(\d+) checks passed')
nucleo_depois = linha('saude-nucleo-depois.txt', r'^(\d+)/(\d+) checks passed')
nucleo_primeira = linha('saude-nucleo-primeira.txt', r'^(\d+)/(\d+) checks passed')
dinheiro_primeira = linha('saude-pt-public-money-primeira.txt', r'^(\d+)/(\d+) checks passed')
dinheiro_depois = linha('saude-pt-public-money-depois.txt', r'^(\d+)/(\d+) checks passed')
plantas = json.loads((AQUI / 'plantas-motor.json').read_text(encoding='utf-8'))
ensaio = linha('export-rows-ensaio.txt', r'(\d+) nova\(s\) · (\d+) alterada\(s\) · (\d+) inalterada\(s\)')
escrita = linha('export-rows-write.txt', r'(\d+) nova\(s\) · (\d+) alterada\(s\) · (\d+) inalterada\(s\)')
agenda = linha('export-agenda.txt', r'EXPORT_AGENDA: (\d+) item\(s\), (\d+) event\(s\), (\d+) of them with no date')
cruzamento = linha('saude-pt-public-money-final.txt', r"(\d+)/(\d+) of the Carta's codes in the PRR index, (\d+) residual")
controlos = len(re.findall(r'^\s+bate\s', (AQUI / 'motor/dominios-build-ensaio.txt').read_text(encoding='utf-8'), re.M))

saida = {
    'ramo': RAMO,
    'base_master': base[:7],
    'cabeca': cabeca[:7],
    'commits': commits,
    'commits_n': len(commits),
    'commits_com_o_nome_antigo': [c['sha'] for c in commits if c['trailer'] == 'Claude Opus 5'],
    'commits_com_o_nome_certo': [c['sha'] for c in commits if c['trailer'] == 'Claude Opus 5.5'],
    'diff_ficheiros': int(m_est.group(1)), 'diff_linhas_mais': int(m_est.group(2) or 0), 'diff_linhas_menos': int(m_est.group(3) or 0),
    'core_gate_final': {'resultado': gate.group(1), 'codigo': int(gate_cod.group(1))},
    'dominios_test': {'resultado': teste.group(1), 'defeitos_vistos': int(teste.group(2)), 'defeitos': int(teste.group(3))},
    'dominios_build_ensaio_controlos_que_batem': controlos,
    'saude_nucleo': {'primeira': [int(nucleo_primeira.group(1)), int(nucleo_primeira.group(2))],
                     'depois': [int(nucleo_depois.group(1)), int(nucleo_depois.group(2))],
                     'final': [int(nucleo.group(1)), int(nucleo.group(2))]},
    'saude_pt_public_money': {'primeira': [int(dinheiro_primeira.group(1)), int(dinheiro_primeira.group(2))],
                              'depois': [int(dinheiro_depois.group(1)), int(dinheiro_depois.group(2))],
                              'final': [int(dinheiro.group(1)), int(dinheiro.group(2))]},
    'plantas_motor': {'corridas': len(plantas), 'morderam': sum(1 for p in plantas if p.get('mordeu')),
                      'repostas': sum(1 for p in plantas if p.get('antes') == p.get('reposto')),
                      'passaram': sum(1 for p in plantas if p.get('passou'))},
    'cruzamento_dos_concelhos_sem_o_base': {'codigos_da_carta_no_prr': int(cruzamento.group(1)), 'codigos_da_carta': int(cruzamento.group(2)), 'residuo': int(cruzamento.group(3))},
    'exportacao_das_linhas': {'ensaio': [int(x) for x in ensaio.groups()], 'escrita': [int(x) for x in escrita.groups()]},
    'exportacao_da_agenda': {'itens': int(agenda.group(1)), 'eventos': int(agenda.group(2)), 'sem_data_publicada': int(agenda.group(3))},
}
(AQUI / 'motor' / 'motor.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(saida, ensure_ascii=False, indent=2))
