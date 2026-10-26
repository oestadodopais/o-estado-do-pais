/** HB1-30: o commit prova a entrada; a publicação declarada prova a aterragem. */
import { dataDaEdicaoNoRepositorio } from './datas-do-repositorio.mjs';
/** @param {{publication?: string}} work @param {{date: string|null}} edition @param {string|null} entrada */
export function resolverDataPublicacao(work, edition, entrada) {
  if (work.publication !== 'declared') return entrada;
  if (edition.date === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(edition.date ?? '') || Number.isNaN(Date.parse(edition.date)) || new Date(edition.date).toISOString().slice(0,10) !== edition.date) throw new Error('Publicação: data declarada inválida');
  if (!entrada) throw new Error('Publicação: falta a data do commit de entrada');
  if (edition.date < entrada) throw new Error('Publicação: data declarada anterior ao commit de entrada');
  return edition.date;
}
/** @param {{slug: string, publication?: string}} work @param {{lang: string, date: string|null}} edition */
export function dataPublicacao(work, edition) {
  return resolverDataPublicacao(work, edition, dataDaEdicaoNoRepositorio(work.slug, edition.lang));
}
