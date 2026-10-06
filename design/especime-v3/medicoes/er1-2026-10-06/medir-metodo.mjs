/* A amarra do texto governado, medida e reposta byte a byte. A proposta fica
   para o lugar que regista decisões, sem alterar uma decisão anterior. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { limpar, escrever } from './medir.mjs';
const ficheiro='src/data/metodo.mjs';
const antes=fs.readFileSync(ficheiro);
const resumo=b=>createHash('sha256').update(b).digest('hex');
const proposta={
  pt:'Cada número pode ser incorporado com a sua fonte e o seu recibo, sob a licença Creative Commons de atribuição indicada junto dos dados.',
  en:'Each number can be embedded with its source and receipt, under the Creative Commons attribution licence stated alongside the data.',
};
let r;
try {
  fs.writeFileSync(ficheiro,antes.toString()+`\nexport const INCORPORACAO = ${JSON.stringify(proposta,null,2)};\n`);
  r=spawnSync('npm',['run','ledger:check'],{encoding:'utf8',maxBuffer:32*1024*1024});
  fs.writeFileSync(new URL('./metodo-amarra.log',import.meta.url),limpar(r.stdout+r.stderr));
} finally {fs.writeFileSync(ficheiro,antes);}
const linhas=limpar(r.stdout+r.stderr).split('\n').filter(l=>/metodo|Método|resumo/.test(l));
escrever('metodo-proposta',{
  comando:'node design/especime-v3/medicoes/er1-2026-10-06/medir-metodo.mjs',
  proposta,codigo:r.status,mensagens:linhas,antes:resumo(antes),reposto:resumo(fs.readFileSync(ficheiro)),
  aplicado:false,
});
if(r.status!==1 || resumo(antes)!==resumo(fs.readFileSync(ficheiro)))throw Error('A amarra ou a reposição não confirmou a medida.');
console.log(linhas.join('\n'));
