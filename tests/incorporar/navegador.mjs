/* O blogue usa outra origem. Só o argumento da origem do guião passa a ser
   o servidor local. A planta sem CORS exerce pedidos reais entre as portas. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';
import { allClaims, eDerivada, camposPorVerificar } from '../../src/lib/ledger.mjs';
import { SITE_URL, SITE_HOST_DISPLAY } from '../../site.config.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { t } from '../../src/i18n/strings.mjs';
import { codigoDaIncorporacao, dadosDaIncorporacao, podeIncorporar } from '../../src/lib/incorporar.mjs';
import { jsonDaLinha } from '../../src/lib/conjunto.mjs';
import { lerPaginaComCodigo } from '../../scripts/incorporar-do-portao.mjs';
const dist = path.resolve(process.env.OEDP_DIST || 'dist');
const i = process.argv.indexOf('--json');
const saida = i>0 ? process.argv[i+1] : null;
const capturar = process.argv.includes('--capturas');
const pasta = 'design/especime-v3/capturas/er1-2026-10-06';
const origemPublica = new URL(SITE_URL).origin;
const regras = JSON.parse(fs.readFileSync('vercel.json','utf8')).routes;
const linhas = allClaims();
const c = linhas.find(c=>c.source_url && c.corrections?.some(x=>x.kind==='atualizacao' && x.new_value===c.value));
const cNotas = linhas.find(c => podeIncorporar(c) && (c.source_flag_note || c.ressalva) && (c.source_flag_note_en || c.ressalva_en));
assert(cNotas, 'O navegador precisa de uma linha real com notas nas duas edições.');
const calculada = linhas.find(c => eDerivada(c) && !c.access_date && podeIncorporar(c));
// O livro tem uma recusa só pelo excerto. O endereço isolado é uma planta
// em memória sobre uma linha completa, sem alterar o livro.
const recusadaExcerto = linhas.find(c => c.id === 'evora-prr-aprovado-2026');
const recusadaEndereco = {...c, id:c.id+'-recusado-endereco', source_url:'[a verificar]'};
assert.deepEqual(camposPorVerificar(recusadaExcerto), ['excerpt']);
assert.deepEqual(camposPorVerificar(recusadaEndereco), ['source_url']);
assert.equal(podeIncorporar(recusadaEndereco), false);
const recusadas = [recusadaExcerto, recusadaEndereco];
const recusas = recusadas.map((linha, indice) => {
  const campo = indice === 0 ? 'excerpt' : 'source_url';
  const verdadeiro = JSON.parse(jsonDaLinha(linha));
  assert.equal(Object.hasOwn(verdadeiro, 'incorporacao'), false);
  if (campo === 'excerpt') assert.deepEqual(verdadeiro, JSON.parse(fs.readFileSync(`${dist}/livro-razao/${linha.id}.json`, 'utf8')));
  for (const lang of ['pt','en']) assert.equal(codigoDaIncorporacao(linha, lang), null);
  // Só a cópia recebe apresentação indevida. O JSON verdadeiro não é retocado.
  const estragado = structuredClone(verdadeiro);
  estragado.incorporacao = Object.fromEntries(['pt','en'].map(lang => [lang, dadosDaIncorporacao(campo === 'source_url' ? c : linha, lang)]));
  for (const lang of ['pt','en']) assert.equal(estragado.incorporacao[lang].valor, verdadeiro.linha.value);
  return {linha, campo, verdadeiro, estragado,
    estrago:`Acrescentado incorporacao com apresentação completa à cópia do JSON recusado só por ${campo}.`};
});
const antigo = c.corrections.find(x=>x.kind==='atualizacao' && x.new_value===c.value).old_value;
const tipos = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const codigos = Object.fromEntries(['pt','en'].map(lang=>[lang,parse(fs.readFileSync(`${dist}${routePath('linha',lang,{slug:c.id})}/index.html`,'utf8')).querySelector('[data-incorporar-codigo]').textContent]));
// Estraga as duas fontes em memória. A regra esperada do navegador continua
// a exigir o separador, mesmo quando o estático e o cliente concordam no erro.
const fonteCompositor = fs.readFileSync(new URL('../../src/lib/incorporar.mjs',import.meta.url),'utf8');
const separadorEstatico = "} · ${e(d.atribuicao)}";
assert(fonteCompositor.includes(separadorEstatico));
const fonteSemSeparador = fonteCompositor.replace(separadorEstatico, "} ${e(d.atribuicao)}")
  .replace(/from '([^']+)'/g, (_, caminho) => `from '${new URL(caminho,new URL('../../src/lib/incorporar.mjs',import.meta.url)).href}'`);
const compositorEstragado = await import('data:text/javascript;base64,'+Buffer.from(fonteSemSeparador).toString('base64'));
const codigosSemSeparador = Object.fromEntries(['pt','en'].map(lang=>[lang,compositorEstragado.codigoDaIncorporacao(c,lang)]));
const codigosNotas = Object.fromEntries(['pt','en'].map(lang=>[lang,parse(fs.readFileSync(`${dist}${routePath('linha',lang,{slug:cNotas.id})}/index.html`,'utf8')).querySelector('[data-incorporar-codigo]').textContent]));
const jsonNotas = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${cNotas.id}.json`,'utf8'));
const escapar = x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const modeloBlogue = fs.readFileSync(new URL('./blogue.html',import.meta.url),'utf8');
function blogue(lang) {
  const codigo = modoAtual === 'separador-leitura-retirado' ? codigosSemSeparador[lang] : codigos[lang];
  const velho = codigo.replaceAll(escapar(c.value),escapar(antigo));
  const ausente = codigo.replaceAll(c.id,c.id+'-nao-existe');
  const rotulos = lang==='pt' ? ['Valor atual','Valor antigo','Pedido sem resposta'] : ['Current value','Old value','Failed request'];
  const campos={lang:t(lang).lang,titulo:lang==='pt'?'Blogue de ensaio':'Test blog',anfitria:lang==='pt'?'Conteúdo da página que acolhe os números.':'Content of the page hosting the numbers.',rotulo_atual:rotulos[0],rotulo_antigo:rotulos[1],rotulo_ausente:rotulos[2],codigo_atual:codigo,codigo_antigo:velho,codigo_ausente:ausente,rotulo_notas:lang==='pt'?'Número com notas':'Number with notes',codigo_notas:codigosNotas[lang].replace(/data-oedp-lido="[^"]*"/, 'data-oedp-lido=""')};
  const codigoCalculado = lerPaginaComCodigo(fs.readFileSync(`${dist}${routePath('linha',lang,{slug:calculada.id})}/index.html`,'utf8')).querySelector('textarea').textContent.replace('data-oedp-valor="'+calculada.value+'"','data-oedp-valor="ensaio"');
  const coladosRecusados = recusadas.map(linha => `<p class="oedp-numero" lang="${t(lang).lang}" data-oedp="${linha.id}" data-oedp-valor="ensaio" data-oedp-lido="ensaio"><span>${lang === 'pt' ? 'Citação guardada' : 'Saved quotation'}</span></p>`).join('');
  return modeloBlogue.replace('</html>',codigoCalculado+coladosRecusados+'</html>').replace(/\{\{([a-z_]+)\}\}/g,(_,chave)=>campos[chave]);
}
let modoAtual = 'normal';
const servidor = http.createServer((req,res)=>{
  try {
    const caminho = new URL(req.url,'http://local.invalid').pathname;
    for (const r of regras) if (r.src && !r.has && new RegExp('^'+r.src+'$').test(caminho)) for (const [k,v] of Object.entries(r.headers??{})) res.setHeader(k,v);
    // A Vercel envia Access-Control-Allow-Origin: * em todas as respostas de ficheiros estáticos (medido a 12.10.2026;
    // §1.184, terceiro acrescento): o servidor de ensaio faz o mesmo, e o modo «sem-cors» retira-o aos JSON para a planta morder.
    res.setHeader('Access-Control-Allow-Origin','*');
    const recusa = recusas.find(r => caminho === `/livro-razao/${r.linha.id}.json`);
    if (recusa) {
      const doc = modoAtual === 'recusado-com-campo-'+recusa.campo ? recusa.estragado : recusa.verdadeiro;
      res.setHeader('Content-Type',tipos['.json']); res.end(JSON.stringify(doc)); return;
    }
    let f = path.resolve(dist,'.'+decodeURIComponent(caminho));
    if (!f.startsWith(dist+path.sep) && f!==dist) throw Error('fora');
    if (fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
    res.setHeader('Content-Type',tipos[path.extname(f)]??'application/octet-stream');
    if (modoAtual==='sem-cors' && caminho.endsWith('.json')) res.removeHeader('Access-Control-Allow-Origin');
    if (caminho.endsWith('.json')) {
      if (modoAtual==='falha') {res.writeHead(503).end();return;}
      if (modoAtual==='redirecionamento') {res.writeHead(302,{location:'https://fora.invalid/receber'}).end();return;}
      if (modoAtual==='json-malformado') {res.end('{');return;}
      if (modoAtual==='outra-linha') {res.end(JSON.stringify({...json,linha:{...json.linha,id:c.id+'-outra'}}));return;}
      if (modoAtual==='proveniencia-por-confirmar') {const doc=JSON.parse(fs.readFileSync(f,'utf8'));delete doc.incorporacao;res.end(JSON.stringify(doc));return;}
      if (modoAtual==='releitura' && caminho===`/livro-razao/${c.id}.json`) {res.end(JSON.stringify(jsonRelido));return;}
    }
    const bytes=fs.readFileSync(f);
    // Só o argumento da origem muda, em memória. O corpo da função é idêntico.
    if(caminho==='/incorporar.js') {let codigo=bytes.toString().replace(JSON.stringify(origemPublica),JSON.stringify(sitio));if(modoAtual==='separador-leitura-retirado') {const trecho="+ ' · ' + d.atribuicao";assert(codigo.includes(trecho));codigo=codigo.replace(trecho,"+ ' ' + d.atribuicao");}if(modoAtual==='separador-notas-retirado') {assert(codigo.includes("createTextNode(' · ')"));codigo=codigo.replace("notas.textContent = d.notas;\n        novo.appendChild(document.createTextNode(' · '));", "notas.textContent = d.notas;\n        novo.appendChild(document.createTextNode(' '));");}if(modoAtual==='notas-retiradas') {assert(codigo.includes('if (d.notas)'));codigo=codigo.replace('if (d.notas)', 'if (false)');}res.end(codigo);}
    else res.end(bytes);
  } catch {res.writeHead(404).end();}
});
const blog = http.createServer((req,res)=>res.setHeader('Content-Type','text/html; charset=utf-8').end(blogue(req.url.includes('en')?'en':'pt').replaceAll('src="https://'+new URL(SITE_URL).hostname,'src="'+sitio).replaceAll('src="https://'+SITE_HOST_DISPLAY,'src="'+sitio)));
async function abrir(s) {await new Promise(ok=>s.listen(0,'127.0.0.1',ok));return `http://127.0.0.1:${s.address().port}`;}
const sitio = await abrir(servidor), anfitria = await abrir(blog);
const navegador = await chromium.launch({headless:true});
const r = {transporte:'Apenas o argumento da origem e o src do guião são mapeados ao servidor local; os pedidos entre portas distintas são reais, sem fulfill.',comando:'node tests/incorporar/navegador.mjs',linha:c.id,linhaComNotas:cNotas.id,antigo,atual:c.value,casos:[],capturas:[],plantas:[],recusas:[]};
const json = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${c.id}.json`,'utf8'));
const diaSeguinte = new Date(Math.max(...[c.access_date,...(c.verifications??[]).map(v=>v.date)].filter(Boolean).map(d=>Date.parse(d))) + 24*60*60*1000).toISOString().slice(0,10);
const linhaRelida = {...c,verifications:[...(c.verifications??[]),{date:diaSeguinte,result:'igual'}]};
const jsonRelido = {...json,linha:linhaRelida,incorporacao:Object.fromEntries(['pt','en'].map(lang=>[lang,dadosDaIncorporacao(linhaRelida,lang)]))};
try {
  for (const lang of ['pt','en']) for (const modo of ['normal',...recusas.map(r => 'recusado-com-campo-'+r.campo),'releitura','separador-leitura-retirado','separador-notas-retirado','notas-retiradas','proveniencia-por-confirmar','sem-js','sem-cors','falha','json-malformado','outra-linha','redirecionamento']) {
    const ctx = await navegador.newContext({javaScriptEnabled:modo!=='sem-js', viewport:{width:390,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
    const pedidos = [];
    modoAtual=modo;
    await ctx.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.origin!==anfitria)pedidos.push({caminho:url.pathname,origem:url.origin===sitio?'<servidor do projeto>':url.origin,referer:route.request().headers().referer??null,metodo:route.request().method(),corpo:route.request().postData()});
      return [anfitria,sitio].includes(url.origin)?route.continue():route.abort();
    });
    await ctx.addInitScript(()=>{
      window.acessosIndevidos=[];window.registar=true;
      ['cookie','referrer','title','URL','forms'].forEach(k=>Object.defineProperty(document,k,{get(){window.acessosIndevidos.push(k);throw Error(k);},set(){window.acessosIndevidos.push(k);throw Error(k);}}));
      ['localStorage','sessionStorage'].forEach(k=>Object.defineProperty(window,k,{get(){window.acessosIndevidos.push(k);throw Error(k);}}));
      const ler=document.querySelectorAll.bind(document);
      document.querySelectorAll=function(s){if(window.registar && s!=='p.oedp-numero[data-oedp]')window.acessosIndevidos.push(s);return ler(s);};
    });
    const pagina = await ctx.newPage();
    await pagina.goto(anfitria+'/'+lang,{waitUntil:'networkidle'});
    const acessos = modo==='sem-js' ? [] : await pagina.evaluate(()=>{window.registar=false;return window.acessosIndevidos;});
    const textos = await pagina.locator('.oedp-numero').allTextContents();
    const valores = await pagina.locator('.oedp-numero').evaluateAll(ns=>ns.map(n=>({valor:n.getAttribute('data-oedp-valor'),lido:n.getAttribute('data-oedp-lido'),aviso:n.querySelector('[data-oedp-atualizado]')?.textContent??null,html:n.outerHTML})));
    assert.equal(valores.length,parse(blogue(lang)).querySelectorAll('.oedp-numero').length);
    assert.equal(valores[2].valor,c.value);
    assert.equal(valores[2].aviso,null);
    const originaisRecusados = parse(blogue(lang)).querySelectorAll('.oedp-numero').slice(-recusadas.length);
    for (const [indice, recusa] of recusas.entries()) {
      const mensagem = `ER1 navegador: a recusa só por ${recusa.campo} alterou o parágrafo colado.`;
      const conferirRecusa = () => assert.equal(valores[5+indice].html,originaisRecusados[indice].outerHTML,mensagem);
      const plantada = modo === 'recusado-com-campo-'+recusa.campo;
      let falha = null;
      if (plantada) {
        assert.throws(conferirRecusa, erro => {
          falha = {codigo:erro.code, mensagem:erro.message.split('\n')[0]};
          return falha.codigo === 'ERR_ASSERTION' && falha.mensagem === mensagem;
        });
        r.plantas.push({nome:'recusado-isolado-'+recusa.campo+'-'+lang,estrago:recusa.estrago,mensagem:falha.mensagem,mordeu:true});
      } else conferirRecusa();
      if (modo === 'normal' || plantada) r.recusas.push({lang,modo,campo:recusa.campo,linha:recusa.linha.id,
        jsonComCampo:Object.hasOwn(plantada ? recusa.estragado : recusa.verdadeiro,'incorporacao'),
        compositor:codigoDaIncorporacao(recusa.linha,lang),antes:originaisRecusados[indice].outerHTML,depois:valores[5+indice].html,falha});
    }
    if (modo.startsWith('recusado-com-campo-') || ['normal','releitura','separador-leitura-retirado','separador-notas-retirado','notas-retiradas'].includes(modo)) {
      const esperado = modo==='releitura' ? jsonRelido : json;
      const d = esperado.incorporacao[lang];
      const mensagemLeitura = 'ER1 navegador: a leitura até ao fim da atribuição difere, incluindo o separador.';
      const conferirLeitura = texto => assert.equal(texto.slice(texto.indexOf(d.leitura),texto.indexOf(d.atribuicao)+d.atribuicao.length),d.leitura+' · '+d.atribuicao,mensagemLeitura);
      if (modo === 'separador-leitura-retirado') {
        assert.throws(()=>conferirLeitura(parse(codigosSemSeparador[lang]).querySelector('p').textContent),erro=>erro.code==='ERR_ASSERTION' && erro.message.startsWith(mensagemLeitura));
        assert.throws(()=>conferirLeitura(textos[0]),erro=>erro.code==='ERR_ASSERTION' && erro.message.startsWith(mensagemLeitura));
        r.plantas.push({nome:'separador-leitura-duas-fontes-'+lang,mensagem:mensagemLeitura,mordeu:true});
      } else conferirLeitura(textos[0]);
      assert.equal(pedidos.filter(p=>p.caminho.endsWith('.json')).length,valores.length);
      assert.equal(valores[4].valor,calculada.value, 'ER1 navegador: a linha calculada sem data não foi atualizada.');
      assert.equal(textos[4].split(lang==='pt'?'calculado por este projeto':'calculated by this project').length-1,1, 'ER1 calculado: a indicação de cálculo tem de aparecer uma vez.');
      assert.equal(valores[0].valor,c.value);assert.equal(valores[0].lido,esperado.incorporacao[lang].data);assert.equal(valores[0].aviso,null);
      assert.equal(valores[1].valor,c.value);assert.equal(valores[1].aviso,esperado.incorporacao[lang].atualizacao);
      assert.equal(textos[0],textos[1].slice(0,-(' · '+esperado.incorporacao[lang].atualizacao).length));
      assert.equal(valores[3].valor,cNotas.value);
      assert.equal(valores[3].lido,jsonNotas.incorporacao[lang].data);
      const notas = [cNotas[lang==='pt'?'source_flag_note':'source_flag_note_en'],cNotas[lang==='pt'?'ressalva':'ressalva_en']].filter(Boolean).join(' ');
      const conferirNotas = () => assert(textos[3].includes(notas), 'ER1 navegador: desapareceram as notas da linha.');
      if(modo==='notas-retiradas') {
        assert.throws(conferirNotas, /ER1 navegador: desapareceram as notas da linha/);
        r.plantas.push({nome:'notas-retiradas-'+lang,mensagem:'ER1 navegador: desapareceram as notas da linha.',mordeu:true});
      } else {
        conferirNotas();
        const mensagem = 'ER1 navegador: falta o separador entre licença e notas.';
        const conferirSeparador = () => assert(textos[3].includes(jsonNotas.incorporacao[lang].atribuicao+' · '+notas), mensagem);
        if (modo==='separador-notas-retirado') {
          assert.throws(conferirSeparador, {message:mensagem});
          r.plantas.push({nome:'separador-notas-retirado-'+lang,mensagem,mordeu:true});
        } else conferirSeparador();
      }
      assert(textos[0].includes(' · '+json.incorporacao[lang].fonte+', '), 'ER1 navegador: falta o separador entre unidade e fonte.');
      if(modo==='releitura')assert.equal(valores[0].lido,diaSeguinte);
    } else {
      assert.equal(valores[1].valor,antigo,`${modo}: o fallback mudou`);assert.equal(valores[1].aviso,null);
      const original = parse(blogue(lang)).querySelectorAll('.oedp-numero').map(n=>n.textContent);
      assert.deepEqual(textos,original,`${modo}: o texto colado não ficou inteiro`);
      if (modo!=='sem-js') r.plantas.push({nome:modo+'-'+lang,mensagem:'O pedido recusado conserva o código colado inteiro.',mordeu:true});
    }
    assert(pedidos.every(p=>p.origem==='<servidor do projeto>' && (p.caminho==='/incorporar.js'||p.caminho===`/livro-razao/${c.id}.json`||p.caminho===`/livro-razao/${c.id}-nao-existe.json`||p.caminho===`/livro-razao/${cNotas.id}.json`||p.caminho===`/livro-razao/${calculada.id}.json`||recusadas.some(c=>p.caminho===`/livro-razao/${c.id}.json`))));
    assert(pedidos.every(p=>p.referer===null && p.metodo==='GET' && p.corpo===null));
    assert.equal(await pagina.locator('#anfitria').textContent(),parse(blogue(lang)).querySelector('#anfitria').textContent);
    if(modo!=='sem-js') assert.deepEqual(acessos,[]);
    assert.equal((await ctx.cookies()).length,0);
    r.casos.push({lang,modo,valores:valores.map(({html,...v})=>v),textos,pedidos,cookies:(await ctx.cookies()).length});
    if(capturar && ['normal','sem-js'].includes(modo)) for(const largura of [390,768,1024,1280,1600]){
      await pagina.setViewportSize({width:largura,height:900});
      const ficheiro=`${pasta}/blogue-${modo}-${lang}-${largura}.png`;
      await pagina.screenshot({path:ficheiro,fullPage:true});
      assert(await pagina.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      r.capturas.push({ficheiro,largura,sha256:createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex')});
    }
    await ctx.close();
  }
  modoAtual='normal';
  // A comparação usa os caracteres que o navegador entrega ao botão de cópia.
  {
    const contexto=await navegador.newContext();
    const pagina=await contexto.newPage();
    const literal='<textarea>&lt;p&gt;<!--planta-->&lt;/p&gt;</textarea>';
    await pagina.setContent(literal);
    const copiado=await pagina.locator('textarea').inputValue();
    assert.equal(copiado,'<p><!--planta--></p>');
    assert.equal(lerPaginaComCodigo(literal).querySelector('textarea').textContent,copiado);
    r.casos.push({lang:'pt',modo:'codigo-literal',comentarioConservado:true,textoCopiado:copiado});
    await contexto.close();
  }
  // O botão é exercido pelos dois caminhos, com sucesso e com recusa do clipboard.
  for(const lang of ['pt','en']){
    const ctx=await navegador.newContext({viewport:{width:390,height:900},reducedMotion:'reduce',colorScheme:'light'});
    await ctx.route('**/*',q=>q.request().url().startsWith(sitio)?q.continue():q.abort());
    const page=await ctx.newPage();
    await page.goto(sitio+routePath('linha',lang,{slug:c.id}),{waitUntil:'networkidle'});
    const campo=page.locator('[data-incorporar-codigo]');const botao=page.locator('[data-incorporar-bloco] button');
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async texto=>{window.copiado=texto;}}}));
    await botao.click();assert.equal(await page.evaluate(()=>window.copiado),codigos[lang]);assert.equal(await botao.textContent(),t(lang).incorporar.copiado);
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('recusado'))}}));
    await botao.click();assert.equal(await botao.textContent(),t(lang).incorporar.selecionado);assert(await campo.evaluate(c=>document.activeElement===c && c.selectionStart===0 && c.selectionEnd===c.value.length));
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined}));
    await botao.click();assert(await campo.evaluate(c=>c.selectionEnd===c.value.length));
    r.casos.push({lang,modo:'copia',clipboard:true,recusadoSeleciona:true,ausenteSeleciona:true});
    await campo.evaluate(c=>{c.setSelectionRange(0,0);c.blur();});
    await botao.evaluate((b,texto)=>{b.textContent=texto;},t(lang).incorporar.copiar);
    if(capturar) for(const largura of [390,768,1024,1280,1600]){
      await page.setViewportSize({width:largura,height:900});
      const bloco=page.locator('[data-incorporar-bloco]');await bloco.scrollIntoViewIfNeeded();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const ficheiro=`${pasta}/recibo-${lang}-${largura}.png`;
      await page.screenshot({path:ficheiro});
      r.capturas.push({ficheiro,largura,sha256:createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex')});
    }
    await ctx.close();
  }
  // V2-e: o excerto mantém a língua no campo de cópia e depois da atualização.
  modoAtual = 'normal';
  const documental = linhas.find(l => l.id === 'pe-despacho-equilibrio');
  assert(documental?.texto_documental);
  for (const lang of ['pt','en']) {
    const ctx = await navegador.newContext(); const page = await ctx.newPage();
    await page.goto(sitio+routePath('linha',lang,{slug:documental.id}),{waitUntil:'networkidle'});
    assert.equal(await page.locator('[data-incorporar-codigo]').getAttribute('lang'),'pt-PT');
    const guardado = await page.locator('[data-incorporar-codigo]').inputValue();
    const campo = parse(guardado).querySelector('a > span');
    assert.equal(campo.getAttribute('lang'),'pt-PT'); assert.equal(campo.textContent,documental.value);
    await page.goto(anfitria+'/'+lang,{waitUntil:'networkidle'});
    const codigo = guardado.replace(/data-oedp-valor="[^"]*"/,'data-oedp-valor="ensaio"').replace(`src="${origemPublica}/incorporar.js"`,`src="${sitio}/incorporar.js"`);
    await page.setContent(codigo,{waitUntil:'networkidle'});
    await page.waitForFunction(() => document.querySelector('.oedp-numero')?.getAttribute('data-oedp-valor') !== 'ensaio');
    const valor = page.locator('.oedp-numero a > span').first();
    assert.equal(await valor.textContent(),documental.value);
    const conferirLingua = lingua => assert.equal(lingua,'pt-PT','V2E incorporação: falta a língua portuguesa do excerto.');
    conferirLingua(await valor.getAttribute('lang'));
    await valor.evaluate(n => n.removeAttribute('lang'));
    const linguaRetirada = await valor.getAttribute('lang');
    assert.throws(() => conferirLingua(linguaRetirada), /V2E incorporação: falta a língua portuguesa/);
    assert.equal(linguaRetirada,null);
    r.casos.push({lang,modo:'texto-documental',linha:documental.id,valor:documental.value,lingua:'pt-PT',atualizado:true});
    r.plantas.push({nome:'lingua-documental-retirada-'+lang,mordeu:true});
    await ctx.close();
  }
} finally {await navegador.close();servidor.close();blog.close();}
if(saida)fs.writeFileSync(saida,JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r,null,2));
