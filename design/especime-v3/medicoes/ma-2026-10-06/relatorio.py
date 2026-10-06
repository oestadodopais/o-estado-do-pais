#!/usr/bin/env python3
"""Gera o relatório M-A-b exclusivamente das corridas e plantas conservadas.

Uso: python3 design/especime-v3/medicoes/ma-2026-10-06/relatorio.py
A coluna antes exige a cabeça do brief e uma árvore limpa. Os tempos, códigos,
contagens e mensagens são relidos; nenhuma execução é inferida do package.json.
"""
from collections import Counter
import gzip
import hashlib
import html
import json
import re
from pathlib import Path
import subprocess

P = Path(__file__).resolve().parent
RAIZ = P.parents[3]


def ler(caminho):
    dados = caminho.read_bytes()
    return json.loads(gzip.decompress(dados) if caminho.suffix == '.gz' else dados)


def guardar(nome, objeto):
    (P / nome).write_text(json.dumps(objeto, ensure_ascii=False, indent=2) + '\n')


def git(*args):
    return subprocess.check_output(['git', '-C', str(RAIZ), *args], text=True).strip()


def segundos(valor):
    return 'não medido' if valor is None else f'{valor:.3f}'.replace('.', ',')


def celula(texto):
    return html.escape(str(texto), quote=False).replace('|', '&#124;').replace('\n', '<br>')


