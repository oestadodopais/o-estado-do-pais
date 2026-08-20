# Post-critique revision (Opus max + Codex xhigh, 2026-08-20), per the seat's adopted plan:
# 1 colour only for formal published thresholds; 2 two densities (Fundo -> the seal's
# destination); 3 map in the A3 «Selo» posture (stamp in País; full map only in Município
# mode; locator card keeps its seal); plus: unified ruler grammar, grey tile frames,
# ink-contoured amber marker, glyph-scaled values, seal unnested, squares->■/□ on the map,
# catalogue selection marks stop reusing the seal square, dossiê naming, scope-bled tail
# gated to País, Beja empty state trimmed, dead lede code removed.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
P = ROOT / 'V3Completo.dc.html'
s = P.read_text(encoding='utf-8')
assert 'O INSTRUMENTO' not in s or True
orig = s

def sub(old, new, n=1):
    global s
    assert s.count(old) == n, (old[:80], s.count(old))
    s = s.replace(old, new)

# ---------- 1 · colour vocabulary: thresholds only ----------
# EU blocks: emprego + creche lose 'dentro'
sub('code: "lfsi_emp_a", kind: "dentro"', 'code: "lfsi_emp_a", kind: "sem"')
sub('code: "tepsr_sp210", kind: "dentro"', 'code: "tepsr_sp210", kind: "sem"')
# Évora: poder de compra (average) loses 'dentro'; índice de dívida (teto legal) keeps it
sub('"id": "evora-poder-de-compra-2023", "label": "Poder de compra por habitante"', '"id": "evora-poder-de-compra-2023", "label": "Poder de compra por habitante"', 0) if False else None
import re
m = re.search(r'\{"hasRuler": true[^}]*?"id": "evora-poder-de-compra-2023".*?\}', s)
# simpler targeted: replace kind in the poder-de-compra object
i = s.find('"evora-poder-de-compra-2023"')
assert i > 0
j = s.find('"kind": "dentro"', i)
assert 0 < j < i + 2000
s = s[:j] + '"kind": "sem"' + s[j + len('"kind": "dentro"'):]
# Regions: Grande Lisboa (above average) loses 'dentro'
i = s.find('"id": "regiao-grande-lisboa"')
assert i > 0
j = s.find('"kind": "dentro"', i)
assert 0 < j < i + 2000
s = s[:j] + '"kind": "sem"' + s[j + len('"kind": "dentro"'):]
# strip label
sub('stripSegs.push({ label: "do lado bom da referência", items: sqs(SQ.dentro, kindCounts.dentro) });',
    'stripSegs.push({ label: "dentro do limiar", items: sqs(SQ.dentro, kindCounts.dentro) });')
# legend text in lede (país custom + others) — the phrase appears in the old ledeText? it does in "Como ler" nowhere now; skip.

# ---------- amber marker gets ink contour; tile frames go grey ----------
sub('fora:   { edge: "#E0A21A", sq: "background: #E0A21A;", word: "#7A5300", dot: "#E0A21A", stroke: 1, bar: "#17191B" },',
    'fora:   { edge: "#D9DDD8", sq: "background: #E0A21A; border: 1px solid #17191B;", word: "#7A5300", dot: "#E0A21A", stroke: 1, bar: "#E0A21A" },')
sub('dentro: { edge: "#1F4E8C", sq: "background: #1F4E8C;", word: "#1F4E8C", dot: "#1F4E8C", stroke: 0, bar: "#17191B" },',
    'dentro: { edge: "#D9DDD8", sq: "background: #1F4E8C;", word: "#1F4E8C", dot: "#1F4E8C", stroke: 0, bar: "#1F4E8C" },')
sub('sem:    { edge: "#7F8681", sq: "background: transparent; border: 1px solid #17191B;", word: "#585D5B", dot: "#17191B", stroke: 0, bar: "#7F8681" }',
    'sem:    { edge: "#D9DDD8", sq: "background: transparent; border: 1px solid #17191B;", word: "#585D5B", dot: "#17191B", stroke: 0, bar: "#7F8681" }')
