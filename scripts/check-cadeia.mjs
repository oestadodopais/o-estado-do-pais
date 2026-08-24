#!/usr/bin/env node
/**
 * A cadeia de cada algarismo de uma página de leitura, percorrida até onde ela
 * chega, e recusada quando não chega a lado nenhum.
 *
 * Corre DEPOIS do `gate:html`, sobre o `dist/` construído, e é o B4a do contrato
 * do motor: «um guião da construção do sítio que percorre, por estudo, a cadeia
 * do resumo do documento de origem até ao algarismo rendido». O plano é a
 * `design/especime-v3/ESTIMATIVA-PARTE3-2026-08-24.md` §4.
 *
 * ---------------------------------------------------------------------------
 * A CADEIA TEM DUAS FORMAS, E O GUIÃO DIZ AS DUAS EM VEZ DE FINGIR UMA
 * ---------------------------------------------------------------------------
 *
 * A §0.3 do plano mediu a restrição que manda no desenho: das 2 601 figuras das
 * oito edições com registo, só **196 têm linha no livro-razão deste sítio**, e
 * dessas 196, 119 imprimem no documento uma cadeia diferente da que a linha
 * guarda. Uma cadeia única, que exigisse linha do sítio a cada algarismo, seria
 * uma promessa falsa em 92 % dos casos.
 *
 *   CADEIA COMPLETA (196 figuras, medido)
 *     resumo de origem → linha do motor → linha do sítio → posição no registo
 *       → a marca `data-registo` na página → o selo, que abre a página da linha
 *
 *   CADEIA DO MOTOR (2 405 figuras, medido)
 *     resumo de origem → linha do motor → posição no registo
 *       → a marca `data-registo` na página → a porta, que abre a entrada em
 *         «As linhas deste documento» (a própria figura é a âncora; dentro de
 *         uma ligação do documento, onde uma âncora não aninha noutra, a porta
 *         vai imediatamente depois da ligação, como o selo)
 *
 * **2 405 e não 2 396**, e a diferença diz-se: o plano §4.1 escreve 2 396, que
 * são estas menos as 9 figuras cujas linhas do motor o manifesto de travessia do
 * MOTOR declara `excluded` com razão escrita. Deste lado da fronteira essas 9
 * não se distinguem das outras (o `ledger/cruzamentos/evora.json` não traz a
 * lista das excluídas, e as entradas do motor nomeiam padrões de linha em prosa),
 * e uma figura sem linha do sítio segue a cadeia do motor, seja qual for a razão
 * de não a ter.
 *
 * Um algarismo **sem nenhuma das duas** é erro, e é para não deixar passar isso
 * que este guião existe. Um algarismo com os seis passos até ao selo é cadeia
 * completa; até à entrada é cadeia do motor.
 *
 * ---------------------------------------------------------------------------
 * O LEITOR É PRÓPRIO, E É POR ISSO QUE A CONFERÊNCIA VALE
 * ---------------------------------------------------------------------------
 *
 * Não importa `src/lib/registos.mjs`, `src/lib/registo-html.mjs` nem
 * `src/lib/cruzamento.mjs`: uma conferência que usasse o código das páginas
 * confirmava-se a si própria, e um defeito nesses ficheiros passava pelos dois
 * lados ao mesmo tempo. É a mesma disciplina do `check-documentos.mjs` e do ramo
 * `verificaTexto()` do portão. O que importa é `src/lib/routes.mjs`, que é a
 * tabela de endereços da casa e não a coisa que aqui se prova, como o
 * `check-dados.mjs` já faz.
 *
 * **Corre sem rede e sem o motor em disco**, como todos os portões desta casa: a
 * construção acontece num construtor remoto onde o ResearchHub não existe.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESCREVE
 * ---------------------------------------------------------------------------
 *
 * Uma linha de guião por edição, os totais das oito chaves da prova, e
 * `dist/cadeia.json` com esses totais e os totais por edição, para a medição
 * cega e a leitura cruzada terem um ficheiro a comparar. **E mais nada**: não é
 * uma segunda cópia dos registos.
 *
 *   node scripts/check-cadeia.mjs
 *
 * `OEDP_REGISTOS_DIR` aponta a leitura para outra pasta de registos, com a mesma
 * convenção de `src/lib/registos.mjs` e do portão. Existe para se poder plantar
 * um estrago numa CÓPIA do registo sem tocar num byte de `registos/`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

import { routePath } from '../src/lib/routes.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');
const DIST = path.join(RAIZ, 'dist');
const REGISTOS = process.env.OEDP_REGISTOS_DIR ?? path.join(RAIZ, 'registos');
const CRUZAMENTOS = path.join(RAIZ, 'ledger', 'cruzamentos');
const CLAIMS = path.join(RAIZ, 'ledger', 'claims');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** Os cinco motivos da lista fechada do motor (`publisher/REGISTOS.md`, R7). */
const MOTIVOS = new Set([
  'portal-estatico',
  'pdf-sem-resumo',
  'raw-sem-manifesto',
  'derivado',
  'api-viva',
]);

