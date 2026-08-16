#!/usr/bin/env node
/**
 * A ortografia da superfície pública: uma lista, dois sentidos, uma conferência.
 *
 * A regra está em IDENTIDADE.md §9 e a decisão em DECISIONS.md §1.38: a
 * superfície pública segue o Acordo Ortográfico de 1990 tal como é aplicado em
 * Portugal. Esta ferramenta é o mecanismo, e é reversível de propósito: se a
 * direcção preferir a grafia anterior, isso é uma nova corrida e não uma nova
 * escrita.
 *
 * USO
 *   node scripts/ortografia.mjs                        confere (o mesmo que --verificar)
 *   node scripts/ortografia.mjs --verificar
 *   node scripts/ortografia.mjs --aplicar --sentido=acordo
 *   node scripts/ortografia.mjs --aplicar --sentido=anterior
 *   node scripts/ortografia.mjs --verificar --silencioso     só as contas
 *
 * O QUE VARRE, E SÓ ISSO
 *   src/i18n/strings.mjs · src/**\/*.astro · src/data/*.mjs (menos verbatim.mjs)
 *   ledger/claims/*.yml, e aí só a prosa da casa: derivation, note,
 *   source_flag_note, unit e o reason de cada correcção.
 *
 * O QUE NÃO VARRE, E PORQUÊ
 *   · Comentários e nomes de código. Um comentário não chega ao leitor, e um
 *     identificador não é prosa: a ferramenta lê cadeias e texto de gabarito, e
 *     mais nada. É por isso que «data-de-actualizacao» ou «porta-correccoes»
 *     não são tocados por aqui: mudam-se à mão, quando se decide mudá-los.
 *   · O que é transcrito. src/data/verbatim.mjs inteiro; os campos `title`,
 *     `titulo`, `origem` e `onde` dos dados; e, nos gabaritos, tudo o que esteja
 *     dentro de um elemento marcado data-verbatim, data-linha-campo,
 *     data-nonledger="titulo-de-estudo", <blockquote>, <q> ou <cite>. Um
 *     título publicado com travessão a sério continua com ele.
 *   · Os campos do livro-razão que o portão compara carácter a carácter contra
 *     a fonte (excerpt, document.*, source, attributed_to, …). Convertê-los era
 *     reescrever a prova.
 *   · Os documentos do repositório. São registo, e ficam na grafia em que foram
 *     escritos (IDENTIDADE.md §9).
 *
 * UMA PALAVRA COM HÍFEN É UMA PALAVRA SÓ
 *   «mun-tecto-rot» não é «tecto», e «data-de-actualizacao» não é
 *   «actualizacao»: para efeito de procura, o hífen liga em vez de separar. É o
 *   que impede a ferramenta de reescrever nomes de classe e de rota. O custo é
 *   que um composto a sério («Direcção-Geral») precisa de entrada própria na
 *   lista, e é por isso que ela lá está.
 *
 * O QUE NÃO SE CONVERTE POR MÁQUINA
 *   · Os travessões. Cada um pede uma frase nova, e uma frase nova é escolha de
 *     quem escreve. A ferramenta lista-os com ficheiro e linha.
 *   · A lista `manuais` de ortografia/formas.yml: trocas cujo sentido inverso é
 *     ambíguo (de «para» não se sabe se veio de «pára»). Assinalam-se.
 *
 * `note` NÃO É PUBLICADA (ledger/README.md), e por isso o que lá se encontra é
 * aviso e não erro. As palavras convertem-se na mesma, para que o repositório
 * tenha uma grafia só; os travessões ficam, porque reescrever à mão texto que
 * ninguém lê é trabalho sem leitor.
 *
 * SAI COM CÓDIGO 1 quando encontra alguma coisa fora do restante registado. O
 * restante são as linhas cruzadas: os seus bytes estão presos por
 * ledger/cruzamentos/*.json e uma edição deste lado pára o build. Convertem-se
 * na origem, no motor.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { load } from 'js-yaml';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const RAIZ = path.resolve(AQUI, '..');
export const FICHEIRO_FORMAS = path.join(RAIZ, 'ortografia', 'formas.yml');

export const TRAVESSAO = '—';
export const MEIO_TRACO = '–';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/* ============================================================ a lista ===== */

