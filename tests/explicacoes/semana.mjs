/**
 * =============================================================================
 * W · A LEITURA DA SEMANA, PROVADA CONTRA O REGISTO (bloco EX1, 05.10.2026, o ponto 2 do mandato)
 * =============================================================================
 *
 * PORQUE EXISTE. A leitura da semana gera-se em cada construção (`src/lib/leitura-da-semana.mjs`), e uma leitura que
 * ninguém escreve só é tão boa quanto a conta que a faz. Esta célula refaz a conta por si, com leitor próprio, e
 * confere-a de três maneiras:
 *
 *   · W1 · NUMA CÓPIA DO LIVRO COM ENTRADAS PLANTADAS, sem `dist/`: um valor mudado dentro da janela, uma releitura
 *     igual dentro da janela e uma entrada fora da janela. O resolvedor e a conta desta célula têm de dar, os dois, o
 *     que cada planta pede (o valor mudado conta uma linha a mais, com a palavra do lado certa; a releitura igual conta
 *     uma relida a mais e nenhuma mudança; a entrada fora da janela não muda nada) e de concordar entre si no livro sem
 *     plantas;
 *   · W2 · NA PÁGINA DA SEMANA, nas duas edições: a janela acaba no dia do carimbo da construção; a primeira frase é a
 *     que esta célula compõe das cadeias da casa e das suas contagens; há uma entrada por linha cujo valor mudou, da
 *     mudança mais recente para a mais antiga, cada uma com o valor de antes da primeira mudança e o de depois da
 *     última, a palavra do lado pela conta dos dois números e o dia da última; e a frase da primeira página diz o que
 *     a conta desta célula dá (nenhuma frase mudou, ou as que mudaram);
 *   · W3 · NAS PORTAS: a primeira frase na lista das explicações e na primeira página é a mesma, dentro de uma ligação
 *     para a página da semana.
 *
 * O ÂMBITO é o do resolvedor, escrito aqui outra vez: fora as contagens do próprio projeto (o estudo `o-estado-do-pais`)
 * e a linha que a casa declara a mesma medida de outra (`MEDIDA_REUNIDA`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { MEDIDA_REUNIDA } from '../../src/lib/pais.mjs';
import { BLOCOS_DA_PRIMEIRA_PAGINA } from '../../src/data/primeira-pagina.mjs';
import { limiarDaLinha } from '../../src/lib/primeira-pagina.mjs';
import { leituraDaSemana } from '../../src/lib/leitura-da-semana.mjs';
import { t } from '../../src/i18n/strings.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const ESTUDO_DO_PROJETO = 'o-estado-do-pais';
const PAGINAS_DA_SEMANA = /** @type {const} */ ([['pt', 'explicacoes/leitura-da-semana/index.html'], ['en', 'en/explainers/weekly-reading/index.html']]);
const PORTA_DA_SEMANA = { pt: '/explicacoes/leitura-da-semana', en: '/en/explainers/weekly-reading' };

const normal = (/** @type {unknown} */ s) => String(s ?? '').replace(/[\s   ]+/g, ' ').trim();
const numero = (/** @type {unknown} */ v) => {
  const s = String(v ?? '').replace(/[\s  ]/g, '').replace(/−/g, '-').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
const dataAqui = (/** @type {string} */ iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); return m ? `${m[3]}.${m[2]}.${m[1]}` : iso; };
const milharesAqui = (/** @type {number} */ n) => (String(n).length >= 4 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));
const menosDias = (/** @type {string} */ iso, /** @type {number} */ n) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };

/**
 * A CONTA DESTA CÉLULA: as contagens e as mudanças da janela que acaba em `fim`.
 * @param {Map<string, any>|Iterable<[string, any]>} linhas @param {string} fim
 */
