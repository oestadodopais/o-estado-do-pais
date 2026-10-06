/** A referência europeia rendida num recibo conserva a unidade e o período da linha. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { reguaDaMedida } from '../../src/lib/enquadramento.mjs';

const linhas = loadClaims();
export function conferir(id, html, livro = linhas) {
  const principal = livro.get(id);
  const root = parse(html);
  const referencias = new Set(root.querySelectorAll('#enquadramento [data-claim]').map(n => n.getAttribute('data-claim')).filter(s => s?.endsWith('-ue')));
  const erros = [];
  for (const ref of referencias) {
    const outra = livro.get(ref);
    if (!principal?.unit || !outra?.unit || principal.unit !== outra.unit) {
      erros.push(`Enquadramento da União: unidades diferentes em ${id} e ${ref}`);
    }
    if (!principal?.reference_date || !outra?.reference_date || principal.reference_date !== outra.reference_date) {
      erros.push(`Enquadramento da União: períodos diferentes em ${id} e ${ref}`);
    }
  }
  return erros;
}

const plantas = [];
if (process.argv.includes('--prova')) {
  const recibo = ref => `<section id="enquadramento"><dd><span data-claim="${ref}"></span></dd></section>`;
  const juros = 'juros-das-administracoes-publicas-2025';
  const jurosUe = `${juros}-ue`;
  const unidade = `Enquadramento da União: unidades diferentes em ${juros} e ${jurosUe}`;
  assert.deepEqual(conferir(juros, recibo(jurosUe)), [unidade]);
  assert.equal(reguaDaMedida(juros).ue, null, 'A seleção voltou a associar milhões de euros à percentagem do PIB.');
  plantas.push({ nome: 'Referência europeia em percentagem junto dos juros em milhões', mensagem: unidade, planta: true, passou: true });
  const id = 'precos-da-habitacao-2025', ue = `${id}-ue`;
  assert.deepEqual(conferir(id, recibo(ue)), []);
  assert.equal(reguaDaMedida(id).ue?.id, ue, 'A seleção perdeu uma referência europeia comparável.');
  const copia = new Map(linhas);
  copia.set(ue, { ...linhas.get(ue), reference_date: linhas.get('precos-da-habitacao-2024').reference_date });
  const periodo = `Enquadramento da União: períodos diferentes em ${id} e ${ue}`;
  assert.deepEqual(conferir(id, recibo(ue), copia), [periodo]);
  plantas.push({ nome: 'Referência europeia de outro período', mensagem: periodo, planta: true, passou: true });
}

const erros = [];
let recibos = 0;
for (const id of linhas.keys()) for (const prefixo of ['livro-razao', 'en/ledger']) {
  const ficheiro = path.join('dist', prefixo, id, 'index.html');
  if (!fs.existsSync(ficheiro)) { erros.push(`Enquadramento da União: recibo ausente ${prefixo}/${id}`); continue; }
  const html = fs.readFileSync(ficheiro, 'utf8');
  if (!html.includes('id="enquadramento"')) continue;
  recibos++;
  erros.push(...conferir(id, html).map(e => `${e} (${prefixo})`));
}
const out = process.argv.indexOf('--out');
if (out >= 0) fs.writeFileSync(process.argv[out + 1], JSON.stringify({ recibos, erros, plantas }, null, 2) + '\n');
console.log(`Enquadramento da União: ${recibos} recibos com referências; ${plantas.length} plantas; ${erros.length} erros.`);
if (erros.length) { console.error(erros.join('\n')); process.exitCode = 1; }