/** Uma entrada da lista, normalizada. */
function normalizaPar(e, onde) {
  if (!e || typeof e !== 'object' || !e.anterior || !e.acordo) {
    throw new Error(`ortografia/formas.yml: entrada sem "anterior" e "acordo" em ${onde}.`);
  }
  return {
    anterior: String(e.anterior),
    acordo: String(e.acordo),
    caso: e.caso === 'fixo' ? 'fixo' : 'preserva',
    guarda: e.guarda ?? null,
    fonte: e.fonte ?? null,
    nota: e.nota ?? null,
  };
}

/**
 * A lista, lida do ficheiro. Recusa uma palavra que esteja ao mesmo tempo em
 * `pares` e em `iguais`: é assim que a lista `iguais` prende alguma coisa em vez
 * de ser um comentário.
 */
export function carregaFormas(ficheiro = FICHEIRO_FORMAS) {
  const cru = load(fs.readFileSync(ficheiro, 'utf8')) ?? {};
  const pares = (cru.pares ?? []).map((e, i) => normalizaPar(e, `pares[${i}]`));
  const manuais = (cru.manuais ?? []).map((e, i) => normalizaPar(e, `manuais[${i}]`));
  const iguais = (cru.iguais ?? []).map((e) =>
    typeof e === 'string' ? { palavra: e, fonte: null, nota: null } : { palavra: String(e.palavra), fonte: e.fonte ?? null, nota: e.nota ?? null },
  );

  const conjIguais = new Set(iguais.map((i) => i.palavra.toLowerCase()));
  const vistos = new Map();
  for (const p of [...pares, ...manuais]) {
    if (conjIguais.has(p.anterior.toLowerCase())) {
      throw new Error(
        `ortografia/formas.yml: "${p.anterior}" está em "pares" e em "iguais" ao mesmo tempo. ` +
          `Uma palavra ou é anterior ao Acordo ou é a forma certa; não pode ser as duas.`,
      );
    }
    if (vistos.has(p.anterior)) {
      throw new Error(`ortografia/formas.yml: "${p.anterior}" aparece duas vezes.`);
    }
    vistos.set(p.anterior, p);
    if (p.anterior === p.acordo) {
      throw new Error(`ortografia/formas.yml: "${p.anterior}" converte-se em si própria.`);
    }
  }
  return { autoridade: cru.autoridade ?? {}, pares, manuais, iguais };
}

/* ======================================================= o comparador ===== */

const escapa = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Os caracteres que continuam uma palavra. O hífen liga; o ponto separa. */
const CONTINUA = "A-Za-zÀ-ÖØ-öø-ÿ0-9_'’\\-";

function variantes(par) {
  if (par.caso === 'fixo') return [[par.anterior, par.acordo]];
  const cap = (s) => s.charAt(0).toLocaleUpperCase('pt-PT') + s.slice(1);
  const alta = (s) => s.toLocaleUpperCase('pt-PT');
  const saida = [[par.anterior, par.acordo]];
  if (cap(par.anterior) !== par.anterior) saida.push([cap(par.anterior), cap(par.acordo)]);
  if (alta(par.anterior) !== par.anterior && alta(par.anterior) !== cap(par.anterior)) {
    saida.push([alta(par.anterior), alta(par.acordo)]);
  }
  return saida;
}

/**
 * Um comparador para um sentido.
 *
 * `sentido: 'acordo'` procura as formas anteriores; `'anterior'` procura as do
 * Acordo. As entradas de `manuais` entram sempre em modo de aviso: encontram-se,
 * não se trocam.
 */
export function comparador(formas, sentido = 'acordo', { comManuais = true } = {}) {
  const troca = new Map();
  const guarda = new Map();
  const soAssinala = new Set();

  const junta = (par, assinala) => {
    for (const [de, para] of variantes(par)) {
      const [a, b] = sentido === 'acordo' ? [de, para] : [para, de];
      if (troca.has(a)) continue;
      troca.set(a, b);
      if (par.guarda) guarda.set(a, par.guarda);
      if (assinala) soAssinala.add(a);
    }
  };

  for (const p of formas.pares) junta(p, false);
  if (comManuais) for (const p of formas.manuais) junta(p, true);

  const alternativas = [...troca.keys()].sort((a, b) => b.length - a.length).map(escapa);
  if (!alternativas.length) return { re: null, troca, guarda, soAssinala };
  const re = new RegExp(`(?<![${CONTINUA}])(?:${alternativas.join('|')})(?![${CONTINUA}])`, 'g');
  return { re, troca, guarda, soAssinala };
}

