/**
 * =============================================================================
 * X · A EXPLICAÇÃO, AUDITADA E RECONTADA (bloco EX1, 05.10.2026, o ponto 3 do mandato)
 * =============================================================================
 *
 * PORQUE EXISTE. Uma explicação é texto corrido do lugar de direção com os números do país, e é o sítio onde uma
 * frase sem origem, um ramo trocado ou uma comparação que deixou de ser verdadeira entram com mais facilidade. As
 * palavras são do lugar de direção (`src/data/explicacoes/`), e os números, os nomes e os ramos são da máquina
 * (`src/lib/explicacoes.mjs`). Esta célula confere as duas coisas, com leitor próprio: não chama o resolvedor.
 *
 * A PRIMEIRA METADE NÃO LÊ `dist/`:
 *   · X1 · cada folha de texto da declaração, nas duas edições, tem a sua auditoria na secção «explicacoes» de
 *     `tests/cartao/leituras-provadas.json`, e as partes juntas são a folha, carácter a carácter; as duas edições
 *     têm a mesma forma (os mesmos tokens pela mesma ordem);
 *   · X2 · cada parte tem uma classe: «diz» com um literal que está mesmo no campo que cita (de uma origem das
 *     explicações, de uma origem das definições, ou de um campo publicado de uma linha que a explicação nomeia ou de
 *     que uma delas deriva); «conta» só dentro de um ramo do sinal ou de palavras guardadas por condições; «aponta»
 *     só para uma secção que está acima na própria explicação; «liga» só com pontuação e as palavras da lista
 *     fechada; cada origem da lista da explicação apoia uma parte, e cada origem usada está na lista;
 *   · X3 · cada origem das explicações tem o selo inteiro (o ficheiro no motor, a hora, o cliente, o sha256 e o campo)
 *     e a data de leitura é o dia do pedido; com o motor ao lado (`RESEARCHHUB_DIR`), o sha256 do ficheiro, o registo
 *     do pedido (`.pedido.json`) e o campo lido no ficheiro conferem-se carácter a carácter;
 *   · X4 · o número por extenso do título de uma figura («As dez funções», «Os dezasseis ministérios») é o número
 *     das linhas que a figura declara.
 *
 * A SEGUNDA METADE LÊ AS PÁGINAS CONSTRUÍDAS:
 *   · X5 · o título (o `<h1>` e a folha do caminho) é o título recomposto: as palavras declaradas e o ano pelo
 *     período da linha, pela cópia desta célula da forma da casa;
 *   · X6 · cada parágrafo rendido é, carácter a carácter, o que esta célula recompõe da declaração, com as condições
 *     avaliadas por uma conta sua (as maiores do grupo, o mês, a ausência de linhas), o ramo do sinal pelo sinal do
 *     valor, cada nome pelo nome do projeto da linha, cada valor e cada sufixo; nenhum texto de um ramo não escolhido
 *     nem de palavras guardadas por uma condição falsa está na página; os parágrafos que se rendem são os que a conta
 *     dá, pela ordem declarada;
 *   · X7 · os títulos das secções são os declarados, pela ordem, e «O que isto não diz» é a cadeia da casa;
 *   · X8 · as portas que levam o título de uma explicação (a lista, o índice, a primeira página) rendem o título
 *     recomposto, e a página leva no fim a porta para os números e as fontes.
 *
 * O QUE NÃO CONFERE, e di-lo: não infere que o literal quer dizer o que a parte diz. Essa escolha é uma leitura,
 * feita por quem assina a auditoria, e é essa leitura que a leitura a frio relê.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../../src/data/explicacoes/index.mjs';
import { ORIGENS_DAS_EXPLICACOES } from '../../src/data/explicacoes/origens.mjs';
import { ORIGENS_DAS_DEFINICOES } from '../../src/data/figuras.mjs';
import { NOMES_OE1 } from '../../src/data/medidas-oe1.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { conferirBarrasDoLivro } from '../formas/barras-do-livro.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
export const AUDITORIA = path.join(RAIZ, 'tests', 'cartao', 'leituras-provadas.json');

/** Os campos publicados de uma linha que podem apoiar uma parte de uma explicação; `nome` é o nome do projeto. */
const CAMPOS_DA_LINHA = new Set(['excerpt', 'unit', 'document.title', 'document.locator', 'name', 'ressalva', 'ressalva_en', 'derivation', 'derivation_en', 'nome']);
const CAMPOS_DA_ORIGEM = new Set(['excerto', 'excertoEn', 'documento', 'publicador']);
const LITERAL_MINIMO = 4;
/* AS PALAVRAS DE LIGAÇÃO, uma lista fechada: preposições, artigos e conjunções, e «contra», que apresenta o segundo
   valor de uma comparação sem dizer nada de uma medida. Uma palavra que diga alguma coisa não é ligação. */
