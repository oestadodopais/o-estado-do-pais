#!/usr/bin/env python3
"""Os pontos da semana do Codex que uma passagem gastou, lidos das leituras de limites dos seus registos
(M81, 13.10.2026, DECISIONS.md §1.190).

O custo que o projeto media até 12.10.2026 (o total menos os símbolos em cache) explicava 75 % do movimento
dos pontos nesse dia; os pontos seguem o volume transportado por todos os turnos, a cache incluída a uma
taxa pequena (contando-a a um vigésimo, 96 %). Por isso o lançador lê o limite antes e depois de cada
passagem e este guião faz as contas a partir de `~/.codex/sessions/AAAA/MM/DD/rollout-*.jsonl`:

  python3 scripts/leituras/pontos.py --antes
      a última leitura do limite semanal, para a linha INICIO do lançador
  python3 scripts/leituras/pontos.py --inicio <ISO> --fim <ISO> --worktree <caminho> [--json <saída>]
      a passagem lançada nessa worktree nesse intervalo: os pontos antes e depois (a diferença é da conta
      inteira, por isso inclui as outras sessões do Codex que corriam no intervalo, que o guião conta e
      nomeia), os turnos, a entrada, a cache, a saída, o raciocínio, o contexto médio por turno e o custo
      antigo (total menos cache), para o quadro da §1.177 comparar passagens e modelos.

Nada se escreve de memória: o que o registo não traz fica como «sem leitura».
"""
import argparse
import datetime
import glob
import json
import os
import pathlib

CODEX = pathlib.Path.home() / '.codex' / 'sessions'


def instante(texto):
    return datetime.datetime.fromisoformat(texto.replace('Z', '+00:00'))


def registos_entre(a, b):
    dia = a.date() - datetime.timedelta(days=1)
    while dia <= b.date() + datetime.timedelta(days=1):
        yield from sorted(glob.glob(str(CODEX / f'{dia:%Y/%m/%d}' / 'rollout-*.jsonl')))
        dia += datetime.timedelta(days=1)


def ler(caminho):
    meta = {}
    turnos = []
    leituras = []
    with open(caminho, encoding='utf-8', errors='replace') as registo:
        for linha in registo:
            if '"token_count"' not in linha and '"session_meta"' not in linha:
                continue
            try:
                evento = json.loads(linha)
            except ValueError:
                continue
            carga = evento.get('payload') or {}
            if evento.get('type') == 'session_meta':
                meta = {'cwd': carga.get('cwd'), 'fonte': carga.get('source'), 'origem': carga.get('thread_source')}
                continue
            if evento.get('type') == 'event_msg' and carga.get('type') == 'token_count':
                marca = evento.get('timestamp')
                ultimo = (carga.get('info') or {}).get('last_token_usage') or {}
                if marca and ultimo:
                    turnos.append((instante(marca), ultimo))
                limite = (carga.get('rate_limits') or {}).get('primary') or {}
                if marca and limite.get('used_percent') is not None:
                    leituras.append((instante(marca), float(limite['used_percent']), limite.get('resets_at')))
    return meta, turnos, leituras


def e_guardian(meta):
    return not isinstance(meta.get('fonte'), str) or meta.get('origem') == 'guardian_review'


def antes():
    agora = datetime.datetime.now(datetime.timezone.utc)
    melhor = None
    for caminho in registos_entre(agora - datetime.timedelta(days=2), agora):
        _, _, leituras = ler(caminho)
        if leituras and (melhor is None or leituras[-1][0] > melhor[0]):
            melhor = leituras[-1]
    if melhor is None:
        print('pontos antes: sem leitura nos registos dos últimos três dias')
        return 1
    reposicao = datetime.datetime.fromtimestamp(melhor[2], datetime.timezone.utc).strftime('%d.%m %H:%M UTC') if melhor[2] else '?'
    print(f'pontos antes: {melhor[1]:.1f} % da semana (lido às {melhor[0]:%H:%M:%S} UTC de {melhor[0]:%d.%m}; repõe a {reposicao})')
    return 0


