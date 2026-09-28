"""Confere o C1c sobre o livro, os corpos, o Git e as provas efetivas."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
sys.dont_write_bytecode = True
import yaml
from html.parser import HTMLParser

AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
SITIO = AQUI.parents[4]
BASE = 'b7f352ce253effe7d21dc97bacc1d9b67665e592'
BASE_MOTOR = '3e83a271f4c5af0b1f6809436916c1b06d6e0b1c'
ALVO = 'divida-das-familias-2025-ue'

def git(*args, repo=SITIO):
    return subprocess.check_output(['git', *args], cwd=repo, text=True).strip()

def ler(p):
    return json.loads(p.read_text())

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

class Texto(HTMLParser):
    def __init__(self):
        super().__init__(); self.partes=[]; self.ignorar=0
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'): self.ignorar+=1
    def handle_endtag(self,tag):
        if tag in ('script','style'): self.ignorar=max(0,self.ignorar-1)
    def handle_data(self,d):
        if not self.ignorar: self.partes.append(d)

def commits(repo, base):
    return [dict(zip(('hash', 'assunto'), s.split(' ', 1))) for s in git('log', '--reverse', '--format=%H %s', f'{base}..HEAD', repo=repo).splitlines()]

def mede(motor, final):
    erros = []
    def exige(ok, texto):
        if not ok: erros.append(texto)

    spec = importlib.util.spec_from_file_location('detetor_c1', BLOCO/'medir-c1.py')
    detetor = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(detetor)
    achados, n = [], 0
    for rotulo, repo, base in [('sítio', SITIO, '48a5a1c181c1753036d301204884c57119bba8a5'), ('motor', motor, '4eb2867936dd14ad2654751722e390804e68dda3')]:
        nomes = set(git('diff', '--name-only', base, repo=repo).splitlines())
        if repo == SITIO:
            herdados = {f for f in nomes if not f.startswith(('src/', 'scripts/', 'tests/', 'ledger/', str(BLOCO.relative_to(SITIO))+'/'))}
            escritos_agora = set(git('diff', '--name-only', BASE, repo=repo).splitlines())
            nomes -= herdados - escritos_agora
        nomes.update(git('ls-files', '--others', '--exclude-standard', repo=repo).splitlines())
        if repo == SITIO: nomes.update(str(p.relative_to(repo)) for p in BLOCO.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
        for nome in sorted(nomes):
            p = repo/nome
            if not p.is_file() or '__pycache__' in p.parts: continue
            n += 1
            if detetor.tem_caminho(p.read_bytes()): achados.append({'árvore': rotulo, 'ficheiro': nome})
    # A amostra do anfitrião vem dos bytes antigos, sem a copiar para a prova.
    antigo = git('show', f'{BASE_MOTOR}:indicators/refresh.py', repo=motor).encode()
    anfitrioes = re.findall(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b', antigo, re.I)
    positivos = [detetor.tem_caminho(x) for x in detetor.proibidos() + anfitrioes]
    caminhos = {'ficheiros': n, 'quantidade': len(achados), 'achados': achados, 'conhecidos_positivos': positivos,
                'anfitrioes_antigos_exercitados': len(anfitrioes), 'ambito': 'Ficheiros atuais escritos pelo construtor no C1 e C1c, pasta integral das provas e ficheiros do motor tocados desde a base do C1. Não inclui a leitura a frio nem outros documentos da direção, que esta passagem não escreveu. O histórico anterior conserva o defeito do achado 24.'}
    exige(not achados and all(positivos) and len(anfitrioes)>0, 'Caminho local ou conhecido-positivo em falta.')

    nomes = git('ls-tree', '-r', '--name-only', BASE, '--', 'ledger/claims').splitlines()
    mudancas = []
    contagens_registo = {k:0 for k in ('correcao','atualizacao','proveniencia')}
    for nome in nomes:
        a = yaml.safe_load(git('show', f'{BASE}:{nome}'))
        b = yaml.safe_load((SITIO/nome).read_text())
        for entrada in b.get('corrections',[]): contagens_registo[entrada['kind']] += 1
        for campo in ('value', 'source_url'):
            if a.get(campo) != b.get(campo): mudancas.append({'id': a['id'], 'campo': campo, 'antes': a.get(campo), 'depois': b.get(campo)})
    exige({(x['id'],x['campo']) for x in mudancas} == {(ALVO,'value'),('indice-de-divida-limite-legal','source_url')}, 'Mudança de valor ou endereço fora do mandato.')
    exige(not (set(git('ls-files', 'ledger/claims').splitlines())-set(nomes)), 'Entrou uma linha nova.')
    linha = yaml.safe_load((SITIO/'ledger/claims'/f'{ALVO}.yml').read_text())
    exige(linha['value']=='49,2' and linha['access_date']=='2026-09-28', 'A dívida da União não tem o valor e acesso autorizados.')
    c = [c for c in linha['corrections'] if c['kind']=='atualizacao']
    exige(len(c)==1 and c[0]['old_value']=='49,3' and c[0]['new_value']=='49,2', 'Falta a atualização tipada da dívida.')
    historias = []
    for id in (ALVO, 'indice-de-divida-limite-legal'):
        atual = yaml.safe_load((SITIO/'ledger/claims'/f'{id}.yml').read_text())
        anterior = yaml.safe_load(git('show', f'a677770f:ledger/claims/{id}.yml'))
        iguais = atual['verifications'] == anterior['verifications']
        exige(iguais, f'A história de {id} não é a de a677770f.')
        acessos = [c for c in atual['corrections'] if c.get('kind')=='proveniencia' and c.get('field')=='access_date']
        exige(len(acessos)==1 and acessos[0]['old_value']==anterior['access_date'] and acessos[0]['new_value']==atual['access_date'], f'Falta a história do acesso de {id}.')
        historias.append({'id':id,'lista_igual_a_a677770f':iguais,'verifications':atual['verifications'],'acessos':acessos})
    enderecos = ler(AQUI/'enderecos-antes.json')
    plantas_historia = ler(AQUI/'historia-plantas.json')
    exige(all(p['mordeu'] and p['falha'] for p in plantas_historia['plantas']) and len(plantas_historia['plantas'])==5, 'Falta uma das cinco plantas da retoma.')
    exige(all(p['passou'] for p in plantas_historia['controlos']), 'Um controlo da história falhou.')
    geradas = ler(AQUI/'comparacao-gerada.json')
    exige(sum(x['valor_numerico_diferente'] for x in geradas['linhas'])==1, 'O gerador encontrou outra revisão numérica.')

    pedidos = []
    for pasta in ('enquadramento-2026-09-28','releitura-c1c-2026-09-28','c1c-2026-09-28'):
        base = motor/'indicators/out'/pasta
        for l in (base/'pedidos.jsonl').read_text().splitlines():
            r = json.loads(l)
            igual = sha(base/r['ficheiro']) == r['sha256']
            pedidos.append({'pasta': pasta, 'url':r['url'], 'http':r['http'], 'sha256':r['sha256'], 'corpo_integro':igual})
            exige(igual, f'Corpo diferente do pedido em {pasta}.')
    literais=[]
    for id,origem in ler(AQUI/'origens.json').items():
        p=motor/origem['selo']['motor']
        exige(sha(p)==origem['selo']['sha256'], 'Uma origem perdeu o corpo alojado.')
        if p.suffix=='.html':
            parser=Texto();parser.feed(p.read_text());texto=' '.join(' '.join(parser.partes).split())
        else: texto=json.dumps(json.loads(p.read_text()),ensure_ascii=False)
        inteiro=all(parte in texto for parte in origem['excerto'].split(' … '))
        literais.append({'id':id,'literal_no_corpo':inteiro})
        exige(inteiro, f'O literal de {id} não está no corpo selado.')
    pib = []
    for id in ('pib-real-per-capita-2024','pib-real-per-capita-2025','pib-real-per-capita-2025-ue'):
        l = yaml.safe_load((SITIO/'ledger/claims'/f'{id}.yml').read_text())
        v = l['verifications']
        exige(v[-1]['result']=='igual' and v[-1]['date']=='2026-09-28' and v[-1]['by']=='painel-semanal', f'O painel não escreveu a releitura de {id}.')
        exige(any(x['date']=='2026-09-28' and x['result']=='inacessivel' for x in v), f'A tentativa antiga de {id} perdeu-se.')
        exige(not any('&unit=' in x['path'] for x in v), f'A entrada do guião manual de {id} ficou.')
        pib.append({'id':id,'verifications':v})
    mudados_motor = git('diff','--name-only',BASE_MOTOR,repo=motor).splitlines()
    protegidos = [f for f in mudados_motor if (Path(f).parent==Path('indicators') and f.endswith('.json')) or f.startswith(('.maintenance-locks/','sweeps/')) or f=='publisher/recortes/manifest.regioes.json']
    exige(not protegidos,'Um ficheiro protegido do motor mudou.')

    portoes = {}
    for nome in ('build','verify','typecheck'):
        base = BLOCO/'portoes/c1c'/nome
        if not Path(str(base)+'.codigo').exists():
            exige(not final, f'Falta o portão {nome}.'); continue
        p = {k:Path(str(base)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')}
        p['codigo']=int(p['codigo']);portoes[nome]=p
        exige(p['codigo']==0, f'O portão {nome} não está a zero.')
    if final:
        exige(len({p['cabeca'] for p in portoes.values()})==1, 'Os portões não mediram a mesma cabeça.')
        if len(portoes)==3:
            cabeca=portoes['build']['cabeca']
            posteriores=git('diff','--name-only',cabeca,'HEAD').splitlines()
            exige(all(f.startswith(str(BLOCO.relative_to(SITIO))+'/') for f in posteriores), 'Depois da cabeça medida mudou código fora das provas.')
    capturas = None
    if (AQUI/'capturas-depois.json').exists():
        capturas = ler(AQUI/'capturas-depois.json')
        exige(not capturas['aceitacao']['falhas'], 'As capturas têm falhas.')
        for r in capturas['resultados']+capturas['recortes']:
            exige(sha(AQUI/'capturas'/r['ficheiro'])==r['sha256'], 'Uma captura perdeu a integridade.')
        for f,r in ler(AQUI/'paginas-depois/INDICE.json')['copias'].items():
            exige(sha(AQUI/'paginas-depois'/f)==r['sha256'], 'Uma página congelada perdeu a integridade.')
        for id in capturas['idsDeRecibos']:
            exige({(r['lingua'],r['largura']) for r in capturas['resultados'] if r['familia']==f'recibo-{id}'} == {(l,w) for l in ('pt','en') for w in (390,768,1024,1280,1600)}, f'A matriz do recibo {id} está incompleta.')
        if final: exige(all(p['cabeca']==capturas['dist_construido_de'] for p in portoes.values()), 'As capturas não são da cabeça dos portões.')
    else: exige(not final, 'Faltam as capturas.')
    provas = {f:ler(AQUI/(f+'.json')) for f in ('gerador-plantas','plantas-confianca','k17','dados-concelhos','calendario') if (AQUI/(f+'.json')).exists()}
    if final: exige(len(provas)==5, 'Faltam conferências isoladas do C1c.')
    exige(not provas.get('k17',{}).get('erros'), 'A K17 recusou as origens.')
    conf = provas['plantas-confianca']['contagens']
    exige(conf['plantas']==conf['plantas_mordidas'] and conf['controlos']==conf['controlos_integros'], 'As plantas de confiança falharam.')
    recibos_finais = ler(AQUI/'recibos-finais.json') if (AQUI/'recibos-finais.json').exists() else None
    custo_retoma = ler(AQUI/'custo-retoma.json') if (AQUI/'custo-retoma.json').exists() else None
    if final:
        exige(recibos_finais is not None and not recibos_finais['erros'] and all(c['passou'] for c in recibos_finais['casos']) and recibos_finais['cabeca']==portoes.get('build',{}).get('cabeca'), 'Falta a conferência dos recibos finais.')
        exige(custo_retoma is not None and custo_retoma['custo_da_retoma']['total_tokens']>0, 'Falta medir o custo desta retoma.')
    relatorio = ler(AQUI/'relatorio.json') if (AQUI/'relatorio.json').exists() else None
    if final: exige(relatorio is not None and relatorio['numeros_sem_ficheiro']==0 and relatorio['conhecido_positivo']['encontrado'], 'Falta a conferência do relatório a zero.')
    return {'recibos_finais':recibos_finais,'custo_retoma':custo_retoma,'contagens_registo':contagens_registo,'historia':historias,'enderecos_antes':enderecos,'plantas_historia':plantas_historia,'relatorio':relatorio,'base':BASE,'base_motor':BASE_MOTOR,'cabeca_sitio':git('rev-parse','HEAD'),'cabeca_motor':git('rev-parse','HEAD',repo=motor),
            'commits':{'sitio':commits(SITIO,'48a5a1c181c1753036d301204884c57119bba8a5'),'motor':commits(motor,'4eb2867936dd14ad2654751722e390804e68dda3')},
            'linhas_conferidas':len(nomes),'mudancas_de_valor_ou_endereco':mudancas,'geradas':geradas,'pib':pib,'pedidos':pedidos,'literais':literais,
            'protegidos_motor_alterados':protegidos,'caminhos':caminhos,'portoes':portoes,'provas':provas,
            'capturas': None if capturas is None else {k:capturas[k] for k in ('dist_construido_de','larguras','idsDeRecibos','cartoes','aceitacao')},'erros':erros}

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--motor',type=Path,required=True)
    ap.add_argument('--final',action='store_true')
    ap.add_argument('--verifica',action='store_true')
    args=ap.parse_args()
    m=mede(args.motor.expanduser(),args.final or args.verifica)
    if not args.verifica:
        (AQUI/'medidas.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
        geral=ler(BLOCO/'medidas.json');geral['C1c']=m
        (BLOCO/'medidas.json').write_text(json.dumps(geral,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'linhas':m['linhas_conferidas'],'caminhos':m['caminhos'],'erros':m['erros']},ensure_ascii=False,indent=2))
    raise SystemExit(bool(m['erros']))
