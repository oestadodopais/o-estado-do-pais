#!/usr/bin/env python3
"""As medições do relatório do M5. Nenhum número do relatório se escreve de cabeça: sai daqui.

uso: python3 design/especime-v3/medicoes/m5-2026-09-22/medir-m5.py   (na raiz do repositório)

Escreve `design/especime-v3/medicoes/m5-2026-09-22/medidas.json`, que é o
ficheiro contra o qual o `scripts/leituras/conferir-relatorio.py` confere o
`LEIA-ME.md` deste bloco. Precisa de um `dist/` construído para as contagens de
páginas, e diz «sem dist/» em vez de inventar um número quando não o há.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))))
AQUI = os.path.dirname(os.path.abspath(__file__))
DIST = os.environ.get('OEDP_DIST') or os.path.join(RAIZ, 'dist')
BINARIOS = re.compile(r'\.(woff2?|ttf|otf|eot|png|jpe?g|webp|avif|gif|ico|pdf|zip|mp4|webm)$', re.I)

RELATORIOS = {
    'b1_peca3': 'design/especime-v3/medicoes/b1-2026-09-22/LEIA-ME-peca3.md',
    'm3b': 'design/especime-v3/medicoes/m3b-2026-09-22/LEIA-ME.md',
    'i129': 'design/especime-v3/medicoes/i129-2026-09-22/LEIA-ME.md',
    'b1c': 'design/especime-v3/medicoes/b1c-2026-09-22/LEIA-ME.md',
}


def confere_relatorio(rel):
    """Corre o guião sobre um relatório e devolve as suas três contagens."""
    r = subprocess.run(
        ['python3', 'scripts/leituras/conferir-relatorio.py', rel, os.path.dirname(rel)],
        cwd=RAIZ, capture_output=True, text=True)
    if r.returncode >= 2:
        return {'erro': r.stdout[-400:] + r.stderr[-400:], 'codigo': r.returncode}
    n = {}
    for chave, etiqueta in (('conferidos', 'números conferidos:'),
                            ('com_ficheiro', 'números com ficheiro:'),
                            ('sem_ficheiro', 'números sem ficheiro:'),
                            ('ficheiros_json', 'ficheiros JSON lidos:')):
        m = re.search(re.escape(etiqueta) + r'\s*(\d+)', r.stdout)
        n[chave] = int(m.group(1)) if m else None
    n['conhecido_positivo_encontrado'] = 'conhecido-positivo' in r.stdout and 'NÃO ENCONTRADO' not in r.stdout
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
    """As dez regras do Método, lidas com um leitor próprio, à procura do nome.

    A metade antiga da célula do `gate:html` procura o nome nos pedaços
    `{ forte: … }` das regras. Esta leitura conta-os, e conta também as
    ocorrências do nome no texto inteiro das regras, que é o que a metade nova
    apanha por ler o ficheiro. O conhecido-positivo é a contagem das regras: se
    o leitor não vir dez regras, não viu nada, e os zeros dele não valem.
    """
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
        return {'erro': (r.stderr or r.stdout)[-300:]}
    lido = json.loads(r.stdout.strip().split('\n')[-1])
    lido['conhecido_positivo'] = {
        'o_que': 'o mesmo leitor conta as dez regras do Método',
        'encontrado': lido['regras'] == 10,
    }
    return lido


def portoes():
    """Os três portões da cabeça final, lidos dos ficheiros que cada corrida escreveu.

    Nunca de memória (M16): se um ficheiro não existir, a entrada diz «não lido»
    em vez de um número.
    """
    import datetime
    out = {}
    for qual in ('build', 'verify', 'typecheck'):
        entrada = {}
        for campo in ('codigo', 'inicio', 'fim', 'cabeca'):
            f = os.path.join(AQUI, f'{qual}.{campo}')
            entrada[campo] = open(f, encoding='utf-8').read().strip() if os.path.isfile(f) else None
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

    portao = subprocess.run(['python3', 'scripts/check-briefs.py'],
                            cwd=RAIZ, capture_output=True, text=True)
    m = re.search(r'· (\d+) brief\(s\) em design/observatorio/ · (\d+) conferido\(s\) · (\d+) '
                  r'isento\(s\) por data .*? · (\d+) isento\(s\) por nomeação', portao.stdout)
    briefs = {
        'no_observatorio': int(m.group(1)) if m else None,
        'conferidos': int(m.group(2)) if m else None,
        'isentos_por_data': int(m.group(3)) if m else None,
        'isentos_por_nomeacao': int(m.group(4)) if m else None,
        'codigo': portao.returncode,
    }

    medidas_do_brief = json.load(open(
        os.path.join(RAIZ, 'design/observatorio/medidas/BRIEF-M5.json'), encoding='utf-8'))

    plantas_ficheiro = os.path.join(AQUI, 'plantas-m5.json')
    plantas = {'corridas': None, 'morderam': None}
    if os.path.isfile(plantas_ficheiro):
        lista = json.load(open(plantas_ficheiro, encoding='utf-8'))['plantas']
        plantas = {
            'corridas': len(lista),
            'morderam': sum(1 for p in lista if p['passou']),
            'bytes_repostos': sum(1 for p in lista if p['antes'] == p['reposto']),
        }

    saida = {
        'cabeca': subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=RAIZ,
                                 capture_output=True, text=True).stdout.strip(),
        'nome_de_quem_responde': {
            'onde_mora': 'scripts/textos-aprovados.json',
            'sha256_do_oraculo': hashlib.sha256(
                open(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json'), 'rb').read()).hexdigest(),
            'ficheiros_de_src_e_public_lidos': len(fontes),
            'ficheiros_de_src_e_public_com_o_nome': fontes_com_o_nome,
            'paginas_construidas': paginas,
            'paginas_construidas_com_o_nome': paginas_com_o_nome,
            'dist_lido': os.path.isdir(DIST),
            'regras_do_metodo': regras_do_metodo(nome),
        },
        'portao_dos_briefs': briefs,
        'medidas_do_brief_m5': {
            'ficheiro': 'design/observatorio/medidas/BRIEF-M5.json',
            'quantas': len(medidas_do_brief['medidas']),
            'conhecidos_positivos_encontrados': sum(
                1 for x in medidas_do_brief['medidas']
                if x['conhecido_positivo']['encontrado'] is True),
            # Os valores do brief entram aqui para que o relatório os possa citar:
            # um número do relatório tem de existir num JSON desta pasta.
            'valores': {x['nome']: x['valor'] for x in medidas_do_brief['medidas']},
        },
        'relatorios_de_22_09': {k: confere_relatorio(v) for k, v in RELATORIOS.items()},
        'plantas': plantas,
        'portoes': portoes(),
    }

    alvo = os.path.join(AQUI, 'medidas.json')
    with open(alvo, 'w', encoding='utf-8') as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(json.dumps(saida, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
