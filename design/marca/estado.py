#!/usr/bin/env python3
"""
A PALAVRA «estado», EM MINÚSCULAS: as letras desenhadas das duas construções.

A sétima adenda (`ADENDA-7-estado-minusculo.md`) põe uma pergunta de nome e uma
de desenho ao mesmo tempo: se o título do sítio passar a ser a palavra «estado»
em minúsculas, com que letras é que ela se escreve. A 7b (`ADENDA-7b.md`) tirou
de cima da mesa a resposta mais barata: o «e» da marca ao lado do nome sai, e
com ele sai a hipótese de a palavra ser só texto composto com um sinal ao lado.

ESTE PROGRAMA ESCREVE `design/marca/estado/*.svg` e mais nada. São seis letras
por construção, desenhadas ponto a ponto, sem contorno de tipo nenhum lá dentro.
A construção 3 não está aqui, e é de propósito: ela é a palavra composta em
Spectral, e um programa que a desenhasse deixaria de ser o controlo.

    python3 design/marca/estado.py            os SVG das duas construções
    python3 design/marca/estado.py folhas     as folhas, dos PNG já exportados
    python3 design/marca/estado.py medir      a régua dos PNG de ícone

A RÉGUA COMUM DAS TRÊS CONSTRUÇÕES, e ela é a razão de os números baterem certo
no cabeçalho. Tudo se conta em milésimos de em, que é a unidade em que o
ficheiro do Spectral está feito (`unitsPerEm` 1000, lido do ficheiro da casa):

    ascendente          750    o topo da tinta do «d» do Spectral Regular
    saliência           10     o quanto as redondas passam da linha de base
    caixa de tinta      760    ascendente + saliência, ou seja 0,76 em

E 760 não é um número escolhido: é a caixa de tinta que o cabeçalho de hoje já
tem. «O Estado do País» leva um «d» (750) e um «o» (que desce a −10), e por isso
a marca de hoje mede 0,76 em de alto; a 34 px de corpo dá 25,8 px, que são os
26 px medidos na §5 das NOTAS. A palavra «estado» leva o mesmo «d» e o mesmo
«o». **Se as letras desenhadas respeitarem esta caixa, a caixa de tinta do
cabeçalho não muda com o nome.** É a única maneira de a pergunta do diretor se
poder responder sem mexer no cabeçalho, e é por isso que as duas construções
partem daqui em vez de partirem de uma altura de x escolhida.
"""

import math
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

# O `sys.argv` É ESVAZIADO DURANTE A IMPORTAÇÃO, e não é um truque: `desenhar.py`
# despacha os seus comandos ao NÍVEL DO MÓDULO (`if sys.argv[1] == "medir": …`),
# que é a forma que ele tem desde a primeira sessão. Importá-lo com um argumento
# na linha de comandos faz correr o comando dele com o nome do nosso, e foi o que
# aconteceu à primeira: `estado.py medir` foi parar ao `medir` das direções e
# morreu à procura de uma pasta `EXPORT/` que este ramo não tem. Guarda-se,
# esvazia-se, importa-se, devolve-se.
_ARGV, sys.argv = sys.argv, sys.argv[:1]
from desenhar import (  # noqa: E402  (o caminho tem de ser posto antes)
    PAPEL, TINTA, PAPEL_ESCURO, TINTA_ESCURA,
    n, rect, elipse, anel, banda_de_arco, circunferencia,
    espinha, une, _pt,
)
sys.argv = _ARGV

SAIDA = os.path.join(AQUI, "estado")

# ---------------------------------------------------------------------------
# A RÉGUA COMUM
# ---------------------------------------------------------------------------
EM = 1000.0
ASCENDENTE = 750.0        # o «d» do Spectral Regular, medido no ficheiro da casa
SALIENCIA = 10.0          # o que as redondas do Spectral passam da base
CAIXA_TINTA = ASCENDENTE + SALIENCIA      # 760, a caixa do cabeçalho de hoje

# ---------------------------------------------------------------------------
# CONSTRUÇÃO 1 · A GEOMÉTRICA, DO CÍRCULO DA MARCA
# ---------------------------------------------------------------------------
# A adenda fixa duas coisas: o círculo da altura de x, e a grossura a 14 % do
# diâmetro desse círculo, que é a recomendação da §6 bis. O que ela deixa em
# aberto é a altura de x, e essa sai da régua de cima: com a ascendente presa
# aos 750, a altura de x é a única medida livre.
#
# 470 EM 760, ou seja 0,618 da caixa de tinta. Uma geométrica monolinear tem a
# altura de x alta (o Futura anda nos 0,63 da ascendente; a Avenir nos 0,65) e o
# Spectral da casa tem-na baixa (450 em 750, ou seja 0,60). 470 fica entre os
# dois e é a mais alta que a caixa permite sem a palavra ficar sem ascendentes à
# vista: com 470 de altura de x, o «t» e o «d» ainda sobem 290 e 280 acima dela.
G1_XH = 470.0
G1_G = 0.14 * G1_XH       # 65,8: a grossura, 14 % do diâmetro do círculo
G1_T = 620.0              # o topo do «t», entre a altura de x e a ascendente
G1_ESPACO = 0.125 * G1_XH # o ar entre a tinta de duas letras

# A BARRA DO «e» NÃO ESTÁ NO MEIO, e a marca está. É a primeira coisa em que
# esta letra se afasta do sinal de hoje, e afasta-se por ser uma letra dentro de
# uma palavra: com a barra a meio, o olho de cima fica igual ao vão de baixo e a
# letra lê-se como um símbolo simétrico; com a barra a 0,54 da altura de x, o
# olho fecha e o vão abre, que é o que um «e» faz.
G1_BARRA = 0.54

# E O REMATE É CORTADO A DIREITO, NA HORIZONTAL. A regra da casa (§4 das NOTAS)
# diz «remates cortados a direito, no horizontal ou no vertical, nunca em
# ângulo», e o corte da marca de hoje é RADIAL, ou seja em ângulo: aponta ao
# centro. O sinal podia dar-se ao luxo de o ser, porque é um sinal; uma letra
# dentro de um alfabeto da casa não pode. O remate desta corta na horizontal, e
# a abertura passa a ser um entalhe de duas faces paralelas.
G1_CORTE = -30.0          # o ângulo onde a banda acaba, no quadrante de baixo à direita

# ---------------------------------------------------------------------------
# CONSTRUÇÃO 2 · A HUMANISTA
# ---------------------------------------------------------------------------
# A adenda deixa o esqueleto do Spectral guiar as proporções, e é o que se faz:
# a altura de x e a ascendente são as do ficheiro da casa (450 e 750, tabela
# `OS/2` e o contorno do «d»), com a mesma saliência de 10. O que não é do
# Spectral é a grossura: uma serifada tira peso das serifas, e uma sem serifas
# tem de o ter no traço. A haste do «d» do Spectral Regular mede 68,9; esta leva
# 72, e o fino 44, o que dá contraste 1,64 contra os 2,62 do «O» do SemiBold.
G2_XH = 450.0
G2_SALIENCIA = 10.0
G2_T = 72.0               # a haste
G2_t = 44.0               # o fino
G2_TOPO_T = 560.0         # o topo do «t», que é o do «t» do Spectral
G2_ESPACO = 0.130 * G2_XH
G2_EIXO = 8.0             # a inclinação do eixo, em graus: é o que a torna humanista


# ---------------------------------------------------------------------------
# AS PEÇAS QUE FALTAVAM
# ---------------------------------------------------------------------------
def amostra_arco(cx, cy, r, a1, a2, k=120):
    """Um arco amostrado ponto a ponto, para as penas passarem por cima.

    Os ângulos são os do resto do ficheiro: 0 à direita, positivo para cima.
    """
    return [_pt(cx, cy, r, a1 + (a2 - a1) * i / k) for i in range(k + 1)]


def amostra_arco_elipse(cx, cy, rx, ry, a1, a2, k=160):
    fora = []
    for i in range(k + 1):
        a = math.radians(a1 + (a2 - a1) * i / k)
        fora.append((cx + rx * math.cos(a), cy - ry * math.sin(a)))
    return fora


