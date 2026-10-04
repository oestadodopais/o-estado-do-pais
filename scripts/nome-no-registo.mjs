/** E0b: só o nome da própria linha, na sua entrada do registo das mudanças.
 * R3 (04.10.2026): e na sua entrada da lista «O que mudou» do índice, que tem a forma das listas dos
 * lugares; a mesma porta estreita, só nessa lista e só com o nome da própria linha. */
export function nomeNoRegistoAdmitido(rota, el, id, campo) {
  const daPropriaLinha = el.closest('[data-correcao-entrada]')?.getAttribute('data-correcao-entrada') === id;
  if (!['name', 'document.title'].includes(campo) || !daPropriaLinha) return false;
  if (rota === 'correcoes') return el.matches('.registo-mudanca-nome') && el.closest('[data-mudou-registo]') !== null;
  if (rota === 'indice') return el.matches('.lugar-mudou-nome') && el.closest('[data-mudou-ambito="indice"]') !== null;
  return false;
}
