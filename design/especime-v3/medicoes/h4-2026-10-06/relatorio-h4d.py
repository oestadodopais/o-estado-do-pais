#!/usr/bin/env python3
"""Confere as provas finais e gera a secção H4-d sem transcrever medidas.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4d.py
"""
import hashlib
import json
from pathlib import Path
import re
import subprocess
from executar import limpar

AQUI = Path(__file__).resolve().parent
RAIZ = Path.cwd()
PARTIDA = '6a63145dd09444c09612374a37bcfaa41b590788'
COMANDO = 'python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4d.py'


def ler(f):
    return json.loads((AQUI / f).read_text())


def guardar(f, dados):
    (AQUI / f).write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')


def tabela(titulos, linhas):
    def celula(s):
        return str(s).replace('|', '&#124;').replace('\n', ' ')
    return ['| ' + ' | '.join(titulos) + ' |', '| ' + ' | '.join('---' for _ in titulos) + ' |'] + [
        '| ' + ' | '.join(celula(v) for v in linha) + ' |' for linha in linhas]


def numero(n):
    return str(n).replace('.', ',')


tentativa = RAIZ / '.claude/h4d/tentativa-vocabulario/portoes-d'
if tentativa.exists():
    guardar('primeira-corrida-d.json', {
        'cabeca': (tentativa / 'cabeca').read_text().strip(),
        'codigos': {g: int((tentativa / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']},
        'falha': next(l.strip() for l in (tentativa / 'verify.log').read_text().splitlines() if '✗ L3 ·' in l),
        'estado': 'substituída pela corrida verde de portoes-d; conservada como origem da H4-6',
    })
portoes = AQUI / 'portoes-d'
cabeca = (portoes / 'cabeca').read_text().strip()
assert cabeca == (portoes / 'cabeca.fim').read_text().strip()
assert cabeca == subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
codigos = {g: int((portoes / f'{g}.codigo').read_text()) for g in ['build', 'verify', 'typecheck']}
assert not any(codigos.values()), codigos
tm, politica, n1, cap, corridas = [ler(f) for f in ['tema-menu-d.json', 'plantas-politica-d.json', 'n1-d/plantas-portoes-h4b.json', 'capturas-d.json', 'corridas-d.json']]
for r in [tm, politica, cap]:
    assert r['cabeca'] == r['construcao']['commit'] == cabeca
assert corridas['cabeca'] == cabeca and not corridas['estado_inicial']
for r in corridas['corridas']:
    assert r['cabeca'] == cabeca and r['codigo'] == 0 and not r['estado_inicio'] and not r['estado_fim']
assert not politica['estado'] and not politica['estado_fim'] and not cap['estado']
assert not tm['falhas'] and not cap['erros'] and politica['passou']
assert all(p['mordeu'] and all(m['observada'] for m in p['mensagens']) for p in tm['plantas'])
assert all(p['passou'] for p in politica['plantas'])
l3 = ler('l3-d/plantas-portoes-h4d-l3.json')
for p in n1 + l3:
    assert p['cabeca'] == cabeca and not p['estado'] and p['codigo'] == 1 and p['passou']
    assert all(f['antes'] == f['reposto'] for f in p['ficheiros'])
    log = (AQUI / ('l3-d' if p in l3 else 'n1-d') / f"planta-{p['nome']}.log").read_text()
    assert all(re.search(m, log) for m in p['mordidas'])

resumos = {}
def conferir(f, sha):
    assert hashlib.sha256(Path(f).read_bytes()).hexdigest() == sha, f
    resumos[f] = sha

for p in cap['paginas']:
    conferir(p['copia'], p['sha256'])
    original = next(i for i in politica['intactas'] if i['lang'] == p['lang'])
    assert original['sha256'] == p['sha256'] and not original['falhas']
    for folha in p['folhas']:
        conferir('dist' + folha['ficheiro'], folha['sha256'])
for c in cap['capturas']:
    for f, h in [('ficheiro', 'sha256'), ('recorte', 'sha256_recorte'), ('cabecalho', 'sha256_cabecalho')]:
        conferir(c[f], c[h])
    assert not c['pedidos_externos'] and not c['medidas']['transbordo_menu']
    assert len(c['medidas']['portas']) == 7 and c['medidas']['lugares_ia'] == 3
assert {(c['lang'], c['largura']) for c in cap['capturas']} == {(l, w) for l in ['pt', 'en'] for w in [390, 768, 1024, 1280, 1600]}

# Conferências dos achados documentais, sem transformar comentários em testes de página.
fonte = Path('src/data/politica-ia.mjs').read_text()
portao = Path('scripts/lugares-ia-do-portao.mjs').read_text()
mapa = Path('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md').read_text()
strings = Path('src/i18n/strings.mjs').read_text()
inventario = Path('design/especime-v3/INVENTARIO-FRASES.md').read_text()
assert all('provisóri' not in s and 'redação do brief' not in s for s in [fonte, portao])
assert 'TM4 as seis portas numa linha de 390 px para cima; nove plantas' not in mapa
assert 'TM4 as sete portas' in mapa and 'vinte e oito plantas' in mapa
assert 'A exceção é o menu:' in strings and 'O rodapé e o título dizem o nome inteiro.' in strings
assert '| classe | texto | bloco | estado | razão |\n| --- | --- | --- | --- | --- |' in inventario.split('## H4 · os lugares da inteligência artificial')[1].split('\n## ')[0]

commits = [dict(zip(['cabeca', 'assunto'], l.split(' ', 1))) for l in subprocess.check_output(['git', 'log', '--reverse', '--format=%H %s', PARTIDA + '..' + cabeca], text=True).splitlines()]
for c in commits:
    mensagem = subprocess.check_output(['git', 'show', '-s', '--format=%B', c['cabeca']], text=True)
    assert mensagem.rstrip().endswith('Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>\nClaude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g')

critica = Path('design/especime-v3/critica/LEITURA-H4-2026-10-06.md').read_text()
achados = [int(n) for n in re.findall(r'^\*\*(\d+)\.', critica, re.M)]
tratamento = {}
for n in achados:
    if n <= 5:
        tratamento[n] = ['Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado.', 'Conservado o resultado da leitura a frio.']
    elif n in [7, 8]:
        tratamento[n] = ['Explicação EX1, reservada ao lugar de direção; texto intacto nesta passagem.', 'Fora do mandato H4-d, por decisão expressa.']
    elif n in [9, 10]:
        tratamento[n] = ['Decisões H4-1 e H4-5 reservadas à aterragem pelo lugar de direção; sem alteração.', 'A TM4 conserva os limites decididos.']
    else:
        tratamento[n] = {
            6: ['Referência independente do espaço e da letra na TM4; plantas específicas para cada proteção em falta.', 'Plantas novas e mensagens na tabela abaixo; o aperto da regra base exige as mensagens do espaço e da letra.'],
            11: ['Portões, plantas da política e da N1 e capturas do Método repetidos na cabeça do código. As plantas e capturas correm com git status --porcelain vazio.', 'Cabeça, estados inicial e final, códigos, mensagens e SHA-256 nos registos desta passagem.'],
            12: ['Comentários e mensagens dizem redação decidida (§1.173); o mapa descreve as portas, linhas e plantas atuais.', 'Conferência literal dos ficheiros; plantas da política verificam as mensagens atualizadas.'],
            13: ['O comentário regista a exceção do menu: o assunto União Europeia cabe; o nome inteiro da página permanece no título e rodapé.', 'Conferência do comentário; a N1 continua a recusar rótulo, ordem ou destino errados.'],
            14: ['A secção H4 do inventário tem cabeçalho e separador de tabela.', 'Conferência da estrutura da tabela e das frases vivas.'],
            15: ['A política permite Claude e Codex na construção e na leitura, sempre de famílias diferentes na mesma peça; Claude mantém a direção.', 'Plantas da divisão fixa antiga e da mesma família na construção e leitura, nas duas edições.'],
            16: ['Aplicada sem paráfrases a redação final em português e inglês, no texto público e na cópia independente do portão; inventário atualizado.', 'Plantas das palavras de oficina na direção e na construção, nas duas edições.'],
        }[n]
plantas_tm = [p for p in tm['plantas'] if p['mensagem_exigida'].startswith('TM4')]
nomes_anteriores = {p['nome'] for p in ler('tema-menu-c.json')['plantas']}
novas = [p for p in plantas_tm if p['nome'] not in nomes_anteriores]
resumo = {'comando': COMANDO, 'partida': PARTIDA, 'cabeca_codigo': cabeca, 'commits': commits, 'codigos': codigos,
          'achados': [{'achado': n, 'mudanca': tratamento[n][0], 'protecao': tratamento[n][1]} for n in achados],
          'contagens': {'plantas_tema_menu': len(tm['plantas']), 'plantas_tm4': len(plantas_tm), 'plantas_tm4_novas': len(novas), 'plantas_politica': len(politica['plantas']), 'plantas_n1': len(n1), 'plantas_l3': len(l3), 'capturas_metodo': len(cap['capturas'])},
          'questoes': [{'questao': 'H4-6', 'estado': 'fechada', 'decisao': 'A L3 aceita a palavra peça só nos blocos inteiros da redação aprovada dos lugares, dentro da política no Método; o teto mantém-se.'}],
          'referencia_menu': tm['referencia_menu'], 'limites_linhas_telefone': tm['limites_linhas_telefone'],
          'integridade_conferida': resumos, 'aceitacao_cumprida': True,
          'comando_portoes': 'sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-d'}
guardar('resumo-h4d.json', resumo)
texto = ['## A passagem H4-d', '',
         'A política do Método diz os lugares como são e explica o trabalho em palavras correntes, nas duas edições. A TM4 deixa de usar a folha fiscalizada como referência e passa a provar cada proteção em falta. As decisões do lugar de direção foram cumpridas; esta passagem fecha a construção do bloco.', '',
         f'Cabeça do código: `{cabeca}`. Secção gerada por `{COMANDO}` a partir dos resultados guardados. [Resumo e conferências](resumo-h4d.json).', '',
         '### O tratamento de cada achado', '']
texto += tabela(['Achado', 'O que mudou ou ficou reservado', 'Proteção e prova'], [[n, *tratamento[n]] for n in achados])
texto += ['', '### A TM4 e as plantas novas', '',
          f"A corrida dentro do `verify` fez {len(tm['plantas'])} plantas do tema e do menu, todas com a mensagem exigida; {len(plantas_tm)} são da TM4 e {len(novas)} são novas nesta passagem. Comando: `{tm['comando']}`. [Medições e plantas completas](tema-menu-d.json).", '',
          'A célula calcula o espaço pela largura da janela com os valores aprovados guardados nela própria. A referência já não se lê da folha servida nem da folha fonte. A planta da regra base altera apenas a resposta CSS ao navegador e exige ambas as mensagens, a do espaço e a da letra.', '']
texto += tabela(['Planta nova', 'Mensagem exigida', 'Mensagem observada'], [[p['nome'], m['exigida'], m['observada']] for p in novas for m in p['mensagens']])
texto += ['', 'As restantes plantas continuam no resultado completo, incluindo a porta a mais, o menu sem dobrar e o alvo de toque. Nenhuma planta da TM4 muda ficheiros da construção.', '',
          '### A política e a N1 na cabeça do código', '',
          f"A política fez {len(politica['plantas'])} plantas; a N1 fez {len(n1)}. Todas falharam pela mensagem esperada. A política trabalha em cópias na memória; a N1 repõe os ficheiros construídos byte a byte, com o mesmo resumo antes e depois. Os registos [das corridas](corridas-d.json), [da política](plantas-politica-d.json) e [da N1](n1-d/plantas-portoes-h4b.json) identificam a cabeça acima. O estado completo do Git estava vazio no início e no fim destas corridas.", '']
texto += tabela(['Edição', 'Planta da política', 'Mensagem observada e exigida'], [[p['lang'], p['nome'], p['mensagem']] for p in politica['plantas']])
texto += [''] + tabela(['Planta da N1', 'Código lido', 'Mensagens exigidas e encontradas no registo'], [[p['nome'], p['codigo'], '; '.join(p['mordidas'])] for p in n1])
texto += ['', '### H4-6: a palavra peça na política', '',
          'A [primeira corrida completa](primeira-corrida-d.json) recusou a redação decidida na L3: a palavra «peça» nos lugares descreve o que se encomenda, constrói e lê. A régua passa a aceitar essa palavra apenas nos blocos inteiros aprovados, dentro da política no Método. O teto fica intacto. A redação pública mantém-se exatamente como recebida. A H4-6 fica fechada por esta distinção de contexto.', '',
          f"As {len(l3)} plantas [da L3](l3-d/plantas-portoes-h4d-l3.json) correram na cabeça do código com a árvore limpa e repuseram cada ficheiro byte a byte. Cada uma exigiu a mensagem da L3 acima do teto.", '']
texto += tabela(['Planta da L3', 'Código lido', 'Mensagem exigida e encontrada'], [[p['nome'], p['codigo'], '; '.join(p['mordidas'])] for p in l3])
texto += ['', '### As capturas do Método', '',
          f"Foram refeitas {len(cap['capturas'])} capturas de página inteira, cada uma com o recorte dos lugares e do cabeçalho, nas duas edições. O menu novo está à vista. [Manifesto, medidas e SHA-256](capturas-d.json). As cópias do HTML em `paginas-d/` têm os mesmos resumos das páginas lidas pelas plantas da política. Comando: `{cap['comando']}`.", '']
texto += tabela(['Edição', 'Janela, px', 'Linhas do menu', 'Espaço, px', 'Letra', 'Página', 'Lugares', 'Cabeçalho'], [
    [c['lang'], c['largura'], c['medidas']['linhas'], numero(c['medidas']['gap']), c['medidas']['letra'],
     *[f"[captura](../../capturas/h4-2026-10-06/passagem-d/{Path(c[f]).name})" for f in ['ficheiro', 'recorte', 'cabecalho']]] for c in cap['capturas']])
texto += ['', '### Os commits e os portões inteiros', '', f"Comando pela tranca: `{resumo['comando_portoes']}`. A cabeça inicial e final dos portões é `{cabeca}`. Os códigos abaixo foram lidos dos ficheiros; os registos completos estão em `portoes-d/`.", '']
texto += tabela(['Portão', 'Código lido'], [[g, c] for g, c in codigos.items()])
texto += [''] + tabela(['Commit do código', 'Mudança'], [[f"`{c['cabeca']}`", c['assunto']] for c in commits])
texto += ['', 'O commit seguinte guarda apenas o relatório, as capturas e os registos das provas. A cabeça final é a desse commit; a cabeça do código é a conferida acima. Os caminhos locais foram substituídos antes de guardar os registos.', '',
          '### O que ficou por fazer e porquê', '',
          'Os achados do EX1 ficam com o lugar de direção, por decisão expressa. A leitura curta do diff por outra família e a aterragem continuam com o lugar de direção. Não se fez push. A questão nova H4-6 ficou fechada nesta passagem, com as plantas da L3. O custo total de tokens não é exposto nesta sessão; fica por ler no registo do lançador.', '']
p = AQUI / 'LEIA-ME.md'
anterior = p.read_text().split('\n## A passagem H4-d\n')[0]
anterior = anterior.replace('A entrega atual e o fecho da H4-5 estão na secção «A passagem H4-c», no fim.', 'A entrega atual está na secção «A passagem H4-d», no fim; os estados anteriores abaixo são históricos.')
p.write_text(anterior.rstrip() + '\n\n' + '\n'.join(texto))
for destino in re.findall(r'\]\(([^)]+)\)', p.read_text()):
    assert (AQUI / destino).exists(), destino
alterados = subprocess.check_output(['git', 'diff', '--name-only', PARTIDA], text=True).splitlines()
novos = subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard'], text=True).splitlines()
for nome in set(alterados + novos):
    f = Path(nome)
    if f.is_file():
        try:
            s = f.read_text()
        except UnicodeDecodeError:
            continue
        assert limpar(s) == s, f'Caminho local: {nome}'
print('H4-d: cabeças, estados limpos, códigos, mensagens, resumos, ligações e ausência de caminhos locais conferidos; relatório gerado.')
