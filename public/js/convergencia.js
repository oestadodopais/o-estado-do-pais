/* =============================================================================
 * A régua da convergência — enriquecimento progressivo.
 *
 * A RÉGUA VEM COMPLETA DO SERVIDOR (Emenda 21, 27.08.2026). Todas as regiões com
 * linhas, o país e a referência estão desenhados no `dist/`, com as suas hastes,
 * os seus rótulos e as suas barras. Até esta emenda o servidor desenhava UMA
 * leitura e este ficheiro acrescentava as outras a pedido; a página das regiões
 * não podia ficar à espera dele, e a selecção deixou de fazer sentido numa régua
 * que é completa por definição.
 *
 * O QUE SOBRA PARA O CLIENTE, e é o que este ficheiro faz e mais nada: **medir
 * os rótulos com a letra a sério e voltar a arrumá-los por patamares.** O
 * servidor arruma-os com uma ESTIMATIVA da largura de cada nome
 * (`nome.length * 6.8`, a mesma que este ficheiro já usava quando
 * `getComputedTextLength()` falhava), porque no servidor não há tipo carregado
 * nem caixa de texto para medir. Com a letra carregada as caixas reais são
 * outras, e um patamar a mais ou a menos é a diferença entre dois rótulos
 * encostados e dois rótulos sobrepostos.
 *
 * A PÁGINA ESTÁ CORRECTA SEM ESTE FICHEIRO. Sem ele a régua tem tudo o que tem
 * de ter, arrumada pela estimativa; com ele fica mais justa. É essa a definição
 * de melhoria progressiva, e é a razão de ele continuar a existir.
 *
 * O QUE ESTE FICHEIRO NÃO PODE FAZER, nunca: criar ou apagar um elemento, criar
 * texto visível, formatar um número, escrever um algarismo, mudar uma cor ou uma
 * espessura. Move o que o servidor desenhou, e só nos eixos Y. Nenhum número
 * passa por aqui: as coordenadas em X são as que a ilha de dados traz, e a ilha
 * é conferida pelo portão contra o livro-razão.
 * ========================================================================== */
(function () {
  'use strict';

  var raiz = document.querySelector('[data-instrumento="convergencia"]');
  if (!raiz) return;

  var ilha = raiz.querySelector('script[data-dados="convergencia"]');
  var svg = raiz.querySelector('[data-regua]');
  if (!ilha || !svg) return;

  var dados;
  try {
    dados = JSON.parse(ilha.textContent);
  } catch (e) {
    return; // dados partidos: fica o que o servidor desenhou
  }

  var E = dados.estrutura;
  if (!E || !E.patamares || !E.patamares.length) return;

  /* O X DE CADA LEITURA LÊ-SE DO DOCUMENTO, e não de uma lista escrita aqui nem
     de um número na ilha de dados: é o `x1` da haste que o servidor desenhou
     naquela leitura. É a disciplina da primeira página («os dois destinos são
     LIDOS do documento») e é também o que o portão pede — um número numa ilha de
     dados tem de declarar a linha do livro-razão de onde veio, e a posição de um
     marcador não é uma medição: é a medição posta na escala do instrumento. Lida
     do desenho, não há segunda conta para divergir. */

  var gStems = svg.querySelector('[data-stems]');
  var gMarks = svg.querySelector('[data-marks]');
  if (!gStems || !gMarks) return;

  function arruma() {
    var marcas = [];
    var nos = gMarks.querySelectorAll('[data-mk]');
    for (var i = 0; i < nos.length; i++) {
      var g = nos[i];
      var id = g.getAttribute('data-mk');
      var haste = gStems.querySelector('[data-stem="' + id + '"]');
      if (!haste) continue;
      var x = parseFloat(haste.getAttribute('x1'));
      if (!isFinite(x)) continue;

      var chapa = g.querySelector('.mk-chapa');
      var nome = g.querySelector('.mk-name');
      var val = g.querySelector('.mk-val');
      var ponto = g.querySelector('circle');
      if (!chapa || !nome || !val) continue;

      /* A LARGURA MEDIDA, com a mesma folga e o mesmo mínimo do servidor. Se o
         motor não souber medir o texto, fica a estimativa que já lá está: o
         elemento não se mexe, e a régua continua como veio. */
      var w;
      try {
        w = Math.max(nome.getComputedTextLength(), val.getComputedTextLength());
      } catch (e) {
        return;
      }
      if (!(w > 0)) return;
      w = Math.max(w, 34) + 18;

      marcas.push({
        id: id,
        x: x,
        w: w,
        chapa: chapa,
        nome: nome,
        val: val,
        ponto: ponto,
        haste: haste,
      });
    }
    if (!marcas.length) return;

    /* A ORDEM É A DA RÉGUA, da esquerda para a direita: um empacotador que
       percorre a régua nessa ordem nunca deixa um rótulo para trás. É a mesma
       ordem por valor que o servidor usa, lida das coordenadas. */
    marcas.sort(function (a, b) {
      return a.x - b.x;
    });

    var fim = [];
    marcas.forEach(function (m) {
      var patamar = 0;
      while (
        patamar < E.patamares.length - 1 &&
        fim[patamar] !== undefined &&
        m.x - m.w / 2 < fim[patamar]
      ) {
        patamar++;
      }
      fim[patamar] = m.x + m.w / 2;
      m.y = E.patamares[patamar];
    });

    marcas.forEach(function (m) {
      m.chapa.setAttribute('x', m.x - m.w / 2);
      m.chapa.setAttribute('y', m.y - 37);
      m.chapa.setAttribute('width', m.w);
      m.nome.setAttribute('y', m.y - 24);
      m.val.setAttribute('y', m.y - 1);
      if (m.haste) m.haste.setAttribute('y2', m.y + 4);
      /* O ponto no eixo não se mexe: a sua posição é o valor, e o valor não
         depende de nenhuma medição de texto. Fica escrito para que ninguém o
         acrescente por simetria. */
      void m.ponto;
    });
  }

  arruma();

  /* Uma segunda passagem quando as métricas de texto já são as da letra
     carregada: até lá o motor mede com a letra de recurso, e as caixas mudam. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arruma);
  }
})();
