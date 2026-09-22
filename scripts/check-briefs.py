#!/usr/bin/env python3
"""O portão dos briefs: as medições de um brief provam que veem, e cada número do §0 liga à sua medição.

uso: python3 scripts/check-briefs.py                (na raiz do repositório)
     python3 scripts/check-briefs.py --contagens    (só as contagens, sem o detalhe)
     python3 scripts/check-briefs.py --escrever-isentos   (refaz `medidas/isentos.json`)

PORQUE EXISTE (M18 e §1.120, 22.09.2026). A 22.09.2026 dois §0 de briefs
afirmaram factos medidos com detetores que não viam: a peça 3 do B1 errou a
atribuição da Carta, e o B1c escreveu «zero linhas datadas» numa página com
dezasseis, contadas com um detetor que procurava `<time>` onde a data era um
`<span>`. Os dois foram apanhados pelos construtores a medir antes de construir.
Um zero de um detetor que não deteta nada não é um zero, e um número de um brief
que ninguém pode voltar a medir é uma afirmação e não uma medição.

O QUE ESTE PORTÃO EXIGE, de cada brief que lhe cabe:

  1. existe um guião ao lado do brief, `design/observatorio/medidas/<chave>.py`
     ou `.mjs`, que corre sem argumentos a partir da raiz do repositório, e a
     chave de um brief é de um brief só;
  2. o guião corre e sai a 0, e o ficheiro que ele escreve nomeia o brief que
     foi conferido e o guião que correu;
  3. o que ele mede agora é, medida a medida, o que está escrito em
     `design/observatorio/medidas/<chave>.json`;
  4. cada medição traz um conhecido-positivo encontrado: algo que o MESMO
     detetor tem de achar para provar que vê;
  5. cada número do §0 do brief LIGA à medição que o mede, pela frase.

A LIGAÇÃO É POR FRASE, E É O CORAÇÃO DESTE PORTÃO (a leitura a frio de
22.09.2026, achado 4). A primeira forma desta célula só exigia que o número
existisse algures no conjunto de todos os valores do ficheiro: um «37» falso
passava porque 37 era a contagem de outra coisa, e a célula dizia «medido» de um
número que ninguém mediu. Agora:

  · uma frase do §0 acaba em ponto final, ponto e vírgula ou mudança de linha;
  · numa frase com números, pelo menos um pedaço entre crases tem de ser o NOME
    de uma medição declarada no ficheiro. Os outros pedaços entre crases
    ignoram-se, porque são código: caminhos, comandos, chaves;
  · cada número dessa frase tem de ser o valor de uma das medições nomeadas
    NESSA frase. Um número sem medição nomeada na sua frase, ou cujo valor não
    é o de nenhuma das nomeadas, fecha o portão;
  · a saída diz, frase a frase, que número ligou a que nome, para que a ligação
    se possa ler e não apenas acreditar.

A REGRA DE ESCRITA QUE ISTO OBRIGA, e que vale para todo o texto que um portão
leia: **num §0 um número escreve-se em algarismos.** O leitor não lê numerais
por extenso, e não deve: «uma» e «um» são artigos, e um dicionário de numerais
ou apanhava artigos ou deixava passar contagens. Um número por extenso num §0 é
uma afirmação que o portão não vê. O cabeçalho de `scripts/leituras/numeros.py`
diz o resto do que fica de fora e porquê, e as contagens do que se apagou saem
na saída de cada corrida.

A CHAVE DE UM BRIEF é `BRIEF-` mais o primeiro campo a seguir, do nome do
ficheiro: `BRIEF-M5-as-medicoes-provam-que-veem.md` tem a chave `BRIEF-M5`, e o
seu guião é `design/observatorio/medidas/BRIEF-M5.py`. Dois briefs com a mesma
chave partilhariam um ficheiro de medições, e nenhum dos dois ficaria medido:
fecha o portão quando pelo menos um deles está sob a regra. **Uma colisão só
entre isentos não fecha, mas diz-se na saída**, porque nenhum dos dois tem nem
vai ter ficheiro de medições, e porque passa a fechar no dia em que um deles
deixar de ser isento. Medida a 22.09.2026: há uma, a chave `BRIEF-fatia`, entre
`BRIEF-fatia-css-alcance-2026-09-16.md` e `BRIEF-fatia-dominios-css-2026-09-15.md`,
os dois anteriores ao corte. Um brief antigo não se renomeia por causa disto; um
brief novo escolhe uma chave que ainda não exista.

A FORMA DO FICHEIRO DAS MEDIÇÕES, que é o «bloco medidas» de um brief:

    {
      "brief":  "design/observatorio/BRIEF-<…>.md",
      "guiao":  "design/observatorio/medidas/<chave>.py",
      "medidas": [
        {
          "nome":    "<o nome por que o §0 o cita, entre crases, na sua frase>",
          "valor":   <o que se mediu: número, cadeia ou booleano>,
          "comando": "<o comando que reproduz ESTE valor>",
          "conhecido_positivo": {
            "o_que":      "<o que o mesmo detetor tem de encontrar>",
            "encontrado": true
          }
        }
      ]
    }

COMO O PORTÃO CORRE O GUIÃO SEM LHE ESTRAGAR O FICHEIRO. O guião escreve o seu
JSON no caminho de `OEDP_MEDIDAS_JSON` quando essa variável existe, e no caminho
de sempre quando não existe. O portão põe-lhe um ficheiro temporário e compara-o
com o que está no repositório: assim a comparação é entre o que se mede hoje e o
que estava escrito, e não entre o ficheiro e ele próprio.

A DATA DE UM BRIEF é a MAIS RECENTE entre a do nome do ficheiro e a primeira do
cabeçalho (as dez primeiras linhas). A mais recente, e não a do nome: um brief
escrito hoje com um nome datado de ontem escapava ao corte pelo nome, e a data
de um brief é o dia em que ele foi escrito.

A ISENÇÃO TEM DUAS METADES, E AS DUAS SE DIZEM AQUI E NA SAÍDA.

  · POR DATA: um brief escrito antes de 22.09.2026 não tem guião de medições e
    não passa a ter. A regra nasceu nesse dia e não se aplica para trás; nenhum
    brief antigo se reescreve.

  · POR NOMEAÇÃO, e são três, todos de 22.09.2026: o B1c, a I129 e o M3b, que o
    lugar de direção escreveu nesse dia ANTES desta regra existir. A data deles
    é igual à do corte e por isso a isenção por data não os apanha. Não é uma
    porta aberta: é uma lista fechada de três nomes, e o portão fecha se ela
    crescer. E há uma razão medida para eles não entrarem: o §0 do B1c afirma
    «zero linhas datadas» numa página que tinha dezasseis, e exigir que esse
    número ligasse a uma medição obrigava a reescrever um brief antigo, que é o
    que a regra 3 do brief M5 proíbe. Mede-se o que falha e diz-se.

A ISENÇÃO ESTÁ PRESA PELO SHA256 (achado 9). `design/observatorio/medidas/
isentos.json` guarda o caminho e o sha256 de cada brief isento. Um brief antigo
editado muda de resumo e fecha o portão, até que a lista seja posta em dia num
diff que se vê, tal como a lista dos três nomeados. Sem isto, a isenção por data
era uma porta: bastava emendar um brief antigo para lhe pôr lá dentro o que se
quisesse, sem nada a dizer.

LIMITES, DITOS. O portão confere que cada número do §0 liga à medição nomeada na
sua frase; não confere que a frase à volta diga o que o número mede. Um número
por extenso não se vê, e por isso a regra de escrita acima. O que conta como
número está definido num sítio só, `scripts/leituras/numeros.py`.
"""
import glob
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, 'scripts', 'leituras'))
import numeros  # noqa: E402

