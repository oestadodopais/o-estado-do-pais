/* =============================================================================
 * A caixa das correções — enriquecimento progressivo.
 *
 * Revela a caixa e liga o botão ao programa de correio de quem lê. Nada é
 * enviado daqui: compõe-se um endereço `mailto:` e entrega-se ao sistema. Não
 * há pedido de rede, não há servidor, não há terceiro pelo meio.
 *
 * Se este ficheiro não correr, a caixa fica escondida e o leitor vê o endereço
 * escrito na frase acima — que é o caminho que funciona sempre. Um botão que
 * não faz nada seria pior do que não haver botão.
 *
 * O endereço e o assunto NÃO são escritos aqui: vêm do markup, que os recebe do
 * mesmo sítio de onde vem o texto do Método. Um endereço escrito em dois sítios
 * é um endereço que um dia diverge.
 * ========================================================================== */
(function () {
  'use strict';

  var caixa = document.querySelector('[data-caixa-correcoes]');
  if (!caixa) return;

  var endereco = caixa.getAttribute('data-endereco');
  if (!endereco) return;

  var texto = caixa.querySelector('[data-caixa-texto]');
  var botao = caixa.querySelector('[data-caixa-enviar]');
  var aviso = caixa.querySelector('[data-caixa-aviso]');
  if (!texto || !botao) return;

  /* A partir daqui há JavaScript, logo o botão vai funcionar: mostra-se. */
  caixa.hidden = false;

  function esconderAviso() {
    if (aviso) aviso.hidden = true;
  }

  texto.addEventListener('input', esconderAviso);

  botao.addEventListener('click', function () {
    var corpo = texto.value.trim();

    /* Abrir o programa de correio com a mensagem vazia não ajuda ninguém, e
       deixaria o leitor a olhar para uma janela em branco sem perceber porquê. */
    if (!corpo) {
      if (aviso) aviso.hidden = false;
      texto.focus();
      return;
    }

    var assunto = caixa.getAttribute('data-assunto') || document.title;

    window.location.href =
      'mailto:' +
      encodeURIComponent(endereco) +
      '?subject=' +
      encodeURIComponent(assunto) +
      '&body=' +
      encodeURIComponent(corpo);
  });
})();
