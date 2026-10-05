/**
 * AS LINHAS DE SÉRIE, LIDAS PELOS PORTÕES (bloco UE1, 29.09.2026).
 *
 * O leitor próprio dos portões para `ledger/series/*.yml` e para a tabela dos
 * nomes dos países, e a recontagem do que a faixa da União mostra. NÃO importa
 * `src/lib/series.mjs` nem o resolvedor da faixa (`src/lib/faixa-da-uniao.mjs`):
 * «uma conferência que usasse o código das páginas confirmava-se a si própria»
 * (`scripts/check-regioes.mjs`). Quem o chama: o portão de HTML (as origens
 * `data-ponto`, `data-pais`, `data-serie-campo`, `data-ponto-conta`,
 * `data-ponto-lugar`), o `check:formas` (F1 das datas de uma série, F19 a faixa)
 * e a célula da faixa do `check:cartao`.
 *
 * AS REGRAS DA CONTA, escritas aqui e só aqui do lado dos portões:
 *   · os países são os pontos que não são a União (`EU27_2020`);
 *   · o lugar de Portugal é 1 mais o número de países com valor maior (o §3,
 *     ponto 5, do brief UE1), e os países com o mesmo valor ficam «a par»;
 *   · o mais baixo e o mais alto são os países com o menor e o maior valor, e
 *     um empate num dos extremos nomeia os dois, pela ordem da série;
 *   · a posição de uma marca na faixa é (valor − mínimo) ÷ (máximo − mínimo),
 *     escrita em percentagem com quatro casas, como o desenho a escreve;
 *   · o sufixo do ordinal inglês de um lugar (a passagem UE1b, o acerto F4) é o
 *     de `ORDINAIS_INGLESES`, escritos um a um e não calculados: a regra dos
 *     portões (`sufixoOrdinalDoPortao`) escolhe entre as palavras declaradas, e
 *     a F19 e a K18 conferem a escolha contra esta tabela para os 27 lugares;
 *   · (a passagem de higiene H3, 05.10.2026) os países com o mesmo valor
 *     afastam-se na vertical: pela ordem da série, de cima para baixo, os
 *     centros distribuem-se por igual de seis píxeis acima a seis abaixo do
 *     eixo, e um país sozinho fica no eixo (`alturaNaFaixaDoPortao`); e a
 *     etiqueta de uma marca diz os pontos com o valor dela, pela ordem da série,
 *     cada um com a ressalva do seu ponto, e o valor uma vez, no fim
 *     (`etiquetaDaMarcaDoPortao`). As duas escritas aqui de novo, e não
 *     importadas do resolvedor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const AGREGADO = 'EU27_2020';

/** As séries, pelo id, lidas do disco por este leitor. */
export function lerSeriesDoPortao(raiz = RAIZ) {
  const dir = path.join(raiz, 'ledger', 'series');
  const out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yml')).sort()) {
    const s = load(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (s && typeof s.id === 'string') out.set(s.id, s);
  }
  return out;
}

/** A tabela dos nomes, pelo código do Eurostat. */
export function lerPaisesDoPortao(raiz = RAIZ) {
  const doc = JSON.parse(fs.readFileSync(path.join(raiz, 'src', 'data', 'paises-da-uniao.json'), 'utf8'));
  return new Map((doc.paises ?? []).map((p) => [p.geo, p]));
}

/**
 * O número de uma cadeia da casa, pela conta dos portões: o menos tipográfico e
 * o hífen são o mesmo sinal, os espaços entre algarismos são o separador dos
 * milhares, a vírgula é a decimal. `null` quando não é um número simples.
 */
