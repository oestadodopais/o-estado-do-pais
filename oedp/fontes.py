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
import ipaddress
import os
import socket
import re
import unicodedata
import json
import secrets
import shutil
import subprocess
import urllib.parse
from dataclasses import dataclass
from pathlib import Path

AGENTE = "OEstadoDoPais/1 (publicacao; leitura de fontes oficiais)"
SHA = re.compile(r"[0-9a-f]{64}\Z")


class ErroDaLoja(Exception):
    pass


REPO = Path(__file__).resolve().parent.parent


def loja() -> Path | None:
    """The private store named by OEDP_FONTES, or None when unset.

    It must resolve to a folder outside this repository's tree: copies of sources
    never enter the repository, and a store under `public/` would be published."""
    valor = os.environ.get("OEDP_FONTES", "").strip()
    if not valor:
        return None
    caminho = Path(valor).expanduser().resolve()
    if caminho == REPO or caminho.is_relative_to(REPO):
        raise ErroDaLoja(f"refused: OEDP_FONTES resolves inside the repository ({caminho.relative_to(REPO).as_posix() or '.'}); "
                         "the store of sources must live outside it")
    return caminho


def caminho_da_copia(raiz: Path, sha256: str) -> Path:
    if not SHA.match(sha256 or ""):
        raise ErroDaLoja(f"{sha256!r} is not a SHA-256 in lower-case hex")
    return Path(raiz) / "sha256" / sha256[:2] / sha256[2:]


def destino_confinado(raiz: Path, sha256: str) -> Path:
    """Where a copy is written: inside the resolved store, through folders that are not
    symbolic links. Raises ErroDaLoja otherwise."""
    base = Path(raiz).resolve()
    destino = caminho_da_copia(base, sha256)
    for pasta in (base / "sha256", destino.parent):
        if pasta.is_symlink():
            raise ErroDaLoja(f"refused: {pasta.relative_to(base).as_posix()} in the store is a symbolic link; the store's folders may not be")
    destino.parent.mkdir(parents=True, exist_ok=True)
    if not destino.parent.resolve().is_relative_to(base):
        raise ErroDaLoja("refused: the copy's folder resolves outside the store")
    return destino


def guardar(raiz: Path, dados: bytes) -> str:
    sha = hashlib.sha256(dados).hexdigest()
    destino = destino_confinado(raiz, sha)
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


def texto_impresso(dados: bytes) -> str:
    """A copy's text as `python3 -m oedp texto` prints it: page by page for a PDF."""
    paginas = texto_por_pagina(dados)
    if len(paginas) == 1:
        return paginas[0] + "\n"
    return "".join(f"=== p. {n} ===\n{texto}\n" for n, texto in enumerate(paginas, 1))


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


# --------------------------------------------------------------------------- fetching, through curl
#
# The fetch runs `curl` as a subprocess, with an argument list and never a shell:
# this machine's Python has no certificate store, and its connection to the
# statistics office times out where curl's does not (measured by the direction
# seat, 14 November 2026). A transport is a function (url, file) -> Resposta, so
# the tests give a fake one and never touch the network.


@dataclass
class Resposta:
    saida: int  # curl's exit code; 0 when the transfer completed
    http: int
    final: str
    tipo: str
    tamanho: int
    erro: str = ""
    redirecao: str = ""  # where a 3xx answer points, as curl reads it
    nota: str = ""  # said to the caller, e.g. that the request was tried again over HTTP/1.1


