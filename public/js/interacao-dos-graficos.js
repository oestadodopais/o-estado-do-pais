/**
 * A INTERAÇÃO DOS GRÁFICOS (bloco G1, 21.10.2026; fecha a I230).
 *
 * Um só guião para todos os gráficos marcados `data-grafico`. Cada ponto marcado `data-grafico-ponto` traz os seus
 * dados (`data-grafico-periodo`, `data-grafico-valor`, `data-grafico-unidade`, `data-grafico-nome`), escritos na
 * construção a partir do texto que o portão de HTML confere, e um `aria-label` com o período e o valor; este guião
 * não escreve número nenhum que não esteja nesses atributos.
 *
 * Mostra a leitura de um ponto: ao passar o rato; ao toque (`pointerdown`); ao arrastar o dedo apoiado, o ponto mais
 * próximo do dedo; e ao foco pelo teclado, com as setas a andar de ponto em ponto (um só ponto de cada gráfico está na
 * ordem do tabulador, o último lido). Um toque fora fecha-a, e Escape também.
 *
 * Duas formas de etiqueta, uma por gráfico: o ponto que já tem a sua etiqueta desenhada dentro do `<svg>` (as séries
 * no tempo, cujo valor e período o portão de HTML confere ali) acende-se com `data-ativo`; o ponto que não a tem (as
 * marcas das faixas dos países) mostra uma etiqueta comum ao gráfico, posta junto ao ponto e sempre dentro do ecrã.
 * Sem guião, o `aria-label` e o `<title>` de cada ponto continuam a dizer o período e o valor.
 */
(function () {
  'use strict';
  var graficos = document.querySelectorAll('[data-grafico]');
  if (!graficos.length) return;
  var MARGEM = 8;

  function pontosDe(g) { return Array.prototype.slice.call(g.querySelectorAll('[data-grafico-ponto]')); }
  function temEtiquetaPropria(p) { return Boolean(p.querySelector('text')); }

  function etiquetaDe(g) {
    if (g._etiqueta) return g._etiqueta;
    var e = document.createElement('div');
    e.className = 'grafico-etiqueta';
    e.setAttribute('aria-hidden', 'true');
    e.hidden = true;
    document.body.appendChild(e);
    g._etiqueta = e;
    return e;
  }

  function textoDe(p) {
    var leitura = p.getAttribute('data-grafico-leitura');
    if (leitura) return leitura;
    var nome = p.getAttribute('data-grafico-nome') || '';
    var periodo = p.getAttribute('data-grafico-periodo') || '';
    var valor = p.getAttribute('data-grafico-valor') || '';
    var unidade = p.getAttribute('data-grafico-unidade') || '';
    var cabeca = [nome, periodo].filter(Boolean).join(', ');
    return (cabeca ? cabeca + ': ' : '') + valor + (unidade ? '\u00a0' + unidade : '');
  }

  function poe(e, p) {
    var r = p.getBoundingClientRect();
    var largura = document.documentElement.clientWidth;
    e.style.left = '0px';
    e.style.top = '0px';
    var w = e.offsetWidth;
    var h = e.offsetHeight;
    var x = r.left + r.width / 2 - w / 2;
    x = Math.max(MARGEM, Math.min(x, largura - w - MARGEM));
    var y = r.top - h - 6;
    if (y < MARGEM) y = r.bottom + 6;
    e.style.left = Math.round(x + window.scrollX) + 'px';
    e.style.top = Math.round(y + window.scrollY) + 'px';
  }

  function apaga(g) {
    if (g._ativo) g._ativo.removeAttribute('data-ativo');
    g._ativo = null;
    if (g._etiqueta) g._etiqueta.hidden = true;
  }

  function acende(g, p) {
    if (!p || g._ativo === p) return;
    apaga(g);
    g._ativo = p;
    p.setAttribute('data-ativo', '');
    if (!temEtiquetaPropria(p)) {
      var e = etiquetaDe(g);
      e.textContent = textoDe(p);
      e.hidden = false;
      poe(e, p);
    }
  }

  function maisProximo(g, x, y) {
    var melhor = null;
    var dist = Infinity;
    pontosDe(g).forEach(function (p) {
      var r = p.getBoundingClientRect();
      var dx = r.left + r.width / 2 - x;
      var dy = x >= r.left && x <= r.right ? 0 : (r.top + r.height / 2 - y) / 4;
      var d = dx * dx + dy * dy;
      if (d < dist) { dist = d; melhor = p; }
    });
    return melhor;
  }

  function foca(g, p) {
    pontosDe(g).forEach(function (q) { q.setAttribute('tabindex', q === p ? '0' : '-1'); });
    p.focus();
  }

  Array.prototype.forEach.call(graficos, function (g) {
    g.addEventListener('pointerover', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      var p = ev.target.closest && ev.target.closest('[data-grafico-ponto]');
      if (p && g.contains(p)) acende(g, p);
    });
    g.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType === 'mouse' && !g.contains(document.activeElement)) apaga(g);
    });
    g.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse') return;
      g._apoiado = true;
      if (ev.target.releasePointerCapture && ev.target.hasPointerCapture && ev.target.hasPointerCapture(ev.pointerId)) {
        ev.target.releasePointerCapture(ev.pointerId);
      }
      acende(g, maisProximo(g, ev.clientX, ev.clientY));
    });
    g.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'mouse' || !g._apoiado) return;
      acende(g, maisProximo(g, ev.clientX, ev.clientY));
    });
    ['pointerup', 'pointercancel'].forEach(function (tipo) {
      g.addEventListener(tipo, function () { g._apoiado = false; });
    });
    g.addEventListener('focusin', function (ev) {
      var p = ev.target.closest && ev.target.closest('[data-grafico-ponto]');
      if (p) acende(g, p);
    });
    g.addEventListener('focusout', function (ev) {
      if (!ev.relatedTarget || !g.contains(ev.relatedTarget)) apaga(g);
    });
    g.addEventListener('keydown', function (ev) {
      var p = ev.target.closest && ev.target.closest('[data-grafico-ponto]');
      if (!p) return;
      var todos = pontosDe(g);
      var i = todos.indexOf(p);
      var j = i;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') j = Math.min(todos.length - 1, i + 1);
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') j = Math.max(0, i - 1);
      else if (ev.key === 'Home') j = 0;
      else if (ev.key === 'End') j = todos.length - 1;
      else if (ev.key === 'Escape') { apaga(g); return; }
      else return;
      ev.preventDefault();
      if (j !== i) foca(g, todos[j]);
    });
  });

  /* Um toque fora de um gráfico fecha a etiqueta dele; mudar a largura repõe a etiqueta comum junto ao ponto, porque
     foi posta contra a largura de antes. */
  document.addEventListener('pointerdown', function (ev) {
    Array.prototype.forEach.call(graficos, function (g) {
      if (!g.contains(ev.target)) apaga(g);
    });
  });
  window.addEventListener('resize', function () {
    Array.prototype.forEach.call(graficos, function (g) {
      if (g._ativo && g._etiqueta && !g._etiqueta.hidden) poe(g._etiqueta, g._ativo);
    });
  });
})();
