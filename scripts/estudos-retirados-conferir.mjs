import { routePath } from '../src/lib/routes.mjs';

export const normalizarRota = rota => rota.replace(/\/$/, '') || '/';
export function estudoDaRota(rota, works) {
  const slug = normalizarRota(rota).match(/^\/(?:estudos|en\/studies)\/([^/]+)(?:\/|$)/)?.[1];
  return works.find(w => w.slug === slug) ?? null;
}

/** A retirada impede qualquer rota própria, incluindo documentos, datas e registos. */
export function conferirPaginasDosEstudos(works, rotas) {
  const presentes = new Set([...rotas].map(normalizarRota)), erros = [];
  for (const rota of presentes) {
    if (estudoDaRota(rota, works)?.estado === 'retirado') erros.push(`REC2 retirado construído: ${rota}`);
  }
  for (const w of works.filter(w => w.estado !== 'retirado')) {
    for (const lang of ['pt', 'en']) {
      const rota = routePath('estudo', lang, {slug: w.slug});
      if (!presentes.has(normalizarRota(rota))) erros.push(`REC2 estudo sem página: ${rota}`);
    }
  }
  return erros;
}
