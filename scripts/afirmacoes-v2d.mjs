/** V2-d: seis afirmações seladas na pesquisa, contra excerto e corpo original. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const caminhoSeguro=p=>typeof p==='string'&&p.startsWith('content/24 Orcamento 2027 Analise/source/debate/')&&!p.split('/').includes('..')&&!p.includes('\\')&&/\.(html|pdf)$/.test(p);
const pdfs=new Map();
function corpoDoDocumento(p,motor){
 const ficheiro=path.join(motor,p.document.file),raw=fs.readFileSync(ficheiro);
 const hash=crypto.createHash('sha256').update(raw).digest('hex');
 if(p.document.file.endsWith('.pdf')){
  if(!pdfs.has(hash))pdfs.set(hash,execFileSync('pdftotext',['-layout','-enc','UTF-8',ficheiro,'-'],{encoding:'utf8',maxBuffer:20*1024*1024}));
  const paginas=pdfs.get(hash).split('\f'),capa=normal(paginas[0]);
  const m=capa.match(new RegExp(`(\\d{1,2}) de (${meses.join('|')}) de (\\d{4})`,'i'));
  return {tipo:'pdf',hash,texto:normal(paginas[p.document.page-1]),autores:capa,data:m?`${m[3]}-${String(meses.indexOf(m[2].toLowerCase())+1).padStart(2,'0')}-${m[1].padStart(2,'0')}`:null};
 }
 const tree=parse(raw.toString('utf8'));
 const data=tree.querySelector('time[itemprop="datePublished"]')?.getAttribute('datetime')?.slice(0,10);
 const autores=tree.querySelector('meta[property="Autor"]')?.getAttribute('content');
 tree.querySelectorAll('script,style,head').forEach(n=>n.remove());
 return {tipo:'html',hash,texto:normal(tree.textContent),autores:[normal(autores)],data};
}
export function conferirAfirmacaoV2d(c,p,corpo){
 const erros=[];
 if(!p)return ['V2D selo: falta a prova'];
 const d=p.document,r=p.receipt;
 if(!caminhoSeguro(d?.file)||!/^[a-f0-9]{64}$/.test(d?.source_sha256??'')||r?.sha256!==d.source_sha256||!/^\d{4}-\d{2}-\d{2}T/.test(r?.acedido_em??''))erros.push('V2D selo: referência ou recibo incompleto');
 if(c.document?.source_sha256!==d?.source_sha256||(corpo&&corpo.hash!==d?.source_sha256))erros.push('V2D selo: hash diferente do corpo alojado');
 if(c.afirmacao!==true||p.afirmacao!==true||normal(c.excerpt)!==normal(p.excerpt)||(corpo&&!corpo.texto.includes(normal(c.excerpt))))erros.push('V2D excerto: palavras diferentes da prova ou da página citada');
 if(!p.attributed_to?.length||JSON.stringify(c.attributed_to)!==JSON.stringify(p.attributed_to)||(corpo&&(corpo.tipo==='html'?JSON.stringify(p.attributed_to)!==JSON.stringify(corpo.autores):p.attributed_to.some(a=>!corpo.autores?.includes(a)))))erros.push('V2D atribuição: autor diferente do documento');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.published_at??'')||c.published_at!==p.published_at||c.reference_date!==p.published_at||(corpo&&corpo.data!==p.published_at))erros.push('V2D data: diferente da publicação do documento');
 if(c.source_url!==p.source_url||![r?.pedido,r?.endereco_final].includes(p.source_url))erros.push('V2D porta: diferente do pedido registado');
 const compacto=x=>normal(x).replace(/(?<=\d)\s+(?=\d)/g,'');
 const valor=compacto(c.value), prova=compacto(p.value), texto=compacto(c.excerpt);
 const numero=/^[−-]?\d+(?:[,.]\d+)?$/.test(valor);
 const padrao=valor.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 if(valor!==prova||(numero?!new RegExp(`(?<![\\d,.])${padrao}(?![\\d,.])`).test(texto):c.unit!=='afirmação'||normal(c.value)!==normal(c.excerpt)))erros.push('V2D valor: não coincide com o excerto selado');
 if(c.unit!==p.unit||c.document?.kind!==(String(d?.file??'').endsWith('.pdf')?'pdf':'html'))erros.push('V2D medida: unidade ou tipo de documento diferente');
 return erros;
}
export function conferirAfirmacoesV2d(claims,{plantar=true,motor,excluir=new Set()}={}){
 const ficheiro='ledger/provas/v2d/provas.json';
 if(!fs.existsSync(ficheiro))return {errors:[],checked:0,bodies:0,plantas:[],ids:new Set()};
 const provas=JSON.parse(fs.readFileSync(ficheiro,'utf8')).rows;
 const errors=[],plantas=[],ids=new Set();let checked=0,bodies=0;
 if(fs.readdirSync('ledger/provas/v2d').some(n=>n!=='provas.json'))errors.push('V2D direitos: a prova pública só admite excertos e referências em provas.json');
 for(const [id,p] of Object.entries(provas)){
  if(excluir.has(id))continue;
  if(!p.afirmacao&&!claims.get(id)?.afirmacao)continue;
  ids.add(id);const c=claims.get(id);
  if(!c){errors.push(`${id}: V2D afirmação selada ausente do livro`);continue;}
  let corpo;
  if(motor&&caminhoSeguro(p.document?.file)){try{corpo=corpoDoDocumento(p,motor);bodies++;}catch{errors.push(`${id}: V2D selo: corpo indisponível ou ilegível no motor indicado`);}}
  const encontrados=conferirAfirmacaoV2d(c,p,corpo);errors.push(...encontrados.map(e=>`${id}: ${e}`));checked++;
  if(plantar&&!encontrados.length&&!plantas.length){
   for(const [nome,altera,prefixo] of [
    ['excerto V2D alterado',x=>{x.excerpt+=' Palavra acrescentada.';},'V2D excerto:'],
    ['autor V2D trocado',x=>{x.attributed_to=['Entidade do ensaio'];},'V2D atribuição:'],
    ['data V2D trocada',x=>{x.published_at='2000-01-01';},'V2D data:'],
    ['porta V2D trocada',x=>{x.source_url='https://example.invalid/ensaio';},'V2D porta:'],
    ['valor V2D fora do excerto',x=>{x.value='987654321';},'V2D valor:'],
    ['unidade V2D trocada',x=>{x.unit='unidade do ensaio';},'V2D medida:'],
    ['hash V2D trocado',x=>{x.document.source_sha256='0'.repeat(64);},'V2D selo:'],
   ]){const copia=structuredClone(c);altera(copia);const mensagem=conferirAfirmacaoV2d(copia,p,corpo).find(e=>e.startsWith(prefixo));plantas.push({nome,mensagem});if(!mensagem)errors.push('V2D planta não mordeu: '+nome);}
   const fora=structuredClone(p);fora.document.file='../fora.html';const mensagem=conferirAfirmacaoV2d(c,fora).find(e=>e.startsWith('V2D selo:'));plantas.push({nome:'caminho V2D fora do motor',mensagem});if(!mensagem)errors.push('V2D planta não mordeu: caminho fora');
  }
 }
 return {errors,checked,bodies,plantas,ids};
}
