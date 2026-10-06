#!/usr/bin/env python3
"""Confere as provas da passagem H4-e e gera (ou substitui) a sua secção no LEIA-ME sem transcrever medidas.
As provas são as do correr-h4e.py (as plantas da política e da N1, as capturas) e os códigos das conferências
que a mudança toca, corridas na cabeça do código; os portões inteiros correm na corrida portão do GitHub.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py
"""
import json
import re
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = Path.cwd()
PARTIDA = '81e3de312659a57e5c90310a1dd8a84913c6318e'
COMANDO = 'python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py'
REL = AQUI.relative_to(RAIZ)


def ler(f):
    return json.loads((AQUI / f).read_text())


def tabela(titulos, linhas):
    def celula(s):
        return str(s).replace('|', '&#124;').replace('\n', ' ')
    return ['| ' + ' | '.join(titulos) + ' |', '| ' + ' | '.join('---' for _ in titulos) + ' |'] + [
        '| ' + ' | '.join(celula(v) for v in linha) + ' |' for linha in linhas]


corridas = ler('corridas-e.json')
cabeca = corridas['cabeca']
assert not corridas['estado_inicial']
for r in corridas['corridas']:
    assert r['cabeca'] == cabeca and r['codigo'] == 0 and not r['estado_inicio'] and not r['estado_fim'], r['nome']
politica, cap = ler('plantas-politica-e.json'), ler('capturas-e.json')
for r in [politica, cap]:
    assert r['cabeca'] == r['construcao']['commit'] == cabeca
assert not politica['estado'] and not politica['estado_fim'] and not cap['estado'] and not cap['erros']
assert politica['passou'] and all(p['passou'] for p in politica['plantas'])
n1 = ler('n1-e/plantas-portoes-h4b.json')
for p in n1:
    assert p['cabeca'] == cabeca and not p['estado'] and p['codigo'] == 1 and p['passou']
    assert all(f['antes'] == f['reposto'] for f in p['ficheiros'])
    log = (AQUI / 'n1-e' / f"planta-{p['nome']}.log").read_text()
    assert all(re.search(m, log) for m in p['mordidas'])
conferencias = {}
for f in sorted((AQUI / 'conferencias-e').glob('*.codigo')):
    conferencias[f.stem] = int(f.read_text().strip())
    assert (AQUI / 'conferencias-e' / f'{f.stem}.cabeca').read_text().strip() == cabeca, f.stem
assert conferencias and not any(conferencias.values()), conferencias
FIM_DO_CODIGO = 'd81471b7'  # o último commit do código da H4-e no ramo h4-2026-10-06; as provas correm na cabeça do ramo de integração
commits = subprocess.check_output(['git', 'log', '--format=%H\t%s', f'{PARTIDA}..{FIM_DO_CODIGO}'], text=True).strip().split('\n')

linhas = ['## A passagem H4-e', '',
          'A redação dos três papéis é do lugar de direção, reescrita depois da leitura curta do diff da H4-d '
          '(`design/especime-v3/critica/LEITURA-H4-d-2026-10-06.md`, o achado 3 e o 7): sem «peça» nem «lugares», '
          'a regra das famílias dita uma vez só, e o que a construção faz com cada número (a fonte e a data) distinguido '
          'do que a leitura faz com o que foi construído. A exceção H4-6 da L3 e as suas quatro plantas saíram com a palavra. '
          'Como a redação é de um modelo Claude, a leitura dela é do Codex, a outra família: a primeira leitura '
          '(`design/especime-v3/critica/LEITURA-H4-e-codex-2026-10-06.md`) mordeu as cinco plantas e achou que a regra 9 do Método '
          '(«A intervenção humana») ainda dizia que a direção é de uma pessoa que escolhe o que se publica, contra a secção dos papéis '
          'e contra a §1.112; a regra passou a dizer que a direção é de um modelo, que decide o que se publica dentro das regras e das '
          'recusas que uma pessoa com nome define, e que é essa pessoa que responde; os guiões das provas passaram a registar os seus '
          'próprios nomes. As provas abaixo são as da cabeça com essas duas mudanças.', '',
          f'Cabeça do código: `{cabeca}`. Secção gerada por `{COMANDO}` a partir dos resultados guardados. '
          'Os portões inteiros desta cabeça correm na corrida portão do GitHub, e não na máquina; aqui correram as '
          'conferências que a mudança toca, cada uma no seu comando com o código lido de um ficheiro.', '',
          '### As conferências que a mudança toca', '']
linhas += tabela(['Conferência', 'Código lido'], [(k, v) for k, v in conferencias.items()])
linhas += ['', '### As plantas da política e da N1 na cabeça do código', '',
           f"A política fez {len(politica['plantas'])} plantas; a N1 fez {len(n1)}. Todas falharam pela mensagem esperada; "
           'a política trabalha em cópias na memória, e a N1 repõe os ficheiros construídos byte a byte. '
           f"Comandos: `{politica['comando']}` e `{[r['comando'] for r in corridas['corridas'] if r['nome'] == 'n1-e'][0]}`.", '']
linhas += tabela(['Edição', 'Planta da política', 'Mensagem observada e exigida'], [(p['lang'], p['nome'], p['mensagem']) for p in politica['plantas']])
linhas += ['']
linhas += tabela(['Planta da N1', 'Código lido', 'Mensagens exigidas e encontradas no registo'], [(p['nome'], p['codigo'], '; '.join(p['mordidas'])) for p in n1])
linhas += ['', '### As capturas do Método', '',
           f"Foram refeitas {len(cap['capturas'])} capturas de página inteira, cada uma com o recorte dos papéis e do cabeçalho, nas duas edições. "
           f"[Manifesto, medidas e SHA-256](capturas-e.json). Comando: `{cap['comando']}`.", '']
def liga(f):
    return f"[captura](../../{Path(f).relative_to('design/especime-v3')})"
linhas += tabela(['Edição', 'Janela, px', 'Página', 'Papéis', 'Cabeçalho'], [(c['lang'], c['largura'], liga(c['ficheiro']), liga(c['recorte']), liga(c['cabecalho'])) for c in cap['capturas']])
linhas += ['', '### Os commits da passagem', '', f'Os commits do código da H4-e, no ramo `h4-2026-10-06`, de `{PARTIDA[:8]}` a `{FIM_DO_CODIGO}`; as provas desta secção correram na cabeça `{cabeca[:8]}` do ramo de integração, que funde o H4 com o M-A e o EX2.', '']
linhas += tabela(['Commit', 'Mudança'], [(f'`{h}`', s) for h, s in (c.split('\t', 1) for c in commits)])
linhas += ['', 'O commit seguinte guarda apenas esta secção, as capturas e os registos das provas; a cabeça do código é a conferida acima.', '']
secao = '\n'.join(linhas)
leia = AQUI / 'LEIA-ME.md'
t = leia.read_text()
i = t.find('\n## A passagem H4-e')
t = (t[:i + 1] if i >= 0 else t.rstrip('\n') + '\n\n') + secao
leia.write_text(t)
print(f'Secção H4-e escrita: {len(politica["plantas"])} plantas da política, {len(n1)} da N1, {len(cap["capturas"])} capturas, {len(conferencias)} conferências, {len(commits)} commits.')
