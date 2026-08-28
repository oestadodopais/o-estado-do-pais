#!/usr/bin/env python3
"""
AS DIREÇÕES, DESENHADAS A PARTIR DO QUE O SÍTIO JÁ TEM.

Este programa escreve `design/marca/direcoes/*.svg`. Nada do que ele escreve
depende dele depois de escrito: cada SVG é um ficheiro só, com os contornos já lá
dentro, sem tipo por carregar e sem programa por baixo. Está aqui para que os
números do desenho se possam ler, conferir e mexer, em vez de ficarem só no
resultado.

DE ONDE VEM CADA COISA
  · as cores: `src/styles/tokens.css`, copiadas aqui com o nome que lá têm;
  · o mapa: `mapa/pais.json`, o mesmo ficheiro que desenha o mapa do sítio;
  · o selo, a peça e a régua: os componentes de `src/components/`, reduzidos ao
    que sobra a 60 px;
  · as letras: DESENHADAS AQUI, numa grelha própria, e não compostas com um
    tipo. O Spectral entra como medida de referência (mediu-se-lhe o «O») e
    não como fonte dos contornos. `glifos.py` ao lado tira contornos dos
    ficheiros da casa e serve para comparar as duas coisas lado a lado.

A GRELHA DA LETRA DESENHADA (§ «a letra medida» em NOTAS.md)
  altura de maiúscula   H
  haste                 T = 0,233 H     (o «O» do Spectral SemiBold: 0,199 H)
  fino                  t = 0,100 H     (o «O» do Spectral SemiBold: 0,076 H)
  contraste             T/t = 2,33      (o do Spectral SemiBold: 2,62)
  a ideia               circunferência exata por fora, RECTÂNGULO por dentro:
                        a contraforma do «O» é o quadrado do selo, com os cantos
                        arredondados no raio do fino. Nenhum tipo desenha assim
                        um «O»; e é a contraforma, não o contorno, que faz a
                        letra ser desta casa.

O CAMPO É 512 E O SINAL CABE EM 360. As referências põem a forma em 55 a 70 % do
campo; 360 em 512 são 70,3 %. A versão `maskable` do Android encolhe o sinal para
0,78 do tamanho, e é isso que o mete dentro do círculo seguro de raio 40 %: um
sinal de 360 encolhido a 0,78 tem 281 de lado e 198,6 de meia-diagonal, contra os
204,8 do raio.

CADA DIREÇÃO TEM DOIS DESENHOS: o sinal, e a sua simplificação para 32 e 16 px,
onde o que morre é tirado em vez de ficar a sujar. Os dois vivem no mesmo
ficheiro; `svg[data-forma="favicon"]` troca um pelo outro. É a mesma forma mais
simples, e nunca outra forma.

USO: python3 design/marca/desenhar.py
"""

import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))

# As cores, com o nome que têm em `src/styles/tokens.css`. Nenhuma é nova.
PAPEL = "#f6f7f4"
TINTA = "#17191b"
PAPEL_ESCURO = "#15171a"
TINTA_ESCURA = "#eceeea"
COBALTO = "#1f4e8c"          # 7,73:1 sobre papel claro
COBALTO_CLARO = "#7fa6dc"    # 7,18:1 sobre papel escuro (`--cobalt-palavra`)
AMBAR = "#e0a21a"            # 2,09:1 sobre papel claro; 8,00:1 sobre papel escuro

CAMPO = 512
CENTRO = CAMPO / 2
SINAL = 360.0            # o lado máximo do sinal
ESCALA_MASKABLE = 0.78

# a grelha da letra
RAZAO_HASTE = 0.233
RAZAO_FINO = 0.100


def n(v):
    """Um número para dentro de um «path»: duas casas, sem zeros pendurados."""
    s = f"{v:.2f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


# ---------------------------------------------------------------------------
# AS PEÇAS DA LETRA DESENHADA
# ---------------------------------------------------------------------------
def circunferencia(cx, cy, r):
    """Uma circunferência exata, em dois arcos."""
    return (f"M{n(cx - r)} {n(cy)}"
            f"A{n(r)} {n(r)} 0 1 1 {n(cx + r)} {n(cy)}"
            f"A{n(r)} {n(r)} 0 1 1 {n(cx - r)} {n(cy)}Z")


def rect_arredondado(x0, y0, x1, y1, r):
    """Um rectângulo de cantos arredondados, no sentido contrário ao de fora.

    O sentido não decide nada aqui, porque quem enche é `fill-rule="evenodd"`;
    fica assim porque um contorno que se lê é um contorno que se corrige.
    """
    return (f"M{n(x0 + r)} {n(y0)}"
            f"L{n(x1 - r)} {n(y0)}A{n(r)} {n(r)} 0 0 1 {n(x1)} {n(y0 + r)}"
            f"L{n(x1)} {n(y1 - r)}A{n(r)} {n(r)} 0 0 1 {n(x1 - r)} {n(y1)}"
            f"L{n(x0 + r)} {n(y1)}A{n(r)} {n(r)} 0 0 1 {n(x0)} {n(y1 - r)}"
            f"L{n(x0)} {n(y0 + r)}A{n(r)} {n(r)} 0 0 1 {n(x0 + r)} {n(y0)}Z")


def rect(x0, y0, x1, y1):
    return (f"M{n(x0)} {n(y0)}L{n(x1)} {n(y0)}L{n(x1)} {n(y1)}"
            f"L{n(x0)} {n(y1)}Z")


def letra_o(cx, cy, H, canto=None, contraforma="recta"):
    """O «O» da casa: circunferência por fora, rectângulo por dentro.

    Devolve o «path data» (a encher com `fill-rule="evenodd"`) e as medidas.
    `contraforma="oval"` desenha a contraforma como elipse, e serve para a
    simplificação de 16 px, onde o canto do rectângulo já não se vê e uma elipse
    aguenta melhor o pouco píxel que sobra.
    """
    R = H / 2.0
    T = RAZAO_HASTE * H
    t = RAZAO_FINO * H
    a = R - T          # meia-largura da contraforma
    b = R - t          # meia-altura da contraforma
    r = t if canto is None else canto
    fora = circunferencia(cx, cy, R)
    if contraforma == "oval":
        dentro = (f"M{n(cx - a)} {n(cy)}"
                  f"A{n(a)} {n(b)} 0 1 1 {n(cx + a)} {n(cy)}"
                  f"A{n(a)} {n(b)} 0 1 1 {n(cx - a)} {n(cy)}Z")
    else:
        dentro = rect_arredondado(cx - a, cy - b, cx + a, cy + b, r)
    return fora + dentro, {"R": R, "T": T, "t": t, "a": a, "b": b, "r": r}