def transporte_curl(url: str, destino: Path, metodo: str = "GET", endereco: str | None = None) -> Resposta:
    """One request, redirects off. `endereco` pins the address curl connects to."""
    curl = shutil.which("curl")
    if curl is None:
        raise ErroDaLoja("curl is not installed here, and fonte fetches only through curl")
    args = [
        curl, "--silent", "--show-error", "--max-time", "120", "--max-filesize", "104857600",
        "--proto", "=https,http", "--user-agent", AGENTE, "--output", str(destino), "--write-out", "%{json}",
    ]
    if metodo == "HEAD":
        args.append("--head")
    if endereco:
        partes = urllib.parse.urlsplit(url)
        porta = partes.port or (443 if partes.scheme == "https" else 80)
        alvo = f"[{endereco}]" if ":" in endereco else endereco
        args += ["--resolve", f"{partes.hostname}:{porta}:{alvo}"]
    def correr(lista):
        try:
            return subprocess.run(lista + [url], capture_output=True, text=True, timeout=180)
        except subprocess.TimeoutExpired:
            raise ErroDaLoja(f"{url}: curl did not finish in 180 seconds") from None

    r = correr(args)
    nota = ""
    # A failure of transport (not a bad address, not a size limit) is tried once more over
    # HTTP/1.1: some hosts fail over HTTP/2 ("Invalid HTTP header field was received").
    if r.returncode not in (0, 1, 3, 6, 47, 63):
        primeiro = (r.stderr or "").strip() or f"curl exit {r.returncode}"
        r = correr(args + ["--http1.1"])
        nota = f"{url}: curl failed ({primeiro}); tried once more with --http1.1, which " + (
            "succeeded" if r.returncode == 0 else f"failed too (curl exit {r.returncode})")
    try:
        dados = json.loads(r.stdout) if r.stdout.strip() else {}
    except json.JSONDecodeError:
        dados = {}
    tamanho = destino.stat().st_size if destino.exists() else 0
    return Resposta(
        saida=r.returncode,
        http=int(dados.get("http_code") or 0),
        final=str(dados.get("url_effective") or url),
        tipo=str(dados.get("content_type") or "").split(";")[0].strip(),
        tamanho=int(dados.get("size_download") or tamanho),
        erro=(r.stderr or str(dados.get("errormsg") or "")).strip(),
        redirecao=str(dados.get("redirect_url") or ""),
        nota=nota,
    )


def resolver_dns(host: str, porta: int) -> list[str]:
    return sorted({info[4][0] for info in socket.getaddrinfo(host, porta, type=socket.SOCK_STREAM)})


def endereco_publico(url: str, resolver=resolver_dns) -> str:
    """The address to connect to, after checking the scheme and that every address the
    host resolves to is public. Raises ErroDaLoja otherwise."""
    partes = urllib.parse.urlsplit(url)
    if partes.scheme not in ("https", "http"):
        raise ErroDaLoja(f"refused: {url} is not an https or http address")
    if not partes.hostname:
        raise ErroDaLoja(f"refused: {url} has no host")
    porta = partes.port or (443 if partes.scheme == "https" else 80)
    try:
        enderecos = resolver(partes.hostname, porta)
    except OSError as e:
        raise ErroDaLoja(f"refused: {partes.hostname} could not be resolved ({e})") from None
    if not enderecos:
        raise ErroDaLoja(f"refused: {partes.hostname} resolves to no address")
    for a in enderecos:
        ip = ipaddress.ip_address(a.split("%")[0])
        if (not ip.is_global or ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved
                or ip.is_multicast or ip.is_unspecified):
            raise ErroDaLoja(f"refused: {partes.hostname} resolves to {a}, which is not a public address")
    return enderecos[0]


REDIRECOES = (301, 302, 303, 307, 308)
MAX_SALTOS = 5


# robots.txt, as RFC 9309 says (sections 2.2 and 2.3.1): a file fetched with
# success is obeyed, for the agent's own product token and otherwise for `*`, the
# longest matching rule winning and `allow` winning a tie; a 4xx answer means the
# file is unavailable and anything may be fetched; a 5xx answer or a network error
# means complete disallow. More than five redirects: unavailable (2.3.1.2).
TOKEN = AGENTE.split("/")[0].lower()


def _grupos(texto: str) -> dict[str, list[tuple[str, str]]]:
    grupos: dict[str, list[tuple[str, str]]] = {}
    agentes: list[str] = []
    em_regras = False
    for linha in texto.splitlines():
        linha = linha.split("#", 1)[0].strip()
        if ":" not in linha:
            continue
        chave, valor = (x.strip() for x in linha.split(":", 1))
        chave = chave.lower()
        if chave == "user-agent":
            if em_regras:
                agentes, em_regras = [], False
            agentes.append(valor.lower())
            for a in agentes:
                grupos.setdefault(a, [])
        elif chave in ("allow", "disallow") and agentes:
            em_regras = True
            for a in agentes:
                grupos[a].append((chave, valor))
    return grupos


def _casa(padrao: str, caminho: str) -> bool:
    if not padrao:
        return False
    fim = padrao.endswith("$")
    corpo = re.escape(padrao[:-1] if fim else padrao).replace(r"\*", ".*")
    return re.match(corpo + ("$" if fim else ""), caminho) is not None


def robots_decide(texto: str, url: str) -> bool:
    """Whether the rules of a robots.txt let this agent fetch `url`."""
    grupos = _grupos(texto)
    regras = grupos.get(TOKEN)
    if regras is None:
        regras = grupos.get("*", [])
    partes = urllib.parse.urlsplit(url)
    caminho = (partes.path or "/") + ("?" + partes.query if partes.query else "")
    if caminho == "/robots.txt":
        return True
    melhor = None
    for tipo, padrao in regras:
        if _casa(padrao, caminho):
            peso = len(padrao)
            if melhor is None or peso > melhor[0] or (peso == melhor[0] and tipo == "allow"):
                melhor = (peso, tipo)
    return melhor is None or melhor[1] == "allow"


