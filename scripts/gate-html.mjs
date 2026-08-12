#!/usr/bin/env node
/**
 * Portão (a) e (c): varrimento do HTML construído.
 *
 * Corre DEPOIS do astro build, sobre dist/. Falha se encontrar, numa página,
 * texto com algarismos que não venha do livro-razão nem de um contexto
 * declarado. Os limites honestos deste varrimento estão em DECISIONS.md e
 * repetidos no fim deste ficheiro.
 *
 * Quatro origens legítimas para um algarismo numa página:
 *   1. data-claim="<id>"        — veio do livro-razão. O portão confere os
 *                                 algarismos renderizados contra o valor publicado.
 *   2. data-verbatim="<chave>"  — citação transcrita. O portão exige igualdade
 *                                 carácter a carácter com src/data/verbatim.mjs.
 *   3. data-nonledger="<motivo>"— contexto estrutural, com motivo em ledger/allowlist.yml.
 *   4. token/padrão em ledger/allowlist.yml — nomes próprios com algarismos.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse, NodeType } from 'node-html-parser';

import { loadClaims, digitsOf, parsePtNumber } from '../src/lib/ledger.mjs';
import { VERBATIM, normalizeWhitespace } from '../src/data/verbatim.mjs';
import { EDITIONS } from '../src/data/studies.mjs';
import { matchPath } from '../src/lib/routes.mjs';
import { renderizacoesAceites } from '../src/data/correcoes.mjs';
import { SITE_HOST, SITE_NAME, AUTHORSHIP_LINE, EDITION } from '../site.config.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const ALLOWLIST = path.join(ROOT, 'ledger', 'allowlist.yml');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/* ------------------------------------------------------------------ entrada */

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DE HTML — não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const claims = loadClaims();
const allow = load(fs.readFileSync(ALLOWLIST, 'utf8')) ?? {};
const CONTEXTOS = new Set((allow.contexts ?? []).map((c) => c.id));
const TOKENS = (allow.tokens ?? []).map((t) => ({ ...t, scope: t.scope ?? 'any' }));
const PATTERNS = (allow.patterns ?? []).map((p) => ({
  ...p,
  scope: p.scope ?? 'any',
  re: new RegExp(p.pattern),
}));

/**
 * Cadeias estruturais toleradas no <head>: títulos de estudos, nome do sítio,
 * data de edição. No <head> não há markup onde pendurar data-nonledger, por
 * isso a excepção é por cadeia exacta, tirada do registo — não escrita à mão.
 */
const CADEIAS_HEAD = [
  ...EDITIONS.map((e) => e.title),
  SITE_NAME,
  EDITION.display,
  EDITION.iso,
].sort((a, b) => b.length - a.length);

const erros = [];
const avisos = [];
const idsUsados = new Set();
let ficheiros = 0;

/* ------------------------------------------------------------------ auxiliares */

const NOMEADAS = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ',
  thinsp: ' ', hellip: '…', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', middot: '·', times: '×', minus: '−',
  deg: '°', ordm: 'º', ordf: 'ª', euro: '€', copy: '©', shy: '­',
};

function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, g) => {
    try {
      if (g[0] === '#') {
        const code = g[1] === 'x' || g[1] === 'X' ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return m;
        return String.fromCodePoint(code);
      }
      return Object.prototype.hasOwnProperty.call(NOMEADAS, g) ? NOMEADAS[g] : m;
    } catch {
      return m;
    }
  });
}

