#!/usr/bin/env node
/**
 * =============================================================================
 * O FORMATO DOS NÚMEROS · um só formato em todos os valores rendidos (bloco K2, 02.10.2026, item 5 do brief)
 * =============================================================================
 *
 * PORQUE EXISTE. O brief K2 manda que todos os valores do sítio sigam um só formato, o da casa: os milhares separados,
 * a vírgula decimal, e o espaço antes de «%» e do símbolo. Nenhuma célula conferia isto: o portão de HTML compara o
 * valor com a linha, e não a forma em que ele se escreve nem o que está à volta dele. A construção de base do bloco
 * (a cabeça `1722244d`) tinha 42 valores com os milhares fora da forma da casa (as contagens da prova, escritas sem
 * separador), e nenhum com o ponto decimal ou o hífen.
 *
 * O FORMATO DA CASA, como as decisões em vigor o escrevem:
 *   · F1 · os milhares: a parte inteira de um valor com quatro algarismos ou mais agrupa-se de três em três, com o
 *          espaço inquebrável U+00A0 entre os grupos. O livro-razão guarda o espaço fino U+202F, e a página escreve-o
 *          em U+00A0 desde o item C3 da leitura do Codex do L1 e o achado 19 do B1, porque a letra da casa (Bitter)
 *          não desenha o U+202F e o WebKit o rendia a um décimo de um algarismo (a medição está em
 *          `src/components/Claim.astro`). O brief diz «espaço fino»: o que a página escreve é esse mesmo separador,
 *          no ponto de código que a letra desenha, e o relatório do bloco di-lo;
 *   · F2 · a vírgula decimal: nenhum ponto entre algarismos de um valor;
 *   · F3 · o sinal menos tipográfico (U+2212), e não o hífen.
 *
 * O SÍMBOLO DEPOIS DO VALOR CONTA-SE E NÃO SE EXIGE: É O PONTO EM QUE O BLOCO PAROU. O brief pede o espaço antes de
 * «%»; as decisões escritas pedem o contrário: a §1.43 (a identidade v2, decisão 4: «A percentagem escreve-se colada
 * ao número»), a §1.44 (o item 5: «O sinal de percentagem cola-se ao número», com `valorComUnidade()` em
 * `src/lib/livro.mjs`) e a `IDENTIDADE.md` §11. Um bloco não desfaz uma decisão escrita por causa de uma frase do
 * brief (a lição da N1, na §1.144), e por isso o K2 não muda o «%» de nenhuma página: mede e diz. A construção de base
 * tinha o «%» colado a um valor em 701 sítios e separado por um espaço em 1 845, e o «€» separado em 24 e colado em
 * nenhum (contados por esta célula sobre essa construção, e o relatório do bloco cita o ficheiro); a célula conta as
 * duas formas em cada construção (`contas.simbolo`) e escreve-as na sua linha, até o lugar de direção decidir qual é a
 * da casa. Nesse dia a regra volta a ser uma conferência, com a sua planta.
 *
 * O QUE LÊ. Todas as páginas construídas, menos os documentos alojados dos estudos (`/estudos/<slug>/documento/` e
 * `/en/studies/<slug>/document/`, servidos byte a byte como foram publicados, com os números de quem os escreveu).
 * Os valores são o texto dos elementos marcados como origem de um número: `data-claim` (uma linha do livro-razão),
 * `data-ponto` (um ponto de uma série), `data-prova` (uma contagem da prova) e `data-nonledger="limiar-do-quadro"`
 * (um valor de referência). As F1 a F3 correm nesses; a contagem do símbolo corre também nos outros algarismos
 * declarados por `data-nonledger` (a escala de um instrumento, a numeração), que a gramática das leituras escreve sem
 * separador de milhares (`{ nl }` só aceita algarismos e vírgula). Um elemento com filhos não se lê aqui: o valor de cada origem é
 * um nó de texto só, e é assim que o `Claim`, o `PontoDaSerie` e o `ValorDaProva` o escrevem.
 *
 * O QUE NÃO FAZ: não lê os números dos documentos alojados, nem os que um estudo transcreve no seu corpo
 * (`data-registo*`, a transcrição do documento, com o formato dele), nem os anos, as datas e os códigos, que não são
 * valores. A planta corre sempre com `--prova`: estraga uma cópia em memória de páginas construídas, uma por regra, e
 * exige a queixa da regra; a página limpa tem de sair sem erros antes de cada estrago.
 *
 * Uso: node tests/inicio/formato-dos-numeros.mjs [--prova] [--json <ficheiro>]   (OEDP_DIST mede outra construção)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');

/** As origens cujo texto é um valor, e as que só são algarismos declarados. */
const MARCAS_DE_VALOR = new Set(['claim', 'ponto', 'prova']);
const MOTIVOS_DE_VALOR = new Set(['limiar-do-quadro']);
const MOTIVOS_SO_DO_SIMBOLO = new Set(['escala-de-instrumento', 'numeracao']);

