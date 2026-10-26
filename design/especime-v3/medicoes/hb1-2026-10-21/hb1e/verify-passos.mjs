/** HB1-e: os passos de `scripts.verify` um a um, cada código escrito num ficheiro próprio pelo próprio passo.
    Uso: node verify-passos.mjs <pasta dos códigos> <pasta dos registos, fora do repositório> */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const [codigos,registos]=process.argv.slice(2);
const passos=JSON.parse(fs.readFileSync('package.json','utf8')).scripts.verify.split('&&').map(s=>s.trim());
const resumo=[];
passos.forEach((passo,i)=>{
 const nome=String(i+1).padStart(2,'0')+'-'+passo.replace(/^npm run /,'').replace(/[^a-z0-9:.-]+/gi,'_').replace(/:/g,'-').slice(0,60);
 const r=spawnSync('sh',['-c',passo],{encoding:'utf8',maxBuffer:256*1024*1024,env:process.env});
 fs.writeFileSync(path.join(registos,nome+'.log'),(r.stdout??'')+(r.stderr??''));
 fs.writeFileSync(path.join(codigos,'verify-'+nome+'.code'),String(r.status)+'\n');
 resumo.push(`${nome} ${r.status}`);
});
console.log(resumo.join('\n'));
console.log(`${passos.length} passos; ${resumo.filter(l=>!l.endsWith(' 0')).length} diferentes de zero.`);
