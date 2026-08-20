/* =============================================================================
 * A PRIMEIRA PÁGINA — enriquecimento progressivo.
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é uma regra e não um estilo (resposta 3 da
 * direcção à crítica cruzada, 20.08.2026):
 *
 *   · trocar `hidden`, `open`, `aria-pressed` e `aria-current`;
 *   · escrever o `textContent` de dois `<span data-slot>` marcados, com texto
 *     COPIADO de um nó que o servidor já escreveu (o nome e o distrito do
 *     concelho, lidos da ilha da CAOP dentro do mapa), e o da região viva, que
 *     junta duas cadeias que já estão na página;
 *   · mexer no endereço com `history.pushState` e `history.replaceState`.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. Tudo o que a página mostra em qualquer estado
 * veio do servidor e passou pelo portão de HTML.
 *
 * Sem este ficheiro a página é o âmbito País em Relance, completa e correcta.
 *
 * ---------------------------------------------------------------------------
 * O ESQUEMA DO ENDEREÇO É FECHADO, E RESOLVE-SE CONTRA O QUE ESTÁ NA PÁGINA
 * ---------------------------------------------------------------------------
 *   ?ambito=pais | regiao:<slug> | municipio:<slug>     (por defeito: pais)
 *   ?densidade=relance | leitura                        (por defeito: relance)
 *
 * As listas fechadas não são escritas aqui: são LIDAS do documento — os blocos
 * de cabeça (`[data-cabeca]`) dão os âmbitos com bloco próprio, e os pontos do
 * mapa (`[data-caop]`) dão os 308 concelhos. Uma lista escrita aqui divergiria
 * da do servidor à primeira alteração; esta não pode divergir, porque é a mesma.
 *
 * Um valor que não esteja nas listas cai no defeito, EM SILÊNCIO e sem texto de
 * erro, e o endereço é reescrito para a forma normalizada.
 * ========================================================================== */
