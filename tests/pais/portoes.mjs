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
import { getClaim } from '../../src/lib/ledger.mjs';
/* A pasta das provas é a do bloco que as corre: por omissão a da peça 3, que
   foi quem escreveu este ficheiro, e `OEDP_MEDICOES` manda-as para outra sem
   tocar nos registos dessa (B1c, 22.09.2026). */
const pasta=process.env.OEDP_MEDICOES ?? 'design/especime-v3/medicoes/b1-2026-09-22';
const sha=s=>createHash('sha256').update(s).digest('hex');
const registos=[];
const indice=process.argv.indexOf('--only');
const apenas=indice===-1 ? null : process.argv[indice+1];
/* `--prefixo r1-` corre só as plantas de um bloco e escreve-as num ficheiro
   dele, `plantas-portoes-r1.json` (bloco R1, 23.09.2026). */
const indicePrefixo=process.argv.indexOf('--prefixo');
const prefixo=indicePrefixo===-1 ? null : process.argv[indicePrefixo+1];
/* `--lista a,b,c` corre só as plantas nomeadas, numa corrida, e escreve-as em `plantas-portoes-lista.json`
   (bloco PP1, 28.09.2026: as plantas que o bloco mudou de sítio e as suas, de uma vez). */
const indiceLista=process.argv.indexOf('--lista');
const lista=indiceLista===-1 ? null : new Set(process.argv[indiceLista+1].split(','));
function planta(nome,script,alteracoes,mordidas) {
 if(apenas && nome!==apenas)return;
 if(prefixo && !nome.startsWith(prefixo))return;
 if(lista && !lista.has(nome))return;
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
 fs.writeFileSync(path.join(pasta,apenas ? `plantas-portoes-${apenas}.json` : prefixo ? `plantas-portoes-${prefixo.replace(/-$/,'')}.json` : lista ? 'plantas-portoes-lista.json' : 'plantas-portoes.json'),JSON.stringify(registos,null,2)+'\n');
 console.log(`${passou?'OK':'FALHA'} ${nome}: código ${r.status}`);
 if(!passou)throw Error(`${nome}: a planta não teve todas as mordidas previstas. Ver o registo.`);
}
planta('mapa-atribuicao','scripts/check-mapa.mjs',[
 ['index.html',r=>r.querySelector('.mapa-linha').remove()]
],[/R6/]);
/* B1c, 22.09.2026: a unidade de uma correção mudou de página com as linhas de
   correção. A primeira página ficou sem nenhuma — das dezasseis entradas do
   livro nenhuma é de uma medida do país — e o registo ficou com todas, e é lá
   que esta planta a troca agora. A data de publicação passou a plantar-se lá
   pela mesma razão: as publicações saíram da primeira página na passagem da
   tarde de 22.09.2026, e o registo é onde elas vivem. */
