/** O lugar da célula atravessada, sem consultar a declaração editorial de lugares. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'js-yaml';
const cruzadas = JSON.parse(fs.readFileSync('ledger/cruzamentos/hb1.json', 'utf8')).rows;
const lugares = {PT:'portugal', EU27_2020:'uniao-europeia', RO:'romenia'};
const ler = id => load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
export function lugarDaHabitacao(c, visitadas = new Set()) {
  if (!c || visitadas.has(c.id) || !cruzadas[c.id]) return null;
  const bytes = fs.readFileSync(`ledger/claims/${c.id}.yml`);
  if (createHash('sha256').update(bytes).digest('hex') !== cruzadas[c.id].exported_row_sha256 ||
      JSON.stringify(load(bytes.toString())) !== JSON.stringify(c)) return null;
  visitadas = new Set([...visitadas, c.id]);
  if (c.derived_from?.length) {
    const [a,b] = c.derived_from;
    // A diferença para a União pertence ao primeiro operando; uma distância
    // à base cem conserva o território da única célula da conta.
    if (c.derived_from.length === 2 && c.check === `round ( ${a} - ${b} , 1 )` &&
        lugarDaHabitacao(ler(b), visitadas) === 'uniao-europeia') return lugarDaHabitacao(ler(a), visitadas);
    if (c.derived_from.length === 1 && [
      `round ( ${a} - 100 , 1 )`, `round ( ( 10000 - ${a} * 100 ) / 100 , 1 )`,
    ].includes(c.check)) return lugarDaHabitacao(ler(a), visitadas);
    return null;
  }
  try {
    const {coordinates, value} = JSON.parse(c.excerpt), url = new URL(c.source_url);
    if (Number(String(c.value).replace(/[ \u00a0\u202f]/g, '').replace(',', '.')) !== Number(value)) return null;
    const coordenada = (k,v) => c.document?.locator?.split('; ').includes(`${k}=${v}`);
    if (c.source === 'Eurostat' && url.hostname === 'ec.europa.eu' &&
        coordenada('geo',coordinates.geo) && coordenada('time',c.reference_date) &&
        coordinates.time === c.reference_date && url.searchParams.getAll('geo').includes(coordinates.geo))
      return lugares[coordinates.geo] ?? null;
    // BPstat: dimensão 63, «Território de referência», categoria 349, «Portugal»,
    // lida no corpo JSON selado da série; a dimensão 59 é a contraparte.
    if (c.source === 'Banco de Portugal' && url.hostname === 'bpstat.bportugal.pt' &&
        coordinates['63'] === '349' && coordenada('63','349') &&
        coordinates.reference_date === c.reference_date && coordenada('reference_date',c.reference_date)) return 'portugal';
  } catch { return null; }
  return null;
}