CORTE = (2026, 9, 22)
MEDIDAS = os.path.join(RAIZ, 'design/observatorio/medidas')
ISENTOS = os.path.join(MEDIDAS, 'isentos.json')

# A lista fechada da isenção por nomeação. Cresce só com uma decisão escrita, e o
# portão fecha se crescer sem ela: a asserção do `main()` é a catraca.
ISENTOS_POR_NOMEACAO = {
    'BRIEF-B1c-o-que-mudou-no-seu-lugar.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.120)',
    'BRIEF-I129-o-grupo-etario-dos-jovens-nem.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.119)',
    'BRIEF-M3b-os-nomes-confirmados-voltam-aos-recibos.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.118)',
}

# As chaves que as duas leituras comparam uma com a outra. Faltar uma é erro e
# não silêncio: uma conferência que se salta a si própria quando a chave não
# existe é uma conferência que nunca corre.
CRUZADAS = ('briefs_conferidos_pelo_portao', 'briefs_isentos_por_data',
            'briefs_isentos_por_nomeacao')

RE_DATA_NO_NOME = re.compile(r'(\d{4})-(\d{2})-(\d{2})')
RE_DATA_NO_CABECALHO = re.compile(r'(\d{2})\.(\d{2})\.(\d{4})')
RE_TITULO_ZERO = re.compile(r'^##\s+0\b', re.M)
RE_TITULO_QUALQUER = re.compile(r'^##\s', re.M)
RE_CRASE = re.compile(r'`([^`\n]*)`')


