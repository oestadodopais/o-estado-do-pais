/** UE1-c: medidas lidas dos recibos, dos YAML e do HTML efetivamente construído. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import * as YAML from 'js-yaml';
const motor=process.env.RESEARCHHUB_DIR;
if(!motor) throw new Error('Falta RESEARCHHUB_DIR');
const out=path.dirname(new URL(import.meta.url).pathname);
const sha=b=>createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const texto=e=>e.textContent.replace(/\s+/g,' ').trim();
const ids=['divida-publica-2025','divida-publica-2025-ue'];
const corrida=json(path.join(motor,'indicators/out/series-paises/2026-10-26/primeira-releitura.json'));
const series=corrida.series.map(s=>{
 const atual=YAML.load(fs.readFileSync(`ledger/series/${s.serie}.yml`,'utf8'));
 const antiga=YAML.load(execFileSync('git',['show',`442b284e2:ledger/series/${s.serie}.yml`],{encoding:'utf8'}));
 const marcas=atual.pontos.flatMap(p=>{
  const a=antiga.pontos.find(x=>x.geo===p.geo);
  return a.bandeira===p.bandeira?[]:[{geo:p.geo,antes:a.bandeira,depois:p.bandeira}];
 });
 return {...s,pontos:atual.pontos.length,marcas};
});
const recibos=[];
for(const lang of ['pt','en'])for(const id of ids){
 const rel=`${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`;
 const b=fs.readFileSync('dist/'+rel);const dom=parse(b.toString());
 const linha=YAML.load(fs.readFileSync(`ledger/claims/${id}.yml`,'utf8'));
 const i=linha.corrections.findIndex(c=>c.kind==='atualizacao'&&c.date==='2026-10-26');
 const atualizacao=dom.querySelector(`#alteracao-${i}`);
 if(!atualizacao)throw new Error(`Sem atualização: ${rel}`);
 const razao=linha.corrections[i][lang==='en'?'reason_en':'reason'];
 if(!texto(atualizacao).includes(razao))throw new Error(`Motivo diferente: ${rel}`);
 recibos.push({rota:'/'+rel.replace(/index.html$/,''),lang,id,valor:linha.value,
   published_at:linha.published_at,sha256:sha(b),atualizacao:texto(atualizacao)});
}
const ficheiros=execFileSync('rg',['-l','divida-publica-2025','dist','-g','*.html'],{encoding:'utf8'}).trim().split('\n');
const frases=[];
for(const f of ficheiros){
 if(/\/(livro-razao|ledger)\//.test(f))continue;
 const b=fs.readFileSync(f);const dom=parse(b.toString());
 for(const e of dom.querySelectorAll('p,li')){
  if(e.querySelector('p,li'))continue;
  const menciona=e.querySelectorAll('[data-claim],[data-periodo],[data-publicado]').some(n=>ids.includes(n.getAttribute('data-claim'))||ids.includes(n.getAttribute('data-periodo'))||ids.includes(n.getAttribute('data-publicado')));
  if(!menciona&&!/dívida pública|public debt/i.test(e.textContent))continue;
  if(!/dívida|debt/i.test(e.textContent))continue;
  const clone=parse(e.outerHTML);for(const chip of clone.querySelectorAll('.src-chip'))chip.remove();
  frases.push({rota:'/'+f.replace(/^dist\//,'').replace(/index.html$/,''),texto:texto(clone),sha256_html:sha(b)});
 }
}
const codigos=Object.fromEntries(fs.readdirSync(out).filter(f=>f.endsWith('.codigo')).sort().map(f=>[f.replace('.codigo',''),Number(fs.readFileSync(path.join(out,f),'utf8').trim())]));
const cabeca=repo=>execFileSync('git',['-C',repo,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const medidas={ferramenta:'medir.mjs',cabecas_lidas:{sitio:cabeca('.'),motor:cabeca(motor)},series,
 contagens:{series:series.length,pontos:series.reduce((n,s)=>n+s.pontos,0),revisoes:series.reduce((n,s)=>n+s.revisoes.length,0),series_com_revisoes:series.filter(s=>s.revisoes.length).length,series_com_marcas:series.filter(s=>s.marcas.length).length,recibos:recibos.length,frases:frases.length},
 recibos,frases,codigos,custo:{pontos:null,razao:'Medidos pelo lançador, fora desta passagem.'}};
fs.writeFileSync(path.join(out,'medidas.json'),JSON.stringify(medidas,null,2)+'\n');
console.log(JSON.stringify({contagens:medidas.contagens,codigos}));
