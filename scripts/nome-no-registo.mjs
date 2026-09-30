/** E0b: só o nome da própria linha, na sua entrada do registo das mudanças. */
export function nomeNoRegistoAdmitido(rota, el, id, campo) {
  return rota === 'correcoes' && ['name', 'document.title'].includes(campo) &&
    el.matches('.registo-mudanca-nome') && el.closest('[data-mudou-registo]') !== null &&
    el.closest('[data-correcao-entrada]')?.getAttribute('data-correcao-entrada') === id;
}
