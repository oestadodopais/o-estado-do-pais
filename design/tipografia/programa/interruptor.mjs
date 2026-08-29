/**
 * O INTERRUPTOR DE FAMÍLIA, E SÓ NESTA CÓPIA.
 *
 * O estudo tipográfico precisa de ver as páginas REAIS do sítio noutra letra.
 * Este ficheiro é a única coisa fora de `design/tipografia/` que o sítio toca, e
 * o que faz é o mínimo que a pergunta exige: troca as três fichas de família
 * (`--f-prosa`, `--f-versal`, `--f-instr`) e o conjunto de `@font-face`. Mais
 * nada. Nenhuma regra de tamanho, de entrelinha, de cor ou de espaço muda: se
 * mudasse, o que a captura mostrava era o meu desenho e não a letra.
 *
 * O DEFEITO É O SÍTIO DE HOJE. Sem `TIPOS_ESTUDO` no ambiente, `folha()` devolve
 * a cadeia vazia e `precargas()` devolve exatamente as duas pré-cargas que o
 * `Base.astro` já tinha. A construção por defeito é, byte a byte, a de antes
 * deste ficheiro existir, e é essa que o `npm run build` inteiro tem de passar.
 *
 * PORQUE É `:root:root` E NÃO `:root`. A folha do estudo entra depois das folhas
 * do sítio, mas a ordem em que o Astro põe as etiquetas no `<head>` não é uma
 * coisa que eu queira depender. `:root:root` tem especificidade 0,2,0 contra a
 * 0,1,0 do `:root` de `tokens.css`: ganha por especificidade, venha antes ou
 * venha depois. O `tokens.css` fica intocado.
 *
 * OS VERSALETES SÃO UM DESCRITOR, E ISSO FOI MEDIDO. O sítio usa `--f-versal`
 * como família e mais nada, em 22 regras: espera que os glifos por defeito dessa
 * família JÁ sejam versaletes, que é o que a Spectral SC é. Uma candidata que
 * traga os versaletes como feature `smcp` não serve assim: trocada a ficha, o
 * texto sairia em minúsculas. O que serve é declarar uma família irmã no próprio
 * `@font-face`, com o descritor `font-feature-settings: 'smcp' 1`, e isso mantém
 * o interruptor dentro do que lhe compete (fichas e `@font-face`).
 *
 * O descritor não se assumiu: mediu-se no Chromium desta máquina, com a Literata
 * a 40px e a palavra «handbook» num `inline-block`:
 *
 *     sem nada ....................... 191,91 px
 *     descritor `font-feature-settings` 209,63 px
 *     regra `font-variant-caps` ...... 209,63 px
 *     descritor `font-variant` ....... 191,91 px  (não pega)
 *
 * O descritor pega e dá o mesmo que a regra. Isto é o Chromium, que é o motor
 * das capturas; uma decisão de compra que dependa deste caminho tem de o
 * confirmar nos outros motores, e este estudo não o fez.
 *
 * O `opsz` fica ao cuidado do navegador. As três serifas candidatas trazem eixo
 * de tamanho ótico e o `font-optical-sizing: auto` é o valor inicial do CSS: a
 * 17 px o navegador pede ao tipo o desenho de 17. É metade da razão de a §3 do
 * brief as ter escolhido, e por isso não se força com `font-variation-settings`.
 */

/** Onde o servidor de capturas serve `design/tipografia/tipos/`. */
export const PREFIXO = '/tipos-estudo';

/**
 * As famílias do estudo. `ficheiros` são os WOFF2 de subconjunto latino que o
 * `subconjunto.py` escreveu; os pesos são os intervalos declarados no `fvar` de
 * cada ficheiro, lidos pelo `inspecionar.py` e não inventados aqui.
 */
export const FAMILIAS = {
  spectral: { papel: 'prosa', rotulo: 'Spectral', controlo: true },
  bitter: { papel: 'instrumento', rotulo: 'Bitter', controlo: true },

  newsreader: {
    papel: 'prosa',
    rotulo: 'Newsreader',
    css: 'Newsreader',
    peso: '200 800',
    ficheiros: {
      normal: 'newsreader/Newsreader-latin.woff2',
      italic: 'newsreader/Newsreader-Italic-latin.woff2',
    },
    /* Sem `smcp` na GSUB (medido): as versais ficam na Spectral SC. */
    smcp: false,
  },

  sourceserif4: {
    papel: 'prosa',
    rotulo: 'Source Serif 4',
    css: 'Source Serif 4',
    peso: '200 900',
    ficheiros: {
      normal: 'sourceserif4/SourceSerif4-latin.woff2',
      italic: 'sourceserif4/SourceSerif4-Italic-latin.woff2',
    },
    smcp: true,
  },

  literata: {
    papel: 'prosa',
    rotulo: 'Literata',
    css: 'Literata',
    peso: '200 900',
    ficheiros: {
      normal: 'literata/Literata-latin.woff2',
      italic: 'literata/Literata-Italic-latin.woff2',
    },
    smcp: true,
  },

  /**
   * ACRESCENTADA PELO LUGAR DE DIREÇÃO DEPOIS DA ADENDA 2, e é a única
   * candidata do estudo que não é variável.
   *
   * `peso: '400'` não é uma escolha: é tudo o que o ficheiro tem. O sítio compõe
   * a prosa a 400, 500, 600 e 700 (as quatro estão na folha construída) e usa
   * itálico em 209 sítios das páginas. A Ledger traz um só ficheiro, regular e
   * direito. Declarar aqui `100 900` seria dizer ao navegador que o ficheiro
   * tem pesos que não tem; declarar `400` deixa o navegador fazer o que faz
   * quando lhe falta um peso, que é engordar o desenho ele próprio, e é isso
   * que as pranchas mostram. A falta não se emenda no interruptor: mede-se.
   */
  ledger: {
    papel: 'prosa',
    rotulo: 'Ledger',
    css: 'Ledger',
    peso: '400',
    ficheiros: { normal: 'ledger/Ledger-latin.woff2' },
    /* Sem `smcp` na GSUB (medido em `MEDIDAS-2-tipo.json`): as versais ficam na
       Spectral SC, como na Newsreader. */
    smcp: false,
  },

  publicsans: {
    papel: 'instrumento',
    rotulo: 'Public Sans',
    css: 'Public Sans',
    peso: '100 900',
    ficheiros: { normal: 'publicsans/PublicSans-latin.woff2' },
    smcp: false,
  },
};

