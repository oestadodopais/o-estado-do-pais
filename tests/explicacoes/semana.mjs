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
 *     plantas; e, numa quarta cópia sem entrada nenhuma dentro da janela, as duas contas dão zero nas três contagens e
 *     a primeira frase do resolvedor é, nas duas edições, a desta célula, com as palavras de nada relido e nada mudado
 *     (o §5, decisão 2, do brief: uma semana sem releituras diz-se, com a contagem a zero);
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
 *
 * EX1-c (06.10.2026, os achados 5 e 14 da leitura a frio): UMA MUDANÇA DE VALOR É UMA MUDANÇA DO NÚMERO. Uma linha em
 * que só o literal mudou (o mesmo número, escrito de outra maneira) conta-se à parte, tem a sua lista e a sua planta na
 * cópia do livro; e uma marca das frases compostas só sai do inventário sobre um elemento que esta célula compara
 * (a primeira frase, uma entrada, um título de secção, a frase de «nenhuma» ou de «mudaram», e cada frase da primeira
 * página que a página cita, comparada com a frase que a primeira página rende).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { MEDIDA_REUNIDA } from '../../src/lib/pais.mjs';
import { BLOCOS_DA_PRIMEIRA_PAGINA } from '../../src/data/primeira-pagina.mjs';
import { limiarDaLinha, nomeNaLista } from '../../src/lib/primeira-pagina.mjs';
import { leituraDaSemana, primeiraFraseDaSemana, nomeNaSemana } from '../../src/lib/leitura-da-semana.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { milharesDaCasa } from '../../src/lib/formato.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { unidadeDaLinha } from '../../src/i18n/unidades.mjs';
import { plantasDoInventarioDaSemana } from './inventario.mjs';
import { conferirOQueENasMudancas, marcaOQueEComparada, plantasDoOQueE, plantasDoSeloDaDefinicao } from './o-que-e.mjs';

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
  /** @type {{ linha: string, antes: { n: number, valor: string }, depois: { n: number, valor: string, data: string } }[]} */
  const formas = [];
  for (const [id, l] of linhas) {
    if (!l || l.study === ESTUDO_DO_PROJETO || Object.hasOwn(MEDIDA_REUNIDA, id)) continue;
    if ((l.verifications ?? []).some((/** @type {any} */ v) => dentro(v?.date))) relidas += 1;
    const doDia = (l.corrections ?? []).map((/** @type {any} */ c, /** @type {number} */ n) => ({ c, n })).filter((/** @type {any} */ x) => dentro(x.c?.date));
    if (doDia.some((/** @type {any} */ x) => x.c.kind === 'proveniencia')) proveniencia += 1;
    const deValor = doDia.filter((/** @type {any} */ x) => x.c.kind === 'correcao' || x.c.kind === 'atualizacao').sort((/** @type {any} */ a, /** @type {any} */ b) => a.c.date.localeCompare(b.c.date) || a.n - b.n);
    if (!deValor.length) continue;
    const p = deValor[0], u = deValor[deValor.length - 1];
    const a = numero(p.c.old_value), b = numero(u.c.new_value);
    const pontas = { linha: id, antes: { n: p.n, valor: String(p.c.old_value) }, depois: { n: u.n, valor: String(u.c.new_value), data: u.c.date } };
    /* O mesmo número: uma mudança só do literal, ou nenhuma (EX1-c). */
    if (a !== null && b !== null && a === b) {
      if (String(p.c.old_value) !== String(u.c.new_value)) formas.push(pontas);
      continue;
    }
    mudancas.push({ ...pontas, palavra: a === null || b === null ? 'sem-numero' : b > a ? 'subiu' : 'desceu' });
  }
  mudancas.sort((x, y) => y.depois.data.localeCompare(x.depois.data) || x.linha.localeCompare(y.linha));
  formas.sort((x, y) => y.depois.data.localeCompare(x.depois.data) || x.linha.localeCompare(y.linha));
  return { janela: { inicio, fim }, contagens: { relidas, valor: mudancas.length, forma: formas.length, proveniencia }, mudancas, formas };
}

/**
 * A PRIMEIRA FRASE, pela composição desta célula, com as cadeias da casa.
 * @param {{ janela: { inicio: string, fim: string }, contagens: { relidas: number, valor: number, forma?: number, proveniencia: number } }} s
 * @param {'pt'|'en'} lang
 */
