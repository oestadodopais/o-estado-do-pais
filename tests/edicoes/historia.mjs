import './testemunhas.mjs';
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
  const dataNova=new Date(Date.parse(c.alvo.edicoes.at(-1).data)+86400000).toISOString().slice(0,10);
  for(const e of c.manifesto.edicoes.filter(e=>e.slug===c.alvo.slug)){
   const anterior=e.edicoes.at(-1),file=`_edicoes/${e.slug}.${e.lang}.${anterior.data}.html`,atual=anterior.file;
   fs.copyFileSync(path.join(c.raiz,atual),path.join(c.raiz,file));anterior.file=file;
   fs.appendFileSync(path.join(c.raiz,atual),'\n');const digest=sha(fs.readFileSync(path.join(c.raiz,atual)));
   e.edicoes.push({data:dataNova,sha256:digest,file:atual});e.sha256_normalized=digest;
   c.works.find(w=>w.slug===e.slug).editions.find(d=>d.lang===e.lang).updated=dataNova;
  }
  c.correcoes.push({...structuredClone(c.correcoes[0]),data:dataNova,kind:'texto'});
  assert(c.correcoes.some(e=>e.slug===c.alvo.slug&&e.data==='2026-11-02'));
 },null],
]){
 const raiz=fs.mkdtempSync(path.join(os.tmpdir(),'ed1-historia-'));
 try{
  const c={raiz,manifesto:structuredClone(manifesto),works:structuredClone(WORKS),correcoes:structuredClone(CORRECOES_TEXTO)};c.alvo=c.manifesto.edicoes.find(e=>e.slug==='orcamento-2027-o-que-muda-e-para-quem');c.correcoes.sort((a,b)=>Number(b.slug===c.alvo.slug)-Number(a.slug===c.alvo.slug)||a.data.localeCompare(b.data));
  for(const e of c.manifesto.edicoes)for(const v of e.edicoes){const f=path.join(raiz,v.file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.copyFileSync(path.join('studies-src',v.file),f);}
  mudar(c);const erros=conferirHistoria(c);if(erro)assert(erros.some(e=>e.startsWith(erro)),nome+': '+erros);else assert.deepEqual(erros,[],nome);plantas++;
 }finally{fs.rmSync(raiz,{recursive:true,force:true});}
}
const testemunhas=['orcamento-2027-o-que-muda-e-para-quem','a-casa-em-portugal-e-na-europa','evora-prometido-pago-auditado-2026','evora-orcamentado-pago-devido-2025','evora-2027-prometido-painel-dinheiro','evora-economia-e-dinheiro-publico-de-fora-da-camara'].flatMap(slug=>['pt','en'].map(lang=>slug+'/'+lang)).concat('penalizacoes-por-reforma-antecipada-2026/pt', 'evora-economia-investidores-portas-abertas-2026/pt', 'evora-quinze-anos-cinco-mandatos/pt', 'onde-esta-a-agua/pt', 'onde-esta-a-agua/en', 'agua-nao-faturada/pt', 'agua-nao-faturada/en', 'alentejo-algarve/en');
assert.deepEqual(manifesto.edicoes.filter(e=>e.primeira_edicao).map(e=>e.slug+'/'+e.lang).sort(),testemunhas.sort());
testemunhas.push(...['evora-contas-da-camara-2010-2025','evora-2027-capital-europeia-da-cultura'].flatMap(slug=>['pt','en'].map(lang=>slug+'/'+lang)));
const bad=conferirTestemunhas(manifesto,()=>Buffer.from('outra história'));assert(bad.erros.length===testemunhas.length);plantas++;
assert.equal(conferirTestemunhas(manifesto,()=>{throw Error('testemunha perdida');}).erros.length,testemunhas.length);plantas++;
const ausente=conferirTestemunhas(manifesto,()=>{throw Error('sem Git');},{permitirAusencia:true});assert.equal(ausente.avisos.length,testemunhas.length);assert.deepEqual(ausente.erros,[]);plantas++;
const args={works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src'};
const alvo=manifesto.edicoes.find(e=>e.slug==='orcamento-2027-o-que-muda-e-para-quem'&&e.lang==='pt'&&e.primeira_edicao);
const paginas=new Map([['/uma-pagina-fora-dos-estudos',`<a href="${rotaAtual(alvo.slug,alvo.lang)}">Primeira edição, tal como foi publicada</a>`]]);
assert(conferirEdicoes({...args,paginas}).some(e=>e.startsWith('ED1 rótulo:')));plantas++;
console.log(`ED1-E história: ${plantas} controlos e plantas; segunda atualização conserva a entrada anterior; ausência da testemunha é explícita.`);
