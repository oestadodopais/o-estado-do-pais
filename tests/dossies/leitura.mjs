/** DO3: ordem, transcrição e identidade dos recortes nas duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {DOSSIES} from '../../src/data/dossies.mjs';
import {blocosDoDossie, leituraDoDossie, MOBILIA_DO_DOSSIE} from '../../src/lib/dossie-leitura.mjs';
import {registoDaEdicao} from '../../src/lib/registos.mjs';
import {routePath} from '../../src/lib/routes.mjs';
const ler = rota => parse(fs.readFileSync(`dist/${rota.replace(/^\//,'')}/index.html`,'utf8'));
export function conferirLeitura(root,d,lang) {
 const erros=[], secs=leituraDoDossie(d,lang), artigo=root.querySelector('[data-dossie]');
 if(!artigo)return ['DO3: falta o dossiê'];
 const esperados=[...secs.map(s=>s.id),...d.pecas.explicacoes.map(s=>`dossie-${s}`),'discussao-inicio','dossie-calendario'];
 const links=artigo.querySelectorAll('[data-dossie-indice] li a');
 if(JSON.stringify(links.map(a=>a.getAttribute('href')))!==JSON.stringify(esperados.map(id=>`#${id}`)))erros.push('DO3: índice com ordem ou destino diferente');
 if(artigo.querySelector('#texto-indice-k')?.textContent!==MOBILIA_DO_DOSSIE[lang].indice)erros.push('DO3: título do índice diferente');
 for(const a of links)if(a.textContent!==artigo.querySelector(a.getAttribute('href'))?.textContent)erros.push('DO3: título do índice diferente da secção');
 const rendidas=artigo.querySelectorAll('[data-dossie-seccao]');
 if(JSON.stringify(rendidas.map(s=>s.getAttribute('data-dossie-seccao')))!==JSON.stringify(secs.map(s=>s.id)))erros.push('DO3: seleção de secções diferente');
 const fonte=ler(routePath('estudo',lang,{slug:d.pecas.estudos[0]}));
 for(const s of rendidas)for(const bloco of s.querySelectorAll('[data-registo-bloco]')) {
  const original=fonte.querySelector(`[data-registo-bloco="${bloco.getAttribute('data-registo-bloco')}"]`);
  const normal=n=>{const c=parse(n?.outerHTML??'');c.querySelectorAll('[aria-labelledby]').forEach(x=>x.removeAttribute('aria-labelledby'));return c.toString();};
  if(normal(bloco)!==normal(original))erros.push('DO3: bloco diferente do estudo publicado');
 }
 const resto=artigo.querySelector('[data-dossie-resto] a');
 if(resto?.textContent!==MOBILIA_DO_DOSSIE[lang].resto||resto?.getAttribute('href')!==routePath('estudo',lang,{slug:d.pecas.estudos[0]}))erros.push('DO3: porta do resto diferente');
 if(artigo.querySelectorAll('[data-dossie-peca]').length!==Object.values(d.pecas).flat().length)erros.push('DO3: pertenças diferentes');
 return erros;
}
if(process.argv[1]?.endsWith('/leitura.mjs')) {
 let plantas=0;
 for(const lang of ['pt','en'])for(const d of DOSSIES) {
  const r=registoDaEdicao(d.pecas.estudos[0],lang);
  for(const selecao of [[{...d.leitura[0],id:'bloco-99999'}],[{...d.leitura[0],[lang]:'Título alterado'}]]) {assert.throws(()=>blocosDoDossie(r,selecao,lang));plantas++;}
  const root=ler(routePath('dossie',lang,{slug:d.slug}));assert.deepEqual(conferirLeitura(root,d,lang),[]);
  for(const altera of [r=>r.querySelector('[data-dossie-indice] a').setAttribute('href','#bloco-6'),r=>r.querySelector('[data-dossie-resto] a').set_content('Outra frase'),r=>r.querySelector('[data-registo]').set_content('999999')]) {
   const copia=parse(root.toString());altera(copia);assert(conferirLeitura(copia,d,lang).length);plantas++;
  }
 }
 console.log(`DO3: ordem e transcrição conferidas; ${plantas} plantas recusadas.`);
}
