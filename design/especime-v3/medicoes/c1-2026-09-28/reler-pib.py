#!/usr/bin/env python3
"""C1: relê os PIB pelo cliente do motor, sem escrever no livro nem no painel.

Uso: python3 reler-pib.py --motor <cópia do motor> [--pedir] [--escrever]
Sem --pedir, confere os corpos já guardados, sem rede. --escrever acrescenta
apenas a releitura, pelo escritor do painel, se todos os valores forem iguais.
"""
import argparse
import hashlib
import json
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from unittest.mock import patch

import yaml

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
PROVAS = AQUI / 'pib'
IDS = ('pib-real-per-capita-2024', 'pib-real-per-capita-2025',
       'pib-real-per-capita-2025-ue')


def resumo(corpo):
    return hashlib.sha256(corpo).hexdigest()


def protegidos(motor):
    ficheiros = list((motor / 'indicators').glob('*.json'))
    ficheiros += [motor / 'publisher/recortes/manifest.regioes.json']
    for pasta in ('.maintenance-locks', 'sweeps'):
        if (motor / pasta).exists():
            ficheiros += [p for p in (motor / pasta).rglob('*') if p.is_file()]
    return {p.relative_to(motor).as_posix(): resumo(p.read_bytes())
            for p in sorted(set(ficheiros)) if p.is_file()}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--motor', required=True, type=Path)
    ap.add_argument('--pedir', action='store_true')
    ap.add_argument('--escrever', action='store_true')
    args = ap.parse_args()
    motor = args.motor.expanduser().resolve()
    sys.path.insert(0, str(motor))
    from core.http import CASA_UA, HttpClient
    from indicators import refresh as R
    from indicators.refresh_dimensoes_test import conferir

    inicio = datetime.now(timezone.utc).isoformat(timespec='seconds')
    antes = protegidos(motor)
    originais = {cid: (SITIO / 'ledger/claims' / (cid + '.yml')).read_bytes()
                 for cid in IDS}
    linhas = {cid: yaml.safe_load(corpo) for cid, corpo in originais.items()}
    base = json.loads((motor / 'indicators/canary_baseline.json').read_text())
    pedidos, resultados = [], []
    guardados = PROVAS / 'pedidos.json'
    anteriores = json.loads(guardados.read_text()) if guardados.exists() else []
    historia = PROVAS / 'tentativas.json'
    tentativas = json.loads(historia.read_text()) if historia.exists() else anteriores
    por_url = {p['url']: p for p in anteriores if p['http'] == 200 and not p['erro']}
    PROVAS.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix='c1-http-') as cache:
        cliente = HttpClient(user_agent=CASA_UA, cache_dir=Path(cache),
                             timeout_s=60, min_interval_s=2)

        def ler(url, nome):
            if not args.pedir:
                p = por_url[url]
                corpo = (PROVAS / p['ficheiro']).read_bytes()
                assert resumo(corpo) == p['sha256'], 'Os bytes guardados mudaram'
            elif url in {p['url'] for p in pedidos}:
                p = next(p for p in pedidos if p['url'] == url)
                corpo = (PROVAS / p['ficheiro']).read_bytes()
            else:
                hora = datetime.now(timezone.utc).isoformat(timespec='seconds')
                r = cliente.condicional(url)
                corpo = r.corpo or b''
                p = dict(url=url, url_final=r.url_final, hora_utc=hora,
                         http=r.status, cliente='core.http.HttpClient.condicional',
                         user_agent=CASA_UA, sha256=resumo(corpo),
                         ficheiro=f'{len(tentativas) + 1:03d}-{nome}.json', bytes=len(corpo),
                         erro=r.erro)
                (PROVAS / p['ficheiro']).write_bytes(corpo)
                # Guarda cada tentativa antes de conferir o corpo.
                tentativas.append(p)
                historia.write_text(json.dumps(tentativas, ensure_ascii=False, indent=2) + '\n')
                guardados.write_text(json.dumps(pedidos + [p], ensure_ascii=False, indent=2) + '\n')
            assert p['http'] == 200 and not p['erro'], 'Pedido sem resposta utilizável'
            if url not in {p['url'] for p in pedidos}:
                pedidos.append(p)
            return json.loads(corpo), p

        for cid, linha in linhas.items():
            url = linha['source_url']
            parte = urlsplit(url)
            geo = dict(parse_qsl(parte.query))['geo']
            corpo, pedido = ler(url, 'tipsna40-' + geo)
            with patch.object(R, '_JS_DA_CORRIDA', {url: corpo}):
                estado, erro, rede = R.probe(url, linha['reference_date'], linha)
                _, erro_sem_coordenada, _ = R.probe(url, linha['reference_date'])
            assert not erro and not rede, 'A coordenada selada não resolveu a resposta'
            codigo = estado['coordenadas']['unit']
            parametros = [(k, v) for k, v in parse_qsl(parte.query) if k != 'unit']
            parametros.append(('unit', codigo))
            fixo = urlunsplit((parte.scheme, parte.netloc, parte.path,
                              urlencode(parametros), parte.fragment))
            corpo_fixo, pedido_fixo = ler(fixo, 'tipsna40-' + geo + '-unidade-fixa')
            with patch.object(R, '_JS_DA_CORRIDA', {fixo: corpo_fixo}):
                estado_fixo, erro_fixo, rede_fixa = R.probe(fixo, linha['reference_date'], linha)
            assert not erro_fixo and not rede_fixa, 'A releitura com unidade fixa falhou'
            assert estado_fixo['value'] == estado['value'], 'Os dois pedidos discordam'
            entrada = R.verification_entry(linha, estado_fixo, None, pedido_fixo['hora_utc'][:10])
            # O caminho da releitura é o pedido efetivo; a fonte histórica fica.
            entrada['path'] = fixo
            canarias = [dict(canaria=c, gravidade=g, mensagem=m)
                        for c, g, m in R.canaries(linha, estado, base.get(cid),
                                                e_a_mais_recente=linha['reference_date'] == '2025')]
            resultados.append(dict(id=cid, source_url=url, pedido_fixo=fixo,
                                   valor_selado=linha['value'], unidade_selada=linha['unit'],
                                   excerto_selado=linha['excerpt'],
                                   estado=estado, estado_fixo=estado_fixo,
                                   existencia_sem_coordenada=erro_sem_coordenada,
                                   existencia_com_coordenada=erro,
                                   resultado=entrada['result'], verificacao=entrada,
                                   canarias_do_pedido_historico=canarias,
                                   corpo=pedido['ficheiro'], corpo_fixo=pedido_fixo['ficheiro'],
                                   source_url_conservado=True))

    assert protegidos(motor) == antes, 'Um ficheiro protegido do motor mudou'
    assert all((SITIO / 'ledger/claims' / (cid + '.yml')).read_bytes() == b
               for cid, b in originais.items()), 'A releitura mudou uma linha'
    provas = conferir()
    medidas = dict(inicio_utc=inicio,
                   fim_utc=datetime.now(timezone.utc).isoformat(timespec='seconds'),
                   modo='rede' if args.pedir else 'corpos guardados',
                   linhas=resultados, plantas=provas,
                   ficheiros_protegidos_conservados=len(antes),
                   linhas_conservadas=len(originais), pedidos=len(pedidos),
                   iguais=sum(r['resultado'] == 'igual' for r in resultados),
                   divergentes=sum(r['resultado'] == 'diverge' for r in resultados),
                   ambiguidades=sum(bool(r['existencia_com_coordenada']) for r in resultados),
                   parada_antes_de_atualizacao=any(r['resultado'] == 'diverge' for r in resultados))
    destino = PROVAS / ('releitura.json' if args.pedir else 'conferencia.json')
    destino.write_text(json.dumps(medidas, ensure_ascii=False, indent=2) + '\n')
    if args.escrever and not medidas['parada_antes_de_atualizacao']:
        escritas = []
        for r in resultados:
            cid = r['id']
            caminho = SITIO / 'ledger/claims' / (cid + '.yml')
            original = linhas[cid]
            escrita = R.append_verification(caminho, r['verificacao'])
            if not escrita:
                raise RuntimeError('O escritor do painel recusou a entrada: ' + escrita.estado)
            depois = yaml.safe_load(caminho.read_text())
            campos = sorted(k for k in set(original) | set(depois)
                            if original.get(k) != depois.get(k))
            assert campos == ['verifications'], 'A escrita mudou outro campo'
            assert original['verifications'][-1] in depois['verifications'], 'A última leitura anterior desapareceu'
            assert depois['verifications'][-1] == r['verificacao'], 'A releitura escrita difere da observação'
            escritas.append(dict(id=cid, estado=escrita.estado, campos_mudados=campos,
                                 source_url_antes=original['source_url'],
                                 source_url_depois=depois['source_url'],
                                 valor_antes=original['value'], valor_depois=depois['value'],
                                 verificacoes_antes=original['verifications'],
                                 verificacoes_depois=depois['verifications'],
                                 sha256_antes=resumo(originais[cid]),
                                 sha256_depois=resumo(caminho.read_bytes())))
        assert protegidos(motor) == antes, 'A escrita mudou um ficheiro protegido do motor'
        (PROVAS / 'escrita.json').write_text(json.dumps(escritas, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: medidas[k] for k in ('iguais', 'divergentes', 'ambiguidades',
                                             'linhas_conservadas', 'pedidos')}, ensure_ascii=False))
    return 1 if medidas['parada_antes_de_atualizacao'] else 0


if __name__ == '__main__':
    sys.exit(main())
