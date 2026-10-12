/** RP4-n-j: compara linhas, recibos e HTML com a cabeça anterior à integração. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {pathToFileURL} from 'node:url';
const local = p => pathToFileURL(path.resolve(p));
const {loadClaims} = await import(local('src/lib/ledger.mjs'));
const {conferirAuditoriaDasFamilias} = await import(local('tests/cartao/familias.mjs'));
const {ORIGENS_JD1} = await import(local('src/data/origens-jd1.mjs'));
const base = '3ecc7c72';
const motor = process.env.RESEARCHHUB_DIR;
assert.ok(motor);
const out = process.argv[2];
const baseline = process.argv[3];
assert.ok(out && baseline);
fs.mkdirSync(out,{recursive:true});
const sha = b => createHash('sha256').update(b).digest('hex');
const cabeca = cwd => execFileSync('git',['rev-parse','HEAD'],{cwd,encoding:'utf8'}).trim();
const atual = loadClaims({includeWithdrawn:true});
const antes = structuredClone(atual);
const ids = Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/jd1.json')).rows);
const declaracoes = [];
for(const id of ids) {
 const anterior = load(execFileSync('git',['show',`${base}:ledger/claims/${id}.yml`],{encoding:'utf8'}));
 const agora = load(fs.readFileSync(`ledger/claims/${id}.yml`,'utf8'));
 antes.set(id,anterior);
 const sem = structuredClone(agora);delete sem.definition_sources;
 assert.deepEqual(sem,anterior,`${id}: mudou outro campo além das segundas fontes`);
 if(!agora.definition_sources) continue;
 const fontes = agora.definition_sources.map(s=>{
  // A ordem das chaves JSON não é parte do recibo.
  const iguais = Object.entries(ORIGENS_JD1).filter(([,o])=>{
   try {assert.deepEqual({publisher:o.publicador,url:o.url,receipt:o.selo},s);return true;}catch{return false;}
  });
  assert.ok(iguais.length);
  assert.equal(sha(fs.readFileSync(path.join(motor,s.receipt.motor))),s.receipt.sha256);
  return {...s,origens:iguais.map(([k])=>k)};
 });
 declaracoes.push({id,fontes});
}
const recusas = conferirAuditoriaDasFamilias({linhas:antes}).erros;
const finais = conferirAuditoriaDasFamilias({linhas:atual}).erros;
assert.ok(recusas.length);assert.deepEqual(finais,[]);
const comparacoes=[];
const paginas = ids.flatMap(id=>[`livro-razao/${id}/index.html`,`en/ledger/${id}/index.html`]);
paginas.push('livro-razao/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade/index.html','en/ledger/series/serie-obrigacoes-do-tesouro-10-anos-rendibilidade/index.html','index.html','en/index.html','livro-razao/index.html','en/ledger/index.html');
for(const rel of paginas) {
 const a=fs.readFileSync(path.join(baseline,'dist',rel)),d=fs.readFileSync(path.join('dist',rel));
 const normalizar = bytes => {
  const root = parse(bytes.toString());
  // Só se retira definition_sources dos JSON; o restante HTML é comparado.
  for(const el of root.querySelectorAll('script')) {
   const type=el.getAttribute('type');
   if(type==='application/json' || type==='application/ld+json') {
    let obj;
    try {obj=JSON.parse(el.textContent);}catch{continue;}
    function limpar(x) {if(!x || typeof x!=='object') return;if(Array.isArray(x)){x.forEach(limpar);return;}delete x.definition_sources;Object.values(x).forEach(limpar);}
    limpar(obj);el.set_content(JSON.stringify(obj));
   }
  }
  return root.toString();
 };
 const na=normalizar(a),nd=normalizar(d);
 comparacoes.push({pagina:rel,antes:sha(a),depois:sha(d),iguais:a.equals(d),iguais_sem_definition_sources:na===nd});
 if(na!==nd) {fs.writeFileSync(path.join(out,rel.replaceAll('/','_')+'.antes.html'),na);fs.writeFileSync(path.join(out,rel.replaceAll('/','_')+'.depois.html'),nd);}
}
const jsonComparados=[];
for(const rel of ['livro-razao.json',...ids.map(id=>`livro-razao/${id}.json`)]) {
 const a=fs.readFileSync(path.join(baseline,'dist',rel)),d=fs.readFileSync(path.join('dist',rel));
 const antigo=JSON.parse(a),novo=JSON.parse(d);
 function semFontes(x) {
  if(!x || typeof x!=='object') return;
  if(Array.isArray(x)){x.forEach(semFontes);return;}
  delete x.definition_sources;Object.values(x).forEach(semFontes);
 }
 semFontes(antigo);semFontes(novo);
 assert.deepEqual(novo,antigo,`${rel}: outro campo mudou`);
 jsonComparados.push({ficheiro:rel,antes:sha(a),depois:sha(d),iguais:a.equals(d),apenas_definition_sources:true});
}
function htmlAbaixo(pasta) {
 const encontrados=[];
 function andar(rel) {for(const e of fs.readdirSync(path.join(pasta,rel),{withFileTypes:true})) {
  const p=path.join(rel,e.name);if(e.isDirectory())andar(p);else if(e.isFile()&&p.endsWith('.html'))encontrados.push(p);
 }}
 andar('');return encontrados.sort();
}
const htmlAntes=htmlAbaixo(path.join(baseline,'dist')),htmlDepois=htmlAbaixo('dist');
assert.deepEqual(htmlDepois,htmlAntes,'Mudou o conjunto de páginas HTML.');
const alteradas=htmlAntes.filter(rel=>!fs.readFileSync(path.join(baseline,'dist',rel)).equals(fs.readFileSync(path.join('dist',rel))));
assert.deepEqual(alteradas,[],'Mudou HTML fora dos JSON das linhas.');
const htmlTodo={paginas_antes:htmlAntes.length,paginas_depois:htmlDepois.length,alteradas};
const resultado={base,cabecas:{sitio:cabeca('.'),motor:cabeca(motor)},declaracoes,recusas_antes:recusas,recusas_depois:finais,comparacoes,json:jsonComparados,html_todo:htmlTodo};
fs.writeFileSync(path.join(out,'integracao.json'),JSON.stringify(resultado,null,2)+'\n');
assert.ok(comparacoes.every(x=>x.iguais_sem_definition_sources),'O HTML tem diferenças adicionais.');
console.log(JSON.stringify({linhas:declaracoes.length,recusas_antes:recusas.length,recusas_depois:finais.length,paginas:comparacoes.length,json:jsonComparados.length}));
