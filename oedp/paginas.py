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

from . import datas, derivacoes, numeros
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


def _impressa(peca: Peca, lid: str) -> str:
    """What `{id}` prints: the mostra, or the words of a citacao between «»."""
    linha = peca.linhas[lid]
    if linha.get("tipo") == "citacao":
        return "«" + str(linha.get("excerto", "")).strip() + "»"
    return str(linha.get("mostra", ""))


def _ligacao(peca: Peca, lid: str, modo: str) -> str | None:
    if modo == "texto":
        return None
    if modo == "noutra":
        return f"/pecas/{peca.id}/#r-{lid}"
    return f"#r-{lid}"


NBSP = "\u00a0"
# A number (with its thousands groups and decimals) and the space after it.
_NUMERO_E_ESPACO = re.compile(r"(\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+)((?:[.,]\d+)*)(?:\.º|º|ª)?[ \u00a0\u202f](?=\S)")


def sem_quebra(texto: str, linha_impressa: bool) -> str:
    """A printed line never breaks; inside tied words a number stays with the next word."""
    if linha_impressa:
        return re.sub(r"[ \u202f]", NBSP, texto)

    def junta(m):
        return m.group(0).replace(" ", NBSP).replace("\u202f", NBSP)

    return _NUMERO_E_ESPACO.sub(junta, texto)


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
    return "".join(partes)


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
    return saida


# --------------------------------------------------------------------------- the frame of every page


def pagina(ctx: Contexto, titulo: str, corpo: str, *, inicio: bool = False, meta: str = "") -> str:
    robots = "" if ctx.lancamento else '<meta name="robots" content="noindex, nofollow">\n'
    nome = e(ctx.t("nome"))
    marca = f'<h1 class="wordmark">{nome}</h1>' if inicio else f'<p class="wordmark">{nome}</p>'
    return f"""<!doctype html>
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
<p class="rotulo-ia-linha">{e(ctx.t("ia_linha"))} <a href="/metodo/">{e(ctx.t("ia_ligacao"))}</a></p>
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
"""


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
    peca_html = f'<p class="correcao-peca"><a href="/pecas/{e(peca.id)}/">{e(texto_simples(peca, peca.cabeca.get("titulo", "")))}</a></p>' if peca else ""
    return (
        '<div class="correcao">'
        f'<p class="eyebrow">{e(ctx.t("especie_" + str(c.get("especie"))))} · {e(_data_de(c.get("em")))}</p>'
        f"{peca_html}"
        f'<p>{e(str(c.get("razao", "")))}</p>'
        f'<p><span class="rotulo">{e(ctx.t("antes"))}</span> {e(str(c.get("antes", "")))}</p>'
        f'<p><span class="rotulo">{e(ctx.t("agora"))}</span> {e(str(c.get("depois", "")))}</p>'
        "</div>"
    )


def _fonte_dl(ctx, peca, linha) -> str:
    f = peca.fontes.get(linha.get("fonte"), {})
    url = str(f.get("url", ""))
    return (
        f'<dt>{e(ctx.t("r_fonte"))}</dt><dd>{e(str(f.get("titulo", "")))} · {e(str(f.get("editor", "")))}</dd>'
        f'<dt>{e(ctx.t("r_onde"))}</dt><dd>{e(str(linha.get("onde", "")))}</dd>'
    ), (
        f'<dt>{e(ctx.t("r_lido"))}</dt><dd>{e(_data_de(f.get("lido_em")))}</dd>'
        f'<dd class="abrir"><a href="{e(url)}" rel="noopener noreferrer">{e(ctx.t("r_abrir"))}</a></dd>'
    )


def _excerto(ctx, linha) -> str:
    return f'<dt>{e(ctx.t("r_excerto"))}</dt><dd><blockquote class="excerto">{e(str(linha.get("excerto", "")).strip())}</blockquote></dd>'


SINAIS = {"+": "+", "-": "\u2212", "*": "\u00d7", "/": "\u00f7"}


