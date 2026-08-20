/* =============================================================================
 * A régua da convergência — enriquecimento progressivo.
 *
 * A régua já vem desenhada do servidor, com Portugal em cima dela. Este
 * ficheiro só acrescenta a possibilidade de pôr mais regiões na mesma régua.
 * Se não correr, a página continua correcta — só deixa de ser manejável.
 *
 * Nenhum número é inventado aqui. Todos os valores vêm da ilha de dados, que
 * o portão de build confere, valor a valor, contra o livro-razão. Este ficheiro
 * NUNCA formata nem calcula um número: usa as cadeias já publicadas.
 * ========================================================================== */
(function () {
  'use strict';

  var raiz = document.querySelector('[data-instrumento="convergencia"]');
  if (!raiz) return;

  var ilha = raiz.querySelector('script[data-dados="convergencia"]');
  var svg = raiz.querySelector('[data-regua]');
  var controls = raiz.querySelector('[data-controls]');
  if (!ilha || !svg || !controls) return;

  var dados;
  try {
    dados = JSON.parse(ilha.textContent);
  } catch (e) {
    return; // dados partidos: fica o que o servidor desenhou
  }

  var E = dados.estrutura;
  var REGIOES = dados.afirmacoes;
  var PALAVRAS = dados.palavras || {};
  var SVGNS = 'http://www.w3.org/2000/svg';

  var gGap = svg.querySelector('[data-gap]');
  var gStems = svg.querySelector('[data-stems]');
  var gMarks = svg.querySelector('[data-marks]');
  var glanceNum = raiz.querySelector('[data-glance-num]');
  var glanceNome = raiz.querySelector('[data-glance-nome]');
  var semJs = raiz.querySelector('[data-sem-js]');

  var porId = {};
  REGIOES.forEach(function (r) {
    porId[r.id] = r;
  });

  var predefinida = REGIOES[0].id;
  var marcaSSR = svg.querySelector('[data-mk]');
  if (marcaSSR) predefinida = marcaSSR.getAttribute('data-mk');

  var activa = {};
  activa[predefinida] = true;
  var fixa = predefinida;
  var sobre = null;

  function X(v) {
    return E.RL + ((v - E.min) / (E.max - E.min)) * (E.RR - E.RL);
  }

  function cria(tag, attrs) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  function limpa(g) {
    while (g.firstChild) g.removeChild(g.firstChild);
  }

  function corrente() {
    var id = sobre || fixa;
    if (!activa[id]) id = fixa;
    if (!activa[id]) {
      for (var i = 0; i < REGIOES.length; i++) {
        if (activa[REGIOES[i].id]) {
          id = REGIOES[i].id;
          break;
        }
      }
    }
    return porId[id] || REGIOES[0];
  }

  /* ------------------------------------------------------------ a régua */

  function desenhaRegua() {
    limpa(gGap);
    limpa(gStems);
    limpa(gMarks);

    var lista = REGIOES.filter(function (r) {
      return activa[r.id];
    }).sort(function (a, b) {
      return a.valor - b.valor;
    });
    var cur = corrente();

    /* a barra da distância, só para a região que está a ser lida */
    if (activa[cur.id]) {
      var a = Math.min(X(E.datum), X(cur.valor));
      var b = Math.max(X(E.datum), X(cur.valor));
      gGap.appendChild(
        cria('rect', { x: a, y: E.RY - 4.5, width: Math.max(b - a, 1), height: 9, fill: 'var(--ink)' }),
      );
      var rot = cria('text', {
        x: (a + b) / 2,
        y: E.RY + 42,
        'text-anchor': 'middle',
        class: 'gap-label',
      });
      rot.textContent = cur.sinal + cur.distancia_texto + ' ' + (PALAVRAS.pontos || '');
      gGap.appendChild(rot);
    }

    /* construir os rótulos, medi-los, e só depois distribuí-los por patamares */
    var feitos = lista.map(function (r) {
      var g = cria('g', {
        class: 'mk' + (r.id === cur.id ? ' is-on' : sobre ? ' is-dim' : ''),
      });
      g.setAttribute('data-mk', r.id);
      var nome = cria('text', { 'text-anchor': 'middle', class: 'mk-name' });
      nome.textContent = r.nome;
      var val = cria('text', { 'text-anchor': 'middle', class: 'mk-val' });
      val.textContent = r.valor_texto;
      g.appendChild(nome);
      g.appendChild(val);
      gMarks.appendChild(g);
      return { r: r, g: g, nome: nome, val: val, x: X(r.valor) };
    });

    feitos.forEach(function (f) {
      var w = 0;
      try {
        w = Math.max(f.nome.getComputedTextLength(), f.val.getComputedTextLength());
      } catch (e) {
        w = f.r.nome.length * 6.8;
      }
      f.w = Math.max(w, 34) + 18;
    });

    var fim = [];
    feitos.forEach(function (f) {
      var patamar = 0;
      while (
        patamar < E.patamares.length - 1 &&
        fim[patamar] !== undefined &&
        f.x - f.w / 2 < fim[patamar]
      ) {
        patamar++;
      }
      fim[patamar] = f.x + f.w / 2;
      f.y = E.patamares[patamar];
    });

    feitos.forEach(function (f) {
      /* as hastes vivem na sua própria camada, por baixo de todos os rótulos */
      gStems.appendChild(
        cria('line', {
          x1: f.x,
          y1: E.RY - 6,
          x2: f.x,
          y2: f.y + 4,
          stroke: f.r.id === cur.id ? 'var(--ink)' : 'var(--axis)',
          'stroke-width': f.r.id === cur.id ? 1.5 : 1,
        }),
      );

      var fundo = cria('rect', {
        x: f.x - f.w / 2,
        y: f.y - 37,
        width: f.w,
        height: 41,
        fill: 'var(--paper)',
      });
      f.g.insertBefore(fundo, f.g.firstChild);

      f.nome.setAttribute('x', f.x);
      f.nome.setAttribute('y', f.y - 24);
      f.val.setAttribute('x', f.x);
      f.val.setAttribute('y', f.y - 1);

      f.g.appendChild(
        cria('circle', {
          cx: f.x,
          cy: E.RY,
          r: f.r.id === cur.id ? 5.5 : 4,
          fill: 'var(--ink)',
          stroke: 'var(--paper)',
          'stroke-width': 1.5,
        }),
      );

      /* a leitura histórica fica por baixo do eixo: o passado sob o presente */
      if (f.r.historico !== undefined) {
        var hx = X(f.r.historico);
        f.g.appendChild(
          cria('circle', { cx: hx, cy: E.RY, r: 4, fill: 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 1.5 }),
        );
        var ht = cria('text', { x: hx - 9, y: E.RY + 60, 'text-anchor': 'end', class: 'hist-label' });
        ht.textContent = f.r.historico_texto + ' ' + (PALAVRAS.em || '') + ' ' + f.r.historico_ref;
        f.g.appendChild(ht);
        f.g.appendChild(
          cria('line', {
            x1: hx,
            y1: E.RY + 6,
            x2: hx,
            y2: E.RY + 50,
            stroke: 'var(--axis)',
            'stroke-width': 1,
            'stroke-dasharray': '2 2',
          }),
        );
      }

      var alvo = cria('rect', {
        x: f.x - 22,
        y: f.y - 34,
        width: 44,
        height: E.RY + 12 - (f.y - 34),
        class: 'mk-hit',
      });
      f.g.appendChild(alvo);
      f.g.addEventListener('mouseenter', function () {
        sobre = f.r.id;
        tudo();
      });
      f.g.addEventListener('mouseleave', function () {
        sobre = null;
        tudo();
      });
      f.g.addEventListener('click', function () {
        fixa = f.r.id;
        sobre = null;
        tudo();
      });
    });
  }

  /* ------------------------------------------------------------ leitura */

  function desenhaLeitura() {
    var cur = corrente();
    if (glanceNum) {
      glanceNum.textContent = cur.valor_texto;
      glanceNum.setAttribute('data-claim', cur.valor_claim);
    }
    if (glanceNome) glanceNome.textContent = cur.nome;

    var briefs = raiz.querySelectorAll('[data-brief]');
    for (var i = 0; i < briefs.length; i++) {
      briefs[i].hidden = briefs[i].getAttribute('data-brief') !== cur.id;
    }
    var chips = raiz.querySelectorAll('[data-brief-chip]');
    for (var j = 0; j < chips.length; j++) {
      chips[j].hidden = chips[j].getAttribute('data-brief-chip') !== cur.id;
    }
  }

  function desenhaComandos() {
    var cur = corrente();
    var bs = controls.querySelectorAll('[data-regiao-chip]');
    for (var i = 0; i < bs.length; i++) {
      var id = bs[i].getAttribute('data-regiao-chip');
      bs[i].setAttribute('aria-pressed', activa[id] ? 'true' : 'false');
      if (id === cur.id && activa[cur.id]) bs[i].classList.add('is-read');
      else bs[i].classList.remove('is-read');
    }
  }

  function tudo() {
    desenhaRegua();
    desenhaLeitura();
    desenhaComandos();
  }

  /* ------------------------------------------------------------ comandos */

  controls.addEventListener('click', function (ev) {
    var alvo = ev.target.closest('[data-regiao-chip], [data-accao]');
    if (!alvo) return;

    var accao = alvo.getAttribute('data-accao');
    if (accao === 'todas') {
      REGIOES.forEach(function (r) {
        activa[r.id] = true;
      });
      sobre = null;
      tudo();
      return;
    }
    if (accao === 'repor') {
      activa = {};
      activa[predefinida] = true;
      fixa = predefinida;
      sobre = null;
      tudo();
      return;
    }

    var id = alvo.getAttribute('data-regiao-chip');
    activa[id] = !activa[id];
    if (activa[id]) {
      fixa = id;
    } else if (fixa === id) {
      var proxima = REGIOES.filter(function (q) {
        return activa[q.id];
      })[0];
      if (proxima) {
        fixa = proxima.id;
      } else {
        activa[id] = true; // a régua nunca fica vazia
      }
    }
    sobre = null;
    tudo();
  });

  controls.addEventListener(
    'mouseover',
    function (ev) {
      var alvo = ev.target.closest('[data-regiao-chip]');
      if (!alvo) return;
      var id = alvo.getAttribute('data-regiao-chip');
      if (activa[id]) {
        sobre = id;
        tudo();
      }
    },
    true,
  );
  controls.addEventListener(
    'mouseout',
    function () {
      sobre = null;
      tudo();
    },
    true,
  );
  controls.addEventListener(
    'focus',
    function (ev) {
      var alvo = ev.target.closest('[data-regiao-chip]');
      if (!alvo) return;
      var id = alvo.getAttribute('data-regiao-chip');
      if (activa[id]) {
        sobre = id;
        tudo();
      }
    },
    true,
  );
  controls.addEventListener(
    'blur',
    function () {
      sobre = null;
      tudo();
    },
    true,
  );

  /* os comandos só existem quando há JavaScript para os fazer funcionar */
  controls.hidden = false;
  if (semJs) semJs.hidden = true;

  tudo();

  /* uma segunda passagem quando as métricas de texto já são reais */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(desenhaRegua);
  }
})();
