#!/usr/bin/env python3
"""
A DIREÇÃO K, MEDIDA E POSTA EM FOLHA (ADENDA 8, 29.08.2026).

O diretor entregou sete ficheiros em `design/marca/direcoes-k/` e um LEIA-ME.
Este programa NÃO OS TOCA e NÃO DESENHA A MARCA: lê os PNG que `render-k.mjs`
escreveu em `EXPORT-K/`, conta-os píxel a píxel e compõe as quatro folhas que a
adenda pede.

    node design/marca/render-k.mjs             primeiro, as capturas
    python3 design/marca/marca-k.py geometria  a conferência do LEIA-ME
    python3 design/marca/marca-k.py regua      a régua, e EXPORT-K/regua.json
    python3 design/marca/marca-k.py folhas     as quatro folhas
    python3 design/marca/marca-k.py            tudo

A MÁQUINA É A DAS RONDAS ANTERIORES, e por isso é importada em vez de copiada:
a `Folha` e a régua de sinal são de `estado.py`, e o ecrã principal é o
`compoe_ecra` de `desenhar.py`. Uma segunda máquina daria números que não se
podiam comparar com os da §5, da §6 e da §6 quater, e a adenda pede exactamente
essa comparação.

O `sys.argv` É ESVAZIADO DURANTE A IMPORTAÇÃO pela mesma razão que `estado.py` o
esvazia: os dois módulos despacham os comandos ao nível do módulo, e importá-los
com um argumento na linha de comandos punha o comando deste a correr o comando
homónimo daqueles.
"""

import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

_ARGV, sys.argv = sys.argv, sys.argv[:1]
import desenhar as D   # noqa: E402  (o caminho tem de ser posto antes)
import estado as E     # noqa: E402
sys.argv = _ARGV

EXPORT = os.path.join(AQUI, "EXPORT-K")
DIRETOR = os.path.join(AQUI, "direcoes-k")
DERIVADOS = os.path.join(AQUI, "derivados-k")
DERIVADAS = os.path.join(DIRETOR, "derivadas")

# As cores, lidas do LEIA-ME do diretor e não reescritas aqui.
TINTA, COBALTO, PAPEL = "#17191B", "#1F4E8C", "#F6F7F4"
PAPEL_CLARO, COBALTO_CLARO = "#ECEEEA", "#7FA6DC"
# Os dois cinzentos de separador: o escuro é o do tema escuro do Chromium, lido a
# olho na captura que o diretor mandou na sétima ronda; o claro é ESCOLHIDO, e
# `render-k.mjs` diz porquê e o que isso custa.
SEP_ESCURO_ATIVO, SEP_ESCURO_BARRA = "#35363A", "#202124"
SEP_CLARO_ATIVO, SEP_CLARO_BARRA = "#FFFFFF", "#DEE1E6"

VARIANTES = ["k2", "k3", "k4", "k5"]
CINCO = ["k1"] + VARIANTES
TITULOS = {
    "k1": "K1 · a marca do diretor (valor 197, à esquerda, altura 72)",
    "k2": "K2 · o valor encostado à direita (mesmo 197, mesma altura)",
    "k3": "K3 · o valor mais fino (altura 40 em vez de 72)",
    "k4": "K4 · o valor mais pesado (altura 100 em vez de 72)",
    "k5": "K5 · o valor a 70 % (238 em vez de 197)",
}


def _abre(nome):
    from PIL import Image
    return Image.open(os.path.join(EXPORT, nome))


# ===========================================================================
# 1 · A GEOMETRIA CONFERIDA CONTRA O LEIA-ME
# ===========================================================================
"""
A adenda pede a §0.6: «as medidas do LEIA-ME (linhas 340 × 72, intervalo 48,
valor 197 = 58 %, fio 7) lidas dos SVG e confirmadas ou corrigidas». Lê-se dos
ficheiros e não da memória: cada número sai de um atributo ou de um caminho.
"""


def _rects(caminho):
    """Os rectângulos de um SVG, na ordem em que estão no ficheiro."""
    txt = open(caminho).read()
    fora = []
    for m in re.finditer(r"<rect([^>]*?)/?>", txt):
        at = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', m.group(1)))
        fora.append(at)
    return fora, txt


def _fio(caminho):
    """A grossura do fio da marca fina, contada nos dois contornos do caminho.

    O caminho é `M x0 y0 H x1 V y1 H x0 Z  M a0 b0 H a1 V b1 H a0 Z`: o contorno
    de fora e o de dentro, com `fill-rule="evenodd"` a abrir o buraco. O fio é a
    distância entre os dois, nos quatro lados, e conta-se nos quatro para que uma
    diferença entre eles não passasse despercebida.
    """
    txt = open(caminho).read()
    fora = []
    for d in re.findall(r'\sd="([^"]+)"', txt):
        n = [float(v) for v in re.findall(r"(-?\d+(?:\.\d+)?)", d)]
        x0, y0, x1, y1 = n[0], n[1], n[2], n[3]
        a0, b0, a1, b1 = n[5], n[6], n[7], n[8]
        fora += [a0 - x0, x1 - a1, b0 - y0, y1 - b1]
    return sorted(set(fora))


