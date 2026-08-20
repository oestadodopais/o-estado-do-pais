# Builds V3Completo.dc.html: the v3 home in full — v1 masthead, scope-aware lede,
# scope bar (País · Região · Município) with mini-map, catalogue of measures,
# three-density panel, instruments (convergence rule static; map as picker),
# municípios, estudos, agenda, correction door, footer.
# Every value/text is the published one (see oedp-brief.md and saved row pages).
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
inicio = (ROOT / 'Inicio.dc.html').read_text(encoding='utf-8').split('\n')
v3 = (ROOT / 'V3Prototipo.dc.html').read_text(encoding='utf-8')
pontos = json.load(open(ROOT.parent / 'oedp-redesign' / 'pontos.json', encoding='utf-8'))

def lines(a, b):  # 1-based inclusive
    return '\n'.join(inicio[a-1:b])

# ---- static transplants from v1 Início ----
INSTR1 = lines(247, 315)                     # instrumento 1 (whole section)
MAP_RIGHT = lines(382, 427)                  # right column of instrumento 2 (texts, counts)
TAIL = lines(431, 569)                       # municípios · estudos · agenda · porta · rodapé (without closing root)
TAIL = TAIL.replace('Maqueta · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta · valores publicados a 2026-08-18',
                    'Maqueta v3 · protótipo · tipos substitutos: Spectral por Parnaso, Bitter por Sebenta · valores publicados a 2026-08-18')

# ---- CSS: v1 stylesheet + v3 additions ----
v1_css_start = inicio.index('  <style>')
v1_css_end = inicio.index('  </style>')
V1_CSS = '\n'.join(inicio[v1_css_start+1:v1_css_end])
# v3 additions (from V3Prototipo): tile, open, row, dens/seg, k, field, slab, abrir
V3_CSS = '''
    .k { font-family: "Bitter", Georgia, serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--g1); font-weight: 600; font-variant-numeric: tabular-nums lining-nums; }
    .field { font-family: "Bitter", Georgia, serif; font-size: 13px; }
    .slab { font-family: "Bitter", "Rockwell", Georgia, serif; font-variant-numeric: tabular-nums lining-nums; }
    .dens { display: inline-flex; }
    .seg { font-family: "Bitter", Georgia, serif; font-size: 12px; line-height: 1; letter-spacing: .08em; text-transform: uppercase; font-weight: 600; padding: 8px 12px; border: 1px solid var(--ink); cursor: pointer; user-select: none; }
    .seg + .seg { border-left: none; }
    .sq { width: 11px; height: 11px; display: inline-block; flex: none; vertical-align: middle; margin-right: 6px; }
    .tile { cursor: pointer; padding: 14px 16px 16px 16px; display: flex; flex-direction: column; gap: 8px; min-height: 268px; border: 2px solid var(--g3); background-color: var(--paper); }
    .tile:hover, .tile.hov { border-width: 3px; padding: 13px 15px 15px 15px; }
    .tile:hover .abrir, .tile.hov .abrir { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
    .tile .num { font-size: 80px; line-height: 1; padding-top: 6px; }
    .tile .num.long { font-size: 52px; padding-top: 18px; padding-bottom: 12px; }
    .open { cursor: pointer; border-top: 2px solid var(--g2); padding: 16px 4px 18px 4px; display: flex; flex-direction: column; gap: 10px; }
    .frow { cursor: pointer; border-bottom: 1px solid var(--g3); padding: 12px 4px; display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
    .chipb { font-family: "Bitter", Georgia, serif; font-size: 12px; letter-spacing: .04em; border: 1px solid var(--g2); padding: 7px 11px; color: var(--ink); background: transparent; cursor: pointer; user-select: none; }
    .chipb.on { background: var(--ink); border-color: var(--ink); color: var(--paper); }
    .chipb.lit { border-color: var(--ink); }
    .cat { border: 1px solid var(--ink); padding: 18px 20px 20px 20px; display: flex; flex-direction: column; gap: 14px; background: var(--paper); }
    .catrow { display: grid; grid-template-columns: 22px minmax(0, 1.5fr) 110px minmax(0, 1fr) 190px; gap: 12px; align-items: center; padding: 7px 0; border-bottom: 1px solid var(--g3); cursor: pointer; }
    .catrow:hover { background: var(--paper); }
    .box { width: 12px; height: 12px; border: 1px solid var(--ink); display: inline-block; }
    .box.on { background: var(--ink); }
    .inp { font-family: "Bitter", Georgia, serif; font-size: 13px; padding: 8px 10px; border: 1px solid var(--g2); background: var(--paper); color: var(--ink); width: 300px; outline: none; }
    .inp:focus { border-color: var(--ink); }
    .empty { border: 2px dashed var(--g2); padding: 22px 24px; display: flex; flex-direction: column; gap: 10px; grid-column: span 4; }
    .abrir { }
'''

# ---- panel branches (Leitura and Fundo) generalised from V3Prototipo ----
def between(s, a, b):
    i = s.find(a); j = s.find(b, i)
    assert i >= 0 and j >= 0, (a, b)
    return s[i:j]
LEITURA = between(v3, '      <sc-if value="{{ b.isLeitura }}"', '      <sc-if value="{{ b.isFundo }}"')
FUNDO = between(v3, '      <sc-if value="{{ b.isFundo }}"', '    </sc-for>')
# generalise: ruler only when hasRuler; seal meta; leitura sentence
LEITURA = LEITURA.replace('<div class="k">{{ b.unit }} · {{ b.period }} · Eurostat, {{ b.code }} · lido 2026-08-12</div>',
                          '<div class="k">{{ b.unit }} · {{ b.period }} · {{ b.src }} · lido {{ b.read }}</div>')
