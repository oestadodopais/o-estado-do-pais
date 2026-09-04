/* =============================================================================
 * A BUSCA DO ÍNDICE DO LIVRO-RAZÃO · as 2 916 linhas (bloco F1.4, segunda
 * passagem, 04.09.2026)
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE FICHEIRO PODE FAZER, E A REGRA QUE ELE QUEBRA
 * ---------------------------------------------------------------------------
 * Os outros três guiões deste sítio (`inicio.js`, `municipios.js`,
 * `correcoes.js`) podem trocar `hidden`, e mais nada: nunca `innerHTML`, nunca
 * criar texto visível, nunca formatar um número (resposta 3 da direção,
 * 20.08.2026). Este cria texto visível, e é o único que o faz.
 *
 * PORQUÊ: a decisão do bloco F1.10, «uma coisa, um lugar». Procurar uma linha
 * do livro-razão faz-se num sítio, e esse sítio é o índice do livro-razão. As
 * 2 767 linhas dos concelhos saíram da LISTA pela decisão D6 de 26.08.2026 e
 * continuam a sair (2 916 entradas num documento não são um índice); o que não
 * podia continuar era saírem da BUSCA. Ou o documento leva 2 916 entradas
 * escondidas, ou o guião escreve os resultados: a segunda é a que não põe 350 KB
 * de HTML escondido em cada visita.
 *
 * AS TRÊS AMARRAS, para que escrever texto não seja inventar texto:
 *
 *   1. **nada é composto aqui.** Cada cadeia que se escreve vem, tal e qual, do
 *      ficheiro `/dados/livro-indice.<edição>.json`, e escreve-se por
 *      `textContent`, nunca por `innerHTML`. O ficheiro é gerado na construção a
 *      partir de `ledger/claims/*.yml` (`src/lib/indice-da-busca.mjs`);
 *   2. **nenhum valor.** O ficheiro não leva um único valor do livro-razão. Um
 *      número de Portugal entra numa página por `<Claim/>`, com o seu selo, e
 *      este guião não tem nenhum para escrever. Quem quer o número abre a linha,
 *      que é exactamente o que o resultado abre;
 *   3. **nenhuma contagem.** Não se escreve «43 resultados»: quando há mais do
 *      que os que cabem, acende-se uma frase que o diz por palavras, e essa
 *      frase vem do servidor, declarada no inventário da voz.
 *
 * A NORMALIZAÇÃO DO TEXTO DO SÍTIO CONTINUA A SER DA CONSTRUÇÃO. O ficheiro traz
 * os dicionários já em caixa baixa e sem acentos (`nomesB`, `fontesB`,
 * `concelhosB`); aqui normaliza-se só o que o leitor escreve. O identificador
 * não precisa de gémeo: já é minúsculas, algarismos e hífenes, e trocar-lhe os
 * hífenes por espaços não é normalizar um texto, é a mesma cadeia com outro
 * separador.
 *
 * SEM ESTE FICHEIRO a página é a que era: as 149 linhas gerais, inteiras, com a
 * porta para a coleção dos concelhos por cima delas, e o formulário a levar ao
 * próprio índice.
 * ========================================================================== */
