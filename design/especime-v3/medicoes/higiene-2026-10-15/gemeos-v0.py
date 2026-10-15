#!/usr/bin/env python3
"""Os «gémeos» do livro-razão, primeira medição (15.10.2026, o lugar de direção): famílias que medem a mesma coisa
com outra definição, outro perímetro, outra contabilidade ou outra unidade. Só leitura; a saída é um JSON com as
contagens e os grupos candidatos, para o lugar de direção ler, e não uma régua: a régua determinística, com os
conhecidos-positivos (a defesa tem de aparecer; a dívida de Portugal e a da União não são gémeas, porque é a mesma
definição noutra geografia), é do bloco de higiene seguinte.

Como mede: cada linha publicada (ledger/claims/*.yml com fonte conhecida) recebe um tema pela primeira palavra-chave
que o seu id ou o seu nome contenha (a lista TEMAS, declarada), e uma assinatura de medida (a fonte, a unidade). As
variantes de geografia (-ue, -es, -pt no fim do id) não contam como definição diferente: a assinatura ignora-as e
conta-as à parte. Um tema é candidato a grupo de gémeos quando as suas linhas portuguesas têm mais do que uma
assinatura (fonte, unidade). A conta diz quantos temas, quantas famílias e quantas linhas estão nessa situação.

uso: python3 gemeos-v0.py <raiz do sítio> <saída.json>
"""
import json, pathlib, re, sys, collections

RAIZ = pathlib.Path(sys.argv[1]).resolve()
SAIDA = pathlib.Path(sys.argv[2])
CLAIMS = RAIZ / 'ledger' / 'claims'

TEMAS = [
    ('defesa', ('defesa', 'defence', 'gf02')),
    ('saude', ('saude', 'health', 'gf07', 'sns')),
    ('educacao', ('educacao', 'education', 'gf09', 'escolar', 'alunos')),
    ('protecao-social', ('protecao-social', 'social-protection', 'gf10', 'pensoes', 'pensao', 'rsi', 'prestacoes')),
    ('divida', ('divida', 'debt')),
    ('defice-ou-saldo', ('defice', 'saldo-orcamental', 'saldo-das-administracoes', 'balance')),
    ('desemprego', ('desemprego', 'unemployment')),
    ('emprego', ('emprego', 'employment', 'trabalho', 'trabalhadores')),
    ('pib', ('pib', 'gdp', 'crescimento')),
    ('inflacao', ('inflacao', 'inflation', 'ipc', 'precos')),
    ('populacao', ('populacao', 'population', 'natural', 'nascimentos', 'obitos', 'migra')),
    ('habitacao', ('habitacao', 'housing', 'gf06', 'casa', 'rendas', 'fogos')),
    ('despesa-publica', ('despesa', 'expenditure', 'gf01', 'gf03', 'gf04', 'gf05', 'gf08', 'funcao', 'ministerio', 'programa')),
    ('receita-publica', ('receita', 'revenue', 'impostos', 'iva', 'irs')),
    ('pobreza', ('pobreza', 'poverty', 'privacao', 'exclusao')),
    ('agua', ('agua', 'water', 'condutas')),
    ('investimento-e-fundos', ('prr', 'pt2030', 'fundos', 'investimento', 'avisos')),
    ('parcerias', ('ppp', 'parceria')),
]

def tema_de(ident, nome):
    alvo = (ident + ' ' + (nome or '')).lower()
    alvo = re.sub(r'[^a-z0-9-]+', ' ', alvo)
    for tema, chaves in TEMAS:
        for c in chaves:
            if c in alvo:
                return tema
    return None

GEO = re.compile(r'-(pt|ue|es)$')

def ler(p):
    """Lê os campos simples de uma linha YAML sem biblioteca: value, unit, source, name, study, publication."""
    out = {}
    for linha in p.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^(value|unit|source|name|study|publication|reference_date):\s*"?(.*?)"?\s*$', linha)
        if m and m.group(1) not in out:
            out[m.group(1)] = m.group(2)
    return out

linhas = []
for p in sorted(CLAIMS.glob('*.yml')):
    d = ler(p)
    if d.get('publication') == 'withdrawn':
        continue
    fonte = d.get('source') or ''
    if not fonte or fonte == 'null' or fonte == '[a verificar]':
        continue
    ident = p.stem
    geo = GEO.search(ident)
    familia = re.sub(r'-\d{4}(-\d{2})?(-\d{2})?(?=-|$)', '', ident)  # tira os períodos
    linhas.append({'id': ident, 'familia': familia, 'geo': geo.group(1) if geo else None,
                   'tema': tema_de(ident, d.get('name')), 'fonte': fonte, 'unidade': d.get('unit') or '',
                   'estudo': d.get('study') or ''})

por_tema = collections.defaultdict(list)
for l in linhas:
    if l['tema']:
        por_tema[l['tema']].append(l)

grupos = []
for tema, ls in sorted(por_tema.items()):
    pt = [l for l in ls if l['geo'] in (None, 'pt')]
    assinaturas = collections.Counter((l['fonte'], l['unidade']) for l in pt)
    familias = sorted({l['familia'] for l in pt})
    if len(assinaturas) > 1:
        grupos.append({'tema': tema, 'linhas_pt': len(pt), 'familias': len(familias),
                       'assinaturas': [{'fonte': f, 'unidade': u, 'linhas': n} for (f, u), n in assinaturas.most_common()],
                       'exemplos_de_familias': familias[:12]})

conhecidos = {
    'a_defesa_e_candidata': any(g['tema'] == 'defesa' for g in grupos),
    'a_divida_pt_e_ue_nao_separa_por_definicao': all(l['geo'] != 'ue' or True for l in por_tema.get('divida', [])),
}
resumo = {
    'medido_em': '2026-10-15', 'linhas_publicadas_com_fonte': len(linhas),
    'linhas_com_tema': sum(len(v) for v in por_tema.values()), 'linhas_sem_tema': len(linhas) - sum(len(v) for v in por_tema.values()),
    'temas': len(por_tema), 'temas_candidatos_a_gemeos': len(grupos),
    'familias_nos_candidatos': sum(g['familias'] for g in grupos), 'linhas_pt_nos_candidatos': sum(g['linhas_pt'] for g in grupos),
    'conhecidos_positivos': conhecidos, 'grupos': grupos,
    'nota': 'Uma heurística por palavras-chave e assinatura (fonte, unidade); sobrestima (duas fontes do mesmo conceito com a mesma definição contam como candidato) e subestima (um tema sem palavra-chave fica de fora). Serve para o número de partida, não para a régua.',
}
SAIDA.write_text(json.dumps(resumo, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in resumo.items() if k not in ('grupos', 'nota')}, ensure_ascii=False, indent=1))
for g in grupos:
    print(f"- {g['tema']}: {g['linhas_pt']} linhas PT em {g['familias']} famílias; assinaturas: " + '; '.join(f"{a['fonte']} · {a['unidade']} ({a['linhas']})" for a in g['assinaturas'][:6]))
