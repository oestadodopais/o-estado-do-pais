/** CAM2-A: cobertura por identidade literal, presa aos bytes julgados e ao registo. */
import fs from 'node:fs';
import {textoDoRotulo} from '../src/data/politica-ia.mjs';
import {routePath} from '../src/lib/routes.mjs';
import path from 'node:path';
import {load} from 'js-yaml';
import {createHash} from 'node:crypto';
import {cortar,chave} from './frases-com-afirmacao.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = s => /^[a-f0-9]{64}$/.test(s ?? '');
const dia = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
export function lerTextosJulgados(raiz='.') {
  const file=path.join(raiz,'ledger/frases/textos-julgados.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : [];
}
export function conferirTextosJulgados(declaracoes, paginas, frases, {raiz='.', documentos, registos, ler}={}) {
  const erros=[], textos=new Set(), mobilia=new Set(), admitidas=new Map(), vistas=new Set();
  ler ??= f => fs.readFileSync(path.join(raiz,f));
  documentos ??= load(ler('studies-src/manifest.yml').toString());
  registos ??= JSON.parse(ler('registos/manifest.json').toString());
  if(!Array.isArray(declaracoes))return {erros:['texto julgado: declaração não é uma lista'],textos};
  for(const d of declaracoes){
    const par=`${d.estudo}/${d.lingua}`;
    try {
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.estudo??'') || !['pt','en'].includes(d.lingua) || vistas.has(par))throw Error('estudo, língua ou unicidade inválidos');
      vistas.add(par);
      if(typeof d.quem_julgou!=='string'||!d.quem_julgou.trim()||!dia(d.data_fecho)||!/^[a-f0-9]{40}$/.test(d.commit_motor??''))throw Error('falta quem julgou, data de fecho ou commit do motor');
      if(!digest(d.sha256_documento)||!digest(d.texto?.sha256)||typeof d.texto?.file!=='string'||!d.texto.file.startsWith('design/especime-v3/medicoes/')||d.texto.file.split('/').includes('..'))throw Error('ficheiro do texto julgado ou resumo inválidos');
      if(sha(ler(d.texto.file))!==d.texto.sha256)throw Error('texto julgado diferente do declarado');
      const docs=documentos.edicoes.filter(e=>e.slug===d.estudo&&e.lang===d.lingua), r=registos.registos[par];
      if(docs.length!==1||!r||docs[0].sha256_normalized!==d.sha256_documento||r.edicao_html_sha256!==d.sha256_documento)throw Error('resumos do documento, do registo e da declaração diferentes');
      if(sha(ler(`studies-src/${d.estudo}/${d.lingua}.html`))!==d.sha256_documento)throw Error('bytes do documento diferentes');
      const bytes=ler(`registos/${par}.record.json`);
      if(sha(bytes)!==r.exported_record_sha256)throw Error('bytes do registo diferentes');
      const registo=JSON.parse(bytes.toString()), literais=new Set();
      const recolher = n => {
        if(Array.isArray(n))return n.forEach(recolher);
        if(!n||typeof n!=='object')return;
        if(typeof n.text==='string')for(const frase of cortar(n.text.replace(/\u200b/g, '')))literais.add(frase);
        if(n.items)recolher(n.items);
        if(n.rows)recolher(n.rows);
      };
      recolher(registo.blocks);
      if(!literais.size)throw Error('registo sem frases');
      admitidas.set(par,literais);
    }catch(e){erros.push(`texto julgado ${par}: ${e.message}`);}
  }
  const porRota=new Map(paginas.map(p=>[p.rota,p]));
  for(const f of frases){
    const literais=admitidas.get(`${f.estudo}/${f.lingua}`);
    if(!literais||!f.ocorrencias?.length)continue;
    // A chave antiga omite números. Esta via confere cada ocorrência com os números intactos.
    const corresponde = (o, aviso=false) => {
      const p=porRota.get(o.pagina), frase=p?.blocos[o.bloco]?.frases[o.indice];
      return p?.estudo===f.estudo&&p.lingua===f.lingua&&['estudo','documento'].includes(p.tipo)&&
        (aviso ? p.tipo==='estudo' && p.blocos[o.bloco].rotuloIA===routePath('metodo',p.lingua) && frase===textoDoRotulo(p.lingua) : literais.has(frase));
    };
    if(f.ocorrencias.every(o=>corresponde(o)))textos.add(chave(f));
    else if(f.ocorrencias.every(o=>corresponde(o,true)))mobilia.add(chave(f));
  }
  return {erros,textos,mobilia};
}
