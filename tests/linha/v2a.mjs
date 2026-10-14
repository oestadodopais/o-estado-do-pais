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
    if(!frase.includes(lang==='pt'?'«Conta do Pograma Legado», como o quadro o escreve':'«Conta do Pograma Legado», as written in the table')||(frase.match(/Conta do Pograma Legado/g)??[]).length!==1)erros.push('V2AD grafia: falta a nota sobre o nome do programa');
    const periodos=tree.querySelectorAll('h1 [data-nonledger="data-da-linha"]');
    if(periodos.length!==(variacao?2:1)||periodos.some(x=>x.getAttribute('data-de-campo')!=='reference_date'))erros.push('V2AD período: ano sem token da linha');
    if(!frase.includes(ano)||!frase.includes('Conta do Pograma Legado'))erros.push('V2AC Saúde: falta o ano, a coluna ou a grafia do programa');
    const medidaNaFrase=medida+(c.id.includes('-sem-prr-')?(lang==='pt'?' sem PRR':' excluding the Recovery and Resilience Plan (PRR)'):'');
    const inicio=lang==='pt'?(variacao?'É a variação publicada da ':'É a '):(variacao?'It is the published change in ':'It is ');
    if(!frase.startsWith(inicio+medidaNaFrase+' '))erros.push('V2AE Saúde: medida diferente na frase');
    const token=tree.querySelector('[data-o-que-e] [data-nonledger="data-da-linha"]');
    if(!token||token.getAttribute('data-de-campo')!=='reference_date'||token.getAttribute('data-de-linha')!==(variacao?c.id.replace('variacao','2026'):c.id))erros.push('V2AE frase: período sem token da linha');
    if(c.id.includes('-sem-prr-')||c.id==='oe-2027-saude-despesa-efetiva-consolidada-variacao') {
      if(!frase.includes(lang==='pt'?'Plano de Recuperação e Resiliência':'Recovery and Resilience Plan (PRR)')||!frase.includes(lang==='pt'?'a sua redução explica a descida com PRR e a subida sem ele':'its reduction explains the fall with PRR and the rise without it')||!tree.querySelector('[data-def-origem="v2a-prr-saude"]')||!tree.querySelector('[data-def-origem="v2a-prr-ciclo"]'))erros.push('V2AE PRR: falta o nome, a explicação ou o apoio');
      const citadas=tree.querySelectorAll('[data-o-que-e] [data-claim]').map(x=>x.getAttribute('data-claim'));
      if(JSON.stringify(citadas)!==JSON.stringify(['2026','2027','sem-prr-2026','sem-prr-2027'].map(x=>'oe-2027-saude-despesa-efetiva-consolidada-'+x)))erros.push('V2AE PRR: comparação sem os quatro tokens');
    }
    if(!variacao && !frase.includes(lang==='pt'?'a efetiva exclui essas operações':'effective expenditure excludes those transactions'))erros.push('V2AC Saúde: falta a distinção entre total e efetiva');
    if(!c.document.locator.includes('nota ao quadro 4.38') || c.excerpt.includes('A despesa total efetiva exclui') || (!variacao && !texto('[data-def-origem="v2a-total-efetiva"]').includes('nota ao quadro 4.38')))erros.push('V2AD apoio: definição confundida com o excerto da Saúde');
  }
  if(c.id.startsWith('oe-2027-saude-') && lang==='pt' && /\bna orçamento\b/.test(frase)) erros.push('V2AC Saúde: preposição incompatível com orçamento');
  if(c.id.includes('-cenario-') && (!frase.split(lang==='pt'?', na Proposta':', in the Draft')[0].includes(anos[c.reference_date]) || !frase.includes(lang==='pt'?'Proposta de Orçamento do Estado para dois mil e vinte e sete':'Draft State Budget for two thousand and twenty-seven'))) erros.push('V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento');
  if(c.id.startsWith('afirmacao-rtp-') && (/alojada|hosted/.test(frase) || !frase.includes('09.10.2026'))) erros.push('V2AC RTP: a frase não identifica a notícia pela data');
  if(c.id==='oe-2027-ppp-total-encargos-liquidos-2027' && !frase.includes(lang==='pt'?'total previsto dos encargos líquidos':'projected total of net public-private partnership charges')) erros.push('V2AC PPP: o total não está definido por uma frase própria');
  if(c.id.startsWith('afirmacao-rtp-') && !frase.includes(lang==='pt'?'identificam a despesa total consolidada do programa Saúde':'identify consolidated total expenditure for the Health programme'))erros.push('V2AD RTP: a notícia perdeu a medida identificada pelos montantes');
  if(c.id.startsWith('oe-2027-ppp-rodoviario-') || c.id.startsWith('afirmacao-rtp-')) {
    const conta=tree.querySelector('[data-v2a-conta]');
    const esperadas=c.id.startsWith('oe-2027-ppp-')?['oe-2027-ppp-rodoviario-encargos-brutos-2027','oe-2027-ppp-rodoviario-receitas-2027','oe-2027-ppp-rodoviario-encargos-liquidos-2027']:['oe-2027-saude-despesa-total-consolidada-2026','oe-2027-saude-despesa-total-consolidada-2027'];
    const citadas=conta?.querySelectorAll('[data-claim]').map(x=>x.getAttribute('data-claim'))??[];
    if(JSON.stringify(citadas)!==JSON.stringify(esperadas))erros.push('V2AD conta: faltam os valores pelas linhas da medida');
    if(c.id.startsWith('afirmacao-rtp-')) {
      const t=texto('[data-v2a-conta]');
      if(!t.includes(lang==='pt'?'subtraindo o orçamento à estimativa':'subtracting the budget from the estimate'))erros.push('V2AE RTP: subtração diferente');
      for(const x of conta?.querySelectorAll('[data-claim]')??[])if(normal(x.textContent)!==normal(claims.get(x.getAttribute('data-claim')).value))erros.push('V2AE RTP: montante diferente da linha');
    }
    if(c.id.startsWith('oe-2027-ppp-')) {
      const total=c.id.includes('-total-'),brutos=c.id.includes('-brutos-'),receitas=c.id.includes('-receitas-');
      const esperado=lang==='pt'?(total?'Parcerias público-privadas, total dos encargos líquidos, 2027':'Parcerias público-privadas rodoviárias, '+(brutos?'encargos brutos':receitas?'receitas':'encargos líquidos')+', 2027'):(total?'Public-private partnerships, total net charges, 2027':'Road public-private partnerships, '+(brutos?'gross charges':receitas?'revenue':'net charges')+', 2027');
      if(cabeca!==esperado || !/^Setores\s+2026\s+2027\s+2028/.test(c.excerpt))erros.push('V2AD PPP: falta o ano ou o cabeçalho do excerto');
      if(!texto('[data-v2a-conta]').includes(lang==='pt'?'os encargos líquidos rodoviários são os encargos brutos menos as receitas':'net road charges are gross charges minus revenue'))erros.push('V2AD PPP: a conta não diz brutos menos receitas');
    }
  }
  if(c.id.startsWith('oe-2027-ppp-')) {
    const total=c.id.includes('-total-'),brutos=c.id.includes('-brutos-'),receitas=c.id.includes('-receitas-');
    const esperado=lang==='pt'?(total?'Parcerias público-privadas, total dos encargos líquidos, 2027':'Parcerias público-privadas rodoviárias, '+(brutos?'encargos brutos':receitas?'receitas':'encargos líquidos')+', 2027'):(total?'Public-private partnerships, total net charges, 2027':'Road public-private partnerships, '+(brutos?'gross charges':receitas?'revenue':'net charges')+', 2027');
    if(cabeca!==esperado||!/^Setores\s+2026\s+2027\s+2028/.test(c.excerpt))erros.push('V2AD PPP: falta o ano ou o cabeçalho do excerto');
    const tokens=tree.querySelectorAll('h1 [data-nonledger="data-da-linha"]');
    if(tokens.length!==1||tokens[0].getAttribute('data-de-linha')!==c.id||tokens[0].getAttribute('data-de-campo')!=='reference_date'||normal(tokens[0].textContent)!==c.reference_date)erros.push('V2AE PPP: ano sem token do período');
    if(c.id.includes('-total-')&&(tree.querySelector('[data-v2a-conta]')||!['Rodoviário','Ferroviário','Saúde','Aeroportuário','Oceanário'].every(x=>frase.includes('«'+x+'»'))))erros.push('V2AE PPP: total sem setores próprios ou com conta rodoviária');
  }
  if(c.id.startsWith('afirmacao-pcp-')) {
    const quote=tree.querySelector('[data-o-que-e] [data-linha-campo="excerpt"]');
    if(normal(quote?.textContent)!==normal(c.excerpt)||quote?.getAttribute('data-linha-claim')!==c.id||!frase.includes('Paulo Raimundo'))erros.push('V2AE PCP: afirmação sem citação ou atribuição');
    const ids=tree.querySelectorAll('[data-o-que-e] [data-claim]').map(x=>x.getAttribute('data-claim'));
    if(JSON.stringify(ids)!==JSON.stringify(['oe-2027-ppp-rodoviario-encargos-brutos-2027','oe-2027-ppp-rodoviario-encargos-liquidos-2027']))erros.push('V2AE PCP: faltam os dois valores do quadro');
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
const total='oe-2027-saude-despesa-total-consolidada-2027',efetiva='oe-2027-saude-despesa-efetiva-consolidada-2027',variacao='oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao',rtp='afirmacao-rtp-saude-queda-oe2027-2026-10-09',ppp='oe-2027-ppp-rodoviario-receitas-2027',pcp='afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09';
const troca=(t,sel,a,b)=>{const el=t.querySelector(sel);assert(el);const antes=el.innerHTML;let mudou=false;el.set_content(antes.split(/(<[^>]*>)/g).map(x=>{if(!mudou&&!x.startsWith('<')&&x.includes(a)){mudou=true;return x.replace(a,b);}return x;}).join(''));assert.notEqual(el.innerHTML,antes,'planta sem alteração');};
for(const lang of ['pt','en']) {
 const pt=lang==='pt',frase='.linha-o-que-e-frase';
 for(const [id,altera,mensagem] of [
  [variacao,t=>troca(t,frase,pt?'como o quadro o escreve':'as written in the table','nota retirada'),'V2AD grafia: falta a nota sobre o nome do programa'],
  [total,t=>t.querySelector('[data-def-origem="v2a-total-efetiva"]').remove(),'V2AD apoio: definição confundida com o excerto da Saúde'],
  [efetiva,t=>troca(t,'h1',pt?'efetiva':'effective','total'),'V2AD Saúde: cabeçalho com medida, programa ou período diferente'],
  [efetiva,t=>troca(t,frase,pt?'efetiva':'effective','total'),'V2AE Saúde: medida diferente na frase'],
  [total,t=>troca(t,'h1',pt?'Saúde':'Health','Education'),'V2AD Saúde: cabeçalho com medida, programa ou período diferente'],
  [total,t=>t.querySelector('h1 [data-nonledger]').removeAttribute('data-nonledger'),'V2AD período: ano sem token da linha'],
  [total,t=>t.querySelector('[data-o-que-e] [data-nonledger]').removeAttribute('data-nonledger'),'V2AE frase: período sem token da linha'],
  ['oe-2027-cenario-pib-real-crescimento-2027',t=>troca(t,frase,pt?'dois mil e vinte e sete':'two thousand and twenty-seven',pt?'dois mil e vinte e seis':'two thousand and twenty-six'),'V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento'],
  [rtp,t=>troca(t,'.aparelho',pt?'Título do documento':'Document title','Source'),'V2AB título: a proveniência não distingue o documento'],
  [rtp,t=>troca(t,frase,pt?'despesa total':'total expenditure',pt?'despesa efetiva':'effective expenditure'),'V2AD RTP: a notícia perdeu a medida identificada pelos montantes'],
  [rtp,t=>t.querySelector('[data-v2a-conta] [data-claim]').remove(),'V2AD conta: faltam os valores pelas linhas da medida'],
  [rtp,t=>t.querySelector('[data-v2a-conta] [data-claim]').set_content('999'),'V2AE RTP: montante diferente da linha'],
  [rtp,t=>troca(t,'[data-v2a-conta]',pt?'subtraindo o orçamento à estimativa':'subtracting the budget from the estimate',pt?'somando o orçamento à estimativa':'adding the budget to the estimate'),'V2AE RTP: subtração diferente'],
  [ppp,t=>troca(t,'[data-v2a-conta]',pt?'menos as receitas':'minus revenue',pt?'mais as receitas':'plus revenue'),'V2AD PPP: a conta não diz brutos menos receitas'],
  [ppp,t=>t.querySelector('h1 [data-nonledger]').removeAttribute('data-nonledger'),'V2AE PPP: ano sem token do período'],
  [ppp,t=>t.querySelector('h1').set_content('Parcerias'),'V2AD PPP: falta o ano ou o cabeçalho do excerto'],
  ['oe-2027-cenario-ihpc-2026',t=>t.querySelector('h1').set_content('Previsão do CFP'),'V2AB previsão: falta a autoria MF e a transcrição CFP'],
  [ppp,t=>t.querySelector('#ressalva').remove(),'V2AB nota: ressalva não publicada'],
  [rtp,t=>t.querySelector('.linha-cabeca [data-linha-campo="name"]').set_content('Manchete'),'V2AB nome: a cabeça não diz as palavras citadas'],
  [rtp,t=>t.querySelector('[data-linha-campo="document.locator'+(pt?'':'_en')+'"]').set_content('Quadro'),'V2AB localizador: tradução ou origem ausente'],
  [variacao,t=>t.querySelector('h1').set_content('sem prr'),'V2AB sigla: PRR ou RRP perdeu maiúsculas'],
  [total,t=>troca(t,frase,pt?'a efetiva exclui essas operações':'effective expenditure excludes those transactions','definição retirada'),'V2AC Saúde: falta a distinção entre total e efetiva'],
  [rtp,t=>t.querySelector(frase).set_content('Notícia alojada.'),'V2AC RTP: a frase não identifica a notícia pela data'],
  ['oe-2027-ppp-total-encargos-liquidos-2027',t=>troca(t,frase,'Oceanário','Setor'),'V2AE PPP: total sem setores próprios ou com conta rodoviária'],
  [total,t=>t.querySelector('[data-linha-campo="document.source_sha256"]').set_content('a'.repeat(64)),'V2AC selo: SHA256 do corpo ausente ou diferente'],
  [variacao,t=>t.querySelector('[data-def-origem="v2a-prr-saude"]').remove(),'V2AE PRR: falta o nome, a explicação ou o apoio'],
  [variacao,t=>t.querySelector('[data-o-que-e] [data-claim]').remove(),'V2AE PRR: comparação sem os quatro tokens'],
  [pcp,t=>t.querySelector('[data-o-que-e] [data-linha-campo="excerpt"]').removeAttribute('data-linha-campo'),'V2AE PCP: afirmação sem citação ou atribuição'],
  [pcp,t=>t.querySelector('[data-o-que-e] [data-claim]').remove(),'V2AE PCP: faltam os dois valores do quadro'],
 ]) {
  const c=claims.get(id),rota=routePath('linha',lang,{slug:id}),tree=parse(fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8'));altera(tree);
  assert(conferir(c,lang,tree.toString()).includes(mensagem),lang+' '+mensagem);plantas.push({id,lang,mensagem});console.log(`PLANTA ${lang}: ${mensagem}`);
 }
}
const {conferirCabecaDoRecibo,cabecaDoRecibo,contextoDasFamilias}=await import('../cartao/familias.mjs');
for(const lang of ['pt','en'])for(const [id,selector,attr] of [[total,'[data-o-que-e] [data-nonledger]','data-de-campo'],[variacao,'[data-o-que-e] [data-claim]','data-claim'],[pcp,'[data-o-que-e] [data-linha-campo="excerpt"]','data-linha-campo']]) {
 const rota=routePath('linha',lang,{slug:id}),root=cabecaDoRecibo(fs.readFileSync(`dist${rota.replace(/\/$/,'')}/index.html`,'utf8'));
 const ctx=contextoDasFamilias();assert.deepEqual(conferirCabecaDoRecibo(root,id,lang,{ctx,cartoes:new Map()}),[]);
 root.querySelector(selector).removeAttribute(attr);
 const mensagem=conferirCabecaDoRecibo(root,id,lang,{ctx,cartoes:new Map()}).find(x=>x.includes('o complemento não cita os campos pelos tokens auditados'));
 assert(mensagem);plantas.push({id,lang,mensagem});console.log(`PLANTA ${lang}: ${mensagem}`);
}
export const resultado={cabeca:JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,linhas:ids.length,paginas:resultados.length,resultados,plantas};
console.log(`V2AB/V2AC: ${resultados.length} páginas conferidas; ${plantas.length} plantas.`);
const sealed=loadClaims({includeWithdrawn:true}).get(ids[0]),saved=sealed.document.source_sha256;
try {
  sealed.document.source_sha256='resumo incompleto';
  const message=validateLedger().errors.find(x=>x.includes('document.source_sha256 precisa de um SHA256 completo'));
  assert(message);console.log('PLANTA V2AC selo no livro: '+message);
} finally {sealed.document.source_sha256=saved;}
