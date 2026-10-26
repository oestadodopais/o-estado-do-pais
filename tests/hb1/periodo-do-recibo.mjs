/** Leitura independente do período que o recibo atribui à linha. */
export function periodoDoRecibo(valor, lang) {
  const s = String(valor ?? '');
  const partes = s.split('-');
  if (partes.length === 3 && /^\d{4}-\d{2}-\d{2}$/.test(s)) return partes.reverse().join('.');
  if (partes.length !== 2 || !/^\d{4}$/.test(partes[0])) return s;
  const [ano, periodo] = partes;
  const meses = lang === 'en'
    ? 'January February March April May June July August September October November December'.split(' ')
    : 'janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro'.split(' ');
  if (/^(0[1-9]|1[0-2])$/.test(periodo)) return `${meses[Number(periodo)-1]}${lang === 'en' ? ' ' : ' de '}${ano}`;
  if (/^T[1-4]$/.test(periodo)) return lang === 'en'
    ? `${['1st','2nd','3rd','4th'][Number(periodo[1])-1]} quarter of ${ano}`
    : `${periodo[1]}.º trimestre de ${ano}`;
  if (/^S[12]$/.test(periodo)) return lang === 'en'
    ? `${['1st','2nd'][Number(periodo[1])-1]} half of ${ano}`
    : `${periodo[1]}.º semestre de ${ano}`;
  return s;
}
