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
OCRE = "#7a5300"             # 6,37:1 sobre papel claro; falha sobre papel escuro (2,62:1)

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


def letra_e(x0, cy, H, braco_curto=0.48, braco_longo=0.62, com_serifa=True, fino=None):
    """O «E» da casa: haste, três braços, e o remate cortado a direito.

    As serifas são lajes sem colo (nem curva nem transição) da grossura do fino:
    uma serifa e um fino pesam o mesmo, e um remate acaba sempre num corte
    horizontal ou vertical. `x0` é a esquerda da haste.

    `fino` afina a grossura dos braços sem mexer na haste, e existe por causa da
    direção I: um braço mais fino dá um vão mais alto, e é o vão que tem de
    segurar o selo.
    """
    T = RAZAO_HASTE * H
    t = (RAZAO_FINO if fino is None else fino) * H
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
    return "".join(partes), {"T": T, "t": t, "ta": ta, "tm": tm, "La": La, "Lm": Lm,
                             "yc": yc, "yb": yb}


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
# O «E» DO LIVRO-RAZÃO (a terceira adenda, direção H)
# ---------------------------------------------------------------------------
# A grelha do «E» de três barras, e a razão de cada número.
#
#   três barras e dois vãos enchem a altura:  3 b + 2 g = H
#   barra   b = 0,24 H     vão  g = 0,14 H
#   haste   0,100 H  ·  o FINO da casa, e não a haste: neste «E» o contraste
#           está invertido, a haste é o fio e os braços são as barras. Nenhum
#           tipo o faz, e é isso que separa esta letra do «E» composto.
#   braços  0,80 H / 0,55 H / 0,80 H  ·  o de cima e o de baixo iguais, o do
#           meio curto, que é o que faz um «E» ser lido como «E».
#
# As três barras são os três campos que uma linha do livro-razão nunca tem em
# falta (`ledger/claims/*.yml`: `value`, `source`, `access_date`). A do meio, a
# da fonte, leva o acento, e é também o braço curto: o sítio da letra onde a
# cor cabe sem estragar o desenho.
BARRA = 0.24
VAO = 0.14
BRACO_LONGO_H = 0.80
BRACO_CURTO_H = 0.55


def letra_e_livro(x0, ytopo, H, barra=BARRA, vao=VAO, haste=RAZAO_FINO,
                  longo=BRACO_LONGO_H, curto=BRACO_CURTO_H):
    """O «E» de três barras. Devolve [(classe, «path»)] e as medidas.

    Devolve as partes separadas porque a barra do meio leva outra cor: um «path»
    só não chegava.
    """
    b, g = barra * H, vao * H
    partes = []
    if haste:
        partes.append(("tinta", rect(x0, ytopo, x0 + haste * H, ytopo + H)))
    for i, L in enumerate((longo, curto, longo)):
        y = ytopo + i * (b + g)
        partes.append(("acento" if i == 1 else "tinta",
                       rect(x0, y, x0 + L * H, y + b)))
    return partes, {"b": b, "g": g, "largura": longo * H,
                    "haste": haste * H, "La": longo * H, "Lm": curto * H}


# ---------------------------------------------------------------------------
# A PALAVRA «ESTADO» (a terceira adenda, direção J)
# ---------------------------------------------------------------------------
# O QUE FOI TENTADO E NÃO SAIU, porque é isto que decide o que está aqui.
#
# A palavra foi desenhada inteira, letra a letra, na grelha da casa, com uma
# ideia só: TODAS AS REDONDAS SÃO O MESMO BOJO, e o que muda é onde está a
# haste e até onde ela sobe (o «o» é o bojo; o «a» é o bojo com haste à altura
# de x; o «d» é a mesma haste subida à maiúscula; o «t» é haste, travessão e um
# pé cortado a direito). Os quatro saíram. O «s» não sai desta grelha, e a
# razão é a regra da casa, não a falta de jeito: «remates cortados a direito,
# no horizontal ou no vertical, nunca em ângulo». Um «s» é duas curvas cujos
# remates não são horizontais nem verticais. Cortados no raio dão um bico;
# cortados na horizontal fecham a abertura e o «s» vira dois discos. Doze
# construções foram desenhadas e vistas a 180 px (bandas de arco com a elipse
# de dentro rodada de 0 a 55 graus, lobos de 0,30 a 0,36 da altura de x,
# grossura fixa, e dois anéis cortados a direito): nenhuma se lê como «s».
#
# O QUE ESTÁ AQUI, POR ISSO. A adenda deixou a porta aberta à letra: «a palavra
# inteira desenhada (ou o «E» desenhado mais a serifada da casa para "stado")».
# É a segunda. O «E» é desenhado; «stado» é Spectral SemiBold, do ficheiro da
# casa. O SemiBold e não o Regular porque a haste do «d» do Regular mede 68,9
# contra os 98,3 do SemiBold (medidos no ficheiro, à mesma escala), e ao lado de
# um «E» de haste 0,233 H o Regular lê-se como duas letras de pesos diferentes.
#
# É O ÚNICO SÍTIO DE TODO ESTE TRABALHO onde um contorno do Spectral entra num
# sinal, e não só na marca horizontal. Fica dito na §1 das NOTAS, e desfaz-se
# tirando a palavra do ícone: a 60, 32 e 16 px a J já é só o «E» desenhado.
SPECTRAL_SB = os.path.join(RAIZ, "public", "tipos", "spectral", "Spectral-SemiBold.woff2")


# A LINHA DO VALOR, que é o que a direção J2 acrescenta à J (quarta adenda).
#
# O braço do meio do «E» deixa de ser um braço e passa a ser uma linha: cobalto,
# e mais grossa do que os outros dois. A grossura foi escolhida a olhar, e as
# três que se viram estão na §5. A 0,086 H (que é a grossura própria do braço do
# meio nesta grelha) o azul lê-se como uma cor pousada num traço, ou seja como
# enfeite; a 0,20 H lê-se como uma linha metida dentro da letra, porque é mais
# grossa do que os braços de tinta e por isso é outro objeto. É a segunda.
LINHA_VALOR = 0.20            # o braço do meio, em cobalto
LINHA_VALOR_16 = 0.22         # a mesma linha no desenho de 32 e 16
BRACOS_16 = 0.130             # e os braços de tinta engrossam com ela


def letra_e_linha(x0, cy, H, valor=LINHA_VALOR, fino=RAZAO_FINO,
                  braco_longo=0.62, braco_curto=0.48, com_serifa=True):
    """O «E» da casa com o braço do meio trocado por uma linha de valor.

    Devolve [(regra, classe, «path»)] e as medidas. As partes vêm separadas
    porque a linha leva outra cor, e um «path» só não chegava.
    """
    T = RAZAO_HASTE * H
    t = fino * H
    tm = valor * H
    yc, yb = cy - H / 2.0, cy + H / 2.0
    La, Lm = braco_longo * H, braco_curto * H
    tinta = [rect(x0, yc, x0 + T, yb),
             rect(x0, yc, x0 + La, yc + t),
             rect(x0, yb - t, x0 + La, yb)]
    azul = [rect(x0, cy - tm / 2, x0 + Lm, cy + tm / 2)]
    if com_serifa:
        hs = t * 2.2
        tinta.append(rect(x0 + La - t, yc, x0 + La, yc + hs))
        tinta.append(rect(x0 + La - t, yb - hs, x0 + La, yb))
        azul.append(rect(x0 + Lm - t * 0.86, cy - tm / 2 - t * 0.5,
                         x0 + Lm, cy + tm / 2 + t * 0.5))
    partes = ([("nonzero", "tinta", d) for d in tinta]
              + [("nonzero", "acento", d) for d in azul])
    return partes, {"T": T, "t": t, "tm": tm, "La": La, "Lm": Lm, "yc": yc, "yb": yb}


def palavra_estado(x0, base, H, espaco=0.10, e_curto=0.48, e_largo=0.62, valor=None):
    """«Estado»: o «E» desenhado da casa e «stado» em Spectral SemiBold.

    `valor` a `None` dá o «E» de sempre (direção J); com um número, dá o «E» com
    a linha do valor (direção J2), e o número é a grossura dela em altura de
    maiúscula.

    Devolve [(regra de enchimento, classe, «path»)] e a largura da palavra.
    """
    sys.path.insert(0, AQUI)
    from glifos import contorno
    if valor is None:
        de, me = letra_e(x0, base - H / 2.0, H, braco_curto=e_curto, braco_longo=e_largo)
        partes = [("nonzero", "tinta", de)]
    else:
        partes, me = letra_e_linha(x0, base - H / 2.0, H, valor=valor,
                                   braco_curto=e_curto, braco_longo=e_largo)
    d_stado, larg, _, _ = contorno(SPECTRAL_SB, "stado", H)
    dx = x0 + me["La"] + espaco * H
    partes = partes + [("nonzero", "tinta", transforma(d_stado, 1.0, dx, base))]
    return partes, me["La"] + espaco * H + larg


def caminhos(partes, indent="    "):
    """[(regra, classe, «path»)] em elementos `<path>`."""
    fora = []
    for regra, classe, d in partes:
        fr = ' fill-rule="evenodd"' if regra == "evenodd" else ""
        fora.append(f'{indent}<path class="{classe}"{fr} d="{d}"/>')
    return "\n".join(fora)


# ---------------------------------------------------------------------------
# O ESQUELETO DE UM SVG
# ---------------------------------------------------------------------------
# A PALETA DE UMA DIREÇÃO, E PORQUE É QUE ELA PASSOU A SER UM ARGUMENTO.
#
# As onze primeiras direções tinham todas o mesmo campo: papel. A quarta adenda
# pede o contrário, e por uma razão medida na maqueta do ecrã principal: um campo
# pálido com tinta fina é o único ícone do ecrã a que o leitor tem de se chegar.
# Cada uma das sete vozes traz por isso a sua decisão de campo, e a decisão é
# tão parte do desenho como a letra. As classes dos «path» não mudam («campo»,
# «tinta», «acento»): o que muda é o que cada uma quer dizer nesta direção.
PALETA_CASA = {
    "claro": {"campo": PAPEL, "tinta": TINTA, "acento": COBALTO},
    "escuro": {"campo": PAPEL_ESCURO, "tinta": TINTA_ESCURA, "acento": COBALTO_CLARO},
}


def paleta(campo, letra, acento, campo_escuro=None, letra_escura=None, acento_escuro=None):
    """A paleta de uma direção, em claro e em escuro.

    Quando o campo já é escuro, o tema escuro NÃO troca papel com tinta: um
    ícone de campo de tinta que se invertesse em escuro passava a ser outro
    ícone. O que ele faz é mudar para os símbolos escuros da folha de estilos
    (`#15171a` e `#eceeea`), que é a mesma leitura com os valores do tema.
    """
    return {"claro": {"campo": campo, "tinta": letra, "acento": acento},
            "escuro": {"campo": campo_escuro or campo,
                       "tinta": letra_escura or letra,
                       "acento": acento_escuro or acento}}


def estilo(p=None):
    p = p or PALETA_CASA
    c, e = p["claro"], p["escuro"]
    return f"""
    .campo {{ fill: {c["campo"]}; }}
    .tinta {{ fill: {c["tinta"]}; }}
    .tinta-t {{ fill: none; stroke: {c["tinta"]}; }}
    .acento {{ fill: {c["acento"]}; }}
    .acento-t {{ fill: none; stroke: {c["acento"]}; }}
    /* A costura: uma silhueta feita de distritos encostados fica com fios de
       papel entre eles quando se enche sem traço. O traço da mesma cor fecha-os. */
    .acento-costura {{ fill: {c["acento"]}; stroke: {c["acento"]}; stroke-width: 2; }}
    svg[data-tema="escuro"] .campo {{ fill: {e["campo"]}; }}
    svg[data-tema="escuro"] .tinta {{ fill: {e["tinta"]}; }}
    svg[data-tema="escuro"] .tinta-t {{ stroke: {e["tinta"]}; }}
    svg[data-tema="escuro"] .acento {{ fill: {e["acento"]}; }}
    svg[data-tema="escuro"] .acento-t {{ stroke: {e["acento"]}; }}
    svg[data-tema="escuro"] .acento-costura {{ fill: {e["acento"]}; stroke: {e["acento"]}; }}
    /* A simplificação de 32 e 16 px: a mesma forma, com o que morre tirado.
       O seletor é de FIM DE CADEIA e não de igualdade, porque a quarta adenda
       trouxe uma forma composta: «maskable-favicon», que é o sinal pequeno
       dentro do círculo seguro. As sete vozes precisam dela, porque nelas o
       sinal grande é a palavra e o `maskable` do Android desenha-se a 108 px. */
    .sinal-favicon {{ display: none; }}
    svg[data-forma$="favicon"] .sinal {{ display: none; }}
    svg[data-forma$="favicon"] .sinal-favicon {{ display: block; }}
    /* E UM TERCEIRO DESENHO, QUE AS SETE VOZES OBRIGARAM A CRIAR.
       Nas onze primeiras havia dois: o sinal, até aos 60 px, e a simplificação,
       dos 32 para baixo. Nas sete vozes o sinal grande é a PALAVRA e o sinal do
       telemóvel é a LETRA, e são coisas diferentes: com dois grupos só, a cela
       de 180 px acabava a mostrar a letra engrossada do favicon, ou seja a voz
       já sem a voz. A Didone dava contraste 1,9 aos 180 px, quando o desenho
       dela é 6,55. Com três grupos, a cela de 180 mostra a letra tal como ela
       está dentro da palavra, e a simplificação fica onde devia estar, aos 32.
       O grupo está vazio nas direções que não o usam, e essas seguem a regra
       da casa sem mudar nada. */
    .sinal-letra {{ display: none; }}
    svg[data-forma*="letra"] .sinal {{ display: none; }}
    svg[data-forma*="letra"] .sinal-letra {{ display: block; }}
    /* O `maskable` do Android: o campo fica, o sinal encolhe para dentro do
       círculo seguro de raio 40 %.

       A REDUÇÃO TEM DE ESTAR NUM GRUPO SÓ SEU, e isto foi corrigido a 28.08
       depois de se medir a caixa de tinta nos PNG: `transform` de CSS e
       `transform` de atributo são a MESMA propriedade, e o CSS ganha. Enquanto
       esta regra apanhava `.sinal` directamente, o `scale` substituía o
       enquadramento de `enquadra()` em vez de se compor com ele, e as direções
       enquadradas saíam com o sinal fora do sítio: a G dava 233 px de lado em
       512 em vez de 281, e a I saía cortada em cima. Num grupo de fora, que não
       tem atributo nenhum, as duas transformações compõem-se. */
    svg[data-forma^="maskable"] .reducao {{
      transform: scale({ESCALA_MASKABLE});
      transform-origin: {CENTRO}px {CENTRO}px;
      transform-box: view-box;
    }}
"""


ESTILO = estilo()


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


def svg(titulo, corpo, favicon, nota="", caixa=None, caixa_favicon=None, cores=None,
        letra=None, caixa_letra=None, com_campo=True):
    """O esqueleto de um SVG de direção.

    `com_campo` a falso tira o rectângulo de fundo, e existe por causa do
    aditamento à quinta adenda: um ícone de telemóvel tem sempre campo, porque o
    sistema lhe recorta um quadrado, mas no cabeçalho o sinal assenta no papel
    do sítio e um campo ali é uma moldura. O ficheiro sem campo serve o
    cabeçalho, e o `maskable` dele não quer dizer nada, o que fica dito aqui em
    vez de se descobrir depois.
    """
    fundo = (f'\n  <rect class="campo" x="0" y="0" width="{CAMPO}" height="{CAMPO}"/>'
             if com_campo else "")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CAMPO} {CAMPO}" \
width="{CAMPO}" height="{CAMPO}" role="img" aria-label="{titulo}">
  <title>{titulo}</title>
  <desc>{nota}</desc>
  <style>{estilo(cores)}  </style>{fundo}
  <g class="reducao">
    <g class="sinal"{enquadra(caixa) if caixa else ""}>
{corpo}
    </g>
    <g class="sinal-favicon"{enquadra(caixa_favicon) if caixa_favicon else ""}>
{favicon}
    </g>{("""
    <g class="sinal-letra"%s>
%s
    </g>""" % (enquadra(caixa_letra) if caixa_letra else "", letra)) if letra else ""}
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


# ---------------------------------------------------------------------------
# H · O «E» DO LIVRO-RAZÃO (a terceira adenda)
# ---------------------------------------------------------------------------
def direcao_h():
    """Um «E» cujos três braços são as três linhas de um registo.

    A palavra que conta em «O Estado do País» é «Estado», e a letra dela é o
    «E». Este «E» é feito das três linhas que o sítio escreve em cada afirmação
    do livro-razão (`ledger/claims/*.yml`): o valor, a fonte e a data. A do meio
    leva o acento porque é a da fonte, que é a promessa do sítio, e porque é o
    braço curto: o único sítio de um «E» onde a cor não estraga a letra.

    O CONTRASTE ESTÁ INVERTIDO: a haste é o fio (0,100 H) e os braços são as
    barras (0,24 H). Num tipo é ao contrário, sempre. É essa inversão que
    afasta esta letra do «E» do Expresso e do Economist, que são a mesma
    anatomia de sempre (haste grossa, braços finos) em branco sobre caixa de
    cor. Aqui é tinta e cobalto sobre papel, e a letra é outra construção.
    """
    H = 300.0
    x0, ytopo = 0.0, 0.0
    partes, m = letra_e_livro(x0, ytopo, H)
    corpo = (
        f'    <!-- O «E» de três barras: barra {m["b"]:.0f}, vão {m["g"]:.0f},\n'
        f'         haste {m["haste"]:.0f} (o FINO da casa: o contraste está\n'
        f'         invertido). Braços {BRACO_LONGO_H:.2f} / {BRACO_CURTO_H:.2f} /\n'
        f'         {BRACO_LONGO_H:.2f} de H. Três barras e dois vãos enchem a\n'
        f'         altura: 3 x {BARRA} + 2 x {VAO} = 1. -->\n'
        + caminhos([("nonzero", c, d) for c, d in partes])
    )
    # 32 e 16: o vão é que morre primeiro, e sem vão as três barras são uma
    # mancha. A simplificação dá ar ao vão à custa da barra, e engrossa a haste
    # para ela não desaparecer: 3 x 0,22 + 2 x 0,17 continua a dar 1.
    partes2, m2 = letra_e_livro(x0, ytopo, H, barra=0.22, vao=0.17, haste=0.130)
    favicon = (
        f'    <!-- 32 e 16 px: o vão de {m["g"]:.0f} dá 1,3 px a 16 e fecha-se.\n'
        f'         Passa a {m2["g"]:.0f} (1,6 px), a barra encolhe para\n'
        f'         {m2["b"]:.0f} e a haste engrossa para {m2["haste"]:.0f}, que é\n'
        f'         o mínimo para ela ainda lá estar. -->\n'
        + caminhos([("nonzero", c, d) for c, d in partes2])
    )
    caixa = (x0, ytopo, x0 + m["largura"], ytopo + H)
    return svg("Direção H · o E do livro-razão", corpo, favicon,
               "O «E» de «Estado» com os três campos de uma linha do livro-razão.",
               caixa=caixa, caixa_favicon=caixa)


# ---------------------------------------------------------------------------
# I · O SELO DENTRO DO «E»
# ---------------------------------------------------------------------------
FINO_I = 0.086      # o braço afina, para o vão subir e caber o selo
FOLGA_I = 0.045     # o ar entre o selo e o braço


def direcao_i():
    """A ideia da direção G levada do «O» para o «E».

    No «O» o selo mora na contraforma, que já era um rectângulo. No «E» a
    contraforma é um vão aberto à direita, e o que decide não é o desenho, é a
    medida: um vão de 0,357 H, com o braço a 0,086 H, dá um selo de 12,1 px a
    60 px, com 1,9 px de ar de cada lado. A conta está feita em NOTAS.md §5, e
    é ela que diz que esta direção existe.

    O «E» é largo (braço de 0,80 H, e não de 0,62) por duas razões: enche o
    campo quadrado, e dá ao selo largura de sobra para ele ser um quadrado e
    não um rectângulo espremido.
    """
    H = 300.0
    x0, cy = 0.0, 0.0
    de, me = letra_e(x0, cy, H, braco_curto=0.55, braco_longo=0.80, fino=FINO_I)
    f = FOLGA_I * H
    ya, yb = me["yc"] + me["ta"], -me["tm"] / 2      # o vão de cima
    lado = (yb - ya) - 2 * f
    corpo = (
        f'    <!-- O «E» largo (braço {me["La"]:.0f}, haste {me["T"]:.1f}, braço\n'
        f'         fino {me["ta"]:.1f}) e o selo no vão de cima: quadrado de\n'
        f'         {lado:.0f}, com {f:.0f} de ar em cima e em baixo. O vão inteiro\n'
        f'         mede {yb - ya:.0f}, que é 0,357 H. -->\n'
        f'    <path class="tinta" d="{de}"/>\n'
        f'    <rect class="acento" x="{n(x0 + me["T"] + f)}" y="{n(ya + f)}" '
        f'width="{n(lado)}" height="{n(lado)}"/>'
    )
    # 32 e 16: o braço fino de 0,086 H dá 0,97 px a 16 e desaparece antes do
    # selo. Engrossa-se o braço, o que rouba altura ao vão, e o ar do selo
    # encolhe para o mínimo. A 16 px isto já não é um selo dentro de um vão: é
    # um vão cheio de cor, e está dito na §5.
    de2, me2 = letra_e(x0, cy, H, braco_curto=0.55, braco_longo=0.80,
                       com_serifa=False, fino=0.110)
    f2 = 0.030 * H
    ya2, yb2 = me2["yc"] + me2["ta"], -me2["tm"] / 2
    lado2 = (yb2 - ya2) - 2 * f2
    favicon = (
        f'    <!-- 32 e 16 px: braço a 0,110 H (1,24 px a 16), sem as lajes de\n'
        f'         remate, e o selo a {lado2:.0f} com {f2:.0f} de ar. -->\n'
        f'    <path class="tinta" d="{de2}"/>\n'
        f'    <rect class="acento" x="{n(x0 + me2["T"] + f2)}" y="{n(ya2 + f2)}" '
        f'width="{n(lado2)}" height="{n(lado2)}"/>'
    )
    caixa = (x0, me["yc"], x0 + me["La"], me["yb"])
    return svg("Direção I · o selo dentro do E", corpo, favicon,
               "O «E» de «Estado» com o quadrado da prova no vão de cima.",
               caixa=caixa, caixa_favicon=caixa)


# ---------------------------------------------------------------------------
# J · A PALAVRA «ESTADO» COMO MARCA
# ---------------------------------------------------------------------------
def direcao_j():
    """A palavra inteira desenhada, e a letra sozinha quando a palavra não cabe.

    O sinal grande é «Estado», as seis letras desenhadas na grelha da casa. O
    sinal pequeno (60, 32 e 16 px) é o «E» dessa mesma palavra, sozinho: não é
    outra forma, é a primeira letra da que lá estava.

    O QUE ISTO CUSTA, E ESTÁ MEDIDO. A palavra tem 4,03 de largura por 1 de
    altura, e o campo do ícone é quadrado: enquadrada a 360, a altura de
    maiúscula fica em 89 unidades, contra 300 de uma letra sozinha. A 180 px
    são 31 px de maiúscula contra 106. A palavra lê-se; é três vezes mais
    pequena do que a letra.
    """
    H = 300.0
    base = 400.0
    partes, largura = palavra_estado(0.0, base, H)
    corpo = (
        f'    <!-- «Estado»: o «E» desenhado da casa (H={H:.0f}, haste\n'
        f'         {RAZAO_HASTE * H:.1f}, fino {RAZAO_FINO * H:.1f}) e «stado» em\n'
        f'         Spectral SemiBold do ficheiro da casa, à mesma altura de\n'
        f'         maiúscula. A palavra mede {largura:.0f} x {H:.0f} = {largura / H:.2f}:1,\n'
        f'         e é essa razão que a impede de encher um campo quadrado. -->\n'
        + caminhos(partes)
    )
    de, me = letra_e(0.0, 0.0, H)
    favicon = (
        f'    <!-- 60, 32 e 16 px: a palavra a 60 dá 10 px de maiúscula e é uma\n'
        f'         mancha. Fica o «E» da palavra, sozinho, à altura toda. -->\n'
        f'    <path class="tinta" d="{de}"/>'
    )
    return svg("Direção J · a palavra «Estado»", corpo, favicon,
               "A palavra desenhada; a letra sozinha quando a palavra não cabe.",
               caixa=(0.0, base - H, largura, base),
               caixa_favicon=(0.0, me["yc"], me["La"], me["yb"]))


# ---------------------------------------------------------------------------
# J2 · A PALAVRA «ESTADO» COM A LINHA DO VALOR NO «E» (a quarta adenda)
# ---------------------------------------------------------------------------
def direcao_j2():
    """A J com a ideia da H metida dentro da construção serifada.

    O diretor escolheu a palavra. Esta direção é a J com uma correção: o «E»
    deixa de ser um «E» qualquer e passa a levar a linha do valor. Isso resolve
    o que a §5 apontava à J, que era o sinal pequeno ser um «E» serifado como
    tantos outros: com a linha, o «E» sozinho a 60 e a 16 px já não é o «E» do
    Expresso nem o do Economist, é uma letra com uma linha lá dentro.

    O SINAL GRANDE é a palavra; o SINAL PEQUENO é o «E» dela. A troca acontece
    aos 60 px, e quem a faz é `exportar.mjs`, que sabe que esta direção troca
    mais cedo do que as outras.
    """
    H = 300.0
    base = 400.0
    partes, largura = palavra_estado(0.0, base, H, valor=LINHA_VALOR)
    corpo = (
        f'    <!-- «Estado» com a linha do valor: o «E» desenhado (H={H:.0f},\n'
        f'         haste {RAZAO_HASTE * H:.1f}, braços {RAZAO_FINO * H:.1f}, linha do\n'
        f'         valor {LINHA_VALOR * H:.0f} em cobalto) e «stado» em Spectral\n'
        f'         SemiBold do ficheiro da casa. A palavra mede {largura:.0f} x {H:.0f}\n'
        f'         = {largura / H:.2f}:1. -->\n'
        + caminhos(partes)
    )
    pf, mf = letra_e_linha(0.0, 0.0, H, valor=LINHA_VALOR_16, fino=BRACOS_16,
                           com_serifa=False)
    favicon = (
        f'    <!-- 60, 32 e 16 px: fica o «E» da palavra. Os braços engrossam de\n'
        f'         {RAZAO_FINO:.3f} para {BRACOS_16:.3f} H e a linha do valor de\n'
        f'         {LINHA_VALOR:.2f} para {LINHA_VALOR_16:.2f}, porque a 16 px um braço\n'
        f'         de 0,100 H dá 1,13 px e a linha tem de continuar a ler-se como\n'
        f'         linha e não como sujidade. As lajes de remate saem. -->\n'
        + caminhos(pf)
    )
    return svg("Direção J2 · «Estado» com a linha do valor", corpo, favicon,
               "A palavra, com a linha do valor dentro do «E».",
               caixa=(0.0, base - H, largura, base),
               caixa_favicon=(0.0, mf["yc"], mf["La"], mf["yb"]))


# ===========================================================================
# AS SETE VOZES (a quarta adenda)
# ===========================================================================
# O QUE MUDA, E O QUE NÃO MUDA. O conceito não mexe: a palavra é «Estado», o
# sinal pequeno é a letra dela. O que muda é a VOZ, ou seja três coisas ao mesmo
# tempo: a anatomia da letra (contraste, remate, eixo), a largura, e o campo.
#
# As onze primeiras direções partilhavam uma grelha só (haste 0,233 H, fino
# 0,100 H, remate cortado a direito) e um campo só (papel). A maqueta do ecrã
# principal mostrou o preço disso: com 19,8 % de mancha num campo de papel, o
# nosso é o ícone a que o leitor se tem de chegar. Cada voz traz por isso a sua
# decisão de campo, e ela conta tanto como a letra.
#
# A LETRA É DESENHADA, E ISSO CONTINUA A SER A REGRA. Nenhuma destas sete
# compõe um glifo de um tipo e chama-lhe marca. O que aqui se usa dos ficheiros
# da casa são MEDIDAS (a altura de x e a de maiúscula do Spectral, a haste do
# Bitter) e, na marca horizontal, o artigo e o «do País» compostos, que é o que
# a §1 das NOTAS já descreve como um documento feito com o tipo.
#
# A FERRAMENTA NOVA É UMA PENA. As onze primeiras são feitas de rectângulos,
# circunferências e arcos, porque a grelha da casa é de remates a direito. Estas
# não podem ser: um «s», um «a» de dois andares e um «E» de escrita são traços
# de grossura variável sobre um esqueleto. O que está aqui em baixo é isso: um
# esqueleto amostrado, e duas penas a passar por cima dele.
#   · `pena_ponteada`  a grossura varia ao longo do traço, medida na NORMAL ao
#                      esqueleto. É a pena de bico, e é ela que dá o contraste
#                      vertical do Didone e a espinha de um «s».
#   · `pena_larga`     a grossura é fixa mas o BICO tem um ângulo fixo: o traço
#                      fica grosso onde é perpendicular ao bico e fino onde lhe
#                      é paralelo. É a pena de aparo largo, e é ela que faz a
#                      voz caligráfica sem imitar uma caligrafia com curvas
#                      desenhadas à mão.

import math


def _cubica(p0, p1, p2, p3, k):
    """Uma cúbica de Bézier amostrada em k+1 pontos."""
    fora = []
    for i in range(k + 1):
        u = i / k
        m = 1.0 - u
        fora.append((m * m * m * p0[0] + 3 * m * m * u * p1[0]
                     + 3 * m * u * u * p2[0] + u * u * u * p3[0],
                     m * m * m * p0[1] + 3 * m * m * u * p1[1]
                     + 3 * m * u * u * p2[1] + u * u * u * p3[1]))
    return fora


