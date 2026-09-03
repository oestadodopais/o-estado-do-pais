/**
 * O renderizador do registo de conteúdo: do registo para a página de leitura.
 *
 * Funções puras, sem Astro e sem disco. Recebem um registo já lido
 * (`src/lib/registos.mjs`) e devolvem as peças que a vista compõe. O contrato de
 * marcação é o da nona origem, e está escrito por extenso em `DECISIONS.md`
 * §2.2 item 9 e §1.64; aqui fica o que ele obriga em código:
 *
 *   `data-registo-edicao="<slug>/<lingua>"`      no `<article>`, uma vez
 *   `data-registo-bloco="<b>"`                   em cada elemento de bloco
 *   `data-registo-unidade="<slug>/<lingua>#<b>[.<i>|.<r>.<c>]"`   em cada unidade
 *   `data-registo="<slug>/<lingua>#<b>[…].<f>"`  à volta dos caracteres de uma figura
 *
 * A PÁGINA DE LEITURA É UMA TRANSCRIÇÃO, e é daqui que isso se vê no código:
 * nada é reformatado. O texto sai como o registo o guarda, os algarismos saem
 * como o documento os imprime (`printed`, nunca `value`), e o separador de
 * milhares é o que o documento tem. A casa não escreve uma palavra dentro de uma
 * unidade; a única coisa nossa que lá entra é o selo, e entra porque a
 * `IDENTIDADE.md` §5.3 não abre exceção de página.
 *
 * ---------------------------------------------------------------------------
 * PORQUE SÃO PEÇAS E NÃO UMA CADEIA
 * ---------------------------------------------------------------------------
 * O selo tem de ser SEMPRE o componente `<Provenance>`, e nunca uma cópia do seu
 * markup: uma cópia sai de passo no dia em que o componente mudar, e o portão
 * compara o selo contra o que o registo dos trabalhos escreve. Uma função pura
 * não pode render um componente Astro. Por isso estas funções devolvem uma lista
 * de peças, cada uma `{ html }` ou `{ selo: <id da linha do sítio> }`, e a vista
 * põe o componente onde a peça o pede. A lista é plana de propósito: a vista
 * concatena-a sem um único nó de texto pelo meio, que é o que o contrato exige
 * («o selo entra sem nós de texto em branco de nenhum dos lados»).
 *
 * ---------------------------------------------------------------------------
 * A PARTIÇÃO É UMA SÓ
 * ---------------------------------------------------------------------------
 * Ênfase, ligação e figura são intervalos de pontos de código sobre o texto da
 * unidade, e podem conter-se uns aos outros. Três passagens sobrepostas
 * produziriam marcação mal aninhada; por isso há uma partição só, sobre a união
 * de todas as fronteiras, com aninhamento por contenção. **Medido a 24.08.2026
 * nas oito edições do âmbito: zero cruzamentos parciais**, 116 figuras dentro de
 * uma ênfase, 42 dentro de uma ligação, nenhuma figura sobreposta a outra. Um
 * cruzamento parcial que apareça num registo futuro **pára a construção** com a
 * coordenada, em vez de partir a figura em dois elementos com a mesma marca.
 */

/** O que o portão e a página usam como separador de uma lista numa cadeia só. */
export const SEPARADOR = ' · ';

/** Os cinco motivos da lista fechada do motor, e mais nenhum (REGISTOS.md). */
export const MOTIVOS_SEM_RESUMO = new Set([
  'derivado',
  'api-viva',
  'raw-sem-manifesto',
  'pdf-sem-resumo',
  'portal-estatico',
]);

/** Uma estrutura do registo que este renderizador recusa em vez de adivinhar. */
export class FalhaDoRegisto extends Error {}

/** @param {unknown} s */
const escapaTexto = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @param {unknown} s */
const escapaAtributo = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * As unidades de um bloco, com a sua coordenada, em ordem de documento.
 *
 * @param {BlocoDoRegisto} bloco
 * @returns {{ unidade: UnidadeDoRegisto, coordenada: string }[]}
 */
