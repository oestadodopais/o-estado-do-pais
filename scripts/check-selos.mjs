/** SEL1: mede ou recusa medidas interrompidas e selos consecutivos, sem navegador. */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {unidadeDaMedida} from '../src/lib/unidade-da-medida.mjs';

const BLOCOS = new Set(['p','div','section','article','header','footer','nav','aside','main','li','td','th','tr','h1','h2','h3','h4','h5','h6','br','hr']);
/** Uma página de cada vez; as fronteiras de bloco não juntam frases distintas. */
export function medirPagina(html) {
  const root = parse(html), fluxo = [];
  function andar(no) {
    if (no.nodeType === 3) { if (no.text) fluxo.push({texto:no.text}); return; }
    const tag = no.rawTagName?.toLowerCase();
    if (['script','style','template'].includes(tag)) return;
    if (no.classList?.contains('src-chip')) { fluxo.push({selo:true}); return; }
    if (BLOCOS.has(tag)) fluxo.push({limite:true});
    for (const filho of no.childNodes ?? []) andar(filho);
    if (BLOCOS.has(tag)) fluxo.push({limite:true});
  }
  andar(root);
  const erros = [], seguintes = {};
  const texto = fluxo.map(t=>t.selo?'■ fonte':t.limite?'\n':t.texto).join('');
  let pos=0;
  for (let i=0;i<fluxo.length;i++) {
    const t=fluxo[i];
    if (t.selo) {
      const proximo=fluxo[i+1];
      const unidade=proximo?.texto ? unidadeDaMedida(proximo.texto) : null;
      const palavra=proximo?.texto?.match(/^\s*([^\s,.;:!?]+)/u)?.[1];
      if(palavra) seguintes[palavra]=(seguintes[palavra]??0)+1;
      const contexto=texto.slice(Math.max(0,pos-20),pos)+' [■ fonte] '+texto.slice(pos+7,pos+27);
      if(unidade) erros.push({tipo:'unidade',unidade:unidade.unidade,contexto});
      let j=i+1;
      while(fluxo[j]?.texto && /^[\s\p{P}]*$/u.test(fluxo[j].texto)) j++;
      if(fluxo[j]?.selo) erros.push({tipo:'consecutivos',contexto});
    }
    pos+=(t.selo?'■ fonte':t.limite?'\n':t.texto).length;
  }
  return {erros,seguintes};
}

export function* paginas(dir, prefixo='') {
  for(const f of fs.readdirSync(path.join(dir,prefixo),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    const rel=path.join(prefixo,f.name);
    if(f.isDirectory()) yield* paginas(dir,rel);
    else if(f.name.endsWith('.html')) yield rel;
  }
}
export function medirDist(dir) {
  const resultado={paginas:0,total:0,porPagina:[],seguintes:{}};
  for(const pagina of paginas(dir)) {
    const {erros,seguintes}=medirPagina(fs.readFileSync(path.join(dir,pagina),'utf8'));
    resultado.paginas++;
    for(const [k,v] of Object.entries(seguintes)) resultado.seguintes[k]=(resultado.seguintes[k]??0)+v;
    if(!erros.length) continue;
    const rota='/'+pagina.replace(/index\.html$/,'');
    const unidades={};let consecutivos=0;
    for(const e of erros) e.tipo==='unidade' ? unidades[e.unidade]=(unidades[e.unidade]??0)+1 : consecutivos++;
    resultado.porPagina.push({pagina,rota,unidades,consecutivos,erros});
    resultado.total+=erros.length;
  }
  return resultado;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const args=process.argv.slice(2), medir=args.includes('--medir');
  const opcao=n=>args.includes(n)?args[args.indexOf(n)+1]:undefined;
  const r=medirDist(opcao('--dist')??process.env.OEDP_DIST??'dist');
  if(opcao('--json')) fs.writeFileSync(opcao('--json'),JSON.stringify(r,null,2)+'\n');
  for(const p of r.porPagina) {
    console.log(JSON.stringify({pagina:p.pagina,rota:p.rota,unidades:p.unidades,consecutivos:p.consecutivos}));
    for(const e of p.erros) console.log(`${p.pagina} ${p.rota} ${e.tipo}: ${e.contexto}`);
  }
  console.log(`SEL1: ${r.paginas} páginas; ${r.total} ocorrências${medir?' (medida)':''}.`);
  process.exitCode=!medir&&r.total?1:0;
}