/** Um mês no princípio de uma frase leva maiúscula por ser princípio de frase. */
function noPrincipioDeFrase(texto, i) {
  for (let k = i - 1; k >= 0; k--) {
    const c = texto[k];
    if (/\s/.test(c)) continue;
    return '.!?…:;«"“‘('.includes(c);
  }
  return true;
}

/** As ocorrências dentro de uma fatia de texto. */
export function procura(texto, comp, de = 0, ate = texto.length) {
  if (!comp.re) return [];
  const achados = [];
  comp.re.lastIndex = de;
  let m;
  while ((m = comp.re.exec(texto)) !== null) {
    if (m.index >= ate) break;
    const forma = m[0];
    if (comp.guarda.get(forma) === 'inicio-de-frase' && noPrincipioDeFrase(texto, m.index)) continue;
    achados.push({
      inicio: m.index,
      fim: m.index + forma.length,
      forma,
      troca: comp.troca.get(forma),
      assinala: comp.soAssinala.has(forma),
    });
  }
  comp.re.lastIndex = 0;
  return achados;
}

/**
 * Está esta posição dentro de umas aspas angulares, na mesma fatia?
 *
 * «…» é a aspa da casa, e o que vai lá dentro é citação: um título publicado
 * («Évora — Quinze Anos, Cinco Mandatos») cita-se pelas palavras exactas, e o
 * travessão é uma delas. Uma citação dentro de prosa da casa não se converte
 * nem se de-travessona; assinala-se à parte, para que se veja o que ficou.
 */
export function emCitacao(texto, i, inicioDaFatia = 0) {
  const antes = texto.slice(inicioDaFatia, i);
  return antes.lastIndexOf('«') > antes.lastIndexOf('»');
}

/** Os travessões, e o meio-traço usado como travessão (com espaço dos dois lados). */
export function procuraTravessoes(texto, de = 0, ate = texto.length) {
  const achados = [];
  for (let i = de; i < ate; i++) {
    if (texto[i] === TRAVESSAO) {
      achados.push({ inicio: i, fim: i + 1, forma: TRAVESSAO, tipo: 'travessao' });
    } else if (texto[i] === MEIO_TRACO && /\s/.test(texto[i - 1] ?? '') && /\s/.test(texto[i + 1] ?? '')) {
      achados.push({ inicio: i, fim: i + 1, forma: MEIO_TRACO, tipo: 'meio-traco' });
    }
  }
  return achados;
}

/* =================================================== as regiões públicas === */

/** Chaves cujo valor é transcrito: título publicado, citação de trabalho. */
const CHAVES_TRANSCRITAS = new Set(['title', 'titulo', 'origem', 'onde']);

/**
 * As chaves que dizem a língua do que vem a seguir.
 *
 * A regra da ortografia é da edição portuguesa; a dos travessões é das duas.
 * Sem esta distinção, «director» numa frase inglesa do Método era apanhado como
 * grafia anterior ao Acordo, que é o contrário do que é: é a palavra inglesa.
 */
const CHAVES_DE_LINGUA = { pt: 'pt', en: 'en' };

