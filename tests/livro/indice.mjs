#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DOS NOMES, DAS DATAS E DO ÍNDICE (bloco F1.4, 04.09.2026)
 * =============================================================================
 *
 * Uma célula por medida de aceitação de
 * `design/observatorio/BRIEF-F1.4-nomes-datas-indice.md` §4. Corre sobre
 * `dist/`, imprime uma linha por célula e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, que é o que distingue uma régua de um relatório: um
 * estrago plantado tem de se ver no código de saída.
 *
 *   node tests/livro/indice.mjs
 *   node tests/livro/indice.mjs --json <ficheiro>
 *   node tests/livro/indice.mjs --contra <ficheiro.json>   (I10: o antes)
 *   node tests/livro/indice.mjs --navegador                (I3b e I7, rápidas)
 *   node tests/livro/indice.mjs --navegador --amostra-larga (as duas edições, 60 linhas)
 *   node tests/livro/indice.mjs --navegador --capturas <dir>
 *   OEDP_DIST=<dir> node tests/livro/indice.mjs            (para as plantas)
 *
 * ---------------------------------------------------------------------------
 * AS CÉLULAS, E O QUE CADA UMA DECIDE
 * ---------------------------------------------------------------------------
 * I1 (G1) · **o nome de uma medida não é o nome da máquina.** Em `/livro-razao`,
 *      em `/areas/*` e nas edições inglesas: nenhuma entrada encabeça com o
 *      identificador, nenhum texto de nome tem a forma de um identificador, e o
 *      identificador que desceu a metadado está onde disse que ia (dentro de
 *      `.livro-item-meta`).
 * I2 (G2) · **a forma da data.** Duas regras, e as duas mecânicas: (a) NENHUM
 *      elemento cujo texto INTEIRO seja uma data ISO, fora de `<time datetime>`
 *      (uma data que é o valor escreve-se dd.mm.aaaa); (b) uma data ISO DENTRO
 *      de uma frase mais longa só passa quando o elemento traz uma marca de
 *      origem transcrita, porque a casa não edita o que transcreve, ou quando a
 *      página é um documento alojado ou uma página de leitura, que o brief põe
 *      fora do âmbito. As duas contagens saem impressas.
 * I3 (G3) · **a busca existe, é um formulário, e o índice dela é o livro-razão
 *      inteiro.** Um `input[type=search]` em `/livro-razao` e em `/en/ledger`,
 *      dentro de um `<form method="get">` cujo destino EXISTE em `dist/`, com
 *      nome de campo e com um rótulo preso a ele; e o ficheiro do índice da
 *      busca com uma entrada por linha do livro-razão, cada uma com página e com
 *      o nome da sua própria linha. Com `--navegador`, a filtragem é medida no
 *      navegador (I3b), com perguntas que só um nome, um concelho e uma fonte
 *      respondem.
 * I4 (G4) · **a palavra retirada não está no rótulo da contagem.** O brief dava
 *      duas saídas para «peça», definir ou substituir; a `DECISIONS.md` §1.98
 *      escolheu a segunda por todo o sítio, e esta célula mede-a onde este bloco
 *      a aplicou. As ocorrências das outras páginas contam-se à parte, e são do
 *      bloco F1.10.
 * I5 (G5) · **as contagens do índice com denominador**, nas duas edições.
 * I6 (G6) · **o marcador com um destino só.** Todas as ligações do marcador de
 *      uma edição apontam para a mesma página, e um marcador que NÃO é ligação
 *      só existe dentro de um selo, que é a excepção escrita da Emenda 2.
 * I7 (G7) · **sem transbordo a 390** nas páginas de linha (com `--navegador`).
 * I8 (G8) · **a página de uma unidade da Carta** diz o que tem e não ganhou
 *      número nenhum: as linhas citadas continuam a ser só a da Carta.
 * I9 (G9) · **as datas dos trabalhos, e o marcador que resta.** Conta TODOS os
 *      marcadores da linha de cada trabalho (o da descrição e o da data), e não
 *      só os do campo da data; refaz, com o `git log`, a data em que o ficheiro
 *      de cada edição entrou no repositório, exigindo que a página a diga; e
 *      confere, linha a linha, o `src/data/datas-de-publicacao.json` que a
 *      construção passou a ler (bloco F1.4b) contra esse mesmo `git`.
 * I11 (G11) · **o espaço entre o número e a palavra, a 390** (com
 *      `--navegador`). Lê-se o texto RENDIDO das contagens das portas da
 *      primeira página, e não o `textContent`: o espaço estava nas cadeias e a
 *      caixa flexível aparava-o.
 * I10 (G10) · **nenhum número novo.** O inventário dos valores selados e dos
 *      motivos `data-nonledger` sai em `--json`; com `--contra` compara-se com o
 *      de antes e a diferença fecha a régua.
 *
 * ---------------------------------------------------------------------------
 * AS CÓPIAS LOCAIS, E PORQUE SÃO CÓPIAS
 * ---------------------------------------------------------------------------
 * A forma da data, a cadeia do marcador, as duas páginas do marcador e a palavra
 * que a §1.98 retirou
 * estão ESCRITAS AQUI, e não importadas do sítio. É a disciplina que
 * `scripts/gate-html.mjs` escreve por extenso: uma régua que leia a regra pela
 * mesma função que a escreve confirma a função, não o sítio. Uma cadeia que mude
 * do outro lado tem de fazer esta régua falhar, e não acompanhá-la em silêncio.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

/**
 * ---------------------------------------------------------------------------
 * O QUE A RÉGUA IMPORTA, E O QUE ELA REFAZ
 * ---------------------------------------------------------------------------
 * Importa os DADOS (o livro-razão, as duas listas de nomes de cartão). Refaz a
 * REGRA: a escada dos nomes está escrita outra vez aqui, em nove linhas, porque
 * uma régua que chamasse `nomeDaMedida()` confirmava a função e não a página. É
 * a mesma disciplina que `scripts/gate-html.mjs` escreve por extenso quando lê
 * um campo «DIRECTAMENTE da afirmação» em vez de o pedir ao gabarito.
 */
import { loadClaims } from '../../src/lib/ledger.mjs';
import { FIGURAS } from '../../src/data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../../src/data/dominios.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null;
};
const JSON_SAIDA = opcao('--json');
const CONTRA = opcao('--contra');
const CAPTURAS = opcao('--capturas');
const NAVEGADOR = argv.includes('--navegador') || CAPTURAS !== null;
/** A amostra larga: a do relatório, e não a que corre a cada construção. */
const AMOSTRA_LARGA = argv.includes('--amostra-larga') || CAPTURAS !== null;

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho(`\n  não existe ${DIST}. Corra o build primeiro.\n`));
  process.exit(1);
}

/* ========================================================================== */
/* As cópias locais da regra                                                  */
/* ========================================================================== */

/**
 * A DATA QUE NÃO É A DA CASA (leitura a frio, Major 13).
 *
 * A regra da casa é uma só, `dd.mm.aaaa`. A primeira passagem procurava a forma
 * ISO e mais nenhuma, e por isso `12/08/2026` e `2026/08/12` passavam: são
 * exactamente a mesma falha (uma data escrita noutra grafia) na forma que a
 * régua não conhecia. O que se procura são as TRÊS: ISO com hífenes, e as duas
 * com barras.
 */
const ISO = /\b(?:\d{4}-\d{2}-\d{2}|\d{4}\/\d{2}\/\d{2}|\d{2}\/\d{2}\/\d{4})\b/;
const ISO_G = new RegExp(ISO.source, 'g');
/** Um texto que é UMA data noutra grafia e mais nada. */
const SO_ISO = new RegExp('^\\s*(?:' + ISO.source.slice(2, -2) + ')\\s*$');
/** O único marcador de incerteza do sítio (`IDENTIDADE.md` §6). */
const MARCADOR = '[a verificar]';
/** As duas páginas do marcador, uma por edição. */
const PORTA_DO_MARCADOR = { pt: '/a-verificar', en: '/en/to-verify' };
/** A forma de um identificador de linha: minúsculas, algarismos e hífenes. */
const FORMA_DE_SLUG = /^[a-z0-9]+(?:-[a-z0-9.]+)+$/;
/**
 * A PALAVRA RETIRADA PELA `DECISIONS.md` §1.98 (04.09.2026).
 *
 * O vocabulário fechado da casa tem «estudo», «medida» e «linha do livro-razão»;
 * «peça» e «indicador» saem. A auditoria de 02.09 tinha apanhado a palavra no
 * índice das áreas de governo, nove vezes por edição, como o rótulo de uma
 * contagem, e é aí que este bloco a tira. As duas cadeias estão escritas aqui e
 * não importadas: a régua tem de ficar vermelha no dia em que a palavra voltar,
 * e não acompanhá-la.
 */
