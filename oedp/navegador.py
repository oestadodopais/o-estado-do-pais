"""The pages in real browsers: `navegador` (a link to a receipt opens it) and `capturas`
(screenshots for the designer).

Both need Playwright for Python and its browsers (`requirements-navegador.txt`); the
checks and `tudo` never import it. The pages are served from a folder on this machine
by a server bound to 127.0.0.1 for the length of the run; nothing is fetched from the
network.

`navegador` builds the test piece's pages and, in each engine, at 390 pixels wide:
1. clicks the first printed figure of the text and requires its receipt to be open,
   with its summary and its excerpt inside the window;
2. follows that receipt's link back to the text and requires the figure in the window;
3. opens a computed figure's receipt, clicks the first input of its calculation, and
   requires that input's receipt, closed before the click, to be open after it;
4. opens the page directly at a receipt's address and requires that receipt open;
5. on a second build of the test piece whose text no longer prints one input of its
   calculation (`ensaio.construir_ensaio_so_entrada`), requires that input's receipt to
   come after every receipt of a line the text uses, and a click on that input in the
   arithmetic to open it (ORDEM esq3, item C: a line that is only an input).
An engine that is not installed is "not run here", never "passed"; one named by
`--exigir` that is not installed is a failure.
"""
from __future__ import annotations

import contextlib
import functools
import http.server
import tempfile
import threading
from pathlib import Path

from . import ensaio

MOTORES = ("chromium", "firefox", "webkit")
LARGURA, ALTURA = 390, 844
ESPERA_MS = 5000


class SemPlaywright(Exception):
    pass


def playwright():
    """The sync API of Playwright, or SemPlaywright with the reason."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as e:
        raise SemPlaywright(f"Playwright for Python is not installed here ({e}); "
                            "install requirements-navegador.txt and its browsers") from None
    return sync_playwright


class _Silencioso(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@contextlib.contextmanager
def servir(estatica: Path):
    """Serve a built folder at http://127.0.0.1:<port>/ for the length of the block."""
    manipulador = functools.partial(_Silencioso, directory=str(estatica))
    servidor = http.server.ThreadingHTTPServer(("127.0.0.1", 0), manipulador)
    fio = threading.Thread(target=servidor.serve_forever, daemon=True)
    fio.start()
    try:
        yield f"http://127.0.0.1:{servidor.server_address[1]}"
    finally:
        servidor.shutdown()
        servidor.server_close()


# Run in the page: whether the receipt holding the anchor `#<id>` is open, and where its
# summary, its excerpt and a given element sit against the window.
_ESTADO = """([ancora]) => {
  const a = document.getElementById(ancora);
  if (!a) return {existe: false};
  const d = a.closest('details');
  const caixa = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
    return {cima: r.top, baixo: r.bottom, altura: r.height}; };
  return {existe: true, aberto: !!(d && d.open), janela: window.innerHeight,
          resumo: caixa(d && d.querySelector(':scope > summary')),
          excerto: caixa(d && (d.querySelector('blockquote.excerto') || d.querySelector('dd.conta')))};
}"""


_NA_JANELA = """([seletor]) => { const el = document.querySelector(seletor); if (!el) return false;
  const r = el.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight; }"""


def _visivel(caixa, janela) -> bool:
    return bool(caixa) and caixa["altura"] > 0 and caixa["cima"] >= 0 and caixa["baixo"] <= janela


def recibo_a_vista(estado: dict) -> bool:
    """Proof 1's condition, decided here and not in the page: the receipt exists and is open,
    and its summary AND its excerpt (a computed figure's: its calculation) are both wholly
    inside the window. `estado` is what `_ESTADO` returns from the page."""
    return bool(estado.get("existe") and estado.get("aberto")
                and _visivel(estado.get("resumo"), estado.get("janela", 0))
                and _visivel(estado.get("excerto"), estado.get("janela", 0)))


def _ate_estar_a_vista(pagina, ancora: str) -> dict:
    """Read the receipt's state until it is in view or ESPERA_MS pass; the last state read."""
    limite = ESPERA_MS
    while True:
        estado = pagina.evaluate(_ESTADO, [ancora])
        if recibo_a_vista(estado) or limite <= 0:
            return estado
        pagina.wait_for_timeout(100)
        limite -= 100


def _esperar(pagina, funcao, args) -> bool:
    try:
        pagina.wait_for_function(f"(a) => ({funcao})(a)", arg=args, timeout=ESPERA_MS)
        return True
    except Exception:  # Playwright's TimeoutError: the condition never held
        return False


def _aberto(pagina, ancora: str) -> bool:
    return _esperar(pagina, "([x]) => { const a = document.getElementById(x); const d = a && a.closest('details'); "
                            "return !!(d && d.open); }", [ancora])


