#!/usr/bin/env node
/**
 * AS DATAS DE PUBLICAÇÃO, ESCRITAS UMA VEZ E COMMITADAS.
 *
 * Bloco F1.4b (04.09.2026), correção urgente do F1.4.
 *
 * ---------------------------------------------------------------------------
 * O DEFEITO QUE ESTE FICHEIRO EXISTE PARA FECHAR
 * ---------------------------------------------------------------------------
 * O F1.4 calculava a data de cada edição NA CONSTRUÇÃO, com
 *
 *     git log --diff-filter=A --format=%ad --date=short -- studies-src/<slug>/<lang>.html
 *
 * A CI da casa pede `fetch-depth: 0` e via a história inteira. A Vercel não: a
 * construção de produção sai de uma cópia RASA (cerca de dez commits), e numa
 * cópia rasa o commit que ACRESCENTOU um ficheiro de 12.08 não existe. O `git`
 * respondeu com o commit mais antigo que a cópia tinha, e as dezasseis edições
 * ficaram com a data desse dia: o sítio publicado dizia «PUBLICADO A 04.09.2026»
 * nos doze trabalhos, ao lado de uma caixa que dizia «Datas de publicação por
 * confirmar.» e de linhas que diziam «ÚLTIMA ATUALIZAÇÃO: 20.08.2026». Uma data
 * errada numa página pública é a coisa que esta casa não pode fazer.
 *
 * A LIÇÃO NÃO É «pedir história à Vercel» (as definições do serviço são do
 * diretor, e uma construção que depende do ambiente é uma construção que se
 * parte sozinha outra vez). A lição é que UM FACTO DO REPOSITÓRIO MEDE-SE UMA
 * VEZ, ONDE A HISTÓRIA ESTÁ, e viaja escrito. É o que este script faz: lê o
 * `git` numa árvore com história completa, escreve
 * `src/data/datas-de-publicacao.json`, e esse ficheiro entra no commit. A
 * construção lê o JSON e NUNCA chama o `git`.
 *
 * ---------------------------------------------------------------------------
 * A ORIGEM DE CADA LINHA, DECLARADA
 * ---------------------------------------------------------------------------
 * Cada entrada do JSON traz o `slug`, a `lang`, a `data`, o `commit` e o
 * `ficheiro`. A `data` é a do commit que ACRESCENTOU (`--diff-filter=A`) o
 * ficheiro da edição, na data de autoria (`%ad`), em `AAAA-MM-DD`; o `commit` é
 * o resumo completo desse commit, para que qualquer pessoa com o repositório
 * possa refazer a leitura:
 *
 *     git show --no-patch --format=%ad --date=short <commit>
 *     git show --stat <commit> | grep <ficheiro>
 *
 * NÃO É a data em que o trabalho foi publicado noutro sítio, nem a data em que
 * foi escrito. É o dia em que a edição ficou pública AQUI, e a página di-lo com
 * a marca `data-nonledger="data-do-repositorio"`, cujo motivo está escrito em
 * `ledger/allowlist.yml`.
 *
 * UMA EDIÇÃO SEM COMMIT DE ADIÇÃO NÃO ENTRA NO FICHEIRO. Não se escreve `null`:
 * a ausência de linha é a ausência de facto, e a página volta ao marcador
 * `[a verificar]`, que é o modo certo de falhar.
 *
 * MAS UM ERRO DO `git` NÃO É UMA AUSÊNCIA (segunda passagem, 07.09.2026). Se a
 * leitura de uma edição sair com código diferente de zero, ou atirar, o script
 * PÁRA e não escreve nada, dizendo qual foi a edição e o que o `git` respondeu:
 * escrever o ficheiro sem essa linha apagaria uma data medida e commitada. Só a
 * saída limpa e vazia deixa a edição de fora, e essa diz-se no registo.
 *
 * ---------------------------------------------------------------------------
 * A RECUSA
 * ---------------------------------------------------------------------------
 * O script RECUSA correr numa cópia rasa (`git rev-parse
 * --is-shallow-repository` a dizer `true`), porque é exactamente aí que ele
 * escreveria as datas erradas que este bloco veio corrigir. Recusa também
 * quando o `git` não corre de todo. Sem história não se gera o ficheiro: o que
 * já está commitado fica de pé.
 *
 * ---------------------------------------------------------------------------
 * É IDEMPOTENTE, DE PROPÓSITO
 * ---------------------------------------------------------------------------
 * Não escreve carimbo de hora nenhum. Correr o script duas vezes sobre a mesma
 * história dá o mesmo ficheiro byte a byte, e é isso que deixa
 * `scripts/check-datas.mjs` comparar o JSON com o `git` sem ter de olhar para
 * uma data de geração que muda sozinha.
 *
 * Uso:  node scripts/datas-de-publicacao.mjs          (escreve)
 *       node scripts/datas-de-publicacao.mjs --ver    (só imprime, não escreve)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = path.join(RAIZ, 'src', 'data', 'datas-de-publicacao.json');
const SO_VER = process.argv.includes('--ver');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** @param {string[]} args */
function git(args) {
  return execFileSync('git', args, {
    cwd: RAIZ,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/* ------------------------------------------------------- a recusa, primeiro */

let raso = null;
try {
  raso = git(['rev-parse', '--is-shallow-repository']).trim();
} catch (erro) {
  console.error(
    vermelho('datas-de-publicacao: o `git` não corre nesta árvore.') +
      `\n  ${erro instanceof Error ? erro.message : String(erro)}` +
      `\n  Este script mede um facto do repositório e não tem outra fonte. Nada foi escrito.`,
  );
  process.exit(1);
}

if (raso !== 'false') {
  console.error(
    vermelho('datas-de-publicacao: esta cópia do repositório é RASA.') +
      `\n  \`git rev-parse --is-shallow-repository\` respondeu «${raso}».` +
      `\n` +
      `\n  Numa cópia rasa o commit que acrescentou uma edição em agosto não existe, e o` +
      `\n  \`git log --diff-filter=A\` responde com o commit mais antigo que a cópia tem: foi` +
      `\n  assim que o sítio publicado passou a dizer que os doze trabalhos tinham sido` +
      `\n  publicados hoje. Este script recusa-se a escrever essas datas.` +
      `\n` +
      `\n  Corra-o numa árvore com a história inteira (\`git fetch --unshallow\`), e commite o` +
      `\n  ficheiro. Nada foi escrito.`,
  );
  process.exit(1);
}

/* ------------------------------------------------------------- a medição */

const DIR_DOS_TRABALHOS = path.join(RAIZ, 'studies-src');
if (!fs.existsSync(DIR_DOS_TRABALHOS)) {
  console.error(vermelho(`datas-de-publicacao: não existe ${DIR_DOS_TRABALHOS}.`));
  process.exit(1);
}

const slugs = fs
  .readdirSync(DIR_DOS_TRABALHOS, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
  .map((e) => e.name)
  .sort();

/** @type {{slug: string, lang: string, data: string, commit: string, ficheiro: string}[]} */
const edicoes = [];
/** @type {string[]} */
const semCommit = [];

for (const slug of slugs) {
  for (const lang of ['pt', 'en']) {
    const ficheiro = `studies-src/${slug}/${lang}.html`;
    if (!fs.existsSync(path.join(RAIZ, ficheiro))) continue;

    /**
     * UM ERRO DO `git` NÃO É A AUSÊNCIA DE UM FACTO (leitura a frio do Codex de
     * 07.09.2026, Major 5).
     *
     * A primeira passagem apanhava qualquer excepção desta chamada e punha
     * `linhas = []`, que o resto do script lê como «esta edição não tem commit
     * de adição». O `git` a falhar numa edição ficava indistinguível da prova de
     * que ela nunca foi acrescentada, e o script seguia e ESCREVIA POR CIMA do
     * ficheiro commitado um resultado parcial, com exit 0. Plantado e
     * confirmado a 07.09 com um `git` que falha só numa edição: quinze linhas
     * escritas, uma apagada em silêncio.
     *
     * Agora o erro pára o script antes de qualquer escrita, e diz qual foi a
     * edição e o que o `git` respondeu. Só a saída LIMPA e vazia é ausência.
     */
    let saida;
    try {
      saida = git(['log', '--diff-filter=A', '--format=%ad %H', '--date=short', '--', ficheiro]);
    } catch (erro) {
      const e = /** @type {{status?: number, stderr?: Buffer|string}} */ (erro);
      const codigo = typeof e.status === 'number' ? e.status : 'sem código';
      const stderr = e.stderr ? String(e.stderr).trim() : '';
      console.error(
        vermelho(`datas-de-publicacao: o \`git\` falhou em ${ficheiro}.`) +
          `\n  \`git log --diff-filter=A --format=%ad %H --date=short -- ${ficheiro}\`` +
          `\n  saiu com ${codigo}${stderr ? `: ${stderr}` : ''}` +
          `\n` +
          `\n  Um erro do \`git\` NÃO é a prova de que esta edição não tem commit de adição, e` +
          `\n  escrever o ficheiro sem ela apagava uma data que está medida e commitada. Nada foi` +
          `\n  escrito: ${path.relative(RAIZ, DESTINO)} fica como está.`,
      );
      process.exit(1);
    }

    const cruas = saida.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const linhas = cruas.filter((l) => /^\d{4}-\d{2}-\d{2} [0-9a-f]{40}$/.test(l));

    /* O `git` respondeu, com código 0, alguma coisa que este script não sabe
       ler. Também não é ausência: é o formato a mudar por baixo da medição. */
    if (cruas.length > 0 && linhas.length === 0) {
      console.error(
        vermelho(`datas-de-publicacao: o \`git\` respondeu em ${ficheiro} e não na forma lida.`) +
          `\n  Esperava linhas \`AAAA-MM-DD <40 hexadecimais>\` e a primeira foi «${cruas[0]}».` +
          `\n  Nada foi escrito: ${path.relative(RAIZ, DESTINO)} fica como está.`,
      );
      process.exit(1);
    }

    /* A ÚLTIMA LINHA É A MAIS ANTIGA: o `git log` vem do mais recente para trás,
       e um ficheiro apagado e reposto tem duas adições. A que conta é a primeira
       vez que ele existiu neste repositório. */
    const ultima = linhas.length > 0 ? linhas[linhas.length - 1] : null;
    if (ultima === null) {
      /* A AUSÊNCIA LEGÍTIMA: o `git` correu, saiu com 0 e não devolveu uma
         linha. A edição fica de fora do ficheiro, e di-lo aqui e no fim. */
      console.log(
        cinza(`  ${ficheiro}: o \`git\` correu e não deu commit de adição. Fica de fora.`),
      );
      semCommit.push(ficheiro);
      continue;
    }
    const [data, commit] = ultima.split(' ');
    edicoes.push({ slug, lang, data, commit, ficheiro });
  }
}

if (edicoes.length === 0) {
  console.error(
    vermelho('datas-de-publicacao: nenhuma edição deu commit de adição.') +
      `\n  ${slugs.length} pasta(s) de trabalho lidas e zero datas: sem um positivo conhecido este` +
      `\n  script não mediu nada, e escrever um ficheiro vazio apagava as datas que já lá estão.`,
  );
  process.exit(1);
}

/* ------------------------------------------------------------- a escrita */

const conteudo = {
  origem: {
    escrito_por: 'scripts/datas-de-publicacao.mjs',
    o_que_e:
      'O dia em que o ficheiro de cada edição de um trabalho entrou NESTE repositório, ' +
      'medido numa árvore com a história completa e escrito aqui para que a construção ' +
      'não dependa da profundidade da cópia que a corre.',
    o_que_nao_e:
      'Não é a data em que o trabalho foi publicado noutro sítio, nem a data em que foi ' +
      'escrito. Nenhuma data de publicação está confirmada em src/data/studies.mjs.',
    comando: 'git log --diff-filter=A --format=%ad %H --date=short -- <ficheiro>',
    como_refazer:
      'node scripts/datas-de-publicacao.mjs, numa árvore com git fetch --unshallow. ' +
      'scripts/check-datas.mjs confere este ficheiro contra o git quando a história é ' +
      'completa, e contra as páginas construídas sempre.',
  },
  edicoes,
};

const texto = `${JSON.stringify(conteudo, null, 2)}\n`;

if (SO_VER) {
  process.stdout.write(texto);
  process.exit(0);
}

const anterior = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, 'utf8') : null;
fs.writeFileSync(DESTINO, texto);

console.log(
  `${verde('datas-de-publicacao')} · ${edicoes.length} edição(ões) com data, ` +
    `${semCommit.length} sem commit de adição` +
    (semCommit.length > 0 ? ` (${semCommit.join(', ')})` : '') +
    `\n  ${cinza(path.relative(RAIZ, DESTINO))} ${anterior === texto ? 'sem mudança' : 'escrito'}`,
);
for (const e of edicoes) {
  console.log(`  ${cinza(e.commit.slice(0, 8))}  ${e.data}  ${e.slug} (${e.lang})`);
}