LEITURA = LEITURA.replace('          <div style="position: relative; padding-top: 16px; margin-top: 4px;">',
                          '          <sc-if value="{{ b.hasRuler }}" hint-placeholder-val="{{ true }}">\n          <div style="position: relative; padding-top: 16px; margin-top: 4px;">')
LEITURA = LEITURA.replace('            </svg>\n          </div>\n          <div class="slab" style="{{ b.stateStyle }}">{{ b.state }}</div>',
                          '            </svg>\n          </div>\n          </sc-if>\n          <div class="slab" style="{{ b.stateStyle }}">{{ b.state }}</div>')
LEITURA = LEITURA.replace('<div style="font-size: 16px; line-height: 1.5;">{{ b.short }} <a class="selo" href="#">fonte</a></div>',
                          '<div style="font-size: 16px; line-height: 1.5;">{{ b.sentence }} <a class="selo" href="#">fonte</a></div>')
assert 'hasRuler' in LEITURA and 'b.sentence' in LEITURA and 'b.src' in LEITURA
FUNDO = FUNDO.replace('{{ b.unit }} · {{ b.period }} · Eurostat, {{ b.code }}</div></div>', '{{ b.unit }} · {{ b.period }} · {{ b.src }}</div></div>')
FUNDO = FUNDO.replace('            <div style="position: relative; padding-top: 14px; width: 300px;">',
                      '            <div style="width: 300px;"><sc-if value="{{ b.hasRuler }}" hint-placeholder-val="{{ true }}"><div style="position: relative; padding-top: 14px; width: 300px;">')
FUNDO = FUNDO.replace('              </svg>\n            </div>\n            <div class="slab" style="{{ b.stateStyle }}">{{ b.state }}</div>',
                      '              </svg>\n            </div></sc-if></div>\n            <div class="slab" style="{{ b.stateStyle }}">{{ b.state }}</div>')
FUNDO = FUNDO.replace('<div class="field">Lido a 2026-08-12 · Reconferido a <span style="border: 1px dashed #17191B; padding: 1px 5px;">[a verificar]</span></div>',
                      '<div class="field">Lido a {{ b.read }} · Reconferido a <span style="border: 1px dashed #17191B; padding: 1px 5px;">[a verificar]</span></div>')
FUNDO = FUNDO.replace('<div class="k" style="margin-top: 6px;">Prova · campo devolvido</div>', '<div class="k" style="margin-top: 6px;">{{ b.provaLabel }}</div>')
FUNDO = FUNDO.replace('<div style="font-size: 13px; color: #585D5B;">Transcrito da fonte, palavra por palavra.</div>', '<div style="font-size: 13px; color: #585D5B;">{{ b.provaNote }}</div>')
FUNDO = FUNDO.replace('<div class="row" style="grid-column: span 4;"', '<div class="frow" style="grid-column: span 4;"')
FUNDO = FUNDO.replace('grid-template-columns: minmax(220px, 1.4fr) 84px 300px 210px 64px;', 'grid-template-columns: minmax(200px, 1.2fr) 130px 300px 210px 64px;')
FUNDO = FUNDO.replace('<div class="slab" style="font-size: 26px; text-align: right;">{{ b.value }}</div>', '<div class="slab" style="font-size: 26px; text-align: right; white-space: nowrap;">{{ b.value }}</div>')
assert 'class="frow"' in FUNDO and '130px 300px' in FUNDO
assert FUNDO.count('hasRuler') == 1 and 'b.read' in FUNDO and 'provaLabel' in FUNDO

RELANCE = '''      <sc-if value="{{ b.isRelance }}" hint-placeholder-val="{{ true }}">
        <div class="tile" style="{{ b.tileStyle }}" onClick="{{ b.toggle }}">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; min-width: 0;"><span style="{{ b.sqStyle }}"></span><span class="est" style="{{ b.wordStyle }}">{{ b.pill }}</span></div>
            <span class="lab abrir" style="flex: none;">▸ abrir</span>
          </div>
          <div class="{{ b.numClass }}">{{ b.value }}</div>
          <div class="lab">{{ b.unit }} · {{ b.period }}</div>
          <div class="nome" style="font-size: 21px; padding-top: 4px;">{{ b.label }}</div>
          <div class="prosa" style="font-size: 14.5px; line-height: 1.45;">{{ b.shortRel }}</div>
          <div style="margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 6px;"><a class="selo" href="#">fonte</a><span class="meta">{{ b.src }}</span></div>
        </div>
      </sc-if>
'''

# ---- masthead (v1) ----
MASTHEAD = lines(51, 79)

# ---- map circles (sc-for) ----
MAP_SVG = '''      <svg viewBox="0 0 600 790" width="460" height="606" style="display: block; overflow: visible;">
        <rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
        <rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
        <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
          <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.r }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="{{ p.sw }}" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
        </sc-for>
      </svg>'''
MINI_MAP = '''      <svg viewBox="0 0 600 790" width="190" height="250" style="display: block; overflow: visible;">
        <rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
        <rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
        <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
          <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.rm }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="{{ p.swm }}" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
        </sc-for>
      </svg>'''

HEAD = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Spectral+SC:wght@400;600&family=Bitter:ital,wght@0,100..900;1,100..900&display=swap">
  <style>
''' + V1_CSS + V3_CSS + '''  </style>
</helmet>
<div class="pg" style="width: 1280px; min-height: 100vh; box-sizing: border-box; background: var(--paper); padding: 34px 48px 44px 48px; display: flex; flex-direction: column; gap: 30px;">

