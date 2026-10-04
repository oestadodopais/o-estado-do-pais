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
  /* S1 (02.10.2026): um ficheiro `.xml` (o mapa do sítio) não passa pelo leitor de HTML, que o reescrevia: a planta
     recebe o texto e devolve o texto. As outras continuam como eram. */
  for(const [f,fn] of alteracoes){let texto;if(f.endsWith('.xml'))texto=fn(originais.get(f));else{const raiz=parse(originais.get(f));fn(raiz);texto=raiz.toString();}if(texto===originais.get(f))throw Error(`${nome}: a planta não mudou ${f}`);fs.writeFileSync(path.join('dist',f),texto);}
  r=spawnSync(process.execPath,[script],{encoding:'utf8',maxBuffer:64*1024*1024});
 }finally{for(const [f,s] of originais)fs.writeFileSync(path.join('dist',f),s);}
 const saida=r.stdout+r.stderr;
 fs.writeFileSync(path.join(pasta,`planta-${nome}.log`),saida.replaceAll(process.cwd(), '<sitio>').replace(/\/Users\/[^/\s]+/g, '<pasta-local>'));
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
/* L2b (01.10.2026): as origens da faixa do concelho no portão de HTML. O lugar, a contagem e os empates
   recontam-se das 308 linhas pelo leitor dos portões, e um valor na faixa só passa sem marca própria se for
   a linha do cartão ou a linha de Portugal que o portão acha para ela. `--prefixo l2b-` corre só estas. */
planta('l2b-portao-um-lugar-errado','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>{const m=r.querySelector('[data-faixa-concelho="ganho"] [data-concelho-lugar]');m.set_content(String(Number(m.text)+1));}]
],[/L2b: «data-concelho-lugar» de «ganho#evora» diz «\d+» e a recontagem das linhas dá «\d+»/]);
planta('l2b-portao-uma-contagem-errada','scripts/gate-html.mjs',[
 ['en/municipalities/evora/index.html',r=>{const m=r.querySelector('[data-faixa-concelho="pmp"] [data-concelho-conta]');m.set_content(String(Number(m.text)+9));}]
],[/L2b: «data-concelho-conta» de «pmp» diz «\d+» e a recontagem das linhas dá «\d+»/]);
planta('l2b-portao-um-empate-errado','scripts/gate-html.mjs',[
 ['municipios/agueda/index.html',r=>{const m=r.querySelector('[data-faixa-concelho="pmp"] [data-concelho-a-par]');m.set_content(String(Number(m.text)+1));}]
],[/L2b: «data-concelho-a-par» de «pmp#agueda» diz «\d+» e a recontagem das linhas dá «\d+»/]);
planta('l2b-portao-portugal-de-outra-linha','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>{const v=r.querySelector('[data-faixa-concelho="ganho"] [data-faixa-comparacao] [data-claim]');v.setAttribute('data-claim','taxa-de-desemprego-2024');v.set_content(getClaim('taxa-de-desemprego-2024').value);}]
],[/o valor da afirmação "taxa-de-desemprego-2024" aparece sem selo para a sua própria linha/]);
planta('l2b-portao-faixa-sem-a-porta-do-cartao','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>r.querySelector('[data-faixa-concelho="ganho"]').removeAttribute('data-selo-em')]
],[/o valor da afirmação "evora-ganho-medio-mensal-2024" aparece sem selo para a sua própria linha/,/o valor da afirmação "ganho-medio-mensal-2024" aparece sem selo para a sua própria linha/]);
/* L2b-b (01.10.2026, pela §1.143, decisão 4): uma contagem não tem faixa, e o portão de HTML recusa um lugar
   numa contagem, mesmo que o número seja o que a ordem daria. */
planta('l2b-b-portao-lugar-numa-contagem','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>r.querySelector('[data-cartao-medida][data-medida-chave="populacao"] .cartao-medida-valor').insertAdjacentHTML('afterend','<p class="planta-l2b-b">Évora está em <span data-concelho-lugar="populacao#evora">51</span>.º lugar.</p>')]
],[/L2b-b: «data-concelho-lugar» dá um lugar na medida «populacao», que é uma contagem e não tem faixa/]);
/* K2-c (02.10.2026, achados 1 e 2 da leitura a frio do Codex): a unidade da casa do cartão da diferença de emprego
   confere-se contra a definição declarada e só vale para a sua linha; a classe etária ao lado do título dos jovens é
   uma citação registada, conferida carácter a carácter. `--prefixo k2c-` corre só estas. */
