/** SEL1: uma só lista, com a correspondência mais longa primeiro. */
const grandezasPt = ['mil', 'milhão', 'milhões', 'mil milhões'];
const grandezasEn = ['thousand', 'thousands', 'million', 'millions', 'billion', 'billions', 'thousand million'];
export const UNIDADES_DA_MEDIDA = Object.freeze([...new Set([
  ...grandezasPt.flatMap(g => [g, g + ' de euros']),
  ...grandezasEn.flatMap(g => [g, g + ' euros', g + ' of euros']),
  'mil euros', 'euros', 'euro', '€', '% do PIB', '% of GDP', '%',
  'pontos percentuais', 'ponto percentual', 'percentage points', 'percentage point',
  'pontos do PIB', 'points of GDP', 'p.p.', 'pontos', 'ponto', 'points', 'point',
  'vezes', 'vez', 'times', 'time',
  'dias', 'dia', 'semanas', 'semana', 'meses', 'mês', 'anos', 'ano', 'horas', 'hora',
  'days', 'day', 'weeks', 'week', 'months', 'month', 'years', 'year', 'hours', 'hour',
])].sort((a, b) => b.length - a.length));

/** SEL1-F/H: complementos e meses partilhados por quem rende e quem confere. */
export const COMPLEMENTOS_DA_MEDIDA = Object.freeze([
  'do produto interno bruto', 'of gross domestic product', 'do PIB', 'of GDP',
  'por mês', 'a month', 'per month', 'por ano', 'a year', 'per year',
  'por dia', 'a day', 'por metro quadrado', 'per square metre',
  'por habitante', 'per inhabitant', 'por mil habitantes', 'per thousand inhabitants',
].sort((a,b)=>b.length-a.length));
export const MESES_DA_MEDIDA = Object.freeze([
  'janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro',
  'January','February','March','April','May','June','July','August','September','October','November','December',
]);
const espaco = String.raw`(?:\s|&nbsp;|&thinsp;|&#(?:160|8201|8239);|&#x(?:a0|2009|202f);)`;
/** @param {string} s */
const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replaceAll(' ',espaco+'+');
const formas = [...new Set([...UNIDADES_DA_MEDIDA,...COMPLEMENTOS_DA_MEDIDA,
  ...MESES_DA_MEDIDA,...MESES_DA_MEDIDA.slice(0,12).map(m=>'de '+m)])]
  .sort((a,b)=>b.length-a.length).map(unidade=>({unidade,re:new RegExp('^'+espaco+'*'+escapar(unidade)+'(?![\\p{L}\\p{N}_])','iu')}));
const complementos = COMPLEMENTOS_DA_MEDIDA.map(unidade=>({unidade,re:new RegExp('^'+espaco+'+'+escapar(unidade)+'(?![\\p{L}\\p{N}_])','iu')}));
/** A correspondência mais longa conserva todos os caracteres do nó original.
 * @param {string} texto
 * @returns {{unidade:string,texto:string}|null}
 */
export function unidadeDaMedida(texto) {
  const forma=formas.find(f=>f.re.test(texto));
  if(!forma)return null;
  let fim=forma.re.exec(texto)[0].length, unidade=forma.unidade;
  if(MESES_DA_MEDIDA.some(m=>unidade.toLowerCase()===m.toLowerCase()||unidade.toLowerCase()==='de '+m.toLowerCase())) {
    const ano=new RegExp('^'+espaco+'+(?:de'+espaco+'+)?[0-9]{4}(?![0-9])','iu').exec(texto.slice(fim));
    if(ano){fim+=ano[0].length;unidade+=ano[0].replace(/\s+/gu,' ');}
  }
  for(;;) {
    if(/produto interno bruto$/iu.test(unidade)) {
      const parenteses=new RegExp('^'+espaco+'+\\([^()<>]*\\)','u').exec(texto.slice(fim));
      if(parenteses){fim+=parenteses[0].length;unidade+=parenteses[0].replace(/\s+/gu,' ');}
    }
    const c=complementos.find(f=>f.re.test(texto.slice(fim)));
    if(!c)break;
    fim+=c.re.exec(texto.slice(fim))[0].length;unidade+=' '+c.unidade;
  }
  return {unidade,texto:texto.slice(0,fim)};
}
/** G/H: só taxas desconhecidas e a construção inglesa com uma unidade de tempo.
 * @param {string} texto @param {string} lang
 */
export function formaNovaDaMedida(texto,lang) {
  const normal=texto.replace(/\s+/gu,' ').trimStart();
  if(unidadeDaMedida(normal))return null;
  return normal.match(/^(?:por|per)\s+[\p{L}][\p{L}\p{M}-]*/iu)?.[0]
    ?? (lang==='en'?normal.match(/^a (?:seconds?|minutes?|hours?|days?|weeks?|fortnights?|months?|quarters?|years?|decades?|centur(?:y|ies)|millenni(?:um|a))(?![\p{L}])/iu)?.[0]:null) ?? null;
}