const PALAVRAS_DE_LIGACAO = {
  pt: new Set(['a', 'o', 'os', 'as', 'um', 'uma', 'e', 'em', 'de', 'do', 'da', 'dos', 'das', 'para', 'no', 'na', 'com', 'contra']),
  en: new Set(['the', 'a', 'of', 'and', 'in', 'to', 'for', 'by', 'with', 'on', 'at', 'against']),
};
const PONTUACAO = /[\s.,:;()−%’'!?]+/g;
const PREFIXO = { pt: ' que vai para ', en: ' going to ' };
const NUMEROS_POR_EXTENSO = { dez: 10, dezasseis: 16, ten: 10, sixteen: 16 };
const MESES = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const normal = (/** @type {unknown} */ s) => String(s ?? '').replace(/[\s   ]+/g, ' ').trim();
const curto = (/** @type {string} */ s) => (s.length > 70 ? `${s.slice(0, 67)}…` : s);

/** O período de uma linha na forma da casa, pela cópia desta célula. @param {string} p @param {'pt'|'en'} lang */
export function periodoAqui(p, lang) {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(p);
  if (m) return lang === 'en' ? `${MESES.en[Number(m[2]) - 1]} ${m[1]}` : `${MESES.pt[Number(m[2]) - 1]} de ${m[1]}`;
  return /^\d{4}$/.test(p) ? p : null;
}
/** O número de um valor, pela conta desta célula. @param {unknown} v */
const numero = (v) => {
  const s = String(v ?? '').replace(/[\s  ]/g, '').replace(/−/g, '-').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
/** O nome da função ou do ministério de uma linha, pela regra desta célula. @param {string} id @param {'pt'|'en'} lang */
function nomeAqui(id, lang) {
  const n = /** @type {Record<string, { pt: string, en: string }>} */ (NOMES_OE1)[id]?.[lang];
  return typeof n === 'string' && n.includes(PREFIXO[lang]) ? n.slice(n.indexOf(PREFIXO[lang]) + PREFIXO[lang].length) : null;
}

/* =========================================================================
 * A FORMA DA DECLARAÇÃO
 * ========================================================================= */

/**
 * AS FOLHAS DE TEXTO DE UMA EXPLICAÇÃO, nas duas edições ao mesmo tempo, com o caminho e o ramo de cada uma. As duas
 * edições têm de ter a mesma forma, e uma diferença atira.
 * @param {any} e
 * @returns {{ caminho: string, pt: string, en: string, ramo: 'sinal'|'se'|null }[]}
 */
export function folhasDaExplicacao(e) {
  /** @type {{ caminho: string, pt: string, en: string, ramo: 'sinal'|'se'|null }[]} */
  const out = [];
  /** @param {any} a @param {any} b @param {string} c @param {'sinal'|'se'|null} ramo */
  const anda = (a, b, c, ramo) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) throw new Error(`X1 · as duas edições têm formas diferentes em ${c}`);
      a.forEach((x, i) => {
        if (typeof x === 'string') {
          if (typeof b[i] !== 'string') throw new Error(`X1 · as duas edições têm formas diferentes em ${c}[${i}]`);
          out.push({ caminho: `${c}[${i}]`, pt: x, en: b[i], ramo });
        } else anda(x, b[i], `${c}[${i}]`, ramo);
      });
      return;
    }
    const ka = Object.keys(a ?? {}).filter((k) => k !== 'inicial').sort().join(','), kb = Object.keys(b ?? {}).filter((k) => k !== 'inicial').sort().join(',');
    if (ka !== kb) throw new Error(`X1 · as duas edições têm pedaços diferentes em ${c} (${ka} / ${kb})`);
    if ('sinal' in a) {
      if (a.sinal !== b.sinal) throw new Error(`X1 · as duas edições dão o sinal de linhas diferentes em ${c}`);
      for (const r of ['positivo', 'negativo', 'zero']) if (r in a) anda(a[r], b[r], `${c}.${r}`, 'sinal');
      return;
    }
    if ('se' in a) {
      if (JSON.stringify(a.se) !== JSON.stringify(b.se)) throw new Error(`X1 · as duas edições guardam as palavras com condições diferentes em ${c}`);
      anda(a.partes, b.partes, `${c}.se`, 'se');
      return;
    }
    if ('claim' in a) {
      if (a.claim !== b.claim) throw new Error(`X1 · as duas edições citam linhas diferentes em ${c}`);
      if (typeof a.sufixo === 'string') out.push({ caminho: `${c}.sufixo`, pt: a.sufixo, en: b.sufixo, ramo });
      return;
    }
    const ia = { ...a }, ib = { ...b };
    delete ia.inicial; delete ib.inicial;
    if (JSON.stringify(ia) !== JSON.stringify(ib)) throw new Error(`X1 · as duas edições têm pedaços calculados diferentes em ${c}`);
  };
  anda(e.titulo.pt, e.titulo.en, 'titulo', null);
  e.abertura.forEach((/** @type {any} */ p, /** @type {number} */ i) => anda(p.pt, p.en, `abertura[${i}]`, null));
  e.seccoes.forEach((/** @type {any} */ s, /** @type {number} */ i) => {
    out.push({ caminho: `seccoes[${i}].titulo`, pt: s.titulo.pt, en: s.titulo.en, ramo: null });
    s.conteudo.forEach((/** @type {any} */ b, /** @type {number} */ j) => {
      if (b.figura) out.push({ caminho: `seccoes[${i}].conteudo[${j}].figura.titulo`, pt: b.figura.titulo.pt, en: b.figura.titulo.en, ramo: null });
      else anda(b.paragrafo.pt, b.paragrafo.en, `seccoes[${i}].conteudo[${j}].paragrafo`, null);
    });
  });
  e.naoDiz.forEach((/** @type {any} */ p, /** @type {number} */ i) => anda(p.pt, p.en, `naoDiz[${i}]`, null));
  return out;
}

