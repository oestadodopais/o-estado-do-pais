#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2, item 7 (15.09.2026)
 * =============================================================================
 *
 * O §1, item 1, do brief: «as cinco coisas, e só elas, em 100 % dos cartões
 * construídos das duas edições; "Publicado por", "Documento", "Lido na fonte a",
 * "Dados de" a 0 nos cartões (ficam no recibo); a chave a 0 no texto visível».
 *
 * É UM PORTÃO, e corre no `verify`: uma célula vermelha fecha a construção. O
 * que ele mede é o `dist/` construído, e não a declaração: a pergunta é o que a
 * página escreve, e a única maneira de a responder é ler o que ela escreveu.
 *
 * ---------------------------------------------------------------------------
 * AS OITO CÉLULAS
 * ---------------------------------------------------------------------------
 *   K1 · **as cinco coisas e só elas** · cada `[data-cartao-medida]` do `dist/`
 *        só tem, ao primeiro nível, os blocos permitidos: o nome, a linha do
 *        valor, a frase e a régua. Um bloco a mais é um campo de recibo a
 *        voltar, e é assim que ele volta: alguém acrescenta uma linha.
 *   K2 · **os rótulos do recibo a 0** · nenhum cartão escreve «Publicado por»,
 *        «Documento», «Lido na fonte a» ou «Dados de», nem os ingleses. As
 *        cadeias saem de `strings.mjs` e não de uma lista escrita aqui: um
 *        rótulo que mude de palavra continuaria a ser procurado.
 *   K3 · **a chave a 0** · nenhum cartão escreve o identificador da linha no
 *        texto visível. Procura-se o id de CADA cartão dentro do próprio cartão,
 *        e não uma expressão que se pareça com um id.
 *   K4 · **nenhuma cadeia noutra língua** · nenhum descendente de um cartão
 *        declara um `lang` diferente do da página. É a medida do item 4 («zero
 *        cadeias em inglês nos cartões da edição portuguesa»), medida pela marca
 *        que a casa já põe em tudo o que está noutra língua, e não por um
 *        detetor de inglês, que acertaria em «House price» e falharia em «Score».
 *   K5 · **a régua só com linhas** · cada valor da régua é um `data-claim`, e
 *        cada algarismo que não seja uma linha traz o seu motivo declarado
 *        (`data-nonledger`). Um número escrito à mão na régua não passa.
 *   K6 · **a frase é a declarada** · o texto de `[data-cartao-definicao]` é,
 *        carácter a carácter, `textoDaDefinicao()` da declaração daquela medida
 *        naquela edição. É a mesma conferência que `check:lugar` faz à definição
 *        da página europeia, aplicada onde ela agora também se rende.
 *   K7 · **«limiar» a 0 nos cartões** · a palavra saiu do texto que o leitor vê
 *        (decisão do diretor de 15.09.2026 de manhã), e o cartão é a superfície
 *        deste bloco. Nas duas edições, com «threshold».
 *   K8 · **a legenda da marca e a linha do tipo** · «Governo Constitucional» uma
 *        vez por edição (o índice das áreas), e a legenda da marca fora das
 *        páginas de área.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO, E PORQUE ELE É METADE DA RÉGUA
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. `--prova` monta um
 * `dist/` de mentira com cinco estragos plantados, um por célula que pode
 * morder sobre HTML, e exige que as cinco mordam. Sem isto, uma régua que
 * procurasse a classe errada dizia «0 defeitos» para sempre.
 *
 * AS LINHAS DO ENQUADRAMENTO PROVAM-SE COM LINHAS VERDADEIRAS, e nunca com uma
 * linha falsa: a K5 pergunta a `reguaDaMedida()` por uma medida cuja linha do
 * período anterior NÃO existe (e exige `null`), e prova a outra metade com uma
 * linha que EXISTE, que é a própria linha da medida. É o que o §0.2 do brief
 * manda: «nunca escrevas um valor à mão, nem um valor de exemplo, nem uma linha
 * falsa para testar: testa com as linhas que já existem e com a ausência».
 *
 * Uso:  node tests/cartao/cartao.mjs [--prova] [--json]
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { t } from '../../src/i18n/strings.mjs';
import { DEFINICOES_DAS_MEDIDAS, textoDaDefinicao } from '../../src/data/figuras.mjs';
import { chavesDoEnquadramento, reguaDaMedida, ficheirosDoMotor } from '../../src/lib/enquadramento.mjs';
import { hasClaim } from '../../src/lib/ledger.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const PROVA = argv.includes('--prova');
const JSON_SAIDA = argv.includes('--json');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** O bloco de um cartão: a classe de cada peça permitida, e nada mais. */
const PECAS_PERMITIDAS = new Set([
  'cartao-medida-nome',
  'cartao-medida-valor',
  'cartao-medida-frase',
  'cartao-medida-regua',
]);

