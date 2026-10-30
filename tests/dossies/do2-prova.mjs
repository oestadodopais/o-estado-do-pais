/** DO2: cinco adulterações exercem o portão completo numa cópia temporária. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
const raiz=process.cwd(), copia=fs.mkdtempSync(path.join(os.tmpdir(),'oedp-do2-prova-'));
const resumo=process.argv[2];
assert(resumo,'Falta o caminho do resumo');
function resumoDaArvore(dir) {
 const h=createHash('sha256');
 const anda=p=>{for(const e of fs.readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=path.join(p,e.name);if(e.isDirectory())anda(f);else if(e.isFile()){h.update(path.relative(dir,f));h.update(fs.readFileSync(f));}}};
 anda(dir);return h.digest('hex');
}
const antes=resumoDaArvore(path.join(raiz,'dist'));
for(const nome of fs.readdirSync(raiz)) {
 if(['dist','src','scripts','tests'].includes(nome))execFileSync('cp',['-al',path.join(raiz,nome),path.join(copia,nome)]);
 else fs.symlinkSync(path.join(raiz,nome),path.join(copia,nome));
}
// O portão escreve a sua prova; desfaz-se esse elo antes de o executar.
fs.rmSync(path.join(copia,'dist/prova.json'),{force:true});
const ficheiros=['src/lib/prova.mjs','dist/dossies/orcamento-2027/index.html','dist/index.html'];
const originais=new Map(ficheiros.map(f=>[f,fs.readFileSync(path.join(copia,f),'utf8')]));
const escrever=(f,s)=>{fs.rmSync(path.join(copia,f));fs.writeFileSync(path.join(copia,f),s);};
const repor=()=>{for(const [f,s] of originais)escrever(f,s);};
const resultados=[];
function correr(nome,chave) {
 const log=path.join(copia,`ensaio-${resultados.length}.log`), fd=fs.openSync(log,'w');
 const r=spawnSync(process.execPath,['scripts/gate-html.mjs'],{cwd:copia,stdio:['ignore',fd,fd],timeout:240000});fs.closeSync(fd);
 const texto=fs.readFileSync(log,'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 if(!chave)assert.equal(r.status,0,`Controlo recusado: ${texto.slice(-3000)}`);
 else {assert.equal(r.status,1,`${nome}: portão não recusou`);assert(texto.includes(chave),`${nome}: chave ausente da recusa`);}
 resultados.push({nome,codigo:r.status,chave:chave??null,recusa:chave?texto.split('\n').find(l=>l.includes(chave))?.trim():null});
 console.log(`${nome}: código ${r.status}${chave?' · '+chave:''}`);
}
try {
 correr('controlo intacto');
 escrever(ficheiros[0],originais.get(ficheiros[0]).replace('Object.values(d.pecas).reduce((n, pecas) => n + pecas.length, 0)','(Object.values(d.pecas).reduce((n, pecas) => n + pecas.length, 0) + 1)'));
 correr('peças declaradas a mais','dossie_pecas_orcamento_2027');repor();
 const d=parse(originais.get(ficheiros[1]));d.querySelector('[data-dossie-peca]').removeAttribute('data-dossie-peca');escrever(ficheiros[1],d.toString());
 correr('marca de uma peça retirada','dossie_pecas_orcamento_2027');repor();
 escrever(ficheiros[0],originais.get(ficheiros[0]).replace('d.pecas.itens.length, routePath','d.pecas.itens.length + 1, routePath'));
 correr('itens declarados a mais','dossie_itens_orcamento_2027');repor();
 for(const [nome,mudar] of [
  ['contagem com destino trocado',n=>n.closest('a').setAttribute('href','/estado-e-economia/')],
  ['contagem fora da ligação',n=>{const a=n.closest('a');n.remove();a.insertAdjacentHTML('afterend',n.outerHTML);}],
 ]) {const home=parse(originais.get(ficheiros[2]));mudar(home.querySelector('[data-novidades] [data-prova]'));escrever(ficheiros[2],home.toString());correr(nome,'dossie_pecas_orcamento_2027');repor();}
} finally {
 assert.equal(resumoDaArvore(path.join(raiz,'dist')),antes,'O dist original foi alterado');
 fs.mkdirSync(path.dirname(resumo),{recursive:true});
 fs.writeFileSync(resumo,JSON.stringify({distOriginalIntacto:true,resultados},null,2)+'\n');
}
