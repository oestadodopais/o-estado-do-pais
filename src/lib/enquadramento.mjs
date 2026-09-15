/**
 * ---------------------------------------------------------------------------
 * O ENQUADRAMENTO DE UM NÚMERO · a régua que o cartão desenha (bloco P2, item 1d)
 * ---------------------------------------------------------------------------
 *
 * O diretor, a 15.09.2026, diante de um cartão que dizia «17,6»: «17,6 % de
 * quê, e é muito ou pouco». Um número sem régua não é informação, e a norma
 * escreve-o no §2.4: «O número traz sempre a régua. O valor nacional ao lado do
 * local, o período anterior, a posição, a média da União quando é o quadro da
 * fonte.»
 *
 * ---------------------------------------------------------------------------
 * A RÉGUA NÃO SE COMPÕE: LÊ-SE
 * ---------------------------------------------------------------------------
 * Nenhum valor desta régua é escrito pela casa. Cada um é uma linha do
 * livro-razão que a metade do motor deste bloco está a selar, com a proveniência
 * inteira, e este módulo faz uma coisa só: **diz que linhas seriam, e devolve as
 * que existem**. Onde a linha não existe, não há régua, e a ausência não se
 * escreve por palavras no cartão (o §0.2 do brief: «a ausência de régua não se
 * escreve por palavras no cartão»).
 *
 * É por isso que a porta é `hasClaim()` e não `getClaim()`: `getClaim()` fecha a
 * construção quando a linha falta, que é a regra certa para um número que a
 * página promete, e a regra errada para uma comparação que a fonte pode nunca
 * vir a publicar.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE SAEM OS IDENTIFICADORES
 * ---------------------------------------------------------------------------
 * Por duas vias, e a primeira ganha:
 *
 *   1. **`src/data/enquadramento/referencias.json`**, que o motor exporta e o
 *      lugar de direção copia para esta árvore. É a via a sério: o motor sabe
 *      qual é o período anterior de cada série (um trimestre, um ano, um mês) e
 *      qual é o agregado da União daquele quadro, e escreve-o linha a linha.
 *   2. **a convenção do brief**, enquanto esse ficheiro não existir: os ids
 *      `<slug>-<período anterior>` e `<slug>-<período>-ue`, com o período a ser
 *      o sufixo do próprio identificador. É uma REGRA DE NOME, não um palpite
 *      sobre dados: ou a linha com aquele nome está no livro-razão, e então é a
 *      linha do período anterior daquela série por construção do motor, ou não
 *      está, e não há régua.
 *
 * A SEGUNDA VIA NÃO ADIVINHA UM PERÍODO. Só sabe descer um ano quando o
 * identificador acaba em quatro algarismos; um identificador que acabe em
 * `-2026-08` ou `-2025-12` (um mês) ou que não acabe em algarismos não tem
 * período anterior por esta via, e fica à espera do ficheiro do motor. Descer um
 * mês, um trimestre ou um semestre é conhecimento da série, e a série é do
 * motor.
 *
 * ---------------------------------------------------------------------------
 * O NOME OFICIAL AINDA NÃO SE LÊ DAQUI, E ISSO ESTÁ ESCRITO DE PROPÓSITO
 * ---------------------------------------------------------------------------
 * `src/data/enquadramento/nomes.json` é o outro ficheiro que o motor exporta
 * (o F1.15, item 1): por linha, o nome oficial em português e em inglês, com a
 * origem, para o RECIBO (a norma §1.5: o nome oficial no recibo, o nome do
 * projeto no cartão). Este módulo diz se ele já chegou (`ficheirosDoMotor()`), e
 * mais nada: a função que o lesse não é chamada por vista nenhuma enquanto o
 * ficheiro não existir, e código que nunca correu é pior do que código que não
 * existe. Escreve-se no commit em que a primeira linha chegar, com a régua a
 * medi-la. Não se inventa um nome: o nome de uma medida é um campo com dono, e o
 * dono é o motor.
 *
 * NENHUM ALGARISMO NOVO NESTE FICHEIRO. Ele devolve identificadores de linhas e
 * texto de outro ficheiro; quem desenha é o cartão, e quem imprime um valor é o
 * `<Claim/>`, que o portão confere contra a linha.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hasClaim, getClaim } from './ledger.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PASTA = path.resolve(AQUI, '..', 'data', 'enquadramento');

/**
 * Lê um ficheiro do motor, ou devolve `null` quando ele ainda não chegou.
 *
 * NÃO SE CALA COM UM ERRO DE LEITURA: um ficheiro que exista e não seja JSON
 * válido fecha a construção, porque isso é um ficheiro partido e não um ficheiro
 * ausente. O que é tolerado é a ausência, e só ela.
 *
 * @param {string} nome
 * @returns {Record<string, unknown>|null}
 */