/** As pilhas de recuo, copiadas de `tokens.css` para que só mude o primeiro nome. */
const RECUO_SERIFA = `Georgia, 'Times New Roman', serif`;
const RECUO_INSTR = `'Rockwell', 'Roboto Slab', Georgia, serif`;

/** As duas pré-cargas de hoje, escritas como o `Base.astro` as tinha. */
const PRECARGAS_DE_HOJE = [
  '/tipos/spectral/Spectral-Regular.woff2',
  '/tipos/bitter/Bitter%5Bwght%5D.woff2',
];

/**
 * Lê o nome da combinação do ambiente.
 * @returns {{prosa: string, instrumento: string} | null}
 */
export function combinacao(env = process.env) {
  const cru = (env.TIPOS_ESTUDO || '').trim();
  if (!cru || cru === 'spectral+bitter') return null; // o defeito é o sítio de hoje
  const [prosa, instrumento] = cru.split('+');
  if (!FAMILIAS[prosa] || FAMILIAS[prosa].papel !== 'prosa') {
    throw new Error(`TIPOS_ESTUDO: «${prosa}» não é uma família de prosa do estudo.`);
  }
  if (!FAMILIAS[instrumento] || FAMILIAS[instrumento].papel !== 'instrumento') {
    throw new Error(`TIPOS_ESTUDO: «${instrumento}» não é um instrumento do estudo.`);
  }
  return { prosa, instrumento };
}

function caraDeTexto(f, sufixo, estilo, extra = '') {
  const url = `${PREFIXO}/${f.ficheiros[estilo === 'italic' ? 'italic' : 'normal']}`;
  return `@font-face{font-family:'${f.css}${sufixo}';`
    + `src:url('${url}') format('woff2');`
    + `font-weight:${f.peso};font-style:${estilo};font-display:block;${extra}}`;
}

/**
 * A folha do interruptor: os `@font-face` das candidatas e as três fichas.
 * Cadeia vazia quando não há combinação, e é isso que faz do defeito o sítio.
 *
 * `font-display: block` e não `swap`, e a razão é a captura: com `swap` o
 * Chromium pinta com o recuo enquanto o ficheiro não chega, e uma captura
 * apanhada nesse intervalo mediria a Georgia. O sítio no ar continua com o
 * `swap` de `tokens.css`, que este ficheiro não toca.
 *
 * @returns {string}
 */
export function folha(env = process.env) {
  const c = combinacao(env);
  if (!c) return '';
  const prosa = FAMILIAS[c.prosa];
  const instr = FAMILIAS[c.instrumento];
  const partes = [];
  const fichas = [];

  if (!prosa.controlo) {
    partes.push(caraDeTexto(prosa, '', 'normal'));
    if (prosa.ficheiros.italic) partes.push(caraDeTexto(prosa, '', 'italic'));
    fichas.push(`--f-prosa:'${prosa.css}',${RECUO_SERIFA}`);
    if (prosa.smcp) {
      partes.push(caraDeTexto(prosa, ' SC', 'normal', `font-feature-settings:'smcp' 1;`));
      fichas.push(`--f-versal:'${prosa.css} SC','${prosa.css}',${RECUO_SERIFA}`);
    }
    /* Sem `smcp`, `--f-versal` não se toca: fica a Spectral SC, e a página
       mostra duas letras ao mesmo tempo. É a medida 5 da rubrica a aparecer na
       captura em vez de ficar só na tabela. */
  }

  if (!instr.controlo) {
    partes.push(caraDeTexto(instr, '', 'normal'));
    fichas.push(`--f-instr:'${instr.css}',${RECUO_INSTR}`);
  }

  return partes.join('') + `:root:root{${fichas.join(';')}}`;
}

/**
 * O que o `<head>` pré-carrega. Sem combinação são as duas de hoje, na mesma
 * ordem e com a mesma cadeia. Com combinação são os ficheiros que a página vai
 * mesmo usar: pré-carregar a Spectral numa página composta em Literata seria
 * disputar a largura de banda para um ficheiro que ninguém pede.
 * @returns {string[]}
 */
export function precargas(env = process.env) {
  const c = combinacao(env);
  if (!c) return PRECARGAS_DE_HOJE;
  const prosa = FAMILIAS[c.prosa];
  const instr = FAMILIAS[c.instrumento];
  return [
    prosa.controlo ? PRECARGAS_DE_HOJE[0] : `${PREFIXO}/${prosa.ficheiros.normal}`,
    instr.controlo ? PRECARGAS_DE_HOJE[1] : `${PREFIXO}/${instr.ficheiros.normal}`,
  ];
}

/** O nome da pasta de capturas desta combinação. */
export function nomeDaCombinacao(env = process.env) {
  const c = combinacao(env);
  return c ? `${c.prosa}+${c.instrumento}` : 'spectral+bitter';
}
