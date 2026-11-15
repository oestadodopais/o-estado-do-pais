"""python3 -m oedp <command>: see README.md."""
from __future__ import annotations

import argparse
import sys
import time
import unittest
from pathlib import Path

from . import conferir as conf
from . import construir as build
from . import datas, fontes, forma, noar, registo
from . import direitos as rights
from .forma import FECHO
from .peca import ID_PECA, ErroDeForma, impressoes, ler, pecas_em

REPO = Path(__file__).resolve().parent.parent

MODELO = """+++ cabeca
id = "{id}"
tipo = "{tipo}"
titulo = ""
entrada = ""
temas = []

[encomenda]
pergunta = ""
porque_hoje = ""
largar_se = ""
+++ corpo
""" + "".join("\n## " + t + "\n" for t in FECHO).replace("{", "{{").replace("}", "}}") + """
+++ folha
+++ registo
"""


def cmd_nova(a) -> int:
    m = ID_PECA.match(a.id)
    if not m or datas.data_real(a.id[:10]) is None:
        print(f"refused: {a.id!r} is not a date and a short lower-case ASCII name", file=sys.stderr)
        return 2
    destino = REPO / "pecas" / m.group(1) / f"{a.id}.md"
    if destino.exists():
        print(f"refused: {destino.relative_to(REPO)} exists", file=sys.stderr)
        return 2
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(MODELO.format(id=a.id, tipo=a.tipo), encoding="utf-8")
    print(destino.relative_to(REPO))
    return 0


class Recusa(Exception):
    pass


def _loja() -> Path | None:
    """OEDP_FONTES, refused with the reason when it lies inside the repository."""
    try:
        return fontes.loja()
    except fontes.ErroDaLoja as e:
        raise Recusa(str(e)) from None


def _loja_ou_falha():
    raiz = _loja()
    if raiz is None:
        print("refused: OEDP_FONTES is not set; it names the private store of sources", file=sys.stderr)
    return raiz


def cmd_fonte(a) -> int:
    raiz = _loja_ou_falha()
    if raiz is None:
        return 2
    pasta = Path(a.direitos) if a.direitos else REPO / "direitos"
    direitos_de = None if a.termos else rights.para_buscar(pasta)
    avisos: list[str] = []
    if a.pagina and a.termos:
        print("refused: --pagina goes with a source, not with --termos", file=sys.stderr)
        return 2
    try:
        tabela = fontes.buscar(a.url, raiz, direitos_de=direitos_de, termos=a.termos, pequeno=a.pequeno, avisos=avisos)
        if a.pagina:
            # The publisher's own page for the document, fetched and stored under the same
            # rules as the source; the table names the address it was finally read at.
            tabela = fontes.com_pagina(tabela, a.pagina, raiz, direitos_de=direitos_de, avisos=avisos)
        for x in avisos:
            print(x, file=sys.stderr)
        print(tabela, end="")
    except fontes.ErroDaLoja as e:
        for x in avisos:
            print(x, file=sys.stderr)
        print(str(e), file=sys.stderr)
        return 1
    return 0


def cmd_texto(a) -> int:
    raiz = _loja_ou_falha()
    if raiz is None:
        return 2
    try:
        caminho = fontes.caminho_da_copia(raiz, a.sha256)
    except fontes.ErroDaLoja as e:
        print(str(e), file=sys.stderr)
        return 2
    if not caminho.is_file():
        print(f"no copy in the store under {a.sha256}", file=sys.stderr)
        return 1
    print(fontes.texto_impresso(caminho.read_bytes()), end="")
    return 0


def cmd_impressao(a) -> int:
    if a.peca == "codigo":
        from . import codigo

        try:
            print(f"code       {codigo.impressao(REPO)}")
        except codigo.ErroDoCodigo as e:
            print(str(e), file=sys.stderr)
            return 1
        return 0
    try:
        peca, folha = impressoes(Path(a.peca).read_bytes())
    except ErroDeForma as e:
        print(str(e), file=sys.stderr)
        return 1
    print(f"piece      {peca}")
    print(f"fact sheet {folha}")
    return 0


