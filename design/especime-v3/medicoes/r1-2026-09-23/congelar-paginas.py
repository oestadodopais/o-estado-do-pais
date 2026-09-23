#!/usr/bin/env python3
"""Congela as páginas construídas que o relatório do R1 mede, com o sha256 de cada uma.

    python3 design/especime-v3/medicoes/r1-2026-09-23/congelar-paginas.py   (na raiz do sítio)

Copia de `dist/` para `paginas-depois/`, ao lado, as páginas que o `medir.py` lê,
com o mesmo nome achatado que o guião do brief usa para as cópias do antes
(`paginas/`), e escreve `paginas-depois/INDICE.json` com a cabeça da árvore, o
commit de que o `dist/` saiu e o sha256 de cada cópia. O `medir.py` lê as cópias e
não o `dist/`, para que as medidas não mudem com a construção seguinte, e confere
cada resumo antes de medir. As cópias do antes (`paginas/`) são do lugar de
direção e não se tocam.
"""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
DIST = RAIZ / 'dist'
DESTINO = AQUI / 'paginas-depois'
ROTAS = [
    'index.html', 'en/index.html',
    'temas/index.html', 'en/themes/index.html',
    'uniao-europeia/index.html',
    'municipios/mourao/index.html', 'en/municipalities/mourao/index.html',
    'livro-razao/mourao-desemprego-registado-2025-12/index.html',
    'estudos/index.html', 'en/studies/index.html',
    'lugares/index.html',
    'metodo/index.html', 'en/method/index.html',
    'correcoes/index.html',
    'livro-razao/divida-publica-2025-notificacao-ine-2026-09/index.html',
    'agenda/index.html',
]
DESTINO.mkdir(exist_ok=True)
versao = json.loads((DIST / 'version.json').read_text(encoding='utf-8'))
indice = {
    'cabeca_da_arvore': subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=RAIZ, capture_output=True, text=True, check=True).stdout.strip(),
    'dist_construido_de': versao['commit'],
    'dist_construido_em': versao['construido_em'],
    'copias': {},
}
for rota in ROTAS:
    origem = DIST / rota
    nome = rota.replace('/', '_')
    shutil.copyfile(origem, DESTINO / nome)
    indice['copias'][nome] = {'rota': '/' + rota.removesuffix('index.html'),
                              'sha256': hashlib.sha256((DESTINO / nome).read_bytes()).hexdigest()}
(DESTINO / 'INDICE.json').write_text(json.dumps(indice, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"{len(ROTAS)} páginas congeladas de dist/ (construído de {versao['commit'][:8]}) em {DESTINO.relative_to(RAIZ)}")