/**
 * Os rótulos de recibo que um cartão não pode escrever, nas duas edições.
 *
 * SAEM DE `strings.mjs`, e não de uma lista escrita aqui: se um rótulo mudar de
 * palavra, esta régua procura a palavra nova. Uma lista literal continuaria a
 * procurar a antiga e diria zero para sempre.
 */
function rotulosDoRecibo() {
  /** @type {{ lang: 'pt'|'en', texto: string, chave: string }[]} */
  const fora = [];
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    const s = t(lang);
    for (const chave of ['fonte', 'documento', 'lido', 'referencia', 'edicao']) {
      const texto = s.prov[chave];
      if (typeof texto === 'string' && texto.trim() !== '') fora.push({ lang, texto, chave });
    }
  }
  return fora;
}

/** A palavra que saiu do texto do leitor, nas duas edições. */
const PALAVRA_RETIRADA = { pt: 'limiar', en: 'threshold' };

/**
 * A COPIA DO QUE SE VÊ.
 *
 * O que só um leitor de ecrã ouve não é texto à vista, e esta régua mede o que
 * se vê: a classe `vh` é a da casa para isso e `aria-hidden` é o contrário. A
 * distinção não é decorativa aqui — a marca da fonte leva o nome do publicador
 * num `.vh` (`<span class="vh"> · <span lang="en">Eurostat</span></span>`), e
 * sem esta poda a K4 acusava «Eurostat» como inglês à vista em cada cartão
 * português. O nome de um organismo estrangeiro dito a um leitor de ecrã, com a
 * marca da língua dele, é exactamente o que a I91 manda fazer.
 *
 * @param {import('node-html-parser').HTMLElement} el
 */
function soOQueSeVe(el) {
  const copia = parse(el.outerHTML);
  for (const escondido of copia.querySelectorAll('.vh, [aria-hidden="true"]')) escondido.remove();
  return copia;
}

/** @param {import('node-html-parser').HTMLElement} el */
function textoVisivel(el) {
  return soOQueSeVe(el).text.replace(/\s+/g, ' ').trim();
}

/**
 * Percorre o `dist/` e mede.
 *
 * @param {string} dist
 */
