/** CAM2-A: cobertura por identidade literal, presa aos bytes julgados e ao registo. */
import fs from 'node:fs';
import {textoDoRotulo} from '../src/data/politica-ia.mjs';
import {routePath} from '../src/lib/routes.mjs';
import path from 'node:path';
import {load} from 'js-yaml';
import {createHash} from 'node:crypto';
import {cortar,chave} from './frases-com-afirmacao.mjs';
import {LEITURAS} from '../src/data/leituras.mjs';
import {getClaim} from '../src/lib/ledger.mjs';
import {valorNaLingua} from '../src/lib/valor-na-lingua.mjs';
// Lista fechada: a origem declara o nome da troca, nunca um par arbitrário.
const TROCAS_LEITURA = {
  pt: ['do município', 'da câmara'],
  en: ['the municipality', 'the council'],
};
export function leituraJulgada(entrada, lingua, unidades, estudo) {
  const origem=entrada?.origem, partes=entrada?.frase?.[lingua];
  if(!origem || !origem.onde?.includes(`studies-src/${estudo}/${lingua}.html:`) || !Array.isArray(partes))return null;
  const literal=origem[lingua];
  const inteira=[...unidades].some(u=>u===literal || [...new Intl.Segmenter(lingua,{granularity:'sentence'}).segment(u)].some(s=>u.slice(0,s.index+s.segment.trimEnd().length)===literal));
  if(!inteira)return null;
  const impressas=[];
  for(const p of partes){
    if(typeof p==='string'){if(/\d/u.test(p))return null;impressas.push(p);}
    else if(p && Object.keys(p).join(',')==='ref' && /^[12]\d{3}$/.test(p.ref))impressas.push(p.ref);
    else if(p && Object.keys(p).join(',')==='claim'){
      try {const linha=getClaim(p.claim);if(linha.study!==estudo)return null;impressas.push(valorNaLingua(linha,lingua));}catch{return null;}
    }else return null;
  }
  let esperada=literal;
  if(origem.troca!==undefined){
    if(origem.troca!=='governo-do-concelho')return null;
    const [antes,depois]=TROCAS_LEITURA[lingua];
    if(!esperada.includes(antes))return null;
    esperada=esperada.replace(antes,depois);
  }
  const impressa=impressas.join('');
  return impressa===esperada ? impressa : null;
}

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = s => /^[a-f0-9]{64}$/.test(s ?? '');
const dia = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
export function lerTextosJulgados(raiz='.') {
  const file=path.join(raiz,'ledger/frases/textos-julgados.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : [];
}
export function conferirTextosJulgados(declaracoes, paginas, frases, {raiz='.', documentos, registos, ler, leituras=LEITURAS}={}) {
  const erros=[], textos=new Set(), mobilia=new Set(), admitidas=new Map(), copias=new Map(), vistas=new Set();
  const leiturasAdmitidas={pt:new Set(),en:new Set()};
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
      const registo=JSON.parse(bytes.toString()), literais=new Set(), unidades=new Set();
      const recolher = n => {
        if(Array.isArray(n))return n.forEach(recolher);
        if(!n||typeof n!=='object')return;
        if(typeof n.text==='string'){
          unidades.add(n.text);
          for(const frase of cortar(n.text.replace(/\u200b/g, '')))literais.add(frase);
        }
        if(n.items)recolher(n.items);
        if(n.rows)recolher(n.rows);
      };
      recolher(registo.blocks);
      if(!literais.size)throw Error('registo sem frases');
      admitidas.set(par,literais);
      const leitura=leituraJulgada(leituras[d.estudo],d.lingua,unidades,d.estudo);
      if(leitura)for(const frase of cortar(leitura))leiturasAdmitidas[d.lingua].add(frase);
      copias.set(par,{nome:registo.blocks[1]?.text,pergunta:registo.blocks[2]?.text,data:docs[0].edicoes.length===1?docs[0].edicoes[0].data:null});
    }catch(e){erros.push(`texto julgado ${par}: ${e.message}`);}
  }
  const porRota=new Map(paginas.map(p=>[p.rota,p]));
  for(const f of frases){
    const literais=admitidas.get(`${f.estudo}/${f.lingua}`);
    if(!f.ocorrencias?.length)continue;
    // A chave antiga omite números. Esta via confere cada ocorrência com os números intactos.
    const corresponde = (o, aviso=false) => {
      const p=porRota.get(o.pagina), frase=p?.blocos[o.bloco]?.frases[o.indice];
      return p?.estudo===f.estudo&&p.lingua===f.lingua&&['estudo','documento'].includes(p.tipo)&&
        (aviso ? p.tipo==='estudo' && p.blocos[o.bloco].rotuloIA===routePath('metodo',p.lingua) && frase===textoDoRotulo(p.lingua) : literais.has(frase));
    };
    if(literais&&f.ocorrencias.every(o=>corresponde(o)))textos.add(chave(f));
    else if(literais&&f.ocorrencias.every(o=>corresponde(o,true)))mobilia.add(chave(f));
    else if(f.ocorrencias.every(o=>{
      const p=porRota.get(o.pagina), frase=p?.blocos[o.bloco]?.frases[o.indice];
      return p?.lingua===f.lingua&&leiturasAdmitidas[f.lingua]?.has(frase);
    }))textos.add(chave(f));
    else if(f.ocorrencias.every(o=>{
      const p=porRota.get(o.pagina),b=p?.blocos[o.bloco],c=b?.copiaJulgada;
      if(!c||p.lingua!==f.lingua||b.frases.length!==1||b.frases[0]!==c.texto)return false;
      const prova=copias.get(`${c.estudo}/${p.lingua}`);
      if(!prova||c.porta!==routePath('estudo',p.lingua,{slug:c.estudo}))return false;
      if(c.tipo==='pergunta')return ['estudos','indice','municipio'].includes(p.tipo)&&c.texto===prova.pergunta;
      if(c.tipo==='titulo')return p.tipo==='home'&&c.lingua===p.lingua&&c.nome===prova.nome&&c.novo===(p.lingua==='pt'?'novo':'new')&&c.texto===prova.nome+' '+c.novo;
      const dia=prova.data?.split('-').reverse().join('.'),rotulo=p.lingua==='pt'?'estudo':'study';
      return c.tipo==='novidade'&&p.tipo==='home'&&c.lingua===p.lingua&&c.data===prova.data&&c.dia===dia&&c.rotulo===rotulo&&c.nome===prova.nome&&c.texto===dia+rotulo+prova.nome;
    }))textos.add(chave(f));
  }
  return {erros,textos,mobilia};
}
