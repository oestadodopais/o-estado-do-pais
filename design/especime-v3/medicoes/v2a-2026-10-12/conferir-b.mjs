/** V2-a-b: conferir no HTML as medidas, as notas e os localizadores das duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {load} from 'js-yaml';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {routePath} from '../../../../src/lib/routes.mjs';
const base='6922d1a7', pasta='design/especime-v3/medicoes/v2a-2026-10-12';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json','utf8')).rows);
const claims=loadClaims(), resultados=[];
function conferir(c,lang,html) {
  const tree=parse(html), erros=[];
  const texto=seletor=>normal(tree.querySelector(seletor)?.textContent);
  for(const [campo,valor] of [[lang==='en'?'name_source_en':'name_source',c[lang==='en'?'name_source_en':'name_source']],
    [lang==='en'?'document.locator_en':'document.locator',c.document[lang==='en'?'locator_en':'locator']]]) {
    if(texto(`[data-linha-campo="${campo}"]`)!==normal(valor)) erros.push('V2AB localizador: tradução ou origem ausente');
  }
  if(c.ressalva && texto('#ressalva')!==normal(c[lang==='en'?'ressalva_en':'ressalva'])) erros.push('V2AB nota: ressalva não publicada');
  if(c.afirmacao) {
    if(texto('.linha-cabeca [data-linha-campo="name"]')!==normal(c.excerpt)) erros.push('V2AB nome: a cabeça não diz as palavras citadas');
    if(!texto('.aparelho').includes(lang==='en'?'Document title':'Título do documento')) erros.push('V2AB título: a proveniência não distingue o documento');
  }
  if(c.id.includes('-cenario-')) for(const seletor of ['h1','.linha-o-que-e-frase','#codigo-incorporar']) {
    const t=texto(seletor);
    if(!t.includes(lang==='en'?'Ministry of Finance':'Ministério das Finanças') || !t.includes('CFP')) erros.push('V2AB previsão: falta a autoria MF e a transcrição CFP');
  }
  if(c.id.includes('-sem-prr-') && /\b(prr|rrp)\b/.test(texto('h1')+texto('.linha-o-que-e-frase'))) erros.push('V2AB sigla: PRR ou RRP perdeu maiúsculas');
  return erros;
}
for(const id of ids) {
  const c=claims.get(id), anterior=load(execFileSync('git',['show',`${base}:ledger/claims/${id}.yml`],{encoding:'utf8'}));
  assert.deepEqual([c.value,c.unit],[anterior.value,anterior.unit],`V2AB valor: mudou ${id}`);
  for(const lang of ['pt','en']) {
    const rota=routePath('linha',lang,{slug:id}), html=fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8');
    const erros=conferir(c,lang,html);assert.deepEqual(erros,[],`${id} ${lang}`);
    resultados.push({id,lang,rota,valor:c.value,unidade:c.unit,erros});
  }
}
const plantas=[];
for(const [id,altera,mensagem] of [
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('h1').set_content('Previsão do CFP'),'V2AB previsão: falta a autoria MF e a transcrição CFP'],
  ['oe-2027-ppp-rodoviario-encargos-brutos-2027',t=>t.querySelector('#ressalva').remove(),'V2AB nota: ressalva não publicada'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.linha-cabeca [data-linha-campo="name"]').set_content('Manchete do ensaio'),'V2AB nome: a cabeça não diz as palavras citadas'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('[data-linha-campo="document.locator_en"]').set_content('Quadro do ensaio'),'V2AB localizador: tradução ou origem ausente'],
  ['oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027',t=>t.querySelector('h1').set_content('Despesa sem prr'),'V2AB sigla: PRR ou RRP perdeu maiúsculas'],
]) {
  const c=claims.get(id),lang='en',rota=routePath('linha',lang,{slug:id});
  const tree=parse(fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8'));altera(tree);
  assert(conferir(c,lang,tree.toString()).includes(mensagem));plantas.push({id,mensagem});
  console.log(`PLANTA ${mensagem}`);
}
const registo={base,cabeca:JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,linhas:ids.length,paginas:resultados.length,resultados,plantas};
fs.writeFileSync(`${pasta}/inspecao-b.json`,JSON.stringify(registo,null,2)+'\n');
console.log(`V2AB: ${ids.length} valores preservados; ${resultados.length} páginas conferidas; ${plantas.length} plantas.`);
