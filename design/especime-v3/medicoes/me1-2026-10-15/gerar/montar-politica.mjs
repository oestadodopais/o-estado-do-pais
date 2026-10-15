// Monta o src/data/politica-ia.mjs novo a partir do de hoje: os blocos que ficam lidos por linha e
// conferidos, as cinco recusas copiadas byte a byte, e a primeira secção do Método gerada do mandato.
// uso: node montar-politica.mjs <politica-ia.mjs de hoje> <seccao1.json> <saída>
import fs from 'node:fs';
const [atual, seccao1, saida] = process.argv.slice(2);
const L = fs.readFileSync(atual, 'utf8').split('\n');
const linhas = (a, b) => L.slice(a - 1, b);
const S1 = JSON.parse(fs.readFileSync(seccao1, 'utf8'));
const lit = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);

/* 1 a 60: o cabeçalho, até ao parágrafo dos algarismos, que muda. */
const cabeca = linhas(1, 60);
if (!cabeca[2].includes('A POLÍTICA DA CASA SOBRE A IA') || L[60] !== ' * NENHUM ALGARISMO NESTE FICHEIRO SEM ORIGEM DECLARADA. As três cadeias que') throw new Error('o cabeçalho mudou de lugar');
const algarismos = [
  ' * NENHUMA CADEIA QUE A PÁGINA RENDE TRAZ ALGARISMOS. A primeira passagem de',
  ' * 01.09.2026 escrevia aqui os nomes dos modelos com a versão; a segunda tirou as',
  ' * versões, e o bloco ME1 (15.10.2026) tirou os nomes: a página diz os papéis e a',
  ' * regra das famílias, e os sistemas de cada papel leem-se no documento público',
  ' * da política, para onde a primeira secção do Método liga.',
  ' */',
  '',
  "import { routePath } from '../lib/routes.mjs';",
];
if (L[64] !== ' */') throw new Error('o fim do cabeçalho mudou de lugar');
/* 66 a 71: a nota do RH1-b, que fica. */
const rh1 = linhas(66, 71);
if (!rh1[1].startsWith('/** RH1-b, 14.10.2026')) throw new Error('a nota do RH1-b mudou de lugar');
if (L[71] !== '/** A âncora da secção da política, dentro do Método. */' || L[72] !== "export const ANCORA_DA_POLITICA = 'politica-de-ia';") throw new Error('a âncora mudou de lugar');
const ancora = [
  '/**',
  ' * A PORTA DA POLÍTICA (bloco ME1, 15.10.2026).',
  ' *',
  ' * O rótulo de todas as páginas, a faixa dos documentos alojados e o Sobre abrem',
  ' * o Método pelo princípio, onde a secção de quem escreve estas páginas passou a',
  ' * ser a primeira: a âncora fica vazia, e a porta compõe-se numa função só,',
  ' * `portaDaPolitica()`, que é a rota do Método e mais nada enquanto a âncora for',
  ' * vazia. O oráculo do portão (`scripts/textos-aprovados.json`) guarda a mesma',
  ' * âncora, e o `gate:html` compõe o destino por conta própria com a mesma regra.',
  ' */',
  "export const ANCORA_DA_POLITICA = '';",
  '',
  '/**',
  ' * O `id` da primeira secção do Método, que fica para as ligações antigas: o',
  ' * rótulo levou o leitor a `/metodo#politica-de-ia` de 01.09 a 15.10.2026, e um',
  ' * endereço que esteve no ar continua a abrir a mesma secção.',
  ' */',
  "export const ID_DA_SECCAO_DA_POLITICA = 'politica-de-ia';",
  '',
  '/**',
  ' * O documento público da política deste projeto, onde os sistemas de cada papel',
  ' * e as suas trocas ficam escritos com a data. É a única ligação para fora do',
  ' * Método, e a mesma nas duas edições (o documento é um só).',
  ' */',
  "export const DOCUMENTO_DA_POLITICA =",
  "  'https://github.com/oestadodopais/o-estado-do-pais/blob/main/design/observatorio/POLITICA-DA-AUTONOMIA.md';",
  '',
  '/**',
  ' * A porta da política na língua de uma edição: a rota do Método, e `#` com a',
  ' * âncora só quando a âncora não for vazia.',
  ' * @param {string} lang',
  ' */',
  'export function portaDaPolitica(lang) {',
  "  const rota = routePath('metodo', /** @type {'pt'|'en'} */ (lang));",
  '  return ANCORA_DA_POLITICA ? `${rota}#${ANCORA_DA_POLITICA}` : rota;',
  '}',
];
/* 74 a 275: do esquema ao contacto, que ficam. */
const meio = linhas(74, 275);
if (meio[1] !== '/**' && meio[0] !== '') throw new Error('o meio mudou de lugar');
if (!L[275].startsWith('/**') || L[277] !== ' * A SECÇÃO DA POLÍTICA, EM `/metodo`') throw new Error('a secção da política mudou de lugar');
/* As recusas, byte a byte, sem o título que a página deixou de render. */
const inicioRecusas = L.indexOf('  /** As cinco recusas, escritas antes de precisarem delas. */');
if (L[inicioRecusas + 1] !== '  recusas: {' || L[inicioRecusas + 2] !== "    titulo: { pt: 'As recusas', en: 'The refusals' },") throw new Error('as recusas mudaram de lugar');
const fimRecusas = L.indexOf('  },', inicioRecusas);
const recusas = [L[inicioRecusas], L[inicioRecusas + 1], ...L.slice(inicioRecusas + 3, fimRecusas + 1)];
if (L[fimRecusas + 1] !== '};') throw new Error('o fim da política mudou de lugar');

