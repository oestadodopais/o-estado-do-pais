/** HB1-b: estragos em cópias, contra o portão inteiro, sem alterar a construção. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';
const raiz=process.cwd(), saida=process.argv[2];
assert(saida,'indique uma pasta de saída nova');fs.mkdirSync(saida,{recursive:false});
const slug='a-casa-em-portugal-e-na-europa', resultados=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function correr(nome, alvos, alterar, mensagens) {
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hb1-planta-'));
 const copias=new Set(['scripts/gate-html.mjs',...alvos]);
 function espelhar(rel='') {
  for(const d of fs.readdirSync(path.join(raiz,rel),{withFileTypes:true})) {
   const f=path.join(rel,d.name), destino=path.join(tmp,f), origem=path.join(raiz,f);
   if(f==='dist'){fs.cpSync(origem,destino,{recursive:true,mode:fs.constants.COPYFILE_FICLONE});continue;}
   if(copias.has(f)){fs.copyFileSync(origem,destino);continue;}
   if([...copias].some(c=>c.startsWith(f+path.sep))){fs.mkdirSync(destino);espelhar(f);}
   else fs.symlinkSync(origem,destino);
  }
 }
 try {
  espelhar();
  if(nome==='superficies'){
   const base=spawnSync(process.execPath,['scripts/gate-html.mjs'],{cwd:tmp,encoding:'utf8',maxBuffer:32*1024*1024});
   fs.writeFileSync(path.join(saida,'positivo.log'),((base.stdout??'')+(base.stderr??'')).split(tmp).join('<temporario>').split(raiz).join('<worktree>'));
   assert.equal(base.status,0,'a cópia positiva tem de passar');
  }
  const antes=Object.fromEntries(alvos.map(f=>[f,hash(fs.readFileSync(path.join(raiz,f)))]));
  alterar(tmp);
  const provas=alvos.map(f=>({ficheiro:f,original:antes[f],planta:hash(fs.readFileSync(path.join(tmp,f)))}));
  const r=spawnSync(process.execPath,['scripts/gate-html.mjs'],{cwd:tmp,encoding:'utf8',maxBuffer:32*1024*1024});
  const log=(r.stdout??'')+(r.stderr??'');
  fs.writeFileSync(path.join(saida,nome+'.log'),log.split(tmp).join('<temporario>').split(raiz).join('<worktree>'));
  const mordidas=mensagens.map(m=>({mensagem:m,mordeu:log.includes(m)}));
  resultados.push({planta:nome,codigo:r.status,provas,mordidas});
  assert(r.status!==0&&r.status!==null,nome+': o portão não recusou');
  assert(mordidas.every(m=>m.mordeu),nome+': falta uma mordida esperada');
  for(const f of alvos)assert.equal(hash(fs.readFileSync(path.join(raiz,f))),antes[f],'a produção mudou');
 } finally {fs.rmSync(tmp,{recursive:true,force:true});}
}
const estudos=['pt','en'].map(l=>`dist/${l==='pt'?'estudos':'en/studies'}/${slug}/index.html`);
const citacoes=['dist/livro-razao/hab-dl97-deducao/index.html','dist/en/ledger/hab-dl97-deducao/index.html'];
const cartoes=['pt','en'].map(l=>`dist/cartoes/${l==='pt'?'livro-razao':'en-ledger'}-hab-dl97-deducao.${l}.1200x600.json`);
try {
 correr('superficies',[...estudos,...citacoes,...cartoes],tmp=>{
  for(const f of estudos){const p=path.join(tmp,f),r=parse(fs.readFileSync(p,'utf8'));
   r.querySelector('.estudo-leitura').removeAttribute('class');
   r.querySelector('[data-registo-row="sobrecarga-do-custo-da-habitacao-2025"]').nextElementSibling.remove();
   fs.writeFileSync(p,r.toString());}
  for(const f of citacoes){const p=path.join(tmp,f),r=parse(fs.readFileSync(p,'utf8'));
   r.querySelector('[data-claim="hab-dl97-deducao"]').set_content('citação alterada 987654321');fs.writeFileSync(p,r.toString());}
  for(const f of cartoes){const p=path.join(tmp,f),r=JSON.parse(fs.readFileSync(p));r.valores.find(v=>v.origem==='nome-hb1').texto='nome alterado';fs.writeFileSync(p,JSON.stringify(r));}
 },['a leitura rendida não contém exatamente as três secções','a figura tem linha no livro-razão','987654321','o nome HB1 do cartão difere']);
 correr('resumo-serie',['ledger/provas/hb1/series.json'],tmp=>{
  const p=path.join(tmp,'ledger/provas/hb1/series.json'),r=JSON.parse(fs.readFileSync(p));Object.values(r.rows)[0].sha256='0'.repeat(64);fs.writeFileSync(p,JSON.stringify(r));
 },['HB1: recompor a série alterada']);
 fs.writeFileSync(path.join(saida,'plantas-portao.json'),JSON.stringify({codigo:0,plantas:resultados},null,2)+'\n');
 console.log(JSON.stringify({codigo:0,plantas:resultados.map(r=>({planta:r.planta,codigo:r.codigo,mordidas:r.mordidas}))}));
} catch(e) {
 fs.writeFileSync(path.join(saida,'plantas-portao.json'),JSON.stringify({codigo:1,erro:e.message,plantas:resultados},null,2)+'\n');throw e;
}
