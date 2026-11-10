#!/usr/bin/env python3
"""Atravessa uma edição de lançamento, só depois de provar os bytes das duas línguas."""
import datetime
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys


def sha(data):
    return hashlib.sha256(data).hexdigest()


def atravessar(motor, slug, data):
    datetime.date.fromisoformat(data)
    site = Path(__file__).resolve().parents[4]
    manifesto = site / 'studies-src/manifest.yml'
    texto = manifesto.read_text()
    registos = json.loads((site / 'registos/manifest.json').read_text())['registos']
    preparados = []
    for lang in ('pt', 'en'):
        r = registos[f'{slug}/{lang}']
        origem = Path(r['origin_ref'].split(' @ ')[0]).parent / r['edicao_html']
        pasta = motor / origem.parent
        prova = json.loads((pasta / 'records.manifest.json').read_text())
        entradas = [e for e in prova['registos'] if e['edicao_html'] == origem.name]
        if len(entradas) != 1:
            raise ValueError('O motor não prova uma única edição para a língua pedida.')
        octetos = (motor / origem).read_bytes()
        resumo = sha(octetos)
        if resumo != entradas[0]['edicao_html_sha256'] or resumo != r['edicao_html_sha256']:
            raise ValueError('D5: os bytes não correspondem aos dois manifestos.')
        commit = subprocess.check_output(['git', '-C', str(motor), 'log', '-1', '--format=%H', '--', str(origem)], text=True).strip()
        selado = subprocess.check_output(['git', '-C', str(motor), 'show', f'{commit}:{origem}'])
        if selado != octetos:
            raise ValueError('Os bytes não estão no commit de origem.')
        padrao = rf'(?m)^  - slug: {re.escape(slug)}\n    lang: {lang}\n.*?(?=^  - slug: |\Z)'
        bloco = re.search(padrao, texto, re.S)
        if not bloco:
            raise ValueError('Falta a entrada do documento no sítio.')
        titulo = re.search(r'^    title: (.+)$', bloco[0], re.M)[1]
        agora = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
        novo = f'''  - slug: {slug}
    lang: {lang}
    edicoes:
      - data: '{data}'
        sha256: {resumo}
        file: {slug}/{lang}.html
    title: {titulo}
    origin: researchhub
    origin_ref: {json.dumps(f'{origem} @ {commit}', ensure_ascii=False)}
    raw_file: _raw/{slug}.{lang}.html
    fetched_utc: '{agora}'
    bytes_raw: {len(octetos)}
    bytes_normalized: {len(octetos)}
    sha256_raw: {resumo}
    sha256_normalized: {resumo}
'''
        texto = texto[:bloco.start()] + novo + texto[bloco.end():]
        preparados.append((lang, octetos, resumo, commit))
    # Nenhuma escrita antes de conferir ambas as línguas e os commits de origem.
    for lang, octetos, resumo, commit in preparados:
        for destino in (f'_raw/{slug}.{lang}.html', f'{slug}/{lang}.html'):
            p = site / 'studies-src' / destino
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(octetos)
            assert sha(p.read_bytes()) == resumo
        for p in (site / 'studies-src/_edicoes').glob(f'{slug}.{lang}.*.html'):
            p.unlink()
        print(f'{slug}/{lang}: {len(octetos)} bytes; sha256 {resumo}; origem {commit}')
    manifesto.write_text(texto)


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.exit('uso: atravessar-documentos.py <motor> <slug> <data>')
    atravessar(Path(sys.argv[1]).resolve(), sys.argv[2], sys.argv[3])