def letra_e(x0, cy, H, braco_curto=0.48, braco_longo=0.62, com_serifa=True):
    """O «E» da casa: haste, três braços, e o remate cortado a direito.

    As serifas são lajes sem colo (nem curva nem transição) da grossura do fino:
    uma serifa e um fino pesam o mesmo, e um remate acaba sempre num corte
    horizontal ou vertical. `x0` é a esquerda da haste.
    """
    T = RAZAO_HASTE * H
    t = RAZAO_FINO * H
    yc, yb = cy - H / 2.0, cy + H / 2.0
    La, Lm = braco_longo * H, braco_curto * H
    ta, tm = t, t * 0.86
    partes = [rect(x0, yc, x0 + T, yb),                       # a haste
              rect(x0, yc, x0 + La, yc + ta),                 # o braço de cima
              rect(x0, yb - ta, x0 + La, yb),                 # o braço de baixo
              rect(x0, cy - tm / 2, x0 + Lm, cy + tm / 2)]    # o braço do meio
    if com_serifa:
        hs = ta * 2.2
        partes.append(rect(x0 + La - t, yc, x0 + La, yc + hs))
        partes.append(rect(x0 + La - t, yb - hs, x0 + La, yb))
        partes.append(rect(x0 + Lm - t * 0.86, cy - tm * 1.4, x0 + Lm, cy + tm * 1.4))
    return "".join(partes), {"T": T, "t": t, "La": La, "Lm": Lm}


def acento_fundido(cx, cy, H, angulo=58.0, comprimento=None, largura=0.72):
    """O acento agudo do «País», nascido da haste do «O» e cortado a direito.

    Não é um acento pousado por cima: é um traço da GROSSURA DA HASTE que sai do
    ombro direito do «O», na tangente, e acaba num corte perpendicular ao seu
    próprio eixo. Um tipo nunca funde o acento na letra; é isso que faz esta
    marca ser desenhada e não composta.
    """
    import math
    R = H / 2.0
    T = RAZAO_HASTE * H
    L = comprimento if comprimento is not None else 0.52 * H
    # A largura sai a 0,72 da haste: com a haste inteira o traço lê-se como uma
    # bandeira espetada, e a 0,62 lê-se como um alfinete. Está medido a 60 px,
    # nas cinco variantes, e a escolha é essa.
    th = math.radians(angulo)
    ux, uy = math.cos(th), -math.sin(th)      # o eixo do traço, para cima e à direita
    px, py = -uy, ux                          # a perpendicular
    # O pé do traço assenta no MEIO DA HASTE (R - T/2) e não na contraforma: a
    # fusão faz-se na parte mais grossa da letra, que é de onde o acento nasce.
    raio_pe = R - T / 2.0
    fx, fy = cx + ux * raio_pe, cy + uy * raio_pe
    tx, ty = fx + ux * L, fy + uy * L
    h = T * largura / 2.0
    pontos = [(fx + px * h, fy + py * h), (tx + px * h, ty + py * h),
              (tx - px * h, ty - py * h), (fx - px * h, fy - py * h)]
    d = "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pontos) + "Z"
    caixa = (min(x for x, _ in pontos), min(y for _, y in pontos),
             max(x for x, _ in pontos), max(y for _, y in pontos))
    return d, {"L": L, "T": T, "angulo": angulo, "caixa": caixa}


# ---------------------------------------------------------------------------
# O ESQUELETO DE UM SVG
# ---------------------------------------------------------------------------
ESTILO = f"""
    .campo {{ fill: {PAPEL}; }}
    .tinta {{ fill: {TINTA}; }}
    .tinta-t {{ fill: none; stroke: {TINTA}; }}
    .acento {{ fill: {COBALTO}; }}
    .acento-t {{ fill: none; stroke: {COBALTO}; }}
    /* A costura: uma silhueta feita de distritos encostados fica com fios de
       papel entre eles quando se enche sem traço. O traço da mesma cor fecha-os. */
    .acento-costura {{ fill: {COBALTO}; stroke: {COBALTO}; stroke-width: 2; }}
    svg[data-tema="escuro"] .campo {{ fill: {PAPEL_ESCURO}; }}
    svg[data-tema="escuro"] .tinta {{ fill: {TINTA_ESCURA}; }}
    svg[data-tema="escuro"] .tinta-t {{ stroke: {TINTA_ESCURA}; }}
    svg[data-tema="escuro"] .acento {{ fill: {COBALTO_CLARO}; }}
    svg[data-tema="escuro"] .acento-t {{ stroke: {COBALTO_CLARO}; }}
    svg[data-tema="escuro"] .acento-costura {{ fill: {COBALTO_CLARO}; stroke: {COBALTO_CLARO}; }}
    /* A simplificação de 32 e 16 px: a mesma forma, com o que morre tirado. */
    .sinal-favicon {{ display: none; }}
    svg[data-forma="favicon"] .sinal {{ display: none; }}
    svg[data-forma="favicon"] .sinal-favicon {{ display: block; }}
    /* O `maskable` do Android: o campo fica, o sinal encolhe para dentro do
       círculo seguro de raio 40 %. */
    svg[data-forma="maskable"] .sinal,
    svg[data-forma="maskable"] .sinal-favicon {{
      transform: scale({ESCALA_MASKABLE});
      transform-origin: {CENTRO}px {CENTRO}px;
      transform-box: view-box;
    }}
"""


def enquadra(caixa, alvo=SINAL):
    """A transformação que mete uma caixa qualquer no quadrado do sinal.

    Todo o desenho se faz em coordenadas cómodas e é este passo que o põe no
    sítio: o sinal fica sempre com o mesmo tamanho aparente, seja qual for a
    direção, e a comparação entre as seis é uma comparação e não um acaso de
    escalas.
    """
    x0, y0, x1, y1 = caixa
    w, h = x1 - x0, y1 - y0
    k = alvo / max(w, h)
    dx = CENTRO - (x0 + w / 2) * k
    dy = CENTRO - (y0 + h / 2) * k
    if abs(k - 1) < 1e-9 and abs(dx) < 1e-9 and abs(dy) < 1e-9:
        return ""
    return f' transform="translate({n(dx)} {n(dy)}) scale({n(k)})"'


def svg(titulo, corpo, favicon, nota="", caixa=None, caixa_favicon=None):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CAMPO} {CAMPO}" \
width="{CAMPO}" height="{CAMPO}" role="img" aria-label="{titulo}">
  <title>{titulo}</title>
  <desc>{nota}</desc>
  <style>{ESTILO}  </style>
  <rect class="campo" x="0" y="0" width="{CAMPO}" height="{CAMPO}"/>
  <g class="sinal"{enquadra(caixa) if caixa else ""}>
{corpo}
  </g>
  <g class="sinal-favicon"{enquadra(caixa_favicon) if caixa_favicon else ""}>
{favicon}
  </g>
