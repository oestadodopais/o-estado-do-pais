"""Check 8: nothing private in any tracked file, piece or built page.

What it refuses:
* a machine path, `/Users/<name>` or `/home/<name>` at the start of a path (a web
  address such as `example.org/home/x` is not a machine path);
* an e-mail address other than the project's corrections address and the commit
  attribution address;
* a token or private-key pattern;
* the home folder's name of the machine that runs it, when it is long enough to be
  a person's and is not a generic account (the old tree's rule);
* every string of the environment variable PRIVACIDADE_PROIBIDOS, in the old
  tree's format: one string per line (LF), ends trimmed, inner spaces collapsed,
  NFC, at least four characters, not one of the project's own public names.

Where PRIVACIDADE_PROIBIDOS is absent the result says so in words. On GitHub
(GITHUB_ACTIONS set) its absence is a failure, as it was in the old tree: the
repository secret exists, and a run that cannot read it has not checked.

Patterns that would match themselves are built from parts, so this file passes.
"""
from __future__ import annotations

import html
import os
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path

PERMITIDOS = {"correcoes" + "@" + "oestadodopais.pt", "noreply" + "@" + "anthropic.com"}
IDENTIDADES_DO_PROJETO = {"o estado do país", "oestadodopais", "o financiador", "corredor diário"}
CONTAS_GENERICAS = {"runner", "root", "ubuntu", "vagrant", "admin", "user", "app", "code"}

CAMINHO = re.compile(r"(?<![A-Za-z0-9.\-_])/(?:" + "Users" + "|" + "home" + r")/(?P<nome>[A-Za-z0-9._-]+)")
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+" + "@" + r"[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?![A-Za-z0-9-])")
SEGREDOS = [
    ("private key", re.compile("-----" + "BEGIN" + r" (?:[A-Z0-9]+ )*PRIVATE KEY-----")),
    ("GitHub token", re.compile(r"\b" + "gh" + r"[pousr]_[A-Za-z0-9]{30,}")),
    ("GitHub token", re.compile(r"\b" + "github" + r"_pat_[A-Za-z0-9_]{30,}")),
    ("AWS key", re.compile(r"\b" + "AK" + r"IA[0-9A-Z]{16}\b")),
    ("API key", re.compile(r"\b" + "sk" + r"-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}")),
    ("Slack token", re.compile(r"\b" + "xox" + r"[abprs]-[A-Za-z0-9-]{10,}")),
    ("Google key", re.compile(r"\b" + "AI" + r"za[0-9A-Za-z_-]{35}")),
    ("Supabase secret", re.compile(r"\b" + "sb_" + r"secret_[A-Za-z0-9_-]+")),
]


class ErroDaLista(Exception):
    pass


def em_ci() -> bool:
    return "GITHUB_ACTIONS" in os.environ


def lista_proibida(valor: str | None) -> list[str]:
    """Parse PRIVACIDADE_PROIBIDOS in the old tree's format."""
    cadeias = []
    for n, texto in enumerate((valor or "").split("\n"), 1):
        texto = re.sub(r"^[\s﻿]+|[\s﻿]+$", "", texto)
        if any(unicodedata.category(c) in {"Cc", "Cf", "Zl", "Zp"} and c != "\t" for c in texto):
            raise ErroDaLista(f"PRIVACIDADE_PROIBIDOS: line {n} is invalid (separator or control character inside)")
        texto = re.sub(r" +", " ", "".join(" " if c == "\t" or unicodedata.category(c) == "Zs" else c for c in texto))
        texto = unicodedata.normalize("NFC", texto)
        if not texto:
            continue
        if len(texto) < 4 or texto.casefold() in IDENTIDADES_DO_PROJETO:
            raise ErroDaLista(f"PRIVACIDADE_PROIBIDOS: line {n} is invalid (too short, or one of the project's own names)")
        cadeias.append(texto)
    return cadeias


def nome_da_casa() -> str:
    nome = Path.home().name
    if len(nome) >= 6 and nome.casefold() not in CONTAS_GENERICAS | IDENTIDADES_DO_PROJETO:
        return nome
    return ""