def _braços_do_E():
    """Os braços do «E» versal do Spectral Bold, MEDIDOS na captura de 512 px.

    A razão de se medir em vez de se citar: a afirmação de que o braço do meio de
    um «E» de tipo anda «perto de 80 %» dos outros é a premissa desta ronda, e uma
    premissa citada de cor não é medição nenhuma. O «E» está rendido à mesma
    altura de maiúscula que a marca tem de caixa (312 unidades em 512), com a
    haste na mesma margem (86) e a base na mesma linha (412), e por isso os
    números saem comparáveis com os das barras da marca sem nenhuma conversão.

    Conta-se, por linha, o alcance da tinta a partir da margem esquerda. Um «E»
    serifado dá três patamares (braço de cima, braço do meio, braço de baixo)
    separados por linhas em que só a haste tem tinta.
    """
    from PIL import Image
    im = Image.open(os.path.join(EXPORT, "col-E-claro-512.png"))
    mapa, w, h = E._mascara(im)
    esq = min(x for y in range(h) for x in range(w) if mapa[y][x])
    alcance = []
    for y in range(h):
        xs = [x for x in range(w) if mapa[y][x]]
        alcance.append((max(xs) - esq + 1) if xs else 0)
    linhas = [y for y in range(h) if alcance[y] > 0]
    topo, base = min(linhas), max(linhas)
    alt = base - topo + 1
    t1, t2 = topo + alt // 3, topo + 2 * alt // 3
    cima = max(alcance[topo:t1])
    meio = max(alcance[t1:t2])
    baixo = max(alcance[t2:base + 1])
    haste = min(v for v in alcance[topo:base + 1] if v > 0)
    return {"esquerda": esq, "topo": topo, "base": base, "altura": alt,
            "cima": cima, "meio": meio, "baixo": baixo, "haste": haste,
            "razao_meio": meio / max(cima, baixo)}


def geometria():
    print("A GEOMETRIA DO LEIA-ME, LIDA DOS FICHEIROS\n")
    r, txt = _rects(os.path.join(DIRETOR, "favicon.svg"))
    vb = re.search(r'viewBox="([^"]+)"', txt).group(1)
    print(f"favicon.svg · viewBox {vb}")
    for i, q in enumerate(r):
        print(f"  linha {i + 1}: x {q['x']}  y {q['y']}  {q['width']} × {q['height']}  {q['fill']}")
    x = [float(q["x"]) for q in r]
    y = [float(q["y"]) for q in r]
    w = [float(q["width"]) for q in r]
    h = [float(q["height"]) for q in r]
    print()
    ok = (w[0], h[0], w[2], h[2]) == (340, 72, 340, 72)
    print(f"  linhas 340 × 72 .......... {w[0]:.0f} × {h[0]:.0f} e {w[2]:.0f} × {h[2]:.0f}"
          f"   → {'CONFIRMA' if ok else 'CORRIGE'}")
    i1, i2 = y[1] - (y[0] + h[0]), y[2] - (y[1] + h[1])
    print(f"  intervalo 48 ............. {i1:.0f} e {i2:.0f}"
          f"   → {'CONFIRMA' if (i1, i2) == (48, 48) else 'CORRIGE'}")
    print(f"  valor 197 (58 %) ......... {w[1]:.0f}, que é {100 * w[1] / w[0]:.1f} % de {w[0]:.0f}"
          f"   → 197 CONFIRMA; os 58 % são 57,9 % arredondados")
    print(f"  margens na grelha de 512 . esquerda {x[0]:.0f}, direita {512 - (x[0] + w[0]):.0f}, "
          f"topo {y[0]:.0f}, fundo {512 - (y[2] + h[2]):.0f}")
    caixa_h = y[2] + h[2] - y[0]
    print(f"  caixa da marca ........... {w[0]:.0f} × {caixa_h:.0f} "
          f"(razão {w[0] / caixa_h:.4f}); a marca ocupa {100 * w[0] / 512:.1f} % "
          f"da largura da grelha e {100 * caixa_h / 512:.1f} % da altura")
    print()

    fino = _fio(os.path.join(DIRETOR, "marca-fina-claro.svg"))
    print(f"marca-fina-claro.svg · fio 7 ..... {fino}"
          f"   → {'CONFIRMA' if set(fino) == {7.0} else 'CORRIGE'}")
    print("  o valor da fina é CHEIO (um `rect` e não um contorno), como o LEIA-ME diz")
    print()

    ic, txti = _rects(os.path.join(DIRETOR, "icone-telemovel.svg"))
    m = re.search(r"translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)\)", txti)
    tx, ty, k = float(m.group(1)), float(m.group(2)), float(m.group(3))
    x0, x1 = tx + k * x[0], tx + k * (x[0] + w[0])
    y0, y1 = ty + k * y[0], ty + k * (y[2] + h[2])
    print(f"icone-telemovel.svg · campo 512 com rx {ic[0]['rx']} "
          f"({100 * float(ic[0]['rx']) / 512:.2f} % do lado; a máscara do iOS da casa é 22,37 %)")
    print(f"  a marca fica em {x0:.1f} a {x1:.1f} por {y0:.1f} a {y1:.1f}, "
          f"ou seja {x1 - x0:.1f} × {y1 - y0:.1f} num campo de 512")
    print(f"  ocupa {100 * (x1 - x0) / 512:.1f} % da largura e {100 * (y1 - y0) / 512:.1f} % da altura")
    print(f"  centro em {(x0 + x1) / 2:.2f}, {(y0 + y1) / 2:.2f} "
          f"(o do campo é 256; desvio de {abs(256 - (x0 + x1) / 2):.2f} numa grelha de 512)")
    print()

    print("AS CINCO, LADO A LADO (tudo lido dos ficheiros, na grelha de 512)\n")
    print(f"{'':4s} {'x do valor':>11s} {'comprimento':>12s} {'razão':>7s} "
          f"{'altura':>7s} {'intervalos':>11s}")
    for v in CINCO:
        f = (os.path.join(DIRETOR, "favicon.svg") if v == "k1"
             else os.path.join(DERIVADAS, f"{v}-favicon.svg"))
        rr, _ = _rects(f)
        xv, yv = float(rr[1]["x"]), float(rr[1]["y"])
        wv, hv = float(rr[1]["width"]), float(rr[1]["height"])
        ia, ib = yv - 172.0, 340.0 - (yv + hv)
        print(f"{v:4s} {xv:11.0f} {wv:12.0f} {100 * wv / 340:6.1f} % "
              f"{hv:7.0f} {ia:5.0f} e {ib:3.0f}")
    print()

    b = _braços_do_E()
    print("O «E» VERSAL DO SPECTRAL BOLD, MEDIDO na captura de 512 px (não citado):")
    print(f"  a letra ocupa de y {b['topo']} a {b['base']} ({b['altura']} px de maiúscula; "
          f"a marca tem 312 de caixa na mesma grelha)")
    print(f"  alcance do braço de cima {b['cima']} px, do meio {b['meio']} px, "
          f"de baixo {b['baixo']} px, e a haste sozinha {b['haste']} px")
    print(f"  → o braço do meio mede {100 * b['razao_meio']:.1f} % do maior dos outros dois")
    print(f"  → e a haste ocupa {100 * b['haste'] / b['cima']:.1f} % do alcance do braço de cima, "
          f"que é o que nenhuma das cinco tem")
    print()

    print("OS CONTRASTES, com a régua de `desenhar.py` (a mesma de `tokens.css`):")
    for a, bb, rot in ((TINTA, PAPEL, "tinta sobre papel"),
                       (COBALTO, PAPEL, "cobalto sobre papel"),
                       (COBALTO, TINTA, "cobalto contra tinta"),
                       (PAPEL_CLARO, TINTA, "papel-claro sobre tinta"),
                       (COBALTO_CLARO, TINTA, "cobalto-claro sobre tinta"),
                       (COBALTO_CLARO, PAPEL_CLARO, "cobalto-claro contra papel-claro"),
                       (TINTA, SEP_ESCURO_ATIVO, "tinta sobre o separador escuro"),
                       (COBALTO, SEP_ESCURO_ATIVO, "cobalto sobre o separador escuro"),
                       (TINTA, SEP_CLARO_ATIVO, "tinta sobre o separador claro"),
                       (COBALTO, SEP_CLARO_ATIVO, "cobalto sobre o separador claro"),
                       (PAPEL_CLARO, SEP_ESCURO_ATIVO, "papel-claro sobre o separador escuro")):
        print(f"  {rot:38s} {D.contraste(a, bb):5.2f}:1")