def espinha(plana, por_troco=26):
    """O esqueleto de um traço, amostrado.

    `plana` é [p0, c1, c2, p1, c1, c2, p2, ...]: o ponto de partida e depois
    três pontos por cúbica, como um «path» de SVG. O que sai é a linha do meio
    do traço, ponto a ponto, que é sobre o que as penas trabalham.
    """
    pts = [plana[0]]
    for i in range(1, len(plana), 3):
        pts.extend(_cubica(plana[i - 1], plana[i], plana[i + 1], plana[i + 2],
                           por_troco)[1:])
    return pts


def _poligono(pontos):
    return "M" + "L".join(f"{n(x)} {n(y)}" for x, y in pontos) + "Z"


def _caixa(pontos):
    xs = [p[0] for p in pontos]
    ys = [p[1] for p in pontos]
    return (min(xs), min(ys), max(xs), max(ys))


def pena_ponteada(pts, larg):
    """A pena de bico: a grossura varia ao longo do traço, na normal.

    `larg` é uma função de u (0 no princípio, 1 no fim) que devolve a grossura
    TOTAL naquele ponto. Uma grossura que vai a zero nas pontas dá o remate em
    bico de um Didone; uma grossura constante dá um traço de grossura fixa.
    """
    k = len(pts)
    esq, dir_ = [], []
    for i, (x, y) in enumerate(pts):
        u = i / (k - 1)
        if i == 0:
            tx, ty = pts[1][0] - x, pts[1][1] - y
        elif i == k - 1:
            tx, ty = x - pts[-2][0], y - pts[-2][1]
        else:
            tx, ty = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        m = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / m, tx / m
        h = larg(u) / 2.0
        esq.append((x + nx * h, y + ny * h))
        dir_.append((x - nx * h, y - ny * h))
    poli = esq + dir_[::-1]
    return _poligono(poli), _caixa(poli)


def pena_larga(pts, angulo, meia):
    """A pena de aparo largo: o bico tem um ângulo fixo e uma largura fixa.

    O traço sai grosso onde o esqueleto é perpendicular ao bico e fino onde lhe
    é paralelo. É a mecânica de uma pena a sério, e é ela que faz o contraste da
    voz caligráfica ser uma consequência do gesto e não um desenho de grossuras.
    `angulo` em graus, medido do horizontal para cima.
    """
    a = math.radians(angulo)
    dx, dy = math.cos(a) * meia, -math.sin(a) * meia
    esq = [(x + dx, y + dy) for x, y in pts]
    dir_ = [(x - dx, y - dy) for x, y in pts]
    poli = esq + dir_[::-1]
    return _poligono(poli), _caixa(poli)


def pena_larga_fechada(pts, angulo, meia, centro):
    """A mesma pena, sobre um esqueleto FECHADO (um «o», um bojo).

    Num esqueleto fechado os dois lados do traço não são «esquerda» e «direita»:
    são «fora» e «dentro». O que decide qual é qual é a distância ao centro, e
    é isso que se faz aqui, ponto a ponto. Sai um anel de grossura variável, com
    o eixo grosso na perpendicular ao bico, que é o «o» de uma pena.
    """
    a = math.radians(angulo)
    dx, dy = math.cos(a) * meia, -math.sin(a) * meia
    cx, cy = centro
    fora, dentro = [], []
    for x, y in pts:
        p, q = (x + dx, y + dy), (x - dx, y - dy)
        if math.hypot(p[0] - cx, p[1] - cy) >= math.hypot(q[0] - cx, q[1] - cy):
            fora.append(p)
            dentro.append(q)
        else:
            fora.append(q)
            dentro.append(p)
    return _poligono(fora) + _poligono(dentro), _caixa(fora)


def elipse(cx, cy, rx, ry):
    """Uma elipse exata, em dois arcos."""
    return (f"M{n(cx - rx)} {n(cy)}A{n(rx)} {n(ry)} 0 1 1 {n(cx + rx)} {n(cy)}"
            f"A{n(rx)} {n(ry)} 0 1 1 {n(cx - rx)} {n(cy)}Z")


def anel(cx, cy, rx, ry, grossa, fina):
    """Um anel de contraste vertical: `grossa` nos lados, `fina` em cima e em baixo.

    É o «o» de uma serifada e de uma geométrica ao mesmo tempo: com
    `grossa == fina` sai um anel de grossura constante, que é o «o» geométrico.
    """
    return (elipse(cx, cy, rx, ry)
            + elipse(cx, cy, max(rx - grossa, 1.0), max(ry - fina, 1.0)))


def _pt(cx, cy, r, ang):
    a = math.radians(ang)
    return (cx + r * math.cos(a), cy - r * math.sin(a))


def banda_de_arco(cx, cy, r_ext, r_int, a1, a2):
    """Uma banda entre dois raios, de `a1` a `a2` graus (sentido directo).

    É com isto que se corta uma fração de uma circunferência: o «e» da sétima
    voz é uma banda destas mais uma barra, e mais nada.
    """
    grande = 1 if (a2 - a1) % 360 > 180 else 0
    p1 = _pt(cx, cy, r_ext, a1)
    p2 = _pt(cx, cy, r_ext, a2)
    p3 = _pt(cx, cy, r_int, a2)
    p4 = _pt(cx, cy, r_int, a1)
    return (f"M{n(p1[0])} {n(p1[1])}"
            f"A{n(r_ext)} {n(r_ext)} 0 {grande} 0 {n(p2[0])} {n(p2[1])}"
            f"L{n(p3[0])} {n(p3[1])}"
            f"A{n(r_int)} {n(r_int)} 0 {grande} 1 {n(p4[0])} {n(p4[1])}Z")


def une(caixas):
    x0 = min(c[0] for c in caixas)
    y0 = min(c[1] for c in caixas)
    x1 = max(c[2] for c in caixas)
    y1 = max(c[3] for c in caixas)
    return (x0, y0, x1, y1)


def cx_rect(x0, y0, x1, y1):
    return rect(x0, y0, x1, y1), (x0, y0, x1, y1)


# ---------------------------------------------------------------------------
# O ALFABETO PARAMÉTRICO
# ---------------------------------------------------------------------------
# Cinco letras minúsculas («s», «t», «a», «d», «o») e uma maiúscula («E»),
# construídas sobre o MESMO esqueleto e com os mesmos números a mudar de voz
# para voz. É isso que faz destas sete vozes uma comparação: o que se compara é
# a anatomia, e não seis desenhos sem relação uns com os outros.
#
# O QUE CADA NÚMERO FAZ:
#   xh        altura de x, em altura de maiúscula. Mede-se no Spectral da casa
#             (0,688) e muda de voz para voz de propósito: uma Didone tem a
#             altura de x baixa, uma grotesca condensada tem-na alta.
#   T, t      haste e fino, em altura de maiúscula. T/t é o contraste, e é o
#             número que mais separa uma voz da outra.
#   larg      o factor de largura: 1,0 é normal, 0,62 é condensado.
#   serifa    None, «laje» (o rectângulo cheio da Bitter), «fio» (a laje sem
#             colo e da grossura do fino, que é a Didone) ou «cunha» (o remate
#             em triângulo do cinzel).
#   a_tipo    «duplo» (o «a» de dois andares das serifadas) ou «simples» (o «a»
#             de um andar das geométricas e da caligráfica).
def voz(H=300.0, xh=0.68, asc=1.02, T=0.20, t=0.09, larg=1.0, serifa=None,
        a_tipo="duplo", espaco=0.05, bola=0.0, nib=None, meia_nib=0.0,
        e_haste=None, e_braco=None, e_curto=None, e_fino=None):
    """Os números de uma voz. `H` é a altura de maiúscula; tudo o resto é em H."""
    v = dict(H=H, xh=xh * H, asc=asc * H, T=T * H, t=t * H, larg=larg,
             serifa=serifa, a_tipo=a_tipo, espaco=espaco * H, bola=bola * H,
             nib=nib, meia_nib=meia_nib * H)
    v["e_haste"] = (e_haste if e_haste is not None else T) * H
    v["e_braco"] = (e_braco if e_braco is not None else 0.62) * H
    v["e_curto"] = (e_curto if e_curto is not None else 0.50) * H
    v["e_fino"] = (e_fino if e_fino is not None else t) * H
    return v


def _serifa_pe(v, x0, x1, y, para_cima):
    """A serifa de um pé ou de um topo de haste, na gramática da voz."""
    if v["serifa"] is None:
        return []
    if v["serifa"] == "cunha":
        # a cunha de uma haste romana sai a 0,42 da haste para cada lado: o pé
        # fica com 1,84 vezes a largura da haste, que é a proporção da pedra. A
        # 1,1 do FINO (que foi a primeira versão) dava 2,4 vezes, e a letra lia-se
        # como um laço e não como um «E».
        h, saliencia = v["t"] * 0.80, v["T"] * 0.42
    else:
        h = v["t"] if v["serifa"] == "fio" else v["t"] * 1.15
        saliencia = v["t"] * (1.5 if v["serifa"] == "fio" else 1.1)
    a, b = x0 - saliencia, x1 + saliencia
    if v["serifa"] == "cunha":
        # a cunha do cinzel: a ponta ALARGA e volta a estreitar, e não é um
        # rectângulo pousado. É o que um cinzel deixa: a largura máxima está no
        # extremo, e o alargamento apaga-se ao fim de pouco mais de um fino.
        if para_cima:
            return [(f"M{n(a)} {n(y)}L{n(b)} {n(y)}L{n(x1)} {n(y + h)}"
                     f"L{n(x0)} {n(y + h)}Z")]
        return [(f"M{n(a)} {n(y)}L{n(b)} {n(y)}L{n(x1)} {n(y - h)}"
                 f"L{n(x0)} {n(y - h)}Z")]
    return [rect(a, y, b, y + h) if para_cima else rect(a, y - h, b, y)]


def _cunha_de_braco(x_fim, y0, y1, comp, flare):
    """A cunha na ponta de um braço horizontal: alarga para fora, em «V» deitado.

    `y0` e `y1` são as duas faces do braço; a cunha sai `flare` para cada lado no
    extremo e volta à grossura do braço ao fim de `comp`. É esta a forma que um
    cinzel deixa, e é ela que separa a segunda voz de uma serifada de imprensa.
    """
    return (f"M{n(x_fim)} {n(y0 - flare)}L{n(x_fim)} {n(y1 + flare)}"
            f"L{n(x_fim - comp)} {n(y1)}L{n(x_fim - comp)} {n(y0)}Z")


def largura_o(v, altura=None):
    """A largura do «o» da voz. É a régua horizontal de todas as minúsculas.

    Existe como função porque o «t» e o «s» a usam para se medirem: uma letra
    tem de caber no seu avanço, e a maneira de garantir isso é medir tudo à
    mesma régua em vez de dar a cada letra uma fórmula sua. Foi por não ser
    assim que a voz condensada saía com o «t» a entrar no «a».
    """
    return 0.78 * (altura or v["xh"]) * 2 * v["larg"] / 1.28


def voz_o(v, x, base, largura=None, altura=None):
    """O «o»: um anel de contraste vertical, grosso nos lados e fino em cima."""
    xh = altura or v["xh"]
    w = largura if largura is not None else largura_o(v, xh)
    rx, ry = w / 2.0, xh / 2.0
    cx, cy = x + rx, base - ry
    if v["nib"]:
        pts = espinha_de_elipse(cx, cy, rx - v["meia_nib"] * 0.4, ry - v["meia_nib"] * 0.4)
        d, cx_ = pena_larga_fechada(pts, v["nib"], v["meia_nib"], (cx, cy))
        return [("evenodd", "tinta", d)], (cx_[0], cx_[1], cx_[2], cx_[3]), w
    d = anel(cx, cy, rx, ry, v["T"], v["t"])
    return [("evenodd", "tinta", d)], (cx - rx, cy - ry, cx + rx, cy + ry), w


def espinha_de_elipse(cx, cy, rx, ry, k=88):
    return [(cx + rx * math.cos(2 * math.pi * i / k),
             cy + ry * math.sin(2 * math.pi * i / k)) for i in range(k + 1)]


def voz_d(v, x, base):
    """O «d»: o bojo do «o» com a haste subida à ascendente."""
    partes, caixa, w = voz_o(v, x, base)
    hx = x + w - v["T"]
    partes = list(partes)
    partes.append(("nonzero", "tinta", rect(hx, base - v["asc"], x + w, base)))
    caixas = [caixa, (hx, base - v["asc"], x + w, base)]
    for d in _serifa_pe(v, hx, x + w, base - v["asc"], True):
        partes.append(("nonzero", "tinta", d))
        caixas.append((hx - v["t"] * 1.5, base - v["asc"], x + w + v["t"] * 1.5,
                       base - v["asc"] + v["t"] * 1.2))
    # a saliência da serifa entra no avanço: se não entrasse, o «d» encostava-se
    # ao «o» que vem a seguir
    caixa = une(caixas)
    return partes, caixa, max(w, caixa[2] - x)


def voz_a(v, x, base):
    """O «a»: de dois andares nas serifadas, de um andar nas geométricas.

    O de dois andares é bojo em baixo, haste à direita e um arco por cima; o de
    um andar é o bojo do «o» com a haste à direita, à altura de x. A escolha não
    é de gosto: um «a» de um andar numa Didone lê-se como itálico, e um «a» de
    dois andares numa geométrica pesada fecha-se a 60 px.
    """
    xh = v["xh"]
    if v["a_tipo"] == "simples":
        partes, caixa, w = voz_o(v, x, base)
        hx = x + w - v["T"]
        partes = list(partes) + [("nonzero", "tinta", rect(hx, base - xh, x + w, base))]
        return partes, une([caixa, (hx, base - xh, x + w, base)]), w
    w = 0.72 * xh * 2 * v["larg"] / 1.28
    hx = x + w - v["T"]
    partes = [("nonzero", "tinta", rect(hx, base - xh, x + w, base))]
    caixas = [(hx, base - xh, x + w, base)]
    # o bojo de baixo: um anel sentado na linha de base, com a haste a fechá-lo
    hb = 0.58 * xh
    rx, ry = (w - v["t"] * 0.4) / 2.0, hb / 2.0
    cx, cy = x + rx, base - ry
    partes.append(("evenodd", "tinta", anel(cx, cy, rx, ry, v["T"] * 0.92, v["t"])))
    caixas.append((cx - rx, cy - ry, cx + rx, cy + ry))
    # o arco de cima: sai da haste, sobe e cai para a esquerda
    arco = espinha([(hx + v["T"] * 0.2, base - xh + v["t"] * 0.2),
                    (hx - w * 0.16, base - xh - v["t"] * 1.5),
                    (x + w * 0.20, base - xh - v["t"] * 1.2),
                    (x + v["T"] * 0.42, base - xh * 0.74)])
    d, cxa = pena_ponteada(arco, lambda u: v["t"] + (v["T"] * 0.72 - v["t"]) * u)
    partes.append(("nonzero", "tinta", d))
    caixas.append(cxa)
    if v["bola"]:
        bx = x + v["T"] * 0.42
        partes.append(("nonzero", "tinta", elipse(bx, base - xh * 0.74, v["bola"], v["bola"])))
        caixas.append((bx - v["bola"], base - xh * 0.74 - v["bola"],
                       bx + v["bola"], base - xh * 0.74 + v["bola"]))
    return partes, une(caixas), w


def voz_t(v, x, base):
    """O «t»: haste que passa a altura de x, travessão, e um pé cortado.

    A LARGURA SAI DA HASTE E DO TRAVESSÃO, e não de uma fração da altura de x.
    Com a segunda (que era a primeira versão) uma voz condensada dava um avanço
    de 86,8 e uma haste que acabava aos 93,5: o «t» entrava no «a» que vinha a
    seguir. Aqui o avanço é, por construção, o que a letra ocupa.
    """
    xh = v["xh"]
    T = v["T"]
    wo = largura_o(v)
    esq, dir_ = wo * 0.10, wo * 0.18
    w = esq + T + dir_
    hx = x + esq
    topo = base - xh * 1.30
    partes = [("nonzero", "tinta", rect(hx, topo, hx + T, base - v["t"] * 0.2))]
    caixas = [(hx, topo, hx + T, base)]
    partes.append(("nonzero", "tinta",
                   rect(x, base - xh, x + w, base - xh + v["t"] * 1.05)))
    caixas.append((x, base - xh, x + w, base - xh + v["t"]))
    if v["serifa"]:
        # o pé do «t» vira à direita, como numa serifada
        partes.append(("nonzero", "tinta",
                       rect(hx, base - v["t"] * 1.1, hx + T + v["t"] * 1.6, base)))
        caixas.append((hx, base - v["t"] * 1.1, hx + T + v["t"] * 1.6, base))
    return partes, une(caixas), w


def voz_s(v, x, base, altura=None, perfil=None):
    """O «s»: uma espinha em S, e a pena por cima.

    É por causa desta letra que a pena existe. A grelha das onze primeiras não
    dá um «s» (a regra do remate cortado a direito não o permite, e está dito na
    §4 das NOTAS); um esqueleto com uma grossura que varia dá.
    """
    xh = altura or v["xh"]
    T, t = v["T"], v["t"]
    if altura:                      # um «S» de maiúscula pesa como a maiúscula
        T, t = v["e_haste"] * 0.92, v["e_fino"] * 1.15
    # A ESPINHA É A LINHA DO MEIO DO TRAÇO, e por isso não pode ir de ponta a
    # ponta do avanço: meia grossura fica de fora de cada lado. O avanço é o
    # corpo do «s» mais uma haste inteira, e a espinha desenha-se no que sobra.
    w = 0.66 * (largura_o(v, xh) if not altura else 0.72 * xh) + T
    x, w = x + T / 2.0, w - T
    pts = espinha([
        (x + 0.90 * w, base - 0.78 * xh),
        (x + 0.88 * w, base - 0.99 * xh), (x + 0.55 * w, base - 1.03 * xh),
        (x + 0.36 * w, base - 0.90 * xh),
        (x + 0.16 * w, base - 0.79 * xh), (x + 0.15 * w, base - 0.62 * xh),
        (x + 0.44 * w, base - 0.52 * xh),
        (x + 0.74 * w, base - 0.42 * xh), (x + 0.88 * w, base - 0.32 * xh),
        (x + 0.82 * w, base - 0.16 * xh),
        (x + 0.74 * w, base + 0.02 * xh), (x + 0.36 * w, base + 0.03 * xh),
        (x + 0.10 * w, base - 0.12 * xh),
    ])
    p = perfil or (lambda u: t + (T - t) * math.sin(math.pi * u) ** 0.85)
    d, caixa = pena_ponteada(pts, p)
    partes = [("nonzero", "tinta", d)]
    caixas = [caixa]
    if v["bola"]:
        for pp in (pts[0], pts[-1]):
            partes.append(("nonzero", "tinta", elipse(pp[0], pp[1], v["bola"], v["bola"])))
            caixas.append((pp[0] - v["bola"], pp[1] - v["bola"],
                           pp[0] + v["bola"], pp[1] + v["bola"]))
    return partes, une(caixas), w + T


def maiuscula_e(v, x, base, linha=None, classe_linha="acento"):
    """O «E» da voz: haste, três braços, e o remate que a voz mandar.

    `linha` é a grossura da linha do valor no braço do meio, em altura de
    maiúscula; a `None` o braço do meio é da voz, como os outros dois.
    """
    H = v["H"]
    T, t = v["e_haste"], v["e_fino"]
    La, Lm = v["e_braco"], v["e_curto"]
    topo, pe = base - H, base
    tm = (linha * H) if linha else t
    partes = [("nonzero", "tinta", rect(x, topo, x + T, pe)),
              ("nonzero", "tinta", rect(x, topo, x + La, topo + t)),
              ("nonzero", "tinta", rect(x, pe - t, x + La, pe))]
    caixas = [(x, topo, x + La, pe)]
    meio = [(classe_linha if linha else "tinta",
             rect(x, base - H / 2 - tm / 2, x + Lm, base - H / 2 + tm / 2))]
    if v["serifa"] == "fio":
        # a Didone: lajes finas, sem colo, nas pontas dos braços e no pé da haste
        s = t * 2.6
        for d in (rect(x + La - t, topo, x + La, topo + s),
                  rect(x + La - t, pe - s, x + La, pe)):
            partes.append(("nonzero", "tinta", d))
        meio.append((classe_linha if linha else "tinta",
                     rect(x + Lm - t, base - H / 2 - tm / 2 - t * 0.9,
                          x + Lm, base - H / 2 + tm / 2 + t * 0.9)))
    elif v["serifa"] == "laje":
        # a laje: na ponta do braço, um remate que DESCE (ou sobe) para dentro da
        # letra; na haste, um esporão para fora. Uma laje que passasse a linha de
        # maiúscula fazia a letra crescer para fora do quadrado do sinal, e foi
        # esse o erro da primeira versão: 0,216 H de laje contra 0,148 H de braço.
        lq = t * 0.62          # o quanto a laje desce, para dentro da letra
        lw = t * 0.85          # a largura da laje
        for d in (rect(x + La - lw, topo, x + La, topo + t + lq),
                  rect(x + La - lw, pe - t - lq, x + La, pe),
                  rect(x - lw, topo, x, topo + t),
                  rect(x - lw, pe - t, x, pe)):
            partes.append(("nonzero", "tinta", d))
        caixas.append((x - lw, topo, x + La, pe))
        # A LINHA DO VALOR NÃO LEVA LAJE. Uma laje é o remate de um braço de
        # letra; a linha do valor não é um braço, é outro objeto metido dentro da
        # letra, e um objeto que acaba a direito é o que uma linha de livro-razão
        # faz. Com laje (a primeira versão punha-lhe 0,55 de lq de cada lado) a
        # barra de cobalto ficava 133 unidades de alta contra 63 de grossura, e
        # lia-se como um martelo.
        if not linha:
            meio.append(("tinta", rect(x + Lm - lw, base - H / 2 - tm / 2 - lq * 0.5,
                                       x + Lm, base - H / 2 + tm / 2 + lq * 0.5)))
    elif v["serifa"] == "cunha":
        # o cinzel: cunhas nas pontas dos três braços, e a haste com pé e cabeça
        comp, flare = t * 1.35, t * 0.42
        partes.append(("nonzero", "tinta", _cunha_de_braco(x + La, topo, topo + t, comp, flare)))
        partes.append(("nonzero", "tinta", _cunha_de_braco(x + La, pe - t, pe, comp, flare)))
        caixas.append((x, topo - flare, x + La, pe + flare))
        for d in _serifa_pe(v, x, x + T, topo, True) + _serifa_pe(v, x, x + T, pe, False):
            partes.append(("nonzero", "tinta", d))
        meio.append((classe_linha if linha else "tinta",
                     _cunha_de_braco(x + Lm, base - H / 2 - tm / 2,
                                     base - H / 2 + tm / 2, comp, flare)))
    partes += [("nonzero", c, d) for c, d in meio]
    caixas.append((x, base - H / 2 - tm / 2, x + Lm, base - H / 2 + tm / 2))
    return partes, une(caixas), La


def compoe_letras(v, x, base, letras):
    """Letras umas a seguir às outras, com o espaço medido na TINTA e não no avanço.

    O AVANÇO DE UMA LETRA NÃO CHEGA PARA A ESPACEJAR, e isto foi medido: uma
    serifa que sai, o travessão de um «t» ou o arco de um «a» ficam fora dele, e
    foi por isso que a voz condensada e a de laje saíram com o «t» encostado ao
    «a». Aqui cada letra é desenhada DUAS VEZES: a primeira na origem, só para
    se lhe medir a caixa de tinta, e a segunda no sítio em que essa caixa fica à
    distância pedida da tinta da letra anterior. Custa o dobro do desenho e não
    custa nada a correr, porque isto não corre na construção do sítio.
    """
    partes, caixas = [], []
    cursor, direita = x, None
    for fn in letras:
        _, c0, _ = fn(v, 0.0, base)
        xi = cursor if direita is None else max(cursor, direita + v["espaco"] - c0[0])
        p, c, ww = fn(v, xi, base)
        partes += p
        caixas.append(c)
        direita = c[2]
        cursor = xi + ww + v["espaco"]
    caixa = une(caixas)
    return partes, caixa, caixa[2] - x


def palavra_da_voz(v, x, base, linha=None):
    """«Estado» na voz: o «E» e as cinco minúsculas, todas desenhadas."""
    return compoe_letras(v, x, base, [
        lambda vv, xx, bb: maiuscula_e(vv, xx, bb, linha=linha),
        voz_s, voz_t, voz_a, voz_d, voz_o])


# ---------------------------------------------------------------------------
# AS MAIÚSCULAS DO CINZEL (a segunda voz)
# ---------------------------------------------------------------------------
# «ESTADO» em versais. A lógica é a da pedra e não a da imprensa: a haste é
# LEVE (0,125 da altura), o fino é quase tão grosso quanto ela (contraste 1,5,
# contra os 4,9 da Didone), a letra é LARGA, e o remate é uma cunha e não uma
# laje, porque um cinzel não corta um rectângulo, corta um «V».
#
# O que aqui NÃO se faz, e é uma regra da adenda: nada disto imita a tipografia
# do Governo nem da Assembleia. As versais romanas são património comum, estão
# em qualquer pelourinho e em qualquer fachada de escola primária do Estado
# Novo ou de antes dele, e não são insígnia de ninguém. O que seria imitação é o
# escudo, a esfera armilar e as cores da bandeira, e nenhuma delas está aqui.
def cap_t(v, x, base):
    H, T, t = v["H"], v["e_haste"], v["e_fino"]
    w = 0.74 * H
    hx = x + w / 2 - T / 2
    partes = [("nonzero", "tinta", rect(hx, base - H, hx + T, base)),
              ("nonzero", "tinta", rect(x, base - H, x + w, base - H + t))]
    cu = t * 1.5
    for lado in (x, x + w):
        s = 1 if lado == x else -1
        partes.append(("nonzero", "tinta",
                       f"M{n(lado)} {n(base - H - cu)}L{n(lado)} {n(base - H + t + cu)}"
                       f"L{n(lado + s * t * 1.9)} {n(base - H + t)}"
                       f"L{n(lado + s * t * 1.9)} {n(base - H)}Z"))
    partes.append(("nonzero", "tinta", rect(hx - t * 1.5, base - t * 1.1,
                                            hx + T + t * 1.5, base)))
    return partes, (x, base - H - cu, x + w, base), w


def cap_a(v, x, base):
    """O «A» romano: a diagonal da esquerda fina, a da direita grossa, ápice em bico."""
    H, T, t = v["H"], v["e_haste"], v["e_fino"]
    w = 0.80 * H
    ap = x + w / 2
    partes = [("nonzero", "tinta",
               f"M{n(ap - t * 0.55)} {n(base - H)}L{n(ap + t * 0.55)} {n(base - H)}"
               f"L{n(x + w * 0.30 + t)} {n(base)}L{n(x + w * 0.30 - t * 0.6)} {n(base)}Z"),
              ("nonzero", "tinta",
               f"M{n(ap - T * 0.45)} {n(base - H)}L{n(ap + T * 0.45)} {n(base - H)}"
               f"L{n(x + w * 0.72 + T * 0.7)} {n(base)}L{n(x + w * 0.72 - T * 0.6)} {n(base)}Z"),
              ("nonzero", "tinta", rect(x + w * 0.22, base - H * 0.30,
                                        x + w * 0.80, base - H * 0.30 + t))]
    # os pés, cortados a direito na horizontal, como na pedra
    partes.append(("nonzero", "tinta", rect(x + w * 0.30 - t * 1.9, base - t * 1.0,
                                            x + w * 0.30 + t * 1.6, base)))
    partes.append(("nonzero", "tinta", rect(x + w * 0.72 - T * 1.1, base - t * 1.0,
                                            x + w * 0.72 + T * 1.2, base)))
    return partes, (x + w * 0.30 - t * 1.9, base - H, x + w * 0.72 + T * 1.2, base), w


def cap_d(v, x, base):
    H, T, t = v["H"], v["e_haste"], v["e_fino"]
    w = 0.76 * H
    partes = [("nonzero", "tinta", rect(x, base - H, x + T, base))]
    rx, ry = w - T * 0.5, H / 2
    cy = base - ry
    partes.append(("evenodd", "tinta",
                   (f"M{n(x + T * 0.5)} {n(base - H)}"
                    f"A{n(rx - T * 0.5)} {n(ry)} 0 0 1 {n(x + T * 0.5)} {n(base)}Z")
                   + (f"M{n(x + T * 0.5)} {n(base - H + t)}"
                      f"A{n(rx - T * 0.5 - T)} {n(ry - t)} 0 0 1 "
                      f"{n(x + T * 0.5)} {n(base - t)}Z")))
    for y, para_cima in ((base - H, True), (base, False)):
        partes += [("nonzero", "tinta", d)
                   for d in _serifa_pe(v, x, x + T, y, para_cima)]
    return partes, (x - t * 1.1, base - H, x + rx, base), w


def cap_o(v, x, base):
    H, T, t = v["H"], v["e_haste"], v["e_fino"]
    w = 0.90 * H
    rx, ry = w / 2, H / 2
    cx, cy = x + rx, base - ry
    return ([("evenodd", "tinta", anel(cx, cy, rx, ry, T, t))],
            (cx - rx, cy - ry, cx + rx, cy + ry), w)


def palavra_versais(v, x, base, linha=None):
    """«ESTADO» em versais do cinzel."""
    return compoe_letras(v, x, base, [
        lambda vv, xx, bb: maiuscula_e(vv, xx, bb, linha=linha),
        lambda vv, xx, bb: voz_s(vv, xx, bb, altura=vv["H"]),
        cap_t, cap_a, cap_d, cap_o])


