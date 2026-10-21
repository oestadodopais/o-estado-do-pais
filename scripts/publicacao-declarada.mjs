/** Régua independente do resolvedor da vista. */
export function conferirDataDeclarada(work, edition, entrada) {
  if (work?.publication !== 'declared' || edition?.date === null) return [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(edition?.date ?? '') || !entrada || edition.date < entrada || !diaValido(edition.date))
    return ['data declarada anterior ao commit de entrada ou inválida'];
  return [];
}

function diaValido(iso) {
 const [ano,mes,dia]=iso.split('-').map(Number);
 const dias=mes===2?(ano%4===0&&(ano%100!==0||ano%400===0)?29:28):[4,6,9,11].includes(mes)?30:31;
 return mes>=1&&mes<=12&&dia>=1&&dia<=dias;
}
