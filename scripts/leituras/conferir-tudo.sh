#!/bin/sh
# A corrida inteira do `verify` sem parar na primeira vermelha, com um código por passo (M99, 22.10.2026).
# Lê os passos de `scripts.verify` do package.json da worktree (a cadeia `npm run a && npm run b && ...`)
# e, no fim, `npm run typecheck` quando o package.json o declara (M99-3, 26.10.2026: a corrida «portão» do GitHub corre-o)
# e corre cada um, com RESEARCHHUB_DIR herdado, escrevendo na pasta de saída `NN-<passo>.code` (o código)
# e `NN-<passo>.log` (o registo inteiro) e, no fim, `resumo.json` (cada passo com o comando, o código, a
# duração e as trinta últimas linhas dos vermelhos) e `resumo.md` (uma linha por passo).
# Antes de correr, recusa (9) um dist/ cuja version.json não seja a cabeça da worktree (I252), salvo
# --sem-build. Com --build corre primeiro `npm run build` inteiro (nunca só o astro build, a lição da
# EX4-e) e guarda o seu código em `00-build.code`. Toma a tranca da máquina como o portoes.sh (a mesma,
# /tmp/oedp-construcao.lock; OEDP_TRANCA aponta-a para outro sítio só no ensaio), porque dois verify em
# paralelo não cabem na máquina.
# Uso: sh scripts/leituras/conferir-tudo.sh <worktree absoluta> <pasta de saída nova> [--build|--sem-build] [--dirigidas "<passos>"]
# Saídas: 0 todos verdes; 1 algum vermelho; 9 recusa (nenhum passo correu); 130 interrompido. Um --build
# falhado (M99-b) escreve o resumo só com o passo 00-build, o seu código e a cauda, e sai com o código do build,
# sem correr os outros passos nem cair na recusa do dist/. Uma pasta de saída relativa é relativa ao sítio de
# onde se chamou o guião.
set -u
# RH1, como no portoes.sh: a máquina recebe a mesma lista privada do CI para o check:privacidade; nunca a imprime.
if [ "${PRIVACIDADE_PROIBIDOS+x}" != x ] && [ "${GITHUB_ACTIONS+x}" != x ] && [ "${CI+x}" != x ] && [ -f "$HOME/.config/oestadodopais/proibidos.txt" ]; then
  PRIVACIDADE_PROIBIDOS=$(cat "$HOME/.config/oestadodopais/proibidos.txt") || exit 9
  export PRIVACIDADE_PROIBIDOS
fi
aqui="$(cd "$(dirname "$0")" && pwd -P)"
[ "$#" -ge 2 ] || { echo 'conferir-tudo: uso: conferir-tudo.sh <worktree absoluta> <pasta nova> [--build|--sem-build] [--dirigidas "<passos>"]' >&2; exit 9; }
W="$1"; O="$2"; shift 2
construir=0; sem_build=0; dirigidas=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --build) construir=1; shift;;
    --sem-build) sem_build=1; shift;;
    --dirigidas)
      [ "$#" -ge 2 ] && [ -n "$2" ] && [ -z "$dirigidas" ] || { echo 'conferir-tudo: --dirigidas exige uma lista única de passos' >&2; exit 9; }
      dirigidas="$2"; shift 2;;
    *) echo "conferir-tudo: opção desconhecida: $1" >&2; exit 9;;
  esac
done
if [ -n "$dirigidas" ]; then
  [ -n "${OEDP_RAZAO:-}" ] || { echo 'conferir-tudo: --dirigidas exige OEDP_RAZAO' >&2; exit 9; }
