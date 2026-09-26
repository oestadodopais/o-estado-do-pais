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
function planta(nome,script,alteracoes,mordidas) {
 if(apenas && nome!==apenas)return;
 if(prefixo && !nome.startsWith(prefixo))return;
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
 fs.writeFileSync(path.join(pasta,apenas ? `plantas-portoes-${apenas}.json` : prefixo ? `plantas-portoes-${prefixo.replace(/-$/,'')}.json` : 'plantas-portoes.json'),JSON.stringify(registos,null,2)+'\n');
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
planta('r1-mudanca-com-valor-trocado','scripts/gate-html.mjs',[
 ['index.html',r=>r.querySelector('[data-mudanca-id="notificacao-ine-divida-2026-09-23"] [data-claim]').set_content('89,3')]
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
planta('b2-contagens-das-camaras','scripts/gate-html.mjs',[
 ['index.html',r=>{for(const chave of ['camaras_acima_do_limite','camaras_dentro_do_limite','camaras_sem_valor']){const n=r.querySelector(`[data-cartao-camaras] [data-prova="${chave}"]`);n.set_content(String(Number(n.textContent)+1));}}]
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
planta('b2-voz-contagem-e-prosa','scripts/check-voz.mjs',[
 ['index.html',r=>{
  const n=r.querySelector('[data-veredicto-pais] [data-prova="painel_fora_do_limiar"]');
  n.set_content(String(Number(n.textContent)+1));
  r.querySelector('[data-cartao-camaras] .cartao-medida-valor').insertAdjacentHTML('beforeend',' palavras plantadas junto da contagem');
 }]
],[/V1 pt: painel_fora_do_limiar/,/bloco por classificar[^\n]*palavras plantadas junto da contagem/]);

/* L1, 24.09.2026 · a leitura de cada medida. O `auditaSelo` do portão de HTML
   aceita um valor dentro de uma leitura só pela regra do item da régua, e o
   arame da classe do `check:voz` só tira uma leitura depois de a K17 a conferir
   na mesma corrida. Cada uma destas plantas estraga a forma nova numa página
   construída e exige a mordida de sempre. Corre-se com `--prefixo l1-` e
   `OEDP_MEDICOES` a apontar para a pasta das plantas do bloco. */
planta('l1-leitura-sem-selo-em','scripts/gate-html.mjs',[
 ['index.html',r=>r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]').removeAttribute('data-selo-em')]
],[/o valor da afirmação "saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha\./]);
planta('l1-leitura-de-outro-cartao','scripts/gate-html.mjs',[
 ['en/index.html',r=>{const l=r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]');l.setAttribute('data-selo-em','divida-publica-2025');l.setAttribute('data-cartao-leitura','divida-publica-2025');}]
],[/o valor da afirmação "saldo-das-administracoes-publicas-2025" aparece sem selo para a sua própria linha\./]);
planta('l1-leitura-com-linha-alheia','scripts/gate-html.mjs',[
 ['temas/index.html',r=>{
  const valor=r.querySelector('[data-cartao-medida="divida-publica-2025"] .cartao-medida-quantidade [data-claim="divida-publica-2025"]').textContent;
  const n=r.querySelector('[data-cartao-leitura="racio-s80-s20-2025"] [data-claim="racio-s80-s20-2025"]');
  n.setAttribute('data-claim','divida-publica-2025');n.set_content(valor);
 }]
],[/o valor da afirmação "divida-publica-2025" aparece sem selo para a sua própria linha\./]);
planta('l1-leitura-que-a-k17-recusa','scripts/check-voz.mjs',[
 ['index.html',r=>{const l=r.querySelector('[data-cartao-leitura="saldo-das-administracoes-publicas-2025"]');l.set_content(l.innerHTML.replace('receberam mais do que gastaram','receberam muito mais do que gastaram'));}]
],[/a K17 recusou-a em \/: K17 · \/ · saldo-das-administracoes-publicas-2025/,/FRASE DA CLASSE POR PROVAR EM \/ · «subiu»/]);
planta('l1-leitura-fora-do-cartao','scripts/check-voz.mjs',[
 ['en/index.html',r=>{const l=r.querySelector('[data-cartao-leitura="taxa-de-emprego-2025"]');r.querySelector('main').insertAdjacentHTML('beforeend',l.outerHTML);}]
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
