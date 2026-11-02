/** A frase é lida no HTML de todas as famílias editoriais, nas duas edições. */
import fs from 'node:fs';
const normal = s => String(s??'').replace(/\s+/gu,' ').trim();
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let documentosConferidos;
function referenciasDeDocumento(text, lang) {
  if (!documentosConferidos) {
    documentosConferidos=new Map();
    const manifest=JSON.parse(fs.readFileSync('registos/manifest.json','utf8'));
    for (const key of Object.keys(manifest.registos)) {
      const split=key.lastIndexOf('/'), slug=key.slice(0,split), language=key.slice(split+1);
      const file=`registos/${slug}/${language}.record.json`;
      if(!fs.existsSync(file))continue;
      const record=JSON.parse(fs.readFileSync(file,'utf8'));
      for(const block of record.blocks??[]) {
        const docs=(block.proofs??[]).filter(p=>p.tipo==='documento').map(p=>({id:p.id,inicio:Array.from(block.text).slice(0,p.inicio).join('').replace(/\s+/gu,' ').trimStart().length,texto:normal(p.texto)}));
        if(docs.length)documentosConferidos.set(language+'\0'+normal(block.text),docs);
      }
    }
  }
  return documentosConferidos.get(lang+'\0'+text)??[];
}
export function errosDaFormaNoTexto(text, rows, lang) {
  text=normal(text);
  const provas=[];
  for (const row of rows.values()) {
    if (row.afirmacao!==true) continue;
    const speaker=lang==='en'?(row.attributed_to_en??row.attributed_to):row.attributed_to;
    for (const [tipo,value] of [['excerto',row.excerpt],['documento',row.document?.title],['atribuicao',Array.isArray(speaker)?speaker.join(', '):speaker]]) {
      const texto=normal(value);if(!texto)continue;
      let i=text.indexOf(texto);
      while(i!==-1){provas.push({id:row.id,tipo,texto,inicio:i,fim:i+texto.length});i=text.indexOf(texto,i+texto.length);}
    }
  }
  const documents=referenciasDeDocumento(text,lang);
  const errors=[];
  for(const q of provas) {
    const row=rows.get(q.id);
    if(q.tipo!=='excerto'||row.forma_da_citacao!=='relato')continue;
    // Só numa unidade integralmente igual ao registo: este intervalo é o título, não o excerto.
    if(documents.some(d=>d.id===q.id&&d.inicio===q.inicio&&d.texto===q.texto))continue;
    const mask=text.split('');
    for(const p of provas){
      // Um nome dentro da transcrição não transforma a sua voz.
      if(p!==q && p.inicio>=q.inicio && p.fim<=q.fim)continue;
      mask.fill('X',p.inicio,p.fim);
      if(p!==q&&p.tipo==='excerto'&&/[.!?]$/.test(p.texto))mask[p.fim-1]='.';
    }
    const cuts=[...mask.join('').matchAll(/[.!?](?=\s|»|$)/g)].map(m=>m.index);
    const a=Math.max(0,...cuts.filter(i=>i<q.inicio).map(i=>i+1));
    const b=Math.min(text.length,...cuts.filter(i=>i>=q.fim));
    const doc=provas.some(p=>p.id===q.id&&p.tipo==='documento'&&p.inicio>=a&&p.fim<=b&&(p.fim<=q.inicio||p.inicio>=q.fim));
    const headline=lang==='pt'?'pelo título da notícia':'in the news headline';
    const heading=q.texto===normal(row.document?.title)&&new RegExp(escape(headline)+':?\\s*«?$').test(text.slice(a,q.inicio));
    const suffix=text.slice(q.fim,b).match(new RegExp('^»?, '+(lang==='pt'?'segundo':'according to')+' '));
    const speaker=suffix&&provas.some(p=>p.id===q.id&&p.tipo==='atribuicao'&&p.inicio===q.fim+suffix[0].length&&p.fim<=b);
    if(!doc&&!heading&&!speaker)errors.push(`OG1-E ${q.id}: relato sem documento ou atribuição na mesma frase`);
  }
  return errors;
}
export function conferirFormaDasCitacoes(root, rota, rows) {
  if(!['estudo','documento','texto','dossie','discussao','explicacao','explicacoes','leituraDaSemana','dossies'].includes(rota?.key))return [];
  const errors=[];
  for(const el of root.querySelectorAll('p,li,blockquote,h1,h2,h3,h4,td')) {
    if(el.querySelector('p,li,blockquote,h1,h2,h3,h4,td'))continue;
    const copy=el.clone();copy.querySelectorAll('[data-selo-etiqueta],script,style').forEach(n=>n.remove());
    errors.push(...errosDaFormaNoTexto(copy.textContent,rows,rota.lang));
  }
  return errors;
}
