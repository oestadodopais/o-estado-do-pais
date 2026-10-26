/** HB1-b: os grupos partidários na prosa têm de ser os da votação selada. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
export const partidosHb1 = {
 'CDS-PP': ['CDS-Partido Popular', 'Centro Democrático Social, Partido Popular', 'Democratic and Social Centre, People’s Party', 'CDS-PP'],
 PSD: ['Partido Social Democrata', 'Social Democratic Party', 'PSD'],
 PS: ['Partido Socialista', 'Socialist Party', 'PS'],
 PCP: ['Partido Comunista Português', 'Portuguese Communist Party', 'PCP'],
 BE: ['Bloco de Esquerda', 'Left Bloc', 'BE'],
 PAN: ['Pessoas-Animais-Natureza', 'People-Animals-Nature', 'PAN'],
 JPP: ['Juntos pelo Povo', 'Together for the People', 'JPP'],
 IL: ['Iniciativa Liberal', 'Liberal Initiative', 'IL'],
 L: ['Livre', 'L'],
 CH: ['Chega', 'CH'],
};
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const names = Object.entries(partidosHb1).flatMap(([id, aliases]) => aliases.map(alias => [alias,id])).sort((a,b)=>b[0].length-a[0].length);
const pattern = new RegExp('(?<![\\p{L}\\d-])(?:'+names.map(([name])=>escape(name)).join('|')+')(?![\\p{L}\\d-])','giu');
const normal = s => s.toLocaleLowerCase('pt').replace(/\s+/g,' ').trim();
function parties(text) {
 return [...new Set([...text.matchAll(pattern)].map(m=>names.find(([name])=>normal(name)===normal(m[0]))[1]))].sort();
}
export function gruposDoExcerto(excerpt) {
 const marks=[...excerpt.matchAll(/(Contra|Abstenção|A Favor):\s*/g)];
 const groups={Contra:[],Abstenção:[],'A Favor':[]};
 for(const [i,m] of marks.entries())groups[m[1]]=parties(excerpt.slice(m.index+m[0].length,marks[i+1]?.index));
 assert(marks.length>=2,'votação sem grupos documentais');
 return groups;
}
export function gruposDaProsa(sentence) {
 const marks=[...sentence.matchAll(/(?:os )?votos (a favor|contra)|(?:a )?abstenção|(?:the )?votes (in favour|against)(?: of)?|(?:the )?abstention(?: of)?/gi)];
 const groups={Contra:[],Abstenção:[],'A Favor':[]};
 const key=m=>/absten|abstention/i.test(m[0])?'Abstenção':/contra|against/i.test(m[0])?'Contra':'A Favor';
 for(const [i,m] of marks.entries()) {
  const group=key(m);assert.equal(groups[group].length,0,'grupo repetido: '+group);
  groups[group]=parties(sentence.slice(m.index+m[0].length,marks[i+1]?.index));
 }
 assert(marks.length>=2,'frase sem grupos de voto');
 return groups;
}
export function conferirVotacao(sentence, row) {
 const expected=gruposDoExcerto(row.excerpt), actual=gruposDaProsa(sentence);
 for(const group of Object.keys(expected))assert.deepEqual(actual[group],expected[group],`${row.id}: ${group}`);
 return actual;
}
export function conferirGabarito(text, rows) {
 const results=[];
 for(const row of rows.filter(r=>r.id.startsWith('hab-votacao-'))) {
  const marker=`⟦HB:${row.id}|cita⟧`,end=text.indexOf(marker);
  assert(end>=0,'falta citação silenciosa: '+row.id);
  const paragraph=text.slice(text.lastIndexOf('\n',end)+1,end);
  const starts=[...paragraph.matchAll(/(?:Foi aprovada|Foi rejeitado|Aprovado|Rejeitado|It was approved|It was rejected|Approved|Rejected)\s/g)];
  assert(starts.length,'falta frase da votação: '+row.id);
  const sentence=paragraph.slice(starts.at(-1).index);
  results.push({id:row.id,frase:sentence,grupos:conferirVotacao(sentence,row)});
 }
 assert.equal(results.length,4,'faltam votações');
 return results;
}
export function conferirRegisto(registo, rows) {
 const results=[];
 for(const block of registo.blocks) {
  const votes=(block.source_rows??[]).filter(id=>id.startsWith('hab-votacao-'));
  if(!votes.length)continue;
  const sentences=[...(block.text??'').matchAll(/(?:Foi aprovada|Foi rejeitado|Aprovado|Rejeitado|It was approved|It was rejected|Approved|Rejected)\s[^.]*\./g)].map(m=>m[0]);
  if(!sentences.length)continue;
  assert.equal(sentences.length,votes.length,'frases de votação e fontes do bloco divergem');
  for(const [i,id] of votes.entries()) {
   const row=rows.find(r=>r.id===id);assert(row,'linha da votação ausente: '+id);
   results.push({id,frase:sentences[i],grupos:conferirVotacao(sentences[i],row)});
  }
 }
 assert.equal(results.length,4,'faltam votações no registo composto');
 assert.equal(new Set(results.map(r=>r.id)).size,4,'votação repetida no registo composto');
 return results;
}
function main() {
 const motor=process.env.RESEARCHHUB_DIR;assert(motor,'defina RESEARCHHUB_DIR');
 const rows=JSON.parse(fs.readFileSync(path.join(motor,'content/23 Habitacao/ledger.json'),'utf8')).claims;
 const dir=path.join(motor,'content/28 Habitacao Estudo/Technical Source');
 const edicoes=Object.fromEntries(['pt','en'].map(lang=>[lang,conferirGabarito(fs.readFileSync(path.join(dir,`documento.${lang}.md.tmpl`),'utf8'),rows)]));
 const plants=[];
 for(const lang of ['pt','en']) {
  const positive=edicoes[lang].find(x=>x.id==='hab-votacao-arrendamento'),row=rows.find(r=>r.id===positive.id);
  const variants=[['partido trocado de grupo',positive.frase.replace(/\bPSD\b/,'SWAP').replace(/\bPCP\b/,'PSD').replace('SWAP','PCP')],['partido omitido',positive.frase.replace(/(?:Partido Comunista Português \(o PCP\)|Portuguese Communist Party \(PCP\)|PCP)/,'')]];
  for(const [planta,bad] of variants) {
   let message;try{conferirVotacao(bad,row);}catch(error){message=error.message.split('\n')[0];}
   assert(message,'planta não recusada: '+planta);conferirVotacao(positive.frase,row);
   plants.push({lingua:lang,planta,vermelho:1,verde:0,mordida:message});
  }
 }
 console.log(JSON.stringify({codigo:0,edicoes,plantas:plants},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main();
