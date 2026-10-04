/** RP4: o título acessível usa o nome de NomeDaSerie e períodos por extenso.
 * As palavras vêm das cadeias da casa; nenhum valor de ponto entra no título. */
import { NOMES_DAS_SERIES } from '../../data/series-no-tempo.mjs';
import { getClaim } from '../ledger.mjs';
import { nomeDoCartao } from '../nomes.mjs';
import { dataDaCasa } from '../datas.mjs';
import { t } from '../../i18n/strings.mjs';

/** @param {number} n @param {'pt'|'en'} lang @returns {string} */
export function numeroEmPalavras(n, lang) {
  const s = t(lang).livro.serieNoTempo;
  if (!Number.isInteger(n) || n < 0 || n > 9999) throw new Error('RP4: número fora da gramática dos períodos.');
  if (n < 20) return s.numeros[n];
  const juntar = (/** @type {string} */ a, /** @type {number} */ resto, separador = s.uneNumero) => a + (resto ? separador + numeroEmPalavras(resto, lang) : '');
  if (n < 100) return juntar(s.dezenas[Math.floor(n / 10)], n % 10, lang === 'en' ? ' ' : s.uneNumero);
  if (n === 100) return s.cem;
  if (n < 1000) return juntar(s.centenas[Math.floor(n / 100)], n % 100);
  const milhar = Math.floor(n / 1000);
  const resto = n % 1000;
  const prefixo = lang === 'pt' && milhar === 1 ? s.mil : `${numeroEmPalavras(milhar, lang)} ${s.mil}`;
  return juntar(prefixo, resto, (resto < 100 || resto % 100 === 0) ? s.uneNumero : ' ');
}

/** @param {string} periodo @param {'pt'|'en'} lang */
export function periodoEmPalavras(periodo, lang) {
  const s = t(lang).livro.serieNoTempo;
  const ano = numeroEmPalavras(Number(periodo.slice(0, 4)), lang);
  if (/-[TS]/.test(periodo)) {
    const n = Number(periodo.slice(6)) - 1;
    const nome = (periodo.includes('-T') ? s.trimestres : s.semestres)[n];
    return s.periodoPorExtenso.replace('{periodo}', nome.toLowerCase()).replace('{ano}', ano);
  }
  return dataDaCasa(periodo, lang).replace(/\d{4}/, ano);
}

/** @param {{id: string, primeiro: string, ultimo: string}[]} linhas @param {'pt'|'en'} lang */
export function tituloDaSerie(linhas, lang) {
  return linhas.map((l) => {
    const declarado = NOMES_DAS_SERIES[l.id];
    if (!declarado) throw new Error(`RP4: a série ${l.id} não tem nome declarado.`);
    const nome = 'linha' in declarado ? nomeDoCartao(getClaim(declarado.linha), lang)?.texto : declarado.nome[lang];
    if (!nome) throw new Error(`RP4: a série ${l.id} não resolve o nome.`);
    return t(lang).livro.serieNoTempo.grafico.replace('{nome}', nome).replace('{primeiro}', periodoEmPalavras(l.primeiro, lang)).replace('{ultimo}', periodoEmPalavras(l.ultimo, lang));
  }).join('; ');
}
