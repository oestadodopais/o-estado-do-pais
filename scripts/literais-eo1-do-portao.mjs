/** Prova independente do literal completo e das datas que a edição inglesa traduz. */
const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export function dataLiteralEo1(texto, lang) {
  if (lang !== 'en') return texto;
  return texto.replace(/\b(\d{1,2})(?: (e|a) (\d{1,2}))? de (janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?: de (\d{4}))?\b/g,
    (_, dia, ligacao, fim, mes, ano) => `${dia}${fim ? ` ${ligacao === 'e' ? 'and' : 'to'} ${fim}` : ''} ${months[meses.indexOf(mes)]}${ano ? ` ${ano}` : ''}`);
}
export function literalInteiroEo1(fonte, literal) {
  const escapado = String(literal).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if (!escapado) return false;
  return new RegExp(`(?:^|[\\s\\p{P}])${escapado}(?=$|[\\s\\p{P}])`, 'u').test(String(fonte ?? ''));
}
export function apoioLiteralEo1(linha, campo, literal) {
  if (campo !== 'published_at') {
    if (literalInteiroEo1(linha?.[campo], literal)) return true;
    // A data no localizador ISO mantém dia, mês e ano completos.
    if (!['locator','excerpt'].includes(campo)) return false;
    const pedido=/^(\d{1,2}) de ([a-zç]+)(?: de (\d{4}))?$/.exec(literal);
    if (!pedido || !meses.includes(pedido[2])) return false;
    return [...String(linha?.[campo]??'').matchAll(/(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/g)].some(data =>
      Number(pedido[1])===Number(data[3]) && meses.indexOf(pedido[2])+1===Number(data[2]) && (!pedido[3] || pedido[3]===data[1]));
  }
  const data = /^(\d{4})-(\d{2})-(\d{2})$/.exec(linha?.published_at ?? '');
  if (!data) return false;
  const curto = `${Number(data[3])} de ${meses[Number(data[2])-1]}`;
  return literal === curto || literal === `${curto} de ${data[1]}`;
}
export function retirarAnosIsoladosEo1(texto) {
  return texto.replace(/(?<![\p{L}\p{N}\p{M}_.,/+−-])(?:19|20)\d\d(?![\p{L}\p{N}\p{M}_/]|[.,]\d|\.[ºª]|\s*(?:[%€$]|euros?\b|milh(?:ão|ões)\b|millions?\b|pontos?\b|points?\b))/gu, '');
}