def _um_pedido(url: str, raiz: Path, transporte, resolver, metodo: str = "GET", guardar_em: Path | None = None):
    """One request to a checked public address. Returns (answer, bytes); the bytes are
    kept in `guardar_em` when given, and otherwise discarded."""
    endereco = endereco_publico(url, resolver)
    temporario = guardar_em or _temporario(raiz)
    try:
        r = transporte(url, temporario, metodo, endereco)
        dados = temporario.read_bytes() if temporario.exists() else b""
    finally:
        if guardar_em is None:
            temporario.unlink(missing_ok=True)
    return r, dados


def robots_permite(url: str, raiz: Path, transporte=transporte_curl, resolver=resolver_dns) -> tuple[bool, str]:
    partes = urllib.parse.urlsplit(url)
    endereco = f"{partes.scheme}://{partes.netloc}/robots.txt"
    for salto in range(MAX_SALTOS + 1):
        try:
            r, dados = _um_pedido(endereco, raiz, transporte, resolver)
        except ErroDaLoja as e:
            return False, f"{endereco}: {e}"
        if r.saida != 0 or r.http == 0:
            return False, f"{endereco} could not be reached ({r.erro or 'curl exit ' + str(r.saida)}): complete disallow (RFC 9309, 2.3.1.4)"
        if r.http in REDIRECOES and r.redirecao:
            if salto == MAX_SALTOS:
                return True, f"{endereco} redirects more than five times: unavailable, so no rules (RFC 9309, 2.3.1.2)"
            endereco = urllib.parse.urljoin(endereco, r.redirecao)
            continue
        if 500 <= r.http <= 599:
            return False, f"{endereco} answered {r.http}: complete disallow (RFC 9309, 2.3.1.4)"
        if 400 <= r.http <= 499:
            return True, f"{endereco} answered {r.http}: unavailable, so no rules (RFC 9309, 2.3.1.3)"
        if 200 <= r.http <= 299:
            if robots_decide(_descodificar(dados), url):
                return True, f"{endereco} allows it"
            return False, f"{endereco} closes this address to {TOKEN}"
        return False, f"{endereco} answered {r.http}, which is not a success: complete disallow"
    return True, "unreachable branch"


def seguir(url: str, raiz: Path, transporte=transporte_curl, resolver=resolver_dns) -> tuple[Resposta | None, str, int]:
    """Follow redirects here, at most five, with HEAD requests. At every hop, the first
    included: an https or http address, a host whose every address is public, and its
    robots.txt obeyed. Returns (the last answer, the address it answered for, the hops
    used); the answer is None when the server does not answer HEAD (an error, 405 or
    501), and the caller then goes on with GET from that address."""
    for salto in range(MAX_SALTOS + 1):
        endereco_publico(url, resolver)
        permite, razao = robots_permite(url, raiz, transporte, resolver)
        if not permite:
            raise ErroDaLoja(f"refused: {razao}")
        r, _ = _um_pedido(url, raiz, transporte, resolver, "HEAD")
        if r.saida != 0 or r.http in (405, 501):
            return None, url, salto
        if r.http in REDIRECOES and r.redirecao:
            if salto == MAX_SALTOS:
                raise ErroDaLoja(f"refused: {url} redirects more than five times")
            url = urllib.parse.urljoin(url, r.redirecao)
            continue
        return r, url, salto
    raise ErroDaLoja("unreachable branch")


def _temporario(raiz: Path) -> Path:
    Path(raiz).mkdir(parents=True, exist_ok=True)
    return Path(raiz) / f".parcial-{os.getpid()}-{secrets.token_hex(6)}"


