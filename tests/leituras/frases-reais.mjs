/** HIG-6A: plantas históricas e listas correntes; corre depois da construção. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {recusaVoz, conferirLista, recusas, conferirQuantificadores} from '../../scripts/leituras/conferir-frases.mjs';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
process.chdir(raiz);
const A = 'design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json';
const B = 'design/especime-v3/medicoes/voz2b-2026-11-07/FRASES-VOZ-2B.json';
const C = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA.json';
const antiga = rev => JSON.parse(execFileSync('git', ['show', rev + ':' + A], {encoding:'utf8'}));
const quant = conferirQuantificadores;
const norm = t => t.replace(/\u200b/g, '').trim();
const provas = {};
const inicial = antiga('ab948c410');
provas.vozInicial = inicial.filter(f => f.nova && recusaVoz(f.nova).length).map(f => f.id);
assert.equal(provas.vozInicial.length, 10);
const antesG = antiga('14f931195');
provas.quantificadoresAntesGRaw = quant(antesG);
// O campo não existia. Declarações já documentadas antes de G, com os IDs do motor:
// V030 e V152 (adenda D, base-sem-contratos) e V188 (e2027-no-consolidated-budget).
for (const f of antesG) if (['V030', 'V152', 'V188'].includes(f.id)) f.assercao = f.id === 'V188' ? 'e2027-no-consolidated-budget' : 'base-sem-contratos';
provas.quantificadoresNovosAntesG = quant(antesG);
const ids = new Set(provas.quantificadoresNovosAntesG.map(f => f.id));
provas.frasesNovasAntesG = [...new Set(antesG.filter(f => ids.has(f.id)).map(f => norm(f.nova)))];
assert.equal(provas.frasesNovasAntesG.length, 3);
assert.deepEqual([...ids].sort(), ['V032','V040','V182','V195']);
provas.atualA = conferirLista(A, 'dist', {aplicada:true});
assert.equal(recusas(provas.atualA), 0, JSON.stringify(provas.atualA));
// A adenda D substitui seis novas da lista inicial; as listas declaradas ficam intactas.
const D = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-d.json';
const sucessoras = JSON.parse(fs.readFileSync(D,'utf8')).filter(f=>f.classe==='REESCREVE');
const inicialAgua = JSON.parse(fs.readFileSync(C,'utf8'));
const substituidas=[];
for(const f of inicialAgua) for(const d of sucessoras) if(f.nova?.includes(d.frase)) {
 f.nova=f.nova.replace(d.frase,d.nova);substituidas.push(f.id);
}
assert.deepEqual(substituidas.sort(),['CA26','CA27','CA30','CA31','CA35','CA36']);
const pastaAgua=fs.mkdtempSync(path.join(os.tmpdir(),'coragua-sucessao-'));
try {
 const ficheiro=path.join(pastaAgua,'lista.json');fs.writeFileSync(ficheiro,JSON.stringify(inicialAgua));
 provas.corAgua = conferirLista(ficheiro, 'dist', {aplicada:true});
} finally {fs.rmSync(pastaAgua,{recursive:true,force:true});}
provas.corAguaD = conferirLista(D, 'dist', {aplicada:true});
assert.equal(recusas(provas.corAguaD),0,JSON.stringify(provas.corAguaD));
assert.equal(recusas(provas.corAgua), 0, JSON.stringify(provas.corAgua));
provas.prr = conferirLista('design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-prr.json', 'dist', {aplicada:true});
assert.equal(recusas(provas.prr), 0, JSON.stringify(provas.prr));
provas.atualB = conferirLista(B);
assert.equal(provas.atualB.voz.length, 0);
assert.equal(provas.atualB.numeros.length, 0);
// As 42 entradas da água passaram para a COR-AGUA; as restantes ficam na VOZ-2B.
assert.equal(provas.atualB.quantificadores.length, 26);
assert.equal(provas.atualB.presenca.length, 0, 'Todas as entradas da VOZ-2B têm de estar nas páginas declaradas');
assert.deepEqual(provas.atualB.semPar, []);
assert.equal(provas.atualB.semEntrada.length, 9);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-historica-'));
try {
  const f = path.join(tmp, 'lista.json'); fs.writeFileSync(f, JSON.stringify(inicial));
  provas.inicialCompleta = conferirLista(f);
  assert.equal(provas.inicialCompleta.voz.length, 10);
  assert(recusas(provas.inicialCompleta));
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
for (const [nome, r] of [['VOZ-2A atual', provas.atualA], ['VOZ-2B atual', provas.atualB], ['COR-AGUA', provas.corAgua], ['COR-AGUA PRR', provas.prr], ['COR-AGUA D', provas.corAguaD], ['VOZ-2A inicial', provas.inicialCompleta]]) console.log(nome + ': ' + JSON.stringify(Object.fromEntries(Object.entries(r).map(([k,v]) => [k,v.length]))));
console.log('pré-G: ' + provas.quantificadoresAntesGRaw.length + ' entradas sem campo; ' + provas.quantificadoresNovosAntesG.length + ' entradas novas, ' + provas.frasesNovasAntesG.length + ' frases distintas');
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(provas, null, 2) + '\n');
