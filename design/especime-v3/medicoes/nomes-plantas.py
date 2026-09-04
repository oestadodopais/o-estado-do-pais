#!/usr/bin/env python3
"""
AS SETE PLANTAS DO G12 (bloco F1.4; quatro na primeira passagem, três na segunda).

Cada estrago tem de fazer `tests/livro/indice.mjs` sair com 1 E acender a célula
que lhe corresponde, e a construção limpa tem de sair com 0 sem célula nenhuma
vermelha. Um estrago que passe é uma régua cega, e uma régua cega é pior do que
régua nenhuma.

O CORREDOR EXIGE, NÃO OBSERVA (leitura a frio de 04.09.2026, Major 12). A
primeira versão imprimia o que via e saía sempre com 0: quem a lesse tinha de
comparar as linhas à mão, e uma planta que passasse não fazia barulho nenhum.
Agora cada planta tem uma célula esperada, e o corredor sai com 1 quando a régua
não a acende, ou quando a acende por outra razão.

AS TRÊS PLANTAS NOVAS são os equivalentes semânticos que a leitura a frio disse
que passavam: o nome de OUTRA linha (as duas cadeias são nomes legítimos, e o que
está errado é a linha), a mesma data noutra grafia (`12/08/2026`), e um destino
de formulário para uma página que não existe.

O estrago faz-se numa CÓPIA da construção, nunca na construção: a régua lê-se
pelo `OEDP_DIST`, e a cópia é refeita antes de cada planta para que duas plantas
não se somem.

Uso:  python3 design/especime-v3/medicoes/nomes-plantas.py
      OEDP_TRABALHO=<dir>  onde a cópia e as medições ficam (por omissão, um
                           directório temporário do sistema)

Sai com 0 quando as sete plantas provam o que prometem, e com 1 quando alguma
não prova.
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
    return r.returncode, celulas


def edita(caminho, antes, depois, n=1):
    p = os.path.join(COPIA, caminho)
    s = open(p, encoding="utf-8").read()
    assert s.count(antes) >= 1, f"a planta não encontrou o alvo em {caminho}: {antes[:60]}"
    s = s.replace(antes, depois, n)
    open(p, "w", encoding="utf-8").write(s)


def tira_a_forma():
    """Troca o <form> da busca por um <div>, e só esse: o `</form>` que se fecha
    é o que vem a seguir à abertura, e não o primeiro do documento."""
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    i = s.index('<form class="livro-busca"')
    j = s.index("</form>", i)
    s = s[:i] + '<div class="livro-busca"' + s[i + len('<form class="livro-busca"'):j] + "</div>" + s[j + len("</form>"):]
    open(p, "w", encoding="utf-8").write(s)


NOME = re.compile(r'(<span class="[^"]*livro-item-nome[^"]*"[^>]*>)(.*?)(</span>)', re.S)


def edita_texto_do_nome():
    """Põe um identificador por texto do primeiro nome de medida do índice."""
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    m = NOME.search(s)
    assert m, "não achei um nome de medida no índice"
    s = s[: m.start(2)] + "crescimento-da-despesa-liquida-2025" + s[m.end(2):]
    open(p, "w", encoding="utf-8").write(s)


def troca_dois_nomes():
    """O NOME DE OUTRA LINHA (Major 13).

    Troca o texto dos dois primeiros nomes do índice. As duas cadeias continuam a
    ser nomes legítimos do sítio; o que muda é que estão na entrada errada, e era
    exactamente isso que a primeira régua não via.
    """
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    ms = list(NOME.finditer(s))
    assert len(ms) >= 2, "preciso de dois nomes no índice para os trocar"
    a, b = ms[0], ms[1]
    assert a.group(2) != b.group(2), "os dois primeiros nomes são iguais: a planta não estragaria nada"
    # de trás para a frente, para não mexer nos deslocamentos do primeiro
    s = s[: b.start(2)] + a.group(2) + s[b.end(2):]
    s = s[: a.start(2)] + b.group(2) + s[a.end(2):]
    open(p, "w", encoding="utf-8").write(s)


def data_com_barras():
    """A MESMA DATA NOUTRA GRAFIA (Major 13). `12/08/2026` é a mesma falha que
    `2026-08-12`, na forma que a primeira régua não conhecia."""
    edita(
        "livro-razao/index.html",
        '<div class="livro-lista"',
        '<p class="log-data">12/08/2026</p><div class="livro-lista"',
    )


def destino_que_nao_existe():
    """O `action` PARA UMA PÁGINA QUE NÃO EXISTE (Major 13). Um destino não vazio
    passava a peneira antiga: o formulário levava a lado nenhum."""
    p = os.path.join(COPIA, "livro-razao/index.html")
    s = open(p, encoding="utf-8").read()
    i = s.index('<form class="livro-busca"')
    j = s.index(">", i)
    cabeca = s[i:j]
    assert 'action="' in cabeca, "o formulário da busca não tem action"
    nova = re.sub(r'action="[^"]*"', 'action="/livro-razao-que-nao-existe"', cabeca)
    s = s[:i] + nova + s[j:]
    open(p, "w", encoding="utf-8").write(s)


PLANTAS = {
    # 1 · um identificador como nome visível
    "slug": edita_texto_do_nome,
    # 2 · uma data ISO solta
    "data": lambda: edita(
        "livro-razao/index.html",
        '<div class="livro-lista"',
        '<p class="log-data">2026-08-12</p><div class="livro-lista"',
    ),
    # 3 · a busca sem <form>
    "forma": tira_a_forma,
    # 4 · o marcador com dois destinos
    "marcador": lambda: edita(
        "livro-razao/index.html", 'class="marcador" href="/a-verificar"', 'class="marcador" href="/metodo"'
    ),
    # 5 · o nome de OUTRA linha (segunda passagem)
    "nome-trocado": troca_dois_nomes,
    # 6 · a mesma data noutra grafia (segunda passagem)
    "data-barras": data_com_barras,
    # 7 · o destino do formulário para uma página que não existe (segunda passagem)
    "destino-morto": destino_que_nao_existe,
}

# A célula que cada planta TEM de acender.
ESPERADO = {
    "slug": "I1",
    "data": "I2",
    "forma": "I3",
    "marcador": "I6",
    "nome-trocado": "I1",
    "data-barras": "I2",
    "destino-morto": "I3",
}


def main():
    falhas = []
    linhas = []

    prepara()
    codigo, celulas = corre("limpo")
    linhas.append(f"{'(sem planta)':16s} código={codigo}  células vermelhas={celulas}")
    if codigo != 0 or celulas:
        falhas.append(
            f"a construção limpa devia sair com 0 e sem células vermelhas, e saiu com {codigo} "
            f"e {celulas}: sem um verde de partida, o vermelho de uma planta não diz nada."
        )

    for tag, aplica in PLANTAS.items():
        esperada = ESPERADO[tag]
        prepara()
        try:
            aplica()
        except AssertionError as e:
            falhas.append(f"a planta «{tag}» não se aplicou: {e}")
            linhas.append(f"{tag:16s} ALVO NÃO ENCONTRADO")
            continue
        codigo, celulas = corre(tag)
        linhas.append(f"{tag:16s} código={codigo}  células vermelhas={celulas}  esperada={esperada}")
        if codigo == 0:
            falhas.append(f"a planta «{tag}» passou: a régua saiu com 0 e devia sair com 1.")
        if esperada not in celulas:
            falhas.append(f"a planta «{tag}» devia acender a célula {esperada} e acendeu {celulas}.")

    print()
    for l in linhas:
        print(" ", l)
    print()
    if falhas:
        print("  AS PLANTAS NÃO PROVAM O QUE PROMETEM:")
        for f in falhas:
            print("   ✗", f)
        print()
        sys.exit(1)
    print(f"  ✓ a construção limpa é verde e as {len(PLANTAS)} plantas acendem cada uma a sua célula.")
    print()


if __name__ == "__main__":
    main()
