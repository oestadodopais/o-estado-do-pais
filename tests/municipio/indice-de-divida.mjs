#!/usr/bin/env node
/**
 * =============================================================================
 * ID · O CARTÃO DO ÍNDICE DE DÍVIDA DIZ DE QUE É A PERCENTAGEM E QUAL É O TETO
 * (passagem P4-c do bloco P4, 02.10.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. O diretor leu a página de Évora a 02.10.2026 à noite: o cartão do índice de dívida dizia
 * «105,5 % (limite legal = 150)», que se lê «105,5 % de 150». O valor é a dívida em percentagem da média da receita
 * corrente líquida dos três anos anteriores (a derivação de cada linha divide a dívida pelo limite e multiplica por
 * 150, e o limite é 1,5 vezes essa média). O cartão passou a dizer na unidade de que é a percentagem, «% da receita de
 * três anos», e na linha do estado o teto, «dentro do limite legal, que é 150 %», com o 150 lido da linha do limite.
 * Nenhum valor mudou, e o livro-razão também não: a unidade da linha fica no recibo, como o motor a escreve.
 *
 * O QUE CONFERE, em todas as páginas de concelho construídas, nas duas edições, sobre o `dist/`, e com as suas contas
 * (as linhas lidas do livro-razão e a declaração da medida, e não a vista que compôs o cartão):
 *
 *   ID1 · cada página tem um cartão do índice de dívida, e um só;
 *   ID2 · com valor, a linha do valor diz a unidade da casa que a medida declara, com a marca da sua linha e da sua
 *         medida, e o cartão não escreve a unidade antiga da linha em lado nenhum;
 *   ID3 · com valor, a linha do estado diz «dentro do limite legal, que é» ou «fora do limite legal, que é», pela
 *         conta do valor da linha contra o valor da linha do teto, seguida do teto lido da sua linha, com o valor e a
 *         unidade dessa linha, num item da régua sem marca própria cuja porta é a do cartão;
 *   ID4 · sem valor (a marca que a Direção-Geral imprime), o cartão não tem unidade nem linha do estado;
 *   ID5 · a dobra «O que é este número» é a nota declarada da medida, sem mudança;
 *   ID6 · o cartão «Câmaras com a dívida acima do limite legal», na página «Lugares», diz as mesmas palavras,
 *         «dentro do limite legal, que é», e não as de antes, «dentro do limite legal (»;
 *   ID7 · o mapa da dívida em «Lugares» diz, na legenda e no cabeçalho da tabela, a unidade da casa e o teto
 *         (passagem P4-d, 02.10.2026): «% da receita média de três anos · o limite legal é 150 %», com o 150 lido da
 *         linha do teto, e não a unidade antiga da linha.
 *
 * A MÉDIA NA UNIDADE (passagem P4-d): «% da receita de três anos» lia-se como a soma dos três anos; a unidade passou a
 * «% da receita média de três anos» / «% of the three-year average revenue», e há uma planta com a unidade de antes.
 *
 * AS PLANTAS (`--prova`) estragam cópias em memória de uma página e têm de morder: a unidade antiga de volta, o teto
 * escrito à mão, as palavras do estado de antes, o estado trocado, a dobra mudada, e as palavras de antes no cartão
 * das câmaras. Uma planta que não morda fecha a régua.
 *
 *   node tests/municipio/indice-de-divida.mjs [--prova] [--json <ficheiro>]      (OEDP_DIST mede outra construção)
 *
 * Sai 0 com tudo a cumprir e, com `--prova`, as plantas a morder; 1 se não.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../src/data/concelhos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
const LINHAS = loadClaims();
const MEDIDA = MEDIDAS_DO_CONCELHO.find((m) => m.chave === 'indice');
if (!MEDIDA?.unidadeDaCasa || !MEDIDA?.tecto || !MEDIDA?.nota) {
  console.error('ID: a medida do índice de dívida não declara a unidade da casa, o teto ou a nota.');
  process.exit(1);
}
const TETO = LINHAS.get(MEDIDA.tecto);
if (!TETO) {
  console.error(`ID: a linha do teto «${MEDIDA.tecto}» não está no livro-razão.`);
  process.exit(1);
}
/* As palavras esperadas, escritas aqui pela régua e não lidas da vista: o que o diretor e o lugar de direção
   aprovaram, nas duas edições. */
