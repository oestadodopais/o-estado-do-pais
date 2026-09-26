/**
 * =============================================================================
 * K17 · A LEITURA DE CADA MEDIDA, AUDITADA E RECONTADA · bloco L1 (24.09.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. A regra do diretor de 23.09.2026 (I150, §1.129): cada conteúdo
 * diz o que significa para uma pessoa sem conhecimento do assunto. O L1 pôs por
 * baixo do número de cada um dos 36 cartões nacionais uma leitura em palavras
 * correntes; as palavras são do lugar de direção e os números e os ramos são da
 * máquina (`src/lib/leitura-da-medida.mjs`). Uma leitura em palavras correntes é
 * o sítio onde uma frase sem origem volta a entrar com mais facilidade (foi o
 * que a K16 apanhou numa pergunta), e onde um ramo trocado diz o contrário do
 * valor sem que um algarismo mude. Esta célula existe para as duas coisas.
 *
 * A PRIMEIRA METADE NÃO LÊ `dist/`: confere a auditoria
 * (`tests/cartao/leituras-provadas.json`) contra a declaração
 * (`src/data/leituras-das-medidas.mjs`), as origens (`ORIGENS_DAS_DEFINICOES`) e
 * o livro-razão. Cada folha de texto de cada leitura, nas duas edições, tem de
 * ter a sua auditoria, e as partes juntas são a folha, carácter a carácter; uma
 * parte que diz o que a medida é apoia-se num literal que está mesmo no campo
 * que cita; uma parte que é uma conta só vive onde a máquina escolhe; uma
 * ligação é pontuação ou uma palavra da lista fechada; cada algarismo declarado
 * tem um literal que o traz, e o motivo do algarismo é o da pergunta da mesma
 * medida para o mesmo algarismo; cada origem que a auditoria lista para uma
 * medida apoia alguma parte dela; e nenhuma origem declarada fica sem uso.
 *
 * A SEGUNDA METADE LÊ AS QUATRO PÁGINAS CONSTRUÍDAS (a do país e a dos temas,
 * nas duas edições): cada cartão nacional tem exatamente uma leitura, da sua
 * medida; o texto rendido é, carácter a carácter, o que o resolvedor dá para
 * aquela medida naquela edição; o texto rendido é também o que ESTA CÉLULA
 * recompõe por conta própria, com os ramos escolhidos por uma conta sua (o
 * sinal do valor, as comparações com as linhas que a régua do cartão rende, o
 * estado contra a referência declarada, as contagens das câmaras pela
 * recontagem da V2), sem chamar o resolvedor; nenhum texto de um ramo que não
 * foi escolhido está na leitura; cada algarismo da leitura está num
 * `[data-claim]`, num `[data-nonledger]` ou num `[data-prova]`; as linhas
 * citadas são só a do cartão e as que a régua dele cita; e a leitura não tem
 * marca da fonte (a K10 conta a marca do cartão, e esta confere que a leitura
 * não traz outra).
 *
 * O QUE NÃO CONFERE, e di-lo: não infere que o literal quer dizer o que a parte
 * diz. Essa escolha é uma leitura, feita por quem assina a auditoria, e é essa
 * leitura que a leitura a frio relê. O que a célula garante é que a leitura não
 * fica para trás sem que a construção feche.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse, NodeType } from 'node-html-parser';
import { load } from 'js-yaml';

import { LEITURAS_DAS_MEDIDAS } from '../../src/data/leituras-das-medidas.mjs';
import { ORIGENS_DAS_DEFINICOES, DEFINICOES_DAS_MEDIDAS, DEFINICAO_DOS_PAINEIS } from '../../src/data/figuras.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../../src/data/referencias-das-medidas.mjs';
import { leituraDaMedida, textoDaLeitura, medidasComLeitura, errosDaDeclaracao, LEITURA_DAS_CAMARAS, LINHA_DO_LIMITE } from '../../src/lib/leitura-da-medida.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { recontagemDasCamaras } from '../../scripts/pais-camaras.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
export const AUDITORIA_DAS_LEITURAS = path.join(AQUI, 'leituras-provadas.json');

/** Os campos de uma origem que podem apoiar uma parte. */
const CAMPOS_DA_ORIGEM = new Set(['excerto', 'excertoEn', 'documento', 'publicador']);
/** Os campos selados da linha que podem apoiar uma parte. */
const CAMPOS_DA_LINHA = new Set(['excerpt', 'unit', 'document.title', 'document.locator']);
/* UM LITERAL DE MENOS DE QUATRO CARACTERES NÃO PRENDE NADA, a regra da K16. */
const LITERAL_MINIMO = 4;
/* AS PALAVRAS DE LIGAÇÃO, uma lista fechada: uma parte «liga» é pontuação e
   estas palavras, e mais nada. Uma palavra que diga alguma coisa não é ligação. */
const PALAVRAS_DE_LIGACAO = new Set([
  'no', /* RP1: contração de «em o», antes do período trimestral. */'em', 'in', 'aos', 'to', 'e', 'and', 'os', 'the', 'eram', 'there', 'were', 'it']);
const PONTUACAO = /[\s.,:;()−%’'!?]+/g;
/** As quatro páginas da leitura: a do país e a dos temas, nas duas edições. */
export const PAGINAS_DA_LEITURA = [
  ['index.html', 'pt'], ['temas/index.html', 'pt'], ['en/index.html', 'en'], ['en/themes/index.html', 'en'],
];

/** @param {string} [ficheiro] */
export function lerAuditoriaDasLeituras(ficheiro = AUDITORIA_DAS_LEITURAS) {
  return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
}

/** @param {string} s */
const curto = (s) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);
/** Os espaços todos (os inquebráveis, o fino e o dos milhares) colapsados num só. @param {string} s */
export const normal = (s) => String(s ?? '').replace(/[\s   ]+/g, ' ').trim();

