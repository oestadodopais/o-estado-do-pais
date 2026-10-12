/* Sondagem da leitura do textarea. O resultado fica ligado à cabeça medida;
   a célula do navegador confere depois o texto literal contra inputValue. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { conferirCodigo } from '../../../../scripts/incorporar-do-portao.mjs';
import { routePath, matchPath } from '../../../../src/lib/routes.mjs';
import { escrever } from './medir.mjs';
const id=JSON.parse(fs.readFileSync(new URL('./capturas-prova.json',import.meta.url),'utf8')).linha;
const rota=routePath('linha','pt',{slug:id});
const original=fs.readFileSync(`dist${rota}/index.html`,'utf8');
const plantado=original.replace(/(<textarea\b[^>]*>)/,'$1<!--planta-->');
assert.notEqual(plantado,original);
const normal=parse(plantado);
const literal=parse(plantado,{blockTextElements:{script:true,noscript:true,style:true,pre:true,textarea:true}});
const antes=conferirCodigo(normal,matchPath(rota));
const depois=conferirCodigo(literal,matchPath(rota));
const mensagem='ER1 código: o pedaço difere da linha, carácter a carácter.';
assert.deepEqual(antes,[]);
assert(depois.includes(mensagem));
escrever('parser-antes',{
  comando:'node design/especime-v3/medicoes/er1-2026-10-06/medir-parser.mjs',
  cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  shaDoComparador:createHash('sha256').update(fs.readFileSync('scripts/incorporar-do-portao.mjs')).digest('hex'),
  planta:'Comentário literal dentro do campo de cópia.',
  aceiteIndevidamente:antes.length===0,queixasAntes:antes,queixasComLeituraLiteral:depois,
  comentarioNaLeituraNormal:normal.querySelector('textarea').textContent.includes('<!--planta-->'),
  comentarioNaLeituraLiteral:literal.querySelector('textarea').textContent.includes('<!--planta-->'),
  mensagem,
});