const PALAVRA_RETIRADA = { pt: /\bpeças?\b/i, en: /\bpieces?\b/i };
/**
 * A ESCADA DOS NOMES, REFEITA (leitura a frio, Blocking 4 e Major 13).
 *
 * A primeira passagem perguntava «este texto parece um identificador?», e um
 * nome trocado entre duas linhas passava: as duas cadeias são nomes legítimos,
 * só que da linha errada. Esta escada é a segunda conta do mesmo facto: para
 * cada identificador, qual É o nome que a página tem de mostrar. Os degraus são
 * os do `src/lib/nomes.mjs`, escritos aqui à mão.
 */
const CARTOES_DA_REGUA = new Map();
for (const f of FIGURAS) if (typeof f.claim === 'string' && !CARTOES_DA_REGUA.has(f.claim)) CARTOES_DA_REGUA.set(f.claim, f.nome);
for (const m of MEDIDAS_DO_DOMINIO_1) if (typeof m.claim === 'string' && !CARTOES_DA_REGUA.has(m.claim)) CARTOES_DA_REGUA.set(m.claim, m.nome);

const LINHAS_DA_REGUA = loadClaims();

/** @param {string} id @param {'pt'|'en'} lang */
function nomeEsperado(id, lang) {
  const cartao = CARTOES_DA_REGUA.get(id);
  if (cartao) {
    const t = cartao[lang] ?? cartao.pt;
    if (typeof t === 'string' && t.trim() !== '' && t !== MARCADOR) return t;
  }
  const linha = LINHAS_DA_REGUA.get(id);
  if (!linha) return null;
  const nome = linha.name;
  if (typeof nome === 'string' && nome.trim() !== '' && nome !== MARCADOR) return nome;
  const titulo = /** @type {{ title?: unknown }} */ (linha.document ?? {})?.title;
  if (typeof titulo === 'string' && titulo.trim() !== '' && titulo !== MARCADOR) return titulo;
  return null;
}

/**
 * As marcas que dizem «este texto não é prosa da casa: é uma transcrição».
 * É a lista de `scripts/medir-defeitos.mjs` (`ORIGEM_DECLARADA`), escrita outra
 * vez, e serve para I2b: uma data dentro de uma frase transcrita fica como a
 * fonte a escreveu.
 */
const MARCA_DE_TRANSCRICAO =
  '[data-linha-campo],[data-correcao-campo],[data-verbatim],[data-agenda],' +
  '[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta]';

/* ========================================================================== */
/* A varredura de `dist/`                                                     */
/* ========================================================================== */

/** @type {{ caminho: string, rota: string, lang: 'pt'|'en', html: string }[]} */
const paginas = [];
(function anda(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name === 'index.html' || e.name.endsWith('.html')) {
      const rota = '/' + path.relative(DIST, p).split(path.sep).join('/').replace(/index\.html$/, '');
      paginas.push({
        caminho: p,
        rota: rota.length > 1 ? rota.replace(/\/$/, '') : '/',
        lang: rota.startsWith('/en/') || rota === '/en' ? 'en' : 'pt',
        html: fs.readFileSync(p, 'utf8'),
      });
    }
  }
})(DIST);

/**
 * A ÁRVORE DE UMA PÁGINA É O SEU `<body>`, e não o documento inteiro.
 *
 * O `<head>` leva o título e a descrição, que são mobília de máquina e não texto
 * que o leitor lê na página: o título de `/a-verificar` É «O marcador [a
 * verificar]», e contá-lo como um marcador escrito à mão seria contar a página
 * do marcador como um defeito dela própria.
 */
const arvore = new Map();
const dom = (pag) => {
  if (!arvore.has(pag.caminho)) {
    const doc = parse(pag.html);
    for (const el of doc.querySelectorAll('script, style, template')) el.remove();
    arvore.set(pag.caminho, doc.querySelector('body') ?? doc);
  }
  return arvore.get(pag.caminho);
};

const texto = (el) => String(el?.text ?? '').replace(/\s+/g, ' ').trim();
/** Um caminho de `dist/` que existe: uma página, ou um ficheiro servido. */
function existeNoDist(caminho) {
  const limpo = String(caminho).split('?')[0].split('#')[0];
  const base = path.join(DIST, limpo);
  return (
    fs.existsSync(path.join(base, 'index.html')) ||
    (fs.existsSync(base) && fs.statSync(base).isFile())
  );
}

const ePaginaDeIndiceDoLivro = (r) => r === '/livro-razao' || r === '/en/ledger';
const ePaginaDeArea = (r) => /^\/(?:en\/)?areas\/[^/]+$/.test(r);
const ePaginaDeLinha = (r) => /^\/(?:livro-razao|en\/ledger)\/[^/]+$/.test(r) && !/\/(?:concelhos|municipalities)$/.test(r);
const ePaginaDeUnidade = (r) => /^\/(?:distritos|en\/districts)\/[^/]+$/.test(r);
/** Um documento alojado ou uma página de leitura: o brief §2 põe-nos fora. */
const eForaDoAmbitoDasDatas = (r) =>
  /^\/(?:documentos|en\/documents)\//.test(r) || /^\/(?:estudos|en\/studies)\/[^/]+/.test(r);

/* ========================================================================== */
/* As células                                                                 */
/* ========================================================================== */

/** @type {{ id: string, nome: string, passa: boolean, nota: string, falhas: string[] }[]} */
const celulas = [];
/** @type {Record<string, unknown>} */
const medida = {};

/** @param {string} id @param {string} nome */
function celula(id, nome, corpo) {
  /** @type {string[]} */
  const falhas = [];
  const nota = corpo(falhas) ?? '';
  celulas.push({ id, nome, passa: falhas.length === 0, nota, falhas });
}

/* --------------------------------------------------------------------- I1 */
celula('I1', 'o nome de uma medida não é o identificador', (falhas) => {
  let itens = 0;
  let comNome = 0;
  let semNome = 0;
  let idEmMetadado = 0;
  const alvo = paginas.filter((p) => ePaginaDeIndiceDoLivro(p.rota) || ePaginaDeArea(p.rota));
  if (alvo.length === 0) falhas.push('não há páginas de índice do livro-razão nem de área em dist/.');
  for (const pag of alvo) {
    for (const item of dom(pag).querySelectorAll('.livro-item')) {
      itens++;
      const id = item.getAttribute('data-linha-id') ?? '';
      const corpo = item.querySelector('.livro-item-corpo');
      const primeiro = corpo?.childNodes?.find((n) => n.nodeType === 1) ?? null;
      const classePrimeiro = String(primeiro?.getAttribute?.('class') ?? '');
      if (classePrimeiro.split(/\s+/).includes('livro-item-id')) {
        falhas.push(`${pag.rota}: a entrada "${id}" encabeça com o identificador.`);
      }
      const nome = item.querySelector('.livro-item-nome');
      const esperado = nomeEsperado(id, pag.lang);
      if (nome) {
        comNome++;
        const t = texto(nome);
        if (t === id) falhas.push(`${pag.rota}: o nome de "${id}" é o próprio identificador.`);
        else if (FORMA_DE_SLUG.test(t)) {
          falhas.push(`${pag.rota}: o nome de "${id}" tem a forma de um identificador ("${t}").`);
        } else if (esperado === null) {
          falhas.push(
            `${pag.rota}: a entrada "${id}" mostra um nome ("${t.slice(0, 60)}") e a escada não ` +
              `dá nenhum para essa linha.`,
          );
        } else if (t !== String(esperado).replace(/\s+/g, ' ').trim()) {
          /* O NOME É O DAQUELA LINHA (Blocking 4). Trocar dois nomes entre duas
             entradas do índice deixava as duas cadeias legítimas e a página a
             mentir; a régua refaz a escada e compara com o identificador ao lado. */
          falhas.push(
            `${pag.rota}: a entrada "${id}" chama-se "${t.slice(0, 60)}" e o nome dela é ` +
              `"${String(esperado).slice(0, 60)}".`,
          );
        }
      } else {
        semNome++;
        if (esperado !== null) {
          falhas.push(
            `${pag.rota}: a entrada "${id}" não mostra nome nenhum, e a escada dá-lhe ` +
              `"${String(esperado).slice(0, 60)}".`,
          );
        }
      }
      for (const marca of item.querySelectorAll('.livro-item-id')) {
        idEmMetadado++;
        const dentroDoMeta = Boolean(
          item.querySelectorAll('.livro-item-meta .livro-item-id').find((x) => x === marca),
        );
        if (!dentroDoMeta) {
          falhas.push(`${pag.rota}: o identificador de "${id}" não está no metadado.`);
        }
      }
    }
  }
  medida.I1 = { paginas: alvo.length, itens, com_nome: comNome, sem_nome: semNome, ids_em_metadado: idEmMetadado };
  return `${alvo.length} página(s) · ${itens} entrada(s) · ${comNome} com nome · ${semNome} sem nome (as derivadas, que não têm fonte nem documento, e as que só têm o marcador por título de documento) · ${idEmMetadado} identificador(es) em metadado`;
});

