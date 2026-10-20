/* ER1-b: o número sai do contexto da página. O seu lugar tem de viajar.
   Reutiliza as declarações dos recibos, das regiões, dos estudos e da fonte.
   Um estudo novo sem lugar não herda Portugal em silêncio. */
import { familiaDaLinha } from './o-que-e-o-numero.mjs';
import { REGIOES } from '../data/regioes.mjs';
import { WORKS } from '../data/studies.mjs';
import { municipioPorSlug } from '../data/municipios.mjs';
import { LUGAR_DECLARADO_DAS_LINHAS } from '../data/lugar-das-linhas.mjs';
import { nomeDoPais } from './series.mjs';

/** @param {string} slug */
function nomeDaRegiao(slug) {
  const regiao = REGIOES.find(r => r.slug === slug);
  if (!regiao) throw Error(`ER1 lugar: a região ${slug} não está declarada.`);
  return regiao.nome;
}

/* Exceções lidas nas próprias linhas: a dimensão territorial do INE, os
   apuramentos CAOP, o âmbito do diploma e o par da distância calculada. */
const EXCECOES = {
  'eurostat-pt-phys': {pt:'Portugal',en:'Portugal'},
  'eurostat-pt-nrs': {pt:'Portugal',en:'Portugal'},
  'eurostat-be-phys': {pt:'Bélgica',en:'Belgium'},
  'eurostat-el-phys': {pt:'Grécia',en:'Greece'},
  'eurostat-ro-nrs': {pt:'Roménia',en:'Romania'},
  'eurostat-lu-nrs': {pt:'Luxemburgo',en:'Luxembourg'},
  'alentejo-central-poder-de-compra-2023': { pt: 'Alentejo Central', en: 'Alentejo Central' },
  'municipios-acores-caop-2025': nomeDaRegiao('acores'),
  'municipios-madeira-caop-2025': nomeDaRegiao('madeira'),
  'municipios-continente-caop-2025': { pt: 'Continente', en: 'Mainland Portugal' },
  'retribuicao-minima-mensal-garantida-continente-2026': { pt: 'Continente', en: 'Mainland Portugal' },
  'distancia-setubal-grande-lisboa-2024': Object.fromEntries(/** @type {const} */ (['pt','en']).map(lang => [lang,
    ['peninsula-de-setubal','grande-lisboa'].map(slug => nomeDaRegiao(slug)[lang]).join(' / ')])),
  // O pedido do IHPC contém duas geografias; a linha europeia declara a sua.
  'ihpc-variacao-homologa-ue': { pt: 'União Europeia', en: 'European Union' },
};
const ESTUDOS_DO_PAIS = new Set([
  'quadro-institucional', 'dominios-2026', 'oe-2026', 'oe-2027', 'agua-nao-faturada',
  'which-door-is-yours', 'penalizacoes-por-reforma-antecipada-2026',
  'evolucao-de-portugal-desde-1981', 'concelhos-2026',
]);
const APURAMENTOS_DO_PAIS = new Set(['municipios-portugal-caop-2025',
  'municipios-com-estudo-aprofundado', 'municipios-sem-estudo-aprofundado']);

/** @param {any} c @param {'pt'|'en'} lang @returns {{nome:string}} */
export function lugarDaIncorporacao(c, lang) {
  const f = familiaDaLinha(c.id);
  if (f.tipo === 'concelho') return { nome: f.concelho.nome[lang] };
  const excecao = /** @type {Record<string, any>} */ (EXCECOES)[c.id];
  if (excecao) return { nome: excecao[lang] };
  const regiao = REGIOES.find(r => ['valor','valorHistorico','distancia','distanciaHistorica']
    .some(k => /** @type {any} */ (r)[k] === c.id));
  if (regiao) return { nome: regiao.nome[lang] };
  const declarado = LUGAR_DECLARADO_DAS_LINHAS[c.id];
  if (declarado === 'o-estado-do-pais') return { nome: 'O Estado do País' };
  if (declarado === 'uniao-europeia') return { nome: lang === 'pt' ? 'União Europeia' : 'European Union' };
  if (declarado === 'portugal') return { nome: 'Portugal' };
  let url;
  try { url = new URL(c.source_url); } catch { /* Uma fórmula não tem URL. */ }
  const geos = url?.searchParams.getAll('geo') ?? [];
  if (geos.length === 1) {
    if (geos[0] === 'EU27_2020') return { nome: lang === 'pt' ? 'União Europeia' : 'European Union' };
    return { nome: nomeDoPais(geos[0], lang) };
  }
  if (url?.searchParams.get('Dim2') === 'PT') return { nome: 'Portugal' };
  const objeto = declarado || WORKS.find(w => w.id === c.study)?.subject;
  if (typeof objeto === 'string') {
    const municipio = municipioPorSlug(objeto);
    if (municipio) return { nome: municipio.nome[lang] };
    const r = REGIOES.find(r => r.slug === objeto);
    if (r) return { nome: r.nome[lang] };
  }
  if (ESTUDOS_DO_PAIS.has(c.study) || APURAMENTOS_DO_PAIS.has(c.id)) return { nome: 'Portugal' };
  throw Error(`ER1 lugar: a linha ${c.id} não tem lugar declarado.`);
}