def provas(pagina, base: str, peca_id: str) -> list[str]:
    """The four proofs on one engine's page; the reasons each failed, empty when all held."""
    falhas = []
    endereco = f"{base}/pecas/{peca_id}/"

    # 1. The first printed figure of the text: an `a.ref` whose receipt shows a figure.
    pagina.goto(endereco)
    figuras = pagina.eval_on_selector_all(
        ".texto a.ref", "els => els.map(a => [a.getAttribute('href'), a.id])")
    figura = None
    for href, proprio in figuras:
        ancora = (href or "").lstrip("#")
        if pagina.evaluate("([x]) => { const a = document.getElementById(x); const d = a && a.closest('details'); "
                           "return !!(d && d.querySelector(':scope > summary .figura')); }", [ancora]):
            figura = (href, ancora, proprio)
            break
    if figura is None:
        return ["the text has no printed figure whose receipt shows a figure"]
    href, ancora, proprio = figura
    pagina.click(f'.texto a.ref[href="{href}"] >> nth=0')
    aberto = _aberto(pagina, ancora)
    if not aberto:
        falhas.append(f"1. a click on the figure {href} left its receipt closed")
    elif not recibo_a_vista(estado := _ate_estar_a_vista(pagina, ancora)):
        if not _visivel(estado["resumo"], estado["janela"]):
            falhas.append(f"1. after a click on {href} the receipt is open but its summary is not in the window ({estado['resumo']})")
        if not _visivel(estado["excerto"], estado["janela"]):
            falhas.append(f"1. after a click on {href} the receipt is open but its excerpt is not in the window ({estado['excerto']})")

    # 2. Back to the text from that receipt.
    voltar = pagina.evaluate_handle("([x]) => { const a = document.getElementById(x); const d = a && a.closest('details'); "
                                    "return d ? d.querySelector('p.voltar a') : null; }", [ancora]).as_element()
    if not aberto:
        falhas.append(f"2. not tried: the receipt of {href} did not open, so its link back cannot be clicked")
    elif voltar is None:
        falhas.append(f"2. the receipt of {href} has no link back to the text")
    else:
        volta = voltar.get_attribute("href")
        voltar.click()
        alvo = f"#{proprio}" if proprio else f'.texto a.ref[href="{href}"]'
        if not _esperar(pagina, _NA_JANELA, [alvo]):
            falhas.append(f"2. after following {volta} the figure {href} is not in the window")

    # 3. In a computed figure's receipt, an input of the calculation.
    pagina.goto(endereco)
    entradas = pagina.eval_on_selector_all("dd.conta a", "els => els.map(a => a.getAttribute('href'))")
    if not entradas:
        falhas.append("3. no computed figure's receipt has an input to click")
    else:
        entrada = entradas[0].lstrip("#")
        conta = pagina.query_selector("details:has(dd.conta a)")
        conta.evaluate("d => { d.open = true; }")
        if pagina.evaluate("([x]) => { const a = document.getElementById(x); const d = a && a.closest('details'); "
                           "return !!(d && d.open); }", [entrada]):
            falhas.append(f"3. the receipt of the input #{entrada} was open before the click, so the click proves nothing")
        else:
            pagina.click(f'dd.conta a[href="#{entrada}"] >> nth=0')
            if not _aberto(pagina, entrada):
                falhas.append(f"3. a click on the input #{entrada} of a calculation left its receipt closed")

    # 4. The page opened directly at a receipt's address.
    pagina.goto("about:blank")
    pagina.goto(f"{endereco}#{ancora}")
    if not _aberto(pagina, ancora):
        falhas.append(f"4. the page opened at #{ancora} left that receipt closed")
    return falhas


def prova_so_entrada(pagina, base: str, peca_id: str) -> list[str]:
    """Proof 5, on the page whose text does not print `indice_anterior`."""
    pagina.goto(f"{base}/pecas/{peca_id}/")
    ordem = pagina.eval_on_selector_all("details.recibo > .ancora", "els => els.map(a => a.id)")
    usadas = set(pagina.eval_on_selector_all(".texto a.ref, .texto a.ligada, h1 a, .entrada a",
                                             "els => els.map(a => a.getAttribute('href').slice(1))"))
    entrada = "r-indice_anterior"
    falhas = []
    if entrada in usadas:
        return ["5. the text of the second page still prints or ties indice_anterior"]
    if entrada not in ordem or any(i in usadas for i in ordem[ordem.index(entrada):]):
        falhas.append(f"5. the receipt of the input-only line is not after every receipt of a line the text uses ({ordem})")
    conta = pagina.query_selector("details:has(dd.conta a[href='#r-indice_anterior'])")
    if conta is None:
        return falhas + ["5. no calculation's receipt has the input-only line as an input"]
    conta.evaluate("d => { d.open = true; }")
    if pagina.evaluate("([x]) => document.getElementById(x).closest('details').open", [entrada]):
        return falhas + ["5. the input-only line's receipt was open before the click, so the click proves nothing"]
    pagina.click("dd.conta a[href='#r-indice_anterior'] >> nth=0")
    if not _aberto(pagina, entrada):
        falhas.append("5. a click on the input-only line in the arithmetic left its receipt closed")
    return falhas


