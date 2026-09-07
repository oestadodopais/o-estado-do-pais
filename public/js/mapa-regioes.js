/* =============================================================================
 * O MAPA QUE CRESCE, E O NOME AO LADO (bloco F1.1d, 07.09.2026)
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO FAZ
 * ---------------------------------------------------------------------------
 *   · escreve no lugar do nome o nome da área apontada, COPIADO do `data-u` que
 *     o servidor desenhou, e o destino da porta, COPIADO do `href` dela;
 *   · faz crescer uma região: troca o `viewBox` do mesmo `<svg>` e desenha os
 *     concelhos dessa região do ficheiro que a área nomeia;
 *   · mexe no endereço com `history.pushState`, para que o nível se possa citar
 *     e o botão de voltar do navegador funcione.
 *
 * ---------------------------------------------------------------------------
 * A REGRA QUE ELE QUEBRA, E AS TRÊS AMARRAS
 * ---------------------------------------------------------------------------
 * `inicio.js`, `municipios.js` e `correcoes.js` podem trocar `hidden` e mais
 * nada: nunca `innerHTML`, nunca criar texto visível (resposta 3 da direção,
 * 20.08.2026). Este cria elementos e escreve texto, como `livro.js` faz para a
 * busca do índice, e pela mesma razão medida: ou o documento leva os 308
 * concelhos das nove regiões escondidos, ou o guião desenha os da região que o
 * leitor abriu. Os nove ficheiros pesam 237 KB, e o segundo caminho é o que não
 * os põe em cada visita à primeira página.
 *
 * As amarras são as de `livro.js`, e são três:
 *
 *   1. **nada é composto aqui.** Cada cadeia escrita vem, tal e qual, do
 *      ficheiro `/dados/mapa/regiao-<slug>.json`, e escreve-se por `textContent`,
 *      nunca por `innerHTML`. Os nove ficheiros são escritos na construção por
 *      `scripts/mapa-regioes.mjs`, dos artefactos da CAOP 2025 que o motor
 *      exportou, e o portão `check:mapa` (R8 e R9) reconfere-os: os 308 uma vez
 *      cada, cada um na região que a Carta lhe dá, e a geometria de cada região
 *      igual à união dos seus concelhos;
 *   2. **nenhum valor.** Os ficheiros não levam um único número do livro-razão:
 *      levam nomes de lugar e geometria. Quem quer o número de um concelho abre
 *      a página dele, que é o que a porta abre;
 *   3. **nenhuma contagem.** Não se escreve «86 concelhos» em lado nenhum.
 *
 * O QUE MAIS NÃO SE FAZ: não se monta o endereço de página nenhuma. O destino de
 * uma região é o `href` que o servidor escreveu na sua área; o de um concelho é o
 * gabarito da rota (`data-rota-concelho`), com o slug no lugar que o `:slug`
 * marca, que é a disciplina que a Emenda 21b já pôs no comando «Região».
 *
 * ---------------------------------------------------------------------------
 * O PRIMEIRO TOQUE NUNCA NAVEGA
 * ---------------------------------------------------------------------------
 * A medida P3 do brief: «o primeiro toque numa região ou num concelho nunca
 * navega; o segundo, ou a porta, abre a página certa». Uma região cresce ao
 * primeiro toque (é o que o diretor pediu a 04.09: «once we press a region,
 * we'll have the name of the region and then it opens the map with the
 * municipalities»), e crescer não é navegar: a porta do lugar do nome é que abre
 * a página da região. Um concelho diz o nome ao primeiro toque e abre ao
 * segundo, no mesmo concelho.
 *
 * PELO TECLADO, O FOCO É O PRIMEIRO TOQUE. Chegar a uma área com Tab põe-lhe o
 * nome no lugar, que é o que o primeiro toque faz; o Enter é o segundo, e faz o
 * que o segundo toque faz: cresce a região, ou abre a página do concelho. É
 * assim que «Enter faz o que o toque faz» sem pedir dois Enter a quem já viu o
 * nome ao chegar.
 *
 * SEM ESTE FICHEIRO a primeira página é o nível do país, inteiro: nove áreas,
 * cada uma a ligação da sua página, e a lista fechada dos nomes por baixo.
 * ========================================================================== */