def sha(caminho):
    return hashlib.sha256(open(caminho, 'rb').read()).hexdigest()


def data_do_brief(caminho):
    """(ano, mês, dia): a mais recente entre a data do nome e a do cabeçalho."""
    datas = []
    m = RE_DATA_NO_NOME.search(os.path.basename(caminho))
    if m:
        datas.append((int(m.group(1)), int(m.group(2)), int(m.group(3))))
    cabecalho = '\n'.join(open(caminho, encoding='utf-8').read().split('\n')[:10])
    m = RE_DATA_NO_CABECALHO.search(cabecalho)
    if m:
        datas.append((int(m.group(3)), int(m.group(2)), int(m.group(1))))
    return max(datas) if datas else None


def chave_do_brief(caminho):
    campos = os.path.basename(caminho)[:-3].split('-')
    return '-'.join(campos[:2]) if len(campos) >= 2 else campos[0]


def rel(caminho):
    return os.path.relpath(caminho, RAIZ)


def seccao_zero(texto):
    """O §0 de um brief: a secção `## 0 · …`, ou a primeira `##` que diga «o que se mediu»."""
    m = RE_TITULO_ZERO.search(texto)
    if not m:
        for t in RE_TITULO_QUALQUER.finditer(texto):
            fim = texto.find('\n', t.start())
            if 'o que se mediu' in texto[t.start():fim if fim != -1 else len(texto)].lower():
                m = t
                break
    if not m:
        return None
    seguinte = RE_TITULO_QUALQUER.search(texto, m.end())
    return texto[m.start():seguinte.start() if seguinte else len(texto)]


def bate(valor_medido, num):
    """O número escrito é o valor desta medição?"""
    formas, valores = numeros.de_objeto(valor_medido)
    if num['forma'] in formas:
        return True
    return num['valor'] is not None and num['valor'] in valores