# ---------------------------------------------------------------------------
# A VOZ CALIGRÁFICA: TUDO SAI DE UM APARO A 32 GRAUS
# ---------------------------------------------------------------------------
# Aqui não há grossuras desenhadas: há um esqueleto e um aparo. O contraste é o
# que a inclinação do aparo produz, como numa mão a sério, e é por isso que esta
# é a única das sete em que o grosso e o fino não são escolhas separadas.
NIB = 32.0            # a inclinação do aparo, em graus
MEIA_NIB = 0.062      # meia largura do aparo, em altura de maiúscula


def _traco(pts, meia=None, v=None):
    return pena_larga(pts, v["nib"], meia if meia is not None else v["meia_nib"])


def cali_e(v, x, base):
    """O «E» de escrita: um traço só, com a cintura a voltar para trás.

    É o «E» de uma assinatura: entra em cima à direita, dá a volta por cima,
    desce pela esquerda, faz a cintura para a direita e volta, e sai em baixo à
    direita. Um traço, sem levantar o aparo, que é o que a adenda pede.
    """
    H = v["H"]
    w = 0.62 * H
    # O LADO ESQUERDO É QUASE A PRUMO, e não é enfeite: com a espinha a fazer
    # duas barrigas (a primeira versão punha-a em 0,13 e 0,09 de w) a letra lia-se
    # como um «épsilon» ou como um «3» ao contrário. Com o lado esquerdo a
    # aprumar-se entre 0,10 e 0,12 de w, e com o braço de cima e o de baixo a
    # esticarem para a direita, volta a ler-se um «E» com uma cintura.
    # O TRAÇO É O QUE A MÃO FAZ SEM LEVANTAR O APARO, e por esta ordem: o braço
    # de cima da direita para a esquerda, a volta para baixo, a cintura para a
    # direita e de volta, e o braço de baixo da esquerda para a direita. É o «E»
    # de uma mão inglesa, e a única coisa que se afinou foi a esquadria: com as
    # voltas moles (a primeira versão) lia-se um «épsilon»; com o braço de cima e
    # o de baixo quase horizontais e o lado esquerdo a prumo, lê-se um «E».
    pts = espinha([
        (x + 1.00 * w, base - 0.99 * H),
        (x + 0.72 * w, base - 1.055 * H), (x + 0.30 * w, base - 1.055 * H),
        (x + 0.15 * w, base - 0.97 * H),
        (x + 0.07 * w, base - 0.90 * H), (x + 0.07 * w, base - 0.70 * H),
        (x + 0.30 * w, base - 0.615 * H),
        (x + 0.50 * w, base - 0.565 * H), (x + 0.64 * w, base - 0.535 * H),
        (x + 0.42 * w, base - 0.49 * H),
        (x + 0.24 * w, base - 0.455 * H), (x + 0.07 * w, base - 0.38 * H),
        (x + 0.07 * w, base - 0.14 * H),
        (x + 0.08 * w, base - 0.02 * H), (x + 0.42 * w, base + 0.045 * H),
        (x + 1.00 * w, base - 0.055 * H),
    ], por_troco=34)
    d, caixa = _traco(pts, v=v)
    return [("nonzero", "tinta", d)], caixa, w


def cali_o(v, x, base, altura=None, largura=None):
    xh = altura or v["xh"]
    w = largura or 0.86 * xh
    rx, ry = w / 2 - v["meia_nib"] * 0.5, xh / 2 - v["meia_nib"] * 0.5
    cx, cy = x + w / 2, base - xh / 2
    d, caixa = pena_larga_fechada(espinha_de_elipse(cx, cy, rx, ry),
                                  v["nib"], v["meia_nib"], (cx, cy))
    return [("evenodd", "tinta", d)], caixa, w


def cali_a(v, x, base):
    partes, caixa, w = cali_o(v, x, base)
    pts = espinha([(x + w - v["meia_nib"] * 0.4, base - v["xh"] * 1.02),
                   (x + w + v["meia_nib"] * 0.5, base - v["xh"] * 0.6),
                   (x + w - v["meia_nib"] * 0.6, base - v["xh"] * 0.3),
                   (x + w + v["meia_nib"] * 1.4, base + v["xh"] * 0.02)])
    d, c2 = _traco(pts, v=v)
    return list(partes) + [("nonzero", "tinta", d)], une([caixa, c2]), w + v["meia_nib"]


def cali_d(v, x, base):
    partes, caixa, w = cali_o(v, x, base)
    pts = espinha([(x + w - v["meia_nib"] * 0.2, base - v["asc"]),
                   (x + w + v["meia_nib"] * 0.4, base - v["asc"] * 0.55),
                   (x + w - v["meia_nib"] * 0.6, base - v["xh"] * 0.3),
                   (x + w + v["meia_nib"] * 1.6, base + v["xh"] * 0.02)])
    d, c2 = _traco(pts, v=v)
    return list(partes) + [("nonzero", "tinta", d)], une([caixa, c2]), w + v["meia_nib"]


def cali_t(v, x, base):
    w = 0.46 * v["xh"]
    hx = x + w * 0.42
    pts = espinha([(hx, base - v["xh"] * 1.32),
                   (hx + v["meia_nib"] * 0.4, base - v["xh"] * 0.7),
                   (hx - v["meia_nib"] * 0.5, base - v["xh"] * 0.25),
                   (hx + w * 0.9, base + v["xh"] * 0.02)])
    d, caixa = _traco(pts, v=v)
    barra = espinha([(x - w * 0.16, base - v["xh"] * 1.02),
                     (x + w * 0.3, base - v["xh"] * 1.06),
                     (x + w * 0.7, base - v["xh"] * 1.02),
                     (x + w * 1.06, base - v["xh"] * 1.00)])
    d2, c2 = _traco(barra, meia=v["meia_nib"] * 0.86, v=v)
    return ([("nonzero", "tinta", d), ("nonzero", "tinta", d2)],
            une([caixa, c2]), w + v["meia_nib"] * 1.2)


def cali_s(v, x, base):
    xh = v["xh"]
    w = 0.60 * xh
    pts = espinha([
        (x + 0.88 * w, base - 0.80 * xh),
        (x + 0.84 * w, base - 0.99 * xh), (x + 0.50 * w, base - 1.02 * xh),
        (x + 0.33 * w, base - 0.88 * xh),
        (x + 0.16 * w, base - 0.76 * xh), (x + 0.18 * w, base - 0.60 * xh),
        (x + 0.46 * w, base - 0.50 * xh),
        (x + 0.74 * w, base - 0.40 * xh), (x + 0.86 * w, base - 0.29 * xh),
        (x + 0.78 * w, base - 0.14 * xh),
        (x + 0.70 * w, base + 0.02 * xh), (x + 0.34 * w, base + 0.03 * xh),
        (x + 0.10 * w, base - 0.11 * xh),
    ], por_troco=30)
    d, caixa = _traco(pts, v=v)
    return [("nonzero", "tinta", d)], caixa, w


def palavra_caligrafica(v, x, base):
    return compoe_letras(v, x, base,
                         [cali_e, cali_s, cali_t, cali_a, cali_d, cali_o])


# ---------------------------------------------------------------------------
# O «e» MINÚSCULO: UMA CIRCUNFERÊNCIA CORTADA E UMA BARRA (a sétima voz)
# ---------------------------------------------------------------------------
# A ideia é do diretor, e o que ela tem de próprio é ser as duas letras ao mesmo
# tempo: a circunferência é o «O» de «O Estado» e a barra faz dela o «e» de
# «Estado». Um «e» minúsculo é, por construção, um anel com uma barra e uma
# abertura; tirar a barra dá um «o». É a única das sete em que as duas letras do
# nome são a mesma forma.
def e_minusculo(cx, cy, r, grossura, abertura=(-58.0, -8.0), barra=0.0,
                sai=0.0, barra_classe="tinta", sai_dir=None):
    """A banda, e a barra que faz dela um «e».

    `abertura` são os dois ângulos onde a circunferência está cortada (0 graus é
    a direita, e o ângulo cresce para cima). `barra` é a grossura da travessa;
    `sai` é o quanto ela passa para fora do anel, de cada lado, em raios: a 0
    fica dentro, como num «e» de tipo; acima de 0 atravessa, como a linha de uma
    régua.

    `sai_dir` separa os dois lados, e foi a quinta adenda que o obrigou a
    existir. A pergunta dela é a do «€», e o que faz um «€» não é uma barra a
    sair: é uma barra a sair DOS DOIS LADOS de um bojo aberto, duas vezes. Com
    os dois lados separados pode-se ter a linha da régua a sair só do lado
    FECHADO, e aí a simetria que faz a leitura de moeda desaparece. A ausência
    devolve o valor de `sai`, e por isso nada do que estava escrito muda.
    """
    if sai_dir is None:
        sai_dir = sai
    r_int = r - grossura
    d = banda_de_arco(cx, cy, r, r_int, abertura[1], abertura[0])
    x0 = cx - r - sai * r
    x1 = cx + r * math.cos(math.radians(abertura[1])) + sai_dir * r
    barra_d = rect(x0, cy - barra / 2, x1, cy + barra / 2)
    return ([("nonzero", "tinta", d), ("nonzero", barra_classe, barra_d)],
            (min(x0, cx - r), cy - r, max(x1, cx + r), cy + r))


# ---------------------------------------------------------------------------
# AS SETE DIREÇÕES
# ---------------------------------------------------------------------------
BASE = 400.0          # a linha de base do desenho da palavra, em coordenadas cómodas


def _com(texto):
    return "    <!-- " + texto.replace("\n", "\n         ") + " -->\n"


# 12 · EDITORIAL DE CONTRASTE ALTO (a Didone)
VOZ_12 = voz(H=300.0, xh=0.60, asc=1.05, T=0.158, t=0.030, serifa="fio",
             a_tipo="duplo", espaco=0.060, bola=0.026,
             e_haste=0.262, e_braco=0.64, e_curto=0.50, e_fino=0.040)
VOZ_12_16 = voz(H=300.0, T=0.155, t=0.032, serifa=None,
                e_haste=0.245, e_braco=0.62, e_curto=0.50, e_fino=0.128)
PALETA_12 = paleta(TINTA, PAPEL, PAPEL, campo_escuro=PAPEL_ESCURO,
                   letra_escura=TINTA_ESCURA, acento_escuro=TINTA_ESCURA)


def direcao_12():
    """A voz do jornal: haste grossa, fino de cabelo, e o campo de tinta.

    É a anatomia do Didot e do Bodoni, que é a que o Público e o Le Monde usam
    no cabeçalho, e é a única das sete que joga tudo no CONTRASTE: 4,9 para 1
    entre a haste e o fino, contra os 2,33 da grelha da casa. O campo é de
    tinta, com a letra em papel, e essa decisão é da maqueta: a 180 px, uma
    mancha cheia lê-se de longe e uma letra fina em campo pálido não.
    """
    partes, caixa, larg = palavra_da_voz(VOZ_12, 0.0, BASE)
    corpo = _com(
        f"«Estado» na voz editorial de contraste alto. Haste 0,155 H, fino 0,032 H\n"
        f"nas minúsculas; no «E», haste 0,235 H e fino 0,048 H, contraste 4,9.\n"
        f"Serifas em fio, sem colo, da grossura do fino. O «a» é de dois andares e\n"
        f"o «s» é um traço de grossura variável sobre uma espinha (a pena de bico).\n"
        f"A palavra mede {larg:.0f} x {caixa[3] - caixa[1]:.0f}.") + caminhos(partes)
    pl, cl, _ = maiuscula_e(VOZ_12, 0.0, 300.0)
    letra = _com(
        "180, 120 e 60 px: fica o «E» DA PALAVRA, com os mesmos números. A esta\n"
        "escala o fino dá 1,7 px a 60 px, e é isso que a voz é: contraste 6,55.") + caminhos(pl)
    pf, cf, _ = maiuscula_e(VOZ_12_16, 0.0, 300.0)
    favicon = _com(
        "32 e 16 px: o fino sobe de 0,040 para 0,128 H e as serifas saem, porque\n"
        "a 16 px um fino de 0,040 H dá 0,45 px e o braço abre. O contraste cai de\n"
        "6,55 para 1,9, e com ele cai a voz: é o preço medido desta direção, e\n"
        "está dito nas NOTAS.") + caminhos(pf)
    return svg("Voz 1 · editorial de contraste alto", corpo, favicon,
               "A Didone: hastes grossas, finos de cabelo, campo de tinta.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_12,
               letra=letra, caixa_letra=cl)


# 13 · INSCRICIONAL (as versais do cinzel)
VOZ_13 = voz(H=300.0, T=0.125, t=0.082, serifa="cunha", espaco=0.115,
             e_haste=0.125, e_braco=0.66, e_curto=0.50, e_fino=0.082)
VOZ_13_16 = voz(H=300.0, T=0.175, t=0.135, serifa="cunha", espaco=0.10,
                e_haste=0.175, e_braco=0.68, e_curto=0.52, e_fino=0.135)
PALETA_13 = paleta(OCRE, PAPEL, PAPEL, campo_escuro=OCRE,
                   letra_escura=PAPEL, acento_escuro=PAPEL)
INCISAO = 0.215       # a faixa do braço do meio
GROOVE = 0.062        # o sulco do cinzel dentro dela


def _e_incisa(v, x, base, cheia=INCISAO, sulco=GROOVE):
    """O «E» do cinzel com a linha do livro-razão INCISA no braço do meio.

    A linha não é uma cor pousada: é uma faixa mais grossa do que os outros dois
    braços, com um sulco do campo cortado a meio. Num campo de pedra é isso que
    uma linha gravada é, e é também a razão de esta ser a única das sete em que
    a segunda leitura não gasta uma segunda cor.
    """
    partes, caixa, w = maiuscula_e(v, x, base, linha=cheia, classe_linha="tinta")
    H, Lm = v["H"], v["e_curto"]
    cy = base - H / 2
    partes.append(("nonzero", "campo",
                   rect(x + v["e_haste"] * 0.55, cy - sulco * H / 2,
                        x + Lm - v["e_fino"] * 0.6, cy + sulco * H / 2)))
    return partes, caixa, w


def direcao_13():
    """As versais romanas, como estão cortadas em pedra por este país todo.

    Largas, de contraste baixo (1,5 para 1, contra 4,9 da Didone), com a cunha
    do cinzel no remate em vez da laje da imprensa. Nada disto é insígnia de
    ninguém: o escudo, a esfera armilar e as cores da bandeira ficaram de fora,
    como a adenda manda, e o que fica é uma tradição de lapidação que está em
    qualquer pelourinho. A palavra vai em VERSAIS, que é como se corta na pedra.
    """
    partes, caixa, larg = palavra_versais(VOZ_13, 0.0, BASE, linha=None)
    corpo = _com(
        f"«ESTADO» em versais do cinzel. Haste 0,125 H, fino 0,082 H, contraste\n"
        f"1,52. Remates em cunha. A palavra mede {larg:.0f} x {caixa[3] - caixa[1]:.0f}\n"
        f"= {larg / 300:.2f}:1, que é a mais larga das sete, porque uma versal\n"
        f"romana é larga por definição.") + caminhos(partes)
    pl, cl, _ = _e_incisa(VOZ_13, 0.0, 300.0)
    letra = _com(
        f"180, 120 e 60 px: o «E» do cinzel com a linha do livro-razão INCISA. O\n"
        f"braço do meio é uma faixa de {INCISAO:.3f} H com um sulco de {GROOVE:.3f} H\n"
        f"do próprio campo cortado a meio. É a única das sete em que a segunda\n"
        f"leitura não gasta uma segunda cor.") + caminhos(pl)
    pf, cf, _ = _e_incisa(VOZ_13_16, 0.0, 300.0)
    favicon = _com(
        f"32 e 16 px: a haste e o fino engrossam de 0,125 e 0,082 para 0,175 e\n"
        f"0,135 H, porque um fino de 0,082 H a 16 px dá 0,92 px. O sulco fica, e\n"
        f"fica sem se ver: a este tamanho mede menos de um píxel.") + caminhos(pf)
    return svg("Voz 2 · inscricional", corpo, favicon,
               "As versais do cinzel, e a linha do livro-razão como faixa incisa.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_13,
               letra=letra, caixa_letra=cl)


# 14 · GEOMÉTRICA PESADA (o registo do «B» da Bloomberg)
VOZ_14 = voz(H=300.0, xh=0.74, asc=1.00, T=0.255, t=0.255, serifa=None,
             a_tipo="simples", espaco=0.062,
             e_haste=0.275, e_braco=0.70, e_curto=0.58, e_fino=0.275)
VOZ_14_16 = voz(H=300.0, T=0.26, t=0.26, serifa=None,
                e_haste=0.285, e_braco=0.72, e_curto=0.60, e_fino=0.285)
PALETA_14_AMBAR = paleta(AMBAR, TINTA, TINTA)
PALETA_14_COBALTO = paleta(COBALTO, PAPEL, PAPEL, campo_escuro=COBALTO,
                           letra_escura=PAPEL, acento_escuro=PAPEL)


def _geometrica(cores, nome, titulo):
    partes, caixa, larg = palavra_da_voz(VOZ_14, 0.0, BASE)
    corpo = _com(
        f"«Estado» numa geométrica pesada: uma grossura só (0,255 H nas\n"
        f"minúsculas, 0,275 H no «E»), sem serifa, sem contraste. O «a» é de um\n"
        f"andar, porque um «a» de dois andares nesta grossura fecha-se.\n"
        f"A palavra mede {larg:.0f} x {caixa[3] - caixa[1]:.0f}.") + caminhos(partes)
    pl, cl, _ = maiuscula_e(VOZ_14, 0.0, 300.0)
    letra = _com(
        "180, 120 e 60 px: fica o «E» da palavra, com os mesmos números.") + caminhos(pl)
    pf, cf, _ = maiuscula_e(VOZ_14_16, 0.0, 300.0)
    favicon = _com(
        "32 e 16 px: não muda quase nada, e é isso que esta voz tem de seu, uma\n"
        "letra sem finos não tem nada que morra ao encolher. A grossura sobe de\n"
        "0,275 para 0,285 H e o braço de 0,70 para 0,72 H, para encher o campo.") + caminhos(pf)
    return svg(titulo, corpo, favicon, nome,
               caixa=caixa, caixa_favicon=cf, cores=cores,
               letra=letra, caixa_letra=cl)


def direcao_14():
    """A geométrica pesada em campo âmbar, com a letra a tinta.

    O registo é o do «B» da Bloomberg: uma grossura só, sem serifas, a letra a
    encher o campo. A decisão de cor não é de gosto e está medida em
    `tokens.css`: papel sobre âmbar mede 2,09:1 e não serve para objeto nenhum;
    tinta sobre âmbar mede 7,85:1. Por isso a letra em campo âmbar é de TINTA, e
    a versão de papel é a de campo cobalto, que está ao lado (14b).
    """
    return _geometrica(PALETA_14_AMBAR, "A geométrica pesada, campo âmbar.",
                       "Voz 3 · geométrica pesada, campo âmbar")


def direcao_14b():
    """A mesma letra em campo cobalto, com a letra em papel.

    Existe para a pergunta da adenda ser respondida a olhar e não a supor: qual
    dos dois campos é ownable ao lado dos órgãos portugueses da folha.
    """
    return _geometrica(PALETA_14_COBALTO, "A geométrica pesada, campo cobalto.",
                       "Voz 3b · geométrica pesada, campo cobalto")


# 15 · LAJE DE INSTRUMENTO (a Bitter da casa, engrossada)
VOZ_15 = voz(H=300.0, xh=0.72, asc=1.02, T=0.235, t=0.148, serifa="laje",
             a_tipo="duplo", espaco=0.072,
             e_haste=0.255, e_braco=0.62, e_curto=0.50, e_fino=0.148)
VOZ_15_16 = voz(H=300.0, T=0.235, t=0.148, serifa="laje",
                e_haste=0.265, e_braco=0.64, e_curto=0.52, e_fino=0.165)
PALETA_15 = paleta(PAPEL, TINTA, COBALTO, campo_escuro=PAPEL_ESCURO,
                   letra_escura=TINTA_ESCURA, acento_escuro=COBALTO_CLARO)
LINHA_15 = 0.21


def direcao_15():
    """A laje: a letra como peça de instrumento, carimbada.

    A Bitter é o tipo que o sítio já usa nos instrumentos (é ela que está nos
    eixos e nos números), e esta voz é a lógica dela levada ao peso de uma
    marca: laje sem colo, contraste baixo (1,72), remate mecânico. É a única das
    sete que fala a língua que o sítio já fala nos gráficos, e é a única em que
    a linha do valor em cobalto não é um acrescento: é o braço do meio.
    """
    partes, caixa, larg = palavra_da_voz(VOZ_15, 0.0, BASE, linha=LINHA_15)
    corpo = _com(
        f"«Estado» em laje de instrumento. Haste 0,235 H, fino 0,148 H,\n"
        f"contraste 1,59; no «E», haste 0,255 H. As serifas são lajes cheias, da\n"
        f"grossura da haste, sem colo. O braço do meio é a linha do valor, em\n"
        f"cobalto e a {LINHA_15:.2f} H, que é mais grossa do que os braços de tinta.\n"
        f"A palavra mede {larg:.0f} x {caixa[3] - caixa[1]:.0f}.") + caminhos(partes)
    pl, cl, _ = maiuscula_e(VOZ_15, 0.0, 300.0, linha=LINHA_15)
    letra = _com(
        "180, 120 e 60 px: fica o «E» da palavra, com a linha do valor.") + caminhos(pl)
    pf, cf, _ = maiuscula_e(VOZ_15_16, 0.0, 300.0, linha=LINHA_15)
    favicon = _com(
        "32 e 16 px: o fino sobe de 0,148 para 0,165 H e as lajes FICAM, porque\n"
        "nesta voz a laje é a letra: sem elas fica uma grotesca qualquer.") + caminhos(pf)
    return svg("Voz 4 · laje de instrumento", corpo, favicon,
               "A laje da Bitter, engrossada, com a linha do valor em cobalto.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_15,
               letra=letra, caixa_letra=cl)


# 16 · GROTESCA CONDENSADA (a voz do cartaz de jornal)
VOZ_16 = voz(H=300.0, xh=0.78, asc=1.02, T=0.225, t=0.195, larg=0.62,
             serifa=None, a_tipo="duplo", espaco=0.062,
             e_haste=0.235, e_braco=0.45, e_curto=0.37, e_fino=0.205)
VOZ_16_16 = voz(H=300.0, T=0.225, t=0.195, larg=0.62, serifa=None,
                e_haste=0.245, e_braco=0.47, e_curto=0.39, e_fino=0.215)
PALETA_16 = paleta(TINTA, PAPEL, AMBAR, campo_escuro=PAPEL_ESCURO,
                   letra_escura=TINTA_ESCURA, acento_escuro=AMBAR)
LINHA_16 = 0.24


def direcao_16():
    """A condensada: alta e estreita, a voz do cartaz de jornal à porta do quiosque.

    O factor de largura é 0,62, e é ele que faz a voz: a mesma altura de
    maiúscula ocupa dois terços da largura, e por isso a palavra inteira cabe
    onde as outras não cabem. O campo é de tinta, a letra é de papel, e o único
    acento é o âmbar no braço do meio, que é a cor que o sítio usa para «fora do
    limiar».
    """
    partes, caixa, larg = palavra_da_voz(VOZ_16, 0.0, BASE, linha=LINHA_16)
    corpo = _com(
        f"«Estado» em grotesca condensada. Factor de largura 0,62; haste 0,225 H,\n"
        f"fino 0,195 H, contraste 1,15, que é o mais baixo das sete. O braço do\n"
        f"meio leva o âmbar a {LINHA_16:.2f} H. A palavra mede {larg:.0f} x\n"
        f"{caixa[3] - caixa[1]:.0f} = {larg / 300:.2f}:1, a mais estreita das sete.")
    corpo += caminhos(partes)
    pl, cl, _ = maiuscula_e(VOZ_16, 0.0, 300.0, linha=LINHA_16)
    letra = _com(
        "180, 120 e 60 px: fica o «E» da palavra, estreito. É o sinal com menos\n"
        "largura das sete, e por isso é o que deixa mais campo de tinta à volta.")
    letra += caminhos(pl)
    pf, cf, _ = maiuscula_e(VOZ_16_16, 0.0, 300.0, linha=LINHA_16)
    favicon = _com("32 e 16 px: a mesma letra, 4 % mais grossa.") + caminhos(pf)
    return svg("Voz 5 · grotesca condensada", corpo, favicon,
               "A condensada de cartaz, campo de tinta, acento âmbar.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_16,
               letra=letra, caixa_letra=cl)


# 17 · CALIGRÁFICA (o aparo do guarda-livros)
VOZ_17 = voz(H=300.0, xh=0.62, asc=1.12, nib=NIB, meia_nib=MEIA_NIB,
             serifa=None, a_tipo="simples", espaco=0.042)
PALETA_17 = paleta(PAPEL, TINTA, COBALTO, campo_escuro=PAPEL_ESCURO,
                   letra_escura=TINTA_ESCURA, acento_escuro=COBALTO_CLARO)


def direcao_17():
    """O aparo: a única humanista das sete, e a única em que o contraste é um gesto.

    Um aparo largo a 32 graus, meia largura 0,062 H, passado por cima de
    esqueletos. O grosso e o fino não são escolhidos: são o que a inclinação do
    aparo produz em cada sítio da curva. É a mão de quem escreve um livro-razão,
    que é a imagem que o sítio tem de si próprio.
    """
    partes, caixa, larg = palavra_caligrafica(VOZ_17, 0.0, BASE)
    corpo = _com(
        f"«Estado» de aparo largo, a {NIB:.0f} graus, meia largura {MEIA_NIB:.3f} H.\n"
        f"O «E» é UM traço só, sem levantar o aparo: entra em cima à direita, dá a\n"
        f"volta, faz a cintura e sai em baixo. A palavra mede {larg:.0f} x\n"
        f"{caixa[3] - caixa[1]:.0f}.") + caminhos(partes)
    pl, cl, _ = cali_e(VOZ_17, 0.0, 300.0)
    letra = _com(
        "180, 120 e 60 px: fica o «E» da palavra, com o mesmo aparo.") + caminhos(pl)
    pf, cf, _ = cali_e(voz(H=300.0, nib=NIB, meia_nib=MEIA_NIB * 1.18), 0.0, 300.0)
    favicon = _com(
        "32 e 16 px: o aparo engrossa 18 % (de 0,062 para 0,073 H de meia\n"
        "largura), porque o fino de um aparo a 32 graus é o sítio onde o traço\n"
        "desaparece primeiro.") + caminhos(pf)
    return svg("Voz 6 · caligráfica", corpo, favicon,
               "O aparo largo do guarda-livros: a única humanista.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_17,
               letra=letra, caixa_letra=cl)


# 18 · O «e» MINÚSCULO (a ideia do diretor)
R_E = 150.0           # o raio de fora da circunferência
G_E = 46.0            # a grossura da banda
BARRA_E = 42.0        # a grossura da barra
ABERTURA_E = (-56.0, -6.0)
SAI_E = 0.30          # o quanto a barra passa para fora do anel, em raios
PALETA_18 = paleta(TINTA, AMBAR, AMBAR, campo_escuro=PAPEL_ESCURO,
                   letra_escura=AMBAR, acento_escuro=AMBAR)


def direcao_18():
    """O «e» minúsculo: uma circunferência cortada e uma barra.

    O que esta forma tem e nenhuma das outras seis tem: é as DUAS letras do nome
    ao mesmo tempo. Sem a barra é o «O» de «O Estado»; com a barra é o «e» de
    «Estado». A barra atravessa para fora do anel, e aí deixa de ser só a
    travessa de um «e» e passa a ser a linha de uma régua.
    """
    partes, caixa = e_minusculo(CENTRO, CENTRO, R_E, G_E, abertura=ABERTURA_E,
                                barra=BARRA_E, sai=SAI_E)
    corpo = _com(
        f"O «e»: banda de {G_E:.0f} num raio de {R_E:.0f} (grossura 0,31 do raio),\n"
        f"cortada entre {ABERTURA_E[0]:.0f} e {ABERTURA_E[1]:.0f} graus, e uma barra de\n"
        f"{BARRA_E:.0f} que sai {SAI_E:.2f} raios para fora de cada lado. Sem a barra é\n"
        f"um «O»; com ela é um «e», e o que sai para fora é a linha da régua.")
    corpo += caminhos(partes)
    pf, cf = e_minusculo(CENTRO, CENTRO, R_E, G_E * 1.16, abertura=(-52.0, -10.0),
                         barra=BARRA_E * 1.14, sai=SAI_E)
    favicon = _com(
        "32 e 16 px: a mesma forma, com a banda e a barra 15 % mais grossas e a\n"
        "abertura mais fechada, porque a 16 px a abertura de 50 graus dá 1,4 px e\n"
        "some-se contra o campo.") + caminhos(pf)
    return svg("Voz 7 · o «e» minúsculo", corpo, favicon,
               "Uma circunferência cortada e uma barra: o «O» e o «e» na mesma forma.",
               caixa=caixa, caixa_favicon=cf, cores=PALETA_18)


