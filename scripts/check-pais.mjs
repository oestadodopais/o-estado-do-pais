#!/usr/bin/env node
/** B1, peça 3. Leitor próprio do HTML, da tabela declarada e do livro.
 * Não importa a seleção nem as funções da página que está a conferir. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { DOMINIOS, DOMINIO_DAS_MEDIDAS } from '../src/data/dominios.mjs';
import { MUDANCAS_DO_PROJETO } from '../src/data/mudancas-do-projeto.mjs';
import { WORKS } from '../src/data/studies.mjs';
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
const mudancasVistas = new Set();
for (const m of MUDANCAS_DO_PROJETO) {
  if (!m.decisao || !capitulos.has(m.decisao)) erros.push(`M1: ${m.id} sem secção existente de DECISIONS.md.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.data) || !m.texto?.pt || !m.texto?.en || mudancasVistas.has(m.id)) erros.push(`M1: entrada incompleta ou repetida ${m.id}.`);
  mudancasVistas.add(m.id);
}
const datas = JSON.parse(fs.readFileSync('src/data/datas-de-publicacao.json', 'utf8')).edicoes;
const correcoesEsperadas = new Set();
for (const f of fs.readdirSync('ledger/claims').filter(f=>f.endsWith('.yml'))) {
  const c = linha(f.slice(0,-4));
  for (const e of c.corrections ?? []) if (['correcao','atualizacao'].includes(e.kind)) correcoesEsperadas.add(`${c.id}|${e.date}`);
}
for (const lang of ['pt', 'en']) {
  const home = le(lang === 'pt' ? '' : 'en');
  const indice = le(lang === 'pt' ? 'temas' : 'en/themes');
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
  for (const m of MUDANCAS_DO_PROJETO) {
    const els = home.querySelectorAll(`[data-mudanca-id="${m.id}"]`);
    if (els.length !== 1 || normal(els[0]?.querySelector('[data-mudanca-campo="data"]')?.textContent) !== data(m.data) || normal(els[0]?.querySelector('[data-mudanca-campo="texto"]')?.textContent) !== m.texto[lang]) erros.push(`M2 ${lang}: a mudança ${m.id} não coincide com a declaração.`);
  }
  const correcoes = home.querySelectorAll('.pais-mudou [data-correcao-entrada]').map(e=>`${e.getAttribute('data-correcao-entrada')}|${e.querySelector('time')?.getAttribute('datetime')}`);
  if (correcoes.length !== correcoesEsperadas.size || correcoes.some(c=>!correcoesEsperadas.has(c)) || new Set(correcoes).size !== correcoes.length) erros.push(`C1 ${lang}: falta uma correção por linha e dia, ou está repetida.`);
  const mudaramEm = home.querySelectorAll('.pais-mudou time').map(e=>e.getAttribute('datetime'));
  if (mudaramEm.some((d,i)=>i>0 && d > mudaramEm[i-1])) erros.push(`C2 ${lang}: as mudanças não estão da mais recente para a mais antiga.`);
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
    paginas++;
    const lang = doc.querySelector('html')?.getAttribute('lang') === 'en' ? 'en' : 'pt';
    const esperado = lang === 'pt' ? ['Portugal','Lugares','Temas','Estudos','Sobre'] : ['Portugal','Places','Themes','Studies','About'];
    const portas = doc.querySelectorAll('#nav-principal a');
    const destinos = lang === 'pt' ? ['/','/lugares','/temas','/estudos','/sobre'] : ['/en','/en/places','/en/themes','/en/studies','/en/about'];
    if (JSON.stringify(portas.map(a=>normal(a.textContent))) !== JSON.stringify(esperado) || portas.some((a,i)=>a.getAttribute('href') !== destinos[i]) || doc.querySelector('.nav-menu')) erros.push(`N1: menu de cinco errado em ${path.relative(dist, abs)}.`);
    if (doc.querySelectorAll('[data-rotulo-ia="rodape"] .rotulo-ia-final').length !== 1) erros.push(`N2: ponto final sem ligação inseparável em ${path.relative(dist,abs)}.`);
  }
}
anda(dist);
if (!paginas) erros.push('N1: nenhuma página própria medida.');
console.log(`B1 país: ${reunidas.length} medidas, ${new Set(Object.values(DOMINIO_DAS_MEDIDAS)).size} temas, ${paginas} menus, ${MUDANCAS_DO_PROJETO.length} mudanças declaradas.`);
if (erros.length) { console.error(erros.join('\n')); process.exitCode = 1; }
else console.log('B1 país: todas as conferências a 0.');
