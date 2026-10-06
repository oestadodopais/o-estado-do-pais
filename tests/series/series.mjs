#!/usr/bin/env node
/**
 * AS CÉLULAS S · AS SÉRIES NO TEMPO, LIDAS DE NOVO (bloco RP3, 04.10.2026, o ponto 8 do mandato).
 *
 *   node tests/series/series.mjs --prova [--json <ficheiro>]
 *
 * `npm run check:series`, na cadeia `verify`. Uma segunda leitura das séries no tempo
 * (`ledger/series/*.yml` com `eixo: periodo`), com leitor próprio: NÃO importa
 * `src/lib/series.mjs`, que é onde vivem as regras do `ledger:check` e o que as páginas
 * leem, nem a vista do recibo; «uma conferência que usasse o código das páginas
 * confirmava-se a si própria» (`scripts/check-regioes.mjs`). Lê o disco com o leitor dos
 * portões (`scripts/series-do-portao.mjs`) e as declarações de dados (a tabela das
 * medidas nacionais), e mais nada do sítio.
 *
 * AS SEIS CÉLULAS, com os nomes do brief (são as células S do `check:series`; as regras
 * S1 a S14 do `ledger:check` são outras, e as mensagens desta célula dizem sempre
 * «check:series»):
 *   S1 · a forma: os campos fechados, e cada ponto com período, valor, excerto e marca;
 *   S2 · os períodos crescentes, sem repetição, na cadência declarada, e cada falha da
 *        cadência declarada em `lacunas` (com a razão da fonte, ou null quando ela não dá);
 *   S3 · o valor de cada ponto literalmente no seu excerto (no INE, o `ind_string` na
 *        forma do INE; no Eurostat, o fragmento do valor com o índice que o fragmento
 *        do período dá); e, quando o motor está ao lado (`RESEARCHHUB_DIR`), cada ponto
 *        lido no corpo alojado do seu pedido (os bytes com o resumo da série, do registo
 *        e do manifesto) PELA ESTRUTURA DA RESPOSTA, desde a passagem RP3-b: no Eurostat
 *        a célula (o período no índice do tempo, o índice plano pelos passos do cubo, o
 *        valor e a marca em `value` e `status`, e cada fragmento dentro do seu objeto);
 *        no INE o objeto dentro do bloco do seu período, pelo rótulo da metainformação.
 *        Sem o motor, esta metade diz que não correu, e as plantas da célula correm num
 *        corpo sintético;
 *   S4 · a série derivada refeita ponto a ponto por uma conta desta célula, em decimais
 *        exatos, e as casas que a expressão manda;
 *   S5 · o cartão preso à série: cada linha com o campo `serie` é o ponto do seu
 *        período (o valor, cadeia a cadeia, e a marca); e uma linha que é um cartão
 *        nacional (`DOMINIO_DAS_MEDIDAS`) é o ÚLTIMO ponto da série;
 *   S6 · os recibos, sobre `dist/`: cada série no tempo com o seu recibo nas duas
 *        edições, todos os pontos na tabela pela ordem da série, o período escrito pela
 *        regra da casa (uma cópia desta célula), o valor e a marca do ponto, nenhum
 *        algarismo na tabela fora das origens admitidas, e as duas edições iguais ponto
 *        a ponto.
 *
 * AS PLANTAS (`--prova`): pelo menos uma por célula, numa cópia em memória das séries,
 * das linhas ou do HTML construído, e cada uma tem de morder com a sua própria queixa.
 * `--json <ficheiro>` escreve as contas e as plantas (o registo `plantas-rp3.json` do
 * bloco é escrito assim, pelo guião das medições, fora da cadeia).
 */
import { t } from '../../src/i18n/strings.mjs';
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';
import { REGUAS_DECLARADAS } from '../../src/lib/enquadramento.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';

import { lerSeriesDoPortao } from '../../scripts/series-do-portao.mjs';
import { DOMINIO_DAS_MEDIDAS } from '../../src/data/dominios.mjs';
import { FIGURAS_INDEXADAS, PALAVRAS_DAS_MARCAS_DO_INE } from '../../src/data/series-no-tempo.mjs';
import { PALAVRAS_DA_FAIXA } from '../../src/data/faixa-da-uniao.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const argv = process.argv.slice(2);
const PROVA = argv.includes('--prova');
const JSON_OUT = argv.includes('--json') ? argv[argv.indexOf('--json') + 1] : null;

/* ------------------------------------------------------------------ as leituras */

const CAMPOS = [
  'id', 'eixo', 'name', 'name_source', 'unit', 'periodicidade', 'source', 'document', 'source_url',
  'access_date', 'published_at', 'pedidos', 'excerpt', 'primeiro_periodo', 'ultimo_periodo', 'lacunas',
  'bandeiras', 'pontos', 'derivation', 'derivation_en', 'derived_from', 'check', 'attributed_to', 'study',
  'note', 'corrections',
];
const CAMPOS_DO_PONTO = ['periodo', 'valor', 'excerto', 'bandeira'];
const FORMAS = {
  mensal: /^\d{4}-(0[1-9]|1[0-2])$/,
  trimestral: /^\d{4}-T[1-4]$/,
  semestral: /^\d{4}-S[12]$/,
  anual: /^\d{4}$/,
};

/** As linhas do livro-razão, lidas do disco por esta célula. */
function lerLinhas() {
  const dir = path.join(RAIZ, 'ledger', 'claims');
  const out = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yml'))) {
    const l = load(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (l && typeof l.id === 'string') out.set(l.id, l);
  }
  return out;
}

/** [ano, posição no ano] de um período da casa, ou null. */
function ordem(p) {
  const m = /^(\d{4})(?:-(\d{2})|-T([1-4])|-S([12]))?$/.exec(String(p));
  if (!m) return null;
  return [Number(m[1]), m[2] ? Number(m[2]) : m[3] ? Number(m[3]) * 3 : m[4] ? Number(m[4]) * 6 : 12];
}

/** O período seguinte na cadência, pela conta desta célula. */
function seguinte(p, per) {
  if (per === 'anual') return String(Number(p) + 1);
  const ano = Number(p.slice(0, 4));
  const n = per === 'mensal' ? Number(p.slice(5)) : Number(p.slice(6));
  const de = per === 'mensal' ? 12 : per === 'trimestral' ? 4 : 2;
  const [a, m] = n === de ? [ano + 1, 1] : [ano, n + 1];
  if (per === 'mensal') return `${a}-${String(m).padStart(2, '0')}`;
  return `${a}-${per === 'trimestral' ? 'T' : 'S'}${m}`;
}

/* ------------------------------------------------------- a conta exata da S4 */

