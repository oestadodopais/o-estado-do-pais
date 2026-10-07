#!/usr/bin/env python3
"""Lê respostas, símbolos e segundos de uma sessão, sem copiar texto nem caminhos.

Uso: python3 scripts/leituras/custo.py <sessão.jsonl> [saída.json] [--desde ISO]
Aceita Claude (message.id e usage) e Codex (event_msg/token_count acumulado).
No Claude conta cada id uma vez, entrada da última parte e máximo da saída;
essa saída é um mínimo do fluxo. No Codex usa o último contador, nunca a soma
dos acumulados; --desde subtrai o último contador anterior ao corte. O intervalo
assim cortado inclui trabalho entre esse contador e o corte. Respostas sem id
contam-se por registo no Codex. Campos ausentes ficam null, não viram zeros.
Os segundos vão da primeira à última marca temporal do intervalo lido. O total
final «tokens used» do lançador não se reconstrói daqui. O sha256 identifica os
bytes lidos; um registo truncado ou um contador que recue fecha a leitura.
"""
import argparse
from datetime import datetime
import hashlib
import json
from pathlib import Path


def instante(texto):
    return datetime.fromisoformat(texto.replace('Z', '+00:00'))


def no_intervalo(evento, corte):
    marca = evento.get('timestamp')
    return not corte or (marca and instante(marca) >= corte)


def medir_claude(mensagens):
    por_id = {}
    for mensagem in mensagens:
        anterior = por_id.get(mensagem['id'], {})
        uso = dict(mensagem['usage'])
        # As partes de uma resposta repetem a entrada e podem trazer saída parcial.
        saidas = [u['output_tokens'] for u in (uso, anterior)
                  if isinstance(u.get('output_tokens'), int)]
        if saidas:
            uso['output_tokens'] = max(saidas)
        caracteres = len(json.dumps(mensagem.get('content'), ensure_ascii=False))
        uso['_caracteres'] = max(caracteres, anterior.get('_caracteres', 0))
        uso['_modelo'] = mensagem.get('model') or 'not exposed'
        por_id[mensagem['id']] = uso
    campos = ('input_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens', 'output_tokens')
    somas = {}
    for campo in campos:
        # Um valor desconhecido impede uma soma completa; nunca se inventa zero.
        conhecidos = all(type(uso.get(campo)) is int for uso in por_id.values())
        somas[campo] = sum(uso[campo] for uso in por_id.values()) if conhecidos else None
    parciais = sum(uso['_caracteres'] > 1000 and isinstance(uso.get('output_tokens'), int)
                   and uso['output_tokens'] <= 10 for uso in por_id.values())
    return {'formato': 'Claude', 'respostas_do_modelo': len(por_id),
            'modelos': sorted({uso['_modelo'] for uso in por_id.values()}),
            'simbolos': somas, 'saida_minima': True, 'respostas_com_saida_parcial': parciais}


def conferir_contadores(contadores):
    anteriores = {}
    for _, uso in contadores:
        for campo, valor in uso.items():
            if valor is None:
                continue
            if type(valor) is not int:
                raise ValueError('Um contador tem de ser inteiro ou null.')
            # Guarda o último valor conhecido, para null não esconder um recuo.
            if valor < 0 or valor < anteriores.get(campo, 0):
                raise ValueError('O contador acumulado recuou; não se pode somar esta sessão.')
            anteriores[campo] = valor


def medir_codex(contadores, escolhidos, corte):
    conferir_contadores(contadores)
    antes = [uso for marca, uso in contadores if corte and marca and instante(marca) < corte]
    depois = [(marca, uso) for marca, uso in contadores
              if not corte or (marca and instante(marca) >= corte)]
    if not depois:
        raise ValueError('Não há contador no intervalo pedido.')
    anterior = antes[-1] if antes else {}
    marca, ultimo = depois[-1]
    campos = {campo for _, uso in contadores for campo in uso}
    delta = {}
    for campo in sorted(campos):
        # Só se subtraem valores conhecidos; os acumulados nunca se somam.
        conhecido = type(ultimo.get(campo)) is int
        base_conhecida = not anterior or type(anterior.get(campo)) is int
        delta[campo] = ultimo[campo] - (anterior[campo] if anterior else 0) if conhecido and base_conhecida else None
    respostas = [e for e in escolhidos if e.get('type') == 'response_item'
                 and e.get('payload', {}).get('type') == 'message'
                 and e['payload'].get('role') == 'assistant']
    ids = {e['payload'].get('id') or f'registo-{i}' for i, e in enumerate(respostas)}
    modelos = sorted({e['payload']['model'] for e in escolhidos
                      if e.get('type') == 'turn_context' and e.get('payload', {}).get('model')})
    return {'formato': 'Codex', 'respostas_do_modelo': len(ids) if respostas else None,
            'modelos': modelos or ['not exposed'], 'simbolos': delta, 'contador_anterior': anterior,
            'ultima_medicao': marca, 'saida_minima': False,
            'limite': 'Último contador disponível, não o total final do lançador.'}


def medir(dados, desde=None):
    eventos = [json.loads(linha) for linha in dados.decode().splitlines() if linha.strip()]
    corte = instante(desde) if desde else None
    escolhidos = [evento for evento in eventos if no_intervalo(evento, corte)]
    marcas = sorted(e['timestamp'] for e in escolhidos if e.get('timestamp'))
    saida = {'registo_sha256': hashlib.sha256(dados).hexdigest(), 'desde': desde,
             'primeira_entrada': marcas[0] if marcas else None,
             'ultima_entrada': marcas[-1] if marcas else None,
             'segundos': (instante(marcas[-1]) - instante(marcas[0])).total_seconds() if marcas else None}
    claude = [e['message'] for e in escolhidos if isinstance(e.get('message'), dict)
              and e['message'].get('usage') and e['message'].get('id')]
    contadores = []
    for evento in eventos:
        payload = evento.get('payload', {})
        if evento.get('type') != 'event_msg' or payload.get('type') != 'token_count':
            continue
        uso = (payload.get('info') or {}).get('total_token_usage')
        if uso:
            contadores.append((evento.get('timestamp'), uso))
    if claude and contadores:
        raise ValueError('O registo mistura formatos de sessões diferentes.')
    if claude:
        saida.update(medir_claude(claude))
    elif contadores:
        saida.update(medir_codex(contadores, escolhidos, corte))
    else:
        raise ValueError('Não há contadores de utilização reconhecidos no intervalo pedido.')
    return saida


def principal():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sessao')
    parser.add_argument('saida', nargs='?')
    parser.add_argument('--desde')
    args = parser.parse_args()
    resultado = medir(Path(args.sessao).read_bytes(), args.desde)
    texto = json.dumps(resultado, ensure_ascii=False, indent=2) + '\n'
    if args.saida:
        Path(args.saida).write_text(texto)
    print(texto, end='')


if __name__ == '__main__':
    principal()