/**
 * AS LINHAS QUE UMA EXPLICAÇÃO NOMEIA (os tokens, as figuras, as condições) e as de que elas derivam: são estas, e só
 * estas, que podem apoiar uma parte.
 * @param {any} e @param {Map<string, any>} linhas
 */
export function linhasDaExplicacao(e, linhas) {
  /** @type {Set<string>} */
  const out = new Set();
  /** @param {unknown} x */
  const anda = (x) => {
    if (Array.isArray(x)) x.forEach(anda);
    else if (x && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        if (['claim', 'periodo', 'nome', 'sinal'].includes(k) && typeof v === 'string') out.add(v);
        else if (['linhas', 'primeiros', 'de'].includes(k) && Array.isArray(v)) v.forEach((id) => typeof id === 'string' && out.add(id));
        else anda(v);
      }
    }
  };
  anda(e);
  for (const id of [...out]) for (const d of linhas.get(id)?.derived_from ?? []) out.add(d);
  return out;
}

/* =========================================================================
 * A PRIMEIRA METADE
 * ========================================================================= */

/** @param {any} linha @param {string} campo @param {string} id */
function campoDaLinha(linha, campo, id) {
  if (campo === 'document.title') return linha?.document?.title;
  if (campo === 'document.locator') return linha?.document?.locator;
  if (campo === 'nome') {
    const n = /** @type {Record<string, { pt: string, en: string }>} */ (NOMES_OE1)[id];
    return n ? `${n.pt}\n${n.en}` : undefined;
  }
  return linha?.[campo];
}

/**
 * X1, X2 e X4: a auditoria das palavras de cada explicação.
 * @param {{ auditoria?: any, explicacoes?: any[], linhas?: Map<string, any>, origensDasExplicacoes?: Record<string, any>, origensDasDefinicoes?: Record<string, any> }} [entrada]
 */
