"""Acrescenta a passagem de correção ao relatório, a partir dos ficheiros medidos.
Uso: RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar-b.py
"""
import json
import os
from pathlib import Path
import re
import subprocess

BASE = Path(__file__).resolve().parent
SITE = BASE.parents[3]
MOTOR = Path(os.environ['RESEARCHHUB_DIR'])
PORTOES = BASE / 'portoes-b'
INICIO = 'bf347dd81e2200d33a3a68ddb4c9d2f1267d9f6a'
INICIO_MOTOR = 'eb4a5cbb0e4abe7cc44919a3679ce6fbad3bf369'

def git(raiz, *args):
    return subprocess.check_output(['git', '-C', str(raiz), *args], text=True).strip()

def ler(p):
    return json.loads(p.read_text())

def md(s):
    return str(s).replace('|', '\\|').replace('\n', '<br>')

def limpar(s):
    for valor, marca in [(str(SITE), '<worktree>'), (str(MOTOR), '<motor>'), (str(Path.home()), '<casa>'), (Path.home().name, '<utilizador>')]:
        s = s.replace(valor, marca)
    return s

# Os registos só se limpam depois de a corrida terminar, sem cortar o que ela escreve.
for g in ('build', 'verify', 'typecheck'):
    assert (PORTOES / f'{g}.fim').exists(), f'o portão {g} não terminou'
for pasta in (PORTOES, BASE / 'conferencias-b'):
    for p in pasta.iterdir():
        if p.is_file():
            conteudo = limpar(p.read_text())
            if p.suffix == '.log':
                conteudo = re.sub(r'\x1b\[[0-9;]*m', '', conteudo)
                conteudo = '\n'.join(l.rstrip() for l in conteudo.splitlines()).rstrip() + '\n'
            p.write_text(conteudo)

antes, depois = [ler(BASE / f'{fase}-b' / 'medidas.json') for fase in ('antes', 'depois')]
plantas = ler(BASE / 'plantas-b.json')['plantas']
cabeca = (PORTOES / 'cabeca').read_text().strip()
assert cabeca == (PORTOES / 'cabeca.fim').read_text().strip(), 'a cabeça mudou durante os portões'
cabeca_motor = git(MOTOR, 'rev-parse', 'HEAD')
assert cabeca_motor == INICIO_MOTOR, 'o motor mudou e precisa de nova conferência'
assert not git(MOTOR, 'status', '--porcelain'), 'a worktree do motor tem alterações'
codigos = {g: int((PORTOES / f'{g}.codigo').read_text()) for g in ('build', 'verify', 'typecheck')}
codigo_lingua = int((BASE / 'conferencias-b' / 'lingua.codigo').read_text())
for g in ('build', 'verify'):
    if codigos[g] == 1:
        registo = re.sub(r'\x1b\[[0-9;]*m', '', (PORTOES / f'{g}.log').read_text())
        falhas = [l for l in registo.splitlines() if '✗' in l]
        assert len(falhas) == depois['totais']['recusadas'], f'{g}: falhas diferentes do inventário'
        assert all('RP4N:' in l for l in falhas), f'{g}: há uma falha fora da RP4N'
