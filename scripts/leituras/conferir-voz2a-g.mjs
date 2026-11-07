/** Fecho dirigido da VOZ-2A: comandos do pacote, sem repetir a corrida integral. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {correr,plantas} from '../verify-depois-do-build.mjs';
const raiz=process.cwd();
const nomes=['check:voz','check:lugar','check:edicoes','check:registo','check:datas','check:discussao','check:alvos','check:moldura','check:primeira','check:dossies'];
const scripts=JSON.parse(fs.readFileSync('package.json','utf8')).scripts;
for(const n of nomes)if(!scripts[n])throw Error(`Conferência ausente: ${n}`);
const p=await plantas();if(!p.ok)throw Error('As plantas do executor não foram recusadas.');
const cabeca=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const r=await correr({medir:true,raiz,scripts:{...scripts,verify:nomes.map(n=>'npm run '+n).join(' && ')},dist:path.join(raiz,'dist'),cabeca,paralelo:4});
for(const c of r.corridos)console.log(`${c.passo}: ${c.codigo}`);
const resultado={cabeca,nomes,plantas:p.casos,ok:r.ok,corridos:r.corridos,celulas:r.celulas};
fs.writeFileSync(path.join(process.env.OEDP_TEMPOS_DIR,'voz2a-g.json'),JSON.stringify(resultado,null,1)+'\n');
console.log(JSON.stringify({ok:r.ok,uniao:r.celulas.U,dist:r.celulas.D?.ok,cabeca:r.celulas.C?.ok}));
process.exitCode=r.ok?0:1;
