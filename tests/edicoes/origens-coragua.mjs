import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {conferirAuditoriaDasFamilias} from '../cartao/familias.mjs';
import {FAMILIAS_DAS_LINHAS} from '../../src/data/o-que-e-das-familias.mjs';
import {lugarDaIncorporacao} from '../../src/lib/lugar-da-incorporacao.mjs';
import {blocosDe} from '../../scripts/paridade-numeros.mjs';
const rows=loadClaims(),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let plantas=0;
function historico(c,bytes){return c.document.source_sha256===sha(bytes)&&blocosDe(bytes.toString()).includes(c.excerpt);}
for(const [sufixo,slug,valor] of [
 ['racio-minimo','onde-esta-a-agua','27'],['racio-maximo','onde-esta-a-agua','53'],['eficiencia-95','onde-esta-a-agua','95'],
 ['eficiencia-83','agua-nao-faturada','83'],['eficiencia-85','agua-nao-faturada','85'],['inquerito-2021','agua-nao-faturada','2021'],
]){
 const c=rows.get('coragua-historico-'+sufixo),bytes=fs.readFileSync(`studies-src/_edicoes/${slug}.pt.2026-08-12.html`);
 assert.equal(c.value,valor);assert(historico(c,bytes));
 assert(!historico({...c,excerpt:c.excerpt+' frase inventada'},bytes));plantas++;
 assert(!historico(c,Buffer.concat([bytes,Buffer.from(' alteração')])));plantas++;
}
// Quando o motor está presente, as oito origens são relidas na cópia e no livro.
if(process.env.RESEARCHHUB_DIR){
 const base=path.join(process.env.RESEARCHHUB_DIR,'content/01 Energy Water and Climate/Onde Está a Água — Technical Source');
 const livro=JSON.parse(fs.readFileSync(path.join(base,'ledger_onde_pt.json'),'utf8')).claims;
 for(const [id,motorId] of [
 ['ersar-encargo-mensal-2024','ersar-bill-month'],['alqueva-alta-pressao-2026','alq-pumped'],['alqueva-baixa-pressao-2026','alq-gravity'],
 ['dgadr-eficiencia-2024','dgadr-eficiencia'],['gulbenkian-sem-contador','gulb-71'],['gulbenkian-universo-hectares','gulb-universo-ha'],
 ['gulbenkian-inquerito-ano','gulb-inquerito-ano'],['tc-auditoria-ano','tc-2016-auditoria'],
 ]){
  const c=rows.get('coragua-'+id),m=livro.find(c=>c.id===motorId);
  const confere=c=>c.value===String(m.value)&&c.excerpt===m.excerpt&&c.source_url===m.source_url+'#page='+m.source_page&&c.document.source_sha256===m.source_sha256&&c.document.locator===m.locator;
  assert(confere(c));assert.equal(sha(fs.readFileSync(path.join(base,m.source_file))),m.source_sha256);
  assert(!confere({...c,value:'999'}));assert(!confere({...c,excerpt:'excerto inventado'}));plantas+=2;
 }
}
console.log(`COR-AGUA: seis provas históricas${process.env.RESEARCHHUB_DIR?' e oito origens do motor':''}; ${plantas} plantas recusadas.`);

const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json','utf8'));
const adulterada=structuredClone(auditoria);
adulterada.familias.find(e=>e.chaves?.includes('coragua-gulbenkian-sem-contador')).folhas[0].partes[0].apoios[0].literal='Literal inventado que não está na fonte';
assert(conferirAuditoriaDasFamilias({auditoria:adulterada}).erros.some(e=>e.includes('Literal inventado')));
const familias=structuredClone(FAMILIAS_DAS_LINHAS);
familias['coragua-gulbenkian-sem-contador'].frase.pt=['Uma definição diferente da que foi conferida.'];
assert(conferirAuditoriaDasFamilias({familias}).erros.some(e=>e.includes('as partes juntas não dão a frase declarada')));
console.log('COR-AGUA: definição adulterada e apoio inventado recusados pelas regras das famílias.');

for(const [id,c] of rows)if(id.startsWith('coragua-'))for(const lang of ['pt','en'])assert(lugarDaIncorporacao(c,lang).nome);
assert.equal(lugarDaIncorporacao(rows.get('coragua-alqueva-alta-pressao-2026'),'pt').nome,'Alqueva');
assert.equal(lugarDaIncorporacao(rows.get('coragua-gulbenkian-sem-contador'),'pt').nome,'Portugal continental');
assert.equal(lugarDaIncorporacao(rows.get('coragua-racio-minimo-2026'),'en').nome,'Mainland Portugal / Alqueva');
assert.equal(lugarDaIncorporacao(rows.get('coragua-historico-racio-minimo'),'pt').nome,'O Estado do País');
assert.throws(()=>lugarDaIncorporacao({id:'linha-nova-sem-ambito',study:'estudo-sem-lugar'},'pt'),/não tem lugar declarado/);
console.log('COR-AGUA: âmbito das dezassete linhas declarado; linha nova sem âmbito recusada.');

// A exceção tem a frase completa do registo; nunca um fragmento ou um texto alterado.
const {medirPagina,EXCECOES}=await import('../../scripts/voz-autorreferencia.mjs');
for(const rota of ['/correcoes','/en/corrections']){
 const e=EXCECOES.find(e=>e.rota===rota&&e.razao.startsWith('COR-AGUA:'));
 assert(e);assert(medirPagina(`<p>${e.frase}</p>`,rota).frases.length,'texto sem a unidade e os selos não basta');
 const html=fs.readFileSync('dist'+rota+'/index.html','utf8');
 assert.equal(medirPagina(html,rota).frases.length,0);
 assert(medirPagina(html.replace('</body>',`<p>${e.frase}</p></body>`),rota).frases.length,'a unidade válida não legitima uma cópia solta');
 const {parse}=await import('node-html-parser');
 for(const muda of [r=>r.querySelector('[data-texto-estudo="agua-nao-faturada"] [data-claim]').set_content('77'),r=>r.querySelector('[data-texto-estudo="agua-nao-faturada"] a.src-chip').setAttribute('href','/livro-razao/inexistente')]){
  const copia=parse(html);muda(copia);assert(medirPagina(copia.toString(),rota).frases.length);
 }
}
const {primeiraEdicaoServida}=await import('../../src/lib/edicoes.mjs');
for(const lang of ['pt','en']){
 const html=primeiraEdicaoServida('onde-esta-a-agua',lang,'2026-08-12');
 assert.equal(medirPagina(html,`${lang==='pt'?'/estudos':'/en/studies'}/onde-esta-a-agua/${lang==='pt'?'documento':'document'}/2026-08-12`).marca,false);
}
console.log('COR-AGUA: correção alterada ou com selo trocado recusada; marcas históricas apresentadas sem alterar o arquivo.');
