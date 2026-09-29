"""Confere as provas pedidas na C1h, sem repetir os portões."""
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
RAIZ = AQUI.parents[4]
BASE = '9d283c6b1e5c69dfa3a7aac34a509fe284c7b8e8'
def ler(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def git(*args): return subprocess.check_output(['git',*args],cwd=RAIZ,text=True).strip()
erros = []
def exige(ok, msg):
    if not ok: erros.append(msg)

portoes = {}
for nome in ('build','verify','typecheck'):
    p = BLOCO/'portoes/c1h'/nome
    r = {k:Path(str(p)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')}
    r['codigo'] = int(r['codigo']);portoes[nome] = r
    exige(r['codigo']==0 and ler(AQUI/f'concorrencia-{nome}.json')['livre'], f'{nome}: falta o zero ou a conferência de concorrência.')
cabeca = portoes['build']['cabeca']
exige({r['cabeca'] for r in portoes.values()}=={cabeca}, 'Os portões não medem a mesma cabeça.')
exige(ler(RAIZ/'dist/version.json')['commit']==cabeca, 'A construção é de outra cabeça.')
exige(all(n.startswith(str(BLOCO.relative_to(RAIZ))+'/') for n in git('diff','--name-only',cabeca).splitlines()), 'Mudou código depois dos portões.')
exige(not git('diff','--name-only',BASE,'--','ledger'), 'O livro ou o registo mudou na C1h.')
cruzamento = ler(AQUI/'cruzamento-registo.json')
reg = cruzamento['ficheiro']
comprometido = hashlib.sha256(subprocess.check_output(['git','show',cabeca+':'+reg],cwd=RAIZ)).hexdigest()
exige(cruzamento['codigo']==0 and cruzamento['cabeca_da_corrida']==cabeca and cruzamento['sem_edicao_na_arvore_da_corrida'] and sha(RAIZ/reg)==comprometido==cruzamento['sha256_comprometido']==cruzamento['sha256_atual'], 'A prova isolada não corresponde ao registo comprometido.')
exige((AQUI/'cruzamento.codigo').read_text().strip()=='0', 'A travessia isolada não passou.')
capturas = ler(AQUI/'capturas-depois.json')
ids = {r['id'] for r in ler(BLOCO/'c1g/acessos.json')['linhas']}
matriz = {(r['familia'].removeprefix('recibo-'),r['lingua'],r['largura']) for r in capturas['resultados']}
exige(matriz=={(id,l,w) for id in ids for l in ('pt','en') for w in (390,768,1024,1280,1600)} and len(capturas['resultados'])==50, 'A matriz dos cinco recibos está incompleta.')
exige(capturas['aceitacao']['passou'] and capturas['dist_construido_de']==cabeca, 'As capturas falharam ou são de outra cabeça.')
for r in capturas['resultados']:
    exige(sha(AQUI/'capturas'/r['ficheiro'])==r['sha256'], 'Uma captura mudou depois de medida.')
indice = ler(AQUI/'paginas-depois/INDICE.json')
for nome,r in indice['copias'].items():
    exige(sha(AQUI/'paginas-depois'/nome)==r['sha256'], 'Uma cópia selada mudou.')
privacidade = ler(AQUI/'privacidade-dist.json');origem = privacidade['origem']
exige(privacidade['passou'] and origem['codigo']==0 and origem['cabeca']==cabeca and sha(BLOCO/origem['ficheiro'])==origem['sha256'], 'Falta a prova de privacidade do verify final.')
exige({'nome-da-casa-real','nome-pessoal-portavel','ligacao-home-na-conta-generica'}.issubset(p['id'] for p in privacidade['plantas']), 'Falta uma planta pedida.')
for etapa in ('c1g','c1h'):
    c = ler(BLOCO/etapa/'custo.json')
    exige(c[etapa]['total_tokens']==c['ultima_leitura']['cumulativos']['total_tokens']-c['antes']['cumulativos']['total_tokens'], f'{etapa}: o custo não corresponde aos contadores.')
    exige(c['segundos']==(datetime.fromisoformat(c['ultima_leitura']['hora'])-datetime.fromisoformat(c['pedido'])).total_seconds(), f'{etapa}: a duração não corresponde às horas.')
spec = importlib.util.spec_from_file_location('detetor_c1h', BLOCO/'medir-c1.py')
detetor = importlib.util.module_from_spec(spec);spec.loader.exec_module(detetor)
nomes = set(git('diff','--name-only',BASE).splitlines()) | set(git('ls-files','--others','--exclude-standard').splitlines())
ficheiros = [n for n in sorted(nomes) if (RAIZ/n).is_file() and '__pycache__' not in Path(n).parts]
achados = [n for n in ficheiros if detetor.tem_caminho((RAIZ/n).read_bytes())]
positivos = [detetor.tem_caminho(b) for b in detetor.proibidos()+list(detetor.nomes_dos_autores())+[sys.executable.encode()]]
exige(not achados and positivos and all(positivos), 'Falhou a privacidade dos ficheiros da passagem.')
relatorio = ler(AQUI/'relatorio.json')
exige(relatorio['numeros_sem_ficheiro']==0 and relatorio['conhecido_positivo']['encontrado'], 'O relatório tem números sem ficheiro.')
r = {'registado_em':datetime.now(timezone.utc).isoformat(), 'base':BASE, 'cabeca_codigo':cabeca,
     'portoes':portoes, 'cruzamento':cruzamento, 'livro_e_registo_intactos':not git('diff','--name-only',BASE,'--','ledger'),
     'capturas':{'ambito':'Cinco recibos do PRR, nas duas edições e nas cinco larguras.', 'ids':sorted(ids), 'quantidade':len(capturas['resultados']), 'copias':len(indice['copias']), 'cabeca':capturas['dist_construido_de'], 'aceitacao':capturas['aceitacao']},
     'privacidade_dist':privacidade, 'privacidade_da_passagem':{'ficheiros':len(ficheiros),'quantidade':len(achados),'achados':achados,'conhecidos_positivos':positivos},
     'custos':{e:ler(BLOCO/e/'custo.json') for e in ('c1g','c1h')}, 'relatorio':relatorio,
     'commits':[dict(zip(('hash','assunto'),l.split(' ',1))) for l in git('log','--reverse','--format=%H %s','48a5a1c181c1753036d301204884c57119bba8a5..HEAD').splitlines()],
     'aceitacao_do_mandato_c1h':not erros, 'erros_da_medicao':erros}
if '--verifica' not in sys.argv:
    (AQUI/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    geral = ler(BLOCO/'medidas.json');geral['C1h'] = r
    (BLOCO/'medidas.json').write_text(json.dumps(geral,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:r[k] for k in ('cabeca_codigo','capturas','privacidade_da_passagem','aceitacao_do_mandato_c1h','erros_da_medicao')},ensure_ascii=False,indent=2))
raise SystemExit(bool(erros))