def banda_corte_horizontal(cx, cy, r_ext, r_int, a1, a2):
    """Uma banda de arco cujo REMATE DE FIM é uma horizontal e não um raio.

    O remate de fim fica onde a face horizontal atravessa a banda, à altura do
    ponto `a2` da circunferência de fora. É esta a peça que põe a regra da §4
    dentro de um «e» redondo: a face de baixo do remate é paralela à face de
    baixo da barra, e o que fica entre as duas é um entalhe de lados paralelos e
    não um sector.
    """
    y = -r_ext * math.sin(math.radians(a2))          # em coordenadas de SVG, para baixo
    if abs(y) >= r_int:
        raise ValueError("o corte horizontal a este ângulo decepa a banda inteira")
    xe = r_ext * math.cos(math.radians(a2))
    xi = math.sqrt(r_int * r_int - y * y) * (1 if xe >= 0 else -1)
    p1 = _pt(cx, cy, r_ext, a1)
    p4 = _pt(cx, cy, r_int, a1)
    grande = 1 if (a2 - a1) % 360 > 180 else 0
    return (f"M{n(p1[0])} {n(p1[1])}"
            f"A{n(r_ext)} {n(r_ext)} 0 {grande} 0 {n(cx + xe)} {n(cy + y)}"
            f"L{n(cx + xi)} {n(cy + y)}"
            f"A{n(r_int)} {n(r_int)} 0 {grande} 1 {n(p4[0])} {n(p4[1])}Z")


def caixa_de(pontos):
    xs = [p[0] for p in pontos]
    ys = [p[1] for p in pontos]
    return (min(xs), min(ys), max(xs), max(ys))


def pena_aberta(pts, larg):
    """A pena de bico sobre um esqueleto aberto, TROÇO A TROÇO.

    `pena_ponteada` fecha o traço num polígono só, o lado de fora seguido do
    lado de dentro ao contrário. Isso chega enquanto o traço é fino; deixa de
    chegar quando ele engrossa, porque num «s» os dois lados chegam a
    cruzar-se e um polígono que se atravessa a si mesmo, cheio por `nonzero`,
    enche o cruzamento. Viu-se no «s» do peso de ícone: a letra saiu com uma
    mancha no meio da espinha.

    Aqui sai um quadrilátero por troço do esqueleto, todos no mesmo sentido:
    `nonzero` sobre formas do mesmo sentido é a união delas, e a união de
    quadriláteros encostados é o traço, cruze-se ele ou não.
    """
    k = len(pts)
    lados = []
    for i, (x, y) in enumerate(pts):
        if i == 0:
            tx, ty = pts[1][0] - x, pts[1][1] - y
        elif i == k - 1:
            tx, ty = x - pts[-2][0], y - pts[-2][1]
        else:
            tx, ty = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        m = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / m, tx / m
        h = larg(i / (k - 1)) / 2.0
        lados.append(((x + nx * h, y + ny * h), (x - nx * h, y - ny * h)))
    d = []
    todos = []
    for i in range(k - 1):
        (a1, b1), (a2, b2) = lados[i], lados[i + 1]
        quad = [a1, a2, b2, b1]
        todos.extend(quad)
        d.append("M" + "L".join(f"{n(px)} {n(py)}" for px, py in quad) + "Z")
    return "".join(d), caixa_de(todos)


def pena_fechada(pts, larg):
    """A pena de bico sobre um esqueleto FECHADO, em dois contornos.

    `pena_ponteada` devolve UM polígono (o lado de fora seguido do lado de
    dentro ao contrário), e num anel isso deixa uma costura: os dois lados
    encontram-se onde o esqueleto fecha, e o polígono passa a atravessar-se a si
    mesmo. Viu-se no «o» da primeira volta, como um fio a sair do lado direito
    da letra. Aqui saem dois contornos separados, cheios com `evenodd`, que é o
    que um anel é.
    """
    k = len(pts)
    fora, dentro = [], []
    for i, (x, y) in enumerate(pts):
        ax, ay = pts[(i - 1) % k]
        bx, by = pts[(i + 1) % k]
        tx, ty = bx - ax, by - ay
        m = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / m, tx / m
        h = larg(i / k) / 2.0
        fora.append((x + nx * h, y + ny * h))
        dentro.append((x - nx * h, y - ny * h))
    poli = lambda p: "M" + "L".join(f"{n(a)} {n(b)}" for a, b in p) + "Z"   # noqa: E731
    return poli(fora) + poli(dentro), caixa_de(fora + dentro)


# ===========================================================================
# CONSTRUÇÃO 1 · AS SEIS LETRAS GEOMÉTRICAS
# ===========================================================================
# Todas de uma grossura só. O «o» é o círculo da altura de x; o «e» é esse
# círculo com uma barra e um entalhe; o «a» e o «d» são o mesmo círculo com uma
# haste à direita, e o que os separa é até onde a haste sobe; o «t» é haste e
# travessão. É a mesma ideia das minúsculas da §4 («todas as redondas são o
# mesmo bojo, e o que muda é onde está a haste e até onde ela sobe»), agora com
# uma grossura constante em vez de contraste.

def g1_o(x, base):
    r = G1_XH / 2.0
    cx, cy = x + r, base - r
    d = circunferencia(cx, cy, r) + circunferencia(cx, cy, r - G1_G)
    return [("evenodd", d)], (cx - r, cy - r, cx + r, cy + r), G1_XH


def g1_e(x, base, corte=None, barra=None):
    """O «e» da casa, redesenhado como letra: barra acima do meio, remate a direito.

    OS DOIS ARGUMENTOS RESOLVEM-SE NA CHAMADA e não na definição, e não é
    pedantismo: um valor por defeito de Python fixa-se quando a função é
    escrita, e o bloco `Peso` que dá o peso de ícone muda as constantes DEPOIS
    disso. Com `corte=G1_CORTE` no cabeçalho da função, o «e» negro saía com a
    barra do «e» fino e o olho fechava.
    """
    corte = G1_CORTE if corte is None else corte
    barra = G1_BARRA if barra is None else barra
    r = G1_XH / 2.0
    cx, cy = x + r, base - r
    meia = G1_G / 2.0
    # a barra: a face de cima encontra a circunferência de fora, e é aí que a
    # banda começa. Sem junta escondida, como no «e» mínimo da §6 bis.
    ytopo = cy - (barra * G1_XH - r) - meia            # a face de cima, em SVG
    ybaixo = ytopo + G1_G
    dy = cy - ytopo                                    # o quanto a face de cima sobe
    ang = math.degrees(math.asin(max(min(dy / r, 1.0), -1.0)))
    dx = math.sqrt(max(r * r - dy * dy, 0.0))
    banda = banda_corte_horizontal(cx, cy, r, r - G1_G, ang, corte)
    barra_d = rect(cx - dx, ytopo, cx + dx, ybaixo)
    return ([("nonzero", banda), ("nonzero", barra_d)],
            (cx - r, cy - r, cx + r, cy + r), G1_XH)


def g1_abertura(corte=None, barra=None, xh=None, g=None):
    """O entalhe do «e», em unidades: da face de baixo da barra à face do remate."""
    corte = G1_CORTE if corte is None else corte
    barra = G1_BARRA if barra is None else barra
    xh = G1_XH if xh is None else xh
    g = G1_G if g is None else g
    r = xh / 2.0
    ytopo = -(barra * xh - r) - g / 2.0
    ybaixo = ytopo + g
    y_corte = -r * math.sin(math.radians(corte))
    return y_corte - ybaixo


def g1_d(x, base):
    partes, caixa, w = g1_o(x, base)
    hx = caixa[2] - G1_G
    partes = list(partes) + [("nonzero", rect(hx, base - ASCENDENTE, caixa[2], base))]
    return partes, une([caixa, (hx, base - ASCENDENTE, caixa[2], base)]), w


def g1_a(x, base):
    """O «a» de um andar: o mesmo bojo, com a haste à altura de x.

    Um «a» de dois andares nesta grelha não sai, e a razão está medida na §4: o
    bojo pequeno de um «a» de dois andares deixa uma contraforma que a 60 px é
    meio píxel. Num alfabeto de grossura constante o problema é o mesmo.
    """
    partes, caixa, w = g1_o(x, base)
    hx = caixa[2] - G1_G
    partes = list(partes) + [("nonzero", rect(hx, base - G1_XH, caixa[2], base))]
    return partes, une([caixa, (hx, base - G1_XH, caixa[2], base)]), w


def g1_t(x, base):
    """O «t»: haste, travessão à altura de x, e o pé cortado a direito, sem cauda."""
    esq = 0.30 * G1_XH
    dir_ = 0.34 * G1_XH
    hx = x + esq
    partes = [("nonzero", rect(hx, base - G1_T, hx + G1_G, base)),
              ("nonzero", rect(x, base - G1_XH, hx + G1_G + dir_, base - G1_XH + G1_G))]
    caixa = (x, base - G1_T, hx + G1_G + dir_, base)
    return partes, caixa, caixa[2] - x


# --- as três construções do «s» -------------------------------------------
# A §4 das NOTAS conta doze tentativas na grelha das onze primeiras, e nenhuma
# se leu como «s». Aquela grelha tinha contraste; esta não tem, o que tira uma
# variável e acrescenta outra: com grossura constante não há sítio fraco, mas
# também não há espinha, e a espinha é o que faz um «s» ser um «s» e não dois
# discos. As três abaixo atacam isso por três caminhos diferentes.

