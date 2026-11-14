"""As medidas do mandato ZER0, cada uma pelo seu nome. Corre-se na raiz do repositório do sítio.
Uso: python3 design/especime-v3/medicoes/zer0-2026-11-14/medir_zer0.py <chave>
As chaves do PRR e do empréstimo leem o motor: RESEARCHHUB_DIR tem de apontar para a árvore do motor."""
import glob, os, re, subprocess, sys

RETIRAR = ['coragua-alqueva-alta-pressao-2026', 'coragua-alqueva-baixa-pressao-2026', 'coragua-dgadr-eficiencia-2024',
           'coragua-ersar-encargo-mensal-2024', 'coragua-ersar-encargo-metro-cubico-2024', 'coragua-gulbenkian-inquerito-ano',
           'coragua-gulbenkian-sem-contador', 'coragua-gulbenkian-universo-hectares', 'coragua-historico-eficiencia-83',
           'coragua-historico-eficiencia-85', 'coragua-historico-eficiencia-95', 'coragua-historico-inquerito-2021',
           'coragua-historico-racio-maximo', 'coragua-historico-racio-minimo', 'coragua-racio-maximo-2026',
           'coragua-racio-minimo-2026', 'coragua-tc-auditoria-ano', 'saldo-natural-portugal-2025']
ELEICOES = ['evora-camara-mandatos-ps-2009', 'evora-camara-mandatos-cdu-2013', 'evora-camara-mandatos-cdu-2017',
            'evora-camara-mandatos-cdu-2021', 'evora-camara-mandatos-ps-2025', 'evora-camara-lugares',
            'evora-executivo-2025-ps', 'evora-executivo-2025-ad', 'evora-executivo-2025-cdu', 'evora-executivo-2025-chega']


def milhares(n):
    return f'{n:,}'.replace(',', ' ')


def linha(i):
    return open(f'ledger/claims/{i}.yml', encoding='utf-8').read()


def ficheiros_que_nomeiam():
    achados = set()
    for i in RETIRAR:
        r = subprocess.run(['git', 'grep', '-l', '-F', i, '--', ':!ledger/claims/' + i + '.yml', ':!design/', ':!DECISIONS.md'],
                           capture_output=True, text=True)
        assert r.returncode in (0, 1), r.stderr
        achados.update(f for f in r.stdout.split('\n') if f)
    return sorted(achados)


def releituras():
    total = antes = 0
    for f in sorted(glob.glob('ledger/claims/*.yml')):
        s = open(f, encoding='utf-8').read()
        if re.search(r'(?m)^publication:\s*"?withdrawn', s):
            continue
        a = re.search(r'(?m)^access_date:\s*"?(\d{4}-\d{2}-\d{2})', s)
        i = s.find('\nverifications:')
        datas = re.findall(r'-\s*date:\s*"?(\d{4}-\d{2}-\d{2})', s[i:]) if i >= 0 else []
        if not a or not datas:
            continue
        total += 1
        antes += max(datas) < a.group(1)
    return total, antes


def prr():
    import openpyxl
    f = os.path.join(os.environ['RESEARCHHUB_DIR'], 'content/13 Dominios/source/rp4n/prr/listagem-de-entidades-prr-20260819.xlsx')
    it = openpyxl.load_workbook(f, read_only=True, data_only=True).worksheets[0].iter_rows(values_only=True)
    ix = {k: n for n, k in enumerate(next(it))}
    n, pares = 0, set()
    for r in it:
        if r[ix['papel_entidade']] in ('Beneficiário Intermediário', 'Beneficiário Direto') and r[ix['localizacao_sede']] == 'Évora':
            n += 1
            pares.add((r[ix['nif_entidade']], r[ix['papel_entidade']]))
    return n, len(pares)


def pagina(n):
    f = os.path.join(os.environ['RESEARCHHUB_DIR'], 'content/16 Évora Contas da Câmara/source/2016_relatorio_gestao.pdf')
    t = subprocess.run(['pdftotext', '-layout', '-f', str(n), '-l', str(n), f, '-'], capture_output=True, text=True, check=True).stdout
    m = re.findall(r'32\.166\.37\d,20', t)
    assert len(m) == 1, m
    return m[0]


MEDIDAS = {
    'linhas_a_retirar': lambda: str(len(RETIRAR)),
    'linhas_a_retirar_ainda_publicadas': lambda: str(sum(not re.search(r'(?m)^publication:\s*"?withdrawn', linha(i)) for i in RETIRAR)),
    'ficheiros_que_nomeiam_as_linhas_a_retirar': lambda: str(len(ficheiros_que_nomeiam())),
    'lista_dos_ficheiros_que_nomeiam': lambda: ' '.join(ficheiros_que_nomeiam()),
    'linhas_publicadas_com_releituras': lambda: milhares(releituras()[0]),
    'linhas_com_a_ultima_releitura_anterior_a_leitura': lambda: str(releituras()[1]),
    'registos_do_prr_com_evora': lambda: milhares(prr()[0]),
    'pares_de_entidade_e_papel_do_prr': lambda: str(prr()[1]),
    'linhas_eleitorais_com_excerto_composto': lambda: str(sum(bool(re.search(r"(?m)^excerpt:.*(cm_lists|total_mandates|executive_2025)", linha(i))) for i in ELEICOES)),
    'emprestimo_na_pagina_84': lambda: pagina(84),
    'emprestimo_na_pagina_99': lambda: pagina(99),
    'ocorrencias_da_frase_das_regioes': lambda: str(open('src/i18n/strings.mjs', encoding='utf-8').read().count('Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais.')),
    'ocorrencias_de_sede_em_evora_nos_nomes': lambda: str(open('src/data/nomes-das-medidas.mjs', encoding='utf-8').read().count('com sede em Évora')),
    'ocorrencias_de_sede_no_concelho_nas_descricoes': lambda: str(open('src/data/o-que-e-das-familias.mjs', encoding='utf-8').read().count('com sede no concelho')),
}

if __name__ == '__main__':
    print(MEDIDAS[sys.argv[1]]())
