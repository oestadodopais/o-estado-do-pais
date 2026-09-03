/**
 * O livro-razão como conjunto de dados.
 *
 * ---------------------------------------------------------------------------
 * O QUE ISTO É
 * ---------------------------------------------------------------------------
 * O livro-razão é público desde o primeiro dia, uma página por linha. Uma
 * página por linha serve quem quer conferir **uma** afirmação; não serve quem
 * quer contar, cruzar ou reproduzir o conjunto. Este módulo escreve a mesma
 * coisa numa forma que uma máquina lê de uma vez:
 *
 *   /livro-razao.csv          todas as linhas, uma por registo
 *   /livro-razao.json         as mesmas linhas, com a estrutura inteira
 *   /livro-razao/<id>.json    uma linha
 *
 * Gerados na construção a partir de `ledger/claims/*.yml`, como os dois
 * ficheiros de `src/lib/dados.mjs`: **nada aqui é uma cópia à mão**, e por isso
 * nada aqui pode divergir do que as páginas mostram.
 *
 * ---------------------------------------------------------------------------
 * OS CAMPOS SÃO OS DO FORMATO, MENOS `note`
 * ---------------------------------------------------------------------------
 * A lista não é escrita aqui: é `CAMPOS_PUBLICADOS`, que é `CAMPOS` menos
 * `CAMPOS_NAO_PUBLICADOS`, as duas em `src/lib/ledger.mjs`. Um campo novo no
 * formato aparece nestes ficheiros sozinho; `note` não aparece nunca, pela
 * mesma regra que a mantém fora das páginas (`ledger/README.md`).
 *
 * **Todos os campos, em todas as linhas, mesmo os que a linha não tem.** Um
 * campo ausente vai a `null` no JSON e a célula vazia no CSV, e não desaparece:
 * um conjunto cuja forma muda de registo para registo obriga quem o lê a
 * adivinhar a forma, e é a mesma disciplina com que a página declara o que
 * falta em vez de o esconder.
 *
 * ---------------------------------------------------------------------------
 * O CSV NÃO LEVA PREÂMBULO, E É UMA DECISÃO
 * ---------------------------------------------------------------------------
 * Os dois ficheiros de `dados.mjs` abrem com linhas de comentário `#`: a
 * proveniência da CAOP, a explicação da vírgula decimal. Aqui não. O RFC 4180
 * não define comentários, e um leitor estrito (uma folha de cálculo, um
 * `csv.reader` sem opções) engole essas linhas como se fossem dados. Aqueles
 * dois ficheiros são a matéria de dois gráficos, e chega-se lá pela legenda do
 * gráfico; este é **o conjunto de dados**, e existe para ser lido por quem não
 * foi avisado das convenções da casa. Fica com o cabeçalho e os registos e mais
 * nada; o que o preâmbulo diria vai no `_` do JSON, na página do livro-razão e
 * no `ledger/README.md`.
 *
 * **Uma coluna é um escalar, ou é JSON.** Os campos que são lista ou mapa
 * (`corrections`, `verifications`, `derived_from`, `attributed_to`,
 * `document.crop`, `document.hosted`, `document.computed_over`) vão numa só
 * coluna, com o seu JSON dentro da célula, entre aspas segundo o RFC 4180. A
 * alternativa era desdobrá-los em colunas numeradas até um teto arbitrário, e
 * um teto arbitrário perde dados no dia em que uma linha tiver mais correções
 * do que o teto. Uma célula vazia é a ausência: `null`, cadeia vazia e lista
 * vazia escrevem-se todas como célula vazia, e a estrutura inteira está no
 * JSON para quem precisar de distinguir as três.
 *
 * ---------------------------------------------------------------------------
 * O VALOR VAI COMO FOI PUBLICADO
 * ---------------------------------------------------------------------------
 * `value` é a prova documental: vai exatamente como está no livro-razão, em
 * formatação portuguesa, com a vírgula decimal, o espaço fino dos milhares e o
 * sinal menos tipográfico onde os há. Não se converte para ponto decimal nem
 * para número JSON. Quem quiser aritmética tem `unit`, `reference_date` e o
 * campo `check` de cada linha derivada, e a conversão é dele.
 */

import {
  allClaims,
  getClaim,
  CAMPOS_PUBLICADOS,
  CAMPOS_DO_DOCUMENTO,
} from './ledger.mjs';
import { LICENCA, CONJUNTO } from '../data/licenca.mjs';
import { SITE_NAME, SITE_HOST_DISPLAY } from '../../site.config.mjs';

export { CONJUNTO };

/**
 * As colunas do CSV, derivadas dos campos publicados: `document` desdobra-se em
 * `document_<chave>` no lugar onde está, e todos os outros ficam como estão.
 */
export function colunasDoConjunto() {
  const out = [];
  for (const campo of CAMPOS_PUBLICADOS) {
    if (campo === 'document') {
      for (const k of CAMPOS_DO_DOCUMENTO) out.push(`document_${k}`);
    } else out.push(campo);
  }
  return out;
}