/** Um resumo de origem: 64 hexadecimais minúsculos, e mais nada. */
const RESUMO = /^[0-9a-f]{64}$/;

const erros = [];
const err = (msg) => erros.push(msg);

/* ------------------------------------------------------------- os leitores -- */

/** O JSON de um ficheiro, ou a paragem: um ficheiro ilegível não é uma ausência. */
function leJson(ficheiro, oQueE) {
  let bruto;
  try {
    bruto = fs.readFileSync(ficheiro, 'utf8');
  } catch (erro) {
    console.error(vermelho(`\n  CADEIA · não consegui ler ${oQueE}: ${erro.message}\n`));
    process.exit(1);
  }
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    console.error(vermelho(`\n  CADEIA · ${oQueE} não é JSON legível: ${erro.message}\n`));
    process.exit(1);
  }
}

/**
 * As unidades de um bloco, com a coordenada da sua marca. A cópia deste guião.
 *
 * Um género de bloco que este leitor não saiba percorrer **pára**, em vez de ser
 * somado como zero: é a mesma regra do D6 do `check-documentos.mjs`, e a razão é
 * a mesma — um bloco calado conta como nenhum algarismo, e nenhum algarismo
 * passa em todas as conferências.
 */
function unidadesDoBloco(bloco, onde) {
  if (bloco.kind === 'heading' || bloco.kind === 'paragraph') return [{ unidade: bloco, coordenada: '' }];
  if (bloco.kind === 'list') {
    return (bloco.items ?? []).map((unidade, i) => ({ unidade, coordenada: `.${i}` }));
  }
  if (bloco.kind === 'table') {
    const saida = [];
    (bloco.rows ?? []).forEach((linha, r) => {
      linha.forEach((celula, c) => saida.push({ unidade: celula, coordenada: `.${r}.${c}` }));
    });
    return saida;
  }
  if (bloco.kind === 'rule') return [];
  console.error(
    vermelho(`\n  CADEIA · ${onde}: género de bloco desconhecido: "${bloco.kind}".\n`),
  );
  process.exit(1);
}

/**
 * O mapa `"<rh_study> <rh_id>" → <id da linha do sítio>`, do registo de travessia
 * das linhas. É o `row` escolhido que decide, e nunca os `others[]` de uma
 * figura: quem escolheu foi o exportador do motor, com mais contexto do que este
 * guião tem.
 */
function linhasDoSitio() {
  const mapa = new Map();
  if (!fs.existsSync(CRUZAMENTOS)) return mapa;
  for (const ficheiro of fs.readdirSync(CRUZAMENTOS).sort()) {
    if (!ficheiro.endsWith('.json')) continue;
    const doc = leJson(path.join(CRUZAMENTOS, ficheiro), `ledger/cruzamentos/${ficheiro}`);
    for (const [siteId, linha] of Object.entries(doc?.rows ?? {})) {
      if (linha?.rh_study && linha?.rh_id) mapa.set(`${linha.rh_study} ${linha.rh_id}`, siteId);
    }
  }
  return mapa;
}

/** O `value` de uma linha deste livro-razão, ou `null` se o ficheiro não existe. */
const LINHAS_LIDAS = new Map();
function linhaDoLivro(siteId) {
  if (LINHAS_LIDAS.has(siteId)) return LINHAS_LIDAS.get(siteId);
  const ficheiro = path.join(CLAIMS, `${siteId}.yml`);
  let linha = null;
  try {
    linha = load(fs.readFileSync(ficheiro, 'utf8')) ?? null;
  } catch {
    linha = null;
  }
  LINHAS_LIDAS.set(siteId, linha);
  return linha;
}