''' + MASTHEAD + '''

  <!-- LEDE · a figura de entrada, sensível ao âmbito -->
  <div style="display: flex; flex-direction: column; gap: 18px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="lab">{{ ledeLabel }}</div>
      <div class="dens">
        <span class="seg" style="{{ segRel }}" onClick="{{ setRelance }}">Relance</span>
        <span class="seg" style="{{ segLei }}" onClick="{{ setLeitura }}">Leitura breve</span>
        <span class="seg" style="{{ segFun }}" onClick="{{ setFundo }}">Fundo</span>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 430px minmax(0, 1fr); gap: 56px; align-items: end;">
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div class="num" style="font-size: 172px; line-height: .88;">{{ ledeFig }}</div>
        <div style="display: flex; align-items: flex-start; gap: 12px; font-size: 30px; font-weight: 500; line-height: 1.12; max-width: 12em;"><span style="{{ ledeSqStyle }}"></span><span>{{ ledeCaption }}</span></div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; max-width: 34em; padding-bottom: 8px;">
        <p style="font-size: 20px; line-height: 1.42;">{{ ledeText }}</p>
        <div class="lab" style="display: flex; gap: 22px; flex-wrap: wrap; color: var(--ink);">
          <span><span class="sq" style="background: var(--amb);"></span>Âmbar · fora do limiar</span>
          <span><span class="sq" style="background: var(--cob);"></span>Cobalto · do lado bom da referência</span>
          <span><span class="sq" style="border: 1px solid var(--ink);"></span>Sem limiar</span>
        </div>
        <p class="prosa">{{ ledeNote }}</p>
      </div>
    </div>
  </div>

  <!-- ÂMBITO · País · Região · Município, com o mapa como seletor -->
  <div style="display: flex; flex-direction: column; gap: 14px; border-top: 1px solid var(--ink); padding-top: 18px;">
    <div style="display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 48px; align-items: start;">
      <div style="display: flex; flex-direction: column; gap: 14px; min-height: 250px; justify-content: space-between;">
        <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
          <div class="lab">Âmbito</div>
          <div class="dens">
            <span class="seg" style="{{ segPais }}" onClick="{{ setPais }}">País</span>
            <span class="seg" style="{{ segReg }}" onClick="{{ setRegiaoMode }}">Região</span>
            <span class="seg" style="{{ segMun }}" onClick="{{ setMunicipioMode }}">Município</span>
          </div>
          <div class="est" style="color: var(--ink);">{{ scopeReading }}</div>
        </div>
        <sc-if value="{{ showRegions }}" hint-placeholder-val="{{ true }}">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <sc-for list="{{ regions }}" as="r" hint-placeholder-count="5">
              <span class="{{ r.cls }}" onClick="{{ r.pick }}">{{ r.name }}</span>
            </sc-for>
            <span class="meta">As cinco regiões que o sítio publica na régua da convergência.</span>
          </div>
        </sc-if>
        <sc-if value="{{ showMunicipios }}" hint-placeholder-val="{{ true }}">
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <input class="inp" type="text" placeholder="Escreva o nome do concelho" value="{{ query }}" onInput="{{ setQuery }}">
              <span class="meta">ou toque num ponto do mapa · 308 concelhos · 1 com página</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <sc-for list="{{ results }}" as="m" hint-placeholder-count="6">
                <span class="{{ m.cls }}" onClick="{{ m.pick }}">{{ m.name }}</span>
              </sc-for>
            </div>
          </div>
        </sc-if>
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
          <span class="chipb" onClick="{{ toggleCat }}">{{ catLabel }}</span>
          <sc-if value="{{ isCustom }}" hint-placeholder-val="{{ true }}">
            <span class="chipb" onClick="{{ resetPanel }}">Repor o painel do âmbito</span>
          </sc-if>
          <span class="meta">O painel mostra as medidas do âmbito; o catálogo acrescenta ou retira medidas, de qualquer âmbito, sem perder a fonte de cada uma.</span>
        </div>
        <sc-if value="{{ catOpen }}" hint-placeholder-val="{{ true }}">
          <div class="cat">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px;">
              <div style="font-size: 20px; font-weight: 500;">Catálogo de medidas</div>
              <div class="meta">{{ catCounts }}</div>
            </div>
            <sc-for list="{{ groups }}" as="g" hint-placeholder-count="3">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div class="lab" style="padding-top: 6px;">{{ g.name }}</div>
                <sc-for list="{{ g.items }}" as="c" hint-placeholder-count="8">
                  <div class="catrow" onClick="{{ c.toggle }}">
                    <span class="{{ c.boxCls }}"></span>
                    <div style="font-size: 16px; font-weight: 500;">{{ c.label }}</div>
                    <div class="slab" style="font-size: 16px; text-align: right;">{{ c.value }}</div>
                    <div class="meta">{{ c.unit }} · {{ c.period }}</div>
                    <div style="display: flex; align-items: center; gap: 8px;"><span style="{{ c.sqStyle }}"></span><span class="est" style="{{ c.wordStyle }}">{{ c.pill }}</span></div>
                  </div>
                </sc-for>
              </div>
            </sc-for>
            <div class="meta">Uma medida só entra no catálogo com linha no livro-razão; a cor segue a mesma regra do painel: só onde a fonte publica um limiar ou uma referência.</div>
          </div>
        </sc-if>
        </div>
      </div>
