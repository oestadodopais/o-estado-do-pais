"""The ten checks of docs/ESPEC-PECA.md, one function each.

Every check returns Resultados: passed, failed with the reason, not run here with
the reason, or not binding (checks 4, 5 and 7 on a piece that is not published).
`conferir` exits 0 only if nothing failed. A check that had to run and could not
(check 2 on a published piece with no store) is a failure, not a skip.
"""
from __future__ import annotations

import hashlib
import os
import re
import subprocess
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path

from . import datas, derivacoes, fontes, forma, numeros, privacidade
from .peca import ErroDeForma, Peca, ler, paragrafos, referencias, sem_referencias, textos_do_leitor

PASSOU, FALHOU, NAO_CORRIDO, NAO_VINCULA = "passed", "failed", "not run here", "not binding"
NOMES = {
    1: "every figure resolves",
    2: "every excerpt is in its stored source",
    3: "every derived figure recomputes",
    4: "the published text is the judged text",
    5: "verified and judged by the other family",
    6: "dates and weekdays",
    7: "people",
    8: "nothing private",
    9: "the site builds",
    10: "live is built",
}


@dataclass
class Resultado:
    verificacao: int
    alvo: str
    estado: str
    razoes: list[str]
    notas: list[str]

    def linha(self) -> str:
        cabeca = f"check {self.verificacao:>2} ({NOMES[self.verificacao]}) · {self.alvo}: {self.estado}"
        partes = self.razoes if self.estado != PASSOU else []
        texto = cabeca + ("" if not partes else ": " + " | ".join(partes))
        if self.notas:
            texto += " [" + " | ".join(self.notas) + "]"
        return texto


def _r(n, alvo, razoes, notas=None, estado=None):
    return Resultado(n, alvo, estado or (FALHOU if razoes else PASSOU), list(razoes), list(notas or []))


def _vinculo(n, peca: Peca, razoes, notas=None):
    """Checks 4, 5 and 7 bind a published piece; on a draft they only report."""
    if peca.publicada:
        return _r(n, peca.id, razoes, notas)
    aviso = [f"the piece is {peca.estado}, so this check does not bind yet"]
    if razoes:
        aviso.append("would fail once published: " + "; ".join(razoes))
    return Resultado(n, peca.id, NAO_VINCULA, [], aviso + list(notas or []))


# --------------------------------------------------------------------------- 1


def check1(peca: Peca) -> Resultado:
    razoes, notas = [], []
    for onde, texto in textos_do_leitor(peca):
        for ref in referencias(texto):
            for i in ref.ids:
                if i not in peca.linhas:
                    razoes.append(f"{onde}: the reference {{{i}}} names no line of the fact sheet")
                elif ref.forma == "simples" and peca.linhas[i].get("tipo") not in ("valor", "derivado", "citacao"):
                    razoes.append(f"{onde}: {{{i}}} prints a line of tipo {peca.linhas[i].get('tipo')}, which has nothing to print")
        resto = sem_referencias(texto)
        m = re.search(r"\d", resto)
        if m:
            inicio = max(0, m.start() - 20)
            razoes.append(f"{onde}: a digit outside any reference (the digits rule): '…{resto[inicio:m.start() + 10]}…'")
    for lid, l in peca.linhas.items():
        if l.get("tipo") not in ("valor", "derivado"):
            continue
        mostra = str(l.get("mostra", ""))
        livre = l.get("mostra_livre") is True
        if not re.search(r"\d", mostra):
            if livre:
                notas.append(f"{lid}: not compared, left to the numbers editor")
            else:
                razoes.append(f"{lid}: mostra {mostra!r} has no digit and the line is not marked mostra_livre")
            continue
        if livre:
            razoes.append(f"{lid}: mostra_livre is set but mostra {mostra!r} has a digit")
            continue
        try:
            valor = derivacoes.numero(str(l.get("valor", "")))
            figura, casas, escala_m = numeros.ler_mostra(mostra)
        except (derivacoes.ErroDeConta, numeros.ErroDeFigura) as e:
            razoes.append(f"{lid}: {e}")
            continue
        escala_u = numeros.escala_da_unidade(str(l.get("unidade", "")))
        quer = numeros.esperado(valor, escala_u, escala_m, casas)
        if figura != quer:
            razoes.append(
                f"{lid}: mostra {mostra!r} shows {figura}, but valor {l.get('valor')} in "
                f"{l.get('unidade')!r} at the precision shown is {quer}"
            )
    return _r(1, peca.id, razoes, notas)


# --------------------------------------------------------------------------- 2