/* ---------------------------------------------------- a leitura da página -- */

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
const decodifica = (s) =>
  String(s).replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (todo, nome) => {
    if (nome in ENTIDADES) return ENTIDADES[nome];
    if (nome.startsWith('#x')) return String.fromCodePoint(parseInt(nome.slice(2), 16));
    if (nome.startsWith('#')) return String.fromCodePoint(Number(nome.slice(1)));
    return todo;
  });

const atributo = (el, nome) => decodifica(el?.getAttribute?.(nome) ?? '');

/**
 * O texto que um elemento imprime, pela ordem em que o leitor o vê.
 *
 * Salta o selo (`.src-chip`) inteiro, que é a única mobília da casa com texto
 * dentro de uma unidade transcrita, e salta o que não é texto. É a mesma regra
 * declarada da leitura do olho, escrita aqui outra vez de propósito: este guião
 * não importa `src/lib/eyetext.mjs`.
 */
function textoImpresso(el) {
  let saida = '';
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === 3) {
      saida += n.text;
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (String(n.getAttribute('class') ?? '').split(/\s+/).includes('src-chip')) return;
    for (const filho of n.childNodes ?? []) anda(filho);
  };
  for (const filho of el?.childNodes ?? []) anda(filho);
  return saida;
}

/** O nó de elemento seguinte, sem saltar por cima de texto: a regra do colado. */
function irmaoColado(el) {
  return irmaosColados(el)[0] ?? null;
}

/**
 * Os elementos irmãos COLADOS a este, em ordem, até ao primeiro nó de texto.
 *
 * Uma ligação do documento pode ter várias figuras lá dentro, e as saídas de
 * todas vêm a seguir a ela, na ordem das figuras: a k-ésima saída colada à
 * ligação é a da k-ésima figura que ela contém, selos e portas intercalados.
 */
function irmaosColados(el) {
  const pai = el?.parentNode;
  if (!pai) return [];
  const filhos = pai.childNodes ?? [];
  const irmaos = [];
  for (let k = filhos.indexOf(el) + 1; k < filhos.length; k++) {
    const n = filhos[k];
    if (n.nodeType === 3) {
      if (n.rawText === '') continue;
      return irmaos;
    }
    if (n.nodeType === 1) irmaos.push(n);
  }
  return irmaos;
}

const temClasse = (n, classe) =>
  Boolean(n) && String(n.getAttribute?.('class') ?? '').split(/\s+/).includes(classe);

const eSelo = (n) =>
  Boolean(n) && String(n.rawTagName ?? '').toLowerCase() === 'a' && temClasse(n, 'src-chip');

/**
 * A porta que vai a seguir a uma ligação do documento: a saída de uma figura que
 * está dentro de uma ligação e por isso não pode ser ela própria a âncora. Não
 * tem texto: o glifo é da folha de estilos.
 */
const ePortaAposALigacao = (n) =>
  Boolean(n) &&
  String(n.rawTagName ?? '').toLowerCase() === 'a' &&
  temClasse(n, 'texto-figura-porta-apos');

/** A ligação do próprio documento que contém esta figura, se houver alguma. */
function ligacaoDoDocumento(el, artigo) {
  let n = el.parentNode;
  while (n && n !== artigo) {
    if (String(n.rawTagName ?? '').toLowerCase() === 'a' && !ePortaAposALigacao(n)) return n;
    n = n.parentNode;
  }
  return null;
}

/* --------------------------------------------------------------- a travessia */

const manifesto = leJson(path.join(REGISTOS, 'manifest.json'), `${path.relative(RAIZ, REGISTOS)}/manifest.json`);
const travessia = manifesto?.registos;
if (!travessia || typeof travessia !== 'object') {
  console.error(
    vermelho(`\n  CADEIA · o registo de travessia dos registos não traz um objecto "registos".\n`),
  );
  process.exit(1);
}
if (!fs.existsSync(DIST)) {
  console.error(
    vermelho(
      `\n  CADEIA · não existe dist/. Este guião corre sobre o que foi construído: ` +
        `npm run build.\n`,
    ),
  );
  process.exit(1);
}