def correr(exigir: list[str], imprimir=print, pasta: Path | None = None) -> int:
    """Run the four proofs in each engine; 0 only when every engine that ran passed and
    every engine named in `exigir` ran."""
    desconhecidos = [m for m in exigir if m not in MOTORES]
    if desconhecidos:
        imprimir(f"navegador: refused: {', '.join(desconhecidos)} is not one of {', '.join(MOTORES)}")
        return 2
    try:
        sync_playwright = playwright()
    except SemPlaywright as e:
        if exigir:
            imprimir(f"navegador: failed: {e}; required here: {', '.join(exigir)}")
            return 1
        imprimir(f"navegador: not run here: {e}")
        return 0
    with tempfile.TemporaryDirectory(prefix="oedp-navegador-") as tmp:
        c = ensaio.construir_ensaio(Path(pasta or tmp), conferir_antes=False)
        c5 = ensaio.construir_ensaio_so_entrada(Path(pasta or tmp) / "so-entrada")
        if not c.ok or not c5.ok:
            imprimir("navegador: failed: the test piece's pages do not build: " + " | ".join(c.mensagens + c5.mensagens))
            return 1
        falhou = False
        with servir(c.estatica) as base, servir(c5.estatica) as base5, sync_playwright() as p:
            for nome in MOTORES:
                motor = getattr(p, nome)
                if not Path(motor.executable_path).exists():
                    if nome in exigir:
                        imprimir(f"navegador · {nome}: failed: required, and not installed here ({motor.executable_path} is missing)")
                        falhou = True
                    else:
                        imprimir(f"navegador · {nome}: not run here: not installed")
                    continue
                navegador = motor.launch()
                try:
                    pagina = navegador.new_page(viewport={"width": LARGURA, "height": ALTURA})
                    pagina.set_default_timeout(10000)
                    falhas = provas(pagina, base, ensaio.PECA_ID) + prova_so_entrada(pagina, base5, ensaio.PECA_ID)
                finally:
                    versao = navegador.version
                    navegador.close()
                if falhas:
                    falhou = True
                    imprimir(f"navegador · {nome} {versao} at {LARGURA} px: failed: " + " | ".join(falhas))
                else:
                    imprimir(f"navegador · {nome} {versao} at {LARGURA} px: passed (figure, back to the text, input of a calculation, "
                             "direct address, input-only line)")
    return 1 if falhou else 0


# --------------------------------------------------------------------------- screenshots (E3)

LARGURAS = (390, 1280)
ESQUEMAS = ("light", "dark")


def paginas_construidas(estatica: Path) -> list[str]:
    """One public address per page type that was built: front, a piece, a thread, Method,
    Corrections, 404."""
    enderecos = []
    if (estatica / "index.html").is_file():
        enderecos.append("/")
    for tipo in ("pecas", "temas"):
        pasta = estatica / tipo
        primeira = sorted(pasta.glob("*/index.html"))[:1] if pasta.is_dir() else []
        enderecos += [f"/{tipo}/{f.parent.name}/" for f in primeira]
    for nome in ("metodo", "correcoes"):
        if (estatica / nome / "index.html").is_file():
            enderecos.append(f"/{nome}/")
    if (estatica / "404.html").is_file():
        enderecos.append("/404.html")
    return enderecos


def _nome_do_ficheiro(endereco: str, largura: int, esquema: str) -> str:
    base = endereco.strip("/").replace("/", "-").replace(".html", "") or "inicio"
    return f"{base}-{largura}-{esquema}.png"


def capturar(estatica: Path, destino: Path, enderecos: list[str], abrir_tudo: bool = False) -> list[Path]:
    """Full-page screenshots, with Chromium, of each address at each width and scheme.
    With `abrir_tudo`, every <details> (the receipts and the record) is opened first."""
    sync_playwright = playwright()
    destino = Path(destino)
    destino.mkdir(parents=True, exist_ok=True)
    feitas = []
    with servir(estatica) as base, sync_playwright() as p:
        if not Path(p.chromium.executable_path).exists():
            raise SemPlaywright(f"Chromium is not installed here ({p.chromium.executable_path} is missing)")
        navegador = p.chromium.launch()
        try:
            for largura in LARGURAS:
                for esquema in ESQUEMAS:
                    contexto = navegador.new_context(viewport={"width": largura, "height": 900}, color_scheme=esquema)
                    pagina = contexto.new_page()
                    for endereco in enderecos:
                        pagina.goto(base + endereco)
                        if abrir_tudo:
                            pagina.evaluate("() => document.querySelectorAll('details').forEach(d => { d.open = true; })")
                        f = destino / _nome_do_ficheiro(endereco, largura, esquema)
                        pagina.screenshot(path=str(f), full_page=True)
                        feitas.append(f)
                    contexto.close()
        finally:
            navegador.close()
    return feitas
