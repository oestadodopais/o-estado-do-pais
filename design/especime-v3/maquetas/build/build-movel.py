# V3Movel.dc.html — the v3 home at 390px, built to the mobile checklist from the
# Opus critique: scope as destinations (not a switch); one two-state density control;
# rows, numbers first; the seal as the largest tap target of each row, never nested;
# no map as selector (sentence + search; the stamp only as the identity mark);
# the convergence rule as an ordered list; values sized by glyph count.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
completo = (ROOT / 'V3Completo.dc.html').read_text(encoding='utf-8')
CSS = completo[completo.find('<style>')+len('<style>'):completo.find('</style>')]

MCSS = '''
    .mrow { border-bottom: 1px solid var(--g3); padding: 14px 0 12px 0; display: flex; flex-direction: column; gap: 6px; }
    .mval { font-family: "Bitter", Georgia, serif; font-variant-numeric: tabular-nums lining-nums; font-weight: 500; line-height: 1; }
    .mseal { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 14px; border: 1px solid var(--ink); font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink); text-decoration: none; }
    .mseal::before { content: ""; width: 9px; height: 9px; background: var(--ink); display: inline-block; }
    .mopen { display: inline-flex; align-items: center; min-height: 44px; padding: 0 14px; border: 1px solid var(--g2); font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink); }
    .mseg { flex: 1; text-align: center; font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 600; padding: 13px 0; border: 1px solid var(--ink); }
    .mseg + .mseg { border-left: none; }
    .mdest { display: inline-flex; align-items: center; min-height: 44px; padding: 0 14px; border: 1px solid var(--g2); font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; color: var(--ink); text-decoration: none; }
'''

def sq(kind, n, label):
    m = {'amb': 'background: var(--amb); border: 1px solid #17191B;', 'out': 'border: 1px solid var(--ink);'}
    sqs = ''.join(f'<span style="width: 13px; height: 13px; display: inline-block; flex: none; {m[kind]}"></span>' for _ in range(n))
    return f'<span style="display: inline-flex; align-items: center; gap: 3px;">{sqs}<span class="lab" style="color: var(--ink); padding-left: 5px; font-size: 10px;">{label}</span></span>'

def row(value, vsize, word, wcolor, name, meta, open_extra='', marker='out'):
    mk = 'background: var(--amb); border: 1px solid #17191B;' if marker == 'amb' else ('background: var(--cob);' if marker == 'cob' else 'border: 1px solid #17191B;')
    return f'''<div class="mrow">
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px;">
    <div class="mval" style="font-size: {vsize}px;">{value}</div>
    <div style="display: flex; align-items: center; gap: 7px;"><span style="width: 12px; height: 12px; display: inline-block; flex: none; {mk}"></span><span class="est" style="color: {wcolor}; font-size: 10px; text-align: right;">{word}</span></div>
  </div>
  <div class="nome" style="font-size: 18px;">{name}</div>
  <div class="meta">{meta}</div>
  {open_extra}
  <div style="display: flex; gap: 10px; padding-top: 4px;">
    <a class="mseal" href="#">fonte</a>
    <span class="mopen">▸ abrir</span>
  </div>
</div>'''

RULER_DIVIDA = '''<div style="position: relative; padding-top: 14px; margin-top: 2px;">
    <div class="k" style="position: absolute; top: 0; left: 0; font-weight: 400; font-size: 10px;">0</div>
    <div class="k" style="position: absolute; top: 0; right: 0; font-weight: 400; font-size: 10px;">120</div>
    <div class="k" style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); font-weight: 400; font-size: 10px;">limiar 60</div>
    <svg viewBox="0 0 600 30" width="100%" height="28" preserveAspectRatio="xMinYMid meet" style="display: block; overflow: visible;">
      <line x1="0" y1="16" x2="600" y2="16" stroke="#D9DDD8" stroke-width="1"></line>
      <rect x="300" y="13" width="148.5" height="6" fill="#E0A21A"></rect>
      <line x1="300" y1="0" x2="300" y2="30" stroke="#17191B" stroke-width="3"></line>
      <line x1="448.5" y1="6" x2="448.5" y2="26" stroke="#17191B" stroke-width="2"></line>
    </svg>
  </div>
  <div class="slab" style="font-size: 11px; font-weight: 600; letter-spacing: .04em; color: var(--ocre);">▲ ACIMA DO LIMIAR 60 · +29,7</div>
  <div style="font-size: 15px; line-height: 1.5;">Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer.</div>'''