def cmd_registar(a) -> int:
    if a.tabela == "passo":
        campos = {"nome": a.nome, "lugar": a.lugar, "familia": a.familia, "modelo": a.modelo,
                  "inicio": a.inicio, "fim": a.fim}
    elif a.tabela == "leitura":
        campos = {"lugar": a.lugar, "familia": a.familia, "modelo": a.modelo, "inicio": a.inicio, "fim": a.fim,
                  "impressao": a.impressao, "plantas_postas": a.plantas_postas,
                  "plantas_apanhadas": a.plantas_apanhadas, "achados": a.achados, "adotados": a.adotados,
                  "veredicto": a.veredicto}
        if a.pessoas_vistas is not None:
            campos["pessoas_vistas"] = [x.strip() for x in a.pessoas_vistas.split(",") if x.strip()]
    else:
        campos = {"em": registo.agora(), "especie": a.especie, "antes": a.antes, "depois": a.depois,
                  "razao": a.razao}
        if a.causa is not None:
            campos["causa"] = a.causa
        campos.update({"impressao_antes": a.impressao_antes, "impressao_depois": a.impressao_depois})
    faltam = [k for k, v in campos.items() if v is None]
    if faltam:
        print("refused: missing " + ", ".join("--" + k.replace("_", "-") for k in faltam), file=sys.stderr)
        return 2
    try:
        print(registo.acrescentar(Path(a.peca), a.tabela, campos), end="")
    except (registo.ErroDoRegisto, ErroDeForma) as e:
        print(f"refused: {e}", file=sys.stderr)
        return 1
    return 0


def cmd_estado(a) -> int:
    caminho = Path(a.peca)
    try:
        atual = ler(caminho)
    except (ErroDeForma, OSError) as e:
        print(f"refused: {e}", file=sys.stderr)
        return 1
    if a.estado == "rascunho" and any(est.get("estado") == "publicada" for est in atual.registo.get("estado", [])):
        print("refused: the piece was published; it can only be withdrawn (retirada) or published again, never made a draft",
              file=sys.stderr)
        return 1
    if a.estado == "publicada":
        # Publishing must not add a table to a piece that would fail as published.
        peca = ler(caminho)
        # The table that would be appended, whole, so that check 9 reads the record as it would be.
        peca.registo.setdefault("estado", []).append({"estado": "publicada", "em": registo.agora(),
                                                      "por": "python3 -m oedp estado", "razao": a.razao})
        ctx, _ = build.contexto(REPO, caminho.parents[2] if len(caminho.parents) > 2 else REPO, [peca])
        falhas = [r for r in _conferir_como_publicada(peca, ctx) if r.estado in (conf.FALHOU, conf.NAO_CORRIDO)]
        if falhas:
            print("refused: the piece would fail as published:", file=sys.stderr)
            for r in falhas:
                print("  " + r.linha(), file=sys.stderr)
            return 1
    campos = {"estado": a.estado, "em": registo.agora(), "por": "python3 -m oedp estado", "razao": a.razao}
    try:
        print(registo.acrescentar(caminho, "estado", campos), end="")
    except (registo.ErroDoRegisto, ErroDeForma) as e:
        print(f"refused: {e}", file=sys.stderr)
        return 1
    return 0


def _conferir_como_publicada(peca, ctx):
    """Every check, with the piece as if published, and the same history against main
    that conferir has; where main is not at hand, check 4 says so and the piece is refused."""
    from . import paginas

    pagina = paginas.pagina_da_peca(peca, ctx)
    loja = _loja()
    anterior = conf.anterior_em_main(REPO, peca.caminho)
    return conf.reter_se_privado([
        conf.check1(peca), conf.check2(peca, loja), conf.check3(peca), conf.check4(peca, pagina, anterior),
        conf.check5(peca), conf.check6(peca), conf.check7(peca), conf.check8_peca(peca),
        conf.check9_peca(peca, pagina, ctx.direitos, loja)])


