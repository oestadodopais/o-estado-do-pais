# A2b — the A2 head rebalanced.
# Fixes: (1) a full-width BASE ROW closes the head above the panel, so both columns
# are bounded; (2) the instrument column sits ON the tile grid (exactly one tile
# column wide); (3) strip+legend merge into one grouped line; (4) the deep-state
# locator is a bounded card on the grid, not a floating stamp; (5) região is a
# single column with the ruler as a full-width band.
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
completo = (ROOT / 'V3Completo.pre-a2b.bak').read_text(encoding='utf-8')
pontos = json.load(open(ROOT.parent / 'oedp-redesign' / 'pontos.json', encoding='utf-8'))
CSS = completo[completo.find('<style>')+len('<style>'):completo.find('</style>')]

i = completo.find('  <!-- 4.1'); j = completo.find('  <!-- LEDE')
assert i > 0 and j > i
MASTHEAD = completo[i:j]

def circles(width, sel=None, labels_on=True, dot_r=3.2, lit_r=7, sel_r=9):
    out = []
    for p in pontos:
        r, fill = dot_r, None
        if p['lit']: r, fill = lit_r, '#17191B'
        if sel and p['m'] == sel: r, fill = sel_r, '#17191B'
        out.append(f'<circle cx="{p["x"]}" cy="{p["y"]}" r="{r}"' + (f' fill="{fill}"' if fill else '') + '></circle>')
    labels = ''
    if labels_on and width >= 280:
        labels += '<text x="430.9" y="512.6" text-anchor="end" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">Évora</text>'
        if sel:
            p = next(x for x in pontos if x['m'] == sel)
            labels += f'<text x="{p["x"]+14}" y="{p["y"]+6}" text-anchor="start" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">{sel}</text>'
    h = round(width * 790 / 600)
    return (f'<svg viewBox="0 0 600 790" width="{width}" height="{h}" style="display: block; overflow: visible;">'
            '<rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<g fill="#F6F7F4" stroke="#17191B" stroke-width="1">' + ''.join(out) + '</g>' + labels + '</svg>')

DENS = lambda active='relance': '<div class="dens">' + ''.join(
    f'<span class="seg" style="{ "background-color: var(--ink); color: var(--paper);" if k == active else "" }">{l}</span>'
    for k, l in [('relance', 'Relance'), ('leitura', 'Leitura breve'), ('fundo', 'Fundo')]) + '</div>'

def scope_segs(active):
    return '<div class="dens">' + ''.join(
        f'<span class="seg" style="{ "background-color: var(--ink); color: var(--paper);" if k == active else "" }">{l}</span>'
        for k, l in [('pais', 'País'), ('regiao', 'Região'), ('municipio', 'Município')]) + '</div>'

def command_row(scope, dens='relance', extra=''):
    return f'''<div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 2px 0 14px 0; border-bottom: 1px solid var(--ink);">
      <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;"><div class="lab">Âmbito</div>{scope_segs(scope)}{extra}</div>
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Densidade</div>{DENS(dens)}</div>
    </div>'''

def gstrip(groups):
    """Grouped strip-legend on ONE line: [(css, count, label), ...]"""
    m = {'amb': 'background: var(--amb);', 'cob': 'background: var(--cob);', 'out': 'border: 1px solid var(--ink);', 'dash': 'border: 1px dashed var(--ink);'}
    parts = []
    for kind, n, label in groups:
        sq = ''.join(f'<span style="width: 15px; height: 15px; display: inline-block; flex: none; {m[kind]}"></span>' for _ in range(n))
        parts.append(f'<span style="display: inline-flex; align-items: center; gap: 4px;">{sq}<span class="lab" style="color: var(--ink); padding-left: 6px;">{label}</span></span>')
    return '<div style="display: flex; gap: 26px; align-items: center; flex-wrap: wrap;">' + ''.join(parts) + '</div>'

PAIS_GSTRIP = gstrip([('amb', 4, 'fora do limiar'), ('cob', 2, 'do lado bom da referência'), ('out', 2, 'sem limiar')])
EVORA_GSTRIP = gstrip([('cob', 2, 'do lado bom da referência'), ('out', 6, 'sem limiar')])
BEJA_GSTRIP = gstrip([('dash', 6, 'por ler · fontes nacionais')])

PAIS_DEK = '''<p style="font-size: 19px; line-height: 1.45; max-width: 33em;">Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.</p>'''