# hover thickens (state no longer on frame): keep --edge grey; fine as-is.

# ---------- 2 · two densities ----------
sub('<span class="seg" style="{{ segFun }}" onClick="{{ setFundo }}">Fundo</span>\n        </div>\n      </div>\n    </div>',
    '</div>\n      </div>\n    </div>')
sub('"densidade":{"editor":"enum","default":"relance","options":["relance","leitura","fundo"],"tsType":"string","section":"Densidade"}',
    '"densidade":{"editor":"enum","default":"relance","options":["relance","leitura"],"tsType":"string","section":"Densidade"}')
sub('const NEXT = { relance: "leitura", leitura: "fundo", fundo: "relance" };',
    'const NEXT = { relance: "leitura", leitura: "relance" };')
# preserve per-tile choices when the global dial moves
sub('setDepth(d) { this.setState({ depth: d, open: {} }); }',
    'setDepth(d) { this.setState({ depth: d }); }')
# remove the Fundo branch from the panel template
fi = s.find('      <sc-if value="{{ b.isFundo }}"')
fj = s.find('    </sc-for>', fi)
assert 0 < fi < fj
s = s[:fi] + s[fj:]
# open/close label on tiles
sub('<span class="lab abrir" style="flex: none;">▸ abrir</span>',
    '<span class="lab abrir" style="flex: none;">{{ b.openLabel }}</span>')
# leitura block: close label + seal beside the value + unnest seal
sub('<div class="slab" style="font-size: 44px; font-weight: 500; line-height: 1;">{{ b.value }}</div>',
    '<div style="display: flex; align-items: baseline; gap: 10px;"><div class="slab" style="font-size: 44px; font-weight: 500; line-height: 1;">{{ b.value }}</div><a class="selo" href="#" onClick="{{ b.stopSeal }}">fonte</a></div>')
sub('<div style="font-size: 16px; line-height: 1.5;">{{ b.sentence }} <a class="selo" href="#">fonte</a></div>',
    '<div style="font-size: 16px; line-height: 1.5;">{{ b.sentence }}</div>\n          <div class="lab abrir">▴ fechar · o recibo completo está na linha: <a class="selo" href="#" onClick="{{ b.stopSeal }}">fonte</a></div>')
# tile seal unnested
sub('<div style="margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 6px;"><a class="selo" href="#">fonte</a><span class="meta">{{ b.src }}</span></div>',
    '<div style="margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 6px;"><a class="selo" href="#" onClick="{{ b.stopSeal }}">fonte</a><span class="meta">{{ b.src }}</span></div>')

# ---------- 3 · map posture A3: stamp in País; full map only in Município ----------
sub('      <sc-if value="{{ instMap }}" hint-placeholder-val="{{ true }}">',
    '''      <sc-if value="{{ instStamp }}" hint-placeholder-val="{{ true }}">
        <div style="display: flex; flex-direction: column; gap: 9px; align-items: flex-start;">
          <svg viewBox="0 0 600 790" width="150" height="198" style="display: block; overflow: visible;">
            <rect x="146.8" y="433.6" width="108.5" height="92.9" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <rect x="14" y="584.9" width="250" height="164.3" fill="none" stroke="#D9DDD8" stroke-width="1"></rect>
            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <rect x="{{ p.sx }}" y="{{ p.sy }}" width="8" height="8" fill="{{ p.fill }}" stroke="#17191B" stroke-width="1"></rect>
            </sc-for>
          </svg>
          <div class="est" style="color: var(--ink);">1/308 municípios com estudo aprofundado publicado</div>
          <div class="meta">Continente 278 · Açores 19 · Madeira 11 · Total 308 · <span class="pv">[a verificar]</span></div>
          <div style="display: flex; align-items: center; gap: 10px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025 · lido a 2026-08-12</span></div>
          <span class="chipb" onClick="{{ setMunicipioMode }}">▸ Abrir um concelho</span>
        </div>
      </sc-if>

      <sc-if value="{{ instMap }}" hint-placeholder-val="{{ true }}">''')