planta('k2c-portao-unidade-da-casa-trocada','scripts/gate-html.mjs',[
 ['emprego/index.html',r=>r.querySelector('[data-unidade-da-casa="disparidade-de-emprego-entre-sexos-2025"]').set_content('% da população')]
],[/K2-c: a unidade da casa de "disparidade-de-emprego-entre-sexos-2025" diz «% da população» e a declaração diz «pontos percentuais»/]);
planta('k2c-portao-unidade-da-casa-de-outra-linha','scripts/gate-html.mjs',[
 ['en/employment/index.html',r=>r.querySelector('[data-unidade-da-casa="disparidade-de-emprego-entre-sexos-2025"]').setAttribute('data-unidade-da-casa','taxa-de-emprego-2025')]
],[/o valor da afirmação "disparidade-de-emprego-entre-sexos-2025" aparece sem selo para a sua própria linha na forma do cartão/,/K2-c: a unidade da casa de "taxa-de-emprego-2025" está fora do cartão da sua linha/]);
/* R2 (03.10.2026, o bloco dos rótulos): a unidade de um cartão nacional declara-se em `UNIDADES_DOS_CARTOES`, com o seu
   apoio, e o portão de HTML só a aceita no cartão da sua linha, com o texto da declaração; o cartão de uma linha com
   unidade declarada não pode voltar a imprimir a etiqueta da linha; e um algarismo de uma unidade declarada só entra
   pela marca da régua do instrumento. `--prefixo r2-` corre só estas. */
planta('r2-portao-cartao-com-a-etiqueta-da-linha','scripts/gate-html.mjs',[
 ['emprego/index.html',r=>r.querySelector('[data-unidade-da-casa="jovens-nem-2025"]').replaceWith('<span class="cartao-medida-unidade" data-linha-campo="unit" data-linha-claim="jovens-nem-2025">% da população</span>')]
],[/R2: o cartão de "jovens-nem-2025" tem unidade declarada em UNIDADES_DOS_CARTOES e imprime outra \(a etiqueta da linha\)/]);
planta('r2-portao-unidade-da-casa-com-outra-idade','scripts/gate-html.mjs',[
 ['en/employment/index.html',r=>r.querySelector('[data-unidade-da-casa="jovens-nem-2025"]').set_content('% of people aged <span data-nonledger="escala-de-instrumento">15</span> to <span data-nonledger="escala-de-instrumento">24</span>')]
],[/K2-c: a unidade da casa de "jovens-nem-2025" diz «% of people aged 15 to 24» e a declaração diz «% of people aged 15 to 29»/]);
planta('r2-portao-algarismo-da-unidade-sem-marca','scripts/gate-html.mjs',[
 ['emprego/index.html',r=>r.querySelector('[data-unidade-da-casa="taxa-de-emprego-2025"]').set_content('% das pessoas dos 20 aos 64 anos')]
],[/algarismos fora do livro-razão: "20"/]);
/* R2 (03.10.2026): a L1 dispensa a porta da origem de uma definição quando é o próprio documento da linha, no recibo
   dessa linha (a pergunta nova do salário mínimo apoia-se no mesmo decreto-lei de onde vem o valor). A dispensa é do
   destino exato do pedido e só dentro da origem: uma terceira porta para o mesmo documento fora dela conta, e a mesma
   marca numa página que não é um recibo conta. */
planta('r2-l1-porta-da-origem-repetida-fora','scripts/check-lugar.mjs',[
 ['livro-razao/retribuicao-minima-mensal-garantida-continente-2026/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p><a href="https://dre.pt/application/conteudo/992879809">Decreto-Lei n.º 139/2025</a></p>')]
],[/L1 · páginas com dois destinos iguais fora da mobília: \d+, acima do teto/]);
planta('r2-l1-dispensa-so-no-recibo','scripts/check-lugar.mjs',[
 ['temas/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<div data-def-origem="planta"><a class="def-origem-doc" href="/lugares/">Os lugares</a></div><p class="linha-pedido"><a class="ligacao-externa" href="/lugares/">Os lugares</a></p>')]
],[/L1 · páginas com dois destinos iguais fora da mobília: \d+, acima do teto/]);
/* R2-b (04.10.2026): a unidade declarada da faixa dos 27 só na faixa da série da sua linha; uma porta por endereço nas
   origens de uma definição, nem menos nem mais (a 8.4 do check:lugar). `--prefixo r2b-` corre só estas. */
