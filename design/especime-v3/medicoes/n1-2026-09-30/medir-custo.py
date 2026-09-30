"""Lê apenas metadados e contadores das sessões desta árvore, sem guardar caminhos locais."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path

agora = datetime.now(timezone.utc)
base = Path.home() / '.codex' / 'sessions' / agora.strftime('%Y/%m/%d')
amostras = []
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
            try:
                registo = json.loads(linha)
            except ValueError:
                continue
            dados = registo.get('payload', {})
            if registo.get('type') == 'turn_context':
                modelo = dados.get('model', modelo)
            if registo.get('type') == 'event_msg' and dados.get('type') == 'token_count':
                uso = (dados.get('info') or {}).get('total_token_usage')
                instante = registo.get('timestamp')
    if uso:
        papel = 'construtor' if meta.get('source') == 'exec' else 'revisor automático das aprovações'
        amostras.append({'papel': papel, 'modelo': modelo or 'não exposto', 'inicio': primeira.get('timestamp'), 'ultima_amostra': instante, 'simbolos': uso, 'entrada_sem_cache': uso['input_tokens'] - uso.get('cached_input_tokens', 0)})
construtores = [x for x in amostras if x['papel'] == 'construtor']
if len(construtores) != 1:
    raise SystemExit('Não foi identificado exatamente um contador do construtor nesta árvore.')
inicio = datetime.fromisoformat(construtores[0]['inicio'].replace('Z', '+00:00'))
resultado = {'medido_em': agora.isoformat(), 'segundos_decorridos': (agora - inicio).total_seconds(), 'limite': 'Contadores até à última amostra escrita, anteriores ao fecho da sessão; entrada inclui cache. Não são euros nem contagem de caracteres.', 'conhecido_positivo': construtores[0]['simbolos']['output_tokens'] > 0, 'sessoes': amostras}
Path('design/especime-v3/medicoes/n1-2026-09-30/custo.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(resultado, ensure_ascii=False))