def conferir_tudo(alvos: list[Path], raiz: Path = REPO, imprimir=print) -> tuple[bool, list]:
    loja = _loja()
    # A file named on the command line that is not a piece is read by check 8 only.
    nomeados = list(alvos)
    alvos = [c for c in nomeados if not Path(c).is_file() or b"+++ cabeca" in Path(c).read_bytes()]
    pecas = []
    for c in alvos:
        try:
            pecas.append(ler(c))
        except (ErroDeForma, OSError):
            pass
    ctx, erros_do_sitio = build.contexto(REPO, raiz, [p for p in pecas if p.estado in ("publicada", "retirada")])
    resultados = []
    for c in alvos:
        resultados += conf.conferir_peca(c, ctx, loja)
    resultados.append(conf.check8_arvore(REPO, extras=nomeados))
    vercel = conf.check9_vercel(REPO)
    resultados.append(conf._r(9, "vercel.json", vercel))
    if erros_do_sitio:
        resultados.append(conf._r(9, "desk and method files", erros_do_sitio))
    desaparecidas, havia_main = conf.pecas_desaparecidas(REPO)
    resultados.append(conf._r(4, "pieces published on main", desaparecidas)
                      if havia_main else conf.Resultado(4, "pieces published on main", conf.NAO_CORRIDO,
                                                       ["main is not at hand here"], []))
    alvo = "reader's text outside pieces"
    if any(p.vinculada for p in pecas):
        resultados.append(conf._r(4, alvo, ctx.julgamento))
    else:
        resultados.append(conf.Resultado(4, alvo, conf.NAO_VINCULA, [], ["no published piece, so this does not bind yet"]
                                         + (["would fail once a piece is published: " + "; ".join(ctx.julgamento)] if ctx.julgamento else [])))
    alvo = "the code"
    if any(p.vinculada for p in pecas):
        resultados.append(conf._r(5, alvo, ctx.codigo))
    else:
        resultados.append(conf.Resultado(5, alvo, conf.NAO_VINCULA, [], ["no published piece, so this does not bind yet"]
                                         + (["would fail once a piece is published: " + "; ".join(ctx.codigo)] if ctx.codigo else [])))
    resultados.append(conf.Resultado(10, "live site", conf.NAO_CORRIDO,
                                     ["it needs the live address: run `python3 -m oedp no-ar <address>` after publishing"], []))
    for r in resultados:
        imprimir(r.linha())
    ok = not any(r.estado == conf.FALHOU for r in resultados)
    return ok, resultados


def cmd_conferir(a) -> int:
    alvos = [Path(p) for p in a.pecas] if a.pecas else pecas_em(REPO)
    if not alvos:
        print("no piece under pecas/; the checks of the tree and the site still run")
    ok, _ = conferir_tudo(alvos)
    return 0 if ok else 1


def cmd_construir(a) -> int:
    c = build.construir(REPO, saida=Path(a.saida) if a.saida else None, com_rascunhos=a.com_rascunhos, loja=_loja())
    for m in c.mensagens:
        print(m)
    print("check  9 (the site builds) · site: " + ("passed" if c.ok else "failed"))
    return 0 if c.ok else 1


def cmd_no_ar(a) -> int:
    estatica = Path(a.saida or REPO / ".vercel/output") / "static"
    razoes = noar.conferir(a.endereco, estatica)
    if razoes:
        print("check 10 (live is built) · " + a.endereco + ": failed: " + " | ".join(razoes))
        return 1
    print("check 10 (live is built) · " + a.endereco + ": passed")
    return 0


def cmd_navegador(a) -> int:
    from . import navegador

    exigir = [m.strip() for m in (a.exigir or "").split(",") if m.strip()]
    return navegador.correr(exigir)


