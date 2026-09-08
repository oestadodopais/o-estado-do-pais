/* =============================================================================
 * O MAPA QUE CRESCE, E O NOME AO LADO (blocos F1.1d e F1.1e, 07 e 08.09.2026)
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO FAZ
 * ---------------------------------------------------------------------------
 *   · escreve no lugar do nome o nome da área apontada, COPIADO do `data-u` que
 *     o servidor desenhou, e o destino da porta, COPIADO do `href` dela;
 *   · faz crescer uma unidade da Carta (um distrito ou uma ilha): troca o
 *     `viewBox` do mesmo `<svg>` e desenha os concelhos dessa unidade do
 *     ficheiro que a área nomeia;
 *   · mexe no endereço com `history.pushState`, para que o nível se possa citar
 *     e o botão de voltar do navegador funcione.
 *
 * O NÍVEL DO PAÍS SÃO AS 29 UNIDADES DA CARTA (F1.1e, 08.09.2026), e não as nove
 * regiões NUTS II que o F1.1d desenhou por um dia: «the map on the first page we
 * had before was quite alright», e a unidade é a área que um leitor português
 * reconhece pelo nome. O que este ficheiro faz não mudou; mudou o que cresce.
 *
 * ---------------------------------------------------------------------------
 * A REGRA QUE ELE QUEBRA, E AS TRÊS AMARRAS
 * ---------------------------------------------------------------------------
 * `inicio.js`, `municipios.js` e `correcoes.js` podem trocar `hidden` e mais
 * nada: nunca `innerHTML`, nunca criar texto visível (resposta 3 da direção,
 * 20.08.2026). Este cria elementos e escreve texto, como `livro.js` faz para a
 * busca do índice, e pela mesma razão medida: ou o documento leva os 308
 * concelhos das 29 unidades escondidos, ou o guião desenha os da unidade que o
 * leitor abriu. Os 29 ficheiros pesam 394 614 B, e o segundo caminho é o que não
 * os põe em cada visita à primeira página.
 *
 * As amarras são as de `livro.js`, e são três:
 *
 *   1. **nada é composto aqui.** Cada cadeia escrita vem, tal e qual, do
 *      ficheiro `/dados/mapa/unidade-<slug>.json`, e escreve-se por
 *      `textContent`, nunca por `innerHTML`. Os 29 ficheiros são, byte a byte, os
 *      artefactos `mapa/distritos/<slug>.json` que o motor exportou da CAOP 2025,
 *      copiados para `public/` por `scripts/mapa-unidades.mjs`, e o portão
 *      `check:mapa` (R8) reconfere-os contra os artefactos e contra o manifesto
 *      de resumos;
 *   2. **nenhum valor.** Os ficheiros não levam um único número do livro-razão:
 *      levam nomes de lugar e geometria. Quem quer o número de um concelho abre
 *      a página dele, que é o que a porta abre;
 *   3. **nenhuma contagem.** Não se escreve «86 concelhos» em lado nenhum.
 *
 * O QUE MAIS NÃO SE FAZ: não se monta o endereço de página nenhuma. O destino de
 * uma unidade é o `href` que o servidor escreveu na sua área; o de um concelho é o
 * gabarito da rota (`data-rota-concelho`), com o slug no lugar que o `:slug`
 * marca, que é a disciplina que a Emenda 21b já pôs no comando «Região».
 *
 * ---------------------------------------------------------------------------
 * O PRIMEIRO TOQUE NUNCA NAVEGA
 * ---------------------------------------------------------------------------
 * A medida U3 do brief: «o primeiro toque numa unidade ou num concelho nunca
 * navega; o segundo, ou a porta, abre a página certa». Uma unidade cresce ao
 * primeiro toque (é o que o diretor pediu a 04.09: «once we press a region,
 * we'll have the name of the region and then it opens the map with the
 * municipalities», e a 08.09 «we can select Évora and we have all the
 * municipalities»), e crescer não é navegar: a porta do lugar do nome é que abre
 * a página da unidade. Um concelho diz o nome ao primeiro toque e abre ao
 * segundo, no mesmo concelho.
 *
 * PELO TECLADO, O FOCO É O PRIMEIRO TOQUE. Chegar a uma área com Tab põe-lhe o
 * nome no lugar, que é o que o primeiro toque faz; o Enter é o segundo, e faz o
 * que o segundo toque faz: cresce a unidade, ou abre a página do concelho. É
 * assim que «Enter faz o que o toque faz» sem pedir dois Enter a quem já viu o
 * nome ao chegar.
 *
 * SEM ESTE FICHEIRO a primeira página é o nível do país, inteiro: 29 áreas, cada
 * uma a ligação da sua página, e a lista fechada dos nomes por baixo.
 * ========================================================================== */