(function () {
  'use strict';

  var forma = document.querySelector('form[data-livro-indice]');
  var campo = document.querySelector('[data-livro-busca]');
  var lista = document.querySelector('[data-livro-lista]');
  if (!forma || !campo || !lista) return;

  var itens = lista.querySelectorAll('.livro-item');
  if (!itens.length) return;

  var vazio = document.querySelector('[data-livro-sem-resultado]');
  var resultados = document.querySelector('[data-livro-resultados]');
  var resultadosK = document.querySelector('[data-livro-resultados-k]');
  var mais = document.querySelector('[data-livro-mais]');

  /* O tecto da fila de resultados. Uma fila sem tecto deixa de ser uma fila, e
     2 916 âncoras de uma vez não são uma resposta. Quando ele morde, a frase do
     servidor acende-se e diz por palavras que há mais. */
  var MAX = 50;

  /** O índice, quando chegar. Sem ele a busca é a da primeira passagem: filtra
      as entradas que estão no documento, e mais nada. */
  var indice = null;

  function normaliza(s) {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /** O texto de busca de uma entrada do índice, junto dos pedaços do ficheiro. */
  function alvoDaEntrada(linha) {
    var id = String(linha[0]);
    var partes = [id, id.split('-').join(' ')];
    var listas = ['nomesB', 'fontesB', 'concelhosB'];
    for (var k = 0; k < listas.length; k++) {
      var i = linha[k + 1];
      if (i >= 0) partes.push(indice[listas[k]][i]);
    }
    return partes.join(' ');
  }

  /** Um resultado: uma porta com o nome, o identificador e o concelho. */
  function desenhaResultado(linha) {
    var li = document.createElement('li');
    li.className = 'livro-busca-item';
    var a = document.createElement('a');
    a.className = 'livro-busca-porta';
    a.href = indice.base + String(linha[0]);

    var nome = linha[1] >= 0 ? indice.nomes[linha[1]] : null;
    if (nome) {
      var spanNome = document.createElement('span');
      spanNome.className = 'livro-busca-nome';
      spanNome.textContent = nome;
      a.appendChild(spanNome);
    }

    var spanId = document.createElement('code');
    spanId.className = 'livro-busca-id';
    spanId.textContent = String(linha[0]);
    a.appendChild(spanId);

    if (linha[3] >= 0) {
      var spanLugar = document.createElement('span');
      spanLugar.className = 'livro-busca-lugar';
      spanLugar.textContent = indice.concelhos[linha[3]];
      a.appendChild(spanLugar);
    }

    li.appendChild(a);
    return li;
  }

  function limpa(no) {
    while (no.firstChild) no.removeChild(no.firstChild);
  }

  function filtra() {
    var q = normaliza(campo.value);

    /* Sem pergunta, a página é a que o servidor rendeu. */
    if (!q) {
      for (var i = 0; i < itens.length; i++) itens[i].hidden = false;
      lista.hidden = false;
      if (resultados) { limpa(resultados); resultados.hidden = true; }
      if (resultadosK) resultadosK.hidden = true;
      if (mais) mais.hidden = true;
      if (vazio) vazio.hidden = true;
      return;
    }

    /* Com índice, a resposta é uma só: a fila de resultados sobre as 2 916. Sem
       índice (ficheiro por chegar, ou por falhar), fica a filtragem das entradas
       que estão no documento, que é o que a página sempre pôde fazer sozinha. */
    if (!indice) {
      var vistos = 0;
      for (var j = 0; j < itens.length; j++) {
        var alvo = itens[j].getAttribute('data-busca') || '';
        var casa = alvo.indexOf(q) >= 0;
        itens[j].hidden = !casa;
        if (casa) vistos++;
      }
      lista.hidden = false;
      if (vazio) vazio.hidden = vistos > 0;
      return;
    }

    var achados = [];
    var total = 0;
    for (var k = 0; k < indice.linhas.length; k++) {
      if (alvoDaEntrada(indice.linhas[k]).indexOf(q) < 0) continue;
      total++;
      if (achados.length < MAX) achados.push(indice.linhas[k]);
    }

    lista.hidden = true;
    for (var m = 0; m < itens.length; m++) itens[m].hidden = false;

    limpa(resultados);
    for (var n = 0; n < achados.length; n++) resultados.appendChild(desenhaResultado(achados[n]));
    resultados.hidden = achados.length === 0;
    if (resultadosK) resultadosK.hidden = achados.length === 0;
    if (mais) mais.hidden = total <= MAX;
    if (vazio) vazio.hidden = total > 0;
  }

  /* O que veio no endereço: é o que o formulário escreve quando alguém submete
     sem guião e volta com ele. */
  try {
    var q0 = new URLSearchParams(window.location.search).get('q');
    if (q0) campo.value = q0;
  } catch (e) {
    /* um endereço que o navegador não sabe ler não é motivo para a página
       deixar de funcionar: fica a lista inteira. */
  }

  campo.addEventListener('input', filtra);
  /* Com guião a página não recarrega: o filtro já está aplicado ao carregar no
     botão, e recarregar era perder o que se escreveu para chegar ao mesmo sítio. */
  forma.addEventListener('submit', function (ev) {
    ev.preventDefault();
    filtra();
  });
  filtra();

  /* O índice chega depois da página, e a página não espera por ele. */
  try {
    fetch(forma.getAttribute('data-livro-indice'))
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (j) {
        if (!j || !j.linhas || !j.base) return;
        indice = j;
        filtra();
      })
      .catch(function () {
        /* sem índice, a busca é a das entradas do documento. */
      });
  } catch (e) {
    /* idem */
  }
})();