ROWS = [
 row('89,7', 44, 'LIMIAR 60 · ACIMA', 'var(--ocre)', 'Dívida pública', '% do PIB · 2025 · Eurostat · tipsgo10 · lido 2026-08-12', RULER_DIVIDA, 'amb'),
 row('−50,2', 40, 'LIMIAR −35 · ABAIXO', 'var(--ocre)', 'Posição de investimento internacional', '% do PIB · 2025 · Eurostat · tipsii10 · lido 2026-08-12', '', 'amb'),
 row('21,3', 44, 'LIMIAR 9 · ACIMA', 'var(--ocre)', 'Custo unitário do trabalho', 'variação em três anos, % · 2025 · Eurostat · tipslm10', '', 'amb'),
 row('17,6', 44, 'LIMIAR 9 · ACIMA', 'var(--ocre)', 'Preços da habitação', 'variação anual, % · 2025 · Eurostat · tipsho20', '', 'amb'),
 row('79,6', 44, 'ACIMA DA MÉDIA UE · SEM LIMIAR', 'var(--g1)', 'Taxa de emprego', '% da população dos 20 aos 64 anos · 2025 · Eurostat · lfsi_emp_a', '', 'out'),
 row('57,9', 44, 'DESTAQUE NO PAINEL SOCIAL · SEM LIMIAR', 'var(--g1)', 'Crianças em creche', '% das crianças com menos de 3 anos · 2025 · Eurostat · tepsr_sp210', '', 'out'),
 row('6,1', 44, 'SEM LIMIAR', 'var(--g1)', 'Abandono escolar precoce', '% dos 18 aos 24 anos · 2025 · Eurostat · edat_lfse_14', '', 'out'),
 row('6,3', 44, 'ABAIXO DA MÉDIA UE · SEM LIMIAR', 'var(--g1)', 'Sobrecarga do custo da habitação', '% da população · 2025 · Eurostat · tespm140', '', 'out'),
]

def conv_row(name, v, bold=False):
    w = 'font-weight: 600;' if bold else ''
    return f'''<div style="display: flex; justify-content: space-between; align-items: baseline; padding: 9px 0; border-bottom: 1px solid var(--g3);">
      <div style="font-size: 15px; {w}">{name}</div>
      <div class="mval" style="font-size: 18px; {w}">{v}</div>
    </div>'''

CONV = f'''<div style="display: flex; flex-direction: column;">
  {conv_row('Grande Lisboa', '129')}
  <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 3px solid var(--ink);">
    <div class="lab" style="color: var(--ink);">UE-27 = 100 · a referência</div>
  </div>
  {conv_row('Algarve', '89')}
  {conv_row('Madeira', '88')}
  {conv_row('Portugal', '82', True)}
  {conv_row('Alentejo', '77')}
  {conv_row('Península de Setúbal', '55')}
</div>'''

