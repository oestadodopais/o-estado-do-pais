/**
 * O TRIPWIRE LEXICAL DA VOZ · a lista fechada de marcadores, lida do ficheiro.
 *
 * A Emenda 15 tira da página do leitor «toda a frase sobre o método, a
 * verificação, a honestidade, a cobertura ou as intenções do próprio sítio», e a
 * régua do inventário (`scripts/medir-defeitos.mjs`) media essa classe pela
 * DECLARAÇÃO de quem escreveu a frase. «É a lei que o define, não este sítio.»
 * esteve declarada como conteúdo em 616 páginas até à leitura do Codex de
 * 26.08.2026. Este módulo é a rede mecânica que faltava: aplica uma lista fechada
 * de marcadores a TODAS as frases da casa, declaradas ou não.
 *
 * Não julga sozinho e não fecha nada: devolve os achados. Quem fecha a
 * construção é `scripts/check-voz.mjs`, e quem imprime é a medida 9 da régua.
 *
 * Os dados vivem em `design/especime-v3/VOZ-MARCADORES.md`, na forma do
 * `ledger/allowlist.yml`: cada marcador com a sua razão, cada exceção com a sua.
 * Uma exceção sem razão fecha a construção, e um marcador sem razão também.
 */

import fs from 'node:fs';
import path from 'node:path';

export const FICHEIRO_DOS_MARCADORES = path.join(
  'design',
  'especime-v3',
  'VOZ-MARCADORES.md',
);

const MODOS = new Set(['raiz', 'prefixo', 'palavra']);
const TIPOS = new Set(['contexto', 'rota', 'frase', 'registo']);

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const escapa = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * As células de uma linha de tabela markdown.
 *
 * Nenhuma frase do inventário leva um `|`: o portão de HTML não deixa entrar
 * markup em prosa, e o separador da casa é o ponto médio. Se um dia levar, esta
 * função parte a linha e a construção fecha com «células a mais», que é o
 * comportamento certo: um ficheiro de dados ambíguo não se adivinha.
 */
function celulas(linha) {
  const t = linha.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return null;
  return t
    .slice(1, -1)
    .split('|')
    .map((c) => norm(c));
}

/** A expressão de um marcador, no seu modo. */
export function expressaoDoMarcador(modo, marcador) {
  const m = escapa(marcador);
  if (modo === 'palavra') return new RegExp(`(?<![\\p{L}\\p{N}])${m}(?![\\p{L}\\p{N}])`, 'iu');
  if (modo === 'prefixo') return new RegExp(`(?<![\\p{L}\\p{N}])${m}`, 'iu');
  return new RegExp(m, 'iu');
}

/**
 * Lê o ficheiro dos marcadores.
 *
 * Devolve `{ marcadores, excecoes, erros, ficheiro }`. `erros` é a lista das
 * linhas mal escritas: um modo que não existe, um tipo que não existe, uma
 * razão vazia. Quem chama decide o que fazer com elas; `check-voz.mjs` fecha a
 * construção.
 */
export function leMarcadores(raiz) {
  const ficheiro = path.join(raiz, FICHEIRO_DOS_MARCADORES);
  const marcadores = [];
  const excecoes = [];
  const erros = [];
  if (!fs.existsSync(ficheiro)) {
    erros.push(`não existe ${FICHEIRO_DOS_MARCADORES}`);
    return { marcadores, excecoes, erros, ficheiro };
  }
  const linhas = fs.readFileSync(ficheiro, 'utf8').split('\n');
  for (let i = 0; i < linhas.length; i++) {
    const c = celulas(linhas[i]);
    if (!c) continue;
    /* A tabela dos marcadores: três células, a primeira um modo. */
    if (c.length === 3 && MODOS.has(c[0])) {
      const [modo, marcador, razao] = c;
      if (!marcador) erros.push(`linha ${i + 1}: marcador vazio`);
      else if (!razao) erros.push(`linha ${i + 1}: o marcador «${marcador}» não tem razão escrita`);
      else marcadores.push({ modo, marcador, razao, re: expressaoDoMarcador(modo, marcador) });
      continue;
    }
    /* A tabela das exceções: cinco células, a primeira um tipo. */
    if (c.length === 5 && TIPOS.has(c[0])) {
      const [tipo, marcador, pt, en, razao] = c;
      if (!razao || razao === '(nenhum)') {
        erros.push(`linha ${i + 1}: a exceção «${(pt || en).slice(0, 60)}» não tem razão escrita`);
        continue;
      }
      const alvos = [pt, en].filter((a) => a && a !== '(nenhum)');
      if (!alvos.length) {
        erros.push(`linha ${i + 1}: a exceção não nomeia nenhuma cadeia`);
        continue;
      }
      /* O marcador de uma exceção pode ser mais do que um, e quase sempre é
         dois: uma decisão editorial leva as duas edições da mesma frase, e a
         frase inglesa morde no marcador inglês. Separam-se pelo ponto médio, que
         é o separador da casa e não aparece dentro de nenhum marcador. */
      const marcadoresDaExcecao =
        marcador === '(nenhum)' ? null : marcador.split(' · ').map((m) => m.trim()).filter(Boolean);
      excecoes.push({ tipo, marcador: marcadoresDaExcecao, alvos, razao, usos: 0 });
      continue;
    }
  }
  if (!marcadores.length) erros.push(`${FICHEIRO_DOS_MARCADORES} não tem nenhum marcador`);
  return { marcadores, excecoes, erros, ficheiro };
}