/** Elementos cujo conteúdo é citação. */
const TAGS_TRANSCRITAS = new Set(['blockquote', 'q', 'cite', 'script', 'style']);
const TAGS_VAZIAS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);
const MARCAS_TRANSCRITAS = /\bdata-verbatim\b|\bdata-linha-campo\b|\bdata-nonledger\s*=\s*["']titulo-de-estudo["']/;

const podeSerExpressaoRegular = (ultimo) => ultimo === '' || '(,=:[!&|?{};+-*%~^<>\n'.includes(ultimo);

/** O índice da aspa que fecha a cadeia aberta em `i`. */
function fimDaCadeia(texto, i, aspa) {
  for (let j = i + 1; j < texto.length; j++) {
    if (texto[j] === '\\') { j++; continue; }
    if (texto[j] === aspa) return j;
    if (aspa !== '`' && texto[j] === '\n') return j;
  }
  return texto.length;
}

/** O índice do fecho do bloco aberto em `i` ({ ou [), a saltar cadeias e comentários. */
function fimDoBloco(texto, i) {
  const par = { '{': '}', '[': ']', '(': ')' };
  const pilha = [par[texto[i]]];
  let j = i + 1;
  while (j < texto.length && pilha.length) {
    const c = texto[j];
    if (c === '/' && texto[j + 1] === '/') { const n = texto.indexOf('\n', j); j = n < 0 ? texto.length : n; continue; }
    if (c === '/' && texto[j + 1] === '*') { const n = texto.indexOf('*/', j); j = n < 0 ? texto.length : n + 2; continue; }
    if (c === "'" || c === '"' || c === '`') { j = fimDaCadeia(texto, j, c) + 1; continue; }
    if (c === '{' || c === '[' || c === '(') { pilha.push(par[c]); j++; continue; }
    if (c === pilha[pilha.length - 1]) { pilha.pop(); j++; continue; }
    j++;
  }
  return j - 1;
}

/**
 * As fatias de texto público num pedaço de JavaScript: o conteúdo das cadeias,
 * sem as aspas, sem comentários e sem o que estiver sob uma chave transcrita.
 */
export function regioesJs(texto, de = 0, ate = texto.length, linguaFora = null) {
  const fatias = [];
  let i = de;
  let profundidade = 0;
  let transcritoEm = null;
  let chave = null;
  let ultimo = '';
  const linguas = [];
  const livre = () => transcritoEm === null;
  const lingua = () => (linguas.length ? linguas[linguas.length - 1].lingua : linguaFora);
  /** A língua de um valor escalar: a da chave que o abre, ou a do bloco. */
  const linguaDoValor = () => (chave && CHAVES_DE_LINGUA[chave]) || lingua();

  while (i < ate) {
    const c = texto[i];

    if (c === '/' && texto[i + 1] === '/') {
      const n = texto.indexOf('\n', i);
      i = n < 0 ? ate : n;
      continue;
    }
    if (c === '/' && texto[i + 1] === '*') {
      const n = texto.indexOf('*/', i);
      i = n < 0 ? ate : n + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      const j = fimDaCadeia(texto, i, c);
      const lg = linguaDoValor();
      if (livre() && !(chave && CHAVES_TRANSCRITAS.has(chave))) {
        fatias.push({ ini: i + 1, fim: Math.min(j, ate), lingua: lg });
      }
      i = j + 1;
      ultimo = '"';
      chave = null;
      continue;
    }
    if (c === '`') {
      const transcrita = chave !== null && CHAVES_TRANSCRITAS.has(chave);
      const lg = linguaDoValor();
      let j = i + 1;
      let ini = j;
      while (j < ate) {
        if (texto[j] === '\\') { j += 2; continue; }
        if (texto[j] === '`') break;
        if (texto[j] === '$' && texto[j + 1] === '{') {
          if (livre() && !transcrita) fatias.push({ ini, fim: j, lingua: lg });
          const f = fimDoBloco(texto, j + 1);
          fatias.push(...regioesJs(texto, j + 2, f, lg));
          j = f + 1;
          ini = j;
          continue;
        }
        j++;
      }
      if (livre() && !transcrita) fatias.push({ ini, fim: Math.min(j, ate), lingua: lg });
      i = j + 1;
      ultimo = '`';
      chave = null;
      continue;
    }
    if (c === '{' || c === '[') {
      profundidade++;
      if (transcritoEm === null && chave !== null && CHAVES_TRANSCRITAS.has(chave)) transcritoEm = profundidade;
      if (chave && CHAVES_DE_LINGUA[chave]) linguas.push({ profundidade, lingua: CHAVES_DE_LINGUA[chave] });
      chave = null;
      ultimo = c;
      i++;
      continue;
    }
    if (c === '}' || c === ']') {
      if (transcritoEm !== null && profundidade === transcritoEm) transcritoEm = null;
      while (linguas.length && linguas[linguas.length - 1].profundidade === profundidade) linguas.pop();
      profundidade--;
      chave = null;
      ultimo = c;
      i++;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < ate && /[A-Za-z0-9_$]/.test(texto[j])) j++;
      const nome = texto.slice(i, j);
      let k = j;
      while (k < ate && /[ \t]/.test(texto[k])) k++;
      if (texto[k] === ':') chave = nome;
      i = j;
      ultimo = 'a';
      continue;
    }
    if (c === '/' && podeSerExpressaoRegular(ultimo)) {
      let j = i + 1;
      let classe = false;
      while (j < ate) {
        if (texto[j] === '\\') { j += 2; continue; }
        if (texto[j] === '[') classe = true;
        else if (texto[j] === ']') classe = false;
        else if (texto[j] === '/' && !classe) break;
        else if (texto[j] === '\n') break;
        j++;
      }
      i = j + 1;
      ultimo = '/';
      continue;
    }
    if (c === ',' || c === ';') chave = null;
    if (!/\s/.test(c)) ultimo = c;
    i++;
  }
  return fatias;
}

