/**
 * Os documentos dos estudos: obras já publicadas, alojadas aqui INTACTAS.
 *
 * Um estudo migrado tem duas coisas neste sítio:
 *
 *   /estudos/<slug>            — a página do observatório sobre o estudo,
 *                                escrita por nós, com a disciplina da casa;
 *   /estudos/<slug>/documento  — o documento original, tal como foi publicado.
 *
 * Este módulo trata do segundo. A regra é uma só e não tem excepções:
 *
 *   ****  O DOCUMENTO NÃO É REESCRITO. É-LHE ACRESCENTADA UMA FAIXA, E MAIS   ****
 *   ****  NADA. Nem <head>, nem estilos, nem scripts, nem uma vírgula abaixo   ****
 *   ****  da faixa.                                                           ****
 *
 * O que a faixa é: a marca do observatório, ligada de volta à página do estudo,
 * uma nota a dizer o que o leitor está a ver, e a linha de autoria da casa. CSS
 * embebido, nenhum pedido de rede, e — regra imposta pelo portão — **nenhum
 * algarismo no seu texto**. A faixa é moldura; os algarismos que o leitor vir
 * abaixo dela são do documento, não nossos.
 *
 * COMO SE PÕE UM DOCUMENTO NO SÍTIO (o processo inteiro):
 *
 *   1. `studies-src/<slug>/pt.html` — o ficheiro auto-contido, tal e qual;
 *      `en.html` para a edição inglesa. O `<slug>` tem de ser o de um trabalho
 *      de src/data/studies.mjs, e a língua tem de ser uma edição desse trabalho;
 *   2. `npm run build`.
 *
 * Não há passo 3. A rota, a ligação na página do estudo e a verificação do
 * portão saem daí sozinhas — se o ficheiro existe, o endereço existe.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { WORKS, workById } from '../data/studies.mjs';
import { routePath, LANGS } from './routes.mjs';
import { SITE_NAME, AUTHORSHIP_LINE } from '../../site.config.mjs';
import { t } from '../i18n/strings.mjs';

/** O nome do ficheiro de cada edição, dentro de `studies-src/<slug>/`. */
export const FICHEIRO_DA_EDICAO = { pt: 'pt.html', en: 'en.html' };

/**
 * Onde estão os documentos de origem.
 *
 * Procura-se a subir, como o livro-razão faz e pela mesma razão: no build este
 * módulo é empacotado para dentro de dist/, e um caminho relativo a este
 * ficheiro passaria a apontar para o sítio errado.
 */
function encontraOrigem() {
  const candidatos = [];
  if (process.env.OEDP_STUDIES_DIR) candidatos.push(process.env.OEDP_STUDIES_DIR);

  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'studies-src'));
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

export const STUDIES_SRC_DIR = encontraOrigem();

/**
 * Todos os documentos que existem em disco, com a rota onde vão ser servidos.
 *
 * Falha — e o build pára — se encontrar um documento que o arquivo não conhece:
 * uma pasta com um slug que não é de nenhum trabalho, um ficheiro numa língua
 * em que o trabalho não tem edição, ou um nome de ficheiro que não é `pt.html`
 * nem `en.html`. Um documento órfão é um engano, não uma funcionalidade.
 *
 * @returns {{ slug: string, lang: string, ficheiro: string, rota: string }[]}
 */
export function todosOsDocumentos() {
  if (!STUDIES_SRC_DIR) return [];
  const out = [];
  const nomesValidos = new Set(Object.values(FICHEIRO_DA_EDICAO));

  for (const entrada of fs.readdirSync(STUDIES_SRC_DIR, { withFileTypes: true })) {
    if (!entrada.isDirectory()) continue; // o README da pasta, e mais nada
    const slug = entrada.name;
    const work = WORKS.find((w) => w.slug === slug);
    if (!work) {
      throw new Error(
        `documentos: "studies-src/${slug}/" não corresponde a nenhum trabalho de ` +
          `src/data/studies.mjs.\n  Slugs aceites: ${WORKS.map((w) => w.slug).join(', ')}`,
      );
    }

    for (const ficheiro of fs.readdirSync(path.join(STUDIES_SRC_DIR, slug))) {
      if (ficheiro.startsWith('.')) continue;
      if (!nomesValidos.has(ficheiro)) {
        throw new Error(
          `documentos: "studies-src/${slug}/${ficheiro}" não é um nome de documento. ` +
            `Só ${[...nomesValidos].join(' e ')} — um ficheiro por edição.`,
        );
      }
      const lang = LANGS.find((l) => FICHEIRO_DA_EDICAO[l] === ficheiro);
      if (!work.editions.some((e) => e.lang === lang)) {
        throw new Error(
          `documentos: "studies-src/${slug}/${ficheiro}" é a edição "${lang}" de um trabalho ` +
            `que não tem essa edição no arquivo. Ou o arquivo está incompleto, ou o ficheiro ` +
            `está na pasta errada.`,
        );
      }
      out.push({
        slug,
        lang,
        ficheiro: path.join(STUDIES_SRC_DIR, slug, ficheiro),
        rota: routePath('documento', lang, { slug }),
      });
    }
  }

  return out.sort((a, b) => (a.slug + a.lang).localeCompare(b.slug + b.lang));
}

/** Os documentos de um estudo. É isto que a página do estudo pergunta. */
export function documentosDoEstudo(slug) {
  return todosOsDocumentos().filter((d) => d.slug === slug);
}

