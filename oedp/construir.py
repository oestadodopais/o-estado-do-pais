"""Build the pages into Vercel's prebuilt format, and prove every internal link resolves.

Output: `<saida>/static/` (the pages, the assets and `manifesto.json`) and
`<saida>/config.json` (version 3: the security headers and the three host
redirects of `vercel.json`, the robots header unless `sitio.toml` sets
`lancamento`, the file system, and the 404 page).

With no published piece, `index.html` and `404.html` are the holding page,
`oedp/espera.html`, byte for byte, and nothing else is built but the manifest.
"""
from __future__ import annotations

import hashlib
import html.parser
import json
import os
import re
import shutil
import tomllib
from dataclasses import dataclass, field
from pathlib import Path

from . import conferir as conf
from . import direitos as rights
from . import codigo, julgados, privacidade
from .forma import FECHO, erros_do_corpo
from .paginas import (
    Contexto,
    pagina_404,
    pagina_da_peca,
    pagina_das_correcoes,
    pagina_do_metodo,
    pagina_do_tema,
    pagina_inicial,
)
from .peca import ErroDeForma, ler, ler_bytes, pecas_em

PACOTE = Path(__file__).resolve().parent
ESPERA = PACOTE / "espera.html"
ACTIVOS = ("estilo.css", "favicon.ico", "favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png",
           "icon-512-maskable.png", "manifest.webmanifest", "tipos")


@dataclass
class Construcao:
    ok: bool = True
    mensagens: list[str] = field(default_factory=list)
    resultados: list = field(default_factory=list)
    estatica: Path | None = None

    def falha(self, texto: str):
        self.ok = False
        self.mensagens.append(texto)


def ler_mesas(raiz: Path) -> tuple[dict, list[str]]:
    mesas, erros = {}, []
    pasta = Path(raiz) / "mesas"
    for f in sorted(pasta.glob("*.md")) if pasta.is_dir() else []:
        primeira = f.read_text(encoding="utf-8").split("\n", 1)[0]
        if not primeira.startswith("# ") or not primeira[2:].strip():
            erros.append(f"mesas/{f.name}: the first line must be '# <the thread's name>'")
            continue
        mesas[f.stem] = primeira[2:].strip()
    return mesas, erros


PASTAS_SEM_LIGACOES = ("pecas", "mesas", "paginas", "direitos")


def ligacoes_simbolicas(raiz: Path) -> list[str]:
    """Nothing under pecas/, mesas/, paginas/ or direitos/ may be a symbolic link."""
    erros = []
    for sub in PASTAS_SEM_LIGACOES:
        pasta = Path(raiz) / sub
        if pasta.is_symlink():
            erros.append(f"{sub}/ is a symbolic link")
            continue
        for topo, dirs, ficheiros in os.walk(pasta) if pasta.is_dir() else []:
            for nome in dirs + ficheiros:
                p = Path(topo) / nome
                if p.is_symlink():
                    erros.append(f"{p.relative_to(raiz).as_posix()} is a symbolic link; nothing under {sub}/ may be one")
    return erros