</svg>
"""


# ---------------------------------------------------------------------------
# A · O MONOGRAMA «OE», UMA LIGADURA
# ---------------------------------------------------------------------------
def direcao_a():
    """As duas letras soldadas: a haste do «E» É a haste direita do «O».

    Duas letras encostadas leem-se como sigla; soldadas leem-se como uma marca.
    A ligadura existe no alfabeto latino («Œ») e não é uma invenção nossa: o que
    é nosso é a construção, a contraforma recta e o corte a direito dos remates.
    """
    H = 222.0
    R = H / 2
    T = RAZAO_HASTE * H
    La = 0.62 * H
    largura = 2 * R + La
    cx = CENTRO - largura / 2 + R
    cy = CENTRO
    do, mo = letra_o(cx, cy, H)
    # a haste do «E» cai exatamente em cima da haste direita do «O»
    de, me = letra_e(cx + R - T, cy, H)
    corpo = (
        f'    <!-- A ligadura «OE»: H={H:.0f}, haste={T:.1f}, fino={mo["t"]:.1f},\n'
        f'         contraste {T / mo["t"]:.2f}. A contraforma é um rectângulo de\n'
        f'         {2 * mo["a"]:.0f} x {2 * mo["b"]:.0f} com o canto a {mo["r"]:.1f}.\n'
        f'         A haste do «E» começa em x={cx + R - T:.1f}, que é a haste\n'
        f'         direita do «O»: as duas letras têm uma haste só. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do}"/>\n'
        f'    <path class="tinta" d="{de}"/>'
    )
    # 32 e 16: sem serifas de remate e com a contraforma oval, que aguenta melhor
    do2, mo2 = letra_o(cx, cy, H, contraforma="oval")
    de2, _ = letra_e(cx + R - T, cy, H, com_serifa=False)
    favicon = (
        f'    <!-- 32 e 16 px: as lajes de remate somem antes de se verem, e o\n'
        f'         canto recto da contraforma não chega a um píxel. Fica a\n'
        f'         ligadura nua. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do2}"/>\n'
        f'    <path class="tinta" d="{de2}"/>'
    )
    caixa = (cx - R, cy - R, cx + R - T + La, cy + R)
    return svg("Direção A · a ligadura OE", corpo, favicon,
               "As duas iniciais soldadas numa letra só, tinta sobre papel.",
               caixa=caixa, caixa_favicon=caixa)


# ---------------------------------------------------------------------------
# B · O «O» COM O ACENTO DO «PAÍS»
# ---------------------------------------------------------------------------
def direcao_b():
    """O «O» da casa com o acento agudo do «í» de «País» fundido no ombro."""
    H = 300.0
    cx, cy = CENTRO - 16, CENTRO + 20
    do, mo = letra_o(cx, cy, H)
    da, ma = acento_fundido(cx, cy, H, angulo=58.0, comprimento=0.52 * H)
    corpo = (
        f'    <!-- O «O» da casa: H={H:.0f}, haste={mo["T"]:.1f}, fino={mo["t"]:.1f},\n'
        f'         contraste {mo["T"] / mo["t"]:.2f}; contraforma recta de\n'
        f'         {2 * mo["a"]:.0f} x {2 * mo["b"]:.0f}, canto {mo["r"]:.1f}.\n'
        f'         O acento sai do ombro a {ma["angulo"]:.0f} graus, com a\n'
        f'         grossura da haste, e acaba num corte perpendicular. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do}"/>\n'
        f'    <path class="acento" d="{da}"/>'
    )
    do2, _ = letra_o(cx, cy, H, contraforma="oval")
    da2, _ = acento_fundido(cx, cy, H, angulo=58.0, comprimento=0.46 * H)
    favicon = (
        f'    <!-- 32 e 16 px: o canto recto da contraforma não chega a um píxel,\n'
        f'         e o acento encurta para não virar borrão. O que fica é o anel\n'
        f'         com o traço, que é a ideia. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do2}"/>\n'
        f'    <path class="acento" d="{da2}"/>'
    )
    R = mo["R"]
    ca, cb = ma["caixa"], letra_o(cx, cy, H)[1]
    caixa = (min(cx - R, ca[0]), min(cy - R, ca[1]),
             max(cx + R, ca[2]), max(cy + R, ca[3]))
    ca2 = acento_fundido(cx, cy, H, angulo=58.0, comprimento=0.46 * H)[1]["caixa"]
    caixa2 = (min(cx - R, ca2[0]), min(cy - R, ca2[1]),
              max(cx + R, ca2[2]), max(cy + R, ca2[3]))
    return svg("Direção B · o O com o acento do País", corpo, favicon,
               "A inicial única com o acento agudo do «í» fundido no ombro.",
               caixa=caixa, caixa_favicon=caixa2)


# ---------------------------------------------------------------------------
# C · O SELO
# ---------------------------------------------------------------------------
def direcao_c():
    """Os dois estados da prova, que é o que o selo do sítio distingue.

    `src/components/Provenance.astro` e `.src-chip::before`: quadrado cheio =
    proveniência completa; quadrado a tracejado = falta um campo. A marca são os
    dois, porque é a distinção que o sítio faz e não o carimbo.
    """
    lado = 176.0
    x0 = CENTRO - SINAL / 2
    x1 = CENTRO + SINAL / 2 - lado
    traco = 26.0
    ri = lado - traco
    # três traços por lado, contados: 3*(34+16) = 150 = o lado do caminho
    corpo = (
        f'    <!-- O quadrado cheio e o quadrado a tracejado, os dois estados do\n'
        f'         selo. Lado {lado:.0f}, traço {traco:.0f}, três riscos por lado\n'
        f'         ({ri:.0f} = 3 x (34 + 16)). -->\n'
        f'    <rect class="acento" x="{n(x0)}" y="{n(x0)}" width="{n(lado)}" height="{n(lado)}"/>\n'
        f'    <rect class="tinta-t" x="{n(x1 + traco / 2)}" y="{n(x1 + traco / 2)}" '
        f'width="{n(ri)}" height="{n(ri)}" stroke-width="{n(traco)}" '
        f'stroke-dasharray="34 16" stroke-dashoffset="17"/>'
    )
    favicon = (
        f'    <!-- 32 e 16 px: a 16 px um risco de 34 dá 1,06 px e o tracejado\n'
        f'         fecha-se numa linha cinzenta. O segundo quadrado passa a\n'
        f'         contorno inteiro: continua a ser o estado que falta, sem\n'
        f'         fingir um tracejado que já não existe. -->\n'
        f'    <rect class="acento" x="{n(x0)}" y="{n(x0)}" width="{n(lado)}" height="{n(lado)}"/>\n'
        f'    <rect class="tinta-t" x="{n(x1 + traco / 2)}" y="{n(x1 + traco / 2)}" '
        f'width="{n(ri)}" height="{n(ri)}" stroke-width="{n(traco)}"/>'
    )
    return svg("Direção C · o selo", corpo, favicon,
               "Os dois estados da prova: o quadrado cheio e o quadrado a tracejado.")


# ---------------------------------------------------------------------------
# D · A PEÇA, COMO AZULEJO
# ---------------------------------------------------------------------------
def direcao_d():
    """Um azulejo: fio a toda a volta, quatro cantos marcados, a medida dentro.

    Os cantos marcados não são enfeite: num pano de azulejo são eles que fazem o
    motivo dos quatro cantos quando as peças se juntam, e são eles que distinguem
    uma peça de cerâmica de uma célula de folha de cálculo.
    """
    traco = 18.0
    x0 = CENTRO - SINAL / 2
    x1 = CENTRO + SINAL / 2
    m = x0 + traco / 2
    lado = SINAL - traco
    sq = 34.0
    dentro = 30.0                     # a folga entre o fio e o motivo
    ix0, ix1 = x0 + dentro, x1 - dentro
    corpo = (
        f'    <!-- O azulejo: fio de {traco:.0f} a toda a volta, quatro quadrados\n'
        f'         de {sq:.0f} nos cantos, e a medida da peça no meio: a linha do\n'
        f'         valor (cheia) e a régua por baixo (fina). -->\n'
        f'    <rect class="acento-t" x="{n(m)}" y="{n(m)}" width="{n(lado)}" '
        f'height="{n(lado)}" stroke-width="{n(traco)}"/>\n'
    )
    for qx, qy in ((ix0, ix0), (ix1 - sq, ix0), (ix0, ix1 - sq), (ix1 - sq, ix1 - sq)):
        corpo += (f'    <rect class="acento" x="{n(qx)}" y="{n(qy)}" '
                  f'width="{n(sq)}" height="{n(sq)}"/>\n')
    vw, vh, vy = 236.0, 64.0, 194.0
    rw, rh, ry = 236.0, 20.0, 284.0
    corpo += (f'    <rect class="acento" x="{n(CENTRO - vw / 2)}" y="{n(vy)}" '
              f'width="{n(vw)}" height="{n(vh)}"/>\n'
              f'    <rect class="tinta" x="{n(CENTRO - rw / 2)}" y="{n(ry)}" '
              f'width="{n(rw)}" height="{n(rh)}"/>')
    favicon = (
        f'    <!-- 32 e 16 px: os quatro cantos e a régua fina desaparecem antes\n'
        f'         de se lerem. Fica o fio e a linha do valor. -->\n'
        f'    <rect class="acento-t" x="{n(m)}" y="{n(m)}" width="{n(lado)}" '
        f'height="{n(lado)}" stroke-width="{n(traco * 1.6)}"/>\n'
        f'    <rect class="acento" x="{n(CENTRO - vw / 2)}" y="{n(CENTRO - vh / 2)}" '
        f'width="{n(vw)}" height="{n(vh)}"/>'
    )
    return svg("Direção D · a peça como azulejo", corpo, favicon,
               "O quadrado com uma medida dentro, cobalto sobre papel.")


# ---------------------------------------------------------------------------
# E · O MAPA, AS TRÊS PARCELAS
# ---------------------------------------------------------------------------
NUM = re.compile(r"[MmLlHhVvZzCcSsQqTtAa]|-?\d*\.?\d+(?:[eE][-+]?\d+)?")
_TAM = {"M": 2, "m": 2, "L": 2, "l": 2, "H": 1, "h": 1, "V": 1, "v": 1,
        "C": 6, "c": 6, "S": 4, "s": 4, "Q": 4, "q": 4, "T": 2, "t": 2}


def _percorre(d):
    """Percorre um «path data» e devolve (comando, pontos absolutos) a cada passo."""
    toks = NUM.findall(d)
    x = y = sx = sy = 0.0
    cmd = None
    i = 0
    while i < len(toks):
        t = toks[i]
        if re.match(r"[A-Za-z]", t):
            cmd = t
            i += 1
            if cmd in "Zz":
                yield ("Z", [])
                x, y = sx, sy
            continue
        if cmd is None or cmd not in _TAM:
            i += 1
            continue
        k = _TAM[cmd]
        vals = [float(v) for v in toks[i:i + k]]
        i += k
        rel = cmd.islower()
        if cmd in "Hh":
            x = x + vals[0] if rel else vals[0]
            yield ("L", [(x, y)])
        elif cmd in "Vv":
            y = y + vals[0] if rel else vals[0]
            yield ("L", [(x, y)])
        else:
            pares = [(vals[j], vals[j + 1]) for j in range(0, k, 2)]
            absol = []
            for px, py in pares:
                absol.append((x + px if rel else px, y + py if rel else py))
            x, y = absol[-1]
            letra = cmd.upper()
            if letra == "M":
                sx, sy = x, y
                yield ("M", absol)
                cmd = "l" if rel else "L"
            else:
                yield (letra, absol)


def caixa_do_caminho(d):
    xs, ys = [], []
    for _, pts in _percorre(d):
        for px, py in pts:
            xs.append(px)
            ys.append(py)
    return min(xs), min(ys), max(xs), max(ys)


def transforma(d, k, dx, dy):
    fora = []
    for cmd, pts in _percorre(d):
        if cmd == "Z":
            fora.append("Z")
            continue
        fora.append(cmd + "L".join(f"{n(px * k + dx)} {n(py * k + dy)}" for px, py in pts)
                    if cmd == "L" else
                    cmd + " ".join(f"{n(px * k + dx)} {n(py * k + dy)}" for px, py in pts))
    return "".join(fora)


def encaixa(d, largura=None, altura=None, cx=CENTRO, cy=CENTRO):
    x0, y0, x1, y1 = caixa_do_caminho(d)
    w, h = x1 - x0, y1 - y0
    if largura is not None and altura is not None:
        k = min(largura / w, altura / h)
    elif largura is not None:
        k = largura / w
    else:
        k = altura / h
    return transforma(d, k, cx - (x0 + w / 2) * k, cy - (y0 + h / 2) * k), (w * k, h * k)


def subcaminhos(d):
    """Os sub-caminhos de um «path data», cada um com a sua caixa."""
    fora = []
    atual = None
    for cmd, pts in _percorre(d):
        if cmd == "M":
            atual = {"d": [f"M{n(pts[0][0])} {n(pts[0][1])}"],
                     "x0": pts[0][0], "y0": pts[0][1],
                     "x1": pts[0][0], "y1": pts[0][1]}
            fora.append(atual)
        elif atual is None:
            continue
        elif cmd == "Z":
            atual["d"].append("Z")
        else:
            atual["d"].append(cmd + "L".join(f"{n(px)} {n(py)}" for px, py in pts)
                              if cmd == "L" else
                              cmd + " ".join(f"{n(px)} {n(py)}" for px, py in pts))
            for px, py in pts:
                atual["x0"] = min(atual["x0"], px)
                atual["y0"] = min(atual["y0"], py)
                atual["x1"] = max(atual["x1"], px)
                atual["y1"] = max(atual["y1"], py)
    for sc in fora:
        sc["d"] = "".join(sc["d"])
        sc["lado"] = max(sc["x1"] - sc["x0"], sc["y1"] - sc["y0"])
    return fora


def parcelas(minimo=20.0):
    """As três parcelas de `mapa/pais.json`, cada uma num caminho só.

    `minimo` corta os sub-caminhos com menos de 20 unidades de lado. No campo de
    6090 x 8030 do mapa do sítio, 20 unidades dão 1,2 px num ícone de 60 e 0,3 px
    num de 16: são ilhéus que já não se desenham, e que sujam a silhueta em vez de
    a dizerem. As Ilhas Selvagens saem por aqui (o maior sub-caminho delas tem 19
    unidades de lado), e isso está dito no NOTAS.md, porque é geografia que se
    largou e não um pormenor de desenho.
    """
    dados = json.load(open(os.path.join(RAIZ, "mapa", "pais.json")))
    fora = {}
    for p in ("continente", "acores", "madeira"):
        pedacos = []
        for u in dados["unidades"]:
            if u["parcela"] != p:
                continue
            pedacos += [sc["d"] for sc in subcaminhos(u["d"]) if sc["lado"] >= minimo]
        fora[p] = "".join(pedacos)
    return fora


def direcao_e():
    """As três parcelas, cada uma na sua moldura, e nenhuma reduzida a um ponto.

    A DECISÃO É DA DIREÇÃO: continente, Açores e Madeira com a mesma dignidade.
    Três silhuetas soltas não a dão, por mais que se lhes mexa na escala — a
    massa do continente ganha sempre, e os arquipélagos leem-se como poeira ao
    lado dele (está medido a 60 px, nas quatro variantes que se experimentaram).
    O que a dá é a MOLDURA, e não é invenção nossa: o mapa do sítio já divide o
    país em três molduras com escalas próprias (`mapa/pais.json`, «molduras»:
    Madeira a 1,00, Açores a 0,38). Três caixas de peso igual dizem «três
    territórios» mesmo quando o que está dentro delas já não se lê.

    O QUE ISTO CUSTA, e fica dito: a escala verdadeira entre as parcelas
    desaparece, e a 60 px o que sobrevive é a estrutura de três, não a geografia.
    """
    p = parcelas()
    traco = 12.0
    quadros = [
        ("madeira", 76, 84, 244, 250),
        ("acores", 76, 262, 244, 428),
        ("continente", 260, 84, 436, 428),
    ]
    corpo = ('    <!-- As três molduras do mapa do sítio, de peso igual. Dentro de\n'
             '         cada uma, a silhueta da parcela, dos ficheiros de\n'
             '         `mapa/pais.json`, sem os ilhéus de menos de 20 unidades. -->\n')
    for nome, x0, y0, x1, y1 in quadros:
        corpo += (f'    <rect class="acento-t" x="{n(x0 + traco / 2)}" y="{n(y0 + traco / 2)}" '
                  f'width="{n(x1 - x0 - traco)}" height="{n(y1 - y0 - traco)}" '
                  f'stroke-width="{n(traco)}"/>\n')
        d, (w, h) = encaixa(p[nome], largura=x1 - x0 - 52, altura=y1 - y0 - 52,
                            cx=(x0 + x1) / 2, cy=(y0 + y1) / 2)
        corpo += (f'    <path class="acento-costura" data-parcela="{nome}" '
                  f'd="{d}"/>  <!-- {w:.0f} x {h:.0f} -->\n')
    caixa = (76, 84, 436, 428)

    # 32 e 16: as molduras fecham-se em traços e o que está dentro some.
    grandes = parcelas(minimo=90.0)
    favicon = ('    <!-- 32 e 16 px: um fio de 12 unidades dá 0,4 px a 16, e o que\n'
               '         está dentro das molduras já não existe. Ficam as três\n'
               '         parcelas sem moldura, com as ilhas que ainda dão píxel:\n'
               '         São Miguel, o Pico, São Jorge, a Madeira, o Porto Santo. -->\n')
    c2, (c2w, c2h) = encaixa(grandes["continente"], altura=250, cx=372, cy=256)
    a2, (a2w, a2h) = encaixa(grandes["acores"], largura=150, cx=182, cy=330)
    m2, (m2w, m2h) = encaixa(grandes["madeira"], largura=130, cx=182, cy=176)
    for d in (c2, a2, m2):
        favicon += f'    <path class="acento-costura" d="{d}"/>\n'
    caixa_f = (182 - a2w / 2, 176 - m2h / 2, 372 + c2w / 2, 330 + a2h / 2)
    return svg("Direção E · o mapa, as três parcelas", corpo.rstrip("\n"),
               favicon.rstrip("\n"),
               "Continente, Açores e Madeira, cada um na sua moldura, em cobalto.",
               caixa=caixa, caixa_favicon=caixa_f)


# ---------------------------------------------------------------------------
# F · A RÉGUA
# ---------------------------------------------------------------------------
def direcao_f():
    """A régua do sítio, sem o «H» que dois postes com uma trave fazem.

    `src/components/inicio/Regua.astro`: a referência a tinta à altura toda, a
    barra a medir a distância, o traço no valor. Dois postes iguais com uma trave
    no meio leem-se como um «H» e nada mais; aqui o valor entra como o QUADRADO
    DO SELO na ponta da barra, que é o que o sítio põe ao lado de cada número, e a
    referência fica sozinha em pé.
    """
    x0 = CENTRO - SINAL / 2
    x1 = CENTRO + SINAL / 2
    alto = 300.0
    ref_w = 64.0
    barra_h = 68.0
    by = CENTRO - barra_h / 2
    sq = barra_h
    corpo = (
        f'    <!-- A referência em pé ({ref_w:.0f} x {alto:.0f}), a barra da\n'
        f'         distância ({barra_h:.0f} de altura) e o selo do valor na ponta\n'
        f'         ({sq:.0f} x {sq:.0f}). Três peças da casa, nenhuma inventada. -->\n'
        f'    <rect class="tinta" x="{n(x0)}" y="{n(by)}" width="{n(sq)}" height="{n(sq)}"/>\n'
        f'    <rect class="acento" x="{n(x0 + sq)}" y="{n(by)}" '
        f'width="{n(x1 - ref_w - x0 - sq)}" height="{n(barra_h)}"/>\n'
        f'    <rect class="tinta" x="{n(x1 - ref_w)}" y="{n(CENTRO - alto / 2)}" '
        f'width="{n(ref_w)}" height="{n(alto)}"/>'
    )
    favicon = (
        f'    <!-- 32 e 16 px: o quadrado do selo e a barra colam-se num traço só.\n'
        f'         Fica a barra a bater na referência, que é o que a régua diz. -->\n'
        f'    <rect class="acento" x="{n(x0)}" y="{n(CENTRO - 46)}" '
        f'width="{n(x1 - ref_w - x0)}" height="{n(92)}"/>\n'
        f'    <rect class="tinta" x="{n(x1 - ref_w)}" y="{n(CENTRO - alto / 2)}" '
        f'width="{n(ref_w)}" height="{n(alto)}"/>'
    )
    return svg("Direção F · a régua", corpo, favicon,
               "O instrumento de convergência reduzido a um sinal.")



# ---------------------------------------------------------------------------
# G · O SELO DENTRO DO «O» (a sétima, e a razão está no NOTAS.md)
# ---------------------------------------------------------------------------
def direcao_g():
    """A letra da casa com a prova da casa lá dentro.

    Das seis do brief, duas são letra sem instrumento (A, B), três são
    instrumento sem letra (C, D, F) e uma é território (E). Esta é as duas
    coisas: o «O» de «O Estado do
    País», e dentro dele o quadrado cheio do selo, que é o que o sítio põe ao lado
    de cada número. A contraforma do «O» já era um rectângulo por construção; o
    selo é o quadrado que lá mora.
    """
    H = 300.0
    cx, cy = CENTRO, CENTRO
    do, mo = letra_o(cx, cy, H)
    folga = 15.0
    lado = 2 * mo["a"] - 2 * folga
    corpo = (
        f'    <!-- O «O» da casa (H={H:.0f}, haste={mo["T"]:.1f}, fino={mo["t"]:.1f})\n'
        f'         com o selo dentro: quadrado de {lado:.0f}, com {folga:.0f} de\n'
        f'         folga para a contraforma de {2 * mo["a"]:.0f} x {2 * mo["b"]:.0f}. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do}"/>\n'
        f'    <rect class="acento" x="{n(cx - lado / 2)}" y="{n(cy - lado / 2)}" '
        f'width="{n(lado)}" height="{n(lado)}"/>'
    )
    do2, mo2 = letra_o(cx, cy, H, contraforma="oval")
    lado2 = 2 * mo2["a"] - 2 * 35.0
    favicon = (
        f'    <!-- 32 e 16 px: o canto recto da contraforma não chega a um píxel e\n'
        f'         a folga entre o selo e a letra fecha-se. A contraforma passa a\n'
        f'         oval e o selo encolhe para {lado2:.0f}, para o anel não colar. -->\n'
        f'    <path class="tinta" fill-rule="evenodd" d="{do2}"/>\n'
        f'    <rect class="acento" x="{n(cx - lado2 / 2)}" y="{n(cy - lado2 / 2)}" '
        f'width="{n(lado2)}" height="{n(lado2)}"/>'
    )
    caixa = (cx - mo["R"], cy - mo["R"], cx + mo["R"], cy + mo["R"])
    return svg("Direção G · o selo dentro do O", corpo, favicon,
               "A inicial da casa com o quadrado da prova lá dentro.",
               caixa=caixa, caixa_favicon=caixa)


DIRECOES = [
    ("1-ligadura-oe", direcao_a),
    ("2-o-acento", direcao_b),
    ("3-selo", direcao_c),
    ("4-azulejo", direcao_d),
    ("5-mapa", direcao_e),
    ("6-regua", direcao_f),
    ("7-selo-no-o", direcao_g),
]


def escreve():
    pasta = os.path.join(AQUI, "direcoes")
    os.makedirs(pasta, exist_ok=True)
    for slug, fn in DIRECOES:
        s = fn()
        with open(os.path.join(pasta, slug + ".svg"), "w") as f:
            f.write(s)
        print(f"escrito design/marca/direcoes/{slug}.svg  ({len(s)} bytes)")


if __name__ == "__main__" and len(sys.argv) == 1:
    escreve()


# ===========================================================================
# A PRANCHA
# ===========================================================================
"""
`python3 design/marca/desenhar.py prancha` escreve `design/marca/PRANCHA.html`.

