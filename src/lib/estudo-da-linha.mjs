import { SITE_URL } from '../../site.config.mjs';
import { workById, WORKS, PUBLISHED_WORKS, studyTitle } from '../data/studies.mjs';
/** A origem interna mantém o seu nome; um estudo só aparece enquanto publicado. */
/** @param {string} id @param {string} lang */
export function tituloDoEstudoDaLinha(id, lang) {
  const work = workById(id);
  return work && !PUBLISHED_WORKS.some(w => w.id === id) ? null : studyTitle(id, lang).titulo;
}

/** @param {unknown} endereco */
export function enderecoDeEstudoRetirado(endereco) {
  if (typeof endereco !== 'string') return false;
  let url;
  try { url = new URL(endereco, SITE_URL); } catch { return false; }
  if (url.origin !== new URL(SITE_URL).origin) return false;
  const slug = url.pathname.match(/^\/(?:estudos|en\/studies)\/([^/]+)(?:\/|$)/)?.[1];
  return WORKS.some(w => w.slug === slug && w.estado === 'retirado');
}
