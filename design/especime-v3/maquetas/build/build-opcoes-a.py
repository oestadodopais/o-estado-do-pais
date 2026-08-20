# Iterations of Option A — the map's lifecycle across scope and depth.
# A2 «Respira»: full map at entry; each scope gets ITS instrument (região = the ruler);
#     once scoped and reading deeper, the map contracts to a locator stamp.
# A3 «Selo»: the map is always a small stamp (identity + locator); it only expands
#     when choosing a município (geography as interface).
# A4 «Só quando serve»: no map in the head at all except while choosing; scoped
#     reading has no map at any density.
# All values/texts are the published ones already used on approved boards; the only
# computed figures are distances to a published reference, labelled «calculado».
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
completo = (ROOT / 'V3Completo.dc.html').read_text(encoding='utf-8')
pontos = json.load(open(ROOT.parent / 'oedp-redesign' / 'pontos.json', encoding='utf-8'))
CSS = completo[completo.find('<style>')+len('<style>'):completo.find('</style>')]

def circles(width, sel=None, label_evora=True, dot_r=3.2, lit_r=7, sel_r=9):
    out = []
    for p in pontos:
        r, fill = dot_r, None
        if p['lit']: r, fill = lit_r, '#17191B'
        if sel and p['m'] == sel: r, fill = sel_r, '#17191B'
        out.append(f'<circle cx="{p["x"]}" cy="{p["y"]}" r="{r}"' + (f' fill="{fill}"' if fill else '') + '></circle>')
    labels = ''
    if label_evora and width >= 300:
        labels += '<text x="430.9" y="512.6" text-anchor="end" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">Évora</text>'
    if sel and width >= 300:
        p = next(x for x in pontos if x['m'] == sel)
        labels += f'<text x="{p["x"]+14}" y="{p["y"]+6}" text-anchor="start" font-family="Bitter, Georgia, serif" font-size="18" font-weight="600" fill="#17191B" stroke="#F6F7F4" stroke-width="4" stroke-linejoin="round" paint-order="stroke">{sel}</text>'
    h = round(width * 790 / 600)
    return (f'<svg viewBox="0 0 600 790" width="{width}" height="{h}" style="display: block; overflow: visible;">'
            '<rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>'
            '<g fill="#F6F7F4" stroke="#17191B" stroke-width="1">' + ''.join(out) + '</g>' + labels + '</svg>')

i = completo.find('  <!-- 4.1')
j = completo.find('  <!-- LEDE')
assert i > 0 and j > i, 'masthead extraction failed'
MASTHEAD = completo[i:j]
assert 'O Estado do País' in MASTHEAD and 'RECONFERIDO' in MASTHEAD.upper()

DENS = lambda active='relance': '<div class="dens">' + ''.join(
    f'<span class="seg" style="{ "background-color: var(--ink); color: var(--paper);" if k == active else "" }">{l}</span>'
    for k, l in [('relance', 'Relance'), ('leitura', 'Leitura breve'), ('fundo', 'Fundo')]) + '</div>'

def scope_segs(active):
    return '<div class="dens">' + ''.join(
        f'<span class="seg" style="{ "background-color: var(--ink); color: var(--paper);" if k == active else "" }">{l}</span>'
        for k, l in [('pais', 'País'), ('regiao', 'Região'), ('municipio', 'Município')]) + '</div>'

def strip(kinds, size=16):
    m = {'amb': 'background: var(--amb);', 'cob': 'background: var(--cob);', 'out': 'border: 1px solid var(--ink);', 'dash': 'border: 1px dashed var(--ink);'}
    return '<div style="display: flex; gap: 5px; align-items: center;">' + ''.join(
        f'<span style="width: {size}px; height: {size}px; display: inline-block; flex: none; {m[k]}"></span>' for k in kinds) + '</div>'

LEGEND = '''<div class="lab" style="display: flex; gap: 22px; flex-wrap: wrap; color: var(--ink);">
  <span><span class="sq" style="background: var(--amb);"></span>Âmbar · fora do limiar</span>
  <span><span class="sq" style="background: var(--cob);"></span>Cobalto · do lado bom da referência</span>
  <span><span class="sq" style="border: 1px solid var(--ink);"></span>Sem limiar</span>
  <span><span class="sq" style="border: 1px dashed var(--ink);"></span>Por ler</span>
</div>'''
PAIS_DEK = '''<p style="font-size: 19px; line-height: 1.45; max-width: 34em;">Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.</p>'''
PAIS_NOTE = '''<p class="prosa" style="max-width: 44ch;">O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.</p>'''

