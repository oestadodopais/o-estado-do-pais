/** Marcas partilhadas pelo detetor e pela conferência do catálogo. */
import fs from 'node:fs';
export const MARCAS = JSON.parse(fs.readFileSync(new URL('./frases-marcas.json', import.meta.url), 'utf8'));
const compiladas = MARCAS.map(m => ({...m, re:new RegExp(m.expressao, m.flags)}));
export const marcasDaFrase = (t, lingua, antes = false) => compiladas.filter(m => m.lingua === lingua && (!antes || m.antes) && m.re.test(t)).map(m => m.id);
export const marcaLeitura = (t, lingua) => compiladas.some(m => m.lingua === lingua && m.tipo === 'leitura' && m.re.test(t));
export function tiposDaFrase(t, lingua, antes = false) {
  const ids = new Set(marcasDaFrase(t, lingua, antes));
  return ['atribuicao','causa','leitura'].filter(tipo => MARCAS.some(m => m.tipo === tipo && ids.has(m.id)));
}
