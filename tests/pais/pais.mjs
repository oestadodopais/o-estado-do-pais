#!/usr/bin/env node
/** Plantas do B1, peça 3. Só quatro cópias de páginas num diretório temporário.
 * As tabelas mudam apenas na memória do processo filho; o repositório não muda. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { verificaVozPais } from '../../scripts/voz-pais.mjs';
const raiz=fs.mkdtempSync(path.join(os.tmpdir(),'oedp-pais-'));
const pasta=path.join(raiz,'dist');
/* B1c, 22.09.2026: as quatro rotas da peça 3 mais as quatro que «O que mudou»
   passou a atravessar — o registo inteiro, nas duas edições, e a página de um
   lugar com mudanças, que é Évora. Sem elas a régua não vê nenhuma lista de
   lugar nem nenhum registo, e uma régua que não mede nada é verde por engano. */
const rotas=['index.html','en/index.html','temas/index.html','en/themes/index.html',
 'correcoes/index.html','en/corrections/index.html',
 'municipios/evora/index.html','en/municipalities/evora/index.html',
 'estudos/index.html','en/studies/index.html'];
const originais=new Map(rotas.map(f=>[f,fs.readFileSync(path.join('dist',f),'utf8')]));
const resultados=[];
const repor=()=>{for(const [f,s] of originais){const alvo=path.join(pasta,f);fs.mkdirSync(path.dirname(alvo),{recursive:true});fs.writeFileSync(alvo,s);}};
const html=(f,fn)=>{const raiz=parse(fs.readFileSync(path.join(pasta,f),'utf8'));fn(raiz);fs.writeFileSync(path.join(pasta,f),raiz.toString());};
function prova(nome,esperado,preparar=()=>{},antes='') {
 repor();preparar();
 const codigo=`${antes}\nawait import('./scripts/check-pais.mjs');`;
 const r=spawnSync(process.execPath,['--input-type=module','-e',codigo],{encoding:'utf8',env:{...process.env,OEDP_DIST:pasta}});
 const saida=r.stdout+r.stderr;
 const passou=esperado ? r.status===1&&saida.includes(esperado) : r.status===0;
 resultados.push({nome,codigo:r.status,celula:esperado||'todas',passou,saida:saida.trim()});
 if(!passou)throw Error(`${nome}: ${saida}`);
}
try {
 prova('páginas sem estrago',null);
 const card=parse(originais.get('temas/index.html')).querySelector('[data-cartao-medida]').getAttribute('data-cartao-medida');
 prova('medida rendida sem tema declarado','T2',()=>{},`import {DOMINIO_DAS_MEDIDAS} from './src/data/dominios.mjs';delete DOMINIO_DAS_MEDIDAS[${JSON.stringify(card)}];`);
 prova('medida do país no tema errado','T3',()=>html('index.html',r=>r.querySelector('[data-tema]').setAttribute('data-tema','trabalho')));
 prova('medida repetida','T4',()=>html('temas/index.html',r=>{const c=r.querySelector('[data-cartao-medida]');c.insertAdjacentHTML('afterend',c.outerHTML);}));
 prova('medida publicada ausente','T5',()=>html('temas/index.html',r=>r.querySelector('[data-cartao-medida]').remove()));
 prova('mudança sem secção','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';delete MUDANCAS_DO_PROJETO[0].decisao;`);
 prova('mudança com secção inexistente','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';MUDANCAS_DO_PROJETO[0].decisao='0.0';`);
 /* B1c · as três células novas, cada uma com a sua planta, e a C1 e a M3 no
    sítio onde as linhas de correção passaram a viver. A primeira página deixou
    de ter nenhuma: das dezasseis entradas do livro, nenhuma é de uma medida do
    país. */
 prova('linha de outro lugar na página do país','A1',()=>{
  const evora=parse(fs.readFileSync(path.join(pasta,'correcoes/index.html'),'utf8')).querySelector('[data-mudou-registo] li[data-mudanca="correcao"]').outerHTML;
  html('index.html',r=>{const l=r.querySelectorAll('.pais-mudou li');l[l.length-1].remove();r.querySelector('.pais-mudou').insertAdjacentHTML('beforeend',evora);});
 });
 prova('publicação na página do país','A1',()=>{
  const pub=parse(fs.readFileSync(path.join(pasta,'correcoes/index.html'),'utf8')).querySelector('[data-mudou-registo] li[data-mudanca="publicacao"]').outerHTML;
  html('index.html',r=>r.querySelector('.pais-mudou').insertAdjacentHTML('beforeend',pub));
 });
 /* O teto são oito, e a lista do país tem hoje uma linha: a planta tem de a
    repetir até passar o teto, e não uma vez só. */
 prova('mais mudanças do que o teto','A2',()=>html('index.html',r=>{const li=r.querySelector('.pais-mudou li');for(let i=0;i<8;i++)li.insertAdjacentHTML('afterend',li.outerHTML);}));
 prova('registo sem uma das mudanças do livro','A3',()=>html('correcoes/index.html',r=>r.querySelector('[data-mudou-registo] li[data-mudanca="correcao"]').remove()));
 prova('correção que não é uma entrada do livro','C1',()=>html('correcoes/index.html',r=>r.querySelector('[data-mudou-registo] [data-correcao-campo="date"]').setAttribute('data-correcao-n','99')));
 prova('valor antigo igual ao novo numa correção','M3',()=>html('correcoes/index.html',r=>{const li=r.querySelector('[data-mudou-registo] li[data-mudanca="correcao"]');li.querySelector('s[data-correcao-campo="old_value"]').set_content(li.querySelector('[data-correcao-campo="new_value"]').textContent);}));
 prova('mudança de lugar sem o seu lugar','A1',()=>html('municipios/evora/index.html',r=>r.querySelector('.lugar-mudou').setAttribute('data-mudou-ambito','lisboa')));
 /* A passagem de correção de 22.09.2026: a régua deriva o lugar por conta
    própria e compara-o com a declaração, e a A3 confere o lugar escrito e a
    porta de cada linha do registo. */
 prova('declaração do lugar contra a derivação','A1',()=>{},`import {LUGAR_DECLARADO_DAS_LINHAS} from './src/data/lugar-das-linhas.mjs';LUGAR_DECLARADO_DAS_LINHAS['estudos-evora-publicados']='portugal';`);
 prova('porta do registo apontada a outro lugar','A3',()=>html('correcoes/index.html',r=>r.querySelector('[data-mudou-registo] .registo-lugar').setAttribute('href','/municipios/lisboa')));
 /* As duas edições por confirmar são inglesas (os dois estudos da água), e por
    isso a planta do título vive na edição inglesa: é lá que a marca se rende. */
 prova('título por confirmar sem a marca no registo','A4',()=>html('en/corrections/index.html',r=>r.querySelector('[data-mudou-registo] li[data-mudanca="publicacao"] .marcador-de-titulo').remove()));
 /* A DECISÃO DE 22.09.2026: a marca vai a todas as páginas onde o título se
    rende. A planta declara por confirmar uma edição que a primeira página rende
    nos estudos recentes; a página construída não a tem, e a A4 fecha. */
 prova('título por confirmar sem a marca na página do país','A4',()=>{},`import {WORKS} from './src/data/studies.mjs';const w=WORKS.find(w=>w.slug==='evora-2027-prometido-painel-dinheiro');w.editions.find(e=>e.lang==='pt').titleUnverified=true;`);
 /* E um chamador que tente esconder a marca por propriedade: a propriedade não
    existe, e o componente decide na mesma. A planta é a prova de que a decisão
    não é de quem chama — a marca continua na página. */
 prova('marca escondida por propriedade do chamador','A4',()=>html('en/studies/index.html',r=>r.querySelector('[data-estudo-edicao] .marcador-de-titulo').remove()));
 prova('texto da mudança alterado','M2',()=>html('index.html',r=>r.querySelector('[data-mudanca-campo="texto"]').set_content('Uma frase que a direção não escreveu.')));
 prova('ordem dos estudos trocada','E1',()=>html('index.html',r=>{const a=r.querySelectorAll('#trabalhos [data-estudo]');const x=a[0].getAttribute('data-estudo');a[0].setAttribute('data-estudo',a[1].getAttribute('data-estudo'));a[1].setAttribute('data-estudo',x);}));
 prova('comparação europeia sem recibo','L3',()=>html('index.html',r=>r.querySelector('[data-leitura-pais] a[href="/livro-razao/taxa-de-desemprego-2025-ue"]').remove()));
 prova('sexta entrada no menu','N1',()=>html('index.html',r=>r.querySelector('#nav-principal').insertAdjacentHTML('beforeend','<a href="/agenda">Agenda</a>')));
 /* R1, 23.09.2026: as quatro células novas ou mudadas deste bloco, cada uma com a
    sua planta. A M4 recusa a língua do código nas mudanças declaradas (I141); a
    T9 exige a cor do estado nos cartões com referência (I139); a E2 exige a
    lista dos estudos numa só (I144); a L2 exige a data da notificação do INE tal
    como a linha a publica (I147). */
 prova('mudança declarada na língua do código','M4',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';MUDANCAS_DO_PROJETO[0].texto.pt='Sete nomes do INE saíram dos recibos e dos cartões. Nenhum valor mudou.';`);
 prova('cartão fora do valor de referência pintado de dentro','T9',()=>html('temas/index.html',r=>{const q=r.querySelector('[data-regua="referencia"] .sq-fora');q.setAttribute('class','sq sq-dentro');}));
 prova('lista dos estudos com a ordem trocada','E2',()=>html('estudos/index.html',r=>{const a=r.querySelectorAll('main [data-estudo]');const x=a[0].getAttribute('data-estudo');a[0].setAttribute('data-estudo',a[1].getAttribute('data-estudo'));a[1].setAttribute('data-estudo',x);}));
 prova('a secção por lugar de volta','E2',()=>html('en/studies/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<section id="por-lugar"><h2>By place</h2></section>')));
 prova('leitura com outra data da notificação','L2',()=>html('index.html',r=>r.querySelector('[data-leitura-pais] [data-de-campo="published_at"]').set_content('24.09.2026')));
 prova('ponto final sem ligação inseparável','N2',()=>html('index.html',r=>r.querySelector('.rotulo-ia-final').removeAttribute('class')));
 repor();
 if(verificaVozPais(raiz).length)throw Error('A lista fechada não está verde antes da planta.');
 html('index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Esta página explica como se deve ler o projeto.</p>'));
 const voz=verificaVozPais(raiz);
 if(!voz.some(e=>e.includes('lista fechada país')))throw Error('A prosa plantada não foi vista.');
 resultados.push({nome:'frase explicativa fora da lista fechada',codigo:1,celula:'B1 voz',passou:true,saida:voz.join('\n')});
 repor();html('index.html',r=>r.querySelector('[data-leitura-pais]').set_content('Uma leitura diferente.'));
 const leitura=verificaVozPais(raiz);
 if(!leitura.some(e=>e.includes('leitura aprovada')))throw Error('A leitura alterada não foi vista.');
 resultados.push({nome:'leitura aprovada alterada',codigo:1,celula:'B1 leitura',passou:true,saida:leitura.join('\n')});
 const i=process.argv.indexOf('--json');if(i!==-1)fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`OK ${r.nome}: ${r.celula}, código ${r.codigo}`);
}finally{fs.rmSync(raiz,{recursive:true,force:true});}