def _conta(ctx, peca, linha) -> str:
    """The calculation as arithmetic a reader can follow; the expression itself is never printed.

    `round ( x , n )` may only be the outermost step (check 3), so it is taken off and
    said in words after the result: «104,7 − 102,3 = 2,4 (arredondado a uma casa decimal)».
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
            parte = f'<a href="#r-{e(t)}">{e(numeros.portugues(peca.linhas[t].get("valor", "")))}</a>'
        elif derivacoes.LITERAL.match(t):
            parte = e(numeros.portugues(t))
        elif unario:
            parte = "\u2212"
        else:
            parte = SINAIS.get(t, e(t))
        texto += ("" if cola else " ") + parte
        cola = t == "(" or unario
    resultado = f"{texto}\u00a0= {e(numeros.portugues(str(linha.get('valor', ''))))}"
    if casas is not None:
        chave = "r_arred_0" if casas == 0 else "r_arred_1" if casas == 1 else "r_arred_n"
        resultado += f" ({e(ctx.t(chave, n=casas))})"
    return resultado


def _volta(peca, lid, usadas) -> str:
    """Where `r_voltar` leads: the first use in the text; for a line used only as an
    input, the receipt of the first computed figure that uses it; else the text's top."""
    if lid in usadas:
        return f"#u-{lid}"
    for outro, l in peca.linhas.items():
        if l.get("tipo") == "derivado" and lid in derivacoes.ids_em(str(l.get("calculo", ""))):
            return f"#r-{outro}"
    return "#conteudo"


def _recibo(ctx, peca, lid, usadas=()) -> str:
    l = peca.linhas[lid]
    tipo = l.get("tipo")
    sinal = ""
    figura = tipo in ("valor", "derivado") and re.search(r"\d", str(l.get("mostra", "")))
    if tipo == "valor":
        resumo = e(sem_quebra(str(l.get("mostra", "")), True))
        if l.get("provisorio"):
            sinal = f'<p class="sinal">{e(ctx.t("r_provisorio"))}</p>'
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        dl = (
            f'<dt>{e(ctx.t("r_mede"))}</dt><dd>{e(str(l.get("mede", "")))}</dd>'
            f'<dt>{e(ctx.t("r_populacao"))}</dt><dd>{e(str(l.get("populacao", "")))}</dd>'
            f'<dt>{e(ctx.t("r_periodo"))}</dt><dd>{e(str(l.get("periodo", "")))}</dd>'
            + antes_excerto + _excerto(ctx, l) + depois_excerto
        )
    elif tipo == "derivado":
        resumo = e(sem_quebra(str(l.get("mostra", "")), True))
        dl = (
            f'<dt>{e(ctx.t("r_conta"))}</dt><dd class="conta">{_conta(ctx, peca, l)}</dd>'
            f'<dt>{e(ctx.t("r_compara"))}</dt><dd>{e(str(l.get("compara", "")))}</dd>'
        )
    elif tipo == "citacao":
        resumo = e(_impressa(peca, lid))
        pessoa = peca.pessoas.get(l.get("quem"))
        quem = f'{pessoa.get("nome", "")}, {pessoa.get("cargo", "")}' if pessoa else str(l.get("entidade", ""))
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        quando = datas.data_real(str(l.get("quando", "")))
        dl = (
            f'<dt>{e(ctx.t("r_quem"))}</dt><dd>{e(quem)}</dd>'
            f'<dt>{e(ctx.t("r_quando"))}</dt><dd>{e(datas.por_extenso(quando) if quando else "")}</dd>'
            + antes_excerto + depois_excerto
        )
    else:
        resumo = e(str(l.get("diz", "")))
        antes_excerto, depois_excerto = _fonte_dl(ctx, peca, l)
        quando = datas.data_real(str(l.get("quando", "")))
        dl = (
            f'<dt>{e(ctx.t("r_estabelece"))}</dt><dd>{e(str(l.get("diz", "")))}</dd>'
            + _excerto(ctx, l) + antes_excerto
            + f'<dt>{e(ctx.t("r_quando"))}</dt><dd>{e(datas.por_extenso(quando) if quando else "")}</dd>'
            + depois_excerto
        )
    classe = ' class="figura"' if figura else ""
    voltar = f'<p class="voltar"><a href="{_volta(peca, lid, usadas)}">{e(ctx.t("r_voltar"))}</a></p>'
    return (f'<details class="recibo" id="r-{e(lid)}"><summary><span{classe}>{resumo}</span></summary>'
            f'{sinal}<dl>{dl}</dl>{voltar}</details>')


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
            f'<td class="quando">{quando}</td>'
            f'<td class="lugar">{e(ctx.t("lugar_" + str(l.get("lugar"))))}</td>'
            f'<td>{e(ctx.t("familia_" + str(l.get("familia"))))}</td>'
            f'<td class="mono">{e(ctx.t("plantas_formato", apanhadas=l.get("plantas_apanhadas"), postas=l.get("plantas_postas")))}</td>'
            f'<td class="mono">{e(str(l.get("achados")))}</td>'
            f'<td>{e(ctx.t("v_" + str(l.get("veredicto"))))}</td>'
            f'<td class="mono">{"" if minutos is None else minutos}</td>'
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
        return pagina(ctx, f"{titulo_simples} · {ctx.t('nome')}", corpo, meta=meta)
    publ = publicada_em(peca)
    linha_pub = ""
    if publ:
        linha_pub = f'<p class="publicada">{e(ctx.t("publicada", data=datas.por_extenso(datas.em_lisboa(publ).date()), hora=datas.hora(publ)))}</p>'
    temas = _ligacoes_de_temas(ctx, peca.cabeca.get("temas", []))
    correcoes = "".join(_bloco_de_correcao(ctx, c) for c in _correcoes(ctx, peca))
    ordem = ordem_de_uso(peca)
    ordem += [lid for lid in peca.linhas if lid not in ordem]
    usadas = set(ordem_de_uso(peca))
    recibos = "".join(_recibo(ctx, peca, lid, usadas) for lid in ordem if lid in peca.linhas)
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
    return pagina(ctx, f"{titulo_simples} · {ctx.t('nome')}", corpo, meta=meta)


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
        texto = seccao_do_corpo(p.corpo, "O que seguir")
        if texto:
            seguir.append(
                '<div class="seguir">'
                f"{markdown_com_referencias(p, texto, modo='noutra')}"
                f'<p class="seguir-peca"><a href="/pecas/{e(p.id)}/">{e(texto_simples(p, str(p.cabeca.get("titulo", ""))))}</a></p>'
                "</div>"
            )
    corpo = f'<h1 class="pagina-titulo">{e(ctx.mesas[tema])}</h1>'
    if seguir:
        corpo += f'<section class="seguir-bloco"><h2>{e(ctx.t("seguir_titulo"))}</h2>{"".join(seguir)}</section>'
    corpo += f'<section class="tema-pecas"><p class="intro">{e(ctx.t("tema_intro"))}</p>{"".join(_item(ctx, p) for p in pecas)}</section>'
    return pagina(ctx, f"{ctx.mesas[tema]} · {ctx.t('nome')}", corpo)


