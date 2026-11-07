/** VOZ-2A: a isenção é por estudo; arquivo e factos declarados conservam-se. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {medirPagina,EXCECOES,ISENCAO_VOZ2} from '../../scripts/voz-autorreferencia.mjs';
const lista=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json','utf8'));
const slug='evora-2027-capital-europeia-da-cultura',rota='/estudos/'+slug+'/documento';
const sai=lista.find(f=>f.estudo===slug&&f.classe==='SAI'&&f.lingua==='pt');
const pagina=f=>`<main><p>${f}</p></main>`;
assert(medirPagina(pagina(sai.frase),rota).frases.length,'SAI reposta tem de dar vermelho');
for(const classe of ['texto-artigo estudo-leitura','texto-sumario','estudo-sumario'])assert(medirPagina(`<main><section class="${classe}"><p data-registo-unidade="planta">${sai.frase}</p></section></main>`,'/estudos/'+slug).frases.length,'SAI na leitura ou no sumário tem de dar vermelho');
for(const nome of ['Research Hub','ResearchHub'])assert(medirPagina(pagina(nome),rota).protecao.length,'Nome reposto tem de dar vermelho');
const fica=EXCECOES.find(e=>e.rota===rota);
assert(fica);assert.equal(medirPagina(pagina(fica.frase),rota).frases.length,0);
const i=EXCECOES.indexOf(fica);EXCECOES.splice(i,1);
try{assert(medirPagina(pagina(fica.frase),rota).frases.length,'FICA sem exceção tem de dar vermelho');}finally{EXCECOES.splice(i,0,fica);}
assert.equal(medirPagina(pagina('Research Hub. '+sai.frase),rota+'/2026-10-01').protecao.length,0);
assert(medirPagina(pagina(sai.frase),rota+'/2026-10-01').isenta);
assert.equal(ISENCAO_VOZ2.estudos.length,11);
for(const s of ISENCAO_VOZ2.estudos){const r='/estudos/'+s+'/documento';assert(medirPagina(pagina(sai.frase),r).isenta);assert.equal(medirPagina(pagina('Research Hub'),r).protecao.length,0);assert(medirPagina(pagina('Research Hub'),'/estudos/'+s).protecao.length,'A página do estudo continua coberta pela régua do nome');}
assert.equal(medirPagina('<style>/* Research Hub house style */</style><p>Fonte.</p>',rota).protecao.length,0);
console.log('VOZ-2A: SAI, dois nomes e FICA sem exceção recusados; arquivo, onze estudos e comentário style conservados.');
