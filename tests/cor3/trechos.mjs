import fs from 'node:fs';import assert from 'node:assert/strict';import {conferirTrechosCor3} from '../../scripts/trechos-cor3-julgados.mjs';import {cortar,chave} from '../../scripts/frases-com-afirmacao.mjs';
const file='design/especime-v3/medicoes/cor3-2026-11-12/TRECHOS-COR3.json',rows=JSON.parse(fs.readFileSync(file)),r=rows.find(x=>x.lingua==='pt'&&x.correcao==='C01'),frase=cortar(r.literal)[0];
const page={estudo:r.estudo,lingua:r.lingua,rota:'/estudos/'+r.estudo,blocos:[{frases:[frase]}]},f={estudo:r.estudo,lingua:r.lingua,frase,ocorrencias:[{pagina:page.rota,bloco:0,indice:0}]};
assert(conferirTrechosCor3([page],[f]).textos.has(chave(f)));
const trocada=structuredClone(page);trocada.blocos[0].frases[0]=frase.replace(/\d/,n=>String((+n+1)%10));assert(!conferirTrechosCor3([trocada],[f]).textos.has(chave(f)));
for(const alvo of [r.folha,r.documento]){const x=conferirTrechosCor3([page],[f],{ler:p=>p===alvo?Buffer.from('adulterado'):fs.readFileSync(p)});assert(x.erros.length);}
const alteradas=structuredClone(rows);alteradas[0].depois='texto sem decisão';const x=conferirTrechosCor3([page],[f],{ler:p=>p===file?Buffer.from(JSON.stringify(alteradas)):fs.readFileSync(p)});assert(x.erros.some(e=>e.includes('Depois')));
console.log('COR3: controlo literal verde; algarismo, folha, documento e trecho não decidido recusados.');