export function semanaPelaCelula(linhas, fim) {
  const inicio = menosDias(fim, 6);
  const dentro = (/** @type {unknown} */ d) => typeof d === 'string' && d >= inicio && d <= fim;
  let relidas = 0;
  let proveniencia = 0;
  /** @type {{ linha: string, antes: { n: number, valor: string }, depois: { n: number, valor: string, data: string }, palavra: string }[]} */
  const mudancas = [];
  for (const [id, l] of linhas) {
    if (!l || l.study === ESTUDO_DO_PROJETO || Object.hasOwn(MEDIDA_REUNIDA, id)) continue;
    if ((l.verifications ?? []).some((/** @type {any} */ v) => dentro(v?.date))) relidas += 1;
    const doDia = (l.corrections ?? []).map((/** @type {any} */ c, /** @type {number} */ n) => ({ c, n })).filter((/** @type {any} */ x) => dentro(x.c?.date));
    if (doDia.some((/** @type {any} */ x) => x.c.kind === 'proveniencia')) proveniencia += 1;
    const deValor = doDia.filter((/** @type {any} */ x) => x.c.kind === 'correcao' || x.c.kind === 'atualizacao').sort((/** @type {any} */ a, /** @type {any} */ b) => a.c.date.localeCompare(b.c.date) || a.n - b.n);
    if (!deValor.length) continue;
    const p = deValor[0], u = deValor[deValor.length - 1];
    const a = numero(p.c.old_value), b = numero(u.c.new_value);
    mudancas.push({ linha: id, antes: { n: p.n, valor: String(p.c.old_value) }, depois: { n: u.n, valor: String(u.c.new_value), data: u.c.date }, palavra: a === null || b === null ? 'sem-numero' : b > a ? 'subiu' : b < a ? 'desceu' : 'naoMudou' });
  }
  mudancas.sort((x, y) => y.depois.data.localeCompare(x.depois.data) || x.linha.localeCompare(y.linha));
  return { janela: { inicio, fim }, contagens: { relidas, valor: mudancas.length, proveniencia }, mudancas };
}

/**
 * A PRIMEIRA FRASE, pela composição desta célula, com as cadeias da casa.
 * @param {{ janela: { inicio: string, fim: string }, contagens: { relidas: number, valor: number, proveniencia: number } }} s
 * @param {'pt'|'en'} lang
 */
export function primeiraFrasePelaCelula(s, lang) {
  const c = t(lang).semana;
  const { relidas, valor, proveniencia } = s.contagens;
  let f = `${c.entre}${dataAqui(s.janela.inicio)}${c.e}${dataAqui(s.janela.fim)}${c.virgula}`;
  f += relidas === 0 ? c.nenhumRelido : `${milharesAqui(relidas)}${relidas === 1 ? c.umRelido : c.variosRelidos}`;
  if (valor === 0 && proveniencia === 0) f += c.nenhumMudou;
  else {
    f += c.virgula + (valor === 0 ? c.nenhumDeValor : `${milharesAqui(valor)}${valor === 1 ? c.umDeValor : c.variosDeValor}`);
    f += c.e + (proveniencia === 0 ? c.nenhumDeProveniencia : `${milharesAqui(proveniencia)}${proveniencia === 1 ? c.umDeProveniencia : c.variosDeProveniencia}`);
  }
  return normal(f + c.ponto);
}

/* --------------------------------------------- as frases da primeira página, por esta célula */

/** @param {any} c @param {(id: string) => number|null} valor @param {Map<string, any>} linhas */
function condicaoAqui(c, valor, linhas) {
  if (Array.isArray(c?.mesmo_periodo)) return c.mesmo_periodo.every((/** @type {string} */ id) => linhas.has(id)) && new Set(c.mesmo_periodo.map((/** @type {string} */ id) => linhas.get(id)?.reference_date)).size === 1;
  if (typeof c?.periodo === 'string') { const m = /^\d{4}-(\d{2})$/.exec(String(linhas.get(c.periodo)?.reference_date ?? '')); return Boolean(m) && Number(m?.[1]) === c.mes; }
  if (typeof c?.a === 'string') {
    const a = valor(c.a);
    const b = typeof c.b === 'string' ? valor(c.b) : typeof c.valor === 'number' ? c.valor : typeof c.referencia === 'string' ? (limiarDaLinha(c.referencia)?.numero ?? null) : null;
    if (a === null || b === null) return false;
    return ({ '>': a > b, '<': a < b, '=': a === b, '!=': a !== b })[/** @type {'>'|'<'|'='|'!='} */ (c.op)] ?? false;
  }
  return false;
}
/** @param {unknown} x @param {(id: string) => number|null} valor @param {string[]} out */
function ramosAqui(x, valor, out) {
  if (Array.isArray(x)) for (const y of x) ramosAqui(y, valor, out);
  else if (x && typeof x === 'object') {
    const o = /** @type {any} */ (x);
    if (Array.isArray(o.compara)) {
      const [a, b] = o.compara.map(valor);
      const r = a === null || b === null ? 'sem-valor' : a < b ? 'menor' : a > b ? 'maior' : 'igual';
      out.push(r);
      if (r in o) ramosAqui(o[r], valor, out);
      return;
    }
    for (const v of Object.values(o)) ramosAqui(v, valor, out);
  }
}
/** As linhas de um bloco, pela leitura desta célula. @param {unknown} x @param {Map<string, any>} linhas @param {Set<string>} out */
function linhasAqui(x, linhas, out = new Set()) {
  if (Array.isArray(x)) for (const y of x) linhasAqui(y, linhas, out);
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) {
    if (['claim', 'periodo', 'publicado', 'referencia', 'compara', 'mesmo_periodo', 'a', 'b', 'linhas', 'total', 'pt', 'ue', 'colunas'].includes(k)) for (const id of [v].flat()) if (typeof id === 'string' && linhas.has(id)) out.add(id);
    linhasAqui(v, linhas, out);
  }
  return out;
}

