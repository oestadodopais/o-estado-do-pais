/** Extrai a entrega do HTML e dos ficheiros de medição, sem voltar a escrever as frases. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const folder='design/especime-v3/medicoes/eo1-2026-10-20',slug='orcamento-2027-o-que-muda-e-para-quem';
const gates=process.argv[2];assert(gates,'indicar a pasta dos códigos');
const measured=JSON.parse(fs.readFileSync(`${folder}/partida.json`));
const escape=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
let out='\n<!-- EO1-MEDIDO -->\n\n## Linhas seladas\n\n';
out+='| Identificador | Valor | Unidade | Período |\n| --- | --- | --- | --- |\n';
for(const [id,r]of Object.entries(measured.linhas_seladas))out+=`| ${id} | ${escape(r.value)} | ${escape(r.unit)} | ${escape(r.period)} |\n`;
out+='\nOs resumos dos corpos e as posições de cada excerto estão em `partida.json`, em `novas`.\n\n## Contas refeitas\n\n| Identificador | Expressão | Resultado | Diferença |\n| --- | --- | --- | --- |\n';
for(const d of measured.derivadas)out+=`| ${d.id} | ${escape(d.expressao)} | ${escape(d.resultado)} | ${d.diferenca} |\n`;
out+='\n## Medidas comparadas\n\n';for(const [name,rows]of Object.entries(measured.comparacoes)){out+='### '+name.replaceAll('_',' ')+'\n\n';for(const id of rows){const r=measured.linhas[id];assert(r);out+=`- ${id}: ${r.value} ${r.unit}, ${r.period}. Localizador: ${r.locator}.\n`;}out+='\n';}
out+='## Portões\n\nComando: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> motor`. Os códigos abaixo foram lidos dos ficheiros da corrida, não inferidos da tentativa.\n\n';
for(const name of ['build','verify','typecheck','motor']){const value=fs.readFileSync(path.join(gates,`${name}.codigo`),'utf8').trim();assert(/^\d+$/.test(value));out+=`- ${name}: ${value}.\n`;}
const editionData=[];for(const lang of ['pt','en']){
 const r=JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`));
 const route=lang==='pt'?`estudos/${slug}`:`en/studies/${slug}`;
 const doc=parse(fs.readFileSync(`dist/${route}/index.html`,'utf8'));
 const blocks=r.blocks.map(b=>{const e=doc.querySelector(`[data-registo-unidade="${slug}/${lang}#${b.i}"]`);assert(e);e.querySelectorAll('[data-selo-etiqueta]').forEach(x=>x.remove());const text=e.textContent.replace(/[\u00a0\u202f]/g,' ');assert.equal(text,b.text.replace(/[\u00a0\u202f]/g,' '));return {...b,text};});editionData.push({lang,blocks});
}
out+='\n## Literais e apoios\n\n| Edição | Unidade | Literal | Linha | Campo |\n| --- | --- | --- | --- | --- |\n';
for(const {lang,blocks}of editionData)for(const b of blocks)for(const p of b.proofs??[])if(p.tipo==='literal')for(const a of p.apoios)out+=`| ${lang} | ${b.i} | ${escape(p.texto)} | ${a.id} | ${a.campo} |\n`;
out+='\n## Siglas e primeira expansão\n\n';
for(const {lang,blocks}of editionData){out+='### '+lang+'\n\n';for(const acronym of ['UTAO','CFP','PRR','PIB','IRS','IRC','IVA','SIFIDE','CSI','RMMG','SNS','BOE']){const regex=new RegExp('\\b'+acronym+'\\b'),b=blocks.find(b=>regex.test(b.text));assert(b,'sigla sem expansão '+acronym);const m=regex.exec(b.text);out+=`- ${acronym}, unidade ${b.i}: «${b.text.slice(Math.max(0,m.index-145),Math.min(b.text.length,m.index+acronym.length+150))}».\n`;}}
out+='\n## Frases extraídas do HTML construído\n\nAs unidades abaixo foram extraídas das páginas de leitura construídas e comparadas com o registo. As citações conservam a língua original.\n\n';
for(const {lang,blocks}of editionData){out+='### Edição '+lang+'\n\n';for(const b of blocks)out+=`**Unidade ${b.i}.** ${b.text}\n\n`;}
const readme=`${folder}/LEIA-ME.md`;const before=fs.readFileSync(readme,'utf8').split('\n<!-- EO1-MEDIDO -->')[0];fs.writeFileSync(readme,before+out);console.log('EO1: relatório extraído das duas edições e dos códigos.');
