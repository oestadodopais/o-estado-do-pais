/**
 * A DATA EM QUE UMA EDIÇÃO ENTROU NESTE REPOSITÓRIO
 * =============================================================================
 *
 * Bloco F1.4b (04.09.2026), correção urgente da segunda passagem do F1.4.
 *
 * ---------------------------------------------------------------------------
 * O QUE A CASA SABE, E PODE PROVAR
 * ---------------------------------------------------------------------------
 * `src/data/studies.mjs` escreve, no seu próprio cabeçalho: «DATAS: nenhuma data
 * de publicação está confirmada. Ficam todas por verificar.» Treze das dezasseis
 * edições levam `date: null`.
 *
 * O QUE A CASA PODE PROVAR é outra coisa: **o dia em que o ficheiro da edição
 * entrou neste repositório**. Não é a data em que o trabalho foi publicado
 * noutro sítio, nem a data em que foi escrito. É a data em que ficou público
 * aqui, e é um facto com uma origem verificável por quem quer que tenha o
 * repositório: o commit que acrescentou `studies-src/<slug>/<lang>.html`.
 *
 * É POR ISSO QUE A ORIGEM VAI DITA. A página não escreve «Publicação: …» sobre
 * uma data de repositório: escreve «publicado a …» com a marca
 * `data-nonledger="data-do-repositorio"`, cujo motivo em `ledger/allowlist.yml`
 * diz de onde ela vem.
 *
 * ---------------------------------------------------------------------------
 * PORQUE É QUE ISTO JÁ NÃO CHAMA O `git` (F1.4b, o defeito que esteve no ar)
 * ---------------------------------------------------------------------------
 * A primeira escrita corria, A CADA CONSTRUÇÃO,
 *
 *     git log --diff-filter=A --format=%ad --date=short -- <ficheiro>
 *
 * A CI da casa pede `fetch-depth: 0` e via a história inteira; a Vercel constrói
 * a produção de uma cópia RASA, com cerca de dez commits. Numa cópia rasa o
 * commit de agosto que acrescentou uma edição NÃO EXISTE, e o `git` respondeu
 * com o commit mais antigo que a cópia tinha: as dezasseis edições ficaram com a
 * data do dia da construção. O sítio publicado dizia «PUBLICADO A 04.09.2026»
 * nos doze trabalhos. **Uma data errada numa página pública é a coisa que esta
 * casa não pode fazer**, e a falha nem sequer foi ruidosa: o comando respondeu,
 * respondeu depressa, e respondeu outra coisa.
 *
 * UM FACTO DO REPOSITÓRIO MEDE-SE UMA VEZ, ONDE A HISTÓRIA ESTÁ, E VIAJA
 * ESCRITO. `scripts/datas-de-publicacao.mjs` mede-o numa árvore completa (e
 * recusa-se a correr numa rasa), escreve `src/data/datas-de-publicacao.json` com
 * o slug, a língua, a data, o commit e o caminho de cada edição, e esse ficheiro
 * entra no commit. Este módulo LÊ o ficheiro. Nunca chama o `git`, e por isso
 * dá a mesma resposta na CI, na Vercel e na máquina de quem constrói.
 *
 * UMA EDIÇÃO QUE NÃO ESTEJA NO FICHEIRO NÃO TEM DATA, e não se inventa nenhuma:
 * esta função devolve `null` e a página mostra o marcador `[a verificar]`.
 *
 * QUEM CONFERE: `scripts/check-datas.mjs`, na cadeia do `build` e do `verify`.
 * Compara o que as páginas construídas imprimiram com este ficheiro, sempre; e
 * compara este ficheiro com o `git`, quando a árvore tem história completa. A
 * célula I9 de `tests/livro/indice.mjs` faz a segunda conta por sua conta.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A RAIZ PROCURA-SE, NÃO SE CALCULA DO `import.meta.url` (medido a 04.09.2026).
 *
 * Nas construções o `import.meta.url` de um módulo empacotado pelo Astro não
 * aponta para `src/lib/`: o caminho dava um directório que não existe e as
 * dezasseis edições voltavam ao marcador sem um erro. É o mesmo modo de falhar
 * que `encontraLivroRazao()` já tinha resolvido em `src/lib/ledger.mjs`, e a
 * solução é a dele: subir do `cwd` e do próprio módulo até encontrar a marca da
 * árvore (`studies-src/`).
 */
