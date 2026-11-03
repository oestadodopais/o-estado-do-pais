/** PAI2: só a última reconferência, sem mudança de valor posterior. */
import { getClaim } from './ledger.mjs';
/** @param {string} id */
export function revisaoDaFonte(id) {
  const c = /** @type {any} */ (getClaim(id));
  const v = (c.verifications ?? []).map((/** @type {any} */ v, /** @type {number} */ n) => ({ ...v, n }))
    .sort((/** @type {any} */ a, /** @type {any} */ b) => a.date.localeCompare(b.date) || a.n - b.n).at(-1);
  if (v?.result !== 'diverge' || (c.corrections ?? []).some((/** @type {any} */ k) =>
    !Object.hasOwn(k, 'field') && ['correcao', 'atualizacao'].includes(k.kind) && k.date > v.date)) return null;
  if (v.found === undefined || v.found === null || v.found === '') throw Error(`PAI2: revisão sem valor relido: ${id}`);
  return v;
}
/** @param {unknown} partes */
export function linhasDosPedacos(partes) {
  const ids = new Set();
  /** @param {any} p */
  function ler(p) {
    if (Array.isArray(p)) p.forEach(ler);
    else if (p && typeof p === 'object') {
      if (typeof p.claim === 'string') ids.add(p.claim);
      Object.values(p).forEach(ler);
    }
  }
  ler(partes);
  return [...ids];
}
