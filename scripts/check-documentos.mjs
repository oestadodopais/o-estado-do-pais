#!/usr/bin/env node
/**
 * Portão dos documentos alojados e dos registos de conteúdo: o disco contra os
 * dois manifestos.
 *
 * Corre ANTES do `astro build`, porque o que ele confere é a origem e não a
 * saída: se os bytes de `studies-src/<slug>/<lingua>.html` já não são os que
 * foram instalados, não vale a pena construir por cima deles.
 *
 * **Corre sem rede e sem o motor presente**, de propósito: a construção acontece
 * num construtor remoto da Vercel onde o ResearchHub não existe. Uma conferência
 * que só funcionasse na máquina de quem exporta não seria uma conferência de
 * aceitação, seria o produtor a assinar por si próprio. A comparação com o lado
 * da ORIGEM é o modo `--with-origin`, que só corre onde o motor está em disco e
 * não entra no `npm run build` (o mesmo desenho do `check-cruzamento.mjs`).
 *
 * O QUE FALHA, e são três coisas nos documentos, cada uma um engano diferente:
 *
 *   1. RESUMO DIFERENTE — o ficheiro em disco não é o que o manifesto declara.
 *      Alguém editou um documento alojado. É a falha que este portão existe
 *      para apanhar: a promessa da casa é que um documento vai byte a byte
 *      como foi publicado, e uma promessa sem verificação é uma intenção.
 *   2. FICHEIRO ÓRFÃO — está em disco e não está no manifesto. Um documento
 *      sem linha de proveniência não é um documento alojado, é um ficheiro.
 *   3. LINHA ÓRFÃ — está no manifesto e não está em disco. O registo passou a
 *      dizer uma coisa que o disco não confirma.
 *
 * O que NÃO é conferido, e é honesto dizê-lo: `sha256_raw`. Não é reproduzível
 * — o anfitrião de artefactos injecta um runtime que muda sozinho, e os mesmos
 * bytes de autor dão descargas diferentes em semanas diferentes. Esse campo é
 * o registo do que foi descarregado, com os bytes guardados ao lado em `_raw/`
 * para quem quiser confrontá-lo. O invariante é `sha256_normalized`, e é esse
 * que este portão confere. Ver scripts/normalize-study.mjs.
 *
 * ---------------------------------------------------------------------------
 * OS REGISTOS DE CONTEÚDO (D1 a D6, 24.08.2026, parte 3 etapa P1)
 * ---------------------------------------------------------------------------
 *
 * Um registo de conteúdo é o texto de uma edição do motor partido em blocos,
 * com cada algarismo ligado à sua linha do livro-razão do motor. Atravessa por
 * `ResearchHub/publisher/export_records_site.py`, que escreve
 * `registos/<slug>/<lingua>.record.json`, o `.cortes.json` ao lado, e o registo
 * de travessia `registos/manifest.json`. Seis conferências, da mesma severidade
 * das três de cima, porque um registo é uma SEGUNDA CÓPIA do texto de um
 * documento e uma segunda cópia é exactamente a coisa que sai de passo em
 * silêncio:
 *
 *   D1  cada entrada do manifesto tem ficheiro, e o sha256 dos bytes é o
 *       `exported_record_sha256` — e é também o `origin_record_sha256`, porque
 *       o ficheiro atravessa byte a byte e dois resumos diferentes entre si são
 *       um manifesto a mentir;
 *   D2  nenhum ficheiro em `registos/` sem entrada no manifesto;
 *   D3  o `<lingua>.cortes.json` existe e bate com `exported_cortes_sha256`;
 *   D4  o `slug` é um trabalho de `src/data/studies.mjs` e a língua é uma
 *       edição declarada desse trabalho;
 *   D5  quando o documento alojado veio do motor, o `edicao_html_sha256` do
 *       registo é o `sha256_normalized` que o `studies-src/manifest.yml`
 *       declara. Quando os bytes alojados são um artefacto, NÃO CORRE, e o
 *       portão di-lo em voz alta a cada construção, com o ficheiro nomeado;
 *   D6  os `blocos` e as `referencias` que o manifesto promete são o que o
 *       ficheiro contém, recontados aqui.
 *
 * Este portão lê o manifesto com o SEU PRÓPRIO leitor, e não importa
 * `src/lib/registos.mjs`: uma conferência que usasse o código que as páginas
 * usam confirmava-se a si própria.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

import { WORKS } from '../src/data/studies.mjs';
import { LANGS } from '../src/lib/routes.mjs';
import { FICHEIRO_DA_EDICAO, todosOsDocumentos } from '../src/lib/documentos.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(ROOT, 'studies-src');
const MANIFESTO = path.join(SRC, 'manifest.yml');
/**
 * A pasta dos registos de conteúdo, com a mesma convenção de
 * `src/lib/registos.mjs`, do `gate-html.mjs` e do `check-cadeia.mjs`:
 * `OEDP_REGISTOS_DIR` aponta a leitura para outra pasta.
 *
 * Serve para uma coisa só, e é o que a regra da casa exige de uma conferência:
 * **provar que ela fecha sobre um estrago sem tocar num byte de `registos/`**. E
 * serve, com a mesma variável, para provar o contrário — que uma cópia com o
 * manifesto refeito passa aqui, byte a byte, e é o `check:cadeia` que apanha o
 * que lhe fizeram por dentro. Um resumo prende bytes; não prende sentido.
 */
