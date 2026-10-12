/** RP4-n-i: lista por frase dos documentos alojados que o próximo pacote deve levar. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {ORIGENS_DAS_DEFINICOES as origens} from '../../../../src/data/figuras.mjs';
import {contextoDasFamilias} from '../../../../tests/cartao/familias.mjs';
const motor=process.env.RESEARCHHUB_DIR;
if(!motor) throw Error('RESEARCHHUB_DIR é obrigatório');
const base='design/especime-v3/medicoes/rp4n-2026-10-06/i';
fs.mkdirSync(base,{recursive:true});
const atual=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
const anterior=JSON.parse(execFileSync('git',['show','b84d21a382f44116904e48c1b3b5109f7d1f5f5c:tests/cartao/leituras-provadas.json']));
const ctx=contextoDasFamilias();
const alteradas=new Set(execFileSync('git',['diff','--name-only','b84d21a382f44116904e48c1b3b5109f7d1f5f5c','--','ledger/claims'],{encoding:'utf8'}).trim().split('\n').map(p=>path.basename(p,'.yml')));

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const catalogo=[];
const computacoes=JSON.parse(fs.readFileSync('src/data/computacoes-rp4n.json'));

for(const o of Object.values(origens)){
 const s=o.selo??o.alojada;if(s?.motor)catalogo.push({url:o.url,motor:s.motor,sha256:s.sha256});
}
const fetch=JSON.parse(fs.readFileSync(path.join(motor,'content/13 Dominios/source/FETCH.json')));
for(const[p,r]of Object.entries(fetch.files)) catalogo.push({url:r.url,motor:'content/13 Dominios/source/'+p,sha256:r.sha256});
const url=u=>typeof u==='string'?u.split('#')[0]:'';
function ficheiro(p,h,porque,out){
 const absoluto=path.resolve(motor,p);
 if(!absoluto.startsWith(path.resolve(motor)+path.sep)||!fs.existsSync(absoluto))throw Error('ficheiro ausente: '+p);
 const real=sha(fs.readFileSync(absoluto));if(h&&real!==h)throw Error('resumo diferente: '+p);
 out.set(p,{motor:p,sha256:real,porque});
}
function daLinha(id,out,vistos=new Set()){
 if(vistos.has(id))return;vistos.add(id);const l=ctx.linhas.get(id);if(!l)return;
 for(const f of l.document?.computed_over?.files??[]){const selado=Object.values(computacoes.ficheiros).find(x=>x.file===f.file);if(!selado||selado.sha256!==f.sha256)throw Error('ficheiro da computação sem correspondência');ficheiro(selado.motor,f.sha256,'ficheiro da computação',out);}
 for(const c of catalogo)if(url(c.url)&&[url(l.source_url),url(l.document?.url)].includes(url(c.url)))ficheiro(c.motor,c.sha256,'documento da linha '+id,out);
 for(const f of l.definition_sources??[])ficheiro(f.receipt.motor,f.receipt.sha256,'segunda fonte de '+id,out);
 for(const d of l.derived_from??[])daLinha(d,out,vistos);
}
function anda(x,ids,out){
 if(Array.isArray(x)){x.forEach(v=>anda(v,ids,out));return;}if(!x||typeof x!=='object')return;
 if(x.origem){const o=origens[x.origem];const s=o?.selo??o?.alojada;if(s?.motor){ficheiro(s.motor,s.sha256,'origem '+x.origem,out);if(s.extracao?.ficheiro)ficheiro(s.extracao.ficheiro,s.extracao.sha256,'extração '+x.origem,out);if(o.recibo)ficheiro(o.recibo,null,'recibo '+x.origem,out);}}
 if(x.linha==='propria'||x.ficheiro)ids.forEach(id=>daLinha(id,out));
 Object.values(x).forEach(v=>anda(v,ids,out));
}
const frases=[];
const chavesDe=e=>e.chaves??(e.concelho?['concelho:'+e.concelho]:[]);
for(const e of atual.familias){
 const keys=chavesDe(e);if(!keys.length)throw Error('frase sem família identificada');
 const antiga=anterior.familias.find(a=>JSON.stringify(chavesDe(a))===JSON.stringify(keys));
 const ids=[...ctx.linhas.keys()].filter(id=>{const f=ctx.familia(id);return keys.includes(f.tipo==='concelho'?'concelho:'+f.chave:f.chave);});
 if(JSON.stringify(e)===JSON.stringify(antiga)&&!ids.some(id=>alteradas.has(id))&&!keys.includes('agua-nao-faturada-portugal'))continue;
 const arquivos=new Map();anda(e,ids,arquivos);ids.forEach(id=>daLinha(id,arquivos));
 if(e.cartao)anda(atual.medidas.find(m=>m.id===e.cartao),ids,arquivos);
 if(ids.includes('penalizacao-antecipacao-um-ano-neutra')){const y=fs.readFileSync('ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml','utf8');ficheiro('content/13 Dominios/source/rp4n/pensoes-copia-alojada.pdf',y.match(/SHA-256 ([a-f0-9]{64})/)[1],'cópia anteriormente alojada da pensão, conferida na extração',arquivos);}
 frases.push({familias:keys,linhas:ids,folhas:e.folhas,ficheiros:[...arquivos.values()],estado:'conferida quanto aos bytes'});
}
// As decisões também citam documentos: o pacote tem de permitir repeti-las.
const decisoes=new Map();
const nota=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/h/mapa4-nota.json'));
ficheiro(nota.ficheiro,nota.sha256,'decisão sobre a nota do MAPA 4',decisoes);
const pensao=JSON.parse(fs.readFileSync(path.join(motor,'publisher/recortes/pensao-rp4n.json')));
ficheiro(pensao.pdf,pensao.pdf_sha256,'prova do alojamento da pensão',decisoes);
ficheiro(pensao.alojamento.manifesto,null,'manifesto atual do alojamento da pensão',decisoes);
const original=execFileSync('git',['-C',motor,'show',pensao.alojamento.commit+':'+pensao.alojamento.manifesto]);
if(sha(original)!==pensao.alojamento.manifesto_sha256)throw Error('O manifesto original difere da prova');
const arquivo=base+'/pensoes-manifesto-original.sha256';
fs.writeFileSync(arquivo,original);
decisoes.get(pensao.alojamento.manifesto).original={commit:pensao.alojamento.commit,sha256:sha(original),copia_no_sitio:arquivo};
frases.push({familias:['decisoes-rp4n-i'],linhas:[],folhas:[],ficheiros:[...decisoes.values()],estado:'conferida quanto aos bytes'});
const resultado={cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),motor:execFileSync('git',['-C',motor,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),frases};
fs.writeFileSync(base+'/fontes-por-frase.json',JSON.stringify(resultado,null,2)+'\n');
const md=frases.map(f=>`### ${f.familias.join(', ')}\n\n${f.estado}.\n\n`+(f.ficheiros.length?f.ficheiros.map(x=>`- \`${x.motor}\`, sha256 \`${x.sha256}\` (${x.porque}).`).join('\n'):'Sem ficheiro alojado citado por esta frase.')).join('\n\n');
fs.writeFileSync(base+'/fontes-por-frase.md',md+'\n');
console.log(JSON.stringify({frases:frases.length,ficheiros:new Set(frases.flatMap(f=>f.ficheiros.map(x=>x.motor))).size}));