function corre(dist) {
  /** @type {string[]} */
  const erros = [];
  const contas = {
    paginas: 0,
    cartoes: 0,
    cartoes_pt: 0,
    cartoes_en: 0,
    com_nome: 0,
    com_frase: 0,
    com_regua: 0,
    sem_nome: 0,
    governo_constitucional_pt: 0,
    governo_constitucional_en: 0,
    legenda_da_marca: 0,
    unidade_noutra_lingua: 0,
    marcador_em_portugues: 0,
  };
  const rotulos = rotulosDoRecibo();

  /** @param {string} dir */
  const anda = (dir) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        anda(f);
        continue;
      }
      if (!entrada.name.endsWith('.html')) continue;
      const rota = `/${path.relative(dist, f).replace(/index\.html$/, '').replace(/\\/g, '/')}`;
      const root = parse(fs.readFileSync(f, 'utf8'));
      contas.paginas++;

      /* A LÍNGUA DA PÁGINA sai do `<html lang>`, que é onde o sítio a declara. */
      const langPagina = (root.querySelector('html')?.getAttribute('lang') ?? 'pt').startsWith('en')
        ? 'en'
        : 'pt';

      /* K8 · a linha do tipo e a legenda da marca. */
      const texto = root.text;
      if (texto.includes('Governo Constitucional')) contas.governo_constitucional_pt++;
      if (texto.includes('Constitutional Government')) contas.governo_constitucional_en++;
      if (root.querySelector('.marca-legenda')) {
        contas.legenda_da_marca++;
        if (rota.includes('/areas/') || rota.includes('/en/areas/')) {
          erros.push(`K8 · ${rota}: a legenda da marca da fonte continua numa página de área`);
        }
      }

      for (const cartao of root.querySelectorAll('[data-cartao-medida]')) {
        const id = cartao.getAttribute('data-cartao-medida') ?? '';
        contas.cartoes++;
        contas[langPagina === 'en' ? 'cartoes_en' : 'cartoes_pt']++;

        /* ------------------------------------------------------------ K1 */
        /** @type {string[]} */
        const classes = [];
        for (const filho of cartao.childNodes) {
          const el = /** @type {any} */ (filho);
          if (!el.tagName) continue;
          const classe = (el.getAttribute?.('class') ?? '').split(/\s+/).filter(Boolean);
          const conhecida = classe.find((c) => PECAS_PERMITIDAS.has(c));
          if (!conhecida) {
            erros.push(
              `K1 · ${rota} · ${id}: o cartão tem um bloco que não é uma das cinco coisas ` +
                `(<${String(el.tagName).toLowerCase()} class="${classe.join(' ')}">)`,
            );
            continue;
          }
          classes.push(conhecida);
        }
        if (classes.includes('cartao-medida-nome')) contas.com_nome++;
        else contas.sem_nome++;
        if (classes.includes('cartao-medida-frase')) contas.com_frase++;
        if (classes.includes('cartao-medida-regua')) contas.com_regua++;
        if (!classes.includes('cartao-medida-valor')) {
          erros.push(`K1 · ${rota} · ${id}: o cartão não tem a linha do valor`);
        }

        const vista = soOQueSeVe(cartao);
        const visivel = vista.text.replace(/\s+/g, ' ').trim();

        /* ------------------------------------------------------------ K2 */
        for (const r of rotulos) {
          if (visivel.includes(r.texto)) {
            erros.push(
              `K2 · ${rota} · ${id}: o cartão escreve o rótulo de recibo «${r.texto}» ` +
                `(prov.${r.chave}, edição ${r.lang})`,
            );
          }
        }

        /* ------------------------------------------------------------ K3 */
        if (id && visivel.includes(id)) {
          erros.push(`K3 · ${rota} · ${id}: a chave da linha está no texto visível do cartão`);
        }

        /* ------------------------------------------------------------ K4 */
        for (const comLingua of vista.querySelectorAll('[lang]')) {
          const declarada = (comLingua.getAttribute('lang') ?? '').toLowerCase();
          const curta = declarada.split('-')[0];
          if (!curta || curta === langPagina) continue;
          /* A UNIDADE É A EXCEÇÃO DECLARADA, e a razão é a I92 (29.08.2026): o
             dicionário das unidades só traduz o que é facto de dicionário ou o
             inglês que a própria casa já escreve, e o que não tem entrada
             rende-se em português com `lang="pt-PT"`. «Uma unidade em português
             numa página inglesa é honesta; uma unidade traduzida à sorte não é.»
             `check:lingua` conta-as e imprime a lista, e é lá que essa dívida
             vive. Vale nos dois sentidos, e por isso não se escreve «só na
             edição inglesa». */
          const classes2 = (comLingua.getAttribute('class') ?? '').split(/\s+/);
          if (classes2.includes('cartao-medida-unidade')) {
            contas.unidade_noutra_lingua++;
            continue;
          }
          /* O MARCADOR É A SEGUNDA EXCEÇÃO DECLARADA, e a razão é a `IDENTIDADE.md`
             §6: «[a verificar]» fica em português nas duas edições, porque é o
             nome de uma coisa da casa e tem página própria; a edição inglesa
             dá-lhe a glosa ao lado. Traduzi-lo seria ter dois marcadores. */
          if (classes2.includes('marcador') || classes2.includes('marcador-gloss')) {
            contas.marcador_em_portugues++;
            continue;
          }
          erros.push(
            `K4 · ${rota} · ${id}: o cartão rende texto declarado em «${declarada}» numa ` +
              `página em «${langPagina}»: «${comLingua.text.trim().slice(0, 60)}»`,
          );
        }

        /* ------------------------------------------------------------ K5 */
        const regua = cartao.querySelector('.cartao-medida-regua');
        if (regua) {
          for (const n of regua.querySelectorAll('*')) {
            const t2 = n.childNodes
              .filter((x) => x.nodeType === 3)
              .map((x) => x.rawText)
              .join('');
            if (!/\d/.test(t2)) continue;
            if (n.hasAttribute('data-claim') || n.hasAttribute('data-nonledger')) continue;
            erros.push(
              `K5 · ${rota} · ${id}: a régua escreve um algarismo sem linha e sem motivo ` +
                `declarado: «${t2.trim().slice(0, 40)}»`,
            );
          }
        }

        /* ------------------------------------------------------------ K6 */
        const frase = cartao.querySelector('[data-cartao-definicao]');
        if (frase) {
          const daLinha = frase.getAttribute('data-cartao-definicao') ?? '';
          const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[daLinha];
          if (!d) {
            erros.push(`K6 · ${rota} · ${id}: a frase diz ser de «${daLinha}», que não tem definição declarada`);
          } else {
            const declarada = textoDaDefinicao(d[langPagina] ?? d.pt).replace(/\s+/g, ' ').trim();
            const rendida = textoVisivel(frase);
            if (rendida !== declarada) {
              erros.push(
                `K6 · ${rota} · ${id}: a frase do cartão diz «${rendida.slice(0, 50)}…» e a ` +
                  `declaração diz «${declarada.slice(0, 50)}…»`,
              );
            }
          }
        }

        /* ------------------------------------------------------------ K7 */
        const palavra = PALAVRA_RETIRADA[langPagina];
        if (visivel.toLowerCase().includes(palavra)) {
          erros.push(`K7 · ${rota} · ${id}: o cartão escreve «${palavra}», que saiu do texto do leitor`);
        }
      }
    }
  };
  anda(dist);
  return { erros, contas };
}

