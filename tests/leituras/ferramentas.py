#!/usr/bin/env python3
"""Exerce custos Claude/Codex, limpeza idempotente e capturas locais com plantas.

Uso: python3 tests/leituras/ferramentas.py [--json ficheiro] [--sem-capturas].
As sessões e páginas são sintéticas. O ensaio não lê mensagens reais, não
usa rede externa e não toca na construção do projeto nem no motor.
"""
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile

RAIZ = Path(__file__).resolve().parents[2]
def modulo(nome, ficheiro):
    s = importlib.util.spec_from_file_location(nome, RAIZ/'scripts/leituras'/ficheiro)
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
custo = modulo('custo','custo.py'); limpar = modulo('limpar','limpar-caminhos.py')
casos = []
def registar(nome, mensagem): casos.append({'planta':nome,'mensagem':mensagem,'passou':True})
def jsonl(eventos): return ('\n'.join(json.dumps(e) for e in eventos)+'\n').encode()
def instante(n): return f'2026-10-06T00:00:{n:02}Z'

eventos = [{'timestamp':instante(n),'message':{'id':'id-sintetico','model':'modelo-de-ensaio',
           'usage':{'input_tokens':20,'cache_creation_input_tokens':3,'cache_read_input_tokens':4,'output_tokens':saida},'content':'x'*1200}} for n,saida in [(0,2),(5,8),(8,3)]]
r = custo.medir(jsonl(eventos)); assert r['respostas_do_modelo']==1 and r['simbolos']['output_tokens']==8 and r['simbolos']['input_tokens']==20 and r['segundos']==8 and r['respostas_com_saida_parcial']==1
registar('partes repetidas de Claude','Uma resposta; entrada da última parte e máximo da saída, marcado como mínimo.')
eventos = [{'timestamp':instante(n),'type':'event_msg','payload':{'type':'token_count','info':{'total_token_usage':{'input_tokens':entrada,'output_tokens':saida,'cached_input_tokens':0,'total_tokens':entrada+saida}}}} for n,entrada,saida in [(0,10,2),(5,20,4),(9,20,4)]]
r = custo.medir(jsonl(eventos)); assert r['simbolos']['total_tokens']==24 and r['respostas_do_modelo'] is None
r = custo.medir(jsonl(eventos),instante(3)); assert r['simbolos']['total_tokens']==12
registar('acumulados Codex e corte temporal','A repetição não duplica os símbolos; o corte subtrai o contador anterior.')
for nome, dados in [('contador recuado',jsonl(eventos+eventos[:1])),('formato sem utilização',jsonl([{'timestamp':instante(0)}])),('linha truncada',b'{')]:
    try: custo.medir(dados)
    except (ValueError, KeyError) as e: registar(nome,str(e))
    else: raise AssertionError(nome)
with tempfile.TemporaryDirectory(prefix='oedp-ma-comuns-') as tmp:
    p = Path(tmp); worktree=p/'arvore'; worktree.mkdir(); pasta=worktree/'registos'; pasta.mkdir()
    casa=p/'casa com espaço'; motor=casa/'motor'; scratch=p/'scratch'; usuario='nome-sintetico'
    texto=f'{worktree}/a {motor}/b {scratch}/c {casa}/d {usuario}\n'
    (pasta/'registo.log').write_text(texto); (pasta/'dados.json.gz').write_bytes(gzip.compress(texto.encode()))
    (pasta/'imagem.png').write_bytes(b'\x89PNG\0\xff')
    fora=p/'fora'; fora.write_text(texto); (pasta/'ligacao').symlink_to(fora)
    args=dict(pasta=pasta,worktree=worktree,motor=motor,scratchpad=scratch,casa=casa,utilizador=usuario)
    r=limpar.limpar(**args); esperado='<worktree>/a <motor>/b <scratchpad>/c <casa>/d <utilizador>\n'
    assert (pasta/'registo.log').read_text()==esperado and gzip.decompress((pasta/'dados.json.gz').read_bytes()).decode()==esperado
    assert (pasta/'imagem.png').read_bytes()==b'\x89PNG\0\xff' and fora.read_text()==texto
    assert limpar.limpar(**args)['mudados']==[]
    registar('limpeza de texto, gzip, binários e ligações','Caminhos retirados; segunda passagem sem mudanças; binário e alvo da ligação intactos.')
    if '--sem-capturas' not in sys.argv:
        dist=p/'dist'; (dist/'en').mkdir(parents=True)
        head='a'*40; (dist/'version.json').write_text(json.dumps({'commit':head}))
        html='<!doctype html><html lang="pt"><head><link rel="stylesheet" href="/forma.css"></head><body><article><h1>Ensaio das capturas</h1><p>Página sintética.</p></article></body></html>'
        (dist/'index.html').write_text(html); (dist/'en/index.html').write_text(html)
        (dist/'forma.css').write_text('body{margin:24px;font:16px sans-serif}article{padding:20px;background:#eee}')
        pedido=p/'pedido.json'; conf={'cabeca':head,'paginas':[{'nome':'ensaio','pt':'/','en':'/en/','recortes':[{'nome':'cartao','seletor':'article'}]}]}
        pedido.write_text(json.dumps(conf))
        def captar(nome): return subprocess.run(['node',str(RAIZ/'scripts/leituras/captar.mjs'),str(pedido),str(p/nome),str(dist)],capture_output=True,text=True)
        hashes={f.relative_to(dist).as_posix():hashlib.sha256(f.read_bytes()).hexdigest() for f in dist.rglob('*') if f.is_file()}
        r=captar('limpo'); assert r.returncode==0,r.stdout+r.stderr
        recibo=json.loads((p/'limpo/capturas.json').read_text()); assert len(recibo['resultados'])==10
        assert len(list((p/'limpo').glob('*.png')))==20
        for f,selo in recibo['recursos'].items(): assert hashes[f]==selo
        for item in recibo['resultados']:
            for f in [item,*item['recortes']]: assert hashlib.sha256((p/'limpo'/f['ficheiro']).read_bytes()).hexdigest()==f['sha256']
        assert all(hashlib.sha256((dist/f).read_bytes()).hexdigest()==s for f,s in hashes.items())
        registar('capturas e recortes nas duas edições','Cinco larguras por edição; PNG, sha256 e recursos conferidos; construção intacta.')
        conf['cabeca']='b'*40; pedido.write_text(json.dumps(conf)); r=captar('cabeca'); assert r.returncode!=0 and not (p/'cabeca').exists()
        registar('captura de outra cabeça','captar: a cabeça pedida não é a de dist/version.json')
        conf['cabeca']=head; pedido.write_text(json.dumps(conf)); (dist/'index.html').write_text(html.replace('</body>','<img src="https://example.invalid/ensaio.png"></body>'))
        r=captar('externo'); assert r.returncode!=0; rec=json.loads((p/'externo/capturas.json').read_text()); assert rec['falhas'] and rec['resultados'][0]['externos']
        registar('pedido externo na captura',rec['falhas'][0])
        (dist/'index.html').write_text(html.replace('<article>','<section>').replace('</article>','</section>'))
        r=captar('recorte'); assert r.returncode!=0; rec=json.loads((p/'recorte/capturas.json').read_text()); assert 'não aparece uma vez' in rec['falhas'][0]
        registar('recorte ausente',rec['falhas'][0])
saida={'ok':True,'casos':casos}
if '--json' in sys.argv: Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(saida,ensure_ascii=False,indent=2))
