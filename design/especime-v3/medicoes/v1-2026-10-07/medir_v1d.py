"""Mede V1-d pelos recibos, pedidos, arquivo e plantas, sem números editoriais à mão."""
import argparse
from collections import Counter
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import unittest

PASTA = Path(__file__).resolve().parent
SITIO = PASTA.parents[3]
BASE_MOTOR = '3184e07bbc2b0dc58ce6db740f8e49f7dc428d1d'
BASE_SITIO = 'c8303a60ebff98f386c67713ff73379dff520790'


def guardar(nome, dado):
    p = PASTA / nome
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(dado, ensure_ascii=False, indent=2) + '\n')


def git(raiz, *args):
    return subprocess.check_output(['git', *args], cwd=raiz, text=True).strip()


def limpar(texto, motor):
    for origem, destino in ((str(motor), '<motor>'), (str(SITIO), '<sitio>'),
                            (str(Path.home()), '<casa>'), (Path.home().name, '<utilizador>')):
        texto = texto.replace(origem, destino)
    return texto


def pedidos(raiz, r):
    return [json.loads(l) for l in (raiz / 'pedidos' / (r['id'] + '.jsonl')).read_text().splitlines()]


def provas(motor, codigo):
    from vigilancia.tests import test_vigilancia as t
    plantas = []
    for classe in (t.Provas, t.PlantasDAR, t.PlantasDR):
        for nome, mensagem in t.PLANTAS.items():
            plantas.append((classe, 'planta_' + nome, mensagem))
    novas = {
        'resumo_nomeia_todos_atos_e_falhas_uma_vez': 'ato novo omitido por tamanho',
        'descricao_sem_espaco_xml_e_contagens_rotuladas': 'descrição sem espaço XML e contagens com âmbito',
        'resumo_razao_falha_inteira': 'razão da falha cortada ou repetida',
        'planta_reutilizacao_sem_validadores': 'reutilização sem validadores apresentada como validada',
        'planta_dar_novidade_do_dia': 'número do DAR do dia retirado do resumo pela segunda corrida',
        'reconferencia_retoma_apos_falha_indice': 'reconferência semanal perdida após falha do índice',
        'fugas_positivo_em_ficheiro': 'ficheiro com fuga plantada escapou ao detetor',
        'planta_limitacao_como_falha': 'limitação conhecida apresentada como falha',
        'planta_falha_como_limitacao': 'falha apresentada como limitação',
        'planta_dois_numeros_dar': 'número do DAR omitido do resumo sem aviso',
        'planta_ato_sem_descricao': 'ato sem a descrição da fonte',
        'cumulativo_teto_proprio_e_uma_transferencia': 'teto de uma transferência cumulativa por dia atingido; ficheiro alterado fica em fila',
        'cumulativo_excedente_nao_alojado': 'teto de bytes atingido; corpo incompleto não alojado',
        'indice_mesmo_tamanho_le_corpo': 'índice reutilizado só pelo tamanho',
        'head_mudado_nao_reutiliza_gzip_mesmo_tamanho': 'HEAD alterado foi ignorado pelo tamanho comprimido',
        'dar_servido_com_outra_ligacao_na_segunda_corrida': 'número arquivado desapareceu da reconferência semanal',
        'aviso_descompressao': 'ficheiro descomprimido acima de oitenta por cento do limite',
    }
    plantas.extend((t.Provas, nome, mensagem) for nome, mensagem in novas.items())
    resultados = []
    for classe, nome, mensagem in plantas:
        saida = io.StringIO()
        r = unittest.TextTestRunner(stream=saida, verbosity=2).run(unittest.TestSuite([classe('test_' + nome)]))
        resultados.append({'planta': classe.__name__ + '.' + nome, 'mensagem': mensagem,
                           'passou': r.wasSuccessful(), 'registo': limpar(saida.getvalue(), motor)})
    guardar('plantas-d.json', {'codigo': codigo, 'plantas': resultados})
    assert all(r['passou'] for r in resultados)
    for nome, comando in (('autotestes-d', ['python3', '-m', 'vigilancia.tests']),
                           ('fluxo-d', ['python3', '-m', 'vigilancia.fluxo']),
                           ('fluxos-motor-d', ['python3', 'indicators/provar_fluxo.py'])):
        r = subprocess.run(comando, cwd=motor, capture_output=True, text=True)
        (PASTA / (nome + '.log')).write_text(limpar(r.stdout + r.stderr, motor))
        guardar(nome + '.json', {'codigo': r.returncode, 'cabeca': codigo})
        assert r.returncode == 0


