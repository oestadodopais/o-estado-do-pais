/** Prova ZER0 sobre a folha decidida, os valores medidos e o HTML construído.
 * Uso, na raiz do sítio: node design/especime-v3/medicoes/zer0-2026-11-14/conferir-zer0.mjs
 * Os excertos antigos ficam apenas no histórico de proveniência exigido pelo mandato.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {loadClaims, verificacoesDaLinha} from '../../../../src/lib/ledger.mjs';
import {routePath} from '../../../../src/lib/routes.mjs';
import {ficheirosDeTexto, conferirRetiradas} from '../../../../scripts/linhas-retiradas.mjs';
const pasta='design/especime-v3/medicoes/zer0-2026-11-14';
const folha=fs.readFileSync(`${pasta}/FOLHA-zer0-decidida.md`,'utf8');
const retiradas=JSON.parse(fs.readFileSync(`${pasta}/retiradas.json`));
const medidas=JSON.parse(fs.readFileSync(`${pasta}/medidas-construcao.json`));
const livro=loadClaims({includeWithdrawn:true}),publicadas=loadClaims();
const norm=s=>s.replace(/\s+/gu,' ').trim();
const html=rota=>parse(fs.readFileSync(path.join('dist',rota,'index.html'),'utf8'));
const recibo=(id,lang)=>html(routePath('linha',lang,{slug:id}));
const frases=s=>[...s.matchAll(/«([^»]+)»/gu)].map(m=>m[1]);
const sec=id=>folha.split(`## ${id} ·`)[1]?.split('\n## ')[0];
const tem=(r,s,onde)=>assert(norm(r.textContent).includes(norm(s)),`${onde}: falta ${s}`);
const anteriores=[];let alvos=0;
const prova=(r,s,onde)=>{tem(r,s,onde);alvos++;};
const z1=sec('Z1'),novas=frases(z1.split('**Novo:**')[1].split('**Provas.**')[0]);
for(const [i,lang] of ['pt','en'].entries()){
 prova(html(lang==='pt'?'/regioes':'/en/regions'),novas[i],`Z1 ${lang}`);
 anteriores.push(frases(z1.split('**Hoje**')[1].split('**Novo:**')[0])[i].slice(novas[i].length).trim());
}
const linhasZ2=sec('Z2').split('\n').filter(l=>l.startsWith('| `evora-'));
for(const linha of linhasZ2){
 const id=linha.match(/`([^`]+)`/u)[1],lang=/` EN/.test(linha)?'en':'pt';const [velha,nova]=frases(linha);
 prova(recibo(id,lang).querySelector('h1'),nova,`Z2 nome ${id} ${lang}`);anteriores.push(velha.trim());
}
for(const [id,k] of [['evora-prr-execucao-2026',0],['evora-prr-vencido-quota-2026',2]]){
 const ar=sec('Z2').split('\n').filter(l=>l.startsWith('- ')&&l.includes(' Novo '));
 for(const [j,lang] of ['pt','en'].entries()){
  const [velha,nova]=frases(ar[k+j]);prova(recibo(id,lang),nova,`Z2 aritmética ${id} ${lang}`);anteriores.push(velha);
 }
}
// As descrições da Z2 são substituições literais, mantendo o resto de cada frase.
const defAntes=JSON.parse((await import('node:child_process')).execFileSync('git',['show','2f0f5f2f8:tests/cartao/leituras-provadas.json'],{encoding:'utf8',maxBuffer:16*1024*1024}));
const pares=[['por beneficiários intermediários e diretos com sede no concelho','em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho'],['a beneficiários intermediários e diretos com sede no concelho','em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho'],['by intermediate and direct beneficiaries headquartered in the municipality','in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality'],['to intermediate and direct beneficiaries headquartered in the municipality','in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality']];
for(const chave of ['evora-prr-aprovado','evora-prr-pago','evora-prr-execucao','evora-prr-vencido-aprovado','evora-prr-vencido-quota']){
 const f=defAntes.familias.find(f=>f.chaves?.includes(chave)).folhas[0];
 for(const lang of ['pt','en']){const velha=f[lang];let nova=velha;for(const [a,b] of pares)nova=nova.replace(a,b);prova(recibo(chave+'-2026',lang),nova.slice(0,-1),`Z2 definição ${chave} ${lang}`);anteriores.push(velha);}
}
const z5=sec('Z5'),descr=frases(z5.split('\n').find(l=>l.startsWith('**As descrições das duas linhas')));
for(const id of ['evora-prr-municipio-contratado','evora-prr-universidade-contratado'])for(const [j,lang] of ['pt','en'].entries()){
 prova(recibo(id,lang),descr[j+2],`Z5 definição ${id} ${lang}`);anteriores.push(descr[j]);
 assert.equal(livro.get(id).excerpt,'[a verificar]');assert(livro.get(id).document.computed_over);
}
for(const l of z5.split('\n').filter(l=>l.startsWith('| `evora-'))){
 const cols=l.split(' | '),ids=[...cols[0].matchAll(/`([^`]+)`/g)].map(m=>m[1]),esperado=cols[3].replace(/^`|`$/g,'');
 for(const id of ids)for(const lang of ['pt','en']){assert.equal(livro.get(id).excerpt,esperado);prova(recibo(id,lang),esperado,`Z5 excerto ${id} ${lang}`);assert(livro.get(id).document.locator.includes('$.'));}
}
for(const [j,lang] of ['pt','en'].entries()){
 const metodo=html(routePath('metodo',lang)).querySelector('[data-prova="divida"]');
 assert.equal(Number(metodo.textContent),medidas.metodoDivida.depois);alvos++;
 const linha=sec('Z6').split('\n').filter(l=>l.startsWith('- Hoje'))[j], [velha,nova]=frases(linha),r=recibo('agua-nao-faturada-portugal-2024',lang);
 prova(r.querySelector('h1'),nova,`Z6 título ${lang}`);prova(r.querySelector('nav.caminho'),nova,`Z6 migalha ${lang}`);
 prova(html(routePath('area',lang,{slug:'ambiente-e-energia'})),nova,`Z6 área ${lang}`);
 assert.notEqual(norm(r.querySelector('h1').textContent),velha);
 const id='evora-pael-emprestimo',c=livro.get(id);
 assert.equal(c.document.page,99);assert.equal(c.document.crop.page,99);assert.equal(norm(c.value),'32 166 373,20');
 for(const rota of [routePath('linha',lang,{slug:id}),routePath('municipio',lang,{slug:'evora'}),routePath('area',lang,{slug:'economia-e-coesao-territorial'})]){
  const r=html(rota),valores=r.querySelectorAll(`[data-claim="${id}"]`);assert(valores.length,rota);
  for(const v of valores)assert(norm(v.textContent).includes('32 166 373,20'),rota);alvos++;
 }
 const corr=c.corrections.find(c=>c.kind==='correcao'&&c.date==='2026-11-14');assert(corr);
 prova(recibo(id,lang),corr[lang==='pt'?'reason':'reason_en'],`Z3 razão ${lang}`);
 const antes=recibo('desempenho-das-exportacoes-2025',lang).querySelector('[data-recibo-datas]');
 assert(!antes.querySelector('[data-de-campo^="verifications."]'));
 const posterior=[...publicadas.values()].find(c=>{const v=verificacoesDaLinha(c).find(v=>v.by==='painel-semanal');return v&&v.date.slice(0,10)>String(c.access_date).slice(0,10);});assert(posterior);
 assert(recibo(posterior.id,lang).querySelector('[data-recibo-datas] [data-de-campo^="verifications."]'));
}
for(const id of retiradas){assert.equal(livro.get(id).publication,'withdrawn');assert(!publicadas.has(id));for(const lang of ['pt','en'])assert(!fs.existsSync(path.join('dist',routePath('linha',lang,{slug:id}),'index.html')));}
assert(publicadas.has('evora-populacao-2021'));
for(const f of ['dist/livro-razao.json','dist/dados/livro-indice.pt.json','dist/dados/livro-indice.en.json'])assert.equal(JSON.parse(fs.readFileSync(f)).linhas.length,publicadas.size,f);
let paginas=0;
for(const file of ficheirosDeTexto('dist')){
 const texto=fs.readFileSync(file,'utf8');assert.deepEqual(conferirRetiradas(texto,livro),[],file);
 if(!file.endsWith('.html'))continue;
 const r=parse(texto);for(const e of r.querySelectorAll('script,style,.historico-entrada'))e.remove();
 const plain=norm(r.textContent);for(const antiga of new Set(anteriores))assert(!plain.includes(norm(antiga)),`${file}: conserva a frase antiga ${antiga}`);paginas++;
}
const hash=createHash('sha256').update(JSON.stringify([...livro].filter(([id])=>id!=='evora-pael-emprestimo').map(([id,c])=>[id,c.value]).sort((a,b)=>a[0].localeCompare(b[0])))).digest('hex');
assert.equal(hash,medidas.valoresSemEmprestimo.antes);
console.log(JSON.stringify({alvos,paginas,publicadas:publicadas.size,retiradas:retiradas.length,valoresRestantesIguais:true,edicoes:2}));
