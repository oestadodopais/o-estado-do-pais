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
 * marcas das faixas dos países) mostra uma etiqueta comum ao gráfico, posta junto ao ponto e confinada à janela nos
 * dois eixos, ao abrir e ao mudar a largura.
 *
 * A correção G1-b (21.10.2026): o ponto mais próximo do dedo mede-se ao ponto desenhado (o círculo, ou a zona estreita
 * de toque quando não há círculo), e não ao grupo inteiro, que inclui a etiqueta deslocada. E um gráfico dentro de uma
 * porta (um irmão `a[data-grafico-porta]`, os cartões): o toque num ponto abre a etiqueta e o toque fora dos pontos
 * segue a ligação; ao rato, o clique num ponto segue a ligação; ao teclado, Enter num ponto também.
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
    var altura = document.documentElement.clientHeight;
    var y = r.top - h - 6;
    if (y < MARGEM) y = r.bottom + 6;
    y = Math.max(MARGEM, Math.min(y, altura - h - MARGEM));
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
    if (temEtiquetaPropria(p)) confina(p);
    else {
      var e = etiquetaDe(g);
      e.textContent = textoDe(p);
      e.hidden = false;
      poe(e, p);
    }
  }

  /* O ponto desenhado de cada grupo: o círculo marcado; sem ele, a zona de toque; sem nenhum, o próprio ponto (as
     marcas das faixas). */
  function desenhoDe(p) { return p.querySelector('circle') || p.querySelector('rect') || p; }

  /* A correção G1-c (o achado 2 da leitura do Codex): o x do dedo decide sozinho, pelo |dx| estrito; o y entra só
     entre os pontos no mesmo x que o vencedor (o mesmo centro, com a tolerância de um milésimo da largura do desenho,
     que é um milésimo do viewBox), nunca como peso. */
  function maisProximo(g, x, y) {
    var cs = pontosDe(g).map(function (p) {
      var r = desenhoDe(p).getBoundingClientRect();
      return { p: p, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
    if (!cs.length) return null;
    var melhor = cs[0];
    cs.forEach(function (c) { if (Math.abs(c.cx - x) < Math.abs(melhor.cx - x)) melhor = c; });
    var tol = g.getBoundingClientRect().width / 1000;
    var base = melhor.cx;
    cs.forEach(function (c) {
      if (Math.abs(c.cx - base) <= tol && Math.abs(c.cy - y) < Math.abs(melhor.cy - y)) melhor = c;
    });
    return melhor.p;
  }

  /* A correção G1-c (o achado 3): a etiqueta própria de um ponto dentro do `<svg>` fica dentro do viewBox nos dois
     eixos; quando sairia por um lado, o `text` desloca-se para dentro, ao acender e ao mudar a largura. */
  function confina(p) {
    var t = p.querySelector('text');
    var svg = p.ownerSVGElement;
    if (!t || !svg || !svg.viewBox || !svg.viewBox.baseVal || !svg.viewBox.baseVal.width) return;
    t.removeAttribute('transform');
    var vb = svg.viewBox.baseVal;
    var b = t.getBBox();
    var dx = b.x < vb.x ? vb.x - b.x : (b.x + b.width > vb.x + vb.width ? vb.x + vb.width - b.x - b.width : 0);
    var dy = b.y < vb.y ? vb.y - b.y : (b.y + b.height > vb.y + vb.height ? vb.y + vb.height - b.y - b.height : 0);
    if (dx || dy) t.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')');
  }

  function foca(g, p) {
    pontosDe(g).forEach(function (q) { q.setAttribute('tabindex', q === p ? '0' : '-1'); });
    p.focus();
  }

  Array.prototype.forEach.call(graficos, function (g) {
    /* O desenho indexado (G1-c) não tem zonas de leitura: ao rato, o ponto mais próximo do cursor. */
    var proximidade = g.getAttribute('data-grafico') === 'indice';
    var porta = g.parentElement && g.parentElement.querySelector('a[data-grafico-porta]');
    if (porta) {
      g.addEventListener('click', function (ev) {
        if (g._tipo === 'mouse' && ev.target.closest && ev.target.closest('[data-grafico-ponto]')) porta.click();
      });
    }
    g.addEventListener('pointerover', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      var p = ev.target.closest && ev.target.closest('[data-grafico-ponto]');
      if (p && g.contains(p)) acende(g, p);
    });
    g.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType === 'mouse' && !g.contains(document.activeElement)) apaga(g);
    });
    g.addEventListener('pointerdown', function (ev) {
      g._tipo = ev.pointerType;
      if (ev.pointerType === 'mouse') return;
      g._apoiado = true;
      if (ev.target.releasePointerCapture && ev.target.hasPointerCapture && ev.target.hasPointerCapture(ev.pointerId)) {
        ev.target.releasePointerCapture(ev.pointerId);
      }
      acende(g, maisProximo(g, ev.clientX, ev.clientY));
    });
    g.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'mouse') { if (proximidade) acende(g, maisProximo(g, ev.clientX, ev.clientY)); return; }
      if (!g._apoiado) return;
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
      else if (ev.key === 'Enter' && porta) { porta.click(); return; }
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
      if (g._ativo && temEtiquetaPropria(g._ativo)) confina(g._ativo);
      else if (g._ativo && g._etiqueta && !g._etiqueta.hidden) poe(g._etiqueta, g._ativo);
    });
  });
})();