codigo_motor = int((BASE / 'portoes' / 'motor.codigo').read_text())
concluida = not depois['totais']['recusadas'] and not any(codigos.values())
linhas = ['## A passagem RP4-n-b', '',
    ('A construção desta passagem fechou com os portões a zero. A leitura independente e a conferência da direção continuam por fazer.' if concluida else 'A célula e os títulos foram corrigidos, mas a passagem não fecha: há marcas fora dos tipos autorizados na RP4N-1. A RP4N-5 fica à decisão da direção. Não se declarou um portão verde nem se ampliou a lista de exceções.'), '',
    'A regra aplicada recusa sempre marcas nas frases «o que é», nos nomes e rótulos de medidas, séries e lugares, nos títulos de estudos, nas leituras de cartões, na primeira página e nas explicações. Uma exceção de recibo dentro dessas superfícies continua recusada. Fora delas, só se aceitam as ausências enumeradas na RP4N-1. Qualquer outro tipo é recusado.', '',
    'O campo que recebe uma exceção tem de existir no livro e ser exatamente a marca de ausência. A proteção I77 dos mandatos permanece no portão; os parágrafos já publicados sobre essa identidade só são aceites na obra respetiva e com o texto intacto, conferido por resumo. A referência do Método está presa ao seu parágrafo, e uma demonstração isolada da marca no Método ou no Sobre não autoriza prosa por confirmar. As células anteriores de fontes e de pessoas mantêm-se.', '',
    'Os títulos dos estudos da água conservaram o texto publicado. Na edição inglesa levam `lang="pt"`, sem marca nem ligação do título para a página «to verify». A mudança vive no componente comum, incluindo os índices, o registo e os recibos. Não se escreveu uma tradução.', '',
    'As contagens abaixo aplicam a mesma célula aos dois estados do HTML. Os resumos de cada página anterior são comparados com `depois/medidas.json` da primeira passagem; o total também é afirmado. A célula anterior recusava todas as ocorrências, sem distinguir tipos.', '',
    '| Estado | Páginas com marcas | Aceites pela RP4N-1 | Recusadas pela RP4N-1 |', '|---|---:|---:|---:|']
for nome, d in [('Antes', antes), ('Depois', depois)]:
    t = d['totais']
    linhas.append(f"| {nome} | {t['paginas']} | {t['aceites']} | {t['recusadas']} |")
linhas += ['', '| Decisão | Tipo | Antes | Depois |', '|---|---|---:|---:|']
for estado in ('aceites', 'recusadas'):
    for tipo, d in antes['tipos'][estado].items():
        linhas.append(f"| {estado} | {tipo} | {d['ocorrencias']} | {depois['tipos'][estado][tipo]['ocorrencias']} |")
linhas += ['', '**RP4N-5. Tipos que a lista da decisão não abrange.** A enumeração do mandato não inclui todos os contextos existentes. Segue a discriminação medida. A marca do publicador ausente e a do título de um documento ausente não foram tratadas como endereços. Os selos são projeções da proveniência incompleta, mas não foram aceites como campos de recibo. A página da própria marca e a referência no livro também não foram acrescentadas às páginas autorizadas. As notas de alcance continuaram recusadas.', '',
    '| Superfície fora dos tipos | Antes | Depois |', '|---|---:|---:|']
for tipo in sorted(set(antes['naoAbrangidas']) | set(depois['naoAbrangidas'])):
    linhas.append(f"| {tipo} | {antes['naoAbrangidas'].get(tipo, 0)} | {depois['naoAbrangidas'].get(tipo, 0)} |")
linhas += ['', 'Foi pedida decisão para dizer a ausência exata por palavras nos casos não abrangidos, conservando as conferências de proveniência. Sem resposta registada, essa alteração não foi executada. A decisão é necessária porque a RP4N-1 manda recusar qualquer tipo fora da lista e porque os portões envolvidos protegem uma fonte.', '',
    '### Cabeças do código e códigos lidos', '', '| Repositório | Cabeça do código conferido |', '|---|---|', f'| sítio | `{cabeca}` |', f'| motor, intacto | `{cabeca_motor}` |', '',
    '| Portão | Ficheiro | Código lido |', '|---|---|---:|']
for g, c in codigos.items():
    linhas.append(f'| {g} | `portoes-b/{g}.codigo` | {c} |')
linhas += [f'| língua, conferência afetada corrida separadamente | `conferencias-b/lingua.codigo` | {codigo_lingua} |',
    f'| motor, corrida anterior na mesma cabeça | `portoes/motor.codigo` | {codigo_motor} |', '',
    'O motor não mudou e não teve nova corrida. Os comandos posteriores a um portão que falhou numa cadeia não se consideram executados. Os registos dos portões são conservados com os caminhos da máquina substituídos, sem códigos de cor nem espaços no fim das linhas.', '',
    '### Plantas e mensagens', '', f'As {len(plantas)} plantas afirmam a mensagem, o lado da decisão e a contagem da ocorrência e da página. Correm também dentro do `gate:html`.', '', '| Planta | Decisão | Mensagem | Contagem afirmada |', '|---|---|---|---:|']
