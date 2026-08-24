/**
 * Os registos de conteúdo: o texto de uma edição do motor, partido em blocos.
 *
 * Um **registo de conteúdo** é o que o motor de investigação (ResearchHub)
 * escreve para cada edição que prova: o texto de cada bloco tal como a edição o
 * imprime, com cada algarismo ligado à linha do livro-razão do motor que o bate.
 * É a matéria-prima da página de leitura, e é a terceira coisa que atravessa a
 * fronteira entre os dois sistemas, depois das linhas do livro-razão
 * (`ledger/cruzamentos/`) e dos bytes de um documento (`studies-src/`).
 *
 *   registos/<slug>/<lingua>.record.json   o registo, byte a byte como o motor o escreveu
 *   registos/<slug>/<lingua>.cortes.json   as operações da passagem de voz que o fizeram
 *   registos/manifest.json                 o registo de travessia: o que atravessou e de onde
 *
 * **Nada disto se escreve à mão.** Quem escreve é
 * `ResearchHub/publisher/export_records_site.py`, e quem confere é
 * `scripts/check-documentos.mjs`, com seis conferências (D1 a D6) que fecham a
 * construção. Este módulo é só a leitura, para as páginas usarem.
 *
 * **O portão não passa por aqui, e é de propósito.** `check-documentos.mjs` lê o
 * manifesto com o seu próprio leitor: uma conferência que usasse o código que as
 * páginas usam confirmava-se a si própria, e um defeito neste ficheiro passaria
 * pelos dois lados ao mesmo tempo.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** A pasta dos registos, e o registo de travessia lá dentro. */
export const PASTA = 'registos';
export const MANIFESTO = 'manifest.json';

/**
 * Onde está a pasta dos registos.
 *
 * Procura-se a subir, como `encontraOrigem()` dos documentos faz e pela mesma
 * razão: na construção este módulo é empacotado para dentro de `dist/`, e um
 * caminho relativo a este ficheiro passaria a apontar para o sítio errado.
 */
function encontraRegistos() {
  const candidatos = [];
  if (process.env.OEDP_REGISTOS_DIR) candidatos.push(process.env.OEDP_REGISTOS_DIR);

  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, PASTA));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };

  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));

  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  return null;
}

export const REGISTOS_DIR = encontraRegistos();

let CACHE = null;

/**
 * O registo de travessia inteiro, lido uma vez por construção.
 *
 * Atira se a pasta não existe ou se o manifesto não é legível: um sítio que
 * declara páginas de leitura e não tem o registo de travessia não é um sítio com
 * uma funcionalidade em falta, é um sítio a servir texto sem proveniência.
 *
 * @returns {{ exporter: string, origin: string, registos: Record<string, object> }}
 */
export function manifestoDosRegistos() {
  if (CACHE) return CACHE;
  if (!REGISTOS_DIR) {
    throw new Error(
      `registos: não encontrei a pasta \`${PASTA}/\` a subir de ${process.cwd()}. ` +
        `Escreve-a o exportador do motor: python3 publisher/export_records_site.py --write`,
    );
  }
  const ficheiro = path.join(REGISTOS_DIR, MANIFESTO);
  let bruto;
  try {
    bruto = fs.readFileSync(ficheiro, 'utf8');
  } catch (erro) {
    throw new Error(`registos: não consegui ler ${ficheiro}: ${erro.message}`);
  }
  let doc;
  try {
    doc = JSON.parse(bruto);
  } catch (erro) {
    throw new Error(`registos: ${ficheiro} não é JSON legível: ${erro.message}`);
  }
  if (!doc || typeof doc.registos !== 'object' || doc.registos === null) {
    throw new Error(`registos: ${ficheiro} não traz um objecto "registos".`);
  }
  CACHE = doc;
  return CACHE;
}

/** A chave de uma edição no manifesto. */
const chaveDe = (slug, lang) => `${slug}/${lang}`;

/**
 * Todos os registos que atravessaram, ordenados por `slug` e por língua.
 *
 * @returns {{ slug: string, lang: string, ficheiro: string, cortes: string, entrada: object }[]}
 */
export function todosOsRegistos() {
  const doc = manifestoDosRegistos();
  return Object.entries(doc.registos)
    .map(([chave, entrada]) => {
      const corte = chave.lastIndexOf('/');
      const slug = chave.slice(0, corte);
      const lang = chave.slice(corte + 1);
      return {
        slug,
        lang,
        ficheiro: path.join(REGISTOS_DIR, slug, `${lang}.record.json`),
        cortes: path.join(REGISTOS_DIR, slug, `${lang}.cortes.json`),
        entrada,
      };
    })
    .sort((a, b) => chaveDe(a.slug, a.lang).localeCompare(chaveDe(b.slug, b.lang)));
}

/** Se uma edição tem registo. É isto que a página do estudo pergunta. */
export function temRegisto(slug, lang) {
  return Object.hasOwn(manifestoDosRegistos().registos, chaveDe(slug, lang));
}

/** Os registos de um estudo, nas línguas que o tenham. */
export function registosDoEstudo(slug) {
  return todosOsRegistos().filter((r) => r.slug === slug);
}

/**
 * O registo de uma edição, já lido.
 *
 * Devolve `null` quando o manifesto não declara a edição: uma edição sem registo
 * é o caso normal, e é assim que a página do estudo sabe que não tem leitura.
 * **Atira** quando o manifesto a declara e o ficheiro não está lá: um manifesto
 * que nomeia um ficheiro que não existe é o registo a dizer uma coisa que o
 * disco não confirma, e isso é um erro e não uma ausência.
 */
export function registoDaEdicao(slug, lang) {
  if (!temRegisto(slug, lang)) return null;
  const ficheiro = path.join(REGISTOS_DIR, slug, `${lang}.record.json`);
  let bruto;
  try {
    bruto = fs.readFileSync(ficheiro, 'utf8');
  } catch (erro) {
    throw new Error(
      `registos: o manifesto declara "${chaveDe(slug, lang)}" e não consegui ler ${ficheiro}: ` +
        `${erro.message}`,
    );
  }
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    throw new Error(`registos: ${ficheiro} não é JSON legível: ${erro.message}`);
  }
}