def g1_s_a(x, base):
    """s(a) · DOIS ARCOS DO MESMO CÍRCULO.

    Dois semicírculos do mesmo raio, tangentes: o de cima aberto à direita, o de
    baixo aberto à esquerda. Os remates ficam onde a tangente é horizontal, e
    por isso o corte é uma vertical perpendicular ao traço, que é a regra da
    casa cumprida sem esforço. É a construção da Bauhaus, e o que ela custa é a
    largura: com o raio preso à altura de x, o «s» fica com pouco mais de metade
    da largura do «o».
    """
    rc = (G1_XH - G1_G) / 4.0                 # o raio do EIXO de cada bojo
    largura = 2 * (rc + G1_G / 2.0)
    cx = x + largura / 2.0
    cyt = base - G1_XH + rc + G1_G / 2.0
    cyb = base - rc - G1_G / 2.0
    pts = amostra_arco(cx, cyt, rc, 90, 270) + amostra_arco(cx, cyb, rc, 90, -90)[1:]
    d, caixa = pena_aberta(pts, lambda u: G1_G)
    return [("nonzero", d)], caixa, largura


def g1_s_b(x, base):
    """s(b) · A ESPINHA DE UM CÍRCULO MAIS PEQUENO.

    Dois arcos de um círculo de raio bem menor do que o do «o», desencontrados
    na horizontal, e entre eles um troço RECTO: a espinha. Os números não são
    escolhidos um a um: fixa-se a largura que se quer e o resto sai de duas
    condições, que a espinha seja tangente aos dois arcos e que a letra caiba na
    altura de x. É a construção que tem diagonal, que é o que um «s» tem e um
    par de semicírculos não tem.
    """
    largura = 0.86 * G1_XH
    # AS DUAS CONDIÇÕES, RESOLVIDAS. Com a espinha a 60 graus do horizontal (que
    # é o ângulo a que ela é tangente aos dois arcos nos pontos de 210 e de 30
    # graus), a distância horizontal entre os centros e o raio ficam presos um
    # ao outro:  dx = (5r + g − X) / 2√3,  e a largura é 2dx + 2r + g. Fixa-se a
    # largura que se quer para a letra e o raio sai daí, em vez de se escolher
    # um raio e se aceitar a largura que ele der.
    g, X = G1_G, G1_XH
    r = (largura - g - (g - X) / math.sqrt(3)) / (5 / math.sqrt(3) + 2)
    dx = (5 * r + g - X) / (2 * math.sqrt(3))
    dy = X - 2 * r - g
    cxt = x + largura / 2.0 + dx
    cxb = x + largura / 2.0 - dx
    cyt = base - X + r + g / 2.0
    cyb = cyt + dy
    pts = (amostra_arco(cxt, cyt, r, 90, 210, k=90)
           + amostra_arco(cxb, cyb, r, 30, -90, k=90))
    d, caixa = pena_aberta(pts, lambda u: g)
    return [("nonzero", d)], caixa, largura


def g1_s_c(x, base):
    """s(c) · O TRAÇO DO «e», INVERTIDO E REPETIDO.

    A mesma banda do «e» (um arco com remate radial) usada duas vezes: uma como
    está, outra virada ao contrário. Cada braço leva 210 graus em vez dos 180 do
    par de semicírculos, e por isso os remates enrolam para dentro em vez de
    acabarem a meio do topo. É a construção que mais parentesco tem com o sinal,
    e é a que se quer ver ao lado dele.
    """
    rc = (G1_XH - G1_G) / 4.0
    ro, ri = rc + G1_G / 2.0, rc - G1_G / 2.0
    largura = 2 * ro
    cx = x + largura / 2.0
    cyt = base - G1_XH + ro
    cyb = base - ro
    partes = [("nonzero", banda_de_arco(cx, cyt, ro, ri, 60, 270)),
              ("nonzero", banda_de_arco(cx, cyb, ro, ri, -120, 90))]
    return partes, (cx - ro, cyt - ro, cx + ro, cyb + ro), largura


G1_S = {"a": g1_s_a, "b": g1_s_b, "c": g1_s_c}
G1_S_ESCOLHIDO = "b"


# ===========================================================================
# CONSTRUÇÃO 2 · AS SEIS LETRAS HUMANISTAS
# ===========================================================================
# Traço modulado e aberturas abertas. O eixo é inclinado 8 graus, que é o que
# separa uma humanista de uma grotesca: numa grotesca o sítio mais grosso de um
# «o» está exactamente a três horas, numa humanista está um pouco abaixo, porque
# a forma vem de uma pena e não de um compasso.

# ---------------------------------------------------------------------------
# O PESO DE ÍCONE (a continuação da 7b, 29.08.2026, 07:25)
# ---------------------------------------------------------------------------
# «O nosso ícone é muito mais fraco quando comparado», com o separador do
# navegador do diretor à frente: a Guardian, o Público, o NYT, a Anthropic e a
# Google, todos com campo cheio e letra pesada, e o nosso um «e» de fio sem
# campo. A instrução que daí veio tem um número: para o favicon e para o ícone
# de aplicação, a grossura da letra é pelo menos 22 % do diâmetro do círculo da
# altura de x, contra os 14 % do sinal do cabeçalho.
#
# O QUE ISTO SEPARA, E CONVÉM DIZÊ-LO: o desenho do CABEÇALHO e o desenho do
# ÍCONE deixam de ser o mesmo ficheiro. Não é uma inconsistência: é o que todas
# as marcas da tira do diretor fazem, e é o que a §4 destas notas já dizia de
# outra maneira («a simplificação que a mantém»: a mesma forma com o que morre
# tirado). Aqui a forma é a mesma e o que muda é o peso, que é a variável que a
# escala pede.
G1_G_ICONE = 0.22 * G1_XH        # 103,4: 22 % do diâmetro, o mínimo pedido
# A BARRA SOBE PARA O MEIO NO PESO DE ÍCONE, e é uma troca declarada. Com a
# banda a 22 % do diâmetro sobram 159,8 unidades de contraforma dentro do anel
# para repartir entre o olho e o vão; com a barra a 0,54 o olho fica com 61 delas
# e, numa cela de 16 px, isso é 1,5 px, que o suavizado fecha. A 0,515 o olho fica
# com 73, ou seja 1,75 px. A letra perde a assimetria que a §7 lhe deu no
# cabeçalho e ganha o olho aberto no favicon, que é onde ela é julgada.
G1_BARRA_ICONE = 0.515
# E O CORTE TEM UM TECTO QUE A BANDA IMPÕE: a face horizontal do remate só
# atravessa a banda enquanto a altura do ponto de corte for menor do que o raio
# de dentro. Com a banda a 22 % o raio de dentro é 131,6 num raio de 235, ou seja
# o corte não passa dos 34 graus. 33 é o maior que cabe, e é o que está.
G1_CORTE_ICONE = -33.0
G2_T_ICONE = 106.0               # 22,6 % do diâmetro do círculo da altura de x (470)
G2_t_ICONE = 64.0                # o mesmo contraste, 1,66


class Peso:
    """Troca as constantes de grossura durante um bloco, e devolve-as no fim.

    As letras leem as constantes no momento em que são chamadas, e por isso o
    negro é O MESMO DESENHO com outro número, e não um segundo desenho. É a
    afirmação que se quer poder fazer ao diretor: o ícone e o cabeçalho são a
    mesma letra, e o que muda entre eles é o peso.
    """

    def __init__(self, **kw):
        self.kw = kw

    def __enter__(self):
        g = globals()
        self.velho = {k: g[k] for k in self.kw}
        g.update(self.kw)
        return self

    def __exit__(self, *a):
        globals().update(self.velho)
        return False


def peso_de_icone():
    return Peso(G1_G=G1_G_ICONE, G1_BARRA=G1_BARRA_ICONE, G1_CORTE=G1_CORTE_ICONE,
                G2_T=G2_T_ICONE, G2_t=G2_t_ICONE)


def _largura_humanista(a_graus):
    """A grossura do traço na volta de uma redonda, ao ângulo dado."""
    c = abs(math.cos(math.radians(a_graus - G2_EIXO)))
    return G2_t + (G2_T - G2_t) * (c ** 0.75)


def _anel_humanista(cx, cy, rx, ry, escala=1.0):
    """O anel modulado: o esqueleto é uma elipse, e a pena passa por cima.

    O esqueleto encolhe-se pela grossura MÉDIA e não pela haste, senão o bojo
    saía mais estreito do que a régua manda: o traço cresce meia grossura para
    dentro e meia para fora, e a média é o que mede a diferença.
    """
    med = (G2_T + G2_t) / 2.0 * escala
    pts = amostra_arco_elipse(cx, cy, rx - med / 2.0, ry - med / 2.0, 0, 360, k=200)[:-1]
    return pena_fechada(pts, lambda u: _largura_humanista(360 * u) * escala)