/** O índice do `>` que fecha a etiqueta aberta em `i`. */
function fimDaEtiqueta(texto, i) {
  let j = i + 1;
  while (j < texto.length) {
    const c = texto[j];
    if (c === '"' || c === "'") { j = fimDaCadeia(texto, j, c) + 1; continue; }
    if (c === '{') { j = fimDoBloco(texto, j) + 1; continue; }
    if (c === '>') return j;
    j++;
  }
  return texto.length - 1;
}

/** Os valores de atributo de uma etiqueta: o que está entre aspas, e as expressões. */
function regioesDeAtributos(texto, i, fimTag) {
  const fatias = [];
  let j = i + 1;
  while (j < fimTag) {
    const c = texto[j];
    if (c === '=') {
      let k = j + 1;
      while (k < fimTag && /\s/.test(texto[k])) k++;
      if (texto[k] === '"' || texto[k] === "'") {
        const f = fimDaCadeia(texto, k, texto[k]);
        fatias.push({ ini: k + 1, fim: Math.min(f, fimTag), lingua: null });
        j = f + 1;
        continue;
      }
      if (texto[k] === '{') {
        const f = fimDoBloco(texto, k);
        fatias.push(...regioesJs(texto, k + 1, f));
        j = f + 1;
        continue;
      }
    }
    if (c === '{') { j = fimDoBloco(texto, j) + 1; continue; }
    j++;
  }
  return fatias;
}

/** As fatias de texto público num ficheiro .astro: matéria-prima e gabarito. */
export function regioesAstro(texto) {
  const fatias = [];
  let i = 0;

  if (texto.startsWith('---')) {
    const fim = texto.indexOf('\n---', 3);
    if (fim >= 0) {
      fatias.push(...regioesJs(texto, 3, fim));
      const nl = texto.indexOf('\n', fim + 4);
      i = nl < 0 ? texto.length : nl + 1;
    }
  }

  const n = texto.length;
  const pilha = [];
  let transcritos = 0;
  let iniTexto = i;
  const emite = (fim) => {
    if (transcritos === 0 && fim > iniTexto) fatias.push({ ini: iniTexto, fim, lingua: null });
  };

  while (i < n) {
    if (texto.startsWith('<!--', i)) {
      emite(i);
      const j = texto.indexOf('-->', i);
      i = j < 0 ? n : j + 3;
      iniTexto = i;
      continue;
    }
    if (texto.startsWith('{/*', i)) {
      emite(i);
      const j = texto.indexOf('*/}', i);
      i = j < 0 ? n : j + 3;
      iniTexto = i;
      continue;
    }
    if (texto[i] === '{') {
      emite(i);
      const j = fimDoBloco(texto, i);
      if (transcritos === 0) fatias.push(...regioesJs(texto, i + 1, j));
      i = j + 1;
      iniTexto = i;
      continue;
    }
    if (texto[i] === '<') {
      const m = /^<(\/?)([A-Za-z][A-Za-z0-9-]*)/.exec(texto.slice(i, i + 64));
      if (!m) { i++; continue; }
      emite(i);
      const fimTag = fimDaEtiqueta(texto, i);
      const nome = m[2].toLowerCase();
      if (m[1] === '/') {
        for (let k = pilha.length - 1; k >= 0; k--) {
          if (pilha[k].nome === nome) {
            for (let q = pilha.length - 1; q >= k; q--) if (pilha[q].transcrito) transcritos--;
            pilha.length = k;
            break;
          }
        }
        i = fimTag + 1;
        iniTexto = i;
        continue;
      }
      const bruto = texto.slice(i, fimTag + 1);
      const transcrito = TAGS_TRANSCRITAS.has(nome) || MARCAS_TRANSCRITAS.test(bruto);
      if (transcritos === 0 && !transcrito) fatias.push(...regioesDeAtributos(texto, i, fimTag));
      const fecha = texto[fimTag - 1] === '/' || TAGS_VAZIAS.has(nome);
      if (nome === 'script' || nome === 'style') {
        const f = texto.toLowerCase().indexOf(`</${nome}`, fimTag);
        i = f < 0 ? n : f;
        iniTexto = i;
        continue;
      }
      if (!fecha) {
        pilha.push({ nome, transcrito });
        if (transcrito) transcritos++;
      }
      i = fimTag + 1;
      iniTexto = i;
      continue;
    }
    i++;
  }
  emite(n);
  return fatias;
}

