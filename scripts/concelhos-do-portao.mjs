/**
 * AS 308 LINHAS DE CADA MEDIDA DE CONCELHO, LIDAS PELOS PORTÕES (bloco L2b, 01.10.2026).
 *
 * O leitor próprio dos portões para a faixa do concelho, e a recontagem do que ela mostra: o lugar do
 * concelho entre os que têm valor, a contagem deles, os empates e a linha de Portugal com que se compara.
 * NÃO importa o resolvedor da faixa (`src/lib/faixa-do-concelho.mjs`), nem `linhasPorConcelho()`, nem
 * `src/data/concelhos.mjs`: «uma conferência que usasse o código das páginas confirmava-se a si própria»
 * (`scripts/check-regioes.mjs`). É o lado dos concelhos de `scripts/series-do-portao.mjs`, que faz o
 * mesmo para a faixa da União. Lê três coisas, nenhuma delas código de página:
 *
 *   · o ficheiro do motor (`src/data/concelhos.gerado.json`): o slug, o código do INE (o DICO) e a linha
 *     de cada medida em cada concelho;
 *   · as linhas do livro-razão (`ledger/claims/*.yml`), lidas aqui: as do ganho médio, que o ficheiro do
 *     motor não traz, ligam-se ao concelho pelo código geográfico do INE que o localizador de cada uma
 *     escreve, e não pelo nome do ficheiro;
 *   · a tabela declarada das ordens e das comparações (`src/data/faixa-do-concelho.mjs`), que é uma
 *     declaração e não uma conta.
 *
 * Quem o chama: o portão de HTML (as origens `data-concelho-lugar`, `data-concelho-conta`,
 * `data-concelho-a-par`, e a linha de Portugal dentro da faixa de um cartão) e a célula da faixa do
 * concelho (`tests/municipio/faixa-do-concelho.mjs`, no `check:navegacao`).
 *
 * AS REGRAS DA CONTA, escritas aqui e só aqui do lado dos portões:
 *   · um concelho tem valor quando a sua linha é um número da casa; uma marca da fonte sem algarismos
 *     («N.d.») não tem valor; um valor com algarismos que não se lê como número é um erro;
 *   · na ordem «do-mais-alto», o lugar é 1 mais o número de concelhos com valor maior; na ordem
 *     «do-mais-baixo», 1 mais o número de concelhos com valor menor;
 *   · os empates de um concelho são os outros concelhos com o mesmo valor;
 *   · a posição de uma marca é (valor − mínimo) ÷ (máximo − mínimo), em percentagem com quatro casas;
 *   · a linha de Portugal de uma linha de concelho é a linha do livro-razão, fora dos 308, com a mesma
 *     edição do documento, a mesma unidade e o mesmo período, cujo localizador nomeia Portugal; a base de
 *     um índice é o número que a unidade da linha escreve em «(Portugal = …)».
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { numeroDoPortao, posicaoNaFaixa } from './series-do-portao.mjs';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../src/data/faixa-do-concelho.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** As linhas do livro-razão, pelo id, lidas do disco por este leitor. */
export function lerLinhasDoPortao(raiz = RAIZ) {
  const dir = path.join(raiz, 'ledger', 'claims');
  const out = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yml')).sort()) {
    const l = load(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (l && typeof l.id === 'string') out.set(l.id, l);
  }
  return out;
}

/** O ficheiro do motor, ou o que `CONCELHOS_GERADO` nomear (as réguas dos 308 constroem com outro). */
export function lerConcelhosDoPortao(raiz = RAIZ) {
  const caminho = process.env.CONCELHOS_GERADO ?? path.join(raiz, 'src', 'data', 'concelhos.gerado.json');
  return fs.existsSync(caminho) ? JSON.parse(fs.readFileSync(caminho, 'utf8')) : [];
}

/** O localizador das linhas do ganho médio de um concelho: o indicador do INE e o código geográfico. */
const LOCALIZADOR_DO_GANHO = /^INE, indicador 0012656, .+ \(código (\w*?(\d{4}))\), dados de \d{4}$/;

/**
 * As linhas de cada medida, por concelho: `Map<chave, Map<slug, id>>`. Para o ganho, a linha de cada
 * concelho é a do localizador cujo código geográfico acaba no DICO dele.
 */