/**
 * Uma linha, com todos os campos publicados e na ordem do formato.
 *
 * `document` mantém-se aninhado (é um mapa no formato, e desdobrá-lo aqui
 * perderia essa forma), com todas as suas chaves, também na ordem do formato.
 * `null` onde a linha não tem o campo.
 *
 * @param {any} claim
 */
export function linhaDoConjunto(claim) {
  /** @type {Record<string, any>} */
  const out = {};
  for (const campo of CAMPOS_PUBLICADOS) {
    if (campo === 'document') {
      const d = claim.document;
      if (d === null || d === undefined) {
        out.document = null;
        continue;
      }
      /** @type {Record<string, any>} */
      const doc = {};
      for (const k of CAMPOS_DO_DOCUMENTO) doc[k] = d[k] ?? null;
      out.document = doc;
      continue;
    }
    out[campo] = claim[campo] ?? null;
  }
  return out;
}

/**
 * O bloco `_` dos ficheiros JSON: o que isto é, de onde vem e o que não traz.
 *
 * A mesma convenção do `dist/prova.json`. Vai em lista de linhas para que o
 * ficheiro se leia sem uma linha de mil caracteres.
 *
 * A primeira linha diz **quanto** do livro-razão vem no ficheiro, e é a única
 * que muda entre os dois: `/livro-razao.json` traz todas as linhas, e cada
 * `/livro-razao/<id>.json` traz uma. Dizer «todas as linhas» num ficheiro que
 * tem uma era descrever o irmão em vez do próprio, e quem abre o ficheiro pelo
 * endereço não tem outra maneira de saber. Apanhado pela leitura cruzada de
 * 20.08.2026 (achado 9, `DECISIONS.md` §1.48).
 *
 * @param {'todas' | 'uma'} quanto
 */
function nota(quanto) {
  return [
    `${SITE_NAME}: o livro-razão, ${quanto === 'uma' ? 'uma linha' : 'todas as linhas'}.`,
    'FICHEIRO GERADO na construção do sítio a partir de ledger/claims/*.yml.',
    'NÃO EDITAR À MÃO: a construção seguinte reescreve-o.',
    `O método e a explicação de cada campo: https://${SITE_HOST_DISPLAY}/metodo`,
    'O campo "note" do formato não é publicado, e por isso não está aqui.',
    '"value" vai exatamente como foi publicado, em formatação portuguesa.',
  ];
}

/**
 * A licença, tal como os ficheiros a declaram.
 *
 * `null` enquanto a direção não decidir. Um conjunto que declarasse termos que
 * ninguém decidiu seria pior do que um conjunto sem termos: o segundo obriga
 * quem o quiser reutilizar a perguntar, o primeiro dá-lhe uma resposta que não
 * é de ninguém. Ver `src/data/licenca.mjs`.
 */
function licenca() {
  return LICENCA ? { nome: LICENCA.nome, url: LICENCA.url, atribuicao: LICENCA.atribuicao } : null;
}

/** `/livro-razao.json` — todas as linhas. */
export function jsonDoConjunto() {
  return (
    JSON.stringify(
      { _: nota('todas'), licenca: licenca(), linhas: allClaims().map(linhaDoConjunto) },
      null,
      2,
    ) + '\n'
  );
}

/**
 * `/livro-razao/<id>.json` — uma linha, com o mesmo invólucro.
 *
 * @param {string} id
 */
export function jsonDaLinha(id) {
  return (
    JSON.stringify({ _: nota('uma'), licenca: licenca(), linha: linhaDoConjunto(getClaim(id)) }, null, 2) +
    '\n'
  );
}

/**
 * Escape RFC 4180, e fim de linha CRLF.
 *
 * O RFC 4180 fixa CRLF entre registos. Os dois ficheiros de `dados.mjs` usam LF
 * como todo o repositório, e continuam: são ficheiros da casa. Este diz que
 * segue o RFC, e por isso segue-o inteiro, aspas e fim de linha.
 *
 * @param {unknown} v
 */
function campo(v) {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/**
 * O valor de uma célula: escalar como está, lista ou mapa em JSON, ausência
 * como célula vazia.
 *
 * @param {unknown} v
 */
function celula(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.length ? JSON.stringify(v) : '';
  if (typeof v === 'object') return Object.keys(v).length ? JSON.stringify(v) : '';
  return String(v);
}

/** `/livro-razao.csv` — cabeçalho e registos, e mais nada. */
export function csvDoConjunto() {
  const colunas = colunasDoConjunto();
  const linhas = [colunas.map(campo).join(',')];
  for (const claim of allClaims()) {
    const l = linhaDoConjunto(claim);
    /** @type {string[]} */
    const celulas = [];
    for (const campo0 of CAMPOS_PUBLICADOS) {
      if (campo0 === 'document') {
        const d = l.document;
        for (const k of CAMPOS_DO_DOCUMENTO) celulas.push(celula(d ? d[k] : null));
        continue;
      }
      celulas.push(celula(l[campo0]));
    }
    linhas.push(celulas.map(campo).join(','));
  }
  return linhas.join('\r\n') + '\r\n';
}