def _toml_texto(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


MINIMO = 512  # bytes; a smaller answer is usually an error page served with 200


def resumo_da_copia(dados: bytes, tipo: str) -> str:
    try:
        inicio = (texto_por_pagina(dados) or [""])[0][:100]
    except Exception as e:  # a copy whose text cannot be read is still described
        inicio = f"(text not readable: {e})"
    return f"{len(dados)} bytes, type {tipo or '(none given)'}; its text begins: «{inicio}»"


def buscar(url: str, raiz: Path, direitos_de=None, transporte=transporte_curl, termos: bool = False,
           resolver=resolver_dns, pequeno: bool = False, avisos: list | None = None) -> str:
    """Fetch, store, and return the table to paste. Raises ErroDaLoja; a refusal stores nothing.

    The redirects are followed here (see `seguir`); the rights record of the host
    (`direitos_de(host)` returns it or raises) is checked before every GET, so before the
    document is downloaded; curl itself never follows a redirect. With `termos`, the address is a publisher's terms page: no record is asked for,
    and the printed table is the beginning of one.
    """
    if avisos is not None:  # every request's note (a retry over HTTP/1.1) reaches the caller
        base = transporte

        def transporte(u, destino, metodo="GET", endereco=None):
            r = base(u, destino, metodo, endereco)
            if r.nota:
                avisos.append(r.nota)
            return r

    r_head, final, saltos = seguir(url, raiz, transporte, resolver)
    if r_head is not None and not 200 <= r_head.http <= 299:
        raise ErroDaLoja(f"refused: {final} answered {r_head.http}")
    temporario = _temporario(raiz)
    try:
        # GET from the last address HEAD reached. Before every GET, the rights record of
        # that host is checked, so no document is downloaded from a host without one;
        # a redirect met here (a server that does not answer HEAD) is followed with the
        # same checks as above, within the same five hops.
        while True:
            host_final = urllib.parse.urlsplit(final).hostname or ""
            if not termos and direitos_de is not None:
                direitos_de(host_final)
            temporario.unlink(missing_ok=True)
            r, dados = _um_pedido(final, raiz, transporte, resolver, "GET", guardar_em=temporario)
            if r.saida != 0:
                raise ErroDaLoja(f"{final} could not be fetched ({r.erro or 'curl exit ' + str(r.saida)})")
            if r.http in REDIRECOES and r.redirecao:
                if saltos >= MAX_SALTOS:
                    raise ErroDaLoja(f"refused: {final} redirects more than five times")
                saltos += 1
                final = urllib.parse.urljoin(final, r.redirecao)
                endereco_publico(final, resolver)
                permite, razao = robots_permite(final, raiz, transporte, resolver)
                if not permite:
                    raise ErroDaLoja(f"refused: {razao}")
                continue
            if not 200 <= r.http <= 299:
                raise ErroDaLoja(f"refused: {final} answered {r.http}")
            break
        if len(dados) < MINIMO and not pequeno:
            raise ErroDaLoja(f"refused: {final} answered 200 with only {resumo_da_copia(dados, r.tipo)}; "
                             f"nothing stored (give --pequeno if this really is the document)")
        if avisos is not None:
            avisos.append("stored: " + resumo_da_copia(dados, r.tipo))
        sha = hashlib.sha256(dados).hexdigest()
        destino = destino_confinado(raiz, sha)
        temporario.replace(destino)
    finally:
        temporario.unlink(missing_ok=True)
    lido = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if termos:
        campos = [("editor", '""'), ("termos_url", _toml_texto(final)), ("termos_sha256", _toml_texto(sha)),
                  ("lido_em", _toml_texto(lido)), ("guardar", '""'), ("excerto_max", "0"),
                  ("credito", '""'), ("duvidas", "[]")]
        return f"# direitos/{host_final}.toml\n" + "".join(f"{k} = {v}\n" for k, v in campos)
    campos = [
        ("id", '""'),
        ("titulo", '""'),
        ("editor", '""'),
        ("url", _toml_texto(url)),
        ("url_final", _toml_texto(final)),
        ("lido_em", _toml_texto(lido)),
        ("http", str(r.http)),
        ("tipo_conteudo", _toml_texto(r.tipo)),
        ("bytes", str(len(dados))),
        ("sha256", _toml_texto(sha)),
        ("publicado_em", '""'),
    ]
    return "[[fonte]]\n" + "".join(f"{k} = {v}\n" for k, v in campos)


def com_pagina(tabela: str, pagina: str, raiz: Path, direitos_de=None, transporte=transporte_curl,
               resolver=resolver_dns, avisos: list | None = None) -> str:
    """The source's table with `pagina` and `pagina_sha256` added: the publisher's own page
    for the document, fetched and stored by `buscar` under the same rules as a source
    (public host, robots.txt, a rights record for its host, a 2xx answer). `pagina` is the
    address the page was finally read at, so its host is the one whose record was checked."""
    import tomllib

    lida = tomllib.loads(buscar(pagina, raiz, direitos_de=direitos_de, transporte=transporte,
                                resolver=resolver, avisos=avisos))["fonte"][0]
    return tabela + f"pagina = {_toml_texto(lida['url_final'])}\npagina_sha256 = {_toml_texto(lida['sha256'])}\n"