export function conferirAuditoriaDasExplicacoes({
  auditoria = JSON.parse(fs.readFileSync(AUDITORIA, 'utf8')),
  explicacoes = EXPLICACOES,
  linhas = loadClaims(),
  origensDasExplicacoes = ORIGENS_DAS_EXPLICACOES,
  origensDasDefinicoes = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { explicacoes: 0, folhas: 0, partes: 0, diz: 0, conta: 0, liga: 0, aponta: 0, apoios: 0, origens: 0 };
  const lista = Array.isArray(auditoria?.explicacoes) ? auditoria.explicacoes : null;
  if (!lista || !lista.length) return { erros: ['X1 · a auditoria das leituras não tem a secção «explicacoes»: a célula não mediu nada'], contas };
  for (const e of explicacoes) {
    const a = lista.find((x) => x?.slug === e.slug);
    const falha = (/** @type {string} */ m) => erros.push(`X · ${e.slug}: ${m}`);
    if (!a) { falha('a explicação não tem auditoria'); continue; }
    contas.explicacoes++;
    let folhas;
    try { folhas = folhasDaExplicacao(e); } catch (err) { falha(err instanceof Error ? err.message : String(err)); continue; }
    const permitidas = linhasDaExplicacao(e, linhas);
    const seccoesAcima = e.seccoes.map((/** @type {any} */ s) => String(s.id));
    const declaradas = new Set(a.origens ?? []);
    /** @type {Set<string>} */
    const usadas = new Set();
    const propriasUsadas = new Set();
    for (const f of folhas) {
      contas.folhas++;
      const qual = `a folha «${curto(f.pt)}» (${f.caminho})`;
      const i = (a.folhas ?? []).findIndex((/** @type {any} */ x) => x?.caminho === f.caminho && x?.pt === f.pt && x?.en === f.en);
      if (i < 0) { falha(`X1 · ${qual} não tem auditoria: uma explicação mudada precisa de nova leitura das origens`); continue; }
      propriasUsadas.add(i);
      const partes = Array.isArray(a.folhas[i].partes) ? a.folhas[i].partes : [];
      if (partes.map((/** @type {any} */ p) => p?.pt ?? '').join('') !== f.pt || partes.map((/** @type {any} */ p) => p?.en ?? '').join('') !== f.en) {
        falha(`X1 · ${qual}: as partes juntas não dão a folha, nas duas edições`);
        continue;
      }
      for (const [j, p] of partes.entries()) {
        contas.partes++;
        const qp = `${qual}, parte ${j + 1} («${curto(String(p?.pt))}»)`;
        if (p?.classe === 'diz') {
          contas.diz++;
          if (!Array.isArray(p.apoios) || !p.apoios.length) { falha(`X2 · ${qp} diz o que uma coisa é e não tem apoio nenhum`); continue; }
          for (const ap of p.apoios) {
            contas.apoios++;
            if (ap?.forma === 'ano') {
              const r = String(linhas.get(ap.linha)?.reference_date ?? '');
              if (!permitidas.has(ap.linha) || ap.campo !== 'reference_date' || !/^\d{4}$/.test(r)) falha(`X2 · ${qp} diz que o período é um ano, e a linha «${ap.linha}» não o prova`);
              continue;
            }
            const literal = ap?.literal;
            if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) { falha(`X2 · ${qp} cita um literal com menos de ${LITERAL_MINIMO} caracteres`); continue; }
            if (ap.origem) {
              const o = origensDasExplicacoes[ap.origem] ?? origensDasDefinicoes[ap.origem];
              if (!o) { falha(`X2 · ${qp} apoia-se em «${ap.origem}», que não é uma origem declarada`); continue; }
              if (!CAMPOS_DA_ORIGEM.has(ap.campo) || typeof o[ap.campo] !== 'string') { falha(`X2 · ${qp} cita o campo «${ap.campo}» da origem «${ap.origem}», que não existe ou não pode apoiar`); continue; }
              if (!o[ap.campo].includes(literal)) { falha(`X2 · ${qp} cita «${curto(literal)}», que não está no campo «${ap.campo}» da origem «${ap.origem}»`); continue; }
              usadas.add(ap.origem);
            } else if (ap.linha) {
              if (!permitidas.has(ap.linha)) { falha(`X2 · ${qp} cita a linha «${ap.linha}», que a explicação não nomeia`); continue; }
              const valor = CAMPOS_DA_LINHA.has(ap.campo) ? campoDaLinha(linhas.get(ap.linha), ap.campo, ap.linha) : undefined;
              if (typeof valor !== 'string') { falha(`X2 · ${qp} cita o campo «${ap.campo}» da linha «${ap.linha}», que não existe ou não pode apoiar`); continue; }
              if (!valor.includes(literal)) { falha(`X2 · ${qp} cita «${curto(literal)}», que não está no campo «${ap.campo}» da linha «${ap.linha}»`); continue; }
            } else falha(`X2 · ${qp} tem um apoio sem origem nem linha`);
          }
        } else if (p?.classe === 'conta') {
          contas.conta++;
          if (p.apoios?.length) falha(`X2 · ${qp} é uma conta e traz apoios`);
          if (!f.ramo) falha(`X2 · ${qp} está marcada como conta e não está num ramo do sinal nem em palavras guardadas por condições`);
        } else if (p?.classe === 'aponta') {
          contas.aponta++;
          const alvo = String(p.secao ?? '');
          const idx = seccoesAcima.indexOf(alvo);
          const daFolha = /^seccoes\[(\d+)\]/.exec(f.caminho);
          const acima = idx >= 0 && (f.caminho.startsWith('naoDiz') || (daFolha !== null && idx < Number(daFolha[1])));
          if (!acima) falha(`X2 · ${qp} aponta para a secção «${alvo}», que não está acima na explicação`);
        } else if (p?.classe === 'liga') {
          contas.liga++;
          for (const lang of /** @type {const} */ (['pt', 'en'])) {
            const resto = String(p[lang] ?? '').toLowerCase().replace(PONTUACAO, ' ').trim();
            const fora = (resto ? resto.split(/\s+/) : []).filter((w) => !PALAVRAS_DE_LIGACAO[lang].has(w));
            if (fora.length) falha(`X2 · ${qp} está marcada como ligação e traz «${fora.join(' ')}» (${lang})`);
          }
        } else falha(`X2 · ${qp} não tem classe (diz, conta, aponta ou liga)`);
      }
    }
    for (const [k, x] of (a.folhas ?? []).entries()) if (!propriasUsadas.has(k)) falha(`X1 · a auditoria tem uma folha («${curto(String(x?.pt))}», ${x?.caminho}) que a declaração não tem`);
    for (const o of declaradas) if (!usadas.has(o)) falha(`X2 · a origem «${o}» está na lista da auditoria e não apoia parte nenhuma`);
    for (const o of usadas) if (!declaradas.has(o)) falha(`X2 · a origem «${o}» apoia uma parte e não está na lista da auditoria`);
    contas.origens += usadas.size;
    /* X4 · o número por extenso do título de cada figura é o das linhas declaradas. */
    for (const s of e.seccoes) for (const b of s.conteudo) {
      if (!b.figura) continue;
      for (const lang of /** @type {const} */ (['pt', 'en'])) {
        const palavra = Object.keys(NUMEROS_POR_EXTENSO).find((w) => new RegExp(`(^|\\s)${w}(\\s|$)`, 'i').test(b.figura.titulo[lang]));
        if (palavra && NUMEROS_POR_EXTENSO[/** @type {keyof typeof NUMEROS_POR_EXTENSO} */ (palavra)] !== b.figura.linhas.length) falha(`X4 · o título da figura «${b.figura.id}» diz «${palavra}» e a figura declara ${b.figura.linhas.length} linhas`);
      }
    }
  }
  return { erros, contas };
}

/**
 * X3: as origens das explicações. Com o motor ao lado, os ficheiros e os registos dos pedidos.
 * @param {{ origens?: Record<string, any>, motor?: string|undefined }} [entrada]
 */
