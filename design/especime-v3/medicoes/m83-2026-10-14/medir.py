#!/usr/bin/env python3
"""Escreve medidas.json a partir dos JSON desta pasta (o ensaio, os dois manifestos reais e o inventário)."""
import json, pathlib
D = pathlib.Path(__file__).resolve().parent
t = json.loads((D/'teste-pacote.json').read_text()); b = json.loads((D/'ensaio-v2a-bloco-inteiro.json').read_text()); c = json.loads((D/'ensaio-v2a-intervalo-da-correcao.json').read_text()); inv = json.loads((D/'inventario-do-nome.json').read_text()); cp = json.loads((D/'conhecidos-positivos.json').read_text())
def manifesto(d, p):
    return {f'{p}_linhas': len(d['linhas']), f'{p}_copiadas': sum(l['estado'].startswith('copiado') for l in d['linhas']), f'{p}_em_falta': sum(l['estado'] == 'EM FALTA' for l in d['linhas']),
            f'{p}_documentos_distintos': len({l['caminho'] for l in d['linhas'] if l['caminho']}), f'{p}_anexos': len(d['anexos']),
            f'{p}_com_recibo_do_pedido': sum(bool(l.get('recibo_do_pedido')) for l in d['linhas']), f'{p}_com_direitos': sum(1 for l in d['linhas'] if l.get('direitos')),
            f'{p}_resolvidas_pelos_recibos_do_sitio': sum(1 for l in d['linhas'] if (l.get('origem') or '').startswith('recibos do sítio')),
            f'{p}_resolvidas_pelas_fontes_do_estudo': sum(1 for l in d['linhas'] if (l.get('origem') or '').startswith('fontes do estudo')),
            f'{p}_paginas': len(d['paginas_das_linhas']), f'{p}_paginas_em_falta': len(d['paginas_em_falta']), f'{p}_estudos_extra': len(d['estudos_extra'])}
s, mo = inv['repositorios']['sitio'], inv['repositorios']['motor']
m = {'medido_em': '2026-10-14', 'ensaio_casos': len(t['casos']), 'ensaio_passaram': sum(x['passou'] for x in t['casos']), 'ensaio_plantas': sum(x['nome'].startswith('planta') for x in t['casos']),
     **manifesto(b, 'bloco_inteiro'), **manifesto(c, 'intervalo_correcao'),
     'inventario_cadeias': inv['cadeias_medidas'], 'inventario_sitio_commits': s['commits_na_historia_da_referencia'], 'inventario_motor_commits': mo['commits_na_historia_da_referencia'],
     'inventario_sitio_identidades_pessoais': s['por_cadeia']['parte_local_do_correio_pessoal']['identidades_de_commit'], 'inventario_motor_identidades_pessoais': mo['por_cadeia']['parte_local_do_correio_pessoal']['identidades_de_commit'],
     'inventario_sitio_commits_com_nome_da_conta_no_diff': s['por_cadeia']['nome_da_conta_da_maquina']['commits_cujo_diff_a_traz'], 'inventario_motor_commits_com_nome_da_conta_no_diff': mo['por_cadeia']['nome_da_conta_da_maquina']['commits_cujo_diff_a_traz'],
     'inventario_sitio_commits_com_nome_completo_no_diff': s['por_cadeia']['nome_completo']['commits_cujo_diff_a_traz'], 'inventario_sitio_commits_com_nome_e_apelido_no_diff': s['por_cadeia']['nome_proprio_e_apelido']['commits_cujo_diff_a_traz'],
     'inventario_sitio_commits_com_correio_no_diff': s['por_cadeia']['parte_local_do_correio_pessoal']['commits_cujo_diff_a_traz'], 'inventario_sitio_mensagens_com_nome_da_conta': s['por_cadeia']['nome_da_conta_da_maquina']['mensagens_de_commit'],
     'inventario_motor_commits_com_cidade_no_diff': mo['por_cadeia']['cidade_de_residencia']['commits_cujo_diff_a_traz'], 'inventario_motor_nomes_de_ficheiro_com_nome_da_conta': mo['por_cadeia']['nome_da_conta_da_maquina']['nomes_de_ficheiro'],
     'inventario_sitio_ficheiros_na_cabeca': sum(v['ficheiros_na_cabeca'] for v in s['por_cadeia'].values()),
     'inventario_sitio_commits_com_conta_github_no_diff': s['por_cadeia']['nome_da_conta_do_github']['commits_cujo_diff_a_traz'], 'inventario_sitio_ficheiros_na_cabeca_com_conta_github': s['por_cadeia']['nome_da_conta_do_github']['ficheiros_na_cabeca'], 'inventario_motor_ficheiros_na_cabeca_com_conta_github': mo['por_cadeia']['nome_da_conta_do_github']['ficheiros_na_cabeca'],
     'inventario_motor_ficheiros_na_cabeca_com_nome_e_apelido': mo['por_cadeia']['nome_proprio_e_apelido']['ficheiros_na_cabeca'], 'inventario_motor_ficheiros_na_cabeca_com_nome_da_conta': mo['por_cadeia']['nome_da_conta_da_maquina']['ficheiros_na_cabeca'],
     'inventario_motor_ficheiros_na_cabeca_com_cidade': mo['por_cadeia']['cidade_de_residencia']['ficheiros_na_cabeca'],
     'dominios_sem_titular_visivel': sum(1 for d in inv.get('dominios', {}).values() if d.get('owner_name_vazio')), 'organizacao_membros_publicos': inv.get('organizacao', {}).get('membros_publicos'),
     'organizacao_membros': inv.get('organizacao', {}).get('membros'), 'conhecidos_positivos_do_inventario': sum(1 for k, v in cp.items() if isinstance(v, dict) and v.get('passou')), 'conhecidos_positivos_do_inventario_passaram_todos': cp.get('passou'), 'repositorio_publico_forks': inv.get('repositorio_publico', {}).get('forks'), 'repositorio_publico_estrelas': inv.get('repositorio_publico', {}).get('estrelas'), 'repositorio_publico_pull_requests': inv.get('repositorio_publico', {}).get('pull_requests')}
(D/'medidas.json').write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n'); print(json.dumps(m, ensure_ascii=False))
