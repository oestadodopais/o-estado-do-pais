// Copia do dist as reescritas da adenda A e da adenda H aplicáveis à VOZ-2A.
import fs from 'node:fs';import {parse} from 'node-html-parser';
const pasta=new URL('./',import.meta.url);
const lista=JSON.parse(fs.readFileSync(new URL('../voz2a-2026-11-07/FRASES-VOZ-2A.json',pasta)));
const ids=['V043','V053','V057','V064','V164','V176','V182','V194','V195','V196','V308',...Array.from({length:20},(_,i)=>'V'+(i+309)),'V330','V198','V238'];
const normal=s=>s.replace(/\s+/g,' ').trim();
const resultados=[];
for(const id of ids){
 const f=lista.find(f=>f.id===id);if(!f.nova)continue;const rota=f.paginas.find(p=>/\/(documento|document)$/.test(p)&&p.includes('/'+f.estudo+'/'))??f.paginas.find(p=>p.endsWith('/'+f.estudo));
 const root=parse(fs.readFileSync('dist'+rota+'/index.html','utf8'));root.querySelectorAll('script,style').forEach(n=>n.remove());
 const novo=normal(f.nova),semSelos=novo.replace(/(?:source|fonte) · Município de Évora/g,'');
 const candidatas=root.querySelectorAll('p,li,h1,h2,h3,h4,td,th').map(n=>normal(n.textContent));
 const paragrafo=candidatas.find(p=>p.includes(novo)||p.includes(semSelos));
 if(!paragrafo)throw Error(id+': reescrita não encontrada no dist');
 const forma=paragrafo.includes(novo)?novo:semSelos;
 // A frase é uma fatia dos bytes de texto lidos, não uma cópia do campo nova.
 const inicio=paragrafo.indexOf(forma);const frase=paragrafo.slice(inicio,inicio+forma.length);
 resultados.push({id,lingua:f.lingua,rota,frase,paragrafo});
}
fs.writeFileSync(new URL('frases-do-dist.json',pasta),JSON.stringify(resultados,null,2)+'\n');
console.log(JSON.stringify({frases:resultados.length,pt:resultados.filter(f=>f.lingua==='pt').length,en:resultados.filter(f=>f.lingua==='en').length}));
