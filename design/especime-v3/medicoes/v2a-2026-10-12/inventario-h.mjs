/** Inventário das palavras da casa, retirando os tokens e os nomes citados. */
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {routePath} from '../../../../src/lib/routes.mjs';
const ids=Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a.json')).rows);
const file='design/especime-v3/INVENTARIO-FRASES.md',orig=fs.readFileSync(file,'utf8').split('\n');
const removed=orig.filter(l=>l.includes('| v2ag |')).length;
const antigas=orig.map(l=>l.includes('| v2ac | viva |')&&(l.includes('É a previsão do Ministério das Finanças')||l.includes('It is the Ministry of Finance forecast'))?l.replace('| viva |','| retirada |').replace('Frase conferida nas fontes seladas e na auditoria K17.','Substituída na passagem H: o ano da previsão passa a vir do token do período.'):l);
const keep=antigas.filter(l=>!l.includes('| v2ag |')&&!l.includes('| v2ah |'));
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
for(const s of phrases)keep.push('| conteudo | '+s+' | v2ah | viva | Palavras conferidas no HTML, valores e períodos pelos tokens do livro. Leitura a frio pendente. |');
fs.writeFileSync(file,keep.join('\n').replace(/\n+$/,'')+'\n');
const reviews='design/especime-v3/critica/REVISOES-DO-INVENTARIO.md';let r=fs.readFileSync(reviews,'utf8').split('\n').filter(l=>!l.startsWith('| v2ah |')).join('\n');
r+=`\n| v2ah | ${phrases.size} entradas; ${removed} entradas G substituídas | por ler | Codex gpt-6-astra, 14.10.2026: mandato H aplicado, palavras conferidas na construção. Leitura a frio pela direção antes da fusão. |\n`;
fs.writeFileSync(reviews,r);console.log(`${phrases.size} frases registadas; ${removed} entradas G substituídas.`);