def liga_o_zero(nome_do_brief, zero, medidas, erros, ligacoes):
    """Cada número do §0 tem de ser o valor de uma medição nomeada na sua frase."""
    zero = unicodedata.normalize('NFC', zero)
    limpo, contagens = numeros.limpa(zero)
    if len(limpo) != len(zero):
        erros.append(f'{nome_do_brief}: a limpeza do §0 mudou o comprimento do texto; '
                     f'as frases deixariam de bater com o ficheiro.')
        return contagens
    fronteiras = [0] + [i + 1 for i, ch in enumerate(limpo) if ch in '.;\n'] + [len(limpo)]
    for a, b in zip(fronteiras, fronteiras[1:]):
        if b <= a:
            continue
        nums = numeros.num_no_limpo(limpo[a:b])
        if not nums:
            continue
        frase = zero[a:b].strip()
        citados = [c for c in RE_CRASE.findall(zero[a:b]) if c in medidas]
        if not citados:
            erros.append(
                f'{nome_do_brief}: esta frase do §0 escreve '
                f'{", ".join("«" + n["bruto"] + "»" for n in nums)} e não nomeia medição nenhuma '
                f'entre crases.\n      «{frase[:150]}»\n'
                f'      Um número do §0 escreve-se em algarismos e traz na sua frase o nome da '
                f'medição que o mede.')
            continue
        for n in nums:
            casou = [c for c in citados if bate(medidas[c].get('valor'), n)]
            if casou:
                ligacoes.append((nome_do_brief, n['bruto'], casou[0]))
                continue
            erros.append(
                f'{nome_do_brief}: o §0 escreve «{n["bruto"]}» e esse número não é o valor de '
                f'nenhuma das medições nomeadas na sua frase '
                f'({", ".join("`" + c + "`=" + json.dumps(medidas[c].get("valor"), ensure_ascii=False) for c in citados)}).\n'
                f'      «{frase[:150]}»')
    return contagens


def corre_guiao(guiao, erros):
    """Corre o guião de um brief num ficheiro temporário e devolve o que ele mediu."""
    with tempfile.TemporaryDirectory() as tmp:
        alvo = os.path.join(tmp, 'medidas.json')
        ambiente = dict(os.environ, OEDP_MEDIDAS_JSON=alvo)
        comando = (['python3', guiao] if guiao.endswith('.py') else ['node', guiao])
        try:
            r = subprocess.run(comando, cwd=RAIZ, env=ambiente, capture_output=True,
                               text=True, timeout=600)
        except Exception as erro:  # noqa: BLE001
            erros.append(f'{rel(guiao)}: não correu ({type(erro).__name__}: {erro})')
            return None
        if r.returncode != 0:
            erros.append(f'{rel(guiao)}: saiu com {r.returncode}.\n      {r.stderr.strip()[:600]}')
            return None
        if not os.path.isfile(alvo):
            erros.append(f'{rel(guiao)}: correu a 0 mas não escreveu o ficheiro de `OEDP_MEDIDAS_JSON`.')
            return None
        try:
            return json.load(open(alvo, encoding='utf-8'))
        except Exception as erro:  # noqa: BLE001
            erros.append(f'{rel(guiao)}: o que escreveu não é JSON ({type(erro).__name__}: {erro})')
            return None