const DO_MOTOR = linhasDoSitio();

/**
 * A ETIQUETA CURTA DE UMA EDIÇÃO, que é como o motor lhe chama: «04 pt».
 *
 * O número é o do estudo do motor (`rh_study`, «04 Évora Public Money») e a
 * língua é a da edição deste sítio. Se duas edições dessem a mesma etiqueta, a
 * etiqueta deixava de nomear uma coisa só, e todas passam a ser a chave inteira.
 */
const chaves = Object.keys(travessia).sort();
const etiquetas = new Map();
for (const chave of chaves) {
  const corte = chave.lastIndexOf('/');
  const numero = /^(\d+)\b/.exec(String(travessia[chave]?.rh_study ?? ''));
  etiquetas.set(chave, numero ? `${numero[1]} ${chave.slice(corte + 1)}` : chave);
}
if (new Set(etiquetas.values()).size !== chaves.length) {
  for (const chave of chaves) etiquetas.set(chave, chave);
}

const totais = {
  registos_edicoes: 0,
  registos_blocos: 0,
  registos_algarismos: 0,
  registos_resolvidos: 0,
  registos_por_resolver: 0,
  registos_com_linha_do_sitio: 0,
  registos_com_resumo_de_origem: 0,
  registos_sem_resumo_de_origem: 0,
};
/* A §0.3 do plano, recontada aqui: das figuras com linha do sítio, quantas
   imprimem o valor que a linha guarda e quantas imprimem outra cadeia. Não é
   erro nenhum, e é a medição que decidiu o desenho desta página. */
const contraOLivro = { igual: 0, diverge: 0 };
const porEdicao = {};
const guiao = [];