/**
 * AS FOLHAS DE UMA LEITURA, nas duas edições ao mesmo tempo, com o sítio de
 * cada uma. As duas edições têm de ter a mesma forma (os mesmos nós, os mesmos
 * ramos, os mesmos pedaços calculados, os mesmos algarismos), e uma diferença
 * atira: uma edição a dizer uma coisa que a outra não diz é um defeito da
 * declaração, e não uma tradução.
 *
 * @param {any} pt @param {any} en
 * @returns {{ caminho: string, pt?: string, en?: string, nl?: string, motivo?: string, dentroDeRamo: boolean, antesDeRamo: boolean, depoisDeProva: boolean }[]}
 */
export function folhasDaLeitura(pt, en) {
  /** @type {any[]} */
  const out = [];
  /* A PORTA DE UM VEREDICTO: a folha logo antes de um estado ou de uma comparação
     com a referência («: Portugal está »). Uma frase seguida de uma comparação com
     o período anterior não é porta de nada: essa comparação é uma frase inteira. */
  const calculado = (/** @type {any} */ x) => x && typeof x === 'object' && !Array.isArray(x) && ('estado' in x || 'comparacao' in x);
  /** @param {any} a @param {any} b @param {string} c @param {boolean} ramo */
  const anda = (a, b, c, ramo) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) throw new Error(`as duas edições têm formas diferentes em ${c}`);
      a.forEach((x, i) => {
        const antes = i + 1 < a.length && calculado(a[i + 1]);
        const depois = i > 0 && a[i - 1] && typeof a[i - 1] === 'object' && 'prova' in a[i - 1];
        if (typeof x === 'string') {
          if (typeof b[i] !== 'string') throw new Error(`as duas edições têm formas diferentes em ${c}[${i}]`);
          out.push({ caminho: `${c}[${i}]`, pt: x, en: b[i], dentroDeRamo: ramo, antesDeRamo: antes, depoisDeProva: depois });
        } else anda(x, b[i], `${c}[${i}]`, ramo);
      });
      return;
    }
    if (typeof a === 'string') {
      out.push({ caminho: c, pt: a, en: b, dentroDeRamo: ramo, antesDeRamo: false, depoisDeProva: false });
      return;
    }
    const ka = Object.keys(a).sort().join(','), kb = Object.keys(b ?? {}).sort().join(',');
    if (ka !== kb) throw new Error(`as duas edições têm pedaços diferentes em ${c} (${ka} / ${kb})`);
    if ('sinal' in a) { for (const r of Object.keys(a.sinal)) anda(a.sinal[r], b.sinal[r], `${c}.sinal.${r}`, ramo); return; }
    if ('estado' in a) { for (const r of Object.keys(a.estado)) anda(a.estado[r], b.estado[r], `${c}.estado.${r}`, true); return; }
    if ('comparacao' in a) { for (const r of Object.keys(a.comparacao)) anda(a.comparacao[r], b.comparacao[r], `${c}.comparacao.${r}`, true); return; }
    if ('compara' in a) {
      if (a.compara !== b.compara) throw new Error(`as duas edições comparam com linhas diferentes em ${c}`);
      for (const r of ['maior', 'menor', 'igual']) if (r in a) anda(a[r], b[r], `${c}.compara-${a.compara}.${r}`, true);
      return;
    }
    if ('nl' in a) {
      if (a.nl !== b.nl || a.motivo !== b.motivo) throw new Error(`as duas edições têm algarismos diferentes em ${c}`);
      out.push({ caminho: c, nl: a.nl, motivo: a.motivo, dentroDeRamo: ramo, antesDeRamo: false, depoisDeProva: false });
      return;
    }
    /* RP1: o sufixo da unidade pode ser traduzido. Continua a ser palavra
       fixa auditada; a identidade da linha calculada continua igual. */
    if ('claim' in a && a.sufixo !== b.sufixo) {
      const { sufixo: sa, ...ca } = a, { sufixo: sb, ...cb } = b;
      if (typeof sa !== 'string' || typeof sb !== 'string' || JSON.stringify(ca) !== JSON.stringify(cb)) {
        throw new Error(`as duas edições têm pedaços calculados diferentes em ${c}`);
      }
      out.push({ caminho: `${c}.sufixo`, pt: sa, en: sb, dentroDeRamo: ramo, antesDeRamo: false, depoisDeProva: false });
      return;
    }
    if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`as duas edições têm pedaços calculados diferentes em ${c}`);
  };
  anda(pt, en, '', false);
  return out;
}

/** @param {any} linha @param {string} campo */
const campoDaLinha = (linha, campo) =>
  campo === 'document.title' ? linha?.document?.title : campo === 'document.locator' ? linha?.document?.locator : linha?.[campo];

/** Os motivos declarados em `ledger/allowlist.yml`. */
function motivosDeclarados() {
  const y = load(fs.readFileSync(path.join(RAIZ, 'ledger', 'allowlist.yml'), 'utf8'));
  return new Set((/** @type {any} */ (y)?.contexts ?? []).map((/** @type {any} */ c) => c.id));
}

/** Os algarismos que a pergunta de uma medida declara, com o motivo. @param {any} d */
function algarismosDaPergunta(d) {
  /** @type {Map<string, string>} */
  const m = new Map();
  for (const lang of ['pt', 'en']) for (const p of d?.[lang] ?? []) if (p && typeof p === 'object' && 'nl' in p) m.set(p.nl, p.motivo);
  return m;
}

/**
 * A PRIMEIRA METADE: a auditoria contra a declaração, as origens e as linhas.
 *
 * @param {{ auditoria?: any, leituras?: Record<string, any>, origens?: Record<string, any>, linhas?: Map<string, any>, perguntas?: Record<string, any>, paineis?: Record<string, any> }} [entrada]
 */
