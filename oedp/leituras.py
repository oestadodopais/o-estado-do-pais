"""The readings as scripts: `python3 -m oedp leitura montar | plantar | lancar | pontuar | registar`.

One reading is one folder in the workshop (OEDP_OFICINA), `leituras/<alvo>/<lugar>-<n>/`:

* `pacote/`: everything the reader may use, and nothing else;
* `PROMPT.md`: the common page, the seat's brief, and this reading's section;
* `leitura.json`: what was packaged (the target, the seat, the fingerprint read before
  any plant, the commit, the SHA-256 of every file of the package), then the reader's
  model and times, then whether it was registered;
* beside the package, never in it: `chave.json` (where each plant is), `base/` (for the
  code: the tree at `--base`), `LEITURA.md` (the reader's answer), `pontuacao.json` (the
  score worked out from the answer and the key).

`<alvo>` is a piece's id, `metodo`, `textos` or `codigo`. The contract is
`blocos/esq2/ORDEM.md`, item A, and `equipa/00-comum.md` (the closing block a reader
returns). Everything this module prints is for the team, in English.
"""
from __future__ import annotations

import datetime as dt
import difflib
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import tomllib
from dataclasses import dataclass
from pathlib import Path

from . import codigo, conferir, direitos, ensaio, fontes, julgados, numerado, paginas, registo
from .ambiente import sem_git_local
from .peca import ErroDeForma, Peca, impressoes, ler, ler_bytes, secoes

REPO = Path(__file__).resolve().parent.parent
LER_SH = REPO / "scripts" / "leituras" / "ler.sh"

# The seats a Codex model holds (the other family from the writer, the reporter and the
# builder) and those a Claude model holds (equipa/*.md).
OUTRA_FAMILIA = ("numeros", "oposto", "justica", "juiz", "seguranca")
CLAUDE = ("especialista", "leitor", "desenhador")
FAMILIA = {**{l: "openai" for l in OUTRA_FAMILIA}, **{l: "anthropic" for l in CLAUDE}}
LUGARES_DA_PECA = ("numeros", "oposto", "especialista", "justica", "juiz", "leitor", "desenhador")
COM_PLANTAS_OBRIGATORIAS = ("numeros", "juiz", "seguranca")
NEUTRO = {"OEDP_FONTES", "OEDP_OFICINA", "PRIVACIDADE_PROIBIDOS", "GITHUB_ACTIONS"}

SECCAO = """# This reading

Your working folder is the package, and it is everything you may use; `LEIA-ME.md` in it says what each file is. You are in a read-only sandbox with no network. Stay inside the folder. Your answer is your final message, and it ends with the closing block of the common page, with one `[[achado]]` for each thing you found wrong.
"""

# One line per file of a package, after the pilot's packages (piloto/2026-11-14-salarios).
LEIA_ME = {
    "PERGUNTA.md": "the question the piece was commissioned to answer.",
    "ENCOMENDA.md": "the commission: the question, why today, and the finding that would make us drop the piece.",
    "folha.toml": "the whole fact sheet: every figure, comparison and documented act the text may use, each with its source, its place and its excerpt.",
    "fontes/": "`fontes/<sha256>.txt`: the text of each stored copy, named by the `sha256` of its `[[fonte]]`, exactly as the project's checks read it. A PDF is printed page by page; a spreadsheet sheet by sheet, cell by cell.",
    "direitos/": "`direitos/<host>.toml`: the rights record of each source's publisher (whether a copy may be kept, how long an excerpt may be).",
    "mesas/": "`mesas/<tema>.md`: the desk file of the piece's main thread.",
    "peca.md": "the piece file above its record: `cabeca` (with the commission), `corpo` (the text with its references: `{id}` prints a line, `[words]{id}` ties words to lines) and `folha` (the fact sheet: every figure, comparison and documented act, each with its source, its place and its excerpt).",
    "TEXTO-NUMERADO.md": "the text as a reader will see it, with every sentence numbered. These numbers are the ones your answer uses (`frase <N>`).",
    "metodo.md": "the Method page's prose, above its record line.",
    "referencia/": "`referencia/`: what the prose describes, to check it against: the specifications (`docs/`), the team's briefs (`equipa/`), `README.md`, the fixed sentences (`textos.toml`), the code (`oedp/`) and anything else named for this reading.",
    "TEXTOS-NUMERADOS.md": "every fixed sentence of the pages, one per line, numbered, with its key. These numbers are the ones your answer uses (`frase <N>`).",
    "docs/": "`docs/ESPEC-PAGINAS.md`: the specification of the five pages, whose table gives every fixed sentence.",
    "ESPEC-PAGINAS.md": "the specification of the five pages: what each page shows and how.",
    "capturas/": "`capturas/`: screenshots of the piece's page as built, with its receipts and its record open, at 390 and 1280 pixels wide, light and dark.",
    "construido/": "`construido/`: the pages as built from the test piece (invented figures), where each sentence can be seen in place.",
    "construido-sem-pecas/": "`construido-sem-pecas/`: the pages as built with no published piece.",
    "arvore/": "`arvore/`: the whole tree at the head. The specifications are in `arvore/docs/`.",
    "diff.patch": "everything that changed between the base commit and the head.",
    "saida-tudo.txt": "what `python3 -m oedp tudo` printed when run in `arvore/`.",
}


class Recusa(Exception):
    """A refusal: the reason is printed and nothing is left half-made."""


def agora() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha(dados: bytes) -> str:
    return hashlib.sha256(dados).hexdigest()


# --------------------------------------------------------------------------- the workshop


def oficina(valor: str | None = None) -> Path:
    """The workshop named by OEDP_OFICINA, outside this repository's tree. Raises Recusa."""
    valor = (os.environ.get("OEDP_OFICINA", "") if valor is None else str(valor)).strip()
    if not valor:
        raise Recusa("refused: OEDP_OFICINA is not set; it names the private workshop where readings are kept")
    caminho = Path(valor).expanduser().resolve()
    if caminho == REPO or caminho.is_relative_to(REPO):
        raise Recusa("refused: OEDP_OFICINA resolves inside the repository; the workshop must live outside it, "
                     "since a package carries the text of sources and a key of planted errors")
    return caminho


def ler_json(f: Path) -> dict:
    return json.loads(Path(f).read_text(encoding="utf-8"))