for (const chave of chaves) {
  const entrada = travessia[chave];
  const corte = chave.lastIndexOf('/');
  const slug = chave.slice(0, corte);
  const lang = chave.slice(corte + 1);
  const registo = leJson(
    path.join(REGISTOS, slug, `${lang}.record.json`),
    `${path.relative(RAIZ, REGISTOS)}/${slug}/${lang}.record.json`,
  );

  const rota = routePath('texto', lang, { slug });
  const ficheiro = path.join(DIST, rota.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(ficheiro)) {
    err(
      `C5 ${chave}: o registo de travessia declara esta edição e não há página de leitura ` +
        `construída em ${path.relative(RAIZ, ficheiro)}.`,
    );
    continue;
  }
  const pagina = parse(fs.readFileSync(ficheiro, 'utf8'), { comment: false });
  const artigo = pagina.querySelector('[data-registo-edicao]');
  if (!artigo) {
    err(`C5 ${chave}: a página construída não tem o corpo transcrito (data-registo-edicao).`);
    continue;
  }

  /* As marcas da página, pela coordenada, e as entradas de «As linhas deste
     documento», pelo id. Uma marca que sobre no fim é uma figura que a página
     inventou, e fecha no passo 5. */
  const marcasDaPagina = new Map();
  for (const el of artigo.querySelectorAll('[data-registo]')) {
    const marca = atributo(el, 'data-registo');
    if (marcasDaPagina.has(marca)) {
      err(`C5 ${marca}: a página rende esta coordenada mais do que uma vez.`);
      continue;
    }
    marcasDaPagina.set(marca, el);
  }
  const seccao = pagina.querySelector('#linhas-do-documento');
  const entradasDasLinhas = new Set(
    (seccao?.querySelectorAll('[id^="linha-"]') ?? []).map((e) => atributo(e, 'id')),
  );

  const conta = {
    etiqueta: etiquetas.get(chave),
    blocos: registo?.blocks?.length ?? 0,
    algarismos: 0,
    completas: 0,
    do_motor: 0,
    por_resolver: 0,
    com_resumo_de_origem: 0,
    com_motivo: 0,
  };
  totais.registos_edicoes++;
  totais.registos_blocos += conta.blocos;

  for (const bloco of registo?.blocks ?? []) {
    for (const { unidade, coordenada } of unidadesDoBloco(bloco, chave)) {
      const texto = [...String(unidade.text ?? '')];
      const figuras = unidade.figures ?? [];
      for (let f = 0; f < figuras.length; f++) {
        const figura = figuras[f];
        const marca = `${chave}#${bloco.i}${coordenada}.${f}`;
        conta.algarismos++;
        totais.registos_algarismos++;

        /* A marca da página sai da lista aqui, e não no passo 5: uma figura que
           tropece num passo anterior continua a ser uma figura desta
           coordenada, e deixá-la na lista fazia o passo 5 queixar-se ao
           contrário, de uma marca a mais que a página não inventou. */
        const el = marcasDaPagina.get(marca) ?? null;
        marcasDaPagina.delete(marca);

        /* ------------------------------------------------------- passo 1 ---
           O resumo de origem: o resumo dos bytes do documento de onde a linha
           saiu, OU o motivo de não haver um. É o R7 do motor lido deste lado, e
           os dois ao mesmo tempo é o formato a dizer duas coisas. */
        const sha = figura.source_sha256;
        const motivo = figura.source_digest_kind;
        if (sha !== null && sha !== undefined && motivo !== null && motivo !== undefined) {
          err(
            `C1 ${marca}: a figura traz resumo de origem E motivo ("${motivo}"), e o formato do ` +
              `motor deixa ter um só.`,
          );
        } else if (sha !== null && sha !== undefined) {
          if (!RESUMO.test(String(sha))) {
            err(
              `C1 ${marca}: o resumo de origem não são 64 hexadecimais minúsculos: ` +
                `${JSON.stringify(sha)}.`,
            );
          } else if (!figura.source_digest_em) {
            err(
              `C1 ${marca}: a figura traz resumo de origem e não diz de que ficheiro ele é ` +
                `(source_digest_em). Um resumo sem o ficheiro que ele resume não abre nada.`,
            );
          } else {
            conta.com_resumo_de_origem++;
            totais.registos_com_resumo_de_origem++;
          }
        } else if (motivo === null || motivo === undefined) {
          err(
            `C1 ${marca}: a figura não traz resumo de origem nem motivo. O formato do motor ` +
              `exige um dos dois, e sem nenhum a cadeia não tem princípio.`,
          );
        } else if (!MOTIVOS.has(motivo)) {
          err(
            `C1 ${marca}: o motivo ${JSON.stringify(motivo)} não é um dos cinco da lista fechada ` +
              `do motor (${[...MOTIVOS].join(', ')}).`,
          );
        } else {
          conta.com_motivo++;
          totais.registos_sem_resumo_de_origem++;
        }

        /* ------------------------------------------------------- passo 2 ---
           A linha do motor. Sem ela não há cadeia nenhuma: é o algarismo a
           aparecer numa página sem nada que o bata. */
        if (!figura.row) {
          err(
            `C2 ${marca}: a figura não tem linha do motor (o campo "row" está vazio), e sem ` +
              `ela o algarismo não tem nada que o bata.`,
          );
          conta.por_resolver++;
          totais.registos_por_resolver++;
        } else {
          totais.registos_resolvidos++;
        }

        /* ------------------------------------------------------- passo 3 ---
           A linha do sítio, se houver. É o registo de travessia das linhas que
           responde, e é ele que decide qual das duas formas a cadeia tem. Sem
           linha do motor não há esta pergunta: o passo 2 já disse o que há a
           dizer, e inventar aqui uma segunda queixa a partir da primeira não
           acrescentava nada. */
        const siteId = figura.row
          ? (DO_MOTOR.get(`${entrada.rh_study} ${figura.row}`) ?? null)
          : null;
        if (siteId) {
          const linha = linhaDoLivro(siteId);
          if (!linha) {
            err(
              `C3 ${marca}: a linha do motor "${figura.row}" tem linha neste livro-razão ` +
                `("${siteId}") e ledger/claims/${siteId}.yml não existe ou não é legível.`,
            );
          } else if (typeof linha.value !== 'string') {
            err(
              `C3 ${marca}: ledger/claims/${siteId}.yml não declara um "value" em cadeia, e é ` +
                `contra ele que se mede o que este documento imprime.`,
            );
          } else if (linha.value === figura.printed) {
            contraOLivro.igual++;
          } else {
            contraOLivro.diverge++;
          }
          conta.completas++;
          totais.registos_com_linha_do_sitio++;
        } else if (figura.row) {
          conta.do_motor++;
        }

        /* ------------------------------------------------------- passo 4 ---
           A posição no registo: o bloco, a unidade, o índice da figura, e o
           texto entre as duas fronteiras. Em pontos de código, que é como o
           motor as conta. */
        if (
          !Number.isInteger(figura.start) ||
          !Number.isInteger(figura.end) ||
          figura.start < 0 ||
          figura.end > texto.length ||
          figura.start >= figura.end
        ) {
          err(
            `C4 ${marca}: a figura cobre [${figura.start}, ${figura.end}) e o texto desta ` +
              `unidade tem ${texto.length} caracteres.`,
          );
        } else {
          const noRegisto = texto.slice(figura.start, figura.end).join('');
          if (noRegisto !== figura.printed) {
            err(
              `C4 ${marca}: entre [${figura.start}, ${figura.end}) o texto da unidade diz ` +
                `${JSON.stringify(noRegisto)} e a figura diz que este documento imprime ` +
                `${JSON.stringify(figura.printed)}.`,
            );
          }
        }

        /* ------------------------------------------------------- passo 5 ---
           A marca na página rendida, com o `printed` lá dentro. */
        if (!el) {
          err(
            `C5 ${marca}: a página construída não tem nenhuma marca data-registo com esta ` +
              `coordenada, e um algarismo sem marca não tem origem declarada.`,
          );
          continue;
        }
        const impresso = textoImpresso(el);
        if (impresso !== figura.printed) {
          err(
            `C5 ${marca}: a marca da página imprime ${JSON.stringify(impresso)} e o registo diz ` +
              `que este documento imprime ${JSON.stringify(figura.printed)}.`,
          );
        }

        /* ------------------------------------------------------- passo 6 ---
           A saída. Com linha do sítio, o selo colado, que abre a página dessa
           linha; sem linha do sítio, a porta para a entrada em «As linhas deste
           documento». Sem linha do motor não há saída nenhuma a exigir: o passo
           2 já fechou.

           DENTRO DE UMA LIGAÇÃO DO DOCUMENTO, A SAÍDA VAI A SEGUIR À LIGAÇÃO,
           e é a gémea da regra do selo: uma âncora não aninha noutra, e por isso
           nem o selo nem a porta podem ficar dentro da ligação. A ordem é a das
           figuras (a k-ésima saída colada à ligação é a da k-ésima figura que
           ela contém), e a posição lê-se da própria página, para que uma marca
           em falta não desalinhe as saídas das figuras seguintes. Até 24.08.2026
           este passo aceitava, dentro de uma ligação, só a entrada da linha; a
           primeira leitura cruzada mostrou que isso deixava 42 figuras sem porta
           própria, e a ronda de correções 1 fechou-o. */
        if (!figura.row) continue;
        const dentroDeLigacao = ligacaoDoDocumento(el, artigo);
        let irmao;
        if (dentroDeLigacao) {
          const naLigacao = dentroDeLigacao.querySelectorAll('[data-registo]');
          const k = naLigacao.indexOf(el);
          irmao = irmaosColados(dentroDeLigacao)[k] ?? null;
        } else {
          irmao = irmaoColado(el);
        }
        if (siteId) {
          if (!eSelo(irmao)) {
            err(
              `C6 ${marca}: a figura tem linha no livro-razão ("${siteId}") e não tem selo colado ` +
                `a seguir, que é a saída da cadeia completa.`,
            );
          } else {
            const porta = atributo(irmao, 'href');
            const esperada = routePath('linha', lang, { slug: siteId });
            if (porta !== esperada) {
              err(`C6 ${marca}: o selo abre "${porta}" e a página desta linha é "${esperada}".`);
            }
          }
        } else {
          if (eSelo(irmao)) {
            err(
              `C6 ${marca}: a figura NÃO tem linha no livro-razão deste sítio e leva um selo ao ` +
                `lado, que promete uma linha que não existe.`,
            );
          }
          const destino = `#linha-${figura.row}`;
          if (dentroDeLigacao) {
            if (!ePortaAposALigacao(irmao)) {
              err(
                `C6 ${marca}: a figura está dentro de uma ligação do documento e não tem a porta ` +
                  `a seguir à ligação, que é a saída da cadeia do motor onde uma âncora não pode ` +
                  `aninhar noutra.`,
              );
            } else {
              const href = atributo(irmao, 'href');
              if (href !== destino) {
                err(
                  `C6 ${marca}: a porta que vai a seguir à ligação abre "${href}" e a entrada ` +
                    `desta figura é "${destino}".`,
                );
              }
            }
          } else {
            const eAncora = String(el.rawTagName ?? '').toLowerCase() === 'a';
            const href = atributo(el, 'href');
            if (!eAncora || href !== destino) {
              err(
                `C6 ${marca}: a figura não tem linha no livro-razão e a sua porta abre ` +
                  `${eAncora ? `"${href}"` : 'nada'} em vez de "${destino}".`,
              );
            }
          }
          if (!entradasDasLinhas.has(`linha-${figura.row}`)) {
            err(
              `C6 ${marca}: a linha do motor "${figura.row}" não tem entrada em «As linhas deste ` +
                `documento» (id="linha-${figura.row}"), que é onde esta cadeia acaba.`,
            );
          }
        }
      }
    }
  }

  /* O passo 5 ao contrário: uma marca que a página tem e o registo não. */
  for (const marca of marcasDaPagina.keys()) {
    err(
      `C5 ${marca}: a página rende esta marca data-registo e o registo não tem figura nenhuma ` +
        `nessa coordenada.`,
    );
  }

  porEdicao[chave] = conta;
  guiao.push(
    `  ${conta.etiqueta} · ${conta.blocos} blocos · ${conta.algarismos} algarismos · ` +
      `${conta.completas} completas · ${conta.do_motor} do motor · ` +
      `${conta.por_resolver} por resolver · ${conta.com_resumo_de_origem} com resumo de origem · ` +
      `${conta.com_motivo} com motivo`,
  );
}