const REGISTOS = process.env.OEDP_REGISTOS_DIR ?? path.join(ROOT, 'registos');
const MANIFESTO_REGISTOS = path.join(REGISTOS, 'manifest.json');
/** O que vive em `registos/` e não é um registo. */
const NAO_SAO_REGISTOS = new Set(['manifest.json', 'README.md']);

const comOrigem = process.argv.includes('--with-origin');
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const erros = [];
const err = (m) => erros.push(m);

/* ------------------------------------------------------------- manifesto -- */

if (!fs.existsSync(MANIFESTO)) {
  console.error(vermelho(`\n  PORTÃO DOS DOCUMENTOS — não existe ${path.relative(ROOT, MANIFESTO)}.\n`));
  process.exit(1);
}

const doc = load(fs.readFileSync(MANIFESTO, 'utf8')) ?? {};
const edicoes = doc.edicoes ?? [];
if (!Array.isArray(edicoes)) {
  console.error(vermelho('\n  PORTÃO DOS DOCUMENTOS — "edicoes" no manifesto não é uma lista.\n'));
  process.exit(1);
}

const OBRIGATORIOS = [
  'slug',
  'lang',
  'title',
  'raw_file',
  'fetched_utc',
  'bytes_raw',
  'bytes_normalized',
  'sha256_raw',
  'sha256_normalized',
];

/**
 * DE ONDE VIERAM OS BYTES — e há duas respostas possíveis, não uma.
 *
 * Até 2026-08-15 todos os documentos alojados eram artefactos do claude.ai, e
 * `artifact_url` era obrigatório. Os dois documentos de «Prometido, Pago,
 * Auditado» nunca foram artefactos: foram produzidos no motor de investigação
 * e atravessaram para cá como ficheiros. Não têm endereço de anfitrião, e
 * inventar-lhes um seria proveniência fabricada — exactamente o que este
 * portão existe para impedir.
 *
 * A regra passou a ser: **uma das duas, e pelo menos uma**.
 *
 *   artifact_url            o documento foi servido por um anfitrião externo;
 *   origin + origin_ref     o documento veio de outro sistema desta casa, e
 *                           `origin_ref` diz de onde, ao commit.
 *
 * Um documento com nenhuma das duas continua a parar o build, que é a
 * severidade que existia antes. Ver DECISIONS §1.31.
 */
const ORIGENS_CONHECIDAS = ['researchhub'];

const chaveDe = (e) => `${e.slug}/${e.lang}`;
const porChave = new Map();

