#!/usr/bin/env node
/** Plantas dos portões que mudaram de forma e dos dois bloqueios P.
 * Correr sem outra leitura de dist/ em paralelo. Cada alteração é reposta
 * byte a byte num finally, e os resumos ficam no registo. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { routePath } from '../../src/lib/routes.mjs';
import { t } from '../../src/i18n/strings.mjs';
/* A pasta das provas é a do bloco que as corre: por omissão a da peça 3, que
   foi quem escreveu este ficheiro, e `OEDP_MEDICOES` manda-as para outra sem
   tocar nos registos dessa (B1c, 22.09.2026). */
const pasta=process.env.OEDP_MEDICOES ?? 'design/especime-v3/medicoes/b1-2026-09-22';
const sha=s=>createHash('sha256').update(s).digest('hex');
const registos=[];
const indice=process.argv.indexOf('--only');
const apenas=indice===-1 ? null : process.argv[indice+1];
function planta(nome,script,alteracoes,mordidas) {
 if(apenas && nome!==apenas)return;
 const originais=new Map(alteracoes.map(([f])=>[f,fs.readFileSync(path.join('dist',f),'utf8')]));
 let r;
 try {
  for(const [f,fn] of alteracoes){const raiz=parse(originais.get(f));fn(raiz);const texto=raiz.toString();if(texto===originais.get(f))throw Error(`${nome}: a planta não mudou ${f}`);fs.writeFileSync(path.join('dist',f),texto);}
  r=spawnSync(process.execPath,[script],{encoding:'utf8',maxBuffer:64*1024*1024});
 }finally{for(const [f,s] of originais)fs.writeFileSync(path.join('dist',f),s);}
 const saida=r.stdout+r.stderr;
 fs.writeFileSync(path.join(pasta,`planta-${nome}.log`),saida);
 const ficheiros=[...originais].map(([f,s])=>({ficheiro:`dist/${f}`,antes:sha(s),reposto:sha(fs.readFileSync(path.join('dist',f)))}));
 const passou=r.status===1&&mordidas.every(re=>re.test(saida))&&ficheiros.every(f=>f.antes===f.reposto);
 const registo={nome,comando:`node ${script}`,codigo:r.status,mordidas:mordidas.map(re=>re.source),passou,ficheiros};registos.push(registo);
 fs.writeFileSync(path.join(pasta,apenas ? `plantas-portoes-${apenas}.json` : 'plantas-portoes.json'),JSON.stringify(registos,null,2)+'\n');
 console.log(`${passou?'OK':'FALHA'} ${nome}: código ${r.status}`);
 if(!passou)throw Error(`${nome}: a planta não teve todas as mordidas previstas. Ver o registo.`);
}
planta('mapa-atribuicao','scripts/check-mapa.mjs',[
 ['index.html',r=>r.querySelector('.mapa-linha').remove()]
],[/R6/]);
/* B1c, 22.09.2026: a unidade de uma correção mudou de página com as linhas de
   correção. A primeira página ficou sem nenhuma — das dezasseis entradas do
   livro nenhuma é de uma medida do país — e o registo ficou com todas, e é lá
   que esta planta a troca agora. A data de publicação continua a plantar-se na
   primeira página, que continua a rendê-las. */
planta('html','scripts/gate-html.mjs',[
 ['index.html',r=>r.querySelector('[data-publicacao-estudo]').set_content('01.01.2000')],
 ['correcoes/index.html',r=>r.querySelector('[data-correcao-entrada] [data-linha-campo="unit"]').set_content('unidade de correção plantada')],
 ['en/index.html',r=>r.querySelector('[data-leitura-pais] [data-claim="divida-publica-2024"]').set_content('93.5')],
 ['temas/index.html',r=>{r.querySelector('[data-linha-campo="unit"]').set_content('unidade plantada');r.querySelector('[data-regua][data-selo-em]').setAttribute('data-selo-em','precos-da-habitacao-2025');}]
],[/B1 mudança: campo rendido difere/,/93\.5/,/unidade plantada/,/unidade de correção plantada/,/sem selo para a sua própria linha/]);
/* A LISTA DE ROTAS DAS MUDANÇAS CONTINUA A MORDER: a marca da data de
   publicação numa rota que não é a primeira página nem o registo fecha a
   construção, como fechava quando só a primeira página a podia ter. */
planta('html-mudanca-fora-de-rota','scripts/gate-html.mjs',[
 ['temas/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p><time datetime="2026-09-16" data-publicacao-estudo="evora-2027-prometido-painel-dinheiro/pt">16.09.2026</time></p>')]
],[/B1 mudança: campo fora da página do país e do registo/]);
planta('datas','scripts/check-datas.mjs',[
 ['index.html',r=>r.querySelector('#trabalhos time').set_content('01.01.2000')]
],[/data|1b/i]);
planta('lugar','scripts/check-lugar.mjs',[
 ['index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend',`<p>${t('pt').identidade}</p>`)],
 ['temas/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<a href="/agenda">Agenda</a><a href="/agenda">Agenda</a>')]
],[/L1 .*ACIMA DO TETO/,/L4 .*ACIMA DO TETO/]);
planta('voz','scripts/check-voz.mjs',[
 ['index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Esta página explica a média europeia.</p>')]
],[/B1 lista fechada país/,/FRASE DA CLASSE POR PROVAR/]);
planta('feixe-porta','scripts/design-bundle.mjs',[
 ['index.html',r=>r.querySelector('.pais-porta-lugares').remove()]
],[/perdeu a porta dos lugares/]);
const europa=routePath('uniaoEuropeia','pt').slice(1)+'/index.html';
planta('feixe-estados','scripts/design-bundle.mjs',[
 [europa,r=>r.querySelectorAll('.cartao[data-estado="fora"]').forEach(c=>c.remove())]
],[/dois estados pintados|não encontrei um cartão fora/]);
