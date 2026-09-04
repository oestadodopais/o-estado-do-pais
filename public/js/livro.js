/* =============================================================================
 * A BUSCA DO ÍNDICE DO LIVRO-RAZÃO · enriquecimento progressivo (bloco F1.4).
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é a mesma regra de `public/js/municipios.js`
 * e de `public/js/inicio.js` (resposta 3 da direção, 20.08.2026):
 *
 *   · trocar `hidden`, e mais nada.
 *
 * O QUE NÃO PODE FAZER, nunca: `innerHTML`, criar texto visível, formatar um
 * número, escrever um algarismo. As linhas vêm todas do servidor, à vista, e o
 * que isto faz é APAGAR as que não casam com o que o leitor escreveu.
 *
 * AO CONTRÁRIO DA PESQUISA DOS CONCELHOS, A CAIXA NÃO É DESTE FICHEIRO: ela vem
 * do servidor, dentro de um `<form method="get">` cujo destino é o próprio
 * índice. Sem este guião a caixa continua a ser o marco de busca da página e o
 * botão leva ao índice inteiro; com ele, filtra sem recarregar.
 *
 * A COMPARAÇÃO É SEM ACENTOS, e a regra está escrita uma vez: cada linha traz
 * `data-busca`, calculado na construção pela mesma função que a pesquisa dos
 * concelhos usa (`semAcentos`, `src/lib/inicio.mjs`), com o nome, o
 * identificador e a fonte lá dentro. O cliente normaliza só o que o leitor
 * escreveu, que não é texto da página.
 *
 * SEM TECTO DE RESULTADOS, e é a diferença para a pesquisa dos concelhos: ali a
 * fila é uma sugestão por cima de uma página que mostra outra coisa, e uma fila
 * sem tecto deixava de ser uma fila; aqui a lista É a página, e esconder uma
 * linha que casa seria esconder conteúdo do índice.
 *
 * O `?q=` DO ENDEREÇO LÊ-SE À CHEGADA, porque é o que o formulário escreve
 * quando alguém submete sem guião e volta com ele: a caixa aparece com o que a
 * pessoa escreveu, e a lista já vem filtrada.
 * ========================================================================== */
(function () {
  'use strict';

  var campo = document.querySelector('[data-livro-busca]');
  var lista = document.querySelector('[data-livro-lista]');
  if (!campo || !lista) return;

  var itens = lista.querySelectorAll('.livro-item');
  if (!itens.length) return;
  var vazio = document.querySelector('[data-livro-sem-resultado]');

  function normaliza(s) {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function filtra() {
    var q = normaliza(campo.value);
    var vistos = 0;
    for (var i = 0; i < itens.length; i++) {
      var alvo = itens[i].getAttribute('data-busca') || '';
      var casa = q.length === 0 || alvo.indexOf(q) >= 0;
      itens[i].hidden = !casa;
      if (casa) vistos++;
    }
    if (vazio) vazio.hidden = vistos > 0;
  }

  /* O que veio no endereço. `URLSearchParams` existe em todos os navegadores que
     este sítio serve; sem ele, o campo fica vazio e a lista inteira, que é o
     estado sem guião. */
  try {
    var q = new URLSearchParams(window.location.search).get('q');
    if (q) campo.value = q;
  } catch (e) {
    /* um endereço que o navegador não sabe ler não é motivo para a página
       deixar de funcionar: fica a lista inteira. */
  }

  campo.addEventListener('input', filtra);
  /* Com guião a página não recarrega: o filtro já está aplicado ao carregar no
     botão, e recarregar era perder o que se escreveu para chegar ao mesmo sítio. */
  var forma = campo.form;
  if (forma) {
    forma.addEventListener('submit', function (ev) {
      ev.preventDefault();
      filtra();
    });
  }
  filtra();
})();