export function conferirAuditoriaDasLeituras({
  auditoria = lerAuditoriaDasLeituras(),
  leituras = /** @type {Record<string, any>} */ (LEITURAS_DAS_MEDIDAS),
  origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
  linhas = loadClaims(),
  perguntas = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS),
  paineis = /** @type {Record<string, any>} */ (DEFINICAO_DOS_PAINEIS),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { medidas: 0, folhas: 0, partes: 0, diz: 0, conta: 0, liga: 0, apoios: 0, algarismos: 0, origens_das_leituras: 0, comuns: 0 };
  /** @param {string} id @param {string} m */
  const falha = (id, m) => erros.push(`K17 · ${id}: ${m}`);

  for (const e of errosDaDeclaracao(leituras)) erros.push(`K17 · a declaração: ${e}`);

  const lista = auditoria?.medidas;
  if (!Array.isArray(lista) || lista.length === 0) {
    erros.push('K17 · a auditoria das leituras não tem medida nenhuma: a célula não mediu nada');
    return { erros, contas };
  }
  const comuns = Array.isArray(auditoria.comuns) ? auditoria.comuns : [];
  /** @type {Map<string, any>} */
  const porMedida = new Map();
  for (const m of lista) {
    if (porMedida.has(m?.id)) falha(m?.id, 'aparece duas vezes na auditoria');
    porMedida.set(m?.id, m);
  }
  const obrigatorias = medidasComLeitura();
  for (const id of obrigatorias) if (!porMedida.has(id)) falha(id, 'a leitura declarada não tem auditoria');
  for (const id of porMedida.keys()) if (!obrigatorias.includes(id)) falha(id, 'a auditoria fala de uma leitura que não é de um cartão nacional');

  const motivos = motivosDeclarados();
  /** @type {Set<number>} */
  const comunsUsadas = new Set();
  /** @type {Set<string>} */
  const origensDasLeituras = new Set();

  /**
   * Um apoio, conferido contra o seu campo. Devolve a origem que ele usa, ou null.
   * @param {string} id @param {any} a @param {string} qual
   */
  const apoio = (id, a, qual) => {
    contas.apoios++;
    if (a?.forma === 'ano') {
      const alvo = a.linha === 'propria' ? id : a.linha;
      const l = linhas.get(alvo);
      if (id === LEITURA_DAS_CAMARAS || !l) return falha(id, `${qual} diz que o período é um ano, e não há linha própria para o provar`), null;
      if (a.campo !== 'reference_date' || !/^\d{4}$/.test(String(l.reference_date ?? ''))) {
        return falha(id, `${qual} diz que o período é um ano, e o reference_date da linha é «${l.reference_date}»`), null;
      }
      return null;
    }
    const literal = a?.literal;
    if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) {
      return falha(id, `${qual} cita um literal com menos de ${LITERAL_MINIMO} caracteres, que não prende nada`), null;
    }
    if (a.origem) {
      const o = origens[a.origem];
      if (!o) return falha(id, `${qual} apoia-se em «${a.origem}», que não está declarada em ORIGENS_DAS_DEFINICOES`), null;
      if (!CAMPOS_DA_ORIGEM.has(a.campo) || typeof o[a.campo] !== 'string') {
        return falha(id, `${qual} cita o campo «${a.campo}» da origem «${a.origem}», que não existe ou não pode apoiar`), null;
      }
      if (!o[a.campo].includes(literal)) return falha(id, `${qual} cita «${curto(literal)}», que não está no campo «${a.campo}» da origem «${a.origem}»`), null;
      return a.origem;
    }
    if (a.linha) {
      const alvo = a.linha === 'propria' ? id : a.linha;
      const permitidas = id === LEITURA_DAS_CAMARAS ? [LINHA_DO_LIMITE] : [id];
      if (!permitidas.includes(alvo)) return falha(id, `${qual} cita a linha «${alvo}», e só a linha que o cartão rende conta`), null;
      const l = linhas.get(alvo);
      const valor = CAMPOS_DA_LINHA.has(a.campo) ? campoDaLinha(l, a.campo) : undefined;
      if (typeof valor !== 'string') return falha(id, `${qual} cita o campo «${a.campo}» da linha «${alvo}», que não existe ou não pode apoiar`), null;
      if (!valor.includes(literal)) return falha(id, `${qual} cita «${curto(literal)}», que não está no campo «${a.campo}» da linha «${alvo}»`), null;
      return null;
    }
    return falha(id, `${qual} tem um apoio sem origem nem linha`), null;
  };

  for (const id of obrigatorias) {
    const m = porMedida.get(id);
    const d = leituras[id];
    if (!m || !d) continue;
    contas.medidas++;
    let folhas;
    try {
      folhas = folhasDaLeitura(d.pt, d.en);
    } catch (e) {
      falha(id, e instanceof Error ? e.message : String(e));
      continue;
    }
    const proprias = Array.isArray(m.folhas) ? m.folhas : [];
    /** @type {Set<number>} */
    const propriasUsadas = new Set();
    /** @type {Set<string>} */
    const usadasPelaMedida = new Set();
    const declaradasDaMedida = new Set(m.origens ?? []);
    const algarismos = folhas.filter((f) => f.nl !== undefined);
    for (const f of folhas.filter((x) => x.nl === undefined)) {
      contas.folhas++;
      const qual = `a folha «${curto(String(f.pt))}» (${f.caminho || 'raiz'})`;
      let i = proprias.findIndex((x) => x?.pt === f.pt && x?.en === f.en);
      let entrada = i >= 0 ? proprias[i] : null;
      if (i >= 0) propriasUsadas.add(i);
      else {
        i = comuns.findIndex((x) => x?.pt === f.pt && x?.en === f.en);
        if (i >= 0) { entrada = comuns[i]; comunsUsadas.add(i); }
      }
      if (!entrada) {
        falha(id, `${qual} não tem auditoria: uma leitura mudada precisa de nova leitura das origens`);
        continue;
      }
      const partes = Array.isArray(entrada.partes) ? entrada.partes : [];
      if (partes.map((/** @type {any} */ p) => p?.pt ?? '').join('') !== f.pt || partes.map((/** @type {any} */ p) => p?.en ?? '').join('') !== f.en) {
        falha(id, `${qual}: as partes juntas não dão a folha, nas duas edições`);
        continue;
      }
      for (const [j, p] of partes.entries()) {
        contas.partes++;
        const qualParte = `${qual}, parte ${j + 1} («${curto(String(p?.pt))}»)`;
        if (p?.classe === 'diz') {
          contas.diz++;
          if (!Array.isArray(p.apoios) || p.apoios.length === 0) {
            falha(id, `${qualParte} diz o que a medida é e não tem apoio nenhum`);
            continue;
          }
          for (const a of p.apoios) {
            const o = apoio(id, a, qualParte);
            if (o) { usadasPelaMedida.add(o); origensDasLeituras.add(o); }
          }
        } else if (p?.classe === 'conta') {
          contas.conta++;
          if (p.apoios?.length) falha(id, `${qualParte} é uma conta e traz apoios: ou diz o que a medida é, ou é uma conta`);
          if (!(f.dentroDeRamo || f.antesDeRamo || f.depoisDeProva)) {
            falha(id, `${qualParte} está marcada como conta e não está num ramo que a máquina escolhe, nem à porta dele, nem depois de uma chave da prova`);
          }
        } else if (p?.classe === 'liga') {
          contas.liga++;
          for (const lang of ['pt', 'en']) {
            const resto = String(p[lang] ?? '').toLowerCase().replace(PONTUACAO, ' ').trim();
            const palavras = resto ? resto.split(/\s+/) : [];
            const fora = palavras.filter((w) => !PALAVRAS_DE_LIGACAO.has(w));
            if (fora.length) falha(id, `${qualParte} está marcada como ligação e traz «${fora.join(' ')}» (${lang}), que não é uma palavra de ligação`);
          }
        } else {
          falha(id, `${qualParte} não tem classe (diz, conta ou liga)`);
        }
      }
    }
    /* OS ALGARISMOS DECLARADOS, pela ordem da declaração. */
    const auditados = Array.isArray(m.algarismos) ? m.algarismos : [];
    if (auditados.length !== algarismos.length || auditados.some((/** @type {any} */ a, /** @type {number} */ k) => a?.nl !== algarismos[k].nl)) {
      falha(id, `os algarismos declarados (${algarismos.map((a) => a.nl).join(', ') || 'nenhum'}) não são os da auditoria (${auditados.map((/** @type {any} */ a) => a?.nl).join(', ') || 'nenhum'})`);
    }
    const daPergunta = algarismosDaPergunta(perguntas[id]);
    for (const [k, f] of algarismos.entries()) {
      contas.algarismos++;
      const qual = `o algarismo «${f.nl}» (${f.caminho})`;
      if (!motivos.has(String(f.motivo))) falha(id, `${qual} declara o motivo «${f.motivo}», que não está em ledger/allowlist.yml`);
      if (daPergunta.has(String(f.nl)) && daPergunta.get(String(f.nl)) !== f.motivo) {
        falha(id, `${qual} tem o motivo «${f.motivo}» e a pergunta da mesma medida dá ao mesmo algarismo o motivo «${daPergunta.get(String(f.nl))}»`);
      }
      const a = auditados[k];
      if (!Array.isArray(a?.apoios) || a.apoios.length === 0) {
        falha(id, `${qual} não tem literal nenhum que o traga`);
        continue;
      }
      const traz = new RegExp(`(^|[^\\d])${String(f.nl).replace(',', '\\,')}([^\\d]|$)`);
      for (const ap of a.apoios) {
        const o = apoio(id, ap, qual);
        if (o) { usadasPelaMedida.add(o); origensDasLeituras.add(o); }
        if (typeof ap?.literal === 'string' && !traz.test(ap.literal)) falha(id, `${qual}: o literal «${curto(ap.literal)}» não traz o algarismo`);
      }
    }
    for (const [k, x] of proprias.entries()) {
      if (!propriasUsadas.has(k)) falha(id, `a auditoria tem uma folha («${curto(String(x?.pt))}») que a leitura declarada não tem`);
    }
    for (const o of declaradasDaMedida) if (!usadasPelaMedida.has(o)) falha(id, `a origem «${o}» está na lista da auditoria e não apoia parte nenhuma da leitura`);
    for (const o of usadasPelaMedida) if (!declaradasDaMedida.has(o)) falha(id, `a origem «${o}» apoia uma parte e não está na lista da auditoria`);
  }
  for (const [k, x] of comuns.entries()) {
    if (!comunsUsadas.has(k)) erros.push(`K17 · as folhas comuns: «${curto(String(x?.pt))}» não é usada por leitura nenhuma`);
  }
  contas.comuns = comunsUsadas.size;
  contas.origens_das_leituras = origensDasLeituras.size;

  /* NENHUMA ORIGEM DECLARADA SEM USO: cada uma apoia uma pergunta, um painel ou
     uma leitura. Uma origem que não apoia nada é uma citação de enfeite. */
  const usadas = new Set(origensDasLeituras);
  for (const d of Object.values(perguntas)) for (const o of d?.origens ?? []) usadas.add(o);
  for (const d of Object.values(paineis)) for (const o of d?.origens ?? []) usadas.add(o);
  for (const chave of Object.keys(origens)) {
    if (!usadas.has(chave)) erros.push(`K17 · origem «${chave}»: está declarada e não apoia pergunta, painel ou leitura nenhuma`);
  }
  /* AS ORIGENS ALOJADAS: a mesma forma do selo, com o ficheiro no estudo 13. */
  for (const [chave, o] of Object.entries(origens)) {
    const s = o?.alojada;
    if (!s) continue;
    const faltas = [];
    if (typeof s.motor !== 'string' || !s.motor.startsWith('content/13 Dominios/source/')) faltas.push('o ficheiro alojado no motor');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s.hora ?? '')) faltas.push('a hora (UTC, ao segundo)');
    if (typeof s.cliente !== 'string' || !s.cliente.includes('core.http.HttpClient')) faltas.push('o cliente da casa');
    if (!/^[0-9a-f]{64}$/.test(s.sha256 ?? '')) faltas.push('o sha256');
    if (typeof s.campo !== 'string' || !s.campo) faltas.push('o campo lido');
    if (faltas.length) erros.push(`K17 · origem «${chave}»: a marca de alojada não diz ${faltas.join(', ')}`);
    else if (s.hora.slice(0, 10) !== o.lido) erros.push(`K17 · origem «${chave}»: a data de leitura (${o.lido}) não é o dia da descarga alojada (${s.hora.slice(0, 10)})`);
  }
  return { erros, contas };
}