planta('r2b-portao-unidade-da-faixa-de-outra-serie','scripts/gate-html.mjs',[
 ['uniao-europeia/index.html',r=>r.querySelector('[data-faixa-paises="taxa-de-emprego-2025-paises"] [data-unidade-da-casa]').setAttribute('data-unidade-na-faixa','divida-publica-2025-paises')]
],[/R2-b: a unidade da casa de "taxa-de-emprego-2025" diz ser da faixa «divida-publica-2025-paises», e não está na faixa da série dessa linha/]);
planta('r2b-lugar-porta-repetida-nas-origens','scripts/check-lugar.mjs',[
 ['livro-razao/disparidade-salarial-entre-sexos-2024/index.html',r=>{const sp=r.querySelector('[data-def-origem="eurostat-earn-grgpg2-cobertura"] .def-origem-doc');sp.replaceWith('<a class="lig def-origem-doc" href="https://ec.europa.eu/eurostat/cache/metadata/en/earn_grgpg2_esms.htm" data-verbatim="origem-eurostat-earn-grgpg2-cobertura-documento" lang="en">Gender pay gap in unadjusted form (earn_grgpg2) · Reference metadata</a>');}]
],[/8\.4 · definições de painel fora da declaração: \d+, acima do teto 0/]);
planta('r2b-lugar-origem-sem-porta','scripts/check-lugar.mjs',[
 ['livro-razao/disparidade-salarial-entre-sexos-2024/index.html',r=>{const a=r.querySelector('[data-def-origem="eurostat-earn-grgpg2-definicao"] a.def-origem-doc');a.replaceWith('<span class="def-origem-doc" data-verbatim="origem-eurostat-earn-grgpg2-definicao-documento" lang="en">Gender pay gap in unadjusted form (earn_grgpg2) · Reference metadata</span>');}]
],[/8\.4 · definições de painel fora da declaração: \d+, acima do teto 0/]);
planta('k2c-portao-classe-etaria-trocada','scripts/gate-html.mjs',[
 ['uniao-europeia/index.html',r=>r.querySelector('[data-verbatim="origem-eurostat-tipslm90-sexo-coordenadas"]').set_content('Age class: From 15 to 24 years')]
],[/a citação "origem-eurostat-tipslm90-sexo-coordenadas" não foi transcrita fielmente/]);
/* UE2 (02.10.2026): a secção dos países da página da União. A contagem do título é a da tabela de autoridade,
   recontada pelo portão; as etiquetas do toque estão escondidas no documento, e o portão lê-as na mesma: um valor
   trocado numa etiqueta que só aparece com o toque fecha a construção; e o nome de um país na lista dobrada é o da
   tabela. `--prefixo ue2-` corre só estas. */
planta('ue2-portao-conta-da-tabela-errada','scripts/gate-html.mjs',[
 ['uniao-europeia/index.html',r=>r.querySelector('[data-tabela-dos-paises="conta"]').set_content('28')]
],[/UE2: a contagem dos países da tabela dos nomes diz «28» e a tabela tem 27/]);
planta('ue2-portao-valor-escondido-trocado','scripts/gate-html.mjs',[
 ['en/european-union/index.html',r=>r.querySelector('[data-toque-de="divida-publica-2025-paises#EL"] [data-ponto]').set_content('146,2')]
],[/UE1: o ponto «EL» da série «divida-publica-2025-paises» foi renderizado como «146,2»/]);
planta('ue2-portao-nome-da-lista-a-mao','scripts/gate-html.mjs',[
 ['uniao-europeia/index.html',r=>r.querySelector('[data-lista-ponto="taxa-de-emprego-2025-paises#MT"] [data-pais]').set_content('Malta e Gozo')]
],[/UE1: o nome do país «MT» foi renderizado como «Malta e Gozo»/]);
/* UE2-b (02.10.2026): a forma em palavras comuns é a única forma das definições (a decisão do lugar de direção sobre o
   achado 14 da leitura a frio do UE2), e a 8.4 do `check:lugar` confere a mesma declaração em todas as páginas onde a
   definição se rende, como a K6 do `check:cartao` confere a pergunta de cada cartão das páginas de assunto. A pergunta
   antiga, com o termo técnico sem explicação, tem de morder nas duas réguas: na 8.4, na página da União, também sem a
   origem que explica o termo (a planta do UE2, que lá escolhia a forma pela rota); na K6, no cartão da página do emprego. */
planta('ue2-b-lugar-pergunta-antiga-na-pagina-da-uniao','scripts/check-lugar.mjs',[
 ['uniao-europeia/index.html',r=>{const d=r.querySelector('[data-leitura="custo-unitario-do-trabalho-2025"]');d.querySelector('.dobra-definicao').set_content('Quanto mudou em três anos o índice nominal do custo unitário do trabalho, por hora trabalhada?');d.querySelector('[data-def-origem="eurostat-tipslm10-descricao"]').remove();}]
],[/8\.4 · definições de painel fora da declaração: \d+, acima do teto 0/,/custo-unitario-do-trabalho-2025»: a página diz «Quanto mudou em três anos o índice nominal/,/a página rende 1 bloco\(s\) de origem e a declaração diz 2/]);
planta('ue2-b-cartao-pergunta-antiga-numa-pagina-de-assunto','tests/cartao/cartao.mjs',[
 ['emprego/index.html',r=>r.querySelector('[data-cartao-medida="taxa-de-desemprego-mip-2025"] [data-cartao-definicao]').set_content('Que parte da população ativa dos 15 aos 74 anos está sem emprego?')]
],[/K6 · \/emprego\/ · taxa-de-desemprego-mip-2025: a frase do cartão diz «Que parte da população ativa dos 15 aos 74/]);
/* P4 (02.10.2026, itens 3 e 4 do brief P4): os dois termos que a passagem UE2-b deixou por explicar, e a nota do sucessor.
   A pergunta antiga de cada um dos dois cartões, com o termo sem explicação, tem de morder na K6 (a frase do cartão é a
   declarada); e a nota de uma edição datada sem a frase da reconciliação, ou com a frase da outra língua, tem de morder
   na célula da nota do `check:datas`. */
