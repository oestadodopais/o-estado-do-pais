/** RP4-n-g: réguas rendidas e plantas nas cópias de cada edição. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {t} from '../../src/i18n/strings.mjs';
const plantas=[];
function morde(nome,erros,mensagem) {
 const erro=erros.find(e=>e.includes(mensagem));assert(erro,`${nome}: a planta passou`);
 plantas.push({nome,mensagem:erro});console.log(`PLANTA ${nome}: ${erro}`);
}
function selos(root,lang) {
 return root.querySelectorAll('.marcador').flatMap(el=>el.textContent===t(lang).prov.marcadorDoSelo?[]:[`RP4N-g: o selo não está na língua da edição ${lang}`]);
}
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='en'?'en/':''}areas/economia-e-coesao-territorial/index.html`,'utf8'));
 assert.deepEqual(selos(root,lang),[]);
 const el=root.querySelector('.src-chip .marcador');assert(el);
 el.set_content(t(lang==='pt'?'en':'pt').prov.marcadorDoSelo);
 morde(`selo na outra língua (${lang})`,selos(root,lang),'o selo não está na língua');
}
// O denominador tem de concordar com a coluna da computação e com a unidade.
const {loadClaims}=await import('../../src/lib/ledger.mjs');
function denominador(linhas) {
 const l=linhas.get('evora-prr-execucao-2026'),d=linhas.get(l.derived_from[1]);
 return d.document.computed_over.column==='valor_contratado' && l.derivation.includes('verbas contratadas') && l.unit==='% do valor contratado' ? [] : ['RP4N-g: o rótulo da quota não corresponde ao denominador contratado'];
}
assert.deepEqual(denominador(loadClaims()),[]);
{
 const copia=structuredClone(loadClaims());copia.get('evora-prr-execucao-2026').unit='% do valor aprovado';
 morde('quota contratada rotulada como aprovada',denominador(copia),'o rótulo da quota não corresponde');
}
function paginas(root,lang) {
 return root.querySelectorAll('.def-origem-pagina').flatMap(el=>el.textContent.trim().startsWith(', '+t(lang).prov.paginaDaDefinicao+' ')?[]:[`RP4N-g: a coordenada da definição não diz página na língua ${lang}`]);
}
for(const lang of ['pt','en'])for(const id of ['agua-nao-faturada-portugal-2024','penalizacao-antecipacao-um-ano-neutra']) {
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 assert.deepEqual(paginas(root,lang),[]);
 const el=root.querySelector('.def-origem-pagina');assert(el);
 el.set_content(', '+t(lang==='pt'?'en':'pt').prov.paginaDaDefinicao+' '+el.textContent.match(/\d+/)[0]);
 morde(`página na outra língua (${id}, ${lang})`,paginas(root,lang),'a coordenada da definição');
}
const {NOMES_DO_PROJETO}=await import('../../src/data/nomes-das-medidas.mjs');
function prazo(nomes,linhas) {
 const id='evora-prr-vencido-aprovado-2026',q=linhas.get('evora-prr-vencido-quota-2026');
 return linhas.get(id).document.computed_over.filter.includes('dt_prevista_conclusao') && nomes[id].pt.includes('prazo de conclusão') && nomes[id].en.includes('completion deadline') && q.derivation.includes('prazo de conclusão') && q.derivation_en.includes('completion deadline') ? [] : ['RP4N-g: o nome e a quota não dizem o prazo de conclusão da computação'];
}
assert.deepEqual(prazo(NOMES_DO_PROJETO,loadClaims()),[]);
{
 const nomes={...NOMES_DO_PROJETO,'evora-prr-vencido-aprovado-2026':{pt:'prazo de execução',en:'execution deadline'}};
 morde('prazo de execução em vez de conclusão',prazo(nomes,loadClaims()),'o nome e a quota não dizem');
}
function estudo(root,lang) {
 return root.querySelector(`a[href="/${lang==='pt'?'estudos':'en/studies'}/which-door-is-yours"]`) ? [] : ['RP4N-g: o estudo desapareceu da área depois da retirada das contagens'];
}
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='en'?'en/':''}areas/economia-e-coesao-territorial/index.html`,'utf8'));
 assert.deepEqual(estudo(root,lang),[]);
 const links=root.querySelectorAll('a').filter(a=>a.getAttribute('href')?.includes('/which-door-is-yours'));
 for(const a of links)a.remove();
 morde(`estudo retirado da área (${lang})`,estudo(root,lang),'o estudo desapareceu');
 const pagina=parse(fs.readFileSync(`dist/${lang==='pt'?'estudos':'en/studies'}/which-door-is-yours/index.html`,'utf8'));
 assert(pagina.querySelector('[data-ausencia-atual]'),'o estudo tem de dizer a ausência das contagens');
}
function faixaAgua(linhas) {
 const n=Number(linhas.get('agua-nao-faturada-portugal-2024').value.replace(',','.'));
 return n>20 && n<=30 ? [] : ['RP4N-g: o valor da água não pertence à faixa mediana citada'];
}
assert.deepEqual(faixaAgua(loadClaims()),[]);
{
 const linhas=structuredClone(loadClaims());linhas.get('agua-nao-faturada-portugal-2024').value='20';
 morde('água no limite excluído da faixa mediana',faixaAgua(linhas),'o valor da água não pertence');
}
const {comparaLinhas}=await import('../../src/lib/o-que-e-o-numero.mjs');
const {FAMILIAS_DAS_LINHAS}=await import('../../src/data/o-que-e-das-familias.mjs');
const comparacao=FAMILIAS_DAS_LINHAS['penalizacao-antecipacao-um-ano-neutra'].compara;
for(const lang of ['pt','en']) {
 const {cabecaDoRecibo,conferirCabecaDoRecibo,contextoDasFamilias,reguasDosCartoes}=await import('./familias.mjs');
 const id='penalizacao-antecipacao-um-ano-neutra';
 const c=cabecaDoRecibo(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 const e={ctx:contextoDasFamilias(),cartoes:reguasDosCartoes('dist')};
 assert.deepEqual(conferirCabecaDoRecibo(c,id,lang,e),[]);
 const frase=c.querySelector('[data-o-que-e-parte="o-que-e"]');
 frase.set_content(frase.innerHTML.replace(comparacao[lang].menor,comparacao[lang].maior));
 morde(`lei dita maior que a estimativa (${lang})`,conferirCabecaDoRecibo(c,id,lang,e),'a frase rendida não é');
 const semToken=cabecaDoRecibo(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`,'utf8'));
 semToken.querySelector('[data-o-que-e-parte="o-que-e"] [data-claim]').removeAttribute('data-claim');
 morde(`valor da comparação sem token (${lang})`,conferirCabecaDoRecibo(semToken,id,lang,e),'a comparação não cita as duas linhas');
 for(const [valor,ramo] of [['9','maior'],['8,2','igual'],['6','menor']]) {
  const copia=structuredClone(loadClaims());copia.get(comparacao.a).value=valor;
  assert(comparaLinhas(comparacao,lang,copia).includes(comparacao[lang][ramo]),`a comparação não acompanha ${ramo}`);
 }
}
const {textoSemSelos}=await import('../../scripts/voz-pais.mjs');
for(const lang of ['pt','en']) {
 const root=parse(`<p>Sinopse<span class="marcador-definicao"> · ${t(lang).marcador.definicao}</span></p>`);
 assert.equal(textoSemSelos(root),'Sinopse');
 root.querySelector('.marcador-definicao').set_content('Uma frase intrusa.');
 assert.notEqual(textoSemSelos(root),'Sinopse');
 plantas.push({nome:`glosa alterada na sinopse (${lang})`,mensagem:'RP4N-g: a glosa alterada permanece na comparação da sinopse'});
}
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/penalizacao-antecipacao-um-ano-neutra/index.html`,'utf8'));
 assert.equal(root.querySelectorAll('[data-def-lido]').length,4);
 assert.equal(root.querySelectorAll('[data-def-sem-data]').length,0);
 assert(root.textContent.includes(lang==='pt'?'Sem resposta desde 01.09.2026':'No answer since 01.09.2026'));
}
if(process.argv.includes('--registo-g'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/g/plantas-novas.json',JSON.stringify({plantas},null,2)+'\n');
console.log(`RP4N-g: PASS, ${plantas.length} plantas`);
