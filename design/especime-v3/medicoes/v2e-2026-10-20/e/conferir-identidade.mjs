/** Confere que incorporar as provas não alterou o código que passou os portões. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const pasta='design/especime-v3/medicoes/v2e-2026-10-20/';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:64*1024*1024});
const base=fs.readFileSync(pasta+'e/portoes-final/cabeca','utf8').trim();
const cabeca=git('rev-parse','HEAD').trim();
const arvore=rev=>git('ls-tree','-r','-z',rev).split('\0').filter(l=>l&&!l.split('\t')[1].startsWith(pasta)).sort().join('\0');
const sha=s=>createHash('sha256').update(s).digest('hex');
const esperado=sha(arvore(base));
assert.equal(sha(arvore(cabeca)),esperado,'O commit de provas alterou ficheiros fora do relatório');
const mudancas=(git('diff','--name-only','HEAD')+'\n'+git('ls-files','--others','--exclude-standard')).split('\n').filter(f=>f&&!f.startsWith(pasta));
assert.deepEqual(mudancas,[],'Há alterações por registar fora do relatório');
const r={cabeca_codigo:base,sha256_arvore_fora_relatorio:esperado};
if(process.argv.includes('--gravar'))fs.writeFileSync(pasta+'e/final/identidade.json',JSON.stringify(r,null,2)+'\n');
else assert.deepEqual(JSON.parse(fs.readFileSync(pasta+'e/final/identidade.json')),r);
console.log(JSON.stringify({...r,cabeca_entrega:cabeca,identidade_confirmada:true}));