planta('p4-cartao-pergunta-antiga-da-disparidade','tests/cartao/cartao.mjs',[
 ['emprego/index.html',r=>r.querySelector('[data-cartao-medida="disparidade-de-emprego-entre-sexos-2025"] [data-cartao-definicao]').set_content('Qual é a diferença, em pontos percentuais, entre a taxa de emprego dos homens dos 20 aos 64 anos e a das mulheres?')]
],[/K6 · \/emprego\/ · disparidade-de-emprego-entre-sexos-2025: a frase do cartão diz «Qual é a diferença, em pontos percentuais/]);
planta('p4-cartao-pergunta-antiga-da-sobrecarga','tests/cartao/cartao.mjs',[
 ['en/housing/index.html',r=>r.querySelector('[data-cartao-medida="sobrecarga-do-custo-da-habitacao-2025"] [data-cartao-definicao]').set_content('What share of people, across all tenure statuses, are in households where total housing costs, after deducting housing allowances, take more than 40 % of what the household receives from work, investment and social benefits, after paying taxes and social contributions (disposable income), also after deducting housing allowances?')]
],[/K6 · \/en\/housing\/ · sobrecarga-do-custo-da-habitacao-2025: a frase do cartão diz «What share of people, across all tenure statuses/]);
planta('p4-datas-nota-sem-a-reconciliacao','scripts/check-datas.mjs',[
 ['estudos/evora-quinze-anos-cinco-mandatos/index.html',r=>r.querySelector('[data-sucessor-reconcilia]').remove()]
],[/evora-quinze-anos-cinco-mandatos: a nota do sucessor não diz que o estudo que lhe sucedeu reconcilia o que esta edição escreveu/]);
planta('p4-datas-nota-inglesa-com-a-frase-portuguesa','scripts/check-datas.mjs',[
 ['en/studies/evora-2027-prometido-painel-dinheiro/index.html',r=>r.querySelector('[data-sucessor-reconcilia]').set_content('O estudo que lhe sucedeu reconcilia o que esta edição escreveu.')]
],[/evora-2027-prometido-painel-dinheiro: a nota do sucessor não diz que o estudo que lhe sucedeu reconcilia/]);
/* P4-c (02.10.2026, a leitura do diretor de 02.10 à noite na página de Évora): o cartão do índice de dívida diz de que
   é a percentagem, «% da receita de três anos», e o teto na linha do estado, «dentro do limite legal, que é 150 %», com
   o 150 lido da linha do limite, sem marca própria. O portão de HTML aceita a unidade da casa de uma medida de concelho
   só com o texto da declaração e no cartão da sua linha, e o teto só como a linha que a derivação do cartão usa e com
   `data-selo-em` igual à linha do cartão; a K10 exige a porta do teto na aritmética do recibo; e a V2 do `check:pais`
   exige as mesmas palavras no cartão das câmaras. Cada planta estraga uma dessas coisas e tem de morder. */
planta('p4c-unidade-antiga','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>r.querySelector('[data-cartao-medida="evora-indice-de-divida-2024"] [data-unidade-da-casa]').set_content('% (limite legal = 150)')]
],[/P4-c: a unidade da casa de "evora-indice-de-divida-2024" diz «% \(limite legal = 150\)»/]);
planta('p4c-unidade-de-outra-medida','scripts/gate-html.mjs',[
 ['en/municipalities/evora/index.html',r=>r.querySelector('[data-cartao-medida="evora-indice-de-divida-2024"] [data-unidade-da-casa]').setAttribute('data-unidade-da-medida','pmp')]
],[/P4-c: a unidade da casa de "evora-indice-de-divida-2024" diz ser da medida «pmp», e a medida não declara/]);
planta('p4c-teto-de-outra-linha','scripts/gate-html.mjs',[
 ['municipios/agueda/index.html',r=>{const v=r.querySelector('[data-regua="limite"] [data-claim]');v.setAttribute('data-claim','agueda-limite-divida-dgal-2024');}]
],[/o valor da afirmação "agueda-limite-divida-dgal-2024" aparece sem selo para a sua própria linha/]);
planta('p4c-teto-sem-selo-em','scripts/gate-html.mjs',[
 ['en/municipalities/agueda/index.html',r=>r.querySelector('[data-regua="limite"]').removeAttribute('data-selo-em')]
],[/o valor da afirmação "indice-de-divida-limite-legal" aparece sem selo para a sua própria linha/]);
planta('p4c-recibo-sem-a-porta-do-teto','tests/cartao/cartao.mjs',[
 ['livro-razao/agueda-indice-de-divida-2024/index.html',r=>r.querySelector('a.linha-deriva-ligacao[href="/livro-razao/indice-de-divida-limite-legal"]').removeAttribute('href')]
],[/K10 · .*agueda-indice-de-divida-2024: a linha do estado cita o teto «indice-de-divida-limite-legal» sem marca própria/]);
planta('p4c-camaras-palavras-de-antes','scripts/check-pais.mjs',[
 ['lugares/index.html',r=>{const c=r.querySelector('[data-cartao-camaras] [data-camaras-regua]');c.set_content(c.innerHTML.replace('dentro do limite legal, que é ','dentro do limite legal (').replace('; <span data-prova="camaras_sem_valor"',') ; <span data-prova="camaras_sem_valor"'));}]
],[/V2 pt: a régua difere das contagens e do limite lidos nas linhas/]);
/* P4-d (02.10.2026): a média entra na unidade do cartão do índice de dívida, «% da receita média de três anos», e o mapa da
   dívida em «Lugares» diz a mesma unidade e o teto na legenda e no cabeçalho da tabela. A unidade de antes da média no
   cartão, a unidade antiga da linha na legenda do mapa e a unidade do mapa posta fora da legenda têm de morder no
   portão de HTML. */