MAP_APPARATUS = '''<div style="display: flex; flex-direction: column; gap: 8px;">
  <div class="est" style="color: var(--ink);">1/308 municípios com estudo aprofundado publicado</div>
  <p class="prosa" style="font-size: 13.5px;">Um ponto por município, na posição real do seu centróide. Aceso: Évora. Toque num ponto para abrir o concelho.</p>
  <div class="meta">Continente 278 · Açores 19 · Madeira 11 · Total 308 · <span class="pv">[a verificar]</span></div>
  <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025, lido a 2026-08-12</span></div>
</div>'''

def stamp(sel=None, w=150, caption='', link='trocar de concelho'):
    return f'''<div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
      {circles(w, sel=sel, dot_r=4, lit_r=9, sel_r=15)}
      <div class="meta" style="max-width: {w+40}px;">{caption}</div>
      <a class="lig" href="#" style="font-size: 11px;">{link} →</a>
    </div>'''

def tile(edge, sqcss, word, pill, num, unit, nome, short, meta, numcls='num'):
    return f'''<div class="tile" style="border-color: {edge};">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
    <div style="display: flex; align-items: center; gap: 8px; min-width: 0;"><span style="width: 12px; height: 12px; display: inline-block; flex: none; {sqcss}"></span><span class="est" style="color: {word};">{pill}</span></div>
    <span class="lab abrir" style="flex: none;">▸ abrir</span>
  </div>
  <div class="{numcls}">{num}</div>
  <div class="lab">{unit}</div>
  <div class="nome" style="font-size: 21px; padding-top: 4px;">{nome}</div>
  <div class="prosa" style="font-size: 14.5px; line-height: 1.45;">{short}</div>
  <div style="margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 6px;"><a class="selo" href="#">fonte</a><span class="meta">{meta}</span></div>
</div>'''

T_AMB = 'background: var(--amb);'
T_COB = 'background: var(--cob);'
T_OUT = 'background: transparent; border: 1px solid #17191B;'
TILES_PAIS = [
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 60 · acima', '89,7', '% do PIB · 2025', 'Dívida pública', 'Acima do limiar do painel europeu, e a descer.', 'Eurostat · tipsgo10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar −35 · abaixo', '−50,2', '% do PIB · 2025', 'Posição de investimento internacional', 'O que o país tem a haver do exterior menos o que lhe deve.', 'Eurostat · tipsii10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '21,3', 'variação em três anos, % · 2025', 'Custo unitário do trabalho', 'Custo do trabalho por unidade produzida, por hora trabalhada.', 'Eurostat · tipslm10'),
 tile('var(--amb)', T_AMB, 'var(--ocre)', 'Limiar 9 · acima', '17,6', 'variação anual, % · 2025', 'Preços da habitação', 'O limiar foi ultrapassado em 2024 e o excesso quase duplicou no ano seguinte.', 'Eurostat · tipsho20'),
]
TILES_EVORA = [
 tile('var(--g3)', T_OUT, 'var(--g1)', 'Contagem · sem limiar', '58 567', 'pessoas · 2025', 'População residente', 'Estimativa anual do INE para o concelho.', 'INE · indicador 0012918'),
 tile('var(--cob)', T_COB, 'var(--cob)', 'Acima da média nacional', '111,47', 'índice · média nacional = 100 · 2023', 'Poder de compra por habitante', 'Poder de compra per capita, publicado pelo INE para todos os concelhos.', 'INE · indicador 0014580'),
 tile('var(--cob)', T_COB, 'var(--cob)', 'Teto 150 · abaixo', '105,5', '%, teto legal = 150 · 2024', 'Índice de dívida', 'Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na linha.', 'calculado · DGAL'),
 tile('var(--g3)', T_OUT, 'var(--g1)', 'Sem limiar', '137', 'dias · 2025', 'Prazo médio de pagamento', 'Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central.', 'Município de Évora'),
]