/* --------------------------------------------------------------------- I2 */
celula('I2', 'as datas ISO à vista', (falhas) => {
  let soData = 0;
  let emProsa = 0;
  let emProsaTranscrita = 0;
  let foraDoAmbito = 0;
  for (const pag of paginas) {
    const fora = eForaDoAmbitoDasDatas(pag.rota);
    const raiz = dom(pag);
    const transcritos = new Set();
    for (const el of raiz.querySelectorAll(MARCA_DE_TRANSCRICAO)) {
      transcritos.add(el);
      for (const d of el.querySelectorAll('*')) transcritos.add(d);
    }
    for (const el of raiz.querySelectorAll('*')) {
      const tag = String(el.rawTagName ?? '').toLowerCase();
      if (tag === 'time' && el.getAttribute('datetime')) continue;
      /** o texto próprio deste elemento, sem o dos filhos */
      const proprio = el.childNodes
        .filter((n) => n.nodeType === 3)
        .map((n) => n.rawText ?? '')
        .join('');
      if (!ISO.test(proprio)) continue;
      const quantas = (proprio.match(ISO_G) ?? []).length;
      if (SO_ISO.test(proprio)) {
        if (fora) {
          foraDoAmbito += quantas;
          continue;
        }
        soData += quantas;
        falhas.push(`${pag.rota}: <${tag}> com uma data ISO por texto inteiro ("${proprio.trim()}").`);
        continue;
      }
      if (fora) foraDoAmbito += quantas;
      else if (transcritos.has(el)) emProsaTranscrita += quantas;
      else {
        emProsa += quantas;
        falhas.push(`${pag.rota}: data ISO em prosa não transcrita ("${proprio.trim().slice(0, 70)}").`);
      }
    }
  }
  medida.I2 = {
    so_data: soData,
    em_prosa_por_marcar: emProsa,
    em_prosa_transcrita: emProsaTranscrita,
    fora_do_ambito: foraDoAmbito,
  };
  return `${soData} data(s) ISO como valor · ${emProsa} em prosa por marcar · ${emProsaTranscrita} dentro de texto transcrito (a casa não edita o que transcreve) · ${foraDoAmbito} em documentos alojados e páginas de leitura (fora do âmbito do brief §2)`;
});

/* --------------------------------------------------------------------- I3 */
celula('I3', 'a busca do índice é um formulário, e cobre o livro-razão inteiro', (falhas) => {
  const alvo = paginas.filter((p) => ePaginaDeIndiceDoLivro(p.rota));
  if (alvo.length !== 2) falhas.push(`esperava 2 páginas de índice do livro-razão e há ${alvo.length}.`);
  let entradasNoIndice = 0;
  for (const pag of alvo) {
    const raiz = dom(pag);
    const campos = raiz.querySelectorAll('input[type="search"]');
    if (campos.length !== 1) {
      falhas.push(`${pag.rota}: ${campos.length} campo(s) de busca, e tem de ser 1.`);
      continue;
    }
    const campo = campos[0];
    let p = campo.parentNode;
    let forma = null;
    while (p) {
      if (String(p.rawTagName ?? '').toLowerCase() === 'form') { forma = p; break; }
      p = p.parentNode;
    }
    if (!forma) { falhas.push(`${pag.rota}: o campo de busca está fora de um <form>.`); continue; }
    if ((forma.getAttribute('method') ?? '').toLowerCase() !== 'get') {
      falhas.push(`${pag.rota}: o formulário da busca não é method="get".`);
    }
    /* O DESTINO TEM DE EXISTIR (leitura a frio, Major 13). Um `action` não vazio
       passava a peneira antiga; um `action` para uma página que não existe é um
       formulário que leva a lado nenhum, que é a mesma falha com outra cara. */
    const destino = forma.getAttribute('action');
    if (!destino) falhas.push(`${pag.rota}: o formulário da busca não tem destino.`);
    else if (!existeNoDist(destino)) {
      falhas.push(`${pag.rota}: o destino do formulário ("${destino}") não é uma página de dist/.`);
    }

    /* ---------------------------------------------------------------------
       O ÍNDICE DA BUSCA, CONFERIDO CONTRA O LIVRO-RAZÃO (Major 6)
       ---------------------------------------------------------------------
       A busca passou a cobrir as 2 916 linhas por um ficheiro que a construção
       escreve. Um ficheiro que o guião carrega é superfície pública como uma
       página: a régua conta as suas entradas contra `ledger/claims/` (que ela
       própria lê), confere que cada identificador tem página em `dist/` e que
       cada nome é o nome daquela linha nesta edição. Sem isto, a promessa das
       2 916 era uma cadeia num relatório. */
    const caminhoDoIndice = forma.getAttribute('data-livro-indice');
    if (!caminhoDoIndice) {
      falhas.push(`${pag.rota}: o formulário não diz onde está o índice da busca.`);
    } else {
      const ficheiro = path.join(DIST, caminhoDoIndice);
      if (!fs.existsSync(ficheiro)) {
        falhas.push(`${pag.rota}: o índice da busca ("${caminhoDoIndice}") não existe em dist/.`);
      } else {
        const indice = JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
        entradasNoIndice += indice.linhas?.length ?? 0;
        if (indice.edicao !== pag.lang) {
          falhas.push(`${caminhoDoIndice}: diz ser da edição "${indice.edicao}" e serve a "${pag.lang}".`);
        }
        if ((indice.linhas?.length ?? 0) !== LINHAS_DA_REGUA.size) {
          falhas.push(
            `${caminhoDoIndice}: tem ${indice.linhas?.length ?? 0} entrada(s) e o livro-razão tem ` +
              `${LINHAS_DA_REGUA.size} linhas.`,
          );
        }
        let semPagina = 0;
        let nomeErrado = 0;
        for (const linha of indice.linhas ?? []) {
          const id = String(linha[0]);
          if (!LINHAS_DA_REGUA.has(id)) {
            falhas.push(`${caminhoDoIndice}: a entrada "${id}" não é uma linha do livro-razão.`);
            continue;
          }
          if (!fs.existsSync(path.join(DIST, indice.base, id, 'index.html'))) semPagina++;
          const nome = linha[1] >= 0 ? indice.nomes[linha[1]] : null;
          const devia = nomeEsperado(id, pag.lang);
          if ((nome ?? null) !== (devia ?? null)) nomeErrado++;
        }
        if (semPagina > 0) {
          falhas.push(`${caminhoDoIndice}: ${semPagina} entrada(s) sem página de linha em dist/.`);
        }
        if (nomeErrado > 0) {
          falhas.push(`${caminhoDoIndice}: ${nomeErrado} entrada(s) com um nome que não é o da sua linha.`);
        }
      }
    }
    const nome = campo.getAttribute('name');
    if (!nome) falhas.push(`${pag.rota}: o campo de busca não tem nome, e sem nome não vai nada no endereço.`);
    const idDoCampo = campo.getAttribute('id');
    const rotulo = idDoCampo ? raiz.querySelector(`label[for="${idDoCampo}"]`) : null;
    if (!rotulo) falhas.push(`${pag.rota}: o campo de busca não tem rótulo preso a ele.`);
    const comBusca = raiz.querySelectorAll('.livro-item[data-busca]').length;
    const itens = raiz.querySelectorAll('.livro-item').length;
    if (comBusca !== itens) {
      falhas.push(`${pag.rota}: ${itens - comBusca} entrada(s) sem texto de busca declarado.`);
    }
  }
  medida.I3 = { indices: alvo.length, entradas: entradasNoIndice, linhas_do_livro: LINHAS_DA_REGUA.size };
  return `${alvo.length} índice(s) com um campo de busca dentro de um <form method="get"> · ${entradasNoIndice} entrada(s) nos dois ficheiros do índice da busca, contra ${LINHAS_DA_REGUA.size} linhas do livro-razão em cada`;
});

