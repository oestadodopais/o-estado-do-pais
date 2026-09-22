#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-M5-as-medicoes-provam-que-veem.md`.

uso: python3 design/observatorio/medidas/BRIEF-M5.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-M5.json` e imprime o mesmo JSON. Com
`OEDP_MEDIDAS_JSON=<caminho>` escreve nesse caminho, que é como o
`scripts/check-briefs.py` o corre para comparar o que se mede hoje com o que
está escrito sem lhe tocar no ficheiro.

É o primeiro guião de medições de um brief, e o modelo dos que vierem. Cada
medição traz quatro coisas: o `nome` por que o §0 a cita, o `valor`, o `comando`
que um leitor corre para a repetir, e um `conhecido_positivo`, que é uma coisa
que o MESMO detetor tem de encontrar para provar que vê. A razão está na M18 e
na §1.120: a 22.09.2026 dois §0 afirmaram factos medidos por detetores cegos, e
um zero de um detetor que não deteta nada não é um zero.

CADA MEDIÇÃO É ESTÁVEL DE PROPÓSITO, e isso é uma regra do formato e não um
acaso. O portão volta a correr este guião em cada `verify`, e compara. Uma
medição que ande com o trabalho de todos os dias (o número de briefs que
existem, o número de ficheiros de `src/`) punha o portão vermelho no dia
seguinte e obrigava a reescrever o §0 de um brief antigo, que é o que a regra 3
do M5 proíbe. Por isso as contagens de briefs são ancoradas na data do brief
(«até 22.09.2026») e as outras são invariantes que um portão já protege.

O NOME DE QUEM RESPONDE não se escreve aqui: lê-se do oráculo do portão,
`scripts/textos-aprovados.json`, que é o único sítio do repositório onde ele
mora desde 22.09.2026 (M5).
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
OBSERVATORIO = os.path.join(RAIZ, 'design', 'observatorio')
MEDIDAS = os.path.join(OBSERVATORIO, 'medidas')
CORTE = (2026, 9, 22)

RE_DATA_NO_NOME = re.compile(r'(\d{4})-(\d{2})-(\d{2})')
RE_DATA_NO_CABECALHO = re.compile(r'(\d{2})\.(\d{2})\.(\d{4})')
RE_TITULO_ZERO = re.compile(r'^##\s+0\b', re.M)
RE_TITULO_QUALQUER = re.compile(r'^##\s', re.M)

# A mesma lista fechada do `scripts/check-briefs.py`, escrita aqui outra vez de
# propósito: este guião é um leitor próprio, e a conferência das duas leituras
# uma contra a outra está no portão, que compara as suas contagens com estas.
ISENTOS_POR_NOMEACAO = (
    'BRIEF-B1c-o-que-mudou-no-seu-lugar.md',
    'BRIEF-I129-o-grupo-etario-dos-jovens-nem.md',
    'BRIEF-M3b-os-nomes-confirmados-voltam-aos-recibos.md',
)

BINARIOS = re.compile(r'\.(woff2?|ttf|otf|eot|png|jpe?g|webp|avif|gif|ico|pdf|zip|mp4|webm)$', re.I)


def briefs():
    return sorted(
        os.path.join(OBSERVATORIO, f)
        for f in os.listdir(OBSERVATORIO)
        if f.startswith('BRIEF-') and f.endswith('.md')
    )


def data_do_brief(caminho):
    m = RE_DATA_NO_NOME.search(os.path.basename(caminho))
    if m:
        return (int(m.group(1)), int(m.group(2)), int(m.group(3)))
    cabecalho = '\n'.join(open(caminho, encoding='utf-8').read().split('\n')[:10])
    m = RE_DATA_NO_CABECALHO.search(cabecalho)
    return (int(m.group(3)), int(m.group(2)), int(m.group(1))) if m else None


def tem_seccao_de_medicoes(caminho):
    texto = open(caminho, encoding='utf-8').read()
    if RE_TITULO_ZERO.search(texto):
        return True
    for t in RE_TITULO_QUALQUER.finditer(texto):
        fim = texto.find('\n', t.start())
        if 'o que se mediu' in texto[t.start():fim if fim != -1 else len(texto)].lower():
            return True
    return False


def guiao_de(caminho):
    campos = os.path.basename(caminho)[:-3].split('-')
    chave = '-'.join(campos[:2]) if len(campos) >= 2 else campos[0]
    for ext in ('.py', '.mjs'):
        g = os.path.join(MEDIDAS, chave + ext)
        if os.path.isfile(g):
            return os.path.relpath(g, RAIZ)
    return None


def ficheiros_de_fonte():
    out = []
    for base in ('src', 'public'):
        for dirpath, _, nomes in os.walk(os.path.join(RAIZ, base)):
            for n in nomes:
                if not BINARIOS.search(n):
                    out.append(os.path.join(dirpath, n))
    return sorted(out)


def conta_o_nome(texto, nome):
    """O detetor do nome, um só, usado no valor e no conhecido-positivo."""
    return texto.count(nome)


def main():
    lista = briefs()
    ate_ao_corte = [b for b in lista if (data_do_brief(b) or (9999, 1, 1)) <= CORTE]
    com_seccao = [b for b in ate_ao_corte if tem_seccao_de_medicoes(b)]
    com_guiao = [b for b in ate_ao_corte if guiao_de(b)]
    isentos_por_data = [b for b in lista
                        if os.path.basename(b) not in ISENTOS_POR_NOMEACAO
                        and (data_do_brief(b) or (9999, 1, 1)) < CORTE]
    isentos_por_nomeacao = [b for b in lista if os.path.basename(b) in ISENTOS_POR_NOMEACAO]

    este = 'BRIEF-M5-as-medicoes-provam-que-veem.md'
    caminho_deste = os.path.join(OBSERVATORIO, este)
    velho = 'BRIEF-F1.1-porta-da-frente.md'

    nome = json.load(open(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json'),
                          encoding='utf-8'))['responsavel']
    fontes = ficheiros_de_fonte()
    com_o_nome = [f for f in fontes if conta_o_nome(open(f, encoding='utf-8', errors='replace').read(), nome)]

    politica = open(os.path.join(RAIZ, 'src', 'data', 'politica-ia.mjs'), encoding='utf-8').read()
    exportacoes = re.findall(r'^export const (\w+)\s*=\s*(.*)$', politica, re.M)

    medidas = [
        {
            'nome': 'briefs_ate_22_09_2026',
            'valor': len(ate_ao_corte),
            'comando': 'python3 design/observatorio/medidas/BRIEF-M5.py',
            'conhecido_positivo': {
                'o_que': f'o próprio brief («{este}») está na lista que o mesmo leitor devolve',
                'encontrado': caminho_deste in ate_ao_corte,
            },
        },
        {
            'nome': 'briefs_com_seccao_de_medicoes',
            'valor': len(com_seccao),
            'comando': 'python3 design/observatorio/medidas/BRIEF-M5.py',
            'conhecido_positivo': {
                'o_que': f'o mesmo leitor encontra a secção de medições no próprio brief («{este}»)',
                'encontrado': tem_seccao_de_medicoes(caminho_deste),
            },
        },
        {
            'nome': 'briefs_com_guiao_de_medicoes',
            'valor': len(com_guiao),
            'comando': 'ls design/observatorio/medidas/*.py design/observatorio/medidas/*.mjs',
            'conhecido_positivo': {
                'o_que': 'o mesmo localizador encontra o guião deste brief',
                'encontrado': guiao_de(caminho_deste) == 'design/observatorio/medidas/BRIEF-M5.py',
            },
        },
        {
            'nome': 'briefs_isentos_por_data',
            'valor': len(isentos_por_data),
            'comando': 'python3 scripts/check-briefs.py --contagens',
            'conhecido_positivo': {
                'o_que': f'um brief antigo nomeado («{velho}») cai na isenção por data, pelo mesmo leitor',
                'encontrado': os.path.join(OBSERVATORIO, velho) in isentos_por_data,
            },
        },
        {
            'nome': 'briefs_isentos_por_nomeacao',
            'valor': len(isentos_por_nomeacao),
            'comando': 'python3 scripts/check-briefs.py --contagens',
            'conhecido_positivo': {
                'o_que': 'o B1c, que o §0 do seu próprio brief errou duas vezes, está entre os nomeados',
                'encontrado': os.path.join(OBSERVATORIO, ISENTOS_POR_NOMEACAO[0]) in isentos_por_nomeacao,
            },
        },
        {
            'nome': 'ocorrencias_do_nome_de_quem_responde_em_src_e_public',
            'valor': len(com_o_nome),
            'comando': 'grep -rn "$(python3 -c \'import json;print(json.load(open("scripts/textos-aprovados.json"))["responsavel"])\')" src/ public/',
            'conhecido_positivo': {
                'o_que': 'o mesmo detetor encontra o nome uma vez numa linha escrita com ele',
                'encontrado': conta_o_nome(f'<p>{nome}</p>', nome) == 1,
            },
        },
        {
            'nome': 'exportacoes_de_politica_ia_com_o_nome_de_quem_responde',
            'valor': sum(1 for _, v in exportacoes if nome in v),
            'comando': 'grep -n "^export const" src/data/politica-ia.mjs',
            'conhecido_positivo': {
                'o_que': 'o mesmo leitor encontra `export const LINGUA_DO_RESPONSAVEL` no mesmo ficheiro',
                'encontrado': any(n == 'LINGUA_DO_RESPONSAVEL' for n, _ in exportacoes),
            },
        },
    ]

    saida = {
        'brief': f'design/observatorio/{este}',
        'guiao': 'design/observatorio/medidas/BRIEF-M5.py',
        'medidas': medidas,
    }
    texto = json.dumps(saida, ensure_ascii=False, indent=2) + '\n'
    alvo = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(MEDIDAS, 'BRIEF-M5.json')
    os.makedirs(os.path.dirname(os.path.abspath(alvo)), exist_ok=True)
    with open(alvo, 'w', encoding='utf-8') as f:
        f.write(texto)
    sys.stdout.write(texto)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