/* ------------------------------------------------------------- o relatório -- */

console.log('');
for (const linha of guiao) console.log(cinza(linha));
console.log('');
console.log(cinza('  as oito chaves da prova, contadas aqui:'));
for (const [chave, valor] of Object.entries(totais)) {
  console.log(cinza(`    ${chave.padEnd(30)} ${String(valor).padStart(6)}`));
}
console.log('');
console.log(
  cinza(
    `  das ${totais.registos_com_linha_do_sitio} figuras com linha do sítio, ` +
      `${contraOLivro.igual} imprimem o valor que a linha guarda e ${contraOLivro.diverge} ` +
      `imprimem outra cadeia. Não é erro: é a medição que decidiu esta página (plano §0.3).`,
  ),
);

/* `dist/cadeia.json`: os totais e os totais por edição, e mais nada. */
const documento = {
  _: [
    'A cadeia de cada algarismo das páginas de leitura. FICHEIRO GERADO por',
    'scripts/check-cadeia.mjs, no fim de uma travessia sem erros. Traz os totais',
    'das oito chaves e os totais por edição, para se poderem comparar de fora.',
    'Não é uma segunda cópia dos registos. Ver DECISIONS.md §1.64, P3.',
  ],
  totais,
  linha_do_sitio: {
    figuras: totais.registos_com_linha_do_sitio,
    imprimem_o_valor_da_linha: contraOLivro.igual,
    imprimem_outra_cadeia: contraOLivro.diverge,
  },
  por_edicao: porEdicao,
};

if (erros.length) {
  console.log('');
  console.error(vermelho(`  A CADEIA PARTE-SE — ${erros.length} erro(s):`));
  console.error('');
  for (const e of erros.slice(0, 40)) console.error('    ' + vermelho('✗') + ' ' + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}.`));
  console.error('');
  process.exit(1);
}

fs.writeFileSync(
  path.join(DIST, 'cadeia.json'),
  JSON.stringify(documento, null, 2) + '\n',
  'utf8',
);

console.log('');
console.log(
  '  ' +
    verde('✓') +
    ' cada algarismo das páginas de leitura chega ao fim da sua cadeia: ' +
    `${totais.registos_com_linha_do_sitio} até ao selo, ` +
    `${totais.registos_algarismos - totais.registos_com_linha_do_sitio} até à entrada do motor.`,
);
console.log('');