def contexto(repo: Path, raiz: Path, pecas: list, previa: bool = False) -> tuple[Contexto, list[str]]:
    textos = tomllib.loads((Path(repo) / "textos.toml").read_text(encoding="utf-8"))
    sitio = tomllib.loads((Path(repo) / "sitio.toml").read_text(encoding="utf-8"))
    mesas, erros = ler_mesas(raiz)
    erros += ligacoes_simbolicas(raiz)
    metodo_f = Path(raiz) / "paginas" / "metodo.md"
    metodo, julgamento, leituras_fora = None, [], []
    if metodo_f.is_file():
        try:
            metodo, registo_m, impressao_m = julgados.metodo(metodo_f)
        except julgados.ErroDoJulgado as e:
            erros.append(f"paginas/metodo.md: {e}")
        else:
            erros += [f"paginas/metodo.md: {x}" for x in erros_do_corpo(metodo + "".join(f"\n## {t}" for t in FECHO) + "\n")]
            julgamento += julgados.erros_de_julgamento("paginas/metodo.md", registo_m, impressao_m)
            leituras_fora += registo_m.get("leitura", [])
            erros += julgados.erros_do_registo("paginas/metodo.md", registo_m)
            julgamento += julgados.historia(repo, metodo_f)
    try:
        registo_t, impressao_t, onde_t = julgados.textos(repo, raiz)
        julgamento += julgados.erros_de_julgamento("textos.toml", registo_t, impressao_t)
        erros += julgados.erros_do_registo("textos.registo.toml", registo_t)
        leituras_fora += registo_t.get("leitura", [])
        if onde_t:
            julgamento += julgados.historia(repo, Path(onde_t))
    except julgados.ErroDoJulgado as e:
        erros.append(str(e))
    portao_do_codigo = []
    try:
        tabelas_c, onde_c = codigo.ler(repo, raiz)
    except codigo.ErroDoCodigo as e:  # the record cannot be read: check 9, and the gate stays closed
        erros.append(str(e))
        portao_do_codigo.append(f"code: {e}")
    else:
        erros += codigo.erros_do_registo(tabelas_c)
        leituras_fora += [t for nome, t in tabelas_c if nome == "leitura"]
        try:
            portao_do_codigo += codigo.erros_do_portao(tabelas_c, codigo.impressao(repo))
        except codigo.ErroDoCodigo as e:  # no fingerprint (git cannot list the files): the gate stays closed
            portao_do_codigo.append(f"code: {e}")
        if onde_c:
            portao_do_codigo += codigo.historia(repo, Path(onde_c))
    registos, erros_dos_direitos = rights.ler_pasta(Path(raiz) / "direitos")
    erros += erros_dos_direitos
    ctx = Contexto(textos=textos, mesas=mesas, lancamento=bool(sitio.get("lancamento")), pecas=pecas,
                   metodo=metodo, previa=previa, direitos=registos, julgamento=julgamento,
                   codigo=portao_do_codigo, leituras_fora=leituras_fora)
    return ctx, erros


# --------------------------------------------------------------------------- links (check 9)

_HREF = re.compile(r'\b(?:href|src)="([^"]*)"')
_ID = re.compile(r'\bid="([^"]+)"')
_URL_CSS = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")


def _alvo(estatica: Path, caminho: str) -> Path | None:
    caminho = caminho.split("?", 1)[0]
    if caminho.endswith("/"):
        caminho += "index.html"
    destino = estatica / caminho.lstrip("/")
    return destino if destino.is_file() else None


class _Caixas(html.parser.HTMLParser):
    """The ids that a link must not lead to: a <details>, a <summary>, or anything inside
    a <summary>. A browser opens a closed <details> when the place a link sends it to is
    inside the box's content, and leaves it closed when it is the box or its summary."""

    VAZIOS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha: list[str] = []
        self.fechadas: set[str] = set()

    def handle_starttag(self, tag, attrs):
        ident = dict(attrs).get("id")
        if ident and (tag in ("details", "summary") or "summary" in self.pilha):
            self.fechadas.add(ident)
        if tag not in self.VAZIOS:
            self.pilha.append(tag)

    def handle_endtag(self, tag):
        if tag in self.pilha:
            while self.pilha and self.pilha.pop() != tag:
                pass


def ancoras_fechadas(texto_html: str) -> set[str]:
    p = _Caixas()
    p.feed(texto_html)
    p.close()
    return p.fechadas


def ligacoes_partidas(estatica: Path) -> list[str]:
    erros = []
    ids, fechadas = {}, {}
    paginas = sorted(estatica.rglob("*.html"))
    for p in paginas:
        texto = p.read_text(encoding="utf-8")
        ids[p] = set(_ID.findall(texto))
        fechadas[p] = ancoras_fechadas(texto)
    for p in paginas:
        nome = p.relative_to(estatica).as_posix()
        for href in _HREF.findall(p.read_text(encoding="utf-8")):
            href = href.replace("&amp;", "&")
            if re.match(r"[a-z]+:", href):
                continue
            caminho, _, ancora = href.partition("#")
            if not caminho:
                alvo = p
            elif caminho.startswith("/"):
                alvo = _alvo(estatica, caminho)
            else:
                alvo = _alvo(estatica, (p.parent.relative_to(estatica) / caminho).as_posix())
            if alvo is None:
                erros.append(f"{nome}: the link {href} leads to no built file")
            elif alvo == p and not ancora:
                erros.append(f"{nome}: the link {href} leads to the page itself; a page does not link to itself")
            elif ancora and alvo.suffix == ".html" and ancora not in ids.get(alvo, set()):
                erros.append(f"{nome}: the anchor #{ancora} of {href} is not on that page")
            elif ancora and ancora in fechadas.get(alvo, set()):
                erros.append(f"{nome}: the link {href} leads to a <details>, a <summary> or inside a <summary>; "
                             "a browser leaves a closed box closed unless the anchor is inside its content")
        for tabela in re.findall(r'<div class="tabela">.*?</div>', p.read_text(encoding="utf-8"), re.S):
            if re.search(r"<td(?![^>]*\bdata-rotulo=)", tabela):
                erros.append(f"{nome}: a value of a table carries no data-rotulo, so on a phone it would sit under no label")
    for css in sorted(estatica.rglob("*.css")):
        for url in _URL_CSS.findall(css.read_text(encoding="utf-8")):
            if url.startswith("data:"):
                continue
            if _alvo(estatica, url.replace("%5B", "[").replace("%5D", "]")) is None:
                erros.append(f"{css.relative_to(estatica).as_posix()}: url({url}) leads to no built file")
    return erros