export function unidadesDoBloco(bloco) {
  if (bloco.kind === 'heading' || bloco.kind === 'paragraph') return [{ unidade: bloco, coordenada: '' }];
  if (bloco.kind === 'list') return bloco.items.map((u, i) => ({ unidade: u, coordenada: `.${i}` }));
  if (bloco.kind === 'table') {
    /** @type {{ unidade: UnidadeDoRegisto, coordenada: string }[]} */
    const saida = [];
    bloco.rows.forEach((linha, r) => {
      linha.forEach((celula, c) => saida.push({ unidade: celula, coordenada: `.${r}.${c}` }));
    });
    return saida;
  }
  if (bloco.kind === 'rule') return [];
  /* Os cinco géneros conhecidos já regressaram: o que chega aqui é um género
     que o registo não devia trazer, e o molde diz isso ao verificador. */
  throw new FalhaDoRegisto(`género de bloco desconhecido: "${/** @type {{ kind: unknown }} */ (bloco).kind}"`);
}

/**
 * Todas as figuras de um registo, em ordem de documento, com a sua marca.
 *
 * @param {RegistoDeConteudo} registo
 * @param {string} chave
 */
export function* figurasDoRegisto(registo, chave) {
  for (const bloco of registo.blocks) {
    for (const { unidade, coordenada } of unidadesDoBloco(bloco)) {
      const figuras = unidade.figures ?? [];
      for (let f = 0; f < figuras.length; f++) {
        yield { figura: figuras[f], marca: `${chave}#${bloco.i}${coordenada}.${f}`, bloco, unidade };
      }
    }
  }
}

/**
 * AS LINHAS DESTE DOCUMENTO — uma entrada por linha do motor citada.
 *
 * Na ordem da primeira citação, com quatro campos e mais nenhum: a linha do
 * motor, o valor como a linha o guarda, como este documento o imprime, e o
 * resumo de origem. Uma linha que também tenha linha no livro-razão do sítio
 * leva a porta para lá, que é a mesma porta que o selo já abre, aqui na forma
 * longa.
 *
 * `impresso` junta as formas `printed` distintas dessa linha, na ordem do
 * documento, com o separador da casa: **medido**, 24 das 1 888 entradas das oito
 * edições imprimem a mesma linha de mais do que uma maneira, e escolher uma
 * delas seria a página a esconder o que o documento faz.
 *
 * @param {RegistoDeConteudo} registo
 * @param {string} chave
 * @param {(row: string) => (string | null)} linhaDoSitio
 */
export function linhasDoDocumento(registo, chave, linhaDoSitio) {
  /** @type {Map<string, LinhaDoDocumento>} */
  const porRow = new Map();
  for (const { figura } of figurasDoRegisto(registo, chave)) {
    if (!porRow.has(figura.row)) {
      porRow.set(figura.row, {
        row: figura.row,
        valor: figura.value,
        impressos: [],
        origem: figura.source_sha256 ?? figura.source_digest_kind ?? null,
        comResumo: Boolean(figura.source_sha256),
        siteId: linhaDoSitio(figura.row),
        figuras: 0,
      });
    }
    /* A linha acima acabou de a pôr no mapa quando faltava. */
    const entrada = /** @type {LinhaDoDocumento} */ (porRow.get(figura.row));
    entrada.figuras++;
    if (!entrada.impressos.includes(figura.printed)) entrada.impressos.push(figura.printed);
    if (entrada.valor !== figura.value) {
      throw new FalhaDoRegisto(
        `a linha do motor "${figura.row}" aparece com dois valores neste registo: ` +
          `"${entrada.valor}" e "${figura.value}"`,
      );
    }
    if (entrada.origem === null) {
      throw new FalhaDoRegisto(
        `a figura da linha "${figura.row}" não tem resumo de origem nem motivo de ausência`,
      );
    }
    if (!entrada.comResumo && !MOTIVOS_SEM_RESUMO.has(entrada.origem)) {
      throw new FalhaDoRegisto(
        `a linha do motor "${figura.row}" traz o motivo "${entrada.origem}", que não é um dos ` +
          `cinco da lista fechada do motor`,
      );
    }
  }
  return [...porRow.values()].map((e) => ({ ...e, impresso: e.impressos.join(SEPARADOR) }));
}

