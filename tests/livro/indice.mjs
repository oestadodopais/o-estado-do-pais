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
 *   node tests/livro/indice.mjs --navegador                (I3b e I7)
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
 * I3 (G3) · **a busca existe e é um formulário.** Um `input[type=search]` em
 *      `/livro-razao` e em `/en/ledger`, dentro de um `<form method="get">` com
 *      destino, com nome de campo e com um rótulo preso a ele. Com
 *      `--navegador`, a filtragem é medida no navegador.
 * I4 (G4) · **a palavra contada tem definição na página onde aparece.**
 * I5 (G5) · **as contagens do índice com denominador**, nas duas edições.
 * I6 (G6) · **o marcador com um destino só.** Todas as ligações do marcador de
 *      uma edição apontam para a mesma página, e um marcador que NÃO é ligação
 *      só existe dentro de um selo, que é a excepção escrita da Emenda 2.
 * I7 (G7) · **sem transbordo a 390** nas páginas de linha (com `--navegador`).
 * I8 (G8) · **a página de uma unidade da Carta** diz o que tem e não ganhou
 *      número nenhum: as linhas citadas continuam a ser só a da Carta.
 * I9 (G9) · **o marcador dos estudos**, no índice, a no máximo um por trabalho.
 * I10 (G10) · **nenhum número novo.** O inventário dos valores selados e dos
 *      motivos `data-nonledger` sai em `--json`; com `--contra` compara-se com o
 *      de antes e a diferença fecha a régua.
 *
 * ---------------------------------------------------------------------------
 * AS CÓPIAS LOCAIS, E PORQUE SÃO CÓPIAS
 * ---------------------------------------------------------------------------
 * A forma da data, a cadeia do marcador e a frase que define a palavra contada
 * estão ESCRITAS AQUI, e não importadas do sítio. É a disciplina que
 * `scripts/gate-html.mjs` escreve por extenso: uma régua que leia a regra pela
 * mesma função que a escreve confirma a função, não o sítio. Uma cadeia que mude
 * do outro lado tem de fazer esta régua falhar, e não acompanhá-la em silêncio.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

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

/** A data ISO, tal como o livro-razão a guarda. */
const ISO = /\b\d{4}-\d{2}-\d{2}\b/;
const ISO_G = /\b\d{4}-\d{2}-\d{2}\b/g;
/** Um texto que é UMA data ISO e mais nada. */
const SO_ISO = /^\s*\d{4}-\d{2}-\d{2}\s*$/;
/** O único marcador de incerteza do sítio (`IDENTIDADE.md` §6). */
const MARCADOR = '[a verificar]';
/** As duas páginas do marcador, uma por edição. */
const PORTA_DO_MARCADOR = { pt: '/a-verificar', en: '/en/to-verify' };
/** A forma de um identificador de linha: minúsculas, algarismos e hífenes. */
const FORMA_DE_SLUG = /^[a-z0-9]+(?:-[a-z0-9.]+)+$/;
/** A palavra contada em `/areas`, e a frase que a define, nas duas edições. */
const PALAVRA_CONTADA = { pt: /\bpeças?\b/i, en: /\bpieces?\b/i };
const DEFINICAO = {
  pt: 'Uma peça é um trabalho, um estudo de dados ou uma medida.',
  en: 'A piece is a study, a data study or a measure.',
};
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
      if (nome) {
        comNome++;
        const t = texto(nome);
        if (t === id) falhas.push(`${pag.rota}: o nome de "${id}" é o próprio identificador.`);
        else if (FORMA_DE_SLUG.test(t)) {
          falhas.push(`${pag.rota}: o nome de "${id}" tem a forma de um identificador ("${t}").`);
        }
      } else semNome++;
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
  return `${alvo.length} página(s) · ${itens} entrada(s) · ${comNome} com nome · ${semNome} sem nome (linhas derivadas, sem fonte e sem documento) · ${idEmMetadado} identificador(es) em metadado`;
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
celula('I3', 'a busca do índice é um formulário', (falhas) => {
  const alvo = paginas.filter((p) => ePaginaDeIndiceDoLivro(p.rota));
  if (alvo.length !== 2) falhas.push(`esperava 2 páginas de índice do livro-razão e há ${alvo.length}.`);
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
    if (!forma.getAttribute('action')) falhas.push(`${pag.rota}: o formulário da busca não tem destino.`);
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
  return `${alvo.length} índice(s) com um campo de busca dentro de um <form method="get">`;
});

