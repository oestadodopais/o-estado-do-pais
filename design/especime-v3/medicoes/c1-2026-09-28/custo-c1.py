#!/usr/bin/env python3
"""Mede os cumulativos reais da sessão C1 e dos seus agentes, sem preços.

Lê apenas metadados, turn_context.model e event_msg.token_count. O diretório
de trabalho serve para escolher a sessão em memória; nunca é exportado.
Não soma eventos cumulativos da mesma sessão. Exclui a revisão automática.
"""
import argparse
from datetime import datetime, timezone
import io
import json
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
CAMPOS = ('input_tokens', 'cached_input_tokens', 'cache_write_input_tokens',
          'output_tokens', 'reasoning_output_tokens', 'total_tokens')


def data(valor):
    resultado = datetime.fromisoformat(valor.replace('Z', '+00:00'))
    if resultado.tzinfo is None:
        raise ValueError('Data sem fuso no registo de custo.')
    return resultado.astimezone(timezone.utc)


def eventos(ficheiro):
    """Uma sessão ativa pode acabar num evento que ainda está a ser escrito."""
    for linha in ficheiro:
        try:
            yield json.loads(linha)
        except json.JSONDecodeError:
            if not linha.endswith('\n'):
                return
            raise ValueError('Evento completo com JSON inválido no registo.') from None


def resumir(registos, nome):
    meta = None
    modelos = set()
    primeiro = ultimo = None
    for evento in registos:
        p = evento.get('payload', {})
        if evento.get('type') == 'session_meta':
            meta = {'id': p['id'], 'id_pai': p.get('parent_thread_id'),
                    'inicio': evento['timestamp']}
        elif evento.get('type') == 'turn_context' and p.get('model'):
            modelos.add(p['model'])
        elif evento.get('type') == 'event_msg' and p.get('type') == 'token_count':
            uso = (p.get('info') or {}).get('total_token_usage')
            if uso is None:
                continue
            if any(not isinstance(uso.get(k), int) or uso[k] < 0 for k in CAMPOS):
                raise ValueError('Cumulativo ausente ou inválido no registo.')
            if uso['total_tokens'] != uso['input_tokens'] + uso['output_tokens']:
                raise ValueError('O total não coincide com a entrada e a saída.')
            if uso['cached_input_tokens'] > uso['input_tokens']:
                raise ValueError('A entrada em cache excede a entrada total.')
            leitura = {'hora': evento['timestamp'], 'cumulativos': {k: uso[k] for k in CAMPOS}}
            primeiro = primeiro or leitura
            ultimo = leitura
    if meta is None or ultimo is None:
        raise ValueError('Sessão sem metadados ou sem token_count mensurável.')
    return {'ficheiro': nome, **meta, 'modelos_expostos': sorted(modelos) or ['not exposed'],
            'primeiro_token_count': primeiro['hora'], 'ultimo_token_count': ultimo['hora'],
            'cumulativos': ultimo['cumulativos']}


def metadados(ficheiro):
    with ficheiro.open() as entrada:
        for evento in eventos(entrada):
            if evento.get('type') == 'session_meta':
                return evento['payload']
    raise ValueError('Registo sem session_meta.')


def selecionar(candidatos, sessao_raiz=None):
    # Estes dados ficam em memória, fora do objeto publicado.
    na_arvore = [(p, m) for p, m in candidatos if Path(m.get('cwd', '')).resolve() == RAIZ]
    raizes = [(p, m) for p, m in na_arvore if not m.get('parent_thread_id')
              and (sessao_raiz is None or m['id'] == sessao_raiz)]
    if len(raizes) != 1:
        raise ValueError('Não foi encontrada uma sessão raiz única; use --sessao-raiz com o ID verificado.')
    raiz = raizes[0]
    agentes = []
    for p, m in na_arvore:
        origem = m.get('source')
        derivada = origem.get('subagent', {}) if isinstance(origem, dict) else {}
        if 'thread_spawn' in derivada and m.get('parent_thread_id') == raiz[1]['id']:
            agentes.append((p, m))
    if len(agentes) != 3:
        raise ValueError('A árvore medida não tem os três agentes declarados para o C1.')
    return [raiz, *sorted(agentes, key=lambda par: par[1]['timestamp'])]