def aritmetica(raiz, finais, reg):
    # O corpo é identificado pelo arquivo da iniciativa, não por um tamanho presumido.
    atual_cumulativo = next(json.loads(linha) for f in reversed(sorted((raiz / 'pedidos').glob(finais[-1]['id'][:10] + 'T*.jsonl')))
        for linha in f.read_text().splitlines() if json.loads(linha).get('orcamento') == 'ficheiro_cumulativo' and json.loads(linha).get('arquivo'))
    corpo = atual_cumulativo['arquivo']
    historicos = []
    for f in sorted((raiz / 'pedidos').glob('*.jsonl')):
        for linha, texto in enumerate(f.read_text().splitlines(), 1):
            p = json.loads(texto)
            if p.get('arquivo') == corpo and p.get('bytes_recebidos', 0):
                historicos.append((f.name, linha, p))
    assert historicos, 'falta uma transferência observada do cumulativo'
    ficheiro, linha, transferencia = historicos[-1]
    bruto = (raiz / corpo).read_bytes()
    assert len(bruto) == transferencia['bytes_recebidos']
    cenarios = []
    for r in finais:
        ps = pedidos(raiz, r)
        cumulativos = [p for p in ps if p.get('orcamento') == 'ficheiro_cumulativo']
        assert len(cumulativos) == 1
        atual = cumulativos[0]
        bytes_fontes = dict(r['medidas']['bytes_por_fonte'])
        bytes_fontes['iniciativas'] += len(bruto) - atual['bytes_recebidos']
        pedidos_fontes = dict(r['medidas']['pedidos_por_fonte'])
        # Se houve HEAD igual, conserva-se esse HEAD e soma-se o GET observado.
        # Um GET com validador passa a 200 com corpo no mesmo pedido.
        extras = len(transferencia['saltos']) if all(s['metodo'] == 'HEAD' for s in atual['saltos']) else 0
        pedidos_fontes['iniciativas'] += extras
        comuns = sum(bytes_fontes.values()) - len(bruto)
        cenarios.append({'base': r['id'], 'base_sem_falhas': not r['falhas'], 'codigo_base': r.get('codigo_cabeca'), 'bytes_por_fonte': bytes_fontes, 'pedidos_por_fonte': pedidos_fontes,
            'bytes_totais': sum(bytes_fontes.values()), 'bytes_comuns': comuns,
            'bytes_cumulativo': len(bruto), 'pedidos': sum(pedidos_fontes.values()),
            'tetos': reg['limites'], 'cabe_comum': comuns <= reg['limites']['bytes'],
            'cabe_cumulativo': len(bruto) <= reg['limites']['bytes_ficheiro_cumulativo'],
            'cabem_pedidos': sum(pedidos_fontes.values()) <= reg['limites']['pedidos'],
            'segundos': 'não extrapolados: uma transferência diferente exige medição real'})
    resultado = {'transferencia_observada': {'pedido': ficheiro, 'linha': linha, 'arquivo': corpo,
        'bytes': len(bruto), 'saltos': len(transferencia['saltos'])},
        'hipotese': 'Mesmo tamanho comprimido e cadeia GET da última transferência integral observada; restantes pedidos como na corrida-base identificada. Não é uma corrida observada com mudança. Uma base com falhas não demonstra o custo de concluir as fontes que falharam.',
        'cenarios': cenarios}
    guardar('aritmetica-d.json', resultado)
    return resultado


