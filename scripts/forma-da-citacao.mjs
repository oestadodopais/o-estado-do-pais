/** A frase é lida no HTML de todas as famílias editoriais, nas duas edições. */
const normal = s => String(s??'').replace(/\s+/gu,' ').trim();
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const listas=new WeakMap();
export function errosDaFormaNoTexto(text, rows, lang) {
  text=normal(text);
  if(!listas.has(rows))listas.set(rows,[...rows.values()].filter(r=>r.afirmacao===true));
  const afirma=listas.get(rows);
  if(!afirma.some(r=>r.forma_da_citacao==='relato'&&normal(r.excerpt)&&text.includes(normal(r.excerpt))))return [];
  const provas=[];
  for (const row of afirma) {
    if (row.afirmacao!==true) continue;
    const speaker=lang==='en'?(row.attributed_to_en??row.attributed_to):row.attributed_to;
    for (const [tipo,value] of [['excerto',row.excerpt],['documento',row.document?.title],['atribuicao',Array.isArray(speaker)?speaker.join(', '):speaker]]) {
      const texto=normal(value);if(!texto)continue;
      let i=text.indexOf(texto);
      while(i!==-1){provas.push({id:row.id,tipo,texto,inicio:i,fim:i+texto.length});i=text.indexOf(texto,i+texto.length);}
    }
  }
  const errors=[];
  for(const q of provas) {
    const row=rows.get(q.id);
    if(q.tipo!=='excerto'||row.forma_da_citacao!=='relato')continue;
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
    const doc=provas.some(p=>p.texto===normal(row.document?.title)&&p.tipo==='documento'&&p.inicio>=a&&p.fim<=b&&(p.fim<=q.inicio||p.inicio>=q.fim));
    const headline=lang==='pt'?'pelo título da notícia':'in the news headline';
    const heading=q.texto===normal(row.document?.title)&&new RegExp(escape(headline)+':?\\s*«?$').test(text.slice(a,q.inicio));
    const named=q.texto===normal(row.document?.title)&&/(?:pela notícia|pelo documento|pela comunicação do Governo|pela página do partido|by the report|by the news report|in the news report|in the Government's communication|in the party's web page)\s*«?$/.test(text.slice(a,q.inicio));
    const prefix=new RegExp('^»?, '+(lang==='pt'?'segundo (?:[oa] )?':'according to (?:the )?')+'$');
    const speaker=provas.some(p=>p.id===q.id&&p.tipo==='atribuicao'&&p.inicio>=q.fim&&p.fim<=b&&prefix.test(text.slice(q.fim,p.inicio)));
    if(!doc&&!heading&&!named&&!speaker)errors.push(`OG1-E ${q.id}: relato sem documento ou atribuição na mesma frase`);
  }
  return errors;
}
/** Lê também o texto próprio de um li que contenha parágrafos. */
export function unidadesDaForma(root) {
  const block=/^(?:html|body|main|article|section|aside|header|footer|nav|div|p|li|ul|ol|blockquote|h[1-6]|td|th|tr|table|figcaption|figure|dd|dt|dl|summary|details|br)$/i;
  const result=[];let current='';
  const flush=()=>{if(normal(current))result.push(normal(current));current='';};
  function visit(node) {
    const tag=node.rawTagName??'';
    if(['script','style'].includes(tag.toLowerCase())||node.hasAttribute?.('data-selo-etiqueta'))return;
    if(node.nodeType===3){current+=node.textContent;return;}
    if(block.test(tag))flush();
    for(const child of node.childNodes??[])visit(child);
    if(block.test(tag))flush();
  }
  visit(root);flush();return result;
}
export function conferirFormaDasCitacoes(root, rota, rows) {
  const lang=rota?.lang??(root.querySelector('html')?.getAttribute('lang')?.startsWith('en')?'en':'pt');
  return unidadesDaForma(root).flatMap(text=>errosDaFormaNoTexto(text,rows,lang));
}
