/** HB1-b: as definições completas passam; rótulos e definições alteradas não. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const saida=process.argv[2];assert(saida,'indique o ficheiro de prova');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hb1-edicoes-'));
const pt='É o número de edições dos estudos publicados; a edição portuguesa e a inglesa do mesmo estudo contam em separado.';
const en='It is the number of editions of the studies published; the Portuguese and English editions of the same study count separately.';
const alvos=['estudos publicados','Edições','Editions'],resultados=[];
function medir(nome,frases,esperados){
 const html='<html lang="pt"><body><main>'+frases.map(t=>'<p>'+t+'</p>').join('')+'</main></body></html>';
 fs.writeFileSync(path.join(tmp,'index.html'),html);
 const r=spawnSync(process.execPath,['scripts/medir-defeitos.mjs','--json'],{env:{...process.env,OEDP_DIST:tmp},encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(r.status,0,'a régua tem de executar');
 const encontradas=JSON.parse(r.stdout).frases_da_casa.declaracoes.retiradas_que_rendem.filter(e=>alvos.includes(e.texto));
 assert.deepEqual(encontradas.map(e=>e.texto).sort(),[...esperados].sort(),nome);
 resultados.push({nome,codigo_medicao:r.status,sha256:crypto.createHash('sha256').update(html).digest('hex'),frases,recusadas:encontradas});
}
try{
 medir('definicoes-intactas',[pt,en],[]);
 medir('rotulos-isolados',alvos,alvos);
 medir('definicoes-alteradas',[pt.replace('em separado','juntas'),en.replace('separately','together')],alvos);
 fs.writeFileSync(saida,JSON.stringify({codigo:0,sha256_regua:crypto.createHash('sha256').update(fs.readFileSync('scripts/medir-defeitos.mjs')).digest('hex'),casos:resultados},null,2)+'\n');
 console.log(JSON.stringify({codigo:0,casos:resultados.map(r=>({nome:r.nome,recusadas:r.recusadas.length}))}));
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