# full map circles -> squares, bigger targets, inset labels
sub('''            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.r }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="{{ p.sw }}" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
            </sc-for>
          </svg>''',
    '''            <text x="200" y="425" font-family="Bitter, Georgia, serif" font-size="13" fill="#585D5B">Madeira</text>
            <text x="20" y="576" font-family="Bitter, Georgia, serif" font-size="13" fill="#585D5B">Açores</text>
            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <rect x="{{ p.qx }}" y="{{ p.qy }}" width="{{ p.qs }}" height="{{ p.qs }}" fill="{{ p.fill }}" stroke="#17191B" stroke-width="1" style="cursor: pointer;" onClick="{{ p.pick }}"></rect>
            </sc-for>
          </svg>''')
# card mini-map circles -> squares + add the seal that was lost
sub('''            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <circle cx="{{ p.x }}" cy="{{ p.y }}" r="{{ p.rm }}" fill="{{ p.fill }}" stroke="{{ p.stroke }}" stroke-width="1.4" style="cursor: pointer;" onClick="{{ p.pick }}"></circle>
            </sc-for>''',
    '''            <sc-for list="{{ pontos }}" as="p" hint-placeholder-count="308">
              <rect x="{{ p.cx2 }}" y="{{ p.cy2 }}" width="{{ p.cs }}" height="{{ p.cs }}" fill="{{ p.fill }}" stroke="#17191B" stroke-width="1" style="cursor: pointer;" onClick="{{ p.pick }}"></rect>
            </sc-for>''')
sub('''            <div class="meta">1/308 municípios com página<br>posições: DGT, CAOP 2025</div>''',
    '''            <div class="meta">1/308 municípios com página</div>
            <div style="display: flex; align-items: center; gap: 8px;"><a class="selo" href="#">fonte</a><span class="meta">DGT, CAOP 2025 · lido a 2026-08-12</span></div>''')

# ---------- 4 · unified ruler grammar (leitura): ref = full-height ink; bar = distance; no bar without ref ----------
sub('''            <svg viewBox="0 0 600 30" width="100%" height="30" preserveAspectRatio="xMinYMid meet" style="display: block; overflow: visible;">
              <line x1="0" y1="16" x2="600" y2="16" stroke="#D9DDD8" stroke-width="1"></line>
              <rect x="{{ b.barX2 }}" y="12" width="{{ b.barW2 }}" height="8" fill="{{ b.barFill }}"></rect>
              <line x1="{{ b.limX2 }}" y1="2" x2="{{ b.limX2 }}" y2="30" stroke="{{ b.limStroke }}" stroke-width="2"></line>
              <circle cx="{{ b.valX2 }}" cy="16" r="6.5" fill="{{ b.dotFill }}" stroke="#17191B" stroke-width="{{ b.dotStroke }}"></circle>
            </svg>''',
    '''            <svg viewBox="0 0 600 30" width="100%" height="30" preserveAspectRatio="xMinYMid meet" style="display: block; overflow: visible;">
              <line x1="0" y1="16" x2="600" y2="16" stroke="#D9DDD8" stroke-width="1"></line>
              <rect x="{{ b.rBarX }}" y="13" width="{{ b.rBarW }}" height="6" fill="{{ b.barFill }}"></rect>
              <line x1="{{ b.limX2 }}" y1="0" x2="{{ b.limX2 }}" y2="30" stroke="{{ b.limStroke }}" stroke-width="3"></line>
              <line x1="{{ b.valX2 }}" y1="6" x2="{{ b.valX2 }}" y2="26" stroke="#17191B" stroke-width="2"></line>
            </svg>''')
# band: UE reference goes ink
sub('<line x1="625" y1="0" x2="625" y2="40" stroke="#7F8681" stroke-width="2"></line>',
    '<line x1="625" y1="0" x2="625" y2="40" stroke="#17191B" stroke-width="3"></line>')