def g2_o(x, base, rx=None):
    ry = (G2_XH + 2 * G2_SALIENCIA) / 2.0
    rx = rx if rx is not None else 0.905 * ry
    cx, cy = x + rx, base + G2_SALIENCIA - ry
    d, caixa = _anel_humanista(cx, cy, rx, ry)
    return [("evenodd", d)], caixa, 2 * rx


def g2_e(x, base):
    """O «e» humanista: o mesmo esqueleto redondo, a barra, e a abertura aberta.

    A FAMÍLIA COM O SINAL É AQUI QUE SE DECIDE, e é uma decisão de anatomia e não
    de gosto: o sinal é um anel de grossura constante com uma barra a atravessar
    e um corte em baixo à direita, e este «e» é um anel MODULADO com uma barra a
    atravessar e um corte em baixo à direita. O que os separa é a modulação; o
    que os junta é tudo o resto.
    """
    ry = (G2_XH + 2 * G2_SALIENCIA) / 2.0
    rx = 0.905 * ry
    cx, cy = x + rx, base + G2_SALIENCIA - ry
    med = (G2_T + G2_t) / 2.0
    ex, ey = rx - med / 2.0, ry - med / 2.0
    barra_h = G2_t * 1.10
    y_barra = base - 0.545 * G2_XH                    # o eixo da barra, em SVG
    # O ARCO COMEÇA NA FACE DE BAIXO DA BARRA, e não no eixo dela. Com o
    # começo no eixo, o remate a direito do arco ficava meia barra acima da face
    # de baixo e via-se um degrau à direita da barra, do lado de fora do bojo.
    a_inicio = math.degrees(math.asin(
        max(min((cy - y_barra - G2_t * 1.10 / 2.0) / ey, 1.0), -1.0)))
    a_fim = -34.0
    pts = amostra_arco_elipse(cx, cy, ex, ey, a_inicio, a_fim + 360.0, k=220)

    def larg(u):
        a = a_inicio + (a_fim + 360.0 - a_inicio) * u
        w = _largura_humanista(a)
        # O REMATE AFINA NO ÚLTIMO SÉTIMO, e é isso que abre a abertura: um
        # remate à grossura toda fecha o vão com matéria e o «e» aproxima-se de
        # um «o» com uma barra. É a diferença entre esta letra e o sinal, que
        # tem a abertura toda cortada de uma vez.
        if u > 0.86:
            w *= 1.0 - 0.38 * (u - 0.86) / 0.14
        return w

    d, caixa = pena_aberta(pts, larg)
    # A BARRA ACABA NA CIRCUNFERÊNCIA DE FORA, como no sinal: os remates dela são
    # cordas da elipse de fora, e por isso a silhueta não ganha saliência
    # nenhuma. Na primeira volta a barra estava presa ao esqueleto e saía meio
    # traço para fora do bojo, do lado esquerdo.
    dy = (cy - y_barra)
    fy = dy + barra_h / 2.0                 # a face mais afastada do centro
    xb = rx * math.sqrt(max(1 - (fy / ry) ** 2, 0.0))
    barra = rect(cx - xb, y_barra - barra_h / 2.0, cx + xb, y_barra + barra_h / 2.0)
    return ([("nonzero", d), ("nonzero", barra)],
            une([caixa, (cx - rx, cy - ry, cx + rx, cy + ry)]), 2 * rx)


def g2_d(x, base):
    partes, caixa, w = g2_o(x, base)
    hx = caixa[2] - G2_T
    partes = list(partes) + [("nonzero", rect(hx, base - ASCENDENTE, caixa[2], base))]
    return partes, une([caixa, (hx, base - ASCENDENTE, caixa[2], base)]), w


def g2_a(x, base):
    """O «a» de dois andares: bojo em baixo, haste à direita, arco por cima.

    De dois andares e não de um, e a razão é a mesma que a §6 dá às vozes
    serifadas: um «a» de um andar numa letra modulada lê-se como itálico.
    """
    xh = G2_XH
    w = 0.80 * xh
    hx = x + w - G2_T
    partes = [("nonzero", rect(hx, base - xh + G2_t * 0.6, x + w, base))]
    caixas = [(hx, base - xh, x + w, base)]
    # o bojo: um anel modulado sentado na linha de base, com o lado direito
    # tapado pela haste. O raio horizontal é o que faz o bordo de fora do bojo
    # cair no bordo de fora da haste.
    hb = 0.62 * xh
    rx, ry = w / 2.0, (hb + G2_SALIENCIA) / 2.0
    cx, cy = x + rx, base + G2_SALIENCIA - ry
    d, cb = _anel_humanista(cx, cy, rx, ry, escala=0.96)
    partes.append(("evenodd", d))
    caixas.append(cb)
    # O OMBRO: um arco de elipse que sai da haste, sobe, e volta a descer à
    # esquerda. É a peça que a primeira volta tinha errada: com uma cúbica solta
    # e a grossura a crescer até ao fim, o remate caía em cima do bojo e a letra
    # ficava uma mancha. Aqui o esqueleto é um arco medido, e a grossura faz um
    # sino: fina onde encosta à haste, cheia no cimo, fina no remate.
    rx2, ry2 = 0.365 * w, 0.215 * xh
    c2x, c2y = hx + G2_T * 0.30 - rx2, base - xh + ry2
    pts = amostra_arco_elipse(c2x, c2y, rx2, ry2, 0, 212, k=120)
    d2, cx2 = pena_aberta(
        pts, lambda u: G2_t * 0.82 + (G2_T * 0.70 - G2_t * 0.82) * math.sin(math.pi * u) ** 0.62)
    partes.append(("nonzero", d2))
    caixas.append(cx2)
    return partes, une(caixas), w


def g2_t(x, base):
    """O «t»: haste até 560, travessão à altura de x, e uma cauda curta à direita."""
    esq, dir_ = 0.22 * G2_XH, 0.26 * G2_XH
    hx = x + esq
    w = esq + G2_T + dir_
    partes = [("nonzero", rect(hx, base - G2_TOPO_T, hx + G2_T, base - G2_XH * 0.16))]
    caixas = [(hx, base - G2_TOPO_T, hx + G2_T, base)]
    partes.append(("nonzero", rect(x, base - G2_XH, x + w, base - G2_XH + G2_t * 1.05)))
    caixas.append((x, base - G2_XH, x + w, base - G2_XH + G2_t))
    # A CAUDA SAI DO EIXO DA HASTE, e não do bordo dela. Na primeira volta o
    # esqueleto começava em `hx`, que é o bordo esquerdo, e a cauda saía meia
    # haste à esquerda do «t»: lia-se um gancho solto por baixo da letra.
    eixo = hx + G2_T / 2.0
    cauda = espinha([(eixo, base - G2_XH * 0.20),
                     (eixo, base - G2_t * 0.10), (eixo + G2_T * 0.62, base + G2_t * 0.30),
                     (eixo + G2_T * 1.45, base - G2_t * 0.10)])
    d, c = pena_aberta(cauda, lambda u: G2_T * (1.0 - 0.46 * u))
    partes.append(("nonzero", d))
    caixas.append(c)
    return partes, une(caixas), w


def g2_s(x, base):
    """O «s» humanista: uma espinha em S e a pena de bico por cima.

    É a letra que a grelha das onze não dava e que a pena da §6 deu. O perfil é
    o mesmo que as sete vozes usam, com a grossura a subir ao meio do traço, que
    é onde um «s» tem o eixo grosso.
    """
    xh = G2_XH
    T, t = G2_T, G2_t
    w = 0.68 * xh
    xi = x + T / 2.0
    ww = w - T
    pts = espinha([
        (xi + 0.92 * ww, base - 0.76 * xh),
        (xi + 0.90 * ww, base - 0.99 * xh), (xi + 0.54 * ww, base - 1.04 * xh),
        (xi + 0.34 * ww, base - 0.90 * xh),
        (xi + 0.14 * ww, base - 0.78 * xh), (xi + 0.13 * ww, base - 0.61 * xh),
        (xi + 0.44 * ww, base - 0.51 * xh),
        (xi + 0.75 * ww, base - 0.41 * xh), (xi + 0.90 * ww, base - 0.30 * xh),
        (xi + 0.83 * ww, base - 0.14 * xh),
        (xi + 0.74 * ww, base + 0.03 * xh), (xi + 0.34 * ww, base + 0.04 * xh),
        (xi + 0.08 * ww, base - 0.13 * xh),
    ])
    d, caixa = pena_aberta(pts, lambda u: t + (T - t) * math.sin(math.pi * u) ** 0.80)
    return [("nonzero", d)], caixa, w