/* =========================================================================
 * A SEGUNDA METADE, sobre as páginas construídas
 * ========================================================================= */

/** O número de uma cadeia do livro-razão, pela conta desta célula. @param {unknown} v */
const numero = (v) => {
  const s = String(v ?? '').replace(/[\s   ]/g, '').replace(/−/g, '-').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
};
/** A data da casa, pela conta desta célula: um dia ISO passa a dd.mm.aaaa, e o resto fica. @param {string} v */
const dataDaCasaAqui = (v, lang = 'pt') => {
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(v)) {
    const [ano, mes] = v.split('-');
    const nomes = lang === 'pt' ? 'janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro'.split(' ') : 'January February March April May June July August September October November December'.split(' ');
    return nomes[Number(mes)-1] + (lang === 'pt' ? ' de ' : ' ') + ano;
  }
  if (/^\d{4}-T[1-4]$/.test(v)) {
    const [ano, tri] = v.split('-T');
    return lang === 'pt' ? `${tri}.º trimestre de ${ano}` : `${tri}${['st','nd','rd','th'][Number(tri)-1]} quarter of ${ano}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(v);
};

/**
 * A LEITURA RECOMPOSTA POR ESTA CÉLULA, sem o resolvedor: percorre a declaração,
 * escolhe cada ramo pela sua própria conta, e escreve o texto com os valores do
 * livro-razão. Devolve o texto e, para cada nó, o texto dos ramos que não foram
 * escolhidos, para se conferir que nenhum deles está na página.
 *
 * @param {string} id @param {'pt'|'en'} lang
 * @param {{ anterior: string|null, ue: string|null }} regua  as linhas que a régua do cartão rende
 * @param {Map<string, any>} linhas
 */
export function leituraIndependente(id, lang, regua, linhas = loadClaims()) {
  const d = /** @type {Record<string, any>} */ (LEITURAS_DAS_MEDIDAS)[id];
  if (!d?.[lang]) throw new Error(`não há leitura declarada para ${id} (${lang})`);
  const camaras = id === LEITURA_DAS_CAMARAS;
  const linha = camaras ? null : linhas.get(id);
  const v = linha ? numero(linha.value) : null;
  const ref = camaras ? null : REFERENCIAS_DAS_MEDIDAS.get(id)?.limiar ?? null;
  const recontagem = camaras ? recontagemDasCamaras() : null;
  const provisorio = t(lang).prov.provisorio;
  /** @type {{ no: string, escolha: string|null, outros: string[], escolhido: string }[]} */
  const nos = [];
  /** O valor de uma ponta da referência, com o sinal. @param {any} lado */
  const ponta = (lado) => numero(`${lado?.sinal === '−' ? '-' : ''}${lado?.nl}`);
  const banda = Boolean(ref?.inferior && ref?.superior);
  const inferior = ref ? (banda ? ponta(ref.inferior) : ref.lado === 'inferior' ? ponta(ref) : null) : null;
  const superior = ref ? (banda ? ponta(ref.superior) : ref.lado === 'superior' ? ponta(ref) : null) : null;

  /**
   * @param {any} p
   * @param {boolean} [regista]  falso ao escrever um ramo que não foi escolhido,
   *   para que os nós de dentro dele não entrem na lista dos escolhidos
   * @returns {string}
   */
  const texto = (p, regista = true) => {
    if (Array.isArray(p)) return p.map((x) => texto(x, regista)).join('');
    if (typeof p === 'string') return p;
    if ('claim' in p) {
      const alvo = p.claim === 'proprio' ? id : p.claim === 'anterior' ? regua.anterior : regua.ue;
      const l = alvo ? linhas.get(alvo) : null;
      if (!l) throw new Error(`a leitura de ${id} cita a linha «${p.claim}», que a régua do cartão não rende`);
      return `${l.value}${p.sufixo ?? ''}${(l.source_flag === 'p' || (l.source_flag === '&' && l.source_flag_note === 'Dado provisório')) ? ' ' + provisorio : ''}`;
    }
    if ('periodo' in p) {
      if (camaras) return dataDaCasaAqui(String([...(/** @type {any} */ (recontagem)).periodos][0]));
      const l = p.periodo === 'proprio' ? linha : regua.anterior ? linhas.get(regua.anterior) : null;
      if (!l?.reference_date) throw new Error(`a leitura de ${id} escreve um período que a linha não publica`);
      return dataDaCasaAqui(l.reference_date, lang);
    }
    if ('referencia' in p) {
      const lado = p.referencia === 'unico' ? ref : ref?.[p.referencia];
      if (!lado?.nl) throw new Error(`a leitura de ${id} escreve uma referência que não está declarada`);
      return `${!p.semSinal && lado.sinal === '−' ? '−' : ''}${lado.nl}`;
    }
    if ('prova' in p) return String((/** @type {any} */ (recontagem))?.contagens?.[p.prova]);
    if ('nl' in p) return p.nl;
    /** @param {string} no @param {Record<string, any>} ramos @param {string|null} escolha */
    const ramo = (no, ramos, escolha) => {
      /* Um ramo não escolhido pode citar uma linha que a régua não rende (é por
         isso que não foi escolhido): o texto dele fica vazio, e não há nada dele
         para procurar na página. */
      const outros = Object.entries(ramos).filter(([k]) => k !== escolha).map(([, r]) => {
        try { return normal(texto(r, false)); } catch { return ''; }
      });
      if (escolha !== null && !(escolha in ramos)) throw new Error(`a leitura de ${id} não tem o ramo «${escolha}» de ${no}`);
      const escolhido = escolha === null ? '' : texto(ramos[escolha] ?? [], regista);
      if (regista) nos.push({ no, escolha, outros, escolhido: normal(escolhido) });
      return escolhido;
    };
    if ('sinal' in p) {
      if (v === null) throw new Error(`o valor de ${id} não se lê como número`);
      return ramo('sinal', p.sinal, v > 0 ? 'positivo' : v < 0 ? 'negativo' : 'zero');
    }
    if ('compara' in p) {
      const outra = p.compara === 'anterior' ? regua.anterior : regua.ue;
      const ramos = { maior: p.maior, menor: p.menor, igual: p.igual };
      if (!outra) return ramo(`compara-${p.compara}`, ramos, null);
      const n = numero(linhas.get(outra)?.value);
      if (v === null || n === null) throw new Error(`a comparação de ${id} com ${outra} não se lê`);
      return ramo(`compara-${p.compara}`, ramos, v > n ? 'maior' : v < n ? 'menor' : 'igual');
    }
    if ('estado' in p) {
      if (!ref || v === null) return ramo('estado', p.estado, null);
      const fora = (superior !== null && v > superior) || (inferior !== null && v < inferior);
      return ramo('estado', p.estado, fora ? 'fora' : 'dentro');
    }
    if ('comparacao' in p) {
      if (!ref || v === null) return ramo('comparacao', p.comparacao, null);
      let c;
      if (superior !== null && v > superior) c = 'acima';
      else if (inferior !== null && v < inferior) c = 'abaixo';
      else if (v === superior || v === inferior) c = 'igual';
      else c = banda ? 'entre' : 'igual';
      return ramo('comparacao', p.comparacao, c);
    }
    throw new Error(`um pedaço de tipo desconhecido na leitura de ${id}`);
  };
  return { texto: normal(texto(d[lang])), nos };
}

/**
 * Uma página construída, conferida. Separada para as plantas a poderem exercer
 * sobre uma cópia em memória.
 *
 * @param {import('node-html-parser').HTMLElement} root @param {'pt'|'en'} lang @param {string} rota
 * @param {Map<string, any>} [linhas]
 */
export function conferirPaginaDaLeitura(root, lang, rota, linhas = loadClaims()) {
  /** @type {string[]} */
  const erros = [];
  const contas = { cartoes: 0, leituras: 0, ramos: 0, algarismos: 0, linhas_citadas: 0 };
  /** @param {string} id @param {string} m */
  const falha = (id, m) => erros.push(`K17 · ${rota} · ${id}: ${m}`);
  const cartoes = root.querySelectorAll('main article.cartao-medida');
  const todas = root.querySelectorAll('[data-cartao-leitura]');
  if (cartoes.length === 0) erros.push(`K17 · ${rota}: a página não tem cartão nenhum; a célula não mediu nada`);
  for (const l of todas) {
    if (!l.closest('article.cartao-medida')) erros.push(`K17 · ${rota}: há uma leitura fora de um cartão («${curto(normal(l.textContent))}»)`);
  }
  for (const cartao of cartoes) {
    const id = cartao.getAttribute('data-cartao-medida') ?? (cartao.hasAttribute('data-cartao-camaras') ? LEITURA_DAS_CAMARAS : '');
    contas.cartoes++;
    // I153: a ressalva separa-se no texto, no valor e na leitura. A palavra
    // continua presa à bandeira da linha que a precede, sem uma dispensa nova.
    const comBandeira = new Set();
    for (const valor of cartao.querySelectorAll('[data-claim]')) {
      const l = linhas.get(valor.getAttribute('data-claim'));
      if (l?.source_flag === 'p' || (l?.source_flag === '&' && l?.source_flag_note === 'Dado provisório')) comBandeira.add(l.id);
    }
    const comPalavra = new Set();
    for (const marca of cartao.querySelectorAll('.claim-provisorio')) {
      const irmaos = marca.parentNode.childNodes;
      const anteriores = irmaos.slice(0, irmaos.indexOf(marca));
      const valor = anteriores.reverse().find(n => n.nodeType === NodeType.ELEMENT_NODE && n.hasAttribute('data-claim'));
      const linha = valor?.getAttribute('data-claim');
      if (linha) comPalavra.add(linha);
      else falha(id, 'ressalva sem a linha que a precede');
      if (marca.textContent !== ' ' + t(lang).prov.provisorio) falha(id, 'ressalva sem separador ou com palavra diferente da edição');
    }
    if ([...comBandeira].some(x => !comPalavra.has(x)) || [...comPalavra].some(x => !comBandeira.has(x))) falha(id, 'as linhas com bandeira e as palavras de ressalva não coincidem');
    const leituras = cartao.querySelectorAll('[data-cartao-leitura]');
    if (leituras.length !== 1) {
      falha(id, `o cartão tem ${leituras.length} leitura(s), e um cartão nacional tem uma`);
      continue;
    }
    const el = leituras[0];
    contas.leituras++;
    if (el.getAttribute('data-cartao-leitura') !== id) falha(id, `a leitura diz ser de «${el.getAttribute('data-cartao-leitura')}»`);
    if (id !== LEITURA_DAS_CAMARAS && el.getAttribute('data-selo-em') !== id) falha(id, 'a leitura não diz que a sua porta é a marca do cartão (data-selo-em)');
    const rendido = normal(el.textContent);

    /* O TEXTO DO RESOLVEDOR, carácter a carácter, como a K6 faz com a pergunta. */
    let doResolvedor = null;
    try {
      doResolvedor = normal(textoDaLeitura(leituraDaMedida(id, lang).pedacos, lang));
    } catch (e) {
      falha(id, `o resolvedor não resolve a leitura: ${e instanceof Error ? e.message : e}`);
    }
    if (doResolvedor !== null && rendido !== doResolvedor) {
      falha(id, `o texto rendido difere do que o resolvedor dá: «${curto(rendido)}» contra «${curto(doResolvedor)}»`);
    }

    /* A CONTA DESTA CÉLULA: os ramos e o texto, sem o resolvedor. */
    const regua = {
      anterior: cartao.querySelector('[data-regua="anterior"] [data-claim]')?.getAttribute('data-claim') ?? null,
      ue: cartao.querySelector('[data-regua="ue"] [data-claim]')?.getAttribute('data-claim') ?? null,
    };
    try {
      const propria = leituraIndependente(id, lang, regua, linhas);
      contas.ramos += propria.nos.length;
      if (rendido !== propria.texto) {
        falha(id, `os ramos ou os valores rendidos não são os que a conta desta célula manda: «${curto(rendido)}» contra «${curto(propria.texto)}»`);
      }
      for (const no of propria.nos) {
        for (const outro of no.outros) {
          if (outro.length >= 3 && rendido.includes(outro) && !no.escolhido.includes(outro)) {
            falha(id, `o texto de um ramo que a conta não escolheu está na leitura (${no.no}): «${curto(outro)}»`);
          }
        }
      }
    } catch (e) {
      falha(id, `a conta desta célula não recompõe a leitura: ${e instanceof Error ? e.message : e}`);
    }

    /* CADA ALGARISMO NUMA MARCA DE ORIGEM. */
    const marcado = (/** @type {any} */ n) => {
      for (let p = n.parentNode; p && p !== el.parentNode; p = p.parentNode) {
        const a = p.attributes ?? {};
        if ('data-claim' in a || 'data-nonledger' in a || 'data-prova' in a) return true;
      }
      return false;
    };
    /* O texto que se lê é o descodificado: uma referência de carácter como
       `&#39;` não é um algarismo à vista, e um algarismo escrito como `&#x31;`
       é, e tem de ter marca como qualquer outro. */
    const anda = (/** @type {any} */ n) => {
      if (n.nodeType === NodeType.TEXT_NODE) {
        if (/\d/.test(n.text)) {
          contas.algarismos++;
          if (!marcado(n)) falha(id, `a leitura escreve um algarismo sem marca de origem: «${curto(normal(n.text))}»`);
        }
        return;
      }
      for (const f of n.childNodes ?? []) anda(f);
    };
    anda(el);

    /* AS LINHAS CITADAS: a do cartão e as que a régua dele rende, e mais nenhuma. */
    const permitidas = new Set([id, ...cartao.querySelectorAll('[data-regua] [data-claim]').map((x) => x.getAttribute('data-claim'))]);
    if (id === LEITURA_DAS_CAMARAS) permitidas.add(recontagemDasCamaras().datas[0].id);
    for (const x of el.querySelectorAll('[data-claim], [data-de-linha]')) {
      const citada = x.getAttribute('data-claim') ?? x.getAttribute('data-de-linha');
      contas.linhas_citadas++;
      if (!permitidas.has(citada)) falha(id, `a leitura cita a linha «${citada}», que não é a do cartão nem uma que a régua dele rende`);
    }

    /* A LEITURA NÃO TEM MARCA DA FONTE: a porta é a do cartão (K10). */
    if (el.querySelectorAll('.src-chip').length) falha(id, 'a leitura repete a marca da fonte');
  }
  return { erros, contas };
}

