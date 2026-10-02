/**
 * B2: valor e unidade juntos, selo depois do período. A vizinhança admitida
 * é esta forma exata, nunca um selo encontrado numa secção mais acima.
 * O portão chama esta função e a planta exerce a mesma função.
 *
 * A UNIDADE É O CAMPO `unit` DA MESMA LINHA, OU A UNIDADE DA CASA DA MESMA LINHA
 * (passagem K2-c, 02.10.2026): onde a definição declarada traz uma unidade, o
 * cartão mostra-a (`data-unidade-da-casa`), e o portão confere o texto contra a
 * declaração. Uma marca só, da mesma linha, depois do valor: uma unidade da casa
 * de outra linha recusa-se como recusava uma unidade de outra linha.
 */
export function seloDoValorDoCartao(el, id, alvo) {
  const grupo = el.parentNode;
  const linha = grupo?.parentNode;
  const cartao = linha?.parentNode;
  if (!grupo?.classList?.contains('cartao-medida-quantidade') ||
      !linha?.classList?.contains('cartao-medida-valor') ||
      String(linha.rawTagName).toLowerCase() !== 'p' ||
      !(cartao?.getAttribute('data-cartao-medida') === id ||
        cartao?.getAttribute('data-linha-sem-nome') === id)) return false;
  const valores = linha.querySelectorAll('[data-claim]');
  const unidades = grupo.querySelectorAll('[data-linha-campo="unit"], [data-unidade-da-casa]');
  const selos = linha.querySelectorAll('.src-chip');
  const periodo = linha.querySelector('.cartao-medida-periodo');
  return valores.length === 1 && valores[0] === el && unidades.length === 1 &&
    (unidades[0].getAttribute('data-linha-claim') === id || unidades[0].getAttribute('data-unidade-da-casa') === id) &&
    unidades[0].parentNode === grupo && grupo.childNodes.indexOf(el) < grupo.childNodes.indexOf(unidades[0]) &&
    selos.length === 1 && selos[0].parentNode === linha &&
    linha.childNodes.indexOf(grupo) < linha.childNodes.indexOf(selos[0]) &&
    (!periodo || linha.childNodes.indexOf(periodo) < linha.childNodes.indexOf(selos[0])) &&
    String(selos[0].rawTagName).toLowerCase() === 'a' && selos[0].getAttribute('href') === alvo;
}