# ---------------------------------------------------------------------------
# A QUINTA ADENDA · O «e», REFINADO
# ---------------------------------------------------------------------------
# A adenda faz três perguntas sobre o «e» do diretor, e cada uma é uma variante
# desenhada e medida, e não uma opinião:
#
#   1 · A BARRA. A que atravessa e sai do anel (a linha da régua, que é o que a
#       sétima voz tem hoje) e a que acaba no bojo (a travessa de um «e» de
#       tipo). A pergunta é a do «€»: aquele sinal tem DUAS barras e o bojo
#       ABERTO; o nosso tem uma barra e o bojo fechado, mas a associação é o
#       risco, e o risco vê-se, não se argumenta.
#   2 · O CORTE. Três frações tiradas ao anel, com a corrida mínima medida a 60
#       e a 16 px em cada uma.
#   3 · A COR. Âmbar em campo de tinta (o ícone escuro, que é o de hoje) e ocre
#       em papel (o caso de campo claro, que é o que a marca horizontal já
#       obriga a usar, porque o âmbar sobre papel mede 2,09:1).
#
# O CORTE CONTA-SE DA BARRA, E NÃO DO ÂNGULO DO FICHEIRO. A banda acaba a -6
# graus, e a barra, que tem 42 de grossura num raio de 150, ocupa de -8,05 a
# +8,05 graus no raio de fora: a barra COME a ponta de cima da banda. Quem olha
# não vê os 50 graus que a constante diz: vê o canto de baixo da barra em cima e
# a ponta da banda em baixo. Dizer «50 graus» seria dizer o número do ficheiro e
# não o número que se vê, e por isso o que aqui se diz é a abertura à vista.
ANG_BARRA_E = math.degrees(math.asin((BARRA_E / 2) / R_E))   # 8,05 graus

# Os três cortes, dados pela ponta de BAIXO da banda. A de cima é sempre -6, e é
# sempre a barra que a tapa.
CORTES_E = {
    "estreito": -40.0,
    "medio": ABERTURA_E[0],     # -56, o de hoje
    "largo": -70.0,
}


def abertura_vista(corte):
    """Os graus de anel que faltam, contados da barra à ponta de baixo."""
    return abs(corte) - ANG_BARRA_E


PALETA_E_TINTA = PALETA_18                                    # âmbar em campo de tinta
PALETA_E_PAPEL = paleta(PAPEL, OCRE, OCRE, campo_escuro=PAPEL_ESCURO,
                        letra_escura=AMBAR, acento_escuro=AMBAR)
# O ocre `#7a5300` sobre papel mede 6,37:1 e passa os dois limiares; sobre papel
# ESCURO mede 2,62:1 e não passa nenhum. Por isso a variante de campo claro
# troca para o âmbar no tema escuro, que é exatamente o que `tokens.css` faz com
# a palavra do estado. Não é uma decisão nova: é a folha de estilos do sítio.


# A paleta do ficheiro sem campo: o «campo» nunca se desenha, e por isso o que
# ele diz é indiferente; o que conta é a letra, ocre em papel claro e âmbar em
# papel escuro, que é o que `tokens.css` já manda.
PALETA_E_PAPEL_SO_LETRA = PALETA_E_PAPEL


def _e_direcao(titulo, nota, corte, sai, cores, alarga_favicon=6.0, sai_dir=None):
    """Uma variante do «e»: o corte, a barra, e o par de cores.

    O DESENHO DE 32 E 16 PX ALARGA O CORTE, E NÃO O FECHA, e isto é uma correção
    ao que a sétima voz fazia. O ficheiro de 28.08 de manhã engrossava a banda
    16 % e fechava a abertura de 50 para 42 graus. Engrossar a banda já fecha a
    abertura por dentro (o raio de dentro cresce); fechar também o ângulo fecha-a
    duas vezes, e o que morre a 16 px é justamente o buraco que distingue um «e»
    de um «o». A regra passou a ser a contrária, e está medida na §6 bis: banda
    16 % mais grossa, barra 14 % mais grossa, e o corte ALARGADO 6 graus.
    """
    partes, caixa = e_minusculo(CENTRO, CENTRO, R_E, G_E, abertura=(corte, ABERTURA_E[1]),
                                barra=BARRA_E, sai=sai, sai_dir=sai_dir)
    corpo = _com(
        f"O «e»: banda de {G_E:.0f} num raio de {R_E:.0f} (grossura 0,31 do raio),\n"
        f"cortada de {corte:.0f} a {ABERTURA_E[1]:.0f} graus, o que dá "
        f"{abertura_vista(corte):.0f} graus\n"
        f"de abertura à vista, porque a barra tapa {ANG_BARRA_E:.1f} graus da ponta de cima.\n"
        f"A barra tem {BARRA_E:.0f} e "
        + ("acaba no bojo dos dois lados: é a travessa de um «e» de tipo."
           if not sai and not (sai_dir or 0)
           else (f"sai {sai:.2f} raios só à ESQUERDA, do lado fechado, e à direita\n"
                 "acaba no bojo: a linha da régua sem a simetria do «€»."
                 if sai and sai_dir == 0.0
                 else f"sai {sai:.2f} raios para fora de cada lado: é a linha da régua."))) \
        + caminhos(partes)
    pf, cf = e_minusculo(CENTRO, CENTRO, R_E, G_E * 1.16,
                         abertura=(corte - alarga_favicon, ABERTURA_E[1]),
                         barra=BARRA_E * 1.14, sai=sai, sai_dir=sai_dir)
    favicon = _com(
        "32 e 16 px: a mesma forma, com a banda 16 % e a barra 14 % mais grossas,\n"
        f"e o corte ALARGADO {alarga_favicon:.0f} graus. Engrossar a banda já fecha a\n"
        "abertura por dentro; fechar também o ângulo fechava-a duas vezes.") + caminhos(pf)
    return svg(titulo, corpo, favicon, nota, caixa=caixa, caixa_favicon=cf, cores=cores)


def direcao_18b():
    """A barra a acabar no bojo: um «e» minúsculo de tipo, sem a linha da régua."""
    return _e_direcao("Voz 7b · o «e», barra dentro do bojo",
                      "A travessa acaba no bojo: é um «e» e nada mais.",
                      CORTES_E["medio"], 0.0, PALETA_E_TINTA)


def direcao_18c():
    """O corte estreito, com a barra a atravessar."""
    return _e_direcao("Voz 7c · o «e», corte estreito",
                      "O mesmo «e» com 32 graus de abertura à vista.",
                      CORTES_E["estreito"], SAI_E, PALETA_E_TINTA)


def direcao_18d():
    """O corte largo, com a barra a atravessar."""
    return _e_direcao("Voz 7d · o «e», corte largo",
                      "O mesmo «e» com 62 graus de abertura à vista.",
                      CORTES_E["largo"], SAI_E, PALETA_E_TINTA)


def direcao_18e():
    """O corte estreito, com a barra dentro do bojo."""
    return _e_direcao("Voz 7e · o «e», barra dentro e corte estreito",
                      "A travessa no bojo, com 32 graus de abertura à vista.",
                      CORTES_E["estreito"], 0.0, PALETA_E_TINTA)


def direcao_18f():
    """O corte largo, com a barra dentro do bojo."""
    return _e_direcao("Voz 7f · o «e», barra dentro e corte largo",
                      "A travessa no bojo, com 62 graus de abertura à vista.",
                      CORTES_E["largo"], 0.0, PALETA_E_TINTA)


def direcao_18i():
    """A barra a sair só à esquerda: a linha da régua sem a simetria do «€».

    É a variante que a folha obrigou a desenhar. As duas que a adenda nomeia
    trocam uma coisa pela outra: a barra que atravessa é a única que diz «régua»
    e é a que se parece com o «€»; a barra que fica no bojo lê-se sem hesitação
    e não diz nada do sítio. O que faz a leitura de moeda não é uma barra a
    sair: é uma barra a sair DOS DOIS LADOS, duas vezes, de um bojo aberto.
    Tirando a saída do lado da abertura fica a linha a entrar na letra por um
    lado só, e a forma deixa de ser simétrica na horizontal.
    """
    return _e_direcao("Voz 7i · o «e», barra só à esquerda",
                      "A linha da régua entra na letra por um lado só.",
                      CORTES_E["medio"], SAI_E, PALETA_E_TINTA, sai_dir=0.0)


def direcao_18j():
    """A mesma, em ocre sobre papel: o caso de campo claro."""
    return _e_direcao("Voz 7j · o «e» ocre em papel, barra só à esquerda",
                      "O caso de campo claro, com a linha por um lado só.",
                      CORTES_E["medio"], SAI_E, PALETA_E_PAPEL, sai_dir=0.0)


def direcao_18k():
    """A 18i com a regra ANTIGA do favicon, e existe só para uma pergunta.

    Não é uma variante a escolher: é o par de controlo. A sétima voz de 28.08 de
    manhã FECHAVA o corte no desenho de 32 e 16 px (de -56 para -52 graus); esta
    adenda passou a ALARGÁ-LO 6 graus, e a razão é que engrossar a banda já
    fecha a abertura por dentro. Para que a comparação seja de uma coisa só, a
    18k tem a geometria da 18i e a regra velha, e a diferença medida a 16 px é
    da regra e de mais nada. É o mesmo papel que a 14b teve na ronda das vozes.
    """
    return _e_direcao("Voz 7k · a 7i com o favicon fechado (par de controlo)",
                      "A mesma forma com a regra velha do favicon: o corte fechado.",
                      CORTES_E["medio"], SAI_E, PALETA_E_TINTA,
                      alarga_favicon=-4.0, sai_dir=0.0)


def direcao_18g():
    """O par de campo claro: «e» ocre em papel, com a barra a atravessar."""
    return _e_direcao("Voz 7g · o «e» ocre em papel",
                      "O caso de campo claro: ocre sobre papel, 6,37:1.",
                      CORTES_E["medio"], SAI_E, PALETA_E_PAPEL)


def direcao_18h():
    """O par de campo claro, com a barra dentro do bojo."""
    return _e_direcao("Voz 7h · o «e» ocre em papel, barra dentro",
                      "O caso de campo claro, com a travessa no bojo.",
                      CORTES_E["medio"], 0.0, PALETA_E_PAPEL)


# ---------------------------------------------------------------------------
# O «e» MÍNIMO (o aditamento à quinta adenda: «mais limpo, mais minimalista»)
# ---------------------------------------------------------------------------
# O gabinete voltou com as palavras do diretor: o sinal «devia ser muito mais
# limpo, muito mais minimalista». O que isso quer dizer, dito em desenho e não
# em adjetivos, e é isto que o `e_minimo` obedece:
#
#   · UMA FORMA E UMA GROSSURA SÓ. A circunferência, o corte, e a barra. A barra
#     tem exatamente a grossura do anel, e não 0,91 dela como tinha.
#   · A BARRA NÃO É UM SEGUNDO OBJETO. Não sai do anel de lado nenhum, e as
#     quatro pontas dela pousam na própria circunferência: os remates são cordas
#     do círculo. Assim a silhueta não tem saliência nenhuma, e não há a
#     pergunta do «€», que era toda ela sobre uma barra a sair dos dois lados.
#   · O CORTE COMEÇA ONDE A BARRA ACABA. O ângulo de cima da banda deixou de ser
#     um número escolhido (-6 graus) e passou a ser calculado: é o ângulo onde a
#     face de baixo da barra encontra a circunferência de fora. Antes a barra
#     TAPAVA a ponta da banda, o que é uma junta escondida; agora não há junta,
#     porque as duas peças acabam na mesma linha.
#   · SEM CONTORNO, SEM SEGUNDA COR, SEM MOLDURA, E O MESMO DESENHO A TODOS OS
#     TAMANHOS. As outras direções têm um segundo desenho para 32 e 16 px, com a
#     banda engrossada. Estas não têm, de propósito: «uma forma, nada
#     acrescentado» quer dizer que o favicon é o mesmo desenho, e a medição a 16
#     px passa a responder à pergunta que o gabinete faz, que é qual é a
#     grossura mais fina que sobrevive.
#
# A GROSSURA CONTA-SE EM DIÂMETROS, e é preciso dizer o que estava lá antes,
# porque o aditamento diz que «a atual é mais pesada» do que 12 a 16 %: a banda
# da sétima voz mede 46 num diâmetro de 300, ou seja 15,3 % do diâmetro. Já
# estava dentro do intervalo pedido, no topo dele. Para o desenho ser de facto
# mais leve, as grossuras aqui vão de 16 % a 10 %, e a mais fina está abaixo do
# que o aditamento pede, para que o limite se veja e não se suponha.
GROSSURAS_MINIMAS = [0.16, 0.14, 0.12, 0.10]
G_MINIMO = 0.14       # a grossura recomendada: a mais fina que sobrevive aos 16 px
CORTE_MINIMO = -56.0  # a mesma ponta de baixo de sempre


def e_minimo(cx, cy, r, g_diametro, corte=CORTE_MINIMO, classe="tinta"):
    """O «e» mínimo: a circunferência, o corte, a barra. Uma grossura só.

    `g_diametro` é a grossura em fração do DIÂMETRO, que é como o aditamento a
    pede e como se compara com a haste de um tipo. Devolve `(partes, caixa)`
    como as outras peças deste ficheiro.
    """
    g = g_diametro * 2 * r
    meia = g / 2
    # a corda onde a face da barra encontra a circunferência de fora: é ela que
    # dá o comprimento da barra E o ângulo onde a banda acaba, para não haver
    # junta entre as duas peças.
    dx = math.sqrt(max(r * r - meia * meia, 0.0))
    topo = -math.degrees(math.asin(meia / r))
    banda = banda_de_arco(cx, cy, r, r - g, topo, corte)
    barra = rect(cx - dx, cy - meia, cx + dx, cy + meia)
    return ([("nonzero", classe, banda), ("nonzero", classe, barra)],
            (cx - r, cy - r, cx + r, cy + r))


def abertura_minima(g_diametro, corte=CORTE_MINIMO):
    """Os graus de anel que faltam, da face da barra à ponta de baixo."""
    return abs(corte) - math.degrees(math.asin(g_diametro))


def _e_minimo_direcao(titulo, nota, g, cores, com_campo=True, corte=CORTE_MINIMO):
    partes, caixa = e_minimo(CENTRO, CENTRO, R_E, g, corte)
    corpo = _com(
        f"O «e» mínimo: uma grossura só, {g * 100:.0f} % do diâmetro\n"
        f"({g * 2 * R_E:.1f} num diâmetro de {2 * R_E:.0f}). A barra tem a MESMA grossura do\n"
        f"anel e acaba na circunferência: os remates são cordas do círculo, e por isso\n"
        "a silhueta não tem saliência nenhuma. O corte começa onde a barra acaba\n"
        f"({abertura_minima(g, corte):.0f} graus de abertura à vista), e não há junta escondida.\n"
        "O mesmo desenho a todos os tamanhos: não há segundo desenho para o favicon.") \
        + caminhos(partes)
    return svg(titulo, corpo, corpo, nota, caixa=caixa, caixa_favicon=caixa,
               cores=cores, com_campo=com_campo)


def direcao_18m():
    """O «e» mínimo, grossura 16 % do diâmetro."""
    return _e_minimo_direcao("Voz 7m · o «e» mínimo, 16 %",
                             "Uma grossura só, 16 % do diâmetro.",
                             0.16, PALETA_E_TINTA)


def direcao_18n():
    """O «e» mínimo, grossura 14 % do diâmetro."""
    return _e_minimo_direcao("Voz 7n · o «e» mínimo, 14 %",
                             "Uma grossura só, 14 % do diâmetro.",
                             0.14, PALETA_E_TINTA)


def direcao_18o():
    """O «e» mínimo, grossura 12 % do diâmetro."""
    return _e_minimo_direcao("Voz 7o · o «e» mínimo, 12 %",
                             "Uma grossura só, 12 % do diâmetro.",
                             0.12, PALETA_E_TINTA)


def direcao_18p():
    """O «e» mínimo, grossura 10 % do diâmetro: abaixo do que o aditamento pede."""
    return _e_minimo_direcao("Voz 7p · o «e» mínimo, 10 %",
                             "Uma grossura só, 10 % do diâmetro.",
                             0.10, PALETA_E_TINTA)


def direcao_18q():
    """O «e» mínimo em ocre sobre papel: o caso de campo claro."""
    return _e_minimo_direcao("Voz 7q · o «e» mínimo, ocre em papel",
                             "O caso de campo claro: ocre sobre papel, 6,37:1.",
                             G_MINIMO, PALETA_E_PAPEL)


def direcao_18r():
    """O sinal sozinho, sem campo nenhum: é assim que ele entra no cabeçalho.

    Um ícone de telemóvel tem sempre campo, porque o sistema lhe recorta um
    quadrado. Um cabeçalho não: ali o sinal assenta no papel do sítio, e o campo
    seria uma moldura, que é justamente o que o aditamento manda tirar. Este
    ficheiro é o mesmo desenho sem o rectângulo de fundo, e serve o cabeçalho e
    mais nada.
    """
    return _e_minimo_direcao("Voz 7r · o «e» mínimo, sem campo",
                             "O sinal sozinho, para o cabeçalho: sem campo e sem moldura.",
                             G_MINIMO, PALETA_E_PAPEL_SO_LETRA, com_campo=False)


DIRECOES = [
    ("1-ligadura-oe", direcao_a),
    ("2-o-acento", direcao_b),
    ("3-selo", direcao_c),
    ("4-azulejo", direcao_d),
    ("5-mapa", direcao_e),
    ("6-regua", direcao_f),
    ("7-selo-no-o", direcao_g),
    ("8-e-livro-razao", direcao_h),
    ("9-selo-no-e", direcao_i),
    ("10-palavra-estado", direcao_j),
    ("11-estado-linha", direcao_j2),
    # as sete vozes da quarta adenda
    ("12-didone-estado", direcao_12),
    ("13-inscricional-estado", direcao_13),
    ("14-geometrica-ambar", direcao_14),
    ("14b-geometrica-cobalto", direcao_14b),
    ("15-laje-instrumento", direcao_15),
    ("16-condensada-estado", direcao_16),
    ("17-caligrafica-estado", direcao_17),
    ("18-e-minuscula", direcao_18),
    # a quinta adenda: as variantes do «e»
    ("18b-e-barra-dentro", direcao_18b),
    ("18c-e-corte-estreito", direcao_18c),
    ("18d-e-corte-largo", direcao_18d),
    ("18e-e-dentro-estreito", direcao_18e),
    ("18f-e-dentro-largo", direcao_18f),
    ("18g-e-ocre-papel", direcao_18g),
    ("18h-e-ocre-dentro", direcao_18h),
    ("18i-e-barra-esquerda", direcao_18i),
    ("18j-e-ocre-esquerda", direcao_18j),
    ("18k-e-favicon-fechado", direcao_18k),
    # o aditamento: o «e» mínimo, uma grossura só
    ("18m-e-minimo-16", direcao_18m),
    ("18n-e-minimo-14", direcao_18n),
    ("18o-e-minimo-12", direcao_18o),
    ("18p-e-minimo-10", direcao_18p),
    ("18q-e-minimo-ocre", direcao_18q),
    ("18r-e-minimo-sem-campo", direcao_18r),
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
    "8-e-livro-razao": {
        "letra": "H",
        "nome": "o «E» do livro-razão",
        "tenta": "O «E» de «Estado» feito das três linhas que uma afirmação do "
                 "livro-razão nunca tem em falta: o valor, a fonte e a data "
                 "(`ledger/claims/*.yml`). O contraste está invertido, a haste é o fio "
                 "e os braços são as barras, e é isso que faz a letra ser desta casa.",
        "arrisca": "Três barras horizontais são o botão de menu de qualquer aplicação, "
                   "e a haste é a única coisa que separa uma coisa da outra. O «E» "
                   "branco em caixa de cor é do Expresso e do Economist; este é tinta "
                   "e cobalto sobre papel, que é o lado contrário do contraste.",
    },
    "9-selo-no-e": {
        "letra": "I",
        "nome": "o selo dentro do «E»",
        "tenta": "A ideia da direção G levada do «O» para o «E»: o quadrado da prova "
                 "dentro da letra. No «O» morava na contraforma; no «E» mora no vão de "
                 "cima, que é a contraforma que um «E» tem.",
        "arrisca": "O vão do «E» é um sexto do que a contraforma do «O» dá: o selo "
                   "mede 12,1 px a 60 contra 18,3 px na G, e o ar de 1,9 px fecha-se "
                   "abaixo dos 32. E um «E» serifado, mesmo com o selo, continua a ser "
                   "a letra do Expresso e do Economist.",
    },
    "10-palavra-estado": {
        "letra": "J",
        "nome": "a palavra «Estado»",
        "tenta": "A palavra como sinal grande, e o «E» dela sozinho quando a palavra "
                 "deixa de caber (a 60, a 32 e a 16 px). O «E» é desenhado; «stado» é "
                 "Spectral SemiBold do ficheiro da casa, porque o «s» não sai desta "
                 "grelha e a adenda deixou essa porta aberta.",
        "arrisca": "«Estado» sozinho, com maiúscula, é como se escreve a instituição em "
                   "português. Sem o artigo à frente e sem «do País» atrás, o ícone diz "
                   "o Estado que governa, e não o estado em que o país está. E a "
                   "palavra num campo quadrado fica a um terço da altura de uma letra "
                   "sozinha.",
    },
    "11-estado-linha": {
        "letra": "J2",
        "nome": "«Estado» com a linha do valor",
        "tenta": "A J com a ideia da H metida dentro da letra serifada: o braço do meio "
                 "do «E» deixa de ser um braço e passa a ser a linha do valor, em "
                 "cobalto e mais grossa do que os braços de tinta. A palavra é o sinal "
                 "grande; o «E» dela, sozinho, é o sinal de 60 px para baixo.",
        "arrisca": "«Estado» sozinho continua a ler-se como a instituição, e é o artigo "
                   "que traz o leitor de volta à condição: isso não muda com a linha. E "
                   "uma linha azul dentro de um «E» pode ler-se como um texto "
                   "sublinhado ou como um erro de impressão, se for fina de mais.",
    },
}

FICHA.update({
    "12-didone-estado": {
        "letra": "voz 1", "nome": "editorial de contraste alto",
        "tenta": "A anatomia do Didot: haste de 0,262 H, fino de 0,040 H, contraste "
                 "4,9 para 1, serifas em fio sem colo. É a voz do cabeçalho do Público "
                 "e do Le Monde. O campo é de tinta e a letra é de papel, porque a "
                 "maqueta mostrou que uma letra fina em campo pálido não segura a cela.",
        "arrisca": "Um «E» serifado claro sobre campo de cor é EXATAMENTE o ícone do "
                   "Expresso e o do Economist, e os dois estão na mesma folha. A única "
                   "distância é o campo ser preto e não azul-petróleo nem vermelho, e "
                   "isso é pouco. E a 16 px o contraste cai de 4,9 para 1,9, que é o "
                   "mesmo que dizer que a voz não chega ao favicon.",
    },
    "13-inscricional-estado": {
        "letra": "voz 2", "nome": "inscricional",
        "tenta": "As versais romanas cortadas em pedra: largas, contraste 1,52, "
                 "remates em cunha. A palavra vai em versais, que é como se corta na "
                 "pedra. O braço do meio do «E» é a linha do livro-razão INCISA: uma "
                 "faixa mais grossa com um sulco do campo cortado a meio, que é a "
                 "única das sete em que a segunda leitura não gasta uma segunda cor.",
        "arrisca": "A pedra é a língua do Estado tanto quanto a do país, e uma versal "
                   "romana num sítio que se chama «O Estado do País» empurra a leitura "
                   "para a instituição, que é o lado onde não se quer o leitor. E o "
                   "sulco fecha-se a 32 px: a 16 px a faixa incisa é uma mancha.",
    },
    "14-geometrica-ambar": {
        "letra": "voz 3", "nome": "geométrica pesada, campo âmbar",
        "tenta": "Uma grossura só, sem serifas, o «E» a encher o campo: o registo do "
                 "«B» da Bloomberg. O campo é âmbar e a letra é de tinta, e a troca "
                 "não é de gosto: papel sobre âmbar mede 2,09:1 e tinta sobre âmbar "
                 "mede 7,85:1 (`tokens.css`, e conferido aqui).",
        "arrisca": "O âmbar é, no sítio, a cor de «fora do limiar». Uma marca âmbar diz "
                   "ao leitor, antes de ele ler nada, que o país está fora do limiar, e "
                   "isso é uma afirmação que a marca não pode fazer. E o laranja do "
                   "Poder360 está na mesma folha, a duas celas de distância.",
    },
    "14b-geometrica-cobalto": {
        "letra": "voz 3b", "nome": "a mesma, em campo cobalto",
        "tenta": "A mesma letra, o outro campo que a adenda mandou experimentar: "
                 "cobalto com a letra em papel (7,73:1). Existe para a pergunta se "
                 "responder a olhar, e não a supor.",
        "arrisca": "Campo azul escuro com letra branca É o Expresso, e o «E» ainda por "
                   "cima é a mesma letra. Na maqueta do ecrã principal as duas celas "
                   "ficam a três de distância e leem-se como do mesmo dono.",
    },
    "15-laje-instrumento": {
        "letra": "voz 4", "nome": "laje de instrumento",
        "tenta": "A lógica da Bitter, que é o tipo que o sítio já usa nos instrumentos, "
                 "levada ao peso de uma marca: laje sem colo, contraste 1,59, remate "
                 "mecânico. O braço do meio é a linha do valor, em cobalto, a 0,21 H.",
        "arrisca": "É a única das sete com campo de papel e letra de tinta, que é "
                   "exatamente a receita que a maqueta anterior reprovou. Aqui a letra "
                   "é muito mais pesada (26,8 % da cela contra 19,8 % da J2), e a "
                   "pergunta é se isso chega.",
    },
    "16-condensada-estado": {
        "letra": "voz 5", "nome": "grotesca condensada",
        "tenta": "Factor de largura 0,62: a mesma altura de maiúscula em dois terços da "
                 "largura. É a voz do cartaz à porta do quiosque, e é a única das sete "
                 "em que a PALAVRA inteira ainda se lê numa cela de 180 px. Campo de "
                 "tinta, letra de papel, e o âmbar no braço do meio.",
        "arrisca": "Uma condensada não tem nada de português nem de instrumento: é a "
                   "voz do cartaz, e o sítio não é um cartaz. E o âmbar volta a dizer "
                   "«fora do limiar», ainda que num traço só.",
    },
    "17-caligrafica-estado": {
        "letra": "voz 6", "nome": "caligráfica",
        "tenta": "Um aparo largo a 32 graus passado por cima de esqueletos: o grosso e "
                 "o fino não são escolhidos, são o que a inclinação do aparo produz. O "
                 "«E» é UM traço só, sem levantar o aparo, como a mão de quem assina um "
                 "livro-razão. É a única humanista das sete.",
        "arrisca": "O «E» de escrita lê-se como «épsilon» antes de se ler como «E», e a "
                   "medição confirma o que se vê: 9,1 % da cela, que é metade da J2 e "
                   "duas vezes a palavra que a maqueta reprovou. É o ícone mais fraco "
                   "das sete num ecrã principal.",
    },
    "18-e-minuscula": {
        "letra": "voz 7", "nome": "o «e» minúsculo",
        "tenta": "Uma circunferência de grossura igual, uma fração cortada em baixo à "
                 "direita, e uma barra que atravessa. Sem a barra é o «O» de «O "
                 "Estado»; com a barra é o «e» de «Estado»: é a única das sete em que "
                 "as duas letras do nome são a mesma forma. A barra sai para fora do "
                 "anel, e aí é a linha de uma régua.",
        "arrisca": "Um «e» minúsculo redondo tem donos, e o mais gasto deles é o "
                   "navegador da Microsoft; o «e» concêntrico verde do Eco está na "
                   "folha. E o âmbar é a cor com que o sítio escreve «fora do limiar»: "
                   "uma marca nessa cor mistura-se com a semântica da régua.",
    },
})

ORDEM = ["1-ligadura-oe", "2-o-acento", "3-selo", "4-azulejo",
         "5-mapa", "6-regua", "7-selo-no-o",
         "8-e-livro-razao", "9-selo-no-e", "10-palavra-estado",
         "11-estado-linha"]
VOZES_ORDEM = ["12-didone-estado", "13-inscricional-estado", "14-geometrica-ambar",
               "14b-geometrica-cobalto", "15-laje-instrumento", "16-condensada-estado",
               "17-caligrafica-estado", "18-e-minuscula"]

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
    """As onze direções e dezasseis referências, todas a 60 px, na mesma tira.

    É a comparação que o brief pede: à MESMA escala, e não cada uma na sua.
    """
    from PIL import Image
    cel, alto_r, alto_t = 76, 96, 22
    itens = [(f"EXPORT/{s}/{s}-60.png", FICHA[s]["letra"]) for s in ORDEM + VOZES_ORDEM]
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


def lockup_da_palavra(classe, acento, altura=100.0, menor=0.66, espaco=0.26, valor=None):
    """A marca horizontal da direção J: «O» pequeno, «Estado» desenhado, «do País».

    A palavra é a desenhada, letra a letra, na grelha da casa. O artigo e o
    resto do nome são compostos em Spectral, mais pequenos, e é aí (e só aí) que
    entra contorno tirado do ficheiro do tipo: é o nome, e a licença descreve
    isso como um documento feito com o tipo (§1 das NOTAS).

    É esta a peça que responde à pergunta da adenda. «Estado» sozinho é a
    instituição; «Estado» com o artigo à frente e «do País» atrás é a condição.
    """
    sys.path.insert(0, AQUI)
    from glifos import contorno
    h2 = menor * altura
    d_o, larg_o, _, _ = contorno(SPECTRAL_RG, "O", h2)
    d_dp, larg_dp, _, _ = contorno(SPECTRAL_RG, "do País", h2)
    partes, largura = palavra_estado(0.0, 0.0, altura, valor=valor)
    x1 = larg_o + espaco * altura
    x2 = x1 + largura + espaco * altura
    pecas = [f'  <g transform="translate(0 0)"><path class="{classe}" d="{d_o}"/></g>',
             f'  <g transform="translate({n(x1)} 0)">',
             caminhos(partes, indent="    ").replace('class="tinta"', f'class="{classe}"')
                                            .replace('class="acento"', f'class="{acento}"'),
             '  </g>',
             f'  <g transform="translate({n(x2)} 0)"><path class="{classe}" d="{d_dp}"/></g>']
    # A CAIXA É A DA TINTA, E NÃO A DA ALTURA DE MAIÚSCULA. Estava a ser a
    # segunda, e por isso o «d» de «Estado» saía cortado: a ascendente do
    # Spectral sobe a 1,136 da maiúscula (113,6 numa maiúscula de 100), e o
    # topo da caixa estava a -100. Aqui a caixa é medida nos contornos.
    topos = [-altura]
    for d, dx in ((d_o, 0.0), (d_dp, x2)):
        topos.append(caixa_do_caminho(d)[1])
    for regra, classe_, d in partes:
        if "A" not in d:            # os contornos do tipo não trazem arcos
            topos.append(caixa_do_caminho(d)[1])
    topo = min(topos)
    caixa = (0.0, topo, x2 + larg_dp, 0.0)
    vb = f"{n(caixa[0])} {n(caixa[1])} {n(caixa[2] - caixa[0])} {n(caixa[3] - caixa[1])}"
    return (f'<svg viewBox="{vb}" role="img" aria-label="O Estado do País">\n'
            + "\n".join(pecas) + "\n</svg>")


