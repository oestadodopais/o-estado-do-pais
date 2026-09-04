#!/usr/bin/env node
/**
 * O PORTÃO DAS FORMAS · o que um desenho da casa pode desenhar, e o que não.
 *
 * Corre DEPOIS do `astro build`, sobre `dist/`, no `build` e no `verify`.
 *
 * ---------------------------------------------------------------------------
 * PORQUE NÃO CHEGA O `gate:html`
 * ---------------------------------------------------------------------------
 * O portão de HTML já recusa um algarismo sem origem declarada, e já exige o
 * selo de um valor desenhado dentro de um `<svg>`. O que ele NÃO sabe é o que o
 * `BRIEF-forma-dos-dominios.md` §3 fixou: que as formas gráficas admitidas são
 * quatro e mais nenhuma, que são SVG estático sem guião e sem animação, que a
 * frase da fronteira se imprime uma vez, e que as três datas de uma medida se
 * escrevem na forma da casa **sem deixarem de ser o campo da linha**.
 *
 * ---------------------------------------------------------------------------
 * AS OITO CONFERÊNCIAS
 * ---------------------------------------------------------------------------
 *   F1 · **a data da linha, recomposta.** Cada `[data-nonledger="data-da-linha"]`
 *        diz de que linha e de que campo saiu; este portão vai buscar o campo à
 *        linha, aplica-lhe `dataDaCasa()` por conta própria, e compara-o carácter
 *        a carácter com o que a página imprimiu. É o que faz da marca uma origem
 *        conferida e não uma dispensa.
 *   F2 · **nenhum número solto num desenho.** Dentro de um `<svg>` de uma forma,
 *        todo o texto com algarismos tem de estar num `[data-claim]` ou num
 *        `[data-nonledger]`. Um número escrito à mão num desenho é a planta que a
 *        régua deste bloco vê vermelha.
 *   F3 · **as quatro formas, e mais nenhuma.** Um `[data-forma]` com um nome que
 *        não é dos quatro fecha a construção. E dentro de uma forma não há
 *        `<script>`, `<animate>`, `<animateTransform>`, `<set>` nem `<foreignObject>`.
 *   F4 · **a frase da fronteira, uma vez por página, com id.**
 *   F5 · **as três datas em cada leitura breve** de uma medida com linha.
 *   F6 · **as linhas alcançáveis.** Todas as linhas que a página do domínio cita
 *        existem; e as 308 de cada medida de concelho são alcançáveis pela porta
 *        que o mapa leva.
 *   F7 · **as 308 páginas de concelho**, nas duas edições, com a medida nova e
 *        com o controlo positivo que prova que a busca não está cega. O total se
 *        lê de `MUNICIPIOS_COM_PAGINA.length` (`src/data/municipios.mjs`), nunca
 *        da própria contagem descoberta: as duas edições podiam faltar a mesma
 *        página e continuar a bater uma com a outra.
 *   F8 · **a ausência não tem número.** Um cartão de ausência com um algarismo
 *        deixa de ser uma ausência.
 *
 * ---------------------------------------------------------------------------
 * TRÊS CONFERÊNCIAS NOVAS (segunda passagem, 03.09.2026, leitura a frio)
 * ---------------------------------------------------------------------------
 * A leitura a frio do Codex mediu que F2 e F8 aceitavam QUALQUER motivo em
 * `data-nonledger`, sem perguntar se aquele motivo faz sentido ONDE aparece: um
 * número escrito à mão dentro de um `<svg>` passava se levasse um motivo
 * qualquer da lista geral do sítio, e um valor escondido no cartão de T4a
 * passava pela mesma porta. As três conferências novas fecham essa lacuna:
 *
 *   F9  · **o motivo de cada `data-nonledger`, contra uma lista fechada por
 *        contexto.** Dentro do `<svg>` de uma forma, só `escala-de-instrumento`
 *        é motivo de um algarismo (F2 continua a aceitar `data-claim`, sempre).
 *        Dentro de um cartão de ausência, só `identificador-tecnico`. Fora
 *        destes dois contextos, numa página de domínio, o motivo tem de estar na
 *        lista das seis que a página usa. Um motivo genuinamente novo entra
 *        nesta lista com a sua razão, como entra em `ledger/allowlist.yml`.
 *   F10 · **nenhuma data ISO na página do domínio.** A regra da casa é uma só,
 *        dd.mm.aaaa; uma data ISO visível é a marca de uma leitura que se
 *        esqueceu de passar por `dataDaCasa()`. O portão de HTML tira as datas
 *        ISO da sua própria varredura antes de contar (são a forma de um id, de
 *        um endereço), e por isso não apanha uma que escape na PROSA.
 *   F11 · **as classes do mapa, reconciliadas com as linhas.** Um `<use>` cuja
 *        classe é uma cor da escala tem de ter, do outro lado, uma linha cujo
 *        valor é um número; um `<use>` em falta tem de estar em `sem-valor`. As
 *        duas contas são independentes: uma lê a classe do HTML construído, a
 *        outra lê o valor do livro-razão pelo mesmo slug.
 *
 * ---------------------------------------------------------------------------
 * O CONHECIDO-POSITIVO (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um portão que lê `dist/` e conta zero tem duas explicações e só uma é boa. Por
 * isso cada conferência declara o que TEM de encontrar antes de o seu zero valer
 * alguma coisa: as duas edições da página do domínio, pelo menos uma forma
 * desenhada, pelo menos uma data de linha, e as 308 páginas de concelho. A
 * ausência de qualquer uma delas fecha a construção antes de qualquer contagem.
 *
 * `OEDP_DIST` aponta para outra pasta: é como `tests/dominio/pagina.mjs` planta
 * estragos numa cópia e vê este portão vermelho antes de o ver verde.
 *
 * Uso:  node scripts/check-formas.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { loadClaims, getClaim, eValorTextual, parsePtNumber } from '../src/lib/ledger.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
import { matchPath, routePath, LANGS } from '../src/lib/routes.mjs';
import { slugsDosDominios, medidasDoDominio } from '../src/data/dominios.mjs';
import { MEDIDAS_DO_CONCELHO } from '../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { linhasPorConcelho } from '../src/lib/dominios.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** @type {string[]} */
const erros = [];
/** @param {string} m */
const err = (m) => erros.push(m);

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DAS FORMAS · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** As quatro formas do §3, e mais nenhuma. */
const FORMAS = new Set([
  'serie-do-pais',
  'faixa-entre-27',
  'barra-concelho-pais',
  'mapa-por-concelho',
]);

