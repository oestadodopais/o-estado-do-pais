/** V2-e-c: lê o HTML entregue e conserva a frase antes e depois. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {textoSemSelos} from '../../../../../tests/explicacoes/explicacao.mjs';
import {conferirPagina,plantasDasUnidades,unidadesDepoisDoSelo} from '../../../../../tests/discussao/itens.mjs';
import {loadClaims} from '../../../../../src/lib/ledger.mjs';
import {dadosDaIncorporacao} from '../../../../../src/lib/incorporar.mjs';
const [antes,pasta]=process.argv.slice(2);fs.mkdirSync(pasta,{recursive:true});
const linhas=loadClaims(),result={cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,edicoes:{},plantas:plantasDasUnidades()};
for(const lang of ['pt','en']){
 const html=fs.readFileSync(`dist/${lang==='pt'?'o-que-se-discute':'en/under-discussion'}/index.html`,'utf8'),root=parse(html),old=parse(fs.readFileSync(`${antes}/antes-${lang}.html`,'utf8'));
 const erros=conferirPagina(root,lang);assert.deepEqual(erros,[]);
 const sel='#parcerias-rodoviarias [data-discussao-paragrafo="seccoes[1].conteudo[7].paragrafo"]';
 const toll=root.querySelector(sel),tollOld=old.querySelector(sel),texto=textoSemSelos(toll),textoAntes=textoSemSelos(tollOld);
 assert.equal(toll.querySelectorAll('[data-discussao-literal="excerpt"]').length,2);
 assert(!/contratual|contractual|\.»\.|««/.test(texto.replaceAll('.»,','')),'citação ou interpretação errada');
 for(const a of toll.querySelectorAll('[data-discussao-recibo]'))assert.equal(a.getAttribute('href'),`${lang==='pt'?'/livro-razao/':'/en/ledger/'}${a.getAttribute('data-discussao-recibo')}`);
 const ps=root.querySelectorAll('[data-discussao-paragrafo]').map(n=>({item:n.closest('[data-discussao]').getAttribute('data-discussao'),caminho:n.getAttribute('data-discussao-paragrafo'),texto:textoSemSelos(n)}));
 const med='#saude-no-orcamento [data-discussao-paragrafo="seccoes[1].conteudo[6].paragrafo"]';
 const before=old.querySelector(med).innerHTML,after=root.querySelector(med).innerHTML;
 const inicioAntes=lang==='pt'?' Nos médicos':' For practising physicians',inicioDepois=' Portugal';
 result.edicoes[lang]={sha256:createHash('sha256').update(html).digest('hex'),paragrafos:ps,portagens:{antes:textoAntes.length,depois:texto.length,texto},html:{antes:before.slice(before.indexOf(inicioAntes)),depois:after.slice(after.lastIndexOf(inicioDepois))},unidadesDepoisDoSelo:unidadesDepoisDoSelo(root)};
 const surgery=dadosDaIncorporacao(linhas.get('der-sns-cirurgias-variacao-pct'),lang);assert.equal(surgery.periodo,lang==='pt'?'janeiro a julho de 2026':'January to July 2026');assert(surgery.valor.startsWith('−'));
 for(const id of ['pe-dl87a-descontos','pe-dl87a-apoio-retificado','sns-sem-medico-elegibilidade'])assert.equal(dadosDaIncorporacao(linhas.get(id),lang).unidade,'');
}
assert(result.plantas.every(p=>p.mordeu));
fs.writeFileSync(`${pasta}/html-conferido.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cabeca:result.cabeca,portagens:Object.fromEntries(Object.entries(result.edicoes).map(([l,v])=>[l,{antes:v.portagens.antes,depois:v.portagens.depois}]))}));