def check2(peca: Peca, loja: Path | None) -> Resultado:
    if loja is None or not Path(loja).is_dir():
        porque = "OEDP_FONTES is not set" if loja is None else f"the store {loja} does not exist here"
        if peca.publicada:
            return _r(2, peca.id, [f"{porque}, and a published piece must be checked against its sources"])
        return Resultado(2, peca.id, NAO_CORRIDO, [porque], [])
    razoes, notas, em_falta = [], [], []
    textos: dict[str, list[str]] = {}
    for fid, f in peca.fontes.items():
        try:
            caminho = fontes.caminho_da_copia(loja, str(f.get("sha256", "")))
        except fontes.ErroDaLoja as e:
            razoes.append(f"fonte {fid}: {e}")
            continue
        if not caminho.is_file():
            em_falta.append(f"fonte {fid}: no copy in the store under {f.get('sha256')}")
            continue
        dados = caminho.read_bytes()
        real = hashlib.sha256(dados).hexdigest()
        if real != f.get("sha256"):
            razoes.append(f"fonte {fid}: the stored copy hashes to {real}, not to its name {f.get('sha256')}")
            continue
        if len(dados) != f.get("bytes"):
            razoes.append(f"fonte {fid}: the copy has {len(dados)} bytes, the table says {f.get('bytes')}")
        textos[fid] = fontes.texto_por_pagina(dados)
    for lid, l in peca.linhas.items():
        fid = l.get("fonte")
        if l.get("tipo") not in ("valor", "citacao", "ato") or fid not in textos:
            continue
        paginas = textos[fid]
        m = re.search(r"\bp\.\s*(\d+)", str(l.get("onde", "")))
        pedida = int(m.group(1)) if m else None
        achada = fontes.procurar(str(l.get("excerto", "")), paginas, pedida)
        if achada is None:
            razoes.append(f"{lid}: the excerpt is not in the text of the stored copy of {fid}")
            continue
        if pedida and achada != pedida:
            notas.append(f"{lid}: found on p. {achada}, not on p. {pedida} named in onde")
        elif len(paginas) > 1:
            notas.append(f"{lid}: found on p. {achada}")
        if l.get("tipo") == "valor" and not numeros.contem_figura(fontes.normalizar(str(l.get("excerto", ""))), str(l.get("valor", ""))):
            razoes.append(f"{lid}: the excerpt does not hold valor {l.get('valor')} as a source would print it")
    if em_falta:
        if peca.publicada:
            razoes.extend(em_falta)
        elif not razoes:
            return Resultado(2, peca.id, NAO_CORRIDO, em_falta, notas)
        else:
            notas.extend(em_falta)
    return _r(2, peca.id, razoes, notas)


# --------------------------------------------------------------------------- 3


def check3(peca: Peca) -> Resultado:
    valores = {lid: str(l.get("valor")) for lid, l in peca.linhas.items() if l.get("tipo") in ("valor", "derivado")}
    razoes, contadas = [], 0
    for lid, l in peca.linhas.items():
        if l.get("tipo") != "derivado":
            continue
        try:
            obtido = derivacoes.avaliar(str(l.get("calculo", "")), valores, proprio=lid)
            querido = derivacoes.numero(str(l.get("valor", "")))
        except derivacoes.ErroDeConta as e:
            razoes.append(f"{lid}: {e}")
            continue
        if obtido != querido:
            razoes.append(f"{lid}: calculo gives {derivacoes.canonica(obtido)}, valor is {derivacoes.canonica(querido)}")
        contadas += 1
    return _r(3, peca.id, razoes, [f"{contadas} recomputed"])


# --------------------------------------------------------------------------- 4 and 5


def _passos(peca):
    return peca.registo.get("passo", [])


def _leituras(peca, lugar):
    return [l for l in peca.registo.get("leitura", []) if l.get("lugar") == lugar]


def check4(peca: Peca, pagina: str | None) -> Resultado:
    razoes = []
    passadas = [l for l in _leituras(peca, "juiz") if l.get("veredicto") == "passa"]
    if not passadas:
        razoes.append("there is no passing juiz reading")
    elif passadas[-1].get("impressao") != peca.impressao:
        razoes.append(f"the piece's fingerprint {peca.impressao} is not the {passadas[-1].get('impressao')} of its last passing juiz reading")
    if pagina is None:
        razoes.append("the piece page could not be built")
    else:
        m = re.search(r'<meta name="impressao" content="([0-9a-f]{64})">', pagina)
        if not m:
            razoes.append("the built page carries no fingerprint")
        elif m.group(1) != peca.impressao:
            razoes.append(f"the built page carries {m.group(1)}, not {peca.impressao}")
    return _vinculo(4, peca, razoes)