/* --------------------------------------------------------------------- I4 */
celula('I4', 'a palavra contada tem definição onde aparece', (falhas) => {
  let ocorrencias = 0;
  let paginasComPalavra = 0;
  let foraDoAmbito = 0;
  for (const pag of paginas) {
    const raiz = dom(pag);
    const corpo = raiz;
    /* A PALAVRA CONTA QUANDO É DA CASA. Dentro de uma transcrição ela é da fonte,
       e a casa não edita o que transcreve: um documento alojado que escreva
       «peça» não põe vocabulário nenhum na boca do sítio. É a mesma fronteira
       que `scripts/medir-defeitos.mjs` usa para separar a prosa da casa do
       resto. */
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
    anda(corpo);
    const t = partes.join(' ').replace(/\s+/g, ' ');
    const re = PALAVRA_CONTADA[pag.lang];
    const achados = t.match(new RegExp(re.source, 'gi'));
    if (!achados) continue;
    /**
     * ONDE A PALAVRA É O RÓTULO DE UMA CONTAGEM, e é aí que a auditoria a
     * apanhou: o índice das áreas de governo escreve «Saúde · 1 peça» nove
     * vezes. Fora dali ela aparece em três sítios que este bloco não governa, e
     * a régua conta-os à parte em vez de os calar:
     *
     *   · `/metodo` e `/sobre` são a casa do método, e a Emenda 15 isenta-os por
     *     escrito: é onde o vocabulário da casa se pode explicar;
     *   · um documento alojado é o texto da FONTE, e a casa não edita o que
     *     transcreve.
     */
    const eOIndiceDasAreas = pag.rota === '/areas' || pag.rota === '/en/areas';
    if (!eOIndiceDasAreas) {
      foraDoAmbito += achados.length;
      continue;
    }
    paginasComPalavra++;
    ocorrencias += achados.length;
    if (!texto(corpo).includes(DEFINICAO[pag.lang])) {
      falhas.push(`${pag.rota}: ${achados.length} ocorrência(s) da palavra contada sem a definição na mesma página.`);
    }
  }
  medida.I4 = { paginas: paginasComPalavra, ocorrencias, fora_do_ambito: foraDoAmbito };
  return `${ocorrencias} ocorrência(s) como rótulo de contagem em ${paginasComPalavra} página(s), todas com a definição na mesma página · ${foraDoAmbito} noutras páginas (o Método, o Sobre e os documentos alojados, fora do âmbito deste bloco)`;
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
  medida.I8 = { paginas: alvo.length, linhas: [...linhasCitadas] };
  return `${alvo.length} página(s), cada uma com a frase do índice e sem uma linha que não seja a da Carta`;
});

/* --------------------------------------------------------------------- I9 */
celula('I9', 'o marcador dos estudos, uma vez por trabalho', (falhas) => {
  let trabalhos = 0;
  let comMarcador = 0;
  for (const pag of paginas.filter((p) => p.rota === '/estudos' || p.rota === '/en/studies')) {
    for (const artigo of dom(pag).querySelectorAll('article.arquivo-item')) {
      trabalhos++;
      const datas = artigo.querySelectorAll('[data-nonledger="data-de-publicacao"]');
      let n = 0;
      for (const d of datas) if (texto(d).includes(MARCADOR)) n++;
      if (n > 1) falhas.push(`${pag.rota}: um trabalho com ${n} marcadores de data.`);
      if (n === 1) comMarcador++;
    }
  }
  medida.I9 = { trabalhos, com_marcador: comMarcador };
  return `${trabalhos} linha(s) de trabalho, ${comMarcador} com o marcador da data, nenhuma com mais do que um`;
});