def construir_previa(peca: Path, saida: Path) -> build.Construcao:
    """A preview, drafts included, of the site the piece file belongs to (its folder
    `pecas/<year>/` sits under the site's root), built into `saida`. Never deployed."""
    raiz = peca.resolve().parents[2]
    return build.construir(REPO, raiz=raiz, saida=saida, com_rascunhos=True, loja=_loja())


def cmd_capturas(a) -> int:
    import tempfile

    from . import ensaio, navegador

    try:
        navegador.playwright()
    except navegador.SemPlaywright as e:
        print(f"refused: {e}", file=sys.stderr)
        return 2
    with tempfile.TemporaryDirectory(prefix="oedp-capturas-") as tmp:
        if a.peca:
            peca = ler(Path(a.peca))
            c = construir_previa(Path(a.peca), Path(tmp) / "saida")
            enderecos, abrir = [f"/pecas/{peca.id}/"], True
        else:
            c = ensaio.construir_ensaio(Path(tmp), conferir_antes=False)
            enderecos, abrir = None, False
        if not c.ok:
            print("refused: the pages do not build: " + " | ".join(c.mensagens), file=sys.stderr)
            return 1
        try:
            feitas = navegador.capturar(c.estatica, Path(a.pasta), enderecos or navegador.paginas_construidas(c.estatica), abrir)
        except navegador.SemPlaywright as e:
            print(f"refused: {e}", file=sys.stderr)
            return 2
    for f in feitas:
        print(f)
    return 0


def cmd_leitura(a) -> int:
    from . import leituras

    try:
        if a.passo == "montar":
            pasta = leituras.montar(a.alvo, a.lugar, folha=a.folha, seccao=a.seccao, com=a.com or [], base=a.base,
                                    ordens=a.ordem or [], relatorios=a.relatorio or [], loja=_loja())
            print(f"reading folder: {pasta}")
            print(f"package: {pasta / 'pacote'} · prompt: {pasta / 'PROMPT.md'}")
            return 0
        if a.passo == "plantar":
            leituras.plantar(Path(a.pasta), Path(a.lista), loja=_loja())
            return 0
        if a.passo == "lancar":
            return leituras.lancar(Path(a.pasta))
        if a.passo == "pontuar":
            leituras.pontuar(Path(a.pasta), Path(a.decisoes) if a.decisoes else None, a.modelo, a.inicio, a.fim)
            return 0
        leituras.registar(Path(a.pasta))
        return 0
    except leituras.Recusa as e:
        print(str(e), file=sys.stderr)
        return 2


def cmd_tudo(a) -> int:
    t0 = time.monotonic()
    ok1 = cmd_conferir(argparse.Namespace(pecas=[])) == 0
    t1 = time.monotonic()
    ok2 = cmd_construir(argparse.Namespace(saida=None, com_rascunhos=False)) == 0
    t2 = time.monotonic()
    suite = unittest.defaultTestLoader.discover(str(REPO / "tests"), top_level_dir=str(REPO))
    resultado = unittest.TextTestRunner(verbosity=1).run(suite)
    t3 = time.monotonic()
    print(f"seconds: conferir {t1 - t0:.2f} · construir {t2 - t1:.2f} · tests {t3 - t2:.2f}")
    ok3 = resultado.wasSuccessful()
    print("tudo: " + ("passed" if ok1 and ok2 and ok3 else "failed"))
    return 0 if ok1 and ok2 and ok3 else 1