def passagem(inicio, fim, worktree, saida_json):
    alvo = os.path.realpath(worktree)
    todas = []
    for caminho in registos_entre(inicio, fim):
        meta, turnos, leituras = ler(caminho)
        if turnos or leituras:
            todas.append((caminho, meta, turnos, leituras))
    leituras_conta = sorted(l for _, _, _, ls in todas for l in ls)
    antes_ = [l for l in leituras_conta if l[0] < inicio]
    depois_ = [l for l in leituras_conta if l[0] <= fim]
    # A passagem é a sessão lançada nesta worktree com turnos dentro do intervalo; uma sessão retomada
    # (retomar-codex.sh) começou antes do intervalo, por isso contam-se só os turnos e as leituras dentro dele.
    margem = datetime.timedelta(seconds=120)
    candidatas = []
    for c, m, t, ls in todas:
        if not (t and m.get('cwd') and os.path.realpath(m['cwd']) == alvo and not e_guardian(m)):
            continue
        dentro = [(marca, uso) for marca, uso in t if inicio - margem <= marca <= fim]
        if dentro:
            candidatas.append((c, m, dentro, [l for l in ls if inicio - margem <= l[0] <= fim]))
    candidatas.sort(key=lambda x: x[2][0][0])
    resultado = {'inicio': inicio.isoformat(), 'fim': fim.isoformat(), 'worktree_sha1_12': __import__('hashlib').sha1(alvo.encode()).hexdigest()[:12]}
    # «Antes» é a primeira leitura da própria passagem quando a há (o primeiro turno quase não gasta), senão a
    # última leitura anterior ao início; «depois» é a última leitura da conta até ao fim.
    resultado['pontos_antes'] = candidatas[0][3][0][1] if candidatas and candidatas[0][3] else (antes_[-1][1] if antes_ else None)
    resultado['pontos_depois'] = depois_[-1][1] if depois_ else None
    resultado['pontos_diferenca'] = (resultado['pontos_depois'] - resultado['pontos_antes']) if resultado['pontos_antes'] is not None and depois_ else None
    outras = [(c, m, t) for c, m, t, _ in todas if any(inicio <= marca <= fim for marca, _ in t)]
    if candidatas:
        caminho, meta, turnos, _ = candidatas[0]
        outras = [(c, m, t) for c, m, t in outras if c != caminho]
        soma = {k: 0 for k in ('input_tokens', 'cached_input_tokens', 'output_tokens', 'reasoning_output_tokens', 'total_tokens')}
        for _, uso in turnos:
            for k in soma:
                soma[k] += uso.get(k) or 0
        resultado.update({
            'registo': pathlib.Path(caminho).name,
            'turnos': len(turnos),
            'entrada': soma['input_tokens'], 'cache': soma['cached_input_tokens'], 'saida': soma['output_tokens'],
            'raciocinio': soma['reasoning_output_tokens'], 'total': soma['total_tokens'],
            'contexto_medio': soma['input_tokens'] // max(1, len(turnos)),
            'custo_antigo': soma['total_tokens'] - soma['cached_input_tokens'],
            'primeiro_turno': turnos[0][0].isoformat(), 'ultimo_turno': turnos[-1][0].isoformat(),
        })
    else:
        resultado['registo'] = None
    resultado['outras_sessoes_no_intervalo'] = len(outras)
    resultado['das_quais_guardian'] = sum(1 for _, m, _ in outras if e_guardian(m))
    if saida_json:
        pathlib.Path(saida_json).write_text(json.dumps(resultado, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    p = resultado
    def pct(v):
        return 'sem leitura' if v is None else f'{v:.1f} %'
    diferenca = p['pontos_diferenca']
    linha = f"PONTOS antes={pct(p['pontos_antes'])} depois={pct(p['pontos_depois'])} diferença={'sem leitura' if diferenca is None else f'{diferenca:.1f}'}"
    linha += f" (outras sessões no intervalo: {p['outras_sessoes_no_intervalo']}, guardian: {p['das_quais_guardian']})"
    if p['registo']:
        linha += (f" turnos={p['turnos']} entrada={p['entrada']} cache={p['cache']} saída={p['saida']} raciocínio={p['raciocinio']}"
                  f" contexto_médio={p['contexto_medio']} custo_antigo={p['custo_antigo']} registo={p['registo']}")
    else:
        linha += ' sem registo da passagem nesta worktree no intervalo'
    print(linha)
    return 0


def principal():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--antes', action='store_true')
    parser.add_argument('--inicio')
    parser.add_argument('--fim')
    parser.add_argument('--worktree')
    parser.add_argument('--json')
    args = parser.parse_args()
    if args.antes:
        return antes()
    if not (args.inicio and args.fim and args.worktree):
        parser.error('precisa de --antes, ou de --inicio, --fim e --worktree')
    return passagem(instante(args.inicio), instante(args.fim), args.worktree, args.json)


if __name__ == '__main__':
    raise SystemExit(principal())