/**
 * OS TÍTULOS DO REGISTO: o índice «Nesta página» (item B4; F1.9a, 03.09.2026).
 *
 * Devolve, na ordem do documento, o índice do bloco, o seu nível e o seu texto
 * tal como o registo o guarda. A vista não reescreve nada: o texto entra na
 * página com a marca `data-registo-indice`, que o portão compara carácter a
 * carácter com este mesmo bloco (L8). Seis dos títulos das oito edições trazem
 * um ano nas palavras, e é por isso que o índice tem de entrar por uma origem
 * conferida e não por prosa da casa.
 *
 * ---------------------------------------------------------------------------
 * DE NÍVEL 2 PARA NÍVEL 2 E 3 (bloco F1.9a, §1.1 do brief)
 * ---------------------------------------------------------------------------
 * O índice do bloco B levava só os títulos de nível 2, e as oito edições têm
 * entre 2 e 20 títulos de nível 3 que ficavam de fora: numa página de 67 ecrãs
 * (`evora-quinze-anos-cinco-mandatos`, medido a 390 × 664), as 20 secções de
 * nível 3 são metade do documento e não tinham porta nenhuma. Passam a entrar,
 * aninhadas debaixo do título de nível 2 que as antecede, e o L8 do portão
 * compara-as pela mesma regra: mesma contagem, mesma ordem, mesmo texto.
 *
 * O nível 4 fica de fora, e é uma escolha e não um esquecimento: uma só edição
 * os tem (dez, em `evora-os-pelouros-quem-os-teve-o-que-fizeram`), e um índice
 * de três andares numa dobra de telemóvel deixa de ser um índice.
 *
 * @param {RegistoDeConteudo} registo
 * @returns {{ i: unknown, nivel: number, texto: string }[]}
 */
export function titulosDoDocumento(registo) {
  return registo.blocks
    .filter((b) => b.kind === 'heading' && (Number(b.level) === 2 || Number(b.level) === 3))
    .map((b) => ({ i: b.i, nivel: Number(b.level), texto: String(b.text ?? '') }));
}

/**
 * As três contagens da faixa do aparelho, recontadas do registo.
 *
 * @param {RegistoDeConteudo} registo
 * @param {string} chave
 * @param {(row: string) => (string | null)} linhaDoSitio
 */
export function contasDoRegisto(registo, chave, linhaDoSitio) {
  let algarismos = 0;
  let comLinha = 0;
  for (const { figura } of figurasDoRegisto(registo, chave)) {
    algarismos++;
    if (linhaDoSitio(figura.row)) comLinha++;
  }
  return { blocos: registo.blocks.length, algarismos, com_linha_do_sitio: comLinha };
}

/* ========================================================================== */
/* A partição única                                                            */
/* ========================================================================== */

/** A ordem de aninhamento quando dois intervalos começam no mesmo sítio. */
const ORDEM = { ligacao: 0, enfase: 1, figura: 2 };

/**
 * @param {UnidadeDoRegisto} unidade
 * @param {string} marcaDaUnidade
 * @returns {IntervaloDaUnidade[]}
 */
function intervalosDaUnidade(unidade, marcaDaUnidade) {
  /** @type {IntervaloDaUnidade[]} */
  const saida = [];
  for (const l of unidade.links ?? []) {
    saida.push({ tipo: 'ligacao', inicio: l.start, fim: l.end, href: l.href });
  }
  for (const e of unidade.emphasis ?? []) {
    saida.push({ tipo: 'enfase', inicio: e.start, fim: e.end, kind: e.kind });
  }
  const figuras = unidade.figures ?? [];
  for (let f = 0; f < figuras.length; f++) {
    saida.push({
      tipo: 'figura',
      inicio: figuras[f].start,
      fim: figuras[f].end,
      figura: figuras[f],
      marca: `${marcaDaUnidade}.${f}`,
    });
  }
  return saida;
}