def base_row(left_chip, note, right=''):
    return f'''<div style="display: flex; justify-content: space-between; align-items: center; gap: 32px; border-top: 1px solid var(--g3); margin-top: 14px; padding: 12px 0;">
      <div style="display: flex; align-items: center; gap: 16px; min-width: 0;"><span class="chipb" style="flex: none;">{left_chip}</span><span class="prosa" style="font-size: 13.5px;">{note}</span></div>
      <div class="meta" style="flex: none; text-align: right;">{right}</div>
    </div>'''

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
TILES_PAIS = ''.join([
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 60 · acima', '89,7', '% do PIB · 2025', 'Dívida pública', 'Acima do limiar do painel europeu, e a descer.', 'Eurostat · tipsgo10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar −35 · abaixo', '−50,2', '% do PIB · 2025', 'Posição de investimento internacional', 'O que o país tem a haver do exterior menos o que lhe deve.', 'Eurostat · tipsii10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '21,3', 'variação em três anos, % · 2025', 'Custo unitário do trabalho', 'Custo do trabalho por unidade produzida, por hora trabalhada.', 'Eurostat · tipslm10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '17,6', 'variação anual, % · 2025', 'Preços da habitação', 'O limiar foi ultrapassado em 2024 e o excesso quase duplicou no ano seguinte.', 'Eurostat · tipsho20'),
])

OPEN_POP = '''<div class="open">
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 10px;"><span style="width: 14px; height: 14px; display: inline-block; flex: none; background: transparent; border: 1px solid #17191B;"></span><span style="font-size: 22px; font-weight: 500;">População residente</span></div>
    <div class="slab" style="font-size: 44px; font-weight: 500; line-height: 1;">58 567</div>
  </div>
  <div class="k">pessoas · 2025 · INE · indicador 0012918 · lido 2026-08-10</div>
  <div class="slab" style="font-size: 12px; font-weight: 600; letter-spacing: .04em; color: var(--g1);">CONTAGEM · SEM LIMIAR</div>
  <div style="font-size: 16px; line-height: 1.5;">A população residente subiu de 55 711 em 2021 para 58 567 em 2025. <a class="selo" href="#">fonte</a></div>
</div>'''
OPEN_PC = '''<div class="open">
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 10px;"><span style="width: 14px; height: 14px; display: inline-block; flex: none; background: var(--cob);"></span><span style="font-size: 22px; font-weight: 500;">Poder de compra por habitante</span></div>
    <div class="slab" style="font-size: 44px; font-weight: 500; line-height: 1;">111,47</div>
  </div>
  <div class="k">índice · média nacional = 100 · 2023 · INE · indicador 0014580 · lido 2026-08-10</div>
  <div style="position: relative; padding-top: 16px; margin-top: 4px;">
    <div class="k" style="position: absolute; top: 0; left: 0; font-weight: 400;">50</div>
    <div class="k" style="position: absolute; top: 0; right: 0; font-weight: 400;">150</div>
    <div class="k" style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); font-weight: 400;">média = 100</div>
    <svg viewBox="0 0 600 30" width="100%" height="30" preserveAspectRatio="xMinYMid meet" style="display: block; overflow: visible;">
      <line x1="0" y1="16" x2="600" y2="16" stroke="#D9DDD8" stroke-width="1"></line>
      <rect x="0" y="12" width="368.8" height="8" fill="#17191B"></rect>
      <line x1="300" y1="2" x2="300" y2="30" stroke="#7F8681" stroke-width="2"></line>
      <circle cx="368.8" cy="16" r="6.5" fill="#1F4E8C" stroke="#17191B" stroke-width="0"></circle>
    </svg>
  </div>
  <div class="slab" style="font-size: 12px; font-weight: 600; letter-spacing: .04em; color: var(--cob);">ACIMA DA MÉDIA NACIONAL · +11,47</div>
  <div style="font-size: 16px; line-height: 1.5;">O poder de compra por habitante está acima da média nacional, que é a base do índice: 111,47 no concelho, enquanto a sua região, o Alentejo Central, está abaixo dessa média, em 93,86. <a class="selo" href="#">fonte</a></div>
</div>'''

