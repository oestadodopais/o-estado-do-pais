# Builds three HEAD options for v3 — each artboard shows the same head twice:
# state 1 = País (painel europeu), state 2 = Município sem página (Beja).
# A · «Balcão»: control row (âmbito + densidade), headline + state strip, map promoted
#     to the head as the one map of the page (Instrumento n.º 2 moves up, apparatus included).
# B · «Separadores»: full-width scope tabs that carry their own counts; no map in the
#     head (the big map below stays the picker); headline + strip.
# C · «Margem»: a fixed left rail (scope stacked + map + counts) beside the content;
#     tiles at three columns.
# All values/texts are the published ones already used on the approved boards.
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
completo = (ROOT / 'V3Completo.dc.html').read_text(encoding='utf-8')
pontos = json.load(open(ROOT.parent / 'oedp-redesign' / 'pontos.json', encoding='utf-8'))

CSS = completo[completo.find('<style>')+len('<style>'):completo.find('</style>')]

def circles(width, sel=None, sel_label_anchor='start'):
    """All 308 dots; Évora always lit; sel = name of selected município (bigger, ink)."""
    base_r = 3.2 * (460.0 / width) * (width / 460.0)  # keep viewBox r; visual size scales with width
    out = []
    for p in pontos:
        r = 3.2
        fill = '#F6F7F4'
        if p['lit']:
            r = 7
            fill = '#17191B'
        if sel and p['m'] == sel:
            r = 9
            fill = '#17191B'
        out.append(f'<circle cx="{p["x"]}" cy="{p["y"]}" r="{r}"' + (f' fill="{fill}"' if fill != '#F6F7F4' else '') + '></circle>')
    labels = ['<text x="430.9" y="512.6" text-anchor="end" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">Évora</text>']
    if sel:
        p = next(x for x in pontos if x['m'] == sel)
        if sel_label_anchor == 'start':
            labels.append(f'<text x="{p["x"]+14}" y="{p["y"]+6}" text-anchor="start" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">{sel}</text>')
        else:
            labels.append(f'<text x="{p["x"]-14}" y="{p["y"]+6}" text-anchor="end" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">{sel}</text>')
    h = round(width * 790 / 600)
    return (f'<svg viewBox="0 0 600 790" width="{width}" height="{h}" style="display: block; overflow: visible;">'
            '<rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<g fill="#F6F7F4" stroke="#17191B" stroke-width="1">' + ''.join(out) + '</g>' + ''.join(labels) + '</svg>')

MASTHEAD = '''  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-between; align-items: center; height: 48px; border-bottom: 1px solid var(--g3);">
      <div style="display: flex; align-items: center; gap: 10px;">
        <a class="nav" href="#">Início</a><span class="sep">·</span>
        <a class="nav" href="#">Municípios</a><span class="sep">·</span>
        <a class="nav" href="#">Estudos</a><span class="sep">·</span>
        <a class="nav" href="#">Livro-razão</a><span class="sep">·</span>
        <a class="nav" href="#">Agenda</a><span class="sep">·</span>
        <a class="nav" href="#">Método</a><span class="sep">·</span>
        <a class="nav" href="#">Sobre</a>
      </div>
      <a class="nav" href="#">English</a>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; padding: 26px 0 20px 0;">
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 64px; font-weight: 500; line-height: 1; letter-spacing: -0.01em;">O Estado do País</div>
        <div class="g1" style="font-style: italic; font-size: 18px; line-height: 1.4;">Portugal, medido. Cada número tem fonte.</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 5px; align-items: flex-start; flex: none; padding-bottom: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="width: 12px; height: 12px; background: var(--cob); display: inline-block; flex: none;"></span>
          <span class="sl" style="font-size: 11px; letter-spacing: .08em; font-weight: 600;">PAINEL EUROPEU RECONFERIDO A 2026-08-17</span>
        </div>
        <div class="lab" style="padding-left: 20px;">AGENDA · 3 EM CURSO · 1 A SEGUIR</div>
      </div>
    </div>
    <div class="rulei"></div>
  </div>
'''