/**
 * A prosa da casa de uma linha do livro-razão, e mais nada.
 *
 * Tudo o resto do formato é proveniência que o portão compara carácter a
 * carácter contra a fonte: converter um `excerpt` era reescrever a prova.
 * Os campos em `_en` entram só pela regra dos travessões, que é das duas edições.
 */
export const CAMPOS_DA_CASA = ['derivation', 'note', 'source_flag_note', 'unit', 'reason'];
export const CAMPOS_DA_CASA_EN = ['derivation_en', 'source_flag_note_en', 'reason_en'];
/** O campo que não é publicado. O que lá se encontra é aviso, não erro. */
export const CAMPO_NAO_PUBLICADO = 'note';

export function regioesLivro(texto, caminho = '') {
  const fatias = [];
  let deslocamento = 0;
  for (const linha of texto.split('\n')) {
    const m = /^(\s*)(?:-\s+)?([A-Za-z_][A-Za-z0-9_]*):(.*)$/.exec(linha);
    if (m && (CAMPOS_DA_CASA.includes(m[2]) || CAMPOS_DA_CASA_EN.includes(m[2]))) {
      const cru = m[3];
      const t = cru.trim();
      if (['|', '>', '|-', '>-', '|+', '>+'].includes(t)) {
        throw new Error(
          `${caminho}: o campo "${m[2]}" usa um escalar em bloco. Esta ferramenta lê ` +
            `um valor por linha; acrescente o caso antes de o usar.`,
        );
      }
      if (t && t !== 'null' && t !== '~' && t !== '[]') {
        const base = deslocamento + linha.length - cru.length;
        const desl = cru.indexOf(t[0]);
        let ini = base + desl;
        let fim = base + desl + t.length;
        if ((t.startsWith("'") && t.endsWith("'") && t.length > 1) || (t.startsWith('"') && t.endsWith('"') && t.length > 1)) {
          ini += 1;
          fim -= 1;
        }
        fatias.push({ ini, fim, campo: m[2], lingua: CAMPOS_DA_CASA_EN.includes(m[2]) ? 'en' : 'pt' });
      }
    }
    deslocamento += linha.length + 1;
  }
  return fatias;
}

/** As fatias de texto público de um ficheiro, pelo seu tipo. */
export function regioesPublicas(caminho, texto) {
  if (caminho.endsWith('.astro')) return regioesAstro(texto);
  if (caminho.endsWith('.yml')) return regioesLivro(texto, caminho);
  return regioesJs(texto);
}

/* ======================================================= os ficheiros ===== */

function astroDe(dir) {
  const saida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const cheio = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...astroDe(cheio));
    else if (e.name.endsWith('.astro')) saida.push(cheio);
  }
  return saida;
}

/** Os ficheiros da superfície pública, nomeados e não adivinhados. */
export function ficheirosPublicos() {
  const saida = [path.join(RAIZ, 'src', 'i18n', 'strings.mjs')];
  const dados = path.join(RAIZ, 'src', 'data');
  for (const nome of fs.readdirSync(dados).sort()) {
    if (!nome.endsWith('.mjs')) continue;
    if (nome === 'verbatim.mjs') continue; // citações transcritas, ficheiro inteiro
    saida.push(path.join(dados, nome));
  }
  saida.push(...astroDe(path.join(RAIZ, 'src')).sort());
  const claims = path.join(RAIZ, 'ledger', 'claims');
  for (const nome of fs.readdirSync(claims).sort()) {
    if (nome.endsWith('.yml')) saida.push(path.join(claims, nome));
  }
  return saida;
}