for (const [i, e] of edicoes.entries()) {
  const onde = `edicoes[${i}]`;
  for (const campo of OBRIGATORIOS) {
    if (e[campo] === undefined || e[campo] === null || e[campo] === '') {
      err(`${onde}: falta o campo obrigatório "${campo}".`);
    }
  }
  /* A proveniência dos bytes: endereço de anfitrião, ou sistema de origem. */
  const temArtefacto = typeof e.artifact_url === 'string' && e.artifact_url.trim() !== '';
  const temOrigem = typeof e.origin === 'string' && e.origin.trim() !== '';
  if (!temArtefacto && !temOrigem) {
    err(
      `${onde}: falta a proveniência dos bytes. Ou "artifact_url" (documento servido por um ` +
        `anfitrião externo) ou "origin" + "origin_ref" (documento vindo de outro sistema desta ` +
        `casa). Um documento sem nenhuma das duas não se aloja.`,
    );
  }
  if (temArtefacto && temOrigem) {
    err(
      `${onde}: traz "artifact_url" e "origin" ao mesmo tempo. Os bytes vieram de um sítio só; ` +
        `declare esse.`,
    );
  }
  if (temOrigem) {
    if (!ORIGENS_CONHECIDAS.includes(e.origin)) {
      err(
        `${onde}: "origin" é "${e.origin}", que não é um sistema conhecido ` +
          `(${ORIGENS_CONHECIDAS.join(', ')}). Acrescente-o a este portão e diga porquê.`,
      );
    }
    if (typeof e.origin_ref !== 'string' || e.origin_ref.trim() === '') {
      err(
        `${onde}: tem "origin" sem "origin_ref". Dizer que os bytes vieram de outro sistema sem ` +
          `dizer de que ficheiro e de que commit não é proveniência.`,
      );
    }
  }

  if (!e.slug || !e.lang) continue;

  if (!LANGS.includes(e.lang)) {
    err(`${onde}: "${e.lang}" não é uma língua deste sítio (${LANGS.join(', ')}).`);
  }
  const work = WORKS.find((w) => w.slug === e.slug);
  if (!work) {
    err(`${onde}: "${e.slug}" não é o slug de nenhum trabalho de src/data/studies.mjs.`);
  } else if (!work.editions.some((ed) => ed.lang === e.lang)) {
    err(`${onde}: o trabalho "${e.slug}" não tem edição "${e.lang}" no arquivo.`);
  }
  if (typeof e.sha256_normalized === 'string' && !/^[0-9a-f]{64}$/.test(e.sha256_normalized)) {
    err(`${onde}: "sha256_normalized" não é um sha256 em hexadecimal minúsculo.`);
  }
  if (porChave.has(chaveDe(e))) {
    err(`${onde}: "${chaveDe(e)}" aparece mais do que uma vez no manifesto.`);
  }
  porChave.set(chaveDe(e), e);
}

/* ------------------------------------------------------ o disco, e a conta -- */

const emDisco = new Map(todosOsDocumentos().map((d) => [`${d.slug}/${d.lang}`, d]));

/* 1 — cada linha do manifesto tem ficheiro, e os bytes batem certo. */
for (const [chave, e] of porChave) {
  const d = emDisco.get(chave);
  if (!d) {
    err(
      `o manifesto declara "${chave}" mas não existe ` +
        `studies-src/${e.slug}/${FICHEIRO_DA_EDICAO[e.lang] ?? `${e.lang}.html`}.`,
    );
    continue;
  }
  const bytes = fs.readFileSync(d.ficheiro);
  const sha = crypto.createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== Number(e.bytes_normalized)) {
    err(
      `"${chave}": o ficheiro tem ${bytes.length} bytes e o manifesto declara ${e.bytes_normalized}.`,
    );
  }
  if (sha !== e.sha256_normalized) {
    err(
      `"${chave}": os bytes em disco não são os do manifesto.\n` +
        `      declarado: ${e.sha256_normalized}\n` +
        `      em disco:  ${sha}\n` +
        `      Um documento alojado é obra citada: se mudou, mudou por engano. Reponha-o a\n` +
        `      partir de studies-src/${e.raw_file} com scripts/normalize-study.mjs, ou\n` +
        `      declare a nova versão no manifesto — e diga porquê.`,
    );
  }
}

