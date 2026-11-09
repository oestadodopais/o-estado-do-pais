/** Medição reproduzível, separada da classificação humana da amostra. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadClaims} from '../src/lib/ledger.mjs';
import {lerPaginas, inventario, sha256, rotasFora, parDaFrase, tiposDaFrase, tiposComContexto, cortar, normal} from './frases-com-afirmacao.mjs';
import {semear, medidas} from './gerar-frases-afirmacao.mjs';
const paginas=lerPaginas(process.argv[2] ?? 'dist');
const r=semear(paginas,loadClaims()), m=medidas(paginas,r);
const anteriores=inventario(paginas,true);
// Compara as marcas anteriores à adenda C sobre o mesmo âmbito e corte atuais.
const anterior=execFileSync('git',['show','f1b98c701:scripts/frases-com-afirmacao.mjs'],{encoding:'utf8'});
const fonte=anterior.slice(anterior.indexOf('const palavra'),anterior.indexOf('export const cortar')).replaceAll('export ','');
const tiposAnteriores=new Function(fonte+'; return tiposDaFrase;')();
m.pares_antes_adenda_c={};
for(const lingua of ['pt','en']) {
  const destino=lingua==='pt'?'en':'pt';
  const a=m.pares_antes_adenda_c[lingua+'_para_'+destino]={pares:0,sem_par:0,falhas_antes:0,falhas_depois:0};
  for(const f of r.frases.filter(f=>f.lingua===lingua)) {
    const par=f.ocorrencias.map(o=>parDaFrase(paginas,o)).find(Boolean);
    if(!par){a.sem_par++;continue;}
    a.pares++;if(!tiposAnteriores(par.frase,destino).length)a.falhas_antes++;
    if(!tiposComContexto(par.frase,par.contexto,destino).length)a.falhas_depois++;
  }
}
m.marcas_inglesas_antes=anteriores.filter(f=>f.lingua==='en').length;
m.colecoes={};
for(const f of r.frases) {
  const tipos=[...new Set(f.ocorrencias.map(o=>paginas.find(p=>p.rota===o.pagina).tipo))];
  for(const tipo of tipos){const c=m.colecoes[tipo]??={pt:0,en:0,ocorrencias:{pt:0,en:0}};c[f.lingua]++;c.ocorrencias[f.lingua]+=f.ocorrencias.filter(o=>paginas.find(p=>p.rota===o.pagina).tipo===tipo).length;}
}
m.rotas=paginas.map(({rota,tipo})=>({rota,tipo}));
m.familias_fora=rotasFora();
m.registo_por_rota={};for(const f of r.registo)for(const l of ['pt','en'])m.registo_por_rota[f.locais[l]]=(m.registo_por_rota[f.locais[l]]??0)+1;
const sementesAnteriores=JSON.parse(execFileSync('git',['show','f1b98c701:ledger/frases/pagina-o-que-se-discute.json'],{encoding:'utf8'}));
m.corte_semente=sementesAnteriores.filter(f=>!r.registo.some(g=>g.pt===f.pt&&g.en===f.en)).map(f=>({id_anterior:f.id,partes:['pt','en'].flatMap(lingua=>cortar(f[lingua]).map(frase=>({lingua,sha256:sha256(normal(frase)),registada:r.registo.some(g=>g[lingua]===frase),pendente:r.pendentes.some(g=>g.estudo===f.estudo&&g.lingua===lingua&&g.sha256===sha256(normal(frase)))})))}));
m.amostra_semente='CAM2-A-2026-11-09';
m.amostra=['pt','en'].flatMap(l=>r.frases.filter(f=>f.lingua===l).sort((a,b)=>sha256(m.amostra_semente+'|'+a.estudo+'|'+a.frase).localeCompare(sha256(m.amostra_semente+'|'+b.estudo+'|'+b.frase))).slice(0,30).map((f,i)=>({id:l+'-'+(i+1),lingua:l,estudo:f.estudo,frase:f.frase})));
fs.writeFileSync(process.argv[3] ?? '/tmp/medidas-frases-afirmacao.json',JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({frases:m.frases,pt:m.pt,en:m.en,registo:m.registo,por_registar:m.por_registar,pares:Object.fromEntries(Object.entries(m.pares).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).filter(([a])=>a!=='falhas'))])),registo_por_rota:m.registo_por_rota}));
