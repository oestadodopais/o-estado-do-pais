"""E0: lê os contadores desta sessão sem guardar caminhos nem dados pessoais."""
import json
import os
import subprocess
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
        modelo, uso, instante, inicio_e0b, inicio_e0c, uso_inicio_e0c = None, None, None, None, None, None
        for linha in f:
            d = json.loads(linha)
            p = d.get('payload') or {}
            if d.get('type') == 'event_msg' and p.get('type') == 'user_message' and 'Continuas o bloco E0 depois da leitura a frio.' in p.get('message', ''):
                inicio_e0b = d.get('timestamp')
            if d.get('type') == 'response_item' and p.get('type') == 'message' and p.get('role') == 'user':
                texto = '\n'.join(c.get('text', '') for c in p.get('content', []) if isinstance(c, dict))
                if texto.startswith('Continuas o bloco E0 depois da leitura a frio.'):
                    inicio_e0b = d.get('timestamp')
                if texto.startswith('Continuas o bloco E0 depois da releitura a frio.'):
                    inicio_e0c = d.get('timestamp')
                    uso_inicio_e0c = uso['input_tokens'] - uso.get('cached_input_tokens', 0) + uso['output_tokens'] if uso else None
            if d.get('type') == 'turn_context':
                modelo = p.get('model', modelo)
            if d.get('type') == 'event_msg' and p.get('type') == 'token_count':
                uso = (p.get('info') or {}).get('total_token_usage')
                instante = d.get('timestamp')
        if uso:
            sessoes.append({'sessao': meta.get('id'), 'modelo': modelo or 'não exposto',
                            'inicio': primeira.get('timestamp'), 'inicio_e0b': inicio_e0b, 'inicio_e0c': inicio_e0c,
                            'uso_inicio_e0c': uso_inicio_e0c, 'ultima_amostra': instante, 'simbolos': uso,
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
if construtor['inicio_e0c']:
    # A amostra E0b fica presa à cabeça recebida. A E0c não prolonga o custo E0b.
    f = pasta / 'custo-e0b.json'
    if not f.exists():
        anterior = json.loads(subprocess.check_output(['git', 'show', 'a99d45cc:' + str(pasta / 'custo.json')], text=True))
        ids_e0b = ['01a0f46d-3a10-7143-ae1c-eca7ea3b2a98', '01a0f496-bd66-7793-a953-2a8eb522ebb1']
        rev_e0b = [s for s in anterior['revisores_automaticos'] if s['sessao'] in ids_e0b]
        assert len(rev_e0b) == 2
        assert sorted(s['simbolos_sem_cache_mais_saida'] for s in rev_e0b) == [27007, 63492]
        passagem = {**anterior['e0b'], 'medido_em': anterior['medido_em'], 'proveniencia': 'custo.json na cabeça a99d45cc e mandato E0c, ponto 3.',
                    'construtor_simbolos': anterior['e0b']['simbolos_desde_final_e0'], 'revisores_automaticos': rev_e0b,
                    'revisores_simbolos': sum(s['simbolos_sem_cache_mais_saida'] for s in rev_e0b)}
        passagem['total_cobrado_simbolos'] = passagem['construtor_simbolos'] + passagem['revisores_simbolos']
        assert passagem['total_cobrado_simbolos'] == 499377
        f.write_text(json.dumps(passagem, ensure_ascii=False, indent=2) + '\n')
    r['e0b'] = json.loads(f.read_text())
    ids_anteriores = {s['sessao'] for s in json.loads((pasta / 'custo-e0-original.json').read_text())['revisores_automaticos']}
    ids_anteriores.update(s['sessao'] for s in r['e0b']['revisores_automaticos'])
    # O guardião da retoma é criado antes da primeira mensagem. Um corte nessa
    # mensagem excluiria uma sessão já cobrada à passagem, como aconteceu na E0b.
    rev_e0c = [s for s in revisores if s['sessao'] not in ids_anteriores]
    inicio_passagem = datetime.fromisoformat(construtor['inicio_e0c'].replace('Z', '+00:00'))
    simbolos_e0c = construtor['simbolos_sem_cache_mais_saida'] - construtor['uso_inicio_e0c']
    r['e0c'] = {'inicio': construtor['inicio_e0c'], 'medido_em': agora.isoformat(),
                'segundos_decorridos': round((agora - inicio_passagem).total_seconds(), 1),
                'construtor_simbolos': simbolos_e0c, 'revisores_automaticos': rev_e0c,
                'revisores_simbolos': sum(s['simbolos_sem_cache_mais_saida'] for s in rev_e0c),
                'base_do_delta': 'Último token_count anterior à mensagem de retoma E0c.',
                'criterio_dos_revisores': 'Sessões de revisor da mesma worktree fora das listas conservadas E0 e E0b, incluindo o guardião criado antes da mensagem de retoma.'}
    r['e0c']['total_cobrado_simbolos'] = simbolos_e0c + r['e0c']['revisores_simbolos']
elif construtor['inicio_e0b']:
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
