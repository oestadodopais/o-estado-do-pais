#!/usr/bin/env python3
"""CAM2-A: a M83 inteira e os excertos do registo, sem rede.
Reutiliza o índice do pacote; os bytes vêm dos objetos Git, não de ficheiros soltos.
"""
import gzip
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unicodedata
from pacote import git, indice_dos_corpos


def normal(texto):
    texto = unicodedata.normalize('NFKC', texto).replace('\u00ad', '')
    texto = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', texto)
    texto = texto.translate(str.maketrans('’‘“”', "''\"\""))
    return re.sub(r'\s+', ' ', texto).strip()


class TextoHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.partes, self.ignorar = [], 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.ignorar += 1
        if tag in ('p', 'div', 'br', 'li', 'td', 'th', 'tr', 'section', 'h1', 'h2', 'h3'): self.partes.append(' ')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.ignorar = max(0, self.ignorar - 1)
        if tag in ('p', 'div', 'li', 'td', 'th', 'tr', 'section'): self.partes.append(' ')
    def handle_data(self, data):
        if not self.ignorar: self.partes.append(data)


def texto_do_corpo(raw):
    if raw[:2] == b'\x1f\x8b': raw = gzip.decompress(raw)
    if raw.startswith(b'%PDF'):
        with tempfile.TemporaryDirectory(prefix='cam2a-corpo-') as tmp:
            f = Path(tmp) / 'corpo.pdf'; f.write_bytes(raw)
            texto = subprocess.run(['pdftotext', '-q', str(f), '-'], capture_output=True, check=True, timeout=120).stdout.decode('utf-8')
    else:
        texto = raw.decode('utf-8-sig')
        if re.search(r'<(?:!doctype|html|body|p|div)\b', texto, re.I):
            parser = TextoHTML(); parser.feed(texto); texto = ''.join(parser.partes)
    return normal(texto)


def indice_completo(repo, motor, precisos):
    cabeca = git(repo, 'rev-parse', 'HEAD').decode().strip()
    cabeca_motor = git(motor, 'rev-parse', 'HEAD').decode().strip()
    nomes = git(motor, 'ls-tree', '-r', '--name-only', '-z', cabeca_motor, '--', 'content').split(b'\0')
    estudos = {os.fsdecode(n).split('/source/')[0] for n in nomes if b'/source/' in n}
    indice = {s: (motor, cabeca_motor, p) for s, (p, _) in indice_dos_corpos(repo, cabeca, motor, cabeca_motor, estudos, precisos).items()}
    # As edições arquivadas pertencem ao Git do sítio e também são identificadas pelos bytes.
    for p in git(repo, 'ls-tree', '-r', '--name-only', '-z', cabeca, '--', 'studies-src/_edicoes').split(b'\0'):
        if not p: continue
        p = os.fsdecode(p); raw = git(repo, 'show', f'{cabeca}:{p}'); sha = hashlib.sha256(raw).hexdigest()
        if sha in precisos: indice.setdefault(sha, (repo, cabeca, p))
    return indice


def conferir(linhas, indice, excertos=False):
    erros, cache = [], {}
    for linha in linhas:
        sha = (linha.get('document') or {}).get('source_sha256')
        if sha is None: continue
        if not isinstance(sha, str) or not re.fullmatch('[0-9a-f]{64}', sha):
            erros.append(f'{linha["id"]}: source_sha256 inválido'); continue
        if sha not in indice:
            erros.append(f'{linha["id"]}: corpo não alojado pelo sha256'); continue
        if excertos:
            if sha not in cache:
                repo, cabeca, p = indice[sha]
                raw = git(repo, 'show', f'{cabeca}:{p}')
                if hashlib.sha256(raw).hexdigest() != sha: raise ValueError('corpo diferente do índice')
                cache[sha] = texto_do_corpo(raw)
            excerpt = normal(linha.get('excerpt') or '')
            if not excerpt or excerpt not in cache[sha]: erros.append(f'{linha["id"]}: excerto ausente do corpo')
    return erros


def main():
    pedido = json.load(sys.stdin)
    motor = os.environ.get('RESEARCHHUB_DIR')
    if not motor:
        print(json.dumps({'estado':'não leu os corpos: RESEARCHHUB_DIR ausente', 'limpa':False, 'lidas':0, 'erros':[]})); return
    linhas = pedido['linhas']
    precisos = {l['document']['source_sha256'] for l in linhas if (l.get('document') or {}).get('source_sha256')}
    indice = indice_completo(Path.cwd(), Path(motor), precisos)
    erros = conferir(linhas, indice, pedido.get('excertos', False))
    print(json.dumps({'estado':'corpos lidos', 'limpa':not erros, 'lidas':sum((l.get('document') or {}).get('source_sha256') in indice for l in linhas), 'erros':erros}, ensure_ascii=False))
    sys.exit(bool(erros))


if __name__ == '__main__':
    try: main()
    except Exception as erro:
        # Sem caminhos locais na saída que possa integrar um registo.
        print(json.dumps({'estado':'leitura dos corpos recusada', 'limpa':False, 'erros':[type(erro).__name__]})); sys.exit(1)
