"""The shape of a piece file (check 9: a file that breaks the specification stops the build).

Every table and field of docs/ESPEC-PECA.md, with its type and its allowed values.
A field the specification does not name is refused, so a misspelt field cannot pass
as an absent one.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

from . import datas
from .derivacoes import LITERAL
from .peca import ID_LINHA, ID_PECA, Peca, referencias, sem_referencias

# The three closing headings, in this order and these words (docs/ESPEC-PECA.md, edit of
# 15 November 2026: the second and third were «A objeção mais forte» and «O que seguir»).
FECHO = ("A leitura deste projeto", "O melhor argumento contra esta leitura", "O que acompanhar")
TIPOS_PECA = {"diario", "artigo", "estudo"}
TEMA = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\Z")
SHA = re.compile(r"[0-9a-f]{64}\Z")

S, I, B, L = "texto", "inteiro", "sim_nao", "lista"
CAMPOS_FONTE = {"id": S, "titulo": S, "editor": S, "url": S, "url_final": S, "lido_em": S, "http": I,
                "tipo_conteudo": S, "bytes": I, "sha256": S, "publicado_em": S}
# The publisher's own page for the document, stored like a source (docs/ESPEC-PECA.md,
# edit of 15 November 2026): optional, and the two fields go together.
OPCIONAIS_FONTE = {"pagina": S, "pagina_sha256": S}
CAMPOS_LINHA = {
    "valor": {"id": S, "tipo": S, "fonte": S, "onde": S, "excerto": S, "valor": S, "unidade": S, "mede": S,
              "populacao": S, "periodo": S, "provisorio": B, "mostra": S},
    "derivado": {"id": S, "tipo": S, "calculo": S, "valor": S, "unidade": S, "mede": S, "periodo": S,
                 "compara": S, "mostra": S},
    "citacao": {"id": S, "tipo": S, "fonte": S, "onde": S, "excerto": S, "quem": S, "entidade": S, "quando": S},
    "ato": {"id": S, "tipo": S, "fonte": S, "onde": S, "excerto": S, "diz": S, "quem": S, "quando": S},
}
OPCIONAIS_LINHA = {"valor": {"mostra_livre": B}, "derivado": {"mostra_livre": B}, "citacao": {}, "ato": {}}
CAMPOS_PESSOA = {"id": S, "nome": S, "nome_curto": S, "cargo": S, "linhas": L}
CAMPOS_REGISTO = {
    "passo": ({"nome": S, "lugar": S, "familia": S, "modelo": S, "inicio": S, "fim": S}, {}),
    "leitura": ({"lugar": S, "familia": S, "modelo": S, "inicio": S, "fim": S, "impressao": S,
                 "plantas_postas": I, "plantas_apanhadas": I, "achados": I, "adotados": I, "veredicto": S},
                {"pessoas_vistas": L}),
    "estado": ({"estado": S, "em": S, "por": S, "razao": S}, {}),
    "correcao": ({"em": S, "especie": S, "antes": S, "depois": S, "razao": S, "impressao_antes": S,
                  "impressao_depois": S}, {"causa": S}),
}
VALORES = {
    ("passo", "nome"): {"encomenda", "nota", "reportagem", "escrita", "edicao"},
    ("passo", "familia"): {"anthropic", "openai"},
    ("leitura", "lugar"): {"numeros", "oposto", "especialista", "leitor", "justica", "juiz", "correcoes", "desenhador"},
    ("leitura", "familia"): {"anthropic", "openai"},
    ("leitura", "veredicto"): {"passa", "nao_passa", "levanta"},
    ("estado", "estado"): {"publicada", "retirada", "rascunho"},
    ("correcao", "especie"): {"correcao", "atualizacao"},
}
CAMPOS_DATA = {"publicado_em", "quando"}  # a date, or "" for publicado_em
CAMPOS_INSTANTE = {"lido_em", "inicio", "fim", "em"}


def _tipo_ok(v, tipo) -> bool:
    if tipo == S:
        return isinstance(v, str)
    if tipo == I:
        return isinstance(v, int) and not isinstance(v, bool)
    if tipo == B:
        return isinstance(v, bool)
    return isinstance(v, list) and all(isinstance(x, str) for x in v)


def _tabela(onde: str, t, exigidos: dict, opcionais: dict, erros: list[str]):
    if not isinstance(t, dict):
        erros.append(f"{onde} is not a table")
        return
    for k, tipo in exigidos.items():
        if k not in t:
            erros.append(f"{onde} lacks the field {k}")
        elif not _tipo_ok(t[k], tipo):
            erros.append(f"{onde}: field {k} must be {tipo}")
    for k, v in t.items():
        if k not in exigidos and k not in opcionais:
            erros.append(f"{onde}: field {k} is not in the specification")
        elif k in opcionais and opcionais[k] is not None and not _tipo_ok(v, opcionais[k]):
            erros.append(f"{onde}: field {k} must be {opcionais[k]}")


def erros_do_corpo(corpo: str) -> list[str]:
    erros = []
    proibidos = [
        (re.compile(r"<[A-Za-z/!?]"), "raw HTML"),
        (re.compile(r"\]\("), "a Markdown link"),
        (re.compile(r"\]\[|^\s*\[[^\]]+\]:\s", re.M), "a Markdown reference link"),
        (re.compile(r"!\["), "an image"),
        (re.compile(r"https?://|www\.", re.I), "a web address"),
        (re.compile(r"^\s*(```|~~~)", re.M), "a code block"),
        (re.compile(r"^ {0,3}>", re.M), "a block quote"),
        (re.compile(r"^#(?!#)", re.M), "a level-one heading"),
        (re.compile(r"^#{4,}", re.M), "a heading below level three"),
        (re.compile(r"^ {0,3}(?:[-*_] *){3,}$|^ {0,3}=+ *$", re.M), "a rule or an underlined heading"),
        (re.compile(r"^(?: {4,}|\t)(?![-*+] )\S", re.M), "an indented code block"),
    ]
    for padrao, nome in proibidos:
        m = padrao.search(corpo)
        if m:
            linha = corpo.count("\n", 0, m.start()) + 1
            erros.append(f"corpo, line {linha}: {nome}, which the specification does not allow")
    titulos = [l[3:].strip() for l in corpo.split("\n") if l.startswith("## ")]
    if tuple(titulos[-3:]) != FECHO:
        erros.append("corpo: the last three ## headings must be, in order and in these words: "
                     + "; ".join(FECHO) + f" (found: {'; '.join(titulos[-3:]) or 'none'})")
    for nome in FECHO:
        if titulos.count(nome) > 1:
            erros.append(f"corpo: the heading '{nome}' appears more than once")
    return erros


ASPAS = "«»“”„‟\"‹›‘‚‛"
# ’ (U+2019) between two letters is an apostrophe (d’água) and is allowed; anywhere else it closes a quotation.
APOSTROFO_FORA_DE_PALAVRA = re.compile(r"(?<![^\W\d_])’|’(?![^\W\d_])")


def _sem_impressos(texto: str) -> str:
    """The text with printed lines ({id}) taken out and tied words kept."""
    partes, pos = [], 0
    for r in referencias(texto):
        partes.append(texto[pos : r.inicio])
        if r.forma == "ligada":
            partes.append(r.palavras)
        pos = r.fim
    partes.append(texto[pos:])
    return "".join(partes)


def erros_do_texto(texto: str, linha_unica: bool) -> list[str]:
    """No quotation mark anywhere but in a printed citacao line: not in the text, not in
    tied words, and not written as an HTML entity; no inline code; in titulo and
    entrada, no raw HTML either."""
    resto = sem_referencias(texto)
    escrito = html.unescape(_sem_impressos(texto))
    erros = []
    aspas = sorted({c for c in escrito if c in ASPAS} | ({"’"} if APOSTROFO_FORA_DE_PALAVRA.search(escrito) else set()))
    if aspas:
        erros.append("a quotation mark (" + " ".join(aspas) + ") typed in the text; a quotation is printed only from a citacao line")
    if "`" in resto:
        erros.append("inline code, which the specification does not allow")
    if linha_unica and re.search(r"<[A-Za-z/!?]", texto):
        erros.append("raw HTML, which the specification does not allow")
    return erros


def _restos_de_referencia(texto: str) -> list[str]:
    """Braces left after the well-formed references are taken out."""
    partes, pos = [], 0
    for r in referencias(texto):
        partes.append(texto[pos : r.inicio])
        pos = r.fim
    partes.append(texto[pos:])
    resto = "".join(partes)
    return [c for c in "{}" if c in resto]


def erros_do_registo(registo: dict, nome: str = "registo", tabelas_permitidas=None, datas_aqui: bool = False,
                     valores: dict | None = None, familia: bool = True) -> list[str]:
    """The one validation of a record, a piece's or a text's: the tables and their fields,
    the values, the fingerprint's form, adotados not above achados, plants caught not
    above plants put, a passing reading that caught every plant, the family rule and the
    one-way state. With `datas_aqui`, the timestamps are checked here too (for a piece
    they are check 6's). `valores` replaces some allowed values (the code's record takes
    construcao steps and seguranca readings only); `familia=False` leaves the family rule
    to the caller (the code's record reads it in the order of the file)."""
    valores = {**VALORES, **(valores or {})}
    e: list[str] = []
    permitidas = tabelas_permitidas or tuple(CAMPOS_REGISTO)
    for k in registo:
        if k not in permitidas:
            e.append(f"{nome}: [[{k}]] is not a table of this record")
            continue
        tabelas = registo[k]
        if not isinstance(tabelas, list):
            e.append(f"{nome}: {k} must be an array of tables [[{k}]]")
            continue
        exigidos, opcionais = CAMPOS_REGISTO[k]
        for n, t in enumerate(tabelas, 1):
            onde = f"{nome} [[{k}]] number {n}"
            _tabela(onde, t, exigidos, opcionais, e)
            if not isinstance(t, dict):
                continue
            for (tab, campo), permitidos in valores.items():
                if tab == k and campo in t and t[campo] not in permitidos:
                    e.append(f"{onde}: {campo} {t[campo]!r} is not one of {', '.join(sorted(permitidos))}")
            if datas_aqui:
                for campo in ("inicio", "fim", "em"):
                    if campo in t and datas.instante_real(str(t[campo])) is None:
                        e.append(f"{onde}: {campo} {t[campo]!r} is not a real date in the form YYYY-MM-DDTHH:MM:SSZ")
            if k in ("passo", "leitura"):
                e.extend(erros_de_tempo(onde, t))
            if k == "leitura":
                if isinstance(t.get("impressao"), str) and not SHA.match(t["impressao"]):
                    e.append(f"{onde}: impressao is not a SHA-256")
                pp, pa = t.get("plantas_postas"), t.get("plantas_apanhadas")
                if isinstance(pp, int) and isinstance(pa, int) and not (0 <= pa <= pp):
                    e.append(f"{onde}: plantas_apanhadas must be between 0 and plantas_postas")
                elif t.get("veredicto") == "passa" and pa != pp:
                    e.append(f"{onde}: a reading recorded as passing caught {pa} of {pp} planted errors; it passes only if it caught every one")
                ac, ad = t.get("achados"), t.get("adotados")
                if isinstance(ac, int) and isinstance(ad, int) and not (0 <= ad <= ac):
                    e.append(f"{onde}: adotados must be between 0 and achados")
                if "pessoas_vistas" in t and t.get("lugar") not in ("justica", "juiz"):
                    e.append(f"{onde}: pessoas_vistas belongs to the justica and juiz readings only")
            if k == "correcao" and t.get("especie") == "correcao" and not t.get("causa"):
                e.append(f"{onde}: a correcao needs its causa")
    if familia:
        e.extend(erros_de_familia(registo))
    e.extend(erros_de_estado(registo))
    return e


def erros_de_tempo(onde: str, t: dict) -> list[str]:
    """Nothing on a record ends before it begins: in a [[passo]] or [[leitura]], fim is not
    before inicio (docs/ESPEC-PECA.md, edit of 15 November 2026, 11:43 UTC)."""
    inicio, fim = datas.instante_real(str(t.get("inicio", ""))), datas.instante_real(str(t.get("fim", "")))
    if inicio and fim and fim < inicio:
        return [f"{onde}: fim {t.get('fim')} is before inicio {t.get('inicio')}; nothing on a record ends before it begins"]
    return []


def erros_de_familia(registo: dict) -> list[str]:
    """A reading by the family that produced what it read can only raise."""
    produtoras = {p.get("familia") for p in registo.get("passo", []) if isinstance(p, dict)}
    erros = []
    for n, l in enumerate(registo.get("leitura", []), 1):
        if isinstance(l, dict) and l.get("familia") in produtoras and l.get("veredicto") != "levanta":
            erros.append(f"registo [[leitura]] number {n}: a reading by {l.get('familia')}, the family that produced "
                         f"what it read, can only raise (veredicto levanta), not {l.get('veredicto')}")
    return erros


def erros_de_estado(registo: dict) -> list[str]:
    """After publicada, the only states are retirada and publicada again."""
    publicada = False
    for n, est in enumerate(registo.get("estado", []), 1):
        valor = est.get("estado") if isinstance(est, dict) else None
        if publicada and valor == "rascunho":
            return [f"registo [[estado]] number {n}: a piece that was published cannot become a draft again; it can only be withdrawn"]
        publicada = publicada or valor == "publicada"
    return []


def erros(peca: Peca, ficheiro: Path | None = None) -> list[str]:
    e: list[str] = []
    c = peca.cabeca
    _tabela("cabeca", c, {"id": S, "tipo": S, "titulo": S, "entrada": S, "temas": L}, {"encomenda": None}, e)
    pid = str(c.get("id", ""))
    m = ID_PECA.match(pid)
    if not m:
        e.append(f"cabeca: id {pid!r} is not a date and a short lower-case ASCII name")
    elif datas.data_real(pid[:10]) is None:
        e.append(f"cabeca: id {pid!r} does not start with a real date")
    if ficheiro is not None and m:
        if ficheiro.stem != pid:
            e.append(f"the file name {ficheiro.name} is not the id {pid}.md")
        if ficheiro.parent.name != m.group(1):
            e.append(f"the file is in folder {ficheiro.parent.name}, not in the id's year {m.group(1)}")
    if c.get("tipo") not in TIPOS_PECA:
        e.append(f"cabeca: tipo {c.get('tipo')!r} is not diario, artigo or estudo")
    for campo in ("titulo", "entrada"):
        if isinstance(c.get(campo), str) and not c[campo].strip():
            e.append(f"cabeca: {campo} is empty")
    temas = c.get("temas")
    if isinstance(temas, list) and (not temas or not all(isinstance(t, str) and TEMA.match(t) for t in temas)):
        e.append("cabeca: temas must be a non-empty list of lower-case ASCII names")
    enc = c.get("encomenda")
    if not isinstance(enc, dict):
        e.append("cabeca: the table [encomenda] is missing")
    else:
        _tabela("cabeca [encomenda]", enc, {"pergunta": S, "porque_hoje": S, "largar_se": S}, {}, e)
        for k in ("pergunta", "porque_hoje", "largar_se"):
            if isinstance(enc.get(k), str) and not enc[k].strip():
                e.append(f"cabeca [encomenda]: {k} is empty")
        p = enc.get("pergunta")
        if isinstance(p, str) and p.strip() and not p.rstrip().endswith("?"):
            e.append("cabeca [encomenda]: pergunta must end with a question mark")

    e.extend(erros_do_corpo(peca.corpo))
    for onde, texto in (("titulo", c.get("titulo", "")), ("entrada", c.get("entrada", "")), ("corpo", peca.corpo)):
        if not isinstance(texto, str):
            continue
        if _restos_de_referencia(texto):
            e.append(f"{onde}: a brace that is not part of a well-formed reference")
        e.extend(f"{onde}: {x}" for x in erros_do_texto(texto, onde != "corpo"))

    f = peca.folha
    for k in f:
        if k not in ("fonte", "linha", "pessoa"):
            e.append(f"folha: [[{k}]] is not in the specification")
    vistos: set[str] = set()
    for chave in ("fonte", "linha", "pessoa"):
        tabelas = f.get(chave, [])
        if not isinstance(tabelas, list):
            e.append(f"folha: {chave} must be an array of tables [[{chave}]]")
            continue
        for n, t in enumerate(tabelas, 1):
            onde = f"folha [[{chave}]] number {n}"
            tid = t.get("id") if isinstance(t, dict) else None
            if not isinstance(tid, str) or not ID_LINHA.match(tid):
                e.append(f"{onde}: id {tid!r} must be lower-case ASCII letters, digits and _, starting with a letter")
            elif tid in vistos:
                e.append(f"{onde}: id {tid!r} is not unique in the piece")
            else:
                vistos.add(tid)
                onde = f"folha [[{chave}]] {tid}"
            if chave == "fonte":
                _tabela(onde, t, CAMPOS_FONTE, OPCIONAIS_FONTE, e)
                if isinstance(t.get("sha256"), str) and not SHA.match(t["sha256"]):
                    e.append(f"{onde}: sha256 is not 64 lower-case hex characters")
                if isinstance(t.get("url"), str) and not re.match(r"https?://", t["url"]):
                    e.append(f"{onde}: url is not a web address")
                if isinstance(t, dict) and ("pagina" in t) != ("pagina_sha256" in t):
                    e.append(f"{onde}: pagina and pagina_sha256 go together; it has one without the other")
                if isinstance(t.get("pagina_sha256"), str) and not SHA.match(t["pagina_sha256"]):
                    e.append(f"{onde}: pagina_sha256 is not 64 lower-case hex characters")
                if isinstance(t.get("pagina"), str) and not re.match(r"https?://", t["pagina"]):
                    e.append(f"{onde}: pagina is not a web address")
            elif chave == "linha":
                tipo = t.get("tipo") if isinstance(t, dict) else None
                if tipo not in CAMPOS_LINHA:
                    e.append(f"{onde}: tipo {tipo!r} is not valor, derivado, citacao or ato")
                    continue
                _tabela(onde, t, CAMPOS_LINHA[tipo], OPCIONAIS_LINHA[tipo], e)
                if "valor" in CAMPOS_LINHA[tipo] and isinstance(t.get("valor"), str) and not LITERAL.match(t["valor"]):
                    e.append(f"{onde}: valor {t['valor']!r} is not a plain decimal with a dot and no separators")
                if "fonte" in CAMPOS_LINHA[tipo] and t.get("fonte") not in peca.fontes:
                    e.append(f"{onde}: fonte {t.get('fonte')!r} is not a [[fonte]] of this piece")
                if tipo in ("citacao", "ato") and t.get("quem") and t.get("quem") not in peca.pessoas:
                    e.append(f"{onde}: quem {t.get('quem')!r} is not a [[pessoa]] of this piece")
                if tipo == "citacao" and not (t.get("quem") or t.get("entidade")):
                    e.append(f"{onde}: a citacao needs quem or entidade")
                for k in ("excerto", "mostra", "onde", "calculo", "diz"):
                    if k in CAMPOS_LINHA[tipo] and isinstance(t.get(k), str) and not t[k].strip():
                        e.append(f"{onde}: {k} is empty")
            else:
                _tabela(onde, t, CAMPOS_PESSOA, {}, e)
                for lid in t.get("linhas", []) if isinstance(t, dict) and isinstance(t.get("linhas"), list) else []:
                    if lid not in peca.linhas:
                        e.append(f"{onde}: linhas names {lid!r}, which is not a [[linha]] of this piece")

    e.extend(erros_do_registo(peca.registo))
    return e
