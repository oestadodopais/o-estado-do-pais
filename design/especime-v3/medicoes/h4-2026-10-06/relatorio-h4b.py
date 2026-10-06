#!/usr/bin/env python3
"""Acrescenta a passagem H4-b com medidas e códigos lidos dos ficheiros.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4b.py
"""
import json
from pathlib import Path
import re
import subprocess

AQUI = Path(__file__).resolve().parent
COMANDO = 'python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4b.py'
def ler(nome):
    return json.loads((AQUI / nome).read_text())
def n(valor):
    return str(valor).replace('.', ',')
def l1(texto):
    m = re.search(r'L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)', texto)
    assert m, 'Falta a medida da L1.'
    return {'paginas': int(m[1]), 'teto': int(m[2])}

menu = ler('menu-a-390.json')
depois = menu['depois']
antes = ler('menu-depois-antes.json')
capturas = ler('capturas-b.json')
tm = ler('tema-menu-b.json')
plantas_html = ler('plantas-portoes-h4b.json')
decisoes = ler('decisoes-h4b.json')
portoes = AQUI / 'portoes-b'
cabeca = (portoes / 'cabeca').read_text().strip()
assert cabeca == (portoes / 'cabeca.fim').read_text().strip() == depois['cabeca'] == capturas['cabeca']
codigos = {g: int((portoes / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']}
commits = [dict(zip(['cabeca', 'assunto'], linha.split(' ', 1))) for linha in subprocess.check_output(
    ['git', 'log', '--reverse', '--format=%H %s', '6538dbc7..' + cabeca], text=True).splitlines()]
resumo_l1 = {
    'antes': l1((AQUI / 'lugar-b-antes.log').read_text()),
    'depois': l1((portoes / 'verify.log').read_text()),
    'comandos': ['node scripts/check-lugar.mjs', 'npm run verify, pela tranca de scripts/leituras/portoes.sh'],
}
resumo_l1['acrescimo_do_teto'] = resumo_l1['depois']['teto'] - resumo_l1['antes']['teto']
resumo = {'comando': COMANDO, 'cabeca_codigo': cabeca, 'commits': commits, 'codigos': codigos,
          'l1': resumo_l1, 'capturas_novas': len(capturas['capturas']),
          'plantas_tm4': [p for p in tm['plantas'] if p['mensagem_exigida'].startswith('TM4')],
          'falhas_tm': tm['falhas']}
(AQUI / 'resumo-h4b.json').write_text(json.dumps(resumo, ensure_ascii=False, indent=2) + '\n')

texto = ['## A passagem H4-b', '',
    'O cabeçalho ganha a porta das explicações e o nome inteiro da União. A regra que apertava o menu no telefone saiu: todas as larguras usam o espaço e a letra da regra base. A fila dobra onde precisa. O texto da política de IA da primeira passagem ficou intacto e está confirmado como final pela direção.', '',
    f'Cabeça do código: `{cabeca}`. Esta secção é gerada por `{COMANDO}`, a partir dos ficheiros abaixo; o resumo legível por máquina está em [resumo-h4b.json](resumo-h4b.json).', '',
    '### O menu antes e depois', '',
    f"Antes: `{antes['comando']}`, na construção `{antes['cabeca']}`. Depois: `{depois['comando']}`, na cabeça do código. As caixas de cada porta, a posição da última, as capturas e os SHA-256 estão em [menu-a-390.json](menu-a-390.json), incluindo a fase `depois`; a medida servida da primeira passagem está em [menu-depois-antes.json](menu-depois-antes.json).", '',
    '| Edição | Janela, px | Fase | Portas | Coluna, px | Largura natural, px | Linhas | Espaço, px | Letra | Menor alvo, px | Sem transbordo |',
    '| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |']
if tm['falhas'] or any(codigos.values()):
    texto[2:2] = ['O bloco continua por fechar: há uma célula ou um portão vermelho. As mensagens e os códigos abaixo são os resultados efetivos; não se declara aceitação cumprida.', '']
for m in depois['medidas']:
    anterior = next(a for a in antes['medidas'] if a['lang'] == m['lang'] and a['largura'] == m['largura'])
    for fase, valor in [('antes', anterior), ('depois', m)]:
        texto.append(f"| {valor['lang']} | {valor['largura']} | {fase} | {valor['portas']} | {n(valor['coluna'])} | {n(valor['natural'])} | {valor['linhas']} | {n(valor['gap'])} | {valor['letra']} | {n(min(c['altura'] for c in valor['caixas']))} | {'sim' if valor['sem_transbordo'] else 'não'} |")
aceitacao = [m for m in depois['medidas'] if m['largura'] == 390]
assert depois['nome_inteiro_cabe'] and len(aceitacao) == 2
texto += ['', 'A medida decide pelo nome inteiro: «União Europeia» e «European Union». Na largura de aceitação, as portas cabem em duas linhas nas duas edições. A janela mais estreita da tabela precisa de mais uma linha, com o mesmo espaço e a mesma letra, sem cortar nem esconder portas.', '',
    '### As células e as plantas', '',
    f"Comando: `{tm['comando']}`. Resultado completo, incluindo a medida da regra base computada em cada largura: [tema-menu-b.json](tema-menu-b.json). A TM4 conserva a contagem exata, a linha única quando cabe, a dobra quando não cabe e a recusa do transbordo; confere também cada alvo de toque, a letra, o espaço das letras e as folgas de cada fila contra a regra base.", '',
    '| Planta | Mensagem observada pela qual falhou | Resultado |', '| --- | --- | --- |']
for p in resumo['plantas_tm4']:
    texto.append(f"| {p['nome']} | {p['queixa']} | {'mordeu' if p['mordeu'] else 'não mordeu'} |")
texto += ['', 'A regra antiga do telefone só se serve ao navegador da planta; não é reposta na folha do projeto. Cada planta exige a mensagem da sua proteção, não apenas uma falha qualquer.', '',
    'A N1 conserva uma lista esperada independente da lista que rende o cabeçalho, nas duas edições. As plantas adicionais correm por `OEDP_MEDICOES=design/especime-v3/medicoes/h4-2026-10-06 node tests/pais/portoes.mjs --prefixo h4b-`, com reposição byte a byte e SHA-256: [plantas-portoes-h4b.json](plantas-portoes-h4b.json).', '',
    '| Planta da N1 | Mensagens exigidas | Resultado |', '| --- | --- | --- |']
for p in plantas_html:
    texto.append(f"| {p['nome']} | {'; '.join(p['mordidas']).replace(chr(92), '')} | {'mordeu' if p['passou'] else 'não mordeu'} |")
texto += ['', 'O inventário regista os rótulos nas novas portas e a confirmação do texto da política. As réguas da voz, da língua e do HTML mantêm as suas proteções. O rodapé já confere a lista certa e não foi alterado.', '',
    f"A L1 contou {n(resumo_l1['antes']['paginas'])} páginas antes e {n(resumo_l1['depois']['paginas'])} depois. O teto passou de {n(resumo_l1['antes']['teto'])} para {n(resumo_l1['depois']['teto'])}: acréscimo de {resumo_l1['acrescimo_do_teto']}. Não se abriu nenhuma exceção. O menu fica na exclusão de cabeçalho que a régua já tinha, e a conferência das duas grafias do mesmo destino entre menu e corpo continua a correr. Medida e comandos em [resumo-h4b.json](resumo-h4b.json), com os registos de partida e do verify.", '',
    '### As capturas e o pacote', '',
    f"Comando: `{capturas['comando']}`. As {len(capturas['capturas'])} capturas novas e os seus recortes mostram a primeira página e a explicação nas larguras pedidas, nas duas edições. [Manifesto com medidas e SHA-256](capturas-b.json). As imagens anteriores ficaram com o sufixo `-antes`, mantendo os resumos: [registo da preservação](preservadas-h4b.json). As capturas anteriores do Método continuam válidas para o texto da política; o HTML atual do Método e das páginas capturadas está em `paginas-b/`.", '',
    '| Página | Edição | Janela, px | Captura | Menu |', '| --- | --- | ---: | --- | --- |']
for c in capturas['capturas']:
    prefixo = '../../capturas/h4-2026-10-06/'
    texto.append(f"| {c['familia']} | {c['lang']} | {c['largura']} | [página]({prefixo}{Path(c['ficheiro']).name}) | [recorte]({prefixo}{Path(c['recorte']).name}) |")
texto += ['', 'A conferência do pacote corre por `python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py --passagem-b`: verifica resumos, ligações, cabeça, plantas, códigos e ausência de caminhos locais. O resultado está em [conferencia-pacote-b.json](conferencia-pacote-b.json).', '',
    '### As decisões e o que fica por fazer', '',
    'Registo: [decisoes-h4b.json](decisoes-h4b.json).']
for q in decisoes['questoes']:
    texto += ['', f"- **{q['id']}**, {q['estado']}. {q['decisao']}"]
texto += ['', 'A leitura a frio e a aterragem ficam com o lugar de direção, como o mandato determina. Não se fez push. O custo em tokens não foi exposto pela ferramenta durante esta passagem e fica por ler pelo lançador; não é estimado.', '',
    '### Os commits e os portões inteiros', '', 'Commits lidos do Git e guardados no resumo:']
for c in commits:
    texto += ['', f"- `{c['cabeca']}`: {c['assunto']}."]
texto += ['', f'Cabeça do código nos ficheiros `portoes-b/cabeca` e `portoes-b/cabeca.fim`: `{cabeca}`. O commit seguinte guarda só o relatório e as provas.', '',
    'Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-b`.', '',
    '| Portão | Código lido do ficheiro |', '| --- | ---: |']
for g, codigo in codigos.items():
    texto.append(f'| {g} | {codigo} |')
texto += ['', 'Os registos da corrida ficam em `portoes-b/`, limpos de caminhos locais antes de entrar no Git. A cabeça final é a do commit das provas; os portões pertencem à cabeça do código acima.', '']
p = AQUI / 'LEIA-ME.md'
anterior = p.read_text().split('\n## A passagem H4-b\n')[0]
aviso = 'O registo abaixo conserva a primeira passagem. A entrega atual e as decisões da direção estão na secção «A passagem H4-b», no fim.'
if aviso not in anterior:
    linhas = anterior.splitlines()
    linhas[2:2] = [aviso, '']
    anterior = '\n'.join(linhas) + '\n'
p.write_text(anterior.rstrip() + '\n\n' + '\n'.join(texto))
print('A passagem H4-b foi gerada dos ficheiros de medição e dos códigos dos portões.')
