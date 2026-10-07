"""Gera a passagem RP4-n-c a partir dos inventários, plantas e códigos lidos."""
import json
import os
from pathlib import Path
import re
import subprocess

BASE = Path(__file__).resolve().parent
SITE = BASE.parents[3]
MOTOR = Path(os.environ['RESEARCHHUB_DIR'])
PORTOES = BASE / 'portoes-c'
INICIAIS = BASE / 'portoes-c-iniciais'
ROTULOS = BASE / 'portoes-c-rotulos'

def git(raiz, *args):
    return subprocess.check_output(['git', '-C', str(raiz), *args], text=True).strip()

def ler(nome):
    return json.loads((BASE / nome).read_text())

def limpar(s):
    for valor, marca in [(str(SITE), '<worktree>'), (str(MOTOR), '<motor>'), (str(Path.home()), '<casa>'), (Path.home().name, '<utilizador>')]:
        s = s.replace(valor, marca)
    s = re.sub(r'\x1b\[[0-9;]*m', '', s)
    return '\n'.join(l.rstrip() for l in s.splitlines()).rstrip() + '\n'

antes, depois = [ler(f'{fase}-c/medidas.json') for fase in ('antes', 'depois')]
plantas = ler('plantas-c.json')['plantas']
nomes_anteriores = {p['nome'] for p in ler('plantas-b.json')['plantas']}
novas = [p for p in plantas if p['nome'] not in nomes_anteriores]
assert all(p in plantas for p in ler('plantas-b.json')['plantas']), 'uma planta anterior mudou'
cabeca = (PORTOES / 'cabeca').read_text().strip()
assert cabeca == (PORTOES / 'cabeca.fim').read_text().strip() == depois['cabeca']
for pasta in (PORTOES, INICIAIS, ROTULOS):
    for g in ('build', 'verify', 'typecheck'):
        assert (pasta / f'{g}.fim').exists(), f'{pasta.name}/{g} não terminou'
    for p in pasta.iterdir():
        if p.is_file():
            p.write_text(limpar(p.read_text()))
for p in (BASE / 'conferencias-c').glob('*.log'):
    p.write_text(limpar(p.read_text()))
codigos = {g: int((PORTOES / f'{g}.codigo').read_text()) for g in ('build', 'verify', 'typecheck')}
codigos_iniciais = {g: int((INICIAIS / f'{g}.codigo').read_text()) for g in codigos}
codigos_rotulos = {g: int((ROTULOS / f'{g}.codigo').read_text()) for g in codigos}
rotulos = ler('conferencias-c/rotulos.json')
assert rotulos['cabeca'] == (ROTULOS / 'cabeca').read_text().strip() == (ROTULOS / 'cabeca.fim').read_text().strip()
assert f"{len(rotulos['diferencas_anteriores'])} diferença(s)" in (ROTULOS / 'verify.log').read_text()
voz = ler('conferencias-c/voz-antes.json')
assert voz['cabeca'] == (INICIAIS / 'cabeca').read_text().strip() == (INICIAIS / 'cabeca.fim').read_text().strip()
ocorrencias_voz = sum(p['ocorrencias'] for p in voz['por_classificar'])
problemas_voz = ocorrencias_voz + len(voz['vivas_que_nao_rendem'])
for g in ('build', 'verify'):
    assert f'PORTÃO DA VOZ · {problemas_voz} problema(s)' in (INICIAIS / f'{g}.log').read_text()
