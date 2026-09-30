"""E0: lê os contadores desta sessão sem guardar caminhos nem dados pessoais."""
import json
import os
from pathlib import Path
from datetime import datetime, timezone

pasta = Path('design/especime-v3/medicoes/e0-2026-09-30')
identificador = os.environ.get('CODEX_THREAD_ID')
agora = datetime.now(timezone.utc)
sessoes = []
for ficheiro in (Path.home() / '.codex' / 'sessions').rglob('rollout-*.jsonl'):
    if ficheiro.stat().st_mtime < agora.timestamp() - 86400:
        continue
    with ficheiro.open() as f:
        primeira = json.loads(f.readline())
        meta = primeira.get('payload', {})
        if meta.get('cwd') != os.getcwd():
            continue
        modelo, uso, instante, inicio_e0b = None, None, None, None
        for linha in f:
            d = json.loads(linha)
            p = d.get('payload') or {}
            if d.get('type') == 'event_msg' and p.get('type') == 'user_message' and 'Continuas o bloco E0 depois da leitura a frio.' in p.get('message', ''):
                inicio_e0b = d.get('timestamp')
            if d.get('type') == 'response_item' and p.get('type') == 'message' and p.get('role') == 'user':
                texto = '\n'.join(c.get('text', '') for c in p.get('content', []) if isinstance(c, dict))
                if texto.startswith('Continuas o bloco E0 depois da leitura a frio.'):
                    inicio_e0b = d.get('timestamp')
            if d.get('type') == 'turn_context':
                modelo = p.get('model', modelo)
            if d.get('type') == 'event_msg' and p.get('type') == 'token_count':
                uso = (p.get('info') or {}).get('total_token_usage')
                instante = d.get('timestamp')
        if uso:
            sessoes.append({'sessao': meta.get('id'), 'modelo': modelo or 'não exposto',
                            'inicio': primeira.get('timestamp'), 'inicio_e0b': inicio_e0b, 'ultima_amostra': instante, 'simbolos': uso,
                            'simbolos_sem_cache_mais_saida': uso['input_tokens'] - uso.get('cached_input_tokens', 0) + uso['output_tokens']})
construtores = [s for s in sessoes if s['sessao'] == identificador]
assert len(construtores) == 1, 'A sessão atual tem de ser identificada pelo ambiente e pelo registo.'
construtor = construtores[0]
inicio = datetime.fromisoformat(construtor['inicio'].replace('Z', '+00:00'))
revisores = [s for s in sessoes if s['modelo'] == 'codex-auto-review' and s['inicio'] >= construtor['inicio']]
r = {'medido_em': agora.isoformat(), 'segundos_decorridos': round((agora - inicio).total_seconds(), 1),
     'base': 'Contadores cumulativos token_count; entrada sem cache mais saída e total com cache em campos distintos.',
     'limite': 'A amostra antecede o fecho da sessão. Não é um preço em euros nem um contador final tokens used.',
     'construtor': construtor, 'revisores_automaticos': revisores,
     'conhecido_positivo': bool(construtor['simbolos']['output_tokens'] > 0 and construtor['simbolos']['total_tokens'] > 0)}
assert r['conhecido_positivo']
if construtor['inicio_e0b']:
    inicio_passagem = datetime.fromisoformat(construtor['inicio_e0b'].replace('Z', '+00:00'))
    original = json.loads((pasta / 'custo-e0-original.json').read_text())
    mesma_sessao = original['construtor']['sessao'] == construtor['sessao']
    r['e0b'] = {'inicio': construtor['inicio_e0b'], 'segundos_decorridos': round((agora - inicio_passagem).total_seconds(), 1),
                'mesma_sessao_do_e0': mesma_sessao,
                'simbolos_desde_final_e0': construtor['simbolos_sem_cache_mais_saida'] - 412261 if mesma_sessao else None,
                'base_do_delta': '412 261, contador final E0 informado no mandato E0b, ponto 5.'}
(pasta / 'custo.json').write_text(json.dumps(r, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'modelo': construtor['modelo'], 'simbolos': construtor['simbolos'],
                  'simbolos_sem_cache_mais_saida': construtor['simbolos_sem_cache_mais_saida'],
                  'segundos_decorridos': r['segundos_decorridos'], 'revisores': len(revisores)}, ensure_ascii=False))
