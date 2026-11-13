import { routePath } from '../src/lib/routes.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { slugsDasRegioes } from '../src/lib/regioes.mjs';
import { edicaoPublicada } from '../src/data/studies.mjs';
import { SITE_URL } from '../site.config.mjs';
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
  if (work.estado !== 'retirado') throw Error(`REC2 trabalho não retirado: ${work.slug}`);
  const sucessores = (work.sucedidoPor ?? []).map(s => {
    const sucessor = works.find(w => w.slug === s.slug);
    if (!sucessor) throw Error(`REC2 sucessor desconhecido: ${s.slug}`);
    return sucessor;
  }).filter(w => w.estado !== 'retirado' && (!w.editions || w.editions.some(e => edicaoPublicada(w, e))));
  if (sucessores.length === 1) return routePath('estudo', lang, {slug:sucessores[0].slug}) + '/';
  if (work.subject) {
    if (MUNICIPIOS_COM_PAGINA.some(m => m.slug === work.subject)) return routePath('municipio', lang, {slug:work.subject}) + '/';
    if (slugsDasRegioes().includes(work.subject)) return routePath('regiao', lang, {slug:work.subject}) + '/';
  }
  return routePath('estudos', lang) + '/';
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
  erros.push(...conferirReferenciasSemLigacao(works, rota, html));
  const citacoesVivas = new Set(works.filter(w => w.estado !== 'retirado').flatMap(w => Object.values(w.verbatimDaAbertura ?? {})));
  const citacoesRetiradas = works.filter(w => w.estado === 'retirado').flatMap(w => Object.values(w.verbatimDaAbertura ?? {})).filter(k => !citacoesVivas.has(k));
  for (const el of root.querySelectorAll('[data-verbatim]')) if (citacoesRetiradas.includes(el.getAttribute('data-verbatim'))) erros.push(`REC2 citação exclusiva de estudo retirado: ${rota}`);
  if (root.querySelector('[data-sucessor-edicao], [data-sucessor-reconcilia], .estudo-sucessor, .estudo-antecessores')) {
    erros.push(`REC2 nota de sucessão retirada: ${rota}`);
  }
  const destinos = [...root.querySelectorAll('[href]')].map(a => a.getAttribute('href'));
  destinos.push(...root.querySelectorAll('loc').map(el => el.textContent));
  for (const href of destinos) {
    let caminho;
    try { caminho = new URL(href, new URL(rota, SITE_URL)).pathname; } catch { continue; }
    if (estudoDaRota(caminho, works)?.estado === 'retirado') erros.push(`REC2 ligação retirada: ${rota} -> ${href}`);
  }
  return erros;
}

/** As alcunhas são dados do trabalho; a retirada também invalida remissões sem href. */
export function conferirReferenciasSemLigacao(works, rota, html) {
  const root = parse(html), erros = [];
  for (const el of root.querySelectorAll('head, script, style, template, [hidden], [aria-hidden="true"]')) el.remove();
  // Só a história datada do recibo e o registo de correções conservam nomes antigos.
  if (/^\/(?:correcoes|en\/corrections)\/?$/.test(rota)) return [];
  if (/^\/(?:livro-razao|en\/ledger)\/[^/]+\/?$/.test(rota)) {
    for (const el of root.querySelectorAll('.historico-entrada')) {
      const data = el.querySelector('[data-correcao-campo="date"]')?.textContent.trim();
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(data ?? '')) el.remove();
    }
  }
  const normalizar = s => s.normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt');
  const texto = normalizar(root.textContent);
  for (const work of works) {
    if (work.estado !== 'retirado' && (work.editions ?? []).some(e => edicaoPublicada(work, e))) continue;
    const nomes = [...Object.values(work.alcunhas ?? {}).flat(),
      ...(work.editions ?? []).map(e => e.title),
      routePath('estudo', 'pt', {slug:work.slug}), routePath('estudo', 'en', {slug:work.slug})];
    for (const nome of new Set(nomes.filter(Boolean))) if (texto.includes(normalizar(nome))) {
      erros.push(`RET1 remissão para estudo não publicado: ${rota}: ${nome}`);
    }
  }
  return erros;
}
