/**
 * A DATA EM QUE UMA EDIÇÃO ENTROU NESTE REPOSITÓRIO
 * =============================================================================
 *
 * Segunda passagem do bloco F1.4 (04.09.2026), decisão do lugar de direção sobre
 * as datas de publicação dos trabalhos.
 *
 * ---------------------------------------------------------------------------
 * O PROBLEMA, E PORQUE ELE NÃO SE RESOLVIA COM O QUE HAVIA
 * ---------------------------------------------------------------------------
 * `src/data/studies.mjs` escreve, no seu próprio cabeçalho: «DATAS: nenhuma data
 * de publicação está confirmada. Ficam todas por verificar.» Treze das dezasseis
 * edições levam `date: null`, e o arquivo mostrava o marcador de incerteza em
 * cada uma. O marcador estava certo: a casa não sabia a data.
 *
 * O QUE A CASA SABE, E PODE PROVAR, é outra coisa: **o dia em que o ficheiro da
 * edição entrou neste repositório**. Não é a data em que o trabalho foi
 * publicado noutro sítio, nem a data em que foi escrito. É a data em que ficou
 * público aqui, e é um facto com uma origem verificável por quem quer que tenha
 * o repositório: o commit que acrescentou `studies-src/<slug>/<lang>.html`.
 *
 * É POR ISSO QUE A ORIGEM VAI DITA. A página não escreve «Publicação: …» sobre
 * uma data de repositório: escreve «publicado a …» com a marca
 * `data-nonledger="data-do-repositorio"`, cujo motivo em `ledger/allowlist.yml`
 * diz de onde ela vem. Uma data com a origem trocada seria pior do que o
 * marcador.
 *
 * ---------------------------------------------------------------------------
 * COMO SE LÊ, E O QUE ACONTECE QUANDO NÃO SE PODE LER
 * ---------------------------------------------------------------------------
 *     git log --diff-filter=A --format=%ad --date=short -- <ficheiro>
 *
 * `--diff-filter=A` dá os commits que ACRESCENTARAM o caminho, e a ÚLTIMA linha
 * da saída é o mais antigo: um ficheiro apagado e reposto tem duas, e a que
 * conta é a primeira vez que ele existiu.
 *
 * SEM HISTÓRIA NÃO HÁ DATA, e não se inventa nenhuma: numa cópia rasa
 * (`git clone --depth 1`) o comando devolve vazio, esta função devolve `null` e
 * a página volta a mostrar o marcador. É o modo certo de falhar, e é medido:
 * `estadoDasDatasDoRepositorio()` conta quantas foram pedidas e quantas
 * resolveram, e a régua do bloco (`tests/livro/indice.mjs`, célula I9) refaz a
 * leitura por conta própria e compara-a com o que a página imprimiu. Na CI, o
 * `.github/workflows/portao.yml` pede `fetch-depth: 0` por causa disto.
 *
 * A LEITURA É UMA VEZ POR CAMINHO. A construção rende o arquivo duas vezes (as
 * duas edições) e a página de cada trabalho outra vez; chamar o `git` a cada
 * rendição eram centenas de processos. O mapa fica em memória enquanto a
 * construção dura.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A RAIZ PROCURA-SE, NÃO SE CALCULA DO `import.meta.url` (medido a 04.09.2026).
 *
 * A primeira escrita fazia `dirname(import.meta.url) + '/../..'`, e nas
 * construções o `import.meta.url` de um módulo empacotado pelo Astro não aponta
 * para `src/lib/`: o caminho dava um directório que não existe, o
 * `fs.existsSync` dizia que não, e as dezasseis edições voltavam ao marcador sem
 * um erro. É o mesmo modo de falhar que `encontraLivroRazao()` já tinha
 * resolvido em `src/lib/ledger.mjs`, e a solução é a dele: subir do `cwd` e do
 * próprio módulo até encontrar a marca da árvore (`studies-src/`), e falhar por
 * palavras quando não a encontra.
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

/** @type {Map<string, string|null>} */
const lidas = new Map();
let pedidas = 0;
let semHistoria = 0;

/**
 * O dia em que um caminho deste repositório foi acrescentado, `AAAA-MM-DD`.
 *
 * @param {string} caminho  relativo à raiz do repositório
 * @returns {string|null}
 */
export function dataDoFicheiroNoRepositorio(caminho) {
  const ja = lidas.get(caminho);
  if (ja !== undefined) return ja;
  pedidas++;

  let data = null;
  if (fs.existsSync(path.join(RAIZ, caminho))) {
    try {
      const saida = execFileSync(
        'git',
        ['log', '--diff-filter=A', '--format=%ad', '--date=short', '--', caminho],
        { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      );
      const linhas = saida
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => /^\d{4}-\d{2}-\d{2}$/.test(l));
      /* A ÚLTIMA é a mais antiga: `git log` vem do mais recente para trás. */
      data = linhas.length > 0 ? linhas[linhas.length - 1] : null;
    } catch {
      /* Sem `git`, sem repositório, ou com uma cópia rasa: não há data, e o
         marcador fica. Nunca se inventa uma. */
      data = null;
    }
  }
  if (data === null) semHistoria++;
  lidas.set(caminho, data);
  return data;
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

/**
 * A data em que uma edição entrou no repositório, ou `null`.
 *
 * @param {string} slug
 * @param {string} lang
 * @returns {string|null}
 */
export function dataDaEdicaoNoRepositorio(slug, lang) {
  return dataDoFicheiroNoRepositorio(ficheiroDaEdicao(slug, lang));
}

/**
 * O que esta leitura conseguiu, para quem quiser contar.
 *
 * Existe pela regra 14 da casa: um detector que devolve `null` para tudo e uma
 * página cheia de marcadores são indistinguíveis de um arquivo sem datas. O
 * número diz qual dos dois é.
 */
export function estadoDasDatasDoRepositorio() {
  return { pedidas, resolvidas: pedidas - semHistoria, sem_historia: semHistoria };
}