# --------------------------------------------------------------------------- the hosting configuration


def configuracao(repo: Path, lancamento: bool) -> dict:
    vercel = json.loads((Path(repo) / "vercel.json").read_text(encoding="utf-8"))
    rotas = list(vercel.get("routes", []))
    if not lancamento:
        rotas.insert(1, {"src": "/(.*)", "headers": {"X-Robots-Tag": "noindex, nofollow"}, "continue": True})
    rotas += [{"handle": "filesystem"}, {"src": "/(.*)", "status": 404, "dest": "/404.html"}]
    return {"version": 3, "routes": rotas}


def manifesto_confere(estatica: Path) -> list[str]:
    """The manifest lists every file of the output folder, with its SHA-256, and nothing else."""
    f = Path(estatica) / "manifesto.json"
    try:
        escrito = json.loads(f.read_text(encoding="utf-8"))["ficheiros"]
    except (OSError, ValueError, KeyError) as e:
        return [f"manifesto.json cannot be read ({e})"]
    real = manifesto(estatica)["ficheiros"]
    erros = [f"manifesto.json does not list {n}, which is in the output folder" for n in sorted(set(real) - set(escrito))]
    erros += [f"manifesto.json lists {n}, which is not in the output folder" for n in sorted(set(escrito) - set(real))]
    erros += [f"manifesto.json gives {n} a SHA-256 that is not its own" for n in sorted(set(real) & set(escrito)) if real[n] != escrito[n]]
    return erros


def manifesto(estatica: Path) -> dict:
    ficheiros = {}
    for f in sorted(estatica.rglob("*")):
        # Only the manifest at the root is left out; a file of that name deeper is listed like any other.
        if f.is_file() and f.relative_to(estatica).as_posix() != "manifesto.json":
            ficheiros[f.relative_to(estatica).as_posix()] = hashlib.sha256(f.read_bytes()).hexdigest()
    return {"ficheiros": ficheiros}


# --------------------------------------------------------------------------- build


def _escrever(estatica: Path, relativo: str, texto: str | bytes):
    destino = estatica / relativo
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(texto if isinstance(texto, bytes) else texto.encode("utf-8"))