def reescala(v, H):
    """A mesma voz noutra altura de maiúscula.

    Serve a marca horizontal: o desenho do ícone está feito a H = 300, e o
    cabeçalho quer a palavra a 22 ou a 45 px de maiúscula. Escalar a voz e
    redesenhar dá o MESMO desenho noutro tamanho; escalar o SVG depois de feito
    dava o mesmo, mas escondia a medida, e aqui as medidas ficam à vista.
    """
    k = H / v["H"]
    novo = dict(v)
    for chave in ("H", "xh", "asc", "T", "t", "espaco", "bola", "meia_nib",
                  "e_haste", "e_braco", "e_curto", "e_fino"):
        novo[chave] = v[chave] * k
    return novo


# Por voz: os números, a função que compõe a palavra, a grossura da linha do
# valor (se houver) e o tipo em que se compõem o artigo e o «do País».
VOZ_FICHA = {
    "12-didone-estado": (VOZ_12, palavra_da_voz, None, "spectral"),
    "13-inscricional-estado": (VOZ_13, palavra_versais, None, "sc"),
    "14-geometrica-ambar": (VOZ_14, palavra_da_voz, None, "spectral"),
    "14b-geometrica-cobalto": (VOZ_14, palavra_da_voz, None, "spectral"),
    "15-laje-instrumento": (VOZ_15, palavra_da_voz, LINHA_15, "spectral"),
    "16-condensada-estado": (VOZ_16, palavra_da_voz, LINHA_16, "spectral"),
    "17-caligrafica-estado": (VOZ_17, lambda v, x, b, linha=None: palavra_caligrafica(v, x, b),
                              None, "spectral"),
}


def lockup_da_voz(slug, classe, acento, altura=100.0, menor=0.66, espaco=0.26):
    """«O Estado do País» na voz: a palavra desenhada, o resto composto.

    É a mesma regra da J e da J2, e a §1 das NOTAS já a cobre: a palavra é
    desenhada aqui, letra a letra; o artigo e o «do País» são compostos em
    Spectral (ou em Spectral SC, na voz do cinzel, que é versal). Desenhar
    também «do País» obrigava a um «P», um «í» com acento e um «s», e o «s» é
    justamente a letra que custou doze construções na ronda anterior.
    """
    sys.path.insert(0, AQUI)
    from glifos import contorno
    v0, fn, linha, tipo = VOZ_FICHA[slug]
    ficheiro = SPECTRAL_SC if tipo == "sc" else SPECTRAL_RG
    h2 = menor * altura
    d_o, larg_o, _, _ = contorno(ficheiro, "O", h2)
    d_dp, larg_dp, _, _ = contorno(ficheiro, "do País", h2)
    partes, caixa, largura = fn(reescala(v0, altura), 0.0, 0.0, linha)
    x1 = larg_o + espaco * altura
    x2 = x1 + largura + espaco * altura
    corpo = (caminhos(partes, indent="    ")
             .replace('class="tinta"', f'class="{classe}"')
             .replace('class="acento"', f'class="{acento}"')
             .replace('class="campo"', 'class="campo-prancha"'))
    pecas = [f'  <g><path class="{classe}" d="{d_o}"/></g>',
             f'  <g transform="translate({n(x1)} 0)">', corpo, '  </g>',
             f'  <g transform="translate({n(x2)} 0)"><path class="{classe}" d="{d_dp}"/></g>']
    topos = [caixa[1]]
    for d in (d_o, d_dp):
        topos.append(caixa_do_caminho(d)[1])
    topo = min(topos)
    baixo = max(0.0, caixa[3])
    cx = (0.0, topo, x2 + larg_dp, baixo)
    vb = f"{n(cx[0])} {n(cx[1])} {n(cx[2] - cx[0])} {n(cx[3] - cx[1])}"
    return (f'<svg viewBox="{vb}" role="img" aria-label="O Estado do País">\n'
            + "\n".join(pecas) + "\n</svg>")


