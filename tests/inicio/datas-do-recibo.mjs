/** FP1-b: presença dos campos e calendário, sem alterar as réguas de proveniência. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims, paginaSoComEdicao, eDerivada} from '../../src/lib/ledger.mjs';
import {FP1} from '../../src/data/rotulos-fp1.mjs';
// A grafia continua a ser auditada pelo check:formas; aqui mede-se a presença e a origem.
import {dataDaCasa} from '../../src/lib/datas.mjs';
import {proximaLeitura, estudoNovo} from '../../src/lib/construcao.mjs';
import {t} from '../../src/i18n/strings.mjs';
const dist=process.env.OEDP_DIST ?? 'dist';
const versao=JSON.parse(fs.readFileSync(path.join(dist,'version.json'),'utf8'));
const claims=loadClaims();
const presente=v=>v!==null&&v!==undefined&&v!==''&&v!=='[a verificar]';
const proxima=new Date(versao.construido_em.slice(0,10)+'T00:00:00Z');
do {proxima.setUTCDate(proxima.getUTCDate()+1);} while(proxima.getUTCDay()!==1);
const dia=proxima.toISOString().slice(0,10);
const forma=v=>`${v.slice(8,10)}.${v.slice(5,7)}.${v.slice(0,4)}`;
function dataIgualAOrigem(el,valor) { return Boolean(el) && valor!==undefined && valor!==null && el.textContent===valor; }
function conferir(root,c,lang) {
 const erros=[], r=FP1[lang], cabeca=root.querySelector('[data-recibo-datas]');
 if(!cabeca)return ['FP1-b: cabeçalho de datas ausente'];
 const esperadas=[];
 const campo=presente(c.period)?'period':presente(c.reference_date)?'reference_date':null;
 if(campo&&!paginaSoComEdicao(c))esperadas.push({rotulo:r.dados,campo,valor:c[campo]});
 if(presente(c.published_at))esperadas.push({rotulo:paginaSoComEdicao(c)?t(lang).livro.linha.editadoEmK:r.publicados,campo:'published_at',valor:c.published_at});
 if(presente(c.access_date)&&c.access_date_kind!=='hosted-copy')esperadas.push({rotulo:r.lidos,campo:'access_date',valor:c.access_date});
 const ultima=(c.verifications??[]).map((v,n)=>({...v,n})).filter(v=>v.by==='painel-semanal').sort((a,b)=>b.date.localeCompare(a.date)||b.n-a.n)[0];
 if(ultima&&!(presente(c.access_date)&&c.access_date_kind!=='hosted-copy'&&String(c.access_date).slice(0,10)===ultima.date.slice(0,10)))esperadas.push({rotulo:r.ultima,campo:`verifications.${ultima.n}.date`,valor:ultima.date});
 if(ultima&&!eDerivada(c))esperadas.push({rotulo:r.proxima,campo:'calendario.proxima-segunda',valor:dia});
 const linhas=cabeca.querySelectorAll('p');
 if(linhas.length!==esperadas.length)erros.push('FP1-b: presença dos campos diferente da linha');
 for(const [i,e] of esperadas.entries()) {
  const p=linhas[i];if(!p)continue;
  if(p.querySelector('[data-voz]')?.textContent!==e.rotulo)erros.push('FP1-b: ordem ou rótulo das datas');
  const el=p.querySelector('[data-de-campo], [data-linha-campo], [data-data-origem]');
  const origem=el?.getAttribute('data-de-campo')??el?.getAttribute('data-linha-campo')??el?.getAttribute('data-data-origem');
  if(origem!==e.campo)erros.push('FP1-b: origem diferente da linha');
  if(e.campo!=='calendario.proxima-segunda' && (el?.getAttribute('data-de-linha')??el?.getAttribute('data-linha-claim'))!==c.id)erros.push('FP1-b: identidade da linha diferente');
  const valor=e.campo==='calendario.proxima-segunda'?forma(e.valor):dataDaCasa(e.valor,lang);
  if(!dataIgualAOrigem(el,valor))erros.push('FP1-b: data diferente da origem');
  if(e.campo==='calendario.proxima-segunda'&&el?.getAttribute('datetime')!==dia)erros.push('FP1-b: calendário diferente da construção');
 }
 return erros;
}
const amostras={};let paginas=0,semPeriodo=0,comPainel=0,copiasAlojadas=0;
for(const lang of ['pt','en']) {
 const pasta=path.join(dist,lang==='pt'?'livro-razao':'en/ledger');
 for(const d of fs.readdirSync(pasta,{withFileTypes:true})) {
  if(!d.isDirectory())continue;
  const f=path.join(pasta,d.name,'index.html');if(!fs.existsSync(f))continue;
  const c=claims.get(d.name);if(!c)continue;
  const html=fs.readFileSync(f,'utf8'),root=parse(html);
  assert.deepEqual(conferir(root,c,lang),[],`FP1-b ${lang}/${d.name}`);paginas++;
  if(c.access_date_kind==='hosted-copy'){copiasAlojadas++;amostras['alojada-'+lang]??={html,c,lang};}
  if(!presente(c.period)&&!presente(c.reference_date)){semPeriodo++;amostras.ausencia??={html,c,lang};}
  if((c.verifications??[]).some(v=>v.by==='painel-semanal'))comPainel++;
  if(root.querySelector('[data-recibo-datas] [data-de-campo^="verifications."]'))amostras.painel??={html,c,lang};
  if(root.querySelector('[data-recibo-datas] [data-data-origem="calendario.proxima-segunda"]'))amostras.calendario??={html,c,lang};
  if(eDerivada(c))amostras.derivada??={html,c,lang};
  if(!(c.verifications??[]).length)amostras.semReleituras??={html,c,lang};
 }
}
const plantas=[];
assert(dataIgualAOrigem({textContent:'2026'},'2026'));
assert.equal(undefined,undefined); // O erro antigo aceitaria a igualdade de duas ausências.
assert.equal(dataIgualAOrigem(undefined,undefined),false);
assert.equal(dataIgualAOrigem({textContent:undefined},undefined),false);
plantas.push({nome:'undefined contra undefined recusado pela guarda da origem',mordeu:true});
for(const [nome,chave,mudar,queixa] of [
 ...['derivada','semReleituras'].map(chave=>['próxima leitura indevida '+chave,chave,r=>r.querySelector('[data-recibo-datas]').insertAdjacentHTML('beforeend','<p><span data-voz>próxima leitura a</span><time data-data-origem="calendario.proxima-segunda">'+forma(dia)+'</time></p>'),/presença/]),
 ...['pt','en'].map(lang=>['alojamento dito leitura ('+lang+')','alojada-'+lang,r=>r.querySelector('[data-recibo-datas]').insertAdjacentHTML('beforeend','<p><span data-voz>'+FP1[lang].lidos+'</span><span data-de-campo="access_date">01.01.2000</span></p>'),/presença/]),
 ['campo ausente acrescentado','ausencia',r=>r.querySelector('[data-recibo-datas]').insertAdjacentHTML('afterbegin','<p><span data-voz>dados de</span><span data-de-campo="reference_date">2026</span></p>'),/presença/],
 ['próxima leitura no passado','calendario',r=>r.querySelector('[data-data-origem="calendario.proxima-segunda"]').set_content('01.01.2000'),/data diferente/],
 ['releitura do painel retirada','painel',r=>r.querySelector('[data-recibo-datas] [data-de-campo^="verifications."]').parentNode.remove(),/presença/],
]) {
 const a=amostras[chave];assert(a,`controlo da planta ${nome}`);const r=parse(a.html);mudar(r);const erros=conferir(r,a.c,a.lang);const mordeu=erros.some(e=>queixa.test(e));assert(mordeu,nome);plantas.push({nome,mordeu});
}
// Fronteiras do calendário e da marca, apenas dados de ensaio.
for(const [entrada,esperada] of [['2026-10-25','2026-10-26'],['2026-10-26','2026-11-02'],['2026-12-31','2027-01-04']])assert.equal(proximaLeitura(entrada),esperada);
assert.equal(estudoNovo('2026-10-20','2026-10-27'),true);
assert.equal(estudoNovo('2026-10-19','2026-10-27'),false);
assert.equal(estudoNovo('2026-10-28','2026-10-27'),false);
console.log(JSON.stringify({paginas,semPeriodo,comPainel,copiasAlojadas,plantas,calendario:'verde',marcaNovo:'verde'}));