DENS = '''<div class="dens"><span class="seg" style="background-color: var(--ink); color: var(--paper);">Relance</span><span class="seg">Leitura breve</span><span class="seg">Fundo</span></div>'''

def scope_segs(active):
    out = []
    for k, label in [('pais', 'País'), ('regiao', 'Região'), ('municipio', 'Município')]:
        st = 'background-color: var(--ink); color: var(--paper);' if k == active else ''
        out.append(f'<span class="seg" style="{st}">{label}</span>')
    return '<div class="dens">' + ''.join(out) + '</div>'

def strip(kinds, size=16):
    m = {'amb': 'background: var(--amb);', 'cob': 'background: var(--cob);', 'out': 'border: 1px solid var(--ink);', 'dash': 'border: 1px dashed var(--ink);'}
    sq = ''.join(f'<span style="width: {size}px; height: {size}px; display: inline-block; flex: none; {m[k]}"></span>' for k in kinds)
    return f'<div style="display: flex; gap: 5px; align-items: center;">{sq}</div>'

PAIS_STRIP = strip(['amb', 'amb', 'amb', 'amb', 'cob', 'cob', 'out', 'out'])
BEJA_STRIP = strip(['dash'] * 6)
LEGEND = '''<div class="lab" style="display: flex; gap: 22px; flex-wrap: wrap; color: var(--ink);">
  <span><span class="sq" style="background: var(--amb);"></span>Âmbar · fora do limiar</span>
  <span><span class="sq" style="background: var(--cob);"></span>Cobalto · do lado bom da referência</span>
  <span><span class="sq" style="border: 1px solid var(--ink);"></span>Sem limiar</span>
  <span><span class="sq" style="border: 1px dashed var(--ink);"></span>Por ler</span>
</div>'''
PAIS_DEK = '''<p style="font-size: 19px; line-height: 1.45; max-width: 34em;">Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.</p>'''
PAIS_NOTE = '''<p class="prosa">O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.</p>'''
BEJA_DEK = '''<p style="font-size: 19px; line-height: 1.45; max-width: 34em;">Beja, distrito de Beja. O ponto marca a posição do município, não representa cobertura. Seis das medidas de Évora vêm de organismos que publicam para todos os concelhos; quando forem lidas para Beja, entram aqui com fonte e data de leitura.</p>'''
BEJA_NOTE = '''<p class="prosa">1 dos 308 municípios tem página com medidas. Os restantes 307 pontos marcam a posição do município e mais nada.</p>'''

def tile(edge, sqcss, word, pill, num, unit, nome, short, meta):
    return f'''<div class="tile" style="border-color: {edge};">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;"><span style="width: 12px; height: 12px; display: inline-block; flex: none; {sqcss}"></span><span class="est" style="color: {word};">{pill}</span></div>
    <span class="lab abrir" style="flex: none;">▸ abrir</span>
  </div>
  <div class="num">{num}</div>
  <div class="lab">{unit}</div>
  <div class="nome" style="font-size: 21px; padding-top: 4px;">{nome}</div>
  <div class="prosa" style="font-size: 14.5px; line-height: 1.45;">{short}</div>
  <div style="margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 6px;"><a class="selo" href="#">fonte</a><span class="meta">{meta}</span></div>
</div>'''

T_AMB = 'background: var(--amb);'
TILES = [
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 60 · acima', '89,7', '% do PIB · 2025', 'Dívida pública', 'Acima do limiar do painel europeu, e a descer.', 'Eurostat · tipsgo10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar −35 · abaixo', '−50,2', '% do PIB · 2025', 'Posição de investimento internacional', 'O que o país tem a haver do exterior menos o que lhe deve.', 'Eurostat · tipsii10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '21,3', 'variação em três anos, % · 2025', 'Custo unitário do trabalho', 'Custo do trabalho por unidade produzida, por hora trabalhada.', 'Eurostat · tipslm10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '17,6', 'variação anual, % · 2025', 'Preços da habitação', 'O limiar foi ultrapassado em 2024 e o excesso quase duplicou no ano seguinte.', 'Eurostat · tipsho20'),
]
GHOST = '<div style="display: flex; align-items: center; justify-content: center; color: var(--g2); font-size: 22px; letter-spacing: .3em; padding: 8px 0;">· · ·</div>'