/**
 * A SEGUNDA METADE, sobre o `dist/`: as quatro páginas.
 * @param {string} dist
 */
export function conferirLeiturasRendidas(dist) {
  /** @type {string[]} */
  const erros = [];
  const contas = { paginas: 0, cartoes: 0, leituras: 0, ramos: 0, algarismos: 0, linhas_citadas: 0 };
  const linhas = loadClaims();
  for (const [rel, lang] of PAGINAS_DA_LEITURA) {
    const f = path.join(dist, rel);
    if (!fs.existsSync(f)) {
      erros.push(`K17 · ${rel}: a página não existe em dist/`);
      continue;
    }
    contas.paginas++;
    const r = conferirPaginaDaLeitura(parse(fs.readFileSync(f, 'utf8')), /** @type {'pt'|'en'} */ (lang), `/${rel.replace(/index\.html$/, '')}`, linhas);
    erros.push(...r.erros);
    for (const k of Object.keys(r.contas)) contas[/** @type {keyof typeof contas} */ (k)] += r.contas[/** @type {keyof typeof r.contas} */ (k)];
  }
  return { erros, contas };
}

/**
 * AS PLANTAS DA K17, todas em memória: a auditoria, a declaração e as origens
 * são cópias, e as páginas lêem-se do `dist/` e estragam-se numa cópia. Cada
 * planta tem de morder com a queixa esperada, e a corrida limpa tem de passar.
 *
 * @param {string} dist
 * @returns {{ nome: string, mordeu: boolean, queixa: string|null }[]}
 */
