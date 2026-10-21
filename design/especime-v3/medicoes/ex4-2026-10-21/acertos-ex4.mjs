/**
 * OS ACERTOS DO EX4 (21.10.2026): o texto português da declaração `dinheiro-do-estado-2027`, como o resolvedor o rende,
 * comparado frase a frase com o §2 do mandato EX4, copiado abaixo à letra com os tokens do mandato. Os tokens do mandato
 * rendem-se aqui por conta própria (o valor e o período lidos nos ficheiros do livro, o nome depois de « que vai para »,
 * o ramo de `compara` e a condição `primeiros` pelos números); uma frase do mandato que não esteja na página tem de ser
 * de um acerto `fora`, e uma frase da página que não esteja no mandato fecha o guião. Sai com 0 só sem diferenças por
 * declarar. Corre-se da raiz: `node design/especime-v3/medicoes/ex4-2026-10-21/acertos-ex4.mjs [--json <ficheiro>]`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { explicacaoResolvida, textoDosPedacosDaExplicacao } from '../../../../src/lib/explicacoes.mjs';
import { ACERTOS } from '../../../../src/data/explicacoes/dinheiro-do-estado-2027.mjs';
import { NOMES_PF1 } from '../../../../src/data/medidas-pf1.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const campo = (/** @type {string} */ id, /** @type {string} */ k) => {
  const t = fs.readFileSync(path.join(RAIZ, 'ledger', 'claims', `${id}.yml`), 'utf8');
  return new RegExp(`^${k}: "([^"]*)"`, 'm').exec(t)?.[1] ?? null;
};
const SIMBOLOS = {
  TOTAL27: 'oe-2027-despesa-total-mapa', TOTAL26: 'oe-2026-despesa-total-mapa', CONS27: 'oe-2027-despesa-total-consolidada-mapa',
  DIV27: 'oe-2027-despesa-subfuncao-01-7-mapa', SEMDIV27: 'oe-2027-despesa-sem-divida-mapa', SEMDIV26: 'oe-2026-despesa-sem-divida-mapa',
  VTOTAL: 'der-oe2027-despesa-total-mapa-variacao-pct', VSEM: 'der-oe2027-despesa-sem-divida-variacao-pct', ENTREGA: 'oe-2027-calendario-entrega',
  PROGRAMA_SAUDE: 'oe-2027-saude-despesa-total-consolidada-2027',
};
const id = (/** @type {string} */ s) => {
  s = s.trim();
  const m = /^(F27|F26|S27|E27|V)\('(\d{2})'\)$/.exec(s);
  if (m) return { F27: `oe-2027-cem-euros-funcao-${m[2]}-mapa`, F26: `oe-2026-cem-euros-funcao-${m[2]}-mapa`, S27: `oe-2027-cem-euros-funcao-${m[2]}-sem-divida-mapa`, E27: `oe-2027-despesa-funcao-${m[2]}-mapa`, V: `der-oe2027-funcao-${m[2]}-variacao-pct` }[m[1]];
  if (/^'.*'$/.test(s)) return s.slice(1, -1);
  const x = /** @type {any} */ (SIMBOLOS)[s];
  if (!x) throw new Error(`símbolo desconhecido: ${s}`);
  return x;
};
const familia = (/** @type {string} */ f) => ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((n) => id(`${f}('${n}')`));
const num = (/** @type {string} */ v) => Number(v.replace(/\s/g, '').replace('−', '-').replace(',', '.'));
const periodo = (/** @type {string} */ i) => {
  const p = campo(i, 'period') ?? campo(i, 'reference_date') ?? '';
  return /^\d{4}-\d{2}-\d{2}$/.test(p) ? p.split('-').reverse().join('.') : p;
};
const nome = (/** @type {string} */ i) => {
  const proprio = /** @type {any} */ (NOMES_PF1)[i]?.pt;
  return proprio ? proprio.slice(proprio.indexOf(' que vai para ') + ' que vai para '.length) : null;
};
/** Rende o texto do mandato, com os tokens dele. @param {string} t */
function rende(t) {
  t = t.replace(/\[se: primeiros (\S+\('\d{2}'\)) de (\w+)\(01\.\.10\): «([^»]*)»\]/g, (_, a, f, partes) => {
    const v = familia(f).map((x) => num(/** @type {string} */ (campo(x, 'value'))));
    const k = familia(f).indexOf(id(a));
    return v.every((x, j) => j === k || v[k] > x) ? partes : '';
  });
  t = t.replace(/\[compara: \[(\w+), (\w+)\], maior: '([^']*)', menor: '([^']*)', igual: '([^']*)'\]/g, (_, a, b, maior, menor, igual) => {
    const x = num(/** @type {string} */ (campo(id(a), 'value'))), y = num(/** @type {string} */ (campo(id(b), 'value')));
    return x > y ? maior : x < y ? menor : igual;
  });
  return t.replace(/\[(claim|periodo|nome): ([^\],]+(?:\('\d{2}'\))?)(?:, sufixo '([^']*)')?\]/g, (_, k, s, suf) => {
    const i = id(s);
    if (k === 'periodo') return periodo(i);
    if (k === 'nome') return nome(i) ?? `[sem nome: ${i}]`;
    return `${campo(i, 'value')}${suf ?? ''}`;
  });
}
/** O §2 do mandato, em português, frase a frase, à letra (os títulos das figuras incluídos), na revisão de 21.10.2026 às 16:3x (a correção EX4-b). */
const MANDATO = [
  ['titulo', "Para onde vai o dinheiro do Estado em [periodo: F27('01')], pela proposta de Orçamento"],
  ['abertura-1', "A proposta de Orçamento do Estado para [periodo: F27('01')], entregue ao Parlamento a [periodo: ENTREGA], traz, entre os seus mapas, o da classificação funcional das despesas da Administração Central."],
  ['abertura-2', "Esse mapa soma [claim: TOTAL27, sufixo ' euros'], e [claim: DIV27, sufixo ' euros'] desse total são a subfunção a que o mapa chama «operações relacionadas com a dívida pública»."],
  ['abertura-3', "Tirando essa subfunção, sobram [claim: SEMDIV27, sufixo ' euros']."],
  ['abertura-4', "De cada cem euros desses, [claim: S27('07')] vão para a [nome: S27('07')], [claim: S27('04')] para os [nome: S27('04')], [claim: S27('01')] para os [nome: S27('01')], [claim: S27('10')] para a [nome: S27('10')] e [claim: S27('09')] para a [nome: S27('09')]."],
  ['abertura-5', "[se: primeiros S27('07') de S27(01..10): «A maior fatia é a da [nome: S27('07')].»]"],
  ['secao-1', 'Por função, como o mapa a escreve'],
  ['figura-1', 'As dez funções, de cada cem euros da despesa total do mapa funcional da proposta (a Administração Central, não consolidada, com as operações relacionadas com a dívida pública)'],
  ['secao-1-1', "Lido como o mapa o escreve, [claim: F27('01')] de cada cem euros vão para os [nome: F27('01')], porque a subfunção das operações relacionadas com a dívida pública está dentro dessa função; a [nome: F27('07')] leva [claim: F27('07')], os [nome: F27('04')] [claim: F27('04')], a [nome: F27('10')] [claim: F27('10')] e a [nome: F27('09')] [claim: F27('09')]."],
  ['secao-1-2', "A [nome: F27('03')] leva [claim: F27('03')], a [nome: F27('02')] [claim: F27('02')], a [nome: F27('06')] [claim: F27('06')], a [nome: F27('05')] [claim: F27('05')] e o [nome: F27('08')] [claim: F27('08')]."],
  ['secao-2', 'Sem as operações relacionadas com a dívida pública'],
  ['figura-2', 'As dez funções, de cada cem euros da despesa do mapa sem a subfunção das operações relacionadas com a dívida pública (a conta deste projeto, declarada no recibo de cada linha)'],
  ['secao-2-1', 'Esta conta é deste projeto: a despesa total do mapa menos a subfunção das operações relacionadas com a dívida pública, e cada função a dividir por esse resto; o recibo de cada linha mostra a conta.'],
  ['secao-2-2', "A [nome: S27('03')] leva [claim: S27('03')] de cada cem euros, a [nome: S27('02')] [claim: S27('02')], a [nome: S27('06')] [claim: S27('06')], a [nome: S27('05')] [claim: S27('05')] e o [nome: S27('08')] [claim: S27('08')]."],
  ['secao-3', "O que muda da lei de [periodo: F26('01')] para a proposta de [periodo: F27('01')]"],
  ['secao-3-1', "A comparação certa é o mesmo mapa da Lei do Orçamento para [periodo: F26('01')]: o mesmo perímetro, a mesma unidade."],
  ['secao-3-2', "A despesa total do mapa passa de [claim: TOTAL26, sufixo ' euros'] para [claim: TOTAL27, sufixo ' euros'], uma variação de [claim: VTOTAL, sufixo ' %']; sem as operações relacionadas com a dívida pública, passa de [claim: SEMDIV26, sufixo ' euros'] para [claim: SEMDIV27, sufixo ' euros'], [claim: VSEM, sufixo ' %']."],
  ['secao-3-3', "Por função, em euros: os [nome: V('04')] variam [claim: V('04'), sufixo ' %'], a [nome: V('07')] [claim: V('07'), sufixo ' %'], a [nome: V('10')] [claim: V('10'), sufixo ' %'], a [nome: V('09')] [claim: V('09'), sufixo ' %'], a [nome: V('02')] [claim: V('02'), sufixo ' %'], a [nome: V('05')] [claim: V('05'), sufixo ' %'] e o [nome: V('08')] [claim: V('08'), sufixo ' %']."],
  ['secao-3-4', "[se: primeiros V('04') de V(01..10): «A função que mais cresce é a dos [nome: V('04')].»]"],
  ['secao-3-5', 'O que está dentro de cada função, medida a medida, lê-se no estudo do Orçamento.'],
  ['secao-4', 'A Saúde: a função e o programa'],
  ['secao-4-1', "A função [nome: F27('07')] do mapa, [claim: E27('07'), sufixo ' euros'], não é o programa Saúde do Orçamento, [claim: PROGRAMA_SAUDE, sufixo ' milhões de euros'] em [periodo: PROGRAMA_SAUDE]: o programa é consolidado e é um programa orçamental; a função é uma classificação da despesa, não consolidada, que conta as transferências entre serviços."],
  ['secao-4-2', 'As duas contas medem coisas diferentes, e nenhuma está errada.'],
  ['naoDiz-1', 'Esta explicação lê o mapa de uma proposta: o que o Parlamento aprovar pode ser diferente, e o que se gasta de facto lê-se depois, na execução.'],
  ['naoDiz-2', 'O mapa é só o subsetor da Administração Central: a Segurança Social, com as pensões, não está nele.'],
  ['naoDiz-3', "Os valores não são consolidados, contam as transferências entre serviços, e por isso a despesa total do mapa é maior do que a despesa total consolidada, [claim: CONS27, sufixo ' euros'] em [periodo: CONS27]."],
  ['naoDiz-4', 'A conta «sem as operações relacionadas com a dívida pública» é deste projeto, declarada no recibo de cada linha; o mapa só dá o nome a essa subfunção, e esta explicação não diz o que entra nela.'],
  ['naoDiz-5', "A base da explicação de [periodo: 'oe-2026-cem-euros-funcao-01'], a despesa efetiva consolidada por função dos dados abertos, ainda não existe para [periodo: F27('01')]; quando existir, esta explicação passa a essa base."],
].map(([k, t]) => ({ k, esperado: rende(t) })).filter((x) => x.esperado !== '');

