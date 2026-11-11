import declaracoes from '../../ledger/fontes-anteriores.json' with { type: 'json' };
import { t } from '../i18n/strings.mjs';

/** @typedef {{linha: string, data_da_correcao: string, endereco_anterior: string, razao: string}} FonteAnterior */
/** @typedef {{date: string, path?: string, result?: string, by?: string}} Reconferencia */
/** @typedef {{id: string, source_url?: string | null, corrections?: {date: string}[], verifications?: Reconferencia[]}} Linha */

/** @type {FonteAnterior[]} */
export const fontesAnteriores = declaracoes;

/**
 * A declaração vive fora dos bytes protegidos pela travessia.
 * @param {Map<string, Linha>} linhas
 * @param {unknown} declaracoes
 */
export function conferirFontesAnteriores(linhas, declaracoes = fontesAnteriores) {
  if (!Array.isArray(declaracoes)) return ['fontes anteriores: a declaração tem de ser uma lista'];
  const erros = [];
  const vistas = new Set();
  for (const d of declaracoes) {
    if (!d || typeof d !== 'object' || ['linha', 'data_da_correcao', 'endereco_anterior', 'razao'].some(k => typeof d[k] !== 'string' || !d[k].trim())) {
      erros.push('fontes anteriores: entrada sem os quatro campos obrigatórios');
      continue;
    }
    const onde = `fontes anteriores/${d.linha}`;
    if (vistas.has(d.linha)) erros.push(`${onde}: linha repetida`);
    vistas.add(d.linha);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.data_da_correcao)) erros.push(`${onde}: data da correção inválida`);
    const linha = linhas.get(d.linha);
    if (!linha) {
      erros.push(`${onde}: linha inexistente`);
      continue;
    }
    if (!(linha.corrections ?? []).some(c => c.date === d.data_da_correcao)) erros.push(`${onde}: não há correção nessa data`);
    if (d.endereco_anterior === linha.source_url) erros.push(`${onde}: o endereço anterior é a fonte de hoje`);
    if (!(linha.verifications ?? []).some(v => v.path === d.endereco_anterior && v.date <= d.data_da_correcao)) {
      erros.push(`${onde}: não há reconferência desse endereço até à correção`);
    }
  }
  return erros;
}

/**
 * A página e a régua legível decidem a frase pela mesma declaração e data.
 * @param {Linha} linha
 * @param {Reconferencia} v
 * @param {'pt' | 'en'} lang
 * @param {FonteAnterior[]} declaracoes
 */
export function fraseDaReconferencia(linha, v, lang, declaracoes = fontesAnteriores) {
  const s = t(lang).livro.linha;
  if (v.result === 'inacessivel') return s.tentativaDeLeituraK;
  const anterior = declaracoes.some(d => d.linha === linha.id && d.endereco_anterior === v.path && v.date <= d.data_da_correcao);
  if (anterior) return s.ficheiroAnteriorRelidoK;
  return v.by === 'corredor-diario' ? s.ficheiroRelidoK : s.segundaLeituraK;
}
