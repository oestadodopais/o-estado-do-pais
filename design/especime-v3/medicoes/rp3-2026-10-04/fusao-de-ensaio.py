#!/usr/bin/env python3
"""RP3: a fusão de ensaio do ramo com o main de agora, sem tocar em árvore nenhuma, em fusao-de-ensaio.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/fusao-de-ensaio.py

Corre `git merge-tree --write-tree --name-only main HEAD`, que funde em memória e escreve só
objetos, e guarda o main e a cabeça lidos, os ficheiros em conflito e os que o git fundiu sem
conflito (as linhas «Auto-merging» que não têm «CONFLICT» a seguir).
"""
import json
import pathlib
import re
import subprocess

git = lambda *a: subprocess.run(["git", *a], capture_output=True, text=True)
main = git("rev-parse", "main").stdout.strip()
cabeca = git("rev-parse", "HEAD").stdout.strip()
base = git("merge-base", "main", "HEAD").stdout.strip()
r = git("merge-tree", "--write-tree", "--name-only", "main", "HEAD")
linhas = r.stdout.splitlines()
conflitos = sorted({m.group(1) for l in linhas for m in [re.match(r"CONFLICT \(content\): Merge conflict in (.+)", l)] if m})
fundidos = sorted({m.group(1) for l in linhas for m in [re.match(r"Auto-merging (.+)", l)] if m} - set(conflitos))
saida = {"_": "Escrito por design/especime-v3/medicoes/rp3-2026-10-04/fusao-de-ensaio.py. Não se edita à mão.",
         "main": main, "cabeca": cabeca, "base_comum": base, "codigo_do_git": r.returncode,
         "conflitos": conflitos, "fundidos_sem_conflito": fundidos, "saida": r.stdout}
destino = pathlib.Path(__file__).resolve().parent / "fusao-de-ensaio.json"
destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"fusão de ensaio com o main {main[:8]}: {len(conflitos)} conflito(s), {len(fundidos)} fundido(s) sem conflito")