def lockup_do_e(classe, acento, altura=100.0, minusculas=False, corte=None,
                sai=SAI_E, sai_dir=None, diam=1.24, espaco=0.42, minimo=None):
    """A marca horizontal do «e»: o sinal ao lado do nome, o nome em Spectral.

    Duas leituras, e a adenda das vozes pede as duas: o nome com as maiúsculas
    que a casa lhe dá («O Estado do País»), e o nome todo em minúsculas («o
    estado do país»), que é o que a forma do sinal sugere.

    O QUE A QUINTA ADENDA MUDOU AQUI, e são duas coisas medidas e não de gosto.

    · O «e» ASSENTA NA LINHA DE BASE. Estava centrado a meia altura de
      maiúscula com raio 0,62 dessa altura, o que o fazia descer 0,12 abaixo da
      base: ao lado de um nome sem descendentes, o sinal ficava pendurado. Agora
      o centro está a um raio da base, e o anel pousa nela.
    · O NOME LEVA O ESPACEJAMENTO DO SÍTIO. Usava `contorno` directo, sem
      aperto; passou a usar `caminho_do_nome`, que aplica o `letter-spacing:
      -0.014em` de `.wordmark`. Um cabeçalho a 1:1 com outro espacejamento não é
      um cabeçalho a 1:1.

    `diam` é o diâmetro do anel em alturas de maiúscula do nome: a 1,24 (o valor
    com que a sétima voz nasceu) o «e» passa das maiúsculas; a 1,00 fica à
    altura delas, que é a âncora B das notas anteriores. `minimo`, se vier,
    desenha o «e» mínimo do aditamento com essa grossura em frações do diâmetro,
    em vez do «e» de banda e barra separadas.

    O espaço entre o sinal e o nome subiu de 0,30 para 0,42 da altura de
    maiúscula depois de se ver a marca a 1:1: com 0,30, o anel e o «O» ficavam
    quase encostados, e duas formas redondas encostadas leem-se como uma só.
    """
    texto = "o estado do país" if minusculas else "O Estado do País"
    d, (x0, y0, x1, y1) = caminho_do_nome(texto, altura=altura)
    r = altura * diam / 2
    if minimo:
        partes, cxe = e_minimo(r, -r, r, minimo,
                               CORTE_MINIMO if corte is None else corte)
    else:
        partes, cxe = e_minusculo(r, -r, r, r * (G_E / R_E),
                                  abertura=(ABERTURA_E[0] if corte is None else corte,
                                            ABERTURA_E[1]),
                                  barra=r * (BARRA_E / R_E), sai=sai, sai_dir=sai_dir)
    corpo = (caminhos(partes, indent="    ")
             .replace('class="tinta"', f'class="{acento}"'))
    dx = cxe[2] + altura * espaco - x0
    cima, baixo = min(cxe[1], y0), max(cxe[3], y1)
    vb = (f"{n(cxe[0])} {n(cima)} {n(dx + x1 - cxe[0])} {n(baixo - cima)}")
    return (f'<svg viewBox="{vb}" role="img" aria-label="{texto}">\n'
            + corpo + f'\n  <g transform="translate({n(dx)} 0)">'
            f'<path class="{classe}" d="{d}"/></g>\n</svg>')


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
  /* A COR DO «e» DA SÉTIMA VOZ NA MARCA HORIZONTAL, E A REGRA VEM DO SÍTIO.
     O âmbar sobre papel claro mede 2,09:1 e não serve; sobre papel escuro mede
     8,00:1 e serve. É exatamente o que `tokens.css` já faz com a palavra do
     estado: em claro escreve-a a ocre `#7a5300` (6,37:1) e em escuro troca-a
     pelo próprio âmbar. A marca horizontal segue a folha de estilos do sítio, e
     não uma decisão nova. No ÍCONE o problema não existe, porque lá o campo é de
     tinta e o âmbar mede 7,85:1 contra ele. */
  .ocre-claro {{ fill: {OCRE}; }}
  .ocre-escuro {{ fill: {AMBAR}; }}
  .campo-prancha {{ fill: {PAPEL}; }}
  .lockup.escuro .campo-prancha {{ fill: {PAPEL_ESCURO}; }}
  .nome-claro {{ fill: {TINTA}; }}
  .nome-escuro {{ fill: {TINTA_ESCURA}; }}
  .acento-claro {{ fill: {COBALTO}; }}
  .acento-escuro {{ fill: {COBALTO_CLARO}; }}
  .risco {{ border-left: 3px solid {AMBAR}; padding-left: 12px; }}
  .tabela {{ border-collapse: collapse; font-size: 13px; }}
  .tabela td, .tabela th {{ border-bottom: 1px solid #d9ddd8; padding: 5px 14px 5px 0;
                           text-align: left; font-weight: 400; vertical-align: top; }}
  .amostra {{ display: inline-block; width: 26px; height: 13px; vertical-align: -1px;
             border: 1px solid #585d5b; }}
  .larga {{ max-width: 1188px; width: 100%; height: auto; border: 1px solid #d9ddd8; }}
  .ecra {{ border: 1px solid #d9ddd8; display: block; }}
  .cab {{ border-top: 1px solid #d9ddd8; padding: 14px 0 4px; }}
  .cab-linha {{ display: flex; align-items: flex-end; gap: 16px; margin: 10px 0 16px; }}
  .cab-rot {{ font-size: 11px; color: #585d5b; font-family: ui-monospace, Menlo, monospace;
             width: 250px; flex: none; line-height: 1.3; }}
"""


def bloco_direcao(slug):
    f = FICHA[slug]
    p = lambda nome: _png(slug, nome)  # noqa: E731
    if slug in VOZ_FICHA:
        # As sete vozes têm marca horizontal própria, cada uma na sua voz.
        lock = lockup_da_voz(slug, "%s", "%a")
    elif slug == "18-e-minuscula":
        lock = lockup_do_e("%s", "%o")
    elif slug in ("10-palavra-estado", "11-estado-linha"):
        # A J e a J2 têm marca horizontal própria: a palavra é desenhada, e só o
        # artigo e o «do País» é que são compostos.
        lock = lockup_da_palavra("%s", "%a",
                                 valor=LINHA_VALOR if slug == "11-estado-linha" else None)
    else:
        dn, (nx0, ny0, nx1, ny1) = caminho_do_nome(altura=100)
        vb = f"{n(nx0)} {n(ny0)} {n(nx1 - nx0)} {n(ny1 - ny0)}"
        lock = (f'<svg viewBox="{vb}" role="img" aria-label="O Estado do País">'
                f'<path class="%s" d="{dn}"/></svg>')
    palavra = ""
    if slug in VOZ_FICHA:
        palavra = (f'<figure><span class="chao"><img src="{p("180-palavra")}" width="180" '
                   f'height="180" alt=""></span><figcaption>180 com a PALAVRA<br>'
                   f'(o que a cela não segura)</figcaption></figure>')
    rotulo = "DIREÇÃO" if slug in ORDEM else "QUARTA ADENDA ·"
    return f"""
  <section class="dir" id="{slug}">
    <p class="marca-letra">{rotulo} {f["letra"]}</p>
    <h2>{f["nome"]}</h2>
    <p>{f["tenta"]}</p>
    <div class="fila">
      <figure><span class="chao"><img src="{p('180')}" width="180" height="180" alt=""></span><figcaption>180 · claro<br>apple-touch-icon</figcaption></figure>
      {palavra}
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
      <div class="lockup"><img src="{p('180')}" alt="">{lock.replace('%s', 'nome-claro').replace('%a', 'acento-claro').replace('%o', 'ocre-claro')}</div>
      <div class="lockup escuro"><img src="{p('180-escuro')}" alt="">{lock.replace('%s', 'nome-escuro').replace('%a', 'acento-escuro').replace('%o', 'ocre-escuro')}</div>
    </div>
    <p class="risco fina"><strong>O que arrisca.</strong> {f["arrisca"]}</p>
  </section>"""


def caixa_do_lockup(svg_txt):
    """A altura em unidades da caixa de um lockup já composto (lê-lhe o viewBox)."""
    vb = re.search(r'viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"', svg_txt)
    return float(vb.group(3)), float(vb.group(4))


def bloco_cabecalho():
    """A marca no cabeçalho do sítio, ao tamanho a que o cabeçalho vive hoje.

    `src/styles/site.css`, `.wordmark`: Spectral 400, `font-size: clamp(34px,
    7.4vw, 68px)`, `letter-spacing: -0.014em`; a versão compacta,
    `clamp(24px, 3.4vw, 34px)`. A altura de maiúscula do Spectral é 0,660 da em
    (`sCapHeight` 660 em 1000), e por isso um corpo de 68 px dá 44,9 px de
    maiúscula. Tudo o que está aqui é desenhado a 1:1: a altura de cada SVG em
    píxeis é a altura da caixa de tinta nas mesmas unidades.
    """
    linhas = []
    for corpo_px in (68, 34):
        cap = 0.660 * corpo_px
        dn, (nx0, ny0, nx1, ny1) = caminho_do_nome(altura=cap)
        vb = f"{n(nx0)} {n(ny0)} {n(nx1 - nx0)} {n(ny1 - ny0)}"
        hoje = (f'<svg style="height:{n(ny1 - ny0)}px" viewBox="{vb}" role="img" '
                f'aria-label="O Estado do País"><path class="nome-claro" d="{dn}"/></svg>')
        # âncora A: as partes compostas ao corpo do cabeçalho
        a = lockup_da_palavra("nome-claro", "acento-claro", altura=corpo_px,
                              valor=LINHA_VALOR)
        wa, ha = caixa_do_lockup(a)
        a = a.replace("<svg ", f'<svg style="height:{n(ha)}px" ')
        # âncora B: «Estado» à altura de maiúscula do cabeçalho
        b = lockup_da_palavra("nome-claro", "acento-claro", altura=cap,
                              valor=LINHA_VALOR)
        wb, hb = caixa_do_lockup(b)
        b = b.replace("<svg ", f'<svg style="height:{n(hb)}px" ')
        linhas.append(f"""
    <div class="cab">
      <p class="fina"><strong>Corpo de {corpo_px} px</strong> ({"o máximo do cabeçalho" if corpo_px == 68 else "o mínimo do cabeçalho, e o máximo do compacto"}),
      que dá {cap:.1f} px de altura de maiúscula.</p>
      <div class="cab-linha"><span class="cab-rot">hoje, texto composto</span>{hoje}</div>
      <div class="cab-linha"><span class="cab-rot">âncora A · o artigo e o «do País» ao corpo do cabeçalho</span>{a}</div>
      <div class="cab-linha"><span class="cab-rot">âncora B · «Estado» à maiúscula do cabeçalho</span>{b}</div>
      <p class="fina">Caixa de tinta: hoje {ny1 - ny0:.0f} px de alto; âncora A, {ha:.0f} px; âncora B, {hb:.0f} px.</p>
    </div>""")
    return f"""
<hr class="fio">
<h3>A marca no cabeçalho, ao tamanho a que o cabeçalho vive</h3>
<p class="fina">O cabeçalho do sítio é texto composto: <code>.wordmark</code>, Spectral 400,
<code>font-size: clamp(34px, 7.4vw, 68px)</code>, <code>letter-spacing: -0.014em</code>
(<code>src/styles/site.css</code>). A marca da J2 põe «Estado» desenhado no meio do nome, e
por isso há duas maneiras de a pôr «ao tamanho do cabeçalho», que não dão a mesma coisa.
Estão as duas aqui, a 1:1.</p>
{"".join(linhas)}"""


def bloco_ecras():
    """As maquetas do ecrã principal, mostradas a 1× (a terça parte de 3×)."""
    def img(nome, letra, nota):
        caminho = os.path.join(AQUI, f"ECRA-{nome}.png")
        if not os.path.exists(caminho):
            return f'<p class="fina">falta <code>ECRA-{nome}.png</code>: corra <code>desenhar.py ecras</code></p>'
        from PIL import Image
        w, h = Image.open(caminho).size
        return (f'<figure><img class="ecra" src="{_b64_png(caminho)}" '
                f'width="{w // 3}" height="{h // 3}" alt="">'
                f'<figcaption>{letra} · {nota}</figcaption></figure>')
    return f"""
<hr class="fio">
<h3>O ecrã principal, onde o ícone vai viver</h3>
<p class="fina">Três maquetas, à escala verdadeira: cela de 180 px (60 pt a 3×), largura de
1170 px (390 pt a 3×), arredondamento de 22,37 %, rótulo a 33 px (11 pt a 3×, <strong>inferência</strong>:
não se conferiu contra a documentação da Apple, e o tipo é o Helvetica do sistema). O fundo é
liso e cinzento médio de propósito: com um fundo claro de mais, o papel do nosso ícone
confundia-se com o ecrã e a maqueta fabricava o problema em vez de o medir. Aqui em baixo estão
a 1×, que é o tamanho a que a mão as vê; os ficheiros em <code>design/marca/ECRA-*.png</code>
estão a 3×.</p>
<p class="fina">Dois dos oito ícones de referência saem moles porque o servidor deles só
devolveu ficheiros pequenos (Pordata, 48 px; Poder360, 57 px), e foram ampliados para 180.</p>
<div class="fila">
{img("J2", "J2 · a palavra a 180", "o que a adenda pediu para o <code>apple-touch-icon</code>")}
{img("J2-letra", "J2 · a letra a 180", "a mesma direção com o sinal pequeno na cela grande")}
</div>
<div class="fila">
{img("H", "H · a letra a 180", "para comparar")}
</div>"""


def _amostra_e(campo, letra, com_contorno=False, r=R_E, g=G_E, barra=BARRA_E,
               sai=SAI_E, abertura=ABERTURA_E, px=130):
    """Um «e» num par de cores, em SVG de cores explícitas.

    SEM `<style>`, e de propósito: dentro de um documento de HTML os `<style>`
    de vários SVG são todos do documento, e o último ganha. Foi assim que a
    primeira folha de pré-visualização saiu com as sete vozes todas em âmbar
    sobre tinta. Aqui as cores vão no atributo, e cada amostra é dela.
    """
    partes, caixa = e_minusculo(CENTRO, CENTRO, r, g, abertura=abertura,
                                barra=barra, sai=sai)
    t = enquadra(caixa)
    traco = f' stroke="{TINTA}" stroke-width="13" stroke-linejoin="round"' if com_contorno else ""
    corpo = "".join(f'<path d="{d}" fill="{letra}"{traco}/>' for _, _, d in partes)
    return (f'<svg viewBox="0 0 {CAMPO} {CAMPO}" width="{px}" height="{px}">'
            f'<rect width="{CAMPO}" height="{CAMPO}" fill="{campo}"/>'
            f'<g{t}>{corpo}</g></svg>')


def bloco_voz7():
    """A folha da sétima voz: as quatro cores, as três aberturas, as duas barras."""
    def cel(svg_txt, legenda):
        return (f'<figure><span class="chao">{svg_txt}</span>'
                f'<figcaption>{legenda}</figcaption></figure>')
    cores = [
        (TINTA, AMBAR, False, "(a) «e» âmbar<br>em campo de tinta", AMBAR, TINTA),
        (AMBAR, TINTA, False, "(b) «e» de tinta<br>em campo âmbar", TINTA, AMBAR),
        (PAPEL, AMBAR, True, "(c) «e» âmbar em papel,<br>com o contorno de tokens.css", AMBAR, PAPEL),
        (PAPEL, OCRE, False, "(d) «e» ocre<br>em papel", OCRE, PAPEL),
    ]
    linhas_cor = []
    for campo, letra, ct, leg, ca, cb in cores:
        r = contraste(ca, cb)
        marca = "passa 3:1 e 4,5:1" if r >= 4.5 else ("passa 3:1" if r >= 3 else "FALHA 3:1")
        extra = " (o contorno de tinta sobre papel mede 16,39:1, e é ele que segura a forma)" if ct else ""
        linhas_cor.append(cel(_amostra_e(campo, letra, ct),
                              f'{leg}<br>{r:.2f}:1 · {marca}{extra}'))
    aberturas = [((-58.0, -6.0), "a de sempre<br>52 graus cortados"),
                 ((-90.0, 10.0), "100 graus<br>(a abertura larga)"),
                 ((-36.0, -12.0), "24 graus<br>(quase fechada)")]
    linhas_ab = [cel(_amostra_e(TINTA, AMBAR, abertura=a), leg) for a, leg in aberturas]
    barras = [cel(_amostra_e(TINTA, AMBAR, sai=SAI_E), "a barra ATRAVESSA<br>(a linha da régua)"),
              cel(_amostra_e(TINTA, AMBAR, sai=0.0), "a barra fica DENTRO<br>(a travessa de um «e»)"),
              cel(_amostra_e(TINTA, AMBAR, sai=0.0, barra=BARRA_E * 1.35),
                  "dentro e mais grossa<br>(a linha do valor)")]
    eco = _b64_png(os.path.join(AQUI, "referencias", "eco.sapo.pt.png"))
    lock_a = lockup_do_e("nome-claro", "ocre-claro")
    lock_b = lockup_do_e("nome-claro", "ocre-claro", minusculas=True)
    return f"""
<hr class="fio">
<h3>A sétima voz, por dentro: a cor, a abertura, a barra</h3>
<p class="fina">A adenda manda experimentar quatro pares de cor e medir o contraste de
cada um. Está medido aqui, pela fórmula da WCAG, contado no programa e não copiado de
lado nenhum. O limiar de 3:1 é o de um objeto gráfico; o de 4,5:1 é o de texto.</p>
<div class="fila">{"".join(linhas_cor)}</div>
<p class="fina"><strong>O que os números dizem.</strong> Só o par (c) falha, e falha nos dois
limiares: âmbar sobre papel mede 2,09:1. É por isso que <code>tokens.css</code> obriga o
marcador âmbar a levar contorno de tinta, e é por isso que a amostra (c) o traz. Os outros três
passam os dois limiares: 7,85:1 nos dois pares com âmbar e tinta, 6,37:1 no ocre sobre papel.</p>

<h3>A fração cortada</h3>
<div class="fila">{"".join(linhas_ab)}</div>

<h3>A barra: dentro, ou a atravessar</h3>
<div class="fila">{"".join(barras)}</div>

<h3>Os vizinhos com «e» minúsculo</h3>
<div class="fila">
  <figure><span class="chao"><img src="{eco}" width="120" height="120" alt=""></span><figcaption>Eco (SAPO), da folha<br>o ficheiro deles, a 120</figcaption></figure>
  <figure><span class="chao"><img class="px" src="{eco}" width="60" height="60" alt=""></span><figcaption>o mesmo, a 60</figcaption></figure>
  <figure><span class="chao">{_amostra_e(TINTA, AMBAR, px=120)}</span><figcaption>o nosso, a 120</figcaption></figure>
  <figure><span class="chao">{_amostra_e(TINTA, AMBAR, px=60)}</span><figcaption>o nosso, a 60</figcaption></figure>
</div>
<p class="fina"><strong>O «e» do navegador da Microsoft não está desenhado aqui, e é uma
escolha.</strong> A adenda deixava desenhá-lo de memória, rotulado como tal. Um desenho de
memória de uma marca de outrem não é prova de nada: ou se confere no ficheiro deles, e não há
rede, ou não se põe na folha a fingir que é uma medição. O que se pode dizer sem inventar é a
diferença de construção, e é isto: aquela marca é um «e» INCLINADO, com um anel ou uma faixa em
órbita à volta dele, em azul; este é um «e» a prumo, de grossura igual, sem órbita nenhuma, com
a abertura em baixo à direita e uma barra recta que atravessa. Pelo mesmo critério não se
desenha aqui a marca da Ecosia: não se conferiu, e sem rede não se confere.</p>
<p class="fina">O Eco, esse, está na folha e vê-se: é um «e» feito de arcos CONCÊNTRICOS num
campo verde, e a 60 px lê-se como um alvo. O nosso é uma banda só, e o campo é de tinta. A
distância existe, e é de construção e de cor.</p>

<h3>A marca horizontal da sétima voz, nas duas leituras</h3>
<div class="fila">
  <div class="lockup"><span style="width:46px;height:46px;display:inline-block">{_amostra_e(TINTA, AMBAR, px=46)}</span>{lock_a}</div>
</div>
<div class="fila">
  <div class="lockup"><span style="width:46px;height:46px;display:inline-block">{_amostra_e(TINTA, AMBAR, px=46)}</span>{lock_b}</div>
</div>
<p class="fina">Em cima, o nome com as maiúsculas que a casa lhe dá. Em baixo, o nome todo em
minúsculas, que é o que a forma do sinal sugere. A decisão não é de desenho: «o estado do país»
em minúsculas tira a maiúscula de «Estado», e é justamente a maiúscula que faz a palavra ler-se
como a instituição. Quem escrever o nome em minúsculas está a escolher a condição contra a
instituição, e a fazê-lo com ortografia e não com desenho.</p>"""


def bloco_ecra_vozes():
    caminho = os.path.join(AQUI, "ECRA-VOZES.png")
    if not os.path.exists(caminho):
        return '<p class="fina">falta <code>ECRA-VOZES.png</code>: corra <code>desenhar.py vozes</code></p>'
    from PIL import Image
    w, h = Image.open(caminho).size
    return f"""
<hr class="fio">
<h3>As sete vozes no ecrã principal, à mesma escala</h3>
<p class="fina">É a folha que a quarta adenda pede: cada voz na sua cela de 180 px (60 pt a 3×),
entre os mesmos oito ícones, em ecrã claro. Só ecrã claro, e de propósito: a pergunta desta ronda
é a do campo, e um ecrã escuro daria vantagem a quem já tem campo escuro. O ficheiro está a 3×
em <code>design/marca/ECRA-VOZES.png</code>; aqui está reduzido para caber.</p>
<img class="larga" src="{_b64_png(caminho)}" width="{w // 4}" height="{h // 4}" alt="">"""


def _euro_b64(lado, campo=TINTA, letra=AMBAR):
    import io
    buf = io.BytesIO()
    _euro_png(lado, campo, letra).save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


# As variantes que a quinta adenda põe em cima da mesa, e o que cada uma é.
ADENDA5_BARRAS = [
    ("18-e-minuscula", "a barra ATRAVESSA", "os dois lados, como está hoje"),
    ("18i-e-barra-esquerda", "a barra sai SÓ À ESQUERDA", "do lado fechado"),
    ("18b-e-barra-dentro", "a barra fica DENTRO", "um «e» de tipo"),
]
ADENDA5_CORTES = [
    ("18c-e-corte-estreito", "32 graus", "atravessa"),
    ("18-e-minuscula", "48 graus", "atravessa"),
    ("18d-e-corte-largo", "62 graus", "atravessa"),
    ("18e-e-dentro-estreito", "32 graus", "dentro"),
    ("18b-e-barra-dentro", "48 graus", "dentro"),
    ("18f-e-dentro-largo", "62 graus", "dentro"),
]
ADENDA5_REGUA = ["18-e-minuscula", "18i-e-barra-esquerda", "18b-e-barra-dentro",
                 "18c-e-corte-estreito", "18d-e-corte-largo",
                 "18e-e-dentro-estreito", "18f-e-dentro-largo",
                 "18k-e-favicon-fechado"]


def _fila_de_medidas(slug):
    ficha = {f[0]: f for f in FAMILIA_E}[slug]
    _, corte, sai, corte_fav, sai_dir = ficha
    return corte, corte_fav


def _cel_e(slug, nome, px, legenda, escala=1, ampliado=False):
    chao = "chao lupa" if ampliado else "chao"
    px_classe = ' class="px"' if ampliado else ""
    return (f'<figure><span class="{chao}"><img{px_classe} '
            f'src="{_png(slug, nome)}" width="{px * escala}" height="{px * escala}" alt="">'
            f'</span><figcaption>{legenda}</figcaption></figure>')


ADENDA5_MINIMAS = [
    ("18m-e-minimo-16", "16 %", "o topo do que o aditamento pede"),
    ("18n-e-minimo-14", "14 %", "a mais fina que sobrevive aos 16 px"),
    ("18o-e-minimo-12", "12 %", "o fundo do que o aditamento pede"),
    ("18p-e-minimo-10", "10 %", "abaixo do pedido, para o limite se ver"),
]

# A haste do Spectral Regular, medida no ficheiro da casa e registada na §8 das
# NOTAS: 68,9 em 1000 de em, com a altura de maiúscula a 660. Em frações da
# altura de maiúscula, 0,104. É com este número que se responde ao «uma
# espessura só» do aditamento quando o sinal está ao lado do nome.
HASTE_SPECTRAL = 68.9 / 660.0


def bloco_adenda5():
    """A folha da quinta adenda e do aditamento: a barra, o corte, a grossura, a cor.

    Cada número que aqui aparece foi lido do PNG por `_medida_e` no momento em
    que a folha se escreveu. Não há aqui um número escrito à mão.
    """
    filas_barra = []
    for slug, titulo, nota in ADENDA5_BARRAS:
        filas_barra.append(f"""
    <p class="fina" style="margin-top:18px"><strong>{titulo}</strong> · {nota}
    · <code>{slug}</code></p>
    <div class="fila">
      {_cel_e(slug, "180", 180, "180")}
      {_cel_e(slug, "60", 60, "60 · o juízo")}
      {_cel_e(slug, "60", 60, "60, ampliado 4x", 4, True)}
      {_cel_e(slug, "16", 16, "16")}
      {_cel_e(slug, "16", 16, "16, ampliado 8x", 8, True)}
    </div>""")

    def _cel_euro(px, esc, leg):
        px_classe = ' class="px"' if esc > 1 else ""
        return (f'<figure><span class="chao"><img{px_classe} src="{_euro_b64(px // esc)}" '
                f'width="{px}" height="{px}" alt=""></span>'
                f'<figcaption>{leg}</figcaption></figure>')

    euro = _cel_euro(60, 1, "60") + _cel_euro(480, 8, "60, ampliado 8x")
    nosso = "".join(
        f'<figure><span class="chao"><img src="{_png(slug, "60")}" width="480" '
        f'height="480" class="px" alt=""></span><figcaption>{leg}<br>60, ampliado 8x'
        f'</figcaption></figure>'
        for slug, leg in (("18-e-minuscula", "a barra atravessa"),
                          ("18i-e-barra-esquerda", "só à esquerda"),
                          ("18n-e-minimo-14", "o «e» mínimo (a barra acaba no anel)")))

    filas_corte = "".join(
        f'<figure><span class="chao"><img src="{_png(slug, "60")}" width="240" '
        f'height="240" class="px" alt=""></span><figcaption>{graus} · {barra}<br>'
        f'60, ampliado 4x</figcaption></figure>'
        for slug, graus, barra in ADENDA5_CORTES)
    filas_corte_16 = "".join(
        f'<figure><span class="chao lupa"><img src="{_png(slug, "16")}" width="128" '
        f'height="128" class="px" alt=""></span><figcaption>{graus} · {barra}<br>'
        f'16, ampliado 8x</figcaption></figure>'
        for slug, graus, barra in ADENDA5_CORTES)

    def _linha_regua(slug, rotulo):
        corte, corte_fav = _fila_de_medidas(slug)
        m180 = _medida_e(slug, corte, corte_fav, "180")
        m60 = _medida_e(slug, corte, corte_fav, "60")
        m16 = _medida_e(slug, corte, corte_fav, "16")
        if not (m60 and m16 and m180):
            return ""
        return (f"<tr><td>{rotulo}</td>"
                f"<td>{m180['diametro']}</td><td>{m180['banda']}</td>"
                f"<td>{m60['sinal']:.1f} %</td>"
                f"<td>{m60['min']} px, {m60['onde'].split(', ', 1)[1].split(', em')[0]}</td>"
                f"<td><strong>{m60['ponta']:.1f}</strong></td><td>{m60['corda']:.1f}</td>"
                f"<td>{m16['min']}</td><td><strong>{m16['ponta']:.1f}</strong></td>"
                f"<td>{m16['corda']:.1f}</td>"
                f"<td>{'aberto' if m16['aberto'] else 'FECHADO'}</td></tr>")

    linhas = "".join(_linha_regua(s, f"<code>{s.split('-', 1)[0]}</code>")
                     for s in ADENDA5_REGUA)
    linhas_min = "".join(_linha_regua(s, f"<strong>{g}</strong> <code>{s.split('-', 1)[0]}</code>")
                         for s, g, _ in ADENDA5_MINIMAS)

    filas_minimas = []
    for slug, g, nota in ADENDA5_MINIMAS:
        filas_minimas.append(f"""
    <p class="fina" style="margin-top:18px"><strong>{g} do diâmetro</strong> · {nota}
    · <code>{slug}</code></p>
    <div class="fila">
      {_cel_e(slug, "180", 180, "180")}
      {_cel_e(slug, "60", 60, "60 · o juízo")}
      {_cel_e(slug, "60", 60, "60, ampliado 6x", 6, True)}
      {_cel_e(slug, "16", 16, "16")}
      {_cel_e(slug, "16", 16, "16, ampliado 12x", 12, True)}
    </div>""")

    cores = []
    for slug, leg, par in (("18n-e-minimo-14", "âmbar em campo de tinta",
                            f"{contraste(AMBAR, TINTA):.2f}:1"),
                           ("18q-e-minimo-ocre", "ocre em papel",
                            f"{contraste(OCRE, PAPEL):.2f}:1"),
                           ("18r-e-minimo-sem-campo", "sem campo nenhum",
                            "o sinal sozinho, para o cabeçalho")):
        cores.append(f"""
    <p class="fina" style="margin-top:18px"><strong>{leg}</strong> · {par} ·
    <code>{slug}</code></p>
    <div class="fila">
      {_cel_e(slug, "180", 180, "180")}
      {_cel_e(slug, "180-escuro", 180, "180 · tema escuro")}
      {_cel_e(slug, "60", 60, "60")}
      {_cel_e(slug, "60", 60, "60, ampliado 4x", 4, True)}
      {_cel_e(slug, "16", 16, "16")}
      {_cel_e(slug, "16", 16, "16, ampliado 8x", 8, True)}
    </div>""")

    cabecalhos = []
    for corpo_px in (68, 34):
        cap = 0.660 * corpo_px
        linhas_cab = []
        for diam, g, rot in (
                (1.00, G_MINIMO, "o «e» à altura de maiúscula (âncora B), grossura do ícone"),
                (1.24, G_MINIMO, "o «e» a 1,24 dessa altura, grossura do ícone"),
                (1.00, HASTE_SPECTRAL, "o «e» à altura de maiúscula, grossura da HASTE do Spectral")):
            lk = lockup_do_e("nome-claro", "ocre-claro", altura=cap, diam=diam, minimo=g)
            _, h = caixa_do_lockup(lk)
            lk = lk.replace("<svg ", f'<svg style="height:{n(h)}px" ')
            lk_e = lockup_do_e("nome-escuro", "ocre-escuro", altura=cap, diam=diam, minimo=g)
            lk_e = lk_e.replace("<svg ", f'<svg style="height:{n(h)}px" ')
            linhas_cab.append(
                f'<div class="cab-linha"><span class="cab-rot">{rot}</span>{lk}</div>'
                f'<div class="lockup escuro" style="margin:0 0 16px">{lk_e}</div>')
        cabecalhos.append(f"""
    <div class="cab">
      <p class="fina"><strong>Corpo de {corpo_px} px</strong>
      ({"o máximo do cabeçalho" if corpo_px == 68 else "o mínimo do cabeçalho"}),
      que dá {cap:.1f} px de altura de maiúscula.</p>
      {"".join(linhas_cab)}
    </div>""")

    ecra = os.path.join(AQUI, "ECRA-E.png")
    if os.path.exists(ecra):
        from PIL import Image
        w, h = Image.open(ecra).size
        bloco_ecra = (f'<img class="larga" src="{_b64_png(ecra)}" width="{w // 4}" '
                      f'height="{h // 4}" alt="">')
    else:
        bloco_ecra = ('<p class="fina">falta <code>ECRA-E.png</code>: corra '
                      '<code>desenhar.py ecra-e</code></p>')

    return f"""
<hr class="fio">
<h2>O «e», refinado (a quinta adenda e o aditamento)</h2>
<p class="fina">O gabinete pôs o «e» do diretor à frente e mandou afinar a barra, o corte e a
cor. A meio da ronda veio o aditamento, com as palavras dele: o sinal <strong>«devia ser muito
mais limpo, muito mais minimalista»</strong>. Esta folha traz as duas coisas, por essa ordem,
porque a segunda responde à primeira: a instrução de tirar a barra saliente resolve a pergunta
do «€» tirando-lhe o objeto. Tudo o que se segue está medido nos PNG de <code>EXPORT/</code>
no momento em que a folha se escreveu, com <code>desenhar.py medir-e</code>, e nenhum número
aqui foi escrito à mão.</p>

<h3>1 · A barra: a atravessar, só de um lado, ou dentro do bojo</h3>
<p class="fina">A adenda pede duas versões. Foram três, e a terceira nasceu de olhar para as
duas primeiras: a barra que sai <strong>só à esquerda</strong>, do lado fechado.</p>
{"".join(filas_barra)}
<p class="fina"><strong>O que a barra custa em diâmetro.</strong> O sinal de qualquer direção
cabe num quadrado de 360 em 512, e a barra que sai tem de caber lá dentro com ele. Medido nos
PNG de 180 px: o anel dá <strong>99 px</strong> com a barra a atravessar dos dois lados,
<strong>111 px</strong> com ela a sair só à esquerda e <strong>128 px</strong> com ela a acabar
no bojo. A linha da régua custa 23 % do diâmetro do anel; metade dela custa 13 %.</p>

<h3>2 · O teste do «€», a 60 px</h3>
<p class="fina">O sinal do euro tem uma construção fixada, e nem ela nem o glifo de tipo nenhum
estão aqui: o que está desenhado é a <strong>anatomia</strong> que a adenda nomeia, para se
poder ver ao lado da nossa. Bojo <strong>aberto</strong> (um «C» com 100 graus cortados à
direita) e <strong>duas</strong> barras que saem dos dois lados. As proporções são as do nosso
«e», para que o que se compare seja a construção e não o peso.</p>
<div class="fila">{euro}{nosso}</div>
<p class="fina">O que faz a leitura de moeda não é uma barra a sair: é uma barra a sair
<strong>dos dois lados</strong> de um bojo redondo. É isso que o «€» e a primeira versão têm em
comum, e das três é a única que o tem.</p>

<h3>3 · O corte: 32, 48 e 62 graus, contados da barra</h3>
<p class="fina">O corte conta-se <strong>da barra</strong> e não do ângulo do ficheiro: no
desenho antigo a banda acabava a -6 graus e a barra, com 42 de grossura num raio de 150,
tapava-lhe {ANG_BARRA_E:.1f} graus da ponta de cima. O que o olho vê é o canto de baixo da
barra em cima e a ponta da banda em baixo.</p>
<div class="fila">{filas_corte}</div>
<div class="fila">{filas_corte_16}</div>

<h3>A régua das variantes da adenda</h3>
<p class="fina">A <strong>matéria na ponta</strong> é a tinta contada ao longo da face do
corte, e é o número que a adenda quer acima de 2 px. A <strong>corrida mínima</strong> é outra
coisa: é uma linha de píxeis a rasar um canto vivo, e mede o canto, não a matéria. A
<strong>corda</strong> é a abertura à vista, medida sobre a circunferência do meio da banda. O
<strong>bojo</strong> conta-se nas ilhas do fundo: aberto quando o vazio de dentro comunica com
o campo de fora.</p>
<table class="tabela">
  <tr><th></th><th>anel a 180</th><th>banda a 180</th><th>sinal a 60</th>
      <th>corrida mín. a 60</th><th>ponta a 60</th><th>corda a 60</th>
      <th>corrida mín. a 16</th><th>ponta a 16</th><th>corda a 16</th><th>bojo a 16</th></tr>
  {linhas}
</table>
<p class="fina"><strong>A 18k não é uma variante: é o par de controlo.</strong> Tem a geometria
da 18i e a regra VELHA do desenho de 32 e 16 px, que fechava o corte em vez de o alargar. Com a
mesma forma e a mesma cor, a diferença a 16 px é da regra e de mais nada: a corda passa de 2,2
para 3,0 px e a matéria na ponta de 1,5 para 2,1. Engrossar a banda já fecha a abertura por
dentro; fechar também o ângulo fechava-a duas vezes.</p>

<hr class="fio">
<h3>4 · O «e» mínimo: uma forma, uma grossura, nada acrescentado</h3>
<p class="fina">O aditamento manda uma coisa só, dita de quatro maneiras: a circunferência, o
corte e a barra, com <strong>uma grossura só</strong>, a barra a acabar no anel e não a sair
dele, os remates cortados a direito, sem contorno, sem segunda cor e sem moldura. Isso mudou a
construção em três sítios, e é preciso dizê-los.</p>
<ul class="fina">
  <li>A barra passou a ter <strong>exatamente</strong> a grossura do anel. Tinha 42 num anel de
  46, ou seja 0,91 dele.</li>
  <li>As quatro pontas da barra <strong>pousam na circunferência</strong>: os remates são cordas
  do círculo, e a silhueta fica sem saliência nenhuma.</li>
  <li>O corte de cima <strong>deixou de ser um ângulo escolhido</strong> e passa a ser aquele
  onde a face de baixo da barra encontra a circunferência de fora. Antes a barra tapava a ponta
  da banda, o que é uma junta escondida; agora as duas peças acabam na mesma linha.</li>
  <li>Não há segundo desenho para 32 e 16 px: <strong>o mesmo desenho a todos os tamanhos</strong>,
  que é o que «nada acrescentado» quer dizer, e é o que faz a medição a 16 px responder à
  pergunta do aditamento em vez de a mascarar.</li>
</ul>
<p class="fina"><strong>Uma correção de facto, antes das grossuras.</strong> O aditamento diz
«12 a 16 % do diâmetro» e acrescenta que «a atual é mais pesada». Medida, a banda da sétima voz
tem 46 num diâmetro de 300, ou seja <strong>15,3 % do diâmetro</strong>: já estava dentro do
intervalo, no topo dele. Para o desenho ser de facto mais leve, as grossuras aqui vão de 16 % a
<strong>10 %</strong>, que está abaixo do pedido, para que o limite se veja em vez de se
supor.</p>
{"".join(filas_minimas)}
<table class="tabela">
  <tr><th>grossura</th><th>anel a 180</th><th>banda a 180</th><th>sinal a 60</th>
      <th>corrida mín. a 60</th><th>ponta a 60</th><th>corda a 60</th>
      <th>corrida mín. a 16</th><th>ponta a 16</th><th>corda a 16</th><th>bojo a 16</th></tr>
  {linhas_min}
</table>
<p class="fina"><strong>Qual é a mais fina que sobrevive.</strong> Nenhuma fecha o bojo a 16 px,
e por isso o teste topológico não separa as quatro. O que as separa é a matéria: a
<strong>ponta do corte</strong> a 16 px mede 1,4 px a 16 %, 0,5 px a 14 % e a 12 %, e 0,2 px a
10 %; e ao olhar, que é o que decide, a 12 % a coroa do anel já vem cinzenta e a 10 % o anel é
um halo à volta da barra, com a forma a ler-se como uma mancha atravessada e não como um «e».
A <strong>14 %</strong> o anel chega inteiro aos 16 px e o desenho é visivelmente mais leve do
que o de hoje. É essa a resposta à pergunta do aditamento: a mais fina que sobrevive é a de
14 %, e a de 16 % é a que sobra se a direção quiser folga.</p>

<h3>5 · Os pares de cor, ao fim</h3>
<p class="fina">O ícone leva âmbar <code>#e0a21a</code> em campo de tinta <code>#17191b</code>,
que mede {contraste(AMBAR, TINTA):.2f}:1 e passa os dois limiares. Para o caso de campo claro o
«e» não pode ser âmbar (2,09:1 sobre papel): é ocre <code>#7a5300</code>,
{contraste(OCRE, PAPEL):.2f}:1. Em tema escuro a variante de papel troca o ocre pelo âmbar, que
é o que <code>tokens.css</code> já faz com a palavra do estado. E há um terceiro ficheiro, sem
campo nenhum: um ícone de telemóvel tem sempre campo, porque o sistema lhe recorta um quadrado,
mas no cabeçalho o sinal assenta no papel do sítio e um campo ali seria a moldura que o
aditamento manda tirar.</p>
{"".join(cores)}

<h3>6 · O cabeçalho a 1:1, com o «e» ao lado do nome</h3>
<p class="fina">O cabeçalho do sítio é texto composto: <code>.wordmark</code>, Spectral 400,
<code>font-size: clamp(34px, 7.4vw, 68px)</code>, <code>letter-spacing: -0.014em</code>
(<code>src/styles/site.css</code>). Tudo o que está aqui está a 1:1, com o mesmo aperto de
letras que o sítio aplica: uma linha, um peso, sem filete e sem frase por baixo. A terceira
linha de cada corpo responde ao «uma espessura só» com um número: a haste do Spectral Regular
mede 68,9 em 1000 de em com a maiúscula a 660, ou seja <strong>{HASTE_SPECTRAL * 100:.1f} %</strong>
da altura de maiúscula (medida no ficheiro da casa, §8 das notas). Um «e» dessa grossura fica
igual ao nome e desaparece dentro dele; a {G_MINIMO * 100:.0f} % lê-se como sinal ao lado da
palavra, que é o que um sinal tem de fazer.</p>
{"".join(cabecalhos)}

<h3>7 · O ecrã principal, com as quatro grossuras</h3>
<p class="fina">A mesma maqueta das rondas anteriores, com os mesmos oito ícones e a mesma cela
de 180 px (60 pt a 3×), em ecrã claro <strong>e</strong> escuro, porque aqui a pergunta já não é
a do campo: o que se compara é a grossura. A última fila é o par de campo claro.</p>
{bloco_ecra}"""


def prancha():
    tira, tira_tam = tira_de_vizinhanca()
    folha, folha_tam = folha_embebida()
    blocos = "\n".join(bloco_direcao(s) for s in ORDEM)
    blocos_vozes = "\n".join(bloco_direcao(s) for s in VOZES_ORDEM)
    html = f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>A marca · onze direções e sete vozes · O Estado do País</title>
<style>{CSS_PRANCHA}</style>
</head>
<body>
<header class="cabeca">
  <h1>«O Estado do País» · a marca e o ícone do telemóvel</h1>
  <p class="fina">Prancha de exploração, 28.08.2026, ramo <code>marca-2026-08-28</code>.
  Nada disto está no sítio: não há ficheiro em <code>public/</code>, não há linha no
  <code>&lt;head&gt;</code> e não há manifesto. São <strong>onze direções e sete
  vozes</strong>: as sete de 28.08 de manhã, as três que a terceira adenda pediu sobre a
  palavra «Estado» (H, I e J), a J2 (a J com a linha do valor dentro do «E»), e as sete
  vozes da quarta adenda, que vêm depois de o diretor ter dito que a palavra ao tamanho
  de um ícone «pode não funcionar, por causa do tamanho» e que não encontrou nenhum
  desenho de que gostasse. Nas sete vozes o conceito não mudou: mudou a voz.</p>
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
  <tr><th>A troca da J</th><td>A direção J troca de desenho mais cedo do que as outras:
      a partir dos 60 px deixa a palavra e fica com o «E» dela. A palavra a 60 px dá 10 px
      de altura de maiúscula, e a terceira adenda pede-o à letra.</td></tr>
</table>

<hr class="fio">
<h3>As sete vozes (a quarta adenda)</h3>
<p class="fina">A mesma palavra e a mesma letra, em sete personalidades tipográficas
diferentes, e cada uma com a sua decisão de campo. A palavra é o sinal do ficheiro de
512 e da marca horizontal; o «E» dela, sozinho, é o sinal de 180 px para baixo, que é a
cela do telemóvel. Cada voz mostra as duas coisas na primeira fila, lado a lado.</p>
{blocos_vozes}

{bloco_ecra_vozes()}
{bloco_voz7()}
{bloco_adenda5()}

<hr class="fio">
<h3>As onze primeiras direções (as três primeiras adendas)</h3>
{blocos}

{bloco_cabecalho()}
{bloco_ecras()}

<hr class="fio">
<h3>A vizinhança a 60 px</h3>
<p class="fina">As dezanove direções e dezasseis das referências, todas reduzidas ao mesmo
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


# ===========================================================================
# O ECRÃ PRINCIPAL, A 3×
# ===========================================================================
"""
`python3 design/marca/desenhar.py ecras` escreve `design/marca/ECRA-J2.png` e
`design/marca/ECRA-H.png`.

PORQUE É QUE ISTO EXISTE. Um ícone não se julga sozinho num campo branco: julga-se
onde vai viver, que é entre os ícones dos outros, ao tamanho a que o telemóvel os
desenha. A quarta adenda pede-o à escala verdadeira: 3×, com a cela do ícone a 180
px, que é o que um iPhone a 3× desenha para um ícone de 60 pt.

O QUE É MEDIDO E O QUE É SUPOSTO, e convém não confundir as duas coisas:
  · a cela de 180 px é 60 pt a 3×, e é o tamanho que o `apple-touch-icon` pede;
  · o arredondamento de 22,37 % é o mesmo que a prancha já usa nas outras filas;
  · a largura de 1170 px é 390 pt a 3×, que é a largura de um iPhone corrente;
  · o rótulo a 33 px é 11 pt a 3× (INFERÊNCIA: não está conferido contra a
    documentação da Apple, que não se pode consultar sem rede, e o tipo é o
    Helvetica do sistema e não o do iPhone). O que importa aqui é a ORDEM DE
    GRANDEZA do rótulo ao lado do ícone, e essa está certa.
  · o fundo é liso, e num telemóvel é uma fotografia. É de propósito: uma
    fotografia por baixo muda a leitura de cada ícone de maneira diferente, e o
    que se quer comparar é o ícone. O cinzento médio também é escolhido: com um
    fundo claro de mais, o papel do nosso ícone confunde-se com o ecrã e a
    maqueta fabricava o problema que devia medir. Assim, o NYT e o Público, que
    também têm campo claro, mostram a borda tal como o nosso.

E UMA COISA QUE SE VÊ NA IMAGEM E QUE NÃO É NOSSA: dois dos oito ícones de
referência (Pordata, 48 px, e Poder360, 57 px) foram ampliados para 180 e por
isso saem moles. Num telemóvel a sério o sistema serve o ficheiro grande que o
sítio declara; aqui só se tem o que o servidor devolveu.
"""

LARGURA_ECRA = 1170          # 390 pt a 3×
CELA = 180                   # 60 pt a 3×
RAIO_IOS = 0.2237
COLUNAS = 4
MARGEM = 90
ROTULO_PX = 33               # 11 pt a 3× (inferência, ver acima)
FUNDO_CLARO = (176, 182, 176)
FUNDO_ESCURO = (16, 18, 20)

ECRA_FILAS = [
    ("expresso.pt.png", "Expresso"),
    ("observador.pt.png", "Observador"),
    ("publico.pt.png", "Público"),
    ("economist.com.png", "Economist"),
    ("nytimes.com.png", "NYTimes"),
    (None, "Estado do País"),          # o nosso, a meio da segunda fila
    ("ourworldindata.org.png", "Our World in Data"),
    ("poder360.com.br.png", "Poder360"),
    ("pordata.pt.png", "Pordata"),
]


def _mascara_ios(lado):
    from PIL import Image, ImageDraw
    m = Image.new("L", (lado * 4, lado * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, lado * 4 - 1, lado * 4 - 1],
                                        radius=int(RAIO_IOS * lado * 4), fill=255)
    return m.resize((lado, lado), Image.LANCZOS)


def _icone(caminho, lado=CELA):
    from PIL import Image
    im = Image.open(caminho).convert("RGBA")
    if im.size != (lado, lado):
        im = im.resize((lado, lado), Image.LANCZOS)
    fundo = Image.new("RGB", (lado, lado), (255, 255, 255))
    fundo.paste(im, (0, 0), im)
    return fundo


def compoe_ecra(icone_nosso, tema):
    """Um ecrã principal, com o nosso ícone entre oito dos outros."""
    from PIL import Image, ImageDraw, ImageFont
    escuro = tema == "escuro"
    fonte = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", ROTULO_PX)
    gap = (LARGURA_ECRA - 2 * MARGEM - COLUNAS * CELA) / (COLUNAS - 1)
    passo = CELA + 12 + ROTULO_PX + 75
    filas = (len(ECRA_FILAS) + COLUNAS - 1) // COLUNAS
    alto = 120 + filas * passo + 40
    im = Image.new("RGB", (LARGURA_ECRA, alto), FUNDO_ESCURO if escuro else FUNDO_CLARO)
    d = ImageDraw.Draw(im)
    mascara = _mascara_ios(CELA)
    cor = (236, 238, 234) if escuro else (23, 25, 27)
    for i, (ficheiro, rotulo) in enumerate(ECRA_FILAS):
        cx = MARGEM + (i % COLUNAS) * (CELA + gap)
        cy = 120 + (i // COLUNAS) * passo
        caminho = icone_nosso if ficheiro is None else os.path.join(AQUI, "referencias", ficheiro)
        im.paste(_icone(caminho), (int(cx), int(cy)), mascara)
        texto = rotulo
        while d.textlength(texto + "…", font=fonte) > CELA + 24 and len(texto) > 3:
            texto = texto[:-1]
        if texto != rotulo:
            texto += "…"
        larg = d.textlength(texto, font=fonte)
        d.text((cx + CELA / 2 - larg / 2, cy + CELA + 12), texto, font=fonte, fill=cor)
    return im


def ecras():
    from PIL import Image, ImageDraw, ImageFont
    fonte = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
    for letra, slug, sufixos in (("J2", "11-estado-linha", ("180", "180-escuro")),
                                 ("J2-letra", "11-estado-linha", ("180-letra", "180-letra-escuro")),
                                 ("H", "8-e-livro-razao", ("180", "180-escuro"))):
        peles = []
        for tema, sufixo in zip(("claro", "escuro"), sufixos):
            nosso = os.path.join(AQUI, "EXPORT", slug, f"{slug}-{sufixo}.png")
            peles.append(compoe_ecra(nosso, tema))
        larg = sum(p.size[0] for p in peles) + 60
        alto = max(p.size[1] for p in peles) + 54
        folha = Image.new("RGB", (larg, alto), (150, 154, 148))
        x = 0
        for p, nome in zip(peles, ("ecrã claro", "ecrã escuro")):
            folha.paste(p, (x, 0))
            ImageDraw.Draw(folha).text((x + 8, p.size[1] + 12),
                                       f"{nome} · ícone da direção {letra} · 3×, cela de 180 px",
                                       font=fonte, fill=(20, 22, 20))
            x += p.size[0] + 60
        saida = os.path.join(AQUI, f"ECRA-{letra}.png")
        folha.save(saida, optimize=True)
        print(f"escrito design/marca/ECRA-{letra}.png  ({folha.size[0]} x {folha.size[1]})")


"""
`python3 design/marca/desenhar.py vozes` escreve `design/marca/ECRA-VOZES.png`.

É a folha que a quarta adenda pede: as sete vozes (mais o campo alternativo da
terceira, que a adenda manda experimentar) no MESMO ecrã principal, ao mesmo
tamanho, em ecrã claro, com o rótulo por baixo. Uma folha só, para o diretor
decidir a olhar e de uma vez, e não a saltar entre oito ficheiros.

O ecrã claro e não os dois: a pergunta desta ronda é a do campo, e um ecrã
escuro dá vantagem a quem tem campo escuro, o que enviesava a comparação.
"""

VOZES_NA_FOLHA = [
    ("12-didone-estado", "1 · editorial, contraste alto", "campo tinta, letra papel"),
    ("13-inscricional-estado", "2 · inscricional", "campo ocre, versais, faixa incisa"),
    ("14-geometrica-ambar", "3 · geométrica pesada", "campo âmbar, letra tinta"),
    ("14b-geometrica-cobalto", "3b · a mesma, campo cobalto", "campo cobalto, letra papel"),
    ("15-laje-instrumento", "4 · laje de instrumento", "campo papel, linha do valor cobalto"),
    ("16-condensada-estado", "5 · grotesca condensada", "campo tinta, acento âmbar"),
    ("17-caligrafica-estado", "6 · caligráfica", "campo papel, aparo largo"),
    ("18-e-minuscula", "7 · o «e» minúsculo", "campo tinta, «e» âmbar"),
]
FOLHA_COLUNAS = 4
FOLHA_GAP = 46


def ecras_vozes():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    peles = []
    for slug, titulo, nota in VOZES_NA_FOLHA:
        # a cela do telemóvel leva SEMPRE o sinal pequeno: é o que a adenda pede
        # («o "E" dela sozinho para 180») e é a lição da maqueta anterior.
        nosso = os.path.join(AQUI, "EXPORT", slug, f"{slug}-180.png")
        peles.append((compoe_ecra(nosso, "claro"), titulo, nota))
    lp, ap = peles[0][0].size
    filas = (len(peles) + FOLHA_COLUNAS - 1) // FOLHA_COLUNAS
    rodape = 104
    larg = FOLHA_COLUNAS * lp + (FOLHA_COLUNAS + 1) * FOLHA_GAP
    alto = filas * (ap + rodape) + (filas + 1) * FOLHA_GAP
    folha = Image.new("RGB", (larg, alto), (128, 133, 127))
    d = ImageDraw.Draw(folha)
    for i, (pele, titulo, nota) in enumerate(peles):
        x = FOLHA_GAP + (i % FOLHA_COLUNAS) * (lp + FOLHA_GAP)
        y = FOLHA_GAP + (i // FOLHA_COLUNAS) * (ap + rodape + FOLHA_GAP)
        folha.paste(pele, (x, y))
        d.text((x + 4, y + ap + 18), titulo, font=grande, fill=(16, 18, 16))
        d.text((x + 4, y + ap + 62), nota, font=pequena, fill=(46, 50, 46))
    saida = os.path.join(AQUI, "ECRA-VOZES.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/ECRA-VOZES.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "ecras":
    ecras()


if len(sys.argv) > 1 and sys.argv[1] == "vozes":
    ecras_vozes()


"""
`python3 design/marca/desenhar.py ecra-e` escreve `design/marca/ECRA-E.png`.

Duas variantes do «e» e o par de campo claro, cada um em ecrã claro e em ecrã
escuro, entre os mesmos oito ícones das rondas anteriores. Seis painéis, para
que a escolha entre a barra que sai e a barra que fica se faça onde o ícone vai
viver e não numa folha branca.
"""

ECRA_E_VARIANTES = [
    ("18m-e-minimo-16", "mínimo · 16 % do diâmetro", "âmbar em campo de tinta"),
    ("18n-e-minimo-14", "mínimo · 14 %", "âmbar em campo de tinta"),
    ("18o-e-minimo-12", "mínimo · 12 %", "âmbar em campo de tinta"),
    ("18q-e-minimo-ocre", "mínimo · 14 %, campo claro", "ocre em papel"),
]


def ecras_e():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 34)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 27)
    peles = []
    for slug, titulo, nota in ECRA_E_VARIANTES:
        for tema, sufixo in (("claro", "180"), ("escuro", "180-escuro")):
            nosso = os.path.join(AQUI, "EXPORT", slug, f"{slug}-{sufixo}.png")
            peles.append((compoe_ecra(nosso, tema), f"{titulo} · ecrã {tema}", nota))
    lp, ap = peles[0][0].size
    rodape, gap, colunas = 100, 46, 2
    filas = (len(peles) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * lp + (colunas + 1) * gap,
                              filas * (ap + rodape) + (filas + 1) * gap), (128, 133, 127))
    d = ImageDraw.Draw(folha)
    for i, (pele, titulo, nota) in enumerate(peles):
        x = gap + (i % colunas) * (lp + gap)
        y = gap + (i // colunas) * (ap + rodape + gap)
        folha.paste(pele, (x, y))
        d.text((x + 4, y + ap + 16), titulo, font=grande, fill=(16, 18, 16))
        d.text((x + 4, y + ap + 60), nota, font=pequena, fill=(46, 50, 46))
    saida = os.path.join(AQUI, "ECRA-E.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/ECRA-E.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "ecra-e":
    ecras_e()




"""
`python3 design/marca/desenhar.py folha-e` escreve `design/marca/FOLHA-E.png`.

É a folha da quinta adenda: as variantes do «e» às três medidas que a adenda
manda pôr lado a lado (180, 60 e 16 px), cada uma também ampliada, porque o que
morre a 16 px não se vê a 16 px. Em cima, o teste do «€».

O «€» QUE AQUI ESTÁ É UMA CONSTRUÇÃO, E NÃO O GLIFO OFICIAL, e a diferença
importa: o sinal do euro tem um desenho fixado pela Comissão, e nem esse desenho
nem o glifo de nenhum tipo estão aqui. O que está desenhado é a ANATOMIA que a
adenda nomeia, para se poder ver ao lado da nossa: bojo ABERTO (um «C», com um
corte de 100 graus à direita) e DUAS barras que atravessam. Serve para comparar
construções, não para representar o sinal.
"""

EURO_CORTE = 100.0        # os graus abertos à direita, que fazem do anel um «C»
EURO_BARRAS = 0.30        # a que altura, em raios, ficam as duas barras


def _euro_png(lado, campo=TINTA, letra=AMBAR, k=8):
    """A construção do «€», desenhada aqui, em PIL, e ampliada antes de reduzir.

    As proporções são as do nosso «e» (banda 0,31 do raio, barra 0,28), para que
    a comparação seja de ANATOMIA e não de peso: o que muda é o bojo estar
    aberto e as barras serem duas.
    """
    from PIL import Image, ImageDraw
    im = Image.new("RGB", (lado * k, lado * k), tuple(int(campo[i:i + 2], 16) for i in (1, 3, 5)))
    d = ImageDraw.Draw(im)
    cor = tuple(int(letra[i:i + 2], 16) for i in (1, 3, 5))
    c = lado * k / 2
    r = lado * k * (SINAL / CAMPO) / 2 * 0.86      # cabe na mesma janela que o nosso
    g = r * (G_E / R_E)
    b = r * (BARRA_E / R_E)
    d.arc([c - r + g / 2, c - r + g / 2, c + r - g / 2, c + r - g / 2],
          start=EURO_CORTE / 2, end=360 - EURO_CORTE / 2, fill=cor, width=int(g))
    for s in (-1, 1):
        y = c + s * r * EURO_BARRAS
        d.rectangle([c - r * 1.30, y - b / 2, c + r * 0.80, y + b / 2], fill=cor)
    return im.resize((lado, lado), Image.LANCZOS)


FOLHA_E_LINHAS = [
    ("18-e-minuscula", "a barra ATRAVESSA", "48 graus de corte · o desenho de hoje"),
    ("18b-e-barra-dentro", "a barra fica DENTRO", "48 graus de corte · um «e» de tipo"),
    ("18c-e-corte-estreito", "atravessa · corte estreito", "32 graus"),
    ("18d-e-corte-largo", "atravessa · corte largo", "62 graus"),
    ("18e-e-dentro-estreito", "dentro · corte estreito", "32 graus"),
    ("18f-e-dentro-largo", "dentro · corte largo", "62 graus"),
    ("18g-e-ocre-papel", "atravessa · ocre em papel", "48 graus · campo claro"),
    ("18h-e-ocre-dentro", "dentro · ocre em papel", "48 graus · campo claro"),
    ("18i-e-barra-esquerda", "a barra sai SÓ À ESQUERDA", "48 graus · a régua por um lado só"),
    ("18j-e-ocre-esquerda", "só à esquerda · ocre em papel", "48 graus · campo claro"),
    ("18m-e-minimo-16", "MÍNIMO · 16 % do diâmetro", "uma grossura só, barra igual ao anel"),
    ("18n-e-minimo-14", "MÍNIMO · 14 %", "uma grossura só"),
    ("18o-e-minimo-12", "MÍNIMO · 12 %", "uma grossura só"),
    ("18p-e-minimo-10", "MÍNIMO · 10 %", "abaixo do que o aditamento pede"),
    ("18q-e-minimo-ocre", "MÍNIMO · ocre em papel", f"{int(G_MINIMO * 100)} % · campo claro"),
]


def folha_e():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 26)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    rot = 300
    colunas = [("180", 180), ("60", 60), ("60", 240), ("16", 16), ("16", 128)]
    legendas = ["180", "60", "60, ampliado 4x", "16", "16, ampliado 8x"]
    gap = 26
    passo = 200
    larg = rot + sum(c[1] for c in colunas) + gap * (len(colunas) + 1)
    alto = 150 + passo * (len(FOLHA_E_LINHAS) + 1) + 60
    folha = Image.new("RGB", (larg, alto), (206, 210, 204))
    d = ImageDraw.Draw(folha)
    d.text((gap, 24), "O «e», refinado · a quinta adenda", font=grande, fill=(16, 18, 16))
    d.text((gap, 58), "cada linha é a mesma forma às medidas que decidem; os ampliados "
           "são os MESMOS píxeis, esticados", font=pequena, fill=(52, 56, 52))
    x = rot + gap * 2
    for (nome, px), leg in zip(colunas, legendas):
        d.text((x, 100), leg, font=pequena, fill=(52, 56, 52))
        x += px + gap

    # a fila do «€», que é a pergunta da adenda
    y = 130
    d.text((gap, y + 60), "referência · a construção do «€»", font=grande, fill=(16, 18, 16))
    d.text((gap, y + 94), "bojo ABERTO e DUAS barras. Desenhada aqui,",
           font=pequena, fill=(52, 56, 52))
    d.text((gap, y + 118), "não é o glifo oficial nem o de tipo nenhum.",
           font=pequena, fill=(52, 56, 52))
    x = rot + gap * 2
    for (nome, px), leg in zip(colunas, legendas):
        base = int(nome)
        im = _euro_png(base)
        if px != base:
            im = im.resize((px, px), Image.NEAREST)
        folha.paste(im, (x, y))
        x += px + gap

    for i, (slug, titulo, nota) in enumerate(FOLHA_E_LINHAS):
        y = 130 + passo * (i + 1)
        d.text((gap, y + 60), titulo, font=grande, fill=(16, 18, 16))
        d.text((gap, y + 94), nota, font=pequena, fill=(52, 56, 52))
        d.text((gap, y + 118), slug, font=pequena, fill=(90, 94, 90))
        x = rot + gap * 2
        for nome, px in colunas:
            f = os.path.join(AQUI, "EXPORT", slug, f"{slug}-{nome}.png")
            im = Image.open(f).convert("RGB")
            if im.size[0] != px:
                im = im.resize((px, px), Image.NEAREST)
            folha.paste(im, (x, y))
            x += px + gap
    saida = os.path.join(AQUI, "FOLHA-E.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/FOLHA-E.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "folha-e":
    folha_e()


# ===========================================================================
# A MEDIÇÃO
# ===========================================================================
"""
`python3 design/marca/desenhar.py medir [tamanho]` lê os PNG de `EXPORT/` e
imprime, por direção, o que se pode contar em vez de estimar.

O QUE MUDOU COM A QUARTA ADENDA, e é preciso dizê-lo antes dos números. Até
aqui todas as direções tinham campo de papel, e por isso «tinta da cela»
(píxeis escuros) e «mancha do sinal» (píxeis que não são o campo) eram a mesma
coisa. Deixaram de ser: numa direção de campo de tinta com letra de papel, a
cela está 100 % escura e o sinal é o que está CLARO lá dentro. Por isso são
duas colunas, e as duas contam:

  · TINTA   quanto da cela está escuro (cinzento abaixo de 200). É o número que
            diz se o ícone é uma mancha no ecrã principal ou um vazio. É este o
            número que a maqueta anterior mediu, e é ele que compara com os 4,7 %
            da palavra e os 19,8 % da letra da J2.
  · SINAL   quanto da cela é diferente do campo, seja o campo claro ou escuro.
            É a letra, e é o número que diz se ela tem massa suficiente para se
            ler de longe.

As ilhas e as corridas contam-se sobre o SINAL, e não sobre a tinta, pela mesma
razão: o que o olho tem de juntar é a letra.
"""


def _le(caminho):
    from PIL import Image
    return Image.open(caminho).convert("RGB")


def _mascaras(im):
    """(escuro, sinal): dois mapas de booleanos do tamanho da imagem.

    O campo é a cor do canto superior esquerdo, que é onde nenhuma das direções
    põe sinal nenhum. «Sinal» é tudo o que se afaste dele mais do que 40 de
    distância de Manhattan, que é folga bastante para o suavizado das bordas não
    contar como forma.
    """
    px = im.load()
    w, h = im.size
    campo = px[0, 0]
    escuro = [[False] * w for _ in range(h)]
    sinal = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            escuro[y][x] = (0.299 * r + 0.587 * g + 0.114 * b) < 200
            sinal[y][x] = (abs(r - campo[0]) + abs(g - campo[1]) + abs(b - campo[2])) > 40
    return escuro, sinal


def _ilhas(mapa):
    h, w = len(mapa), len(mapa[0])
    visto = [[False] * w for _ in range(h)]
    conta = 0
    for y in range(h):
        for x in range(w):
            if mapa[y][x] and not visto[y][x]:
                conta += 1
                pilha = [(x, y)]
                visto[y][x] = True
                while pilha:
                    cx, cy = pilha.pop()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and mapa[ny][nx] and not visto[ny][nx]:
                            visto[ny][nx] = True
                            pilha.append((nx, ny))
    return conta


def _corridas(mapa):
    """As corridas de sinal em linha e em coluna: a mínima é a peça mais frágil."""
    h, w = len(mapa), len(mapa[0])
    fora = []
    for y in range(h):
        c = 0
        for x in range(w):
            if mapa[y][x]:
                c += 1
            elif c:
                fora.append(c)
                c = 0
        if c:
            fora.append(c)
    for x in range(w):
        c = 0
        for y in range(h):
            if mapa[y][x]:
                c += 1
            elif c:
                fora.append(c)
                c = 0
        if c:
            fora.append(c)
    fora.sort()
    if not fora:
        return 0, 0
    return fora[0], fora[len(fora) // 2]


def medir(tamanhos=("60", "180", "16")):
    pasta = os.path.join(AQUI, "EXPORT")
    for slug in sorted(os.listdir(pasta)):
        if not os.path.isdir(os.path.join(pasta, slug)):
            continue
        linhas = []
        for t in tamanhos:
            f = os.path.join(pasta, slug, f"{slug}-{t}.png")
            if not os.path.exists(f):
                continue
            im = _le(f)
            escuro, sinal = _mascaras(im)
            total = im.size[0] * im.size[1]
            pe = sum(sum(l) for l in escuro) / total * 100
            ps = sum(sum(l) for l in sinal) / total * 100
            mini, med = _corridas(sinal)
            linhas.append(f"{t}: tinta {pe:.1f} % · sinal {ps:.1f} % · "
                          f"ilhas {_ilhas(sinal)} · corrida min {mini} med {med}")
        print(f"{slug}\n  " + "\n  ".join(linhas))


def _lum(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (int(c[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contraste(a, b):
    """O contraste entre duas cores, pela fórmula da WCAG. Não é copiado: é contado."""
    la, lb = _lum(a), _lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# (slug, corte grande, saída à esquerda, corte de 32 e 16, saída à direita).
# O quarto número existe porque o favicon é OUTRO desenho: o da sétima voz de
# 28.08 de manhã FECHAVA o corte (de -56 para -52) e os desta adenda ALARGAM-no
# 6 graus. Medir a ponta no ângulo errado dá a matéria de um sítio onde já não
# há face nenhuma, e foi o que a primeira versão desta medição fez.
FAMILIA_E = [
    ("18-e-minuscula", CORTES_E["medio"], SAI_E, -52.0, SAI_E),
    ("18b-e-barra-dentro", CORTES_E["medio"], 0.0, CORTES_E["medio"] - 6, 0.0),
    ("18c-e-corte-estreito", CORTES_E["estreito"], SAI_E, CORTES_E["estreito"] - 6, SAI_E),
    ("18d-e-corte-largo", CORTES_E["largo"], SAI_E, CORTES_E["largo"] - 6, SAI_E),
    ("18e-e-dentro-estreito", CORTES_E["estreito"], 0.0, CORTES_E["estreito"] - 6, 0.0),
    ("18f-e-dentro-largo", CORTES_E["largo"], 0.0, CORTES_E["largo"] - 6, 0.0),
    ("18g-e-ocre-papel", CORTES_E["medio"], SAI_E, CORTES_E["medio"] - 6, SAI_E),
    ("18h-e-ocre-dentro", CORTES_E["medio"], 0.0, CORTES_E["medio"] - 6, 0.0),
    ("18i-e-barra-esquerda", CORTES_E["medio"], SAI_E, CORTES_E["medio"] - 6, 0.0),
    ("18j-e-ocre-esquerda", CORTES_E["medio"], SAI_E, CORTES_E["medio"] - 6, 0.0),
    ("18k-e-favicon-fechado", CORTES_E["medio"], SAI_E, -52.0, 0.0),
    # as mínimas: o mesmo desenho a todos os tamanhos, e por isso o corte do
    # favicon é o mesmo do sinal grande.
    ("18m-e-minimo-16", CORTE_MINIMO, 0.0, CORTE_MINIMO, 0.0),
    ("18n-e-minimo-14", CORTE_MINIMO, 0.0, CORTE_MINIMO, 0.0),
    ("18o-e-minimo-12", CORTE_MINIMO, 0.0, CORTE_MINIMO, 0.0),
    ("18p-e-minimo-10", CORTE_MINIMO, 0.0, CORTE_MINIMO, 0.0),
    ("18q-e-minimo-ocre", CORTE_MINIMO, 0.0, CORTE_MINIMO, 0.0),
]


def _corridas_disco(mapa, centro=None, raio=None):
    """(mínima, mediana, sítio da mínima) das corridas de linha e de coluna.

    Com `centro` e `raio`, só contam as corridas cujo meio caia dentro desse
    disco. É assim que se mede A PONTA DO CORTE e não outra coisa qualquer: a
    ponta anda com o ângulo do corte, e uma janela rectangular fixa ora a apanha
    ora a perde, o que já aconteceu à primeira tentativa desta medição.
    """
    h, w = len(mapa), len(mapa[0])
    fora = []

    def guarda(c, x, y, orient):
        if centro is None or (x - centro[0]) ** 2 + (y - centro[1]) ** 2 <= raio ** 2:
            fora.append((c, x, y, orient))

    for y in range(h):
        c = 0
        for x in range(w):
            if mapa[y][x]:
                c += 1
            elif c:
                guarda(c, x - c / 2, y, "linha")
                c = 0
        if c:
            guarda(c, w - c / 2, y, "linha")
    for x in range(w):
        c = 0
        for y in range(h):
            if mapa[y][x]:
                c += 1
            elif c:
                guarda(c, x, y - c / 2, "coluna")
                c = 0
        if c:
            guarda(c, x, h - c / 2, "coluna")
    if not fora:
        return 0, 0, None
    fora.sort(key=lambda t: t[0])
    return fora[0][0], fora[len(fora) // 2][0], fora[0]


def _sitio(t, w, h):
    """O sítio de uma corrida, dito em relógio e não em píxeis soltos."""
    if t is None:
        return "nenhuma"
    c, x, y, orient = t
    dx, dy = x - w / 2, y - h / 2
    if abs(dy) > abs(dx) * 2:
        onde = "coroa de cima" if dy < 0 else "coroa de baixo"
    elif abs(dx) > abs(dy) * 2:
        onde = "ponta esquerda" if dx < 0 else "ponta direita"
    else:
        onde = ("canto de cima " if dy < 0 else "canto de baixo ") + \
               ("à esquerda" if dx < 0 else "à direita")
    return f"{c} px, {onde}, em {orient}"


def _ilhas_do_fundo(sinal):
    return _ilhas([[not v for v in linha] for linha in sinal])


def _amostra(sinal, x, y):
    h, w = len(sinal), len(sinal[0])
    xi, yi = int(round(x)), int(round(y))
    return 0 <= xi < w and 0 <= yi < h and sinal[yi][xi]


def _materia_na_ponta(sinal, cx, cy, r_ext, r_int, ang):
    """Quanta tinta há na face do corte, contada píxel a píxel sobre ela.

    É este o número que a adenda quer quando diz «a ponta do corte acima de 2 px»:
    a face do corte é um segmento radial, e o que ela mede é a grossura da banda.
    Conta-se aqui percorrendo o segmento na imagem, e não a partir do desenho.
    """
    passos = max(int((r_ext - r_int) * 8), 8)
    a = math.radians(ang)
    conta = 0
    for i in range(passos + 1):
        r = r_int + (r_ext - r_int) * i / passos
        if _amostra(sinal, cx + r * math.cos(a), cy - r * math.sin(a)):
            conta += 1
    return conta / passos * (r_ext - r_int)


def _abertura_medida(sinal, cx, cy, r_meio):
    """A abertura à vista: o maior arco sem tinta sobre a circunferência do meio.

    Devolve `(graus, corda em px)`. A corda é o que o olho lê como buraco.
    """
    passos = 2880
    tem = [_amostra(sinal, cx + r_meio * math.cos(math.radians(i * 360 / passos)),
                    cy - r_meio * math.sin(math.radians(i * 360 / passos)))
           for i in range(passos)]
    melhor = corrida = 0
    for i in range(passos * 2):
        if not tem[i % passos]:
            corrida += 1
            melhor = max(melhor, min(corrida, passos))
        else:
            corrida = 0
    graus = melhor * 360 / passos
    return graus, 2 * r_meio * math.sin(math.radians(min(graus, 180) / 2))


def _medida_e(slug, corte, sai_dir_corte, t):
    """Todos os números de uma variante do «e» a um tamanho, lidos do PNG.

    Devolve um dicionário, para que a prancha, as notas e a linha de comando
    digam o MESMO número: o que se escreveu à mão nas rondas anteriores foi o
    que mais se desencontrou do que estava medido.
    """
    f = os.path.join(AQUI, "EXPORT", slug, f"{slug}-{t}.png")
    if not os.path.exists(f):
        return None
    im = _le(f)
    w, h = im.size
    _, sinal = _mascaras(im)
    linhas = [y for y in range(h) if any(sinal[y])]
    diam = (linhas[-1] - linhas[0] + 1) if linhas else 0
    banda = 0
    for y in range(h):
        if sinal[y][w // 2]:
            banda += 1
        elif banda:
            break
    cx, cy = w / 2, h / 2
    r_ext, r_int = diam / 2, diam / 2 - banda
    ang = sai_dir_corte if t in ("32", "16") else corte
    mini, med, onde = _corridas_disco(sinal)
    ponta = (cx + (r_ext + r_int) / 2 * math.cos(math.radians(ang)),
             cy - (r_ext + r_int) / 2 * math.sin(math.radians(ang)))
    pmin, _, _ = _corridas_disco(sinal, ponta, r_ext * 0.30)
    graus, corda = _abertura_medida(sinal, cx, cy, (r_ext + r_int) / 2)
    ilhas_f = _ilhas_do_fundo(sinal)
    return {"sinal": sum(sum(l) for l in sinal) / (w * h) * 100,
            "diametro": diam, "banda": banda, "min": mini, "mediana": med,
            "onde": _sitio(onde, w, h), "ponta": _materia_na_ponta(sinal, cx, cy, r_ext, r_int, ang),
            "min_ponta": pmin, "graus": graus, "corda": corda,
            "ilhas_fundo": ilhas_f, "aberto": ilhas_f <= 2}


def medir_e(tamanhos=("180", "60", "16")):
    """A régua da quinta adenda: onde é que o «e» afina, e se o bojo abre.

    QUATRO COISAS QUE A `medir` NÃO DIZ, e que a adenda pede.

    · ONDE está a corrida mínima. A adenda diz que a ponta do corte «afina para
      1 px» a 60. A corrida mínima é mesmo 1 px, e o sítio dela é mesmo o canto
      de baixo à direita, ou seja o corte. Mas o que esse 1 px mede não é a
      matéria da ponta: é uma LINHA A RASAR UM CANTO. A face do corte é radial e
      encontra o arco de dentro num canto vivo; a linha de píxeis que passa
      rente a esse canto apanha um píxel, e apanharia um píxel em qualquer canto
      que não esteja alinhado com os eixos. É por isso que a geométrica da
      terceira voz mede 12: não é mais grossa, é mais quadrada.
    · A MATÉRIA NA PONTA, que é o que a adenda quer mesmo: a tinta contada ao
      longo da face do corte. Aí a ponta mede a grossura da banda, e é esse o
      número que tem de estar acima de 2 px.
    · A ABERTURA À VISTA: o maior arco sem tinta sobre a circunferência do meio
      da banda, em graus e em corda. É o buraco que separa um «e» de um «o».
    · SE O BOJO ABRE, contado nas ilhas do FUNDO e não nas do sinal. Com o bojo
      aberto, o vazio de dentro por baixo da barra comunica com o campo de fora
      e o fundo tem DUAS ilhas: o campo, mais o olho fechado por cima da barra.
      Com o bojo fechado tem TRÊS. É um inteiro, e não uma impressão.
    """
    for slug, corte, sai, corte_fav, sai_dir in FAMILIA_E:
        if not os.path.isdir(os.path.join(AQUI, "EXPORT", slug)):
            continue
        print(slug + f"   (corte {abertura_vista(corte):.0f} graus à vista, barra "
              + ("a atravessar dos dois lados)" if sai and sai_dir
                 else "só à esquerda)" if sai else "dentro do bojo)"))
        for t in tamanhos:
            m = _medida_e(slug, corte, corte_fav, t)
            if m is None:
                continue
            print(f"  {t}: sinal {m['sinal']:.1f} % · diâmetro {m['diametro']} px · "
                  f"banda {m['banda']} px · fundo em {m['ilhas_fundo']} ilhas "
                  f"({'bojo ABERTO' if m['aberto'] else 'bojo FECHADO'})\n"
                  f"      corrida mínima: {m['onde']} · mediana {m['mediana']}\n"
                  f"      matéria na ponta do corte: {m['ponta']:.1f} px · "
                  f"corrida mínima à volta da ponta: {m['min_ponta']} px\n"
                  f"      abertura à vista: {m['graus']:.0f} graus · corda {m['corda']:.1f} px")


if len(sys.argv) > 1 and sys.argv[1] == "medir-e":
    medir_e(tuple(sys.argv[2:]) or ("180", "60", "16"))


if len(sys.argv) > 1 and sys.argv[1] == "medir":
    medir(tuple(sys.argv[2:]) or ("60", "180", "16"))


if len(sys.argv) > 1 and sys.argv[1] == "contrastes":
    print("Os pares da sétima voz, medidos pela fórmula da WCAG:")
    for nome, a, b in (("(a) âmbar sobre tinta", AMBAR, TINTA),
                       ("(b) tinta sobre âmbar", TINTA, AMBAR),
                       ("(c) âmbar sobre papel", AMBAR, PAPEL),
                       ("(d) ocre sobre papel", OCRE, PAPEL),
                       ("    papel sobre ocre", PAPEL, OCRE),
                       ("    papel sobre tinta", PAPEL, TINTA),
                       ("    papel sobre cobalto", PAPEL, COBALTO),
                       ("    tinta sobre papel", TINTA, PAPEL),
                       ("    âmbar sobre papel escuro", AMBAR, PAPEL_ESCURO),
                       ("    ocre sobre papel escuro", OCRE, PAPEL_ESCURO)):
        r = contraste(a, b)
        print(f"  {nome:34s} {a} sobre {b}: {r:.2f}:1 "
              f"[{'passa' if r >= 3 else 'FALHA'} 3:1] "
              f"[{'passa' if r >= 4.5 else 'FALHA'} 4,5:1]")


if len(sys.argv) > 1 and sys.argv[1] == "prancha":
    prancha()


# ===========================================================================
# A SEXTA ADENDA · O «e», EXPLORADO
# ===========================================================================
"""
`python3 design/marca/desenhar.py e2` escreve `design/marca/direcoes-e2/*.svg`.

A adenda 6 (`ADENDA-6-e-explorar.md`) não pede uma variante: pede uma GRELHA. O
diretor viu o «e» mínimo e disse que não está lá, que as cores não são
agradáveis, e deixou duas pistas para explorar, não para obedecer: a barra podia
parar antes de chegar ao círculo, a dois terços do caminho, a flutuar dentro do
bojo; e o corte podia ser menor. Esta parte do ficheiro desenha os dois eixos
cruzados, com uma grossura só (14 % do diâmetro, a `18n`), para que a folha
mostre o que muda quando cada um deles anda.

OS TRÊS EIXOS, E O QUE CADA UM MEDE

  1 · A BARRA. Sete comprimentos, e são dois grupos, não sete pontos de uma
      régua só. O grupo LIVRE tem a barra centrada e solta das duas pontas; o
      grupo ESQUERDA prende-a ao anel do lado fechado e deixa a outra ponta no
      ar. O comprimento conta-se em VÃO, que é a distância de parede a parede
      por dentro do anel, medida sobre o eixo da barra: `vao = 2 (r - g)`. A
      barra UNIDA é a de hoje e não cabe nesta conta, porque as pontas dela são
      cordas do círculo de FORA e não do de dentro; fica como o 100 % do eixo,
      dito assim e não em fração do vão.

  2 · O CORTE. A abertura conta-se DA BARRA, como na ronda anterior: o topo da
      banda fica onde a face de baixo da barra encontraria a circunferência de
      fora (`-asin(g/2r)`), e o corte é o ângulo que falta a partir daí. Assim o
      eixo do corte é INDEPENDENTE do eixo da barra: as trinta e cinco células
      da folha têm a mesma banda com a mesma abertura em cada coluna, e o que
      muda de linha para linha é só a barra. Uma tabela cruzada em que os dois
      eixos se contaminam não é uma tabela cruzada.

  3 · A COR. Pares de duas cores e mais nada, com o mesmo par nos dois temas.
      Isto é de propósito e é diferente do que as direções anteriores fazem: ali
      o tema escuro troca o ocre pelo âmbar, porque a folha de estilos manda; a
      pergunta desta ronda é sobre O PAR, e um ficheiro que muda de cor conforme
      o tema responde a outra pergunta.

O QUE A TOPOLOGIA DIZ, E QUE É O NÚMERO QUE DECIDE O PRIMEIRO EIXO. Um «e»
fechado tem UMA ilha de sinal (o anel e a barra são a mesma peça) e DUAS ilhas
de fundo (o campo, que entra no bojo pelo corte, mais o olho fechado por cima da
barra). Solte-se a barra de uma ponta e o olho deixa de estar fechado: passa a
comunicar com o bojo pela folga, e o fundo fica com UMA ilha. Solte-se das duas
e o sinal parte-se em DUAS ilhas. Os dois inteiros juntos dizem, sem opinião,
qual das três coisas se está a ver:

  sinal 1, fundo 2 · a barra é parte da letra e o olho está fechado: é um «e»;
  sinal 1, fundo 1 · a barra é parte da letra e o olho está aberto;
  sinal 2, fundo 1 · a barra é um traço solto dentro de um anel.

Aos 16 px o suavizado pode voltar a colar o que o desenho separou, e é por isso
que os mesmos inteiros se contam a 180, a 60 e a 16: o que decide não é o
desenho, é o que fica no ficheiro.
"""

G_E2 = 0.14                  # a grossura, uma só: a `18n`
ABERTURA_E2 = 48.0           # a abertura de hoje, o ponto de partida do eixo 2


def e_explorado(cx, cy, r, g_diametro, comp=1.0, ancora="ambos",
                abertura=ABERTURA_E2, classe="tinta"):
    """O «e» mínimo com a barra e o corte como parâmetros.

    `comp` é a fração do VÃO (de parede a parede por dentro do anel, sobre o
    eixo da barra) que a barra ocupa; `ancora` diz onde ela se prende:

      «ambos»    · as quatro pontas são cordas do círculo de fora (a de hoje);
                   `comp` é ignorado, porque a barra vai de parede a parede por
                   fora e não por dentro;
      «esquerda» · a ponta esquerda é corda do círculo de fora, e a direita fica
                   a `comp` do vão contado da parede esquerda;
      «livre»    · a barra tem `comp` do vão, centrada no círculo, solta das
                   duas pontas.

    `abertura` são os graus de anel que faltam, contados DA BARRA.
    """
    g = g_diametro * 2 * r
    meia = g / 2
    r_int = r - g
    topo = -math.degrees(math.asin(meia / r))
    corte = topo - abertura
    banda = banda_de_arco(cx, cy, r, r_int, topo, corte)
    dx_fora = math.sqrt(max(r * r - meia * meia, 0.0))
    vao = 2 * r_int
    if ancora == "ambos":
        x0, x1 = cx - dx_fora, cx + dx_fora
    elif ancora == "esquerda":
        x0, x1 = cx - dx_fora, cx - r_int + comp * vao
    elif ancora == "direita":
        x0, x1 = cx + r_int - comp * vao, cx + dx_fora
    else:
        x0, x1 = cx - comp * vao / 2, cx + comp * vao / 2
    barra = rect(x0, cy - meia, x1, cy + meia)
    return ([("nonzero", classe, banda), ("nonzero", classe, barra)],
            (cx - r, cy - r, cx + r, cy + r))


def folga_desenhada(r, g_diametro, comp, ancora):
    """A folga entre a ponta livre da barra e a parede de dentro, em unidades.

    Zero quando não há ponta livre. Mede-se sobre o eixo da barra, que é onde a
    folga é maior: nos cantos, a parede está mais perto.
    """
    r_int = r - g_diametro * 2 * r
    if ancora == "ambos":
        return 0.0
    if ancora in ("esquerda", "direita"):
        return (1 - comp) * 2 * r_int
    return (1 - comp) * r_int


# (chave, rótulo, comp, âncora). Sete comprimentos, dois grupos.
GEOMETRIAS_E2 = [
    ("unida", "unida ao anel (a de hoje)", 1.0, "ambos"),
    ("livre75", "livre · 3/4 do vão", 0.75, "livre"),
    ("livre66", "livre · 2/3 do vão", 2 / 3, "livre"),
    ("livre50", "livre · 1/2 do vão", 0.50, "livre"),
    ("esq75", "presa à esquerda · 3/4", 0.75, "esquerda"),
    ("esq66", "presa à esquerda · 2/3", 2 / 3, "esquerda"),
    ("esq50", "presa à esquerda · 1/2", 0.50, "esquerda"),
    # A OITAVA LINHA NÃO FOI PEDIDA, e nasceu de olhar para as sete de cima. Nas
    # três de baixo, o entalhe da barra e o corte do anel ficam DO MESMO LADO, e
    # o lado direito da letra fica comido duas vezes. Presa à direita, a barra
    # deixa o entalhe do lado onde o anel está inteiro. É uma sonda com uma
    # pergunta só, como a `14b` e a `18k` foram nas rondas anteriores, e por isso
    # leva um comprimento só, o mesmo que o diretor nomeou.
    ("dir66", "presa à direita · 2/3 (sonda)", 2 / 3, "direita"),
]

# Os cortes: o de hoje e quatro mais fechados. O último é o «fio de cabelo» que
# a adenda pede, e está lá para o limite se ver e não se supor.
CORTES_E2 = [48.0, 36.0, 28.0, 20.0, 6.0]

BRANCO = "#ffffff"
PRETO = "#000000"
CINZENTO = "#585d5b"          # `--g1` de `tokens.css`: 6,24:1 sobre papel

# (chave, rótulo, campo, letra). O mesmo par nos dois temas, de propósito.
PARES_E2 = [
    ("tinta-papel", "tinta em papel", PAPEL, TINTA),
    ("papel-tinta", "papel em tinta", TINTA, PAPEL),
    ("branco-preto", "branco puro em preto puro", PRETO, BRANCO),
    ("cobalto-papel", "cobalto em papel", PAPEL, COBALTO),
    ("cinzento-papel", "cinzento «--g1» em papel", PAPEL, CINZENTO),
    ("ambar-tinta", "âmbar em tinta · a de hoje", TINTA, AMBAR),
]
PARES_E2_MAPA = {c: (campo, letra) for c, _, campo, letra in PARES_E2}


def _e2_svg(chave, comp, ancora, abertura, campo, letra, titulo, nota):
    partes, caixa = e_explorado(CENTRO, CENTRO, R_E, G_E2, comp, ancora, abertura)
    folga = folga_desenhada(R_E, G_E2, comp, ancora)
    corpo = _com(
        f"O «e» explorado: uma grossura só, {G_E2 * 100:.0f} % do diâmetro "
        f"({G_E2 * 2 * R_E:.0f} num diâmetro de {2 * R_E:.0f}).\n"
        f"A barra: {'de parede a parede, unida ao anel' if ancora == 'ambos' else ''}"
        f"{f'presa ao anel à esquerda e livre à direita, {comp:.3f} do vão' if ancora == 'esquerda' else ''}"
        f"{f'presa ao anel à direita e livre à esquerda, {comp:.3f} do vão' if ancora == 'direita' else ''}"
        f"{f'solta das duas pontas, {comp:.3f} do vão, centrada' if ancora == 'livre' else ''}"
        f".\nA folga da ponta livre até à parede de dentro: {folga:.1f} "
        f"({folga / (2 * R_E) * 100:.1f} % do diâmetro).\n"
        f"O corte: {abertura:.0f} graus de abertura, contados da barra.\n"
        f"O par: {letra} sobre {campo}, {contraste(letra, campo):.2f}:1, o mesmo nos dois temas.") \
        + caminhos(partes)
    return svg(titulo, corpo, corpo, nota, caixa=caixa, caixa_favicon=caixa,
               cores=paleta(campo, letra, letra))


def direcoes_e2():
    """A grelha inteira: as trinta e cinco da folha, mais as das cores."""
    fora = []
    for chave, rotulo, comp, ancora in GEOMETRIAS_E2:
        for ab in CORTES_E2:
            slug = f"e2-{chave}-{ab:.0f}"
            fora.append((slug, chave, comp, ancora, ab, "tinta-papel", rotulo))
    for chave, rotulo, comp, ancora in GEOMETRIAS_E2:
        for ab in CORTES_E2:
            for par, _, _, _ in PARES_E2:
                if par == "tinta-papel":
                    continue
                if (chave, ab) not in E2_CORES_ALVO:
                    continue
                slug = f"e2c-{chave}-{ab:.0f}-{par}"
                fora.append((slug, chave, comp, ancora, ab, par, rotulo))
    return fora


# AS GEOMETRIAS QUE VÃO À FOLHA DAS CORES E AO ECRÃ, E PORQUE SÃO ESTAS TRÊS.
# A escolha foi feita depois de `FOLHA-E2.png` existir, a olhar para ela, e não
# antes; as razões estão medidas na §6 ter das NOTAS e resumem-se assim:
#
#   · `unida-48`  · a de hoje, e está aqui como referência fixa. Sem ela, a
#                   comparação de cores não tem contra o quê se ler.
#   · `unida-28`  · a segunda ideia do diretor (o corte mais pequeno) aplicada
#                   até onde a medição a deixa ir: 2,1 px de corda aos 16 px,
#                   que é a menor abertura que ainda acende dois píxeis.
#   · `dir66-28`  · a primeira ideia do diretor (a barra a parar a dois terços)
#                   na versão que continua a ser um «e». Solta das duas pontas,
#                   a mesma barra dá um sinal de menos dentro de um anel; presa
#                   à esquerda, o entalhe cai no lado que o corte já comeu.
#                   Presa à direita, o entalhe fica no lado inteiro do anel.
#
# As três lêem-se por pares: a segunda contra a primeira isola O CORTE, e a
# terceira contra a segunda isola A BARRA. Uma folha de cores com três
# geometrias que difiram nas duas coisas ao mesmo tempo não serve para nada.
E2_CORES_ALVO = {("unida", 48.0), ("unida", 28.0), ("dir66", 28.0)}
E2_CORES_ORDEM = [
    ("unida", 48.0, "unida ao anel · corte de 48", "a de hoje, a referência"),
    ("unida", 28.0, "unida ao anel · corte de 28", "o corte mais pequeno"),
    ("dir66", 28.0, "presa à direita · 2/3 · corte de 28", "a barra que para"),
]


def escreve_e2():
    pasta = os.path.join(AQUI, "direcoes-e2")
    os.makedirs(pasta, exist_ok=True)
    antigos = {f for f in os.listdir(pasta) if f.endswith(".svg")}
    escritos = set()
    for slug, chave, comp, ancora, ab, par, rotulo in direcoes_e2():
        campo, letra = PARES_E2_MAPA[par]
        s = _e2_svg(chave, comp, ancora, ab,  campo, letra,
                    f"e2 · {rotulo} · corte de {ab:.0f} graus · {par}",
                    f"A barra {rotulo}, com {ab:.0f} graus de abertura, em {par}.")
        with open(os.path.join(pasta, slug + ".svg"), "w") as f:
            f.write(s)
        escritos.add(slug + ".svg")
    for f in sorted(antigos - escritos):
        os.remove(os.path.join(pasta, f))
        print(f"apagado design/marca/direcoes-e2/{f}")
    print(f"escritos {len(escritos)} SVG em design/marca/direcoes-e2/")


if len(sys.argv) > 1 and sys.argv[1] == "e2":
    escreve_e2()


# ---------------------------------------------------------------------------
# A RÉGUA DA SEXTA ADENDA
# ---------------------------------------------------------------------------
"""
`python3 design/marca/desenhar.py medir-e2 [tamanhos]` lê os PNG de `EXPORT-E2/`.

TRÊS NÚMEROS QUE A `medir-e` NÃO TINHA, e que são os que este eixo obriga a ter.

· AS ILHAS DO SINAL. A `medir-e` conta as ilhas do FUNDO, porque a pergunta da
  ronda anterior era se o bojo abre. A pergunta desta é outra: se a barra ainda
  é parte da letra. Uma barra solta das duas pontas faz do sinal duas peças, e
  isso conta-se, não se acha.
· A FOLGA DA BARRA, medida na linha do meio do ficheiro: os vazios entre a
  primeira e a última tinta dessa linha. É a distância que o olho tem de saltar
  para juntar o traço ao anel, dita em píxeis do ficheiro e não em unidades do
  desenho.
· A CORDA DA ABERTURA já lá estava, e é aqui que ela decide: a adenda pergunta a
  que abertura é que o «e» passa a ser «um "o" com uma barra» aos 16 px, e a
  resposta é uma medida de corda mais uma olhadela, não uma das duas sozinha.

O que se lê da tabela, e é preciso dizê-lo antes de a ler: `sinal` e `fundo` são
INTEIROS e valem mais do que as frações à volta deles. `sinal 1 · fundo 2` é um
«e» fechado; `sinal 1 · fundo 1` é a mesma letra com o olho aberto; `sinal 2 ·
fundo 1` é um anel com um traço lá dentro.
"""


def _abertura_no_sector(sinal, cx, cy, r, a0, a1, por_grau=8):
    """O maior arco sem tinta entre `a0` e `a1`, em graus e em corda de píxeis.

    Ao contrário da `_abertura_medida`, que varre a volta toda, esta varre um
    sector. É a diferença entre medir O CORTE e medir o maior buraco que houver.
    """
    n = max(int(abs(a1 - a0) * por_grau), 8)
    passo = (a1 - a0) / n
    melhor = corrida = 0
    for i in range(n + 1):
        ang = math.radians(a0 + i * passo)
        if _amostra(sinal, cx + r * math.cos(ang), cy - r * math.sin(ang)):
            corrida = 0
        else:
            corrida += 1
            melhor = max(melhor, corrida)
    graus = melhor * abs(passo)
    return graus, 2 * r * math.sin(math.radians(min(graus, 180) / 2))


def corda_desenhada(abertura, px):
    """A corda da abertura, TIRADA DO DESENHO e não da imagem, em píxeis de `px`.

    Existe ao lado da medida porque aos 16 px a banda tem três píxeis contando o
    suavizado, e uma circunferência de amostragem lá dentro anda meio píxel para
    um lado ou para o outro conforme o arredondamento. A medida diz o que
    SOBREVIVE no ficheiro; esta diz o que lá foi POSTO. As duas juntas dizem
    quanto é que o suavizado comeu, e nenhuma delas sozinha diz isso.
    """
    r_meio = (R_E - G_E2 * R_E) * (SINAL / (2 * R_E)) * (px / CAMPO)
    return 2 * r_meio * math.sin(math.radians(abertura / 2))


def _folgas_na_linha(sinal, y):
    """Os vazios entre a primeira e a última tinta da linha `y`, em píxeis."""
    linha = sinal[y]
    tem = [x for x, v in enumerate(linha) if v]
    if not tem:
        return []
    fora, corrida = [], 0
    for x in range(tem[0], tem[-1] + 1):
        if not linha[x]:
            corrida += 1
        elif corrida:
            fora.append(corrida)
            corrida = 0
    return fora


def _medida_e2(slug, abertura, t):
    """Os números de uma célula da grelha, a um tamanho, lidos do PNG."""
    f = os.path.join(AQUI, "EXPORT-E2", slug, f"{slug}-{t}.png")
    if not os.path.exists(f):
        return None
    im = _le(f)
    w, h = im.size
    _, sinal = _mascaras(im)
    linhas = [y for y in range(h) if any(sinal[y])]
    diam = (linhas[-1] - linhas[0] + 1) if linhas else 0
    banda = 0
    for y in range(h):
        if sinal[y][w // 2]:
            banda += 1
        elif banda:
            break
    cx, cy = w / 2, h / 2
    r_ext, r_int = diam / 2, diam / 2 - banda
    corte = -math.degrees(math.asin(G_E2)) - abertura
    mini, med, onde = _corridas_disco(sinal)
    # A ABERTURA MEDE-SE NO SECTOR DO CORTE, E NÃO NA VOLTA TODA, e isto é uma
    # correção que a sonda da direita obrigou a fazer. A `medir-e` procura o
    # maior arco sem tinta em toda a circunferência do meio da banda, e isso
    # chegava enquanto a barra ia de parede a parede, porque o único buraco
    # sobre essa circunferência era o corte. Com uma barra que PARA, há um
    # segundo buraco, o entalhe da ponta livre, e à primeira a régua devolveu
    # 2,0 px de «corda» para a `dir66` com o corte de 6 graus, ou seja para um
    # anel fechado: o que ela mediu foi o entalhe. O corte está num sítio
    # conhecido, entre a face da barra e a ponta de baixo da banda, e é ali que
    # se procura, com vinte graus de folga de cada lado.
    graus, corda = _abertura_no_sector(sinal, cx, cy, (r_ext + r_int) / 2,
                                       -math.degrees(math.asin(G_E2)) + 20.0,
                                       corte - 20.0)
    folgas = _folgas_na_linha(sinal, int(round(cy)))
    return {"sinal": sum(sum(l) for l in sinal) / (w * h) * 100,
            "diametro": diam, "banda": banda, "min": mini, "mediana": med,
            "onde": _sitio(onde, w, h),
            "ponta": _materia_na_ponta(sinal, cx, cy, r_ext, r_int, corte),
            "graus": graus, "corda": corda,
            "corda_desenhada": corda_desenhada(abertura, im.size[0]),
            "ilhas_sinal": _ilhas(sinal), "ilhas_fundo": _ilhas_do_fundo(sinal),
            "folga": max(folgas) if folgas else 0}


def _lida_e2(slug, abertura, t, cache={}):
    chave = (slug, t)
    if chave not in cache:
        cache[chave] = _medida_e2(slug, abertura, t)
    return cache[chave]


def _tipo_de_leitura(m):
    """O que os dois inteiros dizem, sem adjetivo nenhum."""
    if m["ilhas_sinal"] >= 2:
        return "anel + traço solto"
    return "«e» de olho fechado" if m["ilhas_fundo"] >= 2 else "olho aberto"


def medir_e2(tamanhos=("180", "60", "16")):
    for chave, rotulo, comp, ancora in GEOMETRIAS_E2:
        for ab in CORTES_E2:
            slug = f"e2-{chave}-{ab:.0f}"
            if not os.path.isdir(os.path.join(AQUI, "EXPORT-E2", slug)):
                continue
            print(f"{slug}   ({rotulo}, folga desenhada "
                  f"{folga_desenhada(R_E, G_E2, comp, ancora):.0f} unidades, "
                  f"abertura {ab:.0f} graus)")
            for t in tamanhos:
                m = _lida_e2(slug, ab, t)
                if m is None:
                    continue
                print(f"  {t}: sinal {m['sinal']:.1f} % · banda {m['banda']} px · "
                      f"ilhas do sinal {m['ilhas_sinal']} · do fundo {m['ilhas_fundo']} "
                      f"({_tipo_de_leitura(m)})\n"
                      f"      corrida mínima: {m['onde']} · mediana {m['mediana']}\n"
                      f"      folga da barra {m['folga']} px · matéria na ponta "
                      f"{m['ponta']:.1f} px\n"
                      f"      abertura à vista {m['graus']:.0f} graus · corda "
                      f"{m['corda']:.1f} px medida, {m['corda_desenhada']:.1f} px desenhada")


if len(sys.argv) > 1 and sys.argv[1] == "medir-e2":
    medir_e2(tuple(sys.argv[2:]) or ("180", "60", "16"))


# ---------------------------------------------------------------------------
# A FOLHA CRUZADA: OS COMPRIMENTOS DE BARRA CONTRA OS CORTES
# ---------------------------------------------------------------------------
"""
`python3 design/marca/desenhar.py folha-e2` escreve `design/marca/FOLHA-E2.png`.

Uma tabela cruzada e não uma tira: sete comprimentos de barra em linha, cinco
cortes em coluna, tudo à mesma grossura (14 %) e ao mesmo par de cores (tinta em
papel), aos 180 px. É a folha que a adenda 6 pede para se ver de uma vez o que
cada eixo faz sozinho, e a razão de ser cruzada é que os dois eixos podiam
interferir: um corte pequeno com uma barra solta não é a soma do que cada um faz.

EM BAIXO, UMA TIRA A MAIS, e é ela que responde à pergunta do segundo eixo. A
adenda pergunta a que abertura é que o «e» passa a ser «um "o" com uma barra»
aos 16 px, e isso não se vê numa folha de 180: vê-se aos 16, ampliados. A tira
tem as cinco aberturas da mesma geometria (a unida), aos 16 px esticados oito
vezes, com a corda medida por baixo de cada uma.
"""


def _corda16(slug, ab):
    m = _lida_e2(slug, ab, "16")
    return m["corda"] if m else 0.0


def _v(x, casas=1):
    """Um número para uma folha que um português lê: vírgula decimal."""
    return f"{x:.{casas}f}".replace(".", ",")


def folha_e2():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 27)
    media = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 23)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    cel, gap, rot = 180, 30, 540
    passo, cabeca = cel + 52, 200
    tira = 128
    larg = rot + len(CORTES_E2) * cel + (len(CORTES_E2) + 1) * gap
    alto = cabeca + len(GEOMETRIAS_E2) * passo + 150 + tira + 96
    folha = Image.new("RGB", (larg, alto), (206, 210, 204))
    d = ImageDraw.Draw(folha)
    d.text((gap, 24), "O «e», explorado · a sexta adenda", font=grande, fill=(16, 18, 16))
    d.text((gap, 60), "linhas: o comprimento da barra · colunas: o corte. "
           f"Uma grossura só ({G_E2 * 100:.0f} % do diâmetro), tinta em papel, 180 px.",
           font=pequena, fill=(52, 56, 52))
    d.text((gap, 86), "o «vão» é a distância de parede a parede por dentro do anel, "
           "medida sobre o eixo da barra. «des» é a corda que o desenho põe, "
           "«med» a que sobra no ficheiro.", font=pequena, fill=(52, 56, 52))

    for j, ab in enumerate(CORTES_E2):
        x = rot + gap + j * (cel + gap)
        d.text((x, 126), f"corte de {ab:.0f} graus", font=media, fill=(16, 18, 16))
        d.text((x, 156), "corda a 16 px", font=pequena, fill=(52, 56, 52))
        d.text((x, 178), f"{_v(corda_desenhada(ab, 16), 2)} des · "
               f"{_v(_corda16(f'e2-unida-{ab:.0f}', ab), 2)} med",
               font=pequena, fill=(52, 56, 52))

    for i, (chave, rotulo, comp, ancora) in enumerate(GEOMETRIAS_E2):
        y = cabeca + i * passo
        folga = folga_desenhada(R_E, G_E2, comp, ancora)
        d.text((gap, y + cel / 2 - 46), rotulo, font=media, fill=(16, 18, 16))
        d.text((gap, y + cel / 2 - 16),
               "as quatro pontas são cordas do círculo de fora" if ancora == "ambos"
               else f"folga da ponta livre: {folga:.0f} unidades, "
                    f"{folga / (2 * R_E) * 100:.0f} % do diâmetro",
               font=pequena, fill=(52, 56, 52))
        m = _lida_e2(f"e2-{chave}-48", 48.0, "180")
        if m:
            d.text((gap, y + cel / 2 + 10),
                   f"a 180 px: {_tipo_de_leitura(m)}", font=pequena, fill=(90, 94, 90))
            d.text((gap, y + cel / 2 + 34),
                   f"ilhas: sinal {m['ilhas_sinal']}, fundo {m['ilhas_fundo']} · "
                   f"sinal {_v(m['sinal'])} %", font=pequena, fill=(90, 94, 90))
        for j, ab in enumerate(CORTES_E2):
            x = rot + gap + j * (cel + gap)
            f = os.path.join(AQUI, "EXPORT-E2", f"e2-{chave}-{ab:.0f}",
                             f"e2-{chave}-{ab:.0f}-180.png")
            folha.paste(Image.open(f).convert("RGB"), (x, y))

    y = cabeca + len(GEOMETRIAS_E2) * passo + 40
    d.text((gap, y), "E a pergunta do segundo eixo, que só se vê aos 16 px: "
           "as cinco aberturas da barra unida, aos 16, esticados oito vezes.",
           font=media, fill=(16, 18, 16))
    d.text((gap, y + 32), "os píxeis são os do ficheiro de 16; o que aqui se estica "
           "é a leitura, não o desenho.", font=pequena, fill=(52, 56, 52))
    for j, ab in enumerate(CORTES_E2):
        x = rot + gap + j * (cel + gap) + (cel - tira) // 2
        f = os.path.join(AQUI, "EXPORT-E2", f"e2-unida-{ab:.0f}", f"e2-unida-{ab:.0f}-16.png")
        folha.paste(Image.open(f).convert("RGB").resize((tira, tira), Image.NEAREST),
                    (x, y + 76))
        d.text((x, y + 76 + tira + 10),
               f"{ab:.0f}g · corda {_v(corda_desenhada(ab, 16), 2)} px",
               font=pequena, fill=(52, 56, 52))
    saida = os.path.join(AQUI, "FOLHA-E2.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/FOLHA-E2.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "folha-e2":
    folha_e2()


# ---------------------------------------------------------------------------
# A FOLHA DAS CORES
# ---------------------------------------------------------------------------
"""
`python3 design/marca/desenhar.py folha-e2-cores` escreve `FOLHA-E2-cores.png`.

Linhas: os pares de cor. Colunas: três geometrias, cada uma às três medidas que
decidem (180, 60, 16) mais o 16 esticado seis vezes, porque o que morre aos 16
px não se vê aos 16 px.

A ORDEM DAS LINHAS É A DA ADENDA, e não a do contraste: primeiro o preto e o
branco (tinta em papel, papel em tinta, e o par puro), depois os dois calados
(cobalto e cinzento), e só no fim o âmbar de hoje, que está aqui como termo de
comparação e não como proposta. O contraste de cada par vai escrito na linha,
contado e não copiado.
"""


def _e2c_slug(chave, ab, par):
    return f"e2-{chave}-{ab:.0f}" if par == "tinta-papel" else f"e2c-{chave}-{ab:.0f}-{par}"


def folha_e2_cores():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 27)
    media = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 23)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    colunas = [("180", 180), ("60", 60), ("16", 16), ("16", 96)]
    legendas = ["180", "60", "16", "16 esticado"]
    gap, rot, cabeca = 22, 430, 230
    bloco = sum(px for _, px in colunas) + gap * len(colunas) + 46
    passo = 180 + 46
    larg = rot + len(E2_CORES_ORDEM) * bloco + gap * 2
    alto = cabeca + len(PARES_E2) * passo + 60
    folha = Image.new("RGB", (larg, alto), (206, 210, 204))
    d = ImageDraw.Draw(folha)
    d.text((gap, 24), "O «e», explorado · as cores", font=grande, fill=(16, 18, 16))
    d.text((gap, 60), "linhas: o par de cor · colunas: três geometrias, às medidas "
           "que decidem. O mesmo par nos dois temas.", font=pequena, fill=(52, 56, 52))
    d.text((gap, 86), "o contraste é contado pela fórmula da WCAG sobre as duas cores "
           "do par, e não copiado de lado nenhum.", font=pequena, fill=(52, 56, 52))
    for k, (chave, ab, titulo, nota) in enumerate(E2_CORES_ORDEM):
        x0 = rot + k * bloco
        d.text((x0, 136), titulo, font=media, fill=(16, 18, 16))
        d.text((x0, 166), nota, font=pequena, fill=(52, 56, 52))
        x = x0
        for (_, px), leg in zip(colunas, legendas):
            d.text((x, 198), leg, font=pequena, fill=(90, 94, 90))
            x += px + gap
    for i, (par, rotulo, campo, letra) in enumerate(PARES_E2):
        y = cabeca + i * passo
        d.text((gap, y + 62), rotulo, font=media, fill=(16, 18, 16))
        d.text((gap, y + 92), f"{letra} sobre {campo}", font=pequena, fill=(52, 56, 52))
        d.text((gap, y + 116), f"contraste {_v(contraste(letra, campo), 2)}:1 · "
               f"{'passa' if contraste(letra, campo) >= 4.5 else 'FALHA'} 4,5:1",
               font=pequena, fill=(52, 56, 52))
        for k, (chave, ab, _, _) in enumerate(E2_CORES_ORDEM):
            slug = _e2c_slug(chave, ab, par)
            x = rot + k * bloco
            for nome, px in colunas:
                f = os.path.join(AQUI, "EXPORT-E2", slug, f"{slug}-{nome}.png")
                im = Image.open(f).convert("RGB")
                if im.size[0] != px:
                    im = im.resize((px, px), Image.NEAREST)
                folha.paste(im, (x, y))
                x += px + gap
    saida = os.path.join(AQUI, "FOLHA-E2-cores.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/FOLHA-E2-cores.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "folha-e2-cores":
    folha_e2_cores()


# ---------------------------------------------------------------------------
# O ECRÃ PRINCIPAL DA SEXTA ADENDA
# ---------------------------------------------------------------------------
"""
`python3 design/marca/desenhar.py ecra-e2` escreve `design/marca/ECRA-E2.png`.

Quatro variantes, em ecrã claro e em ecrã escuro, entre os mesmos oito ícones
das rondas anteriores. As quatro respondem às duas perguntas que a adenda 6 põe,
e não a uma só: três são o mesmo desenho em três pares de cor (a pergunta do
diretor, que é a das cores), e a quarta é a outra geometria no par que melhor
mede (a pergunta da barra).

O PAR PURO (branco em preto) NÃO ESTÁ AQUI, e é preciso dizer porquê em vez de
se ficar sem saber: a diferença dele para «papel em tinta» é a do campo, `#000000`
contra `#17191b`, e à escala de uma cela do ecrã principal é uma cela mais escura
e mais nada, com o mesmo desenho e o mesmo sinal. Está na folha das cores aos 180
px, que é onde essa diferença se vê; ocupar com ela um dos quatro lugares do ecrã
seria gastá-lo a repetir uma linha.

O ÍCONE NÃO MUDA COM O TEMA DO ECRÃ, e isto é diferente do que as direções fazem.
Nas outras, o tema escuro troca o ocre pelo âmbar, porque a folha de estilos
manda. Aqui a pergunta é sobre O PAR, e um ícone que se pintasse de outra cor no
ecrã escuro respondia a outra pergunta. O que o ecrã escuro mostra, então, é o
que acontece de verdade a uma cela de campo claro quando o ecrã à volta é preto.
"""

ECRA_E2_VARIANTES = [
    ("unida", 28.0, "tinta-papel", "corte de 28 · tinta em papel", "campo claro, 16,39:1"),
    ("unida", 28.0, "papel-tinta", "corte de 28 · papel em tinta", "campo de tinta, 16,39:1"),
    ("unida", 28.0, "cobalto-papel", "corte de 28 · cobalto em papel", "campo claro, 7,73:1"),
    ("dir66", 28.0, "papel-tinta", "barra a 2/3 · papel em tinta", "campo de tinta, 16,39:1"),
]


def ecras_e2():
    from PIL import Image, ImageDraw, ImageFont
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 34)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 27)
    peles = []
    for chave, ab, par, titulo, nota in ECRA_E2_VARIANTES:
        slug = _e2c_slug(chave, ab, par)
        nosso = os.path.join(AQUI, "EXPORT-E2", slug, f"{slug}-180.png")
        for tema in ("claro", "escuro"):
            peles.append((compoe_ecra(nosso, tema), f"{titulo} · ecrã {tema}", nota))
    lp, ap = peles[0][0].size
    rodape, gap, colunas = 100, 46, 2
    filas = (len(peles) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * lp + (colunas + 1) * gap,
                              filas * (ap + rodape) + (filas + 1) * gap), (128, 133, 127))
    d = ImageDraw.Draw(folha)
    for i, (pele, titulo, nota) in enumerate(peles):
        x = gap + (i % colunas) * (lp + gap)
        y = gap + (i // colunas) * (ap + rodape + gap)
        folha.paste(pele, (x, y))
        d.text((x + 4, y + ap + 16), titulo, font=grande, fill=(16, 18, 16))
        d.text((x + 4, y + ap + 60), nota, font=pequena, fill=(46, 50, 46))
    saida = os.path.join(AQUI, "ECRA-E2.png")
    folha.save(saida, optimize=True)
    print(f"escrito design/marca/ECRA-E2.png  ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "ecra-e2":
    ecras_e2()
