/* =============================================================================
 * O ÍNDICE DOS ESTUDOS, FILTRADO POR CONCELHO (F1.10, §1 e 8.10, 09.09.2026)
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é a mesma regra de `public/js/municipios.js`
 * e de `public/js/inicio.js` (resposta 3 da direção, 20.08.2026):
 *
 *   · trocar `hidden`, e mais nada.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. Tudo o que se vê veio do servidor.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * A página de um concelho lista os TÍTULOS dos estudos sobre ele e leva uma
 * porta para «Ver estes estudos no índice» — o §1 do brief escreve-a
 * «`/estudos` filtrado por concelho (`?concelho=`)». Este ficheiro é esse
 * filtro: lê o endereço, esconde as entradas cujo objeto não é aquele concelho,
 * e acende a porta que devolve a lista inteira.
 *
 * SEM GUIÃO, A RESPOSTA CONTINUA COMPLETA, e é a mesma decisão que `/municipios`
 * já tinha: o índice rende-se inteiro do servidor, e quem chega sem guião vê os
 * estudos todos, que é uma resposta completa à pergunta que ele faz. Um filtro
 * que escondesse conteúdo do servidor seria conteúdo que o portão vê e o leitor
 * não.
 *
 * UM VALOR QUE NÃO CASA COM NENHUM CONCELHO NÃO ESCONDE NADA. É a regra da
 * ausência: um endereço com `?concelho=atlantida` deixa a lista inteira à vista,
 * em vez de a esvaziar e deixar o leitor com uma página em branco que ele não
 * pediu.
 * ========================================================================== */
(function () {
  'use strict';

  var lista = document.querySelector('[data-arquivo]');
  if (!lista) return;

  var pedido = null;
  try {
    pedido = new URL(window.location.href).searchParams.get('concelho');
  } catch (e) {
    return;
  }
  if (!pedido) return;

  var itens = lista.querySelectorAll('[data-concelho]');
  if (!itens.length) return;

  /* Quantos casam, contado ANTES de se esconder o que quer que seja: esconder e
     depois perguntar deixava a página vazia no caso em que nada casa. */
  var casam = 0;
  for (var i = 0; i < itens.length; i++) {
    if (itens[i].getAttribute('data-concelho') === pedido) casam++;
  }
  if (!casam) return;

  for (var j = 0; j < itens.length; j++) {
    var item = itens[j];
    if (item.getAttribute('data-concelho') !== pedido) item.hidden = true;
  }

  var porta = document.querySelector('[data-arquivo-todos]');
  if (porta) porta.hidden = false;
})();