/**
 * A árvore de intervalos de uma unidade, por contenção.
 *
 * Um cruzamento parcial pára a construção com a coordenada, em vez de partir a
 * figura em dois elementos com a mesma marca: dois elementos com a mesma marca
 * seriam duas afirmações sobre o mesmo algarismo, e o portão não teria como
 * dizer qual delas é a figura.
 *
 * @param {UnidadeDoRegisto} unidade
 * @param {string} marcaDaUnidade
 * @param {string} texto
 * @returns {NoDoIntervalo}
 */
export function arvoreDeIntervalos(unidade, marcaDaUnidade, texto) {
  const intervalos = intervalosDaUnidade(unidade, marcaDaUnidade);
  for (const iv of intervalos) {
    if (!(Number.isInteger(iv.inicio) && Number.isInteger(iv.fim) && 0 <= iv.inicio && iv.inicio < iv.fim && iv.fim <= texto.length)) {
      throw new FalhaDoRegisto(
        `${marcaDaUnidade}: o intervalo ${iv.tipo} [${iv.inicio}, ${iv.fim}) não cabe num texto de ` +
          `${texto.length} caracteres`,
      );
    }
  }
  intervalos.sort(
    (a, b) => a.inicio - b.inicio || b.fim - a.fim || ORDEM[a.tipo] - ORDEM[b.tipo],
  );
  /** @type {NoDoIntervalo} */
  const raiz = { tipo: 'raiz', inicio: 0, fim: texto.length, filhos: [] };
  /** @type {NoDoIntervalo[]} */
  const pilha = [raiz];
  for (const iv of intervalos) {
    while (pilha.length > 1 && iv.inicio >= pilha[pilha.length - 1].fim) pilha.pop();
    const topo = pilha[pilha.length - 1];
    if (iv.fim > topo.fim) {
      throw new FalhaDoRegisto(
        `${marcaDaUnidade}: cruzamento parcial entre o intervalo ${topo.tipo} ` +
          `[${topo.inicio}, ${topo.fim}) e o intervalo ${iv.tipo} [${iv.inicio}, ${iv.fim}). ` +
          `A composição pára aqui: partir a figura em dois elementos com a mesma marca seria ` +
          `duas afirmações sobre o mesmo algarismo.`,
      );
    }
    /** @type {NoDoIntervalo} */
    const no = { ...iv, filhos: [] };
    topo.filhos.push(no);
    pilha.push(no);
  }
  return raiz;
}

/* ========================================================================== */
/* As peças                                                                    */
/* ========================================================================== */

/** Um acumulador que junta HTML seguido numa peça só e guarda os selos em ordem. */
function acumulador() {
  /** @type {PecaDoRegisto[]} */
  const pecas = [];
  return {
    pecas,
    /** @param {string} s */
    html(s) {
      if (!s) return;
      const ultima = /** @type {{ html?: string }} */ (pecas[pecas.length - 1]);
      if (ultima && ultima.html !== undefined) ultima.html += s;
      else pecas.push({ html: s });
    },
    /** @param {string} id */
    selo(id) {
      pecas.push({ selo: id });
    },
  };
}

/**
 * A PORTA DE UMA FIGURA QUE ESTÁ DENTRO DE UMA LIGAÇÃO DO DOCUMENTO.
 *
 * Vai imediatamente depois da ligação, uma por figura sem linha do sítio, na
 * ordem das figuras. É a gémea da regra do selo, e existe pela mesma razão: uma
 * âncora não aninha noutra, a ligação do documento manda sobre o seu texto, e a
 * `IDENTIDADE.md` §5.3 e §10 não abrem exceção: onde aparece um valor, aparece
 * a porta. A forma direta (a própria figura ser a âncora) continua a valer fora
 * de ligações, que é onde ela é possível.
 *
 * **SEM NÓ DE TEXTO LÁ DENTRO**, e é o que a torna invisível à comparação da
 * unidade: a leitura do olho não junta nada de um elemento de linha vazio (o
 * intervalo só se grava quando `pedacos.length` cresce), e por isso o texto da
 * unidade continua a ser, carácter a carácter, o do registo. O glifo é da folha
 * (`::after`), o nome acessível é o `aria-label`, e nenhum dos dois é texto do
 * documento.
 *
 * **O NOME ACESSÍVEL NÃO LEVA A CHAVE DA LINHA** (I83, 28.08.2026). Levou-a até
 * hoje, a seguir ao rótulo: `aria-label="linha do motor: tc-year-1-2008"`. Quem
 * ouve a página ouvia o identificador de um artefacto do motor, e um rótulo de
 * acessibilidade existe para dizer o que a porta abre. A chave continua no
 * `href`, que é onde ela é um endereço; o rótulo diz de que figura é a linha, e
 * é isso que separa duas portas seguidas dentro da mesma ligação.
 *
 * @param {string} row
 * @param {ContextoDoRegisto} ctx
 */
