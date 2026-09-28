"""C1e: os nomes lidos do Git e os caminhos locais também não entram em dist/."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('detetor_c1', RAIZ/'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py')
detetor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(detetor)

def conferir(ficheiros):
    vistos, achados = 0, []
    for nome, corpo in ficheiros:
        vistos += 1
        if detetor.tem_caminho(corpo): achados.append(nome)
    return {'ficheiros': vistos, 'quantidade': len(achados), 'achados': achados}

def medir(dist, prova):
    ficheiros = sorted(p for p in dist.rglob('*') if p.is_file())
    r = conferir((str(p.relative_to(dist)), p.read_bytes()) for p in ficheiros)
    r['plantas'] = []
    if prova:
        pagina = next((p for p in ficheiros if p.suffix == '.html'), None)
        if pagina is None: raise ValueError('Falta uma página construída para plantar o nome.')
        corpo = pagina.read_bytes()
        nomes = detetor.nomes_dos_autores()
        if not nomes: raise ValueError('O Git não forneceu nomes para o conhecido-positivo.')
        # As cópias são só em memória. Nenhum nome vai para a prova escrita.
        for i, nome in enumerate(nomes):
            copia = corpo.replace(b'</body>', b'<p>'+nome+b'</p></body>')
            if copia == corpo: raise ValueError('A planta não encontrou o corpo da página.')
            plantada = conferir([('pagina-construida.html', copia)])
            r['plantas'].append({'id':f'nome-do-git-{i+1}', 'pagina_base':str(pagina.relative_to(dist)),
                                'mordeu':plantada['quantidade']==1, 'falha':'nome pessoal ou caminho local na página construída'})
        from unittest.mock import patch
        # A mesma página pode conter URL, seletor CSS e palavras de código.
        inocuo = b'<style>:root { color: red }</style><a href="https://example.org">root runner app</a>'
        for nome in ('', 'root', 'runner', 'app', 'code'):
            pasta = Path('/') / nome
            with patch.object(detetor.Path, 'home', return_value=pasta):
                r['plantas'].append({'id': 'pasta-generica-' + (nome or 'raiz'),
                                    'mordeu': not detetor.tem_caminho(inocuo)})
        for i, caminho in enumerate(detetor.proibidos()):
            r['plantas'].append({'id':f'caminho-{i+1}', 'mordeu':conferir([('pagina-construida.html',corpo+b'<p>'+caminho+b'</p>')])['quantidade']==1})
    r['passou'] = bool(ficheiros) and r['quantidade']==0 and all(p['mordeu'] for p in r['plantas'])
    return r

if __name__ == '__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--dist',type=Path,default=RAIZ/'dist');ap.add_argument('--prova',action='store_true');ap.add_argument('--json',type=Path)
    args=ap.parse_args();r=medir(args.dist,args.prova)
    if args.json: args.json.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(r,ensure_ascii=False,indent=2));raise SystemExit(not r['passou'])