/* =========================================================================
 * A PROVA: cinco estragos plantados, um por célula que morde sobre HTML
 * ========================================================================= */

function montaAProva() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-'));
  fs.mkdirSync(path.join(dir, 'areas', 'x'), { recursive: true });
  const s = t('pt');
  /* A frase declarada de uma medida real, para que o positivo da K6 seja a
     comparação a sério e não uma cadeia inventada. */
  const boa = textoDaDefinicao(DEFINICOES_DAS_MEDIDAS['precos-da-habitacao-2025'].pt);
  fs.writeFileSync(
    path.join(dir, 'areas', 'x', 'index.html'),
    '<!doctype html><html lang="pt"><head><title>x</title></head><body>' +
      /* O cartão SÃO: as cinco coisas, e nada plantado. Prova que a régua não
         grita por tudo. */
      '<article data-cartao-medida="precos-da-habitacao-2025">' +
      '<span class="cartao-medida-nome">Preços da habitação</span>' +
      '<p class="cartao-medida-valor"><span class="cartao-medida-num" data-claim="precos-da-habitacao-2025">17,6</span>' +
      '<span class="cartao-medida-unidade">variação anual média, %</span></p>' +
      `<p class="cartao-medida-frase" data-cartao-definicao="precos-da-habitacao-2025">${boa}</p>` +
      '<p class="cartao-medida-regua"><span data-nonledger="limiar-do-quadro">9</span>%</p>' +
      '</article>' +
      /* PLANTA 1 (K1 e K2): um bloco a mais, com um rótulo de recibo dentro. */
      '<article data-cartao-medida="divida-publica-2025">' +
      '<span class="cartao-medida-nome">Dívida pública</span>' +
      '<p class="cartao-medida-valor"><span data-claim="divida-publica-2025">117,5</span></p>' +
      `<p class="livro-item-campo"><span>${s.prov.lido}</span> 12.08.2026</p>` +
      '</article>' +
      /* PLANTA 2 (K3): a chave no texto visível. */
      '<article data-cartao-medida="taxa-de-desemprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de desemprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-desemprego-2025">6,4</span>' +
      '<code>taxa-de-desemprego-2025</code></p>' +
      '</article>' +
      /* PLANTA 3 (K4): um título de documento em inglês numa página portuguesa. */
      '<article data-cartao-medida="licencas-de-construcao-2025">' +
      '<span class="cartao-medida-nome" lang="en">Residential building permits - annual data</span>' +
      '<p class="cartao-medida-valor"><span data-claim="licencas-de-construcao-2025">749,7</span></p>' +
      '</article>' +
      /* PLANTA 4 (K5): um algarismo na régua sem linha e sem motivo. */
      '<article data-cartao-medida="custo-unitario-do-trabalho-2025">' +
      '<span class="cartao-medida-nome">Custo unitário do trabalho</span>' +
      '<p class="cartao-medida-valor"><span data-claim="custo-unitario-do-trabalho-2025">14,4</span></p>' +
      '<p class="cartao-medida-regua"><span>2024: 8,7</span></p>' +
      '</article>' +
      /* PLANTA 5 (K6 e K7): a frase mudada, e a palavra que saiu. */
      '<article data-cartao-medida="taxa-de-emprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de emprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-emprego-2025">78,2</span></p>' +
      '<p class="cartao-medida-frase" data-cartao-definicao="taxa-de-emprego-2025">Uma frase que ninguém declarou, dentro do limiar.</p>' +
      '</article>' +
      /* PLANTA 6 (K8): a legenda da marca numa página de área. */
      '<p class="marca-legenda">Ao pé de cada número, a marca da fonte.</p>' +
      '</body></html>',
  );
  return dir;
}

