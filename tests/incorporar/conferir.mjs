/* ER1: cada recibo e cada JSON, com estragos em memória e mensagens exatas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { dadosDaIncorporacao, codigoDaIncorporacao, podeIncorporar } from '../../src/lib/incorporar.mjs';
import { allClaims, eDerivada, camposPorVerificar, documentoDaLinha } from '../../src/lib/ledger.mjs';
import { routePath, matchPath } from '../../src/lib/routes.mjs';
import { conferirExemploNoMetodo, conferirInventarioIncorporacao, provenienciaConfirmada, conferirCodigo, lerPaginaComCodigo, tirarCodigoConferido, conferirCors, conferirJson, codigoEsperado } from '../../scripts/incorporar-do-portao.mjs';
const dist = process.env.OEDP_DIST || 'dist';
const linhas = allClaims();
const resultados = { comando: 'node tests/incorporar/conferir.mjs', recibos: 0, semCodigo: 0, comCodigo: 0, json: 0, plantas: [] };
for (const c of linhas) {
  const doc = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${c.id}.json`, 'utf8'));
  for (const lang of ['pt','en']) {
    assert.deepEqual(conferirJson(doc, c, lang), [], `ER1 JSON: a apresentação de ${c.id} difere da linha (${lang}).`);
    const rota = routePath('linha', lang, {slug:c.id});
    const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${rota}/index.html`, 'utf8'));
    assert.deepEqual(conferirCodigo(root, matchPath(rota)), []);
    resultados.recibos++;
    resultados[provenienciaConfirmada(c) ? 'comCodigo' : 'semCodigo']++;
  }
  resultados.json++;
}
const c = linhas.find(c => c.source_url && c.corrections?.some(x => x.kind === 'atualizacao' && x.new_value === c.value));
const semData = {...linhas.find(c=>!eDerivada(c)&&podeIncorporar(c)),access_date:null};
const mensagemSemData = 'ER1 livro: uma linha não derivada não tem data de leitura.';
for (const lang of ['pt','en']) {
  const caminho = routePath('linha',lang,{slug:semData.id});
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${caminho}/index.html`,'utf8'));
  const doc = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${semData.id}.json`,'utf8'));
  assert.deepEqual(conferirCodigo(root,matchPath(caminho),new Map([[semData.id,semData]])),[mensagemSemData]);
  assert.deepEqual(conferirJson(doc,semData,lang),[mensagemSemData]);
  for (const compor of [dadosDaIncorporacao,codigoDaIncorporacao,codigoEsperado])
    assert.throws(()=>compor(semData,lang),{message:mensagemSemData});
  resultados.plantas.push({nome:'nao-derivada-sem-data-'+lang,mensagem:mensagemSemData,mordeu:true});
}
const rota = matchPath(routePath('linha','pt',{slug:c.id}));
const inteiro = fs.readFileSync(`${dist}${routePath('linha','pt',{slug:c.id})}/index.html`, 'utf8');
function planta(nome, muda, mensagem, html = inteiro) {
  const root = lerPaginaComCodigo(html);
  muda(root);
  assert(conferirCodigo(root, rota).includes(mensagem), `${nome}: falta a mensagem ${mensagem}`);
  assert.throws(() => tirarCodigoConferido(root, rota), {message: new RegExp(mensagem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))});
  resultados.plantas.push({nome,mensagem,mordeu:true});
}
planta('separador-em-falta', root => {const campo=root.querySelector('textarea');campo.set_content(campo.innerHTML.replace('&lt;/span&gt;&lt;/a&gt; · ', '&lt;/span&gt;&lt;/a&gt; '));}, 'ER1 código: o pedaço difere da linha, carácter a carácter.');
planta('marca-por-confirmar', root => root.querySelector('textarea').set_content('[a verificar]'), 'ER1 código: uma marca por confirmar não se incorpora.');
planta('valor-trocado', root => {
  const campo = root.querySelector('textarea');
  campo.set_content(campo.innerHTML.replaceAll(c.value, c.corrections.find(x=>x.new_value===c.value).old_value));
}, 'ER1 código: o pedaço difere da linha, carácter a carácter.');
planta('codigo-em-falta', root=>root.querySelector('textarea').remove(), 'ER1 código: falta o único código do recibo.');
planta('marca-no-paragrafo', root=>root.querySelector('p').setAttribute('data-incorporar-codigo',c.id), 'ER1 código: marca fora do campo do recibo da própria linha.');
planta('codigo-editavel', root=>root.querySelector('textarea').removeAttribute('readonly'), 'ER1 código: marca fora do campo do recibo da própria linha.');
planta('campo-conferido-fora-do-bloco', root => {
  const campo = root.querySelector('[data-incorporar-codigo]');
  const fora = lerPaginaComCodigo(campo.outerHTML).querySelector('textarea');
  fora.setAttribute('id', 'codigo-fora');
  campo.removeAttribute('data-incorporar-codigo');
  campo.set_content('Texto diferente');
  root.querySelector('body').appendChild(fora);
}, 'ER1 código: o campo conferido não é o que o botão copia.');
planta('comentario-no-codigo', ()=>{}, 'ER1 código: o pedaço difere da linha, carácter a carácter.',
  inteiro.replace(/(<textarea\b[^>]*>)/, '$1<!--planta-->'));
const mensagemLeitura = 'ER1 código: falta a leitura literal do campo.';
assert(conferirCodigo(parse(inteiro), rota).includes(mensagemLeitura));
resultados.plantas.push({nome:'leitura-nao-literal',mensagem:mensagemLeitura,mordeu:true});
for (const lang of ['pt', 'en']) {
  const sem = linhas.find(x => /\[a verificar\]/i.test(x.access_date ?? ''));
  const caminho = routePath('linha', lang, {slug:sem.id});
  const html = fs.readFileSync(`${dist}${caminho}/index.html`, 'utf8');
  for (const [nome, muda, mensagem] of [
    ['codigo-sem-proveniencia', root => root.querySelector('[data-incorporar-bloco]').insertAdjacentHTML('beforeend', '<textarea data-incorporar-codigo="'+sem.id+'">[a verificar]</textarea>'), 'ER1 código: proveniência por confirmar oferece código.'],
    ['aviso-em-falta', root => root.querySelector('[data-incorporar-aviso]').remove(), 'ER1 aviso: falta a recusa de incorporação da edição.'],
  ]) {
    const root = lerPaginaComCodigo(html); muda(root);
    assert(conferirCodigo(root, matchPath(caminho)).includes(mensagem));
    resultados.plantas.push({nome:nome+'-'+lang,mensagem,mordeu:true});
  }
}
// ER1-c e ER1-d: isola cada campo, para uma marca não esconder a outra.
for (const lang of ['pt','en']) {
  const caminho = routePath('linha',lang,{slug:c.id});
  const html = fs.readFileSync(`${dist}${caminho}/index.html`,'utf8');
  assert.deepEqual(camposPorVerificar(c), []);
  for (const campo of ['source','access_date','excerpt','source_url','document.title','document.edition','document.locator']) {
    const marcada = campo.startsWith('document.')
      ? {...c,document:{...documentoDaLinha(c),[campo.split('.')[1]]:'[a verificar]'}}
      : {...c,[campo]:'[a verificar]'};
    assert.deepEqual(camposPorVerificar(marcada), [campo], 'A planta tem de marcar só o campo declarado.');
    assert.equal(podeIncorporar(marcada),false);
    assert.equal(codigoDaIncorporacao(marcada,lang),null);
    if(campo==='access_date' && !eDerivada(marcada)) assert.notEqual(dadosDaIncorporacao(marcada,lang).leitura,lang==='pt'?'calculado por este projeto':'calculated by this project', 'ER1 JSON: uma data por confirmar não faz da linha uma calculada.');
    const mensagem = 'ER1 código: proveniência por confirmar oferece código.';
    assert(conferirCodigo(lerPaginaComCodigo(html),matchPath(caminho),new Map([[c.id,marcada]])).includes(mensagem));
    resultados.plantas.push({nome:'marca-isolada-'+campo+'-'+lang,mensagem,mordeu:true});
  }
  const calculada = linhas.find(x => eDerivada(x) && !x.access_date && provenienciaConfirmada(x));
  const caminhoCalculado = routePath('linha',lang,{slug:calculada.id});
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${caminhoCalculado}/index.html`,'utf8'));
  assert.deepEqual(conferirCodigo(root,matchPath(caminhoCalculado)),[]);
  const frase = lang==='pt'?'calculado por este projeto':'calculated by this project';
  assert.equal(root.querySelector('textarea').textContent.split(frase).length-1,1, 'ER1 calculado: a indicação de cálculo tem de aparecer uma vez.');
  root.querySelector('textarea').remove();
  const mensagem = 'ER1 código: falta o único código do recibo.';
  assert(conferirCodigo(root,matchPath(caminhoCalculado)).includes(mensagem));
  resultados.plantas.push({nome:'calculada-sem-data-sem-codigo-'+lang,mensagem,mordeu:true});
}
// ER1-c: licença e notas ficam separadas também no código estático.
for (const lang of ['pt','en']) {
  const notas = linhas.find(x => provenienciaConfirmada(x) && (x[lang==='pt'?'source_flag_note':'source_flag_note_en'] || x[lang==='pt'?'ressalva':'ressalva_en']));
  const caminho = routePath('linha',lang,{slug:notas.id});
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${caminho}/index.html`,'utf8'));
  const campo = root.querySelector('textarea');
  const antes = campo.innerHTML;
  campo.set_content(antes.replace('CC BY 4.0 · &lt;span&gt;', 'CC BY 4.0 &lt;span&gt;'));
  assert.notEqual(campo.innerHTML, antes);
  const mensagem = 'ER1 código: o pedaço difere da linha, carácter a carácter.';
  assert(conferirCodigo(root,matchPath(caminho)).includes(mensagem));
  resultados.plantas.push({nome:'separador-licenca-notas-'+lang,mensagem,mordeu:true});
}
// Lugares lidos de famílias diferentes, incluindo o comparador espanhol.
for (const [id, nomes] of [
  ['custo-unitario-do-trabalho-2025', ['Portugal','Portugal']],
  ['pib-pc-alentejo-2024', ['Alentejo','Alentejo']],
  ['evora-populacao-2021', ['Évora','Évora']],
  ['taxa-de-desemprego-2025-ue', ['União Europeia','European Union']],
  ['despesa-por-funcao-2024-gf01-es', ['Espanha','Spain']],
  ['portugal-concentracao-vab4-2024', ['Portugal','Portugal']],
]) for (const [n,lang] of ['pt','en'].entries()) {
  const caminho = routePath('linha',lang,{slug:id});
  const html = fs.readFileSync(`${dist}${caminho}/index.html`, 'utf8');
  const root = lerPaginaComCodigo(html);
  const campo = root.querySelector('[data-incorporar-codigo]');
  assert(campo.textContent.includes(' · '+nomes[n]+','), `${id}: o lugar da fonte tem de preceder o período.`);
  campo.set_content(campo.innerHTML.replace(' · '+nomes[n]+',', ','));
  const mensagem = 'ER1 código: o pedaço difere da linha, carácter a carácter.';
  assert(conferirCodigo(root, matchPath(caminho)).includes(mensagem));
  resultados.plantas.push({nome:'lugar-em-falta-'+id+'-'+lang,mensagem,mordeu:true});
}
const caminhos = [`/livro-razao/${c.id}.json`, '/livro-razao.json', '/livro-razao.csv', '/incorporar.js', '/', `/livro-razao/${c.id}`];
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const respostas = caminhos.map(caminho=> {
  const headers = {};
  for (const r of vercel.routes) if (r.src && !r.has && new RegExp('^'+r.src+'$').test(caminho)) Object.assign(headers,r.headers);
  // O CORS não vem do vercel.json: a Vercel envia Access-Control-Allow-Origin: * em todas as
  // respostas de ficheiros estáticos (medido a 12.10.2026; §1.184, terceiro acrescento). A simulação
  // modela essa omissão da plataforma, e o verify:deploy confere-a no ar.
  return {caminho,estado:200,cors:'*',frame:headers['X-Frame-Options']??null};
});
assert.deepEqual(conferirCors(respostas),[]);
for (const [nome, n, campo, valor, mensagem] of [
  ['cors-em-falta',0,'cors',null,`ER1 CORS: ${caminhos[0]} tem estado ou cabeçalho incorreto.`],
  ['cors-em-falta-csv',2,'cors',null,`ER1 CORS: ${caminhos[2]} tem estado ou cabeçalho incorreto.`],
  ['moldura-aberta',4,'frame',null,`ER1 moldura: ${caminhos[4]} perdeu SAMEORIGIN.`],
]) {
  const copia = structuredClone(respostas); copia[n][campo]=valor;
  assert(conferirCors(copia).includes(mensagem));
  resultados.plantas.push({nome,mensagem,mordeu:true});
}
// A data da tentativa não confirma o valor. As datas das plantas são geradas.
const base=structuredClone(c);
const dia=new Date(base.access_date);dia.setUTCDate(dia.getUTCDate()+1);
const depois=dia.toISOString().slice(0,10);
for (const lang of ['pt','en']) {
  base.verifications=[{date:depois,result:'igual'}];
  assert.equal(dadosDaIncorporacao(base,lang).data,depois);
  for (const result of ['inacessivel','diverge']) {
    base.verifications=[{date:depois,result}];
    assert.equal(dadosDaIncorporacao(base,lang).data,base.access_date);
    resultados.plantas.push({nome:'data-'+result+'-'+lang,mensagem:'Uma tentativa sem confirmação não avança a data de leitura.',mordeu:true});
  }
  base.verifications=[{date:depois,result:'igual'},{date:base.access_date,result:'igual'}];
  assert.equal(dadosDaIncorporacao(base,lang).data,depois);
}
const doc=JSON.parse(fs.readFileSync(`${dist}/livro-razao/${c.id}.json`,'utf8'));
for (const lang of ['pt','en']) {
  const recusada = linhas.find(x => !podeIncorporar(x));
  const recusado = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${recusada.id}.json`, 'utf8'));
  for (const valor of [doc.incorporacao, null, '']) {
    const mensagem = 'ER1 JSON: proveniência por confirmar oferece incorporação.';
    assert.deepEqual(conferirJson({...recusado, incorporacao: valor}, recusada, lang), [mensagem]);
    resultados.plantas.push({nome:'json-recusado-com-campo-'+(valor === null ? 'null' : valor === '' ? 'vazio' : 'objeto')+'-'+lang,mensagem,mordeu:true});
  }
  const copia = structuredClone(doc); delete copia.incorporacao;
  const mensagem = 'ER1 JSON: falta a incorporação da linha com código.';
  assert.deepEqual(conferirJson(copia,c,lang), [mensagem]);
  resultados.plantas.push({nome:'json-com-codigo-sem-campo-'+lang,mensagem,mordeu:true});
}

for(const campo of Object.keys(doc.incorporacao.pt)){
  const copia=structuredClone(doc);copia.incorporacao.pt[campo]+=' alterado';
  const mensagem='ER1 JSON: a apresentação difere da linha.';
  assert(conferirJson(copia,c,'pt').includes(mensagem));
  resultados.plantas.push({nome:'json-'+campo,mensagem,mordeu:true});
}
execFileSync(process.execPath,['scripts/gerar-incorporar.mjs','--conferir']);
for (const lang of ['pt','en']) {
  const caminho = routePath('metodo',lang);
  const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${caminho}/index.html`,'utf8'));
  assert.deepEqual(conferirExemploNoMetodo(root,lang), []);
  const porta = root.querySelectorAll('#livro-razao a').find(a => a.getAttribute('href').endsWith('/divida-publica-2025'));
  porta.remove();
  const mensagem = 'ER1 Método: falta a porta para o recibo de exemplo da edição.';
  assert(conferirCodigo(root,matchPath(caminho)).includes(mensagem));
  resultados.plantas.push({nome:'metodo-sem-exemplo-'+lang,mensagem,mordeu:true});
}
const inventario = fs.readFileSync('design/especime-v3/INVENTARIO-FRASES.md','utf8');
assert.deepEqual(conferirInventarioIncorporacao(inventario), []);
for (const linha of inventario.split('\n').filter(l => l.startsWith('| `incorporar.') || l.startsWith('| `metodo.exemplo`'))) {
  const chave = linha.split('`')[1];
  for (const lang of ['pt','en']) {
    const partes = linha.split('|'); partes[lang === 'pt' ? 2 : 3] = ' alterada ';
    const mensagem = 'ER1 inventário: falta a cadeia aprovada '+chave+' nas duas edições.';
    assert(conferirInventarioIncorporacao(inventario.replace(linha,partes.join('|'))).includes(mensagem));
    resultados.plantas.push({nome:'inventario-'+chave+'-'+lang,mensagem,mordeu:true});
  }
}
const i = process.argv.indexOf('--json');
if (i>0) fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
console.log(JSON.stringify(resultados,null,2));
