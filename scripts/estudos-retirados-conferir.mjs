import { routePath } from '../src/lib/routes.mjs';
import { parse } from 'node-html-parser';

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

export function destinoDoRetirado(work, lang, works) {
  if (work.estado !== 'retirado' || !work.sucedidoPor?.length) throw Error(`REC2 retirada sem sucessor: ${work.slug}`);
  for (const s of work.sucedidoPor) {
    const sucessor = works.find(w => w.slug === s.slug);
    if (!sucessor || sucessor.estado === 'retirado') throw Error(`REC2 sucessor não publicado: ${s.slug}`);
  }
  return routePath(work.sucedidoPor.length > 1 ? 'municipio' : 'estudo', lang,
    {slug:work.sucedidoPor.length > 1 ? work.subject : work.sucedidoPor[0].slug}) + '/';
}

export function redirecionamentosDosRetirados(works, partida) {
  return partida.estudos.flatMap(e => {
    const work = works.find(w => w.slug === e.slug);
    if (!work) throw Error(`REC2 estudo de partida desconhecido: ${e.slug}`);
    return [...new Set([...e.rotas, ...e.redirecionamentos_anteriores].map(normalizarRota))].map(rota => ({
      src:rota+'/?', status:301,
      headers:{Location:destinoDoRetirado(work, rota.startsWith('/en/') ? 'en' : 'pt', works)},
    }));
  });
}

export function conferirRedirecionamentos(works, partida, tabela, rotas) {
  const erros = [], presentes = new Set([...rotas].map(normalizarRota));
  const filesystem = tabela.findIndex(r => r.handle === 'filesystem');
  for (const esperado of redirecionamentosDosRetirados(works, partida)) {
    const encontrados = tabela.filter(r => r.src === esperado.src), r = encontrados[0];
    if (encontrados.length !== 1 || r.status !== 301 || r.headers?.Location !== esperado.headers.Location ||
        r.continue || r.has || r.missing || r.dest || filesystem < 0 || tabela.indexOf(r) > filesystem) {
      erros.push(`REC2 redirecionamento: ${esperado.src} tem de apontar permanentemente para ${esperado.headers.Location}`);
    }
    if (presentes.has(normalizarRota(esperado.src.slice(0,-1)))) erros.push(`REC2 origem construída: ${esperado.src}`);
    if (!presentes.has(normalizarRota(esperado.headers.Location))) erros.push(`REC2 destino inexistente: ${esperado.headers.Location}`);
  }
  return erros;
}

/** Percorre todo o sítio, incluindo mapa XML e ligações relativas ou com fragmento. */
export function conferirLigacoesRetiradas(works, rota, html) {
  const root = parse(html), erros = [];
  if (root.querySelector('[data-sucessor-edicao], [data-sucessor-reconcilia], .estudo-sucessor, .estudo-antecessores')) {
    erros.push(`REC2 nota de sucessão retirada: ${rota}`);
  }
  const destinos = [...root.querySelectorAll('[href]')].map(a => a.getAttribute('href'));
  destinos.push(...root.querySelectorAll('loc').map(el => el.textContent));
  for (const href of destinos) {
    let caminho;
    try { caminho = new URL(href, 'https://oestadodopais.pt' + rota).pathname; } catch { continue; }
    if (estudoDaRota(caminho, works)?.estado === 'retirado') erros.push(`REC2 ligação retirada: ${rota} -> ${href}`);
  }
  return erros;
}
