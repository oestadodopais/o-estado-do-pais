/** HIG-6A: plantas históricas e listas correntes; corre depois da construção. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {recusaVoz, conferirLista, conferir, lerDocumentos, recusas, conferirQuantificadores, separarRetirados, conferirSaltadas} from '../../scripts/leituras/conferir-frases.mjs';
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
// EVA: as frases do estudo das contas saíram com o texto julgado; a lista histórica fica intacta.
const pastaEVA = fs.mkdtempSync(path.join(os.tmpdir(), 'eva-voz-aplicada-'));
try {
 const slug='evora-contas-da-camara-2010-2025';
 // As mesmas frases continuam noutros documentos: só as portas do texto substituído saem.
 const historica=JSON.parse(fs.readFileSync(A, 'utf8'));
 const {ativas, saltadas}=separarRetirados(historica);
 const ambito=new Set(ativas.filter(f=>f.estudo!==slug).map(f=>f.estudo));
 const lista = ativas.flatMap(f => {
  if(f.estudo!==slug)return [f];
  const paginas=f.paginas.filter(p=>!p.includes('/'+slug));
  return paginas.length ? [{...f,estudo:paginas[0].match(/^\/(?:estudos|en\/studies)\/([^/]+)/)[1],paginas}] : [];
 });
 const file = path.join(pastaEVA, 'lista.json'); fs.writeFileSync(file, JSON.stringify(lista));
 const {documentos,bilingues}=lerDocumentos(lista,'dist');
 // Uma porta adicional continua a conferir só a presença, como antes da retirada.
 for(const d of documentos)d.soPresenca=!ambito.has(d.estudo);
 provas.atualA = conferir(lista,documentos,bilingues,{aplicada:true});
 provas.atualA.saltadas=saltadas;
 assert.equal(conferirSaltadas(historica, provas.atualA.saltadas),85);
} finally { fs.rmSync(pastaEVA, {recursive:true, force:true}); }
assert.equal(recusas(provas.atualA), 0, JSON.stringify(provas.atualA));
// A adenda D substitui seis novas da lista inicial; as listas declaradas ficam intactas.
const D = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-d.json';
const sucessoras = JSON.parse(fs.readFileSync(D,'utf8')).filter(f=>f.classe==='REESCREVE');
const G = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-g.json';
const sucessorasG = JSON.parse(fs.readFileSync(G,'utf8')).filter(f=>f.classe==='REESCREVE');
const inicialAgua = JSON.parse(fs.readFileSync(C,'utf8'));
const substituidas=[];
for(const f of inicialAgua) for(const d of sucessoras) if(f.nova?.includes(d.frase)) {
 f.nova=f.nova.replace(d.frase,d.nova);substituidas.push(f.id);
}
assert.deepEqual(substituidas.sort(),['CA26','CA27','CA30','CA31','CA35','CA36']);
const substituidasG=[];
for(const f of inicialAgua) for(const g of sucessorasG) if(f.nova?.includes(g.frase)) {f.nova=f.nova.replace(g.frase,g.nova);substituidasG.push(f.id);}
assert.deepEqual(substituidasG.sort(),['CA18','CA19','CA26','CA27','CA30','CA31']);
const listaD=JSON.parse(fs.readFileSync(D,'utf8'));
let substituidasDG=0;
for(const f of listaD) for(const g of sucessorasG) if(f.nova?.includes(g.frase)) {f.nova=f.nova.replace(g.frase,g.nova);substituidasDG++;}
assert.equal(substituidasDG,2);
// A adenda I divide a conclusão; as três listas anteriores mantêm a sucessão explícita.
const I = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-i.json';
const sucessorasI=JSON.parse(fs.readFileSync(I,'utf8')).filter(f=>f.classe==='REESCREVE');
const listaG=JSON.parse(fs.readFileSync(G,'utf8'));
for(const lista of [inicialAgua,listaD,listaG]) {
 let n=0;
 for(const f of lista) for(const i of sucessorasI) if(f.nova?.includes(i.frase)) {f.nova=f.nova.replace(i.frase,i.nova);n++;}
 assert.equal(n,2);
}
// A adenda J explicita que os encargos acrescem à tarifa.
const J = 'design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-j.json';
const sucessorasJ=JSON.parse(fs.readFileSync(J,'utf8')).filter(f=>f.classe==='REESCREVE');
const listaI=JSON.parse(fs.readFileSync(I,'utf8'));
for(const lista of [inicialAgua,listaD,listaG,listaI]) {
 let n=0;
 for(const f of lista) for(const j of sucessorasJ) if(f.nova?.includes(j.frase)) {f.nova=f.nova.replace(j.frase,j.nova);n++;}
 assert.equal(n,2);
}
const pastaAgua=fs.mkdtempSync(path.join(os.tmpdir(),'coragua-sucessao-'));
try {
 const ficheiro=path.join(pastaAgua,'lista.json');fs.writeFileSync(ficheiro,JSON.stringify(inicialAgua));
 provas.corAgua = conferirLista(ficheiro, 'dist', {aplicada:true});
 const ficheiroD=path.join(pastaAgua,'lista-d.json');fs.writeFileSync(ficheiroD,JSON.stringify(listaD));
 provas.corAguaD=conferirLista(ficheiroD,'dist',{aplicada:true});
 const ficheiroG=path.join(pastaAgua,'lista-g.json');fs.writeFileSync(ficheiroG,JSON.stringify(listaG));
 provas.corAguaG=conferirLista(ficheiroG,'dist',{aplicada:true});
 const ficheiroI=path.join(pastaAgua,'lista-i.json');fs.writeFileSync(ficheiroI,JSON.stringify(listaI));
 provas.corAguaI=conferirLista(ficheiroI,'dist',{aplicada:true});
} finally {fs.rmSync(pastaAgua,{recursive:true,force:true});}
provas.corAguaJ = conferirLista(J, 'dist', {aplicada:true});
assert.equal(recusas(provas.corAguaJ),0,JSON.stringify(provas.corAguaJ));
assert.equal(recusas(provas.corAguaI),0,JSON.stringify(provas.corAguaI));
assert.equal(recusas(provas.corAguaG),0,JSON.stringify(provas.corAguaG));
assert.equal(recusas(provas.corAguaD),0,JSON.stringify(provas.corAguaD));
assert.equal(recusas(provas.corAgua), 0, JSON.stringify(provas.corAgua));
provas.prr = conferirLista('design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA-prr.json', 'dist', {aplicada:true});
assert.equal(recusas(provas.prr), 0, JSON.stringify(provas.prr));
provas.atualB = conferirLista(B);
assert.equal(provas.atualB.voz.length, 0);
assert.equal(provas.atualB.numeros.length, 0);
// As 42 entradas da água passaram para a COR-AGUA; as restantes ficam na VOZ-2B.
assert.equal(provas.atualB.quantificadores.length, 13);
assert.equal(provas.atualB.saltadas.length, 53);
assert.equal(provas.corAgua.saltadas.length, 32);
assert.equal(provas.atualB.presenca.length, 0, 'Todas as entradas não retiradas da VOZ-2B têm de estar nas páginas declaradas');
assert.deepEqual(provas.atualB.semPar, []);
assert.equal(provas.atualB.semEntrada.length, 9);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-historica-'));
try {
  const f = path.join(tmp, 'lista.json'); fs.writeFileSync(f, JSON.stringify(inicial));
  provas.inicialCompleta = conferirLista(f);
  assert.equal(provas.inicialCompleta.voz.length, 6);
  assert(recusas(provas.inicialCompleta));
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
for (const [nome, r] of [['VOZ-2A atual', provas.atualA], ['VOZ-2B atual', provas.atualB], ['COR-AGUA', provas.corAgua], ['COR-AGUA PRR', provas.prr], ['COR-AGUA D', provas.corAguaD], ['COR-AGUA G', provas.corAguaG], ['COR-AGUA I', provas.corAguaI], ['COR-AGUA J', provas.corAguaJ], ['VOZ-2A inicial', provas.inicialCompleta]]) console.log(nome + ': ' + JSON.stringify(Object.fromEntries(Object.entries(r).map(([k,v]) => [k,v.length]))));
console.log('pré-G: ' + provas.quantificadoresAntesGRaw.length + ' entradas sem campo; ' + provas.quantificadoresNovosAntesG.length + ' entradas novas, ' + provas.frasesNovasAntesG.length + ' frases distintas');
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(provas, null, 2) + '\n');