export function numeroDoPortao(v) {
  if (typeof v !== 'string') return null;
  const s = v.trim().replace(/−/g, '-').replace(/(?<=\d)[    ](?=\d)/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

/** A posição de um valor na faixa, em percentagem, na forma que o desenho escreve. */
export function posicaoNaFaixa(v, min, max) {
  if (!(max > min)) throw new Error('a faixa não tem largura: o mais alto e o mais baixo são o mesmo valor');
  const f = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return Number((f * 100).toFixed(4));
}

/**
 * O que a faixa de uma série tem de mostrar, recontado dos pontos.
 *
 * @returns {{ conta: number, periodo: string, baixo: string[], alto: string[],
 *   min: number, max: number, uniao: number, portugal: number, lugar: number,
 *   aPar: string[], paises: { geo: string, n: number }[] }}
 */
export function contaDaFaixa(serie) {
  const pontos = Array.isArray(serie?.pontos) ? serie.pontos : [];
  const paises = pontos
    .filter((p) => p.geo !== AGREGADO)
    .map((p) => ({ geo: String(p.geo), n: numeroDoPortao(p.valor) }));
  if (paises.some((p) => p.n === null)) throw new Error(`série ${serie?.id}: um valor que não é um número da casa`);
  const ue = pontos.find((p) => p.geo === AGREGADO);
  const pt = paises.find((p) => p.geo === 'PT');
  if (!ue || !pt) throw new Error(`série ${serie?.id}: falta o ponto da União ou o de Portugal`);
  const min = Math.min(...paises.map((p) => p.n));
  const max = Math.max(...paises.map((p) => p.n));
  return {
    conta: paises.length,
    periodo: String(serie.periodo),
    baixo: paises.filter((p) => p.n === min).map((p) => p.geo),
    alto: paises.filter((p) => p.n === max).map((p) => p.geo),
    min,
    max,
    uniao: /** @type {number} */ (numeroDoPortao(ue.valor)),
    portugal: pt.n,
    lugar: 1 + paises.filter((p) => p.n > pt.n).length,
    aPar: paises.filter((p) => p.geo !== 'PT' && p.n === pt.n).map((p) => p.geo),
    paises,
  };
}

/**
 * OS 27 ORDINAIS INGLESES, escritos à mão e um a um, de propósito: são a
 * resposta conhecida contra a qual a regra se confere, e uma tabela calculada
 * pela mesma regra confirmava-se a si própria. São 27 porque a União tem 27
 * países e o lugar de Portugal vai de 1 a 27.
 */
export const ORDINAIS_INGLESES = Object.freeze([
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
  '21st', '22nd', '23rd', '24th', '25th', '26th', '27th',
]);

/**
 * O sufixo do ordinal inglês de um lugar, pela regra dos portões: `st`, `nd` e
 * `rd` para os números acabados em 1, 2 e 3, `th` para os outros e para os
 * acabados em 11, 12 e 13. Escolhe entre as palavras declaradas e não as
 * escreve.
 *
 * @param {number} n
 * @param {{ st: string, nd: string, rd: string, th: string }} sufixos
 */
export function sufixoOrdinalDoPortao(n, sufixos) {
  if (!Number.isInteger(n) || n < 1) throw new Error(`o lugar ${n} não é um inteiro positivo`);
  if (!sufixos) throw new Error('a língua não declara os sufixos do ordinal');
  if ([11, 12, 13].includes(n % 100)) return sufixos.th;
  if (n % 10 === 1) return sufixos.st;
  if (n % 10 === 2) return sufixos.nd;
  if (n % 10 === 3) return sufixos.rd;
  return sufixos.th;
}

/** O desvio máximo, em píxeis, acima e abaixo do eixo, dos países com o mesmo valor (H3), escrito aqui de novo. */
export const DESVIO_MAXIMO_DO_PORTAO = 6;

/**
 * A ALTURA DE UMA MARCA DE PAÍS NA FAIXA, pela regra dos portões (H3): o desvio, em píxeis a partir do eixo
 * (negativo para cima), do país dentro do grupo dos países da série com o mesmo valor, contados pela ordem da série.
 * A média da União fica no eixo. Devolve também quantos países tem o grupo.
 * @returns {{ altura: number, noGrupo: number }}
 */
export function alturaNaFaixaDoPortao(serie, geo) {
  if (geo === AGREGADO) return { altura: 0, noGrupo: 1 };
  const { paises } = contaDaFaixa(serie);
  const eu = paises.find((p) => p.geo === geo);
  if (!eu) throw new Error(`série ${serie?.id}: não há o país ${geo}`);
  const grupo = paises.filter((p) => p.n === eu.n);
  const n = grupo.length;
  const i = grupo.findIndex((p) => p.geo === geo);
  if (n <= 1) return { altura: 0, noGrupo: 1 };
  const d = DESVIO_MAXIMO_DO_PORTAO;
  return { altura: Number((-d + (2 * d * i) / (n - 1)).toFixed(2)) || 0, noGrupo: n };
}

/**
 * A ETIQUETA DE UMA MARCA, pela conta dos portões (H3): os pontos da série com o valor da marca, pela ordem da série
 * (os países e, no fim, a União), cada um com o nome da tabela na língua da página (ou as palavras da União) e a
 * ressalva do seu ponto pelas palavras declaradas, com as palavras da lista entre eles, e o valor do primeiro ponto,
 * uma vez, no fim, com os espaços finos dos milhares trocados por um espaço, como o desenho o escreve.
 * @param {any} serie @param {string} geo @param {'pt'|'en'} lang @param {Map<string, any>} paises
 * @param {{ lista: { entre: string, ultimo: string }, uniao: string, ressalvas: Record<string, string> }} palavras
 */
export function etiquetaDaMarcaDoPortao(serie, geo, lang, paises, palavras) {
  const pontos = Array.isArray(serie?.pontos) ? serie.pontos : [];
  const alvo = pontos.find((p) => p.geo === geo);
  if (!alvo) throw new Error(`série ${serie?.id}: não há o ponto ${geo}`);
  const n = numeroDoPortao(alvo.valor);
  const daSerie = [...pontos.filter((p) => p.geo !== AGREGADO), ...pontos.filter((p) => p.geo === AGREGADO)];
  const grupo = daSerie.filter((p) => numeroDoPortao(p.valor) === n);
  const nomes = grupo
    .map((p, i) => {
      const entre = i === 0 ? '' : i === grupo.length - 1 ? palavras.lista.ultimo : palavras.lista.entre;
      const pais = paises.get(p.geo);
      const nome = p.geo === AGREGADO ? palavras.uniao : pais ? (lang === 'en' ? pais.en : pais.pt) : `(${p.geo} sem nome)`;
      const ressalva = p.bandeira ? palavras.ressalvas?.[String(p.bandeira)] : null;
      return `${entre}${nome}${ressalva ? ` (${ressalva})` : ''}`;
    })
    .join('');
  const valor = String(grupo[0].valor).replace(/(?<=\d)[\u00a0\u2009\u202f](?=\d)/g, ' ');
  return `${nomes} ${valor}`;
}

/** A série de países de uma linha portuguesa, pelo campo da série. */
export function serieDaLinhaDoPortao(series, idDaLinha) {
  const achadas = [...series.values()].filter((s) => s.linha_de_portugal === idDaLinha && s.eixo === 'pais');
  return achadas.length === 1 ? achadas[0] : null;
}