const PONTUACAO_FORA = /^[\s"'“”‘’«»(\[{,.;:!?/|·—–…]+|[\s"'“”‘’«»)\]},.;:!?/|·—–…]+$/g;

function limpaToken(t) {
  return t.replace(PONTUACAO_FORA, '');
}

function tokenPermitido(token, scope) {
  for (const t of TOKENS) {
    if (t.scope !== 'any' && t.scope !== scope) continue;
    if (t.token === token) return true;
  }
  for (const p of PATTERNS) {
    if (p.scope !== 'any' && p.scope !== scope) continue;
    if (p.re.test(token)) return true;
  }
  return false;
}

function contexto(texto, token) {
  const i = texto.indexOf(token);
  if (i < 0) return '';
  const de = Math.max(0, i - 55);
  const ate = Math.min(texto.length, i + token.length + 55);
  return (de > 0 ? '…' : '') + texto.slice(de, ate).replace(/\s+/g, ' ') + (ate < texto.length ? '…' : '');
}

/** Varre um texto e devolve os tokens com algarismos que não são permitidos. */
function tokensProibidos(texto, scope) {
  const encontrados = [];
  for (const bruto of texto.split(/\s+/)) {
    if (!bruto || !/\d/.test(bruto)) continue;
    const token = limpaToken(bruto);
    if (!token || !/\d/.test(token)) continue;
    if (tokenPermitido(token, scope)) continue;
    encontrados.push(token);
  }
  return encontrados;
}

/**
 * Texto de uma subárvore, com as fronteiras entre elementos marcadas.
 *
 * Sem isto, "…da UE-27" seguido de "PIB per capita…" num elemento vizinho
 * colava num único token "UE-27PIB" e o portão dava um falso positivo.
 */
function textoDe(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) {
      partes.push(n.rawText);
      return;
    }
    for (const filho of n.childNodes ?? []) anda(filho);
  };
  anda(no);
  return partes.join(' ');
}

function ficheirosHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...ficheirosHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------ varrimento */

