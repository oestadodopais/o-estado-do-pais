/** DO1: pertença única de cada peça. Sem dependência do compositor das novidades. */
import { DOSSIES } from '../data/dossies.mjs';
/** @param {string} tipo @param {string} slug */
export function dossieDaPeca(tipo, slug) {
  const camada = /** @type {Record<string, 'estudos'|'explicacoes'|'itens'>} */ ({ estudo: 'estudos', explicacao: 'explicacoes', discussao: 'itens' })[tipo];
  const d = camada && DOSSIES.find(d => d.pecas[camada].includes(slug));
  return d ? { slug: d.slug, titulo: d.titulo } : null;
}
