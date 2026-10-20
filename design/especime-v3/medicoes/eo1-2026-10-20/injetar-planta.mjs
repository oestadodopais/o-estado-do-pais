// Altera apenas o objeto do registo lido pelo processo de ensaio.
const parse=JSON.parse;
JSON.parse=function(text,reviver){
 const r=parse(text,reviver);
 if(!reviver&&r?.proof_rows&&Array.isArray(r.blocks)&&r.lang===process.env.EO1_EDICAO){
  const kind=process.env.EO1_PLANTA;
  if(kind==='valor')r.blocks.find(b=>b.figures.length).figures[0].value+='1';
  else if(kind==='excerto'){const b=r.blocks.find(b=>b.proofs.some(p=>p.tipo==='excerto')),q=b.proofs.find(p=>p.tipo==='excerto'),chars=Array.from(b.text);chars.splice(q.inicio,1);b.text=chars.join('');}
  else if(kind==='literal')r.blocks.flatMap(b=>b.proofs).find(p=>p.tipo==='literal').apoios=[];
  else throw Error('planta desconhecida');
 }
 return r;
};