const politica = [
  '/**',
  ' * ---------------------------------------------------------------------------',
  ' * A PRIMEIRA SECÇÃO DO MÉTODO · quem escreve estas páginas (bloco ME1, 15.10.2026)',
  ' * ---------------------------------------------------------------------------',
  ' * Até 15.10.2026 era a secção «Como a inteligência artificial escreve este sítio»,',
  ' * a dois terços do Método, com a via, a lista dos três papéis, os dois casos do que',
  ' * se publica e as recusas, e uma frase com os nomes das famílias de modelos e das',
  ' * empresas. O mandato do bloco ME1 passa-a para o princípio da página e reescreve-a',
  ' * em quatro parágrafos: a frase da política (`FRASE`, que o oráculo guarda), os',
  ' * papéis, a regra das famílias com a porta para o documento público da política,',
  ' * e o que se publica só pelas verificações automáticas. Os nomes dos modelos e das',
  ' * empresas saem da página: ficam na `POLITICA-DA-AUTONOMIA.md` §5 e no',
  ' * `DECISIONS.md`. As frases são as do mandato, palavra por palavra, e a cópia do',
  ' * lado do portão (`scripts/lugares-ia-do-portao.mjs`) confere os papéis e as',
  ' * famílias contra a redação decidida; as duas mudam no mesmo commit.',
  ' *',
  ' * As cinco recusas são as da política, ditas com as palavras dela, e rendem-se',
  ' * na secção do que este projeto não faz.',
  ' */',
  'export const POLITICA = {',
  "  titulo: { pt: 'Quem escreve estas páginas', en: 'Who writes these pages' },",
  '',
  '  /** Os três papéis, e o que cada um faz. */',
  '  papeis: {',
  `    pt: ${lit(S1.papeis.pt)},`,
  `    en: ${lit(S1.papeis.en)},`,
  '  },',
  '',
  '  /** A regra das famílias, com a porta para o documento público da política. */',
  '  familias: {',
  ...['pt', 'en'].map((l) => `    ${l}: { antes: ${lit(S1.familias[l].antes)}, ligacao: ${lit(S1.familias[l].ligacao)}, depois: ${lit(S1.familias[l].depois)} },`),
  '  },',
  '',
  '  /** O que se publica só pelas verificações automáticas, e o que espera a decisão da direção. */',
  '  publicacao: {',
  `    pt: ${lit(S1.publicacao.pt)},`,
  `    en: ${lit(S1.publicacao.en)},`,
  '  },',
  '',
  ...recusas,
  '};',
  '',
];
const texto = [...cabeca, ...algarismos, ...rh1, ...ancora, '', ...meio, ...politica].join('\n');
fs.writeFileSync(saida, texto);
console.log('escrito', saida, texto.split('\n').length, 'linhas');
