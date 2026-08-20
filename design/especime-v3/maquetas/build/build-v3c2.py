# Transforms V3Completo.dc.html: replaces the old lede + scope + mini-map + Instrumento 2
# with the A2b head (command row · 2+2 on the tile grid · breathing instrument · base row),
# wires the breathing rule into the logic, and wraps Instrumento 1 in the país scope.
import pathlib, re, json

ROOT = pathlib.Path(__file__).resolve().parents[1]
P = ROOT / 'V3Completo.dc.html'
s = P.read_text(encoding='utf-8')
assert 'O INSTRUMENTO' not in s, 'already transformed?'

# ---------- extract the catalogue block from the old head ----------
ci = s.find('        <sc-if value="{{ catOpen }}"')
assert ci > 0
# find its matching closing </sc-if> (catalogue contains nested sc-for but no nested sc-if)
cj = s.find('        </sc-if>', ci)
assert cj > ci
CAT = s[ci:cj + len('        </sc-if>')]
assert 'Catálogo de medidas' in CAT

# ---------- new head ----------
NEWHEAD = '''  <!-- CABEÇA v2 · linha de comando · 2+2 na grelha · instrumento que respira -->
  <div style="display: flex; flex-direction: column; gap: 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 2px 0 14px 0; border-bottom: 1px solid var(--ink);">
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Âmbito</div>
        <div class="dens">
          <span class="seg" style="{{ segPais }}" onClick="{{ setPais }}">País</span>
          <span class="seg" style="{{ segReg }}" onClick="{{ setRegiaoMode }}">Região</span>
          <span class="seg" style="{{ segMun }}" onClick="{{ setMunicipioMode }}">Município</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 14px;"><div class="lab">Densidade</div>
        <div class="dens">
          <span class="seg" style="{{ segRel }}" onClick="{{ setRelance }}">Relance</span>
          <span class="seg" style="{{ segLei }}" onClick="{{ setLeitura }}">Leitura breve</span>
          <span class="seg" style="{{ segFun }}" onClick="{{ setFundo }}">Fundo</span>
        </div>
      </div>
    </div>

    <sc-if value="{{ showRegions }}" hint-placeholder-val="{{ true }}">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 0 0 0;">
        <sc-for list="{{ regions }}" as="r" hint-placeholder-count="5">
          <span class="{{ r.cls }}" onClick="{{ r.pick }}">{{ r.name }}</span>
        </sc-for>
        <span class="meta" style="padding-left: 6px;">as cinco regiões publicadas na régua da convergência</span>
      </div>
    </sc-if>
    <sc-if value="{{ showMunicipios }}" hint-placeholder-val="{{ true }}">
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 14px 0 0 0;">
        <input class="inp" type="text" placeholder="Escreva o nome do concelho" value="{{ query }}" onInput="{{ setQuery }}">
        <sc-for list="{{ results }}" as="m" hint-placeholder-count="6">
          <span class="{{ m.cls }}" onClick="{{ m.pick }}">{{ m.name }}</span>
        </sc-for>
        <span class="meta">ou toque num ponto do mapa · 308 concelhos · 1 com página</span>
      </div>
    </sc-if>

    <div style="{{ gridStyle }} column-gap: 20px; align-items: start; padding-top: 20px; display: grid;">
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="lab">{{ scopeReading }}</div>
        <h1 style="max-width: 16em;">{{ headline }}</h1>
        <div style="display: flex; gap: 26px; align-items: center; flex-wrap: wrap;">
          <sc-for list="{{ stripSegs }}" as="g" hint-placeholder-count="3">
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <sc-for list="{{ g.items }}" as="q" hint-placeholder-count="4">
                <span style="{{ q.s }}"></span>
              </sc-for>
              <span class="lab" style="color: var(--ink); padding-left: 6px;">{{ g.label }}</span>
            </span>
          </sc-for>
        </div>
        <p style="font-size: 18px; line-height: 1.5;">{{ ledeText }}</p>
        <p class="prosa">{{ ledeNote }}</p>
      </div>

      <sc-if value="{{ instMap }}" hint-placeholder-val="{{ true }}">
        <div style="display: grid; grid-template-columns: 281px minmax(0, 1fr); column-gap: 20px; align-items: end;">
          <svg viewBox="0 0 600 790" width="281" height="370" style="display: block; overflow: visible;">
            <rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.r }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="{{ p.sw }}" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
            </sc-for>
          </svg>
          <div style="display: flex; flex-direction: column; gap: 9px; padding-bottom: 4px;">
            <div class="est" style="color: var(--ink);">{{ mapTitle }}</div>
            <p class="prosa" style="font-size: 13.5px;">Um ponto por município, na posição real do seu centróide. Aceso: Évora.</p>
            <div class="meta">Continente 278<br>Açores 19<br>Madeira 11<br>Total 308 · <span class="pv">[a verificar]</span></div>
            <div class="meta">Toque num ponto para abrir o concelho.</div>
            <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025<br>lido a 2026-08-12</span></div>
          </div>
        </div>
      </sc-if>

      <sc-if value="{{ instCard }}" hint-placeholder-val="{{ true }}">
        <div style="border: 1px solid var(--g3); padding: 16px; display: grid; grid-template-columns: 170px minmax(0, 1fr); column-gap: 18px; align-items: center;">
          <svg viewBox="0 0 600 790" width="170" height="224" style="display: block; overflow: visible;">
            <rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.rm }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="1.4" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
            </sc-for>
          </svg>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="est" style="color: var(--ink);">{{ cardNome }}</div>
            <div class="meta">1/308 municípios com página<br>posições: DGT, CAOP 2025</div>
            <span class="lig" style="font-size: 11px; cursor: pointer;" onClick="{{ focusSearch }}">trocar de concelho →</span>
            <a class="lig" href="#" style="font-size: 11px;">a página inteira, com quem governou →</a>
          </div>
        </div>
      </sc-if>
    </div>

    <sc-if value="{{ showBand }}" hint-placeholder-val="{{ true }}">
      <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--ink); margin-top: 22px; padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div class="lab">O instrumento da região · a régua da convergência · UE-27 = 100</div>
          <div class="meta">Eurostat · nama_10r_2gdp · lido 2026-08-13 · distância calculada</div>
        </div>
        <div style="position: relative; padding-top: 18px; padding-bottom: 20px;">
          <sc-for list="{{ bandTop }}" as="t" hint-placeholder-count="5">
            <div class="k" style="{{ t.st }}">{{ t.t }}</div>
          </sc-for>
          <div class="k" style="position: absolute; top: 18px; left: 0; font-weight: 400;">50</div>
          <div class="k" style="position: absolute; top: 18px; right: 0; font-weight: 400;">130</div>
          <div class="k" style="position: absolute; top: 0; left: 62.5%; transform: translateX(-50%);">UE-27 = 100</div>
          <svg viewBox="0 0 1000 46" width="100%" height="46" preserveAspectRatio="none" style="display: block; overflow: visible; margin-top: 14px;">
            <line x1="0" y1="20" x2="1000" y2="20" stroke="#D9DDD8" stroke-width="1"></line>
            <line x1="0" y1="14" x2="0" y2="26" stroke="#17191B" stroke-width="1"></line>
            <line x1="1000" y1="14" x2="1000" y2="26" stroke="#17191B" stroke-width="1"></line>
            <rect x="{{ bandBarX }}" y="16" width="{{ bandBarW }}" height="8" fill="#17191B"></rect>
            <line x1="625" y1="0" x2="625" y2="40" stroke="#7F8681" stroke-width="2"></line>
            <sc-for list="{{ bandDots }}" as="d" hint-placeholder-count="6">
              <circle cx="{{ d.cx }}" cy="20" r="{{ d.r }}" fill="{{ d.f }}"></circle>
            </sc-for>
          </svg>
          <div class="slab" style="{{ bandSelStyle }}">{{ bandSelLabel }}</div>
        </div>
        <p class="prosa" style="max-width: 70ch;">As regiões não se desenham em pontos de concelho: a régua é o instrumento do âmbito regional. O mapa volta quando o âmbito é um município.</p>
      </div>
    </sc-if>

    <div style="display: flex; justify-content: space-between; align-items: center; gap: 32px; border-top: 1px solid var(--g3); margin-top: 22px; padding: 12px 0;">
      <div style="display: flex; align-items: center; gap: 16px; min-width: 0; flex-wrap: wrap;">
        <span class="chipb" style="flex: none;" onClick="{{ toggleCat }}">{{ catLabel }}</span>
        <sc-if value="{{ isCustom }}" hint-placeholder-val="{{ true }}">
          <span class="chipb" onClick="{{ resetPanel }}">Repor o painel do âmbito</span>
        </sc-if>
        <span class="prosa" style="font-size: 13.5px;">O catálogo acrescenta ou retira medidas de qualquer âmbito, sem perder a fonte de cada uma. Protótipo: um toque num bloco muda só a densidade dele.</span>
      </div>
      <div class="meta" style="flex: none; text-align: right;">{{ baseFonte }}</div>
    </div>
__CAT__
  </div>

'''
NEWHEAD = NEWHEAD.replace('__CAT__', CAT)

