import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {load} from 'js-yaml';
import {WORKS} from '../../src/data/studies.mjs';import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {conferirHistoria,conferirTestemunhas} from '../../scripts/historia-edicoes-conferir.mjs';
import {conferirEdicoes,rotaPrimeira,rotaAtual} from '../../scripts/edicoes-conferir.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8')),sha=b=>createHash('sha256').update(b).digest('hex');let plantas=0;
for(const [nome,mudar,erro] of [
 ['controlo',()=>{},null],
 ['texto sem versão',c=>fs.appendFileSync(path.join(c.raiz,c.alvo.edicoes.at(-1).file),'x'),'ED1 sha256:'],
 ['versão sem entrada',c=>c.correcoes.splice(0,1),'ED1 entrada:'],
 ['arquivo alterado',c=>fs.appendFileSync(path.join(c.raiz,c.alvo.edicoes[0].file),'x'),'ED1 sha256:'],
 ['entrada sem versão',c=>c.correcoes[0].data='2026-11-01','ED1 órfã:'],
 ['primeira ausente',c=>delete c.alvo.primeira_edicao,'ED1 arquivo:'],
 ['primeira inválida',c=>c.alvo.primeira_edicao.sha256='0'.repeat(64),'ED1 arquivo:'],
 ['segunda atualização conserva a primeira',c=>{
  for(const e of c.manifesto.edicoes.filter(e=>e.slug===c.alvo.slug)){
   const anterior=e.edicoes.at(-1),file=`_edicoes/${e.slug}.${e.lang}.${anterior.data}.html`,atual=anterior.file;
   fs.copyFileSync(path.join(c.raiz,atual),path.join(c.raiz,file));anterior.file=file;
   fs.appendFileSync(path.join(c.raiz,atual),'\n');const digest=sha(fs.readFileSync(path.join(c.raiz,atual)));
   e.edicoes.push({data:'2026-11-03',sha256:digest,file:atual});e.sha256_normalized=digest;
   c.works.find(w=>w.slug===e.slug).editions.find(d=>d.lang===e.lang).updated='2026-11-03';
  }
  c.correcoes.push({...structuredClone(c.correcoes[0]),data:'2026-11-03'});
  assert(c.correcoes.some(e=>e.data==='2026-10-30'));
 },null],
]){
 const raiz=fs.mkdtempSync(path.join(os.tmpdir(),'ed1-historia-'));
 try{
  const c={raiz,manifesto:structuredClone(manifesto),works:structuredClone(WORKS),correcoes:structuredClone(CORRECOES_TEXTO)};c.alvo=c.manifesto.edicoes.find(e=>e.slug==='evora-contas-da-camara-2010-2025');
  for(const e of c.manifesto.edicoes)for(const v of e.edicoes){const f=path.join(raiz,v.file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.copyFileSync(path.join('studies-src',v.file),f);}
  mudar(c);const erros=conferirHistoria(c);if(erro)assert(erros.some(e=>e.startsWith(erro)),nome+': '+erros);else assert.deepEqual(erros,[],nome);plantas++;
 }finally{fs.rmSync(raiz,{recursive:true,force:true});}
}
const bad=conferirTestemunhas(manifesto,()=>Buffer.from('outra história'));assert(bad.erros.length===4);plantas++;
assert.equal(conferirTestemunhas(manifesto,()=>{throw Error('testemunha perdida');}).erros.length,4);plantas++;
const ausente=conferirTestemunhas(manifesto,()=>{throw Error('sem Git');},{permitirAusencia:true});assert.equal(ausente.avisos.length,4);assert.deepEqual(ausente.erros,[]);plantas++;
const args={works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src'};
const alvo=manifesto.edicoes.find(e=>e.primeira_edicao);
const paginas=new Map([['/uma-pagina-fora-dos-estudos',`<a href="${rotaAtual(alvo.slug,alvo.lang)}">Primeira edição, tal como foi publicada</a>`]]);
assert(conferirEdicoes({...args,paginas}).some(e=>e.startsWith('ED1 rótulo:')));plantas++;
console.log(`ED1-E história: ${plantas} controlos e plantas; segunda atualização conserva a entrada anterior; ausência da testemunha é explícita.`);