planta('p4d-unidade-sem-a-media','scripts/gate-html.mjs',[
 ['municipios/evora/index.html',r=>r.querySelector('[data-cartao-medida="evora-indice-de-divida-2024"] [data-unidade-da-casa]').set_content('% da receita de três anos')]
],[/P4-c: a unidade da casa de "evora-indice-de-divida-2024" diz «% da receita de três anos»/]);
planta('p4d-mapa-unidade-antiga','scripts/gate-html.mjs',[
 ['lugares/index.html',r=>r.querySelector('[data-instrumento="mapa-por-concelho-indice"] .forma-mapa-unidade [data-unidade-da-casa-do-mapa]').set_content('% (limite legal = 150)')]
],[/P4-d: a unidade da casa do mapa «indice» diz «% \(limite legal = 150\)»/]);
planta('p4d-mapa-unidade-fora-da-legenda','scripts/gate-html.mjs',[
 ['en/places/index.html',r=>r.querySelector('[data-contexto-municipal="indice"]').insertAdjacentHTML('beforeend','<span data-unidade-da-casa-do-mapa="indice">% of the three-year average revenue</span>')]
],[/P4-d: a unidade da casa do mapa «indice» está fora da legenda ou do cabeçalho da tabela/]);
/* S1 (02.10.2026): a caixa das sugestões. A porta do rodapé conta-se em todas as páginas, uma por página, com o
   destino e o `?de=` do caminho da página; as páginas do resultado levam `noindex` e ficam fora do mapa do sítio; a
   nota do que fica guardado é a declarada; o campo armadilhado não se anuncia; o formulário não manda campo nenhum
   além dos declarados; e a página das correções tem a frase com a porta das sugestões. `--prefixo s1-` corre só estas. */
planta('s1-porta-sugestoes-a-dobrar','scripts/gate-html.mjs',[
 ['lugares/index.html',r=>r.querySelector('[data-porta-sugestoes]').insertAdjacentHTML('afterend','<span data-porta-sugestoes><a href="/sugestoes?de=%2Flugares">Sugestões</a></span>')]
],[/S1 porta: esta página tem 2 porta\(s\) das sugestões/]);
planta('s1-porta-sugestoes-de-errado','scripts/gate-html.mjs',[
 ['temas/index.html',r=>r.querySelector('[data-porta-sugestoes] a').setAttribute('href','/sugestoes?de=%2Flugares')]
],[/S1 porta: a porta das sugestões diz \?de="\/lugares", e o caminho desta página é "\/temas"/]);
planta('s1-resultado-sem-noindex','scripts/gate-html.mjs',[
 ['sugestoes/obrigado/index.html',r=>r.querySelector('meta[name="robots"]').remove()]
],[/S1 resultado: a página do resultado tem de levar uma marca robots «noindex, follow»/]);
planta('s1-nota-mudada','scripts/gate-html.mjs',[
 ['sugestoes/index.html',r=>{const n=r.querySelector('[data-sugestoes-nota]');n.set_content(n.innerHTML.replace('noventa dias','trinta dias'));}]
],[/S1 formulário \(a nota do que fica guardado\): o texto rendido não é o declarado/]);
planta('s1-armadilha-anunciada','scripts/gate-html.mjs',[
 ['en/suggestions/index.html',r=>r.querySelector('[data-sugestoes-armadilha]').removeAttribute('aria-hidden')]
],[/S1 formulário: o campo armadilhado não está fora da árvore de acessibilidade/]);
planta('s1-campo-a-mais','scripts/gate-html.mjs',[
 ['sugestoes/index.html',r=>r.querySelector('form').insertAdjacentHTML('afterbegin','<input type="hidden" name="ip" value="0">')]
],[/S1 formulário: os campos são ip, /]);
planta('s1-mapa-com-resultado','scripts/gate-html.mjs',[
 ['sitemap-0.xml',x=>x.replace('</urlset>','<url><loc>https://xn--oestadodopas-2fb.pt/sugestoes/obrigado</loc></url></urlset>')]
],[/S1 mapa: a página do resultado "\/sugestoes\/obrigado" está no mapa do sítio/]);
planta('s1-correcoes-sem-a-frase','scripts/gate-html.mjs',[
 ['correcoes/index.html',r=>r.querySelector('[data-sugestoes-nas-correcoes]').remove()]
],[/S1 correções: a página tem 0 bloco\(s\) \[data-sugestoes-nas-correcoes\]/]);
/* S1 (02.10.2026): a dispensa da sentinela de «Language» é a frase inteira da nota inglesa e mais nenhuma. A palavra
   sozinha na mesma página volta a morder, e a nota com uma palavra mudada também, porque deixa de ser a frase dispensada. */
