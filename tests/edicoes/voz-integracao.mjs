/** OG1-E J: o portão real lê cópias, com os códigos e a medição que produziu. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {leInventario} from '../../scripts/voz.mjs';
import {textoDaVoz} from '../../scripts/voz-edicoes.mjs';
import {fraseRetiradaNoTexto,normalizaEspacosDaRetirada} from '../../scripts/titulos-publicados.mjs';
const raiz=process.cwd(),retiradas=leInventario(raiz).linhas.filter(l=>l.estado==='retirada');
const declaradas=fs.readFileSync('design/especime-v3/INVENTARIO-FRASES.md','utf8').split('\n').filter(l=>/\|\s*retirada\s*\|/.test(l)).length;assert.equal(retiradas.length,declaradas,'há retiradas fora do leitor da voz');
const espacadas=retiradas.filter(l=>/[«“]\s|\s[»”]/u.test(l.texto));
const comTexto=espacadas.filter(l=>/[«“]\s+[^«»“”\s][^«»“”]*[»”]|[«“][^«»“”]*[^«»“”\s]\s+[»”]/u.test(l.texto));
assert.equal(comTexto.length,1);const dgal=comTexto[0];assert(dgal.texto.includes('DGAL'));
const esc=s=>s.replaceAll('<','&lt;').replaceAll('>','&gt;');
const nova=s=>esc(s).replace(/([«“])\s*([^«»“”]*?)\s*([»”])/gu,(_,a,t,b)=>`${a}<span lang="pt-PT">${t.trim()}</span>${b}`);
const antiga=no=>{const partes=[];const anda=n=>{if(n.nodeType===3)partes.push(n.rawText);else for(const f of n.childNodes??[])anda(f);};anda(no);return partes.join(' ').replace(/\s+/g,' ').trim();};
const parametrizadas=retiradas.filter(l=>/<[^>]+>/.test(l.texto));
for(const l of retiradas){
 if(parametrizadas.includes(l)){assert(fraseRetiradaNoTexto(l.texto,l.texto));assert(fraseRetiradaNoTexto(normalizaEspacosDaRetirada(l.texto),l.texto));continue;}
 assert(fraseRetiradaNoTexto(antiga(parse(`<p>${esc(l.texto)}</p>`)),l.texto),`retirada antiga deixou de morder: ${l.n}`);
 assert(fraseRetiradaNoTexto(textoDaVoz(parse(`<p>${nova(l.texto)}</p>`)),l.texto),`retirada nova deixou de morder: ${l.n}`);
}
const copia=fs.mkdtempSync(path.join(os.tmpdir(),'og1ej-voz-'));
const rotas=['correcoes/index.html','en/corrections/index.html','en/municipalities/abrantes/index.html','municipios/abrantes/index.html'];
const originais=new Map(rotas.map(r=>[r,fs.readFileSync(path.join(raiz,'dist',r),'utf8')]));
const sha=s=>createHash('sha256').update(s).digest('hex');
const resultados=[];
function ligarArvore(origem,destino){
 fs.mkdirSync(destino,{recursive:true});
 for(const e of fs.readdirSync(origem,{withFileTypes:true})){
  const a=path.join(origem,e.name),b=path.join(destino,e.name);
  if(e.isDirectory())ligarArvore(a,b);
  else {try{fs.linkSync(a,b);}catch{fs.copyFileSync(a,b);}}
 }
}
function escrever(rota,texto){const f=path.join(copia,'dist',rota);fs.unlinkSync(f);fs.writeFileSync(f,texto);}
function executar(nome,muda,esperado,linhas=[]){
 for(const [r,s] of originais)escrever(r,s);
 muda();const medicao=path.join(copia,'medicao.json');
 const r=spawnSync(process.execPath,['scripts/check-voz.mjs','--medicao',medicao],{cwd:copia,env:{...process.env,OEDP_DIST:path.join(copia,'dist')},encoding:'utf8',maxBuffer:128*1024*1024});
 assert.equal(r.signal,null,`${nome}: sinal ${r.signal}`);
 if(r.status!==esperado)console.error((r.stdout+r.stderr).split('\n').slice(-15).join('\n').replaceAll(copia,'<temporario>').replaceAll(raiz,'<worktree>'));
 assert.equal(r.status,esperado,`${nome}: código inesperado`);
 const medidas=JSON.parse(fs.readFileSync(medicao,'utf8')).frases_da_casa.declaracoes.retiradas_que_rendem;
 const vistas=new Set(medidas.map(l=>l.n));
 for(const n of linhas)assert(vistas.has(n),`${nome}: a voz não recusou a retirada ${n}`);
 resultados.push({nome,codigo:r.status,retiradas_exigidas:linhas.length,retiradas_recusadas:linhas.filter(n=>vistas.has(n)).length,linhas});
 console.log(`${nome}: código lido ${r.status}; ${linhas.length} retiradas conferidas.`);
}
try{
 for(const e of fs.readdirSync(raiz,{withFileTypes:true})){
  if(e.name==='dist')continue;
  if(e.name==='scripts')fs.cpSync(path.join(raiz,e.name),path.join(copia,e.name),{recursive:true});
  else fs.symlinkSync(path.join(raiz,e.name),path.join(copia,e.name));
 }
 ligarArvore(path.join(raiz,'dist'),path.join(copia,'dist'));
 executar('controlo atual',()=>{},0);
 for(const [nome,render] of [['forma antiga',esc],['forma nova',nova]])executar(`todas as retiradas, ${nome}`,()=>{
  const root=parse(originais.get(rotas[0]));root.querySelector('main').insertAdjacentHTML('beforeend',retiradas.filter(l=>!parametrizadas.includes(l)).map(l=>`<p data-voz>${render(l.texto)}</p>`).join(''));
  escrever(rotas[0],root.toString());
  for(const [i,l] of parametrizadas.entries()){
   const rota=[rotas[3],rotas[0],rotas[1]][i];assert(rota,'parâmetro sem página própria');
   const pagina=parse(fs.readFileSync(path.join(copia,'dist',rota),'utf8'));
   const frase=nome==='forma antiga'?l.texto:normalizaEspacosDaRetirada(l.texto);
   pagina.querySelector('meta[name="description"]').setAttribute('content',frase);
   assert.equal(parse(pagina.toString()).querySelector('meta[name="description"]').getAttribute('content'),frase);
   escrever(rota,pagina.toString());
  }
 },1,retiradas.map(l=>l.n));
 executar('definição retirada da DGAL',()=>{
  const root=parse(originais.get(rotas[2])),p=root.querySelectorAll('p').find(p=>p.textContent.startsWith('The council’s debt that counts towards the legal limit'));
  assert(p,'definição atual da dívida ausente');p.set_content(nova(dgal.texto));escrever(rotas[2],root.toString());
 },1,[dgal.n]);
 for(const [lang,rota] of [['pt',rotas[0]],['en',rotas[1]]]){
  const l=retiradas.find(l=>l.bloco==='og1-e-f'&&l.texto.startsWith(lang==='pt'?'Três contagens':'Three press counts'));assert(l);
  executar(`entrada antiga da habitação/${lang}`,()=>{
   const root=parse(originais.get(rota)),campo=root.querySelector('[data-texto-estudo="a-casa-em-portugal-e-na-europa"] [data-texto-campo="frase"]');assert(campo);campo.set_content(esc(l.texto));escrever(rota,root.toString());
  },1,[l.n]);
 }
 for(const [r,s] of originais)assert.equal(sha(fs.readFileSync(path.join(raiz,'dist',r))),sha(s),'dist original alterado');
 const relatorio={retiradas:retiradas.length,com_espacos_dentro_de_aspas:espacadas.length,com_texto_dentro_dessas_aspas:comTexto.length,casos:resultados,originais_intactos:true};
 if(process.env.OEDP_MEDICOES){fs.mkdirSync(process.env.OEDP_MEDICOES,{recursive:true});fs.writeFileSync(path.join(process.env.OEDP_MEDICOES,'adenda-j-plantas.json'),JSON.stringify(relatorio,null,2)+'\n');}
 console.log(`OG1-E J: ${retiradas.length} retiradas nas duas formas, ${resultados.length} execuções reais da voz, originais intactos.`);
}finally{fs.rmSync(copia,{recursive:true,force:true});}