(function () {
  'use strict';

  var figura = document.querySelector('[data-mapa-raiz][data-nivel]');
  var svg = document.querySelector('[data-mapa-areas]');
  var grupoDoPais = document.querySelector('[data-areas]');
  var grupoDaRegiao = document.querySelector('[data-areas-concelhos]');
  var lugar = document.querySelector('[data-mapa-nome]');
  if (!figura || !svg || !grupoDoPais || !grupoDaRegiao || !lugar) return;

  var texto = lugar.querySelector('[data-mapa-nome-texto]');
  var porta = lugar.querySelector('[data-mapa-porta]');
  var voltar = lugar.querySelector('[data-mapa-voltar]');
  var vazias = lugar.querySelectorAll('[data-mapa-vazio]');
  if (!texto || !porta || !voltar || vazias.length !== 4) return;

  var SVGNS = 'http://www.w3.org/2000/svg';

  /* `hidden` NÃO É UMA PROPRIEDADE DE UM ELEMENTO DE SVG, e foi medido: `hidden`
     é do `HTMLElement`, e um `<g>` é um `SVGElement`. Escrever-lhe `el.hidden =
     false` põe uma propriedade nova no objecto e deixa o atributo onde estava,
     e o grupo continua escondido pela folha enquanto o guião pensa que o abriu.
     Nos dois grupos do mapa troca-se o ATRIBUTO, que é o que a folha lê. */
  function esconde(el, sim) {
    if (sim) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }
  var CAMPO_DO_PAIS = svg.getAttribute('viewBox');
  var ROTA_DO_CONCELHO = svg.getAttribute('data-rota-concelho') || '';
  var ROTULO_PAIS = svg.getAttribute('data-rotulo-pais') || '';
  var ROTULO_REGIAO = svg.getAttribute('data-rotulo-regiao') || '';

  /** As regiões já descarregadas, uma entrada por slug. */
  var guardadas = {};
  /** O slug da região aberta, ou vazio no nível do país. */
  var aberta = '';
  /** O concelho que o dedo já tocou uma vez, para saber se o toque é o segundo. */
  var tocada = '';
  /** O gesto do último apontador, para os navegadores em que o clique não o diz. */
  var tipoDoGesto = '';

  /* ---------------------------------------------------------------- o nome */

  /* AS QUATRO FRASES VAZIAS: duas por nível, uma para o dedo e outra para o
     rato. O `hidden` diz de que nível é cada uma, e a folha escolhe entre o dedo
     e o rato pelo apontador do leitor. */
  function mostraVazio() {
    texto.hidden = true;
    texto.textContent = '';
    porta.hidden = true;
    for (var i = 0; i < vazias.length; i++) {
      var qual = vazias[i].getAttribute('data-mapa-vazio') || '';
      vazias[i].hidden = qual.indexOf(aberta === '' ? 'pais' : 'regiao') !== 0;
    }
  }

  /**
   * O nome e o destino da área apontada, os dois copiados do que o servidor (ou
   * o desenho da região) já tem escrito na própria área.
   */
  function mostra(area) {
    var caminho = area.querySelector('path');
    var nome = caminho ? caminho.getAttribute('data-u') : null;
    var destino = area.getAttribute('href');
    if (!nome || !destino) return;
    texto.textContent = nome;
    texto.hidden = false;
    porta.setAttribute('href', destino);
    porta.hidden = false;
    for (var i = 0; i < vazias.length; i++) vazias[i].hidden = true;
  }

  /* ------------------------------------------------------------- os níveis */

  /** O desenho de uma região, do ficheiro que a sua área nomeia. */
  function desenha(dados) {
    while (grupoDaRegiao.firstChild) grupoDaRegiao.removeChild(grupoDaRegiao.firstChild);
    for (var i = 0; i < dados.concelhos.length; i++) {
      var c = dados.concelhos[i];
      var a = document.createElementNS(SVGNS, 'a');
      a.setAttribute('class', 'uni-porta');
      a.setAttribute('href', ROTA_DO_CONCELHO.replace(':slug', c.slug));
      a.setAttribute('data-concelho-porta', c.slug);
      var titulo = document.createElementNS(SVGNS, 'title');
      titulo.textContent = c.nome;
      a.appendChild(titulo);
      var caminho = document.createElementNS(SVGNS, 'path');
      caminho.setAttribute('class', 'uni');
      caminho.setAttribute('d', c.d);
      caminho.setAttribute('data-u', c.nome);
      caminho.setAttribute('data-tipo', 'concelho');
      caminho.setAttribute('data-unidade', c.slug);
      a.appendChild(caminho);
      grupoDaRegiao.appendChild(a);
    }
    svg.setAttribute('viewBox', '0 0 ' + dados.campo.largura + ' ' + dados.campo.altura);
  }

  function paraOPais() {
    tocada = '';
    var saiuDe = aberta;
    var voltarTinhaFoco = document.activeElement === voltar;
    aberta = '';
    svg.setAttribute('viewBox', CAMPO_DO_PAIS);
    if (ROTULO_PAIS) svg.setAttribute('aria-label', ROTULO_PAIS);
    esconde(grupoDaRegiao, true);
    esconde(grupoDoPais, false);
    figura.setAttribute('data-nivel', 'pais');
    voltar.hidden = true;
    mostraVazio();
    /* E volta com ele: quem estava dentro da região, ou na porta de voltar, fica
       na área da região de onde saiu. */
    if (voltarTinhaFoco || grupoDaRegiao.contains(document.activeElement)) {
      var area = grupoDoPais.querySelector('[data-uni-porta="' + saiuDe + '"]');
      if (area && area.focus) area.focus({ preventScroll: true });
    }
  }

  function paraARegiao(slug, dados, doTeclado) {
    guardadas[slug] = dados;
    aberta = slug;
    tocada = '';
    desenha(dados);
    if (ROTULO_REGIAO) svg.setAttribute('aria-label', ROTULO_REGIAO);
    esconde(grupoDoPais, true);
    esconde(grupoDaRegiao, false);
    figura.setAttribute('data-nivel', 'regiao');
    voltar.hidden = false;
    /* O nome da região fica no lugar, com a porta da página dela: quem acabou de
       a abrir vê onde está e tem a porta à mão. */
    var area = grupoDoPais.querySelector('[data-uni-porta="' + slug + '"]');
    if (area) mostra(area);
    else mostraVazio();
    /* O FOCO ACOMPANHA O NÍVEL, E SÓ QUANDO VEIO DO TECLADO. Quem cresceu a
       região com o Enter tinha o foco na área que acabou de desaparecer, e um
       foco dentro de um grupo escondido é um foco perdido: passa para a primeira
       área do nível novo, sem rolar a página. Quem tocou ou clicou não leva o
       foco a lado nenhum, e a razão é medida: o navegador também põe o foco na
       ligação que se clica, e mudá-lo daí disparava o `focusin` da primeira área
       do nível novo, que escrevia no lugar do nome o nome de um concelho que
       ninguém apontou. */
    if (doTeclado && grupoDoPais.contains(document.activeElement)) {
      var primeira = grupoDaRegiao.querySelector('[data-concelho-porta]');
      if (primeira && primeira.focus) primeira.focus({ preventScroll: true });
    }
  }

  /** A região, do que já foi descarregado ou do ficheiro que a área nomeia. */
  function abre(slug, ficheiro, entao) {
    if (guardadas[slug]) {
      entao(guardadas[slug]);
      return;
    }
    if (!ficheiro || typeof fetch !== 'function') return;
    fetch(ficheiro)
      .then(function (r) {
        if (!r.ok) throw new Error('sem resposta');
        return r.json();
      })
      .then(function (dados) {
        if (!dados || !dados.campo || !dados.concelhos || !dados.concelhos.length) return;
        entao(dados);
      })
      /* SEM O FICHEIRO, A LIGAÇÃO FAZ O QUE FARIA SEM GUIÃO: nada se acende e o
         toque seguinte na mesma área segue o `href` que o servidor escreveu. */
      .catch(function () {});
  }

  /* ---------------------------------------------------------- o endereço */

  function slugDoFragmento(fragmento) {
    var m = /^#regiao=([a-z0-9-]+)$/.exec(fragmento || '');
    if (!m) return '';
    return grupoDoPais.querySelector('[data-uni-porta="' + m[1] + '"]') ? m[1] : '';
  }

  function aplicaFragmento() {
    var slug = slugDoFragmento(location.hash);
    if (!slug) {
      if (aberta) paraOPais();
      return;
    }
    if (slug === aberta) return;
    var area = grupoDoPais.querySelector('[data-uni-porta="' + slug + '"]');
    abre(slug, area.getAttribute('data-ficheiro'), function (dados) {
      paraARegiao(slug, dados);
    });
  }

  /* ------------------------------------------------------------ os gestos */

  var areaDe = function (alvo) {
    return alvo && alvo.closest ? alvo.closest('[data-uni-porta], [data-concelho-porta]') : null;
  };

  /* O RATO APONTA, O DEDO TOCA, E OS DOIS NÃO SÃO O MESMO GESTO. Um toque num
     ecrã táctil faz o navegador disparar os eventos do rato antes do clique, e
     sem esta distinção o «primeiro toque» já teria apontado a área e o clique
     seguinte abriria a página: a medida P3 do brief cairia num telemóvel e
     passaria num portátil. `pointerType` é o que separa os dois. */
  var doApontador = function (ev) {
    return ev.pointerType === 'mouse' || ev.pointerType === 'pen';
  };
  for (var g = 0; g < 2; g++) {
    var raiz = g === 0 ? grupoDoPais : grupoDaRegiao;
    raiz.addEventListener('pointerover', function (ev) {
      if (!doApontador(ev)) return;
      var area = areaDe(ev.target);
      if (area) mostra(area);
    });
    /* O NOME NÃO SE APAGA AO SAIR DA ÁREA, e foi a régua que o mostrou: com o
       cursor a sair do mapa para clicar «Abrir →», o `pointerleave` limpava o
       lugar e a porta desaparecia debaixo do rato. O lugar do nome é fixo: fica
       com a última área apontada até outra ser apontada ou o nível mudar, e a
       frase vazia é o que ele diz antes do primeiro gesto. */
    /* O FOCO É O PRIMEIRO TOQUE, para quem chega pelo teclado: põe o nome no
       lugar, e deixa o Enter ser o segundo. */
    raiz.addEventListener('focusin', function (ev) {
      var area = areaDe(ev.target);
      if (area) mostra(area);
    });
  }

  /* O GESTO DO CLIQUE, LIDO DO PRÓPRIO CLIQUE E, ONDE ELE NÃO O DIZ, DO GESTO
     ANTERIOR. Medido a 07.09.2026 no Chromium: um toque dá
     `pointerover:touch`, `pointerdown:touch`, `touchstart`, `pointerup:touch`,
     `touchend`, `mouseover` e `click:touch`; um clique de rato dá
     `pointerover:mouse`, `mouseover`, `pointermove:mouse`, `pointerdown:mouse`,
     `pointerup:mouse` e `click:mouse`. O `pointerType` do clique chega para os
     separar; os dois ouvintes abaixo são a rede para um navegador que despache o
     clique como um `MouseEvent` sem esse campo. */
  svg.addEventListener('pointerdown', function (ev) {
    tipoDoGesto = ev.pointerType || '';
  });
  svg.addEventListener('touchstart', function () {
    tipoDoGesto = 'touch';
  }, { passive: true });

  svg.addEventListener('click', function (ev) {
    var area = areaDe(ev.target);
    if (!area) return;
    /* UM CLIQUE FEITO PELO ENTER NÃO TEM CONTAGEM DE CLIQUES: é por aí que se
       sabe que o gesto veio do teclado, e é só nesse caso que o foco muda de
       nível. */
    var doTeclado = ev.detail === 0;
    var slug = area.getAttribute('data-uni-porta');
    if (slug) {
      /* UMA REGIÃO CRESCE, E NÃO NAVEGA. A porta do lugar do nome é que abre a
         página dela, e ficou lá com o nome no mesmo gesto. */
      ev.preventDefault();
      mostra(area);
      abre(slug, area.getAttribute('data-ficheiro'), function (dados) {
        paraARegiao(slug, dados, doTeclado);
        history.pushState(null, '', location.pathname + location.search + '#regiao=' + slug);
      });
      return;
    }
    var concelho = area.getAttribute('data-concelho-porta');
    if (!concelho) return;
    /* O PRIMEIRO TOQUE NUM CONCELHO DIZ O NOME; O SEGUNDO, NO MESMO, ABRE.
       O dedo não passa por cima antes de tocar, e por isso o primeiro toque tem
       de ser o que o passar do rato é: dizer o nome. Com rato ou caneta o nome já
       está no lugar desde que o cursor lá entrou, e com o teclado desde que o Tab
       lá chegou: nesses o clique é o segundo gesto e abre a página. */
    var toque = (ev.pointerType || tipoDoGesto) === 'touch';
    if (toque && concelho !== tocada) {
      ev.preventDefault();
      tocada = concelho;
      mostra(area);
    }
  });

  /* O TECLADO NÃO PRECISA DE OUVINTE NENHUM: o Enter sobre uma ligação com foco
     dispara um clique, e o clique é o que está escrito acima. Numa região faz o
     que o toque faz, que é crescer; num concelho, onde o foco já pôs o nome no
     lugar, segue a ligação, que é o que o navegador faz sozinho. */

  voltar.addEventListener('click', function (ev) {
    ev.preventDefault();
    paraOPais();
    history.pushState(null, '', location.pathname + location.search);
  });

  window.addEventListener('popstate', aplicaFragmento);
  window.addEventListener('hashchange', aplicaFragmento);

  /* O lugar do nome só existe com guião, e é aqui que ele passa a existir. */
  lugar.hidden = false;
  mostraVazio();
  aplicaFragmento();
})();
