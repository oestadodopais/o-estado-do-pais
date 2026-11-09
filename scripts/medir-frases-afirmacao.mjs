/** Medição reproduzível, separada da classificação humana da amostra. */
import fs from 'node:fs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {lerPaginas, inventario, sha256, rotasFora} from './frases-com-afirmacao.mjs';
import {semear, medidas} from './gerar-frases-afirmacao.mjs';
const paginas=lerPaginas(process.argv[2] ?? 'dist');
const r=semear(paginas,loadClaims()), m=medidas(paginas,r);
const anteriores=inventario(paginas,true);
m.marcas_inglesas_antes=anteriores.filter(f=>f.lingua==='en').length;
m.rotas=paginas.map(({rota,tipo})=>({rota,tipo}));
m.familias_fora=rotasFora();
m.registo_por_rota={};for(const f of r.registo)for(const l of ['pt','en'])m.registo_por_rota[f.origem[l]]=(m.registo_por_rota[f.origem[l]]??0)+1;
m.amostra_semente='CAM2-A-2026-11-09';
m.amostra=['pt','en'].flatMap(l=>r.frases.filter(f=>f.lingua===l).sort((a,b)=>sha256(m.amostra_semente+'|'+a.estudo+'|'+a.frase).localeCompare(sha256(m.amostra_semente+'|'+b.estudo+'|'+b.frase))).slice(0,30).map((f,i)=>({id:l+'-'+(i+1),lingua:l,estudo:f.estudo,frase:f.frase})));
fs.writeFileSync(process.argv[3] ?? '/tmp/medidas-frases-afirmacao.json',JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({frases:m.frases,pt:m.pt,en:m.en,registo:m.registo,por_registar:m.por_registar,sem_par:m.pares.sem_par,falhas_antes:m.pares.falhas_antes,falhas_depois:m.pares.falhas_depois,registo_por_rota:m.registo_por_rota}));
