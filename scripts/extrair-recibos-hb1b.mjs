/** HB1-b: nove recibos, nas duas edições, extraídos do HTML construído. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';

const destino=process.argv[2];assert(destino,'indique o ficheiro JSON de saída');
const ensaio=process.argv.includes('--ensaio');
const headIndex=process.argv.indexOf('--cabeca');
const esperada=headIndex<0?null:process.argv[headIndex+1];
assert(ensaio||/^[a-f0-9]{40}$/.test(esperada??''),'a extração final exige --cabeca com o commit completo do build; para seletores, use --ensaio');
const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
if(esperada)assert.equal(versao.commit,esperada,'o dist não corresponde à cabeça pedida');
const exemplos={
 eurostat:['hab-prc-hpi-q-q-total-rch-a-pt-2026-q2','hab-ilc-lvho07c-a-pc-rent-mkt-pt-2025','hab-ilc-lvps08-a-y25-34-t-pc-pt-2025'],
 ine:['hab-ine-preco-mediano','hab-ine-renda-portugal','hab-ine-vagos-total'],
 derivado:['der-hab-licencas-por-mil-pt-2025','der-hab-fiscal-2027','der-hab-sobrecarga-inquilinos-pt-2020-2025'],
};
const sha=b=>createHash('sha256').update(b).digest('hex');
const texto=(root,selector,required=false)=>{
 const found=root.querySelector(selector);assert(!required||found,`seletor ausente: ${selector}`);return found?.textContent??null;
};
const saida={schema:'oedp/recibos-hb1b/1',codigo:0,estado:ensaio?'ensaio-de-seletores':'extraido-da-cabeca-indicada',cabeca:versao.commit,construido_em:versao.construido_em,criterio:'Texto extraído de textContent sem normalizar pontuação, casas decimais ou espaços. Campos ausentes no HTML são null; uma linha calculada não tem nome nem localização na fonte. As datas vêm dos campos renderizados, não do YAML.',tipos:{}};
for(const [tipo,ids] of Object.entries(exemplos)) {
 saida.tipos[tipo]=[];
 for(const id of ids) {
  const edicoes={};
  for(const lingua of ['pt','en']) {
   const rota=(lingua==='pt'?'/livro-razao/':'/en/ledger/')+id;
   const arquivo=`dist${rota}/index.html`,bytes=fs.readFileSync(arquivo),doc=parse(bytes.toString('utf8'));
   const field=name=>texto(doc,`[data-linha-claim="${id}"][data-linha-campo="${name}"]`);
   assert.equal(field('id'),id,'recibo de outra linha');
   const datas={published_at:null,access_date:null,reference_date:null,...Object.fromEntries(doc.querySelectorAll(`[data-de-linha="${id}"][data-de-campo]`).map(n=>[n.getAttribute('data-de-campo'),n.textContent]))};
   const ficha=doc.querySelector('.aparelho-ficha');assert(ficha,'ficha ausente');
   const proveniencia=[];let label;
   for(const n of ficha.childNodes.filter(n=>n.tagName)) {
    if(n.tagName==='DT')label=n.textContent;
    else if(n.tagName==='DD'){assert(label,'valor da ficha sem rótulo');proveniencia.push({rotulo:label,texto:n.textContent});label=null;}
   }
   const nome=texto(doc,'.linha-nome-da-fonte [data-linha-campo]');
   const aritmetica=field('derivation');
   if(tipo==='derivado'){
    assert(aritmetica,'recibo derivado sem aritmética');
    assert(!/\b(?:der-)?hab-[a-z0-9]/.test(aritmetica),`${lingua}: aritmética ainda imprime identificadores de componentes: ${id}`);
   }
   else {assert(nome,'recibo documental sem nome na fonte');assert(field('name_source'),'recibo documental sem localização do nome');}
   edicoes[lingua]={rota,html_sha256:sha(bytes),titulo:texto(doc,'h1.linha-titulo',true),valor:texto(doc,'.linha-valor-num',true),unidade:field('unit'),nome_na_fonte:nome,publicado_por:field('source'),documento:field('document.title'),edicao:field('document.edition')??datas['document.edition']??null,onde_no_ficheiro:field('name_source'),onde_no_documento:field('document.locator'),o_que_e_este_numero:texto(doc,'[data-o-que-e-parte="o-que-e"]',true),datas,aritmetica,expressao_conferida:field('check'),excerto:field('excerpt'),ressalva:field('ressalva'),proveniencia};
  }
  saida.tipos[tipo].push({id,edicoes});
 }
}
fs.mkdirSync(path.dirname(destino),{recursive:true});fs.writeFileSync(destino,JSON.stringify(saida,null,2)+'\n');
console.log(JSON.stringify({codigo:saida.codigo,estado:saida.estado,cabeca:saida.cabeca,tipos:Object.fromEntries(Object.entries(saida.tipos).map(([k,v])=>[k,v.length])),edicoes:['pt','en']}));