const PALAVRAS = {
  pt: { dentro: 'dentro do limite legal, que é', fora: 'fora do limite legal, que é', antigaUnidade: '% (limite legal = 150)', semAMedia: '% da receita de três anos', camaras: 'dentro do limite legal, que é', camarasAntes: 'dentro do limite legal (', oLimite: 'o limite legal é' },
  en: { dentro: 'within the legal limit, which is', fora: 'outside the legal limit, which is', antigaUnidade: '% (legal cap = 150)', semAMedia: '% of three-year revenue', camaras: 'within the legal limit, which is', camarasAntes: 'within the legal limit (', oLimite: 'the legal limit is' },
};
const ROTAS = { pt: 'municipios', en: path.join('en', 'municipalities') };
const LUGARES = { pt: path.join('lugares', 'index.html'), en: path.join('en', 'places', 'index.html') };

const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const numero = (v) => {
  const s = String(v ?? '').replace(/[    ]/g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
const primeiraFrase = (partes) => {
  const texto = (partes ?? []).filter((p) => typeof p === 'string').join('');
  const fim = texto.match(/[.!?](?=\s|$)/);
  return normal(fim ? texto.slice(0, fim.index + 1) : texto);
};

/**
 * As falhas do cartão do índice de dívida de uma página.
 * @param {import('node-html-parser').HTMLElement} raiz
 * @param {'pt'|'en'} lang
 * @param {string} onde
 * @param {Record<string, number>} contas
 */
function conferePagina(raiz, lang, onde, contas) {
  const f = [];
  const cartoes = raiz.querySelectorAll('[data-cartao-medida][data-medida-chave="indice"]');
  if (cartoes.length !== 1) return [`ID1 · ${onde}: ${cartoes.length} cartões do índice de dívida, e é um.`];
  const cartao = cartoes[0];
  const id = cartao.getAttribute('data-cartao-medida');
  const linha = LINHAS.get(id);
  if (!linha) return [`ID1 · ${onde}: o cartão é da linha «${id}», que não está no livro-razão.`];
  const P = PALAVRAS[lang];
  if (normal(cartao.text).includes(P.antigaUnidade)) f.push(`ID2 · ${onde}: o cartão escreve a unidade antiga, «${P.antigaUnidade}».`);
  const valor = numero(linha.value);
  const unidades = cartao.querySelectorAll('.cartao-medida-valor .cartao-medida-unidade');
  const itens = cartao.querySelectorAll('[data-regua="limite"]');
  if (valor === null) {
    contas.sem_valor++;
    if (unidades.length || itens.length) f.push(`ID4 · ${onde}: a linha «${id}» não tem valor numérico («${linha.value}»), e o cartão escreve unidade ou estado.`);
  } else {
    contas.com_valor++;
    /* ID2 · a unidade da casa. */
    const u = unidades[0];
    if (unidades.length !== 1 || u.getAttribute('data-unidade-da-casa') !== id || u.getAttribute('data-unidade-da-medida') !== 'indice') {
      f.push(`ID2 · ${onde}: a linha do valor não tem uma unidade da casa da linha «${id}» e da medida do índice.`);
    } else if (normal(u.text) !== MEDIDA.unidadeDaCasa[lang]) {
      f.push(`ID2 · ${onde}: a unidade diz «${normal(u.text)}» e a medida declara «${MEDIDA.unidadeDaCasa[lang]}».`);
    }
    /* ID3 · a linha do estado com o teto. */
    const teto = numero(TETO.value);
    const esperado = valor <= teto ? 'dentro' : 'fora';
    contas[esperado]++;
    if (itens.length !== 1) {
      f.push(`ID3 · ${onde}: ${itens.length} itens do teto na linha do estado, e é um.`);
    } else {
      const item = itens[0];
      if (item.getAttribute('data-selo-em') !== id) f.push(`ID3 · ${onde}: o item do teto não diz que a sua porta é a do cartão («${item.getAttribute('data-selo-em')}»).`);
      const voz = item.querySelectorAll('[data-voz]');
      if (voz.length !== 1 || normal(voz[0].text) !== P[esperado]) {
        f.push(`ID3 · ${onde}: a linha do estado diz «${voz.map((v) => normal(v.text)).join(' | ')}», e pela conta (${linha.value} contra ${TETO.value}) é «${P[esperado]}».`);
      }
      /* O valor é o `data-claim` da linha do teto, e a unidade é o sufixo que o <Claim/> escreve ao lado dele, dentro do
         mesmo invólucro: os dois têm de ser os campos da linha do teto. */
      const valores = item.querySelectorAll('[data-claim]');
      const sufixo = valores.length === 1 ? valores[0].parentNode?.querySelector('.claim-sufixo') : null;
      const lido = valores.length === 1 ? `${normal(valores[0].text)} ${normal(sufixo?.text)}` : null;
      const textoDoTeto = `${TETO.value} ${TETO.unit}`;
      if (valores.length !== 1 || valores[0].getAttribute('data-claim') !== TETO.id || lido !== textoDoTeto) {
        f.push(`ID3 · ${onde}: o teto não é a linha «${TETO.id}» com «${textoDoTeto}» (lido: ${valores.map((v) => `${v.getAttribute('data-claim')} «${normal(v.text)}»`).join(', ') || 'nada'}${lido ? `, com a unidade «${lido}»` : ''}).`);
      }
      if (item.querySelectorAll('.src-chip').length) f.push(`ID3 · ${onde}: o item do teto tem marca própria, e a porta é a do cartão.`);
    }
  }
  /* ID5 · a dobra. */
  const dobra = cartao.querySelector('[data-cartao-dobra] .cartao-medida-frase');
  if (!dobra || normal(dobra.text) !== primeiraFrase(MEDIDA.nota[lang])) f.push(`ID5 · ${onde}: a dobra diz «${normal(dobra?.text).slice(0, 60)}…» e a nota declarada é «${primeiraFrase(MEDIDA.nota[lang]).slice(0, 60)}…».`);
  return f;
}

/** As falhas do cartão das câmaras de uma página «Lugares». */
function confereCamaras(raiz, lang, onde) {
  const c = raiz.querySelector('[data-cartao-camaras] [data-camaras-regua]');
  if (!c) return [`ID6 · ${onde}: não há régua do cartão das câmaras.`];
  const texto = normal(c.text);
  const f = [];
  if (!texto.includes(PALAVRAS[lang].camaras)) f.push(`ID6 · ${onde}: a régua do cartão das câmaras não diz «${PALAVRAS[lang].camaras}» («${texto.slice(0, 90)}»).`);
  if (texto.includes(PALAVRAS[lang].camarasAntes)) f.push(`ID6 · ${onde}: a régua do cartão das câmaras ainda diz «${PALAVRAS[lang].camarasAntes}».`);
  return f;
}

/** As falhas da legenda e do cabeçalho da tabela do mapa da dívida de uma página «Lugares» (ID7, passagem P4-d). */
function confereMapa(raiz, lang, onde) {
  const mapa = raiz.querySelector('[data-instrumento="mapa-por-concelho-indice"]');
  if (!mapa) return [`ID7 · ${onde}: não há mapa da dívida.`];
  const f = [];
  const P = PALAVRAS[lang];
  for (const [nome, seletor] of [['a legenda', '.forma-mapa-unidade'], ['o cabeçalho da tabela', 'thead th:last-child']]) {
    const sitio = mapa.querySelector(seletor);
    if (!sitio) { f.push(`ID7 · ${onde}: o mapa não tem ${nome}.`); continue; }
    const texto = normal(sitio.text);
    if (texto.includes(P.antigaUnidade)) f.push(`ID7 · ${onde}: ${nome} escreve a unidade antiga, «${P.antigaUnidade}».`);
    const casa = sitio.querySelectorAll('[data-unidade-da-casa-do-mapa="indice"]');
    if (casa.length !== 1 || normal(casa[0].text) !== MEDIDA.unidadeDaCasa[lang]) f.push(`ID7 · ${onde}: ${nome} não diz a unidade da casa, «${MEDIDA.unidadeDaCasa[lang]}» (diz «${texto.slice(0, 80)}»).`);
    const voz = sitio.querySelectorAll('[data-voz]');
    if (voz.length !== 1 || normal(voz[0].text) !== P.oLimite) f.push(`ID7 · ${onde}: ${nome} não diz «${P.oLimite}» antes do teto.`);
    const valores = sitio.querySelectorAll('[data-claim]');
    const sufixo = valores.length === 1 ? valores[0].parentNode?.querySelector('.claim-sufixo') : null;
    const lido = valores.length === 1 ? `${normal(valores[0].text)} ${normal(sufixo?.text)}` : null;
    if (valores.length !== 1 || valores[0].getAttribute('data-claim') !== TETO.id || lido !== `${TETO.value} ${TETO.unit}`) {
      f.push(`ID7 · ${onde}: o teto ${nome === 'a legenda' ? 'da legenda' : 'do cabeçalho'} não é a linha «${TETO.id}» com «${TETO.value} ${TETO.unit}»${lido ? ` (lido «${lido}»)` : ''}.`);
    }
  }
  return f;
}

/* ------------------------------------------------------------------------------------------------- a corrida */
const falhas = [];
const contas = { paginas: 0, com_valor: 0, sem_valor: 0, dentro: 0, fora: 0 };
/** @type {Record<'pt'|'en', string[]>} */
const paginas = { pt: [], en: [] };
for (const lang of /** @type {const} */ (['pt', 'en'])) {
  const pasta = path.join(DIST, ROTAS[lang]);
  for (const slug of fs.readdirSync(pasta).sort()) {
    const f = path.join(pasta, slug, 'index.html');
    if (!fs.existsSync(f)) continue;
    paginas[lang].push(f);
    contas.paginas++;
    falhas.push(...conferePagina(parse(fs.readFileSync(f, 'utf8')), lang, `${ROTAS[lang]}/${slug}`, contas));
  }
  const l = path.join(DIST, LUGARES[lang]);
  const raizDosLugares = parse(fs.readFileSync(l, 'utf8'));
  falhas.push(...confereCamaras(raizDosLugares, lang, LUGARES[lang]));
  falhas.push(...confereMapa(raizDosLugares, lang, LUGARES[lang]));
  contas.mapas = (contas.mapas ?? 0) + 1;
}
if (paginas.pt.length !== paginas.en.length || paginas.pt.length < 300) {
  falhas.push(`ID1 · as páginas de concelho são ${paginas.pt.length} em português e ${paginas.en.length} em inglês: a régua não viu os 308 nas duas edições.`);
}

const plantas = [];
if (process.argv.includes('--prova')) {
  /* A página das plantas é a de Évora, nas duas edições: dentro do limite, com valor, e a página que o diretor leu. */
  const evora = { pt: path.join(DIST, 'municipios', 'evora', 'index.html'), en: path.join(DIST, 'en', 'municipalities', 'evora', 'index.html') };
  const PLANTAS = [
    ['a unidade antiga de volta', 'pt', (r) => { const u = r.querySelector('[data-medida-chave="indice"] [data-unidade-da-casa]'); u.set_content(PALAVRAS.pt.antigaUnidade); }, /ID2 · .*unidade antiga|ID2 · .*a unidade diz/],
    /* P4-d: a unidade da passagem P4-c, sem a média, lida como a soma dos três anos. */
    ['a unidade sem a média', 'en', (r) => { const u = r.querySelector('[data-medida-chave="indice"] [data-unidade-da-casa]'); u.set_content(PALAVRAS.en.semAMedia); }, /ID2 · .*a unidade diz «% of three-year revenue»/],
    ['o teto escrito à mão', 'en', (r) => { const v = r.querySelector('[data-regua="limite"] [data-claim]'); v.replaceWith(`${TETO.value} ${TETO.unit}`); }, /ID3 · .*o teto não é a linha/],
    ['as palavras do estado de antes', 'pt', (r) => { r.querySelector('[data-regua="limite"] [data-voz]').set_content('dentro do limite legal'); }, /ID3 · .*a linha do estado diz «dentro do limite legal»/],
    ['o estado trocado', 'en', (r) => { r.querySelector('[data-regua="limite"] [data-voz]').set_content(PALAVRAS.en.fora); }, /ID3 · .*a linha do estado diz «outside the legal limit, which is»/],
    ['a dobra mudada', 'pt', (r) => { r.querySelector('[data-medida-chave="indice"] [data-cartao-dobra] .cartao-medida-frase').set_content('A dívida em percentagem do limite legal.'); }, /ID5 · /],
  ];
  for (const [nome, lang, estraga, mordida] of PLANTAS) {
    const r = parse(fs.readFileSync(evora[lang], 'utf8'));
    estraga(r);
    const queixas = conferePagina(r, lang, `planta: ${nome}`, { paginas: 0, com_valor: 0, sem_valor: 0, dentro: 0, fora: 0 });
    const mordeu = queixas.some((q) => mordida.test(q));
    plantas.push({ nome, mordeu, queixa: queixas.find((q) => mordida.test(q)) ?? queixas[0] ?? null });
    if (!mordeu) falhas.push(`A planta não mordeu: ${nome}${queixas.length ? ` (queixou-se de outra coisa: ${queixas[0]})` : ''}`);
  }
  /* As plantas do mapa da dívida (ID7, passagem P4-d): a legenda na forma antiga, e o teto do cabeçalho escrito à mão. */
  for (const [nome, lang, estraga, mordida] of [
    ['a legenda do mapa da dívida na forma antiga', 'pt', (r) => r.querySelector('[data-instrumento="mapa-por-concelho-indice"] .forma-mapa-unidade').set_content(`<span data-linha-campo="unit">${PALAVRAS.pt.antigaUnidade}</span>`), /ID7 · .*a legenda escreve a unidade antiga/],
    ['o teto do cabeçalho da tabela escrito à mão', 'en', (r) => { const v = r.querySelector('[data-instrumento="mapa-por-concelho-indice"] thead [data-claim]'); v.replaceWith(`${TETO.value}`); }, /ID7 · .*o teto do cabeçalho não é a linha/],
  ]) {
    const r = parse(fs.readFileSync(path.join(DIST, LUGARES[lang]), 'utf8'));
    estraga(r);
    const queixas = confereMapa(r, lang, `planta: ${nome}`);
    const mordeu = queixas.some((q) => mordida.test(q));
    plantas.push({ nome, mordeu, queixa: queixas.find((q) => mordida.test(q)) ?? queixas[0] ?? null });
    if (!mordeu) falhas.push(`A planta não mordeu: ${nome}${queixas.length ? ` (queixou-se de outra coisa: ${queixas[0]})` : ''}`);
  }
  /* A planta do cartão das câmaras, com as palavras de antes. */
  {
    const r = parse(fs.readFileSync(path.join(DIST, LUGARES.pt), 'utf8'));
    const c = r.querySelector('[data-cartao-camaras] [data-camaras-regua]');
    c.set_content(c.innerHTML.replace(`${PALAVRAS.pt.camaras} `, PALAVRAS.pt.camarasAntes));
    const queixas = confereCamaras(r, 'pt', 'planta: as palavras de antes no cartão das câmaras');
    const mordeu = queixas.some((q) => /ID6 · /.test(q));
    plantas.push({ nome: 'as palavras de antes no cartão das câmaras', mordeu, queixa: queixas[0] ?? null });
    if (!mordeu) falhas.push('A planta não mordeu: as palavras de antes no cartão das câmaras');
  }
}

const relatorio = { contas, falhas, plantas, teto: { linha: TETO.id, valor: TETO.value, unidade: TETO.unit }, unidade_da_casa: MEDIDA.unidadeDaCasa };
const j = process.argv.indexOf('--json');
if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(relatorio, null, 2) + '\n');
console.log(`índice de dívida · ${contas.paginas} página(s) de concelho, ${contas.com_valor} com valor (${contas.dentro} dentro e ${contas.fora} fora do limite), ${contas.sem_valor} sem valor · ${contas.mapas ?? 0} mapa(s) da dívida em «Lugares»` +
  (plantas.length ? ` · ${plantas.length} planta(s), ${plantas.filter((p) => p.mordeu).length} a morder` : ''));
for (const p of plantas) console.log(`  ${p.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome}`);
if (falhas.length) {
  for (const x of falhas.slice(0, 40)) console.error(x);
  if (falhas.length > 40) console.error(`… e mais ${falhas.length - 40}.`);
  process.exitCode = 1;
} else console.log('índice de dívida · todas as células a 0.');