/** Um decimal exato desta célula: um inteiro grande e o número de casas. */
function decimal(texto) {
  const s = String(texto).trim().replace(/−/g, '-').replace(/[    ]/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const neg = s.startsWith('-');
  const [i, f = ''] = s.replace('-', '').split('.');
  return { n: BigInt(i + f) * (neg ? -1n : 1n), casas: f.length };
}

/** round(100 × base ÷ atual, casas), meio para longe do zero, sem vírgula flutuante. */
function cemVezesBaseSobreAtual(base, atual, casas) {
  /* 100 × (bn/10^bc) ÷ (an/10^ac) = 100 × bn × 10^ac ÷ (an × 10^bc); arredondado a `casas`. */
  const num = 100n * base.n * 10n ** BigInt(atual.casas) * 10n ** BigInt(casas);
  const den = atual.n * 10n ** BigInt(base.casas);
  const q = num / den;
  const r = num % den;
  const meio = 2n * (r < 0n ? -r : r) >= (den < 0n ? -den : den);
  const arredondado = meio ? q + (num < 0n !== den < 0n ? -1n : 1n) : q;
  return { n: arredondado, casas };
}

/** round(nominal × base ÷ atual, casas), meio para longe do zero, sem vírgula flutuante (bloco RP4-m, o salário real). */
function nominalVezesBaseSobreAtual(nominal, base, atual, casas) {
  /* (wn/10^wc) × (bn/10^bc) ÷ (an/10^ac) = wn × bn × 10^ac ÷ (an × 10^(wc+bc)); arredondado a `casas`. */
  const num = nominal.n * base.n * 10n ** BigInt(atual.casas) * 10n ** BigInt(casas);
  const den = atual.n * 10n ** BigInt(nominal.casas + base.casas);
  const q = num / den;
  const r = num % den;
  const meio = 2n * (r < 0n ? -r : r) >= (den < 0n ? -den : den);
  const arredondado = meio ? q + (num < 0n !== den < 0n ? -1n : 1n) : q;
  return { n: arredondado, casas };
}

function mesmoDecimal(a, b) {
  if (!a || !b) return false;
  const k = Math.max(a.casas, b.casas);
  return a.n * 10n ** BigInt(k - a.casas) === b.n * 10n ** BigInt(k - b.casas);
}

/* ------------------------------------------------------------ as células S1 a S5 */

/** Os erros das células S1 a S5 sobre as séries e as linhas dadas. */
function celulasDoLivro(series, linhas) {
  const erros = { S1: [], S2: [], S3: [], S4: [], S5: [] };
  const contas = { series: 0, pontos: 0, derivadas: 0, pontosRefeitos: 0, linhasPresas: 0, cartoesNoUltimo: 0 };
  for (const [id, s] of series) {
    if (s.eixo !== 'periodo') continue;
    contas.series++;
    const quem = `check:series · ${id}`;
    // S1 · a forma
    const chaves = Object.keys(s).filter((k) => k !== '__file');
    if (chaves.join(' ') !== CAMPOS.join(' ')) erros.S1.push(`${quem}: os campos não são os da forma, pela ordem dela.`);
    const pontos = Array.isArray(s.pontos) ? s.pontos : [];
    if (!pontos.length) erros.S1.push(`${quem}: a série não tem pontos.`);
    for (const p of pontos) {
      if (!p || Object.keys(p).join(' ') !== CAMPOS_DO_PONTO.join(' ')) erros.S1.push(`${quem}: o ponto ${p?.periodo} não tem os quatro campos.`);
    }
    contas.pontos += pontos.length;
    // S2 · a cadência e as lacunas
    const forma = FORMAS[s.periodicidade];
    if (!forma) erros.S2.push(`${quem}: a periodicidade «${s.periodicidade}» não é uma das quatro.`);
    const periodos = pontos.map((p) => String(p?.periodo));
    let cadenciaOk = Boolean(forma) && periodos.length > 0;
    for (let i = 0; i < periodos.length; i++) {
      if (forma && !forma.test(periodos[i])) {
        erros.S2.push(`${quem}: o período «${periodos[i]}» não tem a forma «${s.periodicidade}».`);
        cadenciaOk = false;
      }
      if (i > 0) {
        const a = ordem(periodos[i - 1]);
        const b = ordem(periodos[i]);
        if (!a || !b || a[0] > b[0] || (a[0] === b[0] && a[1] >= b[1])) {
          erros.S2.push(`${quem}: os períodos não são crescentes e sem repetição em ${periodos[i]}.`);
          cadenciaOk = false;
        }
      }
    }
    if (cadenciaOk) {
      const presentes = new Set(periodos);
      const faltam = [];
      for (let p = periodos[0], guarda = 0; p !== periodos[periodos.length - 1] && guarda < 100000; guarda++) {
        p = seguinte(p, s.periodicidade);
        if (!presentes.has(p)) faltam.push(p);
      }
      const lacunas = (s.lacunas ?? []).map((l) => l?.periodo);
      if (faltam.join(' ') !== lacunas.join(' ')) erros.S2.push(`${quem}: faltam na cadência [${faltam.join(', ')}] e as lacunas são [${lacunas.join(', ')}].`);
      for (const l of s.lacunas ?? []) {
        if (l?.razao !== null && !(typeof l?.razao === 'string' && l.razao.trim())) erros.S2.push(`${quem}: a lacuna ${l?.periodo} não tem a razão da fonte nem null.`);
      }
      if (s.primeiro_periodo !== periodos[0] || s.ultimo_periodo !== periodos[periodos.length - 1]) erros.S2.push(`${quem}: o primeiro e o último período não são os dos pontos.`);
    }
    const derivada = Array.isArray(s.derived_from) && s.derived_from.length > 0;
    if (!derivada) {
      // S3 · o valor de cada ponto no seu excerto
      for (const p of pontos) {
        const v = String(p?.valor ?? '');
        const ex = String(p?.excerto ?? '');
        if (s.source === 'INE') {
          const noIne = v.replace(/−/g, '-').replace(/[  ]/g, ' ');
          const literal = `"ind_string" : "${noIne}${p.bandeira ? ` ${p.bandeira}` : ''}"`;
          if (!ex.includes(literal)) erros.S3.push(`${quem}: o valor de ${p?.periodo} («${v}») não está no seu excerto como ${literal}.`);
        } else if (s.source === 'Eurostat') {
          const partes = ex.split(' · ');
          const mt = /^"([^"]+)":(\d+)$/.exec(partes[0] ?? '');
          const mv = /^"(\d+)":(-?\d+(?:\.\d+)?)$/.exec(partes[1] ?? '');
          const naFonte = v.replace(/−/g, '-').replace(/[  ]/g, '').replace(',', '.');
          const codigo = String(p?.periodo).replace(/-T([1-4])$/, '-Q$1');
          if (!mt || mt[1] !== codigo || !mv || mv[1] !== mt[2] || mv[2] !== naFonte) {
            erros.S3.push(`${quem}: o valor de ${p?.periodo} («${v}») não está no seu excerto com o índice do seu período.`);
          } else if (p.bandeira && partes[2] !== `"${mt[2]}":"${p.bandeira}"`) {
            erros.S3.push(`${quem}: a marca de ${p?.periodo} não está no seu excerto com o mesmo índice.`);
          }
        } else {
          erros.S3.push(`${quem}: a fonte «${s.source}» não tem forma de excerto conhecida desta célula.`);
        }
      }
    } else {
      // S4 · a série derivada, refeita por esta célula
      contas.derivadas++;
      /* A SEGUNDA FORMA (bloco RP4-m, 05.10.2026, o salário real): a nominal de cada período vezes o índice do
         período de base, a dividir pelo índice do período, com as duas origens na lista e na mesma cadência. */
      const d = /^round \( ([a-z0-9-]+)\[t\] \* ([a-z0-9-]+)\[(\d{4}(?:-\d{2}|-T[1-4]|-S[12])?)\] \/ ([a-z0-9-]+)\[t\] , (\d+) \)$/.exec(String(s.check ?? ''));
      if (d) {
        const [, idNominal, idIndice, basePeriodo, idIndice2, casasD] = d;
        const origens = s.derived_from ?? [];
        const nominal = series.get(idNominal);
        const indice = series.get(idIndice);
        if (idIndice !== idIndice2 || !origens.includes(idNominal) || !origens.includes(idIndice) || !nominal || !indice
          || nominal.periodicidade !== indice.periodicidade || nominal.periodicidade !== s.periodicidade) {
          erros.S4.push(`${quem}: a expressão «${s.check}» não é uma deflação de duas origens da mesma cadência que esta célula saiba refazer.`);
          continue;
        }
        const daNominal = new Map((nominal.pontos ?? []).map((q) => [String(q.periodo), decimal(q.valor)]));
        const doIndice = new Map((indice.pontos ?? []).map((q) => [String(q.periodo), decimal(q.valor)]));
        const baseD = doIndice.get(basePeriodo);
        if (!baseD) {
          erros.S4.push(`${quem}: a origem ${idIndice} não tem o ponto de base ${basePeriodo}.`);
          continue;
        }
        for (const q of pontos) {
          const w = daNominal.get(String(q?.periodo));
          const i = doIndice.get(String(q?.periodo));
          const publicado = decimal(q?.valor);
          const escritas = String(q?.valor ?? '').split(',')[1]?.length ?? 0;
          if (!w || !i || !mesmoDecimal(nominalVezesBaseSobreAtual(w, baseD, i, Number(casasD)), publicado) || escritas !== Number(casasD)) {
            erros.S4.push(`${quem}: o ponto ${q?.periodo} («${q?.valor}») não é a conta refeita.`);
          } else {
            contas.pontosRefeitos++;
          }
        }
        if ((nominal.pontos ?? []).length !== pontos.length) erros.S4.push(`${quem}: a série tem ${pontos.length} ponto(s) e a nominal ${(nominal.pontos ?? []).length}.`);
        continue;
      }
      const m = /^round \( 100 \* ([a-z0-9-]+)\[(\d{4}-\d{2})\] \/ ([a-z0-9-]+)\[t\] , (\d+) \)$/.exec(String(s.check ?? ''));
      if (!m || m[1] !== m[3] || !(s.derived_from ?? []).includes(m[1])) {
        erros.S4.push(`${quem}: a expressão «${s.check}» não é uma conta que esta célula saiba refazer.`);
        continue;
      }
      const origem = series.get(m[1]);
      const daOrigem = new Map((origem?.pontos ?? []).map((p) => [String(p.periodo), decimal(p.valor)]));
      const base = daOrigem.get(m[2]);
      const casas = Number(m[4]);
      if (!base) {
        erros.S4.push(`${quem}: a origem ${m[1]} não tem o ponto de base ${m[2]}.`);
        continue;
      }
      for (const p of pontos) {
        const atual = daOrigem.get(String(p?.periodo));
        const publicado = decimal(p?.valor);
        const escritas = String(p?.valor ?? '').split(',')[1]?.length ?? 0;
        if (!atual || !mesmoDecimal(cemVezesBaseSobreAtual(base, atual, casas), publicado) || escritas !== casas) {
          erros.S4.push(`${quem}: o ponto ${p?.periodo} («${p?.valor}») não é a conta refeita.`);
        } else {
          contas.pontosRefeitos++;
        }
      }
    }
  }
  // S5 · o cartão preso à série
  for (const [lid, l] of linhas) {
    if (l.serie === undefined || l.serie === null) continue;
    contas.linhasPresas++;
    const s = series.get(String(l.serie));
    const quem = `check:series · ${lid}`;
    if (!s || s.eixo !== 'periodo') {
      erros.S5.push(`${quem}: nomeia a série «${l.serie}», que não é uma série no tempo.`);
      continue;
    }
    const pontos = s.pontos ?? [];
    const ponto = pontos.find((p) => String(p.periodo) === String(l.reference_date));
    if (!ponto || ponto.valor !== l.value || (ponto.bandeira ?? null) !== (l.source_flag ?? null)) {
      erros.S5.push(`${quem}: o valor e o período da linha (${l.reference_date}: ${l.value}) não são o ponto da série «${s.id}» com o mesmo período.`);
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(DOMINIO_DAS_MEDIDAS, lid) || ENTRADAS.some((e) => e.seccoes.some((s) => s.cartoes.some((id) => id === lid || REGUAS_DECLARADAS[id]?.ue === lid)))) {
      if (ponto !== pontos[pontos.length - 1]) {
        erros.S5.push(`${quem}: é uma linha mostrada num cartão nacional e o seu período (${l.reference_date}) não é o último ponto da série «${s.id}» (${pontos[pontos.length - 1]?.periodo}): o cartão está desfasado da série.`);
      } else {
        contas.cartoesNoUltimo++;
      }
    }
  }
  return { erros, contas };
}

