"""Confere apenas a entrega C1g: razões, provas, amostra, portões e relatório."""
from datetime import datetime, timezone
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
import yaml
AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
SITIO = AQUI.parents[4]
BASE = '40f7684c21eb4742a6597eb0405a8f3516effec0'

def git(*args, repo=SITIO):
    return subprocess.check_output(['git', *args], cwd=repo, text=True).strip()

def ler(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def medir():
    erros = []
    def exige(ok, msg):
        if not ok: erros.append(msg)
    prr = ler(AQUI/'prr.json')
    ids = [r['id'] for r in prr['linhas']]
    mudadas = git('diff', '--name-only', BASE, '--', 'ledger/claims').splitlines()
    exige(set(mudadas) == {f'ledger/claims/{id}.yml' for id in ids}, 'Mudou uma linha fora das cinco razões do PRR.')
    razoes = 0
    for id in ids:
        nome = f'ledger/claims/{id}.yml'
        anterior = yaml.safe_load(git('show', BASE+':'+nome))
        atual = yaml.safe_load((SITIO/nome).read_text())
        esperado = copy.deepcopy(anterior)
        for i, entrada in enumerate(atual['corrections']):
            if entrada.get('field') == 'access_date':
                for campo in ('reason', 'reason_en'):
                    razoes += anterior['corrections'][i][campo] != entrada[campo]
                    esperado['corrections'][i][campo] = entrada[campo]
        exige(esperado == atual, f'{id}: mudou mais do que as razões dos acessos.')
    exige(razoes == 20, 'As dez entradas não têm as duas razões revistas.')
    acessos = ler(AQUI/'acessos.json')
    exige(not acessos['erros'] and all(p['mordeu'] for p in acessos['plantas']), 'A prova do Git não passou.')
    for nome in ('acessos', 'confianca', 'proveniencia', 'calendario', 'cruzamento', 'travessia-isolada', 'captar'):
        exige((AQUI/(nome+'.codigo')).read_text().strip() == '0', f'{nome}: código diferente de zero.')
    portoes = {}
    for nome in ('build', 'verify', 'typecheck'):
        p = BLOCO/'portoes/c1g'/nome
        r = {k: Path(str(p)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')}
        r['codigo'] = int(r['codigo']); portoes[nome] = r
        exige(r['codigo'] == 0, f'{nome}: o portão não passou.')
        exige(ler(AQUI/f'concorrencia-{nome}.json')['livre'], f'{nome}: falta a conferência de concorrência.')
    cabeca = portoes['build']['cabeca']
    exige({p['cabeca'] for p in portoes.values()} == {cabeca}, 'Os portões não medem a mesma cabeça.')
    exige(ler(SITIO/'dist/version.json')['commit'] == cabeca, 'A construção não é da cabeça medida.')
    exige(all(n.startswith(str(BLOCO.relative_to(SITIO))+'/') for n in git('diff','--name-only',cabeca).splitlines()), 'Mudou código depois dos portões.')
    capturas = ler(AQUI/'capturas-depois.json'); amostra = ler(AQUI/'amostra.json')
    recibos = amostra['tentativas'] + amostra['calculadas'] + [amostra['uniao']]
    universo = [r['id'] for r in ler(BLOCO/'c1e/medidas.json')['capturas']['recibos_a_captar']]
    exige(len(universo) == 337 and all(id in universo for id in recibos), 'A amostra não corresponde aos recibos da C1e.')
    matriz = {(r['familia'], r['lingua'], r['largura']) for r in capturas['resultados']}
    prevista = {(id, l, w) for id in ['recibo-'+id for id in recibos]+['faixa-evora'] for l in amostra['edicoes'] for w in amostra['larguras']}
    exige(matriz == prevista and len(capturas['resultados']) == 120, 'A matriz de capturas está incompleta.')
    exige(capturas['aceitacao']['passou'] and capturas['dist_construido_de'] == cabeca, 'As capturas falharam ou medem outra cabeça.')
    for r in capturas['resultados']:
        exige(sha(AQUI/'capturas'/r['ficheiro']) == r['sha256'], 'Uma captura mudou depois de medida.')
    indice = ler(AQUI/'paginas-depois/INDICE.json')
    for nome, r in indice['copias'].items():
        exige(sha(AQUI/'paginas-depois'/nome) == r['sha256'], 'Uma página ou folha mudou depois da captura.')
    privacidade = ler(AQUI/'privacidade-dist.json'); origem = privacidade['origem']
    exige(privacidade['passou'] and origem['codigo'] == 0 and origem['cabeca'] == cabeca and sha(BLOCO/origem['ficheiro']) == origem['sha256'], 'Falta a prova de privacidade do verify final.')
    spec = importlib.util.spec_from_file_location('detetor_c1g', BLOCO/'medir-c1.py')
    detetor = importlib.util.module_from_spec(spec); spec.loader.exec_module(detetor)
    nomes = set(git('diff','--name-only',BASE).splitlines()) | set(git('ls-files','--others','--exclude-standard').splitlines())
    ficheiros = [n for n in sorted(nomes) if (SITIO/n).is_file() and '__pycache__' not in Path(n).parts]
    achados = [n for n in ficheiros if detetor.tem_caminho((SITIO/n).read_bytes())]
    positivos = [detetor.tem_caminho(b) for b in detetor.proibidos()+list(detetor.nomes_dos_autores())+[sys.executable.encode()]]
    exige(not achados and positivos and all(positivos), 'Falhou a privacidade dos ficheiros da passagem.')
    relatorio = ler(AQUI/'relatorio.json')
    exige(relatorio['numeros_sem_ficheiro'] == 0 and relatorio['conhecido_positivo']['encontrado'], 'O relatório não passou.')
    motor = Path.home()/'Instruments/ResearchHub/.worktrees/c1-2026-09-28'
    motor_estado = {'cabeca':git('rev-parse','HEAD',repo=motor), 'limpa':not git('status','--porcelain',repo=motor)}
    exige(motor_estado == {'cabeca':'68318e0da2036cc29e4704fa1bb8a96dee246095','limpa':True}, 'O motor não está no estado recebido.')
    commits = [dict(zip(('hash','assunto'),l.split(' ',1))) for l in git('log','--reverse','--format=%H %s','48a5a1c181c1753036d301204884c57119bba8a5..HEAD').splitlines()]
    return {'registado_em':datetime.now(timezone.utc).isoformat(), 'base':BASE, 'cabeca_codigo':cabeca, 'motor':motor_estado,
        'commits':commits, 'linhas_alteradas':ids, 'valores_alterados':[], 'razoes_afinadas':razoes,
        'portoes':portoes, 'capturas':{'recibos_do_universo':len(universo), 'recibos_captados':len(recibos), 'recibos_nao_captados':len(universo)-len(recibos), 'imagens_dos_recibos':110, 'imagens_da_faixa':10, 'imagens':len(capturas['resultados']), 'copias':len(indice['copias']), 'cabeca':capturas['dist_construido_de'], 'aceitacao':capturas['aceitacao']},
        'privacidade_dist':privacidade, 'privacidade_da_passagem':{'ficheiros':len(ficheiros),'quantidade':len(achados),'achados':achados,'conhecidos_positivos':positivos},
        'relatorio':relatorio, 'aceitacao_integral':not erros, 'erros_da_medicao':erros}

if __name__ == '__main__':
    r = medir()
    if '--verifica' not in sys.argv:
        (AQUI/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
        geral = ler(BLOCO/'medidas.json'); geral['C1g'] = r
        (BLOCO/'medidas.json').write_text(json.dumps(geral,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:r[k] for k in ('cabeca_codigo','capturas','privacidade_da_passagem','aceitacao_integral','erros_da_medicao')},ensure_ascii=False,indent=2))
    raise SystemExit(bool(r['erros_da_medicao']))
