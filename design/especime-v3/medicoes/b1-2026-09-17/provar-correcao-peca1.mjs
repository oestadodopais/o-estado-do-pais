import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {spawnSync,execFileSync} from 'node:child_process';import {createRequire} from 'node:module';
const {parse}=createRequire(path.resolve('package.json'))('node-html-parser');
const pasta='design/especime-v3/medicoes/b1-2026-09-17';
const sha=b=>createHash('sha256').update(b).digest('hex');
const resultados=[];const grupo=process.argv[2]??'todos';
function troca(h,selector,editar){const n=parse(h).querySelector(selector);if(!n)throw Error(`Alvo em falta: ${selector}`);const antes=n.outerHTML;editar(n);return h.replace(antes,n.parentNode?n.outerHTML:'');}
function planta(gr,nome,ficheiro,altera,comando,mordida){if(grupo!=='todos'&&grupo!==gr)return;const original=fs.readFileSync(ficheiro);let r;try{const mudado=altera(original.toString());if(mudado===original.toString())throw Error('Planta sem alteração');if(mudado===null)fs.unlinkSync(ficheiro);else fs.writeFileSync(ficheiro,mudado);r=spawnSync('npm',['run',comando],{encoding:'utf8',maxBuffer:64*1024*1024});}finally{fs.writeFileSync(ficheiro,original);}const saida=(r.stdout+r.stderr).replace(/\x1b\[[0-9;]*m/g,'');const passou=r.status!==null&&r.status!==0&&mordida.test(saida)&&sha(fs.readFileSync(ficheiro))===sha(original);fs.writeFileSync(`${pasta}/correcao-planta-${nome}.txt`,`npm run ${comando}\nCódigo: ${r.status}\n${saida}`);resultados.push({grupo:gr,nome,ficheiro,comando,codigo:r.status,mordida:String(mordida),passou,antes:sha(original),reposto:sha(fs.readFileSync(ficheiro))});fs.writeFileSync(`${pasta}/correcao-plantas-${grupo}.json`,JSON.stringify({cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),resultados},null,2)+'\n');console.log(`${nome}: ${r.status}, mordida ${passou}`);if(!passou)throw Error(saida.slice(-4000));}
const estudo='dist/estudos/evora-2027-prometido-painel-dinheiro/index.html';
const recibos='dist/estudos/evora-economia-investidores-portas-abertas-2026/index.html';
planta('6','lingua-en','dist/en/studies/index.html',h=>troca(h,'.estudo-lingua',n=>n.remove()),'check:voz',/B1 língua/);
planta('6','lingua-pt','dist/estudos/index.html',h=>troca(h,'.estudo-lingua',n=>n.innerHTML='(in Portuguese)'),'check:voz',/B1 língua/);
planta('7','recibo-valor',recibos,h=>troca(h,'[data-registo-linha$=".impresso"]',n=>n.innerHTML=n.innerHTML.replace(/\d/,d=>String((+d+1)%10))),'gate:html',/L6 .*campo rendido difere do livro/);
planta('7','recibo-medida','dist/estudos/evora-orcamentado-pago-devido-2025/index.html',h=>troca(h,'[data-registo-linha$=".medida"]',n=>n.innerHTML='Medida trocada'),'gate:html',/L6 .*campo rendido difere do livro/);
planta('7','recibo-fonte',recibos,h=>troca(h,'[data-registo-linha$=".fonte"]',n=>n.innerHTML='Fonte trocada'),'gate:html',/L6 .*campo rendido difere do livro/);
planta('7','recibo-data',recibos,h=>troca(h,'[data-registo-linha$=".verificacao"]',n=>n.setAttribute('datetime','2000-01-01')),'gate:html',/L6 .*data de verificação/);
planta('7','fontes-sem-recibo',estudo,h=>h.replace('</main>','<details id="linhas-do-documento-dobra"><section id="linhas-do-documento"><h2>Fontes e verificação</h2></section></details></main>'),'gate:html',/L6 .*sem recibos completos/);
planta('7','algarismo-transcrito',estudo,h=>troca(h,'.texto-figura',n=>n.innerHTML=n.innerHTML.replace(/\d/,d=>String((+d+1)%10))),'check:cadeia',/C[45]/);
planta('10','ia-topo',estudo,h=>troca(h,'[data-rotulo-ia="topo"]',n=>n.remove()),'gate:html',/0 rótulo\(s\) de IA no topo e devia ter 1/);
planta('11','destino-servidor','vercel.json',h=>{const d=JSON.parse(h);d.routes.find(r=>r.status===301).headers.Location='/estudos/onde-esta-a-agua/';return JSON.stringify(d,null,2)+'\n';},'gate:html',/B1 redirecionamento/);
planta('12','lugar-en','dist/en/municipalities/evora/index.html',h=>troca(h,'.mun-estudos a',n=>n.remove()),'gate:html',/B1 contagem do lugar|estudos_lugar_evora/);
planta('12','lugar-inexistente','dist/en/municipalities/evora/index.html',()=>null,'gate:html',/B1 contagem do lugar: não foi possível ler/);
planta('12','lugar-sem-seccao','dist/en/municipalities/evora/index.html',h=>troca(h,'#trabalhos',n=>n.removeAttribute('id')),'gate:html',/B1 contagem do lugar: .*não tem a secção/);
planta('14','leitura-titulo',estudo,h=>troca(h,'.estudo-leitura h2',n=>n.innerHTML='Outro título'),'gate:html',/B1 leitura/);
planta('14','leitura-fronteira',estudo,h=>troca(h,'.estudo-leitura',n=>n.setAttribute('class','texto-artigo estudo-texto')),'gate:html',/B1 leitura/);
planta('17','subir-palavra',estudo,h=>troca(h,'.texto-secao-topo',n=>n.innerHTML='As regras da casa.'),'check:voz',/a casa/i);
planta('17','posicao-palavra',estudo,h=>troca(h,'[data-registo-posicao]',n=>n.innerHTML='As regras da casa.'),'check:voz',/a casa/i);
planta('9','porta-fora-transcrito',estudo,h=>h.replace('</main>','<a href="/metodo#politica-de-ia">Método</a></main>'),'check:lugar',/L1 .*acima do teto/s);
planta('9','transcricao-fora-estudo','dist/a-verificar/index.html',h=>h.replace('</main>','<p data-registo-unidade="planta"><a href="/estudos/onde-esta-a-agua">um</a><a href="/estudos/onde-esta-a-agua">dois</a></p></main>'),'check:lugar',/L1 .*acima do teto/s);
planta('9','teto-sem-medicao','scripts/lugar-tetos-b1.json',h=>{const d=JSON.parse(h);d.l1_paginas++;return JSON.stringify(d,null,2)+'\n';},'check:lugar',/B1 L1: o teto tem de ser o número inteiro medido/);

planta('19','separador-quebravel',estudo,h=>{const n=parse(h).querySelectorAll('.texto-figura').find(n=>/\d\u00a0\d/.test(n.textContent));if(!n)throw Error('Sem milhares para a planta');return h.replace(n.outerHTML,n.outerHTML.replace(/\u00a0/,' '));},'check:cadeia',/C5/);
planta('10','ia-linha-partida','dist/estudos/evora-prometido-pago-auditado-2026/index.html',h=>h.replace('</head>','<style>.rotulo-ia-topo .rotulo-ia-linha{white-space:normal!important;width:90px!important}</style></head>'),'check:alvos',/✗\s+H14/);
console.log(`${resultados.length} plantas repostas e recusadas.`);
