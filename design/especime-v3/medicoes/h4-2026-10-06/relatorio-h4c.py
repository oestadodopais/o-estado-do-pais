#!/usr/bin/env python3
"""Gera a passagem H4-c a partir da decisão, das medidas e dos códigos dos portões.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4c.py
"""
import json
from pathlib import Path
import re
import subprocess

AQUI = Path(__file__).resolve().parent
COMANDO = 'python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4c.py'
BRIEF = 'design/observatorio/BRIEF-H4-o-menu-do-telefone-em-duas-linhas.md'
PARTIDA = 'c86015929c91280c07be98a07fae1ad66fc1dde6'


def ler(nome):
    return json.loads((AQUI / nome).read_text())


def guardar(nome, dados):
    (AQUI / nome).write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')


def n(valor):
    return str(valor).replace('.', ',')


def tabela(cabecalho, linhas):
    return ['| ' + ' | '.join(cabecalho) + ' |', '| ' + ' | '.join(['---'] * len(cabecalho)) + ' |'] + [
        '| ' + ' | '.join(str(v) for v in linha) + ' |' for linha in linhas]


menu = ler('menu-a-390.json')['depois']
tm = ler('tema-menu-c.json')
cap = ler('capturas-c.json')
portoes = AQUI / 'portoes-c'
cabeca = (portoes / 'cabeca').read_text().strip()
assert cabeca == (portoes / 'cabeca.fim').read_text().strip()
assert all(d['cabeca'] == d['construcao']['commit'] == cabeca for d in [menu, tm, cap])
codigos = {g: int((portoes / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']}
assert not any(codigos.values()) and not tm['falhas'] and not cap['erros'], 'A H4-c ainda não pode fechar.'
assert all(p['mordeu'] for p in tm['plantas'])
decisao = re.search(r'O menu do telefone segue a dobra natural.*?\(decidido a .*? pela H4-5\)\.', Path(BRIEF).read_text()).group()
guardar('decisoes-h4c.json', {'comando': COMANDO, 'fonte': BRIEF, 'questao': 'H4-5', 'estado': 'fechada', 'decisao': decisao})
commits = [dict(zip(['cabeca', 'assunto'], linha.split(' ', 1))) for linha in subprocess.check_output(
    ['git', 'log', '--reverse', '--format=%H %s', PARTIDA + '..' + cabeca], text=True).splitlines()]
alterados = subprocess.check_output(['git', 'diff', '--name-only', PARTIDA, cabeca, '--', 'src'], text=True).splitlines()
assert not alterados, 'A H4-c mudou o sítio e já não é apenas a decisão e a prova.'
plantas = [p for p in tm['plantas'] if p['mensagem_exigida'].startswith('TM4')]
medidas = [m for m in menu['medidas'] if str(m['largura']) in tm['limites_linhas_telefone']]
transbordos = [{'edicao': c['lang'], 'janela': c['largura'], 'documento': c['medidas']['documento']} for c in cap['capturas']
              if c['medidas']['documento'] > c['largura']]
resumo = {'comando': COMANDO, 'cabeca_codigo': cabeca, 'partida': PARTIDA, 'commits': commits, 'codigos': codigos,
          'comando_dos_commits': f"git log --reverse --format='%H %s' {PARTIDA}..{cabeca}",
          'comando_das_fontes': f'git diff --name-only {PARTIDA} {cabeca} -- src', 'fontes_alteradas': alterados,
          'limites_linhas_telefone': tm['limites_linhas_telefone'], 'medidas': medidas, 'plantas_tm4': plantas,
          'falhas_tm': tm['falhas'], 'capturas_novas': len(cap['capturas']), 'transbordos_documento': transbordos,
          'comando_dos_portoes': 'sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-c',
          'ambiente_dos_portoes': {'OEDP_TEMA_MENU_JSON': 'design/especime-v3/medicoes/h4-2026-10-06/tema-menu-c.json'}}
guardar('resumo-h4c.json', resumo)

texto = ['## A passagem H4-c', '',
         'A H4-5 está fechada. A construção cumpre a decisão e os portões inteiros terminaram sem falhas. A alteração é da regra de aceitação e da sua prova; o menu servido conserva a dobra natural, as portas e o nome inteiro da União da passagem anterior.', '',
         f'Cabeça do código: `{cabeca}`. Secção gerada por `{COMANDO}`, a partir dos ficheiros de medição e dos códigos. [Resumo e comandos](resumo-h4c.json).', '',
         '### A decisão', '', decisao, '',
         'A frase foi acrescentada ao ponto da TM4 no brief, num commit próprio. [Decisão lida do brief](decisoes-h4c.json).', '',
         '### As medidas do menu por largura', '',
         f"Comando: `{menu['comando']}`. A fase `depois` de [menu-a-390.json](menu-a-390.json) contém as caixas de todas as portas, a posição da última, as capturas e os SHA-256. A fase anterior está conservada em `depois_h4b`; as imagens anteriores mantêm os seus ficheiros.", '']
texto += tabela(['Edição', 'Janela, px', 'Portas', 'Coluna, px', 'Largura natural, px', 'Linhas', 'Máximo', 'Espaço, px', 'Letra', 'Menor alvo, px', 'Sem transbordo'], [
    [m['lang'], m['largura'], m['portas'], n(m['coluna']), n(m['natural']), m['linhas'], tm['limites_linhas_telefone'][str(m['largura'])],
     n(m['gap']), m['letra'], n(min(c['altura'] for c in m['caixas'])), 'sim' if m['sem_transbordo'] else 'não'] for m in medidas])
texto += ['', 'O espaço entre vizinhas e a letra são comparados com a regra base resolvida pelo navegador nessa largura, incluindo o espaço das letras. As caixas e as folgas das duas medições são conferidas uma contra a outra pelo guião do pacote.', '',
          '### As plantas e as mensagens', '',
          f"Comando da célula e das plantas, executado dentro do `verify`: `{tm['comando']}`. [Resultados completos](tema-menu-c.json).", '']
texto += tabela(['Planta', 'Mensagem observada e exigida', 'Resultado'], [[p['nome'], p['queixa'], 'mordeu' if p['mordeu'] else 'não mordeu'] for p in plantas])
texto += ['', 'A planta nova serve ao navegador a regra base com um espaço maior e exige a mensagem da quarta linha. As outras plantas ficam. Nenhuma delas altera a folha fonte nem os ficheiros construídos.', '',
          '### As capturas acrescentadas', '',
          f"Comando: `{cap['comando']}`. [Manifesto com medidas e SHA-256](capturas-c.json). As páginas construídas estão em `paginas-c/`.", '']
texto += tabela(['Edição', 'Janela, px', 'Página', 'Menu'], [
    [c['lang'], c['largura'], f"[captura](../../capturas/h4-2026-10-06/{Path(c['ficheiro']).name})", f"[recorte](../../capturas/h4-2026-10-06/{Path(c['recorte']).name})"] for c in cap['capturas']])
if transbordos:
    texto += ['', 'O transbordo do documento que a passagem anterior já separava do menu continua medido. Nenhuma porta sai da janela. As fontes do sítio não mudaram nesta passagem; o ajuste desse transbordo do corpo fica fora deste mandato.', '']
    texto += tabela(['Edição', 'Janela, px', 'Documento, px'], [[t['edicao'], t['janela'], t['documento']] for t in transbordos])
texto += ['', 'Conferência: `python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py --passagem-c`. O guião confere a cabeça, os códigos, as medidas, as plantas, os resumos das capturas novas e anteriores, as páginas, as folhas e as ligações, e procura caminhos locais. [Resultado](conferencia-pacote-c.json).', '',
          '### O que fica por fazer', '',
          'A construção pedida nesta passagem está concluída e a H4-5 fechada. A leitura a frio por outra família e a conferência antes da aterragem continuam com o lugar de direção, como já estava registado na H4-4. Não se fez push. Não surgiu uma questão nova. O custo em tokens não foi exposto pela ferramenta e fica por ler pelo lançador.', '',
          '### Os commits e os portões inteiros', '', 'Commits lidos do Git, guardados no resumo:']
for c in commits:
    texto += ['', f"- `{c['cabeca']}`: {c['assunto']}."]
texto += ['', f'Cabeça do código, lida de `portoes-c/cabeca` e `portoes-c/cabeca.fim`: `{cabeca}`. O commit seguinte contém só o relatório e as provas.', '',
          f"Comando pela tranca: `{resumo['comando_dos_portoes']}`. A variável `OEDP_TEMA_MENU_JSON` guarda a prova da TM4 durante o próprio `verify`.", '']
texto += tabela(['Portão', 'Código lido do ficheiro'], [[g, c] for g, c in codigos.items()])
texto += ['', 'Os registos completos, os códigos e as datas estão em `portoes-c/`. Os caminhos locais dos registos foram substituídos antes de guardar o pacote. A cabeça final é a do commit das provas; a corrida pertence à cabeça do código acima.', '']
p = AQUI / 'LEIA-ME.md'
anterior = p.read_text().split('\n## A passagem H4-c\n')[0]
anterior = anterior.replace('O registo abaixo conserva a primeira passagem. A entrega atual e as decisões da direção estão na secção «A passagem H4-b», no fim.',
                            'O registo abaixo conserva as passagens anteriores. A entrega atual e o fecho da H4-5 estão na secção «A passagem H4-c», no fim.')
p.write_text(anterior.rstrip() + '\n\n' + '\n'.join(texto))
print('A passagem H4-c foi gerada dos ficheiros de medição e dos códigos dos portões.')
