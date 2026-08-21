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
 * Uma ORDENAÇÃO cabe dentro desta regra, e é o que a lista de proximidade faz
 * (Emenda 3, subetapa 2h): ordena os 308 centróides que o servidor desenhou pela
 * distância ao sítio tocado e tira o `hidden` aos oito primeiros. A distância
 * decide QUEM se acende; não se escreve, não se arredonda e não aparece em lado
 * nenhum. O que o leitor lê continuam a ser os nomes que a Carta escreveu.
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
        /* O centro do ponto. Os 308 passaram de `<rect>` a `<circle>` com a
           Emenda 10 — o ponto redondo marca um lugar, o quadrado marca prova —,
           e um círculo diz o centro por `cx`/`cy` em vez de o esconder num canto
           e numa largura. */
        x: parseFloat(el.getAttribute('cx')),
        y: parseFloat(el.getAttribute('cy')),
        nome: el.getAttribute('data-m'),
        distrito: el.getAttribute('data-d') || '',
        /* ISSUES I18: o servidor já decidiu, para cada um dos 308, se o campo
           da Carta é um distrito ou uma ilha. O cliente não repete a regra:
           lê a resposta e escolhe entre um prefixo que já está escrito na
           página e nenhum prefixo. */
        ilha: el.getAttribute('data-ilha') === 'sim',
        slug: el.getAttribute('data-caop'),
        /* A cobertura vinha da classe que a pintava. Com a Emenda 10 nenhum
           ponto vem cheio, e uma classe que não pinta nada seria um nome a
           mentir: o servidor declara-a num atributo de dados, e é ele que se lê.
           O que isto governa não é desenho nenhum — é a porta «a página inteira,
           com quem governou», que só existe onde há página. */
        comPagina: el.getAttribute('data-pagina') === 'sim',
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
  var seloDoPais = raiz.querySelector('.movel-selo');
  var ligacaoDeIdioma = document.querySelector('a.lang');
  var baseDoIdioma = ligacaoDeIdioma ? ligacaoDeIdioma.getAttribute('href').split('?')[0] : null;

  /* Os comandos passam de ligações a botões: com script, a página muda sem
     recarregar, e o que se anuncia é um estado premido e não um destino. O
     `href` fica, e passa a ser a forma do estado — assim continua a copiar-se,
     a abrir noutro separador e a partilhar-se. */

  /* O ESPAÇO ACTIVA, COMO O ENTER (etapa 2i, achado 16).
   *
   * Um `<a href>` activa-se com Enter e não com espaço; um `role="button"`
   * promete as duas teclas, e quem usa teclado ou leitor de ecrã conta com
   * isso. Ao pôr o papel de botão nestes comandos sem lhes dar a tecla, a
   * página passou a prometer uma coisa que não fazia — que é pior do que não a
   * prometer.
   *
   * O `preventDefault` não é um detalhe: sem ele o espaço rola a página por
   * baixo do comando que acabou de ser premido, e o leitor perde o sítio onde
   * estava. O `click()` é o mesmo caminho do rato, com o mesmo `vai()` e a
   * mesma devolução do foco; um `click()` sintético traz `detail` 0, que é
   * exactamente o que as guardas da lista de proximidade já sabem recusar. */
  function activaComEspaco(botao) {
    botao.addEventListener('keydown', function (ev) {
      if (ev.key !== ' ' && ev.key !== 'Spacebar') return;
      ev.preventDefault();
      botao.click();
    });
  }

  for (var a = 0; a < segsAmbito.length; a++) {
    segsAmbito[a].setAttribute('role', 'button');
    segsAmbito[a].removeAttribute('aria-current');
    activaComEspaco(segsAmbito[a]);
  }
  for (var d = 0; d < segsDensidade.length; d++) {
    segsDensidade[d].setAttribute('role', 'button');
    segsDensidade[d].removeAttribute('aria-current');
    activaComEspaco(segsDensidade[d]);
  }
  /* AS PASTILHAS DAS REGIÕES SÃO BOTÕES, COMO OS OUTROS COMANDOS (ISSUES I25).
   *
   * Recebiam `aria-pressed` mais abaixo, em `aplica()`, e continuavam a ser
   * `<a href>` sem papel de botão — e `aria-pressed` num `<a>` sem papel de
   * botão não é ARIA válido: um leitor de ecrã pode ignorá-lo, e a pastilha
   * escolhida deixa de se anunciar como escolhida. São o mesmo comando que os
   * segmentos de âmbito e de densidade, e passam a ter o mesmo papel e a mesma
   * tecla. As da pesquisa já eram `<button>` e não precisam de nada.
   *
   * O `href` fica, como nos outros: com script é a forma do estado, e sem script
   * é a ligação que abre a mesma leitura. */
  for (var r0 = 0; r0 < chips.length; r0++) {
    chips[r0].setAttribute('role', 'button');
    activaComEspaco(chips[r0]);
  }

  var estado = leDoEndereco();
  var modoEscolhido = modoDe(estado.ambito);

  /* A fila de resultados da pesquisa recalcula-se sempre que o âmbito muda,
     porque a regra da prancha inclui o concelho ESCOLHIDO. Declara-se aqui, sem
     fazer nada, e ganha corpo mais abaixo se houver caixa de pesquisa. */
  var filtra = function () {};

  /* --------------------------------------------------------- a proximidade
   *
   * `proximos` é a lista de concelhos mais próximos do sítio onde o leitor tocou
   * no selo do país, ou `null` enquanto ninguém tocou. Não vive no endereço: um
   * toque não é um estado partilhável, e uma recarga volta à regra da caixa
   * vazia, que é o que a página sabe dizer sem o dedo de ninguém.
   *
   * É uma ORDENAÇÃO sobre os centróides que o servidor já desenhou, e uma
   * ordenação não é uma figura: nenhuma distância se escreve, nenhum número
   * aparece, e os botões que se acendem são os mesmos 308 que o servidor rendeu.
   * A regra da fase mantém-se inteira — o script escolhe cadeias já validadas.
   */
  var MAX_RESULTADOS = 8;
  var proximos = null;

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
      /* E o prefixo «distrito de», que não é escrito aqui: está na página nas
         duas edições e o que isto faz é acendê-lo ou apagá-lo. */
      var prefixos = document.querySelectorAll('[data-prefixo-distrito]');
      for (var s3 = 0; s3 < prefixos.length; s3++) prefixos[s3].hidden = ponto.ilha;
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
       quando um concelho está escolhido e a leitura aprofunda (Emenda 3).

       O cartão já NÃO se esconde por atributo: desde a 2g ele é a moldura que
       tem o mapa dentro, e esconder o cartão esconderia o mapa. Quem decide o
       que dele se vê é `data-postura`, lido pela folha — o mesmo atributo que
       já decidia o tamanho da tela. */
    var comCartao = !!ponto && estado.densidade !== 'relance';
    if (ficha) ficha.hidden = comCartao || mo === 'regiao';
    if (cartao) cartao.hidden = false;
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

    filtra();
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
        /* O selo do país é um `[data-modo]` como os outros — leva o mesmo
           `aria-pressed` —, mas tem ouvinte próprio, porque um toque nele é
           também um sítio no mapa. Sem esta guarda o mesmo toque passava duas
           vezes por `vai()` e escrevia duas entradas iguais na história: o
           «voltar» ficava a não fazer nada à primeira. */
        if (botao === seloDoPais) return;
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

  /* --------------------------------------------------------------- a pesquisa
   *
   * Os resultados já estão na página e o que isto faz é tirar-lhes o `hidden`.
   * Oito, no máximo, e a ordem é a da Carta.
   *
   * A REGRA DA CAIXA VAZIA É A DA PRANCHA (subetapa 2g, ponto 5): com a caixa
   * vazia mostram-se os concelhos que têm página — hoje um, Évora — e, se
   * houver um concelho escolhido, também ele. Os outros aparecem quando o
   * leitor escrever. Uma vista de escolha que abre com oito nomes que ninguém
   * pediu diz que aqueles oito são especiais, e não são: são os primeiros da
   * Carta.
   *
   * E A LISTA DE PROXIMIDADE É O TERCEIRO ESTADO (subetapa 2h, Emenda 3). São
   * três, e cada um tem o seu gesto:
   *
   *   caixa escrita     os que casam com o que está escrito
   *   toque no selo     os mais próximos do sítio tocado, no telemóvel
   *   nem uma coisa     Évora e o concelho escolhido
   *
   * A 2g tinha os dois últimos a descrever o MESMO estado — a caixa vazia — e
   * por isso teve de escolher entre eles; a 2h separa-os pelo gesto, e nenhum
   * dos dois precisa de deixar de ser verdade.
   */
  if (campo) {
    var itens = raiz.querySelectorAll('.pesquisa-item');
    var MAX = MAX_RESULTADOS;
    filtra = function () {
      var q = campo.value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
      var escolhido =
        estado.ambito.indexOf('municipio:') === 0
          ? estado.ambito.slice('municipio:'.length)
          : null;
      var vistos = 0;
      for (var j = 0; j < itens.length; j++) {
        /* Caixa com texto: os oito primeiros que casam. Caixa vazia depois de um
           toque no selo: os mais próximos do sítio tocado. Caixa vazia e sem
           toque: os concelhos que têm página, que é o que o servidor já rendeu,
           mais o concelho escolhido, se houver um. */
        var botaoDoItem = itens[j].querySelector('[data-escolher]');
        var slugDoItem = botaoDoItem ? botaoDoItem.getAttribute('data-escolher') : null;
        var casa;
        if (q.length > 0) {
          casa = itens[j].getAttribute('data-normal').indexOf(q) >= 0;
        } else if (proximos) {
          casa = slugDoItem !== null && proximos[slugDoItem] === true;
        } else {
          casa =
            itens[j].hasAttribute('data-tem-pagina') ||
            (escolhido !== null && slugDoItem === escolhido);
        }
        var mostrar = casa && vistos < MAX;
        itens[j].hidden = !mostrar;
        if (mostrar) vistos++;
      }
      if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
    };
    /* Escrever desfaz o toque: a lista volta a ser a da caixa, que é o caminho
       principal da Emenda 3. O Escape, que limpa a caixa, desfá-lo também. */
    campo.addEventListener('input', function () {
      proximos = null;
      filtra();
    });
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      campo.value = '';
      proximos = null;
      filtra();
      ev.stopPropagation();
    });
  }

  /* ------------------------------------------------- um ponto é um alvo, aqui?
   *
   * Emenda 3: abaixo de 640 o SELO INTEIRO é o alvo e nenhum ponto é alvo. A
   * folha di-lo com `pointer-events: none !important` em todos os `.mun-alvo`, e
   * isso trava o rato e o dedo — mas não travava o teclado, que escolhia um
   * concelho ponto a ponto a 390, onde nenhum outro gesto o consegue (etapa 2i,
   * achado 8d).
   *
   * A pergunta faz-se À FOLHA e não a uma largura escrita aqui. O 640 vive numa
   * `@media`, e uma segunda cópia dele neste ficheiro divergiria da primeira no
   * dia em que a folha mudasse — é a mesma razão pela qual as listas fechadas
   * são lidas do documento. O que se lê é a resposta da folha para o estado em
   * que a página está, e essa resposta já inclui o âmbito, porque é o âmbito que
   * acende os alvos.
   *
   * Falha do lado seguro: sem folha carregada o valor é `auto`, e a página fica
   * com o comportamento que tinha. */
  var alvoDeReferencia = mapa ? mapa.querySelector('[data-alvos] [data-caop]') : null;

  function pontoEAlvo() {
    if (!alvoDeReferencia || !window.getComputedStyle) return false;
    return window.getComputedStyle(alvoDeReferencia).pointerEvents !== 'none';
  }

  /* Um toque no mapa escolhe o concelho mais próximo, e só quando a página está
     a escolher: fora daí os pontos não são alvos. */
  if (mapa) {
    var alvos = mapa.querySelectorAll('[data-alvos] [data-caop]');
    for (var c5 = 0; c5 < alvos.length; c5++) {
      (function (alvo) {
        alvo.addEventListener('click', function () {
          if (modoEscolhido !== 'municipio' || !pontoEAlvo()) return;
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
   * o alvo, e nenhum ponto é alvo —, e «na escolha, um toque no mapa devolve os
   * concelhos mais próximos como botões (lista de proximidade sobre os centróides
   * CAOP)».
   *
   * O SELO FAZ DUAS COISAS, E QUEM DECIDE QUAL DELAS É O ESTADO EM QUE ELE É
   * TOCADO. Vindo de fora, é a porta: abre a vista de escolha e põe o foco na
   * caixa, que é o caminho principal. Já dentro da vista, é o gesto: devolve os
   * concelhos mais próximos do sítio tocado, como botões, sem número nenhum à
   * vista.
   *
   * PORQUE É QUE ISTO SAIU NA 2g E VOLTA AGORA. A 2e tinha a lista de
   * proximidade a responder pela caixa vazia, e a regra da prancha para a caixa
   * vazia é outra (Évora e o concelho escolhido): as duas descreviam o mesmo
   * estado, e a 2g escolheu uma. O que estava mal era o defeito — sem toque
   * nenhum, a ordenação saía do canto do campo e devolvia os oito PRIMEIROS da
   * Carta («Arcos de Valdevez, Caminha, Melgaço…») —, e o defeito era o defeito,
   * não a funcionalidade. A 2h separa os dois estados pelo gesto e põe a
   * ordenação atrás de um toque a sério, com as guardas de `maisProximosDe()`.
   */
  function maisProximosDe(ev) {
    if (!mapa || !pontos.length) return null;

    /* UM TOQUE, E NÃO UMA ACTIVAÇÃO POR TECLADO. Um `click` vindo do Enter ou do
       espaço traz `detail` 0 e coordenadas 0, e uma lista de proximidade tirada
       do canto do campo é exactamente o defeito que a 2g apanhou. Sem toque,
       nenhuma lista: o selo fica a ser só a porta. */
    if (!ev || !ev.detail) return null;

    var r = mapa.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) return null;

    /* O toque tem de cair DENTRO do mapa. O selo cobre-o exactamente, e se um
       dia deixar de o cobrir é melhor não devolver lista nenhuma do que devolver
       a de um sítio onde ninguém pôs o dedo. */
    if (ev.clientX < r.left || ev.clientX > r.right) return null;
    if (ev.clientY < r.top || ev.clientY > r.bottom) return null;

    var vb = mapa.viewBox && mapa.viewBox.baseVal;
    var LW = vb && vb.width ? vb.width : 600;
    var LH = vb && vb.height ? vb.height : 790;
    var px = ((ev.clientX - r.left) / r.width) * LW;
    var py = ((ev.clientY - r.top) / r.height) * LH;
    if (!isFinite(px) || !isFinite(py)) return null;

    var ordenados = [];
    for (var q3 = 0; q3 < pontos.length; q3++) {
      var dx3 = pontos[q3].x - px;
      var dy3 = pontos[q3].y - py;
      var dd3 = dx3 * dx3 + dy3 * dy3;
      /* Uma distância que não é um número não é uma ordenação: é a ordem da
         Carta a fingir-se de proximidade. Nesse caso não há lista nenhuma. */
      if (!isFinite(dd3)) return null;
      ordenados.push({ slug: pontos[q3].slug, d: dd3 });
    }
    ordenados.sort(function (x, y) {
      return x.d - y.d;
    });

    var perto = {};
    for (var z = 0; z < ordenados.length && z < MAX_RESULTADOS; z++) perto[ordenados[z].slug] = true;
    return perto;
  }

  if (seloDoPais) {
    seloDoPais.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (modoEscolhido === 'municipio') {
        /* Já na vista de escolha: o gesto. Se as guardas recusarem — activação
           por teclado, geometria degenerada, toque fora do mapa —, a lista fica
           como estava, e a vista continua a ser o que era. */
        var perto = maisProximosDe(ev);
        if (perto) {
          proximos = perto;
          if (campo) campo.value = '';
        }
      } else {
        /* Vindo de fora: a porta. A caixa limpa-se e a lista volta à regra da
           caixa vazia, que é o que se vê ao chegar. */
        proximos = null;
        if (campo) campo.value = '';
      }
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
    var preDistrito = document.querySelector('[data-readout-pre]');
    var dica = document.querySelector('[data-dica-cursor]');
    var teclado = document.querySelector('[data-teclado]');

    /* As duas dicas descrevem o que só é verdade com script: entram `hidden` do
       servidor e acendem-se aqui. A folha volta a apagá-las abaixo de 640 e na
       postura de localizador, onde o mapa não escolhe pontos. */
    if (dica) dica.hidden = false;

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
        if (preDistrito) preDistrito.hidden = true;
        return;
      }
      var pt2 = pontos[j];
      anel.setAttribute('cx', pt2.x);
      anel.setAttribute('cy', pt2.y);
      anel.style.display = '';
      if (nome) {
        nome.hidden = false;
        nome.textContent = pt2.nome;
      }
      if (sub) {
        sub.hidden = false;
        sub.textContent = pt2.distrito;
      }
      /* A mesma regra do rótulo de âmbito (ISSUES I18), no que o mapa lê em voz
         alta: prefixo quando o campo da Carta é um distrito, nome de ilha nu
         quando não é. O prefixo já está escrito; isto só o acende. */
      if (preDistrito) preDistrito.hidden = pt2.ilha;
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
        /* A LEITURA FICA, A ESCOLHA NÃO (etapa 2i, achado 8d). Onde nenhum ponto
           é alvo — no telemóvel, e na postura de localizador — as setas continuam
           a percorrer o mapa e a dizer o nome do concelho em voz alta, que é
           leitura e não escolha; o que não pode acontecer é o Enter ou o espaço
           escolherem um ponto que nenhum outro gesto alcança. */
        if (modoEscolhido !== 'municipio' || !pontoEAlvo() || sel < 0) return;
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