/** Os ids das linhas cruzadas: bytes presos, convertem-se no motor. */
export function linhasCruzadas() {
  const dir = path.join(RAIZ, 'ledger', 'cruzamentos');
  const ids = new Set();
  if (!fs.existsSync(dir)) return ids;
  for (const nome of fs.readdirSync(dir)) {
    if (!nome.endsWith('.json')) continue;
    const reg = JSON.parse(fs.readFileSync(path.join(dir, nome), 'utf8'));
    for (const id of Object.keys(reg.rows ?? {})) ids.add(id);
  }
  return ids;
}

/* ========================================================= o varrimento === */

function linhaEColuna(texto, i) {
  let linha = 1;
  let inicio = 0;
  for (let k = 0; k < i; k++) {
    if (texto[k] === '\n') { linha++; inicio = k + 1; }
  }
  return { linha, coluna: i - inicio + 1 };
}

function trecho(texto, inicio, fim) {
  const de = Math.max(0, inicio - 42);
  const ate = Math.min(texto.length, fim + 42);
  return (
    (de > 0 ? '…' : '') +
    texto.slice(de, ate).replace(/\s+/g, ' ') +
    (ate < texto.length ? '…' : '')
  );
}

function varre(sentido) {
  const formas = carregaFormas();
  const comp = comparador(formas, sentido);
  const cruzadas = linhasCruzadas();
  const achados = [];

  for (const ficheiro of ficheirosPublicos()) {
    const rel = path.relative(RAIZ, ficheiro);
    const texto = fs.readFileSync(ficheiro, 'utf8');
    const cruzada = rel.startsWith('ledger/claims/') && cruzadas.has(path.basename(rel, '.yml'));

    for (const fatia of regioesPublicas(ficheiro, texto)) {
      const campo = fatia.campo ?? null;
      const naoPublicado = campo === CAMPO_NAO_PUBLICADO;

      /* A ortografia é da edição portuguesa. Os travessões são das duas. */
      if (fatia.lingua !== 'en') {
        for (const o of procura(texto, comp, fatia.ini, fatia.fim)) {
          if (o.fim > fatia.fim) continue;
          const citado = emCitacao(texto, o.inicio, fatia.ini);
          achados.push({
            rel, texto, campo, cruzada, lingua: fatia.lingua,
            tipo: o.assinala ? 'manual' : 'palavra',
            grau: citado ? 'citacao' : cruzada ? 'restante' : naoPublicado ? 'aviso' : o.assinala ? 'mao' : 'erro',
            ...o,
          });
        }
      }
      for (const o of procuraTravessoes(texto, fatia.ini, fatia.fim)) {
        const citado = emCitacao(texto, o.inicio, fatia.ini);
        achados.push({
          rel, texto, campo, cruzada, lingua: fatia.lingua,
          tipo: o.tipo,
          grau: citado ? 'citacao' : cruzada ? 'restante' : naoPublicado ? 'aviso' : 'mao',
          troca: null,
          ...o,
        });
      }
    }
  }
  return { formas, comp, achados, cruzadas };
}

/* ============================================================ aplicar ===== */

function aplica(sentido) {
  const formas = carregaFormas();
  const comp = comparador(formas, sentido, { comManuais: false });
  const cruzadas = linhasCruzadas();
  let total = 0;
  const porFicheiro = [];

  for (const ficheiro of ficheirosPublicos()) {
    const rel = path.relative(RAIZ, ficheiro);
    if (rel.startsWith('ledger/claims/') && cruzadas.has(path.basename(rel, '.yml'))) continue;
    const texto = fs.readFileSync(ficheiro, 'utf8');

    const trocas = [];
    for (const fatia of regioesPublicas(ficheiro, texto)) {
      if (fatia.lingua === 'en') continue;
      for (const o of procura(texto, comp, fatia.ini, fatia.fim)) {
        if (o.fim > fatia.fim) continue;
        if (emCitacao(texto, o.inicio, fatia.ini)) continue;
        trocas.push(o);
      }
    }
    if (!trocas.length) continue;

    trocas.sort((a, b) => b.inicio - a.inicio);
    let novo = texto;
    for (const o of trocas) novo = novo.slice(0, o.inicio) + o.troca + novo.slice(o.fim);
    fs.writeFileSync(ficheiro, novo);
    total += trocas.length;
    porFicheiro.push({ rel, n: trocas.length, trocas: trocas.slice().reverse() });
  }
  return { total, porFicheiro };
}

/* ============================================================ relatório === */

