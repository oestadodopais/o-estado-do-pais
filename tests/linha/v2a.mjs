/** V2-a-b: conferir no HTML as medidas, as notas e os localizadores das duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims,validateLedger} from '../../src/lib/ledger.mjs';
import {routePath} from '../../src/lib/routes.mjs';
const provas=JSON.parse(fs.readFileSync('ledger/provas/v2a/provas.json','utf8')).rows;
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json','utf8')).rows);
const claims=loadClaims(), resultados=[];
export function conferir(c,lang,html) {
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
  if(c.id.includes('-sem-prr-') && /\b(prr|rrp)\b/.test(texto('h1')+' '+texto('.linha-o-que-e-frase'))) erros.push('V2AB sigla: PRR ou RRP perdeu maiúsculas');
  const hash=provas[c.id]?.sha256;
  if(!/^[a-f0-9]{64}$/.test(c.document.source_sha256??'') || c.document.source_sha256!==hash || texto('.aparelho [data-linha-campo="document.source_sha256"]')!==hash) erros.push('V2AC selo: SHA256 do corpo ausente ou diferente');
  const cabeca=texto('h1'),frase=texto('.linha-o-que-e-frase');
  const anos=lang==='pt'?{'2026':'dois mil e vinte e seis','2027':'dois mil e vinte e sete'}:{'2026':'two thousand and twenty-six','2027':'two thousand and twenty-seven'};
  if(c.id.startsWith('oe-2027-saude-') && !c.id.endsWith('-variacao')) {
    const ano=c.reference_date,coluna=lang==='pt'?(ano==='2026'?'estimativa':'orçamento'):(ano==='2026'?'estimate':'budget');
    if(!c.document.locator.includes(ano+', '+(ano==='2026'?'Estimativa':'Orçamento')) || [cabeca,frase].some(x=>!x.toLowerCase().includes(coluna)||!x.includes(anos[ano])||!x.includes('Conta do Pograma Legado'))) erros.push('V2AC Saúde: falta o ano, a coluna ou a grafia do programa');
    if(!frase.includes(lang==='pt'?'a efetiva exclui essas operações':'effective expenditure excludes those transactions')) erros.push('V2AC Saúde: falta a distinção entre total e efetiva');
  }
  if(c.id.startsWith('oe-2027-saude-') && lang==='pt' && /\bna orçamento\b/.test(frase)) erros.push('V2AC Saúde: preposição incompatível com orçamento');
  if(c.id.includes('-cenario-') && (!frase.includes(anos[c.reference_date]) || !frase.includes(lang==='pt'?'Proposta de Orçamento do Estado para dois mil e vinte e sete':'Draft State Budget for two thousand and twenty-seven'))) erros.push('V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento');
  if(c.id.startsWith('afirmacao-rtp-') && (/alojada|hosted/.test(frase) || !frase.includes(lang==='pt'?'nove de outubro de dois mil e vinte e seis':'nine October two thousand and twenty-six'))) erros.push('V2AC RTP: a frase não identifica a notícia pela data');
  if(c.id==='oe-2027-ppp-total-encargos-liquidos-2027' && !frase.includes(lang==='pt'?'total previsto dos encargos líquidos':'projected total of net public-private partnership charges')) erros.push('V2AC PPP: o total não está definido por uma frase própria');
  return erros;
}
for(const id of ids) {
  const c=claims.get(id);
  for(const lang of ['pt','en']) {
    const rota=routePath('linha',lang,{slug:id}),html=fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8');
    const erros=conferir(c,lang,html);assert.deepEqual(erros,[],`${id} ${lang}`);
    resultados.push({id,lang,rota,valor:c.value,unidade:c.unit,erros});
  }
}
const plantas=[];
for(const [id,altera,mensagem,lang='en'] of [
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('h1').set_content('Previsão do CFP'),'V2AB previsão: falta a autoria MF e a transcrição CFP'],
  ['oe-2027-ppp-rodoviario-encargos-brutos-2027',t=>t.querySelector('#ressalva').remove(),'V2AB nota: ressalva não publicada'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.linha-cabeca [data-linha-campo="name"]').set_content('Manchete do ensaio'),'V2AB nome: a cabeça não diz as palavras citadas'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('[data-linha-campo="document.locator_en"]').set_content('Quadro do ensaio'),'V2AB localizador: tradução ou origem ausente'],
  ['oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027',t=>t.querySelector('h1').set_content('Despesa sem prr'),'V2AB sigla: PRR ou RRP perdeu maiúsculas'],
  ['oe-2027-saude-despesa-efetiva-consolidada-2026',t=>t.querySelector('h1').set_content('Consolidated expenditure'),'V2AC Saúde: falta o ano, a coluna ou a grafia do programa'],
  ['oe-2027-saude-despesa-efetiva-consolidada-2027',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replaceAll('two thousand and twenty-seven','two thousand and twenty-six')),'V2AC Saúde: falta o ano, a coluna ou a grafia do programa'],
  ['oe-2027-saude-despesa-total-consolidada-2027',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('effective expenditure excludes those transactions','definition removed')),'V2AC Saúde: falta a distinção entre total e efetiva'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('two thousand and twenty-six','two thousand and twenty-seven')),'V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.linha-o-que-e-frase').set_content('The hosted article reports a decrease.'),'V2AC RTP: a frase não identifica a notícia pela data'],
  ['oe-2027-ppp-total-encargos-liquidos-2027',t=>t.querySelector('.linha-o-que-e-frase').set_content('It is the value in the table.'),'V2AC PPP: o total não está definido por uma frase própria'],
  ['oe-2027-saude-despesa-efetiva-consolidada-2027',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('no orçamento','na orçamento')),'V2AC Saúde: preposição incompatível com orçamento','pt'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('[data-linha-campo="document.source_sha256"]').set_content('a'.repeat(64)),'V2AC selo: SHA256 do corpo ausente ou diferente'],
]) {
  const c=claims.get(id),rota=routePath('linha',lang,{slug:id});
  const tree=parse(fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8'));altera(tree);
  assert(conferir(c,lang,tree.toString()).includes(mensagem));plantas.push({id,mensagem});
  console.log(`PLANTA ${mensagem}`);
}
export const resultado={cabeca:JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,linhas:ids.length,paginas:resultados.length,resultados,plantas};
console.log(`V2AB/V2AC: ${resultados.length} páginas conferidas; ${plantas.length} plantas.`);
const sealed=loadClaims({includeWithdrawn:true}).get(ids[0]),saved=sealed.document.source_sha256;
try {
  sealed.document.source_sha256='resumo incompleto';
  const message=validateLedger().errors.find(x=>x.includes('document.source_sha256 precisa de um SHA256 completo'));
  assert(message);console.log('PLANTA V2AC selo no livro: '+message);
} finally {sealed.document.source_sha256=saved;}