def confere(caminho, erros, ligacoes, contagens):
    """Confere um brief. Devolve o ficheiro das medições lido do repositório, ou None."""
    nome = os.path.basename(caminho)
    chave = chave_do_brief(caminho)
    guioes = [g for g in (os.path.join(MEDIDAS, chave + '.py'),
                          os.path.join(MEDIDAS, chave + '.mjs')) if os.path.isfile(g)]
    ficheiro = os.path.join(MEDIDAS, chave + '.json')
    if not guioes:
        erros.append(
            f'{nome}: é de 22.09.2026 ou depois e não tem guião de medições.\n'
            f'      Falta `design/observatorio/medidas/{chave}.py` ou `.mjs`, que escreve '
            f'`medidas/{chave}.json`.')
        return None
    if len(guioes) > 1:
        erros.append(f'{nome}: tem dois guiões de medições ({chave}.py e {chave}.mjs); é um só.')
        return None
    if not os.path.isfile(ficheiro):
        erros.append(f'{nome}: o guião existe e `medidas/{chave}.json` não. Corra o guião e junte o ficheiro.')
        return None

    escrito = json.load(open(ficheiro, encoding='utf-8'))
    if escrito.get('brief') != rel(caminho):
        erros.append(
            f'{nome}: `medidas/{chave}.json` diz que mede '
            f'{json.dumps(escrito.get("brief"), ensure_ascii=False)} e o brief conferido é '
            f'`{rel(caminho)}`.')
    if escrito.get('guiao') != rel(guioes[0]):
        erros.append(
            f'{nome}: `medidas/{chave}.json` nomeia o guião '
            f'{json.dumps(escrito.get("guiao"), ensure_ascii=False)} e quem correu foi '
            f'`{rel(guioes[0])}`.')

    medido = corre_guiao(guioes[0], erros)
    if medido is None:
        return None

    por_nome_escrito = {m.get('nome'): m for m in escrito.get('medidas', [])}
    por_nome_medido = {m.get('nome'): m for m in medido.get('medidas', [])}
    if not por_nome_escrito:
        erros.append(f'{nome}: `medidas/{chave}.json` não declara medição nenhuma.')
        return None
    for n in sorted(set(por_nome_escrito) - set(por_nome_medido)):
        erros.append(f'{nome}: a medição «{n}» está no ficheiro e o guião já não a mede.')
    for n in sorted(set(por_nome_medido) - set(por_nome_escrito)):
        erros.append(f'{nome}: o guião mede «{n}» e o ficheiro não a tem. Corra o guião e junte o ficheiro.')
    for n, m in por_nome_escrito.items():
        o = por_nome_medido.get(n)
        if o is None:
            continue
        if o.get('valor') != m.get('valor'):
            erros.append(
                f'{nome}: a medição «{n}» vale {json.dumps(o.get("valor"), ensure_ascii=False)} hoje e o '
                f'ficheiro diz {json.dumps(m.get("valor"), ensure_ascii=False)}.\n'
                f'      comando: {m.get("comando", "(sem comando escrito)")}')
        for campo in ('comando', 'conhecido_positivo'):
            if campo not in m:
                erros.append(f'{nome}: a medição «{n}» não declara `{campo}`.')
        cp = o.get('conhecido_positivo') or {}
        if cp.get('encontrado') is not True:
            erros.append(
                f'{nome}: o conhecido-positivo da medição «{n}» NÃO foi encontrado '
                f'({cp.get("o_que", "sem descrição")}). Enquanto o detetor não vir, o valor dela não vale.')

    zero = seccao_zero(open(caminho, encoding='utf-8').read())
    if zero is None:
        erros.append(f'{nome}: não tem §0. Um brief sob esta regra declara no §0 o que mediu.')
        return escrito
    c = liga_o_zero(nome, zero, por_nome_escrito, erros, ligacoes)
    if c:
        for k, v in c.items():
            contagens[k] = contagens.get(k, 0) + v
    return escrito


def isentos_escritos():
    if not os.path.isfile(ISENTOS):
        return None
    return json.load(open(ISENTOS, encoding='utf-8'))


def classifica():
    """Os briefs, separados em conferidos, isentos por data e isentos por nomeação."""
    briefs = sorted(glob.glob(os.path.join(RAIZ, 'design/observatorio/BRIEF-*.md')))
    conferidos, por_data, por_nomeacao, sem_data, chaves = [], [], [], [], {}
    for b in briefs:
        nome = os.path.basename(b)
        chaves.setdefault(chave_do_brief(b), []).append(nome)
        data = data_do_brief(b)
        if data is None:
            sem_data.append(nome)
            continue
        if nome in ISENTOS_POR_NOMEACAO:
            por_nomeacao.append((b, data))
        elif data < CORTE:
            por_data.append((b, data))
        else:
            conferidos.append(b)
    return briefs, conferidos, por_data, por_nomeacao, sem_data, chaves


