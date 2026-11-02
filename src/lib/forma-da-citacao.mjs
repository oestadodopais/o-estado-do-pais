/** OG1-E: lista fechada exportada do motor; a rede não classifica. */
import marcadores from '../../ledger/marcadores-do-relato.json' with {type:'json'};
/** @param {string} s */
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const rede = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${marcadores.map(escape).join('|')})(?![\\p{L}\\p{N}_])`,'iu');
/** @param {Linha} row */
export function errosDaFormaDaLinha(row) {
  if (row.afirmacao !== true) return [];
  if (!['palavras','relato'].includes(String(row.forma_da_citacao))) return [`OG1-E ${row.id}: forma_da_citacao obrigatória: palavras ou relato`];
  const marca=String(row.excerpt??'').normalize('NFC').match(rede);
  return row.forma_da_citacao==='palavras' && marca ? [`OG1-E ${row.id}: palavras com marcador de relato: ${marca[0]}`] : [];
}
