/**
 * O FICHEIRO ADIADO DA MOBÍLIA PARTILHADA — duas partes, e as duas são de
 * atributos: o estado das divulgações por irmão, e o controlo do tema.
 *
 * Chama-se `tema.js` porque foi o tema que o trouxe (brief da 2j) e é a etiqueta
 * que `Base.astro` carrega em todas as páginas. Passa a ter uma segunda parte na
 * 2k, pela razão mais simples: a primeira divulgação por irmão está no cabeçalho,
 * que existe em todas as páginas, e este é o único ficheiro que todas carregam.
 * Fica dito em vez de escondido; o nome é da cadeira.
 *
 * ---------------------------------------------------------------------------
 * PARTE 1 · AS DIVULGAÇÕES POR IRMÃO (2k, achado 16 da segunda leitura cruzada)
 * ---------------------------------------------------------------------------
 * Dois comandos deste sítio abrem um IRMÃO e não o seu próprio conteúdo: o
 * «Menu» do cabeçalho, que revela `#nav-principal`, e a porta do telemóvel do
 * Instrumento n.º 1, que revela `#convergencia-corpo`. Os dois têm a razão
 * escrita onde vivem: um `<details>` fechado esconde o que tem dentro por
 * `::details-content`, e não há regra de folha portátil que o volte a mostrar na
 * secretária; com o corpo ao lado, `[open] ~` chega e existe em todo o lado.
 *
 * O preço era a árvore: o `<details>` anuncia-se como um comando que abre e
 * fecha, e o que ele abre não está lá dentro. `aria-controls` diz qual é, pelo
 * `id`, e o `aria-expanded` acompanha o `open`. Este bloco é o que o acompanha.
 *
 * MEDIDO ANTES DE ESCRITO: num Chromium 148, o `aria-expanded` de um `<summary>`
 * não manda no estado que a árvore de acessibilidade publica — o `open` do
 * `<details>` manda, nos dois sentidos, mesmo quando o atributo diz o contrário.
 * Um atributo parado não mente, portanto, a quem ouve a página; mente ao DOM e a
 * quem o lê de fora. É por isso que ele existe E é acompanhado, e não uma coisa
 * sem a outra.
 *
 * A REGRA É GENÉRICA E FECHA-SE SOZINHA: vale para todo o `summary[aria-controls]`
 * que seja de um `<details>`, e mais nenhum `<summary>` do sítio leva esse
 * atributo — as peças e o aparelho abrem o que têm dentro e o navegador trata
 * deles. Uma terceira divulgação por irmão entra sem uma linha a mais aqui.
 *
 * Corre ANTES do controlo do tema, e é de propósito: o tema desiste quando a
 * página não tem controlo nenhum, e o cabeçalho tem «Menu» na mesma.
 *
 * ---------------------------------------------------------------------------
 * PARTE 2 · O CONTROLO DO TEMA (Emenda 12, 21.08.2026; DECISIONS §1.52).
 * ---------------------------------------------------------------------------
 *
 * Claro por defeito para todos, independentemente da preferência do sistema. O
 * escuro é um pedido do leitor, feito neste controlo, e fica no aparelho dele —
 * é preferência de leitura e não estado de conteúdo, e por isso NÃO vai no
 * endereço, ao contrário da densidade da primeira página, que a Emenda 7 manda
 * continuar sem memória e a viver no URL.
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é toda a lista: pôr ou tirar `data-theme` na
 * raiz do documento, escrever `aria-pressed` nos dois botões, tirar o `hidden` ao
 * grupo, e guardar uma de duas cadeias em `localStorage`. Não escreve texto, não
 * lê nem compõe um número, e não toca em mais nada da página. É a mesma regra da
 * primeira página, aplicada à mobília partilhada.
 *
 * DUAS CADEIAS, E MAIS NENHUMA. O valor guardado é `'dark'` ou `'light'`, e só o
 * primeiro produz um atributo. Um valor estranho na chave — escrito por outra
 * coisa, ou sobrado de uma versão anterior — cai em claro, em silêncio, como os
 * âmbitos inválidos da primeira página caem em País.
 *
 * A GUARDA CONTRA O PISCA está no `<head>` de `Base.astro`, e não aqui: um
 * ficheiro adiado corre depois de a página pintar, e o leitor que escolheu escuro
 * veria a página clara primeiro. Este ficheiro é o que trata do clique; o do
 * `<head>` é o que trata da primeira pintura. Os dois leem a mesma chave e
 * comparam-na com a mesma cadeia.
 */