(function () {
  'use strict';

  /* DUAS SUPERFÍCIES, E A SEGUNDA TEM UM NÍVEL SÓ. Na primeira página há dois
     grupos de áreas, o das 29 unidades e o dos concelhos da unidade aberta, e o
     desenho cresce entre eles; numa página de distrito ou de concelho há um
     grupo só, com os concelhos daquela unidade, e não há nada para crescer. O
     que é comum é o lugar do nome, e é isso que este guião faz nas duas. */
  var figura = document.querySelector('[data-mapa-raiz][data-nivel]');
  var svg = document.querySelector('[data-mapa-areas], [data-mapa-concelhos]');
  var grupoDoPais = svg ? svg.querySelector('[data-areas]') : null;
  var grupoDaUnidade = svg ? svg.querySelector('[data-areas-concelhos]') : null;
  var lugar = document.querySelector('[data-mapa-nome]');
  if (!figura || !svg || !grupoDoPais || !lugar) return;
  /** Há dois níveis? Só onde o segundo grupo existe. */
  var DOIS_NIVEIS = !!grupoDaUnidade;

  var texto = lugar.querySelector('[data-mapa-nome-texto]');
  var porta = lugar.querySelector('[data-mapa-porta]');
  var voltar = lugar.querySelector('[data-mapa-voltar]');
  var vazias = lugar.querySelectorAll('[data-mapa-vazio]');
  var aviso = lugar.querySelector('[data-mapa-aviso]');
  if (!texto || !porta || vazias.length !== (DOIS_NIVEIS ? 4 : 2)) return;
  if (DOIS_NIVEIS && !voltar) return;

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
  var ROTULO_UNIDADE = svg.getAttribute('data-rotulo-unidade') || '';

  /** As unidades já descarregadas, uma entrada por slug. */
  var guardadas = {};
  /** O slug da unidade aberta, ou vazio no nível do país. */
  var aberta = '';
  /** O concelho que o dedo já tocou uma vez, para saber se o toque é o segundo. */
  var tocada = '';
  /** O gesto do último apontador, para os navegadores em que o clique não o diz. */
  var tipoDoGesto = '';
  /** As unidades cujo ficheiro não veio: o clique seguinte segue a ligação. */
  var falhadas = {};

  /* ---------------------------------------------------------------- o nome */

  /* AS QUATRO FRASES VAZIAS: duas por nível, uma para o dedo e outra para o
     rato. O `hidden` diz de que nível é cada uma, e a folha escolhe entre o dedo
     e o rato pelo apontador do leitor. */
  function mostraVazio() {
    if (aviso) aviso.hidden = true;
    texto.hidden = true;
    texto.textContent = '';
    porta.hidden = true;
    var nivel = figura.getAttribute('data-nivel') || 'pais';
    for (var i = 0; i < vazias.length; i++) {
      var qual = vazias[i].getAttribute('data-mapa-vazio') || '';
      vazias[i].hidden = qual.indexOf(nivel) !== 0;
    }
  }

  /**
   * O nome e o destino da área apontada, os dois copiados do que o servidor (ou
   * o desenho da unidade) já tem escrito na própria área.
   */
  function mostra(area) {
    /* O NOME LÊ-SE DO `<title>` DA PRÓPRIA LIGAÇÃO, que é o nome acessível dela e
       o que o navegador mostra ao parar o cursor. É o nó que o servidor desenhou,
       e é o mesmo nos dois desenhos: o da primeira página marca o caminho com
       `data-u` e o de uma página de distrito com `data-m`, e ler o `<title>`
       poupa saber qual é qual. */
    var titulo = area.querySelector('title');
    var nome = titulo ? titulo.textContent.trim() : null;
    var destino = area.getAttribute('href');
    if (!nome || !destino) return;
    if (aviso) aviso.hidden = true;
    texto.textContent = nome;
    texto.hidden = false;
    porta.setAttribute('href', destino);
    porta.hidden = false;
    for (var i = 0; i < vazias.length; i++) vazias[i].hidden = true;
  }

  /* ------------------------------------------------------------- os níveis */

  /** O desenho de uma unidade, do ficheiro que a sua área nomeia. */
  function desenha(dados) {
    while (grupoDaUnidade.firstChild) grupoDaUnidade.removeChild(grupoDaUnidade.firstChild);
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
      grupoDaUnidade.appendChild(a);
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
    esconde(grupoDaUnidade, true);
    esconde(grupoDoPais, false);
    figura.setAttribute('data-nivel', 'pais');
    voltar.hidden = true;
    mostraVazio();
    /* E volta com ele: quem estava dentro da unidade, ou na porta de voltar,
       fica na área da unidade de onde saiu. */
    if (voltarTinhaFoco || grupoDaUnidade.contains(document.activeElement)) {
      var area = grupoDoPais.querySelector('[data-uni-porta="' + saiuDe + '"]');
      if (area && area.focus) area.focus({ preventScroll: true });
    }
  }

  function paraAUnidade(slug, dados, doTeclado) {
    guardadas[slug] = dados;
    aberta = slug;
    tocada = '';
    desenha(dados);
    if (ROTULO_UNIDADE) svg.setAttribute('aria-label', ROTULO_UNIDADE);
    esconde(grupoDoPais, true);
    esconde(grupoDaUnidade, false);
    figura.setAttribute('data-nivel', 'unidade');
    voltar.hidden = false;
    /* O nome da unidade fica no lugar, com a porta da página dela: quem acabou
       de a abrir vê onde está e tem a porta à mão. */
    var area = grupoDoPais.querySelector('[data-uni-porta="' + slug + '"]');
    if (area) mostra(area);
    else mostraVazio();
    /* O FOCO ACOMPANHA O NÍVEL, E SÓ QUANDO VEIO DO TECLADO. Quem cresceu a
       unidade com o Enter tinha o foco na área que acabou de desaparecer, e um
       foco dentro de um grupo escondido é um foco perdido: passa para a primeira
       área do nível novo, sem rolar a página. Quem tocou ou clicou não leva o
       foco a lado nenhum, e a razão é medida: o navegador também põe o foco na
       ligação que se clica, e mudá-lo daí disparava o `focusin` da primeira área
       do nível novo, que escrevia no lugar do nome o nome de um concelho que
       ninguém apontou. */
    if (doTeclado && grupoDoPais.contains(document.activeElement)) {
      var primeira = grupoDaUnidade.querySelector('[data-concelho-porta]');
      if (primeira && primeira.focus) primeira.focus({ preventScroll: true });
    }
  }

  /* UM PEDIDO QUE NÃO VOLTA NÃO PODE DEIXAR A LIGAÇÃO MORTA. A primeira forma
     desta função segurava o clique (`preventDefault`) e depois pedia o ficheiro;
     quando o pedido falhava, nada acendia e o clique seguinte era segurado
     outra vez, e outra: a área ficava sem destino nenhum, e o comentário que
     dizia que o toque seguinte seguia o `href` do servidor era falso. A leitura
     a frio do Codex de 08.09.2026 apanhou-o (achado 9).

     A regra passa a ser: a unidade que falhou fica marcada, o lugar do nome diz
     o que aconteceu, e O CLIQUE SEGUINTE NAQUELA ÁREA NÃO É SEGURADO, isto é,
     segue a ligação que o servidor escreveu e abre a página da unidade, que é a
     alternativa sem guião. Sem `fetch` no navegador nem se chega a segurar o
     primeiro. */
  function falhou(slug) {
    falhadas[slug] = true;
    if (aviso) aviso.hidden = false;
  }

  /** A unidade, do que já foi descarregado ou do ficheiro que a área nomeia. */
  function abre(slug, ficheiro, entao) {
    if (guardadas[slug]) {
      entao(guardadas[slug]);
      return;
    }
    if (!ficheiro) {
      falhou(slug);
      return;
    }
    fetch(ficheiro)
      .then(function (r) {
        if (!r.ok) throw new Error('sem resposta');
        return r.json();
      })
      .then(function (dados) {
        if (!dados || !dados.campo || !dados.concelhos || !dados.concelhos.length) {
          throw new Error('sem desenho');
        }
        entao(dados);
      })
      .catch(function () {
        falhou(slug);
      });
  }

  /* ---------------------------------------------------------- o endereço */

  function slugDoFragmento(fragmento) {
    var m = /^#unidade=([a-z0-9-]+)$/.exec(fragmento || '');
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
    if (typeof fetch !== 'function') return;
    abre(slug, area.getAttribute('data-ficheiro'), function (dados) {
      paraAUnidade(slug, dados);
    });
  }

  /* ------------------------------------------------------------ os gestos */

  var areaDe = function (alvo) {
    return alvo && alvo.closest ? alvo.closest('[data-uni-porta], [data-concelho-porta]') : null;
  };

  /* O RATO APONTA, O DEDO TOCA, E OS DOIS NÃO SÃO O MESMO GESTO. Um toque num
     ecrã táctil faz o navegador disparar os eventos do rato antes do clique, e
     sem esta distinção o «primeiro toque» já teria apontado a área e o clique
     seguinte abriria a página: a medida U3 do brief cairia num telemóvel e
     passaria num portátil. `pointerType` é o que separa os dois. */
  var doApontador = function (ev) {
    return ev.pointerType === 'mouse' || ev.pointerType === 'pen';
  };
  var grupos = DOIS_NIVEIS ? [grupoDoPais, grupoDaUnidade] : [grupoDoPais];
  for (var g = 0; g < grupos.length; g++) {
    var raiz = grupos[g];
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

  /* O GESTO LÊ-SE DO `pointerdown`, E NÃO DO CLIQUE. Medido a 08.09.2026 nos dois
     motores, com o mesmo toque:

       Chromium  pointerover:touch, pointerdown:touch, touchstart, pointerup:touch,
                 touchend, mouseover, click:touch
       WebKit    pointerover:touch, pointerdown:touch, touchstart, pointerup:touch,
                 touchend, mouseover, click:MOUSE

     O `pointerType` do clique diz «mouse» no WebKit para um toque de dedo, e a
     primeira forma desta regra lia-o: no Safari o primeiro toque num concelho
     abria a página, que é exactamente o que a medida P3 do brief proíbe, e no
     Chromium não. O `pointerdown` diz «touch» nos dois, e é ele que decide; o
     `pointerType` do clique fica como segunda leitura, e o `touchstart` como
     terceira, para um motor que não despache `pointerdown`. */
  svg.addEventListener('pointerdown', function (ev) {
    tipoDoGesto = ev.pointerType || '';
  });
  svg.addEventListener('touchstart', function () {
    tipoDoGesto = 'touch';
  }, { passive: true });

  svg.addEventListener('click', function (ev) {
    var area = areaDe(ev.target);
    if (!area) return;
    /* NUMA PÁGINA DE DISTRITO OU DE CONCELHO NÃO HÁ UNIDADE PARA CRESCER: as
       áreas são concelhos e a regra do primeiro toque é a única que corre. */
    /* UM CLIQUE FEITO PELO ENTER NÃO TEM CONTAGEM DE CLIQUES: é por aí que se
       sabe que o gesto veio do teclado, e é só nesse caso que o foco muda de
       nível. */
    var doTeclado = ev.detail === 0;
    var slug = area.getAttribute('data-uni-porta');
    if (slug) {
      /* A UNIDADE CUJO FICHEIRO NÃO VEIO NÃO SE SEGURA OUTRA VEZ: o clique
         segue a ligação do servidor e abre a página dela. O mesmo vale para um
         navegador sem `fetch`, onde não há sequer um pedido a fazer. */
      if (falhadas[slug] || typeof fetch !== 'function') {
        mostra(area);
        return;
      }
      /* UMA UNIDADE CRESCE, E NÃO NAVEGA. A porta do lugar do nome é que abre a
         página dela, e ficou lá com o nome no mesmo gesto. */
      ev.preventDefault();
      mostra(area);
      abre(slug, area.getAttribute('data-ficheiro'), function (dados) {
        paraAUnidade(slug, dados, doTeclado);
        history.pushState(null, '', location.pathname + location.search + '#unidade=' + slug);
      });
      return;
    }
    var concelho = area.getAttribute('data-concelho-porta');
    if (!concelho) return;
    /* O PRIMEIRO TOQUE NUM CONCELHO DIZ O NOME; O SEGUNDO, NO MESMO, ABRE.
       O dedo não passa por cima antes de tocar, e por isso o primeiro toque tem
       de ser o que o passar do rato é: dizer o nome. Com rato ou caneta o nome já
       está no lugar desde que o cursor lá entrou, e com o teclado desde que o Tab
       lá chegou: nesses o clique é o segundo gesto e abre a página. O Enter não
       traz gesto nenhum e por isso não herda o do toque anterior, que deixaria o
       teclado a pedir dois Enter depois de um dedo ter passado por ali. */
    var toque = tipoDoGesto === 'touch' || ev.pointerType === 'touch';
    if (!doTeclado && toque && concelho !== tocada) {
      ev.preventDefault();
      tocada = concelho;
      mostra(area);
    }
  });

  /* O TECLADO NÃO PRECISA DE OUVINTE NENHUM: o Enter sobre uma ligação com foco
     dispara um clique, e o clique é o que está escrito acima. Numa unidade faz o
     que o toque faz, que é crescer; num concelho, onde o foco já pôs o nome no
     lugar, segue a ligação, que é o que o navegador faz sozinho. */

  if (voltar) voltar.addEventListener('click', function (ev) {
    ev.preventDefault();
    paraOPais();
    history.pushState(null, '', location.pathname + location.search);
  });

  if (DOIS_NIVEIS) {
    window.addEventListener('popstate', aplicaFragmento);
    window.addEventListener('hashchange', aplicaFragmento);
  }

  /* O lugar do nome só existe com guião, e é aqui que ele passa a existir. */
  lugar.hidden = false;
  mostraVazio();
  if (DOIS_NIVEIS) aplicaFragmento();
})();
