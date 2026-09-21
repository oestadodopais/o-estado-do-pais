import { WORKS, subjectLabel } from '../data/studies.mjs';
import { leituraDe } from '../data/leituras.mjs';
import { DOMINIOS } from '../data/dominios.mjs';
import { dataDaEdicaoNoRepositorio } from './datas-do-repositorio.mjs';
import { routePath } from './routes.mjs';
import { getClaim } from './ledger.mjs';

/** @param {typeof WORKS[number]} work @param {'pt'|'en'} lang */
export function fichaDoEstudo(work, lang) {
  const edicao = work.editions.find(e => e.lang === lang) ?? work.editions[0];
  const data = dataDaEdicaoNoRepositorio(work.slug, edicao.lang);
  const tema = DOMINIOS.find(d => d.slug === work.tema);
  if (!tema) throw new Error(`B1 tema em falta ou desconhecido: ${work.slug}`);
  const leitura = leituraDe(work.id);
  return { work, edicao, data, tema: tema.nome[lang], lugar: subjectLabel(work.subject, lang) ?? 'Portugal',
    /* A MARCA DO VERBATIM SÓ VALE QUANDO O RESUMO É A DESCRIÇÃO (B1, peça 2):
       com leitura escrita, o que se rende são as duas primeiras frases dela, e
       declará-las como a abertura transcrita do documento era dizer que o
       portão compara duas coisas diferentes. */
    temLeitura: Boolean(leitura),
    resumo: primeirasFrases(leitura?.frase[lang] ?? [work.description[lang]]).map(p =>
      typeof p !== 'string' && 'claim' in p && getClaim(p.claim).unit === '%' && !p.sufixo
        ? { ...p, sufixo: '%' } : p),
    rota: routePath('estudo', lang, { slug: work.slug }) };
}
/** Conserva os objetos Claim e recorta só prosa, sem cortar números de uma linha.
 * @param {PedacoDeFrase[]} partes
 */
export function primeirasFrases(partes) {
  let faltam = 2;
  const saida = [];
  for (const parte of partes) {
    if (!faltam) break;
    if (typeof parte !== 'string') { saida.push(parte); continue; }
    const fins = [...parte.matchAll(/[.!?](?=\s|$)/g)];
    if (fins.length >= faltam) {
      saida.push(parte.slice(0, /** @type {number} */ (fins[faltam - 1].index) + 1));
      break;
    }
    saida.push(parte);
    faltam -= fins.length;
  }
  return saida;
}
/** @param {'pt'|'en'} lang */
export function estudosDoPais(lang) {
  return WORKS.filter(w => !w.subject).map(w => fichaDoEstudo(w, lang))
    .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? '') || WORKS.indexOf(a.work) - WORKS.indexOf(b.work));
}
/** @param {string} lugar @param {'pt'|'en'} lang */
export function portaDoLugar(lugar, lang) {
  return routePath(lugar === 'evora' ? 'municipio' : 'regiao', lang, { slug: lugar }) + '#trabalhos';
}