cabeca_motor = git(MOTOR, 'rev-parse', 'HEAD')
assert cabeca_motor == git(SITE, 'show', f"{antes['cabeca']}:design/especime-v3/medicoes/rp4n-2026-10-06/portoes/motor.cabeca")
assert not git(MOTOR, 'status', '--porcelain'), 'o motor tem alterações'
assert not git(SITE, 'diff', cabeca, '--', 'scripts', 'tests', 'src', 'ledger', 'package.json', 'package-lock.json', 'design/especime-v3/INVENTARIO-FRASES.md', 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md', 'design/especime-v3/rotulos/INVENTARIO.json'), 'o código ou o inventário mudou depois dos portões'
# As superfícies recusadas na lista antiga passam aos tipos agora autorizados.
# A contagem vem das ocorrências antigas, sem transcrever algarismos do mandato.
equivalencias = {'source': 'publicador', 'document.title': 'titulo-documento', 'document.edition': 'edicao-documento'}
tipos = list(depois['tipos']['aceites']) + list(depois['tipos']['recusadas'])
contagens = {tipo: {fase: {estado: 0 for estado in ('aceites', 'recusadas')} for fase in ('antes', 'depois')} for tipo in tipos}
for fase, dados in [('antes', antes), ('depois', depois)]:
    for pagina in dados['paginas']:
        for estado in ('aceites', 'recusadas'):
            for marca in pagina[estado]:
                tipo = marca['tipo']
                if fase == 'antes' and tipo == 'fora-dos-tipos':
                    candidato = equivalencias.get(marca['superficie'], marca['superficie'])
                    if candidato in depois['tipos']['aceites']:
                        tipo = candidato
                contagens[tipo][fase][estado] += 1
for fase, dados in [('antes', antes), ('depois', depois)]:
    for estado in ('aceites', 'recusadas'):
        assert sum(c[fase][estado] for c in contagens.values()) == dados['totais'][estado]
concluida = not depois['totais']['recusadas'] and not any(codigos.values())
linhas = ['## A passagem RP4-n-c', '',
    'A construção fecha a RP4N-5 com os portões a zero. A leitura independente e a conferência final da direção continuam por fazer.' if concluida else 'A passagem não fecha. As recusas e os códigos efetivamente lidos ficam registados abaixo.', '',
    'A lista da RP4N-1 era incompleta. A decisão RP4N-5 conserva o critério: a célula recusa a marca nas frases «o que é», nos nomes e rótulos de medidas, séries e lugares, nos títulos de estudos, nas leituras de cartões, na primeira página e nas explicações. Estas recusas têm prioridade sobre qualquer tipo aceite. Tudo o que não pertence a um tipo aceite continua recusado.', '',
    'Aceita e conta as ausências de proveniência nos recibos e os lugares onde a casa explica a marca: datas, excertos, endereços, a pessoa protegida pela I77, as referências do Método e do Sobre e, agora, os selos de proveniência dos recibos (pedido, hora, cliente, sha256 e ficheiro), o publicador, o título e a edição do documento citado, as notas de alcance, a referência no livro-razão e a própria página da marca, nas duas edições.', '',
    'Os campos de publicador, título e edição têm de coincidir exatamente com a ausência declarada na linha. Um selo precisa de apontar para uma linha existente com proveniência incompleta; as células anteriores continuam a conferir o seu texto, etiqueta e destino. A nota de alcance fica no recibo de uma linha existente. A referência do livro é uma amostra isolada, com a glosa inglesa opcional. A proteção I77 mantém-se. Nenhuma página, frase, medida ou fonte foi reescrita nesta passagem.', '',
    '### Contagens antes e depois', '',
    'O antes foi relido no HTML da passagem anterior e comparado com `depois-b/medidas.json`, incluindo o resumo de cada página. O depois foi medido após os portões. A medição exige as mesmas páginas e os mesmos contextos de ocorrência. A tabela discrimina retrospetivamente as superfícies recusadas no antes pelos tipos agora autorizados; não volta a somá-las em «fora-dos-tipos». Todos os algarismos abaixo vêm dos ficheiros de medição.', '',
    '| Estado | Páginas com marcas | Aceites | Recusadas |', '|---|---:|---:|---:|']
for fase, dados in [('Antes', antes), ('Depois', depois)]:
    t = dados['totais']
    linhas.append(f"| {fase} | {t['paginas']} | {t['aceites']} | {t['recusadas']} |")
linhas += ['', '| Tipo | Antes aceites | Antes recusadas | Depois aceites | Depois recusadas |', '|---|---:|---:|---:|---:|']
for tipo, c in contagens.items():
    linhas.append(f"| {tipo} | {c['antes']['aceites']} | {c['antes']['recusadas']} | {c['depois']['aceites']} | {c['depois']['recusadas']} |")
linhas += ['', '### Plantas novas e mensagens', '',
    f'As {len(novas)} plantas novas integram as {len(plantas)} plantas da célula. Cada uma afirma a mensagem, a decisão, a contagem da ocorrência e a lista de páginas. As plantas anteriores permanecem intactas e todas correm dentro do portão HTML.', '',
    '| Planta | Decisão | Mensagem | Contagem afirmada |', '|---|---|---|---:|']
for p in novas:
    linhas.append(f"| {p['nome']} | {p['estado']} | {p['mensagem']} | {p['contagem']} |")
linhas += ['', '### Páginas com marcas aceites para o bloco dos recibos', '', '| Página | Ocorrências aceites por tipo |', '|---|---|']
for p in depois['paginas']:
    if p['aceites']:
        tipos_pagina = sorted({m['tipo'] for m in p['aceites']})
        descr = '; '.join(f"{tipo}: {sum(m['tipo'] == tipo for m in p['aceites'])}" for tipo in tipos_pagina)
        linhas.append(f"| `{p['pagina']}` | {descr} |")
linhas += ['', '### Cabeças e códigos lidos', '', '| Repositório | Cabeça do código conferido |', '|---|---|',
    f'| sítio | `{cabeca}` |', f'| motor, intacto | `{cabeca_motor}` |', '',
    '| Portão | Ficheiro | Código lido |', '|---|---|---:|']
for g, c in codigos.items():
    linhas.append(f'| {g} | `portoes-c/{g}.codigo` | {c} |')
linhas += ['', 'As cabeças de início e fim da corrida são iguais. Os portões correram inteiros pela tranca. Os registos foram conservados com os caminhos da máquina substituídos. O motor não mudou e não teve nova corrida.', '',
    '### RP4N-6. Inventário da voz desfasado', '',
    f"A primeira corrida, na cabeça `{voz['cabeca']}`, encontrou {problemas_voz} problemas no portão da voz: {ocorrencias_voz} ocorrências das frases já publicadas por classificar e {len(voz['vivas_que_nao_rendem'])} declarações antigas ainda vivas que deixaram de se render. O diagnóstico completo está em `conferencias-c/voz-antes.json`.", '',
    'As declarações antigas, com a qualificação não sustentada, passaram a retiradas; as frases já publicadas em `src/data/concelhos.mjs` e já conferidas em `tests/cartao/leituras-provadas.json` entraram como conteúdo. A revisão ficou registada como por ler. Não se alterou a frase das páginas, a medida, o número ou a fonte. A repetição integral dos portões confere esta sincronização.', '',
    '| Frase já publicada | Ocorrências por classificar na primeira corrida |', '|---|---:|']
for p in voz['por_classificar']:
    linhas.append(f"| {p['texto']} | {p['ocorrencias']} |")
linhas += ['', '| Portão da primeira corrida | Ficheiro | Código lido |', '|---|---|---:|']
for g, c in codigos_iniciais.items():
    linhas.append(f'| {g} | `portoes-c-iniciais/{g}.codigo` | {c} |')
linhas += ['', 'Os comandos posteriores à falha da voz nas cadeias da primeira corrida não se consideram executados. Os códigos do fecho são os de `portoes-c`, na cabeça do código indicada acima.', '',
    '### RP4N-7. A mesma sincronização no inventário dos rótulos', '',
    f"A segunda corrida, na cabeça `{rotulos['cabeca']}`, passou a voz e encontrou {len(rotulos['diferencas_anteriores'])} diferenças no inventário dos rótulos. Eram as mesmas frases: a forma atual aparecia nas páginas e a forma antiga continuava na declaração. O comando `node scripts/inventario-rotulos.mjs --escrever` recontou o inventário. A comparação dos objetos afirma que só mudaram as {len(rotulos['alteracoes'])} formas da dobra, com as contagens conservadas; todos os outros campos das entradas ficaram iguais. Os metadados da cabeça e das páginas também foram recontados pelo comando. O diagnóstico está em `conferencias-c/rotulos.json`.", '',
    '| Chave | Antes na declaração | Depois na declaração |', '|---|---:|---:|']
for a in rotulos['alteracoes']:
    chave = a['chave'].replace('|', '\\|')
    linhas.append(f"| `{chave}` | {sum(a['antes'].values())} | {sum(a['depois'].values())} |")
linhas += ['', '| Portão da segunda corrida | Ficheiro | Código lido |', '|---|---|---:|']
for g, c in codigos_rotulos.items():
    linhas.append(f'| {g} | `portoes-c-rotulos/{g}.codigo` | {c} |')
linhas += ['', 'A conferência dos rótulos e os passos que esta corrida não alcançou foram corridos separadamente antes da repetição integral. Não substituem os portões do fecho.', '', '| Conferência | Ficheiro | Código lido |', '|---|---|---:|']
for nome in ('rotulos', 'series', 'indice-do-sitio', 'explicacoes', 'frases-compostas'):
    codigo = int((BASE / 'conferencias-c' / f'{nome}.codigo').read_text())
    linhas.append(f'| {nome} | `conferencias-c/{nome}.codigo` | {codigo} |')
linhas += ['',
    '### Pendências', '']
recusadas = [(p['pagina'], m) for p in depois['paginas'] for m in p['recusadas']]
if recusadas:
    linhas += ['**RP4N-8. Ocorrências ainda recusadas.** A passagem para aqui.', '', '| Página | Tipo | Contexto |', '|---|---|---|']
    for pagina, m in recusadas:
        contexto = m['contexto'].replace('|', '\\|')
        linhas.append(f"| `{pagina}` | {m['tipo']} | {contexto} |")
else:
    linhas += ['Não sobrou nenhuma ocorrência fora dos tipos nem em superfície de afirmação. A RP4N-5 fica resolvida. A RP4N-6 e a RP4N-7 foram corrigidas pela sincronização dos inventários da voz e dos rótulos. As ausências aceites ficam inventariadas para o bloco dos recibos as dizer por palavras. Permanecem fora desta passagem o relatório das pensões (RP4N-2, falha de certificado já registada), a leitura do vocabulário do PRR (RP4N-3) e a leitura independente com a conferência final da direção (RP4N-4). Não houve fusão nem publicação.']
linhas += ['', '### Comandos e commits', '', '```sh',
    'node design/especime-v3/medicoes/rp4n-2026-10-06/medir-c.mjs antes',
    'node tests/cartao/rp4nb.mjs --registo-c',
    'node scripts/inventario-rotulos.mjs --escrever',
    'RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4n-2026-10-06/portoes-c',
    'node design/especime-v3/medicoes/rp4n-2026-10-06/medir-c.mjs depois',
    'RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/relatar-c.py', '```', '',
    'Commits da passagem antes do commit final do relatório e dos códigos:', '', '```text',
    git(SITE, 'log', '--reverse', '--format=%H %s', f"{antes['cabeca']}..HEAD"), '```', '',
    'O último commit contém apenas este relatório e os ficheiros dos códigos. A cabeça final comunica-se no fecho. O mandato identifica o construtor como Codex `gpt-6-astra`, com raciocínio `xhigh`.', '']
original = (BASE / 'LEIA-ME.md').read_text().split('\n## A passagem RP4-n-c')[0].rstrip()
original = original.replace('O estado atual, a regra corrigida e os códigos desta passagem estão na secção «A passagem RP4-n-b», no fim.', 'O estado atual, a regra completa e os códigos estão na secção «A passagem RP4-n-c», no fim.')
(BASE / 'LEIA-ME.md').write_text(limpar(original + '\n\n' + '\n'.join(linhas)))
print(json.dumps({'cabeca': cabeca, 'motor': cabeca_motor, 'codigos': codigos, 'totais': depois['totais']}, ensure_ascii=False))
