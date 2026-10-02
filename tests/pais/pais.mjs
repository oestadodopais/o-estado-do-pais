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
/* PP1, 28.09.2026: e as dez páginas das entradas, onde o `check:pais` passou a correr a T9 e os blocos.
   P4, 02.10.2026: as entradas leem-se da declaração. A lista escrita à mão ficou nos endereços de antes do N1
   (30.09.2026: `/o-meu-dinheiro/` passou a `/precos/`, e as outras com ele), e o executor rebentava na primeira
   leitura, antes de qualquer planta; são agora as catorze páginas das sete entradas com página própria. */
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';
const rotasDasEntradas=ENTRADAS.filter(e=>!e.existente).flatMap(e=>[e.rota.pt,e.rota.en]).map(r=>`${r.replace(/^\//,'').replace(/\/$/,'')}/index.html`);
const rotas=['index.html','en/index.html','temas/index.html','en/themes/index.html',
 'correcoes/index.html','en/corrections/index.html',
 'municipios/evora/index.html','en/municipalities/evora/index.html',
 'estudos/index.html','en/studies/index.html',
 /* P4: «Lugares», que a conferência das entradas do `check:pais` lê desde o N1 (o cartão das câmaras vive lá). */
 'lugares/index.html','en/places/index.html',
 ...rotasDasEntradas];
/* P4, 02.10.2026: e as folhas construídas, que a N3 lê uma vez por corrida (nenhuma consulta à preferência escura
   do sistema, e a paleta escura no seletor da escolha do leitor). */