planta('s1-voz-language-de-volta','scripts/check-voz.mjs',[
 ['en/suggestions/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Language</p>')]
],[/FRASE RETIRADA QUE VOLTOU A RENDER-SE/,/«Language»/]);
planta('s1-voz-nota-mudada-com-language','scripts/check-voz.mjs',[
 ['en/suggestions/index.html',r=>{const n=r.querySelector('[data-sugestoes-nota]');n.set_content(n.innerHTML.replace('ninety days','sixty days'));}]
],[/FRASE RETIRADA QUE VOLTOU A RENDER-SE/]);
/* S1-b (03.10.2026): a página do limite dizia «na última hora», e a frase saiu (o achado 6 da leitura a frio do Sol).
   Se voltar, a sentinela das frases retiradas tem de a morder. `--prefixo s1b-` corre só esta. */
planta('s1b-limite-antigo-de-volta','scripts/check-voz.mjs',[
 ['sugestoes/limite/index.html',r=>r.querySelector('[data-sugestoes-resultado="limite"]').set_content('Chegaram cinco sugestões deste endereço na última hora. Volte mais tarde.')]
],[/FRASE RETIRADA QUE VOLTOU A RENDER-SE/,/na última hora/]);
/* S1-c (03.10.2026, decisão do diretor, §1.154): o campo do contacto saiu do formulário, a nota passou ao texto que
   o diretor aprovou, e a quinta recusa do Método mudou. O contacto de volta morde no portão de HTML, pelo nome e pela
   lista dos campos, e o seu rótulo de volta morde na sentinela das frases retiradas; a nota com uma palavra mudada deixa
   a linha viva do texto aprovado sem se render; «este sítio» fora da cadeia dispensada da nota volta a morder no
   arame da voz; e a recusa do Método com uma palavra mudada deixa a sua linha viva sem se render. `--prefixo s1c-` corre
   só estas. */
const CAMPO_DO_CONTACTO='<p class="sugestoes-campo"><label for="sugestao-contacto">Contacto, se quiser resposta (opcional)</label><input id="sugestao-contacto" name="contacto" type="email" maxlength="200" autocomplete="email"></p>';
planta('s1c-contacto-de-volta','scripts/gate-html.mjs',[
 ['sugestoes/index.html',r=>r.querySelector('[data-sugestoes-nota]').insertAdjacentHTML('beforebegin',CAMPO_DO_CONTACTO)]
],[/S1 formulário: o formulário pede um contacto/,/S1 formulário: os campos são lingua, sitio, procurou, estudo, outro, contacto, e são só lingua, sitio, procurou, estudo, outro/]);
planta('s1c-voz-rotulo-do-contacto-de-volta','scripts/check-voz.mjs',[
 ['sugestoes/index.html',r=>r.querySelector('[data-sugestoes-nota]').insertAdjacentHTML('beforebegin',CAMPO_DO_CONTACTO)]
],[/FRASE RETIRADA QUE VOLTOU A RENDER-SE/,/Contacto, se quiser resposta \(opcional\)/]);
planta('s1c-voz-nota-com-outra-palavra','scripts/check-voz.mjs',[
 ['sugestoes/index.html',r=>{const n=r.querySelector('[data-sugestoes-nota]');n.set_content(n.innerHTML.replace('noventa dias','trinta dias'));}]
],[/linha «viva» que não se rende em rota nenhuma/,/O que fica guardado: o que escrever, a língua e a página de onde veio/]);
planta('s1c-voz-este-sitio-fora-da-nota','scripts/check-voz.mjs',[
 ['sugestoes/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>As sugestões fazem crescer este sítio.</p>')]
],[/frase com marcador da voz e sem declaração de autorreferência/,/marcador\(es\): ste sítio/]);
planta('s1c-voz-recusa-do-metodo-mudada','scripts/check-voz.mjs',[
 ['metodo/index.html',r=>{const li=r.querySelectorAll('.politica-recusas li').find(x=>x.textContent.includes('só guarda dados pessoais'));li.set_content(li.innerHTML.replace('pelo tempo','por todo o tempo'));}]
],[/linha «viva» que não se rende em rota nenhuma/,/Este projeto só guarda dados pessoais de quem usa a caixa das sugestões/]);