for (const file of ficheirosHtml(DIST)) {
  ficheiros++;
  const rel = path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html, {
    comment: false,
    blockTextElements: { script: true, style: true, noscript: false },
  });

  const err = (msg) => erros.push({ rel, msg });

  /* --- 1. ilhas de dados do livro-razão, antes de as remover --- */
  for (const el of root.querySelectorAll('script[data-ledger-json]')) {
    let dados;
    try {
      dados = JSON.parse(decodeEntities(el.rawText ?? el.text ?? ''));
    } catch (e) {
      err(`ilha de dados data-ledger-json com JSON inválido: ${e.message}`);
      continue;
    }
    /**
     * Convenção das ilhas de dados — tudo o que lá está tem origem declarada:
     *   <x>            número  → tem de existir <x>_claim, e o valor bate certo
     *   <x>_texto      cadeia  → tem de ser IGUAL ao value publicado dessa afirmação
     *   <x>_ref        cadeia  → tem de ser IGUAL ao reference_date dessa afirmação
     *   <x>_claim      cadeia  → o id
     *   estrutura      objecto → geometria e escala do instrumento, dispensadas
     *                            da regra mediante "estrutura_motivo" declarado
     *   qualquer outra cadeia   → sem algarismos (fora os tokens da lista)
     */
    const raiz = { ...dados };
    if ('estrutura' in raiz) {
      const motivo = raiz.estrutura_motivo;
      if (!motivo || !CONTEXTOS.has(motivo)) {
        err(
          `ilha de dados: tem "estrutura" mas não declara um "estrutura_motivo" válido. ` +
            `Motivos aceites: ${[...CONTEXTOS].join(', ')}.`,
        );
      } else {
        delete raiz.estrutura;
        delete raiz.estrutura_motivo;
      }
    }

    const resolve = (no, base, aqui) => {
      const id = no[`${base}_claim`];
      if (!id) {
        err(`ilha de dados: "${aqui}" não tem o "${base}_claim" que declara a sua origem.`);
        return null;
      }
      idsUsados.add(id);
      const claim = claims.get(id);
      if (!claim) {
        err(`ilha de dados: "${aqui}" aponta para a afirmação "${id}", que não existe.`);
        return null;
      }
      return claim;
    };

    const visita = (no, caminho) => {
      if (Array.isArray(no)) return no.forEach((v, i) => visita(v, `${caminho}[${i}]`));
      if (!no || typeof no !== 'object') return;
      for (const [k, v] of Object.entries(no)) {
        const aqui = caminho ? `${caminho}.${k}` : k;

        if (typeof v === 'number') {
          const claim = resolve(no, k, aqui);
          if (!claim) continue;
          const esperado = parsePtNumber(claim.value);
          if (esperado === null || Math.abs(esperado - v) > 1e-9) {
            err(`ilha de dados: "${aqui}" tem ${v}, mas o livro-razão diz "${claim.value}".`);
          }
          continue;
        }

        if (typeof v === 'string') {
          if (k.endsWith('_claim')) continue;
          if (k.endsWith('_texto')) {
            const claim = resolve(no, k.slice(0, -'_texto'.length), aqui);
            if (claim && String(claim.value) !== v) {
              err(`ilha de dados: "${aqui}" é "${v}", mas o valor publicado é "${claim.value}".`);
            }
            continue;
          }
          if (k.endsWith('_ref')) {
            const claim = resolve(no, k.slice(0, -'_ref'.length), aqui);
            if (claim && String(claim.reference_date) !== v) {
              err(
                `ilha de dados: "${aqui}" é "${v}", mas o reference_date da afirmação é "${claim.reference_date}".`,
              );
            }
            continue;
          }
          for (const token of tokensProibidos(v, 'body')) {
            err(
              `ilha de dados: a cadeia em "${aqui}" tem o token "${token}", com algarismos e sem origem. ` +
                `As frases compõem-se no HTML, a partir de <Claim/>; as ilhas levam só valores do livro-razão.`,
            );
          }
          continue;
        }

        visita(v, aqui);
      }
    };
    visita(raiz, '');
  }

  /* --- 2. <head>: título e descrição --- */
  const titulo = root.querySelector('head title');
  const descricao = root.querySelector('head meta[name="description"]');
  let textoHead = '';
  if (titulo) textoHead += ' ' + decodeEntities(titulo.text);
  if (descricao) textoHead += ' ' + decodeEntities(descricao.getAttribute('content') ?? '');
  for (const cadeia of CADEIAS_HEAD) textoHead = textoHead.split(cadeia).join(' ');
  for (const token of tokensProibidos(textoHead, 'head')) {
    err(
      `<head>: o token "${token}" tem algarismos e não é nem um título de estudo ` +
        `registado nem uma excepção declarada.\n      contexto: ${contexto(textoHead, token)}`,
    );
  }

  /* --- 3. invariantes de identidade --- */
  const canonical = root.querySelector('head link[rel="canonical"]');
  if (!canonical) err('falta <link rel="canonical">.');
  else {
    const href = canonical.getAttribute('href') ?? '';
    if (!href.startsWith(`https://${SITE_HOST}/`) && href !== `https://${SITE_HOST}`) {
      err(`o canonical não está no domínio canónico: "${href}" (esperado https://${SITE_HOST}/…).`);
    }
  }
  if (!html.includes(AUTHORSHIP_LINE)) {
    err(`falta a linha de autoria no rodapé: "${AUTHORSHIP_LINE}".`);
  }

  /* Páginas de destino de estudo não se oferecem à indexação enquanto não
     tiverem conteúdo; as outras não podem ganhar noindex por descuido. */
  const caminho = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const rota = matchPath(caminho);
  const robots = root.querySelector('head meta[name="robots"]');
  const temNoindex = (robots?.getAttribute('content') ?? '').includes('noindex');
  if (rota?.key === 'estudo' && !temNoindex) {
    err('página de destino de estudo sem <meta name="robots" content="noindex">.');
  }
  if (rota && rota.key !== 'estudo' && temNoindex) {
    err(`esta página tem noindex e não devia: a rota "${rota.key}" é para ser indexada.`);
  }

  /* --- 4. corpo: retirar o que é legítimo, e ver o que sobra --- */
  const body = root.querySelector('body') ?? root;
  for (const el of body.querySelectorAll('script, style')) el.remove();

  const aRemover = [];

  for (const el of body.querySelectorAll('[data-claim]')) {
    const id = el.getAttribute('data-claim');
    idsUsados.add(id);
    const claim = claims.get(id);
    if (!claim) {
      err(
        `a página cita a afirmação "${id}", que não existe no livro-razão. ` +
          `Crie ledger/claims/${id}.yml ou corrija o id.`,
      );
      aRemover.push(el);
      continue;
    }
    const renderizado = decodeEntities(textoDe(el));
    if (digitsOf(renderizado) !== digitsOf(claim.value)) {
      err(
        `a afirmação "${id}" foi renderizada como "${renderizado.trim()}" mas o ` +
          `livro-razão diz "${claim.value}".`,
      );
    }
    aRemover.push(el);
  }

  /**
   * O registo de correções.
   *
   * Nada aqui é excepção: cada pedaço — data, valor antigo, valor novo, motivo
   * e id da afirmação — é conferido contra o campo corrections da própria
   * afirmação. O motivo é prosa livre e pode citar números («o valor 4 vinha
   * do colofão…»); por isso é comparado por igualdade de texto, não dispensado.
   * Reescrever a história de uma correção falha o build.
   */
  const CAMPOS_CORRECAO = {
    date: 'exacto',
    kind: 'natureza',
    old_value: 'algarismos',
    new_value: 'algarismos',
    reason: 'exacto',
    id: 'exacto',
  };
  for (const el of body.querySelectorAll('[data-correcao-claim]')) {
    const id = el.getAttribute('data-correcao-claim');
    const n = Number(el.getAttribute('data-correcao-n'));
    const campo = el.getAttribute('data-correcao-campo');
    aRemover.push(el);

    const modo = CAMPOS_CORRECAO[campo];
    if (!modo) {
      err(
        `data-correcao-campo="${campo}" não existe. ` +
          `Aceites: ${Object.keys(CAMPOS_CORRECAO).join(', ')}.`,
      );
      continue;
    }
    const claim = claims.get(id);
    if (!claim) {
      err(`o registo de correções cita a afirmação "${id}", que não existe no livro-razão.`);
      continue;
    }
    idsUsados.add(id);

    const renderizado = decodeEntities(textoDe(el));
    if (campo === 'id') {
      if (normalizeWhitespace(renderizado) !== String(claim.id)) {
        err(`no registo de correções, o id foi renderizado como "${renderizado.trim()}" mas a afirmação é "${claim.id}".`);
      }
      continue;
    }

    const corr = (claim.corrections ?? [])[n];
    if (!corr) {
      err(`o registo de correções cita a correção #${n + 1} de "${id}", que não existe.`);
      continue;
    }
    const esperado = String(corr[campo]);

    /* A natureza da entrada pode aparecer como identificador ou como um dos
       seus rótulos traduzidos — e mais nada. Uma entrada rotulada
       «atualização» com kind "correcao" no livro-razão não passa: era assim
       que se reclassificava uma confissão em silêncio. */
    if (modo === 'natureza') {
      const aceites = renderizacoesAceites(esperado).map(normalizeWhitespace);
      if (!aceites.includes(normalizeWhitespace(renderizado))) {
        err(
          `no registo, a natureza da correção #${n + 1} de "${id}" foi renderizada como ` +
            `"${renderizado.trim()}", mas no livro-razão é "${esperado}" ` +
            `(aceite: ${aceites.join(', ')}).`,
        );
      }
      continue;
    }

    const bate =
      modo === 'algarismos'
        ? digitsOf(renderizado) === digitsOf(esperado)
        : normalizeWhitespace(renderizado) === normalizeWhitespace(esperado);
    if (!bate) {
      err(
        `no registo de correções, "${campo}" de "${id}" foi renderizado como ` +
          `"${renderizado.trim().slice(0, 120)}" mas o livro-razão diz ` +
          `"${esperado.slice(0, 120)}".`,
      );
    }
  }

  for (const el of body.querySelectorAll('[data-verbatim]')) {
    const chave = el.getAttribute('data-verbatim');
    const registado = VERBATIM[chave];
    if (!registado) {
      err(`data-verbatim="${chave}" não corresponde a nenhuma citação em src/data/verbatim.mjs.`);
      aRemover.push(el);
      continue;
    }
    const renderizado = normalizeWhitespace(decodeEntities(textoDe(el)));
    const esperado = normalizeWhitespace(registado.text);
    if (renderizado !== esperado) {
      err(
        `a citação "${chave}" não foi transcrita fielmente.\n` +
          `      registado:   ${esperado.slice(0, 120)}…\n` +
          `      renderizado: ${renderizado.slice(0, 120)}…`,
      );
    }
    aRemover.push(el);
  }

  for (const el of body.querySelectorAll('[data-nonledger]')) {
    const motivo = el.getAttribute('data-nonledger');
    if (!CONTEXTOS.has(motivo)) {
      err(
        `data-nonledger="${motivo}" não é um motivo declarado. ` +
          `Motivos aceites: ${[...CONTEXTOS].join(', ')} (ver ledger/allowlist.yml).`,
      );
    }
    aRemover.push(el);
  }

  for (const el of aRemover) {
    try {
      el.remove();
    } catch {
      /* já removido com um antepassado */
    }
  }

  const textoCorpo = decodeEntities(textoDe(body));
  for (const token of tokensProibidos(textoCorpo, 'body')) {
    err(
      `algarismos fora do livro-razão: "${token}"\n` +
        `      contexto: ${contexto(textoCorpo, token)}\n` +
        `      Se é uma medição, faça dela uma linha do livro-razão e cite-a com <Claim id="…"/>.\n` +
        `      Se é estrutura (data, título, escala), embrulhe-a em data-nonledger="…".`,
    );
  }
}

