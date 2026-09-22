#!/usr/bin/env python3
"""O portão dos briefs: as medições de um brief provam que veem, e o §0 só diz números medidos.

uso: python3 scripts/check-briefs.py            (na raiz do repositório)
     python3 scripts/check-briefs.py --contagens  (só as contagens, sem o detalhe)

PORQUE EXISTE (M18 e §1.120, 22.09.2026). A 22.09.2026 dois §0 de briefs
afirmaram factos medidos com detetores que não viam: a peça 3 do B1 errou a
atribuição da Carta, e o B1c escreveu «zero linhas datadas» numa página com
dezasseis, contadas com um detetor que procurava `<time>` onde a data era um
`<span>`. Os dois foram apanhados pelos construtores a medir antes de construir.
Um zero de um detetor que não deteta nada não é um zero, e um número de um brief
que ninguém pode voltar a medir é uma afirmação e não uma medição.

O QUE ESTE PORTÃO EXIGE, de cada brief que lhe cabe:

  1. existe um guião ao lado do brief, `design/observatorio/medidas/<chave>.py`
     ou `.mjs`, que corre sem argumentos a partir da raiz do repositório;
  2. o guião corre e sai a 0;
  3. o que ele mede agora é, medida a medida, o que está escrito em
     `design/observatorio/medidas/<chave>.json`;
  4. cada medição traz um conhecido-positivo encontrado: algo que o MESMO
     detetor tem de achar para provar que vê;
  5. cada número escrito no §0 do brief existe no ficheiro das medições.

A CHAVE DE UM BRIEF é `BRIEF-` mais o primeiro campo a seguir, do nome do
ficheiro: `BRIEF-M5-as-medicoes-provam-que-veem.md` tem a chave `BRIEF-M5`, e o
seu guião é `design/observatorio/medidas/BRIEF-M5.py`.

A FORMA DO FICHEIRO DAS MEDIÇÕES, que é o «bloco medidas» de um brief:

    {
      "brief":  "design/observatorio/BRIEF-<…>.md",
      "guiao":  "design/observatorio/medidas/<chave>.py",
      "medidas": [
        {
          "nome":    "<o nome por que o §0 a cita>",
          "valor":   <o que se mediu: número, cadeia ou booleano>,
          "comando": "<o comando que um leitor corre para a repetir>",
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

A ISENÇÃO, E PORQUE TEM DUAS METADES.

  · POR DATA: um brief escrito antes de 22.09.2026 não tem guião de medições e
    não passa a ter. A regra nasceu nesse dia e não se aplica para trás; nenhum
    brief antigo se reescreve. A data lê-se do nome do ficheiro quando ele a
    traz, e do cabeçalho quando não.

  · POR NOMEAÇÃO, e são três, todos de 22.09.2026: o B1c, a I129 e o M3b, que o
    lugar de direção escreveu nesse dia ANTES desta regra existir. A data deles
    é igual à do corte e por isso a isenção por data não os apanha. Não é uma
    porta aberta: é uma lista fechada de três nomes, e o portão fecha se ela
    crescer. E há uma razão medida para eles não entrarem: o §0 do B1c afirma
    «zero linhas datadas» numa página que tinha dezasseis, e exigir que esse
    número existisse num ficheiro de medição obrigava a reescrever um brief
    antigo, que é o que a regra 3 do brief M5 proíbe. Mede-se o que falha e
    diz-se; não se emenda.

LIMITES, DITOS. O portão confere que cada número do §0 está no ficheiro das
medições; não confere que a frase à volta do número diga o que o número mede.
O que conta como número está definido num sítio só,
`scripts/leituras/numeros.py`, e o cabeçalho desse ficheiro diz o que se apaga
antes de contar (código, datas, resumos, secções, ordinais, identificadores,
anos isolados) e porquê.
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, 'scripts', 'leituras'))
import numeros  # noqa: E402

CORTE = (2026, 9, 22)

# A lista fechada da isenção por nomeação. Cresce só com uma decisão escrita, e o
# portão fecha se crescer sem ela: a asserção logo a seguir é a catraca.
ISENTOS_POR_NOMEACAO = {
    'BRIEF-B1c-o-que-mudou-no-seu-lugar.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.120)',
    'BRIEF-I129-o-grupo-etario-dos-jovens-nem.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.119)',
    'BRIEF-M3b-os-nomes-confirmados-voltam-aos-recibos.md':
        'escrito a 22.09.2026 de manhã, antes de esta regra existir (§1.118)',
}

RE_DATA_NO_NOME = re.compile(r'(\d{4})-(\d{2})-(\d{2})')
RE_DATA_NO_CABECALHO = re.compile(r'(\d{2})\.(\d{2})\.(\d{4})')
RE_TITULO_ZERO = re.compile(r'^##\s+0\b', re.M)
RE_TITULO_QUALQUER = re.compile(r'^##\s', re.M)


def data_do_brief(caminho):
    """(ano, mês, dia) lido do nome do ficheiro, e do cabeçalho quando o nome não a traz."""
    m = RE_DATA_NO_NOME.search(os.path.basename(caminho))
    if m:
        return (int(m.group(1)), int(m.group(2)), int(m.group(3))), 'nome'
    cabecalho = '\n'.join(open(caminho, encoding='utf-8').read().split('\n')[:10])
    m = RE_DATA_NO_CABECALHO.search(cabecalho)
    if m:
        return (int(m.group(3)), int(m.group(2)), int(m.group(1))), 'cabeçalho'
    return None, 'nenhuma'


def chave_do_brief(caminho):
    campos = os.path.basename(caminho)[:-3].split('-')
    return '-'.join(campos[:2]) if len(campos) >= 2 else campos[0]


def seccao_zero(texto):
    """O §0 de um brief: a secção `## 0 · …`, ou a primeira `##` que diga «o que se mediu»."""
    m = RE_TITULO_ZERO.search(texto)
    if not m:
        for t in RE_TITULO_QUALQUER.finditer(texto):
            linha = texto[t.start():texto.find('\n', t.start())]
            if 'o que se mediu' in linha.lower():
                m = t
                break
    if not m:
        return None
    seguinte = RE_TITULO_QUALQUER.search(texto, m.end())
    return texto[m.start():seguinte.start() if seguinte else len(texto)]


def corre_guiao(guiao, erros):
    """Corre o guião de um brief num ficheiro temporário e devolve o que ele mediu."""
    with tempfile.TemporaryDirectory() as tmp:
        alvo = os.path.join(tmp, 'medidas.json')
        ambiente = dict(os.environ, OEDP_MEDIDAS_JSON=alvo)
        comando = (['python3', guiao] if guiao.endswith('.py') else ['node', guiao])
        try:
            r = subprocess.run(comando, cwd=RAIZ, env=ambiente, capture_output=True, text=True, timeout=600)
        except Exception as erro:  # noqa: BLE001
            erros.append(f'{guiao}: não correu ({type(erro).__name__}: {erro})')
            return None
        if r.returncode != 0:
            erros.append(f'{guiao}: saiu com {r.returncode}.\n      {r.stderr.strip()[:600]}')
            return None
        if not os.path.isfile(alvo):
            erros.append(f'{guiao}: correu a 0 mas não escreveu o ficheiro de `OEDP_MEDIDAS_JSON`.')
            return None
        try:
            return json.load(open(alvo, encoding='utf-8'))
        except Exception as erro:  # noqa: BLE001
            erros.append(f'{guiao}: o que escreveu não é JSON ({type(erro).__name__}: {erro})')
            return None


def confere(caminho, erros):
    """Confere um brief. Devolve o ficheiro das medições lido do repositório, ou None."""
    nome = os.path.basename(caminho)
    chave = chave_do_brief(caminho)
    guioes = [g for g in (
        os.path.join(RAIZ, 'design/observatorio/medidas', chave + '.py'),
        os.path.join(RAIZ, 'design/observatorio/medidas', chave + '.mjs'),
    ) if os.path.isfile(g)]
    ficheiro = os.path.join(RAIZ, 'design/observatorio/medidas', chave + '.json')
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
    medido = corre_guiao(guioes[0], erros)
    if medido is None:
        return None

    por_nome_escrito = {m.get('nome'): m for m in escrito.get('medidas', [])}
    por_nome_medido = {m.get('nome'): m for m in medido.get('medidas', [])}
    if not por_nome_escrito:
        erros.append(f'{nome}: `medidas/{chave}.json` não declara medição nenhuma.')
        return None
    faltam = sorted(set(por_nome_escrito) - set(por_nome_medido))
    sobram = sorted(set(por_nome_medido) - set(por_nome_escrito))
    for n in faltam:
        erros.append(f'{nome}: a medição «{n}» está no ficheiro e o guião já não a mede.')
    for n in sobram:
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

    texto = open(caminho, encoding='utf-8').read()
    zero = seccao_zero(texto)
    if zero is None:
        erros.append(f'{nome}: não tem §0. Um brief sob esta regra declara no §0 o que mediu.')
        return escrito
    formas, valores = numeros.de_objeto(escrito)
    achados, _ = numeros.do_texto(zero)
    for a in numeros.em_falta(achados, formas, valores):
        erros.append(
            f'{nome}: o §0 escreve «{a["bruto"]}» e esse número não está em `medidas/{chave}.json`.\n'
            f'      «{a["contexto"]}»')
    return escrito


def main(argv):
    so_contagens = '--contagens' in argv
    for o in argv:
        if o.startswith('--') and o != '--contagens':
            print(f'check-briefs.py: opção desconhecida: {o}', file=sys.stderr)
            return 2

    # A catraca da lista fechada: cresce só com uma decisão escrita, e o número
    # está aqui para que crescer obrigue a mexer nesta linha.
    if len(ISENTOS_POR_NOMEACAO) != 3:
        print('check-briefs.py: a isenção por nomeação são três briefs de 22.09.2026 e mais nenhum.',
              file=sys.stderr)
        return 2

    erros = []
    briefs = sorted(glob.glob(os.path.join(RAIZ, 'design/observatorio/BRIEF-*.md')))
    conferidos, por_data, por_nomeacao = [], [], []
    for b in briefs:
        nome = os.path.basename(b)
        data, onde = data_do_brief(b)
        if data is None:
            erros.append(f'{nome}: não traz data no nome nem no cabeçalho, e a isenção é por data.')
            continue
        if nome in ISENTOS_POR_NOMEACAO:
            if data != CORTE:
                erros.append(f'{nome}: está na isenção por nomeação e não é de 22.09.2026 ({data}).')
            por_nomeacao.append((nome, ISENTOS_POR_NOMEACAO[nome]))
            continue
        if data < CORTE:
            por_data.append((nome, data, onde))
            continue
        conferidos.append(b)

    medidas_do_m5 = None
    for b in conferidos:
        lido = confere(b, erros)
        if os.path.basename(b).startswith('BRIEF-M5-'):
            medidas_do_m5 = lido

    # As duas leituras conferem-se uma à outra: as contagens deste portão contra
    # as que o guião do M5 mede por conta própria. Duas leituras que discordem
    # são um defeito de uma delas, e cala-lo era o mesmo que não medir.
    if medidas_do_m5:
        esperado = {m.get('nome'): m.get('valor') for m in medidas_do_m5.get('medidas', [])}
        for chave, contado in (
            ('briefs_conferidos_pelo_portao', len(conferidos)),
            ('briefs_isentos_por_data', len(por_data)),
            ('briefs_isentos_por_nomeacao', len(por_nomeacao)),
        ):
            if chave in esperado and esperado[chave] != contado:
                erros.append(
                    f'as duas leituras discordam: este portão conta {contado} em «{chave}» e o guião do '
                    f'M5 mediu {esperado[chave]}.')

    print(f'  portão dos briefs · {len(briefs)} brief(s) em design/observatorio/ · '
          f'{len(conferidos)} conferido(s) · {len(por_data)} isento(s) por data (anteriores a '
          f'{CORTE[2]:02d}.{CORTE[1]:02d}.{CORTE[0]}) · {len(por_nomeacao)} isento(s) por nomeação')
    if not so_contagens:
        for b in conferidos:
            print(f'    conferido: {os.path.basename(b)} (medidas/{chave_do_brief(b)}.json)')
        for nome, razao in por_nomeacao:
            print(f'    isento por nomeação: {nome} · {razao}')

    if erros:
        print('')
        print(f'  O PORTÃO DOS BRIEFS FECHOU — {len(erros)} erro(s):')
        for e in erros:
            print(f'    · {e}')
        return 1
    print('  ✓ cada brief sob a regra mede-se por guião, o detetor prova que vê, e o §0 só diz números medidos.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