/* -------------------------------------------------------------------- I10 */
celula('I10', 'nenhum número novo', (falhas) => {
  /** @type {Record<string, number>} */
  const selados = {};
  /** @type {Record<string, number>} */
  const motivos = {};
  for (const pag of paginas) {
    for (const el of dom(pag).querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim') ?? '';
      selados[id] = (selados[id] ?? 0) + 1;
    }
    for (const el of dom(pag).querySelectorAll('[data-nonledger]')) {
      const m = el.getAttribute('data-nonledger') ?? '';
      motivos[m] = (motivos[m] ?? 0) + 1;
    }
  }
  medida.I10 = { selados, motivos };
  if (Object.keys(selados).length === 0) falhas.push('nenhum valor selado em dist/: a varredura não viu nada.');
  if (CONTRA) {
    if (!fs.existsSync(CONTRA)) falhas.push(`não existe ${CONTRA}.`);
    else {
      const antes = JSON.parse(fs.readFileSync(CONTRA, 'utf8'));
      const a = antes.medida?.I10 ?? {};
      for (const id of Object.keys(selados)) {
        if (!(id in (a.selados ?? {}))) falhas.push(`a linha "${id}" passou a ser citada e não era.`);
      }
      for (const id of Object.keys(a.selados ?? {})) {
        if (!(id in selados)) falhas.push(`a linha "${id}" deixou de ser citada.`);
      }
      for (const m of Object.keys(motivos)) {
        if (!(m in (a.motivos ?? {}))) falhas.push(`o motivo "${m}" é novo.`);
      }
    }
  }
  return `${Object.keys(selados).length} linha(s) citada(s) · ${Object.keys(motivos).length} motivo(s) declarado(s)${CONTRA ? ` · comparado com ${path.basename(CONTRA)}` : ''}`;
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
    /** @type {string[]} */
    const falhas = [];
    const notas = [];
    for (const rota of ['/livro-razao', '/en/ledger']) {
      const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } });
      const pag = await ctx.newPage();
      await pag.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
      const antes = await pag.locator('.livro-item:visible').count();
      await pag.fill('input[type="search"]', 'divida');
      await pag.waitForTimeout(120);
      const depois = await pag.locator('.livro-item:visible').count();
      await pag.fill('input[type="search"]', 'zzzzzz-nao-existe');
      await pag.waitForTimeout(120);
      const nenhum = await pag.locator('.livro-item:visible').count();
      const vazio = await pag.locator('[data-livro-sem-resultado]:visible').count();
      if (!(depois > 0 && depois < antes)) {
        falhas.push(`${rota}: a busca não filtrou (${antes} antes, ${depois} depois).`);
      }
      if (nenhum !== 0) falhas.push(`${rota}: uma busca sem resultado deixou ${nenhum} entrada(s) à vista.`);
      if (vazio !== 1) falhas.push(`${rota}: o estado vazio da busca não apareceu.`);
      notas.push(`${rota}: ${antes} → ${depois} com «divida», 0 com uma palavra que não existe`);
      medida.I3b = { ...(medida.I3b ?? {}), [rota]: { antes, depois } };
      await ctx.close();
    }
    celulas.push({ id: 'I3b', nome: 'a busca filtra, no navegador', passa: falhas.length === 0, nota: notas.join(' · '), falhas });
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
    const dez = ordenadas.slice(0, 10);
    const resto = linhas.filter((p) => !dez.includes(p)).sort((a, b) => a.rota.localeCompare(b.rota));
    const passo = Math.max(1, Math.floor(resto.length / 50));
    const cinquenta = resto.filter((_, i) => i % passo === 0).slice(0, 50);
    const amostra = [...dez, ...cinquenta];
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
    medida.I7 = { amostra: amostra.length, dez_mais_longas: dez.map((p) => p.rota), pior };
    await ctx.close();
    celulas.push({
      id: 'I7',
      nome: 'sem transbordo a 390 nas páginas de linha',
      passa: falhas.length === 0,
      nota: `${amostra.length} página(s) medidas (as 10 com o endereço mais longo, mais 50 a passo fixo)`,
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