def construir(repo: Path, raiz: Path | None = None, saida: Path | None = None, com_rascunhos: bool = False,
              loja: Path | None = None, conferir_antes: bool = True, como_seria: dict | None = None) -> Construcao:
    """`como_seria` maps a piece file to the bytes it would have (its path resolved): the
    build reads those instead of the file, so that `estado … publicada` can learn whether
    the site would build before it appends a table that can never be taken back."""
    repo = Path(repo).resolve()
    raiz = Path(raiz or repo).resolve()
    c = Construcao()
    dada = Path(saida or (repo / (".previa" if com_rascunhos else ".vercel/output")))
    if dada.is_symlink():  # before resolving: resolved, the link would be its target, and the target emptied
        c.falha(f"refused: {dada} is a symbolic link; give an output folder of its own")
        return c
    saida = dada.resolve()
    if saida in (repo, raiz, Path.home(), Path("/")) or repo.is_relative_to(saida):
        c.falha(f"refused: {saida} would hold the repository; give an output folder of its own")
        return c

    pecas = []
    como_seria = {Path(k).resolve(): v for k, v in (como_seria or {}).items()}
    for caminho in pecas_em(raiz):
        try:
            novo = como_seria.get(Path(caminho).resolve())
            pecas.append(ler(caminho) if novo is None else ler_bytes(novo, caminho))
        except (ErroDeForma, OSError) as e:
            c.falha(f"check 9: {caminho.relative_to(raiz)}: {e}")
    if not c.ok:
        return c
    incluidas = [p for p in pecas if p.estado in ("publicada", "retirada") or (com_rascunhos and p.estado == "rascunho")]
    ctx, erros = contexto(repo, raiz, incluidas, previa=com_rascunhos)
    for x in erros:
        c.falha(f"check 9: {x}")

    if conferir_antes:
        for p in incluidas:
            for r in conf.conferir_peca(p.caminho, ctx, loja, bruto=como_seria.get(Path(p.caminho).resolve())):
                c.resultados.append(r)
                if r.estado == conf.FALHOU:
                    c.falha(r.linha())
    if not com_rascunhos and any(p.vinculada for p in incluidas):
        for x in ctx.julgamento:
            c.falha(f"check  4 (the published text is the judged text) · reader's text outside pieces: {x}")
        # No piece is built as published on code the other family has not read (codigo.py).
        for x in ctx.codigo:
            c.falha(f"check  5 (verified and judged by the other family) · {x}")
    if not c.ok:
        c.mensagens.insert(0, "the build stops: a piece it would include fails a check")
        return c

    estatica = saida / "static"
    # The whole output folder is emptied, not only static/: whatever an earlier build or a
    # hand left there (functions/, another config) would otherwise be sent unchecked. Only a
    # build is emptied: a folder that does not exist, is empty, or holds an earlier build,
    # told by its static/manifesto.json. Any other folder is refused, untouched.
    if saida.exists() and (not saida.is_dir() or (any(saida.iterdir()) and not (saida / "static" / "manifesto.json").is_file())):
        c.falha(f"refused: {saida} is not empty and holds no earlier build (no static/manifesto.json); "
                "give an output folder of its own")
        return c
    if saida.exists():
        for f in saida.iterdir():
            shutil.rmtree(f) if f.is_dir() and not f.is_symlink() else f.unlink()
    estatica.mkdir(parents=True)
    c.estatica = estatica
    listadas = [p for p in incluidas if p.publicada or com_rascunhos]

    if not listadas and not [p for p in incluidas if p.estado == "retirada"]:
        espera = ESPERA.read_bytes()
        _escrever(estatica, "index.html", espera)
        _escrever(estatica, "404.html", espera)
    else:
        _escrever(estatica, "index.html", pagina_inicial(ctx) if listadas else ESPERA.read_bytes())
        _escrever(estatica, "404.html", pagina_404(ctx) if listadas else ESPERA.read_bytes())
        for p in incluidas:
            _escrever(estatica, f"pecas/{p.id}/index.html", pagina_da_peca(p, ctx))
        for tema in ctx.mesas:
            if ctx.tema_existe(tema):
                _escrever(estatica, f"temas/{tema}/index.html", pagina_do_tema(ctx, tema))
        if ctx.metodo is not None:
            _escrever(estatica, "metodo/index.html", pagina_do_metodo(ctx))
        _escrever(estatica, "correcoes/index.html", pagina_das_correcoes(ctx))
        publico = repo / "public"
        for nome in ACTIVOS:
            origem = publico / nome
            # No symbolic link is followed: a link under public/ could publish whatever it points to.
            ligacoes = [origem] if origem.is_symlink() else [p for p in origem.rglob("*") if p.is_symlink()] if origem.is_dir() else []
            if ligacoes:
                for p in ligacoes:
                    c.falha(f"check 9: {p.relative_to(repo).as_posix()} is a symbolic link, and the build does not follow links")
                continue
            if origem.is_dir():
                shutil.copytree(origem, estatica / nome, symlinks=True)
            elif origem.is_file():
                shutil.copy2(origem, estatica / nome, follow_symlinks=False)
            else:
                c.falha(f"check 9: public/{nome} is missing")

    for x in ligacoes_partidas(estatica):
        c.falha(f"check 9: {x}")
    (saida / "config.json").write_text(json.dumps(configuracao(repo, ctx.lancamento), indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    construidos = [(f.relative_to(estatica).as_posix(), f.read_bytes()) for f in sorted(estatica.rglob("*")) if f.is_file()]
    # The hosting configuration is sent with the pages, so check 8 reads it too.
    p8 = privacidade.conferir(construidos + [("config.json", (saida / "config.json").read_bytes())])
    for x in p8.razoes:
        c.falha(f"check 8: built file {x}")
    _escrever(estatica, "manifesto.json", json.dumps(manifesto(estatica), indent=1, sort_keys=True) + "\n")
    for x in manifesto_confere(estatica):
        c.falha(f"check 9: {x}")
    if c.ok:
        onde = estatica.relative_to(repo).as_posix() if estatica.is_relative_to(repo) else estatica.name
        c.mensagens.append(f"built {sum(1 for f in estatica.rglob('*') if f.is_file())} files into {onde}")
    return c