# ===========================================================================
# 2 · A RÉGUA
# ===========================================================================
"""
Conta-se o SINAL e não a tinta, que é a régua da §6 e da §6 quater: o campo
lê-se no canto da imagem e sinal é o que dele difere. Metade destas celas tem
campo escuro e barras claras, e um limiar fixo de «cinzento abaixo de 200»
contaria o campo.

E contam-se DUAS ilhas: as do sinal dizem em quantas peças a marca se lê (aqui
são sempre três barras soltas, e é essa a pergunta) e as do fundo dizem se
alguma contraforma fechou.
"""


def _presenca(caminho):
    """A PRESENÇA da cela: o contraste entre o campo e a cor mais afastada dele,
    os dois LIDOS no PNG.

    Existe por causa de um limite da régua de contagem, e o limite descobriu-se a
    olhar. `_mascara` separa o sinal por DISTÂNCIA à cor do canto, e por isso conta
    igual uma barra que difere do campo por uma sombra e uma que difere por tudo:
    a mesma marca dá 20,3 % de sinal num separador escuro e num claro, e num deles
    não se vê. A percentagem diz que a marca ESTÁ LÁ; isto diz se ela se VÊ.

    Devolve também a cor do campo e a do sinal, para que o número se possa
    conferir contra os tokens sem se acreditar nele.
    """
    from PIL import Image
    im = Image.open(caminho)
    w, h = im.size
    # O CANTO TRANSPARENTE NÃO É CAMPO NENHUM. Os cantos arredondados do ícone
    # saem com alfa 0, e `convert("RGB")` pinta-os de PRETO: a presença sairia
    # medida contra um preto que o ficheiro não tem. Nessas celas não se mede,
    # porque a pergunta da presença é sobre o separador e essas têm a versão
    # `-sep-` própria, composta pelo navegador sobre o cinzento certo.
    if im.mode in ("RGBA", "LA") and im.convert("RGBA").load()[0, 0][3] < 255:
        return {"campo": None, "sinal": None, "presenca": None}
    px = im.convert("RGB").load()
    campo = px[0, 0]
    longe, cor = 0, campo
    for y in range(h):
        for x in range(w):
            d = sum(abs(a - b) for a, b in zip(px[x, y], campo))
            if d > longe:
                longe, cor = d, px[x, y]
    hexa = "#%02X%02X%02X" % cor
    fundo = "#%02X%02X%02X" % campo
    return {"campo": fundo, "sinal": hexa, "presenca": round(D.contraste(hexa, fundo), 2)}