export function primeiraFrasePelaCelula(s, lang) {
  const c = t(lang).semana;
  const { relidas, valor, proveniencia } = s.contagens;
  const forma = /** @type {any} */ (s.contagens).forma ?? 0;
  let f = `${c.entre}${dataAqui(s.janela.inicio)}${c.e}${dataAqui(s.janela.fim)}${c.virgula}`;
  f += relidas === 0 ? c.nenhumRelido : `${milharesAqui(relidas)}${relidas === 1 ? c.umRelido : c.variosRelidos}`;
  if (valor === 0 && proveniencia === 0 && forma === 0) f += c.nenhumMudou;
  else {
    f += c.virgula + (valor === 0 ? c.nenhumDeValor : `${milharesAqui(valor)}${valor === 1 ? c.umDeValor : c.variosDeValor}`);
    if (forma > 0) f += `${c.virgula}${milharesAqui(forma)}${forma === 1 ? c.umDeForma : c.variosDeForma}`;
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
  if (JSON.stringify(r0.formas.map((m) => [m.linha, m.antes.valor, m.depois.valor])) !== JSON.stringify(c0.formas.map((m) => [m.linha, m.antes.valor, m.depois.valor]))) erros.push('W1 · no livro sem plantas, o resolvedor e esta célula discordam nas mudanças só da forma de escrever');
  const inicio = menosDias(fim, 6);
  /* As linhas das plantas: do âmbito, com valor numérico, sem entrada nenhuma na janela. */
  const livres = [...base].filter(([id, l]) => l && l.study !== ESTUDO_DO_PROJETO && !Object.hasOwn(MEDIDA_REUNIDA, id) && numero(l.value) !== null &&
    !(l.corrections ?? []).some((/** @type {any} */ c) => c?.date >= inicio && c?.date <= fim) && !(l.verifications ?? []).some((/** @type {any} */ v) => v?.date >= inicio && v?.date <= fim)).map(([id]) => id).sort();
  if (livres.length < 4) return { erros: [...erros, 'W1 · não há quatro linhas livres para as plantas'], plantas: [] };
  const [la, lb, lc, ld] = livres;
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
  {
    /* UMA ENTRADA SÓ DE LITERAL (EX1-c, o achado 5): o mesmo número escrito de outra maneira não muda o valor; conta-se
       à parte, como uma mudança só da forma de escrever, e não entra nas mudanças de valor. */
    const m = copia(); const l = m.get(ld);
    const outro = String(l.value).includes(',') ? `${l.value}0` : `${l.value},0`;
    l.corrections = [...(l.corrections ?? []), { date: fim, kind: 'atualizacao', old_value: l.value, new_value: outro, reason: 'planta', reason_en: 'plant' }];
    const r = doResolvedor(m), c = semanaPelaCelula(m, fim);
    const ok = r.contagens.valor === r0.contagens.valor && c.contagens.valor === c0.contagens.valor &&
      r.contagens.forma === r0.contagens.forma + 1 && c.contagens.forma === c0.contagens.forma + 1 &&
      r.formas.some((x) => x.linha === ld) && c.formas.some((x) => x.linha === ld) && !r.mudancas.some((x) => x.linha === ld) && !c.mudancas.some((x) => x.linha === ld);
    plantas.push({ nome: `uma entrada só de literal dentro da janela (${ld}, ${l.value} para ${outro})`, pediu: 'o mesmo número de mudanças de valor e mais uma só da forma de escrever', viu: `resolvedor ${r.contagens.valor} de valor e ${r.contagens.forma} de forma, célula ${c.contagens.valor} e ${c.contagens.forma}`, mordeu: ok });
  }
  {
    /* Uma semana sem entradas: a cópia tira de todas as linhas as correções e as releituras datadas dentro da janela. */
    const m = copia();
    for (const l of m.values()) {
      if (!l) continue;
      if (Array.isArray(l.corrections)) l.corrections = l.corrections.filter((/** @type {any} */ c) => !(c?.date >= inicio && c?.date <= fim));
      if (Array.isArray(l.verifications)) l.verifications = l.verifications.filter((/** @type {any} */ v) => !(v?.date >= inicio && v?.date <= fim));
    }
    const r = doResolvedor(m), c = semanaPelaCelula(m, fim);
    const zero = JSON.stringify({ relidas: 0, valor: 0, forma: 0, proveniencia: 0 });
    /** @type {string[]} */
    const frases = [];
    let iguais = true;
    for (const lang of /** @type {const} */ (['pt', 'en'])) {
      const cs = t(lang).semana;
      const doResolvedorTexto = normal(primeiraFraseDaSemana(r, cs, (iso) => dataDaCasa(iso, lang), (n) => milharesDaCasa(String(n))).map((/** @type {any} */ x) => (typeof x === 'string' ? x : x.texto)).join(''));
      const daCelula = primeiraFrasePelaCelula(c, lang);
      frases.push(`${lang}: «${doResolvedorTexto}»`);
      if (doResolvedorTexto !== daCelula || !daCelula.includes(normal(cs.nenhumRelido)) || !daCelula.includes(normal(cs.nenhumMudou).replace(/\.$/, ''))) iguais = false;
    }
    const ok = JSON.stringify(r.contagens) === zero && JSON.stringify(c.contagens) === zero && r.mudancas.length === 0 && c.mudancas.length === 0 && iguais;
    plantas.push({ nome: `uma semana sem entrada nenhuma dentro da janela (${inicio} a ${fim})`, pediu: 'zero nas três contagens, nenhuma mudança, e a mesma primeira frase com nada relido e nada mudado', viu: `resolvedor ${JSON.stringify(r.contagens)}, célula ${JSON.stringify(c.contagens)}; ${frases.join(' · ')}`, mordeu: ok });
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

/** O texto de um elemento sem os selos nem as marcas escondidas, para comparar frases. @param {any} el */
function textoSemSelosAqui(el) {
  const copia = parse(el.outerHTML);
  copia.querySelectorAll('.src-chip, .claim-provisorio-chip').forEach((/** @type {any} */ n) => n.remove());
  return normal(copia.textContent);
}

/**
 * UMA FRASE DA PRIMEIRA PÁGINA CITADA NA PÁGINA DA SEMANA (EX1-c, o achado 14): o título do bloco, os dois pontos e a
 * frase que a primeira página da mesma edição rende para esse bloco (ou a palavra de que saiu, quando o bloco já não se
 * rende lá), comparados carácter a carácter, sem os selos.
 * @param {any} li o elemento com `data-semana-bloco` @param {'pt'|'en'} lang @param {any} primeira a raiz da primeira página da edição
 */
export function conferirFraseDoBloco(li, lang, primeira) {
  const c = t(lang).semana;
  const id = li.getAttribute('data-semana-bloco');
  const b = /** @type {any} */ (BLOCOS_DA_PRIMEIRA_PAGINA.find((x) => x.id === id));
  if (!b) return [`W2 · a página cita a frase do bloco «${id}», que a primeira página não declara`];
  const naPrimeira = primeira?.querySelector(`[data-bloco="${id}"] [data-bloco-frase]`);
  const esperada = normal(`${b.titulo?.[lang] ?? ''}${c.doisPontos}${naPrimeira ? textoSemSelosAqui(naPrimeira) : c.saiuDaPrimeira}`);
  const rendida = textoSemSelosAqui(li);
  return rendida === esperada ? [] : [`W2 · a frase do bloco «${id}» na página da semana não é a que a primeira página rende.\n      esperada: ${esperada}\n      rendida:  ${rendida}`];
}

/** EX2: a frase inteira, com a unidade antes dos valores, composta das cadeias e dos campos. */
export function conferirResumoDaMudanca(e, x, lang, linhas) {
  const c=t(lang).semana, l=linhas.get(x.linha);
  const p=e.querySelector('[data-semana-resumo]');
  const nome=nomeNaSemana(x.linha,lang);
  const onde=nomeNaLista(x.linha,lang).qualificador === 'ue';
  const u=unidadeDaLinha(l.unit,lang);
  const esperado=normal(`${nome?.texto ?? ''}${onde ? c.virgula+t(lang).cartao.uniaoEuropeia : ''}${c.virgula}${dataDaCasa(String(l.reference_date),lang)}${c.virgula}${u.texto}${c.deAntes}${x.antes.valor}${c.para}${x.depois.valor}${c[x.palavra]}${c.em}${dataAqui(x.depois.data)}${c.ponto}`);
  const erros=[];
  if(!p || textoSemSelosAqui(p)!==esperado) erros.push(`W2 · ${x.linha}: a frase da mudança ou a unidade antes dos valores difere da composição declarada`);
  const unidades=p?.querySelectorAll('[data-linha-campo="unit"]') ?? [];
  if(unidades.length!==1 || unidades[0].getAttribute('data-linha-claim')!==x.linha || normal(unidades[0].textContent)!==normal(u.texto)) erros.push(`W2 · ${x.linha}: a unidade não é o campo da própria linha, uma vez`);
  return erros;
}

/**
 * W2 · a página da semana numa edição. Com `primeira` (a raiz da primeira página da mesma edição), cada frase da primeira
 * página que a página cita compara-se com a que a primeira página rende (EX1-c).
 * @param {any} root @param {'pt'|'en'} lang @param {string[]} aceites @param {Map<string, any>} [linhas] @param {any} [primeira]
 */
export function conferirPaginaDaSemana(root, lang, aceites, linhas = loadClaims(), primeira = null) {
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
  if(frase.parentNode?.lastChild!==frase && frase.parentNode?.children?.at(-1)!==frase) erros.push('W2 · a frase das contagens não fecha a página');
  const entradas = root.querySelectorAll('main [data-semana-mudancas] > [data-semana-mudanca]');
  if (JSON.stringify(entradas.map((e) => e.getAttribute('data-semana-mudanca'))) !== JSON.stringify(s.mudancas.map((x) => x.linha))) {
    erros.push(`W2 · as mudanças da página (${entradas.length}) não são, pela ordem, as que esta célula conta (${s.mudancas.length}): da mudança mais recente para a mais antiga`);
  }
  const PALAVRA = { subiu: c.subiu, desceu: c.desceu, naoMudou: c.naoMudou };
  for (const x of s.mudancas) {
    const e = entradas.find((y) => y.getAttribute('data-semana-mudanca') === x.linha);
    if (!e) continue;
    erros.push(...conferirResumoDaMudanca(e, x, lang, linhas));
    const marca = (/** @type {string} */ campo) => e.querySelector(`[data-correcao-campo="${campo}"]`);
    if (marca('old_value')?.getAttribute('data-correcao-n') !== String(x.antes.n) || normal(marca('old_value')?.textContent) !== normal(x.antes.valor)) erros.push(`W2 · ${x.linha}: o valor de antes não é o da primeira mudança da janela (${x.antes.valor}, entrada ${x.antes.n})`);
    if (marca('new_value')?.getAttribute('data-correcao-n') !== String(x.depois.n) || normal(marca('new_value')?.textContent) !== normal(x.depois.valor)) erros.push(`W2 · ${x.linha}: o valor de agora não é o da última mudança da janela (${x.depois.valor}, entrada ${x.depois.n})`);
    if (normal(marca('date')?.textContent) !== dataAqui(x.depois.data)) erros.push(`W2 · ${x.linha}: o dia não é o da última mudança (${dataAqui(x.depois.data)})`);
    const textoResumo = normal(e.querySelector('[data-semana-resumo]')?.textContent);
    const palavra = PALAVRA[/** @type {'subiu'|'desceu'|'naoMudou'} */ (x.palavra)];
    if (e.getAttribute('data-semana-palavra') !== x.palavra || !palavra || !textoResumo.includes(normal(palavra))) erros.push(`W2 · ${x.linha}: a palavra do lado não é a da conta («${x.palavra}»)`);
    for (const [k, w] of Object.entries(PALAVRA)) if (k !== x.palavra && textoResumo.includes(normal(w).replace(/^,\s*/, ', '))) erros.push(`W2 · ${x.linha}: a entrada traz a palavra de um ramo que a conta não escolheu («${w}»)`);
  }
  /* AS QUE MUDARAM SÓ NA FORMA DE ESCREVER (EX1-c): pela ordem desta célula, cada uma com o literal de agora, o de antes
     e o dia, e as palavras que a dizem pelo que é. */
  const formas = root.querySelectorAll('main [data-semana-formas] [data-semana-forma]');
  if (JSON.stringify(formas.map((e) => e.getAttribute('data-semana-forma'))) !== JSON.stringify(s.formas.map((x) => x.linha))) {
    erros.push(`W2 · as mudanças só da forma de escrever da página (${formas.length}) não são, pela ordem, as que esta célula conta (${s.formas.length})`);
  }
  for (const x of s.formas) {
    const e = formas.find((y) => y.getAttribute('data-semana-forma') === x.linha);
    if (!e) continue;
    const marca = (/** @type {string} */ campo) => e.querySelector(`[data-correcao-campo="${campo}"]`);
    if (marca('new_value')?.getAttribute('data-correcao-n') !== String(x.depois.n) || normal(marca('new_value')?.textContent) !== normal(x.depois.valor)) erros.push(`W2 · ${x.linha}: o literal de agora não é o da última entrada da janela (${x.depois.valor}, entrada ${x.depois.n})`);
    if (marca('old_value')?.getAttribute('data-correcao-n') !== String(x.antes.n) || normal(marca('old_value')?.textContent) !== normal(x.antes.valor)) erros.push(`W2 · ${x.linha}: o literal de antes não é o da primeira entrada da janela (${x.antes.valor}, entrada ${x.antes.n})`);
    if (normal(marca('date')?.textContent) !== dataAqui(x.depois.data)) erros.push(`W2 · ${x.linha}: o dia não é o da última entrada (${dataAqui(x.depois.data)})`);
    const texto = normal(e.textContent);
    if (!texto.includes(normal(c.passouAEscrever).replace(/^:\s*/, ': ')) || !texto.includes(normal(c.ondeEscrevia).replace(/^,\s*/, ', '))) erros.push(`W2 · ${x.linha}: a entrada não diz a mudança pelo que é («${normal(c.passouAEscrever)}» e «${normal(c.ondeEscrevia)}»)`);
  }
  if (root.querySelectorAll('main [data-semana-mudanca] [data-semana-forma], main [data-semana-forma] [data-semana-mudanca]').length) erros.push('W2 · uma entrada de forma e uma de valor encaixadas uma na outra');
  /* Os títulos das secções: o das mudanças de valor e o da primeira página quando algum valor mudou, e o das formas
     quando alguma mudou; são as cadeias da casa. */
  const titulos = root.querySelectorAll('main [data-semana-seccao] > h2').map((h) => normal(h.textContent));
  const deveTitulos = [...(s.mudancas.length ? [normal(c.mudancasK)] : []), ...(s.formas.length ? [normal(c.formasK)] : []), ...(s.mudancas.length ? [normal(c.primeiraK)] : [])];
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
  /* Cada frase citada compara-se com a que a primeira página rende (EX1-c, o achado 14). */
  for (const li of root.querySelectorAll('main [data-semana-bloco]')) {
    if (!primeira) { erros.push('W2 · a página cita frases da primeira página, e esta célula não tem a primeira página da edição para as comparar'); break; }
    erros.push(...conferirFraseDoBloco(li, lang, primeira));
  }
  return erros;
}

/** O índice mantém a seleção própria; cada frase é conferida contra a última entrada do livro. */
export function conferirMudancasDoIndice(root, lang, linhas=loadClaims()) {
  const erros=[];
  for(const e of root.querySelectorAll('main [data-mudou-ambito="indice"] > [data-correcao-entrada]')) {
    const id=e.getAttribute('data-correcao-entrada'), l=linhas.get(id);
    const cs=(l?.corrections ?? []).map((c,n)=>({...c,n})).filter(c=>['correcao','atualizacao'].includes(c.kind)).sort((a,b)=>b.date.localeCompare(a.date)||b.n-a.n);
    const c=cs[0];
    if(!c) {erros.push(`W2 · ${id}: o índice mostra uma mudança sem entrada no livro`);continue;}
    const a=numero(c.old_value), b=numero(c.new_value);
    const x={linha:id,antes:{n:c.n,valor:String(c.old_value)},depois:{n:c.n,valor:String(c.new_value),data:c.date},palavra:b>a?'subiu':b<a?'desceu':'naoMudou'};
    erros.push(...conferirResumoDaMudanca(e,x,lang,linhas));
    if(e.getAttribute('data-semana-palavra')!==x.palavra) erros.push(`W2 · ${id}: a palavra do lado no índice não é a da conta`);
    for(const campo of ['old_value','new_value','date']) {
      const marca=e.querySelector(`[data-correcao-campo="${campo}"]`);
      if(marca?.getAttribute('data-correcao-n')!==String(c.n)||marca?.getAttribute('data-correcao-claim')!==id) erros.push(`W2 · ${id}: a marca de ${campo} no índice não é da última entrada da própria linha`);
    }
  }
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

/** A raiz da primeira página de uma edição, construída. @param {string} dist @param {'pt'|'en'} lang */
function primeiraDaEdicao(dist, lang) {
  const f = path.join(dist, lang === 'en' ? 'en/index.html' : 'index.html');
  return fs.existsSync(f) ? parse(fs.readFileSync(f, 'utf8')) : null;
}

/**
 * UMA MARCA DAS FRASES COMPOSTAS SÓ SAI DO INVENTÁRIO SOBRE UM ELEMENTO QUE ESTA CÉLULA COMPARA (EX1-c, o achado 14):
 * na página da semana, a primeira frase, uma entrada de valor ou de forma, o título de uma secção, a frase de «nenhuma»
 * ou de «mudaram» e cada frase citada da primeira página; fora dela, só a frase que é a porta.
 * @param {any} el @param {string|undefined} rota
 */
export function marcaComparada(el, rota) {
  if (marcaOQueEComparada(el, rota)) return true;
  if (['leituraDaSemana','indice'].includes(rota) && el.hasAttribute('data-semana-resumo')) {
    const entrada=el.parentNode;
    return el.rawTagName==='p' && entrada?.hasAttribute?.('data-semana-mudanca')===true && entrada.parentNode?.hasAttribute?.('data-semana-mudancas')===true && Boolean(el.closest('main')) && (rota!=='indice'||entrada.parentNode.getAttribute('data-mudou-ambito')==='indice');
  }
  if (rota !== 'leituraDaSemana') return el.hasAttribute('data-semana-frase');
  if (!el.closest('main')) return false;
  if (el.hasAttribute('data-semana-frase')) return true;
  if (el.hasAttribute('data-semana-forma')) return el.parentNode?.hasAttribute?.('data-semana-formas') === true;
  if (String(el.rawTagName).toLowerCase() === 'h2') return el.parentNode?.hasAttribute?.('data-semana-seccao') === true;
  if (el.hasAttribute('data-semana-primeira')) return ['nenhuma', 'mudaram'].includes(String(el.getAttribute('data-semana-primeira')));
  return el.hasAttribute('data-semana-bloco');
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
  erros.push(...conferirOQueENasMudancas(root, lang, rota, dist));
  if (rota === 'leituraDaSemana') erros.push(...conferirPaginaDaSemana(root, lang, aceites, linhas, primeiraDaEdicao(dist, lang)));
  else if(rota === 'indice') erros.push(...conferirMudancasDoIndice(root,lang,linhas));
  else for (const el of root.querySelectorAll('[data-semana-frase]')) erros.push(...conferirPortaDaSemana(el, lang, aceites, linhas));
  for (const el of root.querySelectorAll('[data-semana-declarado]')) {
    if (!marcaComparada(el, rota)) erros.push(`W · a marca das frases compostas da semana está num sítio que esta célula não confere (${rota}): <${String(el.rawTagName).toLowerCase()}> «${normal(el.textContent).slice(0, 60)}»`);
  }
  return erros;
}

/** As plantas de W2, em memória, sobre a página portuguesa. @param {string} dist */
export function plantasDaPaginaDaSemana(dist) {
  const linhas = loadClaims();
  const aceites = diasAceites(dist);
  const html = fs.readFileSync(path.join(dist, PAGINAS_DA_SEMANA[0][1]), 'utf8');
  const primeira = primeiraDaEdicao(dist, 'pt');
  const controlo = conferirPaginaDaSemana(parse(html), 'pt', aceites, linhas, primeira);
  /** @param {string} nome @param {(r: any) => void} estraga @param {RegExp} mordida */
  const planta = (nome, estraga, mordida) => {
    const r = parse(html);
    estraga(r);
    const q = conferirPaginaDaSemana(r, 'pt', aceites, linhas, primeira);
    return { nome, mensagem: mordida.source, mordeu: controlo.length === 0 && q.some((x) => mordida.test(x)), queixa: q.join(' | ') || 'nenhuma' };
  };
  const comFormas = parse(html).querySelector('main [data-semana-forma]') !== null;
  /* EX1-c (o achado 14): a frase de um bloco citado compara-se com a da primeira página. A planta escreve a entrada de um
     bloco com a frase que a primeira página rende (o controlo, que tem de passar) e com uma palavra trocada (que tem de
     ser recusada). */
  const blocoNaPrimeira = primeira?.querySelector('[data-bloco] [data-bloco-frase]');
  const idDoBloco = blocoNaPrimeira?.closest('[data-bloco]')?.getAttribute('data-bloco') ?? null;
  const tituloDoBloco = /** @type {any} */ (BLOCOS_DA_PRIMEIRA_PAGINA.find((x) => x.id === idDoBloco))?.titulo?.pt ?? '';
  const liDoBloco = (/** @type {string} */ frase) => parse(`<ul><li data-semana-bloco="${idDoBloco}" data-semana-declarado><span>${tituloDoBloco}</span>${t('pt').semana.doisPontos}${frase}</li></ul>`).querySelector('li');
  const fraseCerta = blocoNaPrimeira ? blocoNaPrimeira.innerHTML : '';
  const controloDoBloco = idDoBloco ? conferirFraseDoBloco(liDoBloco(fraseCerta), 'pt', primeira) : ['sem bloco'];
  /* A palavra trocada vai no texto visível, à cabeça da frase (uma troca dentro do HTML podia cair num atributo). */
  const trocada = `Ontem, ${fraseCerta}`;
  const qBloco = idDoBloco ? conferirFraseDoBloco(liDoBloco(trocada), 'pt', primeira) : [];
  /* E (o mesmo achado) uma marca das frases compostas num parágrafo que esta célula não compara. */
  const comMarcaSolta = parse(html);
  comMarcaSolta.querySelector('main').insertAdjacentHTML('beforeend', '<p data-semana-declarado>Uma frase que ninguém compara.</p>');
  const qMarca = conferirPalavrasDaSemanaNaPagina(comMarcaSolta, 'pt', 'leituraDaSemana', dist);
  /* A janela depende do dia da construção, e uma semana pode não ter mudança de valor nenhuma: então a planta da mudança a
     menos passa a uma mudança a mais, e as duas que estragam uma entrada não se aplicam (dizem-no, e a corrida não as
     conta como falhas); as três plantas da cópia do livro (W1) provam a leitura em qualquer semana. */
  const comEntradas = parse(html).querySelector('main [data-semana-mudanca]') !== null;
  /** @param {string} nome */
  const naoSeAplica = (nome) => ({ nome, mordeu: false, aplica: false, queixa: 'a semana não tem mudanças de valor: a planta não se aplica' });
  return [
    { nome: 'a frase de um bloco citado com uma palavra trocada', mordeu: controloDoBloco.length === 0 && qBloco.some((x) => /W2 · a frase do bloco/.test(x)), queixa: [...controloDoBloco, ...qBloco].join(' | ') || 'nenhuma' },
    { nome: 'uma marca das frases compostas num parágrafo que esta célula não compara', mordeu: qMarca.some((x) => /W · a marca das frases compostas da semana está num sítio que esta célula não confere/.test(x)), queixa: qMarca.join(' | ') || 'nenhuma' },
    comFormas
      ? planta('o literal de agora de uma mudança só da forma trocado', (r) => { const v = r.querySelector('[data-semana-forma] [data-correcao-campo="new_value"]'); v.set_content(`${v.textContent}9`); }, /W2 · .*o literal de agora/)
      : { nome: 'o literal de agora de uma mudança só da forma trocado', mordeu: false, aplica: false, queixa: 'a semana não tem mudanças só da forma de escrever: a planta não se aplica' },
    planta('uma contagem trocada', (r) => { const n = r.querySelector('[data-semana="relidas"]') ?? r.querySelector('[data-semana="fim"]'); n.set_content(n.getAttribute('data-semana') === 'relidas' ? String(Number(n.textContent.replace(/\D/g, '')) + 1) : '01.01.2000'); }, /W2 · a primeira frase/),
    /* O dia de fora é o anterior ao mais antigo dos aceites: uma construção carimbada na primeira meia hora do dia aceita
       também o dia anterior, e a planta tem de cair fora dos dois. */
    planta('a janela de outro dia', (r) => { const f = r.querySelector('[data-semana-frase]'); const fora = menosDias(aceites[aceites.length - 1], 1); f.setAttribute('data-semana-janela', `${menosDias(fora, 6)}/${fora}`); }, /W2 · a janela acaba/),
    comEntradas
      ? planta('uma mudança a menos', (r) => { r.querySelector('[data-semana-mudanca]').remove(); }, /W2 · as mudanças da página/)
      : planta('uma mudança a mais', (r) => { r.querySelector('main [data-semana-frase]').insertAdjacentHTML('afterend', '<ol data-semana-mudancas><li data-semana-mudanca="planta-w2" data-correcao-entrada="planta-w2"></li></ol>'); }, /W2 · as mudanças da página/),
    comEntradas
      ? planta('a unidade colada ao número', (r) => { const e=r.querySelector('[data-semana-mudanca]');const u=e.querySelector('[data-linha-campo="unit"]');const v=e.querySelector('[data-correcao-campo="new_value"]');u.remove();v.insertAdjacentHTML('afterend',u.outerHTML); }, /W2 · .*a frase da mudança ou a unidade antes dos valores/)
      : naoSeAplica('a unidade colada ao número'),
    comEntradas
      ? planta('a palavra do lado trocada', (r) => { const e = r.querySelector('[data-semana-mudanca]'); const p = e.getAttribute('data-semana-palavra'); e.setAttribute('data-semana-palavra', p === 'subiu' ? 'desceu' : 'subiu'); }, /W2 · .*a palavra do lado/)
      : naoSeAplica('a palavra do lado trocada'),
    comEntradas
      ? planta('o valor de antes de outra entrada', (r) => { const v = r.querySelector('[data-semana-mudanca] [data-correcao-campo="old_value"]'); v.setAttribute('data-correcao-n', '99'); }, /W2 · .*o valor de antes/)
      : naoSeAplica('o valor de antes de outra entrada'),
  ];
}

/** EX2-b: as mesmas plantas nas duas superfícies e edições, com controlo intacto. */
export function plantasDaPassagemB(dist) {
  const plantas=[];
  for(const [lang,f,rota] of [['pt','indice/index.html','indice'],['en','en/index/index.html','indice'],...PAGINAS_DA_SEMANA.map(([l,f])=>[l,f,'leituraDaSemana'])]) {
    const html=fs.readFileSync(path.join(dist,f),'utf8');
    const conferir=r=>conferirPalavrasDaSemanaNaPagina(r,lang,rota,dist);
    const raiz=parse(html), controlo=conferir(raiz);
    const casos=[
      ['a unidade colada ao número',r=>{const e=r.querySelector('[data-semana-mudanca]'),u=e.querySelector('[data-linha-campo="unit"]'),v=e.querySelector('[data-correcao-campo="new_value"]');u.remove();v.insertAdjacentHTML('afterend',u.outerHTML);},'a frase da mudança ou a unidade antes dos valores'],
      ['o qualificador da União Europeia retirado',r=>r.querySelector('[data-semana-mudanca="despesa-em-id-2024-ue"] .semana-onde').remove(),'a frase da mudança ou a unidade antes dos valores'],
      ['o nome da fonte em vez do nome da medida',r=>r.querySelector('[data-semana-mudanca] .semana-nome').set_content('Nominal unit labour cost per hour worked'),'a frase da mudança ou a unidade antes dos valores'],
      ['a palavra da revisão trocada por movimento da economia',r=>{const p=r.querySelector('[data-semana-resumo]');p.set_content(p.innerHTML.replace(t(lang).semana.subiu,lang==='pt'?', subiu':', rose'));},'a frase da mudança ou a unidade antes dos valores'],
      ['um resumo declarado fora da lista',r=>{const e=r.querySelector('[data-semana-mudanca]');r.querySelector('main').insertAdjacentHTML('beforeend',`<li data-semana-mudanca="${e.getAttribute('data-semana-mudanca')}">${e.querySelector('[data-semana-resumo]').outerHTML}</li>`);},'W · a marca das frases compostas da semana está num sítio que esta célula não confere'],
    ];
    if(rota==='leituraDaSemana') casos.push(
      ['as contagens à cabeça da página',r=>{const p=r.querySelector('main [data-semana-frase]');p.remove();r.querySelector('[data-semana-pagina] h1').insertAdjacentHTML('afterend',p.outerHTML);},'a frase das contagens não fecha a página'],
      ['a frase de nenhuma mudança da primeira página retirada',r=>r.querySelector('[data-semana-primeira="nenhuma"]')?.remove(),'nenhuma frase da primeira página mudou, e a página não o diz assim']);
    for(const [nome,estraga,mensagem] of casos) {
      const aplicavel=nome.startsWith('as contagens') || (nome.startsWith('a frase de nenhuma') ? raiz.querySelector('[data-semana-primeira="nenhuma"]') : nome.startsWith('o qualificador') ? raiz.querySelector('[data-semana-mudanca="despesa-em-id-2024-ue"] .semana-onde') : raiz.querySelector('[data-semana-mudanca]'));
      if(!aplicavel) {plantas.push({nome:`${nome}, ${rota}, ${lang}`,aplica:false,mordeu:false,mensagem,queixa:'a página construída não tem a entrada necessária; a planta não se aplica'});continue;}
      const r=parse(html);estraga(r);const q=conferir(r);
      plantas.push({nome:`${nome}, ${rota}, ${lang}`,mensagem,mordeu:!controlo.length&&q.some(x=>x.includes(mensagem)),queixa:q.join(' | ')});
    }
  }
  return plantas;
}

/* ------------------------------------------------------------------------- a corrida */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
  const prova = process.argv.includes('--prova');
  const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : process.env.OEDP_SEMANA_JSON ?? null;
  const aceites = diasAceites(DIST);
  const linhas = loadClaims();
  const w1 = provaNaCopiaPlantada(aceites[0]);
  /** @type {string[]} */
  const erros = [...w1.erros];
  for (const [lang, f] of PAGINAS_DA_SEMANA) {
    const abs = path.join(DIST, f);
    if (!fs.existsSync(abs)) { erros.push(`W2 · a página ${f} não foi construída`); continue; }
    erros.push(...conferirPaginaDaSemana(parse(fs.readFileSync(abs, 'utf8')), lang, aceites, linhas, primeiraDaEdicao(DIST, lang)).map((x) => `${f}: ${x}`));
  }
  let portas = 0;
  for (const [lang, f] of /** @type {const} */ ([['pt', 'explicacoes/index.html'], ['en', 'en/explainers/index.html'], ['pt', 'index.html'], ['en', 'en/index.html']])) {
    const r = parse(fs.readFileSync(path.join(DIST, f), 'utf8'));
    const els = r.querySelectorAll('main [data-semana-frase]');
    if (!els.length) erros.push(`W3 · ${f} não tem a porta da semana`);
    for (const el of els) { portas++; erros.push(...conferirPortaDaSemana(el, lang, aceites, linhas).map((x) => `${f}: ${x}`)); }
  }
  for (const [lang, f, rota] of [['pt','indice/index.html','indice'],['en','en/index/index.html','indice'],...PAGINAS_DA_SEMANA.map(([lang,f])=>[lang,f,'leituraDaSemana'])]) {
    erros.push(...conferirPalavrasDaSemanaNaPagina(parse(fs.readFileSync(path.join(DIST,f),'utf8')),lang,rota,DIST));
  }
  const plantas = prova ? [...plantasDaPaginaDaSemana(DIST), ...plantasDoOQueE(DIST), ...plantasDoSeloDaDefinicao(), ...plantasDaPassagemB(DIST), ...plantasDoInventarioDaSemana(DIST)] : [];
  for (const p of plantas) if (!p.mordeu && /** @type {any} */ (p).aplica !== false) erros.push(`W · a planta «${p.nome}» não mordeu: ${p.queixa}`);
  const s = semanaPelaCelula(linhas, aceites[0]);
  const resumo = { construcao: JSON.parse(fs.readFileSync(path.join(DIST,'version.json'),'utf8')).commit, aceites, janela: s.janela, contagens: s.contagens, mudancas: s.mudancas.length, formas: s.formas.map((x) => ({ linha: x.linha, antes: x.antes.valor, depois: x.depois.valor })), blocos_que_mudaram: blocosQueMudaramPelaCelula(s, linhas), w1: w1.plantas, portas, plantas: plantas.map((p) => ({ nome: p.nome, mordeu: p.mordeu, aplica: /** @type {any} */ (p).aplica !== false, mensagem: p.mensagem ?? null, queixa: p.queixa })), erros };
  if (json) fs.writeFileSync(json, JSON.stringify(resumo, null, 2) + '\n');
  console.log(`W · a leitura da semana: janela ${s.janela.inicio} a ${s.janela.fim}, ${s.contagens.relidas} relidas, ${s.contagens.valor} mudadas de valor, ${s.contagens.forma} só na forma de escrever, ${s.contagens.proveniencia} de proveniência; W1 ${w1.plantas.filter((p) => p.mordeu).length} de ${w1.plantas.length} plantas na cópia do livro; ${portas} porta(s) da semana conferidas${prova ? `; ${plantas.filter((p) => p.mordeu).length} de ${plantas.filter((p) => /** @type {any} */ (p).aplica !== false).length} plantas na página${plantas.some((p) => /** @type {any} */ (p).aplica === false) ? ` (${plantas.filter((p) => /** @type {any} */ (p).aplica === false).length} não se aplicam: a semana não tem mudanças de valor)` : ''}` : ''}.`);
  if (erros.length) {
    console.error(`\n  CÉLULA DA SEMANA · ${erros.length} problema(s):\n${erros.map((x) => `  · ${x}`).join('\n')}`);
    process.exit(1);
  }
}
