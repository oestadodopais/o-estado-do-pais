"""The piece file: its four sections, its two fingerprints, its references.

The contract is docs/ESPEC-PECA.md. This module reads a file and never writes one;
`registo.py` appends to the record.

Two readings of the specification that are this module's own, stated here so a
reader can dispute them:

* The fact sheet's fingerprint covers the bytes AFTER the line `+++ folha` and up
  to (not including) the line `+++ registo`. The marker line itself is not part of
  "the folha section"; it is the same for every piece.
* The piece's fingerprint covers every byte from the first up to (not including)
  the line `+++ registo`, which includes the line end of the last line before it.
"""
from __future__ import annotations

import hashlib
import re
import tomllib
from dataclasses import dataclass, field
from pathlib import Path

MARCAS = ("+++ cabeca", "+++ corpo", "+++ folha", "+++ registo")
ID_PECA = re.compile(r"(\d{4})-(\d{2})-(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\Z")
ID_LINHA = re.compile(r"[a-z][a-z0-9_]*\Z")

# `[words]{id}` or `[words]{id1, id2}`; then `{id}`.
_ID = r"[a-z][a-z0-9_]*"
REF_LIGADA = re.compile(r"\[([^\[\]{}\n]+)\]\{\s*(" + _ID + r"(?:\s*,\s*" + _ID + r")*)\s*\}")
REF_SIMPLES = re.compile(r"\{(" + _ID + r")\}")


class ErroDeForma(Exception):
    """The file cannot be read as a piece at all (check 9)."""


@dataclass
class Peca:
    caminho: Path
    bruto: bytes
    cabeca: dict
    corpo: str
    folha: dict
    registo: dict
    impressao: str  # the piece's fingerprint
    impressao_folha: str  # the fact sheet's fingerprint
    linhas: dict = field(default_factory=dict)  # id -> [[linha]] table
    fontes: dict = field(default_factory=dict)  # id -> [[fonte]] table
    pessoas: dict = field(default_factory=dict)  # id -> [[pessoa]] table

    @property
    def id(self) -> str:
        return str(self.cabeca.get("id", ""))

    @property
    def estado(self) -> str:
        """The last [[estado]]; with none, a draft."""
        estados = self.registo.get("estado", [])
        return str(estados[-1].get("estado")) if estados else "rascunho"

    @property
    def publicada(self) -> bool:
        return self.estado == "publicada"

    def ultimo_estado(self) -> dict | None:
        estados = self.registo.get("estado", [])
        return estados[-1] if estados else None


def _posicao_da_linha(bruto: bytes, marca: str) -> int:
    """Byte offset of the line that is exactly `marca`, or -1."""
    alvo = marca.encode()
    inicio = 0
    while True:
        p = bruto.find(alvo, inicio)
        if p < 0:
            return -1
        antes_ok = p == 0 or bruto[p - 1 : p] == b"\n"
        fim = p + len(alvo)
        depois_ok = fim == len(bruto) or bruto[fim : fim + 1] == b"\n"
        if antes_ok and depois_ok:
            return p
        inicio = p + 1


def secoes(bruto: bytes) -> dict[str, bytes]:
    """Split the bytes into the four sections, or raise ErroDeForma."""
    if b"\r" in bruto:
        raise ErroDeForma("the file has a CR byte; line ends must be LF")
    try:
        texto = bruto.decode("utf-8")
    except UnicodeDecodeError as e:
        raise ErroDeForma(f"the file is not UTF-8 ({e.reason} at byte {e.start})") from None
    linhas = texto.split("\n")
    contagem = {m: sum(1 for l in linhas if l == m) for m in MARCAS}
    for m, n in contagem.items():
        if n != 1:
            raise ErroDeForma(f"the line '{m}' appears {n} times; it must appear exactly once")
    posicoes = [_posicao_da_linha(bruto, m) for m in MARCAS]
    if posicoes != sorted(posicoes):
        raise ErroDeForma("the four section lines are not in the order cabeca, corpo, folha, registo")
    if posicoes[0] != 0:
        raise ErroDeForma("the file must open with the line '+++ cabeca'")
    partes = {}
    nomes = ("cabeca", "corpo", "folha", "registo")
    for i, nome in enumerate(nomes):
        inicio = posicoes[i] + len(MARCAS[i]) + 1
        fim = posicoes[i + 1] if i + 1 < len(posicoes) else len(bruto)
        partes[nome] = bruto[min(inicio, fim) : fim]
    partes["_ate_registo"] = bruto[: posicoes[3]]
    return partes