/* --------------------------------------------- a metade do motor da S3 (opcional) */

/*
 * A LEITURA ESTRUTURAL DOS CORPOS (passagem RP3-b, o achado 5 da leitura a frio). Até à RP3-b esta metade
 * procurava os fragmentos do excerto nos bytes inteiros do corpo, e um valor escrito numa anotação, com outro
 * número na célula, passava; agora lê a célula: no Eurostat, o período no índice da dimensão do tempo, o índice
 * plano pelos passos de `id` e `size` com as categorias da edição, o valor e a marca em `value[<índice>]` e
 * `status[<índice>]` como os bytes os escrevem, e cada fragmento uma vez dentro do seu objeto; no INE, o
 * objeto dentro do bloco do seu período (achado pelo rótulo da metainformação), com as coordenadas, o valor e a
 * marca dele. As duas leituras são funções puras, para as plantas as chamarem sobre corpos mexidos em memória.
 */

/** O índice do fim de um valor JSON que começa em `texto[i]` (cadeias com escapes, objetos e listas aninhados). */
function fimDoValorJson(texto, i) {
  const c = texto[i];
  if (c === '"') {
    let k = i + 1;
    while (k < texto.length && texto[k] !== '"') k += texto[k] === '\\' ? 2 : 1;
    return k + 1;
  }
  if (c === '{' || c === '[') {
    let fundo = 0;
    for (let k = i; k < texto.length; k++) {
      const d = texto[k];
      if (d === '"') {
        k = fimDoValorJson(texto, k) - 1;
      } else if (d === '{' || d === '[') fundo++;
      else if (d === '}' || d === ']') {
        fundo--;
        if (fundo === 0) return k + 1;
      }
    }
    return -1;
  }
  const m = /^-?\d+(\.\d+)?([eE][+-]?\d+)?|^true|^false|^null/.exec(texto.slice(i, i + 40));
  return m ? i + m[0].length : -1;
}

/** Os membros de um objeto JSON que abre em `texto[i]`: { chave: [início, fim] } do valor de cada um. */
function membrosJson(texto, i) {
  /** @type {Record<string, [number, number]>} */
  const out = {};
  if (texto[i] !== '{') return out;
  let k = i + 1;
  const espaco = /[\s,]/;
  while (k < texto.length) {
    while (espaco.test(texto[k])) k++;
    if (texto[k] === '}') return out;
    const fimChave = fimDoValorJson(texto, k);
    const chave = JSON.parse(texto.slice(k, fimChave));
    k = fimChave;
    while (/\s/.test(texto[k])) k++;
    if (texto[k] !== ':') return out;
    k++;
    while (/\s/.test(texto[k])) k++;
    const fim = fimDoValorJson(texto, k);
    out[chave] = [k, fim];
    k = fim;
  }
  return out;
}

/** As coordenadas de uma edição «<código>, <dim>=<cat>, …». */
function coordenadasDaEdicaoDaSerie(edicao) {
  const [, ...pares] = String(edicao ?? '').split(', ');
  return Object.fromEntries(pares.map((par) => par.split('=')));
}

/** Quantas vezes um fragmento aparece dentro de um sítio [início, fim] do texto. */
function vezesEm(texto, fragmento, sitio) {
  if (!sitio) return 0;
  const parte = texto.slice(sitio[0], sitio[1]);
  let n = 0;
  for (let k = parte.indexOf(fragmento); k >= 0; k = parte.indexOf(fragmento, k + 1)) n++;
  return n;
}

/**
 * O erro da célula de um ponto do Eurostat, ou `null` quando a célula é a do ponto.
 * @param {string} raw @param {any} serie @param {any} ponto
 */
function erroDaCelulaDoEurostat(raw, serie, ponto) {
  let doc;
  let literal;
  try {
    doc = JSON.parse(raw);
    literal = JSON.parse(raw, (_k, v, ctx) => (typeof v === 'number' && ctx ? ctx.source : v));
  } catch {
    return 'o corpo não é JSON';
  }
  const coords = coordenadasDaEdicaoDaSerie(serie.document?.edition);
  const ids = doc.id;
  const size = doc.size;
  if (!Array.isArray(ids) || !Array.isArray(size) || ids.length !== size.length || !ids.includes('time')) return 'a resposta não tem a forma de um cubo com o tempo';
  const outras = ids.filter((d) => d !== 'time');
  if (outras.slice().sort().join() !== Object.keys(coords).sort().join()) return `a edição nomeia ${Object.keys(coords).sort()} e o cubo tem ${outras}`;
  const passos = size.map(() => 1);
  for (let k = size.length - 2; k >= 0; k--) passos[k] = passos[k + 1] * size[k + 1];
  let base = 0;
  for (const [k, d] of ids.entries()) {
    if (d === 'time') continue;
    const indice = doc.dimension?.[d]?.category?.index ?? {};
    if (!(coords[d] in indice)) return `a dimensão ${d} não tem a categoria ${coords[d]}`;
    base += indice[coords[d]] * passos[k];
  }
  const tempos = doc.dimension?.time?.category?.index ?? {};
  const codigo = String(ponto.periodo).replace(/-T([1-4])$/, coords.freq === 'Q' ? '-Q$1' : '-T$1');
  if (!(codigo in tempos)) return `o período ${ponto.periodo} não está no índice do tempo`;
  const posicao = tempos[codigo];
  const n = base + posicao * passos[ids.indexOf('time')];
  const texto = literal.value?.[String(n)];
  if (texto === undefined || texto === null) return `a célula ${n} não tem valor`;
  const marca = literal.status?.[String(n)] ?? null;
  const naFonte = String(ponto.valor).replace(/\u2212/g, '-').replace(/[\u202f\u00a0 ]/g, '').replace(',', '.');
  if (String(texto) !== naFonte) return `o ponto diz «${ponto.valor}» e a célula ${n} da resposta «${texto}»`;
  if ((ponto.bandeira ?? null) !== marca) return `a marca do ponto é «${ponto.bandeira ?? null}» e a célula ${n} da resposta tem «${marca}» em status`;
  const partes = [`${JSON.stringify(codigo)}:${posicao}`, `"${n}":${texto}`];
  if (marca !== null) partes.push(`"${n}":${JSON.stringify(marca)}`);
  if (String(ponto.excerto) !== partes.join(' · ')) return `o excerto não é o das posições da célula ${n} (esperava ${partes.join(' · ')})`;
  const topo = membrosJson(raw, raw.indexOf('{'));
  const dim = topo.dimension ? membrosJson(raw, topo.dimension[0]) : {};
  const tempo = dim.time ? membrosJson(raw, dim.time[0]) : {};
  const cat = tempo.category ? membrosJson(raw, tempo.category[0]) : {};
  if (vezesEm(raw, partes[0], cat.index) !== 1) return `o fragmento do período não está uma vez dentro do índice do tempo`;
  if (vezesEm(raw, partes[1], topo.value) !== 1) return `o fragmento do valor não está uma vez dentro de «value»`;
  if (marca !== null && vezesEm(raw, partes[2], topo.status) !== 1) return `o fragmento da marca não está uma vez dentro de «status»`;
  return null;
}

/** O rótulo de cada período da casa na metainformação de um indicador do INE. */
function rotulosDoIne(metaRaw) {
  /** @type {Record<string, string>} */
  const rotulo = {};
  const meta = JSON.parse(metaRaw)[0];
  for (const g of meta?.Dimensoes?.Categoria_Dim ?? []) {
    for (const itens of Object.values(g)) {
      for (const c of /** @type {any[]} */ (itens)) {
        if (String(c.dim_num) !== '1') continue;
        const cod = String(c.categ_cod);
        if (/^S7A\d{4}$/.test(cod)) rotulo[cod.slice(3)] = c.categ_dsg;
        else {
          const ano = cod.slice(3, 7);
          const mes = Number(cod.slice(7, 9));
          rotulo[`${ano}-${String(mes).padStart(2, '0')}`] = c.categ_dsg;
          if (mes % 3 === 0) rotulo[`${ano}-T${mes / 3}`] = c.categ_dsg;
        }
      }
    }
  }
  return rotulo;
}