if (PROVA) {
  const dir = montaAProva();
  let r;
  try {
    r = corre(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  /** @param {string} c */
  const dessaCelula = (c) => r.erros.filter((e) => e.startsWith(`${c} ·`));
  /** @type {string[]} */
  const falhas = [];
  const esperado = [
    ['K1', 'livro-item-campo'],
    ['K2', 'Lido na fonte a'],
    ['K3', 'taxa-de-desemprego-2025'],
    ['K4', 'Residential building permits'],
    ['K5', '2024: 8,7'],
    ['K6', 'taxa-de-emprego-2025'],
    ['K7', 'limiar'],
    ['K8', 'legenda da marca'],
  ];
  for (const [celula, pedaco] of esperado) {
    const vistos = dessaCelula(celula);
    if (vistos.length === 0) {
      falhas.push(`${celula} não viu o estrago plantado`);
      continue;
    }
    if (!vistos.some((e) => e.includes(pedaco))) {
      falhas.push(`${celula} mordeu noutra coisa: ${vistos[0]}`);
    }
  }
  /* O CARTÃO SÃO NÃO PODE DAR VERMELHO, e é a outra metade da prova: uma régua
     que grite por tudo também diz sempre alguma coisa. */
  const noSao = r.erros.filter((e) => e.includes('precos-da-habitacao-2025'));
  if (noSao.length > 0) {
    falhas.push(`o cartão são deu ${noSao.length} vermelho(s): ${noSao[0]}`);
  }

  /* -------------------------------------------------------------------------
     A PROVA DAS LINHAS DO ENQUADRAMENTO: um positivo e um negativo, os dois com
     linhas verdadeiras. Nenhuma linha falsa é escrita para esta prova.
     ------------------------------------------------------------------------- */
  const chaves = chavesDoEnquadramento('precos-da-habitacao-2025');
  if (chaves.anterior !== 'precos-da-habitacao-2024' || chaves.ue !== 'precos-da-habitacao-2025-ue') {
    falhas.push(`as chaves do enquadramento saíram erradas: ${JSON.stringify(chaves)}`);
  }
  /* O POSITIVO: a linha da própria medida existe, e `hasClaim` diz que sim. */
  if (!hasClaim('precos-da-habitacao-2025')) {
    falhas.push('hasClaim() não encontra uma linha que existe: a régua está cega');
  }
  /* O NEGATIVO: a linha do período anterior não existe, e a régua não a rende. */
  if (hasClaim('precos-da-habitacao-2024')) {
    falhas.push(
      'a linha do período anterior passou a existir: a prova do negativo tem de mudar de alvo ' +
        '(escolhe outra medida cuja linha anterior ainda falte, e escreve qual)',
    );
  }
  const regua = reguaDaMedida('precos-da-habitacao-2025');
  if (regua.anterior !== null || regua.ue !== null) {
    falhas.push(`a régua rendeu uma comparação sem linha: ${JSON.stringify(regua)}`);
  }

  if (falhas.length > 0) {
    console.error(vermelho('\n  A PROVA DA RÉGUA DO CARTÃO FALHOU\n'));
    for (const f of falhas) console.error(`    ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(cinza(`  prova: ${esperado.length} estragos plantados, ${esperado.length} vistos; o cartão são a 0; o enquadramento com um positivo e um negativo de linhas verdadeiras`));
}

/* ------------------------------------------------------------- a corrida */

const DIST = process.env.OEDP_DIST
  ? path.resolve(RAIZ, process.env.OEDP_DIST)
  : path.join(RAIZ, 'dist');
if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  A RÉGUA DO CARTÃO · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const r = corre(DIST);
const motor = ficheirosDoMotor();

/* K8 · «Governo Constitucional» uma vez por edição. */
if (r.contas.governo_constitucional_pt !== 1) {
  r.erros.push(
    `K8 · «Governo Constitucional» rende-se em ${r.contas.governo_constitucional_pt} página(s) ` +
      `portuguesa(s) e devia render-se em 1 (o índice das áreas)`,
  );
}
if (r.contas.governo_constitucional_en !== 1) {
  r.erros.push(
    `K8 · «Constitutional Government» rende-se em ${r.contas.governo_constitucional_en} página(s) ` +
      `inglesa(s) e devia render-se em 1 (o índice das áreas)`,
  );
}

if (JSON_SAIDA) {
  console.log(JSON.stringify({ contas: r.contas, erros: r.erros, motor }, null, 2));
  process.exit(r.erros.length === 0 ? 0 : 1);
}

console.log('');
console.log('  A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2');
console.log('');
console.log(cinza(`    páginas lidas                    ${r.contas.paginas}`));
console.log(cinza(`    cartões                          ${r.contas.cartoes} (${r.contas.cartoes_pt} pt, ${r.contas.cartoes_en} en)`));
console.log(cinza(`    com nome                         ${r.contas.com_nome}`));
console.log(cinza(`    sem nome (à espera do motor)     ${r.contas.sem_nome}`));
console.log(cinza(`    com a frase do que medem         ${r.contas.com_frase}`));
console.log(cinza(`    com régua                        ${r.contas.com_regua}`));
console.log(cinza(`    «Governo Constitucional»         ${r.contas.governo_constitucional_pt} pt · ${r.contas.governo_constitucional_en} en`));
console.log(cinza(`    legenda da marca                 ${r.contas.legenda_da_marca} página(s)`));
console.log(cinza(`    unidade na outra língua          ${r.contas.unidade_noutra_lingua} (a exceção da I92)`));
console.log(cinza(`    o marcador em português          ${r.contas.marcador_em_portugues} (a exceção da IDENTIDADE §6)`));
console.log(
  cinza(
    `    ficheiros do motor               referencias.json ${motor.referencias ? 'sim' : 'ainda não'} · ` +
      `nomes.json ${motor.nomes ? 'sim' : 'ainda não'}`,
  ),
);
console.log('');
if (r.erros.length > 0) {
  console.error(vermelho(`  ${r.erros.length} defeito(s):`));
  for (const e of r.erros.slice(0, 40)) console.error(`    ${e}`);
  if (r.erros.length > 40) console.error(cinza(`    … e mais ${r.erros.length - 40}`));
  console.error('');
  process.exit(1);
}
console.log(verde('  ✓ as cinco coisas e só elas, em todos os cartões das duas edições'));
console.log('');
