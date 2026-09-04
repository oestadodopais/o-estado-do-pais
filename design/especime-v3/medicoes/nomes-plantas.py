#!/usr/bin/env python3
"""
AS QUATRO PLANTAS DO G12 (bloco F1.4, 04.09.2026).

Cada estrago que o brief nomeia tem de fazer `tests/livro/indice.mjs` sair com 1,
e a construção limpa tem de sair com 0. Um estrago que passe é uma régua cega, e
uma régua cega é pior do que régua nenhuma.

O estrago faz-se numa CÓPIA da construção, nunca na construção: a régua lê-se
pelo `OEDP_DIST`, e a cópia é refeita antes de cada planta para que duas plantas
não se somem.

Uso:  python3 design/especime-v3/medicoes/nomes-plantas.py
      OEDP_TRABALHO=<dir>  onde a cópia e as medições ficam (por omissão, um
                           directório temporário do sistema)
"""
import json, os, re, shutil, subprocess, sys, tempfile

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SCR = os.environ.get("OEDP_TRABALHO") or tempfile.mkdtemp(prefix="oedp-plantas-")
COPIA = os.path.join(SCR, "dist-plantada")

def prepara():
    if os.path.exists(COPIA):
        shutil.rmtree(COPIA)
    shutil.copytree(os.path.join(RAIZ, "dist"), COPIA)

def corre(tag):
    env = dict(os.environ, OEDP_DIST=COPIA)
    saida = os.path.join(SCR, f"planta-{tag}.json")
    r = subprocess.run(
        ["node", "tests/livro/indice.mjs", "--json", saida],
        cwd=RAIZ, env=env, capture_output=True, text=True,
    )
    celulas = []
    if os.path.exists(saida):
        j = json.load(open(saida, encoding="utf-8"))
        celulas = [c["id"] for c in j["celulas"] if not c["passa"]]
    return r.returncode, celulas, r.stdout

def edita(caminho, antes, depois, n=1):
    p = os.path.join(COPIA, caminho)
    s = open(p, encoding="utf-8").read()
    assert s.count(antes) >= 1, f"a planta não encontrou o alvo em {caminho}: {antes[:60]}"
    s = s.replace(antes, depois, n)
    open(p, "w", encoding="utf-8").write(s)

PLANTAS = {
    # 1 · um slug como nome visível
    "slug": lambda: edita_texto_do_nome(),
    # 2 · uma data ISO solta
    "data": lambda: edita(
        "livro-razao/index.html",
        '<div class="livro-lista"',
        '<p class="log-data">2026-08-12</p><div class="livro-lista"',
    ),
    # 3 · a busca sem <form>
    "forma": lambda: tira_a_forma(),
    # 4 · o marcador com dois destinos
    "marcador": lambda: edita(
        "livro-razao/index.html", 'class="marcador" href="/a-verificar"', 'class="marcador" href="/metodo"'
    ),
}

def tira_a_forma():
    """Troca o <form> da busca por um <div>, e só esse: o `</form>` que se fecha
    é o que vem a seguir à abertura, e não o primeiro do documento."""
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    i = s.index('<form class="livro-busca"')
    j = s.index("</form>", i)
    s = s[:i] + '<div class="livro-busca"' + s[i + len('<form class="livro-busca"') : j] + "</div>" + s[j + len("</form>") :]
    open(p, "w", encoding="utf-8").write(s)

def edita_texto_do_nome():
    """Põe um identificador por texto do primeiro nome de medida do índice."""
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    m = re.search(r'(<span class="[^"]*livro-item-nome[^"]*"[^>]*>)(.*?)(</span>)', s, re.S)
    assert m, "não achei um nome de medida no índice"
    s = s[: m.start(2)] + "crescimento-da-despesa-liquida-2025" + s[m.end(2) :]
    open(p, "w", encoding="utf-8").write(s)

def main():
    resultados = {}
    # o limpo
    prepara()
    codigo, celulas, _ = corre("limpo")
    resultados["(sem planta)"] = (codigo, celulas)
    for tag, aplica in PLANTAS.items():
        prepara()
        try:
            aplica()
        except AssertionError as e:
            resultados[tag] = ("ALVO NÃO ENCONTRADO", str(e))
            continue
        codigo, celulas, _ = corre(tag)
        resultados[tag] = (codigo, celulas)
    for k, v in resultados.items():
        print(f"{k:14s} código={v[0]}  células vermelhas={v[1]}")

if __name__ == "__main__":
    main()