def _uma_leitura(peca, lugar, impressao, familias_produtoras, nome_do_que_le) -> list[str]:
    razoes = []
    sobre = [l for l in _leituras(peca, lugar) if l.get("impressao") == impressao]
    if not sobre:
        return [f"no {lugar} reading on the current {nome_do_que_le} ({impressao[:12]}…)"]
    l = sobre[-1]
    if l.get("veredicto") != "passa":
        razoes.append(f"the last {lugar} reading on the current {nome_do_que_le} says {l.get('veredicto')}")
    if l.get("familia") in familias_produtoras:
        razoes.append(f"the {lugar} reading is by {l.get('familia')}, the family that produced what it read")
    if not isinstance(l.get("plantas_postas"), int) or l.get("plantas_postas", 0) < 1:
        razoes.append(f"the {lugar} reading had no planted error")
    elif l.get("plantas_apanhadas") != l.get("plantas_postas"):
        razoes.append(f"the {lugar} reading caught {l.get('plantas_apanhadas')} of {l.get('plantas_postas')} planted errors")
    return razoes


def familias(peca, nomes) -> set[str]:
    return {p.get("familia") for p in _passos(peca) if p.get("nome") in nomes}


def check5(peca: Peca) -> Resultado:
    razoes = []
    da_folha = familias(peca, {"reportagem"})
    do_texto = familias(peca, {"encomenda", "nota", "reportagem", "escrita", "edicao"})
    if not da_folha:
        razoes.append("no reportagem step is on record, so the family that made the fact sheet is unknown")
    if not familias(peca, {"escrita"}):
        razoes.append("no escrita step is on record, so the family that wrote the text is unknown")
    razoes += _uma_leitura(peca, "numeros", peca.impressao_folha, da_folha, "fact sheet")
    razoes += _uma_leitura(peca, "juiz", peca.impressao, do_texto, "piece")
    return _vinculo(5, peca, razoes)


# --------------------------------------------------------------------------- 6


def _campos_de_data(t: dict, onde: str):
    for k, v in t.items():
        if k in forma.CAMPOS_INSTANTE:
            yield onde, k, v, "instante"
        elif k in forma.CAMPOS_DATA:
            yield onde, k, v, "data"


def check6(peca: Peca) -> Resultado:
    razoes = []
    try:
        ano = int(peca.id[:4])
    except ValueError:
        return _r(6, peca.id or "?", ["the id has no year to read dates against"])
    textos = [(o, t) for o, t in textos_do_leitor(peca)]
    enc = peca.cabeca.get("encomenda")
    if isinstance(enc, dict):
        textos += [(f"encomenda.{k}", v) for k, v in enc.items() if isinstance(v, str)]
    for lid, l in peca.linhas.items():
        textos += [(f"{lid}.{k}", v) for k, v in l.items() if isinstance(v, str) and k != "excerto"]
    for onde, texto in textos:
        for erro in datas.dias_errados(str(texto), ano):
            razoes.append(f"{onde}: {erro}")
    tabelas = [(f"fonte {k}", v) for k, v in peca.fontes.items()] + [(f"linha {k}", v) for k, v in peca.linhas.items()]
    for chave, lista in peca.registo.items():
        if isinstance(lista, list):
            tabelas += [(f"registo [[{chave}]] number {n}", t) for n, t in enumerate(lista, 1) if isinstance(t, dict)]
    for onde, t in tabelas:
        for o, k, v, tipo in _campos_de_data(t, onde):
            if k == "publicado_em" and v == "":
                continue
            ok = datas.instante_real(v) if tipo == "instante" else datas.data_real(v)
            if ok is None:
                forma_pedida = "YYYY-MM-DDTHH:MM:SSZ" if tipo == "instante" else "YYYY-MM-DD"
                razoes.append(f"{o}: {k} {v!r} is not a real date in the form {forma_pedida}")
    return _r(6, peca.id, razoes)


# --------------------------------------------------------------------------- 7