i = s.find('  <!-- LEDE')
j = s.find('  <!-- PAINEL')
assert 0 < i < j
s = s[:i] + NEWHEAD + s[j:]

# ---------- wrap Instrumento 1 in país; remove Instrumento 2 ----------
i1 = s.find('  <!-- INSTRUMENTO 1')
i2 = s.find('  <!-- INSTRUMENTO 2')
im = s.find('  <!-- MUNICÍPIOS -->')
assert 0 < i1 < i2 < im
s = (s[:i1]
     + '  <sc-if value="{{ isPais }}" hint-placeholder-val="{{ true }}">\n'
     + s[i1:i2]
     + '  </sc-if>\n\n'
     + s[im:])

# ---------- logic: compute the new vals ----------
anchor = '''    const catCount = GROUPS.reduce((n, g) => n + g.ids.length, 0);
    return {
      items, depth, isEmpty, emptyTitle, emptyText,'''
assert anchor in s
compute = '''    const catCount = GROUPS.reduce((n, g) => n + g.ids.length, 0);
    // ---- head v2: headline, grouped strip, breathing instrument, band ----
    let headline = "Quatro limiares europeus ultrapassados.";
    if (scope.kind === "regiao") { const r = REGIONS.find((x) => x.id === scope.id); const d = r.v - 100; headline = r.name + ", " + Math.abs(d) + " pontos " + (d > 0 ? "acima" : "abaixo") + " da média da UE-27."; }
    if (scope.kind === "municipio") { headline = scope.id === EVORA_IDX ? "Oito medidas do concelho, cada uma com a sua linha." : "Ainda sem linhas para " + PONTOS[scope.id].m + "."; }
    if (isCustom) { headline = total + (total === 1 ? " medida" : " medidas") + " no painel composto."; }
    const SQ = { fora: "background: #E0A21A;", dentro: "background: #1F4E8C;", sem: "border: 1px solid #17191B;" };
    const kindCounts = { fora: 0, dentro: 0, sem: 0 };
    ids.forEach((id) => { kindCounts[ALL[id].kind] += 1; });
    const sqs = (css, n) => Array.from({ length: n }, () => ({ s: "width: 15px; height: 15px; display: inline-block; flex: none; " + css }));
    let stripSegs = [];
    if (kindCounts.fora) stripSegs.push({ label: "fora do limiar", items: sqs(SQ.fora, kindCounts.fora) });
    if (kindCounts.dentro) stripSegs.push({ label: "do lado bom da referência", items: sqs(SQ.dentro, kindCounts.dentro) });
    if (kindCounts.sem) stripSegs.push({ label: "sem limiar", items: sqs(SQ.sem, kindCounts.sem) });
    if (scope.kind === "municipio" && scope.id !== EVORA_IDX && !isCustom) stripSegs = [{ label: "por ler · fontes nacionais", items: sqs("border: 1px dashed #17191B;", 6) }];
    const instCard = scope.kind === "municipio" && depth !== "relance";
    const instMap = scope.kind !== "regiao" && !instCard;
    const showBand = scope.kind === "regiao";
    const gridStyle = showBand ? "grid-template-columns: minmax(0, 1fr);" : "grid-template-columns: 582px minmax(0, 1fr);";
    const mapTitle = "1/308 municípios com estudo aprofundado publicado";
    const cardNome = scope.kind === "municipio" ? PONTOS[scope.id].m + " · " + distLabel(PONTOS[scope.id].d) : "";
    const bx = (v) => (v - 50) * 12.5;
    let bandDots = [], bandTop = [], bandBarX = 0, bandBarW = 0, bandSelStyle = "display: none;", bandSelLabel = "";
    if (showBand) {
      const LVL = { "grande-lisboa": 0, "peninsula-de-setubal": 0, "algarve": 0, "madeira": 1, "alentejo": 0 };
      REGIONS.forEach((r) => {
        const x = bx(r.v); const on = r.id === scope.id;
        bandDots.push({ cx: x, r: on ? 7 : 4, f: on ? "#17191B" : "#7F8681" });
        if (!on) bandTop.push({ t: r.name + " " + r.v, st: "position: absolute; top: " + (LVL[r.id] ? 18 : 0) + "px; left: " + (x / 10) + "%; transform: translateX(-50%); font-weight: 400; white-space: nowrap;" });
      });
      bandDots.push({ cx: bx(82), r: 4, f: "#7F8681" });
      bandTop.push({ t: "Portugal 82", st: "position: absolute; top: 0; left: " + (bx(82) / 10) + "%; transform: translateX(-50%); font-weight: 400; white-space: nowrap;" });
      const selX = bx(REGIONS.find((x) => x.id === scope.id).v);
      bandBarX = Math.min(selX, 625); bandBarW = Math.abs(625 - selX);
      bandSelLabel = REGIONS.find((x) => x.id === scope.id).name + " " + REGIONS.find((x) => x.id === scope.id).v;
      bandSelStyle = "position: absolute; bottom: 0; left: " + (selX / 10) + "%; transform: translateX(-50%); font-size: 12px; font-weight: 600;";
    }
    const baseFonte = scope.kind === "regiao" ? "fonte · Eurostat · nama_10r_2gdp" : (scope.kind === "municipio" && scope.id === EVORA_IDX ? "fonte · INE · IEFP · DGAL · Município de Évora" : (scope.kind === "pais" ? "fonte · Eurostat · painel europeu" : ""));
    return {
      items, depth, isEmpty, emptyTitle, emptyText,
      headline, gridStyle, instMap, instCard, showBand, isPais: scope.kind === "pais" && !isCustom,
      stripSegs, bandDots, bandTop, bandBarX, bandBarW, bandSelStyle, bandSelLabel,
      mapTitle, cardNome, baseFonte,
      focusSearch: () => this.setState({ mode: "municipio", query: "" }),'''