/* 2 — nenhum ficheiro em disco sem linha no manifesto. */
for (const [chave, d] of emDisco) {
  if (!porChave.has(chave)) {
    err(
      `existe ${path.relative(ROOT, d.ficheiro)} e não há linha nenhuma para "${chave}" no ` +
        `manifesto. Um documento sem proveniência declarada não se aloja.`,
    );
  }
}

/* 3 — os bytes brutos, que são a prova de sha256_raw, existem. */
for (const [chave, e] of porChave) {
  if (!e.raw_file) continue;
  const bruto = path.join(SRC, String(e.raw_file));
  if (!fs.existsSync(bruto)) {
    err(`"${chave}": o manifesto aponta para studies-src/${e.raw_file}, que não existe.`);
  }
}

/* ------------------------------------ os registos de conteúdo, D1 a D6 -- */

/* O leitor próprio deste portão. Não importa `src/lib/registos.mjs`: uma
   conferência que usasse o código que as páginas usam confirmava-se a si
   própria, e um defeito nesse ficheiro passaria pelos dois lados de uma vez. */
if (!fs.existsSync(MANIFESTO_REGISTOS)) {
  console.error(
    vermelho(
      `\n  PORTÃO DOS REGISTOS · não existe ${path.relative(ROOT, MANIFESTO_REGISTOS)}.\n` +
        `  Escreve-o o exportador do motor:\n` +
        `      python3 publisher/export_records_site.py --write\n`,
    ),
  );
  process.exit(1);
}

let registoDaTravessia;
try {
  registoDaTravessia = JSON.parse(fs.readFileSync(MANIFESTO_REGISTOS, 'utf8'));
} catch (erro) {
  console.error(
    vermelho(`\n  PORTÃO DOS REGISTOS · ${path.relative(ROOT, MANIFESTO_REGISTOS)} não é JSON legível: ${erro.message}\n`),
  );
  process.exit(1);
}
const entradasDoRegisto = registoDaTravessia?.registos;
if (!entradasDoRegisto || typeof entradasDoRegisto !== 'object') {
  console.error(
    vermelho(`\n  PORTÃO DOS REGISTOS · ${path.relative(ROOT, MANIFESTO_REGISTOS)} não traz um objecto "registos".\n`),
  );
  process.exit(1);
}

/** Os ficheiros que o manifesto promete, para o D2 saber o que é órfão. */
const prometidos = new Set([MANIFESTO_REGISTOS]);
/** Uma linha de relatório por registo, com o veredicto do D5 na cauda. */
const linhasDosRegistos = [];
let d5Correu = 0;
let d5NaoCorre = 0;