/**
 * Os blocos da primeira página que mudaram de assinatura com as mudanças da semana, pela conta desta célula.
 * @param {ReturnType<typeof semanaPelaCelula>} s @param {Map<string, any>} linhas
 */
export function blocosQueMudaramPelaCelula(s, linhas) {
  const antes = new Map(s.mudancas.map((m) => [m.linha, numero(m.antes.valor)]));
  const agora = (/** @type {string} */ id) => numero(linhas.get(id)?.value);
  const deAntes = (/** @type {string} */ id) => (antes.has(id) ? /** @type {number|null} */ (antes.get(id)) : agora(id));
  const assinatura = (/** @type {any} */ b, /** @type {(id: string) => number|null} */ v) => {
    /** @type {string[]} */
    const r = [];
    ramosAqui(b.frase?.pt, v, r);
    return JSON.stringify({ mostra: (b.condicao ?? []).every((/** @type {any} */ c) => condicaoAqui(c, v, linhas)), r, p: (b.pecas ?? []).map((/** @type {any} */ p) => { const q = []; ramosAqui(p.pt, v, q); return [p.id, (p.condicao ?? []).every((/** @type {any} */ c) => condicaoAqui(c, v, linhas)), q]; }) });
  };
  return BLOCOS_DA_PRIMEIRA_PAGINA.filter((b) => [...linhasAqui(b, linhas)].some((id) => antes.has(id)) && assinatura(b, deAntes) !== assinatura(b, agora)).map((b) => b.id);
}

/* ------------------------------------------------------------------------- W1 */

/**
 * W1 · A CÓPIA COM ENTRADAS PLANTADAS. Devolve as queixas e as três plantas, cada uma com o que pediu e o que viu.
 * @param {string} fim
 */