EMPTY_BEJA = '''<div class="empty" style="grid-column: 1 / -1;">
  <div class="est" style="color: var(--ink);">Sem linhas para Beja · ainda</div>
  <p style="font-size: 17px; max-width: 70ch;">Nenhuma medida foi lida para este concelho. As fontes que publicam para todos os concelhos (INE, IEFP, DGAL) permitem que as mesmas seis medidas de Évora existam aqui, com a mesma prova, quando forem lidas.</p>
  <div class="meta">O ponto marca a posição do município (CAOP 2025, DGT); não representa cobertura. Quando houver linhas, entram aqui com fonte e data de leitura.</div>
</div>'''

MAP_APPARATUS = '''<div style="display: flex; flex-direction: column; gap: 8px;">
  <div class="est" style="color: var(--ink);">1/308 municípios com estudo aprofundado publicado</div>
  <p class="prosa" style="font-size: 13.5px;">Um ponto por município, na posição real do seu centróide. Aceso: Évora. Toque num ponto para abrir o concelho.</p>
  <div class="meta">Continente 278 · Açores 19 · Madeira 11 · Total 308 · <span class="pv">[a verificar]</span></div>
  <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025, lido a 2026-08-12</span></div>
</div>'''

DIVIDER = '''<div style="display: flex; align-items: center; gap: 14px; padding: 26px 0 4px 0;">
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
  <div class="lab" style="color: var(--g1);">O MESMO DESENHO NOUTRO ÂMBITO · MUNICÍPIO SEM PÁGINA (BEJA)</div>
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
</div>'''

def board(inner, note, width=1280):
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Bitter:ital,wght@0,100..900;1,100..900&display=swap">
  <style>{CSS}</style>
</helmet>
<div class="pg" style="width: {width}px; box-sizing: border-box; min-height: 100vh; padding: 34px 48px 44px 48px; display: flex; flex-direction: column; gap: 26px;">
{MASTHEAD}
{inner}
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 40px; padding-top: 10px; border-top: 1px solid var(--g3);">
    <p class="prosa" style="max-width: 78ch;">{note}</p>
    <div class="meta" style="text-align: right; flex: none;">Maqueta v3 · opção de cabeça · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta</div>
  </div>
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":{width},"height":2600}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''