''' + MINI_MAP + '''
    </div>
  </div>

  <!-- PAINEL · as medidas do âmbito, na densidade escolhida -->
  <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 20px; row-gap: 20px; border-top: 1px solid var(--ink); padding-top: 20px;">
    <sc-if value="{{ isEmpty }}" hint-placeholder-val="{{ true }}">
      <div class="empty">
        <div class="est" style="color: var(--ink);">{{ emptyTitle }}</div>
        <p style="font-size: 17px; max-width: 70ch;">{{ emptyText }}</p>
        <div class="meta">O ponto marca a posição do município (CAOP 2025, DGT); não representa cobertura. Quando houver linhas, entram aqui com fonte e data de leitura.</div>
      </div>
    </sc-if>
    <sc-for list="{{ items }}" as="b" hint-placeholder-count="8">

''' + RELANCE + '\n' + LEITURA + '\n' + FUNDO + '''
    </sc-for>
  </div>

''' + INSTR1 + '''

  <!-- INSTRUMENTO 2 · O PAÍS EM PONTOS (o mesmo mapa, agora seletor) -->
  <div style="display: flex; flex-direction: column; gap: 22px;">
    <div class="rule2"></div>
    <div style="display: grid; grid-template-columns: 460px minmax(0, 1fr); gap: 48px; align-items: start;">

''' + MAP_SVG + '''

''' + MAP_RIGHT + '''
    </div>
  </div>

''' + TAIL + '''

