"""The store of sources: where a copy lives, how its text is read, how it is fetched.

The store is a folder named by the environment variable OEDP_FONTES, laid out as
`sha256/<first two characters>/<the other 62>`. Copies never enter this
repository; the tests use a small store of their own under `ensaios/fontes/`.

`texto_por_pagina` is the one reading of a copy: check 2 searches it and the
command `texto` prints it, so what a reporter copies is what the check compares.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import html
import html.parser
import io
import os
import re
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
from pathlib import Path

AGENTE = "OEstadoDoPais-fonte/1"
SHA = re.compile(r"[0-9a-f]{64}\Z")


class ErroDaLoja(Exception):
    pass


def loja() -> Path | None:
    valor = os.environ.get("OEDP_FONTES", "").strip()
    return Path(valor) if valor else None


def caminho_da_copia(raiz: Path, sha256: str) -> Path:
    if not SHA.match(sha256 or ""):
        raise ErroDaLoja(f"{sha256!r} is not a SHA-256 in lower-case hex")
    return Path(raiz) / "sha256" / sha256[:2] / sha256[2:]


def guardar(raiz: Path, dados: bytes) -> str:
    sha = hashlib.sha256(dados).hexdigest()
    destino = caminho_da_copia(raiz, sha)
    if not destino.exists():
        destino.parent.mkdir(parents=True, exist_ok=True)
        temporario = destino.with_name(destino.name + ".parcial")
        temporario.write_bytes(dados)
        temporario.replace(destino)
    return sha


# --------------------------------------------------------------------------- reading


def normalizar(texto: str) -> str:
    """NFKC, soft hyphens dropped, every run of white space made one space."""
    texto = unicodedata.normalize("NFKC", texto).replace("­", "")
    return re.sub(r"\s+", " ", texto).strip()


class _SemEtiquetas(html.parser.HTMLParser):
    SALTAR = {"script", "style", "noscript", "template"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.partes: list[str] = []
        self.dentro = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SALTAR:
            self.dentro += 1
        self.partes.append(" ")

    def handle_endtag(self, tag):
        if tag in self.SALTAR and self.dentro:
            self.dentro -= 1
        self.partes.append(" ")

    def handle_data(self, data):
        if not self.dentro:
            self.partes.append(data)


def _descodificar(dados: bytes) -> str:
    for cod in ("utf-8", "cp1252"):
        try:
            return dados.decode(cod)
        except UnicodeDecodeError:
            continue
    return dados.decode("latin-1")


def especie(dados: bytes) -> str:
    """pdf, xlsx, html or texto, read from the bytes themselves."""
    if dados.startswith(b"%PDF-"):
        return "pdf"
    if dados.startswith(b"PK\x03\x04"):
        return "xlsx"
    cabeca = dados[:2048].lstrip().lower()
    if cabeca.startswith(b"<!doctype html") or cabeca.startswith(b"<html") or b"<html" in cabeca or b"<body" in cabeca:
        return "html"
    return "texto"


def texto_por_pagina(dados: bytes) -> list[str]:
    """The normalised text of a copy, one string per page (one page unless a PDF)."""
    tipo = especie(dados)
    if tipo == "pdf":
        import pymupdf

        with pymupdf.open(stream=dados, filetype="pdf") as doc:
            return [normalizar(p.get_text()) for p in doc]
    if tipo == "xlsx":
        import openpyxl

        livro = openpyxl.load_workbook(io.BytesIO(dados), read_only=True, data_only=True)
        celulas = []
        for folha in livro.worksheets:
            for linha in folha.iter_rows(values_only=True):
                for v in linha:
                    if v is not None and str(v).strip():
                        celulas.append(str(v))
        livro.close()
        return [normalizar("\n".join(celulas))]
    if tipo == "html":
        p = _SemEtiquetas()
        p.feed(_descodificar(dados))
        p.close()
        return [normalizar("".join(p.partes))]
    return [normalizar(_descodificar(dados))]


def procurar(excerto: str, paginas: list[str], pagina_pedida: int | None) -> int | None:
    """The 1-based page where the normalised excerpt is found, or None."""
    alvo = normalizar(excerto)
    if not alvo:
        return None
    ordem = list(range(1, len(paginas) + 1))
    if pagina_pedida and 1 <= pagina_pedida <= len(paginas):
        ordem.remove(pagina_pedida)
        ordem.insert(0, pagina_pedida)
    for n in ordem:
        if alvo in paginas[n - 1]:
            return n
    return None


# --------------------------------------------------------------------------- fetching


def _pedir(url: str, abrir=urllib.request.urlopen):
    pedido = urllib.request.Request(url, headers={"User-Agent": AGENTE})
    return abrir(pedido, timeout=60)


def robots_permite(url: str, abrir=urllib.request.urlopen) -> tuple[bool, str]:
    partes = urllib.parse.urlsplit(url)
    endereco = f"{partes.scheme}://{partes.netloc}/robots.txt"
    leitor = urllib.robotparser.RobotFileParser(endereco)
    try:
        with _pedir(endereco, abrir) as r:
            leitor.parse(_descodificar(r.read()).splitlines())
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            return False, f"{endereco} answered {e.code}, which closes the host"
        if 400 <= e.code < 500:
            return True, f"{endereco} answered {e.code}: no rules"
        return False, f"{endereco} answered {e.code}; the rules cannot be read, so the host is not fetched"
    except (urllib.error.URLError, OSError) as e:
        return False, f"{endereco} could not be read ({e}); the host is not fetched"
    if leitor.can_fetch(AGENTE, url):
        return True, f"{endereco} allows it"
    return False, f"{endereco} closes this address to {AGENTE}"


def _toml_texto(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def buscar(url: str, raiz: Path, abrir=urllib.request.urlopen) -> str:
    """Fetch, store, and return the [[fonte]] table to paste. Raises ErroDaLoja."""
    permite, razao = robots_permite(url, abrir)
    if not permite:
        raise ErroDaLoja(f"refused: {razao}")
    try:
        with _pedir(url, abrir) as r:
            dados = r.read()
            final = r.geturl()
            estado = r.status
            tipo = (r.headers.get("Content-Type") or "").split(";")[0].strip()
    except urllib.error.HTTPError as e:
        raise ErroDaLoja(f"{url} answered {e.code}") from None
    except (urllib.error.URLError, OSError) as e:
        raise ErroDaLoja(f"{url} could not be fetched ({e})") from None
    sha = guardar(raiz, dados)
    lido = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    campos = [
        ("id", '""'),
        ("titulo", '""'),
        ("editor", '""'),
        ("url", _toml_texto(url)),
        ("url_final", _toml_texto(final)),
        ("lido_em", _toml_texto(lido)),
        ("http", str(estado)),
        ("tipo_conteudo", _toml_texto(tipo)),
        ("bytes", str(len(dados))),
        ("sha256", _toml_texto(sha)),
        ("publicado_em", '""'),
    ]
    return "[[fonte]]\n" + "".join(f"{k} = {v}\n" for k, v in campos)
