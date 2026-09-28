"""Mede a C1f: Git, travessia, valores, portões, capturas e privacidade."""
import argparse
import copy
from datetime import datetime, timezone
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import tarfile
sys.dont_write_bytecode = True
import yaml
AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
SITIO = AQUI.parents[4]
BASE = 'cb43b2fcec9e67815894a07ceb95c2cba1b589e4'
BASE_MOTOR = '68318e0da2036cc29e4704fa1bb8a96dee246095'

def modulo(nome, p):
    s = importlib.util.spec_from_file_location(nome, p)
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
    return m

def git(*args, repo=SITIO):
    return subprocess.check_output(['git', *args], cwd=repo, text=True).strip()

def ler(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def medir(motor, final):
    erros = []
    def exige(ok, msg):
        if not ok: erros.append(msg)
    acesso = modulo('acessos_c1f', AQUI/'conferir-acessos.py')
    prova = acesso.executar()
    exige(not prova['erros'] and len(prova['plantas']) == 10 and all(p['mordeu'] for p in prova['plantas']), 'A reconstituição ou uma planta não bate com o Git.')
    esperadas = {l['id']: l['entradas'] for l in prova['linhas']}
    alteradas, valores, n, revisoes = [], [], 0, 0
    arquivo = subprocess.check_output(['git', 'archive', BASE, 'ledger/claims'], cwd=SITIO)
    with tarfile.open(fileobj=io.BytesIO(arquivo)) as t:
        for f in t.getmembers():
            if not f.isfile(): continue
            a = yaml.safe_load(t.extractfile(f).read())
            b = yaml.safe_load((SITIO/f.name).read_text()); n += 1
            revisoes += sum(c.get('kind') == 'proveniencia' for c in b.get('corrections', []))
            if a['value'] != b['value']: valores.append(a['id'])
            if a != b:
                alteradas.append(a['id'])
                e = copy.deepcopy(a)
                e['corrections'] += esperadas.get(a['id'], [])
                exige(e == b, f"{a['id']}: mudou mais do que os acessos reconstituídos.")
    exige(set(alteradas) == set(esperadas) and not valores, 'A lista das linhas ou dos valores alterados difere do mandato.')
    reg = 'ledger/cruzamentos/evora.json'
    original = json.loads(git('show', BASE+':'+reg))
    previsto = copy.deepcopy(original)
    atual = ler(SITIO/reg)
    for id in esperadas:
        e = previsto['rows'][id]
        h = sha(SITIO/f'ledger/claims/{id}.yml')
        e.setdefault('site_corrections', []).append({'date': esperadas[id][-1]['date'], 'kind': 'proveniencia', 'sha256_antes': e['exported_row_sha256'], 'sha256_depois': h})
        e['corrections_at_export'] += len(esperadas[id]); e['exported_row_sha256'] = h
        exige((AQUI/f'aceitar-{id}.codigo').read_text().strip() == '0', f'{id}: falta a aceitação da travessia.')
    exige(atual == previsto, 'O registo da travessia mudou fora das cinco aceitações.')
    motor_estado = {'cabeca': git('rev-parse', 'HEAD', repo=motor), 'limpa': not git('status', '--porcelain', repo=motor), 'diferenca_sha256': hashlib.sha256(subprocess.check_output(['git', 'diff', BASE_MOTOR, '--binary'], cwd=motor)).hexdigest(), 'ficheiros_alterados': git('diff', '--name-only', BASE_MOTOR, repo=motor).splitlines()}
    exige(motor_estado['cabeca'] == BASE_MOTOR and motor_estado['limpa'] and not motor_estado['ficheiros_alterados'], 'O motor mudou nesta passagem.')
    detetor = modulo('detetor_c1f', BLOCO/'medir-c1.py')
    achados = []; total = 0
    for rot, repo, base in [('sítio', SITIO, '48a5a1c181c1753036d301204884c57119bba8a5'), ('motor', motor, '4eb2867936dd14ad2654751722e390804e68dda3')]:
        nomes = set(git('diff', '--name-only', base, repo=repo).splitlines()) | set(git('ls-files', '--others', '--exclude-standard', repo=repo).splitlines())
        if rot == 'sítio':
            nomes = {n for n in nomes if n.startswith(('src/', 'scripts/', 'tests/', 'ledger/', str(BLOCO.relative_to(SITIO))+'/')) or n in ('design/especime-v3/INVENTARIO-FRASES.md', 'design/especime-v3/ISSUES.md', 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md')}
            nomes |= {str(p.relative_to(repo)) for p in BLOCO.rglob('*') if p.is_file()}
        for nome in sorted(nomes):
            p = repo/nome
            if p.is_file() and '__pycache__' not in p.parts:
                total += 1
                if detetor.tem_caminho(p.read_bytes()): achados.append({'arvore': rot, 'ficheiro': nome})
    antigo = git('show', '3e83a271f4c5af0b1f6809436916c1b06d6e0b1c:indicators/refresh.py', repo=motor).encode()
    anfitrioes = re.findall(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b', antigo, re.I)
    positivos = [detetor.tem_caminho(b) for b in detetor.proibidos()+anfitrioes+list(detetor.nomes_dos_autores())+[sys.executable.encode()]]
    caminhos = {'ficheiros': total, 'quantidade': len(achados), 'achados': achados, 'conhecidos_positivos': positivos, 'anfitrioes': len(anfitrioes), 'nomes_lidos_do_git': len(detetor.nomes_dos_autores())}
    exige(not achados and all(positivos) and anfitrioes and detetor.nomes_dos_autores(), 'Falhou a privacidade ou um conhecido-positivo.')
    portoes = {}
    for nome in ('build', 'verify', 'typecheck'):
        p = BLOCO/'portoes/c1f'/nome
        if Path(str(p)+'.codigo').exists():
            r = {k: Path(str(p)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')}; r['codigo'] = int(r['codigo'])
            portoes[nome] = r
            exige(r['codigo'] == 0, f'O portão {nome} não passou.')
            exige(ler(AQUI/f'concorrencia-{nome}.json')['livre'], f'{nome}: faltou a conferência de concorrência.')
    capturas = ler(AQUI/'capturas-depois.json') if (AQUI/'capturas-depois.json').exists() else None
    if capturas:
        matriz = {(r['familia'].removeprefix('recibo-'), r['lingua'], r['largura']) for r in capturas['resultados']}
        exige(matriz == {(id, l, w) for id in esperadas for l in ('pt','en') for w in (390,768,1024,1280,1600)}, 'A matriz de capturas está incompleta.')
        exige(len(capturas['resultados']) == 50 and capturas['aceitacao']['passou'], 'As capturas não passaram.')
        for r in capturas['resultados']:
            exige(sha(AQUI/'capturas'/r['ficheiro']) == r['sha256'], 'Uma captura mudou depois de medida.')
        indice = ler(AQUI/'paginas-depois/INDICE.json')
        for nome, r in indice['copias'].items():
            exige(sha(AQUI/'paginas-depois'/nome) == r['sha256'], 'Uma cópia construída mudou depois da captura.')
        capturas = {k: capturas[k] for k in ('dist_construido_de','larguras','idsDeRecibos','aceitacao') } | {'quantidade': len(capturas['resultados']), 'copias': len(indice['copias']), 'edicoes': ['pt','en']}
    relatorio = ler(AQUI/'relatorio.json') if (AQUI/'relatorio.json').exists() else None
    privacidade = ler(AQUI/'privacidade-dist.json') if (AQUI/'privacidade-dist.json').exists() else None
    proveniencia = ler(AQUI/'proveniencia.json') if (AQUI/'proveniencia.json').exists() else None
    for prova_extra in (proveniencia, privacidade):
        if prova_extra:
            origem = prova_extra['origem']
            exige(sha(BLOCO/origem['ficheiro']) == origem['sha256'] and origem['codigo'] == 0, 'Uma extração não corresponde ao portão guardado.')
    if final:
        exige(len(portoes) == 3 and len({r['cabeca'] for r in portoes.values()}) == 1, 'Faltam os três portões da mesma cabeça.')
        exige(bool(capturas), 'Faltam as capturas.')
        exige(proveniencia and not proveniencia['erros_do_livro'] and all(p['mordeu'] for p in proveniencia['plantas']), 'A guarda de proveniência não passou.')
        exige(relatorio and relatorio['numeros_sem_ficheiro'] == 0 and relatorio['conhecido_positivo']['encontrado'], 'Falta a conferência do relatório.')
        exige(privacidade and privacidade['passou'], 'Falta a guarda sobre a construção final.')
        if len(portoes) == 3:
            cabeca = portoes['build']['cabeca']
            exige(ler(SITIO/'dist/version.json')['commit'] == cabeca and capturas and capturas['dist_construido_de'] == cabeca, 'A construção ou as capturas são de outra cabeça.')
            exige(all(f.startswith(str(BLOCO.relative_to(SITIO))+'/') for f in git('diff', '--name-only', cabeca, 'HEAD').splitlines()), 'Mudou código depois dos portões.')
    commits = {rot: [dict(zip(('hash','assunto'),l.split(' ',1))) for l in git('log','--reverse','--format=%H %s',base+'..HEAD',repo=repo).splitlines()] for rot,repo,base in [('sitio',SITIO,'48a5a1c181c1753036d301204884c57119bba8a5'),('motor',motor,'4eb2867936dd14ad2654751722e390804e68dda3')]}
    return {'registado_em': datetime.now(timezone.utc).isoformat(), 'base': BASE, 'cabeca_sitio': git('rev-parse','HEAD'), 'motor': motor_estado, 'commits': commits, 'linhas_conferidas': n, 'linhas_alteradas': alteradas, 'valores_alterados': valores, 'revisoes_de_proveniencia': revisoes, 'entradas_reconstituidas': sum(len(e) for e in esperadas.values()), 'acessos': prova, 'portoes': portoes, 'capturas': capturas, 'caminhos': caminhos, 'privacidade_dist': privacidade, 'proveniencia': proveniencia, 'relatorio': relatorio, 'aceitacao_integral': final and not erros, 'erros_da_medicao': erros}

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--motor', required=True, type=Path)
    ap.add_argument('--final', action='store_true'); ap.add_argument('--verifica', action='store_true')
    args = ap.parse_args(); r = medir(args.motor, args.final or args.verifica)
    if not args.verifica:
        (AQUI/'medidas.json').write_text(json.dumps(r, ensure_ascii=False, indent=2)+'\n')
        geral = ler(BLOCO/'medidas.json'); geral['C1f'] = r
        (BLOCO/'medidas.json').write_text(json.dumps(geral, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({k:r[k] for k in ('linhas_conferidas','linhas_alteradas','valores_alterados','revisoes_de_proveniencia','portoes','caminhos','aceitacao_integral','erros_da_medicao')}, ensure_ascii=False, indent=2))
    raise SystemExit(bool(r['erros_da_medicao']))