export function provaNaCopiaPlantada(fim) {
  /** @type {string[]} */
  const erros = [];
  const base = loadClaims();
  const copia = () => new Map([...base].map(([k, v]) => [k, structuredClone(v)]));
  const doResolvedor = (/** @type {Map<string, any>} */ m) => leituraDaSemana({ fim, linhas: m.values() });
  const r0 = doResolvedor(base), c0 = semanaPelaCelula(base, fim);
  if (JSON.stringify(r0.contagens) !== JSON.stringify(c0.contagens)) erros.push(`W1 · no livro sem plantas, o resolvedor conta ${JSON.stringify(r0.contagens)} e esta célula ${JSON.stringify(c0.contagens)}`);
  if (JSON.stringify(r0.mudancas.map((m) => [m.linha, m.palavra])) !== JSON.stringify(c0.mudancas.map((m) => [m.linha, m.palavra]))) erros.push('W1 · no livro sem plantas, o resolvedor e esta célula discordam nas mudanças');
  const inicio = menosDias(fim, 6);
  /* As linhas das plantas: do âmbito, com valor numérico, sem entrada nenhuma na janela. */
  const livres = [...base].filter(([id, l]) => l && l.study !== ESTUDO_DO_PROJETO && !Object.hasOwn(MEDIDA_REUNIDA, id) && numero(l.value) !== null &&
    !(l.corrections ?? []).some((/** @type {any} */ c) => c?.date >= inicio && c?.date <= fim) && !(l.verifications ?? []).some((/** @type {any} */ v) => v?.date >= inicio && v?.date <= fim)).map(([id]) => id).sort();
  if (livres.length < 3) return { erros: [...erros, 'W1 · não há três linhas livres para as plantas'], plantas: [] };
  const [la, lb, lc] = livres;
  /** @type {{ nome: string, pediu: string, viu: string, mordeu: boolean }[]} */
  const plantas = [];
  {
    const m = copia(); const l = m.get(la);
    const novo = String(l.value).replace(/\d(?=\D*$)/, (d) => String((Number(d) + 1) % 10));
    l.corrections = [...(l.corrections ?? []), { date: fim, kind: 'atualizacao', old_value: l.value, new_value: novo, reason: 'planta', reason_en: 'plant' }];
    const r = doResolvedor(m), c = semanaPelaCelula(m, fim);
    const palavra = numero(novo) > numero(l.value) ? 'subiu' : 'desceu';
    const ok = r.contagens.valor === c0.contagens.valor + 1 && c.contagens.valor === c0.contagens.valor + 1 &&
      r.mudancas.find((x) => x.linha === la)?.palavra === palavra && c.mudancas.find((x) => x.linha === la)?.palavra === palavra && r.contagens.relidas === c0.contagens.relidas;
    plantas.push({ nome: `um valor mudado dentro da janela (${la}, ${l.value} para ${novo})`, pediu: `mais uma linha mudada, «${palavra}»`, viu: `resolvedor ${r.contagens.valor} (${r.mudancas.find((x) => x.linha === la)?.palavra}), célula ${c.contagens.valor}`, mordeu: ok });
  }
  {
    const m = copia(); const l = m.get(lb);
    l.verifications = [...(l.verifications ?? []), { date: fim, result: 'igual', by: 'planta', path: null }];
    const r = doResolvedor(m), c = semanaPelaCelula(m, fim);
    const ok = r.contagens.relidas === c0.contagens.relidas + 1 && c.contagens.relidas === c0.contagens.relidas + 1 && r.contagens.valor === c0.contagens.valor && c.contagens.valor === c0.contagens.valor && !r.mudancas.some((x) => x.linha === lb);
    plantas.push({ nome: `uma releitura igual dentro da janela (${lb})`, pediu: 'mais uma relida e nenhuma mudança', viu: `resolvedor ${r.contagens.relidas} relidas e ${r.contagens.valor} mudadas, célula ${c.contagens.relidas} e ${c.contagens.valor}`, mordeu: ok });
  }
  {
    const m = copia(); const l = m.get(lc);
    const fora = menosDias(inicio, 1);
    l.corrections = [...(l.corrections ?? []), { date: fora, kind: 'atualizacao', old_value: l.value, new_value: `${l.value}9`, reason: 'planta', reason_en: 'plant' }];
    l.verifications = [...(l.verifications ?? []), { date: fora, result: 'diverge', by: 'planta', path: null }];
    const r = doResolvedor(m), c = semanaPelaCelula(m, fim);
    const ok = JSON.stringify(r.contagens) === JSON.stringify(r0.contagens) && JSON.stringify(c.contagens) === JSON.stringify(c0.contagens);
    plantas.push({ nome: `uma entrada fora da janela (${lc}, ${fora})`, pediu: 'nada muda', viu: `resolvedor ${JSON.stringify(r.contagens)}, célula ${JSON.stringify(c.contagens)}`, mordeu: ok });
  }
  for (const p of plantas) if (!p.mordeu) erros.push(`W1 · a planta «${p.nome}» pediu ${p.pediu} e viu ${p.viu}`);
  return { erros, plantas };
}

/* ------------------------------------------------------------------- W2 e W3 */

/** O dia do carimbo da construção, e os dias em que a janela pode acabar (a regra do portão, escrita aqui outra vez). @param {string} dist */
export function diasAceites(dist) {
  const c = JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).construido_em;
  const d = new Date(c);
  const dia = d.toISOString().slice(0, 10);
  return d.getUTCHours() === 0 && d.getUTCMinutes() < 30 ? [dia, menosDias(dia, 1)] : [dia];
}