export function conferirOrigensDasExplicacoes({ origens = ORIGENS_DAS_EXPLICACOES, motor = process.env.RESEARCHHUB_DIR } = {}) {
  /** @type {string[]} */
  const erros = [];
  let lidasNoMotor = 0;
  for (const [chave, o] of Object.entries(origens)) {
    const s = o?.alojada;
    const faltas = [];
    if (!/^https:\/\/\S+$/.test(o?.url ?? '')) faltas.push('o endereço');
    if (typeof s?.motor !== 'string' || !/^content\/[^/]+\/source\/\S/.test(s.motor)) faltas.push('o ficheiro alojado no motor');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s?.hora ?? '')) faltas.push('a hora (UTC, ao segundo)');
    if (typeof s?.cliente !== 'string' || !s.cliente.trim()) faltas.push('o cliente');
    if (!/^[0-9a-f]{64}$/.test(s?.sha256 ?? '')) faltas.push('o sha256');
    if (typeof s?.campo !== 'string' || !s.campo) faltas.push('o campo lido');
    if (faltas.length) { erros.push(`X3 · origem «${chave}»: o selo não diz ${faltas.join(', ')}`); continue; }
    if (s.hora.slice(0, 10) !== o.lido) erros.push(`X3 · origem «${chave}»: a data de leitura (${o.lido}) não é o dia do pedido (${s.hora.slice(0, 10)})`);
    if (!motor) continue;
    const ficheiro = path.join(motor, s.motor);
    if (!fs.existsSync(ficheiro)) { erros.push(`X3 · origem «${chave}»: o ficheiro ${s.motor} não está no motor`); continue; }
    const bytes = fs.readFileSync(ficheiro);
    const sha = crypto.createHash('sha256').update(bytes).digest('hex');
    if (sha !== s.sha256) erros.push(`X3 · origem «${chave}»: o sha256 do ficheiro no motor (${sha.slice(0, 12)}…) não é o do selo (${s.sha256.slice(0, 12)}…)`);
    const registo = `${ficheiro}.pedido.json`;
    if (!fs.existsSync(registo)) erros.push(`X3 · origem «${chave}»: não há registo do pedido ao lado do ficheiro`);
    else {
      const r = JSON.parse(fs.readFileSync(registo, 'utf8'));
      if (r.pedido !== o.url) erros.push(`X3 · origem «${chave}»: o endereço do registo do pedido não é o da origem`);
      if (String(r.acedido_em ?? '').slice(0, 19) + 'Z' !== s.hora) erros.push(`X3 · origem «${chave}»: a hora do registo do pedido (${r.acedido_em}) não é a do selo (${s.hora})`);
      if (r.cliente !== s.cliente) erros.push(`X3 · origem «${chave}»: o cliente do registo do pedido («${r.cliente}») não é o do selo`);
      if (r.sha256 !== s.sha256) erros.push(`X3 · origem «${chave}»: o sha256 do registo do pedido não é o do selo`);
    }
    const json = JSON.parse(bytes.toString('utf8'));
    let lido;
    if (o.composicao) {
      const rotulos = o.composicao.chave.split('.').reduce((/** @type {any} */ x, /** @type {string} */ k) => x?.[k], json);
      lido = o.composicao.rotulos.map((/** @type {string} */ k) => rotulos?.[k]).join(o.composicao.separador);
    } else lido = s.campo.split('.').reduce((/** @type {any} */ x, /** @type {string} */ k) => x?.[k], json);
    if (lido !== o.excerto) erros.push(`X3 · origem «${chave}»: o excerto não é, carácter a carácter, o campo lido no ficheiro do motor`);
    lidasNoMotor++;
  }
  return { erros, contas: { origens: Object.keys(origens).length, lidas_no_motor: lidasNoMotor, motor: Boolean(motor) } };
}

/* =========================================================================
 * A SEGUNDA METADE
 * ========================================================================= */

/** A condição, pela conta desta célula. @param {any} c @param {Map<string, any>} linhas */
function condicaoAqui(c, linhas) {
  if (Array.isArray(c?.primeiros)) {
    const v = (/** @type {string} */ id) => numero(linhas.get(id)?.value);
    const nums = c.primeiros.map(v);
    const outros = c.de.filter((/** @type {string} */ id) => !c.primeiros.includes(id)).map(v);
    if ([...nums, ...outros].some((x) => x === null)) return false;
    for (let i = 1; i < nums.length; i++) if (!(nums[i - 1] > nums[i])) return false;
    return outros.every((/** @type {number} */ x) => nums[nums.length - 1] > x);
  }
  if (typeof c?.periodo === 'string') {
    const m = /^\d{4}-(\d{2})$/.exec(String(linhas.get(c.periodo)?.reference_date ?? ''));
    return Boolean(m) && Number(m?.[1]) === c.mes;
  }
  if (typeof c?.sem_linhas === 'string') return ![...linhas.keys()].some((id) => new RegExp(c.sem_linhas).test(id));
  return false;
}

/**
 * O TEXTO DE UMA PARTE DECLARADA, pela conta desta célula, com o texto dos ramos não escolhidos e das palavras que
 * uma condição falsa guarda, para se conferir que não estão na página.
 * @param {any} partes @param {'pt'|'en'} lang @param {Map<string, any>} linhas @param {string[]} ausentes
 */