/** O documento de uma edição, ou null. */
export function documentoDaEdicao(slug, lang) {
  return todosOsDocumentos().find((d) => d.slug === slug && d.lang === lang) ?? null;
}

/* ------------------------------------------------------------------- faixa */

/** Escape de atributo. Os slugs são [a-z0-9-], mas nada aqui confia nisso. */
function atributo(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function texto(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * O CSS da faixa.
 *
 * Auto-contido e sem um único pedido de rede: pilhas de tipos do sistema, como
 * em todo o sítio. Selectores por atributo, com o prefixo `oedp-`, para não
 * colidirem com o que quer que o documento tenha.
 *
 * A faixa é escura em qualquer tema — não segue o `prefers-color-scheme` do
 * leitor. É deliberado: o documento por baixo tem o fundo que tiver, e uma
 * moldura que muda de cor com o tema podia desaparecer contra ele. Esta lê-se
 * sempre, e diz sempre a mesma coisa: daqui para baixo, o documento não é meu.
 *
 * O amarelo da casa não aparece aqui. O amarelo marca medição; isto é mobília.
 */
const CSS_FAIXA = `
[data-oedp-faixa]{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 18px;margin:0;padding:9px 20px;border:0;border-bottom:1px solid #3a4049;background:#16181b;color:#eaecf0;font-family:ui-monospace,'SF Mono',SFMono-Regular,Menlo,Monaco,'Cascadia Mono','Roboto Mono',Consolas,monospace;font-size:11px;font-weight:400;font-style:normal;line-height:1.5;letter-spacing:.05em;text-align:left;text-transform:none;position:relative;width:auto;max-width:none;min-height:0}
[data-oedp-faixa] a{color:#fafbfc;background:none;border:0;padding:0;text-decoration:none;font-weight:inherit}
[data-oedp-faixa] a:hover{text-decoration:underline;text-underline-offset:3px}
[data-oedp-faixa] a:focus-visible{outline:2px solid #fafbfc;outline-offset:3px}
[data-oedp-faixa] span{background:none;border:0;padding:0;margin:0}
[data-oedp-marca]{font-family:'Iowan Old Style','Palatino','Palatino Linotype','Book Antiqua','URW Palladio L',Georgia,'Times New Roman',serif;font-size:17px;letter-spacing:-.01em;line-height:1.2}
[data-oedp-nota],[data-oedp-autoria]{color:#969ca6}
[data-oedp-voltar]{margin-left:auto}
@media (max-width:640px){[data-oedp-voltar]{margin-left:0}}
`.trim();

/**
 * A faixa, para um estudo e uma língua.
 *
 * NENHUM ALGARISMO no texto — o portão de HTML confere-o, e é essa regra que
 * permite dispensar o corpo do documento do varrimento sem abrir uma porta.
 * Os algarismos do CSS são estilo, não texto, e o portão não os conta.
 */
export function faixa(slug, lang) {
  const s = t(lang);
  const destino = routePath('estudo', lang, { slug });
  return [
    '<div data-oedp-faixa>',
    `<style>${CSS_FAIXA}</style>`,
    `<a data-oedp-marca href="${atributo(destino)}">${texto(SITE_NAME)}</a>`,
    `<span data-oedp-nota>${texto(s.estudos.documentoFaixa)}</span>`,
    `<span data-oedp-autoria lang="pt-PT">${texto(AUTHORSHIP_LINE)}</span>`,
    `<a data-oedp-voltar href="${atributo(destino)}">${texto(s.estudos.documentoVoltar)} ↑</a>`,
    '</div>',
  ].join('');
}

/**
 * O documento com a faixa por cima. A ÚNICA transformação que este sítio faz a
 * um documento de estudo.
 *
 * A faixa entra logo a seguir ao `<body>`, que é o único sítio onde não
 * atravessa nada: acima dela fica o `<head>` do documento, intacto; abaixo,
 * o documento inteiro, byte a byte.
 *
 * @param {string} bruto o ficheiro tal como está em studies-src/
 * @param {{ slug: string, lang: string }} onde
 */
export function comFaixa(bruto, { slug, lang }) {
  const marca = faixa(slug, lang);

  const corpo = bruto.match(/<body[^>]*>/i);
  if (corpo && corpo.index !== undefined) {
    const i = corpo.index + corpo[0].length;
    return bruto.slice(0, i) + marca + bruto.slice(i);
  }

  const cabeca = bruto.match(/<\/head\s*>/i);
  if (cabeca && cabeca.index !== undefined) {
    const i = cabeca.index + cabeca[0].length;
    return bruto.slice(0, i) + marca + bruto.slice(i);
  }

  throw new Error(
    `documentos: o documento "${slug}" (${lang}) não tem <body> nem </head>, e a faixa não ` +
      `sabe onde entrar. Um documento de estudo é um ficheiro HTML completo e auto-contido.`,
  );
}

/**
 * O que é servido em `/estudos/<slug>/documento`.
 * É também o que o portão recalcula para conferir que o que foi construído é o
 * documento de origem mais a faixa, e nada mais.
 */
export function documentoServido(slug, lang) {
  const doc = documentoDaEdicao(slug, lang);
  if (!doc) {
    throw new Error(`documentos: não há documento para "${slug}" na edição "${lang}".`);
  }
  if (!workById(slug)) {
    throw new Error(`documentos: "${slug}" não é um trabalho do arquivo.`);
  }
  return comFaixa(fs.readFileSync(doc.ficheiro, 'utf8'), { slug, lang });
}