/** O que um desenho estático não pode ter lá dentro. */
const PROIBIDOS_NUM_DESENHO = ['script', 'animate', 'animatetransform', 'animatemotion', 'set', 'foreignobject'];

/**
 * O ÚNICO MOTIVO DE UM ALGARISMO DESENHADO NUM DESENHO ESTÁTICO (F2, F9).
 *
 * `data-claim` é sempre aceite (é uma linha do livro-razão); de `data-nonledger`
 * só a marca da régua de um instrumento, e mais nenhuma: um limiar, uma data,
 * um identificador técnico não são a escala de uma forma, e um algarismo
 * escrito à mão que levasse um desses motivos passava a F2 de antes desta
 * conferência (leitura a frio do Codex, Major 6).
 */
const MOTIVO_DE_ESCALA = 'escala-de-instrumento';

/**
 * O ÚNICO MOTIVO DENTRO DE UM CARTÃO DE AUSÊNCIA (F8, F9).
 *
 * A regra dos vazios (Emenda 14) só admite, dentro de um `[data-ausencia]`, o
 * identificador técnico do indicador que se procurou («0012661»); qualquer
 * outro `data-nonledger` ali dentro não é a razão que o brief da forma dos
 * domínios pede, e um valor disfarçado com um desses motivos passava a F8 de
 * antes desta conferência (leitura a frio do Codex, Major 6).
 */