function textoAqui(partes, lang, linhas, ausentes) {
  const s = t(lang);
  return (Array.isArray(partes) ? partes : [partes]).map((p) => {
    if (typeof p === 'string') return p;
    if ('claim' in p) {
      const l = linhas.get(p.claim);
      const provisorio = l?.source_flag === 'p' || (l?.source_flag === '&' && l?.source_flag_note === 'Dado provisório');
      return `${l?.value}${p.sufixo ?? ''}${provisorio ? ` (${s.prov.dadoProvisorio})` : ''}`;
    }
    if ('periodo' in p) return periodoAqui(String(linhas.get(p.periodo)?.reference_date ?? ''), lang) ?? '';
    if ('nome' in p) {
      const n = nomeAqui(p.nome, lang) ?? '';
      return p.inicial ? n.charAt(0).toUpperCase() + n.slice(1) : n;
    }
    if ('sinal' in p) {
      const v = numero(linhas.get(p.sinal)?.value);
      const ramo = v === null ? null : v > 0 ? 'positivo' : v < 0 ? 'negativo' : 'zero';
      for (const r of ['positivo', 'negativo', 'zero']) if (r !== ramo && r in p) ausentes.push(normal(textoAqui(p[r], lang, linhas, [])));
      return ramo && ramo in p ? textoAqui(p[ramo], lang, linhas, ausentes) : '';
    }
    if ('se' in p) {
      const texto = textoAqui(p.partes, lang, linhas, ausentes);
      if (p.se.every((/** @type {any} */ c) => condicaoAqui(c, linhas))) return texto;
      ausentes.push(normal(texto));
      return '';
    }
    return '';
  }).join('');
}

/**
 * O QUE UMA EXPLICAÇÃO RENDE, pela conta desta célula, numa edição.
 * @param {any} e @param {'pt'|'en'} lang @param {Map<string, any>} linhas
 */
export function explicacaoPelaCelula(e, lang, linhas) {
  /** @type {string[]} */
  const ausentes = [];
  /** @type {{ caminho: string, texto: string }[]} */
  const paragrafos = [];
  const junta = (/** @type {any} */ p, /** @type {string} */ caminho) => {
    const texto = normal(textoAqui(p[lang], lang, linhas, ausentes));
    if (texto) paragrafos.push({ caminho, texto });
  };
  e.abertura.forEach((/** @type {any} */ p, /** @type {number} */ i) => junta(p, `abertura[${i}]`));
  e.seccoes.forEach((/** @type {any} */ s, /** @type {number} */ i) => s.conteudo.forEach((/** @type {any} */ b, /** @type {number} */ j) => { if (b.paragrafo) junta(b.paragrafo, `seccoes[${i}].conteudo[${j}].paragrafo`); }));
  e.naoDiz.forEach((/** @type {any} */ p, /** @type {number} */ i) => junta(p, `naoDiz[${i}]`));
  return { titulo: normal(textoAqui(e.titulo[lang], lang, linhas, [])), paragrafos, ausentes: ausentes.filter(Boolean) };
}

/** O texto de um elemento sem os selos. @param {any} el */
export function textoSemSelos(el) {
  const copia = parse(el.outerHTML);
  copia.querySelectorAll('.src-chip, .claim-provisorio-chip').forEach((/** @type {any} */ n) => n.remove());
  return normal(copia.textContent);
}

/**
 * X5 a X8, numa página de uma explicação.
 * @param {any} root @param {'pt'|'en'} lang @param {string} slug @param {Map<string, any>} [linhas]
 */
export function conferirPaginaDaExplicacao(root, lang, slug, linhas = loadClaims()) {
  /** @type {string[]} */
  const erros = [];
  const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === slug));
  if (!e) return [`X5 · a página da explicação «${slug}» não tem declaração`];
  const s = t(lang);
  const esperado = explicacaoPelaCelula(e, lang, linhas);
  const main = root.querySelector('main') ?? root;
  const h1 = main.querySelector('h1');
  if (!h1 || normal(h1.textContent) !== esperado.titulo) erros.push(`X5 · o título rendido («${normal(h1?.textContent)}») não é o recomposto («${esperado.titulo}»)`);
  const folha = root.querySelector('[data-explicacao-caminho]');
  if (folha && normal(folha.textContent) !== esperado.titulo) erros.push('X5 · a folha do caminho não é o título recomposto');
  const rendidos = main.querySelectorAll('[data-explicacao-paragrafo]');
  const caminhos = rendidos.map((/** @type {any} */ p) => p.getAttribute('data-explicacao-paragrafo'));
  if (JSON.stringify(caminhos) !== JSON.stringify(esperado.paragrafos.map((p) => p.caminho))) erros.push(`X6 · os parágrafos rendidos (${caminhos.join(', ')}) não são os que a conta dá (${esperado.paragrafos.map((p) => p.caminho).join(', ')})`);
  for (const p of esperado.paragrafos) {
    const el = rendidos.find((/** @type {any} */ x) => x.getAttribute('data-explicacao-paragrafo') === p.caminho);
    if (!el) continue;
    const texto = textoSemSelos(el);
    if (texto !== p.texto) erros.push(`X6 · o parágrafo ${p.caminho} difere da conta.\n      esperado: ${curto(p.texto)}\n      rendido:  ${curto(texto)}`);
  }
  const todo = normal(main.textContent);
  for (const a of esperado.ausentes) if (a.length >= 4 && todo.includes(a)) erros.push(`X6 · o texto de um ramo não escolhido, ou guardado por uma condição falsa, está na página: «${curto(a)}»`);
  const titulos = main.querySelectorAll('[data-explicacao-secao] > h2').map((/** @type {any} */ h) => normal(h.textContent));
  const deveTitulos = [...e.seccoes.map((/** @type {any} */ x) => x.titulo[lang]), ...(esperado.paragrafos.some((p) => p.caminho.startsWith('naoDiz')) ? [s.explicacoes.oQueIstoNaoDiz] : [])];
  if (JSON.stringify(titulos) !== JSON.stringify(deveTitulos)) erros.push(`X7 · os títulos das secções (${titulos.join(' | ')}) não são os declarados (${deveTitulos.join(' | ')})`);
  if (!main.querySelector(`[data-explicacao-portas] a[href]`)) erros.push('X8 · falta a porta para os números e as fontes no fim');
  return erros;
}

