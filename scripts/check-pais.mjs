#!/usr/bin/env node
/** B1, peça 3. Leitor próprio do HTML, da tabela declarada e do livro.
 * Não importa a seleção nem as funções da página que está a conferir. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { DOMINIOS, DOMINIO_DAS_MEDIDAS } from '../src/data/dominios.mjs';
import { MUDANCAS_DO_PROJETO } from '../src/data/mudancas-do-projeto.mjs';
import { WORKS, linguaDoTitulo } from '../src/data/studies.mjs';
import { REGIOES } from '../src/data/regioes.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { LUGAR_DECLARADO_DAS_LINHAS } from '../src/data/lugar-das-linhas.mjs';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { routePath } from '../src/lib/routes.mjs';
import { t } from '../src/i18n/strings.mjs';
const raiz = process.cwd();
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const erros = [];
const normal = s => (s ?? '').replace(/\s+/g, ' ').trim();
const le = rel => parse(fs.readFileSync(path.join(dist, rel, 'index.html'), 'utf8'));
const linha = id => load(fs.readFileSync(path.join(raiz, 'ledger/claims', `${id}.yml`), 'utf8'));
const caminho = (lang, pt, en) => lang === 'pt' ? pt : en;
const data = iso => iso.split('-').reverse().join('.');
const decisoes = fs.readFileSync('DECISIONS.md', 'utf8');
const capitulos = new Set([...decisoes.matchAll(/^### (\d+\.\d+)\s/gm)].map(m => m[1]));
const temas = new Map(DOMINIOS.map(d => [d.slug, d]));
const ids = Object.keys(DOMINIO_DAS_MEDIDAS);
// A única reunião é documentada e conferida, antes de subtrair uma entrada.
const desempregos = ['taxa-de-desemprego-2025', 'taxa-de-desemprego-mip-2025'].map(linha);
if (desempregos[0].value !== desempregos[1].value || desempregos[0].unit !== desempregos[1].unit || desempregos[0].reference_date !== desempregos[1].reference_date)
  erros.push('T0: as duas linhas de desemprego deixaram de ser a mesma medida.');
const reunidas = ids.filter(id => id !== 'taxa-de-desemprego-2025');
for (const [id, tema] of Object.entries(DOMINIO_DAS_MEDIDAS)) {
  if (!temas.has(tema)) erros.push(`T1: ${id} sem tema válido na tabela.`);
  linha(id);
}
/* O TEXTO DE UMA MUDANÇA DECLARADA, lido por conta própria (bloco R1,
   23.09.2026). Uma cadeia, ou uma lista de pedaços em que um valor é
   `{ claim, sufixo }`: achata-se com o valor que o livro-razão escreve, lido do
   YAML e não da função da página, e compara-se com o texto rendido sem os selos,
   que são portas e não frase. */
const textoDeclarado = t => typeof t === 'string' ? t : Array.isArray(t)
  ? t.map(p => typeof p === 'string' ? p : `${linha(p.claim).value}${p.sufixo ?? ''}`).join('') : null;
const soPalavras = t => typeof t === 'string' ? t : Array.isArray(t) ? t.filter(p => typeof p === 'string').join(' ') : '';
const semSelos = el => { if (!el) return ''; const c = parse(el.outerHTML); c.querySelectorAll('a.src-chip').forEach(n => n.remove()); return normal(c.textContent); };
/* M4 · A LÍNGUA DO LEITOR NAS MUDANÇAS DECLARADAS (bloco R1, 23.09.2026, I141).
   «Saíram dos recibos e dos cartões» estava na primeira página: duas palavras do
   código, que a estrutura §6 põe fora das páginas do leitor. A célula recusa-as
   nas duas edições, e recusa também «livro-razão», «excerto» e «linha», que são
   as outras palavras da máquina que um texto destes tem à mão. Escritas aqui, e
   não importadas: uma régua que lesse a lista da coisa que mede não media nada. */
