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
  'ao ano', 'ao mês', 'por cem mil habitantes', 'per hundred thousand inhabitants',
  'por mês', 'a month', 'per month', 'por ano', 'a year', 'per year',
  'por dia', 'a day', 'por metro quadrado', 'per square metre',
  'por habitante', 'per inhabitant', 'por mil habitantes', 'per thousand inhabitants',
].sort((a,b)=>b.length-a.length));
/** SEL1-J/K: nomes contados medidos no sítio, incluindo as duas elipses autorizadas. */
export const SUBSTANTIVOS_CONTADOS = Object.freeze([
  'correções publicadas', 'corrections published',
  'alojamentos vagos', 'alojamentos', 'vacant dwellings', 'dwellings', 'vagas', 'vacant',
  'designações de pelouro', 'designações', 'portfolio designations', 'designations',
  'mandatos', 'lugares', 'seats', 'votos', 'votes', 'empresas', 'enterprises', 'pessoas', 'people',
  'médicos em exercício', 'practising physicians', 'utentes elegíveis inscritos', 'utentes elegíveis',
  'eligible registered users', 'eligible users', 'marcos e metas', 'milestones and targets',
].sort((a,b)=>b.length-a.length));
export const MESES_DA_MEDIDA = Object.freeze([
  'janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro',
  'January','February','March','April','May','June','July','August','September','October','November','December',
]);
const espaco = String.raw`(?:\s|&nbsp;|&thinsp;|&#(?:160|8201|8239);|&#x(?:a0|2009|202f);)`;
/** @param {string} s */
const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replaceAll(' ',espaco+'+');
const formas = [...new Set([...UNIDADES_DA_MEDIDA,...SUBSTANTIVOS_CONTADOS,...COMPLEMENTOS_DA_MEDIDA,
  ...MESES_DA_MEDIDA,...MESES_DA_MEDIDA.slice(0,12).map(m=>'de '+m)])]
  .sort((a,b)=>b.length-a.length).map(unidade=>({unidade,re:new RegExp('^'+espaco+'*'+escapar(unidade)+'(?![\\p{L}\\p{N}_])','iu')}));
const nomes = SUBSTANTIVOS_CONTADOS.map(unidade=>({unidade,re:new RegExp('^'+espaco+'+'+escapar(unidade)+'(?![\\p{L}\\p{N}_])','iu')}));
const complementos = COMPLEMENTOS_DA_MEDIDA.map(unidade=>({unidade,re:new RegExp('^'+espaco+'+'+escapar(unidade)+'(?![\\p{L}\\p{N}_])','iu')}));
/** O parêntese faz parte da designação do produto. @param {string} antes @param {string} depois */
export function parentesesDaMedida(antes,depois) {
  return /(?:produto interno bruto|gross domestic product)$/iu.test(antes)
    ? new RegExp('^'+espaco+'+\\([^()<>]*\\)','u').exec(depois)?.[0]??null : null;
}
/** A referência temporal não é uma taxa. @param {string} texto @param {{unidade:string,re:RegExp}} forma */
function tempoRelativo(texto,forma) {
  if(!/^(?:a (?:year|month|day)|(?:por|ao) (?:ano|mês|dia))$/u.test(forma.unidade))return false;
  const inicio=forma.re.exec(texto);
  return !!inicio && new RegExp('^'+espaco+'+(?:earlier|ago|before|after|later|antes|depois|atrás)(?![\\p{L}])','iu').test(texto.slice(inicio[0].length));
}
/** A correspondência mais longa conserva todos os caracteres do nó original.
 * @param {string} texto
 * @returns {{unidade:string,texto:string}|null}
 */
export function unidadeDaMedida(texto) {
  const forma=formas.find(f=>f.re.test(texto)&&!tempoRelativo(texto,f));
  if(!forma)return null;
  const inicio=forma.re.exec(texto);
  if(!inicio)return null;
  let fim=inicio[0].length, unidade=forma.unidade;
  if(MESES_DA_MEDIDA.some(m=>unidade.toLowerCase()===m.toLowerCase()||unidade.toLowerCase()==='de '+m.toLowerCase())) {
    const ano=new RegExp('^'+espaco+'+(?:de'+espaco+'+)?[0-9]{4}(?![0-9])','iu').exec(texto.slice(fim));
    if(ano){fim+=ano[0].length;unidade+=ano[0].replace(/\s+/gu,' ');}
  }
  const nome=nomes.find(f=>f.re.test(texto.slice(fim)));
  if(nome){const trecho=nome.re.exec(texto.slice(fim));if(trecho){fim+=trecho[0].length;unidade+=' '+nome.unidade;}}
  for(;;) {
    const parenteses=parentesesDaMedida(unidade,texto.slice(fim));
    if(parenteses){fim+=parenteses.length;unidade+=parenteses.replace(/\s+/gu,' ');}
    const c=complementos.find(f=>f.re.test(texto.slice(fim))&&!tempoRelativo(texto.slice(fim),f));
    if(!c)break;
    const trecho=c.re.exec(texto.slice(fim));
    if(!trecho)break;
    fim+=trecho[0].length;unidade+=' '+c.unidade;
  }
  return {unidade,texto:texto.slice(0,fim)};
}
/** G/H: só taxas desconhecidas e a construção inglesa com uma unidade de tempo.
 * @param {string} texto @param {string} lang
 */
export function formaNovaDaMedida(texto,lang) {
  const normal=texto.replace(/\s+/gu,' ').trimStart();
  if(unidadeDaMedida(normal)||formas.some(f=>tempoRelativo(normal,f)))return null;
  return normal.match(/^(?:por|per)\s+[\p{L}][\p{L}\p{M}-]*/iu)?.[0]
    ?? (lang==='en'?normal.match(/^a (?:seconds?|minutes?|hours?|days?|weeks?|fortnights?|months?|quarters?|years?|decades?|centur(?:y|ies)|millenni(?:um|a))(?![\p{L}])/iu)?.[0]:null) ?? null;
}
