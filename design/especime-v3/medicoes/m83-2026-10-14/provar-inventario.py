#!/usr/bin/env python3
"""Os conhecidos-positivos de medir-inventario.py, corridos e registados: (1) com python3 -O e um rótulo igual à cadeia, o guião
recusa escrever e a mensagem não diz o rótulo; (2) com uma pasta de repositório inexistente, o guião para no Git falhado.
Nenhuma cadeia real entra aqui: as cadeias são sintéticas. uso: provar-inventario.py <saida.json>"""
import json, os, pathlib, subprocess, sys, tempfile
D = pathlib.Path(__file__).resolve().parent
def correr(env, otimizado):
    with tempfile.TemporaryDirectory(prefix='oedp-prova-inventario-') as tmp:
        saida = pathlib.Path(tmp) / 'inventario.json'
        r = subprocess.run([sys.executable] + (['-O'] if otimizado else []) + [str(D / 'medir-inventario.py'), str(saida)], env={**os.environ, **env}, capture_output=True, text=True)
        return {'codigo': r.returncode, 'ficheiro_escrito': saida.exists(), 'mensagem': (r.stderr.strip().splitlines() or [''])[-1]}
sitio, motor = os.environ['INVENTARIO_SITIO'], os.environ['INVENTARIO_MOTOR']
rotulo = 'zzqx-sintetico-maiusculas'
p1 = correr({'INVENTARIO_SITIO': sitio, 'INVENTARIO_MOTOR': motor, 'INVENTARIO_CADEIAS': json.dumps([{'rotulo': rotulo, 'cadeia': 'ZZQX-Sintetico-Maiusculas'}])}, otimizado=True)
p2 = correr({'INVENTARIO_SITIO': '/nao/existe', 'INVENTARIO_MOTOR': motor, 'INVENTARIO_CADEIAS': json.dumps([{'rotulo': 'a', 'cadeia': 'zzqx'}])}, otimizado=False)
p3 = correr({'INVENTARIO_SITIO': sitio, 'INVENTARIO_MOTOR': motor, 'INVENTARIO_CADEIAS': json.dumps([{'rotulo': 'controlo', 'cadeia': 'zzqx-cadeia-que-nao-existe'}])}, otimizado=False)
resultado = {'recusa_por_fuga_com_O': {**p1, 'passou': p1['codigo'] == 1 and not p1['ficheiro_escrito'] and rotulo not in p1['mensagem'] and 'não diz quais' in p1['mensagem']},
             'recusa_por_git_falhado': {**p2, 'passou': p2['codigo'] == 1 and not p2['ficheiro_escrito'] and 'git log falhou' in p2['mensagem']},
             'controlo_sem_fuga_escreve': {**p3, 'passou': p3['codigo'] == 0 and p3['ficheiro_escrito']}}
resultado['passou'] = all(v['passou'] for v in resultado.values() if isinstance(v, dict))
pathlib.Path(sys.argv[1]).write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v['passou'] for k, v in resultado.items() if isinstance(v, dict)}), '· passou =', resultado['passou'])
