#!/usr/bin/env python3
"""H4: relatório composto dos ficheiros escritos pelos guiões, sem números copiados.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4.py
"""
import json
from pathlib import Path
import subprocess

AQUI = Path(__file__).resolve().parent

def ler(nome):
    p = AQUI / nome
    return json.loads(p.read_text()) if p.exists() else None

def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()

def n(x):
    return str(x).replace('.', ',')

base = ler('menu-a-390.json')
final = ler('menu-depois.json')
plantas = ler('plantas-politica.json')
capturas = ler('capturas.json')
texto = ['# H4 · a medição do menu e os lugares da inteligência artificial', '',
         'Construção por Codex gpt-6-astra. Texto provisório do brief; a redação final e a leitura a frio continuam por confirmar antes de aterrar.', '',
         '## O que mudou e onde parou', '',
         'A política no Método passa a dizer a direção e a leitura pelos modelos Claude, e a construção pelo Codex, incluindo o motor. Sai o lugar da medição, que não foi exercido. O inventário conserva as frases antigas como retiradas e declara as novas; o portão de HTML confere a lista, a introdução e o fecho nas duas edições.', '',
         'O menu, as suas etiquetas e a TM4 ficaram por alterar. A medição confirmou a viabilidade das portas e do nome inteiro, mas encontrou uma contradição entre o espaço igual ao medido na outra largura e o mesmo `clamp`. O mandato manda parar no ponto em que o brief diverge da medição. As propostas abaixo são ensaios no navegador, não uma alteração entregue.', '',
         '## O menu medido antes de construir', '',
         f"Construção de partida: `{base['construcao']['commit']}`. Comando: `{base['comando']}`. Medidas completas, caixas de cada porta, última porta e resumos das capturas em [menu-a-390.json](menu-a-390.json).", '',
         '| Edição | Janela, px | Forma | Portas | Coluna, px | Largura natural, px | Linhas | Espaço, px | Letra | Sem transbordo |',
         '| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |']
for m in base['medidas']:
    texto.append(f"| {m['lang']} | {m['largura']} | {m['forma']} | {m['portas']} | {n(m['coluna'])} | {n(m['natural'])} | {m['linhas']} | {n(m['gap'])} | {m['letra']} | {'sim' if m['sem_transbordo'] else 'não'} |")
texto += ['', 'A proposta usa o `clamp` do brief. A forma `proposta-espaco-768` ensaia o mesmo espaço numérico da largura de referência. O nome inteiro cabe nas duas interpretações na largura de aceitação, nas duas edições. Na janela mais estreita a fila dobra mais uma vez, sem cortar nenhuma porta.', '',
          '## Capturas e páginas construídas', '']
if capturas:
    texto += [f"Comando: `{capturas['comando']}`. Cabeça da construção: `{capturas['cabeca']}`. [Manifesto com os resumos SHA-256](capturas.json).", '',
              '| Página | Edição | Janela, px | Captura | Recorte |', '| --- | --- | ---: | --- | --- |']
    for c in capturas['capturas']:
        # A pasta das capturas é irmã da pasta das medições.
        caminho = '../../../capturas/h4-2026-10-06/'
        texto.append(f"| {c['familia']} | {c['lang']} | {c['largura']} | [página]({caminho}{Path(c['ficheiro']).name}) | [pormenor]({caminho}{Path(c['recorte']).name}) |")
    texto += ['', 'As cópias do HTML para a leitura estão em `paginas/`; o manifesto identifica as páginas e as folhas da mesma construção. Os ficheiros de antes mostram ensaios, os ficheiros sem esse prefixo mostram o código entregue.']
else:
    texto += ['Capturas finais por recolher; as do ensaio do menu estão identificadas em `menu-a-390.json`.']
texto += ['', '## As plantas e a mensagem que cada uma exige', '',
          'A célula dos lugares é a mesma que o `gate:html` chama. Cada planta parte de uma cópia em memória de uma página construída que passou intacta. Os resumos provam que o HTML em disco não mudou. A TM4 não foi alterada nem se declara provada uma forma nova do menu.', '',
          '| Edição | Planta | Mensagem exigida | Resultado |', '| --- | --- | --- | --- |']
if plantas:
    for p in plantas['plantas']:
        texto.append(f"| {p['lang']} | {p['nome']} | {p['mensagem']} | {'mordeu' if p['passou'] else 'falhou'} |")
texto += ['', 'Comando e resultados em [plantas-politica.json](plantas-politica.json).', '', '## Os portões', '']
portoes = AQUI / 'portoes'
cabeca_codigo = (portoes / 'cabeca').read_text().strip() if (portoes / 'cabeca').exists() else None
if cabeca_codigo:
    texto += [f'Cabeça do código medida: `{cabeca_codigo}`.', '']
texto += ['Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes`.', '', '| Portão | Código lido do ficheiro |', '| --- | ---: |']
for g in ['build', 'verify', 'typecheck']:
    f = portoes / f'{g}.codigo'
    texto.append(f"| {g} | {f.read_text().strip() if f.exists() else 'por correr'} |")
texto += ['', 'O `check:series` corre só sobre a parte do sítio, sem motor, conforme o mandato. Os registos são limpos dos caminhos locais antes de entrar no repositório.', '',
          '## Questões abertas', '',
          '- **H4-1.** O §2 pede o mesmo espaço medido na largura de referência; o §3 pede o mesmo `clamp`. A tabela mostra que são resultados diferentes. O menu, a sétima porta, o nome inteiro e a TM4 ficam parados até a direção escolher qual exigência vale. Nenhuma das propostas muda a letra das larguras maiores.',
          '- **H4-2.** `/sobre/politica-ia` não existe na tabela das rotas. A política vive em `' + base['politica']['rotas']['pt'] + '` e `' + base['politica']['rotas']['en'] + '`. Não se criou uma rota nova. As capturas do Método, quando presentes, identificam o endereço efetivo e a secção.',
          '- **H4-3.** O texto dos lugares é o provisório do brief, §3, ponto 4. Falta a confirmação da redação pela direção antes de aterrar. A mudança fica no último commit de código, isolada do menu.',
          '- **H4-4.** Falta a leitura a frio pelo Claude Opus, com os estragos nas cópias do pacote, e a conferência da entrega pelo lugar de direção. As plantas do construtor não substituem essa leitura.', '',
          '## Commits e custo', '',
          'Commits lidos do Git no momento de gerar este relatório:', '']
for linha in git('log', '--reverse', '--format=%H %s', '207d7134..HEAD').splitlines():
    sha, assunto = linha.split(' ', 1)
    texto.append(f'- `{sha}`: {assunto}.')
texto += ['', 'A cabeça final é a do commit que guarda este relatório e os códigos. A cabeça do código está no ficheiro `portoes/cabeca`; não se atribui a corrida ao commit posterior das provas.', '',
          'A ferramenta desta sessão não expôs uma linha `tokens used`; o custo em tokens fica por medir pelo lançador. Não se estima a partir das percentagens de uso.', '']
(AQUI / 'LEIA-ME.md').write_text('\n'.join(texto))
print('LEIA-ME.md gerado dos ficheiros de medição e do Git.')
