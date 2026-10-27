import fs from 'node:fs';
/** O mesmo carimbo preparado antes do Astro e copiado depois para version.json. */
export function carimboDaConstrucao() {
  const v = JSON.parse(fs.readFileSync(process.cwd() + '/.astro/version.json', 'utf8'));
  if (!v.construido_em || Number.isNaN(Date.parse(v.construido_em))) throw new Error('FP1: falta o carimbo da construção.');
  return v;
}
/** Segunda-feira estritamente posterior ao dia UTC da construção. @param {string} iso */
export function proximaLeitura(iso) {
  const d = new Date(iso.slice(0, 10) + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
}
/** @param {string|null} data @param {string} construcao */
export function estudoNovo(data, construcao) {
  if (!data) return false;
  const dias = (Date.parse(construcao.slice(0,10)) - Date.parse(data)) / 86400000;
  return dias >= 0 && dias <= 7;
}
