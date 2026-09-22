/** Conta as palavras corrigidas no HTML e reconfere os PNG por bytes. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { execFileSync } from 'node:child_process';
import { ROTULOS_B1 } from '../../../../src/data/rotulos-b1.mjs';
import { MEDIDAS_DO_DOMINIO_1 } from '../../../../src/data/dominios.mjs';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const capturas=path.resolve(pasta,'../../capturas/b1-2026-09-22');
const sha=b=>createHash('sha256').update(b).digest('hex');
const nome=MEDIDAS_DO_DOMINIO_1.find(m=>m.claim==='indice-de-divida-limite-legal').nome;
const nomes={pt:[],en:[]}, lugares={pt:0,en:0};
function anda(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,f.name);if(f.isDirectory()){anda(p);continue;}if(!p.endsWith('.html'))continue;
 const html=fs.readFileSync(p,'utf8');
 for(const lang of ['pt','en'])if(html.includes(nome[lang]))nomes[lang].push(p);
 if(/^dist\/(municipios|en\/municipalities)\/[^/]+\/index.html$/.test(p)){
  const lang=p.startsWith('dist/en/')?'en':'pt';
  const olho=parse(html).querySelector('#estudos-k');
  if(olho){if(olho.textContent.trim()!==ROTULOS_B1[lang].estudosDoLugar)throw Error(`Olho do lugar alterado: ${p}`);lugares[lang]++;}
 }
}}
anda('dist');
const pais={};
for(const [lang,p] of [['pt','dist/index.html'],['en','dist/en/index.html']]){
 const root=parse(fs.readFileSync(p,'utf8')),r=ROTULOS_B1[lang];
 const olho=root.querySelector('#estudos-k').textContent.trim();
 const publicacoes=root.querySelectorAll('[data-mudanca="publicacao"] p span');
 const estudos=root.querySelectorAll('.estudo-meta time');
 if(olho!==r.estudosRecentes||!publicacoes.length||publicacoes.some(p=>p.textContent!==r.estudoPublicado))throw Error(`Rótulos errados: ${lang}`);
 if(estudos.some(t=>!t.parentNode.textContent.startsWith(r.publicado+' ')))throw Error(`Data sem rótulo: ${lang}`);
 pais[lang]={olho,publicacoes:publicacoes.length,rotuloDasPublicacoes:r.estudoPublicado,estudosComPublicadoA:estudos.length};
}
const declaradas=JSON.parse(fs.readFileSync(path.join(pasta,'capturas-depois-peca3.json'),'utf8'));
const png=declaradas.resultados.map(r=>{
 const b=fs.readFileSync(path.join(capturas,r.ficheiro));
 if(sha(b)!==r.sha256)throw Error(`Resumo diferente: ${r.ficheiro}`);
 return {ficheiro:r.ficheiro,largura:b.readUInt32BE(16),altura:b.readUInt32BE(20),sha256:sha(b)};
});
const janelas=fs.readdirSync(capturas).filter(f=>f.startsWith('janela-')&&f.endsWith('.png')).map(f=>({ficheiro:f,sha256:sha(fs.readFileSync(path.join(capturas,f)))}));
const cabeca=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const resultado={cabeca,nomes,lugares,pais,cabecaDasCapturas:declaradas.cabeca,png,janelas};
fs.writeFileSync(path.join(pasta,'medidas-correcao-peca3.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({cabeca,nomes,pais,lugares,pngConferidos:png.length,janelas:janelas.length},null,2));