/* R3 (04.10.2026): o índice. As sete portas do rodapé contam-se em todas as páginas, com o destino e o nome de cada
   edição; a unidade de uma linha entra na lista «O que mudou» do índice pela porta estreita da entrada da própria
   linha; a lista do índice tem as linhas que mudaram, uma vez cada, e nenhuma publicação; as datas dos estudos do
   índice prendem-se à sua edição; a página está no inventário das frases; e a L1 e a L2a do `check:lugar` medem-na.
   `--prefixo r3-` corre só estas. */
planta('r3-rodape-sem-a-porta-do-indice','scripts/gate-html.mjs',[
 ['temas/index.html',r=>r.querySelector('nav.rodape-nav a[href="/indice"]').remove()]
],[/R3 rodapé: o rodapé tem 6 porta\(s\) e são 7/]);
planta('r3-rodape-indice-da-outra-edicao','scripts/gate-html.mjs',[
 ['en/themes/index.html',r=>r.querySelector('nav.rodape-nav a[href="/en/index"]').setAttribute('href','/indice')]
],[/R3 rodapé: a porta 7 do rodapé é «Index» para \/indice; nesta edição é «Index» para \/en\/index/]);
planta('r3-unidade-de-outra-linha','scripts/gate-html.mjs',[
 ['indice/index.html',r=>r.querySelector('[data-mudou-ambito="indice"] [data-correcao-entrada] [data-linha-campo="unit"]').set_content('unidade de outra linha')]
],[/unidade de outra linha/]);
planta('r3-unidade-com-a-marca-de-outra-linha','scripts/gate-html.mjs',[
 ['indice/index.html',r=>r.querySelector('[data-mudou-ambito="indice"] [data-correcao-entrada] [data-linha-campo="unit"]').setAttribute('data-linha-claim','taxa-de-emprego-2025')]
],[/data-linha-claim="taxa-de-emprego-2025" numa página que não é do livro-razão/]);
planta('r3-indice-repete-uma-linha','scripts/check-pais.mjs',[
 ['indice/index.html',r=>{const ol=r.querySelector('[data-mudou-ambito="indice"]');ol.insertAdjacentHTML('beforeend',ol.querySelector('li').toString());}]
],[/A1: indice\/index.html: o índice repete uma linha do livro em «O que mudou»/]);
planta('r3-indice-com-uma-publicacao','scripts/check-pais.mjs',[
 ['indice/index.html',r=>r.querySelector('[data-mudou-ambito="indice"]').insertAdjacentHTML('afterbegin','<li data-mudanca="publicacao"><time datetime="2026-10-01" data-publicacao-estudo="evora-2027-capital-europeia-da-cultura/pt">01.10.2026</time></li>')]
],[/A1: indice\/index.html: a linha publicacao\|evora-2027-capital-europeia-da-cultura é de «nenhum lugar» e a página é de «indice»/]);
planta('r3-datas-do-indice-trocada','scripts/check-datas.mjs',[
 ['indice/index.html',r=>r.querySelector('[data-estudo-edicao] time').set_content('12.08.2026')]
],[/\/indice: a edição evora-contas-da-camara-2010-2025\/pt imprime «12\.08\.2026»/]);
planta('r3-indice-sem-um-estudo','scripts/check-datas.mjs',[
 ['en/index/index.html',r=>r.querySelector('[data-estudo-edicao]').remove()]
],[/\/en\/index: declara 10 edição\(ões\) de estudo e os dados dizem 11/]);
planta('r3-voz-frase-por-classificar','scripts/check-voz.mjs',[
 ['indice/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>Uma frase nova que ninguém declarou.</p>')]
],[/bloco por classificar em \/indice: «Uma frase nova que ninguém declarou\.»/]);
planta('r3-lugar-porta-repetida','scripts/check-lugar.mjs',[
 ['indice/index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p><a href="/agenda">Agenda</a></p>')]
],[/L1 · páginas com dois destinos iguais fora da mobília +\d+ +\(teto \d+\) ACIMA DO TETO/]);
planta('r3-lugar-concelhos-abertos','scripts/check-lugar.mjs',[
 ['en/index/index.html',r=>r.querySelectorAll('main details').forEach(d=>d.setAttribute('open',''))]
],[/L2 · segundas listas dos concelhos +1 +\(teto 0\) ACIMA DO TETO/,/\/en\/index\/? · 308 concelhos ligados fora de uma lista fechada/]);
/* R3-b (04.10.2026, as emendas da leitura a frio do Sol): o âmbito do índice numa página de concelho (o achado 9), que a
   A1 aceitava pela marca sem olhar à rota da página; e duas entradas da mesma linha no mesmo dia pela ordem antiga, a
   mais antiga primeiro, no registo (o achado 5), que a A3 passa a recusar. A segunda pede a construção com a ordem nova:
   troca as duas entradas do primeiro par que o registo construído tiver. Correm com as do R3, por `--prefixo r3-`. */