# Leitura-breve open blocks (Évora): população (no ruler) + poder de compra (ruler).
OPEN_POP = '''<div class="open">
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 10px;"><span style="width: 14px; height: 14px; display: inline-block; flex: none; background: transparent; border: 1px solid #17191B;"></span><span style="font-size: 22px; font-weight: 500;">População residente</span></div>
    <div class="slab" style="font-size: 44px; font-weight: 500; line-height: 1;">58 567</div>
  </div>
  <div class="k">pessoas · 2025 · INE · indicador 0012918 · lido 2026-08-10</div>
  <div class="slab" style="font-size: 12px; font-weight: 600; letter-spacing: .04em; color: var(--g1);">CONTAGEM · SEM LIMIAR</div>
  <div style="font-size: 16px; line-height: 1.5;">A população residente subiu de 55 711 em 2021 para 58 567 em 2025. <a class="selo" href="#">fonte</a></div>
</div>'''
# poder de compra ruler: scale 50–150 over 600; f(v)=(v-50)*6 → lim 100→300; val 111,47→368.8
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

# Região ruler card (Alentejo): 50–130 over 360 → x(v)=(v-50)*4.5; UE100=225; PT82=144; Alentejo77=121.5
RULER_ALENTEJO = '''<div style="display: flex; flex-direction: column; gap: 10px;">
  <div class="lab">O instrumento da região · a régua da convergência</div>
  <div style="position: relative; padding-top: 16px;">
    <div class="k" style="position: absolute; top: 0; left: 0; font-weight: 400;">50</div>
    <div class="k" style="position: absolute; top: 0; right: 0; font-weight: 400;">130</div>
    <div class="k" style="position: absolute; top: 0; left: 62.5%; transform: translateX(-50%); font-weight: 400;">UE-27 = 100</div>
    <svg viewBox="0 0 360 46" width="360" height="46" style="display: block; overflow: visible;">
      <line x1="0" y1="20" x2="360" y2="20" stroke="#D9DDD8" stroke-width="1"></line>
      <rect x="121.5" y="16" width="103.5" height="8" fill="#17191B"></rect>
      <line x1="225" y1="4" x2="225" y2="36" stroke="#7F8681" stroke-width="2"></line>
      <circle cx="144" cy="20" r="4" fill="#7F8681"></circle>
      <circle cx="121.5" cy="20" r="7" fill="#17191B"></circle>
      <text x="121.5" y="42" font-family="Bitter, Georgia, serif" font-size="12" font-weight="600" fill="#17191B" text-anchor="middle">Alentejo 77</text>
      <text x="150" y="10" font-family="Bitter, Georgia, serif" font-size="10" fill="#585D5B" text-anchor="start">Portugal 82</text>
    </svg>
  </div>
  <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">Eurostat · nama_10r_2gdp · lido 2026-08-13 · distância calculada</span></div>
  <p class="prosa" style="font-size: 13.5px; max-width: 40ch;">As regiões não se desenham em pontos de concelho: a régua é o instrumento do âmbito regional. O mapa volta quando o âmbito é um município.</p>
</div>'''

EMPTY_BEJA = '''<div class="empty" style="grid-column: 1 / -1;">
  <div class="est" style="color: var(--ink);">Sem linhas para Beja · ainda</div>
  <p style="font-size: 17px; max-width: 70ch;">Nenhuma medida foi lida para este concelho. As fontes que publicam para todos os concelhos (INE, IEFP, DGAL) permitem que as mesmas seis medidas de Évora existam aqui, com a mesma prova, quando forem lidas.</p>
  <div class="meta">O ponto marca a posição do município (CAOP 2025, DGT); não representa cobertura. Quando houver linhas, entram aqui com fonte e data de leitura.</div>
</div>'''

def divider(label):
    return f'''<div style="display: flex; align-items: center; gap: 14px; padding: 26px 0 4px 0;">
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
  <div class="lab" style="color: var(--g1);">{label}</div>
  <div style="flex: 1; border-top: 2px dashed var(--g2);"></div>
</div>'''

def command_row(scope, dens='relance', extra=''):
    return f'''<div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 2px 0 14px 0; border-bottom: 1px solid var(--ink);">
      <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;"><div class="lab">Âmbito</div>{scope_segs(scope)}{extra}</div>
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Densidade</div>{DENS(dens)}</div>
    </div>'''

SEARCH_ROW = '''<input class="inp" type="text" value="bej" style="width: 190px;"><span class="chipb on">Beja</span><span class="meta">ou no mapa</span>'''

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
    <div class="meta" style="text-align: right; flex: none;">Maqueta v3 · iteração da Opção A · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta</div>
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