# ---------- catalogue: selection mark stops reusing the seal square ----------
sub('<span class="{{ c.boxCls }}"></span>', '<span class="slab" style="{{ c.markStyle }}">{{ c.mark }}</span>')

# ---------- tail gated to País (scope bleed) ----------
ti = s.find('  <!-- MUNICÍPIOS -->')
tj = s.find('  <!-- 4.8 PORTA')
assert 0 < ti < tj
s = s[:ti] + '  <sc-if value="{{ tailPais }}" hint-placeholder-val="{{ true }}">\n' + s[ti:tj] + '  </sc-if>\n\n' + s[tj:]

# ---------- values scale by glyph count ----------
sub('<div class="{{ b.numClass }}">{{ b.value }}</div>', '<div class="num" style="{{ b.numStyle }}">{{ b.value }}</div>')

# ---------- logic block ----------
sub('''    const items = ids.map((id, i) => {
      const b = ALL[id]; const d = open[id] || depth; const c = COLORS[b.kind];
      return Object.assign({}, b, {
        isRelance: d === "relance", isLeitura: d === "leitura", isFundo: d === "fundo",''',
    '''    const SCOPE_TAG = {};
    GROUPS[0].ids.forEach((x) => { SCOPE_TAG[x] = "País"; });
    GROUPS[1].ids.forEach((x) => { SCOPE_TAG[x] = "Região"; });
    GROUPS[2].ids.forEach((x) => { SCOPE_TAG[x] = "Évora"; });
    const items = ids.map((id, i) => {
      const b = ALL[id]; const d = (open[id] || depth) === "fundo" ? "leitura" : (open[id] || depth); const c = COLORS[b.kind];
      const glyphs = String(b.value).replace(/[\\s\\u202F]/g, "").length;
      const numSize = glyphs <= 5 ? 80 : (glyphs <= 7 ? 60 : 44);
      return Object.assign({}, b, {
        isRelance: d === "relance", isLeitura: d === "leitura", isFundo: false,
        numStyle: "font-size: " + numSize + "px; line-height: 1; padding-top: 6px;",
        openLabel: d === "relance" ? "▸ abrir" : "▴ fechar",
        stopSeal: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
        srcTag: (isCustom ? SCOPE_TAG[id] + " · " : "") + b.src,''')
sub('        tileStyle: "border-color: " + c.edge + "; --edge: " + c.edge + ";",',
    '        tileStyle: "border-color: #D9DDD8; --edge: #7F8681;",')
sub('        barX2: b.barX * 2, barW2: b.barW * 2, limX2: b.limX * 2, valX2: b.valX * 2,',
    '''        barX2: b.barX * 2, barW2: b.barW * 2, limX2: b.limX * 2, valX2: b.valX * 2,
        rBarX: b.hasLimiar ? Math.min(b.limX, b.valX) * 2 : 0, rBarW: b.hasLimiar ? Math.abs(b.valX - b.limX) * 2 : 0,''')
# tiles: src -> srcTag in template
sub('<span class="meta">{{ b.src }}</span></div>', '<span class="meta">{{ b.srcTag }}</span></div>', 1)
# pontos: square coordinates for the three sizes
sub('return { x: p.x, y: p.y, r: sel ? 9 : (p.lit ? 7 : 3.2), rm: sel ? 13 : (p.lit ? 9 : 3.6), fill: (sel || p.lit) ? "#17191B" : "#F6F7F4", stroke: "#17191B", sw: 1, swm: 1.4, pick: () => this.setScope({ kind: "municipio", id: i }) };',
    '''const q = sel ? 11 : (p.lit ? 9 : 5); const c2 = sel ? 15 : (p.lit ? 11 : 5); const st = sel ? 9 : (p.lit ? 8 : 4.2);
      return { x: p.x, y: p.y, qs: q * 2, qx: p.x - q, qy: p.y - q, cs: c2 * 2, cx2: p.x - c2, cy2: p.y - c2, sx: p.x - st, sy: p.y - st, fill: (sel || p.lit) ? "#17191B" : "#F6F7F4", pick: () => this.setScope({ kind: "municipio", id: i }) };''')
