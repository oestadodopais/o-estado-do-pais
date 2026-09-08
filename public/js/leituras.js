/* ==========================================================================
 * UMA LEITURA DE CADA VEZ, E NENHUMA EM REPOUSO
 * ==========================================================================
 * Este ficheiro é o bloco das leituras de `public/js/inicio.js`, tirado de lá
 * e posto por sua conta (bloco F1.10, itens 8.16 e 8.14, 08.09.2026).
 *
 * PORQUE SAIU DE LÁ. Os 21 cartões dos dois quadros da União deixaram a
 * primeira página e passaram a ter página própria («Portugal na União
 * Europeia», item 8.16). A área de leitura foi com eles, e `inicio.js` é o
 * guião da primeira página: o mapa, a busca dos 308, o âmbito do endereço. A
 * página nova não tem nada disso, e carregar aquele ficheiro inteiro para lhe
 * dar UMA coisa era carregar um mecanismo que ali não tem o que fazer.
 *
 * O QUE SAIU COM ELE, E NÃO VOLTA. O comando das duas densidades («Relance ·
 * Leitura breve»): o item 8.14 tira-o, e com ele sai o estado
 * `?densidade=leitura` desta página. Fica UMA interação, que é a decisão: um
 * toque num cartão abre a leitura daquele cartão, e nenhuma está aberta antes
 * disso. Por isso este ficheiro não tem `repoeDensidade()`: quando o endereço
 * deixa de apontar para uma leitura, fecham-se todas, que é o repouso.
 *
 * A REGRA DO GUIÃO DA CASA VALE AQUI POR INTEIRO. Ele troca `open` e `hidden` e
 * escreve uma marca de estado (`data-toque`), e mais nada: não escreve texto,
 * não compõe um número, não monta um destino. O texto da linha do repouso vem
 * do servidor, declarado em `src/i18n/strings.mjs` e no inventário das frases.
 *
 * SEM GUIÃO A PÁGINA NÃO PERDE NADA: sem a marca, a folha não esconde dobra
 * nenhuma, as vinte e uma ficam à vista, fechadas, e `#m-<id>` continua a abrir
 * a certa, porque cada cartão é uma âncora e cada leitura é um `<details>`.
 * ======================================================================== */