const folhas=fs.readdirSync(path.join('dist','_astro')).filter(f=>f.endsWith('.css')).map(f=>`_astro/${f}`);
/* E os dois ficheiros do mapa do sítio, que a E5 das entradas lê desde o PP1b. */
const mapasDoSitio=fs.readdirSync('dist').filter(f=>/^sitemap.*\.xml$/.test(f));
const originais=new Map([...rotas,...folhas,...mapasDoSitio].map(f=>[f,fs.readFileSync(path.join('dist',f),'utf8')]));
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
 /* P4, 02.10.2026: desde o N1 (30.09.2026) os cartões vivem nas páginas das entradas e não na dos temas, e as
    células T1 a T8 passaram à célula E das entradas; as cinco plantas abaixo procuravam cartões na página dos temas e
    rebentavam antes de correr. Passam ao sítio onde os cartões vivem, com a queixa que a célula de hoje dá. */
 const card=parse(originais.get('precos/index.html')).querySelector('[data-cartao-medida]').getAttribute('data-cartao-medida');
 prova('medida rendida sem tema declarado','E2',()=>{},`import {DOMINIO_DAS_MEDIDAS} from './src/data/dominios.mjs';delete DOMINIO_DAS_MEDIDAS[${JSON.stringify(card)}];`);
 /* PP1: os cartões saíram da primeira página, e a T3 corre na página dos temas. */
 prova('medida do país no assunto errado','E3',()=>html('estado-e-economia/index.html',r=>{const c=r.querySelector('main [data-cartao-medida]');r.querySelector('main').insertAdjacentHTML('beforeend',c.outerHTML);c.remove();}));
 prova('medida repetida','E3',()=>html('precos/index.html',r=>{const c=r.querySelector('main [data-cartao-medida]');c.insertAdjacentHTML('afterend',c.outerHTML);}));
 prova('medida publicada ausente','E1',()=>html('en/prices/index.html',r=>r.querySelector('main [data-cartao-medida]').remove()));
 prova('mudança sem secção','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';delete MUDANCAS_DO_PROJETO[0].decisao;`);
 prova('mudança com secção inexistente','M1',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';MUDANCAS_DO_PROJETO[0].decisao='0.0';`);
 /* B1c · as três células novas, cada uma com a sua planta, e a C1 e a M3 no
    sítio onde as linhas de correção passaram a viver. A primeira página deixou
    de ter nenhuma: das dezasseis entradas do livro, nenhuma é de uma medida do
    país. */
 /* PP1, 28.09.2026: A LISTA DAS MUDANÇAS SAIU DA PRIMEIRA PÁGINA, e a porta «O que mudou» leva ao
    registo. As plantas da A1 e da A2 que estragavam a lista do país passam à lista de um lugar, que é
    onde elas continuam a morder, e a C2 ganha a planta da lista de volta à primeira página. */
 prova('lista das mudanças de volta à primeira página','C2',()=>html('index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<ul class="pais-mudou" data-mudou-ambito="pais"></ul>')));
 prova('publicação na lista de um lugar','A1',()=>{
  const pub=parse(fs.readFileSync(path.join(pasta,'correcoes/index.html'),'utf8')).querySelector('[data-mudou-registo] li[data-mudanca="publicacao"]').outerHTML;
  html('municipios/evora/index.html',r=>r.querySelector('.lugar-mudou').insertAdjacentHTML('beforeend',pub));
 });
 /* O teto são oito: a planta repete a primeira linha da lista de Évora até passar o teto. */
 prova('mais mudanças do que o teto','A2',()=>html('municipios/evora/index.html',r=>{const li=r.querySelector('.lugar-mudou li');for(let i=0;i<9;i++)li.insertAdjacentHTML('afterend',li.outerHTML);}));
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
 /* PP1: a mudança declarada rende-se no registo, e é a A3 que confere o texto dela. */
 prova('texto da mudança alterado','A3',()=>html('correcoes/index.html',r=>r.querySelector('[data-mudou-registo] [data-mudanca-campo="texto"]').set_content('Uma frase que a direção não escreveu.')));
 prova('ordem dos estudos trocada','E1',()=>html('index.html',r=>{const a=r.querySelectorAll('#trabalhos [data-estudo]');const x=a[0].getAttribute('data-estudo');a[0].setAttribute('data-estudo',a[1].getAttribute('data-estudo'));a[1].setAttribute('data-estudo',x);}));
 /* PP1: a leitura do país saiu, e o que a L3 protegia (o recibo de cada número) passou aos blocos. */
 prova('número de um bloco sem recibo','B1',()=>html('index.html',r=>r.querySelector('[data-bloco="trabalho"] [data-bloco-numero="taxa-de-emprego-2025"] a.src-chip').remove()));
 /* P4, 02.10.2026: o menu tem seis portas; a planta de uma porta a mais passa a ser a sétima, e a da porta da União
    tirada prova que a sexta é exigida. */
 prova('sétima entrada no menu','N1',()=>html('index.html',r=>r.querySelector('#nav-principal').insertAdjacentHTML('beforeend','<a href="/agenda">Agenda</a>')));
 prova('a porta da União tirada do menu','N1',()=>html('en/index.html',r=>r.querySelector('#nav-principal a[href="/en/european-union"]').remove()));
 /* P4, 02.10.2026: a N3 inverteu-se (o claro por omissão, o escuro só pela escolha do leitor), e cada coisa que ela
    exige tem a sua planta. */
 prova('a página servida já com o escuro','N3',()=>html('index.html',r=>r.querySelector('html').setAttribute('data-theme','dark')));
 prova('o comando do tema tirado do cabeçalho','N3',()=>html('temas/index.html',r=>r.querySelector('header [data-tema-controlo]').remove()));
 prova('o comando do tema servido à vista, sem guião','N3',()=>html('estudos/index.html',r=>r.querySelector('header [data-tema-controlo]').removeAttribute('hidden')));
 prova('a guarda do tema a seguir o sistema','N3',()=>html('en/themes/index.html',r=>{const s=r.querySelectorAll('head script:not([src])').find(x=>x.textContent.includes('data-theme'));s.set_content("(function(){if(matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark')}})()");}));
 prova('o guião adiado do tema tirado','N3',()=>html('correcoes/index.html',r=>r.querySelector('script[src="/js/tema.js"]').remove()));
 prova('uma folha com o escuro pela preferência do sistema','N3',()=>{const f=path.join(pasta,folhas[0]);fs.writeFileSync(f,fs.readFileSync(f,'utf8')+'@media (prefers-color-scheme:dark){:root{--paper:#15171a}}');});
 /* R1, 23.09.2026: as quatro células novas ou mudadas deste bloco, cada uma com a
    sua planta. A M4 recusa a língua do código nas mudanças declaradas (I141); a
    T9 exige a cor do estado nos cartões com referência (I139); a E2 exige a
    lista dos estudos numa só (I144); a L2 exige a data da notificação do INE tal
    como a linha a publica (I147). */
 prova('mudança declarada na língua do código','M4',()=>{},`import {MUDANCAS_DO_PROJETO} from './src/data/mudancas-do-projeto.mjs';MUDANCAS_DO_PROJETO[0].texto.pt='Sete nomes do INE saíram dos recibos e dos cartões. Nenhum valor mudou.';`);
 prova('cartão fora do valor de referência pintado de dentro','T9',()=>html('estado-e-economia/index.html',r=>{const q=r.querySelector('[data-regua="referencia"] .sq-fora');q.setAttribute('class','sq sq-dentro');}));
 prova('lista dos estudos com a ordem trocada','E2',()=>html('estudos/index.html',r=>{const a=r.querySelectorAll('main [data-estudo]');const x=a[0].getAttribute('data-estudo');a[0].setAttribute('data-estudo',a[1].getAttribute('data-estudo'));a[1].setAttribute('data-estudo',x);}));
 prova('a secção por lugar de volta','E2',()=>html('en/studies/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<section id="por-lugar"><h2>By place</h2></section>')));
 /* PP1: a data da notificação do INE vive na peça do bloco da dívida, e a célula dos blocos compara-a. */
 prova('bloco com outra data da notificação','B1',()=>html('index.html',r=>r.querySelector('[data-bloco="estado"] [data-de-campo="published_at"]').set_content('24.09.2026')));
 prova('ponto final sem ligação inseparável','N2',()=>html('index.html',r=>r.querySelector('.rotulo-ia-final').removeAttribute('class')));
 repor();
 if(verificaVozPais(raiz).length)throw Error('A lista fechada não está verde antes da planta.');
 html('index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Esta página explica como se deve ler o projeto.</p>'));
 const voz=verificaVozPais(raiz);
 if(!voz.some(e=>e.includes('lista fechada país')))throw Error('A prosa plantada não foi vista.');
 resultados.push({nome:'frase explicativa fora da lista fechada',codigo:1,celula:'B1 voz',passou:true,saida:voz.join('\n')});
 /* PP1: a leitura aprovada saiu; um bloco só sai da lista fechada conferido, e um bloco estragado fica
    nela, com a sua prosa medida como qualquer outra. */
 repor();html('index.html',r=>{const f=r.querySelector('[data-bloco="pobreza"] [data-bloco-frase]');f.set_content(f.innerHTML.replace('era menor','era bem menor'));});
 const bloco=verificaVozPais(raiz);
 if(!bloco.some(e=>e.includes('lista fechada país')))throw Error('O bloco estragado não foi visto.');
 resultados.push({nome:'frase de um bloco alterada',codigo:1,celula:'B1 voz',passou:true,saida:bloco.join('\n')});
 const i=process.argv.indexOf('--json');if(i!==-1)fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
 for(const r of resultados)console.log(`OK ${r.nome}: ${r.celula}, código ${r.codigo}`);
}finally{fs.rmSync(raiz,{recursive:true,force:true});}