# stamp size uses fixed 8 in template width attr — replace to hole? template uses width="8": patch to use holes
sub('<rect x="{{ p.sx }}" y="{{ p.sy }}" width="8" height="8" fill="{{ p.fill }}" stroke="#17191B" stroke-width="1"></rect>',
    '<rect x="{{ p.sx }}" y="{{ p.sy }}" width="{{ p.ss }}" height="{{ p.ss }}" fill="{{ p.fill }}" stroke="#17191B" stroke-width="1"></rect>')
sub('return { x: p.x, y: p.y, qs: q * 2, qx: p.x - q, qy: p.y - q,',
    'return { x: p.x, y: p.y, qs: q * 2, qx: p.x - q, qy: p.y - q, ss: st * 2,')
# instrument routing + dossiê + tail + no dashed strip + headline dossiê
sub('    const instCard = scope.kind === "municipio" && depth !== "relance";\n    const instMap = scope.kind !== "regiao" && !instCard;',
    '    const instCard = scope.kind === "municipio" && depth !== "relance";\n    const instMap = scope.kind === "municipio" && !instCard;\n    const instStamp = scope.kind === "pais";')
sub('if (isCustom) { headline = total + (total === 1 ? " medida" : " medidas") + " no painel composto."; }',
    'if (isCustom) { headline = total + (total === 1 ? " medida" : " medidas") + " em dossiê do leitor."; }')
sub('if (scope.kind === "municipio" && scope.id !== EVORA_IDX && !isCustom) stripSegs = [{ label: "por ler · fontes nacionais", items: sqs("border: 1px dashed #17191B;", 6) }];',
    'if (scope.kind === "municipio" && scope.id !== EVORA_IDX && !isCustom) stripSegs = [];')
# catalogue marks
sub('''      label: m.label, value: m.value, unit: m.unit, period: m.period, pill: m.pill, boxCls: on ? "box on" : "box",''',
    '''      label: m.label, value: m.value, unit: m.unit, period: m.period, pill: m.pill,
      mark: on ? "●" : "○", markStyle: "font-size: 14px; line-height: 1; color: #17191B;",''')
# return additions
sub('      mapTitle, cardNome, baseFonte,',
    '      mapTitle, cardNome, baseFonte, instStamp, tailPais: scope.kind === "pais",')
# dossiê wording in scopeReading + note line
sub('" · painel composto · "', '" · dossiê · "', 1)
sub('scopeReading = "Portugal · painel composto · " + total + " medidas";',
    'scopeReading = "Portugal · dossiê do leitor · " + total + " medidas";')
s = s.replace('Um painel composto não é uma classificação: as medidas não se somam nem se ordenam. Cada uma responde só pela sua fonte.',
    'Um dossiê é uma seleção do leitor, não uma classificação: as medidas não se somam nem se ordenam, e cada peça declara o seu âmbito junto da fonte. No sítio, um dossiê terá endereço próprio e linha de proveniência.')
s = s.replace('painel composto no catálogo', 'dossiê montado no catálogo')
s = s.replace('Painel composto no catálogo a partir do âmbito escolhido', 'Dossiê montado no catálogo a partir do âmbito escolhido')
# dead lede code out
sub('''    const ledeSqStyle = ledeSq === "amb" ? "width: 16px; height: 16px; background: #E0A21A; display: inline-block; flex: none; margin-top: 10px;" : ledeSq === "cob" ? "width: 16px; height: 16px; background: #1F4E8C; display: inline-block; flex: none; margin-top: 10px;" : "display: none;";''',
    '''    const ledeSqStyle = "";''')

P.write_text(s, encoding='utf-8')
body = s[s.find('<x-dc>'):s.find('</x-dc>')]
print('ok', len(s), 'divs', body.count('<div'), body.count('</div>'), 'sc-if', body.count('<sc-if'), body.count('</sc-if>'), 'sc-for', body.count('<sc-for'), body.count('</sc-for>'))
