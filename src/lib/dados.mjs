/**
 * Os dados por trás dos instrumentos, em ficheiro.
 *
 * O Método diz, em cópia final da direção: «Os dados por trás de cada gráfico
 * são descarregáveis.» Este módulo é o que sustenta essa frase.
 *
 * REGRA: nada aqui é uma cópia à mão. Os dois ficheiros são gerados no build a
 * partir das MESMAS origens que desenham os instrumentos — o livro-razão para a
 * régua da convergência, o módulo das coordenadas para os 308 pontos. Um
 * ficheiro escrito à mão diverge no dia em que uma afirmação for corrigida; um
 * ficheiro gerado não pode divergir, e o que confere (scripts/check-dados.mjs)
 * volta a lê-lo do dist/ e compara-o com as origens, não com este módulo.
 *
 * FORMATAÇÃO, e porque não é uniforme:
 *   - o valor de uma afirmação vai EXACTAMENTE como foi publicado, em
 *     formatação portuguesa ("77,2"). É a prova documental e não se toca — por
 *     isso vai entre aspas, para não colidir com a vírgula que separa colunas;
 *   - as coordenadas vão com ponto decimal ("396.5"), porque não são valores
 *     publicados: são geometria, e a sua proveniência é a citação transcrita.
 * As duas convenções estão explicadas no cabeçalho de cada ficheiro.
 */

import { getClaim } from './ledger.mjs';
import { REGIOES } from '../data/regioes.mjs';
import {
  MUNICIPIOS,
  DISTRITOS,
  FIELD_W,
  FIELD_H,
  regiaoDe,
} from '../data/caop-centroids.mjs';
import { VERBATIM } from '../data/verbatim.mjs';
import { SITE_NAME, SITE_HOST_DISPLAY } from '../../site.config.mjs';

/**
 * Onde cada ficheiro é servido. Uma constante só, partilhada pelas ligações das
 * páginas e por quem confere o dist/ — para que uma ligação nunca aponte para
 * um ficheiro que não foi construído.
 */
export const DADOS = {
  convergencia: '/dados/convergencia.csv',
  municipios: '/dados/municipios-308.csv',
};

/**
 * Escape RFC 4180. Fim de linha LF, como todo o resto do repositório.
 *
 * @param {unknown} v
 */