for (const [chave, e] of Object.entries(entradasDoRegisto)) {
  const corte = chave.lastIndexOf('/');
  const slug = corte > 0 ? chave.slice(0, corte) : chave;
  const lang = corte > 0 ? chave.slice(corte + 1) : '';
  const onde = `registos["${chave}"]`;
  const registo = path.join(REGISTOS, slug, `${lang}.record.json`);
  const cortes = path.join(REGISTOS, slug, `${lang}.cortes.json`);
  prometidos.add(registo);
  prometidos.add(cortes);

  /* D1 — o ficheiro existe, e os seus bytes são os dois resumos que o
     manifesto declara. Os dois, e não um: o de origem prova que o ficheiro é o
     do motor, o exportado prova que ninguém lhe tocou depois de chegar, e dois
     resumos diferentes entre si são um manifesto a mentir. */
  let bytesDoRegisto = null;
  if (!fs.existsSync(registo)) {
    err(
      `D1 ${onde}: o manifesto declara este registo e não existe ` +
        `${path.relative(ROOT, registo)}. Volte a atravessar: ` +
        `python3 publisher/export_records_site.py --write`,
    );
  } else {
    bytesDoRegisto = fs.readFileSync(registo);
    const sha = sha256(bytesDoRegisto);
    if (sha !== e.exported_record_sha256) {
      err(
        `D1 ${onde}: os bytes de ${path.relative(ROOT, registo)} não são os que atravessaram.\n` +
          `      declarado: ${e.exported_record_sha256}\n` +
          `      em disco:  ${sha}\n` +
          `      Um registo de conteúdo não se edita à mão: é uma segunda cópia do texto de\n` +
          `      um documento, e corrige-se no motor. Volte a atravessar.`,
      );
    }
    if (e.origin_record_sha256 !== e.exported_record_sha256) {
      err(
        `D1 ${onde}: o manifesto declara "origin_record_sha256" ${e.origin_record_sha256} e ` +
          `"exported_record_sha256" ${e.exported_record_sha256}. O registo atravessa byte a ` +
          `byte, e dois resumos diferentes entre si são o manifesto a dizer que não atravessou.`,
      );
    }
  }

  /* D3 — o ficheiro de operações da passagem de voz, ao lado do registo que
     fez. Um registo pós-voz sem a lista de operações que o fez é um documento
     sem a sua própria emenda. */
  if (!fs.existsSync(cortes)) {
    err(
      `D3 ${onde}: falta ${path.relative(ROOT, cortes)}, que são as operações da passagem de ` +
        `voz que fizeram este registo. Volte a atravessar.`,
    );
  } else {
    const sha = sha256(fs.readFileSync(cortes));
    if (sha !== e.exported_cortes_sha256) {
      err(
        `D3 ${onde}: os bytes de ${path.relative(ROOT, cortes)} não são os que atravessaram.\n` +
          `      declarado: ${e.exported_cortes_sha256}\n` +
          `      em disco:  ${sha}`,
      );
    }
    if (e.origin_cortes_sha256 !== e.exported_cortes_sha256) {
      err(
        `D3 ${onde}: o manifesto declara "origin_cortes_sha256" ${e.origin_cortes_sha256} e ` +
          `"exported_cortes_sha256" ${e.exported_cortes_sha256}, e o ficheiro atravessa byte a byte.`,
      );
    }
  }

  /* D4 — o arquivo do sítio é quem decide o que este sítio publica. */
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) {
    err(
      `D4 ${onde}: "${slug}" não é o slug de nenhum trabalho de src/data/studies.mjs. Um ` +
        `registo de um trabalho que o arquivo não tem não se serve.`,
    );
  } else if (!work.editions.some((ed) => ed.lang === lang)) {
    err(
      `D4 ${onde}: o trabalho "${slug}" não tem edição "${lang}" no arquivo. Um registo de ` +
        `uma edição que o arquivo não tem não se serve.`,
    );
  }

  /* D5 — a página de leitura e a edição arquivada são o mesmo documento, ou
     alguém sabe porque não são. Sem isto, o motor republica um `.html`, o sítio
     recebe os bytes novos e o registo fica velho em silêncio. */
  const documento = porChave.get(chave);
  let veredictoD5;
  if (!documento) {
    err(
      `D5 ${onde}: não há linha nenhuma para "${chave}" em studies-src/manifest.yml. Um ` +
        `registo de conteúdo de um documento que este sítio não aloja é uma página de ` +
        `leitura sem o documento de que é leitura.`,
    );
    veredictoD5 = 'o D5 não pôde correr: o sítio não aloja este documento';
    d5NaoCorre += 1;
  } else if (documento.origin === 'researchhub') {
    if (e.edicao_html_sha256 !== documento.sha256_normalized) {
      err(
        `D5 ${onde}: o registo e os bytes alojados são de versões diferentes do documento.\n` +
          `      o registo prova a edição:  ${e.edicao_html_sha256}\n` +
          `      o sítio aloja:             ${documento.sha256_normalized}\n` +
          `      Ou o motor republicou o .html e o registo ficou velho, ou o contrário. O\n` +
          `      remédio está em publisher/REGISTOS.md, «O ciclo de re-travessia».`,
      );
      veredictoD5 = 'o D5 correu e NÃO bateu';
    } else {
      veredictoD5 = 'o D5 correu e bate';
    }
    d5Correu += 1;
  } else {
    /* A exceção dita por extenso, e a cada construção. Um campo enterrado num
       manifesto é uma nota de rodapé; dito aqui, é uma coisa que quem constrói
       vê e pode ir conferir. */
    veredictoD5 =
      `o D5 não corre: os bytes alojados são um artefacto do claude.ai e a edição que o ` +
      `motor prova é «${e.edicao_html}», que o sítio não aloja (DECISIONS §1.64)`;
    d5NaoCorre += 1;
  }
  linhasDosRegistos.push(
    `"${chave}" · ${e.blocos} bloco(s) · ${e.referencias} referência(s) · ${veredictoD5}`,
  );

  /* D6 — o manifesto promete contagens, e as contagens recontam-se aqui. Um
     manifesto que promete 326 referências sobre um registo com 325 é um
     manifesto que ninguém está a ler. */
  if (bytesDoRegisto) {
    let doc = null;
    try {
      doc = JSON.parse(bytesDoRegisto.toString('utf8'));
    } catch (erro) {
      err(`D6 ${onde}: ${path.relative(ROOT, registo)} não é JSON legível: ${erro.message}`);
    }
    if (doc) {
      const blocos = Array.isArray(doc.blocks) ? doc.blocks : null;
      if (!blocos) {
        err(`D6 ${onde}: ${path.relative(ROOT, registo)} não traz uma lista "blocks".`);
      } else {
        if (blocos.length !== e.blocos) {
          err(
            `D6 ${onde}: o manifesto promete ${e.blocos} bloco(s) e o registo tem ` +
              `${blocos.length}.`,
          );
        }
        /* A soma percorre TODAS as unidades e não os géneros que este portão
           conhece: um género novo com figuras seria contado a menos, e uma
           contagem a menos passa despercebida. Um género que este portão não
           sabe percorrer pára a construção em vez de ser somado como zero. */
        const GENEROS = new Set(['heading', 'paragraph', 'list', 'table', 'rule', 'note']);
        let refs = 0;
        for (const b of blocos) {
          if (!GENEROS.has(b.kind)) {
            err(
              `D6 ${onde}: o bloco ${b.i} é do género "${b.kind}", que este portão não sabe ` +
                `percorrer. Uma contagem que salta um género é uma contagem a menos.`,
            );
            continue;
          }
          if (Array.isArray(b.figures)) refs += b.figures.length;
          for (const item of b.items ?? []) refs += (item.figures ?? []).length;
          for (const linha of b.rows ?? []) {
            for (const celula of linha) refs += (celula.figures ?? []).length;
          }
        }
        if (refs !== e.referencias) {
          err(
            `D6 ${onde}: o manifesto promete ${e.referencias} referência(s) e o registo tem ` +
              `${refs}.`,
          );
        }
      }
    }
  }
}

