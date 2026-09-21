#!/usr/bin/env node
/** Plantas do B1, peça 3. Só quatro cópias de páginas num diretório temporário.
 * As tabelas mudam apenas na memória do processo filho; o repositório não muda. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { verificaVozPais } from '../../scripts/voz-pais.mjs';
const raiz=fs.mkdtempSync(path.join(os.tmpdir(),'oedp-pais-'));
const pasta=path.join(raiz,'dist');
const rotas=['index.html','en/index.html','temas/index.html','en/themes/index.html'];
const originais=new Map(rotas.map(f=>[f,fs.readFileSync(path.join('dist',f),'utf8')]));
const resultados=[];
const repor=()=>{for(const [f,s] of originais){const alvo=path.join(pasta,f);fs.mkdirSync(path.dirname(alvo),{recursive:true});fs.writeFileSync(alvo,s);}};
const html=(f,fn)=>{const raiz=parse(fs.readFileSync(path.join(pasta,f),'utf8'));fn(raiz);fs.writeFileSync(path.join(pasta,f),raiz.toString());};
function prova(nome,esperado,preparar=()=>{},antes='') {
 repor();preparar();
 const codigo=`${antes}\nawait import('./scripts/check-pais.mjs');`;
 const r=spawnSync(process.execPath,['--input-type=module','-e',codigo],{encoding:'utf8',env:{...process.env,OEDP_DIST:pasta}});
 const saida=r.stdout+r.stderr;
 const passou=esperado ? r.status===1&&saida.includes(esperado) : r.status===0;
 resultados.push({nome,codigo:r.status,celula:esperado||'todas',passou,saida:saida.trim()});
 if(!passou)throw Error(`${nome}: ${saida}`);
}
try {
 prova('páginas sem estrago',null);
 const card=parse(originais.get('temas/index.html')).querySelector('[data-cartao-medida]').getAttribute('data-cartao-medida');
 prova('medida rendida sem tema declarado','T2',()=>{},`import {DOMINIO_DAS_MEDIDAS} from './src/data/dominios.mjs';delete DOMINIO_DAS_MEDIDAS[${JSON.stringify(card)}];`);
 prova('medida do país no tema errado','T3',()=>html('index.html',r=>r.querySelector('[data-tema]').setAttribute('data-tema','trabalho')));
 prova('medida repetida','T4',()=>html('temas/index.html',r=>{const c=r.querySelector('[data-cartao-medida]');c.insertAdjacentHTML('afterend',c.outerHTML);}));
 prova('medida publicada ausente','T5',()=>html('temas/index.html',r=>r.querySelector('[data-cartao-medida]').remove()));
 prova('mudança sem secção','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';delete MUDANCAS_DO_PROJETO[0].decisao;`);
 prova('mudança com secção inexistente','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';MUDANCAS_DO_PROJETO[0].decisao='0.0';`);
 prova('correção de linha ausente','C1',()=>html('index.html',r=>r.querySelector('.pais-mudou [data-correcao-entrada]').remove()));
 prova('texto da mudança alterado','M2',()=>html('index.html',r=>r.querySelector('[data-mudanca-campo="texto"]').set_content('Uma frase que a direção não escreveu.')));
 prova('ordem dos estudos trocada','E1',()=>html('index.html',r=>{const a=r.querySelectorAll('#trabalhos [data-estudo]');const x=a[0].getAttribute('data-estudo');a[0].setAttribute('data-estudo',a[1].getAttribute('data-estudo'));a[1].setAttribute('data-estudo',x);}));
 prova('comparação europeia sem recibo','L3',()=>html('index.html',r=>r.querySelector('[data-leitura-pais] a[href="/livro-razao/taxa-de-desemprego-2025-ue"]').remove()));
 prova('sexta entrada no menu','N1',()=>html('index.html',r=>r.querySelector('#nav-principal').insertAdjacentHTML('beforeend','<a href="/agenda">Agenda</a>')));
 prova('ponto final sem ligação inseparável','N2',()=>html('index.html',r=>r.querySelector('.rotulo-ia-final').removeAttribute('class')));
 repor();
 if(verificaVozPais(raiz).length)throw Error('A lista fechada não está verde antes da planta.');
 html('index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Esta página explica como se deve ler o projeto.</p>'));
 const voz=verificaVozPais(raiz);
 if(!voz.some(e=>e.includes('lista fechada país')))throw Error('A prosa plantada não foi vista.');
 resultados.push({nome:'frase explicativa fora da lista fechada',codigo:1,celula:'B1 voz',passou:true,saida:voz.join('\n')});
 repor();html('index.html',r=>r.querySelector('[data-leitura-pais]').set_content('Uma leitura diferente.'));
 const leitura=verificaVozPais(raiz);
 if(!leitura.some(e=>e.includes('leitura aprovada')))throw Error('A leitura alterada não foi vista.');
 resultados.push({nome:'leitura aprovada alterada',codigo:1,celula:'B1 leitura',passou:true,saida:leitura.join('\n')});
 const i=process.argv.indexOf('--json');if(i!==-1)fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`OK ${r.nome}: ${r.celula}, código ${r.codigo}`);
}finally{fs.rmSync(raiz,{recursive:true,force:true});}
