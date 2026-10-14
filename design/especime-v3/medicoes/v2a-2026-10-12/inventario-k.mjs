/** Inventário das palavras da casa, retirando os tokens e os nomes citados. */
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {routePath} from '../../../../src/lib/routes.mjs';
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json')).rows).filter(id=>!id.includes('-cenario-'));
const file='design/especime-v3/INVENTARIO-FRASES.md',orig=fs.readFileSync(file,'utf8').split('\n');
const alterada=l=>l.includes('| v2aj |')||(l.includes('| v2ai |')&&['próprio programa','own entities','É quanto o Estado prevê pagar','It is what the State expects to pay'].some(p=>l.split('|')[2]?.includes(p)));
const removed=orig.filter(alterada).length;
const antigas=orig.map(l=>l.includes('| v2ac | viva |')&&(l.includes('É a previsão do Ministério das Finanças')||l.includes('It is the Ministry of Finance forecast'))?l.replace('| viva |','| retirada |').replace('Frase conferida nas fontes seladas e na auditoria K17.','Substituída na passagem H: o ano da previsão passa a vir do token do período.'):l);
const keep=antigas.filter(l=>!alterada(l)&&!l.includes('| v2ak |'));
const found=new Set(keep.filter(l=>l.startsWith('|')).map(l=>l.split('|')[2]?.trim()));
const phrases=new Set();
for(const id of ids)for(const lang of ['pt','en']) {
 const route=routePath('linha',lang,{slug:id}),root=parse(fs.readFileSync('dist'+route.replace(/\/$/,'')+'/index.html','utf8'));
 for(const el of root.querySelectorAll('.linha-o-que-e-frase,[data-v2a-conta]')) {
  const parts=[];
  const walk=n=>{if(n.nodeType===3){parts.push(n.rawText);return;}if(['a','button','script','style'].includes(n.rawTagName?.toLowerCase())||['data-claim','data-linha-claim','data-nonledger','data-verbatim'].some(a=>n.hasAttribute?.(a)))return;for(const c of n.childNodes??[])walk(c);};
  walk(el);const s=parts.join(' ').replace(/\s+/g,' ').trim();if(s&&!found.has(s))phrases.add(s);
 }
}
for(const s of phrases)keep.push('| conteudo | '+s+' | v2ak | viva | Palavras conferidas no HTML, valores e períodos pelos tokens do livro. Leitura a frio pendente. |');
fs.writeFileSync(file,keep.join('\n').replace(/\n+$/,'')+'\n');
const reviews='design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';let r=fs.readFileSync(reviews,'utf8').split('\n').filter(l=>!l.startsWith('| v2ak |')).join('\n');
r+=`\n| v2ak | ${phrases.size} entradas; ${removed} entradas I e J substituídas | por ler | Codex gpt-6-astra, 14.10.2026: mandato K aplicado, palavras conferidas na construção. Leitura a frio pela direção antes da fusão. |\n`;
fs.writeFileSync(reviews,r);console.log(`${phrases.size} frases registadas; ${removed} entradas I e J substituídas.`);