/* --------------------------------------------------------------------- I4 */
celula('I4', 'a palavra retirada não está no rótulo da contagem', (falhas) => {
  let noRotulo = 0;
  let foraDoAmbito = 0;
  for (const pag of paginas) {
    const raiz = dom(pag);
    /* A PALAVRA CONTA QUANDO É DA CASA. Dentro de uma transcrição ela é da
       fonte, e a casa não edita o que transcreve: um documento alojado que
       escreva «peça» não põe vocabulário nenhum na boca do sítio. É a mesma
       fronteira que `scripts/medir-defeitos.mjs` usa para separar a prosa da
       casa do resto. */
    const marcados = new Set();
    for (const el of raiz.querySelectorAll(MARCA_DE_TRANSCRICAO)) {
      marcados.add(el);
      for (const d of el.querySelectorAll('*')) marcados.add(d);
    }
    const partes = [];
    const anda = (n) => {
      if (!n) return;
      if (n.nodeType === 3) { partes.push(n.rawText ?? ''); return; }
      if (marcados.has(n)) return;
      for (const f of n.childNodes ?? []) anda(f);
    };
    anda(raiz);
    const re = PALAVRA_RETIRADA[pag.lang];
    const achados = (partes.join(' ').replace(/\s+/g, ' ')).match(new RegExp(re.source, 'gi'));
    if (!achados) continue;
    /**
     * ESTE BLOCO TIRA A PALAVRA ONDE ELA ERA O RÓTULO DE UMA CONTAGEM, que é
     * onde a auditoria a apanhou: o índice das áreas de governo escrevia «Saúde
     * · 1 peça» nove vezes. Fora dali ela vive em três sítios que o F1.4 não
     * governa, e a régua conta-os à parte em vez de os calar:
     *
     *   · `/metodo` e `/sobre`, que são a casa do método e que a Emenda 15
     *     isenta por escrito;
     *   · um documento alojado, que é o texto da FONTE.
     *
     * A passagem por todo o sítio é do bloco F1.10, e é ele que leva estes 16 a
     * zero. Enquanto não for, o número está aqui e não é uma surpresa.
     */
    const eOIndiceDasAreas = pag.rota === '/areas' || pag.rota === '/en/areas';
    if (!eOIndiceDasAreas) {
      foraDoAmbito += achados.length;
      continue;
    }
    noRotulo += achados.length;
    falhas.push(`${pag.rota}: ${achados.length} ocorrência(s) da palavra retirada pela §1.98.`);
  }
  medida.I4 = { no_rotulo_da_contagem: noRotulo, fora_do_ambito: foraDoAmbito };
  return `${noRotulo} ocorrência(s) no rótulo da contagem das áreas · ${foraDoAmbito} noutras páginas (o Método, o Sobre e os documentos alojados, que são do bloco F1.10)`;
});

/* --------------------------------------------------------------------- I5 */
celula('I5', 'as contagens do índice com denominador', (falhas) => {
  for (const pag of paginas.filter((p) => ePaginaDeIndiceDoLivro(p.rota))) {
    const linha = dom(pag).querySelector('.livro-contas');
    if (!linha) { falhas.push(`${pag.rota}: não há a linha das contagens.`); continue; }
    const chaves = linha.querySelectorAll('[data-prova]').map((el) => el.getAttribute('data-prova'));
    const total = chaves.filter((c) => c === 'afirmacoes').length;
    if (total !== 3) {
      falhas.push(
        `${pag.rota}: o total do livro-razão rende-se ${total} vez(es) e tem de render-se 3 ` +
          `(uma como contagem, e uma como denominador de cada parcela).`,
      );
    }
    for (const parcela of ['derivadas', 'concelhos_linhas']) {
      if (!chaves.includes(parcela)) falhas.push(`${pag.rota}: falta a parcela "${parcela}".`);
      else {
        const i = chaves.indexOf(parcela);
        if (chaves[i + 1] !== 'afirmacoes') {
          falhas.push(`${pag.rota}: a parcela "${parcela}" não é seguida do seu denominador.`);
        }
      }
    }
  }
  return 'as duas parcelas dizem de que total saem, nas duas edições';
});

/* --------------------------------------------------------------------- I6 */
celula('I6', 'o marcador com um destino só', (falhas) => {
  /** @type {Record<'pt'|'en', Map<string, number>>} */
  const destinos = { pt: new Map(), en: new Map() };
  let semPorta = 0;
  let dentroDoSelo = 0;
  let soltos = 0;
  for (const pag of paginas) {
    const raiz = dom(pag);
    const transcritos = new Set();
    for (const el of raiz.querySelectorAll(MARCA_DE_TRANSCRICAO)) {
      transcritos.add(el);
      for (const d of el.querySelectorAll('*')) transcritos.add(d);
    }
    for (const el of raiz.querySelectorAll('.marcador')) {
      const tag = String(el.rawTagName ?? '').toLowerCase();
      if (tag === 'a') {
        const href = el.getAttribute('href') ?? '(sem href)';
        destinos[pag.lang].set(href, (destinos[pag.lang].get(href) ?? 0) + 1);
        continue;
      }
      semPorta++;
      /* A EXCEPÇÃO ESCRITA: dentro do selo, a Emenda 2 proíbe uma âncora dentro
         de outra, e o selo INTEIRO é a porta da linha (`IDENTIDADE.md` §5.4). */
      let p = el.parentNode;
      let noSelo = false;
      while (p) {
        const c = String(p.getAttribute?.('class') ?? '');
        if (c.split(/\s+/).includes('src-chip')) { noSelo = true; break; }
        p = p.parentNode;
      }
      if (noSelo) dentroDoSelo++;
      else falhas.push(`${pag.rota}: um marcador sem porta e fora de um selo.`);
    }
    /* Um marcador escrito à mão, sem classe nenhuma: nem porta, nem marca. */
    for (const el of raiz.querySelectorAll('*')) {
      const proprio = el.childNodes
        .filter((n) => n.nodeType === 3)
        .map((n) => n.rawText ?? '')
        .join('');
      if (!proprio.includes(MARCADOR)) continue;
      const classes = String(el.getAttribute('class') ?? '').split(/\s+/);
      if (classes.includes('marcador')) continue;
      /* Dentro de uma transcrição, o marcador pode ser o texto do campo: é o
         registo a dizer que o campo falta, e o texto é do registo. */
      if (transcritos.has(el)) continue;
      soltos++;
      falhas.push(`${pag.rota}: a cadeia do marcador escrita sem a marca ("${proprio.trim().slice(0, 60)}").`);
    }
  }
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    const chaves = [...destinos[lang].keys()];
    if (chaves.length === 0) { falhas.push(`edição "${lang}": nenhuma ligação do marcador em dist/.`); continue; }
    if (chaves.length > 1) {
      falhas.push(`edição "${lang}": o marcador tem ${chaves.length} destinos (${chaves.join(', ')}).`);
    } else if (chaves[0] !== PORTA_DO_MARCADOR[lang]) {
      falhas.push(`edição "${lang}": o marcador aponta para "${chaves[0]}" e a página dele é "${PORTA_DO_MARCADOR[lang]}".`);
    }
  }
  medida.I6 = {
    pt: Object.fromEntries(destinos.pt),
    en: Object.fromEntries(destinos.en),
    sem_porta: semPorta,
    dentro_do_selo: dentroDoSelo,
    soltos,
  };
  const nPt = [...destinos.pt.values()].reduce((a, b) => a + b, 0);
  const nEn = [...destinos.en.values()].reduce((a, b) => a + b, 0);
  return `${nPt} ligação(ões) em «pt» e ${nEn} em «en», uma página cada · ${dentroDoSelo} marcador(es) dentro de um selo (excepção da Emenda 2)`;
});