/* UM ELEMENTO MARCADO COM UM NÓ DE TEXTO SÓ. O atributo pode vir em qualquer posição da etiqueta. */
const ELEMENTO = /<(span|a|td|th|text|tspan|strong|b|em|p|li|div|dd|dt|h1|h2|h3)\b([^>]*?\bdata-(claim|ponto|prova|nonledger)="([^"]*)"[^>]*)>([^<]*)<\/\1>/g;

/** As entidades que um valor pode trazer, desfeitas. @param {string} s */
function desfaz(s) {
  return s.replace(/&nbsp;|&#160;|&#xa0;/gi, '\u00a0').replace(/&#8239;|&#x202f;/gi, '\u202f').replace(/&#8201;|&#x2009;/gi, '\u2009')
    .replace(/&#8722;|&#x2212;|&minus;/gi, '\u2212').replace(/&amp;/g, '&');
}

/** Um valor é um número quando só tem algarismos, separadores e o sinal. @param {string} t */
const eNumero = (t) => /^[\u2212-]?\d[\d\u00a0\u202f\u2009 .,]*$/.test(t) && !/^\d{2}\.\d{2}\.\d{4}$/.test(t);
/** A forma da casa. @param {string} t */
const daCasa = (t) => /^\u2212?\d{1,3}(?:\u00a0\d{3})*(?:,\d+)?$/.test(t) || /^\u2212?\d{1,3}(?:,\d+)?$/.test(t);

/**
 * Uma página, conferida.
 * @param {string} html @param {string} rel o caminho da página em `dist/`
 */
export function conferirFormatoDaPagina(html, rel) {
  /** @type {{ regra: string, rel: string, valor: string, contexto: string }[]} */
  const desvios = [];
  const contas = { valores: 0, simbolos: 0, simbolo: { '%': { colado: 0, com_espaco: 0 }, '€': { colado: 0, com_espaco: 0 } } };
  for (const m of html.matchAll(ELEMENTO)) {
    const [inteiro, , atributos, marca, chave, cru] = m;
    if (/\bdata-registo/.test(atributos)) continue;
    const texto = desfaz(cru).trim();
    if (!/\d/.test(texto)) continue;
    const deValor = MARCAS_DE_VALOR.has(marca) || (marca === 'nonledger' && MOTIVOS_DE_VALOR.has(chave));
    const doSimbolo = deValor || (marca === 'nonledger' && MOTIVOS_SO_DO_SIMBOLO.has(chave));
    if (!doSimbolo || !eNumero(texto)) continue;
    const contexto = `${texto}${html.slice(m.index + inteiro.length, m.index + inteiro.length + 60).replace(/<[^>]+>/g, '')}`.slice(0, 50);
    if (deValor) {
      contas.valores++;
      if (/^-/.test(texto)) desvios.push({ regra: 'F3', rel, valor: texto, contexto });
      else if (/\d\.\d/.test(texto) && !/^\d{1,3}(\.\d{3})+$/.test(texto)) desvios.push({ regra: 'F2', rel, valor: texto, contexto });
      else if (!daCasa(texto)) desvios.push({ regra: 'F1', rel, valor: texto, contexto });
    }
    /* O SÍMBOLO DEPOIS DO VALOR, contado: o texto que vem a seguir ao elemento, sem as etiquetas (a do sufixo do
       `Claim`, as do fecho, a do selo), começa por «%» ou «€» colados, ou por um espaço e o símbolo. */
    contas.simbolos++;
    const seguinte = desfaz(html.slice(m.index + inteiro.length, m.index + inteiro.length + 200).replace(/<[^>]+>/g, ''));
    const colado = /^[%€]/.exec(seguinte);
    const separado = /^[ \u00a0]([%€])/.exec(seguinte);
    if (colado) contas.simbolo[colado[0]].colado++;
    else if (separado) contas.simbolo[separado[1]].com_espaco++;
  }
  return { desvios, contas };
}

/** As páginas que a célula lê. @param {string} dist */
export function paginasDoFormato(dist) {
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) {
        const rel = path.relative(dist, f).replace(/\\/g, '/');
        if (/(^|\/)estudos\/[^/]+\/documento\/|(^|\/)en\/studies\/[^/]+\/document\//.test(rel)) continue;
        out.push(rel);
      }
    }
  };
  anda(dist);
  return out.sort();
}