# ============ OPTION A · «Balcão» ============
def head_A(state):
    if state == 'pais':
        scope = scope_segs('pais')
        reading = 'PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS'
        controls = ''
        headline = 'Quatro limiares europeus ultrapassados.'
        st, dek, note = PAIS_STRIP, PAIS_DEK, PAIS_NOTE
        mapa = circles(360)
        tiles = '\n'.join(TILES)
    else:
        scope = scope_segs('municipio')
        reading = 'BEJA · MUNICÍPIO · DISTRITO DE BEJA · 0 MEDIDAS'
        controls = '''<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <input class="inp" type="text" value="bej">
          <span class="chipb on">Beja</span><span class="chipb lit">Évora · com página</span>
          <span class="meta">ou toque num ponto do mapa</span>
        </div>'''
        headline = 'Ainda sem linhas para Beja.'
        st, dek, note = BEJA_STRIP + '<div class="meta" style="padding-top: 2px;">seis medidas das fontes nacionais · por ler</div>', BEJA_DEK, BEJA_NOTE
        mapa = circles(360, sel='Beja')
        tiles = EMPTY_BEJA
    return f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 2px 0 14px 0; border-bottom: 1px solid var(--ink);">
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Âmbito</div>{scope}</div>
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Densidade</div>{DENS}</div>
    </div>
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">{reading}</div>
        {controls}
        <h1 style="max-width: 15em;">{headline}</h1>
        {st}
        {LEGEND}
        {dek}
        <div style="display: flex; align-items: center; gap: 14px;"><span class="chipb">▸ Medidas · catálogo</span>{note.replace('<p class="prosa">', '<p class="prosa" style="max-width: 44ch;">')}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        {mapa}
        {MAP_APPARATUS}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 24px;">
      {tiles}
    </div>
  </div>'''

A = head_A('pais') + DIVIDER + head_A('beja')
nota_A = ('Opção A · «Balcão». Uma linha de comando com os dois seletores (âmbito à esquerda, densidade à direita); o título volta a ser frase, '
          'com a fila de estados por baixo (um quadrado por medida, na ordem do painel); o mapa sobe para a cabeça como O único mapa da página, '
          'com a sua ficha (1/308, contagens, CAOP) — o Instrumento n.º 2 deixa de existir em baixo.')

# ============ OPTION B · «Separadores» ============
def tabs_B(active):
    tabs = [
        ('pais', 'País', 'Painel europeu · 8 medidas · 4 fora do limiar'),
        ('regiao', 'Região', '5 regiões na régua da convergência'),
        ('municipio', 'Município', '308 concelhos · 1 com página'),
    ]
    cells = []
    for k, name, meta in tabs:
        on = k == active
        st = 'background: var(--ink); color: var(--paper); border: 1px solid var(--ink);' if on else 'border: 1px solid var(--g2);'
        metacls = 'style="color: var(--g3);"' if on else 'style="color: var(--g1);"'
        cells.append(f'''<div style="{st} padding: 14px 18px; display: flex; flex-direction: column; gap: 5px;">
          <div class="est" style="color: inherit;">{name}</div>
          <div class="meta" {metacls}>{meta}</div>
        </div>''')
    return '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;">' + ''.join(cells) + '</div>'

def head_B(state):
    if state == 'pais':
        tabs = tabs_B('pais')
        body = ''
        reading = 'O PAÍS EM NÚMEROS VERIFICADOS · PAINEL EUROPEU · 2025'
        headline = 'Quatro limiares europeus ultrapassados.'
        st, dek, note = PAIS_STRIP, PAIS_DEK, PAIS_NOTE
        tiles = '\n'.join(TILES)
    else:
        tabs = tabs_B('municipio')
        body = '''<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 14px;">
          <input class="inp" type="text" value="bej">
          <span class="chipb on">Beja</span><span class="chipb lit">Évora · com página</span>
          <span class="meta">ou escolha no mapa, no Instrumento n.º 2 ↓</span>
        </div>'''
        reading = 'O MUNICÍPIO EM NÚMEROS VERIFICADOS · BEJA'
        headline = 'Ainda sem linhas para Beja.'
        st, dek, note = BEJA_STRIP + '<div class="meta" style="padding-top: 2px;">seis medidas das fontes nacionais · por ler</div>', BEJA_DEK, BEJA_NOTE
        tiles = EMPTY_BEJA
    return f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {tabs}
    {body}
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 20px 0 14px 0;">
      <div class="lab">{reading}</div>
      {DENS}
    </div>
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 48px; align-items: start;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h1 style="max-width: 16em;">{headline}</h1>
        {st}
        {LEGEND}
        {dek}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; padding-top: 8px;">
        {note}
        <span class="chipb" style="align-self: flex-start;">▸ Medidas · catálogo</span>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 20px;">
      {tiles}
    </div>
  </div>'''

B = head_B('pais') + DIVIDER + head_B('beja')
nota_B = ('Opção B · «Separadores». O âmbito é uma fila de três separadores de largura total, cada um com a sua contagem '
          '(o separador diz o que contém antes de se abrir); sem mapa na cabeça — o mapa fica só em baixo, como Instrumento n.º 2, '
          'e o separador Município aponta para ele. O título volta a ser frase, com a fila de estados.')