def principal():
    nomes = ['antes', 'portoes', 'portoes-antigo', 'portoes-b']
    tempos = {nome: ler(P / nome / 'tempos.json') for nome in nomes}
    codigos = {nome: {g: int((P / nome / (g + '.codigo')).read_text())
                      for g in ('build', 'verify', 'typecheck')} for nome in nomes}
    for nome in nomes:
        assert all(c == 0 for c in codigos[nome].values()), f'{nome}: portão vermelho'
        for ficheiro in ('cabeca', 'cabeca.fim'):
            assert (P / nome / ficheiro).read_text().strip() == tempos[nome]['cabeca']
        assert all(p['codigo'] == 0 for p in tempos[nome]['passos']), nome
    assert tempos['antes']['cabeca'] == git('rev-parse', '207d7134')
    assert (P / 'antes/estado.inicio').read_bytes() == b''
    assert (P / 'antes/estado.fim').read_bytes() == b''
    assert (P / 'antes/portoes.sh').read_bytes() == subprocess.check_output(
        ['git', '-C', str(RAIZ), 'show', '207d7134:scripts/leituras/portoes.sh'])
    head = tempos['portoes-b']['cabeca']
    assert not git('diff', '--name-only', 'beb1e37d', head, '--', '.github/workflows/portao.yml', 'src', 'public', 'ledger')
    medidas = {}
    comandos = [('build', 'cadeia:build'), ('verify', 'cadeia:verify'),
                ('check:briefs', 'npm run check:briefs'), ('check:leituras', 'npm run check:leituras'),
                ('check:alvos', 'npm run check:alvos'), ('auto-teste do país', 'auto-teste:pais'),
                ('typecheck', 'npm run typecheck')]
    for nome, corrida in tempos.items():
        medidas[nome] = {'corrida inteira': corrida['segundos']}
        for rotulo, comando in comandos:
            entradas = [p for p in corrida['passos'] if p['passo'] == comando]
            medidas[nome][rotulo] = sum(p['segundos'] for p in entradas) if entradas else None
    assert medidas['portoes-b']['check:leituras'] is not None, 'Falta o tempo do check:leituras.'
    listas = {nome: Counter(p['passo'] for p in t['passos'] if not p['passo'].startswith('cadeia:')
                           and p['passo'] not in ('auto-teste:pais', 'npm run check:pais:auto-teste'))
              for nome, t in tempos.items()}
    perdidas = sorted(set(listas['antes']) - set(listas['portoes-b']))
    acrescentadas = sorted(set(listas['portoes-b']) - set(listas['antes']))
    assert not perdidas, perdidas
    runner = ler(P / 'portoes-b/verify.json')
    assert runner['ok'] and all(c['ok'] for c in runner['celulas'].values())
    leituras = ler(P / 'plantas-b/check-leituras.json')
    assert leituras['ok'] and all(g['codigo'] == 0 for g in leituras['guioes'])
    mapa_texto = (P / 'plantas-b/mapa.log').read_text()
    mapa = {chave: int(re.search(padrao, mapa_texto).group(1)) for chave, padrao in {
        'longe': r'longe da linha citada: (\d+)',
        'por_encontrar': r'citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)',
        'fora': r'linha citada para lá do fim do ficheiro: (\d+)'}.items()}
    assert not any(mapa.values()), mapa
    plantas = []
    for guiao in leituras['guioes']:
        try:
            dados = json.loads(guiao['saida'])
        except json.JSONDecodeError:
            plantas.append({'ficheiro': 'plantas-b/check-leituras.json', 'guiao': guiao['guiao'], 'nome': 'controlo da instrumentação',
                            'mensagens': [guiao['saida'].strip()]})
            continue
        for caso in dados['casos']:
            mensagens = caso.get('mensagens') or [caso.get('mensagem') or caso.get('queixa') or 'Condição afirmada pelo ensaio; controlo verde.']
            plantas.append({'ficheiro': 'plantas-b/check-leituras.json', 'guiao': guiao['guiao'], 'nome': caso.get('planta') or caso.get('nome'), 'mensagens': mensagens})
    for caso in ler(P / 'plantas-b/e1-h2c.json')['casos']:
        plantas.append({'ficheiro': 'plantas-b/e1-h2c.json', 'nome': caso['nome'],
                        'mensagens': caso.get('queixas_e1') or ['Controlo sem queixa E1.']})
    for caso in runner['plantas']:
        plantas.append({'ficheiro': 'portoes-b/verify.json', 'nome': caso['planta'],
                        'mensagens': caso.get('falhas') or ['Controlo verde, condição afirmada pelo ensaio.']})
    alvos = ler(P / 'portoes-b/alvos.json.gz')
    alvos_antes = ler(P / 'antes/alvos.json.gz')
    comparacao_alvos = {k: alvos_antes[k] == alvos[k] for k in
                       ('rotas', 'larguras', 'celulas', 'axe', 'graves', 'alvos_maus')}
    assert all(comparacao_alvos.values()), comparacao_alvos
    observacao = ler(P / 'antes/paginas-observadas.json.gz')
    fonte_original = subprocess.check_output(['git', '-C', str(RAIZ), 'show', '207d7134:tests/acessibilidade/alvos.mjs'])
    assert observacao['origem_sha256'] == hashlib.sha256(fonte_original).hexdigest()
    assert int((P / 'antes/observacao-alvos.codigo').read_text()) == 0
    assert (P / 'antes/estado.depois-da-observacao').read_bytes() == b''
    assert observacao['paginas'] == alvos['paginas'], 'As páginas dos alvos divergiram.'
    for caso in alvos['plantas_da_espera']:
        assert caso['mordeu'] and caso['folha_servida']
        plantas.append({'ficheiro': 'portoes-b/alvos.json.gz', 'nome': caso['nome'],
                        'mensagens': [caso['celula'] + ': ' + caso['mensagem']]})
    guardar('plantas-b.json', plantas)
    resumo = {'base': tempos['antes']['cabeca'], 'cabeca_do_codigo': head, 'codigos': codigos,
              'medidas': medidas, 'segundos_apresentados': {n: {k: round(v, 3) if v is not None else None
                                                               for k, v in m.items()} for n, m in medidas.items()},
              'conferencias_perdidas': perdidas, 'conferencias_acrescentadas': acrescentadas,
              'conferencias_antes': len(listas['antes']), 'conferencias_depois': len(listas['portoes-b']),
              'guioes_de_leituras': len(leituras['guioes']), 'plantas_e_controlos': len(plantas),
              'alvos_comparaveis_iguais': comparacao_alvos, 'paginas_dos_alvos_iguais': True, 'passagens_alvos': len(observacao['paginas']), 'mapa': mapa, 'uniao': runner['celulas']['U'], 'menos_de_12_minutos': tempos['portoes-b']['segundos'] < 720}
    guardar('resumo.json', resumo)
    guardar('conferencias.json', listas)
    linhas = ['# M-A · maquinaria medida, com a proteção conferida', '', '## A passagem M-A-b', '',
              f'Cabeça do código: `{head}`. Cabeça do brief e do «antes» limpo: `{resumo["base"]}`. A cabeça final é o commit que junta este relatório e as provas, indicado na resposta de entrega.', '',
              'A passagem põe as plantas na cadeia, obriga o GitHub a executar os guiões dos briefs e fecha as falhas da maquinaria apontadas pela leitura a frio. O pacote entregue à primeira leitura foi montado pelo caminho antigo, com registos inteiros; não foi uma utilização real do filtro de citações novo.', '',
              '## Tempos e método', '',
              f'A corrida inteira nova levou {segundos(medidas["portoes-b"]["corrida inteira"])} s; o «antes» limpo levou {segundos(medidas["antes"]["corrida inteira"])} s. O check:leituras levou {segundos(medidas["portoes-b"]["check:leituras"])} s, na própria corrida final.', '',
              '| Medida, em segundos | Antes limpo | Primeira passagem, novo | Primeira passagem, antigo | M-A-b |',
              '|---|---:|---:|---:|---:|']
    for rotulo in medidas['antes']:
        linhas.append('| ' + rotulo + ' | ' + ' | '.join(segundos(medidas[n][rotulo]) for n in nomes) + ' |')
    linhas += ['', 'Fontes: os `tempos.json` das pastas indicadas nas colunas. As colunas da primeira passagem são históricas e conservam a cabeça escrita nesses ficheiros. O «antes» foi refeito numa worktree temporária de `207d7134`, com o `portoes.sh` dessa cabeça, pela tranca comum, e `estado.inicio` e `estado.fim` vazios. A instrumentação ficou fora da árvore; a shell só acrescentou a opção de saída JSON ao guião dos alvos. O auto-teste interno dessa cabeça não tinha relógio próprio, pelo que o seu tempo fica incluído no `check:pais` e não é inventado em separado.', '',
               'A duração inteira é o intervalo entre o primeiro e o último processo instrumentado, não a soma das durações paralelas. A espera pela tranca não entra. Durante as medições esta sessão não lançou outras conferências. O motor foi passado por `RESEARCHHUB_DIR=<motor>` em leitura. A worktree temporária foi removida depois da conferência do estado limpo.', '',
               ('A corrida final cumpre o teto de doze minutos.' if resumo['menos_de_12_minutos'] else 'A corrida final não cumpre o teto de doze minutos; o limite de tempo fica declarado, sem alterar uma proteção para o cumprir.'), '',
               '## Códigos lidos dos ficheiros', '', '| Corrida | build.codigo | verify.codigo | typecheck.codigo |', '|---|---:|---:|---:|']
    linhas += ['| ' + n + ' | ' + ' | '.join(str(v) for v in codigos[n].values()) + ' |' for n in nomes]
    linhas += ['', 'As cabeças de entrada e saída são iguais em cada corrida. O workflow não mudou nesta passagem. A célula U confirmou a cobertura, D a ausência de escritas durante o verify, e C a cabeça da construção.', '', '## O que mudou por achado', '',
               '| Achado | Mudança | Planta que o protege |', '|---|---|---|',
               '| `1` | Estrago só na cópia; a U já recusava passos ausentes. | Conferência retirada da escolha fecha U. |',
               '| `2` | Estrago só na cópia; a aterragem já parava com o check-run vermelho. | Sem check e check vermelho param antes de publicar, com comandos substituídos. |',
               '| `3` | Estrago só na cópia; o selo já incluía o sha256 do guião. | Mudança do guião provoca reexecução. |',
               '| `4` | Estrago só na cópia; a interrupção já estava ligada. A planta foi alargada pelo achado 9. | TERM depois de tomar a tranca para e liberta. |',
               '| `5` | Estrago só na cópia; a tabela tinha o valor dos ficheiros. | O gerador relê os tempos e os códigos. |',
               '| `6` | `check:leituras` descobre todos os guiões Python da pasta e entra no verify e no GitHub. O ambiente dos processos sintéticos fica isolado do relógio real. | Cada guião afirma o código e a mensagem; a cadeia fica vermelha se qualquer um falhar. |',
               '| `7` | Só `--escrever-presos` grava, depois de todos os guiões correrem verdes nessa invocação, com cabeça, hora, invocação e identificador. CI ignora selos; a saída e o mapa dizem a regra. | Selo manual recusado; gravação reexecuta; corrida vermelha não sela; cada variável de CI força execução. |',
               '| `8` | O «antes» foi substituído por uma corrida limpa na cabeça do brief. | O gerador exige estados vazios, cabeças iguais e bytes do portoes.sh iguais ao objeto Git. |',
               '| `9` | A tranca caduca pela regra da M46 e a espera imprime o dono. TERM termina o grupo do portão antes de soltar a tranca. | Tranca ocupada conservada; caducada substituída; TERM depois de tomada para a corrida e solta a tranca. |',
               '| `10` | A limpeza cobre pastas temporárias e o scratchpad; só substitui o utilizador como componente de caminho. | Temporários; palavra comum intacta; texto e gzip; idempotência; binários e ligações. |',
               '| `11` | A conferência relê o relatório e o ficheiro entregue, com extração independente das citações. | Uma linha apagada durante a escrita fecha a montagem pelo fluxo normal. |',
               '| `12` | Registos reduzidos ou omitidos são ditos com os tamanhos; `PACOTE_LOGS=inteiros` conserva-os completos. | Aviso e tamanhos conferidos; registos citados e sem citação chegam byte a byte no modo inteiro. |',
               '| `13` | A opção chama-se `--so-a-celula-e1-no-autoteste`; a mensagem verde vive dentro da chamada E1. | Prazo, razão e retirada da chamada; opção plantada no guião check:pais do package.json recusada. |',
               '| `14` | A guarda reconhece partes de tempos e apaga-as antes de qualquer relógio novo. | Pasta com partes de corrida morta é recusada, sem as misturar noutra corrida. |',
               '| `15` | Contadores nulos ou ausentes conservam null; a regressão compara o último valor conhecido. | Nulo sem TypeError; campo ausente; regressão depois de null. |',
               '| `16` | A lista do mapa foi lida da cadeia inteira, incluindo o auto-teste do país e as leituras; as referências foram acertadas. | `conferir-mapa.py`, com o resultado conservado em plantas-b. |',
               '| Code | `soltar_a_tranca`; chave falhas única; limpador e custos em funções legíveis; globais da espera repostos em finally; imports e comentário E1; regra dos logs no cabeçalho do pacote. | As mesmas plantas, as plantas da espera e os portões finais. |', '',
               '## Cobertura observada', '',
               f'O mapa ficou com {mapa["longe"]} citações longe, {mapa["por_encontrar"]} por encontrar e {mapa["fora"]} referências para lá do fim, lidas de plantas-b/mapa.log. Foram observados {len(listas["antes"])} comandos distintos no «antes» e {len(listas["portoes-b"])} na corrida nova, sem retirar comandos. O auto-teste que antes estava dentro do check:pais aparece agora como passo próprio; fica fora desta contagem de comandos para a comparação não o contar duas vezes. O check:leituras correu {len(leituras["guioes"])} guiões.', '',
               '| Comando | Antes, execuções | M-A-b, execuções |', '|---|---:|---:|']
    linhas += ['| `' + c + '` | ' + str(listas['antes'][c]) + ' | ' + str(listas['portoes-b'][c]) + ' |'
               for c in sorted(set(listas['antes']) | set(listas['portoes-b']))]
    linhas += ['', '## Plantas e mensagens', '', 'As mensagens vêm dos ficheiros das plantas, relidos pelo gerador. Os controlos sem queixa são assinalados como tal.', '',
               '| Planta ou controlo | Mensagem observada | Origem |', '|---|---|---|']
    linhas += ['| ' + celula(p['nome']) + ' | ' + '<br>'.join(celula(m) for m in p['mensagens']) + ' | `' + p['ficheiro'] + '` |' for p in plantas]
    linhas += ['', '## Limites e questões', '',
               '- **MA-1.** A selagem continua a ser uma gravação deliberada fora do verify. O registo torna a execução auditável, mas não é uma assinatura contra falsificação deliberada dos ficheiros. A execução integral no CI é a prova de cada aterragem.',
               '- **MA-2.** A leitura a frio da primeira passagem e a decisão do lugar de direção foram recebidas e aplicadas. A aceitação desta passagem pertence ao lugar de direção.',
               '- **MA-3.** O total final de símbolos do lançador não está exposto nesta sessão; não se inventa a partir dos contadores parciais.',
               f'- **MA-4, resolvida.** A cabeça do brief não exportava as páginas dos alvos. Depois da corrida cronometrada, uma sonda externa acrescentou em memória apenas a escrita final dos resultados já calculados pelo guião original. O SHA identifica os bytes originais; o carregador fica em `antes/instrumentacao/observar-alvos.mjs`; o código dessa corrida e o estado limpo posterior também ficam conservados. As {len(observacao["paginas"])} passagens são iguais, como objetos completos, às da cabeça do código nova, sem arredondamento. Também são iguais as rotas, larguras, células, resultados do axe, violações graves e alvos maus. Esta exportação separada não entra no tempo do «antes».', '', 
               '- **MA-5, resolvida.** O agregador comparava o caminho da invocação com o caminho real do módulo e podia sair sem escrever quando chamado por uma ligação. Passa a resolver a ligação; a planta retira o JSON anterior e exige um novo ficheiro idêntico. A recolha do «antes» usou o caminho real, e o seu ficheiro de tempos foi lido e conferido.', '',
               'Não houve push, publicação ou alteração do motor. Os testes da aterragem substituem os comandos externos. A espera por uma tranca de outra worktree foi respeitada.', '',
               '## Commits desta passagem', '']
    linhas += ['- `' + l.split(' ', 1)[0] + '` ' + re.sub(r'^M-A-b (\d+):', r'`M-A-b \1`:', l.split(' ', 1)[1])
               for l in git('log', '--reverse', '--format=%h %s', 'beb1e37d..' + head).splitlines()]
    linhas += ['', 'O último commit junta apenas o relatório e as provas. Os trailers pedidos estão nos commits desta passagem.', '']
    for prefixo in ('U ✓', 'D ✓', 'C ✓', 'npm run check:briefs ·', 'npm run check:leituras ·', 'npm run check:series ·', 'npm run check:pais:auto-teste ·', 'npm run check:alvos ·'):
        linhas.append('<!-- portao: portoes-b/verify.log | ' + prefixo + ' -->')
    (P / 'LEIA-ME.md').write_text('\n'.join(linhas) + '\n')
    print(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    principal()