# Full-width região ruler band: 50–130 over 1000 → x(v)=(v-50)*12.5
RULER_BAND = '''<div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--ink); margin-top: 22px; padding-top: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <div class="lab">O instrumento da região · a régua da convergência · UE-27 = 100</div>
    <div class="meta">Eurostat · nama_10r_2gdp · lido 2026-08-13 · distância calculada</div>
  </div>
  <svg viewBox="0 0 1000 106" width="100%" height="112" style="display: block; overflow: visible;">
    <text x="62.5" y="14" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="middle">Península de Setúbal 55</text>
    <text x="400" y="14" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="middle">Portugal 82</text>
    <text x="475" y="32" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="middle">Madeira 88</text>
    <text x="487.5" y="14" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="start">Algarve 89</text>
    <text x="625" y="14" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="middle">UE-27 = 100</text>
    <text x="987.5" y="14" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="end">Grande Lisboa 129</text>
    <line x1="62.5" y1="18" x2="62.5" y2="52" stroke="#D9DDD8" stroke-width="1"></line>
    <line x1="400" y1="18" x2="400" y2="52" stroke="#D9DDD8" stroke-width="1"></line>
    <line x1="475" y1="36" x2="475" y2="52" stroke="#D9DDD8" stroke-width="1"></line>
    <line x1="487.5" y1="18" x2="487.5" y2="52" stroke="#D9DDD8" stroke-width="1"></line>
    <line x1="987.5" y1="18" x2="987.5" y2="52" stroke="#D9DDD8" stroke-width="1"></line>
    <line x1="0" y1="60" x2="1000" y2="60" stroke="#17191B" stroke-width="1"></line>
    <line x1="0" y1="54" x2="0" y2="66" stroke="#17191B" stroke-width="1"></line>
    <line x1="1000" y1="54" x2="1000" y2="66" stroke="#17191B" stroke-width="1"></line>
    <rect x="337.5" y="56" width="287.5" height="8" fill="#17191B"></rect>
    <line x1="625" y1="18" x2="625" y2="80" stroke="#7F8681" stroke-width="2"></line>
    <circle cx="62.5" cy="60" r="4" fill="#7F8681"></circle>
    <circle cx="400" cy="60" r="4" fill="#7F8681"></circle>
    <circle cx="475" cy="60" r="4" fill="#7F8681"></circle>
    <circle cx="487.5" cy="60" r="4" fill="#7F8681"></circle>
    <circle cx="987.5" cy="60" r="4" fill="#7F8681"></circle>
    <circle cx="337.5" cy="60" r="7" fill="#17191B"></circle>
    <text x="0" y="90" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B">50</text>
    <text x="337.5" y="91" font-family="Bitter, Georgia, serif" font-size="12" font-weight="600" fill="#17191B" text-anchor="middle">Alentejo 77</text>
    <text x="1000" y="90" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="end">130</text>
  </svg>
  <p class="prosa" style="max-width: 70ch;">As regiões não se desenham em pontos de concelho: a régua é o instrumento do âmbito regional. O mapa volta quando o âmbito é um município.</p>
</div>'''

def divider(label):
    return f'''<div style="display: flex; align-items: center; gap: 14px; padding: 26px 0 4px 0;">
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
  <div class="lab" style="color: var(--g1);">{label}</div>
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
</div>'''

# Head grid: 2 + 2 on the tile grid. Tile col at 1184 content = 281; two cols + gap = 582.
HEAD_GRID = 'display: grid; grid-template-columns: 582px minmax(0, 1fr); column-gap: 20px; align-items: start; padding-top: 20px;'

PAIS = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('pais')}
    <div style="{HEAD_GRID}">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="lab">PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS</div>
        <h1>Quatro limiares europeus ultrapassados.</h1>
        {PAIS_GSTRIP}
        <p style="font-size: 18px; line-height: 1.5;">Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.</p>
        <p class="prosa">O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.</p>
      </div>
      <div style="display: grid; grid-template-columns: 281px minmax(0, 1fr); column-gap: 20px; align-items: end;">
        {circles(281)}
        <div style="display: flex; flex-direction: column; gap: 9px; padding-bottom: 4px;">
          <div class="est" style="color: var(--ink);">1/308 municípios com estudo aprofundado publicado</div>
          <p class="prosa" style="font-size: 13.5px;">Um ponto por município, na posição real do seu centróide. Aceso: Évora.</p>
          <div class="meta">Continente 278<br>Açores 19<br>Madeira 11<br>Total 308 · <span class="pv">[a verificar]</span></div>
          <div class="meta">Toque num ponto para abrir o concelho.</div>
          <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025<br>lido a 2026-08-12</span></div>
        </div>
      </div>
    </div>
    {base_row('▸ Medidas · 8 no painel', 'O catálogo acrescenta ou retira medidas de qualquer âmbito, sem perder a fonte de cada uma.', '')}
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px;">
      {TILES_PAIS}
    </div>
  </div>'''

REGIAO = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('regiao')}
    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 0 0 0;">
      <span class="chipb">Grande Lisboa</span><span class="chipb">Península de Setúbal</span><span class="chipb">Algarve</span><span class="chipb">Madeira</span><span class="chipb on">Alentejo</span>
      <span class="meta" style="padding-left: 6px;">as cinco regiões publicadas na régua da convergência</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 14px; padding-top: 18px;">
      <div class="lab">ALENTEJO · REGIÃO · RÉGUA DA CONVERGÊNCIA · 1 MEDIDA</div>
      <div style="display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 48px; align-items: end;">
        <h1 style="max-width: 16em;">Alentejo, 23 pontos abaixo da média da UE-27.</h1>
        <p class="prosa" style="padding-bottom: 6px;">PIB per capita em paridades de poder de compra. É a única linha regional no livro-razão de hoje: as medidas do painel europeu são nacionais e as municipais são por concelho.</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;"><span style="width: 15px; height: 15px; display: inline-block; flex: none; border: 1px solid var(--ink);"></span><span class="lab" style="color: var(--ink);">uma medida · sem limiar (a média é referência) · distância calculada</span></div>
    </div>
    {RULER_BAND}
    {base_row('▸ Medidas · 1 no painel', 'Cada região abre a sua linha; as medidas municipais entram pelo âmbito Município.', '<a class="selo" href="#">fonte</a>&nbsp;&nbsp;Eurostat · nama_10r_2gdp')}
  </div>'''

