/**
 * AS ENTRADAS POR PERGUNTA DA VIDA, CONFERIDAS CONTRA A PÁGINA DOS TEMAS (bloco PP1, 28.09.2026).
 *
 * O §2, ponto 4, do brief: «uma célula confere que cada cartão dos temas está numa só entrada, salvo o
 * declarado, e que cada cartão de uma entrada existe nos temas». A conta faz-se sobre as páginas
 * construídas, nas duas edições, e não sobre a declaração: a pergunta é o que o leitor encontra.
 *
 *   E1 · cada cartão da página dos temas está numa entrada, e só numa, salvo os de
 *        `CARTOES_FORA_DAS_ENTRADAS`, que não estão em nenhuma;
 *   E2 · cada cartão de uma entrada existe na página dos temas;
 *   E3 · cada entrada rende os cartões que a declaração lhe dá, pela ordem declarada, e mais nenhum;
 *   E4 · a primeira página tem as seis entradas, pela ordem declarada, cada uma com a porta da sua página,
 *        e a porta abre uma página construída.
 *
 * Um cartão conhece-se pelo primeiro `data-claim` do seu artigo (`article.cartao-medida`, e o do
 * cartão das câmaras, `article[data-cartao-camaras]`), que é a conta que o §0 do brief fez sobre a
 * página dos temas: o cartão das câmaras conta como o índice da dívida do município em relação ao
 * limite legal, que é a sua primeira linha. Um artigo de estudo com um número na sinopse não é um
 * cartão (a página do dinheiro tem um).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { ENTRADAS, CARTOES_FORA_DAS_ENTRADAS } from '../../src/data/primeira-pagina.mjs';

/** Os cartões de uma página, pela primeira linha de cada artigo do `<main>`. @param {any} root */
export function cartoesDaPagina(root) {
  const main = root.querySelector('main');
  if (!main) return [];
  return main.querySelectorAll('article.cartao-medida, article[data-cartao-camaras]').map((a) => a.querySelector('[data-claim]')?.getAttribute('data-claim')).filter(Boolean);
}

