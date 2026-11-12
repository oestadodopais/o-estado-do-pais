/** EVL: os cartões e os recibos são medidos no HTML construído. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {LEITURAS} from '../../../../src/data/leituras.mjs';
import {getClaim} from '../../../../src/lib/ledger.mjs';
import {valorNaLingua} from '../../../../src/lib/valor-na-lingua.mjs';
import {NOMES_DO_PROJETO,NOMES_DAS_LINHAS_DERIVADAS} from '../../../../src/data/nomes-das-medidas.mjs';
const slug='evora-2027-capital-europeia-da-cultura',leitura=LEITURAS[slug];
const ids=['evora-2027-transferido-no-relato-ao-painel-2025','evora-2027-contribuicao-inicial-do-estado-2024','evora-2027-pago-pela-cultura-2025','evora-2027-pago-pelo-turismo-2025','evora-2027-recebido-do-protocolo-ate-2025'];
const texto=n=>{const c=parse(n.outerHTML);c.querySelectorAll('.src-chip').forEach(n=>n.remove());return c.textContent.replace(/\s+/g,' ').trim();};
const ler=rota=>parse(fs.readFileSync(`dist${rota==='/'?'':rota}/index.html`,'utf8'));
const provas={cartoes:[],recibos:[]};
for(const lingua of ['pt','en']){
 for(const rota of lingua==='pt'?['/','/estudos','/municipios/evora']:['/en','/en/studies','/en/municipalities/evora']){
  const card=ler(rota).querySelector(`[data-estudo="${slug}"]`);assert(card,rota);
  const frase=texto(card.querySelector('.estudo-resumo,.lugar-estudo-leitura'));
  assert.equal(frase,leitura.origem[lingua]);
  const medidas=card.querySelectorAll('[data-medida-estudo]');assert.equal(medidas.length,2);
  medidas.forEach((m,i)=>{const d=leitura.medidas[i];assert.equal(m.getAttribute('data-medida-estudo'),d.claim);const expected=valorNaLingua(getClaim(d.claim),lingua)+' '+d.nome[lingua].map(p=>typeof p==='string'?p:p.ref).join('');assert.equal(texto(m),expected);assert.equal(m.querySelectorAll(`[data-claim="${d.claim}"]`).length,1);assert(m.querySelector(`[href="/${lingua==='pt'?'livro-razao':'en/ledger'}/${d.claim}"]`));});
  provas.cartoes.push({rota,lingua,frase,medidas:medidas.map(texto)});
 }
 for(const id of ids){
  const rota=`/${lingua==='pt'?'livro-razao':'en/ledger'}/${id}`,p=ler(rota),c=getClaim(id);
  const campo=k=>p.querySelector(`[data-linha-campo="${k}"]`)?.textContent.trim()??null;
  const valor=p.querySelector(`[data-claim="${id}"]`)?.textContent.replace(/\s+/g,' ').trim();
  assert.equal(valor,valorNaLingua(c,lingua).replace(/\s+/g,' '));
  const nome=p.querySelector('h1').textContent.trim();assert.equal(nome,(NOMES_DO_PROJETO[id]??NOMES_DAS_LINHAS_DERIVADAS[id])[lingua]);
  if(c.source){assert.equal(campo('source'),c.source);assert.equal(campo('document.page'),String(c.document.page));}
  provas.recibos.push({rota,lingua,id,valor,unidade:campo('unit'),nome,fonte:campo('source'),pagina:campo('document.page'),origens:c.derived_from.map(id=>{const r=getClaim(id);return {id,fonte:r.source,pagina:r.document.page};})});
 }
}
fs.writeFileSync(new URL('./html-conferido-evl.json',import.meta.url),JSON.stringify(provas,null,2)+'\n');
console.log(`EVL HTML: ${provas.cartoes.length} cartões, duas medidas em cada um, e ${provas.recibos.length} recibos conferidos.`);
