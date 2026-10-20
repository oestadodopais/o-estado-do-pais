/** Operações documentais explícitas; a aritmética comum conserva a sua gramática. */
import { Decimal } from './decimal.mjs';

export const DOCUMENT_FUNCTIONS = new Set(['number_pt', 'count_rows', 'count_equal']);

/**
 * @param {string[]} tokens
 * @param {number} start
 * @param {Map<string, {value?: unknown}>} claims
 * @param {string | null} selfId
 * @returns {{value: Decimal, next: number}}
 */
export function documentCall(tokens, start, claims, selfId) {
  const name = tokens[start];
  let position = start + 1;
  const take = () => {
    if (position >= tokens.length) throw new Error('operação documental truncada');
    return tokens[position++];
  };
  if (take() !== '(') throw new Error('falta ( na operação documental');
  let expected = null;
  if (name === 'count_equal') {
    expected = take();
    if (!/^\p{L}[\p{L}\p{N}_-]*$/u.test(expected)) {
      throw new Error('count_equal exige um texto de um token');
    }
    if (take() !== ',') throw new Error('falta vírgula após o texto de count_equal');
  }
  /** @type {string[]} */
  const ids = [];
  while (true) {
    const key = take();
    if (key === selfId || !claims.has(key) || ids.includes(key)) {
      throw new Error('componente documental ausente, repetida ou autorreferente');
    }
    if (!/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(key)) {
      throw new Error('componente documental não é um identificador');
    }
    ids.push(key);
    const separator = take();
    if (separator === ')') break;
    if (separator !== ',') throw new Error('falta vírgula entre componentes documentais');
  }
  const values = ids.map((key) => {
    const value = claims.get(key)?.value;
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('componente documental sem valor textual');
    }
    return value;
  });
  if (name === 'number_pt') {
    if (ids.length !== 1) throw new Error('number_pt exige uma única componente');
    let value = values[0].replace(/\s/g, '');
    if (!/^-?(?:[0-9]{1,3}(?:\.[0-9]{3})+|[0-9]+)(?:,[0-9]+)?(?:M€|%)?$/.test(value)) {
      throw new Error('number_pt exige um número português completo, com unidade opcional M€ ou %');
    }
    value = value.replace(/(?:M€|%)$/, '').replace(/\./g, '').replace(',', '.');
    return { value: Decimal.de(value), next: position };
  }
  if (name === 'count_rows') return { value: Decimal.de(String(ids.length)), next: position };
  if (name === 'count_equal') {
    return {
      value: Decimal.de(String(values.filter((value) => value === expected).length)),
      next: position,
    };
  }
  throw new Error('operação documental desconhecida');
}
