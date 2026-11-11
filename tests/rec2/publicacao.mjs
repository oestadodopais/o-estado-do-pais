import assert from 'node:assert/strict';
import fs from 'node:fs';
import { WORKS } from '../../src/data/studies.mjs';
import { temLeitura, leituraDe } from '../../src/data/leituras.mjs';
import { eventoDeEstudosRetirados } from '../../src/lib/agenda-retirada.mjs';
import { ISENCAO_VOZ2 } from '../../scripts/voz-autorreferencia.mjs';
import { rotasDaProsa, conferirAmbito } from '../../scripts/frases-com-afirmacao.mjs';
const retirados = WORKS.filter(w => w.estado === 'retirado');
const rotas = rotasDaProsa();
assert(rotas.every(r => !retirados.some(w => r.estudo === w.slug)));
for (const w of WORKS.filter(w => w.estado !== 'retirado')) for (const base of ['/estudos/', '/en/studies/']) assert(rotas.some(r => r.rota === base + w.slug));
const rotaReposta = `estudos/${retirados[0].slug}/index.html`;
assert.deepEqual(conferirAmbito([rotaReposta], rotas), [rotaReposta]);
for (const w of retirados) {
  assert.equal(temLeitura(w.id), false);
  assert.equal(leituraDe(w.id), null);
  assert(!ISENCAO_VOZ2.estudos.includes(w.slug));
}
for (const [file, campo, chave] of [
  ['ledger/frases/por-registar.json', 'estudo'],
  ['scripts/voz-excecoes.json', 'rota'],
  ['src/data/datas-de-publicacao.json', 'slug', 'edicoes'],
]) {
  const data = JSON.parse(fs.readFileSync(file,'utf8'));
  for (const e of chave ? data[chave] : data) assert(!retirados.some(w => e[campo].includes(w.slug)), `${file}: entrada retirada`);
}
const works = [{slug:'antigo',estado:'retirado'},{slug:'vivo'}];
const agenda = {itens:[{criterios:[{evento:'evento',documentos:[{slug:'antigo'}]}]}]};
assert.equal(eventoDeEstudosRetirados({id:'evento',afecta_linhas:[]},agenda,works),true);
assert.equal(eventoDeEstudosRetirados({id:'evento',afecta_linhas:['linha-viva']},agenda,works),false);
assert.equal(eventoDeEstudosRetirados({id:'outro'},agenda,works),false);
agenda.itens[0].criterios[0].documentos.push({slug:'vivo'});
assert.equal(eventoDeEstudosRetirados({id:'evento'},agenda,works),false);
console.log('REC2 publicação: listas sem retirados; leitura oculta; evento exclusivo sai, evento misto e linhas vivas ficam.');