export function plantasDaK17(dist) {
  const base = lerAuditoriaDasLeituras();
  const leituras = /** @type {Record<string, any>} */ (LEITURAS_DAS_MEDIDAS);
  const origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES);
  /** @param {(a: any) => void} estraga */
  const auditoriaCom = (estraga) => { const c = structuredClone(base); estraga(c); return c; };
  /** @param {any} a @param {string} id */
  const dela = (a, id) => a.medidas.find((/** @type {any} */ m) => m.id === id);
  /** @type {{ nome: string, mordeu: boolean, queixa: string|null }[]} */
  const out = [];
  /** @param {string} nome @param {string[]} erros @param {string} mordida */
  const regista = (nome, erros, mordida) => {
    const q = erros.find((e) => e.includes(mordida)) ?? null;
    out.push({ nome, mordeu: q !== null, queixa: q ?? erros[0] ?? null });
  };
  /* A primeira metade, as plantas da K16 repetidas para a leitura. */
  const saldo = 'saldo-das-administracoes-publicas-2025';
  regista('a origem tirada', conferirAuditoriaDasLeituras({ origens: Object.fromEntries(Object.entries(origens).filter(([k]) => k !== 'eurostat-gfs-pacto')) }).erros,
    'que não está declarada em ORIGENS_DAS_DEFINICOES');
  const mudada = structuredClone(leituras);
  mudada[saldo].pt = JSON.parse(JSON.stringify(mudada[saldo].pt).replace('não deixa o défice passar de', 'proíbe um défice acima de'));
  regista('a leitura mudada sem nova leitura', conferirAuditoriaDasLeituras({ leituras: mudada }).erros, 'não tem auditoria');
  regista('um literal que o campo não tem', conferirAuditoriaDasLeituras({ auditoria: auditoriaCom((a) => {
    dela(a, 'crescimento-da-despesa-liquida-2025').folhas[0].partes[0].apoios[1].literal = 'Despesa Total controlada pelo Governo';
  }) }).erros, 'que não está no campo');
  regista('um pedaço sem apoio', conferirAuditoriaDasLeituras({ auditoria: auditoriaCom((a) => {
    dela(a, 'criancas-em-creche-2025').folhas[1].partes[0].apoios = [];
  }) }).erros, 'não tem apoio nenhum');
  regista('um algarismo sem literal', conferirAuditoriaDasLeituras({ auditoria: auditoriaCom((a) => {
    dela(a, 'taxa-de-emprego-2025').algarismos[0].apoios = [{ linha: 'propria', campo: 'excerpt', literal: 'Age class' }];
  }) }).erros, 'não traz o algarismo');
  /* A DECLARAÇÃO RETIRADA FECHA A CONSTRUÇÃO (item 1 do brief): um processo
     filho carrega o resolvedor com um gancho do carregador que tira a leitura do
     saldo ao ficheiro das leituras, e o módulo tem de recusar carregar, que é o
     que faz a construção fechar quando um componente o importa. O mesmo filho
     sem o gancho tem de carregar, ou a planta não mediu nada. */
  {
    const resolvedor = pathToFileURL(path.join(RAIZ, 'src/lib/leitura-da-medida.mjs')).href;
    const gancho = `export async function load(url, ctx, next) {
      if (url.endsWith('/src/data/leituras-das-medidas.mjs')) {
        return { format: 'module', shortCircuit: true, source:
          "import * as m from '" + url + "?inteira'; const c = { ...m.LEITURAS_DAS_MEDIDAS };" +
          " delete c['${saldo}']; export const LEITURAS_DAS_MEDIDAS = c;" };
      }
      return next(url, ctx);
    }`;
    const filho = (/** @type {string} */ codigo) => spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { encoding: 'utf8', cwd: RAIZ });
    const limpo = filho(`await import(${JSON.stringify(resolvedor)});`);
    const semDeclaracao = filho(`import { register } from 'node:module';
      register('data:text/javascript,' + encodeURIComponent(${JSON.stringify(gancho)}));
      await import(${JSON.stringify(resolvedor)});`);
    const saida = `${semDeclaracao.stdout}${semDeclaracao.stderr}`;
    regista('a declaração retirada fecha o resolvedor',
      limpo.status === 0 && semDeclaracao.status !== 0 ? saida.split('\n').filter((l) => l.includes(saldo)) : [`o filho limpo saiu com ${limpo.status} e o plantado com ${semDeclaracao.status}`],
      'não tem leitura declarada nesta edição');
  }
  /* A segunda metade, sobre uma cópia da página dos temas em memória. */
  const temas = fs.readFileSync(path.join(dist, 'temas/index.html'), 'utf8');
  const linhas = loadClaims();
  /** @param {(r: import('node-html-parser').HTMLElement) => void} estraga */
  const pagina = (estraga) => { const r = parse(temas); estraga(r); return conferirPaginaDaLeitura(r, 'pt', '/temas/ (planta)', linhas).erros; };
  const leituraDe = (/** @type {any} */ r, /** @type {string} */ id) => r.querySelector(`[data-cartao-medida="${id}"] [data-cartao-leitura]`);
  regista('um algarismo escrito à mão na leitura', pagina((r) => { leituraDe(r, saldo).insertAdjacentHTML('beforeend', ' Em 12 anos subiu.'); }),
    'algarismo sem marca de origem');
  regista('um algarismo escrito como referência de carácter', pagina((r) => { leituraDe(r, saldo).insertAdjacentHTML('beforeend', ' Em &#x31;&#x32; anos.'); }),
    'algarismo sem marca de origem');
  regista('o ramo trocado', pagina((r) => {
    const l = leituraDe(r, saldo);
    l.set_content(l.innerHTML.replace('O saldo subiu face a', 'O saldo desceu face a'));
  }), 'um ramo que a conta não escolheu');
  regista('uma linha de outra medida citada', pagina((r) => {
    const v = leituraDe(r, saldo).querySelector('[data-claim]');
    v.setAttribute('data-claim', 'divida-publica-2025');
  }), 'que não é a do cartão nem uma que a régua dele rende');
  regista('um cartão sem leitura', pagina((r) => { leituraDe(r, 'divida-publica-2025').remove(); }), 'o cartão tem 0 leitura(s)');
  regista('a leitura com a marca da fonte', pagina((r) => {
    leituraDe(r, saldo).insertAdjacentHTML('beforeend', '<a class="src-chip" href="/livro-razao/saldo-das-administracoes-publicas-2025">fonte</a>');
  }), 'repete a marca da fonte');
  return out;
}
