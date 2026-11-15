"""Publishing: `python3 -m oedp publicar [--ensaio]`, run by the funder or the direction seat
on the laptop, from a checkout whose `.vercel/project.json` links it to the project.

In order, stopping at the first thing that fails:

1. Refused unless the working tree has no change to a tracked file, `HEAD` is
   `origin/main` after `git fetch origin main`, OEDP_FONTES and OEDP_OFICINA are set, and
   `.vercel/project.json` exists. Refused, too, when the publishing log has no line whose
   result is `no ar`: there would be nothing to put back (the direction seat writes the
   first line by hand, for the holding page).
2. `conferir` on every piece, with nothing that binds a published piece left "not run
   here"; the code's gate (oedp/codigo.py), which binds whatever is sent to the host;
   `construir` into `.vercel/output/`.
3. With `--ensaio`, it stops here and prints the two commands it would run. Otherwise
   `vercel deploy --prebuilt --prod --skip-domain --yes` (the deployment's address is
   what it prints to standard output; standard error is kept in the workshop), then
   `vercel promote <address> --yes`.
4. `no-ar` against `endereco` (sitio.toml), again every five seconds for up to two
   minutes, until it passes.
5. If it has not passed: `vercel promote <the previous address> --yes`, where the previous
   address is that of the last line of the log whose result was `no ar`; then the front
   page at `endereco` is fetched and compared (SHA-256) with the one that line recorded.
   Exit 1.
6. Every attempt that reaches step 3 appends one line to `publicacoes.jsonl` in the
   workshop: `em`, `commit`, `implantacao` (the deployment's address), `manifesto_sha256`
   and `inicio_sha256` (of the built `manifesto.json` and front page), and `resultado`
   (`no ar`, or what failed).

A deployment's own address holds the account's name, so it is written only to the
workshop, never to a tracked file. The commands that run `vercel` and that fetch are
parameters, so the tests give stand-ins.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import subprocess
import time
import tomllib
from dataclasses import dataclass
from pathlib import Path

DEPLOY = ["vercel", "deploy", "--prebuilt", "--prod", "--skip-domain", "--yes"]
NO_AR = "no ar"
ESPERA_S, PASSO_S = 120, 5
BUSCA_S = 10  # seconds each fetch of the comparison after promotion may take


class Recusa(Exception):
    pass


def correr_comando(args: list[str], cwd: Path) -> tuple[int, str, str]:
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr


def agora() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _git(repo: Path, *args) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True)


def condicoes(repo: Path, ambiente: dict) -> list[str]:
    """Step 1: why publishing is refused here; empty when it may go on."""
    razoes = []
    from . import marca

    if (Path(repo) / marca.FICHEIRO).exists():
        razoes.append(f"{marca.FICHEIRO} is here: this is a tree assembled for the tests, and nothing is published from one")
    mudancas = _git(repo, "status", "--porcelain", "--untracked-files=no")
    if mudancas.returncode != 0:
        razoes.append(f"git status failed ({mudancas.stderr.strip()})")
    elif mudancas.stdout.strip():
        razoes.append("the working tree has changes to tracked files: " + "; ".join(mudancas.stdout.strip().splitlines()[:5]))
    buscado = _git(repo, "fetch", "--quiet", "origin", "main")
    if buscado.returncode != 0:
        razoes.append(f"git fetch origin main failed ({buscado.stderr.strip()})")
    else:
        cabeca = _git(repo, "rev-parse", "HEAD").stdout.strip()
        principal = _git(repo, "rev-parse", "origin/main").stdout.strip()
        if not cabeca or cabeca != principal:
            razoes.append(f"HEAD ({cabeca[:12]}) is not origin/main ({principal[:12]}); only what is on main is published")
    for nome in ("OEDP_FONTES", "OEDP_OFICINA"):
        if not str(ambiente.get(nome, "")).strip():
            razoes.append(f"{nome} is not set")
    if not (Path(repo) / ".vercel" / "project.json").is_file():
        razoes.append(".vercel/project.json does not exist, so this checkout is not linked to the project")
    return razoes


def registo_de_publicacoes(oficina: Path) -> Path:
    return Path(oficina) / "publicacoes.jsonl"


def ultima_no_ar(oficina: Path) -> dict | None:
    """The last line of the log whose result was `no ar`."""
    f = registo_de_publicacoes(oficina)
    if not f.is_file():
        return None
    ultima = None
    for n, linha in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
        if not linha.strip():
            continue
        try:
            dados = json.loads(linha)
        except json.JSONDecodeError:
            raise Recusa(f"refused: publicacoes.jsonl line {n} is not JSON") from None
        if dados.get("resultado") == NO_AR:
            ultima = dados
    return ultima


def acrescentar(oficina: Path, linha: dict):
    with open(registo_de_publicacoes(oficina), "a", encoding="utf-8") as f:
        f.write(json.dumps(linha, ensure_ascii=False, sort_keys=True) + "\n")


def endereco(repo: Path) -> str:
    sitio = tomllib.loads((Path(repo) / "sitio.toml").read_text(encoding="utf-8"))
    valor = str(sitio.get("endereco", "")).strip()
    if not valor.startswith("https://"):
        raise Recusa("refused: sitio.toml has no endereco (the public address, https://…)")
    return valor


def sha_de(f: Path) -> str:
    return hashlib.sha256(Path(f).read_bytes()).hexdigest()


@dataclass
class Preparado:
    ok: bool
    mensagens: list[str]
    estatica: Path | None


def preparar(repo: Path, loja: Path | None, imprimir=print) -> Preparado:
    """Step 2: the checks, the code's gate, and the build into .vercel/output/."""
    from . import codigo
    from . import conferir as conf
    from . import construir as build
    from .__main__ import conferir_tudo
    from .peca import pecas_em

    mensagens = []
    pecas = pecas_em(repo)
    ok, resultados = conferir_tudo(pecas, raiz=repo, imprimir=imprimir)
    if not ok:
        mensagens.append("conferir failed")
    from .peca import ler

    vinculadas = set()
    for c in pecas:
        try:
            p = ler(c)
        except Exception:
            continue
        if p.vinculada:
            vinculadas.add(p.id)
    abertos = [r.linha() for r in resultados if r.estado == conf.NAO_CORRIDO and r.alvo in vinculadas]
    if abertos:
        mensagens.append("a check that binds a published piece was not run here: " + " | ".join(abertos))
    try:
        tabelas, onde = codigo.ler(repo)
        portao = codigo.erros_do_portao(tabelas, codigo.impressao(repo))
        if onde:
            portao += codigo.historia(repo, Path(onde))
    except codigo.ErroDoCodigo as e:
        portao = [f"code: {e}"]
    if portao:
        mensagens.append("the code's gate is closed: " + " | ".join(portao))
    if mensagens:
        return Preparado(False, mensagens, None)
    c = build.construir(repo, saida=Path(repo) / ".vercel" / "output", loja=loja)
    for m in c.mensagens:
        imprimir(m)
    if not c.ok:
        return Preparado(False, ["the build failed"] + c.mensagens, None)
    return Preparado(True, [], c.estatica)


