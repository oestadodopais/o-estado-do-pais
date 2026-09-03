/* =============================================================================
 * A PRIMEIRA PÁGINA — enriquecimento progressivo.
 *
 * O QUE ESTE FICHEIRO PODE FAZER, e é uma regra e não um estilo (resposta 3 da
 * direcção à crítica cruzada, 20.08.2026):
 *
 *   · trocar `hidden`, `open`, `aria-pressed` e `aria-current`;
 *   · escrever o `textContent` da região viva, que junta duas cadeias que já
 *     estão na página, e o do nome que o mapa lê ao passar o cursor, COPIADO do
 *     nó que o servidor desenhou;
 *   · mexer no endereço com `history.pushState` e `history.replaceState`, e
 *     mudar de página com `location.assign` e `location.replace` para um destino
 *     LIDO do documento (a Emenda 19 traz os dois: a ligação de um ponto do
 *     mapa, e o índice dos 308 para onde um endereço antigo vai).
 *
 * OS DOIS `data-slot` SAÍRAM (Emenda 19a, 26.08.2026). Eram o nome e o distrito
 * do concelho escolhido, escritos nos blocos de cabeça do concelho; os blocos
 * saíram com o estado que os acendia, e com eles o único texto por preencher que
 * esta página tinha.
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
 *   ?ambito=pais | municipio                            (por defeito: pais)
 *   ?densidade=relance | leitura                        (por defeito: relance)
 *
 * `municipio` TEM UM SÓ SIGNIFICADO: A PESQUISA ESTÁ ABERTA (Emenda 19, 26.08).
 * Foi a vista de escolha da etapa 2m, e nessa vista o mapa crescia à largura do
 * conteúdo, a roda do rato ampliava-o e um ponto escolhia um concelho dentro da
 * primeira página. O diretor viu a vista no computador a 26.08 e decidiu: um
 * concelho vive na sua página e só lá, e o mapa da primeira página é navegação.
 * A vista sai inteira; o estado fica, com o significado que lhe resta, que é o
 * do comando «Concelho»: a pesquisa aberta por baixo dele, nas duas larguras.
 *
 * OS ESTADOS `municipio:<slug>` DEIXARAM DE EXISTIR (Emenda 19a), E OS
 * `regiao:<slug>` TAMBÉM (Emenda 21b, 27.08.2026). Um endereço antigo continua a
 * abrir alguma coisa, que é o que a Emenda 7 promete: o script reencaminha um
 * concelho para a sua página quando ela existe e para o índice dos 308 quando não
 * existe, e uma região para a sua página quando ela tem linhas e para o índice
 * das regiões quando não tem. Nenhum destino é montado aqui: os do concelho são
 * `href` que o servidor escreveu (a ligação da pesquisa, o comando «Concelho»), e
 * os da região são o gabarito da rota e a lista fechada dos slugs, escritos pelo
 * servidor no comando «Região» — o cliente põe um slug da lista no lugar que o
 * gabarito marca, e não sabe a rota de nenhuma edição.
 *
 * «REGIÃO» É UMA PORTA E NÃO UM ESTADO. O comando existe outra vez na fila do
 * âmbito, mas leva a `/regioes`: este ficheiro não lhe põe `role="button"` nem
 * `aria-pressed`, e não lhe intercepta o clique.
 *
 * O QUE O ESTADO `municipio` MOSTRA É O PAÍS: a cabeça, o painel, o instrumento
 * e as portas são os do país, porque ninguém escolheu nada. O que muda é a
 * pesquisa, que se abre, e o foco, que vai para o campo.
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
  /* O estado da pesquisa aberta. O valor do endereço continua a ser `municipio`,
     porque é um endereço partilhado e a Emenda 7 não o deixa mudar de nome; o
     que mudou foi o que ele significa (Emenda 19c). */
  var AMBITO_PESQUISA = 'municipio';
  var DENSIDADE_DEFEITO = 'relance';

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
           O que isto governa não é desenho nenhum: é se há uma página para
           abrir, no Enter do teclado e no reencaminhamento de um endereço
           antigo (Emenda 19). */
        comPagina: el.getAttribute('data-pagina') === 'sim',
      };
      pontos.push(pt);
      porSlug[pt.slug] = pt;
    }
  }

  /* ==========================================================================
   * A LENTE SAIU COM A VISTA DE ESCOLHA (Emenda 19b, 26.08.2026)
   * ==========================================================================
   *
   * Havia aqui uma ampliação por roda do rato e por beliscão, presa ao estado
   * `?ambito=municipio`: uma transformação num grupo do SVG, de 1× a 4×, com o
   * toque duplo a repor. Existia porque o mapa era o instrumento de ESCOLHA de
   * um concelho, e os 308 pontos são demasiado juntos para se escolher um deles
   * a essa escala (o par mais próximo da Carta está a 2,816 unidades de campo,
   * que na coluna são 2,3 CSS px).
   *
   * Com as páginas dos 308 decididas (decisão 5B de 25.08) o mapa deixou de
   * escolher: um ponto com página é uma ligação para a página dele, e mais nada
   * acontece num ponto. O mecanismo perdeu o trabalho, e sai em vez de se afinar.
   * O que ele custava, medido a 26.08 no sítio no ar: a roda do rato sobre o
   * mapa deixava de rolar a página (cinco entalhes para baixo, `scrollY` na
   * mesma), que é tirar à página o gesto mais comum que ela tem.
   *
   * O que fica é a conversão de coordenadas, que a leitura ponto a ponto precisa
   * e que a lente tornava complicada: sem transformação, o sítio de um evento em
   * unidades do campo é uma regra de três sobre o rectângulo do `svg`.
   */
  function medidaDoCampo() {
    var vb = mapa && mapa.viewBox && mapa.viewBox.baseVal;
    return { w: vb && vb.width ? vb.width : 600, h: vb && vb.height ? vb.height : 790 };
  }

  /* O sítio de um evento, em coordenadas do campo, que é o referencial em que os
     308 centróides estão escritos. */
  function paraCampoDoMapa(cx, cy) {
    var r = mapa.getBoundingClientRect();
    var c = medidaDoCampo();
    if (!(r.width > 0) || !(r.height > 0)) return null;
    return { x: ((cx - r.left) / r.width) * c.w, y: ((cy - r.top) / r.height) * c.h };
  }

  /* ----------------------------------------- os endereços antigos, e para onde vão
   *
   * `?ambito=municipio:<slug>` era um estado partilhável, e a Emenda 7 diz que o
   * que era partilhável continua a abrir alguma coisa. Abre a página do concelho
   * quando ela existe, e o índice dos 308 quando não existe (Emenda 19a).
   *
   * OS DOIS DESTINOS SÃO LIDOS DO DOCUMENTO. A página do concelho é o `href` da
   * ligação que o servidor pôs naquele ponto do mapa; o índice é o `href` do
   * comando «Concelho», que é o destino dele sem script. Um endereço montado
   * aqui teria de saber a rota de cada edição, e divergiria da do servidor no dia
   * em que ela mudasse.
   *
   * `location.replace` e não `assign`: o estado antigo não fica na história, para
   * que o botão de voltar não devolva o leitor a um endereço que já não existe. */
  /* A LISTA DOS 308 PASSOU DO MAPA PARA A PESQUISA (Emenda 20, 27.08.2026).
   *
   * O mapa da primeira página deixou de ser 308 pontos e passou a ser as 29
   * unidades da Carta: `porSlug` fica vazio, e com ele ficava vazio o único
   * caminho que este ficheiro tinha para saber o destino de um endereço antigo.
   * A fila de resultados da pesquisa tem os mesmos 308 concelhos, com o mesmo
   * slug e com a porta de cada um, e é ela que se lê. É a mesma disciplina de
   * sempre: os dois destinos são LIDOS DO DOCUMENTO, e nenhum é montado aqui. */
  var itensDaPesquisa = document.querySelectorAll('[data-resultados] [data-caop]');
  for (var ip = 0; ip < itensDaPesquisa.length; ip++) {
    var li = itensDaPesquisa[ip];
    var slugDoItem = li.getAttribute('data-caop');
    if (porSlug[slugDoItem]) continue;
    var lig = li.querySelector('a[href]');
    porSlug[slugDoItem] = {
      slug: slugDoItem,
      comPagina: li.getAttribute('data-tem-pagina') === 'sim',
      porta: lig ? lig.getAttribute('href') : null,
    };
  }

  function portaDoPonto(slug) {
    var a = mapa ? mapa.querySelector('[data-mun-porta="' + slug + '"]') : null;
    if (a) return a.getAttribute('href');
    return porSlug[slug] && porSlug[slug].porta ? porSlug[slug].porta : null;
  }

  /* ---------------------------------------------------------------------------
   * OS DESTINOS DEIXARAM DE VIR DO COMANDO (F1.1, 03.09.2026)
   * ---------------------------------------------------------------------------
   * A fila do âmbito saiu da página com o bloco da porta da frente, e com ela os
   * dois sítios de onde este ficheiro lia para onde vai um endereço antigo: o
   * `href` de «Concelho» e os dois campos de «Região». Passam a estar na RAIZ do
   * estado, `[data-inicio]`, que é o elemento que este ficheiro já procurava
   * antes de qualquer outra coisa. O comando continua a ser lido primeiro onde
   * ele existir, para que uma página que ainda o renda não mude de
   * comportamento; a raiz é a resposta quando ele não existe.
   *
   * A REGRA CONTINUA A MESMA: o cliente não conhece a tabela de rotas nem a
   * lista das regiões. Põe um slug de uma lista fechada no lugar que o gabarito
   * marca, e um slug fora da lista cai no índice. Nenhuma cadeia é montada e
   * nenhum algarismo é escrito. */
  function indiceDosConcelhos() {
    var seg = raiz.querySelector('[data-modo="municipio"]');
    if (seg) return seg.getAttribute('href');
    return raiz.getAttribute('data-indice-concelhos') || null;
  }

  /* ------------------------------------------ o comando «Região», e o que ele traz
   *
   * O servidor escreveu-lhe dois campos (Emenda 21b): `data-porta-regiao`, o
   * gabarito da rota de uma região naquela edição, e `data-regioes`, a lista
   * fechada das regiões com página, separada por espaços. O `href` dele é o
   * índice. Nenhum dos três é montado aqui. */
  function comandoDaRegiao() {
    return raiz.querySelector('[data-modo="regiao"]');
  }

  function portaDaRegiao(slug) {
    /* Sem comando na página, os três campos leem-se da raiz do estado, onde o
       servidor os escreve desde o F1.1. */
    var cmd = comandoDaRegiao() || raiz;
    var gabarito = cmd.getAttribute('data-porta-regiao');
    if (!gabarito) return null;
    var lista = (cmd.getAttribute('data-regioes') || '').split(/\s+/);
    var indice = cmd.getAttribute('href') || raiz.getAttribute('data-indice-regioes');
    for (var i = 0; i < lista.length; i++) {
      if (lista[i] && lista[i] === slug && gabarito) return gabarito.replace(':slug', slug);
    }
    /* Uma região sem página cai no índice, que é a mesma queda que um concelho
       sem página tem desde a Emenda 19a. */
    return indice;
  }

  function reencaminhaEstadoAntigo() {
    var bruto = new URLSearchParams(location.search).get('ambito');
    if (!bruto) return false;
    if (bruto.indexOf('regiao:') === 0) {
      var destinoDaRegiao = portaDaRegiao(bruto.slice('regiao:'.length));
      if (!destinoDaRegiao) return false;
      location.replace(destinoDaRegiao);
      return true;
    }
    if (bruto.indexOf('municipio:') !== 0) return false;
    var pt = porSlug[bruto.slice('municipio:'.length)];
    if (!pt) return false;
    var destino = pt.comPagina ? portaDoPonto(pt.slug) : indiceDosConcelhos();
    if (!destino) return false;
    location.replace(destino);
    return true;
  }

  function resolveAmbito(bruto) {
    if (!bruto) return AMBITO_DEFEITO;
    if (bruto === AMBITO_DEFEITO) return AMBITO_DEFEITO;
    /* A pesquisa aberta. Não tem bloco de cabeça próprio (mostra o do país) e
       por isso não se resolve contra `comBloco`: é um valor do esquema, escrito
       aqui como `pais` é. */
    if (bruto === AMBITO_PESQUISA) return AMBITO_PESQUISA;
    /* `regiao:<slug>` deixou de ser um valor do esquema (Emenda 21b): quem o
       trata é `reencaminhaRegiaoAntiga()`, antes de a página se aplicar. Se ele
       chegar aqui — porque não havia comando de onde ler o destino —, cai no
       defeito em silêncio, como qualquer outro valor desconhecido. */
    return AMBITO_DEFEITO;
  }

  function resolveDensidade(bruto) {
    return bruto === 'leitura' ? 'leitura' : DENSIDADE_DEFEITO;
  }

  /* `regiao` SAIU DOS MODOS (Emenda 21b): era o modo dos cinco estados de região,
     e não há estado de região. O comando «Região» tem `data-modo="regiao"` porque
     é a fila do âmbito e a folha é a mesma, mas nunca é um modo desta página: é
     uma ligação, e este ficheiro deixa-a passar. */
  function modoDe(ambito) {
    if (ambito === AMBITO_PESQUISA) return 'municipio';
    return 'pais';
  }

  /* `eDoPais()` SAIU COM O `data-so-pais` (Emenda 21b). Respondia a «este âmbito
     é o do país?» para esconder a lista social e as portas nos outros; não há
     outros, e a pergunta deixou de separar alguma coisa. */

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

  /* AS QUATRO LISTAS QUE SAÍRAM COM A RÉGUA E COM O COMANDO «REGIÃO» (bloco A,
     itens A2 e A3): `[data-sub]` (os painéis que o comando abria — a pesquisa
     deixou de ser um deles e passou a ser governada pela folha), `[data-regiao]`
     (as pastilhas das cinco regiões), `[data-banda-caixa]`, `[data-banda]` e
     `[data-banda-ponto]` (a régua da convergência em largura inteira). Nenhuma
     tinha elemento depois desta ronda, e uma lista vazia com ouvintes por cima é
     um mecanismo a fingir que ainda serve. */
  /* AS SEIS LISTAS QUE SAÍRAM COM A VISTA DE ESCOLHA (Emenda 19): `[data-escolher]`
     (os botões da pesquisa, que passaram a ser as portas das páginas dos
     concelhos, como já eram em `/municipios`), `[data-mapa-cartao]` (o cartão
     nunca esteve escondido nesta página, e a linha que o desescondia não fazia
     nada), `[data-so-evora]` e `[data-trocar]` (as duas portas do cartão
     localizador, que vive na página do concelho), `[data-hint-escolher]` (a dica
     de escolher um ponto) e `[data-fechar-mapa]`. */
  /* OS COMANDOS QUE SÃO ESTADO. «Região» tem `data-modo` porque é da mesma fila e
     da mesma folha, mas é uma PORTA para outra página (Emenda 21b): não vira
     botão, não ganha `aria-pressed` e não lhe é interceptado o clique. Ficar de
     fora desta lista é o que o faz continuar a ser uma ligação. */
  var segsAmbito = raiz.querySelectorAll('[data-modo]:not([data-modo="regiao"])');
  var segsDensidade = raiz.querySelectorAll('[data-densidade]');
  var anuncio = raiz.querySelector('[data-anuncio]');
  var pecas = document.querySelectorAll('.peca-mais');
  var campo = raiz.querySelector('[data-pesquisa]');
  /* ---------------------------------------------------------------------------
   * A GAVETA DA BUSCA (01.09.2026)
   * ---------------------------------------------------------------------------
   * A afinação 1 do brief da forma dos domínios recolheu a busca numa gaveta ao
   * lado do mapa, fechada a todas as larguras. Uma gaveta fechada é o navegador
   * a esconder o que ela tem dentro: o campo deixa de ser focável, e o comando
   * «Concelho», que promete pôr a busca à vista e o foco no campo, deixava de
   * cumprir as duas coisas.
   *
   * O QUE O GUIÃO FAZ É ABRIR A GAVETA, e mais nada. `open` está na lista do que
   * este ficheiro pode tocar desde o primeiro dia — «trocar `hidden`, `open`,
   * `aria-pressed` e `aria-current`» —, e é o mesmo mecanismo que o leitor usa
   * com o dedo. Sem guião a gaveta continua a abrir-se sozinha, porque é um
   * `<details>`: o que se perde sem guião é o atalho, e não o caminho.
   */
  var gavetaDaBusca = raiz.querySelector('[data-gaveta="busca"]');
  var semResultado = raiz.querySelector('[data-sem-resultado]');
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
  var estado = leDoEndereco();
  var modoEscolhido = modoDe(estado.ambito);

  /* A fila de resultados da pesquisa recalcula-se sempre que o âmbito muda,
     porque a regra da prancha inclui o concelho ESCOLHIDO. Declara-se aqui, sem
     fazer nada, e ganha corpo mais abaixo se houver caixa de pesquisa. */
  var filtra = function () {};

  /* O tecto da fila de resultados: oito, e a ordem é a da Carta. A lista de
     proximidade, que era o terceiro estado desta fila, saiu com o selo do mapa
     no telemóvel (item A4) — a razão está escrita mais abaixo, onde ela vivia. */
  var MAX_RESULTADOS = 8;

  function mostraSo(lista, atributo, chave) {
    for (var k = 0; k < lista.length; k++) {
      lista[k].hidden = lista[k].getAttribute(atributo) !== chave;
    }
  }

  /* O BLOCO DE CABEÇA DE CADA ESTADO. O bloco `vazio` saiu com a Emenda 19a (era
     o do concelho sem linhas, e um concelho já não se abre aqui), e por isso o
     defeito deixa de ser ele e passa a ser o país: um estado sem bloco próprio
     mostra o do país, que é o que a página é. */
  function chaveDoBloco(ambito) {
    return comBloco[ambito] ? ambito : AMBITO_DEFEITO;
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
    /* A PESQUISA VOLTA A ACENDER-SE AQUI, E É OUTRA COISA (01.09.2026).
       ------------------------------------------------------------------------
       O que estava escrito era isto, e valia enquanto a busca foi um bloco:
       «era um `[data-sub]` que este ciclo abria e fechava conforme o modo; quem
       a mostra passa a ser a folha, pelo `data-modo` que acabou de ser escrito
       na raiz — acima de 640 só no modo concelho, abaixo de 640 sempre».

       Com a afinação 1 do brief da forma dos domínios a busca é uma GAVETA, um
       `<details>` fechado a todas as larguras, e a folha não pode abrir um
       `<details>`: quem o abre é o leitor, ou o `open`. Este ficheiro pode tocar
       no `open` desde o primeiro dia, e é isso que faz aqui e mais nada.

       É AQUI E NÃO SÓ NO CLIQUE porque o estado está no ENDEREÇO (Emenda 7): um
       `/?ambito=municipio` partilhado tem de chegar com a busca aberta, e não só
       depois de alguém carregar no comando. `aplica()` corre no arranque e em
       cada mudança, e é o único sítio onde as duas entradas se encontram.

       A GAVETA DOS NOMES NÃO É TOCADA. Ela não é um estado do endereço: é o
       índice do mapa, e abre-se quando o leitor a abre. */
    if (gavetaDaBusca) gavetaDaBusca.open = mo === 'municipio';

    var chave = chaveDoBloco(ambito);
    mostraSo(blocos, 'data-cabeca', chave);
    mostraSo(paineis, 'data-painel', chave);

    /* A POSTURA DO MAPA NA PRIMEIRA PÁGINA É UMA SÓ (Emenda 19d). O cartão
       localizador era a postura de um concelho escolhido, e um concelho já não
       se escolhe aqui: ele vive na página do concelho, onde o servidor o rende
       (`MunicipioView`, com `postura="localizador"`). A figura fica sempre
       inteira, e continua a não se esconder por âmbito nenhum (bloco A, achado
       C1: tocar num comando não pode apagar a referência que o leitor acabou de
       usar para se orientar). */
    var figura = raiz.querySelector('[data-mapa-raiz]');
    if (figura) {
      figura.hidden = false;
      figura.setAttribute('data-postura', 'inteiro');
    }

    /* `data-so-pais` SAIU (Emenda 21b). Era a marca da lista social e das portas,
       escondidas quando o âmbito não era o país; não há outro âmbito, e uma marca
       que nunca esconde nada é um mecanismo a fingir que ainda serve. Saiu do
       documento e daqui no mesmo commit. */

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

  /* O bloco inteiro da pesquisa, que é o que tem de ficar dentro do ecrã: o
     rótulo, a caixa e a fila de resultados. O foco vai para a caixa; o que se
     leva ao ecrã é a coisa toda, porque uma caixa à vista com o rótulo cortado
     por cima é meia resposta. */
  var blocoDaPesquisa = raiz.querySelector('#pesquisa');

  function vai(estadoNovo, modo, foco) {
    /* `aplica()` abre e fecha a gaveta da busca, e por isso ela está aberta antes
       do `focus()` daqui a três linhas: um campo dentro de um `<details>` fechado
       não aceita foco, e `focus()` sobre ele não faz nada. A REGRA É UMA SÓ NAS
       DUAS LARGURAS — até 01.09 a busca ficava à vista abaixo de 640 em qualquer
       estado, porque era um bloco aberto; agora é uma gaveta, e uma gaveta
       fecha-se em qualquer largura. */
    aplica(estadoNovo, modo);
    history.pushState(
      { ambito: estado.ambito, densidade: estado.densidade, modo: modoEscolhido },
      '',
      location.pathname + pesquisaDe(estado) + location.hash,
    );
    anuncia();
    if (foco && foco.focus) foco.focus();
    /* ----------------------------------------------------------------------
       E O QUE O FOCO REVELA FICA DENTRO DO ECRÃ (item A1, achado B1)
       ----------------------------------------------------------------------
       `focus()` sozinho leva ao ecrã o elemento focado, e o navegador escolhe
       quanto rola: no telemóvel isso deixava a caixa à vista e o rótulo e a
       fila de resultados de fora. `scrollIntoView({block:'nearest'})` sobre o
       BLOCO faz a conta certa — rola o mínimo para que ele caiba —, e não faz
       nada quando ele já está inteiro no ecrã, que é o caso do computador.

       Sem `behavior`, o rolamento é instantâneo e respeita quem pediu menos
       movimento; a página não tem nenhuma animação de rolagem. */
    if (
      modoEscolhido === 'municipio' &&
      blocoDaPesquisa &&
      blocoDaPesquisa.scrollIntoView &&
      foco === campo
    ) {
      blocoDaPesquisa.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /* ------------------------------------------------------------- os ouvintes */

  for (var c1 = 0; c1 < segsAmbito.length; c1++) {
    (function (botao) {
      botao.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modo = botao.getAttribute('data-modo');
        /* «País» fecha a pesquisa e volta ao defeito. «Concelho» abre a pesquisa,
           que é um estado do esquema e por isso vai ao endereço (Emenda 19c). Os
           dois são a mesma linha, nas duas larguras: acima de 640 a folha mostra
           a pesquisa pelo `data-modo` da raiz, abaixo de 640 ela está sempre à
           vista e o que o comando faz é levar o foco ao campo (item A1). */
        var novo = estado;
        if (modo === 'pais') novo = { ambito: AMBITO_DEFEITO, densidade: estado.densidade };
        else if (modo === 'municipio') {
          novo = { ambito: AMBITO_PESQUISA, densidade: estado.densidade };
        }
        /* ------------------------------------------------------------------
           O COMANDO PÕE A PESQUISA À VISTA, E NÃO ROLA PARA LÁ DELA (item A1)
           ------------------------------------------------------------------
           O foco ia para o BOTÃO que acabara de ser premido, e o navegador
           rolava a página até ele. No telemóvel a pesquisa abre ACIMA do sítio
           onde o comando estava a seguir ao toque, e o resultado medido era
           este: a pesquisa aparecia em y = −131 do ecrã, `visivel: false`, e o
           leitor via a mesma coisa que via antes, com um anel de foco (achado
           B1). O comando abria a coisa certa e rolava para lá dela.

           Quem escolhe um concelho passa a receber o foco no CAMPO, que é a
           coisa que ele acabou de pedir, e `vai()` leva-o ao ecrã. Nos outros
           modos o foco continua no comando, que é onde o leitor está a olhar.
           ------------------------------------------------------------------ */
        vai(novo, modo, modo === 'municipio' && campo ? campo : botao);
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

  /* --------------------------------------------------------------- a pesquisa
   *
   * Os resultados já estão na página e o que isto faz é tirar-lhes o `hidden`.
   * Oito, no máximo, e a ordem é a da Carta.
   *
   * A REGRA DA CAIXA VAZIA É A DA PRANCHA (subetapa 2g, ponto 5): com a caixa
   * vazia mostram-se os concelhos que têm página, hoje um, Évora. Os outros
   * aparecem quando o leitor escrever. Uma pesquisa que abre com oito nomes que
   * ninguém pediu diz que aqueles oito são especiais, e não são: são os
   * primeiros da Carta.
   *
   * SÃO DOIS ESTADOS, E OS OUTROS DOIS SAÍRAM:
   *
   *   caixa escrita     os que casam com o que está escrito
   *   caixa vazia       os concelhos com página
   *
   * O terceiro era a lista de proximidade da subetapa 2h (um toque no selo do
   * mapa devolvia os concelhos mais próximos do sítio tocado), e saiu com o mapa
   * do telemóvel no item A4. O quarto era o concelho ESCOLHIDO, que a caixa
   * vazia mostrava ao lado dos que têm página: com a Emenda 19a não há concelho
   * escolhido na primeira página, e o que um resultado faz é abrir a página do
   * concelho, ou dizer que ela ainda não existe, exactamente como em
   * `/municipios`.
   */
  if (campo) {
    var itens = raiz.querySelectorAll('.pesquisa-item');
    var MAX = MAX_RESULTADOS;
    /* A FILA DE RESULTADOS ACENDE-SE COM O GUIÃO (F1.1, item 3, 03.09.2026).
       A busca subiu para debaixo da manchete e o servidor rende a fila com
       `hidden`: os 308 estão no documento, porque o portão tem de ver tudo o que
       o leitor pode ver, e uma fila de 308 nomes no primeiro ecrã seria a página
       inteira para quem não tem guião. É a mesma decisão que `/municipios` já
       tomava com o bloco todo, e é a razão pela qual a caixa só promete filtrar
       onde há quem filtre: sem guião, o que leva a algum lado é o `action` do
       formulário. */
    var fila = raiz.querySelector('[data-resultados]');
    if (fila) fila.hidden = false;
    filtra = function () {
      var q = campo.value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
      var vistos = 0;
      for (var j = 0; j < itens.length; j++) {
        /* Caixa com texto: os oito primeiros que casam. Caixa vazia: os
           concelhos que têm página, que é o que o servidor já rendeu. */
        /* A CAIXA VAZIA DEIXA DE MOSTRAR OITO NOMES (F1.1, 03.09.2026).
           A regra de 2026-08 era «com a caixa vazia mostram-se os concelhos que
           têm página, hoje um, Évora», e a nota ao lado dela dizia porquê: «uma
           pesquisa que abre com oito nomes que ninguém pediu diz que aqueles
           oito são especiais, e não são: são os primeiros da Carta». Com os 308
           construídos, a condição «tem página» deixou de separar alguma coisa e
           a caixa vazia passou a mostrar exactamente esses oito primeiros da
           Carta, que é o que a nota proibia. Com a busca debaixo da manchete, no
           primeiro ecrã, custava também 168 px a quem não pediu nada.

           A regra passa a ser uma só: a fila mostra o que casa com o que está
           escrito, e com a caixa vazia não mostra nada. `/municipios` e
           `/livro-razao/concelhos` ficam como estavam: lá a fila abre por baixo
           de uma lista dos 308 que já está na página, e não no primeiro ecrã. */
        var casa = q.length > 0 && itens[j].getAttribute('data-normal').indexOf(q) >= 0;
        var mostrar = casa && vistos < MAX;
        itens[j].hidden = !mostrar;
        if (mostrar) vistos++;
      }
      if (semResultado) semResultado.hidden = !(q.length > 0 && vistos === 0);
    };
    campo.addEventListener('input', function () {
      filtra();
    });
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      campo.value = '';
      filtra();
      ev.stopPropagation();
    });
  }

  /* --------------------------------- o mapa deixou de escolher (Emenda 19b)
   *
   * VIVIAM AQUI TRÊS MECANISMOS, E OS TRÊS SAÍRAM COM A VISTA DE ESCOLHA:
   *
   *   `pontoEAlvo()`      perguntava à folha se um ponto era alvo naquele estado
   *                       e naquela largura, para que o teclado não escolhesse um
   *                       concelho que nenhum outro gesto alcança (achado 8d);
   *   os 308 ouvintes de clique nas áreas de toque, que escolhiam o concelho;
   *   `[data-trocar]`, «trocar de concelho», que voltava à fila de escolha.
   *
   * Com a Emenda 19b um ponto com página é uma LIGAÇÃO, que o servidor rende, e
   * um ponto sem página não responde a nada: não há estado que acenda alvos, e a
   * pergunta da folha deixou de ter resposta para dar. As 308 áreas de toque
   * saíram do SVG (`MapaRespira.astro`), porque nada as ouvia; o que fica a
   * apanhar o clique é o próprio ponto, dentro da sua ligação.
   *
   * `[data-trocar]` continua a existir na PÁGINA DO CONCELHO, que é onde o cartão
   * localizador vive (Emenda 19d), e ali é uma ligação para o índice dos 308, que
   * funciona sem script nenhum. Esta página não a rende, e por isso não a ouve.
   *
   * A SAÍDA DA VISTA SAIU COM A VISTA. Eram dois caminhos, «fechar» e Escape,
   * para voltar ao âmbito País; com o mapa a não crescer, não há de onde sair. O
   * Escape da caixa de pesquisa continua a limpar a caixa, e é agora o único
   * Escape desta página, o que dispensa o ouvinte do documento e a travagem de
   * propagação que o mantinha longe dele.
   */

  window.addEventListener('popstate', function () {
    /* Um endereço antigo pode voltar pela história (um marcador, ou o botão de
       voltar de uma visita anterior), e vai para onde a Emenda 19a o manda. */
    if (reencaminhaEstadoAntigo()) return;
    aplica(leDoEndereco(), null);
    anuncia();
  });

  /* --------------------------------------------------------------- o arranque
   *
   * Primeiro os endereços antigos: um `?ambito=municipio:<slug>` não se
   * normaliza, muda de página (Emenda 19a), e nada do que vem a seguir tem de
   * correr para uma página que está a sair.
   *
   * O resto do endereço é normalizado à chegada, com `replaceState`: um valor
   * inválido ou desconhecido não fica escrito na barra a fingir que existe, e um
   * valor por defeito não fica escrito a repetir o que o defeito já diz. */
  if (reencaminhaEstadoAntigo()) return;
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
    /* O separador da casa entre o nome e o resto (bloco A, item A6). Entra e sai
       com o nome: um ponto médio sem nome de um lado não separa nada. */
    var separador = document.querySelector('[data-readout-sep]');
    var dica = document.querySelector('[data-dica-cursor]');
    var teclado = document.querySelector('[data-teclado]');

    /* As duas dicas descrevem o que só é verdade com script: entram `hidden` do
       servidor e acendem-se aqui. A folha volta a apagá-las abaixo de 640 e na
       postura de localizador, onde o mapa não lê pontos. A terceira, «Toque num
       ponto para escolher o concelho», saiu com a escolha (Emenda 19b): descrevia
       um gesto que a página deixou de fazer. */
    if (dica) dica.hidden = false;

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
    /* No SVG, ao lado dos pontos: com a lente fora (Emenda 19b) não há
       transformação de que o anel se pudesse separar, e o grupo que ela movia
       saiu com ela. */
    mapa.appendChild(anel);

    var sel = -1;
    var modoTeclado = false;

    var mostra = function (j) {
      sel = j;
      if (j < 0) {
        anel.style.display = 'none';
        if (nome) nome.hidden = true;
        if (separador) separador.hidden = true;
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
      if (separador) separador.hidden = false;
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
      return paraCampoDoMapa(ev.clientX, ev.clientY) || { x: -1e9, y: -1e9 };
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
        /* O ENTER ABRE A PÁGINA DO PONTO, QUANDO ELE TEM UMA (Emenda 19b).
           As setas continuam a ser o «passar o rato» do teclado: percorrem o mapa
           e dizem o nome do concelho em voz alta, que é leitura. O que muda com a
           Emenda 19 é o que o Enter faz no fim dessa leitura: escolhia um
           concelho dentro desta página, e passa a abrir a página dele. Num ponto
           sem página não faz nada, que é o que o mapa promete.

           O DESTINO É O QUE O SERVIDOR ESCREVEU, e não um endereço montado
           aqui: lê-se o `href` da ligação daquele ponto, que já traz a rota da
           edição certa. O caminho é `location.assign` e não um clique sintético
           na ligação, e a razão é medida: um `<a>` dentro de um `svg` é um
           `SVGAElement`, que não tem `click()` (Chromium, 26.08.2026), e chamá-lo
           atirava em vez de navegar. O espaço vale como o Enter, que é a promessa
           do papel de aplicação da tela (etapa 2i, achado 16). */
        if (sel < 0 || !pontos[sel].comPagina) return;
        var destinoDoPonto = portaDoPonto(pontos[sel].slug);
        if (!destinoDoPonto) return;
        ev.preventDefault();
        location.assign(destinoDoPonto);
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

    /* ------------------------------------------------ a lente, desligada e fora
     *
     * Estavam aqui cinco ouvintes na caixa do mapa: `wheel`, `touchstart`,
     * `touchmove`, `touchend` e `dblclick`, todos guardados por `podeAmpliar()`,
     * que era «estamos na vista de escolha e os pontos são alvos». Faziam a
     * ampliação de 1× a 4× e a reposição por toque duplo.
     *
     * Saem inteiros com a Emenda 19b. O `wheel` era o que mais custava: com
     * `preventDefault` dentro da caixa, a roda do rato sobre o mapa deixava de
     * rolar a página, e o leitor que só queria descer ficava preso num mapa a
     * crescer. A caixa do mapa volta a ser uma caixa como as outras, e a roda
     * volta a ser da página.
     */

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
