/* =============================================================================
 * O ÍNDICE DOS CONCELHOS · enriquecimento progressivo (passo C, item C4;
 * reescrito no bloco F1.7, 04.09.2026).
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é a mesma regra de `public/js/inicio.js`
 * (resposta 3 da direção, 20.08.2026):
 *
 *   · trocar `hidden`;
 *   · e, desde o bloco R1 (23.09.2026), impedir que o `Enter` recarregue a
 *     página e, quando a busca deixa UM resultado à vista, seguir a porta que o
 *     servidor já rendeu nesse resultado. Não se compõe endereço nenhum: o
 *     destino é o `href` que está no documento.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. Tudo o que se vê veio do servidor.
 *
 * ---------------------------------------------------------------------------
 * DUAS PÁGINAS, DUAS LISTAS, O MESMO GESTO
 * ---------------------------------------------------------------------------
 * `/municipios` (desde 04.09.2026) tem UMA lista: a agrupada pelas 29 unidades
 * da Carta. Escrever no campo esconde as entradas que não casam e as unidades
 * que ficam sem nenhuma; apagar o campo devolve a lista inteira. Antes desta
 * data a página tinha duas listas dos mesmos 308 concelhos — a fila de
 * resultados da peça da pesquisa e a lista agrupada —, e era isso que o diretor
 * viu no sítio no ar.
 *
 * `/livro-razao/concelhos` continua com a fila de resultados da peça
 * `Pesquisa`, e esse ramo é o que este ficheiro já fazia: acender os primeiros
 * oito que casam. Um ficheiro, dois desenhos, e cada um escolhido pelo que a
 * página traz: `[data-lista-agrupada]` ou `.pesquisa-item`.
 *
 * A COMPARAÇÃO É SEM ACENTOS, e a regra está escrita uma vez: cada entrada traz
 * `data-normal`, calculado na construção pela mesma função (`semAcentos()`, em
 * `src/lib/inicio.mjs`) que faz o pedaço do endereço. O cliente normaliza só o
 * que o leitor escreveu, que não é texto da página.
 *
 * NENHUMA CONTAGEM É ESCRITA. O lugar de direção pediu uma linha com o número
 * de concelhos encontrados; ela não entra, e a razão é uma regra da casa e não
 * um esquecimento: um número que se vê no sítio resolve numa linha do
 * livro-razão ou numa chave da prova que o portão reconta, e uma contagem de
 * resultados de um filtro não é nem uma coisa nem outra. Compô-la aqui era o
 * código de execução a escrever um algarismo, que é exactamente o que a regra
 * acima proíbe. O que a página diz quando nada casa é a frase que o servidor já
 * rendeu, e o que ela diz quando alguma coisa casa é a própria lista.
 * ========================================================================== */