const MOTIVO_DE_AUSENCIA = 'identificador-tecnico';

/**
 * A LISTA FECHADA DE `data-nonledger` DA MANCHETE E DA LEITURA BREVE (F9).
 *
 * As sete que a manchete (`.cabeca-h1`) e a secção `#leitura` de
 * `src/views/DominioView.astro` usam hoje, medidas no `dist/` construído e não
 * escritas de memória: cada uma tem a sua razão em `ledger/allowlist.yml`. O
 * ESCOPO É SÓ ESTE CONTEÚDO, e não a página inteira: a cabeça comum e o rodapé
 * são mobília de outros blocos (o sinal do corredor diário, os cartões da
 * faixa com o seu período), já cobertos pelo fecho geral do `gate:html` contra
 * `ledger/allowlist.yml`, e uma lista fechada aqui sobre esse território
 * apanharia um motivo alheio válido como se fosse um erro deste bloco. Um
 * motivo novo NESTE conteúdo entra nesta lista com a sua razão, como entra
 * naquele ficheiro: as duas listas mudam juntas ou divergem em silêncio.
 */
const MOTIVOS_DO_DOMINIO = new Set([
  'data-da-linha',
  MOTIVO_DE_ESCALA,
  'limiar-do-quadro',
  'ambito-da-medida',
  MOTIVO_DE_AUSENCIA,
  'proveniencia',
  'fonte-da-carta',
]);

const claims = loadClaims();

/** @param {string} dir */
function paginasDe(dir) {
  /** @type {string[]} */
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  };
  anda(dir);
  return out.sort();
}

/**
 * O campo de uma linha que uma data pode nomear.
 *
 * São os três da regra da carta, e o índice da conferência vai no nome, como na
 * página da linha: `verifications.<n>.date`.
 *
 * @param {Linha} linha
 * @param {string} campo
 * @returns {string|null}
 */
function campoDaData(linha, campo) {
  if (campo === 'reference_date') return typeof linha.reference_date === 'string' ? linha.reference_date : null;
  if (campo === 'access_date') return typeof linha.access_date === 'string' ? linha.access_date : null;
  if (campo === 'published_at') return typeof linha.published_at === 'string' ? linha.published_at : null;
  /* AS DUAS DATAS DO ALOJAMENTO (bloco F1.4, 04.09.2026). O instantâneo do
     ficheiro alojado e o de cada ficheiro sobre que a linha foi contada. Entram
     aqui porque passaram a escrever-se na forma da casa como as outras três, e
     este portão é quem as reconfere: sem elas, uma data marcada `data-da-linha`
     caía no ramo do «a linha não tem esse campo» e fechava a construção. */
  if (campo === 'document.hosted.snapshot_date') {
    const d = /** @type {{ hosted?: { snapshot_date?: unknown } }} */ (linha.document ?? {})?.hosted
      ?.snapshot_date;
    return typeof d === 'string' ? d : null;
  }
  const f = /^document\.computed_over\.files\.(\d+)\.snapshot_date$/.exec(campo);
  if (f) {
    const co = /** @type {{ computed_over?: { files?: unknown } }} */ (linha.document ?? {})
      ?.computed_over;
    const ficheiros = Array.isArray(co?.files) ? co.files : [];
    const item = ficheiros[Number(f[1])];
    if (typeof item !== 'object' || item === null) return null;
    const d = /** @type {{ snapshot_date?: unknown }} */ (item).snapshot_date;
    return typeof d === 'string' ? d : null;
  }
  const m = /^verifications\.(\d+)\.date$/.exec(campo);
  if (!m) return null;
  const lista = Array.isArray(linha.verifications) ? linha.verifications : [];
  const v = lista[Number(m[1])];
  if (typeof v !== 'object' || v === null) return null;
  const d = /** @type {{ date?: unknown }} */ (v).date;
  return typeof d === 'string' ? d : null;
}

