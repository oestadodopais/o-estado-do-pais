/** HB1-b: as votações e as siglas das edições que a construção recebe. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {registoDaEdicao} from '../../src/lib/registos.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {conferirRegisto,conferirGabarito,conferirVotacao} from '../votacoes-hb1.mjs';
import {conferirSiglasHb1} from '../../scripts/siglas-hb1.mjs';
const claims=[...loadClaims().values()],motor=process.env.RESEARCHHUB_DIR;
let votacoes=0,siglas=0,plantas=0;
for(const lang of ['pt','en']) {
 const registo=registoDaEdicao('a-casa-em-portugal-e-na-europa',lang);assert(registo,'edição ausente: '+lang);
 const votes=conferirRegisto(registo,claims);votacoes+=votes.length;
 const phrases=registo.blocks.map(b=>b.text??'');
 const expansions=conferirSiglasHb1(phrases,lang);siglas+=expansions.length;
 if(motor) {
  const rows=JSON.parse(fs.readFileSync(path.join(motor,'content/23 Habitacao/ledger.json'),'utf8')).claims;
  const template=fs.readFileSync(path.join(motor,`content/28 Habitacao Estudo/Technical Source/documento.${lang}.md.tmpl`),'utf8');
  const source=conferirGabarito(template,rows);
  const porId=items=>items.map(v=>({id:v.id,grupos:v.grupos})).sort((a,b)=>a.id.localeCompare(b.id));
  assert.deepEqual(porId(votes),porId(source),'grupos divergem da origem');
 }
 const positive=votes.find(v=>v.id==='hab-votacao-arrendamento'),row=claims.find(r=>r.id===positive.id);
 for(const [name,bad] of [
  ['partido trocado de grupo',positive.frase.replace(/\bPSD\b/,'SWAP').replace(/\bPCP\b/,'PSD').replace('SWAP','PCP')],
  ['partido omitido',positive.frase.replace(/(?:Partido Comunista Português \(o PCP\)|Portuguese Communist Party \(PCP\)|PCP)/,'')],
 ]) {
  assert.throws(()=>conferirVotacao(bad,row),undefined,name);conferirVotacao(positive.frase,row);plantas++;
  console.log(`PLANTA ${lang}: ${name}, vermelho 1, verde 0`);
 }
 const e=expansions.find(e=>e.sigla==='INE');
 for(const [name,replacement] of [['expansão ausente',''],['expansão repetida',`${e.expansao} (INE). ${e.expansao}`]]) {
  const bad=[...phrases];bad[e.bloco]=bad[e.bloco].replace(e.expansao,replacement);
  assert.throws(()=>conferirSiglasHb1(bad,lang),undefined,name);conferirSiglasHb1(phrases,lang);plantas++;
  console.log(`PLANTA ${lang}: ${name}, vermelho 1, verde 0`);
 }
}
console.log(`HB1: ${votacoes} votações, ${siglas} expansões de siglas, ${plantas} plantas; origem ${motor?'conferida':'não pedida'}.`);
