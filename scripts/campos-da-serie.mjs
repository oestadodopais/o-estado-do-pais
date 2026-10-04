/**
 * OS CAMPOS DE UMA LINHA DE SÉRIE QUE UMA PÁGINA PODE RENDER, E O QUE CADA UM É
 * (passagem RP3-b, 04.10.2026, o achado 8 da leitura a frio do RP3).
 *
 * Uma lista fechada, num sítio só, lida por três réguas:
 *
 *   · o portão de HTML (`scripts/gate-html.mjs`) admite um `data-serie-campo` só se o
 *     campo estiver nesta lista, e compara o texto com a série;
 *   · a check:lugar (a 8.5 e a L3, `scripts/check-lugar.mjs`) e a superfície da régua
 *     da voz (`scripts/voz-palavras.mjs`) tiram das contagens SÓ os campos de classe
 *     `transcrito`, que são o que a fonte escreve, tal como o escreve (contá-los era
 *     exigir que o projeto emendasse uma citação).
 *
 * As três classes:
 *
 *   · `transcrito`: o nome com que a fonte publica a série, o título do conjunto, o
 *     literal da série, o excerto de cada ponto, a etiqueta de uma marca e a razão de
 *     uma lacuna (que só se rende com a marca quando vem da fonte; sem razão, o recibo
 *     diz uma frase da casa, sem a marca);
 *   · `da-casa`: prosa deste projeto, que fica sob as réguas: a conta em palavras de
 *     uma série derivada e o motivo de uma correção, nas duas línguas;
 *   · `valor`: identificadores e valores que se comparam com a série mas não são prosa
 *     da fonte (o identificador, a fonte, a unidade e a periodicidade pela tabela da
 *     casa, a edição, os endereços, a expressão, os campos de um pedido e os valores de
 *     uma correção); ficam também sob as réguas.
 *
 * Até à passagem RP3-b, a check:lugar e a régua da voz tiravam das contagens todos os
 * campos de uma série menos a conta em palavras, e com eles o motivo de uma correção,
 * que é prosa do projeto; e a check:lugar tirava ainda um invólucro `data-serie` sem
 * campo nenhum.
 */

/** @type {{ forma: RegExp, classe: 'transcrito' | 'da-casa' | 'valor' }[]} */
export const CAMPOS_DA_SERIE = [
  { forma: /^name$/, classe: 'transcrito' },
  { forma: /^document\.title$/, classe: 'transcrito' },
  { forma: /^excerpt$/, classe: 'transcrito' },
  { forma: /^pontos\.\d+\.excerto$/, classe: 'transcrito' },
  { forma: /^bandeiras\.[^.]+$/, classe: 'transcrito' },
  { forma: /^lacunas\.\d+\.razao$/, classe: 'transcrito' },
  { forma: /^derivation(_en)?$/, classe: 'da-casa' },
  { forma: /^corrections\.\d+\.reason(_en)?$/, classe: 'da-casa' },
  { forma: /^(id|source|source_url|unit|periodicidade|check|document\.edition|document\.url)$/, classe: 'valor' },
  { forma: /^pedidos\.\d+\.(url|cliente|user_agent|sha256|bytes)$/, classe: 'valor' },
  { forma: /^corrections\.\d+\.(old_value|new_value)$/, classe: 'valor' },
];

/**
 * A classe de um campo, ou `null` quando o campo não está na lista (e nenhuma página o pode render).
 *
 * @param {string} campo
 * @returns {'transcrito' | 'da-casa' | 'valor' | null}
 */
export function classeDoCampoDaSerie(campo) {
  const achado = CAMPOS_DA_SERIE.find((c) => c.forma.test(String(campo)));
  return achado ? achado.classe : null;
}

/**
 * O seletor dos elementos com um campo transcrito de uma série: o elemento leva `data-serie` E um
 * `data-serie-campo` de classe `transcrito`, e um invólucro `data-serie` sem campo não entra.
 * Escrito a partir da lista acima, para as réguas que trabalham com seletores (a check:lugar).
 */
export const SELETOR_DOS_CAMPOS_TRANSCRITOS = [
  '[data-serie][data-serie-campo="name"]',
  '[data-serie][data-serie-campo="document.title"]',
  '[data-serie][data-serie-campo="excerpt"]',
  '[data-serie][data-serie-campo^="pontos."][data-serie-campo$=".excerto"]',
  '[data-serie][data-serie-campo^="bandeiras."]',
  '[data-serie][data-serie-campo^="lacunas."][data-serie-campo$=".razao"]',
].join(', ');

/**
 * A prova de que o seletor e a lista dizem o mesmo, para quem o usa a conferir a cada corrida: cada campo
 * de exemplo é apanhado pelo seletor se e só se a lista o diz transcrito.
 *
 * @param {(html: string) => any} parse o leitor de HTML de quem chama
 * @returns {string[]} os desacordos (vazio quando concordam)
 */
export function desacordosDoSeletor(parse) {
  const exemplos = [
    'name', 'document.title', 'excerpt', 'pontos.7.excerto', 'bandeiras.e', 'bandeiras.&', 'lacunas.0.razao',
    'derivation', 'derivation_en', 'corrections.0.reason', 'corrections.3.reason_en', 'check', 'unit',
    'document.edition', 'document.url', 'pedidos.12.url', 'pedidos.0.cliente', 'corrections.0.old_value', 'id',
  ];
  const html = exemplos.map((c, i) => `<span data-serie="s" data-serie-campo="${c.replace(/&/g, '&amp;')}" id="e${i}">x</span>`).join('');
  const vistos = new Set(parse(`<div>${html}<span data-serie="s" id="sem-campo">x</span></div>`).querySelectorAll(SELETOR_DOS_CAMPOS_TRANSCRITOS).map((e) => e.getAttribute('id')));
  const out = [];
  exemplos.forEach((c, i) => {
    const deve = classeDoCampoDaSerie(c) === 'transcrito';
    if (deve !== vistos.has(`e${i}`)) out.push(`${c}: a lista diz ${deve ? '' : 'não '}transcrito e o seletor ${vistos.has(`e${i}`) ? 'apanha-o' : 'não o apanha'}`);
  });
  if (vistos.has('sem-campo')) out.push('o seletor apanha um invólucro data-serie sem campo');
  return out;
}