def publicar(repo: Path, oficina: Path | None, loja: Path | None, ambiente: dict, ensaio: bool = False,
             correr=correr_comando, buscar=None, dormir=time.sleep, relogio=time.monotonic, preparar_=preparar,
             imprimir=print) -> int:
    from . import noar

    buscar = buscar or (lambda url: noar.buscar_na_rede(url, tempo=BUSCA_S))
    razoes = condicoes(repo, ambiente)
    if razoes:
        for r in razoes:
            imprimir(f"refused: {r}")
        return 2
    anterior = ultima_no_ar(oficina)
    if anterior is None:
        imprimir("refused: publicacoes.jsonl in the workshop has no line whose result is 'no ar', so a failed deployment "
                 "could not be put back; the direction seat writes the first line by hand, for the holding page")
        return 2
    publico = endereco(repo)
    p = preparar_(repo, loja, imprimir)
    if not p.ok:
        for m in p.mensagens:
            imprimir(f"refused: {m}")
        return 1
    # Nothing is sent that was not built and checked now: the output holds static/ and config.json only.
    saida = Path(p.estatica).parent
    outros = sorted(f.name for f in saida.iterdir() if f.name not in ("static", "config.json"))
    if outros:
        imprimir(f"refused: {saida.name}/ holds {', '.join(outros)}, which this build did not make and the checks did not read; "
                 "only static/ and config.json are sent")
        return 1
    commit = _git(repo, "rev-parse", "HEAD").stdout.strip()
    linha = {"em": agora(), "commit": commit, "manifesto_sha256": sha_de(p.estatica / "manifesto.json"),
             "inicio_sha256": sha_de(p.estatica / "index.html")}
    if ensaio:
        imprimir("rehearsal: the build is ready in .vercel/output/; these two commands would run now:")
        imprimir("  " + " ".join(DEPLOY))
        imprimir("  vercel promote <the address the first command prints> --yes")
        imprimir(f"then no-ar against {publico}, every {PASSO_S} seconds for up to {ESPERA_S} seconds; "
                 f"on failure, vercel promote {anterior.get('implantacao')} --yes")
        return 0
    codigo_d, saida, erro = correr(DEPLOY, repo)
    erros_f = Path(oficina) / "publicacoes" / f"{linha['em'].replace(':', '')}-deploy-stderr.txt"
    erros_f.parent.mkdir(parents=True, exist_ok=True)
    erros_f.write_text(erro, encoding="utf-8")
    implantacao = saida.strip().splitlines()[-1].strip() if saida.strip() else ""
    if codigo_d != 0 or not implantacao.startswith("https://"):
        acrescentar(oficina, {**linha, "implantacao": implantacao, "resultado": f"falhou: vercel deploy exited {codigo_d}"})
        imprimir(f"failed: vercel deploy exited {codigo_d}; its standard error is in {erros_f}")
        return 1
    linha["implantacao"] = implantacao
    codigo_p, _, erro_p = correr(["vercel", "promote", implantacao, "--yes"], repo)
    if codigo_p != 0:
        # The command may have taken effect before its answer was lost: compare anyway.
        imprimir(f"vercel promote exited {codigo_p} ({erro_p.strip()}); the public address is compared anyway, "
                 "since the promotion may have taken effect")
    # Step 4, bounded by the clock: each fetch gets BUSCA_S seconds, the clock is read before
    # every fetch, so the roll-back begins no later than ESPERA_S and one fetch after this.
    prazo = relogio() + ESPERA_S
    passou_o_prazo = lambda: relogio() >= prazo
    vistos: dict = {}  # the latest answer of each address, over the passes: what the decision below reads
    while True:
        razoes = noar.conferir(publico, p.estatica, buscar, parar=passou_o_prazo, vistos=vistos)
        if not razoes:
            nota = f"; vercel promote had exited {codigo_p}" if codigo_p else ""
            acrescentar(oficina, {**linha, "resultado": NO_AR, **({"nota": nota.lstrip("; ")} if nota else {})})
            imprimir(f"check 10 (live is built) · {publico}: passed; published {commit[:12]}{nota}")
            return 0
        if passou_o_prazo():
            break
        dormir(PASSO_S)
    imprimir(f"check 10 (live is built) · {publico}: failed for {ESPERA_S} seconds: " + " | ".join(razoes[:5]))
    # No fetch after the deadline: what the passes last fetched decides (ORDEM-2d, B3).
    if codigo_p != 0 and vistos.get(publico.rstrip("/") + "/") == anterior.get("inicio_sha256"):
        # The promotion did not take effect: the earlier deployment is still live, nothing to undo.
        acrescentar(oficina, {**linha, "resultado": f"falhou: vercel promote exited {codigo_p}; the public address still "
                                                     "serves the deployment of the last line live"})
        imprimir("failed: the promotion did not take effect; the front page is still the one the last line recorded")
        return 1
    # Step 5: put the earlier deployment back.
    codigo_v, _, erro_v = correr(["vercel", "promote", str(anterior.get("implantacao")), "--yes"], repo)
    frente = _inicio_publico(publico, buscar, imprimir)
    voltou = None if frente is None else frente == anterior.get("inicio_sha256")
    acrescentar(oficina, {**linha, "resultado": f"falhou: no-ar did not pass in {ESPERA_S} s; earlier deployment promoted "
                                                 f"(exit {codigo_v}); front page as before: {voltou}"})
    imprimir(f"rolled back: vercel promote of the earlier deployment exited {codigo_v}" + (f" ({erro_v.strip()})" if codigo_v else "")
             + "; the front page is " + {True: "again", False: "NOT", None: "not known to be"}[voltou]
             + " the one the last line recorded")
    return 1


def _inicio_publico(publico: str, buscar, imprimir) -> str | None:
    """The SHA-256 of the front page at the public address, or None when it cannot be fetched."""
    try:
        return hashlib.sha256(buscar(publico.rstrip("/") + "/")).hexdigest()
    except Exception as e:  # the check must not hide that it could not be made
        imprimir(f"the front page could not be fetched ({e})")
        return None