/**
 * Aplica os marcadores a uma frase de uma rota.
 *
 * Devolve a lista dos marcadores que morderam, já descontadas as exceções. A
 * ordem é a do ficheiro, para que a saída seja a mesma em duas corridas.
 *
 * Três descontos, pela ordem:
 *   1. **contexto** · a cadeia é apagada da frase antes de os marcadores
 *      correrem. «[a verificar]» é o nome do marcador de incerteza do sítio e
 *      não uma afirmação da casa; apagá-lo é o que impede a raiz «verific» de
 *      morder o nome de uma ausência declarada.
 *   2. **rota** · um marcador que, naquela rota, é o objecto da página. Os
 *      outros continuam a morder lá.
 *   3. **frase** · a frase inteira, com o marcador a que responde.
 */
export function analisa(texto, rota, { marcadores, excecoes }) {
  const t = norm(texto);
  let varrida = t;
  for (const e of excecoes) {
    if (e.tipo !== 'contexto') continue;
    for (const alvo of e.alvos) {
      const re = new RegExp(escapa(alvo), 'gi');
      if (re.test(varrida)) {
        e.usos++;
        varrida = varrida.replace(new RegExp(escapa(alvo), 'gi'), ' ');
      }
    }
  }
  let mordeu = marcadores.filter((m) => m.re.test(varrida)).map((m) => m.marcador);
  if (!mordeu.length) return [];
  /* A dispensa por rota, e a dispensa por frase, cada uma a tirar da lista o
     marcador a que responde e mais nenhum. Uma exceção só conta como usada
     quando o marcador que ela dispensa MORDEU: uma exceção que nunca se exerce
     sai na saída da régua, para que a lista não engorde em silêncio. */
  for (const e of excecoes) {
    if (e.tipo === 'rota' && !e.alvos.includes(rota)) continue;
    if (e.tipo === 'frase' && !e.alvos.includes(t)) continue;
    if (e.tipo !== 'rota' && e.tipo !== 'frase') continue;
    const tira = e.marcador ?? [...mordeu];
    const antes = mordeu.length;
    mordeu = mordeu.filter((m) => !tira.includes(m));
    if (mordeu.length !== antes) e.usos++;
    if (!mordeu.length) break;
  }
  return mordeu;
}

/* =============================================================================
 * O INVENTÁRIO, LIDO NUM SÍTIO SÓ
 * =============================================================================
 * A régua (`medir-defeitos.mjs`, medida 8) e o portão (`check-voz.mjs`, o rasto
 * da revisão) leem o mesmo ficheiro, e por isso leem-no pela mesma função. Duas
 * implementações da mesma tabela divergiriam na primeira linha estranha.
 *
 * A TERCEIRA COLUNA, «bloco», entrou a 26.08.2026 com o G2 deste bloco: é o
 * identificador do bloco de trabalho que acrescentou ou reclassificou a linha.
 * As linhas anteriores levam `até 2026-08-26`, que é o que elas são: um estado
 * herdado, sem o rasto de quem o pôs lá. Uma linha com duas células continua a
 * ler-se, e fica sem bloco, porque um ficheiro de dados a meio de uma migração
 * não deve mentir sobre o que tem.
 * ========================================================================== */
export const FICHEIRO_DO_INVENTARIO = path.join(
  'design',
  'especime-v3',
  'INVENTARIO-FRASES.md',
);

const CLASSES_DO_INVENTARIO = new Set(['conteudo', 'navegacao', 'autorreferencia']);

export function leInventario(raiz) {
  const ficheiro = path.join(raiz, FICHEIRO_DO_INVENTARIO);
  const mapa = new Map();
  const linhas = [];
  if (!fs.existsSync(ficheiro)) return { mapa, linhas, ficheiro, existe: false, cabeca: {} };
  const cru = fs.readFileSync(ficheiro, 'utf8').split('\n');
  const cabeca = {};
  for (let i = 0; i < cru.length; i++) {
    /* A cabeça do ficheiro: `campo: valor`, numa linha só, antes da primeira
       tabela. É onde vive `lida-contra`, o gatilho da regra (G3). */
    const c = cru[i].match(/^([a-zà-ÿ-]+):\s*(.+?)\s*$/i);
    if (c && !cru[i].startsWith('|')) cabeca[c[1]] = c[2];
    const cel = celulas(cru[i]);
    if (!cel || cel.length < 2 || !CLASSES_DO_INVENTARIO.has(cel[0])) continue;
    const [classe, texto] = cel;
    const bloco = cel.length >= 3 ? cel[2] : null;
    mapa.set(texto, classe);
    linhas.push({ n: i + 1, classe, texto, bloco });
  }
  return { mapa, linhas, ficheiro, existe: true, cabeca };
}
