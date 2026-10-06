/* O código continua selecionável sem guião nem acesso à área de transferência. */
(function () {
  'use strict';
  document.querySelectorAll('[data-incorporar-bloco]').forEach(function (bloco) {
    var campo = bloco.querySelector('textarea');
    var botao = bloco.querySelector('button');
    if (!campo || !botao) return;
    botao.hidden = false;
    botao.addEventListener('click', function () {
      function selecionar() {
        campo.focus();
        campo.select();
        botao.textContent = botao.getAttribute('data-selecionado');
      }
      if (!navigator.clipboard || !navigator.clipboard.writeText) { selecionar(); return; }
      navigator.clipboard.writeText(campo.value).then(function () {
        botao.textContent = botao.getAttribute('data-copiado');
      }, selecionar);
    });
  });
}());
