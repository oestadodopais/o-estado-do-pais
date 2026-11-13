/** Apenas os trechos depois das folhas decididas COR3, com os documentos presos aos bytes conferidos. */
import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
import {cortar,chave} from './frases-com-afirmacao.mjs';
const base='design/especime-v3/medicoes/cor3-2026-11-12/';
const decididos=JSON.parse(execFileSync('python3',['-c',`import runpy,json; c=runpy.run_path('${base}conferir-composto-cor3.py'); print(json.dumps(c['cases']()[0],ensure_ascii=False))`],{encoding:'utf8'}));
const estudos={orcamento:'orcamento-2027-o-que-muda-e-para-quem',habitacao:'a-casa-em-portugal-e-na-europa',reforma:'penalizacoes-por-reforma-antecipada-2026'};
const sha=b=>createHash('sha256').update(b).digest('hex');
export function conferirTrechosCor3(paginas,frases,{ler=f=>fs.readFileSync(f)}={}){
 const erros=[],textos=new Set(),aprovadas=new Map(),transformacoes=new Map();let entries;
 const manifesto=load(ler('studies-src/manifest.yml').toString());
 const norm=s=>s.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
 try{entries=JSON.parse(ler(base+'TRECHOS-COR3.json'));}catch{return {erros:['COR3: trechos decididos ilegíveis'],textos};}
 const leaves=new Set(['orcamento','habitacao','reforma'].map(s=>base+'FOLHA-'+s+'-decidida.md'));
 for(const r of entries){
  try{
   if(!leaves.has(r.folha)||r.documento!==`studies-src/${r.estudo}/${r.lingua}.html`||!['pt','en'].includes(r.lingua))throw Error('origem fora do âmbito');
   if(!decididos.some(c=>estudos[c.estudo]===r.estudo&&c.lingua===r.lingua&&c.correcao===r.correcao&&c.depois===r.depois&&c.antes===r.antes))throw Error('não é um trecho Depois da correção decidida');
   const folha=ler(r.folha);if(sha(folha)!==r.sha256_folha||!folha.toString().includes(r.depois)||!r.depois)throw Error('trecho fora da folha decidida');
   if(sha(ler(r.documento))!==r.sha256_documento)throw Error('documento diferente do conferido');
   // O literal é a extração do trecho autorizado; não pode acrescentar palavras.
   const tokens=s=>s.replace(/<[^>]*>/g,' ').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim();
   if(tokens(r.literal_antes)!==tokens(r.antes))throw Error('Antes diferente da decisão');
   const historica=manifesto.edicoes.find(e=>e.slug===r.estudo&&e.lang===r.lingua)?.edicoes.slice(0,-1).find(e=>'studies-src/'+e.file===r.anterior&&e.sha256===r.sha256_anterior);
   if(!historica||sha(ler(r.anterior))!==r.sha256_anterior)throw Error('edição anterior diferente da testemunha');
   if(tokens(r.literal)!==tokens(r.depois))throw Error('literal diferente da decisão');
   const key=r.estudo+'/'+r.lingua,set=aprovadas.get(key)??new Set();for(const frase of cortar(r.literal))set.add(frase);aprovadas.set(key,set);
   const ts=transformacoes.get(key)??[];ts.push({...r,anteriorTexto:norm(parse(ler(r.anterior).toString()).structuredText)});transformacoes.set(key,ts);
  }catch(e){erros.push(`COR3 ${r.estudo}/${r.lingua} ${r.correcao}: ${e.message}`);}
 }
 const porRota=new Map(paginas.map(p=>[p.rota,p]));
 for(const f of frases){if(!f.ocorrencias?.length)continue;
  if(f.ocorrencias.every(o=>{const p=porRota.get(o.pagina);if(!p)return false;const estudo=p.estudo==='/dossies/orcamento-2027'?'orcamento-2027-o-que-muda-e-para-quem':p.estudo;const k=estudo+'/'+p.lingua,frase=p.blocos[o.bloco]?.frases[o.indice];if(aprovadas.get(k)?.has(frase))return true;
   let antes=norm(frase??''),mudou=false;const ts=transformacoes.get(k)??[];if(antes.length>20&&ts.some(r=>norm(r.literal).includes(antes)))return true;for(const r of ts){const de=norm(r.literal);if(antes.includes(de)){antes=antes.replaceAll(de,norm(r.literal_antes));mudou=true;}}
   const compacto=s=>s.replace(/\s/g,'');
   const testemunhado=ts.some(r=>compacto(r.anteriorTexto).includes(compacto(antes)));
   const bloco=norm((p.blocos[o.bloco]?.frases??[]).join(' '));
   return testemunhado&&(mudou||ts.some(r=>bloco.includes(norm(r.literal))));}))textos.add(chave(f));
 }
 return {erros,textos};
}
