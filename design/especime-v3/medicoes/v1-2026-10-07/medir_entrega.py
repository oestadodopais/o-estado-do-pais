"""Refaz as medidas de aceitação a partir das provas e escreve o relatório."""
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


def limpar(texto, motor):
    for de, para in ((str(motor), '<motor>'), (str(SITIO), '<worktree>'),
                     (str(Path.home()), '<casa>'), (Path.home().name, '<utilizador>')):
        texto = texto.replace(de, para)
    return texto


def comando(args, motor, nome, cwd=None):
    r = subprocess.run(args, cwd=cwd or motor, capture_output=True, text=True)
    (PASTA / (nome + '.log')).write_text(limpar(r.stdout + r.stderr, motor))
    guardar(nome + '.json', {'comando': limpar(' '.join(args), motor), 'codigo': r.returncode})
    return r.returncode


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--motor', type=Path, required=True)
    p.add_argument('--provas', action='store_true', help='Também corre as plantas, os validadores e a leitura das decisões.')
    a = p.parse_args()
    motor = a.motor.resolve()
    sys.path.insert(0, str(motor))
    from vigilancia import diario, extrair, verificar
    from vigilancia.transporte import sha
    from vigilancia.tests.test_vigilancia import Provas, PLANTAS
    reg = json.loads(diario.REGISTO.read_text())
    raiz = motor / 'vigilancia'
    codigo = git(motor, 'log', '-1', '--format=%H', '--', 'vigilancia/*.py', 'vigilancia/tests', 'vigilancia/fontes.json', 'core/gate.py', '.github/workflows/corredor.yml', '.github/workflows/vigia.yml', 'indicators/provar_fluxo.py')
    if a.provas:
        plantas = []
        for nome, mensagem in PLANTAS.items():
            suite = unittest.TestSuite([Provas('test_planta_' + nome)])
            saida = io.StringIO()
            r = unittest.TextTestRunner(stream=saida, verbosity=2).run(suite)
            plantas.append({'planta': nome, 'mensagem_afirmada': mensagem,
                            'testes': r.testsRun, 'passou': r.wasSuccessful(), 'registo': limpar(saida.getvalue(), motor)})
        guardar('plantas.json', {'comando': 'python3 <medicoes>/medir_entrega.py --motor <motor> --provas', 'codigo_cabeca': codigo, 'plantas': plantas})
        comando(['python3', '-m', 'vigilancia.tests'], motor, 'autotestes')
        comando(['python3', '-m', 'vigilancia.fluxo'], motor, 'fluxo-v1')
        comando(['python3', 'indicators/provar_fluxo.py'], motor, 'fluxos-motor')
        comando(['python3', str(SITIO / 'scripts/leituras/decisoes-em-vigor.py'), '--repo', str(motor),
                 'core/http.py', '.github/workflows/corredor.yml', '.github/workflows/vigia.yml'], motor, 'decisoes-em-vigor', cwd=SITIO)
    corridas = []
    for f in sorted((raiz / 'corridas').glob('*.json')):
        r = json.loads(f.read_text())
        verificar.corrida(r)
        pedidos = [json.loads(l) for l in (raiz / 'pedidos' / (r['id'] + '.jsonl')).read_text().splitlines()]
        saltos = [s for x in pedidos for s in x['saltos']]
        assert len(saltos) == r['medidas']['pedidos']
        assert sum(s['bytes'] for s in saltos) == r['medidas']['bytes']
        m = r['medidas']
        corridas.append({'ficheiro': f.relative_to(motor).as_posix(), 'id': r['id'], 'codigo_cabeca': r['codigo_cabeca'],
                        **m, 'minutos': round(m['segundos'] / 60, 6), 'fila': len(r['fila']),
                        'fila_sem_duplicados': len(r['fila']) == len({diario.chave_tarefa(t) for t in r['fila']}), 'fontes': r['fontes'],
                        'razoes_falhas': r['falhas'], 'codigo_sha256': r.get('codigo_sha256'), 'registo_sha256': r.get('registo_sha256')})
    guardar('corridas.json', {'comando': 'python3 <medicoes>/medir_entrega.py --motor <motor>', 'corridas': corridas})
    entradas, hashes, dias, integridade = [], set(), [], []
    cache = {}
    for f in sorted((raiz / 'indice').glob('*.json')):
        i = json.loads(f.read_text())
        vistos = set()
        for e in i['entradas']:
            verificar.entrada(e, raiz, reg, cache)
            assert (e['id'], e['versao']) not in vistos, 'entrada duplicada no índice'
            vistos.add((e['id'], e['versao']))
            hashes.add(e['sha256'])
            entradas.append(e)
            integridade.append({'id': e['id'], 'versao': e['versao'], 'sha256': e['sha256'], 'arquivo': e['arquivo'], 'localizador': e['localizador'], 'conferida': True})
        resumo = raiz / 'resumo' / (i['dia'] + '.md')
        assert resumo.read_text() == diario.resumo(i)
        dias.append({'dia': i['dia'], 'indice': f.relative_to(motor).as_posix(), 'resumo': resumo.relative_to(motor).as_posix(),
                     'entradas': len(i['entradas']), 'bytes_resumo': len(resumo.read_bytes())})
    guardar('integridade.json', integridade)
    protegido = git(motor, 'status', '--short', '--', 'indicators/*.json', 'indicators/vintages.json', '.maintenance-locks/', 'sweeps/', 'publisher/recortes/manifest.regioes.json')
    assert not protegido
    antes = json.loads((PASTA / 'alteracoes-preexistentes.json').read_text())
    preservados = {nome: hashlib.sha256((SITIO / nome).read_bytes()).hexdigest() == digest for nome, digest in antes.items()}
    assert all(preservados.values())
    # Inspeciona apenas o que o bloco alterou, sem alegar limpar o trabalho alheio.
    novos_motor = git(motor, 'diff', '--name-only', '465d01e7853f2729fcaa4ba63160b6338ba5de1e').splitlines()
    candidatos = [motor / nome for nome in novos_motor] + list(raiz.rglob('*')) + list(PASTA.rglob('*'))
    fugas = []
    for f in candidatos:
        if not f.is_file() or '__pycache__' in f.parts or '.cache' in f.parts or f.name == '.lock':
            continue
        b = f.read_bytes()
        if any(s.encode() in b for s in (str(Path.home()), Path.home().name)):
            fugas.append(f.name)
    assert not fugas, 'caminho ou nome local em ficheiro do bloco'
    guardar('preservacao.json', {'comando': 'python3 <medicoes>/medir_entrega.py --motor <motor>', 'status_protegidos': protegido,
                                'preexistentes_preservados': preservados, 'fugas_de_caminhos': fugas})
    vigentes = diario.entradas_vigentes(entradas)
    por_fonte = {k: sum(e['origem'] == k for e in vigentes) for k in reg['entradas']}
    tipos = {f['tipo']: sum(e['tipo'] == f['tipo'] for e in vigentes) for f in reg['entradas'].values()}
    codigo_ficheiros = {str(p.relative_to(raiz)): sha(p.read_bytes()) for p in sorted(raiz.rglob('*.py'))}
    atuais = [r for r in corridas if r['codigo_sha256'] == codigo_ficheiros and r['registo_sha256'] == sha(json.dumps(reg, sort_keys=True, ensure_ascii=False).encode())]
    mesmo_codigo = bool(corridas) and all(r['codigo_sha256'] == codigo_ficheiros for r in corridas)
    guardar('hashes-todas-corridas.json', [{'id': r['id'], 'codigo_igual': r['codigo_sha256'] == codigo_ficheiros} for r in corridas])
    gate = PASTA / 'portoes/motor.codigo'
    gate_meta = json.loads((PASTA / 'portoes/motor.json').read_text()) if gate.exists() else {}
    plantas = json.loads((PASTA / 'plantas.json').read_text()) if (PASTA / 'plantas.json').exists() else {'plantas': []}
    medidas = {'comando': 'python3 <medicoes>/medir_entrega.py --motor <motor> --provas', 'motor_cabeca': git(motor, 'rev-parse', 'HEAD'),
               'motor_codigo': codigo, 'sitio_codigo': git(SITIO, 'log', '-1', '--format=%H', '--', str(PASTA.relative_to(SITIO) / 'medir_entrega.py')),
               'entradas_por_fonte': por_fonte, 'entradas_por_tipo': tipos, 'versoes_preservadas': len(entradas), 'corpos_das_entradas': len(hashes), 'dias': dias,
               'plantas_passaram': sum(p['passou'] for p in plantas['plantas']), 'plantas_total': len(plantas['plantas']),
               'codigo_portao': int(gate.read_text()) if gate.exists() else None, 'portao_cabeca': gate_meta.get('cabeca'),
               'duas_corridas_com_codigo_final': len(atuais) >= 2, 'mesmo_codigo_das_corridas': mesmo_codigo,
               'segunda_sem_duplicados': (atuais[-1]['novas'] == 0 and atuais[-1]['revisoes'] == 0) if len(atuais) >= 2 and all(f.get('lida') for f in atuais[-1]['fontes'].values()) else 'não medido',
               'fila_final_sem_duplicados': bool(atuais) and all(r['fila_sem_duplicados'] for r in atuais),
               'entrada_de_cada_fonte': all(por_fonte.values()), 'tokens_used': None, 'custo_verificavel': False}
    guardar('aceitacao.json', medidas)
    commits_motor = git(motor, 'log', '--reverse', '--format=%H %s', '465d01e7853f2729fcaa4ba63160b6338ba5de1e..HEAD')
    commits_sitio = git(SITIO, 'log', '--reverse', '--format=%H %s', 'e6d1a30729d07ba7f22e8cae05bde01af6da3bff..HEAD')
    guardar('cabecas.json', {'motor': medidas['motor_cabeca'], 'motor_codigo': codigo,
                           'sitio_antes_do_relatorio': git(SITIO, 'rev-parse', 'HEAD'), 'sitio_codigo': medidas['sitio_codigo'],
                           'commits_motor': commits_motor.splitlines(), 'commits_sitio_anteriores_ao_relatorio': commits_sitio.splitlines()})
    inicial = json.loads((PASTA / 'inicial.json').read_text())
    portao_inicial = json.loads((PASTA / 'portoes/inicial.json').read_text())
    questoes = [
        'A data da retoma substitui as datas de corrida do brief, por instrução do diretor. A primeira carga das iniciativas continua limitada à data inicial efetiva; não se recua a janela para fabricar uma entrada de aceitação.',
        'O ficheiro cumulativo das iniciativas cabe comprimido perto do teto, mas não cabe descomprimido. O orçamento conta bytes de corpo transferido, antes da descompressão. Os recibos separam essa conta dos bytes descomprimidos; o arquivo conserva a representação recebida.',
        'O DAR corrente tem um catálogo que não demonstra cobertura histórica nem mudanças de sessão. O pacote recolhe intervenções nominais reconhecidas no PDF e declara as exclusões. O catálogo dos dados abertos é preservado como prova auxiliar; a descoberta corrente vem da página da I Série.',
        'O RSS do Diário da República junta emissor e sumário sem fronteira identificável. O campo de autoria fica vazio, com cobertura parcial, em vez de se adivinhar um nome. As páginas dos atos observadas exigem JavaScript; os metadados continuam citáveis a partir do RSS alojado.',
        'Os robots da Assembleia responderam como ausentes; os do Diário da República devolveram HTML sem diretivas. O cliente regista a anomalia e aplica as regras reconhecíveis. Erros de rede e de servidor fecham o anfitrião. Os termos parlamentares são conferidos na passagem registada.',
        'Não se encontrou um contador de tokens de texto aplicável no projeto. O resumo usa bytes UTF-8 como limite superior conservador para BPE de bytes; não se apresenta essa barreira como contagem pelo tokenizador de um modelo.',
        'O estado e a fila vivem exclusivamente na vigilância. O trabalho futuro do GitHub guarda-os no arquivo privado depois das retomas, sob o seu interruptor próprio; não depende de o corredor estar armado e não reconstrói o sítio. A exceção do validador anterior está limitada ao passo e pasta da vigilância.',
        'As cópias brutas das sondas iniciais estavam em armazenamento temporário da sessão interrompida e já não estavam disponíveis na retoma. Conservam-se as medições e a conferência visual anteriores; as corridas desta entrega voltaram a alojar provas atuais. A reprodução da sonda antiga exige os seus corpos originais.',
        'Os registos de iniciativas sem data ficam como falha explícita e pendência. A leitura extrai os registos datados que pertencem à janela sem transformar o restante ficheiro em ausência de novidades.',
        'O Parlamento devolveu ligações cifradas diferentes para os mesmos bytes do PDF. O diagnóstico inicial registou revisões apenas da ligação, preservadas para auditoria. O código final exclui a ligação rotativa da identidade do conteúdo e conta entradas vigentes por identificador, separando as versões históricas. Não se reescreveram os recibos de diagnóstico.',
        'A fila identifica cada tarefa pela fonte, ação e documento. Mudanças de data do recibo não criam tarefas novas; as fontes adiadas pelo teto ganham prioridade sobre falhas persistentes. Esta correção foi exercida em corridas reais e num teste que altera a data da prova entre execuções.',
        'As primeiras corridas locais serviram também para descobrir limites reais dos leitores. Estão todas conservadas com hashes do código; as medidas distinguem as corridas de diagnóstico das corridas com hashes iguais aos ficheiros do código final. A cabeça Git registada durante uma corrida pode preceder o commit que fixou esses mesmos ficheiros; a igualdade é conferida por conteúdo, não inferida do nome do ramo.',
        'Sem identificadores próprios de intervenção no PDF, a identidade da declaração combina o número do diário, a página e a posição do excerto. Uma mudança de paginação pode aparecer como entrada nova; a comparação por conteúdo conserva as versões e o PDF anterior, mas não prova uma correspondência editorial entre intervenções deslocadas.',
        'A linha tokens used não foi exposta pelas ferramentas desta sessão. O custo acumulado, incluindo a sessão interrompida, não é verificável; não se declara que ficou dentro nem que ultrapassou o alvo do bloco.'
    ]
    linhas = ['# Entrega do primeiro varrimento de vigilância', '',
              'Relatório gerado por `python3 <medicoes>/medir_entrega.py --motor <motor> --provas`. As medidas abaixo são lidas dos ficheiros referidos; não são contagens introduzidas à mão.', '',
              ('**Há uma entrada conferida de cada fonte.**' if all(por_fonte.values()) else '**A aceitação de uma entrada de cada fonte não está cumprida.** Não se fabricou uma iniciativa de hoje.') + ' O índice e os recibos declaram a cobertura e as falhas. A leitura a frio do Opus e a conferência da direção continuam por fazer.', '',
              '## Antes da construção', '',
              f"Cabeça inicial do motor: `{inicial['cabeca_motor']}`. Portão inicial: `{portao_inicial['codigo']}`, em {portao_inicial['segundos']} segundos, lido de `portoes/inicial.json` e `portoes/inicial.codigo`.", '',
              'O cliente e o arquivo reutilizados estão identificados em `inicial.json`. As decisões em vigor sobre os ficheiros indicados estão em `decisoes-em-vigor.log`, com comando e código em `decisoes-em-vigor.json`. A conferência do PDF inicial está em `pdf-conferencia.json`.', '',
              '## Corridas reais e segunda leitura', '',
              '| Recibo no motor | Cabeça declarada | Pedidos | Bytes | Minutos | Novas | Revisões | Iguais | Falhas | Fila |',
              '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for r in corridas:
        linhas.append(f"| `{r['ficheiro']}` | `{r['codigo_cabeca']}` | {r['pedidos']} | {r['bytes']} | {r['minutos']} | {r['novas']} | {r['revisoes']} | {r['iguais']} | {r['falhas']} | {r['fila']} |")
    linhas += ['', 'Os pedidos e bytes foram recalculados a partir dos saltos de `vigilancia/pedidos/`, e conferidos contra os recibos. As contagens por fonte e tipo, as razões de falha e o estado de cada fonte em cada corrida estão em `corridas.json`.', '',
               f"Duas corridas com os ficheiros do código final: **{medidas['duas_corridas_com_codigo_final']}**. Hashes do código coincidentes: **{mesmo_codigo}**. Segunda sem novas entradas ou revisões: **{medidas['segunda_sem_duplicados']}**.", '',
               '## Índice, resumo e provas', '',
               f"Entradas vigentes por fonte: `{json.dumps(por_fonte, ensure_ascii=False)}`. Por tipo: `{json.dumps(tipos, ensure_ascii=False)}`. Corpos distintos das entradas: {len(hashes)}. Todos os excertos, autores, datas, localizadores e hashes foram relidos em `integridade.json`.", '']
    for d in dias:
        linhas.append(f"* `{d['indice']}`: {d['entradas']} versões preservadas; `{d['resumo']}`: {d['bytes_resumo']} bytes UTF-8, pelo método declarado no recibo.")
    linhas += ['', '## Plantas, portão e fluxo', '', f"Plantas aprovadas: {medidas['plantas_passaram']} de {medidas['plantas_total']}, em `plantas.json`. A suite completa está em `autotestes.log`, com o código em `autotestes.json`.", '']
    for pl in plantas['plantas']:
        linhas.append(f"* {pl['planta']}: `{pl['mensagem_afirmada']}`; passou: {pl['passou']}.")
    linhas += ['', f"Portão do motor: `{medidas['codigo_portao']}`, lido de `portoes/motor.codigo`; cabeça conferida: `{medidas['portao_cabeca']}`. O comando, duração e registo estão em `portoes/motor.json` e `portoes/motor.log`.", '',
               'O validador anterior do motor e o validador V1 correram em seco: `fluxos-motor.log` e `fluxo-v1.log`, com códigos nos JSON homónimos. Nenhuma variável foi armada, nenhum fluxo remoto foi corrido e nenhum ramo foi empurrado. A validação local não prova uma corrida no GitHub.', '',
               f"O estado dos caminhos protegidos está vazio em `preservacao.json`. As alterações preexistentes preservadas são {len(preservados)}, conferidas pelos hashes de `alteracoes-preexistentes.json`. Fugas de caminhos ou nome local nos ficheiros do bloco: {len(fugas)}.", '',
               '## Código, limites e trabalho pendente', '',
               f"Cabeça do código do motor: `{codigo}`. Cabeça do motor na medição: `{medidas['motor_cabeca']}`. As cabeças e commits anteriores ao fecho do relatório estão em `cabecas.json`; o commit final do relatório é deliberadamente posterior a esse recibo.", '',
               'O `vigilancia/README.md` documenta a utilização, saídas, tetos, direitos e exclusões. A aceitação por fonte depende de uma iniciativa efetivamente publicada na janela; continuam pendentes os registos sem data, a leitura integral dos atos que exigem JavaScript e a cobertura fora das janelas suportadas. Não se alargou o âmbito para contornar estas faltas.', '',
               '## Questões resolvidas e diferenças medidas', '']
    for n, q in enumerate(questoes, 1):
        linhas.append(f'* **V1-{n}**: {q}')
    linhas += ['', '## Proposta para o registo das melhorias', '',
               'Vigilância diária das fontes parlamentares e do Diário da República: corpos selados antes da extração, índice e resumo determinísticos, revisões e fila persistente, limites de rede e tempo, plantas inscritas no portão e automação dormente com vigia. A direção regista depois da leitura a frio. A entrega não fecha a aceitação de todas as fontes enquanto faltarem entradas verificáveis na janela.', '',
               '## Custo', '', 'A linha `tokens used` não foi observada. `aceitacao.json` regista custo não verificável; não é possível aferir o desvio ao alvo de símbolos do bloco.', '']
    (PASTA / 'LEIA-ME.md').write_text('\n'.join(linhas))
    print(json.dumps(medidas, ensure_ascii=False))


if __name__ == '__main__':
    main()