EVORA = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('municipio', dens='leitura', extra='<input class="inp" type="text" value="évora" style="width: 150px;"><span class="chipb on">Évora · com página</span>')}
    <div style="{HEAD_GRID}">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="lab">ÉVORA · MUNICÍPIO · DISTRITO DE ÉVORA · 8 MEDIDAS · LEITURA BREVE</div>
        <h1>Oito medidas do concelho, cada uma com a sua linha.</h1>
        {EVORA_GSTRIP}
        <p style="font-size: 18px; line-height: 1.5;">Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.</p>
      </div>
      <div style="border: 1px solid var(--g3); padding: 16px; display: grid; grid-template-columns: 170px minmax(0, 1fr); column-gap: 18px; align-items: center;">
        {circles(170, sel='Évora', labels_on=False, dot_r=3.6, lit_r=9, sel_r=13)}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="est" style="color: var(--ink);">Évora · distrito de Évora</div>
          <div class="meta">1/308 municípios com página<br>posições: DGT, CAOP 2025</div>
          <a class="lig" href="#" style="font-size: 11px;">trocar de concelho →</a>
          <a class="lig" href="#" style="font-size: 11px;">a página inteira, com quem governou →</a>
        </div>
      </div>
    </div>
    {base_row('▸ Medidas · 8 no painel', 'O catálogo acrescenta ou retira medidas de qualquer âmbito, sem perder a fonte de cada uma.', '<a class="selo" href="#">fonte</a>&nbsp;&nbsp;INE · IEFP · DGAL · Município de Évora')}
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 28px; row-gap: 8px; border-top: 1px solid var(--ink); padding-top: 8px;">
      {OPEN_POP}
      {OPEN_PC}
    </div>
    <div style="display: flex; align-items: center; justify-content: center; color: var(--g2); font-size: 22px; letter-spacing: .3em; padding: 10px 0;">· · ·</div>
  </div>'''

INNER = PAIS + divider('O INSTRUMENTO SEGUE O ÂMBITO · REGIÃO (ALENTEJO): A RÉGUA COMO BANDA, NÃO COLUNA') + REGIAO + divider('AO APROFUNDAR, O LOCALIZADOR É UMA FICHA NA GRELHA, NÃO UM SELO SOLTO · ÉVORA EM LEITURA BREVE') + EVORA
NOTA = ('Iteração A2b · a A2 reequilibrada. As correções: (1) uma LINHA DE BASE de largura total fecha a cabeça antes do painel — as colunas ficam '
        'limitadas e o espaço que sobra passa a margem, não a buraco; (2) a cabeça divide-se 2+2 SOBRE A GRELHA das peças: o texto ocupa duas colunas '
        '(medida de leitura certa, sem vazio dentro da própria coluna) e o instrumento as outras duas — o mapa numa, a sua ficha ao lado na outra; '
        '(3) a fila de estados e a legenda fundem-se numa só linha agrupada (■■■■ fora do limiar · ■■ do lado bom · □□ sem limiar); '
        '(4) na região, a régua é uma banda de largura total; (5) no âmbito escolhido, o localizador é uma ficha horizontal com borda — mapa pequeno '
        'à esquerda, os campos e as duas portas à direita — na metade direita da grelha.')

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
    <div class="meta" style="text-align: right; flex: none;">Maqueta v3 · iteração A2b · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta</div>
  </div>
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":{width},"height":3000}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''

(ROOT / 'OpcaoA2b.dc.html').write_text(board(INNER, NOTA), encoding='utf-8')
s = (ROOT / 'OpcaoA2b.dc.html').read_text(encoding='utf-8')
print('OpcaoA2b', len(s), 'divs', s.count('<div'), s.count('</div>'))