/* D2 — nenhum ficheiro em `registos/` sem entrada no manifesto: um registo de
   um estudo retirado que ficou para trás, ou uma pasta com um slug enganado. */
const varrer = (dir) => {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name.startsWith('.')) continue;
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      varrer(caminho);
      continue;
    }
    if (dir === REGISTOS && NAO_SAO_REGISTOS.has(entrada.name)) continue;
    if (!prometidos.has(caminho)) {
      err(
        `D2: existe ${path.relative(ROOT, caminho)} e o registo de travessia não o nomeia. ` +
          `Um registo de conteúdo sem entrada no manifesto não tem proveniência: ou ficou de ` +
          `uma edição retirada, ou o slug está enganado.`,
      );
    }
  }
};
varrer(REGISTOS);

/* O lado da ORIGEM, fora da construção de propósito: o construtor remoto não
   tem o motor em disco, e uma conferência que dependesse dele passaria a ser
   uma conferência do ambiente e não do conteúdo. */
let origem = null;
if (comOrigem) {
  const raizMotor = process.env.RESEARCHHUB_DIR
    ? path.resolve(process.env.RESEARCHHUB_DIR)
    : path.join(path.dirname(ROOT), 'ResearchHub');
  if (!fs.existsSync(raizMotor)) {
    origem = { correu: false, onde: raizMotor, lidos: 0 };
  } else {
    origem = { correu: true, onde: raizMotor, lidos: 0 };
    const cache = new Map();
    for (const [chave, e] of Object.entries(entradasDoRegisto)) {
      const caminho = path.join(raizMotor, 'content', e.rh_study ?? '', 'records.manifest.json');
      if (!cache.has(caminho)) {
        cache.set(
          caminho,
          fs.existsSync(caminho)
            ? { bytes: fs.readFileSync(caminho), doc: JSON.parse(fs.readFileSync(caminho, 'utf8')) }
            : null,
        );
      }
      const motor = cache.get(caminho);
      if (!motor) {
        err(`--with-origin: "${chave}": o motor não tem content/${e.rh_study}/records.manifest.json.`);
        continue;
      }
      if (sha256(motor.bytes) !== e.rh_manifest_sha256) {
        err(
          `--with-origin: "${chave}": o records.manifest.json de "${e.rh_study}" já não é o ` +
            `que atravessou (${sha256(motor.bytes)} contra ${e.rh_manifest_sha256}).`,
        );
      }
      const linha = (motor.doc.registos ?? []).find((r) => r.lang === e.rh_lang);
      if (!linha) {
        err(`--with-origin: "${chave}": o motor já não tem a edição "${e.rh_lang}" de "${e.rh_study}".`);
        continue;
      }
      origem.lidos += 1;
      if (linha.sha256 !== e.origin_record_sha256) {
        err(
          `--with-origin: "${chave}": o registo do motor tem o resumo ${linha.sha256} e o ` +
            `registo de travessia declara ${e.origin_record_sha256}. Volte a atravessar: ` +
            `python3 publisher/export_records_site.py --write`,
        );
      }
      if ((linha.voz?.operacoes_sha256 ?? null) !== e.origin_cortes_sha256) {
        err(
          `--with-origin: "${chave}": as operações do motor têm o resumo ` +
            `${linha.voz?.operacoes_sha256} e o registo de travessia declara ` +
            `${e.origin_cortes_sha256}.`,
        );
      }
    }
  }
}