s = s.replace(anchor, compute)

# pontos: head map dots slightly bigger than before (r), card dots (rm) smaller
old_p = 'return { x: p.x, y: p.y, r: sel ? 9 : (p.lit ? 7 : 3.2), rm: sel ? 12 : (p.lit ? 9 : 4.2), fill: (sel || p.lit) ? "#17191B" : "#F6F7F4", stroke: "#17191B", sw: 1, swm: 1.4, pick: () => this.setScope({ kind: "municipio", id: i }) };'
new_p = 'return { x: p.x, y: p.y, r: sel ? 9 : (p.lit ? 7 : 3.2), rm: sel ? 13 : (p.lit ? 9 : 3.6), fill: (sel || p.lit) ? "#17191B" : "#F6F7F4", stroke: "#17191B", sw: 1, swm: 1.4, pick: () => this.setScope({ kind: "municipio", id: i }) };'
assert old_p in s
s = s.replace(old_p, new_p)

# $preview
s = s.replace('"$preview":{"width":1280,"height":5200}', '"$preview":{"width":1280,"height":4400}')

P.write_text(s, encoding='utf-8')
body = s[s.find('<x-dc>'):s.find('</x-dc>')]
print('ok', len(s), 'divs', body.count('<div'), body.count('</div>'), 'sc-if', body.count('<sc-if'), body.count('</sc-if>'), 'sc-for', body.count('<sc-for'), body.count('</sc-for>'))
