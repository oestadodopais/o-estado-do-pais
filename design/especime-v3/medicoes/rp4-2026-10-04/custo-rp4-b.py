#!/usr/bin/env python3
"""Lê a telemetria parcial da sessão indicada; não copia o registo pessoal."""
import datetime, json, pathlib, sys
pasta = pathlib.Path(__file__).resolve().parent
inicio = None
modelos = []
uso = None
for linha in pathlib.Path(sys.argv[1]).open():
    evento = json.loads(linha)
    if inicio is None:
        inicio = evento.get('timestamp')
    dados = evento.get('payload', {})
    if evento.get('type') == 'turn_context' and dados.get('model'):
        if dados['model'] not in modelos:
            modelos.append(dados['model'])
    if evento.get('type') == 'event_msg' and dados.get('type') == 'token_count':
        uso = {'hora': evento['timestamp'], 'simbolos': dados.get('info', {}).get('total_token_usage'), 'limites': dados.get('rate_limits')}
agora = datetime.datetime.now(datetime.timezone.utc)
segundos = int((agora - datetime.datetime.fromisoformat(inicio.replace('Z', '+00:00'))).total_seconds())
resultado = {'comando': 'python3 design/especime-v3/medicoes/rp4-2026-10-04/custo-rp4-b.py <sessão>',
             'modelo': modelos, 'inicio': inicio, 'medido_em': agora.isoformat(),
             'segundos_observados': segundos, 'telemetria_parcial': uso,
             'tokens_used_final': None,
             'limite': 'A telemetria cumulativa inclui as entradas em cache. Não é a linha final tokens used, que só existe depois da saída do lançador.'}
(pasta/'custo-rp4-b.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(resultado, ensure_ascii=False))