/**
 * W2 · a página da semana numa edição.
 * @param {any} root @param {'pt'|'en'} lang @param {string[]} aceites @param {Map<string, any>} [linhas]
 */
export function conferirPaginaDaSemana(root, lang, aceites, linhas = loadClaims()) {
  /** @type {string[]} */
  const erros = [];
  const c = t(lang).semana;
  const frase = root.querySelector('main [data-semana-frase]');
  const m = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/.exec(frase?.getAttribute('data-semana-janela') ?? '');
  if (!frase || !m) return ['W2 · a página da semana não tem a primeira frase com a janela'];
  if (!aceites.includes(m[2])) erros.push(`W2 · a janela acaba a ${m[2]}, e o carimbo da construção é de ${aceites.join(' ou ')}`);
  const s = semanaPelaCelula(linhas, m[2]);
  if (s.janela.inicio !== m[1]) erros.push(`W2 · a janela começa a ${m[1]} e sete dias até ${m[2]} começam a ${s.janela.inicio}`);
  const esperada = primeiraFrasePelaCelula(s, lang);
  if (normal(frase.textContent) !== esperada) erros.push(`W2 · a primeira frase difere da conta desta célula.\n      esperada: ${esperada}\n      rendida:  ${normal(frase.textContent)}`);
  const entradas = root.querySelectorAll('main [data-semana-mudancas] [data-semana-mudanca]');
  if (JSON.stringify(entradas.map((e) => e.getAttribute('data-semana-mudanca'))) !== JSON.stringify(s.mudancas.map((x) => x.linha))) {
    erros.push(`W2 · as mudanças da página (${entradas.length}) não são, pela ordem, as que esta célula conta (${s.mudancas.length}): da mudança mais recente para a mais antiga`);
  }
  const PALAVRA = { subiu: c.subiu, desceu: c.desceu, naoMudou: c.naoMudou };
  for (const x of s.mudancas) {
    const e = entradas.find((y) => y.getAttribute('data-semana-mudanca') === x.linha);
    if (!e) continue;
    const marca = (/** @type {string} */ campo) => e.querySelector(`[data-correcao-campo="${campo}"]`);
    if (marca('old_value')?.getAttribute('data-correcao-n') !== String(x.antes.n) || normal(marca('old_value')?.textContent) !== normal(x.antes.valor)) erros.push(`W2 · ${x.linha}: o valor de antes não é o da primeira mudança da janela (${x.antes.valor}, entrada ${x.antes.n})`);
    if (marca('new_value')?.getAttribute('data-correcao-n') !== String(x.depois.n) || normal(marca('new_value')?.textContent) !== normal(x.depois.valor)) erros.push(`W2 · ${x.linha}: o valor de agora não é o da última mudança da janela (${x.depois.valor}, entrada ${x.depois.n})`);
    if (normal(marca('date')?.textContent) !== dataAqui(x.depois.data)) erros.push(`W2 · ${x.linha}: o dia não é o da última mudança (${dataAqui(x.depois.data)})`);
    const palavra = PALAVRA[/** @type {'subiu'|'desceu'|'naoMudou'} */ (x.palavra)];
    if (e.getAttribute('data-semana-palavra') !== x.palavra || !palavra || !normal(e.textContent).includes(normal(palavra))) erros.push(`W2 · ${x.linha}: a palavra do lado não é a da conta («${x.palavra}»)`);
    for (const [k, w] of Object.entries(PALAVRA)) if (k !== x.palavra && normal(e.textContent).includes(normal(w).replace(/^,\s*/, ', '))) erros.push(`W2 · ${x.linha}: a entrada traz a palavra de um ramo que a conta não escolheu («${w}»)`);
  }
  /* Os títulos das duas secções só se rendem quando algum valor mudou, e são as cadeias da casa. */
  const titulos = root.querySelectorAll('main [data-semana-seccao] > h2').map((h) => normal(h.textContent));
  const deveTitulos = s.mudancas.length ? [normal(c.mudancasK), normal(c.primeiraK)] : [];
  if (JSON.stringify(titulos) !== JSON.stringify(deveTitulos)) erros.push(`W2 · os títulos das secções (${titulos.join(' | ') || 'nenhum'}) não são os que a conta pede (${deveTitulos.join(' | ') || 'nenhum'})`);
  const mudaramP = root.querySelector('main [data-semana-primeira="mudaram"]');
  if (mudaramP && normal(mudaramP.textContent) !== normal(c.primeiraMudaram)) erros.push('W2 · a frase das frases da primeira página que mudaram não é a cadeia da casa');
  const mudaram = blocosQueMudaramPelaCelula(s, linhas);
  const nenhuma = root.querySelector('main [data-semana-primeira="nenhuma"]');
  const listados = root.querySelectorAll('main [data-semana-bloco]').map((x) => x.getAttribute('data-semana-bloco'));
  if (s.mudancas.length) {
    if (mudaram.length === 0 && (!nenhuma || normal(nenhuma.textContent) !== normal(c.primeiraNenhuma) || listados.length)) erros.push('W2 · nenhuma frase da primeira página mudou, e a página não o diz assim');
    if (mudaram.length > 0 && (nenhuma || JSON.stringify(listados) !== JSON.stringify(mudaram))) erros.push(`W2 · as frases da primeira página que mudaram são ${mudaram.join(', ')}, e a página diz ${listados.join(', ') || 'nenhuma'}`);
  } else if (nenhuma || listados.length) erros.push('W2 · nenhum valor mudou, e a página fala das frases da primeira página');
  return erros;
}