/* --------------------------------------------------------------------- I8 */
celula('I8', 'a página de uma unidade da Carta', (falhas) => {
  const alvo = paginas.filter((p) => ePaginaDeUnidade(p.rota));
  if (alvo.length === 0) falhas.push('não há páginas de unidade da Carta em dist/.');
  const linhasCitadas = new Set();
  for (const pag of alvo) {
    const raiz = dom(pag);
    if (!raiz.querySelector('.distrito-lede')) {
      falhas.push(`${pag.rota}: não diz o que a página tem.`);
    }
    for (const el of raiz.querySelectorAll('[data-claim]')) {
      linhasCitadas.add(el.getAttribute('data-claim'));
    }
  }
  const esperadas = ['municipios-portugal-caop-2025'];
  for (const id of linhasCitadas) {
    if (!esperadas.includes(id)) {
      falhas.push(`uma página de unidade cita a linha "${id}", que não é a da Carta: um agregado novo entrou sem linha derivada.`);
    }
  }

  /**
   * O AGREGADO SEM MARCA (leitura a frio, Major 13).
   *
   * A peneira acima só via um agregado que entrasse COM a marca de uma linha:
   * `<p>Dívida do distrito: 1 234</p>`, escrito à mão, passava inteiro. O que
   * se mede agora é o que a `check-formas` F2 mede dentro de um desenho, e pela
   * mesma razão: nesta página nenhum algarismo pode estar fora de uma origem
   * declarada. A geometria do mapa vive em atributos (`d`, `viewBox`) e não em
   * texto, e por isso não entra nesta conta.
   */
  let algarismosSoltos = 0;
  for (const pag of alvo) {
    /* O CORPO DA PÁGINA, E NÃO A MOBÍLIA. O cabeçalho e o rodapé são os mesmos
       em todas as rotas e têm os seus próprios números, com as suas próprias
       marcas e os seus próprios portões; o que esta célula julga é o que a
       página de uma unidade da Carta acrescenta. */
    const raiz = dom(pag).querySelector('main');
    if (!raiz) {
      falhas.push(`${pag.rota}: não tem <main>, e é por ele que esta célula mede.`);
      continue;
    }
    const marcados = new Set();
    for (const el of raiz.querySelectorAll('[data-claim],[data-prova],[data-nonledger],[data-lugar],[data-nome]')) {
      marcados.add(el);
      for (const d of el.querySelectorAll('*')) marcados.add(d);
    }
    for (const el of raiz.querySelectorAll('*')) {
      if (marcados.has(el)) continue;
      const proprio = el.childNodes
        .filter((n) => n.nodeType === 3)
        .map((n) => n.rawText ?? '')
        .join('');
      if (!/\d/.test(proprio)) continue;
      algarismosSoltos++;
      falhas.push(
        `${pag.rota}: um algarismo fora de qualquer origem declarada ("${proprio.trim().slice(0, 60)}"). ` +
          `Numa página que é um índice, um número é um agregado que ninguém conferiu.`,
      );
    }
  }
  medida.I8 = { paginas: alvo.length, linhas: [...linhasCitadas], algarismos_soltos: algarismosSoltos };
  return `${alvo.length} página(s), cada uma com a frase do índice, sem uma linha que não seja a da Carta e sem um algarismo fora de origem declarada`;
});

