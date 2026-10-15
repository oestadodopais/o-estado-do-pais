"""Mede a passagem V1-b pelos arquivos, recibos, testes e códigos do portão."""
import argparse
from collections import Counter
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
import unittest

PASTA = Path(__file__).resolve().parent
SITIO = PASTA.parents[3]


def guardar(nome, dado):
    (PASTA / nome).write_text(json.dumps(dado, ensure_ascii=False, indent=2) + '\n')


def git(raiz, *args):
    return subprocess.check_output(['git', *args], cwd=raiz, text=True).strip()


def limpar(s, motor):
    for origem, destino in ((str(motor), '<motor>'), (str(SITIO), '<sitio>'),
                            (str(Path.home()), '<casa>'), (Path.home().name, '<utilizador>')):
        s = s.replace(origem, destino)
    return s


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--motor', required=True, type=Path)
    p.add_argument('--provas', action='store_true')
    p.add_argument('--fecho', action='store_true')
    a = p.parse_args()
    motor = a.motor.resolve()
    sys.path.insert(0, str(motor))
    from vigilancia import diario, verificar, medir
    from vigilancia.transporte import sha, descodificar
    from vigilancia.tests import test_vigilancia as testes
    raiz = motor / 'vigilancia'
    reg = json.loads((raiz / 'fontes.json').read_text())
    codigo = git(motor, 'log', '-1', '--format=%H', '--', 'vigilancia/*.py', 'vigilancia/tests', 'vigilancia/fontes.json', 'vigilancia/README.md')
    sitio_codigo = git(SITIO, 'log', '-1', '--format=%H', '--', str(PASTA.relative_to(SITIO) / '*.py'))
    if a.provas:
        plantas = []
        for classe in (testes.Provas, testes.PlantasDAR, testes.PlantasDR):
            for nome, mensagem in testes.PLANTAS.items():
                saida = io.StringIO()
                resultado = unittest.TextTestRunner(stream=saida, verbosity=2).run(unittest.TestSuite([classe('test_planta_' + nome)]))
                plantas.append({'planta': classe.__name__ + '.' + nome, 'mensagem': mensagem,
                    'passou': resultado.wasSuccessful(), 'testes': resultado.testsRun, 'registo': limpar(saida.getvalue(), motor)})
        novas = {
            'resumo_iniciativas_sem_ligacao_rotativa': 'ligação rotativa da iniciativa entrou no resumo',
            'dar_servido_com_outra_ligacao_na_segunda_corrida': 'ligação rotativa apresentada como revisão',
            'planta_limitacao_como_falha': 'limitação conhecida apresentada como falha',
            'planta_falha_como_limitacao': 'falha apresentada como limitação',
            'planta_data_sessao': 'data da sessão errada contra o arquivo',
            'planta_declaracao_deslocada': 'declaração deslocada contou duas vezes',
            'planta_outro_orador_na_posicao': 'outro orador apresentado como revisão da declaração anterior',
            'outro_orador_mesmas_palavras_tem_outro_id': 'outro orador com as mesmas palavras herdou a identidade anterior',
            'bytes_pdf_sem_mudar_declaracao': 'bytes do PDF apresentaram declarações intactas como revistas',
            'head_compara_tamanho_descomprimido': 'HEAD voltou a transferir o corpo arquivado',
            'documento_429_ou_5xx_fecha_anfitriao': 'HTTP {status}; anfitrião fechado para o resto da corrida',
            'teto_exato_impede_segundo_pedido': 'teto de bytes atingido',
            'hashes_comparam_todas_as_corridas': 'corrida com código diferente desapareceu da medida',
        }
        for nome, mensagem in novas.items():
            saida = io.StringIO()
            resultado = unittest.TextTestRunner(stream=saida, verbosity=2).run(unittest.TestSuite([testes.Provas('test_' + nome)]))
            plantas.append({'planta': nome, 'mensagem': mensagem, 'passou': resultado.wasSuccessful(),
                'testes': resultado.testsRun, 'registo': limpar(saida.getvalue(), motor)})
        guardar('plantas-b.json', {'codigo': codigo, 'plantas': plantas})
        for nome, args in (('autotestes-b', ['python3', '-m', 'vigilancia.tests']),
                           ('fluxo-b', ['python3', '-m', 'vigilancia.fluxo']),
                           ('fluxos-motor-b', ['python3', 'indicators/provar_fluxo.py'])):
            resultado = subprocess.run(args, cwd=motor, capture_output=True, text=True)
            (PASTA / (nome + '.log')).write_text(limpar(resultado.stdout + resultado.stderr, motor))
            guardar(nome + '.json', {'comando': ' '.join(args), 'codigo': resultado.returncode, 'codigo_cabeca': codigo})
            assert resultado.returncode == 0
    corridas, medidas = [], []
    for ficheiro in sorted((raiz / 'corridas').glob('*.json')):
        r = json.loads(ficheiro.read_text())
        verificar.corrida(r)
        pedidos = [json.loads(l) for l in (raiz / 'pedidos' / (r['id'] + '.jsonl')).read_text().splitlines()]
        saltos = [s for p in pedidos for s in p['saltos']]
        assert len(saltos) == r['medidas']['pedidos']
        assert sum(s['bytes'] for s in saltos) == r['medidas']['bytes']
        if 'bytes_por_fonte' in r['medidas']:
            por_fonte = {k: sum(p['bytes_recebidos'] for p in pedidos if p.get('origem') == k) for k in r['medidas']['bytes_por_fonte']}
            assert por_fonte == r['medidas']['bytes_por_fonte']
            assert sum(por_fonte.values()) == r['medidas']['bytes']
        corridas.append(r)
        medidas.append({'id': r['id'], 'codigo_cabeca': r['codigo_cabeca'], **r['medidas'], 'fontes': r['fontes'],
            'falhas_detalhe': r['falhas'], 'limitacoes': r.get('limitacoes', []), 'fila': len(r['fila']),
            'segunda_leitura': medir.segunda_leitura(r),
            'reutilizacoes': [{'chave': p.get('chave'), 'razao': p['igual'], 'bytes': p['bytes_recebidos']} for p in pedidos if p.get('igual')]})
    comparacoes = medir.hashes_corridas(corridas, raiz, reg)
    guardar('hashes-b.json', comparacoes)
    ids = {c['id'] for c in comparacoes if c['codigo_igual'] and c['registo_igual']}
    finais = [r for r in corridas if r['id'] in ids and r['dia'] == '2026-10-12']
    guardar('corridas-b.json', medidas)
    integridade, dias, entradas, cache = [], [], [], {}
    for f in sorted((raiz / 'indice').glob('*.json')):
        indice = json.loads(f.read_text())
        for e in indice['entradas']:
            verificar.entrada(e, raiz, reg, cache)
            integridade.append({'dia': indice['dia'], 'id': e['id'], 'versao': e['versao'], 'sha256': e['sha256'], 'conferida': True})
        for r in indice['corridas']:
            assert r == json.loads((raiz / 'corridas' / (r['id'] + '.json')).read_text())
        entradas.extend(indice['entradas'])
        detalhes = diario.detalhes_resumo(indice)
        texto = (raiz / 'resumo' / (indice['dia'] + '.md')).read_text()
        assert texto == detalhes.pop('texto')
        assert len(texto.encode()) < 2500
        dias.append({'dia': indice['dia'], 'bytes_resumo': len(texto.encode()), **detalhes,
                     'recontagem': indice.get('recontagem_v1b')})
    verificar.fundamentos(reg, raiz)
    arquivos = list((raiz / 'arquivo/sha256').glob('*/*'))
    for f in arquivos:
        assert sha(f.read_bytes()) == f.parent.name + f.name
    guardar('integridade-b.json', {'entradas': integridade, 'dias': dias, 'corpos_conferidos': len(arquivos), 'fundamentos': reg['fundamentos_arquivados']})
    anteriores = json.loads((PASTA / 'alteracoes-preexistentes.json').read_text())
    preservados = {n: sha((SITIO / n).read_bytes()) == digest for n, digest in anteriores.items()}
    assert all(preservados.values())
    protegidos = git(motor, 'status', '--short', '--', 'indicators/*.json', 'indicators/vintages.json', '.maintenance-locks/', 'sweeps/', 'publisher/recortes/manifest.regioes.json')
    assert not protegidos
    fugas = []
    proibidos = (str(Path.home()).encode(), Path.home().name.encode(),
                 '/'.join(('Instruments', '')).encode(), '/'.join(('.claude', 'worktrees', '')).encode())
    candidatos = [f for pasta in (raiz, PASTA) for f in pasta.rglob('*') if f.is_file() and '__pycache__' not in f.parts and '.cache' not in f.parts and f.name != '.lock']
    for f in candidatos:
        b = f.read_bytes()
        if any(v in b for v in proibidos): fugas.append(f.name)
    vistos = set()
    for ficheiro in (raiz / 'pedidos').glob('*.jsonl'):
        for linha in ficheiro.read_text().splitlines():
            pedido = json.loads(linha)
            if pedido.get('arquivo') and pedido['arquivo'] not in vistos:
                vistos.add(pedido['arquivo'])
                b = descodificar((raiz / pedido['arquivo']).read_bytes(), pedido.get('encoding'))
                if any(v in b for v in proibidos): fugas.append(pedido['arquivo'])
    assert not fugas
    guardar('preservacao-b.json', {'protegidos': protegidos, 'preexistentes': preservados, 'fugas': fugas})
    atuais = diario.entradas_vigentes(entradas)
    plantas = json.loads((PASTA / 'plantas-b.json').read_text()) if (PASTA / 'plantas-b.json').exists() else {'plantas': []}
    portao = PASTA / 'portoes-b/motor.codigo'
    gate = json.loads((PASTA / 'portoes-b/motor.json').read_text()) if portao.exists() else {}
    medidas_finais = [r for r in medidas if r['id'] in {c['id'] for c in finais}]
    aceites = {
        'duas_corridas_12_10_codigo_final': len(finais) >= 2,
        'segunda_leu_tres_fontes': len(finais) >= 2 and all(f.get('lida') for f in finais[-1]['fontes'].values()),
        'segunda_sem_entradas_ou_revisoes': medir.segunda_leitura(finais[-1]) if len(finais) >= 2 else 'não medido',
        'entrada_de_cada_fonte': all(any(e['origem'] == k for e in atuais) for k in reg['entradas']),
        'plantas': bool(plantas['plantas']) and all(x['passou'] for x in plantas['plantas']),
        'portao': int(portao.read_text()) if portao.exists() else None,
        'portao_cabeca_codigo': gate.get('cabeca') == codigo,
        'readme': (raiz / 'README.md').is_file(),
        'custo_tokens_used': None,
    }
    if a.fecho:
        assert aceites['duas_corridas_12_10_codigo_final'] and aceites['segunda_leu_tres_fontes']
        assert all(v is True for v in aceites['segunda_sem_entradas_ou_revisoes'].values())
        assert aceites['portao'] == 0 and aceites['portao_cabeca_codigo'] and aceites['plantas']
    cabecas = {'motor': git(motor, 'rev-parse', 'HEAD'), 'motor_codigo': codigo,
        'sitio_antes_fecho': git(SITIO, 'rev-parse', 'HEAD'), 'sitio_codigo': sitio_codigo,
        'commits_motor': git(motor, 'log', '--reverse', '--format=%H %s', 'f8e0784..HEAD').splitlines(),
        'commits_sitio': git(SITIO, 'log', '--reverse', '--format=%H %s', '256806ac..HEAD').splitlines()}
    guardar('cabecas-b.json', cabecas)
    guardar('aceitacao-b.json', {'criterios': aceites, 'corridas_finais': medidas_finais,
        'por_fonte': {k: sum(e['origem'] == k for e in atuais) for k in reg['entradas']}, 'por_tipo': {f['tipo']: sum(e['tipo'] == f['tipo'] for e in atuais) for f in reg['entradas'].values()},
        'dias': dias, 'codigo': codigo, 'sitio_codigo': sitio_codigo, 'todos_hashes': comparacoes})
    sem_data = finais[-1]['fontes'].get('iniciativas', {}).get('sem_data', []) if finais else []
    estado_iniciativas = (f'O ficheiro das iniciativas foi lido; registos sem data de entrada: {len(sem_data)}. ' + ('Estes registos continuam nomeados como falha e ficam fora da contagem das entradas datadas. ' if sem_data else '')) if finais else 'Corridas finais ainda por registar. '
    estado_aceitacao = 'Existe uma entrada verificada de cada fonte.' if aceites['entrada_de_cada_fonte'] else 'A aceitação de uma entrada de cada fonte continua por cumprir enquanto não houver uma iniciativa verificável na janela.'
    linhas = ['## A passagem V1-b', '',
        'Medida por `python3 <medicoes>/medir_v1b.py --motor <motor> --provas --fecho`. Os recibos de diagnóstico são preservados; as medidas desta secção substituem as conclusões anteriores sobre revisões, cobertura, segunda leitura e igualdade do código.', '',
        ('A segunda corrida leu as três fontes dentro dos tetos.' if aceites['segunda_leu_tres_fontes'] else 'A segunda leitura integral das fontes ainda não foi demonstrada.') +
        ' ' + estado_iniciativas + estado_aceitacao, '',
        '| Corrida | Pedidos | Bytes | Segundos | Novas | Revisões reais | Iguais | Falhas |',
        '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for r in medidas_finais:
        linhas.append(f"| `{r['id']}` | {r['pedidos']} | {r['bytes']} | {r['segundos']} | {r['novas']} | {r['revisoes']} | {r['iguais']} | {r['falhas']} |")
    for r in medidas_finais:
        linhas += ['', f"Bytes por fonte: `{json.dumps(r['bytes_por_fonte'], ensure_ascii=False)}`.",
            f"Entradas por fonte: `{json.dumps(r['entradas_por_fonte'], ensure_ascii=False)}`. Por tipo: `{json.dumps(r['entradas_por_tipo'], ensure_ascii=False)}`.",
            f"Leitura por fonte: `{json.dumps({k: f.get('lida', False) for k, f in r['fontes'].items()}, ensure_ascii=False)}`. Comparação: `{json.dumps(r['segunda_leitura'], ensure_ascii=False)}`.", '']
    linhas += ['Os bytes foram recalculados pelos saltos de cada pedido. A parcela `politicas` contém os robots comuns. `corridas-b.json` conserva as reutilizações, as razões das falhas, as limitações e o âmbito da comparação. Os atos de JavaScript ficam como cobertura parcial, sem alimentar o alarme; os registos das iniciativas sem data, quando existem, continuam como falha.', '']
    for d in dias:
        linhas.append(f"* Resumo de {d['dia']}: {d['bytes_resumo']} bytes UTF-8; {len(d['entradas'])} atos/iniciativas listados; {len(d['grupos_dar'])} grupos do DAR; {d['omitidas']} atos/iniciativas remetidos para o índice.")
        if d['recontagem']:
            linhas.append(f"* Recontagem: {d['recontagem']['revisoes_reais']} revisões reais; {d['recontagem']['revisoes_so_ligacao']} diagnósticos de revisão só por ligação. Números do DAR: `{json.dumps(d['recontagem']['numeros_dar'], ensure_ascii=False)}`. Os recibos originais permanecem iguais aos das corridas.")
    linhas += ['', 'A Portaria dos combustíveis consta do resumo refeito de 11.10, verificado pela planta do resumo. As declarações mostram a sessão lida no PDF. O resumo usa a designação do ato, sem a referência repetida da edição, com autoria quando disponível, data, arquivo e ligação. As ligações cifradas do Parlamento ficam no índice.', '',
        '### Plantas e portão', '', f"Plantas e controlos: {sum(x['passou'] for x in plantas['plantas'])} aprovados em {len(plantas['plantas'])}, em `plantas-b.json`. As cinco plantas originais são exercidas sobre iniciativa sintética, declaração real e ato real.", '']
    linhas += [f"* `{x['planta']}`: «{x['mensagem']}»; passou: {x['passou']}." for x in plantas['plantas']]
    linhas += ['', f"Portão: `{aceites['portao']}`, lido de `portoes-b/motor.codigo`; cabeça: `{gate.get('cabeca')}`. Log e metadados em `portoes-b/motor.log` e `portoes-b/motor.json`. Os dois validadores locais dos fluxos constam de `fluxo-b.json` e `fluxos-motor-b.json`.", '',
        '### Aceitação do brief', '', '| Critério | Medida |', '| --- | --- |',
        f"| Corridas e segunda leitura | `{json.dumps({k: aceites[k] for k in ('duas_corridas_12_10_codigo_final', 'segunda_leu_tres_fontes', 'segunda_sem_entradas_ou_revisoes')}, ensure_ascii=False)}` |",
        f"| Entrada de cada fonte | {aceites['entrada_de_cada_fonte']} |",
        f"| Plantas | {aceites['plantas']} |",
        f"| Portão na cabeça, fluxos e preservação | {aceites['portao']}; cabeça coincidente: {aceites['portao_cabeca_codigo']}; ver provas e preservação |",
        f"| README e proposta de melhoria | {aceites['readme']}; proposta abaixo |",
        '| Medidas por guião e custo | Guião e recibos alojados; linha tokens used não observada |', '',
        f"Código do motor: `{codigo}`. Motor na medição: `{cabecas['motor']}`. Código dos guiões do sítio: `{sitio_codigo}`. As cabeças e os commits anteriores ao fecho estão em `cabecas-b.json`; a cabeça final do sítio será posterior ao relatório que ela contém.", '',
        'A comparação `hashes-b.json` inclui todas as corridas, sem as filtrar por igualdade antes de as medir. As corridas antigas com código diferente estão identificadas individualmente. Os recibos finais são selecionados pela igualdade do código e do registo, não pelo nome do ramo.', '',
        f"Ficheiros preexistentes preservados: {len(preservados)} de {len(preservados)}; caminhos protegidos do motor sem alterações; fugas de caminhos ou nome local: {len(fugas)}. `confirmacao-b.json` confirma os achados plantados nas cópias.", '',
        '### Questões novas', '',
        '* **V1-15**: tamanho e validadores iguais autorizam reutilização pelo mandato, mas não provam igualdade criptográfica do conteúdo remoto. Sem validadores, uma alteração do mesmo tamanho pode não ser detetada.',
        f'* **V1-16**: registos sem data não permitem decidir a pertença à janela. Na última corrida final: {len(sem_data)}, identificados como `{json.dumps(sem_data, ensure_ascii=False)}`. Não se atribui uma data presumida nem se alarga a janela para obter uma entrada.',
        '* **V1-17**: o catálogo consultado expõe o ficheiro corrente cumulativo. HEAD torna a comparação diária viável, pelo que não foi ativada a alternativa semanal. O resumo e o registo mantêm a cadência diária.',
        '* **V1-18**: a reconferência inicial limita-se ao número de dias declarado no registo. Os vistos persistentes mantêm os identificadores anteriores; uma interrupção longa exige atenção à cobertura declarada.',
        '* **V1-19**: a prova dos direitos do DR é uma extração textual identificada da página oficial, com sha256. A tentativa HTTP direta do cliente da casa recebeu JavaScript e está conservada separadamente. Não se afirma ter alojado o HTML integral dessa página.',
        '* **V1-20**: o resumo mantém um limite conservador de bytes UTF-8 e declara as omissões. Não existe medição por tokenizador de modelo no guião.',
        '* **V1-21**: as revisões artificiais foram retificadas no índice e na leitura do resumo, com os valores de diagnóstico conservados e sem reescrever os recibos das corridas antigas.', '',
        'Proposta para o registo das melhorias: vigilância diária com reutilização verificável dos arquivos, identidade das declarações independente da ligação e da paginação, datas separadas, limitações distintas das falhas e resumo orientado para atos e iniciativas. A direção decide o registo.', '',
        'Custo: a linha `tokens used` não foi exposta. O desvio ao alvo do mandato não é verificável e não é estimado.', '']
    caminho = PASTA / 'LEIA-ME.md'
    anterior = caminho.read_text().split('\n## A passagem V1-b\n')[0].rstrip()
    anterior = anterior.replace('A leitura a frio do Opus e a conferência da direção continuam por fazer.', 'Esta secção documenta a entrega inicial; a leitura a frio e a passagem V1-b constam dos registos e da secção final.')
    caminho.write_text(anterior + '\n\n' + '\n'.join(linhas))
    print(json.dumps(aceites, ensure_ascii=False))


if __name__ == '__main__':
    main()
