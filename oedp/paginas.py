"""The five pages of docs/ESPEC-PAGINAS.md, as plain templates.

Every fixed sentence comes from textos.toml through `Contexto.t`; nothing a reader
sees is written here. Everything else on a page comes from the piece files, the
desk files (`mesas/<tema>.md`, whose first line `# <name>` names the thread) and
`paginas/metodo.md`.
"""
from __future__ import annotations

import datetime as dt
import html
import re
from dataclasses import dataclass, field
from decimal import ROUND_HALF_UP, Decimal

import markdown

from . import datas, derivacoes, fontes, numeros
from .forma import FECHO
from .peca import Peca, ordem_de_uso, referencias, seccao_do_corpo

e = html.escape


@dataclass
class Contexto:
    textos: dict
    mesas: dict = field(default_factory=dict)  # tema -> name
    lancamento: bool = False
    pecas: list = field(default_factory=list)  # the pieces in this build
    metodo: str | None = None  # the Markdown of paginas/metodo.md
    previa: bool = False  # a preview lists drafts too; it is never deployed
    direitos: dict = field(default_factory=dict)  # host -> rights record
    julgamento: list = field(default_factory=list)  # why the Method prose or the fixed sentences are not judged
    codigo: list = field(default_factory=list)  # why the code has not been read as the gate asks (codigo.py)
    leituras_fora: list = field(default_factory=list)  # the readings of the Method prose, the fixed sentences and the code
    reconferencias: list = field(default_factory=list)  # the [[reconferencia]] tables of reconferencias.toml
    ensaio: list = field(default_factory=list)  # records signed by the tests' model name where they do not count (marca.py)

    def listada(self, peca) -> bool:
        return peca.publicada or (self.previa and peca.estado == "rascunho")

    def t(self, chave: str, **campos) -> str:
        texto = self.textos[chave]
        for k, v in campos.items():
            texto = texto.replace("{" + k + "}", str(v))
        return texto

    def tema_existe(self, tema: str) -> bool:
        return tema in self.mesas and any(tema in p.cabeca.get("temas", []) for p in self.pecas if self.listada(p))


# --------------------------------------------------------------------------- times


def _instante(texto) -> dt.datetime | None:
    return datas.instante_real(str(texto or ""))


def publicada_em(peca: Peca) -> dt.datetime | None:
    """The first time the piece was published."""
    for est in peca.registo.get("estado", []):
        if est.get("estado") == "publicada":
            return _instante(est.get("em"))
    return None


def _minutos(inicio, fim) -> int | None:
    a, b = _instante(inicio), _instante(fim)
    if not a or not b or b < a:
        return None
    return int((Decimal((b - a).total_seconds()) / 60).quantize(Decimal(1), rounding=ROUND_HALF_UP))


# --------------------------------------------------------------------------- references in text

_MARCA = "zzoedpref{}zz"


# A hyphen that opens a mostra before its number is the sign of a negative figure.
_HIFEN_INICIAL = re.compile(r"\A(\s*)-(?=\s?\d)")


def mostra_impressa(linha: dict) -> str:
    """A line's mostra as the page prints it, wherever it prints it: a leading hyphen before
    the number becomes a true minus sign (U+2212). The piece file keeps what it has; a
    hyphen inside words is left alone (docs/ESPEC-PAGINAS.md, Figures, edit of 15 November
    2026, 14:27 UTC)."""
    return _HIFEN_INICIAL.sub("\\1\u2212", str(linha.get("mostra", "")))


def _impressa(peca: Peca, lid: str) -> str:
    """What `{id}` prints: the mostra, or the words of a citacao between «»."""
    linha = peca.linhas[lid]
    if linha.get("tipo") == "citacao":
        return "«" + str(linha.get("excerto", "")).strip() + "»"
    return mostra_impressa(linha)


def _ligacao(peca: Peca, lid: str, modo: str) -> str | None:
    if modo == "texto":
        return None
    if modo == "noutra":
        return f"/pecas/{peca.id}/#r-{lid}"
    return f"#r-{lid}"


NBSP = "\u00a0"
# A number (with its thousands groups and decimals) and the space after it.
_NUMERO_E_ESPACO = re.compile(r"(\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+)((?:[.,]\d+)*)(?:\.º|º|ª)?[ \u00a0\u202f](?=\S)")
# A range inside tied words, «de 1 a 4 trabalhadores»: the «a» between two numbers.
_INTERVALO = re.compile(r"(?<=\d)[ \u00a0\u202f]a[ \u00a0\u202f](?=\d)")
_ESPACO = re.compile(r"[ \u00a0\u202f]")


def _juntar(texto: str) -> str:
    return texto.replace(" ", NBSP).replace("\u202f", NBSP)


def sem_quebra(texto: str, linha_impressa: bool) -> str:
    """Where a line may not break (docs/ESPEC-PAGINAS.md, Figures, edit of 15 November 2026,
    13:09 UTC).

    A printed line (`linha_impressa`, a mostra) never breaks inside its number, nor between
    the number and a unit that is a symbol or one word («4,40 %», «58,8 ‰»); before a unit
    of two words or more («0,19» then «pontos percentuais») it may. This module's reading:
    a scale word the figure is read with («mil», «milhões», as `numeros.FIGURA` reads it)
    is part of the number, so «602,5 mil» stays whole and may break before «postos de
    trabalho». A mostra with no figure («um terço») is kept whole, as before.

    Inside tied words, a number stays with the word that follows it, and a range «N a M»
    stays whole."""
    if linha_impressa:
        m = numeros.FIGURA.search(texto)
        if m is None:
            return _juntar(texto)
        antes, figura, depois = texto[: m.start()], _juntar(m.group(0)), texto[m.end() :]
        unidade = depois.strip(" \u00a0\u202f")
        if depois[:1] and _ESPACO.match(depois[:1]) and unidade and not _ESPACO.search(unidade):
            depois = NBSP + unidade  # a symbol or one word goes with its number
        return antes + figura + depois
    texto = _NUMERO_E_ESPACO.sub(lambda m: _juntar(m.group(0)), texto)
    return _INTERVALO.sub(NBSP + "a" + NBSP, texto)


