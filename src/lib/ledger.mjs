/**
 * O livro-razão.
 *
 * Carrega ledger/claims/*.yml, valida cada linha e serve as afirmações às
 * páginas. É o único sítio de onde um número pode entrar numa página.
 *
 * Regras que este módulo faz cumprir:
 *   1. o nome do ficheiro é o id;
 *   2. nenhum campo obrigatório em falta;
 *   3. uma linha derivada declara de onde deriva e explica a aritmética;
 *   4. uma expressão `check:` é reavaliada no build e tem de dar o valor publicado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

import { STUDY_IDS, COUNTS } from '../data/studies.mjs';
import { KINDS } from '../data/correcoes.mjs';

/**
 * Onde está o livro-razão.
 *
 * Não pode ser um caminho relativo a este ficheiro: no build, este módulo é
 * empacotado para dist/.prerender/chunks/ e o caminho relativo passaria a
 * apontar para dentro de dist/. Procura-se a subir, primeiro a partir do
 * directório de trabalho e depois a partir do próprio ficheiro.
 */
function encontraLivroRazao() {
  const candidatos = [];
  if (process.env.OEDP_LEDGER_DIR) candidatos.push(process.env.OEDP_LEDGER_DIR);

  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'ledger', 'claims'));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };

  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));

  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  throw new Error(
    'livro-razão: não encontrei ledger/claims a partir de ' +
      process.cwd() +
      '. Corra os comandos a partir da raiz do projecto, ou defina OEDP_LEDGER_DIR.',
  );
}

export const LEDGER_DIR = encontraLivroRazao();

/** Marcador de campo por verificar. É aceite; inventar um valor não é. */
export const POR_VERIFICAR = '[a verificar]';

const CAMPOS = [
  'id',
  'value',
  'unit',
  'source',
  'document',
  'source_url',
  'access_date',
  'reference_date',
  'excerpt',
  'derivation',
  'derived_from',
  'check',
  'study',
  'note',
  'corrections',
];

/** Campos de proveniência que só podem ser null numa linha derivada. */
const CAMPOS_PROVENIENCIA = ['source', 'document', 'source_url', 'access_date', 'excerpt'];

/**
 * Os campos de uma entrada do registo de correções. Todos obrigatórios.
 * A lista fechada apanha erros de escrita nas chaves — um "reason-en" em vez
 * de "reason_en" passaria despercebido e a edição inglesa ficaria sem motivo.
 */
const CAMPOS_CORRECAO = ['date', 'kind', 'old_value', 'new_value', 'reason', 'reason_en'];

let _cache = null;

