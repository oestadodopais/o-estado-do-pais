#!/usr/bin/env python3
"""C1, ponto 3: mede o circuito real da linha, sem rede nem escrita no motor.

Este guião de entrega lê o motor; não é a medição do §0 do brief. O conhecido
positivo usa o mesmo leitor de identificadores para encontrar a inflação no
registo de travessia, no manifesto e no livro do estudo 13.
"""
import ast
import hashlib
import json
import os
from pathlib import Path
import subprocess

import yaml

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
MOTOR = Path(os.environ.get('C1_MOTOR', Path.home() / 'Instruments' / 'ResearchHub' / '.worktrees' / 'c1-2026-09-28'))
ALVO = 'divida-das-familias-2025-ue'
POSITIVO = 'ipc-variacao-homologa'
BASE = 'a677770f'


def git(raiz, *args):
    return subprocess.check_output(['git', *args], cwd=raiz, text=True).strip()


def sha(dados):
    return hashlib.sha256(dados).hexdigest()


def json_de(raiz, relativo):
    return json.loads((raiz / relativo).read_text())


def entradas(objeto, chave, campo):
    if chave is None:
        def textos(no):
            if isinstance(no, str):
                yield no
            elif isinstance(no, list):
                for item in no:
                    yield from textos(item)
            elif isinstance(no, dict):
                for k, v in no.items():
                    yield k
                    yield from textos(v)
        return set(textos(objeto))
    lista = objeto[chave]
    if isinstance(lista, dict):
        return set(lista)
    return {linha[campo] for linha in lista}


def constante(arvore, nome):
    for no in arvore.body:
        if isinstance(no, ast.Assign) and any(isinstance(t, ast.Name) and t.id == nome for t in no.targets):
            return ast.literal_eval(no.value)
    raise ValueError(f'constante ausente: {nome}')


def medida_circuito(ficheiro, objeto, chave, campo):
    ids = entradas(objeto, chave, campo)
    return {
        'ficheiro': ficheiro,
        'elementos_de_identificacao_lidos': len(ids),
        'leitor': 'campos textuais do JSON inteiro' if chave is None else f'identificadores de {chave}',
        'alvo_encontrado': ALVO in ids,
        'controlo_no_ficheiro': {'id': POSITIVO, 'encontrado': POSITIVO in ids},
    }