/* A página, em português, como o resolvedor a rende: o título, as frases, os títulos das secções e os das figuras. */
const e = explicacaoResolvida('dinheiro-do-estado-2027', 'pt');
const frases = (/** @type {string} */ t) => t.split(/(?<=[.»])\s+(?=[A-ZÁÉÍÓÚÀ])/).map((x) => x.trim()).filter(Boolean);
const rendidas = [e.tituloTexto];
for (const p of e.abertura) rendidas.push(...frases(textoDosPedacosDaExplicacao(p.pedacos, 'pt')));
for (const s of e.seccoes) {
  rendidas.push(s.titulo);
  for (const b of s.blocos) rendidas.push(...(b.tipo === 'figura' ? [String(b.modelo.titulo)] : frases(textoDosPedacosDaExplicacao(b.pedacos, 'pt'))));
}
for (const p of e.naoDiz) rendidas.push(...frases(textoDosPedacosDaExplicacao(p.pedacos, 'pt')));

const fora = new Map(ACERTOS.filter((a) => a.tipo === 'fora').flatMap((a) => a.frases.map((f) => [f, a.id])));
const erros = [];
const linhas = [];
for (const m of MANDATO) {
  const aqui = rendidas.includes(m.esperado);
  if (fora.has(m.k)) {
    if (aqui) erros.push(`${m.k}: o acerto ${fora.get(m.k)} diz que a frase sai, e ela está na página`);
    linhas.push({ frase: m.k, estado: 'fora', acerto: fora.get(m.k) });
  } else if (aqui) linhas.push({ frase: m.k, estado: 'igual' });
  else erros.push(`${m.k}: a frase do mandato não está na página como está: «${m.esperado}»`);
}
for (const r of rendidas) if (!MANDATO.some((m) => m.esperado === r)) erros.push(`a página tem uma frase que o mandato não tem: «${r}»`);
for (const a of ACERTOS) if (!a.razao || !a.o_que) erros.push(`o acerto ${a.id} não tem razão`);
const resumo = { frases_do_mandato: MANDATO.length, frases_da_pagina: rendidas.length, iguais: linhas.filter((x) => x.estado === 'igual').length, fora: linhas.filter((x) => x.estado === 'fora').length, acertos: ACERTOS.map((a) => a.id), linhas, erros };
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(resumo, null, 2) + '\n');
console.log(`acertos EX4: ${resumo.frases_do_mandato} frases do mandato, ${resumo.iguais} iguais na página, ${resumo.fora} fora por acerto; ${resumo.frases_da_pagina} frases na página.`);
if (erros.length) { console.error(erros.map((x) => `  · ${x}`).join('\n')); process.exit(1); }