/**
 * X8, numa porta que leva o título de uma explicação (a lista, o índice, a primeira página).
 * @param {any} el @param {'pt'|'en'} lang @param {Map<string, any>} [linhas]
 */
export function conferirTituloNumaPorta(el, lang, linhas = loadClaims()) {
  const slug = el.getAttribute('data-explicacao-porta');
  const e = /** @type {any} */ (EXPLICACOES.find((x) => x.slug === slug));
  if (!e) return [`X8 · uma porta para a explicação «${slug}», que não está declarada`];
  const esperado = normal(textoAqui(e.titulo[lang], lang, linhas, []));
  return normal(el.textContent) === esperado ? [] : [`X8 · a porta de «${slug}» rende «${normal(el.textContent)}» e o título recomposto é «${esperado}»`];
}

/**
 * AS PALAVRAS DECLARADAS DE UMA PÁGINA, conferidas antes de saírem do inventário das frases: o `check:voz` chama esta
 * função em cada página onde a marca `data-explicacao-declarado` se rende, e uma queixa fecha a construção.
 * @param {any} root @param {'pt'|'en'} lang @param {string|undefined} rota @param {string|undefined} slug
 */
export function conferirPalavrasDaExplicacaoNaPagina(root, lang, rota, slug) {
  const linhas = loadClaims();
  /** @type {string[]} */
  const erros = [];
  if (rota === 'explicacao' && slug) {
    erros.push(...conferirPaginaDaExplicacao(root, lang, slug, linhas));
    /* Os rótulos das barras são nomes declarados das linhas: confere-os a F22, aqui, na mesma corrida. */
    for (const instrumento of root.querySelectorAll('[data-instrumento]').filter((/** @type {any} */ x) => x.querySelector('figure[data-forma="barras-do-livro"]'))) {
      erros.push(...conferirBarrasDoLivro(instrumento, lang, slug, linhas));
    }
  }
  for (const el of root.querySelectorAll('[data-explicacao-porta]')) erros.push(...conferirTituloNumaPorta(el, lang, linhas));
  /* Uma marca fora dos sítios que esta célula confere não sai do inventário: é um erro. */
  for (const el of root.querySelectorAll('[data-explicacao-declarado]')) {
    const conferido = el.hasAttribute('data-explicacao-porta') || (rota === 'explicacao' && (el.closest('main') || el.hasAttribute('data-explicacao-caminho')));
    if (!conferido) erros.push(`X · a marca das palavras declaradas está num sítio que a célula da explicação não confere (${rota})`);
  }
  return erros;
}

/**
 * AS PLANTAS DA SEGUNDA METADE E DA AUDITORIA, em memória. Cada uma tem de morder com a queixa dela.
 * @param {string} dist
 */
