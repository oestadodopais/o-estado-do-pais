/** DO2-C: constrói uma cópia com o dossiê fora das novidades e confere o HTML real.
 * Não lança navegador nem altera dados ou dist da worktree. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { candidatasDoInicio, listagensDoInicio } from '../../src/lib/listagens-do-inicio.mjs';
import { DOSSIES } from '../../src/data/dossies.mjs';
import { conferirListagens } from './listagens.mjs';
import { conferirInicio } from '../discussao/itens.mjs';
const raiz=process.cwd(), copia=fs.mkdtempSync(path.join(os.tmpdir(),'oedp-do2-inicio-'));
const saida=process.argv[2];assert(saida,'Falta o ficheiro do resumo');
const ficheiros=['src/lib/novidades.mjs','dist/index.html','dist/en/index.html'];
const hashes=()=>ficheiros.map(f=>createHash('sha256').update(fs.readFileSync(path.join(raiz,f))).digest('hex'));
const antes=hashes(),resultados=[];
try {
 for(const nome of fs.readdirSync(raiz)){
  if(['dist','.git','.astro','.sinais'].includes(nome))continue;
  if(['src','scripts','tests'].includes(nome))execFileSync('cp',['-al',path.join(raiz,nome),path.join(copia,nome)]);
  else fs.symlinkSync(path.join(raiz,nome),path.join(copia,nome));
 }
 fs.mkdirSync(path.join(copia,'.astro'));
 fs.copyFileSync(path.join(raiz,'dist/version.json'),path.join(copia,'.astro/version.json'));
 // A única adulteração da cópia: a lista publicada não oferece as peças do dossiê.
 const f=path.join(copia,'src/lib/novidades.mjs'),original=fs.readFileSync(f,'utf8');
 const alterado=original.replace('pecasPublicadas(lang), dossiesDaLista(lang)', 'pecasPublicadas(lang).filter(p=>!p.dossie), dossiesDaLista(lang)');
 assert.notEqual(alterado,original);fs.unlinkSync(f);fs.writeFileSync(f,alterado);
 const log=path.join(copia,'construcao.log'),fd=fs.openSync(log,'w');
 const r=spawnSync(process.execPath,[path.join(raiz,'node_modules/astro/bin/astro.mjs'),'build'],{cwd:copia,stdio:['ignore',fd,fd],timeout:180000});fs.closeSync(fd);
 assert.equal(r.status,0,`A construção da cópia falhou: ${fs.readFileSync(log,'utf8').split('\n').slice(-12).join('\n')}`);
 for(const lang of ['pt','en']){
  const candidatas=candidatasDoInicio(lang);candidatas.novidades=candidatas.novidades.filter(e=>e.tipo!=='dossie');
  const listas=listagensDoInicio(lang,candidatas),root=parse(fs.readFileSync(path.join(copia,'dist',lang==='pt'?'index.html':'en/index.html'),'utf8'));
  // A caixa repõe a quinta entrada após a adulteração, mas não volta a conter um dossiê.
  const erros=[...conferirListagens(root,lang,listas),...conferirInicio(root,lang,path.join(raiz,'dist'),listas)];
  assert.deepEqual(erros,[]);
  assert.equal(root.querySelectorAll('[data-discussao-inicio] [data-dossie-lista]').length,DOSSIES.length);
  const entrada=root.querySelector('[data-discussao-inicio] [data-dossie-lista]');
  resultados.push({lang,construcao:r.status,primeiraSeccao:'discussao',entrada:entrada.querySelector('h3').text.replace(/\s+/g,' ').trim(),erros});
 }
 assert.deepEqual(hashes(),antes,'A planta alterou a worktree');
 fs.writeFileSync(saida,JSON.stringify({originaisIntactos:true,resultados},null,2)+'\n');
 console.log(`DO2-C: duas edições construídas numa cópia; o dossiê aparece uma vez na discussão, com a forma da lista. Originais intactos.`);
} finally {fs.rmSync(copia,{recursive:true,force:true});}