function ficheiroDoMotor(nome) {
  const f = path.join(PASTA, nome);
  if (!fs.existsSync(f)) return null;
  const cru = fs.readFileSync(f, 'utf8');
  try {
    return JSON.parse(cru);
  } catch (e) {
    throw new Error(
      `enquadramento: «${path.relative(process.cwd(), f)}» existe e não é JSON válido ` +
        `(${e instanceof Error ? e.message : String(e)}). Um ficheiro do motor partido ` +
        `fecha a construção; um ficheiro que ainda não chegou não.`,
    );
  }
}

/** @type {Record<string, { anterior?: string, ue?: string }>|null} */
let _referencias;
/** @type {Record<string, { pt?: string, en?: string, origem?: string }>|null} */
let _nomes;

/** As referências exportadas pelo motor, lidas uma vez. */
function referencias() {
  if (_referencias === undefined) {
    const j = ficheiroDoMotor('referencias.json');
    _referencias = /** @type {any} */ (j?.linhas ?? j ?? null);
  }
  return _referencias;
}

/** Os nomes oficiais exportados pelo motor, lidos uma vez. */
function nomes() {
  if (_nomes === undefined) {
    const j = ficheiroDoMotor('nomes.json');
    _nomes = /** @type {any} */ (j?.linhas ?? j ?? null);
  }
  return _nomes;
}

/**
 * O par (raiz, período) de um identificador, quando ele acaba num ano.
 *
 * `precos-da-habitacao-2025` → `{ raiz: 'precos-da-habitacao', ano: 2025 }`.
 * `licencas-de-construcao-2026-08` → `null`, porque o período é um mês e descer
 * um mês é conhecimento da série.
 *
 * @param {string} id
 * @returns {{ raiz: string, ano: number }|null}
 */
export function anoDoIdentificador(id) {
  const m = /^(.*)-(\d{4})$/.exec(String(id));
  if (!m) return null;
  const ano = Number(m[2]);
  /* Um ano de quatro algarismos e nada mais: `-0000` não é um período e
     `-1999` de uma série que comece em 2000 não tem linha, que é o caso que o
     `hasClaim()` resolve a seguir. */
  if (!Number.isInteger(ano)) return null;
  return { raiz: m[1], ano };
}

/**
 * Os identificadores que o enquadramento de uma medida procuraria.
 *
 * Devolve-os EXISTAM OU NÃO, porque é esta a lista que o relatório do bloco
 * escreve quando diz «o que ficou à espera das linhas do motor, com as chaves
 * que faltam». Quem decide o que se rende é `reguaDaMedida()`.
 *
 * @param {string} id
 * @returns {{ anterior: string|null, ue: string|null }}
 */
export function chavesDoEnquadramento(id) {
  const doMotor = referencias()?.[id];
  if (doMotor) {
    return { anterior: doMotor.anterior ?? null, ue: doMotor.ue ?? null };
  }
  const p = anoDoIdentificador(id);
  if (!p) return { anterior: null, ue: null };
  return { anterior: `${p.raiz}-${p.ano - 1}`, ue: `${id}-ue` };
}

/**
 * A régua de uma medida: só as linhas que existem.
 *
 * @param {string} id  o identificador da linha da medida
 * @returns {{ anterior: { id: string, periodo: string|null }|null, ue: { id: string }|null }}
 */
export function reguaDaMedida(id) {
  const chaves = chavesDoEnquadramento(id);
  const anterior =
    chaves.anterior && hasClaim(chaves.anterior)
      ? {
          id: chaves.anterior,
          /* O RÓTULO DO PERÍODO ANTERIOR É O PERÍODO DA LINHA DELE, e não um
             algarismo composto aqui: a linha diz de que período é, e é isso que
             o cartão escreve. Sem `reference_date`, a régua não lhe põe rótulo,
             porque escrever «2024» por cima de uma linha que não diz ser de 2024
             seria a casa a datar um número. */
          periodo: valorDoPeriodo(chaves.anterior),
        }
      : null;
  const ue = chaves.ue && hasClaim(chaves.ue) ? { id: chaves.ue } : null;
  return { anterior, ue };
}

/**
 * O período de uma linha, como ela o publica, ou `null`.
 *
 * @param {string} id
 * @returns {string|null}
 */
function valorDoPeriodo(id) {
  const c = getClaim(id);
  const r = c.reference_date;
  return typeof r === 'string' && r !== '' ? r : null;
}

/**
 * Verdadeiro quando a régua de uma medida tem alguma coisa para dizer.
 *
 * @param {{ anterior: unknown, ue: unknown }} regua
 */
export function temRegua(regua) {
  return Boolean(regua.anterior || regua.ue);
}

/**
 * Diz se os ficheiros do motor já chegaram. O relatório do bloco lê-o, e a régua
 * do bloco usa-o para escolher entre as duas medidas de aceitação.
 *
 * @returns {{ referencias: boolean, nomes: boolean }}
 */
export function ficheirosDoMotor() {
  return { referencias: referencias() !== null, nomes: nomes() !== null };
}
