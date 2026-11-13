import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {WORKS} from '../../../../src/data/studies.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {conferirLigacoesRetiradas} from '../../../../scripts/estudos-retirados-conferir.mjs';

const dist=process.env.OEDP_DIST ?? 'dist';
const slug='evora-2027-capital-europeia-da-cultura';
const titulo='A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara';
const texto=el=>el.textContent.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
const provas={contratos:{},recibo:{},recusas:0};
for(const lang of ['pt','en']) {
 const pergunta=lang==='pt'?'Que contratos a associação celebrou, com quem e por quanto?':'What contracts did the association sign, with whom and for how much?';
 const celula=root=>root.querySelectorAll('tr').find(tr=>texto(tr.querySelector('td')??{textContent:''})===pergunta)?.querySelectorAll('td')[1];
 const anterior=execFileSync('git',['show',`48f76a2f9:studies-src/${slug}/${lang}.html`],{encoding:'utf8',maxBuffer:2*1024*1024});
 const frase=' '+(lang==='pt'?'Ver também o estudo ':'See also the study ')+titulo;
 const esperado=texto(celula(parse(anterior)));assert(esperado.includes(frase));
 const prefixo=lang==='pt'?'estudos':'en/studies';
 for(const sufixo of ['',lang==='pt'?'documento/':'document/']) {
  const rota=`/${prefixo}/${slug}/${sufixo}`;
  const html=fs.readFileSync(`${dist}${rota}index.html`,'utf8');
  const valor=texto(celula(parse(html)));
  assert.equal(valor,esperado.replace(frase,''),'Só a frase autorizada pode sair da célula.');
  assert.deepEqual(conferirLigacoesRetiradas(WORKS,rota,html),[]);
  provas.contratos[lang]=valor;
 }
 const id='coragua-historico-eficiencia-83';
 const rota=`/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/`;
 const html=fs.readFileSync(`${dist}${rota}index.html`,'utf8');
 const root=parse(html),c=loadClaims().get(id);
 assert(!root.querySelector('#pedido'));
 assert(!root.textContent.includes(c.source_url));
 provas.recibo[lang]=Object.fromEntries(['document.title','document.edition','excerpt'].map(campo=>[campo,texto(root.querySelector(`[data-linha-campo="${campo}"]`))]));
}
for(const file of fs.readdirSync(dist,{recursive:true}).filter(f=>/\.(html|xml)$/.test(f))) {
 const rota='/'+file.replace(/index\.html$/,'');
 provas.recusas+=conferirLigacoesRetiradas(WORKS,rota,fs.readFileSync(`${dist}/${file}`,'utf8')).length;
}
assert.equal(provas.recusas,0);
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(provas,null,2)+'\n');
console.log('RET1-C: célula igual à anterior menos a frase autorizada, nas duas páginas e nos dois documentos; recibo sem bloco do endereço; zero recusas em toda a construção.');
for(const lang of ['pt','en'])console.log(`Contratos ${lang}: ${provas.contratos[lang]}`);
for(const lang of ['pt','en'])console.log(`Recibo ${lang}: ${provas.recibo[lang]['document.title']}; edição ${provas.recibo[lang]['document.edition']}; excerto conservado; nenhum texto ou ligação no lugar do endereço.`);
