/** N1: as sete páginas de assunto, os dois índices, os lugares e as rotas antigas.
 * E1/E2 confrontam o catálogo nacional independente com o HTML construído.
 * E3 conserva secções, ordem, nomes e âmbito; E4 compara os dois índices.
 * E5 lê o mapa do sítio e exige também a primeira página como conhecido-positivo.
 * N1I recusa cartões no índice; N1C recusa cópias; N1R lê os redirecionamentos.
 * Cada planta altera uma só condição em memória e exige a queixa correspondente.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { linhaDoIndice } from '../../src/lib/assuntos.mjs';
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';
import { DOMINIO_DAS_MEDIDAS } from '../../src/data/dominios.mjs';
import { SITE_URL } from '../../site.config.mjs';

/** Os cartões de uma página, pela primeira linha de cada artigo do `<main>`. @param {any} root */
export function cartoesDaPagina(root) {
  const main = root.querySelector('main');
  if (!main) return [];
  return main.querySelectorAll('article.cartao-medida, article[data-cartao-camaras]').map((a) => a.querySelector('[data-claim]')?.getAttribute('data-claim')).filter(Boolean);
}

/** @param {string} dist @param {string} rota */
const ficheiro = (dist, rota) => path.join(dist, rota.replace(/^\//, ''), 'index.html');
/** Um caminho sem a barra do fim (a raiz fica «/»). @param {string} c */
const semBarra = (c) => c.replace(/\/+$/, '') || '/';

/**
 * OS ENDEREÇOS DO MAPA DO SÍTIO CONSTRUÍDO (E5): o índice, cada mapa que ele nomeia, e o caminho de cada
 * `<url>` de cada um. Um mapa nomeado que a construção não tem é um erro, e não um mapa vazio.
 *
 * @param {(rel: string) => string|null} lerTexto  o texto de um ficheiro da construção, ou `null`
 */
export function caminhosDoMapaDoSitio(lerTexto) {
  /** @type {string[]} */
  const erros = [];
  /** @type {Set<string>} */
  const caminhos = new Set();
  const origem = new URL(SITE_URL).origin;
  const indice = lerTexto('sitemap-index.xml');
  if (indice === null) { erros.push('E5: a construção não tem o índice do mapa do sítio (sitemap-index.xml).'); return { erros, caminhos, mapas: 0 }; }
  const mapas = [...indice.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!mapas.length) erros.push('E5: o índice do mapa do sítio não nomeia mapa nenhum.');
  for (const loc of mapas) {
    const u = new URL(loc);
    if (u.origin !== origem) erros.push(`E5: o índice nomeia um mapa fora da origem do sítio (${loc}).`);
    const texto = lerTexto(decodeURIComponent(u.pathname).replace(/^\//, ''));
    if (texto === null) { erros.push(`E5: o índice do mapa do sítio nomeia ${u.pathname}, que a construção não tem.`); continue; }
    for (const m of texto.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)) {
      const x = new URL(m[1].trim());
      if (x.origin !== origem) { erros.push(`E5: o mapa ${u.pathname} tem um endereço fora da origem do sítio (${m[1].trim()}).`); continue; }
      caminhos.add(semBarra(decodeURIComponent(x.pathname)));
    }
  }
  return { erros, caminhos, mapas: mapas.length };
}

/** A lista antiga é independente das declarações que a página usa. */
export const REDIRECIONAMENTOS_N1 = [
  ['/o-meu-dinheiro', '/temas/'], ['/en/my-money', '/en/themes/'],
  ['/o-meu-trabalho', '/emprego/'], ['/en/my-work', '/en/employment/'],
  ['/a-minha-casa', '/habitacao/'], ['/en/my-home', '/en/housing/'],
  ['/a-escola-e-a-saude', '/educacao-e-saude/'], ['/en/school-and-health', '/en/education-and-health/'],
  ['/o-estado-e-a-economia', '/estado-e-economia/'],
  ['/dominios', '/temas/'], ['/dominios/economia-e-financas-publicas', '/temas/'],
  ['/en/domains', '/en/themes/'], ['/en/domains/economia-e-financas-publicas', '/en/themes/'],
];

/** T10: a ordem protege a leitura dos inquilinos antes da média de todos. */
export function conferirOrdemDaHabitacao(root, lang) {
  const ordem = root.querySelectorAll('main [data-cartao-medida]').map((c) => c.getAttribute('data-cartao-medida'));
  return ordem[0] === 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025' && ordem[1] === 'sobrecarga-do-custo-da-habitacao-2025' ? [] : [`T10 ${lang} habitacao: a habitação não abre com os inquilinos e o total a seguir.`];
}

export function conferirEntradas(dist, {
  ler = (rota) => parse(fs.readFileSync(ficheiro(dist, rota), 'utf8')),
  lerTexto = (rel) => fs.existsSync(path.join(dist, rel)) ? fs.readFileSync(path.join(dist, rel), 'utf8') : null,
  entradas = ENTRADAS,
  regras = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).routes,
} = {}) {
  const erros = [];
  const contas = { edicoes: 0, cartoes_dos_temas: 0, cartoes_nas_entradas: 0, fora: 0, entradas_na_primeira: 0, entradas_no_indice: 0, mapas_do_sitio: 0, enderecos_no_mapa_do_sitio: 0, entradas_no_mapa_do_sitio: 0, redirecionamentos: 0 };
  const esperados = [...new Set(Object.keys(DOMINIO_DAS_MEDIDAS).filter((id) => id !== 'indice-de-divida-limite-legal').map((id) => id === 'taxa-de-desemprego-2025' ? 'taxa-de-desemprego-mip-2025' : id))];
  // RP4: a comparação europeia tem cartão em Preços sem ser um domínio português.
  esperados.push('ihpc-variacao-homologa-ue');
  const paginas = entradas.filter((e) => !e.existente);
  for (const lang of ['pt', 'en']) {
    const prefixo = lang === 'pt' ? 'Os números de Portugal sobre ' : 'Portugal’s figures on ';
    for (const e of entradas) if (!e.linha[lang].startsWith(prefixo)) erros.push(`E6 ${lang}: o âmbito de ${e.id} não nomeia Portugal.`);
    contas.edicoes++;
    const indice = ler(lang === 'pt' ? '/temas/' : '/en/themes/');
    const home = ler(lang === 'pt' ? '/' : '/en/');
    const nosTemas = cartoesDaPagina(indice);
    contas.cartoes_dos_temas += nosTemas.length;
    if (nosTemas.length) erros.push(`N1I ${lang}: o índice dos temas voltou a render cartões inteiros.`);
    const onde = new Map();
    for (const e of paginas) {
      const root = ler(e.rota[lang]);
      if (e.id === 'habitacao') erros.push(...conferirOrdemDaHabitacao(root, lang));
      const rendidos = cartoesDaPagina(root);
      const declarados = e.seccoes.flatMap((s) => s.cartoes);
      contas.cartoes_nas_entradas += rendidos.length;
      if (JSON.stringify(rendidos) !== JSON.stringify(declarados)) erros.push(`E3 ${lang}: a ordem ou os cartões de ${e.id} diferem das secções declaradas.`);
      if (root.querySelector('main h1')?.textContent.trim() !== e.nome[lang] || root.querySelector('main .entrada-linha')?.textContent.trim() !== e.linha[lang]) erros.push(`E3 ${lang}: o título ou o âmbito de ${e.id} difere da declaração.`);
      for (const id of rendidos) {
        onde.set(id, [...(onde.get(id) ?? []), e.id]);
        if (!esperados.includes(id)) erros.push(`E2 ${lang}: cartão ${id} fora do catálogo nacional.`);
      }
    }
    for (const id of esperados) {
      const donos = onde.get(id) ?? [];
      if (!donos.length) erros.push(`E1 ${lang}: cartão ${id} em falta nas páginas de assunto.`);
      if (donos.length > 1) erros.push(`N1C ${lang}: cartão ${id} inteiro em mais de uma página de assunto (${donos.join(', ')}).`);
    }
    for (const [nome, root] of [['primeira', home], ['índice', indice]]) {
      const lis = root.querySelectorAll('[data-indice-assuntos] > li[data-entrada]');
      contas[nome === 'primeira' ? 'entradas_na_primeira' : 'entradas_no_indice'] += lis.length;
      if (JSON.stringify(lis.map((li) => li.getAttribute('data-entrada'))) !== JSON.stringify(entradas.map((e) => e.id))) erros.push(`E4 ${lang}: a ordem das portas da ${nome} difere da declaração.`);
      for (const e of entradas) {
        const li = lis.find((x) => x.getAttribute('data-entrada') === e.id);
        if (li?.querySelector('a')?.getAttribute('href') !== e.rota[lang] || li?.querySelector('.pp-entrada-nome')?.textContent.trim() !== e.nome[lang] || li?.querySelector('.pp-entrada-linha')?.textContent.trim() !== (e.linha[lang].startsWith(prefixo) ? linhaDoIndice(e, lang) : null)) erros.push(`E4 ${lang}: porta ${e.id} da ${nome} difere da declaração.`);
        if (nome === 'índice' && JSON.stringify(li?.querySelectorAll('.assunto-seccoes li').map((n) => n.textContent.trim())) !== JSON.stringify(e.seccoes.map((s) => s.nome[lang]))) erros.push(`E4 ${lang}: as secções de ${e.id} não estão no índice pela ordem declarada.`);
      }
    }
    const lugares = ler(lang === 'pt' ? '/lugares/' : '/en/places/');
    const secoes = lugares.querySelectorAll('[data-lugares-seccao]').map((n) => n.textContent.trim());
    const declaradas = entradas.find((e) => e.id === 'lugares').seccoes.map((s) => s.nome[lang]);
    if (JSON.stringify(secoes) !== JSON.stringify(declaradas)) erros.push(`E7 ${lang}: os títulos dos lugares diferem das secções do índice.`);
    if (lugares.querySelectorAll('[data-cartao-camaras]').length !== 1) erros.push(`N1L ${lang}: falta o cartão das câmaras nos lugares.`);
    if (lugares.querySelector('[data-cartao-medida]')) erros.push(`N1C ${lang}: os lugares repetem um cartão nacional.`);
  }
  const mapa = caminhosDoMapaDoSitio(lerTexto);
  erros.push(...mapa.erros);
  contas.mapas_do_sitio = mapa.mapas;
  contas.enderecos_no_mapa_do_sitio = mapa.caminhos.size;
  if (!mapa.caminhos.has('/')) erros.push('E5: a primeira página não está no mapa do sítio.');
  for (const e of entradas) for (const lang of ['pt', 'en']) {
    if (!fs.existsSync(ficheiro(dist, e.rota[lang]))) erros.push(`E5 ${lang}: página ${e.rota[lang]} em falta.`);
    if (mapa.caminhos.has(semBarra(e.rota[lang]))) contas.entradas_no_mapa_do_sitio++;
    else erros.push(`E5 ${lang}: ${e.rota[lang]} não está no mapa do sítio.`);
  }
  for (const [origem, destino] of REDIRECIONAMENTOS_N1) {
    const regra = regras.find((r) => r.src === `${origem}/?`);
    if (regra?.status !== 301 || regra?.headers?.Location !== destino || regras.indexOf(regra) > regras.findIndex((r) => r.handle === 'filesystem')) erros.push(`N1R ${origem}: redirecionamento incorreto.`);
    else contas.redirecionamentos++;
    if (!fs.existsSync(ficheiro(dist, destino))) erros.push(`N1R ${origem}: destino em falta.`);
    if (fs.existsSync(ficheiro(dist, origem)) || mapa.caminhos.has(origem)) erros.push(`N1R ${origem}: rota antiga ainda construída ou no mapa.`);
  }
  return { erros, contas };
}

export function plantasDasEntradas(dist) {
  const le = (rota) => parse(fs.readFileSync(ficheiro(dist, rota), 'utf8'));
  const texto = (rel) => fs.existsSync(path.join(dist, rel)) ? fs.readFileSync(path.join(dist, rel), 'utf8') : null;
  const planta = (nome, rota, estraga, mordida, ficheiroTexto = null, estragaTexto = null) => {
    const r = conferirEntradas(dist, { ler: (x) => { const root = le(x); if (x === rota) estraga(root); return root; }, lerTexto: (rel) => rel === ficheiroTexto ? estragaTexto(texto(rel)) : texto(rel) });
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: Boolean(queixa), queixa: queixa ?? null };
  };
  const cartao = le('/salarios-pensoes-e-apoios/').querySelector('[data-cartao-medida="pensao-media-anual-2025"]').outerHTML;
  const plantas = [
    planta('cartão inteiro repetido noutra página de assunto', '/emprego/', (r) => r.querySelector('main .pais-cartoes').insertAdjacentHTML('beforeend', cartao), /^N1C pt: cartão pensao-media-anual-2025/),
    planta('cartão da União omitido', '/precos/', (r) => r.querySelector('[data-cartao-medida="ihpc-variacao-homologa-ue"]').remove(), /^E1 pt: cartão ihpc-variacao-homologa-ue/),
    planta('cartão fora do catálogo permitido', '/precos/', (r) => r.querySelector('main .pais-cartoes').insertAdjacentHTML('beforeend', '<article class="cartao-medida" data-cartao-medida="cartao-fora-do-catalogo"><span data-claim="cartao-fora-do-catalogo">0</span></article>'), /^E2 pt: cartão cartao-fora-do-catalogo/),
    planta('cartão nacional omitido', '/en/housing/', (r) => r.querySelector('[data-cartao-medida="licencas-de-construcao-2025"]').remove(), /^E1 en: cartão licencas-de-construcao-2025/),
    ...['pt', 'en'].map((lang) => planta(`inquilinos depois do total (${lang})`, lang === 'pt' ? '/habitacao/' : '/en/housing/', (r) => { const cs = r.querySelectorAll('[data-cartao-medida]'); const primeiro = cs[0].outerHTML; cs[0].replaceWith(cs[1].outerHTML); cs[1].replaceWith(primeiro); }, new RegExp(`^T10 ${lang} habitacao:`))),
    planta('cartão inteiro nos temas', '/temas/', (r) => r.querySelector('main').insertAdjacentHTML('beforeend', cartao), /^N1I pt:/),
    planta('porta retirada da primeira página', '/', (r) => r.querySelector('[data-entrada]').remove(), /^E4 pt: a ordem/),
    planta('linha longa indevida no índice', '/en/themes/', (r) => r.querySelector('.pp-entrada-linha').set_content(ENTRADAS[0].linha.en), /^E4 en: porta precos/),
    planta('título dos lugares diferente do índice', '/lugares/', (r) => r.querySelector('[data-lugares-seccao]').set_content('Outra secção'), /^E7 pt:/),
    planta('secção retirada do índice', '/temas/', (r) => r.querySelector('.assunto-seccoes li').remove(), /^E4 pt: as secções/),
    planta('âmbito errado na página de assunto', '/emprego/', (r) => r.querySelector('.entrada-linha').set_content('Uma frase sem o país.'), /^E3 pt: o título ou o âmbito/),
    planta('cartão das câmaras retirado dos lugares', '/lugares/', (r) => r.querySelector('[data-cartao-camaras]').remove(), /^N1L pt:/),
    planta('porta omitida do mapa do sítio', null, null, /^E5 en: \/en\/employment\//, 'sitemap-0.xml', (t) => t.replace(/<url>\s*<loc>[^<]*\/en\/employment<\/loc>[\s\S]*?<\/url>/, '')),
    planta('mapa nomeado em falta', null, null, /^E5:.*sitemap-1/, 'sitemap-index.xml', (t) => t.replace('</sitemapindex>', `<sitemap><loc>${new URL('/sitemap-1.xml', SITE_URL).href}</loc></sitemap></sitemapindex>`)),
  ];
  const regras = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).routes;
  regras.find((r) => r.src === '/en/my-work/?').headers.Location = '/en/themes/';
  const erro = conferirEntradas(dist, { regras }).erros.find((e) => /^N1R \/en\/my-work:/.test(e));
  plantas.push({ nome: 'redirecionamento inglês para a página errada', mordeu: Boolean(erro), queixa: erro ?? null });
  const semPais = structuredClone(ENTRADAS);
  semPais.find((e) => e.id === 'emprego').linha.pt = 'Os números sobre o emprego.';
  const pais = conferirEntradas(dist, { entradas: semPais }).erros.find((e) => /^E6 pt:/.test(e));
  plantas.push({ nome: 'país retirado da declaração', mordeu: Boolean(pais), queixa: pais ?? null });
  return plantas;
}
