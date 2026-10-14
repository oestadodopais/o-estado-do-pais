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
  if(c.id.startsWith('oe-2027-saude-')) {
    const medida=lang==='pt'?(c.id.includes('-total-')?'despesa total consolidada':'despesa efetiva consolidada'):(c.id.includes('-total-')?'consolidated total expenditure':'consolidated effective expenditure');
    const sem=c.id.includes('-sem-prr-')?(lang==='pt'?' sem PRR':' excluding the RRP'):'';
    const variacao=c.id.endsWith('-variacao'),ano=c.reference_date;
    const fim=variacao?(lang==='pt'?', variação publicada entre a estimativa de 2026 e o orçamento para 2027':', published change between the estimate for 2026 and the budget for 2027'):(lang==='pt'?(ano==='2026'?', estimativa de 2026':', orçamento para 2027'):(ano==='2026'?', 2026 estimate':', budget for 2027'));
    const esperado=(lang==='pt'?'Saúde, ':'Health, ')+medida+sem+fim;
    if(cabeca!==esperado)erros.push('V2AD Saúde: cabeçalho com medida, programa ou período diferente');
    if(!frase.includes(lang==='pt'?'O quadro escreve «Conta do Pograma Legado»':'The spelling «Pograma» is the table’s own'))erros.push('V2AD grafia: falta a nota sobre o nome do programa');
    const periodos=tree.querySelectorAll('h1 [data-nonledger="data-da-linha"]');
    if(periodos.length!==(variacao?2:1)||periodos.some(x=>x.getAttribute('data-de-campo')!=='reference_date'))erros.push('V2AD período: ano sem token da linha');
    if(!variacao && (!frase.includes(anos[ano])||!frase.includes('Conta do Pograma Legado')))erros.push('V2AC Saúde: falta o ano, a coluna ou a grafia do programa');
    if(!variacao && !frase.includes(lang==='pt'?'a efetiva exclui essas operações':'effective expenditure excludes those transactions'))erros.push('V2AC Saúde: falta a distinção entre total e efetiva');
    if(!c.document.locator.includes('nota ao quadro 4.38') || c.excerpt.includes('A despesa total efetiva exclui') || (!variacao && !texto('[data-def-origem="v2a-total-efetiva"]').includes('nota ao quadro 4.38')))erros.push('V2AD apoio: definição confundida com o excerto da Saúde');
  }
  if(c.id.startsWith('oe-2027-saude-') && lang==='pt' && /\bna orçamento\b/.test(frase)) erros.push('V2AC Saúde: preposição incompatível com orçamento');
  if(c.id.includes('-cenario-') && (!frase.split(lang==='pt'?', na Proposta':', in the Draft')[0].includes(anos[c.reference_date]) || !frase.includes(lang==='pt'?'Proposta de Orçamento do Estado para dois mil e vinte e sete':'Draft State Budget for two thousand and twenty-seven'))) erros.push('V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento');
  if(c.id.startsWith('afirmacao-rtp-') && (/alojada|hosted/.test(frase) || !frase.includes(lang==='pt'?'nove de outubro de dois mil e vinte e seis':'nine October two thousand and twenty-six'))) erros.push('V2AC RTP: a frase não identifica a notícia pela data');
  if(c.id==='oe-2027-ppp-total-encargos-liquidos-2027' && !frase.includes(lang==='pt'?'total previsto dos encargos líquidos':'projected total of net public-private partnership charges')) erros.push('V2AC PPP: o total não está definido por uma frase própria');
  if(c.id.startsWith('afirmacao-rtp-') && !frase.includes(lang==='pt'?'identificam a despesa total consolidada do programa Saúde':'identify consolidated total expenditure for the Health programme'))erros.push('V2AD RTP: a notícia perdeu a medida identificada pelos montantes');
  if(c.id.startsWith('oe-2027-ppp-') || c.id.startsWith('afirmacao-rtp-')) {
    const conta=tree.querySelector('[data-v2a-conta]');
    const esperadas=c.id.startsWith('oe-2027-ppp-')?['oe-2027-ppp-rodoviario-encargos-brutos-2027','oe-2027-ppp-rodoviario-receitas-2027','oe-2027-ppp-rodoviario-encargos-liquidos-2027']:['oe-2027-saude-despesa-total-consolidada-2026','oe-2027-saude-despesa-total-consolidada-2027'];
    const citadas=conta?.querySelectorAll('[data-claim]').map(x=>x.getAttribute('data-claim'))??[];
    if(JSON.stringify(citadas)!==JSON.stringify(esperadas))erros.push('V2AD conta: faltam os valores pelas linhas da medida');
    if(c.id.startsWith('oe-2027-ppp-')) {
      const total=c.id.includes('-total-'),brutos=c.id.includes('-brutos-'),receitas=c.id.includes('-receitas-');
      const esperado=lang==='pt'?(total?'Parcerias público-privadas, total dos encargos líquidos, 2027':'Parcerias público-privadas rodoviárias, '+(brutos?'encargos brutos':receitas?'receitas':'encargos líquidos')+', 2027'):(total?'Public-private partnerships, total net charges, 2027':'Road public-private partnerships, '+(brutos?'gross charges':receitas?'revenue':'net charges')+', 2027');
      if(cabeca!==esperado || !/^Setores\s+2026\s+2027\s+2028/.test(c.excerpt))erros.push('V2AD PPP: falta o ano ou o cabeçalho do excerto');
      if(!texto('[data-v2a-conta]').includes(lang==='pt'?'os encargos líquidos rodoviários são os encargos brutos menos as receitas':'net road charges are gross charges minus revenue'))erros.push('V2AD PPP: a conta não diz brutos menos receitas');
    }
  }
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
  ['oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('The spelling «Pograma» is the table’s own.','')),'V2AD grafia: falta a nota sobre o nome do programa'],
  ['oe-2027-saude-despesa-total-consolidada-2027',t=>t.querySelector('[data-def-origem="v2a-total-efetiva"]').remove(),'V2AD apoio: definição confundida com o excerto da Saúde'],
  ['oe-2027-saude-despesa-efetiva-consolidada-2027',t=>t.querySelector('h1').set_content(t.querySelector('h1').textContent.replace('effective','total')),'V2AD Saúde: cabeçalho com medida, programa ou período diferente'],
  ['oe-2027-saude-despesa-total-consolidada-2027',t=>t.querySelector('h1').set_content(t.querySelector('h1').textContent.replace('Health','Education')),'V2AD Saúde: cabeçalho com medida, programa ou período diferente'],
  ['oe-2027-saude-despesa-total-consolidada-2027',t=>t.querySelector('h1 [data-nonledger]').removeAttribute('data-nonledger'),'V2AD período: ano sem token da linha'],
  ['oe-2027-cenario-pib-real-crescimento-2027',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('two thousand and twenty-seven','two thousand and twenty-six')),'V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.aparelho').set_content(t.querySelector('.aparelho').innerHTML.replace('Document title','Source')),'V2AB título: a proveniência não distingue o documento'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.linha-o-que-e-frase').set_content(t.querySelector('.linha-o-que-e-frase').textContent.replace('total expenditure','effective expenditure')),'V2AD RTP: a notícia perdeu a medida identificada pelos montantes'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('[data-v2a-conta] [data-claim]').remove(),'V2AD conta: faltam os valores pelas linhas da medida'],
  ['oe-2027-ppp-rodoviario-receitas-2027',t=>t.querySelector('[data-v2a-conta]').set_content(t.querySelector('[data-v2a-conta]').innerHTML.replace('minus revenue','plus revenue')),'V2AD PPP: a conta não diz brutos menos receitas'],
  ['oe-2027-ppp-rodoviario-receitas-2027',t=>t.querySelector('h1').set_content('Road public-private partnerships, revenue'),'V2AD PPP: falta o ano ou o cabeçalho do excerto'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('h1').set_content('Previsão do CFP'),'V2AB previsão: falta a autoria MF e a transcrição CFP'],
  ['oe-2027-ppp-rodoviario-encargos-brutos-2027',t=>t.querySelector('#ressalva').remove(),'V2AB nota: ressalva não publicada'],
  ['afirmacao-rtp-saude-queda-oe2027-2026-10-09',t=>t.querySelector('.linha-cabeca [data-linha-campo="name"]').set_content('Manchete do ensaio'),'V2AB nome: a cabeça não diz as palavras citadas'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('[data-linha-campo="document.locator_en"]').set_content('Quadro do ensaio'),'V2AB localizador: tradução ou origem ausente'],
  ['oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027',t=>t.querySelector('h1').set_content('Despesa sem prr'),'V2AB sigla: PRR ou RRP perdeu maiúsculas'],
  ['oe-2027-saude-despesa-efetiva-consolidada-2026',t=>t.querySelector('h1').set_content('Consolidated expenditure'),'V2AD Saúde: cabeçalho com medida, programa ou período diferente'],
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
