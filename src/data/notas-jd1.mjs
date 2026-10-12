/** JD1-c: estado da observação e ressalva da comparação pertencem à linha. */
import { ORIGENS_JD1 } from './origens-jd1.mjs';
import { getClaim } from '../lib/ledger.mjs';
import { reguaDaMedida } from '../lib/enquadramento.mjs';

export const NOTAS_JD1 = {
  final: {
    pt: ' O valor é final, como a fonte o publica na notificação de setembro de dois mil e vinte e seis.',
    en: ' The value is final, as published in the September two thousand and twenty-six notification.',
    apoios: [['jd1-ine-provisorio', 'Os dados de 2024 têm agora uma natureza final'], ['jd1-ine-ambito', 'Setembro de 2026']],
  },
  provisorio: {
    pt: ' O valor de dois mil e vinte e cinco é provisório, como a fonte o publica na notificação de setembro de dois mil e vinte e seis.',
    en: ' The value for two thousand and twenty-five is provisional, as published in the September two thousand and twenty-six notification.',
    apoios: [['jd1-ine-provisorio', 'os relativos a 2025 são provisórios4.'], ['jd1-ine-ambito', 'Setembro de 2026']],
  },
  versoes: {
    pt: ' A comparação de dois mil e vinte e cinco usa a notificação portuguesa de setembro e as contas da União atualizadas pelo Eurostat em julho; as versões das contas são diferentes.',
    en: ' The comparison for two thousand and twenty-five uses the Portuguese September notification and the Union accounts updated by Eurostat in July; these are different versions of the accounts.',
    apoios: [['jd1-ine-ambito', 'Setembro de 2026'], ['jd1-eurostat-versao', '"updated":"2026-07-21T11:00:00+0200"']],
  },
};

/** @param {string} id @returns {('final'|'provisorio'|'versoes')[]} */
export function notasDaLinhaJd1(id) {
  /** @type {('final'|'provisorio'|'versoes')[]} */
  const notas = [];
  if (/^(juros-das-administracoes-publicas(?:-pib)?|pib-nominal-notificacao-setembro)-202[45]$/.test(id)) {
    const ano = getClaim(id).reference_date;
    if (ano !== id.slice(-4)) throw new Error('JD1-c: período do estado da observação divergente');
    notas.push(ano === '2024' ? 'final' : 'provisorio');
  }
  if (['juros-das-administracoes-publicas-pib-2025', 'juros-das-administracoes-publicas-2025-ue'].includes(id)) {
    const r = reguaDaMedida(id);
    const outro = r.ue?.id ?? r.portugal?.id;
    if (outro && getClaim(outro).reference_date === getClaim(id).reference_date) notas.push('versoes');
  }
  return notas;
}

/** @param {string} id @param {'pt'|'en'} lang */
export function palavrasDaLinhaJd1(id, lang) {
  return notasDaLinhaJd1(id).map(k => {
    for (const [origem, literal] of NOTAS_JD1[k].apoios) {
      if (!(/** @type {Record<string, any>} */ (ORIGENS_JD1))[origem]?.excerto.includes(literal)) throw new Error('JD1-c: nota sem apoio literal selado');
    }
    return NOTAS_JD1[k][lang];
  }).join('');
}
