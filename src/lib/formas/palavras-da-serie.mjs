/** RP4: o título acessível usa o nome de NomeDaSerie e períodos por extenso.
 * As palavras vêm das cadeias da casa; nenhum valor de ponto entra no título. */
import { NOMES_DAS_SERIES } from '../../data/series-no-tempo.mjs';
import { getClaim } from '../ledger.mjs';
import { nomeDoCartao } from '../nomes.mjs';
import { dataDaCasa } from '../datas.mjs';
import { unidadeDoCartao } from '../../data/unidades-dos-cartoes.mjs';
import { t } from '../../i18n/strings.mjs';

/** @param {number} n @param {'pt'|'en'} lang @returns {string} */
export function numeroEmPalavras(n, lang) {
  const s = t(lang).livro.serieNoTempo;
  if (!Number.isInteger(n) || n < 0 || n > 9999) throw new Error('RP4: número fora da gramática dos períodos.');
  if (n < 20) return s.numeros[n];
  const juntar = (/** @type {string} */ a, /** @type {number} */ resto, separador = s.uneNumero) => a + (resto ? separador + numeroEmPalavras(resto, lang) : '');
  if (n < 100) return juntar(s.dezenas[Math.floor(n / 10)], n % 10, s.uneDezena);
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
  const ano = anoEmPalavras(Number(periodo.slice(0, 4)), lang);
  if (/-[TS]/.test(periodo)) {
    const n = Number(periodo.slice(6)) - 1;
    const nome = (periodo.includes('-T') ? s.trimestres : s.semestres)[n];
    return s.periodoPorExtenso.replace('{periodo}', nome.toLowerCase()).replace('{ano}', ano);
  }
  return dataDaCasa(periodo, lang).replace(/\d{4}/, ano);
}

/** Os anos ingleses usam pares, salvo o começo do milénio.
 * @param {number} ano @param {'pt'|'en'} lang
 */
export function anoEmPalavras(ano, lang) {
  if (!Number.isInteger(ano) || ano < 1000 || ano > 9999) throw new Error('RP4: ano fora da gramática.');
  if (lang === 'pt' || (ano >= 2000 && ano <= 2009)) return numeroEmPalavras(ano, lang);
  const s = t(lang).livro.serieNoTempo;
  const fim = ano % 100;
  return numeroEmPalavras(Math.floor(ano / 100), lang) + s.uneAno + (fim === 0 ? s.anoCem : (fim < 10 ? s.anoZero + s.uneAno : '') + numeroEmPalavras(fim, lang));
}

/** @param {string} id @param {'pt'|'en'} lang */
export function nomeDaSerie(id, lang) {
  const declarado = NOMES_DAS_SERIES[id];
  if (!declarado) throw new Error(`RP4: a série ${id} não tem nome declarado.`);
  const nome = 'linha' in declarado ? nomeDoCartao(getClaim(declarado.linha), lang)?.texto : declarado.nome[lang];
  if (!nome) throw new Error(`RP4: a série ${id} não resolve o nome.`);
  return nome;
}

/** @param {{id: string, primeiro: string, ultimo: string}[]} linhas @param {'pt'|'en'} lang @param {boolean} [semNome] */
export function tituloDaSerie(linhas, lang, semNome = false) {
  const s = t(lang).livro.serieNoTempo;
  return linhas.map(l => {
    const intervalo = (/-[TS]/.test(l.primeiro) ? s.intervaloOrdinal : s.intervalo)
      .replace('{primeiro}', periodoEmPalavras(l.primeiro, lang)).replace('{ultimo}', periodoEmPalavras(l.ultimo, lang));
    if (!semNome) return s.grafico.replace('{nome}', nomeDaSerie(l.id, lang)).replace('{intervalo}', intervalo);
    const declarado = NOMES_DAS_SERIES[l.id];
    const unidade = declarado && 'linha' in declarado ? unidadeDoCartao(declarado.linha, lang) : null;
    if (!unidade || unidade.some(p => typeof p !== 'string')) throw new Error('RP4: título sem nome exige unidade declarada em palavras.');
    return s.graficoSemNome.replace('{intervalo}', intervalo).replace('{unidade}', unidade.join(''));
  }).join('; ');
}

/** @param {{id: string, base: string, motivo: 'ausente'|'nula'}[]} excluidas @param {'pt'|'en'} lang */
export function legendasDasExclusoes(excluidas, lang) {
  const s = t(lang).livro.serieNoTempo;
  return excluidas.map(l => ({id:l.id, texto:(l.motivo === 'ausente' ? s.excluidaSemBase : s.excluidaBaseNula)
    .replace('{nome}', nomeDaSerie(l.id, lang)).replace('{periodo}', periodoEmPalavras(l.base, lang))}));
}