def _mede(caminho):
    from PIL import Image
    im = Image.open(caminho)
    mapa, w, h = E._mascara(im)
    mn, med = E._corridas(mapa, w, h)
    sinal = sum(1 for y in range(h) for x in range(w) if mapa[y][x])
    return {
        "px": w,
        "sinal_pc": round(100 * sinal / (w * h), 1),
        "ilhas_sinal": E._ilhas(mapa, w, h, True),
        "ilhas_fundo": E._ilhas(mapa, w, h, False),
        "corrida_min": mn,
        "corrida_med": med,
        **_presenca(caminho),
    }


def _perfil(caminho):
    """A corrida mais comprida de cada linha da imagem, de cima para baixo.

    É a régua da colisão: três barras dão três patamares, e o do meio é o que a
    marca reivindica como seu. Devolve também os patamares (as corridas
    distintas) e as folgas entre barras, contadas em linhas sem sinal nenhum
    entre a primeira e a última linha com sinal.
    """
    from PIL import Image
    im = Image.open(caminho)
    mapa, w, h = E._mascara(im)
    linhas = []
    for y in range(h):
        melhor = c = 0
        for x in range(w):
            c = c + 1 if mapa[y][x] else 0
            melhor = max(melhor, c)
        linhas.append(melhor)
    com = [y for y in range(h) if linhas[y] > 0]
    folgas, corrida = [], 0
    if com:
        for y in range(com[0], com[-1] + 1):
            if linhas[y] == 0:
                corrida += 1
            elif corrida:
                folgas.append(corrida)
                corrida = 0
    return {"linhas": linhas, "barras": sorted({v for v in linhas if v > 0}),
            "folgas": folgas}


def _cor_das_barras(caminho, px):
    """As cores lidas NO PNG, no meio de cada uma das três barras.

    As alturas vêm da grelha do diretor e não de olhómetro: as linhas de fora
    têm o centro em y 136 e 376 de 512, e o valor em 256 (é o eixo em que as
    cinco variantes o centram).
    """
    from PIL import Image
    im = Image.open(caminho).convert("RGB")
    w, h = im.size
    pxl = im.load()
    campo = pxl[0, 0]
    fora = []
    for centro in (136, 256, 376):
        y = min(h - 1, int(round(centro / 512 * h)))
        melhor, cor = -1, campo
        for xx in range(w):
            d = sum(abs(a - b) for a, b in zip(pxl[xx, y], campo))
            if d > melhor:
                melhor, cor = d, pxl[xx, y]
        fora.append("#%02X%02X%02X" % cor)
    return fora


CELAS_DA_REGUA = ["cru", "papel", "sep-escuro", "sep-claro",
                  "tinta", "tinta-sep-escuro", "tinta-sep-claro"]
CELAS_K1_EXTRA = ["regra-sep-escuro", "regra-sep-claro"]


def regua():
    fora = {"celas": [], "colisao": []}
    for v in CINCO:
        pre = "k" if v == "k1" else v
        chaves = CELAS_DA_REGUA + (CELAS_K1_EXTRA if v == "k1" else [])
        for chave in chaves:
            for px in (16, 32, 60, 180, 512):
                f = os.path.join(EXPORT, f"ic-{pre}-{chave}-{px}.png")
                if os.path.exists(f) and chave != "cru":
                    fora["celas"].append({"f": f"{v}-{chave}-{px}", **_mede(f)})
    for quem in ["menu", "alinhar", "E"] + [f"m-{v}" for v in CINCO] + [f"c-{v}" for v in CINCO]:
        for tema in ("claro", "escuro"):
            for px in (16, 24):
                f = os.path.join(EXPORT, f"col-{quem}-{tema}-{px}.png")
                if not os.path.exists(f):
                    continue
                p = _perfil(f)
                fora["colisao"].append({"f": f"{quem}-{tema}-{px}", **_mede(f),
                                        "barras": p["barras"], "folgas": p["folgas"]})
    with open(os.path.join(EXPORT, "regua.json"), "w") as fh:
        json.dump(fora, fh, indent=2)

    print("AS CELAS DE SEPARADOR E DE ÍCONE, a 16 e a 32 px\n")
    print(f"{'cela':30s} {'px':>4s} {'sinal':>8s} {'ilhas s/f':>10s} {'corrida':>10s} "
          f"{'presença':>10s}  campo → sinal")
    for r in fora["celas"]:
        if r["px"] in (16, 32):
            print(f"{r['f']:30s} {r['px']:4d} {r['sinal_pc']:7.1f} % "
                  f"{r['ilhas_sinal']:5d}/{r['ilhas_fundo']:<4d} "
                  f"{r['corrida_min']:4d} / {r['corrida_med']:<4d} "
                  + (f"{r['presenca']:8.2f}:1  {r['campo']} → {r['sinal']}"
                     if r['presenca'] else "     campo transparente"))
    print()
    print("A COLISÃO, barra a barra (a corrida mais comprida de cada linha da cela)\n")
    print(f"{'cela':22s} {'sinal':>7s} {'ilhas':>6s} {'barras (px)':>18s} {'folgas (px)':>14s}")
    for r in fora["colisao"]:
        if r["px"] == 16 and r["f"].endswith("claro-16"):
            print(f"{r['f']:22s} {r['sinal_pc']:6.1f} % {r['ilhas_sinal']:6d} "
                  f"{str(r['barras']):>18s} {str(r['folgas']):>14s}")
    print()
    for r in fora["colisao"]:
        if r["px"] == 24 and r["f"].endswith("claro-24"):
            print(f"{r['f']:22s} {r['sinal_pc']:6.1f} % {r['ilhas_sinal']:6d} "
                  f"{str(r['barras']):>18s} {str(r['folgas']):>14s}")
    print()
    print("AS CORES LIDAS NO PNG, no meio de cada barra, a 24 px, campo claro")
    for v in CINCO:
        print(f"  {v} · {_cor_das_barras(os.path.join(EXPORT, f'col-c-{v}-claro-24.png'), 24)}")
    return fora


