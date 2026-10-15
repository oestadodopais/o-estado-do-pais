/* ER1-e: conta o campo nos JSON e o código nos HTML, por edição construída. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { allClaims, eDerivada } from '../../../../src/lib/ledger.mjs';
import { codigoDaIncorporacao, dadosDaIncorporacao, podeIncorporar } from '../../../../src/lib/incorporar.mjs';
import { routePath, matchPath } from '../../../../src/lib/routes.mjs';
import { conferirJson, conferirCodigo, lerPaginaComCodigo } from '../../../../scripts/incorporar-do-portao.mjs';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
const linhas = allClaims();
const cabecaCodigo = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,cabecaCodigo);
const fonteAnterior = execFileSync('git',['show','8dbe1481:src/lib/incorporar.mjs'],{encoding:'utf8'})
  .replace(/from '([^']+)'/g,(_,caminho)=>`from '${new URL(caminho,new URL('../../../../src/lib/incorporar.mjs',import.meta.url)).href}'`);
const anterior = await import('data:text/javascript;base64,'+Buffer.from(fonteAnterior).toString('base64'));
const aparencia = {base:'8dbe1481',codigosComparados:0,apresentacoesComparadas:0,diferencas:[]};
for (const c of linhas) for (const lang of ['pt','en']) {
  if (codigoDaIncorporacao(c,lang)!==anterior.codigoDaIncorporacao(c,lang)) aparencia.diferencas.push({id:c.id,lang,tipo:'codigo'});
  aparencia.codigosComparados++;
  if (podeIncorporar(c)) {
    if (JSON.stringify(dadosDaIncorporacao(c,lang))!==JSON.stringify(anterior.dadosDaIncorporacao(c,lang))) aparencia.diferencas.push({id:c.id,lang,tipo:'apresentacao'});
    aparencia.apresentacoesComparadas++;
  }
}
assert.deepEqual(aparencia.diferencas,[]);
const r = {aparencia,comando:`node ${pasta}/medir-e.mjs`,cabecaCodigo,edicoes:{},naoDerivadasSemData:linhas.filter(c=>!eDerivada(c)&&!c.access_date).map(c=>c.id)};
for (const lang of ['pt','en']) {
  const metodo = lerPaginaComCodigo(fs.readFileSync(`dist${routePath('metodo',lang)}/index.html`,'utf8'));
  function contagem(chave) {
    const campos = metodo.querySelectorAll(`[data-prova="${chave}"]`);
    assert(campos.length,`Falta a contagem ${chave} na edição ${lang}.`);
    const valores = campos.map(n=>Number(n.textContent.replace(/\s/g,'')));
    assert(valores.every(v=>Number.isInteger(v)&&v===valores[0]));
    return valores[0];
  }
  const n = {jsonComCampo:0,jsonSemCampo:0,recibosComCodigo:0,recibosSemCodigo:0,metodoCompleta:contagem('indexaveis'),metodoPorConfirmar:contagem('divida')};
  for (const c of linhas) {
    const doc = JSON.parse(fs.readFileSync(`dist/livro-razao/${c.id}.json`,'utf8'));
    assert.deepEqual(conferirJson(doc,c,lang),[],`${c.id} (${lang})`);
    const caminho = routePath('linha',lang,{slug:c.id});
    const root = lerPaginaComCodigo(fs.readFileSync(`dist${caminho}/index.html`,'utf8'));
    assert.deepEqual(conferirCodigo(root,matchPath(caminho)),[]);
    const campo = Object.hasOwn(doc,'incorporacao');
    const codigo = !!root.querySelector('[data-incorporar-codigo]');
    assert.equal(campo,codigo,`${c.id}: o JSON e o recibo divergem (${lang}).`);
    n[campo?'jsonComCampo':'jsonSemCampo']++;
    n[codigo?'recibosComCodigo':'recibosSemCodigo']++;
  }
  assert.equal(n.jsonComCampo,n.metodoCompleta);
  assert.equal(n.jsonSemCampo,n.metodoPorConfirmar);
  r.edicoes[lang]=n;
}
assert.equal(r.naoDerivadasSemData.length,0);
fs.writeFileSync(`${pasta}/contagens-e.json`,JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r,null,2));