/**
 * W3 · uma porta da semana (a lista das explicações, a primeira página): a frase é a da página da semana, dentro de uma
 * ligação para ela.
 * @param {any} el o elemento com `data-semana-frase` @param {'pt'|'en'} lang @param {string[]} aceites @param {Map<string, any>} [linhas]
 */
export function conferirPortaDaSemana(el, lang, aceites, linhas = loadClaims()) {
  const m = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/.exec(el.getAttribute('data-semana-janela') ?? '');
  if (!m) return ['W3 · uma porta da semana sem a janela declarada'];
  /** @type {string[]} */
  const erros = [];
  if (!aceites.includes(m[2])) erros.push(`W3 · a janela da porta acaba a ${m[2]}, e o carimbo da construção é de ${aceites.join(' ou ')}`);
  const a = el.querySelector('a');
  if (!a || a.getAttribute('href') !== PORTA_DA_SEMANA[lang]) erros.push(`W3 · a frase da porta não está dentro de uma ligação para ${PORTA_DA_SEMANA[lang]}`);
  const esperada = primeiraFrasePelaCelula(semanaPelaCelula(linhas, m[2]), lang);
  if (normal(el.textContent) !== esperada) erros.push(`W3 · a frase da porta difere da conta desta célula («${normal(el.textContent)}» / «${esperada}»)`);
  return erros;
}

/**
 * AS PALAVRAS COMPOSTAS DA SEMANA NUMA PÁGINA, conferidas antes de saírem do inventário das frases: o `check:voz` chama
 * esta função em cada página onde a marca `data-semana-declarado` se rende.
 * @param {any} root @param {'pt'|'en'} lang @param {string|undefined} rota @param {string} dist
 */
export function conferirPalavrasDaSemanaNaPagina(root, lang, rota, dist) {
  const linhas = loadClaims();
  const aceites = diasAceites(dist);
  /** @type {string[]} */
  const erros = [];
  if (rota === 'leituraDaSemana') erros.push(...conferirPaginaDaSemana(root, lang, aceites, linhas));
  else for (const el of root.querySelectorAll('[data-semana-frase]')) erros.push(...conferirPortaDaSemana(el, lang, aceites, linhas));
  for (const el of root.querySelectorAll('[data-semana-declarado]')) {
    const conferido = rota === 'leituraDaSemana' ? Boolean(el.closest('main')) : el.hasAttribute('data-semana-frase');
    if (!conferido) erros.push(`W · a marca das frases compostas da semana está num sítio que esta célula não confere (${rota})`);
  }
  return erros;
}

