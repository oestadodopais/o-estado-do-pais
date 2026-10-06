/* ER1: cada recibo e cada JSON, com estragos em memória e mensagens exatas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { dadosDaIncorporacao } from '../../src/lib/incorporar.mjs';
import { allClaims } from '../../src/lib/ledger.mjs';
import { routePath, matchPath } from '../../src/lib/routes.mjs';
import { conferirCodigo, lerPaginaComCodigo, tirarCodigoConferido, conferirCors, conferirJson } from '../../scripts/incorporar-do-portao.mjs';
const dist = process.env.OEDP_DIST || 'dist';
const linhas = allClaims();
const resultados = { comando: 'node tests/incorporar/conferir.mjs', recibos: 0, json: 0, plantas: [] };
for (const c of linhas) {
  const doc = JSON.parse(fs.readFileSync(`${dist}/livro-razao/${c.id}.json`, 'utf8'));
  for (const lang of ['pt','en']) {
    assert.deepEqual(conferirJson(doc, c, lang), [], `ER1 JSON: a apresentação de ${c.id} difere da linha (${lang}).`);
    const rota = routePath('linha', lang, {slug:c.id});
    const root = lerPaginaComCodigo(fs.readFileSync(`${dist}${rota}/index.html`, 'utf8'));
    assert.deepEqual(conferirCodigo(root, matchPath(rota)), []);
    resultados.recibos++;
  }
  resultados.json++;
}
const c = linhas.find(c => c.source_url && c.corrections?.some(x => x.kind === 'atualizacao' && x.new_value === c.value));
const rota = matchPath(routePath('linha','pt',{slug:c.id}));
const inteiro = fs.readFileSync(`${dist}${routePath('linha','pt',{slug:c.id})}/index.html`, 'utf8');
function planta(nome, muda, mensagem, html = inteiro) {
  const root = lerPaginaComCodigo(html);
  muda(root);
  assert(conferirCodigo(root, rota).includes(mensagem), `${nome}: falta a mensagem ${mensagem}`);
  assert.throws(() => tirarCodigoConferido(root, rota), {message: new RegExp(mensagem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))});
  resultados.plantas.push({nome,mensagem,mordeu:true});
}
planta('valor-trocado', root => {
  const campo = root.querySelector('textarea');
  campo.set_content(campo.innerHTML.replaceAll(c.value, c.corrections.find(x=>x.new_value===c.value).old_value));
}, 'ER1 código: o pedaço difere da linha, carácter a carácter.');
planta('codigo-em-falta', root=>root.querySelector('textarea').remove(), 'ER1 código: falta o único código do recibo.');
planta('marca-no-paragrafo', root=>root.querySelector('p').setAttribute('data-incorporar-codigo',c.id), 'ER1 código: marca fora do campo do recibo da própria linha.');
planta('codigo-editavel', root=>root.querySelector('textarea').removeAttribute('readonly'), 'ER1 código: marca fora do campo do recibo da própria linha.');
planta('comentario-no-codigo', ()=>{}, 'ER1 código: o pedaço difere da linha, carácter a carácter.',
  inteiro.replace(/(<textarea\b[^>]*>)/, '$1<!--planta-->'));
const mensagemLeitura = 'ER1 código: falta a leitura literal do campo.';
assert(conferirCodigo(parse(inteiro), rota).includes(mensagemLeitura));
resultados.plantas.push({nome:'leitura-nao-literal',mensagem:mensagemLeitura,mordeu:true});
const caminhos = [`/livro-razao/${c.id}.json`, '/livro-razao.json', '/livro-razao.csv', '/incorporar.js', '/', `/livro-razao/${c.id}`];
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const respostas = caminhos.map(caminho=> {
  const headers = {};
  for (const r of vercel.routes) if (r.src && !r.has && new RegExp('^'+r.src+'$').test(caminho)) Object.assign(headers,r.headers);
  return {caminho,estado:200,cors:headers['Access-Control-Allow-Origin']??null,frame:headers['X-Frame-Options']??null};
});
assert.deepEqual(conferirCors(respostas),[]);
for (const [nome, n, campo, valor, mensagem] of [
  ['cors-em-falta',0,'cors',null,`ER1 CORS: ${caminhos[0]} tem estado ou cabeçalho incorreto.`],
  ['cors-em-html',4,'cors','*',`ER1 CORS: ${caminhos[4]} tem estado ou cabeçalho incorreto.`],
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
for(const campo of Object.keys(doc.incorporacao.pt)){
  const copia=structuredClone(doc);copia.incorporacao.pt[campo]+=' alterado';
  const mensagem='ER1 JSON: a apresentação difere da linha.';
  assert(conferirJson(copia,c,'pt').includes(mensagem));
  resultados.plantas.push({nome:'json-'+campo,mensagem,mordeu:true});
}
execFileSync(process.execPath,['scripts/gerar-incorporar.mjs','--conferir']);
const i = process.argv.indexOf('--json');
if (i>0) fs.writeFileSync(process.argv[i+1],JSON.stringify(resultados,null,2)+'\n');
console.log(JSON.stringify(resultados,null,2));
