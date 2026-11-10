import fs from 'node:fs';import assert from 'node:assert/strict';
import {corpoDocumentalConferido} from '../../scripts/corpo-documental-conferir.mjs';
const slug='evora-contas-da-camara-2010-2025';let n=0;
for(const lang of ['pt','en']){
 const r=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`,'utf8'));
 const figuras=[];const andar=o=>{if(Array.isArray(o))return o.forEach(andar);if(!o||typeof o!=='object')return;if(o.source_body)figuras.push(o);for(const v of Object.values(o))if(v&&typeof v==='object')andar(v);};andar(r);
 for(const f of figuras){assert(corpoDocumentalConferido(r,f));n++;}
 const f=figuras[0];
 for(const bad of [{...f,source_body:'fora/documento.pdf'},{...f,source_sha256:'0'.repeat(64)},{...f,row:'linha-ausente'}])assert(!corpoDocumentalConferido(r,bad));
 r.blocks[0].text+=' texto inventado';assert(!corpoDocumentalConferido(r,f));
}
console.log(`EVA C1: ${n} referências com corpo conferidas; caminho, resumo, linha e registo adulterados recusados.`);
