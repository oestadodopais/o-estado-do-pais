#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-M4b-o-livro-razao-do-11-reparado-e-declarado.md`.

uso: python3 design/observatorio/medidas/BRIEF-M4b.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-M4b.json` e imprime o mesmo JSON. Com
`OEDP_MEDIDAS_JSON=<caminho>` escreve nesse caminho, que é como o
`scripts/check-briefs.py` o corre para comparar o que se mede hoje com o que
está escrito sem lhe tocar no ficheiro.

O QUE ESTE GUIÃO LÊ. A cópia das medições do bloco M4 do motor,
`design/especime-v3/medicoes/m4-2026-09-22/medidas.json`, copiada byte a byte do
motor (`content/11 Seguranca Social/Technical Source/medidas.json`, escrito por
`medir.py` a 22.09.2026 na cabeça do M4) e presa pelo sha256 escrito abaixo: se a
cópia mudar, este guião sai a 1 e diz, em vez de medir outra coisa em silêncio.
E a origem fixada do documento do estudo em `studies-src/`, que é uma invariante
que o `gate:html` já protege (o documento servido tem de ser byte a byte o da
origem). Cada medição é estável de propósito: o portão volta a correr este guião
em cada `verify`.

CADA MEDIÇÃO TRAZ UM CONHECIDO-POSITIVO: algo que o MESMO leitor tem de encontrar
para provar que vê (a regra 14, a M18 e a §1.120). Um zero de um detetor que não
deteta nada não é um zero.
"""
import hashlib
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
BRIEF = 'design/observatorio/BRIEF-M4b-o-livro-razao-do-11-reparado-e-declarado.md'
GUIAO = 'design/observatorio/medidas/BRIEF-M4b.py'
COPIA = 'design/especime-v3/medicoes/m4-2026-09-22/medidas.json'
SHA256_DA_COPIA = '610a96270f7b0f2ac0766e374e4f5caee46916d8dfda2706989c81cf98b6ac1e'
LIVRO_DO_11 = 'content/11 Seguranca Social/ledger.json'
LIVRO_DA_TRAVESSIA = 'content/03 Regional Economy/Travessia das Regioes/ledger.json'
ORIGEM_DO_DOCUMENTO = 'studies-src/penalizacoes-por-reforma-antecipada-2026/pt.html'
OUTRA_ORIGEM = 'studies-src/evora-2027-prometido-painel-dinheiro'
COMANDO = 'python3 design/observatorio/medidas/BRIEF-M4b.py'
_RE_DESVIOS = re.compile(r'(\d+) drift\(s\)')
_RE_COMPARADAS = re.compile(r'(\d+) rows compared')


def medida(nome, valor, o_que, encontrado, comando=COMANDO):
    return {'nome': nome, 'valor': valor, 'comando': comando,
            'conhecido_positivo': {'o_que': o_que, 'encontrado': bool(encontrado)}}


def main():
    caminho = os.path.join(RAIZ, COPIA)
    dados = open(caminho, 'rb').read()
    sha = hashlib.sha256(dados).hexdigest()
    if sha != SHA256_DA_COPIA:
        print(f'a cópia das medições do M4 mudou: sha256 {sha}, e este guião só sabe medir a de {SHA256_DA_COPIA[:12]}…', file=sys.stderr)
        return 1
    m = json.loads(dados.decode('utf-8'))
    livro = m['estado_do_livro']
    defeitos = livro['defeitos_por_linha']
    familias = livro['familias']
    nove = livro['tres_recusas_das_nove']
    contra = m['contrafactual']
    html = contra['html']['medida']
    rel = contra['relatorio-md']['medida']
    par = contra['par_md_html']['ultima_linha']
    portao = m['portao_dos_livros_declarados']

    com_texto = sorted(k for k, v in defeitos.items() if 'valor_de_texto' in v)
    com_fonte_ma = sorted(k for k, v in defeitos.items() if any(d.startswith('source_type_invalido:') for d in v))
    derived = sorted(k for k, v in defeitos.items() if 'source_type_invalido:derived' in v)
    sem_excerto = sorted(k for k, v in nove.items() if v.get('valor_no_proprio_excerpt') is False)
    com_excerto = sorted(k for k, v in nove.items() if v.get('valor_no_proprio_excerpt') is True)
    desvios = _RE_DESVIOS.search(par)
    comparadas = _RE_COMPARADAS.search(par)

    medidas = [
        medida('linhas', livro['linhas'],
               'o mesmo leitor encontra a linha «relatorio-titulo» entre as linhas com defeito', 'relatorio-titulo' in defeitos),
        medida('linhas_recusadas', livro['linhas_recusadas'],
               'a contagem escrita é a contagem das linhas com defeito, e «governo-posicao» está em duas famílias',
               livro['linhas_recusadas'] == len(defeitos) and len(defeitos.get('governo-posicao', [])) == 2),
        medida('valor_de_texto', familias['valor_de_texto']['n'],
               'a contagem é a das linhas com «valor_de_texto», e «relatorio-titulo» é uma delas',
               familias['valor_de_texto']['n'] == len(com_texto) and 'relatorio-titulo' in com_texto),
        medida('sem_valor_no_excerto', len(sem_excerto),
               'o mesmo leitor distingue as duas que TÊM o valor no excerto («fs-penalizacao-seletiva», «fs-heterogeneidade-longevidade»)',
               com_excerto == ['fs-heterogeneidade-longevidade', 'fs-penalizacao-seletiva']),
        medida('source_type_invalido', familias['source_type_invalido']['n'],
               'a contagem é a das linhas com «source_type_invalido», e «cgtp-saldo-2025» (union) é uma delas',
               familias['source_type_invalido']['n'] == len(com_fonte_ma) and 'cgtp-saldo-2025' in com_fonte_ma),
        medida('derived', familias['source_type_invalido']['por_valor']['derived'],
               'a contagem é a das linhas com «source_type_invalido:derived», e «fefss-cobertura-recalculada» é uma delas',
               familias['source_type_invalido']['por_valor']['derived'] == len(derived) and 'fefss-cobertura-recalculada' in derived),
        medida('entity_aliases_errado', familias['entity_aliases']['aceite'] is False,
               'a recusa do motor nomeia a chave «GT»', 'GT' in familias['entity_aliases'].get('recusa', '')),
        medida('numeros_html', html['numbers'], 'a última linha do core.reconcile na mesma cópia diz o mesmo número',
               f"{html['numbers']} numbers" in contra['html']['reconcile']['ultima_linha']),
        medida('casados_html', html['matched'], 'a última linha do core.reconcile diz o mesmo número de casados',
               f"{html['matched']} matched" in contra['html']['reconcile']['ultima_linha']),
        medida('orfaos_html', html['orphans'], 'a última linha do core.reconcile diz o mesmo número de órfãos',
               f"{html['orphans']} orphans" in contra['html']['reconcile']['ultima_linha']),
        medida('erradas_html', html['misattributions'], 'a última linha do core.attributions diz o mesmo número',
               f"{html['misattributions']} misattributions" in contra['html']['attributions']['ultima_linha']),
        medida('numeros_relatorio', rel['numbers'], 'a última linha do core.reconcile na mesma cópia diz o mesmo número',
               f"{rel['numbers']} numbers" in contra['relatorio-md']['reconcile']['ultima_linha']),
        medida('casados_relatorio', rel['matched'], 'a última linha do core.reconcile diz o mesmo número de casados',
               f"{rel['matched']} matched" in contra['relatorio-md']['reconcile']['ultima_linha']),
        medida('orfaos_relatorio', rel['orphans'], 'a última linha do core.reconcile diz o mesmo número de órfãos',
               f"{rel['orphans']} orphans" in contra['relatorio-md']['reconcile']['ultima_linha']),
        medida('erradas_relatorio', rel['misattributions'], 'a última linha do core.attributions diz o mesmo número',
               f"{rel['misattributions']} misattributions" in contra['relatorio-md']['attributions']['ultima_linha']),
        medida('desvios_do_par', int(desvios.group(1)) if desvios else None,
               'a mesma expressão lê na mesma linha as linhas comparadas (40)', bool(comparadas) and comparadas.group(1) == '40'),
        medida('excecao_escrita', LIVRO_DO_11 in portao['excecoes'] and not portao['orfaos'],
               'a mesma lista traz a outra exceção, a Travessia das Regiões', LIVRO_DA_TRAVESSIA in portao['excecoes']),
        medida('documento_com_origem_fixada', os.path.isfile(os.path.join(RAIZ, ORIGEM_DO_DOCUMENTO)),
               'o mesmo leitor encontra a origem de outro estudo em studies-src/', os.path.isdir(os.path.join(RAIZ, OUTRA_ORIGEM)),
               comando='ls studies-src/penalizacoes-por-reforma-antecipada-2026/'),
    ]
    saida = {'brief': BRIEF, 'guiao': GUIAO, 'copia': {'ficheiro': COPIA, 'sha256': sha}, 'medidas': medidas}
    destino = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-M4b.json')
    texto = json.dumps(saida, ensure_ascii=False, indent=2) + '\n'
    with open(destino, 'w', encoding='utf-8') as f:
        f.write(texto)
    print(texto)
    faltas = [x['nome'] for x in medidas if not x['conhecido_positivo']['encontrado'] or x['valor'] in (None, False)]
    if faltas:
        print(f'medições sem conhecido-positivo ou sem valor: {faltas}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