def principal(argv=None) -> int:
    p = argparse.ArgumentParser(prog="python3 -m oedp")
    sub = p.add_subparsers(dest="comando", required=True)

    s = sub.add_parser("nova")
    s.add_argument("id")
    s.add_argument("--tipo", required=True, choices=sorted(forma.TIPOS_PECA))
    s.set_defaults(f=cmd_nova)

    s = sub.add_parser("fonte")
    s.add_argument("url")
    s.add_argument("--termos", action="store_true", help="the address is a publisher's terms page; begins a rights record")
    s.add_argument("--direitos", help="the folder of rights records (default: direitos/)")
    s.add_argument("--pequeno", action="store_true", help="store an answer smaller than 512 bytes")
    s.add_argument("--pagina", help="the publisher's own page for the document; fetched and stored like the source")
    s.set_defaults(f=cmd_fonte)

    s = sub.add_parser("texto")
    s.add_argument("sha256")
    s.set_defaults(f=cmd_texto)

    s = sub.add_parser("impressao")
    s.add_argument("peca")
    s.set_defaults(f=cmd_impressao)

    s = sub.add_parser("registar")
    s.add_argument("peca")
    s.add_argument("tabela", choices=["passo", "leitura", "correcao"])
    for opcao in ("nome", "lugar", "familia", "modelo", "inicio", "fim", "impressao", "veredicto",
                  "pessoas-vistas", "especie", "antes", "depois", "razao", "causa",
                  "impressao-antes", "impressao-depois"):
        s.add_argument("--" + opcao)
    for opcao in ("plantas-postas", "plantas-apanhadas", "achados", "adotados"):
        s.add_argument("--" + opcao, type=int)
    s.set_defaults(f=cmd_registar)

    s = sub.add_parser("estado")
    s.add_argument("peca")
    s.add_argument("estado", choices=["publicada", "retirada", "rascunho"])
    s.add_argument("--razao", required=True)
    s.set_defaults(f=cmd_estado)

    s = sub.add_parser("conferir")
    s.add_argument("pecas", nargs="*")
    s.set_defaults(f=cmd_conferir)

    s = sub.add_parser("construir")
    s.add_argument("--com-rascunhos", action="store_true")
    s.add_argument("--saida")
    s.set_defaults(f=cmd_construir)

    s = sub.add_parser("no-ar")
    s.add_argument("endereco")
    s.add_argument("--saida")
    s.set_defaults(f=cmd_no_ar)

    s = sub.add_parser("tudo")
    s.set_defaults(f=cmd_tudo)

    s = sub.add_parser("leitura", help="a reading: montar, plantar, lancar, pontuar, registar")
    passos = s.add_subparsers(dest="passo", required=True)
    m = passos.add_parser("montar")
    m.add_argument("alvo", help="a piece file, paginas/metodo.md, textos.toml, or the word codigo")
    m.add_argument("lugar")
    m.add_argument("--folha", action="store_true", help="especialista or oposto reading the fact sheet before the text")
    m.add_argument("--seccao", help="a file appended to the prompt after the reading's section")
    m.add_argument("--com", action="append", help="for the Method judge: more files under referencia/")
    m.add_argument("--base", help="for the code: the commit the diff starts from")
    m.add_argument("--ordem", action="append", help="for the code: a work order")
    m.add_argument("--relatorio", action="append", help="for the code: a builder's report")
    m.set_defaults(f=cmd_leitura)
    m = passos.add_parser("plantar")
    m.add_argument("pasta")
    m.add_argument("lista")
    m.set_defaults(f=cmd_leitura)
    for nome in ("lancar", "registar"):
        m = passos.add_parser(nome)
        m.add_argument("pasta")
        m.set_defaults(f=cmd_leitura)
    m = passos.add_parser("pontuar")
    m.add_argument("pasta")
    m.add_argument("--decisoes")
    m.add_argument("--modelo")
    m.add_argument("--inicio")
    m.add_argument("--fim")
    m.set_defaults(f=cmd_leitura)

    s = sub.add_parser("navegador",help="a link to a receipt opens it, in real browsers (needs requirements-navegador.txt)")
    s.add_argument("--exigir", help="engines that must run, comma-separated: chromium,firefox,webkit")
    s.set_defaults(f=cmd_navegador)

    s = sub.add_parser("capturas", help="screenshots of the built pages with Chromium (needs requirements-navegador.txt)")
    s.add_argument("pasta")
    s.add_argument("peca", nargs="?")
    s.set_defaults(f=cmd_capturas)

    a = p.parse_args(argv)
    try:
        return a.f(a)
    except Recusa as e:
        print(str(e), file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(principal())
