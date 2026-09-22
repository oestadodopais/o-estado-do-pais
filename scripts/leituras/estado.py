#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""O estado do projeto, LIDO e nunca escrito de memória.

    python3 scripts/leituras/estado.py            o bloco em Markdown, para colar
    python3 scripts/leituras/estado.py --sem-rede só o que se lê sem sair da máquina

PORQUE É QUE ISTO EXISTE (21.09.2026, REGISTO-DE-MELHORIAS M16). No fecho da
sessão de 21.09 o lugar de direção escreveu no prompt da sessão seguinte as horas
da aterragem, o número de uma corrida e uma percentagem de uso sem os ter lido de
lado nenhum nessa volta: três horas estavam erradas, e faltava dizer que a corrida
`portão` de `main` ainda corria. Foi a segunda vez no mesmo dia que um facto
escrito de memória entrou num documento que governa a sessão seguinte. A regra
que sai: o estado de fecho NÃO SE ESCREVE, LÊ-SE. Este guião lê cada facto da sua
fonte e diz de que comando veio; o que não consegue ler diz «NÃO LIDO», com a
razão, e o guião sai com código 1. Nunca escreve um palpite.

O QUE LÊ: as cabeças, os ramos e as worktrees do sítio e do motor (`git`); as
últimas corridas da CI (`gh run list`); o que está no ar (`/version.json` do
sítio publicado, o mesmo que o `verify:deploy` lê); o uso das duas subscrições
(`uso.py`); e os registos dos construtores do Codex em `.claude/codex-*.log`.
"""
from __future__ import annotations

import glob
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SITIO = Path(__file__).resolve().parents[2] if Path(__file__).resolve().parent.name == "leituras" \
    else Path(os.path.expanduser("~/Instruments/OEstadoDoPais"))
MOTOR = Path(os.path.expanduser("~/Instruments/ResearchHub"))
ANFITRIAO = "xn--oestadodopas-2fb.pt"
FALHAS: list[str] = []


def correr(args: list[str], onde: Path, teto: int = 60) -> tuple[int, str]:
    """(código, saída). O código lê-se sempre; uma saída vazia não é um achado."""
    try:
        r = subprocess.run(args, cwd=str(onde), capture_output=True, text=True, timeout=teto)
        return r.returncode, (r.stdout or "") + (("\n" + r.stderr) if r.returncode and r.stderr else "")
    except (OSError, subprocess.TimeoutExpired) as e:
        return 99, f"{type(e).__name__}: {e}"


def nao_lido(o_que: str, porque: str) -> str:
    FALHAS.append(o_que)
    return f"- **NÃO LIDO: {o_que}** ({porque.strip()[:200]})"


def git_de(repo: Path, nome: str, principal: str, rede: bool) -> list[str]:
    linhas = [f"### {nome} (`{repo}`)"]
    if rede:
        c, s = correr(["git", "fetch", "origin"], repo, 90)
        if c != 0:
            linhas.append(nao_lido(f"`git fetch origin` em {nome}", s))
    for ref in (principal, f"origin/{principal}"):
        c, s = correr(["git", "log", "-1", "--format=%h · %cI · %s", ref], repo)
        linhas.append(f"- `{ref}`: {s.strip()[:170]}  (`git log -1 {ref}`)" if c == 0
                      else nao_lido(f"a cabeça de {ref} em {nome}", s))
    c, s = correr(["git", "rev-list", "--left-right", "--count", f"{principal}...origin/{principal}"], repo)
    if c == 0 and len(s.split()) == 2:
        a, b = s.split()
        linhas.append(f"- `{principal}` está {a} à frente e {b} atrás de `origin/{principal}`  (`git rev-list --left-right --count`)")
    else:
        linhas.append(nao_lido(f"a distância a origin/{principal} em {nome}", s))
    c, s = correr(["git", "status", "--short"], repo)
    if c == 0:
        sujos = [l for l in s.split("\n") if l.strip()]
        linhas.append(f"- árvore principal: {len(sujos)} entrada(s) por registar" +
                      (": " + "; ".join(f"`{l.strip()}`" for l in sujos[:8]) if sujos else "") +
                      "  (`git status --short`, código 0)")
    else:
        linhas.append(nao_lido(f"o estado da árvore de {nome}", s))
    c, s = correr(["git", "branch", "--format=%(refname:short) %(objectname:short)"], repo)
    linhas.append("- ramos locais: " + ", ".join(f"`{l}`" for l in s.split("\n") if l.strip()) + "  (`git branch`)"
                  if c == 0 else nao_lido(f"os ramos locais de {nome}", s))
    if rede:
        c, s = correr(["git", "ls-remote", "--heads", "origin"], repo, 90)
        if c == 0:
            ramos = [l.split("refs/heads/")[-1] for l in s.split("\n") if "refs/heads/" in l]
            linhas.append("- ramos no remoto: " + ", ".join(f"`{r}`" for r in ramos) + "  (`git ls-remote --heads origin`)")
        else:
            linhas.append(nao_lido(f"os ramos remotos de {nome}", s))
    c, s = correr(["git", "worktree", "list"], repo)
    if c == 0:
        for l in [x for x in s.split("\n") if x.strip()]:
            linhas.append(f"- worktree: `{' '.join(l.split())}`")
    else:
        linhas.append(nao_lido(f"as worktrees de {nome}", s))
    return linhas


def ci() -> list[str]:
    linhas = ["### As últimas corridas da CI (`gh run list --limit 6`)"]
    c, s = correr(["gh", "run", "list", "--limit", "6", "--json",
                   "databaseId,headSha,headBranch,status,conclusion,workflowName,createdAt,updatedAt"], SITIO, 90)
    if c != 0:
        return linhas + [nao_lido("as corridas da CI", s)]
    try:
        for r in json.loads(s):
            fim = r["conclusion"] or "SEM CONCLUSÃO"
            linhas.append(f"- {r['databaseId']} · `{r['headSha'][:8]}` · {r['headBranch']} · {r['workflowName']} · "
                          f"**{r['status']} / {fim}** · criada {r['createdAt']} · atualizada {r['updatedAt']}")
    except (ValueError, KeyError) as e:
        linhas.append(nao_lido("as corridas da CI", f"{type(e).__name__}: {e}"))
    return linhas


def no_ar() -> list[str]:
    linhas = ["### O que está no ar (`/version.json` do sítio publicado)"]
    url = f"https://{ANFITRIAO}/version.json?t={int(datetime.now().timestamp())}"
    # Pelo `curl` e não pelo `urllib`: o Python desta máquina não traz o feixe de
    # certificados ligado (medido a 21.09.2026: CERTIFICATE_VERIFY_FAILED), e a
    # verificação NUNCA se desliga. O `curl` usa o feixe do sistema.
    c, s = correr(["curl", "-sS", "-m", "25", "--fail", "-H", "cache-control: no-cache",
                   "-A", "OEstadoDoPais/estado", url], SITIO, 40)
    if c != 0:
        return linhas + [nao_lido("o carimbo do sítio publicado", f"curl saiu com {c}: {s}")]
    try:
        carimbo = json.loads(s)
    except ValueError as e:  # uma resposta que não é JSON é «não lido», nunca um palpite
        return linhas + [nao_lido("o carimbo do sítio publicado", f"{type(e).__name__}: {e}")]
    commit = (carimbo.get("commit") or "")
    linhas.append(f"- commit no ar: `{commit[:8] or 'SEM COMMIT'}` · construído em {carimbo.get('construido_em')} · "
                  f"ref `{carimbo.get('ref')}` · {carimbo.get('env')}")
    c, s = correr(["git", "rev-parse", "origin/main"], SITIO)
    if c == 0:
        igual = s.strip() == commit
        linhas.append(f"- igual a `origin/main` (`{s.strip()[:8]}`): **{'sim' if igual else 'NÃO'}**")
        if not igual:
            FALHAS.append("o que está no ar não é origin/main")
    else:
        linhas.append(nao_lido("origin/main para comparar com o que está no ar", s))
    linhas.append("- isto NÃO substitui o `npm run verify:deploy`, que confere também as respostas e os cabeçalhos.")
    return linhas


def uso() -> list[str]:
    linhas = ["### O uso das duas subscrições (`python3 scripts/leituras/uso.py`)"]
    c, s = correr([sys.executable, "scripts/leituras/uso.py"], SITIO)
    if c != 0:
        linhas.append(nao_lido("o uso das subscrições", s))
    linhas += [f"    {l}" for l in s.strip().split("\n") if l.strip()]
    return linhas


def construtores() -> list[str]:
    linhas = ["### Os construtores do Codex (`.claude/codex-*.log`)"]
    registos = sorted(glob.glob(str(SITIO / ".claude" / "codex-*.log")))
    if not registos:
        return linhas + ["- nenhum registo de construtor nesta árvore (a pasta foi lida; não há ficheiros `codex-*.log`)"]
    c, vivos = correr(["ps", "-axo", "pid,etime,command"], SITIO)
    for p in registos:
        try:
            texto = Path(p).read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            linhas.append(nao_lido(f"o registo {os.path.basename(p)}", str(e)))
            continue
        inicio = re.findall(r"^INICIO .*$", texto, re.M)
        fim = re.findall(r"^FIM exit=.*$", texto, re.M)
        simbolos = re.findall(r"(?im)^tokens used.*$\n?.*$", texto)
        estado = f"**{fim[-1]}**" if fim else "**ainda sem a linha `FIM exit=`**"
        linhas.append(f"- `{os.path.basename(p)}`: {inicio[-1] if inicio else 'SEM LINHA INICIO'} · {estado} · "
                      f"{len(texto.splitlines())} linhas")
        if simbolos:
            linhas.append(f"    - {' '.join(simbolos[-1].split())}")
        if not fim and c == 0:
            n = sum(1 for l in vivos.split("\n") if "codex exec" in l and "grep" not in l)
            linhas.append(f"    - processos `codex exec` vivos nesta máquina agora: {n}  (`ps -axo`)")
    return linhas


def main(argv: list[str]) -> int:
    rede = "--sem-rede" not in argv
    agora = datetime.now(timezone.utc).strftime("%d.%m.%Y às %H:%M:%S UTC")
    bloco = [f"## O estado, lido a {agora} por `scripts/leituras/estado.py`", "",
             "*Cada linha foi lida agora, do comando que ela própria diz. O que não se leu diz «NÃO LIDO». "
             "Nada aqui foi escrito de memória; o que se acrescentar à mão por baixo deste bloco diz que o foi.*", ""]
    bloco += git_de(SITIO, "O sítio", "main", rede) + [""]
    if rede:
        bloco += ci() + [""] + no_ar() + [""]
    bloco += git_de(MOTOR, "O motor", "master", rede) + [""]
    bloco += uso() + [""] + construtores() + [""]
    if FALHAS:
        bloco.append(f"**{len(FALHAS)} leitura(s) falharam: " + "; ".join(FALHAS) + ".** O guião sai com código 1.")
    print("\n".join(bloco))
    return 1 if FALHAS else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