(function () {
  'use strict';

  /* ------------------------------------------- as divulgações por irmão */

  var divulgacoes = document.querySelectorAll('details > summary[aria-controls]');
  for (var d = 0; d < divulgacoes.length; d++) {
    (function (sumario) {
      var porta = sumario.parentNode;
      var acompanha = function () {
        sumario.setAttribute('aria-expanded', porta.open ? 'true' : 'false');
      };
      /* O `toggle` chega ao `<details>` e não ao `<summary>`, e chega tanto para
         um toque como para uma abertura feita por script. Uma leitura à chegada
         põe o atributo de acordo com o documento que o navegador carregou: uma
         página restaurada da história pode vir com a porta aberta. */
      porta.addEventListener('toggle', acompanha);
      acompanha();
    })(divulgacoes[d]);
  }

  /* ------------------------------------------------ o controlo do tema */

  var CHAVE = 'tema';
  var ESCURO = 'dark';
  var CLARO = 'light';

  /* --------------------------------------------------------------------------
   * TODOS OS CONTROLOS, E NÃO O PRIMEIRO (bloco A das correções de UX, item A7)
   * --------------------------------------------------------------------------
   * Era `querySelector`, porque o cabeçalho tinha um controlo só. Desde a
   * correção da cabeça no telemóvel tem DOIS — o da mobília, por baixo da marca,
   * e o de dentro do menu —, e cada largura apaga o do outro lado com uma
   * `@media`. Servir o primeiro deixaria o outro `hidden` para sempre, porque é
   * este ficheiro que lhe tira o `hidden`, e o telemóvel ficava sem comando.
   *
   * O que muda é só o número: a leitura da chave é uma, o estado do documento é
   * um, e os dois controlos dizem sempre a mesma coisa porque `aplica()` escreve
   * em todos de uma vez. */
  var grupos = document.querySelectorAll('[data-tema-controlo]');
  if (!grupos.length) return;

  /* `localStorage` atira em vez de devolver nada quando o aparelho o recusa (um
     separador privado de alguns motores, uma política de terceiros). Ler e
     escrever passam os dois por aqui, e uma recusa deixa a página em claro sem
     partir o resto do ficheiro. */
  function le() {
    try {
      return localStorage.getItem(CHAVE);
    } catch (e) {
      return null;
    }
  }
  function guarda(v) {
    try {
      localStorage.setItem(CHAVE, v);
    } catch (e) {
      /* uma escolha que não se pode guardar continua a valer para esta página */
    }
  }

  var raiz = document.documentElement;

  function aplica(tema, guardar) {
    var escuro = tema === ESCURO;
    if (escuro) raiz.setAttribute('data-theme', ESCURO);
    else raiz.removeAttribute('data-theme');
    var botoes = document.querySelectorAll('[data-tema-controlo] [data-tema]');
    for (var i = 0; i < botoes.length; i++) {
      var qual = botoes[i].getAttribute('data-tema');
      botoes[i].setAttribute('aria-pressed', qual === (escuro ? ESCURO : CLARO) ? 'true' : 'false');
    }
    if (guardar) guarda(escuro ? ESCURO : CLARO);
  }

  /* O estado de arranque é o do documento, e não o da chave: quem já lhe pôs o
     atributo foi a guarda do `<head>`, com a mesma leitura, e perguntar duas
     vezes à mesma chave é uma maneira de as duas respostas divergirem. */
  aplica(raiz.getAttribute('data-theme') === ESCURO || le() === ESCURO ? ESCURO : CLARO, false);

  for (var g = 0; g < grupos.length; g++) {
    (function (grupo) {
      grupo.addEventListener('click', function (ev) {
        var botao = ev.target && ev.target.closest ? ev.target.closest('[data-tema]') : null;
        if (!botao || !grupo.contains(botao)) return;
        aplica(botao.getAttribute('data-tema') === ESCURO ? ESCURO : CLARO, true);
      });
      /* Só agora se mostra: até aqui o controlo podia estar a dizer o estado
         errado, e um comando que pisca do estado errado para o certo é pior do
         que um que aparece já certo. */
      grupo.hidden = false;
    })(grupos[g]);
  }
})();