# ---------- A2 «Respira»: instrument follows scope; map contracts with depth ----------
A2_PAIS = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('pais')}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS</div>
        <h1 style="max-width: 15em;">Quatro limiares europeus ultrapassados.</h1>
        {strip(['amb','amb','amb','amb','cob','cob','out','out'])}
        {LEGEND}
        {PAIS_DEK}
        <div style="display: flex; align-items: center; gap: 14px;"><span class="chipb">▸ Medidas · catálogo</span>{PAIS_NOTE}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        {circles(360)}
        {MAP_APPARATUS}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 24px;">
      {''.join(TILES_PAIS)}
    </div>
  </div>'''

A2_REGIAO = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('regiao', extra='<span class="chipb">Grande Lisboa</span><span class="chipb">Península de Setúbal</span><span class="chipb">Algarve</span><span class="chipb">Madeira</span><span class="chipb on">Alentejo</span>')}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">ALENTEJO · REGIÃO · RÉGUA DA CONVERGÊNCIA · 1 MEDIDA</div>
        <h1 style="max-width: 16em;">Alentejo, 23 pontos abaixo da média da UE-27.</h1>
        <div style="display: flex; align-items: center; gap: 10px;"><span style="width: 16px; height: 16px; display: inline-block; flex: none; border: 1px solid var(--ink);"></span><span class="meta">uma medida regional · índice de PIB per capita · sem limiar (a média é referência) · distância calculada</span></div>
        <p style="font-size: 19px; line-height: 1.45; max-width: 34em;">PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100. É a única linha regional no livro-razão de hoje: as medidas do painel europeu são nacionais e as municipais são por concelho.</p>
      </div>
      {RULER_ALENTEJO}
    </div>
  </div>'''

A2_EVORA = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('municipio', dens='leitura', extra='<input class="inp" type="text" value="évora" style="width: 150px;"><span class="chipb on">Évora · com página</span>')}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 200px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">ÉVORA · MUNICÍPIO · DISTRITO DE ÉVORA · 8 MEDIDAS · LEITURA BREVE</div>
        <h1 style="max-width: 16em;">Oito medidas do concelho, cada uma com a sua linha.</h1>
        {strip(['out','cob','out','out','out','cob','out','out'])}
        <p class="prosa" style="max-width: 60ch;">Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.</p>
      </div>
      {stamp(sel='Évora', w=150, caption='Évora · distrito de Évora · 1/308 com página · CAOP 2025', link='trocar de concelho')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 28px; row-gap: 8px; border-top: 1px solid var(--ink); padding-top: 8px; margin-top: 20px;">
      {OPEN_POP}
      {OPEN_PC}
    </div>
    <div style="display: flex; align-items: center; justify-content: center; color: var(--g2); font-size: 22px; letter-spacing: .3em; padding: 10px 0;">· · ·</div>
  </div>'''

A2 = A2_PAIS + divider('O INSTRUMENTO SEGUE O ÂMBITO · REGIÃO (ALENTEJO): A RÉGUA, NÃO O MAPA') + A2_REGIAO + divider('AO APROFUNDAR, O MAPA ENCOLHE PARA SELO · ÉVORA EM LEITURA BREVE') + A2_EVORA
nota_A2 = ('Iteração A2 · «Respira». O instrumento da cabeça segue o âmbito: País = o mapa inteiro com a sua ficha (é a porta e a prova de cobertura); '
           'Região = a régua da convergência (as regiões não se desenham em pontos de concelho — não fingimos no mapa o que a fonte não publica); '
           'Município escolhido e leitura mais funda = o mapa encolhe para um selo-localizador (onde estou, e a porta «trocar de concelho»). '
           'O mapa nunca aparece duas vezes e nunca fica maior do que o seu trabalho.')

# ---------- A3 «Selo»: stamp always; expands only while choosing ----------
A3_PAIS = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('pais')}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 200px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS</div>
        <h1 style="max-width: 15em;">Quatro limiares europeus ultrapassados.</h1>
        {strip(['amb','amb','amb','amb','cob','cob','out','out'])}
        {LEGEND}
        {PAIS_DEK}
        <div style="display: flex; align-items: center; gap: 14px;"><span class="chipb">▸ Medidas · catálogo</span>{PAIS_NOTE}</div>
      </div>
      {stamp(sel=None, w=150, caption='1/308 municípios com estudo publicado · CAOP 2025', link='abrir um concelho')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 24px;">
      {''.join(TILES_PAIS)}
    </div>
  </div>'''

A3_ESCOLHA = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('municipio', extra=SEARCH_ROW)}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 56px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">BEJA · MUNICÍPIO · DISTRITO DE BEJA · 0 MEDIDAS</div>
        <h1 style="max-width: 16em;">Ainda sem linhas para Beja.</h1>
        {strip(['dash']*6)}
        <div class="meta">seis medidas das fontes nacionais · por ler</div>
        <p style="font-size: 19px; line-height: 1.45; max-width: 34em;">Beja, distrito de Beja. O ponto marca a posição do município, não representa cobertura. Seis das medidas de Évora vêm de organismos que publicam para todos os concelhos; quando forem lidas para Beja, entram aqui com fonte e data de leitura.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        {circles(360, sel='Beja')}
        {MAP_APPARATUS}
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 24px;">
      {EMPTY_BEJA}
    </div>
  </div>'''

A3 = A3_PAIS + divider('SÓ AO ESCOLHER UM CONCELHO O SELO CRESCE PARA MAPA · MUNICÍPIO (BEJA)') + A3_ESCOLHA
nota_A3 = ('Iteração A3 · «Selo». O mapa é sempre pequeno — um selo cartográfico ao lado do título, a marca reconhecível do sítio e o localizador — '
           'e só cresce para mapa inteiro quando a geografia é a interface: ao escolher um concelho. A cabeça do País fica quase toda tipográfica; '
           'a ficha do mapa (contagens, CAOP) só aparece no modo de escolha.')

# ---------- A4 «Só quando serve»: no map at all except while choosing ----------
A4_PAIS = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('pais')}
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 48px; align-items: start; padding-top: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="lab">PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS</div>
        <h1 style="max-width: 15em;">Quatro limiares europeus ultrapassados.</h1>
        {strip(['amb','amb','amb','amb','cob','cob','out','out'])}
        {LEGEND}
        {PAIS_DEK}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; padding-top: 8px;">
        {PAIS_NOTE}
        <span class="chipb" style="align-self: flex-start;">▸ Medidas · catálogo</span>
        <span class="chipb" style="align-self: flex-start;">▸ Abrir um concelho · escrever o nome ou escolher no mapa</span>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 24px;">
      {''.join(TILES_PAIS)}
    </div>
  </div>'''