def main(argv):
    so_contagens = '--contagens' in argv
    escrever = '--escrever-isentos' in argv
    for o in argv:
        if o.startswith('--') and o not in ('--contagens', '--escrever-isentos'):
            print(f'check-briefs.py: opção desconhecida: {o}', file=sys.stderr)
            return 2

    # A catraca da lista fechada: cresce só com uma decisão escrita, e o número
    # está aqui para que crescer obrigue a mexer nesta linha.
    if len(ISENTOS_POR_NOMEACAO) != 3:
        print('check-briefs.py: a isenção por nomeação são três briefs de 22.09.2026 e mais nenhum.',
              file=sys.stderr)
        return 2

    erros, ligacoes, contagens, colisoes_isentas = [], [], {}, []
    briefs, conferidos, por_data, por_nomeacao, sem_data, chaves = classifica()

    for nome in sem_data:
        erros.append(f'{nome}: não traz data no nome nem no cabeçalho, e a isenção é por data.')
    # Duas chaves iguais partilhariam um ficheiro de medições, e nenhum dos dois
    # briefs ficava medido. Fecha o portão quando pelo menos um dos colididos
    # está sob a regra. Uma colisão só entre isentos não fecha, porque nenhum
    # deles tem ficheiro de medições e nenhum vai ter, mas DIZ-SE: no dia em que
    # um deles deixar de ser isento, passa a fechar. A 22.09.2026 há uma, entre
    # dois briefs de 15 e 16.09.2026, e está dita na saída.
    sob_a_regra = {os.path.basename(b) for b in conferidos}
    for chave, nomes in sorted(chaves.items()):
        if len(nomes) < 2:
            continue
        if sob_a_regra & set(nomes):
            erros.append(
                f'dois briefs com a chave «{chave}»: {", ".join(sorted(nomes))}. Partilhariam o '
                f'ficheiro `medidas/{chave}.json`, e nenhum dos dois ficava medido.')
        else:
            colisoes_isentas.append((chave, sorted(nomes)))
    for b, data in por_nomeacao:
        if data != CORTE:
            erros.append(f'{os.path.basename(b)}: está na isenção por nomeação e não é de 22.09.2026 ({data}).')

    # A isenção presa pelo sha256.
    isentos = [(b, 'data') for b, _ in por_data] + [(b, 'nomeação') for b, _ in por_nomeacao]
    if escrever:
        os.makedirs(MEDIDAS, exist_ok=True)
        with open(ISENTOS, 'w', encoding='utf-8') as f:
            json.dump({
                'porque': ('Os briefs que o `check:briefs` isenta, presos pelo sha256. Um brief '
                           'antigo editado muda de resumo e fecha o portão, até que esta lista '
                           'seja posta em dia num diff que se vê. Sem isto a isenção por data era '
                           'uma porta: bastava emendar um brief antigo.'),
                'corte': '2026-09-22',
                'quantos': len(isentos),
                'isentos': [{'brief': rel(b), 'isento_por': p, 'sha256': sha(b)}
                            for b, p in sorted(isentos)],
            }, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'  escrito {rel(ISENTOS)} com {len(isentos)} brief(s) isento(s).')
        return 0

    lista = isentos_escritos()
    if lista is None:
        erros.append(f'falta `{rel(ISENTOS)}`. Corra `python3 scripts/check-briefs.py --escrever-isentos`.')
    else:
        escritos = {e['brief']: e for e in lista.get('isentos', [])}
        agora = {rel(b): p for b, p in isentos}
        for caminho in sorted(set(agora) - set(escritos)):
            erros.append(f'{caminho}: está isento e não consta de `{rel(ISENTOS)}`.')
        for caminho in sorted(set(escritos) - set(agora)):
            erros.append(f'{caminho}: consta de `{rel(ISENTOS)}` e já não está isento.')
        for caminho in sorted(set(agora) & set(escritos)):
            atual = sha(os.path.join(RAIZ, caminho))
            if atual != escritos[caminho].get('sha256'):
                erros.append(
                    f'{caminho}: o brief mudou desde que foi isento (sha256 {atual[:12]}… contra '
                    f'{str(escritos[caminho].get("sha256"))[:12]}…).\n'
                    f'      Um brief isento está preso pelo resumo: ou se desfaz a mudança, ou se '
                    f'põe a lista em dia com `--escrever-isentos`, num diff que se vê.')
            if escritos[caminho].get('isento_por') != agora[caminho]:
                erros.append(
                    f'{caminho}: a lista diz que é isento por '
                    f'{escritos[caminho].get("isento_por")} e hoje é por {agora[caminho]}.')

    medidas_do_m5 = None
    for b in conferidos:
        lido = confere(b, erros, ligacoes, contagens)
        if os.path.basename(b).startswith('BRIEF-M5-'):
            medidas_do_m5 = lido

    # As duas leituras conferem-se uma à outra, e as chaves são obrigatórias: uma
    # conferência que se salta quando a chave falta é uma que nunca corre. O
    # número dos conferidos ancora-se na data, como as outras medições do M5, para
    # não andar com cada brief novo.
    conferidos_ate_ao_corte = sum(1 for b in conferidos if (data_do_brief(b) or CORTE) <= CORTE)
    if medidas_do_m5 is None:
        erros.append('o `BRIEF-M5.json` não foi lido, e é ele que cruza as contagens deste portão.')
    else:
        esperado = {m.get('nome'): m.get('valor') for m in medidas_do_m5.get('medidas', [])}
        for chave, contado in (('briefs_conferidos_pelo_portao', conferidos_ate_ao_corte),
                               ('briefs_isentos_por_data', len(por_data)),
                               ('briefs_isentos_por_nomeacao', len(por_nomeacao))):
            if chave not in esperado:
                erros.append(
                    f'o `BRIEF-M5.json` não declara «{chave}», e é uma das contagens que as duas '
                    f'leituras comparam. Sem ela, a comparação não corre e ninguém dá por isso.')
            elif esperado[chave] != contado:
                erros.append(
                    f'as duas leituras discordam: este portão conta {contado} em «{chave}» e o guião '
                    f'do M5 mediu {esperado[chave]}.')

    print(f'  portão dos briefs · {len(briefs)} brief(s) em design/observatorio/ · '
          f'{len(conferidos)} conferido(s) · {len(por_data)} isento(s) por data (anteriores a '
          f'{CORTE[2]:02d}.{CORTE[1]:02d}.{CORTE[0]}) · {len(por_nomeacao)} isento(s) por nomeação, '
          f'os {len(isentos)} presos por sha256 em {rel(ISENTOS)}')
    if not so_contagens:
        for b in conferidos:
            print(f'    conferido: {os.path.basename(b)} (medidas/{chave_do_brief(b)}.json)')
        for nome, ligou, a_que in ligacoes:
            print(f'      §0 liga «{ligou}» a `{a_que}`')
        for b, _ in por_nomeacao:
            print(f'    isento por nomeação: {os.path.basename(b)} · '
                  f'{ISENTOS_POR_NOMEACAO[os.path.basename(b)]}')
        for chave, nomes in colisoes_isentas:
            print(f'    chave repetida entre isentos, dita e não fatal: «{chave}» · '
                  f'{", ".join(nomes)} · fecha o portão no dia em que um deles deixar de ser isento')
        if contagens:
            print('    apagado antes de contar no §0: '
                  + ', '.join(f'{k} {contagens.get(k, 0)}' for k in numeros.CLASSES))

    if erros:
        print('')
        print(f'  O PORTÃO DOS BRIEFS FECHOU · {len(erros)} erro(s):')
        for e in erros:
            print(f'    · {e}')
        return 1
    print(f'  ✓ {len(ligacoes)} número(s) do §0 ligado(s) à sua medição, cada detetor provou que vê, '
          f'e os briefs isentos estão presos pelo resumo.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
