import {leituraDaSemana} from '../../src/lib/leitura-da-semana.mjs';
import {textoForaDoResumo} from '../indice/indice.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
/** EO1-e: a mesma planta, um valor livre, contra as três conferências. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {errosDaDefinicaoEo1} from '../../src/lib/definicoes-eo1.mjs';
import {temAlgarismoLivre} from '../../src/lib/algarismos-definicoes.mjs';
import {errosDasFamilias} from '../../src/lib/o-que-e-o-numero.mjs';
import {NOMES_EO1} from '../../src/data/nomes-eo1.mjs';
import {FAMILIAS_DAS_LINHAS} from '../../src/data/o-que-e-das-familias.mjs';
import {conferirAuditoriaDasFamilias} from '../cartao/familias.mjs';
const id='der-csi-referencia-2026';
for(const s of ['1900','2099','escalão 1','bracket 9'])assert(!temAlgarismoLivre(s),s);
for(const s of ['1899','2100','820 euros','2026 euros','escalão 10','bracket 1.5','12026','3.2'])assert(temAlgarismoLivre(s),s);
const foreign=structuredClone(FAMILIAS_DAS_LINHAS);foreign[id].frase.pt=[{claim:id}];
assert(errosDasFamilias(foreign).some(e=>e.includes(id)&&e.includes('não é texto')),'passeio aceita peça fora dos tipos');
for(const html of ['<p>820 euros</p>','<p><span data-eo1-origem="nome" data-de-linha="der-csi-referencia-2026">820 euros</span></p>'])assert(errosDaDefinicaoEo1(parse(html).firstChild,id,'pt').length);
const numbered=Object.entries(NOMES_EO1).filter(([key,n])=>/^\d+\. |\(1\+2\)|\(1\. /.test(n.pt));
assert.equal(numbered.length,7);
for(const [key,n] of numbered)for(const lang of ['pt','en'])assert(FAMILIAS_DAS_LINHAS[key].frase[lang].join('').includes('«'+n[lang]+'»'),key+': nome truncado');
const entrega=loadClaims().get('oe-2027-calendario-entrega');
assert(textoForaDoResumo(entrega),'índice inclui uma data válida como quantidade');
assert(!textoForaDoResumo({...entrega,value:'820 euros'}),'índice dispensa uma quantidade disfarçada de data');
const weekly=leituraDaSemana({fim:'2026-10-21',linhas:[loadClaims().get('oe-2027-calendario-entrega')]});
assert.equal(weekly.mudancas.length,0,'data contada como movimento numérico');
assert.equal(weekly.formas.length,0,'data contada como reformatação numérica');
const mode=process.argv[2];
if(mode==='compositor'||mode==='compositor-complemento'){
 const {FAMILIAS_EO1}=await import('../../design/especime-v3/medicoes/eo1-2026-10-20/familias.mjs');
 const f=FAMILIAS_EO1.find(f=>f.chaves.includes(id));
 if(mode==='compositor')f.partes[0].pt+=' 820 euros';else f.complemento.pt.push(' 820 euros');
 await import('../../scripts/compor-familias-eo1.mjs');
 throw new Error('Planta aceite pelo compositor');
}else if(mode==='cartao'){
 const familias=structuredClone(FAMILIAS_DAS_LINHAS);familias[id].frase.pt[0]+=' 820 euros';
 assert(errosDasFamilias(familias).some(e=>e.includes(id)&&e.includes('algarismo')),'passeio das famílias não recusou');
 const erros=conferirAuditoriaDasFamilias({familias}).erros;
 const found=erros.filter(e=>e.includes(id)&&e.includes('algarismo'));
 console.log(found.join('\n'));process.exit(found.length?1:0);
}else if(mode==='html'){
 const file=`dist/livro-razao/${id}/index.html`,before=fs.readFileSync(file),hash=b=>createHash('sha256').update(b).digest('hex');
 const text=before.toString().replace(/(<p[^>]+data-eo1-definicao[^>]*>)/,'$1 820 euros ');
 assert.notEqual(text,before.toString());
 const log=process.argv[3];assert(log,'indicar registo');
 let r;
 try{
  fs.writeFileSync(file,text);const fd=fs.openSync(log,'w');
  try{r=spawnSync(process.execPath,['scripts/gate-html.mjs'],{stdio:['ignore',fd,fd]});}finally{fs.closeSync(fd);}
  assert.equal(r.status,1,'código da planta HTML');
  assert(/algarismo livre na definição:.*820 euros/.test(fs.readFileSync(log,'utf8')),'falha esperada ausente');
 }finally{fs.writeFileSync(file,before);assert.equal(hash(fs.readFileSync(file)),hash(before));}
 console.log('EO1-e HTML: 820 euros recusado; bytes repostos, sha256 '+hash(before));process.exit(r.status);
}else{
 assert.deepEqual(errosDasFamilias(),[]);
 const errors=conferirAuditoriaDasFamilias().erros;assert.deepEqual(errors,[]);
 console.log('EO1-e definições: controlo sem planta, anos e escalões válidos, restantes algarismos livres recusados.');
}