function portaAposALigacao(row, ctx) {
  return (
    `<a class="texto-figura-porta-apos" href="#linha-${escapaAtributo(row)}" ` +
    `aria-label="${escapaAtributo(ctx.rotuloDaPorta)}"></a>`
  );
}

/**
 * A ligação aberta, quando `dentroDeLigacao` diz que há uma.
 *
 * Os dois campos movem-se sempre juntos em `escreveNo` (`dentroDeLigacao++` e
 * `ligacaoAberta = filho`, e o contrário à saída), por isso um deles a dizer
 * que há ligação é o outro a ter o nó. O molde diz isso; nada muda no que corre.
 *
 * @param {ContextoDoRegisto} ctx
 * @returns {{ tipo: 'ligacao', inicio: number, fim: number, href: string, filhos: NoFilhoDoIntervalo[], saidasPendentes?: SaidaPendenteDoRegisto[] }}
 */
const aberta = (ctx) =>
  /** @type {{ tipo: 'ligacao', inicio: number, fim: number, href: string, filhos: NoFilhoDoIntervalo[], saidasPendentes?: SaidaPendenteDoRegisto[] }} */ (
    ctx.ligacaoAberta
  );

/**
 * @param {NoFilhoDoIntervalo} no
 * @param {ReturnType<typeof acumulador>} saida
 * @param {ContextoDoRegisto} ctx
 */
function abreIntervalo(no, saida, ctx) {
  if (no.tipo === 'ligacao') {
    saida.html(`<a class="texto-ligacao" href="${escapaAtributo(no.href)}" rel="noopener">`);
    return;
  }
  if (no.tipo === 'enfase') {
    const tag = no.kind === 'strong' ? 'strong' : no.kind === 'em' ? 'em' : 'code';
    saida.html(`<${tag}>`);
    return;
  }
  /* Uma figura. */
  const siteId = ctx.linhaDoSitio(no.figura.row);
  const marca = ` data-registo="${escapaAtributo(no.marca)}"`;
  if (siteId) {
    saida.html(`<span class="texto-figura"${marca}>`);
    return;
  }
  /* Sem linha do sítio: a porta para a sua entrada em «As linhas deste
     documento». Dentro de uma ligação do documento não pode haver uma segunda
     âncora aninhada, e por isso a porta vai IMEDIATAMENTE DEPOIS da ligação,
     que é a mesma saída que o selo já usa (`fechaIntervalo`). */
  if (ctx.dentroDeLigacao > 0) {
    saida.html(`<span class="texto-figura"${marca}>`);
    return;
  }
  saida.html(
    `<a class="texto-figura texto-figura-porta" href="#linha-${escapaAtributo(no.figura.row)}"${marca}>`,
  );
}

/**
 * @param {NoFilhoDoIntervalo} no
 * @param {ReturnType<typeof acumulador>} saida
 * @param {ContextoDoRegisto} ctx
 */
