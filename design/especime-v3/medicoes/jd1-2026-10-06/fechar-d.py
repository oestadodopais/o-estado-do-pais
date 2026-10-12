"""JD1-d: lê provas, fontes seladas, frases e códigos; escreve o fecho sem números à mão.

RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/fechar-d.py
"""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess

AQUI = Path(__file__).resolve().parent
SITE = AQUI.parents[3]
MOTOR = Path(os.environ['RESEARCHHUB_DIR'])
BASE_SITE = 'bb4e7d48'
BASE_MOTOR = '67b97e4'


def git(repo, *args):
    return subprocess.check_output(['git', *args], cwd=repo, text=True).strip()


def read(name):
    return json.loads((AQUI / name).read_text())


def write(name, obj):
    (AQUI / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    portoes = AQUI / 'portoes-d'
    nomes = ['build', 'verify', 'typecheck', 'motor']
    codes = {n: int((portoes / (n + '.codigo')).read_text()) for n in nomes}
    assert all(v == 0 for v in codes.values()), codes
    heads = {r: (portoes / f).read_text().strip() for r, f in [('sitio', 'cabeca'), ('motor', 'motor.cabeca')]}
    assert (portoes / 'arvore.inicio').read_text().strip() == 'limpa'
    for repo, path, f in [('sitio', SITE, 'cabeca'), ('motor', MOTOR, 'motor.cabeca')]:
        assert heads[repo] == (portoes / (f + '.fim')).read_text().strip() == git(path, 'rev-parse', 'HEAD')
    tentativa = portoes / 'tentativa-1'
    interrompida = {f.stem: int(f.read_text()) for f in tentativa.glob('*.codigo')}
    assert interrompida and 'verify' not in interrompida
    horas = {n: {k: (portoes / (n + '.' + k)).read_text().strip() for k in ['inicio', 'fim']} for n in nomes}
    caps = read('capturas-d.json')
    assert not caps['problemas'] and caps['cabeca_codigo'] == heads['sitio']
    assert len(caps['capturas']) == len(caps['linhas']) * len(caps['larguras']) * 2
    for c in caps['capturas']:
        assert sha((SITE / c['ficheiro']).read_bytes()) == c['sha256']
    frases = []
    for id in caps['linhas']:
        for lang in ['pt', 'en']:
            medidas = [c['medidas'] for c in caps['capturas'] if c['lingua'] == lang and c['url'].endswith('/' + id + '/')]
            assert len(medidas) == len(caps['larguras'])
            campos = ['frase', 'parcela', 'evolucao', 'excerto', 'cabecalho']
            assert all(all(m[k] == medidas[0][k] for k in campos) for m in medidas)
            frases.append(dict(id=id, lang=lang, **{k: medidas[0][k] for k in campos}))
    write('frases-d.json', frases)

    # Os estragos estavam nas cópias, não na cabeça recebida. Confere a base e o resultado.
    row_path = 'ledger/claims/amortizacoes-e-anulacoes-de-divida-fundada-2025.yml'
    base_row = subprocess.check_output(['git', 'show', BASE_SITE + ':' + row_path], cwd=SITE)
    base_cross = json.loads(git(SITE, 'show', BASE_SITE + ':ledger/cruzamentos/jd1.json'))
    row_id = Path(row_path).stem
    assert sha(base_row) == base_cross['rows'][row_id]['exported_row_sha256']
    assert 'value: "56\u202f976"' in base_row.decode()
    cross = json.loads((SITE / 'ledger/cruzamentos/jd1.json').read_text())
    assert sha((SITE / row_path).read_bytes()) == cross['rows'][row_id]['exported_row_sha256']
    assert 'provisório' in next(f['frase'] for f in frases if f['id'] == 'juros-das-administracoes-publicas-2025' and f['lang'] == 'pt')
    html = (SITE / 'dist/en/ledger/necessidades-brutas-de-financiamento-2025/index.html').read_text()
    assert 'to repay or extinguish debt' in html
    code = git(MOTOR, 'show', BASE_MOTOR + ':publisher/jd1.py')
    assert 'r"\\s+Issues\\s+Redempt\\.\\s+Others\\s+(?P<date>" + date + ")"' in code
    assert code == (MOTOR / 'publisher/jd1.py').read_text().replace('    # JD1-d: o recibo da parcela conserva o mesmo bloco contínuo, com os anos.\n    amort = next(r for r in rows if r["id"] == "amortizacoes-e-anulacoes-de-divida-fundada-2025")\n    amort["excerpt"] = text[start:end]\n', '').strip()
    anteriores = read('capturas-c.json')
    anterior_report = git(SITE, 'show', BASE_SITE + ':design/especime-v3/medicoes/jd1-2026-10-06/LEIA-ME.md')
    assert f"Capturas verificadas: {len(anteriores['capturas'])};" in anterior_report
    controlos = dict(juros_pt='provisório', financiamento_en='to repay or extinguish debt',
        parcela_base_sha256=sha(base_row), parcela_atual_sha256=sha((SITE / row_path).read_bytes()),
        data='padrão genérico, sem data literal', capturas_c=len(anteriores['capturas']), passou=True)
    write('controlos-d.json', controlos)

    # O nome inócuo tem de passar pelo gzip; a mesma chamada com uma marca tem de morder.
    spec = importlib.util.spec_from_file_location('priv', SITE / 'scripts/check-privacidade.py')
    priv = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(priv)
    r = priv.medir_rastreados(SITE, True)
    assert r['passou'], r
    nome = 'design/especime-v3/medicoes/ensaio/registo.json.gz'
    assert priv.e_registo(nome)
    with __import__('unittest.mock', fromlist=['patch']).patch.object(priv.gzip, 'decompress', wraps=priv.gzip.decompress) as decomprimir:
        assert not priv.tem_estrutura_local(nome, priv.gzip.compress(b'<worktree>/dist <sitio>/src <motor>/content'))
        assert decomprimir.call_count == 1
    assert priv.tem_estrutura_local(nome, priv.gzip.compress(priv.ESTRUTURA_LOCAL[0]))
    write('plantas-d.json', dict(plantas=r['plantas'], registo_inocuo_lido=True, passou=True))

    pasta = MOTOR / 'indicators/out/jd1-2026-10-06'
    pedidos = [json.loads(s) for s in (pasta / 'pedidos.jsonl').read_text().splitlines()]
    fontes = {}
    for chave, nome, paginas in [('igcp', '007-igcp-relatorio-anual-2025.pdf', [45]), ('ine', '002-ine-pde-setembro-2026.pdf', [2, 4, 7, 12])]:
        pdf = pasta / nome
        pedido = next(p for p in pedidos if p['file'] == nome)
        assert sha(pdf.read_bytes()) == pedido['sha256']
        extraido = subprocess.check_output(['pdftotext', '-layout', str(pdf), '-']).decode()
        assert extraido == pdf.with_suffix('.txt').read_text()
        folhas = extraido.split('\f')
        fontes[chave] = dict(ficheiro=str(pdf.relative_to(MOTOR)), sha256=pedido['sha256'], paginas=paginas)
        if chave == 'igcp':
            pagina = folhas[paginas[0] - 1]
            cabecalho = next(l for l in pagina.splitlines() if re.fullmatch(r'\s*\(milhões de euros\)\s+2024\s+2025\s*', l))
            parcela = next(l for l in pagina.splitlines() if '2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)' in l)
            celulas = re.split(r'\s{2,}', parcela.strip())
            fontes[chave].update(cabecalho=cabecalho, parcela=parcela, anterior=celulas[1], atual=celulas[2], anos=cabecalho.split()[-2:])
            assert 'execução' not in cabecalho.lower() and 'estimativa' not in cabecalho.lower()
            assert int(celulas[2].replace(' ', '')) > int(celulas[1].replace(' ', ''))
        else:
            fontes[chave]['subsetores_noutros_quadros'] = [l.strip() for n in [2, 7] for l in folhas[n - 1].splitlines() if re.search(r'Administração (Central|Regional|Local)|Fundos de Segurança Social', l)]
            fontes[chave]['rubrica_juros'] = next(l for l in folhas[11].splitlines() if re.match(r'\s+Juros\s+D\.41', l))
            fontes[chave]['decisao'] = 'Os subsetores são nomeados nos quadros de saldo, dívida e transferências; não há discriminação dos juros por esses subsetores no quadro da medida. Conserva-se apenas o corte da oração circular.'
    write('fontes-d.json', fontes)
    commits = {repo: git(path, 'log', '--reverse', '--format=%h %s', base + '..HEAD').splitlines() for repo, path, base in [('sítio', SITE, BASE_SITE), ('motor', MOTOR, BASE_MOTOR)]}
    igcp = fontes['igcp']
    sec = ['## A passagem JD1-d', '',
        'O recibo das amortizações identifica o total, o destino da parcela e a comparação com a coluna anterior. O excerto conserva um bloco contínuo do quadro, com os anos e o total, apresentado como tabela nas duas edições. A frase circular do perímetro foi cortada.', '',
        f"Cabeça do código do sítio: `{heads['sitio']}`. Cabeça do código do motor: `{heads['motor']}`. A árvore estava limpa no início (`arvore.inicio`); as cabeças de início e fim coincidem. Os portões têm as suas horas reais abaixo. Não houve push nem publicação.", '',
        '### Decisões e limites de fonte', '',
        f"Achados 1 a 5: confirmados em `controlos-d.json`. O recibo português dos juros diz «{controlos['juros_pt']}»; o inglês das necessidades brutas diz «{controlos['financiamento_en']}». A parcela conserva o valor selado e o resumo do ficheiro coincide com `exported_row_sha256`, na base e depois do alargamento do excerto. O padrão da data do motor continua genérico, sem data literal. O relatório anterior diz as {controlos['capturas_c']} capturas do manifesto.", '',
        f"Achado 6: na página {igcp['paginas'][0]} do PDF selado, o cabeçalho é «{' '.join(igcp['cabecalho'].split())}». A mesma rubrica tem {igcp['anterior']} na primeira coluna, {igcp['anos'][0]}, e {igcp['atual']} na segunda, {igcp['anos'][1]}. O cabeçalho não as rotula como execução ou estimativa. Permite comparar a mesma medida, sem acrescentar esses rótulos. O excerto publicado é contíguo e idêntico ao texto extraído dessa página.", '',
        'JD1-14, decisão pequena: a frase diz a direção da comparação, calculada pelas duas células seladas, e aponta à coluna do mesmo quadro. O montante anterior permanece visível na tabela transcrita; não se cria uma linha adicional nem um número literal na prosa para o repetir. Os montantes do total e da parcela entram pelos tokens existentes.', '',
        'Achados 7 e 11: ficam para a higiene, nas questões JD1-11 e JD1-12 do mandato (o mandato dizia JD1-10 e JD1-11 por engano; a JD1-10 é da JD1-c, e o lugar de direção renumerou). O mapa e o registo de leituras não foram alterados. Achado 8: o lugar de direção aceitou a exceção à reversão para retirar a disposição local da máquina, por prevalência da regra de privacidade; não se refez a JD1-c.', '',
        'Achado 9: a planta inócua usa um nome dentro do âmbito dos registos. A conferência contou a chamada ao descompressor e voltou a usar o mesmo nome com conteúdo proibido; o limpo passa e o proibido morde. As plantas corridas estão abaixo.', '',
        'Achado 10: ' + fontes['ine']['decisao'] + ' As páginas e os literais consultados estão em `fontes-d.json`. Nada foi acrescentado de memória.', '',
        'Achado 12: o comentário do exportador descreve a resolução do sítio sem nomear a disposição local das pastas. Achado 13: o texto e o gerador do relatório anterior distinguem agora as horas das corridas do motor e do sítio; o portão do motor desta passagem foi repetido sobre a cabeça nova.', '',
        'JD1-13, questão para a higiene: a opção exportada `OEDP_CONFERIR_MOTOR` entrou nos testes sintéticos da tranca e lançou o portão real do motor dentro deles. A corrida foi interrompida; os registos completos estão em `portoes-d/tentativa-1/`. A corrida final mantém a opção como variável local do shell principal, não exportada, e corre todos os portões. Não se alterou a maquinaria do repositório.', '',
        f"Códigos existentes da tentativa interrompida, lidos dos ficheiros: {', '.join(f'{n}={v}' for n,v in sorted(interrompida.items()))}. Os portões sem ficheiro de código não terminaram nem são apresentados como verdes.", '',
        'Comando final: `RESEARCHHUB_DIR=<motor> OEDP_SITE=<sitio> sh -c \'unset OEDP_CONFERIR_MOTOR; OEDP_CONFERIR_MOTOR=1; . scripts/leituras/portoes.sh\' sh <sitio> design/especime-v3/medicoes/jd1-2026-10-06/portoes-d`.', '',
        '### Portões, códigos e horas lidos dos ficheiros', '',
        '| Ficheiro em `portoes-d/` | Código | Início UTC | Fim UTC |', '|---|---:|---|---|']
    sec += [f"| `{n}.codigo` | {codes[n]} | {horas[n]['inicio']} | {horas[n]['fim']} |" for n in nomes]
    sec += ['', f"Capturas verificadas: {len(caps['capturas'])}; problemas reportados: {len(caps['problemas'])}. Larguras: {', '.join(map(str, caps['larguras']))} px. Manifesto: `capturas-d.json`. As imagens foram inspecionadas visualmente no fecho.", '', '### Frases lidas dos recibos', '']
    for f in frases:
        sec += [f"**`{f['id']}` · {f['lang']}**", '', f['frase']]
        sec += [v for v in [f['parcela'], f['evolucao']] if v]
        sec += ['']
    sec += ['### Plantas da privacidade corridas', '', '| Planta | Resultado |', '|---|---|']
    sec += [f"| `{p['id']}` | {'passou' if p['mordeu'] else 'falhou'} |" for p in r['plantas']]
    sec += ['', '### Commits', '']
    for repo, itens in commits.items():
        sec += [f'**{repo}**', ''] + [f'- `{v}`' for v in itens] + ['']
    sec += ['O commit final de provas identifica-se com `git rev-parse HEAD`, e na resposta de entrega; não pode conter a sua própria cabeça.', '', '### Custo', '', 'A linha «tokens used» não foi exposta durante a construção. O custo fica por verificar; não se estima pelo número de chamadas.', '']
    report = AQUI / 'LEIA-ME.md'
    old = report.read_text()
    if '## A passagem JD1-d' in old:
        a = old.index('## A passagem JD1-d'); b = old.index('## A passagem JD1-c', a)
        old = old[:a] + old[b:]
    old = old.replace('Estado atual: passagem JD1-c.', 'Estado atual: passagem JD1-d.').replace('na secção [A passagem JD1-c](#a-passagem-jd1-c).', 'na secção [A passagem JD1-d](#a-passagem-jd1-d).')
    report.write_text(old.replace('## A passagem JD1-c', '\n'.join(sec) + '\n## A passagem JD1-c', 1))
    write('fecho-d.json', dict(cabecas_codigo=heads, codigos=codes, horas=horas, capturas=len(caps['capturas']), commits=commits))
    print('JD1-d: relatório escrito a partir dos ficheiros conferidos.')


if __name__ == '__main__':
    main()