/** O texto de um nó, com os espaços normalizados. */
const texto = (no) => String(no.text ?? '').replace(/\s+/g, ' ').trim();
const temAlgarismo = (s) => /\d/.test(s);

/* ========================================================================== */
/* A varredura                                                                */
/* ========================================================================== */

const contas = {
  paginas: 0,
  paginas_de_dominio: 0,
  datas_de_linha: 0,
  formas: 0,
  formas_por_nome: /** @type {Record<string, number>} */ ({}),
  medidas_com_leitura: 0,
  ausencias: 0,
  concelhos_com_ganho: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  concelhos_com_populacao: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  concelhos: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  linhas_citadas: new Set(),
};

/* Os rótulos das duas medidas dos 308 que a F7 conta, lidos da declaração e não
   escritos aqui: uma cópia do rótulo divergia no dia em que ele mudasse. */
const medidaDoConcelho = (chave) => {
  const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === chave);
  if (!m) throw new Error(`check:formas: a medida de concelho "${chave}" não está declarada.`);
  return m;
};
const ROTULO_GANHO = medidaDoConcelho('ganho').nome;
const ROTULO_POPULACAO = medidaDoConcelho('populacao').nome;

for (const ficheiro of paginasDe(DIST)) {
  const caminho = '/' + path.relative(DIST, ficheiro).split(path.sep).join('/');
  const rota = matchPath(caminho.replace(/index\.html$/, ''));
  if (rota?.key === 'documento') continue;
  const root = parse(fs.readFileSync(ficheiro, 'utf8'));
  const rel = path.relative(RAIZ, ficheiro);
  contas.paginas++;

  /* ------------------------------------------------------------------ F1 --- */
  for (const el of root.querySelectorAll('[data-nonledger="data-da-linha"]')) {
    contas.datas_de_linha++;
    const id = el.getAttribute('data-de-linha') ?? '';
    const campo = el.getAttribute('data-de-campo') ?? '';
    const linha = claims.get(id);
    if (!linha) {
      err(`${rel}: uma data diz vir da linha "${id}", que não existe no livro-razão.`);
      continue;
    }
    const bruto = campoDaData(linha, campo);
    if (bruto === null) {
      err(
        `${rel}: uma data diz vir do campo "${campo}" da linha "${id}", e a linha não tem ` +
          `esse campo. Um campo que a linha não tem não se mostra.`,
      );
      continue;
    }
    const esperado = dataDaCasa(bruto);
    const rendido = texto(el);
    if (rendido !== esperado) {
      err(
        `${rel}: a data do campo "${campo}" de "${id}" não é a da linha.\n` +
          `      no livro-razão: ${bruto} · na forma da casa: ${esperado}\n` +
          `      renderizado:    ${rendido}`,
      );
    }
  }

  /* ---------------------------------------------------------------- F2, F3 --- */
  for (const forma of root.querySelectorAll('[data-forma]')) {
    const nome = forma.getAttribute('data-forma') ?? '';
    contas.formas++;
    contas.formas_por_nome[nome] = (contas.formas_por_nome[nome] ?? 0) + 1;
    if (!FORMAS.has(nome)) {
      err(
        `${rel}: a forma gráfica "${nome}" não é uma das quatro admitidas ` +
          `(${[...FORMAS].join(', ')}). O §3 do brief da forma dos domínios fecha a lista.`,
      );
    }
    for (const proibido of PROIBIDOS_NUM_DESENHO) {
      if (forma.querySelectorAll(proibido).length > 0) {
        err(
          `${rel}: a forma "${nome}" tem <${proibido}> lá dentro. As formas da casa são SVG ` +
            `estático, sem guião, sem biblioteca e sem animação.`,
        );
      }
    }
    for (const svg of forma.querySelectorAll('svg')) {
      for (const t of svg.querySelectorAll('text, tspan, title, desc')) {
        if (t.querySelector('text, tspan')) continue;
        const conteudo = texto(t);
        if (!temAlgarismo(conteudo)) continue;
        /* F9 · O MOTIVO CONTA, E NÃO SÓ A PRESENÇA DO ATRIBUTO (leitura a frio
           do Codex, Major 6). `data-claim` é sempre uma linha; de
           `data-nonledger`, só a marca da régua de um instrumento é a escala de
           uma forma: qualquer outro motivo (uma data, um limiar, um
           identificador técnico) não descreve o que um algarismo desenhado
           pode ser aqui, e aceitá-lo era a fresta que deixava passar um número
           escrito à mão debaixo de um motivo emprestado de outro sítio da
           página. */
        const elDeclarado = (el) =>
          el.getAttribute('data-claim') !== undefined ||
          el.getAttribute('data-nonledger') === MOTIVO_DE_ESCALA;
        const declarado =
          elDeclarado(t) ||
          t.closest?.('[data-claim]') !== null ||
          t.closest?.(`[data-nonledger="${MOTIVO_DE_ESCALA}"]`) !== null;
        if (!declarado) {
          const motivoAlheio = t.getAttribute('data-nonledger') ?? t.closest?.('[data-nonledger]')?.getAttribute('data-nonledger');
          err(
            `${rel}: a forma "${nome}" desenha «${conteudo.slice(0, 60)}», que tem algarismos e ` +
              `não resolve numa linha nem numa marca de escala declarada` +
              (motivoAlheio ? ` (o motivo "${motivoAlheio}" não é escala de instrumento).\n` : '.\n') +
              `      Um número desenhado é <Claim as="text"/> ou data-nonledger="${MOTIVO_DE_ESCALA}".`,
          );
        }
      }
    }
  }

  /* ------------------------------------------------------- as páginas de domínio */
  if (rota?.key === 'dominio') {
    contas.paginas_de_dominio++;

    /* --------------------------------------------------------------- F4 --- */
    const fronteiras = root.querySelectorAll('[data-fronteira]');
    if (fronteiras.length !== 1) {
      err(
        `${rel}: a frase da fronteira aparece ${fronteiras.length} vez(es). ` +
          `O brief da forma dos domínios diz «uma frase, impressa uma vez, citável».`,
      );
    }
    for (const f of fronteiras) {
      if (!f.getAttribute('id')) {
        err(`${rel}: a frase da fronteira não tem id, e o brief pede que ela seja citável.`);
      }
    }

    /* --------------------------------------------------------------- F5 --- */
    for (const medida of root.querySelectorAll('[data-medida]')) {
      contas.medidas_com_leitura++;
      const chave = medida.getAttribute('data-medida') ?? '';
      const temValor = medida.querySelectorAll('[data-claim]').length > 0;
      if (!temValor) continue;
      const datas = medida.querySelectorAll('[data-nonledger="data-da-linha"]');
      if (datas.length < 3) {
        err(
          `${rel}: a leitura breve de "${chave}" tem ${datas.length} data(s) e a carta pede três ` +
            `(o período de referência, a data de leitura, a data da última conferência).`,
        );
      }
    }

    /* --------------------------------------------------------------- F8 --- */
    for (const ausencia of root.querySelectorAll('[data-ausencia]')) {
      contas.ausencias++;
      const chave = ausencia.getAttribute('data-ausencia') ?? '';
      if (ausencia.querySelectorAll('[data-claim]').length > 0) {
        err(
          `${rel}: o cartão de ausência "${chave}" tem um valor do livro-razão lá dentro. ` +
            `Uma ausência com um número deixa de ser uma ausência.`,
        );
      }
      /* E nenhum algarismo FORA de uma origem declarada NESTE CONTEXTO (F9,
         leitura a frio, Major 6). O código de um indicador que se procurou é
         um identificador técnico e leva o seu motivo (`identificador-tecnico`,
         `MOTIVO_DE_AUSENCIA`); um valor escrito à mão não leva nenhum motivo
         admissível AQUI, mesmo que leve um motivo válido noutro sítio do
         sítio. Só se retiram `[data-claim]`, `[data-verbatim]` e o motivo da
         ausência antes de contar: um `data-nonledger` disfarçado com outro
         motivo (um limiar, uma data) fica no texto, e `temAlgarismo()`
         apanha-o. */
      const clone = parse(ausencia.outerHTML);
      for (const marcado of clone.querySelectorAll(
        `[data-claim],[data-verbatim],[data-nonledger="${MOTIVO_DE_AUSENCIA}"]`,
      )) {
        marcado.remove();
      }
      for (const outro of clone.querySelectorAll('[data-nonledger]')) {
        if (outro.getAttribute('data-nonledger') === MOTIVO_DE_AUSENCIA) continue;
        err(
          `${rel}: o cartão de ausência "${chave}" leva data-nonledger="${outro.getAttribute('data-nonledger')}", ` +
            `e dentro de uma ausência o único motivo admissível é "${MOTIVO_DE_AUSENCIA}" ` +
            `(o identificador do indicador que se procurou).`,
        );
      }
      const corpo = texto(clone);
      if (temAlgarismo(corpo)) {
        err(
          `${rel}: o cartão de ausência "${chave}" escreve algarismos sem origem declarada ` +
            `(«${corpo.slice(0, 80)}»). A resposta é «não há número público para isto», com a ` +
            `fonte que se procurou.`,
        );
      }
    }

    /* --------------------------------------------------------------- F6 --- */
    for (const el of root.querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim') ?? '';
      contas.linhas_citadas.add(id);
      if (!claims.has(id)) err(`${rel}: cita a linha "${id}", que não existe no livro-razão.`);
    }

    /* --------------------------------------------------------------- F9 ---
       O ESCOPO É A MANCHETE E A LEITURA BREVE, e não a página inteira: ver a
       nota de `MOTIVOS_DO_DOMINIO`. */
    const escopoF9 = [root.querySelector('.cabeca-h1'), root.querySelector('#leitura')].filter(
      (el) => el !== null,
    );
    for (const bloco of escopoF9) {
      for (const el of bloco.querySelectorAll('[data-nonledger]')) {
        const motivo = el.getAttribute('data-nonledger') ?? '';
        if (!MOTIVOS_DO_DOMINIO.has(motivo)) {
          err(
            `${rel}: data-nonledger="${motivo}" não é um dos motivos que a manchete ou a leitura ` +
              `breve usam (${[...MOTIVOS_DO_DOMINIO].join(', ')}). Um motivo novo entra na lista ` +
              `fechada do portão e em ledger/allowlist.yml, com a sua razão.`,
          );
        }
      }
    }

    /* -------------------------------------------------------------- F10 --- */
    {
      const corpo = root.querySelector('body');
      const clone = parse((corpo ?? root).outerHTML);
      for (const fora of clone.querySelectorAll('script, style')) fora.remove();
      const textoDoCorpo = texto(clone);
      /* SEM `\b` NO FIM (medido nesta segunda passagem, planta P8 de
         `tests/dominio/pagina.mjs`). `texto()` junta o texto de blocos vizinhos
         sem separador nenhum: é a mesma função que rende «…calcula.Leitura
         breve…» sem espaço entre o fim de uma secção e o início da seguinte, e
         uma data ISO à beira de um bloco vizinho que comece por letra não
         tinha fronteira de palavra nenhuma a seguir ao último algarismo: o `\b`
         da direita nunca via a planta. O que fecha o grupo dos dois algarismos
         do dia é «não vem mais um algarismo a seguir», e não «vem uma
         não-palavra»: um "L" a seguir a "01" não estende a data, e continua a
         ser a mesma data ISO. */
      const isoNoTexto = /\b\d{4}-\d{2}-\d{2}(?!\d)/.exec(textoDoCorpo);
      if (isoNoTexto) {
        err(
          `${rel}: o texto da página traz «${isoNoTexto[0]}», uma data em ISO. A regra da casa é ` +
            `uma só forma, dd.mm.aaaa: uma data ISO à vista é uma leitura que não passou por ` +
            `dataDaCasa() (src/lib/datas.mjs).`,
        );
      }
    }

    /* -------------------------------------------------------------- F11 --- */
    for (const mapaEl of root.querySelectorAll('[data-forma="mapa-por-concelho"]')) {
      /* O MESMO ELEMENTO leva `data-forma` e `data-instrumento`
         (`MapaPorConcelho.astro`: `<figure class="forma forma-mapa"
         data-instrumento={...} data-forma="mapa-por-concelho">`). */
      const instrumento = mapaEl.getAttribute('data-instrumento') ?? '';
      const chave = instrumento.startsWith('mapa-por-concelho-')
        ? instrumento.slice('mapa-por-concelho-'.length)
        : '';
      if (chave !== 'ganho' && chave !== 'indice') {
        err(`${rel}: um mapa por concelho declara o instrumento "${instrumento}", sem uma chave conhecida.`);
        continue;
      }
      const linhasDaChave = linhasPorConcelho(chave);
      for (const uso of mapaEl.querySelectorAll('use[data-concelho]')) {
        const slug = uso.getAttribute('data-concelho') ?? '';
        const id = linhasDaChave.get(slug) ?? null;
        const valor = id === null ? null : getClaim(id).value;
        const temValorNumerico = valor !== null && !eValorTextual(valor) && parsePtNumber(valor) !== null;
        const semValorNaClasse = (uso.getAttribute('class') ?? '').split(/\s+/).includes('sem-valor');
        if (temValorNumerico && semValorNaClasse) {
          err(
            `${rel}: o concelho "${slug}" tem um valor numérico em "${id}" e o mapa pinta-o ` +
              `"sem-valor". A classe e a linha discordam.`,
          );
        }
        if (!temValorNumerico && !semValorNaClasse) {
          err(
            `${rel}: o concelho "${slug}" não tem valor numérico publicado (${id ?? 'sem linha'}) ` +
              `e o mapa pinta-o com uma classe da escala em vez de "sem-valor".`,
          );
        }
      }
    }
  }

  /* ------------------------------------------------------------------ F7 --- */
  if (rota?.key === 'municipio') {
    const lang = rota.lang;
    contas.concelhos[lang]++;
    const corpo = root.querySelector('body');
    const t = texto(corpo ?? root);
    if (t.includes(ROTULO_GANHO[lang])) contas.concelhos_com_ganho[lang]++;
    if (t.includes(ROTULO_POPULACAO[lang])) contas.concelhos_com_populacao[lang]++;
  }
}