function fechaIntervalo(no, saida, ctx) {
  if (no.tipo === 'ligacao') {
    saida.html('</a>');
    /* AS SAÍDAS DAS FIGURAS QUE ESTA LIGAÇÃO CONTÉM, NA ORDEM DAS FIGURAS.
       Uma por figura, selos e portas intercalados, sem um nó de texto pelo
       meio: é o que as conferências L6 e C6 percorrem para saber qual saída é
       de qual figura. */
    for (const saidaPendente of no.saidasPendentes ?? []) {
      /* `'selo' in x` e não `x.selo !== undefined`: o tipo diz que uma saída é
         um selo OU uma porta, e a pergunta é a que separa os dois (leitura a
         frio, Major 15). Para os objetos que este módulo constrói, com uma
         chave só, as duas perguntas dão sempre a mesma resposta. */
      if ('selo' in saidaPendente) saida.selo(saidaPendente.selo);
      else saida.html(portaAposALigacao(saidaPendente.porta, ctx));
    }
    return;
  }
  if (no.tipo === 'enfase') {
    const tag = no.kind === 'strong' ? 'strong' : no.kind === 'em' ? 'em' : 'code';
    saida.html(`</${tag}>`);
    return;
  }
  const siteId = ctx.linhaDoSitio(no.figura.row);
  if (siteId) {
    saida.html('</span>');
    /* O selo nunca fica dentro de uma ligação nem de outro alvo (Emenda 2):
       numa figura dentro de uma ligação do documento, vai imediatamente depois
       de a ligação fechar. */
    if (ctx.ligacaoAberta) (aberta(ctx).saidasPendentes ??= []).push({ selo: siteId });
    else saida.selo(siteId);
    return;
  }
  if (ctx.dentroDeLigacao > 0) {
    saida.html('</span>');
    /* A porta, pela mesma regra do selo: uma âncora não aninha noutra, e a
       saída vai imediatamente depois da ligação. */
    (aberta(ctx).saidasPendentes ??= []).push({ porta: no.figura.row });
    return;
  }
  saida.html('</a>');
}

/**
 * @param {NoDoIntervalo} no
 * @param {string} texto
 * @param {ReturnType<typeof acumulador>} saida
 * @param {ContextoDoRegisto} ctx
 */
function escreveNo(no, texto, saida, ctx) {
  let cursor = no.inicio;
  for (const filho of no.filhos) {
    saida.html(escapaTexto(texto.slice(cursor, filho.inicio)));
    const ligacaoAnterior = ctx.ligacaoAberta;
    if (filho.tipo === 'ligacao') {
      ctx.dentroDeLigacao++;
      ctx.ligacaoAberta = filho;
    }
    abreIntervalo(filho, saida, ctx);
    escreveNo(filho, texto, saida, ctx);
    if (filho.tipo === 'ligacao') {
      ctx.dentroDeLigacao--;
      ctx.ligacaoAberta = ligacaoAnterior;
    }
    fechaIntervalo(filho, saida, ctx);
    cursor = filho.fim;
  }
  saida.html(escapaTexto(texto.slice(cursor, no.fim)));
}

/**
 * O conteúdo de uma unidade: o texto do registo, com os seus intervalos.
 *
 * @param {UnidadeDoRegisto} unidade
 * @param {string} marca
 * @param {ReturnType<typeof acumulador>} saida
 * @param {ContextoDoRegisto} ctx
 */
function escreveUnidade(unidade, marca, saida, ctx) {
  const texto = String(unidade.text ?? '');
  const arvore = arvoreDeIntervalos(unidade, marca, texto);
  ctx.dentroDeLigacao = 0;
  ctx.ligacaoAberta = null;
  escreveNo(arvore, texto, saida, ctx);
}

/** @param {string} marca */
const atributosDaUnidade = (marca) => ` data-registo-unidade="${escapaAtributo(marca)}"`;

/**
 * As peças do corpo transcrito de uma edição: os blocos do registo, na ordem do
 * registo, e mais nada.
 *
 * `rotuloDaPorta` é o nome acessível da porta que vai a seguir a uma ligação do
 * documento, na língua da edição (`estudos.textoPortaDaLinha`). É pedido aqui e
 * não importado: este módulo não sabe línguas, e a vista já as sabe. Sem ele
 * a construção pára, porque uma porta sem nome é uma ligação que um leitor de
 * ecrã anuncia vazia.
 *
 * @param {{registo: RegistoDeConteudo, chave: string, linhaDoSitio: (row: string) => (string|null), rotuloDaPorta: string}} args
 * @returns {PecaDoRegisto[]}
 */
