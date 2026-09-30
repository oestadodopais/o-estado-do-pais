"""Conserva N1 e N1b e distingue a base «tokens used» da soma com cache."""
import json
import os
import sys
import subprocess
from datetime import datetime, timezone
from pathlib import Path

pasta = Path('design/especime-v3/medicoes/n1-2026-09-30')
passagem_atual = 'N1d' if '--n1d' in sys.argv else 'N1c'
agora = datetime.now(timezone.utc)
base = Path.home() / '.codex' / 'sessions' / agora.strftime('%Y/%m/%d')
cli = json.loads((pasta / 'custo-contadores-cli.json').read_text())
contadores_cli = {r['tokens_used']: r for r in cli}
confirmados = {}
sessoes = []

def bases(uso):
    return {'simbolos_cobrados': uso['input_tokens'] - uso.get('cached_input_tokens', 0) + uso['output_tokens'],
            'simbolos_com_cache': uso['total_tokens'],
            'cache': uso.get('cached_input_tokens', 0)}

for ficheiro in base.glob('*.jsonl'):
    with ficheiro.open() as f:
        primeira = json.loads(f.readline())
    meta = primeira.get('payload', {})
    if meta.get('cwd') != os.getcwd():
        continue
    uso = None
    instante = None
    modelo = None
    with ficheiro.open() as f:
        for linha in f:
            registo = json.loads(linha)
            dados = registo.get('payload', {})
            if registo.get('type') == 'turn_context':
                modelo = dados.get('model', modelo)
            if registo.get('type') == 'event_msg' and dados.get('type') == 'token_count':
                uso = (dados.get('info') or {}).get('total_token_usage')
                instante = registo.get('timestamp')
                if uso and meta.get('source') == 'exec' and bases(uso)['simbolos_cobrados'] in contadores_cli:
                    confirmados[bases(uso)['simbolos_cobrados']] = {'instante': instante, 'simbolos': uso}
    if uso:
        papel = 'construtor' if meta.get('source') == 'exec' else 'revisor automático das aprovações'
        sessoes.append({'sessao': meta.get('id'), 'papel': papel, 'modelo': modelo or 'não exposto', 'inicio': primeira.get('timestamp'), 'ultima_amostra': instante, 'simbolos': uso, **bases(uso), 'base': 'input_tokens menos cached_input_tokens mais output_tokens; o total com cache conserva total_tokens'})
construtores = [x for x in sessoes if x['papel'] == 'construtor']
assert len(construtores) == 1, 'Tem de haver exatamente uma sessão do construtor.'
assert set(confirmados) == set(contadores_cli), 'Os dois contadores tokens used têm de coincidir com amostras reais da sessão.'
historicas = []
for passagem, commit in [('N1', 'dfc86083'), ('N1b', 'ae010fbb')]:
    origem = f'{commit}:{pasta}/custo.json'
    amostra = json.loads(subprocess.check_output(['git', 'show', origem], text=True))
    for sessao in amostra['sessoes']:
        sessao.update(bases(sessao['simbolos']))
    contagem = next(r for r in cli if r['passagem'].lower() == passagem.lower())
    historicas.append({'passagem': passagem, 'origem_git': origem, 'amostra': amostra, 'fecho_cli': {**contagem, **confirmados[contagem['tokens_used']]}, 'revisores': {'sessoes': sum(s['papel'] != 'construtor' for s in amostra['sessoes']), 'simbolos_cobrados': sum(s['simbolos_cobrados'] for s in amostra['sessoes'] if s['papel'] != 'construtor'), 'simbolos_com_cache': sum(s['simbolos_com_cache'] for s in amostra['sessoes'] if s['papel'] != 'construtor')}})
inicio = datetime.fromisoformat(construtores[0]['inicio'].replace('Z', '+00:00'))
revisores = [s for s in sessoes if s['papel'] != 'construtor']
resultado = {'passagem': passagem_atual, 'medido_em': agora.isoformat(), 'segundos_decorridos': (agora - inicio).total_seconds(),
    'base': 'Símbolos cobrados usa a base do contador tokens used: entrada sem cache mais saída. Símbolos com cache usa o total cumulativo. Não são caracteres nem euros.',
    'limite': f'As linhas tokens used são os fechos N1 e N1b da mesma sessão, por isso não se somam. Nos revisores automáticos, a base equivalente é calculada dos eventos token_count; não há uma linha de terminal individual disponível. A amostra {passagem_atual} é anterior ao fecho da sessão.',
    'conhecido_positivo': len(confirmados) == 2, 'amostras': historicas, 'sessoes': sessoes,
    'revisores': {'sessoes': len(revisores), 'simbolos_cobrados': sum(s['simbolos_cobrados'] for s in revisores), 'simbolos_com_cache': sum(s['simbolos_com_cache'] for s in revisores)}}
(pasta / 'custo.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'conhecido_positivo': resultado['conhecido_positivo'], 'fechos_cli': [r['tokens_used'] for r in cli], 'revisores': resultado['revisores'], 'construtor': {k: construtores[0][k] for k in ['ultima_amostra','simbolos_cobrados','simbolos_com_cache']}}, ensure_ascii=False))