(function () {
  'use strict';

  var raiz = document.querySelector('[data-inicio]');
  if (!raiz) return;

  var AMBITO_DEFEITO = 'pais';
  var DENSIDADE_DEFEITO = 'relance';

  /* As notas que explicam o que não funciona sem script saem quando há script. */
  var notas = document.querySelectorAll('[data-sem-js]');
  for (var n = 0; n < notas.length; n++) notas[n].hidden = true;

  /* ---------------------------------------------------------------- listas */

  var blocos = document.querySelectorAll('[data-cabeca]');
  var paineis = document.querySelectorAll('[data-painel]');
  var comBloco = {};
  for (var b = 0; b < blocos.length; b++) comBloco[blocos[b].getAttribute('data-cabeca')] = true;

  var mapa = document.querySelector('[data-mapa]');
  var tela = document.querySelector('[data-mapa-wrap]');
  var pontos = [];
  var porSlug = {};
  if (mapa) {
    var nos = mapa.querySelectorAll('[data-pontos] [data-caop]');
    for (var i = 0; i < nos.length; i++) {
      var el = nos[i];
      var pt = {
        el: el,
        x: parseFloat(el.getAttribute('x')) + parseFloat(el.getAttribute('width')) / 2,
        y: parseFloat(el.getAttribute('y')) + parseFloat(el.getAttribute('height')) / 2,
        nome: el.getAttribute('data-m'),
        distrito: el.getAttribute('data-d') || '',
        slug: el.getAttribute('data-caop'),
        comPagina: el.classList.contains('mun-com-pagina'),
      };
      pontos.push(pt);
      porSlug[pt.slug] = pt;
    }
  }

  function resolveAmbito(bruto) {
    if (!bruto) return AMBITO_DEFEITO;
    if (bruto === AMBITO_DEFEITO) return AMBITO_DEFEITO;
    if (bruto.indexOf('regiao:') === 0) return comBloco[bruto] ? bruto : AMBITO_DEFEITO;
    if (bruto.indexOf('municipio:') === 0) {
      return porSlug[bruto.slice('municipio:'.length)] ? bruto : AMBITO_DEFEITO;
    }
    return AMBITO_DEFEITO;
  }

  function resolveDensidade(bruto) {
    return bruto === 'leitura' ? 'leitura' : DENSIDADE_DEFEITO;
  }

  function modoDe(ambito) {
    if (ambito.indexOf('regiao:') === 0) return 'regiao';
    if (ambito.indexOf('municipio:') === 0) return 'municipio';
    return 'pais';
  }

  /* --------------------------------------------------------------- endereço */

  function pesquisaDe(estado) {
    var p = new URLSearchParams();
    if (estado.ambito !== AMBITO_DEFEITO) p.set('ambito', estado.ambito);
    if (estado.densidade !== DENSIDADE_DEFEITO) p.set('densidade', estado.densidade);
    var q = p.toString();
    return q ? '?' + q : '';
  }

  function leDoEndereco() {
    var p = new URLSearchParams(location.search);
    return {
      ambito: resolveAmbito(p.get('ambito')),
      densidade: resolveDensidade(p.get('densidade')),
    };
  }

  /* ---------------------------------------------------------- os comandos */

  var segsAmbito = raiz.querySelectorAll('[data-modo]');
  var segsDensidade = raiz.querySelectorAll('[data-densidade]');
  var subs = raiz.querySelectorAll('[data-sub]');
  var chips = raiz.querySelectorAll('[data-regiao]');
  var escolhas = raiz.querySelectorAll('[data-escolher]');
  var caixaDaBanda = raiz.querySelector('[data-banda-caixa]');
  var gruposDaBanda = raiz.querySelectorAll('[data-banda]');
  var pontosDaBanda = raiz.querySelectorAll('[data-banda-ponto]');
  var ficha = raiz.querySelector('[data-mapa-ficha]');
  var cartao = raiz.querySelector('[data-mapa-cartao]');
  var soEvora = raiz.querySelector('[data-so-evora]');
  var dicaEscolher = raiz.querySelector('[data-hint-escolher]');
  var anuncio = raiz.querySelector('[data-anuncio]');
  var soPais = document.querySelectorAll('[data-so-pais]');
  var pecas = document.querySelectorAll('.peca-mais');
  var campo = raiz.querySelector('[data-pesquisa]');
  var semResultado = raiz.querySelector('[data-sem-resultado]');
  var ligacaoDeIdioma = document.querySelector('a.lang');
  var baseDoIdioma = ligacaoDeIdioma ? ligacaoDeIdioma.getAttribute('href').split('?')[0] : null;

  /* Os comandos passam de ligações a botões: com script, a página muda sem
     recarregar, e o que se anuncia é um estado premido e não um destino. O
     `href` fica, e passa a ser a forma do estado — assim continua a copiar-se,
     a abrir noutro separador e a partilhar-se. */
  for (var a = 0; a < segsAmbito.length; a++) {
    segsAmbito[a].setAttribute('role', 'button');
    segsAmbito[a].removeAttribute('aria-current');
  }
  for (var d = 0; d < segsDensidade.length; d++) {
    segsDensidade[d].setAttribute('role', 'button');
    segsDensidade[d].removeAttribute('aria-current');
  }

  var estado = leDoEndereco();
  var modoEscolhido = modoDe(estado.ambito);

  function mostraSo(lista, atributo, chave) {
    for (var k = 0; k < lista.length; k++) {
      lista[k].hidden = lista[k].getAttribute(atributo) !== chave;
    }
  }

  function chaveDoBloco(ambito) {
    return comBloco[ambito] ? ambito : 'vazio';
  }

  function aplica(estadoNovo, modo) {
    estado = estadoNovo;
    var ambito = estado.ambito;
    var mo = modo || modoDe(ambito);
    modoEscolhido = mo;
    raiz.setAttribute('data-ambito', ambito);
    raiz.setAttribute('data-densidade', estado.densidade);
    raiz.setAttribute('data-modo', mo);

    for (var i1 = 0; i1 < segsAmbito.length; i1++) {
      segsAmbito[i1].setAttribute(
        'aria-pressed',
        segsAmbito[i1].getAttribute('data-modo') === mo ? 'true' : 'false',
      );
    }
    for (var i2 = 0; i2 < segsDensidade.length; i2++) {
      segsDensidade[i2].setAttribute(
        'aria-pressed',
        segsDensidade[i2].getAttribute('data-densidade') === estado.densidade ? 'true' : 'false',
      );
    }
    for (var i3 = 0; i3 < subs.length; i3++) {
      subs[i3].hidden = subs[i3].getAttribute('data-sub') !== mo;
    }

    var slug = ambito.indexOf('municipio:') === 0 ? ambito.slice('municipio:'.length) : null;
    var ponto = slug ? porSlug[slug] : null;
    var regiao = ambito.indexOf('regiao:') === 0 ? ambito.slice('regiao:'.length) : null;

    /* Os dois `data-slot`: o nome e o distrito daquele concelho, copiados do nó
       que o servidor escreveu. É o único texto que este ficheiro põe à vista. */
    if (ponto) {
      var slotsNome = document.querySelectorAll('[data-slot="nome"]');
      for (var s1 = 0; s1 < slotsNome.length; s1++) slotsNome[s1].textContent = ponto.nome;
      var slotsDist = document.querySelectorAll('[data-slot="distrito"]');
      for (var s2 = 0; s2 < slotsDist.length; s2++) slotsDist[s2].textContent = ponto.distrito;
    }

    var chave = chaveDoBloco(ambito);
    mostraSo(blocos, 'data-cabeca', chave);
    mostraSo(paineis, 'data-painel', chave);

    for (var i4 = 0; i4 < chips.length; i4++) {
      chips[i4].setAttribute(
        'aria-pressed',
        chips[i4].getAttribute('data-regiao') === regiao ? 'true' : 'false',
      );
    }
    for (var i5 = 0; i5 < escolhas.length; i5++) {
      escolhas[i5].setAttribute(
        'aria-pressed',
        escolhas[i5].getAttribute('data-escolher') === slug ? 'true' : 'false',
      );
    }

    if (caixaDaBanda) caixaDaBanda.hidden = mo !== 'regiao';
    for (var i6 = 0; i6 < gruposDaBanda.length; i6++) {
      gruposDaBanda[i6].hidden = gruposDaBanda[i6].getAttribute('data-banda') !== regiao;
    }
    for (var i7 = 0; i7 < pontosDaBanda.length; i7++) {
      var eEste = pontosDaBanda[i7].getAttribute('data-banda-ponto') === regiao;
      pontosDaBanda[i7].classList.toggle('is-escolhido', eEste);
      pontosDaBanda[i7].setAttribute('r', eEste ? '6' : '3.5');
    }

    /* A postura do mapa. Ficha inteira no País e na escolha; cartão localizador
       quando um concelho está escolhido e a leitura aprofunda (Emenda 3). */
    var comCartao = !!ponto && estado.densidade !== 'relance';
    if (ficha) ficha.hidden = comCartao || mo === 'regiao';
    if (cartao) cartao.hidden = !comCartao;
    if (soEvora) soEvora.hidden = !(ponto && ponto.comPagina);
    if (dicaEscolher) dicaEscolher.hidden = mo !== 'municipio';
    var figura = raiz.querySelector('[data-mapa-raiz]');
    if (figura) {
      figura.hidden = mo === 'regiao';
      figura.setAttribute('data-postura', comCartao ? 'localizador' : 'inteiro');
    }
    for (var i8 = 0; i8 < pontos.length; i8++) {
      pontos[i8].el.classList.toggle('mun-escolhido', pontos[i8].slug === slug);
    }

    for (var i9 = 0; i9 < soPais.length; i9++) soPais[i9].hidden = ambito !== AMBITO_DEFEITO;

    /* A densidade: o comando global abre ou fecha todas as peças. Um toque numa
       peça muda só a dela, e não mexe nas outras — é a regra da prancha. */
    for (var i10 = 0; i10 < pecas.length; i10++) pecas[i10].open = estado.densidade === 'leitura';

    if (ligacaoDeIdioma && baseDoIdioma !== null) {
      ligacaoDeIdioma.setAttribute('href', baseDoIdioma + pesquisaDe(estado));
    }
  }

  /* A mudança dita por palavras, e as palavras já estão na página: o rótulo do
     âmbito que passou a estar aceso e o rótulo da densidade escolhida. */
  function anuncia() {
    if (!anuncio) return;
    var bloco = document.querySelector('[data-cabeca="' + chaveDoBloco(estado.ambito) + '"]');
    var rotulo = bloco ? bloco.querySelector('.cabeca-rotulo') : null;
    var seg = raiz.querySelector('[data-densidade][aria-pressed="true"]');
    var partes = [];
    if (rotulo) partes.push(rotulo.textContent.replace(/\s+/g, ' ').trim());
    if (seg) partes.push(seg.textContent.replace(/\s+/g, ' ').trim());
    anuncio.textContent = partes.join(' · ');
  }

  function vai(estadoNovo, modo, foco) {
    aplica(estadoNovo, modo);
    history.pushState(
      { ambito: estado.ambito, densidade: estado.densidade, modo: modoEscolhido },
      '',
      location.pathname + pesquisaDe(estado) + location.hash,
    );
    anuncia();
    if (foco && foco.focus) foco.focus();
  }

  /* ------------------------------------------------------------- os ouvintes */

  for (var c1 = 0; c1 < segsAmbito.length; c1++) {
    (function (botao) {
      botao.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modo = botao.getAttribute('data-modo');
        /* «Região» e «Município» abrem a fila de escolha e não mudam o âmbito:
           só há âmbito quando há uma região ou um concelho escolhido. «País» é
           um âmbito e escolhe-se a si próprio. */
        var novo = modo === 'pais' ? { ambito: AMBITO_DEFEITO, densidade: estado.densidade } : estado;
        vai(novo, modo, botao);
      });
    })(segsAmbito[c1]);
  }

  for (var c2 = 0; c2 < segsDensidade.length; c2++) {
    (function (botao) {
      botao.addEventListener('click', function (ev) {
        ev.preventDefault();
        vai(
          { ambito: estado.ambito, densidade: botao.getAttribute('data-densidade') },
          modoEscolhido,
          botao,
        );
      });
    })(segsDensidade[c2]);
  }

  for (var c3 = 0; c3 < chips.length; c3++) {
    (function (chip) {
      chip.addEventListener('click', function (ev) {
        ev.preventDefault();
        vai(
          { ambito: 'regiao:' + chip.getAttribute('data-regiao'), densidade: estado.densidade },
          'regiao',
          chip,
        );
      });
    })(chips[c3]);
  }

  for (var c4 = 0; c4 < escolhas.length; c4++) {
    (function (botao) {
      botao.addEventListener('click', function (ev) {
        ev.preventDefault();
        vai(
          { ambito: 'municipio:' + botao.getAttribute('data-escolher'), densidade: estado.densidade },
          'municipio',
          botao,
        );
      });
    })(escolhas[c4]);
  }

  /* A pesquisa: os resultados já estão na página e o que isto faz é tirar-lhes o
     `hidden`. Oito, no máximo, e a ordem é a da Carta. */
  if (campo) {
    var itens = raiz.querySelectorAll('.pesquisa-item');
    var MAX = 8;
    var filtra = function () {
      var q = campo.value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
      var vistos = 0;
      for (var j = 0; j < itens.length; j++) {
        /* Caixa vazia: ficam à vista os concelhos que têm página, que é o que o
           servidor já rendeu. Caixa com texto: os oito primeiros que casam. */
        var casa =
          q.length > 0
            ? itens[j].getAttribute('data-normal').indexOf(q) >= 0
            : itens[j].hasAttribute('data-tem-pagina');
        var mostrar = casa && vistos < MAX;
        itens[j].hidden = !mostrar;
        if (mostrar) vistos++;
      }
      if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
    };
    campo.addEventListener('input', filtra);
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      campo.value = '';
      filtra();
      ev.stopPropagation();
    });
  }

  /* Um toque no mapa escolhe o concelho mais próximo, e só quando a página está
     a escolher: fora daí os pontos não são alvos. */
  if (mapa) {
    var alvos = mapa.querySelectorAll('[data-alvos] [data-caop]');
    for (var c5 = 0; c5 < alvos.length; c5++) {
      (function (alvo) {
        alvo.addEventListener('click', function () {
          if (modoEscolhido !== 'municipio') return;
          vai(
            { ambito: 'municipio:' + alvo.getAttribute('data-caop'), densidade: estado.densidade },
            'municipio',
            tela,
          );
        });
      })(alvos[c5]);
    }
  }

  /* --------------------------------------------------- o selo do país, no telemóvel
   *
   * Emenda 3: no telemóvel o mapa não é seletor ponto a ponto — o selo inteiro é
   * o alvo, e um toque devolve os concelhos MAIS PRÓXIMOS como botões. Os botões
   * não são criados aqui: são os mesmos 308 resultados da pesquisa que o
   * servidor já rendeu, e o que isto faz é tirar o `hidden` aos oito mais
   * próximos do sítio onde o dedo tocou. Nenhuma distância é escrita.
   */
  var seloDoPais = raiz.querySelector('.movel-selo');
  if (seloDoPais && mapa) {
    seloDoPais.addEventListener('click', function (ev) {
      ev.preventDefault();
      var r = mapa.getBoundingClientRect();
      var caixa2 = mapa.viewBox && mapa.viewBox.baseVal;
      var LW = caixa2 && caixa2.width ? caixa2.width : 600;
      var LH = caixa2 && caixa2.height ? caixa2.height : 790;
      var px = ((ev.clientX - r.left) / r.width) * LW;
      var py = ((ev.clientY - r.top) / r.height) * LH;
      var ordenados = pontos
        .map(function (pt3) {
          var dx3 = pt3.x - px;
          var dy3 = pt3.y - py;
          return { slug: pt3.slug, d: dx3 * dx3 + dy3 * dy3 };
        })
        .sort(function (x, y) {
          return x.d - y.d;
        })
        .slice(0, 8);
      var perto = {};
      for (var z = 0; z < ordenados.length; z++) perto[ordenados[z].slug] = true;
      var itens2 = raiz.querySelectorAll('.pesquisa-item');
      for (var z2 = 0; z2 < itens2.length; z2++) {
        var botao2 = itens2[z2].querySelector('[data-escolher]');
        itens2[z2].hidden = !(botao2 && perto[botao2.getAttribute('data-escolher')]);
      }
      if (semResultado) semResultado.hidden = true;
      vai({ ambito: estado.ambito, densidade: estado.densidade }, 'municipio', campo || seloDoPais);
    });
  }

  /* «trocar de concelho» leva de volta à fila de escolha, e o foco vai com ele. */
  var trocar = raiz.querySelector('[data-trocar]');
  if (trocar && campo) {
    trocar.addEventListener('click', function (ev) {
      ev.preventDefault();
      vai({ ambito: AMBITO_DEFEITO, densidade: estado.densidade }, 'municipio', campo);
    });
  }

  window.addEventListener('popstate', function () {
    aplica(leDoEndereco(), null);
    anuncia();
  });

  /* --------------------------------------------------------------- o arranque
   *
   * O endereço é normalizado à chegada, com `replaceState`: um valor inválido ou
   * desconhecido não fica escrito na barra a fingir que existe, e um valor por
   * defeito não fica escrito a repetir o que o defeito já diz. */
  aplica(estado, null);
  var normalizado = location.pathname + pesquisaDe(estado) + location.hash;
  if (normalizado !== location.pathname + location.search + location.hash) {
    history.replaceState(
      { ambito: estado.ambito, densidade: estado.densidade, modo: modoEscolhido },
      '',
      normalizado,
    );
  }

  /* ------------------------------------------------------------------ o mapa
   *
   * A leitura ponto a ponto: cursor, teclado e o nome do concelho numa região
   * viva. Os pontos não são criados aqui: são lidos do que o servidor desenhou,
   * e nenhum número é escrito.
   */
  if (mapa && tela && pontos.length) {
    var nome = document.querySelector('[data-readout-nome]');
    var sub = document.querySelector('[data-readout-sub]');
    var dica = document.querySelector('[data-readout-hint]');
    var teclado = document.querySelector('[data-teclado]');

    var caixa = mapa.viewBox && mapa.viewBox.baseVal;
    var W = caixa && caixa.width ? caixa.width : 600;
    var H = caixa && caixa.height ? caixa.height : 790;

    var iComPagina = 0;
    for (var k2 = 0; k2 < pontos.length; k2++) {
      if (pontos[k2].comPagina) {
        iComPagina = k2;
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
      var pt2 = pontos[j];
      anel.setAttribute('cx', pt2.x);
      anel.setAttribute('cy', pt2.y);
      anel.style.display = '';
      if (dica) dica.hidden = true;
      if (nome) {
        nome.hidden = false;
        nome.textContent = pt2.nome;
      }
      if (sub) {
        sub.hidden = false;
        sub.textContent = pt2.distrito;
      }
    };

    var maisPerto = function (px, py) {
      var melhor = -1;
      var d2 = 18 * 18;
      for (var m = 0; m < pontos.length; m++) {
        var dx = pontos[m].x - px;
        var dy = pontos[m].y - py;
        var dd = dx * dx + dy * dy;
        if (dd < d2) {
          d2 = dd;
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
      var q2 = paraCampo(ev);
      var j2 = maisPerto(q2.x, q2.y);
      if (j2 !== sel) mostra(j2);
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
      if (ev.key === 'Enter' || ev.key === ' ') {
        if (modoEscolhido !== 'municipio' || sel < 0) return;
        ev.preventDefault();
        vai(
          { ambito: 'municipio:' + pontos[sel].slug, densidade: estado.densidade },
          'municipio',
          tela,
        );
        return;
      }
      if (ev.key === 'Home') {
        modoTeclado = true;
        mostra(iComPagina);
        ev.preventDefault();
        return;
      }
      var dir = DIRS[ev.key];
      if (!dir) return;
      ev.preventDefault();
      modoTeclado = true;
      if (sel < 0) {
        mostra(iComPagina);
        return;
      }
      var cur = pontos[sel];
      var melhor2 = -1;
      var pontuacao = Infinity;
      for (var j3 = 0; j3 < pontos.length; j3++) {
        if (j3 === sel) continue;
        var dx2 = pontos[j3].x - cur.x;
        var dy2 = pontos[j3].y - cur.y;
        var aoLongo = dx2 * dir[0] + dy2 * dir[1];
        if (aoLongo <= 0) continue;
        var deLado = Math.abs(dx2 * dir[1] - dy2 * dir[0]);
        if (deLado > aoLongo * 1.6) continue; /* fica dentro de ~58 graus do eixo */
        var s3 = aoLongo + deLado * 2.2;
        if (s3 < pontuacao) {
          pontuacao = s3;
          melhor2 = j3;
        }
      }
      if (melhor2 >= 0) mostra(melhor2);
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
})();
