/* =============================================================================
 * A PRIMEIRA PÁGINA — enriquecimento progressivo.
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é uma regra e não um estilo (resposta 3 da
 * direcção à crítica cruzada, 20.08.2026):
 *
 *   · trocar `hidden`, `open`, `aria-pressed` e `aria-current`;
 *   · escrever o `textContent` de dois `<span data-slot>` marcados, com texto
 *     COPIADO de um nó que o servidor já escreveu (o nome e o distrito do
 *     concelho, lidos da ilha da CAOP dentro do mapa);
 *   · mexer no endereço com `history.pushState`.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. Tudo o que a página mostra em qualquer estado
 * veio do servidor e passou pelo portão de HTML.
 *
 * Sem este ficheiro a página é o âmbito País em Relance, completa e correcta.
 * ========================================================================== */
(function () {
  'use strict';

  var raiz = document.querySelector('[data-inicio]');
  if (!raiz) return;

  /* As notas que explicam o que não funciona sem script saem quando há script.
     Uma frase que diz «sem JavaScript…» numa página com JavaScript é ruído. */
  var notas = document.querySelectorAll('[data-sem-js]');
  for (var n = 0; n < notas.length; n++) notas[n].hidden = true;

  /* ------------------------------------------------------------------ o mapa
   *
   * Os pontos não são criados aqui: são lidos do que o servidor desenhou. O que
   * este bloco acrescenta é a leitura ponto a ponto — cursor, teclado e o nome
   * do concelho numa região viva. Nenhum número é escrito.
   */
  var mapa = document.querySelector('[data-mapa]');
  var tela = document.querySelector('[data-mapa-wrap]');
  if (mapa && tela) {
    var nome = document.querySelector('[data-readout-nome]');
    var sub = document.querySelector('[data-readout-sub]');
    var dica = document.querySelector('[data-readout-hint]');
    var teclado = document.querySelector('[data-teclado]');

    var caixa = mapa.viewBox && mapa.viewBox.baseVal;
    var W = caixa && caixa.width ? caixa.width : 600;
    var H = caixa && caixa.height ? caixa.height : 790;

    var pontos = [];
    var nos = mapa.querySelectorAll('[data-pontos] [data-m]');
    for (var i = 0; i < nos.length; i++) {
      var el = nos[i];
      var x = parseFloat(el.getAttribute('x')) + parseFloat(el.getAttribute('width')) / 2;
      var y = parseFloat(el.getAttribute('y')) + parseFloat(el.getAttribute('height')) / 2;
      pontos.push({
        x: x,
        y: y,
        el: el,
        nome: el.getAttribute('data-m'),
        distrito: el.getAttribute('data-d') || '',
        caop: el.getAttribute('data-caop'),
        comPagina: el.classList.contains('mun-com-pagina'),
      });
    }

    if (pontos.length) {
      var iComPagina = 0;
      for (var k = 0; k < pontos.length; k++) {
        if (pontos[k].comPagina) {
          iComPagina = k;
          break;
        }
      }

      var SVGNS = 'http://www.w3.org/2000/svg';
      var anel = document.createElementNS(SVGNS, 'circle');
      anel.setAttribute('class', 'cursor-ring');
      anel.setAttribute('r', '9');
      anel.style.display = 'none';
      mapa.appendChild(anel);

      var sel = -1;
      var modoTeclado = false;

      var mostra = function (j) {
        sel = j;
        if (j < 0) {
          anel.style.display = 'none';
          if (nome) nome.hidden = true;
          if (sub) sub.hidden = true;
          if (dica) dica.hidden = false;
          return;
        }
        var pt = pontos[j];
        anel.setAttribute('cx', pt.x);
        anel.setAttribute('cy', pt.y);
        anel.style.display = '';
        if (dica) dica.hidden = true;
        /* Texto copiado, nunca composto: é o nome que o servidor escreveu
           naquele nó, e mais nada. */
        if (nome) {
          nome.hidden = false;
          nome.textContent = pt.nome;
        }
        if (sub) {
          sub.hidden = false;
          sub.textContent = pt.distrito;
        }
      };

      var maisPerto = function (px, py) {
        var melhor = -1;
        var d2 = 18 * 18;
        for (var m = 0; m < pontos.length; m++) {
          var dx = pontos[m].x - px;
          var dy = pontos[m].y - py;
          var d = dx * dx + dy * dy;
          if (d < d2) {
            d2 = d;
            melhor = m;
          }
        }
        return melhor;
      };

      var paraCampo = function (ev) {
        var r = mapa.getBoundingClientRect();
        return {
          x: ((ev.clientX - r.left) / r.width) * W,
          y: ((ev.clientY - r.top) / r.height) * H,
        };
      };

      mapa.addEventListener('pointermove', function (ev) {
        if (ev.pointerType === 'touch') return;
        modoTeclado = false;
        var q = paraCampo(ev);
        var j = maisPerto(q.x, q.y);
        if (j !== sel) mostra(j);
      });
      mapa.addEventListener('pointerleave', function () {
        if (!modoTeclado) mostra(-1);
      });

      tela.setAttribute('tabindex', '0');
      tela.setAttribute('role', 'application');
      var etiqueta = mapa.getAttribute('aria-label');
      if (etiqueta) tela.setAttribute('aria-label', etiqueta);
      if (teclado) teclado.hidden = false;

      var DIRS = {
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };

      tela.addEventListener('keydown', function (ev) {
        if (ev.key === 'Home') {
          modoTeclado = true;
          mostra(iComPagina);
          ev.preventDefault();
          return;
        }
        var d = DIRS[ev.key];
        if (!d) return;
        ev.preventDefault();
        modoTeclado = true;
        if (sel < 0) {
          mostra(iComPagina);
          return;
        }
        var cur = pontos[sel];
        var melhor = -1;
        var pontuacao = Infinity;
        for (var j = 0; j < pontos.length; j++) {
          if (j === sel) continue;
          var dx = pontos[j].x - cur.x;
          var dy = pontos[j].y - cur.y;
          var aoLongo = dx * d[0] + dy * d[1];
          if (aoLongo <= 0) continue;
          var deLado = Math.abs(dx * d[1] - dy * d[0]);
          if (deLado > aoLongo * 1.6) continue; /* fica dentro de ~58 graus do eixo */
          var pontos_ = aoLongo + deLado * 2.2;
          if (pontos_ < pontuacao) {
            pontuacao = pontos_;
            melhor = j;
          }
        }
        if (melhor >= 0) mostra(melhor);
      });

      tela.addEventListener('focus', function () {
        modoTeclado = true;
        if (sel < 0) mostra(iComPagina);
      });
      tela.addEventListener('blur', function () {
        modoTeclado = false;
        mostra(-1);
      });
    }
  }
})();
