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
 *        do período dá); e, quando o motor está ao lado (`RESEARCHHUB_DIR`), o excerto
 *        de cada ponto e o literal da série dentro do corpo alojado do seu pedido, com o
 *        resumo do manifesto. Sem o motor, esta metade diz que não correu;
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
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';

import { lerSeriesDoPortao } from '../../scripts/series-do-portao.mjs';
import { DOMINIO_DAS_MEDIDAS } from '../../src/data/dominios.mjs';

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
    if (Object.prototype.hasOwnProperty.call(DOMINIO_DAS_MEDIDAS, lid)) {
      if (ponto !== pontos[pontos.length - 1]) {
        erros.S5.push(`${quem}: é um cartão nacional e o seu período (${l.reference_date}) não é o último ponto da série «${s.id}» (${pontos[pontos.length - 1]?.periodo}): o cartão está desfasado da série.`);
      } else {
        contas.cartoesNoUltimo++;
      }
    }
  }
  return { erros, contas };
}

/* --------------------------------------------- a metade do motor da S3 (opcional) */

function metadeDoMotor(series) {
  const motor = process.env.RESEARCHHUB_DIR ? path.resolve(process.env.RESEARCHHUB_DIR) : null;
  if (!motor) return { correu: false, erros: [], pontos: 0, razao: 'sem RESEARCHHUB_DIR: a metade do motor não corre aqui' };
  const fonte = path.join(motor, 'content', '13 Dominios', 'source');
  const fetch = JSON.parse(fs.readFileSync(path.join(fonte, 'FETCH.json'), 'utf8')).files;
  const manifesto = new Map(fs.readFileSync(path.join(fonte, 'MANIFEST.sha256'), 'utf8').split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf('  ');
    return [l.slice(i + 2), l.slice(0, i)];
  }));
  const erros = [];
  let pontos = 0;
  for (const [id, s] of series) {
    if (s.eixo !== 'periodo' || !(s.pedidos ?? []).length) continue;
    const corpos = new Map();
    for (const q of s.pedidos) {
      const achado = Object.entries(fetch).find(([rel, f]) => rel.startsWith('rp3/') && f.url === q.url && f.estado === 'lido');
      if (!achado || achado[1].sha256 !== q.sha256 || manifesto.get(achado[0]) !== q.sha256) {
        erros.push(`check:series · ${id}: o pedido ${q.url.slice(0, 80)} não tem corpo alojado com o resumo da série.`);
        continue;
      }
      const raw = fs.readFileSync(path.join(fonte, achado[0]), 'utf8');
      corpos.set(q, { raw, colapsado: raw.replace(/\s+/g, ' ') });
    }
    for (const parte of String(s.excerpt).split(' · ')) {
      if (![...corpos.values()].some((c) => c.raw.includes(parte))) erros.push(`check:series · ${id}: o literal da série tem «${parte.slice(0, 60)}», que o corpo não escreve.`);
    }
    for (const p of s.pontos) {
      const o = ordem(p.periodo);
      const q = s.pedidos.find((x) => {
        const a = ordem(x.primeiro);
        const b = ordem(x.ultimo);
        return a && b && o && (a[0] < o[0] || (a[0] === o[0] && a[1] <= o[1])) && (o[0] < b[0] || (o[0] === b[0] && o[1] <= b[1]));
      });
      const c = q ? corpos.get(q) : null;
      const dentro = c && (s.source === 'INE' ? c.colapsado.includes(p.excerto) : String(p.excerto).split(' · ').every((x) => c.raw.includes(x)));
      if (!dentro) erros.push(`check:series · ${id}: o excerto de ${p.periodo} não está no corpo do seu pedido.`);
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
    const linhas = tabela.querySelectorAll('tbody tr');
    const vistos = [];
    for (const tr of linhas) {
      const ponto = tr.querySelector('[data-ponto]');
      const data = tr.querySelector('[data-nonledger="data-da-linha"]');
      const marca = tr.querySelector('[data-ponto-bandeira]');
      const chave = String(ponto?.getAttribute('data-ponto') ?? '');
      vistos.push([chave, semEspacos(texto(ponto)), texto(data), marca ? texto(marca) : null]);
      /* NENHUM ALGARISMO FORA DAS ORIGENS ADMITIDAS, numa cópia da linha da tabela. */
      const copia = parse(tr.outerHTML);
      for (const el of copia.querySelectorAll('[data-ponto], [data-nonledger="data-da-linha"], [data-ponto-bandeira]')) el.remove();
      if (/\d/.test(texto(copia))) erros.push(`${quem}: a linha de ${chave} tem algarismos fora das origens admitidas («${texto(copia).slice(0, 60)}»).`);
    }
    const esperados = (s.pontos ?? []).map((p) => [`${s.id}#${p.periodo}`, semEspacos(p.valor), periodoNaPagina(String(p.periodo), lang), p.bandeira ?? null]);
    if (vistos.length !== esperados.length) erros.push(`${quem}: a tabela tem ${vistos.length} linhas e a série ${esperados.length} pontos.`);
    for (let i = 0; i < Math.min(vistos.length, esperados.length); i++) {
      const [ck, cv, cd, cm] = vistos[i];
      const [ek, ev, ed, em] = esperados[i];
      if (ck !== ek || cv !== ev || cd !== ed || cm !== em) {
        erros.push(`${quem}: a linha ${i + 1} da tabela diz ${ck} «${cv}» «${cd}» «${cm}» e a série ${ek} «${ev}» «${ed}» «${em}».`);
        break;
      }
    }
    pontosPorLingua[lang] = vistos.map(([k, v, , m]) => `${k}=${v}${m ? ` ${m}` : ''}`).join('|');
  }
  if (pontosPorLingua.pt !== undefined && pontosPorLingua.en !== undefined && pontosPorLingua.pt !== pontosPorLingua.en) {
    erros.push(`check:series · ${s.id}: as duas edições do recibo não têm os mesmos pontos com os mesmos valores.`);
  }
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
  planta('S4', 'um ponto trocado na série derivada', 'não é a conta refeita', () =>
    celulasDoLivro(copiaDasSeries('serie-cem-euros-de-2015-01', (s) => { s.pontos[s.pontos.length - 1].valor = '77,168'; }), linhas).erros);
  planta('S4', 'a origem mexida por baixo da derivada', 'não é a conta refeita', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-indice', (s) => { s.pontos[s.pontos.length - 1].valor = '103,277'; }), linhas).erros);
  planta('S5', 'um cartão com outro valor do que o ponto', 'não são o ponto da série', () =>
    celulasDoLivro(series, copiaDasLinhas('ipc-variacao-homologa', (l) => { l.value = '3,31'; })).erros);
  planta('S5', 'um cartão desfasado: a série tem um ponto mais novo', 'o cartão está desfasado da série', () =>
    celulasDoLivro(copiaDasSeries('serie-ipc-variacao-homologa', (s) => { s.pontos.push({ periodo: '2026-09', valor: '3,40', excerto: 'x', bandeira: null }); }), linhas).erros);
  if (temDist) {
    const id = 'serie-remuneracao-bruta-mensal-media';
    const s = series.get(id);
    const pt = reciboEmDisco(id, 'pt');
    const en = reciboEmDisco(id, 'en');
    const estraga = (html, de, para) => html.replace(de, para);
    planta('S6', 'um valor trocado na tabela', 'a linha 1 da tabela diz', () => ({ S6: celulaDosRecibos(s, { pt: estraga(pt, '>1 534<', '>1 535<'), en }) }));
    planta('S6', 'uma linha tirada da tabela', 'a tabela tem 5 linhas', () => {
      const root = parse(pt);
      root.querySelector(`[data-serie-tabela="${id}"] tbody tr`)?.remove();
      return { S6: celulaDosRecibos(s, { pt: root.toString(), en }) };
    });
    planta('S6', 'um algarismo solto na tabela', 'algarismos fora das origens admitidas', () => ({
      S6: celulaDosRecibos(s, { pt: estraga(pt, '<td class="serie-marca">', '<td class="serie-marca">7 '), en }),
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