def escrever_json(f: Path, dados: dict):
    Path(f).write_text(json.dumps(dados, indent=1, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")


def ficheiros_do_pacote(pacote: Path) -> dict[str, str]:
    return {f.relative_to(pacote).as_posix(): sha(f.read_bytes())
            for f in sorted(Path(pacote).rglob("*")) if f.is_file() and not f.is_symlink()}


def pacote_intacto(pasta: Path):
    """Refuse, naming the files, when the package is not byte for byte what `montar` built
    or, once planted, what `plantar` left: a file changed, missing, or there and not listed.
    A package changed by hand would otherwise be read and recorded under the fingerprint of
    something else."""
    pasta = Path(pasta)
    chave = pasta / "chave.json"
    esperado = (ler_json(chave) if chave.is_file() else ler_json(pasta / "leitura.json")).get("ficheiros")
    if not isinstance(esperado, dict):
        raise Recusa("refused: the reading's folder records no list of the package's files, so the package cannot be "
                     "shown to be the one built" + (" and planted" if chave.is_file() else ""))
    real = ficheiros_do_pacote(pasta / "pacote")
    mudados = sorted(n for n in set(esperado) & set(real) if esperado[n] != real[n])
    em_falta = sorted(set(esperado) - set(real))
    a_mais = sorted(set(real) - set(esperado))
    if mudados or em_falta or a_mais:
        partes = ([f"changed: {', '.join(mudados)}"] if mudados else []) + ([f"missing: {', '.join(em_falta)}"] if em_falta else []) \
            + ([f"not listed: {', '.join(a_mais)}"] if a_mais else [])
        raise Recusa("refused: the package is not the one " + ("planted" if chave.is_file() else "built") + " (" + "; ".join(partes) + ")")


def mesma_hora(pacote: Path, quando: float | None = None):
    """Every file and folder of the package gets one modification time, so that the time a
    file was changed says nothing about a plant."""
    t = int(quando if quando is not None else dt.datetime.now(dt.timezone.utc).timestamp())
    for f in sorted(Path(pacote).rglob("*"), reverse=True):
        if not f.is_symlink():
            os.utime(f, (t, t))
    os.utime(pacote, (t, t))


# --------------------------------------------------------------------------- the target


@dataclass
class Alvo:
    tipo: str  # peca | metodo | textos | codigo
    nome: str  # the workshop folder: the piece's id, metodo, textos or codigo
    caminho: Path  # the piece file, paginas/metodo.md, textos.toml, or the repository's root for the code


def alvo_de(argumento: str, repo: Path = REPO) -> Alvo:
    if argumento == "codigo":
        return Alvo("codigo", "codigo", Path(repo))
    caminho = Path(argumento)
    if not caminho.is_file():
        raise Recusa(f"refused: {argumento} is not a file, nor the word codigo")
    if caminho.name == "textos.toml":
        return Alvo("textos", "textos", caminho)
    if caminho.name == "metodo.md" and caminho.parent.name == "paginas":
        return Alvo("metodo", "metodo", caminho)
    try:
        peca = ler(caminho)
    except (ErroDeForma, OSError) as e:
        raise Recusa(f"refused: {argumento} is not a piece file ({e})") from None
    return Alvo("peca", peca.id, caminho)


def lugares_permitidos(tipo: str) -> tuple[str, ...]:
    return {"peca": LUGARES_DA_PECA, "metodo": ("juiz",), "textos": ("juiz",), "codigo": ("seguranca",)}[tipo]


def pasta_nova(base: Path, alvo: Alvo, lugar: str) -> Path:
    pasta = base / "leituras" / alvo.nome
    n = 1 + max([int(m.group(1)) for f in pasta.glob(f"{lugar}-*") if (m := re.fullmatch(rf"{lugar}-(\d+)", f.name))] or [0])
    return pasta / f"{lugar}-{n}"


# --------------------------------------------------------------------------- pieces


def raiz_da_peca(caminho: Path) -> Path:
    """The site a piece file belongs to: the folder above `pecas/<year>/`."""
    return Path(caminho).resolve().parents[2]


def contexto_de_textos(repo: Path = REPO) -> paginas.Contexto:
    return paginas.Contexto(textos=tomllib.loads((Path(repo) / "textos.toml").read_text(encoding="utf-8")))


def texto_numerado_da_peca(bruto: bytes, repo: Path = REPO) -> str:
    """TEXTO-NUMERADO.md from the bytes of a piece (its record may be cut off)."""
    if not re.search(rb"(?m)^\+\+\+ registo$", bruto):
        bruto = bruto + (b"" if bruto.endswith(b"\n") else b"\n") + b"+++ registo\n"
    return numerado.numerado_da_peca(ler_bytes(bruto, Path("peca.md")), contexto_de_textos(repo))


def acima_do_registo(bruto: bytes) -> bytes:
    return secoes(bruto)["_ate_registo"]


def _copias(peca: Peca, loja: Path | None, pacote: Path):
    """fontes/<sha256>.txt for every stored source; refused when one is not in the store."""
    if loja is None or not Path(loja).is_dir():
        raise Recusa("refused: OEDP_FONTES is not set or does not exist here, and the package needs the stored sources")
    em_falta, textos = [], {}
    for fid, f in peca.fontes.items():
        s = str(f.get("sha256", ""))
        try:
            copia = fontes.caminho_da_copia(loja, s)
        except fontes.ErroDaLoja as e:
            raise Recusa(f"refused: fonte {fid}: {e}") from None
        if not copia.is_file() or sha(copia.read_bytes()) != s:
            em_falta.append(f"fonte {fid} ({s[:12]}…)")
            continue
        textos[s] = fontes.texto_impresso(copia.read_bytes())
    if em_falta:
        raise Recusa("refused: these stored sources are not in the store, or do not hash to their name: " + ", ".join(em_falta))
    return textos


def _escrever(pacote: Path, relativo: str, dados: str | bytes):
    destino = pacote / relativo
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_bytes(dados if isinstance(dados, bytes) else dados.encode("utf-8"))


def pacote_da_peca(alvo: Alvo, lugar: str, folha: bool, pacote: Path, loja: Path | None, capturar=None,
                   repo: Path = REPO) -> str:
    """Fill the package of a seat that reads a piece; returns the fingerprint read."""
    bruto = alvo.caminho.read_bytes()
    peca = ler(alvo.caminho)
    textos = _copias(peca, loja, pacote)
    raiz = raiz_da_peca(alvo.caminho)
    temas = peca.cabeca.get("temas") or []
    mesa = raiz / "mesas" / f"{temas[0]}.md" if temas else None
    fontes_no_pacote = lambda: [_escrever(pacote, f"fontes/{s}.txt", t) for s, t in sorted(textos.items())]
    if lugar == "numeros":
        if not peca.fontes:
            raise Recusa("refused: the piece has no [[fonte]], so there is nothing for the numbers editor to read against")
        enc = peca.cabeca.get("encomenda") or {}
        _escrever(pacote, "PERGUNTA.md", str(enc.get("pergunta", "")).strip() + "\n")
        _escrever(pacote, "folha.toml", secoes(bruto)["folha"])
        fontes_no_pacote()
        for host in sorted({direitos.host_de(str(f.get("url_final", ""))) for f in peca.fontes.values()}):
            registo_h = raiz / "direitos" / f"{host}.toml"
            if not registo_h.is_file():
                raise Recusa(f"refused: the host {host} of a source has no rights record direitos/{host}.toml")
            _escrever(pacote, f"direitos/{host}.toml", registo_h.read_bytes())
        return peca.impressao_folha
    if folha:  # especialista or oposto, reading the fact sheet before the text exists
        enc = peca.cabeca.get("encomenda") or {}
        _escrever(pacote, "ENCOMENDA.md", "".join(f"- `{k}`: {str(enc.get(k, '')).strip()}\n"
                                                    for k in ("pergunta", "porque_hoje", "largar_se")))
        _escrever(pacote, "folha.toml", secoes(bruto)["folha"])
        fontes_no_pacote()
        if mesa is not None and mesa.is_file():
            _escrever(pacote, f"mesas/{mesa.name}", mesa.read_bytes())
        return peca.impressao_folha
    numerado_ = texto_numerado_da_peca(bruto, repo)
    if lugar in ("oposto", "justica", "juiz"):
        _escrever(pacote, "peca.md", acima_do_registo(bruto))
        _escrever(pacote, "TEXTO-NUMERADO.md", numerado_)
        fontes_no_pacote()
    elif lugar == "especialista":
        _escrever(pacote, "peca.md", acima_do_registo(bruto))
        _escrever(pacote, "TEXTO-NUMERADO.md", numerado_)
        if mesa is not None and mesa.is_file():
            _escrever(pacote, f"mesas/{mesa.name}", mesa.read_bytes())
    elif lugar == "leitor":
        _escrever(pacote, "TEXTO-NUMERADO.md", numerado_)
    elif lugar == "desenhador":
        _escrever(pacote, "ESPEC-PAGINAS.md", (Path(repo) / "docs" / "ESPEC-PAGINAS.md").read_bytes())
        if capturar is None:
            raise Recusa("refused: the designer's package needs screenshots, and no way to take them was given")
        capturar(alvo.caminho, pacote / "capturas")
    return peca.impressao


def capturar_peca(caminho: Path, destino: Path):
    """Screenshots of one piece's page, receipts and record open (E3); refused without Playwright."""
    from . import navegador
    from .__main__ import construir_previa

    try:
        navegador.playwright()
    except navegador.SemPlaywright as e:
        raise Recusa(f"refused: {e}") from None
    with tempfile.TemporaryDirectory(prefix="oedp-capturas-") as tmp:
        c = construir_previa(Path(caminho), Path(tmp) / "saida")
        if not c.ok:
            raise Recusa("refused: the piece's page does not build: " + " | ".join(c.mensagens))
        navegador.capturar(c.estatica, destino, [f"/pecas/{ler(caminho).id}/"], abrir_tudo=True)


# --------------------------------------------------------------------------- the Method prose and the fixed sentences


def pacote_do_metodo(alvo: Alvo, pacote: Path, com: list[str], repo: Path = REPO) -> str:
    texto, _ = julgados.separar(alvo.caminho.read_bytes())
    _escrever(pacote, "metodo.md", texto)
    _escrever(pacote, "TEXTO-NUMERADO.md", numerado.numerar(numerado.blocos_da_prosa(texto.decode("utf-8"))))
    ref = pacote / "referencia"
    for nome in ("docs", "equipa", "oedp"):
        origem = Path(repo) / nome
        if not origem.is_dir():
            raise Recusa(f"refused: {nome}/ is missing from the tree, and the Method judge's package needs it")
        shutil.copytree(origem, ref / nome, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    for nome in ("README.md", "textos.toml"):
        shutil.copy2(Path(repo) / nome, ref / nome)
    for extra in com:
        origem = Path(extra)
        destino = ref / origem.name
        if destino.exists():
            raise Recusa(f"refused: --com {extra}: referencia/{origem.name} is already in the package")
        (shutil.copytree if origem.is_dir() else shutil.copy2)(origem, destino)
    return sha(texto)


def textos_numerados(textos: dict) -> str:
    return "".join(f"[{n}] `{k}`: {v}\n" for n, (k, v) in enumerate(textos.items(), 1))


def textos_de_numerados(texto: str) -> dict:
    """The fixed sentences back from TEXTOS-NUMERADOS.md (to build the pages from a planted copy)."""
    return {m.group(1): m.group(2) for m in re.finditer(r"(?m)^\[\d+\] `([a-z0-9_]+)`: (.*)$", texto)}


def _toml_de_textos(textos: dict) -> str:
    return "".join(f"{k} = {json.dumps(v, ensure_ascii=False)}\n" for k, v in textos.items())


def construir_com_textos(textos: dict, destino: Path, repo: Path = REPO):
    """The test site's pages, built as a preview from a copy of the hosting files with these
    fixed sentences, into `destino` (the package's construido/)."""
    with tempfile.TemporaryDirectory(prefix="oedp-textos-") as tmp:
        copia = Path(tmp) / "repo"
        copia.mkdir()
        for nome in ("sitio.toml", "vercel.json"):
            shutil.copy2(Path(repo) / nome, copia / nome)
        shutil.copytree(Path(repo) / "public", copia / "public")
        (copia / "textos.toml").write_text(_toml_de_textos(textos), encoding="utf-8")
        raiz = ensaio.copiar_sitio(Path(tmp) / "raiz", repo=repo)
        from . import construir as build

        c = build.construir(copia, raiz=raiz, saida=Path(tmp) / "saida", com_rascunhos=True, loja=ensaio.LOJA)
        if not c.ok:
            raise Recusa("refused: the test pages do not build with these sentences: " + " | ".join(c.mensagens))
        if destino.exists():
            shutil.rmtree(destino)
        shutil.copytree(c.estatica, destino)


def pacote_dos_textos(alvo: Alvo, pacote: Path, repo: Path = REPO) -> str:
    dados = alvo.caminho.read_bytes()
    textos = tomllib.loads(dados.decode("utf-8"))
    _escrever(pacote, "TEXTOS-NUMERADOS.md", textos_numerados(textos))
    _escrever(pacote, "docs/ESPEC-PAGINAS.md", (Path(repo) / "docs" / "ESPEC-PAGINAS.md").read_bytes())
    construir_com_textos(textos, pacote / "construido", repo)
    return sha(dados)


# --------------------------------------------------------------------------- the code


def _git(repo: Path, *args, **kw) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, **kw)


def arquivar(repo: Path, commit: str, destino: Path):
    """The tracked files of a commit, as `git archive` writes them."""
    destino.mkdir(parents=True, exist_ok=True)
    arquivo = _git(repo, "archive", "--format=tar", commit)
    if arquivo.returncode != 0:
        raise Recusa(f"refused: git archive {commit} failed ({arquivo.stderr.decode(errors='replace').strip()})")
    r = subprocess.run(["tar", "-x", "-C", str(destino)], input=arquivo.stdout, capture_output=True)
    if r.returncode != 0:
        raise Recusa(f"refused: the archive of {commit} could not be unpacked")


def diff_entre(base: Path, arvore: Path) -> bytes:
    """The diff from `base` to `arvore`, made by git in a scratch repository, so that it has
    the same form whether `arvore` is the head as committed or a planted copy of it."""
    with tempfile.TemporaryDirectory(prefix="oedp-diff-") as tmp:
        r = Path(tmp)
        ambiente = {"GIT_AUTHOR_NAME": "leitura", "GIT_AUTHOR_EMAIL": "leitura@localhost", "GIT_COMMITTER_NAME": "leitura",
                    "GIT_COMMITTER_EMAIL": "leitura@localhost", "GIT_CONFIG_GLOBAL": os.devnull, "GIT_CONFIG_SYSTEM": os.devnull}
        env = {**sem_git_local(), **ambiente}
        subprocess.run(["git", "init", "-q", str(r)], check=True, env=env)
        shutil.copytree(base, r, dirs_exist_ok=True, symlinks=True)
        subprocess.run(["git", "-C", str(r), "add", "-A"], check=True, env=env)
        subprocess.run(["git", "-C", str(r), "commit", "-q", "--allow-empty", "-m", "base"], check=True, env=env)
        for f in r.iterdir():
            if f.name != ".git":
                shutil.rmtree(f) if f.is_dir() and not f.is_symlink() else f.unlink()
        shutil.copytree(arvore, r, dirs_exist_ok=True, symlinks=True)
        subprocess.run(["git", "-C", str(r), "add", "-A"], check=True, env=env)
        return subprocess.run(["git", "-C", str(r), "diff", "--cached", "--binary", "--no-color", "--no-ext-diff"],
                              check=True, capture_output=True, env=env).stdout


def _ambiente_limpo() -> dict:
    return {k: v for k, v in sem_git_local().items() if k not in NEUTRO}


_CONSTRUIR = ("import sys; from pathlib import Path; from oedp import ensaio; "
              "c = ensaio.construir_ensaio(Path(sys.argv[1]), com_pecas=sys.argv[2] == '1'); "
              "print('\\n'.join(c.mensagens)); sys.exit(0 if c.ok else 1)")


_FALHOU = re.compile(r"(?m)^(?:FAIL|ERROR): \S+ \(([^)\s]+)\)")


def testes_que_falharam(saida: str) -> list[str]:
    """The tests unittest names as failed or in error in the output of `tudo`."""
    return sorted(set(_FALHOU.findall(saida)))


def artefactos_da_arvore(arvore: Path, pacote: Path) -> tuple[int, list[str]]:
    """construido/, construido-sem-pecas/ and saida-tudo.txt, made by the code in `arvore`
    itself, run in a scratch copy of it that is not a git repository, as the reader's
    `arvore/` is not. Returns the exit code of `tudo` and the tests it names as failed."""
    with tempfile.TemporaryDirectory(prefix="oedp-arvore-") as tmp:
        copia = Path(tmp) / "arvore"
        shutil.copytree(arvore, copia, symlinks=True)
        env = _ambiente_limpo()
        tudo = subprocess.run([sys.executable, "-m", "oedp", "tudo"], cwd=copia, env=env, capture_output=True, text=True)
        _escrever(pacote, "saida-tudo.txt", tudo.stdout + tudo.stderr + f"\n(exit {tudo.returncode})\n")
        for nome, com in (("construido", "1"), ("construido-sem-pecas", "0")):
            saida = Path(tmp) / nome
            r = subprocess.run([sys.executable, "-c", _CONSTRUIR, str(saida), com], cwd=copia, env=env,
                               capture_output=True, text=True)
            if r.returncode != 0:
                raise Recusa(f"refused: the pages do not build from arvore/ ({nome}): {r.stdout.strip()} {r.stderr.strip()}")
            destino = pacote / nome
            if destino.exists():
                shutil.rmtree(destino)
            shutil.copytree(saida / "saida" / "static", destino)
        return tudo.returncode, testes_que_falharam(tudo.stdout + tudo.stderr)


def pacote_do_codigo(alvo: Alvo, pacote: Path, base: str | None, ordens: list[str], relatorios: list[str],
                     pasta: Path, artefactos=artefactos_da_arvore) -> tuple[str, dict]:
    if not base:
        raise Recusa("refused: a reading of the code needs --base <commit>, the commit the diff starts from")
    repo = alvo.caminho
    for f in list(ordens) + list(relatorios):
        origem = Path(f)
        if not origem.is_file():
            raise Recusa(f"refused: {f} is not a file")
        if (pacote / origem.name).exists():
            raise Recusa(f"refused: two files named {origem.name}")
        shutil.copy2(origem, pacote / origem.name)
    cabeca = _git(repo, "rev-parse", "HEAD", text=True).stdout.strip()
    base_c = _git(repo, "rev-parse", "--verify", base + "^{commit}", text=True)
    if base_c.returncode != 0:
        raise Recusa(f"refused: --base {base} is not a commit here")
    arquivar(repo, cabeca, pacote / "arvore")
    arquivar(repo, base_c.stdout.strip(), pasta / "base")
    _escrever(pacote, "diff.patch", diff_entre(pasta / "base", pacote / "arvore"))
    saida, falhados = artefactos(pacote / "arvore", pacote)
    if saida != 0:
        # A tree whose own gate fails would make every plant pass "the same exit as before".
        raise Recusa(f"refused: tudo exits {saida} in the unpacked tree, and the reader must be given a tree whose gate "
                     f"passes; failing: {', '.join(falhados) or '(no test named; the output is in the scratch copy)'}")
    return codigo.impressao_de_pasta(pacote / "arvore"), {"base": base_c.stdout.strip(), "cabeca": cabeca, "saida_tudo": saida}


# --------------------------------------------------------------------------- A1: montar


def leia_me(pacote: Path) -> str:
    linhas = ["# What is in this folder", ""]
    for nome in sorted(p.name + ("/" if p.is_dir() else "") for p in pacote.iterdir()):
        if nome in LEIA_ME:
            texto = LEIA_ME[nome]
            linhas.append(f"- {texto}" if texto.startswith("`") else f"- `{nome}`: {texto}")
        else:
            linhas.append(f"- `{nome}`: a file named for this reading (an order or a report).")
    return "\n".join(linhas) + "\n"


def prompt(lugar: str, equipa: Path, seccao: str | None) -> str:
    comum, proprio = Path(equipa) / "00-comum.md", Path(equipa) / f"{lugar}.md"
    for f in (comum, proprio):
        if not f.is_file():
            raise Recusa(f"refused: the brief {f.name} is not in {equipa}")
    partes = [comum.read_text(encoding="utf-8").rstrip("\n"), "---", proprio.read_text(encoding="utf-8").rstrip("\n"),
              "---", SECCAO.rstrip("\n")]
    if seccao:
        partes.append(Path(seccao).read_text(encoding="utf-8").rstrip("\n"))
    return "\n\n".join(partes) + "\n"


def montar(alvo_arg: str, lugar: str, *, folha: bool = False, seccao: str | None = None, com=(), base: str | None = None,
           ordens=(), relatorios=(), oficina_: str | None = None, loja: Path | None = None, equipa: Path | None = None,
           repo: Path = REPO, capturar=capturar_peca, artefactos=artefactos_da_arvore) -> Path:
    """Build a reading's package and prompt; returns the reading's folder. Raises Recusa."""
    base_oficina = oficina(oficina_)
    alvo = alvo_de(alvo_arg, repo)
    if lugar not in lugares_permitidos(alvo.tipo):
        raise Recusa(f"refused: the seat {lugar} does not read {alvo.tipo}; it takes {', '.join(lugares_permitidos(alvo.tipo))}")
    if folha and lugar not in ("especialista", "oposto"):
        raise Recusa("refused: --folha is for the especialista and the oposto, reading the fact sheet before the text")
    texto_do_prompt = prompt(lugar, Path(equipa or Path(repo) / "equipa"), seccao)  # the briefs first: refused before any work
    pasta = pasta_nova(base_oficina, alvo, lugar)
    pacote = pasta / "pacote"
    pacote.mkdir(parents=True)
    try:
        extra = {}
        if alvo.tipo == "peca":
            impressao = pacote_da_peca(alvo, lugar, folha, pacote, loja, capturar, repo)
        elif alvo.tipo == "metodo":
            impressao = pacote_do_metodo(alvo, pacote, list(com), repo)
        elif alvo.tipo == "textos":
            impressao = pacote_dos_textos(alvo, pacote, repo)
        else:
            impressao, extra = pacote_do_codigo(alvo, pacote, base, list(ordens), list(relatorios), pasta, artefactos)
        if lugar != "leitor":
            _escrever(pacote, "LEIA-ME.md", leia_me(pacote))
        (pasta / "PROMPT.md").write_text(texto_do_prompt, encoding="utf-8")
        mesma_hora(pacote)
        commit = _git(repo, "rev-parse", "HEAD", text=True).stdout.strip()
        escrever_json(pasta / "leitura.json", {
            "alvo": {"tipo": alvo.tipo, "nome": alvo.nome, "caminho": str(Path(alvo.caminho).resolve())},
            "lugar": lugar, "folha": folha, "familia": FAMILIA[lugar], "impressao": impressao, "commit": commit,
            "montada_em": agora(), "ficheiros": ficheiros_do_pacote(pacote), **({"codigo": extra} if extra else {})})
    except BaseException:
        shutil.rmtree(pasta, ignore_errors=True)
        raise
    return pasta


# --------------------------------------------------------------------------- A2: plantar


def _texto(f: Path) -> str:
    return f.read_text(encoding="utf-8")


def lugares_no_texto(antes: str, depois: str) -> list[str]:
    """`frase <N>` for each numbered sentence of `depois` that is not in `antes` at its place."""
    a, b = numerado.lista(antes), numerado.lista(depois)
    lugares = []
    for op, _, _, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if op in ("replace", "insert"):
            lugares += [f"frase {j + 1}" for j in range(j1, j2)]
    return lugares


def _tabelas_da_folha(folha: bytes, chave: str) -> dict[str, dict]:
    try:
        dados = tomllib.loads(folha.decode("utf-8"))
    except tomllib.TOMLDecodeError as e:
        raise Recusa(f"refused: the planted fact sheet is not valid TOML ({e})") from None
    return {t.get("id"): t for t in dados.get(chave, []) if isinstance(t, dict)}


def lugares_na_folha(antes: bytes, depois: bytes) -> list[str]:
    """`fonte <id>` for each changed [[fonte]], `linha <id>` for each changed [[linha]], in the
    words of a finding (equipa/00-comum.md). A changed [[pessoa]] has no place of its own: it
    is placed by the numbered sentences it changes, and refused where it changes none."""
    lugares = []
    for chave, palavra in (("fonte", "fonte"), ("linha", "linha")):
        a, b = _tabelas_da_folha(antes, chave), _tabelas_da_folha(depois, chave)
        lugares += [f"{palavra} {i}" for i in sorted(set(a) | set(b), key=str) if a.get(i) != b.get(i)]
    return lugares


def _conferencias(bruto: bytes, loja: Path | None) -> list[tuple]:
    """Checks 1, 2, 3 and 6 on a piece's bytes: (check, state, reasons)."""
    try:
        peca = ler_bytes(bruto, Path("peca.md"))
    except ErroDeForma as e:
        return [("forma", "failed", [str(e)])]
    return [(r.verificacao, r.estado, tuple(r.razoes)) for r in
            (conferir.check1(peca), conferir.check2(peca, loja), conferir.check3(peca), conferir.check6(peca))]


def _ler_lista(lista: Path) -> list[dict]:
    try:
        dados = tomllib.loads(Path(lista).read_text(encoding="utf-8"))
    except (tomllib.TOMLDecodeError, OSError) as e:
        raise Recusa(f"refused: the list of plants cannot be read ({e})") from None
    plantas = dados.get("planta", [])
    if not plantas or set(dados) != {"planta"}:
        raise Recusa("refused: the list must hold one or more plant tables and nothing else")
    for n, p in enumerate(plantas, 1):
        faltam = {"id", "ficheiro", "antes", "depois", "descricao", "desmente", "desmente_em"} - set(p)
        if faltam or set(p) - {"id", "ficheiro", "antes", "depois", "descricao", "desmente", "desmente_em"}:
            raise Recusa(f"refused: plant number {n} must have exactly id, ficheiro, antes, depois, descricao, desmente, desmente_em")
        if not all(isinstance(v, str) and v for v in p.values()):
            raise Recusa(f"refused: plant number {n}: every field is non-empty text")
    if len({p["id"] for p in plantas}) != len(plantas):
        raise Recusa("refused: two plants share an id")
    return plantas


def _dentro(pacote: Path, relativo: str) -> Path:
    f = (pacote / relativo).resolve()
    if not f.is_relative_to(pacote.resolve()) or not f.is_file():
        raise Recusa(f"refused: {relativo} is not a file of the package")
    return f


class Plantador:
    """Applies one plant and makes again every file derived from the planted one."""

    def __init__(self, pasta: Path, loja: Path | None, repo: Path = REPO, artefactos=artefactos_da_arvore):
        self.pasta, self.pacote, self.loja, self.repo, self.artefactos = pasta, pasta / "pacote", loja, repo, artefactos
        self.leitura = ler_json(pasta / "leitura.json")
        self.alvo = self.leitura["alvo"]
        self.lugar = self.leitura["lugar"]

    def le_o_numerado(self) -> bool:
        return (self.pacote / "TEXTO-NUMERADO.md").is_file() or (self.pacote / "TEXTOS-NUMERADOS.md").is_file()

    def refazer(self, ficheiro: str):
        """Make again the files derived from the planted one."""
        if ficheiro == "peca.md":
            self._escrever("TEXTO-NUMERADO.md", texto_numerado_da_peca((self.pacote / "peca.md").read_bytes(), self.repo))
        elif ficheiro == "metodo.md":
            prosa = (self.pacote / "metodo.md").read_text(encoding="utf-8")
            self._escrever("TEXTO-NUMERADO.md", numerado.numerar(numerado.blocos_da_prosa(prosa)))
        elif ficheiro == "TEXTOS-NUMERADOS.md":
            construir_com_textos(textos_de_numerados(_texto(self.pacote / ficheiro)), self.pacote / "construido", self.repo)
        elif ficheiro.startswith("arvore/"):
            self._escrever("diff.patch", diff_entre(self.pasta / "base", self.pacote / "arvore"))
            self.saida_tudo, self.falhados = self.artefactos(self.pacote / "arvore", self.pacote)
        elif ficheiro in ("folha.toml",):
            pass
        else:
            raise Recusa(f"refused: {ficheiro} is not a file this seat's plants can go in "
                         "(peca.md, folha.toml, metodo.md, TEXTOS-NUMERADOS.md, or a file under arvore/)")

    def _escrever(self, relativo, dados):
        _escrever(self.pacote, relativo, dados)

    def peca_inteira(self, ficheiro: str) -> bytes | None:
        """The whole piece as it would be with the package's planted file, for checks 1, 2, 3, 6."""
        if self.alvo["tipo"] != "peca":
            return None
        original = Path(self.alvo["caminho"]).read_bytes()
        partes = secoes(original)
        registo_ = original[len(partes["_ate_registo"]):]
        if ficheiro == "peca.md":
            return (self.pacote / "peca.md").read_bytes() + registo_
        if ficheiro == "folha.toml":
            inicio = partes["_ate_registo"][: len(partes["_ate_registo"]) - len(partes["folha"])]
            return inicio + (self.pacote / "folha.toml").read_bytes() + registo_
        return None


def plantar(pasta: Path, lista: Path, loja: Path | None = None, repo: Path = REPO, imprimir=print,
            artefactos=artefactos_da_arvore) -> list[dict]:
    """Plant every error of the list, or none: a refusal puts the package back as it was."""
    pasta = Path(pasta)
    if (pasta / "chave.json").exists():
        raise Recusa("refused: this package was already planted (chave.json exists); build a new one")
    # Before the first plant, the package must be what montar built: an edit made by hand in
    # between would otherwise be taken into the hashes plantar records, and pass every later check.
    pacote_intacto(pasta)
    plantas = _ler_lista(lista)
    leitura_ = ler_json(pasta / "leitura.json")
    if leitura_["alvo"]["tipo"] == "codigo" and leitura_.get("codigo", {}).get("saida_tudo") != 0:
        raise Recusa(f"refused: tudo did not exit 0 in the unplanted tree (exit {leitura_.get('codigo', {}).get('saida_tudo')}), "
                     "so no plant could be shown to pass the checks and the tests; build the package again from a sound tree")
    if leitura_["alvo"]["tipo"] == "peca" and (loja is None or not Path(loja).is_dir()):
        raise Recusa("refused: OEDP_FONTES is not set or does not exist here, and check 2 must run on the planted piece "
                     "to prove that no check catches the plant by itself")
    pacote = pasta / "pacote"
    copia = Path(tempfile.mkdtemp(prefix="oedp-antes-de-plantar-"))
    shutil.copytree(pacote, copia / "pacote", symlinks=True)
    p = Plantador(pasta, loja, repo, artefactos)
    chave = []
    try:
        for planta in plantas:
            chave.append(_uma_planta(p, planta))
        _provas_finais(pacote, plantas, chave, Path(lista))
    except BaseException:
        shutil.rmtree(pacote)
        shutil.copytree(copia / "pacote", pacote, symlinks=True)
        raise
    finally:
        shutil.rmtree(copia, ignore_errors=True)
    mesma_hora(pacote)
    escrever_json(pasta / "chave.json", {"plantas": chave, "plantada_em": agora(), "ficheiros": ficheiros_do_pacote(pacote)})
    for c in chave:
        imprimir(f"{c['id']}: planted in {c['ficheiro']}; its places: {', '.join(c['lugares']) or '(see the lines)'}")
    return chave


def _uma_planta(p: Plantador, planta: dict) -> dict:
    pacote = p.pacote
    pid, ficheiro = planta["id"], planta["ficheiro"]
    alvo_f = _dentro(pacote, ficheiro)
    texto = _texto(alvo_f)
    # 1. found exactly once; the words that make it false are in another file of the package
    if texto.count(planta["antes"]) != 1:
        raise Recusa(f"refused: {pid}: antes is found {texto.count(planta['antes'])} times in {ficheiro}; it must be found exactly once")
    if Path(planta["desmente_em"]).as_posix() == Path(ficheiro).as_posix():
        raise Recusa(f"refused: {pid}: desmente_em is the planted file itself; the words that make the plant false must be in another file")
    if derivado_de(planta["desmente_em"], ficheiro):
        raise Recusa(f"refused: {pid}: desmente_em {planta['desmente_em']} is made again from {ficheiro}, so it would carry the plant too")
    prova = _dentro(pacote, planta["desmente_em"])
    if fontes.normalizar(planta["desmente"]) not in fontes.normalizar(_texto(prova)):
        raise Recusa(f"refused: {pid}: the words of desmente are not in {planta['desmente_em']}, so nothing in the package "
                     "proves the plant false, and it would measure nothing")
    numerado_antes = {n: _texto(pacote / n) for n in ("TEXTO-NUMERADO.md", "TEXTOS-NUMERADOS.md") if (pacote / n).is_file()}
    peca_antes = p.peca_inteira(ficheiro)
    folha_antes = (pacote / "folha.toml").read_bytes() if ficheiro == "folha.toml" else None
    sha_antes = sha(alvo_f.read_bytes())
    # 2. apply it, and make again what derives from the planted file
    alvo_f.write_text(texto.replace(planta["antes"], planta["depois"], 1), encoding="utf-8")
    p.refazer(ficheiro)
    sha_depois = sha(alvo_f.read_bytes())
    lugares: list[str] = []
    # 3. the reader can see it; 5. where it is, in the words of a finding
    if ficheiro.startswith("arvore/"):
        # the whole lines of the planted file that hold the new text, each as an added line of the diff
        plantado = _texto(alvo_f)
        inicio = plantado.index(planta["depois"])
        fim = inicio + len(planta["depois"].rstrip("\n"))
        primeira = plantado.count("\n", 0, inicio) + 1
        linhas = list(range(primeira, plantado.count("\n", 0, fim) + 2))
        inteiras = plantado.split("\n")[primeira - 1 : linhas[-1]]
        diff = (pacote / "diff.patch").read_text(encoding="utf-8", errors="replace").splitlines()
        if not any(l.strip() for l in inteiras) or not all(("+" + l) in diff for l in inteiras if l.strip()):
            raise Recusa(f"refused: {pid}: the planted line is not in diff.patch, so the code reader cannot see it")
        relativo = ficheiro[len("arvore/"):]
        lugares = [f"ficheiro {relativo}"]
        extra = {"ficheiro_codigo": relativo, "linhas": linhas}
        # 4. tudo exits 0 in the planted tree (it did in the unplanted one, or plantar refused)
        if p.saida_tudo != 0:
            raise Recusa(f"refused: {pid}: tudo exits {p.saida_tudo} in the planted tree (failing: "
                         f"{', '.join(p.falhados) or 'no test named'}); a plant a check or a test catches measures the check, not the reader")
    else:
        extra = {}
        for nome, antes_n in numerado_antes.items():
            lugares += lugares_no_texto(antes_n, _texto(pacote / nome))
        if folha_antes is not None:
            lugares += lugares_na_folha(folha_antes, (pacote / "folha.toml").read_bytes())
        if ficheiro == "peca.md":  # a plant in the piece's fact sheet is named by its line too
            lugares += lugares_na_folha(secoes(peca_antes)["folha"], secoes(p.peca_inteira("peca.md"))["folha"])
        if p.le_o_numerado() and ficheiro != "folha.toml" and not any(l.startswith("frase ") for l in lugares):
            raise Recusa(f"refused: {pid}: the numbered text did not change, so a reader of it cannot see the plant")
        if not lugares:
            raise Recusa(f"refused: {pid}: the plant changed nothing a finding could name")
        # 4. checks 1, 2, 3 and 6 give the same result on the planted piece
        if peca_antes is not None:
            antes_c, depois_c = _conferencias(peca_antes, p.loja), _conferencias(p.peca_inteira(ficheiro), p.loja)
            if antes_c != depois_c:
                mudou = [f"check {d[0]}: {d[1]}" + (f" ({'; '.join(d[2])})" if d[2] else "")
                         for a, d in zip(antes_c, depois_c) if a != d]
                raise Recusa(f"refused: {pid}: a check gives another result on the planted piece ({' | '.join(mudou)}); "
                             "a plant a check catches measures the check, not the reader")
    return {"id": pid, "ficheiro": ficheiro, "descricao": planta["descricao"], "desmente": planta["desmente"],
            "desmente_em": planta["desmente_em"], "lugares": sorted(set(lugares), key=lambda x: (x.split()[0], _num(x))),
            "sha256_antes": sha_antes, "sha256_depois": sha_depois, "antes": planta["antes"], "depois": planta["depois"], **extra}


def derivado_de(relativo: str, ficheiro: str) -> bool:
    """Whether a file of the package is made again from the planted file (see Plantador.refazer)."""
    relativo = Path(relativo).as_posix()
    if ficheiro in ("peca.md", "metodo.md"):
        return relativo == "TEXTO-NUMERADO.md"
    if ficheiro == "TEXTOS-NUMERADOS.md":
        return relativo.startswith("construido/")
    if ficheiro.startswith("arvore/"):
        return relativo in ("diff.patch", "saida-tudo.txt") or relativo.startswith(("construido/", "construido-sem-pecas/"))
    return False


def _num(lugar: str):
    m = re.search(r"(\d+)$", lugar)
    return int(m.group(1)) if m else 0


def _provas_finais(pacote: Path, plantas: list[dict], chave: list[dict], lista: Path):
    """6. Each plant in place; nothing of the list inside the package."""
    for planta, c in zip(plantas, chave):
        texto = _texto(pacote / c["ficheiro"])
        if planta["depois"] not in texto:
            raise Recusa(f"refused: {planta['id']}: its new text is not in {c['ficheiro']} after the last plant")
        if planta["antes"] not in planta["depois"] and planta["antes"] in texto:
            raise Recusa(f"refused: {planta['id']}: its old text is still in {c['ficheiro']} after the last plant")
    valores = {planta[k] for planta in plantas for k in ("antes", "depois", "desmente")}
    linhas_de_valores = {l.strip() for v in valores for l in v.splitlines()}
    proibidas = [l.strip() for l in Path(lista).read_text(encoding="utf-8").splitlines()
                 if l.strip() and not re.fullmatch(r"\[\[\w+\]\]", l.strip()) and l.strip() not in linhas_de_valores
                 and not any(l.strip() in v for v in valores) and len(l.strip()) >= 8]
    for f in sorted(pacote.rglob("*")):
        if not f.is_file():
            continue
        try:  # a reader reads text; bytes of a font or an image that happen to spell an id are not a leak
            texto = f.read_bytes().decode("utf-8")
        except UnicodeDecodeError:
            continue
        nome = f.relative_to(pacote).as_posix()
        for planta in plantas:
            if planta["descricao"] in texto:
                raise Recusa(f"refused: the descricao of {planta['id']} is inside the package ({nome})")
            if re.search(rf"(?<![\w-]){re.escape(planta['id'])}(?![\w-])", texto):
                raise Recusa(f"refused: the id {planta['id']} is inside the package ({nome}); give the plant an id found nowhere in it")
        for l in proibidas:
            if l in texto:
                raise Recusa(f"refused: a line of the list of plants is inside the package ({nome})")


# --------------------------------------------------------------------------- A3: lancar


def executar_ler_sh(args: list[str], ambiente: dict) -> tuple[int, str]:
    r = subprocess.run(args, capture_output=True, text=True, env=ambiente)
    return r.returncode, r.stdout + r.stderr


def tokens_do_registo(registo_f: Path) -> int | None:
    """The number on the line after the last `tokens used` of the launcher's log, or None."""
    if not registo_f.is_file():
        return None
    linhas = registo_f.read_text(encoding="utf-8", errors="replace").splitlines()
    for i in range(len(linhas) - 2, -1, -1):
        if linhas[i].strip() == "tokens used":
            numero = linhas[i + 1].strip().replace(",", "").replace(" ", "").replace("\u202f", "")
            return int(numero) if numero.isdigit() else None
    return None


def lancar(pasta: Path, executar=executar_ler_sh, ambiente: dict | None = None, imprimir=print) -> int:
    pasta = Path(pasta)
    try:
        pacote_intacto(pasta)
    except Recusa as e:
        imprimir(str(e))
        return 2
    dados = ler_json(pasta / "leitura.json")
    lugar = dados["lugar"]
    prompt_f, saida = pasta / "PROMPT.md", pasta / "LEITURA.md"
    if lugar in CLAUDE:
        imprimir(f"the {lugar} is a Claude seat: nothing is launched here.")
        imprimir(f"its prompt: {prompt_f}")
        imprimir(f"its working folder: {pasta / 'pacote'}")
        imprimir(f"its answer must be written to: {saida}")
        imprimir("then: python3 -m oedp leitura pontuar <folder> --modelo <model> --inicio <time> --fim <time>")
        return 0
    amb = dict(os.environ if ambiente is None else ambiente)
    if not amb.get("CODEX_RACIOCINIO"):
        imprimir("refused: CODEX_RACIOCINIO is not set; ler.sh refuses to run without a reasoning effort chosen for the task")
        return 2
    if saida.exists():
        imprimir(f"refused: {saida.name} exists; this reading was launched already")
        return 2
    inicio = agora()
    codigo_saida, texto = executar([str(LER_SH), str(pasta / "pacote"), str(prompt_f), str(saida)], amb)
    fim = agora()
    m = re.search(r"modelo (\S+)", texto)
    tokens = tokens_do_registo(Path(str(saida) + ".eventos.log"))
    if tokens is None:
        dados.pop("tokens", None)
        imprimir(f"note: the launcher's log ({saida.name}.eventos.log) has no line 'tokens used' followed by a number; "
                 "the reading's cost is not recorded")
    else:
        dados["tokens"] = tokens
    dados.update({"inicio": inicio, "fim": fim, "modelo": m.group(1) if m else "", "lancada_em": inicio,
                  "ler_sh": texto.strip().splitlines()[-1] if texto.strip() else ""})
    escrever_json(pasta / "leitura.json", dados)
    imprimir(texto.strip())
    if codigo_saida != 0 or not saida.is_file():
        imprimir(f"the reading did not finish: ler.sh exited {codigo_saida}" + ("" if saida.is_file() else f", and {saida.name} is missing"))
        return 1
    if not m:
        imprimir("ler.sh did not name the model; leitura.json has none, and pontuar will refuse")
        return 1
    return 0


# --------------------------------------------------------------------------- A4: pontuar

GRAVIDADES = ("trava", "corrigir", "menor")
ONDE = re.compile(r"(frase [1-9]\d*|linha [a-z][a-z0-9_]*|fonte [a-z][a-z0-9_]*|ficheiro \S+:[1-9]\d*|geral)\Z")


def bloco_final(texto: str) -> dict:
    """The last fenced toml block of a reader's answer. Raises Recusa."""
    blocos = re.findall(r"```toml[ \t]*\n(.*?)\n```", texto, re.S)
    if not blocos:
        raise Recusa("refused: LEITURA.md has no fenced toml block, so there is nothing to score")
    try:
        dados = tomllib.loads(blocos[-1])
    except tomllib.TOMLDecodeError as e:
        raise Recusa(f"refused: the last toml block of LEITURA.md does not parse ({e})") from None
    achados = dados.get("achado", [])
    if not isinstance(achados, list):
        raise Recusa("refused: achado must be [[achado]] tables")
    for n, a in enumerate(achados, 1):
        onde = a.get("onde") if isinstance(a, dict) else None
        if not isinstance(onde, str) or not ONDE.match(onde):
            raise Recusa(f"refused: [[achado]] number {n} has onde {onde!r}, which is not one of the forms of the common page "
                         "(frase <N> | linha <id> | fonte <id> | ficheiro <path>:<line> | geral)")
        if a.get("gravidade") not in GRAVIDADES:
            raise Recusa(f"refused: [[achado]] number {n} has gravidade {a.get('gravidade')!r}, which is not exactly "
                         "trava, corrigir or menor; a finding is not read as a lesser one than it says")
    return dados


def familias_produtoras(dados: dict) -> set[str]:
    """The family that produced what the reading read, from the target's record as it is now."""
    alvo = dados["alvo"]
    caminho = Path(alvo["caminho"])
    if alvo["tipo"] == "peca":
        return {p.get("familia") for p in ler(caminho).registo.get("passo", [])}
    if alvo["tipo"] == "metodo":
        _, reg, _ = julgados.metodo(caminho)
        return {p.get("familia") for p in reg.get("passo", []) if p.get("nome") == "escrita"}
    if alvo["tipo"] == "textos":
        f = caminho.parent / "textos.registo.toml"
        reg = tomllib.loads(f.read_text(encoding="utf-8")) if f.is_file() else {}
        return {p.get("familia") for p in reg.get("passo", []) if p.get("nome") == "escrita"}
    tabelas, _ = codigo.ler(caminho)
    leituras = [i for i, (n, t) in enumerate(tabelas) if n == "leitura" and t.get("veredicto") == "passa"]
    desde = leituras[-1] if leituras else -1
    return {t.get("familia") for i, (n, t) in enumerate(tabelas) if n == "passo" and i > desde}


def _ficheiro_do_achado(onde: str) -> str | None:
    m = re.match(r"ficheiro (\S+):\d+\Z", onde)
    return m.group(1) if m else None


def pontuar(pasta: Path, decisoes: Path | None = None, modelo: str | None = None, inicio: str | None = None,
            fim: str | None = None, imprimir=print) -> dict:
    pasta = Path(pasta)
    pacote_intacto(pasta)
    dados = ler_json(pasta / "leitura.json")
    lugar = dados["lugar"]
    leitura_f = pasta / "LEITURA.md"
    if not leitura_f.is_file():
        raise Recusa("refused: LEITURA.md is not there yet")
    bloco = bloco_final(leitura_f.read_text(encoding="utf-8"))
    if lugar in CLAUDE:
        if not (modelo and inicio and fim):
            raise Recusa(f"refused: the {lugar} is a Claude seat: give --modelo, --inicio and --fim")
        dados.update({"modelo": modelo, "inicio": inicio, "fim": fim})
    for campo in ("modelo", "inicio", "fim"):
        if not dados.get(campo):
            raise Recusa(f"refused: leitura.json has no {campo}; launch the reading with `leitura lancar` first")
    chave = ler_json(pasta / "chave.json")["plantas"] if (pasta / "chave.json").is_file() else []
    decid = tomllib.loads(Path(decisoes).read_text(encoding="utf-8")) if decisoes else {}
    achados = bloco.get("achado", [])
    d_achados = {d.get("achado"): d for d in decid.get("decisao", [])}
    d_plantas = {d.get("id"): d for d in decid.get("planta", [])}
    for n, d in d_achados.items():
        if d.get("decisao") not in ("adotado", "recusado") or (d.get("decisao") == "recusado" and not d.get("razao")):
            raise Recusa(f"refused: the decision on finding {n} must be adotado, or recusado with its razao")

    # Which finding caught which plant.
    apanhadoras: dict[str, list[int]] = {}
    candidatas: dict[str, list[int]] = {}
    for c in chave:
        exatos = set(c["lugares"]) - {l for l in c["lugares"] if l.startswith("ficheiro ")}
        for n, a in enumerate(achados, 1):
            if a["onde"] in exatos:
                apanhadoras.setdefault(c["id"], []).append(n)
            f = _ficheiro_do_achado(a["onde"])
            rel = c.get("ficheiro_codigo")
            if rel and f and (f in (rel, "arvore/" + rel, "diff.patch") or f.endswith("/" + rel)):
                candidatas.setdefault(c["id"], []).append(n)
    por_decidir = []
    resultado_plantas = []
    for c in chave:
        d = d_plantas.get(c["id"])
        auto = apanhadoras.get(c["id"], [])
        cand = candidatas.get(c["id"], [])
        if d is not None:
            if d.get("apanhada") is True and not auto and d.get("achado") not in cand:
                raise Recusa(f"refused: the decision on {c['id']} says caught, but no finding is at its places or in its file; "
                             "a decision may never turn a miss into a catch")
            apanhada = bool(d.get("apanhada")) and (d.get("achado") in auto + cand)
            if d.get("apanhada") and not apanhada:
                raise Recusa(f"refused: the decision on {c['id']} names finding {d.get('achado')}, which is not at its places or in its file")
            por = [d.get("achado")] if apanhada else []
        elif cand and not auto:
            por_decidir.append(f"{c['id']} ({c['ficheiro_codigo']}, lines {c.get('linhas')}): candidate findings {cand}")
            continue
        else:
            apanhada, por = bool(auto), auto
        resultado_plantas.append({"id": c["id"], "descricao": c["descricao"], "apanhada": apanhada, "achados": por,
                                  "problemas": [achados[i - 1].get("problema", "") for i in por]})
    if por_decidir:
        raise Recusa("refused: a finding in a planted file is only a candidate; the decisions file must say for each "
                     "[[planta]] apanhada = true or false, with the finding's number: " + "; ".join(por_decidir))
    usados = {i for r in resultado_plantas for i in r["achados"]}
    reais = [(n, a) for n, a in enumerate(achados, 1) if n not in usados]

    postas, apanhadas = len(chave), sum(1 for r in resultado_plantas if r["apanhada"])
    razoes = []
    familia = dados["familia"]
    produtoras = familias_produtoras(dados)
    if familia in produtoras:
        veredicto = "levanta"
        razoes.append(f"the seat is of {familia}, the family that produced what it read: it can only raise")
    else:
        if not produtoras:
            razoes.append("the family that produced what was read is not on record")
        if apanhadas != postas:
            razoes.append(f"caught {apanhadas} of {postas} plants")
        if lugar in COM_PLANTAS_OBRIGATORIAS and postas < 1:
            razoes.append(f"a {lugar} reading needs at least one plant")
        trava = [n for n, a in reais if a.get("gravidade") == "trava"]
        if trava:
            razoes.append(f"real findings at trava: {trava} (closed only by a repair read again)")
        # For the seats whose pass the checks count, a real finding adopted, of any severity, stops a
        # pass: adopting it means what was read is about to change, and the pass belongs to what is
        # read after the repair (ORDEM-3b, item I; equipa/00-comum.md since 14:28 UTC, 15 November 2026).
        adotados_reais = [n for n, _ in reais if d_achados.get(n, {}).get("decisao") == "adotado"]
        if lugar in COM_PLANTAS_OBRIGATORIAS and adotados_reais:
            razoes.append(f"real findings adopted: {adotados_reais} (what was read is about to change; the pass belongs to "
                          "what is read after the repair)")
        veredicto = "nao_passa" if razoes else "passa"
        sem_decisao = [n for n, a in reais if n not in d_achados and a.get("gravidade") != "trava"]
        if sem_decisao and veredicto == "passa":
            raise Recusa(f"refused: real findings with no decision: {sem_decisao}; the decisions file must say adotado or recusado for each")
    adotados = sum(1 for n, _ in reais if d_achados.get(n, {}).get("decisao") == "adotado")
    for r in resultado_plantas:
        imprimir(f"{r['id']}: {'caught' if r['apanhada'] else 'missed'} · plant: {r['descricao']}"
                 + "".join(f"\n    finding {n}: {p}" for n, p in zip(r["achados"], r["problemas"])))
    pontuacao = {"lugar": lugar, "familia": familia, "modelo": dados["modelo"], "inicio": dados["inicio"], "fim": dados["fim"],
                 "impressao": dados["impressao"], "plantas_postas": postas, "plantas_apanhadas": apanhadas,
                 "achados": len(reais), "adotados": adotados, "veredicto": veredicto, "razoes": razoes,
                 "veredicto_do_leitor": bloco.get("veredicto"), "plantas": resultado_plantas,
                 "achados_reais": [{"n": n, "onde": a.get("onde"), "gravidade": a.get("gravidade"),
                                    "decisao": d_achados.get(n, {}).get("decisao")} for n, a in reais],
                 "pontuada_em": agora()}
    if lugar in ("justica", "juiz") and "pessoas_vistas" in bloco:
        pontuacao["pessoas_vistas"] = [str(x) for x in bloco.get("pessoas_vistas", [])]
    escrever_json(pasta / "leitura.json", dados)
    escrever_json(pasta / "pontuacao.json", pontuacao)
    imprimir(f"tokens used by the reading: {dados['tokens']}" if dados.get("tokens") is not None
             else "tokens used by the reading: not recorded")
    imprimir(f"verdict on the record: {veredicto} ({apanhadas} of {postas} plants caught, {len(reais)} real findings, "
             f"{adotados} adopted)" + (": " + "; ".join(razoes) if razoes else ""))
    return pontuacao


# --------------------------------------------------------------------------- A5: registar


def ficheiro_do_registo(alvo: dict) -> Path:
    caminho = Path(alvo["caminho"])
    return {"peca": caminho, "metodo": caminho, "textos": caminho.parent / "textos.registo.toml",
            "codigo": caminho / codigo.REGISTO}[alvo["tipo"]]


def leituras_no_registo(alvo: dict) -> list[dict]:
    """The [[leitura]] tables already in the target's record."""
    destino = ficheiro_do_registo(alvo)
    if not destino.is_file():
        return []
    if alvo["tipo"] == "peca":
        return ler(destino).registo.get("leitura", [])
    if alvo["tipo"] == "metodo":
        return julgados.metodo(destino)[1].get("leitura", [])
    if alvo["tipo"] == "codigo":
        return [t for n, t in codigo.em_ordem(destino.read_text(encoding="utf-8")) if n == "leitura"]
    return tomllib.loads(destino.read_text(encoding="utf-8")).get("leitura", [])


def registar(pasta: Path, imprimir=print) -> str:
    pasta = Path(pasta)
    pacote_intacto(pasta)
    dados = ler_json(pasta / "leitura.json")
    p_f, l_f = pasta / "pontuacao.json", pasta / "LEITURA.md"
    if not p_f.is_file():
        raise Recusa("refused: there is no pontuacao.json; score the reading first (leitura pontuar)")
    if l_f.is_file() and p_f.stat().st_mtime < l_f.stat().st_mtime:
        raise Recusa("refused: pontuacao.json is older than LEITURA.md; score the reading again")
    if dados.get("registada_em"):
        raise Recusa(f"refused: this reading was registered already, at {dados['registada_em']}")
    p = ler_json(p_f)
    campos = {k: p[k] for k in ("lugar", "familia", "modelo", "inicio", "fim", "impressao", "plantas_postas",
                                "plantas_apanhadas", "achados", "adotados", "veredicto")}
    if p["lugar"] in ("justica", "juiz") and "pessoas_vistas" in p:
        campos["pessoas_vistas"] = p["pessoas_vistas"]
    destino = ficheiro_do_registo(dados["alvo"])
    # An interrupted registration (the table appended, leitura.json not yet marked) must not
    # append the same reading twice.
    mesma = [l for l in leituras_no_registo(dados["alvo"])
             if all(l.get(k) == campos[k] for k in ("lugar", "inicio", "fim", "impressao"))]
    if mesma:
        raise Recusa(f"refused: the record of {destino.name} already holds a {campos['lugar']} reading with this start, "
                     f"end and fingerprint ({campos['inicio']} to {campos['fim']}, {campos['impressao'][:12]}…); "
                     "it was registered before, perhaps by a run that was interrupted")
    try:
        texto = registo.acrescentar(destino, "leitura", campos)
    except (registo.ErroDoRegisto, ErroDeForma) as e:
        raise Recusa(f"refused: {e}") from None
    dados["registada_em"] = agora()
    escrever_json(pasta / "leitura.json", dados)
    imprimir(texto.strip("\n"))
    return texto