A ORDEM IMPORTA, e é esta:
    1. python3 design/marca/desenhar.py          · os SVG
    2. node   design/marca/exportar.mjs          · os PNG de cada tamanho
    3. python3 design/marca/desenhar.py prancha  · a prancha, com os PNG embebidos
    4. node   design/marca/exportar.mjs          · a captura PRANCHA.png

A prancha mostra PNG e não SVG por uma razão: o que se julga é o que o telemóvel
desenha, e o telemóvel desenha píxeis. Um SVG encolhido pelo navegador dentro da
prancha não é a mesma imagem que o sistema operativo compõe a 60 px.
"""

import base64
import io

FICHA = {
    "1-ligadura-oe": {
        "letra": "A",
        "nome": "a ligadura «OE»",
        "tenta": "As duas iniciais soldadas numa letra só: a haste do «E» é a haste "
                 "direita do «O». Duas letras encostadas leem-se como sigla; soldadas "
                 "leem-se como uma marca.",
        "arrisca": "«OE» é, em português, o Orçamento do Estado. E o «E» serifado "
                   "branco sobre campo escuro já é do Expresso e do Economist; este "
                   "é tinta sobre papel, que é o lado contrário.",
    },
    "2-o-acento": {
        "letra": "B",
        "nome": "o «O» com o acento do «País»",
        "tenta": "A inicial única com o acento agudo do «í» de «País» fundido no ombro "
                 "direito, com a grossura da haste e um corte perpendicular na ponta. "
                 "O acento é a marca, e não um enfeite pousado por cima.",
        "arrisca": "Um anel com um traço em diagonal lê-se como lupa, e a Lupa é um "
                   "verificador de factos que está na folha. O anel sozinho é do "
                   "Observador.",
    },
    "3-selo": {
        "letra": "C",
        "nome": "o selo",
        "tenta": "Os dois estados da prova, que é a distinção que o sítio faz em cada "
                 "linha: o quadrado cheio (proveniência completa) e o quadrado a "
                 "tracejado (falta um campo).",
        "arrisca": "Dois quadrados, um deles a tracejado, leem-se como «selecionar» "
                   "ou «duplicar» num aparelho de computador. E o tracejado fecha-se "
                   "numa linha cinzenta abaixo dos 32 px.",
    },
    "4-azulejo": {
        "letra": "D",
        "nome": "a peça, como azulejo",
        "tenta": "O quadrado com uma medida dentro, lido como azulejo: fio a toda a "
                 "volta, quatro cantos marcados (são eles que fazem o motivo quando as "
                 "peças se juntam num pano) e a medida da peça no meio.",
        "arrisca": "Um rectângulo com um fio à volta e uma barra lá dentro é também a "
                   "célula de uma folha de cálculo, ou uma caixa de diálogo.",
    },
    "5-mapa": {
        "letra": "E",
        "nome": "o mapa, as três parcelas",
        "tenta": "Continente, Açores e Madeira com a mesma dignidade, nas silhuetas do "
                 "mapa do próprio sítio (`mapa/pais.json`), em cobalto.",
        "arrisca": "A escala verdadeira entre as três parcelas larga-se, e isso é "
                   "geografia trocada por composição. A 60 px as ilhas menores são "
                   "poeira. A silhueta do país é o sinal mais usado por aplicações "
                   "públicas.",
    },
    "6-regua": {
        "letra": "F",
        "nome": "a régua",
        "tenta": "O instrumento de convergência com a gramática que o sítio já tem: a "
                 "referência em pé, a barra a medir a distância, e o quadrado do selo "
                 "na ponta do valor.",
        "arrisca": "Um sinal abstracto não diz o nome de nada, e este sítio vive de "
                   "números com nome. Lido depressa, é uma barra de progresso.",
    },
    "7-selo-no-o": {
        "letra": "G",
        "nome": "o selo dentro do «O»",
        "tenta": "A letra da casa com a prova da casa lá dentro: o «O» de «O Estado do "
                 "País», e na contraforma (que é um rectângulo por construção) o "
                 "quadrado cheio do selo.",
        "arrisca": "Um anel é do Observador, e um círculo com uma forma no meio é da "
                   "Pordata. A distância está no campo (papel, e não azul) e na forma "
                   "de dentro (um quadrado cheio, e não um vazio).",
    },
}

ORDEM = ["1-ligadura-oe", "2-o-acento", "3-selo", "4-azulejo",
         "5-mapa", "6-regua", "7-selo-no-o"]

# As referências que mais perto passam de alguma destas direções.
VIZINHOS = [
    ("observador.pt.png", "Observador"),
    ("pordata.pt.png", "Pordata"),
    ("expresso.pt.png", "Expresso"),
    ("publico.pt.png", "Público"),
    ("economist.com.png", "Economist"),
    ("jornaldenegocios.pt.png", "Negócios"),
    ("ine.pt.png", "INE"),
    ("transparencia.gov.pt.png", "Transparência"),
    ("nexojornal.com.br.png", "Nexo"),
    ("folha.uol.com.br.png", "Folha"),
    ("estadao.com.br.png", "Estadão"),
    ("usafacts.org.png", "USAFacts"),
    ("civio.es.png", "Civio"),
    ("lupa.png", "Lupa"),
    ("bbc.com.png", "BBC"),
    ("propublica.org.png", "ProPublica"),
]


def _b64_png(caminho):
    with open(caminho, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


def _png(slug, nome):
    return _b64_png(os.path.join(AQUI, "EXPORT", slug, f"{slug}-{nome}.png"))


def tira_de_vizinhanca():
    """As sete direções e dezasseis referências, todas a 60 px, na mesma tira.

    É a comparação que o brief pede: à MESMA escala, e não cada uma na sua.
    """
    from PIL import Image
    cel, alto_r, alto_t = 76, 96, 22
    itens = [(f"EXPORT/{s}/{s}-60.png", FICHA[s]["letra"]) for s in ORDEM]
    itens += [(f"referencias/{f}", r) for f, r in VIZINHOS]
    por_linha = 12
    linhas = (len(itens) + por_linha - 1) // por_linha
    im = Image.new("RGB", (cel * por_linha, linhas * (alto_r + alto_t)), (222, 225, 220))
    from PIL import ImageDraw
    d = ImageDraw.Draw(im)
    for i, (rel, rotulo) in enumerate(itens):
        lx, ly = i % por_linha, i // por_linha
        src = Image.open(os.path.join(AQUI, rel)).convert("RGBA")
        if src.size != (60, 60):
            src = src.resize((60, 60), Image.LANCZOS)
        fundo = Image.new("RGB", (60, 60), (255, 255, 255))
        fundo.paste(src, (0, 0), src)
        im.paste(fundo, (lx * cel + 8, ly * (alto_r + alto_t) + 8))
        d.text((lx * cel + 8, ly * (alto_r + alto_t) + 74), rotulo[:11], fill=(40, 42, 40))
    saida = io.BytesIO()
    im.save(saida, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(saida.getvalue()).decode(), im.size


def folha_embebida():
    """A folha do gabinete, com a paleta reduzida para caber num ficheiro só."""
    from PIL import Image
    f = os.path.join(AQUI, "referencias", "folha-referencias.png")
    im = Image.open(f).convert("RGB").quantize(colors=256, method=Image.MEDIANCUT)
    saida = io.BytesIO()
    im.save(saida, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(saida.getvalue()).decode(), im.size


def caminho_do_nome(texto="O Estado do País", altura=100.0, tracking=-0.014):
    """O nome em Spectral, convertido a contorno, com o espacejamento do sítio.

    `.wordmark` em `src/styles/site.css`: Spectral 400, `letter-spacing:
    -0.014em`. É esse o espacejamento que aqui se aplica, e não um à vista.
    """
    sys.path.insert(0, AQUI)
    from glifos import contorno
    from fontTools.ttLib import TTFont
    fonte = TTFont(SPECTRAL_RG)
    cmap = fonte.getBestCmap()
    nomes = [cmap[ord(c)] for c in texto]
    aperto = {}
    for i in range(len(nomes) - 1):
        aperto[(nomes[i], nomes[i + 1])] = tracking * 1000
    d, largura, _, _ = contorno(SPECTRAL_RG, texto, altura, aperto=aperto)
    x0, y0, x1, y1 = caixa_do_caminho(d)
    return d, (x0, y0, x1, y1)


SPECTRAL_RG = os.path.join(RAIZ, "public", "tipos", "spectral", "Spectral-Regular.woff2")
SPECTRAL_SC = os.path.join(RAIZ, "public", "tipos", "spectral-sc", "SpectralSC-Regular.woff2")


CSS_PRANCHA = f"""
  :root {{ color-scheme: light; }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; padding: 40px 44px 72px;
    background: {PAPEL}; color: {TINTA};
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 15px; line-height: 1.5;
  }}
  h1 {{ font-size: 30px; margin: 0 0 6px; font-weight: 400; letter-spacing: -0.014em; }}
  h2 {{ font-size: 21px; margin: 0 0 2px; font-weight: 400; }}
  h3 {{ font-size: 13px; margin: 24px 0 8px; font-weight: 400;
       text-transform: uppercase; letter-spacing: 0.09em; color: #585d5b; }}
  p {{ margin: 0 0 8px; max-width: 74ch; }}
  .fina {{ color: #585d5b; font-size: 13.5px; }}
  .fio {{ border: 0; border-top: 1px solid #d9ddd8; margin: 34px 0 26px; }}
  .cabeca {{ border-bottom: 2px solid {TINTA}; padding-bottom: 18px; margin-bottom: 26px; }}
  .dir {{ page-break-inside: avoid; margin-bottom: 8px; }}
  .dir + .dir {{ border-top: 1px solid #d9ddd8; padding-top: 26px; margin-top: 26px; }}
  .marca-letra {{ font-size: 13px; letter-spacing: 0.1em; color: #585d5b; }}
  .fila {{ display: flex; align-items: flex-end; gap: 22px; flex-wrap: wrap;
          margin: 16px 0 6px; }}
  figure {{ margin: 0; }}
  figcaption {{ font-size: 11px; color: #585d5b; margin-top: 5px; line-height: 1.3;
               font-family: ui-monospace, Menlo, monospace; letter-spacing: 0.01em; }}
  img {{ display: block; }}
  .px {{ image-rendering: pixelated; }}
  /* O chão cinzento existe para se ver a BORDA do ícone: um campo de papel sobre
     papel não tem canto nenhum à vista, e é o canto que o iPhone arredonda. */
  .chao {{ display: inline-block; line-height: 0; background: #c9cec8; }}
  .ios {{ border-radius: 22.37%; }}
  .circulo {{ border-radius: 50%; }}
  .lupa {{ outline: 1px solid #d9ddd8; }}
  .lockup {{ display: flex; align-items: center; gap: 14px; padding: 14px 18px;
            background: {PAPEL}; border: 1px solid #d9ddd8; }}
  .lockup.escuro {{ background: {PAPEL_ESCURO}; border-color: #3a3f3c; }}
  .lockup img {{ width: 46px; height: 46px; border-radius: 22.37%; }}
  .lockup svg {{ height: 27px; }}
  .nome-claro {{ fill: {TINTA}; }}
  .nome-escuro {{ fill: {TINTA_ESCURA}; }}
  .risco {{ border-left: 3px solid {AMBAR}; padding-left: 12px; }}
  .tabela {{ border-collapse: collapse; font-size: 13px; }}
  .tabela td, .tabela th {{ border-bottom: 1px solid #d9ddd8; padding: 5px 14px 5px 0;
                           text-align: left; font-weight: 400; vertical-align: top; }}
  .amostra {{ display: inline-block; width: 26px; height: 13px; vertical-align: -1px;
             border: 1px solid #585d5b; }}
  .larga {{ max-width: 1188px; width: 100%; height: auto; border: 1px solid #d9ddd8; }}
"""


def bloco_direcao(slug):
    f = FICHA[slug]
    p = lambda nome: _png(slug, nome)  # noqa: E731
    dn, (nx0, ny0, nx1, ny1) = caminho_do_nome(altura=100)
    vb = f"{n(nx0)} {n(ny0)} {n(nx1 - nx0)} {n(ny1 - ny0)}"
    lock = (f'<svg viewBox="{vb}" role="img" aria-label="O Estado do País">'
            f'<path class="%s" d="{dn}"/></svg>')
    return f"""
  <section class="dir" id="{slug}">
    <p class="marca-letra">DIREÇÃO {f["letra"]}</p>
    <h2>{f["nome"]}</h2>
    <p>{f["tenta"]}</p>
    <div class="fila">
      <figure><span class="chao"><img src="{p('180')}" width="180" height="180" alt=""></span><figcaption>180 · claro<br>apple-touch-icon</figcaption></figure>
      <figure><span class="chao"><img class="ios" src="{p('180')}" width="180" height="180" alt=""></span><figcaption>180 · como o iPhone<br>arredonda</figcaption></figure>
      <figure><span class="chao"><img src="{p('120')}" width="120" height="120" alt=""></span><figcaption>120</figcaption></figure>
      <figure><span class="chao"><img src="{p('60')}" width="60" height="60" alt=""></span><figcaption>60 · o juízo</figcaption></figure>
      <figure><span class="chao"><img class="px" src="{p('60')}" width="240" height="240" alt=""></span><figcaption>60, ampliado 4x<br>(os mesmos píxeis)</figcaption></figure>
    </div>
    <div class="fila">
      <figure><span class="chao"><img src="{p('180-escuro')}" width="180" height="180" alt=""></span><figcaption>180 · escuro</figcaption></figure>
      <figure><span class="chao"><img src="{p('120-escuro')}" width="120" height="120" alt=""></span><figcaption>120 · escuro</figcaption></figure>
      <figure><span class="chao"><img src="{p('60-escuro')}" width="60" height="60" alt=""></span><figcaption>60 · escuro</figcaption></figure>
      <figure><span class="chao"><img class="px" src="{p('60-escuro')}" width="240" height="240" alt=""></span><figcaption>60 escuro, 4x</figcaption></figure>
    </div>
    <div class="fila">
      <figure><span class="chao"><img class="circulo" src="{p('maskable-180')}" width="180" height="180" alt=""></span><figcaption>maskable · círculo<br>(Android)</figcaption></figure>
      <figure><span class="chao"><img class="ios" src="{p('maskable-180')}" width="180" height="180" alt=""></span><figcaption>maskable · quadrado<br>arredondado</figcaption></figure>
      <figure><span class="chao"><img src="{p('32')}" width="32" height="32" alt=""></span><figcaption>32</figcaption></figure>
      <figure><span class="chao lupa"><img class="px" src="{p('32')}" width="128" height="128" alt=""></span><figcaption>32, 4x</figcaption></figure>
      <figure><span class="chao"><img src="{p('16')}" width="16" height="16" alt=""></span><figcaption>16</figcaption></figure>
      <figure><span class="chao lupa"><img class="px" src="{p('16')}" width="128" height="128" alt=""></span><figcaption>16, 8x</figcaption></figure>
      <figure><span class="chao lupa"><img class="px" src="{p('32-escuro')}" width="128" height="128" alt=""></span><figcaption>32 escuro, 4x</figcaption></figure>
    </div>
    <div class="fila">
      <div class="lockup"><img src="{p('180')}" alt="">{lock % 'nome-claro'}</div>
      <div class="lockup escuro"><img src="{p('180-escuro')}" alt="">{lock % 'nome-escuro'}</div>
    </div>
    <p class="risco fina"><strong>O que arrisca.</strong> {f["arrisca"]}</p>
  </section>"""


def prancha():
    tira, tira_tam = tira_de_vizinhanca()
    folha, folha_tam = folha_embebida()
    blocos = "\n".join(bloco_direcao(s) for s in ORDEM)
    html = f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>A marca · sete direções · O Estado do País</title>
<style>{CSS_PRANCHA}</style>
</head>
<body>
<header class="cabeca">
  <h1>«O Estado do País» · a marca e o ícone do telemóvel</h1>
  <p class="fina">Prancha de exploração, 28.08.2026, ramo <code>marca-2026-08-28</code>.
  Nada disto está no sítio: não há ficheiro em <code>public/</code>, não há linha no
  <code>&lt;head&gt;</code> e não há manifesto. São sete direções para a direção
  escolher uma e iterá-la.</p>
  <p class="fina">Tudo o que se vê aqui está dentro deste ficheiro: as imagens são
  PNG embebidos, e o nome é contorno e não texto composto. A prancha abre sem rede.</p>
  <p class="fina"><strong>Como se lê.</strong> A coluna dos 60 px é a que decide, porque é a esse
  tamanho que o ícone aparece no ecrã principal de um telemóvel. Os ampliados ao lado
  são os MESMOS píxeis, esticados: servem para ver o que morreu, não para julgar.</p>
</header>

<h3>A régua desta prancha</h3>
<table class="tabela">
  <tr><th>O campo</th><td>512 x 512. O sinal cabe num quadrado de 360 (70,3 % do campo);
      as 42 referências põem a forma entre 55 e 70 %.</td></tr>
  <tr><th>O <code>maskable</code></th><td>O sinal encolhe para 0,78 e o campo fica a
      preencher tudo: 360 x 0,78 = 281 de lado, 198,6 de meia-diagonal, dentro dos
      204,8 do círculo seguro de raio 40 % que o Android recorta.</td></tr>
  <tr><th>A paleta</th><td>
      <span class="amostra" style="background:{PAPEL}"></span> papel <code>#f6f7f4</code> ·
      <span class="amostra" style="background:{TINTA}"></span> tinta <code>#17191b</code> ·
      <span class="amostra" style="background:{COBALTO}"></span> cobalto <code>#1f4e8c</code> (7,73:1 sobre papel) ·
      <span class="amostra" style="background:{COBALTO_CLARO}"></span> cobalto claro <code>#7fa6dc</code> (7,18:1 sobre papel escuro) ·
      <span class="amostra" style="background:{AMBAR}"></span> âmbar <code>#e0a21a</code> (2,09:1 sobre papel claro; 8,00:1 sobre o escuro).
      Todas de <code>src/styles/tokens.css</code>; nenhuma nova.</td></tr>
  <tr><th>A letra desenhada</th><td>Altura de maiúscula H; haste 0,233 H; fino 0,100 H;
      contraste 2,33. O «O» do Spectral SemiBold, medido no ficheiro da casa, tem haste
      0,199 H, fino 0,076 H e contraste 2,62. A ideia: circunferência exata por fora,
      RECTÂNGULO por dentro. Remates cortados a direito, serifas em laje sem colo.</td></tr>
  <tr><th>O 32 e o 16</th><td>Cada direção tem um segundo desenho para o favicon, com o
      que morre tirado em vez de deixado a sujar. É a mesma forma com menos, e nunca
      outra forma.</td></tr>
</table>

<hr class="fio">
{blocos}

<hr class="fio">
<h3>A vizinhança a 60 px</h3>
<p class="fina">As sete direções e dezasseis das referências, todas reduzidas ao mesmo
tamanho. É aqui que se vê o que cada uma tem de seu e onde é que já está alguém.</p>
<img class="larga" src="{tira}" width="{tira_tam[0]}" height="{tira_tam[1]}" alt="">

<h3>A folha das 42 referências</h3>
<p class="fina">A folha do gabinete, a 120 e a 60 px, tal como veio (a paleta foi
reduzida a 256 cores para a prancha caber num ficheiro; o original está em
<code>design/marca/referencias/folha-referencias.png</code>).</p>
<img class="larga" src="{folha}" width="{folha_tam[0]}" height="{folha_tam[1]}" alt="">
</body>
</html>
"""
    caminho = os.path.join(AQUI, "PRANCHA.html")
    with open(caminho, "w") as f:
        f.write(html)
    print(f"escrito design/marca/PRANCHA.html  ({len(html) / 1024:.0f} KiB)")


if len(sys.argv) > 1 and sys.argv[1] == "prancha":
    prancha()
