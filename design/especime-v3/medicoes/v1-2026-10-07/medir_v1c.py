"""Mede V1-c pelos recibos, pedidos, arquivo e plantas, sem números editoriais à mão."""
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
BASE_MOTOR = '465d01e7853f2729fcaa4ba63160b6338ba5de1e'
BASE_SITIO = '01ccb1e53c5b2d932b5388bb89215b209d40d418'


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
    guardar('plantas-c.json', {'codigo': codigo, 'plantas': resultados})
    assert all(r['passou'] for r in resultados)
    for nome, comando in (('autotestes-c', ['python3', '-m', 'vigilancia.tests']),
                           ('fluxo-c', ['python3', '-m', 'vigilancia.fluxo']),
                           ('fluxos-motor-c', ['python3', 'indicators/provar_fluxo.py'])):
        r = subprocess.run(comando, cwd=motor, capture_output=True, text=True)
        (PASTA / (nome + '.log')).write_text(limpar(r.stdout + r.stderr, motor))
        guardar(nome + '.json', {'codigo': r.returncode, 'cabeca': codigo})
        assert r.returncode == 0


def aritmetica(raiz, finais, reg):
    # O corpo é identificado pelo arquivo da iniciativa, não por um tamanho presumido.
    atual_cumulativo = next(p for p in pedidos(raiz, finais[-1]) if p.get('orcamento') == 'ficheiro_cumulativo')
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
        cenarios.append({'base': r['id'], 'bytes_por_fonte': bytes_fontes, 'pedidos_por_fonte': pedidos_fontes,
            'bytes_totais': sum(bytes_fontes.values()), 'bytes_comuns': comuns,
            'bytes_cumulativo': len(bruto), 'pedidos': sum(pedidos_fontes.values()),
            'tetos': reg['limites'], 'cabe_comum': comuns <= reg['limites']['bytes'],
            'cabe_cumulativo': len(bruto) <= reg['limites']['bytes_ficheiro_cumulativo'],
            'cabem_pedidos': sum(pedidos_fontes.values()) <= reg['limites']['pedidos'],
            'segundos': 'não extrapolados: uma transferência diferente exige medição real'})
    resultado = {'transferencia_observada': {'pedido': ficheiro, 'linha': linha, 'arquivo': corpo,
        'bytes': len(bruto), 'saltos': len(transferencia['saltos'])},
        'hipotese': 'Mesmo tamanho comprimido e cadeia GET da última transferência integral observada; restantes pedidos como nas corridas finais. Não é uma corrida observada com mudança.',
        'cenarios': cenarios}
    guardar('aritmetica-c.json', resultado)
    return resultado


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
    codigo = git(motor, 'log', '-1', '--format=%H', '--', 'vigilancia/*.py', 'vigilancia/tests', 'vigilancia/fontes.json', 'vigilancia/README.md')
    codigo_sitio = git(SITIO, 'log', '-1', '--format=%H', '--', str(PASTA.relative_to(SITIO) / '*.py'))
    if a.provas:
        provas(motor, codigo)
    if a.portao:
        inicio = time.monotonic()
        cabeca = git(motor, 'rev-parse', 'HEAD')
        r = subprocess.run(['python3', '-u', '-m', 'core.gate'], cwd=motor,
            env={**os.environ, 'OEDP_SITE': str(SITIO)}, capture_output=True, text=True)
        pasta = PASTA / 'portoes-c'
        pasta.mkdir(exist_ok=True)
        (pasta / 'motor.log').write_text(limpar(r.stdout + r.stderr, motor))
        (pasta / 'motor.codigo').write_text(str(r.returncode) + '\n')
        guardar('portoes-c/motor.json', {'comando': 'OEDP_SITE=<sitio> python3 -m core.gate',
            'cabeca': cabeca, 'codigo': int((pasta / 'motor.codigo').read_text()),
            'segundos': round(time.monotonic() - inicio, 3),
            'codigo_sha256': {str(f.relative_to(raiz)): sha(f.read_bytes()) for f in sorted(raiz.rglob('*.py'))}})
        assert r.returncode == 0
    corridas = [json.loads(f.read_text()) for f in sorted((raiz / 'corridas').glob('*.json'))]
    hashes = medir.registar_hashes(corridas, raiz, reg, PASTA / 'hashes-todas-corridas.json')
    finais_ids = {r['id'] for r in hashes if r['codigo_igual'] and r['registo_igual']}
    finais = [r for r in corridas if r['id'] in finais_ids]
    if len(finais) < 2:
        print('Corridas finais ainda por executar.')
        return
    anteriores = [{'id': r['id'], 'falhas': r['falhas'], 'medidas': r['medidas']} for r in finais[:-2]]
    guardar('tentativas-c.json', anteriores)
    finais = finais[-2:]
    resultados = []
    for r in finais:
        verificar.corrida(r, raiz)
        ps = pedidos(raiz, r)
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
    guardar('corridas-c.json', resultados)
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
    guardar('integridade-c.json', {'indices': integridade, 'corpos': len(arquivos), 'fundamentos': reg['fundamentos_arquivados']})
    conta = aritmetica(raiz, finais, reg)
    base_preservacao = json.loads((PASTA / 'confirmacao-c.json').read_text())['sitio_verificado']
    preservacao_hashes = {n: {'entrada': sha(subprocess.check_output(['git', 'show', base_preservacao + ':' + n], cwd=SITIO)),
        'atual': sha((SITIO / n).read_bytes())} for n in json.loads((PASTA / 'alteracoes-preexistentes.json').read_text())}
    preservados = {n: h['entrada'] == h['atual'] for n, h in preservacao_hashes.items()}
    assert all(preservados.values())
    protegidos = git(motor, 'diff', '--name-only', BASE_MOTOR, '--', 'indicators/*.json', 'indicators/vintages.json', '.maintenance-locks/', 'sweeps/', 'publisher/recortes/manifest.regioes.json')
    assert not protegidos
    plantas = json.loads((PASTA / 'plantas-c.json').read_text())
    portao = int((PASTA / 'portoes-c/motor.codigo').read_text())
    gate = json.loads((PASTA / 'portoes-c/motor.json').read_text())
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
    if a.fecho:
        assert aceites['segunda_leu_tres_fontes'] and all(v is True for v in aceites['segunda_sem_novas_ou_revisoes'].values())
        assert portao == 0 and aceites['portao_cabeca_codigo'] and aceites['plantas']
        assert not any(aceites['falhas'])
    guardar('aceitacao-c.json', aceites)
    cabecas = {'motor': git(motor, 'rev-parse', 'HEAD'), 'motor_codigo': codigo,
        'sitio_antes_fecho': git(SITIO, 'rev-parse', 'HEAD'), 'sitio_codigo': codigo_sitio,
        'commits_motor': git(motor, 'log', '--reverse', '--format=%H %s', 'e3608ab..HEAD').splitlines(),
        'commits_sitio': git(SITIO, 'log', '--reverse', '--format=%H %s', '7cb8760d..HEAD').splitlines()}
    guardar('cabecas-c.json', cabecas)
    linhas = ['## A passagem V1-c', '',
        'Medida por `python3 <medicoes>/medir_v1c.py --motor <motor> --provas --portao`. As decisões V1-9, V1-16 e V1-17 ficam substituídas pelas regras desta passagem: limitações separadas das falhas, orçamento próprio do cumulativo, DAR e DR primeiro e reconferência semanal declarada.', '',
        ('Aceitação das corridas: **cumprida**. A conferência `--fecho` passa.' if aceites['aceitacao_corridas_cumprida'] else 'Aceitação das corridas: **por cumprir**. A conferência `--fecho` não passa; falhas reais de recolha impedem afirmar a leitura das três fontes. O par abaixo é o último par executado, conservado com os seus resultados, não um par aceite.'), '',
        '### Corridas finais', '',
        '| Corrida | Pedidos | Bytes comuns | Bytes cumulativo | Segundos | Novas | Revisões | Iguais | Falhas |',
        '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for r in resultados:
        linhas.append(f"| `{r['id']}` | {r['pedidos']} | {r['bytes_comuns']} | {r['bytes_fora_teto_comum']['bytes']} | {r['segundos']} | {r['novas']} | {r['revisoes']} | {r['iguais']} | {r['falhas']} |")
    for r in resultados:
        linhas += ['', f"Recibo: `<motor>/vigilancia/corridas/{r['id']}.json`; pedidos: `<motor>/vigilancia/pedidos/{r['id']}.jsonl`.",
            f"Bytes por fonte: `{json.dumps(r['bytes_por_fonte'], ensure_ascii=False)}`. Pedidos por fonte: `{json.dumps(r['pedidos_por_fonte'], ensure_ascii=False)}`.",
            f"Reconferências adiadas por cadência, por fonte: `{json.dumps(dict(Counter(x['origem'] for x in r['reconferencias_adiadas'])))}`. Os índices foram consultados; os documentos adiados não foram reconfirmados remotamente nesta corrida.",
            f"Estados: `{json.dumps({k: v['estado'] for k, v in r['fontes'].items()}, ensure_ascii=False)}`. Fontes lidas: `{json.dumps({k: v.get('lida', False) for k, v in r['fontes'].items()})}`.",
            f"Limitações por código: `{json.dumps(dict(Counter(l['codigo'] for l in r['limitacoes'])), ensure_ascii=False)}`. Falhas: `{json.dumps(r['falhas_detalhe'], ensure_ascii=False)}`. Fila: `{json.dumps(r['fila'], ensure_ascii=False)}`."]
    for tentativa in anteriores:
        linhas += ['', f"Tentativa anterior conservada: `{tentativa['id']}`; falhas `{json.dumps(tentativa['falhas'], ensure_ascii=False)}`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`."]
    sem_data = [l for l in finais[-1]['limitacoes'] if l['codigo'] == 'sem_data']
    linhas += ['', f"Registos sem data: `{json.dumps([{k: l[k] for k in ('contagem', 'identificadores')} for l in sem_data], ensure_ascii=False)}`. As provas e razões completas estão nos recibos. O heartbeat separa limitações e falhas.",
        f"Aceitação de entrada datada na janela: `{json.dumps(aceites['entrada_datada_por_fonte'], ensure_ascii=False)}`. A falta de entrada não é alarme.", '',
        '### A aritmética do achado 7', '', conta['hipotese'], '',
        f"Transferência observada: `{conta['transferencia_observada']['pedido']}`, linha {conta['transferencia_observada']['linha']}, {conta['transferencia_observada']['bytes']} bytes, {conta['transferencia_observada']['saltos']} salto(s). Arquivo: `{conta['transferencia_observada']['arquivo']}`.", '',
        '| Base | Bytes comuns / teto | Cumulativo / teto próprio | Total transferido | Pedidos / teto | Cabe |',
        '| --- | ---: | ---: | ---: | ---: | --- |']
    for c in conta['cenarios']:
        linhas.append(f"| `{c['base']}` | {c['bytes_comuns']} / {c['tetos']['bytes']} | {c['bytes_cumulativo']} / {c['tetos']['bytes_ficheiro_cumulativo']} | {c['bytes_totais']} | {c['pedidos']} / {c['tetos']['pedidos']} | {c['cabe_comum'] and c['cabe_cumulativo'] and c['cabem_pedidos']} |")
    for c in conta['cenarios']:
        linhas += ['', f"Base `{c['base']}`: bytes por fonte `{json.dumps(c['bytes_por_fonte'])}`; pedidos por fonte `{json.dumps(c['pedidos_por_fonte'])}`.", '']
    linhas += ['A duração de uma transferência alterada não foi extrapolada. Os tetos de pedidos e tempo continuam comuns; qualquer excesso real fica em fila como falha. A margem de bytes é uma conta com o corpo observado, não uma previsão do crescimento.', '',
        '### O resumo de 12.10 refeito, inteiro', '', '```text', resumos['2026-10-12'].rstrip(), '```', '',
        'A descrição é literal, cortada em fronteira de palavra. Permite identificar o que faz pelo menos um ato listado e redigir a sua apresentação factual; não prova efeitos ou execução da medida. O DAR antigo não volta como novidade. O limite conserva as razões de cobertura e todos os cabeçalhos dos números selecionados, declarando separadamente as omissões.', '',
        'O resumo de 11.10 identifica a recontagem e a corrida original. Falhas e fila vêm desse recibo, revisões vêm da recontagem; não se reescrevem os recibos antigos.', '',
        '### Plantas e portão', '',
        f"Plantas e controlos: {sum(x['passou'] for x in plantas['plantas'])} de {len(plantas['plantas'])}; provas em `plantas-c.json`."]
    linhas += [f"* `{x['planta']}`: «{x['mensagem']}»; passou: {x['passou']}." for x in plantas['plantas']]
    linhas += ['', f"Portão do motor: `{portao}`, lido de `portoes-c/motor.codigo`, na cabeça `{gate['cabeca']}`. Os hashes do código estão em `portoes-c/motor.json`. Autotestes e validadores dos fluxos: `autotestes-c.json`, `fluxo-c.json`, `fluxos-motor-c.json`.", '',
        f"Código do motor: `{codigo}`. Código dos guiões do sítio: `{codigo_sitio}`. Cabeças medidas e commits em `cabecas-c.json`; o commit do relatório é posterior a essa medição. Todas as corridas, sem filtragem prévia, constam de `hashes-todas-corridas.json`.", '',
        f"Preservação: {sum(preservados.values())} de {len(preservados)} ficheiros preexistentes, comparados com a cabeça de entrada `{base_preservacao}`; o registo histórico `alteracoes-preexistentes.json` não foi reescrito. Caminhos protegidos sem alterações. A procura de fugas usa as listas completas do diff desde as bases dos dois repositórios, mais os ficheiros por registar; listas e resultado em `preservacao-c.json`. As confirmações das cinco plantas da leitura estão em `confirmacao-c.json`.", '',
        '### Questões e escolhas desta passagem', '',
        '* **V1-23**: o dia semanal escolhido é o declarado no registo, segunda-feira. Uma fonte indisponível nesse dia fica pendente para retoma; PDFs recentes continuam diários.',
        '* **V1-24**: a marca da transferência cumulativa é escrita antes de ler o corpo. Uma interrupção ou excesso consome a tentativa diária, para não repetir a descarga. A fila conserva a razão até ao dia seguinte.',
        '* **V1-25**: a comparação por tamanho sem validadores continua a poder perder uma alteração remota do mesmo tamanho, limite autorizado no mandato anterior. A conta de um dia com mudança usa o último corpo comprimido observado e identifica essa hipótese.',
        '* **V1-26**: a janela de aceitação usa data de publicação e o início efetivo da vigilância. Uma entrada recolhida agora mas publicada antes da janela não a cumpre.',
        '* **V1-27**: o limite conservador de bytes do resumo pode cortar atos e oradores, com aviso. Se até os cabeçalhos e razões obrigatórios excederem o limite, o guião recusa a escrita em vez de os omitir silenciosamente.',
        f'* **V1-28**: a descompressão permite {MAX_EXPANDIDO} bytes; avisos acima de oitenta por cento são medidos por corpo e copiados para o recibo.', '',
        '* **V1-29**: a cadência semanal reduz os pedidos ordinários, mas não prova que todos os PDFs antigos caibam para sempre num único dia semanal. O teto comum continua a valer e o excesso conserva a sua tarefa em fila; a aritmética mede a configuração observada.', '',
        '* **V1-30**: uma mudança observada por HEAD prevalece sobre a coincidência posterior do tamanho comprimido. A planta usa dois corpos de tamanhos expandidos diferentes com gzip do mesmo tamanho; o segundo corpo tem de ser transferido.', '',
        '* **V1-31**: o inventário persistente dos números arquivados conserva as reconferências quando esses números saem da página corrente. A prova atravessa uma janela sem índices recentes e substitui o número do catálogo por um segundo número sintético.', '',
        'Custo: linha `tokens used` não observada. Não se estima o total nem se afirma cumprimento do alvo de custo.', '']
    relatorio = PASTA / 'LEIA-ME.md'
    antigo = relatorio.read_text()
    if '\n## A passagem V1-c\n' in antigo:
        antes, resto = antigo.split('\n## A passagem V1-c\n', 1)
        antigo = antes + '\n## A passagem V1-b\n' + resto.split('\n## A passagem V1-b\n', 1)[1]
    antigo = antigo.replace('Duas corridas com os ficheiros do código final: **True**. Hashes do código coincidentes: **True**. Segunda sem novas entradas ou revisões: **True**.', 'As conclusões iniciais sobre igualdade do código e segunda leitura foram substituídas: a comparação integral da passagem V1-b está em `hashes-b.json`, e a da V1-c em `hashes-todas-corridas.json`.')
    antes, depois = antigo.split('\n## A passagem V1-b\n', 1)
    relatorio.write_text(antes.rstrip() + '\n\n' + '\n'.join(linhas) + '\n## A passagem V1-b\n' + depois)
    fugas = medir.procurar_fugas([('motor', motor, BASE_MOTOR), ('sitio', SITIO, BASE_SITIO)])
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
    guardar('preservacao-c.json', {**fugas, 'preexistentes': preservados, 'base_preservacao': base_preservacao, 'hashes_preservacao': preservacao_hashes, 'protegidos': protegidos, 'corpos_descodificados': len(vistos)})
    assert not fugas['fugas'], fugas['fugas']
    assert fugas['positivo_conhecido']
    print(json.dumps(aceites, ensure_ascii=False))


if __name__ == '__main__':
    main()
