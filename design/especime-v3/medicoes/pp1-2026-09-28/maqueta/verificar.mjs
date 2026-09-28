/* Verificação da maqueta da primeira página nova (v1), 28.09.2026.
 *
 * Confere a página tal como o Chromium a desenha a partir do disco (index.html desta pasta):
 *  1. a lista abaixo é a do pedido: cada identificador e cada valor estão escritos no PEDIDO.md,
 *     e o PEDIDO.md não nomeia nenhuma linha do livro-razão que falte aqui; e cada palavra fixa que a
 *     página tem de ter está escrita no PEDIDO.md (só um título de painel pode ganhar a maiúscula inicial);
 *  2. cada valor bate com a linha selada do livro-razão (ledger/claims/<id>.yml na worktree c1-2026-09-28),
 *     e o 60 do valor de referência bate com src/data/enquadramento/referencias.json;
 *  3. cada número da página está num elemento com o data-linha certo, que mostra só o número,
 *     e as 27 linhas aparecem todas;
 *  4. não há outros números além dos anos, do 30 de «até 30 de outubro», do 60 do valor de referência
 *     (com data-referencia) e dos que fazem parte das palavras fixas do pedido
 *     («mais de 40 % do rendimento», «dos 20 aos 64 anos», «dos 20 % de cima», «dos 20 % de baixo»),
 *     cada um uma só vez e no seu sítio; nem nos atributos que se leem (aria-label, title, alt...),
 *     nem no conteúdo gerado pelas folhas de estilo;
 *  5. as palavras fixas do pedido estão na página, e não há travessões;
 *  6. o desenho, a 390 e a 1 280 px: cada barra mede o seu número na escala do seu gráfico, as barras de
 *     um gráfico partem da mesma origem, os dois painéis da casa partilham a escala, a linha de 60 % está
 *     nos 60 da escala das colunas e só atravessa o painel de Portugal;
 *  7. a cor: só as fichas do sítio (papel, tinta, três cinzentos), e o âmbar só na linha de referência,
 *     no tema claro e no escuro;
 *  8. as plantas: catorze estragos plantados numa cópia (planta.html, apagada no fim), e cada um tem de
 *     produzir a falha exata que lhe corresponde. Uma conferência que não apanha a sua planta não conta.
 *
 * Uso: node verificar.mjs      Sai com 0 só se tudo passar e as catorze plantas forem apanhadas.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WORKTREE = path.join(process.env.HOME, 'Instruments/OEstadoDoPais/.claude/worktrees/c1-2026-09-28');
const { chromium } = await import(pathToFileURL(path.join(WORKTREE, 'node_modules/playwright/index.mjs')).href);
const pasta = path.dirname(fileURLToPath(import.meta.url));

// ── a lista do pedido: identificador da linha → valor, por bloco ──────────────────────────
const LISTA = {
  // 1 · os preços
  'ipc-combustiveis-variacao-homologa': '23,78',
  'ipc-rendas-variacao-homologa': '5,22',
  'ipc-alimentacao-variacao-homologa': '2,14',
  'ipc-energia-em-casa-variacao-homologa': '1,36',
  'ipc-variacao-homologa': '3,30',
  'ihpc-variacao-homologa': '3,6',
  'ihpc-variacao-homologa-ue': '3,2',
  // 2 · a casa
  'sobrecarga-do-custo-da-habitacao-2025': '6,3',
  'sobrecarga-do-custo-da-habitacao-2025-ue': '7,7',
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025': '27,2',
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue': '18,6',
  'ipc-sem-habitacao-variacao-media-12-meses': '2,56',
  // 3 · o trabalho e o salário
  'taxa-de-emprego-2025': '79,6',
  'taxa-de-emprego-2025-ue': '76,1',
  'taxa-de-desemprego-2025': '6',
  'taxa-de-desemprego-2025-ue': '6,0',
  'desemprego-de-longa-duracao-2025': '2,2',
  'desemprego-de-longa-duracao-2025-ue': '1,9',
  'remuneracao-bruta-mensal-media-periodo-anterior': '1 746',
  'remuneracao-bruta-mensal-media': '1 835',
  // 4 · as contas do Estado
  'divida-publica-2024-notificacao-ine-2026-09': '93,0',
  'divida-publica-2025-notificacao-ine-2026-09': '89,2',
  'divida-publica-2025-ue': '81,7',
  // 5 · pobreza e desigualdade
  'risco-de-pobreza-ou-exclusao-2025': '18,6',
  'risco-de-pobreza-ou-exclusao-2025-ue': '20,9',
  'racio-s80-s20-2025': '4,86',
  'racio-s80-s20-2025-ue': '4,62',
};
// o valor de referência publicado que a linha de 60 % desenha
const REFERENCIA = { id: 'divida-publica-2025', valor: '60' };
// números que fazem parte das palavras fixas do pedido: cada um tem de estar nesta frase, uma só vez
const FIXAS = [
  { frase: 'mais de 40 % do rendimento', numero: '40' },
  { frase: 'dos 20 aos 64 anos', numero: '20' },
  { frase: 'dos 20 aos 64 anos', numero: '64' },
  { frase: 'dos 20 % de cima', numero: '20' },
  { frase: 'dos 20 % de baixo', numero: '20' },
  { frase: 'até 30 de outubro', numero: '30' },
];
// as palavras fixas do pedido (espaços normalizados); os títulos dos painéis do bloco 3 com maiúscula inicial
const PALAVRAS = [
  'Os preços: o que está a encarecer mais',
  'Em agosto, os combustíveis estavam 23,78 % mais caros do que um ano antes, muito acima dos preços no seu conjunto, que subiram 3,30 %.',
  'combustíveis e lubrificantes', 'rendas', 'alimentos', 'energia em casa', 'os preços no seu conjunto',
  'Na medida que compara os países da União: Portugal 3,6 %, a União 3,2 %.',
  'Um grupo que sobe muito não é o que mais pesa no total.',
  'INE e Eurostat, agosto de 2026',
  'A casa: a média engana quem arrenda',
  'No conjunto do país, a casa pesa menos do que na União. Para quem arrenda a preço de mercado, pesa muito mais.',
  'Todas as famílias', 'Quem arrenda a preço de mercado',
  '% de pessoas cuja casa custa mais de 40 % do rendimento, 2025',
  'As rendas em 2027. A referência para a atualização das rendas antigas é a média de doze meses dos preços sem a habitação, que ficou em 2,56 % em agosto. O valor oficial sai no Diário da República até 30 de outubro.',
  'O trabalho e o salário',
  'Trabalha-se mais do que na média da União, e o desemprego é o mesmo, mas quem fica sem trabalho fica mais tempo.',
  'Emprego dos 20 aos 64 anos', 'Desemprego', 'Desemprego de longa duração',
  'A remuneração média antes de descontos passou de 1 746 para 1 835 euros por mês (o segundo trimestre de 2025 e o de 2026, este provisório). Se compra mais, ainda não se sabe: os preços que temos são de agosto, não do trimestre.',
  'As contas do Estado',
  'A dívida pública desceu, mas continua acima da média da União e do valor de referência europeu.',
  'Portugal, notificação do INE de setembro', 'A União, edição do Eurostat',
  'o valor de referência europeu, 60 % do PIB', '% do PIB',
  'Pobreza e desigualdade não são a mesma coisa',
  'Há menos pessoas em risco de pobreza do que na média da União, mas a distância entre os rendimentos de cima e de baixo é maior.',
  'Em risco de pobreza ou exclusão, % das pessoas',
  'Quantas vezes o rendimento dos 20 % de cima é o dos 20 % de baixo',
  'O meu dinheiro', 'salários, preços, pensões, apoios',
  'A minha casa', 'rendas, preços, o peso da casa',
  'A minha saúde', 'o acesso aos cuidados',
  'A minha terra', 'o teu concelho',
  'O Estado', 'a dívida, o défice, onde vai o dinheiro',
  'Procura o teu concelho',
  'Explorar os temas, os estudos e os dados',
];

const norm = (t) => t.replace(/[    ]/g, ' ').replace(/\s+/g, ' ').trim();

// ── a conferência que corre dentro da página ─────────────────────────────────────────────
function conferirNaPagina({ lista, referencia, fixas, palavras, tokens }) {
  const falhas = [];
  const norm = (t) => t.replace(/[    ]/g, ' ').replace(/\s+/g, ' ').trim();
  const RE = /\d+(?:[    ]\d{3})*(?:,\d+)?/g;
  const vistos = {};
  const anos = [];
  const fixasVistas = fixas.map(() => 0);
  let referenciaVista = 0;
  const fora = (n) => n.parentElement && n.parentElement.closest('script,style,noscript,template');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (fora(n)) continue;
    const texto = n.nodeValue;
    const textoN = texto.replace(/[    ]/g, ' ');
    for (const m of texto.matchAll(RE)) {
      const tok = norm(m[0]);
      const el = n.parentElement;
      const onde = norm((el.closest('p,li,figcaption,h2,a') || el).textContent).slice(0, 100);
      const comLinha = el.closest('[data-linha]');
      if (comLinha) {
        const id = comLinha.getAttribute('data-linha');
        const mostra = norm(comLinha.textContent);
        if (!(id in lista)) falhas.push(['numeros', `data-linha desconhecido «${id}» em «${onde}»`]);
        else if (mostra !== norm(lista[id])) falhas.push(['numeros', `o elemento com data-linha="${id}" mostra «${mostra}»; o pedido e o livro-razão dizem «${lista[id]}»`]);
        else vistos[id] = (vistos[id] || 0) + 1;
        continue;
      }
      const comRef = el.closest('[data-referencia]');
      if (comRef) {
        const id = comRef.getAttribute('data-referencia');
        const mostra = norm(comRef.textContent);
        if (id !== referencia.id || mostra !== referencia.valor) falhas.push(['numeros', `data-referencia="${id}" mostra «${mostra}»; esperava «${referencia.valor}» de ${referencia.id}`]);
        else referenciaVista++;
        continue;
      }
      if (/^(19|20)\d\d$/.test(tok)) { anos.push(tok); continue; }
      let casou = false;
      fixas.forEach((f, i) => {
        const pos = f.frase.indexOf(f.numero);
        for (let k = textoN.indexOf(f.frase); k !== -1; k = textoN.indexOf(f.frase, k + 1)) {
          if (k + pos === m.index && tok === f.numero) { fixasVistas[i]++; casou = true; }
        }
      });
      if (!casou) falhas.push(['numeros', `número sem origem «${tok}» em «${onde}»`]);
    }
  }
  for (const id of Object.keys(lista)) if (!vistos[id]) falhas.push(['numeros', `a linha ${id} (${lista[id]}) não aparece na página`]);
  fixas.forEach((f, i) => { if (fixasVistas[i] !== 1) falhas.push(['numeros', `«${f.numero}» de «${f.frase}» aparece ${fixasVistas[i]} vezes; esperava 1`]); });
  if (referenciaVista !== 1) falhas.push(['numeros', `o valor de referência aparece ${referenciaVista} vezes; esperava 1`]);

  // atributos que um leitor ou um leitor de ecrã lê
  for (const el of document.querySelectorAll('*')) {
    for (const a of ['aria-label', 'title', 'alt', 'placeholder', 'aria-description', 'aria-valuetext', 'aria-roledescription']) {
      const v = el.getAttribute(a);
      if (v && /\d/.test(v)) falhas.push(['numeros', `número no atributo ${a}="${v}"`]);
    }
    if (el.tagName === 'INPUT' && /\d/.test(el.value)) falhas.push(['numeros', `número no valor de um campo: «${el.value}»`]);
  }
  if (/\d/.test(document.title)) falhas.push(['numeros', `número no título: «${document.title}»`]);

  // palavras e travessões
  const corpo = norm(document.body.textContent);
  for (const p of palavras) if (!corpo.includes(norm(p))) falhas.push(['palavras', `falta na página: «${p}»`]);
  const tr = corpo.match(/.{0,30}[—–].{0,30}|.{0,30} - .{0,30}/);
  if (tr) falhas.push(['palavras', `travessão: «${tr[0]}»`]);

  // o desenho
  const geometria = [];
  const barras = [...document.querySelectorAll('.pp-barra, .pp-col-barra')].map((b) => {
    const vertical = b.classList.contains('pp-col-barra');
    const r = b.getBoundingClientRect();
    const dono = b.closest('li, .pp-col');
    const linha = dono && dono.querySelector('[data-linha]');
    const grafico = b.closest('[data-escala]');
    return {
      b, vertical, grafico, lista: b.closest('ul, .pp-plot'),
      id: linha ? linha.getAttribute('data-linha') : null,
      escala: grafico ? grafico.getAttribute('data-escala') : null,
      comprimento: vertical ? r.height : r.width,
      inicio: vertical ? r.bottom : r.left,
      v: parseFloat(b.style.getPropertyValue('--v')),
      max: parseFloat(getComputedStyle(b).getPropertyValue('--max')),
      valor: linha ? parseFloat(norm(linha.textContent).replace(/ /g, '').replace(',', '.')) : NaN,
    };
  });
  for (const x of barras) {
    if (!x.id || !x.escala) falhas.push(['desenho', `barra sem número ou sem gráfico (${x.id ?? '?'})`]);
    else if (Math.abs(x.v - x.valor) > 1e-9) falhas.push(['desenho', `a barra de ${x.id} desenha ${x.v} e o número diz ${x.valor}`]);
  }
  const porEscala = {};
  for (const x of barras) (porEscala[x.escala] ??= []).push(x);
  for (const [escala, xs] of Object.entries(porEscala)) {
    const maxs = [...new Set(xs.map((x) => x.max))];
    const maior = Math.max(...xs.map((x) => x.valor));
    if (maxs.length !== 1 || Math.abs(maxs[0] - maior) > 1e-9) falhas.push(['desenho', `a escala «${escala}» tem máximos ${maxs.join(' e ')}; o maior número é ${maior}`]);
    const ref = xs.reduce((a, x) => (x.valor > a.valor ? x : a));
    const k = ref.comprimento / ref.valor;
    for (const x of xs) {
      const esperado = k * x.valor;
      if (Math.abs(x.comprimento - esperado) > 0.75) falhas.push(['desenho', `na escala «${escala}», ${x.id} mede ${x.comprimento.toFixed(2)} px; na escala dos outros mediria ${esperado.toFixed(2)} px`]);
    }
    geometria.push(`${escala}: ${xs.length} barras, ${k.toFixed(3)} px por unidade`);
  }
  const porLista = new Map();
  for (const x of barras) { if (!porLista.has(x.lista)) porLista.set(x.lista, []); porLista.get(x.lista).push(x); }
  for (const xs of porLista.values()) {
    const inicios = xs.map((x) => x.inicio);
    if (Math.max(...inicios) - Math.min(...inicios) > 0.5) falhas.push(['desenho', `as barras de ${xs.map((x) => x.id).join(', ')} não partem da mesma origem`]);
  }
  const colunas = barras.filter((x) => x.vertical);
  if (colunas.length) {
    const bases = colunas.map((x) => x.inicio);
    if (Math.max(...bases) - Math.min(...bases) > 0.5) falhas.push(['desenho', 'as colunas dos dois painéis da dívida não assentam na mesma base']);
    const linhaRef = document.querySelector('.pp-ref');
    const numRef = document.querySelector('[data-referencia]');
    if (!linhaRef || !numRef) falhas.push(['desenho', 'falta a linha do valor de referência ou o seu número']);
    else {
      const r = linhaRef.getBoundingClientRect();
      const k = colunas[0].comprimento / colunas[0].valor;
      const alvo = colunas[0].inicio - k * parseFloat(norm(numRef.textContent));
      const centro = (r.top + r.bottom) / 2;
      if (Math.abs(centro - alvo) > 1) falhas.push(['desenho', `a linha de referência está a ${(colunas[0].inicio - centro).toFixed(1)} px da base; os ${norm(numRef.textContent)} da escala estão a ${(colunas[0].inicio - alvo).toFixed(1)} px`]);
      const semRef = [...document.querySelectorAll('.pp-coluna-painel')].filter((p) => !p.contains(linhaRef));
      for (const p of semRef) if (p.getBoundingClientRect().left < r.right - 0.5) falhas.push(['desenho', 'a linha do valor de referência entra no painel da União, onde a Comissão não aplica o limiar']);
      geometria.push(`referência: a linha a ${(colunas[0].inicio - centro).toFixed(1)} px da base, os 60 a ${(colunas[0].inicio - alvo).toFixed(1)} px`);
    }
  }

  // a cor
  const cores = {};
  for (const [nome, hex] of Object.entries(tokens)) {
    const h = hex.replace('#', '');
    cores[[0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',')] = nome;
  }
  const props = ['color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'text-decoration-color', 'outline-color'];
  const propsSvg = ['fill', 'stroke']; // só num elemento SVG: num elemento HTML o «fill» inicial é preto e não pinta nada
  const fora_da_paleta = new Set();
  let ambar = 0;
  const ver = (el, cs, pseudo) => {
    const valores = props.map((p) => cs.getPropertyValue(p));
    if (el instanceof SVGElement && !pseudo) valores.push(...propsSvg.map((p) => cs.getPropertyValue(p)));
    const img = cs.getPropertyValue('background-image');
    if (img && img !== 'none') valores.push(...(img.match(/rgba?\([^)]*\)/g) || []));
    for (const v of valores) {
      for (const c of v.match(/rgba?\([^)]*\)/g) || []) {
        const n = c.match(/[\d.]+/g).map(Number);
        if (n.length === 4 && n[3] === 0) continue;
        const chave = n.slice(0, 3).join(',');
        const nome = cores[chave];
        const quem = `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''}${pseudo || ''}`;
        if (!nome) fora_da_paleta.add(`${c} em ${quem}`);
        else if (nome === 'âmbar') { if (!(el.matches('.pp-ref') && !pseudo)) fora_da_paleta.add(`âmbar fora da linha de referência, em ${quem}`); else ambar++; }
      }
    }
  };
  for (const el of document.body.querySelectorAll('*')) {
    ver(el, getComputedStyle(el));
    for (const p of ['::before', '::after']) {
      const cs = getComputedStyle(el, p);
      if (cs.getPropertyValue('content') !== 'none' && cs.getPropertyValue('content') !== 'normal') ver(el, cs, p);
    }
  }
  ver(document.body, getComputedStyle(document.body));
  for (const f of fora_da_paleta) falhas.push(['cor', f]);
  if (!ambar) falhas.push(['cor', 'a linha do valor de referência não tem cor']);

  return { falhas, vistos, anos, fixasVistas, referenciaVista, geometria, total: Object.values(vistos).reduce((a, b) => a + b, 0) };
}

const TOKENS = {
  claro: { papel: '#f6f7f4', tinta: '#17191b', g1: '#585d5b', g2: '#7f8681', g3: '#d9ddd8', 'âmbar': '#e0a21a' },
  escuro: { papel: '#15171a', tinta: '#eceeea', g1: '#b9beba', g2: '#8e948f', g3: '#3a3f3c', 'âmbar': '#e0a21a' },
};

// ── 1 e 2: o pedido, o livro-razão e as referências ──────────────────────────────────────
const falhasFora = [];
const pedido = await fs.readFile(path.join(pasta, 'PEDIDO.md'), 'utf8');
const pedidoN = norm(pedido);
for (const [id, valor] of Object.entries(LISTA)) {
  if (!pedido.includes('`' + id + '`')) falhasFora.push(['pedido', `o pedido não nomeia a linha ${id}`]);
  if (!pedidoN.includes(norm(valor))) falhasFora.push(['pedido', `o pedido não escreve o valor ${valor}`]);
}
const nomeados = new Set();
for (const m of pedido.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)) {
  try { await fs.access(path.join(WORKTREE, 'ledger/claims', m[1] + '.yml')); nomeados.add(m[1]); } catch { /* não é uma linha */ }
}
for (const id of nomeados) if (!(id in LISTA)) falhasFora.push(['pedido', `o pedido nomeia a linha ${id} e ela não está na lista`]);
// as palavras fixas conferidas na página são as do pedido (tiradas as anotações `id` entre parênteses);
// um título de painel pode ganhar a maiúscula inicial, e mais nada muda
const pedidoLimpo = norm(pedido.replace(/\s*\((?:`[^`]+`(?:,\s*)?)+\)/g, ''));
for (const p of PALAVRAS) {
  const q = norm(p);
  if (!pedidoLimpo.includes(q) && !pedidoLimpo.includes(q[0].toLowerCase() + q.slice(1))) falhasFora.push(['pedido', `a página confere «${p}», que o pedido não escreve assim`]);
}
const livro = {};
for (const [id, valor] of Object.entries(LISTA)) {
  let yml;
  try { yml = await fs.readFile(path.join(WORKTREE, 'ledger/claims', id + '.yml'), 'utf8'); } catch { falhasFora.push(['livro', `não há linha ${id} no livro-razão`]); continue; }
  const v = (yml.match(/^value:\s*"([^"]*)"\s*$/m) || [])[1];
  const d = (yml.match(/^reference_date:\s*"([^"]*)"\s*$/m) || [])[1];
  livro[id] = { v, d };
  if (v === undefined || norm(v) !== norm(valor)) falhasFora.push(['livro', `a linha ${id} diz «${v}»; o pedido diz «${valor}»`]);
}
const refs = JSON.parse(await fs.readFile(path.join(WORKTREE, 'src/data/enquadramento/referencias.json'), 'utf8'));
const refLinha = (refs.indicadores || []).find((x) => x.id_da_linha === REFERENCIA.id);
if (!refLinha || refLinha.limiar.replace('%', '').trim() !== REFERENCIA.valor) falhasFora.push(['livro', `o valor de referência de ${REFERENCIA.id} não é ${REFERENCIA.valor} % em referencias.json`]);

// o conteúdo gerado pelas folhas de estilo desta página não escreve números
for (const f of ['estilos/base.css', 'estilos/primeira-pagina.css']) {
  const css = await fs.readFile(path.join(pasta, f), 'utf8');
  for (const m of css.matchAll(/content:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)) {
    const texto = m[1].slice(1, -1).replace(/\\[0-9a-fA-F]{1,6}\s?/g, '');
    if (/\d/.test(texto)) falhasFora.push(['numeros', `número no conteúdo gerado de ${f}: ${m[0]}`]);
  }
}

// ── 3 a 7: a página, nas duas larguras e nos dois temas ─────────────────────────────────
const parametros = (tema) => ({ lista: LISTA, referencia: REFERENCIA, fixas: FIXAS, palavras: PALAVRAS, tokens: TOKENS[tema] });
const browser = await chromium.launch();
async function correr(ficheiro, largura, tema) {
  const context = await browser.newContext({ viewport: { width: largura, height: 844 }, deviceScaleFactor: 1, colorScheme: tema === 'escuro' ? 'dark' : 'light' });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(pasta, ficheiro)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(conferirNaPagina, parametros(tema));
  await context.close();
  return r;
}

let resultado = 0;
const execucoes = [];
try {
  for (const [largura, tema] of [[390, 'claro'], [1280, 'claro'], [390, 'escuro'], [1280, 'escuro']]) {
    execucoes.push({ largura, tema, r: await correr('index.html', largura, tema) });
  }

  // ── 8: as plantas ─────────────────────────────────────────────────────────────────────
  const original = await fs.readFile(path.join(pasta, 'index.html'), 'utf8');
  const PLANTAS = [
    { nome: 'um número solto na ressalva', espera: /número sem origem «12»/, de: 'Um grupo que sobe muito não é', para: 'Um grupo que sobe 12 % muito não é' },
    { nome: 'um valor trocado no gráfico dos preços', espera: /data-linha="ipc-combustiveis-variacao-homologa" mostra «23,87»/, de: 'data-linha="ipc-combustiveis-variacao-homologa">23,78</span>&nbsp;%</span></span></li>', para: 'data-linha="ipc-combustiveis-variacao-homologa">23,87</span>&nbsp;%</span></span></li>' },
    { nome: 'o identificador de outra linha nas rendas', espera: /data-linha="ipc-alimentacao-variacao-homologa" mostra «5,22»/, de: 'data-linha="ipc-rendas-variacao-homologa"', para: 'data-linha="ipc-alimentacao-variacao-homologa"' },
    { nome: 'uma linha do pedido retirada da página', espera: /racio-s80-s20-2025-ue \(4,62\) não aparece/, de: /<li class="pp-ue"><span class="pp-rotulo">União<\/span><span class="pp-traco"><span class="pp-barra" style="--v:4\.62"><\/span>.*?<\/li>/s, para: '' },
    { nome: 'um número das palavras fixas mudado', espera: /número sem origem «45»/, de: 'mais de 40&nbsp;% do rendimento', para: 'mais de 45&nbsp;% do rendimento' },
    { nome: 'a unidade dentro do elemento do valor', espera: /data-linha="ihpc-variacao-homologa" mostra «3,6 %»/, de: 'data-linha="ihpc-variacao-homologa">3,6</span>&nbsp;%</span>', para: 'data-linha="ihpc-variacao-homologa">3,6&nbsp;%</span></span>' },
    { nome: 'um travessão numa frase', espera: /^travessão/, de: 'A dívida pública desceu, mas continua', para: 'A dívida pública desceu — mas continua' },
    { nome: 'um painel da casa com outro máximo de escala', espera: /a escala «casa» tem máximos/, de: '<ul class="pp-pares" data-escala="casa" style="--max:27.2">\n                <li class="pp-pt"><span class="pp-rotulo">Portugal</span><span class="pp-traco"><span class="pp-barra" style="--v:27.2">', para: '<ul class="pp-pares" data-escala="casa" style="--max:20">\n                <li class="pp-pt"><span class="pp-rotulo">Portugal</span><span class="pp-traco"><span class="pp-barra" style="--v:27.2">' },
    { nome: 'um painel da casa mais estreito (a mesma escala escrita, outra desenhada)', espera: /na escala «casa», .* mede/, de: '<div class="pp-painel">\n              <p class="pp-painel-t">Quem arrenda a preço de mercado</p>', para: '<div class="pp-painel" style="max-width:200px">\n              <p class="pp-painel-t">Quem arrenda a preço de mercado</p>' },
    { nome: 'uma barra dos preços deslocada da origem', espera: /não partem da mesma origem/, de: '<span class="pp-barra" style="--v:2.14">', para: '<span class="pp-barra" style="--v:2.14; margin-left:9px">' },
    { nome: 'a linha de referência nos 50 em vez dos 60', espera: /a linha de referência está a/, de: 'style="--max:93.0; --r:60"', para: 'style="--max:93.0; --r:50"' },
    { nome: 'a linha de referência a entrar no painel da União', espera: /entra no painel da União/, de: '<span class="pp-ref" aria-hidden="true"></span>', para: '<span class="pp-ref" aria-hidden="true" style="right:-160px"></span>' },
    { nome: 'uma cor numa coluna que não é a referência', espera: /rgb\(31, 78, 140\) em span\.pp-col-barra/, de: '<span class="pp-col-barra" style="--v:81.7"></span>', para: '<span class="pp-col-barra" style="--v:81.7; background:var(--cobalt)"></span>' },
    { nome: 'o âmbar fora da linha, no rótulo da referência', espera: /âmbar fora da linha de referência, em p\.pp-ref-rotulo/, de: '<p class="pp-ref-rotulo">', para: '<p class="pp-ref-rotulo" style="color:var(--amber)">' },
  ];
  const planta = path.join(pasta, 'planta.html');
  try {
    for (const p of PLANTAS) {
      const antes = typeof p.de === 'string' ? original.split(p.de).length - 1 : (original.match(new RegExp(p.de.source, 'gs')) || []).length;
      if (antes !== 1) { p.resultado = `a planta não se aplica (o trecho aparece ${antes} vezes)`; p.apanhada = false; continue; }
      await fs.writeFile(planta, original.replace(p.de, p.para));
      const r = await correr('planta.html', 390, 'claro');
      const certa = r.falhas.find(([, msg]) => p.espera.test(msg));
      p.apanhada = Boolean(certa);
      p.resultado = certa ? `[${certa[0]}] ${certa[1]}` : `NÃO APANHADA (${r.falhas.length} outras falhas: ${r.falhas.slice(0, 2).map(([, m]) => m).join(' | ')})`;
    }
  } finally {
    await fs.rm(planta, { force: true });
  }

  // ── o relatório ─────────────────────────────────────────────────────────────────────────
  console.log('Verificação da maqueta da primeira página nova (v1)\n');
  console.log(`Pedido e livro-razão: ${Object.keys(LISTA).length} linhas na lista, ${nomeados.size} nomeadas no pedido; valores conferidos contra ledger/claims na worktree c1-2026-09-28.`);
  console.log(`Valor de referência: ${REFERENCIA.valor} % (${REFERENCIA.id}, src/data/enquadramento/referencias.json).`);
  for (const [k, msg] of falhasFora) console.log(`  FALHA [${k}] ${msg}`);
  for (const { largura, tema, r } of execucoes) {
    console.log(`\nA ${largura} px, tema ${tema}: ${r.total} números com data-linha (${Object.keys(r.vistos).length} linhas distintas de ${Object.keys(LISTA).length}), anos ${[...new Set(r.anos)].sort().join(', ')} (${r.anos.length} ocorrências), números das palavras fixas ${r.fixasVistas.reduce((a, b) => a + b, 0)} de ${FIXAS.length}, valor de referência ${r.referenciaVista}.`);
    for (const g of r.geometria) console.log(`  desenho · ${g}`);
    if (!r.falhas.length) console.log('  sem falhas');
    for (const [k, msg] of r.falhas) console.log(`  FALHA [${k}] ${msg}`);
  }
  console.log('\nLinhas e quantas vezes cada uma aparece (a 390 px):');
  const r390 = execucoes[0].r;
  for (const id of Object.keys(LISTA)) console.log(`  ${String(r390.vistos[id] ?? 0).padStart(2)} × ${LISTA[id].padEnd(6)} ${id}  (livro: «${livro[id]?.v}», ${livro[id]?.d})`);
  console.log('\nPlantas (cada uma tem de produzir a falha exata que lhe corresponde):');
  for (const p of PLANTAS) console.log(`  ${p.apanhada ? 'apanhada' : 'FALHOU  '} · ${p.nome} → ${p.resultado}`);

  const falhasPagina = execucoes.reduce((a, e) => a + e.r.falhas.length, 0);
  const soltas = PLANTAS.filter((p) => !p.apanhada).length;
  resultado = falhasFora.length + falhasPagina + soltas;
  console.log(`\n${resultado === 0 ? 'VERDE' : 'VERMELHO'}: ${falhasFora.length + falhasPagina} falhas na página e nas fontes; ${PLANTAS.length - soltas} de ${PLANTAS.length} plantas apanhadas.`);
} finally {
  await browser.close();
}
process.exit(resultado === 0 ? 0 : 1);
