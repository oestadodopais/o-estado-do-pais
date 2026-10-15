// Monta o src/data/metodo.mjs novo: o cabeçalho e a abertura escritos aqui, os blocos que não mudam lidos
// do ficheiro de hoje por linha, e as secções geradas das frases do mandato (frases-do-mandato.json).
// uso: node montar-metodo.mjs <metodo.mjs de hoje> <frases-do-mandato.json> <saída>
import fs from 'node:fs';
const [atual, frasesJson, saida] = process.argv.slice(2);
const L = fs.readFileSync(atual, 'utf8').split('\n');
const linhas = (a, b) => L.slice(a - 1, b);
const d = JSON.parse(fs.readFileSync(frasesJson, 'utf8'));

/* Os blocos que ficam, conferidos pela primeira e pela última linha antes de se copiarem. */
const endereco = linhas(48, 58);
if (!endereco[1].includes('O endereço das correções') || !endereco.at(-1).startsWith('export const ENDERECO_CORRECOES')) throw new Error('o bloco do endereço mudou de lugar');
const fecho = linhas(75, 166);
if (!fecho[2].includes('A ENTRADA DE FECHO') || !fecho.includes('export const FECHO = {') || fecho.at(-1) !== '};') throw new Error('o bloco do fecho mudou de lugar');
fecho[2] = ' * A ENTRADA DE FECHO · as linhas rotuladas com que a página acaba';
const marcadores = linhas(168, 176);
if (!marcadores[0].startsWith('/** O marcador da casa') || marcadores.at(-1) !== 'const M = MARCADORES;') throw new Error('o bloco do marcador mudou de lugar');
marcadores[0] = '/** O marcador, citado na secção do que está por confirmar. */';

const CHAVES = new Set(['afirmacoes', 'fontes', 'indexaveis', 'divida', 'linhas_reconferidas', 'releituras_registadas',
  'releituras_divergentes', 'painel_reconferido_em', 'correcoes', 'atualizacoes', 'revisoes_de_proveniencia']);
const lit = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
/* A frase da escala é a única da forma que muda: a leitura a frio do Codex (15.10.2026, o achado 11) leu-a como
   ininteligível para um leitor de primeira vez, e o mandato (§3.9) dá a frase nova, que diz o mesmo em palavras
   correntes. Troca-se a frase das duas edições e o parágrafo do comentário que dizia que as palavras não mudavam. */
if (!d.fecho_escala?.pt || !d.fecho_escala?.en) throw new Error('as frases do mandato não trazem a frase nova da escala (§3.9)');
const ESCALA = {
  pt: "        pt: ['As classes são marcas redondas da escala, e não um limite oficial.'],",
  en: "        en: ['The classes are round scale marks, not an official limit.'],",
};
for (const lingua of ['pt', 'en']) {
  const i = fecho.indexOf(ESCALA[lingua]);
  if (i < 0 || fecho.indexOf(ESCALA[lingua], i + 1) >= 0) throw new Error(`a frase da escala (${lingua}) não está uma vez no fecho`);
  fecho[i] = `        ${lingua}: [${lit(d.fecho_escala[lingua])}],`;
}
const COMENTARIO = [
  '         AS PALAVRAS NÃO MUDAM, e a cadeia não se duplica: saiu de',
  '         `src/i18n/strings.mjs` (`dominios.mapaEscalaNota`, nas duas edições) e',
  '         vive aqui, que é o único sítio onde ela se rende. */',
];
const c = fecho.indexOf(COMENTARIO[0]);
if (c < 0 || fecho[c + 1] !== COMENTARIO[1] || fecho[c + 2] !== COMENTARIO[2]) throw new Error('o comentário da escala mudou de forma');
fecho.splice(c, 3,
  '         AS PALAVRAS MUDARAM A 15.10.2026 (bloco ME1): a leitura a frio do Codex',
  '         (o achado 11) leu a frase antiga, que falava de classes e de marcas sem',
  '         dizer de quê, como ininteligível para um leitor de primeira vez, e o',
  '         mandato (§3.9) dá a frase nova, que diz o mesmo em palavras correntes.',
  '         A primeira redação nova, «as classes da escala», foi lida pela leitura',
  '         curta do Codex do mesmo dia (o achado 7) como um termo ainda por',
  '         explicar, e a frase diz agora «os valores onde a cor muda».',
  '         A cadeia não se duplica: saiu de `src/i18n/strings.mjs`',
  '         (`dominios.mapaEscalaNota`, nas duas edições) e vive aqui, que é o',
  '         único sítio onde ela se rende. */');
