/** EX2: a entrega lê-se dos ficheiros construídos e das conferências, nunca de contas copiadas à mão. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const le=f=>JSON.parse(fs.readFileSync(path.join(pasta,f),'utf8'));
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const sha=b=>createHash('sha256').update(b).digest('hex');
const cabeca=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
const paginas=[['pt','leituraDaSemana','explicacoes/leitura-da-semana/index.html'],['en','leituraDaSemana','en/explainers/weekly-reading/index.html'],['pt','indice','indice/index.html'],['en','indice','en/index/index.html']].map(([lang,rota,f])=>{
 const bytes=fs.readFileSync(path.join('dist',f)),r=parse(bytes.toString());
 const selector=rota==='indice'?'[data-mudou-ambito="indice"] > li':'[data-semana-mudancas] > li';
 const mudancas=r.querySelectorAll(selector).map(e=>{
  const frase=e.querySelector('[data-o-que-e]'),ausencia=e.querySelector('[data-o-que-e-por-confirmar]');
  return {linha:e.getAttribute('data-correcao-entrada'),resumo:normal(e.querySelector('[data-semana-resumo], .lugar-mudou-o-que')?.textContent),antes:normal(e.querySelector('[data-correcao-campo="old_value"]')?.textContent),depois:normal(e.querySelector('[data-correcao-campo="new_value"]')?.textContent),frase:normal(frase?.textContent),ausencia:normal(ausencia?.textContent),portas_na_frase:frase?.querySelectorAll('a').length??0};
 });
 return {lang,rota,ficheiro:`dist/${f}`,sha256:sha(bytes),mudancas,frases:mudancas.filter(m=>m.frase).length,ausencias:mudancas.filter(m=>m.ausencia).length};
});
const portoes=Object.fromEntries(['build','verify','typecheck'].map(g=>[g,Number(fs.readFileSync(path.join(pasta,'portoes',`${g}.codigo`),'utf8').trim())]));
const cabecaPortoes=fs.readFileSync(path.join(pasta,'portoes','cabeca'),'utf8').trim();
const cabecaFim=fs.readFileSync(path.join(pasta,'portoes','cabeca.fim'),'utf8').trim();
if(versao.commit!==cabecaPortoes||cabecaFim!==cabecaPortoes)throw Error('a construção e os portões não têm a mesma cabeça');
const base=le('base.json'),unidades=le('unidades.json'),semana=le('semana.json'),fc=le('frases-compostas.json'),capturas=le('capturas.json');
if(fc.construcao!==versao.commit||semana.construcao!==versao.commit||capturas.cabeca!==versao.commit)throw Error('a régua visual e as capturas não são da cabeça do código');
const protegidos=['ledger','src/lib','src/data','src/views/LinhaView.astro','scripts/check-lugar.mjs'];
const diffProtegido=execFileSync('git',['diff','--name-only',base.cabeca,'--',...protegidos],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const out={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/medir-entrega.mjs',cabeca_lida:cabeca,cabeca_codigo:versao.commit,base:base.cabeca,janela:semana.janela,portoes,cabeca_portoes:cabecaPortoes,cabeca_fim:cabecaFim,paginas,unidades:unidades.resumo,escolha:unidades.escolha,por_confirmar_na_semana:paginas.find(p=>p.lang==='pt'&&p.rota==='leituraDaSemana').ausencias,fc:{paginas:new Set(fc.resultados.map(r=>r.rota)).size,passagens:fc.resultados.length,plantas:fc.plantas.length,erros:fc.erros},capturas:{quantidade:capturas.capturas.length,erros:capturas.erros},caminhos_protegidos:protegidos,ficheiros_protegidos_alterados:diffProtegido,commits:execFileSync('git',['log','--reverse','--format=%H %s',`${base.cabeca}..HEAD`],{encoding:'utf8'}).trim().split('\n').filter(Boolean)};
fs.writeFileSync(path.join(pasta,'entrega.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({cabeca_codigo:out.cabeca_codigo,portoes,por_confirmar:out.por_confirmar_na_semana,capturas:out.capturas,fc:out.fc}));