/** Carrega e devolve Map<id, claim>. Lança se o YAML estiver partido. */
export function loadClaims() {
  if (_cache) return _cache;
  const map = new Map();
  let files = [];
  try {
    files = fs.readdirSync(LEDGER_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  } catch (err) {
    throw new Error(`livro-razão: não foi possível ler ${LEDGER_DIR}: ${err.message}`);
  }
  files.sort();
  for (const file of files) {
    const full = path.join(LEDGER_DIR, file);
    let doc;
    try {
      doc = load(fs.readFileSync(full, 'utf8'));
    } catch (err) {
      throw new Error(`livro-razão: YAML inválido em ${file}: ${err.message}`);
    }
    if (!doc || typeof doc !== 'object') {
      throw new Error(`livro-razão: ${file} não contém um mapa YAML.`);
    }
    doc.__file = file;
    if (map.has(doc.id)) {
      throw new Error(`livro-razão: id repetido "${doc.id}" (${file} e ${map.get(doc.id).__file}).`);
    }
    map.set(doc.id, doc);
  }
  _cache = map;
  return map;
}

/** Uma afirmação, pelo id. Lança — em build — se não existir. Este é o portão (a). */
export function getClaim(id) {
  const claims = loadClaims();
  const claim = claims.get(id);
  if (!claim) {
    const parecidos = [...claims.keys()]
      .filter((k) => k.includes(String(id).split('-')[0] ?? ''))
      .slice(0, 5);
    throw new Error(
      `livro-razão: a afirmação "${id}" não existe.\n` +
        `  Nenhuma página pode citar um número que não esteja no livro-razão.\n` +
        `  Crie ledger/claims/${id}.yml ou corrija o id.` +
        (parecidos.length ? `\n  Ids parecidos: ${parecidos.join(', ')}` : ''),
    );
  }
  return claim;
}

export function hasClaim(id) {
  return loadClaims().has(id);
}

/* ------------------------------------------------------------------ números */

/**
 * Lê um valor com formatação portuguesa e devolve um número.
 * "82" -> 82 · "26,5%" -> 26.5 · "77,2" -> 77.2 · "−34 100" -> -34100
 * Devolve null quando não é um número simples (e então `check` não é possível).
 */
export function parsePtNumber(value) {
  if (typeof value !== 'string') return null;
  let s = value.trim();
  s = s.replace(/−/g, '-'); // sinal de menos tipográfico
  s = s.replace(/[    \s]/g, ''); // espaços de milhares
  s = s.replace(/%$/, '').replace(/×$/, '');
  if (!/^-?[\d.,]+$/.test(s)) return null;
  const temVirgula = s.includes(',');
  const temPonto = s.includes('.');
  if (temVirgula && temPonto) s = s.replace(/\./g, '').replace(',', '.');
  else if (temVirgula) s = s.replace(',', '.');
  else if (temPonto && /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Só os algarismos de um texto — usado para comparar o que foi renderizado com o livro-razão. */
export function digitsOf(s) {
  return String(s).replace(/\D+/g, '');
}

/* --------------------------------------------------- avaliação de `check:` */

/**
 * Avalia uma expressão de verificação.
 * Aceita: números, ids de afirmações, nomes de contagens, + - * / e parênteses.
 * Os operadores e os parênteses TÊM de estar separados por espaços — os ids
 * contêm hífenes, e sem essa regra "a - b" seria ambíguo.
 */
export function evaluateCheck(expr, { claims, env = COUNTS, selfId = null } = {}) {
  const bruto = String(expr).replace(/([()])/g, ' $1 ');
  const tokens = bruto.split(/\s+/).filter(Boolean);
  let i = 0;

  const peek = () => tokens[i];
  const next = () => tokens[i++];

  function valorDe(token) {
    if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
    if (Object.prototype.hasOwnProperty.call(env, token)) return Number(env[token]);
    if (token === selfId) {
      throw new Error(`a expressão check refere-se a si própria ("${token}")`);
    }
    const claim = claims.get(token);
    if (!claim) throw new Error(`a expressão check refere "${token}", que não existe no livro-razão`);
    const n = parsePtNumber(claim.value);
    if (n === null) {
      throw new Error(`a expressão check refere "${token}", cujo valor "${claim.value}" não é um número simples`);
    }
    return n;
  }

  function primary() {
    const t = next();
    if (t === undefined) throw new Error('expressão check truncada');
    if (t === '(') {
      const v = expression();
      if (next() !== ')') throw new Error('falta um ) na expressão check');
      return v;
    }
    if (t === '-') return -primary();
    return valorDe(t);
  }

  function term() {
    let v = primary();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const r = primary();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }

  function expression() {
    let v = term();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }

  const resultado = expression();
  if (i !== tokens.length) {
    throw new Error(`a expressão check tem lixo depois do fim: "${tokens.slice(i).join(' ')}"`);
  }
  return resultado;
}

/**
 * Contagens do próprio registo de correções, para as expressões `check`.
 * Só as correções contam para `correcoes_publicadas`: uma actualização não é
 * um erro admitido, e o número que a página anuncia é o das confissões.
 */
export function contagensDoRegisto(claims = loadClaims()) {
  let correcoes = 0;
  let actualizacoes = 0;
  for (const c of claims.values()) {
    for (const corr of c.corrections ?? []) {
      if (corr.kind === 'correcao') correcoes++;
      else if (corr.kind === 'actualizacao') actualizacoes++;
    }
  }
  return { correcoes_publicadas: correcoes, actualizacoes_publicadas: actualizacoes };
}

/**
 * O motivo de uma entrada do registo, na língua de uma edição.
 *
 * O motivo é prosa da casa e existe nas duas línguas: português em `reason`,
 * inglês em `reason_en`. **Não há recurso à outra língua.** Uma edição inglesa
 * a mostrar o motivo português é exactamente o buraco que o campo `reason_en`
 * veio fechar — e o validador exige os dois campos, por isso um `null` aqui
 * significa que o livro-razão não passou.
 */
export function motivoDaEntrada(corr, lang) {
  if (!corr) return null;
  if (lang === 'en') return corr.reason_en ?? null;
  if (lang === 'pt') return corr.reason ?? null;
  return null;
}

/**
 * Todas as entradas do registo, de todas as afirmações, da mais recente à
 * primeira. É daqui que a página do método lê — nunca de texto escrito à mão.
 */
export function entradasDoRegisto(kind = null) {
  const out = [];
  for (const claim of allClaims()) {
    (claim.corrections ?? []).forEach((corr, n) => {
      if (kind && corr.kind !== kind) return;
      out.push({ claimId: claim.id, n, ...corr });
    });
  }
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/* -------------------------------------------------------------- validação */

function ausente(v) {
  return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
}

/**
 * Valida o livro-razão inteiro.
 * Devolve { errors: string[], warnings: string[], stats }.
 */
export function validateLedger() {
  const claims = loadClaims();
  // As expressões `check` também podem contar o próprio registo de correções.
  const env = { ...COUNTS, ...contagensDoRegisto(claims) };
  const errors = [];
  const warnings = [];
  let porVerificar = 0;
  let derivadas = 0;
  let verificadas = 0;

  if (claims.size === 0) errors.push('livro-razão: não há nenhuma afirmação em ledger/claims/.');

  for (const [id, c] of claims) {
    const onde = `[${c.__file}]`;

    // 1 — nome do ficheiro é o id
    const esperado = String(id) + '.yml';
    if (c.__file !== esperado) {
      errors.push(`${onde} o nome do ficheiro tem de ser o id: esperado "${esperado}".`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(id))) {
      errors.push(`${onde} id inválido "${id}": só minúsculas, algarismos e hífenes.`);
    }

    // 2 — campos desconhecidos (apanha erros de escrita nas chaves)
    for (const k of Object.keys(c)) {
      if (k === '__file') continue;
      if (!CAMPOS.includes(k)) errors.push(`${onde} campo desconhecido "${k}".`);
    }

    // 3 — valor e unidade
    if (typeof c.value !== 'string' || c.value.trim() === '') {
      errors.push(`${onde} "value" tem de ser uma string não vazia, com o valor tal como publicado.`);
    } else if (!/\d/.test(c.value)) {
      errors.push(`${onde} "value" ("${c.value}") não contém nenhum algarismo.`);
    }
    if (ausente(c.unit)) errors.push(`${onde} falta "unit".`);

    // 4 — proveniência
    const derivada = Array.isArray(c.derived_from) && c.derived_from.length > 0;
    if (derivada) derivadas++;
    if (!Array.isArray(c.derived_from)) {
      errors.push(`${onde} "derived_from" tem de ser uma lista (use [] quando não deriva de nada).`);
    }
    for (const dep of c.derived_from ?? []) {
      if (!claims.has(dep)) {
        errors.push(`${onde} "derived_from" aponta para "${dep}", que não existe no livro-razão.`);
      }
    }
    if (derivada && ausente(c.derivation)) {
      errors.push(`${onde} deriva de outras linhas mas não explica a aritmética em "derivation".`);
    }
    for (const campo of CAMPOS_PROVENIENCIA) {
      const v = c[campo];
      if (derivada && v === null) continue; // legítimo: a proveniência é a das origens
      if (campo === 'document') {
        if (v === null || typeof v !== 'object') {
          errors.push(`${onde} falta "document" (precisa de title e edition).`);
        } else {
          if (ausente(v.title)) errors.push(`${onde} falta "document.title".`);
          if (ausente(v.edition)) errors.push(`${onde} falta "document.edition".`);
          if (v.title === POR_VERIFICAR) porVerificar++;
          if (v.edition === POR_VERIFICAR) porVerificar++;
        }
        continue;
      }
      if (ausente(v)) {
        errors.push(
          `${onde} falta "${campo}". Se não é conhecido, escreva "${POR_VERIFICAR}" — nunca um valor plausível.`,
        );
      } else if (v === POR_VERIFICAR) {
        porVerificar++;
      }
    }

    // 5 — estudo
    if (ausente(c.study)) errors.push(`${onde} falta "study".`);
    else if (!STUDY_IDS.has(c.study)) {
      errors.push(
        `${onde} "study" é "${c.study}", que não consta de src/data/studies.mjs.\n` +
          `    Estudos aceites: ${[...STUDY_IDS].join(', ')}`,
      );
    }

    // 6 — correcções
    if (!Array.isArray(c.corrections)) {
      errors.push(`${onde} "corrections" tem de ser uma lista (use [] quando não há correcções).`);
    } else {
      c.corrections.forEach((corr, n) => {
        const rot = `${onde} correcção #${n + 1}`;
        if (!corr || typeof corr !== 'object') {
          errors.push(`${rot}: tem de ser um mapa com date, kind, old_value, new_value, reason e reason_en.`);
          return;
        }
        for (const k of Object.keys(corr)) {
          if (!CAMPOS_CORRECAO.includes(k)) {
            errors.push(
              `${rot}: campo desconhecido "${k}". Aceites: ${CAMPOS_CORRECAO.join(', ')}.`,
            );
          }
        }
        for (const campo of ['date', 'kind', 'old_value', 'new_value', 'reason']) {
          if (ausente(corr[campo])) errors.push(`${rot}: falta "${campo}".`);
        }
        /* O motivo tem de existir nas duas línguas. A edição inglesa mostra
           "reason_en"; sem ele, mostraria o motivo em português — que foi o
           buraco que este campo veio fechar. Não há tradução automática nem
           recurso à outra língua: ou está escrito, ou o build pára. */
        if (ausente(corr.reason_en)) {
          errors.push(
            `${rot}: falta "reason_en". O motivo tem de estar escrito nas duas línguas — ` +
              `"reason" em português, "reason_en" em inglês. A edição inglesa mostra o segundo.`,
          );
        }
        if (!ausente(corr.kind) && !KINDS.includes(corr.kind)) {
          errors.push(
            `${rot}: "kind" é "${corr.kind}". Só pode ser ${KINDS.map((k) => `"${k}"`).join(' ou ')}.\n` +
              `    "correcao" = o valor publicado estava errado. "actualizacao" = estava certo e o que mede mudou.`,
          );
        }
        if (corr.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(corr.date))) {
          errors.push(`${rot}: "date" tem de ser AAAA-MM-DD.`);
        }
      });
    }

    // 7 — datas
    for (const campo of ['access_date', 'reference_date']) {
      const v = c[campo];
      if (v === null || v === undefined || v === POR_VERIFICAR) continue;
      if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(String(v))) {
        errors.push(`${onde} "${campo}" = "${v}": use AAAA, AAAA-MM, AAAA-MM-DD ou "${POR_VERIFICAR}".`);
      }
    }

    // 8 — reavaliação da aritmética
    if (!ausente(c.check)) {
      const publicado = parsePtNumber(c.value);
      if (publicado === null) {
        errors.push(`${onde} tem "check" mas "value" ("${c.value}") não é um número simples.`);
      } else {
        try {
          const calculado = evaluateCheck(c.check, { claims, env, selfId: id });
          if (Math.abs(calculado - publicado) > 1e-9) {
            errors.push(
              `${onde} a aritmética não bate certo.\n` +
                `    check: ${c.check}\n` +
                `    calculado: ${calculado}\n` +
                `    publicado: ${c.value} (${publicado})`,
            );
          } else {
            verificadas++;
          }
        } catch (err) {
          errors.push(`${onde} "check" inválido: ${err.message}`);
        }
      }
    } else if (derivada) {
      warnings.push(
        `${onde} é derivada mas não traz uma expressão "check". A aritmética não é reavaliada no build.`,
      );
    }
  }

  return {
    errors,
    warnings,
    stats: {
      total: claims.size,
      derivadas,
      verificadas,
      porVerificar,
    },
  };
}

/** Todas as afirmações, ordenadas por id. */
export function allClaims() {
  return [...loadClaims().values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
}