export function linhasDasMedidasDoPortao(linhas, concelhos) {
  const porDico = new Map();
  for (const [id, l] of linhas) {
    const m = LOCALIZADOR_DO_GANHO.exec(String(l?.document?.locator ?? ''));
    if (m) porDico.set(m[2], id);
  }
  const out = new Map();
  for (const chave of Object.keys(FAIXA_DAS_MEDIDAS_DO_CONCELHO)) {
    const porSlug = new Map();
    for (const c of concelhos) {
      const id = chave === 'ganho' ? porDico.get(String(c.dico)) : c.linhas?.[chave];
      if (typeof id === 'string' && linhas.has(id)) porSlug.set(c.slug, id);
    }
    out.set(chave, porSlug);
  }
  return out;
}

/** O valor de uma linha: um número, `null` para uma marca da fonte sem algarismos, e erro no resto. */
export function valorDoPortao(linha) {
  const n = numeroDoPortao(typeof linha?.value === 'string' ? linha.value : String(linha?.value ?? ''));
  if (n !== null) return n;
  if (/\d/.test(String(linha?.value ?? ''))) throw new Error(`a linha «${linha?.id}» tem algarismos que não se leem como um número da casa`);
  return null;
}

/** O período de uma linha: o seu, ou o comum das linhas de que é calculada. */
export function periodoDoPortao(linhas, id, vistos = new Set()) {
  const l = linhas.get(id);
  if (!l || vistos.has(id)) return null;
  if (typeof l.reference_date === 'string' && l.reference_date) return l.reference_date;
  const ps = [...new Set((l.derived_from ?? []).map((o) => periodoDoPortao(linhas, String(o), new Set([...vistos, id]))).filter(Boolean))];
  return ps.length === 1 ? ps[0] : null;
}

/** A linha de Portugal de uma linha de concelho, pela regra do cabeçalho, ou `null`. */
export function linhaDePortugalDoPortao(linhas, idDoConcelho, idsDaMedida) {
  const c = linhas.get(idDoConcelho);
  if (!c) return null;
  const periodo = periodoDoPortao(linhas, idDoConcelho);
  const achadas = [];
  for (const [id, l] of linhas) {
    if (idsDaMedida.has(id)) continue;
    if (!l?.document?.edition || l.document.edition !== c.document?.edition) continue;
    if (l.unit !== c.unit || periodoDoPortao(linhas, id) !== periodo) continue;
    if (!/\bPortugal\b/.test(String(l.document?.locator ?? ''))) continue;
    achadas.push(id);
  }
  return achadas.length === 1 ? achadas[0] : null;
}

/** A base de um índice que a unidade de uma linha escreve, ou `null`. */
export function baseDoPortao(linha) {
  const m = /\(Portugal = (\d+(?:,\d+)?)\)/.exec(String(linha?.unit ?? ''));
  return m ? numeroDoPortao(m[1]) : null;
}

/**
 * A conta de uma medida, recontada das linhas: os concelhos com valor e sem valor, o mínimo e o máximo,
 * e, para cada concelho, o lugar e os empates.
 */
export function contaDaMedidaDoPortao(linhas, porSlug, chave) {
  const ordem = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave]?.ordem;
  if (!ordem) throw new Error(`a medida «${chave}» não está na tabela das ordens`);
  const todos = [...porSlug].map(([slug, id]) => ({ slug, id, n: valorDoPortao(linhas.get(id)) }));
  const comValor = todos.filter((c) => c.n !== null);
  const min = Math.min(...comValor.map((c) => c.n));
  const max = Math.max(...comValor.map((c) => c.n));
  const lugar = (slug) => {
    const c = comValor.find((x) => x.slug === slug);
    if (!c) return null;
    return 1 + comValor.filter((x) => (ordem === 'do-mais-baixo' ? x.n < c.n : x.n > c.n)).length;
  };
  const aPar = (slug) => {
    const c = comValor.find((x) => x.slug === slug);
    return c ? comValor.filter((x) => x.slug !== slug && x.n === c.n).length : 0;
  };
  return {
    chave,
    ordem,
    conta: comValor.length,
    total: todos.length,
    todos,
    min,
    max,
    lugar,
    aPar,
    posicao: (n) => posicaoNaFaixa(n, min, max),
    ids: new Set(porSlug.values()),
  };
}

/** Tudo o que os portões precisam, lido uma vez: as linhas, os concelhos e a conta de cada medida. */
export function faixasDoPortao(raiz = RAIZ) {
  const linhas = lerLinhasDoPortao(raiz);
  const concelhos = lerConcelhosDoPortao(raiz);
  const porMedida = linhasDasMedidasDoPortao(linhas, concelhos);
  const contas = new Map();
  for (const [chave, porSlug] of porMedida) {
    if (porSlug.size) contas.set(chave, contaDaMedidaDoPortao(linhas, porSlug, chave));
  }
  return { linhas, concelhos, porMedida, contas };
}
