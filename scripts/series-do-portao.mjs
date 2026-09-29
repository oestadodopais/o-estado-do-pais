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
 *     escrita em percentagem com quatro casas, como o desenho a escreve.
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

/** A série de países de uma linha portuguesa, pelo campo da série. */
export function serieDaLinhaDoPortao(series, idDaLinha) {
  const achadas = [...series.values()].filter((s) => s.linha_de_portugal === idDaLinha && s.eixo === 'pais');
  return achadas.length === 1 ? achadas[0] : null;
}