export function pecasDoCorpo({ registo, chave, linhaDoSitio, rotuloDaPorta }) {
  if (typeof rotuloDaPorta !== 'string' || rotuloDaPorta === '') {
    throw new FalhaDoRegisto(
      'pecasDoCorpo: falta o "rotuloDaPorta", que é o nome acessível da porta que vai a seguir a ' +
        'uma ligação do documento. Uma porta sem nome é uma ligação vazia para quem a ouve.',
    );
  }
  const saida = acumulador();
  const ctx = { linhaDoSitio, rotuloDaPorta, dentroDeLigacao: 0, ligacaoAberta: null };

  registo.blocks.forEach((bloco, indice) => {
    if (bloco.i !== indice) {
      throw new FalhaDoRegisto(
        `o registo tem o bloco ${indice} com o índice ${bloco.i}: os índices têm de ser ` +
          `contíguos desde zero`,
      );
    }
    const marcaDoBloco = ` data-registo-bloco="${bloco.i}"`;
    const base = `${chave}#${bloco.i}`;

    if (bloco.kind === 'rule') {
      saida.html(`<hr${marcaDoBloco} />`);
      return;
    }
    if (bloco.kind === 'heading') {
      const nivel = Math.min(Math.max(Number(bloco.level) || 1, 1), 6);
      /* O ID DE UM TÍTULO É O SEU ÍNDICE DE BLOCO, e não uma cadeia derivada do
         texto (bloco B, item B4). É o que o índice «Nesta página» abre, e é a
         mesma coordenada que o `data-registo-bloco` já declara: um id feito do
         texto mudaria no dia em que o documento mudasse uma palavra, e uma
         âncora partilhada que muda é uma âncora partida. */
      saida.html(`<h${nivel} id="bloco-${bloco.i}"${marcaDoBloco}${atributosDaUnidade(base)}>`);
      escreveUnidade(bloco, base, saida, ctx);
      saida.html(`</h${nivel}>`);
      return;
    }
    if (bloco.kind === 'paragraph') {
      saida.html(`<p${marcaDoBloco}${atributosDaUnidade(base)}>`);
      escreveUnidade(bloco, base, saida, ctx);
      saida.html('</p>');
      return;
    }
    if (bloco.kind === 'list') {
      const tag = bloco.ordered ? 'ol' : 'ul';
      saida.html(`<${tag} class="texto-lista"${marcaDoBloco}>`);
      bloco.items.forEach((item, i) => {
        const marca = `${base}.${i}`;
        saida.html(`<li${atributosDaUnidade(marca)}>`);
        escreveUnidade(item, marca, saida, ctx);
        saida.html('</li>');
      });
      saida.html(`</${tag}>`);
      return;
    }
    if (bloco.kind === 'table') {
      /* A caixa que rola no móvel. Não é um bloco para a leitura do olho, e por
         isso não leva marca nenhuma: a marca do bloco é da `<table>`. */
      saida.html(`<div class="texto-tabela"><table${marcaDoBloco}>`);
      bloco.rows.forEach((linha, r) => {
        saida.html('<tr>');
        linha.forEach((celula, c) => {
          const tag = celula.header ? 'th' : 'td';
          const marca = `${base}.${r}.${c}`;
          const escopo = celula.header ? (r === 0 ? ' scope="col"' : ' scope="row"') : '';
          saida.html(`<${tag}${escopo}${atributosDaUnidade(marca)}>`);
          escreveUnidade(celula, marca, saida, ctx);
          saida.html(`</${tag}>`);
        });
        saida.html('</tr>');
      });
      saida.html('</table></div>');
      return;
    }
    /* Como em `unidadesDoBloco`: os cinco géneros conhecidos já regressaram. */
    throw new FalhaDoRegisto(
      `género de bloco desconhecido: "${/** @type {{ kind: unknown }} */ (bloco).kind}"`,
    );
  });

  return saida.pecas;
}
