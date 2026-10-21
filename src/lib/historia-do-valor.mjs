/** A história do número, distinta da história da sua proveniência. */
import {textoDocumentalConferido} from './prova-efeitos.mjs';
/** @param {Record<string, any>} linha */
export const entradasDoValor = (linha) => (Array.isArray(linha.corrections) ? linha.corrections : []).filter((c) => c && ['correcao', 'atualizacao'].includes(c.kind));
/** @param {Record<string, any>} c */
export const assinaturaDoValor = (c) => ({ date: c.date, kind: c.kind, old_value: c.old_value, new_value: c.new_value });

/** Normaliza só a forma da casa, sem arredondar nem passar por float.
 * @param {unknown} valor */
export function numeroDaCasa(valor) {
  if (typeof valor !== 'string' || !/^[−-]?\d+(?:[ \u00a0\u202f]\d{3})*(?:,\d+)?$/.test(valor)) return null;
  let s = valor.replace(/[ \u00a0\u202f]/g, '').replace('−', '-');
  let [inteiro, fracao = ''] = s.split(',');
  inteiro = inteiro.replace(/^(-?)0+(?=\d)/, '$1');
  fracao = fracao.replace(/0+$/, '');
  s = inteiro + (fracao ? ',' + fracao : '');
  return s === '-0' ? '0' : s;
}

/** Uma data completa é calendário, não uma quantidade que sobe ou desce.
 * @param {Record<string, any>} linha */
export function dataDeCalendarioConferida(linha) {
  if(linha.unit!=='data'||!/^(?:19|20)\d{2}-\d{2}-\d{2}$/.test(linha.reference_date??''))return false;
  const date=new Date(linha.reference_date+'T00:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==linha.reference_date)return false;
  const meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const esperado=date.getUTCDate()+' de '+meses[date.getUTCMonth()];
  return linha.value===esperado&&String(linha.excerpt).includes(esperado);
}

/** @param {Record<string, any>} linha @param {Array<Record<string, any>> | undefined} seladas
 * @param {string} onde @param {string[]} erros */
export function conferirHistoriaDoValor(linha, seladas, onde, erros) {
  const entradas = entradasDoValor(linha);
  // Uma afirmação textual tem história literal, sem passar pelo normalizador numérico.
  const textual = (linha.afirmacao === true && linha.unit === 'afirmação') || textoDocumentalConferido(linha);
  const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const data = linha.unit === 'data' && /^(?:19|20)\d{2}-\d{2}-\d{2}$/.test(linha.reference_date ?? '');
  const formaData = (/** @type {unknown} */ v) => {
    if(typeof v !== 'string') return null;
    const m=v.match(/^(\d{1,2})(?: de ([a-zç]+))?$/);
    return m && +m[1]>=1 && +m[1]<=31 && (!m[2] || meses.includes(m[2])) ? v : null;
  };
  const forma = data ? formaData : textual ? ((/** @type {unknown} */ v) => typeof v === 'string' && v.trim() ? v : null) : numeroDaCasa;
  if(data && entradas.length){
    if(!dataDeCalendarioConferida(linha)) erros.push(`${onde} história do valor: a data completa não coincide com a referência e o excerto.`);
  }
  if (linha.afirmacao === true && linha.unit === 'afirmação' && linha.value !== linha.excerpt) erros.push(`${onde} história do valor: a afirmação textual não coincide com o excerto.`);
  if (seladas && JSON.stringify(entradas.slice(0, seladas.length).map(assinaturaDoValor)) !== JSON.stringify(seladas)) {
    erros.push(`${onde} história do valor: uma entrada selada foi retirada ou alterada.`);
  }
  if (entradas.length !== (seladas?.length ?? 0)) {
    erros.push(`${onde} história do valor: a lista tem ${entradas.length} entradas e o registo sela ${seladas?.length ?? 0}.`);
  }
  let anterior = seladas?.[0]?.old_value ?? entradas[0]?.old_value;
  let dia = '';
  for (const c of entradas) {
    if (String(c.date) < dia) erros.push(`${onde} história do valor: as entradas não estão por ordem cronológica.`);
    dia = String(c.date);
    if (forma(c.old_value) === null || forma(c.new_value) === null) {
      erros.push(`${onde} história do valor: ${data ? 'a data tem de conservar uma forma de calendário' : textual ? 'as afirmações têm de conservar texto não vazio' : 'os valores escrevem-se na forma de número da casa'}.`);
    }
    if (forma(c.old_value) !== forma(anterior)) {
      erros.push(`${onde} história do valor: "old_value" é ${c.old_value}, mas antes vigorava ${anterior}.`);
    }
    anterior = c.new_value;
  }
  if (entradas.length && (forma(linha.value) === null || forma(linha.value) !== forma(anterior))) {
    erros.push(`${onde} história do valor: "value" é ${linha.value}, mas o último "new_value" é ${anterior}.`);
  }
}

/** No próprio dia, o livro já usa o valor novo; antes dele, o valor anterior.
 * @param {Record<string, any>} linha @param {string} dia */
export function valorEm(linha, dia) {
  const entradas = entradasDoValor(linha);
  let valor = entradas[0]?.old_value ?? linha.value;
  for (const c of entradas) if (c.date <= dia) valor = c.new_value;
  return valor;
}