/* --------------------------------------------------------------------- I9 */
celula('I9', 'as datas dos trabalhos, e o marcador que resta', (falhas) => {
  /**
   * A CONTA DOS MARCADORES É DE TODOS OS MARCADORES DA LINHA (leitura a frio,
   * Major 10). A primeira passagem contava só os que estavam dentro do campo da
   * data, e por isso via um marcador em «Onde está a água?» quando a linha dele
   * mostra dois: um pela descrição que falta e outro pela data. A régua conta o
   * que o leitor vê.
   */
  let trabalhos = 0;
  let comMarcador = 0;
  let marcadoresAoTodo = 0;
  for (const pag of paginas.filter((p) => p.rota === '/estudos' || p.rota === '/en/studies')) {
    for (const artigo of dom(pag).querySelectorAll('article.arquivo-item')) {
      trabalhos++;
      const n = artigo.querySelectorAll('.marcador').length;
      marcadoresAoTodo += n;
      if (n > 1) {
        falhas.push(
          `${pag.rota}: um trabalho com ${n} marcadores («${texto(artigo).slice(0, 50)}»).`,
        );
      }
      if (n >= 1) comMarcador++;
    }
  }

  /**
   * A DATA DE CADA EDIÇÃO, REFEITA DO `git` (decisão de 04.09.2026).
   *
   * A página escreve «publicado a dd.mm.aaaa», e a data é o dia em que o
   * ficheiro da edição entrou neste repositório. A régua não pergunta ao sítio
   * qual foi: corre o `git log` por conta própria e exige que a página mostre
   * essa data. É a segunda conta do mesmo facto, e é ela que apanha a cópia rasa
   * (sem história, o sítio volta ao marcador e o `git` daqui também: as duas
   * concordam, e a contagem de datas resolvidas, impressa, diz o que aconteceu).
   */
  const RAIZ_DO_REPO = path.resolve(RAIZ);
  /**
   * E O FICHEIRO QUE A CONSTRUÇÃO LÊ, CONFERIDO CONTRA O MESMO `git` (F1.4b).
   *
   * Desde 04.09 a construção já não chama o `git`: lê
   * `src/data/datas-de-publicacao.json`, escrito uma vez numa árvore com
   * história completa. Foi essa a saída do defeito (a Vercel constrói de uma
   * cópia rasa e o `git` respondia com o dia da construção), e traz uma dívida
   * nova: um ficheiro que ninguém volta a conferir envelhece em silêncio. Esta
   * célula é quem o confere, e não pergunta ao sítio o que ele leu de lá: lê o
   * ficheiro por sua conta e compara-o, entrada a entrada, com o `git` desta
   * árvore.
   */
  const FICHEIRO_DAS_DATAS = path.join('src', 'data', 'datas-de-publicacao.json');
  /** @type {Map<string, {data: string, commit: string}>} */
  const declaradas = new Map();
  {
    const caminho = path.join(RAIZ_DO_REPO, FICHEIRO_DAS_DATAS);
    if (!fs.existsSync(caminho)) {
      falhas.push(
        `falta ${FICHEIRO_DAS_DATAS}, que é de onde a construção tira as datas das edições.`,
      );
    } else {
      const bruto = JSON.parse(fs.readFileSync(caminho, 'utf8'));
      for (const e of Array.isArray(bruto?.edicoes) ? bruto.edicoes : []) {
        declaradas.set(`${e.slug}/${e.lang}`, { data: e.data, commit: e.commit });
      }
      if (declaradas.size === 0) {
        falhas.push(`${FICHEIRO_DAS_DATAS} não declara edição nenhuma.`);
      }
    }
  }
  let conferidasContraOFicheiro = 0;
  let comData = 0;
  let semHistoria = 0;
  const dirDosTrabalhos = path.join(RAIZ_DO_REPO, 'studies-src');
  const slugs = fs.existsSync(dirDosTrabalhos)
    ? fs.readdirSync(dirDosTrabalhos, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
        .map((e) => e.name)
    : [];
  for (const slug of slugs) {
    for (const edicao of ['pt', 'en']) {
      const rel = `studies-src/${slug}/${edicao}.html`;
      if (!fs.existsSync(path.join(RAIZ_DO_REPO, rel))) continue;
      let data = null;
      /** O resumo do commit que acrescentou o ficheiro (F1.4b). */
      let commit = null;
      try {
        const saida = execFileSync(
          'git',
          ['log', '--diff-filter=A', '--format=%ad %H', '--date=short', '--', rel],
          { cwd: RAIZ_DO_REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        );
        const linhas = saida.split('\n').map((l) => l.trim()).filter((l) => /^\d{4}-\d{2}-\d{2} [0-9a-f]{40}$/.test(l));
        const ultima = linhas.length ? linhas[linhas.length - 1] : null;
        if (ultima !== null) [data, commit] = ultima.split(' ');
      } catch {
        data = null;
        commit = null;
      }
      if (data === null || commit === null) {
        semHistoria++;
        continue;
      }
      comData++;
      /* O FICHEIRO CONTRA O `git`, entrada a entrada. */
      const declarada = declaradas.get(`${slug}/${edicao}`) ?? null;
      if (declarada === null) {
        falhas.push(
          `${rel}: o \`git\` diz que esta edição entrou a ${data} e ${FICHEIRO_DAS_DATAS} ` +
            `não a declara. A construção lê o ficheiro: uma edição que falte lá volta ao marcador.`,
        );
      } else {
        conferidasContraOFicheiro++;
        if (declarada.data !== data) {
          falhas.push(
            `${rel}: ${FICHEIRO_DAS_DATAS} declara ${declarada.data} e o \`git\` diz ${data}.`,
          );
        }
        if (declarada.commit !== commit) {
          falhas.push(
            `${rel}: ${FICHEIRO_DAS_DATAS} aponta o commit ${String(declarada.commit).slice(0, 8)} ` +
              `e o commit que acrescentou o ficheiro é ${commit.slice(0, 8)}.`,
          );
        }
      }
      const naForma = `${data.slice(8, 10)}.${data.slice(5, 7)}.${data.slice(0, 4)}`;
      const rota = edicao === 'pt' ? `/estudos/${slug}` : `/en/studies/${slug}`;
      const pag = paginas.find((p) => p.rota === rota);
      if (!pag) continue;
      const t = texto(dom(pag));
      if (!t.includes(naForma)) {
        falhas.push(
          `${rota}: o ficheiro desta edição entrou no repositório a ${naForma} e a página não o diz.`,
        );
      }
    }
  }
  if (comData === 0 && slugs.length > 0) {
    falhas.push(
      `nenhuma das ${slugs.length} pastas de trabalho deu data de repositório: ou não há história ` +
        `(uma cópia rasa) ou o \`git\` não corre. Sem um positivo conhecido, esta célula não mede nada.`,
    );
  }

  /* O FICHEIRO NÃO PODE TRAZER EDIÇÕES QUE A ÁRVORE NÃO TEM. */
  for (const k of declaradas.keys()) {
    const [slug, edicao] = k.split('/');
    if (!fs.existsSync(path.join(RAIZ_DO_REPO, `studies-src/${slug}/${edicao}.html`))) {
      falhas.push(
        `${FICHEIRO_DAS_DATAS} declara ${k} e studies-src/${slug}/${edicao}.html não existe.`,
      );
    }
  }
  if (comData > 0 && conferidasContraOFicheiro === 0) {
    falhas.push(
      `${comData} edição(ões) com data no \`git\` e nenhuma conferida contra ` +
        `${FICHEIRO_DAS_DATAS}: a segunda conta desta célula não mediu nada.`,
    );
  }

  medida.I9 = {
    trabalhos,
    com_marcador: comMarcador,
    marcadores: marcadoresAoTodo,
    edicoes_com_data_do_repositorio: comData,
    edicoes_sem_historia: semHistoria,
    edicoes_no_ficheiro: declaradas.size,
    edicoes_do_ficheiro_conferidas_contra_o_git: conferidasContraOFicheiro,
  };
  return `${trabalhos} linha(s) de trabalho · ${marcadoresAoTodo} marcador(es) ao todo, ${comMarcador} linha(s) com um e nenhuma com dois · ${comData} edição(ões) com a data do repositório conferida contra o git, ${semHistoria} sem história · ${conferidasContraOFicheiro} de ${declaradas.size} linha(s) de ${FICHEIRO_DAS_DATAS} refeitas do git`;
});

/* -------------------------------------------------------------------- I10 */
celula('I10', 'nenhum número novo', (falhas) => {
  /** @type {Record<string, number>} */
  const selados = {};
  /** @type {Record<string, number>} */
  const motivos = {};
  /**
   * O QUE SE INVENTARIA (leitura a frio, Major 13).
   *
   * A primeira passagem guardava os IDS citados e os NOMES dos motivos, e
   * comparava a PRESENÇA das chaves. Assim, mudar o valor impresso de uma linha,
   * ou render a mesma linha mais vinte vezes, não mexia numa única chave: as
   * duas construções tinham exactamente o mesmo conjunto de ids e o mesmo
   * conjunto de motivos. O que se guarda agora é o que se pode mudar sem
   * mudança nenhuma de chave: **quantas vezes** cada linha se rende e **que
   * algarismos** ela imprime.
   */
  /** @type {Record<string, string[]>} */
  const impressos = {};
  for (const pag of paginas) {
    for (const el of dom(pag).querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim') ?? '';
      selados[id] = (selados[id] ?? 0) + 1;
      const t = texto(el);
      if (!impressos[id]) impressos[id] = [];
      if (t && !impressos[id].includes(t)) impressos[id].push(t);
    }
    for (const el of dom(pag).querySelectorAll('[data-nonledger]')) {
      const m = el.getAttribute('data-nonledger') ?? '';
      motivos[m] = (motivos[m] ?? 0) + 1;
    }
  }
  for (const id of Object.keys(impressos)) impressos[id].sort();
  medida.I10 = { selados, motivos, impressos };
  if (Object.keys(selados).length === 0) falhas.push('nenhum valor selado em dist/: a varredura não viu nada.');
  if (CONTRA) {
    if (!fs.existsSync(CONTRA)) falhas.push(`não existe ${CONTRA}.`);
    else {
      const antes = JSON.parse(fs.readFileSync(CONTRA, 'utf8'));
      const a = antes.medida?.I10 ?? {};
      const antesSelados = a.selados ?? {};
      const antesMotivos = a.motivos ?? {};
      const antesImpressos = a.impressos ?? null;
      for (const id of Object.keys(selados)) {
        if (!(id in antesSelados)) falhas.push(`a linha "${id}" passou a ser citada e não era.`);
        else if (antesSelados[id] !== selados[id]) {
          falhas.push(
            `a linha "${id}" rende-se ${selados[id]} vez(es) e rendia-se ${antesSelados[id]}.`,
          );
        }
      }
      for (const id of Object.keys(antesSelados)) {
        if (!(id in selados)) falhas.push(`a linha "${id}" deixou de ser citada.`);
      }
      for (const m of Object.keys(motivos)) {
        if (!(m in antesMotivos)) falhas.push(`o motivo "${m}" é novo.`);
        else if (antesMotivos[m] !== motivos[m]) {
          falhas.push(`o motivo "${m}" rende-se ${motivos[m]} vez(es) e rendia-se ${antesMotivos[m]}.`);
        }
      }
      for (const m of Object.keys(antesMotivos)) {
        if (!(m in motivos)) falhas.push(`o motivo "${m}" deixou de se render.`);
      }
      /* Os ALGARISMOS de cada linha. Uma medição anterior sem esta tabela não
         serve para a comparação, e a régua di-lo em vez de a saltar em silêncio. */
      if (antesImpressos === null) {
        falhas.push(
          `a medição de antes não guardou os algarismos impressos de cada linha: ` +
            `refaça-a com esta régua para que a comparação valha alguma coisa.`,
        );
      } else {
        for (const id of Object.keys(impressos)) {
          const antesTexto = (antesImpressos[id] ?? []).join(' | ');
          const agoraTexto = impressos[id].join(' | ');
          if (id in antesImpressos && antesTexto !== agoraTexto) {
            falhas.push(
              `a linha "${id}" imprime «${agoraTexto.slice(0, 60)}» e imprimia «${antesTexto.slice(0, 60)}».`,
            );
          }
        }
      }
    }
  }
  const ocorrencias = Object.values(selados).reduce((x, y) => x + y, 0);
  return `${Object.keys(selados).length} linha(s) citada(s) em ${ocorrencias} ocorrência(s) · ${Object.keys(motivos).length} motivo(s) declarado(s)${CONTRA ? ` · comparado com ${path.basename(CONTRA)}, valor a valor` : ''}`;
});

/* ========================================================================== */
/* As duas células do navegador                                               */
/* ========================================================================== */

async function comNavegador() {
  const { chromium, devices } = await import('playwright');
  const servidor = http.createServer((req, res) => {
    const u = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let f = path.join(DIST, u);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.statusCode = 404; res.end('404'); return; }
    const ext = path.extname(f);
    const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.csv': 'text/csv', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' }[ext] ?? 'application/octet-stream';
    res.setHeader('content-type', mime);
    res.end(fs.readFileSync(f));
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  const porta = servidor.address().port;
  const base = `http://127.0.0.1:${porta}`;
  const nav = await chromium.launch();

  /* ------------------------------------------------------------------ I3b */
  {
    /**
     * A BUSCA, MEDIDA NO NAVEGADOR E COM PERGUNTAS DE VERDADE (Major 13).
     *
     * A primeira passagem escrevia «divida» e uma palavra que não existe. As
     * duas passavam com um filtro que só olhasse ao IDENTIFICADOR, porque
     * `divida` está em dezenas de ids: a célula não distinguia uma busca por
     * nome de uma busca por slug. As perguntas passam a ser quatro, e cada uma
     * só pode ser respondida por um campo diferente do índice:
     *
     *   · «abandono escolar», um NOME de cartão com espaços, que nenhum id tem;
     *   · «mertola», um CONCELHO, que só existe nas 2 767 linhas que a página
     *     não lista: é a prova de que a busca cobre o livro-razão inteiro e não
     *     as 149 do documento;
     *   · «eurostat», uma FONTE;
     *   · uma palavra que não existe, que tem de dar a fila vazia.
     *
     * UMA PÁGINA POR CÉLULA. A célula corre no `npm run verify` desde a segunda
     * passagem, e um portão que abra dez páginas por célula é um portão que
     * ninguém corre: mede-se a edição portuguesa, e a inglesa fica para a
     * corrida larga (`--amostra-larga`), que é a do relatório.
     */
    /** @type {string[]} */
    const falhas = [];
    const notas = [];
    const rotas = AMOSTRA_LARGA ? ['/livro-razao', '/en/ledger'] : ['/livro-razao'];
    for (const rota of rotas) {
      const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } });
      const pag = await ctx.newPage();
      await pag.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
      const noDocumento = await pag.locator('.livro-item').count();

      /** Escreve e devolve quantas portas a fila mostra. */
      const procura = async (q) => {
        await pag.fill('input[type="search"]', q);
        await pag.waitForTimeout(150);
        return pag.locator('.livro-busca-porta:visible').count();
      };

      const porNome = await procura(rota === '/livro-razao' ? 'abandono escolar' : 'early school');
      const porConcelho = await procura('mertola');
      const porFonte = await procura('eurostat');
      const nenhum = await procura('zzzzzz-nao-existe-mesmo');
      const vazio = await pag.locator('[data-livro-sem-resultado]:visible').count();

      if (porNome < 1) falhas.push(`${rota}: uma busca por nome não devolveu nada.`);
      if (porConcelho < 1) {
        falhas.push(
          `${rota}: uma busca por concelho («mertola») não devolveu nada. As linhas dos ` +
            `concelhos não estão no documento: se a busca não as alcança, ela cobre ${noDocumento} ` +
            `linhas e não o livro-razão.`,
        );
      }
      if (porFonte < 1) falhas.push(`${rota}: uma busca por fonte não devolveu nada.`);
      if (nenhum !== 0) falhas.push(`${rota}: uma busca sem resultado deixou ${nenhum} porta(s) à vista.`);
      if (vazio !== 1) falhas.push(`${rota}: o estado vazio da busca não apareceu.`);
      notas.push(
        `${rota}: ${noDocumento} entradas no documento · por nome ${porNome} · por concelho ` +
          `${porConcelho} · por fonte ${porFonte} · sem resultado 0`,
      );
      medida.I3b = {
        ...(medida.I3b ?? {}),
        [rota]: { no_documento: noDocumento, por_nome: porNome, por_concelho: porConcelho, por_fonte: porFonte },
      };
      await ctx.close();
    }
    celulas.push({ id: 'I3b', nome: 'a busca filtra o livro-razão inteiro, no navegador', passa: falhas.length === 0, nota: notas.join(' · '), falhas });
  }

  /* ------------------------------------------------------------------- I7 */
  {
    /** @type {string[]} */
    const falhas = [];
    const linhas = paginas.filter((p) => ePaginaDeLinha(p.rota));
    /* AS DEZ COM O ENDEREÇO MAIS LONGO, e não dez ao acaso: é onde o transbordo
       aparece primeiro. Mais uma amostra de 50, a passo fixo sobre a lista
       ordenada, para que a amostra não dependa de nenhuma escolha. */
    const comprimento = (p) => {
      const el = dom(p).querySelector('[data-linha-campo="source_url"]');
      return texto(el).length;
    };
    const ordenadas = [...linhas].sort((a, b) => comprimento(b) - comprimento(a));
    /* UMA PÁGINA POR OMISSÃO, A AMOSTRA LARGA COM A BANDEIRA. A célula corre no
       `npm run verify` desde a segunda passagem: a que conta todos os dias é a
       do endereço mais longo, que é onde o transbordo aparece primeiro. A
       amostra de 60 é a do relatório, e corre-se com `--amostra-larga`. */
    let amostra = ordenadas.slice(0, 1);
    if (AMOSTRA_LARGA) {
      const dez = ordenadas.slice(0, 10);
      const resto = linhas.filter((p) => !dez.includes(p)).sort((a, b) => a.rota.localeCompare(b.rota));
      const passo = Math.max(1, Math.floor(resto.length / 50));
      amostra = [...dez, ...resto.filter((_, i) => i % passo === 0).slice(0, 50)];
    }
    const ctx = await nav.newContext({ ...devices['iPhone 13'] });
    let pior = 0;
    for (const p of amostra) {
      const pag = await ctx.newPage();
      await pag.goto(`${base}${p.rota}`, { waitUntil: 'load' });
      const transbordo = await pag.evaluate(() =>
        Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      );
      if (transbordo > 0) {
        falhas.push(`${p.rota}: ${transbordo}px de transbordo a 390.`);
        pior = Math.max(pior, transbordo);
      }
      await pag.close();
    }
    medida.I7 = { amostra: amostra.length, medidas: amostra.map((p) => p.rota), pior };
    await ctx.close();
    celulas.push({
      id: 'I7',
      nome: 'sem transbordo a 390 nas páginas de linha',
      passa: falhas.length === 0,
      nota: AMOSTRA_LARGA
        ? `${amostra.length} página(s) medidas (as 10 com o endereço mais longo, mais 50 a passo fixo)`
        : `${amostra.length} página(s) medida (a do endereço mais longo; a amostra de 60 corre com --amostra-larga)`,
      falhas,
    });
  }

  /* ------------------------------------------------------------------ I11 */
  {
    /**
     * O ESPAÇO ENTRE O NÚMERO E A PALAVRA, MEDIDO ONDE ELE SE PERDE (F1.4b).
     *
     * Um leitor viu «308concelhos» e «12trabalhos ·16edições» na primeira página
     * do telemóvel; a 1280 os espaços estavam lá. Nenhuma régua da casa o podia
     * ver, porque o espaço ESTÁ no HTML: vem dentro das cadeias
     * (`' concelhos'`), e o `textContent` mostra-o. Quem o apagava era a
     * rendição: abaixo dos 1024 a folha põe `.porta-conta { display: flex }`, e
     * num contentor flexível cada corrida de texto solto vira um item anónimo,
     * com o espaço aparado no princípio e no fim.
     *
     * POR ISSO ESTA CÉLULA NÃO LÊ TEXTO: MEDE. Para cada contagem, o vão entre a
     * borda direita da caixa do número e a primeira LETRA que vem a seguir, com
     * um `Range` de um carácter. Um espaço rendido a 13px vale uns 3,5px; um
     * espaço aparado vale zero.
     *
     * E TEM O SEU POSITIVO CONHECIDO, plantado na própria página: com
     * `.porta-conta-item { display: contents }` as caixas que este bloco
     * acrescentou desaparecem e o texto volta a ser um item anónimo, que é
     * exactamente o defeito que esteve no ar. A célula tem de o ver. Uma régua
     * que nunca ficou vermelha não prova nada (regra 14 da casa).
     */
    /** @type {string[]} */
    const falhas = [];
    const notas = [];
    /** O vão mínimo, em px: um espaço a 13px vale ~3,5 e um aparado vale 0. */
    const VAO_MINIMO = 1.5;

    /* A função corre DENTRO da página. Devolve um par por contagem. */
    const medeOsVaos = () => {
      /** @type {{onde: string, numero: string, palavra: string, vao: number}[]} */
      const pares = [];
      for (const conta of document.querySelectorAll('.porta-conta')) {
        const nos = [];
        const andarilho = document.createTreeWalker(conta, NodeFilter.SHOW_ALL);
        while (andarilho.nextNode()) nos.push(andarilho.currentNode);
        for (let i = 0; i < nos.length; i++) {
          const el = nos[i];
          if (el.nodeType !== 1 || !(/** @type {Element} */ (el)).hasAttribute('data-prova')) continue;
          const caixa = (/** @type {Element} */ (el)).getBoundingClientRect();
          /* A primeira letra depois deste número, saltando o que for espaço. */
          for (let j = i + 1; j < nos.length; j++) {
            const n = nos[j];
            if (n.nodeType === 1 && (/** @type {Element} */ (n)).hasAttribute('data-prova')) break;
            if (n.nodeType !== 3) continue;
            /* O texto do PRÓPRIO número vem depois dele na ordem do documento
               (o «308» é filho do `<span data-prova>`): salta-se, senão a régua
               media o vão entre a caixa e o algarismo que ela contém. */
            if (el.contains(n)) continue;
            const s = n.textContent ?? '';
            const k = s.search(/[^\s]/);
            if (k < 0) continue;
            if (!/[\p{L}]/u.test(s[k])) break;
            const r = document.createRange();
            r.setStart(n, k);
            r.setEnd(n, k + 1);
            const letra = r.getBoundingClientRect();
            pares.push({
              onde: (/** @type {Element} */ (el)).getAttribute('data-prova') ?? '?',
              numero: (el.textContent ?? '').trim(),
              palavra: s.slice(k, k + 12).trim(),
              vao: Math.round((letra.left - caixa.right) * 100) / 100,
            });
            break;
          }
        }
      }
      return pares;
    };

    const ctx = await nav.newContext({ viewport: { width: 390, height: 800 } });
    /** @type {Record<string, unknown>} */
    const medidos = {};
    for (const rota of ['/', '/en/']) {
      const pag = await ctx.newPage();
      await pag.goto(`${base}${rota}`, { waitUntil: 'networkidle' });

      const pares = await pag.evaluate(medeOsVaos);
      if (pares.length === 0) {
        falhas.push(`${rota}: nenhuma contagem medida a 390. A régua não viu nada.`);
      }
      for (const par of pares) {
        if (par.vao < VAO_MINIMO) {
          falhas.push(
            `${rota}: «${par.numero}» e «${par.palavra}» ficam a ${par.vao}px a 390. ` +
              `O espaço está no texto e a rendição apara-o.`,
          );
        }
      }

      /* O POSITIVO CONHECIDO, plantado. */
      await pag.addStyleTag({ content: '.porta-conta-item{display:contents}' });
      const comDefeito = await pag.evaluate(medeOsVaos);
      const apanhados = comDefeito.filter((x) => x.vao < VAO_MINIMO).length;
      if (apanhados === 0) {
        falhas.push(
          `${rota}: com o defeito plantado (\`.porta-conta-item{display:contents}\`, que devolve ` +
            `o texto a item anónimo) a régua continuou verde. Ela não sabe ver o defeito que ` +
            `esteve no ar, e por isso não prova nada.`,
        );
      }

      medidos[rota] = { pares, plantado_apanhado: apanhados, de: comDefeito.length };
      notas.push(
        `${rota}: ${pares.length} contagem(ns), vão mínimo ` +
          `${pares.length ? Math.min(...pares.map((x) => x.vao)) : 0}px · com o defeito plantado, ` +
          `${apanhados} de ${comDefeito.length} apanhada(s)`,
      );
      await pag.close();
    }
    await ctx.close();
    medida.I11 = medidos;
    celulas.push({
      id: 'I11',
      nome: 'o espaço entre o número e a palavra, a 390',
      passa: falhas.length === 0,
      nota: notas.join(' · '),
      falhas,
    });
  }

  /* ------------------------------------------------------------- capturas */
  if (CAPTURAS) {
    /**
     * A NOMENCLATURA É A DA CASA: `<edicao>-<pagina>-<largura>-<que>.png`, com
     * `primeiro-ecra` e `pagina` como as outras pastas de capturas deste sítio.
     * As larguras são as duas do brief: o telemóvel a 390 × 664 e a coluna do
     * computador a 1 280.
     *
     * A PÁGINA DE LINHA ESCOLHIDA É A DO ENDEREÇO MAIS LONGO, e não uma ao
     * acaso: é onde o item 7 do brief se vê, e é a mesma que a célula I7 mede
     * primeiro.
     */
    fs.mkdirSync(CAPTURAS, { recursive: true });
    /* A ESCOLHA FAZ-SE ENTRE AS PÁGINAS PORTUGUESAS, e a inglesa deriva do slug:
       ordenar as duas edições juntas escolhia uma vez a inglesa e a «tradução»
       para português nunca acontecia, o que dava duas capturas da mesma página
       com nomes diferentes. */
    const porEndereco = [...paginas.filter((p) => ePaginaDeLinha(p.rota) && p.lang === 'pt')].sort(
      (a, b) =>
        texto(dom(b).querySelector('[data-linha-campo="source_url"]')).length -
        texto(dom(a).querySelector('[data-linha-campo="source_url"]')).length,
    );
    const linhaLonga = porEndereco[0];
    const slugDaLinha = linhaLonga.rota.replace('/livro-razao/', '');
    const alvos = [
      ['pt-livro', '/livro-razao', false],
      ['en-livro', '/en/ledger', false],
      ['pt-area', '/areas/economia-e-coesao-territorial', false],
      ['en-area', '/en/areas/economia-e-coesao-territorial', false],
      ['pt-linha', `/livro-razao/${slugDaLinha}`, true],
      ['en-linha', `/en/ledger/${slugDaLinha}`, true],
      ['pt-areas', '/areas', true],
      ['en-areas', '/en/areas', true],
      ['pt-distrito', '/distritos/evora', true],
      ['en-distrito', '/en/districts/evora', true],
      /* O ARQUIVO ENTRA NA SEGUNDA PASSAGEM: é onde a decisão sobre as datas de
         publicação se vê (dezasseis edições com a data do repositório, e o
         marcador a sair de treze linhas). */
      ['pt-estudos', '/estudos', true],
      ['en-estudos', '/en/studies', true],
    ];
    for (const [largura, altura, sufixo] of [
      [390, 664, '390x664'],
      [1280, 800, '1280'],
    ]) {
      const ctx = await nav.newContext({
        viewport: { width: largura, height: altura },
        deviceScaleFactor: 2,
      });
      for (const [nome, rota, inteira] of alvos) {
        const pag = await ctx.newPage();
        await pag.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
        await pag.screenshot({ path: path.join(CAPTURAS, `${nome}-${sufixo}-primeiro-ecra.png`) });
        if (inteira) {
          await pag.screenshot({
            path: path.join(CAPTURAS, `${nome}-${sufixo}-pagina.png`),
            fullPage: true,
          });
        }
        await pag.close();
      }
      await ctx.close();
    }
    console.log(cinza(`        capturas em ${CAPTURAS} (a linha é ${linhaLonga.rota})`));
  }

  await nav.close();
  await new Promise((r) => servidor.close(r));
}

