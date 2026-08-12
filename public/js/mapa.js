/* =============================================================================
 * O país em pontos — enriquecimento progressivo.
 *
 * O mapa já vem desenhado do servidor, em SVG, com Évora acesa. Este ficheiro
 * acrescenta a leitura ponto a ponto: cursor, teclado e nome do município.
 *
 * Não desenha pontos nem inventa posições: lê as que já estão no SVG. Também
 * não escreve números nenhuns na página — a leitura mostra nomes.
 * ========================================================================== */
(function () {
  'use strict';

  var raiz = document.querySelector('[data-instrumento="mapa"]');
  if (!raiz) return;

  var svg = raiz.querySelector('[data-mapa]');
  var wrap = raiz.querySelector('[data-mapa-wrap]');
  if (!svg || !wrap) return;

  var nome = raiz.querySelector('[data-readout-nome]');
  var sub = raiz.querySelector('[data-readout-sub]');
  var hint = raiz.querySelector('[data-readout-hint]');
  var teclado = raiz.querySelector('[data-teclado]');

  var caixa = svg.viewBox && svg.viewBox.baseVal;
  var W = caixa && caixa.width ? caixa.width : 600;
  var H = caixa && caixa.height ? caixa.height : 790;

  /* Os pontos não são criados aqui: são lidos do que o servidor desenhou. */
  var pontos = [];
  var circulos = svg.querySelectorAll('circle[data-m]');
  for (var i = 0; i < circulos.length; i++) {
    var c = circulos[i];
    pontos.push({
      x: parseFloat(c.getAttribute('cx')),
      y: parseFloat(c.getAttribute('cy')),
      nome: c.getAttribute('data-m'),
      distrito: c.getAttribute('data-d') || '',
      aceso: c.classList.contains('mun-lit'),
    });
  }
  if (!pontos.length) return;

  var iAceso = 0;
  for (var k = 0; k < pontos.length; k++) {
    if (pontos[k].aceso) {
      iAceso = k;
      break;
    }
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  var anel = document.createElementNS(SVGNS, 'circle');
  anel.setAttribute('class', 'cursor-ring');
  anel.setAttribute('r', '7.5');
  anel.style.display = 'none';
  svg.appendChild(anel);

  var miolo = document.createElementNS(SVGNS, 'circle');
  miolo.setAttribute('class', 'cursor-ring');
  miolo.setAttribute('r', '2.6');
  miolo.setAttribute('fill', 'var(--ink)');
  miolo.style.display = 'none';
  svg.appendChild(miolo);

  var sel = -1;
  var modoTeclado = false;

  function mostra(i) {
    sel = i;
    if (i < 0) {
      anel.style.display = 'none';
      miolo.style.display = 'none';
      if (nome) nome.hidden = true;
      if (sub) sub.hidden = true;
      if (hint) hint.hidden = false;
      return;
    }
    var p = pontos[i];
    anel.setAttribute('cx', p.x);
    anel.setAttribute('cy', p.y);
    miolo.setAttribute('cx', p.x);
    miolo.setAttribute('cy', p.y);
    anel.style.display = '';
    miolo.style.display = '';
    if (hint) hint.hidden = true;
    if (nome) {
      nome.hidden = false;
      nome.textContent = p.nome;
    }
    if (sub) {
      sub.hidden = false;
      sub.textContent = p.distrito;
    }
  }

  function maisPerto(px, py) {
    var melhor = -1;
    var d2 = 16 * 16;
    for (var i = 0; i < pontos.length; i++) {
      var dx = pontos[i].x - px;
      var dy = pontos[i].y - py;
      var d = dx * dx + dy * dy;
      if (d < d2) {
        d2 = d;
        melhor = i;
      }
    }
    return melhor;
  }

  function paraCampo(ev) {
    var r = svg.getBoundingClientRect();
    return {
      x: ((ev.clientX - r.left) / r.width) * W,
      y: ((ev.clientY - r.top) / r.height) * H,
    };
  }

  svg.addEventListener('pointermove', function (ev) {
    if (ev.pointerType === 'touch') return;
    modoTeclado = false;
    var p = paraCampo(ev);
    var i = maisPerto(p.x, p.y);
    if (i !== sel) mostra(i);
  });
  svg.addEventListener('pointerleave', function () {
    if (!modoTeclado) mostra(-1);
  });
  svg.addEventListener('pointerdown', function (ev) {
    var p = paraCampo(ev);
    var i = maisPerto(p.x, p.y);
    if (i >= 0) {
      modoTeclado = true;
      mostra(i);
    }
  });

  /* O teclado só passa a existir agora: sem JavaScript não havia para onde ir. */
  wrap.setAttribute('tabindex', '0');
  wrap.setAttribute('role', 'application');
  var etiqueta = svg.getAttribute('aria-label');
  if (etiqueta) wrap.setAttribute('aria-label', etiqueta);
  if (teclado) teclado.hidden = false;

  var DIRS = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

  wrap.addEventListener('keydown', function (ev) {
    if (ev.key === 'Home') {
      modoTeclado = true;
      mostra(iAceso);
      ev.preventDefault();
      return;
    }
    var d = DIRS[ev.key];
    if (!d) return;
    ev.preventDefault();
    modoTeclado = true;
    if (sel < 0) {
      mostra(iAceso);
      return;
    }
    var cur = pontos[sel];
    var melhor = -1;
    var pontuacao = Infinity;
    for (var i = 0; i < pontos.length; i++) {
      if (i === sel) continue;
      var dx = pontos[i].x - cur.x;
      var dy = pontos[i].y - cur.y;
      var ao_longo = dx * d[0] + dy * d[1];
      if (ao_longo <= 0) continue;
      var de_lado = Math.abs(dx * d[1] - dy * d[0]);
      if (de_lado > ao_longo * 1.6) continue; /* fica dentro de ~58 graus do eixo */
      var s = ao_longo + de_lado * 2.2;
      if (s < pontuacao) {
        pontuacao = s;
        melhor = i;
      }
    }
    if (melhor >= 0) mostra(melhor);
  });

  wrap.addEventListener('focus', function () {
    modoTeclado = true;
    if (sel < 0) mostra(iAceso);
  });
  wrap.addEventListener('blur', function () {
    modoTeclado = false;
    mostra(-1);
  });
})();
