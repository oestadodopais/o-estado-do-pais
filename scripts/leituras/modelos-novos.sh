#!/bin/sh
# Pergunta às CLIs que modelos oferecem e compara com os lugares em uso (scripts/leituras/modelos-em-uso.json).
# Corre na revisão de sexta-feira e quando um modelo for anunciado (27.10.2026, a decisão do lugar de direção:
# um modelo novo entra pelo ensaio das cinco plantas, M51, e sobe quando medido igual ou melhor e mais barato).
# Só a CLI do Antigravity (agy) lista modelos; o Codex e o Claude não listam, e sondam-se por nome (sondar-modelo.sh).
# uso: modelos-novos.sh            (imprime os lugares em uso, os modelos novos do agy e o que falta medir)
# saída: 0 sem novidade; 3 com modelos novos por ensaiar; 9 sem conseguir ler o ficheiro ou a CLI.
set -u
aqui="$(cd "$(dirname "$0")" && pwd)"
ficheiro="${MODELOS_EM_USO:-$aqui/modelos-em-uso.json}"
[ -f "$ficheiro" ] || { echo "9 falta $ficheiro" >&2; exit 9; }
python3 - "$ficheiro" <<'PY'
import json, shutil, subprocess, sys
f = sys.argv[1]
d = json.load(open(f, encoding='utf-8'))
print('Os lugares em uso (' + f.rsplit('/', 1)[-1] + '):')
for nome, l in d['lugares'].items():
    print(f"- {nome}: {l['modelo']}" + (f" · {l['esforco']}" if l.get('esforco') else '') + (f" · {l['nota']}" if l.get('nota') else ''))
print('Por medir: ' + '; '.join(d.get('por_medir', [])))
codigo = 0
if shutil.which('agy'):
    try:
        r = subprocess.run(['agy', 'models'], capture_output=True, text=True, timeout=60)
        ids = [l.split('\t')[0].strip() for l in r.stdout.splitlines() if '\t' in l]
        conhecidos = set(d['listas_conhecidas'].get('agy', []))
        novos = [i for i in ids if i not in conhecidos]
        desaparecidos = sorted(conhecidos - set(ids))
        print(f"agy: {len(ids)} modelos listados (a lista conhecida é de {d['listas_conhecidas'].get('agy_lida_a', '?')}).")
        if novos:
            codigo = 3
            print('agy: MODELOS NOVOS por ensaiar (M51): ' + ', '.join(novos))
        if desaparecidos:
            print('agy: deixaram de ser listados: ' + ', '.join(desaparecidos))
        if not ids:
            codigo = 9
            print('agy: não listou nenhum modelo (saída vazia); ver a sessão da CLI')
    except (OSError, subprocess.TimeoutExpired) as e:
        codigo = 9
        print(f'agy: não respondeu ({e})')
else:
    print('agy: CLI não instalada nesta máquina')
print('codex: ' + d['listas_conhecidas'].get('codex', ''))
print('claude: ' + d['listas_conhecidas'].get('claude', ''))
sys.exit(codigo)
PY