export function plantasDaExplicacao(dist) {
  const linhas = loadClaims();
  /** @type {{ nome: string, mordeu: boolean, queixa: string }[]} */
  const out = [];
  const e = EXPLICACOES[0];
  const ficheiro = path.join(dist, 'explicacoes', e.slug, 'index.html');
  const html = fs.readFileSync(ficheiro, 'utf8');
  const controlo = conferirPaginaDaExplicacao(parse(html), 'pt', e.slug, linhas);
  /** @param {string} nome @param {(r: any) => void} estraga @param {RegExp} mordida */
  const naPagina = (nome, estraga, mordida) => {
    const r = parse(html);
    estraga(r);
    const q = conferirPaginaDaExplicacao(r, 'pt', e.slug, linhas);
    out.push({ nome, mordeu: controlo.length === 0 && q.some((x) => mordida.test(x)), queixa: q.join(' | ') || 'nenhuma' });
  };
  const paragrafo = (/** @type {any} */ r, /** @type {string} */ inclui) => r.querySelectorAll('[data-explicacao-paragrafo]').find((/** @type {any} */ p) => normal(p.textContent).includes(inclui));
  naPagina('o ramo do sinal trocado (excedente por défice)', (r) => { const p = paragrafo(r, 'excedente'); p.set_content(p.innerHTML.replace('excedente', 'défice')); }, /X6 ·/);
  naPagina('as palavras de uma condição falsa rendidas (os três programas)', (r) => { const p = paragrafo(r, 'tinham gasto'); p.set_content(p.innerHTML.replace(/\.\s*$/, '; os programas que mais gastaram foram o do Trabalho, Solidariedade e Segurança Social.')); }, /X6 ·/);
  naPagina('o nome de outra função', (r) => { const n = r.querySelector('[data-explicacao-nome="oe-2026-cem-euros-funcao-07"]'); n.set_content('educação'); }, /X6 ·/);
  naPagina('um parágrafo a menos', (r) => { paragrafo(r, 'tinham gasto').remove(); }, /X6 · os parágrafos rendidos/);
  naPagina('o ano trocado no título', (r) => { const h = r.querySelector('h1 [data-nonledger="data-da-linha"]'); h.set_content('2025'); }, /X5 ·/);
  naPagina('o título de uma secção trocado', (r) => { r.querySelector('[data-explicacao-secao="por-funcao"] > h2').set_content('Por programa'); }, /X7 ·/);
  /* As plantas da auditoria: sobre uma cópia em memória do ficheiro. */
  const auditoria = JSON.parse(fs.readFileSync(AUDITORIA, 'utf8'));
  /** @param {string} nome @param {(a: any) => void} estraga @param {RegExp} mordida */
  const naAuditoria = (nome, estraga, mordida) => {
    const a = JSON.parse(JSON.stringify(auditoria));
    estraga(a);
    const q = conferirAuditoriaDasExplicacoes({ auditoria: a, linhas }).erros;
    out.push({ nome, mordeu: q.some((x) => mordida.test(x)), queixa: q.join(' | ') || 'nenhuma' });
  };
  const folhaDiz = (/** @type {any} */ a) => a.explicacoes[0].folhas.find((/** @type {any} */ f) => f.partes.some((/** @type {any} */ p) => p.classe === 'diz' && p.apoios?.some((/** @type {any} */ x) => x.literal)));
  naAuditoria('um literal que não está no campo que cita', (a) => { const p = folhaDiz(a).partes.find((/** @type {any} */ x) => x.classe === 'diz'); p.apoios.find((/** @type {any} */ x) => x.literal).literal = 'uma frase que nenhuma fonte escreveu'; }, /X2 · .* não está no campo/);
  naAuditoria('uma conta fora de um ramo e de uma condição', (a) => { const f = a.explicacoes[0].folhas.find((/** @type {any} */ x) => x.caminho === 'abertura[0][2]'); f.partes[0].classe = 'conta'; delete f.partes[0].apoios; }, /X2 · .* marcada como conta/);
  naAuditoria('uma folha sem auditoria', (a) => { a.explicacoes[0].folhas = a.explicacoes[0].folhas.filter((/** @type {any} */ x) => x.caminho !== 'titulo[0]'); }, /X1 · .* não tem auditoria/);
  naAuditoria('uma ligação com uma palavra que diz alguma coisa', (a) => { const f = a.explicacoes[0].folhas.find((/** @type {any} */ x) => x.caminho === 'abertura[0][14]'); f.partes[0].pt = ' e só '; f.pt = ' e só '; }, /X1 ·|X2 ·/);
  /* A planta das origens: um sha256 de outro ficheiro, com o motor ao lado; sem ele, uma hora fora da forma. */
  const o = JSON.parse(JSON.stringify(ORIGENS_DAS_EXPLICACOES));
  const chave = Object.keys(o)[0];
  if (process.env.RESEARCHHUB_DIR) o[chave].alojada.sha256 = '0'.repeat(64);
  else o[chave].alojada.hora = '2026-10-04 03:55';
  const qo = conferirOrigensDasExplicacoes({ origens: o }).erros;
  out.push({ nome: process.env.RESEARCHHUB_DIR ? 'o sha256 de uma origem trocado (com o motor ao lado)' : 'a hora de uma origem fora da forma', mordeu: qo.some((x) => /X3 ·/.test(x)), queixa: qo.join(' | ') || 'nenhuma' });
  return out;
}

/* =========================================================================
 * A CORRIDA
 * ========================================================================= */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
  const prova = process.argv.includes('--prova');
  const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
  const a = conferirAuditoriaDasExplicacoes();
  const o = conferirOrigensDasExplicacoes();
  /** @type {string[]} */
  const erros = [...a.erros, ...o.erros];
  let paginas = 0;
  for (const e of EXPLICACOES) for (const [lang, base] of /** @type {const} */ ([['pt', 'explicacoes'], ['en', 'en/explainers']])) {
    const f = path.join(DIST, base, e.slug, 'index.html');
    if (!fs.existsSync(f)) { erros.push(`X5 · a página ${base}/${e.slug} não foi construída`); continue; }
    paginas++;
    erros.push(...conferirPaginaDaExplicacao(parse(fs.readFileSync(f, 'utf8')), lang, e.slug).map((x) => `${base}/${e.slug}: ${x}`));
  }
  const plantas = prova ? plantasDaExplicacao(DIST) : [];
  for (const p of plantas) if (!p.mordeu) erros.push(`X · a planta «${p.nome}» não mordeu: ${p.queixa}`);
  const resumo = { auditoria: a.contas, origens: o.contas, paginas, plantas: plantas.map((p) => ({ nome: p.nome, mordeu: p.mordeu })), erros };
  if (json) fs.writeFileSync(json, JSON.stringify(resumo, null, 2) + '\n');
  console.log(`X · a explicação: ${a.contas.explicacoes} explicação(ões), ${a.contas.folhas} folhas e ${a.contas.partes} partes auditadas (${a.contas.diz} diz, ${a.contas.conta} conta, ${a.contas.aponta} aponta, ${a.contas.liga} liga), ${a.contas.origens} origens usadas; ${o.contas.origens} origens das explicações${o.contas.motor ? `, ${o.contas.lidas_no_motor} lidas no motor` : ', sem o motor ao lado'}; ${paginas} página(s) recontadas${prova ? `; ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas em memória` : ''}.`);
  if (erros.length) {
    console.error(`\n  CÉLULA DA EXPLICAÇÃO · ${erros.length} problema(s):\n${erros.map((x) => `  · ${x}`).join('\n')}`);
    process.exit(1);
  }
}