function pedacos(frase) {
  const out = [];
  const re = /\{([a-z_]+)\}/g;
  let i = 0, m;
  while ((m = re.exec(frase))) {
    if (m.index > i) out.push(lit(frase.slice(i, m.index)));
    const k = m[1];
    if (k === 'email') out.push('{ email: ENDERECO_CORRECOES }');
    else if (k === 'marcador') out.push('M.mencaoVerificar');
    else if (CHAVES.has(k)) out.push(`{ prova: '${k}' }`);
    else throw new Error(`token desconhecido: ${k}`);
    i = m.index + m[0].length;
  }
  if (i < frase.length) out.push(lit(frase.slice(i)));
  return out;
}
/* O id de cada secção, pela tabela do §2 do mandato, e o destino de cada porta, pelo §3. */
const IDS = { 2: 'fontes', 3: 'livro-razao', 4: 'releitura', 5: 'por-confirmar', 6: 'correcoes', 7: 'agenda', 8: 'o-que-nao-faz' };
const DESTINOS = {
  'Ver o livro-razão': "rota: 'livro'",
  'Ver um recibo de exemplo': "rota: 'linha', params: { slug: 'divida-publica-2025' }",
  'Os resultados das verificações desta construção': 'prova: true',
  'Portugal na União Europeia': "rota: 'uniaoEuropeia'",
  'O que quer dizer este marcador': "rota: 'marcador'",
  'O registo inteiro': "rota: 'correcoes'",
  'A agenda': "rota: 'agenda'",
  'Os estudos': "rota: 'estudos'",
  'Privacidade': "rota: 'privacidade'",
};
const NOTAS = {
  4: [
    '    /* A PORTA DA PROVA é o ficheiro que o portão de HTML escreve no fim de um varrimento limpo. O endereço vem',
    '       de `src/lib/prova.mjs` e não se escreve aqui: este ficheiro não pode importar de lá (a prova importa daqui',
    '       o endereço das correções), e por isso a vista resolve a marca. */',
  ],
  8: [
    "    /* As cinco recusas vêm depois do parágrafo, palavra por palavra, de `POLITICA.recusas` em",
    "       `src/data/politica-ia.mjs`: são a política, e a política diz-se onde está escrita. */",
  ],
};
const seccoes = [];
for (const s of d.seccoes.filter((x) => x.n >= 2)) {
  seccoes.push('  {');
  seccoes.push(`    id: '${IDS[s.n]}',`);
  seccoes.push(`    titulo: { pt: ${lit(s.titulo.pt)}, en: ${lit(s.titulo.en)} },`);
  seccoes.push('    paragrafos: [');
  for (const p of s.paragrafos) {
    seccoes.push('      {');
    if (p.id) seccoes.push(`        id: '${p.id}',`);
    for (const lingua of ['pt', 'en']) {
      seccoes.push(`        ${lingua}: [`);
      for (const x of pedacos(p[lingua])) seccoes.push(`          ${x},`);
      seccoes.push('        ],');
    }
    seccoes.push('      },');
  }
  seccoes.push('    ],');
  if (s.n === 8) seccoes.push(...NOTAS[8], "    depois: 'recusas',");
  if (NOTAS[s.n] && s.n !== 8) seccoes.push(...NOTAS[s.n]);
  seccoes.push('    ligacoes: [');
  for (const porta of s.portas) {
    const destino = DESTINOS[porta.pt];
    if (!destino) throw new Error(`porta sem destino: ${porta.pt}`);
    seccoes.push(`      { ${destino}, rotulo: { pt: ${lit(porta.pt)}, en: ${lit(porta.en)} } },`);
  }
  seccoes.push('    ],');
  seccoes.push('  },');
}