/* ========================================================================== */
/* Os conhecidos-positivos, antes de qualquer zero valer alguma coisa         */
/* ========================================================================== */

if (contas.paginas === 0) {
  err('a varredura não encontrou uma única página em dist/. A leitura está cega.');
}

const dominios = slugsDosDominios();
if (dominios.length > 0) {
  const esperadas = dominios.length * LANGS.length;
  if (contas.paginas_de_dominio !== esperadas) {
    err(
      `há ${dominios.length} domínio(s) com medidas e ${LANGS.length} edições, e a varredura ` +
        `encontrou ${contas.paginas_de_dominio} página(s) de domínio em vez de ${esperadas}. ` +
        `Ou a construção não as fez, ou a leitura não as vê.`,
    );
  }
  if (contas.datas_de_linha === 0) {
    err(
      'nenhuma data de linha foi encontrada em dist/, e as páginas de domínio rendem três por ' +
        'medida. O conhecido-positivo da F1 falhou: a marca mudou de nome ou a leitura partiu-se.',
    );
  }
  if (contas.formas === 0) {
    err(
      'nenhuma forma gráfica foi encontrada em dist/, e a página do primeiro domínio desenha ' +
        'pelo menos uma. O conhecido-positivo da F2 e da F3 falhou.',
    );
  }
  /* A leitura breve de cada medida declarada tem de estar na página, nas duas
     edições: é a segunda conta da mesma coisa, feita da declaração e não do
     HTML. */
  const medidasDeclaradas = dominios.reduce((n, slug) => n + medidasDoDominio(slug).length, 0);
  const esperadasMedidas = medidasDeclaradas * LANGS.length;
  if (contas.medidas_com_leitura !== esperadasMedidas) {
    err(
      `as ${medidasDeclaradas} medida(s) declarada(s) nas ${LANGS.length} edições dão ` +
        `${esperadasMedidas} leituras breves, e a varredura contou ${contas.medidas_com_leitura}.`,
    );
  }
}