for p in plantas:
    linhas.append('| ' + ' | '.join(md(p[k]) for k in ('nome', 'estado', 'mensagem', 'contagem')) + ' |')
titulos = ler(BASE / 'conferencias-b' / 'titulos.json')
assert titulos['codigo'] == int((BASE / 'conferencias-b' / 'titulos.codigo').read_text())
linhas += ['', f"A conferência dos títulos também correu sobre cópias do HTML construído. Código lido de `conferencias-b/titulos.codigo`: {titulos['codigo']}. As {len(titulos['plantas'])} plantas da A4 abaixo confirmam a recusa da marca nas páginas e de uma declaração de título por confirmar, mesmo sem marca rendida.", '', '| Planta da A4 | Mensagens afirmadas | Código esperado e observado |', '|---|---|---:|']
for p in titulos['plantas']:
    linhas.append(f"| {md(p['nome'])} | {md(chr(10).join(p['mensagens']))} | {p['codigo']} |")
linhas += ['', '### Páginas com marcas aceites para o bloco dos recibos', '', '| Página | Ocorrências aceites por tipo |', '|---|---|']
for p in depois['paginas']:
    if not p['aceites']:
        continue
    tipos = sorted({m['tipo'] for m in p['aceites']})
    descr = '; '.join(f"{tipo}: {sum(m['tipo'] == tipo for m in p['aceites'])}" for tipo in tipos)
    linhas.append(f"| `{p['pagina']}` | {descr} |")
linhas += ['', 'A lista com cada ocorrência, contexto e resumo da página está em `depois-b/medidas.json`. As ausências aceites ficam para o bloco dos recibos as dizer por palavras. Continuam abertas a questão do relatório das pensões (RP4N-2), a leitura do vocabulário do PRR (RP4N-3) e a leitura a frio com a conferência da direção (RP4N-4). Não se fez fusão nem publicação.', '',
    '### Comandos e commits', '', '```sh',
    'node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs antes <copia-do-HTML-anterior>',
    'node tests/cartao/rp4nb.mjs --registo',
    'RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes-b',
    'node design/especime-v3/medicoes/rp4n-2026-10-06/medir-b.mjs depois',
    'node design/especime-v3/medicoes/rp4n-2026-10-06/conferir-titulos-b.mjs',
    'node scripts/check-lingua.mjs',
    'RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar-b.py', '```', '',
    'Commits desta passagem antes do commit final do relatório e dos códigos:', '', '```text',
    git(SITE, 'log', '--reverse', '--format=%H %s', f'{INICIO}..HEAD'), '```', '',
    'O último commit contém apenas o relatório e os registos dos códigos. A cabeça final do sítio é a desse commit e comunica-se no fecho; a cabeça final do motor é a indicada acima. O modelo do construtor foi indicado no mandato como `gpt-6-astra`, com raciocínio `xhigh`. Não foi exposta uma linha de consumo acumulado nesta sessão e não se estima o custo.', '']
original = (BASE / 'LEIA-ME.md').read_text().split('\n## A passagem RP4-n-b')[0].rstrip()
original = original.replace('A construção das frases está recomposta, mas a aceitação global fica bloqueada enquanto o portão HTML encontrar informação por confirmar noutras partes das páginas. Este pacote é uma entrega para leitura a frio, não uma aprovação nem uma publicação.', 'A primeira passagem recompôs as frases e ficou bloqueada no portão HTML. O estado atual, a regra corrigida e os códigos desta passagem estão na secção «A passagem RP4-n-b», no fim. Este pacote é uma entrega para leitura a frio, não uma aprovação nem uma publicação.')
original = original.replace('O resto do RP4-n-b permanece fora deste trabalho.', 'Esta nota é da primeira passagem. A passagem de correção pedida depois está documentada no fim.')
(BASE / 'LEIA-ME.md').write_text(limpar(original + '\n\n' + '\n'.join(linhas)))
print(json.dumps({'cabeca': cabeca, 'motor': cabeca_motor, 'codigos': codigos, 'totais': depois['totais']}, ensure_ascii=False))