def relogio(inicio, agora):
    portoes = []
    for nome in ('build', 'verify', 'typecheck'):
        base = AQUI / 'portoes' / nome
        caminhos = {ext: base.with_suffix('.' + ext) for ext in ('inicio', 'fim', 'codigo', 'cabeca')}
        if not all(p.exists() for p in caminhos.values()):
            continue
        valores = {k: p.read_text().strip() for k, p in caminhos.items()}
        abertura, fecho = data(valores['inicio']), data(valores['fim'])
        if fecho < abertura:
            raise ValueError('Um portão declara o fim anterior ao início.')
        portoes.append({'nome': nome, 'inicio': valores['inicio'], 'fim': valores['fim'],
                        'codigo': int(valores['codigo']), 'cabeca': valores['cabeca']})
    final = len(portoes) == 3 and len({p['cabeca'] for p in portoes}) == 1
    fim = max(data(p['fim']) for p in portoes) if final else agora
    return {'inicio_sessao': inicio,
            'fim_dos_portoes': fim.isoformat() if final else None,
            'medido_ate': fim.isoformat(),
            'criterio_do_fim': 'último dos três portões na mesma cabeça' if final else 'hora desta prévia; ainda faltam portões na mesma cabeça',
            'segundos': (fim - data(inicio)).total_seconds(),
            'portoes_presentes': portoes,
            'portoes_completos': final,
            'portoes_a_zero': final and all(p['codigo'] == 0 for p in portoes)}


def prova_do_leitor():
    uso = dict(zip(CAMPOS, [100, 40, 0, 10, 3, 110]))
    registos = [
        {'type': 'session_meta', 'timestamp': '2026-01-01T00:00:00Z',
         'payload': {'id': 'sessao-de-prova', 'cwd': 'CAMPO-QUE-NAO-SE-PUBLICA',
                     'base_instructions': 'CONTEUDO-QUE-NAO-SE-PUBLICA'}},
        {'type': 'turn_context', 'payload': {'model': 'modelo-exposto-pela-prova'}},
        {'type': 'event_msg', 'timestamp': '2026-01-01T00:00:01Z',
         'payload': {'type': 'token_count', 'info': {'total_token_usage': uso}}},
    ]
    entrada = io.StringIO('\n'.join(json.dumps(e) for e in [*registos, registos[-1]]) + '\n')
    resultado = resumir(eventos(entrada), 'prova.jsonl')
    assert resultado['cumulativos']['total_tokens'] == 110
    assert resultado['modelos_expostos'] == ['modelo-exposto-pela-prova']
    assert 'QUE-NAO-SE-PUBLICA' not in json.dumps(resultado)
    sem_modelo = resumir((e for e in registos if e['type'] != 'turn_context'), 'prova.jsonl')
    assert sem_modelo['modelos_expostos'] == ['not exposed']
    return {'cumulativos_nao_somados_entre_eventos': True,
            'conteudo_e_cwd_excluidos': True, 'modelo_nao_inferido': True}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--data', default='2026-09-28')
    ap.add_argument('--sessao-raiz')
    args = ap.parse_args()
    dia = datetime.strptime(args.data, '%Y-%m-%d')
    pasta = Path.home() / '.codex' / 'sessions' / dia.strftime('%Y/%m/%d')
    candidatos = [(p, metadados(p)) for p in sorted(pasta.glob('rollout-*.jsonl'))]
    escolhidos = selecionar(candidatos, args.sessao_raiz)
    sessoes = []
    for p, _ in escolhidos:
        with p.open() as entrada:
            sessoes.append(resumir(eventos(entrada), p.name))
    agora = datetime.now(timezone.utc)
    resultado = {
        'registado_em': agora.isoformat(),
        'ambito': 'sessão raiz e três agentes construtores do C1',
        'unidade': 'tokens cumulativos expostos pelo runtime',
        'limites': [
            'As revisões automáticas estão excluídas.',
            'A entrada em cache está incluída na entrada total; não se soma uma segunda vez.',
            'A saída de raciocínio está incluída na saída; não se soma uma segunda vez.',
            'As sessões ativas podem continuar a acumular tokens depois desta leitura.',
            'Não se estima um preço nem o consumo restante da subscrição.',
        ],
        'provas_do_leitor': prova_do_leitor(),
        'sessoes': sessoes,
        'soma_das_sessoes': {k: sum(s['cumulativos'][k] for s in sessoes) for k in CAMPOS},
        'relogio': relogio(sessoes[0]['inicio'], agora),
    }
    (AQUI / 'custo-c1.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'sessoes': len(sessoes), **resultado['soma_das_sessoes'],
                      'segundos': resultado['relogio']['segundos'],
                      'portoes_completos': resultado['relogio']['portoes_completos']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