# ===========================================================================
# A COMPOSIÇÃO
# ===========================================================================
def compoe(letras, espaco, base=0.0):
    """As letras umas a seguir às outras, com o ar medido na TINTA.

    É o método da §6 («o espaço é medido na tinta, e não no avanço»), e a razão
    é a mesma: o travessão de um «t» e o arco de um «a» ficam fora do avanço.
    """
    partes, caixas = [], []
    cursor, direita = 0.0, None
    for fn in letras:
        _, c0, _ = fn(0.0, base)
        xi = cursor if direita is None else max(cursor, direita + espaco - c0[0])
        p, c, w = fn(xi, base)
        partes += p
        caixas.append(c)
        direita = c[2]
        cursor = xi + w + espaco
    return partes, une(caixas)


def palavra_g1(s=None):
    fn_s = G1_S[s or G1_S_ESCOLHIDO]
    return compoe([g1_e, fn_s, g1_t, g1_a, g1_d, g1_o], G1_ESPACO)


def palavra_g2():
    return compoe([g2_e, g2_s, g2_t, g2_a, g2_d, g2_o], G2_ESPACO)


# ===========================================================================
# OS FICHEIROS
# ===========================================================================
def escreve_svg(nome, partes, caixa, margem=0.0, titulo=""):
    """Um SVG recortado à caixa de tinta, com a cor herdada de quem o usa.

    `currentColor` e não uma cor no ficheiro: o mesmo desenho serve o cabeçalho
    claro, o cabeçalho escuro, o ícone em campo de tinta e o ícone em campo de
    papel, sem quatro ficheiros e sem quatro paletas para divergirem.
    """
    x0, y0, x1, y1 = caixa
    x0 -= margem; y0 -= margem; x1 += margem; y1 += margem
    corpo = "\n  ".join(
        f'<path fill-rule="{regra}" d="{d}"/>' for regra, d in partes)
    doc = (f'<svg xmlns="http://www.w3.org/2000/svg" '
           f'viewBox="{n(x0)} {n(y0)} {n(x1 - x0)} {n(y1 - y0)}" '
           f'fill="currentColor" role="img" aria-label="{titulo}">\n'
           f'  <title>{titulo}</title>\n  {corpo}\n</svg>\n')
    os.makedirs(SAIDA, exist_ok=True)
    caminho = os.path.join(SAIDA, nome)
    with open(caminho, "w") as f:
        f.write(doc)
    return caminho


def _caixa_de_ascendente(caixa):
    """A caixa recortada à régua comum: da ascendente à saliência.

    O que a palavra desenha por acaso (o topo do «t», o fundo do «o») não decide
    a caixa; a régua decide. É isto que faz as três construções entrarem no
    cabeçalho com a MESMA altura de tinta e poderem ser comparadas.
    """
    x0, _, x1, _ = caixa
    return (x0, -ASCENDENTE, x1, SALIENCIA)


def escreve():
    feitos = []
    # a palavra de cada construção, e cada uma na sua caixa de régua
    for etq, fn, s in (("1-geometrica", palavra_g1, None), ("2-humanista", palavra_g2, None)):
        partes, caixa = fn()
        feitos.append(escreve_svg(f"{etq}-estado.svg", partes,
                                  _caixa_de_ascendente(caixa),
                                  titulo=f"«estado» · construção {etq[0]}"))
    # as três construções do «s», na palavra e sozinhas
    for chave in ("a", "b", "c"):
        partes, caixa = palavra_g1(chave)
        feitos.append(escreve_svg(f"1-geometrica-estado-s{chave}.svg", partes,
                                  _caixa_de_ascendente(caixa),
                                  titulo=f"«estado» · construção 1 · «s» ({chave})"))
        p, c, _ = G1_S[chave](0.0, 0.0)
        feitos.append(escreve_svg(f"1-s{chave}.svg", p, c, titulo=f"«s» ({chave})"))
    # cada letra sozinha: a do «e» é a candidata a ícone, e as outras cinco
    # existem para o desenho se poder conferir letra a letra e não só na palavra
    for etq, tabela in (("1", {"e": g1_e, "s": G1_S[G1_S_ESCOLHIDO], "t": g1_t,
                               "a": g1_a, "d": g1_d, "o": g1_o}),
                        ("2", {"e": g2_e, "s": g2_s, "t": g2_t,
                               "a": g2_a, "d": g2_d, "o": g2_o})):
        for letra, fn in tabela.items():
            p, c, _ = fn(0.0, 0.0)
            feitos.append(escreve_svg(f"{etq}-{letra}.svg", p, c,
                                      titulo=f"«{letra}» · construção {etq}"))
    # o alfabeto de cada construção, para se ver o ritmo letra a letra
    for etq, ls, esp in (("1-geometrica", [g1_e, G1_S[G1_S_ESCOLHIDO], g1_t, g1_a, g1_d, g1_o], G1_ESPACO),
                         ("2-humanista", [g2_e, g2_s, g2_t, g2_a, g2_d, g2_o], G2_ESPACO)):
        partes, caixa = compoe(ls, esp * 2.2)
        feitos.append(escreve_svg(f"{etq}-alfabeto.svg", partes,
                                  _caixa_de_ascendente(caixa),
                                  titulo=f"as seis letras · construção {etq[0]}"))
    # O PESO DE ÍCONE: as mesmas letras, com a grossura que a continuação da 7b
    # pede. Só o «e» e a palavra, que são as duas candidaturas.
    with peso_de_icone():
        for etq, fn_e, fn_p in (("1", g1_e, palavra_g1), ("2", g2_e, palavra_g2)):
            p, c, _ = fn_e(0.0, 0.0)
            feitos.append(escreve_svg(f"{etq}-e-negro.svg", p, c,
                                      titulo=f"«e» negro · construção {etq}"))
            partes, caixa = fn_p()
            feitos.append(escreve_svg(f"{etq}-estado-negro.svg", partes,
                                      _caixa_de_ascendente(caixa),
                                      titulo=f"«estado» negro · construção {etq}"))
    for c in feitos:
        print("escrito", os.path.relpath(c, os.path.dirname(os.path.dirname(AQUI))))
    print()
    with peso_de_icone():
        print(f"peso de ícone · construção 1 · grossura {G1_G:.1f} "
              f"({100 * G1_G / G1_XH:.1f} % do diâmetro), barra a {G1_BARRA:.3f}, "
              f"entalhe {g1_abertura():.0f}")
        print(f"peso de ícone · construção 2 · haste {G2_T:.0f} "
              f"({100 * G2_T / (G2_XH + 2 * G2_SALIENCIA):.1f} % do diâmetro do círculo), "
              f"fino {G2_t:.0f}, contraste {G2_T / G2_t:.2f}")
    print("peso de ícone · construção 3 · Spectral Bold: a haste do «e» mede 135,9 "
          "num círculo de 476 (28,6 %); o SemiBold dá 112,7 em 474 (23,8 %). "
          "As duas passam os 22 % pedidos, e as duas são ficheiros que a casa já serve.")
    print(f"construção 1 · altura de x {G1_XH:.0f}, grossura {G1_G:.1f} "
          f"({100 * G1_G / G1_XH:.0f} % do diâmetro), entalhe do «e» "
          f"{g1_abertura():.0f} ({100 * g1_abertura() / G1_XH:.0f} % da altura de x)")
    print(f"construção 2 · altura de x {G2_XH:.0f}, haste {G2_T:.0f}, fino {G2_t:.0f}, "
          f"contraste {G2_T / G2_t:.2f}")


if __name__ == "__main__" and len(sys.argv) == 1:
    escreve()


# ===========================================================================
# A RÉGUA
# ===========================================================================
"""
`python3 design/marca/estado.py medir` lê os PNG de `EXPORT-ESTADO/` e escreve
`EXPORT-ESTADO/regua.json`. Nada aqui é estimado do desenho: conta-se píxel a
píxel, que é o método da §8 das NOTAS.

O QUE MUDA EM RELAÇÃO À RÉGUA DAS RONDAS ANTERIORES, e é preciso dizê-lo: ali a
tinta era sempre escura, porque o campo era sempre papel. Aqui metade das celas
tem campo de tinta e letra de papel, e por isso «tinta» não serve de critério. O
que se conta é o SINAL, ou seja o que difere do campo, e o campo lê-se no canto
da imagem. É o mesmo que a §6 fez às sete vozes, com a diferença de que a
separação é feita por distância à cor do campo e não por um limiar fixo.

E CONTAM-SE DUAS ILHAS E NÃO UMA. As do sinal dizem se a letra é uma peça; as do
FUNDO dizem se o olho do «e» está fechado. Um «e» com o olho aberto tem uma ilha
de fundo (o campo, com o olho a comunicar com ele pela abertura); com o olho
fechado tem duas. É o inteiro que a §6 ter usou, e é o que responde à pergunta
da 7b sobre os 16 px.
"""