/* F7 · as 308 páginas de concelho, com o controlo positivo ao lado.
   O TOTAL VEM DE `MUNICIPIOS_COM_PAGINA.length`, E NUNCA DA PRÓPRIA CONTAGEM
   DESCOBERTA (leitura a frio, Major 6): comparar uma edição com a outra só
   apanha uma DIFERENÇA entre elas, e não as duas a faltarem a mesma página. O
   conhecido-positivo é o mesmo: sem uma lista declarada de municípios, este
   zero também não provava nada. */
const totalDeConcelhos = MUNICIPIOS_COM_PAGINA.length;
if (totalDeConcelhos === 0) {
  err('src/data/municipios.mjs não declara um único município. O conhecido-positivo da F7 falhou.');
}
if (totalDeConcelhos > 0) {
  for (const lang of LANGS) {
    if (contas.concelhos[lang] !== totalDeConcelhos) {
      err(
        `a edição "${lang}" tem ${contas.concelhos[lang]} páginas de concelho e ` +
          `src/data/municipios.mjs declara ${totalDeConcelhos}. As 308 páginas de cada edição ` +
          `vêm da mesma lista.`,
      );
    }
    if (contas.concelhos_com_populacao[lang] !== contas.concelhos[lang]) {
      err(
        `o CONTROLO POSITIVO falhou na edição "${lang}": «${ROTULO_POPULACAO[lang]}» aparece em ` +
          `${contas.concelhos_com_populacao[lang]} de ${contas.concelhos[lang]} páginas de concelho. ` +
          `Sem ele, a contagem do ganho médio não prova nada.`,
      );
      continue;
    }
    if (contas.concelhos_com_ganho[lang] !== contas.concelhos[lang]) {
      err(
        `«${ROTULO_GANHO[lang]}» aparece em ${contas.concelhos_com_ganho[lang]} de ` +
          `${contas.concelhos[lang]} páginas de concelho na edição "${lang}". A medida é dos 308.`,
      );
    }
  }
}