const cabeca = `/**
 * O MÉTODO · o texto que a página diz ao leitor (bloco ME1, 15.10.2026).
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU, E PORQUÊ
 * ---------------------------------------------------------------------------
 * Até 15.10.2026 eram dez regras, cada uma com o seu mecanismo, o seu limite e a
 * sua prova, com o desenho do mecanismo por cima delas e a política da
 * inteligência artificial perto do fim. O financiador leu a página como leitor a
 * 14.10.2026 e disse que ela explicava este projeto a si próprio, que nomeava
 * modelos onde não devia, e que o rótulo de todas as páginas levava ao meio dela
 * (o mandato \`design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md\`). A página
 * passa a ter nove secções em palavras correntes, pela ordem do mandato: quem
 * escreve estas páginas, que é o texto da política e vive em
 * \`src/data/politica-ia.mjs\`; as sete deste ficheiro (\`SECOES\`); e a forma
 * (\`FECHO\`), como estava. As frases são as do mandato, palavra por palavra, e a
 * entrada do \`DECISIONS.md\` que as governa carimba o resumo deste ficheiro.
 *
 * NENHUM PEDAÇO DE TEXTO CORRIDO PODE TRAZER ALGARISMOS. Os números que ficam são
 * números deste projeto sobre si próprio, e entram pelos tokens da prova
 * (\`{ prova: '<chave>' }\`), que o \`Frase\` rende pelo \`ValorDaProva\`, com a marca
 * \`data-prova\` e a porta da chave; o portão de HTML reconta cada um.
 *
 * ---------------------------------------------------------------------------
 * PEDAÇOS DE TEXTO · o mesmo sistema de sempre (ver src/components/Frase.astro)
 * ---------------------------------------------------------------------------
 *   'palavras'                     texto corrido
 *   { prova: '<chave>' }           um número deste projeto, de src/lib/prova.mjs
 *   { marcador: '…', gloss: '…' }  o marcador, em chip visível
 *   { email: '…' }                 endereço de correio, como ligação
 *
 * ---------------------------------------------------------------------------
 * A FORMA DE UMA SECÇÃO
 * ---------------------------------------------------------------------------
 *   id           a âncora da secção no endereço da página; as antigas ficam
 *   titulo       o nome da secção: o \`<h2>\` e a entrada do sumário
 *   paragrafos   os parágrafos, cada um nas duas edições; um \`id\` num parágrafo
 *                é uma âncora antiga que passou a viver nele (\`selo\`, \`construcao\`)
 *   depois       o que vem a seguir aos parágrafos (\`recusas\`: as cinco recusas
 *                da política, de \`src/data/politica-ia.mjs\`)
 *   ligacoes     as portas da secção, no fim, com a seta
 */
`;
const abertura = [
  '/**',
  ' * A linha de abertura do Método, por baixo do título. O Sobre não a usa: a porta',
  ' * dele para o Método diz o título da primeira secção (`POLITICA.titulo`).',
  ' */',
  'export const ABERTURA = {',
  `  pt: ${lit(d.abertura.pt)},`,
  `  en: ${lit(d.abertura.en)},`,
  '};',
];
const texto = [
  cabeca,
  ...endereco, '',
  ...abertura, '',
  ...fecho, '',
  ...marcadores, '',
  '/** As secções 2 a 8, pela ordem da página; a primeira é a da política e a nona é o `FECHO`. */',
  'export const SECOES = [',
  ...seccoes,
  '];',
  '',
].join('\n');
fs.writeFileSync(saida, texto);
console.log('escrito', saida, texto.split('\n').length, 'linhas');
