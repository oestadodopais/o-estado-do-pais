#!/usr/bin/env python3
"""CAM2-A, adenda B: igualdade dos bytes com duas exceções explícitas.
Só version.json e prova.json ficam fora; Método admite apenas 67 para 68.
"""
import datetime
import json
import os
from pathlib import Path
import re
import sys

BASE_COMMIT = 'f362f5ccd60dd7e81d12f4ff194b16bc72714b30'
EXCLUIDOS = {'version.json', 'prova.json'}
METODO = {'metodo/index.html', 'en/method/index.html'}
CONTAGEM = re.compile(rb'(<a\b[^>]*\bdata-prova=["\']conferencias_da_corrida["\'][^>]*>)(67)(</a>)')


def metodo_autorizado(antes, depois):
    """Uma única ocorrência, presa ao campo, sem normalizar qualquer outro byte."""
    if len(CONTAGEM.findall(antes)) != 1:
        return False
    esperado = CONTAGEM.sub(lambda m: m[1] + b'68' + m[3], antes)
    return esperado == depois


def comparar(base, atual, hoje=None):
    hoje = hoje or datetime.datetime.now(datetime.timezone.utc).date().isoformat()
    vb = json.loads((base / 'version.json').read_text())
    va = json.loads((atual / 'version.json').read_text())
    def dia(v):
        d = datetime.datetime.fromisoformat(v['construido_em'].replace('Z', '+00:00'))
        if d.tzinfo is None:
            raise ValueError('instante da construção sem fuso')
        return d.astimezone(datetime.timezone.utc).date().isoformat()
    if vb.get('commit') != BASE_COMMIT:
        raise ValueError('base não é f362f5ccd')
    if dia(vb) != hoje or dia(va) != hoje:
        raise ValueError('PAROU: construção e base têm de pertencer ao mesmo dia UTC atual')
    def caminhos(pasta):
        return {str(f.relative_to(pasta)) for f in pasta.rglob('*') if f.is_file()} - EXCLUIDOS
    a, b = caminhos(base), caminhos(atual)
    if not a or not b:
        raise ValueError('dist sem ficheiros')
    novas, apagadas = sorted(b-a), sorted(a-b)
    iguais, autorizadas, alteradas = 0, [], []
    for nome in sorted(a & b):
        x, y = (base/nome).read_bytes(), (atual/nome).read_bytes()
        if x == y:
            iguais += 1
        elif nome in METODO and metodo_autorizado(x, y):
            autorizadas.append({'pagina':nome, 'campo':'conferencias_da_corrida', 'antes':67, 'depois':68})
        else:
            alteradas.append(nome)
    faltam_metodo = sorted(METODO - (a & b))
    return {'base_commit':vb['commit'], 'atual_commit':va.get('commit'),
            'base_construido_em':vb['construido_em'], 'atual_construido_em':va['construido_em'], 'dia_utc':hoje,
            'ficheiros_base':len(a), 'ficheiros_atual':len(b), 'paginas_html':sum(n.endswith('.html') for n in a),
            'iguais_byte_a_byte':iguais, 'diferencas_autorizadas':autorizadas,
            'novas':novas, 'apagadas':apagadas, 'outras_diferencas':alteradas,
            'paginas_metodo_ausentes':faltam_metodo, 'excluidos':sorted(EXCLUIDOS),
            'ok':not (novas or apagadas or alteradas or faltam_metodo)}


def main():
    r = comparar(Path(os.environ['OEDP_DIST_BASE']), Path(sys.argv[1] if len(sys.argv)>1 else 'dist'))
    if len(sys.argv)>2:
        Path(sys.argv[2]).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'ok':r['ok'], 'dia_utc':r['dia_utc'], 'ficheiros':r['ficheiros_atual'], 'paginas_html':r['paginas_html'], 'iguais_byte_a_byte':r['iguais_byte_a_byte'], 'metodo_autorizadas':len(r['diferencas_autorizadas']), 'novas':len(r['novas']), 'apagadas':len(r['apagadas']), 'outras_diferencas':len(r['outras_diferencas'])},ensure_ascii=False))
    return 0 if r['ok'] else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError, KeyError, OSError) as erro:
        print('comparação recusada: ' + (str(erro) if isinstance(erro, ValueError) else type(erro).__name__))
        sys.exit(2)