def check7(peca: Peca) -> Resultado:
    razoes = []
    for pid, p in peca.pessoas.items():
        com_fonte = [
            lid for lid in p.get("linhas", [])
            if lid in peca.linhas and peca.linhas[lid].get("tipo") in ("citacao", "ato")
            and peca.linhas[lid].get("fonte") in peca.fontes and peca.linhas[lid].get("quem") == pid
        ]
        if not com_fonte:
            razoes.append(f"{pid}: no citacao or ato line with a source names this person")
        nomes = [n for n in (p.get("nome"), p.get("nome_curto")) if isinstance(n, str) and n.strip()]
        for onde, texto in textos_do_leitor(peca):
            for bloco in paragrafos(texto):
                if not any(n in bloco for n in nomes):
                    continue
                ids = {i for r in referencias(bloco) for i in r.ids}
                if not ids & set(p.get("linhas", [])):
                    inicio = bloco.strip()[:50]
                    razoes.append(f"{pid}: a paragraph of {onde} prints the name and references none of the person's lines ('{inicio}…')")
    declarados = set(peca.pessoas)
    do_texto = familias(peca, {"encomenda", "nota", "reportagem", "escrita", "edicao"})
    for lugar in ("justica", "juiz"):
        sobre = [l for l in _leituras(peca, lugar) if l.get("impressao") == peca.impressao]
        if lugar == "justica" and declarados:
            if not sobre:
                razoes.append("people are declared and there is no justica reading on the current piece")
                continue
            ultima = sobre[-1]
            if ultima.get("veredicto") != "passa":
                razoes.append(f"the last justica reading on the current piece says {ultima.get('veredicto')}")
            if ultima.get("familia") in do_texto:
                razoes.append(f"the justica reading is by {ultima.get('familia')}, the family that produced the text")
        for l in sobre[-1:]:
            vistas = set()
            for v in l.get("pessoas_vistas", []):
                quem = {pid for pid, p in peca.pessoas.items() if v in (pid, p.get("nome"))}
                if not quem:
                    razoes.append(f"the {lugar} reader saw {v!r}, who is not a declared [[pessoa]]")
                vistas |= quem
            if vistas != declarados:
                faltam = ", ".join(sorted(declarados - vistas)) or "none"
                razoes.append(f"the {lugar} reader's pessoas_vistas do not equal the declared people (not seen: {faltam})")
    return _vinculo(7, peca, razoes)


# --------------------------------------------------------------------------- 8


def check8_peca(peca: Peca) -> Resultado:
    r = privacidade.conferir([(peca.caminho.name, peca.bruto)])
    razoes = list(r.razoes) + ([r.falha_da_lista] if r.falha_da_lista else [])
    return _r(8, peca.id, razoes, [r.nota] if r.nota else [])


def ficheiros_seguidos(repo: Path) -> list[tuple[str, bytes]]:
    nomes = subprocess.run(["git", "-C", str(repo), "ls-files", "-z"], check=True, capture_output=True).stdout
    lista = []
    for nome in nomes.decode().split("\0"):
        if nome:
            p = Path(repo) / nome
            if p.is_file():
                lista.append((nome, p.read_bytes()))
    return lista


def check8_arvore(repo: Path, ambiente: dict | None = None) -> Resultado:
    try:
        ficheiros = ficheiros_seguidos(repo)
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        return _r(8, "tracked files", [f"git could not list the tracked files ({e})"])
    r = privacidade.conferir(ficheiros, ambiente)
    razoes = list(r.razoes) + ([r.falha_da_lista] if r.falha_da_lista else [])
    return _r(8, "tracked files", razoes, [f"{r.vistos} files read"] + ([r.nota] if r.nota else []))


# --------------------------------------------------------------------------- 9


def check9_peca(peca: Peca, pagina_ou_erro) -> Resultado:
    razoes = forma.erros(peca, peca.caminho)
    if isinstance(pagina_ou_erro, Exception):
        razoes.append(f"the piece page does not build: {pagina_ou_erro}")
    return _r(9, peca.id, razoes)


def check9_vercel(repo: Path) -> list[str]:
    import json

    p = Path(repo) / "vercel.json"
    if not p.is_file():
        return ["vercel.json is missing, so a push could publish by itself"]
    try:
        dados = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"vercel.json is not JSON ({e})"]
    git = dados.get("git", {}) if isinstance(dados, dict) else {}
    ativo = git.get("deploymentEnabled") if isinstance(git, dict) else None
    if ativo != {"main": False, "*": False}:
        return ['vercel.json must say "git": {"deploymentEnabled": {"main": false, "*": false}}, and says otherwise']
    return []


# --------------------------------------------------------------------------- one piece, all checks


def conferir_peca(caminho: Path, contexto, loja: Path | None) -> list[Resultado]:
    """Every check for one piece file. `contexto` is the site context for rendering."""
    from . import paginas

    caminho = Path(caminho)
    try:
        peca = ler(caminho)
    except (ErroDeForma, OSError) as e:
        alvo = caminho.stem
        r = [_r(9, alvo, [str(e)])]
        if isinstance(e, ErroDeForma):
            dados = caminho.read_bytes()
            p8 = privacidade.conferir([(caminho.name, dados)])
            r.append(_r(8, alvo, p8.razoes + ([p8.falha_da_lista] if p8.falha_da_lista else []), [p8.nota] if p8.nota else []))
        return r
    try:
        pagina = paginas.pagina_da_peca(peca, contexto)
    except Exception as e:  # the page failing to build is check 9's finding
        pagina = e
    resultados = [
        check1(peca),
        check2(peca, loja),
        check3(peca),
        check4(peca, None if isinstance(pagina, Exception) else pagina),
        check5(peca),
        check6(peca),
        check7(peca),
        check8_peca(peca),
        check9_peca(peca, pagina),
    ]
    return resultados