planta('html','scripts/gate-html.mjs',[
 ['correcoes/index.html',r=>{r.querySelector('[data-publicacao-estudo]').set_content('01.01.2000');r.querySelector('[data-correcao-entrada] [data-linha-campo="unit"]').set_content('unidade de correção plantada');}],
 /* PP1, 28.09.2026: a leitura do país saiu; o valor trocado passa a ser o primeiro da frase de um bloco de
    «O que se passa» (o dos preços: a frase do bloco da dívida não traz valores, só os períodos). */
 ['en/index.html',r=>r.querySelector('[data-bloco="precos"] [data-bloco-frase] [data-claim]').set_content('93.5')],
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
/* L2a (01.10.2026): o mapa saiu da primeira página e a porta dele com ele; o feixe exige agora o sinal
   na porta «Lugares» do índice, e esta planta tira-o. */
planta('feixe-porta','scripts/design-bundle.mjs',[
 ['index.html',r=>r.querySelector('[data-sinal-dos-lugares]').remove()]
],[/perdeu o sinal do mapa/]);
/* A PEÇA DA CORREÇÃO NO FEIXE CONTINUA A MORDER (B1c): o feixe deixou de a ler
   por `.log-linha`, que saiu com a tabela de quatro colunas, e passou a lê-la
   pela linha de correção da lista única. Sem uma, fecha. */
planta('feixe-correcao','scripts/design-bundle.mjs',[
 ['correcoes/index.html',r=>r.querySelectorAll('.registo-mudanca[data-mudanca="correcao"]').forEach(l=>l.remove())]
],[/não encontrei ".registo-mudanca/]);
/* A CATRACA L1 NÃO CONTA A PORTA DE UM MARCADOR OBRIGATÓRIO (B1c, 22.09.2026).
   O desconto vive na classe `marcador-de-titulo`: tirá-la faz das duas marcas
   do arquivo inglês duas portas comuns para `/en/to-verify`, e a catraca sobe
   acima do teto. É a prova de que o desconto é o que segura o teto, e não a
   sorte. */
planta('lugar-marcador-de-titulo','scripts/check-lugar.mjs',[
 ['en/studies/index.html',r=>r.querySelectorAll('a.marcador-de-titulo').forEach(a=>a.setAttribute('class','marcador'))]
],[/L1 .*ACIMA DO TETO/]);
const europa=routePath('uniaoEuropeia','pt').slice(1)+'/index.html';
planta('feixe-estados','scripts/design-bundle.mjs',[
 [europa,r=>r.querySelectorAll('.cartao[data-estado="fora"]').forEach(c=>c.remove())]
],[/dois estados pintados|não encontrei um cartão fora/]);
/* R1, 23.09.2026 · as células novas ou mudadas do bloco, cada uma com a sua
   planta, e cada planta com a mordida que a falha esperada tem de casar. */
/* O título do recibo sem o espaço entre o valor e a unidade (I143). */
planta('r1-titulo-do-recibo-colado','scripts/gate-html.mjs',[
 ['livro-razao/mourao-desemprego-registado-2025-12/index.html',r=>{const h=r.querySelector('h1.linha-valor');h.childNodes.filter(n=>n.nodeType===3&&!n.rawText.trim()).forEach(n=>h.removeChild(n));}]
],[/cola o valor à unidade/]);
/* O rótulo de IA de volta ao rodapé, numa página que não é de estudo (I145). */
planta('r1-rotulo-no-rodape','scripts/gate-html.mjs',[
 ['temas/index.html',r=>r.querySelector('[data-rotulo-ia="topo"]').setAttribute('data-rotulo-ia','rodape')]
],[/rótulo\(s\) de IA no topo; tem de ter exactamente um/,/no rodapé e tem de ter zero/]);
/* O rótulo de IA depois do título, numa página de concelho (I145). */
planta('r1-rotulo-depois-do-titulo','scripts/gate-html.mjs',[
 ['municipios/mourao/index.html',r=>{const x=r.querySelector('[data-rotulo-ia="topo"]');const h=r.querySelector('main h1');const copia=x.outerHTML;x.remove();h.insertAdjacentHTML('afterend',copia);}]
],[/não é a primeira coisa do «<main>»/,/vem depois do título da página/]);
/* Uma mudança declarada com um valor que não é o da linha (I147). */
/* PP1: a lista das mudanças saiu da primeira página; a mudança declarada vive no registo. */
planta('r1-mudanca-com-valor-trocado','scripts/gate-html.mjs',[
 ['correcoes/index.html',r=>r.querySelector('[data-mudanca-id="notificacao-ine-divida-2026-09-23"] [data-claim]').set_content('89,3')]
],[/B1 mudança: campo rendido difere/]);
/* A frase da frescura num cartão cuja linha não está atrasada, e a que falta no
   que está (I146). */
planta('r1-frescura-num-cartao-sem-atraso','scripts/check-formas.mjs',[
 ['municipios/mourao/index.html',r=>{const c=r.querySelectorAll('[data-cartao-medida]').find(c=>!c.querySelector('[data-frescura]'));c.querySelector('.cartao-medida-valor').insertAdjacentHTML('beforeend','<span data-frescura="iefp-desemprego-registado-concelhos">(a fonte já publicou)</span>');}]
],[/não está numa série atrasada \(F17\)/]);
planta('r1-frescura-que-falta','scripts/check-formas.mjs',[
 ['municipios/mourao/index.html',r=>r.querySelector('[data-frescura]').remove()]
],[/frase\(s\) da frescura; tem de ter uma \(F17\)/]);
/* A porta da política repetida FORA do rótulo continua a contar na L1: a
   dispensa é do destino exato e só dentro do rótulo (I145). */
planta('r1-porta-da-politica-fora-do-rotulo','scripts/check-lugar.mjs',[
 ['temas/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p><a href="/metodo#politica-de-ia">Método</a> <a href="/metodo#politica-de-ia">Método</a></p>')]
],[/L1 .*ACIMA DO TETO/]);
/* Uma sinopse da lista dos estudos com uma palavra trocada, na entrada de um
   estudo de Évora cuja leitura traz sufixos da leitura (I144). A lista passou
   a conferir cada sinopse inteira, pela conta da primeira página. */
planta('r1-sinopse-da-lista-trocada','scripts/check-voz.mjs',[
 ['estudos/index.html',r=>{const t=r.querySelector('[data-estudo="evora-prometido-pago-auditado-2026"] .estudo-resumo').childNodes.find(n=>n.nodeType===3&&n.rawText.includes('universidade'));t.textContent=t.rawText.replace('universidade','faculdade');}]
],[/B1 sinopse lista: estudos: evora-prometido-pago-auditado-2026/]);
/* A lista dos estudos com uma entrada a menos: a coleção das «linhas» da lista
   passou a ser todos os estudos nas duas edições (I144), e uma lista mais curta
   do que o arquivo fecha a construção. */
planta('r1-lista-dos-estudos-sem-um','scripts/check-lugar.mjs',[
 ['estudos/index.html',r=>r.querySelector('[data-estudo="evora-prometido-pago-auditado-2026"]').remove()]
],[/a régua viu 25 «linhas» em dist\/, e o registo dos estudos diz 26/,/B1 cobertura: evora-prometido-pago-auditado-2026 não é alcançável de \/estudos/]);
/* Dois rótulos de IA no topo da mesma página (passagem de correção do R1,
   23.09.2026, achado 6). As plantas acima mudavam o rótulo de lugar ou tiravam-no
   do topo, e nenhuma punha dois: uma célula que só recusasse «menos de um»
   passava por todas. O rótulo da página dos temas vai outra vez para o lado dele,
   e a célula tem de dizer que são 2 e que tem de ser exactamente um. */
planta('r1-rotulo-dobrado','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{const x=r.querySelector('[data-rotulo-ia="topo"]');x.insertAdjacentHTML('afterend',x.outerHTML);}]
],[/temas\/index\.html[\s\S]*esta página tem 2 rótulo\(s\) de IA no topo; tem de ter exactamente um/]);

/* B2: as três contagens são recusadas pelo portão que as reconta do livro. */
/* PP1: o cartão das câmaras saiu da primeira página com os cartões, e vive na página dos temas. */
planta('b2-contagens-das-camaras','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{for(const chave of ['camaras_acima_do_limite','camaras_dentro_do_limite','camaras_sem_valor']){const n=r.querySelector(`[data-cartao-camaras] [data-prova="${chave}"]`);n.set_content(String(Number(n.textContent)+1));}}]
],[/o número da prova "camaras_acima_do_limite" foi renderizado/,/o número da prova "camaras_dentro_do_limite" foi renderizado/,/o número da prova "camaras_sem_valor" foi renderizado/]);

/* B2: a integração do invólucro valor + unidade passa pelo auditaSelo real.
   As funções puras têm plantas próprias; estas removem, trocam e afastam
   selos nas páginas construídas e correm o portão completo. */
planta('b2-selo-do-cartao','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  r.querySelector('[data-cartao-medida="divida-publica-2025"] .src-chip').remove();
  r.querySelector('[data-cartao-medida="saldo-das-administracoes-publicas-2025"] .src-chip').setAttribute('href','/livro-razao/divida-publica-2025');
 }],
 ['municipios/mourao/index.html',r=>r.querySelector('[data-cartao-medida="mourao-divida-dgal-2024"] .src-chip').remove()],
 ['en/themes/index.html',r=>{
  const c=r.querySelector('[data-cartao-medida="precos-da-habitacao-2025"]');
  const selo=c.querySelector('.src-chip'), copia=selo.outerHTML;selo.remove();
  c.querySelector('.cartao-medida-quantidade').insertAdjacentHTML('beforeend',copia);
 }]
],[/divida-publica-2025" aparece sem selo para a sua própria linha na forma do cartão/,/saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha na forma do cartão/,/precos-da-habitacao-2025" aparece sem selo para a sua própria linha na forma do cartão/,/mourao-divida-dgal-2024" aparece sem selo para a sua própria linha na forma do cartão/]);

/* B2: a cor ficou intacta e só a palavra foi retirada. K15 tem de a ver. */
planta('b2-cartao-cor-sem-palavra','tests/cartao/cartao.mjs',[
 ['temas/index.html',r=>r.querySelector('[data-cartao-medida="divida-publica-2025"] [data-veredicto-referencia] [data-voz]').remove()],
 ['en/european-union/index.html',r=>r.querySelector('[data-cartao="divida-publica-2025"] [data-veredicto-referencia] [data-voz]').remove()]
],[/K15 · divida-publica-2025: veredicto em palavras ausente ou diferente[^\n]* · \/temas\//,/K15 · divida-publica-2025: veredicto em palavras ausente ou diferente[^\n]* · \/en\/european-union\//]);

/* B2: tirar os algarismos provados do inventário não dispensa a conferência
   deles nem pode esconder prosa acrescentada junto da contagem. */
/* PP1: o cartão das câmaras saiu da primeira página; a prosa plantada junto de uma contagem provada
   passa a ir para a frase do veredicto, que é a contagem provada que a primeira página tem. E a frase do
   veredicto saiu do inventário das frases na primeira página (a linha contava as vírgulas da lista das
   medidas fora, e uma revisão de rotina fechava a construção): quem apanha a prosa plantada é a V1, que
   recompõe a frase inteira na mesma corrida do `check:voz`. */
planta('b2-voz-contagem-e-prosa','scripts/check-voz.mjs',[
 ['index.html',r=>{
  const n=r.querySelector('[data-veredicto-pais] [data-prova="painel_fora_do_limiar"]');
  n.set_content(String(Number(n.textContent)+1));
  n.insertAdjacentHTML('afterend',' palavras plantadas junto da contagem');
 }]
],[/V1 pt: painel_fora_do_limiar/,/V1 pt: a frase construída difere/]);

/* L1, 24.09.2026 · a leitura de cada medida. O `auditaSelo` do portão de HTML
   aceita um valor dentro de uma leitura só pela regra do item da régua, e o
   arame da classe do `check:voz` só tira uma leitura depois de a K17 a conferir
   na mesma corrida. Cada uma destas plantas estraga a forma nova numa página
   construída e exige a mordida de sempre. Corre-se com `--prefixo l1-` e
   `OEDP_MEDICOES` a apontar para a pasta das plantas do bloco. */
/* PP1: as leituras dos cartões saíram da primeira página e vivem na página dos temas e nas entradas. */
planta('l1-leitura-sem-selo-em','scripts/gate-html.mjs',[
 ['temas/index.html',r=>r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]').removeAttribute('data-selo-em')]
],[/o valor da afirmação "saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha\./]);
planta('l1-leitura-de-outro-cartao','scripts/gate-html.mjs',[
 ['en/themes/index.html',r=>{const l=r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]');l.setAttribute('data-selo-em','divida-publica-2025');l.setAttribute('data-cartao-leitura','divida-publica-2025');}]
],[/o valor da afirmação "saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha\./]);
planta('l1-leitura-com-linha-alheia','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  const valor=r.querySelector('[data-cartao-medida="divida-publica-2025"] .cartao-medida-quantidade [data-claim="divida-publica-2025"]').textContent;
  const n=r.querySelector('[data-cartao-leitura="racio-s80-s20-2025"] [data-claim="racio-s80-s20-2025"]');
  n.setAttribute('data-claim','divida-publica-2025');n.set_content(valor);
 }]
],[/o valor da afirmação "divida-publica-2025" aparece sem selo para a sua própria linha\./]);
/* PP1: a primeira página deixou de ter cartões. A leitura que a K17 recusa passa a ser a de uma
   entrada, onde o `check:voz` corre a K17; a que sai do cartão para a primeira página continua a ser
   medida pelo arame, e a K17 corre sobre a primeira página sempre que lá houver uma leitura. */
planta('l1-leitura-que-a-k17-recusa','scripts/check-voz.mjs',[
 ['o-estado-e-a-economia/index.html',r=>{const l=r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]');l.set_content(l.innerHTML.replace('receberam mais do que gastaram','receberam muito mais do que gastaram'));}]
],[/K17 · \/o-estado-e-a-economia\/? · saldo-das-administracoes-publicas-2025/]);
planta('l1-leitura-fora-do-cartao','scripts/check-voz.mjs',[
 ['en/index.html',r=>{const l=parse(fs.readFileSync(path.join('dist','en/themes/index.html'),'utf8')).querySelector('[data-cartao-leitura="taxa-de-emprego-2025"]');r.querySelector('main').insertAdjacentHTML('beforeend',l.outerHTML);}]
],[/a K17 recusou-a em \/en\/: K17 · \/en\/: há uma leitura fora de um cartão/,/FRASE DA CLASSE POR PROVAR EM \/en\/ · «Union average»/]);

/* RP1: a transcrição continua certa, mas a linha é de outra medida. */
planta('rp1-regua-de-outra-medida','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  const valor=r.querySelector('[data-cartao-medida="ipc-variacao-homologa"] [data-regua="anterior"] [data-claim]');
  const outra='ipc-alimentacao-variacao-homologa-periodo-anterior';
  valor.setAttribute('data-claim',outra);valor.set_content(String(getClaim(outra).value));
 }]
],[/ipc-alimentacao-variacao-homologa-periodo-anterior.*sem selo|o valor da afirmação "ipc-alimentacao-variacao-homologa-periodo-anterior" aparece sem selo/]);
planta('rp1b-uniao-de-outra-linha','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  const cartao=r.querySelector('[data-cartao-medida="ihpc-variacao-homologa"]');
  const anterior=cartao.querySelector('[data-regua="anterior"] [data-claim]');
  const ue=cartao.querySelector('[data-regua="ue"] [data-claim]');
  ue.setAttribute('data-claim',anterior.getAttribute('data-claim'));
  ue.set_content(anterior.textContent);
 }]
],[/ihpc-variacao-homologa-periodo-anterior.*(?:régua|selo)/]);
planta('rp1b-ressalva-colada','scripts/check-voz.mjs',[
 ['temas/index.html',r=>{
  const m=r.querySelector('[data-cartao-medida="remuneracao-bruta-mensal-media"] .cartao-medida-valor .claim-provisorio');
  m.set_content(m.textContent.trim());
 }]
],[/ressalva sem separador/]);
planta('rp1-fonte-da-pergunta','scripts/check-lugar.mjs',[
 ['livro-razao/ipc-variacao-homologa/index.html',r=>r.querySelector('[data-definicao] [data-def-origem]').remove()]
],[/a origem «rp1-ipc-homologa» não se rende na página/]);
planta('rp1-portas-extra','scripts/check-lugar.mjs',[
 ['temas/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p><a href="/lugares/">Os lugares</a> <a href="/lugares/">Os lugares</a></p>')]
],[/L1 · páginas com dois destinos iguais fora da mobília: \d+, acima do teto/]);