function relatorio(sentido, { silencioso = false } = {}) {
  const { formas, achados } = varre(sentido);
  const grupos = { erro: [], mao: [], restante: [], aviso: [], citacao: [] };
  for (const a of achados) grupos[a.grau].push(a);

  const linhaDe = (a) => {
    const { linha, coluna } = linhaEColuna(a.texto, a.inicio);
    const alvo = a.troca ? ` → ${a.troca}` : '';
    const campo = a.campo ? ` [${a.campo}]` : '';
    return (
      `    ${a.rel}:${linha}:${coluna}${campo}  ${a.forma}${alvo}\n` +
      cinza(`        ${trecho(a.texto, a.inicio, a.fim)}`)
    );
  };

  console.log('');
  console.log(
    cinza(
      `  ortografia · superfície pública · sentido "${sentido}" · ` +
        `${formas.pares.length} pares, ${formas.manuais.length} manuais, ${formas.iguais.length} iguais`,
    ),
  );

  if (grupos.erro.length) {
    console.log('');
    console.error(vermelho(`  ${grupos.erro.length} forma(s) fora da grafia da casa:`));
    if (!silencioso) for (const a of grupos.erro) console.error(linhaDe(a));
  }
  if (grupos.mao.length) {
    const t = grupos.mao.filter((a) => a.tipo !== 'palavra' && a.tipo !== 'manual').length;
    console.log('');
    console.error(vermelho(`  ${grupos.mao.length} a reescrever à mão (${t} travessão/traço):`));
    if (!silencioso) for (const a of grupos.mao) console.error(linhaDe(a));
  }
  if (grupos.restante.length) {
    console.log('');
    console.log(amarelo(`  ${grupos.restante.length} no restante registado (linhas cruzadas, convertem-se no motor):`));
    if (!silencioso) for (const a of grupos.restante) console.log(linhaDe(a));
  }
  if (grupos.aviso.length) {
    console.log('');
    console.log(amarelo(`  ${grupos.aviso.length} aviso(s) em "note", que não é publicada:`));
    if (!silencioso) for (const a of grupos.aviso) console.log(linhaDe(a));
  }
  if (grupos.citacao.length) {
    console.log('');
    console.log(cinza(`  ${grupos.citacao.length} dentro de «…» na prosa da casa: é citação, e fica.`));
    if (!silencioso) for (const a of grupos.citacao) console.log(linhaDe(a));
  }

  const falha = grupos.erro.length + grupos.mao.length;
  console.log('');
  if (falha) {
    console.error(vermelho(`  A ORTOGRAFIA NÃO FECHA — ${falha} ocorrência(s) fora do restante registado.`));
    console.log('');
    return 1;
  }
  console.log(
    '  ' + verde('✓') +
      ` a superfície pública está numa grafia só; ${grupos.restante.length} no restante, ` +
      `${grupos.aviso.length} aviso(s), ${grupos.citacao.length} em citação.`,
  );
  console.log('');
  return 0;
}

/* ================================================================ main ==== */

function principal(argv) {
  const args = argv.slice(2);
  const silencioso = args.includes('--silencioso');
  const sentidoArg = args.find((a) => a.startsWith('--sentido='));
  const sentido = sentidoArg ? sentidoArg.slice('--sentido='.length) : 'acordo';
  if (sentido !== 'acordo' && sentido !== 'anterior') {
    console.error(vermelho(`\n  --sentido tem de ser "acordo" ou "anterior"; veio "${sentido}".\n`));
    return 2;
  }

  if (args.includes('--aplicar')) {
    const { total, porFicheiro } = aplica(sentido);
    console.log('');
    console.log(cinza(`  ortografia · aplicar · sentido "${sentido}"`));
    console.log('');
    for (const f of porFicheiro) {
      console.log(`    ${String(f.n).padStart(4)}  ${f.rel}`);
      if (!silencioso) {
        for (const o of f.trocas) console.log(cinza(`          ${o.forma} → ${o.troca}`));
      }
    }
    console.log('');
    console.log(`  ${total} troca(s) em ${porFicheiro.length} ficheiro(s).`);
    console.log(cinza('  Os travessões e a lista "manuais" não se aplicam por máquina: corra --verificar.'));
    console.log('');
    return 0;
  }

  return relatorio(sentido, { silencioso });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(principal(process.argv));
}