/**
 * O erro do objeto de um ponto do INE no bloco do seu período, ou `null`.
 * @param {string} raw @param {Record<string, string>} rotulos @param {any} serie @param {any} ponto
 */
function erroDoBlocoDoIne(raw, rotulos, serie, ponto) {
  const rotulo = rotulos[ponto.periodo];
  if (!rotulo) return `a metainformação não tem o período ${ponto.periodo}`;
  const chave = JSON.stringify(rotulo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(`${chave}\\s*:\\s*\\[`).exec(raw);
  if (!m) return `o corpo não tem o bloco de ${ponto.periodo}`;
  const inicio = m.index + m[0].length - 1;
  const fim = fimDoValorJson(raw, inicio);
  const bloco = raw.slice(inicio, fim).replace(/\s+/g, ' ');
  if (!bloco.includes(String(ponto.excerto))) return `o excerto de ${ponto.periodo} não está no bloco do seu período`;
  let obj;
  try {
    obj = JSON.parse(String(ponto.excerto));
  } catch {
    return `o excerto de ${ponto.periodo} não é um objeto da resposta`;
  }
  const coords = coordenadasDaEdicaoDaSerie(serie.document?.edition);
  for (const [k, v] of Object.entries(coords)) if (obj[k] !== v) return `o objeto de ${ponto.periodo} diz ${k}=${obj[k]}`;
  const marca = obj.sinal_conv || null;
  let texto = String(obj.ind_string ?? '');
  if (marca) {
    if (!texto.endsWith(` ${marca}`)) return `a marca de ${ponto.periodo} não acompanha o valor`;
    texto = texto.slice(0, -(marca.length + 1));
  }
  const noIne = String(ponto.valor).replace(/\u2212/g, '-').replace(/[\u202f\u00a0]/g, ' ');
  if (texto !== noIne || (ponto.bandeira ?? null) !== marca) return `o ponto ${ponto.periodo} diz «${ponto.valor}» ${ponto.bandeira ?? null} e o objeto «${texto}» ${marca}`;
  return null;
}

/** A fonte do motor: o registo dos pedidos, o manifesto e a leitura de um corpo pelo seu caminho. */
function fonteDoMotor(motor) {
  const raiz = path.join(motor, 'content', '13 Dominios', 'source');
  return {
    fetch: JSON.parse(fs.readFileSync(path.join(raiz, 'FETCH.json'), 'utf8')).files,
    manifesto: new Map(fs.readFileSync(path.join(raiz, 'MANIFEST.sha256'), 'utf8').split('\n').filter(Boolean).map((l) => {
      const i = l.indexOf('  ');
      return [l.slice(i + 2), l.slice(0, i)];
    })),
    ler: (/** @type {string} */ rel) => fs.readFileSync(path.join(raiz, rel)),
  };
}

const INE_META = (/** @type {string} */ codigo) => `https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=${codigo}&lang=PT`;

/* AS PASTAS DOS CORPOS DAS SÉRIES (bloco RP4-m, 05.10.2026): a do RP3, a do RP4-m (as cinco séries do IPC) e as
   das corridas do corredor das séries do motor (`corredor-series/<AAAA-MM-DD>/`). O mesmo endereço pode estar
   alojado em mais de uma corrida, e por isso o corpo de um pedido acha-se pelo endereço E pelo resumo que a série
   regista nesse pedido; a metainformação do INE, que a série não resume, lê-se da corrida mais recente. A
   conferência é a mesma de antes: os bytes, o registo e o manifesto têm de dar o resumo do pedido. */
const PASTAS_DAS_SERIES = /^(?:rp3|rp4m|corredor-series\/\d{4}-\d{2}-\d{2})\//;

/** O corpo alojado de um endereço, conferido pelo resumo dos seus bytes, do registo e do manifesto. */
function corpoDoEndereco(fonte, url, resumo) {
  const candidatos = Object.entries(fonte.fetch).filter(([rel, f]) => PASTAS_DAS_SERIES.test(rel) && f.url === url && f.estado === 'lido');
  if (!candidatos.length) return { erro: `o pedido ${url.slice(0, 80)} não tem corpo alojado` };
  const achado = resumo
    ? candidatos.find(([, f]) => f.sha256 === resumo)
    : candidatos.sort((a, b) => String(a[1].fetched_at ?? '').localeCompare(String(b[1].fetched_at ?? ''))).at(-1);
  if (!achado) return { erro: `o corpo de ${url.slice(0, 80)} não dá o resumo da série, do registo e do manifesto` };
  const bytes = fonte.ler(achado[0]);
  const daqui = createHash('sha256').update(bytes).digest('hex');
  const esperado = resumo ?? achado[1].sha256;
  if (daqui !== esperado || achado[1].sha256 !== esperado || fonte.manifesto.get(achado[0]) !== esperado) {
    return { erro: `o corpo de ${url.slice(0, 80)} não dá o resumo da série, do registo e do manifesto` };
  }
  return { raw: bytes.toString('utf8') };
}

function metadeDoMotor(series, fonte = null) {
  const motor = process.env.RESEARCHHUB_DIR ? path.resolve(process.env.RESEARCHHUB_DIR) : null;
  if (!fonte && !motor) return { correu: false, erros: [], pontos: 0, razao: 'sem RESEARCHHUB_DIR: a metade do motor não corre aqui' };
  const f = fonte ?? fonteDoMotor(/** @type {string} */ (motor));
  const erros = [];
  let pontos = 0;
  for (const [id, s] of series) {
    if (s.eixo !== 'periodo' || !(s.pedidos ?? []).length) continue;
    const corpos = new Map();
    for (const q of s.pedidos) {
      const c = corpoDoEndereco(f, q.url, q.sha256);
      if (c.erro) erros.push(`check:series · ${id}: ${c.erro}.`);
      else corpos.set(q, c.raw);
    }
    for (const parte of String(s.excerpt).split(' · ')) {
      if (![...corpos.values()].some((raw) => raw.includes(parte))) erros.push(`check:series · ${id}: o literal da série tem «${parte.slice(0, 60)}», que o corpo não escreve.`);
    }
    let rotulos = null;
    if (s.source === 'INE') {
      const codigo = String(s.document?.edition ?? '').split(', ')[0];
      const meta = corpoDoEndereco(f, INE_META(codigo), null);
      if (meta.erro) {
        erros.push(`check:series · ${id}: a metainformação: ${meta.erro}.`);
        continue;
      }
      rotulos = rotulosDoIne(meta.raw);
    }
    for (const p of s.pontos) {
      const o = ordem(p.periodo);
      const q = s.pedidos.find((x) => {
        const a = ordem(x.primeiro);
        const b = ordem(x.ultimo);
        return a && b && o && (a[0] < o[0] || (a[0] === o[0] && a[1] <= o[1])) && (o[0] < b[0] || (o[0] === b[0] && o[1] <= b[1]));
      });
      const raw = q ? corpos.get(q) : null;
      const erro = !raw ? 'não tem corpo' : s.source === 'INE' ? erroDoBlocoDoIne(raw, /** @type {any} */ (rotulos), s, p) : erroDaCelulaDoEurostat(raw, s, p);
      if (erro) erros.push(`check:series · ${id}: ${p.periodo}: ${erro}.`);
      else pontos++;
    }
  }
  return { correu: true, erros, pontos, razao: null };
}

/* ------------------------------------------------------------- a célula S6 (dist) */

const MESES = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** A regra da casa para o período de um ponto, escrita outra vez aqui. */
function periodoNaPagina(p, lang) {
  let m = /^(\d{4})-(\d{2})$/.exec(p);
  if (m) return lang === 'en' ? `${MESES.en[Number(m[2]) - 1]} ${m[1]}` : `${MESES.pt[Number(m[2]) - 1]} de ${m[1]}`;
  m = /^(\d{4})-T([1-4])$/.exec(p);
  if (m) return lang === 'en' ? `${m[2]}${['st', 'nd', 'rd', 'th'][Number(m[2]) - 1]} quarter of ${m[1]}` : `${m[2]}.º trimestre de ${m[1]}`;
  m = /^(\d{4})-S([12])$/.exec(p);
  if (m) return lang === 'en' ? `${m[2]}${['st', 'nd'][Number(m[2]) - 1]} half of ${m[1]}` : `${m[2]}.º semestre de ${m[1]}`;
  return p;
}

const texto = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const semEspacos = (v) => String(v).replace(/[    ]/g, '');

/** O recibo de uma série numa edição, como HTML, ou null. */
function reciboEmDisco(id, lang) {
  const f = lang === 'en' ? path.join(DIST, 'en', 'ledger', 'series', id, 'index.html') : path.join(DIST, 'livro-razao', 'series', id, 'index.html');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}

/** Os erros da S6 para uma série, a partir do HTML das duas edições. */
function celulaDosRecibos(s, htmlPorLingua) {
  const erros = [];
  const pontosPorLingua = {};
  for (const lang of ['pt', 'en']) {
    const html = htmlPorLingua[lang];
    const quem = `check:series · ${s.id} (${lang})`;
    if (!html) {
      erros.push(`${quem}: o recibo não está construído.`);
      continue;
    }
    const root = parse(html);
    const tabela = root.querySelector(`[data-serie-tabela="${s.id}"]`);
    if (!tabela) {
      erros.push(`${quem}: o recibo não tem a tabela da série.`);
      continue;
    }
    /* RP4: uma linha por ano, com cada ponto na coluna da sua cadência.
       O período completo permanece em cada célula para quem lê sem o desenho. */
    const linhas = tabela.querySelectorAll('tbody tr');
    const cadencias = { mensal: 12, trimestral: 4, semestral: 2, anual: 1 };
    const n = cadencias[s.periodicidade];
    const st = t(lang).livro.serieNoTempo;
    const rotulos = s.periodicidade === 'mensal' ? st.meses : s.periodicidade === 'trimestral' ? st.trimestres : s.periodicidade === 'semestral' ? st.semestres : [t(lang).livro.serie.valorK];
    if (JSON.stringify(tabela.querySelectorAll('thead th').map(texto)) !== JSON.stringify([st.anoK, ...rotulos])) erros.push(`${quem}: os cabeçalhos não são os períodos da cadência`);
    const anoInicial = Number(s.primeiro_periodo.slice(0, 4));
    const anoFinal = Number(s.ultimo_periodo.slice(0, 4));
    if (linhas.length !== anoFinal - anoInicial + 1) erros.push(`${quem}: a tabela não tem uma linha por ano`);
    const vistos = [];
    for (const [i, tr] of linhas.entries()) {
      const ano = String(anoInicial + i);
      if (tr.getAttribute('data-serie-ano') !== ano || texto(tr.querySelector('th')) !== ano) erros.push(`${quem}: o ano da linha da tabela não é ${ano}`);
      const celulas = tr.querySelectorAll('td');
      if (celulas.length !== n) erros.push(`${quem}: a linha do ano não tem as colunas da cadência`);
      for (const [j, td] of celulas.entries()) {
        const per = s.periodicidade === 'anual' ? ano : `${ano}-${s.periodicidade === 'mensal' ? String(j + 1).padStart(2, '0') : `${s.periodicidade === 'trimestral' ? 'T' : 'S'}${j + 1}`}`;
        if (td.getAttribute('data-serie-celula') !== per) erros.push(`${quem}: a célula não está na coluna de ${per}`);
        const ponto = td.querySelector('[data-ponto]');
        const esperado = s.pontos.find((p) => p.periodo === per);
        const lacuna = s.lacunas.find((p) => p.periodo === per);
        const data = td.querySelector('[data-nonledger="data-da-linha"]');
        const marca = td.querySelector('[data-ponto-bandeira]');
        if (esperado) {
          if (td.querySelectorAll('[data-ponto]').length !== 1) erros.push(`${quem}: ponto em falta ou repetido em ${per}`);
          if (ponto?.getAttribute('data-ponto') !== `${s.id}#${per}`) erros.push(`${quem}: ponto na coluna de outro período`);
          vistos.push([ponto?.getAttribute('data-ponto') ?? '', semEspacos(texto(ponto)), texto(data), marca ? texto(marca) : null]);
          if (marca && marca.getAttribute('data-ponto-bandeira') !== `${s.id}#${per}`) erros.push(`${quem}: marca de outro período`);
        } else if (lacuna) {
          const l = td.querySelector('[data-serie-lacuna-tabela]');
          const palavras = lang === 'pt' ? 'sem valor' : 'no value';
          if (ponto || marca || l?.getAttribute('data-serie-lacuna-tabela') !== `${s.id}#${per}` || texto(data) !== periodoNaPagina(per, lang) || texto(l) !== `${periodoNaPagina(per, lang)} ${palavras}`) erros.push(`${quem}: a lacuna não é a declarada em ${per}`);
        } else if (texto(td) || ponto) erros.push(`${quem}: valor fora dos períodos da série`);
      }
      const copia = parse(tr.outerHTML);
      for (const el of copia.querySelectorAll('th, [data-ponto], [data-nonledger="data-da-linha"], [data-ponto-bandeira]')) el.remove();
      if (/\d/.test(texto(copia))) erros.push(`${quem}: a linha do ano ${ano} tem algarismos fora das origens admitidas`);
    }
    const esperados = (s.pontos ?? []).map((p) => [`${s.id}#${p.periodo}`, semEspacos(p.valor), periodoNaPagina(String(p.periodo), lang), p.bandeira ?? null]);
    if (vistos.length !== esperados.length) erros.push(`${quem}: a tabela tem ${vistos.length} pontos e a série ${esperados.length} pontos.`);
    for (let i = 0; i < Math.min(vistos.length, esperados.length); i++) {
      const [ck, cv, cd, cm] = vistos[i];
      const [ek, ev, ed, em] = esperados[i];
      if (ck !== ek || cv !== ev || cd !== ed || cm !== em) {
        erros.push(`${quem}: a linha ${i + 1} da tabela diz ${ck} «${cv}» «${cd}» «${cm}» e a série ${ek} «${ev}» «${ed}» «${em}».`);
        break;
      }
    }
    pontosPorLingua[lang] = vistos.map(([k, v, , m]) => `${k}=${v}${m ? ` ${m}` : ''}`).join('|');
    erros.push(...celulaDoIndiceEDaFigura(s, root, lang, quem));
    erros.push(...celulaDoUltimoPonto(s, root, lang, quem));
  }
  if (pontosPorLingua.pt !== undefined && pontosPorLingua.en !== undefined && pontosPorLingua.pt !== pontosPorLingua.en) {
    erros.push(`check:series · ${s.id}: as duas edições do recibo não têm os mesmos pontos com os mesmos valores.`);
  }
  return erros;
}

/* AS DUAS COISAS DO BLOCO RP4-m NO RECIBO (05.10.2026), lidas com leitura própria.
   · O QUE UM ÍNDICE QUER DIZER (o ponto 5): uma série cuja unidade é «índice (base AAAA = 100)» tem uma frase só,
     com o valor e o período do último ponto pelas suas marcas e a palavra do lado que esta célula escolhe pela
     comparação com cem; uma série com outra unidade não tem a frase.
   · A FIGURA INDEXADA (o ponto 4): uma série declarada em `FIGURAS_INDEXADAS` desenha as séries da lista, pela
     ordem dela, no modo indexado, com o traço da série do recibo por último (é ele que a folha desenha a
     tracejado); a legenda tem uma entrada por série, pela mesma ordem, só a última tracejada, e diz o período de
     base da regra do RP4 pela marca da data; uma série não declarada não tem figura indexada. */
const BASE_DA_FIGURA = { mensal: '2015-01', trimestral: '2015-T1', semestral: '2015-S1', anual: '2015' };
function celulaDoIndiceEDaFigura(s, root, lang, quem) {
  const erros = [];
  const st = t(lang).livro.serieNoTempo;
  const frases = root.querySelectorAll('[data-serie-indice]');
  if (/^índice \(base \d{4} = 100\)$/.test(String(s.unit))) {
    const ultimo = s.pontos[s.pontos.length - 1];
    const v = decimal(ultimo.valor);
    const cem = { n: 100n, casas: 0 };
    const k = v ? Math.max(v.casas, 0) : 0;
    const comparado = v ? (v.n > cem.n * 10n ** BigInt(k) ? 1 : v.n < cem.n * 10n ** BigInt(k) ? -1 : 0) : null;
    const lado = comparado === 1 ? st.indiceAcima : comparado === -1 ? st.indiceAbaixo : st.indiceIgual;
    const f = frases[0];
    const ponto = f?.querySelector('[data-ponto]');
    const data = f?.querySelector('[data-nonledger="data-da-linha"]');
    if (frases.length !== 1 || f.getAttribute('data-serie-indice') !== s.id) erros.push(`${quem}: o recibo de um índice não tem uma frase do que o valor quer dizer, e tem de ter uma.`);
    else if (ponto?.getAttribute('data-ponto') !== `${s.id}#${ultimo.periodo}` || semEspacos(texto(ponto)) !== semEspacos(ultimo.valor)) erros.push(`${quem}: a frase do índice não diz o valor do último ponto.`);
    else if (texto(data) !== periodoNaPagina(ultimo.periodo, lang)) erros.push(`${quem}: a frase do índice não diz o período do último ponto.`);
    else if (!texto(f).endsWith(lado.trim())) erros.push(`${quem}: a frase do índice diz o lado errado da base (esperava «${lado.trim()}»).`);
  } else if (frases.length) erros.push(`${quem}: uma série que não é um índice tem a frase do índice.`);
  const lista = /** @type {Record<string, string[]>} */ (FIGURAS_INDEXADAS)[s.id] ?? null;
  const figuras = root.querySelectorAll('.serie-grafico-indexado');
  if (!lista) {
    if (figuras.length || root.querySelector('[data-serie-indexada]')) erros.push(`${quem}: uma série sem figura indexada declarada tem uma.`);
    return erros;
  }
  const svg = figuras.length === 1 ? figuras[0].querySelector('svg[data-forma="serie-do-pais"]') : null;
  const linhasDoDesenho = svg ? svg.querySelectorAll('polyline, circle').map((e) => e.getAttribute('data-serie-linha')) : [];
  if (!svg || svg.getAttribute('data-series') !== lista.join(',') || svg.getAttribute('data-modo') !== 'indice') erros.push(`${quem}: a figura indexada não desenha as séries declaradas, pela ordem, no modo indexado.`);
  else if (linhasDoDesenho[linhasDoDesenho.length - 1] !== s.id || svg.querySelectorAll('polyline').at(-1)?.getAttribute('data-serie-linha') !== s.id) erros.push(`${quem}: o último traço da figura indexada não é o da série do recibo.`);
  const legenda = root.querySelector(`[data-serie-indexada="${s.id}"]`);
  const entradas = legenda ? legenda.querySelectorAll('[data-serie-indexada-linha]') : [];
  if (entradas.map((e) => e.getAttribute('data-serie-indexada-linha')).join(',') !== lista.join(',')) erros.push(`${quem}: a legenda da figura indexada não tem as séries declaradas, pela ordem.`);
  else if (entradas.some((e, i) => e.querySelector('.serie-indexada-traco')?.classList.contains('serie-indexada-traco-tracejado') !== (i === lista.length - 1))) erros.push(`${quem}: a legenda tracejada não é só a da série do recibo.`);
  const base = BASE_DA_FIGURA[s.periodicidade];
  const dataDaBase = legenda?.querySelector('.serie-indexada-frase [data-nonledger="data-da-linha"]');
  if (texto(dataDaBase) !== periodoNaPagina(base, lang)) erros.push(`${quem}: a legenda da figura indexada não diz o período de base ${base}.`);
  return erros;
}

/* O QUE O ÚLTIMO PONTO QUER DIZER (bloco R4, 05.10.2026, o ponto 3 do brief), lido com conta própria: o mesmo período
   de há um ano pela regra desta célula (o ano menos um, com o mês, o trimestre ou o semestre), e o ponto anterior
   quando a série não tem esse; o lado pela comparação em decimais exatos; as marcas dos dois pontos e das duas datas;
   e o texto inteiro, recomposto das cadeias da casa, dos períodos pela regra da casa (a cópia desta célula), dos
   valores da série, da unidade que a cabeça do recibo rende (o portão de HTML confere-a contra a série) e das palavras
   declaradas da marca de cada ponto. Nenhum algarismo fora das marcas. */
function haUmAnoAqui(p) {
  const m = /^(\d{4})(-(?:\d{2}|T[1-4]|S[12]))?$/.exec(String(p));
  return m ? `${Number(m[1]) - 1}${m[2] ?? ''}` : null;
}
function ladoAqui(a, b) {
  const k = Math.max(a.casas, b.casas);
  const x = a.n * 10n ** BigInt(k - a.casas);
  const y = b.n * 10n ** BigInt(k - b.casas);
  return x > y ? 'maior' : x < y ? 'menor' : 'igual';
}
function celulaDoUltimoPonto(s, root, lang, quem) {
  const erros = [];
  const st = t(lang).livro.serieNoTempo;
  const frases = root.querySelectorAll('[data-serie-ultimo]');
  const pontos = s.pontos ?? [];
  if (pontos.length < 2) {
    if (frases.length) erros.push(`${quem}: uma série com menos de dois pontos tem a frase do último ponto.`);
    return erros;
  }
  const iU = pontos.length - 1;
  const alvo = haUmAnoAqui(pontos[iU].periodo);
  const iA = pontos.findIndex((p) => String(p.periodo) === alvo);
  const com = iA >= 0 ? 'ha-um-ano' : 'anterior';
  const iO = iA >= 0 ? iA : iU - 1;
  const u = pontos[iU];
  const o = pontos[iO];
  const du = decimal(u.valor);
  const dO = decimal(o.valor);
  if (!du || !dO) return [`${quem}: o último ponto ou o ponto com que se compara não se lê como número.`];
  const lado = ladoAqui(du, dO);
  const f = frases[0];
  if (frases.length !== 1 || f.getAttribute('data-serie-ultimo') !== s.id) return [`${quem}: o recibo tem ${frases.length} frase(s) do que o último ponto quer dizer, e tem uma.`];
  if (f.getAttribute('data-serie-ultimo-com') !== com) erros.push(`${quem}: a frase do último ponto diz comparar com «${f.getAttribute('data-serie-ultimo-com')}», e esta conta compara com «${com}».`);
  if (f.getAttribute('data-serie-ultimo-lado') !== lado) erros.push(`${quem}: a frase do último ponto diz o lado «${f.getAttribute('data-serie-ultimo-lado')}», e esta conta dá «${lado}».`);
  const citados = f.querySelectorAll('[data-ponto]').map((e) => e.getAttribute('data-ponto'));
  if (citados.join(',') !== `${s.id}#${u.periodo},${s.id}#${o.periodo}`) erros.push(`${quem}: a frase do último ponto compara com outro período: cita ${citados.join(', ') || 'nenhum ponto'}, e esta conta compara ${u.periodo} com ${o.periodo}.`);
  const campos = f.querySelectorAll('[data-nonledger="data-da-linha"]').map((e) => e.getAttribute('data-de-campo'));
  if (campos.join(',') !== `pontos.${iU}.periodo,pontos.${iO}.periodo`) erros.push(`${quem}: as datas da frase do último ponto não são as dos dois pontos comparados.`);
  const eIndice = /^índice \(base \d{4} = 100\)$/.test(String(s.unit));
  const unidade = eIndice ? '' : ` ${texto(root.querySelector('.serie-periodo [data-serie-campo="unit"]'))}`;
  const marcas = s.source === 'INE' ? PALAVRAS_DAS_MARCAS_DO_INE[lang] : PALAVRAS_DA_FAIXA[lang].ressalvas;
  const marca = (p) => (p.bandeira ? ` (${marcas[p.bandeira]})` : '');
  const per = s.periodicidade;
  const esperado = `${st.ultimoEm[per]}${periodoNaPagina(u.periodo, lang)}${st.ultimoFoi}${u.valor}${unidade}${marca(u)}` +
    `${st.ultimoLado[lado]}${st.ultimoReferencia[com === 'ha-um-ano' ? per : 'anterior']}${st.ultimoArtigo[per]}` +
    `${periodoNaPagina(o.periodo, lang)}${st.ultimoQuando}${o.valor}${unidade}${marca(o)}${st.ultimoFim}`;
  if (semEspacos(texto(f)) !== semEspacos(esperado)) erros.push(`${quem}: a frase do último ponto não é a que esta conta escreve: «${texto(f)}» contra «${esperado.replace(/\s+/g, ' ')}».`);
  const copia = parse(f.outerHTML);
  for (const el of copia.querySelectorAll('[data-ponto], [data-nonledger="data-da-linha"], [data-serie-campo]')) el.remove();
  if (/\d/.test(texto(copia))) erros.push(`${quem}: a frase do último ponto tem algarismos fora das marcas.`);
  return erros;
}

/* --------------------------------------------------------------------- a corrida */

const series = lerSeriesDoPortao(RAIZ);
const linhas = lerLinhas();
const noTempo = [...series.values()].filter((s) => s.eixo === 'periodo');
const { erros, contas } = celulasDoLivro(series, linhas);
const motor = metadeDoMotor(series);
erros.S3.push(...motor.erros);
erros.S6 = [];
const temDist = fs.existsSync(path.join(DIST, 'version.json'));
if (!temDist) erros.S6.push('check:series · não há dist/ construído: a S6 lê os recibos construídos, corra o build primeiro.');
let recibos = 0;
if (temDist) {
  for (const s of noTempo) {
    const html = { pt: reciboEmDisco(s.id, 'pt'), en: reciboEmDisco(s.id, 'en') };
    erros.S6.push(...celulaDosRecibos(s, html));
    recibos += Number(Boolean(html.pt)) + Number(Boolean(html.en));
  }
}
if (!noTempo.length) erros.S1.push('check:series · não há séries no tempo em ledger/series/: um zero que não prova nada.');

/* ---------------------------------------------------------------------- as plantas */

const plantas = [];
function planta(celula, nome, espera, correr) {
  const r = correr();
  const lista = r[celula] ?? [];
  const mordeu = lista.some((e) => e.includes(espera));
  plantas.push({ celula, nome, espera, mordeu, primeira: lista[0] ?? null });
}
const copiaDasSeries = (id, mexer) => {
  const m = new Map([...series].map(([k, v]) => [k, structuredClone(v)]));
  mexer(m.get(id));
  return m;
};
const copiaDasLinhas = (id, mexer) => {
  const m = new Map(linhas);
  const l = structuredClone(m.get(id));
  mexer(l);
  m.set(id, l);
  return m;
};
if (PROVA && noTempo.length) {
  planta('S1', 'um campo que não pertence à forma', 'os campos não são os da forma', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-variacao-homologa', (s) => { s.nota = 'x'; }), linhas).erros);
  planta('S1', 'um ponto sem excerto', 'não tem os quatro campos', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-variacao-homologa', (s) => { delete s.pontos[0].excerto; }), linhas).erros);
  planta('S2', 'um período repetido', 'não são crescentes e sem repetição', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-alimentacao-variacao-homologa', (s) => { s.pontos[1] = structuredClone(s.pontos[0]); }), linhas).erros);
  planta('S2', 'uma lacuna por declarar', 'faltam na cadência', () =>
    celulasDoLivro(copiaDasSeries('serie-linha-de-risco-de-pobreza', (s) => { s.lacunas = []; }), linhas).erros);
  planta('S3', 'um valor do INE fora do seu excerto', 'não está no seu excerto como', () =>
    celulasDoLivro(copiaDasSeries('serie-pensao-media-anual', (s) => { s.pontos[0].valor = '5 001'; }), linhas).erros);
  planta('S3', 'um valor do Eurostat com o índice de outro período', 'não está no seu excerto com o índice', () =>
    celulasDoLivro(copiaDasSeries('serie-salario-minimo-mensal', (s) => { s.pontos[0].excerto = s.pontos[0].excerto.replace('"0":357', '"1":357'); }), linhas).erros);
  /* S3 · A CÉLULA DO EUROSTAT E O BLOCO DO INE (passagem RP3-b, o achado 5 da leitura a frio). Num corpo
     sintético do Eurostat, que corre sempre: o verde e as duas plantas (o valor do ponto só numa anotação, com
     outro número na célula; a marca «e» da célula omitida no ponto e no excerto). Com o motor ao lado, as mesmas
     duas plantas sobre os corpos alojados da S12 e da S4, mexidos em memória, e a do objeto de outro período
     num corpo do INE. */
  const CORPO_SINTETICO = JSON.stringify({
    version: '2.0', class: 'dataset', label: 'Planta', value: { 0: 1.5, 1: 2.5 }, status: { 1: 'e' },
    id: ['freq', 'geo', 'time'], size: [1, 1, 2],
    dimension: { freq: { category: { index: { M: 0 } } }, geo: { category: { index: { PT: 0 } } }, time: { category: { index: { '2026-01': 0, '2026-02': 1 } } } },
    extension: { status: { label: { e: 'estimated' } } },
  });
  const SERIE_SINTETICA = { id: 'serie-planta', source: 'Eurostat', document: { edition: 'planta, freq=M, geo=PT' } };
  const P1 = { periodo: '2026-01', valor: '1,5', excerto: '"2026-01":0 · "0":1.5', bandeira: null };
  const P2 = { periodo: '2026-02', valor: '2,5', excerto: '"2026-02":1 · "1":2.5 · "1":"e"', bandeira: 'e' };
  for (const ponto of [P1, P2]) {
    const e = erroDaCelulaDoEurostat(CORPO_SINTETICO, SERIE_SINTETICA, ponto);
    if (e) erros.S3.push(`check:series · o verde sintético da célula do Eurostat falhou em ${ponto.periodo}: ${e}`);
  }
  const anotado = (raw, n, valor, outro) => raw.replace(`"${n}":${valor}`, `"${n}":${outro}`).replace('"extension":{', `"extension":{"annotation":{"${n}":${valor}},`);
  planta('S3', 'o valor do ponto só numa anotação, e outro na célula (corpo sintético)', 'a célula 0 da resposta «9.9»', () =>
    ({ S3: [erroDaCelulaDoEurostat(anotado(CORPO_SINTETICO, 0, '1.5', '9.9'), SERIE_SINTETICA, P1)].filter(Boolean) }));
  planta('S3', 'a marca «e» da célula omitida no ponto e no excerto (corpo sintético)', 'tem «e» em status', () =>
    ({ S3: [erroDaCelulaDoEurostat(CORPO_SINTETICO, SERIE_SINTETICA, { ...P2, excerto: '"2026-02":1 · "1":2.5', bandeira: null })].filter(Boolean) }));
  if (motor.correu) {
    const fonte = fonteDoMotor(path.resolve(String(process.env.RESEARCHHUB_DIR)));
    const s12 = series.get('serie-ihpc-rendas-variacao-homologa');
    const s4 = series.get('serie-ihpc-variacao-homologa');
    const s7 = series.get('serie-pensao-media-anual');
    const corpoDe = (s) => String(corpoDoEndereco(fonte, s.pedidos[0].url, s.pedidos[0].sha256).raw ?? '');
    const ultimo12 = s12.pontos[s12.pontos.length - 1];
    const [, n12, v12] = /^"[^"]+":\d+ · "(\d+)":(-?[\d.]+)$/.exec(ultimo12.excerto) ?? [];
    planta('S3', 'o valor do ponto só numa anotação, e outro na célula (o corpo da S12)', `a célula ${n12} da resposta «9.9»`, () =>
      ({ S3: [erroDaCelulaDoEurostat(anotado(corpoDe(s12), n12, v12, '9.9'), s12, ultimo12)].filter(Boolean) }));
    const ultimo4 = s4.pontos[s4.pontos.length - 1];
    planta('S3', 'a marca «e» da célula omitida no ponto e no excerto (o corpo da S4)', 'tem «e» em status', () =>
      ({ S3: [erroDaCelulaDoEurostat(corpoDe(s4), s4, { ...ultimo4, excerto: ultimo4.excerto.split(' · ').slice(0, 2).join(' · '), bandeira: null })].filter(Boolean) }));
    const meta7 = corpoDoEndereco(fonte, INE_META(String(s7.document.edition).split(', ')[0]), null).raw;
    /* RP4-m: o corpo de um pedido acha-se pelo resumo que a série regista; um pedido com outro resumo não acha
       corpo nenhum, mesmo com o endereço alojado. */
    planta('S3', 'um pedido com um resumo que nenhum corpo alojado dá (RP4-m)', 'não dá o resumo da série', () =>
      ({ S3: metadeDoMotor(new Map([['serie-ipc-combustiveis-variacao-homologa', (() => {
        const x = structuredClone(series.get('serie-ipc-combustiveis-variacao-homologa'));
        x.pedidos[0].sha256 = '0'.repeat(64);
        return x;
      })()]]), fonte).erros }));
    const p2024 = s7.pontos.find((x) => x.periodo === '2024');
    const p2025 = s7.pontos.find((x) => x.periodo === '2025');
    planta('S3', 'o objeto de outro período no excerto de um ponto do INE (o corpo da S7)', 'não está no bloco do seu período', () =>
      ({ S3: [erroDoBlocoDoIne(corpoDe(s7), rotulosDoIne(String(meta7)), s7, { ...p2024, valor: p2025.valor, excerto: p2025.excerto })].filter(Boolean) }));
  }
  planta('S4', 'um ponto trocado na série derivada', 'não é a conta refeita', () =>
    celulasDoLivro(copiaDasSeries('serie-cem-euros-de-2015-01', (s) => { s.pontos[s.pontos.length - 1].valor = '77,168'; }), linhas).erros);
  /* RP4-m: a segunda forma da S4, o salário real, com as suas plantas: um ponto trocado, e o índice mexido por baixo. */
  if (series.has('serie-remuneracao-bruta-mensal-media-real')) {
    planta('S4', 'um ponto trocado no salário real (RP4-m)', 'não é a conta refeita', () =>
      celulasDoLivro(copiaDasSeries('serie-remuneracao-bruta-mensal-media-real', (x) => {
        const ultimo = x.pontos[x.pontos.length - 1];
        ultimo.valor = String(ultimo.valor).replace(/\d$/, (c) => String((Number(c) + 1) % 10));
      }), linhas).erros);
    planta('S4', 'o índice anual mexido por baixo do salário real (RP4-m)', 'não é a conta refeita', () =>
      celulasDoLivro(copiaDasSeries('serie-ipc-indice-anual', (x) => {
        const p2020 = x.pontos.find((q) => q.periodo === '2020');
        /* O primeiro algarismo, e não o último: o salário arredonda-se ao euro, e a última casa do índice não o
           muda. Uma planta que não muda o número não prova nada. */
        p2020.valor = String(p2020.valor).replace(/^\d/, (c) => String((Number(c) + 1) % 10));
      }), linhas).erros);
  }
  planta('S4', 'a origem mexida por baixo da derivada', 'não é a conta refeita', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-indice', (s) => { s.pontos[s.pontos.length - 1].valor = '103,277'; }), linhas).erros);
  planta('S5', 'um cartão com outro valor do que o ponto', 'não são o ponto da série', () =>
    celulasDoLivro(series, copiaDasLinhas('ipc-variacao-homologa', (l) => { l.value = '3,31'; })).erros);
  planta('S5', 'um cartão desfasado: a série tem um ponto mais novo', 'o cartão está desfasado da série', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-variacao-homologa', (s) => { s.pontos.push({ periodo: '2026-09', valor: '3,40', excerto: 'x', bandeira: null }); }), linhas).erros);
  planta('S5', 'a comparação da União desfasada da sua série', 'o cartão está desfasado da série', () =>
    celulasDoLivro(copiaDasSeries('serie-ihpc-variacao-homologa-ue', (s) => { s.pontos.push({ periodo: '2026-09', valor: '3,40', excerto: 'x', bandeira: null }); }), linhas).erros);
  /* RP4-m: as plantas da frase do índice e da figura indexada, sobre os recibos construídos. */
  if (temDist && series.has('serie-ipc-indice') && series.has('serie-remuneracao-bruta-mensal-media-real')) {
    const si = series.get('serie-ipc-indice');
    const ipt = reciboEmDisco(si.id, 'pt');
    const ien = reciboEmDisco(si.id, 'en');
    const stp = t('pt').livro.serieNoTempo;
    if (ipt && ien) {
      planta('S6', 'a frase do índice com o lado da base trocado (RP4-m)', 'o lado errado da base', () => ({
        S6: celulaDosRecibos(si, { pt: ipt.includes(stp.indiceAcima) ? ipt.replace(stp.indiceAcima, stp.indiceAbaixo) : ipt.replace(stp.indiceAbaixo, stp.indiceAcima), en: ien }) }));
    }
    const sr = series.get('serie-remuneracao-bruta-mensal-media-real');
    const rpt = reciboEmDisco(sr.id, 'pt');
    const ren = reciboEmDisco(sr.id, 'en');
    if (rpt && ren) {
      planta('S6', 'a legenda da figura indexada com as séries trocadas (RP4-m)', 'a legenda da figura indexada', () => {
        const root = parse(rpt);
        const itens = root.querySelectorAll('[data-serie-indexada-linha]');
        if (itens.length === 2) { const a = itens[0].outerHTML; const b = itens[1].outerHTML; itens[0].replaceWith(b); itens[1].replaceWith(a); }
        return { S6: celulaDosRecibos(sr, { pt: root.toString(), en: ren }) };
      });
    }
  }
  /* R4: as plantas da frase do último ponto, sobre os recibos construídos e sobre uma cópia da série. */
  if (temDist && series.has('serie-ipc-rendas-variacao-homologa')) {
    const sid = 'serie-ipc-rendas-variacao-homologa';
    const sr = series.get(sid);
    const rpt = reciboEmDisco(sid, 'pt');
    const ren = reciboEmDisco(sid, 'en');
    const stp = t('pt').livro.serieNoTempo;
    if (rpt && ren) {
      planta('S6', 'a frase do último ponto com o lado trocado (R4)', 'não é a que esta conta escreve', () => {
        const root = parse(rpt);
        const f = root.querySelector('[data-serie-ultimo]');
        f?.set_content(f.innerHTML.replace(stp.ultimoLado.maior, stp.ultimoLado.menor));
        return { S6: celulaDosRecibos(sr, { pt: root.toString(), en: ren }) };
      });
      planta('S6', 'a frase do último ponto com o período errado (R4)', 'compara com outro período', () => {
        /* O ponto de comparação passa a ser o mês anterior, com o valor e a data dele: a frase continua coerente
           por fora, e só a conta do mesmo mês de há um ano a recusa. */
        const root = parse(ren);
        const f = root.querySelector('[data-serie-ultimo]');
        const anterior = sr.pontos[sr.pontos.length - 2];
        const pontos = f.querySelectorAll('[data-ponto]');
        const datas = f.querySelectorAll('[data-nonledger="data-da-linha"]');
        pontos[1].setAttribute('data-ponto', `${sid}#${anterior.periodo}`);
        pontos[1].set_content(anterior.valor);
        datas[1].setAttribute('data-de-campo', `pontos.${sr.pontos.length - 2}.periodo`);
        datas[1].set_content(periodoNaPagina(anterior.periodo, 'en'));
        return { S6: celulaDosRecibos(sr, { pt: rpt, en: root.toString() }) };
      });
      planta('S6', 'a série sem o ponto de há um ano, e a frase ainda a comparar com ele (R4)', 'esta conta compara com «anterior»', () => {
        const copia = structuredClone(sr);
        const alvo = haUmAnoAqui(copia.pontos[copia.pontos.length - 1].periodo);
        copia.pontos = copia.pontos.filter((p) => p.periodo !== alvo);
        return { S6: celulaDosRecibos(copia, { pt: rpt, en: ren }) };
      });
      planta('S6', 'um recibo de série sem a frase do último ponto (R4)', 'frase(s) do que o último ponto quer dizer', () => {
        const root = parse(rpt);
        root.querySelector('[data-serie-ultimo]')?.remove();
        return { S6: celulaDosRecibos(sr, { pt: root.toString(), en: ren }) };
      });
    }
  }
  if (temDist) {
    const id = 'serie-remuneracao-bruta-mensal-media';
    const s = series.get(id);
    const pt = reciboEmDisco(id, 'pt');
    const en = reciboEmDisco(id, 'en');
    const estraga = (html, de, para) => html.replace(de, para);
    planta('S6', 'um valor trocado na tabela', 'a linha 1 da tabela diz', () => ({ S6: celulaDosRecibos(s, { pt: estraga(pt, '>1 534<', '>1 535<'), en }) }));
    planta('S6', 'um ponto tirado da tabela', 'ponto em falta', () => {
      const root = parse(pt);
      root.querySelector(`[data-serie-tabela="${id}"] [data-ponto]`)?.remove();
      return { S6: celulaDosRecibos(s, { pt: root.toString(), en }) };
    });
    planta('S6', 'duas colunas trocadas', 'célula não está na coluna', () => {
      const root = parse(pt); const celulas = root.querySelectorAll(`[data-serie-tabela="${id}"] tbody tr td`);
      const a = celulas[0].outerHTML; const b = celulas[1].outerHTML;
      celulas[0].replaceWith(b); celulas[1].replaceWith(a);
      return { S6: celulaDosRecibos(s, { pt: root.toString(), en }) };
    });
    planta('S6', 'uma lacuna apagada da tabela anual', 'lacuna não é a declarada', () => {
      const sid = 'serie-linha-de-risco-de-pobreza'; const root = parse(reciboEmDisco(sid, 'pt'));
      root.querySelector('[data-serie-lacuna-tabela]')?.remove();
      return { S6: celulaDosRecibos(series.get(sid), { pt: root.toString(), en: reciboEmDisco(sid, 'en') }) };
    });
    planta('S6', 'um algarismo solto na tabela', 'algarismos fora das origens admitidas', () => ({
      S6: celulaDosRecibos(s, { pt: pt.replace(/(<td[^>]*data-serie-celula[^>]*>)/, '$1 7 '), en }),
    }));
    planta('S6', 'as duas edições com valores diferentes', 'a linha 1 da tabela diz', () => ({ S6: celulaDosRecibos(s, { pt, en: estraga(en, '>1 534<', '>1 533<') }) }));
    planta('S6', 'o período escrito fora da regra da casa', 'a linha 1 da tabela diz', () => {
      /* NA PRIMEIRA LINHA DA TABELA, e não no cabeçalho, que diz o mesmo período antes dela. */
      const root = parse(pt);
      const data = root.querySelector(`[data-serie-tabela="${id}"] tbody tr [data-nonledger="data-da-linha"]`);
      data?.set_content('primeiro trimestre de 2025');
      return { S6: celulaDosRecibos(s, { pt: root.toString(), en }) };
    });
  }
}

/* ------------------------------------------------------------------ o relatório */

const todas = Object.entries(erros).flatMap(([c, l]) => l.map((e) => `${c} · ${e}`));
const naoMorderam = plantas.filter((p) => !p.mordeu);
console.log(
  `  check:series · ${contas.series} série(s) no tempo de ${contas.pontos} ponto(s) · ${contas.derivadas} derivada(s) com ${contas.pontosRefeitos} ponto(s) refeitos · ` +
    `${contas.linhasPresas} linha(s) presa(s), ${contas.cartoesNoUltimo} cartão(ões) no último ponto · ${recibos} recibo(s) lidos · ` +
    `metade do motor da S3: ${motor.correu ? `${motor.pontos} ponto(s) no seu corpo` : motor.razao}` +
    (PROVA ? ` · ${plantas.length - naoMorderam.length} de ${plantas.length} planta(s) morderam` : ''),
);
if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify({ contas: { ...contas, recibos, motor: { correu: motor.correu, pontos: motor.pontos, razao: motor.razao } }, erros, plantas }, null, 2) + '\n');
}
for (const p of naoMorderam) console.error(`  ✗ a planta ${p.celula} «${p.nome}» não mordeu: esperava-se «${p.espera}» e veio «${p.primeira ?? 'nada'}».`);
for (const e of todas) console.error(`  ✗ ${e}`);
if (todas.length || naoMorderam.length || (PROVA && !plantas.length)) {
  console.error(`  CHECK:SERIES · ${todas.length} erro(s) e ${naoMorderam.length} planta(s) que não morderam.`);
  process.exit(1);
}
console.log('  ✓ as séries no tempo têm a forma, a cadência, cada valor no seu excerto, a derivada refeita, cada linha presa no seu ponto e cada cartão no último, e os recibos com todos os pontos nas duas edições.');