A4_EVORA = f'''  <div style="display: flex; flex-direction: column; gap: 0;">
    {command_row('municipio', extra='<input class="inp" type="text" value="évora" style="width: 150px;"><span class="chipb on">Évora · com página</span>')}
    <div style="display: flex; flex-direction: column; gap: 16px; padding-top: 20px;">
      <div class="lab">ÉVORA · MUNICÍPIO · DISTRITO DE ÉVORA · 8 MEDIDAS</div>
      <h1 style="max-width: 18em;">Oito medidas do concelho, cada uma com a sua linha.</h1>
      {strip(['out','cob','out','out','out','cob','out','out'])}
      <p class="prosa" style="max-width: 66ch;">Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px; margin-top: 20px;">
      {''.join(TILES_EVORA)}
    </div>
  </div>'''

A4 = A4_PAIS + divider('ÂMBITO ESCOLHIDO: SEM MAPA EM NENHUMA DENSIDADE · ÉVORA') + A4_EVORA
nota_A4 = ('Iteração A4 · «Só quando serve». Sem mapa na cabeça: no País a porta é um botão («abrir um concelho»); o mapa inteiro só existe '
           'dentro do modo de escolha (como na A3) e desaparece por completo assim que o âmbito está escolhido — Évora lê-se sem geografia. '
           'É o extremo da remoção: pouparia a cabeça, mas perde a referência reconhecível e a prova de cobertura à entrada.')

(ROOT / 'OpcaoA2.dc.html').write_text(board(A2, nota_A2), encoding='utf-8')
(ROOT / 'OpcaoA3.dc.html').write_text(board(A3, nota_A3), encoding='utf-8')
(ROOT / 'OpcaoA4.dc.html').write_text(board(A4, nota_A4), encoding='utf-8')
for f in ['OpcaoA2', 'OpcaoA3', 'OpcaoA4']:
    s = (ROOT / (f + '.dc.html')).read_text(encoding='utf-8')
    print(f, len(s), 'divs', s.count('<div'), s.count('</div>'))
