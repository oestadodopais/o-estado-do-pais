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
 *   K4 · **cada nome noutra língua diz em que língua está** · o item 4 do brief
 *        pedia «zero cadeias em inglês nos cartões da edição portuguesa», e esta
 *        célula mediu-o assim até 15.09.2026 à noite. **A decisão do lugar de
 *        direção sobre as capturas mudou a regra**: nenhum cartão fica sem nome,
 *        e onde não há nome do projeto nem nome oficial confirmado o cartão mostra
 *        o título que a fonte dá à medida, na língua da fonte e com a marca
 *        `lang`. A célula passa a medir o que a I91 sempre mandou e o que a regra
 *        nova precisa: **o nome de um cartão carrega a língua que as tabelas
 *        declaram para ele**, nem a mais nem a menos. Um nome estrangeiro sem
 *        marca lê-se com a fonética errada; um nome português com marca de
 *        português dentro de uma página portuguesa é ruído para quem ouve.
 *
 *        A pergunta responde-se do TEXTO RENDIDO e das tabelas
 *        (`src/i18n/lingua-dos-titulos.mjs`), e não da função que compõe o nome:
 *        a régua não confirma a função, confere o ficheiro.
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
 *   K10 · **uma marca da fonte por cartão, e a porta que ela abre paga as
 *        outras** · decisão do lugar de direção de 15.09.2026 sobre as capturas:
 *        o cartão tem UMA marca, e os valores da régua não levam marca própria.
 *        Esta célula confere as duas metades: que nenhum cartão tem mais do que
 *        uma marca, e que o recibo da medida lista mesmo, no bloco «O
 *        enquadramento», cada linha que a régua do cartão cita.
 *
 *        **É esta célula que promete a porta, e não o portão de HTML**, e a razão
 *        mediu-se: o `auditaSelo()` do portão já não corre nas páginas de área,
 *        porque a guarda `paginaDoLivro` inclui a rota `area` desde 28.08.2026.
 *        Lá o portão confere cada CAMPO contra a linha, que é mais conferência e
 *        não menos, e a do selo é a que não corre. Sem esta célula, um valor de
 *        régua podia ficar sem porta nenhuma e nada o dizia.
 *   K9 · **o valor de referência tem duas testemunhas, e elas batem certo** · o
 *        algarismo que o cartão desenha vem da declaração de `figuras.mjs`, com o
 *        motivo do registo; o motor lê o mesmo valor na página do painel da
 *        Comissão e escreve-o em `referencias.json`, com a frase verbatim de onde
 *        o leu. São dois registos independentes do mesmo facto, e esta célula
 *        compara-os: os números e o sentido. Um facto com duas origens que não
 *        batem certo é um facto por confirmar, e o cartão não o desenha sem
 *        alguém olhar.
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
import {
  chavesDoEnquadramento,
  reguaDaMedida,
  ficheirosDoMotor,
  valorDeReferenciaDoMotor,
  nomeOficial,
} from '../../src/lib/enquadramento.mjs';
import { FIGURAS, ladosDoLimiar } from '../../src/data/figuras.mjs';
/* AS TABELAS DAS LÍNGUAS, e não a função que compõe o nome: a pergunta desta
   régua é «o texto que a página escreveu diz a língua em que está?», e quem sabe
   a língua de uma cadeia é a tabela onde ela está declarada. */
import {
  linguaDoRotuloDaFonte,
  linguaDoTituloDoDocumento,
} from '../../src/i18n/lingua-dos-titulos.mjs';
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
 * distinção não é decorativa aqui: a marca da fonte leva o nome do publicador
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
 * Os números de um valor de referência, com sinal, e o sentido dele.
 *
 * Lê as duas formas: a cadeia que o motor copia da página da Comissão («60%»,
 * «-35%», «-4/+6%», «+/-3% (EA)», «-0.2pp») e a declaração estruturada de
 * `figuras.mjs`. Devolve os números por ordem crescente, para que a comparação
 * não dependa de qual das duas escreveu primeiro o lado de baixo.
 *
 * `+/-n` E `-/+n` SÃO DUAS PONTAS E NÃO UMA, e é o caso do câmbio efetivo real:
 * uma expressão regular de números lê «+/-3» como um número só, e a comparação
 * dizia que a declaração tem dois lados e o motor um. Expandem-se antes de ler.
 *
 * @param {string} cru
 * @returns {number[]}
 */
