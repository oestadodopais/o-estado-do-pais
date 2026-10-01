#!/usr/bin/env python3
"""A passagem E1b: os documentos emendados no motor voltam a ser alojados no sítio.

    python3 design/especime-v3/medicoes/e1-2026-09-30/e1b/republicar-documentos-e1b.py <motor> [--escrever]

Corre da raiz do sítio. Para cada edição dos estudos 16, 18 e 19 que o sítio aloja,
lê os bytes da edição HTML do motor no commit que os escreveu pela última vez
(`git log -1 -- <ficheiro>`, e os bytes por `git show <commit>:<ficheiro>`, nunca da
árvore de trabalho), escreve-os byte a byte em `studies-src/_raw/<slug>.<lingua>.html`
e em `studies-src/<slug>/<lingua>.html`, e acerta a linha da edição em
`studies-src/manifest.yml`: `origin_ref`, `fetched_utc`, os dois tamanhos e os dois
resumos. Um documento do motor nunca foi embrulhado, por isso os dois resumos e os dois
tamanhos são iguais, como nas linhas que o construtor anterior escreveu.

Sem `--escrever`, diz o que mudaria e não escreve nada. Recusa uma árvore do motor
suja nesses ficheiros, um commit que não seja o da cabeça do ramo do motor ou anterior,
e uma linha do manifesto que não exista ou não seja única.
"""
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SITIO = Path.cwd()
EDICOES = [
    ("evora-contas-da-camara-2010-2025", "pt", "content/16 Évora Contas da Câmara/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).html"),
    ("evora-contas-da-camara-2010-2025", "en", "content/16 Évora Contas da Câmara/The accounts of the Câmara de Évora, 2010 to 2025.html"),
    ("evora-economia-e-dinheiro-publico-de-fora-da-camara", "pt", "content/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).html"),
    ("evora-economia-e-dinheiro-publico-de-fora-da-camara", "en", "content/18 Évora Economia e Dinheiro de Fora/The economy of Évora and the public money that reaches the municipality outside the council.html"),
    ("evora-2027-capital-europeia-da-cultura", "pt", "content/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).html"),
    ("evora-2027-capital-europeia-da-cultura", "en", "content/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, European Capital of Culture.html"),
]


def git(repo, *args, binario=False):
    r = subprocess.run(["git", "-C", str(repo), "-c", "core.quotepath=off", *args], capture_output=True)
    if r.returncode != 0:
        raise SystemExit(f"git {' '.join(args)}: {r.stderr.decode('utf-8', 'replace').strip()}")
    return r.stdout if binario else r.stdout.decode("utf-8")


def main(argv):
    if not argv or argv[0].startswith("-"):
        raise SystemExit(__doc__)
    motor = Path(argv[0])
    escrever = "--escrever" in argv[1:]
    cabeca = git(motor, "rev-parse", "HEAD").strip()
    manifesto = SITIO / "studies-src" / "manifest.yml"
    texto = manifesto.read_text(encoding="utf-8")
    agora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    saida = []
    for slug, lingua, caminho in EDICOES:
        if git(motor, "status", "--porcelain", "--", caminho).strip():
            raise SystemExit(f"o ficheiro do motor não está limpo no git: {caminho}")
        commit = git(motor, "log", "-1", "--format=%H", "--", caminho).strip()
        antecessor = subprocess.run(["git", "-C", str(motor), "merge-base", "--is-ancestor", commit, cabeca])
        if antecessor.returncode != 0:
            raise SystemExit(f"{commit} não é a cabeça do motor nem um antecessor dela")
        dados = git(motor, "show", f"{commit}:{caminho}", binario=True)
        resumo = hashlib.sha256(dados).hexdigest()
        cru = SITIO / "studies-src" / "_raw" / f"{slug}.{lingua}.html"
        alojado = SITIO / "studies-src" / slug / f"{lingua}.html"
        # A linha da edição no manifesto: do «- slug:» ao «sha256_normalized:».
        padrao = re.compile(
            r"(  - slug: " + re.escape(slug) + r"\n    lang: " + lingua + r"\n(?:    .*\n)*?)"
            r"    origin_ref: \"[^\"]*\"\n((?:    .*\n)*?)    fetched_utc: \S+\n"
            r"    bytes_raw: \d+\n    bytes_normalized: \d+\n    sha256_raw: [0-9a-f]{64}\n    sha256_normalized: [0-9a-f]{64}\n")
        achados = padrao.findall(texto)
        if len(achados) != 1:
            raise SystemExit(f"a linha {slug}/{lingua} aparece {len(achados)} vez(es) no manifesto")
        antes = hashlib.sha256(alojado.read_bytes()).hexdigest() if alojado.exists() else None
        novo = (r"\g<1>" + f'    origin_ref: "{caminho} @ {commit}"\n' + r"\g<2>" +
                f"    fetched_utc: {agora}\n    bytes_raw: {len(dados)}\n    bytes_normalized: {len(dados)}\n"
                f"    sha256_raw: {resumo}\n    sha256_normalized: {resumo}\n")
        texto = padrao.sub(lambda m: m.expand(novo), texto, count=1)
        saida.append({"slug": slug, "lingua": lingua, "origem": caminho, "commit": commit,
                      "bytes": len(dados), "sha256_antes": antes, "sha256_depois": resumo,
                      "mudou": antes != resumo})
        if escrever:
            cru.write_bytes(dados)
            alojado.write_bytes(dados)
    if escrever:
        manifesto.write_text(texto, encoding="utf-8")
    print(json.dumps({"cabeca_do_motor": cabeca, "escrito": escrever, "fetched_utc": agora if escrever else None,
                      "edicoes": saida}, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