function campo(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** @param {unknown[]} campos */
function linha(campos) {
  return campos.map(campo).join(',');
}

/**
 * Cabeçalho comum: quem publica e onde está o método.
 *
 * A LINHA DE MÉTODO SAIU a 21.08.2026 (Emenda 11, DECISIONS §1.52). Era a
 * segunda linha deste preâmbulo e dizia o que o sítio é; a direção decidiu que o
 * sítio não se explica na mobília, e um cabeçalho de CSV é mobília. O que fica é
 * quem publica, onde está o método, e o aviso de que o ficheiro é gerado. O
 * `check:dados` não se mexeu com ela porque não é ela que ele compara: compara o
 * cabeçalho de COLUNAS, e exige dos comentários a citação da CAOP, a data de
 * acesso e o caminho das linhas do livro-razão.
 *
 * A linha «Edição de …» saiu a 16.08.2026 com a própria `EDITION`
 * (DECISIONS §1.39). Não foi substituída por outra data: um ficheiro de dados
 * gerado a cada construção carimbado com a data da construção diria que os
 * dados mudaram sempre que o sítio é reconstruído, que é falso. Quem quiser
 * saber de quando é cada valor tem, em cada linha, o id da afirmação e a sua
 * data de referência.
 *
 * @param {string} titulo
 */
function preambulo(titulo) {
  return [
    `# ${SITE_NAME} — ${titulo}`,
    '#',
    `# https://${SITE_HOST_DISPLAY}/metodo`,
    '# Gerado na construção do sítio.',
    '# NÃO EDITAR À MÃO: a construção seguinte reescreve este ficheiro.',
  ];
}

/**
 * As linhas que a régua da convergência publica: uma por região, mais a leitura
 * histórica das regiões que a têm. Cada uma nomeia a afirmação de onde veio.
 *
 * É esta lista — e não uma contagem escrita à mão — que diz quantas linhas o
 * ficheiro tem de ter. Quem confere refá-la e compara.
 *
 * @returns {{ regiao: string, claimId: string }[]}
 */
export function linhasDaConvergencia() {
  const out = [];
  for (const r of REGIOES) {
    out.push({ regiao: r.nome.pt, claimId: r.valor });
    if (r.valorHistorico) out.push({ regiao: r.nome.pt, claimId: r.valorHistorico });
  }
  return out;
}

/** `/dados/convergencia.csv` — gerado do livro-razão, nunca copiado. */
export function csvConvergencia() {
  const linhas = [
    ...preambulo('a régua da convergência'),
    '#',
    '# Cada linha é uma linha do livro-razão. A coluna "afirmacao" tem o id:',
    '# o ficheiro correspondente é ledger/claims/<afirmacao>.yml, com fonte,',
    '# documento, endereço, data de acesso, excerto e, quando o valor é',
    '# calculado, a aritmética explicada e reavaliada a cada construção.',
    '#',
    '# "valor" vai exactamente como foi publicado, em formatação portuguesa',
    '# (vírgula decimal) — daí as aspas. "ano" é a data a que os dados se',
    '# referem, não a data em que foram lidos.',
    '# Nomes de região em português, a língua primária do sítio.',
    '#',
    linha(['regiao', 'valor', 'ano', 'unidade', 'estudo', 'afirmacao']),
  ];

  for (const l of linhasDaConvergencia()) {
    const c = getClaim(l.claimId);
    linhas.push(linha([l.regiao, c.value, c.reference_date, c.unit, c.study, c.id]));
  }

  return linhas.join('\n') + '\n';
}

/** `/dados/municipios-308.csv` — gerado do módulo das coordenadas. */
export function csvMunicipios() {
  const linhas = [
    ...preambulo('as posições dos municípios'),
    '#',
    '# x e y são posições NORMALIZADAS para o referencial da página',
    `# (${FIELD_W} × ${FIELD_H}), não coordenadas geográficas: a Madeira está à`,
    '# mesma escala do Continente e os Açores a uma escala menor, declarada na',
    '# transcrição abaixo. Vão com ponto decimal, porque são geometria — não são',
    '# valores publicados, e por isso não levam a formatação portuguesa que o',
    '# livro-razão preserva.',
    '#',
    '# A coluna "regiao" é derivada do distrito ou ilha, e é ela que reproduz a',
    '# repartição que o sítio publica entre Continente, Açores e Madeira.',
    '#',
    '# ---------------------------------------------------------------------',
    '# PROVENIÊNCIA — transcrição literal do colofão do estudo de identidade',
    '# (src/data/verbatim.mjs, bloco "caop-fonte"). Inclui a data de acesso.',
    '# ---------------------------------------------------------------------',
    ...VERBATIM['caop-fonte'].text.split('\n').map((l) => `# ${l}`.trimEnd()),
    '#',
    '# ---------------------------------------------------------------------',
    '# PROCESSAMENTO — transcrição literal do mesmo colofão, bloco',
    '# "caop-processamento".',
    '# ---------------------------------------------------------------------',
    ...VERBATIM['caop-processamento'].text.split('\n').map((l) => `# ${l}`.trimEnd()),
    '#',
    linha(['municipio', 'distrito', 'regiao', 'x', 'y']),
  ];

  for (const m of MUNICIPIOS) {
    linhas.push(linha([m[0], DISTRITOS[m[1]], regiaoDe(m[1]), m[2], m[3]]));
  }

  return linhas.join('\n') + '\n';
}

/**
 * Separa um CSV nas linhas de comentário, no cabeçalho e nos dados.
 * Usado por quem confere o dist/ — que lê o ficheiro construído, não este
 * módulo, para que a verificação não seja uma tautologia.
 *
 * @param {string} texto
 */
export function lerCsv(texto) {
  const todas = texto.split('\n').filter((l) => l.length > 0);
  const comentarios = todas.filter((l) => l.startsWith('#'));
  const dados = todas.filter((l) => !l.startsWith('#'));
  const cabecalho = dados.length ? partirLinha(dados[0]) : [];
  return {
    comentarios,
    cabecalho,
    linhas: dados.slice(1).map(partirLinha),
  };
}

/** Um leitor de CSV suficiente para o que estes dois ficheiros usam. @param {string} l */
function partirLinha(l) {
  const out = [];
  let atual = '';
  let dentro = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (dentro) {
      if (ch === '"') {
        if (l[i + 1] === '"') {
          atual += '"';
          i++;
        } else dentro = false;
      } else atual += ch;
      continue;
    }
    if (ch === '"') dentro = true;
    else if (ch === ',') {
      out.push(atual);
      atual = '';
    } else atual += ch;
  }
  out.push(atual);
  return out;
}