# --------------------------------------------------------------------------- method, corrections, 404


def pagina_do_metodo(ctx: Contexto) -> str:
    prosa = markdown_com_referencias(None, ctx.metodo or "")
    publicas = [p for p in ctx.pecas if p.publicada or p.estado == "retirada"]
    lugares: dict[str, dict] = {}
    for p in publicas:
        for l in p.registo.get("leitura", []):
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
        ordem = ("numeros", "oposto", "especialista", "leitor", "justica", "juiz", "correcoes")
        linhas = "".join(
            f'<tr><td class="lugar">{e(ctx.t("lugar_" + k))}</td><td class="mono">{d["leituras"]}</td>'
            f'<td class="mono">{e(ctx.t("plantas_formato", apanhadas=d["apanhadas"], postas=d["postas"]))}</td>'
            f'<td class="mono">{d["adotados"]}</td><td class="mono">{d["falhas"]}</td></tr>'
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
    corpo = (
        f'<h1 class="pagina-titulo">{e(ctx.t("nav_metodo"))}</h1>'
        f'<div class="texto">{prosa}</div>'
        f'<section class="equipa"><h2>{e(ctx.t("equipa_titulo"))}</h2>{equipa}<dl class="contagens">{dl}</dl></section>'
        f'<section class="taxa"><h2>{e(ctx.t("taxa_titulo"))}</h2><p>{e(ctx.t("sem_auditoria"))}</p></section>'
    )
    return pagina(ctx, f"{ctx.t('nav_metodo')} · {ctx.t('nome')}", corpo)


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
        f'<section class="erro"><h2>{e(ctx.t("erro_titulo"))}</h2><p>{_com_endereco(ctx.t("erro_como"))}</p></section>'
        f'<section class="correcoes-lista">{lista}</section>'
    )
    return pagina(ctx, f"{ctx.t('nav_correcoes')} · {ctx.t('nome')}", corpo)


def pagina_404(ctx: Contexto) -> str:
    corpo = f'<h1 class="pagina-titulo">{e(ctx.t("nao_existe"))}</h1><p><a href="/">{e(ctx.t("voltar"))}</a></p>'
    return pagina(ctx, f"{ctx.t('nao_existe')} · {ctx.t('nome')}", corpo)
