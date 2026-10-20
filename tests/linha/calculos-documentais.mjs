/** Operações documentais não tornam o texto um operando da aritmética comum. */
import assert from 'node:assert/strict';
import { evaluateCheck, MarcaDaExpressao } from '../../src/lib/ledger.mjs';

const claims = new Map(Object.entries({
  amount: '2.011M €', paid: '947M €', rate: '47%', done: 'Completo',
  pending: 'Dentro do Prazo', 'done-two': 'Completo', decimal: '1.234,50 M€',
  missing: 'N.d.',
}).map(([id, value]) => [id, { id, value }]));
const calculate = (expr, rows = claims, selfId = null) =>
  evaluateCheck(expr, { claims: rows, env: {}, selfId });
for (const [expr, expected] of [
  ['number_pt ( amount )', '2011'],
  ['number_pt ( paid )', '947'],
  ['number_pt ( rate )', '47'],
  ['number_pt ( decimal )', '1234.50'],
  ['count_rows ( done , pending , done-two )', '3'],
  ['count_equal ( Completo , done , pending , done-two )', '2'],
  ['round ( number_pt ( paid ) / number_pt ( amount ) * 100 , 1 )', '47.1'],
  ['count_equal ( Inexistente , done , pending )', '0'],
]) assert.equal(String(calculate(expr)), expected, expr);
for (const expr of [
  'number_pt ( unknown )', 'number_pt ( amount , paid )', 'number_pt ( 2011 )',
  'number_pt ( amount', 'number_pt amount )', 'number_pt ( amount ) junk',
  'count_rows ( )', 'count_rows ( done , done )', 'count_rows ( unknown )',
  'count_rows ( done pending )', 'count_rows ( done , )',
  'count_equal ( Completo done )', 'count_equal ( Completo , )',
  'count_equal ( 1 , done )', 'number_pt ( done )', 'number_pt ( missing )',
]) assert.throws(() => calculate(expr), undefined, expr);
assert.throws(() => calculate('number_pt ( amount )', claims, 'amount'));
for (const value of [
  '2.01M €', '1e3M€', '+3M€', 'Infinity', 'NaN', '47%%', '1,2,3',
  '1.234.50', '', '2011 euros',
]) {
  const changed = new Map(claims);
  changed.set('amount', { id: 'amount', value });
  assert.throws(() => calculate('number_pt ( amount )', changed), undefined, value);
}
const changed = new Map(claims);
changed.set('done', { id: 'done', value: 'Dentro do Prazo' });
assert.equal(String(calculate('count_equal ( Completo , done , pending , done-two )', changed)), '1');
changed.set('amount', { id: 'amount', value: '2.012M €' });
assert.equal(String(calculate('number_pt ( amount )', changed)), '2012');
assert.ok(calculate('count_rows ( done , pending ) + missing') instanceof MarcaDaExpressao);
assert.throws(() => calculate('amount + 1'));
console.log('PASS: operações documentais, valores alterados e plantas recusadas');