/** @param {string} dist @param {string} rota */
const ficheiro = (dist, rota) => path.join(dist, rota.replace(/^\//, ''), 'index.html');

/**
 * @param {string} dist
 * @param {{ ler?: (rota: string) => any }} [opcoes] `ler` deixa as plantas trocar uma página por uma cópia estragada
 */
export function conferirEntradas(dist, { ler = (rota) => parse(fs.readFileSync(ficheiro(dist, rota), 'utf8')) } = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { edicoes: 0, cartoes_dos_temas: 0, cartoes_nas_entradas: 0, fora: 0, entradas_na_primeira: 0 };
  const paginas = ENTRADAS.filter((e) => !('existente' in e && e.existente));
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    contas.edicoes++;
    const temas = cartoesDaPagina(ler(lang === 'pt' ? '/temas/' : '/en/themes/'));
    if (temas.length === 0) { erros.push(`E1 ${lang}: a página dos temas não tem cartão nenhum; a célula não mediu nada`); continue; }
    contas.cartoes_dos_temas += temas.length;
    /** @type {Map<string, string[]>} */
    const onde = new Map();
    for (const e of paginas) {
      const rendidos = cartoesDaPagina(ler(e.rota[lang]));
      contas.cartoes_nas_entradas += rendidos.length;
      const declarados = e.seccoes.flatMap((s) => s.cartoes);
      if (JSON.stringify(rendidos) !== JSON.stringify(declarados)) {
        const aMais = rendidos.filter((c) => !declarados.includes(c));
        const aMenos = declarados.filter((c) => !rendidos.includes(c));
        erros.push(`E3 ${lang}: a entrada «${e.id}» rende ${rendidos.length} cartões e a declaração dá-lhe ${declarados.length}` +
          `${aMais.length ? `; a mais: ${aMais.join(', ')}` : ''}${aMenos.length ? `; a menos: ${aMenos.join(', ')}` : ''}${!aMais.length && !aMenos.length ? '; a ordem difere' : ''}.`);
      }
      for (const c of rendidos) {
        onde.set(c, [...(onde.get(c) ?? []), e.id]);
        if (!temas.includes(c)) erros.push(`E2 ${lang}: o cartão ${c} da entrada «${e.id}» não existe na página dos temas.`);
      }
    }
    for (const c of temas) {
      const n = onde.get(c) ?? [];
      if (c in CARTOES_FORA_DAS_ENTRADAS) {
        contas.fora++;
        if (n.length) erros.push(`E1 ${lang}: o cartão ${c} está declarado fora das entradas e está em «${n.join(', ')}».`);
      } else if (n.length === 0) erros.push(`E1 ${lang}: o cartão ${c} dos temas não está em entrada nenhuma.`);
      else if (n.length > 1 || new Set(n).size !== n.length) erros.push(`E1 ${lang}: o cartão ${c} está em mais do que uma entrada (${n.join(', ')}).`);
    }
    for (const [c, n] of onde) if (n.length > 1) erros.push(`E1 ${lang}: o cartão ${c} repete-se nas entradas (${n.join(', ')}).`);
    /* E4 · as seis entradas na primeira página. */
    const home = ler(lang === 'pt' ? '/' : '/en/');
    const lis = home.querySelectorAll('main [data-entradas] li[data-entrada]');
    contas.entradas_na_primeira += lis.length;
    const ids = lis.map((li) => li.getAttribute('data-entrada'));
    if (JSON.stringify(ids) !== JSON.stringify(ENTRADAS.map((e) => e.id))) erros.push(`E4 ${lang}: a primeira página tem as entradas «${ids.join(', ')}» e a declaração «${ENTRADAS.map((e) => e.id).join(', ')}».`);
    for (const e of ENTRADAS) {
      const li = lis.find((x) => x.getAttribute('data-entrada') === e.id);
      const a = li?.querySelector('a');
      const href = a?.getAttribute('href') ?? '';
      if (!a || href !== e.rota[lang]) erros.push(`E4 ${lang}: a entrada «${e.id}» não leva à sua página (${href} em vez de ${e.rota[lang]}).`);
      else if (!fs.existsSync(ficheiro(dist, href))) erros.push(`E4 ${lang}: a porta da entrada «${e.id}» abre ${href}, que a construção não tem.`);
      if (li && (li.querySelector('.pp-entrada-nome')?.textContent.trim() !== e.nome[lang] || li.querySelector('.pp-entrada-linha')?.textContent.trim() !== e.linha[lang])) {
        erros.push(`E4 ${lang}: o nome ou a linha da entrada «${e.id}» não são os declarados.`);
      }
    }
  }
  return { erros, contas };
}

/**
 * AS PLANTAS DA CÉLULA: um cartão repetido noutra entrada e um cartão em falta, cada um numa cópia em
 * memória da página construída, com a mordida esperada.
 *
 * @param {string} dist
 */
export function plantasDasEntradas(dist) {
  const cache = new Map();
  const le = (/** @type {string} */ rota) => { if (!cache.has(rota)) cache.set(rota, fs.readFileSync(ficheiro(dist, rota), 'utf8')); return parse(cache.get(rota)); };
  /** @param {string} nome @param {Record<string, (r: any) => void>} estragos @param {RegExp} mordida */
  const planta = (nome, estragos, mordida) => {
    const r = conferirEntradas(dist, { ler: (rota) => { const x = le(rota); if (estragos[rota]) estragos[rota](x); return x; } });
    const q = r.erros.find((e) => mordida.test(e)) ?? null;
    return { nome, mordeu: q !== null, queixa: q ?? r.erros[0] ?? null };
  };
  const cartao = (/** @type {any} */ r, /** @type {string} */ id) => r.querySelector(`main article[data-cartao-medida="${id}"]`);
  return [
    planta('um cartão repetido noutra entrada', {
      '/o-meu-trabalho/': (r) => r.querySelector('main .pais-cartoes').insertAdjacentHTML('beforeend', cartao(le('/o-meu-dinheiro/'), 'pensao-media-anual-2025').outerHTML),
    }, /^E1 pt: o cartão pensao-media-anual-2025 está em mais do que uma entrada/),
    planta('um cartão dos temas em falta nas entradas', {
      '/en/my-home/': (r) => cartao(r, 'licencas-de-construcao-2025').remove(),
    }, /^E1 en: o cartão licencas-de-construcao-2025 dos temas não está em entrada nenhuma/),
    planta('um cartão de uma entrada que os temas não têm', {
      '/temas/': (r) => cartao(r, 'jovens-nem-2025').remove(),
    }, /^E2 pt: o cartão jovens-nem-2025 da entrada «trabalho» não existe na página dos temas/),
    planta('uma entrada a mais na primeira página', {
      '/': (r) => r.querySelector('main [data-entradas] ul').insertAdjacentHTML('beforeend', '<li data-entrada="saude"><a href="/a-minha-saude/">A minha saúde</a></li>'),
    }, /^E4 pt: a primeira página tem as entradas/),
  ];
}