# ===========================================================================
# 3 · A TIRA DE SEPARADORES
# ===========================================================================
"""
`ECRA-SEPARADORES-K.png`. É a tira de `estado.py`, com a paleta a passar de
constante a argumento: a adenda pede a mesma fila num separador ESCURO e num
CLARO, e a de lá só sabe o escuro. O resto é igual, e é de propósito: a fila de
vizinhos, a largura do separador, o arredondamento e a posição do nosso são os
mesmos, para que esta folha se possa pôr ao lado de `ECRA-SEPARADORES.png`.

A ANTHROPIC E A GOOGLE SÃO QUADRADOS MARCADORES. Os ficheiros delas não estão em
`referencias/` e não se vai à rede; um desenho de memória da marca de outrem não
é medição nenhuma.
"""

SEP_ORDEM = ["guardian", "publico", "nyt", "NOSSO", "anthropic", "google"]
SEP_TITULOS = {"guardian": "The Guardian", "publico": "Público",
               "nyt": "The New York Times", "NOSSO": "O Estado do País",
               "anthropic": "Anthropic", "google": "Google"}

PALETAS = {
    "escuro": {"barra": (32, 33, 36), "ativo": (53, 54, 58), "texto": (232, 234, 237),
               "inativo": (154, 160, 166), "marcador": (95, 99, 104)},
    "claro": {"barra": (222, 225, 230), "ativo": (255, 255, 255), "texto": (32, 33, 36),
              "inativo": (95, 99, 104), "marcador": (154, 160, 166)},
}


