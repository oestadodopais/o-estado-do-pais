#!/bin/sh
# M101 (26.10.2026): uma leitura a frio pela CLI do Antigravity (agy), só de leitura (--mode plan), com o tempo e o uso
# medidos: a resposta em JSON traz `usage` (input, output, thinking, cache, total) e `duration_seconds`, que ficam ao lado
# da leitura em <saida>.uso.json; a leitura em si (o campo `response`) vai para <saida>. O prompt comum já está no pacote
# como PROMPT-COMUM.md e o prompt do bloco como `prompt` (montados pelo pacote.sh e pelo guião do bloco).
# uso: ler-gemini.sh <pacote absoluto> <saida absoluta> [modelo]   (modelo por omissão: gemini-4-argon-high)
set -u
pacote="$1"; saida="$2"; modelo="${3:-gemini-4-argon-high}"
case "$pacote" in /*) ;; *) echo "o pacote passa-se em caminho absoluto" >&2; exit 9;; esac
[ -f "$pacote/prompt" ] && [ -f "$pacote/PROMPT-COMUM.md" ] || { echo "faltam prompt ou PROMPT-COMUM.md em $pacote" >&2; exit 9; }
[ ! -e "$saida" ] || { echo "a saída já existe: $saida" >&2; exit 9; }
inicio=$(date -u +%Y-%m-%dT%H:%M:%SZ); t0=$(date -u +%s)
(cd "$pacote" && agy --print "$(cat prompt)" --model "$modelo" --mode plan --add-dir "$pacote" --output-format json --print-timeout 0 > "$saida.json" 2> "$saida.erros.log")
codigo=$?; fim=$(date -u +%Y-%m-%dT%H:%M:%SZ); t1=$(date -u +%s)
python3 - "$saida" "$modelo" "$inicio" "$fim" "$((t1-t0))" "$codigo" <<'PY'
import json, sys
saida, modelo, inicio, fim, segundos, codigo = sys.argv[1:7]
try:
    d = json.loads(open(saida + '.json', encoding='utf-8').read())
except Exception as e:
    d = {'erro_json': str(e)}
texto = d.get('response') if isinstance(d, dict) else None
if texto: open(saida, 'w', encoding='utf-8').write(texto)
uso = {'modelo': modelo, 'inicio': inicio, 'fim': fim, 'segundos_parede': int(segundos), 'codigo': int(codigo),
       'estado': d.get('status') if isinstance(d, dict) else None, 'duration_seconds': d.get('duration_seconds') if isinstance(d, dict) else None,
       'num_turns': d.get('num_turns') if isinstance(d, dict) else None, 'usage': d.get('usage') if isinstance(d, dict) else None,
       'conversation_id': d.get('conversation_id') if isinstance(d, dict) else None, 'resposta_escrita': bool(texto)}
open(saida + '.uso.json', 'w', encoding='utf-8').write(json.dumps(uso, ensure_ascii=False, indent=1) + '\n')
print(f"agy exit={codigo} · {modelo} · {inicio} a {fim} ({segundos} s) · estado {uso['estado']} · uso {json.dumps(uso['usage'])} · leitura em {saida if texto else 'NÃO ESCRITA'}")
PY
