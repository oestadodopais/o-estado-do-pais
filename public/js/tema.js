/**
 * O CONTROLO DO TEMA (Emenda 12, 21.08.2026; DECISIONS §1.52).
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

  var CHAVE = 'tema';
  var ESCURO = 'dark';
  var CLARO = 'light';

  var grupo = document.querySelector('[data-tema-controlo]');
  if (!grupo) return;

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
    var botoes = grupo.querySelectorAll('[data-tema]');
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

  grupo.addEventListener('click', function (ev) {
    var botao = ev.target && ev.target.closest ? ev.target.closest('[data-tema]') : null;
    if (!botao || !grupo.contains(botao)) return;
    aplica(botao.getAttribute('data-tema') === ESCURO ? ESCURO : CLARO, true);
  });

  /* Só agora se mostra: até aqui o controlo podia estar a dizer o estado errado,
     e um comando que pisca do estado errado para o certo é pior do que um que
     aparece já certo. */
  grupo.hidden = false;
})();