fi
[ "$construir" -eq 0 ] || [ "$sem_build" -eq 0 ] || { echo 'conferir-tudo: --build e --sem-build não se juntam' >&2; exit 9; }
case "$W" in /*) ;; *) echo 'conferir-tudo: a worktree tem de ser absoluta' >&2; exit 9;; esac
# M99-b: a pasta de saída resolve-se antes do cd, contra o sítio de onde o guião foi chamado.
case "$O" in /*) ;; *) O="$(pwd -P)/$O";; esac
cd "$W" || exit 9
[ -f package.json ] || { echo 'conferir-tudo: a worktree não tem package.json' >&2; exit 9; }
if [ -e "$O" ] && [ -n "$(ls -A "$O" 2>/dev/null)" ]; then
  echo 'conferir-tudo: a pasta de saída já tem ficheiros; escolha uma pasta nova' >&2; exit 9
fi
mkdir -p "$O" || exit 9
O="$(cd "$O" && pwd)"
# Os passos, um por linha, como o package.json os escreve; uma peça que não seja `npm run` recusa.
python3 - "$W/package.json" "$dirigidas" "${OEDP_RAZAO:-}" "$O" > "$O/passos.txt" <<'PY' || { echo 'conferir-tudo: a cadeia do verify não se lê' >&2; exit 9; }
import json, re, sys
guioes = json.load(open(sys.argv[1]))['scripts']
cadeia = guioes['verify']
pecas = [p.strip() for p in cadeia.split('&&')]
# M99-3 (26.10.2026): o typecheck corre no fim, como na corrida «portão» do GitHub, quando o projeto o declara;
# uma chave repetida numa tabela só o typecheck a vê, e a aterragem da HB1-d perdeu 25 minutos de GitHub por ela.
if 'typecheck' in guioes and 'npm run typecheck' not in pecas:
    pecas.append('npm run typecheck')
for p in pecas:
    if not re.fullmatch(r'npm run [A-Za-z0-9:._-]+( -- [^&|;<>`$]+)?', p):
        sys.exit(f'peça inesperada: {p!r}')
nomes = [re.sub(r'[^A-Za-z0-9._-]', '_', p.split()[2]) for p in pecas]
pedidos = sys.argv[2].split()
if sys.argv[2]:
    if not pedidos or len(set(pedidos)) != len(pedidos) or set(pedidos) - set(nomes):
        sys.exit('passos dirigidos vazios, repetidos ou desconhecidos')
    if not sys.argv[3].strip():
        sys.exit('falta OEDP_RAZAO')
    from pathlib import Path
    (Path(sys.argv[4]) / 'DIRIGIDAS.txt').write_text('Passos: ' + ' '.join(pedidos) + '\nRazão: ' + sys.argv[3].strip() + '\n')
print('\n'.join(pecas))
PY
if [ -n "$dirigidas" ]; then
  dirigidas=$(python3 -c 'import sys; print(" ".join(sys.argv[1].split()))' "$dirigidas")
fi
tranca="${OEDP_TRANCA:-/tmp/oedp-construcao.lock}"
idade() {
  python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$tranca"
}
esperou=0
while ! (set -C; printf '%s %s pid=%s conferir-tudo\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$W" "$$" > "$tranca") 2>/dev/null; do
  [ -f "$tranca" ] || { echo 'conferir-tudo: não foi possível tomar a tranca; nenhum passo correu' >&2; exit 9; }
  if [ "$(idade)" -gt 2400 ]; then
    python3 "$aqui/tranca.py" "$tranca" || exit 9
    continue
  fi
  [ "$esperou" -ne 0 ] || echo "à espera da tranca da máquina: $(cat "$tranca")" >&2
  esperou=1; sleep 10
done
dono="$(cat "$tranca")"
filho=""
soltar_a_tranca() {
  resultado=$?
  trap '' INT TERM
  trap - EXIT
  if [ -f "$tranca" ] && [ "$(cat "$tranca")" = "$dono" ]; then
    rm -f "$tranca"
  fi
  exit "$resultado"
}
trap soltar_a_tranca EXIT
interromper() {
  trap '' INT TERM
  if [ -n "$filho" ]; then
    pkill -TERM -P "$filho" 2>/dev/null; kill -TERM "$filho" 2>/dev/null
    wait "$filho" 2>/dev/null
  fi
  echo 'conferir-tudo: corrida interrompida' >&2
  exit 130
}
trap interromper INT TERM
# Corre um comando na worktree, guarda o registo e devolve o código do processo terminado.
correr() {
  registo="$1"; shift
  sh -c "$1" > "$registo" 2>&1 &
  filho=$!
  wait "$filho"
  c=$?
  filho=""
  return "$c"
}
# O resumo (resumo.json e resumo.md) a partir da tabela dos passos que correram.
escrever_resumo() {
date -u +%Y-%m-%dT%H:%M:%SZ > "$O/fim"
git rev-parse HEAD > "$O/cabeca.fim"
python3 - "$O" <<'PY' || exit 9
import json, sys
from pathlib import Path
o = Path(sys.argv[1])
linhas = (o / '.tabela').read_text().splitlines()[1:]
passos = []
for l in linhas:
    n, passo, comando, codigo, segundos = l.split('\t')
    base = f'{n}-{passo}'
    p = {'n': n, 'passo': passo, 'comando': comando, 'codigo': int(codigo), 'segundos': int(segundos),
         'code': f'{base}.code', 'log': f'{base}.log'}
    if p['codigo'] != 0:
        p['cauda'] = (o / f'{base}.log').read_text(errors='replace').splitlines()[-30:]
    passos.append(p)
vermelhos = [p['passo'] for p in passos if p['codigo'] != 0]
resumo = {'cabeca': (o / 'cabeca').read_text().strip(), 'cabeca_fim': (o / 'cabeca.fim').read_text().strip(),
          'arvore_limpa_no_inicio': (o / 'arvore.inicio').read_text().strip() == '',
          'modo': 'dirigidas' if (o / 'DIRIGIDAS.txt').exists() else 'inteira',
          'inicio': (o / 'inicio').read_text().strip(), 'fim': (o / 'fim').read_text().strip(),
          'segundos': sum(p['segundos'] for p in passos), 'passos': passos, 'vermelhos': vermelhos}
(o / 'resumo.json').write_text(json.dumps(resumo, ensure_ascii=False, indent=1) + '\n')
md = [f'# conferir-tudo · {resumo["cabeca"][:9]} · {len(passos)} passos · {len(vermelhos)} vermelhos · {resumo["segundos"]} s', '']
md += [f'- {p["n"]} `{p["comando"]}`: {p["codigo"]} ({p["segundos"]} s)' for p in passos]
(o / 'resumo.md').write_text('\n'.join(md) + '\n')
(o / '.tabela').unlink()
PY
}
cabeca="$(git rev-parse HEAD)" || exit 9
printf '%s\n' "$cabeca" > "$O/cabeca"
git status --porcelain --untracked-files=all > "$O/arvore.inicio"
date -u +%Y-%m-%dT%H:%M:%SZ > "$O/inicio"
printf 'n\tpasso\tcomando\tcodigo\tsegundos\n' > "$O/.tabela"
if [ "$construir" -eq 1 ]; then
  t0=$(date +%s)
  correr "$O/00-build.log" 'npm run build'; c=$?
  echo "$c" > "$O/00-build.code"
  printf '00\tbuild\tnpm run build\t%s\t%s\n' "$c" "$(( $(date +%s) - t0 ))" >> "$O/.tabela"
  [ "$c" -le 128 ] || exit "$c"
  if [ "$c" -ne 0 ]; then
    echo "conferir-tudo: o build saiu com $c; nenhum passo do verify correu (a cauda em resumo.json)" >&2
    escrever_resumo
    echo "FIM $(cut -c1-9 "$O/cabeca") · build vermelho ($c)"
    exit "$c"
  fi
fi
if [ "$sem_build" -eq 0 ]; then
  versao="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("commit",""))' dist/version.json 2>/dev/null)"
  if [ "$versao" != "$cabeca" ]; then
    echo "conferir-tudo: dist/version.json (${versao:-ausente}) não é a cabeça da worktree ($cabeca); use --build ou --sem-build" >&2
    echo "recusado: dist/version.json ${versao:-ausente} contra a cabeça $cabeca" > "$O/recusa"
    rm -f "$O/.tabela"
    exit 9
  fi
fi
n=0
while IFS= read -r comando; do
  n=$((n + 1))
  nome="$(printf '%s' "$comando" | sed -e 's/^npm run //' -e 's/ -- .*//' -e 's/[^A-Za-z0-9._-]/_/g')"
  if [ -n "$dirigidas" ]; then
    case " $dirigidas " in *" $nome "*) ;; *) continue;; esac
  fi
  base="$(printf '%02d' "$n")-$nome"
  t0=$(date +%s)
  correr "$O/$base.log" "$comando" < /dev/null; c=$?
  echo "$c" > "$O/$base.code"
  printf '%02d\t%s\t%s\t%s\t%s\n' "$n" "$nome" "$comando" "$c" "$(( $(date +%s) - t0 ))" >> "$O/.tabela"
  [ "$c" -le 128 ] || { echo "conferir-tudo: o passo $nome foi interrompido; a corrida para aqui" >&2; exit "$c"; }
done < "$O/passos.txt"
escrever_resumo
echo "FIM $(cut -c1-9 "$O/cabeca") · $(grep -c '^- ' "$O/resumo.md") passos · vermelhos: $(python3 -c 'import json,sys; print(" ".join(json.load(open(sys.argv[1]))["vermelhos"]) or "nenhum")' "$O/resumo.json")"
[ "$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))["vermelhos"]))' "$O/resumo.json")" -eq 0 ] || exit 1