def _mascara(im):
    """O sinal e o fundo, separados pela distância à cor do canto."""
    px = im.convert("RGB").load()
    w, h = im.size
    campo = px[0, 0]
    longe, cor = 0, campo
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            d = sum(abs(a - b) for a, b in zip(p, campo))
            if d > longe:
                longe, cor = d, p
    if longe == 0:
        return [[False] * w for _ in range(h)], w, h
    lim = longe / 2.0
    return ([[sum(abs(a - b) for a, b in zip(px[x, y], campo)) > lim for x in range(w)]
             for y in range(h)], w, h)


def _ilhas(mapa, w, h, valor):
    vistos = [[False] * w for _ in range(h)]
    contas = 0
    for y0 in range(h):
        for x0 in range(w):
            if vistos[y0][x0] or mapa[y0][x0] != valor:
                continue
            contas += 1
            pilha = [(x0, y0)]
            vistos[y0][x0] = True
            while pilha:
                x, y = pilha.pop()
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    a, b = x + dx, y + dy
                    if 0 <= a < w and 0 <= b < h and not vistos[b][a] and mapa[b][a] == valor:
                        vistos[b][a] = True
                        pilha.append((a, b))
    return contas


def _corridas(mapa, w, h):
    """As corridas de sinal em linha e em coluna. A mais curta é a peça frágil."""
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
    if not fora:
        return 0, 0
    fora.sort()
    return fora[0], fora[len(fora) // 2]


def _caixa_de_tinta(mapa, w, h):
    xs = [x for y in range(h) for x in range(w) if mapa[y][x]]
    ys = [y for y in range(h) for x in range(w) if mapa[y][x]]
    if not xs:
        return None
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def medir():
    import json
    from PIL import Image
    dir_ = os.path.join(AQUI, "EXPORT-ESTADO")
    fora = {"icones": [], "marcas": []}
    for f in sorted(os.listdir(dir_)):
        if f.startswith("ic-") and f.endswith(".png"):
            im = Image.open(os.path.join(dir_, f))
            mapa, w, h = _mascara(im)
            mn, med = _corridas(mapa, w, h)
            sinal = sum(1 for y in range(h) for x in range(w) if mapa[y][x])
            fora["icones"].append({
                "f": f[3:-4], "px": w,
                "sinal_pc": round(100 * sinal / (w * h), 1),
                "ilhas_sinal": _ilhas(mapa, w, h, True),
                "ilhas_fundo": _ilhas(mapa, w, h, False),
                "corrida_min": mn, "corrida_med": med,
            })
        elif f.startswith("s") and f[1] in "abc" and f.endswith(".png") and "-marca-" not in f:
            im = Image.open(os.path.join(dir_, f))
            mapa, w, h = _mascara(im)
            mn, med = _corridas(mapa, w, h)
            sinal = sum(1 for y in range(h) for x in range(w) if mapa[y][x])
            fora["icones"].append({
                "f": f[:-4], "px": w,
                "sinal_pc": round(100 * sinal / (w * h), 1),
                "ilhas_sinal": _ilhas(mapa, w, h, True),
                "ilhas_fundo": _ilhas(mapa, w, h, False),
                "corrida_min": mn, "corrida_med": med,
            })
        elif f.startswith("marca-") and f.endswith(".png"):
            im = Image.open(os.path.join(dir_, f))
            mapa, w, h = _mascara(im)
            c = _caixa_de_tinta(mapa, w, h)
            if c:
                fora["marcas"].append({"f": f[6:-4], "tinta_alt": c[3] - c[1],
                                       "tinta_larg": c[2] - c[0]})
    with open(os.path.join(dir_, "regua.json"), "w") as fh:
        json.dump(fora, fh, indent=2)
    for r in fora["icones"]:
        if r["px"] in (16, 32, 60):
            print(f"{r['f']:26s} {r['px']:4d}px  sinal {r['sinal_pc']:5.1f} %  "
                  f"ilhas sinal {r['ilhas_sinal']}  fundo {r['ilhas_fundo']}  "
                  f"corrida min {r['corrida_min']}  med {r['corrida_med']}")
    print()
    for r in fora["marcas"]:
        if r["f"].endswith("-claro") and ("-390-" in r["f"] or "-1280-" in r["f"]):
            print(f"{r['f']:26s} caixa de tinta {r['tinta_alt']:4d} × {r['tinta_larg']:5d} px")


if len(sys.argv) > 1 and sys.argv[1] == "medir":
    medir()


# ===========================================================================
# O ECRÃ PRINCIPAL, COM AS CANDIDATURAS DA 7b
# ===========================================================================
"""
`python3 design/marca/estado.py ecras` escreve os PNG de ecrã em EXPORT-ESTADO/.

A 7b diz duas coisas sobre isto, e as duas mudam a maqueta das rondas
anteriores: o ícone deixa de ser o `e2-unida-28` que está no ar (é uma letra da
construção), e o rótulo por baixo passa a ser «estado». O rótulo importa tanto
como o ícone: foi a maqueta da quarta adenda que mostrou que «O Estado do País»
não cabe numa cela de 60 pt e sai cortado, e «estado» é a primeira das
candidaturas a nome que cabe inteira sem se cortar.

A COMPOSIÇÃO É A DE `desenhar.py`, e não uma segunda. `compoe_ecra` já sabe pôr
a cela de 180 px entre os oito ícones de referência, com o arredondamento e o
rótulo; o que muda aqui é a lista, e muda-se onde ela vive, para que a maqueta
desta ronda seja a mesma máquina das outras e as folhas se possam comparar.
"""


def ecras():
    import desenhar as D
    from PIL import Image, ImageDraw, ImageFont
    D.ECRA_FILAS = [(f, r if r != "Estado do País" else "estado")
                    for f, r in D.ECRA_FILAS]
    dir_ = os.path.join(AQUI, "EXPORT-ESTADO")
    grande = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 34)
    pequena = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 27)
    for c in ("1", "2", "3"):
        peles = []
        # AS QUATRO CANDIDATURAS DA 7b, no peso de ícone: a continuação da adenda
        # tirou o peso fino de cima da mesa («fios sem campo estão fora para
        # ícones»), e por isso o que vai à cela é o `-negro`.
        for peca, campo, rot in (("e-negro", "tinta", "o «e» ao peso de ícone · campo de tinta"),
                                 ("e-negro", "cobalto", "o «e» ao peso de ícone · campo de cobalto"),
                                 ("e-negro", "papel", "o «e» ao peso de ícone · campo de papel"),
                                 ("palavra-negro", "tinta", "a palavra ao peso de ícone · campo de tinta")):
            nosso = os.path.join(dir_, f"ic-c{c}-{peca}-{campo}-180.png")
            peles.append((D.compoe_ecra(nosso, "claro"), rot,
                          "cela de 180 px (60 pt a 3×), ecrã claro"))
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
        folha.save(os.path.join(dir_, f"ecra-{c}.png"), optimize=True)
        print(f"escrito EXPORT-ESTADO/ecra-{c}.png ({folha.size[0]} x {folha.size[1]})")


if len(sys.argv) > 1 and sys.argv[1] == "ecras":
    ecras()


# ===========================================================================
# A TIRA DE SEPARADORES (a continuação da 7b, 29.08.2026, 07:25)
# ===========================================================================
"""
`python3 design/marca/estado.py separadores` escreve `ECRA-SEPARADORES.png`.

O diretor mandou uma captura da barra de separadores dele e uma frase: «a nossa
letra de ícone é muito mais fraca quando comparada». Isto é essa barra, com as
candidaturas no lugar do nosso separador, para a comparação se poder fazer a
olhar em vez de se argumentar.

O QUE É MEDIDO E O QUE É SUPOSTO, pela mesma regra da maqueta do ecrã principal:
  · o favicon a 16 px é medido: é o tamanho a que um navegador o desenha;
  · a mesma tira a 2× é a que o ecrã do diretor mostra;
  · a largura do separador (240 px), a altura (34) e o arredondamento são
    ESCOLHIDOS a olho a partir da captura, e não conferidos contra o Chromium.
    O que importa aqui é o ícone entre os outros, e essa relação não depende de
    dois píxeis de separador;
  · os cinzentos da moldura (`#202124` e `#35363a`) são os do tema escuro do
    Chromium tal como aparecem na captura, lidos a olho e não do código dele.

E DUAS CELAS SÃO MARCADORES, e está dito na folha: a Anthropic e a Google não
estão em `referencias/`, e um desenho de memória da marca de outrem não é
medição nenhuma. Ficam um quadrado liso, como a §6 fez ao navegador da Microsoft.
"""

SEP_LARGURA = 240
SEP_ALTURA = 34
SEP_RAIO = 8
CHROME_BARRA = (32, 33, 36)
CHROME_ATIVO = (53, 54, 58)
CHROME_TEXTO = (232, 234, 237)
CHROME_TEXTO_INATIVO = (154, 160, 166)
MARCADOR = (95, 99, 104)