</div>
</x-dc>
'''

# ---- data ----
v2script = v3[v3.find('const BLOCKS = ['):v3.find('const SHORT_REL')]
SHORT_REL = ["Acima do limiar do painel europeu, e a descer.",
  "O que o país tem a haver do exterior menos o que lhe deve.",
  "Custo do trabalho por unidade produzida, por hora trabalhada.",
  "O limiar foi ultrapassado em 2024 e o excesso quase duplicou no ano seguinte.",
  "Acima da média da União: uma posição relativa, não um limiar.",
  "Das medidas em que Portugal mais se destaca no painel social.",
  "Era mais de um terço no início do século.",
  "Abaixo da média europeia, e só se lê ao lado do regime de propriedade."]
PILLS = ["Limiar 60 · acima", "Limiar −35 · abaixo", "Limiar 9 · acima", "Limiar 9 · acima", "Acima da média UE", "Destaque no painel social", "Sem limiar", "Abaixo da média UE"]
EU_IDS = ["divida-publica-2025","posicao-de-investimento-internacional-2025","custo-unitario-do-trabalho-2025","precos-da-habitacao-2025","taxa-de-emprego-2025","criancas-em-creche-2025","abandono-escolar-precoce-2025","sobrecarga-do-custo-da-habitacao-2025"]

# scale helper for rulers on 300 units
def rl(lo, hi, v, lim=None):
    f = lambda x: round((x - lo) / (hi - lo) * 300, 2)
    d = {"hasRuler": True, "valX": f(v), "barX": 0, "barW": f(v)}
    if lim is not None:
        d.update({"hasLimiar": True, "limX": f(lim)})
    else:
        d.update({"hasLimiar": False, "limX": 0})
    return d

def measure(**k):
    base = {"hasRuler": False, "hasLimiar": False, "limX": 0, "valX": 0, "barX": 0, "barW": 0, "minLabel": "", "maxLabel": "", "limLabel": "",
            "hasExcerpt": False, "excerpt": "", "provaLabel": "Prova · campo devolvido", "provaNote": "Transcrito da fonte, palavra por palavra.", "numClass": "num"}
    base.update(k)
    return base

EVORA = [
 measure(id="evora-populacao-2025", label="População residente", value="58 567", unit="pessoas", period="2025", src="INE · indicador 0012918", read="2026-08-10", kind="sem", pill="Contagem · sem limiar", state="CONTAGEM · SEM LIMIAR",
   shortRel="Estimativa anual do INE para o concelho.", sentence="A população residente subiu de 55 711 em 2021 para 58 567 em 2025.",
   attribution="Publicado por INE, em População residente (N.º) × sexo × grupo etário (indicador 0012918) · lido a 2026-08-10", hasExcerpt=True, excerpt="valor 58567"),
 measure(id="evora-poder-de-compra-2023", label="Poder de compra por habitante", value="111,47", unit="índice · média nacional = 100", period="2023", src="INE · indicador 0014580", read="2026-08-10", kind="dentro", pill="Acima da média nacional", state="ACIMA DA MÉDIA NACIONAL · +11,47",
   shortRel="Poder de compra per capita, publicado pelo INE para todos os concelhos.", sentence="O poder de compra por habitante está acima da média nacional, que é a base do índice: 111,47 no concelho, enquanto a sua região, o Alentejo Central, está abaixo dessa média, em 93,86.",
   attribution="Publicado por INE, em Poder de compra per capita (PT=100) (indicador 0014580) · lido a 2026-08-10", hasExcerpt=True, excerpt="valor 111.47",
   **rl(50, 150, 111.47, 100), minLabel="50", maxLabel="150", limLabel="média = 100"),
 measure(id="evora-desemprego-registado-2024", label="Desemprego registado", value="1 596", unit="pessoas", period="dezembro de 2024", src="IEFP · SIE, dezembro 2024", read="2026-08-10", kind="sem", pill="Contagem · sem limiar", state="CONTAGEM · SEM LIMIAR",
   shortRel="Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho.", sentence="O desemprego registado no fim de dezembro caiu de 3 720 pessoas em 2013 para 1 596 em 2024.",
   attribution="Publicado por Instituto do Emprego e Formação Profissional (IEFP), em SIE - Desemprego registado por concelhos (dezembro 2024) · lido a 2026-08-10", hasExcerpt=True, excerpt="series.registered_unemployment.values['2024'] = 1596", provaLabel="Prova · excerto"),
 measure(id="evora-empresas-2024", label="Empresas sediadas", value="7 907", unit="empresas", period="2024", src="INE · indicador 0014063", read="2026-08-10", kind="sem", pill="Contagem · sem limiar", state="CONTAGEM · SEM LIMIAR",
   shortRel="Sistema de contas integradas das empresas, por concelho da sede.", sentence="Estão sediadas no concelho 7 907 empresas.",
   attribution="Publicado por INE, em Empresas (N.º) × CAE divisão × forma jurídica (indicador 0014063) · lido a 2026-08-10", hasExcerpt=True, excerpt="valor 7907"),
 measure(id="evora-divida-dgal-2024", label="Dívida total do município", value="54 681 562", unit="euros", period="2024", src="DGAL · Evolução endividamento total", read="2026-08-10", kind="sem", pill="Montante · sem limiar", state="MONTANTE · O TETO APLICA-SE AO ÍNDICE", numClass="num long",
   shortRel="Série anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais.", sentence="A barra é a dívida total que o regulador publica para o concelho; o fio é o limite legal do mesmo ano. O índice mede uma contra o outro numa escala em que o teto é o valor permitido.",
   attribution="Publicado por Direção-Geral das Autarquias Locais (DGAL), em Evolução endividamento total (2024) · lido a 2026-08-10", hasExcerpt=True, excerpt="ÉVORA ÉVORA 77 764 656 55 559 123 877 561 0 54 681 562", provaLabel="Prova · excerto"),
 measure(id="evora-indice-de-divida-2024", label="Índice de dívida", value="105,5", unit="%, teto legal = 150", period="2024", src="calculado · DGAL", read="2026-08-10", kind="dentro", pill="Teto 150 · abaixo", state="▼ ABAIXO DO TETO LEGAL 150 · −44,5",
   shortRel="Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na linha.", sentence="O índice é 105,5% em 2024, contra um teto legal de 150%.",
   attribution="Linha calculada: 54 681 562 ÷ 77 764 656 × 150 = 105,5. O limite legal é 1,5 vezes a média da receita corrente líquida dos três anos anteriores (art. 52.º da Lei n.º 73/2013), e o índice mede a dívida contra esse limite numa escala em que o teto é 150.", hasExcerpt=True,
   excerpt="Esta linha não cita nenhuma frase: o valor é calculado a partir de outras linhas, e a prova documental é a delas.", provaLabel="Prova · aritmética", provaNote="Reavaliada em cada construção.",
   **rl(0, 200, 105.5, 150), minLabel="0", maxLabel="200", limLabel="teto 150"),
 measure(id="evora-execucao-da-receita-2025", label="Execução da receita", value="61,44", unit="% do orçamento", period="2025", src="Município de Évora · Prestação de Contas 2025, p. 111", read="2026-08-10", kind="sem", pill="Sem limiar", state="SEM LIMIAR",
   shortRel="Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central.", sentence="A execução da receita caiu de 96% do orçamento em 2021 para 61,44% em 2025.",
   attribution="Publicado por Município de Évora, em Prestação de Contas 2025 (2025), p. 111 · lido a 2026-08-10", hasExcerpt=True, excerpt="Total 109 483 314,95 67 263 297,08 61,44% Unidade: €uro", provaLabel="Prova · excerto",
   **rl(0, 100, 61.44), minLabel="0", maxLabel="100"),
 measure(id="evora-prazo-medio-de-pagamento-2025", label="Prazo médio de pagamento", value="137", unit="dias", period="2025", src="Município de Évora · Prestação de Contas 2025, p. 141", read="2026-08-10", kind="sem", pill="Sem limiar", state="SEM LIMIAR",
   shortRel="Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central.", sentence="O prazo médio de pagamento a fornecedores passou de 22 dias em 2023 para 137 dias em 2025, com 4 976 172,24 € de pagamentos em atraso no fim do ano.",
   attribution="Publicado por Município de Évora, em Prestação de Contas 2025 (2025), p. 141 · lido a 2026-08-10", hasExcerpt=True, excerpt="o PMP do Município de Évora é de 137 dias, mais 33 dias que no ano anterior. Pelo segundo ano consecutivo, o Município de Évora encerrou 2025 com pagamentos em atraso, no valor de 4.976.172,24 €.", provaLabel="Prova · excerto"),
]
REGIONS = [("grande-lisboa","Grande Lisboa",129),("peninsula-de-setubal","Península de Setúbal",55),("algarve","Algarve",89),("madeira","Madeira",88),("alentejo","Alentejo",77)]
def region_measure(rid, name, v):
    d = v - 100
    above = d > 0
    return measure(id="regiao-"+rid, label="PIB per capita · "+name, value=str(v), unit="índice · UE-27 = 100", period="2024", src="Eurostat · nama_10r_2gdp", read="2026-08-13",
        kind=("dentro" if above else "sem"), pill=("Acima da média UE-27" if above else "Abaixo da média UE-27"),
        state=(("▲ ACIMA DA MÉDIA UE-27 · +%d" % d) if above else ("ABAIXO DA MÉDIA UE-27 · −%d" % (-d))),
        shortRel="PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100.",
        sentence="%s está %d pontos %s da média da UE-27 (2024, calculado sobre o índice publicado)." % (name, abs(d), "acima" if above else "abaixo"),
        attribution="Publicado por Eurostat, em Gross domestic product (GDP) at current market prices by NUTS 2 region (nama_10r_2gdp, atualizado 2026-02-10) · lido a 2026-08-13", hasExcerpt=False,
        provaLabel="Prova", provaNote="", **rl(50, 130, v, 100), minLabel="50", maxLabel="130", limLabel="UE-27 = 100", region=name, dist=d)
REG_MEASURES = [region_measure(*r) for r in REGIONS]
PT_PIB = measure(id="pib-pc-portugal-2024", label="PIB per capita", value="82", unit="índice · UE-27 = 100", period="2024", src="Eurostat · nama_10r_2gdp", read="2026-08-13", kind="sem", pill="Abaixo da média UE-27", state="ABAIXO DA MÉDIA UE-27 · −18",
    shortRel="PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100.", sentence="Portugal está 18 pontos abaixo da média da UE-27.",
    attribution="Publicado por Eurostat, em Gross domestic product (GDP) at current market prices by NUTS 2 region (nama_10r_2gdp, atualizado 2026-02-10) · lido a 2026-08-13", hasExcerpt=True,
    excerpt="nama_10r_2gdp — unit PPS_HAB_EU27_2020 — geo PT (Portugal) — 2024: 82 p", **rl(50, 130, 82, 100), minLabel="50", maxLabel="130", limLabel="UE-27 = 100")

PONTOS_JS = json.dumps([{"x": p["x"], "y": p["y"], "m": p["m"], "d": p["d"], "lit": p["lit"]} for p in pontos], ensure_ascii=False)

SCRIPT = '''<script data-dc-script data-props='{"densidade":{"editor":"enum","default":"relance","options":["relance","leitura","fundo"],"tsType":"string","section":"Densidade"},"ambito":{"editor":"enum","default":"pais","options":["pais","regiao","municipio"],"tsType":"string","section":"Âmbito"},"$preview":{"width":1280,"height":5200}}'>
''' + v2script + '''
const SHORT_REL = ''' + json.dumps(SHORT_REL, ensure_ascii=False) + ''';
const PILLS = ''' + json.dumps(PILLS, ensure_ascii=False) + ''';
const EU_IDS = ''' + json.dumps(EU_IDS) + ''';
const EU = BLOCKS.map((b, i) => Object.assign({}, b, { id: EU_IDS[i], src: "Eurostat · " + b.code, read: "2026-08-12", shortRel: SHORT_REL[i], pill: PILLS[i], sentence: b.short, hasRuler: true, provaLabel: "Prova · campo devolvido", provaNote: "Transcrito da fonte, palavra por palavra.", numClass: "num" }));
const EVORA = ''' + json.dumps(EVORA, ensure_ascii=False) + ''';
const REGS = ''' + json.dumps(REG_MEASURES, ensure_ascii=False) + ''';
const PT_PIB = ''' + json.dumps(PT_PIB, ensure_ascii=False) + ''';
const REGIONS = ''' + json.dumps([{"id": r[0], "name": r[1], "v": r[2]} for r in REGIONS], ensure_ascii=False) + ''';
const PONTOS = ''' + PONTOS_JS + ''';
const EVORA_IDX = PONTOS.findIndex((p) => p.m === "Évora" && p.lit);
const ALL = {};
EU.concat(EVORA, REGS, [PT_PIB]).forEach((m) => { ALL[m.id] = m; });
const GROUPS = [
  { name: "País · painel europeu e contas nacionais", ids: EU_IDS.concat([PT_PIB.id]) },
  { name: "Regiões · a régua da convergência", ids: REGS.map((r) => r.id) },
  { name: "Município de Évora · a página publicada", ids: EVORA.map((e) => e.id) }
];
const NEXT = { relance: "leitura", leitura: "fundo", fundo: "relance" };
const COLORS = {
  fora:   { edge: "#E0A21A", sq: "background: #E0A21A;", word: "#7A5300", dot: "#E0A21A", stroke: 1, bar: "#17191B" },
  dentro: { edge: "#1F4E8C", sq: "background: #1F4E8C;", word: "#1F4E8C", dot: "#1F4E8C", stroke: 0, bar: "#17191B" },
  sem:    { edge: "#7F8681", sq: "background: transparent; border: 1px solid #17191B;", word: "#585D5B", dot: "#17191B", stroke: 0, bar: "#7F8681" }
};
function norm(s) { return String(s || "").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase(); }
function distLabel(d) { return /^Ilha/.test(d) ? d : "distrito de " + d; }
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { depth: null, open: {}, scope: { kind: "pais", id: null }, mode: props.ambito || "pais", query: "", catOpen: false, panel: null };
  }
  componentDidUpdate(prev) {
    if (prev.densidade !== this.props.densidade) this.setState({ depth: null, open: {} });
    if (prev.ambito !== this.props.ambito) this.setState({ mode: this.props.ambito, scope: { kind: "pais", id: null }, panel: null, open: {} });
  }
  baseDepth() { return this.state.depth || this.props.densidade || "relance"; }
  setDepth(d) { this.setState({ depth: d, open: {} }); }
  defaultIds(scope) {
    if (scope.kind === "pais") return EU_IDS.slice();
    if (scope.kind === "regiao") return ["regiao-" + scope.id];
    if (scope.kind === "municipio") return scope.id === EVORA_IDX ? EVORA.map((e) => e.id) : [];
    return [];
  }
  setScope(scope) { this.setState({ scope: scope, panel: null, open: {}, mode: scope.kind, query: "" }); }
  renderVals() {
    const depth = this.baseDepth();
    const open = this.state.open;
    const scope = this.state.scope;
    const mode = this.state.mode;
    const ids = this.state.panel || this.defaultIds(scope);
    const isCustom = !!this.state.panel;
    const seg = (on) => on ? "background-color: #17191B; color: #F6F7F4;" : "background-color: transparent; color: #17191B;";
    // ---- panel items ----
    const items = ids.map((id, i) => {
      const b = ALL[id]; const d = open[id] || depth; const c = COLORS[b.kind];
      return Object.assign({}, b, {
        isRelance: d === "relance", isLeitura: d === "leitura", isFundo: d === "fundo",
        tileStyle: "border-color: " + c.edge + "; --edge: " + c.edge + ";",
        sqStyle: "width: 12px; height: 12px; display: inline-block; flex: none; " + c.sq,
        wordStyle: "color: " + c.word + ";",
        markStyle: "width: 14px; height: 14px; display: inline-block; flex: none; " + c.sq,
        dotFill: c.dot, dotStroke: c.stroke, barFill: c.bar, limStroke: b.hasLimiar ? "#7F8681" : "none",
        barX2: b.barX * 2, barW2: b.barW * 2, limX2: b.limX * 2, valX2: b.valX * 2,
        limLabelStyle: b.hasLimiar ? "position: absolute; top: 0; left: " + (b.limX / 3) + "%; transform: translateX(-50%); font-weight: 400;" : "display: none;",
        limLabelStyleSm: b.hasLimiar ? "position: absolute; top: 0; left: " + (b.limX / 3) + "%; transform: translateX(-50%); font-weight: 400; font-size: 10px;" : "display: none;",
        stateStyle: "font-size: 12px; font-weight: 600; letter-spacing: .04em; color: " + c.word + ";",
        toggle: () => this.setState((s) => { const cur = s.open[id] || s.depth || this.props.densidade || "relance"; const nx = Object.assign({}, s.open); nx[id] = NEXT[cur]; return { open: nx }; })
      });
    });
    // ---- lede ----
    const total = ids.length;
    const limiarCount = ids.filter((id) => ALL[id].hasLimiar).length;
    const foraCount = ids.filter((id) => ALL[id].kind === "fora").length;
    let ledeLabel = "O país em números verificados · Painel europeu · 2025", ledeFig = "4", ledeCaption = "limiares europeus ultrapassados", ledeSq = "amb",
        ledeText = "Dos oito indicadores do painel europeu que este sítio publica, quatro têm limiar da Comissão e os quatro estão fora dele: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação. Painel de 2025, lido do Eurostat a 2026-08-12.",
        ledeNote = "O painel de desequilíbrios macroeconómicos e o painel social europeu, com os limiares que as instituições publicam.";
    let scopeReading = "Portugal · painel europeu · " + total + " medidas";
    let isEmpty = false, emptyTitle = "", emptyText = "";
    if (scope.kind === "pais" && isCustom) {
      ledeFig = String(foraCount); ledeCaption = "limiares ultrapassados neste painel";
      ledeText = "Das " + total + " medidas no painel, " + limiarCount + (limiarCount === 1 ? " tem limiar" : " têm limiar") + " e " + foraCount + (foraCount === 1 ? " está" : " estão") + " fora dele. Painel composto no catálogo; cada medida mantém a sua linha e a sua data de leitura.";
      ledeNote = "Um painel composto não é uma classificação: as medidas não se somam nem se ordenam. Cada uma responde só pela sua fonte.";
      scopeReading = "Portugal · painel composto · " + total + " medidas";
    }
    if (scope.kind === "regiao") {
      const r = REGIONS.find((x) => x.id === scope.id); const m = ALL["regiao-" + scope.id]; const d = r.v - 100;
      ledeLabel = "A região em números verificados · Régua da convergência · 2024";
      ledeFig = String(r.v); ledeCaption = r.name + " · índice de PIB per capita, UE-27 = 100"; ledeSq = d > 0 ? "cob" : "none";
      ledeText = r.name + " está " + Math.abs(d) + " pontos " + (d > 0 ? "acima" : "abaixo") + " da média da UE-27 (2024, calculado sobre o índice publicado). É a única linha regional no livro-razão de hoje: as medidas do painel europeu são nacionais e as municipais são por concelho.";
      ledeNote = "PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100. Eurostat, nama_10r_2gdp, lido a 2026-08-13.";
      scopeReading = r.name + " · região · " + total + (total === 1 ? " medida" : " medidas");
    }
    if (scope.kind === "municipio") {
      const p = PONTOS[scope.id];
      if (scope.id === EVORA_IDX) {
        ledeLabel = "O município em números verificados · Évora · 2025";
        ledeFig = String(total); ledeCaption = "medidas do concelho, cada uma com a sua linha"; ledeSq = "none";
        ledeText = "Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: onde uma fonte não estabelece uma coisa, a página di-lo em vez de a supor.";
        ledeNote = "Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica, e cada uma dessas di-lo na sua linha.";
        scopeReading = "Évora · município · distrito de Évora · " + total + " medidas";
      } else {
        ledeLabel = "O município em números verificados · " + p.m;
        ledeFig = "0"; ledeCaption = "linhas do livro-razão para " + p.m; ledeSq = "none";
        ledeText = p.m + ", " + distLabel(p.d) + ". Ainda sem linhas: o ponto marca a posição do município, não representa cobertura. Seis das medidas de Évora vêm de organismos que publicam para todos os concelhos; quando forem lidas para " + p.m + ", entram aqui com fonte e data de leitura.";
        ledeNote = "1 dos 308 municípios tem página com medidas. Os restantes 307 pontos marcam a posição do município e mais nada.";
        scopeReading = p.m + " · município · " + distLabel(p.d) + " · " + total + " medidas";
        isEmpty = total === 0; emptyTitle = "Sem linhas para " + p.m + " · ainda";
        emptyText = "Nenhuma medida foi lida para este concelho. As fontes que publicam para todos os concelhos (INE, IEFP, DGAL) permitem que as mesmas seis medidas de Évora existam aqui, com a mesma prova, quando forem lidas.";
      }
    }
    if (isCustom && scope.kind !== "pais") {
      scopeReading = scopeReading.replace(/ · \\d+ medidas?$/, "") + " · painel composto · " + total + (total === 1 ? " medida" : " medidas");
      ledeFig = String(total); ledeCaption = "medidas no painel composto"; ledeSq = "none";
      ledeText = "Das " + total + " medidas no painel, " + limiarCount + (limiarCount === 1 ? " tem limiar" : " têm limiar") + " e " + foraCount + (foraCount === 1 ? " está" : " estão") + " fora dele. Painel composto no catálogo a partir do âmbito escolhido; cada medida mantém a sua linha, a sua fonte e a sua data de leitura.";
      ledeNote = "Um painel composto não é uma classificação: as medidas não se somam nem se ordenam. Cada uma responde só pela sua fonte.";
    }
    const ledeSqStyle = ledeSq === "amb" ? "width: 16px; height: 16px; background: #E0A21A; display: inline-block; flex: none; margin-top: 10px;" : ledeSq === "cob" ? "width: 16px; height: 16px; background: #1F4E8C; display: inline-block; flex: none; margin-top: 10px;" : "display: none;";
    // ---- scope controls ----
    const regions = REGIONS.map((r) => ({ name: r.name, cls: (scope.kind === "regiao" && scope.id === r.id) ? "chipb on" : "chipb", pick: () => this.setScope({ kind: "regiao", id: r.id }) }));
    const q = norm(this.state.query);
    let results = [];
    if (q.length >= 1) results = PONTOS.map((p, i) => ({ p, i })).filter((x) => norm(x.p.m).indexOf(q) >= 0).slice(0, 8);
    else { results = [{ p: PONTOS[EVORA_IDX], i: EVORA_IDX }]; if (scope.kind === "municipio" && scope.id !== EVORA_IDX) results.unshift({ p: PONTOS[scope.id], i: scope.id }); }
    const resultsV = results.map((x) => ({ name: x.p.m + (x.p.lit ? " · com página" : ""), cls: (scope.kind === "municipio" && scope.id === x.i) ? "chipb on" : (x.p.lit ? "chipb lit" : "chipb"), pick: () => this.setScope({ kind: "municipio", id: x.i }) }));
    // ---- map points ----
    const pontosV = PONTOS.map((p, i) => {
      const sel = scope.kind === "municipio" && scope.id === i;
      return { x: p.x, y: p.y, r: sel ? 9 : (p.lit ? 7 : 3.2), rm: sel ? 12 : (p.lit ? 9 : 4.2), fill: (sel || p.lit) ? "#17191B" : "#F6F7F4", stroke: "#17191B", sw: 1, swm: 1.4, pick: () => this.setScope({ kind: "municipio", id: i }) };
    });
    // ---- catalogue ----
    const groups = GROUPS.map((g) => ({ name: g.name, items: g.ids.map((id) => { const m = ALL[id]; const on = ids.indexOf(id) >= 0; const c = COLORS[m.kind]; return {
      label: m.label, value: m.value, unit: m.unit, period: m.period, pill: m.pill, boxCls: on ? "box on" : "box",
      sqStyle: "width: 10px; height: 10px; display: inline-block; flex: none; " + c.sq, wordStyle: "color: " + c.word + ";",
      toggle: () => this.setState((s) => { const cur = (s.panel || this.defaultIds(s.scope)).slice(); const k = cur.indexOf(id); if (k >= 0) cur.splice(k, 1); else cur.push(id); return { panel: cur }; })
    }; }) }));
    const catCount = GROUPS.reduce((n, g) => n + g.ids.length, 0);
    return {
      items, depth, isEmpty, emptyTitle, emptyText,
      segRel: seg(depth === "relance"), segLei: seg(depth === "leitura"), segFun: seg(depth === "fundo"),
      setRelance: () => this.setDepth("relance"), setLeitura: () => this.setDepth("leitura"), setFundo: () => this.setDepth("fundo"),
      ledeLabel, ledeFig, ledeCaption, ledeSqStyle, ledeText, ledeNote, scopeReading,
      segPais: seg(mode === "pais"), segReg: seg(mode === "regiao"), segMun: seg(mode === "municipio"),
      setPais: () => this.setScope({ kind: "pais", id: null }),
      setRegiaoMode: () => this.setState({ mode: "regiao" }),
      setMunicipioMode: () => this.setState({ mode: "municipio" }),
      showRegions: mode === "regiao", showMunicipios: mode === "municipio",
      regions, query: this.state.query, setQuery: (e) => this.setState({ query: e && e.target ? e.target.value : "" }), results: resultsV,
      pontos: pontosV,
      isCustom, resetPanel: () => this.setState({ panel: null, open: {} }),
      catOpen: this.state.catOpen, toggleCat: () => this.setState((s) => ({ catOpen: !s.catOpen })),
      catLabel: (this.state.catOpen ? "▾ " : "▸ ") + "Medidas · " + total + " no painel",
      catCounts: total + " no painel · " + catCount + " no catálogo desta maqueta · 132 linhas no livro-razão",
      groups
    };
  }
}
</script>
</body>
</html>
'''

out = HEAD + SCRIPT
(ROOT / 'V3Completo.dc.html').write_text(out, encoding='utf-8')
print('written', len(out), 'chars;', out.count('sc-if value='), 'sc-if /', out.count('</sc-if>'), 'closes;', out.count('<sc-for'), 'sc-for /', out.count('</sc-for>'))