(function () {
  'use strict';

  var leituras = document.querySelectorAll('[data-leitura]');
  if (!leituras.length) return;

  /* A ÁREA E A SUA LINHA DE REPOUSO. As duas são do documento e as duas podem
     não estar lá: uma marca que falta não pode partir o resto do bloco, e o
     fechar da leitura anterior vale na mesma. */
  var areaDeLeitura = document.querySelector('[data-area-leitura]');
  var linhaVazia = document.querySelector('[data-leituras-vazio]');
  /* OS CONTEXTOS DE CADA QUADRO (item 8.12). O cabeçalho de um painel e a sua
     definição de uma linha rendem-se JUNTO DE UMA LEITURA DAQUELE PAINEL, e
     nunca sozinhos: em repouso a área mostra a linha do repouso e mais nada.
     Quem os esconde e quem acende o do quadro da leitura aberta é este
     ficheiro, pela marca `data-contexto-quadro`, que é a mesma que a leitura
     leva em `data-quadro`.

     O SERVIDOR RENDE-OS À VISTA, E É ESTE FICHEIRO QUE OS ESCONDE. É o que a
     decisão 8.12 escreve à letra («sem guião nada muda»): sem este ficheiro as
     vinte e uma leituras ficam à vista, fechadas, e os dois cabeçalhos ficam
     por cima delas, que é a página que o servidor entrega. Rendê-los `hidden`
     do servidor seria tirar a duas metades o seu nome para quem não tem
     guião. */
  var contextos = document.querySelectorAll('[data-contexto-quadro]');

  var soEsta = function (alvo) {
    for (var i = 0; i < leituras.length; i++) {
      leituras[i].open = leituras[i] === alvo;
    }
  };

  /* O QUADRO DE UMA LEITURA ABERTA, OU NENHUM. Não é uma lista escrita aqui: é
     a marca que o servidor pôs em cada dobra. */
  var quadroAberto = function () {
    for (var i = 0; i < leituras.length; i++) {
      if (leituras[i].open) return leituras[i].getAttribute('data-quadro');
    }
    return null;
  };

  /* A LINHA DO REPOUSO E OS CONTEXTOS SEGUEM AS DOBRAS, e não os cliques: quem
     os acende e apaga é o estado real da área, medido nas vinte e uma. Assim
     estão certos venha a mudança de onde vier — de um toque num cartão, do
     endereço, ou do próprio `<summary>` da leitura aberta, que é o comando de
     fechar que a página já tinha. */
  var actualiza = function () {
    var quadro = quadroAberto();
    if (linhaVazia) linhaVazia.hidden = quadro !== null;
    for (var i = 0; i < contextos.length; i++) {
      contextos[i].hidden = contextos[i].getAttribute('data-contexto-quadro') !== quadro;
    }
  };
  for (var i1 = 0; i1 < leituras.length; i1++) {
    leituras[i1].addEventListener('toggle', actualiza);
  }

  /* O alvo de um fragmento, e só quando ele é uma leitura desta área: um
     `#painel` continua a ser o que sempre foi. */
  var leituraDoFragmento = function (frag) {
    if (!frag || frag.charAt(0) !== '#' || frag.length < 2) return null;
    var el = null;
    try {
      el = document.getElementById(decodeURIComponent(frag.slice(1)));
    } catch (e) {
      el = null;
    }
    return el && el.hasAttribute('data-leitura') ? el : null;
  };

  /* UM OUVINTE SÓ, NO DOCUMENTO, E NÃO UM POR CARTÃO. A pergunta não é «este
     elemento é um cartão da faixa»: é «esta ligação vai a uma leitura desta
     área». Assim o bloco não conhece a faixa nem depende dela, e QUALQUER porta
     para uma leitura fecha a anterior. E não se intercepta o clique com
     `preventDefault`: quem põe `#m-<id>` na barra de endereço é a própria
     âncora, e por isso o endereço fica citável mesmo que isto não corra. */
  document.addEventListener('click', function (ev) {
    var el = ev.target;
    var lig = el && el.closest ? el.closest('a[href]') : null;
    if (!lig) return;
    var alvo = leituraDoFragmento(lig.getAttribute('href'));
    if (alvo) soEsta(alvo);
  });

  /* O ENDEREÇO MANDA NOS DOIS SENTIDOS. Um fragmento que é uma leitura abre
     aquela e fecha as outras; um endereço que deixa de apontar para uma leitura
     devolve a área ao repouso, e é isso que faz o botão «voltar» do navegador
     desfazer o toque num cartão. */
  window.addEventListener('hashchange', function () {
    var alvo = leituraDoFragmento(location.hash);
    if (alvo) soEsta(alvo);
    else soEsta(null);
  });

  var doArranque = leituraDoFragmento(location.hash);
  if (doArranque) doArranque.open = true;

  /* A MARCA DA ÁREA ENTRA DEPOIS DE A LEITURA DO FRAGMENTO ESTAR ABERTA, e a
     ordem é medida e não arrumação: assim que a marca entra, a folha tira da
     página as dobras fechadas e a página encolhe. Pô-la antes fazia o navegador
     rolar para o sítio certo de uma página que ia mudar de altura no instante
     seguinte. */
  if (areaDeLeitura) areaDeLeitura.setAttribute('data-toque', 'sim');
  actualiza();

  /* E O ROLAMENTO REFAZ-SE, pela mesma razão: o navegador já tinha rolado até à
     leitura do fragmento com as vinte e uma à vista, e as vinte que saíram eram
     todas as que estavam por cima dela. Não é um rolamento novo: é o mesmo
     destino, medido depois de a página ter a altura que vai ter. */
  if (doArranque && doArranque.scrollIntoView) doArranque.scrollIntoView();
})();