/** As plantas de W2, em memória, sobre a página portuguesa. @param {string} dist */
export function plantasDaPaginaDaSemana(dist) {
  const linhas = loadClaims();
  const aceites = diasAceites(dist);
  const html = fs.readFileSync(path.join(dist, PAGINAS_DA_SEMANA[0][1]), 'utf8');
  const controlo = conferirPaginaDaSemana(parse(html), 'pt', aceites, linhas);
  /** @param {string} nome @param {(r: any) => void} estraga @param {RegExp} mordida */
  const planta = (nome, estraga, mordida) => {
    const r = parse(html);
    estraga(r);
    const q = conferirPaginaDaSemana(r, 'pt', aceites, linhas);
    return { nome, mordeu: controlo.length === 0 && q.some((x) => mordida.test(x)), queixa: q.join(' | ') || 'nenhuma' };
  };
  return [
    planta('uma contagem trocada', (r) => { const n = r.querySelector('[data-semana="relidas"]'); n.set_content(String(Number(n.textContent.replace(/\D/g, '')) + 1)); }, /W2 · a primeira frase/),
    planta('a janela de outro dia', (r) => { const f = r.querySelector('[data-semana-frase]'); f.setAttribute('data-semana-janela', `${menosDias(aceites[0], 7)}/${menosDias(aceites[0], 1)}`); }, /W2 · a janela acaba/),
    planta('uma mudança a menos', (r) => { r.querySelector('[data-semana-mudanca]').remove(); }, /W2 · as mudanças da página/),
    planta('a palavra do lado trocada', (r) => { const e = r.querySelector('[data-semana-mudanca]'); const p = e.getAttribute('data-semana-palavra'); e.setAttribute('data-semana-palavra', p === 'subiu' ? 'desceu' : 'subiu'); }, /W2 · .*a palavra do lado/),
    planta('o valor de antes de outra entrada', (r) => { const v = r.querySelector('[data-semana-mudanca] [data-correcao-campo="old_value"]'); v.setAttribute('data-correcao-n', '99'); }, /W2 · .*o valor de antes/),
  ];
}

/* ------------------------------------------------------------------------- a corrida */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
  const prova = process.argv.includes('--prova');
  const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
  const aceites = diasAceites(DIST);
  const linhas = loadClaims();
  const w1 = provaNaCopiaPlantada(aceites[0]);
  /** @type {string[]} */
  const erros = [...w1.erros];
  for (const [lang, f] of PAGINAS_DA_SEMANA) {
    const abs = path.join(DIST, f);
    if (!fs.existsSync(abs)) { erros.push(`W2 · a página ${f} não foi construída`); continue; }
    erros.push(...conferirPaginaDaSemana(parse(fs.readFileSync(abs, 'utf8')), lang, aceites, linhas).map((x) => `${f}: ${x}`));
  }
  let portas = 0;
  for (const [lang, f] of /** @type {const} */ ([['pt', 'explicacoes/index.html'], ['en', 'en/explainers/index.html'], ['pt', 'index.html'], ['en', 'en/index.html']])) {
    const r = parse(fs.readFileSync(path.join(DIST, f), 'utf8'));
    const els = r.querySelectorAll('main [data-semana-frase]');
    if (!els.length) erros.push(`W3 · ${f} não tem a porta da semana`);
    for (const el of els) { portas++; erros.push(...conferirPortaDaSemana(el, lang, aceites, linhas).map((x) => `${f}: ${x}`)); }
  }
  const plantas = prova ? plantasDaPaginaDaSemana(DIST) : [];
  for (const p of plantas) if (!p.mordeu) erros.push(`W · a planta «${p.nome}» não mordeu: ${p.queixa}`);
  const s = semanaPelaCelula(linhas, aceites[0]);
  const resumo = { aceites, janela: s.janela, contagens: s.contagens, mudancas: s.mudancas.length, blocos_que_mudaram: blocosQueMudaramPelaCelula(s, linhas), w1: w1.plantas, portas, plantas: plantas.map((p) => ({ nome: p.nome, mordeu: p.mordeu })), erros };
  if (json) fs.writeFileSync(json, JSON.stringify(resumo, null, 2) + '\n');
  console.log(`W · a leitura da semana: janela ${s.janela.inicio} a ${s.janela.fim}, ${s.contagens.relidas} relidas, ${s.contagens.valor} mudadas de valor, ${s.contagens.proveniencia} de proveniência; W1 ${w1.plantas.filter((p) => p.mordeu).length} de ${w1.plantas.length} plantas na cópia do livro; ${portas} porta(s) da semana conferidas${prova ? `; ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas na página` : ''}.`);
  if (erros.length) {
    console.error(`\n  CÉLULA DA SEMANA · ${erros.length} problema(s):\n${erros.map((x) => `  · ${x}`).join('\n')}`);
    process.exit(1);
  }
}
