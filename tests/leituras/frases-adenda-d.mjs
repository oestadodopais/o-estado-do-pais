import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {tiposDaFrase, marcasDaFrase, MARCAS, inventario, inventarioDireto, blocosDaPagina, medirPares} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirCobertura} from '../../scripts/check-frases-afirmacao.mjs';
import {semear} from '../../scripts/gerar-frases-afirmacao.mjs';
import {conferirPino} from '../../scripts/frases-pino.mjs';
const negativos=JSON.parse(fs.readFileSync('tests/leituras/frases-negativos-adenda-d.json','utf8'));
for(const c of negativos) {
  const ids=marcasDaFrase(c.frase,'pt');
  if(c.marca) assert(!ids.includes(c.marca),c.frase);
  else assert.deepEqual(tiposDaFrase(c.frase,'pt'),[],c.frase);
}
for(const frase of ['A UTAO diz que há risco.','O ministro refere a mudança.','O ministro se refere à mudança.','A UTAO alerta para o risco.','O ministro alerta para o risco.']) assert(tiposDaFrase(frase,'pt').includes('atribuicao'),frase);
const paginas=['pt','en'].map(lingua=>({estudo:'planta',rota:'/'+lingua,par:lingua==='pt'?'/en':'/pt',lingua,blocos:blocosDaPagina(`<main><p>${lingua==='pt'?'Texto simples. A fonte diz algo.':'The source says something. Plain text.'}</p></main>`)}));
const direto=inventarioDireto(paginas), cobertas=inventario(paginas);
assert.equal(direto.length,2);assert.equal(cobertas.length,4);
for(const l of ['pt','en']) {const herdada=cobertas.filter(f=>f.lingua===l&&f.pelo_par);assert.equal(herdada.length,1);assert.deepEqual(herdada[0].tipos,['atribuicao']);}
const semeada=semear(paginas,new Map());
assert.deepEqual(conferirCobertura(cobertas,new Set(),semeada.pendentes),[]);
assert(conferirCobertura(cobertas,new Set(),semeada.pendentes.slice(1)).length);
const pares=medirPares(paginas,()=>['atribuicao']);
for(const l of ['pt_para_en','en_para_pt']) {assert.equal(pares[l].falhas_antes,0);assert.equal(pares[l].falhas_depois,1);assert.equal(pares[l].sem_cobertura,0);}
const sha=t=>createHash('sha256').update(t).digest('hex');
const pino=(texto,razao)=>JSON.stringify({sha256:sha(texto),data:'2026-11-09',razao})+'\n';
const a={marcas:'a\n',pino:pino('a\n','Razão inicial para a planta do histórico.')};
const c={marcas:'b\n',pino:pino('b\n','Razão nova para a alteração das marcas.')};
function historia(reparacaoTardia) {
  const estados={a,b:reparacaoTardia?{marcas:c.marcas,pino:a.pino}:c,c};
  return (...args)=>{
    if(args[0]==='rev-list'&&args[1]==='--full-history')return 'c\nb\na';
    if(args[0]==='rev-list'&&args[1]==='--parents')return ({a:'a base',b:'b a',c:'c b'})[args[4]];
    if(args[0]==='ls-tree')return estados[args[2]==='HEAD'?'c':args[2]]?args.at(-1):'';
    if(args[0]==='show') {const [rev,f]=args[1].split(':');return estados[rev===''||rev==='HEAD'?'c':rev][f.endsWith('-pino.json')?'pino':'marcas'].trimEnd();}
    throw new Error('comando inesperado '+args.join(' '));
  };
}
assert.deepEqual(conferirPino({indice:true,gitRun:historia(false)}),[]);
const recusas=conferirPino({indice:true,gitRun:historia(true)});
assert(recusas.some(e=>e.startsWith('b: marcas: pino')),JSON.stringify(recusas));
assert(recusas.some(e=>e.startsWith('b: marcas: mudança sem pino')),JSON.stringify(recusas));
console.log('adenda D: negativos, atribuições preservadas, cobertura pelo par nos dois sentidos e reparação histórica tardia conferidos');
