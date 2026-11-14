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
import json
import re
import shutil
import tomllib
from dataclasses import dataclass, field
from pathlib import Path

from . import conferir as conf
from . import direitos as rights
from . import julgados, privacidade
from .forma import erros_do_corpo
from .paginas import (
    Contexto,
    pagina_404,
    pagina_da_peca,
    pagina_das_correcoes,
    pagina_do_metodo,
    pagina_do_tema,
    pagina_inicial,
)
from .peca import ErroDeForma, ler, pecas_em

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


def contexto(repo: Path, raiz: Path, pecas: list, previa: bool = False) -> tuple[Contexto, list[str]]:
    textos = tomllib.loads((Path(repo) / "textos.toml").read_text(encoding="utf-8"))
    sitio = tomllib.loads((Path(repo) / "sitio.toml").read_text(encoding="utf-8"))
    mesas, erros = ler_mesas(raiz)
    metodo_f = Path(raiz) / "paginas" / "metodo.md"
    metodo, julgamento = None, []
    if metodo_f.is_file():
        try:
            metodo, registo_m, impressao_m = julgados.metodo(metodo_f)
        except julgados.ErroDoJulgado as e:
            erros.append(f"paginas/metodo.md: {e}")
        else:
            erros += [f"paginas/metodo.md: {x}" for x in erros_do_corpo(metodo + "\n## A leitura deste projeto\n## A objeção mais forte\n## O que seguir\n")]
            julgamento += julgados.erros_de_julgamento("paginas/metodo.md", registo_m, impressao_m)
    try:
        registo_t, impressao_t, _ = julgados.textos(repo, raiz)
        julgamento += julgados.erros_de_julgamento("textos.toml", registo_t, impressao_t)
    except julgados.ErroDoJulgado as e:
        erros.append(str(e))
    registos, erros_dos_direitos = rights.ler_pasta(Path(raiz) / "direitos")
    erros += erros_dos_direitos
    ctx = Contexto(textos=textos, mesas=mesas, lancamento=bool(sitio.get("lancamento")), pecas=pecas,
                   metodo=metodo, previa=previa, direitos=registos, julgamento=julgamento)
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


def ligacoes_partidas(estatica: Path) -> list[str]:
    erros = []
    ids = {}
    paginas = sorted(estatica.rglob("*.html"))
    for p in paginas:
        ids[p] = set(_ID.findall(p.read_text(encoding="utf-8")))
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
            elif ancora and alvo.suffix == ".html" and ancora not in ids.get(alvo, set()):
                erros.append(f"{nome}: the anchor #{ancora} of {href} is not on that page")
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


def manifesto(estatica: Path) -> dict:
    ficheiros = {}
    for f in sorted(estatica.rglob("*")):
        if f.is_file() and f.name != "manifesto.json":
            ficheiros[f.relative_to(estatica).as_posix()] = hashlib.sha256(f.read_bytes()).hexdigest()
    return {"ficheiros": ficheiros}


# --------------------------------------------------------------------------- build


def _escrever(estatica: Path, relativo: str, texto: str | bytes):
    destino = estatica / relativo
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(texto if isinstance(texto, bytes) else texto.encode("utf-8"))


def construir(repo: Path, raiz: Path | None = None, saida: Path | None = None, com_rascunhos: bool = False,
              loja: Path | None = None, conferir_antes: bool = True) -> Construcao:
    repo = Path(repo).resolve()
    raiz = Path(raiz or repo).resolve()
    saida = Path(saida or (repo / (".previa" if com_rascunhos else ".vercel/output"))).resolve()
    c = Construcao()
    if saida in (repo, raiz, Path.home(), Path("/")) or repo.is_relative_to(saida):
        c.falha(f"refused: {saida} would hold the repository; give an output folder of its own")
        return c

    pecas = []
    for caminho in pecas_em(raiz):
        try:
            pecas.append(ler(caminho))
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
            for r in conf.conferir_peca(p.caminho, ctx, loja):
                c.resultados.append(r)
                if r.estado == conf.FALHOU:
                    c.falha(r.linha())
    if not com_rascunhos and any(p.publicada for p in incluidas):
        for x in ctx.julgamento:
            c.falha(f"check  4 (the published text is the judged text) · reader's text outside pieces: {x}")
    if not c.ok:
        c.mensagens.insert(0, "the build stops: a piece it would include fails a check")
        return c

    estatica = saida / "static"
    if estatica.exists():
        shutil.rmtree(estatica)
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
    construidos = [(f.relative_to(estatica).as_posix(), f.read_bytes()) for f in sorted(estatica.rglob("*")) if f.is_file()]
    p8 = privacidade.conferir(construidos)
    for x in p8.razoes:
        c.falha(f"check 8: built file {x}")
    _escrever(estatica, "manifesto.json", json.dumps(manifesto(estatica), indent=1, sort_keys=True) + "\n")
    (saida / "config.json").write_text(json.dumps(configuracao(repo, ctx.lancamento), indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    if c.ok:
        onde = estatica.relative_to(repo).as_posix() if estatica.is_relative_to(repo) else estatica.name
        c.mensagens.append(f"built {sum(1 for f in estatica.rglob('*') if f.is_file())} files into {onde}")
    return c
