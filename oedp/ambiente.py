"""Git's per-repository variables, kept away from the git commands this package runs.

Inside a hook, a `rebase --exec` or a tool, git exports variables such as GIT_DIR and
GIT_INDEX_FILE to every child process (measured on 15 November 2026: in a linked worktree's
pre-commit hook). With them set, `git -C <folder> …` acts on the repository they name, not
on the folder: a test's `git init` or `git commit` on a temporary repository then writes to
the real one. So `python3 -m oedp` clears them at its start (`limpar`), the commands that
mean the repository they are in name it with `-C`, and every git command run on a
temporary repository is given `sem_git_local()` as its environment.
"""
from __future__ import annotations

import os
import subprocess

# What `git rev-parse --local-env-vars` printed with git 2.x on 15 November 2026; used as well
# as git's own list, so that a git that cannot be run still leaves nothing behind.
RESERVA = ("GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_CONFIG", "GIT_CONFIG_PARAMETERS", "GIT_CONFIG_COUNT",
           "GIT_OBJECT_DIRECTORY", "GIT_DIR", "GIT_WORK_TREE", "GIT_IMPLICIT_WORK_TREE", "GIT_GRAFT_FILE",
           "GIT_INDEX_FILE", "GIT_NO_REPLACE_OBJECTS", "GIT_REPLACE_REF_BASE", "GIT_PREFIX", "GIT_SHALLOW_FILE",
           "GIT_COMMON_DIR")


def variaveis_locais() -> tuple[str, ...]:
    """Every variable `git rev-parse --local-env-vars` lists, and those of RESERVA."""
    try:
        r = subprocess.run(["git", "rev-parse", "--local-env-vars"], capture_output=True, text=True,
                           env={k: v for k, v in os.environ.items() if k not in RESERVA})
        nomes = {l.strip() for l in r.stdout.splitlines() if l.strip()} if r.returncode == 0 else set()
    except FileNotFoundError:
        nomes = set()
    return tuple(sorted(nomes | set(RESERVA)))


def sem_git_local(ambiente: dict | None = None) -> dict:
    """A copy of the environment (os.environ by default) without git's per-repository variables."""
    locais = set(variaveis_locais())
    return {k: v for k, v in (os.environ if ambiente is None else ambiente).items() if k not in locais}


def limpar() -> list[str]:
    """Remove git's per-repository variables from this process's environment; the names removed."""
    tirados = [k for k in variaveis_locais() if k in os.environ]
    for k in tirados:
        del os.environ[k]
    return tirados