planta('r3-ambito-do-indice-noutra-pagina','scripts/check-pais.mjs',[
 ['municipios/evora/index.html',r=>r.querySelector('[data-mudou-ambito]').setAttribute('data-mudou-ambito','indice')]
],[/A1: municipios\/evora\/index\.html: uma lista «O que mudou» com o âmbito do índice numa página que não é o índice/]);
planta('r3-registo-mesma-linha-pela-ordem-errada','scripts/check-pais.mjs',[
 ['correcoes/index.html',r=>{
  const itens=r.querySelectorAll('[data-mudou-registo] li[data-correcao-entrada]');
  const dia=li=>li.querySelector('[data-correcao-campo="date"]')?.getAttribute('datetime');
  const i=itens.findIndex((li,k)=>k>0&&li.getAttribute('data-correcao-entrada')===itens[k-1].getAttribute('data-correcao-entrada')&&dia(li)===dia(itens[k-1]));
  if(i<1)return;
  const segunda=itens[i].toString();
  itens[i].remove();
  itens[i-1].insertAdjacentHTML('beforebegin',segunda);
 }]
],[/A3: correcoes\/index\.html: duas entradas da mesma linha no mesmo dia estão da mais antiga para a mais recente/]);

/* OE1-e: estragos sobre recibos realmente construídos, repostos no finally
   da mesma planta. Correm em série no verify, pela tranca da construção. */
planta('oe1e-ressalva-retirada','scripts/gate-html.mjs',[
 ['livro-razao/oe-2026-despesa-ministerio-saude/index.html',r=>r.querySelector('.linha-cabeca [data-linha-campo="ressalva"]').remove()]
],[/ressalva de oe-2026-despesa-ministerio-saude ausente ou repetida na edição pt/]);
planta('oe1e-ressalva-de-outra-linha','scripts/gate-html.mjs',[
 ['livro-razao/oe-2026-despesa-ministerio-saude/index.html',r=>r.querySelector('.linha-cabeca [data-linha-campo="ressalva"]').set_content(getClaim('oe-2026-despesa-ministerio-encargos-gerais-do-estado').ressalva)]
],[/ressalva de oe-2026-despesa-ministerio-saude não é a declarada na edição pt/]);
planta('oe1e-ressalva-na-lingua-errada','scripts/gate-html.mjs',[
 ['en/ledger/oe-2026-despesa-ministerio-saude/index.html',r=>r.querySelector('.linha-cabeca [data-linha-campo="ressalva"]').set_content(getClaim('oe-2026-despesa-ministerio-saude').ressalva)]
],[/ressalva de oe-2026-despesa-ministerio-saude não é a declarada na edição en/]);

/* H2: plantas fora do verify, que repõem os bytes antes da corrida verde final. */
planta('h2-em-curso-retirado','scripts/check-pais.mjs',[
 ['index.html',r=>r.querySelector('#trabalhos [data-estudo]').remove()]
],[/E1 pt: os três estudos não têm os em curso à cabeça/]);
planta('h2-em-curso-fora-da-cabeca','scripts/check-pais.mjs',[
 ['en/index.html',r=>{const a=r.querySelectorAll('#trabalhos [data-estudo]');const primeiro=a[0].outerHTML;a[0].remove();a[1].insertAdjacentHTML('afterend',primeiro);}]
],[/E1 en: os três estudos não têm os em curso à cabeça/]);
planta('h2-em-curso-sem-marca','scripts/check-pais.mjs',[
 ['en/index.html',r=>r.querySelector('[data-estudo-em-curso]').remove()]
],[/E1 en: marca em curso ausente/]);
planta('h2-ligacao-dentro-de-outra','scripts/gate-html.mjs',[
 ['en/studies/index.html',r=>r.querySelector('a.arquivo-porta').insertAdjacentHTML('beforeend','<a href="/en/to-verify">a verificar</a>')]
],[/H2 ligação dentro de outra: \/en\/to-verify/]);
planta('h2-porta-so-com-html-irmao','scripts/gate-html.mjs',[
 ['index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<a href="/404">Página de erro</a>')]
],[/a ligação interna "\/404" não corresponde a nada construído/]);
planta('h2-indicador-fora-do-endereco','scripts/check-lugar.mjs',[
 ['index.html',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<p>indicador https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2</p>')]
],[/L3 · palavras fora do vocabulário fechado +1 +\(teto 0\) ACIMA DO TETO/]);
planta('h2-area-porta-antiga','scripts/check-areas.mjs',[
 ['areas/ambiente-e-energia/index.html',r=>{const a=r.querySelector('[data-area-peca="trabalho"] a');a.setAttribute('href',a.getAttribute('href')+'/texto');}]
],[/H2 A2 porta antiga do texto/]);

planta('h2-voz-estado-trocado','scripts/check-voz.mjs',[
 ['en/index.html',r=>r.querySelector('[data-estudo-em-curso]').set_content('estado sem declaração')]
],[/bloco por classificar em \/en: «Évora Culture published on estado sem declaração»/]);