# In every field a receipt prints, «p.» stays with the number after it. Nothing else is glued:
# a space between two digits is a place to break like any other (docs/ESPEC-PAGINAS.md, edit of
# 15 November 2026, 14:27 UTC: glued, a table's row became one string that the browser cut
# inside its numbers). One character is replaced by one, so a place found in an excerpt (the
# mark, `_excerto`) is the same place after it.
_PAGINA = re.compile(r"(?<![^\W\d_])(p\.) (?=\d)")


def sem_quebra_na_fonte(texto: str) -> str:
    return _PAGINA.sub(r"\1" + NBSP, texto)


def _campo(texto) -> str:
    """A reader's field as a receipt prints it, escaped: «p.» kept with its number."""
    return e(sem_quebra_na_fonte(str(texto)))


# Two links to receipts with nothing, or only white space (or the empty anchor of a first
# use), between them: the second gets the class `encostada`, which the stylesheet sets
# apart by a gap (docs/ESPEC-PAGINAS.md, Links, edit of 15 November 2026, 13:09 UTC).
_LIGACAO_A_RECIBO = re.compile(r'<a class="(ref|ligada)"[^>]*>.*?</a>', re.S)
_SO_ESPACO = re.compile(r'(?:\s|<span id="u-[a-z0-9_]+"></span>)*')


def marcar_encostadas(fragmento: str) -> str:
    achadas = list(_LIGACAO_A_RECIBO.finditer(fragmento))
    marcar = [b.end(1) for a, b in zip(achadas, achadas[1:]) if _SO_ESPACO.fullmatch(fragmento, a.end(), b.start())]
    for pos in reversed(marcar):
        fragmento = fragmento[:pos] + " encostada" + fragmento[pos:]
    return fragmento


def _html_da_referencia(peca: Peca, r, modo: str, primeiros: set | None = None) -> str:
    simples = r.forma == "simples"
    texto = _impressa(peca, r.ids[0]) if simples else r.palavras
    numero = simples and peca.linhas[r.ids[0]].get("tipo") in ("valor", "derivado")
    texto = sem_quebra(texto, numero)
    destino = _ligacao(peca, r.ids[0], modo)
    classe = "ref" if simples else "ligada"
    if destino is None:
        return e(texto)
    # The first use of each line carries the anchor its receipt's `r_voltar` leads back to.
    ancoras = []
    if primeiros is not None:
        for lid in r.ids:
            if lid not in primeiros:
                primeiros.add(lid)
                ancoras.append(f"u-{lid}")
    proprio = f' id="{ancoras[0]}"' if ancoras and ancoras[0] == f"u-{r.ids[0]}" else ""
    extra = "".join(f'<span id="{a}"></span>' for a in ancoras if f' id="{a}"' != proprio)
    return f'{extra}<a class="{classe}" href="{e(destino)}"{proprio}>{e(texto)}</a>'


def em_linha(peca: Peca, texto: str, modo: str = "aqui", primeiros: set | None = None) -> str:
    """A one-line field (titulo, entrada) as HTML."""
    partes, pos = [], 0
    for r in referencias(texto):
        partes.append(e(texto[pos : r.inicio]))
        partes.append(_html_da_referencia(peca, r, modo, primeiros))
        pos = r.fim
    partes.append(e(texto[pos:]))
    return marcar_encostadas("".join(partes))


def texto_simples(peca: Peca, texto: str) -> str:
    """A field with its references printed, no markup (for <title>)."""
    partes, pos = [], 0
    for r in referencias(texto):
        partes.append(texto[pos : r.inicio])
        if r.forma == "simples":
            numero = peca.linhas[r.ids[0]].get("tipo") in ("valor", "derivado")
            partes.append(sem_quebra(_impressa(peca, r.ids[0]), numero))
        else:
            partes.append(sem_quebra(r.palavras, False))
        pos = r.fim
    partes.append(texto[pos:])
    return "".join(partes)