/* ========================================================================== */
/* A saída                                                                    */
/* ========================================================================== */

const fim = async () => {
  if (NAVEGADOR) await comNavegador();

  console.log('');
  console.log(`  A RÉGUA DOS NOMES, DAS DATAS E DO ÍNDICE · ${paginas.length} página(s) de ${DIST}`);
  console.log('');
  let falhou = false;
  for (const c of celulas) {
    console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.id} · ${c.nome}`);
    if (c.nota) console.log(cinza(`        ${c.nota}`));
    for (const f of c.falhas.slice(0, 8)) console.log(vermelho(`        · ${f}`));
    if (c.falhas.length > 8) console.log(vermelho(`        · … e mais ${c.falhas.length - 8}`));
    if (!c.passa) falhou = true;
  }
  console.log('');

  if (JSON_SAIDA) {
    fs.mkdirSync(path.dirname(path.resolve(JSON_SAIDA)), { recursive: true });
    fs.writeFileSync(
      JSON_SAIDA,
      JSON.stringify(
        {
          dist: DIST,
          paginas: paginas.length,
          celulas: celulas.map((c) => ({ id: c.id, nome: c.nome, passa: c.passa, nota: c.nota, falhas: c.falhas })),
          medida,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(cinza(`  medição em ${JSON_SAIDA}`));
    console.log('');
  }
  process.exit(falhou ? 1 : 0);
};

fim();