BODY = f'''<div class="pg" style="width: 390px; box-sizing: border-box; min-height: 100vh; padding: 18px 18px 28px 18px; display: flex; flex-direction: column; gap: 20px;">

  <!-- cabeça compacta -->
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--g3); padding-bottom: 10px;">
      <span class="nav">Menu</span><span class="nav">English</span>
    </div>
    <div style="font-size: 30px; font-weight: 500; line-height: 1.05;">O Estado do País</div>
    <div class="g1" style="font-style: italic; font-size: 14px;">Portugal, medido. Cada número tem fonte.</div>
    <div style="display: flex; align-items: center; gap: 7px;">
      <span style="width: 10px; height: 10px; background: var(--cob); display: inline-block; flex: none;"></span>
      <span class="sl" style="font-size: 10px; letter-spacing: .06em; font-weight: 600;">PAINEL EUROPEU RECONFERIDO A 2026-08-17</span>
    </div>
    <div class="rulei"></div>
  </div>

  <!-- âmbito como destinos; sem interruptor -->
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div class="lab">PORTUGAL · PAINEL EUROPEU · 8 MEDIDAS</div>
    <h1 style="font-size: 27px; line-height: 1.15;">Quatro limiares europeus ultrapassados.</h1>
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">{sq('amb', 4, 'fora do limiar')}{sq('out', 4, 'sem limiar')}</div>
    <p style="font-size: 16px; line-height: 1.5;">Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele. Painel de 2025, lido do Eurostat a 2026-08-12.</p>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <a class="mdest" href="#">Ver uma região →</a>
      <a class="mdest" href="#">Abrir um concelho →</a>
    </div>
  </div>

  <!-- densidade: um só controlo, dois estados -->
  <div style="display: flex;">
    <span class="mseg" style="background: var(--ink); color: var(--paper);">Relance</span>
    <span class="mseg">Leitura breve</span>
  </div>

  <!-- as oito medidas · linhas, números primeiro; primeira aberta -->
  <div style="display: flex; flex-direction: column; border-top: 1px solid var(--ink);">
    {''.join(ROWS)}
  </div>
  <div class="meta">O recibo completo de cada medida está na sua linha do livro-razão, pela porta «fonte».</div>

  <!-- cobertura municipal: frase + pesquisa; o mapa não é seletor no telemóvel -->
  <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--ink); padding-top: 14px;">
    <div class="lab">Municípios</div>
    <p style="font-size: 16px; line-height: 1.5;">1 dos 308 concelhos tem página com medidas: Évora. Os restantes 307 marcam só a sua posição. O mapa dos 308 pontos vive na versão de secretária e na escolha de concelho; aqui, a pesquisa é o caminho.</p>
    <input class="inp" type="text" placeholder="Escreva o nome do concelho" style="width: 100%; box-sizing: border-box; min-height: 44px;">
    <div style="display: flex; align-items: center; gap: 10px;"><a class="mseal" href="#">fonte</a><span class="meta">DGT, CAOP 2025 · lido a 2026-08-12 · <span class="pv">[a verificar]</span></span></div>
  </div>

  <!-- régua da convergência como lista ordenada -->
  <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--ink); padding-top: 14px;">
    <div class="lab">A régua da convergência · PIB per capita · UE-27 = 100 · 2024</div>
    {CONV}
    <div style="display: flex; align-items: center; gap: 10px;"><a class="mseal" href="#">fonte</a><span class="meta">Eurostat · nama_10r_2gdp · lido 2026-08-13</span></div>
  </div>

  <!-- porta de correções -->
  <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--ink); padding-top: 14px;">
    <div class="lab">Encontrou um erro</div>
    <p style="font-size: 15px; line-height: 1.55;">Escreva para correcoes@oestadodopais.pt. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.</p>
  </div>

  <!-- rodapé -->
  <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--g3); padding-top: 12px;">
    <p class="prosa" style="font-size: 13px;">Produzido maioritariamente por inteligência artificial, com o mínimo de intervenção humana. A direção é de Nuno dos Santos.</p>
    <div class="meta">Maqueta v3 · telemóvel 390 · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta · os substitutos Google não têm versaletes (smcp) nem algarismos antigos (onum); Bitter tem algarismos tabulares (tnum) · valores publicados a 2026-08-18</div>
  </div>
</div>'''

OUT = f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Bitter:ital,wght@0,100..900;1,100..900&display=swap">
  <style>{CSS}{MCSS}</style>
</helmet>
{BODY}
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":390,"height":3400}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
(ROOT / 'V3Movel.dc.html').write_text(OUT, encoding='utf-8')
print('V3Movel', len(OUT), 'divs', OUT.count('<div'), OUT.count('</div>'))