/* ------------------------------------------------------------- relatório -- */

console.log('');
console.log(
  cinza(
    `  portão dos documentos · ${porChave.size} edição(ões) no manifesto · ` +
      `${emDisco.size} em disco`,
  ),
);

/* Uma edição que não veio pelo caminho normal diz-se em voz alta, a cada
   construção. Um campo `via` enterrado no manifesto é uma nota de rodapé; dito
   aqui, é uma coisa que quem constrói vê e pode ir conferir. */
for (const [chave, e] of porChave) {
  if (e.via) console.log(cinza(`    · "${chave}" entrou por «${e.via}» — ver DECISIONS §1.21`));
  if (e.origin) {
    console.log(cinza(`    · "${chave}" não é artefacto: veio de «${e.origin}» — ${e.origin_ref}`));
  }
}

/* Os registos de conteúdo, e o D5 dito em voz alta a cada construção. Uma
   edição cuja leitura ninguém pode amarrar aos bytes alojados é uma coisa que
   quem constrói tem de ver, e não um campo enterrado num manifesto. */
const nRegistos = Object.keys(entradasDoRegisto).length;
console.log(
  cinza(
    `  registos de conteúdo · ${nRegistos} atravessado(s) · ` +
      `D5 correu em ${d5Correu} e não corre em ${d5NaoCorre}`,
  ),
);
for (const linha of linhasDosRegistos) console.log(cinza(`    · ${linha}`));
if (comOrigem) {
  console.log(
    cinza(
      origem?.correu
        ? `    · --with-origin: ${origem.lidos} registo(s) conferidos contra o motor em ${origem.onde}`
        : `    · --with-origin: NÃO CORREU, o motor não está em ${origem?.onde}. ` +
          `Defina RESEARCHHUB_DIR se ele estiver noutro sítio.`,
    ),
  );
}

if (erros.length) {
  console.log('');
  console.error(vermelho(`  O PORTÃO DOS DOCUMENTOS FECHOU — ${erros.length} erro(s):`));
  console.error('');
  for (const m of erros) console.error('    ' + vermelho('✗') + ' ' + m);
  console.error('');
  process.exit(1);
}

console.log('');
console.log(
  '  ' +
    verde('✓') +
    ' cada documento alojado e cada registo de conteúdo são, byte a byte, o que o seu manifesto declara.',
);
console.log('');
