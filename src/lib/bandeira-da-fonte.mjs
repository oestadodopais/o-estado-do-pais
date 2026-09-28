/** A ressalva da observação acompanha o número em todas as superfícies HTML. */
/** @param {Record<string, any>} linha @param {string} lang */
export function notaDaBandeira(linha, lang) {
  if (linha.source_flag === 'e') return String(lang === 'en' ? linha.source_flag_note_en ?? '' : linha.source_flag_note ?? '');
  if (linha.source_flag === 'p' || (linha.source_flag === '&' && linha.source_flag_note === 'Dado provisório')) {
    return lang === 'en' ? 'provisional data' : 'dado provisório';
  }
  return '';
}