/** A célula sobre uma construção inteira. @param {string} dist */
export function conferirFormatoDosNumeros(dist) {
  const paginas = paginasDoFormato(dist);
  const desvios = [];
  const contas = { paginas: paginas.length, valores: 0, simbolos: 0, simbolo: { '%': { colado: 0, com_espaco: 0 }, '€': { colado: 0, com_espaco: 0 } }, por_regra: { F1: 0, F2: 0, F3: 0 } };
  for (const rel of paginas) {
    const r = conferirFormatoDaPagina(fs.readFileSync(path.join(dist, rel), 'utf8'), rel);
    contas.valores += r.contas.valores;
    contas.simbolos += r.contas.simbolos;
    for (const sim of ['%', '€']) for (const k of ['colado', 'com_espaco']) contas.simbolo[sim][k] += r.contas.simbolo[sim][k];
    for (const d of r.desvios) {
      contas.por_regra[d.regra]++;
      desvios.push(d);
    }
  }
  return { desvios, contas };
}

/**
 * As plantas: uma por regra, sobre cópias em memória de páginas construídas. Cada uma exige que a página limpa saia
 * sem desvios e que a estragada tenha o desvio da sua regra.
 * @param {string} dist
 */
export function plantasDoFormato(dist) {
  const ler = (rel) => fs.readFileSync(path.join(dist, rel), 'utf8');
  const casos = [
    { nome: 'F1 · os milhares com o espaço comum, num valor de um cartão', rel: 'estado-e-economia/index.html', regra: 'F1',
      estraga: (h) => h.replace(/(data-claim="pib-real-per-capita-2025"[^>]*>)(\d+)\u00a0(\d{3})</, '$1$2 $3<').replace(/(data-claim="pib-real-per-capita-2025"[^>]*>)(\d+)&nbsp;(\d{3})</, '$1$2 $3<') },
    { nome: 'F1 · os milhares sem separador', rel: 'estado-e-economia/index.html', regra: 'F1',
      estraga: (h) => h.replace(/(data-claim="pib-real-per-capita-2025"[^>]*>)(\d+)(?:\u00a0|&nbsp;)(\d{3})</, '$1$2$3<') },
    { nome: 'F2 · o ponto decimal', rel: 'emprego/index.html', regra: 'F2',
      estraga: (h) => h.replace(/(data-claim="taxa-de-emprego-2025"[^>]*>)(\d+),(\d+)</, '$1$2.$3<') },
    { nome: 'F3 · o hífen no lugar do sinal menos', rel: 'estado-e-economia/index.html', regra: 'F3',
      estraga: (h) => h.replace(/(data-claim="posicao-de-investimento-internacional-2025"[^>]*>)(?:\u2212|&#8722;|&minus;)/, '$1-') },
  ];
  return casos.map((p) => {
    const limpo = conferirFormatoDaPagina(ler(p.rel), p.rel).desvios;
    const estragado = p.estraga(ler(p.rel));
    const mudou = estragado !== ler(p.rel);
    const desvios = conferirFormatoDaPagina(estragado, p.rel).desvios.filter((d) => d.regra === p.regra);
    return { nome: p.nome, pagina: p.rel, limpa_sem_desvios: limpo.length === 0, estrago_aplicado: mudou, mordeu: mudou && limpo.length === 0 && desvios.length > 0, queixa: desvios[0] ?? null };
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const dist = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
  if (!fs.existsSync(dist)) {
    console.error('formato dos números: não existe dist/. Corra o build primeiro.');
    process.exit(2);
  }
  const r = conferirFormatoDosNumeros(dist);
  const plantas = process.argv.includes('--prova') ? plantasDoFormato(dist) : [];
  const erros = [...r.desvios.map((d) => `${d.regra} · ${d.rel}: «${d.valor}» (${d.contexto})`), ...plantas.filter((p) => !p.mordeu).map((p) => `planta que não mordeu: ${p.nome}`)];
  if (r.contas.valores === 0) erros.push('a célula não leu valor nenhum: o leitor está cego');
  const j = process.argv.indexOf('--json');
  if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ contas: r.contas, desvios: r.desvios, plantas }, null, 2) + '\n');
  console.log(`formato dos números · ${r.contas.paginas} páginas, ${r.contas.valores} valores` +
    (plantas.length ? ` · ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas a morder` : '') +
    ` · o símbolo depois de ${r.contas.simbolos} algarismos declarados, contado e não exigido (o ponto parado do K2): «%» ${r.contas.simbolo['%'].colado} colado(s) e ${r.contas.simbolo['%'].com_espaco} com espaço, «€» ${r.contas.simbolo['€'].colado} colado(s) e ${r.contas.simbolo['€'].com_espaco} com espaço`);
  for (const e of erros.slice(0, 40)) console.error(`  ✗ ${e}`);
  if (erros.length > 40) console.error(`  … e mais ${erros.length - 40}`);
  if (!erros.length) console.log('  ✓ todos os valores rendidos estão no formato da casa: os milhares com U+00A0, a vírgula decimal e o sinal menos.');
  process.exitCode = erros.length ? 1 : 0;
}