def _comparavel(texto: str) -> str:
    texto = html.unescape(texto)
    texto = unicodedata.normalize("NFC", texto)
    texto = re.sub(r"\s+", " ", texto)
    return texto.casefold()


def _cadeias(valor) -> list[str]:
    if isinstance(valor, str):
        return [valor]
    if isinstance(valor, dict):
        return [c for k, v in valor.items() for c in [str(k)] + _cadeias(v)]
    if isinstance(valor, list):
        return [c for v in valor for c in _cadeias(v)]
    return []


def valores_toml(texto: str) -> str:
    """The strings a TOML file, or each TOML section of a piece or page, means once parsed,
    so that an escape such as \\u0040 is seen as the character it is."""
    import tomllib

    pedacos = [texto] if not re.search(r"^\+\+\+ ", texto, re.M) else re.split(r"^\+\+\+ [a-z]+\n", texto, flags=re.M)
    cadeias = []
    for pedaco in pedacos:
        try:
            cadeias += _cadeias(tomllib.loads(pedaco))
        except (tomllib.TOMLDecodeError, ValueError):
            continue
    return "\n".join(cadeias)


def achados_em(nome: str, dados: bytes, proibidas: list[str]) -> list[str]:
    """Reasons this file fails check 8. The forbidden strings themselves are never printed.

    HTML entities, named and numbered, are decoded first (`&commat;` is an `@`), and the
    raw text is searched too, so neither form hides from the other."""
    bruto = dados.decode("utf-8", errors="replace")
    texto = bruto + "\n" + html.unescape(bruto)
    if nome.endswith((".toml", ".md")):
        texto += "\n" + valores_toml(bruto)
    razoes = []
    for m in CAMINHO.finditer(texto):
        if m["nome"].casefold() not in CONTAS_GENERICAS:
            razoes.append(f"{nome}: a machine path at character {m.start()}")
            break
    for m in EMAIL.finditer(texto):
        if m.group(0).lower() not in PERMITIDOS:
            razoes.append(f"{nome}: an e-mail address other than the two allowed, at character {m.start()}")
            break
    for rotulo, padrao in SEGREDOS:
        m = padrao.search(texto)
        if m:
            razoes.append(f"{nome}: a {rotulo} pattern at character {m.start()}")
    comparavel = _comparavel(texto)
    for i, cadeia in enumerate(proibidas, 1):
        if _comparavel(cadeia) in comparavel:
            razoes.append(f"{nome}: holds forbidden string number {i}")
    casa = nome_da_casa()
    if casa and _comparavel(casa) in comparavel:
        razoes.append(f"{nome}: holds this machine's user name")
    return razoes


@dataclass
class Resultado:
    vistos: int = 0
    razoes: list[str] = field(default_factory=list)
    nota: str = ""
    falha_da_lista: str = ""

    @property
    def passou(self) -> bool:
        return not self.razoes and not self.falha_da_lista


def conferir(ficheiros, ambiente: dict | None = None) -> Resultado:
    """`ficheiros` is an iterable of (name, bytes)."""
    amb = os.environ if ambiente is None else ambiente
    r = Resultado()
    valor = amb.get("PRIVACIDADE_PROIBIDOS")
    try:
        proibidas = lista_proibida(valor)
    except ErroDaLista as e:
        r.falha_da_lista = str(e)
        proibidas = []
    if not proibidas and not r.falha_da_lista:
        if "GITHUB_ACTIONS" in amb:
            r.falha_da_lista = "list of forbidden strings not available here, and on GitHub it must be: the secret PRIVACIDADE_PROIBIDOS is absent or empty"
        else:
            r.nota = "list of forbidden strings not available here"
    for nome, dados in ficheiros:
        r.vistos += 1
        r.razoes.extend(achados_em(nome, dados, proibidas))
    if r.vistos == 0:
        r.falha_da_lista = r.falha_da_lista or "no file was read, so nothing was checked"
    return r