SEP_ORDEM = ["guardian", "publico", "nyt", "NOSSO", "anthropic", "google"]
SEP_TITULOS = {"guardian": "The Guardian", "publico": "Público",
               "nyt": "The New York Times", "NOSSO": "estado",
               "anthropic": "Anthropic", "google": "Google"}

# As candidaturas na tira, por ordem. A primeira é a de hoje, que é a queixa.
SEP_CANDIDATAS = [
    ("hoje", "hoje · o «e» de fio, sem campo (a queixa do diretor)", "hoje · fio, sem campo"),
    ("c1-e-tinta", "1 · o «e» ao peso do cabeçalho (14 %), campo de tinta", "1 · 14 % · tinta"),
    ("c1-e-negro-tinta", "1 · o «e» ao peso de ícone (22 %), campo de tinta", "1 · 22 % · tinta"),
    ("c1-e-negro-cobalto", "1 · o mesmo, campo de cobalto", "1 · 22 % · cobalto"),
    ("c2-e-negro-tinta", "2 · o «e» humanista ao peso de ícone (22,6 %), campo de tinta",
     "2 · 22,6 % · tinta"),
    ("c2-e-negro-cobalto", "2 · o mesmo, campo de cobalto", "2 · 22,6 % · cobalto"),
    ("c3-e-negro-tinta", "3 · o «e» do Spectral Bold (28,6 %), campo de tinta",
     "3 · Bold 28,6 % · tinta"),
    ("c3-e-negro-cobalto", "3 · o mesmo, campo de cobalto", "3 · Bold 28,6 % · cobalto"),
]


def _icone_da_tira(chave, px, dir_):
    from PIL import Image
    if chave == "hoje":
        # O FICHEIRO DE HOJE NÃO TEM CAMPO, e é isso que se quer mostrar. Guardado
        # com fundo transparente, um `convert("RGB")` pinta-o de PRETO e a
        # ampliação passaria a mostrar um campo de tinta que o ficheiro não tem.
        # Aqui ele é composto sobre o cinzento da barra, que é onde ele vive.
        im = Image.open(os.path.join(dir_, f"ref-hoje-{px}.png")).convert("RGBA")
        fundo = Image.new("RGBA", im.size, CHROME_BARRA + (255,))
        fundo.alpha_composite(im)
        return fundo
    return Image.open(os.path.join(dir_, f"ic-{chave}-{px}.png")).convert("RGBA")