(function () {
  'use strict';

  var bloco = document.querySelector('[data-pesquisa-bloco]');
  if (!bloco) return;

  var campo = bloco.querySelector('[data-pesquisa]');
  if (!campo) return;
  var semResultado = bloco.querySelector('[data-sem-resultado]');

  /** O que o leitor escreveu, sem acentos e em caixa baixa. */
  function pedido() {
    return campo.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /* O `Escape` limpa o campo e devolve a lista, nos dois desenhos. */
  function ligaCampo(filtra) {
    campo.addEventListener('input', filtra);
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      campo.value = '';
      filtra();
    });
    filtra();
  }

  /* ------------------------------------------------- a lista agrupada (F1.7) */

  var agrupada = document.querySelector('[data-lista-agrupada]');
  if (agrupada) {
    var grupos = agrupada.querySelectorAll('[data-concelhos-grupo]');
    if (!grupos.length) return;
    /* A busca é um `<form>` que sem guião submete para esta mesma página. Com
       guião não há para onde submeter: a resposta está aqui, e um `Enter` que
       recarregasse a página perdia o filtro que o leitor acabou de escrever. */
    var forma = bloco.querySelector('form');
    if (forma) {
      forma.addEventListener('submit', function (ev) {
        ev.preventDefault();
      });
    }
    ligaCampo(function () {
      var q = pedido();
      var vistos = 0;
      for (var g = 0; g < grupos.length; g++) {
        var entradas = grupos[g].querySelectorAll('[data-concelho]');
        var nesteGrupo = 0;
        for (var i = 0; i < entradas.length; i++) {
          var casa = q.length === 0 || entradas[i].getAttribute('data-normal').indexOf(q) >= 0;
          entradas[i].hidden = !casa;
          if (casa) nesteGrupo++;
        }
        /* A UNIDADE FICA COM O SEU NOME QUANDO AINDA TEM ALGUÉM, e desaparece
           inteira quando não tem: um cabeçalho de distrito sozinho, sem um
           concelho por baixo, é uma promessa vazia. */
        grupos[g].hidden = nesteGrupo === 0;
        vistos += nesteGrupo;
      }
      if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
    });
    return;
  }

  /* ------------------ a fila de resultados (os lugares e o livro-razão) */

  var itens = bloco.querySelectorAll('.pesquisa-item');
  if (!itens.length) return;
  /* A LISTA, E NÃO SÓ OS ITENS (bloco R1, 23.09.2026, I137). A lista nasce
     escondida na página dos lugares (`resultadosOcultos`, para que sem guião a
     página seja o mapa e as duas listas), e este ramo tirava o `hidden` a cada
     item que casava e nunca à lista: escrever «mour» acendia Moura e Mourão
     dentro de uma caixa que continuava fechada, e o leitor via nada. A leitura
     de fora de 23.09.2026 foi a primeira a escrever no campo. Agora a lista
     abre-se quando há texto escrito e fecha-se quando não há; com texto e sem
     nenhum resultado, a folha tira-a do caminho (`.pesquisa-res:not(:has(…))`)
     e abre-se no lugar dela a frase de que nada casou. */
  var lista = bloco.querySelector('[data-pesquisa-lista]');

  /* O tecto da fila de resultados: oito, e a ordem é a da Carta. É o mesmo
     número da primeira página, e por isso está escrito nos dois sítios com a
     mesma razão: uma fila que cresce sem tecto deixa de ser uma fila. */
  var MAX = 8;

  bloco.hidden = false;

  /* O `ENTER` NÃO RECARREGA A PÁGINA (bloco R1, 23.09.2026). A busca é um
     `<form>` que sem guião submete para esta mesma página, e com guião a
     resposta já está aqui: um `Enter` que recarregasse deitava fora o que o
     leitor escreveu e voltava com o campo vazio, que foi o que a leitura de
     fora viu. Com UM resultado à vista, o `Enter` faz o que o leitor espera e
     abre a página desse concelho, pela porta que o servidor rendeu nele; com
     mais do que um, ou nenhum, não faz nada, e a lista (ou a frase) continua à
     vista. */
  var forma = bloco.querySelector('form');
  if (forma) {
    forma.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var vistos = [];
      for (var i = 0; i < itens.length; i++) {
        if (!itens[i].hidden) vistos.push(itens[i]);
      }
      if (pedido().length === 0 || vistos.length !== 1) return;
      var porta = vistos[0].querySelector('a[href]');
      if (porta) window.location.assign(porta.href);
    });
  }

  ligaCampo(function () {
    var q = pedido();
    var vistos = 0;
    for (var i = 0; i < itens.length; i++) {
      /* SEM TEXTO ESCRITO NÃO HÁ SUGESTÕES (achado D8 do lugar de direção,
         21.09.2026). Com a caixa vazia a fila acendia os oito primeiros
         concelhos da Carta, e um leitor perguntava-se porquê aqueles: hoje os
         308 têm página, e os oito primeiros não são especiais em nada. Com a
         caixa vazia a fila fica fechada, e o caminho sem escrever nada são as
         duas listas da página. */
      var casa = q.length > 0 && itens[i].getAttribute('data-normal').indexOf(q) >= 0;
      var mostrar = casa && vistos < MAX;
      itens[i].hidden = !mostrar;
      if (mostrar) vistos++;
    }
    if (lista) lista.hidden = q.length === 0;
    if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
  });
})();
