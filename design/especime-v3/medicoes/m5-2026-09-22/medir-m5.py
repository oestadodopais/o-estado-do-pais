#!/usr/bin/env python3
"""As medições do relatório do M5. Nenhum número do relatório se escreve de cabeça: sai daqui.

uso: python3 design/especime-v3/medicoes/m5-2026-09-22/medir-m5.py   (na raiz do repositório)

Escreve `design/especime-v3/medicoes/m5-2026-09-22/medidas.json`, que é o
ficheiro contra o qual o `scripts/leituras/conferir-relatorio.py` confere o
`LEIA-ME.md` deste bloco.

SAI COM CÓDIGO DIFERENTE DE 0 quando qualquer conferência subordinada falha ou
não corre (a leitura a frio de 22.09.2026, achado 13), e diz quais. Um guião de
medição que engole a falha de quem chama escreve um ficheiro com buracos e
deixa-o parecer completo; e quem o corre num `&&` não dá por nada.

OS CONHECIDOS-POSITIVOS LEEM-SE DE UMA CORRIDA FRESCA e não do JSON já guardado
(o mesmo achado): ler «encontrado: true» do ficheiro que está no disco é ler a
resposta de ontem. O guião do brief é corrido aqui outra vez, com
`OEDP_MEDIDAS_JSON` num ficheiro temporário, como o portão faz.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))))
AQUI = os.path.dirname(os.path.abspath(__file__))
DIST = os.environ.get('OEDP_DIST') or os.path.join(RAIZ, 'dist')
BINARIOS = re.compile(r'\.(woff2?|ttf|otf|eot|png|jpe?g|webp|avif|gif|ico|pdf|zip|mp4|webm)$', re.I)
MAPA = 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'

RELATORIOS = {
    'b1_peca3': 'design/especime-v3/medicoes/b1-2026-09-22/LEIA-ME-peca3.md',
    'm3b': 'design/especime-v3/medicoes/m3b-2026-09-22/LEIA-ME.md',
    'i129': 'design/especime-v3/medicoes/i129-2026-09-22/LEIA-ME.md',
    'b1c': 'design/especime-v3/medicoes/b1c-2026-09-22/LEIA-ME.md',
}

# Os ficheiros que este bloco acrescentou e que o mapa cita por `ficheiro:linha`.
GUIOES_DESTE_BLOCO = (
    'scripts/check-briefs.py',
    'scripts/leituras/conferir-relatorio.py',
    'design/observatorio/medidas/BRIEF-M5.py',
)

FALHAS = []


def falha(o_que):
    FALHAS.append(o_que)


def sha(caminho):
    return hashlib.sha256(open(caminho, 'rb').read()).hexdigest()


def confere_relatorio(chave, rel):
    """Corre o guião sobre um relatório e devolve as suas contagens."""
    r = subprocess.run(
        ['python3', 'scripts/leituras/conferir-relatorio.py', rel, os.path.dirname(rel)],
        cwd=RAIZ, capture_output=True, text=True)
    if r.returncode >= 2:
        falha(f'conferir-relatorio.py sobre {chave} saiu com {r.returncode}')
        return {'erro': (r.stdout + r.stderr)[-400:], 'codigo': r.returncode}
    n = {}
    for campo, etiqueta in (('conferidos', 'números conferidos:'),
                            ('com_ficheiro', 'números com ficheiro:'),
                            ('sem_ficheiro', 'números sem ficheiro:'),
                            ('ficheiros_json', 'ficheiros JSON lidos:')):
        m = re.search(re.escape(etiqueta) + r'\s*(\d+)', r.stdout)
        if m is None:
            falha(f'conferir-relatorio.py sobre {chave} não imprimiu «{etiqueta}»')
        n[campo] = int(m.group(1)) if m else None
    n['conhecido_positivo_encontrado'] = (
        'conhecido-positivo' in r.stdout and 'NÃO ENCONTRADO' not in r.stdout)
    if not n['conhecido_positivo_encontrado']:
        falha(f'o conhecido-positivo do conferir-relatorio.py sobre {chave} não foi encontrado')
    n['codigo'] = r.returncode
    return n


def ficheiros_de_fonte():
    out = []
    for base in ('src', 'public'):
        for dirpath, _, nomes in os.walk(os.path.join(RAIZ, base)):
            for nome in nomes:
                if not BINARIOS.search(nome):
                    out.append(os.path.join(dirpath, nome))
    return sorted(out)


def regras_do_metodo(nome):
    """As dez regras do Método, lidas com um leitor próprio, à procura do nome."""
    guiao = (
        "import('./src/data/metodo.mjs').then(m => {"
        " const fortes = [];"
        " const anda = (v) => { if (Array.isArray(v)) return void v.forEach(anda);"
        "   if (v && typeof v === 'object') { if (typeof v.forte === 'string') fortes.push(v.forte);"
        "   return void Object.values(v).forEach(anda); } };"
        " anda(m.REGRAS);"
        " const nome = process.argv[1];"
        " console.log(JSON.stringify({ regras: m.REGRAS.length, pedacos_forte: fortes.length,"
        "   fortes_com_o_nome: fortes.filter((f) => f.includes(nome)).length,"
        "   texto_das_regras_com_o_nome: JSON.stringify(m.REGRAS).split(nome).length - 1 }));"
        "});"
    )
    r = subprocess.run(['node', '-e', guiao, nome], cwd=RAIZ, capture_output=True, text=True)
    if r.returncode != 0:
        falha(f'a leitura das regras do Método não correu: {(r.stderr or r.stdout)[-200:]}')
        return {'erro': (r.stderr or r.stdout)[-300:]}
    lido = json.loads(r.stdout.strip().split('\n')[-1])
    lido['conhecido_positivo'] = {
        'o_que': 'o mesmo leitor conta as dez regras do Método',
        'encontrado': lido['regras'] == 10,
    }
    if not lido['conhecido_positivo']['encontrado']:
        falha('a leitura das regras do Método não viu dez regras; os zeros dela não valem')
    return lido


def medidas_do_brief():
    """Corre o guião do brief OUTRA VEZ, e lê dele os conhecidos-positivos."""
    escrito = json.load(open(os.path.join(RAIZ, 'design/observatorio/medidas/BRIEF-M5.json'),
                             encoding='utf-8'))
    with tempfile.TemporaryDirectory() as tmp:
        alvo = os.path.join(tmp, 'medidas.json')
        r = subprocess.run(['python3', 'design/observatorio/medidas/BRIEF-M5.py'], cwd=RAIZ,
                           env=dict(os.environ, OEDP_MEDIDAS_JSON=alvo),
                           capture_output=True, text=True)
        if r.returncode != 0 or not os.path.isfile(alvo):
            falha(f'o guião do brief não correu (código {r.returncode})')
            return {'erro': (r.stderr or r.stdout)[-300:]}
        fresco = json.load(open(alvo, encoding='utf-8'))
    encontrados = sum(1 for x in fresco['medidas'] if x['conhecido_positivo']['encontrado'] is True)
    if encontrados != len(fresco['medidas']):
        falha(f'{len(fresco["medidas"]) - encontrados} conhecido(s)-positivo(s) do guião do brief '
              f'não foram encontrados numa corrida fresca')
    if [m['nome'] for m in fresco['medidas']] != [m['nome'] for m in escrito['medidas']]:
        falha('o guião do brief já não mede as mesmas medições que o ficheiro guardado')
    return {
        'ficheiro': 'design/observatorio/medidas/BRIEF-M5.json',
        'quantas': len(fresco['medidas']),
        'conhecidos_positivos_encontrados_numa_corrida_fresca': encontrados,
        'valores': {x['nome']: x['valor'] for x in fresco['medidas']},
    }


def portao_dos_briefs():
    r = subprocess.run(['python3', 'scripts/check-briefs.py'], cwd=RAIZ,
                       capture_output=True, text=True)
    if r.returncode != 0:
        falha(f'o check:briefs saiu com {r.returncode}')
    m = re.search(r'· (\d+) brief\(s\) em design/observatorio/ · (\d+) conferido\(s\) · (\d+) '
                  r'isento\(s\) por data .*? · (\d+) isento\(s\) por nomeação', r.stdout)
    if m is None:
        falha('o check:briefs não imprimiu a linha das contagens')
    return {
        'no_observatorio': int(m.group(1)) if m else None,
        'conferidos': int(m.group(2)) if m else None,
        'isentos_por_data': int(m.group(3)) if m else None,
        'isentos_por_nomeacao': int(m.group(4)) if m else None,
        'ligacoes_do_zero': len(re.findall(r'§0 liga «', r.stdout)),
        'codigo': r.returncode,
    }


def mapa_do_repositorio():
    """A corrida do `conferir-mapa.py`, guardada, e as citações deste bloco contadas.

    O mapa é mantido pelo lugar de direção e pode mudar depois desta leitura; o
    sha256 fica registado para que se saiba de que versão é esta medição.
    """
    caminho = os.path.join(RAIZ, MAPA)
    if not os.path.isfile(caminho):
        falha(f'não existe {MAPA}')
        return {'erro': 'não existe'}
    r = subprocess.run(['python3', 'scripts/leituras/conferir-mapa.py', MAPA],
                       cwd=RAIZ, capture_output=True, text=True)
    with open(os.path.join(AQUI, 'conferir-mapa.txt'), 'w', encoding='utf-8') as f:
        f.write(f'mapa: {MAPA}\nsha256 do mapa nesta corrida: {sha(caminho)}\n\n')
        f.write(r.stdout + r.stderr)
        f.write(f'\ncódigo de saída: {r.returncode}\n')
    if r.returncode != 0:
        falha(f'o conferir-mapa.py saiu com {r.returncode}')
    texto = open(caminho, encoding='utf-8').read()
    citacoes = sum(len(re.findall(r'`' + re.escape(g) + r':\d+`', texto)) for g in GUIOES_DESTE_BLOCO)
    lido = {}
    for campo, etiqueta in (
        ('na_linha_citada', 'citações conferidas na linha citada'),
        ('noutro_ponto', 'citação está no ficheiro, mas longe da linha citada:'),
        ('nao_encontradas', 'citação não encontrada em nenhum dos ficheiros citados na mesma linha:'),
        ('para_la_do_fim', 'linha citada para lá do fim do ficheiro:'),
    ):
        m = re.search(re.escape(etiqueta) + r'\D*(\d+)', r.stdout)
        lido[campo] = int(m.group(1)) if m else None
    lido['sha256_do_mapa'] = sha(caminho)
    lido['citacoes_dos_guioes_deste_bloco'] = citacoes
    lido['codigo'] = r.returncode
    return lido


def portoes():
    """Os três portões, lidos dos ficheiros que cada corrida escreveu, nunca de memória (M16)."""
    import datetime
    out = {}
    for qual in ('build', 'verify', 'typecheck'):
        entrada = {}
        for campo in ('codigo', 'inicio', 'fim', 'cabeca'):
            f = os.path.join(AQUI, f'{qual}.{campo}')
            entrada[campo] = open(f, encoding='utf-8').read().strip() if os.path.isfile(f) else None
        if entrada['codigo'] not in (None, '0'):
            falha(f'o portão {qual} está registado com o código {entrada["codigo"]}')
        if entrada['inicio'] and entrada['fim']:
            a = datetime.datetime.fromisoformat(entrada['inicio'].replace('Z', '+00:00'))
            b = datetime.datetime.fromisoformat(entrada['fim'].replace('Z', '+00:00'))
            segundos = int((b - a).total_seconds())
            entrada['segundos'] = segundos
            entrada['minutos'] = segundos // 60
            entrada['segundos_restantes'] = segundos % 60
        out[qual] = entrada
    return out


def main():
    nome = json.load(open(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json'),
                          encoding='utf-8'))['responsavel']

    fontes = ficheiros_de_fonte()
    fontes_com_o_nome = sum(
        1 for f in fontes if nome in open(f, encoding='utf-8', errors='replace').read())

    paginas = paginas_com_o_nome = None
    if os.path.isdir(DIST):
        paginas, paginas_com_o_nome = 0, 0
        for dirpath, _, nomes in os.walk(DIST):
            for n in nomes:
                if not n.endswith('.html'):
                    continue
                paginas += 1
                if nome in open(os.path.join(dirpath, n), encoding='utf-8', errors='replace').read():
                    paginas_com_o_nome += 1
    else:
        falha('não existe dist/, e o relatório cita números das páginas construídas')

    plantas_ficheiro = os.path.join(AQUI, 'plantas-m5.json')
    plantas = {'corridas': None, 'morderam': None, 'bytes_repostos': None}
    if os.path.isfile(plantas_ficheiro):
        lista = json.load(open(plantas_ficheiro, encoding='utf-8'))['plantas']
        plantas = {
            'corridas': len(lista),
            'morderam': sum(1 for p in lista if p['passou']),
            'bytes_repostos': sum(1 for p in lista if p['antes'] == p['reposto']),
        }
        if plantas['morderam'] != plantas['corridas']:
            falha(f'{plantas["corridas"] - plantas["morderam"]} planta(s) não morderam')
    else:
        falha('não existe plantas-m5.json')

    saida = {
        'cabeca': subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=RAIZ,
                                 capture_output=True, text=True).stdout.strip(),
        'nome_de_quem_responde': {
            'onde_mora': 'scripts/textos-aprovados.json',
            'sha256_do_oraculo': sha(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json')),
            'ficheiros_de_src_e_public_lidos': len(fontes),
            'ficheiros_de_src_e_public_com_o_nome': fontes_com_o_nome,
            'paginas_construidas': paginas,
            'paginas_construidas_com_o_nome': paginas_com_o_nome,
            'dist_lido': os.path.isdir(DIST),
            'regras_do_metodo': regras_do_metodo(nome),
        },
        'portao_dos_briefs': portao_dos_briefs(),
        'medidas_do_brief_m5': medidas_do_brief(),
        'relatorios_de_22_09': {k: confere_relatorio(k, v) for k, v in RELATORIOS.items()},
        'plantas': plantas,
        'mapa_do_repositorio': mapa_do_repositorio(),
        'portoes': portoes(),
    }

    alvo = os.path.join(AQUI, 'medidas.json')
    with open(alvo, 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(json.dumps(saida, ensure_ascii=False, indent=2))
    if FALHAS:
        print('')
        print(f'medir-m5.py: {len(FALHAS)} conferência(s) subordinada(s) falharam ou não correram:',
              file=sys.stderr)
        for f in FALHAS:
            print(f'  · {f}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
