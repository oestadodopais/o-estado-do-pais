#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-M5-as-medicoes-provam-que-veem.md`.

uso: python3 design/observatorio/medidas/BRIEF-M5.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-M5.json` e imprime o mesmo JSON. Com
`OEDP_MEDIDAS_JSON=<caminho>` escreve nesse caminho, que é como o
`scripts/check-briefs.py` o corre para comparar o que se mede hoje com o que
está escrito sem lhe tocar no ficheiro.

É o primeiro guião de medições de um brief, e o modelo dos que vierem. Cada
medição traz quatro coisas: o `nome` por que o §0 o cita entre crases na frase
onde escreve o número, o `valor`, o `comando` que reproduz ESSE valor (ou que
diz o que reproduz), e um `conhecido_positivo`, que é um caso que o MESMO
predicado tem de dar por positivo. A razão está na M18 e na §1.120: a 22.09.2026
dois §0 afirmaram factos medidos por detetores cegos, e um zero de um detetor
que não deteta nada não é um zero.

UM CONHECIDO-POSITIVO É DO MESMO PREDICADO QUE O VALOR, e não de um vizinho (a
leitura a frio de 22.09.2026, achado 5). Provar que se consegue ler um ficheiro
não prova que se consegue apanhar o que lá se procura: cada conhecido-positivo
deste guião constrói um caso em que a resposta TEM de ser positiva e passa-o
pela MESMA função que produz o valor.

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
RE_EXPORTACAO = re.compile(r'^export const (\w+)\s*=\s*(.*)$', re.M)

# A mesma lista fechada do `scripts/check-briefs.py`, escrita aqui outra vez de
# propósito: este guião é um leitor próprio, e a conferência das duas leituras
# uma contra a outra está no portão, que compara as suas contagens com estas.
ISENTOS_POR_NOMEACAO = (
    'BRIEF-B1c-o-que-mudou-no-seu-lugar.md',
    'BRIEF-I129-o-grupo-etario-dos-jovens-nem.md',
    'BRIEF-M3b-os-nomes-confirmados-voltam-aos-recibos.md',
)

BINARIOS = re.compile(r'\.(woff2?|ttf|otf|eot|png|jpe?g|webp|avif|gif|ico|pdf|zip|mp4|webm)$', re.I)

LER_O_NOME = ('python3 -c "import json;print(json.load(open(\'scripts/textos-aprovados.json\'))'
              '[\'responsavel\'])"')


def briefs():
    return sorted(
        os.path.join(OBSERVATORIO, f)
        for f in os.listdir(OBSERVATORIO)
        if f.startswith('BRIEF-') and f.endswith('.md')
    )


def data_do_brief(caminho):
    """A mais recente entre a data do nome do ficheiro e a primeira do cabeçalho."""
    datas = []
    m = RE_DATA_NO_NOME.search(os.path.basename(caminho))
    if m:
        datas.append((int(m.group(1)), int(m.group(2)), int(m.group(3))))
    cabecalho = '\n'.join(open(caminho, encoding='utf-8').read().split('\n')[:10])
    m = RE_DATA_NO_CABECALHO.search(cabecalho)
    if m:
        datas.append((int(m.group(3)), int(m.group(2)), int(m.group(1))))
    return max(datas) if datas else None


def tem_seccao_de_medicoes(texto):
    """O predicado, sobre o TEXTO de um brief, para poder receber um caso construído."""
    if RE_TITULO_ZERO.search(texto):
        return True
    for t in RE_TITULO_QUALQUER.finditer(texto):
        fim = texto.find('\n', t.start())
        if 'o que se mediu' in texto[t.start():fim if fim != -1 else len(texto)].lower():
            return True
    return False


def chave_de(caminho):
    campos = os.path.basename(caminho)[:-3].split('-')
    return '-'.join(campos[:2]) if len(campos) >= 2 else campos[0]


def guiao_de(caminho):
    for ext in ('.py', '.mjs'):
        g = os.path.join(MEDIDAS, chave_de(caminho) + ext)
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


def exportacoes_com_o_nome(texto, nome):
    """O predicado das exportações, um só, usado no valor e no conhecido-positivo."""
    return sum(1 for _, valor in RE_EXPORTACAO.findall(texto) if nome in valor)


def main():
    lista = briefs()
    datas = {b: data_do_brief(b) for b in lista}
    ate_ao_corte = [b for b in lista if (datas[b] or (9999, 1, 1)) <= CORTE]
    com_seccao = [b for b in ate_ao_corte
                  if tem_seccao_de_medicoes(open(b, encoding='utf-8').read())]
    com_guiao = [b for b in ate_ao_corte if guiao_de(b)]
    nomeados = [b for b in lista if os.path.basename(b) in ISENTOS_POR_NOMEACAO]
    isentos_por_data = [b for b in lista
                        if b not in nomeados and (datas[b] or (9999, 1, 1)) < CORTE]
    # Os que o portão confere, ancorados na data como as outras contagens: os
    # briefs datados exactamente do corte que não estão na lista dos nomeados.
    conferidos = [b for b in ate_ao_corte if b not in nomeados and (datas[b] or (1, 1, 1)) >= CORTE]

    este = 'BRIEF-M5-as-medicoes-provam-que-veem.md'
    caminho_deste = os.path.join(OBSERVATORIO, este)
    velho = 'BRIEF-F1.1-porta-da-frente.md'

    nome = json.load(open(os.path.join(RAIZ, 'scripts', 'textos-aprovados.json'),
                          encoding='utf-8'))['responsavel']
    fontes = ficheiros_de_fonte()
    ocorrencias = sum(conta_o_nome(open(f, encoding='utf-8', errors='replace').read(), nome)
                      for f in fontes)

    politica = open(os.path.join(RAIZ, 'src', 'data', 'politica-ia.mjs'), encoding='utf-8').read()

    medidas = [
        {
            'nome': 'briefs_ate_22_09_2026',
            'valor': len(ate_ao_corte),
            'comando': ('python3 design/observatorio/medidas/BRIEF-M5.py · conta os BRIEF-*.md de '
                        'design/observatorio/ cuja data, a mais recente entre a do nome e a '
                        'primeira do cabeçalho, é anterior ou igual a 22.09.2026'),
            'conhecido_positivo': {
                'o_que': f'o mesmo leitor de datas aceita o próprio brief («{este}») como datado até ao corte',
                'encontrado': caminho_deste in ate_ao_corte,
            },
        },
        {
            'nome': 'briefs_com_seccao_de_medicoes',
            'valor': len(com_seccao),
            'comando': ('python3 design/observatorio/medidas/BRIEF-M5.py · dos briefs datados até '
                        '22.09.2026, os que têm um título `## 0` ou um título que diga «o que se mediu»'),
            'conhecido_positivo': {
                'o_que': ('o MESMO predicado, sobre um texto escrito no momento com um título '
                          '«## 0 · O que se mediu», responde que sim'),
                'encontrado': tem_seccao_de_medicoes('## 0 · O que se mediu\n\ncorpo\n') is True,
            },
        },
        {
            'nome': 'briefs_com_guiao_de_medicoes',
            'valor': len(com_guiao),
            'comando': ('ls design/observatorio/medidas/*.py design/observatorio/medidas/*.mjs · '
                        'um por brief datado até 22.09.2026, pela chave do nome do ficheiro'),
            'conhecido_positivo': {
                'o_que': 'o mesmo localizador encontra o guião deste brief pela chave dele',
                'encontrado': guiao_de(caminho_deste) == 'design/observatorio/medidas/BRIEF-M5.py',
            },
        },
        {
            'nome': 'briefs_conferidos_pelo_portao',
            'valor': len(conferidos),
            'comando': ('python3 scripts/check-briefs.py --contagens · os briefs datados de '
                        '22.09.2026 que não estão na isenção por nomeação; a contagem do portão é '
                        'a mesma enquanto não houver um brief posterior ao corte'),
            'conhecido_positivo': {
                'o_que': f'o próprio brief («{este}») está entre os conferidos',
                'encontrado': caminho_deste in conferidos,
            },
        },
        {
            'nome': 'briefs_isentos_por_data',
            'valor': len(isentos_por_data),
            'comando': 'python3 scripts/check-briefs.py --contagens · os briefs anteriores a 22.09.2026',
            'conhecido_positivo': {
                'o_que': f'um brief antigo nomeado («{velho}») cai na isenção por data, pelo mesmo leitor',
                'encontrado': os.path.join(OBSERVATORIO, velho) in isentos_por_data,
            },
        },
        {
            'nome': 'briefs_isentos_por_nomeacao',
            'valor': len(nomeados),
            'comando': 'python3 scripts/check-briefs.py --contagens · a lista fechada de três nomes',
            'conhecido_positivo': {
                'o_que': 'o B1c, que o §0 do seu próprio brief errou duas vezes, está entre os nomeados',
                'encontrado': os.path.join(OBSERVATORIO, ISENTOS_POR_NOMEACAO[0]) in nomeados,
            },
        },
        {
            'nome': 'ocorrencias_do_nome_de_quem_responde_em_src_e_public',
            'valor': ocorrencias,
            'comando': f'grep -rohF "$({LER_O_NOME})" src/ public/ | wc -l',
            'conhecido_positivo': {
                'o_que': ('o MESMO contador encontra uma ocorrência numa linha construída no '
                          'momento com o nome lido do oráculo'),
                'encontrado': conta_o_nome(f'<p>{nome}</p>', nome) == 1,
            },
        },
        {
            'nome': 'exportacoes_de_politica_ia_com_o_nome_de_quem_responde',
            'valor': exportacoes_com_o_nome(politica, nome),
            'comando': ('python3 -c "import json,re;n=json.load(open(\'scripts/textos-aprovados.json\'))'
                        '[\'responsavel\'];print(sum(1 for _,v in re.findall(r\'^export const '
                        '(\\\\w+)\\\\s*=\\\\s*(.*)$\', open(\'src/data/politica-ia.mjs\').read(), re.M) '
                        'if n in v))"'),
            'conhecido_positivo': {
                'o_que': ('o MESMO predicado, sobre uma linha `export const …` construída no '
                          'momento com o nome lido do oráculo, conta uma exportação'),
                'encontrado': exportacoes_com_o_nome(
                    f"export const QUEM_RESPONDE = '{nome}';\n", nome) == 1,
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
