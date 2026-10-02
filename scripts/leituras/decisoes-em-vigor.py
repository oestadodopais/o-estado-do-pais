#!/usr/bin/env python3
"""AS DECISÕES ESCRITAS QUE OS FICHEIROS DE UM BLOCO CITAM (M42, 29.09.2026).

    python3 scripts/leituras/decisoes-em-vigor.py [--repo <repositório>] <ficheiro>...
    python3 scripts/leituras/decisoes-em-vigor.py [--repo <repositório>] --intervalo <base>..<cabeça>

Diz, para cada decisão de `DECISIONS.md` (§1.N) citada nos ficheiros, o título da decisão e cada
sítio onde é citada, com o caminho e a linha. Com `--intervalo`, lê os ficheiros que o intervalo
muda, tal como estão na cabeça, e marca com «perto do diff» as citações a menos de 40 linhas de um
pedaço mudado, e com «saiu no diff» as que a base tinha e a cabeça já não tem. O `--repo` pode ser
o motor: as decisões são sempre as do sítio, onde este guião vive.

PORQUE EXISTE: a 29.09.2026, duas vezes no mesmo dia, um bloco bateu numa decisão escrita no código
que tocava sem que ninguém a tivesse lido antes. O F2.2b desligou a poda das quatro reconferências
de cada linha, que a §1.92(2) fixou e que `indicators/refresh.py` cita ao lado da constante; e o
brief do UE1 escolheu, entre as dez medidas, a do cartão onde a §1.124 calava a média da União,
decisão citada em `src/data/figuras.mjs`. As duas vieram à tona na leitura a frio, depois de
construídas. Corre-se no §0 de cada brief, sobre os ficheiros que o bloco vai tocar, e o brief diz
as decisões que ficam em vigor; corre-se de novo sobre o intervalo do bloco antes da leitura a frio.

Sai 0 com a lista; 1 se não conseguir ler `DECISIONS.md` ou o repositório; 2 se o seu
conhecido-positivo falhar (a §1.98 citada em `scripts/check-lugar.mjs`, que a cita catorze vezes,
na cabeça do sítio onde o guião vive), porque uma lista vazia de um detetor calado não diria nada.

OS FICHEIROS BINÁRIOS SALTAM-SE, E DIZ-SE QUANTOS (bloco P4, 02.10.2026, item 6 do brief P4; a M47).
Até aqui o guião lia cada ficheiro como texto, e o primeiro PNG de um intervalo (as capturas que
cada bloco guarda) atirava um erro de descodificação no byte 0x89 e o guião saía com 1 sem dizer
nada das decisões. Um ficheiro é binário quando o próprio Git o diz (o `--numstat` do intervalo
escreve «-» nas duas contagens) ou quando os seus bytes não se leem como UTF-8 ou têm um byte nulo;
salta-se, conta-se, e a última linha diz quantos se saltaram, com os primeiros nomes. Um binário
não cita decisões, e por isso saltá-lo não esconde nenhuma.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

SITIO = Path(__file__).resolve().parents[2]
CITACAO = re.compile(r"§ ?(1\.\d{1,3})(\(\d+\))?")
TITULO = re.compile(r"^### (1\.\d{1,3}) (.+)$")
PERTO = 40


def git(repo, *args):
    r = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout


class Binario(Exception):
    """Os bytes de um ficheiro que não se leem como texto."""


def texto_do_git(repo, objeto):
    """O conteúdo de `git show <objeto>` como texto, ou `Binario` se os bytes não se leem como UTF-8 ou têm um nulo."""
    r = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", "show", objeto], capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(f"git show {objeto}: {r.stderr.decode('utf-8', 'replace').strip()}")
    if b"\x00" in r.stdout:
        raise Binario(objeto)
    try:
        return r.stdout.decode("utf-8")
    except UnicodeDecodeError as e:
        raise Binario(objeto) from e


def binarios_do_intervalo(repo, base, cabeca):
    """Os caminhos que o Git classifica como binários no intervalo (o `--numstat` escreve «-» nas duas contagens)."""
    saida = git(repo, "diff", "--numstat", f"{base}..{cabeca}")
    return {l.split("\t", 2)[2] for l in saida.splitlines() if l.startswith("-\t-\t")}


def titulos():
    texto = (SITIO / "DECISIONS.md").read_text(encoding="utf-8")
    return {m.group(1): m.group(2).strip() for m in (TITULO.match(l) for l in texto.splitlines()) if m}


def citacoes(texto):
    for n, linha in enumerate(texto.splitlines(), 1):
        for m in CITACAO.finditer(linha):
            yield n, m.group(1), (m.group(2) or "")


def conhecido_positivo():
    try:
        texto = git(SITIO, "show", "HEAD:scripts/check-lugar.mjs")
    except RuntimeError:
        return False
    return any(d == "1.98" for _, d, _ in citacoes(texto))


def pedacos(repo, base, cabeca, ficheiro):
    """As linhas da cabeça que o diff muda ou junta a uma mudança (os cabeçalhos @@)."""
    saida = git(repo, "diff", "-U0", f"{base}..{cabeca}", "--", ficheiro)
    linhas = []
    for m in re.finditer(r"^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@", saida, flags=re.M):
        inicio, n = int(m.group(1)), int(m.group(2) or 1)
        linhas.append((inicio, inicio + max(n, 1) - 1))
    return linhas


def main():
    p = argparse.ArgumentParser(description="As decisões escritas que os ficheiros de um bloco citam.")
    p.add_argument("--repo", default=str(SITIO))
    p.add_argument("--intervalo")
    p.add_argument("ficheiros", nargs="*")
    a = p.parse_args()
    if not conhecido_positivo():
        print("o conhecido-positivo falhou: a §1.98 não se leu em scripts/check-lugar.mjs na cabeça do sítio", file=sys.stderr)
        return 2
    try:
        tit = titulos()
        repo = Path(a.repo)
        vistos = {}
        saltados = []
        if a.intervalo:
            base, cabeca = a.intervalo.split("..", 1)
            ficheiros = [f for f in git(repo, "diff", "--name-only", f"{base}..{cabeca}").splitlines() if f]
            binarios = binarios_do_intervalo(repo, base, cabeca)
        else:
            cabeca, base, ficheiros, binarios = "HEAD", None, a.ficheiros, set()
        for f in ficheiros:
            if f in binarios:
                saltados.append(f)
                continue
            try:
                texto = texto_do_git(repo, f"{cabeca}:{f}")
            except Binario:
                saltados.append(f)
                continue
            except RuntimeError:
                texto = ""
            muda = pedacos(repo, base, cabeca, f) if base else []
            agora = set()
            for n, d, parte in citacoes(texto):
                agora.add(d + parte)
                perto = any(i - PERTO <= n <= j + PERTO for i, j in muda)
                vistos.setdefault(d, []).append(f"{f}:{n}{parte and ' ' + parte}{' (perto do diff)' if perto else ''}")
            if base:
                try:
                    antes = texto_do_git(repo, f"{base}:{f}")
                except (RuntimeError, Binario):
                    antes = ""
                for n, d, parte in citacoes(antes):
                    if d + parte not in agora:
                        vistos.setdefault(d, []).append(f"{f}:{n} na base{parte and ' ' + parte} (saiu no diff)")
    except (OSError, RuntimeError, ValueError) as e:
        print(f"não se leu: {e}", file=sys.stderr)
        return 1
    chave = lambda d: tuple(int(x) for x in d.split("."))
    for d in sorted(vistos, key=chave):
        print(f"§{d} · {tit.get(d, 'sem título em DECISIONS.md')}")
        for onde in sorted(set(vistos[d])):
            print(f"    {onde}")
    lidos = len(ficheiros) - len(saltados)
    print(f"{len(vistos)} decisão(ões) citada(s) em {lidos} ficheiro(s) de texto")
    exemplos = ", ".join(saltados[:3]) + (", …" if len(saltados) > 3 else "")
    print(f"{len(saltados)} ficheiro(s) binário(s) saltado(s){': ' + exemplos if saltados else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