/* F6 · as linhas de cada medida de concelho são alcançáveis pela porta do mapa. */
if (dominios.length > 0 && contas.formas > 0) {
  const porta = routePath('livroConcelhos', 'pt');
  const ficheiro = path.join(DIST, porta.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(ficheiro)) {
    err(
      `a porta dos valores por concelho (${porta}) não foi construída, e é ela a alternativa em ` +
        `texto do mapa dos 308.`,
    );
  }
}

/* ========================================================================== */

if (erros.length > 0) {
  console.error(vermelho(`\n  PORTÃO DAS FORMAS · ${erros.length} problema(s):\n`));
  for (const e of erros) console.error(`  · ${e}`);
  console.error('');
  process.exit(1);
}

const porNome = Object.entries(contas.formas_por_nome)
  .map(([k, v]) => `${k} ${v}`)
  .join(' · ');
console.log(
  verde('  formas ✓') +
    cinza(
      ` ${contas.paginas_de_dominio} páginas de domínio · ${contas.formas} desenhos (${porNome || 'nenhum'})` +
        ` · ${contas.datas_de_linha} datas de linha conferidas · ${contas.medidas_com_leitura} leituras breves` +
        ` · ${contas.ausencias} ausências · ganho médio em ${contas.concelhos_com_ganho.pt}/${contas.concelhos.pt} concelhos` +
        ` (controlo: população em ${contas.concelhos_com_populacao.pt})`,
    ),
);
