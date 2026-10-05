/* ==========================================================================
 * O TOQUE NUMA MARCA DA FAIXA DOS PAÍSES (bloco UE2, 02.10.2026)
 * ==========================================================================
 * Na secção «Os 27 países» da página da União, cada faixa tem uma marca por
 * país e uma da média da União, e cada marca tem a sua etiqueta no documento,
 * com o nome e o valor do ponto, escondida (`hidden`). Tocar no desenho, ou
 * pousar o rato nele, mostra a etiqueta da marca mais perto do ponteiro e
 * esconde as outras; tocar fora das faixas esconde-as todas.
 *
 * A REGRA DO GUIÃO DA CASA VALE AQUI POR INTEIRO (`public/js/leituras.js`): este
 * ficheiro troca `hidden` e escreve marcas de estado (`data-tocada` na marca,
 * `data-toque-em` no desenho, `data-toque` na secção), e mais nada. Não escreve
 * texto, não compõe um número, não monta um destino: o nome e o valor que
 * aparecem são os que o servidor rendeu, e o portão de HTML conferiu.
 *
 * SEM GUIÃO A PÁGINA NÃO PERDE NADA: as etiquetas ficam escondidas, e a lista
 * dobrada «Os 27 por ordem» de cada faixa diz cada país com o seu valor, num
 * `<details>` que abre sem guião (a decisão 2 do §5 do brief: a lista é o
 * caminho, e o toque é um atalho). Por isso o desenho não entra no caminho do
 * teclado: quem não tem ponteiro tem a lista, que se abre e lê com o teclado.
 * ======================================================================== */
(function () {
  'use strict';

  var seccao = document.querySelector('[data-paises]');
  if (!seccao) return;
  var desenhos = seccao.querySelectorAll('[data-toques]');
  if (!desenhos.length) return;

  /* Esconde as etiquetas de um desenho e tira o anel à marca tocada. */
  var apaga = function (desenho) {
    var etiquetas = desenho.querySelectorAll('[data-toque-de]');
    for (var i = 0; i < etiquetas.length; i++) etiquetas[i].hidden = true;
    var tocadas = desenho.querySelectorAll('[data-tocada]');
    for (var j = 0; j < tocadas.length; j++) tocadas[j].removeAttribute('data-tocada');
    desenho.removeAttribute('data-toque-em');
  };

  /* A marca cujo centro está mais perto do ponteiro, na horizontal: as marcas de
     uma faixa estão na mesma linha, e um dedo não acerta num ponto de 7 px. A
     posição de cada uma lê-se da caixa que o navegador desenhou. Desde a
     passagem de higiene H3 (05.10.2026) os países com o mesmo valor estão uns
     por cima dos outros, na mesma posição horizontal: entre as marcas dessa
     posição ganha a mais perto do ponteiro na vertical, para o anel ficar na que
     se tocou; a etiqueta diz o grupo inteiro em qualquer delas. */
  var maisPerto = function (desenho, x, y) {
    var marcas = desenho.querySelectorAll('[data-faixa-marca]');
    var melhor = null;
    var distancia = Infinity;
    var vertical = Infinity;
    for (var i = 0; i < marcas.length; i++) {
      var r = marcas[i].getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - x);
      var v = Math.abs(r.top + r.height / 2 - y);
      if (d < distancia - 0.5 || (Math.abs(d - distancia) <= 0.5 && v < vertical)) {
        distancia = d;
        vertical = v;
        melhor = marcas[i];
      }
    }
    return melhor;
  };

  /* Mostra a etiqueta da marca mais perto, e só essa. A etiqueta é a que tem o
     mesmo identificador que a marca («<série>#<país>»), e procura-se por
     igualdade e não por um seletor, para não depender do «#» lá dentro. */
  var mostra = function (desenho, x, y) {
    var marca = maisPerto(desenho, x, y);
    if (!marca) return;
    var id = marca.getAttribute('data-faixa-marca');
    if (desenho.getAttribute('data-toque-em') === id) return;
    apaga(desenho);
    var etiquetas = desenho.querySelectorAll('[data-toque-de]');
    for (var i = 0; i < etiquetas.length; i++) {
      if (etiquetas[i].getAttribute('data-toque-de') === id) etiquetas[i].hidden = false;
    }
    marca.setAttribute('data-tocada', '');
    desenho.setAttribute('data-toque-em', id);
  };

  var liga = function (desenho) {
    desenho.addEventListener('pointerdown', function (ev) {
      mostra(desenho, ev.clientX, ev.clientY);
    });
    /* O rato mostra ao passar e apaga ao sair; o dedo mostra ao tocar e deixa a
       etiqueta à vista até ao toque seguinte, porque um dedo que se levanta
       também «sai» do desenho. */
    desenho.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'mouse') mostra(desenho, ev.clientX, ev.clientY);
    });
    desenho.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType === 'mouse') apaga(desenho);
    });
  };
  for (var i = 0; i < desenhos.length; i++) liga(desenhos[i]);

  /* Um toque fora de uma faixa apaga a etiqueta dela. */
  document.addEventListener('pointerdown', function (ev) {
    for (var j = 0; j < desenhos.length; j++) {
      if (!desenhos[j].contains(ev.target)) apaga(desenhos[j]);
    }
  });

  /* A marca de que o toque está ligado: a folha só diz que o desenho responde
     (o cursor) quando este ficheiro correu. */
  seccao.setAttribute('data-toque', 'sim');
})();