function encontraRaiz() {
  /** @type {string[]} */
  const candidatos = [];
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(dir);
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };
  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));
  for (const c of candidatos) {
    try {
      if (fs.statSync(path.join(c, 'studies-src')).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  return process.cwd();
}

const RAIZ = encontraRaiz();

/** O ficheiro, nomeado uma vez: a régua e o guarda citam-no na mensagem. */
export const FICHEIRO_DAS_DATAS = path.join('src', 'data', 'datas-de-publicacao.json');

/**
 * @typedef {object} DataDeEdicao
 * @property {string} slug
 * @property {string} lang
 * @property {string} data     `AAAA-MM-DD`
 * @property {string} commit   o resumo completo do commit que acrescentou o ficheiro
 * @property {string} ficheiro o caminho, relativo à raiz do repositório
 */

/**
 * O GUARDA DO FICHEIRO (a disciplina do bloco F0.4: nada entra com um molde por
 * cima). Um JSON estragado tem de fechar a construção com a frase do que falta,
 * e não pintar dezasseis marcadores em silêncio.
 *
 * @param {unknown} x
 * @returns {x is {edicoes: DataDeEdicao[]}}
 */
export function eDatasDePublicacao(x) {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) return false;
  const m = /** @type {Record<string, unknown>} */ (x);
  if (!Array.isArray(m.edicoes)) return false;
  return m.edicoes.every((e) => eDataDeEdicao(e));
}

/**
 * Uma linha do ficheiro: as cinco chaves, a data na forma e o commit inteiro.
 *
 * @param {unknown} e
 * @returns {e is DataDeEdicao}
 */
export function eDataDeEdicao(e) {
  if (typeof e !== 'object' || e === null || Array.isArray(e)) return false;
  const m = /** @type {Record<string, unknown>} */ (e);
  return (
    typeof m.slug === 'string' &&
    m.slug.length > 0 &&
    (m.lang === 'pt' || m.lang === 'en') &&
    typeof m.data === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(m.data) &&
    typeof m.commit === 'string' &&
    /^[0-9a-f]{40}$/.test(m.commit) &&
    typeof m.ficheiro === 'string' &&
    m.ficheiro === `studies-src/${m.slug}/${m.lang}.html`
  );
}

/** @type {Map<string, DataDeEdicao> | null} */
let _porEdicao = null;

/** A chave do mapa. @param {string} slug @param {string} lang */
const chave = (slug, lang) => `${slug}/${lang}`;

/** O ficheiro, lido uma vez e conferido. @returns {Map<string, DataDeEdicao>} */
function mapa() {
  if (_porEdicao) return _porEdicao;
  const caminho = path.join(RAIZ, FICHEIRO_DAS_DATAS);
  if (!fs.existsSync(caminho)) {
    throw new Error(
      `datas-do-repositorio: falta ${FICHEIRO_DAS_DATAS}. ` +
        `Escreve-se com \`node scripts/datas-de-publicacao.mjs\`, numa árvore com a história ` +
        `completa, e entra no commit: a construção não chama o \`git\` e não tem outra fonte.`,
    );
  }
  /** @type {unknown} */
  let bruto;
  try {
    bruto = JSON.parse(fs.readFileSync(caminho, 'utf8'));
  } catch (erro) {
    throw new Error(
      `datas-do-repositorio: ${FICHEIRO_DAS_DATAS} não é JSON válido ` +
        `(${erro instanceof Error ? erro.message : String(erro)}).`,
    );
  }
  if (!eDatasDePublicacao(bruto)) {
    throw new Error(
      `datas-do-repositorio: ${FICHEIRO_DAS_DATAS} não tem a forma que a construção lê. ` +
        `Cada entrada de \`edicoes\` traz \`slug\`, \`lang\` («pt» ou «en»), \`data\` ` +
        `(AAAA-MM-DD), \`commit\` (40 hexadecimais) e \`ficheiro\` ` +
        `(studies-src/<slug>/<lang>.html). Refaça-o com \`node scripts/datas-de-publicacao.mjs\`.`,
    );
  }
  _porEdicao = new Map(bruto.edicoes.map((e) => [chave(e.slug, e.lang), e]));
  return _porEdicao;
}

/** Todas as linhas do ficheiro, pela ordem em que lá estão. @returns {DataDeEdicao[]} */
export function datasDePublicacao() {
  return [...mapa().values()];
}

/**
 * O caminho do ficheiro de uma edição de um trabalho.
 *
 * @param {string} slug
 * @param {string} lang
 */
export function ficheiroDaEdicao(slug, lang) {
  return `studies-src/${slug}/${lang}.html`;
}

/** @type {Map<string, string|null>} */
const lidas = new Map();
let pedidas = 0;
let semData = 0;

/**
 * A data em que uma edição entrou no repositório, `AAAA-MM-DD`, ou `null`.
 *
 * @param {string} slug
 * @param {string} lang
 * @returns {string|null}
 */
export function dataDaEdicaoNoRepositorio(slug, lang) {
  const k = chave(slug, lang);
  const ja = lidas.get(k);
  if (ja !== undefined) return ja;
  pedidas++;
  const linha = mapa().get(k);
  const data = linha ? linha.data : null;
  if (data === null) semData++;
  lidas.set(k, data);
  return data;
}

/**
 * O que esta leitura conseguiu, para quem quiser contar.
 *
 * Existe pela regra 14 da casa: um leitor que devolve `null` para tudo e uma
 * página cheia de marcadores são indistinguíveis de um arquivo sem datas. O
 * número diz qual dos dois é.
 */
export function estadoDasDatasDoRepositorio() {
  return { pedidas, resolvidas: pedidas - semData, sem_data: semData };
}