function numerosDoValorDeReferencia(cru) {
  const normal = String(cru)
    .replace(/−/g, '-')
    .replace(/([+]\/[-]|[-]\/[+])\s*(\d+(?:[.,]\d+)?)/g, '-$2/+$2');
  const achados = normal.match(/[+-]?\d+(?:[.,]\d+)?/g) ?? [];
  return achados
    .map((s) => Number(s.replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Os números da declaração de `figuras.mjs`, pela mesma forma.
 *
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @returns {number[]}
 */
function numerosDaDeclaracao(lados) {
  if (!lados) return [];
  return [lados.inferior, lados.superior]
    .filter((x) => typeof x === 'string' && x !== '')
    .map((x) => Number(String(x).replace(/−/g, '-').replace(/,/g, '.')))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * A célula K9, escrita à parte para o `--prova` a poder exercer com um par que
 * NÃO bate certo. Não se planta um estrago num ficheiro de dados do motor: o que
 * se prova é a comparação, com dois valores escritos aqui.
 *
 * @param {string} id
 * @param {{ limiar: string, sentido: string }|null} doMotor
 * @param {ReturnType<typeof ladosDoLimiar>} lados
 * @param {boolean} banda
 * @returns {string|null}  a queixa, ou `null` quando batem certo
 */
export function compararAsDuasTestemunhas(id, doMotor, lados, banda) {
  if (!doMotor) return null;
  const a = numerosDoValorDeReferencia(doMotor.limiar);
  const b = numerosDaDeclaracao(lados);
  if (a.length !== b.length || a.some((n, i) => n !== b[i])) {
    return (
      `K9 · ${id}: o valor de referência tem duas testemunhas e elas não batem certo. ` +
      `A declaração de figuras.mjs diz [${b.join(', ')}] e o motor leu «${doMotor.limiar}» ` +
      `na página do painel, que dá [${a.join(', ')}]`
    );
  }
  const sentidoDeclarado = banda ? 'intervalo' : lados?.inferior ? 'inferior' : 'superior';
  if (doMotor.sentido && doMotor.sentido !== sentidoDeclarado) {
    return (
      `K9 · ${id}: o sentido do valor de referência tem duas testemunhas e elas não batem ` +
      `certo. A declaração de figuras.mjs diz «${sentidoDeclarado}» e o motor diz ` +
      `«${doMotor.sentido}»`
    );
  }
  return null;
}

/**
 * Percorre o `dist/` e mede.
 *
 * @param {string} dist
 */
function corre(dist) {
  /** @type {string[]} */
  const erros = [];
  /* Os pares «este cartão cita esta linha na régua», recolhidos enquanto se
     percorrem os cartões e conferidos no fim contra os recibos: é a metade que o
     portão de HTML não pode ver, porque ele lê uma página de cada vez. */
  /** @type {{ rota: string, cartao: string, linha: string, lang: string }[]} */
  const enquadradas = [];
  /** @type {Map<string, Set<string>>} */
  const recibos = new Map();
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
    nome_noutra_lingua: 0,
    valores_de_regua_sem_marca: 0,
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

      /* O RECIBO DE UMA LINHA, e o que o bloco «O enquadramento» dele lista.
         A chave é a rota, que é única por linha e por edição. */
      const bloco = root.querySelector('#enquadramento');
      if (bloco) {
        const citadas = new Set();
        for (const v of bloco.querySelectorAll('[data-claim]')) {
          const x = v.getAttribute('data-claim');
          if (x) citadas.add(x);
        }
        recibos.set(rota.replace(/\/$/, ''), citadas);
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
        const nomeEl = vista.querySelector('.cartao-medida-nome');
        if (nomeEl) {
          const texto = nomeEl.text.replace(/\s+/g, ' ').trim();
          const marcada = nomeEl.getAttribute('lang') ?? null;
          /* O NOME OFICIAL É PORTUGUÊS NAS DUAS EDIÇÕES, e as tabelas dos títulos
             não o conhecem porque ele não é um título nem um rótulo: vem do
             ficheiro do motor. A marca esperada sai da mesma regra de sempre, a
             língua do texto contra a língua da página. */
          const esperada =
            nomeEl.getAttribute('data-nome') === 'oficial'
              ? langPagina === 'en'
                ? 'pt-PT'
                : null
              : linguaDoRotuloDaFonte(texto, langPagina) ??
                linguaDoTituloDoDocumento(texto, langPagina);
          if ((esperada ?? null) !== (marcada ?? null)) {
            erros.push(
              `K4 · ${rota} · ${id}: o nome do cartão rende-se com lang=«${marcada ?? '(nenhum)'}» ` +
                `e as tabelas dizem «${esperada ?? '(nenhum)'}»: «${texto.slice(0, 60)}»`,
            );
          }
          if (esperada) contas.nome_noutra_lingua++;
        }
        /* A unidade e o marcador ficam contados, porque as duas são exceções
           declaradas que o relatório do bloco nomeia: a unidade pela I92 («uma
           unidade em português numa página inglesa é honesta») e o marcador pela
           `IDENTIDADE.md` §6 («[a verificar]» fica em português nas duas
           edições). Nenhuma das duas é um defeito, e por isso nenhuma delas dá
           vermelho: o que elas dão é um número no relatório. */
        for (const comLingua of vista.querySelectorAll('[lang]')) {
          const curta = (comLingua.getAttribute('lang') ?? '').toLowerCase().split('-')[0];
          if (!curta || curta === langPagina) continue;
          const classes2 = (comLingua.getAttribute('class') ?? '').split(/\s+/);
          if (classes2.includes('cartao-medida-unidade')) contas.unidade_noutra_lingua++;
          else if (classes2.includes('marcador') || classes2.includes('marcador-gloss')) {
            contas.marcador_em_portugues++;
          }
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

        /* ----------------------------------------------------------- K10 */
        const marcas = vista.querySelectorAll('.src-chip').length;
        if (marcas !== 1) {
          erros.push(
            `K10 · ${rota} · ${id}: o cartão tem ${marcas} marca(s) da fonte, e a decisão de ` +
              `15.09.2026 diz uma`,
          );
        }
        for (const item of cartao.querySelectorAll('[data-selo-em]')) {
          const doCartao = item.getAttribute('data-selo-em');
          if (doCartao !== id) {
            erros.push(
              `K10 · ${rota} · ${id}: um item da régua diz enquadrar «${doCartao}» e está no ` +
                `cartão de «${id}»`,
            );
            continue;
          }
          for (const v of item.querySelectorAll('[data-claim]')) {
            const daRegua = v.getAttribute('data-claim');
            if (daRegua) enquadradas.push({ rota, cartao: id, linha: daRegua, lang: langPagina });
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

  /* ------------------------------------------------------------------- K10 */
  /* Cada linha que a régua de um cartão cita tem de estar no bloco «O
     enquadramento» do recibo da medida daquele cartão. É a porta que a marca
     única do cartão paga. */
  for (const e of enquadradas) {
    const recibo = e.lang === 'en' ? `/en/ledger/${e.cartao}` : `/livro-razao/${e.cartao}`;
    const citadas = recibos.get(recibo);
    if (!citadas) {
      erros.push(
        `K10 · ${e.rota} · ${e.cartao}: a régua cita «${e.linha}» sem marca própria, e o recibo ` +
          `«${recibo}» não tem bloco «O enquadramento» nenhum`,
      );
      continue;
    }
    if (!citadas.has(e.linha)) {
      erros.push(
        `K10 · ${e.rota} · ${e.cartao}: a régua cita «${e.linha}» sem marca própria, e o recibo ` +
          `«${recibo}» não a lista: o valor fica sem porta para a sua linha`,
      );
    }
  }
  contas.valores_de_regua_sem_marca = enquadradas.length;

  return { erros, contas };
}

/* =========================================================================
 * A PROVA: cinco estragos plantados, um por célula que morde sobre HTML
 * ========================================================================= */

function montaAProva() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-cartao-'));
  /** A marca da fonte, na forma em que o sítio a rende. @param {string} id */
  const chip = (id) =>
    `<a class="src-chip" href="/livro-razao/${id}"><span class="src-chip-texto">fonte</span></a>`;
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
      chip('precos-da-habitacao-2025') +
      '<span class="cartao-medida-unidade">variação anual média, %</span></p>' +
      `<p class="cartao-medida-frase" data-cartao-definicao="precos-da-habitacao-2025">${boa}</p>` +
      '<p class="cartao-medida-regua"><span data-nonledger="limiar-do-quadro">9</span>%</p>' +
      '</article>' +
      /* PLANTA 1 (K1 e K2): um bloco a mais, com um rótulo de recibo dentro. */
      '<article data-cartao-medida="divida-publica-2025">' +
      '<span class="cartao-medida-nome">Dívida pública</span>' +
      '<p class="cartao-medida-valor"><span data-claim="divida-publica-2025">117,5</span>' + chip('divida-publica-2025') + '</p>' +
      `<p class="livro-item-campo"><span>${s.prov.lido}</span> 12.08.2026</p>` +
      '</article>' +
      /* PLANTA 2 (K3): a chave no texto visível. */
      '<article data-cartao-medida="taxa-de-desemprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de desemprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-desemprego-2025">6,4</span>' +
      chip('taxa-de-desemprego-2025') +
      '<code>taxa-de-desemprego-2025</code></p>' +
      '</article>' +
      /* PLANTA 3 (K4): um título de documento em inglês numa página portuguesa,
         SEM a marca da língua. O nome pode ser estrangeiro (é a decisão de 15.09
         à noite); o que ele não pode é não dizer em que língua está. */
      '<article data-cartao-medida="licencas-de-construcao-2025">' +
      '<span class="cartao-medida-nome">Residential building permits - annual data</span>' +
      '<p class="cartao-medida-valor"><span data-claim="licencas-de-construcao-2025">749,7</span>' + chip('licencas-de-construcao-2025') + '</p>' +
      '</article>' +
      /* PLANTA 4 (K5): um algarismo na régua sem linha e sem motivo. */
      '<article data-cartao-medida="custo-unitario-do-trabalho-2025">' +
      '<span class="cartao-medida-nome">Custo unitário do trabalho</span>' +
      '<p class="cartao-medida-valor"><span data-claim="custo-unitario-do-trabalho-2025">14,4</span>' + chip('custo-unitario-do-trabalho-2025') + '</p>' +
      '<p class="cartao-medida-regua"><span>2024: 8,7</span></p>' +
      '</article>' +
      /* PLANTA 5 (K6 e K7): a frase mudada, e a palavra que saiu. */
      '<article data-cartao-medida="taxa-de-emprego-2025">' +
      '<span class="cartao-medida-nome">Taxa de emprego</span>' +
      '<p class="cartao-medida-valor"><span data-claim="taxa-de-emprego-2025">78,2</span>' + chip('taxa-de-emprego-2025') + '</p>' +
      '<p class="cartao-medida-frase" data-cartao-definicao="taxa-de-emprego-2025">Uma frase que ninguém declarou, dentro do limiar.</p>' +
      '</article>' +
      /* PLANTA 7 (K10): duas marcas da fonte num cartão, e um valor de régua sem
         marca própria cujo recibo não lista a linha (aqui não há recibo nenhum,
         que é o caso extremo do mesmo defeito). */
      '<article data-cartao-medida="saldo-da-balanca-corrente-2025">' +
      '<span class="cartao-medida-nome">Saldo da balança corrente</span>' +
      '<p class="cartao-medida-valor"><span data-claim="saldo-da-balanca-corrente-2025">2,2</span>' +
      chip('saldo-da-balanca-corrente-2025') +
      chip('saldo-da-balanca-corrente-2024') +
      '</p>' +
      '<p class="cartao-medida-regua"><span data-regua="anterior" data-selo-em="saldo-da-balanca-corrente-2025">' +
      '<span data-claim="saldo-da-balanca-corrente-2024">1,3</span></span></p>' +
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
    ['K10', 'marca(s) da fonte'],
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
  /* O NEGATIVO: uma medida cujo período não é um ano não tem chave nenhuma, e a
     régua não lhe inventa uma. Descer um mês é conhecimento da série, e a série é
     do motor. */
  const semChave = chavesDoEnquadramento('evora-desemprego-registado-2025-12');
  if (semChave.anterior !== null || semChave.ue !== null) {
    falhas.push(
      `a régua inventou uma chave para um período que não é um ano: ${JSON.stringify(semChave)}`,
    );
  }
  /* O POSITIVO E O NEGATIVO DA RÉGUA, com as linhas que o motor selou a 15.09.
     `precos-da-habitacao-2025` tem as duas comparações; uma medida cujo período
     não é um ano não tem chave nenhuma, e é esse o negativo. */
  const regua = reguaDaMedida('precos-da-habitacao-2025');
  if (!regua.anterior || regua.anterior.id !== 'precos-da-habitacao-2024') {
    falhas.push(`a régua não achou a linha do período anterior: ${JSON.stringify(regua)}`);
  }
  if (!regua.ue || regua.ue.id !== 'precos-da-habitacao-2025-ue') {
    falhas.push(`a régua não achou a linha da União: ${JSON.stringify(regua)}`);
  }
  /* A SÉRIE BIENAL: o período anterior não é o ano anterior, e a régua
     procura-o no livro-razão em vez de o calcular. */
  const bienal = reguaDaMedida('competencias-digitais-2025');
  if (!bienal.anterior || bienal.anterior.id !== 'competencias-digitais-2023') {
    falhas.push(
      `a régua calculou o período anterior em vez de o procurar: ` +
        `«competencias-digitais-2025» deu ${JSON.stringify(bienal.anterior)} e a linha selada é ` +
        `«competencias-digitais-2023» (série bienal)`,
    );
  }
  /* A AUSÊNCIA: cinco medidas não têm linha da União, porque o conjunto do
     Eurostat não traz valor no agregado naquele período. O cartão desenha-as sem
     a comparação europeia e não escreve a ausência por palavras. */
  const semUe = reguaDaMedida('saldo-da-balanca-corrente-2025');
  if (semUe.ue !== null) {
    falhas.push(
      'a prova da ausência tem de mudar de alvo: «saldo-da-balanca-corrente-2025» passou a ter ' +
        'linha da União, e a régua tem de continuar a ser provada contra uma medida que não a tenha',
    );
  }

  /* A K9 PROVA-SE COM UM PAR QUE NÃO BATE CERTO, e não com um estrago num
     ficheiro do motor: o que se prova é a comparação. Dois pares, um em cada
     sentido: os números diferentes e o sentido diferente. */
  const parMau = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '61%', sentido: 'superior' },
    { inferior: null, superior: '60' },
    false,
  );
  if (!parMau || !parMau.includes('não batem certo')) {
    falhas.push('a K9 não vê dois números diferentes');
  }
  const sentidoMau = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '60%', sentido: 'inferior' },
    { inferior: null, superior: '60' },
    false,
  );
  if (!sentidoMau || !sentidoMau.includes('sentido')) {
    falhas.push('a K9 não vê dois sentidos diferentes');
  }
  const parBom = compararAsDuasTestemunhas(
    'a-prova',
    { limiar: '+/-3% (EA)', sentido: 'intervalo' },
    { inferior: '−3', superior: '3' },
    true,
  );
  if (parBom !== null) {
    falhas.push(`a K9 grita por um par que bate certo: ${parBom}`);
  }

  if (falhas.length > 0) {
    console.error(vermelho('\n  A PROVA DA RÉGUA DO CARTÃO FALHOU\n'));
    for (const f of falhas) console.error(`    ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(
    cinza(
      `  prova: ${esperado.length} estragos plantados, ${esperado.length} vistos; o cartão são a 0; ` +
        `a régua com as duas comparações de uma medida, a série bienal, a ausência da linha da ` +
        `União e uma chave que não se inventa; as duas testemunhas do valor de referência com um ` +
        `par bom e dois maus`,
    ),
  );
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

/* --------------------------------------------------------------------- K9 */
/* As duas testemunhas do valor de referência, comparadas medida a medida. Não
   lê o `dist/`: lê os dois registos, que é onde o facto está. */
let k9Comparadas = 0;
for (const f of FIGURAS) {
  const doMotor = valorDeReferenciaDoMotor(f.claim);
  if (!doMotor) continue;
  k9Comparadas++;
  const queixa = compararAsDuasTestemunhas(
    f.claim,
    doMotor,
    ladosDoLimiar(f.limiar),
    Boolean(f.limiar && (f.limiar.inferior || f.limiar.superior)),
  );
  if (queixa) r.erros.push(queixa);
}
r.contas.valores_de_referencia_comparados = k9Comparadas;

/* Os nomes oficiais que o recibo mostra: só os que o motor marca como a mesma
   medida. A conta escreve-se para o relatório do bloco. */
let comNomeOficial = 0;
for (const f of FIGURAS) if (nomeOficial(f.claim)) comNomeOficial++;
r.contas.medidas_com_nome_oficial = comNomeOficial;

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
console.log(cinza(`    nome na língua da fonte          ${r.contas.nome_noutra_lingua} (com a marca «lang»)`));
console.log(cinza(`    unidade na outra língua          ${r.contas.unidade_noutra_lingua} (a exceção da I92)`));
console.log(cinza(`    o marcador em português          ${r.contas.marcador_em_portugues} (a exceção da IDENTIDADE §6)`));
console.log(cinza(`    valores de régua sem marca própria                    ${r.contas.valores_de_regua_sem_marca} (a porta é a do cartão)`));
console.log(cinza(`    valores de referência, as duas testemunhas comparadas  ${r.contas.valores_de_referencia_comparados}`));
console.log(cinza(`    medidas com nome oficial no recibo                    ${r.contas.medidas_com_nome_oficial}`));
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