def main():
    cruzamentos = sorted((RAIZ / 'ledger/cruzamentos').glob('*.json'))
    if not cruzamentos:
        raise ValueError('o leitor de travessias não encontrou ficheiros')
    circuitos = [medida_circuito(str(p.relative_to(RAIZ)), json.loads(p.read_text()), None, None) for p in cruzamentos]
    manifesto = 'publisher/manifest.dominios.json'
    livro = 'content/13 Dominios/ledger.json'
    circuitos.extend([
        medida_circuito('~/Instruments/ResearchHub/' + manifesto, json_de(MOTOR, manifesto), 'rows', 'site_id'),
        medida_circuito('~/Instruments/ResearchHub/' + livro, json_de(MOTOR, livro), 'claims', 'id'),
    ])
    for circuito in circuitos:
        if circuito['alvo_encontrado']:
            raise ValueError('a linha passou a ter travessia; a conclusão da paragem precisa de nova leitura')
    obrigatorios = [c for c in circuitos if c['ficheiro'].endswith(('cruzamentos/dominios.json', manifesto, livro))]
    if len(obrigatorios) != 3 or not all(c['controlo_no_ficheiro']['encontrado'] for c in obrigatorios):
        raise ValueError('o conhecido positivo não atravessa os três pontos do circuito')

    caminho = f'ledger/claims/{ALVO}.yml'
    antes_bytes = subprocess.check_output(['git', 'show', f'{BASE}:{caminho}'], cwd=RAIZ)
    agora_bytes = (RAIZ / caminho).read_bytes()
    antes, agora = (yaml.safe_load(b) for b in (antes_bytes, agora_bytes))
    origem_rel = f'indicators/out/enquadramento-2026-09-15/claims/{ALVO}.yml'
    origem_bytes = (MOTOR / origem_rel).read_bytes()
    origem = yaml.safe_load(origem_bytes)
    resumo_rel = 'indicators/out/enquadramento-2026-09-15/resumo.json'
    resumo = json_de(MOTOR, resumo_rel)
    registos = [r for r in resumo['escritas'] if r.get('id') == ALVO]

    gerador_rel = 'indicators/enquadramento.py'
    gerador = ast.parse((MOTOR / gerador_rel).read_text())
    gera = next(no for no in gerador.body if isinstance(no, ast.FunctionDef) and no.name == 'linha_da_uniao')
    chamada = next(no for no in ast.walk(gera) if isinstance(no, ast.Call) and isinstance(no.func, ast.Name) and no.func.id == 'render_claim')
    argumentos = {a.arg: a.value for a in chamada.keywords}
    importa_study = any(isinstance(no, ast.ImportFrom) and no.module == 'indicators.generate_claims' and any(n.name == 'STUDY' for n in no.names) for no in gerador.body)
    constantes_rel = 'indicators/generate_claims.py'
    constantes = ast.parse((MOTOR / constantes_rel).read_text())
    estudo = constante(constantes, 'STUDY')
    slug = constante(constantes, 'NAMES_PT')['tipspd22'][0]
    provas_da_origem = {
        'cabecalho_nomeia_o_gerador': 'ResearchHub/indicators/enquadramento.py' in agora_bytes.decode(),
        'gerador_importa_STUDY': importa_study,
        'funcao_da_uniao_passa_STUDY': isinstance(argumentos['study'], ast.Name) and argumentos['study'].id == 'STUDY',
        'funcao_nomeia_o_gerador': ast.literal_eval(argumentos['gerador']) == 'enquadramento.py',
        'estudo_e_o_da_linha': estudo == agora['study'] == origem['study'],
        'id_deriva_do_conjunto_e_periodo': f'{slug}-{agora["reference_date"]}-ue' == ALVO,
        'resumo_regista_a_linha_uma_vez': len(registos) == 1,
        'campos_originais_iguais': all(agora.get(k) == origem.get(k) for k in ['id', 'value', 'unit', 'source_url', 'reference_date', 'study']),
    }
    if not all(provas_da_origem.values()):
        raise ValueError('a origem real não ficou provada por todos os testemunhos')

    # O conjunto existe no estudo 13 como metainformação de Portugal, sem linha.
    # Confere-se para que a ausência de travessia nunca seja contada como a
    # ausência de qualquer corpo com o mesmo nome.
    corpo_rel = 'content/13 Dominios/source/eurostat/tipspd22.json'
    corpo_bytes = (MOTOR / corpo_rel).read_bytes()
    corpo = json.loads(corpo_bytes)
    fetch_rel = 'content/13 Dominios/source/FETCH.json'
    fetch = json_de(MOTOR, fetch_rel)
    ficheiros = fetch.get('files', fetch.get('ficheiros'))
    if ficheiros is None:
        raise ValueError('o registo de descarga mudou de estrutura')
    pedido = ficheiros['eurostat/tipspd22.json']
    manifesto_corpos_rel = 'content/13 Dominios/source/MANIFEST.sha256'
    selos = dict((linha.split(maxsplit=1)[1], linha.split(maxsplit=1)[0]) for linha in (MOTOR / manifesto_corpos_rel).read_text().splitlines() if linha.strip())
    geos = list(corpo['dimension']['geo']['category']['index'])
    selado = sha(corpo_bytes) == pedido['sha256'] == selos['eurostat/tipspd22.json']
    if not selado or geos != ['PT']:
        raise ValueError('o corpo alojado deixou de ser a metainformação selada de Portugal')

    campos = {k: {'antes': antes[k], 'atual': agora[k], 'igual': antes[k] == agora[k]} for k in ['value', 'source_url', 'study']}
    resultado = {
        'guiao': str(Path(__file__).relative_to(RAIZ)),
        'cabeca_base': git(RAIZ, 'rev-parse', BASE),
        'cabeca_lida_do_sitio': git(RAIZ, 'rev-parse', 'HEAD'),
        'cabeca_lida_do_motor': git(MOTOR, 'rev-parse', 'HEAD'),
        'sem_pedidos_de_rede': True,
        'linha': ALVO,
        'conclusao': 'A linha pertence ao quadro institucional e foi gerada pelo enquadramento. Não tem entrada na travessia nem no livro do estudo 13; o caminho pedido no ponto 3 do brief não é o circuito desta linha.',
        'circuitos': circuitos,
        'conhecido_positivo': {
            'id': POSITIVO,
            'encontrado': all(c['controlo_no_ficheiro']['encontrado'] for c in obrigatorios),
            'ficheiros': [c['ficheiro'] for c in obrigatorios],
        },
        'contagens': {
            'registos_de_travessia_lidos': len(cruzamentos),
            'ocorrencias_da_linha_nos_circuitos': sum(c['alvo_encontrado'] for c in circuitos),
            'pontos_do_conhecido_positivo': sum(c['controlo_no_ficheiro']['encontrado'] for c in obrigatorios),
            'campos_historicos_alterados': sum(not c['igual'] for c in campos.values()),
        },
        'proveniencia_real': {
            'gerador': '~/Instruments/ResearchHub/' + gerador_rel,
            'funcao': gera.name,
            'linha_da_funcao': gera.lineno,
            'declaracao_do_estudo': '~/Instruments/ResearchHub/' + constantes_rel,
            'study': estudo,
            'artefacto_original': '~/Instruments/ResearchHub/' + origem_rel,
            'sha256_artefacto_original': sha(origem_bytes),
            'resumo_original': '~/Instruments/ResearchHub/' + resumo_rel,
            'entrada_do_resumo': registos[0],
            'provas': provas_da_origem,
        },
        'corpo_do_mesmo_conjunto_no_estudo_13': {
            'ficheiro': '~/Instruments/ResearchHub/' + corpo_rel,
            'geografias': geos,
            'funcao_declarada': pedido['measure'],
            'pedido': pedido['url'],
            'lido_a': pedido['fetched_at'],
            'sha256': sha(corpo_bytes),
            'selos_conferidos': selado,
            'registo': '~/Instruments/ResearchHub/' + fetch_rel,
            'manifesto': '~/Instruments/ResearchHub/' + manifesto_corpos_rel,
            'conclusao': 'O corpo alojado serve de metainformação para a leitura nacional. Traz Portugal e não traz a União Europeia.',
        },
        'comparacao_antes_atual': {
            'ficheiro': caminho,
            'sha256_antes': sha(antes_bytes),
            'sha256_atual': sha(agora_bytes),
            'bytes_iguais': antes_bytes == agora_bytes,
            'campos': campos,
            'atualizacoes_atuais': sum(c.get('kind') == 'atualizacao' for c in agora.get('corrections', [])),
            'ultima_releitura_registada': agora.get('verifications', [])[-1],
        },
    }
    destino = AQUI / 'circuito-divida.json'
    destino.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(resultado['contagens'], ensure_ascii=False))
    return 0 if all(c['igual'] for c in campos.values()) else 1


if __name__ == '__main__':
    raise SystemExit(main())
