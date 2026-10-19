"""Mede o §0 do V2-b e prova, sem escrever linhas, a falta de forma qualitativa."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess

import yaml


def run(args, cwd=None):
    return subprocess.run(args, cwd=cwd, capture_output=True, text=True, check=True).stdout.strip()


def normal(text):
    return re.sub(r'\s+', ' ', str(text)).strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--motor', default=os.environ.get('RESEARCHHUB_DIR'))
    parser.add_argument('--saida', required=True)
    args = parser.parse_args()
    if not args.motor:
        parser.error('falta --motor ou RESEARCHHUB_DIR')
    motor = Path(args.motor)
    statement_ids = [
        'afirmacao-leitao-amaro-saude-oe2027-2026-10-09',
        'afirmacao-rtp-saude-queda-oe2027-2026-10-09',
        'afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09',
    ]
    expected = {}
    for measure, values in [
        ('total-consolidada', ['18 125,9', '17 858,4', '−1,5']),
        ('efetiva-consolidada', ['18 062,4', '17 803,1', '−1,4']),
        ('efetiva-consolidada-sem-prr', ['17 291,3', '17 803,1', '3,0']),
    ]:
        for period, value in zip(['2026', '2027', 'variacao'], values):
            expected[f'oe-2027-saude-despesa-{measure}-{period}'] = value
    for measure, value in [
        ('rodoviario-encargos-brutos', '1 152'), ('rodoviario-receitas', '263'),
        ('rodoviario-encargos-liquidos', '889'), ('total-encargos-liquidos', '1 438'),
    ]:
        expected[f'oe-2027-ppp-{measure}-2027'] = value
    expected['oe-2027-cenario-pib-real-crescimento-2027'] = '2,1'
    expected['oe-2027-cenario-ihpc-2026'] = '2,9'
    rows = {}
    for ident in statement_ids + list(expected):
        p = Path('ledger/claims') / (ident + '.yml')
        assert p.is_file(), ident
        row = yaml.safe_load(p.read_text())
        assert row['id'] == ident
        rows[ident] = {k: row.get(k) for k in [
            'id', 'value', 'unit', 'source', 'source_url', 'document', 'attributed_to',
            'reference_date', 'published_at', 'excerpt', 'ressalva', 'ressalva_en', 'afirmacao',
        ]}
        rows[ident]['ficheiro_sha256'] = hashlib.sha256(p.read_bytes()).hexdigest()
        if ident in expected:
            assert normal(row['value']).replace('-', '−') == expected[ident], ident
            assert row.get('ressalva'), ident
    missing = 'afirmacao-cfp-parecer-05-2026-oe2027'
    assert not (Path('ledger/claims') / (missing + '.yml')).exists()
    source = Path('content/15 Orcamento do Estado 2027/source/v2a/cfp-parecer.pdf')
    pdf = motor / source
    receipt = json.loads(Path(str(pdf) + '.pedido.json').read_text())
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
    assert digest == receipt['sha256'] == rows['oe-2027-cenario-pib-real-crescimento-2027']['document']['source_sha256']
    assert len(pdf.read_bytes()) == receipt['bytes'] and receipt['estado'] == 200
    pages = run(['pdftotext', '-layout', str(pdf), '-']).split('\f')
    cover = normal(pages[0])
    number = re.search(r'Parecer n.º\s+(\d+/\d+)', cover)[1]
    date = re.search(r'(\d+) de outubro de (\d{4})', cover)
    date = f'{date[2]}-10-{int(date[1]):02d}'
    conclusion = normal(pages[19])
    excerpt = re.search(r'Nos termos do número 4.*?apresentam um pendor descendente\.', conclusion)[0]
    assert 'endossa as previsões macroeconómicas apresentadas, dando nota que os riscos' in excerpt
    pcp = rows[statement_ids[2]]['value']
    ppp = {k: v['value'] for k, v in rows.items() if k.startswith('oe-2027-ppp-')}
    numeric = lambda text: float(re.sub(r'\s+', '', text).replace(',', '.').replace('−', '-'))
    comparison = {k: numeric(v) != numeric(pcp) for k, v in ppp.items()}
    assert all(comparison.values())
    engine_probe = run(['python3', '-c', '''
import json
from publisher.oe1_common import number, Fail
results=[]
for value in ['', 'endossa as previsões macroeconómicas']:
    try:
        number(value)
        results.append({'entrada':value,'recusou':False})
    except Fail as e:
        results.append({'entrada':value,'recusou':True,'mensagem':str(e)})
print(json.dumps(results,ensure_ascii=False))
'''], cwd=motor)
    site_probe = run(['node', '--input-type=module', '-e', '''
import { loadClaims, validateLedger } from './src/lib/ledger.mjs';
const rows=loadClaims({includeWithdrawn:true});
const id='afirmacao-cfp-parecer-05-2026-oe2027';
const base=structuredClone(rows.get('oe-2027-cenario-pib-real-crescimento-2027'));
const measured=JSON.parse(process.argv[1]);
const row={...base,id,__file:id+'.yml',afirmacao:true,value:'',unit:'',excerpt:measured.excerpt,
  attributed_to:['Conselho das Finanças Públicas'],reference_date:measured.date,published_at:measured.date,
  document:{...base.document,kind:'pdf'}};
delete row.document.crop;
rows.set(id,row);
try {
 const errors=validateLedger().errors.filter(e=>e.includes('['+id+'.yml]'));
 console.log(JSON.stringify({ensaio:'Só em memória, campos value e unit vazios',errors}));
} finally { rows.delete(id); }
''', json.dumps({'date': date, 'excerpt': excerpt})])
    explanation = json.loads(run(['node', '--input-type=module', '-e', '''
import { explicacaoResolvida } from './src/lib/explicacoes.mjs';
const e=explicacaoResolvida('dinheiro-do-estado-2026','pt');
console.log(JSON.stringify({seccoes:e.seccoes.map(s=>s.id),linhas:e.linhas}));
''']))
    explanation['coincidencias_v2a'] = sorted(set(explanation['linhas']) & set(rows))
    assert not explanation['coincidencias_v2a']
    data = {
        'comando': 'python3 design/especime-v3/medicoes/v2b-2026-10-12/medir-partida.py --motor <motor> --saida <temporario>/partida.json',
        'cabeca_sitio': run(['git', 'rev-parse', 'HEAD']),
        'cabeca_motor': run(['git', 'rev-parse', 'HEAD'], cwd=motor),
        'ancestral_main': subprocess.run(['git','merge-base','--is-ancestor','main','HEAD']).returncode,
        'ancestral_master': subprocess.run(['git','merge-base','--is-ancestor','master','HEAD'], cwd=motor).returncode,
        'identificadores_conferidos': list(rows), 'total': len(rows), 'linhas': rows,
        'afirmacoes': len(statement_ids), 'numericas': len(expected), 'linha_cfp_ausente': missing,
        'item_2': {'valor_afirmado': pcp, 'valores_do_quadro': ppp, 'diferentes': comparison},
        'cfp': {'ficheiro_motor': source.as_posix(), 'sha256': digest,
                'recibo': source.as_posix()+'.pedido.json', 'pedido': receipt['pedido'],
                'numero': number, 'data': date, 'pagina_pdf': 20, 'excerto': excerpt,
                'endosso_e_riscos_na_mesma_frase': True,
                'linha_pib_tem_4do': 'número 4do artigo' in rows['oe-2027-cenario-pib-real-crescimento-2027']['excerpt']},
        'explicacao_dinheiro_estado': explanation,
        'prova_motor': json.loads(engine_probe), 'prova_sitio': json.loads(site_probe),
    }
    assert all(x['recusou'] for x in data['prova_motor'])
    assert any('string não vazia' in x for x in data['prova_sitio']['errors'])
    assert any('falta "unit"' in x for x in data['prova_sitio']['errors'])
    Path(args.saida).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    print('§0: identificadores conferidos, valores conferidos, comparação do item 2 verdadeira.')
    print('CFP: capa, conclusão e sha256 conferidos; formato qualitativo recusado nos dois lados.')


if __name__ == '__main__':
    main()