/* ------------------------------------------------------------------ relatório */

for (const [id] of claims) {
  if (!idsUsados.has(id)) {
    avisos.push(`a afirmação "${id}" está no livro-razão mas nenhuma página a cita.`);
  }
}

console.log('');
console.log(cinza(`  portão de HTML · ${ficheiros} páginas · ${idsUsados.size}/${claims.size} afirmações citadas`));

if (avisos.length) {
  console.log('');
  console.log(amarelo(`  ${avisos.length} aviso(s):`));
  for (const a of avisos) console.log(cinza('    · ' + a));
}

if (erros.length) {
  console.log('');
  console.error(vermelho(`  O PORTÃO DE HTML FECHOU — ${erros.length} erro(s):`));
  const porFicheiro = new Map();
  for (const e of erros) {
    if (!porFicheiro.has(e.rel)) porFicheiro.set(e.rel, []);
    porFicheiro.get(e.rel).push(e.msg);
  }
  for (const [rel, msgs] of porFicheiro) {
    console.error('');
    console.error('  ' + vermelho(rel));
    for (const m of msgs) console.error('    ' + vermelho('✗') + ' ' + m);
  }
  console.error('');
  process.exit(1);
}

console.log('');
console.log('  ' + verde('✓') + ' nenhum algarismo sem proveniência nas páginas construídas.');
console.log('');

/* =============================================================================
 * LIMITES DESTE VARRIMENTO — ler antes de confiar nele.
 *
 * 1. Só vê texto. Números dentro de <script> e <style> não são varridos, com
 *    uma excepção: as ilhas <script data-ledger-json>, essas são conferidas
 *    valor a valor contra o livro-razão.
 * 2. Não vê atributos (title, alt, aria-label, conteúdo gerado por CSS).
 * 3. As coordenadas da CAOP são dados geométricos, não afirmações: a sua
 *    proveniência é a citação transcrita, não uma linha do livro-razão.
 * 4. data-nonledger é uma afirmação de confiança de quem escreve o gabarito.
 *    O portão confere que o motivo é um dos declarados; não confere que o
 *    número lá dentro seja mesmo estrutural. É por isso que a lista de motivos
 *    é curta e cada um tem de justificar-se em ledger/allowlist.yml.
 * 5. Um número escrito por extenso ("vinte e seis por cento") passa incólume.
 * ========================================================================== */
