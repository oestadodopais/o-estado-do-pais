import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {errosDoPublicador} from '../../src/lib/publicadores.mjs';
import {conferirFormaDasCitacoes,conferirCartoesDeCitacao,conferirEdicaoGuardada} from '../../scripts/forma-da-citacao.mjs';
import {conferirTitulosPublicados,retirarTitulosConferidos,fraseRetiradaNoTexto} from '../../scripts/titulos-publicados.mjs';
import {edicoesGuardadas,primeiraEdicaoServida} from '../../src/lib/edicoes.mjs';
import {areasComPecas} from '../../src/lib/areas.mjs';
import {WORKS} from '../../src/data/studies.mjs';
const rows=loadClaims(),base=rows.get('hab-imprensa-psp-ferido');let count=0;
function prova(nome,errors,code){assert.equal(errors.length?1:0,code,nome+': '+errors);count++;console.log(`OG1-E C ${nome}: código ${code}`);}
for(const [nome,change,code] of [['publicador intacto',{},0],['pessoa como publicador',{source:'Polícia de Segurança Pública'},1],['nome inventado',{source:'Publicador inventado'},1],['domínio trocado',{source_url:'https://rtp.pt/noticia'},1]])prova(nome,errosDoPublicador({...base,...change}),code);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
function registo(row,lang,source=row.source,title=row.document.title){const atrib=lang==='en'&&row.attributed_to_en?'attributed_to_en':'attributed_to';return `<div data-linha-id="${row.id}"><span data-linha-claim="${row.id}" data-linha-campo="source">${esc(source)}</span>${title===null?'':`<span data-linha-claim="${row.id}" data-linha-campo="document.title">${esc(title)}</span>`}<span data-linha-claim="${row.id}" data-linha-campo="${atrib}">${esc(row[atrib].join(' · '))}</span></div>`;}
for(const lang of ['pt','en'])for(const key of ['linha','livro']){
 const rota={key,lang,params:{slug:base.id}};
 for(const [nome,source,title,code] of [['intacto',base.source,base.document.title,0],['pessoa',base.attributed_to[0],base.document.title,1],['sem título',base.source,null,1]])prova(`${key}/${lang}/${nome}`,conferirFormaDasCitacoes(parse(registo(base,lang,source,title)),rota,rows),code);
}
for(const lang of ['pt','en']) {
 const rota={key:'linha',lang,params:{slug:base.id}},label=lang==='pt'?'Publicado por':'Published by';
 for(const [nome,extra] of [
  ['dois campos',`<span data-linha-claim="${base.id}" data-linha-campo="source">${base.attributed_to[0]}</span>`],
  ['frase errada',`<p>${label} ${base.attributed_to[0]}, em documento.</p>`],
  ['meta errada',`<meta name="description" content="${label}: ${base.attributed_to[0]} · documento">`],
 ]) prova(`${nome}/${lang}`,conferirFormaDasCitacoes(parse(registo(base,lang)+extra),rota,rows),1);
 prova(`meta intacta/${lang}`,conferirFormaDasCitacoes(parse(registo(base,lang)+`<meta name="description" content="${label}: ${base.source} · documento">`),rota,rows),0);
 prova(`motivo da correção/${lang}`,conferirFormaDasCitacoes(parse(registo(base,lang)+`<p>${lang==='pt'?base.corrections.at(-1).reason:base.corrections.at(-1).reason_en}</p>`),rota,rows),0);
 const text=[...rows.values()].find(r=>r.unit==='texto');
 prova(`cartão de texto/${lang}`,conferirCartoesDeCitacao(parse(`<article class="cartao-medida"><span data-claim="${text.id}">texto</span></article>`),rows),1);
}
for(const lang of ['pt','en']){
 prova(`cartão de citação/${lang}`,conferirCartoesDeCitacao(parse(`<article class="cartao-medida"><span data-claim="${base.id}">um polícia</span></article>`),rows),1);
 const e=WORKS.find(w=>w.slug==='a-casa-em-portugal-e-na-europa').editions.find(e=>e.lang===lang);
 const root=parse(`<span data-titulo-publicado="${lang}">${e.title}</span>`);
 prova(`título publicado/${lang}`,conferirTitulosPublicados(root),0);retirarTitulosConferidos(root);assert.equal(root.textContent,'');assert.equal(fraseRetiradaNoTexto(root.textContent,'A casa em Portugal'),false);
 const falso=parse(`<span data-titulo-publicado="${lang}">A casa em Portugal</span>`);
 prova(`título inventado/${lang}`,conferirTitulosPublicados(falso),1);retirarTitulosConferidos(falso);assert.equal(falso.textContent,'A casa em Portugal');
 const antiga=parse('<span data-nonledger="titulo-de-estudo">A casa em Portugal</span>');retirarTitulosConferidos(antiga);assert(fraseRetiradaNoTexto(antiga.textContent,'A casa em Portugal'));count++;
 const fora=parse('<p>A casa em Portugal</p>');retirarTitulosConferidos(fora);assert.equal(fraseRetiradaNoTexto(fora.textContent,'A casa em Portugal'),true);count++;
}
for(const e of edicoesGuardadas()) {
 const rota={key:'documento',lang:e.lang,params:{slug:e.slug,date:e.data}},html=primeiraEdicaoServida(e.slug,e.lang,e.data);
 assert.equal(conferirEdicaoGuardada(rota,html).erro,null);
 prova(`edição guardada ${e.slug}/${e.lang}`,conferirFormaDasCitacoes(parse(html),rota,rows,{html}),0);
 const changed=html.replace('</body>','x</body>');assert.notEqual(changed,html);
 prova(`edição com byte mudado ${e.slug}/${e.lang}`,conferirFormaDasCitacoes(parse(changed),rota,rows,{html:changed}),1);
}
const registry=JSON.parse(fs.readFileSync('ledger/publicadores.json','utf8'));
for(const c of registry.correcoes){const row=rows.get(c.id),fix=row.corrections.at(-1);assert.equal(row.source,c.nome);assert.equal(fix.old_value,c.anterior);assert.equal(fix.new_value,c.nome);assert.equal(fix.field,'source');count++;}
const area=areasComPecas().find(a=>a.slug==='infraestruturas-e-habitacao');
const habitacao=area.pecas.trabalhos.find(t=>t.id==='a-casa-em-portugal-e-na-europa');
const textos=[...rows.values()].filter(r=>r.study===habitacao.id&&r.unit==='texto');
for(const lang of ['pt','en']) {
 const record=JSON.parse(fs.readFileSync(`registos/${habitacao.id}/${lang}.record.json`,'utf8'));
 for(const row of textos){assert(JSON.stringify(record.blocks).includes('"'+row.id+'"'));assert(habitacao.linhas.includes(row.id));assert(!area.pecas.medidas.some(m=>m.id===row.id));count++;}
}
console.log(`OG1-E F alcance: ${textos.length} linhas de texto alcançáveis nos dois estudos e fora da grelha.`);
const citacoes=[...rows.values()].filter(r=>r.study===habitacao.id&&r.unit==='afirmação');
assert.equal(citacoes.length,29);
for(const row of citacoes){assert(habitacao.linhas.includes(row.id));assert(!area.pecas.medidas.some(m=>m.id===row.id));count++;}
for(const a of areasComPecas())for(const m of a.pecas.medidas)assert(!['afirmação','texto'].includes(rows.get(m.id).unit));
console.log('OG1-E C alcance: as 29 citações da habitação conservam o estudo na área; nenhuma citação entra nas medidas de qualquer área.');
console.log(`OG1-E C: ${count} plantas e controlos conferidos.`);
