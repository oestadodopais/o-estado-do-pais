import {emEnsaio} from '../../site.config.mjs';
/** OG1-E K: o portão real lê cópias, com os códigos e a medição que produziu. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {leInventario} from '../../scripts/voz.mjs';
import {textoDaVoz} from '../../scripts/voz-edicoes.mjs';
import {fraseRetiradaNoTexto} from '../../scripts/titulos-publicados.mjs';
const raiz=process.cwd(),retiradas=leInventario(raiz).linhas.filter(l=>l.estado==='retirada');
const declaradas=fs.readFileSync('design/especime-v3/INVENTARIO-FRASES.md','utf8').split('\n').filter(l=>/\|\s*retirada\s*\|/.test(l)).length;assert.equal(retiradas.length,declaradas,'há retiradas fora do leitor da voz');
const espacadas=retiradas.filter(l=>/[«“]\s|\s[»”]/u.test(l.texto));
const comTexto=espacadas.filter(l=>/[«“]\s+[^«»“”\s][^«»“”]*[»”]|[«“][^«»“”]*[^«»“”\s]\s+[»”]/u.test(l.texto));
assert.equal(comTexto.length,1);const dgal=comTexto[0];assert(dgal.texto.includes('DGAL'));
const esc=s=>s.replaceAll('<','&lt;').replaceAll('>','&gt;');
const nova=s=>esc(s).replace(/([«“])\s*([^«»“”]*?)\s*([»”])/gu,(_,a,t,b)=>`${a}<span lang="pt-PT">${t.trim()}</span>${b}`);
const parametrizadas=retiradas.filter(l=>/<[^>]+>/.test(l.texto));
for(const l of retiradas){
 if(parametrizadas.includes(l)){
  const pagina=parse('<meta name="description">');pagina.firstChild.setAttribute('content',l.texto);
  assert(fraseRetiradaNoTexto(pagina.firstChild.getAttribute('content'),l.texto));continue;
 }
 for(const html of [esc(l.texto),nova(l.texto),`<span lang="pt-PT">${esc(l.texto).replace(/ ([,:;.!?])/gu,'</span>$1<span lang="pt-PT">')}</span>`]){
  const lido=textoDaVoz(parse(`<p>${html}</p>`)).replace(/\s+/gu,' ').trim();
  assert(fraseRetiradaNoTexto(lido,l.texto),`retirada deixou de morder: ${l.n}`);
 }
}
console.log(`${retiradas.length} retiradas conferidas em memória com a extração histórica.`);
const copia=fs.mkdtempSync(path.join(os.tmpdir(),'og1ek-voz-'));
const rotas=['correcoes/index.html','en/corrections/index.html','en/municipalities/abrantes/index.html','en/municipalities/agueda/index.html'];
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
 const cwd=muda?copia:raiz;
 if(muda)muda();
 const inicio=Date.now();const medicao=path.join(copia,'medicao.json');
 const r=spawnSync(process.execPath,['scripts/check-voz.mjs','--medicao',medicao],{cwd,env:{...process.env,OEDP_DIST:path.join(cwd,'dist')},encoding:'utf8',maxBuffer:128*1024*1024});
 assert.equal(r.signal,null,`${nome}: sinal ${r.signal}`);
 if(r.status!==esperado)console.error((r.stdout+r.stderr).split('\n').slice(-15).join('\n').replaceAll(copia,'<temporario>').replaceAll(raiz,'<worktree>'));
 assert.equal(r.status,esperado,`${nome}: código inesperado`);
 const medidas=JSON.parse(fs.readFileSync(medicao,'utf8')).frases_da_casa.declaracoes.retiradas_que_rendem;
 const vistas=new Set(medidas.map(l=>l.n));
 for(const n of linhas)assert(vistas.has(n),`${nome}: a voz não recusou a retirada ${n}`);
 const duracao_segundos=(Date.now()-inicio)/1000;
 resultados.push({nome,codigo:r.status,duracao_segundos,retiradas_exigidas:linhas.length,retiradas_recusadas:linhas.filter(n=>vistas.has(n)).length,linhas});
 console.log(`${nome}: código lido ${r.status}; ${linhas.length} retiradas conferidas; ${duracao_segundos.toFixed(3)} s.`);
}
try{
 for(const e of fs.readdirSync(raiz,{withFileTypes:true})){
  if(e.name==='dist')continue;
  if(e.name==='scripts')fs.cpSync(path.join(raiz,e.name),path.join(copia,e.name),{recursive:true});
  else fs.symlinkSync(path.join(raiz,e.name),path.join(copia,e.name));
 }
 ligarArvore(path.join(raiz,'dist'),path.join(copia,'dist'));
 executar('controlo atual',null,0);
 const entradas=['pt','en'].map(lang=>{
  const l=retiradas.find(l=>l.bloco==='og1-e-f'&&l.texto.startsWith(lang==='pt'?'Três contagens':'Three press counts'));assert(l);return l;
 });
 const leis=retiradas.filter(l=>l.bloco==='b1-peca2' && l.texto==='The limit is set by article 52.º of Lei n.º 73/2013 : one and a half times the three-year average of net current revenue.');
 assert.equal(leis.length,1,'a frase histórica da lei tem de existir uma só vez no bloco');const lei=leis[0];
 executar('quatro plantas em páginas distintas',()=>{
  const root=parse(originais.get(rotas[2])),p=root.querySelectorAll('p').find(p=>p.textContent.startsWith('The council’s debt that counts towards the legal limit'));
  assert(p,'definição atual da dívida ausente');p.set_content(nova(dgal.texto));escrever(rotas[2],root.toString());
  for(const [i,l] of entradas.entries()){
   const pagina=parse(originais.get(rotas[i]));
   if(emEnsaio()) {
    assert.equal(pagina.querySelectorAll('[data-mudanca]').length,0,'REC1: controlo do registo vazio');
    pagina.querySelector('main').insertAdjacentHTML('beforeend',`<p data-voz>${esc(l.texto)}</p>`);
   } else {
    const campo=pagina.querySelector('[data-texto-estudo="a-casa-em-portugal-e-na-europa"] [data-texto-campo="frase"]');assert(campo);campo.set_content(esc(l.texto));
   }
   escrever(rotas[i],pagina.toString());
  }
  const pagina=parse(originais.get(rotas[3]));
  const html=esc(lei.texto).replace('Lei n.º 73/2013 :','<span lang="pt-PT">Lei n.º 73/2013</span>:');
  assert.equal(textoDaVoz(parse(`<p>${html}</p>`)).replace(/\s+/gu,' ').trim(),lei.texto);
  pagina.querySelector('main').insertAdjacentHTML('beforeend',`<p data-voz>${html}</p>`);escrever(rotas[3],pagina.toString());
 },1,[dgal.n,...entradas.map(l=>l.n),lei.n]);
 for(const [r,s] of originais)assert.equal(sha(fs.readFileSync(path.join(raiz,'dist',r))),sha(s),'dist original alterado');
 const relatorio={retiradas:retiradas.length,com_espacos_dentro_de_aspas:espacadas.length,com_texto_dentro_dessas_aspas:comTexto.length,casos:resultados,originais_intactos:true};
 if(process.env.OEDP_MEDICOES){fs.mkdirSync(process.env.OEDP_MEDICOES,{recursive:true});fs.writeFileSync(path.join(process.env.OEDP_MEDICOES,'adenda-k-plantas.json'),JSON.stringify(relatorio,null,2)+'\n');}
 console.log(`OG1-E K: ${retiradas.length} retiradas em memória, ${resultados.length} execuções reais da voz, originais intactos.`);
}finally{fs.rmSync(copia,{recursive:true,force:true});}
