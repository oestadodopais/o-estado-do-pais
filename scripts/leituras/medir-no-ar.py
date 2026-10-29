#!/usr/bin/env python3
"""Compara o texto HTML construído com o publicado, com contexto e sem escrever ficheiros.

OEDP_ORIGEM permite escolher outra origem HTTP(S); por omissão, o sítio publicado.
Não executa JavaScript nem interpreta CSS: compara texto do corpo do HTML.
Saídas: 0 igual, 1 diferenças, 9 leitura impossível.
"""
import argparse
import difflib
from html.parser import HTMLParser
import os
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlsplit


class Texto(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.corpo = False
        self.omitir = []
        self.partes = []

    def handle_starttag(self, tag, attrs):
        if tag == 'body':
            self.corpo = True
        if tag in ('script', 'style', 'template'):
            self.omitir.append(tag)
        if tag in ('p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'tr', 'section', 'article'):
            self.partes.append('\n')

    def handle_endtag(self, tag):
        if self.omitir and tag == self.omitir[-1]:
            self.omitir.pop()
        if tag == 'body':
            self.corpo = False
        if tag in ('p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr', 'section', 'article'):
            self.partes.append('\n')

    def handle_data(self, data):
        if self.corpo and not self.omitir:
            self.partes.append(data)


def texto(html):
    p = Texto(); p.feed(html)
    return [' '.join(l.split()) for l in ''.join(p.partes).splitlines() if l.strip()]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('dist', type=Path)
    p.add_argument('caminhos', nargs='+')
    args = p.parse_args()
    origem = os.environ.get('OEDP_ORIGEM', 'https://xn--oestadodopas-2fb.pt').rstrip('/')
    codigo = 0
    try:
        u = urlsplit(origem)
        if u.scheme not in ('http', 'https') or not u.netloc or u.username or u.password or u.query or u.fragment:
            raise ValueError('origem HTTP(S) inválida')
        for caminho in args.caminhos:
            rota = urlsplit(caminho)
            if rota.scheme or rota.netloc or rota.query or rota.fragment or '..' in Path(rota.path).parts:
                raise ValueError('caminho de página inválido')
            local = (args.dist / rota.path.lstrip('/')).resolve()
            if not local.is_relative_to(args.dist.resolve()):
                raise ValueError('página fora do dist')
            if local.is_dir():
                local /= 'index.html'
            construido = texto(local.read_text(encoding='utf-8'))
            r = subprocess.run(['curl', '--silent', '--show-error', '--fail', '--location', '--max-time', '30',
                                '--proto', '=http,https', '-H', 'cache-control: no-cache', origem + '/' + rota.path.lstrip('/')],
                               capture_output=True, check=True)
            publicado = texto(r.stdout.decode('utf-8'))
            if not construido or not publicado:
                raise ValueError('página sem texto no corpo HTML')
            diferencas = list(difflib.unified_diff(construido, publicado, fromfile='construído:' + caminho,
                                                 tofile='no-ar:' + caminho, lineterm='', n=3))
            print('\n'.join(diferencas) if diferencas else caminho + ': texto igual')
            codigo = max(codigo, bool(diferencas))
        return codigo
    except (OSError, ValueError, subprocess.CalledProcessError):
        print('medir-no-ar: não foi possível ler ou comparar a página; confira os argumentos e a resposta HTTP', file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(main())
