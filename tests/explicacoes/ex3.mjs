/** EX3: apoios, nomes por código, marcas e plantas sem alterar ficheiros seguidos. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse} from 'node-html-parser';
import {leMarcadores,analisa} from '../../scripts/voz.mjs';
import {conferirFormatoDaPagina} from '../inicio/formato-dos-numeros.mjs';
import {LINGUA_DOS_LOCALIZADORES} from '../../src/i18n/lingua-dos-titulos.mjs';
import {DINHEIRO_DO_ESTADO_2026 as e} from '../../src/data/explicacoes/dinheiro-do-estado-2026.mjs';
import {ORIGENS_DAS_DEFINICOES} from '../../src/data/figuras.mjs';
import {loadClaims,excertoComposto} from '../../src/lib/ledger.mjs';
import {explicacaoResolvida} from '../../src/lib/explicacoes.mjs';
import {valorNaLingua} from '../../src/lib/valor-na-lingua.mjs';
import {conferirAuditoriaDasExplicacoes,conferirPaginaDaExplicacao} from './explicacao.mjs';
const linhas=loadClaims(),dist=process.env.OEDP_DIST??'dist';
const voz=leMarcadores(process.cwd());assert.deepEqual(voz.erros,[]);
for(const texto of ['de cada cem euros desta página são a função «Defesa»','of every hundred euros on this page are the «Defence» function','Their coverage and accounting basis also differ.','Esta página mostra as duas medidas, cada uma com a sua definição, e não as soma nem corrige nenhuma.','This page shows both measures, each with its definition, and neither adds them up nor corrects either.']){
 assert.deepEqual(analisa(texto,'/explicacoes/dinheiro-do-estado-2026',voz,'explicacao'),[]);
 assert(analisa(texto,'/outra-rota',voz,'home').length>0);
}
for(const texto of ['a cobertura desta página','this page is reliable','our coverage is complete'])assert(analisa(texto,'/explicacoes/dinheiro-do-estado-2026',voz,'explicacao').length>0);
console.log('PLANTAS: marcadores da voz fora dos contextos e da rota continuam a morder.');

const formato=(id,valor,rel)=>conferirFormatoDaPagina(`<span data-claim="${id}">${valor}</span>`,rel);
for(const [id,valor] of [['nato-defesa-portugal-pib-2024','1.55'],['nato-defesa-portugal-pib-2025','2.01'],['nato-defesa-portugal-pib-2026','2.10']]){
 assert(formato(id,valor,'en/teste/index.html').desvios.some(x=>x.regra==='F2'));
 for(const rel of ['teste/index.html','en/teste/index.html'])assert.equal(formato(id,valor.replace('.',','),rel).desvios.length,0);
 assert(formato(id,valor,'teste/index.html').desvios.some(x=>x.regra==='F2'));
 assert(formato('outra-linha',valor,'en/teste/index.html').desvios.some(x=>x.regra==='F2'));
 assert(formato(id,valor.slice(0,-1),'en/teste/index.html').desvios.some(x=>x.regra==='F2'));
}
for(const id of ['nato-defesa-portugal-pib-2024','nato-defesa-portugal-pib-2025','nato-defesa-portugal-pib-2026','nato-defesa-portugal-eur-2026']){assert.equal(LINGUA_DOS_LOCALIZADORES[linhas.get(id).document.locator],'en');assert(excertoComposto(linhas.get(id)));}
console.log('PLANTAS: ponto decimal recusado nas duas edições; vírgula aceite nas duas percentagens.');
const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
assert.deepEqual(conferirAuditoriaDasExplicacoes({auditoria}).erros,[]);
const bad=structuredClone(auditoria);
const f=bad.explicacoes.find(x=>x.slug===e.slug).folhas.find(x=>x.caminho==='seccoes[0].conteudo[2].paragrafo[2]');
f.partes.find(x=>x.apoios.some(a=>a.origem==='nato-definicao-despesa-defesa')).apoios=[];
assert(conferirAuditoriaDasExplicacoes({auditoria:bad}).erros.some(x=>x.includes('não tem apoio nenhum')));
console.log('PLANTA: parte da definição sem apoio recusada pela X2.');
for(const path of ['seccoes[0].conteudo[2].paragrafo[16]','seccoes[0].conteudo[2].paragrafo[4]','seccoes[0].conteudo[2].paragrafo[7].sufixo']){
 const bad=structuredClone(auditoria),f=bad.explicacoes.find(x=>x.slug===e.slug).folhas.find(x=>x.caminho===path);
 for(const a of f.partes[0].apoios)if(a.linha)a.linha='nato-defesa-portugal-pib-2026';
 assert(conferirAuditoriaDasExplicacoes({auditoria:bad}).erros.some(x=>x.startsWith('X13 ·')));
}
console.log('PLANTAS X13: apoio dos euros, percentagem e sufixo trocados recusados.');
assert(!linhas.get('nato-defesa-portugal-pib-2024').source_flag);
assert.equal(linhas.get('nato-defesa-portugal-pib-2024').name,'Share of real GDP (%)');

const partes=e.seccoes[0].conteudo[2].paragrafo.pt;
partes.push({claim:'ex3-linha-inexistente'});
try{assert.throws(()=>explicacaoResolvida(e.slug,'pt'),/não está no livro|não existe/)}finally{partes.pop()}
console.log('PLANTA: token sobre linha inexistente recusado pelo resolvedor.');
const nomes=['general public services','defence','public order and safety','economic affairs','environmental protection','housing and community amenities','health','recreation, culture and religion','education','social protection'];
for(let i=1;i<=10;i++){
 const id=`despesa-por-funcao-2024-gf${String(i).padStart(2,'0')}-pt`,r=linhas.get(id);
 assert.equal(r.name.toLowerCase(),nomes[i-1]);assert.equal(r.source_flag,'p');
 assert(e.seccoes[0].conteudo[3].paragrafo.en.some(x=>typeof x==='string'&&x.includes(nomes[i-1])));
}
assert.equal(valorNaLingua(linhas.get('nato-defesa-portugal-pib-2026'),'en'),'2,10');
assert.equal(valorNaLingua(linhas.get('nato-defesa-portugal-pib-2026'),'pt'),'2,10');
for(const [id,r] of linhas)for(const lang of ['pt','en']){
 const original=String(r.value),rendido=valorNaLingua(r,lang);
 // O calendário usa a grafia da casa, conservando dia, mês e ano.
 // Os restantes valores mantêm a identidade textual, incluindo a precisão.
 if(r.unit==='data'&&/^\d{2}\/\d{2}\/\d{4}$/.test(original)){
  assert.match(rendido,/^\d{2}\.\d{2}\.\d{4}$/,`${id}: grafia da data em ${lang}`);
  assert.deepEqual(rendido.split('.'),original.split('/'),`${id}: campos da data em ${lang}`);
 }else assert.equal(rendido,original,`${id}: valor em ${lang}`);
}
if(!process.argv.includes('--declaracao')){
 for(const lang of ['pt','en']){
  const p=path.join(dist,lang==='pt'?'explicacoes':'en/explainers',e.slug,'index.html'),root=parse(fs.readFileSync(p,'utf8'));
  assert.deepEqual(conferirPaginaDaExplicacao(root,lang,e.slug,linhas),[]);
  const p2=root.querySelector('[data-explicacao-paragrafo="seccoes[0].conteudo[3].paragrafo"]');
  assert.equal(p2.querySelectorAll('.claim-provisorio').length,11);
  const p1=root.querySelector('[data-explicacao-paragrafo="seccoes[0].conteudo[2].paragrafo"]');
  assert(!p1.querySelector('[data-claim="nato-defesa-portugal-pib-2024"]').closest('.claim').querySelector('.claim-provisorio'));
  const total=root.querySelector('[data-verbatim="origem-rp4n-total-ministerios-montante"]');
  assert.equal(total.textContent.trim(),ORIGENS_DAS_DEFINICOES['rp4n-total-ministerios'].excerto.split('\n').filter(Boolean).at(-1));
  const original=total.textContent;total.set_content('0');
  assert(conferirPaginaDaExplicacao(root,lang,e.slug,linhas).some(x=>/X6/.test(x)));total.set_content(original);
  const ministry=root.querySelector('[data-explicacao-paragrafo="seccoes[1].conteudo[0].paragrafo"]');
  assert(ministry.querySelectorAll('[lang="pt-PT"]').some(x=>x.textContent==='DESPESA TOTAL'));

  assert.equal(p1.querySelectorAll('.claim-provisorio').length,3);
  assert(p1.querySelectorAll('.claim-provisorio').every(n=>n.textContent.trim()===(lang==='pt'?'(estimativa da NATO)':'(NATO estimate)')));
  for(const [id,value] of [['nato-defesa-portugal-pib-2024','1,55'],['nato-defesa-portugal-pib-2025','2,01'],['nato-defesa-portugal-pib-2026','2,10']])assert.equal(p1.querySelector(`[data-claim="${id}"]`).textContent.trim(),value);
  const changed=new Map([...linhas].map(([id,r])=>[id,{...r}]));changed.get('nato-defesa-portugal-pib-2026').value='9,99';
  assert(conferirPaginaDaExplicacao(root,lang,e.slug,changed).some(x=>/X6/.test(x)));
  const number=p1.querySelector('[data-claim="nato-defesa-portugal-pib-2026"]');number.set_content('2.10');
  assert(conferirPaginaDaExplicacao(root,lang,e.slug,linhas).some(x=>/X6/.test(x)));
  number.set_content('2,1');
  assert(conferirPaginaDaExplicacao(root,lang,e.slug,linhas).some(x=>/X6/.test(x)));
 }
 for(const lang of ['pt','en'])for(const id of ['nato-defesa-portugal-pib-2024','nato-defesa-portugal-pib-2025','nato-defesa-portugal-pib-2026','nato-defesa-portugal-eur-2026']){
  const root=parse(fs.readFileSync(path.join(dist,lang==='pt'?'livro-razao':'en/ledger',id,'index.html'),'utf8'));
  const notas=root.querySelectorAll('.linha-nota').map(n=>n.textContent.trim());
  assert(notas.includes(lang==='pt'?'Excerto composto a partir da resposta da fonte.':"Excerpt composed from the source's response."));
  assert(!notas.includes(lang==='pt'?'Transcrito da fonte, palavra por palavra.':'Transcribed from the source, word for word.'));
  const portas=()=>root.querySelectorAll('main a[href]').filter(a=>!a.closest('[data-rotulo-ia]')&&a.getAttribute('href').split('#')[0]===(lang==='pt'?'/metodo':'/en/method'));
  assert.equal(portas().length,1,'EX3: uma porta para o Método por recibo');
 }
 console.log('PLANTAS: valor NATO trocado e precisão reduzida recusados pela X6 nas duas edições.');
}
if(process.env.RESEARCHHUB_DIR){
 const origem=ORIGENS_DAS_DEFINICOES['nato-definicao-despesa-defesa'],p=path.join(process.env.RESEARCHHUB_DIR,origem.alojada.motor),raw=fs.readFileSync(p);
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),origem.alojada.sha256);
 const root=parse(raw.toString());root.querySelectorAll('script,style,head').forEach(x=>x.remove());
 const text=root.textContent.replace(/\s+/g,' ');
 for(const s of origem.excertoEn.split('\n'))assert(text.includes(s));
}
console.log('PASS EX3: auditoria, dez nomes ingleses, marcas e precisão.');