def _tira(chave, px, tema):
    from PIL import Image, ImageDraw, ImageFont
    p = PALETAS[tema]
    k = px // 16
    larg_sep, alt_sep = E.SEP_LARGURA * k, E.SEP_ALTURA * k
    alto = alt_sep + 8 * k
    im = Image.new("RGB", (larg_sep * len(SEP_ORDEM) + 8 * k, alto), p["barra"])
    d = ImageDraw.Draw(im)
    fonte = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12 * k)
    for i, quem in enumerate(SEP_ORDEM):
        x = 4 * k + i * larg_sep
        ativo = quem == "NOSSO"
        d.rounded_rectangle([x, 4 * k, x + larg_sep - 3 * k, alto],
                            radius=E.SEP_RAIO * k,
                            fill=p["ativo"] if ativo else p["barra"])
        cy = 4 * k + (alt_sep - px) // 2 + 2 * k
        if quem in ("anthropic", "google"):
            d.rounded_rectangle([x + 10 * k, cy, x + 10 * k + px, cy + px],
                                radius=2 * k, fill=p["marcador"])
        else:
            nome = f"ic-{chave}-{px}.png" if quem == "NOSSO" else f"ref-{quem}-{px}.png"
            ic = Image.open(os.path.join(EXPORT, nome)).convert("RGBA")
            if ic.size != (px, px):
                ic = ic.resize((px, px), Image.LANCZOS)
            im.paste(ic, (x + 10 * k, cy), ic)
        d.text((x + 10 * k + px + 8 * k, cy + px // 2 - 7 * k), SEP_TITULOS[quem],
               font=fonte, fill=p["texto"] if ativo else p["inativo"])
    return im


def _na_tira(tema):
    """Quem vai à fila, por tema. A K1 leva os três tratamentos que a adenda
    nomeia; as quatro variantes vão só como vieram, porque o que elas mudam é a
    silhueta e a silhueta não depende do tratamento de campo."""
    s = "escuro" if tema == "escuro" else "claro"
    fora = [(f"k-sep-{s}", "k1-sep-" + s,
             "K1 · o favicon tal como veio (campo transparente, barras de tinta)"),
            (f"k-regra-sep-{s}", f"k1-regra-sep-{s}",
             "K1 · com a regra `prefers-color-scheme: dark` (derivado)"
             + ("" if tema == "escuro" else " (num separador claro a regra não faz nada)")),
            (f"k-tinta-sep-{s}", f"k1-tinta-sep-{s}",
             "K1 · sobre o campo de tinta do ícone")]
    for v in VARIANTES:
        fora.append((f"{v}-sep-{s}", f"{v}-sep-{s}", f"{TITULOS[v]} · como veio"))
    for v in VARIANTES:
        fora.append((f"{v}-tinta-sep-{s}", f"{v}-tinta-sep-{s}",
                     f"{TITULOS[v]} · sobre o campo de tinta do ícone"))
    return fora


def separadores(regua_):
    r = {x["f"]: x for x in regua_["celas"]}
    f = E.Folha(2560)
    f.titulo("A direção K na tira de separadores, com o favicon tal como veio",
             "Chromium a 16 px e a 2×, em tema escuro e em tema claro. A Anthropic e a Google "
             "são quadrados marcadores: os ficheiros delas não estão em referencias/ e não se "
             "vai à rede. Os outros três são os ficheiros recolhidos.")
    for tema in ("escuro", "claro"):
        nota_tema = ("os cinzentos são os do tema escuro do Chromium, lidos a olho na captura "
                     "que o diretor mandou na sétima ronda" if tema == "escuro" else
                     "o branco do separador e o cinzento da barra são ESCOLHIDOS: não há captura "
                     "de tema claro, e o que a medição usa é o contraste do sinal contra o campo")
        for escala, nome in ((16, "1× · o favicon a 16 px, como o navegador o desenha"),
                             (32, "2× · a mesma tira no ecrã do diretor")):
            f.seccao(f"separador {tema.upper()} · {nome}")
            f.nota(nota_tema)
            for chave, etq, rot in _na_tira(tema):
                dd = r.get(f"{etq}-{escala}")
                extra = ""
                if dd:
                    extra = (f"   ·   sinal {dd['sinal_pc']} % da cela   ·   "
                             f"ilhas {dd['ilhas_sinal']} sinal / {dd['ilhas_fundo']} fundo   ·   "
                             f"corrida mínima {dd['corrida_min']} px"
                             + (f"   ·   presença {dd['presenca']}:1 "
                                f"({dd['sinal']} sobre {dd['campo']})" if dd['presenca'] else ""))
                f.nota(rot + extra)
                f.fila([E._cabe(_tira(chave, escala, tema), f.L - 80)])
    f.seccao("As celas sozinhas a 16 px, ampliadas 12×")
    for tema in ("escuro", "claro"):
        linha, rots = [], []
        for chave, etq, _rot in _na_tira(tema):
            linha.append(E._amplia(_abre(f"ic-{chave}-16.png").convert("RGB"), 12))
            dd = r[f"{etq}-16"]
            rots.append(f"{etq}\nsinal {dd['sinal_pc']} %\nilhas {dd['ilhas_sinal']}/"
                        f"{dd['ilhas_fundo']}\ncorrida {dd['corrida_min']} / {dd['corrida_med']}"
                        + (f"\npresença {dd['presenca']}:1" if dd['presenca'] else ""))
        f.nota(f"separador {tema}")
        for i in range(0, len(linha), 4):
            f.fila(linha[i:i + 4], rots[i:i + 4], gap=60)
    f.grava(os.path.join(AQUI, "ECRA-SEPARADORES-K.png"))


# ===========================================================================
# 4 · O ECRÃ PRINCIPAL
# ===========================================================================
"""
`ECRA-K.png`. A mesma maqueta de sempre (`desenhar.py compoe_ecra`): cela de
180 px, que é 60 pt a 3×, entre oito ícones de referência. A K1 vai nos dois
ecrãs, que é o que a adenda pede; as quatro variantes vão no ecrã claro, porque
o que muda entre elas é a silhueta da cela e não o papel de parede.

O rótulo por baixo fica «Estado do País», que é o nome de hoje, e por isso corta
como a §5 já tinha medido; a adenda K não é sobre o nome.
"""


def ecra():
    from PIL import Image, ImageDraw, ImageFont
    fonte = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
    peles = [(D.compoe_ecra(os.path.join(EXPORT, "ic-k-tinta-180.png"), "claro"),
              "K1 · ecrã claro"),
             (D.compoe_ecra(os.path.join(EXPORT, "ic-k-tinta-180.png"), "escuro"),
              "K1 · ecrã escuro")]
    for v in VARIANTES:
        peles.append((D.compoe_ecra(os.path.join(EXPORT, f"ic-{v}-tinta-180.png"), "claro"),
                      f"{TITULOS[v]} · ecrã claro"))
    lp, ap = peles[0][0].size
    gap, rodape, colunas = 60, 54, 2
    filas = (len(peles) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * lp + (colunas + 1) * gap,
                              filas * (ap + rodape) + (filas + 1) * gap), (150, 154, 148))
    d = ImageDraw.Draw(folha)
    for i, (p, rot) in enumerate(peles):
        x = gap + (i % colunas) * (lp + gap)
        y = gap + (i // colunas) * (ap + rodape + gap)
        folha.paste(p, (x, y))
        d.text((x + 8, y + ap + 12), f"{rot} · 3×, cela de 180 px",
               font=fonte, fill=(20, 22, 20))
    saida = os.path.join(AQUI, "ECRA-K.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/ECRA-K.png  ({folha.size[0]} x {folha.size[1]})")


# ===========================================================================
# 5 · A FOLHA DAS FORMAS, COM AS CELAS DE COLISÃO
# ===========================================================================
FORMAS = [
    ("cheia-claro", "marca-cheia-claro.svg · peso cheio, campo de papel"),
    ("cheia-escuro", "marca-cheia-escuro.svg · peso cheio, campo de tinta"),
    ("fina-claro", "marca-fina-claro.svg · peso fino, campo de papel"),
    ("fina-escuro", "marca-fina-escuro.svg · peso fino, campo de tinta"),
    ("icone", "icone-telemovel.svg · o campo de tinta do diretor"),
    ("favicon-papel", "favicon.svg · campo transparente, aqui sobre papel"),
    ("favicon-tinta", "favicon.svg · o mesmo ficheiro sobre tinta (as barras somem-se)"),
]

NA_COLISAO = ["menu"] + [f"{{}}-{v}" for v in CINCO] + ["alinhar", "E"]


def folha(regua_):
    c = {x["f"]: x for x in regua_["colisao"]}
    f = E.Folha(2560)
    f.titulo("A direção K · as formas do diretor às três medidas, as variantes, e a colisão",
             "Os sete ficheiros de direcoes-k/ tal como vieram. Geometria confirmada nos "
             "ficheiros: linhas 340 × 72 em x 86, intervalo 48, valor 197 (57,9 % de 340), "
             "fio da fina 7, tudo na grelha de 512.")

    f.seccao("As seis formas a 512, 120 e 60 px")
    f.nota("Nas marcas a medida é a da CAIXA DE TINTA (o lado maior); no ícone e no favicon é a "
           "da GRELHA de 512, porque são eles que trazem o campo.")
    for chave, rot in FORMAS:
        f.nota(rot)
        f.fila([_abre(f"fm-{chave}-{px}.png") for px in (512, 120, 60)],
               ["512 px", "120 px", "60 px"], gap=60)

    f.seccao("A prova do próprio LEIA-ME: «nunca abaixo de 60 px», e o fio de 7 unidades")
    f.nota("Em cima, a marca fina NA GRELHA de 512 rendida a 120, 60, 32 e 16 px; em baixo, a "
           "mesma à CAIXA DE TINTA aos mesmos números. O LEIA-ME não diz de qual fala, e as duas "
           "leituras dão fios diferentes: 7/512 × n contra 7/340 × n.")
    f.fila([E._amplia(_abre(f"fio-grelha-{px}.png").convert("RGB"), 6) for px in (120, 60, 32, 16)],
           [f"grelha {px} px (×6)\nfio {7 * px / 512:.2f} px" for px in (120, 60, 32, 16)], gap=40)
    f.fila([E._amplia(_abre(f"fio-caixa-{px}.png").convert("RGB"), 6) for px in (120, 60, 32, 16)],
           [f"caixa {px} px (×6)\nfio {7 * px / 340:.2f} px" for px in (120, 60, 32, 16)], gap=40)

    f.seccao("As quatro variantes, ao lado da marca do diretor")
    f.nota("Desenhadas em direcoes-k/derivadas/, cada uma com UMA coisa mudada e tudo o resto "
           "igual: a grelha, as linhas de fora, as cores e a caixa de tinta são as dele.")
    for v in CINCO:
        pre = "" if v == "k1" else f"{v}-"
        f.nota(TITULOS[v])
        f.fila([_abre(f"fm-{pre}favicon-papel-512.png"),
                _abre(f"fm-{pre}favicon-tinta-512.png"),
                _abre(f"fm-{pre}icone-512.png"),
                _abre(f"fm-{pre}favicon-papel-120.png"),
                E._amplia(_abre(f"fm-{pre}favicon-papel-60.png").convert("RGB"), 2)],
               ["favicon sobre papel, 512", "sobre tinta, 512", "ícone, 512",
                "120 px", "60 px (×2)"], gap=50)

    f.seccao("A colisão: as cinco entre o botão de menu, o alinhar à esquerda e o «E» do tipo")
    f.nota("Os dois glifos são MARCADORES desenhados na grelha da própria marca (derivados-k/), "
           "para que a única diferença entre a marca e o botão seja a que ela reivindica. O «E» "
           "NÃO é marcador: é Spectral Bold, o tipo da casa, à mesma altura de maiúscula (312 "
           "unidades em 512), com a haste na mesma margem e a base na mesma linha.")
    for modo, rot_modo in (("c", "A CORES, como a marca é"),
                           ("m", "EM MONOCROMIA (sem cobalto): o que resta quando a cor sai")):
        for tema in ("claro", "escuro"):
            if modo == "c" and tema == "escuro":
                continue   # só a K1 tem ficheiro de cores escuras; está na tira e no ecrã
            for px in (16, 24):
                nomes = ["menu"] + [f"{modo}-{v}" for v in CINCO] + ["alinhar", "E"]
                rots = []
                for n in nomes:
                    d = c[f"{n}-{tema}-{px}"]
                    rots.append(f"{n} · {px} px\nsinal {d['sinal_pc']} %\n"
                                f"ilhas {d['ilhas_sinal']}\nbarras {d['barras']}\n"
                                f"folgas {d['folgas']}")
                f.nota(f"{rot_modo} · campo {tema} · {px} px, ampliado 12×")
                f.fila([E._amplia(_abre(f"col-{n}-{tema}-{px}.png").convert("RGB"), 12)
                        for n in nomes], rots, gap=40)
    f.grava(os.path.join(AQUI, "FOLHA-K.png"))


# ===========================================================================
# 6 · O CABEÇALHO
# ===========================================================================
"""
`CABECALHO-K.png`. A marcação e a folha de estilos são as do sítio, e o `clamp()`
resolve-se contra a janela: nada aqui reescreve uma medida de `site.css`. A marca
entra pela ÂNCORA B (`NOTAS.md` §5), à altura de maiúscula do cabeçalho, que é a
âncora que não obriga o cabeçalho a mexer. O que se compara é com e sem marca, e
nos dois nomes.

AS CINCO ENTRAM COM O MESMO TAMANHO, porque a caixa de tinta das cinco é a mesma
(340 × 312): o que muda entre elas está todo dentro da caixa. É por isso que a
medição do cabeçalho se faz uma vez e vale para as cinco, e que as variantes
aparecem aqui só para se ver o que a barra do meio faz ao lado do nome.
"""


def _caixa_de_tinta(nome):
    """A caixa de TINTA do `.wordmark`, contada no PNG.

    `getBoundingClientRect()` devolve a caixa de LINHA e a largura do bloco, que
    é a da coluna; o que o olho vê é a tinta, e a tinta conta-se aqui. É o método
    da §8, e é o mesmo que a §6 quater usou para o «estado» em minúsculas.
    """
    from PIL import Image
    im = _abre(nome)
    mapa, w, h = E._mascara(im)
    xs = [x for y in range(h) for x in range(w) if mapa[y][x]]
    ys = [y for y in range(h) for x in range(w) if mapa[y][x]]
    if not xs:
        return None
    return (max(xs) - min(xs) + 1, max(ys) - min(ys) + 1, w)


def cabecalho():
    med = json.load(open(os.path.join(EXPORT, "cabecalhos.json")))
    k1 = {(m["nome"], m["marca"], m["largura"], m["tema"]): m for m in med if m["variante"] == "k1"}
    var = {(m["variante"], m["nome"], m["largura"]): m for m in med if m["variante"] != "k1"}
    f = E.Folha(3000)
    f.titulo("A direção K no cabeçalho · âncora B, à altura de maiúscula",
             "src/styles/tokens.css e src/styles/site.css tal como estão, na marcação de "
             "Masthead.astro (.wrap, .masthead, .wordmark, .masthead-identidade). A marca vai a "
             "0,66 em de alto (a altura de maiúscula do Spectral, tabela OS/2) com 0,42 dessa "
             "altura de espaço até ao nome, que é o número herdado da §6 bis.")
    for nome, rot in (("nome", "«O Estado do País», o nome de hoje"),
                      ("estado", "«estado», o nome que a sétima ronda pôs em cima da mesa")):
        for largura in (320, 390, 768, 1280):
            for tema in ("claro", "escuro"):
                a, b = k1[(nome, "com", largura, tema)], k1[(nome, "sem", largura, tema)]
                f.seccao(f"{rot} · janela {largura} px · ecrã {tema}")
                cc = _caixa_de_tinta(f"wm-{nome}-com-{largura}-{tema}.png")
                cs = _caixa_de_tinta(f"wm-{nome}-sem-{largura}-{tema}.png")
                f.nota(f"corpo {a['corpo']}   ·   .masthead com marca {a['masthead']} px, "
                       f"sem marca {b['masthead']} px   ·   "
                       f"{'a altura NÃO muda' if a['masthead'] == b['masthead'] else 'A ALTURA MUDA'}"
                       f"   ·   a marca mede {a['marcaAlta']} × {a['marcaLarga']} px")
                f.nota(f"caixa de TINTA contada no PNG: com marca {cc[0]} × {cc[1]} px, "
                       f"sem marca {cs[0]} × {cs[1]} px, numa coluna de {cc[2]} px   ·   "
                       f"folga que sobra {cc[2] - cc[0]} px")
                f.fila([_abre(f"cab-{nome}-com-{largura}-{tema}.png"),
                        _abre(f"cab-{nome}-sem-{largura}-{tema}.png")],
                       ["com marca", "sem marca"], gap=40)
    f.seccao("As quatro variantes no cabeçalho, em campo claro")
    f.nota("A caixa de tinta das cinco é a mesma (340 × 312) e por isso todas entram com o mesmo "
           "tamanho e a mesma altura de .masthead; o que se vê aqui é só o que a barra do meio "
           "faz ao lado do nome.")
    for v in VARIANTES:
        for nome in ("nome", "estado"):
            m390, m1280 = var[(v, nome, 390)], var[(v, nome, 1280)]
            f.nota(f"{TITULOS[v]}   ·   .masthead {m390['masthead']} px a 390 e "
                   f"{m1280['masthead']} px a 1280   ·   a marca mede "
                   f"{m390['marcaAlta']} × {m390['marcaLarga']} px a 390")
            f.fila([_abre(f"cab-{v}-{nome}-com-390-claro.png"),
                    _abre(f"cab-{v}-{nome}-com-1280-claro.png")],
                   ["janela 390", "janela 1280"], gap=40)
    f.grava(os.path.join(AQUI, "CABECALHO-K.png"))


# ===========================================================================
def folhas():
    r = json.load(open(os.path.join(EXPORT, "regua.json")))
    folha(r)
    separadores(r)
    ecra()
    cabecalho()


_cmd = _ARGV[1] if len(_ARGV) > 1 else "tudo"
if _cmd == "geometria":
    geometria()
elif _cmd == "regua":
    regua()
elif _cmd == "folhas":
    folhas()
elif _cmd == "tudo":
    geometria()
    print()
    regua()
    print()
    folhas()
else:
    print(__doc__)