def escrever_relatorio(resultados, finais, anteriores, aceites, gate, plantas, conta, resumos, codigo, codigo_sitio):
    linhas = ['## A passagem V1-d', '',
        'Medida por `python3 <medicoes>/medir_v1d.py --motor <motor> --provas --portao`. Os registos anteriores conservam os resultados que mediram na sua passagem.', '',
        'Aceitação das corridas: **' + ('cumprida' if aceites['aceitacao_corridas_cumprida'] else 'por cumprir') + '**. O estado exige o par final sem falhas, com leitura das três fontes e sem duplicação na segunda corrida. Limitações declaradas não são falhas de transporte.', '',
        '### As confirmações da leitura', '',
        'Os estragos plantados nas cópias não estavam no ramo. A conferência de entrada está em `d/confirmacao.json`:', '',
        '```json', json.dumps(json.loads((PASTA / 'd/confirmacao.json').read_text())['achados'], ensure_ascii=False, indent=2), '```', '',
        '### Corridas finais', '',
        '| Corrida | Pedidos | Bytes comuns | Bytes cumulativo | Segundos | Novas | Revisões | Iguais | Falhas |',
        '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for r in resultados:
        linhas.append(f"| `{r['id']}` | {r['pedidos']} | {r['bytes_comuns']} | {r['bytes_fora_teto_comum']['bytes']} | {r['segundos']} | {r['novas']} | {r['revisoes']} | {r['iguais']} | {r['falhas']} |")
    for r in resultados:
        linhas += ['', f"Recibo: `<motor>/{r['recibo']}`; pedidos: `<motor>/{r['registo_pedidos']}`.",
            f"Bytes por fonte: `{json.dumps(r['bytes_por_fonte'], ensure_ascii=False)}`. Pedidos por fonte: `{json.dumps(r['pedidos_por_fonte'], ensure_ascii=False)}`.",
            f"Estados: `{json.dumps({k: v['estado'] for k, v in r['fontes'].items()}, ensure_ascii=False)}`. Fontes lidas: `{json.dumps({k: v.get('lida', False) for k, v in r['fontes'].items()})}`.",
            f"Limitações por código: `{json.dumps(dict(Counter(l['codigo'] for l in r['limitacoes'])), ensure_ascii=False)}`."]
        linhas += [f"* {origem}: " + ' '.join(dict.fromkeys(l['razao'] for l in r['limitacoes'] if l['origem'] == origem)) for origem in r['fontes'] if any(l['origem'] == origem for l in r['limitacoes'])]
        linhas += ['', f"Falhas: `{json.dumps(r['falhas_detalhe'], ensure_ascii=False)}`. Tarefas pendentes: {len(r['fila'])}, integralmente em `corridas-d.json`.",
            f"Reconferências adiadas por fonte: `{json.dumps(dict(Counter(x['origem'] for x in r['reconferencias_adiadas'])))}`. Os corpos adiados não foram reconfirmados remotamente nessa corrida."]
    for r in anteriores:
        linhas += ['', f"Tentativa conservada fora do par final: `{r['id']}`; falhas: `{json.dumps(r['falhas'], ensure_ascii=False)}`; medidas em `tentativas-d.json`."]
    atrasos = [{k: l[k] for k in ('ultima_entrada', 'atraso_dias', 'dia', 'razao')} for r in finais for l in r['limitacoes'] if l['codigo'] == 'ficheiro_atrasado']
    linhas += ['', '### As iniciativas e o atraso da fonte', '',
        'A reutilização diz o que comparou: tamanho igual sem validadores, ou validadores efetivamente presentes. Igualdade de tamanho não demonstra igualdade do conteúdo remoto. O atraso vem da última data de entrada no corpo alojado, com a prova no recibo.', '',
        '```json', json.dumps(atrasos, ensure_ascii=False, indent=2), '```', '',
        'A aceitação das iniciativas depende de a fonte publicar o ficheiro com as entradas da janela. Um ficheiro que termina antes da janela não prova ausência de iniciativas no Parlamento.', '',
        f"Aceitação de entrada datada por fonte: `{json.dumps(aceites['entrada_datada_por_fonte'], ensure_ascii=False)}`.", '',
        '### A aritmética do achado 7', '',
        'A correção desta passagem conserva a novidade do DAR durante todas as corridas do dia. A prova executa duas corridas, confirma a comparação igual na segunda e conserva o grupo e a contagem; um dia posterior sem revisão não o repete.', '', '```json', json.dumps(json.loads((PASTA / 'd/novidade-dar.json').read_text()), ensure_ascii=False, indent=2), '```', '',
        'A conta de transferência exigida na passagem anterior é refeita pelos pedidos e recibos. Bases com falhas são identificadas e não demonstram o custo de concluir fontes que falharam.', '', conta['hipotese'], '',
        f"Transferência observada: `{conta['transferencia_observada']['pedido']}`, linha {conta['transferencia_observada']['linha']}; {conta['transferencia_observada']['bytes']} bytes e {conta['transferencia_observada']['saltos']} salto(s).", '',
        '| Base | Sem falhas | Comuns / teto | Cumulativo / teto | Total | Pedidos / teto | Cabe nos tetos de bytes e pedidos |',
        '| --- | --- | ---: | ---: | ---: | ---: | --- |']
    for c in conta['cenarios']:
        linhas.append(f"| `{c['base']}` | {c['base_sem_falhas']} | {c['bytes_comuns']} / {c['tetos']['bytes']} | {c['bytes_cumulativo']} / {c['tetos']['bytes_ficheiro_cumulativo']} | {c['bytes_totais']} | {c['pedidos']} / {c['tetos']['pedidos']} | {c['cabe_comum'] and c['cabe_cumulativo'] and c['cabem_pedidos']} |")
        linhas += ['', f"Código da base: `{c['codigo_base']}`. Bytes por fonte: `{json.dumps(c['bytes_por_fonte'])}`. Pedidos por fonte: `{json.dumps(c['pedidos_por_fonte'])}`.", '']
    linhas += ['Não se extrapola o tempo de uma transferência alterada nem o crescimento do corpo. O cenário é uma conta com o corpo observado, não uma corrida com mudança.', '',
        '### O resumo de 12.10 refeito, inteiro', '', '```text', resumos['2026-10-12'].rstrip(), '```', '',
        'As designações de todos os atos novos ficam no resumo; as descrições literais e os oradores ocupam o espaço restante. As razões não são cortadas e cada falha aparece uma vez. A arrumação fica no fim. O espaço exterior ao CDATA é removido na apresentação, mantendo intactos o arquivo e os selos históricos.', '',
        '### Plantas, portão e preservação', '',
        f"Plantas e controlos: {sum(x['passou'] for x in plantas['plantas'])} de {len(plantas['plantas'])}, em `plantas-d.json`."]
    linhas += [f"* `{x['planta']}`: «{x['mensagem']}»; passou: {x['passou']}." for x in plantas['plantas']]
    linhas += ['', f"Portão do motor: `{aceites['portao']}`, lido de `portoes-d/motor.codigo`, na cabeça `{gate['cabeca']}`. O registo lista a suite de vigilância e as plantas executadas. Provas dos fluxos em `fluxo-d.json` e `fluxos-motor-d.json`.", '',
        f"Código do motor: `{codigo}`. Código dos guiões do sítio: `{codigo_sitio}`. Cabeças medidas e commits em `cabecas-d.json`; o commit de fecho é posterior à medição. Hashes de todas as corridas em `d/hashes-todas-corridas.json`.", '',
        'A procura de fugas cobre as listas dos ficheiros tocados nos dois repositórios e os corpos descodificados. O conhecido-positivo cria uma cópia temporária, planta um ficheiro e chama o mesmo detetor; resultado em `d/fugas-positivo.json`. Listas completas e caminhos protegidos em `preservacao-d.json`.', '',
        '### Questões e escolhas desta passagem', '',
        '* **V1-33**: a data mais recente do ficheiro é uma medida da cobertura alojada, não uma alegação sobre a inexistência de iniciativas posteriores. A aceitação espera a publicação das entradas da janela pela fonte.',
        '* **V1-34**: o DAR segue a novidade do dia em qualquer corrida, tal como os atos. As alterações dos recibos desse dia e a marca de estreia preservam grupos; uma revisão histórica sem mudança hoje não basta para repetir o número.',
        '* **V1-35**: o resumo reserva primeiro as designações, as razões completas e os cabeçalhos do DAR. Corta descrições e oradores antes de perder designações. Se o conteúdo obrigatório exceder o limite, recusa a escrita em vez de ocultar atos.',
        '* **V1-36**: uma falha de índice no dia semanal conserva tarefas PDF com o documento e a prova de descoberta. As tarefas sobrevivem a novas falhas e saltam a cadência no dia seguinte; isto concretiza a V1-23.',
        '* **V1-37**: o conhecido-positivo de fugas usa um ficheiro numa cópia temporária, e o portão mostra os nomes das suites e os resultados das plantas. Uma marca de sucesso sem execução não é prova.',
        '* **V1-38**: as bases desta passagem são as cabeças de entrada já fundidas. A procura junta o diff completo desde essas cabeças à lista integral da V1-c, preservada com a sua soma de controlo. Assim cobre todo o bloco sem atribuir à vigilância os ficheiros de outras passagens trazidos pelas fusões.', '',
        'Custo: linha `tokens used` não observada. Não se estima o total nem se afirma cumprimento do alvo de custo.', '']
    p = PASTA / 'LEIA-ME.md'
    antigo = p.read_text()
    if '\n## A passagem V1-d\n' in antigo:
        antes, resto = antigo.split('\n## A passagem V1-d\n', 1)
        antigo = antes + '\n## A passagem V1-c\n' + resto.split('\n## A passagem V1-c\n', 1)[1]
    antes, depois = antigo.split('\n## A passagem V1-c\n', 1)
    p.write_text(antes.rstrip() + '\n\n' + '\n'.join(linhas) + '\n## A passagem V1-c\n' + depois)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--motor', required=True, type=Path)
    p.add_argument('--provas', action='store_true')
    p.add_argument('--portao', action='store_true')
    p.add_argument('--fecho', action='store_true')
    a = p.parse_args()
    motor = a.motor.resolve()
    sys.path.insert(0, str(motor))
    from vigilancia import diario, verificar, medir
    from vigilancia.transporte import sha, descodificar, MAX_EXPANDIDO
    raiz = motor / 'vigilancia'
    reg = json.loads((raiz / 'fontes.json').read_text())
    codigo = git(motor, 'log', '-1', '--format=%H', '--', 'vigilancia/*.py', 'vigilancia/tests', 'vigilancia/fontes.json', 'vigilancia/README.md', 'core/gate.py')
    codigo_sitio = git(SITIO, 'log', '-1', '--format=%H', '--', str(PASTA.relative_to(SITIO) / '*.py'))
    if a.provas:
        provas(motor, codigo)
    if a.portao:
        inicio = time.monotonic()
        cabeca = git(motor, 'rev-parse', 'HEAD')
        r = subprocess.run(['python3', '-u', '-m', 'core.gate'], cwd=motor,
            env={**os.environ, 'OEDP_SITE': str(SITIO)}, capture_output=True, text=True)
        pasta = PASTA / 'portoes-d'
        pasta.mkdir(exist_ok=True)
        (pasta / 'motor.log').write_text(limpar(r.stdout + r.stderr, motor))
        (pasta / 'motor.codigo').write_text(str(r.returncode) + '\n')
        guardar('portoes-d/motor.json', {'comando': 'OEDP_SITE=<sitio> python3 -m core.gate',
            'cabeca': cabeca, 'codigo': int((pasta / 'motor.codigo').read_text()),
            'segundos': round(time.monotonic() - inicio, 3),
            'codigo_sha256': {str(f.relative_to(raiz)): sha(f.read_bytes()) for f in sorted(raiz.rglob('*.py'))},
            'core_gate_sha256': sha((motor / 'core/gate.py').read_bytes())})
        assert r.returncode == 0
    corridas = [json.loads(f.read_text()) for f in sorted((raiz / 'corridas').glob('*.json'))]
    hashes = medir.registar_hashes(corridas, raiz, reg, PASTA / 'd/hashes-todas-corridas.json')
    finais_ids = {r['id'] for r in hashes if r['codigo_igual'] and r['registo_igual']}
    finais = [r for r in corridas if r['id'] in finais_ids]
    if len(finais) < 2:
        print('Corridas finais ainda por executar.')
        return
    anteriores = [{'id': r['id'], 'falhas': r['falhas'], 'medidas': r['medidas']} for r in finais[:-2]]
    guardar('tentativas-d.json', anteriores)
    finais = finais[-2:]
    resultados = []
    for r in finais:
        verificar.corrida(r, raiz)
        ps = pedidos(raiz, r)
        for pedido in ps:
            verificar.reutilizacao(pedido)
        saltos = [s for p in ps for s in p['saltos']]
        assert sum(s['bytes'] for s in saltos) == r['medidas']['bytes']
        assert len(saltos) == r['medidas']['pedidos']
        for origem in r['medidas']['bytes_por_fonte']:
            assert sum(p['bytes_recebidos'] for p in ps if p['origem'] == origem) == r['medidas']['bytes_por_fonte'][origem]
            assert sum(len(p['saltos']) for p in ps if p['origem'] == origem) == r['medidas']['pedidos_por_fonte'][origem]
        assert sum(p['bytes_recebidos'] for p in ps if p['orcamento'] == 'ficheiro_cumulativo') == r['medidas']['bytes_fora_teto_comum']['bytes']
        assert r['codigo_cabeca'] == codigo
        resultados.append({'id': r['id'], 'recibo': 'vigilancia/corridas/' + r['id'] + '.json',
            'registo_pedidos': 'vigilancia/pedidos/' + r['id'] + '.jsonl', **r['medidas'],
            'fontes': r['fontes'], 'limitacoes': r['limitacoes'], 'falhas_detalhe': r['falhas'],
            'fila': r['fila'], 'aceitacao_entrada_datada': r['aceitacao_entrada_datada'],
            'segunda_leitura': medir.segunda_leitura(r), 'reconferencias_adiadas': r['reconferencias_adiadas'], 'avisos_descompressao': r['avisos_descompressao']})
    guardar('corridas-d.json', resultados)
    integridade, resumos, cache = [], {}, {}
    for f in sorted((raiz / 'indice').glob('*.json')):
        i = json.loads(f.read_text())
        for e in i['entradas']:
            verificar.entrada(e, raiz, reg, cache)
        for r in i['corridas']:
            assert r == json.loads((raiz / 'corridas' / (r['id'] + '.json')).read_text())
        detalhes = diario.detalhes_resumo(i)
        texto = (raiz / 'resumo' / (i['dia'] + '.md')).read_text()
        assert texto == detalhes['texto']
        assert len(texto.encode()) < 2500
        verificar.resumo_descricao(diario.entradas_vigentes(i['entradas']), detalhes)
        resumos[i['dia']] = texto
        integridade.append({'dia': i['dia'], 'versoes': len(i['entradas']), 'bytes_resumo': len(texto.encode()),
                           **{k: v for k, v in detalhes.items() if k != 'texto'}})
    arquivos = list((raiz / 'arquivo/sha256').glob('*/*'))
    for f in arquivos:
        assert sha(f.read_bytes()) == f.parent.name + f.name
    verificar.fundamentos(reg, raiz)
    assert len({f.parent.name + f.name[:10] for f in arquivos}) == len(arquivos), 'prefixo de arquivo ambíguo no resumo'
    guardar('integridade-d.json', {'indices': integridade, 'corpos': len(arquivos), 'fundamentos': reg['fundamentos_arquivados']})
    bases_aritmetica = [r for r in corridas if r['id'] in finais_ids and not r['falhas']
        and all(f.get('lida') for f in r['fontes'].values())][-2:]
    if not bases_aritmetica:
        bases_aritmetica = [r for r in corridas if not r['falhas'] and all(f.get('lida') for f in r['fontes'].values())][-1:]
    assert bases_aritmetica, 'falta uma corrida lida para calcular o cenário, sem fingir que uma falha custa uma leitura completa'
    conta = aritmetica(raiz, bases_aritmetica, reg)
    protegidos = git(motor, 'diff', '--name-only', '3184e07', '--', 'indicators/*.json', 'indicators/vintages.json', '.maintenance-locks/', 'sweeps/', 'publisher/recortes/manifest.regioes.json')
    assert not protegidos
    plantas = json.loads((PASTA / 'plantas-d.json').read_text())
    portao = int((PASTA / 'portoes-d/motor.codigo').read_text())
    gate = json.loads((PASTA / 'portoes-d/motor.json').read_text())
    assert gate['codigo_sha256'] == finais[-1]['codigo_sha256']
    assert gate['core_gate_sha256'] == sha((motor / 'core/gate.py').read_bytes())
    assert plantas['codigo'] == codigo
    assert not git(motor, 'diff', 'HEAD', '--', 'vigilancia/*.py', 'vigilancia/tests', 'vigilancia/fontes.json', 'core/gate.py')
    aceites = {'duas_corridas_codigo_final': len(finais) == 2,
        'segunda_leu_tres_fontes': all(f.get('lida') for f in finais[-1]['fontes'].values()),
        'segunda_sem_novas_ou_revisoes': medir.segunda_leitura(finais[-1]),
        'falhas': [r['medidas']['falhas'] for r in finais],
        'entrada_datada_por_fonte': finais[-1]['aceitacao_entrada_datada'],
        'portao': portao, 'portao_cabeca_codigo': gate['cabeca'] == codigo,
        'plantas': all(x['passou'] for x in plantas['plantas']),
        'codigo_motor': codigo, 'codigo_sitio': codigo_sitio, 'tokens_used': None}
    aceites['aceitacao_corridas_cumprida'] = (aceites['segunda_leu_tres_fontes']
        and all(v is True for v in aceites['segunda_sem_novas_ou_revisoes'].values())
        and not any(aceites['falhas']))
    guardar('aceitacao-d.json', aceites)
    cabecas = {'motor': git(motor, 'rev-parse', 'HEAD'), 'motor_codigo': codigo,
        'sitio_antes_fecho': git(SITIO, 'rev-parse', 'HEAD'), 'sitio_codigo': codigo_sitio,
        'commits_motor': git(motor, 'log', '--reverse', '--format=%H %s', '3184e07..HEAD').splitlines(),
        'commits_sitio': git(SITIO, 'log', '--reverse', '--format=%H %s', 'c8303a60..HEAD').splitlines()}
    guardar('cabecas-d.json', cabecas)
    import copy
    cenario = copy.deepcopy(json.loads((raiz / 'indice/2026-10-12.json').read_text()))
    dar = [e for e in diario.entradas_vigentes(cenario['entradas']) if e['origem'] == 'dar']
    for e in cenario['entradas']:
        if e['origem'] == 'dar':
            e.update(estreia=True, revisao=None)
    primeira = copy.deepcopy(cenario['corridas'][-1])
    primeira['alteradas'] = [{'origem': 'dar', 'id': e['id']} for e in dar]
    primeira['medidas'].update(novas=len(dar), revisoes=0, iguais=0)
    cenario['corridas'] = [primeira]
    antes = diario.detalhes_resumo(cenario)
    segunda = copy.deepcopy(primeira)
    segunda['alteradas'] = []
    segunda['medidas'].update(novas=0, revisoes=0, iguais=len(dar))
    cenario['corridas'].append(segunda)
    depois = diario.detalhes_resumo(cenario)
    novidade = {'cenario': 'simulação identificada com declarações do arquivo; a prova de duas execuções está na suite',
        'declaracoes': len(dar), 'primeira_grupos': antes['grupos_dar'], 'segunda_grupos': depois['grupos_dar'],
        'primeira_contagens': antes['texto'].splitlines()[0], 'segunda_contagens': depois['texto'].splitlines()[0],
        'segunda_iguais': segunda['medidas']['iguais'], 'grupo_e_contagem_conservados': antes['grupos_dar'] == depois['grupos_dar'] and antes['texto'].splitlines()[0] == depois['texto'].splitlines()[0]}
    assert novidade['grupo_e_contagem_conservados'] and antes['grupos_dar']
    guardar('d/novidade-dar.json', novidade)
    escrever_relatorio(resultados, finais, anteriores, aceites, gate, plantas, conta, resumos, codigo, codigo_sitio)
    anteriores_fugas = json.loads((PASTA / 'preservacao-c.json').read_text())['ficheiros']
    fugas = medir.procurar_fugas([('motor', motor, BASE_MOTOR), ('sitio', SITIO, BASE_SITIO)], anteriores_fugas)
    fugas['inventario_anterior'] = {'ficheiro': 'preservacao-c.json', 'sha256': sha((PASTA / 'preservacao-c.json').read_bytes())}
    # Os corpos comprimidos também são conferidos, pela codificação do pedido.
    vistos = set()
    for f in (raiz / 'pedidos').glob('*.jsonl'):
        for linha in f.read_text().splitlines():
            p = json.loads(linha)
            if p.get('arquivo') and p['arquivo'] not in vistos:
                vistos.add(p['arquivo'])
                corpo = descodificar((raiz / p['arquivo']).read_bytes(), p.get('encoding'))
                proibidos = (str(Path.home()).encode(), Path.home().name.encode(), '/'.join(('Instruments', '')).encode(), '/'.join(('.claude', 'worktrees', '')).encode())
                assert not any(v in corpo for v in proibidos), p['arquivo']
    guardar('preservacao-d.json', {**fugas, 'protegidos': protegidos, 'corpos_descodificados': len(vistos)})
    guardar('d/fugas-positivo.json', fugas['ensaio_positivo'])
    assert not fugas['fugas'], fugas['fugas']
    assert fugas['positivo_conhecido']
    print(json.dumps(aceites, ensure_ascii=False))
    if a.fecho:
        return 0 if aceites['aceitacao_corridas_cumprida'] and portao == 0 and aceites['portao_cabeca_codigo'] and aceites['plantas'] else 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