# ============ OPTION C · «Margem» ============
def scope_stack(active, extra=''):
    out = []
    for k, label in [('pais', 'País'), ('regiao', 'Região'), ('municipio', 'Município')]:
        st = 'background-color: var(--ink); color: var(--paper);' if k == active else ''
        out.append(f'<span class="seg" style="display: block; text-align: center; {st}">{label}</span>')
    return '<div style="display: flex; flex-direction: column; border: 1px solid var(--ink);">' + ''.join(out) + '</div>' + extra

def head_C(state):
    if state == 'pais':
        rail_scope = scope_stack('pais')
        mapa = circles(236)
        reading = 'PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS'
        headline = 'Quatro limiares europeus ultrapassados.'
        st, dek = PAIS_STRIP, PAIS_DEK
        tiles = '\n'.join(TILES[:3])
        grid = 'repeat(3, minmax(0, 1fr))'
    else:
        rail_scope = scope_stack('municipio', '''<input class="inp" type="text" value="bej" style="width: 100%; box-sizing: border-box; margin-top: 10px;">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;"><span class="chipb on">Beja</span><span class="chipb lit">Évora</span></div>''')
        mapa = circles(236, sel='Beja')
        reading = 'BEJA · MUNICÍPIO · DISTRITO DE BEJA · 0 MEDIDAS'
        headline = 'Ainda sem linhas para Beja.'
        st, dek = BEJA_STRIP + '<div class="meta" style="padding-top: 2px;">seis medidas das fontes nacionais · por ler</div>', BEJA_DEK
        tiles = EMPTY_BEJA
        grid = 'repeat(3, minmax(0, 1fr))'
    return f'''  <div style="display: grid; grid-template-columns: 236px minmax(0, 1fr); gap: 44px; align-items: start; border-top: 1px solid var(--ink); padding-top: 20px;">
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div class="lab">Âmbito</div>
      {rail_scope}
      {mapa}
      <div class="est" style="color: var(--ink); font-size: 10.5px;">1/308 com estudo publicado</div>
      <div class="meta">Continente 278 · Açores 19 · Madeira 11 · Total 308 · <span class="pv">[a verificar]</span></div>
      <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025</span></div>
      <span class="chipb" style="align-self: flex-start;">▸ Medidas</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
        <div class="lab">{reading}</div>
        {DENS}
      </div>
      <h1 style="max-width: 16em;">{headline}</h1>
      {st}
      {LEGEND}
      {dek}
      <div style="display: grid; grid-template-columns: {grid}; column-gap: 18px; row-gap: 18px; border-top: 1px solid var(--ink); padding-top: 18px;">
        {tiles}
      </div>
      {GHOST if state == 'pais' else ''}
    </div>
  </div>'''

C = head_C('pais') + DIVIDER + head_C('beja')
nota_C = ('Opção C · «Margem». O mapa e o âmbito vivem numa margem fixa à esquerda, como o índice de um atlas: seletor empilhado, '
          'o mapa por baixo, as contagens como ficha; o conteúdo corre ao lado, com o painel a três colunas. '
          'O Instrumento n.º 2 deixa de existir em baixo (um só mapa).')

(ROOT / 'OpcaoA.dc.html').write_text(board(A, nota_A), encoding='utf-8')
(ROOT / 'OpcaoB.dc.html').write_text(board(B, nota_B), encoding='utf-8')
(ROOT / 'OpcaoC.dc.html').write_text(board(C, nota_C), encoding='utf-8')
for f in ['OpcaoA', 'OpcaoB', 'OpcaoC']:
    s = (ROOT / (f + '.dc.html')).read_text(encoding='utf-8')
    print(f, len(s), 'divs', s.count('<div'), s.count('</div>'))