/* PP1, 28.09.2026 · os portões que mudaram de forma com a primeira página de um leitor comum. Correm
   com `--prefixo pp1-` e `OEDP_MEDICOES` a apontar para a pasta das medições do bloco. */
/* A porta estreita dos campos de linha de um bloco: só dentro de um bloco, só na primeira página e nas
   entradas, e cada campo comparado com a linha. Um campo da fonte fora do bloco, o mesmo campo numa
   página de outra rota, uma fonte trocada e um nome da lista trocado fecham a construção. */
planta('pp1-campos-de-linha-dos-blocos','scripts/gate-html.mjs',[
 ['index.html',r=>{
  const f=r.querySelector('[data-bloco-fonte] [data-linha-campo="source"]');
  r.querySelector('main').insertAdjacentHTML('beforeend',`<p class="pp1-planta-fora">${f.outerHTML}</p>`);
  r.querySelector('[data-bloco-numero="divida-publica-2025-notificacao-ine-2026-09"] [data-linha-campo="document.title"]').set_content('Outro documento');
 }],
 ['en/index.html',r=>r.querySelector('[data-bloco-fonte] [data-linha-campo="source"]').set_content('Banco de Portugal')],
],[/numa página que não é do livro-razão/,/o campo "document\.title" de "divida-publica-2025-notificacao-ine-2026-09" não foi transcrito fielmente/,/o campo "source" de "[^"]+" não foi transcrito fielmente[\s\S]*?renderizado: +Banco de Portugal/]);
/* O mesmo campo, com a mesma marca de bloco, numa página que não é a primeira nem uma entrada. */
planta('pp1-campo-de-bloco-noutra-rota','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  const f=parse(fs.readFileSync(path.join('dist','index.html'),'utf8')).querySelector('[data-bloco-fonte] [data-linha-campo="source"]');
  r.querySelector('main').insertAdjacentHTML('beforeend',`<section data-bloco="planta"><p data-bloco-fonte>${f.outerHTML}</p></section>`);
 }],
],[/numa página que não é do livro-razão/]);
/* A data de um estudo numa entrada: as edições esperadas recontam-se dos dados, e uma entrada que perca
   o estudo fecha a construção. */
planta('pp1-estudo-tirado-de-uma-entrada','scripts/check-datas.mjs',[
 ['o-estado-e-a-economia/index.html',r=>r.querySelector('#estudos-da-entrada [data-estudo-edicao]').remove()]
],[/\/o-estado-e-a-economia: declara 1 edição\(ões\) de estudo e os dados dizem 2/]);
/* A lista fechada das formas: um bloco com um nome de forma que não é nenhum dos oito. */
planta('pp1-forma-de-bloco-desconhecida','scripts/check-formas.mjs',[
 ['index.html',r=>r.querySelector('[data-bloco-desenho]').setAttribute('data-forma','barras-empilhadas')]
],[/a forma gráfica "barras-empilhadas" não é uma das 8 admitidas/]);
/* A exceção do vocabulário cresceu com as formas do trabalho de quem lê («O meu trabalho», «O custo do
   trabalho», «O trabalho: mais emprego»). A palavra no sentido de um estudo, na mesma página, continua a
   contar: a exceção é por cadeia, e não por página. */
planta('pp1-trabalho-como-nome-de-estudo','scripts/check-lugar.mjs',[
 ['index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>O trabalho deste projeto sobre a água.</p>')]
],[/L3 .*ACIMA DO TETO/]);