def _tira(chave, px, dir_):
    """Uma barra de separadores, com a nossa candidatura no quarto lugar."""
    from PIL import Image, ImageDraw, ImageFont
    k = px // 16
    larg_sep, alt_sep = SEP_LARGURA * k, SEP_ALTURA * k
    alto = alt_sep + 8 * k
    im = Image.new("RGB", (larg_sep * len(SEP_ORDEM) + 8 * k, alto), CHROME_BARRA)
    d = ImageDraw.Draw(im)
    fonte = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12 * k)
    for i, quem in enumerate(SEP_ORDEM):
        x = 4 * k + i * larg_sep
        ativo = quem == "NOSSO"
        d.rounded_rectangle([x, 4 * k, x + larg_sep - 3 * k, alto],
                            radius=SEP_RAIO * k,
                            fill=CHROME_ATIVO if ativo else CHROME_BARRA)
        cy = 4 * k + (alt_sep - px) // 2 + 2 * k
        if quem in ("anthropic", "google"):
            d.rounded_rectangle([x + 10 * k, cy, x + 10 * k + px, cy + px],
                                radius=2 * k, fill=MARCADOR)
        else:
            ic = (_icone_da_tira(chave, px, dir_) if quem == "NOSSO"
                  else Image.open(os.path.join(dir_, f"ref-{quem}-{px}.png")).convert("RGBA"))
            if ic.size != (px, px):
                ic = ic.resize((px, px), Image.LANCZOS)
            im.paste(ic, (x + 10 * k, cy), ic)
        d.text((x + 10 * k + px + 8 * k, cy + px // 2 - 7 * k), SEP_TITULOS[quem],
               font=fonte, fill=CHROME_TEXTO if ativo else CHROME_TEXTO_INATIVO)
    return im


def separadores():
    from PIL import Image
    dir_ = os.path.join(AQUI, "EXPORT-ESTADO")
    import json
    regua = {x["f"]: x for x in json.load(open(os.path.join(dir_, "regua.json")))["icones"]}
    f = Folha(2560)
    f.titulo("A tira de separadores, com cada candidatura no nosso lugar",
             "Chromium em tema escuro, a 16 px e a 2×. A Anthropic e a Google são "
             "quadrados marcadores: os ficheiros delas não estão em referencias/ e "
             "não se vai à rede. Os outros três são os ficheiros recolhidos.")
    for escala, nome in ((16, "1× · o favicon a 16 px, como o navegador o desenha"),
                         (32, "2× · a mesma tira no ecrã do diretor")):
        f.seccao(nome)
        for chave, rot, _curto in SEP_CANDIDATAS:
            r = regua.get(f"{chave}-{escala}") if chave != "hoje" else None
            extra = ""
            if r:
                extra = (f"   ·   sinal {r['sinal_pc']} % da cela   ·   "
                         f"ilhas {r['ilhas_sinal']} sinal / {r['ilhas_fundo']} fundo   ·   "
                         f"corrida mínima {r['corrida_min']} px")
            f.nota(rot + extra)
            f.fila([_cabe(_tira(chave, escala, dir_), f.L - 80)])
    f.seccao("As celas sozinhas a 16 px, ampliadas 12×")
    linha, rots = [], []
    for chave, _rot, curto in SEP_CANDIDATAS:
        linha.append(_amplia(_icone_da_tira(chave, 16, dir_).convert("RGB"), 12))
        rots.append(curto)
    f.fila(linha[:4], rots[:4], gap=60)
    f.fila(linha[4:], rots[4:], gap=60)
    f.grava(os.path.join(AQUI, "ECRA-SEPARADORES.png"))


# O DESPACHO DE `separadores` VIVE NO FIM DO FICHEIRO, e não aqui: a função usa a
# classe `Folha`, que está definida mais abaixo, e um despacho ao nível do módulo
# corre no sítio onde está escrito.


# ===========================================================================
# AS FOLHAS
# ===========================================================================
"""
`python3 design/marca/estado.py folhas` escreve as quatro folhas que a adenda
pede: `FOLHA-ESTADO-1.png`, `-2`, `-3`, uma por construção, e `FOLHA-ESTADO.png`,
a comparação dos três cabeçalhos lado a lado.

Cada folha é uma coluna de blocos rotulados, e a ordem é a das perguntas: as
seis letras primeiro (o alfabeto), o «s» a seguir onde ele é a pergunta, depois
o cabeçalho aos quatro tamanhos do sítio com as três linhas de descritor e nos
dois temas, depois a palavra a 512 nos dois campos, depois as candidaturas a
ícone com a régua, e por fim o ecrã principal.
"""

FUNDO_FOLHA = (128, 133, 127)
TINTA_FOLHA = (16, 18, 16)
NOTA_FOLHA = (46, 50, 46)


def _fontes():
    from PIL import ImageFont
    p = "/System/Library/Fonts/Helvetica.ttc"
    return (ImageFont.truetype(p, 46), ImageFont.truetype(p, 32),
            ImageFont.truetype(p, 26))


class Folha:
    """Uma folha que cresce para baixo, com blocos rotulados.

    Escreve-se numa tela larga de mais e corta-se no fim: uma folha que se sabe
    a altura antes de a compor obriga a contar duas vezes o que se vai lá pôr, e
    foi assim que as folhas anteriores ficaram com o rodapé por cima da imagem.
    """

    def __init__(self, largura, alto=40000):
        from PIL import Image, ImageDraw
        self.im = Image.new("RGB", (largura, alto), FUNDO_FOLHA)
        self.d = ImageDraw.Draw(self.im)
        self.L = largura
        self.y = 40
        self.f_tit, self.f_sub, self.f_nota = _fontes()

    def titulo(self, texto, nota=None):
        self.d.text((40, self.y), texto, font=self.f_tit, fill=TINTA_FOLHA)
        self.y += 60
        if nota:
            self.d.text((40, self.y), nota, font=self.f_nota, fill=NOTA_FOLHA)
            self.y += 40
        self.y += 14

    def seccao(self, texto):
        self.y += 26
        self.d.line([(40, self.y), (self.L - 40, self.y)], fill=(96, 100, 95), width=2)
        self.y += 16
        self.d.text((40, self.y), texto, font=self.f_sub, fill=TINTA_FOLHA)
        self.y += 46

    def nota(self, texto):
        self.d.text((40, self.y), texto, font=self.f_nota, fill=NOTA_FOLHA)
        self.y += 34

    def fila(self, imagens, rotulos=None, gap=26, x0=40):
        """Uma fila de imagens, cada uma com o seu rótulo por baixo.

        O rótulo pode ter várias linhas, separadas por `\n`, e é preciso que
        possa: uma cela de ícone mede 180 px e a régua dela («sinal, ilhas,
        corrida mínima») não cabe numa linha dessa largura. Na primeira volta as
        legendas atropelavam-se umas às outras.
        """
        alto = max(i.height for i in imagens)
        linhas = 0
        x = x0
        for k, im in enumerate(imagens):
            self.im.paste(im, (x, self.y))
            if rotulos:
                for j, linha in enumerate(rotulos[k].split("\n")):
                    self.d.text((x, self.y + alto + 8 + j * 30), linha,
                                font=self.f_nota, fill=NOTA_FOLHA)
                linhas = max(linhas, len(rotulos[k].split("\n")))
            x += im.width + gap
        self.y += alto + (8 + linhas * 30 if rotulos else 0) + 18

    def grava(self, caminho):
        self.im.crop((0, 0, self.L, self.y + 30)).save(caminho, optimize=True)
        print(f"escrito {os.path.relpath(caminho, os.path.dirname(os.path.dirname(AQUI)))}"
              f"  ({self.L} x {self.y + 30})")


def _abre(nome, dir_=None):
    from PIL import Image
    return Image.open(os.path.join(dir_ or os.path.join(AQUI, "EXPORT-ESTADO"), nome))


def _amplia(im, k):
    from PIL import Image
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


def _cabe(im, largura):
    from PIL import Image
    if im.width <= largura:
        return im
    k = largura / im.width
    return im.resize((largura, max(1, int(im.height * k))), Image.LANCZOS)


NOMES = {"1": "geométrica, do círculo", "2": "humanista", "3": "Spectral (o controlo)"}
DESCRITORES_FOLHA = [("d1", "observatório de Portugal"),
                     ("d2", "observatório do estado do país"),
                     ("d3", "observatório do estado de Portugal")]


def folha_construcao(c, regua):
    L = 2560
    f = Folha(L)
    if c == "1":
        medidas = (f"altura de x {G1_XH:.0f} · grossura {G1_G:.1f} "
                   f"({100 * G1_G / G1_XH:.0f} % do diâmetro, uma só) · "
                   f"ascendente {ASCENDENTE:.0f} · entalhe do «e» {g1_abertura():.0f} "
                   f"({100 * g1_abertura() / G1_XH:.0f} % da altura de x) · tudo em milésimos de em")
    elif c == "2":
        medidas = (f"altura de x {G2_XH:.0f} · haste {G2_T:.0f} · fino {G2_t:.0f} "
                   f"(contraste {G2_T / G2_t:.2f}) · eixo a {G2_EIXO:.0f} graus · "
                   f"ascendente {ASCENDENTE:.0f} · tudo em milésimos de em")
    else:
        medidas = ("altura de x 450 · haste do «d» 68,9 · ascendente 750 · "
                   "medidas lidas do ficheiro Spectral-Regular.woff2 da casa")
    f.titulo(f"«estado» · construção {c} · {NOMES[c]}", medidas)

    f.seccao("As seis letras")
    f.fila([_cabe(_abre(f"alf-{c}.png"), L - 80)])

    if c == "1":
        f.seccao("As três construções do «s», na palavra e sozinhas")
        for chave, nome in (("a", "dois arcos do mesmo círculo"),
                            ("b", "a espinha de um círculo mais pequeno"),
                            ("c", "o traço do «e», invertido e repetido")):
            f.nota(f"s({chave}) · {nome}")
            f.fila([_abre(f"s{chave}-marca-390.png"), _abre(f"s{chave}-marca-1280.png"),
                    _amplia(_abre(f"s{chave}-60.png"), 3), _abre(f"s{chave}-180.png")],
                   ["cabeçalho a 390\n(corpo 34)", "a 1280\n(corpo 68)",
                    "sozinho a 60 px\nampliado 3×", "a 180 px"])

    f.seccao("O cabeçalho, às quatro larguras do sítio, com as três linhas · claro e escuro")
    f.nota("A marcação e a folha de estilos são as do sítio: `.wrap`, `.masthead`, "
           "`.wordmark` e `.masthead-identidade`, com o clamp a resolver-se contra a janela.")
    for dk, dtxt in DESCRITORES_FOLHA:
        f.nota(f"«{dtxt}»")
        for largura in (320, 390, 768, 1280):
            f.fila([_abre(f"cab-c{c}-{dk}-{largura}-claro.png"),
                    _abre(f"cab-c{c}-{dk}-{largura}-escuro.png")],
                   [f"janela {largura} px · claro", f"janela {largura} px · escuro"])

    f.seccao("A palavra sozinha a 512 px, em papel e em tinta")
    f.fila([_abre(f"ic-c{c}-palavra-papel-512.png"), _abre(f"ic-c{c}-palavra-tinta-512.png")],
           ["512 px, campo de papel", "512 px, campo de tinta"])

    f.seccao("As candidaturas a ícone (adenda 7b e a continuação de 29.08, 07:25)")
    f.nota("Todas com campo cheio e no peso de ícone, que é o que a continuação da adenda "
           "pede: a grossura da letra é pelo menos 22 % do diâmetro do círculo da altura de x. "
           "A primeira fila é o peso do CABEÇALHO, para a diferença se ver.")
    r = {x["f"]: x for x in regua["icones"]}

    def bloco(peca, campo, rot, tamanhos):
        linha, rot2 = [], []
        for px, k in tamanhos:
            im = _abre(f"ic-c{c}-{peca}-{campo}-{px}.png")
            linha.append(_amplia(im, k) if k > 1 else im)
            dd = r[f"c{c}-{peca}-{campo}-{px}"]
            rot2.append(f"{px} px{'' if k == 1 else f' (×{k})'}\n"
                        f"sinal {dd['sinal_pc']} %\n"
                        f"ilhas {dd['ilhas_sinal']} sinal / {dd['ilhas_fundo']} fundo\n"
                        f"corrida {dd['corrida_min']} / {dd['corrida_med']}")
        f.nota(rot)
        f.fila(linha, rot2, gap=120)

    TAM = ((180, 1), (60, 3), (32, 6), (16, 11))
    bloco("e", "tinta", "o «e» ao peso do CABEÇALHO, campo de tinta (a referência)", TAM)
    for campo in ("tinta", "cobalto", "papel"):
        bloco("e-negro", campo, f"o «e» ao peso de ÍCONE, campo de {campo}", TAM)
    for campo in ("tinta", "papel"):
        bloco("palavra-negro", campo, f"a palavra ao peso de ÍCONE, campo de {campo}",
              ((512, 1), (180, 1), (60, 3)))

    f.seccao("A tira de separadores do navegador, com esta construção no nosso lugar")
    for campo in ("tinta", "cobalto"):
        f.nota(f"campo de {campo} · a 16 px (em cima) e a 2× (em baixo)")
        f.fila([_cabe(_tira(f"c{c}-e-negro-{campo}", 16, os.path.join(AQUI, "EXPORT-ESTADO")),
                      L - 80)])
        f.fila([_cabe(_tira(f"c{c}-e-negro-{campo}", 32, os.path.join(AQUI, "EXPORT-ESTADO")),
                      L - 80)])

    f.seccao("O ecrã principal, com cada candidatura na cela")
    f.fila([_cabe(_abre(f"ecra-{c}.png"), L - 80)])
    f.grava(os.path.join(AQUI, f"FOLHA-ESTADO-{c}.png"))


def folha_comparacao():
    L = 3480
    f = Folha(L)
    f.titulo("«estado» · os três cabeçalhos lado a lado, a 390 e a 1280",
             "A mesma linha de descritor nos três: «observatório de Portugal». "
             "A tira de cima é o cabeçalho de hoje, para o antes e o depois "
             "ficarem na mesma folha.")
    f.seccao("O cabeçalho de hoje")
    f.fila([_abre("cab-hoje-390-claro.png"), _abre("cab-hoje-1280-claro.png")],
           ["hoje · janela 390", "hoje · janela 1280"])
    for tema in ("claro", "escuro"):
        for largura in (390, 1280):
            f.seccao(f"«estado» · janela {largura} px · ecrã {tema}")
            f.fila([_abre(f"cab-c{c}-d1-{largura}-{tema}.png") for c in ("1", "2", "3")],
                   [f"1 · {NOMES['1']}", f"2 · {NOMES['2']}", f"3 · {NOMES['3']}"], gap=40)
    f.grava(os.path.join(AQUI, "FOLHA-ESTADO.png"))


def folhas():
    import json
    regua = json.load(open(os.path.join(AQUI, "EXPORT-ESTADO", "regua.json")))
    for c in ("1", "2", "3"):
        folha_construcao(c, regua)
    folha_comparacao()


if len(sys.argv) > 1 and sys.argv[1] == "folhas":
    folhas()


if len(sys.argv) > 1 and sys.argv[1] == "separadores":
    separadores()
