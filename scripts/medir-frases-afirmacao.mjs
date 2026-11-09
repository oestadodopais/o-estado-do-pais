/** Medição reproduzível, separada da classificação humana da amostra. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadClaims} from '../src/lib/ledger.mjs';
import {lerPaginas, inventarioDireto, medirPares, MARCAS, sha256, rotasFora, cortar, normalDaChave} from './frases-com-afirmacao.mjs';
import {semear, medidas} from './gerar-frases-afirmacao.mjs';
const paginas=lerPaginas(process.argv[2] ?? 'dist');
const r=semear(paginas,loadClaims()), m=medidas(paginas,r);
const marcasAntes=JSON.parse(execFileSync('git',['show','155fd74a5:scripts/frases-marcas.json'],{encoding:'utf8'})).map(m=>({...m,re:new RegExp(m.expressao,m.flags)}));
const detetorAntes=(t,l)=>['atribuicao','causa','leitura'].filter(tipo=>marcasAntes.some(m=>m.lingua===l&&m.tipo===tipo&&m.re.test(t)));
m.pares=medirPares(paginas,detetorAntes);
m.pares_base='155fd74a5';
m.pares_criterio='Mesmas unidades diretamente detetadas agora e mesmos pares; marcas da base contra marcas atuais, antes da extensão da cobertura pelo par.';
m.detecao_direta=Object.fromEntries(['pt','en'].map(l=>[l,inventarioDireto(paginas).filter(f=>f.lingua===l).length]));
m.total_marcas=MARCAS.length;
m.plantas_marcas=JSON.parse(fs.readFileSync('tests/leituras/frases-marcas-plantas.json','utf8')).length;
m.todas_por_julgar=r.registo.every(f=>f.juizo==='por julgar');
m.juizos=Object.fromEntries([...new Set(r.registo.map(f=>f.juizo))].map(j=>[j,r.registo.filter(f=>f.juizo===j).length]));
m.colecoes={};
for(const f of r.frases) {
  const tipos=[...new Set(f.ocorrencias.map(o=>paginas.find(p=>p.rota===o.pagina).tipo))];
  for(const tipo of tipos){const c=m.colecoes[tipo]??={pt:0,en:0,ocorrencias:{pt:0,en:0}};c[f.lingua]++;c.ocorrencias[f.lingua]+=f.ocorrencias.filter(o=>paginas.find(p=>p.rota===o.pagina).tipo===tipo).length;}
}
m.rotas=paginas.map(({rota,tipo})=>({rota,tipo}));
m.familias_fora=rotasFora();
m.registo_por_rota={};for(const f of r.registo)for(const l of ['pt','en'])m.registo_por_rota[f.locais[l]]=(m.registo_por_rota[f.locais[l]]??0)+1;
const sementesAnteriores=JSON.parse(execFileSync('git',['show','f1b98c701:ledger/frases/pagina-o-que-se-discute.json'],{encoding:'utf8'}));
m.corte_semente=sementesAnteriores.filter(f=>!r.registo.some(g=>g.pt===f.pt&&g.en===f.en)).map(f=>({id_anterior:f.id,partes:['pt','en'].flatMap(lingua=>cortar(f[lingua]).map(frase=>({lingua,sha256:sha256(normalDaChave(frase)),registada:r.registo.some(g=>g[lingua]===frase),pendente:r.pendentes.some(g=>g.estudo===f.estudo&&g.lingua===lingua&&g.sha256===sha256(normalDaChave(frase)))})))}));
m.amostra_semente='CAM2-A-2026-11-09';
m.amostra=['pt','en'].flatMap(l=>r.frases.filter(f=>f.lingua===l).sort((a,b)=>sha256(m.amostra_semente+'|'+a.estudo+'|'+a.frase).localeCompare(sha256(m.amostra_semente+'|'+b.estudo+'|'+b.frase))).slice(0,30).map((f,i)=>({id:l+'-'+(i+1),lingua:l,estudo:f.estudo,frase:f.frase})));
fs.writeFileSync(process.argv[3] ?? '/tmp/medidas-frases-afirmacao.json',JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify({frases:m.frases,pt:m.pt,en:m.en,registo:m.registo,por_registar:m.por_registar,pares:Object.fromEntries(Object.entries(m.pares).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).filter(([a])=>a!=='falhas'))])),registo_por_rota:m.registo_por_rota}));