def markdown_com_referencias(peca: Peca | None, texto: str, modo: str = "aqui", primeiros: set | None = None) -> str:
    trocas = {}
    partes, pos = [], 0
    for n, r in enumerate(referencias(texto) if peca else []):
        marca = _MARCA.format("abcdefghijklmnopqrstuvwxy"[n % 25] * (n // 25 + 1))
        trocas[marca] = _html_da_referencia(peca, r, modo, primeiros)
        partes.append(texto[pos : r.inicio])
        partes.append(marca)
        pos = r.fim
    partes.append(texto[pos:])
    saida = markdown.markdown("".join(partes), extensions=["tables"], output_format="html")
    for marca, conteudo in trocas.items():
        saida = saida.replace(marca, conteudo)
    return marcar_encostadas(saida)


# --------------------------------------------------------------------------- the frame of every page


_LIGACAO = re.compile(r'<a ((?:[^>]*? )?)href="([^"#]*)"([^>]*)>(.*?)</a>', re.S)


def sem_ligacoes_a_si(html_da_pagina: str, aqui: str | None) -> str:
    """A page does not link to itself: a link to its own address (without an anchor)
    becomes plain text, marked as the current page."""
    if aqui is None:
        return html_da_pagina

    def troca(m):
        if m.group(2) != aqui:
            return m.group(0)
        return f'<span aria-current="page">{m.group(4)}</span>'

    return _LIGACAO.sub(troca, html_da_pagina)


def pagina(ctx: Contexto, titulo: str, corpo: str, *, inicio: bool = False, meta: str = "", aqui: str | None = None) -> str:
    """The frame of every page; `aqui` is the page's own public address."""
    # The AI line links to the Method page; on the Method page itself the link is not
    # printed at all, and the line ends at its full stop (docs/ESPEC-PAGINAS.md, edit of
    # 15 November 2026, 13:09 UTC).
    ia_ligacao = "" if aqui == "/metodo/" else f' <a href="/metodo/">{e(ctx.t("ia_ligacao"))}</a>'

    robots = "" if ctx.lancamento else '<meta name="robots" content="noindex, nofollow">\n'
    nome = e(ctx.t("nome"))
    # The name links to the front page on every other page, the one link not underlined;
    # on the front page it is not a link.
    marca = f'<h1 class="wordmark">{nome}</h1>' if inicio else f'<p class="wordmark"><a href="/">{nome}</a></p>'
    return sem_ligacoes_a_si(f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{robots}<title>{e(titulo)}</title>
<meta name="theme-color" content="#f6f7f4">
{meta}<link rel="stylesheet" href="/estilo.css">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
</head>
<body>
<a class="saltar" href="#conteudo">{e(ctx.t("saltar"))}</a>
<div class="wrap">
<header class="cabecalho">
<p class="rotulo-ia-linha">{e(ctx.t("ia_linha"))}{ia_ligacao}</p>
<div class="masthead">{marca}</div>
<nav class="menu">
<a href="/">{e(ctx.t("nav_inicio"))}</a>
<a href="/metodo/">{e(ctx.t("nav_metodo"))}</a>
<a href="/correcoes/">{e(ctx.t("nav_correcoes"))}</a>
</nav>
</header>
<main id="conteudo">
{corpo}
</main>
<footer class="rodape">
<p>{e(ctx.t("rodape"))}</p>
<p>{_com_endereco(ctx.t("rodape_contacto"))}</p>
</footer>
</div>
</body>
</html>
""", "/" if inicio else aqui)


_ENDERECO = "correcoes" + "@" + "oestadodopais.pt"


def _com_endereco(frase: str) -> str:
    """The sentence, escaped, with the corrections address made a mail link."""
    return e(frase).replace(_ENDERECO, f'<a href="mailto:{_ENDERECO}">{_ENDERECO}</a>')


def _tipo(ctx, peca) -> str:
    return ctx.t("tipo_" + str(peca.cabeca.get("tipo")))


def _ligacoes_de_temas(ctx, temas) -> str:
    ligacoes = [f'<a href="/temas/{e(t)}/">{e(ctx.mesas[t])}</a>' for t in temas if ctx.tema_existe(t)]
    return " · ".join(ligacoes)


# --------------------------------------------------------------------------- piece page


def _correcoes(ctx, peca) -> list[dict]:
    lista = [c for c in peca.registo.get("correcao", []) if isinstance(c, dict)]
    return sorted(lista, key=lambda c: str(c.get("em", "")), reverse=True)


def _data_de(texto) -> str:
    i = _instante(texto)
    return datas.por_extenso(datas.em_lisboa(i).date()) if i else ""


def _bloco_de_correcao(ctx, c, peca=None) -> str:
    """On the piece page (§3.2): the kind, the date, the reason, before, now. On the
    Corrections page (§5, with `peca`): the date, the kind, the piece, before, now, the reason."""
    if peca is not None:
        return (
            '<div class="correcao">'
            f'<p class="eyebrow">{e(_data_de(c.get("em")))} · {e(ctx.t("especie_" + str(c.get("especie"))))}</p>'
            f'<p class="correcao-peca"><a href="/pecas/{e(peca.id)}/">{e(texto_simples(peca, peca.cabeca.get("titulo", "")))}</a></p>'
            f'<p><span class="rotulo">{e(ctx.t("antes"))}</span> {e(str(c.get("antes", "")))}</p>'
            f'<p><span class="rotulo">{e(ctx.t("agora"))}</span> {e(str(c.get("depois", "")))}</p>'
            f'<p>{e(str(c.get("razao", "")))}</p>'
            "</div>"
        )
    peca_html = ""
    return (
        '<div class="correcao">'
        f'<p class="eyebrow">{e(ctx.t("especie_" + str(c.get("especie"))))} · {e(_data_de(c.get("em")))}</p>'
        f"{peca_html}"
        f'<p>{e(str(c.get("razao", "")))}</p>'
        f'<p><span class="rotulo">{e(ctx.t("antes"))}</span> {e(str(c.get("antes", "")))}</p>'
        f'<p><span class="rotulo">{e(ctx.t("agora"))}</span> {e(str(c.get("depois", "")))}</p>'
        "</div>"
    )


# A stored copy of one of these types is a web page, and its link opens it (`r_abrir`);
# anything else (a PDF, a spreadsheet, a data file) is a file the browser downloads
# (`r_descarregar`). docs/ESPEC-PAGINAS.md, edit of 15 November 2026.
TIPOS_DE_PAGINA = ("text/html", "application/xhtml+xml")


def palavras_da_ligacao(ctx, fonte: dict) -> str:
    tipo = str(fonte.get("tipo_conteudo", "")).split(";")[0].strip().lower()
    return ctx.t("r_abrir") if tipo in TIPOS_DE_PAGINA else ctx.t("r_descarregar")


def _fonte_dl(ctx, peca, linha) -> str:
    f = peca.fontes.get(linha.get("fonte"), {})
    url = str(f.get("url", ""))
    ligacoes = f'<dd class="abrir"><a href="{e(url)}" rel="noopener noreferrer">{e(palavras_da_ligacao(ctx, f))}</a></dd>'
    if f.get("pagina"):
        ligacoes += f'<dd class="abrir"><a href="{e(str(f["pagina"]))}" rel="noopener noreferrer">{e(ctx.t("r_pagina"))}</a></dd>'
    return (
        f'<dt>{e(ctx.t("r_fonte"))}</dt><dd>{_campo(f.get("titulo", ""))} · {_campo(f.get("editor", ""))}</dd>'
        f'<dt>{e(ctx.t("r_onde"))}</dt><dd>{_campo(linha.get("onde", ""))}</dd>'
    ), (
        f'<dt>{e(ctx.t("r_lido"))}</dt><dd>{e(_data_de(f.get("lido_em")))}</dd>'
        + ligacoes
    )


def lugar_da_figura(linha: dict) -> tuple[int, int] | None:
    """Where the page marks a `valor` line's figure in its excerpt (the excerpt stripped, as
    the page prints it): (start, end), or None when nothing is marked.

    The places are those check 2 finds (`numeros.ocorrencias`, on the normalised excerpt),
    carried back to the excerpt's own characters by `fontes.normalizar_com_mapa`. One place:
    it is marked. `ocorrencia = n`: the n-th is marked. More than one and no `ocorrencia`:
    none (docs/ESPEC-PECA.md and ESPEC-PAGINAS.md, edits of 15 November 2026)."""
    if linha.get("tipo") != "valor":
        return None
    par = fontes.normalizar_com_mapa(str(linha.get("excerto", "")).strip())
    if par is None:
        return None
    normalizado, mapa = par
    lugares = numeros.ocorrencias(normalizado, str(linha.get("valor", "")), quadro=linha.get("linha_de_quadro") is True)
    n = linha.get("ocorrencia")
    if isinstance(n, int) and not isinstance(n, bool):
        if not 1 <= n <= len(lugares):
            return None
        a, b = lugares[n - 1]
    elif len(lugares) == 1:
        a, b = lugares[0]
    else:
        return None
    # A negative figure is marked with its sign (a hyphen or minus sign, and the space after it
    # when the source has one) or the word «menos», as check 2 reads it.
    if str(linha.get("valor", "")).strip().startswith("-"):
        sinal = re.search(r"(?:[-\u2212] ?|(?<![^\W\d_])menos\s+)\Z", normalizado[:a], re.IGNORECASE)
        if sinal:
            a = sinal.start()
    return mapa[a][0], mapa[b - 1][1]


def _excerto(ctx, linha) -> str:
    """The excerpt with its own line breaks (the stylesheet keeps them), no break inside a
    number or after «p.», and the figure marked."""
    excerto = str(linha.get("excerto", "")).strip()
    impresso = sem_quebra_na_fonte(excerto)  # one character for one: the places stay
    lugar = lugar_da_figura(linha)
    if lugar is None:
        corpo = e(impresso)
    else:
        a, b = lugar
        corpo = f"{e(impresso[:a])}<mark>{e(impresso[a:b])}</mark>{e(impresso[b:])}"
    return f'<dt>{e(ctx.t("r_excerto"))}</dt><dd><blockquote class="excerto">{corpo}</blockquote></dd>'


SINAIS = {"+": "+", "-": "−", "*": "×", "/": "÷"}
MENOS = "−"


def _agrupado(inteiro: str) -> str:
    """The digits of a whole number with its thousands grouped by no-break spaces: «1\u00a0500»."""
    grupos = []
    while len(inteiro) > 3:
        grupos.insert(0, inteiro[-3:])
        inteiro = inteiro[:-3]
    return NBSP.join([inteiro] + grupos)


def numero_mostrado(linha: dict) -> tuple[str, bool]:
    """The number a calculation prints for a line, without the sign, and whether it is negative.

    The arithmetic prints numbers that compute (docs/ESPEC-PAGINAS.md, section 3, `derivado`,
    edit of 15 November 2026, 15:17 UTC): the line's `valor` in Portuguese form, with final zeros
    added up to the decimals its `mostra` shows when, and only when, the number of the `mostra`
    read back is exactly the `valor` in the same scale («4,4» shown «4,40 %» prints «4,40»);
    where the `mostra` rounds the `valor` or gives it in another scale («1,5 mil» for 1500), it is
    the `valor` as it is («1\u00a0500»). The sign comes from the `valor`. A `mostra_livre` line,
    or one whose `mostra` holds no single figure, prints its `valor` as it is."""
    valor = derivacoes.numero(str(linha.get("valor", "")).strip())
    casas = None
    if linha.get("mostra_livre") is not True:
        try:
            figura, casas_m, escala_m = numeros.ler_mostra(str(linha.get("mostra", "")))
        except numeros.ErroDeFigura:
            figura = None
        if (figura is not None and escala_m == numeros.escala_da_unidade(str(linha.get("unidade", "")))
                and abs(figura) == abs(valor) and -valor.as_tuple().exponent <= casas_m):
            casas = casas_m
    absoluto = abs(valor)
    texto = format(absoluto.quantize(Decimal(1).scaleb(-casas)) if casas is not None else absoluto, "f")
    inteiro, _, decimais = texto.partition(".")
    return _agrupado(inteiro) + ("," + decimais if decimais else ""), valor < 0


def _entradas(peca, lid) -> list[str]:
    """The lines a derivado's calculation names, in the order it names them, each once."""
    l = peca.linhas.get(lid, {})
    if l.get("tipo") != "derivado":
        return []
    vistas: list[str] = []
    for i in derivacoes.ids_em(str(l.get("calculo", ""))):
        if i in peca.linhas and i not in vistas:
            vistas.append(i)
    return vistas


def _conta(ctx, peca, linha) -> str:
    """The calculation as arithmetic a reader can follow; the expression itself is never printed.

    Each input is printed as its own line's mostra shows it, without the unit, and linked
    to its receipt; a negative one in parentheses with a true minus sign, «(−0,11) − (−0,38)».
    The result is the line's own mostra, without the unit. `round ( x , n )` may only be
    the outermost step (check 3), so it is taken off and said in words after the result:
    «104,7 − 102,3 = 2,4 (arredondado a uma casa decimal)». Under it, one line for each
    input that is a `valor` line: the input, then its periodo (docs/ESPEC-PAGINAS.md,
    section 3, `derivado`, edit of 15 November 2026, 13:09 UTC).
    """
    toks = derivacoes.simbolos(str(linha.get("calculo", "")))
    casas = derivacoes.arredondamento_exterior(toks)
    if casas is not None:
        toks = toks[2:-3]
    texto, cola = "", True  # cola: no space before the next part
    for i, t in enumerate(toks):
        anterior = toks[i - 1] if i else None
        unario = t == "-" and (anterior is None or anterior in ("(", "+", "-", "*", "/"))
        if t == ")":
            texto += ")"
            cola = False
            continue
        if t in peca.linhas:
            numero, negativo = numero_mostrado(peca.linhas[t])
            ligado = f'<a href="#r-{e(t)}">{MENOS if negativo else ""}{e(numero)}</a>'
            parte = f"({ligado})" if negativo else ligado
        elif derivacoes.LITERAL.match(t):
            inteiro, _, decimais = t.lstrip("-").partition(".")
            numero = e(_agrupado(inteiro) + ("," + decimais if decimais else ""))
            parte = f"({MENOS}{numero})" if t.startswith("-") else numero
        elif unario:
            parte = MENOS
        else:
            parte = SINAIS.get(t, e(t))
        texto += ("" if cola else " ") + parte
        cola = t == "(" or unario
    numero, negativo = numero_mostrado(linha)
    resultado = f"{texto}\u00a0= {MENOS if negativo else ''}{e(numero)}"
    if casas is not None:
        chave = "r_arred_0" if casas == 0 else "r_arred_1" if casas == 1 else "r_arred_n"
        resultado += f" ({e(ctx.t(chave, n=casas))})"
    itens = []
    for i in _entradas(peca, str(linha.get("id", ""))):
        if peca.linhas[i].get("tipo") != "valor":
            continue  # an input that is itself a calculation has its own receipt and its own list
        numero, negativo = numero_mostrado(peca.linhas[i])
        itens.append(f'<li><a href="#r-{e(i)}">{MENOS if negativo else ""}{e(numero)}</a> · '
                     f'<span class="periodo">{_campo(peca.linhas[i].get("periodo", ""))}</span></li>')
    if itens:
        resultado += f'<ul class="entradas-da-conta">{"".join(itens)}</ul>'
    return resultado


def recibos_da_pagina(peca) -> tuple[list[str], list[str]]:
    """(the lines the title, the lead or the text prints or ties, in the order of first use;
    the lines that are only inputs of a calculation shown on the page, directly or through
    another calculation). A line used nowhere is in neither: it has no receipt on the page
    and stays in the file (docs/ESPEC-PAGINAS.md, section 3, item 4).

    This module's reading of «in the order the calculations use them»: the calculations
    are taken in the order of the page, and an input that is itself a calculation is
    followed at once by its own inputs."""
    usadas = [lid for lid in ordem_de_uso(peca) if lid in peca.linhas]
    so_entradas: list[str] = []

    def seguir(lid):
        for i in _entradas(peca, lid):
            if i not in usadas and i not in so_entradas:
                so_entradas.append(i)
                seguir(i)

    for lid in usadas:
        seguir(lid)
    return usadas, so_entradas


def _volta(peca, lid, usadas, na_pagina) -> str:
    """Where `r_voltar` leads: the first use in the text; for a line that is only an input,
    the receipt of the first calculation on the page that uses it; else the text's top."""
    if lid in usadas:
        return f"#u-{lid}"
    for outro in na_pagina:
        if lid in _entradas(peca, outro):
            return f"#r-{outro}"
    return "#conteudo"


def _recibo(ctx, peca, lid, usadas=(), na_pagina=()) -> str:
    l = peca.linhas[lid]
    tipo = l.get("tipo")
    sinal = ""
    if tipo == "valor":
        if l.get("provisorio"):
            sinal = f'<p class="sinal">{e(ctx.t("r_provisorio"))}</p>'
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        dl = (
            f'<dt>{e(ctx.t("r_mede"))}</dt><dd>{_campo(l.get("mede", ""))}</dd>'
            f'<dt>{e(ctx.t("r_populacao"))}</dt><dd>{_campo(l.get("populacao", ""))}</dd>'
            f'<dt>{e(ctx.t("r_periodo"))}</dt><dd>{_campo(l.get("periodo", ""))}</dd>'
            + antes_excerto + _excerto(ctx, l) + depois_excerto
        )
    elif tipo == "derivado":
        mede = f'<dt>{e(ctx.t("r_mede"))}</dt><dd>{_campo(l.get("mede", ""))}</dd>' if str(l.get("mede", "")).strip() else ""
        dl = (
            mede
            + f'<dt>{e(ctx.t("r_conta"))}</dt><dd class="conta">{_conta(ctx, peca, l)}</dd>'
            f'<dt>{e(ctx.t("r_compara"))}</dt><dd>{_campo(l.get("compara", ""))}</dd>'
        )
    elif tipo == "citacao":
        pessoa = peca.pessoas.get(l.get("quem"))
        quem = f'{pessoa.get("nome", "")}, {pessoa.get("cargo", "")}' if pessoa else str(l.get("entidade", ""))
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        quando = datas.data_real(str(l.get("quando", "")))
        dl = (
            f'<dt>{e(ctx.t("r_quem"))}</dt><dd>{_campo(quem)}</dd>'
            f'<dt>{e(ctx.t("r_quando"))}</dt><dd>{e(datas.por_extenso(quando) if quando else "")}</dd>'
            + antes_excerto + depois_excerto
        )
    else:
        # What the document establishes is the summary, and is not printed a second time here.
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        quando = datas.data_real(str(l.get("quando", "")))
        dl = (
            _excerto(ctx, l) + antes_excerto
            + f'<dt>{e(ctx.t("r_quando"))}</dt><dd>{e(datas.por_extenso(quando) if quando else "")}</dd>'
            + depois_excerto
        )
    # Closed, a receipt says what it is (docs/ESPEC-PAGINAS.md, section 3, item 4): a figure
    # (every mostra, a mostra_livre one included) and then what it measures, on one line
    # that the stylesheet cuts; a quotation's words; an act's sentence.
    if tipo in ("valor", "derivado"):
        mede = str(l.get("mede", ""))
        resumo = (f'<span class="figura">{e(sem_quebra(mostra_impressa(l), True))}</span>'
                  + (f' <span class="mede">{_campo(mede)}</span>' if mede.strip() else ""))
    elif tipo == "citacao":
        resumo = f"<span>{e(_impressa(peca, lid))}</span>"
    else:
        resumo = f'<span>{_campo(l.get("diz", ""))}</span>'
    # The receipt of an input leads to the receipts of the calculations on the page it enters,
    # each link showing that calculation's figure (docs/ESPEC-PAGINAS.md, section 3, item 4).
    contas = [c for c in na_pagina if lid in _entradas(peca, c)]
    entra = ""
    if contas:
        ligacoes = ", ".join(f'<a href="#r-{e(c)}">{e(sem_quebra(mostra_impressa(peca.linhas[c]), True))}</a>' for c in contas)
        entra = f'<p class="entra-em">{e(ctx.t("r_entra_em"))} {ligacoes}</p>'
    voltar = entra + f'<p class="voltar"><a href="{_volta(peca, lid, usadas, na_pagina)}">{e(ctx.t("r_voltar"))}</a></p>'
    # The anchor a link leads to is inside the box's content, never the box or its summary:
    # a browser opens a closed <details> when the place it is sent to is inside its content,
    # and does not when it is the box itself (docs/ESPEC-PAGINAS.md, edit of 15 November
    # 2026). The stylesheet places the anchor at the box's top, so the summary shows.
    return (f'<details class="recibo"><summary>{resumo}</summary>'
            f'<span class="ancora" id="r-{e(lid)}"></span>{sinal}<dl>{dl}</dl>{voltar}</details>')


def _r(ctx, chave: str) -> str:
    """The column's label on each value, so that on a phone the value sits under it."""
    return f' data-rotulo="{e(ctx.t(chave))}"'


def _registo(ctx, peca) -> str:
    linhas = []
    # In the order the readings were made: by the time each ended, then as recorded.
    leituras = sorted(peca.registo.get("leitura", []), key=lambda l: str(l.get("fim", "")))
    for l in leituras:
        minutos = _minutos(l.get("inicio"), l.get("fim"))
        fim = _instante(l.get("fim"))
        quando = (f'{e(datas.por_extenso(datas.em_lisboa(fim).date()))}<br>{e(datas.hora(fim))}' if fim else "")
        linhas.append(
            "<tr>"
            f'<td class="quando"{_r(ctx, "c_quando")}>{quando}</td>'
            f'<td class="lugar"{_r(ctx, "c_leitura")}>{e(ctx.t("lugar_" + str(l.get("lugar"))))}</td>'
            f'<td{_r(ctx, "c_familia")}>{e(ctx.t("familia_" + str(l.get("familia"))))}</td>'
            f'<td class="mono"{_r(ctx, "c_plantas")}>{e(ctx.t("plantas_formato", apanhadas=l.get("plantas_apanhadas"), postas=l.get("plantas_postas")))}</td>'
            f'<td class="mono"{_r(ctx, "c_achados")}>{e(str(l.get("achados")))}</td>'
            f'<td{_r(ctx, "c_veredicto")}>{e(ctx.t("v_" + str(l.get("veredicto"))))}</td>'
            f'<td class="mono"{_r(ctx, "c_minutos")}>{"" if minutos is None else minutos}</td>'
            "</tr>"
        )
    tabela = ""
    if linhas:
        cab = "".join(f'<th scope="col">{e(ctx.t(k))}</th>' for k in ("c_quando", "c_leitura", "c_familia", "c_plantas", "c_achados", "c_veredicto", "c_minutos"))
        tabela = f'<div class="tabela"><table><thead><tr>{cab}</tr></thead><tbody>{"".join(linhas)}</tbody></table></div>'
    tempo = ""
    encomenda = next((p for p in peca.registo.get("passo", []) if p.get("nome") == "encomenda"), None)
    publ = publicada_em(peca)
    inicio = _instante(encomenda.get("inicio")) if encomenda else None
    if inicio and publ and publ >= inicio:
        total = int((publ - inicio).total_seconds() // 60)
        tempo = f'<p>{e(ctx.t("tempo", horas=total // 60, minutos=total % 60))}</p>'
    return (
        f'<details class="registo" id="registo"><summary><h2>{e(ctx.t("registo_titulo"))}</h2></summary>'
        f'<p>{e(ctx.t("registo_intro"))}</p>{tabela}{tempo}'
        f'<p class="impressao">{e(ctx.t("impressao"))} <code>{peca.impressao}</code></p>'
        "</details>"
    )


def pagina_da_peca(peca: Peca, ctx: Contexto) -> str:
    titulo_simples = texto_simples(peca, str(peca.cabeca.get("titulo", "")))
    meta = f'<meta name="impressao" content="{peca.impressao}">\n'
    if peca.estado == "retirada":
        est = peca.ultimo_estado() or {}
        corpo = (
            '<article class="peca">'
            f'<h1 class="peca-titulo">{e(titulo_simples)}</h1>'
            f'<p class="retirada">{e(ctx.t("retirada", data=_data_de(est.get("em"))))}</p>'
            f'<p>{e(str(est.get("razao", "")))}</p>'
            f"{_registo(ctx, peca)}</article>"
        )
        return pagina(ctx, f"{titulo_simples} · {ctx.t('nome')}", corpo, meta=meta, aqui=f"/pecas/{peca.id}/")
    publ = publicada_em(peca)
    linha_pub = ""
    if publ:
        linha_pub = f'<p class="publicada">{e(ctx.t("publicada", data=datas.por_extenso(datas.em_lisboa(publ).date()), hora=datas.hora(publ)))}</p>'
    temas = _ligacoes_de_temas(ctx, peca.cabeca.get("temas", []))
    correcoes = "".join(_bloco_de_correcao(ctx, c) for c in _correcoes(ctx, peca))
    usadas, so_entradas = recibos_da_pagina(peca)
    na_pagina = usadas + so_entradas
    recibos = "".join(_recibo(ctx, peca, lid, set(usadas), na_pagina) for lid in usadas)
    if so_entradas:  # the lines that are only inputs of the calculations above, under a heading of their own
        recibos += (f'<h3 class="recibos-entradas">{e(ctx.t("recibos_entradas"))}</h3>'
                    + "".join(_recibo(ctx, peca, lid, set(usadas), na_pagina) for lid in so_entradas))
    primeiros: set = set()
    corpo = (
        '<article class="peca">'
        '<header class="peca-cabeca">'
        f'<p class="eyebrow">{e(_tipo(ctx, peca))}</p>'
        f'<h1 class="peca-titulo">{em_linha(peca, str(peca.cabeca.get("titulo", "")), primeiros=primeiros)}</h1>'
        f'<p class="entrada">{em_linha(peca, str(peca.cabeca.get("entrada", "")), primeiros=primeiros)}</p>'
        f"{linha_pub}"
        + (f'<p class="temas">{temas}</p>' if temas else "")
        + "</header>"
        + (f'<section class="correcoes-da-peca">{correcoes}</section>' if correcoes else "")
        + f'<div class="texto">{markdown_com_referencias(peca, peca.corpo, primeiros=primeiros)}</div>'
        + (f'<section class="recibos" id="recibos"><h2>{e(ctx.t("recibos_titulo"))}</h2><p>{e(ctx.t("recibos_intro"))}</p>{recibos}</section>' if recibos else "")
        + _registo(ctx, peca)
        + "</article>"
    )
    return pagina(ctx, f"{titulo_simples} · {ctx.t('nome')}", corpo, meta=meta, aqui=f"/pecas/{peca.id}/")


# --------------------------------------------------------------------------- lists of pieces


def publicadas(ctx: Contexto) -> list[Peca]:
    """Published pieces in this build, most recent first. Withdrawn pieces are not listed."""
    lista = [p for p in ctx.pecas if ctx.listada(p)]
    return sorted(lista, key=lambda p: (publicada_em(p) or dt.datetime.min.replace(tzinfo=dt.timezone.utc), p.id), reverse=True)


def _item(ctx, peca) -> str:
    temas = peca.cabeca.get("temas", [])
    principal = temas[0] if temas else None
    tema = f'<p class="item-tema"><a href="/temas/{e(principal)}/">{e(ctx.mesas[principal])}</a></p>' if principal and ctx.tema_existe(principal) else ""
    return (
        '<article class="item">'
        f'<p class="eyebrow">{e(_tipo(ctx, peca))}</p>'
        f'<h3 class="item-titulo"><a href="/pecas/{e(peca.id)}/">{e(texto_simples(peca, str(peca.cabeca.get("titulo", ""))))}</a></h3>'
        f'<p class="item-entrada">{e(texto_simples(peca, str(peca.cabeca.get("entrada", ""))))}</p>'
        f"{tema}</article>"
    )


def pagina_inicial(ctx: Contexto) -> str:
    dias: dict[dt.date, list[Peca]] = {}
    for p in publicadas(ctx):
        publ = publicada_em(p)
        dia = datas.em_lisboa(publ).date() if publ else None
        dias.setdefault(dia, []).append(p)
    blocos = []
    for dia, lista in dias.items():
        cab = f'<h2 class="dia">{e(datas.por_extenso(dia))}</h2>' if dia else ""
        blocos.append(f'<section class="dia-bloco">{cab}{"".join(_item(ctx, p) for p in lista)}</section>')
    temas = sorted({t for p in publicadas(ctx) for t in p.cabeca.get("temas", []) if ctx.tema_existe(t)}, key=lambda t: ctx.mesas[t])
    lista_temas = ""
    if temas:
        itens = "".join(f'<li><a href="/temas/{e(t)}/">{e(ctx.mesas[t])}</a></li>' for t in temas)
        lista_temas = f'<section class="temas-lista"><h2>{e(ctx.t("temas_titulo"))}</h2><ul>{itens}</ul></section>'
    return pagina(ctx, ctx.t("nome"), "".join(blocos) + lista_temas, inicio=True)


def pagina_do_tema(ctx: Contexto, tema: str) -> str:
    pecas = [p for p in publicadas(ctx) if tema in p.cabeca.get("temas", [])]
    seguir = []
    for p in pecas:
        texto = seccao_do_corpo(p.corpo, FECHO[2])
        if texto:
            seguir.append(
                '<div class="seguir">'
                f"{markdown_com_referencias(p, texto, modo='texto')}"
                f'<p class="seguir-peca"><a href="/pecas/{e(p.id)}/">{e(texto_simples(p, str(p.cabeca.get("titulo", ""))))}</a></p>'
                "</div>"
            )
    corpo = f'<h1 class="pagina-titulo">{e(ctx.mesas[tema])}</h1>'
    if seguir:
        corpo += f'<section class="seguir-bloco"><h2>{e(ctx.t("seguir_titulo"))}</h2>{"".join(seguir)}</section>'
    corpo += f'<section class="tema-pecas"><p class="intro">{e(ctx.t("tema_intro"))}</p>{"".join(_item(ctx, p) for p in pecas)}</section>'
    return pagina(ctx, f"{ctx.mesas[tema]} · {ctx.t('nome')}", corpo, aqui=f"/temas/{tema}/")


# --------------------------------------------------------------------------- method, corrections, 404


def pagina_do_metodo(ctx: Contexto) -> str:
    prosa = markdown_com_referencias(None, ctx.metodo or "")
    publicas = [p for p in ctx.pecas if p.publicada or p.estado == "retirada"]
    lugares: dict[str, dict] = {}
    leituras = [l for p in publicas for l in p.registo.get("leitura", [])] + list(ctx.leituras_fora)
    for l in leituras:
        if isinstance(l, dict):
            d = lugares.setdefault(str(l.get("lugar")), {"leituras": 0, "postas": 0, "apanhadas": 0, "adotados": 0, "falhas": 0})
            d["leituras"] += 1
            d["postas"] += int(l.get("plantas_postas", 0))
            d["apanhadas"] += int(l.get("plantas_apanhadas", 0))
            d["adotados"] += int(l.get("adotados", 0))
    correcoes = [c for p in publicas for c in p.registo.get("correcao", []) if isinstance(c, dict)]
    for c in correcoes:
        if c.get("especie") == "correcao" and c.get("causa") in lugares:
            lugares[c["causa"]]["falhas"] += 1
    equipa = ""
    if lugares:
        ordem = ("numeros", "oposto", "especialista", "leitor", "justica", "juiz", "correcoes", "desenhador", "seguranca")
        linhas = "".join(
            f'<tr><td class="lugar"{_r(ctx, "e_lugar")}>{e(ctx.t("lugar_" + k))}</td><td class="mono"{_r(ctx, "e_leituras")}>{d["leituras"]}</td>'
            f'<td class="mono"{_r(ctx, "c_plantas")}>{e(ctx.t("plantas_formato", apanhadas=d["apanhadas"], postas=d["postas"]))}</td>'
            f'<td class="mono"{_r(ctx, "e_adotados")}>{d["adotados"]}</td><td class="mono"{_r(ctx, "e_falhas")}>{d["falhas"]}</td></tr>'
            for k in ordem if (d := lugares.get(k))
        )
        cab = "".join(f'<th scope="col">{e(ctx.t(k))}</th>' for k in ("e_lugar", "e_leituras", "c_plantas", "e_adotados", "e_falhas"))
        equipa = f'<div class="tabela"><table><thead><tr>{cab}</tr></thead><tbody>{linhas}</tbody></table></div>'
    contagens = (
        ("n_publicadas", sum(1 for p in publicas if p.publicada)),
        ("n_correcoes", sum(1 for c in correcoes if c.get("especie") == "correcao")),
        ("n_atualizacoes", sum(1 for c in correcoes if c.get("especie") == "atualizacao")),
        ("n_retiradas", sum(1 for p in publicas if p.estado == "retirada")),
    )
    dl = "".join(f'<dt>{e(ctx.t(k))}</dt><dd class="mono">{n}</dd>' for k, n in contagens)
    # The last re-check of sources, from reconferencias.toml: the last whole run that was allowed
    # to withdraw (so_relatar false), ORDEM esq3, item H.
    contadas = [r for r in ctx.reconferencias if r.get("so_relatar") is False]
    if contadas:
        r = contadas[-1]
        quando = _instante(r.get("em"))
        reconferencia = ctx.t("reconferencia_ultima", data=datas.por_extenso(datas.em_lisboa(quando).date()) if quando else "",
                              pecas=r.get("pecas"), excertos=r.get("excertos"), retiradas=len(r.get("retiradas", [])))
    else:
        reconferencia = ctx.t("reconferencia_nenhuma")
    corpo = (
        f'<h1 class="pagina-titulo">{e(ctx.t("nav_metodo"))}</h1>'
        f'<div class="texto">{prosa}</div>'
        f'<section class="numeros"><h2>{e(ctx.t("numeros_titulo"))}</h2><dl class="contagens">{dl}</dl>'
        f'<p class="reconferencia">{e(reconferencia)}</p></section>'
        + (f'<section class="equipa"><h2>{e(ctx.t("equipa_titulo"))}</h2>{equipa}</section>' if equipa else "")
        + f'<section class="taxa"><h2>{e(ctx.t("taxa_titulo"))}</h2><p>{e(ctx.t("sem_auditoria"))}</p></section>'
    )
    return pagina(ctx, f"{ctx.t('nav_metodo')} · {ctx.t('nome')}", corpo, aqui="/metodo/")


def pagina_das_correcoes(ctx: Contexto) -> str:
    todas = []
    for p in ctx.pecas:
        if p.publicada or p.estado == "retirada":
            todas += [(str(c.get("em", "")), c, p) for c in p.registo.get("correcao", []) if isinstance(c, dict)]
    todas.sort(key=lambda x: x[0], reverse=True)
    lista = "".join(_bloco_de_correcao(ctx, c, p) for _, c, p in todas) or f'<p>{e(ctx.t("sem_correcoes"))}</p>'
    corpo = (
        f'<h1 class="pagina-titulo">{e(ctx.t("nav_correcoes"))}</h1>'
        f'<p class="intro">{e(ctx.t("correcoes_intro"))}</p>'
        f'<section class="correcoes-lista">{lista}</section>'
        f'<section class="erro"><h2>{e(ctx.t("erro_titulo"))}</h2><p>{_com_endereco(ctx.t("erro_como"))}</p></section>'
    )
    return pagina(ctx, f"{ctx.t('nav_correcoes')} · {ctx.t('nome')}", corpo, aqui="/correcoes/")


def pagina_404(ctx: Contexto) -> str:
    corpo = f'<h1 class="pagina-titulo">{e(ctx.t("nao_existe"))}</h1><p><a href="/">{e(ctx.t("voltar"))}</a></p>'
    return pagina(ctx, f"{ctx.t('nao_existe')} · {ctx.t('nome')}", corpo)