const PALAVRAS_DO_CODIGO = {
  pt: /(?<![\p{L}-])(recibos?|cart(?:ão|ões)|livro-razão|excertos?|linhas?)(?![\p{L}-])/iu,
  en: /(?<![\p{L}-])(receipts?|cards?|ledger|excerpts?|rows?|lines?)(?![\p{L}-])/iu,
};
const mudancasVistas = new Set();
for (const m of MUDANCAS_DO_PROJETO) {
  if (!m.decisao || !capitulos.has(m.decisao)) erros.push(`M1: ${m.id} sem secção existente de DECISIONS.md.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.data) || !m.texto?.pt || !m.texto?.en || mudancasVistas.has(m.id)) erros.push(`M1: entrada incompleta ou repetida ${m.id}.`);
  mudancasVistas.add(m.id);
  for (const lang of ['pt', 'en']) {
    const achada = soPalavras(m.texto?.[lang]).match(PALAVRAS_DO_CODIGO[lang]);
    if (achada) erros.push(`M4: a mudança ${m.id} (${lang}) fala na língua do código: «${achada[1]}».`);
  }
}
/* O conhecido-positivo da M4: o mesmo detetor encontra a palavra numa frase de
   mentira com a forma do defeito de 21.09.2026, nas duas línguas. */
if (!'saíram dos recibos e dos cartões'.match(PALAVRAS_DO_CODIGO.pt) || !'were removed from receipts and cards'.match(PALAVRAS_DO_CODIGO.en))
  erros.push('M4: o detetor das palavras do código não vê a frase de 21.09.2026.');
const datas = JSON.parse(fs.readFileSync('src/data/datas-de-publicacao.json', 'utf8')).edicoes;
const correcoesEsperadas = new Set();
/* B1c: a identidade de cada mudança, sem a data, que é o que o registo declara.
   `correcoesEsperadas` guarda a data porque a C1 e a M3 a comparam; a A3 conta
   as entradas, e conta-as pela linha e pelo índice. */
const chavesDoLivro = new Set();
for (const f of fs.readdirSync('ledger/claims').filter(f=>f.endsWith('.yml'))) {
  const c = linha(f.slice(0,-4));
  (c.corrections ?? []).forEach((e, n) => {
    if (['correcao','atualizacao'].includes(e.kind)) {
      correcoesEsperadas.add(`${c.id}|${n}|${e.date}`);
      chavesDoLivro.add(`correcao|${c.id}|${n}`);
    }
  });
}

/* ===========================================================================
   B1c · «O QUE MUDOU» NO SEU LUGAR: O ÂMBITO, O TETO E O REGISTO
   ===========================================================================
   Três células novas, e as três leem o lugar de cada linha por conta própria,
   das mesmas declarações que a página lê mas sem chamar a função que a compõe:
   a tabela dos lugares declarados, a região que nomeia a linha, o estudo que
   declara o objeto, o concelho que a rende no relance, e a tabela das medidas
   do país com as sete linhas que a leitura cita.

     A1 · uma linha fora do âmbito da sua página fecha a construção;
     A2 · mais linhas do que o teto fecham;
     A3 · o registo tem exactamente as entradas do livro inteiro, as publicações
          do arquivo e as mudanças declaradas: nem uma a mais, nem uma a menos.

   O TETO ESTÁ ESCRITO AQUI, e não importado: uma régua que leia o número da
   coisa que mede não mede nada. */
const TETO = 8;
const PAIS = 'portugal';
const CAMPOS_DA_REGIAO = ['valor', 'valorHistorico', 'distancia', 'distanciaHistorica'];
const regiaoDaLinha = new Map();
for (const r of REGIOES) for (const campo of CAMPOS_DA_REGIAO)
  if (typeof r[campo] === 'string') regiaoDaLinha.set(r[campo], r.slug);
const concelhoDaLinha = new Map();
for (const m of MUNICIPIOS_COM_PAGINA) for (const p of m.relance ?? []) {
  if (!p.claim) continue;
  concelhoDaLinha.set(p.claim, concelhoDaLinha.has(p.claim) && concelhoDaLinha.get(p.claim) !== m.slug ? null : m.slug);
}
const objetoDoEstudo = new Map(WORKS.filter(w => typeof w.subject === 'string').map(w => [w.id, w.subject]));
/* As sete linhas da leitura do país, escritas aqui como a L2 e a L3 as
   escrevem: é a lista da régua, e não a da página. */
const LINHAS_DA_LEITURA = ['divida-publica-2024','divida-publica-2025','divida-publica-2025-ue','taxa-de-desemprego-2025','taxa-de-desemprego-2025-ue','precos-da-habitacao-2025','precos-da-habitacao-2025-ue'];
const linhasDoPais = new Set([...Object.keys(DOMINIO_DAS_MEDIDAS), ...LINHAS_DA_LEITURA]);
/* -------------------------------------------------- o lugar, por duas vias

   A leitura a frio de 22.09.2026 apanhou o defeito: o compositor e esta régua
   devolviam a declaração explícita de `lugar-das-linhas.mjs` antes de tudo, e
   por isso concordavam num valor errado — uma régua que lê a mesma declaração
   que a página lê não é uma segunda leitura, é a mesma. A régua passa a DERIVAR
   o lugar por conta própria, do estudo que a linha declara e dos segmentos do
   seu identificador, e a COMPARAR com a declaração. Uma declaração que
   contradiga a derivação fecha a construção, e a tabela explícita — que é a que
   pode mentir sem que nada a trave — tem de derivar, em cada entrada, o lugar
   que declara. */
const SLUGS_DOS_LUGARES = [...REGIOES.map(r => r.slug), ...MUNICIPIOS_COM_PAGINA.map(m => m.slug)];
/** O lugar cujo slug aparece, inteiro e por segmentos, no identificador da
 *  linha. O mais comprido ganha (`vila-real` antes de `real`); dois que não se
 *  contenham um ao outro são uma ambiguidade, e dizem-se. */
function lugarNoIdentificador(id) {
  const seg = id.split('-');
  const achados = [];
  for (const slug of SLUGS_DOS_LUGARES) {
    const p = slug.split('-');
    for (let i = 0; i + p.length <= seg.length; i++)
      if (p.every((x, k) => seg[i + k] === x)) { achados.push(slug); break; }
  }
  if (!achados.length) return null;
  achados.sort((a, b) => b.split('-').length - a.split('-').length || b.length - a.length);
  const maior = achados[0];
  const outros = achados.filter(x => x !== maior && !maior.includes(x));
  if (outros.length) {
    erros.push(`A1: o identificador ${id} nomeia mais do que um lugar (${[maior, ...outros].join(', ')}).`);
    return null;
  }
  return maior;
}
/** O lugar DERIVADO, sem olhar para nenhuma tabela de lugares declarados. */
function lugarDerivado(id) {
  const c = linha(id);
  const doEstudo = typeof c.study === 'string' ? objetoDoEstudo.get(c.study) : undefined;
  const doId = lugarNoIdentificador(id);
  const d = [...new Set([doEstudo, doId].filter(x => typeof x === 'string'))];
  if (d.length > 1) {
    erros.push(`A1: a linha ${id} deriva dois lugares diferentes (${d.join(', ')}).`);
    return null;
  }
  return d[0] ?? null;
}
/** O lugar DECLARADO, pela ordem que as declarações do repositório dão. */
function lugarDeclarado(id) {
  if (LUGAR_DECLARADO_DAS_LINHAS[id]) return LUGAR_DECLARADO_DAS_LINHAS[id];
  const c = linha(id);
  const candidatos = [...new Set([
    regiaoDaLinha.get(id),
    typeof c.study === 'string' ? objetoDoEstudo.get(c.study) : undefined,
    concelhoDaLinha.get(id) ?? undefined,
    linhasDoPais.has(id) ? PAIS : undefined,
  ].filter(x => typeof x === 'string'))];
  if (candidatos.length > 1) {
    erros.push(`A1: a linha ${id} é declarada de mais do que um lugar (${candidatos.join(', ')}).`);
    return null;
  }
  return candidatos[0] ?? null;
}
const lugarVisto = new Map();
function lugarDaLinha(id) {
  if (lugarVisto.has(id)) return lugarVisto.get(id);
  const declarado = lugarDeclarado(id);
  const derivado = lugarDerivado(id);
  if (declarado && derivado && declarado !== derivado)
    erros.push(`A1: a linha ${id} é declarada de «${declarado}» e deriva de «${derivado}».`);
  lugarVisto.set(id, declarado);
  return declarado;
}
/* A tabela explícita, entrada a entrada: cada uma tem de derivar o lugar que
   declara. É o conhecido-positivo desta comparação — sem ele, uma tabela que
   nunca derivasse nada passava por não haver nada com que discordar. */
for (const [id, chave] of Object.entries(LUGAR_DECLARADO_DAS_LINHAS)) {
  const derivado = lugarDerivado(id);
  if (!derivado) erros.push(`A1: ${id} está em lugar-das-linhas.mjs e não deriva lugar nenhum.`);
  else if (derivado !== chave) erros.push(`A1: ${id} é declarado de «${chave}» e deriva de «${derivado}».`);
}
/** O nome e a porta de um lugar, na língua da edição, compostos aqui. */
function nomeDoLugar(chave, lang) {
  if (chave === PAIS) return ROTULOS_B1[lang].pais;
  const r = REGIOES.find(x => x.slug === chave);
  if (r) return r.nome[lang] ?? r.nome.pt;
  const m = MUNICIPIOS_COM_PAGINA.find(x => x.slug === chave);
  return m ? (m.nome[lang] ?? m.nome.pt) : null;
}
function rotaDoLugar(chave, lang) {
  if (chave === PAIS) return routePath('home', lang);
  if (REGIOES.some(x => x.slug === chave)) return routePath('regiao', lang, { slug: chave });
  return MUNICIPIOS_COM_PAGINA.some(x => x.slug === chave) ? routePath('municipio', lang, { slug: chave }) : null;
}

/** A identidade de uma linha de mudança, lida do HTML e de mais nada. */
function chaveDaMudanca(li) {
  const tipo = li.getAttribute('data-mudanca');
  if (tipo === 'correcao') {
    const id = li.getAttribute('data-correcao-entrada');
    const n = li.querySelector('[data-correcao-campo="date"]')?.getAttribute('data-correcao-n');
    return { tipo, chave: `correcao|${id}|${n}`, claim: id };
  }
  if (tipo === 'publicacao') {
    const par = li.querySelector('[data-publicacao-estudo]')?.getAttribute('data-publicacao-estudo') ?? '';
    return { tipo, chave: `publicacao|${par.split('/')[0]}`, claim: null, slug: par.split('/')[0], edicao: par.split('/')[1] };
  }
  if (tipo === 'projeto') return { tipo, chave: `projeto|${li.getAttribute('data-mudanca-id')}`, claim: null };
  return { tipo: null, chave: null, claim: null };
}
const chavesDoRegisto = new Set([
  ...chavesDoLivro,
  ...WORKS.map(w => `publicacao|${w.slug}`),
  ...MUDANCAS_DO_PROJETO.map(m => `projeto|${m.id}`),
]);
let listasMedidas = 0;
let titulosMedidos = 0;
let registosMedidos = 0;
for (const lang of ['pt', 'en']) {
  const home = le(lang === 'pt' ? '' : 'en');
  const indice = le(lang === 'pt' ? 'temas' : 'en/themes');
  for (const [nome, doc, declarado] of [['país', home, t(lang).home], ['temas', indice, t(lang).temas]]) {
    for (const [seletor, esperado] of [
      ['head title', declarado.metaTitle], ['head meta[property="og:title"]', declarado.metaTitle],
      ['head meta[name="description"]', declarado.metaDescription],
      ['head meta[property="og:description"]', declarado.metaDescription],
    ]) {
      const el = doc.querySelector(seletor);
      if ((el?.tagName === 'TITLE' ? el.textContent : el?.getAttribute('content')) !== esperado)
        erros.push(`D1 ${lang} ${nome}: ${seletor} difere da declaração.`);
    }
  }
  const leitura = home.querySelector('main [data-leitura-pais]');
  const citadas = ['divida-publica-2024','divida-publica-2025','divida-publica-2025-ue','taxa-de-desemprego-2025','precos-da-habitacao-2025','precos-da-habitacao-2025-ue'];
  if (JSON.stringify(leitura?.querySelectorAll('[data-claim]').map(n=>n.getAttribute('data-claim'))) !== JSON.stringify(citadas)) erros.push(`L2 ${lang}: a leitura não cita as seis linhas aprovadas.`);
  for (const id of [...citadas,'taxa-de-desemprego-2025-ue']) {
    const href = `${lang === 'pt' ? '/livro-razao' : '/en/ledger'}/${id}`;
    if (!leitura?.querySelector(`a.src-chip[href="${href}"]`)) erros.push(`L3 ${lang}: a leitura perdeu o recibo ${id}.`);
  }
  for (const [nome, doc, resumo] of [['país', home, true], ['temas', indice, false]]) {
    const cards = doc.querySelectorAll('main [data-cartao-medida]');
    const vistos = new Set();
    for (const c of cards) {
      const id = c.getAttribute('data-cartao-medida');
      const tema = c.closest('[data-tema]')?.getAttribute('data-tema');
      if (!DOMINIO_DAS_MEDIDAS[id]) erros.push(`T2 ${lang} ${nome}: ${id} sem tema na tabela.`);
      else if (DOMINIO_DAS_MEDIDAS[id] !== tema) erros.push(`T3 ${lang} ${nome}: ${id} no tema ${tema}, a tabela dá-lhe ${DOMINIO_DAS_MEDIDAS[id]}.`);
      if (vistos.has(id) || id === 'taxa-de-desemprego-2025') erros.push(`T4 ${lang} ${nome}: medida repetida ${id}.`);
      vistos.add(id);
    }
    if (!resumo && reunidas.some(id => !vistos.has(id))) erros.push(`T5 ${lang}: faltam medidas publicadas na página dos temas.`);
    const grupos = doc.querySelectorAll('main [data-tema]');
    const esperados = [...new Set(Object.values(DOMINIO_DAS_MEDIDAS))];
    if (grupos.length !== esperados.length || esperados.some(t => !grupos.some(g => g.getAttribute('data-tema') === t))) erros.push(`T6 ${lang} ${nome}: conjunto de temas diferente da tabela.`);
    for (const g of grupos) {
      const slug = g.getAttribute('data-tema');
      const n = g.querySelectorAll('[data-cartao-medida]').length;
      if (!n || (resumo && n > 4)) erros.push(`T7 ${lang}: fila vazia ou demasiado longa em ${slug}.`);
      if (!resumo && g.id !== slug) erros.push(`T8 ${lang}: âncora de tema em falta.`);
      if (resumo && !g.querySelector(`a[href="${caminho(lang, '/temas/', '/en/themes/')}#${slug}"]`)) erros.push(`T8 ${lang}: porta do tema em falta.`);
    }
  }
  for (const id of ['divida-publica-2025','taxa-de-desemprego-mip-2025','precos-da-habitacao-2025'])
    if (home.querySelector(`main [data-cartao-medida="${id}"]`)) erros.push(`L1 ${lang}: uma medida da leitura abre a sua fila.`);
  const recentes = WORKS.map((w,i) => {
    const e = w.editions.find(e => e.lang === lang) ?? w.editions[0];
    return { slug: w.slug, i, data: datas.find(d => d.slug === w.slug && d.lang === e.lang)?.data ?? '' };
  }).sort((a,b) => b.data.localeCompare(a.data) || a.i-b.i).slice(0,3).map(e=>e.slug);
  const rendidos = home.querySelectorAll('#trabalhos [data-estudo]').map(e => e.getAttribute('data-estudo'));
  if (JSON.stringify(recentes) !== JSON.stringify(rendidos)) erros.push(`E1 ${lang}: os três estudos não são os mais recentes.`);
  /* M2 · a mudança declarada que a primeira página rende tem de ser a declarada,
     e não se repete. A PRESENÇA de todas mudou de casa a 22.09.2026 (B1c): a
     primeira página mostra no máximo oito mudanças, e quem tem de as ter todas
     é o registo, que é o que a A3 conta. */
  for (const m of MUDANCAS_DO_PROJETO) {
    const els = home.querySelectorAll(`[data-mudanca-id="${m.id}"]`);
    if (els.length > 1) erros.push(`M2 ${lang}: a mudança ${m.id} repete-se na página do país.`);
    if (els.length === 1 && (normal(els[0]?.querySelector('[data-mudanca-campo="data"]')?.textContent) !== data(m.data) || normal(els[0]?.querySelector('[data-mudanca-campo="texto"]')?.textContent) !== m.texto[lang])) erros.push(`M2 ${lang}: a mudança ${m.id} não coincide com a declaração.`);
  }
  /* A C1 E A M3 MUDARAM DE ÂMBITO, NÃO DE FORÇA (B1c, 22.09.2026). Corriam só
     sobre a lista da primeira página; como as correções das linhas dos lugares
     saíram dela, passaram a correr sobre TODAS as listas medidas — a do país, a
     de cada lugar e o registo inteiro —, em `confereCorrecoes()`, mais abaixo.
     Nenhuma linha de correção do sítio fica fora delas. */
  const mudaramEm = home.querySelectorAll('.pais-mudou time').map(e=>e.getAttribute('datetime'));
  if (mudaramEm.some((d,i)=>i>0 && d > mudaramEm[i-1])) erros.push(`C2 ${lang}: as mudanças não estão da mais recente para a mais antiga.`);
}
/**
 * A C1 E A M3, SOBRE QUALQUER LISTA DE MUDANÇAS.
 *
 * C1 · cada linha de correção nasce de uma entrada inteira do livro, com o seu
 *      índice e a sua data, e não se repete na mesma lista. A contagem contra o
 *      livro INTEIRO é da A3, no registo: a primeira página deixou de mostrar
 *      tudo, e exigir-lhe tudo seria exigir o contrário do que o bloco decidiu.
 * M3 · cada linha traz as marcas do MESMO índice e da MESMA linha, sem campo
 *      repetido e sem campo que não seja do registo, com a data, o valor antigo
 *      e o valor novo entre elas, e os três iguais ao que o livro escreve.
 *      Eram exactamente três marcas porque a lista do país só rendia essas três;
 *      o registo rende também o motivo, a natureza e o id, e por isso a conta
 *      passa a ser «os três obrigatórios, nenhum repetido, nenhum de fora».
 */
const CAMPOS_DO_REGISTO = new Set(['date', 'old_value', 'new_value', 'reason', 'kind', 'id']);
function confereCorrecoes(lista, onde) {
  const entradas = lista.querySelectorAll('[data-correcao-entrada]');
  const chaves = entradas.map(e => `${e.getAttribute('data-correcao-entrada')}|${e.querySelector('[data-correcao-campo="date"]')?.getAttribute('data-correcao-n')}|${e.querySelector('[data-correcao-campo="date"]')?.getAttribute('datetime')}`);
  if (chaves.some(c => !correcoesEsperadas.has(c)) || new Set(chaves).size !== chaves.length)
    erros.push(`C1: ${onde}: uma linha de correção não é uma entrada do livro, ou repete-se.`);
  for (const e of entradas) {
    const id = e.getAttribute('data-correcao-entrada');
    const marcas = e.querySelectorAll('[data-correcao-n]');
    const ns = marcas.map(m => m.getAttribute('data-correcao-n'));
    const campos = marcas.map(m => m.getAttribute('data-correcao-campo'));
    const correcao = /^\d+$/.test(ns[0] ?? '') ? linha(id).corrections?.[Number(ns[0])] : null;
    const antes = e.querySelector('s[data-correcao-campo="old_value"]');
    const depois = e.querySelector('[data-correcao-campo="new_value"]');
    const quando = e.querySelector('[data-correcao-campo="date"][datetime]');
    if (marcas.length < 3 || new Set(ns).size !== 1 || !correcao ||
        campos.some(c => !CAMPOS_DO_REGISTO.has(c)) || new Set(campos).size !== campos.length ||
        !['date', 'old_value', 'new_value'].every(c => campos.includes(c)) ||
        marcas.some(m => m.getAttribute('data-correcao-claim') !== id) ||
        !antes || !depois || !quando || normal(antes.textContent) === normal(depois.textContent) ||
        normal(antes?.textContent) !== normal(correcao?.old_value) ||
        normal(depois?.textContent) !== normal(correcao?.new_value) ||
        quando?.getAttribute('datetime') !== correcao?.date || normal(quando?.textContent) !== data(correcao?.date ?? ''))
      erros.push(`M3: ${onde}: ${id} mistura correções, repete o valor ou difere da correção declarada.`);
  }
}

// Cinco entradas em cada página própria. Os documentos originais são transcrições.
let paginas = 0;
function anda(dir) {
  for (const f of fs.readdirSync(dir, {withFileTypes:true})) {
    const abs = path.join(dir,f.name);
    if (f.isDirectory()) { anda(abs); continue; }
    if (!f.name.endsWith('.html')) continue;
    const cru = fs.readFileSync(abs,'utf8');
    if (!cru.includes('class="wrap"')) continue;
    const doc = parse(cru);
    if (!doc.querySelector('footer.rodape')) continue;
    if (doc.querySelector('[data-theme]') || doc.querySelectorAll('script').some(s =>
      s.getAttribute('src') === '/js/tema.js' || /data-theme|localStorage\s*\.\s*(?:getItem|setItem)\s*\(\s*['"]tema['"]/.test(s.textContent)))
      erros.push(`N3: guião ou atributo do tema em ${path.relative(dist, abs)}.`);
    paginas++;
    const lang = doc.querySelector('html')?.getAttribute('lang') === 'en' ? 'en' : 'pt';
    const esperado = lang === 'pt' ? ['Portugal','Lugares','Temas','Estudos','Sobre'] : ['Portugal','Places','Themes','Studies','About'];
    const portas = doc.querySelectorAll('#nav-principal a');
    const destinos = lang === 'pt' ? ['/','/lugares/','/temas/','/estudos','/sobre'] : ['/en','/en/places/','/en/themes/','/en/studies','/en/about'];
    if (JSON.stringify(portas.map(a=>normal(a.textContent))) !== JSON.stringify(esperado) || portas.some((a,i)=>a.getAttribute('href') !== destinos[i]) || doc.querySelector('.nav-menu')) erros.push(`N1: menu de cinco errado em ${path.relative(dist, abs)}.`);
    if (doc.querySelectorAll('[data-rotulo-ia="rodape"] .rotulo-ia-final').length !== 1) erros.push(`N2: ponto final sem ligação inseparável em ${path.relative(dist,abs)}.`);

    /* ---------------------------------------------------------------- A4 */
    /* UM TÍTULO POR CONFIRMAR DIZ-SE, EM TODAS AS PÁGINAS ONDE SE RENDE (a
       decisão de 22.09.2026). O arquivo declara `titleUnverified` em duas
       edições inglesas, e elas rendiam-se como títulos comuns. A célula corre
       sobre cada elemento que DECLARA a edição que está a render — os artigos
       das três listas de estudos (`[data-estudo][data-estudo-edicao]`) e as
       linhas de publicação do registo — e confere o título tal como
       `TituloDeTrabalho` o rende: o texto do arquivo, a marca da língua do
       texto, e o marcador da classe `marcador-de-titulo` presente se e só se o
       arquivo o declarar por confirmar. A classe é o que distingue esta marca
       das outras que a mesma sinopse possa trazer. */
    const onde = path.relative(dist, abs);
    const daEdicao = [
      ...doc.querySelectorAll('[data-estudo][data-estudo-edicao]').map(el => [el, el.getAttribute('data-estudo-edicao')]),
      ...doc.querySelectorAll('li[data-mudanca="publicacao"]').map(el => [el, el.querySelector('[data-publicacao-estudo]')?.getAttribute('data-publicacao-estudo') ?? '']),
    ];
    for (const [el, par] of daEdicao) {
      titulosMedidos++;
      const [slug, edLang] = String(par).split('/');
      const w = WORKS.find(x => x.slug === slug);
      const ed = w?.editions.find(x => x.lang === edLang);
      const titulo = el.querySelector('[data-nonledger="titulo-de-estudo"]');
      const marcas = el.querySelectorAll('.marcador-de-titulo').length;
      if (!ed || !titulo) { erros.push(`A4: ${onde}: a edição «${par}» não rende o título do arquivo.`); continue; }
      if (normal(titulo.textContent) !== normal(ed.title) ||
          (titulo.getAttribute('lang') ?? null) !== (linguaDoTitulo(ed.title, lang) ?? null))
        erros.push(`A4: ${onde}: o título de ${par} difere do arquivo ou da língua que o texto tem.`);
      if ((marcas > 0) !== (ed.titleUnverified === true))
        erros.push(`A4: ${onde}: ${par} tem ${marcas} marcador(es) de título e o arquivo declara titleUnverified=${ed.titleUnverified === true}.`);
      if (marcas > 1) erros.push(`A4: ${onde}: ${par} repete o marcador do título.`);
    }

    /* ------------------------------------------------------- A1, A2 e A3 */
    for (const lista of doc.querySelectorAll('[data-mudou-ambito]')) {
      listasMedidas++;
      const ambito = lista.getAttribute('data-mudou-ambito');
      const itens = lista.querySelectorAll('li[data-mudanca]');
      if (itens.length !== lista.querySelectorAll('li').length)
        erros.push(`A1: ${onde}: uma linha de «O que mudou» sem classe declarada.`);
      if (itens.length > TETO) erros.push(`A2: ${onde}: ${itens.length} mudanças, e o teto é ${TETO}.`);
      for (const li of itens) {
        const { tipo, chave, claim } = chaveDaMudanca(li);
        if (!tipo || !chave || chave.includes('|null') || chave.endsWith('|undefined')) {
          erros.push(`A1: ${onde}: uma linha de «O que mudou» sem identidade legível.`);
          continue;
        }
        if (!chavesDoRegisto.has(chave))
          erros.push(`A1: ${onde}: a linha ${chave} não é do livro, do arquivo nem das mudanças declaradas.`);
        const doLugar = claim ? lugarDaLinha(claim) : null;
        /* A página do país mostra o que mudou NO PAÍS: as correções das suas
           linhas e as mudanças declaradas do projeto. Uma PUBLICAÇÃO nesta
           página fecha a construção desde 22.09.2026, pela leitura do lugar de
           direção: a notícia de um estudo é a secção «Estudos recentes», e a
           lista de todos é a página dos estudos. Continuam no registo. */
        const dentro = ambito === 'pais'
          ? (tipo === 'projeto' || (tipo === 'correcao' && doLugar === PAIS))
          : (tipo === 'correcao' && doLugar === ambito);
        if (!dentro)
          erros.push(`A1: ${onde}: a linha ${chave} é de «${doLugar ?? 'nenhum lugar'}» e a página é de «${ambito}».`);
      }
      const quando = itens.map(li => li.querySelector('time')?.getAttribute('datetime'));
      if (quando.some((d,i) => i>0 && d > quando[i-1])) erros.push(`A2: ${onde}: as mudanças não estão da mais recente para a mais antiga.`);
      confereCorrecoes(lista, `${onde} (${ambito})`);
    }
    for (const registo of doc.querySelectorAll('[data-mudou-registo]')) {
      registosMedidos++;
      const itens = registo.querySelectorAll('li[data-mudanca]');
      const chaves = itens.map(li => chaveDaMudanca(li).chave);
      const vistas = new Set(chaves);
      const aMais = [...vistas].filter(c => !chavesDoRegisto.has(c));
      const aMenos = [...chavesDoRegisto].filter(c => !vistas.has(c));
      if (vistas.size !== chaves.length) erros.push(`A3: ${onde}: o registo repete uma mudança.`);
      if (aMais.length || aMenos.length)
        erros.push(`A3: ${onde}: o registo tem ${chaves.length} mudanças e o livro inteiro tem ${chavesDoRegisto.size}` +
          `${aMais.length ? `; a mais: ${aMais.slice(0,3).join(', ')}` : ''}` +
          `${aMenos.length ? `; a menos: ${aMenos.slice(0,3).join(', ')}` : ''}.`);
      for (const m of MUDANCAS_DO_PROJETO) {
        const els = registo.querySelectorAll(`[data-mudanca-id="${m.id}"]`);
        if (els.length !== 1 || normal(els[0]?.querySelector('[data-mudanca-campo="data"]')?.textContent) !== data(m.data) || normal(els[0]?.querySelector('[data-mudanca-campo="texto"]')?.textContent) !== m.texto[lang])
          erros.push(`A3: ${onde}: a mudança declarada ${m.id} falta no registo ou não coincide com a declaração.`);
      }
      /* O LUGAR DE CADA LINHA, E A PORTA DELE, linha a linha (a passagem de
         correção de 22.09.2026). A A3 comparava as identidades e não olhava
         para o que o leitor lê: um registo podia escrever «Portugal» por cima
         de uma correção de Évora, ou mandar a porta para outra página, e
         passava. O nome e a porta compõem-se aqui, da Carta e das rotas, e não
         da vista. */
      for (const li of itens) {
        const { tipo, claim, slug, edicao: edLang } = chaveDaMudanca(li);
        const chave = tipo === 'correcao' ? claim && lugarDaLinha(claim)
          : tipo === 'publicacao' ? (WORKS.find(w => w.slug === slug)?.subject ?? PAIS)
          : PAIS;
        const porta = li.querySelector('.registo-lugar');
        const nome = chave && nomeDoLugar(chave, lang);
        const rota = chave && rotaDoLugar(chave, lang);
        if (!chave || !nome || !rota) { erros.push(`A3: ${onde}: uma linha do registo sem lugar que se possa compor.`); continue; }
        if (!porta || normal(porta.textContent) !== nome || porta.getAttribute('href') !== rota)
          erros.push(`A3: ${onde}: uma linha de «${chave}» escreve «${normal(porta?.textContent)}» com a porta «${porta?.getAttribute('href')}»; esperava-se «${nome}» e «${rota}».`);
      }
      const quando = itens.map(li => li.querySelector('time')?.getAttribute('datetime'));
      if (quando.some((d,i) => i>0 && d > quando[i-1])) erros.push(`A3: ${onde}: o registo não está da mais recente para a mais antiga.`);
      confereCorrecoes(registo, `${onde} (registo)`);
    }
  }
}
anda(dist);
if (!paginas) erros.push('N1: nenhuma página própria medida.');
/* Os dois positivos conhecidos do bloco B1c: uma régua que não encontre nem uma
   lista nem um registo mediu zero, e zero nunca é verde. */
if (!listasMedidas) erros.push('A1: nenhuma lista de «O que mudou» medida.');
if (!titulosMedidos) erros.push('A4: nenhum título de edição medido.');
if (registosMedidos !== 2) erros.push(`A3: ${registosMedidos} registos medidos, e as duas edições têm um cada.`);
console.log(`B1 país: ${reunidas.length} medidas, ${new Set(Object.values(DOMINIO_DAS_MEDIDAS)).size} temas, ${paginas} menus, ${MUDANCAS_DO_PROJETO.length} mudanças declaradas, ${listasMedidas} listas com teto ${TETO}, ${registosMedidos} registos de ${chavesDoRegisto.size} mudanças, ${titulosMedidos} títulos de edição.`);
if (erros.length) { console.error(erros.join('\n')); process.exitCode = 1; }
else console.log('B1 país: todas as conferências a 0.');