def impressoes(bruto: bytes) -> tuple[str, str]:
    """(piece fingerprint, fact sheet fingerprint)."""
    p = secoes(bruto)
    return (hashlib.sha256(p["_ate_registo"]).hexdigest(), hashlib.sha256(p["folha"]).hexdigest())


def _toml(nome: str, dados: bytes) -> dict:
    try:
        return tomllib.loads(dados.decode("utf-8"))
    except tomllib.TOMLDecodeError as e:
        raise ErroDeForma(f"section {nome} is not valid TOML: {e}") from None


def ler(caminho: Path) -> Peca:
    bruto = Path(caminho).read_bytes()
    return ler_bytes(bruto, Path(caminho))


def ler_bytes(bruto: bytes, caminho: Path) -> Peca:
    p = secoes(bruto)
    cabeca = _toml("cabeca", p["cabeca"])
    folha = _toml("folha", p["folha"])
    registo = _toml("registo", p["registo"])
    corpo = p["corpo"].decode("utf-8")
    peca = Peca(
        caminho=caminho,
        bruto=bruto,
        cabeca=cabeca,
        corpo=corpo,
        folha=folha,
        registo=registo,
        impressao=hashlib.sha256(p["_ate_registo"]).hexdigest(),
        impressao_folha=hashlib.sha256(p["folha"]).hexdigest(),
    )
    for chave, destino in (("linha", peca.linhas), ("fonte", peca.fontes), ("pessoa", peca.pessoas)):
        tabelas = folha.get(chave, [])
        if isinstance(tabelas, list):
            for t in tabelas:
                if isinstance(t, dict) and isinstance(t.get("id"), str) and t["id"] not in destino:
                    destino[t["id"]] = t
    return peca


# --------------------------------------------------------------------------- references


@dataclass
class Referencia:
    forma: str  # "simples" ({id}) or "ligada" ([words]{ids})
    ids: list[str]
    palavras: str  # the tied words; "" for {id}
    inicio: int
    fim: int


def referencias(texto: str) -> list[Referencia]:
    """Every reference in a text, in order."""
    achadas = []
    ocupado = []
    for m in REF_LIGADA.finditer(texto):
        ids = [i.strip() for i in m.group(2).split(",")]
        achadas.append(Referencia("ligada", ids, m.group(1), m.start(), m.end()))
        ocupado.append((m.start(), m.end()))
    for m in REF_SIMPLES.finditer(texto):
        if any(a <= m.start() < b for a, b in ocupado):
            continue
        achadas.append(Referencia("simples", [m.group(1)], "", m.start(), m.end()))
    return sorted(achadas, key=lambda r: r.inicio)


def sem_referencias(texto: str) -> str:
    """The text with every reference taken out (words tied to a line included)."""
    partes, pos = [], 0
    for r in referencias(texto):
        partes.append(texto[pos : r.inicio])
        pos = r.fim
    partes.append(texto[pos:])
    return "".join(partes)


def textos_do_leitor(peca: Peca) -> list[tuple[str, str]]:
    """(where, text) for every field a reader sees that may hold references."""
    return [
        ("titulo", str(peca.cabeca.get("titulo", ""))),
        ("entrada", str(peca.cabeca.get("entrada", ""))),
        ("corpo", peca.corpo),
    ]


def ordem_de_uso(peca: Peca) -> list[str]:
    """Line ids in order of first use in titulo, entrada and corpo."""
    vistos: list[str] = []
    for _, texto in textos_do_leitor(peca):
        for r in referencias(texto):
            for i in r.ids:
                if i not in vistos:
                    vistos.append(i)
    return vistos


def paragrafos(texto: str) -> list[str]:
    """Blocks separated by blank lines."""
    return [b for b in re.split(r"\n\s*\n", texto) if b.strip()]


def seccao_do_corpo(corpo: str, titulo: str) -> str:
    """The text under a `## titulo` heading, up to the next ## heading or the end."""
    linhas = corpo.split("\n")
    dentro, guardadas = False, []
    for l in linhas:
        if l.startswith("## "):
            if dentro:
                break
            dentro = l[3:].strip() == titulo
            continue
        if dentro:
            guardadas.append(l)
    return "\n".join(guardadas).strip()


def pecas_em(raiz: Path) -> list[Path]:
    pasta = Path(raiz) / "pecas"
    return sorted(pasta.glob("*/*.md")) if pasta.is_dir() else []
