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
 *   · a sua própria autoridade para a direção de cada medida com faixa e para as contagens sem faixa
 *     (`DIRECOES_DO_PORTAO` e `CONTAGENS_DO_PORTAO`, abaixo), escrita aqui com a razão, desde a passagem L2b-c.
 *     A tabela da vista (`src/data/faixa-do-concelho.mjs`) tem de a bater (`conferirTabelaDaVista`): até à
 *     L2b-c o portão lia a direção da mesma tabela que a vista usa, e uma direção trocada lá passava coerente
 *     nas duas pontas (o achado 4 da leitura a frio do L2b).
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

/**
 * A AUTORIDADE DO PORTÃO PARA A DIREÇÃO (a passagem L2b-c, 01.10.2026, o achado 4 da leitura a frio). As quatro
 * medidas com faixa e de que ponta se conta o lugar de cada uma, escritas aqui, à parte da tabela da vista, com
 * a razão. O portão conta os lugares por esta, e não pela da vista; e a da vista tem de dizer o mesmo, medida a
 * medida, ou a construção fecha. Mudar a direção de uma medida é mudar as duas, de propósito: uma só não chega.
 */
export const DIRECOES_DO_PORTAO = Object.freeze({
  indice: { ordem: 'do-mais-baixo', porque: 'um índice maior é uma dívida mais perto do limite legal, ou acima dele' },
  pmp: { ordem: 'do-mais-baixo', porque: 'mais dias é pagar mais tarde aos fornecedores' },
  ganho: { ordem: 'do-mais-alto', porque: 'um ganho maior é mais dinheiro por mês para quem trabalha' },
  poderDeCompra: { ordem: 'do-mais-alto', porque: 'um índice maior é mais poder de compra por pessoa face à média do país' },
});

/** As contagens, que não têm faixa porque uma contagem não se ordena (§1.143, decisão 4). */
export const CONTAGENS_DO_PORTAO = Object.freeze({
  populacao: 'uma contagem de pessoas',
  desempregoRegistado: 'uma contagem de pessoas inscritas',
  empresas: 'uma contagem de empresas',
  divida: 'um total em euros, que cresce com o tamanho da câmara',
});

/**
 * A tabela da vista contra a autoridade do portão: as mesmas medidas com faixa, a mesma ordem em cada uma, e as
 * mesmas contagens sem faixa. Devolve as discordâncias, uma por linha; vazia, as duas dizem o mesmo.
 *
 * @param {Record<string, { faixa?: boolean, ordem?: string | null }>} [tabela]
 */
export function conferirTabelaDaVista(tabela = FAIXA_DAS_MEDIDAS_DO_CONCELHO) {
  const erros = [];
  for (const [chave, d] of Object.entries(DIRECOES_DO_PORTAO)) {
    const v = tabela[chave];
    if (!v) erros.push(`a tabela da vista não tem a medida «${chave}», que o portão conta com faixa`);
    else if (!v.faixa) erros.push(`a tabela da vista tira a faixa a «${chave}», que o portão conta com faixa (${d.porque})`);
    else if (v.ordem !== d.ordem) erros.push(`a tabela da vista conta «${chave}» ${v.ordem ?? 'sem ordem'} e o portão ${d.ordem} (${d.porque})`);
  }
  for (const [chave, porque] of Object.entries(CONTAGENS_DO_PORTAO)) {
    const v = tabela[chave];
    if (!v) erros.push(`a tabela da vista não tem a contagem «${chave}»`);
    else if (v.faixa) erros.push(`a tabela da vista dá faixa a «${chave}», que é ${porque}, e uma contagem não se ordena (§1.143, decisão 4)`);
  }
  for (const chave of Object.keys(tabela)) {
    if (!(chave in DIRECOES_DO_PORTAO) && !(chave in CONTAGENS_DO_PORTAO)) erros.push(`a tabela da vista tem a medida «${chave}», que o portão não conhece`);
  }
  return erros;
}

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
  for (const chave of [...Object.keys(DIRECOES_DO_PORTAO), ...Object.keys(CONTAGENS_DO_PORTAO)]) {
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
export function contaDaMedidaDoPortao(linhas, porSlug, chave, direcoes = DIRECOES_DO_PORTAO) {
  /* A ORDEM É A DO PORTÃO (L2b-c), e não a da tabela da vista. */
  const ordem = direcoes[chave]?.ordem;
  if (!ordem) throw new Error(`a medida «${chave}» não tem direção na autoridade do portão`);
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

/**
 * Tudo o que os portões precisam, lido uma vez: as linhas, os concelhos e a conta de cada medida COM FAIXA.
 *
 * UMA CONTAGEM NÃO TEM CONTA (a passagem L2b-b, 01.10.2026, pela §1.143, decisão 4): a tabela declara sem faixa
 * as quatro contagens, e para elas não há lugar, contagem nem empates a recontar. Uma marca de lugar numa
 * contagem fecha a construção no portão de HTML, com a razão, e não passa por ter uma conta a que bater.
 */
export function faixasDoPortao(raiz = RAIZ) {
  const linhas = lerLinhasDoPortao(raiz);
  const concelhos = lerConcelhosDoPortao(raiz);
  const porMedida = linhasDasMedidasDoPortao(linhas, concelhos);
  const contas = new Map();
  for (const [chave, porSlug] of porMedida) {
    if (porSlug.size && chave in DIRECOES_DO_PORTAO) contas.set(chave, contaDaMedidaDoPortao(linhas, porSlug, chave));
  }
  return { linhas, concelhos, porMedida, contas };
}

/** As contagens, pela autoridade do portão, para ele dizer porque recusa um lugar numa delas. */
export const MEDIDAS_SEM_FAIXA = new Set(Object.keys(CONTAGENS_DO_PORTAO));
