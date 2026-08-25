/* =============================================================================
 * O ÍNDICE DOS 308 · enriquecimento progressivo (passo C, item C4).
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é a mesma regra de `public/js/inicio.js`
 * (resposta 3 da direção, 20.08.2026):
 *
 *   · trocar `hidden`, e mais nada.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. Os 308 resultados vêm do servidor, escondidos,
 * e o que isto faz é acender os que casam com o que o leitor escreveu, com a mesma
 * técnica, e o mesmo tecto de oito, da pesquisa da primeira página.
 *
 * A CAIXA SÓ APARECE COM ESTE FICHEIRO, e é de propósito: o bloco vem do
 * servidor com `hidden`, e sem script a página é a que era: a lista dos 308
 * por distritos, inteira, com a porta de um concelho dentro dela. «Uma caixa de
 * pesquisa que não pesquisa é pior do que nenhuma», e a regra é da peça.
 *
 * A COMPARAÇÃO É SEM ACENTOS, e a regra está escrita uma vez: cada resultado
 * traz `data-normal`, calculado na construção pela mesma função que faz o
 * pedaço do endereço. O cliente normaliza só o que o leitor escreveu, que não é
 * texto da página.
 *
 * COM A CAIXA VAZIA mostram-se os concelhos que já têm página, que é o que o
 * servidor rendeu à vista. É a regra da peça, e aqui não há concelho escolhido:
 * esta página não tem âmbito.
 * ========================================================================== */
(function () {
  'use strict';

  var bloco = document.querySelector('[data-pesquisa-bloco]');
  if (!bloco) return;

  var campo = bloco.querySelector('[data-pesquisa]');
  var itens = bloco.querySelectorAll('.pesquisa-item');
  var semResultado = bloco.querySelector('[data-sem-resultado]');
  if (!campo || !itens.length) return;

  /* O tecto da fila de resultados: oito, e a ordem é a da Carta. É o mesmo
     número da primeira página, e por isso está escrito nos dois sítios com a
     mesma razão: uma fila que cresce sem tecto deixa de ser uma fila. */
  var MAX = 8;

  bloco.hidden = false;

  function filtra() {
    var q = campo.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    var vistos = 0;
    for (var i = 0; i < itens.length; i++) {
      var casa =
        q.length > 0
          ? itens[i].getAttribute('data-normal').indexOf(q) >= 0
          : itens[i].hasAttribute('data-tem-pagina');
      var mostrar = casa && vistos < MAX;
      itens[i].hidden = !mostrar;
      if (mostrar) vistos++;
    }
    if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
  }

  campo.addEventListener('input', filtra);
  campo.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    campo.value = '';
    filtra();
  });
})();
