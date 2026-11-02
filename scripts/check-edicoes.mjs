import fs from 'node:fs';
import {conferirFaixaDaVersao} from './documento-edicao-conferir.mjs';
import {matchPath} from '../src/lib/routes.mjs';
import {conferirTestemunhas} from './historia-edicoes-conferir.mjs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { WORKS } from '../src/data/studies.mjs';
import { CORRECOES_TEXTO } from '../src/data/correcoes.mjs';
import { sha256 } from '../src/lib/edicoes.mjs';
import { conferirEdicoes, conferirTextoHtml } from './edicoes-conferir.mjs';
const manifesto = load(fs.readFileSync('studies-src/manifest.yml','utf8'));
const paginas = new Map(), dist = process.env.OEDP_DIST ?? 'dist';
if (!process.argv.includes('--fontes')) {
  function ler(dir) {for(const f of fs.readdirSync(dir,{withFileTypes:true})) {const p=path.join(dir,f.name);if(f.isDirectory())ler(p);else if(f.name.endsWith('.html'))paginas.set('/'+path.relative(dist,p).replace(/\/index.html$/,'').replace(/^index.html$/,''),fs.readFileSync(p,'utf8'));}}
  ler(dist);
}
const erros = conferirEdicoes({works:WORKS,manifesto,correcoes:CORRECOES_TEXTO,raiz:'studies-src',paginas:process.argv.includes('--fontes')?null:paginas});
let permitirAusencia=false;
try{permitirAusencia=execFileSync('git',['rev-parse','--is-shallow-repository'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim()==='true';}catch{permitirAusencia=true;}
const testemunhas=conferirTestemunhas(manifesto,(commit,file)=>execFileSync('git',['show',`${commit}:${file}`],{stdio:['ignore','pipe','ignore']}),{permitirAusencia});
erros.push(...testemunhas.erros);
for(const aviso of testemunhas.avisos)console.log(aviso);
for(const lang of ['pt','en']) {
  const html=paginas.get(lang==='pt'?'/correcoes':'/en/corrections');
  if(!html && !process.argv.includes('--fontes')) erros.push(`ED1 registo ausente: ${lang}`);
  if(html) {
    const root=parse(html);erros.push(...conferirTextoHtml(root,lang,WORKS,CORRECOES_TEXTO,manifesto).erros);
    const entradas=root.querySelectorAll('[data-texto-estudo]');
    for(const c of CORRECOES_TEXTO)if(entradas.filter(e=>e.getAttribute('data-texto-estudo')===c.slug&&e.getAttribute('data-texto-data')===c.data).length!==1)erros.push(`ED1 registo: ${c.slug}/${lang}`);
  }
}
for(const [rota,html] of paginas){const r=matchPath(rota);if(r?.key==='documento')erros.push(...conferirFaixaDaVersao(parse(html),manifesto,r.params.slug,r.lang,r.params.date??null));}
for(const e of erros)console.error(e);
console.log(`ED1: ${manifesto.edicoes.filter(e=>e.primeira_edicao).length} primeiras edições; ${CORRECOES_TEXTO.length} correções; ${erros.length} falhas.`);
if(erros.length)process.exitCode=1;
